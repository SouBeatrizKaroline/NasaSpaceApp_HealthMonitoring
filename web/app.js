"use strict";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

const RECORDS_KEY = "crew-health-check.records.v4";
const PROFILE_KEY = "crew-health-check.activeProfile.v4";
const DRAFT_KEY = "crew-health-check.draft.v4";

const I18N = {
  en: {
    appTitle: "Crew Health Check",
    appSub: "Onboard Mission Wellness & Ground Handoff",
    worksOffline: "Works offline",
    offlineMode: "Offline mode (local)",
    language: "Language",
    eyebrow: "NASA SPACE APPS · ONBOARD CREW TOOL",
    gateTitle: "Open your onboard profile",
    gateLead: "Enter a Crew ID and Mission code to start or resume your local check-in log. Works without internet.",
    crewIdLabel: "Crew ID (local identifier)",
    missionCodeLabel: "Mission code",
    missionDayLabel: "Mission day (optional)",
    openProfileBtn: "Open onboard workspace →",
    localIdNote: "ℹ Crew ID is a local device identifier for separating mission logs in this browser. It is not an authentication credential and does not diagnose medical conditions.",
    crewLabel: "Crew ID",
    missionLabel: "Mission",
    activeMissionLabel: "Active mission",
    phaseLabel: "Mission phase",
    dayLabel: "Mission day",
    lastCheckinLabel: "Last saved check-in",
    noCheckinYet: "No check-in saved yet",
    switchProfile: "Switch profile",
    navToday: "Today",
    navCheckin: "Check-in",
    navHistory: "Mission History",
    navGround: "Ground Review",
    navPlanning: "Task Planning",
    todayTitle: "Ready for your check-in?",
    todaySub: "Record how you feel, optional readings, and mission context in under 2 minutes.",
    todayOfflineDesc: "Records stay on this device until you export a report.",
    startCheckin: "Start check-in →",
    continueCheckin: "Continue check-in →",
    viewHistory: "View mission history",
    openPlanningLink: "Organize mission tasks (Task Planning) →",
    step1Title: "Where are you in the mission?",
    stagePre: "Preflight",
    stagePreDesc: "Before launch (baseline reference)",
    stageDuring: "In flight",
    stageDuringDesc: "During transit, orbit, or surface operations",
    stagePost: "Recovery",
    stagePostDesc: "After return to Earth",
    gravityLabel: "Gravity environment",
    missionDayOpt: "Mission day (optional)",
    gravityHelpQ: "How do I choose the gravity setting?",
    gravityHelpA: "Use Earth (1.00 g) for preflight and recovery, Microgravity (~0 g) for spacecraft or orbital stations, Lunar (0.17 g) for Moon surface, and Martian (0.38 g) for Mars.",
    backToday: "Back",
    backBtn: "Back",
    continueBtn: "Continue →",
    continueReview: "Continue to review →",
    step2Title: "What feels different today?",
    step2Sub: "Describe what you noticed and when it started.",
    dictateBtn: "Dictate (Voice)",
    funcAffects: "Affected mission functions (optional)",
    fnMobility: "Mobility or balance",
    fnVision: "Vision",
    fnMotor: "Fine motor",
    fnCog: "Cognitive focus",
    fnSleep: "Sleep",
    fnMood: "Mood",
    step3Title: "Add readings, if you have them",
    step3Sub: "All measurements are optional. Leave any field blank if you did not measure it.",
    hrLabel: "Heart rate (bpm)",
    bpLabel: "Blood pressure (mmHg)",
    tempLabel: "Body temperature (°C)",
    glucoseLabel: "Blood glucose (mg/dL)",
    sleepLabel: "Sleep duration (hours)",
    sourceLabel: "Measurement source (optional)",
    mediaOptLabel: "Optional photo / audio clip (session preview only, not stored)",
    step4Title: "Check what you entered",
    revContext: "Mission context",
    revObs: "Observations",
    revMeas: "Measurements",
    editBtn: "Edit",
    saveWithoutMeas: "You can save without measurements. Blank fields remain blank.",
    saveOnboard: "Save onboard",
    savedOnboardTitle: "Saved onboard",
    savedOnboardDesc: "Your check-in is saved on this device and ready for preflight comparison or export.",
    viewHistoryCompare: "View mission history & comparison",
    backToToday: "Back to Today",
    historyTitle: "Mission History",
    historyLead: "Longitudinal view across Preflight, In flight, and Recovery compared against your Preflight baseline.",
    exportBtn: "Export structured report (JSON)",
    groundTitle: "Ground Review",
    groundLead: "Import a structured JSON report exported from Crew Health Check to inspect observations, measurements, preflight deltas, and recording gaps.",
    importLabel: "Select exported report (.json)",
    retryBtn: "Try another file",
    planningTitle: "Task Planning (Classical vs. QAOA)",
    planningLead: "Balance operational tasks within available crew minutes. Crew IDs and health records are excluded from planning files.",
    budgetLabel: "Available minutes",
    sampleTasksBtn: "Load lunar sample",
    tasksLabel: "Operational tasks (up to 8)",
    tasksFormat: "Format: task name | minutes (1–240) | priority points (1–100)",
    compareBtn: "Compare schedules",
    exactMethod: "Method: Exact Classical Enumeration",
    quantumMethod: "Method: Quantum QAOA Simulation",
    histTitle: "Top Measured Quantum States (|bitstring⟩)",
    qiskitCliTitle: "Reproduce & verify with local Python Qiskit Aer",
    qiskitCliDesc: "Download plan.json, run the Qiskit script locally, and import result.json below:",
    downloadPlanBtn: "Download plan.json",
    importResultBtn: "Import result.json",
    footerText: "Independent educational prototype · Works offline · No automated clinical diagnosis · Crew ID is local-only"
  },
  pt: {
    appTitle: "Crew Health Check",
    appSub: "Monitoramento de Bordo e Revisão em Solo",
    worksOffline: "Funciona offline",
    offlineMode: "Modo offline (local)",
    language: "Idioma",
    eyebrow: "NASA SPACE APPS · FERRAMENTA DE BORDO",
    gateTitle: "Abrir perfil de bordo",
    gateLead: "Informe um Crew ID e código da missão para iniciar ou retomar seu registro local. Funciona sem internet.",
    crewIdLabel: "Crew ID (identificador local)",
    missionCodeLabel: "Código da missão",
    missionDayLabel: "Dia da missão (opcional)",
    openProfileBtn: "Abrir área de bordo →",
    localIdNote: "ℹ O Crew ID é apenas um identificador local neste navegador para separar históricos. Não é senha de acesso nem realiza diagnóstico médico.",
    crewLabel: "Crew ID",
    missionLabel: "Missão",
    activeMissionLabel: "Missão ativa",
    phaseLabel: "Fase da missão",
    dayLabel: "Dia da missão",
    lastCheckinLabel: "Último check-in salvo",
    noCheckinYet: "Nenhum check-in salvo ainda",
    switchProfile: "Trocar perfil",
    navToday: "Today",
    navCheckin: "Check-in",
    navHistory: "Mission History",
    navGround: "Ground Review",
    navPlanning: "Task Planning",
    todayTitle: "Pronto para o check-in?",
    todaySub: "Registre como você se sente, medições opcionais e o contexto da missão em menos de 2 minutos.",
    todayOfflineDesc: "Os registros ficam salvos neste dispositivo até você exportar o relatório.",
    startCheckin: "Start check-in →",
    continueCheckin: "Continue check-in →",
    viewHistory: "Ver histórico da missão",
    openPlanningLink: "Organizar tarefas da missão (Task Planning) →",
    step1Title: "Em qual fase da missão você está?",
    stagePre: "Preflight (Pré-voo)",
    stagePreDesc: "Antes do lançamento (linha de base)",
    stageDuring: "In flight (Em voo)",
    stageDuringDesc: "Durante trânsito, órbita ou superfície",
    stagePost: "Recovery (Recuperação)",
    stagePostDesc: "Após o retorno à Terra",
    gravityLabel: "Ambiente gravitacional",
    missionDayOpt: "Dia da missão (opcional)",
    gravityHelpQ: "Como escolher a gravidade?",
    gravityHelpA: "Use Terra (1.00 g) no pré-voo e recuperação, Microgravidade (~0 g) em nave/estação, Lunar (0.17 g) na Lua e Marciana (0.38 g) em Marte.",
    backToday: "Voltar",
    backBtn: "Voltar",
    continueBtn: "Continuar →",
    continueReview: "Ir para revisão →",
    step2Title: "O que está diferente hoje?",
    step2Sub: "Descreva o que percebeu e quando começou.",
    dictateBtn: "Ditar por voz",
    funcAffects: "Funções afetadas na missão (opcional)",
    fnMobility: "Mobilidade ou equilíbrio",
    fnVision: "Visão",
    fnMotor: "Coordenação fina",
    fnCog: "Foco cognitivo",
    fnSleep: "Sono",
    fnMood: "Humor",
    step3Title: "Adicione medições, se tiver",
    step3Sub: "Todas as medições são opcionais. Deixe em branco o que não foi medido.",
    hrLabel: "Frequência cardíaca (bpm)",
    bpLabel: "Pressão arterial (mmHg)",
    tempLabel: "Temperatura corporal (°C)",
    glucoseLabel: "Glicemia (mg/dL)",
    sleepLabel: "Horas de sono (h)",
    sourceLabel: "Origem da medição (opcional)",
    mediaOptLabel: "Foto ou áudio opcional (prévia apenas na sessão, não armazenado)",
    step4Title: "Confira o que você preencheu",
    revContext: "Contexto da missão",
    revObs: "Observações",
    revMeas: "Medições",
    editBtn: "Editar",
    saveWithoutMeas: "Você pode salvar sem medições. Campos vazios permanecem em branco.",
    saveOnboard: "Save onboard",
    savedOnboardTitle: "Saved onboard",
    savedOnboardDesc: "Seu check-in foi salvo neste dispositivo e está pronto para comparação com o pré-voo ou exportação.",
    viewHistoryCompare: "Ver histórico e comparação",
    backToToday: "Voltar para Today",
    historyTitle: "Mission History",
    historyLead: "Visão longitudinal entre Preflight, In flight e Recovery comparada à sua linha de base Preflight.",
    exportBtn: "Exportar relatório estruturado (JSON)",
    groundTitle: "Ground Review",
    groundLead: "Importe um relatório JSON exportado pelo aplicativo para inspecionar observações, medições, comparação com pré-voo e lacunas.",
    importLabel: "Selecionar relatório exportado (.json)",
    retryBtn: "Tentar outro arquivo",
    planningTitle: "Task Planning (Clássico vs. QAOA)",
    planningLead: "Equilibre tarefas operacionais dentro dos minutos disponíveis. Crew IDs e dados de saúde não entram nestes arquivos.",
    budgetLabel: "Minutos disponíveis",
    sampleTasksBtn: "Carregar exemplo lunar",
    tasksLabel: "Tarefas operacionais (até 8)",
    tasksFormat: "Formato: nome da tarefa | minutos (1–240) | pontos de prioridade (1–100)",
    compareBtn: "Comparar cronogramas",
    exactMethod: "Método: Enumeração Clássica Exata",
    quantumMethod: "Método: Simulação Quântica QAOA",
    histTitle: "Estados Quânticos Mais Prováveis (|bitstring⟩)",
    qiskitCliTitle: "Reproduzir e verificar com Python Qiskit Aer local",
    qiskitCliDesc: "Baixe o plan.json, execute o script Qiskit localmente e importe o result.json abaixo:",
    downloadPlanBtn: "Baixar plan.json",
    importResultBtn: "Importar result.json",
    footerText: "Protótipo educacional independente · Funciona offline · Sem diagnóstico clínico automatizado · Crew ID local"
  }
};
I18N.es = I18N.en;
I18N.fr = I18N.en;

