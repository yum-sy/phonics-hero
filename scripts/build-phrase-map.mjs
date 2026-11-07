// Generates src/data/phrasebook.js: every child-facing Korean string in the
// chapters (instructionKo / recapKo / recapAudio.ko) plus the fixed Korean
// literals screens.js shows or speaks, each mapped to a phrase FAMILY (one
// English template that repeats identically everywhere) with slot values.
//
// Korean stays verbatim in the chapter files -- this only derives English.
// Run: node scripts/build-phrase-map.mjs   (deterministic; re-run after any
// chapter text change; validateChapters() fails on unmapped strings.)
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'src/data/phrasebook.js')
const { chapters } = await import(path.join(ROOT, 'src/data/chapters/index.js'))

// ---- slot grammars ------------------------------------------------------
const L = '[A-Z]{1,3}' // letter / digraph / trigraph
const SP = '[A-Z]{1,3}(?:-[A-Z]{1,3})+' // S-A-T
const W = '[A-Z]{2,}' // boss word, uppercase
const w = '[a-z]+' // word as written
const q = '["“”]'
const ORD = { 첫: 'first', 두: 'second', 세: 'third', 네: 'fourth' }
const COUNT = { 두: 'two', 세: 'three', 네: 'four' }
// Korean letter NAMES used by the spoken ch1-7 recaps -> English letter.
const LETTER_NAME = {
  에스: 'S', 에이: 'A', 티: 'T', 아이: 'I', 피: 'P', 엔: 'N', 씨: 'C', 케이: 'K', 키: 'K',
  이: 'E', 에이치: 'H', 아르: 'R', 엠: 'M', 디: 'D', 지: 'G', 오: 'O', 유: 'U', 을: 'L',
  에프: 'F', 비: 'B', 에이아이: 'AI', 제이: 'J', 오에이: 'OA',
}
const letterName = (name) => {
  const v = LETTER_NAME[name]
  if (!v) throw new Error(`unknown Korean letter name: ${name}`)
  return v
}
const words = (s) => s.split(/,\s*/).map((x) => x.trim()).filter(Boolean)
const joinAnd = (list) => (list.length <= 1 ? list.join('') : `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}`)

// Trailing parenthetical notes some instructions carry, e.g. "(연습이에요)".
const NOTE_EN = {
  '연습이에요': 'Practice',
  '보기가 늘었어요': 'More choices',
  '두 개예요': 'Two of them',
  'R까지 이으면 STR이 돼요': 'Add R and you get STR',
}

