// AstroCare-Q | Offline-First Client Engine (Mirrors mvp/src/main.rs QUBO & NANDA-I Logic)

const ZONES = {
  head: {
    title: "Head & Neuro-Ocular",
    status: "amber",
    statusLabel: "AMBER · Monitor SANS",
    why: "Microgravity shifts ~2,000 mL of fluid headward, raising intracranial venous pressure and SANS risk.",
    metrics: [
      { label: "Sleep (Last Night)", value: "5.4 h" },
      { label: "Amsler Grid", value: "Pending" },
      { label: "Cognitive Load", value: "Moderate" }
    ],
    guidance: "Nursing (NANDA 00204/00198): Run Amsler grid test, reduce dietary sodium (Nutrition), and activate warm cabin light (Psychology)."
  },
  thorax: {
    title: "Thorax & Cardiovascular",
    status: "nominal",
    statusLabel: "GREEN · Nominal",
    why: "Weightlessness alters baroreflex and cardiac stroke volume; contactless rPPG tracks trends without electrodes.",
    metrics: [
      { label: "Resting HR (rPPG)", value: "72 bpm" },
      { label: "Blood Pressure", value: "116/74" },
      { label: "HRV", value: "Nominal" }
    ],
    guidance: "Nursing & Exercise: Maintain daily aerobic countermeasure and repeat 10s webcam rPPG after EVA."
  },
  metabolism: {
    title: "Metabolism & Nutrition",
    status: "nominal",
    statusLabel: "GREEN · Nominal",
    why: "Hydration and electrolyte balance prevent spaceflight kidney stones and orthostatic intolerance.",
    metrics: [
      { label: "Blood Glucose", value: "94 mg/dL" },
      { label: "Hydration", value: "2.2 L" },
      { label: "Body Temp", value: "36.7 °C" }
    ],
    guidance: "Nutrition: Target 2.5L fluid intake with balanced electrolytes."
  },
  skin: {
    title: "Skin & Immune",
    status: "nominal",
    statusLabel: "GREEN · Nominal",
    why: "Space radiation and closed-cabin microbiome shifts increase skin irritation and latent viral reactivation.",
    metrics: [
      { label: "Quantum Dosimeter", value: "0.45 mSv/d" },
      { label: "Skin Inspection", value: "Clear" },
      { label: "Immune Flag", value: "Low" }
    ],
    guidance: "Pharmacy & Nursing: Log any rash via photo and verify medical kit radiation exposure before dosing."
  },
  musculoskeletal: {
    title: "Musculoskeletal",
    status: "amber",
    statusLabel: "AMBER · Countermeasure Due",
    why: "Weight-bearing bones lose ~1–1.5% mineral density per month in microgravity without resistive loading.",
    metrics: [
      { label: "ARED Session", value: "Scheduled" },
      { label: "Bone Risk", value: "Moderate" },
      { label: "Vestibular", value: "Stable" }
    ],
    guidance: "Physiotherapy (NANDA 00085): Complete 45-min ARED resistive session and log post-exercise soreness."
  }
};

// Navigation Tabs (3 Core Views)
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(`view-${btn.dataset.view}`).classList.add("active");
  });
});

function setZoneStatus(zoneKey, status, label) {
  ZONES[zoneKey].status = status;
  ZONES[zoneKey].statusLabel = label;
  const svgNode = document.getElementById(`svg-zone-${zoneKey}`);
  if (svgNode) {
    svgNode.classList.remove("status-nominal", "status-amber", "status-red");
    svgNode.classList.add(`status-${status}`);
  }
  updateGlobalStatusDot();
}

function updateGlobalStatusDot() {
  const statuses = Object.values(ZONES).map((z) => z.status);
  const dot = document.getElementById("globalStatusDot");
  dot.classList.remove("nominal", "amber", "red");
  if (statuses.includes("red")) dot.classList.add("red");
  else if (statuses.includes("amber")) dot.classList.add("amber");
  else dot.classList.add("nominal");
}

// Body Zone Selection
function renderZone(zoneKey) {
  const z = ZONES[zoneKey];
  if (!z) return;
  document.getElementById("zoneTitle").textContent = z.title;
  const pill = document.getElementById("zoneStatusPill");
  pill.textContent = z.statusLabel;
  pill.className = `pill ${z.status}`;
  document.getElementById("zoneWhy").textContent = z.why;
  document.getElementById("zoneGuidance").textContent = z.guidance;

  const metricsEl = document.getElementById("zoneMetrics");
  metricsEl.innerHTML = z.metrics
    .map((m) => `<div class="metric-box"><span>${m.label}</span><strong>${m.value}</strong></div>`)
    .join("");
}

