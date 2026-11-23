/* Fictional training material for priority decisions and case-based quiz practice. */
(function () {
  const sources = {
    emergency: ['gesund.bund.de · Nummern für den Notfall', 'https://gesund.bund.de/notfallnummern'],
    stroke: ['gesund.bund.de · Schlaganfall', 'https://gesund.bund.de/schlaganfall'],
    heart: ['gesund.bund.de · Herzinfarkt', 'https://gesund.bund.de/herzinfarkt'],
    delirium: ['AWMF · Delir im höheren Lebensalter', 'https://www.awmf.org/aktuelles/awmf-aktuell/delir-im-hoeheren-lebensalter-eine-transsektoral-umsetzbare-interdisziplinaer-interprofessionelle-leitlinie-zu-delir-praevention-diagnostik-und-therapie-beim-alten-menschen-2'],
    suicide: ['NVL Unipolare Depression · Umgang mit Suizidalität', 'https://register.awmf.org/assets/guidelines/nvl-005l_S3_Unipolare-Depression_2023-07.pdf'],
    glucose: ['diabinfo · Diabetes-Notfall', 'https://www.diabinfo.de/leben/behandlung/im-notfall.html'],
    sepsis: ['gesund.bund.de · Sepsis', 'https://gesund.bund.de/sepsis'],
    trauma: ['NICE · Head injury', 'https://www.nice.org.uk/guidance/ng232/chapter/recommendations'],
    law: ['§ 4 PflBG · Vorbehaltene Aufgaben', 'https://www.gesetze-im-internet.de/pflbg/__4.html']
  };
  const step = (q, a, choices) => ({
    q, a, opts: choices.map(([label]) => label),
    responses: choices.map(([, consequence]) => consequence),
    why: choices[a][1]
  });
  window.extraEmergencyCases = [
    {
      title: 'Plötzliche Sprachstörung beim Frühstück', setting: 'Langzeitpflege', source: sources.stroke,
      story: 'Frau A. setzt beim Frühstück plötzlich die Tasse ab. Ein Mundwinkel hängt, ihr rechter Arm sinkt ab, und sie findet keine verständlichen Worte. Vor wenigen Minuten hat sie noch mit dir gesprochen.',
      steps: [
        step('Welche Handlung hat zuerst Vorrang?', 1, [
          ['Erst den Blutzucker messen und das Ergebnis für die Entscheidung abwarten.', 'Der Wert kann bei der Abklärung helfen. Wenn er vor der Alarmierung abgewartet wird, verzögert sich die Versorgung bei Schlaganfallverdacht.'],
          ['Sofort den Rettungsdienst alarmieren lassen, bei ihr bleiben und den Zeitpunkt festhalten.', 'Das Team kann den Verdacht früh weitergeben. Der Zeitpunkt, zu dem sie zuletzt sicher ohne Symptome war, hilft bei der weiteren Beurteilung.'],
          ['Sie nach der Erklärung für die Beschwerden fragen und zunächst den Verlauf beobachten.', 'Auch wenn sich die Sprache bessert, bleibt die plötzliche Lähmung ein Warnsignal. Beobachten allein kostet Zeit.']
        ]),
        step('Die Worte werden wieder klarer. Was meldest du?', 0, [
          ['Beginn, letzte unauffällige Beobachtung und alle Ausfälle samt Besserung.', 'Der Rettungsdienst erhält den gesamten Verlauf. Die Alarmierung bleibt auch bei Besserung bestehen.'],
          ['Den aktuellen Sprachbefund und die Vorerkrankungen, ohne den anfänglichen Ausfall zu erwähnen.', 'Dadurch fehlt ein entscheidender Teil des Verlaufs. Die anfänglichen Ausfälle bleiben relevant.'],
          ['Die Besserung melden und die Abklärung auf die nächste Visite verschieben.', 'Vorübergehende Beschwerden ändern die Dringlichkeit nicht.']
        ])
      ]
    },
    {
      title: 'Übelkeit, kalter Schweiß und Druck im Oberbauch', setting: 'Krankenhaus', source: sources.heart,
      story: 'Frau S., 69 Jahre, entwickelt plötzlich Übelkeit, Luftnot und Druck im Oberbauch. Sie schwitzt kalt und wirkt blass. Sie hat Diabetes und kann keinen klaren Brustschmerz angeben.',
      steps: [
        step('Wie reagierst du auf diese Kombination?', 2, [
          ['Erst eine gastrointestinale Ursache abklären und dann über die Alarmierung entscheiden.', 'Die Beschwerden können auch von einem akuten Herzproblem kommen. Eine vorgeschaltete Abklärung kann die Versorgung verzögern.'],
          ['Den Blutzucker prüfen und ohne weitere Information zunächst den Verlauf beobachten.', 'Die Messung ist ergänzend sinnvoll, erklärt die Warnzeichen aber nicht zuverlässig.'],
          ['Akutes Herzproblem melden, internen Notfallweg auslösen und engmaschig beobachten.', 'Die Alarmierung ermöglicht rasche Beurteilung, auch wenn klassischer Brustschmerz fehlt.']
        ]),
        step('Welche Übergabe ist am aussagekräftigsten?', 0, [
          ['Plötzlichen Beginn, Beschwerden, Verlauf, Diabetes und bereits verfügbare Vitalwerte nennen.', 'Begleitsymptome, Zeitverlauf und Befunde helfen der Notfallversorgung.'],
          ['Vor allem Diabetes und das letzte Essen berichten.', 'Der zeitliche Beginn und die zusammen auftretenden Warnzeichen fehlen.'],
          ['Nur „Bauchschmerzen“ melden und die übrigen Informationen später dokumentieren.', 'Atemnot und kalter Schweiß können so bei der Einschätzung untergehen.']
        ])
      ]
    },
    {
      title: 'Atemnot nach dem Gang zur Toilette', setting: 'Krankenhaus', source: sources.emergency,
      story: 'Nach dem Toilettengang bekommt Herr W. plötzlich sehr starke Atemnot. Er kann kaum sprechen. Seine Atemarbeit nimmt sichtbar zu, und er wirkt zunehmend erschöpft.',
      steps: [
        step('Was organisierst du unmittelbar?', 1, [
          ['Alle verfügbaren Vitalwerte vollständig erheben, dann den Notfallruf auslösen.', 'Die Verschlechterung ist schon klinisch erkennbar. Messwerte dürfen die Alarmierung nicht verzögern.'],
          ['Das Notfallteam alarmieren lassen, beim Patienten bleiben und Atmung und Bewusstsein fortlaufend beurteilen.', 'Hilfe ist unterwegs, während du eine weitere Verschlechterung erkennen und sofort melden kannst.'],
          ['Zuerst die Akte nach einem früheren Atemnot-Ereignis durchsuchen.', 'Frühere Verläufe helfen später. Die aktuelle schwere Atemnot braucht sofortige Aufmerksamkeit.']
        ]),
        step('Die gemessene Sättigung wirkt überraschend unauffällig, er bleibt aber schwer beeinträchtigt. Was tust du?', 2, [
          ['Die Dringlichkeit anhand der Sättigung herabstufen.', 'Ein einzelner Messwert bildet Atemarbeit und Erschöpfung nicht zuverlässig ab.'],
          ['Nur das Pulsoximeter wechseln und bis zum neuen Wert abwarten.', 'Die Messung kann kontrolliert werden. Das Beobachten und Weitergeben des klinischen Zustands geht parallel weiter.'],
          ['Alarmierung aufrechterhalten und den auffälligen klinischen Eindruck sowie den Messwert weitergeben.', 'Das Team kann einen widersprüchlichen Messbefund im Gesamtbild beurteilen.']
        ])
      ]
    },
    {
      title: 'Ungewöhnlich still nach der Operation', setting: 'Krankenhaus', source: sources.delirium,
      story: 'Frau F., 83 Jahre, konnte sich gestern normal unterhalten. Heute antwortet sie einsilbig, verliert den Gesprächsfaden und schläft während des Gesprächs immer wieder ein. Ihr Sohn sagt, so sei sie sonst nicht.',
      steps: [
        step('Was machst du mit dieser Beobachtung?', 2, [
          ['Das Gespräch in der nächsten Schicht wiederholen und bis dahin Ruhe ermöglichen.', 'Schläfrigkeit kann ein Warnzeichen sein. Abwarten verzögert die Untersuchung einer akuten Veränderung.'],
          ['Den Befund als mögliche chronische Gedächtnisstörung in die Pflegeplanung aufnehmen.', 'Die akute Abweichung vom Ausgangszustand wird dadurch unterschätzt.'],
          ['Die akute Veränderung umgehend melden, strukturiert beurteilen und an ein hypoaktives Delir denken.', 'Auch eine ruhige, schläfrige Veränderung kann ein Delir oder eine andere akute Ursache anzeigen.']
        ]),
        step('Welche Information unterstützt die Einschätzung besonders?', 1, [
          ['Nur der Demenzstatus aus dem Aufnahmebogen.', 'Eine vorbestehende Demenz erklärt keinen plötzlichen Wechsel des Aufmerksamkeitsniveaus.'],
          ['Der Vergleich mit gestern, Schwankungen, aktuelle Vitalwerte und mögliche Auslöser.', 'Beginn, Verlauf und Kontext helfen dem Team, Gefährdungen und behandelbare Ursachen zu erkennen.'],
          ['Vor allem die Erinnerung an frühere Operationen.', 'Die aktuelle Veränderung und der Ausgangszustand sind für die Erstbeurteilung wichtiger.']
        ])
      ]
    },
    {
      title: 'Eine Bewohnerin äußert akute Suizidgedanken', setting: 'Langzeitpflege', source: sources.suicide,
      story: 'Frau L. sagt im Abenddienst, sie wolle nicht mehr leben und befürchte, sich heute etwas anzutun. Sie bittet dich, niemandem davon zu erzählen.',
      steps: [
        step('Wie antwortest du und was leitest du ein?', 0, [
          ['Ruhig und direkt nach der akuten Gefahr fragen, bei ihr bleiben und sofort Hilfe hinzuziehen.', 'Du nimmst die Äußerung ernst, hältst den Kontakt und organisierst unverzüglich fachliche Unterstützung.'],
          ['Zunächst Vertraulichkeit versprechen und ein Gespräch für morgen vereinbaren.', 'Akute Gefahr braucht jetzt Unterstützung. Ein Geheimhaltungsversprechen erschwert den notwendigen Schutz.'],
          ['Die Sorgen schriftlich festhalten und sie zur Beruhigung kurz allein lassen.', 'Dokumentation hilft bei der Übergabe. Sie ersetzt in dieser akuten Situation weder die Begleitung noch die Alarmierung.']
        ]),
        step('Was gibst du an das zuständige Team weiter?', 2, [
          ['Ausschließlich, dass Frau L. überfordert wirkt.', 'Die konkrete Aussage und die Dringlichkeit fehlen.'],
          ['Die Vermutung einer Depression und ihre bisherigen Medikamente.', 'Eine Diagnosevermutung ersetzt keine klare Meldung der aktuellen Gefahr.'],
          ['Die konkreten Äußerungen, den Zeitpunkt, deine Beobachtungen und den bereits organisierten Schutz.', 'Das Team kann die akute Lage einordnen und die weitere Begleitung unmittelbar übernehmen.']
        ])
      ]
    },
    {
      title: 'Erstversorgung nach einem vermuteten Suizidversuch', setting: 'Krankenhaus', source: sources.suicide,
      story: 'Eine Begleitperson ruft dich zu Herrn D. und berichtet von einem möglichen Suizidversuch. Er antwortet nur verzögert und wirkt zunehmend benommen. Der Ablauf ist noch unklar.',
      steps: [
        step('Womit beginnst du?', 1, [
          ['Zuerst mit ihm den genauen Ablauf besprechen und danach über Hilfe entscheiden.', 'Die Benommenheit kann eine akute körperliche Gefährdung anzeigen. Fragen können die sofortige Hilfe verzögern.'],
          ['Internen Notruf auslösen, Atmung und Bewusstsein beurteilen und nach Notfallstandard handeln.', 'Die körperliche Stabilisierung hat Vorrang. Parallel kann das Team relevante Informationen zusammentragen.'],
          ['Ihn in einen ruhigen Raum bringen und zunächst zur Ruhe kommen lassen.', 'Ein Transport ohne nötige Ersteinschätzung kann die Versorgung verzögern.']
        ]),
        step('Das Notfallteam übernimmt die Erstversorgung. Was bleibt für die Übergabe wichtig?', 0, [
          ['Beobachtungen und Fremdbericht unterscheiden sowie sichere Begleitung und psychiatrische Beurteilung mit dem Team klären.', 'So bleiben sowohl der körperliche Verlauf als auch die weitere Sicherheit im Blick.'],
          ['Nur den berichteten Versuch nennen und die beobachtete Benommenheit auslassen.', 'Dadurch fehlt ein wesentlicher Hinweis auf die körperliche Gefährdung.'],
          ['Nach körperlicher Stabilisierung die Begleitung ohne Rücksprache beenden.', 'Die weitere Beurteilung und das Maß an Begleitung müssen im Team abgestimmt werden.']
        ])
      ]
    },
    {
      title: 'Unterzuckerung mit eingeschränktem Bewusstsein', setting: 'Langzeitpflege', source: sources.glucose,
      story: 'Ein Bewohner mit Diabetes schwitzt, ist kaum weckbar und kann auf Aufforderung nicht sicher schlucken. Das Messgerät zeigt einen deutlich zu niedrigen Blutzucker.',
      steps: [
        step('Was tust du zuerst?', 2, [
          ['Ein süßes Getränk anbieten und beim Trinken unterstützen.', 'Bei unsicherem Schlucken kann Flüssigkeit in die Atemwege gelangen.'],
          ['Den Blutzucker nach kurzer Wartezeit erneut messen und erst dann Hilfe rufen.', 'Die eingeschränkte Wachheit mit niedrigem Messwert erfordert sofortige Hilfe.'],
          ['Hilfe alarmieren, Atmung und Bewusstsein beurteilen und nichts oral geben.', 'Die sichere Versorgung erfolgt nach Notfallplan. Der Bewohner darf in diesem Zustand nichts schlucken müssen.']
        ]),
        step('Was meldest du zur Übernahme?', 1, [
          ['Nur die Diabetesdiagnose und den Namen des Medikaments.', 'Wachheit, Messwert und zeitlicher Verlauf fehlen.'],
          ['Messwert und Messzeit, Bewusstseinsverlauf und verfügbare Angaben zu Mahlzeit und Medikation.', 'Das Team erhält konkrete Anhaltspunkte, ohne dass die Alarmierung für die Recherche verzögert wurde.'],
          ['Den zuletzt dokumentierten Normalwert und das übliche Essverhalten.', 'Die aktuellen Beobachtungen und deren Verlauf sind für die Dringlichkeit wichtiger.']
        ])
      ]
    },
    {
      title: 'Infekt mit neuer Verwirrtheit und Kreislaufzeichen', setting: 'Krankenhaus', source: sources.sepsis,
      story: 'Ein Patient mit bekanntem Infekt atmet plötzlich schneller, ist neu verwirrt und hat einen deutlich niedrigeren Blutdruck als zuvor. Die Auszubildende neben dir möchte erst die nächste Temperaturmessung abwarten.',
      steps: [
        step('Was ist die Priorität?', 1, [
          ['Erst die Temperatur kontrollieren und nur bei Fieber eskalieren.', 'Auch ohne gemessenes Fieber können Kreislaufzeichen und neue Verwirrtheit auf eine ernste Verschlechterung hinweisen.'],
          ['Akute Verschlechterung und Sepsisverdacht melden, Notfallweg auslösen und strukturiert beurteilen.', 'Die Kombination kann auf eine akute Organdysfunktion hinweisen. Eine rasche Abklärung ist nötig.'],
          ['Den bisherigen Pflegeplan abarbeiten und den Befund bei der Übergabe erwähnen.', 'Die Versorgung wird verzögert, obwohl sich mehrere Warnzeichen gleichzeitig entwickeln.']
        ]),
        step('Welche Formulierung hilft bei der Übergabe am meisten?', 2, [
          ['„Der Patient hat einen Infekt und wirkt unruhig.“', 'Damit fehlen die Änderung gegenüber vorher und die Kreislauf- und Atemzeichen.'],
          ['„Verdacht auf Sepsis“, anschließend das Gespräch beenden.', 'Der Verdacht ist relevant. Konkrete Beobachtungen und Messwerte erklären, wie dringlich die Lage ist.'],
          ['„Bei bekanntem Infekt sind seit eben Atemfrequenz und Verwirrtheit neu, der Blutdruck ist deutlich gefallen.“', 'Das beschreibt den zeitlichen Zusammenhang und die objektivierbaren Warnzeichen.']
        ])
      ]
    },
    {
      title: 'Sturz mit Kopfaufprall unter Blutverdünnung', setting: 'Langzeitpflege', source: sources.trauma,
      story: 'Herr G. liegt nach einem beobachteten Sturz am Boden. Der Kopf ist aufgeschlagen. Er erhält ein gerinnungshemmendes Medikament und wird während des Gesprächs schläfriger.',
      steps: [
        step('Was tust du unmittelbar?', 0, [
          ['Notruf veranlassen, bei ihm bleiben, Atmung und Bewusstsein prüfen und unnötige Bewegung vermeiden.', 'Die zunehmende Schläfrigkeit nach Kopfaufprall erfordert eine sofortige Notfallbeurteilung.'],
          ['Ihn mit Unterstützung erst ins Bett bringen und dort erneut nachsehen.', 'Der Transfer kann die Beurteilung verzögern und ist bei möglicher Verletzung ohne Einschätzung riskant.'],
          ['Zuerst den Sturzbericht schreiben und die Angehörigen informieren.', 'Beides folgt auf Alarmierung und unmittelbare Versorgung.']
        ]),
        step('Was ist bei der Übergabe besonders wichtig?', 2, [
          ['Zimmernummer und bisherige Sturzprophylaxe.', 'Diese Informationen erklären die akute Veränderung und das Blutungsrisiko nicht.'],
          ['Nur die sichtbare Wunde am Kopf beschreiben.', 'Auch Bewusstseinsverlauf und Gerinnungshemmung sind wichtig.'],
          ['Aufprall, Zeitpunkt, zunehmende Schläfrigkeit, Beobachtungen und bekannte Gerinnungshemmung mitteilen.', 'Diese Angaben unterstützen die Einschätzung einer möglichen inneren Kopfverletzung.']
        ])
      ]
    }
  ];

  const quiz = (id, area, q, a, choices) => {
    const entry = step(q, a, choices);
    return {id: 'advanced-'+id, area, q, options: entry.opts, answer: a, explain: entry.why, feedback: entry.responses};
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
    ...window.extraEmergencyCases.map((entry, i) => ({
      id: 'advanced-emergency-'+i, area: 'Notfälle und Prioritäten',
      q: entry.story+' '+entry.steps[0].q, options: entry.steps[0].opts,
      answer: entry.steps[0].a, explain: entry.steps[0].why, feedback: entry.steps[0].responses, source: entry.source
    }))
  ];
  window.advancedQuizQuestions[0].source = sources.law;
})();
