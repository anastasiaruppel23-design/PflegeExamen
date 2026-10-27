/* Short, independently phrased definitions; sources checked 27 October 2026. */
const studyGlossary=[
 {name:'Kohärenzgefühl',aliases:['Kohärenzgefühl'],text:'Bei Antonovsky: die Zuversicht, dass das Leben verstehbar, handhabbar und bedeutsam ist. Diese drei Aspekte gehören zusammen.',example:'Beispiel: Eine Person versteht ihre Situation, kennt verfügbare Unterstützung und erkennt einen persönlichen Sinn in ihren nächsten Schritten.',topic:2,source:'BIÖG · Salutogenese',url:'https://series.publisso.de/de/publisso_gold/publishing/books/overview/54/392'},
 {name:'Salutogenese',aliases:['Salutogenese'],text:'Ein Modell zur Frage, wie Gesundheit entsteht und erhalten werden kann. Gesundheit und Krankheit werden als Kontinuum verstanden; Ressourcen und der Umgang mit Belastungen spielen eine zentrale Rolle.',example:'Prüfungsimpuls: Welche Fähigkeiten und welche Unterstützung helfen der Person, mit ihrer Situation umzugehen?',topic:2,source:'BIÖG · Salutogenese',url:'https://series.publisso.de/de/publisso_gold/publishing/books/overview/54/392'},
 {name:'Compliance',aliases:['Compliance'],text:'Bezeichnet das Befolgen therapeutischer Vorgaben. Der Begriff betont eher die Vorgabe; Adhärenz betont die gemeinsam vereinbarte Behandlung.',example:'Für die Pflege: Schwierigkeiten erfragen, statt vorschnell mangelnde Mitarbeit zu unterstellen. Nebenwirkungen, Verständigungsprobleme oder Zugangshürden können eine Rolle spielen.',topic:29,source:'AOK · Fachbegriffe der medikamentösen Therapie',url:'https://www.aok.de/pk/magazin/wohlbefinden/selbstbewusstsein/fachbegriffe-aus-der-medikamentoesen-therapie-leicht-erklaert/'},
 {name:'Adhärenz',aliases:['Adhärenz'],text:'Die Umsetzung einer gemeinsam vereinbarten Behandlung. Dazu gehören verständliche Informationen, die Beteiligung der betroffenen Person und ein im Alltag umsetzbarer Plan.',example:'Beispiel: Gemeinsam besprechen, was die regelmäßige Medikamenteneinnahme erschwert und welche Unterstützung die Person möchte.',topic:29,source:'AOK · Fachbegriffe der medikamentösen Therapie',url:'https://www.aok.de/pk/magazin/wohlbefinden/selbstbewusstsein/fachbegriffe-aus-der-medikamentoesen-therapie-leicht-erklaert/'},
 {name:'Coping',aliases:['Coping'],text:'Anstrengungen, mit Belastungen oder schwierigen Situationen umzugehen. Problemorientiertes Coping setzt an der Situation an; emotionsorientiertes Coping am Umgang mit den ausgelösten Gefühlen.',example:'Lernbeispiel: Einen Lernplan erstellen verändert das Problem. Ein entlastendes Gespräch kann beim Umgang mit Prüfungsangst helfen.',topic:4,source:'Universität Hamburg · Psychologie-Fachgebärdenlexikon',url:'https://www.sign-lang.uni-hamburg.de/projekte/plex/plex/lemmata/c-lemma/coping.htm'}
];
const plainHighlighted=highlighted;
highlighted=function(value){
 // Match whole terms, not fragments such as Non-Compliance or Copingstrategien.
 return String(value).split(/(?<![\p{L}\p{N}-])(Kohärenzgefühl|Salutogenese|Compliance|Adhärenz|Coping)(?![\p{L}\p{N}-])/gu).map((part,n)=>{
  if(n%2===0)return plainHighlighted(part);
  const index=studyGlossary.findIndex(v=>v.aliases.includes(part));
  return `<button type="button" class="glossary-term" onclick="openGlossary(${index})" aria-haspopup="dialog" aria-label="${esc(part)}: Begriff erklären">${esc(part)}<span aria-hidden="true"> ?</span></button>`;
 }).join('');
};
let glossaryReturnFocus=null;
function glossaryDialog(){
 let dialog=document.getElementById('studyGlossaryDialog');if(dialog)return dialog;
 dialog=document.createElement('dialog');dialog.id='studyGlossaryDialog';dialog.className='glossary-dialog';dialog.setAttribute('aria-labelledby','glossaryTitle');
 dialog.addEventListener('close',()=>{if(glossaryReturnFocus?.isConnected)glossaryReturnFocus.focus({preventScroll:true})});
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});
 document.body.appendChild(dialog);return dialog;
}
function openGlossary(index){
 const dialog=glossaryDialog();if(!dialog.open)glossaryReturnFocus=document.activeElement;
 const entry=studyGlossary[index];
 dialog.innerHTML=`<form method="dialog" class="glossary-close"><button class="btn" aria-label="Begriffserklärung schließen" autofocus>Schließen ×</button></form><span class="study-eyebrow">Kurz erklärt · PflegeFokus</span><h2 id="glossaryTitle">${entry?esc(entry.name):'Fachbegriffe nachschlagen'}</h2>${entry?`<p>${esc(entry.text)}</p><div class="glossary-example">${esc(entry.example)}</div><button class="btn primary" onclick="glossaryDialog().close();openLibraryTopic(${entry.topic})">Passendes Wissen öffnen ↗</button><p class="glossary-source">Fachlicher Bezug: <a href="${entry.url}" target="_blank" rel="noopener noreferrer">${esc(entry.source)}</a></p><button class="text-button" onclick="openGlossary()">← Alle Begriffe</button>`:'<label for="glossarySearch">Begriff suchen</label><input id="glossarySearch" type="search" placeholder="Zum Beispiel: Compliance" oninput="filterGlossary(this.value)"><div id="glossaryResults"></div>'}`;
 if(!entry)filterGlossary('');
 if(!dialog.open)dialog.showModal();else dialog.querySelector('button').focus();
}
function filterGlossary(query){
 const entries=studyGlossary.map((v,i)=>({v,i})).filter(({v})=>v.name.toLocaleLowerCase('de').includes(query.trim().toLocaleLowerCase('de')));
 document.getElementById('glossaryResults').innerHTML=`<p role="status">${entries.length} Begriffe</p>${entries.map(({v,i})=>`<button class="glossary-entry" onclick="openGlossary(${i})">${esc(v.name)} <span aria-hidden="true">↗</span></button>`).join('')||'<p>Kein Treffer. Probiere einen anderen Suchbegriff.</p>'}`;
}
function addGlossaryAccess(){const root=document.querySelector('#content .visual-library');if(!root||root.querySelector('.glossary-access'))return;root.insertAdjacentHTML('beforeend','<aside class="glossary-access"><div><strong>Ein Begriff ist unklar?</strong><p>Unterstrichene Begriffe antippen oder im kleinen Glossar nachschlagen.</p></div><button class="btn" onclick="openGlossary()">Fachbegriffe nachschlagen</button></aside>')}
const lessonWithLinks=openLibraryTopic;
openLibraryTopic=function(index){lessonWithLinks(index);addGlossaryAccess()};
const cardWithLinks=renderCards;
renderCards=function(){cardWithLinks();addGlossaryAccess()};
const libraryWithLinks=renderVisualLibrary;
renderVisualLibrary=function(){libraryWithLinks();addGlossaryAccess()};
