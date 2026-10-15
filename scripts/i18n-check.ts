// Fails the build if any locale file is missing, has missing or extra keys, has empty
// strings, changed a {placeholder} or a link URL, or has unpaired **bold** markers.
// (Bold on ordinary words may be dropped in translation; that is fine.)
import { readFileSync, existsSync } from 'node:fs';
import { locales } from '../src/i18n/locales.ts';

const dir = new URL('../src/i18n/messages/', import.meta.url);
const read = (code: string) => JSON.parse(readFileSync(new URL(`${code}.json`, dir), 'utf8'));

function leaves(obj: unknown, prefix = ''): Map<string, string> {
  const out = new Map<string, string>();
  if (typeof obj === 'string') out.set(prefix, obj);
  else if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      for (const [p, s] of leaves(v, prefix ? `${prefix}.${k}` : k)) out.set(p, s);
    }
  }
  return out;
}

const tokens = (s: string) => ({
  placeholders: [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(','),
  urls: [...s.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]).sort().join(','),
});

const en = leaves(read('en'));
const errors: string[] = [];

for (const { code } of locales.slice(1)) {
  if (!existsSync(new URL(`${code}.json`, dir))) {
    errors.push(`${code}: messages/${code}.json is missing`);
    continue;
  }
  const loc = leaves(read(code));
  for (const [key, src] of en) {
    const t = loc.get(key);
    if (t === undefined) { errors.push(`${code}: missing ${key}`); continue; }
    if (!t.trim()) { errors.push(`${code}: empty ${key}`); continue; }
    const a = tokens(src), b = tokens(t);
    for (const k of ['placeholders', 'urls'] as const) {
      if (a[k] !== b[k]) errors.push(`${code}: ${key} ${k} differ (en: ${a[k]} / ${code}: ${b[k]})`);
    }
    if ((t.match(/\*\*/g) ?? []).length % 2) errors.push(`${code}: ${key} has unpaired **`);
  }
  for (const key of loc.keys()) if (!en.has(key)) errors.push(`${code}: unknown key ${key}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  console.error(`\ni18n-check: ${errors.length} problem(s)`);
  process.exit(1);
}
console.log(`i18n-check: ${locales.length} locales, ${en.size} strings each, all good`);
