# Clinical Engine: Anamnesis + NANDA-I + Medical Triage

## 1. Why Combine Anamnesis, NANDA-I, and Medical Diagnosis?

Most health apps focus only on *raw numbers* or only on *diseases*. In space, an astronaut needs **two complementary clinical layers**:

| Layer | Primary Focus | Role on a Space Mission |
| :--- | :--- | :--- |
| **Space Anamnesis (SOAP)** | Structured collection (Subjective + Objective) grounded in **NASA's 5 Hazards**. | Contextualizes symptoms (e.g., a morning headache in microgravity has a different etiology than on Earth). |
| **Nursing Diagnosis (NANDA-I)** | Human response and **self-care**. | Produces immediate, practical interventions the astronaut can execute without an onboard physician. |
| **Medical Diagnosis (Clinical Hypothesis)** | Pathology identification and **vital risk**. | Sets objective severity criteria and triggers crew or Ground Flight Surgeon escalation. |

---

## 2. Space-Adapted Micro-Anamnesis Flow

1. **S (Subjective):** Chief complaint captured via voice or tap + discomfort level (1–10) + duration.
2. **O (Objective):** Vital signs (BP, HR, Temp, Blood Glucose, Sleep) + multimodal inputs (photo/video/voice) + environmental exposure (radiation/gravity).
3. **A (Dual Assessment):**
   - *NANDA-I:* Identifies the priority nursing diagnosis.
   - *Medical:* Scores risk for critical spaceflight conditions.
4. **P (Plan):** Immediate self-care action + escalation decision.

---

## 3. Practical Mapping (MVP Rule Examples)

| NASA Hazard | Indicators / Signals | NANDA-I Diagnosis | Nursing Action (Self-Care) | Medical Hypothesis / Alert |
| :--- | :--- | :--- | :--- | :--- |
| **Altered Gravity Fields** | Facial edema, blurred vision, morning headache | *Ineffective peripheral tissue perfusion* / *Risk for injury* | Elevate head position, reduce sodium intake, run Amsler grid test | Suspected **SANS** (*Spaceflight Associated Neuro-ocular Syndrome*) → Notify Flight Surgeon |
| **Isolation & Confinement** | Sleep < 5h, vocal tremor/monotony, low mood | *Disturbed sleep pattern (00198)* / *Anxiety (00146)* | Sleep hygiene protocol (dim blue light), guided breathing, async family contact | Operational fatigue / adjustment risk → Monitor for 48h |
| **Space Radiation** | High cumulative dose + fatigue + skin erythema (photo) | *Impaired skin integrity (00046)* / *Fatigue (00093)* | Move to shielded habitat module, skin barrier hydration, antioxidant support | Acute/subacute radiation reaction → Immediate Red Alert |
| **Hostile Closed Environment** | Abnormal glucose, thirst, tachycardia (rPPG video) | *Deficient fluid volume (00027)* / *Imbalanced nutrition* | Fractionated electrolyte rehydration and caloric ration adjustment | Severe dehydration or metabolic/cardiovascular event → Reassess in 30 min |