// ---- families -----------------------------------------------------------
// [key, field, regex (with capture groups), slots(m, ctx), en template]
// Slot names: letter/letter2/letter3, word/word2, words, WORD/WORD2,
// spelled/spelled2, sound, blend, n (ordinal word), count (number word),
// chapter, world, digraph, base, label, tail (pre-chosen English fragment).
const I = 'instruction', R = 'recap', A = 'audio', U = 'ui'
const F = [
  // ---- instructionKo ----
  ['repeat-words-one-by-one', I, /^(?:들려주는 )?단어를 하나씩 따라 말해보세요!$/, () => ({}), 'Say each word after me!'],
  ['find-starts-like-word', I, new RegExp(`^${q}(${w})${q}[과와] 같은 소리로 시작하는 걸 찾아보세요!$`), (m) => ({ word: m[1] }), 'Find the one that starts like "{word}"!'],
  ['find-ends-like-word', I, new RegExp(`^${q}(${w})${q}[과와] 같은 소리로 끝나는 걸 찾아보세요!$`), (m) => ({ word: m[1] }), 'Find the one that ends like "{word}"!'],
  ['find-has-like-word', I, new RegExp(`^${q}(${w})${q}[과와] 같은 소리가 들어있는 걸 찾아보세요!$`), (m) => ({ word: m[1] }), 'Find the one that has the same sound as "{word}"!'],
  ['multiselect-start-like-word', I, new RegExp(`^${q}(${w})${q}[과와] 같은 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!$`), (m) => ({ word: m[1] }), 'Pick all that start like "{word}", then tap ✓!'],
  ['multiselect-start-with-sound', I, /^(\/[a-z]+\/) 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!$/, (m) => ({ sound: m[1] }), 'Pick all that start with the {sound} sound, then tap ✓!'],
  ['final-attack-shout', I, /^마지막 공격! 큰 소리로 말해보세요!$/, () => ({}), 'Final attack! Say it loud!'],
  ['final-attack-this-sound', I, /^마지막 공격! 이 소리로 크게 외쳐보세요!$/, () => ({}), 'Final attack! Shout this sound!'],
  ['final-attack-letter-sound', I, new RegExp(`^마지막 공격! (${L}) 소리로 크게 외쳐보세요!$`), (m) => ({ letter: m[1] }), 'Final attack! Shout the {letter} sound!'],
  ['final-combo-attack-words', I, new RegExp(`^마지막 합체 공격! (${W})!(?: (${W})!)?$`), (m) => (m[2] ? { WORD: m[1], WORD2: m[2] } : { WORD: m[1] }), 'Final combo attack! {WORD}!{WORD2? {WORD2}!}'],
  ['choose-letter-from-sound-review', I, /^소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요\.$/, () => ({}), 'Listen, pick the right letter, then tap ✓! Old letters show up too.'],
  ['choose-letter-from-sound', I, /^소리를 듣고 맞는 글자를 고르고 ✓를 누르세요!$/, () => ({}), 'Listen, pick the right letter, then tap ✓!'],
  ['choose-letter-for-sound-generic', I, /^소리에 맞는 글자를 고르고 ✓를 누르세요!$/, () => ({}), 'Pick the letter for the sound, then tap ✓!'],
  ['find-real-word', I, /^진짜 단어를 찾아보세요!$/, () => ({}), 'Find the real word!'],
  ['choose-letter-for-this-sound', I, /^이 소리를 내는 글자를 고르고 ✓를 누르세요!$/, () => ({}), 'Pick the letter for this sound, then tap ✓!'],
  ['find-letter-for-this-sound', I, /^이 소리를 내는 글자를 찾아보세요!$/, () => ({}), 'Find the letter for this sound!'],
  ['choose-letter-for-letter-sound', I, new RegExp(`^(${L}) 소리를 내는 글자를 고르고 ✓를 누르세요!$`), (m) => ({ letter: m[1] }), 'Pick the letter that makes the {letter} sound, then tap ✓!'],
  ['find-letter-for-letter-sound', I, new RegExp(`^(${L}) 소리를 내는 글자를 찾아보세요!$`), (m) => ({ letter: m[1] }), 'Find the letter that makes the {letter} sound!'],
  ['multiselect-letters-for-sound', I, new RegExp(`^(${L}) 소리를 내는 글자를 모두 고르고 ✓를 누르세요!$`), (m) => ({ letter: m[1] }), 'Pick all letters that make the {letter} sound, then tap ✓!'],
  ['review-two-sounds-choose', I, new RegExp(`^(${L})[과와랑이가은는을를의도] (${L}) 소리를 다시 연습해요! 이 소리를 내는 글자를 고르고 ✓를 누르세요!$`), (m) => ({ letter: m[1], letter2: m[2] }), "Let's practice {letter} and {letter2} again! Pick the letter for this sound, then tap ✓!"],
  ['shout-together', I, /^함께 외쳐볼까요\?$/, () => ({}), "Let's shout it together!"],
  ['find-picture-with-letter', I, /^이 글자가 들어있는 그림을 찾아보세요!$/, () => ({}), 'Find the picture with this letter!'],
  ['find-picture-start-with-letter', I, /^이 글자로 시작하는 그림을 찾아보세요!$/, () => ({}), 'Find the picture that starts with this letter!'],
  ['find-picture-end-with-sound', I, /^이 (?:소리|글자)로 끝나는 그림을 찾아보세요!$/, () => ({}), 'Find the picture that ends with this sound!'],
  ['find-picture-with-this-sound', I, /^이 소리가 들어있는 그림을 찾아보세요!$/, () => ({}), 'Find the picture with this sound!'],
  ['find-picture-with-these-sounds', I, /^이 소리들이 들어있는 그림을 찾아보세요!$/, () => ({}), 'Find the picture with these sounds!'],
  ['find-picture-blend-like-word', I, new RegExp(`^(${w})처럼 (${L})랑 (${L}) 소리가 이어지는 그림을 찾아보세요!$`), (m) => ({ word: m[1], letter: m[2], letter2: m[3] }), 'Find the picture where {letter} and {letter2} blend, like "{word}"!'],
  ['multiselect-pictures-with-sound', I, new RegExp(`^(${L}) 소리가 들어있는 (?:그림을|걸) 모두 고르고 ✓를 누르세요!$`), (m) => ({ letter: m[1] }), 'Pick all pictures with the {letter} sound, then tap ✓!'],
  ['multiselect-sound-in-middle', I, new RegExp(`^(${L}) 소리가 가운데 들어있는 걸 모두 고르고 ✓를 누르세요!$`), (m) => ({ letter: m[1] }), 'Pick all with the {letter} sound in the middle, then tap ✓!'],
  ['multiselect-end-with-sound', I, new RegExp(`^(${L}) 소리로 끝나는 그림을 모두 고르고 ✓를 누르세요!$`), (m) => ({ letter: m[1] }), 'Pick all that end with the {letter} sound, then tap ✓!'],
  ['oddoneout-start', I, /^다른 소리로 시작하는 걸 (?:찾아보세요!|고르고 ✓를 누르세요!)$/, () => ({}), 'Find the one that starts with a different sound!'],
  ['oddoneout-has', I, /^다른 소리가 들어있는 걸 찾아보세요!$/, () => ({}), 'Find the one with a different sound!'],
  ['build-word-in-order', I, /^글자를 순서대로 옮겨서 단어를 완성하세요!$/, () => ({}), 'Move the letters in order to build the word!'],
  ['build-word-scrambled', I, /^이번엔 글자가 섞여있어요! 순서대로 옮겨보세요\.$/, () => ({}), 'Now the letters are mixed up! Put them in order.'],
  ['now-build-word', I, new RegExp(`^이제 (${w}|${W})[을를] 만들어요! 순서대로 옮겨보세요\\.$`), (m) => ({ word: m[1] }), 'Now let\'s build "{word}"! Move the letters in order.'],
  ['now-word-shout', I, new RegExp(`^이번엔 (${w}|${W})(?:이에요|예요|가에요)! 함께 외쳐볼까요\\?$`), (m) => ({ word: m[1] }), 'Now it\'s "{word}"! Shout it together!'],
  ['fusion-build-first-word', I, new RegExp(`^(?:세 히어로가|두 히어로가|히어로가) 합체해요! 먼저 (${w}|${W})[을를] 만들어요\\.$`), (m) => ({ word: m[1] }), 'Heroes, combine! First, let\'s build "{word}".'],
  ['fusion-listen-slowly', I, /^세 히어로가 합체해요! 천천히 들어보세요\.$/, () => ({}), 'Three heroes, combine! Listen slowly.'],
  ['build-word-read-loud', I, /^단어를 만들고, 큰 소리로 읽어보세요!$/, () => ({}), 'Build the word and read it out loud!'],
  ['repeat-slowly', I, /^천천히 따라 말해보세요\.$/, () => ({}), 'Say it slowly after me.'],
  ['repeat-word-slowly-too', I, new RegExp(`^(${w}|${W})도 천천히 따라 말해보세요\\.$`), (m) => ({ word: m[1] }), 'Say "{word}" slowly too.'],
  ['trace-lowercase', I, /^손가락으로 소문자 ([a-z]{1,2})[를을] 그려볼까요\? 함께 외쳐요!$/, (m) => ({ letter: m[1] }), 'Trace small {letter} with your finger! Shout it together!'],
  ['trace-uppercase', I, new RegExp(`^손가락으로 (${L})[를을] (?:그려볼까요\\? 함께 외쳐요!|따라 그리면서(?: ${L})? 소리를 내보세요!)$`), (m) => ({ letter: m[1] }), 'Trace {letter} with your finger and make its sound!'],
  ['trace-two-letters-blend', I, new RegExp(`^손가락으로 (${L})[와과] (${L})[를을] 따라 그리면서 (?:두 )?소리를 이어보세요!$`), (m) => ({ letter: m[1], letter2: m[2] }), 'Trace {letter} and {letter2}, then blend the sounds!'],
  ['hero-blends-word-fast', I, new RegExp(`^히어로가 ${q}(${w})${q}에 숨어있는 소리들을 들려줘요! 소리를 빠르게 이어서 말해보세요\\.$`), (m) => ({ word: m[1] }), 'Hero plays the sounds hiding in "{word}"! Blend them fast!'],
  ['listen-sounds-say-word', I, /^소리를 하나씩 듣고, 이어서 단어를 말해보세요!$/, () => ({}), 'Listen to each sound, then say the word!'],
  ['word-has-this-sound-repeat', I, /^이 소리가 들어있는 단어예요! 따라 말해보세요\.$/, () => ({}), 'This word has that sound! Say it after me.'],
  ['word-starts-with-this-sound-repeat', I, /^이 소리로 시작하는 단어예요! 따라 말해보세요\.$/, () => ({}), 'This word starts with that sound! Say it after me.'],
  ['word-starts-with-sound-repeat', I, new RegExp(`^(${L}) 소리로 시작하는 단어예요! 따라 말해보세요\\.$`), (m) => ({ letter: m[1] }), 'This word starts with the {letter} sound! Say it after me.'],
  ['word-ends-with-sound-repeat', I, /^이 소리로 끝나는 단어예요! 따라 말해보세요\.$/, () => ({}), 'This word ends with that sound! Say it after me.'],
  ['words-also-have-sound', I, new RegExp(`^이 단어들도 (${L}) 소리가 들어있어요! 따라 말해보세요\\.$`), (m) => ({ letter: m[1] }), 'These words have the {letter} sound too! Say them after me.'],
  ['now-different-sound-repeat', I, /^이번엔 다른 소리예요\. 잘 듣고 따라 말해보세요!$/, () => ({}), 'Now a different sound. Listen and repeat!'],
  ['now-different-sound-listen', I, /^이번엔 다른 소리예요! 함께 들어볼까요\?$/, () => ({}), "Now a different sound! Let's listen together."],
  ['listen-two-sounds-again', I, /^두 소리를 하나씩 다시 들어볼까요\?$/, () => ({}), "Let's hear the two sounds again, one by one."],
  ['blend-two-new-word', I, new RegExp(`^(${L})랑 (${L}) 소리를 이어서 말하면 새 단어가 돼요! 잘 듣고 따라 말해보세요\\.$`), (m) => ({ letter: m[1], letter2: m[2] }), 'Blend {letter} and {letter2} to make a new word! Listen and repeat.'],
  ['blend-shout-again', I, new RegExp(`^(${L})랑 (${L})[를을] 이어서 다시 외쳐볼까요\\?$`), (m) => ({ letter: m[1], letter2: m[2] }), 'Blend {letter} and {letter2} and shout it again!'],
  ['blend-makes-sound-repeat', I, new RegExp(`^(${L}(?:, ${L})*)[와과,] (${L})[를을] 이어서 말하면 '(${L})' 소리가 돼요! 천천히 따라 말해보세요\\.$`), (m) => ({ letters: joinAnd(words(m[1]).concat(m[2])), blend: m[3] }), 'Say {letters} together — that makes "{blend}"! Repeat slowly.'],
  ['hero-plays-new-sound', I, /^히어로가 (?:새로운 )?소리를 들려줘요\. 잘 들어보세요!$/, () => ({}), 'Hero plays a new sound. Listen carefully!'],
  ['hero-plays-two-sounds', I, new RegExp(`^히어로가 (${L})[와과] (${L}) 소리를 나란히 들려줘요! 잘 들어보세요\\.$`), (m) => ({ letter: m[1], letter2: m[2] }), 'Hero plays {letter} and {letter2} side by side! Listen carefully.'],
  ['hero-plays-two-sounds-at-end', I, new RegExp(`^히어로가 (${L})[와과] (${L}) 소리를 나란히 들려줘요! (?:이번엔 |이번에도 )?단어 끝에서 나요\\.$`), (m) => ({ letter: m[1], letter2: m[2] }), 'Hero plays {letter} and {letter2} side by side! They come at the end of the word.'],
  ['hero-shows-more-sounds', I, /^히어로가 (?:또 다른 두 소리를|두 소리를 이어서 내는 법을|세 소리를 이어서 내는 법을) 보여줘요! 먼저 이 소리를 들어보세요\.$/, () => ({}), 'Hero shows how to blend the sounds! First, listen to this one.'],
  ['nth-sound-listen', I, /^(첫|두|세|네) 번째 소리도 들어볼까요\? 따라 말해보세요\.$/, (m) => ({ n: ORD[m[1]] }), "Let's hear the {n} sound too! Say it after me."],
  ['letter-says-own-name', I, new RegExp(`^(${L})는 (${L})가 자기 이름을 말할 때처럼 소리를 내요!$`), (m) => ({ digraph: m[1], base: m[2] }), '{digraph} sounds like {base} saying its name!'],
  ['letter-makes-this-sound', I, new RegExp(`^(${L})[는은] 이런 소리를 내요!$`), (m) => ({ letter: m[1] }), '{letter} makes this sound!'],
  // #17 letter-sound-imagery collapses here (user decision): the Jolly cue chip carries the imagery.
  ['letter-makes-this-sound', I, new RegExp(`^(${L})[는은] .*소리(?:를|로).*(?:내요|울어요)!$`), (m) => ({ letter: m[1] }), '{letter} makes this sound!'],
  ['letter-makes-this-sound', I, new RegExp(`^(?:히어로가|꼬리가|엔진이|상자를|신호가) .*?(${L}) 소리(?:를|로)(?: 길게| 크게)? (?:내요|울어요)!$`), (m) => ({ letter: m[1] }), '{letter} makes this sound!'],
  ['long-short-compare', I, /^긴 소리와 짧은 소리를 비교해서 따라 말해보세요!$/, () => ({}), 'Say the long sound, then the short sound!'],
  ['find-same-shape-letter', I, /^똑같이 생긴 글자를 찾아보세요!$/, () => ({}), 'Find the letter that looks the same!'],
  ['hero-shouts-say-together', I, /^히어로가 외쳐요! 같이 말해볼까요\?$/, () => ({}), 'Hero shouts! Say it together!'],
  // long tail (instruction), per the approved review doc §3
  ['hero-plays-new-sound', I, /^히어로가 (?:골짜기에서 나는|달릴 때 나는) 소리(?:를|예요)\.? ?(?:들려줘요\. )?잘 들어보세요!$/, () => ({}), 'Hero plays a new sound. Listen carefully!'],
  ['c-k-twins-trace', I, /^C와 쌍둥이인 K예요! 손가락으로 K를 그리면서 함께 외쳐요\.$/, () => ({}), "K is C's twin! Trace K and shout it together."],
  ['oo-short-trace', I, /^OO는 book처럼 짧게 소리 낼 수도 있어요! 손가락으로 소문자 oo를 그려볼까요\?$/, () => ({}), 'OO can be short, like book! Trace small oo with your finger.'],
  ['fusion-final-ch33', I, /^세 히어로가 최후의 합체를 해요! 지금까지 배운 모든 소리의 힘을 모아 THREE를 만들어요!$/, () => ({}), "Three heroes, final combination! Gather every sound you've learned to build THREE!"],
  ['now-word-shout-final', I, /^이번엔 SHRIMP예요! 이게 진짜 마지막 소리 합체예요! 함께 외쳐볼까요\?$/, () => ({}), "Now it's SHRIMP! The very last combo! Shout it together!"],
  ['final-attack-ch33', I, /^카봇 파닉스 대작전, 진짜 마지막 공격! 온 힘을 다해 크게 외쳐보세요!$/, () => ({}), 'Phonics Hero — the very last attack! Shout with all your might!'],

  // ---- recapKo (display on the reward screen) ----
  ['recap-blend-pair-examples', R, new RegExp(`^(${w})에는 두 소리가 이어져 있어요 — (${w}), (${w})!$`), (m) => ({ blend: m[1], word: m[2], word2: m[3] }), '"{blend}" is two sounds together — {word}, {word2}!'],
  ['recap-new-combo-found', R, new RegExp(`^새로운 소리 조합을 찾았어요! (${w}), (${w}) — 둘 다 이 소리가 들어있어요!$`), (m) => ({ word: m[1], word2: m[2] }), 'New sound combo found! {word}, {word2} — both have it!'],
  ['recap-know-letters-fusion', R, new RegExp(`^이제 (${L}), (${L})(?:, (${L}))?[를을] 모두 알아요! (?:히어로들이 합체할 준비를 해요|두 히어로가 힘을 합쳐요)!$`), (m) => ({ letters: [m[1], m[2], m[3]].filter(Boolean).join(', ') }), 'Now you know {letters}! The heroes get ready to combine!'],
  ['recap-blended-like-word', R, new RegExp(`^(${L})[와과] (${L}) 소리를 이어봤어요! (${w})처럼요\\.$`), (m) => ({ letter: m[1], letter2: m[2], word: m[3] }), 'You blended {letter} and {letter2} — like "{word}"!'],
  ['recap-sound-found-words', R, new RegExp(`^(\\/[a-z]+\\/) 소리를 찾았어요! ([A-Z][a-z]+(?:, ${w})*)(?:<br>)? ?— 모두 (${L})로 시작해요!$`), (m) => ({ sound: m[1], words: m[2], letter: m[3] }), 'You found the {sound} sound! {words} — they all start with {letter}!'],
  ['recap-new-sound-found-words', R, new RegExp(`^새로운 소리를 찾았어요! ([A-Z][a-z]+(?:, ${w})*)(?:<br>)? ?— (모두 이 소리로 시작해요|둘 다 이 소리가 들어있어요|둘 다 이 소리로 끝나요)!$`), (m) => ({ words: m[1], tail: { '모두 이 소리로 시작해요': 'they all start with this sound', '둘 다 이 소리가 들어있어요': 'both have this sound', '둘 다 이 소리로 끝나요': 'both end with this sound' }[m[2]] }), 'You found a new sound! {words} — {tail}!'],
  ['recap-letter-says-own-name-words', R, new RegExp(`^(${L})[는은] (${L})가 이름을 말할 때 소리를 내요 — (${w}(?:, ${w})*)!$`), (m) => ({ digraph: m[1], base: m[2], words: m[3] }), '{digraph} sounds like {base} saying its name — {words}!'],
  ['recap-letter-sound-words', R, new RegExp(`^(${L})[는은] (?:${L} 소리를 내요|.{2,22} 소리를 내요)(?: —|—|\\.) (${w}(?:, ${w})*)!(?: (.+))?$`), (m) => ({ letter: m[1], words: m[2], tail: recapTail(m[3]) }), '{letter} makes the {letter} sound{words? — {words}}!{tail}'],
  ['recap-letter-sound-words', R, new RegExp(`^(${L})[는은] ${L} 소리를 내요 — (${w}(?:, ${w})*)도 모두 기억해요!$`), (m) => ({ letter: m[1], words: m[2], tail: ' Remember them all!' }), '{letter} makes the {letter} sound{words? — {words}}!{tail}'],
  ['recap-letter-sound-words', R, new RegExp(`^(${L})[는은] ${L} 소리를 내요 — 그리고 (${L})(?:의 ${L} 소리)?도 아직 기억하고 있어요!$`), (m) => ({ letter: m[1], words: '', tail: ` And remember ${m[2]} too!` }), '{letter} makes the {letter} sound{words? — {words}}!{tail}'],
  ['recap-chapter-clear-two-words', R, new RegExp(`^(${SP})[는은] (${W}), (${SP})[는은] (${W})! 단어 두 개를 (?:만들었어요|완성했어요)! 챕터 (\\d+) 클리어!(?: 월드 (\\d+) (?:완성|완결)!)?$`), (m) => ({ spelled: m[1], WORD: m[2], spelled2: m[3], WORD2: m[4], chapter: m[5], tail: m[6] ? ` World ${m[6]} complete!` : '' }), '{spelled} is {WORD}, {spelled2} is {WORD2}! Two words built! Chapter {chapter} clear!{tail}'],
  ['recap-chapter-clear-two-words-plain', R, new RegExp(`^(${W})[와과] (${W})(?:, 단어 두 개)?[를을] 만들었어요! 챕터(?: (\\d+))? 클리어!(?: 월드 (\\d+) (?:완성|완결)!)?$`), (m) => ({ WORD: m[1], WORD2: m[2], chapter: m[3] ? ` ${m[3]}` : '', tail: m[4] ? ` World ${m[4]} complete!` : '' }), 'You built {WORD} and {WORD2}! Chapter{chapter} clear!{tail}'],
  ['recap-chapter-clear-one-word', R, new RegExp(`^(${SP})[는은] (${W})! (첫|두) 번째 진짜 단어를 만들었어요! 챕터 (\\d+) 클리어!$`), (m) => ({ spelled: m[1], WORD: m[2], n: ORD[m[3]], chapter: m[4] }), '{spelled} is {WORD}! Your {n} real word! Chapter {chapter} clear!'],
  ['recap-blend-equals-word', R, new RegExp(`^(${L})\\+(${L}) = (${W})! (소리를 잘 익혔어요|이제 두 블렌드를 모두 알아요)\\.$`), (m) => ({ letter: m[1], letter2: m[2], WORD: m[3], tail: m[4] === '소리를 잘 익혔어요' ? 'You learned the sound.' : 'Now you know both blends.' }), '{letter}+{letter2} = {WORD}! {tail}'],
  ['recap-blend-makes-sound-like-word', R, new RegExp(`^(${L}(?:, ${L})*)[와과,] (${L})[를을] 이으면 '(${L})' 소리가 돼요! (${W})처럼요!$`), (m) => ({ letters: joinAnd(words(m[1]).concat(m[2])), blend: m[3], WORD: m[4] }), '{letters} together make "{blend}" — like {WORD}!'],
  ['recap-practiced-blend-again', R, new RegExp(`^(${L}) 소리를 다시 연습했어요! 이제 (${W})[를을] 잘 만들 수 있어요\\.$`), (m) => ({ blend: m[1], WORD: m[2] }), 'You practiced {blend} again! Now you can build {WORD}.'],
  ['recap-practiced-two-ready', R, new RegExp(`^(${L})[와과] (${L})[를을] 다시 연습했어요! 이제 합체할 준비 완료예요!$`), (m) => ({ letter: m[1], letter2: m[2] }), 'You practiced {letter} and {letter2}! Ready to combine!'],
  ['c-k-twins', R, /^C는 C 소리를 내요\. 그리고 K도 똑같은 K 소리를 내는 쌍둥이예요!$/, () => ({}), 'C and K are twins — they make the same sound!'],
  ['recap-oo-long-short', R, /^OO는 moon처럼 길게, book처럼 짧게도 소리 낼 수 있어요!$/, () => ({}), 'OO can be long like moon or short like book!'],
  ['recap-game-clear', R, /^TH-R-EE는 THREE, SH-R-I-M-P는 SHRIMP! 단어 두 개를 완성했어요! 카봇 파닉스 대작전 완전 정복! 42개 소리를 모두 배우고 마지막 보스까지 무찔렀어요! 정말 대단해요!$/, () => ({}), 'TH-R-EE is THREE, SH-R-I-M-P is SHRIMP! Phonics Hero complete! You learned all 42 sounds and beat the final boss! Amazing!'],

  // ---- recapAudio.ko (spoken) ----
  ['audio-two-words-built', A, /^단어 두 개를 만들었어요! 잘 들어보세요\.$/, () => ({}), 'You built two words! Listen.'],
  ['audio-blended-two', A, /^두 소리를 이어봤어요\. 잘 들어보세요\.$/, () => ({}), 'You blended two sounds. Listen.'],
  ['audio-learned-blended-word', A, /^두 소리가 이어진 단어를 배웠어요\. 잘 들어보세요\.$/, () => ({}), 'You learned a word with two sounds together. Listen.'],
  ['audio-say-sounds-together', A, /^이 소리들을 이어서 말해요\.$/, () => ({}), 'Say these sounds together.'],
  ['audio-learned-new-combo', A, /^새로운 소리 조합을 배웠어요\. 잘 들어보세요\.$/, () => ({}), 'You learned a new sound combo. Listen.'],
  ['audio-learned-new-sound', A, /^새로운 (?:긴 )?소리를 배웠어요\. 잘 들어보세요\.$/, () => ({}), 'You learned a new sound. Listen.'],
  ['audio-new-vowel-sound', A, /^이번엔 새로운 모음 소리예요\. 잘 들어보세요\.$/, () => ({}), "This time it's a new vowel sound. Listen."],
  ['audio-practiced-again', A, /^다시 연습했어요\. 잘 들어보세요\.$/, () => ({}), 'You practiced again. Listen.'],
  ['audio-practiced-two-ready', A, /^두 (?:블렌드|소리)를 다시 연습했어요\. 이제 준비됐어요\.$/, () => ({}), "You practiced both sounds. Now you're ready."],
  ['audio-letter-sound-all-learned', A, /^이 (?:두 )?글자는 이런 소리를 내요\. 이제 (세|두) 소리를 모두 배웠어요\.$/, (m) => ({ count: m[1] === '두' ? 'both' : `all ${COUNT[m[1]]}` }), 'This letter makes this sound. Now you know {count} sounds.'],
  ['audio-letter-sound-examples', A, /^이 (?:두 )?글자는 (?:이런|두 가지) 소리를 내요\. [가-힣]+, [가-힣]+!$/, (m, ctx) => ({ words: ctx.en.slice(0, 2).join(', ') }), 'This letter makes this sound. {words}!'],
  ['audio-letter-name-sound-examples', A, /^([가-힣]+)[는은] 이런 소리를 내요\. [가-힣]+, [가-힣]+!$/, (m, ctx) => ({ letter: letterName(m[1]), words: ctx.en.slice(0, 2).join(', ') }), '{letter} makes this sound. {words}!'],
  ['audio-found-sound-listen', A, /^([가-힣]+) 소리를 찾았어요! 잘 들어보세요\.$/, (m) => ({ letter: letterName(m[1]) }), 'You found the {letter} sound! Listen.'],
  ['audio-letter-sound-repeat', A, /^([가-힣]+)[는은] 이런 소리를 내요\. 따라 말해볼까요\?$/, (m) => ({ letter: letterName(m[1]) }), '{letter} makes this sound. Say it after me.'],
  ['audio-letter-sound-listen', A, /^([가-힣]+)[는은] 이런 소리를 내요\. 잘 들어보세요\.$/, (m) => ({ letter: letterName(m[1]) }), '{letter} makes this sound. Listen.'],
  ['audio-letter-sound-remember', A, /^([가-힣]+)[는은] 이런 소리를 내요\. ([가-힣]+)(?: 소리)?도 (?:아직 )?기억하고 있어요\.$/, (m) => ({ letter: letterName(m[1]), letter2: letterName(m[2]) }), '{letter} makes this sound. Remember {letter2} too.'],
  ['audio-letter-sound-all-three', A, /^([가-힣]+)[는은] 이런 소리를 내요\. (?:이제 )?세 소리를 모두 배웠어요\.$/, (m) => ({ letter: letterName(m[1]) }), '{letter} makes this sound. Now you know all three sounds.'],
  ['audio-letter-sound-differs', A, /^([가-힣]+)[는은] 이런 소리를 내요\. ([가-힣]+) 소리와 다르니 잘 들어보세요\.$/, (m) => ({ letter: letterName(m[1]), letter2: letterName(m[2]) }), "{letter} makes this sound. It's not {letter2} — listen closely."],
  ['audio-three-sounds-nth-word', A, /^세 소리를 합쳐서 (첫|두) 번째 단어를 만들었어요!$/, (m) => ({ n: ORD[m[1]] }), 'You put three sounds together and built your {n} word!'],
  ['audio-r-sound', A, /^아르는 이런 소리를 내요\. 혀를 굴려보세요\.$/, () => ({}), 'R makes this sound. Listen.'],
  ['c-k-twins-audio', A, /^씨와 케이는 소리가 똑같아요\. 쌍둥이예요!$/, () => ({}), 'C and K are twins — they make the same sound!'],

  // ---- fixed child-facing literals in screens.js (shown or spoken) ----
  ['ui-correct', U, /^정답이에요!$/, () => ({}), 'Correct!'],
  ['ui-only-this-word-different', U, /^이 단어만 다른 소리를 내요\.$/, () => ({}), 'Only this word has a different sound.'],
  ['ui-correct-only-label-different', U, /^정답이에요! \{label\}만 다른 소리를 내요\.$/, () => ({}), 'Correct! Only {label} sounds different.'],
  ['ui-correct-read-aloud', U, /^정답이에요! 이제 소리내어 읽어볼까요\?$/, () => ({}), 'Correct! Now read it out loud.'],
  ['ui-attack-read-cheer', U, /^따라 읽고, 목소리로 응원해요!$/, () => ({}), 'Read it, then cheer out loud!'],
  ['ui-attack-shout', U, /^소리쳐봐요! 🎤$/, () => ({}), 'Shout! 🎤'],
  ['ui-attack-shout-again', U, /^다시 ATTACK을 눌러서 소리쳐봐요!$/, () => ({}), 'Tap ATTACK and shout again!'],
  ['ui-retry-listen', U, /^다시 들어볼까요\?$/, () => ({}), 'Listen again?'],
  ['ui-retry-look', U, /^다시 봐볼까요\?$/, () => ({}), 'Look again?'],
  ['ui-retry-pick', U, /^다시 골라볼까요\?$/, () => ({}), 'Pick again?'],
  ['ui-more-left', U, /^아직 더 있어요!$/, () => ({}), "There's more!"],
  ['ui-build-wrong-order', U, /^순서가 달라요! ↺ Undo 로 빼요$/, () => ({}), 'Wrong order! Tap ↺ Undo.'],
  ['ui-build-start-over', U, /^처음부터 같이 해볼까요\?$/, () => ({}), "Let's start over together."],
  ['ui-build-undo-one', U, /^↺ Undo 로 한 글자 빼요$/, () => ({}), '↺ Undo removes one letter.'],
  ['ui-boss-tap-continue', U, /^탭하면 계속해요!$/, () => ({}), 'Tap to continue!'],
  ['ui-recovery', U, /^앗, 여기서 잠깐 문제가 생겼어요\.$/, () => ({}), 'Oops, something went wrong here.'],
]

