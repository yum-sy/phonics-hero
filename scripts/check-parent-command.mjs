import assert from 'node:assert/strict'
import { chapters, worlds } from '../src/data/chapters/index.js'
import { bindParentHold, PARENT_HOLD_MS } from '../src/parent-command.js'
const store = () => { const map = new Map(); return { getItem:k=>map.get(k) ?? null, setItem:(k,v)=>map.set(k,v), removeItem:k=>map.delete(k) } }
globalThis.localStorage=store(); globalThis.sessionStorage=store()
const original = JSON.stringify({clearedStages:['stage-1'],stars:{'stage-1':3},checkpoint:null})
localStorage.setItem('carbot-phonics-progress-v1',original)
const state = await import('../src/state.js')
assert.equal(state.isParentAccessEnabled(),false)
const locks = () => [state.isWorldUnlocked(worlds,worlds.at(-1).id),state.isChapterUnlocked(chapters,chapters.at(-1).id),state.isStageUnlocked(chapters[0].stages,chapters[0].stages[4].id)]
assert.deepEqual(locks(),[false,false,false])
state.toggleParentAccess(); assert.deepEqual(locks(),[true,true,true])
assert.equal(localStorage.getItem('carbot-phonics-progress-v1'),original)
const reloaded=await import('../src/state.js?parent-reload'); assert.equal(reloaded.isParentAccessEnabled(),true)
state.toggleParentAccess(); assert.deepEqual(locks(),[false,false,false]); assert(state.isStageCleared('stage-1'))
assert.equal(localStorage.getItem('carbot-phonics-progress-v1'),original)
state.toggleParentAccess(); assert.equal(sessionStorage.getItem('phonics-hero-parent-access-v1'),'1')
state.enableReviewMode(); assert.equal(state.toggleParentAccess(),false); assert.equal(state.isParentAccessEnabled(),false)
assert.deepEqual(locks(),[true,true,true]); assert.equal(sessionStorage.getItem('phonics-hero-parent-access-v1'),'1')
let now=0,seq=0;const timers=new Map()
const realSet=globalThis.setTimeout,realClear=globalThis.clearTimeout
globalThis.setTimeout=(fn,delay)=>{timers.set(++seq,{fn,at:now+delay});return seq};globalThis.clearTimeout=id=>timers.delete(id)
const tick=ms=>{now+=ms; for(const [id,t]of[...timers])if(t.at<=now){timers.delete(id);t.fn()}}
const win=new EventTarget(),doc=new EventTarget();doc.hidden=false;globalThis.window=win;globalThis.document=doc
const target=new EventTarget();target.isConnected=true;target.getBoundingClientRect=()=>({left:0,right:100,top:0,bottom:50});target.setPointerCapture=()=>{};target.hasPointerCapture=()=>false
const send=(to,type,extra={})=>{const e=new Event(type,{cancelable:true});Object.assign(e,{pointerId:1,button:0,isPrimary:true,clientX:10,clientY:10,...extra});to.dispatchEvent(e)}
let toggles=0;const cleanup=bindParentHold(target,()=>toggles++)
send(target,'pointerdown');tick(PARENT_HOLD_MS-1);assert.equal(toggles,0);send(win,'pointerup');tick(1);assert.equal(toggles,0)
send(target,'pointerdown');tick(PARENT_HOLD_MS);assert.equal(toggles,1);tick(PARENT_HOLD_MS*2);assert.equal(toggles,1);send(win,'pointerup')
send(target,'pointerdown');tick(PARENT_HOLD_MS);assert.equal(toggles,2);send(win,'pointerup')
for(const cancel of [()=>send(win,'pointercancel'),()=>send(win,'pointermove',{clientX:150}),()=>send(win,'blur'),()=>{doc.hidden=true;send(doc,'visibilitychange');doc.hidden=false},()=>cleanup.cancel()]){
 send(target,'pointerdown');tick(5000);cancel();tick(PARENT_HOLD_MS);assert.equal(toggles,2)
}
send(target,'pointerdown');cleanup();tick(PARENT_HOLD_MS);assert.equal(toggles,2)
globalThis.setTimeout=realSet;globalThis.clearTimeout=realClear
console.log(JSON.stringify({passed:true,holdMs:PARENT_HOLD_MS,checks:['short-hold','11s-toggle','one-toggle-per-hold','second-toggle','pointercancel','move-off','blur','hidden','beat/navigation-cleanup','all-three-lock-levels','session-reload','earned-progress-exact','review-isolation']},null,2))
