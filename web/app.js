"use strict";
const STORE_KEY = "crew-health-check.records.v2";
const strings = {
  en:{independent:"Independent educational prototype",language:"Language",eyebrow:"CREW WELLNESS / PRIVATE CHECK-IN",title:"A clear picture of how you are doing.",lead:"Record what changed, what you notice, and how it affects your mission tasks. You are in control of what you enter.",boundary:"This demo records your report. It does not diagnose, interpret measurements or media, or replace mission procedures.",contextTitle:"Mission context",editable:"EDITABLE",phase:"Mission phase",gravity:"Gravity environment",elapsed:"Time since transition (optional)",reasonTitle:"What brings you here?",selfReported:"SELF-REPORTED",reason:"Check-in reason",onset:"When did it begin?",description:"Describe what you noticed",descriptionHint:"What changed? Where do you notice it? What makes it better or worse?",pattern:"Pattern or frequency",associated:"Other changes noticed",functionTitle:"How are mission tasks affected?",functionTag:"FUNCTION & DAILY ACTIVITY",functionHelp:"Select any areas that feel different from your usual baseline.",mobility:"Mobility or balance",vision:"Vision-related tasks",exercise:"Exercise or strength",sleep:"Sleep or alertness",nutrition:"Eating or hydration routine",work:"Work or team tasks",sleepHours:"Sleep in last 24 hours (hours)",mood:"Mood (self-rating)",stress:"Stress (self-rating)",scaleHint:"Self-rating: 1 = low, 5 = high. This is not a clinical scale.",measureTitle:"Optional measurements",manualOnly:"ENTERED BY YOU",measureHelp:"Enter a reading only if you have it. Include its unit and source; leave unknown values blank.",heartRate:"Heart rate (bpm)",temperature:"Temperature (°C)",oxygen:"Oxygen saturation (%)",bp:"Blood pressure (mmHg)",measurementSource:"Measurement source / method",measurementTime:"Measurement time",evidenceTitle:"Optional supporting media",sessionOnly:"SESSION ONLY",mediaHelp:"Choose a photo, video, or audio clip to preview it for a human reviewer. The demo does not analyze or upload files.",chooseMedia:"Choose media",mediaTypes:"Image, video, or audio",reviewTitle:"What would you like to do?",routine:"Save this check-in",routineHelp:"Record only. This is not a health clearance.",requestReview:"Request professional review",reviewHelp:"Use your mission's approved contact pathway.",procedure:"I am following a mission procedure",procedureHelp:"Follow the approved procedure and contact pathway for your mission.",privateNote:"Mark this entry as needing a private follow-up",save:"Save check-in",export:"Export records (JSON)",clear:"Clear local records",recordsTitle:"Saved on this device",recordsHelp:"Text entries stay in this browser until exported or cleared. Media previews are not stored.",footer:"Independent educational prototype · No clinical interpretation · No agency endorsement",saved:"Check-in saved on this device.",exported:"JSON file exported.",empty:"No saved check-ins yet.",cleared:"Local records cleared.",confirmClear:"Clear all saved check-ins from this browser?",required:"Add a short description or select a check-in reason before saving.",entry:"Check-in",mediaSelected:"Selected media",private:"Private follow-up requested",noMedia:"No media is stored.",notStored:"Media is previewed only and is not stored with the record."},
  es:{independent:"Prototipo educativo independiente",language:"Idioma",eyebrow:"BIENESTAR DE LA TRIPULACIÓN / REGISTRO PRIVADO",title:"Una visión clara de cómo te encuentras.",lead:"Registra qué cambió, qué observas y cómo afecta tus tareas de misión. Tú controlas lo que compartes.",boundary:"Esta demostración registra tu reporte. No diagnostica, interpreta mediciones o archivos multimedia ni sustituye los procedimientos de misión.",contextTitle:"Contexto de misión",editable:"EDITABLE",phase:"Fase de misión",gravity:"Entorno gravitatorio",elapsed:"Tiempo desde la transición (opcional)",reasonTitle:"¿Qué te trae aquí?",selfReported:"AUTORREPORTADO",reason:"Motivo del registro",onset:"¿Cuándo comenzó?",description:"Describe lo que observaste",descriptionHint:"¿Qué cambió? ¿Dónde lo notas? ¿Qué lo mejora o empeora?",pattern:"Patrón o frecuencia",associated:"Otros cambios observados",functionTitle:"¿Cómo afectan las tareas de misión?",functionTag:"FUNCIÓN Y ACTIVIDAD DIARIA",functionHelp:"Selecciona las áreas que notes diferentes de tu estado habitual.",mobility:"Movilidad o equilibrio",vision:"Tareas relacionadas con la visión",exercise:"Ejercicio o fuerza",sleep:"Sueño o estado de alerta",nutrition:"Alimentación o rutina de hidratación",work:"Trabajo o tareas del equipo",sleepHours:"Sueño en las últimas 24 horas (horas)",mood:"Ánimo (valoración propia)",stress:"Estrés (valoración propia)",scaleHint:"Valoración propia: 1 = bajo, 5 = alto. No es una escala clínica.",measureTitle:"Mediciones opcionales",manualOnly:"INTRODUCIDAS POR TI",measureHelp:"Introduce una lectura solo si la tienes. Incluye unidad y fuente; deja en blanco los datos desconocidos.",heartRate:"Frecuencia cardíaca (lpm)",temperature:"Temperatura (°C)",oxygen:"Saturación de oxígeno (%)",bp:"Presión arterial (mmHg)",measurementSource:"Fuente / método de medición",measurementTime:"Hora de medición",evidenceTitle:"Archivos de apoyo opcionales",sessionOnly:"SOLO EN ESTA SESIÓN",mediaHelp:"Elige una foto, un video o un audio para mostrarlo a un profesional. La demostración no analiza ni carga archivos.",chooseMedia:"Elegir archivos",mediaTypes:"Imagen, video o audio",reviewTitle:"¿Qué te gustaría hacer?",routine:"Guardar este registro",routineHelp:"Solo se registra. No es una autorización médica.",requestReview:"Solicitar revisión profesional",reviewHelp:"Usa el canal aprobado de tu misión.",procedure:"Estoy siguiendo un procedimiento de misión",procedureHelp:"Sigue el procedimiento aprobado y el canal de contacto de tu misión.",privateNote:"Marcar para seguimiento privado",save:"Guardar registro",export:"Exportar registros (JSON)",clear:"Borrar registros locales",recordsTitle:"Guardado en este dispositivo",recordsHelp:"Los textos permanecen en este navegador hasta exportarlos o borrarlos. Las vistas previas no se guardan.",footer:"Prototipo educativo independiente · Sin interpretación clínica · Sin respaldo institucional",saved:"Registro guardado en este dispositivo.",exported:"Archivo JSON exportado.",empty:"Todavía no hay registros guardados.",cleared:"Se borraron los registros locales.",confirmClear:"¿Borrar todos los registros guardados en este navegador?",required:"Añade una breve descripción o selecciona un motivo antes de guardar.",entry:"Registro",mediaSelected:"Archivos seleccionados",private:"Seguimiento privado solicitado",noMedia:"No se guardan archivos multimedia.",notStored:"Los archivos solo se muestran como vista previa y no se guardan con el registro."},
  fr:{independent:"Prototype éducatif indépendant",language:"Langue",eyebrow:"BIEN-ÊTRE DE L'ÉQUIPAGE / SUIVI PRIVÉ",title:"Un aperçu clair de votre état.",lead:"Notez les changements observés et leurs effets sur vos tâches de mission. Vous choisissez les informations saisies.",boundary:"Cette démonstration enregistre votre déclaration. Elle ne pose pas de diagnostic, n'interprète ni mesures ni médias et ne remplace pas les procédures de mission.",contextTitle:"Contexte de mission",editable:"MODIFIABLE",phase:"Phase de mission",gravity:"Environnement gravitationnel",elapsed:"Temps depuis la transition (facultatif)",reasonTitle:"Quel est le motif de ce suivi ?",selfReported:"DÉCLARÉ PAR LA PERSONNE",reason:"Motif du suivi",onset:"Quand cela a-t-il commencé ?",description:"Décrivez ce que vous avez remarqué",descriptionHint:"Qu'est-ce qui a changé ? Où le remarquez-vous ? Qu'est-ce qui améliore ou aggrave la situation ?",pattern:"Évolution ou fréquence",associated:"Autres changements observés",functionTitle:"Quel est l'effet sur les tâches de mission ?",functionTag:"FONCTION ET ACTIVITÉS QUOTIDIENNES",functionHelp:"Sélectionnez les domaines différents de votre état habituel.",mobility:"Mobilité ou équilibre",vision:"Tâches liées à la vision",exercise:"Exercice ou force",sleep:"Sommeil ou vigilance",nutrition:"Alimentation ou hydratation",work:"Travail ou tâches d'équipe",sleepHours:"Sommeil au cours des dernières 24 h (heures)",mood:"Humeur (auto-évaluation)",stress:"Stress (auto-évaluation)",scaleHint:"Auto-évaluation : 1 = faible, 5 = élevé. Ce n'est pas une échelle clinique.",measureTitle:"Mesures facultatives",manualOnly:"SAISIES PAR VOUS",measureHelp:"Saisissez une mesure uniquement si vous l'avez. Indiquez l'unité et la source ; laissez vide si inconnue.",heartRate:"Fréquence cardiaque (bpm)",temperature:"Température (°C)",oxygen:"Saturation en oxygène (%)",bp:"Pression artérielle (mmHg)",measurementSource:"Source / méthode de mesure",measurementTime:"Heure de la mesure",evidenceTitle:"Médias d'appui facultatifs",sessionOnly:"SESSION UNIQUEMENT",mediaHelp:"Choisissez une photo, une vidéo ou un audio à présenter à un professionnel. La démonstration n'analyse et ne téléverse aucun fichier.",chooseMedia:"Choisir des fichiers",mediaTypes:"Image, vidéo ou audio",reviewTitle:"Que souhaitez-vous faire ?",routine:"Enregistrer ce suivi",routineHelp:"Enregistrement uniquement. Ce n'est pas une validation médicale.",requestReview:"Demander un examen professionnel",reviewHelp:"Utilisez le canal approuvé de votre mission.",procedure:"Je suis une procédure de mission",procedureHelp:"Suivez la procédure approuvée et le canal de contact de votre mission.",privateNote:"Signaler le besoin d'un suivi confidentiel",save:"Enregistrer",export:"Exporter les données (JSON)",clear:"Effacer les données locales",recordsTitle:"Enregistré sur cet appareil",recordsHelp:"Les textes restent dans ce navigateur jusqu'à leur exportation ou leur suppression. Les médias ne sont pas enregistrés.",footer:"Prototype éducatif indépendant · Aucune interprétation clinique · Aucun soutien institutionnel",saved:"Suivi enregistré sur cet appareil.",exported:"Fichier JSON exporté.",empty:"Aucun suivi enregistré pour le moment.",cleared:"Les données locales ont été effacées.",confirmClear:"Effacer tous les suivis enregistrés dans ce navigateur ?",required:"Ajoutez une courte description ou choisissez un motif avant l'enregistrement.",entry:"Suivi",mediaSelected:"Médias sélectionnés",private:"Suivi confidentiel demandé",noMedia:"Aucun média n'est enregistré.",notStored:"Les médias sont uniquement prévisualisés et ne sont pas enregistrés avec le suivi."},
  pt:{independent:"Protótipo educacional independente",language:"Idioma",eyebrow:"BEM-ESTAR DA TRIPULAÇÃO / REGISTRO PRIVADO",title:"Uma visão clara de como você está.",lead:"Registre o que mudou, o que percebeu e como isso afeta suas tarefas de missão. Você controla o que informa.",boundary:"Esta demonstração registra seu relato. Não diagnostica, interpreta medidas ou mídias e não substitui os procedimentos da missão.",contextTitle:"Contexto da missão",editable:"EDITÁVEL",phase:"Fase da missão",gravity:"Ambiente gravitacional",elapsed:"Tempo desde a transição (opcional)",reasonTitle:"O que trouxe você até aqui?",selfReported:"AUTORRELATADO",reason:"Motivo do registro",onset:"Quando começou?",description:"Descreva o que percebeu",descriptionHint:"O que mudou? Onde percebe? O que melhora ou piora?",pattern:"Padrão ou frequência",associated:"Outras mudanças percebidas",functionTitle:"Como as tarefas da missão foram afetadas?",functionTag:"FUNÇÃO E ATIVIDADES DIÁRIAS",functionHelp:"Selecione áreas diferentes do seu estado habitual.",mobility:"Mobilidade ou equilíbrio",vision:"Tarefas relacionadas à visão",exercise:"Exercício ou força",sleep:"Sono ou estado de alerta",nutrition:"Alimentação ou rotina de hidratação",work:"Trabalho ou tarefas da equipe",sleepHours:"Sono nas últimas 24 horas (horas)",mood:"Humor (autoavaliação)",stress:"Estresse (autoavaliação)",scaleHint:"Autoavaliação: 1 = baixo, 5 = alto. Não é uma escala clínica.",measureTitle:"Medidas opcionais",manualOnly:"INFORMADAS POR VOCÊ",measureHelp:"Informe uma leitura somente se a tiver. Inclua unidade e origem; deixe em branco se desconhecida.",heartRate:"Frequência cardíaca (bpm)",temperature:"Temperatura (°C)",oxygen:"Saturação de oxigênio (%)",bp:"Pressão arterial (mmHg)",measurementSource:"Origem / método da medida",measurementTime:"Horário da medida",evidenceTitle:"Mídia de apoio opcional",sessionOnly:"SOMENTE NESTA SESSÃO",mediaHelp:"Escolha foto, vídeo ou áudio para pré-visualizar para um profissional. A demonstração não analisa nem envia arquivos.",chooseMedia:"Escolher mídia",mediaTypes:"Imagem, vídeo ou áudio",reviewTitle:"O que você gostaria de fazer?",routine:"Salvar este registro",routineHelp:"Somente registro. Não é uma liberação de saúde.",requestReview:"Solicitar revisão profissional",reviewHelp:"Use o canal aprovado da sua missão.",procedure:"Estou seguindo um procedimento da missão",procedureHelp:"Siga o procedimento aprovado e o canal de contato da missão.",privateNote:"Marcar para acompanhamento privado",save:"Salvar registro",export:"Exportar registros (JSON)",clear:"Apagar registros locais",recordsTitle:"Salvo neste dispositivo",recordsHelp:"Os textos ficam neste navegador até exportar ou apagar. As prévias de mídia não são armazenadas.",footer:"Protótipo educacional independente · Sem interpretação clínica · Sem endosso institucional",saved:"Registro salvo neste dispositivo.",exported:"Arquivo JSON exportado.",empty:"Ainda não há registros salvos.",cleared:"Os registros locais foram apagados.",confirmClear:"Apagar todos os registros salvos neste navegador?",required:"Inclua uma breve descrição ou selecione um motivo antes de salvar.",entry:"Registro",mediaSelected:"Mídias selecionadas",private:"Acompanhamento privado solicitado",noMedia:"Nenhuma mídia é armazenada.",notStored:"A mídia é apenas pré-visualizada e não é armazenada com o registro."}
};
const lifecycleStrings = {"en":["Astronaut code","Mission code","Health monitoring stage","Pre-mission","During mission","Post-mission","Record your usual function, sleep, and any concerns before departure.","Record changes from your pre-mission baseline and their effect on mission tasks.","Record recovery, readaptation to gravity, and ongoing changes from baseline.","Use fictional codes. Codes organize records on this browser; anyone with browser access can view them.","Astronaut and mission","Filter by stage","All stages","Earlier records without codes","Select a history","View details","Earth gravity","Select a history with records to export.","Delete all records in the selected history, across every stage?","Export filtered records (JSON)","Delete selected history"],"pt":["Código do astronauta","Código da missão","Etapa do acompanhamento","Pré-missão","Durante a missão","Pós-missão","Registre sua função habitual, sono e preocupações antes da partida.","Registre mudanças desde o pré-voo e seus efeitos nas tarefas.","Registre a recuperação, a readaptação à gravidade e mudanças persistentes.","Use códigos fictícios. Qualquer pessoa com acesso ao navegador pode ver os registros.","Astronauta e missão","Filtrar por etapa","Todas as etapas","Registros anteriores sem códigos","Selecione um histórico","Ver detalhes","Gravidade terrestre","Selecione um histórico com registros para exportar.","Apagar todo o histórico selecionado, em todas as etapas?","Exportar registros filtrados (JSON)","Apagar histórico selecionado"],"es":["Código del astronauta","Código de misión","Etapa de seguimiento","Antes de la misión","Durante la misión","Después de la misión","Registra tu funcionamiento habitual, sueño y preocupaciones antes de partir.","Registra cambios desde el punto de partida y su efecto en tus tareas.","Registra la recuperación, la readaptación a la gravedad y los cambios persistentes.","Usa códigos ficticios. Cualquiera con acceso al navegador puede ver los registros.","Astronauta y misión","Filtrar por etapa","Todas las etapas","Registros anteriores sin códigos","Selecciona un historial","Ver detalles","Gravedad terrestre","Selecciona un historial con registros para exportar.","¿Borrar todo el historial seleccionado en todas las etapas?","Exportar registros filtrados (JSON)","Borrar historial seleccionado"],"fr":["Code de l’astronaute","Code de mission","Étape du suivi","Avant la mission","Pendant la mission","Après la mission","Consignez votre fonctionnement habituel, votre sommeil et vos préoccupations avant le départ.","Consignez les écarts par rapport à votre état initial et leurs effets sur vos tâches.","Consignez la récupération, la réadaptation à la gravité et les changements persistants.","Utilisez des codes fictifs. Toute personne ayant accès au navigateur peut voir les suivis.","Astronaute et mission","Filtrer par étape","Toutes les étapes","Anciens suivis sans codes","Sélectionnez un historique","Voir les détails","Gravité terrestre","Sélectionnez un historique contenant des suivis à exporter.","Supprimer tout l’historique sélectionné, toutes étapes confondues ?","Exporter les suivis filtrés (JSON)","Supprimer l’historique sélectionné"]};
const lifecycleKeys = ["crewCode","missionCode","stage","pre","during","post","preHelp","duringHelp","postHelp","codeHelp","historyScope","stageFilter","allStages","legacy","pickScope","details","earth","noExport","confirmScoped","export","clear"];
for (const [code, labels] of Object.entries(lifecycleStrings)) {
  lifecycleKeys.forEach((key, index) => { strings[code][key] = labels[index]; });
}
const gravityLabels = ["compare","micro","moon","mars","earthNote","microNote","moonNote","marsNote","otherNote","gravitySource","navCheckin"];
for (const [code, labels] of Object.entries({"en":["Compare gravity environments","Microgravity / free fall","Moon","Mars","Record your baseline before flight or note changes in balance and mobility after return.","Free fall reduces apparent weight. Note changes in orientation, movement or exercise.","Partial gravity changes how movement and equipment feel. Note gait, balance or task changes after landing.","Note changes in walking, balance and surface tasks after the transition to partial gravity.","Record when the gravity environment changed and which activities were affected.","NASA · Human body in space","Check-in"],"pt":["Compare os ambientes gravitacionais","Microgravidade / queda livre","Lua","Marte","Registre seu estado habitual antes do voo ou mudanças no equilíbrio e na mobilidade após o retorno.","A queda livre reduz o peso aparente. Registre mudanças de orientação, movimento ou exercício.","A gravidade parcial muda a sensação ao se mover e usar equipamentos. Registre mudanças na marcha, no equilíbrio ou nas tarefas.","Registre mudanças na caminhada, no equilíbrio e nas tarefas de superfície após a transição.","Registre quando a gravidade mudou e quais atividades foram afetadas.","NASA · O corpo humano no espaço","Registro"],"es":["Compara los entornos gravitatorios","Microgravedad / caída libre","Luna","Marte","Registra tu estado habitual antes del vuelo o cambios de equilibrio y movilidad después del regreso.","La caída libre reduce el peso aparente. Registra cambios de orientación, movimiento o ejercicio.","La gravedad parcial cambia cómo se perciben el movimiento y los equipos. Registra cambios de marcha, equilibrio o tareas.","Registra cambios al caminar, mantener el equilibrio o trabajar en superficie tras la transición.","Registra cuándo cambió la gravedad y qué actividades se vieron afectadas.","NASA · El cuerpo humano en el espacio","Registro"],"fr":["Comparez les environnements gravitationnels","Microgravité / chute libre","Lune","Mars","Consignez votre état habituel avant le vol ou les changements d’équilibre et de mobilité au retour.","La chute libre réduit le poids apparent. Notez les changements d’orientation, de mouvement ou d’exercice.","La gravité partielle modifie la perception des mouvements et des équipements. Notez les changements de marche, d’équilibre ou d’activité.","Notez les changements de marche, d’équilibre et de tâches en surface après la transition.","Notez quand la gravité a changé et quelles activités ont été touchées.","NASA · Le corps humain dans l’espace","Suivi"]})) {
  gravityLabels.forEach((key, index) => { strings[code][key] = labels[index]; });
}
const profileLabels = ["profileTitle","profilePrivacy","openProfile","signedIn","switchProfile","confirmSwitch","profileError"];
for (const [code, labels] of Object.entries({"en":["Astronaut profile","Use a fictional code. This profile stays in this browser and the code is not a password.","Open or create profile","Active profile","Switch profile","Switch profiles and discard the current unsaved form?","Profile could not be saved in this browser."],"pt":["Perfil do astronauta","Use um código fictício. O perfil fica neste navegador e o código não é uma senha.","Abrir ou criar perfil","Perfil ativo","Trocar de perfil","Trocar de perfil e descartar o formulário atual sem salvar?","Não foi possível salvar o perfil neste navegador."],"es":["Perfil del astronauta","Usa un código ficticio. El perfil se queda en este navegador y el código no es una contraseña.","Abrir o crear perfil","Perfil activo","Cambiar de perfil","¿Cambiar de perfil y descartar el formulario actual sin guardar?","No se pudo guardar el perfil en este navegador."],"fr":["Profil de l’astronaute","Utilisez un code fictif. Le profil reste dans ce navigateur et le code ne sert pas de mot de passe.","Ouvrir ou créer un profil","Profil actif","Changer de profil","Changer de profil et abandonner le formulaire actuel sans l’enregistrer ?","Impossible d’enregistrer le profil dans ce navigateur."]})) {
  profileLabels.forEach((key, index) => { strings[code][key] = labels[index]; });
}
const PROFILE_KEY = "crew-health-check.profiles.v1";
let activeCode = "";
let profileDirty = false;
for (const [code, labels] of Object.entries({"en":["Mission comparison","Latest check-in per stage. The history filter does not change this comparison.","No preflight baseline recorded.","No check-in recorded for this stage.","Preview mission report","The report stays on this device until you share it.","Download report (.txt)","Save preference for professional follow-up","Your preference is saved locally. Share the report through your mission’s approved contact pathway."],"pt":["Comparação da missão","Último registro de cada etapa. O filtro do histórico não altera esta comparação.","Nenhum registro de referência pré-voo.","Nenhum registro nesta etapa.","Ver relatório da missão","O relatório fica neste dispositivo até você compartilhá-lo.","Baixar relatório (.txt)","Salvar preferência por acompanhamento profissional","A preferência fica salva localmente. Compartilhe o relatório pelo canal aprovado da missão."],"es":["Comparación de la misión","Último registro de cada etapa. El filtro del historial no cambia esta comparación.","No hay registro de referencia previo al vuelo.","No hay registros en esta etapa.","Ver informe de misión","El informe queda en este dispositivo hasta que lo compartas.","Descargar informe (.txt)","Guardar preferencia de seguimiento profesional","La preferencia se guarda localmente. Comparte el informe por el canal aprobado de tu misión."],"fr":["Comparaison de mission","Dernier suivi de chaque étape. Le filtre de l’historique ne change pas cette comparaison.","Aucun suivi de référence avant le vol.","Aucun suivi pour cette étape.","Voir le rapport de mission","Le rapport reste sur cet appareil jusqu’à son partage.","Télécharger le rapport (.txt)","Enregistrer une préférence de suivi professionnel","La préférence reste sur cet appareil. Partagez le rapport via le canal approuvé de la mission."]})) {
  ["comparisonTitle","comparisonHelp","missingPre","missingStage","reportTitle","reportLocal","saveReport","requestReview","reviewHelp"]
    .forEach((key, index) => { strings[code][key] = labels[index]; });
}
const evidenceKeys = ["whyGravity","gravityEvidence","gravityResearch","sleepChange","sleepUnavailable","descriptiveOnly"];
for (const [code, labels] of Object.entries({"en":["Why record gravity transitions?","NASA describes changes in orientation, coordination, balance, and movement during gravity transitions. Record the environment and time since transition alongside changes in daily tasks so a reviewer can see the context.","NASA Human Research Program · Gravity Fields","Sleep change from latest preflight check-in","Sleep comparison unavailable","Reported differences are descriptive."],"pt":["Por que registrar transições de gravidade?","A NASA descreve mudanças na orientação, coordenação, equilíbrio e movimento durante transições de gravidade. Registre o ambiente e o tempo desde a transição junto das mudanças nas tarefas para contextualizar a revisão.","Programa de Pesquisa Humana da NASA · Campos gravitacionais","Mudança no sono desde o último registro pré-voo","Comparação de sono indisponível","As diferenças relatadas são descritivas."],"es":["¿Por qué registrar las transiciones de gravedad?","La NASA describe cambios en la orientación, la coordinación, el equilibrio y el movimiento durante las transiciones de gravedad. Registra el entorno y el tiempo desde la transición junto con los cambios en tus tareas para contextualizar la revisión.","Programa de Investigación Humana de la NASA · Campos gravitatorios","Cambio en el sueño desde el último registro previo al vuelo","Comparación del sueño no disponible","Las diferencias declaradas son descriptivas."],"fr":["Pourquoi consigner les transitions de gravité ?","La NASA décrit des changements d’orientation, de coordination, d’équilibre et de mouvement lors des transitions de gravité. Consignez l’environnement et le temps depuis la transition avec les changements dans vos activités pour éclairer la revue.","Programme de recherche humaine de la NASA · Champs gravitationnels","Évolution du sommeil depuis le dernier suivi avant le vol","Comparaison du sommeil indisponible","Les écarts déclarés sont descriptifs."]})) {
  evidenceKeys.forEach((key, index) => { strings[code][key] = labels[index]; });
}
let lang = localStorage.getItem("crew-health-check.language") || "en";
let previewUrls = [];
const $ = (id) => document.getElementById(id);
function t(key){return (strings[lang]||strings.en)[key]||strings.en[key]||key}
function applyLanguage(code){
  lang = strings[code] ? code : "en";
  document.documentElement.lang=lang;
  localStorage.setItem("crew-health-check.language",lang);
  $("language").value=lang;
  $("exampleMission").textContent = {en:"Open sample mission",pt:"Abrir missão de exemplo",es:"Abrir misión de ejemplo",fr:"Ouvrir la mission de démonstration"}[lang];
  document.querySelectorAll("[data-i18n]").forEach(el=>{const key=el.dataset.i18n;el.textContent=t(key)});
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{el.placeholder=t(el.dataset.i18nPlaceholder)});
  updateStage(false);
  renderRecords();
}
function readRecords(){try{return JSON.parse(localStorage.getItem(STORE_KEY)||"[]")}catch{return []}}
function writeRecords(rows){localStorage.setItem(STORE_KEY,JSON.stringify(rows))}
function showToast(message){const el=$("toast");el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2600)}
function getValue(id){return $(id).value.trim()}
function collect(){
 const measurements={};
 [["heartRate","bpm"],["temperature","°C"],["oxygen","%"],["bp","mmHg"]].forEach(([id,unit])=>{const v=getValue(id);if(v!=="")measurements[id]={value:v,unit}});
 const selected = document.querySelector('input[name="review"]:checked');
 return {astronautCode:activeCode,missionCode:getValue("missionCode").toUpperCase(),stage:$("stage").value,id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),recordedAt:new Date().toISOString(),mission:{phase:$("phase").value,gravity:$("gravity").value,timeSinceTransition:getValue("elapsed")||null},reason:$("reason").value,onset:getValue("onset")||null,description:getValue("description"),pattern:getValue("pattern")||null,associatedChanges:getValue("associated")||null,functionChanges:[...document.querySelectorAll('input[name="function"]:checked')].map(x=>x.value),wellbeing:{sleepHours:getValue("sleepHours")||null,mood:getValue("mood")||null,stress:getValue("stress")||null},measurements,measurementSource:getValue("measurementSource")||null,measurementTime:getValue("measurementTime")||null,reviewPreference:selected?selected.value:"Routine entry",privateFollowUp:$("privateNote").checked,mediaStored:false};
}
const stageKeys = {pre:"pre", during:"during", post:"post"};
const gravityNotes = {
  "Earth gravity": "earthNote",
  "Microgravity": "microNote",
  "Lunar gravity": "moonNote",
  "Martian gravity": "marsNote"
};

