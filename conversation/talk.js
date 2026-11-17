// The parts of the conversation page that never touch the page itself: who you can talk to, what
// each of them says first, and how a caption lines up with the voice. They are kept apart from
// app.js so they can be tested in Node.

import { AVATAR_PRESETS, DEFAULT_AVATAR } from "../src/avatar-renderer.js";
import { normalizePersona } from "../src/persona.js";
import { BOT_FACTS, captionForSpokenWord } from "../src/aiml-engine.js";

/** Where the studio keeps the bot you are designing, in this browser. */
export const STUDIO_KEY = "bc-studio-v1";
/** The id of that bot in the list of characters and in links (`conversation/?with=yours`). */
export const YOURS = "yours";

/** What a starting character says it is, when asked. */
export const ABOUT =
  "I'm a talking character from bot.computer, made of three small engines that all run in your browser: " +
  "stt.wasm hears you, an AIML brain chooses what I say, and tts.wasm gives me my voice.";

/** Said by each starting character when you first start talking. Words in brackets are gestures. */
export const PRESET_GREETINGS = {
  aria: "[cheerful] Hi! [wave] I'm Aria. I'm listening, so just talk to me.",
  marcus: "Hello. [nod] I'm Marcus. Go ahead whenever you're ready.",
  chloe: "[excited] Hiya! [wave] I'm Chloe, and I'm all ears. Say something!",
  viktor: "[calm] Hello. [smile] I'm Viktor. Take your time, I'm listening.",
  nova: "Well, hello. [wink] I'm Nova seven. Talk to me.",
  arthur: "[cheerful] Hello! [wave] I'm Professor Arthur. Ask me anything you like.",
};

/** A bot of your own opens the conversation in the manner of its personality. */
const PERSONA_GREETINGS = {
  friendly: "[cheerful] Hi! [wave] I'm {bot}. I'm listening, so just talk to me.",
  bubbly: "[excited] Hiya! [wave] I'm {bot}, and I'm all ears. Say something!",
  calm: "[calm] Hello. [smile] I'm {bot}. Take your time, I'm listening.",
  professional: "Hello. [nod] I am {bot}. Please go ahead whenever you are ready.",
  witty: "Well, hello. [wink] I'm {bot}. Talk to me.",
  shy: "[soft] Oh! Um, hi. [wave] I'm {bot}. You can talk to me, if you like.",
  grumpy: "[sigh] Fine, I'm listening. I'm {bot}. Go on then.",
  dramatic: "[dramatic] At last, a voice! [bow] I am {bot}, and I am listening.",
  laidback: "Hey. [wave] I'm {bot}. Just talk, I'm listening.",
  curious: "[cheerful] Hello! [wave] I'm {bot}. What shall we talk about?",
};
const PLAIN_GREETING = "Hi! [wave] I'm {bot}. I'm listening, so just talk to me.";

/** The first line a character with this personality says when you start talking. */
export function listeningGreeting(name, persona) {
  return (PERSONA_GREETINGS[persona?.id] || PLAIN_GREETING).replace(/\{bot\}/g, name);
}

/**
 * The starting characters, ready to talk. A character here is everything the page needs: the look,
 * the voice, the personality, what the brain knows about it and the line it opens with.
 */
export function presetCharacters() {
  return AVATAR_PRESETS.map((p) => ({
    id: p.id,
    name: p.name,
    own: false,
    avatar: p.avatar,
    persona: normalizePersona(p.persona),
    voice: { gender: p.voiceOverrides?.gender || "female", preset: p.voicePreset || "", settings: p.voiceOverrides || null },
    pitchHz: p.voiceOverrides?.pitchHz || 160,
    // A website job ("Website Concierge") reads oddly in a chat, so here they are someone to talk to.
    props: { name: p.name, role: "voice companion", company: "bot.computer", website: "https://bot.computer", about: ABOUT },
    rules: null, // whatever topic is chosen in Settings
    baseBrain: true,
    greeting: PRESET_GREETINGS[p.id] || listeningGreeting(p.name, normalizePersona(p.persona)),
  }));
}

/** Reads the design the studio saved in this browser, or null if there is none. */
export function readStudioDesign(storage) {
  try {
    const saved = JSON.parse(storage.getItem(STUDIO_KEY) || "null");
    return saved && typeof saved === "object" && saved.v === 1 ? saved : null;
  } catch {
    return null; // storage blocked, or something that is not a saved design
  }
}

// The studio moves designs saved before tts.wasm 1.2 to the new default vocal tract, once; a
// design read here gets the same treatment so it sounds as it does in the studio.
const VOICE_TUNING = 2;
const RETUNED_TRACT_CM = { male: [17.5, 17.0], female: [13.9, 14.2] };

function retunedVoice(voice, saved) {
  if (Number(saved.voiceTuning) >= VOICE_TUNING) return voice;
  const [before, now] = RETUNED_TRACT_CM[voice.gender] || [];
  return before && Math.abs(Number(voice.tractLengthCm) - before) < 0.005 ? { ...voice, tractLengthCm: now } : voice;
}

