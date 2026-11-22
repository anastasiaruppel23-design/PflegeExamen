/* Guided practice for the three oral exam cases. */
const oralClueTypes = {
 problem: 'Aktuelles Problem',
 risk: 'Risiko',
 resource: 'Ressource',
 open: 'Offene Frage'
};

const guidedOralCases = {
 sturz: {
  clues: [
   ['Beim Aufstehen wird Herrn Yilmaz zeitweise schwindelig.', 'problem', 'Schwindel ist eine bereits berichtete Beschwerde. Seine Ursache lässt sich aus der Angabe allein nicht ableiten.'],
   ['Er könnte beim nächsten nächtlichen Toilettengang erneut stürzen.', 'risk', 'Das beschreibt ein mögliches zukünftiges Ereignis. Der bisherige Sturz, der Schwindel und die schwer erreichbare Klingel stützen die Einschätzung.'],
   ['Er kann den Sturzhergang schildern.', 'resource', 'Seine Auskunft hilft, den Ablauf zu verstehen und mit ihm eine passende Unterstützung zu planen.'],
   ['Wodurch entsteht der Schwindel beim Aufstehen?', 'open', 'Der Schwindel ist bekannt. Seine Ursache muss noch abgeklärt werden.']
  ],
  modelQuestion: 'Wie überprüfst du, ob die vereinbarte Sturzprophylaxe umgesetzt wird und wirkt?',
  models: [
   ['Lazarus', false, 'Lazarus hilft, Sturzangst und Bewältigung zu verstehen. Für die Beurteilung von Voraussetzungen, Ablauf und Ergebnis eignet sich hier Donabedian.'],
   ['Donabedian', true, 'Struktur: Erreichbare Klingel und passende Hilfsmittel. Prozess: Vereinbarte Begleitung wird durchgeführt. Ergebnis: Transfer gelingt mit vereinbarter Hilfe und Herr Yilmaz fühlt sich sicherer.']
  ],
  speaking: 'Begründe einen sicheren Toilettengang, der Herrn Yilmaz’ Wunsch nach Selbstständigkeit berücksichtigt.',
  followup: 'Herr Yilmaz lehnt am Abend die vereinbarte Begleitung ab. Wie reagieren Sie, und was geben Sie an den Nachtdienst weiter?',
  review: [
   'Ich habe Sturz, Schwindel oder die unerreichbare Klingel als Textbeleg genannt.',
   'Ich habe die aktuelle Transfersicherheit priorisiert und nach dem Grund für seine Ablehnung gefragt.',
   'Ich habe eine akzeptable Alternative mit Selbstbestimmung und individueller Sturzprophylaxe begründet.',
   'Ich habe Zuständigkeit und Übergabe benannt: Befund, Wunsch, vereinbarte Hilfe und Anlass für erneute Rückmeldung.',
   'Ich habe einen Zeitpunkt und Kriterien genannt, etwa den nächsten Toilettengang, Schwindel, Hilfebedarf und Sicherheitsgefühl.'
  ]
 },
 samira: {
  clues: [
   ['Samira hat drei Kontrolltermine abgesagt und berichtet, dass sie sich überfordert fühlt.', 'problem', 'Die Kontrolltermine wurden bereits versäumt und die Belastung ist von Samira beschrieben.'],
   ['Ohne abgestimmten Kontakt könnten weitere Kontrollen ausfallen.', 'risk', 'Das ist eine mögliche Folge. Ob die nächste Kontrolle ausfällt, ist offen.'],
   ['Samira sagt, sie würde zu einem Termin kommen, den sie mitplanen kann.', 'resource', 'Ihre Bereitschaft und ihre Fähigkeit, Bedingungen zu benennen, helfen bei einer gemeinsamen Planung.'],
   ['Welche Informationen möchte Samira gegenüber ihrer Mutter freigeben?', 'open', 'Der Wunsch nach Vertraulichkeit ist bekannt. Der genaue Umfang der Freigabe muss noch besprochen werden.']
  ],
  modelQuestion: 'Welche Theorie hilft dir, selbstständige Diabetesversorgung von dem konkreten Unterstützungsbedarf zu unterscheiden?',
  models: [
   ['Antonovsky', false, 'Antonovsky hilft, den Plan verständlich, machbar und bedeutsam zu gestalten. Für die Frage, was Samira selbst kann und wobei Hilfe nötig ist, passt Orem direkter.'],
   ['Orem', true, 'Vergleiche Samiras Fähigkeiten mit den Aufgaben der Selbstpflege. Erfrage erst, was sie im Alltag selbst bewältigt und ob sie nur bei Terminplanung oder Kontaktaufnahme Unterstützung braucht.']
  ],
  speaking: 'Begründe, wie du mit Samira einen erreichbaren Kontrolltermin planst, sie beteiligst und Vertraulichkeit berücksichtigst.',
  followup: 'Samiras Mutter ruft an und bittet ohne Samira um alle Befunde. Wie reagieren Sie, und was klären Sie vor einer Weitergabe?',
  review: [
   'Ich habe die abgesagten Termine und Samiras Wunsch nach eigener Gesprächsführung am Fall belegt.',
   'Ich habe die Versorgungskontinuität priorisiert und Samiras Gründe und Unterstützungsbedarf erfragt.',
   'Ich habe erklärt, wie ich Vertraulichkeit, konkrete Einwilligungsfähigkeit und die Voraussetzungen einer Auskunft kläre.',
   'Ich habe benannt, wer den Kontakt koordiniert und wie die übrigen Beteiligten einbezogen werden können.',
   'Ich habe einen überprüfbaren nächsten Schritt vereinbart, etwa Termin, Kontaktweg und Rückmeldung beim Folgegespräch.'
  ]
 },
 brandt: {
  clues: [
   ['An der Ferse ist eine Rötung beschrieben, die sich nicht wegdrücken lässt.', 'problem', 'Es liegt bereits ein auffälliger Hautbefund vor. Er braucht eine zeitnahe fachliche Einschätzung.'],
   ['Nach zwei nächtlichen Stürzen könnte Frau Brandt nachts erneut stürzen.', 'risk', 'Die Stürze sind passiert. Die Aussage ordnet das mögliche erneute Ereignis als Risiko ein.'],
   ['Sabine ist ansprechbar und kennt Teile des Alltags ihrer Mutter.', 'resource', 'Mit Frau Brandts Einverständnis kann Sabine Informationen beitragen. Ihre eigene Belastung und Verfügbarkeit müssen berücksichtigt werden.'],
   ['Warum lehnt Frau Brandt die Körperpflege ab?', 'open', 'Die Ablehnung ist bekannt. Ihre Bedeutung lässt sich erst durch behutsames Nachfragen und Beobachten klären.']
  ],
  modelQuestion: 'Welcher Ansatz hilft dir am direktesten, die Ablehnung der Körperpflege im Gespräch zu verstehen?',
  models: [
   ['Carl Rogers', true, 'Mit Empathie und Wertschätzung erkundest du, was Frau Brandt wichtig ist und was sie ablehnt. Du kannst daraufhin eine für sie akzeptable Unterstützung anbieten.'],
   ['Friedemann', false, 'Friedemann passt gut zur Belastung der Tochter und zur Aufgabenverteilung. Für die unmittelbare Gesprächshaltung gegenüber Frau Brandt passt Carl Rogers hier direkter.']
  ],
  speaking: 'Setze bei Hautveränderung, nächtlichen Stürzen und abgelehnter Körperpflege nachvollziehbare Prioritäten. Begründe deine ersten Schritte.',
  followup: 'Die Tochter drängt auf ein Bettgitter. Welche Fragen klären Sie und welche Alternative besprechen Sie mit Frau Brandt?',
  review: [
   'Ich habe die Fersenrötung, die nächtlichen Stürze und mindestens eine vorhandene Ressource am Fall belegt.',
   'Ich habe erklärt, welche Befunde ich zuerst fachlich einschätze und was parallel organisiert werden muss.',
   'Ich habe individuelle Sturz- oder Dekubitusprophylaxe einbezogen und Frau Brandts Willen beim Bettgitter berücksichtigt.',
   'Ich habe genannt, wer Hautbefund, Mobilität und weitere Abklärung übernimmt und welche Angaben weitergegeben werden.',
   'Ich habe einen Zeitpunkt und Kriterien für die Kontrolle von Hautbefund, Mobilität und Sicherheit genannt.'
  ]
 }
};

