"use strict";

// 1. Register Offline Service Worker (True offline-first for deep-space / blackout)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

// 2. Multilingual i18n for Onboard Task Planning (#planning)
const planningI18n = {
  en: {
    title: "Onboard task planning",
    lead: "Enter operational tasks and compare an exact schedule with an in-browser QAOA simulator and local Qiskit Aer. Keep crew and health data out of planning files.",
    budget: "Available minutes",
    tasks: "Tasks (up to 8)",
    format: "One task per line: task name | minutes (1–240) | priority points (1–100).",
    compare: "Compare schedules",
    download: "Download Qiskit input",
    sample: "Load sample lunar tasks",
    resultLabel: "Qiskit result file"
  },
  pt: {
    title: "Planejamento de tarefas a bordo",
    lead: "Informe tarefas operacionais e compare o cronograma exato com o simulador QAOA no navegador e o Qiskit Aer local. Mantenha dados de saúde e tripulação fora dos arquivos de planejamento.",
    budget: "Minutos disponíveis",
    tasks: "Tarefas (até 8)",
    format: "Uma tarefa por linha: nome da tarefa | minutos (1–240) | pontos de prioridade (1–100).",
    compare: "Comparar cronogramas",
    download: "Baixar entrada Qiskit",
    sample: "Carregar tarefas lunares",
    resultLabel: "Arquivo de resultado Qiskit"
  },
  es: {
    title: "Planificación de tareas a bordo",
    lead: "Ingresa tareas operativas y compara el horario exacto con el simulador QAOA en el navegador y Qiskit Aer local. Mantén los datos de salud fuera de estos archivos.",
    budget: "Minutos disponibles",
    tasks: "Tareas (hasta 8)",
    format: "Una tarea por línea: nombre | minutos (1–240) | puntos de prioridad (1–100).",
    compare: "Comparar horarios",
    download: "Descargar entrada Qiskit",
    sample: "Cargar tareas lunares",
    resultLabel: "Archivo de resultado Qiskit"
  },
  fr: {
    title: "Planification des tâches à bord",
    lead: "Saisissez des tâches opérationnelles et comparez le planning exact avec le simulateur QAOA intégré et Qiskit Aer local. Gardez les données de santé hors de ces fichiers.",
    budget: "Minutes disponibles",
    tasks: "Tâches (jusqu'à 8)",
    format: "Une tâche par ligne : nom | minutes (1–240) | points de priorité (1–100).",
    compare: "Comparer les plannings",
    download: "Télécharger l'entrée Qiskit",
    sample: "Charger tâches lunaires",
    resultLabel: "Fichier résultat Qiskit"
  }
};

const planningSection = document.getElementById("planning");
const planningForm = document.getElementById("planningForm");
const download = document.getElementById("planningDownload");
const resultFile = document.getElementById("planningResult");
const statusLine = document.getElementById("planningStatus");
const exactLine = document.getElementById("planningExact");
const quantumLine = document.getElementById("planningQuantum");
let plan;
let optimum;

// Enhance #planning DOM non-destructively while keeping all existing IDs intact
const planningHeader = document.createElement("div");
planningHeader.className = "section-heading";
const planningTitleEl = document.getElementById("planningTitle");
const titleWrap = document.createElement("div");
const qTag = document.createElement("span");
qTag.className = "tag";
qTag.textContent = "QAOA · QISKIT";
planningSection.insertBefore(planningHeader, planningTitleEl);
titleWrap.append(planningTitleEl);
planningHeader.append(titleWrap, qTag);

const sampleBtn = document.createElement("button");
sampleBtn.type = "button";
sampleBtn.className = "quiet";
sampleBtn.id = "planningSample";
sampleBtn.textContent = "Load sample lunar tasks";

const formActions = planningForm.querySelector(".actions");
formActions.append(sampleBtn);

const comparisonGrid = document.createElement("div");
comparisonGrid.className = "planning-grid";
comparisonGrid.hidden = true;

const exactCard = document.createElement("div");
exactCard.className = "planning-card";
const exactTitle = document.createElement("strong");
exactTitle.textContent = "Exact Classical Baseline";
exactCard.append(exactTitle, exactLine);

