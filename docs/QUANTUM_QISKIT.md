# Optional Qiskit Scheduling Experiment

## Purpose

Explore a small combinatorial scheduling problem with Qiskit as a research demonstration. This experiment is separate from check-in capture, status labels, and any clinical workflow.

## Safe boundary

- Uses fictional task names, durations, and utility values only.
- Contains no health measurements, symptoms, media, diagnoses, or crew records.
- Does not choose or rank clinical actions, procedures, medication, or triage.
- A classical exact enumeration is the reference baseline for the small instance.
- A QAOA result is an experimental output; no quantum advantage is claimed.
- The optional local simulator is not a requirement for running the web demo.
- Remote quantum hardware use would require separate credentials and network access and must receive only synthetic inputs.

## Reproduce

From the repository root, create a virtual environment and install `mvp/requirements-quantum.txt`. Run `python mvp/quantum_task_scheduling.py`. The script uses a tiny synthetic resource-allocation example and prints the QAOA result alongside the classical baseline. Package APIs change over time; check the current Qiskit documentation if setup differs.

## References

- IBM Quantum, [QAOA tutorial](https://quantum.cloud.ibm.com/docs/en/tutorials/quantum-approximate-optimization-algorithm)
- Qiskit Optimization, [tutorials](https://qiskit-community.github.io/qiskit-optimization/tutorials/index.html)
- IBM Quantum, [local simulators](https://quantum.cloud.ibm.com/docs/en/guides/local-simulators)
- NASA, [quantum sensing research aboard the ISS](https://science.nasa.gov/science-research/science-enabling-technology/technology-highlights/quantum-sensing-via-matter-wave-interferometry-aboard-the-international-space-station/)

Quantum sensing is not used as a health sensor in this prototype.
