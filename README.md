# SMU IGD Module Planner

An independent, interactive planner for the 12 taught modules in SMU Academy's Industry Graduate Diploma in Generative AI, Large Language Models and AI Governance.

The planner compares 12-, 6-, and 4-month learning sequences, groups related modules, and links back to the official SMU Academy pages.

**Live site:** <https://makoydev.github.io/smu-igd-planner/> (deployed automatically from `main` via GitHub Pages)

> [!IMPORTANT]
> The intake table is a static snapshot verified on **9 August 2026**. Course dates and registration status can change. Always confirm details on the linked official SMU Academy pages before registering.

## Run locally

No build step or dependencies are required. Open `index.html` directly, or serve the folder locally:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

The selected pace is kept in the URL, so you can link someone straight to a specific plan: append `#pace=12`, `#pace=6`, or `#pace=4`.

## Testing

A dependency-free validation script checks the embedded data: script syntax, required module fields, official SMU Academy link format, and that every pace plan schedules all 12 modules exactly once. It also warns when the verified snapshot is more than 60 days old.

```bash
node scripts/validate.js
```

The same script runs in GitHub Actions on every push and pull request (`.github/workflows/validate.yml`).

## Keeping the data fresh

SMU Academy's site is served behind bot protection, so intake data cannot be checked or scraped automatically — updates are manual by design. Two safeguards keep staleness visible:

- The page shows a warning above the intake table once the snapshot is more than 60 days old.
- A weekly GitHub Action (`.github/workflows/reverify-reminder.yml`) opens a reminder issue with a checklist of the 12 official pages once the snapshot is more than 30 days old.

## Share feedback

Classmates can use [GitHub Issues](https://github.com/makoydev/smu-igd-planner/issues) to suggest a feature, report incorrect schedule data, or propose a better module sequence. Please avoid posting student IDs, contact details, or other private information.

## Updating the current snapshot

The app is intentionally self-contained for now. The editable module records are in the `MODULES` object near the bottom of `index.html`; study sequences are in the adjacent `PLANS` object.

When changing an intake:

1. Verify it against the module's official SMU Academy page.
2. Update the module's `intake` and `status` values.
3. Update the `VERIFIED` constant (it fills every visible “verified” date) and any date-specific callout.
4. Run `node scripts/validate.js` and make sure every check passes.
5. Open the app on desktop and mobile widths and test all three pace options.
6. Include the source URL and verification date in the pull request.

## Roadmap toward dynamic updates

- Move module and intake records from the HTML into a validated JSON data file.
- Display a per-record verification date alongside each intake.
- Add filtering for date, delivery format, registration status, and workload.
- Add date-conflict detection between bundled modules in the faster plans.
- Revisit automated schedule checks only if SMU ever provides a permitted data source; their site's bot protection currently rules out both scraping and automated link checks.

## Disclaimer

This is an independent community project. It is not an official SMU timetable, offer letter, or registration system, and it is not affiliated with or endorsed by Singapore Management University.

