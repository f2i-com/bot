// bot.computer conversation: talk with a character, entirely inside this browser tab.
//
//   your voice → stt.wasm (stt.computer)        → words
//   words      → the bot.computer AIML brain    → a reply, gestures and a mood
//   the reply  → tts.wasm (tts.computer)        → the character's voice, which also drives the
//                avatar's lips, jaw and tongue 200 times a second
//
// The microphone works like a walkie-talkie: it is paused while the character talks, so the
// character never hears itself, and your turn ends once you have been quiet for a moment.
// You can talk with one of the starting characters, or with the bot you designed in the studio.

import initTTS, { TTS } from "../vendor/tts/tts.js";
import { AIMLEngine, BASE_AIML_XML, STARTER_AIML_PACKS, parseSpeechCues, replyDisplayText, stripSpeechTags } from "../src/aiml-engine.js";
import {
  createAnimState,
  setAvatarMood,
  triggerAvatarEmote,
  buildCueTimeline,
  estimateCueTimeline,
  runDueCues,
  sampleSpeechAt,
  stepAvatarPhysics,
} from "../src/avatar-renderer.js";
import { LiveAvatar } from "../src/turntable/live-avatar.js";
import { YOURS, STUDIO_KEY, presetCharacters, readStudioDesign, studioCharacter, alignCaption, paginate } from "./talk.js";

/** How long to wait after a phrase for you to carry on before answering, in ms. */
const TURN_GRACE_MS = 350;
/** Quiet time after the character stops before the microphone listens again (room echo), in ms. */
const ECHO_TAIL_MS = 300;
/** Words recognised with less confidence than this are underlined. */
const UNSURE_BELOW = 0.6;
/** About how big stt.wasm is, for the progress shown when the server does not say. */
const STT_BYTES_GUESS = 14_000_000;
const PREFS_KEY = "bot.computer/talk/v1";
const CHAT_KEY = "bot.computer/talk/session/v1";

const $ = (id) => document.getElementById(id);
const els = {
  characterSelect: $("characterSelect"),
  designLink: $("designLink"),
  designText: $("designText"),
  soundBtn: $("soundBtn"),
  settingsBtn: $("settingsBtn"),
  interruptBtn: $("interruptBtn"),
  avatarCanvas: $("avatarCanvas"),
  avatar3dCanvas: $("avatar3dCanvas"),
  caption: $("caption"),
  voiceLine: $("voiceLine"),
  talkBtn: $("talkBtn"),
  talkRing: $("talkRing"),
  talkLabel: $("talkLabel"),
  status: $("status"),
  script: $("script"),
  intro: $("intro"),
  suggestions: $("suggestions"),
  typeForm: $("typeForm"),
  typeInput: $("typeInput"),
  sendBtn: $("sendBtn"),
  settingsDialog: $("settingsDialog"),
  packSelect: $("packSelect"),
  packHint: $("packHint"),
  hangRange: $("hangRange"),
  hangOut: $("hangOut"),
  sensitivityRange: $("sensitivityRange"),
  unsureCheck: $("unsureCheck"),
  clearBtn: $("clearBtn"),
};

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ---- Preferences ------------------------------------------------------------------------------

/** localStorage, or null where it is blocked (some private windows). */
const storage = (() => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
})();

const prefs = (() => {
  const defaults = { character: "aria", pack: "companion", hangMs: 700, onsetDb: 15, unsure: true, sound: true };
  try {
    return { ...defaults, ...JSON.parse(storage.getItem(PREFS_KEY) || "{}") };
  } catch {
    return defaults;
  }
})();

function savePrefs() {
  try {
    storage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // Storage can be unavailable (private windows); the settings then last for this visit.
  }
}

// ---- State ------------------------------------------------------------------------------------

let STT = null;
let stt = null; // speech recognition; listen() runs its own copy in a Web Worker
let session = null; // the open microphone
let micRequest = 0;
let voice = null; // the character's TTS voice
let brain = null; // the character's AIML engine
let characters = []; // who you can talk with: your own bot (if you made one) and the starting six
let character = null; // the one you are talking with
let anim = null; // the avatar's animation state
let avatarStage = null;
let audioCtx = null;
let playback = null; // what the character is saying right now
let replyChips = null;
let characterSeq = 0;

const live = {
  voice: "loading", // the text conversation also works while the voice loads or if it is unavailable
  stt: "loading", // speech recognition: "loading" | "ready" | "failed"
  sttProgress: 0,
  mic: "off", // "off" | "starting" | "on"
  userSpeaking: false,
  levelDb: -100,
  floorDb: -100,
  thinking: false,
  draft: null, // your turn as it is being heard: { phrases, el }
  turnTimer: 0,
  discarding: false,
  turnSeq: 0,
  greeted: false,
  note: "", // a message shown while the microphone is off (an error, for example)
};

// ---- Loading ----------------------------------------------------------------------------------

