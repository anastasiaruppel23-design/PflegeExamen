# Wissensbibliothek – Stand 27.10.2026

## Umgesetzt

Alle 36 bestehenden Wissensthemen und alle bestehenden Lernkarten verwenden ein gemeinsames, beschriftetes Farbsystem. Definitionen sind rosa, Krankheitslehre türkis, Merksätze grün, Maßnahmen gelb, Modelle lila und Warnhinweise rot. Die Suche wurde um einen Bereichsfilter ergänzt. Vorhandene Themen- und Kartenindizes bleiben stabil, damit gespeicherte Lernstände weiterhin passen.

12 ergänzte Wissensseiten und 12 zugehörige Lernkarten: Hypoglykämie, COPD-Exazerbation, Dekubitus, Pflegediagnosen, Maßnahmenplanung, Arzneimittelsicherheit, Atmung, Fachbegriffe sowie Paracetamol, Ibuprofen, Metformin und Insulin. Die drei Krankheitsseiten enthalten jeweils einen direkt erreichbaren fiktiven Fall mit fünf Aufgaben und begründeten Lösungsansätzen sowie eine Transferfrage. Die Fragen gehören außerdem zum normalen Grundquiz. Einzelfragen verändern dessen laufenden Punktestand nicht.

Zwei eigene, vereinfachte medizinische SVG-Schemata erklären Lunge/Gasaustausch und Druckwirkung auf Haut/Gewebe. Keine Instagram-Grafik wurde kopiert. Die bestehende Startseitenillustration wurde beibehalten: Der ausdrücklich ausgewählte persönliche Rosé-Anhang konnte nicht eindeutig verifiziert werden.

Quiz- und Prüfungseingaben behalten ihre ruhige Gestaltung. Bestehende Falllösungen erhalten eine gelbe Hervorhebung, Antwortfeedback grüne beziehungsweise rote Kästen. Offline-Cache und Versionsverweise enthalten die neuen Dateien.

## Fachlicher Abgleich und Grenzen

Die neuen klinischen Seiten wurden mit den direkt an den Seiten verlinkten Quellen abgeglichen: diabinfo, NVL COPD 2025, DNQP-Übersicht, EMA, NHS, NIDDK und TGA. Besonders berücksichtigt: keine orale Gabe bei unsicherem Schlucken, kontrollierte Sauerstoffgabe bei COPD, keine Massage gefährdeter Druckstellen, Ranitidin-Zulassungen in der EU ruhend, Arzneimittelrisiken ohne pauschale Dosieranweisungen. Die Überschrift „Vier Ebenen … I–V“ wurde auf fünf Kompetenzbereiche korrigiert.

Dies ist keine vollständige fachliche Freigabe des gesamten vorhandenen Bestands: 100 Kompetenzfragen, alle älteren Falltexte und die Vollfassungen kostenpflichtiger Expertenstandards wurden nicht vollständig neu validiert. Die Bibliothek ist auch nach der Ergänzung kein vollständiges Krankheits- oder Arzneimittellexikon. Wirkstoffseiten ersetzen keine aktuelle deutsche Fachinformation. Weitere Krankheitsbilder und deren Vernetzung müssen fachlich einzeln erweitert werden.

## Prüfung

Automatisierte Browserprüfung mit Microsoft Edge bei 390 × 900 und 1280 × 900: Bibliothek, Suche, keine Treffer, Filter, Lernkarten, Transferfragen, Falllösungen, gespeicherter Lernstand und vorhandene Übungsbereiche. Screenshots zusätzlich visuell geprüft. Kein Test auf physischen Android-/iOS-Geräten; keine Aussage über deren vollständige Installierbarkeit. Cloud-Login und Supabase-Synchronisation werden ohne Zugangsdaten nicht als getestet ausgewiesen.

Optionaler Browser-Smoke-Test: Playwright 1.62.1 bereitstellen und `node tests/smoke.cjs` starten. Standardmäßig wird der installierte Edge verwendet; alternativ `BROWSER_EXECUTABLE` setzen.

## Illustrierte Überarbeitung nach dem Gestaltungsfeedback

Die Bibliothek öffnet jetzt als bebilderte Galerie mit eigener Pflegeillustration, Themenkarten, Suche und Bereichsfiltern. Alle 48 Themen haben eine eigenständige Lernblattansicht mit großer Überschrift, semantischen Lernfarben, illustriertem Kopfbereich, hervorgehobenen Schlüsselwörtern, Prüfungsimpuls und passenden Verknüpfungen. Orem, Peplau und der Pflegeprozess besitzen eigene Ablaufgrafiken; medizinische Wortbausteine werden als große Begriffskarten gezeigt.

