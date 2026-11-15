# Motor Clínico: Anamnese + NANDA-I + Diagnóstico Médico

## 1. Por que combinar Anamnese, NANDA-I e Diagnóstico Médico?

A maioria dos softwares de saúde foca apenas em *números* ou apenas em *doenças*. No espaço, o astronauta precisa de **duas camadas complementares**:

| Camada | Foco Principal | Papel na Missão Espacial |
| :--- | :--- | :--- |
| **Anamnese Espacial (SOAP)** | Coleta estruturada (Subjetivo + Objetivo) contextualizada nos **5 Riscos da NASA**. | Contextualiza o sintoma (ex.: dor de cabeça em microgravidade tem causa diferente da Terra). |
| **Diagnóstico de Enfermagem (NANDA-I)** | Resposta humana ao problema e **autocuidado**. | Gera intervenções práticas e imediatas que o astronauta executa sem médico a bordo. |
| **Diagnóstico Médico (Hipótese Clínica)** | Identificação de patologia e **risco vital**. | Define critérios objetivos de gravidade e dispara alerta para a tripulação / *Flight Surgeon*. |

---

## 2. Fluxo de Micro-Anamnese (Adaptado ao Espaço)

1. **S (Subjetivo):** Queixa principal capturada por voz ou clique + nível de desconforto (1–10) + duração.
2. **O (Objetivo):** Sinais vitais (PA, FC, Temp, Glicemia, Sono) + dados multimodais (foto/vídeo/voz) + exposição ambiental (radiação/gravidade).
3. **A (Avaliação Dupla):**
   - *NANDA-I:* Identifica o diagnóstico de enfermagem prioritário.
   - *Médico:* Calcula score de risco para hipóteses espaciais críticas.
4. **P (Plano):** Ação imediata de autocuidado + decisão de escalonamento.

---

## 3. Mapeamento Prático (Exemplos Implementados no MVP)

| Risco NASA | Indicadores / Sinais | Diagnóstico NANDA-I | Ação de Enfermagem (Autocuidado) | Hipótese Médica / Alerta |
| :--- | :--- | :--- | :--- | :--- |
| **Campos de Gravidade** | Edema facial, visão turva, cefaleia matinal | *Perfusão tissular periférica ineficaz* / *Risco de lesão* | Elevar cabeceira/posição, reduzir sódio, realizar teste visual de Amsler | Suspeita de **SANS** (*Spaceflight Associated Neuro-ocular Syndrome*) → Notificar *Flight Surgeon* |
| **Isolamento & Confinamento** | Sono < 5h, tremor/monotonia na voz, humor baixo | *Padrão de sono prejudicado (00198)* / *Ansiedade (00146)* | Protocolo de higiene do sono (reduzir luz azul), respiração guiada, contato assíncrono com família | Risco de fadiga operacional / transtorno de adaptação → Monitorar 48h |
| **Radiação Espacial** | Dose cumulativa alta + fadiga + eritema cutâneo (foto) | *Integridade da pele prejudicada (00046)* / *Fadiga (00093)* | Abrigo em módulo blindado, hidratação cutânea, reforço antioxidante | Síndrome aguda/subaguda por radiação → Alerta Vermelho imediato |
| **Ambiente Fechado Hostil** | Glicemia baixa/alta, sede, taquicardia (vídeo rPPG) | *Volume de líquidos deficiente (00027)* / *Nutrição desequilibrada* | Reposição hidroeletrolítica fracionada e ajuste calórico da ração | Desidratação severa ou evento metabólico/cardiovascular → Reavaliar em 30 min |
