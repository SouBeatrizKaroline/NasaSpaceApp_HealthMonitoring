"use strict";

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

// Pure-JS QAOA (p=1) Statevector Simulator for n <= 8 qubits
// Minimizes H_C(x) = -sum(v_i * x_i) + penalty * max(0, sum(d_i * x_i) - budget)^2
function runBrowserQaoa(tasks, budget) {
  const n = tasks.length;
  const dim = 1 << n;
  const penalty = 2.0;

  // Precompute normalized cost diagonal H_C[mask]
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

  // Apply QAOA p=1 circuit and grid-search (gamma, beta)
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

      // 1. Initialize |+>^n and apply Cost Unitary e^{-i * gamma * H_C}
      for (let m = 0; m < dim; m++) {
        const angle = -gamma * costs[m];
        re[m] = invSqrtDim * Math.cos(angle);
        im[m] = invSqrtDim * Math.sin(angle);
      }

      // 2. Apply Mixer Unitary prod_q R_X(2 * beta) = prod_q (cos(beta)I - i sin(beta)X)
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

      // 3. Compute expectation <H_C>
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

  // Rank top-5 measured basis states & pick best feasible high-probability state
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

  // Run live in-browser QAOA statevector simulation
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
