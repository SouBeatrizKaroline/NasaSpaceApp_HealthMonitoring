# Product Management — AstroCare-Q

## 1. Visão do Produto
Capacitar astronautas em missões de longa duração a **monitorar, compreender e agir** sobre sua própria saúde física e mental em menos de 2 minutos por check-in, mesmo sem conexão em tempo real com a Terra.

---

## 2. Personas

| Persona | Contexto | Principal Dor | O que o AstroCare-Q entrega |
| :--- | :--- | :--- | :--- |
| **Astronauta (Usuário Primário)** | Em órbita, base lunar ou trânsito para Marte; rotina intensa, fadiga e isolamento. | Não é médico; formulários longos geram atrito e atrasam a detecção de riscos. | Check-in rápido por voz/câmera, mapa corporal visual e ações práticas (NANDA-I). |
| **Flight Surgeon (Usuário Secundário)** | Médico de voo em Terra (com atraso de sinal de minutos). | Recebe dados brutos desconexos sem contexto clínico estruturado. | Resumo SOAP estruturado, hipótese médica e prioridade calculada. |

---

## 3. Escopo Enxuto: MVP (Hackathon) vs. Pós-Hackathon

Para entregar um projeto funcional e polido com **recursos limitados**, o escopo é rigorosamente dividido:

### ✅ Fase 1 — MVP Funcional (Hackathon 48h)
- **Mapa Corporal Interativo (SVG):** 5 regiões clicáveis com status por cor (Verde/Âmbar/Vermelho).
- **Micro-Anamnese Guiada (3 passos):** Queixa principal + 3 perguntas adaptativas + sinais vitais.
- **Captura Multimodal Básica:**
  - *Webcam:* Estimativa simples de pulso (rPPG) ou captura de foto de pele/rosto.
  - *Voz:* Ditado da queixa principal (Web Speech API) com extração de palavras-chave.
- **Motor Clínico JSON:** Cruzamento determinístico de Anamnese → Diagnóstico NANDA-I → Ação de Autocuidado → Alerta Médico.
- **Módulo Quântico Simulado (`quantum_triage_qubo.py`):** Priorização de intervenções médicas quando há múltiplos alertas simultâneos.
- **Modo Ambiente:** Seletor de contexto (*Nave*, *Estação*, *Rover*, *Base Lunar/Marciana*) que ajusta os alertas de risco.

### 🔭 Fase 2 — Evolução Pós-Hackathon
- Integração real com sensores vestíveis via Bluetooth/BLE e telemetria de dosímetros quânticos.
- Treinamento de *Quantum Kernel* (QML) com datasets públicos da NASA Life Sciences Data Archive.
- Sincronização assíncrona criptografada (PQC) para o painel do *Flight Surgeon*.

---

## 4. Métricas de Sucesso (KPIs)
- **Tempo de Check-in:** < 90 segundos do início ao plano de ação.
- **Taxa de Aderência:** > 85% dos check-ins diários concluídos (apoiado por micro-gamificação discreta).
- **Clareza de Decisão:** 100% dos alertas críticos acompanhados de instrução passo a passo em linguagem simples.
