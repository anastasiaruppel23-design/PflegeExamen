// Data/link checks runnable without a browser; UI checks live in visual.cjs.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const html=read('index.html'),library=read('library.js'),visual=read('visual-library.js'),disease=read('disease-library.js');
const context=vm.createContext({});context.window=context;
vm.runInContext(html.slice(html.indexOf('const topics='),html.indexOf('const questions='))+html.slice(html.indexOf('const cards='),html.indexOf('const cases='))+`const sourceNotes=[],questions=[];let ci=0,flipped=false;function go(){};function openLibraryTopic(){};function renderCards(){};function renderVisualLibrary(){};function esc(s){return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')};function highlighted(s){return esc(s)};`,context);
vm.runInContext(disease,context);
vm.runInContext(library.slice(0,library.indexOf('function learningTone')),context);
vm.runInContext(visual.slice(0,visual.indexOf('/* Illustrated views')),context);
const run=s=>vm.runInContext(s,context);
const cardCount=run('cards.length'),topicCount=run('topics.length');
assert.equal(cardCount,run('originalCardCount + libraryEntries.length'));
assert.equal(topicCount,run('originalTopicCount + libraryEntries.length'));
assert.equal(run('questions.length'),run('libraryEntries.filter(entry=>entry.quiz).length'));
assert.equal(run('window.pfDiseaseEntries.length'),45);assert.ok(run('window.pfDiseaseEntries.every(e=>e.sections.length>=4&&e.quiz&&e.source&&librarySources[e.source]&&e.group&&Number.isInteger(e.quiz[2])&&e.quiz[2]>=0&&e.quiz[2]<e.quiz[1].length)'));
for(let card=0;card<cardCount;card++){
 const topic=run(`topicForCard(${card})`);assert.ok(topic>=0&&topic<topicCount);
 run(`openStudyCard(${topic})`);assert.equal(run('topicForCard(ci)'),topic);
}
for(const [card,title] of [[0,'Thrombose'],[1,'Antonovsky'],[2,'Peplau'],[3,'Orem'],[13,'Pflegeprozess'],[16,'Friedemann'],[27,'Krohwinkel'],[34,'Qualitätsmanagement']])assert.ok(run(`topics[topicForCard(${card})][0]`).startsWith(title));
assert.equal(run('topicForCard(-1)'),-1);assert.equal(run(`topicForCard(${cardCount})`),-1);
vm.runInContext(read('glossary.js'),context);
assert.match(run("highlighted('Kohärenzgefühl: verstehen')"),/glossary-term/);
assert.doesNotMatch(run("highlighted('Non-Compliance und Copingstrategien')"),/glossary-term/);
assert.doesNotMatch(run("highlighted('<img src=x onerror=alert(1)>')"),/<img/);
assert.equal(run('studyGlossary.length'),5);
const assets=read('sw.js').match(/const ASSETS\s*=\s*(\[[^;]+\])/)[1];
const cached=vm.runInNewContext(assets);
for(const [,source,file] of html.matchAll(/(?:src|href)="((\.\/[^"?]+)(?:\?[^"]*)?)"/g)){
 assert.ok(fs.existsSync(path.join(root,file)),file);
 if(/\.(js|css)$/.test(file))assert.ok(cached.includes(source),`Missing from offline cache: ${source}`);
}
console.log(`PASS: ${cardCount} card links, ${topicCount} topics, quiz answers, source links, glossary matching and offline script assets`);
