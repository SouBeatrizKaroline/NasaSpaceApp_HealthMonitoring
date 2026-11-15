"use strict";
{
  const rows = [
  [
    "today",
    "Today",
    "Hoje",
    "Hoy",
    "Aujourd’hui"
  ],
  [
    "checkin",
    "Check-in",
    "Check-in",
    "Registro",
    "Suivi"
  ],
  [
    "history",
    "Mission History",
    "Histórico da missão",
    "Historial de misión",
    "Historique de mission"
  ],
  [
    "ground",
    "Ground Review",
    "Revisão em solo",
    "Revisión en tierra",
    "Revue au sol"
  ],
  [
    "planning",
    "Task Planning",
    "Planejamento de tarefas",
    "Planificación de tareas",
    "Planification des tâches"
  ],
  [
    "start",
    "Start check-in",
    "Iniciar check-in",
    "Iniciar registro",
    "Commencer le suivi"
  ],
  [
    "continue",
    "Continue check-in",
    "Continuar check-in",
    "Continuar registro",
    "Continuer le suivi"
  ],
  [
    "welcome",
    "Your health. Every mission stage.",
    "Sua saúde. Em cada etapa da missão.",
    "Tu salud. En cada etapa de la misión.",
    "Votre santé. À chaque étape de mission."
  ],
  [
    "intro",
    "A personal workspace to record changes, follow your baseline, and prepare a report for review.",
    "Um espaço para registrar mudanças, acompanhar sua referência e preparar um relatório para revisão.",
    "Un espacio para registrar cambios, seguir tu referencia y preparar un informe para revisión.",
    "Un espace pour consigner les changements, suivre votre référence et préparer un rapport."
  ],
  [
    "profileLimit",
    "Crew ID opens a local profile in this browser. Anyone with access to this device can open it. Use test observations for this demonstration.",
    "O Crew ID abre um perfil local neste navegador. Quem tem acesso ao dispositivo pode abri-lo. Use observações de teste nesta demonstração.",
    "El Crew ID abre un perfil local en este navegador. Cualquier persona con acceso al dispositivo puede abrirlo. Usa observaciones de prueba.",
    "Le Crew ID ouvre un profil local dans ce navigateur. Toute personne ayant accès à l’appareil peut l’ouvrir. Utilisez des observations de test."
  ],
  [
    "missionActive",
    "Active mission",
    "Missão ativa",
    "Misión activa",
    "Mission active"
  ],
  [
    "openMission",
    "Open mission",
    "Abrir missão",
    "Abrir misión",
    "Ouvrir la mission"
  ],
  [
    "day",
    "Mission day (optional)",
    "Dia da missão (opcional)",
    "Día de misión (opcional)",
    "Jour de mission (facultatif)"
  ],
  [
    "unknown",
    "Not recorded",
    "Não registrado",
    "Sin registrar",
    "Non renseigné"
  ],
  [
    "lastEntry",
    "Last saved check-in",
    "Último check-in salvo",
    "Último registro guardado",
    "Dernier suivi enregistré"
  ],
  [
    "emptyMission",
    "Your mission history starts with your first check-in.",
    "O histórico começa com seu primeiro check-in.",
    "El historial comienza con tu primer registro.",
    "Votre historique commence avec votre premier suivi."
  ],
  [
    "noMission",
    "Open a mission to begin.",
    "Abra uma missão para começar.",
    "Abre una misión para empezar.",
    "Ouvrez une mission pour commencer."
  ],
  [
    "savedOnboard",
    "Saved onboard",
    "Salvo a bordo",
    "Guardado a bordo",
    "Enregistré à bord"
  ],
  [
    "readyExport",
    "Ready to export",
    "Pronto para exportar",
    "Listo para exportar",
    "Prêt à exporter"
  ],
  [
    "reportExported",
    "Report exported",
    "Relatório exportado",
    "Informe exportado",
    "Rapport exporté"
  ],
  [
    "draftSaved",
    "Draft saved on this device",
    "Rascunho salvo neste dispositivo",
    "Borrador guardado en este dispositivo",
    "Brouillon enregistré sur cet appareil"
  ],
  [
    "draftError",
    "Draft could not be saved. Keep this page open and try again.",
    "Não foi possível salvar o rascunho. Mantenha a página aberta e tente novamente.",
    "No se pudo guardar el borrador. Mantén la página abierta e inténtalo de nuevo.",
    "Impossible d’enregistrer le brouillon. Gardez cette page ouverte et réessayez."
  ],
  [
    "storageError",
    "Browser storage is unavailable or unreadable. Existing data has been preserved. Check browser permissions before continuing.",
    "O armazenamento está indisponível ou ilegível. Os dados existentes foram preservados. Confira as permissões do navegador.",
    "El almacenamiento no está disponible o no se puede leer. Los datos existentes se conservaron. Revisa los permisos del navegador.",
    "Le stockage est indisponible ou illisible. Les données existantes sont préservées. Vérifiez les autorisations du navigateur."
  ],
  [
    "step",
    "Step",
    "Etapa",
    "Paso",
    "Étape"
  ],
  [
    "context",
    "Mission context",
    "Contexto da missão",
    "Contexto de misión",
    "Contexte de mission"
  ],
  [
    "observations",
    "Observations",
    "Observações",
    "Observaciones",
    "Observations"
  ],
  [
    "measurements",
    "Measurements",
    "Medições",
    "Mediciones",
    "Mesures"
  ],
  [
    "review",
    "Review & save",
    "Revisar e salvar",
    "Revisar y guardar",
    "Vérifier et enregistrer"
  ],
  [
    "next",
    "Continue",
    "Continuar",
    "Continuar",
    "Continuer"
  ],
  [
    "back",
    "Back",
    "Voltar",
    "Volver",
    "Retour"
  ],
  [
    "edit",
    "Edit responses",
    "Editar respostas",
    "Editar respuestas",
    "Modifier les réponses"
  ],
  [
    "optionalHelp",
    "All measurements are optional. Empty fields remain unrecorded. Record the device or method used.",
    "Todas as medições são opcionais. Campos vazios ficam sem registro. Informe o dispositivo ou método.",
    "Todas las mediciones son opcionales. Los campos vacíos quedan sin registrar. Indica el dispositivo o método.",
    "Toutes les mesures sont facultatives. Les champs vides restent non renseignés. Indiquez l’appareil ou la méthode."
  ],
  [
    "observationNeeded",
    "Add an observation, a functional change, or a measurement before saving.",
    "Adicione uma observação, uma mudança funcional ou uma medição antes de salvar.",
    "Añade una observación, un cambio funcional o una medición antes de guardar.",
    "Ajoutez une observation, un changement fonctionnel ou une mesure avant d’enregistrer."
  ],
  [
    "baseline",
    "Preflight reference",
    "Referência pré-voo",
    "Referencia previa al vuelo",
    "Référence avant le vol"
  ],
  [
    "difference",
    "Change from preflight",
    "Mudança desde o pré-voo",
    "Cambio desde el pre-vuelo",
    "Écart depuis l’avant-vol"
  ],
  [
    "comparisonHint",
    "Latest entry in each stage. Differences describe the recorded values and do not establish a cause.",
    "Último registro de cada etapa. As diferenças descrevem os valores e não estabelecem uma causa.",
    "Último registro de cada etapa. Las diferencias describen los valores y no establecen una causa.",
    "Dernier suivi de chaque étape. Les écarts décrivent les valeurs et n’établissent aucune cause."
  ],
  [
    "allEntries",
    "All mission entries",
    "Todos os registros da missão",
    "Todos los registros de misión",
    "Tous les suivis de mission"
  ],
  [
    "exportReport",
    "Export for ground review",
    "Exportar para revisão em solo",
    "Exportar para revisión en tierra",
    "Exporter pour revue au sol"
  ],
  [
    "exportHelp",
    "The downloaded JSON opens in Ground Review. Share it using your approved contact pathway.",
    "O JSON baixado abre na Revisão em solo. Compartilhe pelo canal aprovado.",
    "El JSON descargado se abre en Revisión en tierra. Compártelo por el canal aprobado.",
    "Le JSON téléchargé s’ouvre dans Revue au sol. Partagez-le par le canal approuvé."
  ],
  [
    "openSaved",
    "View saved record",
    "Ver registro salvo",
    "Ver registro guardado",
    "Voir le suivi enregistré"
  ],
  [
    "groundIntro",
    "Open a report exported by Crew Health Check to review its observations, measurements, sources, and missing stages.",
    "Abra um relatório exportado para revisar observações, medições, fontes e etapas ausentes.",
    "Abre un informe exportado para revisar observaciones, mediciones, fuentes y etapas ausentes.",
    "Ouvrez un rapport exporté pour examiner les observations, mesures, sources et étapes absentes."
  ],
  [
    "chooseReport",
    "Choose report (.json)",
    "Escolher relatório (.json)",
    "Elegir informe (.json)",
    "Choisir un rapport (.json)"
  ],
  [
    "importEmpty",
    "Choose a report to begin the review.",
    "Escolha um relatório para iniciar a revisão.",
    "Elige un informe para comenzar la revisión.",
    "Choisissez un rapport pour commencer la revue."
  ],
  [
    "importError",
    "This file could not be opened. Choose an unmodified Crew Health Check report (JSON, up to 2 MB, one astronaut and one mission). You can try another file.",
    "Não foi possível abrir o arquivo. Escolha um relatório original do Crew Health Check (JSON, até 2 MB, um astronauta e uma missão). Você pode tentar outro arquivo.",
    "No se pudo abrir el archivo. Elige un informe original de Crew Health Check (JSON, hasta 2 MB, un astronauta y una misión). Puedes intentar otro archivo.",
    "Impossible d’ouvrir ce fichier. Choisissez un rapport Crew Health Check non modifié (JSON, 2 Mo maximum, un astronaute et une mission). Vous pouvez essayer un autre fichier."
  ],
  [
    "imported",
    "Report opened locally",
    "Relatório aberto localmente",
    "Informe abierto localmente",
    "Rapport ouvert localement"
  ],
  [
    "clearReview",
    "Close report",
    "Fechar relatório",
    "Cerrar informe",
    "Fermer le rapport"
  ],
  [
    "groundLocal",
    "Imported reports stay in this review session. They are not added to onboard profiles.",
    "Relatórios importados ficam nesta sessão de revisão e não são adicionados aos perfis.",
    "Los informes importados permanecen en esta sesión y no se añaden a los perfiles.",
    "Les rapports importés restent dans cette session et ne sont pas ajoutés aux profils."
  ],
  [
    "offline",
    "Offline · local workspace available",
    "Sem conexão · espaço local disponível",
    "Sin conexión · espacio local disponible",
    "Hors ligne · espace local disponible"
  ],
  [
    "online",
    "Connected",
    "Conectado",
    "Conectado",
    "Connecté"
  ],
  [
    "cacheReady",
    "Offline files ready",
    "Arquivos offline prontos",
    "Archivos sin conexión listos",
    "Fichiers hors ligne prêts"
  ],
  [
    "cachePending",
    "Preparing offline files",
    "Preparando arquivos offline",
    "Preparando archivos sin conexión",
    "Préparation des fichiers hors ligne"
  ],
  [
    "cacheFailed",
    "Offline installation unavailable. Keep this page open or run the downloaded files locally.",
    "Instalação offline indisponível. Mantenha a página aberta ou execute os arquivos baixados localmente.",
    "Instalación sin conexión no disponible. Mantén la página abierta o abre los archivos descargados localmente.",
    "Installation hors ligne indisponible. Gardez la page ouverte ou utilisez les fichiers téléchargés localement."
  ],
  [
    "scope",
    "Crew / mission",
    "Tripulante / missão",
    "Tripulante / misión",
    "Équipage / mission"
  ],
  [
    "viewHistory",
    "Review mission history",
    "Consultar histórico da missão",
    "Consultar historial de misión",
    "Consulter l’historique"
  ],
  [
    "switch",
    "Switch profile",
    "Trocar perfil",
    "Cambiar perfil",
    "Changer de profil"
  ],
  [
    "optional",
    "Optional",
    "Opcional",
    "Opcional",
    "Facultatif"
  ],
  [
    "pre",
    "Preflight",
    "Pré-voo",
    "Prevuelo",
    "Avant le vol"
  ],
  [
    "during",
    "In flight",
    "Em voo",
    "En vuelo",
    "En vol"
  ],
  [
    "post",
    "Recovery",
    "Recuperação",
    "Recuperación",
    "Récupération"
  ],
  [
    "glucose",
    "Blood glucose (mg/dL)",
    "Glicemia (mg/dL)",
    "Glucosa (mg/dL)",
    "Glycémie (mg/dL)"
  ],
  [
    "localTime",
    "Measurement time (local time)",
    "Horário da medição (hora local)",
    "Hora de medición (hora local)",
    "Heure de mesure (heure locale)"
  ],
  [
    "missingValue",
    "No measurement recorded",
    "Nenhuma medição registrada",
    "Ninguna medición registrada",
    "Aucune mesure enregistrée"
  ],
  [
    "status",
    "Status",
    "Estado",
    "Estado",
    "État"
  ],
  [
    "mediaNotice",
    "Media preview lasts for this session. Media files are excluded from saved records and exports.",
    "A prévia de mídia dura esta sessão. Arquivos de mídia ficam fora dos registros e exportações.",
    "La vista previa dura esta sesión. Los archivos multimedia quedan fuera de registros y exportaciones.",
    "L’aperçu dure cette session. Les médias sont exclus des suivis enregistrés et exportés."
  ],
  [
    "noSource",
    "Source not recorded",
    "Origem não registrada",
    "Fuente sin registrar",
    "Source non renseignée"
  ],
  [
    "routineEntry",
    "Record only",
    "Somente registro",
    "Solo registro",
    "Enregistrer uniquement"
  ],
  [
    "reviewEntry",
    "Request follow-up in the report",
    "Solicitar acompanhamento no relatório",
    "Solicitar seguimiento en el informe",
    "Demander un suivi dans le rapport"
  ],
  [
    "procedureEntry",
    "Following an approved mission procedure",
    "Seguindo um procedimento aprovado",
    "Siguiendo un procedimiento aprobado",
    "Procédure de mission approuvée en cours"
  ],
  [
    "reviewNote",
    "Follow-up preference is saved with the record. Export the report to share it.",
    "A preferência fica salva no registro. Exporte o relatório para compartilhar.",
    "La preferencia se guarda en el registro. Exporta el informe para compartirlo.",
    "La préférence est enregistrée dans le suivi. Exportez le rapport pour le partager."
  ],
  [
    "open",
    "Open workspace",
    "Abrir espaço de trabalho",
    "Abrir espacio de trabajo",
    "Ouvrir l’espace de travail"
  ],
  [
    "clearDraft",
    "Discard draft",
    "Descartar rascunho",
    "Descartar borrador",
    "Supprimer le brouillon"
  ],
  [
    "confirmDraft",
    "Discard this mission’s unsaved check-in?",
    "Descartar o check-in não salvo desta missão?",
    "¿Descartar el registro sin guardar de esta misión?",
    "Supprimer le suivi non enregistré de cette mission ?"
  ],
  [
    "historyEmpty",
    "No check-ins for this mission yet.",
    "Esta missão ainda não tem check-ins.",
    "Esta misión aún no tiene registros.",
    "Cette mission n’a pas encore de suivi."
  ],
  [
    "savedHelp",
    "Your record is available in Mission History and in the mission comparison.",
    "Seu registro está no Histórico da missão e na comparação.",
    "Tu registro está en el Historial de misión y en la comparación.",
    "Votre suivi est disponible dans l’Historique de mission et la comparaison."
  ],
  [
    "research",
    "Spaceflight sleep research",
    "Pesquisa sobre sono no espaço",
    "Investigación sobre sueño espacial",
    "Recherche sur le sommeil spatial"
  ],
  [
    "researchHelp",
    "Published group averages provide research context. Your self-reports stay separate.",
    "Médias publicadas fornecem contexto de pesquisa. Seus relatos ficam separados.",
    "Los promedios publicados aportan contexto. Tus registros se mantienen separados.",
    "Les moyennes publiées apportent du contexte. Vos suivis restent distincts."
  ],
  [
    "skip",
    "Skip to main content",
    "Ir ao conteúdo principal",
    "Ir al contenido principal",
    "Aller au contenu principal"
  ],
  [
    "groundLabel",
    "Review a transferred report",
    "Revisar relatório transferido",
    "Revisar informe transferido",
    "Examiner un rapport transféré"
  ],
  [
    "planLabel",
    "Organize operational tasks",
    "Organizar tarefas operacionais",
    "Organizar tareas operativas",
    "Organiser les tâches opérationnelles"
  ],
  [
    "hour",
    "h",
    "h",
    "h",
    "h"
  ],
  [
    "profileRequired",
    "Open a local profile on Today to continue.",
    "Abra um perfil local em Hoje para continuar.",
    "Abre un perfil local en Hoy para continuar.",
    "Ouvrez un profil local dans Aujourd’hui pour continuer."
  ],
  [
    "legacyNotice",
    "Earlier entries without crew or mission codes are preserved in browser storage. Export the legacy archive to keep a copy.",
    "Registros anteriores sem códigos foram preservados no navegador. Exporte o arquivo antigo para guardar uma cópia.",
    "Los registros antiguos sin códigos se conservaron. Exporta el archivo antiguo para guardar una copia.",
    "Les anciens suivis sans codes sont préservés. Exportez l’archive pour conserver une copie."
  ],
  [
    "legacyExport",
    "Export legacy archive",
    "Exportar arquivo antigo",
    "Exportar archivo antiguo",
    "Exporter les archives"
  ],
  [
    "recorded",
    "Recorded at",
    "Registrado em",
    "Registrado el",
    "Enregistré le"
  ]
];
  for (const [key, ...values] of rows) {
    ["en", "pt", "es", "fr"].forEach((language, index) => {
      window.CrewTranslations[language][key] = values[index];
    });
  }
}

