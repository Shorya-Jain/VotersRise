# VotersRise

A free, non-commercial guide that helps people in India check the voter list,
register to vote, move their vote when they move city, and know the deadlines.
In English and all 22 scheduled languages.

Not affiliated with the Election Commission of India. All applications happen
on official ECI websites.

## Run it
```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/ (runs the translation check first)
npm run preview
```

## Change the content
1. Edit the English text in `src/i18n/messages/en.json`. Keep sentences short and plain.
2. Re-translate the changed strings (see `scripts/translate/README.md`):
   `scripts/translate/.venv/bin/python scripts/translate/translate.py`
3. `npm run build` fails if any language is missing a string or broke a link or `{placeholder}`.

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

## Licence
Code: [MIT](LICENSE). Guide text, translations and data: [CC BY 4.0](LICENSE-CONTENT.md).
