import en from './messages/en.json';
import type { Locale } from './locales';

export type Messages = typeof en;

const files = import.meta.glob<{ default: unknown }>('./messages/*.json', { eager: true });

/** Locale messages, with English filling any key that is missing or empty. */
export function getMessages(code: string): Messages {
  const own = files[`./messages/${code}.json`]?.default;
  return merge(en, own) as Messages;
}

function merge(base: unknown, over: unknown): unknown {
  if (typeof base === 'string') return typeof over === 'string' && over.trim() ? over : base;
  if (Array.isArray(base)) {
    return base.map((b, i) => merge(b, Array.isArray(over) ? over[i] : undefined));
  }
  if (base && typeof base === 'object') {
    const o = (over && typeof over === 'object' ? over : {}) as Record<string, unknown>;
    return Object.fromEntries(Object.entries(base).map(([k, v]) => [k, merge(v, o[k])]));
  }
  return base;
}

/** Replace `{name}` placeholders. */
export function fill(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Render the tiny markup subset used in messages: **bold** and [text](https://url). */
export function rich(s: string): string {
  return escape(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.+?)\]\((https:\/\/[^\s)]+|\/[^\s)]*)\)/g, '<a href="$2">$1</a>');
}

/** Path for a page in a given locale. English has no prefix. */
export function localePath(locale: Locale, path: string): string {
  return locale.code === 'en' ? path : `/${locale.code}${path}`;
}

/** Long date like "7 October 2026" in the locale, or Indian English if the runtime lacks it. */
export function formatDate(iso: string, locale: Locale): string {
  const [tag] = Intl.DateTimeFormat.supportedLocalesOf([`${locale.code}-IN`, locale.code]);
  return new Intl.DateTimeFormat(tag ?? 'en-IN', { dateStyle: 'long', timeZone: 'UTC' }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}
