/* Fiktive Langfälle für schriftliches Prüfungstraining. */
const writtenSettings = {
 akut: 'Stationäre Akutversorgung',
 paediatrie: 'Pädiatrie',
 langzeit: 'Pflegeheim · stationäre Langzeitpflege',
 ambulant: 'Ambulanter Pflegedienst',
 tagespflege: 'Tagespflege',
 psychiatrie: 'Psychiatrie',
 reha: 'Rehabilitation'
};

const writtenAgeGroups = {
 infant: 'Säuglinge',
 child: 'Kinder',
 teen: 'Jugendliche',
 adult: 'Erwachsene',
 older: 'Ältere Menschen (65–89)',
 oldest: 'Hochaltrige (ab 90)'
};

const writtenCourses = {
 acute: 'Akut',
 chronic: 'Chronisch',
 mixed: 'Akut bei chronischer Erkrankung'
};

const additionalWrittenCases = [
 {
  id: 'akut-copd', setting: 'akut', ageGroup: 'adult', age: '54 Jahre', course: 'mixed',
  title: 'Frau Seidel bekommt beim Waschen schlechter Luft', focus: 'COPD mit akuter Verschlechterung',
  story: `Frau Seidel, 54 Jahre, ist seit gestern auf einer internistischen Station. Sie lebt mit COPD, wohnt allein und arbeitet stundenweise in einer Bäckerei. Zu Hause teilt sie die Körperpflege ein und setzt sich beim Anziehen hin. Ihre Inhalationsgeräte bringt sie in einer Tasche mit. Eine aktuelle Liste fehlt. Bei der Aufnahme konnte sie in ganzen Sätzen erklären, was ihr im Alltag hilft.

Heute beginnt sie die Körperpflege am Waschbecken. Nach wenigen Minuten stützt sie sich ab, antwortet nur noch mit einzelnen Worten und sagt, auf der Brust sei es enger als zuvor. Im Zimmer liegt ein Sättigungswert von gestern vor. Die Pflegeübergabe zur aktuellen Sauerstoffanordnung war unvollständig. Die Auszubildende schlägt vor, erst die Pflege fertigzumachen. Frau Seidel möchte ihre Tochter anrufen und bittet gleichzeitig darum, nicht allein gelassen zu werden.

Nach der ersten Beurteilung und Übergabe klärt das Team die fehlenden Anordnungen. Frau Seidel erzählt später, dass sie die beiden Inhalatoren an der Farbe unterscheide und neue Geräte schlecht auseinanderhalten könne. Sie möchte wissen, wie sie nach der Entlassung einschätzen kann, wann sie Hilfe braucht. Die Tochter bietet Unterstützung an. Frau Seidel möchte vorerst selbst festlegen, welche Aufgaben sie abgibt.`,
  cues: [
   'abgebrochene Sätze, Abstützen, neu berichtete Enge und Veränderung zum Aufnahmezustand',
   'aktueller Atem- und Kreislaufbefund, Beginn der Beschwerden, geltende Sauerstoffanordnung und aktueller Medikationsplan',
   'selbst gewählte Pausen, Kenntnis der eigenen Belastungsgrenzen und Wunsch nach Hilfe',
   'Atemveränderung während der Körperpflege und Sorge, allein zu bleiben',
   'Grenzen der Belastung im Gespräch vereinbaren und nach Stabilisierung gemeinsam erproben',
   'Zeitpunkt der Veränderung, aktueller Befund, bisherige Schritte und Rückmeldung des zuständigen Teams',
   'Unterschied zwischen den Inhalatoren anhand des aktuellen Plans erklären und von Frau Seidel zeigen lassen',
   'Tochter nur mit Zustimmung und mit einer konkret vereinbarten Aufgabe beteiligen',
   'Anordnung und aktuelle Empfehlung zur Versorgung bei akuter Atemnot auf Geltungsbereich und Übertragbarkeit prüfen'
  ]
 },
 {
  id: 'paed-bronchiolitis', setting: 'paediatrie', ageGroup: 'infant', age: '5 Monate', course: 'acute',
  title: 'Mila trinkt weniger als sonst', focus: 'Bronchiolitis im Säuglingsalter',
  story: `Mila ist fünf Monate alt und liegt seit der Nacht mit ärztlich diagnostizierter Bronchiolitis auf einer Kinderstation. Ihre Mutter bleibt bei ihr. Sie berichtet, Mila trinke seit gestern deutlich kürzer als sonst und habe in der Nacht seltener nasse Windeln gehabt. Die Angaben zu den letzten Mahlzeiten und Windeln wurden bei der Aufnahme noch nicht vollständig erhoben. Sonst lässt sich Mila beim Tragen gut beruhigen.

Beim Frühdienst löst sich Mila wiederholt von der Brust und braucht längere Pausen. Ihre Mutter meint, die Atmung wirke anstrengender als in der Nacht. Eine Kollegin hat unmittelbar nach dem Weinen eine Atemfrequenz notiert. Im Verlauf steht eine weitere Einschätzung an. Die Mutter befürchtet, dass sie etwas falsch gemacht habe, und fragt, ob sie trotzdem beim Füttern helfen kann. Der Vater möchte telefonisch informiert werden. Die Mutter ist seit der Nacht wach und bittet um eine kurze Pause.

Im Team ist abzusprechen, wer Beobachtung und Bilanzierung übernimmt, wie Änderungen weitergegeben werden und wie die Eltern beteiligt werden können. Vor der Entlassung möchten die Eltern in eigenen Worten erklären können, welche Veränderungen sie beobachten und wen sie bei Sorgen kontaktieren.`,
  cues: [
   'kürzeres Trinken, weniger nasse Windeln laut Mutter, Trinkpausen und mögliche Veränderung der Atemarbeit',
   'Atembeobachtung in Ruhe, Trinkverlauf, Windeln, Wachheit und Vergleich zum Ausgangszustand',
   'Beobachtungen der Mutter und vertraute Beruhigung durch Tragen',
   'mögliche Verschlechterung von Atmung und Flüssigkeitsaufnahme',
   'Trinkversuche, Pausen, Ausscheidung und verträgliche Elternbeteiligung im vereinbarten Zeitraum dokumentieren',
   'Messbedingungen, Verlauf und elterliche Beobachtungen bei der Übergabe benennen',
   'Beobachtungszeichen und Kontaktwege in Alltagssprache wiedergeben lassen',
   'Rollen und Informationswünsche der Sorgeberechtigten klären und Entlastung ermöglichen',
   'pädiatrische Vorgaben und Bronchiolitis-Empfehlungen auf Säuglingsalter und Stationssituation prüfen'
  ]
 },
 {
  id: 'ambulant-diabetes', setting: 'ambulant', ageGroup: 'older', age: '68 Jahre', course: 'chronic',
  title: 'Herr Nguyen entscheidet selbst, wie er Hilfe annimmt', focus: 'Typ-2-Diabetes und chronische Fußwunde',
  story: `Herr Nguyen, 68 Jahre, lebt allein und erhält dreimal pro Woche Besuch vom ambulanten Pflegedienst. Bei ihm bestehen Typ-2-Diabetes und eine chronische Fußwunde. Er öffnet selbst die Tür, bereitet seine Mahlzeiten zu und fotografiert seinen Verband, wenn ihm eine Veränderung auffällt. Heute berichtet er, der Verband scheuere im Schuh. Er möchte am Wochenende zum Markt gehen und hat Angst, dass ihm das Team davon abrät.

Im Ordner liegt ein älterer Wundplan. Das zuletzt besprochene Vorgehen ist auf dem Diensthandy und in der Wohnung unterschiedlich dokumentiert. Die Tochter schlägt vor, sämtliche Termine für ihren Vater zu regeln. Herr Nguyen möchte selbst entscheiden und bittet um eine kurze schriftliche Zusammenfassung mit wenigen Fachwörtern. Für den nächsten Hausbesuch ist eine andere Pflegefachperson eingeteilt.

Das Team muss klären, wie der Verlauf vergleichbar erhoben wird, welche Informationen ärztlich oder wundfachlich abgestimmt werden müssen und wer offene Punkte zurückmeldet. Herr Nguyen möchte ein gemeinsames Ziel für den nächsten Besuch vereinbaren. Für das Wochenende wünscht er einen erreichbaren Kontaktweg.`,
  cues: [
   'Scheuern im Schuh, bestehende Wunde, unterschiedliche Planstände und Wunsch nach dem Marktbesuch',
   'aktueller Wundbefund im Vergleich, Schmerz, Schuhsituation und verbindlicher Behandlungsplan',
   'selbstständige Mahlzeiten, Beobachtung mit Fotos und klare Wünsche zur Unterstützung',
   'Kontinuität der abgestimmten Wundversorgung und Teilhabe am Alltag',
   'gemeinsam vereinbaren, was bis zum nächsten Besuch beobachtet und überprüft wird',
   'verbindlichen Planstand, offene Rückfragen und Kontaktweg für den Folgedienst festhalten',
   'schriftliche Hinweise in Alltagssprache erläutern und Handlungsmöglichkeiten besprechen',
   'Beteiligung der Tochter und Weitergabe von Informationen mit Herrn Nguyen klären',
   'aktuellen Wundstandard und den individuellen Behandlungsplan gemeinsam auf Anwendbarkeit prüfen'
  ]
 },
 {
  id: 'tagespflege-demenz', setting: 'tagespflege', ageGroup: 'oldest', age: '100 Jahre', course: 'mixed',
  title: 'Frau Arendt möchte in der Tagespflege bleiben', focus: 'Demenz und neu aufgetretene Verwirrtheit',
  story: `Frau Arendt ist 100 Jahre alt und besucht zweimal pro Woche eine Tagespflege. Sie lebt bei ihrem Sohn. Bei bekannter Demenz findet sie vertraute Beschäftigungen meist selbst, gießt gern Blumen und erkennt ihre Bezugspflegeperson an der Stimme. Sie verwendet einen Rollator und trägt ein Hörgerät. Bei der Ankunft heute sitzt sie ungewöhnlich still am Tisch und greift nach der Tasse einer anderen Besucherin. Beim Aufstehen wirkt sie unsicher. Die Bezugspflegeperson erfährt erst jetzt, dass das Hörgerät heute Morgen nicht eingesetzt wurde.

Der Fahrer berichtet, beim Abholen sei Frau Arendt später als sonst zur Tür gekommen. Der Sohn hatte am Telefon erwähnt, er habe schlecht geschlafen, konnte aber noch keine Angaben zu ihrem üblichen Zustand heute Morgen machen. Eine Betreuungskraft vermutet, die Demenz sei fortgeschritten, und möchte Frau Arendt vorzeitig abholen lassen. Frau Arendt sagt, sie möchte bleiben, solange jemand bei ihr sei. Zu Trinken, Beschwerden und möglichen Veränderungen im Tagesverlauf fehlen Angaben.

Das Team muss zwischen der bekannten Ausgangslage und der heutigen Veränderung unterscheiden, die zuständige Pflegefachperson einbeziehen und die weitere Abklärung und Übergabe organisieren. Für die nächste Tagespflege soll ein gemeinsam vereinbarter Plan verfügbar sein.`,
  cues: [
   'ungewöhnliche Ruhe, unsicheres Aufstehen, Verwechslung von Tassen und fehlendes Hörgerät',
   'gewohnter Zustand, Beginn und Verlauf, aktuelle Beschwerden, Trinkverlauf und Informationen von zu Hause',
   'vertraute Stimme, Blumenpflege, Rollator und geäußerter Wunsch zu bleiben',
   'akute Veränderung fachlich abklären und Sicherheit sowie Orientierung im Tagesablauf berücksichtigen',
   'Orientierung, Mobilität und subjektives Sicherheitsgefühl bis zur nächsten Beurteilung vergleichen',
   'Beobachtungen mit Uhrzeit und Quelle an Pflegefachperson und vereinbarte Beteiligte weitergeben',
   'Frau Arendt in kurzen, verständlichen Sätzen über die nächsten Schritte informieren',
   'Wunsch zu bleiben, Abklärung und eine mögliche Abholung mit Frau Arendt und dem Team abwägen',
   'Vorgaben zur akuten Zustandsveränderung und Empfehlungen zum Umgang mit demenziellen Veränderungen unterscheiden'
  ]
 },
 {
  id: 'psychiatrie-depression', setting: 'psychiatrie', ageGroup: 'teen', age: '16 Jahre', course: 'acute',
  title: 'Nora möchte selbst sprechen', focus: 'Depressive Episode in der Jugendpsychiatrie',
  story: `Nora ist 16 Jahre alt und wurde vor zwei Tagen auf einer jugendpsychiatrischen Station aufgenommen. Im Aufnahmegespräch ist eine depressive Episode beschrieben. Sie fehlt seit Wochen häufig in der Schule, hat das Zeichnen aufgegeben und schläft tagsüber. Im Einzelgespräch sagt sie, sie wolle mit ihrer Mutter über die Schule sprechen, aber vorerst nicht über jedes Detail des Aufnahmegesprächs.

Beim Abenddienst zieht sich Nora in ihr Zimmer zurück. Sie sagt: „Das alles hat sowieso keinen Sinn mehr.“ Sie benennt auf Nachfrage noch nicht, was sie damit meint. Im Dienstplan wechselt die Bezugsperson am nächsten Morgen. Die Mutter ruft an, möchte sämtliche Gesprächsinhalte wissen und kündigt an, Noras Schulmaterial vorbeizubringen. Nora erzählt später, dass ihre Freundin der einzige Kontakt sei, den sie derzeit selbst aufnehmen wolle.

Das Team muss Noras Aussage einordnen, die nötige weitere Einschätzung veranlassen und Absprachen nachvollziehbar übergeben. Bei der Tagesstruktur soll Nora einen ersten machbaren Schritt selbst auswählen. Für ein gemeinsames Gespräch mit der Mutter wünscht sie eine vorherige Absprache darüber, welche Themen geteilt werden.`,
  cues: [
   'Rückzug, veränderter Schlaf, aufgegebene Interessen und die Aussage zur Hoffnungslosigkeit im Wortlaut',
   'Bedeutung der Aussage, aktuelle Sicherheit und Unterstützung im Rahmen fachlicher Einschätzung klären',
   'Wunsch nach Mitbestimmung und selbst gewählter Kontakt zur Freundin',
   'Aussage ernst nehmen und die weitere Einschätzung zeitnah mit dem zuständigen Team abstimmen',
   'eine kleine mit Nora vereinbarte Aktivität und erlebte Belastung zum nächsten Gespräch besprechen',
   'Originalaussage, Zeitpunkt, bisherige Einschätzung und vereinbarte Zuständigkeiten übergeben',
   'Gesprächsangebot und kleine Schritte mit Nora abstimmen und Rückmeldung erfragen',
   'Vertraulichkeit, Einwilligung und Schutz situationsbezogen klären und Rollen für das Elterngespräch vereinbaren',
   'Stationsvorgaben zur Kriseneinschätzung und Empfehlungen für Jugendliche auf Noras Situation beziehen'
  ]
 }
];

