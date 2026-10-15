# Contributing

Use Node.js 24.

```sh
npm ci
npm run dev
```

Edit guide text in `src/content/en.json`.
Use ASD Simplified Technical English conventions: short sentences, one instruction per sentence, and consistent terms.
Keep official form names and control labels unchanged.
Link factual changes to an official ECI source or the law.
Update `lastVerified` only after checking the page's facts.

Before opening a pull request:

```sh
npm run check
npm run build
npm run links
```

Describe the change and list the checks you ran. Include a screenshot for layout changes.
Check the page at 360 px wide and with a keyboard.
Do not include voter IDs, Aadhaar numbers, OTPs, or personal documents in issues or screenshots.

Code uses the [MIT licence](LICENSE). Text and data use [CC BY 4.0](LICENSE-CONTENT.md).
