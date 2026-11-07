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
assert.equal(run('cards.length'),75);assert.equal(run('topics.length'),76);assert.equal(run('questions.length'),70);assert.equal(run('window.pfDiseaseEntries.length'),32);assert.ok(run('window.pfDiseaseEntries.every(e=>e.sections.length>=4&&e.quiz&&e.source&&librarySources[e.source]&&Number.isInteger(e.quiz[2])&&e.quiz[2]>=0&&e.quiz[2]<e.quiz[1].length)'));
for(let card=0;card<75;card++){
 const topic=run(`topicForCard(${card})`);assert.ok(topic>=0&&topic<76);
 run(`openStudyCard(${topic})`);assert.equal(run('topicForCard(ci)'),topic);
}
for(const [card,title] of [[0,'Thrombose'],[1,'Antonovsky'],[2,'Peplau'],[3,'Orem'],[13,'Pflegeprozess'],[16,'Friedemann'],[27,'Krohwinkel'],[34,'Qualitätsmanagement']])assert.ok(run(`topics[topicForCard(${card})][0]`).startsWith(title));
assert.equal(run('topicForCard(-1)'),-1);assert.equal(run('topicForCard(75)'),-1);
vm.runInContext(read('glossary.js'),context);
assert.match(run("highlighted('Kohärenzgefühl: verstehen')"),/glossary-term/);
assert.doesNotMatch(run("highlighted('Non-Compliance und Copingstrategien')"),/glossary-term/);
assert.doesNotMatch(run("highlighted('<img src=x onerror=alert(1)>')"),/<img/);
assert.equal(run('studyGlossary.length'),5);
for(const source of [...html.matchAll(/(?:src|href)="(\.\/[^"?]+)(\?[^\"]*)?"/g)].map(m=>m[1]))assert.ok(fs.existsSync(path.join(root,source)),source);
const assets=read('sw.js').match(/const ASSETS=(\[[^;]+\])/)[1];
const cached=JSON.parse(assets.replaceAll("'",'"'));assert.ok(cached.includes('./glossary.js?v=11'));assert.ok(cached.includes('./disease-library.js?v=2')&&cached.includes('./library.js?v=11')&&cached.includes('./exam-practice.js?v=6'));
console.log('PASS: 75 card links, 76 valid topics, 70 quiz questions, 32 source-linked profiles and valid answer keys, glossary matching/escaping, script assets and offline cache');
