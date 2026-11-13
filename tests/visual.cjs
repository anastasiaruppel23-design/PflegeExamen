const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=process.env.SCREENSHOT_DIR||path.join(root,'test-results');fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{const u=new URL(req.url,'http://localhost'),f=path.resolve(root,'.'+(u.pathname==='/'?'/index.html':decodeURIComponent(u.pathname)));if(!f.startsWith(root+path.sep)){res.writeHead(403);return res.end()}fs.readFile(f,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.webp':'image/webp','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'})[path.extname(f)]||'text/html');res.end(b)})});
function mockSupabase() {
  const session = {user: {id: 'browser-test', email: 'learner@example.test'}};
  const key = 'pflegefokus-browser-test-session';
  let onAuthChange;
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
    from() {
      return {
        select: () => ({eq: () => ({maybeSingle: async () => ({data: null})})}),
        upsert: async () => ({})
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

async function run(){await new Promise(r=>server.listen(8137,'127.0.0.1',r));const browser=await chromium.launch({headless:true,...(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:process.platform==='win32'?{channel:'msedge'}:{})});try{for(const width of [320,390,1280]){const context=await browser.newContext({viewport:{width,height:950}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await context.addInitScript(mockSupabase);await page.route('https://**/*',r=>r.abort());await checkLearningAccess(page);await page.evaluate(()=>go('themen'));await page.locator('.library-cover img').evaluate(img=>img.decode());await page.screenshot({path:path.join(out,`gallery-${width}.png`),fullPage:false});const topicCount=await page.evaluate(()=>topics.length);assert.equal(await page.locator('.topic-tile').count(),topicCount);await page.locator('#libraryCategory').selectOption('Medikamente');assert.equal(await page.locator('#topics .topic-tile').count(),await page.evaluate(()=>topics.filter(topic=>studyCategoryMatches(topic,'Medikamente')).length));await page.locator('#search').fill('zzzzz');assert.equal(await page.locator('.empty').count(),1);await page.evaluate(()=>go('themen'));
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
await page.evaluate(()=>openLibraryTopic(36));await page.locator('.poster-illustration img').evaluate(img=>img.decode());await page.screenshot({path:path.join(out,`lesson-${width}.png`),fullPage:true});await page.evaluate(()=>openLibraryTopic(1));await page.screenshot({path:path.join(out,`model-${width}.png`),fullPage:true});await page.evaluate(()=>openLibraryTopic(36));await page.getByRole('button',{name:'Transferfrage lösen →',exact:true}).click();await page.getByRole('button',{name:/Hilfe alarmieren/}).click();await page.getByRole('button',{name:'Antwort prüfen',exact:true}).click();assert.equal(await page.locator('.good').count(),1);await page.getByRole('button',{name:'Zum Wissen',exact:true}).click();await page.getByRole('button',{name:'Passenden Pflegefall bearbeiten →',exact:true}).click();await page.locator('#caseDetail summary').click();assert.equal(await page.locator('#caseDetail .poster-box').count(),6);await page.locator('#caseDetail').getByRole('button',{name:'Lernkarte →',exact:true}).click();await page.locator('.illustrated-flash').focus();await page.keyboard.press('Space');assert.equal(await page.locator('.illustrated-flash.answer').count(),1);await page.screenshot({path:path.join(out,`card-${width}.png`),fullPage:true});await page.getByRole('button',{name:'Zusammenhänge verstehen ↗',exact:true}).click();await page.getByRole('button',{name:'✓ Als gelernt markieren',exact:true}).click();assert.equal(await page.evaluate(()=>state.done[36]),true);await page.reload();await page.waitForFunction(()=>hasLearningAccess());assert.equal(await page.evaluate(()=>state.done[36]),true);
for(const area of ['quiz','kompetenz','faelle','falltraining','pruefung','cockpit','plan','timer','quellen','einstellungen','konto']){await page.evaluate(area=>go(area),area);assert.ok((await page.locator('#content').innerText()).length>30,area)}
await page.evaluate(async()=>{await navigator.serviceWorker.ready});await page.reload();await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await context.setOffline(true);await page.reload();await page.waitForFunction(()=>hasLearningAccess());await page.evaluate(()=>openLibraryTopic(36));await page.locator('.poster-illustration img').evaluate(img=>img.decode());await page.getByRole('button',{name:'Fachbegriffe nachschlagen',exact:true}).click();await page.locator('.glossary-entry').first().click();assert.match(await page.locator('#studyGlossaryDialog').innerText(),/Antonovsky/);await page.keyboard.press('Escape');await page.getByRole('button',{name:'Mein Konto',exact:true}).click();await page.getByRole('button',{name:'Abmelden',exact:true}).click();await page.getByRole('button',{name:'Registrieren',exact:true}).waitFor();assert.equal(await page.locator('#menuToggle').isVisible(),false);assert.deepEqual(errors,[]);console.log(`PASS ${width}px: sign-up, sign-in, sign-out, ${topicCount} lessons, filters, keyboard, persistence and offline art`);await context.close()}}finally{await browser.close()}}
run().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>server.close());
