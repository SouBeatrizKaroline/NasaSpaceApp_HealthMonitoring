/* Independent operational task workspace. No access to health storage. */
(() => {
  'use strict';
  const {el, download, language} = window.CrewUI;
  const P = window.CrewPlanner;
  const copy = {
    en: ['Plan the work ahead','Compare two methods on your own task list. No crew identifiers or health records are included.','Available time (minutes)','Tasks: one per line — name, minutes, priority','Use 1–8 tasks, 1–240 minutes per task, and priority 1–100. Do not enter personal or health information.','Compare schedules','Classical · exhaustive search','Quantum · browser statevector simulation','priority points','minutes','No tasks selected','Export Qiskit input','Import Qiskit result','Qiskit · imported QAOA result','Enter a valid task list and time budget.','The result does not match this plan or is not a valid Qiskit result. Try another file.','Local simulation, not quantum hardware. A one-layer circuit searches 25 angle pairs. The most probable feasible state is shown; improvement over the classical optimum is not claimed.','Reproduce with Qiskit','Plan inputs changed. Run the comparison again.','Over budget: this imported result is infeasible.'],
    pt: ['Organize as próximas tarefas','Compare dois métodos com suas tarefas. Identificadores e registros de saúde não são incluídos.','Tempo disponível (minutos)','Tarefas: uma por linha — nome, minutos, prioridade','Use de 1 a 8 tarefas, 1 a 240 minutos por tarefa e prioridade de 1 a 100. Não insira informações pessoais ou de saúde.','Comparar planos','Clássico · busca exaustiva','Quântico · simulação de vetor de estado no navegador','pontos de prioridade','minutos','Nenhuma tarefa selecionada','Exportar entrada Qiskit','Importar resultado Qiskit','Qiskit · resultado QAOA importado','Insira tarefas e tempo válidos.','O resultado não corresponde ao plano ou é inválido. Tente outro arquivo.','Simulação local, sem hardware quântico. Um circuito de uma camada pesquisa 25 pares de ângulos. É exibido o estado viável mais provável; não há alegação de melhoria sobre o ótimo clássico.','Reproduzir com Qiskit','Entradas alteradas. Compare novamente.','Acima do tempo: resultado importado inviável.'],
    es: ['Organiza las próximas tareas','Compara dos métodos con tus tareas. No se incluyen identificadores ni registros de salud.','Tiempo disponible (minutos)','Tareas: una por línea — nombre, minutos, prioridad','Usa de 1 a 8 tareas, de 1 a 240 minutos por tarea y prioridad de 1 a 100. No introduzcas información personal ni de salud.','Comparar planes','Clásico · búsqueda exhaustiva','Cuántico · simulación de vector de estado local','puntos de prioridad','minutos','Ninguna tarea seleccionada','Exportar entrada Qiskit','Importar resultado Qiskit','Qiskit · resultado QAOA importado','Introduce tareas y tiempo válidos.','El resultado no coincide con este plan o no es válido. Prueba otro archivo.','Simulación local, sin hardware cuántico. Un circuito de una capa busca 25 pares de ángulos. Se muestra el estado factible más probable; no se afirma una mejora sobre el óptimo clásico.','Reproducir con Qiskit','Entradas modificadas. Compara de nuevo.','Excede el tiempo: resultado importado no factible.'],
    fr: ['Organiser les prochaines tâches','Comparez deux méthodes avec vos tâches. Aucun identifiant ni dossier de santé n’est inclus.','Temps disponible (minutes)','Tâches : une par ligne — nom, minutes, priorité','Utilisez 1 à 8 tâches, 1 à 240 minutes par tâche et une priorité de 1 à 100. Ne saisissez aucune information personnelle ou de santé.','Comparer les plans','Classique · recherche exhaustive','Quantique · simulation locale du vecteur d’état','points de priorité','minutes','Aucune tâche sélectionnée','Exporter les données Qiskit','Importer un résultat Qiskit','Qiskit · résultat QAOA importé','Saisissez des tâches et une durée valides.','Le résultat ne correspond pas au plan ou est invalide. Essayez un autre fichier.','Simulation locale, sans matériel quantique. Un circuit à une couche explore 25 paires d’angles. L’état réalisable le plus probable est affiché ; aucun gain sur l’optimum classique n’est annoncé.','Reproduire avec Qiskit','Données modifiées. Comparez à nouveau.','Temps dépassé : résultat importé non réalisable.']
  };
  let budget = '', tasks = '', plan = null, imported = null, revision = 0;
  function render() {
    const c = copy[language()] || copy.en, host = document.getElementById('planningMount');
    host.replaceChildren();
    const form = el('form',null,'card');
    form.append(el('h2',c[0]),el('p',c[1]));
    const timeLabel=el('label',c[2]), time=el('input'); time.id='planBudget';time.type='number';time.min=1;time.max=240;time.required=true;time.value=budget;timeLabel.append(time);
    const taskLabel=el('label',c[3]), area=el('textarea');area.id='planTasks';area.required=true;area.value=tasks;taskLabel.append(area);
    const run=el('button',c[5],'primary');run.type='submit';
    const error=el('p',null,'notice error');error.hidden=true;error.setAttribute('role','alert');
    form.append(timeLabel,taskLabel,el('p',c[4],'hint'),run,error);host.append(form);
    const results=el('div',null,'two-grid');host.append(results);
    const actions=el('div',null,'card');host.append(actions);actions.hidden=!plan;
    function showResult(title,result) {
      const card=el('article',null,'card plan-result');card.append(el('h3',title),el('strong',result.points+' '+c[8]),el('p',result.minutes+' / '+plan.budget+' '+c[9]));
      const list=el('ul');result.names.forEach(name=>list.append(el('li',name)));card.append(result.names.length?list:el('p',c[10]));
      if(result.minutes>plan.budget)card.append(el('p',c[19],'notice error'));results.append(card);
    }
    if(plan){
      showResult(c[6],P.exact(plan));const simulated=P.runBrowserQaoa(plan.tasks,plan.budget);showResult(c[7],P.scorePlan(plan,simulated.bits));
      if(imported)showResult(c[13],imported);
      actions.append(el('p',c[16],'hint'));
      const exportButton=el('button',c[11],'secondary');exportButton.type='button';exportButton.onclick=()=>download(plan,'task-plan.json');
      const label=el('label',c[12]),file=el('input');file.id='qiskitResult';file.type='file';file.accept='.json,application/json';label.append(file);
      file.onchange=async()=>{const token=revision;try{const f=file.files[0];if(!f||f.size>100000)throw Error();const value=JSON.parse(await f.text());if(token!==revision)return;imported=P.importResult(value,plan);render();}catch{error.textContent=c[15];error.hidden=false;file.value='';}};
      const link=el('a',c[17]);link.href='https://github.com/SouBeatrizKaroline/NasaSpaceApp_HealthMonitoring/blob/main/docs/QUANTUM_QISKIT.md';
      actions.append(exportButton,label,link);
    }
    function invalidate(){budget=time.value;tasks=area.value;plan=null;imported=null;revision++;results.replaceChildren();actions.hidden=true;error.hidden=true;}
    time.oninput=invalidate;area.oninput=invalidate;
    form.onsubmit=event=>{event.preventDefault();try{plan=P.validatePlan({budget:Number(time.value),tasks:area.value.trim().split('\n').map(line=>{const parts=line.split(',');if(parts.length!==3)throw Error();return{name:parts[0].trim(),duration:Number(parts[1]),value:Number(parts[2])};})});budget=time.value;tasks=area.value;imported=null;revision++;render();}catch{error.textContent=c[14];error.hidden=false;}};
  }
  window.addEventListener('crew-language',render);render();
})();
