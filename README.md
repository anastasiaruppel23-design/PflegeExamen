# PflegeFokus – by ANA Digital – kostenlose PWA

## Wissensbibliothek, Oktober 2026

48 Wissensthemen, 47 Lernkarten und 38 Grundquizfragen. Die Bibliothek nutzt beschriftete Lernfarben, einen Bereichsfilter, zwei medizinische Schemata sowie verknüpfte Krankheitsseiten mit drei zusätzlichen Lernfällen und Transferfragen. Quiz und Prüfung bleiben übersichtlich. Umfang, Quellenabgleich, Tests und offene Grenzen stehen in [REVIEW.md](REVIEW.md). Die nachfolgenden älteren Bestandsangaben dokumentieren frühere Ausbaustufen.

## Inhalt
Eigenständige statische Web-App mit Wissensbibliothek, Quiz, Lernkarten, sechs Pflegefällen, mündlicher Prüfungssimulation, Lernplan und Timer. Die Lerninhalte wurden anhand des bisherigen Lovable-Projekts „Pflege Exam Compass“ neu zusammengestellt. Dies ist keine vollständige 1:1-Übernahme aller Originaltexte und Fragen.

## Veröffentlichung über GitHub Pages
Das bestehende Repository heißt weiterhin `PflegeExamen`. Unter **Settings → Pages** kann die Veröffentlichung über den Branch `main` und den Ordner `/(root)` aktiviert werden. Bei einem öffentlichen Repository lautet die typische Adresse `https://anastasiaruppel23-design.github.io/PflegeExamen/`. Der sichtbare App-Name ist **PflegeFokus – by ANA Digital**.

## Datenschutz / Nutzung
Die App benötigt kein Konto, keine API und keine Datenbank. Bearbeitete Themen, Quizbestwert und Lernwochen werden lokal im Browser gespeichert; beim Löschen der Browserdaten gehen sie verloren. Eingaben in Fall- und Prüfungstextfeldern werden nicht gespeichert. Die App funktioniert nach dem ersten vollständigen Laden offline, sofern die Service-Worker-Installation erfolgreich war. GitHub Pages erfordert bei kostenlosen Standardkonten üblicherweise ein öffentliches Repository.

## Aktualisieren
Dateien im Repository ersetzen und committen. Bei Änderungen am Offline-Cache die CACHE-Version in `sw.js` erhöhen.

## Hinweis
Lernhilfe, keine verbindliche klinische Handlungsanweisung. Inhalte und Rechtslage mit aktuellen Standards/Leitlinien und Ausbildungsmaterialien abgleichen.


## Neu: Kompetenzbereich-Trainer

100 zusätzliche Multiple-Choice-Fragen aus den Kompetenzbereichen 1–5. Filter, automatische Wiederholung falscher Antworten bis zur richtigen Lösung, gesondertes Fehlertraining und lokaler Lernstand. Fragen sind Lernmaterial und ersetzen keine Prüfungsvorgaben oder aktuellen Leitlinien.

## Neue Funktionen (Oktober 2026)
- Übersichtliche, auf Smartphones zweispaltige Navigation in vier Gruppen: Start & Fortschritt, Lernen, Prüfung, Organisation.
- Lerncockpit mit lokal gespeicherten Lernzahlen, Fehlern und Fall-Selbstbewertungen.
- 36 Wissensthemen, 35 Grundquizfragen, 35 Lernkarten, 100 Fragen zu Kompetenzbereichen 1–5 und 40 zusätzliche Fallsituationen.
- Mündliche Übung mit optionaler Browser-Spracherkennung (Deutsch), Stoppuhr, Erwartungshorizont und Selbsteinschätzung.
- Einstellungen mit JSON-Export und -Import des lokalen Lernstands, Installationshilfe und Teilen-Link.
- Quellenhinweise auf Gesetzestexte und Fachorganisationen.

## Installation auf Smartphones
**Android / Chrome:** veröffentlichte GitHub-Pages-URL öffnen, Browsermenü ⋮, „App installieren“ bzw. „Zum Startbildschirm hinzufügen“. Gegebenenfalls wird ein Installationsknopf unter Einstellungen angeboten. HTTPS und eine erfolgreiche Service-Worker-Registrierung sind Voraussetzung für Offline-Nutzung.

**iPhone / Safari:** URL in Safari öffnen, Teilen → „Zum Home-Bildschirm“ → Hinzufügen.

**Wichtig:** GitHub Pages muss in den Repository-Einstellungen aktiviert sein. Eine GitHub-Repositoriumsseite ist nicht die installierbare App.

## Andere Nutzer, Accounts und Datenschutz
Andere Personen dürfen den öffentlichen App-Link öffnen und die PWA auf ihrem Gerät installieren. **Es gibt derzeit keine Benutzerkonten, Registrierung, Anmeldung, Passwort-Zurücksetzung oder Cloud-Synchronisation.** Jeder Browser führt seinen eigenen lokalen Lernstand. Konten würden einen zusätzlichen Authentifizierungsdienst, Datenbank, Datenschutzkonzept und laufenden Betrieb erfordern.

Die optionale Browser-Spracherkennung benötigt Mikrofonberechtigung. Je nach Browser wird das Gesprochene durch den Browseranbieter oder einen externen Dienst verarbeitet. Keine echten Patientendaten diktieren. Die App zeichnet keine Audiodatei auf; diktierter Text wird nicht als Teil des Lernstands gespeichert. Die Bewertung ist eine Selbsteinschätzung, keine KI-Bewertung.

## Bekannte Grenzen / noch zu prüfen
- Echter End-to-End-Test auf Android und iPhone, Installierbarkeit und Offline-Verhalten.
- Fachliche Einzelprüfung aller Fragen, Fälle und Quellverweise mit den aktuell gültigen Originalstandards.
- Kein automatischer Abgleich gesprochener Antworten mit einer Musterlösung.
- Sicherung muss aktiv heruntergeladen und beim Gerätewechsel importiert werden.
- Keine automatische Wiederholung über alle Lernbereiche hinweg.
