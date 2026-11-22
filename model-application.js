/* Original practice examples. Each example connects a model concept to an observable outcome. */
const modelApplications = {
 'Virginia Henderson': ['Nach einem Schlaganfall wäscht Herr M. das Gesicht selbst, erreicht aber seinen Rücken nicht.', 'Prüfe für die Aktivität Körperpflege getrennt Kraft, Wissen und Motivation. Herr M. übernimmt das Gesicht, du unterstützt am Rücken und prüfst, wie viel Hilfe er am nächsten Morgen braucht.', 'Selbstständigkeit pro Aktivität einschätzen. Die Diagnose allein sagt nichts über den Hilfebedarf.'],
 'Roper–Logan–Tierney': ['Eine Bewohnerin findet nachts den Toilettenweg schlecht, tagsüber geht sie sicher mit Rollator.', 'Ordne Ausscheiden, Sichbewegen und sichere Umgebung ein. Prüfe Beleuchtung und Hilfsmittel als Einflussfaktoren. Vereinbare einen sicheren Weg und beobachte, welche Unterstützung nachts nötig ist.', 'Abhängigkeit ist veränderlich und kann je nach Umgebung und Tageszeit verschieden sein.'],
 'Hildegard Peplau': ['Eine Patientin in der Psychiatrie schweigt bei der Aufnahme, nimmt später aber ein Gespräch mit derselben Pflegeperson an.', 'Orientierung: Rolle und Ablauf erklären. Identifikation: gemeinsam ein Anliegen benennen. Nutzung: passende Angebote einsetzen. Ablösung: den Abschluss vorbereiten und Ansprechpartner vereinbaren. Prüfe, ob die Patientin die nächste Anlaufstelle kennt.', 'Die vier Phasen können sich überschneiden. Ein schwieriges Gespräch allein bedeutet keinen Rückschritt.'],
 'Dorothea Orem': ['Samira kennt ihre Diabetesversorgung, versäumt aber Termine und fühlt sich organisatorisch überfordert.', 'Vergleiche Anforderungen mit vorhandenen Fähigkeiten. Kläre zunächst, ob Unterstützung beim Organisieren genügt. Vereinbare mit ihr einen selbst gewählten Termin und Kontaktweg und überprüfe beim nächsten Gespräch, ob beides praktikabel ist.', 'Unterstützend-erziehend bedeutet Anleitung und Unterstützung. Teilweise kompensatorisch bedeutet gemeinsam handeln. Vollständig kompensatorisch übernimmt die Pflege die erforderlichen Handlungen, soweit die Person sie aktuell nicht ausführen kann.'],
 'Monika Krohwinkel': ['Herr Weber möchte sich selbst waschen. Das Ankleiden fällt ihm schwer, seine Frau ist erschöpft.', 'Erfrage Fähigkeiten und Hilfebedarf bei Selbstpflege und Bewegung sowie Wünsche zur Unterstützung durch seine Frau. Vereinbare eine Teilhandlung, die Herr Weber selbst übernimmt. Prüfe Hilfebedarf und Wohlbefinden beim nächsten Frühdienst.', 'ABEDL als Gesprächs- und Erhebungsrahmen nutzen. Probleme, Fähigkeiten und Beziehungen konkret beschreiben.'],
 'Callista Roy': ['Ein Patient nach Anlage eines Stomas meidet Besuche und sorgt sich um seine Rolle in der Familie.', 'Unterscheide den unmittelbar wirksamen Reiz von Begleitumständen. Frage nach körperlichem Befinden, Selbstbild, familiärer Rolle und Unterstützung. Vereinbare einen selbst gewählten nächsten Schritt und frage nach seiner Wirkung.', 'Unklare Einflüsse als mögliche Reize kennzeichnen und mit dem Patienten prüfen.'],
 'Betty Neuman': ['Eine Auszubildende beobachtet, dass Lärm, familiäre Konflikte und Schmerzen eine Patientin gleichzeitig belasten.', 'Ordne Schmerzen als intrapersonell, Konflikte als interpersonell und Stationslärm als extrapersonell ein. Besprich geeignete Unterstützung und beurteile, welche Belastung sich dadurch verändert.', 'Präventionsstufen auf den Zeitpunkt der Reaktion beziehen. Normale und flexible Abwehrlinien von den Widerstandslinien unterscheiden.'],
 'Madeleine Leininger': ['Ein Patient lehnt das angebotene Essen ab und nennt ein persönliches religiöses Anliegen.', 'Erfrage seine individuellen Wünsche. Bewahre passende Gewohnheiten, vereinbare gemeinsam Anpassungen und handle Alternativen aus, wenn nötig. Prüfe, ob die Auswahl für ihn tatsächlich passt.', 'Religion, Herkunft oder Sprache erlauben keine Rückschlüsse auf die Wünsche einer einzelnen Person.'],
 'Jean Watson': ['Eine Patientin fühlt sich bei vielen technischen Abläufen übergangen.', 'Schaffe einen kurzen ungestörten Gesprächsmoment, frage nach ihrer Sorge und stimme den nächsten Pflegeschritt mit ihr ab. Frage danach, ob sie sich beteiligt gefühlt hat.', 'Caring zeigt sich in konkreter Präsenz und Beziehungsgestaltung, auch wenn die Pflegemaßnahme kurz ist.'],
 'Ida Jean Orlando': ['Ein Patient wendet sich ab, als die Pflegeperson die Decke zurückschlagen möchte.', 'Beschreibe zuerst das beobachtete Verhalten. Frage, ob Schmerz, Kälte, Scham oder ein anderer Grund vorliegt. Passe erst nach der Klärung das Vorgehen an und frage, ob die Änderung hilft.', 'Die spontane Interpretation der Pflegeperson ist eine Hypothese.'],
 'Patricia Benner': ['Eine Auszubildende kann die Übergaberegeln nennen, übersieht im Fall aber die neue Zustandsänderung.', 'Lass sie die Situation rekonstruieren, priorisiere mit ihr und übe eine zweite Übergabe. Prüfe, ob sie beim nächsten Fall Veränderung und Dringlichkeit selbst erkennt.', 'Benner erklärt berufliche Kompetenzentwicklung. Für die Planung patientenbezogener Pflegeziele braucht es einen passenden Pflegeprozess.'],
 'Rosemarie Rizzo Parse': ['Ein Patient bewertet einen kurzen Besuch im Garten höher als die vorgesehene Gruppenaktivität.', 'Frage, welche Bedeutung der Garten für ihn hat und welche Möglichkeiten er selbst sieht. Stimme das Vorgehen mit ihm ab. Lass ihn beurteilen, ob sein persönliches Anliegen berücksichtigt wurde.', 'Lebensqualität aus Sicht der Person erfragen.'],
 'Martha Rogers': ['Eine Patientin beschreibt, dass sie im Mehrbettzimmer wegen Licht, Lärm und fehlender Ruhe schlecht schläft.', 'Betrachte Person und Umgebung als zusammenhängend. Kläre mit ihr, welche Änderung hilfreich wäre, und erfrage am nächsten Morgen ihre Erfahrung.', 'Energiefelder sind ein theoretischer Begriff, kein klinischer Messwert. Martha Rogers und Carl Rogers stehen für unterschiedliche Ansätze.'],
 'Joyce Travelbee': ['Nach einer Krebsdiagnose sagt ein Patient, niemand verstehe, was ihn wirklich belastet.', 'Begegne ihm als Person, frage nach seiner konkreten Sorge, zeige Verständnis und vereinbare ein Folgegespräch. Prüfe, ob er dort ein für ihn wichtiges Anliegen ansprechen kann.', 'Sinnangebote ergeben sich aus dem Erleben der Person. Gesprächsphasen dienen der Orientierung.'],
 'Kari Martinsen': ['Eine Bewohnerin braucht Hilfe beim Essen, möchte aber das Tempo selbst bestimmen.', 'Beobachte aufmerksam, frage nach ihrem Rhythmus und biete die benötigte Hilfe an. Prüfe gemeinsam, ob Unterstützung und eigene Handlungsmöglichkeiten zusammenpassen.', 'Fürsorge fachlich und am Willen der Person ausrichten.'],
 'Friedemann': ['Eine Tochter übernimmt fast alle Aufgaben für ihre Mutter und fühlt sich überfordert.', 'Systemerhaltung: hilfreiche Routinen klären. Systemänderung: Aufgaben neu vereinbaren. Kohärenz: gemeinsame Ziele erfragen. Individuation: persönliche Freiräume sichern. Prüfe, ob die Verteilung für Mutter und Tochter entlastend ist.', 'Angehörige als mögliche Ressource und als Menschen mit eigenem Unterstützungsbedarf betrachten.'],
 'Corbin & Strauss': ['Eine Frau mit COPD organisiert ihre Pflege selbst, braucht während einer Verschlechterung aber mehr Hilfe.', 'Unterscheide krankheitsbezogene, alltagsbezogene und biografische Arbeit. Stimme Unterstützung auf die aktuelle Phase ab und überprüfe nach der Akutsituation, was sie wieder selbst übernehmen möchte.', 'Ein chronischer Verlauf kann zwischen Phasen wechseln. Maßgeblich ist die aktuelle Situation.'],
 'Aaron Antonovsky': ['Ein Patient versteht den neuen Pflegeablauf kaum und möchte trotzdem möglichst selbstständig bleiben.', 'Verstehbarkeit: Ablauf erklären. Handhabbarkeit: erreichbare Hilfe und Hilfsmittel vereinbaren. Bedeutsamkeit: ein für ihn wichtiges Ziel erfragen. Lass ihn den nächsten Schritt in eigenen Worten wiedergeben.', 'Bedeutsamkeit meint, warum sich die Anstrengung für die Person lohnt.'],
 'Richard Lazarus': ['Die Mutter eines operierten Kindes fürchtet eine Wundschädigung beim Aufstehen.', 'Primäre Bewertung: Was erlebt sie als Bedrohung? Sekundäre Bewertung: Welche Unterstützung glaubt sie zu haben? Besprich ihre Sorge, kläre die Unterstützung und erfrage ihre Neubewertung.', 'Problemorientiertes Coping bearbeitet die Situation. Emotionsorientiertes Coping hilft beim Umgang mit der Belastung. Beides kann sinnvoll sein.'],
 'Abraham Maslow': ['Eine Patientin hat akut Atemnot und bittet zugleich darum, dass jemand bei ihr bleibt.', 'Priorisiere die akute Gefährdung anhand der Befunde und organisiere Hilfe. Sprich beruhigend und erkläre die nächsten Schritte. Prüfe danach körperlichen Zustand und subjektives Sicherheitsgefühl.', 'Die Hierarchie ist eine Denkstütze. Akute Prioritäten ergeben sich aus fachlicher Einschätzung und der Situation.'],
 'Erik Erikson': ['Eine Jugendliche mit Diabetes möchte beim Gespräch selbst antworten und ihre Mutter gezielt einbeziehen.', 'Beziehe Identitätsentwicklung und Selbstständigkeit in die Gesprächsgestaltung ein. Kläre mit ihr eine eigene Entscheidungsmöglichkeit und prüfe, ob sie den vereinbarten nächsten Schritt mitträgt.', 'Entwicklungsaufgaben geben Hinweise. Rechtliche Fragen zur Einwilligung werden gesondert und konkret geprüft.'],
 'Kübler-Ross': ['Eine Patientin reagiert nach einer belastenden Diagnose abwechselnd mit Ärger und Schweigen.', 'Frage, was gerade belastet und ob sie reden möchte. Vereinbare einen passenden Kontakt und überprüfe, ob sich ihr Unterstützungswunsch verändert.', 'Die möglichen Reaktionsformen bilden keinen festen Ablauf und dienen keiner Diagnose von Trauer.'],
 'Schulz von Thun': ['Ein Patient sagt beim Austeilen: „Heute kommt die Pflege aber spät.“', 'Prüfe Sachinhalt, Selbstkundgabe, Beziehung und Appell als mögliche Lesarten. Frage nach: „Haben Sie gerade auf Hilfe gewartet?“ Kläre, ob ein konkreter Bedarf bestand.', 'Die vier Seiten sind Deutungsmöglichkeiten. Welche Bedeutung zutrifft, klärt das Gespräch.'],
 'Paul Watzlawick': ['Eine Patientin sagt „Alles gut“, schaut aber weg und zieht den Arm zurück.', 'Nimm Worte und Körpersprache wahr. Frage ohne Vorwurf, wie sie die Situation erlebt. Passe die Gesprächsführung an und achte auf ihre Rückmeldung.', 'Nonverbale Signale sind beobachtbar. Ihre Bedeutung muss mit der Person geklärt werden.'],
 'Carl Rogers': ['Eine Bewohnerin sagt, dass sie sich bei der Körperpflege übergangen fühlt.', 'Spiegele ihr Erleben empathisch, akzeptiere ihre Sicht und erkläre dein Vorgehen ehrlich. Biete eine Wahl an und frage anschließend, ob sie sich beteiligt gefühlt hat.', 'Empathie, Kongruenz und bedingungsfreie Wertschätzung prägen die Haltung.'],
 'Donabedian': ['Eine Station möchte nach mehreren Stürzen prüfen, ob ihr Vorgehen wirksam ist.', 'Struktur: geeignete Hilfsmittel verfügbar. Prozess: individuelles Risiko und Maßnahmen dokumentiert. Ergebnis: Stürze und Sturzfolgen im Zeitverlauf. Prüfe zusätzlich Mobilität und veränderte Meldepraxis.', 'Ein Ergebnis allein erklärt die Ursache nicht. Vergleiche Zeiträume, Bezugsgrößen und Rahmenbedingungen.'],
 'ICF': ['Herr Weber braucht beim Aufstehen mehrere Anläufe und möchte wieder im Frühstücksraum essen.', 'Ordne Bewegungsbeeinträchtigungen den Körperfunktionen, Aufstehen der Aktivität und gemeinsames Frühstück der Teilhabe zu. Prüfe Hilfsmittel und Umgebung. Vereinbare einen erreichbaren Wegabschnitt und überprüfe, ob er ihn bewältigt.', 'Ein Hilfsmittel kann ein Förderfaktor sein. Seine Wirkung hängt von der konkreten Nutzungssituation ab.'],
 'Biopsychosoziales Modell': ['Nach einem Sturz hat Herr Yilmaz Schwindel, Angst und Sorge, andere mit der Klingel zu stören.', 'Körperlich: den Schwindel abklären lassen. Psychisch: Sturzangst erfragen. Sozial: klären, wie er ohne Hemmung Hilfe erreicht. Prüfe beim nächsten begleiteten Gang Sicherheit und sein Erleben.', 'Körperliche Symptome immer fachlich abklären. Ein Zusammenhang im Fall ist keine gesicherte Ursache.'],
 'SBAR': ['Herr Yilmaz meldet beim erneuten Aufstehen Schwindel. Er ist nachts bereits gestürzt.', 'Situation: neuer Schwindel beim Aufstehen. Hintergrund: nächtlicher Sturz. Einschätzung: veränderte Transfersicherheit, aktuelle Befunde nennen. Empfehlung: um zeitnahe Beurteilung und Rückmeldung zum weiteren Vorgehen bitten.', 'Nur erhobene Befunde weitergeben und offene Informationen ausdrücklich nennen.']
};

