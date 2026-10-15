# Machine translation (IndicTrans2)

Translates `src/i18n/messages/en.json` into the 22 scheduled languages with
[IndicTrans2](https://github.com/AI4Bharat/IndicTrans2) (AI4Bharat, MIT licence), running locally.

## One-time setup
```sh
python3 -m venv scripts/translate/.venv
scripts/translate/.venv/bin/pip install -r scripts/translate/requirements.txt
```
The models need a free Hugging Face account. Accept the terms on
[en-indic-dist-200M](https://huggingface.co/ai4bharat/indictrans2-en-indic-dist-200M) and
[indic-en-dist-200M](https://huggingface.co/ai4bharat/indictrans2-indic-en-dist-200M), then run
`scripts/translate/.venv/bin/hf auth login`. The first run downloads about 1 GB.

## Use
```sh
scripts/translate/.venv/bin/python scripts/translate/translate.py             # changed strings only
scripts/translate/.venv/bin/python scripts/translate/translate.py --only hi   # one language
scripts/translate/.venv/bin/python scripts/translate/translate.py --qa        # also write qa-report.md
```
- Terms in `glossary.json` (form names, EPIC, BLO, domains), numbers, links and `{placeholders}`
  are protected so the model cannot change them.
- `src/i18n/.source-hashes.json` records which English text each translation came from, so only
  edited strings are retranslated.
- `qa-report.md` translates every string back to English and lists the ones that drifted most.
  Give those to native-speaker reviewers first.