function updateGravity() {
  const selected = $("gravity").value;
  document.querySelectorAll("[data-gravity]").forEach(card => {
    card.setAttribute("aria-pressed", String(card.dataset.gravity === selected));
  });
  $("gravityNote").textContent = t(gravityNotes[selected] || "otherNote");
}

function updateStage(resetContext) {
  const stage = $("stage").value;
  $("stageHelp").textContent = t(stage + "Help");
  const phases = [...$("phase").options];
  phases.forEach((option,index) => {
    option.hidden = option.disabled = stage === "during" ? index < 2 : index !== (stage === "pre" ? 0 : 1);
  });
  if (resetContext || $("phase").selectedOptions[0]?.disabled) {
    $("phase").value = phases.find(option => !option.disabled).value;
  }
  if (resetContext) $("gravity").value = stage === "during" ? "Microgravity" : "Earth gravity";
  updateGravity();
}
function scopeOf(row) {
  return row.astronautCode && row.missionCode ? row.astronautCode + " / " + row.missionCode : "legacy";
}
function filteredRecords() {
  const scope = $("historyScope").value;
  const stage = $("stageFilter").value;
  return readRecords().filter(row => activeCode && row.astronautCode === activeCode && scopeOf(row) === scope && (!stage || row.stage === stage));
}
function updateHistoryScopes() {
  const selector = $("historyScope");
  const selected = selector.value;
  const rows = readRecords().filter(row => activeCode && row.astronautCode === activeCode);
  const scopes = [...new Set(rows.map(scopeOf))].sort();
  selector.replaceChildren(new Option(t("pickScope"), ""));
  scopes.forEach(scope => selector.add(new Option(scope === "legacy" ? t("legacy") : scope, scope)));
  selector.value = scopes.includes(selected) ? selected : "";
}
function reportedSleepHours(row) {
  const value = row?.wellbeing?.sleepHours;
  if ((typeof value !== "string" && typeof value !== "number") || String(value).trim() === "") return null;
  const hours = Number(value);
  return Number.isFinite(hours) && hours >= 0 && hours <= 24 ? hours : null;
}

