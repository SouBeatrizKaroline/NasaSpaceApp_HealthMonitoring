# Crew Health Check

**A clear next step for crew health, before, during, and after a mission.**

An independent Space Apps prototype for recording observations onboard and preparing a structured review on the ground. The workspace starts empty: the presenter enters observations during the demonstration. There is no preloaded mission or invented patient history.

## Run the demo

No build or runtime packages are required. From the repository root:

```sh
python -m http.server 8000 --directory web
```

Open **http://localhost:8000**. For hosting, publish `web/` on HTTPS (use `web` as the Vercel root directory). The interface uses only local assets and system fonts. Wait for the offline-ready message after the first online load, then reload once before disconnecting. First-time remote access cannot work without downloading the application. Browser storage and cached assets must be retained.

Opening `web/index.html` directly can display the interface, but file-origin persistence is browser-dependent and service-worker caching is unavailable. Use localhost or HTTPS for acceptance testing.

## The mission journey

| Area | Working behavior |
| --- | --- |
| **Today** | Open a local Crew ID and mission; see current scope, phase, mission day when recorded, last saved entry, and Start/Continue check-in. |
| **Check-in** | Four steps: context, observations, optional measurements, and review. Drafts are saved per crew/mission. Blank readings remain absent. |
| **Mission History** | Latest Preflight, In flight, and Recovery references; descriptive numerical differences; missing stages; expandable records; scoped JSON export. |
| **Ground Review** | Import the application's JSON report, validate it before display, inspect the same observations and comparisons, retry invalid imports. Imported data stays in memory. |
| **Task Planning** | Enter operational tasks; compare exhaustive classical optimization with a browser quantum statevector simulation; export input and import a matching Qiskit result. |

English is the default. Spanish, French, and Portuguese cover the changed journeys. Report field names and units remain stable across languages; user-entered observations are not translated.

## A two-minute presentation script

1. “I will enter a local Crew ID and mission code. These identify records on this browser; they are not login credentials.”
2. “Today shows the next action. I will record a preflight observation and one measurement, leaving the other measurements blank.” Enter non-sensitive test observations chosen by the presenter.
3. “The review step lets me check the context and source before saving. Saved onboard means the browser stored this entry.”
4. “I will record an in-flight observation with its gravity context. Mission History compares it with the available preflight reference and explicitly shows that recovery has not been recorded.”
5. “I will export this mission report and open that file in Ground Review. No transmission is implied: this is a manual, validated file handoff.”
6. “Task Planning is separate. I will enter operational tasks and compare the exact classical schedule with a local quantum simulation. No health records enter the planning file.”

## Data and privacy

Crew IDs group **local browser profiles**, not authenticated accounts. Anyone with access to this browser profile can open them. Records and drafts are unencrypted local storage; there is no identity verification, server, synchronization, telemetry, or medical record service. Use non-sensitive test observations only. Clearing site storage removes local history. Export before clearing it.

Two Crew IDs and two mission codes have separate histories. The active selection and drafts survive reload. Earlier records with IDs remain compatible; older unassigned records are preserved and can be downloaded as a legacy archive, which is not a Ground Review report.

Photos, video, and audio can be previewed during the measurement step. They are temporary, are not interpreted, and are not included in saved records or exports. Reports preserve values, units, source, measurement time, gravity context, and observations. `Saved onboard`, `Ready to export`, and `Report exported` describe local workflow actions; the app does not claim ground delivery or receipt.

## Verification

```sh
node --test tests/core.test.cjs
node tests/browser.cjs
```

The second command requires Microsoft Edge on Windows, free localhost ports 8176/9336, and permission to connect to its local debugging endpoint. It uses a separate browser profile and writes test artifacts under ignored `test-output/`. See [validation results and remaining checks](docs/VALIDATION.md) for what actually ran in this delivery.

## Implemented and future work

Implemented: local capture, drafts, scoped history, structured export/import, four interface languages, browser simulation, and a Qiskit input/result adapter. The optional Python Qiskit environment must be installed and verified separately.

Future: authenticated access, encryption and audit trails, approved ground synchronization, sensor integration, durable media storage, clinician-reviewed terminology, and mission-specific procedures. The Rust example is separate from the browser application. This prototype does not diagnose, prescribe treatment, infer health from media, or provide medical clearance. It is not flight-qualified or clinically validated, and is not a NASA product or endorsement.

## Documentation

- [Visual identity and interaction decisions](docs/DESIGN_UX_UI.md)
- [Architecture and record contract](docs/TECHNICAL_ARCHITECTURE.md)
- [Qiskit reproduction and simulation scope](docs/QUANTUM_QISKIT.md)
- [Validation record](docs/VALIDATION.md)
- [Challenge evidence](docs/CHALLENGE_EVIDENCE.md)
- [Gravity and operations](docs/GRAVITY_AND_OPERATIONS.md)
- [Classification scope and permissions](docs/CLASSIFICATIONS_AND_SCOPE.md)
- [Clinical workflow](docs/CLINICAL_WORKFLOW.md)
- [Submission considerations and published sleep research](docs/AWARDS_AND_SUBMISSION.md)

NASA references provide research context. No agency insignia or implied certification is used. Public cohort sleep statistics are separated from personal history and are not individual diagnostic thresholds.
