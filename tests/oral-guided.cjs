const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
let now = 0;
let nextId = 0;
const pending = new Map();
const context = vm.createContext({
 document: {addEventListener() {}},
 esc: value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;'),
 Date: {now: () => now},
 setTimeout(callback) { const id = ++nextId; pending.set(id, callback); return id; },
 clearTimeout: id => pending.delete(id)
});
vm.runInContext(read('exam-answers.js'), context);
vm.runInContext(read('oral-guided.js'), context);
function tickAt(time) {
 now = time;
 const callbacks = [...pending.values()];
 pending.clear();
 callbacks.forEach(callback => callback());
}
function control() {
 const events = {};
 return {
  value: '', attrs: {},
  addEventListener(event, handler) { events[event] = handler; },
  fire(event) { events[event](); },
  setAttribute(name, value) { this.attrs[name] = value; }
 };
}
const exam = read('exam-practice.js');
for (const key of ['sturz', 'samira', 'brandt']) {
 const html = vm.runInContext(`guidedOralHtml('${key}')`, context);
 assert.equal((html.match(/data-clue=/g) || []).length, 4);
 assert.equal((html.match(/data-model-choice=/g) || []).length, 2);
 assert.equal((html.match(/type="checkbox"/g) || []).length, 5);
 assert.match(html, /Nachfrage der Prüferin öffnen/);
 assert.match(html, /90 Sekunden starten/);
}
assert.match(exam, /guidedOralHtml\(oralCaseKey\)/);
assert.match(exam, /bindGuidedOral\(oralCaseKey,/);

const select = control(), check = control(), feedback = {};
const block = {
 dataset: {clue: '0'},
 querySelector: selector => ({select, '[data-check]': check, '[role="status"]': feedback})[selector]
};
const start = control(), stop = control(), clock = {}, status = {}, modelFeedback = {};
const modelChoices = [control(), control()];
context.section = {
 isConnected: true,
 querySelectorAll: selector => selector === '[data-clue]' ? [block] : modelChoices,
 querySelector: selector => ({
  '[data-speaking-start]': start, '[data-speaking-stop]': stop,
  '[data-speaking-clock]': clock, '[data-speaking-status]': status, '[data-model-feedback]': modelFeedback
 })[selector]
};
vm.runInContext("bindGuidedOral('sturz', section)", context);
check.fire('click');
assert.match(feedback.textContent, /Wähle zuerst/);
select.value = 'risk';
check.fire('click');
assert.match(feedback.textContent, /Aktuelles Problem/);
select.value = 'problem';
select.fire('change');
assert.equal(feedback.textContent, '');
check.fire('click');
assert.match(feedback.textContent, /^Richtig/);
modelChoices[0].fire('click');
assert.match(modelFeedback.textContent, /andere Frage/);
modelChoices[1].fire('click');
assert.match(modelFeedback.textContent, /Struktur.*Prozess.*Ergebnis/);
assert.equal(modelChoices[0].attrs['aria-pressed'], 'false');
assert.equal(modelChoices[1].attrs['aria-pressed'], 'true');
start.fire('click');
assert.equal(clock.textContent, '1:30');
tickAt(45000);
assert.equal(clock.textContent, '0:45');
tickAt(90000);
assert.equal(clock.textContent, '0:00');
assert.match(status.textContent, /Zeit vorbei/);
start.fire('click');
stop.fire('click');
assert.equal(pending.size, 0);
assert.match(status.textContent, /Übung beendet/);
start.fire('click');
context.section.isConnected = false;
tickAt(91000);
assert.equal(pending.size, 0);
console.log('PASS: three oral cases, classification feedback, model comparison and countdown lifecycle');
