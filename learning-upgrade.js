/* PflegeFokus: persönlicher Lernweg, Wiederholung, Prüfung, Simulation und Praxis-Challenges. */
(function(){
 const $=s=>document.querySelector(s), esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const safeSave=()=>{try{if(typeof save==='function')save();else localStorage.setItem('pflegekompass-v1',JSON.stringify(state))}catch(e){}};
 const dateKey=()=>new Date().toISOString().slice(0,10);
 state.reviewItems??={};state.upgradeStats??={};state.simResults??={};state.challengeResults??={};

 // Acht zusätzliche Krankheits-Kurzprofile mit sichtbarem Quellen- und Prüfstand.
 // Leitlinienlücken und der begrenzte Umfang der Kurzprofile werden im jeweiligen Eintrag benannt.
 const extra=[
  ['Chronische Herzklappenerkrankung','Herz-Kreislauf','Veränderte Herzklappen können den Blutfluss behindern oder einen Rückstrom ermöglichen.','Ursachen sind unter anderem altersbedingte Veränderungen, angeborene Besonderheiten oder vorausgegangene Erkrankungen.','Belastungsdyspnoe, Müdigkeit, Ödeme, Herzgeräusche oder Herzrhythmusstörungen können auftreten.','Echokardiografie und weitere Untersuchungen beurteilt das Behandlungsteam.','Belastbarkeit, Atemnot, Kreislauf, Ödeme und verordnete Antikoagulation beobachten; Veränderungen zeitnah weitergeben.','Akute Brustschmerzen, Synkope oder schwere Atemnot sind Notfallzeichen.'],
  ['Pneumothorax','Lunge und Atemwege','Luft im Pleuraspalt kann die Entfaltung eines Lungenflügels beeinträchtigen.','Ein Pneumothorax kann spontan, nach einer Verletzung oder nach einem Eingriff entstehen.','Plötzlicher Brustschmerz und Atemnot können auftreten; bei stärkerem Pneumothorax kann sich ein Teil der Lunge nicht mehr normal ausdehnen.','Diagnostik und Behandlung erfolgen notfallmedizinisch; je nach Befund kann eine Drainage erforderlich sein.','Atmung, Hautfarbe, Bewusstsein und Sauerstoffsättigung nach Standard beobachten; Hilfe organisieren und Veränderungen melden.','Rasche Atemnot oder Kreislaufverschlechterung erfordern sofortige Notfallhilfe.'],
  ['Gastrointestinale Blutung','Magen-Darm-Erkrankungen','Eine Blutung im Verdauungstrakt kann zu relevantem Blutverlust und Kreislaufproblemen führen.','Mögliche Ursachen umfassen Geschwüre, Gefäßveränderungen oder Arzneimittelwirkungen.','Bluterbrechen, kaffeesatzartiges Erbrechen, Teerstuhl, Blässe, Schwäche oder Schwindel sind wichtige Hinweise.','Ursache und Dringlichkeit werden medizinisch abgeklärt; Kreislauf und Laborwerte werden im Kontext beurteilt.','Ausscheidungen und Erbrechen beobachten, Kreislaufzeichen erfassen, nichts eigenständig verabreichen und zügig eskalieren.','Bluterbrechen, Teerstuhl mit Schwäche oder Kreislaufinstabilität sind dringlich.'],
  ['Akute Cholezystitis','Magen-Darm-Erkrankungen','Eine Entzündung der Gallenblase verursacht häufig Schmerzen im rechten Oberbauch.','Oft liegt ein Gallenstein zugrunde; Verlauf und Behandlung sind individuell.','Oberbauchschmerz, Übelkeit, Fieber oder Druckschmerz können vorkommen.','Ärztliche Untersuchung, Labor und Bildgebung klären die Ursache; Therapie nach Befund.','Schmerz, Temperatur, Übelkeit, Flüssigkeitsaufnahme und Verlauf erfassen; Verschlechterung melden.','Fieber mit zunehmendem Schmerz, Gelbsucht oder Kreislaufveränderung zeitnah eskalieren.'],
  ['Anaphylaxie','Allergie und Notfallpflege','Eine Anaphylaxie ist eine schwere allergische Sofortreaktion, die Haut, Atemwege, Magen-Darm-Trakt oder Kreislauf betreffen und rasch lebensbedrohlich werden kann.','Auslöser können unter anderem Medikamente, Nahrungsmittel oder Insektenstiche sein; der Verlauf und die betroffenen Organsysteme unterscheiden sich.','Hautreaktion, Schwellung, Atemnot, Erbrechen oder Kreislaufprobleme können kombiniert auftreten.','Akute klinische Einschätzung und Notfallbehandlung nach lokalem Algorithmus sind entscheidend.','Notruf/Notfallteam aktivieren, betroffene Person nicht allein lassen, Atmung und Kreislauf beobachten und vorhandenen Notfallplan befolgen.','Atemwegs- oder Kreislaufzeichen: sofort Notfallmaßnahmen nach Qualifikation und Standard.'],
  ['Chronischer Schmerz','Schmerz und Symptomkontrolle','Chronischer Schmerz besteht typischerweise länger als drei Monate oder kehrt wieder. Er ist subjektiv und kann Alltag, Schlaf, Stimmung und Teilhabe beeinflussen.','Biologische, psychische und soziale Faktoren können zusammenwirken.','Schmerz ist subjektiv; Auswirkungen zeigen sich individuell.','Erfassung erfolgt strukturiert mit geeigneten Instrumenten und im Verlauf.','Selbstauskunft ernst nehmen, vereinbarte Ziele, Wirkung und Nebenwirkungen von Maßnahmen evaluieren; Selbstmanagement unterstützen.','Neue starke Schmerzen oder akute Warnzeichen müssen unabhängig von einer chronischen Diagnose abgeklärt werden.'],
  ['Dekubitus','Haut und Wundheilung','Anhaltender Druck und Scherkräfte können lokale Gewebeschädigungen verursachen.','Risiken entstehen unter anderem bei eingeschränkter Mobilität, Sensibilität oder Durchblutung.','Hautveränderungen und nicht wegdrückbare Rötungen müssen fachgerecht beurteilt werden.','Haut- und Risikoeinschätzung erfolgen individuell; Kategorie und Wundstatus sorgfältig dokumentieren.','Druckentlastung, Bewegungsförderung, Hautbeobachtung und individuelle Maßnahmen planen; keine kräftige Massage geröteter Stellen.','Nekrose, Infektionszeichen oder rasche Verschlechterung zeitnah fachlich beurteilen lassen.'],
  ['Schlafapnoe','Lunge und Atemwege','Schlafbezogene Atmungsstörungen umfassen verschiedene Formen. Bei einer obstruktiven Schlafapnoe verengen oder verschließen sich die oberen Atemwege im Schlaf wiederholt.','Obstruktive Schlafapnoe kann zu wiederholten Atemaussetzern und kurzen Aufweckreaktionen führen; andere Formen haben andere Ursachen.','Lautes Schnarchen, beobachtete Atempausen, nicht erholsamer Schlaf, Tagesmüdigkeit und Konzentrationsprobleme können vorkommen.','Diagnostik erfolgt schlafmedizinisch; Therapie und Hilfsmittel werden individuell festgelegt.','Schlaf und Tagesmüdigkeit erfragen; den Umgang mit ärztlich verordneten Hilfsmitteln unterstützen und Sicherheitsrisiken wie ausgeprägte Tagesschläfrigkeit ansprechen.','Ausgeprägte Tagesschläfrigkeit und akute Atemnot weiter abklären lassen.']
 ];
 window.pfDiseaseEntries=window.pfDiseaseEntries||[];
 if(typeof librarySources==='undefined')window.librarySources={};
 librarySources.unreviewed=['Quellenprüfung ausstehend · siehe REVIEW.md','./REVIEW.md'];
 const extraSourceKeys={'Chronische Herzklappenerkrankung':'valve','Pneumothorax':'pneumothorax','Gastrointestinale Blutung':'giBleed','Akute Cholezystitis':'cholecystitis','Anaphylaxie':'anaphylaxis','Chronischer Schmerz':'chronicPain','Dekubitus':'pressureUlcer','Schlafapnoe':'sleepApnea'};
 const extraSourceLinks={
  pneumothorax:[['AWMF-Leitlinienstatus · Fassung abgelaufen, Aktualisierung angemeldet','https://www.awmf.org/aktuelles/awmf-aktuell/diagnostik-und-therapie-von-spontanpneumothorax-und-postinterventionellem-pneumothorax']],
  cholecystitis:[['DGVS-Leitlinie Gallensteinleiden · Aktualisierung läuft','https://www.dgvs.de/leitlinien/leber-galle-pankreas/gallensteinleiden/']],
  anaphylaxis:[['AWMF: Registrierung der Aktualisierung','https://www.awmf.org/aktuelles/awmf-aktuell/akuttherapie-und-management-der-anaphylaxie-6']],
  sleepApnea:[['AWMF-S3-Leitlinie · Fassung abgelaufen','https://www.awmf.org/aktuelles/awmf-aktuell/nicht-erholsamer-schlaf/schlafstoerungen-schlafbezogene-atmungsstoerungen']]
 };
 const extraReviewNotes={
  valve:'Basisangaben am 10.11.2026 mit der ESC/EACTS-Leitlinie 2025 abgeglichen. Die konkrete Diagnostik, Schweregradeinteilung und Therapieentscheidung gehören in kardiologische Behandlung.',
  pneumothorax:'Basisangaben am 10.11.2026 mit gesund.bund.de abgeglichen. Die AWMF-S3-Fassung von 2018 ist seit 2023 abgelaufen; eine Aktualisierung ist angemeldet. Ein Therapiealgorithmus wird daher nicht dargestellt.',
  giBleed:'Basisangaben am 10.11.2026 mit der AWMF-S2k-Leitlinie Version 2.0 (2025, gültig bis 2030) abgeglichen. Der Geltungsbereich der Leitlinie sind Erwachsene mit gastrointestinaler Blutung.',
  ra2026:'Basisangaben am 10.11.2026 mit der AWMF-S3-Leitlinie zur medikamentösen Therapie der rheumatoiden Arthritis (Version 3.0, 2026) abgeglichen. Arzneimittelwahl und Überwachung erfolgen ärztlich-rheumatologisch.',
  cholecystitis:'Basisangaben am 10.11.2026 mit gesund.bund.de abgeglichen. Die DGVS-S3-Leitlinie zu Gallensteinleiden stammt von 2018 und wird aktualisiert; konkrete Therapieentscheidungen werden hier nicht vorgegeben.',
  anaphylaxis:'Basiswarnzeichen am 10.11.2026 mit gesund.bund.de abgeglichen. Die AWMF-Leitlinienfassung 2021 war bis Januar 2026 gültig; eine neue Fassung ist registriert, ihr Status ist gesondert zu prüfen. Im Notfall gelten Alarmplan und lokale Vorgaben.',
  chronicPain:'Basisangaben am 10.11.2026 mit der DEGAM-S1-Handlungsempfehlung 2025 abgeglichen. Chronischer Schmerz ist subjektiv und besteht typischerweise länger als drei Monate oder tritt wiederkehrend auf.',
  pressureUlcer:'Basisangaben am 10.11.2026 mit dem DNQP-Expertenstandard (2. Aktualisierung 2017) abgeglichen. Die 3. Aktualisierung läuft; die Veröffentlichung ist für Mitte 2027 geplant.',
  sleepApnea:'Basisangaben am 10.11.2026 mit gesund.bund.de abgeglichen. Schlafbezogene Atmungsstörungen umfassen verschiedene Formen; die AWMF-S3-Fassung von 2017 ist abgelaufen und wird nicht als aktuelle Behandlungsleitlinie dargestellt.'
 };
 const raEntry=window.pfDiseaseEntries.find(x=>x.title==='Rheumatoide Arthritis');
 if(raEntry){
  raEntry.sections??=[];
  raEntry.sections.push({title:'Quellen- und Prüfstand',items:[extraReviewNotes.ra2026,'Die verlinkte S3-Leitlinie von 2026 behandelt die medikamentöse Therapie; sie ersetzt keine individuelle rheumatologische Beurteilung.']});
  raEntry.reviewStatus='Basisangaben und Quelle am 10.11.2026 geprüft; siehe Quellen- und Prüfstand';
 }
 extra.forEach((d,i)=>{
  const sourceKey=extraSourceKeys[d[0]]||'unreviewed';
  const status=extraReviewNotes[sourceKey]||'Basisangaben geprüft; siehe Quellenstatus.';
  window.pfDiseaseEntries.push({
   title:d[0],category:'Krankheitsbilder',system:d[1],group:typeof organGroupFor==='function'?organGroupFor(d[1],d[0]):d[1],
   definition:d[2],facts:[d[3],d[4]],
   sections:[
    {title:'Entstehung',items:[d[3]]},
    {title:'Anzeichen und Diagnostik',items:[d[4],d[5]]},
    {title:'Pflegerischer Bezug',items:[d[6]]},
    {title:'Quellen- und Prüfstand',items:[status,'Dieses Kurzprofil vermittelt Basiswissen und ist keine individuelle Diagnose- oder Behandlungsanweisung. Maßgeblich sind aktuelle ärztliche Anordnungen, gültige Fachquellen und lokale Standards.']}
   ],
   care:[d[6]],warning:d[7],memory:d[7],
   task:'Welche Beobachtungen, Risiken und nächsten pflegerischen Schritte sind in dieser Situation wichtig?',
   case:'Welche Beobachtungen, Risiken und nächsten pflegerischen Schritte sind in dieser Situation wichtig?',
   source:sourceKey,additionalSources:extraSourceLinks[sourceKey]||[],reviewStatus:'Basisangaben und Quellenstatus am 10.11.2026 geprüft; Detailprüfung aktueller Therapieempfehlungen siehe Quellen- und Prüfstand',
   quiz:['Welche pflegerische Priorität passt bei '+d[0]+' am besten?',[d[6].split(';')[0],'Eine Maßnahme ohne Einschätzung oder Einwilligung durchführen','Warnzeichen ignorieren','Die verordnete Behandlung eigenständig ändern'],0,d[6]+' '+d[7]]
  });
 });

 Object.assign(librarySources,{
  valve:['ESC/EACTS 2025; DGK-Pocketleitlinie Herzklappenerkrankungen','https://herzmedizin.de/fuer-aerzte-und-fachpersonal/dgk/leitlinien/leitlinien-katalog/pocket-leitlinie-herzklappenerkrankungen-version-2025'],
  pneumothorax:['gesund.bund.de: Pneumothorax · AWMF-S3-Fassung 2018 abgelaufen, Aktualisierung angemeldet','https://gesund.bund.de/glossar/pneumothorax'],
  giBleed:['AWMF 021-028 S2k Gastrointestinale Blutung, Version 2.0 (2025)','https://register.awmf.org/assets/guidelines/021-028l_S2k_Gastrointestinale_Blutung_2025-12.pdf'],
  cholecystitis:['gesund.bund.de: Cholezystitis · DGVS-S3-Leitlinie 2018 wird aktualisiert','https://gesund.bund.de/glossar/cholezystitis'],
  anaphylaxis:['gesund.bund.de: Anaphylaxie als Notfall · AWMF-Fassung 2021 abgelaufen; Aktualisierung registriert','https://gesund.bund.de/nahrungsmittelallergie'],
  chronicPain:['DEGAM-S1-Handlungsempfehlung: Chronischer nicht tumorbedingter Schmerz (2025)','https://register.awmf.org/assets/guidelines/053-036k_S1_Chronischer_Schmerz_2025-02.pdf'],
  pressureUlcer:['DNQP Expertenstandard Dekubitusprophylaxe, 2. Aktualisierung 2017; 3. Aktualisierung läuft','https://www.dnqp.de/expertenstandards-und-auditinstrumente'],
  sleepApnea:['gesund.bund.de: Obstruktive Schlafapnoe · AWMF-S3-Fassung 2017 abgelaufen','https://gesund.bund.de/obstruktive-schlafapnoe-osa']
 });
 window.pfDiseaseSources??={};
 for(const [key,value] of Object.entries(librarySources)) if(extraSourceKeys&&Object.values(extraSourceKeys).includes(key)) window.pfDiseaseSources[key]=value;
 const oldCards=window.renderCards;
 window.renderCards=function(){if(typeof oldCards==='function')oldCards();addFlashcardRatings()};
 const oldRender=window.render;
 window.render=function(){
  if(typeof oldRender==='function')oldRender();
  const c=$('#content');if(!c)return;
  if(tab==='plan'){renderLearningPlan(c);return}
  if(tab==='lernweg')renderLearningPlan(c);if(tab==='start'&&hasLearningAccess())renderTodayOnHome(c)
  if(tab==='themenquiz')renderQuiz(c);
  if(tab==='wiederholen')renderReviewQueue(c);
  if(tab==='karten')addFlashcardRatings();
  if(tab==='wissensstand')renderDashboard(c);
  if(tab==='notfallsimulator')renderDecisions(c,'emergency');
  if(tab==='praxischallenges')renderDecisions(c,'practice');
 };

 function byArea(){
  const arr=window.pfDiseaseEntries||[];
  const map={};arr.forEach((x,i)=>{const k=x.group||x.system||'Weitere Themen';(map[k]??=[]).push({x,i})});
  return map
 }
 function dueCount(){return Object.values(state.reviewItems).filter(x=>x.due<=dateKey()).length}
 function renderTodayOnHome(c){const due=dueCount();const box=document.createElement('div');box.className='panel';box.innerHTML='<span class="tag">Dein Lernstand</span><h2>Heute weiterlernen</h2><p>'+ (due?due+' Wiederholungen sind fällig.':'Starte mit einer kurzen Lerneinheit aus deinen Themen.')+'</p><button class="btn primary" onclick="go(&quot;plan&quot;)">Zum persönlichen Lernweg</button>';c.appendChild(box)}
 function renderLearningPlan(c){
  const due=dueCount(),done=Object.keys(state.done||{}).filter(k=>state.done[k]).length,areas=byArea(),weak=Object.keys(state.reviewItems).filter(k=>state.reviewItems[k].rating!=='gewusst');
  const next=due?'<button class="btn primary" onclick="go(&#39;themenquiz&#39;)">Unsichere Fragen wiederholen ('+due+')</button>':
   '<button class="btn primary" onclick="go(&#39;themenquiz&#39;)">Mit einem kurzen Themenquiz starten</button>';
  c.innerHTML='<div class="panel"><span class="tag">Dein Lernweg · individuell aus deinem Lernstand</span><h2>Heute weiterlernen</h2><p>Dieser Lernweg richtet sich nach deinen eigenen Antworten und deinem Fortschritt. Er enthält keinen persönlichen Prüfungsmonat oder vorgegebenen Kalender.</p><div class="grid"><div class="card"><strong>'+due+'</strong><p>heute fällige Wiederholungen</p></div><div class="card"><strong>'+done+'</strong><p>als gelernt markierte Themen</p></div><div class="card"><strong>'+weak.length+'</strong><p>unsichere oder falsche Themen</p></div></div>'+next+'</div><div class="panel"><h3>Deine Themenstrecken</h3><p>Wähle ein Organsystem oder einen Pflegebereich. Eine Einheit besteht aus Wissen, einer Frage und einer kurzen Wiederholung.</p><div class="grid study-section-grid">'+Object.entries(areas).map(([k,v])=>'<article class="card study-section"><h3 class="section-title">'+studyMini(studyAreaIcon(k))+'<span>'+esc(k)+'</span></h3><p>'+v.length+' Lernprofile · '+v.filter(y=>state.reviewItems['disease-'+y.i]?.rating==='gewusst').length+' sicher markiert</p><div class="flex"><button class="btn primary" onclick="upgradeQuizArea(&#39;'+esc(k).replace(/'/g,'&#39;')+'&#39;)">Einheit beginnen</button><button class="btn" onclick="upgradeCacheModule(this)">Modul offline speichern</button></div><p class="offlineStatus muted" role="status"></p></article>').join('')+'</div></div><div class="panel"><h3>Dein nächster sinnvoller Schritt</h3><ol><li>Fällige Karten und Fragen beantworten.</li><li>Ein Krankheitsbild aus einem noch unsicheren Bereich bearbeiten.</li><li>Eine Prüfungs- oder Praxisübung auswählen und danach die Begründungen vergleichen.</li></ol></div>';
 }
 window.upgradeCacheModule=async function(button){
  const label=button.closest('article').querySelector('.offlineStatus');
  label.textContent='Offline-Verfügbarkeit wird geprüft …';
  try{
   const registration=await navigator.serviceWorker?.getRegistration();
   if(!registration?.active || !await caches.match('./learning-upgrade.js?v=12','./practice-decisions.js','./emergency-decisions.js','./advanced-training.js?v=2'))throw new Error('App-Cache noch nicht bereit');
   label.textContent='Die Lerneinheiten sind auf diesem Gerät offline verfügbar.';
  }catch{label.textContent='Offline-Lernen ist noch nicht bereit. Öffne PflegeFokus erneut mit Internetverbindung.';}
 };
 window.upgradeQuizArea=function(area){state.upgradeArea=area;state.upgradeLevel='basis';qrun=[];qpos=0;safeSave();go('themenquiz')};
 let qrun=[],qpos=0,qselected=null,qchecked=false;
 function baseQuizPool(){
  const ds=window.pfDiseaseEntries||[];
  let a=ds.map((d,i)=>{const z=d.quiz;return z?{id:'disease-'+i,area:d.group||d.system||'Krankheitsbilder',q:z[0],options:z[1],answer:z[2],explain:z[3],title:d.title}:null}).filter(Boolean);
  if(typeof questions!=='undefined')a=a.concat(questions.map((q,i)=>({id:'general-'+i,area:'Pflegewissen und Modelle',q:q[0],options:q[1],answer:q[2],explain:q[3]})));
  if(typeof competencyBank!=='undefined')a=a.concat(competencyBank.map(q=>({id:'competency-'+q.id,area:q.kb,q:q.q,options:q.options,answer:q.answer,explain:q.explain})));
  const lib=window.libraryEntries||[];
  a=a.concat(lib.filter(x=>x.quiz).map((x,i)=>({id:'lib-'+i,area:x.category||'Pflegewissen',q:x.quiz[0],options:x.quiz[1],answer:x.quiz[2],explain:x.quiz[3],title:x.title})));
  return a;
 }
 function sourceLink(source) {
  return source?`<p class="muted"><a href="${esc(source[1])}" target="_blank" rel="noopener noreferrer">${esc(source[0])}</a></p>`:'';
 }
 function quizPool(){return baseQuizPool().concat(window.advancedQuizQuestions)}
 function selectedQuizPool(){return state.upgradeLevel==='advanced'?window.advancedQuizQuestions:baseQuizPool()}
 function quizLevels(){return '<div class="flex quiz-levels" role="group" aria-label="Schwierigkeitsstufe">'+[['basis','Basiswissen'],['advanced','Prüfungstraining']].map(([id,label])=>'<button class="btn" aria-pressed="'+((state.upgradeLevel||'basis')===id)+'" onclick="upgradeQuizLevel(&quot;'+id+'&quot;)">'+label+'</button>').join('')+'</div>'}
 window.upgradeQuizLevel=level=>{state.upgradeLevel=level;state.upgradeArea='Alle';delete state.activeTopicQuiz;safeSave();qrun=[];qpos=0;renderQuiz($('#content'))};
 function rateQuestion(q,rating){
  const prev=state.reviewItems[q.id]||{interval:0,streak:0};
  const days=rating==='gewusst'?Math.min(30,Math.max(1,prev.interval?prev.interval*2:2)):rating==='unsicher'?1:0;
  state.reviewItems[q.id]={rating:rating,interval:days,streak:rating==='gewusst'?prev.streak+1:0,due:new Date(Date.now()+days*86400000).toISOString().slice(0,10),updated:dateKey()};
  const area=q.area||'Andere';state.upgradeStats[area]??={attempts:0,correct:0};state.upgradeStats[area].attempts++;if(rating==='gewusst')state.upgradeStats[area].correct++;
  safeSave();
 }
 function saveQuiz(){
  state.activeTopicQuiz=qpos<qrun.length?{ids:qrun.map(item=>item.id),position:qpos,selected:qselected,checked:qchecked}:null;
  safeSave();
  renderQuiz($('#content'));
 }
 function renderQuiz(c){
  const running=state.activeTopicQuiz;
  if(running){
   const byId=new Map(quizPool().map(item=>[item.id,item]));
   qrun=running.ids.map(id=>byId.get(id));
   if(qrun.every(Boolean)){qpos=running.position;qselected=running.selected;qchecked=running.checked}
   else {qrun=[];qpos=0;delete state.activeTopicQuiz}
  }else {qrun=[];qpos=0}
  const pool=selectedQuizPool(),areas=[...new Set(pool.map(x=>x.area))],filter=state.upgradeArea||'Alle',list=pool.filter(x=>filter==='Alle'||x.area===filter),due=list.filter(x=>state.reviewItems[x.id]&&state.reviewItems[x.id].due<=dateKey());
  if(!qrun.length||qpos>=qrun.length){
   c.innerHTML='<div class="panel"><span class="tag">Themenquiz · Krankheitsbilder und Lerninhalte</span><h2>Gezielt üben</h2>'+quizLevels()+'<p>'+(state.upgradeLevel==='advanced'?'Bearbeite Fallfragen mit ähnlichen Antwortoptionen und begründe deine Priorität.':'Wiederhole die Grundlagen und schätze nach jeder Antwort ein, wie sicher du bist.')+'</p><label for="upgradeArea">Themenbereich</label><select id="upgradeArea" onchange="state.upgradeArea=this.value;save();render()"><option>Alle</option>'+areas.map(x=>'<option '+(filter===x?'selected':'')+'>'+esc(x)+'</option>').join('')+'</select><div class="flex"><button class="btn primary" onclick="upgradeQuizStart(false)">Quiz starten ('+list.length+' Fragen)</button><button class="btn" onclick="upgradeQuizStart(true)" '+(due.length?'':'disabled')+'>Fällige Wiederholungen ('+due.length+')</button></div></div>';
   return;
  }
  const q=qrun[qpos],ans=qselected!==null&&qselected===q.answer;
  let feedback='';
  if(qchecked){
   feedback='<p class="'+(ans?'good':'bad')+'"><strong>'+(ans?'Richtig':'Noch nicht richtig')+'</strong> '+(q.feedback?'':esc(q.explain))+'</p>';
   if(q.feedback)feedback+='<details open><summary>Alle Antwortmöglichkeiten erklärt</summary><ol class="quiz-explanations">'+q.feedback.map((reason,i)=>'<li><strong>'+String.fromCharCode(65+i)+' · '+esc(q.options[i])+'</strong><p>'+esc(reason)+'</p></li>').join('')+'</ol>'+sourceLink(q.source)+'</details>';
   feedback+='<p>Wie sicher warst du?</p><div class="flex"><button class="btn" onclick="upgradeRate(0)">Nicht gewusst</button><button class="btn" onclick="upgradeRate(1)">Unsicher</button>';
   if(ans)feedback+='<button class="btn primary" onclick="upgradeRate(2)">Gewusst</button>';
   else feedback+='<p class="muted">Die falsche Antwort wird als Wiederholung vorgemerkt.</p>';
   feedback+='</div>';
  }else{
   feedback='<button class="btn primary" '+(qselected===null?'disabled':'')+' onclick="upgradeQuizCheck()">Antwort prüfen</button>';
  }
  c.innerHTML='<div class="panel"><span class="tag">'+esc(q.area)+' · '+(qpos+1)+' / '+qrun.length+'</span>'+quizLevels()+'<h2>'+esc(q.q)+'</h2>'+q.options.map((x,i)=>'<button class="option '+(qselected===i?'selected':'')+'" '+(qchecked?'disabled':'')+' onclick="upgradeQuizAnswer('+i+')">'+String.fromCharCode(65+i)+' · '+esc(x)+'</button>').join('')+feedback+'</div>';
 }
 window.upgradeQuizStart=function(onlyDue){const reviewing=tab==='wiederholen';const area=reviewing?'Alle':(state.upgradeArea||'Alle');qrun=(reviewing?quizPool():selectedQuizPool()).filter(q=>(area==='Alle'||q.area===area)&&(!onlyDue||(state.reviewItems[q.id]&&state.reviewItems[q.id].due<=dateKey()))).sort(()=>Math.random()-.5);qpos=0;qselected=null;qchecked=false;saveQuiz()};
 window.upgradeQuizAnswer=n=>{if(!qchecked){qselected=n;saveQuiz()}};
 window.upgradeQuizCheck=()=>{if(qselected!==null){qchecked=true;saveQuiz()}};
 window.upgradeRate=r=>{const rating=['nicht gewusst','unsicher','gewusst'][r]||r;rateQuestion(qrun[qpos],rating);qpos++;qselected=null;qchecked=false;saveQuiz()};

 function addFlashcardRatings(){if(typeof cards==='undefined')return;const c=$('#content');if(!c||document.getElementById('flashcardRating'))return;const row=document.createElement('div');row.id='flashcardRating';row.className='panel';const key='flashcard-'+ci,known=state.reviewItems[key];const disabled=flipped?'':'disabled';row.innerHTML='<span class="tag">Wiederholung</span><h3>Wie sicher konntest du diese Karte beantworten?</h3><p class="muted">Die Antwort erst aufdecken, dann deine Sicherheit einschätzen.</p><div class="flex"><button class="btn" '+disabled+' onclick="upgradeCardRate(0)">Nicht gewusst</button><button class="btn" '+disabled+' onclick="upgradeCardRate(1)">Unsicher</button><button class="btn primary" '+disabled+' onclick="upgradeCardRate(2)">Gewusst</button></div>'+(known?'<p class="muted">Nächste Wiederholung: '+esc(known.due)+'</p>':'');c.appendChild(row)}
 window.upgradeCardRate=r=>{const rating=['nicht gewusst','unsicher','gewusst'][r];rateQuestion({id:'flashcard-'+ci,area:'Lernkarten'},rating);if(typeof window.renderCards==='function')window.renderCards()};
 function renderReviewQueue(c){const quizDue=quizPool().filter(q=>state.reviewItems[q.id]&&state.reviewItems[q.id].due<=dateKey()),cardDue=typeof cards==='undefined'?[]:cards.map((x,i)=>({x,i})).filter(y=>state.reviewItems['flashcard-'+y.i]&&state.reviewItems['flashcard-'+y.i].due<=dateKey());c.innerHTML='<div class="panel"><span class="tag">Fällige Wiederholungen</span><h2>Wiederholen, was bald vergessen werden könnte</h2><p>Unsichere und falsche Fragen kommen früher wieder. Karteikarten werden nach deiner Selbsteinschätzung geplant.</p><p><strong>'+quizDue.length+'</strong> fällige Fragen · <strong>'+cardDue.length+'</strong> fällige Karten</p>'+ (quizDue.length?'<button class="btn primary" onclick="upgradeQuizStart(true)">Fällige Fragen starten</button>':'')+'</div>'+(cardDue.length?'<div class="panel"><h3>Fällige Lernkarten</h3>'+cardDue.map(y=>'<div class="card"><strong>'+esc(y.x[0])+'</strong><p><button class="btn" onclick="ci='+y.i+';flipped=false;go(\'karten\')">Karte öffnen</button></p></div>').join('')+'</div>':'')}

 function renderDashboard(c){
  const stats=state.upgradeStats||{},due=dueCount(),areas=Object.entries(stats),all=areas.reduce((a,[,s])=>({attempts:a.attempts+s.attempts,correct:a.correct+s.correct}),{attempts:0,correct:0});
  c.innerHTML='<div class="panel"><span class="tag">Wissensstand</span><h2>Was sitzt schon – was braucht Wiederholung?</h2><div class="grid study-section-grid"><div class="card study-section">'+studyMini('plan')+'<strong class="stat">'+all.attempts+'</strong><p>beantwortete Fragen</p></div><div class="card study-section">'+studyMini('chart')+'<strong class="stat">'+(all.attempts?Math.round(all.correct/all.attempts*100):0)+'%</strong><p>selbst als gewusst bewertet</p></div><div class="card study-section">'+studyMini('repeat')+'<strong class="stat">'+due+'</strong><p>heute fällige Wiederholungen</p></div></div><p>„Gewusst“ ist deine Selbsteinschätzung, kein offizielles Prüfungsergebnis. Unsichere Inhalte bleiben sichtbar und kommen zeitnah wieder.</p></div><div class="panel"><h3>Nach Themenbereich</h3>'+(areas.length?'<div class="grid study-section-grid">'+areas.map(([k,s])=>'<article class="card"><strong>'+esc(k)+'</strong><p>'+s.correct+' von '+s.attempts+' als gewusst markiert</p><div class="progress"><div style="width:'+(s.attempts?Math.round(s.correct/s.attempts*100):0)+'%"></div></div></article>').join('')+'</div>':'<p>Nach deinen ersten Quizantworten wird hier dein persönlicher Stand angezeigt.</p>')+'<button class="btn primary" onclick="go(&#39;themenquiz&#39;)">Jetzt gezielt üben</button></div>';
 }
 const decisionModes = {
  emergency: {
   entries:window.emergencyDecisions, stateKey:'activeEmergency', progress:'Entscheidung',
   title:'Entscheidungen mit Folgen üben', restart:'Szenario erneut üben',
   intro:'Wähle die Handlung, die in der aktuellen Lage Vorrang hat. Danach bekommst du Rückmeldung und siehst, wie sich der Fall weiterentwickelt. Für reale Notfälle gelten die örtlichen Alarmwege und Standards.'
  },
  practice: {
   entries:window.practiceDecisions, stateKey:'activePracticeChallenge', progress:'Schritt',
   title:'Fachgerecht handeln und den Grund verstehen', restart:'Challenge erneut üben',
   intro:'Bearbeite fünf Entscheidungen pro Thema. Oft sind mehrere Handlungen grundsätzlich sinnvoll. Wähle, welche jetzt zur Situation passt. Praktische Handgriffe übst du zusätzlich mit Anleitung in der Ausbildungseinrichtung.'
  }
 };

 function decisionRun(key) {
  const mode=decisionModes[key], saved=state[mode.stateKey];
  const priorIndex=saved?.caseIndex ?? saved?.index;
  const caseIndex=Number.isInteger(priorIndex) && mode.entries[priorIndex] ? priorIndex : 0;
  if(saved?.version===2 && saved.caseIndex===caseIndex && Array.isArray(saved.choices) && Number.isInteger(saved.step)
    && saved.step>=0 && saved.step<=mode.entries[caseIndex].steps.length) return saved;
  // Old answer indices refer to different questions. Keep the selected topic and start its new sequence.
  return {version:2,caseIndex,step:0,choices:[]};
 }

 function decisionPicker(key, selected) {
  const entries=decisionModes[key].entries;
  if(key==='emergency'){
   return `<label for="emergencyCase">Notfallübung auswählen</label><select id="emergencyCase" onchange="upgradeDecisionSelect('emergency',Number(this.value))">
     ${['Langzeitpflege','Krankenhaus'].map(setting=>`<optgroup label="${setting}">${entries.map((entry,index)=>
       entry.setting===setting?`<option value="${index}" ${index===selected?'selected':''}>${esc(entry.title)}</option>`:'').join('')}</optgroup>`).join('')}
     </select>`;
  }
  return `<div class="grid challenge-grid">${entries.map((entry,index)=>`<button type="button" class="card challenge-tile"
    aria-pressed="${index===selected}" onclick="upgradeDecisionSelect('practice',${index})">
    ${studyMini(entry.icon,'mini-large')}<span>${esc(entry.title)}</span><small>${entry.steps.length} Entscheidungen</small>
    </button>`).join('')}</div>`;
 }

 function decisionOutcome(entry, run, key, mode) {
  const correct=entry.steps.filter((question,index)=>run.choices[index]===question.a).length;
  return `<h3 id="decisionQuestion" tabindex="-1">Auswertung</h3>
    <p>${correct} von ${entry.steps.length} Entscheidungen passend priorisiert.</p>
    <ol class="decision-summary">${entry.steps.map((question,index)=>`<li>
      <strong>${esc(question.phase)}</strong>
      <p>${run.choices[index]===question.a?'Passend priorisiert.':'Deine Wahl: '+esc(question.opts[run.choices[index]] || 'Keine Antwort.')}</p>
      <p><strong>Priorität:</strong> ${esc(question.opts[question.a])}</p><p>${esc(question.why)}</p></li>`).join('')}</ol>
    <button type="button" class="btn primary" onclick="upgradeDecisionSelect('${key}',${run.caseIndex})">${mode.restart}</button>`;
 }

 function decisionStep(entry, run, key, mode) {
  const step=entry.steps[run.step], choice=run.choices[run.step];
  const checked=Number.isInteger(choice) && Boolean(step.opts[choice]), correct=choice===step.a;
  return `<div class="decision-stage">
    <span class="tag">${mode.progress} ${run.step+1} von ${entry.steps.length}</span>
    <span class="decision-phase">${esc(step.phase)}</span>
    <p class="decision-scene">${esc(step.scene)}</p>
    <h3 id="decisionQuestion" tabindex="-1">${esc(step.q)}</h3>
    <div class="decision-options">${step.opts.map((option,index)=>`<button type="button"
      class="option${checked&&index===choice?' selected':''}" ${checked?'disabled':''}
      onclick="upgradeDecisionChoose('${key}',${index})">${esc(option)}</button>`).join('')}</div>
    ${checked?`<div class="learn-box decision-feedback" id="decisionFeedback" tabindex="-1" role="status">
      <strong>${correct?'Passende Priorität gewählt':'Deine Wahl im Fall'}</strong><p>${esc(step.responses[choice])}</p>
      ${correct?'':`<p><strong>Priorität:</strong> ${esc(step.opts[step.a])}</p><p>${esc(step.why)}</p>`}
      <details><summary>Alle Optionen vergleichen</summary><ul>${step.opts.map((option,index)=>`<li>
        <strong>${esc(option)}</strong><p>${esc(step.responses[index])}</p></li>`).join('')}</ul></details>
      <button type="button" class="btn primary" onclick="upgradeDecisionNext('${key}')">
      ${run.step+1<entry.steps.length?(key==='practice'?'Nächster Schritt':'Nächste Entscheidung'):'Auswertung ansehen'}</button>
    </div>`:''}
    </div>`;
 }

 function renderDecisions(c,key){
  const mode=decisionModes[key], run=decisionRun(key), entry=mode.entries[run.caseIndex];
  const titleId=key==='practice'?'activeChallenge':'activeEmergency';
  c.innerHTML=`<div class="panel"><h2>${mode.title}</h2><p>${mode.intro}</p>${decisionPicker(key,run.caseIndex)}
    <article class="card challenge-active decision-active" id="${titleId}" aria-labelledby="decisionTitle">
    ${entry.setting?`<span class="tag">${esc(entry.setting)} · Fiktiver Fall</span>`:''}
    <h3 id="decisionTitle" class="section-title">${entry.setting?studyMini(studyAreaIcon(entry.title)):''}<span>${esc(entry.title)}</span></h3>
    ${entry.story?`<p>${esc(entry.story)}</p>`:''}
    ${run.step===entry.steps.length?decisionOutcome(entry,run,key,mode):decisionStep(entry,run,key,mode)}
    ${sourceLink(entry.source)}
    </article></div>`;
 }

 function saveDecisions(key,run,focus) {
  state[decisionModes[key].stateKey]=run;
  safeSave();
  renderDecisions($('#content'),key);
  const target=$(focus);
  target?.focus({preventScroll:true});
  target?.scrollIntoView({block:'start'});
 }

 window.upgradeDecisionSelect=(key,index)=>{
  if(!decisionModes[key]?.entries[index]) return;
  saveDecisions(key,{version:2,caseIndex:index,step:0,choices:[]},'#decisionQuestion');
 };
 window.upgradeDecisionChoose=(key,index)=>{
  const run=decisionRun(key), step=decisionModes[key].entries[run.caseIndex].steps[run.step];
  if(!step?.opts[index] || Number.isInteger(run.choices[run.step])) return;
  const choices=[...run.choices];
  choices[run.step]=index;
  saveDecisions(key,{...run,choices},'#decisionFeedback');
 };
 window.upgradeDecisionNext=key=>{
  const run=decisionRun(key), total=decisionModes[key].entries[run.caseIndex].steps.length;
  if(run.step>=total || !Number.isInteger(run.choices[run.step])) return;
  saveDecisions(key,{...run,step:run.step+1},'#decisionQuestion');
 };

 // Prüfungsformate: schriftlich ausführliche Fälle und Operatoren; mündlich komplexe Fälle.
 // Praktisches Training wird vom gemeinsamen Prüfungsmodul gerendert.
 const writtenCases=[
 {title:'Herr M. möchte wieder selbst zum Frühstück gehen',focus:'Schlaganfall, Kommunikation, Selbstbestimmung, Mobilität und Übergang nach Hause',story:'Herr M., 58 Jahre, lebt mit seiner Partnerin in einer Wohnung im dritten Stock ohne Aufzug. Vor sechs Wochen erlitt er einen ischämischen Schlaganfall. In der neurologischen Rehabilitation sind eine rechtsseitige Schwäche und eine expressive Aphasie zurückgeblieben. Er versteht nach eigener Aussage vieles, braucht aber Zeit, um Worte zu finden. Vor dem Ereignis arbeitete er als selbstständiger Tischler und übernahm den Großteil der Hausarbeit. Seine Partnerin arbeitet in Teilzeit und betreut zusätzlich ihre Mutter. Sie berichtet, seit dem Schlaganfall nachts häufig aufzuwachen, weil sie Angst hat, Herr M. könne aus dem Bett fallen.\n\nBeim Frühdienst sitzt Herr M. angezogen am Bettrand. Er hält sich mit der linken Hand fest und sagt stockend: „Alleine… Bad.“ Die Partnerin antwortet sofort: „Das geht nicht, er fällt gleich wieder hin.“ Herr M. wendet den Blick ab und schiebt den Rollator weg. Bei der Morgenpflege zieht er die Decke hoch und sagt: „Lassen Sie mich in Ruhe.“ In der Übergabe steht, dass er am Vortag mit Unterstützung einer Pflegefachperson bis zum Waschbecken gehen konnte. Eine physiotherapeutische Einschätzung beschreibt eine teilweise belastbare rechte Seite; zu Hause seien drei Stufen am Hauseingang zu überwinden. Derzeit ist nicht geklärt, wie Herr M. seine Einwilligung in einzelne Pflegeschritte am besten ausdrücken kann.\n\nBeim Frühstück verschluckt er sich einmal an dünnem Tee und hustet kurz. Er wirkt danach angespannt, nimmt aber einen Joghurt selbstständig zu sich. Eine strukturierte Schluckbeurteilung liegt nicht in der aktuellen Akte. Die Partnerin möchte, dass er pürierte Kost bekommt und nicht mehr allein aufsteht. Herr M. zeigt auf sein normales Brot und schüttelt den Kopf, als die Partnerin es wegstellt. Seine Vitalzeichen sind stabil; Schmerzen verneint er durch Kopfschütteln. Angaben zu seiner bevorzugten Kommunikationsform, Schluckdiagnostik, Hilfsmittelbedarf, häuslicher Unterstützung und seinem eigenen Rehabilitationsziel fehlen. Das interprofessionelle Team plant in drei Wochen eine Entlassung, falls die Versorgung zu Hause sicher organisiert werden kann. Herr M. soll an Entscheidungen beteiligt werden; seine Partnerin benötigt zugleich Raum, Belastungen und Unterstützungsbedarf anzusprechen.'},
 {title:'Leo möchte seine Genesung verstehen',focus:'Kind nach Operation, Schmerz, Mobilisation, Angehörigenberatung und altersgerechte Beteiligung',story:'Der neunjährige Leo liegt am ersten postoperativen Tag nach einer laparoskopischen Appendektomie auf einer Kinderstation. Die Operation verlief ohne berichtete Komplikation. Leo lebt mit seinen Eltern und einer älteren Schwester. Er geht gern Fußball spielen und möchte schnell nach Hause. Seine Mutter war während der Nacht bei ihm und wirkt müde. Sie sorgt sich, Bewegung könne die Wunde öffnen. Der Vater kann erst am Abend kommen und hat am Telefon nach der Entlassung gefragt.\n\nAm Vormittag möchte Leo zum Fenster gehen. Beim Aufrichten verzieht er das Gesicht und sagt, es ziehe am Bauch. Er möchte zunächst sitzen bleiben und selbst bestimmen, wann die nächste Pause kommt. Die Pflegefachperson sieht einen trockenen Verband; Leo ist fieberfrei und ansprechbar. Er hat seit dem Vorabend nur wenig getrunken und den größten Teil des Frühstücks stehen lassen. Im Dokumentationssystem wurde die letzte Schmerzbeurteilung vor mehreren Stunden erfasst. Die aktuelle Schmerzstärke, Übelkeit, Kreislaufreaktion und ärztliche Mobilisationsvorgaben müssen erhoben beziehungsweise geprüft werden.\n\nDie Mutter sagt: „Er muss im Bett bleiben, dann heilt es schneller.“ Leo schaut zur Mutter und sagt leise, dass er Angst vor Schmerzen hat und nicht weiß, wie er aufstehen soll. Er fragt, ob er etwas tun kann, um schneller nach Hause zu dürfen. Die Eltern wünschen verständliche Erklärungen ohne Fachwörter. Leo liest kurze Sätze selbst, versteht Bilder gut und möchte, dass man zuerst mit ihm spricht. Zu seinem Vorwissen, seinen Sorgen und den Regeln für Trinken, Essen und Mobilisation nach dem Eingriff liegen nur teilweise Informationen vor.\n\nDie Pflegefachperson möchte ein kurzes Beratungsangebot planen, Leo beteiligen und seine Mutter entlasten. Sie muss dabei die postoperative Situation, mögliche Warnzeichen, die ärztliche Anordnung und die individuelle Belastbarkeit beachten. Es soll nicht versprochen werden, dass eine bestimmte Handlung automatisch zur Entlassung führt. Die Wirkung der Beratung soll gemeinsam mit Leo überprüft werden: Versteht er die nächsten Schritte? Kann er sagen, wann er Hilfe oder eine Pause braucht? Wie verändern sich Schmerz, Kreislauf, Bewegung und Trinkmenge?'},
 {title:'Herr B. möchte nicht eingesperrt werden',focus:'Akute Zustandsveränderung, strukturierte Einschätzung, Eskalation und Entscheidungsabwägung',story:'Herr B., 79 Jahre, lebt seit vier Jahren in einer stationären Pflegeeinrichtung. Er hat eine chronische Herzinsuffizienz, eine eingeschränkte Nierenfunktion und eine leichte kognitive Beeinträchtigung. Gewöhnlich ist er morgens orientiert, spricht gern über seinen früheren Beruf als Busfahrer und geht mit Rollator zum Frühstück. In den letzten Tagen war er wegen eines Atemwegsinfekts weniger aktiv. Ein aktueller Medikamentenplan liegt vor; Änderungen der letzten Woche und die üblichen Vitalwerte sollen überprüft werden.\n\nWährend des Spätdienstes findet eine Pflegefachperson Herrn B. im Flur sitzend vor. Er ist blass, atmet schneller als üblich und sagt, ihm sei schwindelig. Er wirkt ungewohnt unruhig und kann nicht erklären, warum er den Raum verlassen wollte. Beim Aufstehen hält er sich am Tisch fest. Eine Pflegehilfskraft möchte den nächsten Rundgang abwarten, da Herr B. am Morgen noch unauffällig gewesen sei. Seine Tochter trifft ein und fordert, sofort ein Bettgitter anzubringen und ihn im Bett festzuhalten, damit er nicht stürzt. Herr B. sagt: „Ich will hier nicht eingesperrt werden.“\n\nEs liegen noch keine aktuellen Vitalwerte vor. Ob Brustschmerz, Fieber, Flüssigkeitsmangel, eine Medikamentenwirkung, eine Infektverschlechterung oder eine andere Ursache vorliegt, ist offen. Der letzte dokumentierte Trinkbecher war am frühen Nachmittag. Ein Sturz oder eine Verletzung wurde noch nicht festgestellt. Die Einrichtung hat einen internen Alarmierungsweg; ein ärztlicher Bereitschaftsdienst ist erreichbar. Die Pflegefachperson muss die akute Veränderung ernst nehmen, Herrn B. sichern und Unterstützung organisieren, ohne vorschnell eine Ursache festzulegen.\n\nDie Tochter ist besorgt und möchte helfen. Herr B. ist jedoch ansprechbar und äußert einen eigenen Willen. Es muss situationsbezogen geprüft werden, welche Informationen er versteht und welche Entscheidungen er selbst treffen kann. Das Team soll seine Sicherheit wahren, mildere geeignete Maßnahmen berücksichtigen und die Tochter respektvoll einbeziehen. Verlauf, Beobachtungen, Rückmeldungen, Anordnungen und die Wirkung der Maßnahmen sind nachvollziehbar zu dokumentieren.'}
 ];

 writtenCases[0].story+='\n\nIm Pflegebericht finden sich folgende ergänzende Angaben: Herr M. trägt eine Brille und hört auf dem linken Ohr schlechter. Bei längeren Gesprächen ermüdet er; am Nachmittag kann er sich meist besser ausdrücken als direkt nach dem Aufstehen. Er verwendet gelegentlich ein kleines Bild- und Buchstabenbrett, das er während der Rehabilitation selbst ausgewählt hat. Wenn mehrere Fragen schnell hintereinander gestellt werden, nickt er manchmal, obwohl später deutlich wird, dass er nicht alles verstanden hat. Seine Partnerin kennt seine übliche Gestik gut, übernimmt aber häufig aus Sorge das Gespräch.\n\nAm Vortag wurde beim begleiteten Transfer eine leichte Unsicherheit beim Drehen beobachtet. Der Rollator war erreichbar, jedoch stand der Bremshebel nicht vollständig festgestellt. Herr M. konnte mit Zeit und verbaler Anleitung einen Teil der Körperpflege selbst übernehmen. Die Pflegekraft dokumentierte, dass er bei einem vertrauten Ablauf weniger Unterstützung brauchte. Zum Essen liegen keine standardisierten Angaben zu Kostform, Schluckfähigkeit oder geeigneter Sitzposition vor. Die einmalige Hustenepisode ist bislang nicht fachlich abgeklärt.\n\nHerr M. hat im Gespräch mit der Ergotherapie gesagt, dass er wieder selbst am Frühstückstisch sitzen und seine Werkstatt zu Hause besuchen möchte. Die Partnerin möchte ihn unterstützen, fürchtet aber, die Versorgung allein nicht bewältigen zu können. Ein ambulanter Pflegedienst wurde noch nicht angefragt; der Hauseingang und das Treppenhaus wurden bisher nicht gemeinsam besichtigt. Angehörigenberatung und Hilfsmittelversorgung sind mögliche Themen für die Entlassungsplanung. Die Aussagen der Partnerin dürfen die eigene Sicht und Entscheidung von Herrn M. nicht ersetzen.';
 writtenCases[1].story+='\n\nDie postoperative Anordnung sieht eine frühe, am Zustand orientierte Mobilisation vor; die genaue Belastbarkeit und der Zeitpunkt weiterer Schritte müssen dennoch mit dem Behandlungsteam abgestimmt werden. Leo hat bislang keine kindgerechte Erklärung zum Schmerzmittelplan erhalten. Die Mutter kann sich an eine frühere Operation eines Familienmitglieds erinnern und verbindet Bewegung mit einer möglichen Wundöffnung. Sie fragt, ob Leo bis zur Entlassung dauerhaft überwacht werden muss. Der Vater hat wenig Erfahrung mit der Versorgung nach Operationen und möchte am Abend eine verständliche Zusammenfassung bekommen.\n\nBei der Übergabe wurde notiert, dass Leo in der Nacht wegen Bauchschmerzen einmal aufgewacht ist. Eine aktuelle standardisierte Schmerzeinschätzung, der Verlauf nach verordnetem Schmerzmittel und die Verträglichkeit der Nahrung fehlen. Die Pflegefachperson hat beobachtet, dass Leo bei einem kurzen Gespräch gern selbst Fragen stellt, wenn die Mutter nicht sofort antwortet. Seine Schwester hat ihm ein Bild vom Fußballplatz geschickt, das er am Bett aufgestellt hat. Diese Interessen können als Gesprächs- und Motivationsressource genutzt werden, ohne eine schnelle Entlassung zu versprechen.\n\nVor der Beratung müssen die gültigen ärztlichen Vorgaben, die Regeln zur Kost- und Flüssigkeitsaufnahme sowie der aktuelle klinische Zustand geprüft werden. Für die Einschätzung sind außerdem Leos individuelle Schmerzaussage, seine Angst, die Kreislaufreaktion beim Aufrichten und mögliche Veränderungen am Bauch relevant. Die Familie benötigt einen Plan, an wen sie sich bei Warnzeichen wenden kann. Die Pflegefachperson soll Informationen in einfacher Sprache vermitteln und Verständnis prüfen, statt nur einen Merkzettel auszuhändigen.';
 writtenCases[2].story+='\n\nBei Herrn B. wurde vor einer Woche ein neues entwässerndes Medikament angesetzt. Ob Dosis und Einnahmezeiten seither korrekt umgesetzt wurden, ist aus der Übergabe nicht ersichtlich. Ein aktueller Medikamentenabgleich ist erforderlich; eigenständige Änderungen durch die Pflege sind ausgeschlossen. Die Tochter berichtet, ihr Vater habe am Vortag weniger getrunken und nachts mehrfach die Toilette gesucht. Diese Angaben sind wichtige Hinweise, klären die Ursache der aktuellen Veränderung aber nicht.\n\nIm Wohnbereich befinden sich ein Rollator, eine Rufanlage und ein gut beleuchteter Gemeinschaftsraum. Herr B. kann die Rufanlage gewöhnlich bedienen, legt sie beim Gehen aber manchmal auf den Tisch. Er trägt eine Brille und benötigt beim Hören eine ruhige Umgebung. In früheren Gesprächen äußerte er, dass er bei Schwindel lieber begleitet wird. Ob er diese Präferenz aktuell bestätigen kann und welche Unterstützung er jetzt annimmt, ist direkt bei ihm zu erfragen. Ein Bettgitter würde seine Sturzgefahr nicht automatisch beseitigen und könnte zusätzliche Risiken schaffen.\n\nFür die ärztliche Rückmeldung müssen Verlauf, mögliche Infektzeichen, Atmung, Kreislauf, Flüssigkeit, Ausscheidung, Schmerzen und Medikamentenänderungen zusammengetragen werden. Das Team muss zudem klären, wer bei Herrn B. rechtlich vertretungsberechtigt ist, falls er eine konkrete Entscheidung nicht selbst treffen kann; die bloße Anwesenheit der Tochter begründet keine pauschale Entscheidungsbefugnis. Bis zur Klärung sind sein Wille, seine Sicherheit und die mildeste geeignete Unterstützung zu beachten.';
 const oralGuides=[
  [
   'Samira hat drei Kontrolltermine versäumt, fühlt sich durch Schule und Familie überfordert und möchte Gespräche selbst führen. Zu ihren aktuellen Werten, ihrem Diabetesalltag, Entscheidungsverständnis und den Gründen für die Absagen fehlen Informationen. Nichts davon darf ergänzt oder vermutet werden.',
   'Samira zuerst selbst und möglichst vertraulich ansprechen. Pflege erhebt Alltag, Belastung und Unterstützungswünsche; der ärztliche Dienst klärt medizinische Fragen und plant notwendige Kontrollen. Schulsozialarbeit nur mit Samiras Einverständnis einbeziehen.',
   'Die Weitergabe an die Mutter nicht pauschal zusagen. Samiras Einwilligungsfähigkeit für die konkrete Frage und den Umfang einer möglichen Informationsfreigabe situationsbezogen prüfen und dokumentieren. Selbstbestimmung, Schutz und Kindeswohl verständlich abwägen.',
   'Aktuelle fachliche Empfehlungen zu Typ-1-Diabetes, Hypoglykämie und Übergang in die Erwachsenenversorgung heranziehen. Geltungsbereich und Aktualität prüfen; lokale Standards sowie Samiras Alltag und Präferenzen berücksichtigen.',
   'Mit Samira einen erreichbaren Kontrolltermin und Kontaktweg vereinbaren. Evaluation etwa über wahrgenommene Termine, Samiras Verständnis, selbst eingeschätzte Belastung und ihre Erfahrung mit der vereinbarten Unterstützung.',
   'Wertfrei nach Gründen für versäumte Termine fragen, statt fehlende Motivation zu unterstellen. Unterschiedliche Teampositionen sachlich besprechen und die eigene Haltung zu elterlicher Beteiligung und jugendlicher Selbstbestimmung reflektieren.'
  ],
  [
   'Frau R. berichtet nächtliche Atemnot und Schwindel nach Medikamenteneinnahme; sie lässt Präparate aus und wünscht ein Gespräch ohne ihren Sohn. Akute Verschlechterung, Vitalwerte, Medikation, zeitlicher Verlauf und ihre konkreten Unterstützungsziele sind noch zu klären.',
   'Pflege erfasst Symptome, Alltag, Einnahme und Wünsche; der ärztliche Dienst beurteilt mögliche Verschlechterung und prüft die Medikation. Weitere Berufsgruppen werden nach Befund und Wunsch von Frau R. beteiligt. Den Sohn nur mit ihrem Einverständnis und vereinbartem Informationsumfang einbeziehen.',
   'Frau R. direkt und verständlich beteiligen. Eine kognitive Beeinträchtigung allein hebt ihre Selbstbestimmung nicht auf; Entscheidungsfähigkeit ist für die konkrete Frage und Situation einzuschätzen. Vertraulichkeit, Einwilligung, Schutz und mögliche Vertretungsbefugnis prüfen.',
   'Aktuelle Empfehlungen zu Herzinsuffizienz, chronischer Nierenerkrankung und Medikationssicherheit nutzen; Aktualität und Anwendbarkeit prüfen. Beschwerden nicht selbst diagnostizieren und Medikamente nicht eigenständig absetzen oder ändern.',
   'Ziele mit Frau R. festlegen, etwa eine zeitnahe Klärung der Beschwerden und eine für sie akzeptable Unterstützung. Atmung, Schwindel, Kreislauf, Einnahme, Alltag und subjektives Sicherheitsgefühl dokumentieren und erneut beurteilen.',
   'Den Sohn ruhig über den Gesprächswunsch und Vertraulichkeit informieren, ohne Frau R.s Anliegen zu übergehen. Konflikte sachlich moderieren und die eigene Haltung zu Risiko, Autonomie und Angehörigenbeteiligung kritisch prüfen.'
  ]
 ];

 const operators=[
  ['Nennen','kurze Aufzählung ohne ausführliche Begründung'],
  ['Benennen','Fachbegriffe oder Sachverhalte präzise angeben'],
  ['Beschreiben','Merkmale oder Ablauf geordnet und mit Fallbezug darstellen'],
  ['Erklären','Zusammenhänge verständlich machen'],
  ['Erläutern','Sachverhalt erklären und mit Beispielen oder Fallbezug verdeutlichen'],
  ['Begründen','Entscheidung mit fachlichen Argumenten und Fallinformationen stützen'],
  ['Analysieren','Informationen ordnen, Zusammenhänge und Probleme herausarbeiten'],
  ['Beurteilen','Kriterien anwenden, abwägen und zu einem begründeten Urteil kommen'],
  ['Planen','Ziele, Schritte, Zuständigkeit und Überprüfung festlegen'],
  ['Vergleichen','Gemeinsamkeiten und Unterschiede anhand von Kriterien darstellen'],
  ['Reflektieren','eigenes Handeln prüfen und Schlussfolgerungen ableiten']
 ];
 const writtenTasks=[
  [['Analysieren','Analysiere die Fallsituation und trenne gesicherte Beobachtungen, mögliche Probleme und noch fehlende Informationen.'],['Nennen','Nenne vier Ressourcen der betroffenen Person.'],['Benennen','Benenne drei vorrangige Pflegeprobleme oder Risiken und ordne sie nach Dringlichkeit.'],['Beschreiben','Beschreibe, welche zusätzlichen Einschätzungen du vor der Pflege benötigst.'],['Erklären','Erkläre den Zusammenhang zwischen den beobachteten Hinweisen und einem möglichen pflegerischen Risiko.'],['Formulieren','Formuliere zwei individuelle, überprüfbare Pflegeziele mit Zeitbezug.'],['Planen','Plane zu jedem Ziel mindestens drei konkrete Maßnahmen mit Zuständigkeit und Zeitpunkt.'],['Begründen','Begründe deine Prioritätensetzung mit Informationen aus dem Fall.'],['Erläutern','Erläutere, wie du Selbstbestimmung und Sicherheit in der Situation verbindest.'],['Beschreiben','Beschreibe eine passende Kommunikation mit der betroffenen Person und einer Bezugsperson.'],['Nennen','Nenne geeignete Beobachtungskriterien für die Evaluation.'],['Erklären','Erkläre, welche Informationen in eine strukturierte Übergabe gehören.'],['Beurteilen','Beurteile, welche Risiken eine unreflektierte Standardmaßnahme in diesem Fall hätte.'],['Planen','Plane eine interprofessionelle Zusammenarbeit und benenne die jeweiligen Beiträge.'],['Erläutern','Erläutere einen passenden pflegewissenschaftlichen Ansatz oder Standard und seine Grenzen.'],['Vergleichen','Vergleiche zwei mögliche Handlungswege anhand von Nutzen, Risiken und Willen der Person.'],['Reflektieren','Reflektiere, wie du auf Ablehnung, Unsicherheit oder eine veränderte Situation reagieren würdest.'],['Dokumentieren','Beschreibe, was, wann und wie du dokumentierst und weitergibst.']],
  [['Analysieren','Analysiere die Fallsituation nach gesundheitlichen Bedürfnissen, Ressourcen und Informationslücken.'],['Nennen','Nenne vier Informationen, die du vor der Beratung erheben oder prüfen musst.'],['Benennen','Benenne zwei Risiken, die in der Situation besonders beachtet werden müssen.'],['Beschreiben','Beschreibe den aktuellen Beratungsbedarf der betroffenen Person und ihrer Bezugsperson.'],['Erklären','Erkläre, wie du die betroffene Person alters- und situationsgerecht beteiligst.'],['Formulieren','Formuliere zwei erreichbare Beratungsziele, die überprüfbar sind.'],['Planen','Plane ein strukturiertes, verständliches Beratungsangebot in nachvollziehbaren Schritten.'],['Begründen','Begründe, welche Aussagen du sicher treffen kannst und welche du erst abklären musst.'],['Erläutern','Erläutere, wie du Ängste und unterschiedliche Sichtweisen aufgreifst.'],['Nennen','Nenne geeignete Methoden, um das Verständnis zu überprüfen.'],['Beschreiben','Beschreibe die Beobachtungen, mit denen du Wirkung und Belastbarkeit evaluierst.'],['Erklären','Erkläre, welche Warnzeichen eine erneute fachliche Beurteilung erfordern.'],['Beurteilen','Beurteile eine Empfehlung, die nicht zur individuellen Situation oder Anordnung passt.'],['Planen','Plane die Zusammenarbeit mit Bezugsperson und beteiligten Berufsgruppen.'],['Erläutern','Erläutere, wie Prävention und Gesundheitsförderung in die Beratung einfließen.'],['Vergleichen','Vergleiche eine pauschale Empfehlung mit einer individuell abgestimmten Vorgehensweise.'],['Reflektieren','Reflektiere, wie du verständliche Sprache und gemeinsame Entscheidungen sicherstellst.'],['Dokumentieren','Beschreibe, welche Beratungsinhalte, Vereinbarungen und Evaluationsergebnisse dokumentiert werden.']],
  [['Analysieren','Analysiere die akute Lage und unterscheide Beobachtung, Vermutung und gesicherte Information.'],['Nennen','Nenne die ersten fünf Schritte, die du jetzt einleitest.'],['Benennen','Benenne akute Warnzeichen und fehlende Informationen.'],['Beschreiben','Beschreibe eine systematische Ersteinschätzung und die erneute Beurteilung.'],['Erklären','Erkläre, warum eine akute Veränderung nicht bis zum nächsten Rundgang warten sollte.'],['Planen','Plane die unmittelbare Sicherheit und Alarmierung entsprechend der Dringlichkeit.'],['Begründen','Begründe, welche Informationen du an den ärztlichen Dienst weitergibst.'],['Erläutern','Erläutere eine strukturierte Übergabe, zum Beispiel mit SBAR.'],['Beurteilen','Beurteile den Wunsch der Tochter nach einem Bettgitter unter Berücksichtigung des Willens von Herrn B.'],['Nennen','Nenne mildere geeignete Möglichkeiten, die geprüft werden können.'],['Erklären','Erkläre, welche rechtlichen und ethischen Fragen du situationsbezogen klärst.'],['Beschreiben','Beschreibe, wie du Herrn B. respektvoll einbeziehst und seine Entscheidungsfähigkeit nicht pauschal infrage stellst.'],['Planen','Plane die Zusammenarbeit im Team und teile Aufgaben sinnvoll zu.'],['Erläutern','Erläutere, welche Beobachtungen du bis zum Eintreffen weiterer Hilfe fortsetzt.'],['Dokumentieren','Beschreibe die notwendige Dokumentation mit Zeitpunkten und Reaktionen.'],['Beurteilen','Beurteile, wie sich eine Veränderung der Vitalwerte auf deine Dringlichkeit auswirkt.'],['Reflektieren','Reflektiere den Umgang mit dem Konflikt zwischen Angehörigenwunsch, Sicherheit und Autonomie.'],['Evaluieren','Beschreibe, woran du erkennst, ob die eingeleiteten Schritte wirksam und weiterhin passend sind.']]
 ];

 const writtenAnswers=[
 [
  'Die stockende Sprache, das Abwenden, das Wegschieben des Rollators, Husten beim Trinken und die Aussage „Lassen Sie mich in Ruhe“ sind Beobachtungen. Aphasie, Sturzgefährdung und Dysphagie sind zu prüfende Pflegeprobleme beziehungsweise Risiken, keine allein aus diesen Angaben gesicherten Diagnosen.',
  'Ressourcen: Herr M. versteht vieles, äußert Wünsche, zeigt ein eigenes Rehabilitationsziel, kann Joghurt selbst essen und ging am Vortag mit Unterstützung zum Waschbecken. Partnerin und interprofessionelles Team sind mögliche Unterstützungsressourcen.',
  'Mögliche Prioritäten: sichere Kommunikation und Einwilligung; Schluck-/Aspirationsrisiko nach Husten; Mobilität/Sturzrisiko; Selbstpflege und Belastung der Partnerin. Reihenfolge mit aktuellem Zustand begründen.',
  'Kommunikationsform und Ja/Nein-Signale, Schluckscreening/-beurteilung, Mobilität und Transfers, Schmerz, Hilfsmittel, Treppen/Hauszugang, häusliches Netzwerk, Wille zur Einbeziehung der Partnerin und Entlassungswünsche erheben.',
  'Aphasie kann die Äußerung erschweren, bedeutet aber nicht automatisch fehlendes Verständnis oder fehlende Entscheidungsfähigkeit. Husten beim Trinken ist ein Hinweis, der eine fachliche Schluckabklärung begründet.',
  'Beispiel: Herr M. beteiligt sich innerhalb von drei Tagen mit vereinbartem Kommunikationsmittel an der Morgenpflege. Zweites Ziel: Essen/Trinken erfolgt bis zur Schluckbeurteilung nach dem festgelegten sicheren Plan ohne unbeachtete Husten-/Aspirationszeichen.',
  'Zeit geben, kurze Fragen und Kommunikationshilfen nutzen; Einwilligung vor Pflegeschritten einholen; Transfers nach aktueller Einschätzung und Hilfsmittelplan begleiten; Husten dokumentieren und Schluckabklärung veranlassen; Partnerin nur mit Zustimmung einbeziehen.',
  'Schlucken und akute Sicherheit zuerst beurteilen; danach Mobilität, Selbstpflege und Entlassungsplanung priorisieren. Begründung an aktuellen Beobachtungen und möglichem Schaden ausrichten.',
  'Herrn M. direkt ansprechen, Entscheidungsspielraum anbieten, Risiken verständlich erklären und sichere Alternativen vereinbaren. Nicht automatisch immobilisieren oder alles übernehmen.',
  'An Herrn M. richten, kurze Sätze, ausreichend Antwortzeit, Gestik/Kommunikationshilfe, Verständnis rückversichern; Partnerin ergänzend und mit Einwilligung befragen.',
  'Verständigung gelingt; Husten/Essensaufnahme; sichere Transfers; Umfang selbst übernommener Pflege; Stürze/Beinahe-Stürze; subjektive Sicherheit und Entlastungsbedarf.',
  'Situation, Einschätzung, relevante Werte/Beobachtungen, Schluckhinweis, durchgeführte Maßnahmen, Reaktion, offene Abklärungen und vereinbarte nächste Schritte strukturiert weitergeben.',
  'Pürierte Kost oder vollständige Mobilitätsvermeidung ohne Abklärung kann Selbstbestimmung und Ernährung/Bewegung beeinträchtigen und löst die Ursache nicht.',
  'Pflegefachperson koordiniert; Logopädie/Schluckteam beurteilt Schlucken; Physio/Ergo unterstützen Mobilität und Alltagsaktivitäten; Sozialdienst prüft häusliche Hilfen; ärztlicher Dienst klärt Diagnostik und Therapie.',
  'Personenzentrierte Kommunikation und Expertenstandards können Orientierung geben; individuelle Einschätzung und lokale Vorgaben bleiben entscheidend.',
  'Selbstständiges Aufstehen versus angeleitete Begleitung: Autonomie ermöglichen, dabei Sturzrisiko, Fähigkeiten, Wünsche und erreichbare Hilfen abwägen.',
  'Bei Ablehnung innehalten, Grund erfragen, Zeitpunkt/Angebot anpassen und Einwilligung erneut klären. Veränderung von Schlucken, Kraft oder Bewusstsein erfordert Neubewertung.',
  'Zeitnah und sachlich: Beobachtung, Einschätzung, Entscheidung, Einwilligung/Ablehnung, Maßnahme, Wirkung und Weitergabe dokumentieren.'
 ],
 [
  'Postoperative Situation, trockener Verband und Fieberfreiheit sind bekannt. Schmerz beim Aufrichten, geringe Trink-/Essmenge und Angst sind Beobachtungen; Kreislauf, Schmerzstärke, Übelkeit, Vorgaben und Verlauf fehlen.',
  'Aktuelle Schmerzstärke und Wirkung verordneter Analgesie, Kreislauf, Übelkeit, Trinkmenge, Wund-/Bauchbefund, Mobilisationsvorgaben, Vorwissen und individuelle Warnzeichen erheben.',
  'Schmerz/Belastung bei Mobilisation sowie geringe Flüssigkeitsaufnahme und mögliche postoperative Verschlechterung beachten; konkrete Risiken anhand von Assessment und Vorgaben prüfen.',
  'Leo möchte mobilisieren und selbst Pausen bestimmen; er kann Wünsche benennen, versteht kurze Sätze und Bilder. Mutter ist anwesend und sucht Sicherheit, wirkt aber erschöpft.',
  'Leo direkt, altersgerecht und in kurzen verständlichen Sätzen ansprechen; erklären, dass Bewegung nach Vorgabe schrittweise erfolgen kann und nicht automatisch die Wunde öffnet. Keine Entlassung versprechen.',
  'Beispiel: Leo kann nach dem Gespräch zwei vereinbarte Schritte und Warnzeichen wiedergeben. Er beteiligt sich im Verlauf des Tages an einer abgesprochenen Mobilisation mit Pausen nach seinem Signal.',
  'Schmerz und Vorgaben prüfen; gemeinsam kleinen nächsten Schritt festlegen; passende Analgesie nur nach Anordnung/Plan; Mobilisation begleiten; Trinkangebot nach Vorgaben; Wirkung erneut erfassen.',
  'Nur sichere Aussagen treffen: Verband trocken und fieberfrei beobachtet; weitere Ernährung, Mobilität und Entlassung mit Anordnung und Zustand abstimmen. Keine eigenständige Therapieanpassung.',
  'Angst validieren, Fragen zulassen, Mutter zuhören und Fehlinformationen behutsam klären; Leo Entscheidung über Pausen ermöglichen.',
  'Teach-back: Leo erklärt in eigenen Worten, wie er Hilfe holt und wann er pausiert; Bildkarten/Schrittfolge nutzen; Mutter kann eigene Fragen stellen.',
  'Schmerz vor/nach Aktivität, Kreislauf, Übelkeit, Wund-/Bauchbeobachtung, Mobilitätsumfang, Trinkmenge, Angst und Verständnis dokumentieren.',
  'Zunehmender Schmerz, Fieber, Erbrechen, Kreislaufveränderung oder auffälliger Wundbefund zeitnah fachlich beurteilen und weitergeben.',
  'Bettlägerigkeit ohne Indikation kann Mobilität und Selbstvertrauen beeinträchtigen; forcierte Mobilisation trotz Schmerz/Instabilität wäre ebenfalls unangemessen.',
  'Pflege koordiniert Beratung/Beobachtung; ärztlicher Dienst klärt Vorgaben und Warnzeichen; Eltern werden passend zu Leos Alter und Wunsch beteiligt; ggf. Physio/Schmerzteam nach Bedarf.',
  'Prävention, Gesundheitskompetenz und altersgerechte Beteiligung unterstützen Selbstwirksamkeit; Beratung muss Vorwissen, Sprache und Situation berücksichtigen.',
  'Pauschales „liegen bleiben“ versus schrittweises Mobilisieren: Vorgaben, Schmerz, Kreislauf, Wundzustand und Leos Bereitschaft abwägen.',
  'Beratung kurz, wertschätzend und ohne Schuldzuweisung; Verständnis überprüfen, Mutter entlasten und Leo echte Wahlmöglichkeiten geben.',
  'Beratungsbedarf, geprüfte Anordnungen, vermittelte Informationen, Leos Verständnis, Vereinbarungen, Beobachtungen und Verlauf festhalten.'
 ],
 [
  'Gesichert sind blass, schneller atmend, schwindelig, ungewohnt unruhig und eine akute Abweichung vom üblichen Verhalten. Ursache ist offen; keine Diagnose aus Vermutung ableiten.',
  'Bei ihm bleiben, unmittelbare Hilfe nach Alarmweg organisieren, Vitalwerte und ABCDE-orientierte Einschätzung durchführen, Sturz vermeiden, ärztlichen Dienst verständigen.',
  'Atemnot/Tachypnoe, Blässe, Schwindel, akute Verwirrtheit, Fieber/Infektzeichen, Brustschmerz, Kreislaufveränderung und Bewusstseinsabnahme als Warnzeichen beachten.',
  'Atmung, Kreislauf, Bewusstsein, Temperatur, Sauerstoffsättigung nach Standard, Schmerz, Flüssigkeit, Ausscheidung, Medikamente und zeitlichen Verlauf erheben; mit Ausgangszustand vergleichen.',
  'Akute Veränderung kann eine rasche Verschlechterung anzeigen; Abwarten verzögert Erkennung behandelbarer Ursachen und erhöht das Risiko.',
  'Position und Umgebung an Zustand und Wunsch anpassen, nicht allein lassen, Sturzquellen beseitigen und passende Hilfe/Notfallteam nach Befund alarmieren.',
  'Beginn, Ausgangszustand, Symptome, Vitalwerte, Medikamente/Änderungen, Trinkmenge, Maßnahmen und Reaktion präzise mitteilen.',
  'SBAR: Situation akute Veränderung; Background Herzinsuffizienz/Niere/Infekt; Assessment mit konkreten Zeichen/Werten; Recommendation um sofortige ärztliche Beurteilung und klare Rückmeldung bitten.',
  'Sorge der Tochter ernst nehmen, Herrn B. direkt nach seinem Willen fragen. Bettgitter nicht automatisch einsetzen; Erforderlichkeit, Einwilligung, Risiken, mildere Alternativen und rechtliche Voraussetzungen prüfen.',
  'Begleitung, erreichbare Klingel/Hilfsmittel, engmaschige Beobachtung, Umgebung sichern, Toilettenangebot und Ursachenbehandlung nach Einschätzung; Eignung individuell prüfen.',
  'Einwilligungsfähigkeit ist entscheidungs- und situationsbezogen. Autonomie, Schutz, Verhältnismäßigkeit und rechtliche Anforderungen abwägen; Angehörigenwunsch ersetzt nicht den Willen der Person.',
  'Herrn B. direkt, ruhig und verständlich ansprechen; seine Äußerung dokumentieren und ihn soweit möglich an jeder Entscheidung beteiligen.',
  'Pflegefachperson führt Ersteinschätzung/Koordination; Kollegin unterstützt Beobachtung; ärztlicher Dienst klärt Ursache/Anordnungen; Tochter liefert mit Einwilligung Baselineinformationen.',
  'Vitalzeichen und Bewusstsein wiederholt kontrollieren, Beschwerden erfragen, Wirkung und Nebenwirkungen beobachten und bei Verschlechterung erneut eskalieren.',
  'Zeitpunkt, Symptome, Werte, Beteiligte, Kontakte, Rückmeldungen/Anordnungen, Einwilligung/Ablehnung, Maßnahme und Verlauf mit Uhrzeit dokumentieren.',
  'Sinkende Sättigung, Hypotonie, Bewusstseinsabfall oder zunehmende Atemarbeit erhöhen die Dringlichkeit und erfordern sofortige Eskalation nach Notfallstandard.',
  'Konflikt sachlich moderieren: Schutzauftrag ernst nehmen, aber Freiheitsbeschränkung nicht als bequeme Standardlösung einsetzen; Entscheidung transparent begründen.',
  'Wirksamkeit an Stabilisierung, geklärter Ursache, sicherer Mobilität, subjektivem Erleben und ausbleibender weiterer Verschlechterung beurteilen; Plan anpassen.'
 ]
 ];

 const oralCases=[
  {title:'Mündliche Übung 1 · Jugendklinik und chronische Erkrankung',story:'Samira ist 17 Jahre alt und lebt mit ihrer Mutter und zwei jüngeren Geschwistern. Seit ihrer Kindheit hat sie Typ-1-Diabetes und wird in einer Kinder- und Jugendklinik betreut. Sie besucht eine berufsvorbereitende Schule und möchte eine Ausbildung beginnen. In den vergangenen Monaten hat sie drei Kontrolltermine abgesagt. Am Telefon sagt sie, Schule, familiäre Aufgaben und Termine überforderten sie. Sie möchte Gespräche künftig selbst führen und mitentscheiden, welche Informationen ihre Mutter erhält.\n\nDie Mutter sorgt sich um mögliche Unterzuckerungen und bittet das Behandlungsteam um alle Befunde und Gesprächsinhalte. Sie sagt, Samira vergesse Absprachen und brauche mehr Kontrolle. Samira widerspricht: Sie möchte zunächst allein mit einer Pflegefachperson sprechen. Im Gespräch beantwortet sie Fragen klar und kann erklären, warum ihr Privatsphäre wichtig ist. Wie sie selbst ihre Erkrankung im Alltag managt und wobei sie Unterstützung braucht, ist noch nicht erhoben. Ihre Entscheidungsfähigkeit zu einer konkreten medizinischen Frage wurde ebenfalls noch nicht besprochen.\n\nDas Team möchte notwendige Kontrollen sichern, ohne Samira zu übergehen. Die Ärztin schlägt ein abgestimmtes Gespräch vor. Die Schulsozialarbeit könnte mit Samiras Einverständnis helfen, Termine mit dem Schulalltag zu vereinbaren. Noch offen sind die Gründe für die abgesagten Termine, mögliche Belastungen im Alltag, Samiras Wünsche zur Beteiligung der Mutter und welche Informationen sie teilen möchte. Samira würde zu einem Termin kommen, wenn er mit ihr geplant wird und sie die Themen vorher kennt.\n\nIm Fall liegen keine aktuellen Blutzucker- oder HbA1c-Werte und keine bestätigten Unterzuckerungen vor; sie dürfen nicht vermutet werden. Zuerst soll Samira selbst beschreiben, was die Termine erschwert und welche Unterstützung sie als hilfreich erlebt. Eine sichere Versorgung und ihre Selbstbestimmung müssen gemeinsam berücksichtigt werden.'},
  {title:'Mündliche Übung 2 · Langzeitpflege und Selbstbestimmung',story:'Frau R. ist 84 Jahre alt und lebt in einer stationären Pflegeeinrichtung. Sie hat eine fortgeschrittene Herzinsuffizienz, eine chronische Nierenerkrankung und eine beginnende kognitive Beeinträchtigung. Sie möchte in ihrem Zimmer bleiben und selbst entscheiden, wann sie sich wäscht. Ihr Sohn besucht sie täglich und beantwortet häufig Fragen für sie. Zwei Gespräche über ihren Unterstützungsbedarf hat Frau R. zuletzt abgebrochen.\n\nBei einer Pflegevisite berichtet sie, nachts wegen Atemnot manchmal im Sessel zu schlafen. Ihr Sohn bestreitet das und verlangt, sie müsse im Bett bleiben und ihre Medikamente zuverlässig nehmen. Frau R. sagt, sie lasse einzelne Medikamente aus, weil ihr danach schwindelig werde. Die aktuelle Verordnung, Einnahme, Wirkung und der zeitliche Zusammenhang mit dem Schwindel sind noch nicht abgeglichen. Ebenso fehlen aktuelle Beobachtungen zu Atmung, Kreislauf, Trinkmenge, Ausscheidung und Belastbarkeit. Ob eine akute Verschlechterung vorliegt, muss fachlich eingeschätzt werden.\n\nFrau R. bittet um ein Gespräch ohne ihren Sohn. Sie kann einzelne Informationen wiederholen, verliert bei langen Erklärungen aber den Faden. Eine situationsbezogene Einschätzung ihrer Entscheidungsfähigkeit liegt nicht vor. Das Team muss sie verständlich informieren, ihren Willen ernst nehmen und notwendige medizinische Abklärung organisieren. Der Sohn kann mit ihrem Einverständnis Hinweise zum bisherigen Alltag geben. Noch zu klären sind Frau R.s Ziele, ihre Wünsche zur Beteiligung des Sohnes und welche Unterstützung sie bei Atemnot und Schwindel annehmen möchte.\n\nAktuelle Vitalwerte und Angaben dazu, wann die Atemnot auftritt, fehlen. Pflegekräfte ändern die Medikation nicht eigenständig; Beschwerden und ausgelassene Einnahmen werden dokumentiert und dem zuständigen ärztlichen Dienst mitgeteilt. Frau R. wird in verständlichen Schritten gefragt, welche Unterstützung sie annimmt.'}
 ];
 const oralTasks=[
  'Fassen Sie den Fall von XX mit eigenen Worten zusammen. Benennen Sie den vorrangigen pflegerischen Handlungsbedarf und noch fehlende Informationen.',
  'Erläutern Sie die intra- und interprofessionellen Handlungsbedarfe bei XX. Welche Personen oder Berufsgruppen sollten mit welchem Auftrag zusammenarbeiten?',
  'Welche Gesetze, Verordnungen und ethischen Leitlinien sind bei XX zu beachten? Begründen Sie Ihr Vorgehen zu Selbstbestimmung, Einwilligung, Vertraulichkeit, Schutz und Angehörigenbeteiligung.',
  'Welche wissenschaftlichen Erkenntnisse, Leitlinien oder Expertenstandards sind für die Situation von XX relevant? Wie prüfen Sie Aktualität, Geltungsbereich und Übertragbarkeit?',
  'Wie sichern Sie bei XX Qualität, Sicherheit und Versorgungskontinuität? Nennen Sie überprüfbare Ziele, passende Dokumentation und Kriterien für die Evaluation.',
  'Reflektieren Sie Ihre Berufsrolle im Fall von XX. Wie gehen Sie mit unterschiedlichen Sichtweisen im Team beziehungsweise mit Angehörigen um und wie prüfen Sie Ihre eigene Haltung?'
 ];
 const writtenPoints=[
  [6,4,6,4,4,4,6,4,4,4,3,4,4,4,4,4,4,4],
  [6,4,4,4,4,4,6,4,4,3,4,4,4,4,4,4,4,4],
  [6,5,4,6,4,4,4,4,5,3,5,4,4,4,4,4,4,4]
 ];
 function writtenTaskCards(index){
  const tasks=writtenTasks[index];
  const groups=index===2?{6:{last:7,title:'Den ärztlichen Dienst strukturiert informieren'}}:
   {5:{last:6,title:index===0?'Pflegeplanung erstellen':'Beratung planen'}};
  return tasks.flatMap(([title,prompt],i)=>{
   if(Object.values(groups).some(group=>group.last===i))return [];
   const group=groups[i], points=writtenPoints[index];
   if(index===0&&i===5)return [{
    title:group.title,
    prompt:'Erstelle eine Pflegeplanung für das Sturzrisiko von Herrn M. Formuliere das Problem mit zwei fallbezogenen Risikofaktoren (3 Punkte), ein überprüfbares Pflegeziel mit Zeitbezug (3 Punkte) und zwei konkrete Maßnahmen mit Zuständigkeit und Zeitpunkt (je 2 Punkte).',
    points:10,
    guide:['Problem (3 Punkte): Sturzrisiko benennen (1) und zwei Hinweise aus dem Fall nutzen (je 1), etwa die Unsicherheit beim Drehen und den nicht vollständig festgestellten Bremshebel.',
      'Ziel (3 Punkte): einen beobachtbaren Transfer benennen (1), das vereinbarte Maß der Unterstützung festlegen (1) und eine Frist angeben (1). Beispiel: Bis Freitag gelingt Herrn M. der Transfer zum Frühstücksstuhl mit Rollator und verbaler Anleitung durch eine Pflegeperson.',
      'Maßnahmen (je 2 Punkte): passende konkrete Handlung (1) sowie Zuständigkeit und Zeitpunkt (1). Beispiel: Die zuständige Pflegeperson prüft vor jedem Transfer Rollator und Umgebung. Sie leitet Herrn M. beim morgendlichen Transfer in kurzen, gut verständlichen Schritten an.']
   }];
   if(group)return [{title:group.title,prompt:[i,i+1].map(n=>tasks[n][1]+' ('+points[n]+' Punkte)').join(' '),points:points[i]+points[i+1],guide:writtenAnswers[index].slice(i,i+2).map((text,n)=>points[i+n]+' Punkte · '+text)}];
   return [{title,prompt,points:points[i],guide:[writtenAnswers[index][i]]}];
  });
 }

 const originalWrittenMetadata = [
  {id: 'reha-schlaganfall', setting: 'reha', ageGroup: 'adult', age: '58 Jahre', course: 'chronic'},
  {id: 'paed-appendizitis', setting: 'paediatrie', ageGroup: 'child', age: '9 Jahre', course: 'acute'},
  {id: 'langzeit-zustandsveraenderung', setting: 'langzeit', ageGroup: 'older', age: '79 Jahre', course: 'mixed'}
 ];
 function additionalTaskCards(cs){
  const planIndex=cs.tasks.findIndex(([,prompt])=>prompt.startsWith('Formulieren Sie ein Pflegeproblem'));
  const pointsByOperator={Analysieren:6,Beurteilen:5,Planen:5,Begründen:5};
  return cs.tasks.flatMap(([title,prompt],i)=>{
   if(i===planIndex+1||i===planIndex+2)return [];
   if(i===planIndex){
    const points=[3,3,4];
    return [{title:'Pflegeplanung erstellen',points:10,
     prompt:'Erstellen Sie eine Pflegeplanung zu einem im Fall beschriebenen Pflegeproblem. '+cs.tasks.slice(i,i+3).map(([,text],n)=>text+' ('+points[n]+' Punkte)').join(' '),
     guide:cs.answers.slice(i,i+3).map((answer,n)=>points[n]+' Punkte · '+answer)}];
   }
   return [{title,prompt,points:pointsByOperator[title]||4,guide:[cs.answers[i]]}];
  });
 }
 const writtenExercises = [
  ...writtenCases.map((cs, index) => ({
   ...cs, ...originalWrittenMetadata[index], tasks: writtenTasks[index], answers: writtenAnswers[index]
  })),
  ...additionalWrittenCases.map(cs => ({...cs, ...buildAdditionalWrittenExercise(cs)}))
 ];
 const writtenFilters = {setting: '', ageGroup: '', course: ''};


 function matchingWrittenExercises() {
  return writtenExercises.filter(cs => Object.entries(writtenFilters)
   .every(([field, value]) => !value || cs[field] === value || (field === 'course' && cs.course === 'mixed')));
 }

 function writtenFilterOptions(values, selected, allLabel) {
  return '<option value="">' + allLabel + '</option>' + Object.entries(values).map(([id, label]) =>
   `<option value="${id}"${id === selected ? ' selected' : ''}>${esc(label)}</option>`
  ).join('');
 }

 function renderWritten(c, header) {
  const matches = matchingWrittenExercises();
  const selectedWrittenId = state.writtenExerciseId;
  const cs = matches.find(item => item.id === selectedWrittenId);
  c.innerHTML = header + `<section class="panel" aria-labelledby="writtenSettingsTitle">
   <h2 id="writtenSettingsTitle">Schriftliche Prüfung nach Setting</h2>
   <div class="grid" aria-label="Versorgungssettings">
    <button type="button" class="btn ${writtenFilters.setting ? '' : 'primary'}" aria-pressed="${!writtenFilters.setting}" data-setting="" onclick="setWrittenFilter('setting', this.dataset.setting)">Alle Settings</button>
    ${Object.entries(writtenSettings).map(([id, label]) => `<button type="button" class="btn ${id === writtenFilters.setting ? 'primary' : ''}" aria-pressed="${id === writtenFilters.setting}" data-setting="${id}" onclick="setWrittenFilter('setting', this.dataset.setting)">${esc(label)}</button>`).join('')}
   </div>
   <div class="flex">
    <label for="writtenAgeFilter">Altersgruppe <select id="writtenAgeFilter" onchange="setWrittenFilter('ageGroup', this.value)">${writtenFilterOptions(writtenAgeGroups, writtenFilters.ageGroup, 'Alle Altersgruppen')}</select></label>
    <label for="writtenCourseFilter">Verlauf <select id="writtenCourseFilter" onchange="setWrittenFilter('course', this.value)">${writtenFilterOptions(writtenCourses, writtenFilters.course, 'Alle Verläufe')}</select></label>
   </div>
   <p role="status">${matches.length} ${matches.length === 1 ? 'passender Fall' : 'passende Fälle'}</p>
   <div class="grid study-section-grid">${matches.map(item => `<article class="card study-section">
    <h3 class="section-title">${studyMini(studyAreaIcon(item.focus))}<span>${esc(item.title)}</span></h3>
    <p>${esc(writtenSettings[item.setting])} · ${esc(item.age)} · ${esc(writtenCourses[item.course])}</p>
    <p>${esc(item.focus)}</p>
    <button type="button" class="btn ${item.id === selectedWrittenId ? 'primary' : ''}" aria-label="Fall öffnen: ${esc(item.title)}" data-case="${item.id}" onclick="openWrittenExercise(this.dataset.case)">Fall öffnen</button>
   </article>`).join('')}</div>
   ${matches.length ? '' : '<p>Für diese Kombination gibt es noch keinen Fall. Ändere das Setting, die Altersgruppe oder den Verlauf.</p>'}
  </section>`;
  if (!cs) return;
  const originalIndex = originalWrittenMetadata.findIndex(item=>item.id===cs.id);
  const key = 'writing-'+cs.id;
  const tasks = originalIndex>=0 ? writtenTaskCards(originalIndex) : additionalTaskCards(cs);
  c.insertAdjacentHTML('beforeend', `<section class="panel" aria-labelledby="writtenCaseTitle">
   <h2 id="writtenCaseTitle" tabindex="-1">${esc(cs.title)}</h2>
   <p>${esc(cs.focus)} · ${tasks.length} Aufgaben</p>
   <p>Übungszeit <span id="examClock">${examFormatTime(examFormatSeconds)}</span>
    <button type="button" class="btn" onclick="examStartTimer(7200)">120-Minuten-Übung starten</button>
    <button type="button" class="btn" onclick="examStartTimer(0)">Timer stoppen</button>
   </p>
   <h3>Fallsituation</h3>${cs.story.split('\n\n').map(text => '<p>' + esc(text) + '</p>').join('')}
   <h3>Aufgaben zum Fall</h3>
   ${examTaskList(key,tasks)}
   ${examPointReview(key,tasks)}
   <details><summary>Operatoren kurz erklärt</summary><ul>${operators.map(([operator, description]) => `<li><strong>${esc(operator)}</strong> · ${esc(description)}</li>`).join('')}</ul></details>
  </section>`);
 }

 window.setWrittenFilter = (field, value) => {
  writtenFilters[field] = value;
  if (!matchingWrittenExercises().some(cs => cs.id === state.writtenExerciseId)) {
   delete state.writtenExerciseId;safeSave();
   examStartTimer(0);
  }
  renderExam();
  const control = field === 'setting' ? `[data-setting="${value}"]` : field === 'ageGroup' ? '#writtenAgeFilter' : '#writtenCourseFilter';
  $(control)?.focus({preventScroll: true});
 };
 window.openWrittenExercise = id => {
  if (!matchingWrittenExercises().some(cs => cs.id === id)) return;
  if (state.writtenExerciseId !== id) examStartTimer(0);
  state.writtenExerciseId = id;safeSave();
  renderExam();
  const title = $('#writtenCaseTitle');
  title?.focus({preventScroll: true});
  title?.scrollIntoView({block: 'start'});
 };

 function renderExam(){
  const c=$('#content');if(!c)return;const mode=examMode||'schriftlich';
  const header='<div class="panel"><span class="tag">Prüfungstraining · prüfungsnahe Übungen</span><h2>Prüfungsformate üben</h2><p>'+(mode==='praktisch'?'Die praktische Prüfung übst du mit deiner tatsächlichen Versorgungssituation in deiner Ausbildungseinrichtung.':'Bearbeite schriftliche und mündliche Fälle erst selbst und vergleiche deine Antworten danach mit den Lösungshinweisen. Das sind Übungsfälle, keine offiziellen Prüfungsaufgaben.')+'</p><div class="flex">'+[['schriftlich','Schriftlich'],['praktisch','Praktisch'],['muendlich','Mündlich']].map(x=>'<button class="btn '+(mode===x[0]?'primary':'')+'" onclick="examSetMode(&#39;'+x[0]+'&#39;)">'+x[1]+'</button>').join('')+'</div></div>';
  if(mode==='praktisch'){
   originalExamRender();
   return;
  }
  if(mode==='schriftlich'){
   renderWritten(c, header);
   return;
  }
  const oi=state.oralFormIndex||0,oc=oralCases[oi],key='oral-form-'+oi;
  const tasks=oralTasks.map((prompt,i)=>({prompt:prompt.replaceAll('XX',oi===0?'Samira':'Frau R.'),points:i===0?4:5,guide:[oralGuides[oi][i]]}));
  c.innerHTML=header+'<div class="panel"><div class="flex">'+oralCases.map((x,i)=>'<button class="btn '+(oi===i?'primary':'')+'" onclick="upgradeOral('+i+')">Mündlicher Fall '+(i+1)+'</button>').join('')+'</div><span class="tag">Kompetenzbereiche III, IV und V</span><p class="muted">Hamburger Empfehlung für den Falltext: 1.500–2.000 Zeichen ohne Leerzeichen. Wähle die Altersstufe und den Versorgungskontext, die von deiner praktischen Prüfung abweichen. Vorbereitungszeit: <span id="examClock">00:00</span> <button class="btn" onclick="examStartTimer(1800)">30-Minuten-Vorbereitung starten</button> <button class="btn" onclick="examStartTimer(0)">Timer stoppen</button></p><h2>'+esc(oc.title)+'</h2><h3>Prüfungsfall</h3>'+oc.story.split('\n\n').map(x=>'<p>'+esc(x)+'</p>').join('')+'<h3>Fragen für das Prüfungsgespräch</h3>'+examTaskList(key,tasks)+examPointReview(key,tasks)+'</div>';
 }
 window.upgradeOral=i=>{state.oralFormIndex=i;safeSave();renderExam()};
 if(typeof window.examSetMode!=='function')window.examSetMode=m=>{examMode=m;renderExam()};
 const originalExamRender=window.examRender;
 window.examRender=function(){renderExam()};
 setTimeout(()=>render(),0);
 // Internal page backstop: the old dated personal calendar is replaced by this adaptive learner path.
 const firstNav=document.querySelector('#nav'); if(firstNav)setTimeout(()=>{if(tab==='plan')render()},0);
})();

