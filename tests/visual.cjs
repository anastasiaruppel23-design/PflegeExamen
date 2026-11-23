const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=process.env.SCREENSHOT_DIR||path.join(root,'test-results');fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{const u=new URL(req.url,'http://localhost'),f=path.resolve(root,'.'+(u.pathname==='/'?'/index.html':decodeURIComponent(u.pathname)));if(!f.startsWith(root+path.sep)){res.writeHead(403);return res.end()}fs.readFile(f,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.webp':'image/webp','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'})[path.extname(f)]||'text/html');res.end(b)})});
function mockSupabase() {
  const session = {user: {id: 'browser-test', email: 'learner@example.test'}};
  const key = 'pflegefokus-browser-test-session';
  let onAuthChange;
  const forum = {
    forum_moderators: [],
    forum_profiles: [],
    forum_topics: [{
      id: 'peer-topic', author_id: 'another-learner', author_nickname: 'PflegePeer',
      title: 'Frage aus der Lerngruppe', body: 'Wie lernt ihr für die Prüfung?',
      category: 'pruefungen', hidden: false, created_at: '2026-11-22T15:00:00Z'
    }],
    forum_replies: [],
    forum_reports: []
  };
  function mockForumTable(table) {
    const rows = forum[table], filters = [];
    let result = rows;
    function createEntry(values) {
      const entry = {
        id: table + rows.length, author_id: session.user.id,
        author_nickname: forum.forum_profiles[0]?.nickname, hidden: false,
        created_at: new Date().toISOString(), ...values
      };
      rows.push(entry);
      return entry;
    }
    const query = {
      select() { return query; },
      eq(key, value) { filters.push(row => row[key] === value); return query; },
      order() { return query; },
      range() { return query; },
      async maybeSingle() { return {data: result.find(row => filters.every(match => match(row))) || null}; },
      single() { return query.maybeSingle(); },
      then(resolve) { return resolve({data: result.filter(row => filters.every(match => match(row)))}); },
      insert(values) { result = [createEntry(values)]; return query; },
      async upsert(values) { rows.splice(0, rows.length, values); return {}; }
    };
    return query;
  }
  const client = {
    auth: {
      onAuthStateChange(callback) {
        onAuthChange = callback;
        queueMicrotask(() => callback('INITIAL_SESSION', localStorage.getItem(key) ? session : null));
      },
      async signUp() { return {data: {session: null}}; },
      async signInWithPassword() {
        localStorage.setItem(key, '1');
        onAuthChange('SIGNED_IN', session);
        return {data: {session}};
      },
      async signOut() {
        localStorage.removeItem(key);
        onAuthChange('SIGNED_OUT', null);
        return {};
      }
    },
    async rpc() { return {data: [{visits: 1, registrations: 1}]}; },
    from(table) {
      if (table in forum) return mockForumTable(table);
      return {
        select: () => ({eq: () => ({maybeSingle: async () => ({data: null})})}),
        upsert: async row => { window.lastSavedStudyProgress = row.data; return {}; }
      };
    }
  };
  Object.defineProperty(window, 'supabase', {
    get: () => ({createClient: () => client}),
    set: () => {}
  });
}

async function checkLearningAccess(page) {
  const base = 'http://127.0.0.1:8137';
  await page.goto(base);
  await page.waitForFunction(() => cloudReady);
  assert.equal(await page.locator('#menuToggle').isVisible(), false);
  assert.equal(await page.getByRole('button', {name: 'Jetzt lernen', exact: true}).count(), 0);
  await page.getByRole('button', {name: 'Registrieren', exact: true}).click();
  await page.locator('#accountEmail').fill('learner@example.test');
  await page.locator('#accountPassword').fill('example-test-password');
  await page.getByRole('button', {name: 'Registrieren', exact: true}).click();
  await page.getByText(/Schau in deinem Postfach/).waitFor();
  assert.equal(await page.locator('#menuToggle').isVisible(), false);

  await page.goto(base + '/exam-practice.html');
  await page.getByRole('heading', {name: 'Konto erstellen'}).waitFor();
  assert.equal(await page.getByRole('heading', {name: 'Prüfungsformate üben'}).count(), 0);
  await page.getByRole('button', {name: 'Zur Anmeldung'}).click();
  await page.locator('#accountEmail').fill('learner@example.test');
  await page.locator('#accountPassword').fill('example-test-password');
  await page.getByRole('button', {name: 'Anmelden', exact: true}).click();
  await page.getByRole('heading', {name: 'Prüfungsformate üben'}).waitFor();
  assert.equal(await page.locator('#menuToggle').isVisible(), true);
}

async function checkCurriculumMenu(page) {
  await page.evaluate(() => go("start"));
  const drawer = page.locator('#menuDrawer');
  const exams = drawer.locator('#menu-exam-links');
  for (const [label, route] of [
    ['Schriftliche Prüfung', 'schriftlich'],
    ['Praktische Prüfung', 'praktisch'],
    ['Mündliche Prüfung', 'muendlich']
  ]) {
    await page.locator('#menuToggle').click();
    assert.equal(await drawer.getByText('Prüfungen', {exact: true}).count(), 0);
    assert.equal(await exams.getByRole('button').count(), 3);
    await exams.getByRole('button', {name: label, exact: true}).click();
    assert.equal(await drawer.isVisible(), false);
    assert.equal(await page.evaluate(() => tab), route);
  }
  await page.locator('#menuToggle').click();
  assert.equal(await exams.locator('[aria-current="page"]').innerText(), 'Mündliche Prüfung');
  await drawer.getByText('Lernen', {exact: true}).click();
  await drawer.getByRole('button', {name: 'Ausbildungsrahmen', exact: true}).click();
  await page.getByRole('heading', {name: 'Ausbildungsrahmen Pflegefachkraft'}).waitFor();
  assert.equal(await page.locator('[id^="handlungsfeld-"]').count(), 26);
  assert.equal(await page.getByRole('button', {name: /^Vertiefen:/, includeHidden: true}).count(), 26);
  const field = page.locator('#handlungsfeld-4');
  await field.locator(':scope > summary').click();
  await field.getByText('Lösungsimpuls').click();
  assert.equal(await field.getByText(/Frage nach Verlauf und Beobachtungen/).isVisible(), true);
  await field.getByRole('button', {name: /Vertiefen: Friedemann/}).click();
  assert.equal(await page.evaluate(() => tab), 'themen');
}

async function checkConnectedLearning(page) {
  await page.evaluate(() => go('anatomie'));
  const anatomy = page.getByRole('navigation', {name: 'Organsysteme'});
  assert.equal(await anatomy.getByRole('button').count(), 11);
  await anatomy.getByRole('button', {name: 'Herz und Kreislauf', exact: true}).click();
  const heart = page.locator('#organ-heart');
  assert.equal(await heart.getByText(/Der Sinusknoten gibt/).isVisible(), true);
  await heart.getByText('Musterantwort öffnen').click();
  assert.equal(await heart.getByText(/Wenn die linke Kammer/).isVisible(), true);
  await heart.getByRole('button', {name: 'Herzinsuffizienz', exact: true}).click();
  await page.getByRole('heading', {name: 'Herzinsuffizienz', exact: true}).waitFor();
  await page.getByRole('button', {name: '← Zurück zu Herz und Kreislauf', exact: true}).click();
  assert.equal(await heart.getByText(/Wenn die linke Kammer/).isVisible(), true);

  await page.evaluate(() => go('themen'));
  await page.locator('#libraryCategory').selectOption('Anatomie');
  assert.equal(await page.getByRole('button', {name: 'Zu den 11 Anatomie-Modulen'}).isVisible(), true);
  await page.locator('#libraryCategory').selectOption('Krankheitsbilder');
  await page.locator('#search').fill('Herzinsuffizienz');
  await page.locator('.topic-tile').filter({hasText: 'Herzinsuffizienz'}).first().click();
  await page.getByRole('button', {name: '← Zurück zur Wissensbibliothek', exact: true}).click();
  assert.equal(await page.locator('#libraryCategory').inputValue(), 'Krankheitsbilder');
  assert.equal(await page.locator('#search').inputValue(), 'Herzinsuffizienz');

  await page.evaluate(() => openLibraryTopic(topics.findIndex(([name]) => name === 'DNQP – Sturzprophylaxe')));
  await page.getByRole('button', {name: /Mündlichen Sturzfall bearbeiten/}).click();
  assert.equal(await page.evaluate(() => oralCaseKey), 'sturz');
  await page.evaluate(() => openAnatomyModule('heart'));
  assert.equal(await heart.locator('.anatomy-detail').evaluate(node => node.open), true);

  await page.evaluate(() => go('standards'));
  const firstStandard = page.locator('#learning-standard-0');
  await firstStandard.getByRole('button', {name: 'DNQP – Dekubitusprophylaxe', exact: true}).click();
  await page.getByRole('button', {name: 'Dekubitusprophylaxe in der Pflege', exact: true}).click();
  assert.equal(await firstStandard.getByRole('heading').isVisible(), true);
}

async function checkNavigationTargets(page) {
  const menu = await page.locator('#menuToggle').boundingBox();
  const brand = await page.locator('.app-bar .brand').boundingBox();
  const profile = await page.locator('.account-toggle').boundingBox();
  assert.ok(menu.height >= 54 && profile.height >= 54, 'large header controls');
  assert.ok(menu.x + menu.width <= brand.x, 'menu does not cover brand');
  assert.ok(brand.x + brand.width <= profile.x, 'profile does not cover brand');
  assert.equal(await page.locator('.account-toggle').innerText(), 'Profil');
}

async function checkProfilePicture(page) {
  const profileButton = page.getByRole('button', {name: 'Profil und Konto'});
  await profileButton.click();
  await page.getByRole('heading', {name: 'Dein Profil'}).waitFor();
  const ambulant = page.getByRole('button', {name: 'Ambulante Pflege', exact: true});
  const acute = page.getByRole('button', {name: 'Akutversorgung im Krankenhaus', exact: true});
  assert.equal(await page.locator('[data-profile-setting]').count(), 7);
  await ambulant.click();
  assert.equal(await ambulant.getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('#headerProfile [data-setting-avatar="ambulant"]').count(), 1);
  assert.equal(await page.locator('#headerProfile .setting-avatar-art').evaluate(node =>
    getComputedStyle(node).backgroundImage.includes('setting-avatare.webp')), true);
  const rehab = page.getByRole('button', {name: 'Rehabilitation', exact: true});
  await rehab.click();
  assert.equal(await page.locator('#headerProfile [data-setting-avatar="reha"]').evaluate(node =>
    getComputedStyle(node).backgroundImage.includes('setting-avatare-ergaenzung.webp')), true);
  assert.equal(await page.evaluate(async () => {
    const assets = ['./assets/setting-avatare.webp', './assets/setting-avatare-ergaenzung.webp'];
    const responses = await Promise.all(assets.map(asset => fetch(asset)));
    return responses.every(response => response.ok && response.headers.get('Content-Type') === 'image/webp');
  }), true);
  await page.getByText('Weitere Avatare', {exact: true}).click();
  const heart = page.getByRole('button', {name: 'Herz', exact: true});
  await heart.click();
  assert.equal(await heart.getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('#headerProfile .study-mini').count(), 1);
  await page.waitForFunction(() => window.lastSavedStudyProgress?.profileAppearance?.avatar === 'pulse');

  const file = page.locator('#profilePhoto');
  await file.setInputFiles({name: 'test.svg', mimeType: 'image/svg+xml', buffer: Buffer.from('<svg/>')});
  await page.getByText(/JPG-, PNG- oder WebP-Format/).waitFor();
  assert.equal(await heart.getAttribute('aria-pressed'), 'true');
  await file.setInputFiles(path.join(root, 'assets/heart-study.webp'));
  await page.getByText('Profilfoto übernommen.').waitFor();
  await page.waitForFunction(() => {
    const photo = document.querySelector('#headerProfile img');
    return photo?.naturalWidth === 288 && photo.naturalHeight === 288;
  });
  await acute.click();
  assert.equal(await acute.getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('#headerProfile img').count(), 1);
  await page.waitForFunction(() => {
    const profile = window.lastSavedStudyProgress?.profileAppearance;
    return profile?.setting === 'akut' && profile.src?.startsWith('data:image/jpeg;base64,');
  });
  await page.reload();
  await page.waitForFunction(() => hasLearningAccess());
  assert.equal(await page.locator('#headerProfile img').count(), 1);
  await profileButton.click();
  assert.equal(await acute.getAttribute('aria-pressed'), 'true');
  await page.getByRole('button', {name: 'Passenden Avatar verwenden'}).click();
  assert.equal(await page.locator('#headerProfile [data-setting-avatar="akut"]').count(), 1);
  await page.getByRole('button', {name: 'Profilbild entfernen'}).click();
  assert.equal(await page.locator('#headerProfile [data-setting-avatar]').count(), 0);
  assert.equal(await acute.getAttribute('aria-pressed'), 'true');
  await page.getByRole('button', {name: 'Einsatzbereich entfernen'}).click();
  await page.waitForFunction(() => window.lastSavedStudyProgress?.profileAppearance?.setting === null);
  assert.equal(await acute.getAttribute('aria-pressed'), 'false');
}

async function checkForum(page) {
  await page.locator('#menuToggle').click();
  const entry = page.locator('#menu-austausch');
  assert.equal(await entry.evaluate(node => node.nextElementSibling.id), 'menu-organisation');
  await entry.getByRole('button', {name: 'Austausch'}).click();
  const forum = page.locator('.forum-page');
  for (const title of ['Prüfung & Lernfragen', 'Praxis & Fallbesprechung', 'Lernpartner finden', 'Erfahrungen & Gefühle']) {
    await forum.getByRole('button', {name: new RegExp(title)}).waitFor();
  }
  await forum.getByRole('button', {name: 'Nickname im Profil eintragen'}).click();
  const profile = page.locator('#forumIdentity');
  await profile.getByLabel('Nickname', {exact: true}).fill('Lernfüchsin');
  await profile.getByLabel('PLZ (freiwillig)', {exact: true}).fill('01234');
  await profile.getByRole('button', {name: 'Speichern', exact: true}).click();
  await profile.getByText('Dein Profil für den Austausch wurde gespeichert.').waitFor();

  await page.evaluate(() => go('austausch'));
  await forum.getByRole('button', {name: /Praxis & Fallbesprechung/}).click();
  await forum.getByText('Beitrag schreiben', {exact: true}).click();
  await forum.getByLabel('Titel', {exact: true}).fill('Übungsfall zur Übergabe');
  await forum.getByLabel('Einsatzbereich des Falls').selectOption('akut');
  await forum.getByLabel('Dein Beitrag', {exact: true}).fill('Fiktive Übergabe <b>im Frühdienst</b>.');
  await forum.getByRole('button', {name: 'Beitrag veröffentlichen'}).click();
  await forum.getByRole('heading', {name: 'Übungsfall zur Übergabe'}).waitFor();
  assert.equal(await forum.locator('.forum-detail .forum-text').innerText(), 'Fiktive Übergabe <b>im Frühdienst</b>.');
  assert.equal(await forum.getByText('01234').count(), 0);
  await forum.getByText('Lernfüchsin', {exact: true}).waitFor();
  await forum.getByLabel('Deine Antwort').fill('Ich würde mit der aktuellen Situation beginnen.');
  await forum.getByRole('button', {name: 'Antwort veröffentlichen'}).click();
  await forum.getByText('Ich würde mit der aktuellen Situation beginnen.').waitFor();

  await forum.getByRole('button', {name: /Prüfung & Lernfragen/}).click();
  await forum.getByRole('button', {name: 'Frage aus der Lerngruppe'}).click();
  await forum.getByText('Melden', {exact: true}).click();
  await forum.getByLabel('Grund').selectOption('sonstiges');
  await forum.getByRole('button', {name: 'Meldung senden'}).click();
  await forum.getByText('Danke. Deine Meldung wurde an die Moderation gesendet.').waitFor();
  assert.equal(await forum.getByText('Moderation und PLZ-Übersicht').count(), 0);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
}

async function checkModelCardLayout(page) {
  await page.evaluate(() => go('modelle'));
  const top = page.locator('.models-view .learning-hero');
  const cards = page.locator('.model-grid .model-card');
  const isWhite = element => getComputedStyle(element).color === 'rgb(255, 255, 255)';
  assert.equal(await top.getByRole('heading').evaluate(isWhite), true, 'white title in the dark turquoise header');
  assert.equal(await top.locator('p').evaluate(isWhite), true, 'white introduction in the dark turquoise header');
  assert.equal(await cards.first().getByRole('heading').evaluate(isWhite), true, 'white model title');
  assert.equal(await cards.count(), 29);
  const first = await cards.nth(0).boundingBox();
  const second = await cards.nth(1).boundingBox();
  assert.ok(second.y - first.y - first.height >= 24, 'clear vertical gap between mobile model cards');
  const search = page.getByRole('searchbox', {name: 'Modell, Begriff oder Fallthema suchen'});
  await search.fill('Roper–Logan–Tierney');
  assert.ok(await cards.count() < 29, 'search filters the model cards');
  const roper = cards.filter({has: page.getByRole('heading', {name: 'Roper–Logan–Tierney', exact: true})});
  assert.deepEqual(await roper.locator('dt').allTextContents(), ['Grundgedanke','Schlüsselbegriffe','Prüfungsbezug']);
  await roper.locator('.model-application > summary').click();
  assert.equal(await roper.getByText('Mini-Fall', {exact: true}).isVisible(), true);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await roper.screenshot({path:path.join(out, 'model-card-390.png')});
}

async function checkTrainingRefresh(page) {
  await page.evaluate(() => go('praktisch'));
  const medication = page.locator('.practice-tile').filter({hasText: 'Medikamentensicherheit'});
  assert.equal(await medication.locator('.study-mini').count(), 1);
  assert.equal(await medication.evaluate(tile => tile.scrollWidth > tile.clientWidth), false);

  await page.evaluate(() => go('praxischallenges'));
  assert.equal(await page.locator('.challenge-tile svg').count(), 8);
  await page.getByRole('button', {name: 'Transfer vom Bett in den Rollstuhl', exact: true}).click();
  assert.match(await page.locator('#activeChallenge').innerText(), /Transfer vom Bett in den Rollstuhl/);

  await page.evaluate(() => go('schriftlich'));
  await page.locator('[data-case]').first().click();
  const field = page.locator('.exam-task textarea').first();
  const draft = 'Eigene Einschätzung zum Lernfall.';
  await field.fill(draft);
  assert.match(await page.locator('.exam-task').first().innerText(), /Punkte/);
  const firstTask = page.locator('.exam-task').first();
  assert.equal(await firstTask.getByRole('button', {name: 'Aufnehmen & diktieren'}).isVisible(), true);
  await page.context().grantPermissions(['microphone']);
  await firstTask.getByRole('button', {name: 'Nur aufnehmen', exact: true}).click();
  try {
    await firstTask.getByText('Aufnahme läuft. Sprich jetzt.', {exact: true}).waitFor({timeout:10000});
  } catch (error) {
    const status = await firstTask.locator('.answer-status').innerText();
    throw new Error('Mikrofonstatus im Browsertest: '+status, {cause:error});
  }
  await firstTask.getByRole('button', {name: 'Beenden', exact: true}).click();
  const playback = firstTask.getByRole('button', {name: 'Meine Antwort anhören', exact: true});
  await playback.waitFor();
  await playback.click();
  assert.ok(await firstTask.locator('audio').evaluate(async audio => {
    const response = await fetch(audio.src);
    return (await response.blob()).size > 0;
  }));
  await page.reload();
  await page.waitForFunction(() => hasLearningAccess());
  assert.equal(await field.inputValue(), draft);
  await playback.waitFor();

  await page.evaluate(() => go('notfallsimulator'));
  await page.locator('#emergencyCase').selectOption({label: 'Plötzliche Sprachstörung beim Frühstück'});
  await page.getByRole('button', {name: /Erst den Blutzucker messen/}).click();
  assert.match(await page.locator('.learn-box').innerText(), /verzögert sich/);

  await page.evaluate(() => go('themenquiz'));
  await page.getByRole('button', {name: 'Prüfungstraining', exact: true}).click();
  await page.getByRole('button', {name: /Quiz starten/}).click();
  await page.locator('.option').first().click();
  await page.getByRole('button', {name: 'Antwort prüfen', exact: true}).click();
  assert.ok(await page.locator('.quiz-explanations li').count() >= 3);
}

async function run(){await new Promise(r=>server.listen(8137,'127.0.0.1',r));const browser=await chromium.launch({headless:true,args:['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream'],...(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:process.platform==='win32'?{channel:'msedge'}:{})});try{for(const width of [320,390,1280]){const context=await browser.newContext({viewport:{width,height:950}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await context.addInitScript(mockSupabase);await page.route('https://**/*',r=>r.abort());await checkLearningAccess(page);await checkNavigationTargets(page);if(width===390)await checkProfilePicture(page);await checkCurriculumMenu(page);await checkConnectedLearning(page);if(width===390){await checkModelCardLayout(page);await checkTrainingRefresh(page);await checkForum(page);}await page.evaluate(()=>go('themen'));await page.locator('.library-cover img').evaluate(img=>img.decode());await page.screenshot({path:path.join(out,`gallery-${width}.png`),fullPage:false});const topicCount=await page.evaluate(()=>topics.length);assert.equal(await page.locator('.topic-tile').count(),topicCount);await page.locator('#libraryCategory').selectOption('Medikamente');assert.equal(await page.locator('#topics .topic-tile').count(),await page.evaluate(()=>topics.filter(topic=>studyCategoryMatches(topic,'Medikamente')).length));await page.locator('#search').fill('zzzzz');assert.equal(await page.locator('.empty').count(),1);await page.evaluate(()=>go('themen'));
// Cards with a knowledge target must link to it. Standalone cards must render and flip.
const cardCount=await page.evaluate(()=>cards.length);
for(let card=0;card<cardCount;card++){
 await page.evaluate(card=>{ci=card;flipped=false;go('karten')},card);
 const target=await page.evaluate(()=>topics[topicForCard(ci)]?.[0].split(' – ')[0]);
 if(!target){
  await page.locator('.illustrated-flash').click();
  assert.equal(await page.locator('.illustrated-flash.answer').count(),1);
  assert.equal(await page.getByRole('button',{name:'Wissensbibliothek öffnen ↗',exact:true}).count(),1);
  continue;
 }
 await page.getByRole('button',{name:'Zusammenhänge verstehen ↗',exact:true}).click();
 assert.equal(await page.locator('.poster-header h1').innerText(),target);
}
await page.evaluate(()=>openLibraryTopic(2));
const term=page.getByRole('button',{name:'Kohärenzgefühl: Begriff erklären',exact:true}).first();
await term.focus();await page.keyboard.press('Enter');
assert.equal(await page.locator('#studyGlossaryDialog').evaluate(d=>d.open),true);
assert.match(await page.locator('#studyGlossaryDialog').innerText(),/handhabbar/);
await page.keyboard.press('Escape');assert.equal(await term.evaluate(el=>el===document.activeElement),true);
await page.getByRole('button',{name:'Fachbegriffe nachschlagen',exact:true}).click();
await page.locator('#glossarySearch').fill('Compliance');
assert.equal(await page.locator('.glossary-entry').count(),1);
await page.locator('.glossary-entry').click();
await page.screenshot({path:path.join(out,`glossary-${width}.png`),fullPage:false});
assert.equal(await page.locator('#studyGlossaryDialog').evaluate(d=>d.scrollWidth>d.clientWidth),false);
await page.getByRole('button',{name:'Passendes Wissen öffnen ↗',exact:true}).click();
assert.match(await page.locator('.poster-header h1').innerText(),/Pflegeberatung/);
await page.evaluate(()=>go('quiz'));assert.equal(await page.locator('.glossary-term,.glossary-access').count(),0);
for(let i=0;i<topicCount;i++){await page.evaluate(i=>openLibraryTopic(i),i);assert.equal(await page.locator('.learning-poster').count(),1);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`overflow ${width} topic ${i}`)}
await page.evaluate(()=>openLibraryTopic(36));await page.locator('.poster-illustration img').evaluate(img=>img.decode());await page.screenshot({path:path.join(out,`lesson-${width}.png`),fullPage:true});await page.evaluate(()=>openLibraryTopic(1));await page.screenshot({path:path.join(out,`model-${width}.png`),fullPage:true});await page.evaluate(()=>openLibraryTopic(36));await page.getByRole('button',{name:'Transferfrage lösen →',exact:true}).click();await page.getByRole('button',{name:/Hilfe alarmieren/}).click();await page.getByRole('button',{name:'Antwort prüfen',exact:true}).click();assert.equal(await page.locator('.good').count(),1);await page.getByRole('button',{name:'Zum Wissen',exact:true}).click();await page.getByRole('button',{name:'Passenden Pflegefall bearbeiten →',exact:true}).click();await page.locator('#caseDetail').getByText('Lösungsansätze und Begründungen', {exact: true}).click();assert.equal(await page.locator('#caseDetail .poster-box').count(),6);await page.locator('#caseDetail').getByRole('button',{name:'Lernkarte →',exact:true}).click();await page.locator('.illustrated-flash').focus();await page.keyboard.press('Space');assert.equal(await page.locator('.illustrated-flash.answer').count(),1);await page.screenshot({path:path.join(out,`card-${width}.png`),fullPage:true});await page.getByRole('button',{name:'Zusammenhänge verstehen ↗',exact:true}).click();await page.getByRole('button',{name:'✓ Als gelernt markieren',exact:true}).click();assert.equal(await page.evaluate(()=>state.done[36]),true);await page.reload();await page.waitForFunction(()=>hasLearningAccess());assert.equal(await page.evaluate(()=>state.done[36]),true);
for(const area of ['quiz','kompetenz','faelle','falltraining','pruefung','cockpit','plan','timer','quellen','einstellungen','konto']){await page.evaluate(area=>go(area),area);assert.ok((await page.locator('#content').innerText()).length>30,area)}
await page.evaluate(async()=>{await navigator.serviceWorker.ready});await page.reload();await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await context.setOffline(true);await page.reload();await page.waitForFunction(()=>hasLearningAccess());await page.evaluate(()=>openLibraryTopic(36));await page.locator('.poster-illustration img').evaluate(img=>img.decode());await page.getByRole('button',{name:'Fachbegriffe nachschlagen',exact:true}).click();await page.locator('.glossary-entry').first().click();assert.match(await page.locator('#studyGlossaryDialog').innerText(),/Antonovsky/);await page.keyboard.press('Escape');await page.getByRole('button',{name:'Profil und Konto',exact:true}).click();await page.getByRole('button',{name:'Abmelden',exact:true}).click();await page.getByRole('button',{name:'Registrieren',exact:true}).waitFor();assert.equal(await page.locator('#menuToggle').isVisible(),false);assert.deepEqual(errors,[]);console.log(`PASS ${width}px: sign-up, sign-in, sign-out, ${topicCount} lessons, filters, keyboard, persistence and offline art`);await context.close()}}finally{await browser.close()}}
run().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>server.close());
