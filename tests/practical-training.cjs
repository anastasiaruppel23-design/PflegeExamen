const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const read = name => fs.readFileSync(path.join(__dirname, '..', name), 'utf8');
const nodes = new Map();
const storage = new Map();
const content = {innerHTML: ''};
const context = vm.createContext({
 document: {querySelector: s => s === '#content' ? content : null, getElementById: id => nodes.get(id) || null, addEventListener() {}},
 localStorage: {getItem: k => storage.get(k) || null, setItem: (k,v) => storage.set(k,v)},
});
vm.runInContext(`const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const examEsc=esc;let tab='praktisch',examMode='praktisch';const state={};const save=()=>{};const $=s=>document.querySelector(s);const examFormats={praktisch:{rule:'Praktische Prüfung'}};`, context);
vm.runInContext(read('exam-answers.js'), context);
vm.runInContext(read('practical-training.js'), context);
const exam = read('exam-practice.js');
vm.runInContext(exam.slice(exam.indexOf('function examRender(){'), exam.indexOf('function examStartTimer(')), context);
vm.runInContext('const originalExamRender=examRender;', context);
const upgrade = read('learning-upgrade.js');
vm.runInContext(upgrade.slice(upgrade.indexOf(' function renderExam(){'), upgrade.indexOf(' window.upgradeOral=')), context);
// Exercise the later module's actual renderer: this previously hid all practical learning.
vm.runInContext('renderExam()', context);
for (const expected of ['Was möchtest du jetzt üben?', 'Sechs ausgearbeitete Planungsbeispiele', 'Entscheidungstraining mit direkter Rückmeldung', 'Fallvorstellung: klar priorisieren', 'Reflexion: begründen']) assert.ok(content.innerHTML.includes(expected), expected);
assert.ok(!content.innerHTML.includes('Keine vorgegebene Fallübung'));
const ids = [...content.innerHTML.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(ids.length, new Set(ids).size, 'Unique form and section IDs');
for (const match of content.innerHTML.matchAll(/practicalJump\('([^']+)'\)/g)) assert.ok(ids.includes(match[1]), match[1]);
nodes.set('practiceFeedback0', {textContent: ''});
vm.runInContext('practicalCheck(0,0)', context);
assert.match(nodes.get('practiceFeedback0').textContent, /^Richtig/);
vm.runInContext('practicalCheck(0,1)', context);
assert.match(nodes.get('practiceFeedback0').textContent, /^Noch einmal/);
nodes.set('care-task0', {value: ''});
vm.runInContext(`careSave('task0','Beobachtung statt Vermutung');careRestore()`, context);
assert.equal(nodes.get('care-task0').value, 'Beobachtung statt Vermutung');
const target = {tagName:'DETAILS',style:{},open:false,scrollIntoView(){},setAttribute(){},focus(){}};
nodes.set('practice-topic-0',target);
vm.runInContext(`practicalJump('practice-topic-0')`,context);
assert.equal(target.open,true);
const practicalAssets = [...read('index.html').matchAll(/src="(\.\/(?:practical-training|learning-upgrade)\.js\?v=\d+)"/g)];
assert.equal(practicalAssets.length, 2);
for(const [, asset] of practicalAssets) {
 assert.ok(read('index.html').includes(asset));assert.ok(read('sw.js').includes(asset));
}
console.log('PASS: practical renderer integration, section navigation, feedback, draft restoration and offline asset versions');
