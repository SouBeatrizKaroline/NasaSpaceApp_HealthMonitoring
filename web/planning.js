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
    lead: "Balance operational tasks against available crew time using an exact baseline and a live QAOA quantum simulator. Health data stays out of planning files.",
    budget: "Available minutes",
    tasks: "Operational tasks (up to 8)",
    placeholder: "Inspect airlock seal | 15 | 40\nCalibrate radiation dosimeter | 10 | 35\nClean CO2 scrubber filter | 20 | 45",
    format: "Format: task name | minutes (1–240) | priority points (1–100)",
    compare: "Compare schedules",
    sample: "Load lunar sample",
    advancedSummary: "Advanced: Verify with local Python Qiskit Aer (CLI)",
    advancedLead: "Export plan.json, run the Qiskit script locally, and import result.json to compare with the in-browser simulator:",
    download: "Download plan.json",
    resultLabel: "Import Qiskit result.json",
    exactTitle: "Exact Classical Baseline",
    quantumTitle: "Quantum QAOA Simulator",
    histTitle: "Top Measured Quantum States (|bitstring⟩)"
  },
  pt: {
    title: "Planejamento de tarefas a bordo",
    lead: "Equilibre tarefas operacionais dentro do tempo disponível usando uma linha de base exata e um simulador quântico QAOA ao vivo. Dados de saúde ficam fora destes arquivos.",
    budget: "Minutos disponíveis",
    tasks: "Tarefas operacionais (até 8)",
    placeholder: "Inspecionar escotilha | 15 | 40\nCalibrar dosímetro de radiação | 10 | 35\nLimpar filtro de CO2 | 20 | 45",
    format: "Formato: nome da tarefa | minutos (1–240) | pontos de prioridade (1–100)",
    compare: "Comparar cronogramas",
    sample: "Carregar exemplo lunar",
    advancedSummary: "Avançado: Verificar com Python Qiskit Aer local (CLI)",
    advancedLead: "Baixe o plan.json, execute o script Qiskit localmente e importe o result.json para comparar com o simulador do navegador:",
    download: "Baixar plan.json",
    resultLabel: "Importar result.json do Qiskit",
    exactTitle: "Linha de Base Clássica (Ótimo)",
    quantumTitle: "Simulador Quântico QAOA",
    histTitle: "Estados Quânticos Mais Prováveis (|bitstring⟩)"
  },
  es: {
    title: "Planificación de tareas a bordo",
    lead: "Equilibra tareas operativas dentro del tiempo disponible con una línea base exacta y un simulador cuántico QAOA en vivo. Los datos de salud quedan fuera.",
    budget: "Minutos disponibles",
    tasks: "Tareas operativas (hasta 8)",
    placeholder: "Inspeccionar esclusa | 15 | 40\nCalibrar dosímetro | 10 | 35\nLimpiar filtro de CO2 | 20 | 45",
    format: "Formato: nombre | minutos (1–240) | puntos de prioridad (1–100)",
    compare: "Comparar horarios",
    sample: "Cargar ejemplo lunar",
    advancedSummary: "Avanzado: Verificar con Python Qiskit Aer local (CLI)",
    advancedLead: "Descarga plan.json, ejecuta el script Qiskit localmente e importa result.json para comparar:",
    download: "Descargar plan.json",
    resultLabel: "Importar result.json de Qiskit",
    exactTitle: "Referencia Clásica Exacta",
    quantumTitle: "Simulador Cuántico QAOA",
    histTitle: "Estados Cuánticos Más Probables (|bitstring⟩)"
  },
  fr: {
    title: "Planification des tâches à bord",
    lead: "Équilibrez les tâches opérationnelles selon le temps disponible via une référence exacte et un simulateur quantique QAOA en direct. Aucune donnée de santé incluse.",
    budget: "Minutes disponibles",
    tasks: "Tâches opérationnelles (jusqu'à 8)",
    placeholder: "Inspecter le sas | 15 | 40\nCalibrer le dosimètre | 10 | 35\nNettoyer le filtre CO2 | 20 | 45",
    format: "Format : nom | minutes (1–240) | points de priorité (1–100)",
    compare: "Comparer les plannings",
    sample: "Charger exemple lunaire",
    advancedSummary: "Avancé : Vérifier avec Python Qiskit Aer local (CLI)",
    advancedLead: "Téléchargez plan.json, exécutez le script Qiskit localement et importez result.json :",
    download: "Télécharger plan.json",
    resultLabel: "Importer result.json Qiskit",
    exactTitle: "Référence Classique Exacte",
    quantumTitle: "Simulateur Quantique QAOA",
    histTitle: "États Quantiques les Plus Probables (|bitstring⟩)"
  }
};

