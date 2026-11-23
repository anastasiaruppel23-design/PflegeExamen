/* Shared task layout for the written and oral practice routes. */
function examTaskList(key, tasks) {
  return '<ol class="exam-task-list">'+tasks.map((task, i) => {
    const id = key+'-'+(i+1);
    const points = task.points ? '<span class="tag">'+task.points+' Punkte</span>' : '';
    return '<li class="exam-task"><div class="exam-task-heading"><h4 id="'+id+'-title">Aufgabe '+(i+1)+(task.title?' · '+esc(task.title):'')+'</h4>'+points+'</div>'+
      '<p>'+esc(task.prompt)+'</p><textarea id="'+id+'" data-answer="'+id+'" aria-labelledby="'+id+'-title" rows="4" placeholder="Deine Antwort …"></textarea></li>';
  }).join('')+'</ol>';
}

function examPointReview(key, tasks) {
  const values = state.examPointScores?.[key] || {};
  const max = tasks.reduce((sum, task) => sum+task.points, 0);
  const current = Object.values(values).reduce((sum, n) => sum+n, 0);
  return '<p><strong>Maximal erreichbar: '+max+' Punkte</strong></p><details class="exam-rubric" data-score-key="'+key+'"><summary>Erwartungshorizont und Punkte zur Selbstbewertung</summary>'+
    '<p>Vergib dir nach dem Vergleich Punkte für deine Antwort. Die Einteilung gilt für diese Übung.</p><ol>'+tasks.map((task, i) =>
      '<li><h4>Aufgabe '+(i+1)+' · '+task.points+' Punkte</h4>'+task.guide.map(text=>'<p>'+esc(text)+'</p>').join('')+
      '<label for="'+key+'-score-'+i+'">Erreichte Punkte von '+task.points+'</label><input type="number" id="'+key+'-score-'+i+'" data-score-index="'+i+'" min="0" max="'+task.points+'" step="1" value="'+(values[i] ?? '')+'"></li>'
    ).join('')+'</ol><p role="status">Deine Punkte: <strong><output data-score-total>'+current+'</output> / '+max+'</strong></p></details>';
}

document.addEventListener('input', event => {
  const field = event.target;
  if (!field.matches('[data-score-index]')) return;
  const review = field.closest('[data-score-key]');
  const scores = ((state.examPointScores ??= {})[review.dataset.scoreKey] ??= {});
  if (field.value === '') delete scores[field.dataset.scoreIndex];
  else {
    const points = Math.max(0, Math.min(Number(field.max), Math.trunc(field.valueAsNumber)));
    if (!Number.isFinite(points)) return;
    scores[field.dataset.scoreIndex] = points;
    if (points !== field.valueAsNumber) field.value = points;
  }
  review.querySelector('[data-score-total]').value = Object.values(scores).reduce((sum, n) => sum+n, 0);
  save();
});
