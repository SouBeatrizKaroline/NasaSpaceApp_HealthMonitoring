"""Synthetic task-scheduling research demo. No health data or clinical decisions."""
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
    # Fictional work items for a toy resource-allocation example.
    tasks = [
        {"name": "Inspect filter", "duration": 2, "value": 5},
        {"name": "Inventory tools", "duration": 3, "value": 7},
        {"name": "Review checklist", "duration": 1, "value": 3},
        {"name": "Organize samples", "duration": 2, "value": 4},
    ]
    budget = 5
    classical_value, classical_bits = exact_classical(tasks, budget)
    print("Synthetic scheduling example")
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

    problem = QuadraticProgram("synthetic_task_schedule")
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
        )
    )
    result = solver.solve(problem)
    chosen = tuple(int(round(value)) for value in result.x)
    print("QAOA simulator result:", result.fval, chosen)
    print("Selected synthetic tasks:", [
        task["name"] for task, bit in zip(tasks, chosen) if bit
    ])
    print("This is a toy experiment; compare with the exact baseline.")
    print("No advantage is asserted and no crew or health data is used.")


if __name__ == "__main__":
    main()
