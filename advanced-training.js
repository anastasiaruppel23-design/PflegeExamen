/* Fictional training material for priority decisions and case-based quiz practice. */
(function () {
  const quiz = (id, area, q, a, choices) => {
    return {id: 'advanced-'+id, area, q, options: choices.map(([option]) => option),
      answer: a, explain: choices[a][1], feedback: choices.map(([,reason]) => reason)};
  };
  window.advancedQuizQuestions = [
    quiz('delegation', 'Pflegeprozess und Berufsrolle', 'Bei Frau D. hat sich die Mobilität nach einem Sturz verändert. Was kann die Pflegefachperson einer eingewiesenen Assistenzkraft übertragen?', 1, [
      ['Den neuen individuellen Pflegebedarf eigenständig erheben und festlegen.', 'Die Feststellung des individuellen Pflegebedarfs gehört zu den vorbehaltenen Aufgaben.'],
      ['Geplante Unterstützung leisten und konkrete Beobachtungen zur Mobilität zurückmelden.', 'Durchführung und Beobachtung können bei passender Qualifikation und Zuständigkeit übertragen werden. Steuerung und Evaluation bleiben Aufgabe der Pflegefachperson.'],
      ['Die Wirksamkeit der bisherigen Pflegeplanung eigenständig beurteilen und Ziele anpassen.', 'Evaluation und Steuerung des Pflegeprozesses gehören zu den vorbehaltenen Aufgaben.'],
      ['Den notwendigen Umfang der Mobilitätsförderung eigenständig neu festlegen.', 'Die Neufestlegung gehört zur Pflegeplanung und setzt die fachliche Bedarfserhebung voraus.']
    ]),
    quiz('ziel', 'Pflegeprozess und Berufsrolle', 'Herr M. möchte nach einer Hüftoperation wieder allein zur Toilette gehen. Aktuell kann er mit Rollator und einer Person aufstehen. Welches Zwischenziel ist am besten überprüfbar?', 2, [
      ['Herr M. trainiert zweimal täglich den Transfer mit Rollator und Begleitung.', 'Das ist eine konkrete Maßnahme. Sie beschreibt, was geübt wird, nicht das angestrebte Ergebnis.'],
      ['Herr M. gewinnt bis zur Entlassung mehr Selbstständigkeit im Alltag.', 'Die Richtung passt zu seinem Wunsch. Der beobachtbare Zielzustand ist noch zu ungenau.'],
      ['Herr M. bewältigt bis Freitag den Transfer zur Toilette mit Rollator und höchstens einer verbalen Anleitung.', 'Der Zielzustand ist beobachtbar, zeitlich begrenzt und auf seinen Wunsch bezogen. Ob er erreichbar ist, wird gemeinsam eingeschätzt.'],
      ['Herr M. kann am Entlassungstag die Regeln für einen sicheren Transfer erklären.', 'Das ist messbar, erfasst aber Wissen statt der angestrebten Mobilität beim Toilettengang.']
    ]),
    quiz('eval', 'Pflegeprozess und Berufsrolle', 'Das Ziel lautete: vom Bett in den Stuhl mit verbaler Anleitung. Am dritten Tag benötigt die Person wieder körperliche Hilfe und berichtet über neuen Schwindel. Was ist der nächste Schritt im Pflegeprozess?', 0, [
      ['Zielerreichung und neue Beobachtungen erfassen, die Veränderung abklären und die Planung anpassen.', 'Die Evaluation vergleicht das Ergebnis mit dem Ziel und berücksichtigt neue Risiken, bevor weiter geplant wird.'],
      ['Die bisherige Maßnahme fortführen und nur die Dauer bis zur nächsten Überprüfung verlängern.', 'Damit bleibt die neue Ursache unberücksichtigt. Der neue Schwindel erfordert eine erneute Einschätzung.'],
      ['Das Ziel sofort auf vollständige Hilfe umstellen und die Beobachtung später nachtragen.', 'Eine Anpassung kann nötig sein. Sie braucht die erneute Einschätzung als Grundlage.'],
      ['Nur die geleistete Hilfe dokumentieren und die ursprüngliche Einstufung beibehalten.', 'Durchführungsdokumentation allein bewertet die Wirkung und die veränderten Voraussetzungen nicht.']
    ]),
    quiz('donabedian', 'Qualität und Kommunikation', 'Eine Station führt eine verbindliche Übergabestruktur ein. Vier Wochen später wird ausgewertet, ob bei Übergaben aktuelle Risiken und offene Aufträge tatsächlich besprochen wurden. Welche Qualitätsdimension wird gemessen?', 1, [
      ['Strukturqualität, weil ein verbindlicher Ablauf zur Verfügung steht.', 'Das Vorhandensein der Vorlage wäre Strukturqualität. Hier wird ihre Anwendung gemessen.'],
      ['Prozessqualität, weil das tatsächliche Vorgehen bei der Übergabe geprüft wird.', 'Gemessen wird die Durchführung der Übergabe. Das ist ein Prozessmerkmal.'],
      ['Ergebnisqualität, weil die Auswertung nach vier Wochen stattfindet.', 'Der Zeitpunkt macht die Messung nicht zu Ergebnisqualität. Ein Ergebnis wäre etwa die Veränderung übersehener Aufträge.'],
      ['Ergebnisqualität, weil Informationen am Ende der Übergabe vollständig sein sollen.', 'Hier wird beobachtet, welche Inhalte im Ablauf angesprochen wurden. Eine klinische oder organisatorische Folge wird nicht gemessen.']
    ]),
    quiz('sbar', 'Qualität und Kommunikation', 'Du meldest eine akute Verschlechterung nach SBAR. Vorgeschichte, neue Befunde und deine Einschätzung hast du bereits genannt. Was gehört jetzt zu R?', 3, [
      ['Den präzisen Beginn der Veränderung wiederholen.', 'Der Zeitpunkt ergänzt die Situation beziehungsweise den Verlauf. Er enthält noch keine konkrete Bitte.'],
      ['Die relevanten Vorerkrankungen aus der Akte nachtragen.', 'Die Vorerkrankungen gehören zum Hintergrund.'],
      ['Den Abfall des Blutdrucks mit deiner Einschätzung verknüpfen.', 'Diese Einordnung gehört zu Assessment.'],
      ['Um sofortige Beurteilung vor Ort bitten und das weitere Vorgehen abstimmen.', 'Recommendation benennt klar, welche Hilfe oder Entscheidung du jetzt brauchst.']
    ]),
    quiz('orem', 'Modelle und Falltransfer', 'Eine Patientin kann die Schritte der Versorgung ihres Stomas durchführen, traut sich aber den Wechsel allein noch nicht zu. Sie möchte es mit Anleitung versuchen. Welches Pflegesystem nach Orem passt am besten?', 2, [
      ['Vollständig kompensatorisch, weil die Fachperson die Verantwortung für die Anleitung trägt.', 'Die Patientin kann die Handlung selbst ausführen. Eine vollständige Übernahme würde ihre Ressourcen unterschätzen.'],
      ['Teilweise kompensatorisch, weil die Fachperson im Raum bleibt.', 'Anwesenheit allein ist keine Teilübernahme. Entscheidend ist, wer die Handlung ausführt.'],
      ['Unterstützend-erzieherisch, weil sie selbst handelt und Anleitung sowie Rückmeldung erhält.', 'Das System passt zu vorhandenen praktischen Fähigkeiten bei Lern- und Unterstützungsbedarf.'],
      ['Teilweise kompensatorisch, weil Ermutigung einen Teil der praktischen Versorgung ersetzt.', 'Ermutigung unterstützt die Selbstpflege. Die Fachperson übernimmt dabei keinen Handlungsschritt.']
    ]),
    quiz('lazarus', 'Modelle und Falltransfer', 'Ein Patient erlebt die geplante Entlassung zunächst als Bedrohung. Anschließend überlegt er, ob Familie, Pflegedienst und eigene Fähigkeiten für den Alltag ausreichen. Was beschreibt der zweite Schritt nach Lazarus?', 1, [
      ['Primäre Bewertung, weil es um die Bedeutung der Entlassung geht.', 'Die Bedeutung als Bedrohung wurde bereits bewertet.'],
      ['Sekundäre Bewertung, weil er seine Ressourcen und Handlungsmöglichkeiten einschätzt.', 'Der Patient prüft, was ihm zur Bewältigung zur Verfügung steht.'],
      ['Problemorientiertes Coping, weil er bereits einen Pflegedienst organisiert hat.', 'Er bewertet erst seine Möglichkeiten. Eine konkrete Organisation ist im Fall noch nicht erfolgt.'],
      ['Neubewertung, weil er seine Einschätzung nach einer erfolgreichen Versorgung ändert.', 'Eine neue Erfahrung oder veränderte Bewertung ist bisher nicht beschrieben.']
    ]),
    quiz('antonovsky', 'Modelle und Falltransfer', 'Eine Patientin versteht, warum sie nach der Reha täglich üben soll, und möchte wieder mit ihrer Tochter spazieren. Sie sagt aber, zu Hause habe sie niemanden, der ihr beim Üben hilft. Welche Komponente solltest du besonders stärken?', 0, [
      ['Handhabbarkeit, indem ihr erreichbare Unterstützung und Hilfsmittel für zu Hause organisiert.', 'Sie versteht den Zweck und erlebt das Ziel als sinnvoll. Ihr fehlen verfügbare Mittel zur Umsetzung.'],
      ['Verstehbarkeit, indem du ihr den gesamten Reha-Plan noch einmal erklärst.', 'Der Zweck des Übens ist bereits nachvollziehbar. Eine weitere Erklärung löst das fehlende Unterstützungsangebot nicht.'],
      ['Sinnhaftigkeit, indem du mit ihr ein anderes persönliches Ziel suchst.', 'Der Spaziergang mit der Tochter ist bereits ein persönlicher Grund zum Üben.'],
      ['Verstehbarkeit, indem du den Ablauf schriftlich dokumentierst.', 'Ein schriftlicher Ablauf kann helfen. Im Fall benennt sie vor allem ein Problem mit den verfügbaren Ressourcen.']
    ]),
    ...window.emergencyDecisions.slice(2).map((entry, i) => ({
      id: 'advanced-emergency-'+i, area: 'Notfälle und Prioritäten',
      q: entry.story+' '+entry.steps[0].scene+' '+entry.steps[0].q, options: entry.steps[0].opts,
      answer: entry.steps[0].a, explain: entry.steps[0].why, feedback: entry.steps[0].responses, source: entry.source
    }))
  ];
  window.advancedQuizQuestions[0].source = ['§ 4 PflBG · Vorbehaltene Aufgaben', 'https://www.gesetze-im-internet.de/pflbg/__4.html'];
})();