/**
 * The bot designed in the studio, as a character: its look, its voice, its personality, its own
 * rules and business facts. Returns null when there is no saved design.
 */
export function studioCharacter(saved) {
  if (!saved || typeof saved !== "object" || saved.v !== 1) return null;
  const text = (value, fallback, max) => (typeof value === "string" && value.trim() ? value.trim().slice(0, max) : fallback);
  const name = text(saved.name, "Your bot", 40);
  const persona = normalizePersona(saved.persona);
  const preset = AVATAR_PRESETS.find((p) => p.id === saved.activePresetId) || AVATAR_PRESETS[0];
  const settings = saved.voice && typeof saved.voice === "object" && !Array.isArray(saved.voice) ? retunedVoice(saved.voice, saved) : null;
  const facts = {};
  if (saved.facts && typeof saved.facts === "object") {
    for (const { key } of BOT_FACTS) {
      const value = saved.facts[key];
      if (typeof value === "string" && value.trim()) facts[key] = value.trim().slice(0, 400);
    }
  }
  return {
    id: YOURS,
    name,
    own: true,
    avatar: { ...DEFAULT_AVATAR, ...(saved.avatar && typeof saved.avatar === "object" ? saved.avatar : {}) },
    persona,
    // The studio saves every voice setting, so they are applied as they are. A design saved before
    // the voice had loaded has none, and speaks with the voice of the character it started from.
    voice: settings
      ? { gender: settings.gender === "male" ? "male" : "female", preset: "", settings }
      : { gender: preset.voiceOverrides?.gender || "female", preset: preset.voicePreset || "", settings: preset.voiceOverrides || null },
    pitchHz: Number(settings?.pitchHz) || preset.voiceOverrides?.pitchHz || 180,
    props: {
      name,
      role: text(saved.role, "companion", 60),
      company: text(saved.company, "bot.computer", 60),
      website: "https://bot.computer",
      ...facts,
    },
    rules: typeof saved.aimlXml === "string" ? saved.aimlXml : "",
    baseBrain: saved.baseBrain !== false,
    greeting: listeningGreeting(name, persona),
  };
}

// ---- Captions ---------------------------------------------------------------------------------

const LETTER_NAMES = {
  a: "ay", b: "bee", c: "see", d: "dee", e: "ee", f: "ef", g: "gee", h: "aitch", i: "eye", j: "jay", k: "kay",
  l: "el", m: "em", n: "en", o: "oh", p: "pee", q: "cue", r: "ar", s: "ess", t: "tee", u: "you", v: "vee",
  x: "ex", y: "why", z: "zee",
};

/**
 * Lines up the words as written ("Two-tired!", "144.") with the words the voice reports with
 * timings ("two", "tired"; "one", "hundred", "forty", "four"), so the caption can show the text
 * as written and still highlight the word being spoken. Returns the written words and, for
 * every timed word, the index of the written word it belongs to.
 */
export function alignCaption(displayText, timed) {
  const labels = String(displayText || "").split(/\s+/).filter(Boolean);
  if (!labels.length) return { labels: timed.map((w) => captionForSpokenWord(w.word)), owner: timed.map((_, i) => i) };
  const parts = labels.map((label) =>
    label.toLowerCase().normalize("NFKD").replace(/[^a-z0-9']+/g, " ").trim().split(" ").filter(Boolean)
  );
  const spoken = timed.map((w) => String(w.word).toLowerCase().normalize("NFKD").replace(/[^a-z0-9']+/g, ""));
  // "a.m." is read "ay em", "Mon" may be read "monday".
  const same = (said, written) =>
    said === written || (written.length === 1 && LETTER_NAMES[written] === said) || (written.length >= 3 && said.startsWith(written));
  const owner = [];
  let cur = -1;
  let part = 0;
  let complete = true;
  const advance = () => {
    cur = Math.min(cur + 1, labels.length - 1);
    while (cur < labels.length - 1 && !parts[cur].length) cur++; // "♪" and dashes are not spoken
    part = 0;
  };
  for (const word of spoken) {
    if (complete) advance();
    if (part < parts[cur].length && same(word, parts[cur][part])) {
      part++;
    } else {
      // The voice has moved on if this word starts one of the next few written words; the
      // words before it were read as something else (a number, a time, a symbol).
      for (let ahead = cur + 1; ahead < Math.min(labels.length, cur + 4); ahead++) {
        if (parts[ahead].length && same(word, parts[ahead][0])) {
          cur = ahead;
          part = 1;
          break;
        }
      }
    }
    complete = parts[cur].length > 0 && part >= parts[cur].length;
    owner.push(cur);
  }
  return { labels, owner };
}

/** Splits caption words into screen-sized pages, ending pages at the ends of sentences. */
export function paginate(labels) {
  const pages = [];
  let page = [];
  labels.forEach((label, i) => {
    page.push(i);
    if (page.length >= 12 || (page.length >= 3 && /[.!?]["')]*$/.test(label))) {
      pages.push(page);
      page = [];
    }
  });
  if (page.length) pages.push(page);
  return pages;
}
