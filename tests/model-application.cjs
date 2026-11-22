const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = name => fs.readFileSync(path.join(__dirname, '..', name), 'utf8');
const result = {innerHTML: ''};
const context = vm.createContext({
 document: {getElementById: () => result},
 esc: value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;'),
 expansionTopicLinks: () => ''
});
const run = code => vm.runInContext(code, context);
run(read('model-application.js'));
const expansion = read('learning-expansion.js');
run(expansion.slice(expansion.indexOf('const models='), expansion.indexOf('const standards=')));
run(expansion.slice(expansion.indexOf('const modelTopicAliases ='), expansion.indexOf('const standardTopics =')));
run(expansion.slice(expansion.indexOf('function modelApplicationCard('), expansion.indexOf('function renderStandards(')));
const oral = read('exam-practice.js');
const oralKeys = Array.from(oral.slice(oral.indexOf('const oralCases ='), oral.indexOf('let oralCaseKey')).matchAll(/^ (\w+): \{/gm), match => match[1]);
context.oralCases = Object.fromEntries(oralKeys.map(key => [key, {}]));
assert.equal(run('models.length'), 29);
assert.ok(run('models.every(([name]) => modelApplications[name]?.length === 3)'));
assert.ok(run('Object.values(caseApplications).every(c => c.models.every(name => models.some(m => m[0] === name)))'));
assert.ok(run('Object.values(caseApplications).every(c => c.law.every(id => caseLaw[id]) && c.standards.every(index => caseStandardTitles[index]))'));
assert.equal(run('libraryApplicationKeys.length'), 6);
assert.equal(oralKeys.length, 3);
for (const key of [...oralKeys, ...run('libraryApplicationKeys')]) {
 const html = run(`caseApplicationHtml(${JSON.stringify(key)})`);
 assert.match(html, /Probleme und Risiken/);
 assert.match(html, /Ressourcen/);
 assert.match(html, /KB III/);
 assert.match(html, /KB IV\/V/);
 assert.match(html, /Evaluation/);
 assert.match(html, /gesetze-im-internet\.de/);
}
run("filterExpansionModels('')");
assert.equal((result.innerHTML.match(/Modell am Fall anwenden/g) || []).length, 29);
run("filterExpansionModels('Dorothea Orem')");
assert.match(result.innerHTML, /openOralPractice\('samira'\)/);
assert.match(result.innerHTML, /1 von 29 Einträgen/);
assert.match(run("caseApplicationHtml('sturz')"), /learning-standard-3/);
assert.match(oral, /caseApplicationHtml\(oralCaseKey\)/);
assert.match(read('index.html'), /caseApplicationHtml\(libraryApplicationKeys\[i\]\)/);
console.log('PASS: 29 worked model cards, search, case navigation and nine guided case analyses');
