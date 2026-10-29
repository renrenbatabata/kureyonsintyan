const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const { chromium } = require('playwright');
(async()=>{
 const server=http.createServer((req,res)=>{if(req.url==='/title_call.mp3'){res.setHeader('Content-Type','audio/mpeg');res.end(fs.readFileSync('title_call.mp3'));}else{res.end('<button id="play">Play</button><audio src="/title_call.mp3"></audio><script>document.querySelector("button").onclick=()=>document.querySelector("audio").play()</script>');}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({channel:'chrome',headless:true,ignoreDefaultArgs:['--autoplay-policy=no-user-gesture-required'],args:['--autoplay-policy=document-user-activation-required']});
 try{
 const page=await browser.newPage();await page.goto('http://127.0.0.1:'+server.address().port);
 const blocked=await page.evaluate(async()=>{try{await document.querySelector('audio').play();return 'played';}catch(e){return e.name;}});
 console.log('Before click: '+blocked);
 await page.click('#play');await page.waitForFunction(()=>document.querySelector('audio').currentTime>0);
 assert.equal(await page.evaluate(()=>document.querySelector('audio').error),null);
 console.log(JSON.stringify(await page.evaluate(()=>{const a=document.querySelector('audio');return {playing:!a.paused,duration:a.duration,currentTime:a.currentTime,error:a.error};})));
 } finally {await browser.close();server.close();}
})();