/** Fetches a file and reports how much has arrived (stt.wasm is 14 MB). */
async function fetchWithProgress(url, onProgress) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`${url} answered HTTP ${resp.status}`);
  // A compressed response reports its compressed size; the bytes counted here are unpacked.
  const total = Number(resp.headers.get("content-length")) || STT_BYTES_GUESS;
  if (!resp.body) return new Uint8Array(await resp.arrayBuffer());
  const reader = resp.body.getReader();
  const parts = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    parts.push(value);
    received += value.length;
    onProgress(Math.min(0.99, received / total));
  }
  const bytes = new Uint8Array(received);
  let at = 0;
  for (const part of parts) {
    bytes.set(part, at);
    at += part.length;
  }
  return bytes;
}

async function boot() {
  anim = createAnimState();
  avatarStage = new LiveAvatar(els.avatar3dCanvas, els.avatarCanvas);
  setupControls();
  rebuildCharacterList();
  await selectCharacter(firstCharacterId(), { greet: false });
  restoreConversation();
  for (const el of [els.characterSelect, els.typeInput, els.sendBtn]) el.disabled = false;
  render();
  requestAnimationFrame(tick);
  loadVoiceEngine();
  loadRecognizer();
}

async function loadVoiceEngine() {
  try {
    await initTTS();
    live.voice = "ready";
    await loadCharacterVoice(character, characterSeq);
  } catch (err) {
    console.warn("[conversation] the voice could not be loaded:", err);
    live.voice = "failed";
  }
  render();
}

async function loadRecognizer() {
  live.stt = "loading";
  render();
  let lastPercent = -1;
  try {
    const sttModule = await import("../vendor/stt/stt.js");
    const bytes = await fetchWithProgress(new URL("../vendor/stt/stt.wasm", import.meta.url), (f) => {
      const percent = Math.round(f * 100);
      if (percent === lastPercent) return;
      lastPercent = percent;
      live.sttProgress = f;
      render();
    });
    live.sttProgress = 1;
    render();
    await sttModule.default(bytes);
    STT = sttModule.STT;
    stt = new STT({ mode: "dictation", hangMs: prefs.hangMs, onsetDb: prefs.onsetDb });
    live.stt = "ready";
  } catch (err) {
    console.error(err);
    live.stt = "failed";
    live.note = `Speech recognition could not be loaded (${err.message}). You can still type below.`;
  }
  render();
}

// ---- Characters -------------------------------------------------------------------------------

function restingMood() {
  return character?.persona?.mood || "";
}

function pitchHz() {
  return character?.pitchHz || 160;
}

/** The starting characters, with the bot you designed in the studio first if there is one. */
function rebuildCharacterList() {
  const yours = studioCharacter(readStudioDesign(storage));
  characters = [...(yours ? [yours] : []), ...presetCharacters()];
  const select = els.characterSelect;
  select.replaceChildren();
  const presets = characters.filter((c) => !c.own).map((c) => new Option(c.name, c.id));
  if (yours) {
    const mine = document.createElement("optgroup");
    mine.label = "Your bot";
    mine.append(new Option(yours.name, YOURS));
    const others = document.createElement("optgroup");
    others.label = "Starting characters";
    others.append(...presets);
    select.append(mine, others);
  } else {
    select.append(...presets);
  }
  if (character && characters.some((c) => c.id === character.id)) select.value = character.id;
}

/** Who to start with: the one named in the link (`?with=chloe`), else the last one, else Aria. */
function firstCharacterId() {
  const asked = (new URLSearchParams(location.search).get("with") || "").trim().toLowerCase();
  const known = (id) => characters.some((c) => c.id === id);
  // A link may name a character by id ("nova") or by name ("Nova-7").
  const named = asked && characters.find((c) => c.id === asked || (!c.own && c.name.toLowerCase() === asked));
  if (named) return named.id;
  if (asked === YOURS) {
    addNote("There is no bot of yours in this browser yet, so you are talking with one of the starting characters. Design your own in the studio and it appears here.");
  }
  return known(prefs.character) ? prefs.character : "aria";
}

function makeBrain(c) {
  const engine = new AIMLEngine({ botProps: c.props, baseXml: c.baseBrain ? BASE_AIML_XML : "", persona: c.persona });
  // Your bot answers with the rules you wrote; a starting character with the topic chosen in Settings.
  const xml = c.rules !== null ? c.rules : STARTER_AIML_PACKS[prefs.pack]?.xml || "";
  let rulesError = "";
  if (xml.trim()) {
    try {
      engine.loadXML(xml);
    } catch (err) {
      rulesError = err.message || String(err);
      console.warn("[conversation] the rules could not be loaded:", err);
    }
  }
  (window.requestIdleCallback || ((fn) => setTimeout(fn, 200)))(() => engine.warmUp());
  return { engine, rulesError };
}

async function makeVoice(c) {
  const v = new TTS(c.voice.gender);
  try {
    if (c.voice.preset.startsWith("arctic_")) {
      const resp = await fetch(new URL(`../vendor/tts/profiles/${c.voice.preset}.json`, import.meta.url));
      if (resp.ok) v.configure(await resp.json());
    } else if (c.voice.preset) {
      v.configure(c.voice.preset);
    }
    if (c.voice.settings) v.configure(c.voice.settings);
  } catch (err) {
    console.warn("[conversation] voice settings:", err);
  }
  return v;
}

