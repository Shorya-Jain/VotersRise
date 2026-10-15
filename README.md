# VotersRise

A free, non-commercial guide that helps people in India check the voter list,
register to vote, move their vote when they move city, and know the deadlines.
Written in English, readable in 20 Indian languages through Google Translate.

Not affiliated with the Election Commission of India. All applications happen
on official ECI websites.

## Run it
```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
npm run preview
```

## Change the content
1. Edit the English text in `src/content/en.json`. Keep sentences short and plain.
2. `npm run build` and check the page.

Translations are not stored here: the language menu opens each page through Google
Translate's website proxy (`<host>.translate.goog`). That only works on the public site,
so keep `site` in `astro.config.mjs` set to the real URL.

Every fact must come from an official source listed on the page. See `CLAUDE.md`.

## Update deadlines
Edit `src/data/elections.json` (checked by `src/data/elections.ts`): add
`lastDateOfNominations` when ECI announces an election, and update SIR dates
from ECI press notes. Rebuild and deploy.

## Deploy (Cloudflare, free tier)
```sh
npx wrangler login   # once
npm run deploy
```

## Contribute
See [CONTRIBUTING.md](CONTRIBUTING.md).

## Licence
Code: [MIT](LICENSE). Guide text, translations and data: [CC BY 4.0](LICENSE-CONTENT.md).
