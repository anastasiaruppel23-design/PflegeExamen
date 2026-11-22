const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = name => fs.readFileSync(path.join(__dirname, '..', name), 'utf8');
const content = {
 innerHTML: '',
 insertAdjacentHTML(position, html) {
  assert.equal(position, 'beforeend');
  this.innerHTML += html;
 }
};
const answer = {addEventListener(event, listener) { this.input = listener; }};
const context = vm.createContext({content, answer});
context.window = context;
const run = code => vm.runInContext(code, context);
run(read('written-settings.js'));
const upgrade = read('learning-upgrade.js');
run(upgrade.slice(upgrade.indexOf(' const writtenCases='), upgrade.indexOf(' function renderExam(){')));
run(`const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
 const $ = selector => selector === '#writtenAnswer' ? answer : null;
 let examFormatSeconds = 0;
 const examFormatTime = () => '00:00';
 const examStartTimer = seconds => { examFormatSeconds = seconds; };
 const renderExam = () => renderWritten(content, '');`);
assert.equal(run('writtenExercises.length'), 8);
assert.equal(run('new Set(writtenExercises.map(cs => cs.setting)).size'), 7);
assert.equal(run('new Set(writtenExercises.map(cs => cs.ageGroup)).size'), 6);
assert.ok(run('writtenExercises.every(cs => cs.tasks.length === 18 && cs.answers.length === 18 && cs.answers.every(Boolean))'));
run('renderExam()');
assert.match(content.innerHTML, /Stationäre Akutversorgung/);
assert.match(content.innerHTML, /Tagespflege/);
run("setWrittenFilter('setting', 'paediatrie'); setWrittenFilter('ageGroup', 'infant'); setWrittenFilter('course', 'acute')");
assert.match(content.innerHTML, /1 passender Fall/);
assert.match(content.innerHTML, /Mila trinkt weniger als sonst/);
assert.doesNotMatch(content.innerHTML, /Leo möchte/);
run("openWrittenExercise('paed-bronchiolitis')");
assert.match(content.innerHTML, /Bronchiolitis im Säuglingsalter · 18 Aufgaben/);
assert.match(content.innerHTML, /Erwartungshorizont und Lösungshinweise anzeigen/);
answer.value = 'Eigene Antwort';
answer.input();
run("setWrittenFilter('ageGroup', 'oldest')");
assert.match(content.innerHTML, /Für diese Kombination gibt es noch keinen Fall/);
run("setWrittenFilter('ageGroup', 'infant'); openWrittenExercise('paed-bronchiolitis')");
assert.equal(answer.value, 'Eigene Antwort');
run("setWrittenFilter('setting', 'tagespflege'); setWrittenFilter('ageGroup', 'oldest'); openWrittenExercise('tagespflege-demenz')");
assert.match(content.innerHTML, /100 Jahre/);
assert.equal(answer.value, '');
console.log('PASS: written settings, age and course filters, eight cases, 18 tasks and answers per case, and draft isolation');
