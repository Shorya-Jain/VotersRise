# VotersRise

A free, non-commercial guide that helps Indian voters check the voter list, register (Form 6), move their vote (Form 8) and know the deadlines. Written in English; visitors can read it in 20 Indian languages through Google Translate's website proxy (Bodo and Kashmiri are not supported by Google).

## Constraints
- **Cheap and light.** Static Astro site on the Cloudflare free tier. No client JS (there is none today; keep it that way unless a feature truly needs it). No paid services, no trackers, no third-party requests.
- **Mobile first.** Budget Android phones on slow networks. Tap targets ≥ 44px, single column, check at 360px wide.
- **No invented facts.** Every procedure, date and number must come from an ECI form, guideline, press note or the law, and be listed in the page's `sources`. If you cannot verify something, leave it out and say so. Update `lastVerified` when you re-check a page.
- **English only in the repo.** All text lives in `src/content/en.json`. Translation happens at view time via Google Translate (links in `LanguageList.astro`); there are no translation files or models.
- Use ASD Simplified Technical English conventions: short sentences, one instruction per sentence, and consistent terms.
- Mark text that must not be translated (brand, domains, language names) with `translate="no"`.

## Layout
- `src/content/en.json`: all page text. `**bold**` and `[text](https://url)` are the only markup. `{name}` placeholders.
- `src/lib/languages.ts`: languages offered in the Google Translate selector, and the proxy URL builder.
- `src/lib/text.ts`: `rich()`, `fill()`, `formatDate()`.
- `src/data/elections.json`: upcoming elections and SIR schedules (validated in `elections.ts`).
- `src/pages/*.astro`: one file per page.
- `site` in `astro.config.mjs` must be the real public URL, or the translation links break.

## Commands
- `npm run dev` / `npm run build` / `npm run preview`
- `npm run check` (types), `npm run links` (link checker on dist/)
- Deploys are automatic: Cloudflare Pages builds and deploys every push to `main` (https://votersrise.pages.dev). `main` is protected, so changes go through a PR with passing CI.
