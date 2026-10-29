const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
test('heading audio, error recovery and existing features in Chrome', async () => {
  const browser = await chromium.launch({channel: 'chrome', headless:true});
  try {
    const page = await browser.newPage();
    const errors=[]; page.on('pageerror', e=>errors.push(e.message));
    await page.setContent('<h1 style="color:purple!important"><a href="#x">Title</a><span> child</span></h1><h4>Small</h4><img src="old.png">');
    await page.evaluate(() => {
      window.chrome = {runtime:{getURL:p=>'https://extension.test/'+p.replace(/^\.\//,'')}};
      window.calls=0; window.mode='blocked'; window.instances=[];
      window.Audio=class {
        constructor(url){this.src=url;this.paused=true;window.instances.push(this);}
        play(){window.calls++; if(window.mode==='blocked')return Promise.reject(new DOMException('blocked','NotAllowedError'));
          if(window.mode==='failed')return Promise.reject(new DOMException('decode','NotSupportedError'));
          if(window.mode==='pending')return new Promise(resolve=>{window.finish=()=>{this.paused=false;resolve();};});
          this.paused=false; return Promise.resolve();}
      };
    });
    for(const file of ['haru.js','renren.js','massan.js']) await page.addScriptTag({path:path.join(root,file)});
    assert.equal(await page.locator('h1').textContent(),'Title childだゾ');
    assert.equal(await page.locator('h1 a').count(),1);
    assert.equal(await page.locator('h4').textContent(),'Smallだゾ');
    assert.equal(await page.locator('img.ketu').getAttribute('src'),'https://extension.test/ketu.gif');
    assert.equal(await page.locator('img:not(.ketu)').getAttribute('src'),'https://extension.test/ketujin.png');
    await page.locator('h1 a').dispatchEvent('mouseover');
    assert.equal(await page.locator('h1').evaluate(e=>e.style.color),'orange');
    assert.equal(await page.evaluate(()=>calls),1);
    await page.evaluate(()=>{mode='ok';});
    await page.locator('h1 a').click();
    assert.equal(await page.evaluate(()=>calls),2);
    assert.equal(await page.evaluate(()=>instances[0].src),'https://extension.test/title_call.mp3');
    await page.locator('h1 span').dispatchEvent('mouseover');
    assert.equal(await page.evaluate(()=>calls),2);
    await page.locator('h1').dispatchEvent('mouseout');
    assert.equal(await page.locator('h1').evaluate(e=>e.style.getPropertyValue('color')),'purple');
    assert.equal(await page.locator('h1').evaluate(e=>e.style.getPropertyPriority('color')),'important');
    await page.evaluate(()=>{instances[0].paused=true;mode='failed';});
    await page.locator('h4').dispatchEvent('mouseover');
    await page.evaluate(()=>{mode='pending';});
    await page.locator('h4').dispatchEvent('click');
    await page.locator('h4').dispatchEvent('click');
    assert.equal(await page.evaluate(()=>calls),4);
    await page.evaluate(()=>finish());
    await page.evaluate(()=>{instances.at(-1).paused=true;mode='ok';document.body.insertAdjacentHTML('beforeend','<h2 id="dynamic">Dynamic</h2><img id="new-image" src="new.png">');});
    await page.locator('#dynamic').dispatchEvent('mouseover');
    assert.equal(await page.evaluate(()=>calls),5);
    assert.equal(await page.locator('#new-image').getAttribute('src'),'https://extension.test/ketujin.png');
    assert.deepEqual(errors,[]);
    console.log('Chrome '+browser.version()+': behavior assertions passed');
  } finally {await browser.close();}
});
test('MV3 manifest exposes only existing bundled assets',()=>{
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8').replace(/^\uFEFF/,''));
  assert.equal(manifest.manifest_version,3);
  for(const script of manifest.content_scripts[0].js)assert.ok(fs.existsSync(path.join(root,script)));
  for(const resource of manifest.web_accessible_resources[0].resources)assert.ok(fs.statSync(path.join(root,resource)).size>0);
  assert.ok(manifest.web_accessible_resources[0].resources.includes('title_call.mp3'));
  assert.ok(!manifest.permissions);
});
