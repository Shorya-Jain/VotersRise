# VotersRise

A free, independent guide for voters in India.
Use it to check your name on the voter list, register to vote, or change your registered address.
Applications take place on official Election Commission of India (ECI) websites.
VotersRise is not part of ECI or a political party.

The English instructions use ASD Simplified Technical English writing conventions.
Full dictionary and terminology review is pending. See [STE_STYLE.md](STE_STYLE.md).
The existing language menu opens pages through Google Translate.

## Run locally

Use Node.js 22.12 or later. Node.js 24 LTS is recommended.

```sh
npm ci
npm run dev        # http://localhost:4321
npm run check      # Astro and TypeScript checks
npm run build      # content checks and static build in dist/
npm run links      # local links in dist/
npm run test:release
npm run preview
```

## Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, source checks, writing rules, and pull requests.
Edit English text in `src/content/en.json`.
Use official sources for every procedure, requirement, and deadline.
Do not put personal voter data in this repository or its issues.

## Public release checks

The October 2026 review fixed these repository problems:

- The layout contained developer pairing metadata and a client script. Both are removed, with the Reticle dependency.
- Some instructions used long sentences, figurative language, and inconsistent terms. They now use STE writing conventions.
- Address guidance could imply that travel plans determined the registration address. It now refers to normal residence.
- Schedule data included secondary sources and incomplete dates. It is now excluded from public pages pending verification.
- The local link command skipped every URL and reported success after checking zero links. It now checks local pages, assets, and fragments.
- The project had no contribution guide or CI workflow. Both are now included.

Before a public launch:

1. Have an election-domain reviewer check the complete guides and their current official sources.
2. Have an STE reviewer check dictionary usage, grammar, and the project terminology.
3. Confirm the production hostname in `astro.config.mjs` and `public/robots.txt`.
   The repository currently uses `https://votersrise.workers.dev`; Cloudflare may assign a different Workers hostname.
4. Check external official links, keyboard use, and the deployed security headers.
5. If schedules are required at launch, complete the verification steps in CONTRIBUTING.md before enabling them.

The local checks do not prove full STE conformance, legal accuracy, or accessibility compliance.
The site can operate without publishing its unverified schedule data.

## Update schedules

Working data is in `src/data/elections.json`. `publishSchedules` is `false`.
The public deadlines page directs readers to ECI rather than showing these unverified dates.
Do not enable schedules until all entries have current official evidence and independent review.
The schema rejects impossible dates, missing sources, non-government source URLs, and incomplete schedules when publication is enabled.
Rebuild after any schedule update. Date categories are calculated at build time.

## Deploy to Cloudflare

```sh
npx wrangler login
npm run deploy
```

Use the correct production hostname before building.
The repository contains no advertising, analytics, voter data collection, or third-party client scripts.
The language menu links to Google Translate. Google receives the page text when a visitor uses those links.
Cloudflare and official external sites have their own data handling practices.
`public/_headers` applies security headers to the static deployment; confirm them after deployment.

## Licence

Code: [MIT](LICENSE).
Guide text, translations, and data: [CC BY 4.0](LICENSE-CONTENT.md).
