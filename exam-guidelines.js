/* Prüfungsnahe Übung nach PflBG/PflAPrV und Hamburger Handreichungen.
   Offline-Selbstcheck: Antworten bleiben im Arbeitsspeicher und werden nicht gespeichert. */
(function () {
  "use strict";

  const SOURCES = [
    { label: "PflAPrV §§ 9, 14–19 (Gesetze im Internet)", url: "https://www.gesetze-im-internet.de/pflaprv/" },
    { label: "PflBG § 4 und § 5 (Gesetze im Internet)", url: "https://www.gesetze-im-internet.de/pflbg/" },
    { label: "Hamburg: Handreichungen zu den drei Abschlussprüfungen (Stand 03/2026 bzw. 04/2026)", url: "https://www.hamburg.de/politik-und-verwaltung/behoerden/sozialbehoerde/einrichtungen/lpa/pflegefachkraefte-31534" }
  ];

  const MODES = {
    written: {
      title: "Schriftliche Prüfung",
      law: "PflAPrV § 14",
      summary: "Drei fallbezogene Aufsichtsarbeiten mit jeweils 120 Minuten. In Hamburg sind sie in der Regel an drei aufeinanderfolgenden Werktagen angesetzt. Jede einzelne Arbeit muss mindestens ausreichend sein.",
      focus: [
        "Tag 1: Pflegeprozess, Beziehungsgestaltung, Lebensgestaltung, Autonomie und Entwicklungsförderung; ausgewählte rechtliche und ethische Kontextbedingungen.",
        "Tag 2: Pflegeprozess bei gesundheitlichen Problemlagen, Gesundheitsförderung, Prävention und Beratung; Entscheidungen pflegewissenschaftlich begründen.",
        "Tag 3: kritische und krisenhafte Situationen, ärztliche Anordnungen und ethische Entscheidungsprozesse.",
        "Über alle drei Fälle hinweg sollen Altersstufen, Lebenswelten und Versorgungsbereiche variieren."
      ],
      cases: [
        {
          caseTitle: "Tag 1 · Beziehung, Alltag und Selbstbestimmung",
          caseText: "Frau L., 79 Jahre, lebt nach einem Schlaganfall in einer Pflegeeinrichtung. Sie kann kurze Strecken mit Unterstützung gehen und möchte morgens selbst entscheiden, wann sie aufsteht. Ihre Tochter bittet das Team, Stürze unbedingt zu verhindern und Frau L. möglichst im Bett zu lassen.",
          tasks: [
            ["Welche pflegerischen Informationen und Ressourcen sind für die Pflegeplanung zuerst wichtig?", ["Individueller Pflegebedarf und aktueller Zustand erheben", "Wünsche, Gewohnheiten und Selbstbestimmung von Frau L. erfassen", "Ressourcen, Mobilität, Sturzvorgeschichte und Umfeld berücksichtigen"]],
            ["Formuliere zwei passende Maßnahmen und begründe, wie sie Sicherheit und Autonomie verbinden.", ["Maßnahmen individuell aus dem Assessment ableiten", "Frau L. beteiligen und Einwilligung/Wünsche beachten", "Maßnahmen fachlich begründen und mit dem Team abstimmen"]],
            ["Nenne ein überprüfbares Pflegeziel und beschreibe, wie du es evaluierst.", ["Ziel konkret und zeitlich überprüfbar formulieren", "Beobachtbare Kriterien festlegen", "Wirkung und mögliche Anpassung dokumentieren"]]
          ]
        },
        {
          caseTitle: "Tag 2 · Gesundheitsprobleme, Beratung und Evidenz",
          caseText: "Herr M., 54 Jahre, wird nach einer stationären Behandlung wegen einer chronischen Erkrankung ambulant versorgt. Er nimmt mehrere Medikamente ein, ist unsicher bei der täglichen Selbstversorgung und möchte möglichst wenig Hilfe annehmen. Seine Angehörige übernimmt vieles, ohne ihn vorher zu fragen.",
          tasks: [
            ["Welche Gesundheitsrisiken, Ressourcen und Beratungsbedarfe erhebst du?", ["Akute und langfristige Problemlagen strukturiert erfassen", "Selbstpflegekompetenz, Ziele und vorhandene Ressourcen klären", "Angehörige nur mit Einverständnis einbeziehen"]],
            ["Wie planst du eine kurze Beratung, die Herrn M. zur eigenen Entscheidung befähigt?", ["Vorwissen und individuellen Informationsbedarf erfragen", "Verständlich, gemeinsam und ohne Druck beraten", "Verständnis prüfen und nächste Schritte vereinbaren"]],
            ["Wie begründest du deine Pflegeentscheidung wissenschaftlich?", ["Passende Theorie, aktuelle Erkenntnis oder Expertenstandard benennen", "Bezug zum konkreten Fall herstellen", "Nutzen, Grenzen und Evaluation der Maßnahme erklären"]]
          ]
        },
        {
          caseTitle: "Tag 3 · Kritische Situation und ethische Abwägung",
          caseText: "Ein 8-jähriges Kind wird nach einer Operation auf einer Station versorgt. Bei der Übergabe fallen zunehmende Müdigkeit, auffällige Vitalzeichen und starke Schmerzen auf. Ein Elternteil ist beunruhigt; gleichzeitig steht eine weitere angeordnete Maßnahme an.",
          tasks: [
            ["Was hat in dieser Situation Priorität und welche Beobachtungen brauchst du?", ["Gefährdung erkennen und strukturiert einschätzen", "Vitalzeichen, Bewusstsein, Schmerz und Verlauf berücksichtigen", "Unverzüglich zuständige Fachpersonen informieren und Hilfe organisieren"]],
            ["Wie gehst du mit einer ärztlichen Anordnung um, wenn der Zustand sich verändert hat?", ["Anordnung, Situation und eigene Kompetenz prüfen", "Bei Unsicherheit oder Veränderung Rücksprache halten", "Sicher durchführen, beobachten und nachvollziehbar dokumentieren"]],
            ["Welche ethischen Gesichtspunkte und Kommunikationsschritte berücksichtigst du?", ["Kindeswohl, Beteiligung und altersgerechte Information beachten", "Sorgeberechtigte einbeziehen und verständlich kommunizieren", "Nutzen, Risiken und Dringlichkeit transparent abwägen"]]
          ]
        }
      ]
    },
    oral: {
      title: "Mündliche Prüfung",
      law: "PflAPrV § 15",
      summary: "Ein komplexer Fall prüft die Kompetenzbereiche III bis V. In Hamburg: 30 Minuten Vorbereitungszeit unter Aufsicht und 30 bis 45 Minuten Prüfungsgespräch pro Person. Der Fall soll sich von der praktischen Prüfung in Altersstufe und Versorgungskontext unterscheiden.",
      focus: [
        "III: intra- und interprofessionell handeln und Zusammenarbeit begründen.",
        "IV: Handeln anhand einschlägiger Gesetze, Verordnungen und ethischer Leitlinien reflektieren.",
        "V: Pflegehandeln anhand wissenschaftlicher Erkenntnisse und berufsethischer Werte reflektieren.",
        "Berufsrolle, berufliches Selbstverständnis sowie Team-, Einrichtungs- und Gesellschaftskontext einbeziehen."
      ],
      cases: [{
        caseTitle: "Mündlicher Fall · Zusammenarbeit, Recht und Evidenz",
        caseText: "Herr S., 67 Jahre, lebt allein und wird nach einem Krankenhausaufenthalt von einem ambulanten Pflegedienst unterstützt. Er lehnt eine vorgeschlagene Hilfe zunächst ab. Eine Pflegekraft beobachtet eine Veränderung seines Allgemeinzustands. Angehörige, Hausarztpraxis und Pflegedienst haben unterschiedliche Einschätzungen zur nächsten Versorgung.",
        tasks: [
          ["Stelle die wichtigsten intra- und interprofessionellen Handlungsbedarfe dar.", ["Beobachtung sachlich weitergeben und Dringlichkeit benennen", "Zuständigkeiten und geeignete Berufsgruppen klären", "Absprachen, Informationsweitergabe und Verlaufssicherung planen"]],
          ["Welche rechtlichen und ethischen Gesichtspunkte prüfst du?", ["Selbstbestimmung, Einwilligung und Entscheidungsfähigkeit fallbezogen betrachten", "Schweigepflicht und erforderliche Informationsweitergabe beachten", "Nutzen, Risiken und mögliche Konflikte nachvollziehbar abwägen"]],
          ["Wie begründest du dein Vorgehen mit wissenschaftlichem Wissen und deiner Berufsrolle?", ["Einschlägige Erkenntnis, Leitlinie oder Standard passend auswählen", "Wissen auf den Fall beziehen und Grenzen benennen", "Verantwortung, Kompetenzgrenzen und Reflexion darstellen"]]
        ]
      }]
    },
    practical: {
      title: "Praktische Prüfung",
      law: "PflAPrV § 16",
      summary: "Geprüft wird der selbstständige, umfassende Pflegeprozess in einer komplexen Pflegesituation. Die Hamburger Handreichung beschreibt einen Vorbereitungsteil und einen Durchführungsteil. Fallvorstellung, geplante und situativ angepasste Pflege sowie Reflexionsgespräch gehören dazu; die Durchführungsprüfung einschließlich Reflexionsgespräch soll 240 Minuten nicht überschreiten.",
      focus: [
        "Vorbereitung: Informationssammlung und individueller Pflegeplan; Hamburg sieht hierfür angemessene Vorbereitungszeit vor, die 240 Minuten nicht überschreiten soll. Für Pflegeplanung und Ablaufplanung sind höchstens 120 Minuten vorgesehen.",
        "Durchführung: Fallvorstellung, fachgerechte Pflegehandlungen, Beobachtung, Kommunikation, Sicherheit und situative Anpassung.",
        "Abschluss: Übergabe/Dokumentation und Reflexion des eigenen Handelns.",
        "Die konkreten Abläufe und Aufgaben richten sich nach der aktuellen Hamburger Handreichung und der Organisation der Pflegeschule."
      ],
      cases: [{
        caseTitle: "Praktischer Fall · Vom Pflegebedarf zur Evaluation",
        caseText: "Frau B., 76 Jahre, lebt in einer Pflegeeinrichtung und benötigt bei Körperpflege und Transfer Unterstützung. Sie hat eigene Gewohnheiten, möchte möglichst viel selbst übernehmen und berichtet heute über eine neue Beschwerde. Für die Übung bekommst du keine echten Patientendaten; arbeite mit den Angaben des Falls.",
        tasks: [
          ["Welche Angaben erhebst und ordnest du vor der Pflegeplanung?", ["Aktuellen Zustand, Biografie und Wünsche aufnehmen", "Diagnosen, Medikamente, Risiken, Ressourcen und Unterstützungsbedarf berücksichtigen", "Informationslücken erkennen und gezielt klären"]],
          ["Formuliere einen Pflegebedarf, ein Ziel und passende Maßnahmen.", ["Pflegebedarf aus den Falldaten ableiten", "Ziel individuell und überprüfbar formulieren", "Maßnahmen mit Begründung, Zuständigkeit und Beobachtungskriterien planen"]],
          ["Was zeigst du während der Durchführung und in der Reflexion?", ["Identität, Einverständnis, Intimsphäre und Sicherheit beachten", "Ressourcen fördern, fachgerecht handeln und Veränderungen wahrnehmen", "Ergebnis evaluieren, übergeben/dokumentieren und eigenes Handeln reflektieren"]]
        ]
      }]
    }
  };

  let modeKey = "written";
  let caseIndex = 0;
  let taskIndex = 0;
  let answer = "";
  let revealed = false;

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch];
    });
  }
  function sourceLinks() {
    return SOURCES.map(function (s) {
      return '<li><a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' + esc(s.label) + '</a></li>';
    }).join("");
  }
  function setContent(html) {
    const content = document.getElementById("content");
    content.innerHTML = html;
    content.focus({ preventScroll: true });
    content.scrollIntoView({ block: "start", behavior: "smooth" });
  }
  function openExamGuidelines() {
    modeKey = "written";
    caseIndex = 0;
    taskIndex = 0;
    answer = "";
    revealed = false;
    renderOverview();
  }
  function renderOverview() {
    const mode = MODES[modeKey];
    const tabs = Object.keys(MODES).map(function (key) {
      return '<button class="btn ' + (key === modeKey ? "primary" : "") + '" aria-pressed="' + (key === modeKey) + '" onclick="selectExamGuidanceMode(\'' + key + '\')">' + esc(MODES[key].title) + '</button>';
    }).join("");
    const focus = mode.focus.map(function (item) { return "<li>" + esc(item) + "</li>"; }).join("");
    setContent(
      '<div class="panel"><button class="btn exam-back" onclick="go(\\'pruefung\\')">← Zurück zum Prüfungstraining</button>' +
      '<p class="tag">Prüfungsvorbereitung · Stand 07.11.2026</p><h2>So übst du für alle drei Prüfungsteile</h2>' +
      '<p>Du bekommst jeweils eine Aufgabe. Erst schreibst oder sprichst du deine eigene Antwort. Danach öffnest du den Erwartungshorizont und prüfst selbst, was schon drin war und was noch fehlt.</p>' +
      '<div class="flex">' + tabs + '</div><article class="card"><h3>' + esc(mode.title) + '</h3><p><strong>Rechtsgrundlage:</strong> ' + esc(mode.law) + '</p><p>' + esc(mode.summary) + '</p><ul>' + focus + '</ul>' +
      '<button class="btn primary" onclick="startExamGuidancePractice()">Mit einer Fallübung starten →</button></article>' +
      '<div class="card"><h3>So läuft die Übung ab</h3><ol><li>Ich stelle dir eine Frage nach der anderen.</li><li>Du formulierst erst selbst deine Antwort.</li><li>Mit „Antwort fertig – Erwartungshorizont anzeigen“ öffnest du die Orientierungspunkte.</li><li>Du vergleichst und markierst selbst, was du genannt hast. Die App vergibt keine Prüfungsnote.</li></ol><p>Deine Texte werden nicht gespeichert oder an einen Server gesendet. Für eine persönliche Korrektur kannst du deine Antwort anschließend mit mir besprechen.</p></div>' +
      '<details class="card"><summary>Offizielle Quellen öffnen</summary><ul>' + sourceLinks() + '</ul><p class="muted">Bundesrecht: konsolidierte Fassungen laut Gesetze im Internet. Hamburger Handreichungen: schriftlich Stand 04/2026, mündlich und praktisch Stand 03/2026. Änderungen und schulinterne Vorgaben können hinzukommen.</p></details>' +
      '<p class="muted">Lernhilfe zur Prüfungsvorbereitung. Sie ersetzt keine verbindlichen Angaben der Pflegeschule oder des Landesprüfungsamts und keine fachliche Anleitung zur Versorgung realer Patientinnen und Patienten.</p></div>'
    );
  }
  function selectExamGuidanceMode(key) {
    if (!MODES[key]) return;
    modeKey = key;
    caseIndex = 0;
    taskIndex = 0;
    answer = "";
    revealed = false;
    renderOverview();
  }
  function startExamGuidancePractice() {
    caseIndex = 0;
    taskIndex = 0;
    answer = "";
    revealed = false;
    renderPractice();
  }
  function renderPractice() {
    const mode = MODES[modeKey];
    const scenario = mode.cases[caseIndex % mode.cases.length];
    const task = scenario.tasks[taskIndex];
    const checklist = task[1].map(function (point, index) {
      return '<label class="exam-check"><input type="checkbox" onchange="updateExamGuidanceCount()"><span>' + esc(point) + '</span></label>';
    }).join("");
    const revealedBlock = revealed
      ? '<div class="card"><h3>Woran du deine Antwort prüfen kannst</h3><p>Das sind Orientierungspunkte, keine einzige auswendig zu lernende Musterantwort. Eine passende eigene Begründung zählt.</p>' + checklist +
        '<p id="examGuidanceCount" class="muted">Markiert: 0 von ' + task[1].length + '</p>' +
        '<p><strong>Selbstreflexion:</strong> Was war an deiner Antwort schon klar? Was würdest du beim nächsten Versuch ergänzen?</p>' +
        '<button class="btn primary" onclick="nextExamGuidanceTask()">Nächste Frage →</button></div>'
      : "";
    setContent(
      '<div class="panel"><button class="btn exam-back" onclick="renderExamGuidanceOverview()">← Zur Übersicht</button>' +
      '<p class="tag">' + esc(mode.title) + ' · Fall ' + (caseIndex + 1) + ' von ' + mode.cases.length + ' · Frage ' + (taskIndex + 1) + ' von ' + scenario.tasks.length + '</p>' +
      '<h2>' + esc(scenario.caseTitle) + '</h2><p>' + esc(scenario.caseText) + '</p>' +
      '<h3>' + esc(task[0]) + '</h3><label for="examGuidanceAnswer">Deine Antwort</label>' +
      '<textarea id="examGuidanceAnswer" rows="7" placeholder="Erkläre es in deinen eigenen Worten …">' + esc(answer) + '</textarea>' +
      '<p><button class="btn primary" onclick="revealExamGuidanceAnswer()">Antwort fertig – Erwartungshorizont anzeigen</button></p>' +
      revealedBlock + '<p class="muted">Die Antwort bleibt nur so lange im Arbeitsspeicher, wie du diese Übung geöffnet hast.</p></div>'
    );
    const field = document.getElementById("examGuidanceAnswer");
    if (field) field.addEventListener("input", function () { answer = field.value; });
  }
  function revealExamGuidanceAnswer() {
    const field = document.getElementById("examGuidanceAnswer");
    answer = field ? field.value : answer;
    revealed = true;
    renderPractice();
  }
  function updateExamGuidanceCount() {
    const boxes = Array.from(document.querySelectorAll(".exam-check input"));
    const count = boxes.filter(function (box) { return box.checked; }).length;
    const label = document.getElementById("examGuidanceCount");
    if (label) label.textContent = "Markiert: " + count + " von " + boxes.length;
  }
  function nextExamGuidanceTask() {
    const mode = MODES[modeKey];
    const scenario = mode.cases[caseIndex % mode.cases.length];
    taskIndex += 1;
    if (taskIndex >= scenario.tasks.length) {
      taskIndex = 0;
      caseIndex = (caseIndex + 1) % mode.cases.length;
    }
    answer = "";
    revealed = false;
    renderPractice();
  }

  window.openExamGuidelines = openExamGuidelines;
  window.renderExamGuidanceOverview = renderOverview;
  window.selectExamGuidanceMode = selectExamGuidanceMode;
  window.startExamGuidancePractice = startExamGuidancePractice;
  window.revealExamGuidanceAnswer = revealExamGuidanceAnswer;
  window.updateExamGuidanceCount = updateExamGuidanceCount;
  window.nextExamGuidanceTask = nextExamGuidanceTask;

  if (typeof window.examPracticeIntro === "function") {
    const previousIntro = window.examPracticeIntro;
    window.examPracticeIntro = function () {
      return previousIntro() +
        '<div class="card exam-guidance-entry"><span class="tag">Aktuelle Prüfungsregeln · Hamburg</span>' +
        '<h3>Schriftlich, praktisch und mündlich üben</h3>' +
        '<p>Mit den offiziellen Prüfungsformaten und Schritt für Schritt: erst selbst antworten, dann vergleichen.</p>' +
        '<button class="btn primary" onclick="openExamGuidelines()">Prüfungsvorbereitung öffnen →</button></div>';
    };
  }
})();
