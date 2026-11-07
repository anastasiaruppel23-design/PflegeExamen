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
assert.equal(run('cards.length'),74);assert.equal(run('topics.length'),75);assert.equal(run('window.pfDiseaseEntries.length'),31);assert.ok(run('window.pfDiseaseEntries.every(e=>e.sections.length>=4&&e.quiz&&e.source)'));
for(let card=0;card<74;card++){
 const topic=run(`topicForCard(${card})`);assert.ok(topic>=0&&topic<48);
 run(`openStudyCard(${topic})`);assert.equal(run('topicForCard(ci)'),topic);
}
for(const [card,title] of [[0,'Thrombose'],[1,'Antonovsky'],[2,'Peplau'],[3,'Orem'],[13,'Pflegeprozess'],[16,'Friedemann'],[27,'Krohwinkel'],[34,'Qualitätsmanagement']])assert.ok(run(`topics[topicForCard(${card})][0]`).startsWith(title));
assert.equal(run('topicForCard(-1)'),-1);assert.equal(run('topicForCard(74)'),-1);
vm.runInContext(read('glossary.js'),context);
assert.match(run("highlighted('Kohärenzgefühl: verstehen')"),/glossary-term/);
assert.doesNotMatch(run("highlighted('Non-Compliance und Copingstrategien')"),/glossary-term/);
assert.doesNotMatch(run("highlighted('<img src=x onerror=alert(1)>')"),/<img/);
assert.equal(run('studyGlossary.length'),5);
for(const source of [...html.matchAll(/(?:src|href)="(\.\/[^"?]+)(\?[^\"]*)?"/g)].map(m=>m[1]))assert.ok(fs.existsSync(path.join(root,source)),source);
const assets=read('sw.js').match(/const ASSETS=(\[[^;]+\])/)[1];
const cached=JSON.parse(assets.replaceAll("'",'"'));assert.ok(cached.includes('./glossary.js?v=11'));assert.ok(cached.includes('./disease-library.js?v=1'));
console.log('PASS: 74 card links, 75 valid topics, 31 disease/care profiles, glossary matching/escaping, script assets and offline cache');