function renderMissionComparison() {
  const scope = $("historyScope").value;
  const section = $("missionComparison");
  const cards = $("stageCards");
  const report = $("reportText");
  if (section.dataset.scope !== scope) $("missionReport").open = false;
  section.dataset.scope = scope;
  section.hidden = !activeCode || !scope || scope === "legacy";
  cards.replaceChildren();
  report.textContent = "";
  if (section.hidden) return;

  const rows = readRecords()
    .filter(row => row.astronautCode === activeCode && scopeOf(row) === scope)
    .sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt));
  const lines = [t("comparisonTitle"), scope, t("comparisonHelp"), t("descriptiveOnly")];
  const baselineSleep = reportedSleepHours(rows.find(row => row.stage === "pre"));
  const hourDifference = new Intl.NumberFormat(lang, {
    style: "unit", unit: "hour", unitDisplay: "short", signDisplay: "exceptZero", maximumFractionDigits: 2
  });
  for (const stage of ["pre", "during", "post"]) {
    const card = document.createElement("article");
    card.className = "record-card comparison-card";
    const heading = document.createElement("h4");
    heading.textContent = t(stage);
    card.append(heading);
    lines.push("", heading.textContent);
    const row = rows.find(record => record.stage === stage);
    if (!row) {
      const missing = document.createElement("p");
      missing.textContent = t(stage === "pre" ? "missingPre" : "missingStage");
      lines.push(missing.textContent);
      card.append(missing);
      cards.append(card);
      continue;
    }

    const time = document.createElement("time");
    time.dateTime = row.recordedAt;
    time.textContent = new Date(row.recordedAt).toLocaleString(lang);
    card.append(time);
    lines.push(time.textContent);
    const fields = [
      ["gravity", row.mission?.gravity],
      ["elapsed", row.mission?.timeSinceTransition],
      ["sleepHours", row.wellbeing?.sleepHours],
      ["functionTitle", (row.functionChanges || []).join(", ")],
      ...Object.entries(row.measurements || {}).map(([key, reading]) => [key, reading.value + " " + reading.unit]),
      ["measurementSource", row.measurementSource],
      ["description", row.description]
    ];
    if (stage !== "pre") {
      const currentSleep = reportedSleepHours(row);
      fields.splice(3, 0, ["sleepChange", baselineSleep === null || currentSleep === null
        ? t("sleepUnavailable")
        : hourDifference.format(currentSleep - baselineSleep)]);
    }
    const details = document.createElement("dl");
    for (const [key, value] of fields) {
      if (value == null || value === "") continue;
      const term = document.createElement("dt");
      const detail = document.createElement("dd");
      term.textContent = t(key);
      detail.textContent = value;
      details.append(term, detail);
      lines.push(term.textContent + ": " + value);
    }
    for (const [key, value] of [
      ["onset", row.onset], ["pattern", row.pattern], ["associated", row.associatedChanges],
      ["measurementTime", row.measurementTime], ["mood", row.wellbeing?.mood], ["stress", row.wellbeing?.stress]
    ]) {
      if (value != null && value !== "") lines.push(t(key) + ": " + value);
    }
    if (row.reviewPreference === "Review requested") lines.push(t("requestReview"));
    card.append(details);
    cards.append(card);
  }
  report.textContent = lines.join("\n");
}

