"use strict";

(() => {
  // Published actigraphy means and standard deviations, in hours per night.
  // Barger et al. (2014), DOI 10.1016/S1474-4422(14)70122-X, PMID 25127232.
  const periods = [
    "About 3 months before launch",
    "11 days before launch",
    "In flight",
    "First week after return"
  ];
  const cohorts = {
    iss: {
      sample: "ISS cohort: 21 astronauts across 13 missions (study totals).",
      values: [[6.41, 0.65], [5.86, 0.94], [6.09, 0.67], [6.95, 1.04]]
    },
    shuttle: {
      sample: "Shuttle cohort: 64 astronauts across 26 flights (study totals).",
      values: [[6.29, 0.67], [6.04, 0.72], [5.96, 0.56], [6.74, 0.91]]
    }
  };
  const select = document.getElementById("researchCohort");
  const sample = document.getElementById("researchSample");
  const rows = document.getElementById("researchRows");
  const signedHours = new Intl.NumberFormat("en", {
    minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: "exceptZero"
  });

  function render() {
    const {sample: sampleText, values} = cohorts[select.value];
    sample.textContent = sampleText;
    rows.replaceChildren();
    values.forEach(([mean, sd], index) => {
      const row = document.createElement("tr");
      const heading = document.createElement("th");
      heading.scope = "row";
      heading.textContent = periods[index];
      row.append(heading);

      const meanCell = row.insertCell();
      meanCell.textContent = mean.toFixed(2);
      const bar = document.createElement("meter");
      bar.min = 0;
      bar.max = 24;
      bar.value = mean;
      bar.setAttribute("aria-hidden", "true");
      meanCell.append(bar);
      row.insertCell().textContent = sd.toFixed(2);
      row.insertCell().textContent = index === 0 ? "Reference period" : signedHours.format(mean - values[0][0]);
      rows.append(row);
    });
  }

  select.addEventListener("change", render);
  render();
})();
