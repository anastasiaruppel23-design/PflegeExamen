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
vm.runInContext(read('curriculum.js'), context);
assert.equal(run('curriculumUnits.length'), 11);
assert.equal(run('new Set(curriculumYears.flat().flatMap(field => field[2])).size'), 11);
assert.deepEqual(Array.from(run('curriculumYears.flat().map(field => field[0])')), [
 '1a', '1b', '2', '3a', '3b', ...Array.from({length: 21}, (_, i) => String(i + 4))
]);
assert.ok(run('curriculumYears.flat().every(field => topics.some(([title]) => title.startsWith(field[6])))'));
vm.runInContext(read('anatomy-depth.js'), context);
assert.equal(run('Object.keys(anatomyDepth).length'), 11);
assert.ok(run('Object.values(anatomyDepth).every(module => module.build.length >= 3 && module.physiology.length >= 3 && module.answer && module.question)'));
const missingAnatomy = Array.from(run('Object.values(anatomyDepth).flatMap(module => module.topics).filter(prefix => !topics.some(([title]) => title.startsWith(prefix)))'));
assert.deepEqual(missingAnatomy, []);
vm.runInContext(library.slice(library.indexOf("function relatedTopics("), library.indexOf("function openLibraryTopic(")), context);
assert.ok(run('topics.every((_, i) => relatedTopics(i).length && relatedTopics(i).every(n => n !== i && topics[n]))'));
for(const file of ['practice-decisions.js','emergency-decisions.js','advanced-training.js']) run(read(file));
assert.equal(context.practiceDecisions.length,8);
assert.equal(context.emergencyDecisions.length,11);
const decisions=[...context.practiceDecisions,...context.emergencyDecisions];
const questionText = new Set();
for(const entry of decisions) {
 assert.ok(entry.source[0] && new URL(entry.source[1]).protocol === 'https:');
 assert.equal(entry.steps.length,5,entry.title);
 assert.equal(new Set(entry.steps.map(step=>step.a)).size,3,entry.title);
 for(const step of entry.steps) {
  assert.ok(step.scene && step.phase && step.q && !questionText.has(step.q+' '+step.scene),entry.title);
  questionText.add(step.q+' '+step.scene);
  assert.equal(step.opts.length,3,step.q);
  assert.equal(new Set(step.opts).size,3,step.q);
  assert.equal(step.responses.length,3,step.q);
  assert.ok(step.opts[step.a] && step.responses.every(Boolean) && step.why === step.responses[step.a],step.q);
 }
}
assert.equal(questionText.size,95);
assert.equal(context.advancedQuizQuestions.filter(entry=>entry.id.startsWith('advanced-emergency-')).length,9);
const assets=read('sw.js').match(/const ASSETS\s*=\s*(\[[^;]+\])/)[1];
const cached=vm.runInNewContext(assets);
for(const [,source,file] of html.matchAll(/(?:src|href)="((\.\/[^"?]+)(?:\?[^"]*)?)"/g)){
 assert.ok(fs.existsSync(path.join(root,file)),file);
 if(/\.(js|css)$/.test(file))assert.ok(cached.includes(source),`Missing from offline cache: ${source}`);
}
console.log(`PASS: ${cardCount} card links, ${topicCount} topics, 95 situated practice decisions, source links, glossary matching and offline script assets`);