function guidedOralHtml(key) {
 const exercise = guidedOralCases[key];
 if (!exercise) return '';
 return `<section class="panel" id="guidedOral" aria-labelledby="guidedOralTitle">
  <h3 id="guidedOralTitle">Geführtes Prüfungsgespräch</h3>
  <h4>1. Hinweise aus dem Fall zuordnen</h4>
  <p>Wähle aus, was der jeweilige Satz beschreibt. Prüfe erst danach deine Zuordnung.</p>
  ${exercise.clues.map(([clue], index) => `<div class="card" data-clue="${index}">
   <label><strong>${esc(clue)}</strong>
    <select aria-label="${esc(clue)}">
     <option value="">Bitte zuordnen</option>
     ${Object.entries(oralClueTypes).map(([id, label]) => `<option value="${id}">${esc(label)}</option>`).join('')}
    </select>
   </label>
   <button class="btn" type="button" data-check>Zuordnung prüfen</button>
   <p role="status"></p>
  </div>`).join('')}
  <h4>2. Zwei Modelle vergleichen</h4>
  <p>${esc(exercise.modelQuestion)}</p>
  <p>Begründe deine Wahl zunächst laut. Wähle dann das Modell für diese Prüfungsfrage.</p>
  <div class="flex">${exercise.models.map(([label], index) => `<button class="btn" type="button" data-model-choice="${index}" aria-pressed="false">${esc(label)}</button>`).join('')}</div>
  <p role="status" data-model-feedback></p>
  <h4>3. In 90 Sekunden laut antworten</h4>
  <p>${esc(exercise.speaking)}</p>
  <div class="flex">
   <button class="btn primary" type="button" data-speaking-start>90 Sekunden starten</button>
   <button class="btn" type="button" data-speaking-stop disabled>Beenden</button>
   <strong role="timer" aria-label="Verbleibende Sprechzeit" data-speaking-clock>1:30</strong>
  </div>
  <p role="status" data-speaking-status></p>
  <details><summary>Nachfrage der Prüferin öffnen</summary><p>${esc(exercise.followup)}</p></details>
  <details><summary>Selbstcheck · 5 Kriterien</summary>
   <ul>${exercise.review.map(item => `<li><label><input type="checkbox"> ${esc(item)}</label></li>`).join('')}</ul>
  </details>
 </section>`;
}

