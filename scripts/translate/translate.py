"""Translate src/i18n/messages/en.json into the 22 scheduled languages with IndicTrans2.

Only strings whose English text changed since the last run are translated
(tracked in src/i18n/.source-hashes.json). Run from the repo root:

    scripts/translate/.venv/bin/python scripts/translate/translate.py            # all locales
    scripts/translate/.venv/bin/python scripts/translate/translate.py --only hi,ta
    scripts/translate/.venv/bin/python scripts/translate/translate.py --qa       # + back-translation report
"""

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MESSAGES = ROOT / "src/i18n/messages"
HASHES = ROOT / "src/i18n/.source-hashes.json"
LOCALES_TS = ROOT / "src/i18n/locales.ts"
GLOSSARY = Path(__file__).with_name("glossary.json")
QA_REPORT = Path(__file__).with_name("qa-report.md")

EN_INDIC = "ai4bharat/indictrans2-en-indic-dist-200M"
INDIC_EN = "ai4bharat/indictrans2-indic-en-dist-200M"
BATCH = 16
QA_THRESHOLD = 35  # chrF below this gets flagged for human review


# ---------- message files ----------

def flatten(obj, prefix=""):
    if isinstance(obj, str):
        yield prefix, obj
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            yield from flatten(v, f"{prefix}.{i}")
    else:
        for k, v in obj.items():
            yield from flatten(v, f"{prefix}.{k}" if prefix else k)


def unflatten_like(template, flat, prefix=""):
    if isinstance(template, str):
        return flat.get(prefix, "")
    if isinstance(template, list):
        return [unflatten_like(v, flat, f"{prefix}.{i}") for i, v in enumerate(template)]
    return {k: unflatten_like(v, flat, f"{prefix}.{k}" if prefix else k) for k, v in template.items()}


def read_locales():
    text = LOCALES_TS.read_text()
    return [(c, it) for c, it in re.findall(r"code: '(\w+)', itCode: '(\w+)'", text) if c != "en"]


def sha(s):
    return hashlib.sha1(s.encode()).hexdigest()[:12]


# ---------- masking ----------
# Protected spans become <IDn> tokens, the placeholder format IndicTrans2 was trained to copy.

KEEP = json.loads(GLOSSARY.read_text())["keep"]
SPAN = re.compile(
    r"\[[^\]]+\]\([^)]+\)"                          # markdown links (all link texts here are domains)
    r"|\{\w+\}"                                      # {placeholders}
    r"|\*\*(?:" + "|".join(map(re.escape, KEEP)) + r")\*\*"  # bold official terms
    r"|(?<![\w.])(?:" + "|".join(map(re.escape, KEEP)) + r")(?![\w])"
    r"|\d+(?:[.,:/]\d+)*%?"                          # numbers
)
TOKEN = re.compile(r"[<\[]\s*id\s*(\d+)\s*[>\]]", re.IGNORECASE)


def mask(s):
    spans = []

    def sub(m):
        spans.append(m.group(0))
        return f"<ID{len(spans)}>"

    masked = SPAN.sub(sub, s)
    masked = masked.replace("**", "")  # bold on ordinary words does not survive translation
    return masked, spans


def unmask(s, spans):
    seen = set()

    def sub(m):
        i = int(m.group(1))
        if 1 <= i <= len(spans):
            seen.add(i)
            return spans[i - 1]
        return ""

    out = TOKEN.sub(sub, s)
    missing = [spans[i - 1] for i in range(1, len(spans) + 1) if i not in seen]
    if missing:  # the model dropped a token: keep the meaning by appending it
        out = f"{out} ({', '.join(missing)})"
    return re.sub(r"\s{2,}", " ", out).strip(), missing


SENTENCE = re.compile(r"(?<=[.!?])\s+(?=[A-Z<\"(])")


# ---------- model ----------

def load(name, device):
    from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

    tok = AutoTokenizer.from_pretrained(name, trust_remote_code=True)
    model = AutoModelForSeq2SeqLM.from_pretrained(name, trust_remote_code=True).to(device).eval()
    return tok, model


def translate(sentences, src, tgt, tok, model, ip, device):
    import torch

    out = []
    for i in range(0, len(sentences), BATCH):
        batch = ip.preprocess_batch(sentences[i : i + BATCH], src_lang=src, tgt_lang=tgt)
        enc = tok(batch, truncation=True, padding="longest", return_tensors="pt").to(device)
        with torch.inference_mode():
            gen = model.generate(**enc, num_beams=4, max_length=256, use_cache=False)
        dec = tok.batch_decode(gen, skip_special_tokens=True, clean_up_tokenization_spaces=True)
        out += ip.postprocess_batch(dec, lang=tgt)
    return out


