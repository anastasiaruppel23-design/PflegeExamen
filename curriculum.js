/* Practice-oriented reading guide to the Hamburg curriculum and the federal framework. */
const curriculumUnits = [
  'Ausbildungsstart und berufliche Rolle',
  'Bewegung und Selbstversorgung',
  'Praxiserfahrungen reflektieren und kommunizieren',
  'Gesundheitsförderung und Prävention',
  'Kurative Pflege und Patientensicherheit',
  'Sicher handeln in Akutsituationen',
  'Rehabilitation im interprofessionellen Team',
  'Krisen und letzte Lebensphase',
  'Lebensgestaltung und Langzeitpflege',
  'Entwicklung und Gesundheit in Kindheit und Jugend',
  'Psychische Gesundheit und kognitive Beeinträchtigungen'
];

// Fields can draw on several units. These references are learning links, not official equivalences.
const curriculumYears = [
  [
    ['1a', 'In die Ausbildung starten', [1], 'Kläre vor dem ersten Einsatz deine Rolle, Ansprechpersonen und Lernziele. Stelle dich bei der Aufnahme vor, frage nach Einverständnis und erhebe Pflegebedarf und Ressourcen. Besprich, welche Aufgaben du schon übernehmen kannst und wann du Anleitung brauchst.', 'Du sollst eine unbekannte Tätigkeit allein übernehmen. Wie klärst du die Aufgabe?', 'Benenne deinen Lernstand, bitte um Anleitung und vereinbare, wer dich begleitet und dir Rückmeldung gibt.', 'Pflegeprozess &'],
    ['1b', 'Den ersten Einsatz reflektieren', [3], 'Kollegiale Beratung hilft, belastende Situationen strukturiert zu besprechen. Beschreibe den Ablauf ohne identifizierende Daten, trenne Beobachtung und Deutung und formuliere eine konkrete Frage. Wähle aus den Vorschlägen einen nächsten Schritt und überprüfe ihn später.', 'Eine Person wehrt deine Hilfe ab. Welche Frage bringst du in die Beratung ein?', 'Frage etwa, woran du Überforderung erkennen und wie du vor dem nächsten Kontakt Wahlmöglichkeiten anbieten kannst.', 'Carl Rogers'],
    ['2', 'Orientierung, Mobilität und Sicherheit', [2], 'Kläre vor der Mobilisation, was die Person selbst kann und welche Unterstützung vereinbart ist. Beobachte Orientierung, Schmerzen, Schwindel und Gang. Stimme Umgebung, Hilfsmittel und Unterstützung ab und überprüfe gemeinsam, wie sicher sich die Person bewegt.', 'Eine Bewohnerin möchte wieder selbst zum Esstisch gehen. Wie machst du daraus ein Pflegeziel?', 'Vereinbare Strecke, Hilfsmittel, Unterstützungsbedarf und einen Zeitpunkt zur Überprüfung.', 'DNQP – Sturzprophylaxe'],
    ['3a', 'Bei alltäglichen Aktivitäten unterstützen', [2], 'Beobachte Körperpflege, Essen, Trinken und Ausscheidung und frage nach Gewohnheiten. Biete Hilfe so an, dass Selbstständigkeit und Intimsphäre gewahrt bleiben. Plane die Reihenfolge mit der Person und passe die Unterstützung an ihre Tagesform an.', 'Ein Patient braucht Hilfe beim Waschen, möchte aber selbst beginnen. Was klärst du?', 'Frage nach der gewünschten Reihenfolge und den Schritten, die er selbst machen will. Lege benötigte Dinge in Reichweite.', 'Orem'],
    ['3b', 'Alltagsversorgung vertiefen', [2, 3], 'Verbinde wiederholte Beobachtungen mit der Pflegeplanung. Halte Veränderungen bei Aufnahme, Ausscheidung, Haut und Selbstständigkeit konkret fest. Besprich Maßnahmen mit der betroffenen Person und prüfe, was sich dadurch im Alltag verändert.', 'Eine Bewohnerin lässt seit zwei Tagen ihr Essen stehen. Was dokumentierst du?', 'Beschreibe Menge und Verlauf, frage nach Gründen und Wünschen, halte Begleitzeichen und Rückmeldungen fest und vereinbare die nächste Beobachtung.', 'Assessmentinstrumente'],
    ['4', 'Neugeborene und Eltern begleiten', [10], 'Beobachte Atmung, Hautfarbe, Temperatur, Wachheit, Trinkverhalten und Ausscheidung im Verlauf. Unterstütze Nähe, Bindung und die von den Eltern gewählte Ernährungsform. Besprich Warnzeichen wie auffällige Atmung, ausgeprägte Trinkschwäche oder Teilnahmslosigkeit unmittelbar mit dem zuständigen Team.', 'Eltern sind unsicher, ob ihr Baby genug trinkt. Was besprichst du?', 'Frage nach Verlauf und Beobachtungen. Erkläre, welche Zeichen das Team beurteilt und wann die Eltern Hilfe holen sollen.', 'Friedemann'],
    ['5', 'Vor und nach einer Operation pflegen', [5], 'Vor dem Eingriff gehören Identität, geplante Maßnahme, relevante Unterlagen und offene Fragen in die Sicherheitsprüfung. Danach beobachtest du Veränderungen bei Atmung, Kreislauf, Bewusstsein, Schmerz und Operationsgebiet und meldest Auffälligkeiten nach den vereinbarten Abläufen.', 'Nach der OP berichtet ein Kind über stärkere Schmerzen. Wie gehst du vor?', 'Erfasse Schmerz altersgerecht und kläre Verlauf und Begleitzeichen. Informiere das zuständige Team und überprüfe die Wirkung der vereinbarten Maßnahmen.', 'Appendizitis im Kindesalter'],
    ['6', 'Notfälle im Alltag erkennen', [6], 'Achte auf Eigenschutz, hole frühzeitig Hilfe und strukturiere die Ersteinschätzung nach ABCDE. Übergib den Anlass, Zeitpunkt, Beobachtungen und bereits eingeleitete Schritte. Trainiere Reanimation und die Alarmierung im Skills Lab.', 'Du findest eine Person reglos vor. Was brauchst du zuerst aus deinem Umfeld?', 'Sichere die Situation und veranlasse Hilfe nach dem örtlichen Alarmplan. Weise Anwesenden klare Aufgaben zu.', 'Notfallmanagement'],
    ['7', 'Gesundheit im häuslichen Umfeld fördern', [4, 9], 'Erfrage Gewohnheiten, Ressourcen und Belastungen im Haushalt. Wähle mit der Person eine erreichbare Veränderung, erläutere Unterstützungsangebote und prüfe beim nächsten Besuch, ob die Lösung in ihren Alltag passt.', 'Eine alleinlebende Person lehnt eine Empfehlung zur Sturzprävention ab. Wie setzt du die Beratung fort?', 'Erfrage ihre Gründe, besprich für sie akzeptable Alternativen und respektiere die Entscheidung. Vereinbare bei Bedarf eine Rückmeldung.', 'Pflegeberatung']
  ],
  [
    ['8', 'Mehrfacherkrankungen auf Station', [5], 'Ordne aktuelle Veränderungen, Risiken und die persönlichen Ziele. Mehrere Diagnosen können konkurrierende Pflegeziele erzeugen. Stimme Prioritäten und mögliche Konflikte zwischen den Plänen der beteiligten Berufsgruppen ab.', 'Eine Person mit Herzinsuffizienz und Nierenerkrankung erhält widersprüchliche Hinweise zum Trinken. Was tust du?', 'Kläre den aktuell abgestimmten Therapieplan im Team, dokumentiere die Klärung und gib der Person eine verständliche, einheitliche Auskunft.', 'Herzinsuffizienz'],
    ['9', 'Neurologische Einschränkungen', [5, 7], 'Beobachte Motorik, Sprache, Orientierung und Schlucken. Vergleiche neue Auffälligkeiten mit der Ausgangssituation. Plane Kommunikation, Mobilität und Selbstversorgung gemeinsam mit der Person und gegebenenfalls Therapie und Angehörigen.', 'Nach einem Schlaganfall versteht eine Person Fragen, antwortet aber stockend. Wie erleichterst du die Verständigung?', 'Gib Zeit und nutze kurze Fragen sowie passende Kommunikationshilfen. Prüfe Verständnis und lass die Person selbst mitentscheiden.', 'Schlaganfall und TIA'],
    ['10', 'Lebensqualität in der Langzeitpflege', [9], 'Verbinde Biografie, Wünsche, Wohnumfeld und Teilhabe mit dem Pflegeprozess. Berücksichtige auch Schmerzen, Einsamkeit und individuelle Risiken. Nutze Verlaufsbeobachtungen zur gemeinsamen Evaluation.', 'Eine neu eingezogene Bewohnerin zieht sich zurück. Wie prüfst du, was ihr guttut?', 'Erfrage Vorlieben und Gewohnheiten, vereinbare ein konkretes Angebot und frage anschließend nach ihrem Erleben.', 'SIS –'],
    ['11', 'Kinder, Familien und Übergänge', [4, 10], 'Beziehe das Kind seinem Entwicklungsstand entsprechend ein und kläre mit der Familie, welche Aufgaben sie übernehmen kann. Sichere bei Übergängen Ansprechpartner, Hilfsmittel, Termine und verständliche Informationen. Lass wichtige Schritte in eigenen Worten wiedergeben.', 'Eltern sagen bei der Entlassung, sie hätten alles verstanden. Wie prüfst du das wertschätzend?', 'Bitte sie zu erklären, was sie zu Hause tun und wen sie bei einer Verschlechterung kontaktieren würden.', 'EACH-Charta'],
    ['12', 'Alltagsgestaltung bei Demenz', [9, 11], 'Orientiere dich an Biografie, Tagesrhythmus, vertrauten Tätigkeiten und vorhandenen Fähigkeiten. Beobachte bei Unruhe mögliche Auslöser wie Schmerz, Reizüberflutung oder ungewohnte Abläufe. Plötzliche Veränderungen gehören zeitnah abgeklärt.', 'Ein Bewohner möchte am Abend „zur Arbeit“. Was antwortest du?', 'Greife das Gefühl und die mögliche Bedeutung auf. Frage etwa, ob er sich wegen einer Aufgabe Sorgen macht, und biete Orientierung oder eine vertraute Tätigkeit an.', 'Demenz'],
    ['13', 'Chronische Erkrankung und Mobilität', [7, 9], 'Erfrage, welche Tätigkeit die Person wieder selbst ausführen möchte. Plane Aktivitäten mit ihr und passe Umfang und Pausen an Belastbarkeit und Tagesform an. Kläre, welche Hilfsmittel, Übungen und Unterstützung zu Hause verfügbar sind.', 'Eine Person mit MS möchte selbst zur Toilette gehen, ermüdet aber rasch. Welches Ziel passt?', 'Formuliere ein Teilziel mit Begleitung, Hilfsmittel und vereinbartem Evaluationszeitpunkt. Plane gemeinsam, wie der Weg bei Erschöpfung angepasst wird.', 'Multiple Sklerose'],
    ['14', 'Onkologie, Palliativpflege und Lebensende', [8], 'Erfasse Symptome und individuelle Prioritäten. Frage nach gewünschter Nähe, spirituellen Bedürfnissen und Unterstützung für Angehörige. Kläre Versorgungsziele und Ansprechpartner im Team und überprüfe die Wirkung der vereinbarten Maßnahmen.', 'Angehörige drängen am Lebensende zum Essen. Wie führst du das Gespräch?', 'Erfrage ihre Sorge und den Wunsch der betroffenen Person. Besprich belastungsarme Angebote und das vereinbarte palliative Ziel im Team.', 'Palliative Care'],
    ['15', 'Gesund bleiben im Pflegeberuf', [3, 4], 'Betrachte körperliche, psychische und organisatorische Belastungen gemeinsam. Nutze Hilfsmittel und Teamabsprachen. Bring wiederkehrende Probleme in die Praxisanleitung oder ins Team ein und beziehe bei Bedarf betriebliche Unterstützungsstellen ein.', 'Transfers sind regelmäßig belastend, weil Hilfsmittel fehlen. Was änderst du?', 'Beschreibe konkrete Situationen, kläre sofort sichere Unterstützung und bespreche mit der Leitung, wie passende Hilfsmittel verfügbar werden.', 'Lazarus']
  ],
  [
    ['16', 'Psychiatrische Pflege', [11], 'Gestalte eine verlässliche professionelle Beziehung, arbeite mit erreichbaren Zielen und achte auf Warnzeichen einer Krise. Besprich Schutzbedarf, Belastungen, Ressourcen und Beteiligung im multiprofessionellen Team. Nutze Rückmeldungen der Person zur Evaluation.', 'Eine Person hört bedrohliche Stimmen und wirkt verängstigt. Was sagst du zuerst?', 'Sprich ruhig, erkenne die Angst an und kläre, wie sicher sie sich fühlt. Informiere bei Gefährdung unmittelbar das zuständige Team.', 'Psychose und Schizophrenie'],
    ['17', 'Infektionsschutz und Umwelt', [4, 5], 'Leite Schutzmaßnahmen aus Übertragungsweg, Gefährdung und örtlichem Hygieneplan ab. Erkläre der betroffenen Person, wie sie ihren Alltag möglichst gut fortsetzen kann. Beachte auch Raum, Material, Aufbereitung und Abfallwege.', 'Eine isolierte Person fühlt sich allein. Wie berücksichtigst du beides?', 'Halte die vorgesehenen Schutzmaßnahmen ein, plane verlässliche Kontakte und kläre sichere Besuchs- und Kommunikationsmöglichkeiten.', 'Hygiene, Infektionsprävention'],
    ['18', 'Lebensbedrohliche Lage und Katastrophenschutz', [6], 'Trainiere Ersteinschätzung, Alarmierung und strukturierte Übergabe. Informiere dich im Einsatz über den Alarm- und Einsatzplan, Meldeketten und die eigenen Aufgaben. Bei mehreren Betroffenen sind klare Rollen und Koordination im Team besonders wichtig.', 'Bei einem internen Alarm treffen mehrere Hilferufe gleichzeitig ein. Was klärst du zuerst?', 'Kläre Eigenschutz, Meldeweg und zugewiesene Rolle. Gib Lage und Beobachtungen knapp weiter, damit das zuständige Team priorisieren kann.', 'CABCDE bei Trauma'],
    ['19', 'Rehabilitation im Team', [7], 'Die ICF betrachtet Körperfunktionen, Aktivitäten, Teilhabe und Kontext. Leite aus einer gewünschten Alltagsaktivität ein gemeinsames Ziel ab, trainiere vereinbarte Schritte in der Pflege und gleiche Beobachtungen mit Physio- und Ergotherapie ab.', 'Eine Person will nach dem Schlaganfall wieder selbst frühstücken. Was trägt die Pflege bei?', 'Plane geübte Alltagsschritte mit der Person, kläre Hilfsmittel und prüfe, wie viel Unterstützung sie im Alltag tatsächlich benötigt.', 'ICF –'],
    ['20', 'Ausscheidung, Scham und Pflegequalität', [5, 9], 'Erhebe Ausscheidung und Kontinenz diskret, ohne Annahmen zu Sexualität oder Gewohnheiten. Biete ein geschütztes Gespräch an. Verbinde individuell vereinbarte Maßnahmen mit Standards und prüfe anhand konkreter Ergebnisse, ob sie helfen.', 'Eine Person spricht aus Scham kaum über Harnverlust. Wie beginnst du?', 'Sorge für Privatsphäre, frage nach Erlaubnis und verwende klare, wertfreie Sprache. Erfrage, welche Alltagssituationen sie besonders belasten.', 'Harninkontinenz und Harnverhalt'],
    ['21', 'Kinder und Familien in kritischen Situationen', [8, 10], 'Berücksichtige Entwicklungsstand, Ausdrucksformen und Bezugspersonen. Beobachte Veränderungen im Vergleich zur Ausgangslage. Erkläre Behandlungen altersgerecht und frage auch nach Belastungen von Eltern und Geschwistern.', 'Ein Kind mit schwerer Erkrankung hat Angst vor einer wiederkehrenden Maßnahme. Wie planst du sie?', 'Erfrage, was Angst macht und was früher geholfen hat. Besprich Erklärung, Mitbestimmung und Begleitung und überprüfe anschließend das Erleben.', 'Leukämie und febrile Neutropenie'],
    ['22', 'Digitalisierung, Nachhaltigkeit und Berufsentwicklung', [1, 4], 'Nutze digitale Dokumentation und Assistenz so, dass Datenschutz, Zuständigkeit und die Rückverfolgbarkeit eigener Einträge gewahrt bleiben. Prüfe neue Technik nach Nutzen, Grenzen und Aufwand. Plane Material bedarfsgerecht und berücksichtige die Hygienevorgaben.', 'Die Station möchte einen digitalen Erinnerungsdienst einführen. Was prüfst du vorab?', 'Kläre Ziel, Teilhabe, Datenschutz, Zuständigkeit und Ausfallweg. Vereinbare, woran ihr den Nutzen erkennt.', 'Qualitätsmanagement'],
    ['23', 'Gewalt, Macht und Schutz', [3, 4, 11], 'Erkenne mögliche Warnzeichen und unterscheide Beobachtungen von Vermutungen. Ermögliche ein geschütztes Gespräch und schütze bei unmittelbarer Gefahr die betroffene Person. Dokumentiere sachlich und nutze die zuständigen internen Schutz- und Meldewege.', 'Eine pflegebedürftige Person wirkt in Anwesenheit einer Bezugsperson ängstlich. Was sind deine nächsten Schritte?', 'Biete ein vertrauliches Gespräch an, halte konkrete Beobachtungen fest und bespreche mögliche Gefährdung nach dem Schutzkonzept im zuständigen Team.', 'Pflegeethik'],
    ['24', 'Komplexe Versorgung über Sektorengrenzen', [5, 7, 9], 'Kläre Übergänge zwischen Klinik, Rehabilitation, Langzeitpflege und häuslicher Versorgung frühzeitig. Stimme Pflegeverantwortung, Medikamentenplan, Hilfsmittel, Termine und Kontakte ab. Prüfe, ob die Anschlussversorgung tatsächlich organisiert ist.', 'Am Entlassungstag fehlt ein Hilfsmittel für den sicheren Transfer. Was veranlasst du?', 'Melde den offenen Bedarf, kläre die Zuständigkeit und eine sichere Übergangslösung. Informiere die Person und die weiterbetreuende Stelle über den vereinbarten Plan.', 'Pflegeberatung']
  ]
];

