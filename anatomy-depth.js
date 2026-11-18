/* Original teaching notes. Reference: OpenStax Anatomy and Physiology 2e. */
const anatomyDepth = {
 heart: {
  build: [
   'Das Herz liegt zwischen den Lungen im Mediastinum. Herzbeutel, Herzmuskel und Herzinnenhaut umgeben beziehungsweise bilden seine Wand. Die Herzscheidewand trennt die rechte und linke Pumpseite.',
   'Jede Seite besitzt Vorhof und Kammer. Trikuspidal- und Mitralklappe liegen zwischen Vorhof und Kammer. Pulmonal- und Aortenklappe liegen am Ausstrom der Kammern. Die Klappen öffnen und schließen durch Druckunterschiede.',
   'Arterien führen vom Herzen weg, Venen zum Herzen hin. In Kapillaren findet Stoffaustausch statt. Herzkranzgefäße versorgen den Herzmuskel selbst.'
  ],
  physiology: [
   'Körpervenen → rechter Vorhof → rechte Kammer → Lungenarterien → Lunge → Lungenvenen → linker Vorhof → linke Kammer → Aorta → Körper.',
   'In der Diastole erschlaffen und füllen sich die Kammern. In der Systole steigt der Kammerdruck und Blut wird ausgeworfen. Herzzeitvolumen = Herzfrequenz × Schlagvolumen.',
   'Der Sinusknoten gibt normalerweise den Rhythmus vor. Die Erregung läuft über die Vorhöfe, mit Verzögerung über den AV-Knoten und dann über His-Bündel, Tawara-Schenkel und Purkinje-Fasern zu den Kammern.'
  ],
  question: 'Warum kann eine Schwäche der linken Herzkammer Atemnot verursachen?',
  answer: 'Wenn die linke Kammer Blut schlechter weiterbefördert, kann der Druck im Lungenkreislauf steigen. Flüssigkeit kann ins Lungengewebe gelangen und den Gasaustausch erschweren.',
  topics: ['Herz und Kreislauf –', 'Herzinsuffizienz', 'Arterielle Hypertonie', 'Koronare Herzkrankheit', 'Vorhofflimmern', 'Periphere arterielle', 'Tiefe Venenthrombose']
 },
 lungs: {
  build: [
   'Nase und obere Atemwege erwärmen, befeuchten und filtern Luft. Der Kehlkopf beteiligt sich am Schutz der Atemwege und an der Stimmbildung.',
   'Die Luftröhre teilt sich in Hauptbronchien. Kleinere Bronchien und Bronchiolen führen zur Gasaustauschzone mit Alveolen. Schleim und Flimmerhärchen transportieren Partikel aus den leitenden Atemwegen.',
   'Die rechte Lunge hat drei Lappen, die linke zwei. Lungenfell und Rippenfell begrenzen einen schmalen Flüssigkeitsspalt, über den sich die Bewegung des Brustkorbs auf die Lunge überträgt.'
  ],
  physiology: [
   'Beim Einatmen kontrahiert das Zwerchfell und senkt sich. Das Brustraumvolumen steigt, der Druck in den Alveolen sinkt und Luft strömt ein. Ruhiges Ausatmen erfolgt überwiegend durch elastische Rückstellung.',
   'Sauerstoff diffundiert aus den Alveolen ins Kapillarblut und bindet überwiegend an Hämoglobin. Kohlendioxid diffundiert in Gegenrichtung. Surfactant senkt die Oberflächenspannung der Alveolen.',
   'Ventilation bezeichnet die Belüftung, Perfusion die Durchblutung. Für den Gasaustausch müssen beide im selben Lungenabschnitt zusammenwirken.'
  ],
  question: 'Warum kann eine Lungenembolie den Gasaustausch stören, obwohl Luft in die Lunge gelangt?',
  answer: 'In betroffenen Abschnitten kommt Luft an, aber ein Teil der Durchblutung fällt aus. Die belüfteten Alveolen können dadurch weniger zum Gasaustausch beitragen.',
  topics: ['Anatomie – Atmung', 'COPD – akute', 'Asthma bronchiale', 'Pneumonie', 'Tiefe Venenthrombose', 'Thoraxdrainage', 'Tracheostoma']
 },
 gut: {
  build: [
   'Der Verdauungstrakt reicht von Mund und Rachen über Speiseröhre und Magen zu Dünndarm, Dickdarm und Enddarm. Peristaltik befördert den Inhalt; Schließmuskeln kontrollieren Übergänge.',
   'Der Dünndarm besteht aus Duodenum, Jejunum und Ileum. Falten, Zotten und Mikrovilli vergrößern seine Aufnahmefläche. Im Dickdarm werden unter anderem Wasser und Elektrolyte aufgenommen.',
   'Die Leber bildet Galle. Die Gallenblase speichert und konzentriert sie. Der exokrine Pankreas gibt Verdauungsenzyme und Bicarbonat ins Duodenum ab.'
  ],
  physiology: [
   'Im Mund beginnt der Kohlenhydratabbau. Im Magen mischen sich Nahrung, Säure und Pepsin. Im Dünndarm werden Nährstoffe durch Enzyme weiter zerlegt und überwiegend aufgenommen.',
   'Gallensäuren erleichtern die Verarbeitung von Fetten. Viele wasserlösliche Nährstoffe gelangen über die Pfortader zur Leber; ein großer Teil der aufgenommenen langkettigen Fette gelangt zunächst über die Lymphe ins Blut.',
   'Die Leber verarbeitet Nährstoffe, speichert Glykogen und bildet unter anderem Albumin und mehrere Gerinnungsfaktoren.'
  ],
  question: 'Was unterscheidet Galle von Pankreasenzymen?',
  answer: 'Galle erleichtert die Verteilung und Aufnahme von Fetten. Pankreasenzyme spalten Nährstoffe chemisch.',
  topics: ['Verdauungssystem –', 'Dysphagie', 'Chronisch-entzündliche Darmerkrankungen', 'Leberzirrhose', 'Akute Pankreatitis', 'Kolorektales Karzinom', 'Appendizitis']
 },
 kidney: {
  build: [
   'Die Nieren liegen beidseits der Wirbelsäule hinter dem Bauchfell. Nierenrinde und Nierenmark enthalten Abschnitte der Nephrone. Sammelrohre leiten den Harn zu Kelchen und Nierenbecken.',
   'Ein Nephron besteht aus Nierenkörperchen und Tubulussystem. Im Nierenkörperchen bildet der Glomerulus mit der Bowman-Kapsel den Filtrationsapparat.',
   'Urin fließt über die Harnleiter zur Blase. Blasenmuskel, Schließmuskeln, Beckenboden und Nerven wirken bei Speicherung und Entleerung zusammen.'
  ],
  physiology: [
   'Filtration erzeugt Primärharn. Im Tubulus werden Wasser und benötigte Stoffe zurückgewonnen und andere Stoffe gezielt in den Harn abgegeben.',
   'Die Henle-Schleife unterstützt den Aufbau eines Konzentrationsgefälles im Nierenmark. ADH erhöht die Wasserdurchlässigkeit der Sammelrohre. Aldosteron beeinflusst Natriumrückresorption und Kaliumausscheidung.',
   'Die Nieren wirken an Blutdruck- und Säure-Basen-Regulation mit, bilden Erythropoetin und aktivieren Vitamin D.'
  ],
  question: 'Warum sind Filtration und Urinmenge nicht dasselbe?',
  answer: 'Der größte Teil des Filtrats wird im Tubulussystem rückresorbiert. Die ausgeschiedene Urinmenge hängt auch von Wasserhaushalt und hormoneller Regulation ab.',
  topics: ['Nieren und Harnwege –', 'Akute Nierenschädigung', 'Chronische Nierenerkrankung', 'Harnwegsinfektion', 'Harninkontinenz und Harnverhalt']
 },
 brain: {
  build: [
   'Gehirn und Rückenmark bilden das zentrale Nervensystem. Nerven und Nervenknoten außerhalb davon bilden das periphere Nervensystem.',
   'Das Großhirn verarbeitet unter anderem Wahrnehmung, Sprache und willkürliche Bewegung. Kleinhirn und Hirnstamm sind wichtig für Koordination beziehungsweise lebenswichtige Grundfunktionen.',
   'Hirnhäute, Liquor und knöcherne Strukturen schützen Gehirn und Rückenmark. Nervenzellen bestehen typischerweise aus Zellkörper, Dendriten und Axon.'
  ],
  physiology: [
   'Afferente Bahnen führen Informationen zum zentralen Nervensystem, efferente Bahnen leiten Signale hinaus. Synapsen übertragen Signale zwischen Zellen, häufig über Botenstoffe.',
   'Myelin isoliert Axone abschnittsweise und erlaubt schnellere Reizleitung. Ein Reflex kann auf Rückenmarksebene verarbeitet werden.',
   'Das vegetative Nervensystem beeinflusst etwa Herz, Verdauung und Drüsen. Sympathikus und Parasympathikus wirken je nach Organ und Situation unterschiedlich.'
  ],
  question: 'Was bedeuten afferent und efferent bei einem Rückziehreflex?',
  answer: 'Afferente Fasern melden den Reiz zum Rückenmark. Efferente Fasern leiten den motorischen Impuls zum Muskel.',
  topics: ['Nervensystem –', 'Schlaganfall und TIA', 'Epilepsie', 'Parkinson-Krankheit', 'Multiple Sklerose', 'Delir', 'Demenz']
 },
 bones: {
  build: [
   'Das Achsenskelett umfasst Schädel, Wirbelsäule und Brustkorb. Das Extremitätenskelett umfasst Schulter- und Beckengürtel sowie Arme und Beine.',
   'Knochen besitzen eine feste Außenschicht und je nach Abschnitt ein trabekuläres Inneres. Knochenmark dient unter anderem der Blutbildung.',
   'Ein frei bewegliches Gelenk besitzt Gelenkflächen mit Knorpel, einen Gelenkspalt mit Synovialflüssigkeit und eine Kapsel. Bänder stabilisieren; Sehnen übertragen Muskelkraft auf Knochen.'
  ],
  physiology: [
   'Osteoblasten bauen Knochen auf, Osteoklasten bauen ihn ab. Der Knochen passt sich durch Umbau an Belastung an und speichert Mineralstoffe.',
   'Skelettmuskeln entwickeln Kraft durch das Zusammenspiel von Aktin und Myosin. Agonist und Antagonist wirken bei kontrollierter Bewegung zusammen.',
   'Aktive Bewegung erfolgt durch eigene Muskelkraft. Passive Bewegung wird von außen geführt. Kraft und Beweglichkeit sind unterschiedliche Beobachtungsgrößen.'
  ],
  question: 'Worin unterscheiden sich Sehne und Band?',
  answer: 'Eine Sehne überträgt Muskelkraft auf Knochen. Ein Band verbindet meist Knochen mit Knochen und hilft, ein Gelenk zu stabilisieren.',
  topics: ['Bewegungsapparat –', 'Arthrose', 'Osteoporose', 'Rheumatoide Arthritis', 'DNQP – Sturzprophylaxe', 'ICF –']
 },
 skin: {
  build: [
   'Die Oberhaut ist gefäßlos. Ihre Hornschicht begrenzt Wasserverlust und bildet eine Barriere. Neue Zellen entstehen in den tieferen Epidermisschichten.',
   'Die Lederhaut enthält Bindegewebe, Blutgefäße und Nerven. Haare und Drüsen liegen überwiegend in oder reichen durch die Lederhaut.',
   'Die Unterhaut besteht vor allem aus Binde- und Fettgewebe. Sie verbindet die Haut mit tieferen Strukturen, polstert und isoliert.'
  ],
  physiology: [
   'Hautdurchblutung und Schweiß beeinflussen die Wärmeabgabe. Rezeptoren vermitteln Druck, Berührung, Temperatur und Schmerz.',
   'Wundheilung umfasst überlappende Abschnitte: Blutstillung, Entzündung, Neubildung von Gewebe und Umbau. Neues Gewebe benötigt ausreichende Durchblutung und geeignete Heilungsbedingungen.',
   'Druck und Scherkräfte können tieferes Gewebe schädigen. Feuchtigkeit beeinträchtigt die Barriere auf andere Weise. Für die Einordnung zählen Lokalisation, Form, Kontext und Verlauf.'
  ],
  question: 'Warum gehört bei einer Hautveränderung die Lage zur Beschreibung?',
  answer: 'Die Lage hilft, Belastungsursachen einzugrenzen. Über einem Knochenvorsprung ist Druck eine wichtige Frage, in feuchten Hautfalten spielen eher Feuchtigkeit und Reibung mit.',
  topics: ['Haut – Schutzbarriere', 'Dekubitus – Haut', 'DNQP – Dekubitusprophylaxe', 'Chronische Wunde', 'Hygiene, Infektionsprävention']
 },
 endocrine: {
  build: [
   'Hypothalamus und Hypophyse koordinieren mehrere Hormonachsen. Zielorgane sind unter anderem Schilddrüse, Nebennierenrinde und Keimdrüsen.',
   'Schilddrüse und Nebenschilddrüsen liegen nah beieinander, erfüllen aber unterschiedliche Aufgaben. Schilddrüsenhormone beeinflussen den Stoffwechsel; Parathormon reguliert den Kalziumhaushalt mit.',
   'Die Nebennieren bestehen aus Rinde und Mark. Die Pankreasinseln enthalten unter anderem insulinbildende Beta-Zellen und glucagonbildende Alpha-Zellen.'
  ],
  physiology: [
   'Hormone erreichen über Blut ihre Zielgewebe und wirken über passende Rezeptoren. Viele Hormonachsen regulieren sich über negative Rückkopplung.',
   'Insulin unterstützt nach einer Mahlzeit die Aufnahme von Glucose in bestimmte Gewebe und die Speicherung von Energie. Glucagon unterstützt bei niedrigerem Angebot die Bereitstellung von Glucose aus der Leber.',
   'Cortisol beeinflusst Stoffwechsel und Stressantwort. Aldosteron wirkt auf den Salz- und Wasserhaushalt. Das Nebennierenmark setzt unter anderem Adrenalin frei.'
  ],
  question: 'Wie funktioniert negative Rückkopplung in der Schilddrüsenachse?',
  answer: 'Bei ausreichend hohen Schilddrüsenhormonspiegeln wird die weitere Stimulation durch Hypothalamus und Hypophyse gedämpft.',
  topics: ['Endokrines System –', 'Diabetes mellitus', 'Hypoglykämie', 'Insulin –', 'Schilddrüsenunterfunktion']
 },
 blood: {
  build: [
   'Blut besteht aus Plasma und zellulären Bestandteilen. Erythrozyten transportieren Sauerstoff, Leukozyten dienen der Abwehr und Thrombozyten unterstützen die Blutstillung.',
   'Blutzellen entstehen im Knochenmark. Lymphgefäße, Lymphknoten und lymphatische Organe unterstützen Flüssigkeitsrücktransport und Immunüberwachung.',
   'Lymphknoten filtern Lymphe. Die Milz filtert Blut, baut unter anderem gealterte Erythrozyten ab und unterstützt die Immunabwehr.'
  ],
  physiology: [
   'Die primäre Blutstillung erzeugt einen Thrombozytenpfropf. Die plasmatische Gerinnung stabilisiert ihn mit Fibrin.',
   'Angeborene Abwehr reagiert rasch auf typische Gefahrensignale. Adaptive Abwehr richtet sich gezielt gegen Antigene. B-Zellen und T-Zellen erfüllen dabei unterschiedliche Aufgaben.',
   'Lymphgefäße führen Gewebsflüssigkeit zurück ins Venensystem. Darmlymphgefäße transportieren außerdem einen Teil der aufgenommenen Fette.'
  ],
  question: 'Warum filtern Lymphknoten und Milz unterschiedliche Flüssigkeiten?',
  answer: 'Lymphknoten liegen an Lymphwegen und filtern Lymphe aus dem Gewebe. Die Milz ist in den Blutkreislauf eingebunden und filtert Blut.',
  topics: ['Leukämie', 'Sepsis und septischer', 'Tiefe Venenthrombose', 'Thromboseprophylaxe', 'Hygiene, Infektionsprävention']
 },
 senses: {
  build: [
   'Hornhaut und Linse bündeln Licht auf der Netzhaut. Stäbchen sind für Sehen bei geringer Helligkeit wichtig, Zapfen für Farbsehen und hohe Sehschärfe. Der Sehnerv leitet Signale weiter.',
   'Das Trommelfell und die Gehörknöchelchen übertragen Schall zum Innenohr. In der Cochlea wandeln Haarzellen mechanische Reize in Nervensignale um.',
   'Bogengänge erfassen Drehbeschleunigungen. Weitere Anteile des Gleichgewichtsorgans registrieren lineare Beschleunigung und Kopfneigung.'
  ],
  physiology: [
   'Bei der Akkommodation ändert die Linse ihre Brechkraft. Die Pupille reguliert den Lichteinfall; das Gehirn verarbeitet die Signale beider Augen.',
   'Geruch und Geschmack arbeiten zusammen. Mechanische, thermische und schmerzhafte Reize erfassen unterschiedliche Rezeptoren.',
   'Das Gehirn verbindet Gleichgewichtssignale aus dem Innenohr mit Sehen und Rückmeldung aus Muskeln und Gelenken. Einschränkungen können deshalb Mobilität und Orientierung gleichzeitig betreffen.'
  ],
  question: 'Warum beurteilst du bei unsicherem Gehen auch Sehen und Gleichgewicht?',
  answer: 'Orientierung und Haltung beruhen auf der Verarbeitung mehrerer Sinnesinformationen. Seh- oder Gleichgewichtsprobleme können selbst bei guter Muskelkraft zu Unsicherheit führen.',
  topics: ['Nervensystem –', 'DNQP – Sturzprophylaxe', 'Delir', 'Assessmentinstrumente']
 },
 reproductive: {
  build: [
   'Eierstöcke enthalten Follikel und bilden Hormone. Eileiter nehmen die Eizelle auf. Die Gebärmutter besteht überwiegend aus Muskulatur und besitzt innen eine Schleimhaut (Endometrium).',
   'Hoden bilden Spermien und Testosteron. Spermien reifen im Nebenhoden; Samenleiter transportieren sie weiter. Drüsen wie Samenbläschen und Prostata tragen zur Samenflüssigkeit bei.',
   'In der Schwangerschaft vermittelt die Plazenta den Stoffaustausch zwischen mütterlichem und kindlichem Kreislauf. Die Nabelschnur verbindet Plazenta und Kind.'
  ],
  physiology: [
   'FSH und LH aus der Hypophyse steuern Funktionen der Keimdrüsen. Im typischen Zyklus reift ein Follikel heran; der LH-Anstieg löst den Eisprung aus. Danach bildet der Gelbkörper vor allem Progesteron.',
   'Progesteron unterstützt die Vorbereitung und Erhaltung der Gebärmutterschleimhaut. Ohne Schwangerschaft sinken die Hormonspiegel; die funktionelle Schleimhautschicht wird abgestoßen.',
   'Prolaktin unterstützt die Milchbildung. Oxytocin fördert die Milchausstoßung durch Kontraktion von Zellen um die Milchgänge und Alveolen.'
  ],
  question: 'Welche verschiedenen Aufgaben haben Prolaktin und Oxytocin beim Stillen?',
  answer: 'Prolaktin unterstützt die Bildung der Milch. Oxytocin hilft, die bereits gebildete Milch auszustoßen.',
  topics: ['Präeklampsie', 'EACH-Charta', 'Friedemann']
 }
};
