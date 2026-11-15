# Onboard Task Planning with Qiskit & In-Browser QAOA

The **Onboard Task Planning** panel compares operational schedules for tasks entered by the crew. It runs **two complementary quantum modes** while keeping crew health records and personal identifiers strictly out of planning files:

1. **Live In-Browser QAOA Simulator (`web/planning.js`):** Runs a real $p=1$ Quantum Approximate Optimization Algorithm (QAOA) statevector simulation directly in the browser (up to 8 qubits / 256 basis states) with a live probability histogram of the top measured `|bitstring⟩` states, comparing the quantum schedule against the exact classical optimum with zero backend required.
2. **Local Qiskit Aer Verification (`mvp/quantum_task_scheduling.py`):** Exports `plan.json` so you can run the full Qiskit Optimization QAOA pipeline locally and import `result.json` back into the web interface.

## Reproduce with Local Qiskit Aer

1. Open **Onboard task planning** in the web interface, click **Load sample lunar tasks** (or enter up to 8 operational tasks), and click **Compare schedules**.
2. Click **Download Qiskit input** to save `plan.json`.
3. From the repository root, install the optional dependencies with `python -m pip install -r mvp/requirements-quantum.txt`.
4. Run `python mvp/quantum_task_scheduling.py plan.json result.json`.
5. Open `result.json` in the planning panel to verify the Qiskit Aer output against the exact classical optimum.

Keep medical records, crew identifiers, and sensitive operational details out of planning files. The schedule is an advisory comparison for operational tasks, and no quantum advantage is claimed for small instances.

Reference: [IBM Quantum QAOA tutorial](https://quantum.cloud.ibm.com/docs/en/tutorials/quantum-approximate-optimization-algorithm).