const curriculumSources = [
  ['Hamburger Curriculum und Handreichung (HIBB)', 'https://hibb.hamburg.de/document/hamburger-curriculum-und-handreichung-zur-generalistischen-pflegeausbildung/'],
  ['Rahmenlehrplan (BIBB)', 'https://www.bibb.de/dienst/publikationen/de/16560'],
  ['Rahmenausbildungspläne für die Praxis (BIBB)', 'https://www.bibb.de/dienst/publikationen/de/20123'],
  ['Kompetenzkatalog (Anlage 2 PflAPrV)', 'https://www.gesetze-im-internet.de/pflaprv/anlage_2.html'],
  ['Stunden der Praxiseinsätze (Anlage 7 PflAPrV)', 'https://www.gesetze-im-internet.de/pflaprv/anlage_7.html'],
  ['Praxisanleitung (§ 4 PflAPrV)', 'https://www.gesetze-im-internet.de/pflaprv/__4.html'],
  ['Aufbau der Ausbildung (§ 1 PflAPrV)', 'https://www.gesetze-im-internet.de/pflaprv/__1.html'],
  ['Dauer und Struktur (§ 6 PflBG)', 'https://www.gesetze-im-internet.de/pflbg/__6.html'],
  ['Zwischenprüfung (§ 7 PflAPrV)', 'https://www.gesetze-im-internet.de/pflaprv/__7.html']
];

