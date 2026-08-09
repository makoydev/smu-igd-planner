# SMU IGD Module Planner

An independent, interactive planner for the 12 taught modules in SMU Academy's Industry Graduate Diploma in Generative AI, Large Language Models and AI Governance.

The planner compares 12-, 6-, and 4-month learning sequences, groups related modules, and links back to the official SMU Academy pages.

> [!IMPORTANT]
> The intake table is a static snapshot verified on **9 August 2026**. Course dates and registration status can change. Always confirm details on the linked official SMU Academy pages before registering.

## Run locally

No build step or dependencies are required. Open `index.html` directly, or serve the folder locally:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Share feedback

Classmates can use [GitHub Issues](https://github.com/makoydev/smu-igd-planner/issues) to suggest a feature, report incorrect schedule data, or propose a better module sequence. Please avoid posting student IDs, contact details, or other private information.

## Updating the current snapshot

The app is intentionally self-contained for now. The editable module records are in the `MODULES` object near the bottom of `index.html`; study sequences are in the adjacent `PLANS` object.

When changing an intake:

1. Verify it against the module's official SMU Academy page.
2. Update the module's `intake` value.
3. Update every visible “verified” date and any date-specific callout.
4. Open the app on desktop and mobile widths and test all three pace options.
5. Include the source URL and verification date in the pull request.

## Roadmap toward dynamic updates

- Move module and intake records from the HTML into a validated JSON data file.
- Display a per-record verification date and a clear stale-data warning.
- Add automated link and data-shape checks in GitHub Actions.
- Investigate a scheduled updater only if SMU provides a stable permitted data source; keep human review before publishing schedule changes.
- Add filtering for date, delivery format, registration status, and workload.
- Add tests for plan completeness, duplicate modules, and date conflicts.

## Disclaimer

This is an independent community project. It is not an official SMU timetable, offer letter, or registration system, and it is not affiliated with or endorsed by Singapore Management University.