document.querySelectorAll(".zone-node").forEach((node) => {
  node.addEventListener("click", () => renderZone(node.dataset.zone));
});

// Environment Gravity Selector
document.getElementById("gravitySelect").addEventListener("change", (e) => {
  const labels = {
    "0g": "0g Microgravity",
    "0.16g": "0.16g Lunar Base",
    "0.38g": "0.38g Mars Surface",
    "1g": "1.0g Earth Return"
  };
  document.getElementById("envBadge").textContent = labels[e.target.value];
});

// Lightweight 7-Day SVG Trend Chart
function renderTrendChart(latestHr = 72) {
  const svg = document.getElementById("trendChart");
  const hrPoints = [68, 70, 71, 74, 73, 76, Math.min(120, Math.max(50, latestHr))];
  const coords = hrPoints
    .map((val, idx) => {
      const x = 25 + idx * 58;
      const y = 95 - (val - 55) * 1.4;
      return `${x},${y}`;
    })
    .join(" ");

  svg.innerHTML = `
    <polyline fill="none" stroke="#38bdf8" stroke-width="2.5" points="${coords}" />
    ${hrPoints
      .map((val, idx) => {
        const x = 25 + idx * 58;
        const y = 95 - (val - 55) * 1.4;
        return `<circle cx="${x}" cy="${y}" r="3.5" fill="#38bdf8" />
                <text x="${x}" y="106" text-anchor="middle" fill="#9ca3af" font-size="9">D-${6 - idx}</text>`;
      })
      .join("")}
  `;
}

// Symptom Chips + Keyword Auto-Detection
const selectedSymptoms = new Set();
function toggleSymptom(key, forceState = null) {
  const chip = document.querySelector(`.chip[data-symptom="${key}"]`);
  const shouldSelect = forceState !== null ? forceState : !selectedSymptoms.has(key);
  if (shouldSelect) {
    selectedSymptoms.add(key);
    chip?.classList.add("selected");
  } else {
    selectedSymptoms.delete(key);
    chip?.classList.remove("selected");
  }
}

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => toggleSymptom(chip.dataset.symptom));
});

function detectKeywords(text) {
  const lower = text.toLowerCase();
  if (/vision|blur|eye|headache|ocular/.test(lower)) toggleSymptom("blurred_vision", true);
  if (/sleep|insomnia|tired|fatigue/.test(lower)) toggleSymptom("poor_sleep", true);
  if (/rash|skin|red|burn|radiation/.test(lower)) toggleSymptom("radiation_skin", true);
  if (/dizzy|thirst|dehydrat|heart/.test(lower)) toggleSymptom("dehydration", true);
  if (/stand|balance|fall|faint/.test(lower)) toggleSymptom("orthostatic", true);
}

document.getElementById("anamnesisNotes").addEventListener("input", (e) => {
  detectKeywords(e.target.value);
});

// Amsler Grid Quick Check
document.getElementById("toggleAmslerBtn").addEventListener("click", () => {
  document.getElementById("amslerPanel").classList.toggle("hidden");
});

document.getElementById("flagAmslerBtn").addEventListener("click", () => {
  toggleSymptom("blurred_vision", true);
  ZONES.head.metrics[1].value = "Distorted";
  renderZone("head");
  document.getElementById("flagAmslerBtn").textContent = "Distortion Flagged ✓";
});

// Voice Dictation (Web Speech API)
document.getElementById("voiceBtn").addEventListener("click", () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const statusEl = document.getElementById("voiceStatus");
  if (!SpeechRecognition) {
    statusEl.textContent = "Voice API unavailable in this browser. Type or tap symptoms below.";
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  statusEl.textContent = "Listening... speak your symptoms clearly.";
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById("anamnesisNotes").value = transcript;
    detectKeywords(transcript);
    statusEl.textContent = "Voice captured & keywords mapped to SOAP Subjective.";
  };
  recognition.onerror = () => {
    statusEl.textContent = "Microphone permission denied or unavailable.";
  };
  recognition.start();
});

// Webcam rPPG Green-Channel Scan & Photo Capture
document.getElementById("cameraBtn").addEventListener("click", async () => {
  const video = document.getElementById("webcamPreview");
  const placeholder = document.getElementById("mediaPlaceholder");
  const actions = document.getElementById("cameraActions");
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    placeholder.textContent = "Camera unavailable. Using manual/simulated rPPG vitals.";
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.classList.remove("hidden");
    placeholder.classList.add("hidden");
    actions.classList.remove("hidden");
  } catch {
    placeholder.textContent = "Camera access declined. Using manual/simulated rPPG vitals.";
  }
});

