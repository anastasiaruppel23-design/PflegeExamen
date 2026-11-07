# PflegeFokus – by ANA Digital

PflegeFokus ist eine deutschsprachige Lern-App für die Pflegeausbildung und die schriftliche, praktische und mündliche Prüfung. Sie verbindet Wissensseiten, Lernkarten, Quizfragen, Fallarbeit und Prüfungssimulation.

## Lernbestand (Inhaltsinventar geprüft am 7. November 2026)

- 102 Einträge in der zentralen Themenbibliothek: 36 Ausgangsthemen, 12 ergänzende Wissens-/Pflegeeinträge, 45 quellenverlinkte Krankheits- und Pflegethemen sowie 9 Krankheitsentwürfe.
- 117 Lernkarten und 116 Fragen im zusammengeführten Themenquiz. Zusätzlich gibt es 100 Fragen im Kompetenzbereich-Trainer.
- Im visuellen Bereich liegen 42 Krankheitsprofile und 3 Pflegeverfahren mit Quellenangaben. Weitere 9 Krankheitsprofile sind Entwürfe, deren fachliche Einzelprüfung und Quellenabgleich noch ausstehen.
- Weitere Lernbestände: 10 Organsystem-Übersichten, 26 Modelle/Theorien und verwandte Konzepte, 12 kompakte Expertenstandard-Übersichten und 69 Glossarbegriffe.
- Für die Fallarbeit gibt es 40 kurze fallbezogene Aufgaben, 6 ältere Falltexte, 3 schriftliche Übungsfälle mit je 18 Aufgaben und Antwort-/Erwartungshinweisen sowie 2 mündliche Übungsfälle.
- Der Notfallsimulator enthält 2 Szenarien mit jeweils 3 Entscheidungen. Die 8 Praxis-Challenges enthalten insgesamt 12 Aufgaben mit fachlichen Rückmeldungen.

Die 42 quellenverlinkten Krankheitsprofile und 3 Pflegeverfahren sind nach Organsystemen gruppiert. Sie enthalten Definition, Entstehung, Beschwerden und Warnzeichen, Diagnostik und Therapie im Überblick, pflegerische Einschätzung und Handeln, Prüfungsimpuls, Transferfrage und Quelle. Die 9 zusätzlichen Profile sind davon getrennt als ungeprüfte Entwürfe markiert. Anatomische Lernbilder sind mit Alternativtext, Bildunterschrift, Urheber und Lizenz versehen; externe Commons-Bilder benötigen eine Internetverbindung. Die Pflegefachkraft-Illustration zeigt Anastasia nach ihren Referenzfotos; die Vorgabe für weitere Abbildungen ist in `VISUAL-STYLE.md` festgehalten.

Die schriftlichen Fälle sind mit je 291–321 Wörtern noch deutlich kürzer als die gewünschte Zwei-Seiten-Fallvorlage. Die mündlichen Falltexte umfassen derzeit je 201–224 Wörter. Sie sind als Übungsentwürfe zu verstehen, nicht als maßstabsgetreue Prüfungsvorlagen. Der praktische Prüfungsbereich stellt bewusst kein erfundenes Fallbeispiel bereit.


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