const STAGE_NAMES = { pre: "Preflight", during: "In flight", post: "Recovery" };
const $ = (id) => document.getElementById(id);

let lang = localStorage.getItem("crew-health-check.lang") || "en";
let activeProfile = null;
let currentStep = 1;
let lastExportStatus = "Saved onboard";

function t(key) {
  return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
}

function applyLang(newLang) {
  lang = I18N[newLang] ? newLang : "en";
  localStorage.setItem("crew-health-check.lang", lang);
  document.documentElement.lang = lang;
  $("langSelect").value = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  updateNetworkBadge();
  renderToday();
}

function updateNetworkBadge() {
  const badge = $("networkBadge");
  const text = $("networkText");
  if (navigator.onLine) {
    badge.className = "status-pill offline-ok";
    text.textContent = t("worksOffline");
  } else {
    badge.className = "status-pill offline-warn";
    text.textContent = t("offlineMode");
  }
}
window.addEventListener("online", updateNetworkBadge);
window.addEventListener("offline", updateNetworkBadge);

function readRecords() {
  try {
    return JSON.parse(localStorage.getItem(RECORDS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeRecords(rows) {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(rows));
}

function getProfileRecords() {
  if (!activeProfile) return [];
  return readRecords().filter(
    (r) => r.crewId === activeProfile.crewId && r.missionCode === activeProfile.missionCode
  );
}

function switchView(viewName) {
  document.querySelectorAll(".nav-tab").forEach((b) => {
    b.classList.toggle("active", b.dataset.view === viewName);
  });
  document.querySelectorAll(".view").forEach((v) => {
    v.classList.toggle("active", v.id === `view-${viewName}`);
  });
  if (viewName === "today") renderToday();
  if (viewName === "history") renderHistory();
}

document.querySelectorAll(".nav-tab").forEach((btn) => {
  btn.addEventListener("click", () => switchView(btn.dataset.view));
});

// Profile Gate & Reload Persistence
function openWorkspace(profile) {
  activeProfile = profile;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  $("profileGate").hidden = true;
  $("appWorkspace").hidden = false;
  $("barCrewId").textContent = profile.crewId;
  $("barMission").textContent = profile.missionCode;
  if (profile.missionDay && !$("checkinDay").value) {
    $("checkinDay").value = profile.missionDay;
  }
  renderToday();
  switchView("today");
}

$("profileForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const crewId = $("inputCrewId").value.trim().toUpperCase();
  const missionCode = $("inputMissionCode").value.trim().toUpperCase();
  const missionDay = $("inputMissionDay").value.trim() || null;
  if (!crewId || !missionCode) return;
  openWorkspace({ crewId, missionCode, missionDay });
});

$("switchProfileBtn").addEventListener("click", () => {
  localStorage.removeItem(PROFILE_KEY);
  activeProfile = null;
  $("appWorkspace").hidden = true;
  $("profileGate").hidden = false;
  $("inputCrewId").focus();
});

// Restore profile on page reload
const savedProfile = localStorage.getItem(PROFILE_KEY);
if (savedProfile) {
  try {
    const parsed = JSON.parse(savedProfile);
    if (parsed.crewId && parsed.missionCode) openWorkspace(parsed);
  } catch { /* ignore */ }
}

// TODAY VIEW
function hasDraftInProgress() {
  return Boolean(
    $("obsText").value.trim() ||
    $("measHr").value.trim() ||
    $("measBp").value.trim() ||
    $("measTemp").value.trim() ||
    $("measGlucose").value.trim() ||
    $("measSleep").value.trim() ||
    document.querySelectorAll('input[name="function"]:checked').length > 0
  );
}

function renderToday() {
  if (!activeProfile) return;
  const rows = getProfileRecords();
  const latest = rows[rows.length - 1] || null;
  $("todayCrewId").textContent = activeProfile.crewId;
  $("todayMission").textContent = activeProfile.missionCode;
  $("todayPhase").textContent = latest ? STAGE_NAMES[latest.stage] : "Preflight";
  $("todayDay").textContent = (latest?.missionDay || activeProfile.missionDay)
    ? `Day ${latest?.missionDay || activeProfile.missionDay}`
    : "Not set";
  $("todayLastCheckin").textContent = latest
    ? `${new Date(latest.recordedAt).toLocaleString()} (${STAGE_NAMES[latest.stage]})`
    : t("noCheckinYet");
  $("todayPrimaryCta").textContent = hasDraftInProgress() ? t("continueCheckin") : t("startCheckin");
}

$("todayPrimaryCta").addEventListener("click", () => {
  setStep(hasDraftInProgress() ? currentStep : 1);
  switchView("checkin");
});
$("todayHistoryBtn").addEventListener("click", () => switchView("history"));
$("todayPlanningBtn").addEventListener("click", () => switchView("planning"));

// 4-STEP CHECK-IN WIZARD
function setStep(step) {
  currentStep = step;
  const isSaved = step === "saved";
  $("wizardHeader").hidden = isSaved;
  document.querySelectorAll(".wizard-step").forEach((s) => s.classList.remove("active"));
  $(isSaved ? "step-saved" : `step-${step}`).classList.add("active");

  if (!isSaved) {
    const titles = ["Mission context", "Observations", "Measurements (optional)", "Review"];
    $("stepCaption").textContent = `Step ${step} of 4 · ${titles[step - 1]}`;
    $("checkinStepper").setAttribute("aria-valuenow", String(step));
    const dots = $("checkinStepper").querySelectorAll(".step-dot");
    const lines = $("checkinStepper").querySelectorAll(".step-line");
    dots.forEach((d, idx) => {
      d.classList.toggle("active", idx + 1 === step);
      d.classList.toggle("done", idx + 1 < step);
    });
    lines.forEach((l, idx) => l.classList.toggle("done", idx + 1 < step));
  }
  if (step === 4) populateReview();
}

function collectCheckinData() {
  const stage = document.querySelector('input[name="stage"]:checked')?.value || "pre";
  const gravity = $("gravitySelect").value;
  const missionDay = $("checkinDay").value.trim() || activeProfile?.missionDay || null;
  const observations = $("obsText").value.trim();
  const functionChanges = [...document.querySelectorAll('input[name="function"]:checked')].map((c) => c.value);

  // Preserve blank optional measurements as null/omitted — never invent 0
  const measurements = {};
  const addMeas = (key, raw, unit) => {
    const v = raw.trim();
    if (v !== "") measurements[key] = { value: isNaN(Number(v)) ? v : Number(v), unit };
  };
  addMeas("heartRate", $("measHr").value, "bpm");
  addMeas("bloodPressure", $("measBp").value, "mmHg");
  addMeas("temperature", $("measTemp").value, "°C");
  addMeas("bloodGlucose", $("measGlucose").value, "mg/dL");
  addMeas("sleepHours", $("measSleep").value, "h");

  return {
    schema: "crew-health-check-report-v4",
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    recordedAt: new Date().toISOString(),
    crewId: activeProfile.crewId,
    missionCode: activeProfile.missionCode,
    stage,
    missionDay: missionDay ? Number(missionDay) : null,
    gravity,
    observations,
    functionChanges,
    measurements,
    measurementSource: $("measSource").value.trim() || null
  };
}

function populateReview() {
  const d = collectCheckinData();
  $("reviewContext").textContent = `${STAGE_NAMES[d.stage]} · ${d.gravity}${d.missionDay ? ` · Day ${d.missionDay}` : ""}`;
  $("reviewObs").textContent = [d.observations || "No written observations", d.functionChanges.length ? `Functions: ${d.functionChanges.join(", ")}` : null].filter(Boolean).join(" | ");
  const measList = Object.entries(d.measurements).map(([k, v]) => `${k}: ${v.value} ${v.unit}`);
  $("reviewMeas").textContent = measList.length
    ? `${measList.join(" · ")}${d.measurementSource ? ` (Source: ${d.measurementSource})` : ""}`
    : "No readings entered (saved blank)";
}

$("step1Cancel").addEventListener("click", () => switchView("today"));
$("step1Next").addEventListener("click", () => setStep(2));
$("step2Back").addEventListener("click", () => setStep(1));
$("step2Next").addEventListener("click", () => setStep(3));
$("step3Back").addEventListener("click", () => setStep(2));
$("step3Next").addEventListener("click", () => setStep(4));
$("step4Back").addEventListener("click", () => setStep(3));
$("editStep1").addEventListener("click", () => setStep(1));
$("editStep2").addEventListener("click", () => setStep(2));
$("editStep3").addEventListener("click", () => setStep(3));

// Voice Dictation
$("voiceDictateBtn").addEventListener("click", () => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    $("voiceStatus").textContent = "Speech recognition unavailable in this browser.";
    return;
  }
  const rec = new SR();
  rec.lang = lang === "pt" ? "pt-BR" : "en-US";
  $("voiceStatus").textContent = "Listening...";
  rec.onresult = (ev) => {
    const txt = ev.results[0][0].transcript;
    $("obsText").value = ($("obsText").value ? $("obsText").value + " " : "") + txt;
    $("voiceStatus").textContent = "Captured.";
  };
  rec.onerror = () => { $("voiceStatus").textContent = "Microphone unavailable."; };
  rec.start();
});