$("saveReport").addEventListener("click", () => {
  const report = $("reportText").textContent;
  if (!report) return;
  const url = URL.createObjectURL(new Blob([report], {type: "text/plain;charset=utf-8"}));
  const link = document.createElement("a");
  link.href = url;
  link.download = "crew-mission-report.txt";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

function renderRecords(){
 const host=$("recordList");if(!host)return;host.replaceChildren();
 updateHistoryScopes();
 renderMissionComparison();
 const rows=filteredRecords();
 $("export").disabled = rows.length === 0;
 $("clear").disabled = !$("historyScope").value;
 $("recordCount").textContent=String(rows.length);
 if(!rows.length){const p=document.createElement("p");p.className="subtext";p.textContent=t("empty");host.append(p);return}
 rows.slice().reverse().forEach(row=>{
  const card=document.createElement("article");card.className="record-card";
  const header=document.createElement("header"),date=document.createElement("span"),kind=document.createElement("strong");
  date.textContent=new Date(row.recordedAt).toLocaleString(lang);kind.textContent=row.sample ? {en:"Fictional sample",pt:"Exemplo fictício",es:"Ejemplo ficticio",fr:"Exemple fictif"}[lang] : row.reviewPreference;header.append(date,kind);
  const ctx=document.createElement("p");ctx.textContent=[row.stage ? t(stageKeys[row.stage]) : null,row.mission?.phase,row.mission?.gravity,row.reason].filter(Boolean).join(" · ");
  const body=document.createElement("p");body.textContent=row.description||"";
  const foot=document.createElement("small");foot.textContent=row.privateFollowUp?t("private"):"";
  const disclosure = document.createElement("details");
  const summary = document.createElement("summary");
  summary.textContent = t("details");
  const report = document.createElement("dl");
  const fields = {
    crewCode: row.astronautCode, missionCode: row.missionCode, onset: row.onset,
    pattern: row.pattern, associated: row.associatedChanges, elapsed: row.mission?.timeSinceTransition,
    functionTitle: (row.functionChanges || []).join(", "), sleepHours: row.wellbeing?.sleepHours,
    mood: row.wellbeing?.mood, stress: row.wellbeing?.stress,
    measurementSource: row.measurementSource, measurementTime: row.measurementTime
  };
  for (const [key, reading] of Object.entries(row.measurements || {})) {
    fields[key] = reading.value + " " + reading.unit;
  }
  for (const [key, value] of Object.entries(fields)) {
    if (value == null || value === "") continue;
    const label = document.createElement("dt");
    const detail = document.createElement("dd");
    label.textContent = t(key);
    detail.textContent = value;
    report.append(label, detail);
  }
  disclosure.append(summary, report);
  card.append(header,ctx,body,foot,disclosure);host.append(card);
 });
}
function saveProfile(code, lastMission) {
  const profiles = JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}");
  const profile = Object.hasOwn(profiles, code) ? profiles[code] : {};
  if (lastMission !== undefined) profile.lastMission = lastMission;
  profiles[code] = profile;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profiles));
  return profile;
}

