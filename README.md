# AstroCare-Q — Autonomous Health Monitoring Software for Astronauts

> **2026 NASA Space Apps Challenge** · *Create Health Monitoring Software for Astronauts on Space Missions*

**AstroCare-Q** is a lean, spaceflight-grade autonomous health monitoring platform built for astronauts on long-duration missions (Lunar/Artemis, orbital stations, rovers, and Mars). The core engine is written in **Rust** for deterministic performance, memory safety without garbage collection, and ultra-lightweight footprint—capable of running natively on constrained flight hardware or compiling to **WebAssembly (WASM)** for offline browser execution.

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
   - **Quantum Computing (QUBO / QML):** Combinatorial triage optimization—prioritizing which clinical protocols to run first under tight crew time and limited medical supply constraints—executed in deterministic Rust (with optional Qiskit bridge).
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
    ├── Cargo.toml                     # Zero-dependency Rust project manifest
    ├── src/
    │   └── main.rs                    # Spaceflight-grade Rust Clinical & QUBO Triage Engine
    ├── anamnesis_nanda_engine.json    # Clinical rule base linking NASA Hazards to NANDA-I
    └── quantum_triage_qubo.py         # Optional Python/Qiskit reference script
```

---

## 🛠️ Spaceflight-Grade Stack (Lightweight & Resource-Constrained)

| Layer | Technology | Why It Fits Space Missions |
| :--- | :--- | :--- |
| **Core Engine** | **Rust** (zero external crates / `no_std`-ready) | Memory-safe without garbage collection, deterministic latency, tiny binary, compiles to **WASM**. |
| **Frontend** | Lightweight Web UI / WASM (HTML + TypeScript) | Runs 100% offline inside the spacecraft cabin with minimal RAM/CPU usage. |
| **Multimodal** | Browser WebRTC + Web Speech API / lightweight CV | Webcam rPPG, photo capture, and hands-free voice input without heavy GPU requirements. |
| **Quantum** | Rust QUBO Solver + optional Qiskit Aer bridge | Runs QUBO triage optimization in microseconds on-device without needing quantum hardware. |

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
