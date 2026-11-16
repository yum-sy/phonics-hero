import assert from 'node:assert/strict'
import { chapters, worlds } from '../src/data/chapters/index.js'
import { bindParentTaps, PARENT_TAP_COUNT, PARENT_TAP_GAP_MS, PARENT_TAP_WINDOW_MS, PARENT_TAP_HOLD_MS } from '../src/parent-command.js'
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
state.toggleParentAccess(); assert.equal(sessionStorage.getItem('phonics-hero-parent-access-v2'),'1')
state.enableReviewMode(); assert.equal(state.toggleParentAccess(),false); assert.equal(state.isParentAccessEnabled(),false)
assert.deepEqual(locks(),[true,true,true]); assert.equal(sessionStorage.getItem('phonics-hero-parent-access-v2'),'1')
const win=new EventTarget(),doc=new EventTarget();doc.hidden=false;globalThis.window=win;globalThis.document=doc
const target=new EventTarget();target.isConnected=true;target.getBoundingClientRect=()=>({left:0,right:200,top:0,bottom:50,width:200,height:50});target.setPointerCapture=()=>{};target.hasPointerCapture=()=>false
const send=(to,type,extra={})=>{const e=new Event(type,{cancelable:true});Object.assign(e,{pointerId:1,button:0,isPrimary:true,clientX:100,clientY:25,...extra});to.dispatchEvent(e)}
let now=1000;const realNow=Date.now;Date.now=()=>now
let opened=0;const cleanup=bindParentTaps(target,()=>opened++)
const tap=(gap=0,hold=10)=>{now+=gap;send(target,'pointerdown');now+=hold;send(win,'pointerup');send(target,'click')}
const taps=(n,gap=0)=>{for(let i=0;i<n;i++)tap(gap)}
const checks=[];const check=(name,fn)=>{cleanup.cancel();const before=opened;fn(before);checks.push(name)}
check('six-not-seven',b=>{taps(6);assert.equal(opened,b);tap();assert.equal(opened,b+1)})
check('fast-no-debounce-no-duplicate-click',b=>{taps(7);assert.equal(opened,b+1);taps(6);assert.equal(opened,b+1)})
check('slow-seven-within-window',b=>{taps(7,2000);assert.equal(opened,b+1)})
check('gap-timeout-resets',b=>{taps(6);tap(PARENT_TAP_GAP_MS+1);assert.equal(opened,b);taps(6);assert.equal(opened,b+1)})
check('total-window-resets',b=>{for(let i=0;i<7;i++)tap(2400,200);assert.equal(opened,b)})
check('long-hold-not-tap',b=>{taps(6);tap(0,PARENT_TAP_HOLD_MS+1);assert.equal(opened,b);tap();assert.equal(opened,b)})
check('pointerup-counts-once',b=>{taps(6);send(target,'pointerdown');assert.equal(opened,b);send(win,'pointerup');assert.equal(opened,b+1);send(win,'pointerup');send(target,'click');assert.equal(opened,b+1)})
check('drag-resets',b=>{taps(6);send(target,'pointerdown');send(win,'pointermove',{clientX:150});send(win,'pointerup',{clientX:150});assert.equal(opened,b);tap();assert.equal(opened,b)})
const cancels=[['pointercancel',()=>send(win,'pointercancel')],['blur',()=>send(win,'blur')],['resize',()=>send(win,'resize')],['hidden',()=>{doc.hidden=true;send(doc,'visibilitychange');doc.hidden=false}],['navigation',()=>cleanup.cancel()],['second-pointer',()=>send(win,'pointerdown',{pointerId:2,isPrimary:false})],['lost-capture',()=>send(target,'lostpointercapture')]]
for(const[name,cancel]of cancels)check(name,b=>{taps(6);send(target,'pointerdown');cancel();send(win,'pointerup');assert.equal(opened,b);tap();assert.equal(opened,b)})
check('disconnected',b=>{taps(6);target.isConnected=false;tap();assert.equal(opened,b);target.isConnected=true})
cleanup();const before=opened;taps(7);assert.equal(opened,before);checks.push('cleanup')
Date.now=realNow
const pin=await import('../src/parent-pin.js')
localStorage.setItem('phonics-poke-parent-pin-v1','9876')
assert.equal(pin.readParentPin(),'0000');pin.saveParentPin('1234');assert.equal(pin.readParentPin(),'1234');assert.throws(()=>pin.saveParentPin('123'));assert.throws(()=>pin.saveParentPin('abcd'));checks.push('pin-default-save-format')
assert.equal(localStorage.getItem('phonics-poke-parent-pin-v1'),'9876');checks.push('other-game-pin-isolated')
const originalGet=localStorage.getItem;localStorage.getItem=()=>{throw new Error('blocked')};assert.throws(()=>pin.readParentPin());localStorage.getItem=originalGet;checks.push('pin-read-failure-fails-closed')
const originalSet=localStorage.setItem;localStorage.setItem=()=>{throw new Error('quota')};assert.throws(()=>pin.saveParentPin('5678'));localStorage.setItem=originalSet;assert.equal(pin.readParentPin(),'1234');checks.push('pin-save-failure-preserves-old')
localStorage.setItem(pin.PIN_STORAGE_KEY,'invalid');assert.throws(()=>pin.readParentPin());checks.push('pin-corruption-fails-closed')
console.log(JSON.stringify({passed:true,tapCount:PARENT_TAP_COUNT,gapMs:PARENT_TAP_GAP_MS,windowMs:PARENT_TAP_WINDOW_MS,checks:[...checks,'all-three-lock-levels','session-reload','earned-progress-exact','review-isolation']},null,2))
