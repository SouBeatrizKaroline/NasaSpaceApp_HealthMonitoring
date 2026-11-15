# Crew Health Check — Onboard Mission Wellness & Ground Handoff

> **2026 NASA Space Apps Challenge** · *Create Health Monitoring Software for Astronauts on Space Missions*

**Crew Health Check** is a calm, offline-first onboard health logging and ground handoff prototype designed for long-duration space missions. It separates **private crew self-reporting** from **operational task planning** and avoids automated medical diagnoses.

---

## 🎯 Core Navigation & Journey

1. **Today:** Displays the active Crew ID (local device identifier), Mission code, Mission phase, Mission day (when known), last saved check-in, and offline status (`Works offline`), with a clear primary action (**Start check-in →** or **Continue check-in →**).
2. **Check-in (4-Step Guided Flow):**
   - *Step 1 · Mission context:* `Preflight`, `In flight`, or `Recovery`, gravity environment (`1.00 g`, `~0 g`, `0.17 g`, `0.38 g`) with built-in guidance, and optional mission day.
   - *Step 2 · Observations:* Free-text notes, optional hands-free voice dictation, and functional impact tags.
   - *Step 3 · Optional measurements:* Heart rate (`bpm`), blood pressure (`mmHg`), temperature (`°C`), blood glucose (`mg/dL`), sleep (`h`), and source. Blank fields remain blank.
   - *Step 4 · Review & Save:* Review cards with per-section **Edit** links, saving locally with **Saved onboard** confirmation.
3. **Mission History:** Longitudinal view across `Preflight`, `In flight`, and `Recovery`, highlighting changes relative to the `Preflight` baseline, flagging missing stages/measurements, and exporting a structured JSON report (`Saved onboard` → `Ready to export` → `Report exported`).
4. **Ground Review:** Imports and validates the exported JSON report, rendering observations, measurements, units, sources, preflight deltas, and recording gaps (with clear error handling for invalid files).
5. **Task Planning:** Operational scheduler comparing **Exact Classical Enumeration** against an **In-Browser Quantum QAOA Simulator** (and optional local **Python Qiskit Aer** verification via `plan.json` / `result.json`), keeping crew IDs and health data strictly out of planning files.

---

## 🚀 Running the Demo

### Option A: Open Locally or Deploy on Vercel
- **Local:** Serve `web/` (e.g., `npx serve web` or `python -m http.server -d web 8080`) and open `http://localhost:8080`.
- **Vercel:** Set **Root Directory** to `web` and **Framework Preset** to `Other` (zero build step required).

### Option B: Verify Qiskit Locally (Optional)
```bash
python -m pip install -r mvp/requirements-quantum.txt
python mvp/quantum_task_scheduling.py plan.json result.json
```

---

## 🎤 2-Minute Jury Demo Script

1. **Open Profile:** Enter `C-104` and `ARTEMIS-4` on the profile screen.
2. **Preflight Baseline:** Complete a quick `Preflight` check-in (e.g., resting HR `68 bpm`, sleep `7.5 h`) → **Save onboard**.
3. **In-Flight Update:** Click **Start check-in**, switch to `In flight` (`~0 g`), enter an observation (e.g., *"Mild morning headache"*), enter HR `78 bpm` (leaving other fields blank), and save.
4. **Mission History & Export:** Open **Mission History** to inspect the Preflight delta (`+10 bpm`), missing `Recovery` flag, and click **Export structured report (JSON)** (`Report exported`).
5. **Ground Review:** Open **Ground Review**, import the exported `.json` file, and verify all values, units, sources, and recording gaps render cleanly.
6. **Task Planning:** Open **Task Planning**, click **Load lunar sample**, and run **Compare schedules** to view Classical vs. QAOA Quantum results.

---

## ✅ What Works Today vs. Future Integrations

| Capability | Works Today (MVP) | Future Integration |
| :--- | :--- | :--- |
| **Offline Persistence** | `localStorage` + Service Worker (`sw.js`) | Encrypted spacecraft onboard database sync |
| **Ground Handoff** | Structured JSON export & validated **Ground Review** import | Automated DTN / Deep-Space Network transmission to Flight Surgeons |
| **Quantum Scheduling** | In-browser $p=1$ QAOA statevector simulator + local Qiskit Aer CLI | Remote IBM Quantum hardware execution for larger operational schedules |
