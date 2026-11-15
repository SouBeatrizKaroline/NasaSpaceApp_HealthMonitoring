# Product Review and Roadmap

## Product direction

Crew Health Check helps a crew member record what changed, compare it with their own preflight baseline, and prepare a report for review when communications are limited. The crew member is the primary user. An authorized reviewer is a downstream reader of a report.

The browser prototype provides local profiles, check-ins across three mission stages, gravity context, and per-mission history. A code selects a profile in the current browser. It provides no authentication. The current follow-up preference is saved locally and does not send a report.

## Priorities

| Priority | Product decision | Acceptance criterion |
| --- | --- | --- |
| P0 | Make the crew journey the main entry point | From a fresh browser, a user can open a profile, save a check-in, reopen the profile, and retrieve that check-in through the mission history. |
| P0 | Make baseline comparison visible | A single mission view places the latest available preflight, in-flight, and recovery observations together, labels missing stages, and displays gravity context alongside each entry. |
| P0 | Make the handoff explicit | The interface distinguishes recording a follow-up preference from sending a report. The user can preview and export a readable summary for an approved external contact pathway. |
| P0 | Verify the demonstration end to end | Use two profiles and multiple missions to verify separation, reload persistence, stage filters, exports, keyboard access, and mobile layout. Verify behavior with network access disabled and confirm that records with incomplete observations remain intelligible. |
| P1 | Give operational planning a clear place | Keep planning accessible as a mission operations tool. The user enters their own tasks. Compare the exact result with a Qiskit result imported for the same plan. A failed import leaves the classical result available. |
| P1 | Align documentation and language coverage | The README describes the same workflow as the interface. Translate planning labels and validation messages consistently with the four supported interface languages. |
| Future | Evaluate operational use | Establish clinical ownership, review access controls, validate measurements and language, and document approved review pathways with the responsible authorities. |

## Release signals

Track time to complete the first check-in, the share of users who retrieve the correct prior entry without help, and whether participants can explain what saving and exporting actually do. Compare results across desktop, mobile, keyboard-only use, and supported languages. Evaluate the planning workflow independently by checking whether users can compare two results for the same plan. These are proposed evaluation criteria, not measured outcomes.
