# Design & UX/UI — Princípio de Baixa Carga Cognitiva

## 1. Filosofia de Design
Em ambientes espaciais hostis, **menos é segurança**. Interfaces cheias de gráficos simultâneos, menus profundos e cores vibrantes em excesso aumentam o erro humano.

**Regras de Ouro do Design:**
1. **Máximo de 3 Visões Principais:** Sem submenus complexos.
2. **Semáforo Clínico Universal:**
   - 🟢 **Nominal (`#22C55E`):** Indicadores dentro da faixa esperada para o ambiente.
   - 🟡 **Atenção (`#F59E0B`):** Desvio leve; requer ação de autocuidado (NANDA-I).
   - 🔴 **Crítico (`#EF4444`):** Risco clínico; requer protocolo imediato e notificação ao *Flight Surgeon*.
3. **Dark Mode de Cabine (`#0B0F19`):** Reduz fadiga ocular em ambientes com iluminação artificial controlada e economiza energia em telas OLED.
4. **Linguagem Acessível:** Todo termo técnico (ex.: *NANDA-I 00198*) é acompanhado de explicação simples e "por que este exame importa".

---

## 2. Arquitetura das 3 Visões

### Visão 1: Painel Corporal & Status da Missão (Home)
- **Centro:** Silhueta humana vetorial (SVG) limpa com **5 zonas clicáveis**:
  1. *Cabeça & Neuro-Ocular* (SANS, sono, estresse, dor de cabeça)
  2. *Tórax & Cardiovascular* (FC, PA, HRV, respiração)
  3. *Metabolismo & Nutrição* (glicemia, hidratação, temperatura)
  4. *Musculoesquelético* (perda óssea/muscular por microgravidade)
  5. *Pele & Imunidade* (lesões, erupções, radiação)
- **Lateral Direita:** Card de detalhe da zona selecionada + **1 gráfico de tendência temporal** (últimos 7 dias) + seletor de ambiente (*Nave / Estação / Rover / Base*).

### Visão 2: Check-in Rápido & Multimodal (Fluxo em 3 Passos)
- **Passo 1 — Queixa & Voz:** Botão único de microfone ("Fale como se sente") ou seleção rápida de sintoma.
- **Passo 2 — Evidência Multimodal:**
  - Upload/captura de **Foto** (pele, olho, tira reagente)
  - Medição por **Vídeo** (15s de câmera para pulso rPPG)
  - Entrada rápida de **Sinais Vitais** (PA, glicemia, temperatura, horas de sono)
- **Passo 3 — Diagnóstico & Ação:**
  - Exibe **Diagnóstico de Enfermagem (NANDA-I)** + **Ação Prática Imediata**
  - Exibe **Alerta Médico / Prioridade Quântica** (se aplicável).

### Visão 3: Rotina & Micro-Gamificação
- Checklist diário enxuto integrado à rotina da missão (ex.: *Exercício Resistido 45min*, *Hidratação 2.5L*, *Check-in de Humor*).
- Barra de **Prontidão da Missão (Mission Readiness Score)** discreta, sem elementos infantis, mantendo o engajamento científico.
