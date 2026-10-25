import {LEVELS} from './engine.mjs';
export const SET_LENGTH=10;
export const STORAGE_KEY='find-path-daily-v1';
export function localDay(date=new Date()){return`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
export function createSession(day){return{day,level:0,failures:0,results:[]};}
export function sessionScore(session){return session.results.reduce((sum,r)=>sum+r.points,0);}
export function complete(session){return session.results.length===SET_LENGTH;}
export function recordRound(session,outcome){
 if(complete(session))throw Error('This 10-round set is complete');
 if(typeof outcome.success!=='boolean')throw Error('A round needs a success or failure result');
 const config=LEVELS[session.level];
 let level=session.level,failures=session.failures;
 if(outcome.success){level=Math.min(level+1,LEVELS.length-1);failures=0;}else{failures++;if(failures===2){level=Math.max(level-1,0);failures=0;}}
 const entry={level:session.level,size:config.size,mines:Math.min(config.max,Math.max(config.min,Number(outcome.mines)||config.min)),success:outcome.success,points:outcome.success?config.points:0,steps:Math.max(0,Math.floor(Number(outcome.steps)||0)),duration:Math.max(0,Math.floor(Number(outcome.duration)||0))};
 return{day:session.day,level,failures,results:[...session.results,entry]};
}
export function createState(day=localDay()){return{version:1,history:{},session:createSession(day)};}
export function recordDailyRound(state,outcome){const session=recordRound(state.session,outcome);let history=state.history;if(complete(session)){const old=history[session.day]||{best:0,sets:0};history={...history,[session.day]:{best:Math.max(old.best,sessionScore(session)),sets:old.sets+1}};}return{version:1,history,session};}
export function startSet(state,day=localDay()){return{...state,session:createSession(day)};}
export function rollDay(state,day=localDay()){return state.session.day===day?state:startSet(state,day);}
export function restoreState(raw,day=localDay()){
 const fresh=createState(day);if(!raw||raw.version!==1)return fresh;
 if(raw.history&&typeof raw.history==='object')for(const [key,value]of Object.entries(raw.history)){if(/^\d{4}-\d{2}-\d{2}$/.test(key)&&value&&Number.isInteger(value.best)&&value.best>=0&&value.best<=5400&&Number.isInteger(value.sets)&&value.sets>0)fresh.history[key]={best:value.best,sets:value.sets};}
 const old=raw.session;if(old?.day!==day||!Array.isArray(old.results)||old.results.length>SET_LENGTH)return fresh;
 try{let session=createSession(day);for(const row of old.results){if(!row||row.level!==session.level||typeof row.success!=='boolean')return fresh;session=recordRound(session,row);}fresh.session=session;}catch{return createState(day);}
 return fresh;
}