function showProfile() {
  const opened = Boolean(activeCode);
  $("profileForm").hidden = opened;
  $("exampleMission").hidden = opened;
  $("activeProfile").hidden = !opened;
  $("profileWorkspace").hidden = !opened;
  $("profileQuickNav").hidden = !opened;
  $("profileBadge").textContent = activeCode;
  $("historyScope").value = "";
  $("stageFilter").value = "";
  renderRecords();
}

$("profileWorkspace").addEventListener("input", event => {
  if (event.target.closest("#checkin, #mission")) profileDirty = true;
});
$("profileForm").addEventListener("submit", event => {
  event.preventDefault();
  const code = getValue("profileCode").toUpperCase();
  try {
    const profile = saveProfile(code);
    activeCode = code;
    $("missionCode").value = profile.lastMission || "";
    profileDirty = false;
    showProfile();
    $("missionCode").focus();
  } catch {
    showToast(t("profileError"));
  }
});
$("exampleMission").addEventListener("click", () => {
  const code = "DEMO-CREW";
  const missionCode = "LUNAR-DEMO";
  const snapshots = [
    ["pre", "Pre-mission preparation", "Earth gravity", "Baseline: routine walking and exercise felt normal.", "8"],
    ["during", "Surface operations", "Lunar gravity", "Walking and turning felt different six hours after landing.", "6"],
    ["post", "Post-mission recovery", "Earth gravity", "Walking felt steadier one day after returning to Earth.", "7"]
  ];
  try {
    const rows = readRecords();
    const existing = new Set(rows.map(row => row.id));
    const examples = snapshots.map(([stage, phase, gravity, description, sleepHours], index) => ({
      id: "lunar-demo-" + stage,
      sample: true,
      astronautCode: code,
      missionCode,
      stage,
      recordedAt: new Date(Date.UTC(2026, 0, 1 + index * 7, 12)).toISOString(),
      mission: {phase, gravity},
      reason: "Routine check-in",
      description,
      wellbeing: {sleepHours},
      functionChanges: stage === "during" ? ["Mobility or balance"] : [],
      measurements: {},
      reviewPreference: "Routine entry",
      mediaStored: false
    }));
    writeRecords([...rows, ...examples.filter(row => !existing.has(row.id))]);
    saveProfile(code, missionCode);
    activeCode = code;
    $("missionCode").value = missionCode;
    showProfile();
    $("historyScope").value = code + " / " + missionCode;
    renderRecords();
    $("historyScope").focus();
  } catch {
    showToast(t("profileError"));
  }
});
$("switchProfile").addEventListener("click", () => {
  if (profileDirty && !confirm(t("confirmSwitch"))) return;
  $("checkin").reset();
  $("media").dispatchEvent(new Event("change"));
  $("missionCode").value = "";
  $("elapsed").value = "";
  $("stage").value = "pre";
  updateStage(true);
  activeCode = "";
  profileDirty = false;
  showProfile();
  $("profileCode").value = "";
  $("profileCode").focus();
});
$("gravity").addEventListener("change", updateGravity);
document.querySelectorAll("[data-gravity]").forEach(card => {
  card.addEventListener("click", () => {
    $("gravity").value = card.dataset.gravity;
    updateGravity();
  });
});
$("stage").addEventListener("change", () => updateStage(true));
$("historyScope").addEventListener("change", renderRecords);
$("stageFilter").addEventListener("change", renderRecords);
$("language").addEventListener("change",e=>applyLanguage(e.target.value));
$("checkin").addEventListener("submit",e=>{e.preventDefault();if(!activeCode)return;const record=collect();if(!record.description && record.reason==="Routine check-in" && !Object.keys(record.measurements).length && !record.functionChanges.length && !Object.values(record.wellbeing).some(Boolean)){showToast(t("required"));$("description").focus();return}try{const rows=readRecords();rows.push(record);writeRecords(rows);profileDirty=false;
 try { saveProfile(activeCode, record.missionCode); } catch { /* The check-in has already been saved. */ }
 updateHistoryScopes();$("historyScope").value=scopeOf(record);$("stageFilter").value="";renderRecords();showToast(t("saved"))}catch{showToast("Storage is unavailable. Export or clear browser data.")}});
