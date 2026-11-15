# Technical architecture

The working application is a dependency-free static HTML/CSS/JavaScript workspace. The Rust example remains a separate experiment; it does not execute in the browser. No backend or cloud resource is needed for the demonstration.

| File | Responsibility |
| --- | --- |
| `web/index.html` | Semantic five-area shell |
| `web/styles.css`, `web/favicon.svg` | Responsive identity, focus, print styles |
| `web/i18n.js`, `web/ui-text.js` | English, Spanish, French, Portuguese copy |
| `web/core.js` | Record validation, report contract, longitudinal differences |
| `web/app.js` | Profile/mission selection, drafts, capture, history, import/export |
| `web/planner-core.js` | Task validation, exhaustive optimization, statevector simulator |
| `web/planning.js` | Independent operational planning UI and Qiskit adapter |
| `web/sw.js` | Same-origin application asset cache |
| `mvp/quantum_task_scheduling.py` | Optional external Qiskit verification |

## Persistence

Records retain the existing `crew-health-check.records.v2` key. Profiles use `crew-health-check.profiles.v1`; active selection uses `crew-health-check.active.v1`; drafts use `crew-health-check.drafts.v1`, keyed by Crew ID and mission ID. No migration deletes old entries. Local storage is not secure account storage. Read/write failure blocks saving and displays a recoverable explanatory error; browser storage must be repaired or made available before continuing.

## Report contract

Version 1 uses `format: "crew-health-report"`, `version: 1`, `exportedAt`, `scope: {crewId, missionId}`, and `records`. Each record retains its ID, stage, recordedAt, mission gravity/day/phase, observations, wellbeing, measurements with units, source/time, and requested follow-up. Optional fields remain null or absent. Unknown imported properties are discarded; no imported content is inserted as HTML.

Ground Review accepts at most 2 MB and 500 entries. It rejects unknown versions, invalid units/numbers, mixed crew/mission scopes, and duplicate record IDs. Legacy v2/v3 report envelopes are accepted only if records satisfy the same scope and validation checks. Import never merges into onboard records. Comparisons are recomputed from the latest timestamp in each phase, with no subtraction across mismatched units or absent measurements. Reports are unsigned: structural validation does not establish authenticity.

## Offline and deployment

Service workers require HTTPS or localhost. Initial installation caches the shell and all runtime assets. Navigation falls back to the cached index on network failure. Offline use depends on successful installation and browser retention; browser eviction or a first visit without a network cannot be solved by a static app. Network availability is not ground-link availability. Deploy the contents of `web/` together.

## Future assurance

Operational use would require identity and authorization, encrypted storage, tamper-evident audit, validated device adapters, clinical review, signed releases and backup/recovery procedures. Memory safety in a future Rust core would not by itself establish flight qualification. Media remain session previews only. The planner never reads profile or health storage; task names remain free text, so users must not put sensitive information into task names.
