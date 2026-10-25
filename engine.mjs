export const LEVELS=[
 {size:6,mines:6,seconds:4,key:'meadow'},
 {size:8,mines:12,seconds:5,key:'orchard'},
 {size:10,mines:20,seconds:6,key:'woodland'},
 {size:12,mines:32,seconds:7,key:'highlands'},
 {size:14,mines:44,seconds:8,key:'twilight'},
 {size:16,mines:60,seconds:9,key:'moonlight'}
];
export function seeded(seed){return()=>{let t=seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
export function neighbors(k,n){const x=k%n,y=Math.floor(k/n),a=[];if(y>0)a.push(k-n);if(x<n-1)a.push(k+1);if(y<n-1)a.push(k+n);if(x>0)a.push(k-1);return a;}
export function adjacent(a,b,n){return neighbors(a,n).includes(b);}
export function safePath(board){const {n,start,goal,mines}=board,queue=[start],prev=new Map([[start,null]]);for(let i=0;i<queue.length;i++){const k=queue[i];if(k===goal){const path=[];for(let p=k;p!==null;p=prev.get(p))path.unshift(p);return path;}for(const q of neighbors(k,n))if(!mines.has(q)&&!prev.has(q)){prev.set(q,k);queue.push(q);}}return[];}
export function createBoard(level=0,random=Math.random){const c=LEVELS[level],n=c.size,total=n*n;const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
 const border=Array.from({length:total},(_,k)=>k).filter(k=>k%n===0||k%n===n-1||k<n||k>=total-n);
 const start=border[Math.floor(random()*border.length)],far=border.filter(k=>Math.abs(k%n-start%n)+Math.abs(Math.floor(k/n)-Math.floor(start/n))>=n);
 const goal=far[Math.floor(random()*far.length)];
 const candidates=Array.from({length:total},(_,i)=>i).filter(k=>k!==start&&k!==goal);
 for(let attempt=0;attempt<100;attempt++){const mines=new Set(shuffle([...candidates]).slice(0,c.mines)),b={n,start,goal,mines,level};if(safePath(b).length)return b;}
 // Bounded fallback: reserve a random monotone route, then place the exact mine count elsewhere.
 const reserved=new Set([start]);let k=start;
 while(k!==goal){const options=neighbors(k,n).filter(q=>Math.abs(q%n-goal%n)+Math.abs(Math.floor(q/n)-Math.floor(goal/n))<Math.abs(k%n-goal%n)+Math.abs(Math.floor(k/n)-Math.floor(goal/n)));k=options[Math.floor(random()*options.length)];reserved.add(k);}
 return {n,start,goal,level,mines:new Set(shuffle(candidates.filter(k=>!reserved.has(k))).slice(0,c.mines))};
}
export function extendPath(board,path,target){if(!Number.isInteger(target)||target<0||target>=board.n*board.n||!adjacent(path.at(-1),target,board.n))return path;const previous=path.indexOf(target);return previous>=0?path.slice(0,previous+1):[...path,target];}
export function evaluate(board,path){const valid=path[0]===board.start&&path.at(-1)===board.goal&&path.every((k,i)=>Number.isInteger(k)&&k>=0&&k<board.n*board.n&&(i===0||adjacent(path[i-1],k,board.n)));const hits=[...new Set(path.filter(k=>board.mines.has(k)))];return{valid,hits,success:valid&&hits.length===0};}
