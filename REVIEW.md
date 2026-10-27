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
