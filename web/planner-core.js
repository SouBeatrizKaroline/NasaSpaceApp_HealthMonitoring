/* Operational scheduling engines. Health records never enter this module. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CrewPlanner = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  function validatePlan(plan) {
    if (!plan || !Number.isInteger(plan.budget) || plan.budget < 1 || plan.budget > 240 ||
        !Array.isArray(plan.tasks) || plan.tasks.length < 1 || plan.tasks.length > 8) throw new Error('plan');
    const tasks = plan.tasks.map(task => {
      if (!task || typeof task.name !== 'string' || !task.name.trim() || task.name.length > 100 ||
          !Number.isInteger(task.duration) || task.duration < 1 || task.duration > 240 ||
          !Number.isInteger(task.value) || task.value < 1 || task.value > 100) throw new Error('task');
      return {name: task.name.trim(), duration: task.duration, value: task.value};
    });
    return {budget: plan.budget, tasks};
  }
  function scorePlan(plan, bits) {
    return plan.tasks.reduce((total, task, index) => {
      if (bits[index]) { total.minutes += task.duration; total.points += task.value; total.names.push(task.name); }
      return total;
    }, {minutes: 0, points: 0, names: []});
  }
  function exact(plan) {
    let best = {bits: plan.tasks.map(() => 0), ...scorePlan(plan, [])};
    for (let mask = 1; mask < 2 ** plan.tasks.length; mask++) {
      const bits = plan.tasks.map((_, index) => (mask >> index) & 1);
      const candidate = scorePlan(plan, bits);
      if (candidate.minutes <= plan.budget && candidate.points > best.points) best = {bits, ...candidate};
    }
    return best;
  }
  function importResult(value, current) {
    if (!value || value.method !== 'qiskit-qaoa') throw new Error('method');
    const plan = validatePlan(value.plan);
    if (JSON.stringify(plan) !== JSON.stringify(current) || !Array.isArray(value.bits) ||
        value.bits.length !== plan.tasks.length || !value.bits.every(bit => bit === 0 || bit === 1)) throw new Error('mismatch');
    return {bits: value.bits, ...scorePlan(plan, value.bits)};
  }
function runBrowserQaoa(tasks, budget) {
  const n = tasks.length;
  const dim = 1 << n;
  const penalty = tasks.reduce((sum, task) => sum + task.value, 0) + 1;

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
  for (const item of ranked) {
    const bits = tasks.map((_, i) => (item.mask >> i) & 1);
    if (scorePlan({tasks, budget}, bits).minutes <= budget) {
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


return {validatePlan, scorePlan, exact, runBrowserQaoa, importResult};
});
