# Arquitetura Quântica (Viável com Recursos Limitados)

Para evitar que o uso de tecnologias quânticas seja apenas "decorativo" ou impossível de demonstrar em um hackathon, o **AstroCare-Q** separa claramente o que **roda hoje em simulador** do que é **integração de sensores futuros**.

---

## 1. Computação Quântica — Roda no MVP (Simulador Local)

### Problema Real da Missão: Triagem Multi-Critério sob Recursos Limitados
Quando um astronauta apresenta múltiplos desvios simultâneos (ex.: fadiga + lesão de pele + alteração cardiovascular) e a nave tem **tempo de tripulação, energia e estoque médico limitados**, qual protocolo deve ser priorizado?

- **Solução:** Modelagem como problema **QUBO** (*Quadratic Unconstrained Binary Optimization*), resolvível por **QAOA** (*Quantum Approximate Optimization Algorithm*) em simuladores (Qiskit Aer) ou *annealing* simulado:
  - **Variáveis binárias ($x_i \in \{0,1\}$):** Executar ou não o protocolo clínico $i$.
  - **Função objetivo:** Maximizar a redução de risco clínico (peso NANDA-I + gravidade médica) penalizando conflitos de tempo e consumo excessivo de suprimentos.
- **Quantum Machine Learning (QML) — Evolução:** Uso de *Quantum Kernel Estimation* para classificar padrões de biomarcadores em conjuntos pequenos (*small-data*), cenário típico de dados médicos de astronautas.

---

## 2. Engenharia Quântica — Camada de Biossensores (Telemetria Simulada)

Na arquitetura do sistema, a entrada de dados aceita um JSON padronizado preparado para **sensores quânticos de próxima geração** (simulados no MVP por geradores sintéticos):

1. **Magnetometria Quântica (NV-Centers em Diamante / OPMs):**
   - Medição sem contato de campos magnéticos do coração (**MCG**) e cérebro (**MEG**) com altíssima sensibilidade, eliminando eletrodos descartáveis em missões longas.
2. **Dosimetria Quântica de Radiação:**
   - Monitoramento em tempo real do fluxo de partículas ionizantes no habitat para correlacionar exposição com risco imunológico e cutâneo.

---

## 3. Ciência Quântica — Modelagem e Segurança

- **Modelagem de Dano Biológico por Radiação:** Uso de parâmetros probabilísticos de interação radiação-tecido para ajustar o limiar de alerta do painel corporal conforme o ambiente (*ISS/Órbita Baixa* vs. *Espaço Profundo/Marte*).
- **Comunicação Segura (Criptografia Pós-Quântica - PQC):** Camada conceitual para proteger o prontuário eletrônico do astronauta contra interceptação nas transmissões nave ↔ Terra.
