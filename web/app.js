"use strict";
(() => {
  const C = window.CrewCore;
  const $ = id => document.getElementById(id);
  const PROFILE_KEY = "crew-health-check.profiles.v1";
  const ACTIVE_KEY = "crew-health-check.active.v1";
  const DRAFT_KEY = "crew-health-check.drafts.v1";
  let lang = "en";
  let crew = "";
  let mission = "";
  let step = 0;
  let draft = {};
  let dirty = false;
  let storageFailed = false;
  let imported = null;
  let importRevision = 0;
  let savedId = "";
  let exportScope = "";
  let mediaUrls = [];
  let cacheStatus = "cachePending";
  const stageLabels = {pre: "pre", during: "during", post: "post"};
  const gravityLabels = {"Earth gravity": "earth", "Microgravity": "micro", "Lunar gravity": "moon", "Martian gravity": "mars", "Not sure": "unknown"};
  const functionLabels = {
    "Mobility or balance": "mobility", "Vision-related tasks": "vision",
    "Exercise or strength": "exercise", "Sleep or alertness": "sleep",
    "Eating or hydration routine": "nutrition", "Work or team tasks": "work"
  };
  const reviewLabels = {"Routine entry": "routineEntry", "Review requested": "reviewEntry", "Mission procedure selected": "procedureEntry"};
  const stepKeys = ["context", "observations", "measurements", "review"];

  function t(key) { return window.CrewTranslations[lang]?.[key] || window.CrewTranslations.en[key] || key; }
  function el(tag, text, className) {
    const element = document.createElement(tag);
    if (text != null) element.textContent = String(text);
    if (className) element.className = className;
    return element;
  }
  function read(key, fallback) {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  }
  function dictionary(key) {
    const value = read(key, {});
    if (!value || Array.isArray(value) || typeof value !== "object") throw new Error("storage");
    return value;
  }
  function records() {
    const value = read(C.RECORD_KEY, []);
    if (!Array.isArray(value)) throw new Error("storage");
    return value;
  }
  function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
  function storageError() {
    storageFailed = true;
    $("globalError").textContent = t("storageError");
    $("globalError").hidden = false;
  }
  function run(action) {
    try { return action(); } catch { storageError(); return undefined; }
  }
  function scoped(missionId = mission) {
    return records().filter(row => row && row.astronautCode === crew && row.missionCode === missionId);
  }
  function draftKey() { return crew + "/" + mission; }
  function freshDraft() {
    const recent = scoped().slice().sort((a, b) => Date.parse(b.recordedAt) - Date.parse(a.recordedAt))[0];
    return {stage: recent?.stage || "pre", gravity: recent?.mission?.gravity || "Earth gravity",
      phase: recent?.mission?.phase || "", day: recent?.mission?.day ?? "", functions: [], review: "Routine entry"};
  }
  function restoreDraft() {
    const saved = dictionary(DRAFT_KEY)[draftKey()];
    dirty = Boolean(saved && typeof saved === "object" && !Array.isArray(saved));
    draft = dirty ? saved : freshDraft();
    step = Number.isInteger(draft.step) ? Math.max(0, Math.min(3, draft.step)) : 0;
  }
  function persistDraft() {
    if (!crew || !mission) return;
    dirty = true;
    const drafts = dictionary(DRAFT_KEY);
    drafts[draftKey()] = {...draft, step};
    try {
      write(DRAFT_KEY, drafts);
      $("draftStatus").textContent = t("draftSaved");
    } catch {
      $("draftStatus").textContent = t("draftError");
      throw new Error("storage");
    }
  }
  function openScope(code, missionId) {
    if (!C.codePattern.test(code)) throw new Error("scope");
    const profiles = dictionary(PROFILE_KEY);
    const profile = Object.hasOwn(profiles, code) ? profiles[code] : {};
    const selected = missionId || profile.lastMission || "";
    if (selected && !C.codePattern.test(selected)) throw new Error("scope");
    write(PROFILE_KEY, {...profiles, [code]: {...profile, lastMission: selected}});
    write(ACTIVE_KEY, {crew: code, mission: selected});
    crew = code;
    mission = selected;
    savedId = "";
    exportScope = "";
    clearMedia();
    restoreDraft();
    render();
  }
  function date(value) {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? t("unknown") : parsed.toLocaleString(lang, {dateStyle: "medium", timeStyle: "short"});
  }
  function translated(value, labels) { return labels[value] ? t(labels[value]) : value || t("unknown"); }
  function displayValue(value) { return value == null || value === "" ? t("unknown") : String(value); }
  function download(value, name, type = "application/json") {
    const body = type === "application/json" ? JSON.stringify(value, null, 2) : value;
    const url = URL.createObjectURL(new Blob([body], {type}));
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function toast(key) {
    $("toast").textContent = t(key);
    $("toast").hidden = false;
    setTimeout(() => { $("toast").hidden = true; }, 4000);
  }
  function currentPage() {
    const page = location.hash.slice(1);
    return ["today", "checkin", "history", "ground", "planning"].includes(page) ? page : "today";
  }
  function navigate(page) {
    if (location.hash === "#" + page) render();
    else location.hash = page;
  }
  function render() {
    const page = currentPage();
    document.querySelectorAll(".page").forEach(section => { section.hidden = section.id !== "page-" + page; });
    document.querySelectorAll("[data-page]").forEach(link => {
      if (link.dataset.page === page) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    $("pageTitle").textContent = t(page);
    document.title = t(page) + " · Crew Health Check";
    $("scopePill").hidden = !crew;
    $("scopePill").textContent = [crew, mission].filter(Boolean).join(" / ");
    $("sideCrew").textContent = crew ? "Crew ID · " + crew : "";
    if (storageFailed) $("globalError").textContent = t("storageError");
    run(() => {
      renderToday();
      renderHistory();
      $("checkinGate").hidden = Boolean(crew && mission);
      $("checkinWorkspace").hidden = !crew || !mission;
      if (crew && mission) renderWizard();
    });
    renderGround();
    networkStatus();
  }
  function renderToday() {
    $("profileGate").hidden = Boolean(crew);
    $("todayWorkspace").hidden = !crew;
    const legacy = records().filter(row => !row?.astronautCode || !row?.missionCode);
    $("legacyNotice").hidden = !legacy.length;
    if (!crew) return;
    const list = scoped().slice().sort((a, b) => Date.parse(b.recordedAt) - Date.parse(a.recordedAt));
    const latest = list[0];
    $("todayMission").textContent = mission || t("noMission");
    $("todayCrew").textContent = crew;
    $("todayDay").textContent = displayValue(dirty ? draft.day : latest?.mission?.day);
    $("todayStage").textContent = t(stageLabels[dirty ? draft.stage : latest?.stage] || "unknown");
    $("todayLast").textContent = latest ? date(latest.recordedAt) : t("unknown");
    $("todayContext").textContent = latest ? translated(latest.mission?.gravity, gravityLabels) : t("emptyMission");
    $("startCheckin").textContent = t(dirty ? "continue" : "start");
    $("startCheckin").disabled = !mission || storageFailed;
    $("todayDraft").textContent = dirty ? t("draftSaved") : "";
    $("missionChoice").value = mission;
    $("knownMissions").replaceChildren();
    [...new Set(records().filter(row => row?.astronautCode === crew).map(row => row.missionCode))].filter(Boolean)
      .forEach(code => $("knownMissions").append(new Option(code, code)));
  }
  function field(id, key, type = "text", options = null, attributes = {}) {
    const label = el("label");
    label.htmlFor = id;
    label.append(el("span", t(key)));
    const control = document.createElement(options ? "select" : type === "textarea" ? "textarea" : "input");
    control.id = id;
    control.name = id;
    if (!options && type !== "textarea") control.type = type;
    if (options) options.forEach(([value, labelKey]) => control.append(new Option(t(labelKey), value)));
    if (type === "textarea") control.rows = 4;
    for (const [attribute, value] of Object.entries(attributes)) control.setAttribute(attribute, value);
    if (!options && !["number", "datetime-local", "file"].includes(type) && !attributes.maxlength) control.maxLength = 4000;
    control.value = draft[id] ?? "";
    control.addEventListener("input", () => {
      draft[id] = control.value;
      run(persistDraft);
    });
    label.append(control);
    return label;
  }
  function grid(...children) {
    const element = el("div", null, "field-grid");
    element.append(...children);
    return element;
  }
  function renderWizard() {
    $("saveSuccess").hidden = !savedId;
    $("wizardProgress").replaceChildren();
    stepKeys.forEach((key, index) => {
      const item = el("span", (index + 1) + "  " + t(key));
      if (index === step) item.setAttribute("aria-current", "step");
      $("wizardProgress").append(item);
    });
    $("wizardProgress").setAttribute("aria-label", t("step") + " " + (step + 1) + " / 4");
    $("stepTitle").textContent = t(stepKeys[step]);
    $("formMessage").hidden = true;
    $("previousStep").hidden = step === 0;
    $("nextStep").textContent = t(step === 3 ? "save" : "next");
    $("nextStep").disabled = storageFailed;
    $("draftStatus").textContent = dirty ? t("draftSaved") : "";
    const host = $("wizardFields");
    host.replaceChildren();
    if (step === 0) {
      host.append(grid(
        field("stage", "stage", "text", C.stages.map(value => [value, value])),
        field("day", "day", "number", null, {min: 0, max: 100000, step: 1}),
        field("gravity", "gravity", "text", Object.entries(gravityLabels)),
        field("elapsed", "elapsed", "text", null, {maxlength: 200}),
        field("phase", "phase", "text", null, {maxlength: 200})
      ));
      const evidence = el("details", null, "evidence");
      evidence.append(el("summary", t("whyGravity")), el("p", t("gravityEvidence")));
      const link = el("a", t("gravityResearch"));
      link.href = "https://www.nasa.gov/hrp/hazard-gravity-fields/";
      evidence.append(link);
      host.append(evidence);
    } else if (step === 1) {
      host.append(field("description", "description", "textarea"));
      host.append(grid(field("onset", "onset", "text", null, {maxlength: 300}),
        field("pattern", "pattern", "text", null, {maxlength: 300}),
        field("associatedChanges", "associated", "text", null, {maxlength: 1000})));
      const functions = el("fieldset", null, "checks");
      functions.append(el("legend", t("functionTitle")));
      for (const [value, key] of Object.entries(functionLabels)) {
        const label = el("label", null, "choice");
        const input = document.createElement("input");
        input.type = "checkbox";
        input.value = value;
        input.checked = (draft.functions || []).includes(value);
        input.addEventListener("change", () => {
          draft.functions = [...functions.querySelectorAll("input:checked")].map(item => item.value);
          run(persistDraft);
        });
        label.append(input, el("span", t(key)));
        functions.append(label);
      }
      host.append(functions);
      host.append(grid(field("sleepHours", "sleepHours", "number", null, {min: 0, max: 24, step: "any"}),
        field("mood", "mood", "text", [["", "unknown"], ...[1, 2, 3, 4, 5].map(value => [String(value), String(value)])]),
        field("stress", "stress", "text", [["", "unknown"], ...[1, 2, 3, 4, 5].map(value => [String(value), String(value)])])));
      host.append(el("p", t("scaleHint"), "hint"));
    } else if (step === 2) {
      host.append(el("p", t("optionalHelp"), "hint"));
      const readings = grid();
      for (const key of Object.keys(C.units)) {
        readings.append(field(key, key, key === "bp" ? "text" : "number", null,
          key === "bp" ? {pattern: "[0-9]{1,3}\\s*/\\s*[0-9]{1,3}", placeholder: "118/76"} :
            {min: 0, max: key === "oxygen" ? 100 : 2000, step: "any"}));
      }
      host.append(readings, grid(field("measurementSource", "measurementSource", "text", null, {maxlength: 300}),
        field("measurementTime", "localTime", "datetime-local")));
      const media = el("label", null, "file-label");
      media.append(el("span", t("chooseMedia")));
      const file = document.createElement("input");
      file.type = "file"; file.accept = "image/*,video/*,audio/*"; file.multiple = true; file.id = "media";
      const previews = el("div", null, "media-previews");
      file.addEventListener("change", () => {
        clearMedia(); previews.replaceChildren();
        [...file.files].slice(0, 6).forEach(item => {
          if (item.size > 20 * 1024 * 1024) return;
          const tag = item.type.startsWith("image/") ? "img" : item.type.startsWith("video/") ? "video" : item.type.startsWith("audio/") ? "audio" : null;
          if (!tag) return;
          const preview = document.createElement(tag);
          const url = URL.createObjectURL(item); mediaUrls.push(url); preview.src = url;
          if (tag === "img") preview.alt = item.name;
          else preview.controls = true;
          previews.append(preview);
        });
      });
      media.append(file);
      host.append(media, el("p", t("mediaNotice"), "hint"), previews);
    } else {
      host.append(recordDetails(collect(), true));
      host.append(field("review", "reviewTitle", "text", Object.entries(reviewLabels)));
      host.append(el("p", t("reviewNote"), "hint"));
      const label = el("label", null, "choice");
      const input = document.createElement("input");
      input.type = "checkbox"; input.id = "privateFollowUp"; input.checked = Boolean(draft.privateFollowUp);
      input.addEventListener("change", () => { draft.privateFollowUp = input.checked; run(persistDraft); });
      label.append(input, el("span", t("privateNote")));
      host.append(label);
    }
  }
  function collect() {
    const measurements = {};
    for (const [key, unit] of Object.entries(C.units)) {
      const value = draft[key];
      if (value !== "" && value != null) measurements[key] = {value, unit};
    }
    const measurementTime = draft.measurementTime ? new Date(draft.measurementTime).toISOString() : null;
    return {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now() + "-" + Math.random().toString(36).slice(2),
      astronautCode: crew, missionCode: mission, stage: draft.stage || "pre", recordedAt: new Date().toISOString(),
      mission: {phase: draft.phase || null, gravity: draft.gravity || null, day: draft.day === "" ? null : draft.day ?? null, timeSinceTransition: draft.elapsed || null},
      reason: "Check-in", description: draft.description || "", onset: draft.onset || null, pattern: draft.pattern || null,
      associatedChanges: draft.associatedChanges || null, functionChanges: draft.functions || [],
      wellbeing: {sleepHours: draft.sleepHours === "" ? null : draft.sleepHours ?? null, mood: draft.mood || null, stress: draft.stress || null},
      measurements, measurementSource: draft.measurementSource || null, measurementTime,
      reviewPreference: draft.review || "Routine entry", privateFollowUp: Boolean(draft.privateFollowUp), mediaStored: false
    };
  }
  function clearMedia() { mediaUrls.forEach(url => URL.revokeObjectURL(url)); mediaUrls = []; }
  function metricList(row) {
    const list = el("dl", null, "data-list");
    const pairs = [
      ["stage", t(stageLabels[row.stage] || "unknown")],
      ["gravity", translated(row.mission?.gravity, gravityLabels)],
      ["day", displayValue(row.mission?.day)],
      ["elapsed", displayValue(row.mission?.timeSinceTransition)],
      ["phase", displayValue(row.mission?.phase)]
    ];
    pairs.forEach(([key, value]) => list.append(el("dt", t(key)), el("dd", value)));
    return list;
  }
  function recordDetails(row, preview = false) {
    const content = el("div", null, "record-detail");
    content.append(metricList(row));
    const list = el("dl", null, "data-list");
    const fields = [
      ["description", displayValue(row.description)], ["onset", displayValue(row.onset)],
      ["pattern", displayValue(row.pattern)], ["associated", displayValue(row.associatedChanges)],
      ["functionTitle", (row.functionChanges || []).map(value => translated(value, functionLabels)).join(", ") || t("unknown")],
      ["sleepHours", row.wellbeing?.sleepHours == null ? t("missingValue") : row.wellbeing.sleepHours + " " + t("hour")], ["mood", displayValue(row.wellbeing?.mood)], ["stress", displayValue(row.wellbeing?.stress)]
    ];
    for (const key of Object.keys(C.units)) {
      const reading = row.measurements?.[key];
      fields.push([key, reading ? reading.value + " " + reading.unit : t("missingValue")]);
      if (reading?.source) fields.push(["measurementSource", reading.source]);
      if (reading?.measuredAt) fields.push(["measurementTime", reading.measuredAt]);
    }
    fields.push(["measurementSource", row.measurementSource || t("noSource")],
      ["measurementTime", row.measurementTime ? date(row.measurementTime) : t("unknown")]);
    if (!preview) fields.push(["reviewTitle", translated(row.reviewPreference, reviewLabels)],
      ["privateNote", row.privateFollowUp ? t("private") : "—"]);
    fields.forEach(([key, value]) => list.append(el("dt", t(key)), el("dd", value)));
    content.append(list);
    return content;
  }
  function renderComparison(host, rows) {
    host.replaceChildren();
    const {latest, difference} = C.compare(rows);
    host.append(el("p", t("comparisonHint"), "hint"));
    const columns = el("div", null, "comparison-grid");
    for (const stage of C.stages) {
      const card = el("article", null, "card comparison-card");
      card.append(el("h3", t(stage)));
      const row = latest[stage];
      if (!row) {
        card.append(el("p", t(stage === "pre" ? "missingPre" : "missingStage"), "empty-copy"));
      } else {
        card.append(el("time", date(row.recordedAt)), el("p", translated(row.mission?.gravity, gravityLabels), "pill"));
        const metrics = el("dl", null, "comparison-metrics");
        for (const key of ["sleepHours", ...Object.keys(C.units)]) {
          const reading = key === "sleepHours" ? row.wellbeing?.sleepHours : row.measurements?.[key]?.value;
          const unit = key === "sleepHours" ? t("hour") : row.measurements?.[key]?.unit || "";
          metrics.append(el("dt", t(key)), el("dd", reading == null || reading === "" ? t("missingValue") : reading + " " + unit));
          if (stage !== "pre" && key !== "bp") {
            const delta = difference(row, key);
            const text = delta === null ? "—" : new Intl.NumberFormat(lang, {signDisplay: "exceptZero", maximumFractionDigits: 2}).format(delta) + " " + unit;
            metrics.append(el("dd", t("difference") + " · " + text, "delta"));
          }
        }
        card.append(metrics, el("p", t("measurementSource") + ": " + (row.measurementSource || t("noSource")), "hint"));
      }
      columns.append(card);
    }
    host.append(columns);
  }
  function renderRecords(host, rows) {
    host.replaceChildren();
    if (!rows.length) { host.append(el("div", t("historyEmpty"), "empty card")); return; }
    rows.slice().sort((a, b) => Date.parse(b.recordedAt) - Date.parse(a.recordedAt)).forEach(row => {
      const details = el("details", null, "card record");
      const summary = el("summary");
      summary.append(el("strong", t(stageLabels[row.stage] || "unknown")), el("span", date(row.recordedAt)));
      if (row.id === savedId) { details.open = true; summary.append(el("span", t("savedOnboard"), "pill")); }
      details.append(summary, recordDetails(row));
      host.append(details);
    });
  }
  function renderHistory() {
    const opened = Boolean(crew);
    $("historyGate").hidden = opened;
    $("historyWorkspace").hidden = !opened;
    if (!opened) return;
    const selector = $("historyMission");
    const previous = selector.value;
    const codes = [...new Set(records().filter(row => row?.astronautCode === crew).map(row => row.missionCode))];
    if (mission && !codes.includes(mission)) codes.push(mission);
    selector.replaceChildren();
    codes.filter(Boolean).forEach(code => selector.append(new Option(code, code)));
    selector.value = codes.includes(previous) ? previous : mission;
    const rows = scoped(selector.value);
    $("exportReport").disabled = !rows.length || storageFailed;
    $("exportState").textContent = rows.length ? t(exportScope === crew + "/" + selector.value ? "reportExported" : "readyExport") : t("unknown");
    renderComparison($("historyComparison"), rows);
    renderRecords($("historyRecords"), rows);
    renderResearch();
  }
  function renderResearch() {
    const host = $("researchTable"); host.replaceChildren();
    const table = el("table");
    const head = document.createElement("thead"); const tr = document.createElement("tr");
    ["", t("pre"), t("during"), t("post")].forEach(label => { const cell = el("th", label); cell.scope = "col"; tr.append(cell); });
    head.append(tr); table.append(head);
    const body = document.createElement("tbody");
    [["ISS", 6.41, 6.09, 6.95], ["Space Shuttle", 6.29, 5.96, 6.74]].forEach(([name, ...values]) => {
      const row = document.createElement("tr"); const label = el("th", name); label.scope = "row"; row.append(label);
      values.forEach(value => row.append(el("td", new Intl.NumberFormat(lang, {minimumFractionDigits: 2}).format(value) + " h")));
      body.append(row);
    });
    table.append(body); host.append(table);
  }
  function renderGround() {
    $("groundEmpty").hidden = Boolean(imported);
    $("groundReport").hidden = !imported;
    if (!imported) { $("groundComparison").replaceChildren(); $("groundRecords").replaceChildren(); return; }
    $("groundScope").textContent = imported.scope.crewId + " / " + imported.scope.missionId;
    renderComparison($("groundComparison"), imported.records);
    renderRecords($("groundRecords"), imported.records);
  }
  function applyLanguage(value) {
    lang = Object.hasOwn(window.CrewTranslations, value) ? value : "en";
    document.documentElement.lang = lang;
    $("language").value = lang;
    try { localStorage.setItem("crew-health-check.language", lang); } catch { /* The interface still renders. */ }
    document.querySelectorAll("[data-i18n]").forEach(node => { node.textContent = t(node.dataset.i18n); });
    render();
    window.dispatchEvent(new CustomEvent("crew-language", {detail: lang}));
  }
  function networkStatus() {
    $("connection").textContent = t(navigator.onLine ? "online" : "offline");
    $("connection").className = navigator.onLine ? "connection" : "connection offline";
    $("offlineReady").textContent = t(cacheStatus);
  }

  $("profileForm").addEventListener("submit", event => {
    event.preventDefault();
    run(() => openScope($("crewId").value.trim().toUpperCase(), $("initialMission").value.trim().toUpperCase()));
  });
  $("missionForm").addEventListener("submit", event => {
    event.preventDefault();
    run(() => { openScope(crew, $("missionChoice").value.trim().toUpperCase()); $("historyMission").value = mission; renderHistory(); });
  });
  $("switchCrew").addEventListener("click", () => {
    run(() => {
      localStorage.removeItem(ACTIVE_KEY); crew = ""; mission = ""; draft = {}; dirty = false; step = 0; savedId = "";
      clearMedia(); $("crewId").value = ""; $("initialMission").value = ""; $("historyMission").replaceChildren();
      render(); $("crewId").focus();
    });
  });
  $("startCheckin").addEventListener("click", () => { savedId = ""; navigate("checkin"); });
  $("previousStep").addEventListener("click", () => {
    clearMedia(); step = Math.max(0, step - 1); run(persistDraft); renderWizard(); $("stepTitle").focus();
  });
  $("checkinForm").addEventListener("submit", event => {
    event.preventDefault();
    if (storageFailed || !crew || !mission) return;
    if (!$("checkinForm").reportValidity()) return;
    if (step < 3) {
      step += 1; clearMedia(); run(persistDraft); renderWizard(); $("stepTitle").focus(); return;
    }
    try {
      const record = C.normalizeRecord(collect());
      if (!record.description && !record.functionChanges.length && !Object.keys(record.measurements).length &&
          Object.values(record.wellbeing).every(value => value == null || value === "")) {
        $("formMessage").textContent = t("observationNeeded"); $("formMessage").hidden = false; return;
      }
      const current = records();
      write(C.RECORD_KEY, [...current, record]);
      savedId = record.id; exportScope = "";
      try {
        const drafts = dictionary(DRAFT_KEY); delete drafts[draftKey()]; write(DRAFT_KEY, drafts);
      } catch { storageError(); }
      draft = freshDraft(); dirty = false; step = 0;
      $("historyMission").value = mission;
      render(); toast("savedOnboard");
      $("saveSuccess").scrollIntoView({block: "center"});
    } catch { storageError(); }
  });
  $("discardDraft").addEventListener("click", () => {
    if (!confirm(t("confirmDraft"))) return;
    run(() => {
      const drafts = dictionary(DRAFT_KEY); delete drafts[draftKey()]; write(DRAFT_KEY, drafts);
      draft = freshDraft(); dirty = false; step = 0; clearMedia(); renderWizard();
    });
  });
  $("historyMission").addEventListener("change", () => run(renderHistory));
  $("exportReport").addEventListener("click", () => run(() => {
    const selected = $("historyMission").value;
    const payload = C.report(records(), crew, selected);
    download(payload, "crew-health-report-" + crew + "-" + selected + ".json");
    exportScope = crew + "/" + selected; renderHistory(); toast("reportExported");
  }));
  $("legacyExport").addEventListener("click", () => run(() => {
    download({format: "crew-health-legacy-archive", records: records().filter(row => !row?.astronautCode || !row?.missionCode)}, "crew-health-legacy-archive.json");
  }));
  $("groundFile").addEventListener("change", async event => {
    const file = event.target.files[0]; if (!file) return;
    const revision = ++importRevision;
    imported = null; renderGround(); $("importMessage").textContent = "";
    try {
      if (file.size > 2 * 1024 * 1024) throw new Error("large");
      const parsed = C.parseReport(JSON.parse(await file.text()));
      if (revision !== importRevision) return;
      imported = parsed;
      $("importMessage").className = "notice success";
      $("importMessage").textContent = t("imported");
      renderGround();
    } catch {
      if (revision === importRevision) {
        $("importMessage").className = "notice error";
        $("importMessage").textContent = t("importError");
      }
    } finally { if (revision === importRevision) $("groundFile").value = ""; }
  });
  $("closeReport").addEventListener("click", () => {
    importRevision++; imported = null; $("importMessage").textContent = ""; renderGround(); $("groundFile").focus();
  });
  $("language").addEventListener("change", event => applyLanguage(event.target.value));
  window.addEventListener("hashchange", () => { render(); $("pageTitle").focus(); window.scrollTo(0, 0); });
  window.addEventListener("online", networkStatus); window.addEventListener("offline", networkStatus);
  window.addEventListener("storage", event => {
    if ([C.RECORD_KEY, DRAFT_KEY, ACTIVE_KEY].includes(event.key)) {
      // Avoid rewriting another tab's edits. The current tab retains its selected profile.
      run(render);
    }
  });
  window.addEventListener("pagehide", clearMedia);
  try {
    lang = localStorage.getItem("crew-health-check.language") || "en";
    const active = read(ACTIVE_KEY, {});
    if (C.codePattern.test(active.crew) && (!active.mission || C.codePattern.test(active.mission))) {
      crew = active.crew; mission = active.mission || ""; restoreDraft();
    }
  } catch { storageError(); }
  window.CrewUI = {t, el, download, language: () => lang};
  applyLanguage(lang);
  if ("serviceWorker" in navigator && ["http:", "https:"].includes(location.protocol)) {
    navigator.serviceWorker.register("./sw.js").then(() => navigator.serviceWorker.ready).then(() => {
      cacheStatus = "cacheReady"; networkStatus();
    }).catch(() => { cacheStatus = "cacheFailed"; networkStatus(); });
  } else { cacheStatus = "cacheFailed"; networkStatus(); }
})();

