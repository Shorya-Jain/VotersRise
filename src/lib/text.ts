import content from '../content/en.json';

export const m = content;

/** Replace `{name}` placeholders. */
export function fill(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (match, k) => (k in vars ? String(vars[k]) : match));
}

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Render the tiny markup subset used in content: **bold** and [text](https://url). */
export function rich(s: string): string {
  return escape(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.+?)\]\((https:\/\/[^\s)]+|\/[^\s)]*)\)/g, '<a href="$2" translate="no">$1</a>');
}

/** Long date like "7 October 2026". */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'long', timeZone: 'UTC' }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}
