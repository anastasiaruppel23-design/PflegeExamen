/* Fiktive Notfallfälle. Die nächste Szene gibt den weiteren Fallverlauf vor. */
(() => {
  const d = (phase, scene, q, a, choices) => ({
    phase, scene, q, a, opts: choices.map(([option]) => option),
    responses: choices.map(([,reason]) => reason), why: choices[a][1]
  });
  const abcde = ['Resuscitation Council UK · ABCDE-Einschätzung', 'https://www.resus.org.uk/library/abcde-approach'];
  const grc = ['Deutscher Rat für Wiederbelebung · Leitlinien 2025', 'https://www.grc-org.de/wissenschaft/leitlinien'];
  const delir = ['AWMF · S3-Leitlinie Delir im höheren Lebensalter', 'https://register.awmf.org/de/leitlinien/detail/109-001'];
  const suicide = ['NVL · Management bei Suizidalität und anderen Notfallsituationen', 'https://www.leitlinien.de/themen/depression/version-3/kapitel-12'];
  window.emergencyDecisions = [
    {title:'Plötzliche Atemnot im Pflegeheim', setting:'Langzeitpflege', source:grc,
      story:'Frau B., 81 Jahre, sitzt plötzlich nach vorn gebeugt auf der Bettkante und kann nur einzelne Worte sprechen. Eine Kollegin kommt gerade dazu. Die Auszubildende weiß noch nicht, ob der Inhalator am Bett für Frau B. verordnet ist.',
      steps:[
      d('Erstreaktion','Frau B. kann sich noch selbst in der Sitzposition halten. Die Atemnot ist neu und ausgeprägt.','Wie teilt ihr die ersten Aufgaben auf?',1,[
        ['Eine Person misst Atemfrequenz und Sättigung, die andere wartet mit dem Alarmruf auf die Werte.','Die Werte helfen bei der Übergabe. Die schwere Atemnot reicht bereits zur sofortigen Alarmierung.'],
        ['Eine Person veranlasst sofort den Notruf nach Alarmplan, die andere bleibt und beurteilt Atmung und Wachheit.','Hilfe und Erstbeurteilung beginnen parallel. Die sichtbare Atemarbeit zeigt auch ohne Geräte eine hohe Dringlichkeit.'],
        ['Eine Person klärt die Verordnung, die andere begleitet Frau B. und löst den Notruf bei weiterer Verschlechterung aus.','Die Verordnung wird später wichtig. Auf zusätzliche Zeichen zu warten verschiebt hier den Notruf.']
      ]),
      d('Position','Der Notruf ist ausgelöst. Frau B. möchte nach vorn gebeugt sitzen bleiben. Sie ist wach und im Sitzen stabil.','Welche Unterstützung passt jetzt?',2,[
        ['Sie mit Hilfe unmittelbar ins Bett verlagern, um später leichter handeln zu können.','Die Verlagerung kostet Kraft und ist bei stabiler, selbst gewählter Position aktuell nicht erforderlich.'],
        ['Den Oberkörper an die Rückenlehne zurückführen, damit die Messung ruhiger wird.','Die Messung ist ergänzend. Eine Positionsänderung allein für den Messwert kann ihr die Atmung erschweren.'],
        ['Ihre atemerleichternde Position sichern und die weitere Atmung beobachten.','Bei wacher, stabil sitzender Person kann die bevorzugte atemerleichternde Position unterstützt werden. Neue Instabilität erfordert eine erneute Einschätzung.']
      ]),
      d('Verordnung klären','Die Kollegin kann nach der Alarmierung in den Medikamentenplan schauen. Frau B. zeigt auf den Inhalator.','Was ist für die Entscheidung zur Anwendung nötig?',0,[
        ['Den Inhalator der Person und dem aktuellen Notfallplan zuordnen und Hilfe nach eigener Zuständigkeit organisieren.','Medikament und sichere Anwendung müssen geklärt sein. Der laufende Notfallweg bleibt aktiv.'],
        ['Das beschriftete Präparat bereitlegen und allein aufgrund der Beschriftung zur Anwendung freigeben.','Die Beschriftung klärt die Zuordnung möglicherweise. Sie ersetzt keine Prüfung der Verordnung und konkreten Anwendung.'],
        ['Die bisher übliche Anwendung aus der Erinnerung übernehmen und die Verordnung danach vergleichen.','Die Erinnerung ist ein Hinweis. Bei unklarer Anordnung ist sie keine verlässliche Grundlage.']
      ]),
      d('Verlauf erkennen','Frau B. wird stiller. Die zuvor sehr angestrengte Atmung wirkt flacher, ihre Antworten werden verzögert.','Wie wertest du den Wechsel?',2,[
        ['Als Erleichterung nach Beruhigung dokumentieren und bei unverändertem Messwert abwarten.','Die sinkende Wachheit passt nicht zu einer sicheren Entlastung. Weniger sichtbare Anstrengung kann Erschöpfung anzeigen.'],
        ['Zuerst untersuchen, ob sie sich wegen der lauten Umgebung schlechter konzentriert.','Die Umgebung kann stören. Flachere Atmung und sinkende Wachheit haben Vorrang.'],
        ['Atmung und Wachheit erneut unmittelbar prüfen und die Verschlechterung an den Notruf zurückmelden.','Der Verlauf kann auf Erschöpfung hinweisen. Das eintreffende Team braucht die aktuelle Änderung.']
      ]),
      d('Übergabe','Der Rettungsdienst übernimmt. Es gibt eine dokumentierte Ausgangsbeobachtung und zwei Kontrollwerte.','Welche Zusammenfassung hat Vorrang?',1,[
        ['Dauermedikation und zuletzt bekannte Lungenfunktion ausführlich vor die Beschreibung des Ereignisses stellen.','Die Daten können später helfen. Der akute Atem- und Bewusstseinsverlauf muss zuerst greifbar sein.'],
        ['Plötzlichen Beginn, Atmung und Wachheit im Verlauf sowie Maßnahmen und deren Wirkung nennen.','Damit kann der Rettungsdienst die aktuelle Gefährdung und Veränderungen rasch einordnen.'],
        ['Den letzten Sättigungswert und die Verdachtsdiagnose nennen und den Verlauf auf Nachfrage nachreichen.','Ein Einzelwert zeigt die Verschlechterung der Atmung und Wachheit nur unvollständig.']
      ])
    ]},
    {title:'Akute Verwirrtheit und Fieber auf Station', setting:'Krankenhaus', source:delir,
      story:'Herr K., 76 Jahre, ist wegen eines Harnwegsinfekts stationär. Am Abend erkennt er den Raum nicht, glaubt fremde Menschen zu sehen und versucht aufzustehen. Er hat Fieber. Seine Tochter hat am Vormittag noch orientiert mit ihm gesprochen.',
      steps:[
      d('Abweichung erkennen','Im Aufnahmebogen steht „gelegentlich vergesslich“. Die Tochter beschreibt die aktuelle Veränderung als neu.','Welche erste Einordnung passt?',2,[
        ['Die bekannte Vergesslichkeit als Erklärung nutzen und den neuen Befund im Pflegeplan ergänzen.','Eine bestehende kognitive Einschränkung schließt Delir oder eine körperliche Akutursache nicht aus.'],
        ['Zuerst ein Delirscreening abschließen und erst bei auffälligem Ergebnis medizinisch rückmelden.','Ein Screening unterstützt die Einschätzung. Die akute Veränderung bei Infekt muss unabhängig davon zeitnah beurteilt werden.'],
        ['Neue Veränderung als Warnzeichen behandeln, Sicherheit herstellen und körperlichen Zustand beurteilen lassen.','Der zeitliche Wechsel gegenüber der Basis ist bedeutsam. Delir und andere akute Ursachen müssen geprüft werden.']
      ]),
      d('Sicherheit','Herr K. will „nach Hause“ und versucht aufzustehen. Er reagiert auf kurze, ruhige Ansprache und ist dadurch vorerst erreichbar.','Wie verbindet ihr Sicherheit und Einschätzung?',0,[
        ['Bei ihm bleiben, Auslöser und Orientierung erfragen und eine zweite Person für die weitere Beurteilung hinzuholen.','Direkte Begleitung, ruhige Orientierung und Hilfe schützen, während Ursachen abgeklärt werden.'],
        ['Zuerst mit der Tochter längere biografische Informationen erheben und Herrn K. dabei selbstständig umhergehen lassen.','Vertraute Angaben helfen später. Die akute Sturzgefahr muss parallel aktiv begrenzt werden.'],
        ['Zunächst das Bett höher einstellen und Herrn K. aus kurzer Entfernung weiter beobachten.','Die höhere Bettstellung kann die Folgen eines unbeobachteten Aufstehversuchs verschärfen und klärt die Gefährdung nicht.']
      ]),
      d('Neue Kreislaufzeichen','Herr K. atmet jetzt deutlich schneller, sein Blutdruck sinkt gegenüber dem Ausgangswert.','Was ändert sich an deiner Priorität?',1,[
        ['Die Delirbeurteilung abschließen und den Kreislaufwert in der Befundliste ergänzen.','Der Wert ist mehr als ein Zusatzbefund. Gemeinsam mit schneller Atmung und Infekt verändert er die Dringlichkeit.'],
        ['Notfallweg auslösen und die Kombination aus Infekt, Verwirrtheit, schneller Atmung und Blutdruckabfall melden.','Die neu hinzugekommenen Warnzeichen erfordern sofortige Beurteilung, unter anderem auf eine mögliche Sepsis.'],
        ['Die Temperatur erneut kontrollieren und bei weiterem Anstieg ärztliche Hilfe anfragen.','Die neue Kreislauf- und Atemveränderung reicht für die Eskalation. Die Temperatur ist nicht die Voraussetzung.']
      ]),
      d('Kommunikation im Team','Das Team benötigt Beobachtungen, bevor es weitere Entscheidungen trifft. Für die Medikamentenliste hat die Kollegin Zugriff auf die Kurve.','Was meldest du selbst aus erster Hand?',2,[
        ['Die Einschätzung als wahrscheinliches Delir und die bestehende Diagnose des Harnwegsinfekts.','Die Einordnung ist wichtig, braucht aber beobachtete Veränderungen und Zeiten, um die Dringlichkeit einzuordnen.'],
        ['Den letzten Temperaturwert und die neu gemeldete Unruhe als Kurzbefund.','Fieber und Unruhe sind relevant. Atem- und Blutdruckveränderung fehlen.'],
        ['Zeitpunkt, Abweichung vom Ausgangszustand, Vitalwerttrend und die bereits veranlassten Schritte.','Eine strukturierte Übergabe macht Ausmaß, Entwicklung und offene Aufgaben erkennbar.']
      ]),
      d('Wirkung erneut beurteilen','Während der Behandlung wirkt Herr K. ruhiger, ist aber schwerer aufzuwecken als zuvor.','Wie meldest du die Veränderung?',0,[
        ['Ruhigere Motorik und gesunkene Wachheit getrennt beschreiben und erneut beurteilen lassen.','Ruhigeres Verhalten kann auch bei Verschlechterung auftreten. Eine Abnahme der Wachheit ist eigenständig wichtig.'],
        ['Die geringere Unruhe als Verbesserung melden und den bisherigen Kontrollrhythmus beibehalten.','Der Verlauf der Wachheit könnte so übersehen werden.'],
        ['Die Orientierung erst prüfen, wenn der Patient länger wach bleibt, und den Befund später besprechen.','Eine ausführliche Orientierung kann warten. Sinkende Wachheit muss früh erkannt und gemeldet werden.']
      ])
    ]},
    {title:'Plötzliche Sprachstörung beim Frühstück', setting:'Langzeitpflege',
      source:['gesund.bund.de · Schlaganfall','https://gesund.bund.de/schlaganfall'],
      story:'Frau A. setzt die Tasse ab. Ein Mundwinkel hängt, ihr rechter Arm sinkt ab, und ihre Worte werden plötzlich unverständlich. Vor wenigen Minuten hat sie noch normal gesprochen. Eine Kollegin kommt dazu.',
      steps:[
      d('Erstpriorität','Die Symptome bestehen weiterhin. Ein Blutzuckermessgerät ist im Raum.','Welche Reihenfolge passt bei dieser Aufgabenverteilung?',1,[
        ['Erst den Blutzucker messen und anhand des Ergebnisses über den Notruf entscheiden.','Der Wert kann bei der Abklärung helfen. Wenn er vor der Alarmierung abgewartet wird, verzögert sich die Versorgung bei Schlaganfallverdacht.'],
        ['Sofort den Notruf veranlassen, bei Frau A. bleiben und die ergänzenden Beobachtungen parallel beginnen.','Die neuen fokalen Ausfälle brauchen sofortige Alarmierung. Ein Messwert und der Zeitverlauf helfen anschließend bei der Übergabe.'],
        ['Den neurologischen Kurzcheck einschließlich Verlauf vollständig erheben und danach gemeinsam alarmieren.','Die Untersuchung ist hilfreich, kann aber parallel laufen. Der Verdacht besteht bereits.']
      ]),
      d('Zeitpunkt klären','Du hast die Symptome um 8.12 Uhr bemerkt. Eine Kollegin hat Frau A. um 8.07 Uhr sicher ohne Auffälligkeiten sprechen hören. Der genaue Beginn ist unklar.','Welche Angabe gibst du weiter?',0,[
        ['Zuletzt sicher unauffällig um 8.07 Uhr, erstmals auffällig um 8.12 Uhr, genauer Beginn unbekannt.','So bleiben letzte sicher unauffällige Beobachtung und Entdeckungszeit getrennt.'],
        ['Symptombeginn 8.12 Uhr, weil du die Zeichen zu diesem Zeitpunkt gesehen hast.','Das ist die Entdeckungszeit. Der Beginn kann früher gelegen haben.'],
        ['Symptombeginn etwa 8.10 Uhr als Mittelwert aus beiden Angaben.','Eine plausible Schätzung darf nicht als gesicherter Beginn übergeben werden.']
      ]),
      d('Vorübergehende Besserung','Die Sprache wird verständlicher, der Arm ist noch schwach. Frau A. möchte einen Schluck trinken.','Was hat jetzt weiterhin Vorrang?',2,[
        ['Alarmierung beibehalten und bei verständlicher Sprache ein paar Schlucke unter Aufsicht anbieten.','Sprachbesserung sagt nicht zuverlässig aus, dass Schlucken sicher ist.'],
        ['Den Rettungsdienst über die Besserung informieren und vor Ort zunächst selbst einen Schluckversuch durchführen.','Die Besserung ist wichtig. Ein Trinkversuch ohne geeignete Schluckbeurteilung fügt ein vermeidbares Risiko hinzu.'],
        ['Alarmierung aufrechterhalten, Teilbesserung melden und vor der Schluckbeurteilung nichts oral geben.','Die anfänglichen Ausfälle bleiben relevant. Schlucken kann auch bei vorübergehend besserer Sprache eingeschränkt sein.']
      ]),
      d('Befunde parallel erheben','Der Rettungsdienst ist unterwegs. Die Kollegin kann einen verfügbaren Wert erheben, du bleibst bei Frau A.','Was bringt jetzt zusätzlichen Nutzen?',1,[
        ['Die Kollegin recherchiert zuerst alle neurologischen Vorerkrankungen, bevor aktuelle Befunde ergänzt werden.','Die Vorgeschichte kann hilfreich sein. Ein aktueller Blutzucker und fortlaufende Beobachtung sind schneller handlungsrelevant.'],
        ['Soweit möglich den Blutzucker erheben lassen und Sprache, Armkraft und Wachheit im Verlauf weiter beobachten.','Der Wert hilft bei der Differenzialbeurteilung. Der klinische Verlauf und die Alarmierung bleiben maßgeblich.'],
        ['Einen unauffälligen späteren Blutzucker als Anlass nehmen, die Art der neurologischen Störung selbst festzulegen.','Ein Glukosewert beweist weder Schlaganfalltyp noch Ursache der Beschwerden.']
      ]),
      d('Übergabe','Frau A. wird vom Rettungsdienst übernommen. Die Kollegin hat den aktuellen Medikamentenplan.','Welche Übergabe priorisiert die entscheidenden Daten?',0,[
        ['Beide Zeitpunkte, anfängliche und jetzige Symptome, verfügbaren Blutzucker und relevante Medikation nennen.','Das Team erfährt den Verlauf und erhält wichtige Zusatzinformationen.'],
        ['Die jetzigen Symptome und den Medikamentenplan übergeben, die erste Beobachtung später dokumentieren.','Die anfänglichen Ausfälle und die Zeit bis zur Erkennung sind für die Akutbeurteilung wichtig.'],
        ['Zuerst die Vorgeschichte und Einschränkungen vor dem Ereignis darstellen, dann auf Rückfragen warten.','Der Ausgangszustand ist relevant. Die akuten Zeichen und Zeiten müssen trotzdem unmittelbar mitgeteilt werden.']
      ])
    ]},
    {title:'Übelkeit, kalter Schweiß und Druck im Oberbauch', setting:'Krankenhaus',
      source:['gesund.bund.de · Herzinfarkt','https://gesund.bund.de/herzinfarkt'],
      story:'Frau S., 69 Jahre, hat Diabetes. Sie entwickelt plötzlich Übelkeit, Luftnot und Druck im Oberbauch, schwitzt kalt und wirkt blass. Einen eindeutigen Brustschmerz gibt sie nicht an.',
      steps:[
      d('Erkennen','Frau S. ist ansprechbar. Sie sagt, sie habe gerade gegessen, kenne diese Kombination aber nicht.','Was leitest du vor der weiteren Abklärung ein?',2,[
        ['Zunächst die Beschwerden als möglichen Blutzuckerabfall prüfen und nach dem Ergebnis erneut priorisieren.','Der Blutzucker kann parallel geprüft werden. Er darf die notwendige Beurteilung der gesamten Symptomkombination nicht verzögern.'],
        ['Die Übelkeit symptomorientiert behandeln lassen und in wenigen Minuten nach dem Druck fragen.','Eine symptomorientierte Behandlung kann dazugehören. Luftnot und kalter Schweiß erfordern bereits eine rasche Abklärung.'],
        ['Akutes Herzproblem mitdenken, den internen Notfallweg auslösen und bei Frau S. bleiben.','Auch ohne typischen Brustschmerz kann die Kombination auf einen Herzinfarkt hinweisen.']
      ]),
      d('Rollen verteilen','Eine Kollegin ist im Zimmer, das Notfallteam ist informiert. Frau S. wirkt zunehmend erschöpft.','Wie setzt ihr die verfügbare Hilfe am sinnvollsten ein?',0,[
        ['Eine Person beobachtet Atmung und Kreislauf, die andere bereitet nach Stationsstandard die angeforderte Diagnostik vor.','Die Person bleibt kontinuierlich betreut. Diagnostik und erste Beurteilung laufen abgestimmt parallel.'],
        ['Beide bereiten die Diagnostik vor und erheben die Vitalzeichen direkt im Anschluss.','Die Vorbereitung ist sinnvoll. Bei erkennbarer Verschlechterung wird eine Person zur fortlaufenden Beurteilung benötigt.'],
        ['Zunächst den gesamten Medikamenten- und Essensverlauf rekonstruieren, um die Diagnose einzugrenzen.','Der Verlauf ist wertvoll. Die akute Verfassung geht vor der vollständigen Recherche.']
      ]),
      d('Messwerte einordnen','Die Sauerstoffsättigung ist unauffällig. Frau S. schwitzt weiterhin kalt und klagt über zunehmenden Druck.','Welche Bewertung passt?',1,[
        ['Die Notfalldringlichkeit reduzieren, weil sich die gemessene Sauerstoffversorgung als stabil erweist.','Ein normaler Einzelwert schließt ein akutes kardiales Problem nicht aus.'],
        ['Die Alarmierung beibehalten und die anhaltenden Beschwerden sowie den Messwert gemeinsam melden.','Die klinische Entwicklung und nicht allein die Sättigung bestimmt die Dringlichkeit.'],
        ['Die Luftnot als Stressreaktion dokumentieren, bis weitere Messungen das Gegenteil zeigen.','Der Befund kann verschiedene Ursachen haben. In dieser Kombination bleibt die Notfallabklärung erforderlich.']
      ]),
      d('Befunde übergeben','Das Team verlangt eine kurze, priorisierte Übergabe. Die Werte sind erhoben, die Verdachtsdiagnose ist noch offen.','Welche Formulierung trägt am meisten zur Einordnung bei?',2,[
        ['Die Diabetesdauer, das heutige Essen und danach den Druck beim Atmen nennen.','Die Vorgeschichte ergänzt den Befund. Zeitpunkt und gleichzeitig einsetzende Warnzeichen sollten vorne stehen.'],
        ['Den Oberbauchdruck und den letzten Blutdruck beschreiben, die anderen Beschwerden bei Rückfragen ergänzen.','Luftnot, Blässe und Kaltschweißigkeit sind zentrale Hinweise in diesem Fall.'],
        ['Plötzlichen Beginn, Druck im Oberbauch, Luftnot, Kaltschweißigkeit, Verlauf und aktuelle Werte nennen.','Die Kombination zeigt den Grund für die Eskalation auch ohne klassischen Brustschmerz.']
      ]),
      d('Verlauf','Der Druck lässt kurzfristig nach, die Person ist weiter blass und fühlt sich schwach. Die Abklärung läuft.','Welche Aufgabe bleibt bestehen?',0,[
        ['Besserung und verbleibende Beschwerden melden sowie Vitalfunktionen nach Absprache weiter beobachten.','Eine kurzfristige Besserung ist ein Verlaufsbefund. Sie hebt die laufende Abklärung nicht auf.'],
        ['Das Monitoring auf den üblichen Stationsrhythmus zurückstellen, wenn der Druck weiter nachlässt.','Die aktuelle Entscheidung richtet sich auch nach Allgemeinzustand, Befunden und dem Notfallteam.'],
        ['Den nachlassenden Schmerz dokumentieren und den nächsten Beschwerdeanstieg als Anlass für eine neue Meldung nutzen.','Die verbleibende Schwäche und Blässe sind jetzt bereits berichtenswert.']
      ])
    ]},
    {title:'Atemnot nach dem Gang zur Toilette', setting:'Krankenhaus', source:abcde,
      story:'Herr W. bekommt nach dem Toilettengang plötzlich schwere Atemnot. Er kann kaum sprechen. Die Atemarbeit nimmt zu, und er wirkt zusehends erschöpft.',
      steps:[
      d('Alarmierung','Eine Kollegin steht in Rufweite. Du bist beim Patienten.','Was organisierst du unmittelbar?',2,[
        ['Zunächst Atemfrequenz, Puls und Sauerstoffsättigung vollständig erfassen und dann alarmieren.','Messwerte sind nützlich. Die klinische Schwere reicht bereits aus, den Notfallweg auszulösen.'],
        ['Den Patienten in das Zimmer zurückbegleiten, damit das Team dort leichter übernehmen kann.','Ein Weg kann die Belastung erhöhen und verzögert die Hilfe am Ort des Ereignisses.'],
        ['Die Kollegin das Notfallteam rufen lassen und selbst Atmung und Wachheit beurteilen.','Durch paralleles Handeln bleibt der Patient betreut, während Hilfe kommt.']
      ]),
      d('Messwert im Widerspruch','Die gemessene Sättigung liegt im üblichen Bereich. Herr W. kann weiter kaum sprechen und wirkt erschöpft.','Wie reagierst du auf den Widerspruch?',1,[
        ['Die Dringlichkeit bis zur nächsten Messung anhand der aktuellen Sättigung herabstufen.','Ein guter Einzelwert bildet die Atemarbeit und eine mögliche Erschöpfung nicht ab.'],
        ['Messsignal gegebenenfalls kontrollieren, Alarmierung aufrechterhalten und den klinischen Befund melden.','Messwert und klinischer Zustand gehören zusammen. Die sichtbaren Warnzeichen bleiben prioritär.'],
        ['Gerätevergleich vorbereiten und erst bei einem abweichenden Ergebnis die Verschlechterung melden.','Die technische Kontrolle darf in dieser Situation die Rückmeldung nicht aufhalten.']
      ]),
      d('Atmung beobachten','Herr W. sagt immer weniger. Seine Atembewegungen werden trotz ausgeprägter Beschwerden flacher.','Welche Einordnung löst die nächste Handlung aus?',0,[
        ['Mögliche Erschöpfung ernst nehmen, Atmung und Reaktion unmittelbar prüfen und neu melden.','Flachere Atmung zusammen mit geringerer Reaktion kann eine Verschlechterung sein.'],
        ['Die geringere sichtbare Atemanstrengung zunächst als Erholung nach Ruhe werten.','Weniger sichtbare Bewegung kann auch bei Erschöpfung auftreten.'],
        ['Zuerst aus der Akte den üblichen Sauerstoffbedarf ermitteln und danach erneut beurteilen.','Der Ausgangswert unterstützt die Übergabe, steht aber hinter der aktuellen Funktionsprüfung.']
      ]),
      d('Neue Lage','Herr W. ist plötzlich nicht mehr ansprechbar. Nach rascher Prüfung erkennst du keine normale Atmung.','Welche Handlung hat jetzt Vorrang?',2,[
        ['Eine gewünschte Lagerung herstellen und den nächsten Sättigungswert beobachten.','Eine Messung kann einen Kreislaufstillstand nicht zuverlässig ausschließen. Sofortiges Handeln ist nötig.'],
        ['Das Team erneut rufen und mit den Maßnahmen warten, bis es eintrifft.','Die Alarmierung ist wichtig. Die Verzögerung der Wiederbelebung wäre in dieser Lage entscheidend.'],
        ['Kreislaufstillstand melden, Wiederbelebung beginnen und den AED nach Notfallplan holen lassen.','Fehlende Reaktion und fehlende normale Atmung sind der Anlass, Wiederbelebung unmittelbar einzuleiten.']
      ]),
      d('Übernahme','Das Notfallteam übernimmt die Wiederbelebung. Welche Informationen du bereits hast, ist für die Teamleitung gefragt.','Was gibst du zuerst weiter?',1,[
        ['Zimmernummer, Grunderkrankung und das zuletzt eingeplante Medikament.','Die Zuordnung hilft, aber für die laufende Übernahme fehlen beobachtete Zeiten und Maßnahmen.'],
        ['Zeitpunkt der Atemnot, Verlust der Reaktion, Befund der Atmung und bereits begonnene Maßnahmen.','Die Teamleitung erhält eine klare Chronologie der Verschlechterung und bisheriger Versorgung.'],
        ['Nur den letzten Sättigungswert und die Vermutung zur Ursache vor dem Toilettengang.','Der frühere Messwert und die Vermutung beschreiben den Kreislaufstillstand nicht.']
      ])
    ]},
    {title:'Ungewöhnlich still nach der Operation', setting:'Krankenhaus', source:delir,
      story:'Frau F., 83 Jahre, konnte sich gestern normal unterhalten. Nach der Operation antwortet sie heute einsilbig, verliert den Gesprächsfaden und schläft während des Gesprächs immer wieder ein. Ihr Sohn beschreibt das als untypisch.',
      steps:[
      d('Hypoaktive Zeichen erkennen','Frau F. lässt sich wecken, braucht aber länger als sonst, um eine Frage zu verstehen.','Was hat bei der Neueinschätzung Vorrang?',1,[
        ['Erschöpfung nach der Operation dokumentieren und nach der geplanten Ruhephase erneut nachsehen.','Erschöpfung ist möglich, erklärt die neue Aufmerksamkeitsänderung aber nicht zuverlässig.'],
        ['Die akute Veränderung melden, Vitalfunktionen einschließlich Wachheit beurteilen und ein hypoaktives Delir mitdenken.','Ein Delir kann sich ruhig und schläfrig zeigen. Akute somatische Ursachen müssen gleichzeitig geprüft werden.'],
        ['Die bisherigen Gedächtnisprobleme erfragen und danach entscheiden, ob eine akute Veränderung vorliegt.','Der Ausgangszustand ist hilfreich. Der klare zeitliche Wechsel braucht bereits medizinische Aufmerksamkeit.']
      ]),
      d('Körperliche Ursachen','Im Verlauf fällt eine deutlich langsamere Atmung auf. Die Medikamentenkurve enthält eine kürzlich verabreichte Schmerzmedikation.','Welche nächste Priorität folgt?',2,[
        ['Ein Delirscreening beenden und danach den zeitlichen Bezug zur Medikamentengabe besprechen.','Das Screening ist zweitrangig, wenn Atmung und Wachheit auffällig werden.'],
        ['Vor allem nach Schmerzen fragen, um die Notwendigkeit der nächsten planmäßigen Gabe einzuordnen.','Schmerzbeurteilung gehört in den Verlauf. Die aktuelle Atemveränderung ist zuerst abzuklären.'],
        ['Atmung und Wachheit unmittelbar beurteilen, Hilfe nach Dringlichkeit holen und die kürzliche Gabe weitergeben.','Eine neue Atemverlangsamung mit Schläfrigkeit ist dringlich. Die Medikation ist ein Hinweis, kein Beweis der Ursache.']
      ]),
      d('Verlauf und Fremdanamnese','Nach der Akutbeurteilung sind die Vitalfunktionen stabil. Der Sohn war gestern und heute jeweils längere Zeit da.','Was fragst du für die weitere Delirbeurteilung?',0,[
        ['Wie wach und aufmerksam sie sonst ist, wann es anders wurde und ob es Schwankungen gab.','Akuter Beginn und fluktuierender Verlauf helfen, Delirzeichen vom Ausgangszustand abzugrenzen.'],
        ['Welche Gedächtnisdiagnosen sie in den letzten Jahren erhalten hat und wie gut sie sich an Namen erinnert.','Vorgeschichte und Erinnerung ergänzen die Einschätzung, decken den aktuellen Aufmerksamkeitswechsel jedoch nicht ab.'],
        ['Welche Tätigkeiten sie vor der Operation im Haushalt allein übernehmen konnte.','Der Funktionsstatus ist für die Planung wichtig. Er klärt akute Kognitions- und Wachheitsveränderungen nur indirekt.']
      ]),
      d('Orientierung ermöglichen','Frau F. ist wieder wach, wirkt unsicher und hört dich ohne Hörgerät schlecht. Ihre Brille liegt in der Schublade.','Welche Unterstützung ist in dieser Phase am sinnvollsten?',2,[
        ['Die Orientierung durch mehrere rasch aufeinanderfolgende Fragen wiederholt testen.','Das kann belasten und erschwert bei eingeschränktem Hören eine verlässliche Beurteilung.'],
        ['Die Kommunikation vollständig an den Sohn abgeben, um Frau F. möglichst wenig zu beanspruchen.','Er kann unterstützen. Frau F. soll selbst angesprochen und einbezogen werden.'],
        ['Hörgerät und Brille nach Wunsch verfügbar machen, langsam erklären und vertraute Orientierungshilfen nutzen.','Geeignete Sinneshilfen und ruhige Kommunikation unterstützen Orientierung und Beteiligung.']
      ]),
      d('Übergabe','Im Gespräch ist Frau F. kurz aufmerksam, wenige Minuten später wieder schläfrig. Die Nachtschicht übernimmt.','Welcher Verlauf gehört in die Übergabe?',1,[
        ['Der beste beobachtete Orientierungswert und der allgemeine Eindruck von der Operation.','Der beste Moment allein kann die Schwankungen verdecken.'],
        ['Ausgangszustand, Beginn, Schwankungen, körperliche Auffälligkeiten und vereinbarte Kontrollen.','Die Nachtschicht kann die Entwicklung einschätzen und die vereinbarten Maßnahmen fortführen.'],
        ['Die Annahme eines Delirs mit dem Hinweis, bei Unruhe erneut einzuschätzen.','Die hypoaktiven Warnzeichen sind gerade Schläfrigkeit und Aufmerksamkeitsverlust.']
      ])
    ]},
    {title:'Eine Bewohnerin äußert akute Suizidgedanken', setting:'Langzeitpflege', source:suicide,
      story:'Frau L. sagt im Abenddienst, sie wolle nicht mehr leben und fürchte, sich heute etwas anzutun. Sie bittet dich, es niemandem zu sagen. Eine Kollegin ist in Rufweite.',
      steps:[
      d('Erster Kontakt','Frau L. ist ansprechbar und spricht weiter mit dir.','Welche Reaktion verbindet Beziehung und unmittelbaren Schutz?',0,[
        ['Ihre Aussage ernst nehmen, ruhig und direkt nach aktueller Gefahr fragen, bei ihr bleiben und Hilfe hinzuziehen.','Direktes Nachfragen, Begleitung und früh organisierte Hilfe gehören bei einer konkreten akuten Äußerung zusammen.'],
        ['Das Gespräch zunächst im Vertrauen führen und Hilfe erst nach ihrem Einverständnis hinzuziehen.','Vertrauen ist wichtig. Bei unmittelbarer Gefahr muss fachliche Hilfe früh organisiert werden.'],
        ['Die Kollegin für ein Gespräch ablösen lassen, während du erst den bisherigen Verlauf recherchierst.','Die Recherche kann parallel erfolgen. Eine direkte Übergabe der akuten Aussage und kontinuierliche Begleitung sind entscheidend.']
      ]),
      d('Schweigewunsch besprechen','Frau L. fragt erneut, ob du es für dich behalten kannst. Du hast die Kollegin bereits um Unterstützung gebeten.','Wie erklärst du dein Vorgehen?',2,[
        ['Ihr zusagen, vorerst im Team nur allgemeine Sorgen zu erwähnen und die konkrete Aussage später zu besprechen.','Das schützt die Privatsphäre teilweise, gibt dem zuständigen Team jedoch nicht die Information für den unmittelbaren Schutz.'],
        ['Die Einzelheiten sofort an die Angehörigen weitergeben, weil sie die Bewohnerin gut kennen.','Angehörige können unterstützen. Die unmittelbare fachliche Hilfe und verhältnismäßige Weitergabe haben Vorrang.'],
        ['Erklären, dass du bei ihr bleibst und für ihren Schutz die zuständigen Fachpersonen einbeziehst.','Du bleibst ehrlich und beschränkst die Weitergabe auf die für Schutz und Versorgung notwendigen Personen.']
      ]),
      d('Scheinbare Entlastung','Sie wirkt nach dem Gespräch ruhiger und sagt, sie wolle dich nicht belasten. Eine zuverlässige Beurteilung durch das zuständige Team steht aus.','Wie reagierst du auf die Veränderung?',1,[
        ['Ein weiteres Gesprächsterminangebot machen und bis dahin zur üblichen Betreuung zurückkehren.','Ein späterer Termin ist ergänzend sinnvoll. Die gerade geschilderte akute Gefahr ist noch nicht fachlich beurteilt.'],
        ['Ruhigere Wirkung als Beobachtung weitergeben und Begleitung bis zur abgestimmten Übernahme aufrechterhalten.','Entlastung im Gespräch sagt allein wenig über die weitere Gefährdung aus.'],
        ['Ihre beruhigende Aussage als Zusage dokumentieren und die regelmäßigen Rundgänge fortsetzen.','Eine einzelne Zusage ersetzt die fachliche Risikoeinschätzung und Schutzabstimmung nicht.']
      ]),
      d('Priorisierte Übergabe','Die verantwortliche Fachperson kommt hinzu. Frau L. ist weiterhin im Gespräch mit dir.','Welche Übergabe ist jetzt nötig?',2,[
        ['Vor allem aus der Akte bekannte Diagnosen und frühere Krisen zusammenfassen.','Der Hintergrund ist nützlich, sagt aber nicht, welche akute Gefahr Frau L. heute beschrieben hat.'],
        ['Die aktuelle ruhige Gesprächssituation nennen und die ursprüngliche Äußerung auf Nachfrage ergänzen.','Die ruhige Wirkung darf die aktuelle Gefährdung in der Übergabe nicht verdecken.'],
        ['Konkrete Äußerung, Zeitpunkt, Verlauf und bisher organisierte Begleitung weitergeben.','Die Fachperson kann damit Dringlichkeit und erforderliche Schutzmaßnahmen einschätzen.']
      ]),
      d('Sichere Übernahme','Das zuständige Team plant die weitere Versorgung. Du musst die Station verlassen.','Wann kann deine Begleitung sicher enden?',0,[
        ['Wenn eine konkrete Person die Begleitung übernimmt und der weitere Schutz abgestimmt ist.','Eine benannte Übergabe verhindert, dass zwischen zwei Zuständigkeiten eine Betreuungslücke entsteht.'],
        ['Sobald der Fall dokumentiert und an das Team elektronisch weitergeleitet wurde.','Ein Eintrag beweist nicht, dass die persönliche Begleitung unmittelbar fortgesetzt wird.'],
        ['Sobald ein Angehöriger angekündigt hat, in Kürze vorbeizukommen.','Eine angekündigte Ankunft sichert den Zeitraum bis dahin nicht und ersetzt die fachliche Übernahme nicht.']
      ])
    ]},
    {title:'Erstversorgung nach einem vermuteten Suizidversuch', setting:'Krankenhaus', source:suicide,
      story:'Eine Begleitperson berichtet von einem möglichen Suizidversuch bei Herrn D. Er antwortet verzögert, ist zunehmend benommen und kann die Situation kaum schildern. Der Ablauf ist noch unklar.',
      steps:[
      d('Körperliche Priorität','Eine zweite Pflegeperson steht bereit. Die Begleitperson möchte den Ablauf sofort ausführlich erzählen.','Wie verteilst du die ersten Aufgaben?',1,[
        ['Zuerst die Fremdanamnese vervollständigen, damit der Notruf die vermutete Ursache enthält.','Der Bericht ist wichtig, darf die Versorgung bei zunehmender Benommenheit aber nicht verzögern.'],
        ['Internen Notruf auslösen lassen und gleichzeitig Atmung, Kreislauf und Reaktion beurteilen.','Akute körperliche Gefährdung wird vorrangig erkannt und versorgt. Informationen können parallel erfasst werden.'],
        ['Mit der Begleitperson in einen ruhigeren Raum wechseln und dort den Bewusstseinsverlauf neu beurteilen.','Ein Ortswechsel vor der Erstsichtung kann Zeit kosten und eine Verschlechterung schwerer erkennbar machen.']
      ]),
      d('Befunde trennen','Die Begleitperson kennt nur einen Teil des Ereignisses. Du beobachtest selbst zunehmende Benommenheit.','Welche Information gibst du wie weiter?',2,[
        ['Den Versuch als gesichertes Ereignis melden und die unklaren Details später nachtragen.','Die Aussage der Begleitperson ist ein Fremdbericht. Als gesichert kann nur der beobachtete Befund gelten.'],
        ['Zunächst nur die Benommenheit weitergeben und den Fremdbericht bis zur Bestätigung zurückhalten.','Der Fremdbericht ist trotz Unsicherheit für die Einordnung relevant und kann klar als solcher gekennzeichnet werden.'],
        ['Den Fremdbericht als solchen und die selbst beobachtete Benommenheit samt Verlauf getrennt nennen.','Das Team erhält nachvollziehbare Informationen über Herkunft und Sicherheit der Befunde.']
      ]),
      d('Wartezeit absichern','Die Atmung ist nach der ersten Prüfung normal, die Reaktion bleibt jedoch verzögert. Hilfe ist auf dem Weg.','Was bleibt bis zur Übernahme vorrangig?',0,[
        ['Bei Herrn D. bleiben, Atmung und Reaktion weiter beobachten und Verschlechterungen sofort melden.','Eine zunächst normale Atmung ist ein Momentbefund. Bei Benommenheit kann sich der Zustand ändern.'],
        ['Die Beobachtung der Begleitperson überlassen, während du Daten aus der Akte zusammenträgst.','Die Akte kann eine zweite Person prüfen. Verzögerte Reaktion braucht fortlaufende fachliche Beobachtung.'],
        ['Zuerst das psychosoziale Gespräch intensivieren, um die Handlungsabsicht zu klären.','Ein Gespräch ist wichtig, wenn der Zustand es erlaubt. Im Moment steht die körperliche Sicherheit vorne.']
      ]),
      d('Nach körperlicher Stabilisierung','Herr D. ist inzwischen besser ansprechbar. Er sagt, ihm gehe es wieder gut. Die psychiatrische Beurteilung ist noch offen.','Wie gestaltest du den Übergang?',2,[
        ['Zu regulären Stationskontrollen wechseln und den psychiatrischen Verlauf später in der Routine besprechen.','Körperliche Stabilisierung und psychische Sicherheit sind zwei eigene Beurteilungen.'],
        ['Ein Gespräch mit der Begleitperson als ausreichende Grundlage zur Beendigung der engen Begleitung nutzen.','Fremdanamnese hilft. Schutz und weitere Beurteilung werden mit dem zuständigen Team abgestimmt.'],
        ['Ruhig informieren, kontinuierliche Begleitung sichern und die zeitnahe psychiatrische Beurteilung abstimmen.','Äußere Beruhigung oder körperliche Stabilität heben die notwendige Beurteilung nach dem Ereignis nicht auf.']
      ]),
      d('Übernahme konkret machen','Das Team wechselt. Herr D. möchte wissen, wer ihn jetzt betreut und was der nächste Schritt ist.','Was vermittelst du bei der Übergabe?',1,[
        ['Die vorgesehenen weiteren Untersuchungen aufzählen und die Begleitung unverändert im allgemeinen Plan lassen.','Untersuchungen erklären den Ablauf. Bei offenem Schutzbedarf muss zusätzlich eine konkrete Begleitung organisiert sein.'],
        ['Körperlichen Verlauf, bisherigen Schutz und nächste Zuständigkeit übergeben und Herrn D. verständlich informieren.','Damit bleiben fachliche Kontinuität und Beteiligung des Patienten zusammen gewährleistet.'],
        ['Den Verdacht auf einen Versuch kurz nennen und die nächste Schicht selbst eine neue Lagebeurteilung beginnen lassen.','Die nächste Schicht braucht die bisherige Entwicklung und den vereinbarten Schutz, ohne eine Betreuungslücke.']
      ])
    ]},
    {title:'Unterzuckerung mit eingeschränktem Bewusstsein', setting:'Langzeitpflege',
      source:['diabinfo · Unterzuckerung','https://www.diabinfo.de/leben/behandlung/unterzuckerung.html'],
      story:'Herr R. hat Diabetes. Er schwitzt, reagiert nur verzögert und kann auf Aufforderung nicht sicher schlucken. Das Blutzuckermessgerät zeigt einen deutlich zu niedrigen Wert.',
      steps:[
      d('Erstreaktion','Du bist am Bett. Eine Kollegin kann unmittelbar den Notruf übernehmen.','Welche Reihenfolge passt?',2,[
        ['Den Messwert zunächst bestätigen und erst bei zweiter tiefer Messung den Notruf auslösen.','Der zweite Wert kann hilfreich sein. Eingeschränkte Wachheit und unsicheres Schlucken zeigen bereits die Dringlichkeit.'],
        ['Eine Fachperson aus dem Nachbarbereich holen und bis dahin nur die Reaktion überwachen.','Die Fachperson kann unterstützen. Der Notruf bei schwerer Unterzuckerung und unsicherem Schlucken soll früh ausgelöst werden.'],
        ['Notruf veranlassen, bei ihm bleiben, Atmung und Reaktion prüfen und nichts oral geben.','Bei unsicherem Schlucken droht Verschlucken. Akute Hilfe und klinische Beurteilung sind jetzt nötig.']
      ]),
      d('Notfallplan nutzen','Ein individueller Diabetes-Notfallplan liegt vor. Die Kollegin ist nach ihrer Ausbildung und dem Plan für die vorgesehene Maßnahme qualifiziert.','Wie stimmt ihr euch ab?',0,[
        ['Die Kollegin klärt und übernimmt die Maßnahme nach Plan, während du bei Herrn R. Vitalfunktionen beobachtest.','Klare Zuständigkeit ermöglicht Versorgung und fortlaufende Beobachtung gleichzeitig.'],
        ['Die Maßnahme erst bei erneuter telefonischer Bestätigung des Messwerts in Betracht ziehen.','Bei bestehendem Plan und erkennbarer Notfallsituation kann das Abwarten den Beginn nach Plan verzögern.'],
        ['Gemeinsam das Notfallmaterial suchen und Herrn R. bis zur Rückkehr von außen im Blick behalten.','Eine Person sollte die Vitalfunktionen fortlaufend beurteilen können.']
      ]),
      d('Schluckfähigkeit neu beurteilen','Herr R. öffnet die Augen, sucht aber noch nach Worten und folgt Anweisungen nur unzuverlässig.','Welche Entscheidung zur oralen Gabe passt?',1,[
        ['Kleine Mengen eines süßen Getränks anbieten, da er die Augen bereits geöffnet hat.','Wachere Reaktion ist ein Fortschritt, beweist aber keine sichere Schluckfähigkeit.'],
        ['Solange sichere Wachheit und Schluckfähigkeit fehlen, nichts oral geben und weiter beobachten.','Orale Kohlenhydrate kommen erst bei ausreichender Wachheit und sicherem Schlucken infrage.'],
        ['Den Kopf im Sitzen abstützen und damit die fehlende Sicherheit beim Schlucken ausgleichen.','Eine günstige Position hilft, ersetzt aber die Einschätzung des Schluckvermögens nicht.']
      ]),
      d('Verlauf weitergeben','Der Rettungsdienst übernimmt. Die Kollegin hat Informationen zu Mahlzeit und Medikation gesammelt.','Was soll in die erste Meldung?',2,[
        ['Die Diabetesdiagnose und das Medikament vom Vortag als wichtigste Ursache nennen.','Eine mögliche Ursache kann benannt werden. Aktuelle Werte, Wachheit und Maßnahmen sind vorrangig.'],
        ['Den jüngsten Glukosewert weitergeben und die anfängliche Schluckunsicherheit als erledigt ansehen.','Das frühere Symptom und sein Verlauf beeinflussen die Beurteilung weiterhin.'],
        ['Messwerte mit Zeiten, Veränderungen von Wachheit und Schlucken sowie Maßnahmen und verfügbare Medikamentendaten.','Der zeitliche Verlauf ist für die weitere Behandlung und Überwachung entscheidend.']
      ]),
      d('Teilbesserung','Herr R. ist wieder wacher, ein aktueller therapeutischer Plan wird vom Team abgestimmt. Die ursprüngliche Ursache ist offen.','Welche pflegerische Aufgabe bleibt?',0,[
        ['Erneute Messungen und Beobachtung nach Teamabsprache sicherstellen und eine mögliche Wiederkehr rückmelden.','Eine vorübergehende Besserung schließt ein erneutes Absinken nicht aus. Verlaufskontrollen richten sich nach Situation und Plan.'],
        ['Die bisherigen Messungen ablegen und ab dem nächsten regulären Zeitfenster wieder kontrollieren.','Das Routineintervall kann für diese nach wie vor veränderliche Situation ungeeignet sein.'],
        ['Aus dem Ereignis ableiten, die übliche Diabetesmedikation für den restlichen Tag selbst anzupassen.','Therapieanpassungen werden mit dem zuständigen Team vereinbart. Beobachtung und Weitergabe bleiben pflegerisch zentral.']
      ])
    ]},
    {title:'Infekt mit neuer Verwirrtheit und Kreislaufzeichen', setting:'Krankenhaus',
      source:['gesund.bund.de · Sepsis','https://gesund.bund.de/sepsis'],
      story:'Ein Patient mit bekanntem Infekt atmet neu deutlich schneller, ist verwirrt und hat einen niedrigeren Blutdruck als zuvor. Die zuletzt gemessene Temperatur lag im Normalbereich.',
      steps:[
      d('Warnzeichen verknüpfen','Die Veränderungen traten innerhalb kurzer Zeit auf. Ein Mitglied des Teams schlägt eine Kontrollmessung vor.','Wie gehst du mit der Dringlichkeit um?',1,[
        ['Erst die Kontrolltemperatur abwarten und bei Fieber eine dringliche Beurteilung anfragen.','Eine normale Temperatur schließt eine Sepsis nicht aus. Atmung, Kreislauf und Bewusstsein sind bereits auffällig.'],
        ['Die Kombination aus Infekt und neuer Verschlechterung sofort melden und den Notfallweg einleiten.','Mehrere neu veränderte Organsysteme können auf eine akute Gefährdung hinweisen.'],
        ['Zunächst alle Werte für das vollständige Screening zusammentragen und dann den Diensthabenden informieren.','Ein Score kann helfen. Die auffällige Kombination reicht bereits, um Hilfe auszulösen.']
      ]),
      d('Parallel handeln','Das Notfallteam ist informiert. Zwei Pflegepersonen sind verfügbar.','Welche Aufteilung passt zur Situation?',0,[
        ['Bei ihm bleiben und Vitalfunktionen erneut beurteilen, während die zweite Person Material und relevante Daten organisiert.','Die Entwicklung bleibt sichtbar, und die Übernahme wird parallel vorbereitet.'],
        ['Eine Person beendet die Dokumentation, die zweite überprüft zunächst das letzte Antibiotikum.','Beide Aufgaben helfen später. Die kontinuierliche Beobachtung bei Kreislaufzeichen fehlt.'],
        ['Vorrangig zusammen den Umfang der Flüssigkeitsbilanz der letzten Tage zusammentragen.','Die Bilanz kann einen Beitrag leisten. Atmung, Kreislauf und Bewusstsein gehen aktuell vor.']
      ]),
      d('SBAR einsetzen','Du telefonierst mit der zuständigen Ärztin, die vor ihrem Eintreffen eine kurze Einschätzung braucht.','Welche Meldung erklärt den Handlungsbedarf am besten?',2,[
        ['„Er hat einen Infekt, ist heute unruhig und die Temperatur war normal.“','Die akute Atem- und Kreislaufveränderung fehlt und könnte in der Dringlichkeit unterschätzt werden.'],
        ['„Verdacht auf Sepsis, die Medikation können wir später besprechen.“','Der Verdacht allein enthält keine beobachteten Fakten und keine klare Bitte.'],
        ['„Bei bekanntem Infekt sind Atmung und Wachheit neu verändert, der Blutdruck fiel. Bitte sofort vor Ort beurteilen.“','Die Aussage verknüpft Verlauf, Befunde und eine klare Anforderung.']
      ]),
      d('Therapie begleiten','Das Team plant Diagnostik und verordnet Maßnahmen. Die Liste der Unverträglichkeiten ist in der Kurve verfügbar.','Welche pflegerische Unterstützung ist jetzt am besten?',1,[
        ['Die verordnete Behandlung nach Abschluss aller Pflegeaufgaben vorbereiten und Vitalwerte danach dokumentieren.','Das gewöhnliche Arbeitsschema kann die zeitkritischen Schritte verzögern.'],
        ['Zuständigkeiten klären, Unverträglichkeiten und Anordnung prüfen und angeordnete Schritte zügig unterstützen.','Prüfung und zügige Umsetzung können parallel mit klinischer Überwachung erfolgen.'],
        ['Die Maßnahmen nach eigenem Verdachtsbild vorziehen und die konkrete Anordnung anschließend bestätigen lassen.','Die Behandlung braucht abgestimmte Zuständigkeiten und sichere Anordnungen.']
      ]),
      d('Auf Verlauf reagieren','Nach einer übernommenen Maßnahme steigt der Blutdruck etwas. Die Person wird aber schläfriger.','Wie beurteilst du den Trend?',2,[
        ['Den besseren Blutdruck als ausreichendes Zeichen der Erholung an das Team weitergeben.','Die Verschlechterung der Wachheit bleibt ein eigenes Warnzeichen.'],
        ['Erst den nächsten Routinewert abwarten, um einen stabilen Trend der Wachheit zu beschreiben.','Neue Schläfrigkeit bei einem Notfall muss zeitnah beurteilt und gemeldet werden.'],
        ['Beide Trends melden und Atmung, Kreislauf und Wachheit erneut strukturiert prüfen.','Unterschiedliche Verläufe gehören in die Gesamtbeurteilung.']
      ])
    ]},
    {title:'Sturz mit Kopfaufprall unter Blutverdünnung', setting:'Langzeitpflege',
      source:['NICE · Head injury, NG232','https://www.nice.org.uk/guidance/ng232/chapter/recommendations'],
      story:'Herr G. liegt nach einem beobachteten Sturz am Boden. Der Kopf ist aufgeschlagen. Er nimmt ein gerinnungshemmendes Medikament und wird während des Gesprächs zunehmend schläfrig.',
      steps:[
      d('Dringlichkeit','Herr G. atmet und reagiert. Seine Antworten werden langsamer. Eine zweite Person ist da.','Welche Aufgaben haben unmittelbar Vorrang?',0,[
        ['Notruf veranlassen, bei ihm bleiben, Atmung und Reaktion prüfen und unnötige Bewegung vermeiden.','Zunehmende Schläfrigkeit nach Aufprall unter Gerinnungshemmung ist ein zeitkritisches Warnzeichen.'],
        ['Zunächst die sichtbare Wunde versorgen und den Notruf vom Ergebnis der Versorgung abhängig machen.','Die lokale Wundversorgung kann notwendig sein. Sie beantwortet nicht die Frage nach einer inneren Kopfverletzung.'],
        ['Erst Vitalwerte und eine Schmerzeinschätzung komplett erheben und den Befund anschließend dringend melden.','Die Messungen sind wichtig, dürfen aber die Alarmierung bei wachsender Schläfrigkeit nicht verzögern.']
      ]),
      d('Bewegung abwägen','Eine Kollegin möchte Herrn G. auf einen Stuhl setzen, um im Flur Platz zu schaffen. Die Umgebung kann abgesperrt werden.','Wie entscheidest du bis zur Übernahme?',2,[
        ['Mit der zweiten Person einen kurzen Transfer organisieren, um die Ruhe der Situation zu verbessern.','Ein bequemeres Umfeld rechtfertigt den Transfer bei unklarer Verletzung nicht, wenn der Ort gesichert werden kann.'],
        ['Ihn aufsetzen, um die Wachheit mit einem Gespräch besser zu beurteilen.','Die Reaktion lässt sich auch in der vorhandenen Lage beurteilen. Veränderungen der Lage richten sich nach den Vitalfunktionen.'],
        ['Den Bereich sichern und unnötiges Bewegen vermeiden; die Vitalfunktionen weiter beurteilen.','Ohne akute Umgebungsgefahr und bei erhaltener Atmung gibt es keinen Grund für einen vorschnellen Transfer.']
      ]),
      d('Gefahr neu bewerten','Die sichtbare Blutung ist gering. Herr G. fragt wiederholt, was passiert sei, und lässt sich schwerer wach halten.','Was meldest du als wichtigste Veränderung?',1,[
        ['Die geringe sichtbare Blutung als wichtigstes Zeichen eines begrenzten Aufpralls nennen.','Die äußerlich sichtbare Wunde sagt wenig über eine mögliche Blutung im Schädel aus.'],
        ['Wiederholte Fragen und zunehmende Schläfrigkeit seit dem Kopfaufprall als Verschlechterung weitergeben.','Der neue neurologische Verlauf ist in Verbindung mit Aufprall und Gerinnungshemmung besonders wichtig.'],
        ['Die genaue Wundgröße erheben und erst danach beurteilen, ob die Fragen auf Orientierungsprobleme hinweisen.','Die Wundgröße kann warten. Zunehmende Schläfrigkeit wird sofort rückgemeldet.']
      ]),
      d('Medikationsdaten','Die Kollegin kann den Medikamentenplan einsehen. Herr G. erinnert sich an die letzte Einnahme nicht.','Welche Angaben helfen dem Rettungsdienst?',2,[
        ['Nur „nimmt Blutverdünner“ sagen und alle weiteren Angaben zunächst den Angehörigen erfragen lassen.','Die Wirkstoffangabe und die letzte gesicherte Einnahme sind, soweit verfügbar, sofort hilfreich.'],
        ['Die übliche Einnahmezeit als tatsächliche letzte Gabe nennen, damit die Übergabe vollständig ist.','Ein Gewohnheitszeitpunkt darf nicht als gesicherter Zeitpunkt ausgegeben werden.'],
        ['Präparat und letzte gesicherte Gabe nennen; offen sagen, wenn die Einnahmezeit unklar ist.','Gesicherte und unklare Medikamenteninformationen bleiben eindeutig getrennt.']
      ]),
      d('Übernahme vorbereiten','Der Rettungsdienst kommt hinzu. Herr G. antwortet kurzzeitig wieder etwas klarer.','Was gehört in deine sofortige Übergabe?',0,[
        ['Art und Zeit des Sturzes, Kopfaufprall, Schwankungen der Reaktion und die Gerinnungshemmung.','Die vorangegangene Verschlechterung bleibt auch bei kurzfristig klarerer Antwort relevant.'],
        ['Vor allem den aktuellen Zustand und die Tatsache, dass Herr G. im Moment Antworten geben kann.','Der positive Moment darf die vorherige Abnahme der Wachheit nicht verdecken.'],
        ['Den bisherigen Sturzrisikoplan mit dem Ort der Wunde nennen und den übrigen Verlauf im Bericht nachlesen lassen.','Die akuten Ereignis- und Verlaufsdaten müssen das übernehmende Team umgehend erreichen.']
      ])
    ]}
  ];
})();