const caseLaw = {
 care: ['§ 4 PflBG · Vorbehaltene Aufgaben', 'https://www.gesetze-im-internet.de/pflbg/__4.html'],
 consent: ['§ 630d BGB · Einwilligung bei medizinischen Maßnahmen', 'https://www.gesetze-im-internet.de/bgb/__630d.html'],
 privacy: ['§ 203 StGB · Schweigepflicht', 'https://www.gesetze-im-internet.de/stgb/__203.html'],
 restraint: ['§ 1831 BGB · Freiheitsentziehende Maßnahmen bei Erwachsenen im Anwendungsbereich der Norm', 'https://www.gesetze-im-internet.de/bgb/__1831.html'],
 records: ['§ 630f BGB · Dokumentation der Behandlung', 'https://www.gesetze-im-internet.de/bgb/__630f.html']
};

// Entries contain clues from the case, a justified choice, and an observable evaluation.
const caseApplications = {
 brandt: {
  problems: 'Zwei nächtliche Stürze, wenig Essen und Trinken, Schmerzzeichen und eine nicht wegdrückbare Fersenrötung. Prioritäten und fehlende Befunde gesondert klären.',
  resources: 'Frau Brandt zeigt Wünsche und Ablehnung. Tochter Sabine ist erreichbar. Erfrage, was Frau Brandt selbst tun möchte und welche Hilfe sie annimmt.',
  models: ['Carl Rogers', 'Friedemann'],
  rationale: 'Mit Carl Rogers erkundest du die Ablehnung der Körperpflege wertschätzend. Mit Friedemann klärst du zusätzlich, welche Unterstützung Sabine leisten kann und wo sie Entlastung braucht.',
  law: ['restraint', 'care'], legal: 'Der Wunsch der Tochter nach einem Bettgitter begründet keine Zustimmung oder Zulässigkeit. Kläre den Willen von Frau Brandt, die konkrete Wirkung des Bettgitters und mildere Möglichkeiten. Die häusliche Situation darf nicht pauschal wie ein Heimfall unter § 1831 Abs. 4 BGB behandelt werden.',
  standards: [0, 3, 6], practice: 'Individuelles Sturz- und Dekubitusrisiko einschätzen. Hautbefund, Schmerzen und Veränderungen zeitnah fachlich beurteilen. Vereinbarte Hilfen und Rückmeldung bei Veränderung im Team festlegen.',
  evaluation: 'Haut- und Schmerzverlauf, Stürze und Beinahe-Stürze, Mobilität und ob Frau Brandt die vereinbarte Hilfe akzeptiert, zum vereinbarten Zeitpunkt auswerten.'
 },
 samira: {
  problems: 'Drei abgesagte Diabetes-Kontrolltermine und Überforderung. Der aktuelle Gesundheitszustand und die Gründe für die Absagen sind noch zu klären.',
  resources: 'Samira formuliert ihre Wünsche, möchte Gespräche selbst führen und würde einen vereinbarten Termin wahrnehmen. Ärztliches Team und Schulsozialarbeit kommen als Unterstützung infrage.',
  models: ['Dorothea Orem', 'Aaron Antonovsky', 'Erik Erikson'],
  rationale: 'Orem hilft, Organisationsbedarf und tatsächlich vorhandene Selbstpflegefähigkeiten zu unterscheiden. Antonovsky hilft, den Termin nachvollziehbar, machbar und für Samira sinnvoll zu gestalten.',
  law: ['privacy', 'consent'], legal: 'Die Weitergabe an die Mutter nicht automatisch zusagen. Für die konkrete Entscheidung Einwilligungsfähigkeit, Sorgeberechtigung, Vertraulichkeit und mögliche Schutzpflichten klären.',
  standards: [], practice: 'Für die Termin- und Übergangsplanung passt fachliche Orientierung zur Versorgung bei Typ-1-Diabetes im Jugendalter. Der Fall legt keinen bestimmten DNQP-Standard zwingend nahe. Pflege, ärztliches Team und bei Zustimmung weitere Beteiligte stimmen Aufgaben ab.',
  evaluation: 'Samira benennt Termin, Kontaktweg und eine gewählte Unterstützung. Beim Folgekontakt gemeinsam prüfen, ob der Plan umsetzbar war.'
 },
 sturz: {
  problems: 'Sturz beim nächtlichen Toilettengang, Schwindel beim Aufstehen und Angst vor erneuter Mobilisation. Ursache und aktueller Unterstützungsbedarf bleiben offen.',
  resources: 'Herr Yilmaz war vor der Aufnahme selbstständig, kann den Ablauf schildern und äußert seine Wünsche.',
  models: ['Donabedian', 'Richard Lazarus', 'Biopsychosoziales Modell', 'SBAR'],
  rationale: 'Lazarus hilft, Sturzangst und verfügbare Bewältigungshilfen zu erfragen. Donabedian hilft, Hilfsmittel, Umsetzung der vereinbarten Unterstützung und Ergebnisse getrennt zu prüfen.',
  law: ['care', 'records'], legal: 'Individuelle Einschätzung, Pflegeplanung und Evaluation gehören zur Verantwortung der Pflegefachperson. Beobachtungen, Absprachen und Ergebnisse nachvollziehbar dokumentieren. Die Tochter kann Bettruhe nicht allein festlegen.',
  standards: [3], practice: 'Einen sicheren Toilettenweg und geeignete Unterstützung mit Herrn Yilmaz vereinbaren. Mobilität mit Physiotherapie abstimmen und den Schwindel ärztlich abklären lassen. Zuständigkeiten übergeben.',
  evaluation: 'Beim vereinbarten nächsten Toilettengang Hilfebedarf, Schwindel und subjektive Sicherheit prüfen. Stürze und Beinahe-Stürze im Verlauf berücksichtigen.'
 },
 parkinson: {
  problems: 'Erschwerte Mobilität und Selbstpflege bei Parkinson. Belastung der Ehefrau und konkrete Sturzfaktoren erheben.',
  resources: 'Herr Weber kann Wünsche äußern und möchte sich selbst waschen und zum Frühstücksraum gehen.',
  models: ['Dorothea Orem', 'Monika Krohwinkel', 'ICF'], rationale: 'Orem hilft, Tätigkeiten in selbstständige und unterstützungsbedürftige Schritte zu unterteilen.',
  law: ['care'], legal: 'Pflegebedarf individuell erheben und Zuständigkeiten planen. Die Ehefrau nach Absprache einbeziehen.',
  standards: [3], practice: 'Einen sicheren Weg und angemessene Teilunterstützung vereinbaren. Wünsche, Mobilität und die Situation der Ehefrau ins Teamgespräch aufnehmen.',
  evaluation: 'Dokumentiere, welche Teilhandlungen und Wegabschnitte Herr Weber mit vereinbarter Unterstützung bewältigt.'
 },
 leukaemie: {
  problems: 'Die dokumentierte ausgeprägte Neutropenie macht Infektionszeichen besonders relevant. Mund- und Schluckschmerzen können die Aufnahme beeinträchtigen. Erfasse und priorisiere Befunde und Verlauf.',
  resources: 'Lena malt gern und erzählt ihrem Stoffhasen vom Krankenhaus. Nutze beides, um nach ihrer Sicht und hilfreichen Erklärungen zu fragen.',
  models: ['Friedemann', 'Carl Rogers'], rationale: 'Friedemann hilft, Rollen und Belastungen in der Familie zu erfassen, während Lena altersgerecht beteiligt wird.',
  law: ['consent'], legal: 'Für medizinische Maßnahmen klären, wer konkret einwilligen kann. Lena altersgerecht informieren und ihre Wünsche erfragen.',
  standards: [], practice: 'Infektionsschutz nach Behandlungssituation und geltender Hygienevorgabe abstimmen. Bei einem belastenden Eingriff zusätzlich den individuellen Schmerzbedarf prüfen.',
  evaluation: 'Beobachtungen und Belastung dokumentieren. Erfragen, ob Lena und ihre Bezugspersonen die besprochenen Schritte verstanden haben.'
 },
 hno: {
  problems: 'Nach Laryngektomie sind Atemweg, veränderte Kommunikation und individueller Unterstützungsbedarf zu berücksichtigen.',
  resources: 'Prüfe, welche Kommunikationswege Herr Yilmaz nutzen möchte, etwa Schreiben oder vereinbarte Zeichen.',
  models: ['Callista Roy', 'Dorothea Orem'], rationale: 'Roy hilft, neben körperlichen Veränderungen auch Selbstbild, Rolle und Beziehungen zu berücksichtigen.',
  law: ['care', 'records'], legal: 'Pflegebedarf und Sicherheitsabsprachen erheben und für das zuständige Team nachvollziehbar dokumentieren.',
  standards: [1], practice: 'Akute Atemprobleme nach dem geltenden lokalen Notfallweg priorisieren. Für den späteren Übergang Kommunikationsmittel, Einweisung und Zuständigkeiten abstimmen.',
  evaluation: 'Überprüfe vor dem Übergang, ob die vereinbarte Kommunikationshilfe erreichbar ist und gewünschte Unterstützung organisiert wurde.'
 },
 depression: {
  problems: 'Rückzug und depressive Belastung anhand der Fallbeobachtungen beschreiben. Bei Hinweisen auf akute Gefährdung die zuständige fachliche Einschätzung veranlassen.',
  resources: 'Frau Schneider nennt ihre Schwester als Vertrauensperson. Gartenarbeit ist eine frühere Aktivität laut Partner. Erfrage, ob sie ihr heute noch wichtig ist.',
  models: ['Hildegard Peplau', 'Carl Rogers'], rationale: 'Peplau hilft, die Pflegebeziehung aufzubauen und Kontaktangebote gemeinsam zu nutzen.',
  law: ['privacy'], legal: 'Vertraulichkeit erklären und bei konkretem Schutzbedarf die Voraussetzungen einer Weitergabe im zuständigen Team klären.',
  standards: [], practice: 'Das Behandlungsteam und geltende Vorgaben zur Kriseneinschätzung einbeziehen. Ein realistisches Kontaktangebot mit Frau Schneider vereinbaren.',
  evaluation: 'Beim Folgetermin erfragen, ob das Angebot erreichbar war und welche Unterstützung Frau Schneider weiter wünscht.'
 },
 praeeklampsie: {
  problems: 'Neu aufgetretene starke Kopfschmerzen und Sehstörungen in der 34. Schwangerschaftswoche bei bekannter Präeklampsie sind die prioritäre Veränderung. Verlauf und weitere Befunde klären.',
  resources: 'Frau Klein äußert Beschwerden und möchte ihren telefonisch erreichbaren Partner an wichtigen Gesprächen beteiligen.',
  models: ['Richard Lazarus', 'Carl Rogers'], rationale: 'Lazarus hilft, zu klären, was Frau Klein als bedrohlich erlebt und welche Unterstützung ihr beim Bewältigen hilft.',
  law: ['consent', 'records'], legal: 'Einwilligung und verständliche Aufklärung bei medizinischen Maßnahmen beachten. Beobachtete Veränderungen und Kommunikation mit dem Team dokumentieren.',
  standards: [], practice: 'Bei Hinweisen auf akute Verschlechterung das zuständige geburtshilfliche Team nach geltendem Vorgehen einbeziehen. Für den Fall ist die geburtshilfliche Leitlinie die naheliegende fachliche Orientierung.',
  evaluation: 'Verlauf und Rückmeldungen dokumentieren. Frau Klein in eigenen Worten wiedergeben lassen, welche nächsten Schritte besprochen wurden.'
 },
 ambulant: {
  problems: 'Sturzrisiko zu Hause, individuelle Ursachen und erreichbare Hilfe erfassen. Wünsche und tatsächliche Schwierigkeiten mit konkreten Textstellen belegen.',
  resources: 'Frau Hoffmann äußert klare Vorlieben und versorgt gern ihre Pflanzen. Tochter und ambulanter Dienst sind erreichbar. Sie möchte weiterhin selbst zur Toilette gehen.',
  models: ['Roper–Logan–Tierney', 'Dorothea Orem'], rationale: 'Roper–Logan–Tierney macht sichtbar, wie Umgebung, Mobilität und Selbstständigkeit beim Toilettengang zusammenhängen.',
  law: ['care'], legal: 'Die Pflegefachperson erhebt den individuellen Pflegebedarf. Änderungen in der Wohnung und Beteiligung Dritter mit Frau Hoffmann vereinbaren.',
  standards: [3], practice: 'Sturzrisiko mit Frau Hoffmann einschätzen und eine akzeptierte Anpassung für eine konkrete Alltagssituation vereinbaren.',
  evaluation: 'Beim nächsten Besuch Wirksamkeit, Nutzbarkeit und subjektives Sicherheitsgefühl prüfen und die Planung gemeinsam anpassen.'
 }
};