function buildAdditionalWrittenExercise(cs) {
 const [facts, gaps, resources, priority, goal, handover, teaching, involvement, source] = cs.cues;
 const exercises = [
  ['Zusammenfassen', 'Fassen Sie den Fall und den Anlass für die aktuelle pflegerische Einschätzung in drei Sätzen zusammen.', facts],
  ['Unterscheiden', 'Trennen Sie eigene Beobachtungen, Aussagen der betroffenen Person und Berichte Dritter. Nennen Sie je ein Beispiel aus dem Fall.', 'Ordnen Sie diese Angaben ihrer jeweiligen Quelle zu: ' + facts],
  ['Benennen', 'Benennen Sie offene Fragen für die erste Einschätzung und erklären Sie, warum zwei davon entscheidungsrelevant sind.', gaps],
  ['Herausarbeiten', 'Arbeiten Sie persönliche Ressourcen und Wünsche heraus. Wie können sie die Planung beeinflussen?', resources],
  ['Priorisieren', 'Ordnen Sie den pflegerischen Handlungsbedarf nach Dringlichkeit und begründen Sie die erste Priorität mit dem Falltext.', priority],
  ['Formulieren', 'Formulieren Sie ein Pflegeproblem mit Symptomen, möglichen Einflussfaktoren und einer Ressource. Kennzeichnen Sie Unklarheiten.', 'Beziehen Sie ' + facts + ' ein. Nutzen Sie als mögliche Ressource: ' + resources],
  ['Formulieren', 'Vereinbaren Sie ein überprüfbares patientenbezogenes Pflegeziel mit Zeitbezug und einem beobachtbaren Kriterium.', goal],
  ['Planen', 'Planen Sie zwei Maßnahmen. Legen Sie Zuständigkeit, Zeitpunkt und Rückmeldekriterium fest.', priority + '. Ergänzen Sie einen konkreten Zeitpunkt und eine verantwortliche Person.'],
  ['Begründen', 'Begründen Sie eine Maßnahme aus Ihrer Planung und nennen Sie einen Befund, bei dem Sie den Plan überprüfen würden.', 'Argumentieren Sie aus der Ausgangslage und vergleichen Sie den Verlauf anhand dieser Angaben: ' + gaps],
  ['Beschreiben', 'Beschreiben Sie, welche Aufgaben bei der Pflege liegen und wo Sie andere Berufsgruppen hinzuziehen oder Rücksprache halten.', 'Benennen Sie Zuständigkeiten passend zur Priorität und klären Sie die Rückmeldung: ' + priority],
  ['Strukturieren', 'Verfassen Sie eine kurze Übergabe nach SBAR mit konkreter Bitte an die empfangende Person.', handover],
  ['Dokumentieren', 'Schreiben Sie einen kurzen Verlaufsvermerk mit Uhrzeit, Quelle, Handlung und vereinbarter Kontrolle.', handover + '. Befund, Interpretation und Entscheidung getrennt festhalten.'],
  ['Erläutern', 'Erläutern Sie, wie Sie die Person beziehungsweise die Sorgeberechtigten beraten und das Verständnis überprüfen.', teaching],
  ['Abwägen', 'Wägen Sie die Beteiligung von Angehörigen im Fall ab und formulieren Sie einen Satz, mit dem Sie die Wünsche klären.', involvement],
  ['Beurteilen', 'Beurteilen Sie einen Vorschlag oder eine Annahme aus der Fallsituation. Nennen Sie eine Alternative mit Fallbezug.', 'Vergleichen Sie den Vorschlag mit den vorliegenden Beobachtungen und dem Wunsch der Person. Orientieren Sie sich an: ' + priority],
  ['Überprüfen', 'Nennen Sie eine geeignete fachliche Grundlage und erklären Sie, wie Sie Aktualität und Anwendbarkeit prüfen.', source],
  ['Evaluieren', 'Beschreiben Sie, wann und womit Sie die Zielerreichung überprüfen. Was ändern Sie bei ausbleibender Wirkung?', goal + '. Vereinbaren Sie Kriterien für eine erneute Einschätzung.'],
  ['Reflektieren', 'Nennen Sie eine Unsicherheit, die nach der ersten Einschätzung bleibt. Wie machen Sie sie für den Folgedienst sichtbar?', 'Wählen Sie eine noch offene Angabe aus ' + gaps + ' und dokumentieren Sie Zuständigkeit sowie Frist für die Klärung.']
 ];
 return {tasks: exercises.map(([operator, task]) => [operator, task]), answers: exercises.map(entry => entry[2])};
}