function renderCurriculum(content) {
  const fields = curriculumYears.map((year, index) => `
    <section class="panel">
      <h3>${index + 1}. Ausbildungsjahr</h3>
      ${year.map(([id, title, units, lesson, exercise, answer, topic]) => {
        const topicIndex = topics.findIndex(([name]) => name.startsWith(topic));
        return `<details id="handlungsfeld-${id}">
          <summary>${id} · ${esc(title)}</summary>
          <p>${esc(lesson)}</p>
          <p class="muted">Passende Einheiten im Rahmenlehrplan: ${units.map(unit => 'CE ' + String(unit).padStart(2, '0')).join(', ')}</p>
          <p><strong>Übung</strong> ${esc(exercise)}</p>
          <details><summary>Lösungsimpuls</summary><p>${esc(answer)}</p></details>
          ${topicIndex < 0 ? '' : `<button class="btn" onclick="openLibraryTopic(${topicIndex})">Vertiefen: ${esc(topics[topicIndex][0])}</button>`}
        </details>`;
      }).join('')}
    </section>`).join('');
  content.innerHTML = `
    <section class="panel">
      <h2>Ausbildungsrahmen Pflegefachkraft</h2>
      <p>Lerne nach Ausbildungsjahr oder ordne dein Thema einer Einheit des Rahmenlehrplans zu. Zu jedem Hamburger Handlungsfeld findest du einen Lernimpuls, eine Fallfrage und passenden Lernstoff.</p>
      <div class="flex"><button class="btn" onclick="go('themen')">Lernstoff öffnen</button><button class="btn" onclick="go('pruefungsformat')">Staatliche Prüfung</button></div>
    </section>
    <section class="panel">
      <h3>Aufbau und Praxiseinsätze</h3>
      <p>Die Ausbildung dauert in Vollzeit drei Jahre und in Teilzeit höchstens fünf Jahre. Sie umfasst mindestens 2.100 Stunden Unterricht und 2.500 Stunden praktische Ausbildung.</p>
      <ul>
        <li><strong>Erstes und zweites Ausbildungsdrittel:</strong> 400 Stunden Orientierung beim Träger, je 400 Stunden in stationärer Akutpflege, stationärer Langzeitpflege und ambulanter Akut- oder Langzeitpflege sowie 120 Stunden Pädiatrie.</li>
        <li><strong>Letztes Ausbildungsdrittel:</strong> 120 Stunden Psychiatrie, 500 Stunden im Vertiefungseinsatz, 80 Stunden in einem weiteren Einsatz und 80 Stunden zur freien Verteilung nach Anlage 7.</li>
      </ul>
      <p>Bis Ende 2024 galt für den pädiatrischen Einsatz eine Übergangsregelung von 60 bis 120 Stunden. Freie Stunden erhöhten den Orientierungseinsatz. Maßgeblich für die persönliche Planung ist der eigene Ausbildungsplan.</p>
      <p>Für jeden Einsatz sind mindestens 10 Prozent geplante und strukturierte Praxisanleitung vorgesehen. Besprich deine Lernziele zu Einsatzbeginn, dokumentiere den Verlauf im Ausbildungsnachweis und reflektiere den Stand mit der Praxisanleitung.</p>
      <p>Die Zwischenprüfung ermittelt den Ausbildungsstand am Ende des zweiten Ausbildungsdrittels. Die staatliche Abschlussprüfung hat einen schriftlichen, einen mündlichen und einen praktischen Teil.</p>
    </section>
    ${fields}
    <section class="panel">
      <h3>Bundesweiter Rahmenlehrplan und Prüfungskompetenzen</h3>
      <ol>${curriculumUnits.map((unit, index) => {
        const relatedFields = curriculumYears.flat().filter(field => field[2].includes(index + 1));
        return `<li><details><summary>${esc(unit)}</summary><ul>${relatedFields.map(([id, title]) =>
          `<li><a href="#handlungsfeld-${id}" onclick="openCurriculumField(event, '${id}')">${esc(title)}</a></li>`
        ).join('')}</ul></details></li>`;
      }).join('')}</ol>
      <ul>
        <li>I · Pflegeprozess und Pflegediagnostik</li>
        <li>II · Kommunikation und Beratung</li>
        <li>III · Zusammenarbeit im Pflegeteam und mit anderen Berufsgruppen</li>
        <li>IV · Recht, Ethik, Qualität und Versorgungssystem</li>
        <li>V · Pflegewissenschaft und berufliche Entwicklung</li>
      </ul>
      <button class="btn" onclick="go('kompetenz')">Kompetenzbereiche trainieren</button>
    </section>
    <section class="panel"><h3>Offizielle Grundlagen</h3>
      <ul>${curriculumSources.map(([label, url]) => `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${esc(label)}</a></li>`).join('')}</ul>
    </section>`;
}

function openCurriculumField(event, id) {
  event.preventDefault();
  const field = document.getElementById('handlungsfeld-' + id);
  field.open = true;
  field.querySelector('summary').focus({preventScroll: true});
  field.scrollIntoView({block: 'start'});
}