async function loadCharacterVoice(next, seq) {
  const nextVoice = await makeVoice(next);
  if (seq !== characterSeq) nextVoice.free();
  else voice = nextVoice;
}

/**
 * Switches to a character. With `refresh` it is the same character with changes made in the
 * studio, so the conversation, and what it remembers about you, carry on.
 */
async function selectCharacter(id, { greet = true, refresh = false } = {}) {
  const seq = ++characterSeq;
  const next = characters.find((c) => c.id === id) || characters.find((c) => c.id === "aria") || characters[0];
  const switching = Boolean(character) && character.id !== next.id;
  finishPlayback(true);
  const memory = refresh && brain ? brain.exportSession() : null;
  if (voice) voice.free();
  voice = null;
  character = next;
  if (switching) anim = createAnimState();
  const made = makeBrain(next);
  brain = made.engine;
  if (memory) brain.importSession(memory);
  prefs.character = next.id;
  savePrefs();
  els.characterSelect.value = next.id;
  document.title = `Talk with ${next.name} on bot.computer`;
  setAvatarMood(anim, restingMood());
  if (!refresh) renderSuggestions();
  syncCharacterControls();
  render();
  if (switching && els.script.querySelector(".turn")) addNote(`Now talking with ${next.name}.`);
  if (made.rulesError && next.own && !refresh) {
    addNote(`Your rules have an XML error (${made.rulesError}), so ${next.name} only knows small talk for now. Fix it in the studio and it updates here.`);
  }
  if (live.voice === "ready") await loadCharacterVoice(next, seq);
  if (greet && seq === characterSeq) {
    live.greeted = true;
    await characterSpeaksLine(next.greeting);
  }
}

/** The controls that depend on who you are talking with, and a link to this conversation. */
function syncCharacterControls() {
  const own = Boolean(character?.own);
  els.designText.textContent = own ? "Edit in the studio" : "Design your own";
  els.designLink.title = own ? `Change ${character.name} in the studio` : "Design your own bot in the studio, then talk with it here";
  els.packSelect.disabled = own;
  els.packHint.hidden = !own;
  els.packHint.textContent = own ? `${character.name} uses the rules you saved in the studio.` : "";
  try {
    const url = new URL(location.href);
    url.searchParams.set("with", character.id);
    history.replaceState(null, "", url);
  } catch {
    // The address could not be changed (a file:// page, for instance); nothing else depends on it.
  }
}

// Change your bot in the studio (in another tab) and the conversation picks the changes up.
let studioTimer = 0;
function studioChanged() {
  clearTimeout(studioTimer);
  studioTimer = setTimeout(applyStudioChanges, 800);
}

async function applyStudioChanges() {
  if (!character) return;
  rebuildCharacterList();
  if (!character.own || !characters.some((c) => c.own)) return;
  // Not in the middle of an exchange: wait for it to finish.
  if (playback || live.thinking || live.userSpeaking || live.draft) {
    studioTimer = setTimeout(applyStudioChanges, 1500);
    return;
  }
  await selectCharacter(YOURS, { greet: false, refresh: true });
}

// ---- Audio output -----------------------------------------------------------------------------

/** The page's one AudioContext, created and woken inside a click or key press. */
function audio() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  audioCtx ??= new Ctx();
  if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
  return audioCtx;
}

/**
 * The character says a line: the voice plays, the lips follow it, gestures written in the line
 * fire when the voice reaches them, and the caption follows word by word. Resolves when the
 * line ends or is interrupted. With the sound off the gestures and caption still play, at
 * reading pace.
 */
