# VotersRise

A free, non-commercial guide that helps Indian voters check the voter list, register (Form 6), move their vote (Form 8) and know the deadlines. English plus the 22 scheduled languages.

## Constraints
- **Cheap and light.** Static Astro site on the Cloudflare free tier. No client JS (there is none today; keep it that way unless a feature truly needs it). No paid services, no trackers, no third-party requests.
- **Mobile first.** Budget Android phones on slow networks. Tap targets ≥ 44px, single column, check at 360px wide.
- **No invented facts.** Every procedure, date and number must come from an ECI form, guideline, press note or the law, and be listed in the page's `sources`. If you cannot verify something, leave it out and say so. Update `lastVerified` when you re-check a page.
- **English is the source of truth.** Edit only `src/i18n/messages/en.json`, then run the translation script. Do not hand-edit other locale files unless a native speaker supplied the fix (and then leave the hash alone so it is not overwritten).
- Write English in plain language: short sentences, common words. It translates much better.

## Layout
- `src/i18n/locales.ts`: the 23 locales. `reviewed: false` shows the machine-translation notice.
- `src/i18n/messages/*.json`: all page text. `**bold**` and `[text](https://url)` are the only markup. `{name}` placeholders.
- `src/data/elections.json`: upcoming elections and SIR schedules (validated in `elections.ts`).
- `src/pages/[...locale]/*.astro`: one file per page, built for every locale.
- `scripts/i18n-check.ts`: runs before every build; fails on missing keys, broken placeholders or URLs.
- `scripts/translate/`: IndicTrans2 machine translation and back-translation QA.

## Commands
- `npm run dev` / `npm run build` / `npm run preview`
- `npm run check` (types), `npm run links` (link checker on dist/)
- `scripts/translate/.venv/bin/python scripts/translate/translate.py [--only hi,ta] [--qa]`
- `npm run deploy` (Cloudflare, needs `npx wrangler login` once)