// Optional English tail for recap-letter-sound-words (ch1-14 reward lines).
function recapTail(ko) {
  if (!ko) return ''
  let m
  if ((m = ko.match(/^그리고 ([A-Z]{1,3})의 [A-Z]{1,3} 소리도 기억하고 있어요!$/))) return ` And remember ${m[1]} too!`
  if ((m = ko.match(/^([A-Z]{1,3})(?:의 [A-Z]{1,3})? 소리도 (?:아직 )?기억하고 있어요!$/))) return ` Remember ${m[1]} too!`
  if ((m = ko.match(/^([A-Z]{1,3})의 [A-Z]{1,3} 소리와 헷갈리지 마세요!$/))) return ` Don't mix it up with ${m[1]}!`
  if (/^혀를 굴려서 R!$/.test(ko)) return '' // Korean-learner tongue cue: dropped on purpose (CLAUDE.md)
  throw new Error(`unknown recap tail: ${ko}`)
}

// Fixed literals screens.js shows/speaks to the child (parent-mode and the
// audio-credit footer are adult-facing and deliberately excluded).
const UI_LITERALS = [
  '정답이에요!', '이 단어만 다른 소리를 내요.', '정답이에요! {label}만 다른 소리를 내요.',
  '정답이에요! 이제 소리내어 읽어볼까요?', '따라 읽고, 목소리로 응원해요!', '소리쳐봐요! 🎤',
  '다시 ATTACK을 눌러서 소리쳐봐요!', '다시 들어볼까요?', '다시 봐볼까요?', '다시 골라볼까요?',
  '아직 더 있어요!', '순서가 달라요! ↺ Undo 로 빼요', '처음부터 같이 해볼까요?', '↺ Undo 로 한 글자 빼요',
  '탭하면 계속해요!', '앗, 여기서 잠깐 문제가 생겼어요.', '소리에 맞는 글자를 고르고 ✓를 누르세요!',
]
const screensSrc = fs.readFileSync(path.join(ROOT, 'src/screens.js'), 'utf8')
for (const lit of UI_LITERALS) {
  // Templated literals ("{label}") are reached through phraseByKey(), not by text.
  if (lit.includes('{')) continue
  if (!screensSrc.includes(lit)) console.warn(`warn: literal not found in screens.js (stale list?): ${lit}`)
}

