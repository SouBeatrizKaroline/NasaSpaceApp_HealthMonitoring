# Multidisciplinary Clinical Engine: Anamnesis + NANDA-I + Allied Health + Medical Triage

## 1. Why a Multidisciplinary Model?

Per [NASA-STD-3001 Volume 1](https://pmc.ncbi.nlm.nih.gov/articles/PMC10070491/) and [NASA's Moon-to-Mars Architecture](https://www.nasa.gov/wp-content/uploads/2024/01/human-health-and-performance.pdf) (where Mars missions face up to a 22-minute one-way communication delay), onboard software must support **preventive countermeasures, self-care, and acute triage** across multiple health disciplines—not just disease labeling:

| Discipline | Core Contribution in AstroCare-Q | Example in Spaceflight |
| :--- | :--- | :--- |
| **Space Anamnesis (SOAP)** | Structured Subjective + Objective intake contextualized by **NASA's 5 Hazards** and active **Gravity Mode** (`0g`, `0.16g`, `0.38g`, `1g`). | Distinguishes 0g cephalad fluid-shift headache from dehydration or CO2 buildup. |
| **Nursing (NANDA-I)** | Diagnoses **human response and self-care** deficits, generating step-by-step autonomous actions. | *Disturbed Sleep Pattern (00198)*, *Deficient Fluid Volume (00027)*, *Impaired Skin Integrity (00046)*. |
| **Physiotherapy & Exercise** | Prescribes targeted countermeasures against the ~1–1.5%/month bone loss and muscle atrophy ([NASA Mars Health](https://www.nasa.gov/wp-content/uploads/2024/01/human-health-and-performance.pdf)). | Resistive exercise (ARED) dosing and vestibular habituation after gravity transitions. |
| **Clinical Nutrition** | Adjusts electrolytes, sodium, fluid, Vitamin D, and antioxidants to counter SANS, kidney stones, and radiation. | Low-sodium intake for SANS; fractionated electrolyte hydration. |
| **Psychology / Behavioral** | Monitors isolation, confinement, circadian misalignment, and vocal/mood fatigue indicators. | Guided breathing, warm-spectrum cabin lighting, workload pacing. |
| **Space Pharmacy** | Accounts for altered pharmacokinetics in microgravity and medication potency degradation from space radiation ([NASA-STD-3001](https://www.nasa.gov/wp-content/uploads/2023/04/standards-article-april-2023.pdf)). | Flags radiation-exposed medical kit items before recommending oral/topical doses. |
| **Medicine (Flight Surgeon)** | Evaluates acute vital risk and packages structured SOAP + multimodal evidence for ground escalation. | Suspected SANS, arrhythmia, or acute radiation syndrome → Red Alert. |

---

## 2. Multidisciplinary Clinical Mapping (MVP Rules)

| NASA Hazard | Signals & Multimodal Inputs | NANDA-I Nursing Diagnosis | Multidisciplinary Interventions (Self-Care) | Medical Escalation |
| :--- | :--- | :--- | :--- | :--- |
| **Altered Gravity (`0g`)** | Facial edema (photo), blurred vision, morning headache | *Ineffective peripheral tissue perfusion / Neuro-ocular risk (00204)* | **Nursing:** Amsler grid test<br>**Nutrition:** Reduce dietary sodium<br>**Physio:** Lower-body negative pressure / aerobic protocol | Suspected **SANS** → Notify Flight Surgeon |
| **Isolation & Confinement** | Sleep < 5.5h, slow vocal cadence, low mood | *Disturbed sleep pattern (00198)* / *Anxiety (00146)* | **Nursing/Psych:** Warm cabin lighting, 4-7-8 breathing, async family message | Operational fatigue risk → 48h monitoring |
| **Space Radiation** | High [CSA/NASA dosimeter](https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp) reading, erythema (photo), fatigue | *Impaired skin integrity (00046)* / *Fatigue (00093)* | **Nursing:** Relocate to shielded module, barrier hydration<br>**Pharmacy:** Check kit radiation exposure | Acute radiation reaction → Immediate Red Alert |
| **Hostile Closed Environment** | Elevated rPPG HR (video), dizziness, thirst | *Deficient fluid volume (00027)* | **Nutrition:** 500 mL fractionated electrolytes<br>**Nursing:** Repeat video rPPG in 30 min | Dehydration / orthostatic event → Reassess in 30m |
| **Gravity Transition (`0g -> 0.16g/0.38g`)** | Dizziness on standing, gait instability | *Impaired physical mobility (00085)* / *Risk for falls (00155)* | **Physio:** Seated-to-standing graded protocol & vestibular gaze stabilization | Orthostatic intolerance → Hold EVA clearance |
