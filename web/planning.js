"use strict";

const planningForm = document.getElementById("planningForm");
const budgetInput = document.getElementById("planningBudget");
const tasksInput = document.getElementById("planningTasks");
const sampleBtn = document.getElementById("planningSampleBtn");
const statusLine = document.getElementById("planningStatus");
const comparisonGrid = document.getElementById("planningComparison");
const exactLine = document.getElementById("planningExact");
const quantumLine = document.getElementById("planningQuantum");
const circuitMeta = document.getElementById("planningCircuitMeta");
const histBox = document.getElementById("planningHistBox");
const histBars = document.getElementById("planningHistBars");
const downloadBtn = document.getElementById("planningDownloadBtn");
const resultInput = document.getElementById("planningResultInput");

let plan;
let optimum;

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
  return `${result.minutes} min / ${result.points} pts — ${result.names.join(", ") || "No tasks selected"}`;
}

// In-browser QAOA (p=1) Statevector Simulator for n <= 8 qubits
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
            const r0 = re[m], i0 = im[m], r1 = re[m1], i1 = im[m1];
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
  for (let m = 0; m < dim; m++) ranked.push({ mask: m, prob: bestProbs[m] });
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
    const label = document.createElement("code");
    label.textContent = st.ket;
    const track = document.createElement("div");
    track.className = "q-bar-track";
    const fill = document.createElement("div");
    fill.className = "q-bar-fill";
    fill.style.width = `${Math.min(100, st.prob * 220)}%`;
    track.append(fill);
    const val = document.createElement("span");
    val.textContent = `${(st.prob * 100).toFixed(1)}%`;
    row.append(label, track, val);
    histBars.append(row);
  });
  histBox.hidden = false;
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
  downloadBtn.disabled = resultInput.disabled = true;
  comparisonGrid.hidden = histBox.hidden = true;
  statusLine.textContent = exactLine.textContent = quantumLine.textContent = circuitMeta.textContent = "";
  resultInput.value = "";
});

planningForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const lines = tasksInput.value.split(/\r?\n/).filter((l) => l.trim());
  const tasks = [];
  for (const line of lines) {
    const parts = line.split("|").map((p) => p.trim());
    const [name, duration, value] = parts;
    if (parts.length !== 3 || !name || name.length > 100 || !/^\d+$/.test(duration) ||
        !/^\d+$/.test(value) || +duration < 1 || +duration > 240 || +value < 1 || +value > 100) {
      statusLine.textContent = "Check each line: name | minutes (1–240) | priority points (1–100).";
      return;
    }
    tasks.push({ name, duration: +duration, value: +value });
  }
  if (!tasks.length || tasks.length > 8) {
    statusLine.textContent = "Enter between 1 and 8 operational tasks.";
    return;
  }

  plan = { budget: +budgetInput.value, tasks };
  optimum = score([]);
  for (let mask = 1; mask < 2 ** tasks.length; mask++) {
    const candidate = score(tasks.map((_, i) => (mask >> i) & 1));
    if (candidate.minutes <= plan.budget && candidate.points > optimum.points) optimum = candidate;
  }

  const qaoa = runBrowserQaoa(tasks, plan.budget);
  const qaoaResult = score(qaoa.bits);
  const gap = optimum.points - qaoaResult.points;
  const note = qaoaResult.minutes > plan.budget ? "exceeds budget" :
    gap === 0 ? "matches exact optimum" : `${gap} pts below exact optimum`;

  exactLine.textContent = describe(optimum);
  quantumLine.textContent = `${describe(qaoaResult)} (${note})`;
  circuitMeta.textContent = `In-browser QAOA p=1 · ${tasks.length} qubits (γ=${qaoa.gamma.toFixed(2)}, β=${qaoa.beta.toFixed(2)}) · ${1 << tasks.length} states`;
  comparisonGrid.hidden = false;
  renderHistogram(qaoa.topStates);

  statusLine.textContent = "Schedule comparison ready.";
  downloadBtn.disabled = resultInput.disabled = false;
});

downloadBtn.addEventListener("click", () => {
  const url = URL.createObjectURL(new Blob([JSON.stringify(plan, null, 2)], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "plan.json";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

resultInput.addEventListener("change", async () => {
  const file = resultInput.files[0];
  if (!file) return;
  const currentPlan = plan;
  try {
    if (file.size > 16384) throw new Error();
    const output = JSON.parse(await file.text());
    if (plan !== currentPlan) return;
    if (output.method !== "qiskit-qaoa" || output.plan?.budget !== plan.budget ||
        JSON.stringify(output.plan?.tasks) !== JSON.stringify(plan.tasks) ||
        !Array.isArray(output.bits) || output.bits.length !== plan.tasks.length ||
        !output.bits.every((b) => b === 0 || b === 1)) throw new Error();
    const result = score(output.bits);
    const note = result.minutes > plan.budget ? "exceeds available time" :
      result.points === optimum.points ? "matches exact optimum" : `${optimum.points - result.points} pts below exact optimum`;
    quantumLine.textContent = `${describe(result)} (${note})`;
    circuitMeta.textContent = "Verified via local Python Qiskit Aer simulator (result.json)";
    statusLine.textContent = "Qiskit verification complete.";
  } catch {
    if (plan === currentPlan) statusLine.textContent = "Invalid Qiskit result file for the current plan.";
  } finally {
    resultInput.value = "";
  }
});
