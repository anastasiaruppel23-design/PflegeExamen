/* Flat miniature illustrations for learning and navigation. */
(function () {
  const icons = {
    plan: '<rect class="base" x="12" y="10" width="26" height="32" rx="6"/><rect class="accent" x="18" y="6" width="14" height="9" rx="4"/><path class="detail" d="m17 24 3 3 5-6m3 5h5M17 33h16"/>',
    hands: '<path class="base" d="M12 27c-2-3 1-6 4-3l3 3V14a3 3 0 0 1 5-2v10-13a3 3 0 0 1 5 0v13-10a3 3 0 0 1 5 0v11-6a3 3 0 0 1 5 0v12c0 9-5 14-12 14-6 0-10-6-15-16Z"/><path class="accent" d="M12 6c-7 8-6 13 0 13s7-5 0-13Z"/>',
    med: '<rect class="base" x="9" y="8" width="28" height="33" rx="7"/><circle class="light" cx="17" cy="17" r="3"/><circle class="light" cx="28" cy="17" r="3"/><circle class="light" cx="17" cy="28" r="3"/><circle class="accent" cx="36" cy="35" r="10"/><path class="detail" d="m32 35 3 3 5-6"/>',
    shot: '<path class="base" d="m14 26 13-13 9 9-13 13h-9z"/><path class="dark" d="m10 38 6-6m13-22 10 10m-5-5 5-5m-5-3 8 8m-19 7 4 4"/><path class="accent" d="m7 33 2 4 4 2-4 2-2 4-2-4-4-2 4-2z"/>',
    move: '<circle class="accent" cx="24" cy="11" r="6"/><path class="base" d="m22 19 8 2 5 11 7 1-1 6-11-1-5-8-3 7-9 6-4-5 8-6 2-10z"/><path class="dark" d="m11 25 8-3m14 1 6 3"/>',
    chair: '<circle class="accent" cx="23" cy="10" r="5"/><path class="dark" d="M20 27a9 9 0 1 0 12 10"/><path class="base" d="m24 17 4 1 2 11h8l5 10-5 3-4-7H25l-4-14z"/>',
    wound: '<rect class="base" x="6" y="16" width="36" height="16" rx="8" transform="rotate(-35 24 24)"/><rect class="accent" x="17" y="17" width="14" height="14" rx="4" transform="rotate(-35 24 24)"/><path class="detail" d="M21 24h6m-3-3v6"/>',
    pulse: '<path class="base" d="M24 41 8 26C-1 16 10 4 18 12l6 5 6-5c8-8 19 4 10 14Z"/><path class="detail" d="M7 24h10l3-6 5 13 4-7h12"/>',
    mouth: '<path class="accent" d="M6 24q9-5 14-10l4 3 4-3q8 6 14 10-9 13-18 13T6 24Z"/><path class="detail" d="M10 24q14 4 28 0"/><path class="base" d="M38 5c-5 6-5 9 0 9s5-3 0-9Z"/>',
    shield: '<path class="base" d="m24 6 16 7v11c0 9-6 14-16 19C14 38 8 33 8 24V13Z"/><circle class="accent" cx="24" cy="23" r="10"/><path class="detail" d="m19 23 4 4 6-8"/>',
    book: '<path class="base" d="M24 13c-7-5-12-5-19-3v26c7-2 13-1 19 3 6-4 12-5 19-3V10c-7-2-12-2-19 3Z"/><path class="detail" d="M24 14v22M11 18q5-1 9 2m-9 5q5-1 9 2"/><path class="accent" d="M32 9h6v15l-3-2-3 2z"/>',
    repeat: '<path class="base" d="M39 22a16 16 0 0 0-27-10l-5 5V9H3v15h15v-5h-6l4-4a11 11 0 0 1 18 7Z"/><path class="accent" d="M9 26a16 16 0 0 0 27 10l5-5v8h4V24H30v5h6l-4 4a11 11 0 0 1-18-7Z"/>',
    chart: '<rect class="light" x="5" y="6" width="38" height="36" rx="7"/><rect class="base" x="10" y="27" width="7" height="10" rx="2"/><rect class="accent" x="20" y="20" width="7" height="17" rx="2"/><rect class="base" x="30" y="12" width="7" height="25" rx="2"/>',
    folder: '<path class="accent" d="M5 13a4 4 0 0 1 4-4h11l5 5h13a4 4 0 0 1 4 4v18H5Z"/><path class="base" d="M7 21h35a3 3 0 0 1 3 4l-4 12a3 3 0 0 1-3 2H7a3 3 0 0 1-3-4l1-12a2 2 0 0 1 2-2Z"/>',
    lungs: '<path class="accent" d="M22 17v10c-2 10-9 14-14 11-8-5-2-21 5-25 4-2 6 1 9 4Z"/><path class="base" d="M26 17v10c2 10 9 14 14 11 8-5 2-21-5-25-4-2-6 1-9 4Z"/><path class="dark" d="M24 7v12m0-3-10 10m10-10 10 10"/>',
    speech: '<path class="accent" d="M16 17h25v20h-5v7l-8-7H16Z"/><path class="base" d="M5 7h30v21H19l-8 7v-7H5Z"/><path class="detail" d="M11 14h18M11 20h13"/>',
    people: '<circle class="base" cx="15" cy="13" r="6"/><circle class="accent" cx="33" cy="13" r="6"/><path class="base" d="M4 39c0-11 4-17 11-17s11 6 11 17Z"/><path class="accent" d="M22 39c0-11 4-17 11-17s11 6 11 17Z"/><path class="detail" d="M24 30v7"/>',
    brain: '<path class="base" d="M24 10C17 3 9 9 9 16c-7 2-8 12-2 15-1 7 9 12 17 7Z"/><path class="accent" d="M24 10c7-7 15-1 15 6 7 2 8 12 2 15 1 7-9 12-17 7Z"/><path class="detail" d="M24 12v25M10 17q6-2 7 4m21-4q-6-2-7 4M9 30q6 2 8-3m22 3q-6 2-8-3"/>'
  };
  window.studyMini = (name, size = '') => '<svg class="study-mini '+size+'" viewBox="0 0 48 48" aria-hidden="true" focusable="false">'+(icons[name] || icons.book)+'</svg>';
  window.studyAreaIcon = name => {
    if (/herz|sepsis|vital/i.test(name)) return 'pulse';
    if (/lunge|atem/i.test(name)) return 'lungs';
    if (/nerv|schlaganfall|psych|delir/i.test(name)) return 'brain';
    if (/bewegung|mobil|sturz/i.test(name)) return 'move';
    if (/medikament|pharma|hormon/i.test(name)) return 'med';
    if (/haut|wund|dekubitus/i.test(name)) return 'wound';
    if (/hygiene/i.test(name)) return 'hands';
    if (/sicherheit|prophylax/i.test(name)) return 'shield';
    if (/prozess|planung|dokument|entlass|prüfung/i.test(name)) return 'plan';
    return 'book';
  };
})();