document.getElementById("photoSnapBtn").addEventListener("click", () => {
  const video = document.getElementById("webcamPreview");
  const canvas = document.getElementById("captureCanvas");
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  canvas.classList.remove("hidden");
  document.getElementById("rppgStatus").textContent = "Photo captured for SOAP record.";
});

document.getElementById("rppgScanBtn").addEventListener("click", () => {
  const video = document.getElementById("webcamPreview");
  const canvas = document.getElementById("captureCanvas");
  const ctx = canvas.getContext("2d");
  const status = document.getElementById("rppgStatus");
  const samples = [];
  const start = performance.now();
  const durationMs = 6000;

  status.textContent = "Scanning green-channel PPG (6s)... hold still.";

  const timer = setInterval(() => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frame = ctx.getImageData(50, 30, 60, 60).data;
    let greenSum = 0;
    for (let i = 1; i < frame.length; i += 4) greenSum += frame[i];
    samples.push(greenSum / (frame.length / 4));

    if (performance.now() - start >= durationMs) {
      clearInterval(timer);
      // Estimate peaks above moving mean
      const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
      let peaks = 0;
      for (let i = 1; i < samples.length - 1; i++) {
        if (samples[i] > mean && samples[i] > samples[i - 1] && samples[i] > samples[i + 1]) {
          peaks++;
        }
      }
      const estimatedBpm = Math.min(130, Math.max(58, Math.round((peaks / (durationMs / 1000)) * 60)));
      document.getElementById("inputHr").value = estimatedBpm;
      ZONES.thorax.metrics[0].value = `${estimatedBpm} bpm`;
      renderTrendChart(estimatedBpm);
      status.textContent = `rPPG Complete: ${estimatedBpm} bpm`;
    }
  }, 100);
});

// QUBO Triage Solver (Mirrors mvp/src/main.rs)
function solveQuboTriage(protocols, maxTime, maxSupplies) {
  const n = protocols.length;
  const penalty = 2.5;
  let bestEnergy = Infinity;
  let bestMask = 0;

  for (let mask = 0; mask < (1 << n); mask++) {
    let benefit = 0;
    let time = 0;
    let supplies = 0;

    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        benefit += protocols[i].benefit;
        time += protocols[i].time;
        supplies += protocols[i].supplies;
      }
    }

    const timeExcess = Math.max(0, time - maxTime);
    const supplyExcess = Math.max(0, supplies - maxSupplies);
    const energy = -benefit + penalty * (timeExcess * timeExcess * 0.1 + supplyExcess * supplyExcess);

    if (timeExcess === 0 && supplyExcess === 0 && energy < bestEnergy) {
      bestEnergy = energy;
      bestMask = mask;
    }
  }

  return protocols.filter((_, i) => bestMask & (1 << i));
}

let lastSoapSummary = "";

