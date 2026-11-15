# Product Management — AstroCare-Q

## 1. Product Vision
Empower astronauts on long-duration missions to **monitor, understand, and act** on their own physical and behavioral health in under 2 minutes per check-in, even without real-time Earth connectivity.

---

## 2. Personas

| Persona | Context | Core Pain Point | What AstroCare-Q Delivers |
| :--- | :--- | :--- | :--- |
| **Astronaut (Primary User)** | In orbit, lunar base, or Mars transit; high workload, fatigue, and isolation. | Not a physician; long forms create friction and delay risk detection. | Fast voice/camera check-in, visual body map, and practical self-care steps (NANDA-I). |
| **Flight Surgeon (Secondary User)** | Ground medical team operating under minutes-long signal latency. | Receives fragmented raw metrics without structured clinical context. | Structured SOAP summary, medical hypothesis, and calculated triage priority. |

---

## 3. Lean Scope: MVP (Hackathon) vs. Post-Hackathon

To deliver a polished, working solution with **limited resources**, scope is strictly prioritized:

### ✅ Phase 1 — Functional MVP (48h Hackathon)
- **Interactive Body Map (SVG):** 5 clickable anatomical zones with color-coded status (Green / Amber / Red).
- **Guided Micro-Anamnesis (3 Steps):** Chief complaint + 3 adaptive questions + vital signs.
- **Lightweight Multimodal Capture:**
  - *Webcam:* Basic pulse estimation (rPPG) or skin/facial photo capture.
  - *Voice:* Spoken chief complaint dictation (Web Speech API) with keyword extraction.
- **JSON Clinical Engine:** Deterministic mapping from Anamnesis → NANDA-I Diagnosis → Self-Care Action → Medical Escalation Alert.
- **Simulated Quantum Module (`quantum_triage_qubo.py`):** Optimal protocol prioritization when multiple alerts occur simultaneously.
- **Environment Mode:** Context selector (*Spacecraft*, *Space Station*, *Rover*, *Lunar/Mars Base*) that adjusts risk thresholds.

### 🔭 Phase 2 — Post-Hackathon Evolution
- Real BLE wearable integration and live quantum dosimeter telemetry.
- *Quantum Kernel* (QML) training on public datasets from the NASA Life Sciences Data Archive.
- Asynchronous post-quantum encrypted (PQC) sync to the Ground Flight Surgeon dashboard.

---

## 4. Success Metrics (KPIs)
- **Check-in Time:** < 90 seconds from start to actionable plan.
- **Adherence Rate:** > 85% daily check-in completion (supported by subtle mission-readiness gamification).
- **Decision Clarity:** 100% of critical alerts paired with step-by-step plain-language instructions.
