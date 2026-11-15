# Validation record — 2026-11-15

## Executed

`node --test tests/core.test.cjs`: six tests passed.

- Report round trip preserves values, units, source, and absent optional readings.
- Export selects one crew and one mission.
- Invalid envelopes, mixed scopes, duplicate IDs, and unknown units are rejected.
- Comparison handles missing phases and distinguishes zero from absent data.
- Task inputs discard unknown properties; exact search and feasible browser result are checked.
- Qiskit imports require matching tasks/budget and binary selections.

JavaScript syntax checks were run for the changed application modules. The interface copy and wiring were reviewed in source.

## Browser validation blocked in this environment

`node tests/browser.cjs` was attempted, but the execution environment refused the local debugging connection (`EACCES` to localhost). The browser review tool also refused local file navigation. Therefore no successful browser acceptance run, desktop/mobile screenshot review, or complete keyboard verification is claimed.

The committed browser harness is designed to cover offline profile creation, two profiles/two missions, save/reload, comparison, actual JSON download, invalid import then retry, Ground Review, task comparison, desktop/mobile overflow, and keyboard activation. Run it in a normal permitted Windows/Edge environment before release. Its checks are not a substitute for manual usability and assistive-technology review.

## Remaining release checks

1. Run the browser harness and inspect its screenshots; manually complete the entire flow using Tab, Shift+Tab and Enter at desktop and mobile widths.
2. Confirm offline reload after successful service-worker installation and after a previous deployed app version updates.
3. Review English and all translations with representative users; review health wording with qualified professionals.
4. Install the optional Python requirements and reproduce a Qiskit result. Qiskit is not installed in this execution environment.
5. Verify deployed HTTPS headers, storage-error behavior, cache eviction/recovery and large valid histories in supported browsers.

These are prototype software checks, not clinical validation, security certification, or flight qualification.