document.getElementById("runTriageBtn").addEventListener("click", () => {
  const env = document.getElementById("gravitySelect").value;
  const hr = parseFloat(document.getElementById("inputHr").value) || 75;
  const sleep = parseFloat(document.getElementById("inputSleep").value) || 6.5;
  const dose = parseFloat(document.getElementById("inputDose").value) || 0.45;
  const maxTime = parseInt(document.getElementById("inputMaxTime").value, 10) || 30;
  const notes = document.getElementById("anamnesisNotes").value.trim();

  renderTrendChart(hr);
  const candidates = [];

  if (selectedSymptoms.has("blurred_vision")) {
    setZoneStatus("head", "red", "RED · Suspected SANS");
    candidates.push({
      id: "P1",
      name: "SANS Amsler Grid Screening + Low-Sodium Protocol",
      nanda: "NANDA 00204",
      disciplines: "Nursing + Nutrition + Medicine",
      severity: "red",
      benefit: env === "0g" ? 9.5 : 8.2,
      time: 8,
      supplies: 0,
      action: "Perform Amsler grid test, cut dietary sodium, and transmit SOAP alert to Flight Surgeon."
    });
  }

  if (selectedSymptoms.has("poor_sleep") || sleep < 5.5) {
    if (!selectedSymptoms.has("blurred_vision")) setZoneStatus("head", "amber", "AMBER · Sleep Pattern");
    candidates.push({
      id: "P2",
      name: "Warm Cabin Lighting + 4-7-8 Guided Breathing",
      nanda: "NANDA 00198",
      disciplines: "Nursing + Psychology",
      severity: "amber",
      benefit: 6.8,
      time: 15,
      supplies: 0,
      action: "Switch cabin lights to warm spectrum and execute 4-7-8 breathing before rest cycle."
    });
  }

  if (selectedSymptoms.has("radiation_skin") || dose > 1.0) {
    setZoneStatus("skin", "red", "RED · Radiation Alert");
    candidates.push({
      id: "P3",
      name: "Shielded Module Relocation + Skin Barrier & Med-Kit Check",
      nanda: "NANDA 00046",
      disciplines: "Nursing + Pharmacy + Medicine",
      severity: "red",
      benefit: 8.9,
      time: 12,
      supplies: 2,
      action: "Relocate to shielded module, verify med-kit radiation potency, and log skin photo in 12h."
    });
  }

  if (selectedSymptoms.has("dehydration") || hr > 100) {
    setZoneStatus("thorax", "amber", "AMBER · Fluid / HR Alert");
    candidates.push({
      id: "P4",
      name: "Fractionated Electrolyte Rehydration + Repeat Video rPPG",
      nanda: "NANDA 00027",
      disciplines: "Nursing + Nutrition",
      severity: "amber",
      benefit: 8.4,
      time: 10,
      supplies: 1,
      action: "Sip 500mL electrolyte solution and repeat contactless webcam rPPG in 30 minutes."
    });
  }

  if (selectedSymptoms.has("orthostatic") && env !== "0g") {
    setZoneStatus("musculoskeletal", "red", "RED · Orthostatic Hold");
    candidates.push({
      id: "P5",
      name: "Graded Orthostatic & Vestibular Rehab (Hold EVA)",
      nanda: "NANDA 00085",
      disciplines: "Physiotherapy + Nursing",
      severity: "red",
      benefit: 8.6,
      time: 10,
      supplies: 0,
      action: "Remain seated, perform vestibular gaze stabilization, and hold EVA clearance."
    });
  }

  const resultCard = document.getElementById("triageResultCard");
  const resultsEl = document.getElementById("triageResults");
  resultCard.classList.remove("hidden");

  if (candidates.length === 0) {
    resultsEl.innerHTML = `<div class="protocol-item"><strong>Nominal Status (Green):</strong> No acute triggers detected. Continue routine countermeasures.</div>`;
    lastSoapSummary = JSON.stringify({ environment: env, hr_bpm: hr, sleep_h: sleep, dosimeter_msv_day: dose, status: "Nominal" }, null, 2);
    return;
  }

  const prioritized = solveQuboTriage(candidates, maxTime, 2);
  resultsEl.innerHTML = prioritized
    .map(
      (p) => `
      <div class="protocol-item ${p.severity}">
        <strong>[${p.id}] ${p.name}</strong> (${p.nanda} · ${p.disciplines})<br/>
        <span class="hint">Time: ${p.time} min · Supplies: ${p.supplies} unit(s) · Priority Score: ${p.benefit}</span>
        <p>${p.action}</p>
      </div>`
    )
    .join("");

  lastSoapSummary = JSON.stringify(
    {
      timestamp_utc: new Date().toISOString(),
      environment: env,
      subjective: notes || Array.from(selectedSymptoms),
      objective: { hr_bpm: hr, sleep_h: sleep, dosimeter_msv_day: dose },
      qubo_prioritized: prioritized.map((p) => `${p.id} (${p.nanda}): ${p.name}`)
    },
    null,
    2
  );
});

document.getElementById("exportSoapBtn").addEventListener("click", async () => {
  if (!lastSoapSummary) return;
  try {
    await navigator.clipboard.writeText(lastSoapSummary);
    document.getElementById("exportSoapBtn").textContent = "Copied!";
    setTimeout(() => {
      document.getElementById("exportSoapBtn").textContent = "Copy SOAP";
    }, 1500);
  } catch {
    alert(lastSoapSummary);
  }
});

document.getElementById("downloadSoapBtn").addEventListener("click", () => {
  if (!lastSoapSummary) return;
  const blob = new Blob([lastSoapSummary], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `astrocare-q-soap-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

// Routine Checklist Readiness Score
function updateReadiness() {
  const boxes = document.querySelectorAll('#routineList input[type="checkbox"]');
  const checked = Array.from(boxes).filter((b) => b.checked).length;
  const pct = Math.round((checked / boxes.length) * 100);
  document.getElementById("readinessBadge").textContent = `Readiness: ${pct}%`;
  document.getElementById("readinessBar").style.width = `${pct}%`;
}

document.querySelectorAll('#routineList input[type="checkbox"]').forEach((box) => {
  box.addEventListener("change", updateReadiness);
});

// Initial render
renderZone("head");
renderTrendChart();
updateReadiness();
updateGlobalStatusDot();
