# Contribute to VotersRise

Thank you for helping people use the voter registration system in India.
You can report an error, improve an instruction, review a source, or change the code.

## Set up the project

Use Node.js 22.12 or later. Node.js 24 LTS is the recommended version.

```sh
git clone https://github.com/Shorya-Jain/VotersRise.git
cd VotersRise
npm ci
npm run dev
```

Create a branch for your change. Keep each pull request focused on one task.

## Report a problem

Open a [GitHub issue](https://github.com/Shorya-Jain/VotersRise/issues).
Include the page URL, the problem, and the expected result.
For a factual correction, include a link to the official source and its publication date.

Do not include voter ID numbers, Aadhaar numbers, phone numbers, OTPs, or personal documents.
Remove personal information from screenshots.
For a security problem, use GitHub private vulnerability reporting if it is available.
Do not publish exploit details or personal information in a public issue.

## Write instructions

Edit `src/content/en.json`. The repository stores the English source text.
Use the writing rules in [STE_STYLE.md](STE_STYLE.md).
Use ASD-STE100 Issue 9 as the reference for writing rules and approved vocabulary.
Keep the names of official forms and portal controls unchanged so readers can find them.
Define technical terms before use. Use one term for each meaning.

The automated content check tests sentence length and contractions.
It does not check all dictionary meanings, parts of speech, technical terms, or factual accuracy.
A qualified reviewer must check these before the project claims full ASD-STE100 conformance.

## Check facts and dates

Use ECI forms, ECI orders, state Chief Electoral Officer websites, PIB releases, or the law.
Add the source to the page's `sources` list.
Update `lastVerified` only after you check all claims on that page.
Do not present an estimated election period as an application deadline.
Do not tell readers that a pending application permits them to vote.

Schedules in `src/data/elections.json` are unpublished pending verification.
Before setting `publishSchedules` to `true`:

1. Check every entry against the latest official notice, including later amendments.
2. Replace news reports and social media links with direct official evidence.
3. Add sources for expected election periods and each stated schedule.
4. Check that all claim periods and final publication dates are complete and in order.
5. Update `lastVerified` and obtain an independent review in the pull request.

An elapsed scheduled date does not prove that an event occurred.
Rebuild the static site when a schedule changes. Its date categories do not update in the browser.

## Language links

The existing language menu opens pages through Google Translate.
This contribution does not add or maintain translation files.
Keep official control labels and form names clear in the English source.

## Code and accessibility

Keep the site static and usable without JavaScript.
Keep fonts local. Do not add advertising, analytics, or third-party scripts.
Preserve keyboard navigation, visible focus, the skip link, and semantic headings.
Check narrow screens at 360 px and both light and dark themes.
Keep tap targets at least 44 px high.

## Validate your change

```sh
npm run check
npm run build
npm run links
npm run test:release
```

`npm run links` checks local links only. Check official external links manually.
`npm run test:release` checks generated HTML for expected pages, metadata, assets, and unwanted scripts.
Explain the change, link its sources, and list the checks you ran in the pull request.
Add screenshots for visible layout changes.
Do not deploy a contribution as part of a pull request.

## Licences

Code contributions use the [MIT licence](LICENSE).
Guide text, data, and translations use [CC BY 4.0](LICENSE-CONTENT.md).
Submit only material that you have permission to contribute under these licences.
