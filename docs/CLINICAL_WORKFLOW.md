# Clinical Workflow Concept

## Purpose

Collect a structured, crew-authored snapshot that can support self-awareness and later review by an authorized health professional. It is not a diagnostic or treatment workflow.

## Check-in sequence

1. **Context:** mission phase, gravity environment, and time since transition.
2. **Reason for check-in:** routine entry, new symptom, change in function, scheduled follow-up, or crew-selected concern.
3. **Anamnesis:** onset, duration, location, severity as experienced by the crew member, pattern, associated symptoms, recent exposures, and what changed from personal baseline.
4. **Function:** effect on mobility, balance, vision-related tasks, exercise, sleep, eating, hydration routine, work, and daily mission activities.
5. **Well-being and team context:** self-rated mood, stress, sleep, workload, sense of support, and any request for private follow-up.
6. **Optional measurements:** value, unit, time, device or method, and whether the crew member considers the reading reliable.
7. **Evidence:** optional photo, video, or audio attached for later human review. The prototype does not interpret media.
8. **Review preference:** save privately, request professional review, or follow a mission-defined procedure.

## Workflow labels

- **Routine entry:** information was recorded. This is not a declaration of health or fitness.
- **Review requested:** the crew member asked for follow-up or reported a change that merits review under mission procedures.
- **Mission procedure selected:** the crew member selected a preconfigured procedure label. The prototype does not decide that a condition is urgent.
- **Incomplete:** required context is missing; no inference is made.

Only a mission clinical authority may define operational thresholds, escalation pathways, who receives a record, or how to act on it. The demo contains no medical thresholds.

## Multidisciplinary review

A future human review process may include flight medicine, nursing, behavioral health, physical therapy, occupational therapy, nutrition, pharmacy, and environmental health, according to mission roles and scope of practice. Each professional should document observations and recommendations within their authorized role.

- Nursing assessment can structure reported needs and follow-up without embedding licensed NANDA-I labels or codes.
- Medical assessment remains clinician-led and should reference approved mission protocols.
- Behavioral health check-ins are voluntary, private, non-stigmatizing, and never inferred from voice, face, or writing style.
- Rehabilitation and occupational-function review can describe task performance, balance, mobility, exercise, and participation.
- Nutrition and pharmacy review should use mission-approved measures and formulary data, not generic advice.

## Data model

Each observation should preserve: subject-controlled pseudonymous identifier, event time, mission elapsed time, environment, value/text, unit where applicable, source/method, confidence as reported, and correction history. Missing data is distinct from zero; derived values must retain provenance and version.

## Example

A crew member reports new dizziness after a gravity transition, records when it began, notes effects on walking and work, enters an optional measurement with its source, and selects “request review.” The software stores the report and makes it available to the configured review pathway. It does not assign a diagnosis or medication.
