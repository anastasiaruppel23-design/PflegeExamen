/* Version 12: stable topic indices, one quiz, searchable curriculum. */
const retiredTopics=new Set([41,44,45,46,47]);
const richLessons=new Map(),lessonIds=new Map();
for(const d of curriculumData.diseases){d.kind='disease';d.old=({unterzuckerung:36,copd:37,'druckgeschwuer-dekubitus':38})[d.id]??null;}
for(const d of curriculumData.models)d.kind='model';
for(const d of curriculumData.standards)d.kind='standard';
for(const d of [...curriculumData.models,...curriculumData.standards,...curriculumData.diseases]){
 const i=d.old??topics.length;d.topic=i;richLessons.set(i,d);lessonIds.set(d.id,i);
 topics[i]=[d.title,d.category,d.definition,d.core||d.care?.map(x=>x.join(' Begründung: '))||[d.assessment,d.action,d.evaluation],d.example||d.goal||'Erkläre die Zusammenhänge und begründe deine Pflege.'];
}
// Retain index slots so existing progress never shifts to another topic.
for(const i of retiredTopics)topics[i]=['Entfernter Bereich','Archiv','',[],''];
const activeTopics=()=>topics.map((v,i)=>({v,i})).filter(x=>!retiredTopics.has(x.i));
const oldOpenLesson=openLibraryTopic;
const section=(label,value,tone='definition')=>value?learnBox(tone,label,value):'';
function lessonSections(d){
 if(d.kind==='disease')return section('Definition',d.definition)+section('Entstehung und Zusammenhänge',d.cause,'disease')+section('Typische Zeichen',d.signs,'disease')+section('Diagnostik und Beobachtung',d.diagnostics)+section('Pflege: Maßnahme und Begründung',d.care.map(([a,b])=>a+' Warum? '+b),'care')+section('Warnzeichen und Grenzen',d.warning,'warning')+section('Pflegeziel und Evaluation',d.goal,'memory');
 if(d.kind==='model')return section('Grundgedanke',d.definition,'model')+section('Bausteine verständlich erklärt',d.core,'model')+section('Anwendung in der Pflege',d.practice,'care')+section('Praxisbeispiel',d.example,'memory')+section('Grenzen des Modells',d.limit,'warning');
 return section('Ziel des Standards',d.definition)+section('Bedarf und Risiken einschätzen',d.assessment,'model')+section('Pflege planen und durchführen',d.action,'care')+section('Praxisbeispiel',d.example,'memory')+section('Wirkung überprüfen',d.evaluation,'care')+section('Worauf es ankommt',d.limit,'warning');
}
openLibraryTopic=function(i){
 if(retiredTopics.has(i)){go('themen');return;}
 const d=richLessons.get(i);if(!d){oldOpenLesson(i);return;}
 tab='themen';setMenu(false);
 const art=d.system==='Herz & Gefäße'?studyArt.heart:d.system?.includes('Atmung')?studyArt.lung:studyArt.care;
 $('#content').innerHTML=`<div class="visual-library lesson-view"><button class="text-button" onclick="go('themen')">← Zur Wissensbibliothek</button><article class="learning-poster"><header class="poster-header"><div><span class="study-eyebrow">${esc(d.category)} · ${esc(d.system)}</span><h1>${esc(d.title)}</h1>${d.version?`<p>Stand: ${esc(d.version)}</p>`:''}</div><img class="curriculum-art" src="${art}" alt=""></header><div class="poster-body"><div class="poster-columns">${lessonSections(d)}</div><div class="study-links"><button class="btn primary" onclick="openStudyCard(${i})">Lernkarten zum Thema</button><button class="btn" onclick="openStudyQuiz(${i})">Quiz zum Thema</button><button class="btn" onclick="markVisualTopic(${i})">${state.done[i]?'✓ Gelernt – rückgängig':'Als gelernt markieren'}</button></div><p class="source-note">Eigenständige Lernzusammenfassung · Recherchestand 28.10.2026. ${d.kind==='standard'?'Keine Kopie der urheberrechtlich geschützten Standardmatrix. ':''}Fachlicher Bezug: ${[d.source,...d.additionalSources||[]].map(u=>`<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(new URL(u).hostname)}</a>`).join(' · ')}</p></div></article></div>`;
 $('#content').focus({preventScroll:true});window.scrollTo(0,0);
};
renderVisualLibrary=function(){
 $('#content').innerHTML=`<div class="visual-library"><section class="library-cover"><div class="cover-copy"><span class="study-eyebrow">Zusammenhänge verstehen · Pflege begründen</span><h1>Deine große<br>Wissensbibliothek.</h1><p>${activeTopics().length} Themen · 45 Krankheitsbilder · 22 Modelle und Konzepte · 11 Expertenstandards</p><p>Definition, Hintergründe, Pflegehandeln, Begründungen und Beispiele gehören zusammen.</p></div><figure><img src="${studyArt.care}" alt="Pflegefachperson begleitet eine ältere Frau" width="400" height="416"></figure></section><div class="study-links"><button class="btn" onclick="go('glossar')">249 Fachbegriffe A–Z</button><button class="btn" onclick="go('karten')">${cards.length} ausführliche Lernkarten</button><button class="btn" onclick="go('quiz')">${unifiedBank.length} Quizfragen</button></div><div class="visual-filters"><label>Thema suchen<input id="search" type="search" placeholder="Zum Beispiel: Schlaganfall, Lazarus, Niere" oninput="filterTopics()"></label><label>Bereich<select id="libraryCategory" onchange="filterTopics()"><option value="">Alle Bereiche</option>${[...new Set(activeTopics().map(x=>x.v[1]))].sort().map(c=>`<option>${esc(c)}</option>`).join('')}</select></label><label>Organsystem / Schwerpunkt<select id="systemFilter" onchange="filterTopics()"><option value="">Alle Schwerpunkte</option>${[...new Set([...richLessons.values()].map(d=>d.system))].sort().map(c=>`<option>${esc(c)}</option>`).join('')}</select></label></div><p class="source-note">Expertenstandards: zehn DNQP-Themen plus der gesondert beauftragte Mobilitätsstandard. Veröffentlichungsstand und Quellen stehen beim jeweiligen Thema.</p><div id="topics"></div></div>`;filterTopics();
};
filterTopics=function(){
 const q=($('#search')?.value||'').toLocaleLowerCase('de'),cat=$('#libraryCategory')?.value||'',sys=$('#systemFilter')?.value||'';
 const a=activeTopics().filter(({v,i})=>(!cat||v[1]===cat)&&(!sys||richLessons.get(i)?.system===sys)&&JSON.stringify(richLessons.get(i)||v).toLocaleLowerCase('de').includes(q));
 $('#topics').innerHTML=`<p role="status">${a.length} Themen</p><div class="topic-gallery">${a.map(({v,i})=>`<button class="topic-tile tone-${richLessons.get(i)?.kind==='model'?'model':v[1]==='Krankheitsbilder'?'disease':'care'}" onclick="openLibraryTopic(${i})"><span class="tile-category">${esc(v[1])}${state.done[i]?' · ✓ Gelernt':''}</span><span class="tile-title"><strong>${esc(v[0])}</strong></span><span class="tile-description">${esc(v[2])}</span><span class="tile-bottom">Verstehen & anwenden ↗</span></button>`).join('')}</div>`;
};
const detailedCards=[];
for(const {v,i} of activeTopics()){
 const d=richLessons.get(i);
 if(d?.kind==='disease'){
 detailedCards.push({topic:i,q:`${d.title}: Wie entsteht die Erkrankung und woran erkennst du sie?`,blocks:[['Definition',d.definition],['Entstehung',d.cause],['Zeichen',d.signs],['Diagnostik',d.diagnostics]]});
 detailedCards.push({topic:i,q:`${d.title}: Welche Pflege ist wichtig – und warum?`,blocks:[['Maßnahmen und Begründungen',d.care.map(x=>x.join(' Warum? '))],['Warnzeichen',d.warning],['Evaluation',d.goal]]});
 }else if(d?.kind==='model'){
 detailedCards.push({topic:i,q:`${d.title}: Erkläre den Grundgedanken und seine Bausteine.`,blocks:[['Grundgedanke',d.definition],['Bausteine',d.core],['Grenzen',d.limit]]});
 detailedCards.push({topic:i,q:`Wie setzt du ${d.title} in einer Pflegesituation um?`,blocks:[['Beispiel',d.example],['Pflegehandeln',d.practice],['Reflexion',d.limit]]});
 }else if(d){
 detailedCards.push({topic:i,q:`${d.title}: Was muss eingeschätzt, geplant und umgesetzt werden?`,blocks:[['Ziel',d.definition],['Einschätzung',d.assessment],['Handeln',d.action]]});
 detailedCards.push({topic:i,q:`${d.title}: Begründe das Vorgehen am Beispiel und überprüfe die Wirkung.`,blocks:[['Beispiel',d.example],['Evaluation',d.evaluation],['Grenzen',d.limit]]});
 }else detailedCards.push({topic:i,q:`${v[0]}: Erkläre Bedeutung, Vorgehen und Anwendung.`,blocks:[['Bedeutung',v[2]],['Fachliche Zusammenhänge',v[3]],['Transfer',v[4]]]});
}
cards.splice(0,cards.length,...detailedCards.map(c=>[c.q,c.blocks.map(([h,v])=>h+': '+(Array.isArray(v)?v.join(' '):v)).join('\n\n')]));
topicForCard=i=>detailedCards[i]?.topic??-1;cardForTopic=i=>detailedCards.findIndex(c=>c.topic===i);
let cardCategory='';
renderCards=function(){
 let pool=detailedCards.map((c,i)=>i).filter(i=>!cardCategory||topics[detailedCards[i].topic][1]===cardCategory);if(!pool.includes(ci))ci=pool[0];const c=detailedCards[ci];
 $('#content').innerHTML=`<div class="visual-library"><h1>Lernkarten mit Erklärung</h1><label>Bereich<select onchange="cardCategory=this.value;flipped=false;renderCards()"><option value="">Alle Bereiche</option>${[...new Set(activeTopics().map(x=>x.v[1]))].sort().map(v=>`<option ${cardCategory===v?'selected':''}>${esc(v)}</option>`).join('')}</select></label><p>Karte ${pool.indexOf(ci)+1} von ${pool.length} · ${esc(topics[c.topic][0])}</p><article class="panel rich-flash"><h2>${esc(c.q)}</h2><p>Formuliere zuerst deine eigene Antwort. Begründe deine Maßnahmen.</p><button class="btn primary" onclick="flipped=!flipped;renderCards()">${flipped?'Antwort verbergen':'Antwort mit Erklärung anzeigen'}</button>${flipped?c.blocks.map(([h,v])=>section(h,v,'care')).join(''):''}</article><div class="study-links"><button class="btn" onclick="moveRichCard(-1)">← Zurück</button><button class="btn" onclick="moveRichCard(1)">Weiter →</button><button class="btn" onclick="openLibraryTopic(${c.topic})">Vollständiges Thema lesen</button></div></div>`;
};
function moveRichCard(step){const p=detailedCards.map((c,i)=>i).filter(i=>!cardCategory||topics[detailedCards[i].topic][1]===cardCategory);ci=p[(p.indexOf(ci)+step+p.length)%p.length];flipped=false;renderCards();}
openStudyCard=function(i){cardCategory='';ci=cardForTopic(i);flipped=false;go('karten');};
const unifiedBank=[],seenQuestions=new Set();
function addQuestion(q){const k=q.q.toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');if(!seenQuestions.has(k)){seenQuestions.add(k);unifiedBank.push(q);}}
questions.forEach((q,i)=>addQuestion({id:'basic-'+i,q:q[0],options:q[1],answer:q[2],explain:q[3],category:'Pflegegrundlagen'}));
competencyBank.forEach(q=>addQuestion({...q,category:q.kb}));
for(const d of curriculumData.diseases){
 addQuestion({id:d.id+'-praxis',q:d.question,options:d.options,answer:d.answer,explain:d.care.map(x=>x.join(' ')).join(' ')+' '+d.warning,category:d.system,topic:d.topic});
 const others=curriculumData.diseases.filter(x=>x!==d&&x.system===d.system);for(const x of curriculumData.diseases)if(others.length<3&&x!==d&&!others.includes(x))others.push(x);
 addQuestion({id:d.id+'-verstehen',q:`Welche Entstehung passt zu ${d.title}?`,options:[d.cause,...others.slice(0,3).map(x=>x.cause)],answer:0,explain:d.definition+' '+d.cause+' Daraus ergeben sich folgende Beobachtungsschwerpunkte: '+d.signs,category:d.system,topic:d.topic});
}
for(const d of curriculumData.models){const others=curriculumData.models.filter(x=>x!==d).slice(0,3);addQuestion({id:d.id+'-modell',q:`Welcher Grundgedanke gehört zu ${d.title}?`,options:[d.definition,...others.map(x=>x.definition)],answer:0,explain:d.core.join(' ')+' Praxis: '+d.example,category:'Modelle & Konzepte',topic:d.topic});}
for(const d of curriculumData.standards){const others=curriculumData.standards.filter(x=>x!==d).slice(0,3);addQuestion({id:d.id+'-standard',q:`Welche Einschätzung gehört besonders zum Expertenstandard ${d.title}?`,options:[d.assessment,...others.map(x=>x.assessment)],answer:0,explain:d.action+' Beispiel: '+d.example+' Evaluation: '+d.evaluation,category:'Expertenstandards',topic:d.topic});}
let quizCategory='',quizRound=null,quizSelection=null,quizChecked=false,quizTopic=null;
const shuffled=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
state.kbMistakes??={};state.kbMastered??={};
function startUnifiedQuiz(mode='all'){
 let pool=unifiedBank.filter(q=>(!quizCategory||q.category===quizCategory)&&(quizTopic===null||q.topic===quizTopic)&& (mode!=='errors'||state.kbMistakes[q.id]));
 const count=Number($('#quizLength')?.value||10);pool=shuffled(pool).slice(0,count||pool.length);
 quizRound={queue:pool.map(q=>({q,order:shuffled(q.options.map((_,i)=>i))})),index:0,correct:0,total:pool.length};quizSelection=null;quizChecked=false;renderQuiz();
}
function checkUnifiedQuiz(){if(quizChecked||quizSelection===null)return;const item=quizRound.queue[quizRound.index],ok=item.order[quizSelection]===item.q.answer;quizChecked=true;state.kbMistakes[item.q.id]=!ok;state.kbMastered[item.q.id]=ok;if(ok)quizRound.correct++;save();renderQuiz();}
function nextUnifiedQuiz(){quizRound.index++;quizSelection=null;quizChecked=false;if(quizRound.index===quizRound.total){const pct=Math.round(100*quizRound.correct/quizRound.total);state.best=Math.max(state.best||0,pct);save();}renderQuiz();}
renderQuiz=function(){
 const errors=unifiedBank.filter(q=>state.kbMistakes[q.id]).length;
 let body='';const item=quizRound?.queue[quizRound.index];
 if(item){const q=item.q;body=`<article class="panel"><p>Frage ${quizRound.index+1} / ${quizRound.total} · ${esc(q.category)}</p><h2>${esc(q.q)}</h2>${item.order.map((n,i)=>`<button class="option ${quizSelection===i?'selected':''}" ${quizChecked?'disabled':''} onclick="quizSelection=${i};renderQuiz()">${String.fromCharCode(65+i)} · ${esc(q.options[n])}</button>`).join('')}${quizChecked?`<div class="quiz-feedback" role="status"><h3>${item.order[quizSelection]===q.answer?'Richtig.':'Noch nicht richtig.'}</h3><p><strong>Richtige Antwort:</strong> ${esc(q.options[q.answer])}</p><p>${esc(q.explain)}</p>${q.topic!==undefined?`<button class="btn" onclick="openLibraryTopic(${q.topic})">Zusammenhang nachlesen</button>`:''}</div><button class="btn primary" onclick="nextUnifiedQuiz()">Weiter →</button>`:`<button class="btn primary" ${quizSelection===null?'disabled':''} onclick="checkUnifiedQuiz()">Antwort prüfen</button>`}</article>`;}
 else if(quizRound)body=`<div class="panel"><h2>${quizRound.total?'Runde abgeschlossen':'Keine passenden Fragen'}</h2><p>${quizRound.correct} von ${quizRound.total} richtig. Fehler bleiben zur gezielten Wiederholung gespeichert.</p><button class="btn" onclick="startUnifiedQuiz('errors')">Fehler im gewählten Bereich wiederholen</button></div>`;
 $('#content').innerHTML=`<div class="visual-library"><h1>Quiz</h1><p>Ein gemeinsamer Fragenpool: ${unifiedBank.length} Fragen aus Pflegegrundlagen, Kompetenzbereichen, Krankheitslehre, Modellen und Standards. Antworten werden gemischt und erklärt.</p>${quizTopic!==null?`<p>Themenrunde: ${esc(topics[quizTopic][0])} <button class="text-button" onclick="quizTopic=null;quizRound=null;renderQuiz()">Alle Themen</button></p>`:''}<div class="visual-filters"><label>Bereich<select onchange="quizCategory=this.value;quizTopic=null;quizRound=null;renderQuiz()"><option value="">Alle Bereiche</option>${[...new Set(unifiedBank.map(q=>q.category))].sort().map(c=>`<option ${c===quizCategory?'selected':''}>${esc(c)}</option>`).join('')}</select></label><label>Rundenlänge<select id="quizLength"><option value="10">10 Fragen</option><option value="20">20 Fragen</option><option value="0">Alle passenden Fragen</option></select></label></div><div class="study-links"><button class="btn primary" onclick="startUnifiedQuiz()">Runde starten</button><button class="btn" onclick="startUnifiedQuiz('errors')">Fehler üben (${errors} insgesamt)</button></div>${body}</div>`;
};
kbRender=renderQuiz;
openStudyQuiz=function(i){quizTopic=unifiedBank.some(q=>q.topic===i)?i:null;quizCategory='';quizRound=null;go('quiz');startUnifiedQuiz();};
function renderBigGlossary(){
 $('#content').innerHTML=`<div class="visual-library"><h1>Fachbegriffe A–Z</h1><p>${curriculumData.glossary.length} Begriffe aus Pflege und Medizin – mit verständlichen Erklärungen und Hinweisen für die Praxis.</p><p><a class="btn" href="./content/fachbegriffe.html" download>Gesamtes Lexikon herunterladen</a> <a class="btn" href="./content/fachbegriffe.html" target="_blank" rel="noopener">Druckansicht öffnen</a></p><label>Begriff oder Erklärung durchsuchen<input type="search" id="bigGlossarySearch" placeholder="Zum Beispiel: Dysphagie, Adhärenz, Niere" oninput="filterBigGlossary()"></label><div id="bigGlossaryResults"></div></div>`;filterBigGlossary();
}
function filterBigGlossary(){const q=$('#bigGlossarySearch').value.trim().toLocaleLowerCase('de');const a=curriculumData.glossary.filter(d=>(d.name+' '+d.text+' '+d.example).toLocaleLowerCase('de').includes(q));$('#bigGlossaryResults').innerHTML=`<p role="status">${a.length} Begriffe</p>${a.map(d=>`<article class="glossary-full"><h2>${esc(d.name)}</h2><p>${esc(d.text)}</p><p class="glossary-example">${esc(d.example)}</p>${d.lesson?`<button class="text-button" onclick="openLibraryTopic(${lessonIds.get(d.lesson)})">Krankheitsbild ausführlich lesen ↗</button>`:''}</article>`).join('')}`;}
// Replace the five-term entry point with the complete glossary; inline definitions still work.
const oldOpenGlossary=openGlossary;
openGlossary=function(index){if(index===undefined){go('glossar');return;}oldOpenGlossary(index);};
addGlossaryAccess=function(){};
const previousGo=go;go=function(t){previousGo(t==='kompetenz'?'quiz':t);};
const previousRender=render;render=function(){previousRender();if(tab==='glossar')renderBigGlossary();};
render();
