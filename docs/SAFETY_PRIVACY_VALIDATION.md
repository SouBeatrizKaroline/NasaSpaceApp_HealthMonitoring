# Safety, Privacy, and Validation

## Current limitations

This is a static educational prototype. It is not validated for clinical decisions, crew selection, diagnosis, treatment, emergency triage, medical records, or flight operations. It does not include authentication, access control, encryption-at-rest, network synchronization, audit service, or device qualification.

## Safe demonstration practices

- Use fictional, non-identifiable sample data only.
- Do not present a workflow label as medical clearance or a diagnosis.
- Do not use demo content to make a treatment, medication, or mission-safety decision.
- Media files remain in the current browser session and are not uploaded or interpreted.
- Text entries are stored in local browser storage until exported or cleared. Do not use this as a protected health-record system.
- Exported JSON may contain sensitive content; keep demonstrations synthetic and delete exports after use.
- No access credentials or real crew data belong in the optional scheduling experiment.

## Validation required before any operational consideration

1. Define users, intended use, hazards, and system boundaries.
2. Conduct multidisciplinary review with flight medicine, nursing, behavioral health, rehabilitation, human factors, privacy, cybersecurity, and mission operations.
3. Establish mission-specific procedures, escalation ownership, clinical thresholds, and emergency fallback.
4. Validate every translated string and all measurement units with fluent clinical reviewers.
5. Conduct usability tests in relevant layouts, lighting, glove use, restraint conditions, and gravity analogs.
6. Verify accessibility, error recovery, data integrity, offline persistence, timestamps, units, provenance, and synchronization behavior.
7. Perform software assurance, threat modeling, dependency review, independent security assessment, and configuration control.
8. Verify applicable NASA standards and mission/customer requirements with responsible authorities; this repository makes no compliance claim.
9. Evaluate each sensor and media modality independently against reference instruments and appropriate ground truth.
10. Obtain required institutional, regulatory, privacy, and licensing reviews before real-world use.

## Media safeguards

A still image, video, audio clip, or voice sample can expose personal information. Do not infer health status from facial appearance, speech, or vocal affect. Future capture must be opt-in, purpose-limited, access-controlled, and reviewed by humans using approved procedures.
