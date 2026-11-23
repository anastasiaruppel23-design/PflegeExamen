/* Fiktive Praxis-Challenges. Jede Entscheidung hat eine eigene Situation und Rückmeldung je Option. */
(() => {
  const d = (phase, scene, q, a, choices) => ({
    phase, scene, q, a, opts: choices.map(([option]) => option),
    responses: choices.map(([,reason]) => reason), why: choices[a][1]
  });
  const hygiene = ['KRINKO · Händehygiene und Basishygiene', 'https://www.rki.de/krinko-empfehlungen'];
  const injections = ['RKI · Hygiene bei Punktionen und Injektionen', 'https://www.rki.de/DE/Themen/Infektionskrankheiten/Krankenhaushygiene/Infektionshygiene-A-Z/P/Punktionen-Injektionen/punktionen-node.html'];
  const wound = ['AWMF · S3-Leitlinie zur Lokaltherapie schwerheilender Wunden', 'https://register.awmf.org/de/leitlinien/detail/091-001'];
  const oral = ['NICE · Mundpflege und Schlucken nach Schlaganfall', 'https://www.nice.org.uk/guidance/ng236/chapter/Recommendations#mouth-care'];
  const abcde = ['Resuscitation Council UK · ABCDE Approach', 'https://www.resus.org.uk/library/abcde-approach'];
  const medication = ['WHO · Medication Safety in Transitions of Care', 'https://www.who.int/publications/i/item/WHO-UHC-SDS-2019.9'];
  window.practiceDecisions = [
    {title:'Händehygiene im Pflegealltag', icon:'hands', source:hygiene, steps:[
      d('Vor Patientenkontakt','Du hast vor dem Zimmer die Hände desinfiziert. Im Zimmer bedienst du erst das gemeinsam genutzte Blutdruckgerät und willst dann Herrn U. am Arm unterstützen.','Wann desinfizierst du in dieser Situation erneut?',1,[
        ['Nach dem Blutdruckmessen, bevor ich das Zimmer verlasse.','Der Moment nach der Versorgung bleibt wichtig. Hier entsteht bereits vor dem ersten persönlichen Kontakt eine neue Indikation.'],
        ['Nach dem Bedienen des Geräts und bevor ich den Arm berühre.','Die Desinfektion vor dem direkten Kontakt schützt Herrn U. Eine Berührung des gemeinsam genutzten Geräts liegt dazwischen.'],
        ['Nach dem Anlegen der Manschette, bevor ich den Wert ablese.','Dann ist der direkte Kontakt schon erfolgt. Der richtige Zeitpunkt liegt vor der ersten Berührung.']
      ]),
      d('Unrein zu aseptisch','Du hast den feuchten Altverband mit Handschuhen entfernt. Dieselbe Person braucht jetzt den neuen Wundverband.','Welche Abfolge schützt den Übergang zur aseptischen Tätigkeit?',2,[
        ['Alte Handschuhe ausziehen, den frischen Verband öffnen, dann Hände desinfizieren.','Der Wechsel ist richtig. Das frische Material wird zu früh gehandhabt.'],
        ['Alte Handschuhe ausziehen, neue sterile Handschuhe anziehen und den Verband vorbereiten.','Sterile Handschuhe allein decken die Händehygiene beim Wechsel nicht ab.'],
        ['Alte Handschuhe ausziehen, Hände desinfizieren und neues Material aseptisch handhaben.','Nach dem unreinen Schritt und vor dem aseptischen Folgeschritt braucht es Händehygiene. Je nach Tätigkeit folgen passende neue Handschuhe.']
      ]),
      d('Kontakt zur Patientenumgebung','Du richtest nur den Nachttisch und das Bettgitter. Die Person schläft und wird von dir nicht berührt. Nebenan wartet die nächste Versorgung.','Was ist der nächste passende Hygieneschritt?',0,[
        ['Hände direkt nach dem Kontakt zur Patientenumgebung desinfizieren.','Auch Gegenstände in der unmittelbaren Umgebung der Person können Keime übertragen.'],
        ['Hände erst vor dem Kontakt mit der nächsten Person desinfizieren.','Die nächste Person wäre dann geschützt. Auf dem Weg können bereits andere Oberflächen berührt werden.'],
        ['Erst die berührten Flächen wischen und dann mit dem gleichen Arbeitsablauf hinausgehen.','Die Flächenhygiene hat einen eigenen Zweck. Für deine Hände ist der Moment nach Kontakt zur Patientenumgebung weiterhin relevant.']
      ]),
      d('Durchführung beurteilen','Nach dem Einreiben glänzen die Handflächen, Daumen und Fingerkuppen sind trocken. Die Einwirkzeit läuft noch.','Wie korrigierst du die Durchführung?',2,[
        ['Die verbleibende Zeit nutzen und die bereits feuchten Handflächen weiter verreiben.','Mehr Reiben allein stellt die Benetzung trockener Bereiche für die geforderte Zeit nicht sicher.'],
        ['Die Einwirkzeit abwarten und vor der nächsten Aufgabe Handschuhe anziehen.','Die vergangenen Sekunden gleichen unbenetzte Daumen und Fingerkuppen nicht aus.'],
        ['Mit ausreichender Menge alle Handbereiche für die Einwirkzeit nach Produktangabe benetzen.','Erst wenn alle Bereiche ausreichend und lange genug benetzt sind, ist die Durchführung vollständig.']
      ]),
      d('Hygiene bei Unterbrechung','Du hast dich für eine aseptische Tätigkeit vorbereitet. Auf dem Weg zum sterilen Material hast du kurz den Rufknopf der Person berührt.','Was ist unmittelbar vor dem sterilen Arbeitsschritt passend?',1,[
        ['Weiterarbeiten, da der Rufknopf zur gleichen Person gehört.','Auch bei derselben Person kann der Wechsel von der Umgebung zu einer aseptischen Tätigkeit Keime übertragen.'],
        ['Erneut die Hände desinfizieren und die aseptische Vorbereitung fortsetzen.','Die Unterbrechung hat die Händehygiene vor der aseptischen Handlung unterbrochen. Sie wird direkt davor wiederholt.'],
        ['Erst nach dem sterilen Arbeitsschritt nochmals desinfizieren.','Die Desinfektion danach kann eine Kontamination während des Arbeitsschritts nicht verhindern.']
      ])
    ]},
    {title:'Subkutane Injektion sicher vorbereiten', icon:'shot', source:injections, steps:[
      d('Anordnung prüfen','Für Frau N. liegt eine neue Anordnung zur subkutanen Gabe vor. Der Eintrag und das bereitliegende Präparat haben unterschiedliche Konzentrationen.','Welche Entscheidung ist vor der Vorbereitung am besten begründet?',0,[
        ['Anordnung und verfügbares Präparat mit der zuständigen Fachperson abgleichen.','Bei einem Konzentrationskonflikt muss geklärt sein, welches Präparat mit welcher Dosierung angeordnet ist.'],
        ['Das bisher verwendete Präparat mit dem gewohnten Volumen bereitlegen.','Die bisherige Gabe ist als Vergleich nützlich, löst den Konflikt der neuen Anordnung aber nicht.'],
        ['Die aktuelle Dosis anhand der verfügbaren Packung umrechnen und vorbereiten.','Rechnen allein löst die offene Frage nicht, ob das vorliegende Präparat und seine Konzentration freigegeben sind.']
      ]),
      d('Identität abgleichen','Die Verordnung ist eindeutig. Im Zimmer liegen zwei Personen mit ähnlichen Nachnamen. Eine Person bestätigt auf Nachfrage den Nachnamen.','Wie sicherst du die Zuordnung zusätzlich ab?',2,[
        ['Zimmer und Nachnamen gemeinsam mit dem Plan abgleichen.','Zimmer und Bett können wechseln. Ein Namensbestandteil allein ist in diesem Fall nicht eindeutig.'],
        ['Vornamen von einer Kollegin bestätigen lassen und dann vorbereiten.','Die Einschätzung des Teams kann helfen. Der patientenbezogene Abgleich mit verlässlichen Merkmalen fehlt noch.'],
        ['Die Person möglichst selbst Name und Geburtsdatum nennen lassen und mit der Anordnung abgleichen.','Zwei verlässliche Identitätsmerkmale senken bei ähnlichen Namen das Verwechslungsrisiko. Bei fehlender Auskunft gilt der lokale Identifikationsstandard.']
      ]),
      d('Haut und Plan','Die im Rotationsplan aktuell vorgesehene Stelle ist druckempfindlich und deutlich verhärtet. Die Person hat keine weiteren Beschwerden.','Wie entscheidest du über die Einstichstelle?',1,[
        ['Die vorgesehene Stelle verwenden und den Befund anschließend dokumentieren.','Der Rotationsplan ist eine Orientierung. Der aktuelle Hautbefund muss vor der Gabe einbezogen werden.'],
        ['Die auffällige Stelle aussparen und eine geeignete Stelle nach Präparat und Rotationsplan festlegen.','Die Wahl bezieht Hautzustand und die Vorgaben zum Medikament ein. Die Abweichung lässt sich nachvollziehbar dokumentieren.'],
        ['Eine neue Körperregion unabhängig von den Präparatvorgaben auswählen und notieren.','Ausweichen ist nachvollziehbar. Die Eignung der Region hängt auch vom Präparat und der individuellen Planung ab.']
      ]),
      d('Aseptik nach Zwischenfall','Nach der Hautantiseptik wird die vorbereitete Stelle mit einem nicht sterilen Finger erneut ertastet. Das Präparat und das sterile Material sind unberührt.','Welcher Teil der Vorbereitung muss wiederholt werden?',0,[
        ['Hautantiseptik an der Stelle wiederholen und die Vorgaben zu Einwirkzeit und Trocknung einhalten.','Das erneute Berühren betrifft die vorbereitete Haut. Diese Stelle muss erneut korrekt vorbereitet werden.'],
        ['Sterile Injektionsmaterialien austauschen und die vorbereitete Haut unverändert lassen.','Ein Materialwechsel behebt die Berührung der desinfizierten Haut nicht.'],
        ['Handschuhe wechseln und die bereits begonnene Einwirkzeit zu Ende abwarten.','Die Haut ist durch die Berührung erneut potenziell kontaminiert. Das Abwarten ersetzt keine neue Hautantiseptik.']
      ]),
      d('Einwilligung und Übergabe','Die Person bittet kurz vor der Gabe um eine Pause. Das Präparat ist zeitgebunden. Die Person möchte den Grund für die Gabe besser verstehen.','Wie gehst du mit dem offenen Zeitpunkt um?',2,[
        ['Die Gabe auf die nächste reguläre Runde verschieben und die Zeit später nachtragen.','Eine Pause ist möglich. Bei einer zeitgebundenen Anordnung muss der verschobene Zeitpunkt abgestimmt werden.'],
        ['Die übliche Gabe erklären und die Anordnung als Grund für den aktuellen Zeitpunkt nennen.','Eine verständliche Erklärung ist sinnvoll. Die Entscheidung der Person und der Umgang mit der Verzögerung bleiben offen.'],
        ['Pausenwunsch respektieren, verständlich erklären und den Zeitpunkt mit der zuständigen Fachperson klären.','Damit bleiben Selbstbestimmung und die Sicherheit der zeitgebundenen Behandlung gleichermaßen berücksichtigt.']
      ])
    ]},
    {title:'Transfer vom Bett in den Rollstuhl', icon:'chair', source:['BGW · Menschen bewegen in der Pflege','https://www.bgw-online.de/bgw-online-de/themen/gesund-im-betrieb/gesunder-ruecken/menschen-bewegen-94496'], steps:[
      d('Tagesform erfassen','Frau T. konnte gestern mit einer Pflegeperson stehen. Heute ist sie müde und sagt, ihr linkes Knie gebe nach. Der Rollstuhl steht bereit.','Worauf stützt du die Entscheidung zum geplanten Transfer?',1,[
        ['Den Transfer wie gestern vorbereiten und auf Veränderungen beim Aufstehen achten.','Der Plan vom Vortag ist hilfreich, berücksichtigt aber das neu gemeldete Nachgeben vor der Belastung nicht.'],
        ['Aktuelle Belastbarkeit und Freigaben prüfen und Hilfe oder Hilfsmittel passend neu festlegen.','Fähigkeiten und Risiken können sich von Tag zu Tag verändern. Das neue Symptom beeinflusst die Wahl der Technik.'],
        ['Eine zweite Person dazuholen und den bisherigen Transfer unverändert wiederholen.','Mehr Personal kann nützlich sein. Die Eignung der Technik muss bei verändertem Zustand zuerst beurteilt werden.']
      ]),
      d('Umgebung vorbereiten','Der Transfer im Stand wurde als geeignet eingeschätzt. Der Rollstuhl ist gebremst, die Fußstützen ragen aber in den geplanten Weg.','Was änderst du, bevor Frau T. aufsteht?',2,[
        ['Die Position des Stuhls unverändert lassen und Frau T. mit klaren Kommandos darüberführen.','Anleitung hilft, löst das Hindernis im geplanten Bewegungsweg aber nicht.'],
        ['Den Stuhl weiter wegstellen und den Weg mit der Person gemeinsam verlängern.','Mehr Weg macht den Transfer anstrengender. Das Hindernis lässt sich direkt beseitigen.'],
        ['Die Fußstützen aus dem Weg bringen und Stuhlposition, Bremse und Standfläche erneut prüfen.','Die Person braucht einen freien, kurzen Bewegungsweg und einen stabil bereitgestellten Rollstuhl.']
      ]),
      d('Schwindel am Bettrand','Frau T. wird beim ersten Sitzen am Bettrand plötzlich blass und sagt, es werde ihr schwarz vor Augen. Sie antwortet auf Ansprache.','Welche Reaktion hat jetzt Vorrang?',0,[
        ['Den Transfer stoppen, sie sichern, ihren Zustand beurteilen und bei Bedarf Hilfe holen.','Die neue Kreislaufreaktion erhöht beim Aufstehen die Sturzgefahr. Erst Sicherheit und Zustand klären.'],
        ['Den vorbereiteten Rollstuhl rasch heranziehen und sie direkt hineinsetzen.','Der Rollstuhl ist ein Ziel, aber der Weg dorthin kann bei drohender Ohnmacht die riskanteste Phase sein.'],
        ['Den Blutdruck messen lassen und danach über eine Unterbrechung entscheiden.','Eine Messung kann folgen. Das Sichern und Unterbrechen darf nicht vom Messwert abhängen.']
      ]),
      d('Ressourcen nutzen','Beim nächsten Versuch ist Frau T. wieder stabil. Sie kann sich mit einer Hand abstützen und möchte selbst das Zeichen zum Aufstehen geben.','Wie lässt du ihre Ressourcen am besten in den Transfer einfließen?',2,[
        ['Das Zeichen selbst geben, damit sich die zweite Helferin gut darauf einstellen kann.','Abstimmung ist wichtig. Das Startzeichen der Person lässt sich mit den Helfenden ebenso vereinbaren.'],
        ['Den Transfer möglichst vollständig übernehmen und ihr anschließend die Schritte erklären.','Das kann bei fehlender Belastbarkeit nötig sein. Hier sind Beteiligung und sichere Eigenaktivität möglich.'],
        ['Startzeichen mit ihr vereinbaren, das Abstützen vorbereiten und nur die benötigte Hilfe geben.','So kann Frau T. aktiv teilnehmen. Das Team kennt den Ablauf und bleibt auf mögliche Änderungen vorbereitet.']
      ]),
      d('Auswirkung überprüfen','Im Rollstuhl sitzt Frau T. schräg und meldet neuen Druck am linken Oberschenkel. Der Transport zum Termin steht bevor.','Was tust du vor der Weiterfahrt?',1,[
        ['Den Druck dokumentieren und an der Zielstation überprüfen lassen.','Dokumentation hilft. Die druckauslösende Position wirkt während der Fahrt aber weiter.'],
        ['Sitzposition und mögliche Druckquelle mit ihr prüfen, korrigieren und nach dem Befinden fragen.','Eine sichere Sitzposition und die erneute Rückmeldung zeigen, ob die Versorgung gerade passt.'],
        ['Die Fußstützen niedriger stellen und dann den Termin wahrnehmen.','Die Fußstützen könnten beteiligt sein. Ohne Sitz- und Ursachenprüfung bleibt unklar, ob die Änderung hilft.']
      ])
    ]},
    {title:'Sterile Wundversorgung', icon:'wound', source:wound, steps:[
      d('Wechsel vorbereiten','Bei einer chronischen Wunde ist der Verbandwechsel geplant. Der Materialwagen wurde bereits genutzt. Ein Teil des benötigten Materials liegt noch im Flur.','Was organisierst du vor dem Freilegen der Wunde?',2,[
        ['Den alten Verband abnehmen, die Wunde ansehen und danach Material gezielt holen.','Die Beobachtung ist sinnvoll. Ein vermeidbarer Materialwechsel während offener Wundversorgung erschwert den aseptischen Ablauf.'],
        ['Sterile Packungen auf den Wagen legen und die Arbeitsfläche später vorbereiten.','Sterile Packungen allein machen die benutzte Arbeitsfläche nicht zur geeigneten Ablage.'],
        ['Saubere Arbeitsfläche und vollständiges passendes Material vorbereiten sowie den Plan prüfen.','So lassen sich unreine und aseptische Arbeitsschritte trennen und Unterbrechungen vermeiden.']
      ]),
      d('Übergang nach Altverband','Der Altverband wurde mit unsterilen Einmalhandschuhen entfernt. Jetzt sollen Wunde und sterile Materialien berührungsarm versorgt werden.','Welche nächste Handlung wahrt die aseptische Trennung?',1,[
        ['Mit den benutzten Handschuhen das Material öffnen und erst vor Wundkontakt wechseln.','Beim Öffnen könnte der saubere Arbeitsbereich bereits verunreinigt werden.'],
        ['Benutzte Handschuhe ausziehen, Hände desinfizieren und aseptisch weiterarbeiten.','Der unreine Arbeitsschritt ist abgeschlossen. Jetzt folgt der vorbereitete aseptische Schritt nach Standard.'],
        ['Handschuhe wechseln und danach direkt das sterile Material aufnehmen.','Der Handschuhwechsel ist nötig, umfasst aber die Händehygiene dazwischen nicht.']
      ]),
      d('Kontamination erkennen','Beim Öffnen berührt die sterile Pinzettenspitze den äußeren Rand der nicht sterilen Verpackung. Ersatzmaterial liegt bereit.','Wie reagierst du auf die versehentliche Berührung?',0,[
        ['Pinzette ersetzen und prüfen, ob weitere sterile Materialien berührt wurden.','Die Spitze ist nicht mehr als steril anzusehen. Nur Material mit intakter Sterilität bleibt im Einsatz.'],
        ['Pinzette mit der anderen Hand übernehmen und den Verband berührungsarm auflegen.','Die Handhabung ändert nichts an der kontaminierten Spitze.'],
        ['Das Instrument für die äußerste Schicht behalten und die Wundauflage zuerst versorgen.','Die Trennung der Schichten begrenzt Kontakt. Sie ist in diesem aseptischen Arbeitsschritt kein Ersatz für verfügbares steriles Material.']
      ]),
      d('Veränderung einordnen','Die Wunde war zuletzt reizarm. Heute beobachtest du mehr Exsudat, zunehmende Rötung und neu stärkere Schmerzen. Die Person ist ansprechbar und kreislaufstabil.','Wie gehst du mit der Veränderung um?',2,[
        ['Den Wechsel nach Plan durchführen und für die nächste Visite einen Vermerk machen.','Der Vergleich ist hilfreich. Die Kombination neu auftretender Zeichen braucht eine zeitnahe fachliche Einschätzung.'],
        ['Die erhöhte Exsudatmenge zum Anlass nehmen, selbst eine neue Wundauflage auszuwählen.','Eine andere Auflage kann später sinnvoll sein. Zuerst geht es um die Ursache der Veränderung und die abgestimmte Entscheidung.'],
        ['Befund und Verlauf erfassen, fachlich weitergeben und über die weitere Versorgung Rücksprache halten.','Mehrere neue Zeichen zusammen wiegen mehr als ein Einzelbefund. Die Versorgung wird an die neue Beurteilung angepasst.']
      ]),
      d('Verlauf nachvollziehbar halten','Die Fachperson hat den Befund beurteilt. Der Wechsel erfolgte nach abgestimmtem Plan. Beim Wechsel meldete die Person Schmerz, der danach nachließ.','Welche Dokumentation hilft der nächsten Schicht?',1,[
        ['Wundgröße und Produkt dokumentieren, da sich der Schmerz nach dem Wechsel beruhigt hat.','Größe und Produkt sind nützlich. Der neue Befund, die Schmerzreaktion und die Rücksprache fehlen.'],
        ['Wundveränderungen, Schmerzverlauf, Versorgung und Ergebnis der Rücksprache festhalten.','Die nächste Schicht kann Befunde und Reaktionen vergleichen und den vereinbarten Plan nachvollziehen.'],
        ['Die abgeänderte Maßnahme und den Zeitpunkt nennen, den Wundbefund aus dem Verlauf übernehmen.','Der aktuelle Befund ist die Grundlage der Änderung. Ein späterer Vergleich braucht die neuen Beobachtungen.']
      ])
    ]},
    {title:'Vitalzeichen und Verschlechterung', icon:'pulse', source:abcde, steps:[
      d('Messfehler oder Veränderung','Herr D. bewegt den Arm während der automatischen Blutdruckmessung. Der Wert liegt deutlich unter seinem Ausgangswert. Er ist ansprechbar, aber blasser als beim letzten Kontakt.','Wie ordnest du diesen Befund ein?',2,[
        ['Den Wert wegen der Bewegung als Messartefakt werten und später erneut messen.','Bewegung kann den Wert verfälschen. Die neue Blässe ist ein unabhängiger klinischer Hinweis.'],
        ['Den Messwert weitergeben und dabei besonders die mögliche Geräteabweichung betonen.','Melden ist sinnvoll. Die klinische Einschätzung und ein geeigneter Kontrollwert gehören zur Beurteilung.'],
        ['Zustand unmittelbar einschätzen, passende Kontrollmessung veranlassen und nach Dringlichkeit Hilfe holen.','Messqualität und klinischer Eindruck werden zusammen betrachtet. Warnzeichen haben auch während der Kontrollmessung Gewicht.']
      ]),
      d('Trend statt Einzelwert','Der Blutdruck ist bei der Kontrolle höher. Gleichzeitig atmet Herr D. deutlich schneller und wird beim Sprechen unaufmerksam.','Welche Information bestimmt die Dringlichkeit?',0,[
        ['Die neue schnelle Atmung und Aufmerksamkeitsänderung auch bei verbessertem Blutdruck.','Ein gebesserter Einzelwert erklärt die neuen Atem- und Bewusstseinszeichen nicht.'],
        ['Die Annäherung des Blutdrucks an den Ausgangswert als wichtigstes Zeichen der Erholung.','Der Kreislaufwert ist ein Teilbefund. Die anderen Vitalfunktionen zeigen eine mögliche Verschlechterung.'],
        ['Der Mittelwert beider Blutdruckmessungen zusammen mit der zuletzt dokumentierten Temperatur.','Ein Mittelwert kann den Verlauf verschleiern. Die aktuell veränderten Funktionen sind dringlicher.']
      ]),
      d('Aufgaben parallel verteilen','Eine Kollegin kommt hinzu. Herr D. spricht nur noch in kurzen Abschnitten. Die Ursache ist weiterhin unklar.','Wie nutzt du die Unterstützung in diesem Moment am besten?',1,[
        ['Die Kollegin bittet dich, erst alle Werte zu vervollständigen, und überprüft derweil die Akte.','Die Vorgeschichte ist nützlich, kann nach der Alarmierung und Erstsichtung recherchiert werden.'],
        ['Eine Person alarmiert nach Notfallplan, die andere bleibt beim Patienten und beurteilt weiter.','Klare Rollen ermöglichen frühe Hilfe und fortgesetzte Beobachtung gleichzeitig.'],
        ['Ihr messt gemeinsam nacheinander die Vitalzeichen und meldet erst danach den vollständigen Befund.','Vollständigkeit ist wünschenswert. Der erkennbare Zustand reicht bereits aus, um Hilfe auszulösen.']
      ]),
      d('SBAR anwenden','Die zuständige Fachperson meldet sich am Telefon. Sie fragt, welche Unterstützung du brauchst.','Was gehört jetzt zur Empfehlung in deiner SBAR-Übergabe?',2,[
        ['Den letzten stabilen Blutdruck und die Uhrzeit nochmals nennen.','Das ergänzt den Verlauf. Es sagt noch nicht, was du von der angerufenen Person brauchst.'],
        ['Die wahrscheinlichste Diagnose nennen und die weiteren Fragen der Fachperson abwarten.','Eine Einschätzung kann dazugehören. Die konkrete Bitte um Hilfe bleibt offen.'],
        ['Um sofortige Beurteilung vor Ort bitten und klären, wer welche Maßnahmen übernimmt.','Die Empfehlung macht den benötigten nächsten Schritt und die Aufgabenverteilung ausdrücklich.']
      ]),
      d('Wirkung kontrollieren','Nach einer übernommenen Maßnahme wirkt Herr D. wacher. Die Atmung ist noch auffällig schnell.','Wie bewertest du diese Teilbesserung?',0,[
        ['Wachheit und Atmung erneut zusammen beurteilen und den verbleibenden Befund melden.','Eine Maßnahme kann einzelne Zeichen bessern. Das anhaltende Atemproblem muss im Verlauf sichtbar bleiben.'],
        ['Den guten Wachheitsbefund übergeben und den üblichen späteren Kontrollzeitpunkt abwarten.','Der positive Befund gehört in die Übergabe. Die Atemveränderung braucht eine passende erneute Einschätzung.'],
        ['Den zuletzt gemessenen Blutdruck als Entscheidungskriterium für das weitere Monitoring verwenden.','Die Atemfrequenz und weitere Befunde bleiben auch bei einem guten Blutdruck relevant.']
      ])
    ]},
    {title:'Mundpflege bei eingeschränkter Schluckfähigkeit', icon:'mouth', source:oral, steps:[
      d('Mundpflege vorbereiten','Frau K. hat nach einem Schlaganfall eine Schluckstörung. Im Plan steht unterstützte Mundpflege ohne Spülen. Heute ist sie deutlich schläfriger als gestern.','Was klärst du, bevor du beginnst?',1,[
        ['Den vorhandenen Mundpflegeplan übernehmen und die Mundpflege im vorgesehenen Ablauf starten.','Der Plan bleibt wichtig. Die veränderte Wachheit kann die Sicherheit heute verändern.'],
        ['Wachheit, Zustimmung und eine sichere Position jetzt prüfen und den aktuellen Zustand mit dem Plan abgleichen.','Der bisherige Plan ersetzt die Einschätzung der aktuellen Situation nicht. Neu aufgetretene Schläfrigkeit wird weitergegeben.'],
        ['Die Anzahl der benötigten Mundpflegematerialien prüfen und eine Kollegin zur Unterstützung einplanen.','Vorbereitung und Hilfe können nützlich sein. Die entscheidende Frage ist aktuell, ob die Person sicher teilnehmen kann.']
      ]),
      d('Individuell unterstützen','Später ist Frau K. wieder ausreichend wach. Sie kann ihre Zahnbürste halten und vorne selbst putzen. Beim Ausspucken braucht sie Unterstützung. Der Plan sieht keine Spülflüssigkeit vor.','Wie nutzt du ihre Fähigkeiten sicher?',2,[
        ['Die Mundpflege ganz übernehmen, um die Verwendung von Flüssigkeit besser zu kontrollieren.','Vollständige Übernahme kann bei höherem Hilfebedarf nötig sein. Die vorhandene Teilfähigkeit bleibt hier nutzbar.'],
        ['Sie selbst putzen lassen und zunächst abwarten, wie sie mit Speichel und Rückständen umgeht.','Selbstpflege ist sinnvoll. Der bereits bekannte Hilfebedarf beim Ausspucken muss von Beginn an eingeplant werden.'],
        ['Sie geeignete Bereiche selbst putzen lassen und beim Umgang mit Rückständen nach Mundpflegeplan helfen.','Das verbindet sicheren Ablauf und Selbstständigkeit. Die Unterstützung richtet sich nach dem tatsächlich vorhandenen Bedarf.']
      ]),
      d('Warnzeichen während der Pflege','Während der unterstützten Mundpflege hustet Frau K. wiederholt. Ihre Stimme klingt plötzlich feucht. Sie ist ansprechbar.','Was ist die passende erste Reaktion?',0,[
        ['Pflege unterbrechen, Atmung, Stimme und Wachheit beurteilen und die Auffälligkeit weitergeben.','Neue Schluck- oder Atemauffälligkeiten erfordern eine erneute Einschätzung vor der Fortsetzung. Bei bedrohlicher Atemveränderung gilt der Notfallweg.'],
        ['Kurz pausieren und nach dem nächsten ruhigen Atemzug den gleichen Pflegeschritt erneut versuchen.','Die Pause ist sinnvoll. Ein einzelner ruhiger Atemzug klärt das neue Warnzeichen noch nicht.'],
        ['Die Mundpflege auf die vorderen Zahnflächen begrenzen und die Beobachtung anschließend notieren.','Eine Begrenzung kann später geeignet sein. Bei neuen Warnzeichen hat die Unterbrechung und Einschätzung Vorrang.']
      ]),
      d('Ablehnung verstehen','Am Nachmittag ist der Zustand abgeklärt. Als du die Bürste bringst, dreht Frau K. den Kopf weg und zeigt auf eine wunde Stelle an der Lippe.','Wie gehst du mit der Reaktion um?',2,[
        ['Die Bürste wechseln und mit der begonnenen Mundpflege vorsichtig fortfahren.','Ein anderes Hilfsmittel kann helfen. Zuerst muss Frau K. mitteilen können, ob und wie sie weiter versorgt werden möchte.'],
        ['Die Mundpflege für den Rest des Tages zurückstellen und die Ablehnung allein dokumentieren.','Eine Pause ist angemessen. Die schmerzhafte Stelle und eine mögliche Anpassung bleiben dabei ungeklärt.'],
        ['Kurz stoppen, die Beschwerde erfragen und eine verträgliche Alternative gemeinsam abstimmen.','Die Reaktion ist ein Hinweis auf Schmerz oder Ablehnung. Einwilligung, Beschwerden und der individuelle Plan bestimmen den nächsten Schritt.']
      ]),
      d('Übergabe','Eine Kollegin übernimmt abends. Frau K. konnte nach Anpassung selbst vorn putzen. Im Verlauf gab es Husten und eine feuchte Stimme bei einem früheren Versuch.','Welche Übergabe unterstützt die sichere nächste Mundpflege?',1,[
        ['Die gelungene Teilselbstständigkeit und die verwendete Bürste nennen.','Die Ressourcen sind wichtig. Das frühere Warnzeichen und die abgestimmte Unterstützung fehlen.'],
        ['Wachheit, Eigenanteil, Warnzeichen und die abgestimmte Art der Unterstützung konkret übergeben.','Die nächste Person kann Veränderungen erkennen und auf die sichere, individuelle Vorgehensweise zurückgreifen.'],
        ['Die Diagnose Dysphagie und die ursprüngliche Planung zusammenfassen.','Die Diagnose erklärt das Risiko. Sie enthält weder den heutigen Verlauf noch die hilfreichen Anpassungen.']
      ])
    ]},
    {title:'Schutzkleidung im Isolationszimmer', icon:'shield', source:hygiene, steps:[
      d('Schutzmaßnahmen auswählen','Für eine Person sind Kontaktmaßnahmen ausgewiesen. Du sollst den verschmutzten Wäschebeutel versorgen und der Plan liegt einsehbar am Eingang.','Woran richtest du deine Schutzkleidung aus?',0,[
        ['Kontaktweg und erwartete Exposition bei der Tätigkeit mit dem aktuellen Hygieneplan abgleichen.','Die konkrete Tätigkeit entscheidet mit, welche Schutzmaßnahmen in der Situation nötig sind.'],
        ['Die Schutzkleidung des letzten Isolationszimmers übernehmen, weil beide Türen gleich markiert sind.','Gleiche Markierung kann unterschiedliche Erreger oder zusätzliche Schutzmaßnahmen umfassen.'],
        ['Vor allem den Atemschutz verstärken und die übrige Ausrüstung nach Basishygiene wählen.','Atemschutz kann bei anderer Exposition wichtig sein. Hier steht die Exposition bei Kontakt mit Material im Vordergrund.']
      ]),
      d('Material organisieren','Du wirst das Zimmer gleich betreten. Eine benötigte Einmalunterlage fehlt. Eine Kollegin arbeitet draußen im sauberen Bereich.','Welche Vorbereitung reduziert Bereichswechsel und Kontamination?',2,[
        ['Die fehlende Unterlage während der Versorgung selbst aus dem Stationslager holen.','Der zusätzliche Wechsel zwischen Bereichen erschwert eine konsequente Trennung.'],
        ['Vor dem Betreten einen Vorrat für die ganze Woche mit ins Zimmer nehmen.','Vorausschau ist hilfreich. Unnötiges Material kann kontaminiert werden oder unbrauchbar werden.'],
        ['Bedarf vorher vervollständigen und für Nachforderungen eine saubere Übergabe mit der Kollegin absprechen.','Das hält den Materialfluss kontrollierbar und ermöglicht Unterstützung ohne zusätzliche kontaminierte Kontakte.']
      ]),
      d('Tätigkeit im Zimmer wechseln','Nach Kontakt mit benutzter Wäsche sollst du bei derselben Person eine saubere Versorgung vorbereiten. Die Handschuhe wirken von außen trocken.','Welcher Übergang ist angemessen?',1,[
        ['Die trockenen Handschuhe für die Materialvorbereitung weitertragen und erst bei sichtbarer Kontamination wechseln.','Sichtbare Sauberkeit sagt wenig über eine mögliche Übertragung aus.'],
        ['Handschuhe ausziehen, Hände desinfizieren und saubere Versorgung vorbereiten.','Handschuhe werden abgelegt und die Hände desinfiziert, bevor bei Bedarf neue Handschuhe angezogen werden. Das gilt auch bei derselben Person.'],
        ['Den Schutzkittel wechseln und die Handschuhe bis zum Ende der Versorgung behalten.','Das Wechseln einer kontaminierten Schicht kann nötig sein. Es ersetzt den Wechsel an den Händen nicht.']
      ]),
      d('Ablegen und Trennung','Nach der Versorgung willst du das Zimmer verlassen. Auf der Außenseite des Kittels wurde während der Wäscheversorgung gearbeitet.','Was ist beim Ablegen ausschlaggebend?',2,[
        ['Den Kittel an der Vorderseite greifen, damit die Ärmel möglichst schnell abgenommen werden.','Die Außenseite kann kontaminiert sein. Schnelligkeit geht hier nicht vor einem sicheren Ablegeablauf.'],
        ['Die Schutzkleidung erst in der Stationsschleuse ablegen, unabhängig von den Vorgaben am Zimmer.','Der Ort des Ablegens hängt von Einrichtung, Tätigkeit und Ausrüstung ab. Ein Bereichswechsel kann Kontamination verschleppen.'],
        ['Den vorgesehenen Ablegeort und die Reihenfolge nach Hygieneplan beachten und Selbstkontamination vermeiden.','Kontaminierte Außenflächen bleiben von Haut und Kleidung fern. Die Händehygiene gehört zum Ablegeablauf.']
      ]),
      d('Weitergabe bei Transport','Die Person soll zu einer zeitgebundenen Untersuchung. Der genaue fortbestehende Schutzbedarf ist im aktuellen Hygieneplan beschrieben.','Wie bereitest du den Transport vor?',0,[
        ['Zielbereich vorab informieren und die konkreten Transportmaßnahmen abstimmen.','So kann die notwendige Untersuchung unter abgestimmten Schutzmaßnahmen stattfinden.'],
        ['Die Versorgung übergeben und dem Zielbereich den Isolationsbedarf erst bei Ankunft erklären.','Die Information ist richtig, erreicht das Zielteam aber zu spät für die Vorbereitung.'],
        ['Den Transport aussetzen und warten, bis die Isolation regulär aufgehoben ist.','Eine notwendige Untersuchung kann unter geeigneten Maßnahmen möglich sein. Die Dringlichkeit und Schutzmaßnahmen werden vorher abgestimmt.']
      ])
    ]},
    {title:'Medikamentengabe und Rückfrage', icon:'med', source:medication, steps:[
      d('Widerspruch vor Gabe','Im Entlassbrief wurde ein Medikament reduziert. In der aktuellen Kurve steht unverändert die alte Menge. Die nächste Gabe ist fällig.','Wie gehst du mit dem widersprüchlichen Eintrag um?',1,[
        ['Die Menge aus dem Entlassbrief wählen, weil der Brief den jüngsten Zeitstempel hat.','Der Zeitpunkt hilft bei der Rekonstruktion. Eine verbindlich geklärte Anordnung für diese Gabe fehlt trotzdem.'],
        ['Die betreffende Gabe bis zur zeitnahen Klärung zurückstellen und die Abweichung gezielt melden.','So werden Über- und Unterdosierung durch zwei widersprüchliche Einträge vermieden. Die Dringlichkeit der Gabe gehört in die Rückfrage.'],
        ['Die Menge aus der Kurve geben und bei der nächsten Übergabe um Aktualisierung bitten.','Die Kurve ist ein wichtiger Bezugspunkt. Der erkennbare Konflikt muss vor der Gabe geklärt werden.']
      ]),
      d('Telefonische Rückfrage','Die zuständige Person beantwortet deine Rückfrage am Telefon. Du hast den Medikamentennamen gut verstanden, die genannte Dosis aber akustisch nicht zweifelsfrei erfasst.','Was sichert die Kommunikation jetzt am besten ab?',2,[
        ['Die Dosis aus der Kurve zur Orientierung nutzen und den Telefonkontakt dokumentieren.','Der vorherige Eintrag kann gerade die fragliche Information enthalten. Die Rückmeldung muss eindeutig sein.'],
        ['Einer Kollegin die vermutlich genannte Dosis weitergeben und nach der üblichen Menge fragen.','Die übliche Menge hilft beim Plausibilitätscheck, kann die konkrete Anordnung aber nicht bestätigen.'],
        ['Die Aussage nochmals erfragen, vollständig zurücklesen und nach Vorgabe verbindlich festhalten lassen.','Eine Rücklesebestätigung prüft den Informationsweg. Die örtlichen Regeln zur Anordnung und Dokumentation bleiben maßgeblich.']
      ]),
      d('Schluckproblem','Nach der Klärung steht eine Tablette mit veränderter Wirkstofffreisetzung zur Gabe an. Die Person berichtet plötzlich, Tabletten nicht mehr sicher schlucken zu können.','Welche nächste Handlung ist sicher?',0,[
        ['Gabe in dieser Form zurückstellen und Eignung einer Alternative ärztlich oder pharmazeutisch klären.','Schluckfähigkeit und Darreichungsform müssen zusammen passen. Für manche Präparate verändert Zerkleinern die Freisetzung.'],
        ['Die Tablette mit einer gewohnten Speise geben, damit sie leichter geschluckt werden kann.','Die Speise kann helfen, wenn die Schlucksituation beurteilt ist. Die neue Angabe wird hier zunächst abgeklärt.'],
        ['Die Tablette vor dem Verabreichen teilen, um die Portionen zu verkleinern.','Teilen kann die Darreichungsform und Wirkstofffreisetzung verändern. Dazu braucht es eine Prüfung des konkreten Präparats.']
      ]),
      d('Gabe offen oder erfolgt','Beim Schichtwechsel ist eine zeitgebundene Gabe nicht als erfolgt dokumentiert. Die Person erinnert sich an eine ähnliche Tablette vor dem Essen.','Wie gehst du mit der Unsicherheit um?',2,[
        ['Die Person erneut nach Farbe und Form fragen und danach über die Wiederholung entscheiden.','Die Aussage gehört zur Klärung. Form und Farbe allein identifizieren eine Gabe nicht verlässlich.'],
        ['Auf die nächste planmäßige Gabe warten und das fehlende Häkchen unverändert lassen.','Ein Aufschub kann Auswirkungen haben. Die Unsicherheit und das Zeitfenster sollen aktiv geklärt werden.'],
        ['Dokumentation, zuständige Vorgängerschicht und verfügbare Informationen zeitnah abgleichen.','Der Abgleich senkt das Risiko einer Doppelgabe oder Auslassung. Bei weiter unklarem Status holst du eine verbindliche Entscheidung ein.']
      ]),
      d('Wirkung und Nebenwirkung','Nach der eindeutig angeordneten Gabe meldet die Person neuen Schwindel. Sie ist ansprechbar, möchte aber allein zur Toilette gehen.','Welche pflegerische Reaktion passt jetzt?',1,[
        ['Den Schwindel als mögliche bekannte Nebenwirkung notieren und bei der Routinekontrolle nachfragen.','Der Verdacht kann in die Dokumentation. Die aktuelle Sturzgefahr braucht unmittelbar Aufmerksamkeit.'],
        ['Situation sichern, klinisch einschätzen und zeitlichen Zusammenhang sowie Befund rückmelden.','Die neue Beschwerde wird ernst genommen. Der zeitliche Zusammenhang ist für die Beurteilung hilfreich, beweist die Ursache aber nicht.'],
        ['Die nächste Dosis im Plan zurückstellen und ihre Wirkung später vergleichen.','Eine mögliche Therapieanpassung gehört in die Rücksprache. Die unmittelbare Sicherung und Einschätzung stehen jetzt an.']
      ])
    ]}
  ];
})();
