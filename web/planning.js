"use strict";

const planningForm = document.getElementById("planningForm");
const download = document.getElementById("planningDownload");
const resultFile = document.getElementById("planningResult");
const statusLine = document.getElementById("planningStatus");
const exactLine = document.getElementById("planningExact");
const quantumLine = document.getElementById("planningQuantum");
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
  }, {minutes: 0, points: 0, names: []});
}

function describe(result) {
  return result.minutes + " min / " + result.points + " points — " + (result.names.join(", ") || "No tasks selected");
}

planningForm.addEventListener("input", () => {
  plan = undefined;
  download.disabled = resultFile.disabled = true;
  statusLine.textContent = exactLine.textContent = quantumLine.textContent = "";
  resultFile.value = "";
});

planningForm.addEventListener("submit", event => {
  event.preventDefault();
  const lines = document.getElementById("planningTasks").value.split(/\r?\n/).filter(line => line.trim());
  const tasks = [];
  for (const line of lines) {
    const parts = line.split("|").map(part => part.trim());
    const [name, duration, value] = parts;
    if (parts.length !== 3 || !name || name.length > 100 || !/^\d+$/.test(duration) ||
        !/^\d+$/.test(value) || +duration < 1 || +duration > 240 || +value < 1 || +value > 100) {
      statusLine.textContent = "Check each line: name (up to 100 characters) | minutes (1–240) | points (1–100).";
      return;
    }
    tasks.push({name, duration: +duration, value: +value});
  }
  if (!tasks.length || tasks.length > 8) {
    statusLine.textContent = "Enter between one and eight tasks.";
    return;
  }

  plan = {budget: +document.getElementById("planningBudget").value, tasks};
  optimum = score([]);
  for (let mask = 1; mask < 2 ** tasks.length; mask++) {
    const candidate = score(tasks.map((_, index) => (mask >> index) & 1));
    if (candidate.minutes <= plan.budget && candidate.points > optimum.points) optimum = candidate;
  }
  exactLine.textContent = "Exact classical result: " + describe(optimum);
  quantumLine.textContent = "";
  statusLine.textContent = "Download this plan and run Qiskit to add the simulator result.";
  download.disabled = resultFile.disabled = false;
});

download.addEventListener("click", () => {
  const url = URL.createObjectURL(new Blob([JSON.stringify(plan, null, 2)], {type: "application/json"}));
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
  quantumLine.textContent = "";
  try {
    if (file.size > 16384) throw new Error();
    const output = JSON.parse(await file.text());
    if (plan !== currentPlan) return;
    if (output.method !== "qiskit-qaoa" || output.plan?.budget !== plan.budget ||
        JSON.stringify(output.plan?.tasks) !== JSON.stringify(plan.tasks) ||
        !Array.isArray(output.bits) || output.bits.length !== plan.tasks.length ||
        !output.bits.every(bit => bit === 0 || bit === 1)) throw new Error();
    const result = score(output.bits);
    const comparison = result.minutes > plan.budget ? "exceeds available time" :
      result.points === optimum.points ? "matches the exact optimum" :
      (optimum.points - result.points) + " points below the exact optimum";
    quantumLine.textContent = "Imported QAOA result: " + describe(result) + " (" + comparison + ").";
    statusLine.textContent = "Comparison complete.";
  } catch {
    if (plan === currentPlan) statusLine.textContent = "Choose a Qiskit result generated from the current plan.";
  } finally {
    resultFile.value = "";
  }
});