function characterSpeaks(speechText, cues, cueWords, displayText) {
  return new Promise((resolve) => {
    finishPlayback(true);
    const audible = Boolean(stripSpeechTags(speechText)) || cues.some((c) => c.sound);
    const ctx = prefs.sound && voice && audible ? audio() : null;
    let speech = null;
    if (ctx && voice) {
      try {
        speech = /\[[a-zA-Z_/]/.test(speechText) ? voice.speakScript(speechText) : voice.speak(speechText);
      } catch (err) {
        console.warn("[conversation] the voice could not say that:", err);
      }
    }
    if (speech && speech.samples && speech.samples.length) {
      const buffer = ctx.createBuffer(1, speech.samples.length, speech.sampleRate);
      buffer.copyToChannel(speech.samples, 0);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      const { labels, owner } = alignCaption(displayText, speech.words || []);
      playback = {
        kind: "voice",
        source,
        speech,
        startAt: ctx.currentTime + 0.03,
        timeline: buildCueTimeline(speech, cues, cueWords),
        labels,
        owner,
        pages: paginate(labels),
        captionKey: "",
        resolve,
      };
      source.onended = () => finishPlayback(false);
      source.start(playback.startAt);
    } else {
      const labels = String(displayText || "").split(/\s+/).filter(Boolean);
      const timeline = estimateCueTimeline(cues);
      const lastCueMs = (timeline.items.at(-1)?.t || 0) * 1000;
      const holdMs = Math.max(clamp(500 + labels.length * 330, 900, 9000), lastCueMs + 350);
      playback = {
        kind: "silent",
        startMs: performance.now(),
        timeline,
        labels,
        pages: [labels.map((_, i) => i)],
        captionKey: "",
        resolve,
        timer: setTimeout(() => finishPlayback(false), holdMs),
      };
    }
    render();
  });
}

/** Writes a line with inline tags (a greeting) into the script and says it. */
function characterSpeaksLine(raw) {
  const shown = stripSpeechTags(raw);
  addTurn("bot", character.name).querySelector(".words").textContent = shown;
  const parsed = parseSpeechCues(raw);
  return withMicHeld(() => characterSpeaks(parsed.speechText, parsed.cues, parsed.wordCount, shown));
}

/** Ends the current line. `interrupted` skips the gestures it had not reached yet. */
function finishPlayback(interrupted) {
  const p = playback;
  if (!p) return;
  playback = null;
  if (p.source) {
    p.source.onended = null;
    try {
      p.source.stop();
    } catch {
      // already stopped
    }
  }
  clearTimeout(p.timer);
  if (!interrupted && p.timeline) runDueCues(anim, p.timeline, Infinity);
  setAvatarMood(anim, restingMood());
  els.caption.classList.remove("visible");
  p.resolve();
  render();
}

function showCaption(p, tSec) {
  if (!p.labels.length) return; // a sound with no words, such as a laugh
  // Indexes into p.labels: the last written word the voice has reached, and the one it is saying.
  let started = -1;
  let active = -1;
  if (p.kind === "voice") {
    const words = p.speech.words || [];
    for (let i = 0; i < words.length; i++) {
      if (tSec < words[i].start) break;
      started = p.owner[i];
      // Between two spoken parts of one written word ("one hundred" for "100") it stays lit.
      const inWord = tSec < words[i].end;
      const sameNext = i + 1 < words.length && p.owner[i + 1] === p.owner[i] && tSec < words[i + 1].start;
      active = inWord || sameNext ? p.owner[i] : -1;
    }
  } else {
    started = p.labels.length - 1;
  }
  const pageIndex = Math.max(0, p.pages.findIndex((page) => page.includes(Math.max(0, started))));
  const key = `${pageIndex}:${started}:${active}`;
  if (key === p.captionKey) return;
  p.captionKey = key;
  const frag = document.createDocumentFragment();
  for (const i of p.pages[pageIndex] || []) {
    const span = document.createElement("span");
    span.textContent = p.labels[i];
    if (i === active) span.className = "now";
    else if (i <= started) span.className = "said";
    frag.append(span, " ");
  }
  els.caption.replaceChildren(frag);
  els.caption.classList.add("visible");
}

// ---- Listening --------------------------------------------------------------------------------

function micErrorText(err) {
  if (err && (err.name === "NotAllowedError" || err.name === "SecurityError")) {
    return "Microphone access is blocked. Allow it from the address bar, or type below.";
  }
  if (err && err.name === "NotFoundError") return "No microphone was found. You can still type below.";
  return `The microphone could not be opened (${err?.message || err}). You can still type below.`;
}

async function startListening() {
  if (live.mic !== "off" || !stt) return;
  const request = ++micRequest;
  live.mic = "starting";
  live.note = "";
  render();
  const ctx = audio(); // created inside the click, so it is allowed to start
  try {
    const opened = await stt.listen({
      audioContext: ctx || undefined,
      mode: "dictation",
      onPhrase: phrase => { if (request === micRequest) heardPhrase(phrase); },
      onSpeaking: speaking => { if (request === micRequest) heardSpeaking(speaking); },
      onLevel: ({ levelDb, floorDb }) => {
        if (request !== micRequest) return;
        live.levelDb = levelDb;
        live.floorDb = floorDb;
      },
      onError: (err) => console.warn("[conversation] recognizer:", err),
    });
    if (request !== micRequest) {
      // Permission can arrive after navigation or cancellation. Release that stream.
      await opened.stop();
      return;
    }
    session = opened;
  } catch (err) {
    if (request !== micRequest) return;
    session = null;
    live.mic = "off";
    live.note = micErrorText(err);
    render();
    return;
  }
  live.mic = "on";
  if (playback || live.thinking) session.pause(); // the character is mid-sentence: wait for it
  render();
  if (!live.greeted) {
    live.greeted = true;
    await characterSpeaksLine(character.greeting);
  }
}

async function stopListening() {
  ++micRequest;
  const s = session;
  session = null;
  live.mic = "off";
  live.userSpeaking = false;
  clearTimeout(live.turnTimer);
  dropDraft();
  render();
  try {
    await s?.stop();
  } catch {
    // the microphone is closed either way
  }
  render();
}

/** Your turn in the script, shown as soon as you start talking and filled in as phrases arrive. */
function ensureDraft() {
  if (!live.draft) {
    live.draft = { phrases: [], el: addTurn("you", "You", "draft") };
    live.draft.el.querySelector(".words").textContent = "…";
  }
  return live.draft;
}

function heardPhrase(phrase) {
  if (live.discarding || !session || playback || live.thinking) return;
  const draft = ensureDraft();
  if (els.intro.isConnected) els.intro.remove();
  draft.phrases.push(phrase);
  renderUserWords(draft.el, draft.phrases);
  armTurnTimer();
  render();
}

function heardSpeaking(speaking) {
  live.userSpeaking = speaking && !live.discarding && !playback && !live.thinking;
  if (live.userSpeaking) {
    clearTimeout(live.turnTimer);
    live.turnTimer = 0;
    ensureDraft();
    attentiveGestures();
  } else if (live.draft && !live.draft.phrases.length) {
    dropDraft(); // a cough or a bump: sound, but no words
  } else if (live.draft) {
    armTurnTimer();
  }
  render();
}

function armTurnTimer() {
  clearTimeout(live.turnTimer);
  live.turnTimer = setTimeout(endTurn, TURN_GRACE_MS);
}

/** Your turn is over: what was heard goes to the brain. */
function endTurn() {
  live.turnTimer = 0;
  if (!live.draft || live.userSpeaking || !live.draft.phrases.length) return;
  const draft = live.draft;
  live.draft = null;
  draft.el.classList.remove("draft");
  const text = draft.phrases.map((p) => p.text).join(" ");
  respondTo(text);
}

function dropDraft() {
  if (!live.draft) return;
  live.draft.el.remove();
  live.draft = null;
}

/** Keeps the microphone from hearing the character: paused, and any half-heard phrase dropped. */
async function holdMic() {
  clearTimeout(live.turnTimer);
  live.turnTimer = 0;
  live.userSpeaking = false;
  if (!session) return;
  session.pause();
  live.discarding = true;
  try {
    await session.flush();
  } catch {
    // nothing was in progress
  }
  live.discarding = false;
}

async function releaseMic() {
  await sleep(ECHO_TAIL_MS);
  if (session && !playback && !live.thinking) session.resume();
  render();
}

async function withMicHeld(speak) {
  const seq = ++live.turnSeq;
  await holdMic();
  await speak();
  if (seq === live.turnSeq) await releaseMic();
}

// ---- Answering --------------------------------------------------------------------------------

function describeMatch(reply) {
  if (reply.matchKind === "fallback" || reply.matchKind === "none") return "No rule matched, so this is a general reply.";
  if (reply.matchedLayer === "custom") {
    if (character.own) return "Answered by one of your rules.";
    const pack = STARTER_AIML_PACKS[prefs.pack];
    return `Answered by a rule from ${pack ? pack.label : "the topic rules"}.`;
  }
  return "Answered by a small-talk rule.";
}

async function respondTo(text) {
  finishPlayback(true);
  dropDraft();
  live.thinking = true;
  render();
  const seq = ++live.turnSeq;
  await holdMic();
  if (seq !== live.turnSeq) return;
  let reply = null;
  try {
    reply = brain.reply(text);
  } catch (err) {
    console.error("[conversation] the brain failed on", JSON.stringify(text), err);
  }
  live.thinking = false;
  if (reply && (reply.displayText || reply.cues.length)) {
    const el = addTurn("bot", character.name);
    el.querySelector(".words").textContent = replyDisplayText(reply);
    addDetail(el, describeMatch(reply));
    renderSuggestions(reply.chips.length ? reply.chips : undefined);
    render();
    await characterSpeaks(reply.speechText, reply.cues, reply.cueWords, reply.displayText);
  }
  if (seq === live.turnSeq) await releaseMic();
}

function sendTyped(text, shownAs) {
  const words = String(text || "").trim();
  if (!words || !brain) return;
  if (prefs.sound && live.voice !== "failed") audio(); // unlock sound inside the gesture
  dropDraft();
  const el = addTurn("you", "You");
  el.querySelector(".words").textContent = shownAs || words;
  respondTo(words);
}

// ---- The avatar listening ---------------------------------------------------------------------

let nodTimer = 0;
function attentiveGestures() {
  if (nodTimer) return;
  triggerAvatarEmote(anim, "tilt", 1100);
  nodTimer = setInterval(() => {
    if (!live.userSpeaking || playback) {
      clearInterval(nodTimer);
      nodTimer = 0;
      return;
    }
    triggerAvatarEmote(anim, "nod", 650);
  }, 2600);
}

const pointer = { nx: 0, ny: 0, active: false };
const lookAtYou = { nx: 0, ny: 0.08, active: true };
window.addEventListener(
  "pointermove",
  (e) => {
    const r = els.avatarCanvas.getBoundingClientRect();
    if (!r.width) return;
    pointer.nx = clamp((e.clientX - (r.left + r.width / 2)) / Math.max(180, innerWidth * 0.35), -1, 1);
    pointer.ny = clamp((e.clientY - (r.top + r.height * 0.42)) / Math.max(160, innerHeight * 0.35), -1, 1);
    pointer.active = true;
  },
  { passive: true }
);

// ---- The script (conversation transcript) -----------------------------------------------------

function addTurn(who, name, extraClass = "") {
  // The intro stays until there is something to read in its place (not just a sound being heard).
  if (els.intro.isConnected && extraClass !== "draft") els.intro.remove();
  const li = document.createElement("li");
  li.className = `turn ${who} ${extraClass}`.trim();
  const nameEl = document.createElement("p");
  nameEl.className = "who";
  nameEl.textContent = name;
  const words = document.createElement("p");
  words.className = "words";
  li.append(nameEl, words);
  els.script.append(li);
  els.script.scrollTop = els.script.scrollHeight;
  return li;
}

function addDetail(li, text) {
  const p = document.createElement("p");
  p.className = "detail";
  p.textContent = text;
  li.append(p);
  els.script.scrollTop = els.script.scrollHeight;
}

function addNote(text) {
  const li = document.createElement("li");
  li.className = "intro note";
  li.textContent = text;
  els.script.append(li);
  els.script.scrollTop = els.script.scrollHeight;
}

// Keep the current tab's conversation when a visitor goes to the studio or reloads.
// Save text and confidence marks only. The microphone, audio and animations start idle.
function saveConversation() {
  if (!brain || !character) return;
  try {
    const lines = [...els.script.querySelectorAll(".turn:not(.draft), .note")].slice(-40).map(li => {
      if (li.classList.contains("note")) return { note: li.textContent };
      const words = [...li.querySelector(".words").childNodes].map(node => node.nodeType === Node.TEXT_NODE
        ? node.textContent : { word: node.textContent, confidence: node.title });
      return { who: li.classList.contains("you") ? "you" : "bot", name: li.querySelector(".who").textContent,
        words, detail: li.querySelector(".detail")?.textContent };
    });
    if (!lines.length) {
      sessionStorage.removeItem(CHAT_KEY);
      return;
    }
    const snapshot = { character: character.id, pack: prefs.pack, lines, chips: replyChips, greeted: live.greeted, memory: brain.exportSession() };
    sessionStorage.setItem(CHAT_KEY, JSON.stringify(snapshot));
  } catch {
    // Text chat also works with browser storage turned off.
  }
}

function restoreConversation() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(CHAT_KEY) || "null");
    if (!saved || saved.character !== character.id || !Array.isArray(saved.lines)) return;
    brain.importSession(saved.memory);
    live.greeted = saved.greeted === true;
    for (const line of saved.lines.slice(-40)) {
      if (typeof line?.note === "string") {
        addNote(line.note);
        continue;
      }
      if (!["bot", "you"].includes(line?.who) || typeof line.name !== "string" || !Array.isArray(line.words)) continue;
      const li = addTurn(line.who, line.name);
      const words = li.querySelector(".words");
      for (const part of line.words) {
        if (typeof part === "string") words.append(part);
        else if (typeof part?.word === "string") words.append(unsureWord(part.word, part.confidence));
      }
      if (line.detail) addDetail(li, line.detail);
    }
    if ((character.own || saved.pack === prefs.pack) && Array.isArray(saved.chips)) {
      renderSuggestions(saved.chips.filter(chip => typeof chip?.label === "string" && typeof chip.query === "string"));
    }
    els.script.scrollTop = els.script.scrollHeight;
  } catch {
    // An unavailable or invalid snapshot starts a fresh conversation.
  }
}