Alle 47 Lernkarten verwenden ein gestaltetes Frage-/Antwortformat mit visuellen Elementen und nummerierten Antwortbausteinen. Die Falllösungen erhalten eine passende Pflegeillustration und farbig strukturierte Begründungen. Vier eigens erzeugte transparente Illustrationen wurden als WebP eingebunden (zusammen rund 670 KB); die persönliche Startseitenillustration bleibt erhalten. Herkunft und Promptbeschreibungen stehen in assets/ILLUSTRATIONS.md.

Die neue Browserprüfung in tests/visual.cjs prüft alle 48 Lernansichten bei 320, 390 und 1280 Pixeln, horizontales Überlaufen, Suchfilter, Tastaturbedienung, Verknüpfungen und Offline-Bilder. Der GitHub-Workflow speichert Screenshots als Testartefakt. Der erfolgreiche Teststatus der Vorgängerversion ist keine Freigabe dieser neuen Gestaltung; maßgeblich ist der aktuelle Workflow-Status.

## Fachbegriffe und verlässliche Lernkarten-Verknüpfungen

Alle 47 Karten haben nun eine explizite Zuordnung zu ihrer Wissensseite; die fehleranfällige Suche nach dem vollständigen Fragetext entfällt. Wissensseiten mit zugeordneter Karte bieten den direkten Rückweg. Bestehende Indizes und gespeicherte Lernstände bleiben erhalten.

Kohärenzgefühl, Salutogenese, Coping, Compliance und Adhärenz lassen sich im kleinen durchsuchbaren Glossar nachschlagen. Vorkommen in Lernboxen sind als beschriftete Schaltflächen direkt antippbar. Das Dialogfenster bietet eine verständliche Erklärung, ein Lernbeispiel, einen Quellenlink und den Sprung zur passenden Wissensseite. Escape und Schließen führen zum vorherigen Bedienelement zurück. Auf Lernkarten liegt der Glossarzugang außerhalb der umdrehbaren Karte; Quiz und Prüfung erhalten keine zusätzlichen Bedienelemente. Definitionen am 27.10.2026 anhand der verlinkten BIÖG-, AOK- und Universität-Hamburg-Seiten geprüft. Das Glossar ist ein erster Bestand von fünf Begriffen, kein vollständiges Fachlexikon.

Browserprüfungen erweitert: alle 47 Kartenverbindungen, Begriffsdialog per Tastatur, Fokusrückgabe, Glossarsuche, Themenwechsel, Breiten 320/390/1280 und Offlinezugriff. Lokale Syntaxprüfung und `node tests/learning-links.cjs` erfolgreich: 47 Kartenverbindungen, 48 gültige Themen, Begriffserkennung, HTML-Escaping, Dateiverweise und Cache-Eintrag. Lokaler Browserdownload nicht verfügbar; die erweiterten Browserprüfungen sind noch nicht ausgeführt. Die Ergänzungen werden in einem separaten Entwicklungszweig geprüft; eine Veröffentlichung in der öffentlichen App ist nicht Bestandteil dieser Änderung.

## Erweiterung vom 28.10.2026

101 aktive Themen, davon 45 Krankheitsbilder, 22 ausführlich überarbeitete Modelle/Konzepte und zehn DNQP-Standards plus Mobilitätsstandard. 179 Lernkarten und ein gemeinsamer Pool mit 261 eindeutigen Fragen. Das Lexikon umfasst 249 Begriffe und eine eigenständig lesbare HTML-Druck-/Downloadfassung. Einzelne bisherige Grundlagenthemen bleiben erhalten. Kein Anspruch auf vollständige Abdeckung eines Thieme-Lehrbuchs.

Eigenständige Zusammenfassungen, keine Kopien von Thieme oder DNQP. Quellen und Publikationsstand stehen an den erweiterten Themen. „Hiort-Modell“ konnte nicht eindeutig identifiziert werden und wurde nicht erfunden. Medizinische Lerninhalte sind keine individuellen Behandlungsanordnungen. Fachliche Nachprüfung durch Lehrende bleibt sinnvoll, besonders bei lokalen Standards.

Die numerischen IDs vorhandener Themen bleiben erhalten; entfernte Medikamententhemen haben reservierte, ausgeblendete Slots. Gespeicherte Quizfehler aus dem bisherigen Kompetenztrainer werden weiterverwendet. Neue Inhalte liegen offline im Service-Worker-Cache.

Automatische Prüfungen: Datenkonsistenz, eindeutige Quizantworten, korrekte Themenverknüpfungen, alle aktiven Lektionen bei 320/390/1280 Pixel, Filter, Glossarsuche, Quiz-Fehlerwiederholung, Persistenz und Offline-Nutzung.
