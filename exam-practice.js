/* Prüfungsformate: additive, rechtlich ausgerichtete Übungssimulationen. */
const examFormats = {
 schriftlich: {
  title:'Schriftlicher Teil',
  rule:'Drei fallbezogene Aufsichtsarbeiten, je 120 Minuten. In Hamburg in der Regel an drei aufeinanderfolgenden Werktagen. Jede Arbeit muss mindestens ausreichend sein.',
  cases:[
   {title:'Prüfungsbereich 1 · Pflegeprozess und Beziehung', focus:'Pflegeprozessgestaltung, Interaktion, Lebenswelt, Autonomie und ausgewählte rechtliche/ethische Kontexte', story:'Herr M., 58 Jahre, lebt mit seiner Partnerin in einer Wohnung im dritten Stock. Nach einem Schlaganfall ist er auf einer neurologischen Station. Er versteht Aufforderungen, braucht aber mehr Zeit beim Sprechen und ist bei der Körperpflege teilweise auf Unterstützung angewiesen. Die Partnerin beantwortet häufig Fragen für ihn. Herr M. möchte möglichst bald wieder selbstständig essen und nach Hause zurückkehren. Bei der Morgenpflege zieht er sich zurück und sagt: „Lassen Sie mich in Ruhe.“', tasks:['Analysiere die pflegerische Situation. Benenne vorrangige Pflegeprobleme, Ressourcen und noch fehlende Informationen.','Formuliere zwei konkrete, überprüfbare Pflegeziele und plane passende Maßnahmen, die Selbstbestimmung und Kommunikation berücksichtigen.','Begründe, wie du Herrn M. und seine Partnerin beteiligst und mit der ablehnenden Äußerung bei der Pflege umgehst.'], guide:['Fallinformationen geordnet nutzen; Prioritäten, Ressourcen und Informationslücken nachvollziehbar unterscheiden.','Ziele personenzentriert und überprüfbar formulieren; Maßnahmen konkret, sicher und individuell mit Begründung planen.','Herrn M. direkt, verständlich und mit ausreichender Antwortzeit ansprechen; Einwilligung und Ablehnung beachten, Unterstützung anbieten und Bezugsperson nur passend zu seinem Willen einbeziehen.']},
   {title:'Prüfungsbereich 2 · Prävention, Gesundheitsförderung und Beratung', focus:'Pflegeprozess bei gesundheitlichen Problemlagen, Prävention, Beratung und wissenschaftliche Begründung', story:'Der neunjährige Leo ist nach einer Appendektomie auf einer Kinderstation. Er möchte aufstehen und zum Fenster gehen, klagt dabei aber über Schmerzen. Seine Mutter ist besorgt, dass Bewegung die Wunde aufreißt, und möchte, dass Leo bis zur Entlassung im Bett bleibt. Der Verband ist trocken; Leo ist fieberfrei, hat heute jedoch wenig getrunken. Er fragt, ob er selbst etwas tun kann, damit er nach Hause darf. Die Eltern sprechen Deutsch, wünschen sich aber eine verständliche Erklärung ohne viele Fachwörter. Leo erzählt, dass er Angst vor dem Ziehen der Wunde beim Aufstehen hat und gern selbst entscheiden möchte, wann er eine Pause braucht. Angaben zu Schmerzstärke, Kreislauf, ärztlichen Vorgaben, bisheriger Mobilität und seinem Vorwissen fehlen noch. Die Pflegefachperson möchte Leo und seine Mutter beraten, ohne die postoperative Sicherheit, die kindgerechte Beteiligung und individuelle Bedürfnisse zu übergehen.', tasks:['Welche pflegerischen Einschätzungen und Informationen brauchst du bei Leo und seiner Mutter, bevor du die nächsten Schritte planst?','Entwickle ein kindgerechtes Beratungsangebot zu sicherer Mobilisation und Genesung. Beschreibe, wie du Leo beteiligst und seine Mutter einbeziehst.','Begründe deine Empfehlungen mit pflegefachlichem Wissen und beschreibe, woran du die Wirkung evaluierst.'], guide:['Schmerz, Kreislauf, Mobilität, Wundzustand, ärztliche Vorgaben, Trinkmenge, Vorwissen, Ängste und individuelle Ziele erheben.','Leo altersgerecht direkt ansprechen, Zustimmung einholen, verständlich erklären und Mutter passend beteiligen; kleine Schritte und Pausen vereinbaren.','Sichere Mobilisation nicht pauschal verbieten oder erzwingen; Verlauf von Schmerz, Belastbarkeit, Kreislauf und Wunde beobachten und Plan mit Team/Anordnung abstimmen.']},
   {title:'Prüfungsbereich 3 · Kritische Situation und ethische Entscheidung', focus:'Krisenmanagement, ärztliche Anordnungen, Zusammenarbeit und ethische Abwägung', story:'In einer stationären Pflegeeinrichtung wirkt Herr B., 79 Jahre, plötzlich deutlich verwirrter als am Vormittag. Er ist blass, atmet schneller und sagt, ihm sei schwindelig. Seine Tochter fordert, ihn sofort ins Bettgitter zu legen, damit er nicht stürzt. Eine Kollegin möchte zunächst den nächsten Rundgang abwarten. Zu aktuellen Vitalwerten und Medikamenten liegen noch keine Informationen vor.', tasks:['Ordne die Situation nach Dringlichkeit. Beschreibe deine ersten Schritte und welche Beobachtungen du sofort erhebst.','Wie organisierst du die Zusammenarbeit und welche Informationen gibst du strukturiert weiter?','Wäge den Wunsch der Tochter und die Sicherheit des Bewohners ethisch und rechtlich ab. Welche Entscheidung triffst du und wie evaluierst du sie?'], guide:['Akute Veränderung als potenziell dringlich behandeln; beim Bewohner bleiben, systematisch nach ABCDE beurteilen, Vitalzeichen erheben und unverzüglich passende Hilfe organisieren.','Zuständige Pflegefachperson/ärztlichen Dienst nach Lage alarmieren, SBAR nutzen, Verlauf, Werte, Medikamente und Maßnahmen präzise mitteilen; Anordnungen prüfen und Rückfragen klären.','Wunsch ernst nehmen, Bewohnerwillen und Einwilligungsfähigkeit berücksichtigen, mildere geeignete Maßnahmen prüfen; Bettgitter nicht automatisch als Standard einsetzen. Entscheidung, Rechtsgrundlage, Verlauf und Wirkung dokumentieren.']}
  ]
 },
 praktisch: {
  title:'Praktischer Teil',
  rule:'Hamburg: praktische Prüfung mit Pflegeplanung, Fallvorstellung, geplanter und situativ erforderlicher Pflege sowie Reflexionsgespräch. Der Durchführungsteil dauert mindestens 120 und höchstens 240 Minuten einschließlich Fallvorstellung und Reflexion.',
  guidance:'Die praktische Prüfung wird nicht mit einem erfundenen App-Fall simuliert: Krankheitsbild, Pflegebedarf und Situation der zugeteilten Person sind vorher nicht verlässlich absehbar. Übe die praktische Durchführung in deiner Ausbildungseinrichtung und deinen Praxiseinsätzen gemeinsam mit Praxisanleitung und Schule. Richte dich dabei nach der tatsächlichen Versorgungssituation, den geltenden Standards und den Vorgaben deiner Einrichtung.'
 },
 muendlich: {
  title:'Mündlicher Teil',
  rule:'Geprüft werden Kompetenzbereiche III, IV und V anhand einer komplexen Fallsituation aus einem anderen Versorgungskontext und einer anderen Altersstufe als in der praktischen Prüfung. Hamburg: 30 Minuten Vorbereitung unter Aufsicht, anschließend 30–45 Minuten Prüfungsgespräch.',
  scenario:'Samira ist 17 Jahre alt und lebt mit ihrer Mutter und zwei jüngeren Geschwistern. Seit ihrer Kindheit wird sie wegen eines insulinpflichtigen Typ-1-Diabetes regelmäßig in einer Kinder- und Jugendklinik betreut. Sie besucht eine berufsvorbereitende Schule und möchte nach dem Abschluss eine Ausbildung beginnen. In den letzten Monaten hat sie drei Kontrolltermine abgesagt. Bei einem Telefonat sagt sie, dass Schule, familiäre Aufgaben und die vielen Termine sie überfordern. Sie möchte Gespräche künftig selbst führen und selbst entscheiden, welche Informationen ihre Mutter erhält. Zurzeit wohnt sie weiter bei ihrer Mutter und ist auf deren Unterstützung bei Fahrten angewiesen. Die Mutter sorgt sich wegen der Erkrankung und bittet das Team, ihr alle Befunde und Gesprächsinhalte mitzuteilen. Sie sagt, Samira vergesse oft Absprachen und brauche mehr Kontrolle. Samira widerspricht und möchte nicht, dass ihre Mutter ohne Rücksprache in die Gespräche einbezogen wird. Sie wirkt angespannt, beantwortet Fragen aber klar und kann erklären, warum ihr Privatsphäre wichtig ist. Ob sie jede konkrete medizinische Entscheidung selbst überblickt, wurde im heutigen Kontakt noch nicht systematisch besprochen. Im Team gibt es unterschiedliche Einschätzungen: Eine Pflegefachperson möchte zunächst mit Samira allein sprechen und gemeinsam klären, welche Unterstützung sie annimmt. Eine andere möchte die Mutter zu allen Terminen verpflichtend hinzuziehen, damit nichts versäumt wird. Die Ärztin bittet um eine abgestimmte Lösung, damit notwendige Kontrollen und die Versorgungskontinuität gesichert bleiben. Die Schulsozialarbeit hat angeboten, mit Samiras Einverständnis bei der Organisation des Schulalltags zu helfen. Samira wäre bereit, einen Termin in der Klinik wahrzunehmen, wenn er mit ihr abgestimmt ist und sie vorher weiß, welche Themen besprochen werden. Im Fall liegen noch keine Angaben dazu vor, welche Informationen Samira ihrer Mutter freigeben möchte, wie sie ihre Erkrankung im Alltag selbst managt, welche Hindernisse die Termine erschweren und welche Unterstützung sie als hilfreich erlebt.',
  tasks:['Fasse den Fall zusammen und erläutere den intra- und interprofessionellen Handlungsbedarf. Welche Personen oder Berufsgruppen sollten beteiligt werden und mit welchem Auftrag?','Welche rechtlichen und ethischen Aspekte prüfst du, besonders zu Beteiligung, Vertraulichkeit, Autonomie und Schutz? Begründe dein Vorgehen.','Welche pflegewissenschaftlichen Erkenntnisse oder fachlichen Standards helfen bei der Planung? Wie würdest du den Nutzen der vereinbarten Unterstützung überprüfen?','Reflektiere die Berufsrolle: Wie gehst du mit unterschiedlichen Sichtweisen im Team und mit deiner eigenen Haltung um?'],
  guide:['Kooperation mit Samira und – passend zu ihrem Willen und den rechtlichen Voraussetzungen – ihrer Mutter; Teamabstimmung und bei Bedarf ärztliche, psychologische oder sozialpädagogische Beteiligung mit klaren Aufgaben.','Entwicklungsstand und konkrete Entscheidungsfähigkeit situationsbezogen beachten; Datenschutz/Schweigepflicht, Beteiligung, Kindeswohl und Selbstbestimmung differenziert abwägen; keine pauschale Weitergabe oder Kontrolle ohne Begründung.','Geeignete aktuelle Leitlinien, Evidenz und lokale Standards nennen, deren Übertragbarkeit prüfen, Präferenzen berücksichtigen und Ziele/Ergebnisse gemeinsam evaluieren.','Respektvolle, nicht wertende Kommunikation; Konflikte sachlich ansprechen, Entscheidungen transparent begründen und eigenes Handeln kritisch reflektieren.']
 }
};
let examMode='schriftlich', examCaseIndex=0, examTimer=null, examFormatSeconds=0;
function examEsc(x){return esc(x)}
function examSetMode(mode){examStartTimer(0);examMode=mode;examCaseIndex=0;examRender()}
function examRender(){
 const c=document.querySelector('#content'),f=examFormats[examMode]; if(!c)return;
 let html='<div class="panel knowledge"><span class="tag">Prüfungstraining · Stand 2026</span><h2>Prüfungsformate üben</h2><p>Übe in der Reihenfolge, die sich bewährt: erst selbst denken und begründen, dann mit Kriterien vergleichen und anschließend gezielt nacharbeiten.</p><div class="flex">'+[['schriftlich','Schriftlich'],['praktisch','Praktisch'],['muendlich','Mündlich']].map(([id,label])=>'<button class="btn '+(examMode===id?'primary':'')+'" onclick="examSetMode(\''+id+'\')">'+label+'</button>').join('')+'</div><div class="learn-box tone-warning"><h3>Was dieser Bereich abbildet</h3><p>Die Formate und Zeitrahmen sind nach PflAPrV und den Hamburger Handreichungen aus 03/2026 bzw. 04/2026 gestaltet. Die Fälle sind selbst erstellte Übungsfälle, keine offiziellen Prüfungsaufgaben. Die App kann keine staatliche Note vergeben.</p></div><p class="muted">'+examEsc(f.rule)+'</p>';
 html+='<div class="card"><h3>Bestehen und Benotung</h3><ul><li>Schriftlich: Jede der drei Aufsichtsarbeiten muss mindestens ausreichend sein.</li><li>Die schriftliche, mündliche und praktische Teilnote muss jeweils mindestens ausreichend sein.</li><li>Die Vornote zählt bei jedem Prüfungsteil 25 Prozent; die Gesamtnote der staatlichen Prüfung ist der Mittelwert der drei Teilnoten.</li></ul><p class="muted">Die Hamburger Handreichung ergänzt für den schriftlichen Teil, dass die drei Fälle unterschiedliche Altersstufen, Lebenswelten und Versorgungsbereiche abbilden sollen.</p><a href="https://www.gesetze-im-internet.de/pflaprv/__13.html" target="_blank" rel="noopener noreferrer">§ 13 Vornoten</a> · <a href="https://www.gesetze-im-internet.de/pflaprv/__19.html" target="_blank" rel="noopener noreferrer">§ 19 Bestehen und Wiederholung</a></div>';
 if(examMode==='schriftlich'){
  const q=f.cases[examCaseIndex];
  html+='<div class="card"><span class="tag">'+examEsc(q.title)+'</span><h3>Schwerpunkt</h3><p>'+examEsc(q.focus)+'</p><h3>Fallsituation</h3><p>'+examEsc(q.story)+'</p><h3>Aufgaben</h3><ol>'+q.tasks.map(x=>'<li>'+examEsc(x)+'</li>').join('')+'</ol><label for="examAnswer">Deine Antwort – begründe deine Entscheidungen am Fall</label><textarea id="examAnswer" placeholder="Schreibe zunächst ohne Musterlösung. Benenne Fallbezug, Priorität, Handlung und Begründung."></textarea><details><summary>Selbstcheck: wichtige Antwortmerkmale</summary><ul>'+q.guide.map(x=>'<li>'+examEsc(x)+'</li>').join('')+'</ul><p class="muted">Vergleiche deine Begründungen mit diesen Merkmalen. Das ist keine amtliche Bewertung und ersetzt keinen Erwartungshorizont.</p></details><div class="flex">'+f.cases.map((x,i)=>'<button class="btn '+(i===examCaseIndex?'primary':'')+'" onclick="examCaseIndex='+i+';examRender()">Aufsichtsarbeit '+(i+1)+'</button>').join('')+'</div></div>';
 } else if(examMode==='praktisch'){
  html+='<div class="card"><span class="tag">Hinweis zur praktischen Prüfung</span><h3>Übe in deiner Ausbildungseinrichtung</h3><p>'+examEsc(f.guidance)+'</p></div>';
 } else {
  renderOral();
  return;
 }
 html+='<div class="panel"><h3>Offizielle Grundlagen</h3><ul><li><a href="https://www.gesetze-im-internet.de/pflaprv/__9.html" target="_blank" rel="noopener noreferrer">PflAPrV § 9 – staatliche Prüfung</a></li><li><a href="https://www.gesetze-im-internet.de/pflaprv/__13.html" target="_blank" rel="noopener noreferrer">§ 13 – Vornoten</a></li><li><a href="https://www.gesetze-im-internet.de/pflaprv/__14.html" target="_blank" rel="noopener noreferrer">§ 14 – schriftlicher Teil</a></li><li><a href="https://www.gesetze-im-internet.de/pflaprv/__15.html" target="_blank" rel="noopener noreferrer">§ 15 – mündlicher Teil</a></li><li><a href="https://www.gesetze-im-internet.de/pflaprv/__16.html" target="_blank" rel="noopener noreferrer">§ 16 – praktischer Teil</a></li><li><a href="https://dokumente.hamburg.de/resource/blob/1159706/7c997140ddc553b6ebae9cd99550a6e3/handreichung-schriftliche-abschlusspruefung-gemaess-pflbg-data.pdf" target="_blank" rel="noopener noreferrer">Hamburger Handreichung schriftliche Prüfung (Stand 04/2026)</a></li><li><a href="https://dokumente.hamburg.de/resource/blob/1159722/dd9679bbdc4e389fe7d05f78ff813317/handreichung-muendliche-abschlusspruefung-gemaess-pflbg-data.pdf" target="_blank" rel="noopener noreferrer">Hamburger Handreichung mündliche Prüfung (Stand 03/2026)</a></li><li><a href="https://dokumente.hamburg.de/resource/blob/1159720/dd6190d436e930f6cc8686e68d8ab99b/handreichung-praktische-abschlusspruefung-gemaess-pflbg-data.pdf" target="_blank" rel="noopener noreferrer">Hamburger Handreichung praktische Prüfung (Stand 03/2026)</a></li><li><a href="https://www.hamburg.de/politik-und-verwaltung/behoerden/sozialbehoerde/einrichtungen/lpa/pflegefachkraefte-31534" target="_blank" rel="noopener noreferrer">Hamburgisches Landesprüfungsamt – Prüfungsunterlagen</a></li></ul><p class="muted">Rechtsstand geprüft am 07.11.2026. Verbindlich bleiben die für deinen Prüfungsjahrgang mitgeteilten Vorgaben deiner Pflegeschule und des Landesprüfungsamts.</p></div></div>';
 c.innerHTML=html;
 const draftKey=examMode==='schriftlich'?'schriftlich-'+examCaseIndex:examMode;
 const answer=document.getElementById('examAnswer');
 if(answer){state.examDrafts??={};answer.value=state.examDrafts[draftKey]||'';answer.addEventListener('input',()=>{state.examDrafts[draftKey]=answer.value;save()})}
}
function examStartTimer(seconds){if(examTimer)clearInterval(examTimer);examTimer=null;examFormatSeconds=seconds;const clock=document.querySelector('#examClock');if(clock)clock.textContent=examFormatTime(examFormatSeconds);if(seconds<=0)return;examTimer=setInterval(()=>{examFormatSeconds=Math.max(0,examFormatSeconds-1);const node=document.querySelector('#examClock');if(node)node.textContent=examFormatTime(examFormatSeconds);if(examFormatSeconds===0){clearInterval(examTimer);examTimer=null}},1000)}
function examFormatTime(n){return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')}
const oralCases = {
 brandt: {
  title: 'Frau Brandt · ambulante Pflege · 87 Jahre',
  scenario: oral.story,
  tasks: oral.prompts.map(([, question]) => question),
  guide: oral.prompts.map(([, , answer]) => answer),
  followups: [
   'III · Welche Informationen gibst du nach den nächtlichen Stürzen an das Team und die Hausarztpraxis weiter?',
   'IV · Wie reagierst du auf den Wunsch nach einem Bettgitter? Welche Alternativen besprichst du mit Frau Brandt?',
   'V · Woran erkennst du nach einer Woche, ob die vereinbarten Maßnahmen ihr Sicherheit geben und ihre Mobilität erhalten?'
  ],
  followupGuide: 'Sturzhergang, aktuelle Beschwerden und Veränderungen strukturiert übergeben. Frau Brandts Willen und die konkreten Voraussetzungen einer freiheitsentziehenden Maßnahme prüfen. Gemeinsam Alternativen erproben und Stürze, Beinahe-Stürze, Mobilität und subjektive Sicherheit beurteilen.'
 },
 samira: {
  ...examFormats.muendlich,
  title: 'Samira · Kinder- und Jugendambulanz · 17 Jahre',
  followups: [
   'III · Wie verteilst du die Aufgaben, wenn Samira den nächsten Termin erneut absagt?',
   'IV · Wie antwortest du der Mutter, wenn sie dich ohne Samira nach den Befunden fragt?',
   'V · Welches Ergebnis würde Samira selbst als Verbesserung ansehen? Wie erfragst und überprüfst du es?'
  ],
  followupGuide: 'Eine klare Ansprechperson und einen vereinbarten Kontaktweg festlegen. Vor Weitergabe von Informationen die Voraussetzungen und Samiras Wünsche für die konkrete Situation prüfen. Mit Samira ein eigenes Ziel festlegen und bei einem vereinbarten Kontakt gemeinsam auswerten.'
 },
 sturz: {
  title: 'Herr Yilmaz · stationäre Akutpflege · 72 Jahre',
  scenario: 'Herr Yilmaz liegt seit drei Tagen auf einer internistischen Station. Vor der Aufnahme war er in seiner Wohnung selbstständig. Jetzt fühlt er sich beim Aufstehen zeitweise schwindelig. Nachts ist er auf dem Weg zur Toilette gestürzt. Er sagt, er habe die Klingel nicht erreichen können und wollte niemanden wecken. Er erinnert sich daran, beim Aufstehen kurz das Gleichgewicht verloren zu haben. Der Sturz wurde versorgt und dokumentiert. Beim Frühdienst berichtet er, dass er sich seitdem kaum noch aus dem Bett traut. Gleichzeitig möchte er bis zur Entlassung wieder selbstständig zur Toilette gehen. Seine Tochter bittet darum, ihn bis dahin nur im Bett zu versorgen. Herr Yilmaz widerspricht. Bei der Übergabe stellt sich heraus, dass der Nacht- und der Frühdienst unterschiedlich einschätzen, welche Unterstützung beim Aufstehen erforderlich ist. Die Physiotherapie hat einen Termin für heute Nachmittag angeboten. Die Pflegefachperson prüft, ob die Klingel und die geeignete Gehhilfe erreichbar sind. Noch unklar ist, wann der Schwindel auftritt und welche Unterstützung Herr Yilmaz beim Transfer akzeptiert. Die Ärztin bietet an, mögliche Ursachen und die Medikation zu prüfen. Bei einer Teambesprechung zeigt sich, dass auf der Station im letzten Monat mehr Stürze gemeldet wurden, obwohl die Risikoeinschätzungen häufiger dokumentiert wurden. Angaben zur Belegung, zu Mehrfachstürzen und zur tatsächlichen Umsetzung der Maßnahmen fehlen. Die Stationsleitung bittet dich, einen Vorschlag für die Versorgung von Herrn Yilmaz und die Auswertung der Stationsdaten zu machen. Herr Yilmaz ist bereit, zunächst mit einer Pflegefachperson zu üben und gemeinsam zu entscheiden, wann er weniger Unterstützung braucht.',
  tasks: [
   'III · Welche Angaben brauchst du für die erneute Risikoeinschätzung? Vereinbare ein überprüfbares Mobilitätsziel und erläutere die Aufgaben von Pflege, Physiotherapie und Ärztin.',
   'IV · Wie wägest du Selbstbestimmung und Schutz ab, wenn die Tochter Bettruhe fordert? Wie beteiligst du Herrn Yilmaz an der Entscheidung?',
   'V · Formuliere eine EBN-Frage und nutze die beiden Quellen. Welche Maßnahme passt zu Herrn Yilmaz und welche Unsicherheit bleibt?',
   'IV und V · Wähle ein Kriterium des DNQP-Standards und formuliere je einen Indikator für Struktur-, Prozess- und Ergebnisqualität. Wie prüfst du die Entwicklung?'
  ],
  guide: [
   'Sturzhergang, Schwindel, Transferfähigkeit, Hilfsmittel und Umgebung klären. Beispielziel: Herr Yilmaz bewältigt bis morgen den Toilettenweg mit der gemeinsam vereinbarten Unterstützung. Pflege vereinbart und überprüft den Plan, Physiotherapie beurteilt und trainiert die Mobilität, die Ärztin klärt mögliche Ursachen und prüft die Medikation. Absprachen im Schichtwechsel übergeben.',
   'Den Willen von Herrn Yilmaz und seine Einschätzung erfragen. Über Nutzen und Risiken verschiedener Unterstützungsstufen sprechen. Die Sorge der Tochter aufnehmen und sie mit seinem Einverständnis in das Gespräch einbeziehen. Hilfe schrittweise an seine Fähigkeiten und sein Sicherheitsgefühl anpassen.',
   'Beispielfrage: Senken individuell geplante Maßnahmen im Vergleich zur üblichen Versorgung die Sturzrate älterer Menschen im Krankenhaus? Die Übersicht bündelt Studien mit unterschiedlichen Maßnahmen. Ein sicherer Toilettenweg und begleitete Transfers lassen sich fallbezogen begründen. Die Entscheidung mit Herrn Yilmaz treffen und zeitnah anhand des vereinbarten Mobilitätsziels überprüfen.',
   'Zum Kriterium der individuellen Maßnahmenplanung: Struktur etwa der Anteil der Dienste mit Zugang zu geeigneten Gehhilfen; Prozess etwa der Anteil gefährdeter Personen mit gemeinsam vereinbartem, bei der Übergabe bekanntem Maßnahmenplan; Ergebnis etwa Stürze je 1.000 Belegungstage und erreichte Mobilitätsziele. Messzeitraum und Datenquelle festlegen und Ergebnisse im Team besprechen.'
  ],
  followups: [
   'III · Was sagst du in der Übergabe, wenn Herr Yilmaz beim zweiten Transfer wieder Schwindel meldet?',
   'IV · Wie besprichst du das Vorgehen, wenn Herr Yilmaz abends die vereinbarte Hilfe ablehnt?',
   'V · Die Sturzmeldungen nehmen zu. Welche Rolle könnten Belegung, Mehrfachstürze und Meldepraxis spielen?'
  ],
  followupGuide: 'Beobachtungen, Zeitpunkt und Unterstützungsbedarf übergeben und den Plan zeitnah überprüfen. Gründe für die Ablehnung erfragen und eine akzeptable Alternative aushandeln. Stürze auf Belegungstage beziehen und Meldepraxis, Sturzfolgen und wiederholte Stürze bei der Auswertung berücksichtigen.',
  sources: [
   ['DNQP · Expertenstandard Sturzprophylaxe, 2. Aktualisierung 2022', 'https://www.dnqp.de/fileadmin/HSOS/Homepages/DNQP/Dateien/Expertenstandards/Sturzprophylaxe_in_der_Pflege/Sturz_2Akt_Auszug.pdf', 'Der Standard sieht vor, individuelle Risiken einzuschätzen, Maßnahmen gemeinsam zu planen und Stürze systematisch zu erfassen. Sichere Mobilität bleibt ein Ziel.'],
   ['Cochrane · Sturzprävention bei älteren Menschen im Krankenhaus, 2026', 'https://www.cochrane.org/evidence/CD016065_how-effective-are-interventions-designed-reduce-falls-older-people-hospitals', 'Individuell auf Risikofaktoren abgestimmte Maßnahmen können die Sturzrate wahrscheinlich senken. Die Schätzung lässt auch keinen Effekt oder eine leichte Zunahme zu.']
  ]
 }
};
let oralCaseKey = 'brandt';

function openOralPractice() {
 examSetMode('muendlich');
 go('muendlich');
}

function selectOralCase(key) {
 if (!Object.hasOwn(oralCases, key)) return;
 examStartTimer(0);
 oralCaseKey = key;
 renderOral();
}

function renderOral() {
 const current = oralCases[oralCaseKey];
 const list = items => items.map(item => '<li>'+examEsc(item)+'</li>').join('');
 const sources = current.sources?.map(([label, url, summary]) =>
  '<li><a href="'+examEsc(url)+'" target="_blank" rel="noopener noreferrer">'+examEsc(label)+'</a><p>'+examEsc(summary)+'</p></li>'
 ).join('');
 document.querySelector('#content').innerHTML =
  '<button class="btn exam-back" onclick="go(\'pruefung\')">← Zurück zu Prüfung üben</button>'+
  '<section class="panel"><h2>Mündliche Prüfung üben</h2><p>'+examEsc(examFormats.muendlich.rule)+'</p>'+
  '<label for="oralCase">Übungsfall auswählen</label> <select id="oralCase">'+
  Object.entries(oralCases).map(([key, item]) => '<option value="'+key+'">'+examEsc(item.title)+'</option>').join('')+'</select>'+
  '<article class="card"><h3>'+examEsc(current.title)+'</h3><p>'+examEsc(current.scenario)+'</p>'+
  '<div class="flex"><button class="btn" onclick="examStartTimer(1800)">30 Minuten Vorbereitung starten</button>'+
  '<button class="btn" onclick="examStartTimer(0)">Timer stoppen</button><strong id="examClock">'+examFormatTime(examFormatSeconds)+'</strong></div>'+
  '<h3>Leitfragen</h3><ol>'+list(current.tasks)+'</ol>'+
  (sources ? '<h3>Material für die EBN-Aufgabe</h3><p>Die Aussagen sind in eigenen Worten zusammengefasst.</p><ul>'+sources+'</ul>' : '')+
  '<label for="oralNotes">Stichpunkte für deine mündliche Antwort</label><textarea id="oralNotes"></textarea>'+
  '<details><summary>Nachfragen für das Prüfungsgespräch</summary><ol>'+list(current.followups)+'</ol></details>'+
  '<details><summary>Erwartungshorizont öffnen</summary><ol>'+list(current.guide)+'</ol><p>'+examEsc(current.followupGuide)+'</p></details></article>'+
  '<p><a href="https://www.gesetze-im-internet.de/pflaprv/__15.html" target="_blank" rel="noopener noreferrer">§ 15 PflAPrV</a> · <a href="https://www.hamburg.de/resource/blob/1159722/dd9679bbdc4e389fe7d05f78ff813317/handreichung-muendliche-abschlusspruefung-gemaess-pflbg-data.pdf" target="_blank" rel="noopener noreferrer">Hamburger Handreichung</a></p></section>';
 const picker = document.getElementById('oralCase');
 picker.value = oralCaseKey;
 picker.addEventListener('change', () => {
  selectOralCase(picker.value);
  document.getElementById('oralCase').focus();
 });
 const notes = document.getElementById('oralNotes');
 const draftKey = 'muendlich-'+oralCaseKey;
 state.examDrafts ??= {};
 notes.value = state.examDrafts[draftKey] ?? (oralCaseKey === 'samira' ? state.examDrafts.muendlich : '') ?? '';
 notes.addEventListener('input', () => {
  state.examDrafts[draftKey] = notes.value;
  save();
 });
}

function examPracticeIntro() {
 return '<section class="panel exam-practice"><h2>Prüfung üben</h2><p>Wähle einen mündlichen Übungsfall oder trainiere mit einem Zufallsfall.</p><button class="btn primary" onclick="openOralPractice()">Mündliche Prüfung üben →</button></section>';
}

(function(){
 const baseGo=go;
 go=function(next){if(next!==tab && (tab==='pruefungsformat'||tab==='muendlich'))examStartTimer(0);baseGo(next)};
 const baseRender=render;
 render=function(){
  baseRender();
  if(tab==='pruefungsformat')examRender();
  else if(['themen','quiz','kompetenz','karten','faelle','falltraining','pruefung','wiederholen','muendlich'].includes(tab)){
   const c=document.querySelector('#content');
   if(c&&!c.querySelector('.legacy-content-note'))c.insertAdjacentHTML('afterbegin','<div class="learn-box tone-warning legacy-content-note"><strong>Hinweis zum Lernbestand:</strong> Die neu ergänzten Krankheits- und Pflegeprofile sowie ihre Quellen wurden am 07.11.2026 abgeglichen. Ältere Lernkarten, Themen, Fragen und Fälle sind noch nicht vollständig einzeln fachlich geprüft. Gleiche wichtige medizinische und rechtliche Aussagen mit aktuellen Fachquellen, lokalen Standards und den Vorgaben deines Prüfungsjahrgangs ab. Die Prüfungssimulationen sind selbst erstellte Übungsfälle und keine amtlichen Prüfungsaufgaben.</div>');
  }
 };
 render();
})();