function unsureWord(word, confidence) {
  const span = document.createElement("span");
  span.className = "unsure";
  span.textContent = word;
  span.title = confidence || "";
  return span;
}

function renderUserWords(li, phrases) {
  const el = li.querySelector(".words");
  el.replaceChildren();
  let audioSeconds = 0;
  let tookMs = 0;
  phrases.forEach((phrase, k) => {
    if (k) el.append(" ");
    audioSeconds += phrase.durationSeconds || 0;
    tookMs += phrase.tookMs || 0;
    const words = phrase.words && phrase.words.length ? phrase.words : [{ word: phrase.text, confidence: 1 }];
    words.forEach((w, i) => {
      if (i) el.append(" ");
      if (w.confidence < UNSURE_BELOW) {
        el.append(unsureWord(w.word, `${Math.round(w.confidence * 100)}% sure`));
      } else {
        el.append(w.word);
      }
    });
  });
  li.querySelector(".detail")?.remove();
  addDetail(li, `${audioSeconds.toFixed(1)} s of audio, recognized in ${Math.round(tookMs)} ms.`);
}

function renderSuggestions(chips) {
  replyChips = chips || null;
  const focused = document.activeElement;
  const restoreFocus = els.suggestions.contains(focused) && focused.matches(":focus-visible");
  els.suggestions.replaceChildren();
  const list = (chips || brain.quickChips).slice(0, 4);
  const moves = "What moves can you do?";
  if (!chips && character.baseBrain && !list.includes(moves)) list.unshift(moves);
  if (!list.length) return;
  const lead = document.createElement("span");
  lead.className = "lead";
  lead.textContent = "Try saying";
  els.suggestions.append(lead);
  for (const chip of list) {
    const label = typeof chip === "string" ? chip : chip.label;
    const query = typeof chip === "string" ? chip : chip.query || chip.label;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = label;
    btn.onclick = () => sendTyped(query, label);
    els.suggestions.append(btn);
  }
  if (restoreFocus) {
    const buttons = [...els.suggestions.querySelectorAll("button")];
    (buttons.find(btn => btn.textContent === focused.textContent) || buttons[0]).focus({ preventScroll: true });
  }
}