def translate_strings(strings, tgt, tok, model, ip, device):
    """Translate whole strings sentence by sentence. Returns (translations, problems)."""
    pieces, owners, masks = [], [], []
    for idx, s in enumerate(strings):
        masked, spans = mask(s)
        masks.append(spans)
        for sent in SENTENCE.split(masked):
            pieces.append(sent)
            owners.append(idx)
    done = translate(pieces, "eng_Latn", tgt, tok, model, ip, device)
    joined = [[] for _ in strings]
    for owner, t in zip(owners, done):
        joined[owner].append(t)
    results, problems = [], []
    for idx, parts in enumerate(joined):
        text, missing = unmask(" ".join(parts), masks[idx])
        results.append(text)
        if missing:
            problems.append((idx, missing))
    return results, problems


# ---------- main ----------

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", help="comma-separated locale codes, e.g. hi,ta")
    ap.add_argument("--force", action="store_true", help="retranslate every string")
    ap.add_argument("--qa", action="store_true", help="back-translate and write qa-report.md")
    args = ap.parse_args()

    import torch
    from IndicTransToolkit.processor import IndicProcessor

    device = "mps" if torch.backends.mps.is_available() else "cuda" if torch.cuda.is_available() else "cpu"
    en_tree = json.loads((MESSAGES / "en.json").read_text())
    en = dict(flatten(en_tree))
    hashes = json.loads(HASHES.read_text()) if HASHES.exists() else {}
    locales = read_locales()
    if args.only:
        wanted = set(args.only.split(","))
        locales = [l for l in locales if l[0] in wanted]

    ip = IndicProcessor(inference=True)
    tok, model = load(EN_INDIC, device)
    print(f"device={device}, {len(en)} strings, {len(locales)} locales", flush=True)

    for code, it in locales:
        path = MESSAGES / f"{code}.json"
        current = dict(flatten(json.loads(path.read_text()))) if path.exists() else {}
        old = hashes.get(code, {})
        todo = [k for k, v in en.items() if args.force or not current.get(k) or old.get(k) != sha(v)]
        if not todo:
            print(f"{code}: up to date")
            continue
        out, problems = translate_strings([en[k] for k in todo], it, tok, model, ip, device)
        for k, t in zip(todo, out):
            current[k] = t
        flat = {k: current.get(k, "") for k in en}
        path.write_text(json.dumps(unflatten_like(en_tree, flat), ensure_ascii=False, indent=2) + "\n")
        hashes[code] = {k: sha(v) for k, v in en.items()}
        HASHES.write_text(json.dumps(hashes, indent=2, sort_keys=True) + "\n")
        print(f"{code}: translated {len(todo)} strings, {len(problems)} with dropped terms", flush=True)
        for idx, missing in problems:
            print(f"   {todo[idx]}: re-added {missing}")

    if args.qa:
        write_qa(en, locales, ip, device)


def write_qa(en, locales, ip, device):
    from sacrebleu.metrics import CHRF

    chrf = CHRF()
    tok, model = load(INDIC_EN, device)
    lines = [
        "# Translation QA report",
        "",
        "Each string was translated back to English and compared with the source (chrF, 0 to 100).",
        f"Strings scoring below {QA_THRESHOLD} are listed for a native speaker to check first.",
        "A low score does not always mean a bad translation, and a high score does not prove a good one.",
        "",
        "| Language | Median chrF | Flagged |",
        "|---|---|---|",
    ]
    details = []
    for code, it in locales:
        flat = dict(flatten(json.loads((MESSAGES / f"{code}.json").read_text())))
        keys = list(en)
        back = translate([flat[k] for k in keys], it, "eng_Latn", tok, model, ip, device)
        scores = [chrf.sentence_score(b, [en[k]]).score for k, b in zip(keys, back)]
        flagged = sorted((s, k, b) for s, k, b in zip(scores, keys, back) if s < QA_THRESHOLD)
        median = sorted(scores)[len(scores) // 2]
        lines.append(f"| {code} | {median:.0f} | {len(flagged)} |")
        if flagged:
            details += ["", f"## {code}", ""]
            details += [f"- `{k}` ({s:.0f}): back-translation: “{b}”" for s, k, b in flagged]
        print(f"qa {code}: median {median:.0f}, flagged {len(flagged)}", flush=True)
    QA_REPORT.write_text("\n".join(lines + details) + "\n")
    print(f"wrote {QA_REPORT.relative_to(ROOT)}")


if __name__ == "__main__":
    sys.exit(main())
