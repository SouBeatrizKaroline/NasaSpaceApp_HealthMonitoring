# Operational task planning

The planner selects a subset of user-entered tasks to maximize total priority within a time budget. It does not rank patients, diagnose conditions, or determine treatment. There are no preloaded tasks.

## Three explicitly named methods

1. **Classical exhaustive search:** enumerates all subsets of 1–8 tasks. This is the exact benchmark for the entered objective.
2. **Browser statevector simulation:** `web/planner-core.js` simulates a single alternating cost/mixer layer with 1–8 task qubits. It searches 25 angle pairs and chooses the most probable feasible state. The cost is negative priority plus a squared excess-time penalty, normalized before evolution. This is classical computation simulating a quantum state, not hardware execution. No speedup or improvement over an exact optimum is claimed.
3. **Imported Qiskit QAOA result:** the optional Python script uses `StatevectorSampler`, QAOA with one layer, COBYLA, and `MinimumEigenOptimizer`. Qiskit converts the budget inequality into its own encoding, potentially adding slack variables. It solves the same task objective, but its circuit and search are not identical to the browser implementation. Numerical results need not coincide.

## Reproduce

Enter an integer budget from 1–240 minutes and 1–8 task lines in **Task Planning**. Each line is `name, duration, priority`; duration is 1–240 minutes and priority is 1–100. Names may not contain commas. Select **Compare schedules**, then **Export Qiskit input**.

In a compatible Python environment:

```sh
python -m venv .venv
# Activate the environment using your operating system's command.
python -m pip install -r mvp/requirements-quantum.txt
python mvp/quantum_task_scheduling.py task-plan.json result.json
```

Choose **Import Qiskit result** in the same plan. The result must contain `method: "qiskit-qaoa"`, matching `plan` tasks/budget, and one binary value per task in `bits`. The UI recomputes the score and flags an over-budget imported result rather than treating it as feasible. Changing an input invalidates displayed results. Package versions should be recorded when reproducing; installation and execution of this optional environment were not verified in this delivery.

Exports contain only the budget and task name/duration/priority fields. No crew ID or health record is read. Do not enter sensitive information in task names. Neither mode needs an IBM account or an API key; no hardware job is submitted.

Reference: [IBM Quantum QAOA documentation](https://quantum.cloud.ibm.com/docs/en/tutorials/quantum-approximate-optimization-algorithm). The linked hardware tutorial is background, not a description of this app's backend.
