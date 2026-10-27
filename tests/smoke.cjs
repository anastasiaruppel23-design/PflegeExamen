const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 const file=path.resolve(root,'.'+(url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname)));
 if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end()}
 fs.readFile(file,(error,bytes)=>{
  if(error){res.writeHead(404);return res.end()}
  const types={'.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.webmanifest':'application/manifest+json'};
  res.setHeader('Content-Type',types[path.extname(file)]||'text/html');res.end(bytes);
 });
});
async function run(){
 await new Promise(resolve=>server.listen(8137,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,...(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{channel:'msedge'})});
 try{for(const width of [390,1280]){
  const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.route('https://**/*',route=>route.abort());
  await page.goto('http://127.0.0.1:8137');
  assert.equal(await page.evaluate(()=>topics.length),48);
  await page.evaluate(()=>go('themen'));
  await page.locator('#libraryCategory').selectOption('Medikamente');
  assert.equal(await page.locator('#topics>details').count(),5);
  await page.locator('#libraryCategory').selectOption('');
  await page.locator('#study-36 summary').click();
  await page.getByRole('button',{name:'Transferfrage →',exact:true}).first().click();
  await page.getByRole('button',{name:/Hilfe alarmieren/}).click();
  await page.getByRole('button',{name:'Antwort prüfen',exact:true}).click();
  assert.equal(await page.locator('.good').count(),1);
  await page.getByRole('button',{name:'Zum Wissen',exact:true}).click();
  await page.getByRole('button',{name:'Passenden Pflegefall bearbeiten →',exact:true}).click();
  await page.locator('#caseDetail summary').click();
  assert.equal(await page.locator('#caseDetail .learn-box').count(),6);
  await page.locator('#caseDetail').getByRole('button',{name:'Lernkarte →',exact:true}).click();
  await page.locator('.flash').focus();await page.keyboard.press('Space');
  assert.equal(await page.locator('.flash.answer').count(),1);
  await page.evaluate(()=>openLibraryTopic(37));
  await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR||__dirname,`library-${width}.png`),fullPage:false});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.evaluate(()=>{state.done[0]=true;save()});await page.reload();
  assert.equal(await page.evaluate(()=>state.done[0]),true);
  await page.evaluate(()=>go('themen'));await page.locator('#search').fill('zzzzzz');
  assert.equal(await page.locator('#topics>details').count(),0);assert.equal(await page.locator('.empty').count(),1);
  await page.evaluate(()=>go('faelle'));await page.getByRole('button',{name:'Fall bearbeiten',exact:true}).first().click();
  await page.locator('#caseDetail summary').click();assert.equal(await page.locator('#caseDetail h4').count(),5);
  for(const area of ['quiz','kompetenz','karten','falltraining','pruefung','cockpit','plan','timer','quellen','einstellungen','konto']){
   await page.evaluate(area=>go(area),area);assert.ok((await page.locator('#content').innerText()).length>30,area);
  }
  await page.evaluate(async()=>{await navigator.serviceWorker.ready});await page.reload();
  await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
  await context.setOffline(true);await page.reload();await page.evaluate(()=>openLibraryTopic(38));
  await page.locator('#study-38 img').waitFor();
  await page.waitForFunction(()=>document.querySelector('#study-38 img').complete);
  assert.equal(await page.locator('#study-38 img').evaluate(img=>img.naturalWidth>0),true);
  assert.deepEqual(errors,[]);
  console.log(`PASS ${width}px: filters, keyboard, case/card/quiz, persistence, existing areas, offline`);
  await context.close();
 }}finally{await browser.close()}
}
run().catch(error=>{console.error(error);process.exitCode=1}).finally(()=>server.close());