// ---- collect ------------------------------------------------------------
const NOTE_RE = /\s*\(([^()]*)\)\s*$/
const occurrences = [] // { text, field, where, en[] }
for (const ch of chapters) {
  for (const st of ch.stages) {
    const where = `${ch.id}/${st.id}`
    const en = st.recapAudio?.en ?? []
    if (typeof st.recapKo === 'string') occurrences.push({ text: st.recapKo, field: R, where, en })
    if (typeof st.recapAudio?.ko === 'string') occurrences.push({ text: st.recapAudio.ko, field: A, where, en })
    for (const b of st.beats ?? []) {
      if (typeof b.instructionKo === 'string') occurrences.push({ text: b.instructionKo, field: I, where: `${where}/${b.id}`, en })
    }
  }
}
for (const lit of UI_LITERALS) occurrences.push({ text: lit, field: U, where: 'screens.js', en: [] })

const map = new Map() // ko -> { key, slots, note? }
const counts = new Map()
const unmapped = []
for (const o of occurrences) {
  const ko = o.text.trim()
  let text = ko
  let note = null
  const nm = text.match(NOTE_RE)
  if (nm) {
    note = nm[1]
    text = text.slice(0, nm.index).trim()
  }
  let hit = null
  for (const f of F) {
    if (f[1] !== o.field && !(o.field === I && f[1] === U) && !(o.field === U && f[1] === I)) continue
    const m = text.match(f[2])
    if (m) {
      hit = { key: f[0], slots: f[3](m, { en: o.en, where: o.where }) }
      break
    }
  }
  if (!hit) {
    unmapped.push(`${o.where}: ${ko}`)
    continue
  }
  counts.set(hit.key, (counts.get(hit.key) ?? 0) + 1)
  const prev = map.get(ko)
  if (prev && (prev.key !== hit.key || JSON.stringify(prev.slots) !== JSON.stringify(hit.slots))) {
    throw new Error(`same KO string mapped two ways: ${ko}`)
  }
  const entry = { key: hit.key, slots: hit.slots }
  if (note) entry.note = NOTE_EN[note] ?? (() => { throw new Error(`unknown note: (${note})`) })()
  map.set(ko, entry)
}