// Media session preview
$("mediaInput").addEventListener("change", (e) => {
  const host = $("mediaPreview");
  host.replaceChildren();
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 25 * 1024 * 1024) {
    alert("File exceeds 25 MB session limit.");
    e.target.value = "";
    return;
  }
  const url = URL.createObjectURL(file);
  if (file.type.startsWith("image/")) {
    const img = document.createElement("img"); img.src = url; img.alt = file.name; host.append(img);
  } else if (file.type.startsWith("video/")) {
    const vid = document.createElement("video"); vid.src = url; vid.controls = true; host.append(vid);
  } else if (file.type.startsWith("audio/")) {
    const aud = document.createElement("audio"); aud.src = url; aud.controls = true; host.append(aud);
  }
});

$("saveOnboardBtn").addEventListener("click", () => {
  const entry = collectCheckinData();
  const rows = readRecords();
  rows.push(entry);
  writeRecords(rows);
  lastExportStatus = "Ready to export";

  // Reset form for next check-in
  $("obsText").value = "";
  $("measHr").value = $("measBp").value = $("measTemp").value = $("measGlucose").value = $("measSleep").value = $("measSource").value = "";
  document.querySelectorAll('input[name="function"]').forEach((c) => { c.checked = false; });
  $("mediaInput").value = "";
  $("mediaPreview").replaceChildren();

  renderToday();
  setStep("saved");
});