const planningSection = document.getElementById("planning");
const planningForm = document.getElementById("planningForm");
const download = document.getElementById("planningDownload");
const resultFile = document.getElementById("planningResult");
const statusLine = document.getElementById("planningStatus");
const exactLine = document.getElementById("planningExact");
const quantumLine = document.getElementById("planningQuantum");
const budgetInput = document.getElementById("planningBudget");
const tasksInput = document.getElementById("planningTasks");
let plan;
let optimum;

// Restructure #planning cleanly into a logical, low-clutter layout
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

// Compact top row: Available minutes (short input) + Load lunar sample button right beside it
const budgetLabel = budgetInput.closest("label");
const sampleBtn = document.createElement("button");
sampleBtn.type = "button";
sampleBtn.className = "secondary";
sampleBtn.id = "planningSample";

const topRow = document.createElement("div");
topRow.className = "planning-top-row";
planningForm.insertBefore(topRow, budgetLabel);
topRow.append(budgetLabel, sampleBtn);

// Move CLI/file-upload controls into a clean collapsible <details> so the main UI stays uncluttered
const cliParagraph = Array.from(planningSection.querySelectorAll(":scope > p")).find((p) => p.querySelector("code"));
const resultLabel = resultFile.closest("label");

const advancedDetails = document.createElement("details");
advancedDetails.className = "advanced-qiskit";
const advancedSummary = document.createElement("summary");
const advancedLead = document.createElement("p");
advancedLead.className = "hint";
const advancedControls = document.createElement("div");
advancedControls.className = "advanced-controls";
const codeTag = cliParagraph ? cliParagraph.querySelector("code") : document.createElement("code");
if (!cliParagraph) codeTag.textContent = "python mvp/quantum_task_scheduling.py plan.json result.json";
if (cliParagraph) cliParagraph.remove();

advancedControls.append(download, resultLabel);
advancedDetails.append(advancedSummary, advancedLead, codeTag, advancedControls);

// Comparison cards & histogram
const comparisonGrid = document.createElement("div");
comparisonGrid.className = "planning-grid";
comparisonGrid.hidden = true;

const exactCard = document.createElement("div");
exactCard.className = "planning-card";
const exactTitle = document.createElement("strong");
exactCard.append(exactTitle, exactLine);

const quantumCard = document.createElement("div");
quantumCard.className = "planning-card quantum";
const quantumTitle = document.createElement("strong");
const circuitMeta = document.createElement("p");
circuitMeta.className = "hint";
quantumCard.append(quantumTitle, quantumLine, circuitMeta);

comparisonGrid.append(exactCard, quantumCard);

const histogramBox = document.createElement("div");
histogramBox.className = "quantum-histogram";
histogramBox.hidden = true;
const histTitle = document.createElement("h3");
const histBars = document.createElement("div");
histBars.className = "quantum-bars";
histogramBox.append(histTitle, histBars);

planningSection.append(comparisonGrid, histogramBox, advancedDetails);

function applyPlanningLang(code) {
  const dict = planningI18n[code] || planningI18n.en;
  planningTitleEl.textContent = dict.title;
  const leadP = planningSection.querySelector(":scope > p");
  if (leadP) leadP.textContent = dict.lead;
  const budgetSpan = budgetInput?.previousElementSibling;
  if (budgetSpan) budgetSpan.textContent = dict.budget;
  const tasksSpan = tasksInput?.previousElementSibling;
  if (tasksSpan) tasksSpan.textContent = dict.tasks;
  if (tasksInput) tasksInput.placeholder = dict.placeholder;
  if (budgetInput) budgetInput.placeholder = "45";
  const formatEl = document.getElementById("planningFormat");
  if (formatEl) formatEl.textContent = dict.format;
  const submitBtn = planningForm.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.textContent = dict.compare;
  sampleBtn.textContent = dict.sample;
  advancedSummary.textContent = dict.advancedSummary;
  advancedLead.textContent = dict.advancedLead;
  download.textContent = dict.download;
  const resSpan = resultFile?.previousElementSibling;
  if (resSpan) resSpan.textContent = dict.resultLabel;
  exactTitle.textContent = dict.exactTitle;
  quantumTitle.textContent = dict.quantumTitle;
  histTitle.textContent = dict.histTitle;
}

