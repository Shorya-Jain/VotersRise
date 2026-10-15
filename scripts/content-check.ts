// Structural writing checks only; this is not an ASD-STE100 conformance checker.
import { readFileSync } from 'node:fs';

const messages = JSON.parse(readFileSync(new URL('../src/content/en.json', import.meta.url), 'utf8'));
const segmenter = new Intl.Segmenter('en', { granularity: 'sentence' });
const errors: string[] = [];

function check(value: unknown, key = '') {
  if (value && typeof value === 'object') {
    for (const [name, child] of Object.entries(value)) check(child, key ? `${key}.${name}` : name);
    return;
  }
  if (typeof value !== 'string') return;
  const text = value.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*/g, '');
  if (/\b(?:\w+n['’]t|it['’]s|you['’](?:re|ve|ll|d)|we['’](?:re|ve|ll|d)|that['’]s)\b/i.test(text)) {
    errors.push(`${key}: do not use contractions`);
  }
  const procedural = /^(check\.(ways|notFound)|register\.(steps|who|timing|warning)|move\.(steps|shift|stay|tips|decideNote)|common\.otpWarning|deadlines\.rule)(\.|$)/.test(key);
  const limit = procedural ? 20 : 25;
  const sentences = [...segmenter.segment(text)];
  if (sentences.length > 6) errors.push(`${key}: paragraph has more than six sentences`);
  for (const { segment } of sentences) {
    const count = segment.trim().split(/\s+/).filter(Boolean).length;
    if (count > limit) errors.push(`${key}: ${count} words (limit ${limit}): ${segment.trim()}`);
  }
}
check(messages);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Content structure: sentence lengths, paragraph lengths, and contractions pass. Dictionary review is separate.');