// ---- Status and controls ----------------------------------------------------------------------

function setStatus(text, who = "none") {
  if (els.status.textContent !== text) els.status.textContent = text;
  els.status.dataset.who = who;
}

const touchScreen = matchMedia("(pointer: coarse)");

function render() {
  const name = character ? character.name : "The character";
  if (playback) {
    const how = touchScreen.matches ? `Tap ${name} to interrupt.` : `Click ${name} or press Esc to interrupt.`;
    const doing = playback.kind === "voice" ? "is talking" : "is replying";
    setStatus(`${name} ${doing}. ${how}`, "bot");
  } else if (live.thinking) setStatus("Thinking…", "bot");
  else if (live.mic === "starting") setStatus("Opening the microphone…");
  else if (live.mic === "on" && (live.userSpeaking || live.draft)) setStatus("Hearing you…", "you");
  else if (live.mic === "on") setStatus("Listening. Go ahead and talk.", "you");
  else if (live.note) setStatus(live.note);
  else if (live.stt === "loading") {
    setStatus(
      live.sttProgress >= 1
        ? "Getting speech recognition ready…"
        : `Loading speech recognition, ${Math.round(live.sttProgress * 100)}%. You can type while it loads.`
    );
  } else if (live.voice === "failed") setStatus("Voice output is unavailable. You can still chat by voice or text.");
  else setStatus("The microphone is off. Press Start talking, or type below.");

  els.talkBtn.classList.toggle("on", live.mic !== "off");
  els.talkLabel.textContent = live.mic === "off" ? "Start talking" : live.mic === "starting" ? "Cancel" : "Stop listening";
  els.talkBtn.disabled = live.stt !== "ready";
  els.interruptBtn.hidden = !playback;
  els.interruptBtn.setAttribute("aria-label", `Interrupt ${name}`);
  els.soundBtn.disabled = live.voice === "failed";
  const soundOn = prefs.sound && !els.soundBtn.disabled;
  const soundLabel = els.soundBtn.disabled ? "Voice unavailable" : soundOn ? "Sound on" : "Sound off";
  els.soundBtn.setAttribute("aria-pressed", String(soundOn));
  els.soundBtn.title = soundLabel;
  $("soundText").textContent = soundLabel;
}

