# PflegeFokus – by ANA Digital

PflegeFokus ist eine deutschsprachige Lern-App für die Pflegeausbildung und die schriftliche, praktische und mündliche Prüfung. Sie verbindet Wissensseiten, Lernkarten, Quizfragen, Fallarbeit und Prüfungssimulation.

## Lernbestand (Stand 7. November 2026)

- 89 Wissensthemen: 36 bestehende Themen und 53 ergänzte/vertiefte Lernseiten.
- 75 Lernkarten und 70 Fragen im allgemeinen Wissensquiz.
- 100 Kompetenzbereich-Fragen zu den fünf Kompetenzbereichen.
- 54 Krankheits- und Pflegeprofile im visuellen Bereich: 45 bestehende Profile sowie 9 ergänzte Krankheitsbild-Entwürfe. Die 9 neuen Profile sind sichtbar als fachlich noch nicht einzeln geprüft gekennzeichnet.
- 40 ältere Fallsituationen, sechs ausführliche Prüfungsfälle und zusätzliche vernetzte Lernfälle.

Die Krankheitsprofile sind in der Wissensbibliothek nach Organsystemen gruppiert (Herz/Kreislauf, Atemwege, Verdauung, Bewegungsapparat, Nieren/Harnwege, Hormone/Stoffwechsel, Nervensystem, Psyche, Krebs/Blut, Pädiatrie/Schwangerschaft, Infektionen, Haut/Wunden). Sie enthalten Definition, Entstehung, Beschwerden und Warnzeichen, Diagnostik und Therapie im Überblick, pflegerische Einschätzung und Handeln, einen Prüfungsimpuls, eine Transferfrage mit Lösung und einen Quellenlink. Anatomische Lernbilder sind mit Alternativtext, Bildunterschrift, Urheber und Lizenz versehen; externe Commons-Bilder benötigen eine Internetverbindung. Die Pflegefachkraft-Illustration zeigt Anastasia nach ihren Referenzfotos; die Vorgabe für weitere Abbildungen ist in `VISUAL-STYLE.md` festgehalten.


## Lernpfad, Wiederholung und Üben

- Der frühere persönliche Kalenderplan mit festem Prüfungstermin und eigenen Wochenangaben ist entfernt. „Dein Lernweg“ wird aus dem Lernstand der jeweiligen Person erzeugt; die Startseite zeigt „Heute weiterlernen“.
- Quizfragen aus Krankheitsprofilen, Wissensquiz und Kompetenztrainer werden in einem Themenquiz zusammengeführt. Nach der Antwort erklärt die App die Lösung; Lernende markieren ihre Sicherheit. Falsche/unsichere Antworten werden früher zur Wiederholung fällig. Auch Lernkarten können so bewertet werden.
- Der Bereich „Wissensstand“ zeigt Antworten und Wiederholungen nach Themenfeldern.
- Der Notfallsimulator bietet fiktive Entscheidungen mit Rückmeldung und unterschiedlichen Lern-Ausgängen.
- Praxis-Challenges üben unter anderem Hygiene, Injektion, Transfer, Wundversorgung, Vitalzeichen und weitere Abläufe mit Begründungen. Sie ersetzen keine angeleitete praktische Übung.
- Schriftliche Übungsprüfungen enthalten drei ausführliche Fälle mit jeweils 18 fallbezogenen Aufgaben, Aufgabenoperatoren und fallspezifischen Erwartungshinweisen. Mündliche Übungsfälle behandeln die Kompetenzbereiche III–V. Für die praktische Abschlussprüfung stellt die App ausdrücklich kein erfundenes Fallbeispiel bereit; geübt werden soll in der jeweiligen Ausbildungseinrichtung.
- Lernmodule können lokal gespeichert werden. Lokale Text- und Bilddateien sind offline verfügbar; externe Wikimedia-Bilder benötigen weiterhin Internet.

## Fachliche Einordnung

Die App bereitet prüfungsrelevante Pflegekompetenz vor. Sie ist kein vollständiges medizinisches Nachschlagewerk und keine verbindliche klinische Handlungsanweisung. Ärztliche Diagnostik und Therapie, aktuelle Leitlinien, betriebliche Standards und die individuelle Situation bleiben maßgeblich. Quellen mit abgelaufener Gültigkeit oder laufender Aktualisierung sind auf den betroffenen Lernseiten ausdrücklich gekennzeichnet.

Der Prüfungsbereich orientiert sich an den Pflegeberufe-Prüfungsregeln. Das bedeutet nicht automatisch, dass jede ältere Karte, jede Frage und jeder Fall bereits einzeln fachlich freigegeben ist. Der Stand und offene Prüfbereiche sind in [REVIEW.md](REVIEW.md) dokumentiert.

## App und Entwicklung

Die Anwendung ist als Progressive Web App aufgebaut und wird über GitHub Pages veröffentlicht. Änderungen am Wissensbestand liegen in `disease-library.js` und `library.js`; die Darstellung liegt in `visual-library.js`. Nach Änderungen an den geladenen JavaScript-Dateien sind die Versionsverweise in `index.html` und der Offline-Cache in `sw.js` zu aktualisieren.

Die App enthält lokale Lernstands- und Exportfunktionen. Die genutzten Konto- und Synchronisierungsfunktionen hängen von der aktuellen App-Konfiguration ab.

