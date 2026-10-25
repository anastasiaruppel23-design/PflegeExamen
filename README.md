# PflegeKompass – kostenlose PWA

## Inhalt
Eigenständige statische Web-App mit Wissensbibliothek, Quiz, Lernkarten, sechs Pflegefällen, mündlicher Prüfungssimulation, Lernplan und Timer. Die Lerninhalte wurden anhand des bisherigen Lovable-Projekts „Pflege Exam Compass“ neu zusammengestellt. Dies ist keine vollständige 1:1-Übernahme aller Originaltexte und Fragen.

## Kostenlos auf GitHub Pages veröffentlichen
1. Bei https://github.com kostenlos anmelden.
2. Ein neues **öffentliches** Repository namens `pflegekompass` erstellen.
3. Den **Inhalt dieses Ordners** (nicht die ZIP-Datei) ins Stammverzeichnis des Repositories hochladen und Änderungen bestätigen.
4. Unter **Settings → Pages → Build and deployment** bei Source **Deploy from a branch** auswählen, Branch **main**, Ordner **/(root)**, Save.
5. Die Adresse lautet nach Veröffentlichung normalerweise `https://DEIN-BENUTZERNAME.github.io/pflegekompass/`.
6. Auf Android in Chrome öffnen → Menü ⋮ → „Zum Startbildschirm hinzufügen“ bzw. „App installieren“.

## Datenschutz / Nutzung
Die App benötigt kein Konto, keine API und keine Datenbank. Bearbeitete Themen, Quizbestwert und Lernwochen werden lokal im Browser gespeichert; beim Löschen der Browserdaten gehen sie verloren. Eingaben in Fall- und Prüfungstextfeldern werden nicht gespeichert. Die App funktioniert nach dem ersten vollständigen Laden offline, sofern die Service-Worker-Installation erfolgreich war. GitHub Pages erfordert bei kostenlosen Standardkonten üblicherweise ein öffentliches Repository.

## Aktualisieren
Dateien im Repository ersetzen und committen. Bei Änderungen am Offline-Cache die CACHE-Version in `sw.js` erhöhen.

## Hinweis
Lernhilfe, keine verbindliche klinische Handlungsanweisung. Inhalte und Rechtslage mit aktuellen Standards/Leitlinien und Ausbildungsmaterialien abgleichen.


## Neu: Kompetenzbereich-Trainer

100 zusätzliche Multiple-Choice-Fragen aus den Kompetenzbereichen 1–5. Filter, automatische Wiederholung falscher Antworten bis zur richtigen Lösung, gesondertes Fehlertraining und lokaler Lernstand. Fragen sind Lernmaterial und ersetzen keine Prüfungsvorgaben oder aktuellen Leitlinien.
