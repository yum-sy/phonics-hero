import assert from 'node:assert/strict'
import { chapters, worlds } from '../src/data/chapters/index.js'
import { bindParentSweep, PARENT_ROUND_TRIPS } from '../src/parent-command.js'
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
const win=new EventTarget(),doc=new EventTarget();doc.hidden=false;globalThis.window=win;globalThis.document=doc
const target=new EventTarget();target.isConnected=true;target.textContent='Worlds';target.getBoundingClientRect=()=>({left:0,right:200,top:0,bottom:50,width:200,height:50});target.setPointerCapture=()=>{};target.hasPointerCapture=()=>false
globalThis.NodeFilter={SHOW_TEXT:4};doc.createTreeWalker=()=>{let done=false;return{currentNode:target,nextNode(){if(done)return false;done=true;return true}}};doc.createRange=()=>({setStart(){},setEnd(){},getBoundingClientRect:target.getBoundingClientRect})
const send=(to,type,extra={})=>{const e=new Event(type,{cancelable:true});Object.assign(e,{pointerId:1,button:0,isPrimary:true,clientX:2,clientY:25,...extra});to.dispatchEvent(e)}
let toggles=0;const cleanup=bindParentSweep(target,()=>toggles++)
const move=x=>send(win,'pointermove',{clientX:x})
const trips=n=>{for(let i=0;i<n;i++){move(198);move(2)}}
const start=()=>send(target,'pointerdown')
const end=()=>send(win,'pointerup')
start();trips(4);assert.equal(toggles,0);move(198);assert.equal(toggles,0);move(2);assert.equal(toggles,1);trips(10);assert.equal(toggles,1);end()
start();trips(5);assert.equal(toggles,2);end()
send(target,'pointerdown',{clientX:100});trips(5);assert.equal(toggles,2);end()
send(target,'pointerdown',{clientX:198});trips(5);assert.equal(toggles,2);end()
start();for(let i=0;i<30;i++){move(5);move(10)}assert.equal(toggles,2);end()
start();trips(4);end();start();trips(1);assert.equal(toggles,2);end()
const cancels=[
 ['pointercancel',()=>send(win,'pointercancel')],
 ['outside-y',()=>send(win,'pointermove',{clientY:100})],
 ['outside-x',()=>move(250)],
 ['blur',()=>send(win,'blur')],
 ['resize',()=>send(win,'resize')],
 ['hidden',()=>{doc.hidden=true;send(doc,'visibilitychange');doc.hidden=false}],
 ['navigation',()=>cleanup.cancel()],
 ['second-pointer',()=>send(win,'pointerdown',{pointerId:2,isPrimary:false})],
 ['lost-capture',()=>send(target,'lostpointercapture')],
]
for(const[name,cancel]of cancels){start();trips(4);cancel();trips(1);assert.equal(toggles,2,name);end()}
start();trips(4);target.isConnected=false;trips(1);assert.equal(toggles,2);target.isConnected=true;end()
start();cleanup();trips(5);assert.equal(toggles,2)
console.log(JSON.stringify({passed:true,roundTrips:PARENT_ROUND_TRIPS,checks:['four-trips-incomplete','fifth-return-toggle','one-toggle-per-gesture','second-toggle','wrong-middle-start','wrong-right-start','jitter','release-resets',...cancels.map(([name])=>name),'disconnected','cleanup','all-three-lock-levels','session-reload','earned-progress-exact','review-isolation']},null,2))
