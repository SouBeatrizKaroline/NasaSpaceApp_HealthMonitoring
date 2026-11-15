# Onboard Task Planning with Qiskit

The web panel compares schedules for operational tasks entered by the user. It calculates the exact optimum by enumeration and can import a schedule produced by QAOA on a local Qiskit simulator. The panel shows the selected tasks, total minutes, priority points, and difference from the optimum.

1. Open **Onboard task planning** in the web interface and enter the available minutes and up to eight operational tasks.
2. Select **Compare schedules**, then download `plan.json`.
3. From the repository root, install the optional dependencies with `python -m pip install -r mvp/requirements-quantum.txt`.
4. Run `python mvp/quantum_task_scheduling.py plan.json result.json`.
5. Open `result.json` in the planning panel. The panel checks that the file matches the current plan and recalculates the reported schedule's time and value.

Keep medical records, crew identifiers, and sensitive operational details out of planning files. The schedule is an advisory comparison for operational tasks. The current solver runs locally and does not claim a quantum advantage.

Reference: [IBM Quantum QAOA tutorial](https://quantum.cloud.ibm.com/docs/en/tutorials/quantum-approximate-optimization-algorithm).