$("savedHistoryBtn").addEventListener("click", () => switchView("history"));
$("savedTodayBtn").addEventListener("click", () => switchView("today"));

// MISSION HISTORY & PREFLIGHT COMPARISON
function buildPreflightComparison(records) {
  const pre = records.find((r) => r.stage === "pre");
  const latest = records[records.length - 1];
  if (!pre) {
    return { available: false, notes: ["Preflight baseline is missing. Record a Preflight check-in to enable comparison."] };
  }
  if (!latest || latest.id === pre.id) {
    return { available: true, notes: ["Preflight baseline recorded. Add an In flight or Recovery check-in to compare changes."] };
  }
  const diffs = [];
  const compareNumeric = (key, label) => {
    const a = pre.measurements?.[key];
    const b = latest.measurements?.[key];
    if (a && b && typeof a.value === "number" && typeof b.value === "number") {
      const delta = (b.value - a.value).toFixed(1).replace(/\.0$/, "");
      const sign = b.value >= a.value ? "+" : "";
      diffs.push(`${label}: ${b.value} ${b.unit} (${sign}${delta} ${b.unit} vs Preflight ${a.value} ${a.unit})`);
    } else if (!b) {
      diffs.push(`${label}: Not measured in latest ${STAGE_NAMES[latest.stage]} entry (kept blank).`);
    }
  };
  compareNumeric("heartRate", "Heart rate");
  compareNumeric("temperature", "Body temperature");
  compareNumeric("bloodGlucose", "Blood glucose");
  compareNumeric("sleepHours", "Sleep duration");

  if (latest.functionChanges?.length) {
    diffs.push(`Reported functional changes in ${STAGE_NAMES[latest.stage]}: ${latest.functionChanges.join(", ")}.`);
  }
  return { available: true, notes: diffs.length ? diffs : ["No numeric measurement changes detected yet."] };
}

