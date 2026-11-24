const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=process.env.SCREENSHOT_DIR||path.join(root,'test-results');fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{const u=new URL(req.url,'http://localhost'),f=path.resolve(root,'.'+(u.pathname==='/'?'/index.html':decodeURIComponent(u.pathname)));if(!f.startsWith(root+path.sep)){res.writeHead(403);return res.end()}fs.readFile(f,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.webp':'image/webp','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'})[path.extname(f)]||'text/html');res.end(b)})});
function mockSupabase() {
  const session = {user: {id: 'browser-test', email: 'learner@example.test'}};
  const key = 'pflegefokus-browser-test-session';
  let onAuthChange;
  const owner = session.user.id;
  const peer = '209a987f-59a0-4084-a023-8d53dbfd1887';
  const forum = {
    forum_moderators: [],
    forum_profiles: [],
    forum_members: [{user_id: peer, nickname: 'PflegePeer'}],
    forum_topics: [{
      id: 'peer-topic', author_id: peer, author_nickname: 'PflegePeer',
      title: 'Frage aus der Lerngruppe', body: 'Wie lernt ihr für die Prüfung?',
      category: 'pruefungen', hidden: false, created_at: '2026-11-22T15:00:00Z'
    }],
    forum_replies: [],
    forum_topic_reads: [],
    forum_reports: [],
    forum_messages: []
  };
  window.seedForumInbox = () => forum.forum_messages.push({
    id: 'mock-mail', author_id: peer, recipient_id: owner, body: 'Hast du Lust, gemeinsam zu üben?',
    read_at: null, created_at: '2026-11-22T15:00:00Z'
  });
  function overview() {
    return forum.forum_topics.map(topic => {
      const replies = forum.forum_replies.filter(row => row.topic_id === topic.id);
      const activity = [topic, ...replies];
      const seen = forum.forum_topic_reads.find(row => row.topic_id === topic.id)?.seen_at || '';
      return {...topic, latest_at: activity.map(row => row.created_at).sort().at(-1),
        reply_count: replies.length, unread: activity.some(row => row.author_id !== owner && row.created_at > seen)};
    });
  }
  function mockForumTable(table) {
    let rows = forum[table];
    if (table === 'forum_topic_overview') rows = overview();
    if (table === 'forum_unread_counts') {
      const unread = overview().filter(row => row.unread);
      rows = [...new Set(unread.map(row => row.category))].map(category => ({
        category, unread_count: unread.filter(row => row.category === category).length
      }));
    }
    if (table === 'forum_conversations') {
      const messages = forum.forum_messages;
      const latest = messages.at(-1);
      rows = latest ? [{partner_id: peer, nickname: 'PflegePeer', latest_at: latest.created_at,
        preview: latest.body, sent: latest.author_id === owner,
        unread_count: messages.filter(row => row.recipient_id === owner && !row.read_at).length}] : [];
    }
    const filters = [];
    let result = rows;
    const filtered = () => result.filter(row => filters.every(match => match(row)));
    let updateValues;
    let head = false;
    function createEntry(values) {
      const entry = {
        id: table + rows.length, author_id: owner,
        author_nickname: forum.forum_profiles[0]?.nickname, hidden: false, read_at: null,
        created_at: new Date().toISOString(), ...values
      };
      rows.push(entry);
      return entry;
    }
    const query = {
      select(_, options) { head = Boolean(options?.head); return query; },
      eq(key, value) { filters.push(row => row[key] === value); return query; },
      neq(key, value) { filters.push(row => row[key] !== value); return query; },
      in(key, values) { filters.push(row => values.includes(row[key])); return query; },
      is(key, value) { return query.eq(key, value); },
      ilike(key, value) {
        filters.push(row => row[key].toLowerCase().startsWith(value.slice(0,-1).toLowerCase()));
        return query;
      },
      order() { return query; },
      range() { return query; },
      limit() { return query; },
      or() { return query; },
      async maybeSingle() { return {data: filtered()[0] || null}; },
      single() { return query.maybeSingle(); },
      then(resolve) {
        const data = filtered();
        if (updateValues) for (const row of data) Object.assign(row,updateValues);
        return resolve({data: head ? null : data,count: head ? data.length : null});
      },
      insert(values) { result = [createEntry(values)]; return query; },
      update(values) { updateValues = values; return query; },
      async upsert(values) {
        const key = table === 'forum_topic_reads' ? 'topic_id' : 'user_id';
        const found = rows.find(row => row[key] === values[key]);
        if (found) Object.assign(found,values);
        else rows.push(values);
        return {};
      }
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
      if (table.startsWith('forum_')) return mockForumTable(table);
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

function mockSpeechRecognition() {
  window.SpeechRecognition = class {
    start() { queueMicrotask(() => this.onstart()); }
    stop() {
      queueMicrotask(() => {
        const transcript = window.testDictationText || 'Ich prüfe die Ressourcen.';
        this.onresult({resultIndex: 0, results: [{0: {transcript}, isFinal: true}]});
        this.onend();
      });
    }
  };
}

async function dictateIntoPreview(scope) {
  await scope.getByRole('button', {name: 'Diktieren', exact: true}).click();
  await scope.getByText('Diktat läuft. Sprich jetzt.', {exact: true}).waitFor();
  await scope.getByRole('button', {name: 'Beenden', exact: true}).click();
  const preview = scope.getByLabel('Diktatvorschau');
  await preview.waitFor();
  return preview;
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
  await page.getByRole('heading', {name: 'Dein Profil', exact: true}).waitFor();
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
  for (const title of ['Prüfung & Lernfragen', 'Praxis & Fallbesprechung', 'Lernpartner finden', 'Erfahrungen & Gefühle', 'Feedback & Wunschthemen']) {
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
  const reply = forum.locator('form.forum-reply');
  await page.evaluate(() => { window.testDictationText = 'Ich würde mit der aktuellen Situation beginnen.'; });
  await dictateIntoPreview(reply);
  assert.equal(await reply.getByLabel('Deine Antwort').inputValue(), '');
  await reply.getByRole('button', {name: 'Übernehmen', exact: true}).click();
  await reply.getByRole('button', {name: 'Antwort veröffentlichen'}).click();
  const response = forum.locator('article').filter({hasText: 'Ich würde mit der aktuellen Situation beginnen.'});
  await response.getByText('Direkt antworten', {exact: true}).click();
  await response.getByLabel('Antwort an Lernfüchsin', {exact: true}).fill('Darauf kann ich direkt antworten.');
  await response.getByRole('button', {name: 'Antwort veröffentlichen'}).click();
  await forum.getByText('Darauf kann ich direkt antworten.', {exact: true}).waitFor();
  assert.equal(await forum.locator('.forum-reply-reference').innerText(), 'Antwort an Lernfüchsin');

  await forum.getByRole('button', {name: /Feedback & Wunschthemen/}).click();
  await forum.getByText('Beitrag schreiben', {exact: true}).click();
  await forum.getByLabel('Titel', {exact: true}).fill('Wunschthema für das Examen');
  await forum.getByLabel('Dein Beitrag', {exact: true}).fill('Ich wünsche mir weitere Übungsfälle zur Übergabe.');
  await forum.getByRole('button', {name: 'Beitrag veröffentlichen'}).click();
  await forum.getByRole('heading', {name: 'Wunschthema für das Examen'}).waitFor();

  await forum.getByRole('button', {name: /Prüfung & Lernfragen/}).click();
  const peerPost = forum.locator('article').filter({hasText: 'Frage aus der Lerngruppe'});
  await peerPost.getByText('Neu', {exact: true}).waitFor();
  await forum.screenshot({path:path.join(out, 'forum-390.png')});
  await peerPost.getByRole('button', {name: 'Frage aus der Lerngruppe'}).click();
  await forum.getByText('Melden', {exact: true}).click();
  await forum.getByLabel('Grund').selectOption('sonstiges');
  await forum.getByRole('button', {name: 'Meldung senden'}).click();
  await forum.getByText('Danke. Deine Meldung wurde an die Moderation gesendet.').waitFor();
  assert.equal(await forum.getByText('Moderation und PLZ-Übersicht').count(), 0);
  await forum.getByRole('button', {name: 'Zur Übersicht'}).click();
  await forum.getByLabel('Nur ungelesene Themen').check();
  await forum.getByText('Hier sind alle Themen gelesen.').waitFor();
  await forum.getByLabel('Nur ungelesene Themen').uncheck();
  await forum.getByRole('button', {name: 'Frage aus der Lerngruppe'}).click();

  await page.evaluate(async () => { window.seedForumInbox(); await window.refreshForumIndicators(true); });
  await page.locator('.account-toggle [data-forum-counter="mail"]').waitFor();
  await forum.getByRole('button', {name: 'Privat schreiben'}).click();
  const inbox = page.locator('.forum-inbox');
  await inbox.getByRole('heading', {name: 'PflegePeer', exact: true}).waitFor();
  await inbox.locator('.inbox-messages').getByText('Hast du Lust, gemeinsam zu üben?').waitFor();
  await page.locator('.account-toggle [data-forum-counter="mail"]').waitFor({state: 'hidden'});
  assert.equal(await inbox.locator('#inboxMessage + .answer-tools .answer-actions button').count(), 4);
  assert.equal(await inbox.locator('#inboxMessage + .answer-tools audio + .answer-remove').count(), 1);
  await inbox.getByLabel('Deine Nachricht').fill('Ja, lass uns nächste Woche zusammen lernen.');
  await inbox.getByRole('button', {name: 'Nachricht senden'}).click();
  await inbox.locator('.inbox-messages').getByText('Ja, lass uns nächste Woche zusammen lernen.').waitFor();
  await inbox.screenshot({path:path.join(out, 'postfach-390.png')});
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await inbox.getByRole('button', {name: 'Zum Profil'}).click();
  await profile.getByRole('button', {name: 'Mein Postfach'}).click();
  await inbox.getByLabel('Nickname suchen').fill('Pflege');
  await inbox.getByRole('button', {name: 'Suchen', exact: true}).click();
  await inbox.getByRole('button', {name: 'An PflegePeer schreiben'}).waitFor();
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
  await page.evaluate(() => {
    (state.answerDrafts ??= {})['full-case-0'] = {text: 'Meine bisherige Sammelantwort.', updated: Date.now()};
    go('faelle');
    showCase(0);
  });
  const caseTasks = page.locator('#caseDetail .case-full > .exam-task-list > li');
  assert.equal(await caseTasks.count(), 5);
  const firstAnswer = caseTasks.nth(0).locator('textarea[data-answer]');
  const thirdTask = caseTasks.nth(2);
  const thirdAnswer = thirdTask.locator('textarea[data-answer]');
  assert.equal(await thirdAnswer.getAttribute('data-answer'), 'full-case-0-3');
  assert.match(await thirdTask.innerText(), /sicheren Toilettengang/);
  assert.equal(await caseTasks.locator('textarea[data-answer] + .answer-tools').count(), 5);
  assert.equal(await page.locator('#caseDetail section .exam-task textarea[data-answer]').count(), 5);
  const previous = page.getByText('Deine bisherige Sammelantwort', {exact: true});
  assert.equal(await previous.filter({visible: true}).count(), 1);
  await previous.filter({visible: true}).click();
  assert.equal(await page.locator('[data-answer="full-case-0"]').inputValue(), 'Meine bisherige Sammelantwort.');
  await firstAnswer.fill('Antwort zur ersten Aufgabe.');
  await dictateIntoPreview(thirdTask);
  await thirdTask.getByRole('button', {name: 'Übernehmen', exact: true}).click();
  assert.equal(await thirdAnswer.inputValue(), 'Ich prüfe die Ressourcen.');
  assert.equal(await firstAnswer.inputValue(), 'Antwort zur ersten Aufgabe.');
  await page.reload();
  await page.waitForFunction(() => hasLearningAccess());
  assert.equal(await firstAnswer.inputValue(), 'Antwort zur ersten Aufgabe.');
  assert.equal(await thirdAnswer.inputValue(), 'Ich prüfe die Ressourcen.');

  const linkedCount = await page.evaluate(() => {openStudyCase(originalTopicCount); return linkedCases[0][2].length;});
  assert.equal(await page.locator('#caseDetail .exam-task textarea[data-answer] + .answer-tools').count(), linkedCount);
  const shortCount = await page.evaluate(() => {go('falltraining'); showExamCase(0); return examCases[0][3].length;});
  assert.equal(await page.locator('#caseDetail .exam-task textarea[data-answer] + .answer-tools').count(), shortCount);

  await page.evaluate(() => go('praktisch'));
  const medication = page.locator('.practice-tile').filter({hasText: 'Medikamentensicherheit'});
  assert.equal(await medication.locator('.study-mini').count(), 1);
  assert.equal(await medication.evaluate(tile => tile.scrollWidth > tile.clientWidth), false);

  await page.evaluate(() => go('praxischallenges'));
  assert.equal(await page.locator('.challenge-tile svg').count(), 8);
  await page.getByRole('button', {name: /Transfer vom Bett in den Rollstuhl/}).click();
  const challenge = page.locator('#activeChallenge');
  assert.match(await challenge.innerText(), /Transfer vom Bett in den Rollstuhl/);
  await page.getByRole('button', {name: /Mundpflege bei eingeschränkter Schluckfähigkeit/}).click();
  await challenge.getByText('Schritt 1 von 5').waitFor();
  await challenge.getByRole('button', {name: /Den vorhandenen Mundpflegeplan übernehmen/}).click();
  await challenge.locator('#decisionFeedback > p').filter({hasText: /Die veränderte Wachheit kann die Sicherheit/}).waitFor();
  await challenge.getByText('Alle Optionen vergleichen', {exact:true}).click();
  assert.equal(await challenge.locator('#decisionFeedback li').count(),3);
  await challenge.getByRole('button', {name:'Nächster Schritt'}).click();
  await page.reload();
  await challenge.getByText('Schritt 2 von 5').waitFor();
  for (let step = 2; step <= 5; step++) {
    await challenge.getByText(`Schritt ${step} von 5`).waitFor();
    await challenge.locator('.decision-options button').first().click();
    await challenge.getByRole('button', {name:step === 5 ? 'Auswertung ansehen' : 'Nächster Schritt'}).click();
  }
  await challenge.getByRole('heading', {name:'Auswertung'}).waitFor();
  assert.equal(await challenge.locator('.decision-summary li').count(),5);

  await page.evaluate(() => go('schriftlich'));
  await page.locator('[data-case]').first().click();
  const field = page.locator('.exam-task textarea').first();
  const draft = 'Eigene Einschätzung zum Lernfall.';
  await field.fill(draft);
  assert.match(await page.locator('.exam-task').first().innerText(), /Punkte/);
  const firstTask = page.locator('.exam-task').first();
  const actions = firstTask.locator('.answer-actions');
  assert.deepEqual(await actions.locator('button').allTextContents(), ['Aufnehmen','Diktieren','Anhören','Übernehmen']);
  const [recordBox, dictateBox, playBox, acceptBox] = await Promise.all(
    (await actions.locator('button').all()).map(button => button.boundingBox())
  );
  assert.equal(recordBox.x, playBox.x);
  assert.equal(dictateBox.x, acceptBox.x);
  assert.equal(recordBox.y, dictateBox.y);
  assert.equal(playBox.y, acceptBox.y);
  const playback = firstTask.getByRole('button', {name: 'Anhören', exact: true});
  const accept = firstTask.getByRole('button', {name: 'Übernehmen', exact: true});
  assert.ok(await playback.isDisabled());
  assert.ok(await accept.isDisabled());
  const preview = await dictateIntoPreview(firstTask);
  assert.equal(await field.inputValue(), draft);
  assert.equal(await preview.inputValue(), 'Ich prüfe die Ressourcen.');
  await preview.fill('Ich prüfe die vorhandenen Ressourcen.');
  await accept.click();
  const answer = draft+' Ich prüfe die vorhandenen Ressourcen.';
  assert.equal(await field.inputValue(), answer);
  assert.ok(await preview.isHidden());

  await page.context().grantPermissions(['microphone']);
  await firstTask.getByRole('button', {name: 'Aufnehmen', exact: true}).click();
  try {
    await firstTask.getByText('Aufnahme läuft. Sprich jetzt.', {exact: true}).waitFor({timeout:10000});
  } catch (error) {
    const status = await firstTask.locator('.answer-status').innerText();
    throw new Error('Mikrofonstatus im Browsertest: '+status, {cause:error});
  }
  await firstTask.getByRole('button', {name: 'Beenden', exact: true}).click();
  await playback.click();
  assert.ok(await firstTask.locator('audio').evaluate(async audio => {
    const response = await fetch(audio.src);
    return (await response.blob()).size > 0;
  }));
  await page.reload();
  await page.waitForFunction(() => hasLearningAccess());
  assert.equal(await field.inputValue(), answer);
  await playback.click();
  const player = firstTask.locator('audio');
  await player.waitFor();
  const remove = firstTask.getByRole('button', {name: 'Löschen', exact: true});
  const [playerBox, removeBox] = await Promise.all([player.boundingBox(), remove.boundingBox()]);
  assert.equal(await firstTask.locator('audio + .answer-remove').count(), 1);
  assert.ok(removeBox.y >= playerBox.y + playerBox.height);
  page.once('dialog', dialog => dialog.accept());
  await remove.click();
  await firstTask.locator('audio').waitFor({state: 'hidden'});
  assert.ok(await playback.isDisabled());
  assert.equal(await field.inputValue(), answer);
  await page.reload();
  await page.waitForFunction(() => hasLearningAccess());
  assert.ok(await playback.isDisabled());
  assert.equal(await field.inputValue(), answer);
  await firstTask.screenshot({path:path.join(out, 'answer-controls-390.png')});

  await page.evaluate(() => go('notfallsimulator'));
  await page.locator('#emergencyCase').selectOption({label: 'Plötzliche Sprachstörung beim Frühstück'});
  const emergency = page.locator('#activeEmergency');
  await emergency.getByText('Entscheidung 1 von 5').waitFor();
  await page.getByRole('button', {name: /Erst den Blutzucker messen/}).click();
  assert.match(await emergency.locator('#decisionFeedback').innerText(), /verzögert sich/);
  for (let step = 2; step <= 5; step++) {
    await emergency.getByRole('button', {name:'Nächste Entscheidung'}).click();
    await emergency.getByText(`Entscheidung ${step} von 5`).waitFor();
    await emergency.locator('.decision-options button').first().click();
  }
  await emergency.getByRole('button', {name:'Auswertung ansehen'}).click();
  await emergency.getByRole('heading', {name:'Auswertung'}).waitFor();
  assert.equal(await emergency.locator('.decision-summary li').count(),5);

  await page.evaluate(() => go('themenquiz'));
  await page.getByRole('button', {name: 'Prüfungstraining', exact: true}).click();
  await page.getByRole('button', {name: /Quiz starten/}).click();
  await page.locator('.option').first().click();
  await page.getByRole('button', {name: 'Antwort prüfen', exact: true}).click();
  assert.ok(await page.locator('.quiz-explanations li').count() >= 3);
}

async function run(){await new Promise(r=>server.listen(8137,'127.0.0.1',r));const browser=await chromium.launch({headless:true,args:['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream'],...(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:process.platform==='win32'?{channel:'msedge'}:{})});try{for(const width of [320,390,1280]){const context=await browser.newContext({viewport:{width,height:950}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await context.addInitScript(mockSupabase);await context.addInitScript(mockSpeechRecognition);await page.route('https://**/*',r=>r.abort());await checkLearningAccess(page);await checkNavigationTargets(page);if(width===390)await checkProfilePicture(page);await checkCurriculumMenu(page);await checkConnectedLearning(page);if(width===390){await checkModelCardLayout(page);await checkTrainingRefresh(page);await checkForum(page);}await page.evaluate(()=>go('themen'));await page.locator('.library-cover img').evaluate(img=>img.decode());await page.screenshot({path:path.join(out,`gallery-${width}.png`),fullPage:false});const topicCount=await page.evaluate(()=>topics.length);assert.equal(await page.locator('.topic-tile').count(),topicCount);await page.locator('#libraryCategory').selectOption('Medikamente');assert.equal(await page.locator('#topics .topic-tile').count(),await page.evaluate(()=>topics.filter(topic=>studyCategoryMatches(topic,'Medikamente')).length));await page.locator('#search').fill('zzzzz');assert.equal(await page.locator('.empty').count(),1);await page.evaluate(()=>go('themen'));
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