function setupControls() {
  els.characterSelect.onchange = () => selectCharacter(els.characterSelect.value, { greet: live.mic === "on" });

  const packs = [["", "Small talk only"], ...Object.entries(STARTER_AIML_PACKS).map(([id, p]) => [id, p.label])];
  for (const [id, label] of packs) els.packSelect.append(new Option(label, id));
  els.packSelect.value = STARTER_AIML_PACKS[prefs.pack] ? prefs.pack : "";
  els.packSelect.onchange = () => {
    prefs.pack = els.packSelect.value;
    savePrefs();
    if (!character || character.own) return;
    // New rules, same conversation: what the character remembers about you carries over.
    const memory = brain.exportSession();
    brain = makeBrain(character).engine;
    brain.importSession(memory);
    renderSuggestions();
  };

  const applyHang = () => {
    prefs.hangMs = Number(els.hangRange.value);
    els.hangOut.textContent = `${(prefs.hangMs / 1000).toFixed(prefs.hangMs % 100 ? 2 : 1)} s`;
  };
  els.hangRange.value = prefs.hangMs;
  applyHang();
  els.hangRange.oninput = applyHang;
  // Sensitivity is the inverse of how far above the room's noise speech must rise to count.
  els.sensitivityRange.value = 32 - prefs.onsetDb;
  els.sensitivityRange.oninput = () => {
    prefs.onsetDb = 32 - Number(els.sensitivityRange.value);
  };
  const applyDetection = async () => {
    savePrefs();
    const patch = { hangMs: prefs.hangMs, onsetDb: prefs.onsetDb };
    try {
      if (session) await session.configure(patch);
      else if (stt) stt.configure(patch);
    } catch (err) {
      console.warn("[conversation] settings:", err);
    }
  };
  els.hangRange.onchange = applyDetection;
  els.sensitivityRange.onchange = applyDetection;

  els.unsureCheck.checked = prefs.unsure;
  els.script.classList.toggle("hide-unsure", !prefs.unsure);
  els.unsureCheck.onchange = () => {
    prefs.unsure = els.unsureCheck.checked;
    els.script.classList.toggle("hide-unsure", !prefs.unsure);
    savePrefs();
  };

  els.soundBtn.onclick = () => {
    prefs.sound = !prefs.sound;
    savePrefs();
    if (!prefs.sound && playback && playback.kind === "voice") finishPlayback(true);
    render();
  };

  els.settingsBtn.onclick = () => els.settingsDialog.showModal();
  els.clearBtn.onclick = () => {
    finishPlayback(true);
    dropDraft();
    els.script.replaceChildren(els.intro);
    brain.resetSession();
    renderSuggestions();
    saveConversation();
  };

  els.talkBtn.onclick = () => (live.mic === "off" ? startListening() : stopListening());
  els.typeForm.onsubmit = (e) => {
    e.preventDefault();
    const text = els.typeInput.value;
    els.typeInput.value = "";
    sendTyped(text);
  };
  els.interruptBtn.onclick = () => finishPlayback(true);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && playback && !els.settingsDialog.open) finishPlayback(true);
  });

  // Edits to your bot in the studio, in another tab, reach this one.
  window.addEventListener("storage", (e) => {
    if (e.key === STUDIO_KEY || e.key === null) studioChanged();
  });
  // Leaving the page closes the microphone.
  window.addEventListener("pagehide", (event) => {
    saveConversation();
    stopListening();
    if (!event.persisted) avatarStage.dispose();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") saveConversation();
  });
}

