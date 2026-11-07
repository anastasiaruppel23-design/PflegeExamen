# PflegeFokus – by ANA Digital

PflegeFokus ist eine deutschsprachige Lern-App für die Pflegeausbildung und die schriftliche, praktische und mündliche Prüfung. Sie verbindet Wissensseiten, Lernkarten, Quizfragen, Fallarbeit und Prüfungssimulation.

## Lernbestand (Stand 7. November 2026)

- 76 Wissensthemen: 36 bestehende Themen und 40 ergänzte/vertiefte Lernseiten.
- 75 Lernkarten und 70 Fragen im allgemeinen Wissensquiz.
- 100 Kompetenzbereich-Fragen zu den fünf Kompetenzbereichen.
- 32 ausführliche Krankheits- und Pflegeprofile: 29 Krankheitsbilder sowie Tracheostoma/Cuff, Thoraxdrainage und CABCDE.
- 40 ältere Fallsituationen, sechs ausführliche Prüfungsfälle und zusätzliche vernetzte Lernfälle.

Die Krankheitsprofile sind nach Organsystemen geordnet. Sie enthalten Definition, Entstehung, Beschwerden und Warnzeichen, Diagnostik und Therapie im Überblick, pflegerische Einschätzung und Handeln, einen Prüfungsimpuls, eine Transferfrage mit Lösung und einen Quellenlink.

## Fachliche Einordnung

Die App bereitet prüfungsrelevante Pflegekompetenz vor. Sie ist kein vollständiges medizinisches Nachschlagewerk und keine verbindliche klinische Handlungsanweisung. Ärztliche Diagnostik und Therapie, aktuelle Leitlinien, betriebliche Standards und die individuelle Situation bleiben maßgeblich. Quellen mit abgelaufener Gültigkeit oder laufender Aktualisierung sind auf den betroffenen Lernseiten ausdrücklich gekennzeichnet.

Der Prüfungsbereich orientiert sich an den Pflegeberufe-Prüfungsregeln. Das bedeutet nicht automatisch, dass jede ältere Karte, jede Frage und jeder Fall bereits einzeln fachlich freigegeben ist. Der Stand und offene Prüfbereiche sind in [REVIEW.md](REVIEW.md) dokumentiert.

## App und Entwicklung

Die Anwendung ist als Progressive Web App aufgebaut und wird über GitHub Pages veröffentlicht. Änderungen am Wissensbestand liegen in `disease-library.js` und `library.js`; die Darstellung liegt in `visual-library.js`. Nach Änderungen an den geladenen JavaScript-Dateien sind die Versionsverweise in `index.html` und der Offline-Cache in `sw.js` zu aktualisieren.

Die App enthält lokale Lernstands- und Exportfunktionen. Die genutzten Konto- und Synchronisierungsfunktionen hängen von der aktuellen App-Konfiguration ab.

