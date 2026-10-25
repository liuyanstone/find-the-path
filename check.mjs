import assert from 'node:assert/strict';
import {LEVELS,createBoard,seeded,safePath,evaluate,extendPath,adjacent} from './engine.mjs';
import {en,zh} from './i18n.mjs';
let tested=0;const fingerprints=new Set();
for(let l=0;l<LEVELS.length;l++)for(let i=0;i<1000;i++){
 const b=createBoard(l,seeded(10000*l+i+1)),solution=safePath(b);
 assert.equal(b.n,LEVELS[l].size);assert(b.mines.size>=LEVELS[l].min&&b.mines.size<=LEVELS[l].max);assert(!b.mines.has(b.start));assert(!b.mines.has(b.goal));assert.notEqual(b.start,b.goal);assert(solution.length>=b.n+1);assert(evaluate(b,solution).success);
 let path=[b.start];for(const k of solution.slice(1))path=extendPath(b,path,k);assert.deepEqual(path,solution);assert(evaluate(b,path).success);
 const previous=extendPath(b,path,path.at(-2));assert.equal(previous.length,path.length-1);
 assert.equal(extendPath(b,[b.start],-1).length,1);assert.equal(extendPath(b,[b.start],b.n*b.n).length,1);
 // Construct a continuous route deliberately crossing a mine, then reaching the goal.
 const mine=[...b.mines][0],walk=(a,z)=>{const p=[a];while(a!==z){if(a%b.n!==z%b.n)a+=Math.sign(z%b.n-a%b.n);else a+=Math.sign(Math.floor(z/b.n)-Math.floor(a/b.n))*b.n;p.push(a);}return p;};
 const unsafe=[...walk(b.start,mine),...walk(mine,b.goal).slice(1)],r=evaluate(b,unsafe);assert(r.valid);assert(!r.success);assert(r.hits.includes(mine));
 assert(!evaluate(b,[b.start,b.goal]).valid);fingerprints.add(`${l}:${b.start}:${b.goal}:${[...b.mines].sort((a,b)=>a-b)}`);tested++;
}
// Deterministic random extremes remain solvable and within the chosen range.
for(let l=0;l<LEVELS.length;l++){const b=createBoard(l,()=>0);assert(b.mines.size>=LEVELS[l].min&&b.mines.size<=LEVELS[l].max);assert(evaluate(b,safePath(b)).success);}
// Keep both neighbors of start 0 mined for all 100 attempts, exercising the fallback.
let calls=0;const blockedRandom=()=>{const call=calls++;if(call<3)return 0;const i=33-(call-3)%33;return i===5?1.1/(i+1):(i+.1)/(i+1);};const fallback=createBoard(0,blockedRandom);assert(calls>3303);assert(evaluate(fallback,safePath(fallback)).success);assert.equal(fallback.mines.size,LEVELS[0].min);
for(let l=0;l<LEVELS.length;l++){const seen=new Set();for(let i=0;i<150;i++)seen.add(createBoard(l,seeded(90000+l*1000+i)).mines.size);assert(seen.has(LEVELS[l].min));assert(seen.has(LEVELS[l].max));}
assert(fingerprints.size>8900);assert.deepEqual(Object.keys(en).sort(),Object.keys(zh).sort());
for(const key of Object.keys(en)){assert(zh[key]);assert.deepEqual([...en[key].matchAll(/\{(\w+)\}/g)].map(m=>m[1]).sort(),[...zh[key].matchAll(/\{(\w+)\}/g)].map(m=>m[1]).sort(),`Translation placeholders for ${key}`);}
console.log(`PASS: ${tested} randomized boards across ${LEVELS.length} difficulties. Safe solutions replayed; mine counts within each range; endpoints safe; losing paths detected; undo validated; bounded fallback solvable; English/Chinese complete.`);