const quantumCard = document.createElement("div");
quantumCard.className = "planning-card quantum";
const quantumTitle = document.createElement("strong");
quantumTitle.textContent = "Quantum QAOA (Statevector / Qiskit)";
const circuitMeta = document.createElement("p");
circuitMeta.className = "hint";
quantumCard.append(quantumTitle, quantumLine, circuitMeta);

comparisonGrid.append(exactCard, quantumCard);

const histogramBox = document.createElement("div");
histogramBox.className = "quantum-histogram";
histogramBox.hidden = true;
const histTitle = document.createElement("h3");
histTitle.textContent = "Top Measured Quantum States (|bitstring⟩)";
const histBars = document.createElement("div");
histBars.className = "quantum-bars";
histogramBox.append(histTitle, histBars);

planningSection.append(comparisonGrid, histogramBox);

function applyPlanningLang(code) {
  const dict = planningI18n[code] || planningI18n.en;
  planningTitleEl.textContent = dict.title;
  const leadP = planningSection.querySelector(":scope > p");
  if (leadP) leadP.textContent = dict.lead;
  const budgetSpan = document.getElementById("planningBudget")?.previousElementSibling;
  if (budgetSpan) budgetSpan.textContent = dict.budget;
  const tasksSpan = document.getElementById("planningTasks")?.previousElementSibling;
  if (tasksSpan) tasksSpan.textContent = dict.tasks;
  const formatEl = document.getElementById("planningFormat");
  if (formatEl) formatEl.textContent = dict.format;
  const submitBtn = planningForm.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.textContent = dict.compare;
  download.textContent = dict.download;
  sampleBtn.textContent = dict.sample;
  const resSpan = resultFile?.previousElementSibling;
  if (resSpan) resSpan.textContent = dict.resultLabel;
}

const langSelect = document.getElementById("language");
if (langSelect) {
  applyPlanningLang(langSelect.value);
  langSelect.addEventListener("change", (e) => applyPlanningLang(e.target.value));
}

// 3. Media Upload Size Guard (prevents browser memory exhaustion on large videos)
const mediaInput = document.getElementById("media");
if (mediaInput) {
  mediaInput.addEventListener("change", (e) => {
    const oversized = [...e.target.files].find((f) => f.size > 25 * 1024 * 1024);
    if (oversized) {
      alert(`File "${oversized.name}" exceeds the 25 MB session preview limit.`);
      mediaInput.value = "";
    }
  }, true);
}

// 4. Optional Radiation & Space Pharmacy Fields + Interoperable FHIR/LOINC/ICF Export + PIN Encryption
const obsHeading = document.getElementById("observations");
const obsPanel = obsHeading?.closest("section.panel");
if (obsPanel) {
  const extraGrid = document.createElement("div");
  extraGrid.className = "grid two";
  extraGrid.innerHTML = `
    <label><span>Radiation dosimeter (mSv/day, optional)</span><input id="radiationDose" type="number" min="0" step="0.01" inputmode="decimal" placeholder="e.g. 0.45"></label>
    <label><span>Onboard medication / pharmacy note (optional)</span><input id="pharmacyNote" type="text" maxlength="140" placeholder="e.g. Ibuprofen 200mg (Kit B, verify radiation exposure)"></label>
  `;
  obsPanel.append(extraGrid);
}