const libraryApplicationKeys = ['parkinson', 'leukaemie', 'hno', 'depression', 'praeeklampsie', 'ambulant'];

function caseApplicationHtml(key) {
 const exercise = caseApplications[key];
 if (!exercise) return '';
 return `<section class="panel" aria-labelledby="caseApplicationTitle">
  <h3 id="caseApplicationTitle">Fallanalyse und Transfer</h3>
  <p>Markiere zuerst Hinweise im Falltext. Begründe danach, was du daraus ableitest. Vermutungen und offene Fragen gehören ausdrücklich in deine Antwort.</p>
  <label for="caseApplicationNotes">Deine Fallanalyse</label>
  <textarea id="caseApplicationNotes" placeholder="Textstelle → Problem oder Risiko → Ressource → Begründung → Maßnahme → Wirkung prüfen"></textarea>
  <ol>
   <li><strong>Probleme, Risiken und Ressourcen:</strong> Benenne und belege jeweils ein Beispiel. Welche Angabe fehlt dir?</li>
   <li><strong>Modell oder Theorie:</strong> Wähle einen passenden Begriff und erkläre, wie er deine Einschätzung verändert.</li>
   <li><strong>Recht und Berufsrolle · KB IV:</strong> Benenne eine einschlägige Grundlage. Was bedeutet sie für deine konkrete Entscheidung?</li>
   <li><strong>Zusammenarbeit · KB III:</strong> Was übernimmst du selbst, wen beziehst du ein und was gibst du weiter?</li>
   <li><strong>Expertenstandard oder andere Fachquelle · KB IV/V:</strong> Begründe die Auswahl und leite eine Maßnahme ab. Woran erkennst du ihre Wirkung und was bleibt unsicher?</li>
  </ol>
  <details><summary>Mögliche Fallanalyse und Musterbegründung öffnen</summary>
   <dl>
    <dt><strong>Probleme und Risiken</strong></dt><dd>${esc(exercise.problems)}</dd>
    <dt><strong>Ressourcen</strong></dt><dd>${esc(exercise.resources)}</dd>
    <dt><strong>Modell und Begründung</strong></dt><dd>${esc(exercise.rationale)}</dd>
    <dt><strong>Recht</strong></dt><dd>${esc(exercise.legal)}</dd>
    <dt><strong>Maßnahme und Zuständigkeit</strong></dt><dd>${esc(exercise.practice)}</dd>
    <dt><strong>Evaluation</strong></dt><dd>${esc(exercise.evaluation)}</dd>
   </dl>
   <div class="flex">${exercise.models.map(name => `<button class="btn" onclick="openCaseModel(this.dataset.model)" data-model="${esc(name)}">${esc(name)} vertiefen</button>`).join('')}
   ${exercise.standards.map(index => `<button class="btn" onclick="openExpansionEntry('standards', 'learning-standard-${index}')">${esc(caseStandardTitles[index])} öffnen</button>`).join('')}</div>
   <p>${exercise.law.map(id => {const [label, url] = caseLaw[id]; return `<a href="${url}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`;}).join(' · ')}</p>
  </details>
 </section>`;
}

const caseStandardTitles = {
 0: 'Dekubitusprophylaxe',
 1: 'Entlassungsmanagement',
 3: 'Sturzprophylaxe',
 6: 'Beziehungsgestaltung bei Demenz'
};
