# Space Apps Submission and Award Alignment

Crew Health Check addresses [Create Health Monitoring Software for Astronauts on Space Missions](https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/). The strongest demonstration is a crew member recording a change, comparing it with their own preflight baseline, and preparing a readable report for later review.

## Award alignment

The descriptions below use the [published 2025 Global Awards](https://www.spaceappschallenge.org/2025/awards/) as a reference. Confirm the current award and judging guidance through the [2026 event page](https://www.spaceappschallenge.org/2026/) and the team’s local event. These are alignment recommendations, not claims about eligibility or results.

| Award | Alignment | Evidence to show |
| --- | --- | --- |
| Best Mission Concept | Primary | Show a complete offline workflow from check-in to comparison and report. Explain the role of the crew member, the reviewer, and the approved communications pathway. |
| Best Use of Science | Strong | Connect [NASA's gravity-field research](https://www.nasa.gov/hrp/hazard-gravity-fields/) to recording time since transition, balance, and mobility. Explain what is self-reported and what is established by published research. |
| Best Use of Technology | Secondary | Demonstrate profile-scoped histories and report generation. If there is time, run the same operational plan with exact enumeration and Qiskit and show both results with their limits. |
| Galactic Impact | Secondary | Present an intended benefit under constrained connectivity. Verify retrieval and report preparation tasks before citing measured outcomes. |
| Best Use of Data | Demonstrable | Switch study cohorts, inspect published sleep measurements, and compare changes from preflight group means. |
| Best Use of Storytelling | Supporting | Connect one reported change across preflight, flight, and recovery. A clear pitch supports presentation. Strong alignment with this award would also require storytelling grounded in open data. |
| Art & Technology | Supporting | Make the gravity selection and stage comparison communicate information through readable visual hierarchy, contrast, and responsive layout. |
| Global Connection | Conditional | Show the available languages and explain the difference between localization and demonstrated international collaboration. |
| Most Inspirational | Supporting | Show the human need to track a personal baseline when communications are limited. |
| Local Impact | Future | Establish a specific local audience through documented collaboration and evaluation before making local-impact claims. |

## Short demonstration script

1. Show the selected astronaut profile and mission.
2. Save a change in function with the gravity environment and time since transition.
3. Open the mission comparison and point to the preflight reference and any missing stage.
4. Preview and download the report. Explain that sharing uses an approved contact pathway.

Aim for 30 seconds or up to seven slides as described in the [2026 community submission guidance](https://github.com/nasa/spaceapps/discussions/1973). Confirm against the current official submission form and guide. Prioritize the crew workflow in the short demo. Link optional operational planning from the project page.

## Before submitting

- Confirm team registration, local event eligibility, the selected challenge, and the local presentation deadline. The official 2026 event page lists November 15 at 11:59 p.m. local time as the online submission deadline.
- Use English for the submission and check public demo links in a private browser window.
- Attribute NASA and other sources, identify the team's contributions, and complete all applicable disclosure fields accurately. Distinguish prior work from work completed during the event wherever the form or guide requests it.
- Check two profiles, mission isolation, reload persistence, offline use, mobile layout, and text export. Record actual results and retain any limitations.
- Describe a follow-up preference as a local record. Describe Qiskit results as simulator outputs for operational tasks.

## Evidence available in the interface

- **Science:** Open **Why record gravity transitions?** below the gravity selector. It links the NASA Human Research Program's findings on orientation, coordination, balance, and movement to the check-in fields.
- **Mission concept and storytelling:** Select one astronaut and mission. The history shows the latest record in each stage and the reported sleep difference from the latest preflight check-in, when both values are present. The same information is included in the downloadable report.
- **Interpretation:** A difference in reported sleep is descriptive and does not establish a cause. Crew-entered observations are distinct from published group measurements.

## Public spaceflight dataset in the demo

The [original observational study](https://pubmed.ncbi.nlm.nih.gov/25127232/) by Barger et al. (2014), funded by NASA, reports actigraphy-derived group mean sleep duration and standard deviations during four study periods. NASA reproduces the results in its [Sleep Accommodations technical brief](https://www.nasa.gov/wp-content/uploads/2023/03/sleep-accomodations-technical-brief-ochmo.pdf). The bundled subset in `web/sleep-research.js` contains only aggregate statistics. It works without network access.

In **Spaceflight sleep research**, switch between the Shuttle and ISS cohorts to view the published values and the calculated change from each cohort's earliest preflight mean. Differences are descriptive, computed from rounded published means. They do not establish a causal effect of gravity and are not comparable as personal targets. The panel is linked from mission comparison and keeps public research distinct from crew self-reports.
