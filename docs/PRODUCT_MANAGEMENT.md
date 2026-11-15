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

## 3. Why Rust as the Core Language?
Spacecraft and rover flight computers operate under strict CPU, RAM, and reliability limits:
- **Memory Safety Without Garbage Collection:** Eliminates runtime pauses and memory leaks during critical medical alerts.
- **Ultra-Lightweight Footprint:** Compiles to a tiny native binary (`no_std`-compatible) or **WebAssembly (WASM)** to run directly in an offline cabin browser with zero backend overhead.

---

## 4. Lean Scope: MVP (Hackathon) vs. Post-Hackathon

### ✅ Phase 1 — Functional MVP (48h Hackathon)
- **Rust Core Engine (`mvp/src/main.rs`):** Zero-dependency clinical anamnesis evaluator + QUBO triage optimizer.
- **Interactive Body Map (SVG):** 5 clickable anatomical zones with color-coded status (Green / Amber / Red).
- **Guided Micro-Anamnesis (3 Steps):** Chief complaint + 3 adaptive questions + vital signs.
- **Lightweight Multimodal Capture:**
  - *Webcam:* Basic pulse estimation (rPPG) or skin/facial photo capture.
  - *Voice:* Spoken chief complaint dictation (Web Speech API) with keyword extraction.
- **Environment Mode:** Context selector (*Spacecraft*, *Space Station*, *Rover*, *Lunar/Mars Base*) that adjusts risk thresholds.

### 🔭 Phase 2 — Post-Hackathon Evolution
- Compile Rust core to **WASM** for seamless offline browser execution and native embedded telemetry.
- Real BLE wearable integration and live quantum dosimeter telemetry.
- Asynchronous post-quantum encrypted (PQC) sync to the Ground Flight Surgeon dashboard.

---

## 5. Success Metrics (KPIs)
- **Check-in Time:** < 90 seconds from start to actionable plan.
- **Adherence Rate:** > 85% daily check-in completion (supported by subtle mission-readiness gamification).
- **Decision Clarity:** 100% of critical alerts paired with step-by-step plain-language instructions.