// Add Interoperable FHIR/LOINC/ICF Export + Web Crypto PIN Lock in #history
const historyActions = document.querySelector(".history-actions");
if (historyActions) {
  const fhirBtn = document.createElement("button");
  fhirBtn.type = "button";
  fhirBtn.className = "secondary";
  fhirBtn.id = "exportFhir";
  fhirBtn.textContent = "Export FHIR / LOINC + ICF";

  const lockBtn = document.createElement("button");
  lockBtn.type = "button";
  lockBtn.className = "quiet";
  lockBtn.id = "encryptBackup";
  lockBtn.textContent = "Encrypt backup (PIN)";

  historyActions.append(fhirBtn, lockBtn);

  const LOINC_MAP = {
    heartRate: { code: "8867-4", display: "Heart rate", unit: "/min" },
    bloodPressure: { code: "85354-9", display: "Blood pressure panel", unit: "mm[Hg]" },
    temperature: { code: "8310-5", display: "Body temperature", unit: "Cel" },
    bloodGlucose: { code: "2339-0", display: "Glucose [Mass/volume] in Blood", unit: "mg/dL" }
  };

  const ICF_MAP = {
    "Mobility or balance": ["b760", "d410-d429"],
    "Vision": ["b210"],
    "Fine motor": ["d440"],
    "Cognitive focus": ["b140"],
    "Sleep": ["b134"],
    "Mood": ["b152"]
  };

  function getScopedRecords() {
    const raw = JSON.parse(localStorage.getItem("crew-health-check.records") || "[]");
    const scope = document.getElementById("historyScope")?.value;
    if (!scope) return raw;
    return raw.filter((r) => ((r.astronautCode && r.missionCode) ? `${r.astronautCode} / ${r.missionCode}` : "legacy") === scope);
  }

  function buildFhirBundle(records) {
    const preBaseline = records.find((r) => r.stage === "pre") || null;
    const radDose = document.getElementById("radiationDose")?.value || null;
    const pharmNote = document.getElementById("pharmacyNote")?.value?.trim() || null;

    return {
      resourceType: "Bundle",
      type: "collection",
      meta: {
        profile: ["NASA-STD-3001-Crew-Wellness-Prototype"],
        standards: ["HL7 FHIR R5", "LOINC", "WHO ICF", "NANDA-I/NIC/NOC", "WHO ICD-11 (Flight Surgeon review only)"]
      },
      timestamp: new Date().toISOString(),
      preFlightBaselineRef: preBaseline ? preBaseline.recordedAt : null,
      sessionContext: {
        radiationDosimeterMsvDay: radDose ? Number(radDose) : null,
        pharmacyNote: pharmNote
      },
      entry: records.map((rec) => ({
        resource: {
          resourceType: "Observation",
          status: "preliminary",
          effectiveDateTime: rec.recordedAt,
          subject: { display: rec.astronautCode || "CREW" },
          encounter: { display: `${rec.missionCode || "MISSION"} | ${rec.stage} | ${rec.mission?.gravity || ""}` },
          icfFunctionalDomains: (rec.functionChanges || []).flatMap((f) => ICF_MAP[f] || []),
          component: Object.entries(rec.measurements || {})
            .filter(([k]) => LOINC_MAP[k])
            .map(([k, val]) => ({
              code: { coding: [{ system: "http://loinc.org", code: LOINC_MAP[k].code, display: LOINC_MAP[k].display }] },
              valueString: String(val),
              unit: LOINC_MAP[k].unit
            })),
          note: [{ text: rec.description || rec.reason }]
        }
      }))
    };
  }

  fhirBtn.addEventListener("click", () => {
    const records = getScopedRecords();
    if (!records.length) {
      alert("No saved records in the selected scope to export.");
      return;
    }
    const bundle = buildFhirBundle(records);
    const url = URL.createObjectURL(new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "crew-wellness-fhir-loinc-icf.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  // Web Crypto AES-GCM + PBKDF2 Encrypted Backup (Zero External Dependencies)
  lockBtn.addEventListener("click", async () => {
    const records = getScopedRecords();
    if (!records.length) {
      alert("No saved records in the selected scope to encrypt.");
      return;
    }
    const pin = prompt("Enter a PIN/passphrase to encrypt your local backup (AES-256-GCM):");
    if (!pin) return;
    try {
      const enc = new TextEncoder();
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(pin), "PBKDF2", false, ["deriveKey"]);
      const key = await crypto.subtle.deriveKey(
        { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt"]
      );
      const payload = enc.encode(JSON.stringify(buildFhirBundle(records)));
      const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, payload);
      const out = {
        format: "crew-wellness-aes256gcm-v1",
        kdf: "PBKDF2-SHA256-100k",
        salt: Array.from(salt),
        iv: Array.from(iv),
        ciphertext: Array.from(new Uint8Array(ciphertext))
      };
      const url = URL.createObjectURL(new Blob([JSON.stringify(out, null, 2)], { type: "application/json" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "crew-wellness-encrypted-backup.json";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      alert("Web Crypto API is unavailable in this browser context.");
    }
  });
}

// 5. QAOA Scoring & Statevector Simulator
function score(bits) {
  return plan.tasks.reduce((total, task, index) => {
    if (bits[index]) {
      total.minutes += task.duration;
      total.points += task.value;
      total.names.push(task.name);
    }
    return total;
  }, { minutes: 0, points: 0, names: [] });
}

function describe(result) {
  return result.minutes + " min / " + result.points + " points — " + (result.names.join(", ") || "No tasks selected");
}

function runBrowserQaoa(tasks, budget) {
  const n = tasks.length;
  const dim = 1 << n;
  const penalty = 2.0;

  const costs = new Float64Array(dim);
  let maxAbs = 1;
  for (let mask = 0; mask < dim; mask++) {
    let mins = 0;
    let pts = 0;
    for (let i = 0; i < n; i++) {
      if ((mask >> i) & 1) {
        mins += tasks[i].duration;
        pts += tasks[i].value;
      }
    }
    const excess = Math.max(0, mins - budget);
    const c = -pts + penalty * excess * excess;
    costs[mask] = c;
    if (Math.abs(c) > maxAbs) maxAbs = Math.abs(c);
  }
  for (let mask = 0; mask < dim; mask++) costs[mask] /= maxAbs;

  let bestExpectation = Infinity;
  let bestProbs = null;
  let bestGamma = 0.8;
  let bestBeta = 0.4;

  const invSqrtDim = 1 / Math.sqrt(dim);
  const re = new Float64Array(dim);
  const im = new Float64Array(dim);

  for (let gIdx = 1; gIdx <= 5; gIdx++) {
    const gamma = gIdx * 0.45;
    for (let bIdx = 1; bIdx <= 5; bIdx++) {
      const beta = bIdx * 0.25;

      for (let m = 0; m < dim; m++) {
        const angle = -gamma * costs[m];
        re[m] = invSqrtDim * Math.cos(angle);
        im[m] = invSqrtDim * Math.sin(angle);
      }

      const cb = Math.cos(beta);
      const sb = Math.sin(beta);
      for (let q = 0; q < n; q++) {
        const bit = 1 << q;
        for (let m = 0; m < dim; m++) {
          if ((m & bit) === 0) {
            const m1 = m | bit;
            const r0 = re[m], i0 = im[m];
            const r1 = re[m1], i1 = im[m1];
            re[m] = cb * r0 + sb * i1;
            im[m] = cb * i0 - sb * r1;
            re[m1] = cb * r1 + sb * i0;
            im[m1] = cb * i1 - sb * r0;
          }
        }
      }

      let expVal = 0;
      const probs = new Float64Array(dim);
      for (let m = 0; m < dim; m++) {
        const p = re[m] * re[m] + im[m] * im[m];
        probs[m] = p;
        expVal += p * costs[m];
      }

      if (expVal < bestExpectation) {
        bestExpectation = expVal;
        bestProbs = probs;
        bestGamma = gamma;
        bestBeta = beta;
      }
    }
  }

  const ranked = [];
  for (let m = 0; m < dim; m++) {
    ranked.push({ mask: m, prob: bestProbs[m] });
  }
  ranked.sort((a, b) => b.prob - a.prob);

  let chosenMask = ranked[0].mask;
  for (const item of ranked.slice(0, 16)) {
    const bits = tasks.map((_, i) => (item.mask >> i) & 1);
    if (score(bits).minutes <= budget) {
      chosenMask = item.mask;
      break;
    }
  }

  return {
    bits: tasks.map((_, i) => (chosenMask >> i) & 1),
    gamma: bestGamma,
    beta: bestBeta,
    topStates: ranked.slice(0, 5).map((item) => ({
      ket: "|" + tasks.map((_, i) => (item.mask >> i) & 1).join("") + "⟩",
      prob: item.prob
    }))
  };
}

function renderHistogram(topStates) {
  histBars.replaceChildren();
  topStates.forEach((st) => {
    const row = document.createElement("div");
    row.className = "q-bar-row";
    const pct = (st.prob * 100).toFixed(1);
    const label = document.createElement("code");
    label.textContent = st.ket;
    const track = document.createElement("div");
    track.className = "q-bar-track";
    const fill = document.createElement("div");
    fill.className = "q-bar-fill";
    fill.style.width = Math.min(100, st.prob * 220) + "%";
    track.append(fill);
    const val = document.createElement("span");
    val.textContent = pct + "%";
    row.append(label, track, val);
    histBars.append(row);
  });
  histogramBox.hidden = false;
}

sampleBtn.addEventListener("click", () => {
  document.getElementById("planningBudget").value = "45";
  document.getElementById("planningTasks").value = [
    "Inspect airlock seal | 15 | 40",
    "Calibrate radiation dosimeter | 10 | 35",
    "Clean CO2 scrubber filter | 20 | 45",
    "Inventory medical kit | 12 | 25",
    "Verify EVA suit battery | 18 | 38"
  ].join("\n");
  planningForm.dispatchEvent(new Event("input"));
  statusLine.textContent = "Sample lunar operational tasks loaded. Click 'Compare schedules'.";
});

planningForm.addEventListener("input", () => {
  plan = undefined;
  download.disabled = resultFile.disabled = true;
  comparisonGrid.hidden = histogramBox.hidden = true;
  statusLine.textContent = exactLine.textContent = quantumLine.textContent = circuitMeta.textContent = "";
  resultFile.value = "";
});

planningForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const lines = document.getElementById("planningTasks").value.split(/\r?\n/).filter((line) => line.trim());
  const tasks = [];
  for (const line of lines) {
    const parts = line.split("|").map((part) => part.trim());
    const [name, duration, value] = parts;
    if (parts.length !== 3 || !name || name.length > 100 || !/^\d+$/.test(duration) ||
        !/^\d+$/.test(value) || +duration < 1 || +duration > 240 || +value < 1 || +value > 100) {
      statusLine.textContent = "Check each line: name (up to 100 characters) | minutes (1–240) | points (1–100).";
      return;
    }
    tasks.push({ name, duration: +duration, value: +value });
  }
  if (!tasks.length || tasks.length > 8) {
    statusLine.textContent = "Enter between one and eight tasks.";
    return;
  }

  plan = { budget: +document.getElementById("planningBudget").value, tasks };
  optimum = score([]);
  for (let mask = 1; mask < 2 ** tasks.length; mask++) {
    const candidate = score(tasks.map((_, index) => (mask >> index) & 1));
    if (candidate.minutes <= plan.budget && candidate.points > optimum.points) optimum = candidate;
  }

  const qaoa = runBrowserQaoa(tasks, plan.budget);
  const qaoaResult = score(qaoa.bits);
  const gap = optimum.points - qaoaResult.points;
  const matchNote = qaoaResult.minutes > plan.budget
    ? "exceeds budget"
    : gap === 0
      ? "matches exact optimum"
      : gap + " points below exact optimum";

  exactLine.textContent = describe(optimum);
  quantumLine.textContent = "In-browser QAOA (p=1): " + describe(qaoaResult) + " (" + matchNote + ").";
  circuitMeta.textContent = `Circuit: ${tasks.length} qubits · 1 QAOA layer (γ=${qaoa.gamma.toFixed(2)}, β=${qaoa.beta.toFixed(2)}) · 2^${tasks.length} = ${1 << tasks.length} states`;
  comparisonGrid.hidden = false;
  renderHistogram(qaoa.topStates);

  statusLine.textContent = "Live QAOA comparison ready. Optionally download plan.json to verify on local Qiskit Aer.";
  download.disabled = resultFile.disabled = false;
});

download.addEventListener("click", () => {
  const url = URL.createObjectURL(new Blob([JSON.stringify(plan, null, 2)], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "plan.json";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

resultFile.addEventListener("change", async () => {
  const file = resultFile.files[0];
  if (!file) return;
  const currentPlan = plan;
  try {
    if (file.size > 16384) throw new Error();
    const output = JSON.parse(await file.text());
    if (plan !== currentPlan) return;
    if (output.method !== "qiskit-qaoa" || output.plan?.budget !== plan.budget ||
        JSON.stringify(output.plan?.tasks) !== JSON.stringify(plan.tasks) ||
        !Array.isArray(output.bits) || output.bits.length !== plan.tasks.length ||
        !output.bits.every((bit) => bit === 0 || bit === 1)) throw new Error();
    const result = score(output.bits);
    const comparison = result.minutes > plan.budget ? "exceeds available time" :
      result.points === optimum.points ? "matches the exact optimum" :
      (optimum.points - result.points) + " points below the exact optimum";
    quantumLine.textContent = "Imported Qiskit QAOA result: " + describe(result) + " (" + comparison + ").";
    circuitMeta.textContent = "Source: Local Python Qiskit Aer simulator (result.json)";
    statusLine.textContent = "Qiskit verification complete.";
  } catch {
    if (plan === currentPlan) statusLine.textContent = "Choose a Qiskit result generated from the current plan.";
  } finally {
    resultFile.value = "";
  }
});