const langSelect = document.getElementById("language");
if (langSelect) {
  applyPlanningLang(langSelect.value);
  langSelect.addEventListener("change", (e) => applyPlanningLang(e.target.value));
}

// 3. Interactive Body Reference & WHO ICF Functional Selector
const checkGrid = document.querySelector(".check-grid");
if (checkGrid) {
  const bodyConsole = document.createElement("div");
  bodyConsole.className = "body-icf-console";
  bodyConsole.innerHTML = `
    <svg viewBox="0 0 160 220" class="body-icf-svg" role="img" aria-label="Interactive astronaut body map">
      <g fill="#0c1729" stroke="#2c4466" stroke-width="1.5">
        <circle cx="80" cy="30" r="18" />
        <rect x="54" y="54" width="52" height="72" rx="12" />
        <rect x="30" y="58" width="18" height="64" rx="8" />
        <rect x="112" y="58" width="18" height="64" rx="8" />
        <rect x="58" y="132" width="18" height="78" rx="8" />
        <rect x="84" y="132" width="18" height="78" rx="8" />
      </g>
      <circle cx="80" cy="30" r="15" class="icf-zone" data-fn="Vision" data-title="Head, Vision &amp; Neuro-Ocular" data-desc="Click to toggle Vision / Cognitive / Sleep impact. Monitors cephalad fluid shift and SANS." data-codes="WHO ICF b210, b134, b140 | NANDA-I 00198, 00204" />
      <rect x="60" y="62" width="40" height="54" rx="8" class="icf-zone" data-fn="Cognitive focus" data-title="Thorax, Cardio &amp; Stress Response" data-desc="Click to toggle Cognitive / Stress impact. Tracks cardiovascular adaptation and isolation." data-codes="WHO ICF b152, b410 | NANDA-I 00027, 00146" />
      <rect x="30" y="58" width="18" height="64" rx="8" class="icf-zone" data-fn="Fine motor" data-title="Upper Limbs &amp; EVA Dexterity" data-desc="Click to toggle Fine Motor impact. Tracks spacesuit glove fatigue and tool handling." data-codes="WHO ICF d440 | NANDA-I 00093" />
      <rect x="112" y="58" width="18" height="64" rx="8" class="icf-zone" data-fn="Fine motor" data-title="Upper Limbs &amp; EVA Dexterity" data-desc="Click to toggle Fine Motor impact. Tracks spacesuit glove fatigue and tool handling." data-codes="WHO ICF d440 | NANDA-I 00093" />
      <rect x="58" y="132" width="44" height="78" rx="8" class="icf-zone" data-fn="Mobility or balance" data-title="Lower Limbs, Gait &amp; Vestibular" data-desc="Click to toggle Mobility or Balance impact. Tracks bone unloading and post-G orthostatic stability." data-codes="WHO ICF b760, d410 | NANDA-I 00085" />
    </svg>
    <div class="icf-info">
      <h3 id="icfZoneTitle">Interactive Body &amp; WHO ICF Map</h3>
      <p id="icfZoneDesc">Click a body region on the figure to inspect its spaceflight function and toggle the matching task domain below.</p>
      <div class="icf-badges" id="icfZoneBadges">
        <span class="icf-badge">WHO ICF b210 · Vision</span>
        <span class="icf-badge">WHO ICF d410 · Mobility</span>
        <span class="icf-badge">WHO ICF d440 · Fine Motor</span>
        <span class="icf-badge">NANDA-I · NIC · NOC</span>
      </div>
    </div>
  `;
  checkGrid.parentNode.insertBefore(bodyConsole, checkGrid);

  bodyConsole.querySelectorAll(".icf-zone").forEach((zone) => {
    zone.addEventListener("click", () => {
      const fnVal = zone.dataset.fn;
      document.getElementById("icfZoneTitle").textContent = zone.dataset.title;
      document.getElementById("icfZoneDesc").textContent = zone.dataset.desc;
      document.getElementById("icfZoneBadges").innerHTML = zone.dataset.codes
        .split("|")
        .map((c) => `<span class="icf-badge">${c.trim()}</span>`)
        .join("");
      const checkbox = document.querySelector(`input[name="function"][value="${fnVal}"]`);
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
        zone.classList.toggle("active", checkbox.checked);
      }
    });
  });
}

