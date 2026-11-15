# Mission workspace identity

Crew Health Check is positioned as a calm onboard record workspace. Its primary user is a crew member capturing an observation under limited time and connectivity. Its secondary user is a reviewer opening an exported record. The design prioritizes the next action, provenance, and the distinction between absent information and a measured value.

## Visual system

| Token | Value | Purpose |
| --- | --- | --- |
| Navigation | `#142f35` | Stable dark-teal operational frame |
| Canvas | `#f3f6f4` | Quiet background |
| Surface | `#ffffff` | Forms and record cards |
| Primary action | `#146b55` | Check-in and save |
| Text | `#18343b` | Main reading content |
| Secondary text | `#566b70` | Context and provenance |
| Focus | `#d99625` | Visible keyboard focus |
| Error | `#843b27` on `#fff0ed` | Explicit failure messages |

System-font stack: Inter when installed, Segoe UI, Arial, sans-serif. No font download. Body text is 16px, field labels 13px, metadata 11–12px, and page titles scale from 29–42px. The favicon combines an orbital ring and a pulse trace; it is an independent mark, not an agency badge.

## Interaction hierarchy

Today is the entry point. The active profile and mission remain visible above the content. Start/Continue check-in is the primary action. Mission History follows it in navigation. Ground Review and Task Planning remain available without creating a profile.

Four check-in steps show progress and provide Back navigation. An explicit review precedes storage. Optional readings remain empty. A successful save exposes a direct history link. Record comparison uses numerical differences and missing-data labels, without assigning health status.

The desktop sidebar becomes a horizontal navigation row on narrow screens. Forms collapse to one column. Native labels, buttons, selects, details, focus rings, error announcements, and a skip link support keyboard navigation. Status wording accompanies color. Reduced-motion and print styles are included.

## States and honest boundaries

- No profile: local profile form and its access limitation.
- Empty mission: no fabricated entries, with a clear check-in action.
- Missing phase or reading: explicit missing labels.
- Offline: connection label separate from asset-cache readiness.
- Saved: confirmation only after local-storage write.
- Invalid report: clear failure and a file input ready for retry.
- Exported: local file creation initiated, never a claim of ground receipt.

Desktop/mobile screenshot and full assistive-technology validation remain release checks; see VALIDATION.md. Do not describe the visual review as passed until it has been performed in an accessible browser environment.
