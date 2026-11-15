# AstroCare-Q — Health Monitoring Software for Astronauts

> **2026 NASA Space Apps Challenge** · *Create Health Monitoring Software for Astronauts on Space Missions*

**AstroCare-Q** é uma plataforma enxuta de monitoramento de saúde autônomo para astronautas em missões de longa duração (Lua/Artemis, estações orbitais, rovers e Marte). O sistema integra **Anamnese Espacial Estruturada**, **Diagnósticos de Enfermagem (NANDA-I)**, **Triagem Médica (CID-11/Flight Surgeon)**, **Análise Multimodal (Vídeo, Foto, Voz)** e **Computação/Engenharia Quântica** em uma interface limpa e de baixa carga cognitiva.

---

## 🎯 Por que este modelo resolve o desafio?

Em missões distantes da Terra, o atraso de comunicação impede suporte médico em tempo real. O astronauta precisa identificar alterações precocemente e agir com autonomia:

1. **Anamnese + NANDA-I + Diagnóstico Médico (Camada Clínica Dupla):**
   - **Diagnóstico de Enfermagem (NANDA-I):** Foca na *resposta humana e no autocuidado* (sono, hidratação, intolerância à atividade, integridade da pele, estresse), gerando ações práticas imediatas que o próprio astronauta executa.
   - **Diagnóstico Médico / Triagem:** Avalia gravidade clínica (ex.: síndrome neuro-ocular associada ao voo espacial — SANS, arritmias, infecções) e define quando acionar a equipe ou o *Flight Surgeon* em Terra.
2. **Análise Multimodal Leve (Sem Hardware Complexo):**
   - **Vídeo (rPPG via webcam):** Estima frequência cardíaca e variabilidade (HRV) pelo rosto em 15–30s.
   - **Foto / Imagem:** Avaliação visual de pele, edema facial (*puffy face*) ou tiras de exame rápido.
   - **Voz:** Transcrição da anamnese falada (mãos livres) + análise básica de fadiga/estresse vocal.
3. **Computação, Engenharia e Ciência Quântica (Viável com Recursos Limitados):**
   - **Computação Quântica (QUBO / QML):** Otimização combinatória de triagem (qual protocolo executar primeiro considerando risco vital, tempo e estoque médico limitado) via simulador local.
   - **Engenharia Quântica (Camada de Sensores):** Arquitetura preparada para telemetria de magnetometria quântica (NV-centers/OPMs) e dosimetria quântica de radiação (simulada via JSON/API no MVP).
   - **Ciência Quântica:** Modelagem de risco cumulativo por radiação cósmica e proteção de dados clínicos com criptografia pós-quântica.
4. **Design Enxuto (Low Cognitive Load):**
   - Apenas **3 visões principais**, sem poluição visual: *Painel Corporal Interativo*, *Check-in Multimodal* e *Rotina da Missão*.

---

## 📁 Estrutura do Repositório

```text
NasaSpaceApp_HealthMonitoring/
├── README.md                          # Visão geral e arquitetura do projeto
├── docs/
│   ├── PRODUCT_MANAGEMENT.md          # Estratégia de Produto, MVP, Personas e Viabilidade
│   ├── DESIGN_UX_UI.md                # Diretrizes de Design, 3 Telas e Código de Cores
│   ├── CLINICAL_NANDA_MEDICAL.md      # Motor de Anamnese, NANDA-I e Triagem Médica
│   └── QUANTUM_ARCHITECTURE.md        # Computação, Engenharia e Ciência Quântica no MVP
└── mvp/
    ├── anamnesis_nanda_engine.json    # Base clínica conectando os 5 Riscos da NASA ao NANDA-I
    └── quantum_triage_qubo.py         # Protótipo funcional de priorização clínica via QUBO
```

---

## 🛠️ Stack Recomendada para o MVP (Recursos Limitados)

| Camada | Tecnologia Leve / Gratuita | Motivo da Escolha |
| :--- | :--- | :--- |
| **Frontend** | React + Vite + TypeScript + Tailwind CSS | Rápido de prototipar, responsivo e leve para rodar offline na nave. |
| **Backend** | Python (FastAPI) | Integra nativamente visão computacional, áudio e bibliotecas quânticas. |
| **Multimodal** | OpenCV + MediaPipe + Web Speech API | rPPG por webcam, análise de imagem e transcrição de voz sem custo de GPU pesada. |
| **Quântico** | Qiskit (AerSimulator) / NumPy fallback | Executa algoritmos QUBO/QAOA localmente em notebook comum para a demo. |

---

## 🚀 Como testar o protótipo QUBO (MVP)

```bash
python mvp/quantum_triage_qubo.py
```

O script executa a otimização de priorização clínica para um astronauta com múltiplos achados simultâneos, respeitando restrições de tempo e suprimentos médicos da missão.
