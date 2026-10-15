# Simplified Technical English

Use [ASD-STE100 Issue 9](https://www.asd-ste100.org/assets/files/ASD-STE100_ISSUE9.pdf)
as the writing reference. The [official website](https://www.asd-ste100.org/) explains the standard.

The current text uses STE writing conventions. Full dictionary and terminology review is pending.
The project does not claim ASD certification or full conformance.

## Project writing rules

- Use no more than 20 words per sentence in procedures and warnings.
- Use no more than 25 words per sentence in descriptions.
- Give one instruction per sentence. Use the command form: “Select Form 6.”
- Give a necessary condition before its instruction.
- Use the active voice for instructions.
- Do not use contractions, idioms, or figurative phrases such as “move your vote” or “the list is frozen”.
- Use one word for each meaning. Use “select” for controls and “enter” for typed input.
- Keep paragraphs to six sentences or fewer.
- Keep source titles, official control labels, and legal titles accurate.
- Check vocabulary, meaning, and part of speech against the official dictionary.

## Project terminology for review

These are domain terms, not additions to the ASD dictionary. Review them under the standard's technical-name rules.

- **Voter list**: the electoral roll. Define “electoral roll” when it first appears in a guide.
- **Voter registration**: the person's entry on the voter list.
- **Voter ID card**: the Electors Photo Identity Card (EPIC).
- **EPIC number**: the identifier on the voter ID card.
- **Form 6**: the official form for new general voter registration.
- **Form 8**: the official form used for an address change and other specified changes.
- **BLO**: Booth Level Officer. Define the full title before the abbreviation.
- **ERO**: Electoral Registration Officer. Define the full title before the abbreviation.
- **OTP**: one-time password.
- **Captcha code**: the code shown on an official form to check that a person is using it.
- **Qualifying date**: a statutory date used to determine age eligibility. It is not an application deadline.
- **Special Intensive Revision (SIR)**: an official check and revision of the voter list.
- **Normal place of residence**: a reader-facing explanation of the legal term “ordinary residence”. The ERO decides disputed cases.

## Automated checks and their limits

`npm run check:content` checks English sentences for length and common contractions.
It applies the 20-word limit to procedural sections and warnings, and the 25-word limit elsewhere.
It also flags paragraphs with more than six sentences.
Its word count is conservative; it is not an implementation of all ASD-STE100 counting rules.
Manual review must cover vocabulary, technical-name classification, grammar, one action per instruction, and legal meaning.
Do not mark a page compliant based only on a passing script.
