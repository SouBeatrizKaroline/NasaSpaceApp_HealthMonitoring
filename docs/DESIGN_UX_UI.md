# Design & UX/UI — Low Cognitive Load Principle

## 1. Design Philosophy
In hostile space environments, **simplicity is safety**. Interfaces packed with simultaneous charts, deep nested menus, and excessive visual noise increase human error.

**Golden Design Rules:**
1. **Maximum of 3 Core Views:** No deep menu hierarchies.
2. **Universal Clinical Color Coding:**
   - 🟢 **Nominal (`#22C55E`):** Indicators within expected range for the active mission environment.
   - 🟡 **Attention (`#F59E0B`):** Mild deviation; requires self-care intervention (NANDA-I).
   - 🔴 **Critical (`#EF4444`):** High clinical risk; requires immediate protocol and Flight Surgeon notification.
3. **Cabin Dark Mode (`#0B0F19`):** Reduces eye strain under controlled spacecraft lighting and saves power on OLED displays.
4. **Accessible Language:** Every clinical label (e.g., *NANDA-I 00198*) is paired with a plain-language explanation and "why this measurement matters."

---

## 2. Three-View Information Architecture

### View 1: Body Dashboard & Mission Status (Home)
- **Center:** Clean vector human silhouette (SVG) with **5 clickable zones**:
  1. *Head & Neuro-Ocular* (SANS, sleep, stress, headache)
  2. *Thorax & Cardiovascular* (HR, BP, HRV, respiration)
  3. *Metabolism & Nutrition* (blood glucose, hydration, temperature)
  4. *Musculoskeletal* (microgravity bone/muscle loss)
  5. *Skin & Immune* (lesions, rashes, radiation exposure)
- **Right Panel:** Selected zone detail card + **1 dynamic trend chart** (7-day history) + environment selector (*Spacecraft / Station / Rover / Base*).

### View 2: Quick Multimodal Check-in (3-Step Flow)
- **Step 1 — Complaint & Voice:** Single microphone button ("Speak how you feel") or quick symptom tap.
- **Step 2 — Multimodal Evidence:**
  - **Photo** upload/capture (skin, eye, test strip)
  - **Video** measurement (15s camera pulse rPPG)
  - Quick **Vitals** input (BP, blood sugar, temperature, sleep hours)
- **Step 3 — Diagnosis & Action:**
  - Displays **Nursing Diagnosis (NANDA-I)** + **Immediate Self-Care Action**
  - Displays **Medical Alert / Quantum Triage Priority** (when triggered).

### View 3: Mission Routine & Micro-Gamification
- Lean daily preventive checklist (e.g., *Resistive Exercise 45m*, *Hydration 2.5L*, *Mood Check-in*).
- Subtle **Mission Readiness Score** progress bar—clean and scientific, avoiding childish gamification tropes.
