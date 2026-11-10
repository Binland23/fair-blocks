const {chromium}=require('/workspace/starship_launch/node_modules/playwright');const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/opt/ungoogled-chromium/chrome',args:['--no-sandbox']});const ctx=await browser.newContext({viewport:{width:393,height:852},deviceScaleFactor:3,isMobile:true,hasTouch:true});const page=await ctx.newPage();page.setDefaultTimeout(4000);let errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:8777/?seed=FINDLAY');
await page.getByRole('heading',{name:'Fair Blocks',exact:true}).waitFor();
assert.equal(await page.locator('.cell').count(),64);await page.screenshot({path:__dirname+'/../shots/01-ready.png'});
// Pointer drag through the actual tray handler; use production state only for fixture arrangement.
async function fixture(board,ids){await page.evaluate(({board,ids})=>{game.loadFixture(board,ids);},{board,ids});}
async function drag(slot,x,y){const slotBox=await page.locator('.slot').nth(slot).boundingBox();const target=await page.evaluate(({slot,x,y})=>{const r=document.querySelector('#board').getBoundingClientRect(),step=game.cellStep(),s=game.tray[slot];return {x:r.left+6+(x+s.w/2)*step,y:r.top+6+y*step+s.h*step+65};},{slot,x,y});
 await page.dispatchEvent('.slot:nth-child('+(slot+1)+')','pointerdown',{pointerId:7,pointerType:'touch',clientX:slotBox.x+slotBox.width/2,clientY:slotBox.y+slotBox.height/2,bubbles:true});
 await page.dispatchEvent('body','pointermove',{pointerId:7,pointerType:'touch',clientX:target.x,clientY:target.y,bubbles:true});
 const floating=await page.locator('#floater').boundingBox();const boardBox=await page.locator('#board').boundingBox();assert.ok(floating.y>=boardBox.y-1&&floating.y<boardBox.y+boardBox.height,'floating piece is visibly aligned over board');
 await page.screenshot({path:__dirname+'/../shots/02-drag.png'});
 await page.dispatchEvent('body','pointerup',{pointerId:7,pointerType:'touch',clientX:target.x,clientY:target.y,bubbles:true});await page.waitForTimeout(350);}
await fixture(Array(8).fill(0),['sq2','dot','dot']);await drag(0,2,2);assert.equal(await page.evaluate(()=>game.board[2]),12,'touch drag places square');
await fixture([1,0,0,0,0,0,0,0],['sq2','dot','dot']);await drag(0,0,0);assert.ok(await page.evaluate(()=>game.tray[0]),'invalid drop preserves piece');
await fixture([254,1,1,1,1,1,1,1],['dot','sq2','dot']);await drag(0,0,0);assert.equal(await page.evaluate(()=>game.board.reduce((a,b)=>a+b,0)),0,'row AND column clear');assert.ok(await page.evaluate(()=>game.score>=250));await page.screenshot({path:__dirname+'/../shots/03-clear.png'});
const best=await page.evaluate(()=>game.best);await page.reload();assert.equal(await page.evaluate(()=>game.best),best,'best persists');
await page.getByRole('button',{name:'About fair mode'}).tap();await page.getByRole('heading',{name:'Your skill. Not the algorithm.'}).waitFor();await page.screenshot({path:__dirname+'/../shots/04-fair-mode.png'});await page.getByRole('button',{name:'Got it'}).tap();
await fixture(Array(8).fill(255),['sq2','sq2','sq2']);await page.evaluate(()=>game.checkOver());await page.getByRole('heading',{name:'A good run.'}).waitFor();await page.screenshot({path:__dirname+'/../shots/05-game-over.png'});await page.getByRole('button',{name:'Play again'}).tap();assert.equal(await page.evaluate(()=>game.over),false);assert.equal(await page.evaluate(()=>game.score),0);
await page.getByRole('button',{name:'Turn sound on'}).tap();await page.getByRole('button',{name:'Turn sound off'}).waitFor();await page.getByRole('button',{name:'Restart game'}).tap();await page.getByRole('button',{name:'Start fresh'}).tap();
assert.equal(await page.evaluate(()=>document.documentElement.scrollHeight>innerHeight),false,'iPhone has no page scrolling');assert.deepEqual(errors,[]);
console.log('PASS: mobile touch drag, invalid drop, simultaneous clears, persistence, info, game-over/restart, sound, no-scroll, no runtime errors');await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
