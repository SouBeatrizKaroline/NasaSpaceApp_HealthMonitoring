# NASA Regulatory Compliance, Supply-Chain Security & Gravity Interference

## 1. NASA & U.S. Federal Compliance (Zero PRC / Restricted Supply-Chain Association)

To ensure **AstroCare-Q** is eligible for NASA and international partner missions (Artemis / CSA / ESA / JAXA), the architecture enforces strict supply-chain and data-sovereignty hygiene:

- **Wolf Amendment Compliance:** Enacted in 2011, the [Wolf Amendment](https://casrai.org/guides/wolf-amendment-nasa-funding-china-collaboration) prohibits NASA and OSTP from bilateral cooperation with China or Chinese-owned/government entities, and NASA-supported platforms enforce strict geographic/entity restrictions ([STScI Wolf Amendment Policy](https://www.stsci.edu/contents/newsletters/2026-volume-43-issue-02/stsci-support-of-nasa-missions-and-the-wolf-amendment)).
- **Hardware, Software & Data Security:** Federal research rules prohibit covered telecommunications/camera equipment (e.g., Huawei, ZTE, Hikvision, Dahua, Hytera) and restricted software vendors ([Purdue Federal Requirements](https://research.purdue.edu/resources-for-researchers/compliance-and-security/research-security-and-export-controls/research-security/federal-requirements-and-prohibitions/)), as well as transfers of sensitive U.S. health data or biospecimens to Countries of Concern ([University of Pittsburgh Research Security](https://www.researchsecurity.pitt.edu/research-security/foreign-engagement-federally-funded-research)).
- **AstroCare-Q Architectural Guarantees:**
  1. **Zero External Dependencies in Core Engine:** `mvp/Cargo.toml` uses pure Rust `std` with `#![forbid(unsafe_code)]`, producing a fully auditable Software Bill of Materials (SBOM) with zero third-party or PRC-linked packages/SDKs.
  2. **100% Offline-First Execution:** Runs locally on spacecraft/cabin hardware or offline WebAssembly (WASM) with zero external cloud calls, zero foreign AI APIs, and local-only data storage.
  3. **Standards Alignment:** Designed around [NASA-STD-3001](https://www.nasa.gov/general/human-rating-and-nasa-std-3001/) (*Spaceflight Human-System Standard*, [Vol. 1 Crew Health & Vol. 2 Human Factors](https://pmc.ncbi.nlm.nih.gov/articles/PMC10070491/)) and [CSA autonomous neutron radiation monitoring (CANS / Radi-N2)](https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp).

---

## 2. How Gravity & Zero-Gravity (0g / Partial-G) Interfere with Health & Diagnostics

According to NASA's Human Research Program ([5 Hazards of Human Spaceflight ("RIDGE")](https://www.nasa.gov/humans-in-space/the-human-body-in-space/) and [Risks of Human Spaceflight](https://www.nasa.gov/hrp/risks/)), altered gravity fields (`0g` transit, `0.16g` Moon, `0.38g` Mars, `1g` Earth) fundamentally alter both **human physiology** and **how diagnostic tools behave**:

| System / Hazard | Physiological Effect of Microgravity (0g) | Interference on Medical Measurements & Devices | AstroCare-Q Calibration |
| :--- | :--- | :--- | :--- |
| **Fluid Shift & Neuro-Ocular (SANS)** | Loss of hydrostatic pressure ($\Delta p = \rho g h$) shifts ~2,000 mL of fluid headward within 24h ([PMC12419952](https://pmc.ncbi.nlm.nih.gov/articles/PMC12419952/)), causing facial edema, intracranial venous hypertension, and [SANS](https://www.mdpi.com/2075-1729/4/4/621). | Facial puffiness alters webcam rPPG skin-perfusion baselines; eye/vision complaints require Amsler grid & ocular checks rather than Earth migraine assumptions. | Adjusts baseline facial/ocular risk weights when `GravityMode = Microgravity (0g)`. |
| **Cardiovascular & Orthostatic** | Left ventricular mass can drop ~12% in 10 days; baroreflex degrades; 83% of long-duration crews show orthostatic intolerance on return to gravity ([PMC12419952](https://pmc.ncbi.nlm.nih.gov/articles/PMC12419952/)). | Resting central venous pressure drops while atrial diameter increases; standard Earth BP/HR thresholds misclassify early deconditioning. | Triggers orthostatic & hydration protocols during `0g -> 0.16g/0.38g/1g` transitions. |
| **Musculoskeletal** | Weight-bearing bones lose ~1–1.5% mineral density per month, raising fracture and kidney stone risk ([NASA Mars Health Report](https://www.nasa.gov/wp-content/uploads/2024/01/human-health-and-performance.pdf)). | Lack of gravitational loading masks early muscle weakness until EVA or planetary landing. | Tracks resistive exercise (ARED) compliance and urine/hydration flags. |
| **Vestibular & Sensorimotor** | Otoliths lose Earth's gravity vector, causing space motion sickness and gait/hand-eye deficits ([NASA HRP Risks](https://www.nasa.gov/hrp/risks/)). | Standard terrestrial balance tests fail in 0g; motion sickness mimics GI/viral illness in anamnesis. | Separates G-transition vestibular symptoms from infectious GI alerts. |
| **Device & Cabin Interference** | Fluids do not pool downward; air bubbles do not rise in syringes/IVs; cabin fans create constant acoustic noise. | Acoustic stethoscopes struggle against cabin noise; liquid test strips require surface-tension containment. | Prefers contactless **video rPPG**, **photo** inspection, and **voice** noise-filtered check-ins. |
