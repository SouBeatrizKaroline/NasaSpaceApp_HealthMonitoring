# AstroCare-Q — Autonomous Health Monitoring Software for Astronauts

> **2026 NASA Space Apps Challenge** · *Create Health Monitoring Software for Astronauts on Space Missions*

**AstroCare-Q** is a lean, spaceflight-grade autonomous health monitoring platform built for astronauts on long-duration missions (Lunar/Artemis, orbital stations, rovers, and Mars). The core engine is written in **Rust** (`#![forbid(unsafe_code)]`, zero external dependencies) and paired with a **zero-dependency offline-first Web UI** (`web/`) ready for instant Vercel deployment.

---

## 🎯 Why This Approach Solves the Challenge

On deep-space missions (with up to 22-minute one-way communication delays to Mars), astronauts must detect physiological and behavioral changes early and act autonomously:

1. **NASA Compliance & Zero Restricted Supply-Chain Risk:**
   - Designed strictly around [NASA-STD-3001](https://www.nasa.gov/general/human-rating-and-nasa-std-3001/), [NASA's 5 Hazards ("RIDGE")](https://www.nasa.gov/hrp/risks/), and [CSA radiation monitoring](https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp).
   - 100% offline-first with **zero PRC-linked hardware, cloud APIs, AI models, or third-party dependencies**, aligning with the [Wolf Amendment](https://casrai.org/guides/wolf-amendment-nasa-funding-china-collaboration) and U.S. federal research security rules.
2. **Gravity-Aware Multidisciplinary Clinical Engine:**
   - **Anamnesis (SOAP) + Gravity Calibration (`0g`, `0.16g`, `0.38g`, `1g`):** Accounts for how microgravity alters physiology (~2,000 mL cephalad fluid shift, SANS, ~1–1.5%/month bone loss) and interferes with diagnostic devices.
   - **Nursing Diagnoses (NANDA-I) + Allied Health:** Combines NANDA-I self-care interventions with **Physiotherapy**, **Clinical Nutrition**, **Psychology**, and **Space Pharmacy**.
   - **Medical Triage:** Evaluates acute vital risk and packages structured SOAP summaries for Ground Flight Surgeons.
3. **Lightweight Multimodal Analysis:**
   - **Video (Webcam rPPG)**, **Photo/Image**, and **Voice** dictation via native browser APIs.
4. **Quantum Computing, Engineering & Science:**
   - **Quantum Computing (QUBO):** Deterministic combinatorial triage optimization under tight crew time and medical supply limits.
   - **Quantum Engineering & Science:** Architecture ready for contactless quantum magnetometry (NV-centers/OPMs), quantum radiation dosimetry, and post-quantum cryptography (PQC).
5. **Lean Design (Low Cognitive Load):**
   - Strictly **3 core views**: *Body Dashboard*, *Multimodal Check-in*, and *Mission Routine*.

---

## 📁 Repository Structure

```text
NasaSpaceApp_HealthMonitoring/
├── README.md                          # Project overview and system architecture
├── web/                               # Zero-dependency Web UI (Ready for Vercel)
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── docs/
│   ├── NASA_COMPLIANCE_AND_GRAVITY.md # Wolf Amendment, NASA-STD-3001 & 0g/Partial-G effects
│   ├── PRODUCT_MANAGEMENT.md          # Product strategy, MVP scope, personas & feasibility
│   ├── DESIGN_UX_UI.md                # UX/UI guidelines, 3-screen layout & color coding
│   ├── CLINICAL_NANDA_MEDICAL.md      # Anamnesis, NANDA-I, Allied Health & Medical Triage
│   └── QUANTUM_ARCHITECTURE.md        # Quantum Computing, Engineering & Science in the MVP
└── mvp/
    ├── Cargo.toml                     # Zero-dependency Rust project manifest
    ├── src/
    │   └── main.rs                    # Safe Rust (`forbid(unsafe_code)`) Clinical & QUBO Engine
    ├── anamnesis_nanda_engine.json    # Multidisciplinary rule base (NASA Hazards + NANDA-I)
    └── quantum_triage_qubo.py         # Optional Python/Qiskit reference script
```

---

## ▲ Deploying the Web UI on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import `SouBeatrizKaroline/NasaSpaceApp_HealthMonitoring`.
2. Set **Root Directory** to `web`.
3. Leave Framework Preset as **Other** (zero build step required) and click **Deploy**.

---

## 🚀 Running the Rust Core Prototype (CLI)

```bash
cd mvp
cargo run --release
```
