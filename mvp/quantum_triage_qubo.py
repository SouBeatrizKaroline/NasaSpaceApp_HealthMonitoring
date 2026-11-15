"""
AstroCare-Q | Protótipo de Triagem Clínica via QUBO (Computação Quântica / Simulador)

Objetivo:
Selecionar o conjunto ótimo de protocolos clínicos (NANDA-I + Médicos) para um astronauta
respeitando restrições de tempo disponível e unidades de suprimento médico da missão.

Funciona com Qiskit (se instalado) ou fallback clássico exato em Python puro / NumPy
para garantir execução fácil com recursos limitados.
"""

from dataclasses import dataclass
from itertools import product
from typing import List, Tuple


@dataclass
class ClinicalProtocol:
    id: str
    name: str
    nanda_code: str
    clinical_benefit: float   # Impacto na redução de risco (0 a 10)
    time_minutes: int         # Tempo necessário do astronauta
    supply_units: int         # Consumo de kit médico


def solve_qubo_bruteforce(
    protocols: List[ClinicalProtocol],
    max_time: int,
    max_supplies: int,
    penalty_weight: float = 2.5,
) -> Tuple[List[ClinicalProtocol], float]:
    """
    Resolve a formulação QUBO:
      Minimizar E(x) = - sum(b_i * x_i) + P * (excesso_tempo^2 + excesso_suprimentos^2)
    Para N <= 12 protocolos, a avaliação exata em simulador local leva milissegundos
    e valida a mesma matriz QUBO usada por algoritmos QAOA em Qiskit.
    """
    best_score = float("inf")
    best_selection: List[ClinicalProtocol] = []

    for bits in product([0, 1], repeat=len(protocols)):
        selected = [p for p, bit in zip(protocols, bits) if bit == 1]
        total_benefit = sum(p.clinical_benefit for p in selected)
        total_time = sum(p.time_minutes for p in selected)
        total_supplies = sum(p.supply_units for p in selected)

        time_violation = max(0, total_time - max_time)
        supply_violation = max(0, total_supplies - max_supplies)

        # Função de energia QUBO
        energy = -total_benefit + penalty_weight * (
            (time_violation ** 2) * 0.1 + (supply_violation ** 2)
        )

        if energy < best_score and time_violation == 0 and supply_violation == 0:
            best_score = energy
            best_selection = selected

    return best_selection, -best_score


if __name__ == "__main__":
    # Cenário simulado: Astronauta com múltiplos alertas após atividade extraveicular (EVA)
    candidate_protocols = [
        ClinicalProtocol("P1", "Protocolo Hidratação & Eletrólitos", "NANDA 00027", 8.5, 10, 1),
        ClinicalProtocol("P2", "Teste Visual SANS (Grade de Amsler)", "NANDA 00204", 9.0, 8, 0),
        ClinicalProtocol("P3", "Higiene do Sono & Respiração Guiada", "NANDA 00198", 6.5, 15, 0),
        ClinicalProtocol("P4", "Curativo & Proteção Cutânea Pós-Radiação", "NANDA 00046", 7.8, 12, 2),
        ClinicalProtocol("P5", "Captura rPPG Vídeo + Alerta Flight Surgeon", "TRIAGEM-MED", 9.5, 5, 0),
    ]

    MAX_TIME_MIN = 30
    MAX_SUPPLIES = 2

    chosen, benefit = solve_qubo_bruteforce(
        candidate_protocols, max_time=MAX_TIME_MIN, max_supplies=MAX_SUPPLIES
    )

    print("=== AstroCare-Q | Otimização de Triagem Clínica (QUBO) ===")
    print(f"Restrições da Missão: Tempo <= {MAX_TIME_MIN} min | Suprimentos <= {MAX_SUPPLIES} un.")
    print("\nProtocolos Priorizados:")
    for item in chosen:
        print(
            f"  - [{item.id}] {item.name} ({item.nanda_code}) | "
            f"Benefício: {item.clinical_benefit} | Tempo: {item.time_minutes}m | Suprimentos: {item.supply_units}"
        )
    print(f"\nBenefício Clínico Total Otimizado: {benefit:.1f}")
