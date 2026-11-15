# Technical Architecture

## Demonstration architecture

A static web interface supports low-complexity local use. The demo has no account, backend, analytics, external fonts, remote processing, or third-party runtime dependencies.

- `web/index.html`: semantic interface, language selector, forms, and media input.
- `web/styles.css`: responsive high-contrast layout and focus states.
- `web/app.js`: translations, validation, local records, export, and session-only media previews.
- `mvp/src/main.rs`: small standard-library Rust example for deterministic workflow-state handling.
- `mvp/anamnesis_nanda_engine.json`: generic question schema; not a licensed terminology bundle.
- `mvp/quantum_triage_qubo.py`: optional synthetic scheduling experiment, separate from health-record handling.

## Language choice

Rust is used for the small deterministic core example because it provides memory-safety guarantees without requiring a garbage-collected runtime and can target constrained platforms. This is a prototype choice, not a flight-software recommendation. A qualified architecture would select toolchains and assurance evidence based on the vehicle, hardware, interfaces, and required safety level.

The browser demo uses plain HTML, CSS, and JavaScript to remain easy to inspect and run offline. It is not flight-qualified.

## Data and offline behavior

The browser's local storage is suitable only for synthetic demos. A mission deployment would require a secure, encrypted, access-controlled record service with an approved synchronization and audit design. Every observation should include timestamp, units, data source, software version, and correction provenance.

## Sensor and media interfaces

Sensor values are manually entered in this demo. Camera, microphone, and sensor feeds are not analyzed. Future hardware interfaces must define calibration, failure detection, time alignment, data quality, power use, electromagnetic compatibility, and human confirmation.

## Security design targets for future work

Use least privilege, signed releases, dependency pinning, reproducible builds, secure update procedures, tamper-evident logs, encryption, secure boot where available, and explicit offline recovery. These are requirements to investigate, not implemented or verified properties of this prototype.
