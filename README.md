# Crew Health Check

An independent, offline-first prototype for astronaut self-check-ins during long-duration missions. It organizes reported symptoms, functional changes, optional measurements, and supporting media into a reviewable record.

> **Prototype status:** This project is an educational demonstration. It is not a medical device, diagnostic service, treatment guide, flight-qualified system, or NASA product. Do not enter real personal health information.

## What it demonstrates

- English-first interface with English, Spanish, French, and Portuguese UI options.
- Mission context: mission phase, gravity environment, and time in mission.
- Structured self-check-in covering symptoms, sleep, well-being, function, and optional observations.
- Optional vital measurements with units and source; blank values stay blank.
- Session-only photo, video, and audio attachments for human review. Files are not interpreted or uploaded.
- Local browser record, JSON export, and clear-data control.
- A lightweight Rust example for deterministic status handling.
- An optional Qiskit scheduling experiment using synthetic tasks only.

## Run the interface

Open `web/index.html` in a modern browser. No server, account, external API, or network connection is required. Saved text check-ins stay in that browser's local storage. Attachments are temporary and disappear when the page is closed or refreshed.

## Crew history across mission stages

Choose **Open sample mission** to explore three fictional check-ins for a lunar mission. The history opens with the example selected. Filter by stage, expand a record to read its details, or export the selection as JSON.

Open or create a local astronaut profile with a fictional code. Re-enter the same code in the same browser to reopen the profile and its mission histories. The most recently saved mission code is prefilled. Use **Switch profile** on a shared device. The code is not a credential and profiles do not synchronize across devices.

Use fictional astronaut and mission codes (for example, `CRW-01` and `DEMO-01`). Use the same pair before, during, and after the mission to keep the preflight reference, in-flight observations, and recovery reports together. Use a new mission code for a subsequent mission.

In the history, select an astronaut and mission pair and optionally filter by stage. Open a record to see its full details. JSON export includes only the selected and filtered records. Deleting a selected history removes all its stages. Earlier records without an astronaut code remain in browser storage and are not assigned to a profile.

Codes group local records. They provide no sign-in or access control. Use fictional data only.

## Documentation

- [Challenge evidence and source register](docs/CHALLENGE_EVIDENCE.md)
- [Clinical workflow](docs/CLINICAL_WORKFLOW.md)
- [Classification scope and permissions](docs/CLASSIFICATIONS_AND_SCOPE.md)
- [Gravity and mission operations](docs/GRAVITY_AND_OPERATIONS.md)
- [Safety, privacy, and validation plan](docs/SAFETY_PRIVACY_VALIDATION.md)
- [Technical architecture](docs/TECHNICAL_ARCHITECTURE.md)
- [Qiskit experiment](docs/QUANTUM_QISKIT.md)
- [Product plan](docs/PRODUCT_MANAGEMENT.md)
- [Interface rationale](docs/DESIGN_UX_UI.md)

## Important boundaries

The prototype records user-entered information; it does not infer conditions from text, measurements, images, video, or voice. Status labels are workflow prompts only and never indicate medical clearance. Mission-specific warning thresholds and responses must come from approved clinical procedures and be configured by qualified mission medical staff. This repository does not embed proprietary diagnostic taxonomies or medication instructions.

## Languages

English is the primary project language. The interface includes English, Spanish, French, and Portuguese. Clinical wording needs review by fluent clinicians before operational use.

## Rights and attribution

Review applicable repository and source terms before reuse. NASA references are cited for factual context only; use of NASA names or materials does not imply endorsement. No NASA insignia is included.