// 4. Hands-Free Voice Dictation & Media Size Guard
const descInput = document.getElementById("description");
if (descInput) {
  const voiceBar = document.createElement("div");
  voiceBar.className = "multimodal-bar";
  const voiceBtn = document.createElement("button");
  voiceBtn.type = "button";
  voiceBtn.className = "quiet";
  voiceBtn.textContent = "🎤 Dictate observation (Voice)";
  const voiceHint = document.createElement("span");
  voiceHint.className = "hint";
  voiceBar.append(voiceBtn, voiceHint);
  descInput.parentNode.append(voiceBar);

  voiceBtn.addEventListener("click", () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      voiceHint.textContent = "Speech recognition unavailable in this browser.";
      return;
    }
    const rec = new SR();
    rec.lang = document.documentElement.lang || "en-US";
    voiceHint.textContent = "Listening...";
    rec.onresult = (ev) => {
      const text = ev.results[0][0].transcript;
      descInput.value = (descInput.value ? descInput.value + " " : "") + text;
      voiceHint.textContent = "Captured.";
    };
    rec.onerror = () => {
      voiceHint.textContent = "Microphone unavailable.";
    };
    rec.start();
  });
}

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

// 5. Optional Radiation & Pharmacy Fields + FHIR/LOINC/ICF Export + PIN Backup
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
    bp: { code: "85354-9", display: "Blood pressure panel", unit: "mm[Hg]" },
    temperature: { code: "8310-5", display: "Body temperature", unit: "Cel" },
    oxygen: { code: "59408-5", display: "Oxygen saturation in Arterial blood by Pulse oximetry", unit: "%" }
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
              valueString: String(val?.value ?? val),
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
      alert("Select a mission scope with saved records first.");
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

  lockBtn.addEventListener("click", async () => {
    const records = getScopedRecords();
    if (!records.length) {
      alert("Select a mission scope with saved records first.");
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

// 6. QAOA Scoring & Statevector Simulator
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
  return result.minutes + " min / " + result.points + " pts — " + (result.names.join(", ") || "No tasks selected");
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
  budgetInput.value = "45";
  tasksInput.value = [
    "Inspect airlock seal | 15 | 40",
    "Calibrate radiation dosimeter | 10 | 35",
    "Clean CO2 scrubber filter | 20 | 45",
    "Inventory medical kit | 12 | 25",
    "Verify EVA suit battery | 18 | 38"
  ].join("\n");
  planningForm.dispatchEvent(new Event("input"));
  statusLine.textContent = "Lunar sample loaded. Click 'Compare schedules'.";
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
  const lines = tasksInput.value.split(/\r?\n/).filter((line) => line.trim());
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

  plan = { budget: +budgetInput.value, tasks };
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
      : gap + " pts below exact optimum";

  exactLine.textContent = describe(optimum);
  quantumLine.textContent = describe(qaoaResult) + " (" + matchNote + ")";
  circuitMeta.textContent = `${tasks.length} qubits · QAOA p=1 (γ=${qaoa.gamma.toFixed(2)}, β=${qaoa.beta.toFixed(2)}) · ${1 << tasks.length} states`;
  comparisonGrid.hidden = false;
  renderHistogram(qaoa.topStates);

  statusLine.textContent = "Comparison complete.";
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
      (optimum.points - result.points) + " pts below exact optimum";
    quantumLine.textContent = describe(result) + " (" + comparison + ")";
    circuitMeta.textContent = "Source: Local Python Qiskit Aer simulator (result.json)";
    statusLine.textContent = "Qiskit verification complete.";
  } catch {
    if (plan === currentPlan) statusLine.textContent = "Choose a Qiskit result generated from the current plan.";
  } finally {
    resultFile.value = "";
  }
});
