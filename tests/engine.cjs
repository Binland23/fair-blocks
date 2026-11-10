const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
assert.ok(fs.existsSync(__dirname+'/../index.html'),'production HTML exists');
const html=fs.readFileSync(__dirname+'/../index.html','utf8');
const code=html.match(/\/\* ENGINE START \*\/([\s\S]*?)\/\* ENGINE END \*\//)[1];
const ctx={};vm.createContext(ctx);vm.runInContext(code,ctx);const E=ctx.Engine;
const dot=E.shapes.find(s=>s.id==='dot');
assert.equal(E.fits(Array(8).fill(0),dot,7,7),true);
assert.equal(E.fits(Array(8).fill(0),dot,8,7),false);
assert.equal(E.fits([1,0,0,0,0,0,0,0],dot,0,0),false);
let b=Array(8).fill(1);b[0]=254;
let r=E.place(b,dot,0,0);assert.equal(r.rows.length,1);assert.equal(r.cols.length,1);assert.equal(r.board.reduce((a,v)=>a+v,0),0);
const square=E.shapes.find(s=>s.id==='sq2');
assert.equal(E.solve(Array(8).fill(255),[square,dot,dot]),null);
assert.ok(E.solve([254,255,255,255,255,255,255,255],[dot,square,square]),'search includes intermediate clears and ordering');
assert.equal(E.deal(Array(8).fill(255),new E.Dealer('full')),null);
let a=new E.Dealer('same'),c=new E.Dealer('same');
for(let i=0;i<20;i++){assert.equal(a.queue.map(s=>s.id).join(),c.queue.map(s=>s.id).join());a.refill();c.refill();}
const bag=new E.Dealer('bag');assert.equal(new Set(bag.queue.slice(0,E.families.length).map(s=>s.family)).size,E.families.length);
let verified=0,rescues=0,maxms=0,start=Date.now();
for(let seed=0;seed<100;seed++){
 let board=Array(8).fill(0),dealer=new E.Dealer('test-'+seed);
 for(let turn=0;turn<40;turn++){
  const t=Date.now(),d=E.deal(board,dealer);maxms=Math.max(maxms,Date.now()-t);
  assert.ok(d,'playable witness path must not get an impossible next deal');
  let witness=E.solve(board,d.pieces);assert.ok(witness,'every dealt set solves');
  for(const step of witness){assert.ok(E.fits(board,d.pieces[step.i],step.x,step.y));board=E.place(board,d.pieces[step.i],step.x,step.y).board;}
  verified++;rescues+=+d.rescue;
 }
}
console.log(JSON.stringify({passed:true,verifiedDeals:verified,rescues,maxDealMs:maxms,elapsedMs:Date.now()-start}));
// Independent cell-array oracle: do not trust the production bitmask clear/fit code.
function replayIndependent(board,pieces,witness){let g=Array.from({length:8},(_,y)=>Array.from({length:8},(_,x)=>!!(board[y]&(1<<x))));const used=new Set();for(const m of witness){assert.ok(!used.has(m.i));used.add(m.i);for(const [sx,sy] of pieces[m.i].cells){let x=m.x+sx,y=m.y+sy;assert.ok(x>=0&&x<8&&y>=0&&y<8&&!g[y][x],'independent witness placement valid');g[y][x]=true;}let rows=[],cols=[];for(let y=0;y<8;y++)if(g[y].every(Boolean))rows.push(y);for(let x=0;x<8;x++)if(g.every(row=>row[x]))cols.push(x);for(let y=0;y<8;y++)for(let x=0;x<8;x++)if(rows.includes(y)||cols.includes(x))g[y][x]=false;}assert.equal(used.size,3);return g;}
let random=E.rng('dense-oracle'),extra=0,dead=0;
for(let k=0;k<3000;k++){const density=.1+random()*.87;let board=Array.from({length:8},()=>{let v=0;for(let x=0;x<8;x++)if(random()<density)v|=1<<x;return v===255?254:v;});let d=E.deal(board,new E.Dealer('dense'+k));if(d){replayIndependent(board,d.pieces,d.witness);extra++;}else{assert.equal(E.solve(board,[dot,dot,dot],100000),null);dead++;}}
let d1=new E.Dealer('replay'),d2=new E.Dealer('replay'),rb=Array(8).fill(0);for(let k=0;k<50;k++){let x=E.deal(rb,d1),y=E.deal(rb,d2);assert.equal(JSON.stringify(x),JSON.stringify(y),'seeded deals match');for(const m of x.witness)rb=E.place(rb,x.pieces[m.i],m.x,m.y).board;}
console.log(JSON.stringify({independentRandomBoardDeals:extra,genuinelyUnsolvableBoards:dead,shapeVariants:E.shapes.length,seedReplayDeals:50}));
