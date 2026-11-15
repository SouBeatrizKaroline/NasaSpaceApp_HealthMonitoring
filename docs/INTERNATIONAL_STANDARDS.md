# International Health & Interoperability Standards

To make **Crew Wellness / Private Check-In** interoperable with international aerospace medical teams and ground Flight Surgeons—while strictly preserving the prototype boundary (*records crew self-reports without automated diagnosis*)—the data model maps to five complementary global standards:

---

## 1. Functional Mission Impact — WHO ICF

The check-in section *"How are mission tasks affected?"* aligns directly with the [**WHO International Classification of Functioning, Disability and Health (ICF)**](https://www.who.int/standards/classifications/international-classification-of-functioning-disability-and-health), which evaluates **functional capacity in context** rather than disease labels alone:

| Check-in Domain | WHO ICF Component | Spaceflight Relevance |
| :--- | :--- | :--- |
| **Mobility or balance** | Body Functions (`b7` Neuromusculoskeletal & movement) / Activities (`d4` Mobility) | Post-landing orthostatic intolerance and vestibular readaptation (`0g -> 0.17g/0.38g/1g`). |
| **Vision** | Body Functions (`b210` Seeing functions) | Early self-monitoring for Spaceflight Associated Neuro-ocular Syndrome (SANS). |
| **Fine motor / EVA tasks** | Activities (`d440` Fine hand use) | Spacesuit glove fatigue, dexterity, and microgravity tool handling. |
| **Cognitive focus / Sleep / Mood** | Body Functions (`b134` Sleep, `b140` Attention, `b152` Emotional) | Isolation, confinement, and circadian misalignment. |
| **Gravity / Radiation / Cabin** | Environmental Factors (`e2` Natural environment & human-made changes) | Contextualizes functional changes against altered gravity and closed habitats. |

---

## 2. Nursing Process — NANDA-I, NIC & NOC (NNN Linkage)

Nursing informatics bridges self-reported symptoms and practical crew self-care through the **NNN taxonomy**:
- **NANDA-I (Diagnosis of Human Response):** Identifies self-care and comfort priorities (e.g., *00198 Disturbed Sleep Pattern*, *00027 Deficient Fluid Volume*, *00046 Impaired Skin Integrity*, *00204 Ineffective Peripheral Tissue Perfusion*).
- **NIC (Nursing Interventions Classification):** Standardizes immediate, non-pharmacological crew actions (e.g., *Sleep Enhancement 1850*, *Fluid Management 4120*, *Skin Surveillance 3590*).
- **NOC (Nursing Outcomes Classification):** Tracks recovery across mission days (e.g., *Sleep 0004*, *Hydration 0602*, *Tissue Integrity 1101*).

---

## 3. Vital Signs & Measurements — LOINC & HL7 FHIR

Optional measurements entered by the astronaut map to [**LOINC**](https://loinc.org/) observation codes and [**HL7 FHIR `Observation`**](http://hl7.org/fhir/observation.html) / [**`Condition`**](http://hl7.org/fhir/condition.html) structures (see `mvp/fhir_loinc_export_schema.json`) so exported JSON records can be ingested by ground medical systems:

| Check-in Measurement | LOINC Code | Unit (UCUM) | FHIR Resource |
| :--- | :--- | :--- | :--- |
| **Heart rate** | `8867-4` | `/min` (bpm) | `Observation` |
| **Blood pressure (Systolic / Diastolic)** | `85354-9` | `mm[Hg]` | `Observation` |
| **Body temperature** | `8310-5` | `Cel` (°C) | `Observation` |
| **Blood glucose** | `2339-0` | `mg/dL` | `Observation` |
| **Sleep duration** | `93832-4` | `h` | `Observation` |

---

## 4. Ground Clinical Review — WHO ICD-11

[**WHO ICD-11**](https://icd.who.int/) (*International Classification of Diseases, 11th Revision*) is reserved **exclusively for the Ground Flight Surgeon review layer** when a crew member selects *"Request professional review"*. The onboard interface never assigns automated ICD-11 diagnoses to the astronaut.
