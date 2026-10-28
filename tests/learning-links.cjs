const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const html=read('index.html'),library=read('library.js');
const context=vm.createContext({URL,console});
vm.runInContext(html.slice(html.indexOf('const topics='),html.indexOf('const questions='))+html.slice(html.indexOf('const questions='),html.indexOf('const cards='))+html.slice(html.indexOf('const cards='),html.indexOf('const cases='))+`const sourceNotes=[];let ci=0,flipped=false;function go(){};function openLibraryTopic(){};function renderCards(){};function renderVisualLibrary(){};function renderQuiz(){};function kbRender(){};function openGlossary(){};function addGlossaryAccess(){};function render(){};let state={};const esc=String;function highlighted(s){return s};`,context);
vm.runInContext(library.slice(0,library.indexOf('function learningTone')),context);
const bank=html.match(/const competencyBank\s*=\s*(\[.*?\]);/s);assert.ok(bank);vm.runInContext('const competencyBank='+bank[1],context);
vm.runInContext(read('curriculum-data.js'),context);
vm.runInContext(read('curriculum.js').replace(/render\(\);\s*$/,''),context);
const run=s=>vm.runInContext(s,context);
assert.equal(run('curriculumData.diseases.length'),45);assert.equal(run('curriculumData.models.length'),22);assert.equal(run('curriculumData.standards.length'),11);assert.equal(run('curriculumData.glossary.length'),249);
assert.equal(run("lessonIds.get('unterzuckerung')"),36);assert.equal(run("lessonIds.get('druckgeschwuer-dekubitus')"),38);assert.equal(run("lessonIds.get('lazarus')"),4);
assert.equal(run("activeTopics().filter(x=>x.v[1]==='Medikamente').length"),0);
assert.ok(run('cards.length')>170);assert.ok(run('unifiedBank.length')>240);
for(const q of run('unifiedBank')){assert.equal(q.options.length,4,q.id);assert.ok(q.answer>=0&&q.answer<4);assert.equal(new Set(q.options).size,4,q.id);assert.ok(q.explain.length>20,q.id)}
for(const c of run('detailedCards')){assert.ok(run(`!retiredTopics.has(${c.topic})`));assert.ok(c.blocks.every(b=>b[1]));}
for(const d of run('[...richLessons.values()]')){assert.ok(d.source.startsWith('https://'));assert.ok(d.definition.length>15);assert.ok(run(`cardForTopic(${d.topic})`)>=0);}
for(const source of [...html.matchAll(/(?:src|href)="(\.\/[^"?]+)(\?[^\"]*)?"/g)].map(m=>m[1]))assert.ok(fs.existsSync(path.join(root,source)),source);
console.log(JSON.stringify(run('({topics:activeTopics().length,cards:cards.length,questions:unifiedBank.length,glossary:curriculumData.glossary.length})')));