$("export").addEventListener("click",()=>{const records=filteredRecords();if(!records.length){showToast(t("noExport"));return}const blob=new Blob([JSON.stringify({format:"crew-health-check-demo-v3",exportedAt:new Date().toISOString(),records},null,2)],{type:"application/json"});const link=document.createElement("a");link.href=URL.createObjectURL(blob);link.download="crew-health-check-records.json";link.click();URL.revokeObjectURL(link.href);showToast(t("exported"))});
$("clear").addEventListener("click",()=>{const scope=$("historyScope").value;if(!activeCode||!scope||!confirm(t("confirmScoped")))return;writeRecords(readRecords().filter(row=>scopeOf(row)!==scope));renderRecords();showToast(t("cleared"))});
$("media").addEventListener("change",e=>{previewUrls.forEach(URL.revokeObjectURL);previewUrls=[];const host=$("mediaPreview");host.replaceChildren();[...e.target.files].forEach(file=>{const url=URL.createObjectURL(file);previewUrls.push(url);let el;if(file.type.startsWith("image/")){el=document.createElement("img");el.alt=file.name;el.src=url}else if(file.type.startsWith("video/")){el=document.createElement("video");el.controls=true;el.src=url}else if(file.type.startsWith("audio/")){el=document.createElement("audio");el.controls=true;el.src=url}else return;host.append(el)});});
window.addEventListener("pagehide",()=>previewUrls.forEach(URL.revokeObjectURL));
applyLanguage(lang);renderRecords();