// ---- Drawing ----------------------------------------------------------------------------------

const LINE = 200; // voice-line samples kept: a bit over three seconds at 60 frames a second
const lineLevel = new Float32Array(LINE);
const lineWho = new Uint8Array(LINE); // 0 nobody, 1 you, 2 the character
let colors = null;

function readColors() {
  const css = getComputedStyle(document.documentElement);
  colors = ["--rule", "--you", "--bot"].map((name) => css.getPropertyValue(name).trim() || "#888");
}
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", readColors);

function sizeCanvas(canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const pw = Math.max(1, Math.round(w * dpr));
  const ph = Math.max(1, Math.round(h * dpr));
  if (canvas.width !== pw || canvas.height !== ph) {
    canvas.width = pw;
    canvas.height = ph;
  }
  return { dpr, w, h };
}

function drawVoiceLine(level, who) {
  lineLevel.copyWithin(0, 1);
  lineWho.copyWithin(0, 1);
  lineLevel[LINE - 1] = level;
  lineWho[LINE - 1] = who;
  const { dpr, w, h } = sizeCanvas(els.voiceLine);
  const ctx = els.voiceLine.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (!colors) readColors();
  ctx.clearRect(0, 0, w, h);
  const step = w / LINE;
  const bar = Math.max(1, step * 0.6);
  const mid = h / 2;
  for (let i = 0; i < LINE; i++) {
    const amp = Math.max(0.75, lineLevel[i] * (mid - 2));
    ctx.globalAlpha = 0.3 + 0.7 * (i / LINE);
    ctx.fillStyle = colors[lineWho[i]];
    ctx.fillRect(i * step, mid - amp, bar, amp * 2);
  }
  ctx.globalAlpha = 1;
}

function tick(nowMs) {
  requestAnimationFrame(tick);
  if (document.hidden || !character) return;

  let sampled = null;
  let botLevel = 0;
  const p = playback;
  if (p && p.kind === "voice" && audioCtx) {
    const t = Math.max(0, audioCtx.currentTime - p.startAt);
    sampled = sampleSpeechAt(p.speech, Math.min(t, p.speech.duration), pitchHz());
    runDueCues(anim, p.timeline, t, nowMs);
    showCaption(p, t);
    botLevel = sampled ? clamp(sampled.energy * 1.15, 0, 1) : 0;
  } else if (p && p.kind === "silent") {
    runDueCues(anim, p.timeline, (performance.now() - p.startMs) / 1000, nowMs);
    showCaption(p, 0);
  }

  const gaze = live.userSpeaking || live.draft || live.thinking ? lookAtYou : pointer.active ? pointer : null;
  stepAvatarPhysics(anim, nowMs, sampled, gaze, pitchHz());
  sizeCanvas(els.avatarCanvas);
  const movement = anim.bodyMotion;
  const showFeet = movement && movement.id !== "wave" && nowMs < movement.end && character.avatar.framing !== "cutout";
  avatarStage.render(character.avatar, anim, nowMs, {
    framing: showFeet ? "full" : character.avatar.framing,
    smoothFraming: true,
  });

  const listening = Boolean(session) && live.mic === "on" && !session.paused && !p;
  const yourLevel = listening ? clamp((live.levelDb - live.floorDb - 4) / 30, 0, 1) : 0;
  if (p && p.kind === "voice") drawVoiceLine(botLevel, 2);
  else drawVoiceLine(yourLevel, listening ? 1 : 0);

  els.talkRing.style.opacity = listening && yourLevel > 0.04 ? String(0.3 + 0.6 * yourLevel) : "0";
  els.talkRing.style.transform = `scale(${1 + 0.1 * yourLevel})`;
}

boot();