if (unmapped.length) {
  console.error(`UNMAPPED (${unmapped.length}):\n` + unmapped.join('\n'))
  process.exit(1)
}

// ---- emit ---------------------------------------------------------------
const families = {}
for (const f of F) {
  if (families[f[0]]) {
    if (families[f[0]].en !== f[4] || families[f[0]].field !== f[1]) throw new Error(`family ${f[0]} defined twice with different en/field`)
    continue
  }
  families[f[0]] = { en: f[4], field: f[1] }
}
const ranked = Object.keys(families).sort((a, b) => (counts.get(b) ?? 0) - (counts.get(a) ?? 0) || a.localeCompare(b))
ranked.forEach((k, i) => { families[k].rank = i + 1; families[k].n = counts.get(k) ?? 0 })
const unusedFamilies = ranked.filter((k) => !counts.get(k))
if (unusedFamilies.length) console.warn('warn: families with 0 occurrences:', unusedFamilies.join(', '))

const sortedKo = [...map.keys()].sort((a, b) => a.localeCompare(b, 'ko'))
const js = (v) => JSON.stringify(v)
let out = `// GENERATED by scripts/build-phrase-map.mjs -- do not edit by hand.
// Phrasebook: each child-facing Korean string (kept verbatim in the chapter
// files and screens.js) maps to a phrase family. A family is ONE English
// template that repeats identically everywhere it applies, so the child meets
// the same English sentence for the same situation every time (the whole
// point of the Korean -> English transition). Slots are filled per string.
//
// Rebuild after any chapter text change: node scripts/build-phrase-map.mjs
// validateChapters() (dev only) fails on a string this map does not know.

export const PHRASE_FAMILIES = {
${ranked.map((k) => `  ${js(k)}: { en: ${js(families[k].en)}, field: ${js(families[k].field)}, rank: ${families[k].rank}, n: ${families[k].n} },`).join('\n')}
}

export const PHRASE_KEYS_BY_RANK = Object.freeze([
${ranked.map((k) => `  ${js(k)},`).join('\n')}
])

export const PHRASE_MAP = {
${sortedKo.map((ko) => `  ${js(ko)}: ${js(map.get(ko))},`).join('\n')}
}

// ---- runtime helpers (hand-written, kept below the generated data) ----

// Fills {slot} placeholders. A "{name? inner}" segment is emitted (with its
// own {slot}s filled) only when that slot is set -- used for an optional
// second boss word. Unknown slots become ''.
export function fillTemplate(template, slots = {}) {
  return template
    .replace(/\\{(\\w+)\\?((?:[^{}]|\\{\\w+\\})*)\\}/g, (_, name, inner) => (slots[name] ? inner : ''))
    .replace(/\\{(\\w+)\\}/g, (_, name) => (slots[name] ?? ''))
    .replace(/[ ]{2,}/g, ' ')
    .trim()
}

// Looks a Korean string up by exact text (trimmed). Returns null when the
// string is not in the phrasebook -- callers fall back to the Korean.
export function phraseFor(koText) {
  const entry = PHRASE_MAP[String(koText ?? '').trim()]
  if (!entry) return null
  const fam = PHRASE_FAMILIES[entry.key]
  let en = fillTemplate(fam.en, entry.slots)
  if (entry.note) en += \` (\${entry.note})\`
  return { key: entry.key, en, slots: entry.slots, note: entry.note ?? null, rank: fam.rank, field: fam.field }
}

export function englishFor(koText) {
  return phraseFor(koText)?.en ?? null
}

// For templated UI strings whose Korean is built at runtime (e.g. the
// odd-one-out feedback that embeds the tapped option's label).
export function phraseByKey(key, slots = {}) {
  const fam = PHRASE_FAMILIES[key]
  return fam ? fillTemplate(fam.en, slots) : null
}
`
fs.writeFileSync(OUT, out)
console.log(`families ${ranked.length} · ko strings ${map.size} · occurrences ${occurrences.length} · unmapped ${unmapped.length}`)
console.log('wrote', path.relative(ROOT, OUT), `${out.length} chars`)
