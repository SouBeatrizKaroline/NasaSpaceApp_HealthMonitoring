/* Requires Microsoft Edge on Windows. Isolated browser profile; no user data. */
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../web'),out=path.resolve(__dirname,'../test-output');fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{const name=decodeURIComponent(req.url.split('?')[0]);const file=path.join(root,name==='/'?'index.html':name);if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml'})[path.extname(file)]||'text/plain');res.end(data);});});
const pause=ms=>new Promise(r=>setTimeout(r,ms));
let browser,ws,next=1;const pending=new Map(),errors=[];
function send(method,params={}){return new Promise((resolve,reject)=>{const id=next++;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));setTimeout(()=>{if(pending.has(id)){pending.delete(id);reject(Error('Timeout: '+method));}},12000).unref();});}
async function evaluate(expression){const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
async function set(id,value){await evaluate(`(()=>{const e=document.getElementById(${JSON.stringify(id)});if(!e)throw Error('Missing '+${JSON.stringify(id)});e.value=${JSON.stringify(value)};e.dispatchEvent(new Event('input',{bubbles:true}));})()`);}
async function click(id){await evaluate(`document.getElementById(${JSON.stringify(id)}).click()`);await pause(70);}
async function navigate(hash){await evaluate(`location.hash=${JSON.stringify(hash)}`);await pause(120);}
async function reload(){await send('Page.reload');await pause(700);}
async function save(stage,description,heart=''){
 await navigate('checkin');await set('stage',stage);await click('nextStep');await set('description',description);await click('nextStep');if(heart)await set('heartRate',heart);await set('measurementSource','Manual instrument');await click('nextStep');await click('nextStep');assert.equal(await evaluate("document.getElementById('saveSuccess').hidden"),false);
}
async function profile(crew,mission){await navigate('today');if(await evaluate("!document.getElementById('todayWorkspace').hidden"))await click('switchCrew');await set('crewId',crew);await set('initialMission',mission);await evaluate("document.getElementById('profileForm').requestSubmit()");await pause(100);}
(async()=>{
 await new Promise(r=>server.listen(8176,'127.0.0.1',r));
 const tempRoot=process.env.CREW_TEST_TEMP || path.join(require('node:os').homedir(),'AppData','Local','Temp');
 browser=spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',['--headless=new','--disable-gpu','--no-first-run','--remote-debugging-port=9336','--user-data-dir='+path.join(tempRoot,'crew-health-test-'+Date.now()),'about:blank'],{windowsHide:true,stdio:'ignore'});
 let tabs;for(let i=0;i<60;i++){try{tabs=await(await fetch('http://127.0.0.1:9336/json/list')).json();break;}catch(e){if(i===59)console.error(e);await pause(200);}}if(!tabs)throw Error('Edge debugging unavailable');
 ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r));ws.addEventListener('message',event=>{const m=JSON.parse(event.data);if(m.id){const p=pending.get(m.id);if(p){pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params);});
 await send('Page.enable');await send('Runtime.enable');await send('Network.enable');await send('Page.navigate',{url:'http://127.0.0.1:8176/'});await pause(1000);
 await evaluate('localStorage.clear()');await reload();await evaluate('navigator.serviceWorker.ready');await reload();
 await send('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:0,uploadThroughput:0});
 await profile('CREW-A','MISSION-A');await save('pre','Preflight observation','70');await save('during','In flight observation','75');await reload();
 assert.equal(await evaluate("JSON.parse(localStorage.getItem('crew-health-check.records.v2')).length"),2);
 await navigate('history');assert.match(await evaluate("document.getElementById('historyComparison').innerText"),/5/);
 const report=await evaluate("CrewCore.report(JSON.parse(localStorage.getItem(CrewCore.RECORD_KEY)),'CREW-A','MISSION-A')");
 await send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:out});await click('exportReport');await pause(300);
 const downloaded=fs.readdirSync(out).filter(f=>f.endsWith('.json'));assert.ok(downloaded.length,'export produces a JSON file');assert.equal(JSON.parse(fs.readFileSync(path.join(out,downloaded[0]))).records.length,2);
 await profile('CREW-B','MISSION-A');await save('pre','Second crew');await profile('CREW-A','MISSION-B');await save('post','Other mission');await reload();
 await profile('CREW-A','MISSION-A');await reload();await navigate('history');assert.equal(await evaluate("document.querySelectorAll('#historyRecords .record').length"),2);
 await navigate('ground');async function upload(value){await evaluate(`(()=>{const dt=new DataTransfer();dt.items.add(new File([${JSON.stringify(value)}],'report.json',{type:'application/json'}));const f=document.getElementById('groundFile');f.files=dt.files;f.dispatchEvent(new Event('change'));})()`);await pause(150);}
 await upload('{invalid');assert.match(await evaluate("document.getElementById('importMessage').className"),/error/);await upload(JSON.stringify(report));assert.equal(await evaluate("document.querySelectorAll('#groundRecords .record').length"),2);assert.match(await evaluate("document.getElementById('groundRecords').textContent"),/Manual instrument/);
 await navigate('planning');await set('planBudget','20');await set('planTasks','Equipment check, 10, 4\nInventory, 20, 9');await evaluate("document.querySelector('#planningMount form').requestSubmit()");assert.equal(await evaluate("document.querySelectorAll('.plan-result').length"),2);
 await navigate('today');await send('Emulation.setDeviceMetricsOverride',{width:1360,height:950,deviceScaleFactor:1,mobile:false});await pause(100);fs.writeFileSync(path.join(out,'today-desktop.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await pause(100);assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth'),'mobile has no horizontal overflow');fs.writeFileSync(path.join(out,'today-mobile.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
 await evaluate("document.getElementById('startCheckin').focus()");await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await pause(150);assert.equal(await evaluate('location.hash'),'#checkin');
 assert.deepEqual(errors,[]);console.log('PASS: offline save/reload, two crews and missions, comparison, actual export, invalid import retry, ground review, planner, desktop/mobile layout, keyboard primary action; no runtime exceptions.');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(ws){try{await send('Browser.close');}catch{}ws.close();}if(browser)browser.kill();server.close();});
