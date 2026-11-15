# AstroCare-Q — Autonomous Health Monitoring Software for Astronauts

> **2026 NASA Space Apps Challenge** · *Create Health Monitoring Software for Astronauts on Space Missions*

**AstroCare-Q** is a lean, autonomous health monitoring platform built for astronauts on long-duration space missions (Lunar/Artemis, orbital stations, rovers, and Mars). The system integrates **Structured Space Anamnesis**, **NANDA-I Nursing Diagnoses**, **Medical Triage (ICD-11 / Flight Surgeon)**, **Multimodal Analysis (Video, Photo, Voice)**, and **Quantum Computing/Sensing** into a clean, low-cognitive-load interface.

---

## 🎯 Why This Approach Solves the Challenge

On deep-space missions, communication delays prevent real-time medical support from Earth. Astronauts need to detect physiological and behavioral changes early and act autonomously:

1. **Anamnesis + NANDA-I + Medical Triage (Dual Clinical Layer):**
   - **Nursing Diagnosis (NANDA-I):** Focuses on the *human response and self-care* (sleep, hydration, activity intolerance, skin integrity, stress), generating immediate, actionable interventions the astronaut can perform independently.
   - **Medical Diagnosis / Triage:** Evaluates clinical severity (e.g., Spaceflight Associated Neuro-ocular Syndrome — SANS, arrhythmias, infections) and defines clear thresholds to alert the crew or Ground Flight Surgeons.
2. **Lightweight Multimodal Analysis (No Heavy Hardware Required):**
   - **Video (Webcam rPPG):** Estimates heart rate and heart rate variability (HRV) from facial video in 15–30 seconds.
   - **Photo / Image:** Visual assessment of skin lesions, facial edema (*puffy face*), or rapid diagnostic test strips.
   - **Voice:** Hands-free spoken anamnesis transcription plus basic vocal fatigue/stress indicators.
3. **Quantum Computing, Engineering & Science (Feasible with Limited Resources):**
   - **Quantum Computing (QUBO / QML):** Combinatorial triage optimization—prioritizing which clinical protocols to run first under tight crew time and limited medical supply constraints—executed on a local simulator.
   - **Quantum Engineering (Sensor Layer):** Telemetry architecture ready for next-generation quantum biosensors (NV-center / OPM magnetometry and quantum radiation dosimetry, simulated via JSON/API in the MVP).
   - **Quantum Science:** Cumulative cosmic radiation biological risk modeling and post-quantum cryptography (PQC) concepts for securing clinical telemetry.
4. **Lean Design (Low Cognitive Load):**
   - Strictly **3 core views** with zero visual clutter: *Interactive Body Dashboard*, *Multimodal Check-in*, and *Mission Routine*.

---

## 📁 Repository Structure

```text
NasaSpaceApp_HealthMonitoring/
├── README.md                          # Project overview and system architecture
├── docs/
│   ├── PRODUCT_MANAGEMENT.md          # Product strategy, MVP scope, personas & feasibility
│   ├── DESIGN_UX_UI.md                # UX/UI guidelines, 3-screen layout & color coding
│   ├── CLINICAL_NANDA_MEDICAL.md      # Anamnesis, NANDA-I & Medical Triage engine
│   └── QUANTUM_ARCHITECTURE.md        # Quantum Computing, Engineering & Science in the MVP
└── mvp/
    ├── anamnesis_nanda_engine.json    # Clinical rule base linking NASA Hazards to NANDA-I
    └── quantum_triage_qubo.py         # Working QUBO clinical triage optimization prototype
```

---

## 🛠️ Recommended MVP Stack (Resource-Constrained)

| Layer | Lightweight / Free Tech | Rationale |
| :--- | :--- | :--- |
| **Frontend** | React + Vite + TypeScript + Tailwind CSS | Fast to prototype, responsive, and lightweight for offline spacecraft use. |
| **Backend** | Python (FastAPI) | Natively integrates computer vision, audio processing, and quantum libraries. |
| **Multimodal** | OpenCV + MediaPipe + Web Speech API | Webcam rPPG, image analysis, and voice-to-text without heavy GPU requirements. |
| **Quantum** | Qiskit (AerSimulator) / NumPy fallback | Runs QUBO/QAOA optimization locally on a standard laptop for the hackathon demo. |

---

## 🚀 Running the QUBO Triage Prototype (MVP)

```bash
python mvp/quantum_triage_qubo.py
```

The script runs clinical triage optimization for an astronaut with multiple simultaneous alerts while respecting mission time and medical supply constraints.
