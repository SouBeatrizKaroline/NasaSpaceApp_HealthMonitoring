# AstroCare-Q — Autonomous Health Monitoring Software for Astronauts

> **2026 NASA Space Apps Challenge** · *Create Health Monitoring Software for Astronauts on Space Missions*

**AstroCare-Q** is a lean, spaceflight-grade autonomous health monitoring platform built for astronauts on long-duration missions (Lunar/Artemis, orbital stations, rovers, and Mars). The core engine is written in **Rust** (`#![forbid(unsafe_code)]`, zero external dependencies) for deterministic performance, memory safety without garbage collection, and full **supply-chain sovereignty**—capable of running natively on flight hardware or compiling to **WebAssembly (WASM)** for offline cabin execution.

---

## 🎯 Why This Approach Solves the Challenge

On deep-space missions (with up to 22-minute one-way communication delays to Mars), astronauts must detect physiological and behavioral changes early and act autonomously:

1. **NASA Compliance & Zero Restricted Supply-Chain Risk:**
   - Designed strictly around [NASA-STD-3001](https://www.nasa.gov/general/human-rating-and-nasa-std-3001/), [NASA's 5 Hazards ("RIDGE")](https://www.nasa.gov/hrp/risks/), and [CSA radiation monitoring](https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp).
   - 100% offline-first with **zero PRC-linked hardware, cloud APIs, AI models, or third-party dependencies**, aligning with the [Wolf Amendment](https://casrai.org/guides/wolf-amendment-nasa-funding-china-collaboration) and U.S. federal research security rules.
2. **Gravity-Aware Multidisciplinary Clinical Engine:**
   - **Anamnesis (SOAP) + Gravity Calibration (`0g`, `0.16g`, `0.38g`, `1g`):** Accounts for how microgravity alters physiology (~2,000 mL cephalad fluid shift, SANS, ~1–1.5%/month bone loss) and interferes with diagnostic devices.
   - **Nursing Diagnoses (NANDA-I) + Allied Health:** Combines NANDA-I self-care interventions with **Physiotherapy** (bone/vestibular countermeasures), **Clinical Nutrition** (sodium/electrolyte control), **Psychology** (isolation/sleep), and **Space Pharmacy** (radiation med-kit potency).
   - **Medical Triage:** Evaluates acute vital risk and packages structured SOAP summaries for Ground Flight Surgeons.
3. **Lightweight Multimodal Analysis (No Heavy Hardware Required):**
   - **Video (Webcam rPPG):** Contactless heart rate and HRV estimation in 15–30 seconds.
   - **Photo / Image:** Visual assessment of skin lesions, facial edema (*puffy face*), or test strips.
   - **Voice:** Hands-free spoken anamnesis transcription plus vocal fatigue indicators.
4. **Quantum Computing, Engineering & Science (Feasible with Limited Resources):**
   - **Quantum Computing (QUBO):** Deterministic combinatorial triage optimization under tight crew time and medical supply limits.
   - **Quantum Engineering & Science:** Architecture ready for contactless quantum magnetometry (NV-centers/OPMs), quantum radiation dosimetry, and post-quantum cryptography (PQC).
5. **Lean Design (Low Cognitive Load):**
   - Strictly **3 core views** with zero visual clutter: *Interactive Body Dashboard*, *Multimodal Check-in*, and *Mission Routine*.

---

## 📁 Repository Structure

```text
NasaSpaceApp_HealthMonitoring/
├── README.md                          # Project overview and system architecture
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

## 🚀 Running the Rust Core Prototype (MVP)

No external dependencies or internet access required:

```bash
cd mvp
cargo run --release
```

Or compile directly with `rustc`:

```bash
rustc mvp/src/main.rs -O -o astrocare_q && ./astrocare_q
```