function renderHistory() {
  const rows = getProfileRecords();
  const exportBtn = $("exportReportBtn");
  const statusPill = $("historyExportStatus");

  exportBtn.disabled = rows.length === 0;
  statusPill.textContent = rows.length === 0 ? "No records" : lastExportStatus;

  // Phase coverage cards
  const coverage = $("phaseCoverage");
  coverage.replaceChildren();
  ["pre", "during", "post"].forEach((st) => {
    const count = rows.filter((r) => r.stage === st).length;
    const box = document.createElement("div");
    box.className = "phase-box" + (count === 0 ? " missing" : "");
    box.innerHTML = `<strong>${STAGE_NAMES[st]}</strong><small>${count ? `${count} check-in(s) saved` : "Missing stage"}</small>`;
    coverage.append(box);
  });

  // Comparison box
  const diffBox = $("baselineDiffBox");
  if (rows.length > 0) {
    const comp = buildPreflightComparison(rows);
    diffBox.hidden = false;
    diffBox.innerHTML = `<strong>Preflight Comparison Summary</strong><ul>${comp.notes.map((n) => `<li>${n}</li>`).join("")}</ul>`;
  } else {
    diffBox.hidden = true;
  }

  // Records list
  const list = $("historyList");
  list.replaceChildren();
  if (rows.length === 0) {
    list.innerHTML = `<p class="muted">No check-ins saved yet for ${activeProfile.crewId} / ${activeProfile.missionCode}. Use Check-in to record your first entry.</p>`;
    return;
  }

  rows.slice().reverse().forEach((r) => {
    const card = document.createElement("article");
    card.className = "record-card";
    const measHtml = Object.entries(r.measurements || {})
      .map(([k, v]) => `<dt>${k}</dt><dd>${v.value} ${v.unit}</dd>`)
      .join("") || `<dt>Measurements</dt><dd>None entered (blank)</dd>`;
    card.innerHTML = `
      <div class="record-head">
        <strong>${STAGE_NAMES[r.stage]} · ${r.gravity}${r.missionDay ? ` · Day ${r.missionDay}` : ""}</strong>
        <span>${new Date(r.recordedAt).toLocaleString()}</span>
      </div>
      <p>${r.observations || "<em>No written observations.</em>"}</p>
      <dl class="record-dl">
        <dt>Functions</dt><dd>${r.functionChanges?.length ? r.functionChanges.join(", ") : "None flagged"}</dd>
        ${measHtml}
        <dt>Source</dt><dd>${r.measurementSource || "Not specified"}</dd>
      </dl>
    `;
    list.append(card);
  });
}

