"""Compare schedules for user-entered operational tasks."""
import argparse
import json
from pathlib import Path
from itertools import product


def exact_classical(tasks, budget):
    best_value, best = -1, None
    for bits in product((0, 1), repeat=len(tasks)):
        duration = sum(bit * task["duration"] for bit, task in zip(bits, tasks))
        value = sum(bit * task["value"] for bit, task in zip(bits, tasks))
        if duration <= budget and value > best_value:
            best_value, best = value, bits
    return best_value, best


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("plan", type=Path)
    parser.add_argument("result", type=Path)
    args = parser.parse_args()
    if args.plan.resolve() == args.result.resolve():
        parser.error("Choose a different path for the result.")
    try:
        plan = json.loads(args.plan.read_text(encoding="utf-8"))
        tasks, budget = plan["tasks"], plan["budget"]
        if type(budget) is not int or not 1 <= budget <= 240:
            raise ValueError
        if not isinstance(tasks, list) or not 1 <= len(tasks) <= 8:
            raise ValueError
        for task in tasks:
            name, duration, value = task["name"], task["duration"], task["value"]
            if not isinstance(name, str) or not name.strip() or len(name) > 100:
                raise ValueError
            if type(duration) is not int or not 1 <= duration <= 240:
                raise ValueError
            if type(value) is not int or not 1 <= value <= 100:
                raise ValueError
    except (OSError, ValueError, KeyError, TypeError):
        parser.error("Provide a valid plan exported from the task planning panel.")
    classical_value, classical_bits = exact_classical(tasks, budget)
    print("Operational task scheduling")
    print("Exact classical baseline:", classical_value, classical_bits)

    try:
        from qiskit.primitives import StatevectorSampler
        from qiskit_algorithms import QAOA
        from qiskit_algorithms.optimizers import COBYLA
        from qiskit_optimization import QuadraticProgram
        from qiskit_optimization.algorithms import MinimumEigenOptimizer
    except ImportError as exc:
        raise SystemExit(
            "Install optional packages from mvp/requirements-quantum.txt"
        ) from exc

    # Keep only the public task contract; extra input fields are never exported.
    tasks = [{"name": task["name"].strip(), "duration": task["duration"], "value": task["value"]} for task in tasks]
    problem = QuadraticProgram("operational_task_schedule")
    for index in range(len(tasks)):
        problem.binary_var(name=f"x{index}")
    problem.maximize(
        linear={f"x{i}": task["value"] for i, task in enumerate(tasks)}
    )
    problem.linear_constraint(
        linear={f"x{i}": task["duration"] for i, task in enumerate(tasks)},
        sense="<=",
        rhs=budget,
        name="time_budget",
    )

    solver = MinimumEigenOptimizer(
        QAOA(
            sampler=StatevectorSampler(seed=7),
            optimizer=COBYLA(maxiter=80),
            reps=1,
            initial_point=[0.4, 0.8],
        )
    )
    result = solver.solve(problem)
    chosen = tuple(int(round(value)) for value in result.x)
    print("QAOA simulator result:", result.fval, chosen)
    print("Selected tasks:", [
        task["name"] for task, bit in zip(tasks, chosen) if bit
    ])
    output = {"method": "qiskit-qaoa", "plan": {"budget": budget, "tasks": tasks}, "bits": chosen}
    args.result.write_text(json.dumps(output, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()