function bindGuidedOral(key, section) {
 const exercise = guidedOralCases[key];
 if (!exercise || !section) return;
 section.querySelectorAll('[data-clue]').forEach(block => {
  const select = block.querySelector('select');
  const feedback = block.querySelector('[role="status"]');
  const [, correct, explanation] = exercise.clues[Number(block.dataset.clue)];
  select.addEventListener('change', () => { feedback.textContent = ''; });
  block.querySelector('[data-check]').addEventListener('click', () => {
   const value = select.value;
   if (!value) {
    feedback.textContent = 'Wähle zuerst eine Zuordnung.';
    return;
   }
   feedback.textContent = value === correct
    ? 'Richtig. ' + explanation
    : 'Hier passt „' + oralClueTypes[correct] + '“. ' + explanation;
  });
 });
 const modelButtons = [...section.querySelectorAll('[data-model-choice]')];
 const modelFeedback = section.querySelector('[data-model-feedback]');
 modelButtons.forEach((button, index) => button.addEventListener('click', () => {
  const [, best, explanation] = exercise.models[index];
  modelButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  modelFeedback.textContent = (best ? 'Das passt direkt zur Frage. ' : 'Das Modell beantwortet eine andere Frage. ') + explanation;
 }));
 bindOralSpeakingTimer(section);
}

function bindOralSpeakingTimer(section) {
 const start = section.querySelector('[data-speaking-start]');
 const stop = section.querySelector('[data-speaking-stop]');
 const clock = section.querySelector('[data-speaking-clock]');
 const status = section.querySelector('[data-speaking-status]');
 let timeout;
 function finish(message) {
  clearTimeout(timeout);
  start.disabled = false;
  stop.disabled = true;
  status.textContent = message;
 }
 start.addEventListener('click', () => {
  start.disabled = true;
  stop.disabled = false;
  status.textContent = 'Die Sprechzeit läuft.';
  const deadline = Date.now() + 90000;
  function tick() {
   if (!section.isConnected) return;
   const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
   clock.textContent = Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
   if (seconds === 0) finish('Zeit vorbei. Öffne die Nachfrage und prüfe anschließend deine Antwort.');
   else timeout = setTimeout(tick, 250);
  }
  tick();
 });
 stop.addEventListener('click', () => finish('Übung beendet. Du kannst jetzt die Nachfrage und den Selbstcheck öffnen.'));
}