$("exportReportBtn").addEventListener("click", () => {
  const rows = getProfileRecords();
  if (!rows.length) return;
  const comp = buildPreflightComparison(rows);
  const missingStages = ["pre", "during", "post"].filter((st) => !rows.some((r) => r.stage === st)).map((st) => STAGE_NAMES[st]);
  const report = {
    schema: "crew-health-check-report-v4",
    exportedAt: new Date().toISOString(),
    exportStatus: "Report exported",
    crewId: activeProfile.crewId,
    missionCode: activeProfile.missionCode,
    preflightComparison: comp.notes,
    missingStages,
    records: rows
  };
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${activeProfile.crewId}-${activeProfile.missionCode}-report.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  lastExportStatus = "Report exported";
  $("historyExportStatus").textContent = "Report exported";
});

// GROUND REVIEW (IMPORT & VALIDATE)
function showGroundError(msg) {
  $("groundError").hidden = false;
  $("groundErrorText").textContent = msg;
  $("groundReportView").hidden = true;
}

$("groundRetryBtn").addEventListener("click", () => {
  $("groundFileInput").value = "";
  $("groundError").hidden = true;
  $("groundFileInput").click();
});

$("groundFileInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  $("groundError").hidden = true;

  try {
    if (file.size > 1024 * 1024) throw new Error("File is too large (max 1 MB).");
    const data = JSON.parse(await file.text());
    if (data.schema !== "crew-health-check-report-v4" || !data.crewId || !data.missionCode || !Array.isArray(data.records)) {
      throw new Error("Invalid report format. Please import a JSON file exported from Crew Health Check.");
    }

    const host = $("groundReportView");
    host.hidden = false;
    host.innerHTML = `
      <div class="diff-box">
        <strong>Imported Report: ${data.crewId} · ${data.missionCode}</strong>
        <p class="muted small-text">Exported at: ${new Date(data.exportedAt).toLocaleString()} · Status: ${data.exportStatus || "Report exported"}</p>
        <ul>${(data.preflightComparison || []).map((n) => `<li>${n}</li>`).join("")}</ul>
      </div>
      ${data.missingStages?.length ? `<div class="gap-box"><strong>Recording gaps detected:</strong> Missing stage(s): ${data.missingStages.join(", ")}</div>` : ""}
      <div class="history-list" style="margin-top:14px;">
        ${data.records.map((r) => `
          <article class="record-card">
            <div class="record-head">
              <strong>${STAGE_NAMES[r.stage] || r.stage} · ${r.gravity || "Gravity not set"}${r.missionDay ? ` · Day ${r.missionDay}` : ""}</strong>
              <span>${new Date(r.recordedAt).toLocaleString()}</span>
            </div>
            <p>${r.observations || "<em>No written observations.</em>"}</p>
            <dl class="record-dl">
              <dt>Functions</dt><dd>${r.functionChanges?.length ? r.functionChanges.join(", ") : "None flagged"}</dd>
              ${Object.entries(r.measurements || {}).map(([k, v]) => `<dt>${k}</dt><dd>${v.value} ${v.unit}</dd>`).join("") || `<dt>Measurements</dt><dd>None entered (blank)</dd>`}
              <dt>Source</dt><dd>${r.measurementSource || "Not specified"}</dd>
            </dl>
          </article>
        `).join("")}
      </div>
    `;
  } catch (err) {
    showGroundError(err.message || "Could not read this JSON file. Please verify it was exported from Crew Health Check.");
  }
});

applyLang(lang);
