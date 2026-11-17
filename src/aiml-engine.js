// Pure-JS AIML 1.0 / 2.0 XML Pattern-Matching Engine for bot.computer.
// Zero external dependencies; runs identically in browsers, Shadow DOM embeds, and Node.js.

const XML_ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

export function decodeXmlEntities(str) {
  return String(str).replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (full, ent) => {
    if (ent[0] === "#") {
      const code = ent[1].toLowerCase() === "x" ? parseInt(ent.slice(2), 16) : parseInt(ent.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : full;
    }
    return Object.prototype.hasOwnProperty.call(XML_ENTITIES, ent) ? XML_ENTITIES[ent] : full;
  });
}

export function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function lineNumberAt(src, index) {
  let line = 1;
  for (let i = 0; i < index && i < src.length; i++) {
    if (src.charCodeAt(i) === 10) line++;
  }
  return line;
}

function parseAttributes(attrText) {
  const attrs = {};
  const re = /([a-zA-Z_:][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
  let m;
  while ((m = re.exec(attrText)) !== null) {
    attrs[m[1].toLowerCase()] = decodeXmlEntities(m[2] !== undefined ? m[2] : m[3]);
  }
  return attrs;
}

/**
 * Lightweight, strict XML parser producing `{ type: "element", tag, attrs, children }`
 * and `{ type: "text", value }` nodes with exact line diagnostics on malformed XML.
 */
export function parseXmlDocument(xmlSource) {
  const src = String(xmlSource || "");
  const root = { type: "element", tag: "__root__", attrs: {}, children: [] };
  const stack = [root];
  let pos = 0;

  // Line numbers are counted as the scan moves forward, not from the top for every tag.
  let lineAt = 1;
  let lineScan = 0;
  const lineOf = (index) => {
    for (; lineScan < index; lineScan++) if (src.charCodeAt(lineScan) === 10) lineAt++;
    return lineAt;
  };

  while (pos < src.length) {
    const lt = src.indexOf("<", pos);
    if (lt < 0) {
      const tail = src.slice(pos);
      if (tail) stack[stack.length - 1].children.push({ type: "text", value: decodeXmlEntities(tail) });
      break;
    }
    if (lt > pos) {
      const text = src.slice(pos, lt);
      stack[stack.length - 1].children.push({ type: "text", value: decodeXmlEntities(text) });
    }

    if (src.startsWith("<!--", lt)) {
      const endComment = src.indexOf("-->", lt + 4);
      if (endComment < 0) {
        throw new Error(`Unclosed XML comment starting at line ${lineNumberAt(src, lt)}`);
      }
      pos = endComment + 3;
      continue;
    }

    if (src.startsWith("<![CDATA[", lt)) {
      const endCdata = src.indexOf("]]>", lt + 9);
      if (endCdata < 0) {
        throw new Error(`Unclosed CDATA section starting at line ${lineNumberAt(src, lt)}`);
      }
      stack[stack.length - 1].children.push({ type: "text", value: src.slice(lt + 9, endCdata) });
      pos = endCdata + 3;
      continue;
    }

    if (src.startsWith("<?", lt)) {
      const endPi = src.indexOf("?>", lt + 2);
      if (endPi < 0) {
        throw new Error(`Unclosed XML declaration starting at line ${lineNumberAt(src, lt)}`);
      }
      pos = endPi + 2;
      continue;
    }

    if (src.startsWith("<!", lt)) {
      const endDecl = src.indexOf(">", lt + 2);
      if (endDecl < 0) {
        throw new Error(`Unclosed <! declaration at line ${lineNumberAt(src, lt)}`);
      }
      pos = endDecl + 1;
      continue;
    }

    // Find closing '>' while respecting quotes
    let gt = lt + 1;
    let quote = "";
    while (gt < src.length) {
      const ch = src[gt];
      if (quote) {
        if (ch === quote) quote = "";
      } else if (ch === '"' || ch === "'") {
        quote = ch;
      } else if (ch === ">") {
        break;
      }
      gt++;
    }
    if (gt >= src.length) {
      throw new Error(`Unclosed '<' tag starting at line ${lineNumberAt(src, lt)}`);
    }

    const rawTag = src.slice(lt + 1, gt).trim();
    pos = gt + 1;

    if (!rawTag) {
      throw new Error(`Empty <> tag at line ${lineNumberAt(src, lt)}`);
    }

    if (rawTag[0] === "/") {
      const closeName = rawTag.slice(1).trim().toLowerCase();
      if (stack.length <= 1) {
        throw new Error(`Unexpected closing tag </${closeName}> at line ${lineNumberAt(src, lt)}`);
      }
      const top = stack.pop();
      if (top.tag !== closeName) {
        throw new Error(
          `Mismatched closing tag </${closeName}> at line ${lineNumberAt(src, lt)} (expected </${top.tag}> opened at line ${top.line})`
        );
      }
      top.end = pos; // one past the closing tag
      continue;
    }

    const selfClosing = rawTag.endsWith("/");
    const cleanInside = selfClosing ? rawTag.slice(0, -1).trim() : rawTag;
    const nameMatch = /^([a-zA-Z_:][\w:.-]*)([\s\S]*)$/.exec(cleanInside);
    if (!nameMatch) {
      throw new Error(`Invalid tag syntax <${rawTag}> at line ${lineNumberAt(src, lt)}`);
    }
    const tag = nameMatch[1].toLowerCase();
    const attrs = parseAttributes(nameMatch[2] || "");
    const elem = {
      type: "element",
      tag,
      attrs,
      children: [],
      line: lineOf(lt),
      start: lt, // where the element sits in the source, so a rule can be found and removed
      end: selfClosing ? pos : -1,
    };
    stack[stack.length - 1].children.push(elem);
    if (!selfClosing) {
      stack.push(elem);
    }
  }

  if (stack.length > 1) {
    const unclosed = stack[stack.length - 1];
    throw new Error(`Unclosed tag <${unclosed.tag}> opened at line ${unclosed.line}`);
  }

  return root;
}

// ============================================================================
// Input normalization: contractions, chat shorthand, stretched words
// ============================================================================

const CONTRACTIONS = [
  [/\bwhat's\b/gi, "what is"],
  [/\bwho's\b/gi, "who is"],
  [/\bwhere's\b/gi, "where is"],
  [/\bwhen's\b/gi, "when is"],
  [/\bhow's\b/gi, "how is"],
  [/\bit's\b/gi, "it is"],
  [/\bthat's\b/gi, "that is"],
  [/\bthere's\b/gi, "there is"],
  [/\bhere's\b/gi, "here is"],
  [/\bhe's\b/gi, "he is"],
  [/\bshe's\b/gi, "she is"],
  [/\bi'm\b/gi, "i am"],
  [/\byou're\b/gi, "you are"],
  [/\bwe're\b/gi, "we are"],
  [/\bthey're\b/gi, "they are"],
  [/\bwhat're\b/gi, "what are"],
  [/\bi've\b/gi, "i have"],
  [/\byou've\b/gi, "you have"],
  [/\bwe've\b/gi, "we have"],
  [/\bthey've\b/gi, "they have"],
  [/\bi'll\b/gi, "i will"],
  [/\byou'll\b/gi, "you will"],
  [/\bwe'll\b/gi, "we will"],
  [/\bit'll\b/gi, "it will"],
  [/\bthat'll\b/gi, "that will"],
  [/\bi'd\b/gi, "i would"],
  [/\byou'd\b/gi, "you would"],
  [/\bcan't\b/gi, "cannot"],
  [/\bwon't\b/gi, "will not"],
  [/\bdon't\b/gi, "do not"],
  [/\bdoesn't\b/gi, "does not"],
  [/\bdidn't\b/gi, "did not"],
  [/\bisn't\b/gi, "is not"],
  [/\baren't\b/gi, "are not"],
  [/\bwasn't\b/gi, "was not"],
  [/\bweren't\b/gi, "were not"],
  [/\bhaven't\b/gi, "have not"],
  [/\bhasn't\b/gi, "has not"],
  [/\bcouldn't\b/gi, "could not"],
  [/\bwouldn't\b/gi, "would not"],
  [/\bshouldn't\b/gi, "should not"],
  [/\bain't\b/gi, "is not"],
  [/\by'all\b/gi, "you all"],
  [/\blet's\b/gi, "let us"],
];

// Chat shorthand and missing-apostrophe spellings, mapped onto the words patterns are written in.
const WORD_SUBSTITUTIONS = {
  U: "YOU", UR: "YOUR", R: "ARE", YA: "YOU",
  PLS: "PLEASE", PLZ: "PLEASE",
  THX: "THANKS", THNX: "THANKS", THANX: "THANKS", TY: "THANK YOU", TYSM: "THANK YOU", THANKYOU: "THANK YOU",
  IM: "I AM", IVE: "I HAVE", DONT: "DO NOT", CANT: "CANNOT", WONT: "WILL NOT", DIDNT: "DID NOT",
  DOESNT: "DOES NOT", ISNT: "IS NOT", ARENT: "ARE NOT", WASNT: "WAS NOT", HAVENT: "HAVE NOT",
  COULDNT: "COULD NOT", WOULDNT: "WOULD NOT", SHOULDNT: "SHOULD NOT",
  WHATS: "WHAT IS", HOWS: "HOW IS", WHERES: "WHERE IS", WHOS: "WHO IS", THATS: "THAT IS",
  THERES: "THERE IS", YOURE: "YOU ARE", THEYRE: "THEY ARE",
  WANNA: "WANT TO", GONNA: "GOING TO", GOTTA: "GOT TO", GIMME: "GIVE ME", LEMME: "LET ME",
  KINDA: "KIND OF", DUNNO: "DO NOT KNOW", IDK: "I DO NOT KNOW",
  YEA: "YES", YEAH: "YES", YEP: "YES", YUP: "YES", YEH: "YES", NOPE: "NO", NAH: "NO",
  OKAY: "OK", OKEY: "OK", K: "OK", KK: "OK", ALRIGHT: "OK",
  HIYA: "HI", HEYA: "HEY", HELO: "HELLO", HULLO: "HELLO",
  SUP: "WHAT IS UP", WASSUP: "WHAT IS UP", WHATSUP: "WHAT IS UP",
  CYA: "SEE YOU", L8R: "LATER", GR8: "GREAT", B4: "BEFORE",
  CUZ: "BECAUSE", COZ: "BECAUSE", BC: "BECAUSE", THO: "THOUGH", BTW: "BY THE WAY",
  FAVOURITE: "FAVORITE", COLOUR: "COLOR", FAV: "FAVORITE", FAVE: "FAVORITE", FAVOURITES: "FAVORITES",
  LETS: "LET US", YOUVE: "YOU HAVE", WEVE: "WE HAVE", THEYVE: "THEY HAVE", YOULL: "YOU WILL", AINT: "IS NOT",
  HASNT: "HAS NOT", WERENT: "WERE NOT", HES: "HE IS", SHES: "SHE IS", GUNNA: "GOING TO", WHATCHA: "WHAT ARE YOU",
  GOODNIGHT: "GOOD NIGHT", GOODMORNING: "GOOD MORNING", GNIGHT: "GOOD NIGHT", GN: "GOOD NIGHT", GM: "GOOD MORNING",
  NVM: "NEVER MIND", IDC: "I DO NOT CARE", ILY: "I LOVE YOU", WYD: "WHAT ARE YOU DOING", HBU: "HOW ABOUT YOU",
  WBU: "HOW ABOUT YOU", HRU: "HOW ARE YOU", GG: "GOOD GAME", TTYL: "TALK TO YOU LATER", IKR: "I KNOW RIGHT",
  SRY: "SORRY", PPL: "PEOPLE", ABT: "ABOUT", TMRW: "TOMORROW", TMR: "TOMORROW", TOMOZ: "TOMORROW", TDY: "TODAY",
  BDAY: "BIRTHDAY", RN: "RIGHT NOW", TBH: "HONESTLY", NGL: "HONESTLY", THNKS: "THANKS", THANKU: "THANK YOU",
  PLZZ: "PLEASE", PLSS: "PLEASE", MSG: "MESSAGE", TILL: "UNTIL", TIL: "UNTIL",
};

const MATH_LEAD_RE = /^\s*(?:(?:what(?:'s|\s+is)|whats|calculate|compute|solve|evaluate|work\s+out|how\s+much\s+is)\b[\s:]*)?/i;

/**
 * "2+2", "(3 + 4) * 5" and "what's 10/4?" are spelled out ("2 PLUS 2") so that patterns can see
 * the sum. A bare "555-1234", "24/7" or "10/10" is left alone: it is probably not arithmetic.
 */
function spellOutSymbols(text) {
  const lead = MATH_LEAD_RE.exec(text)[0];
  const body = text.slice(lead.length).replace(/[\s?=]+$/, "");
  if (!/^[\d\s.,+\-−–*×xX/÷^%()]+$/.test(body) || !/\d/.test(body) || !/[+\-−–*×xX/÷^%]/.test(body)) return text;
  const clearlyMaths = lead.trim() !== "" || /[+*×^÷]/.test(body) || /\d\s+[-−–/]\s+\d/.test(body) || /\d\s*[xX]\s*\d/.test(body);
  if (!clearlyMaths) return text;
  return (
    lead +
    body
      .replace(/(\d),(?=\d{3}(?!\d))/g, "$1")
      .replace(/\(/g, " OPEN ")
      .replace(/\)/g, " CLOSE ")
      .replace(/\+/g, " PLUS ")
      .replace(/[-−–]/g, " MINUS ")
      .replace(/[*×xX]/g, " TIMES ")
      .replace(/[/÷]/g, " DIVIDED BY ")
      .replace(/\^/g, " TO THE POWER OF ")
      .replace(/%/g, " PERCENT ")
  );
}

export function normalizeAimlInput(text, isPattern = false) {
  let s = String(text || "")
    .replace(/[‘’ʼ`´]/g, "'") // phone keyboards type curly apostrophes
    .trim();
  if (!isPattern) s = spellOutSymbols(s);
  // "3.5" stays one number ("3 POINT 5"); "15%" and "2+2" keep their meaning.
  s = s.replace(/(\d)\.(?=\d)/g, "$1 POINT ");
  if (!isPattern) s = s.replace(/(\d)\s*%/g, "$1 PERCENT ").replace(/(\d)\s*\+\s*(?=\d)/g, "$1 PLUS ");
  for (const [re, rep] of CONTRACTIONS) {
    s = s.replace(re, rep);
  }
  s = s.replace(/&/g, " and ").toUpperCase();
  // Keep AIML wildcards (* _ # ^ $) in patterns; everything else non-alphanumeric is a separator.
  s = s.replace(isPattern ? /[^A-Z0-9*_^#$ ]+/g : /[^A-Z0-9 ]+/g, " ");
  const out = [];
  for (const word of s.split(/\s+/)) {
    if (!word) continue;
    out.push(Object.prototype.hasOwnProperty.call(WORD_SUBSTITUTIONS, word) ? WORD_SUBSTITUTIONS[word] : word);
  }
  return out.join(" ");
}

function splitSentences(text) {
  const clean = stripSpeechTags(text).trim();
  if (!clean) return [""];
  const parts = clean
    .split(/(?<=[.!?])\s+/)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length ? parts : [clean];
}

const BARE_GREETINGS = new Set(["HI", "HELLO", "HEY", "HOWDY", "YO", "GREETINGS", "HI THERE", "HELLO THERE", "HEY THERE"]);

/** Splits what the visitor typed into sentences so "Hi! How much is it?" gets both answered. */
function splitInputSentences(text) {
  const parts = String(text || "")
    .split(/(?<=[.!?…])\s+|\n+/)
    .map((p) => p.trim())
    .filter((p) => /[A-Za-z0-9]/.test(p));
  // "Hi! How much is it?" reads as one thought: a short hello, then the question.
  if (parts.length > 1 && BARE_GREETINGS.has(normalizeAimlInput(parts[0], false))) {
    const greeting = parts.shift().replace(/[.!?]+$/, "");
    parts[0] = `${greeting} ${parts[0]}`;
  }
  return parts.length ? parts.slice(0, 4) : [String(text || "").trim()];
}

/** Strips inline TTS control brackets like `[cheerful, speed=1.1]` for clean visual chat display. */
export function stripSpeechTags(text) {
  return String(text || "")
    .replace(/\[sing[^\]]*\]([\s\S]*?)\[\/sing\]/gi, (_m, score) => {
      // Extract lyrics from `Note:Beats=Lyric` tokens when displaying sung phrases in chat
      // A syllable that ends in a hyphen ("Twin-") belongs to the same word as the next ("kle").
      let lyrics = "";
      let joinNext = false;
      for (const tok of score.split(/\s+/)) {
        const eq = tok.indexOf("=");
        if (eq <= 0) continue;
        const raw = tok.slice(eq + 1).replace(/~/g, "");
        const syllable = raw.replace(/-$/, "");
        if (!syllable) continue;
        lyrics += (lyrics && !joinNext ? " " : "") + syllable;
        joinNext = raw.endsWith("-");
      }
      return lyrics ? `♪ ${lyrics} ♪` : "♪ (singing) ♪";
    })
    .replace(/\[[a-zA-Z_/][^\]]*\]/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .trim();
}

// ============================================================================
// Speech cues: avatar actions and moods written inline in a reply
// ============================================================================

/**
 * Avatar actions that can be written inline in any spoken text, e.g. `Hi there! [wave]`.
 * They are removed before the text reaches the voice and fire when speech reaches that point.
 */
export const AVATAR_ACTION_TAGS = [
  "wave", "wink", "nod", "smile", "laugh", "think", "surprised", "shake", "shrug",
  "tilt", "bow", "thumbsup", "blink", "lookleft", "lookright", "lookup", "lookdown",
];

const ACTION_ALIASES = {
  grin: "smile", giggle: "laugh", chuckle: "laugh", hmm: "think",
  surprise: "surprised", headshake: "shake", thumbup: "thumbsup",
};

// Voice styles also set the avatar's facial mood for as long as they are being spoken.
// "angry" is a face-only mood: the voice has no such style, so it is removed from the speech.
const MOOD_TAGS = {
  happy: "happy", cheerful: "happy", excited: "excited",
  calm: "calm", gentle: "calm", soft: "calm",
  sad: "sad", serious: "serious", dramatic: "serious", urgent: "serious", angry: "serious",
  // speaking while laughing: a smile on the face for as long as it lasts
  laughing: "happy", chuckling: "happy", giggling: "happy",
  reset: "", normal: "", modal: "", "/voice": "", "/laughing": "", "/chuckling": "", "/giggling": "",
};

/**
 * Sounds the voice makes that are not words (tts.wasm 1.1): laughs, breaths, reactions and more.
 * Written as a tag, `[laugh]` is heard in the voice and shown on the avatar's face at the same
 * moment. The number is the usual length in milliseconds, used when there is no audio to time it by.
 */
const VOICE_SOUND_MS = {
  // laughter
  laugh: 1270, chuckle: 890, giggle: 1150, guffaw: 2890, cackle: 1700, snicker: 790, hoho: 1110, hehe: 1000, nervous: 1150, evil: 1990,
  // breath
  exhale: 560, gasp: 320, sigh: 1110, yawn: 1990, sniff: 340, pant: 1220, phew: 780,
  // reactions
  hmm: 670, mm: 660, mhm: 560, "uh-huh": 560, "uh-uh": 540, "uh-oh": 690, uh: 430, um: 580, huh: 360, aha: 630, oh: 520, ooh: 670, aww: 820, ahh: 830, ugh: 410, eww: 690,
  // voice
  hum: 1710, groan: 1020, scream: 990, sob: 2900, whimper: 990,
  // mouth
  shh: 940, psst: 440, tsk: 470, kiss: 660, brr: 860, grr: 890, raspberry: 690, whistle: 1040, fweet: 430,
  // body
  cough: 810, ahem: 760, hiccup: 330, sneeze: 890, snore: 2140,
};
export const VOICE_SOUND_TAGS = Object.keys(VOICE_SOUND_MS);

/** The sound a tag part names ("laugh", "laugh=3s", "uh_huh"), or "" if it is not one. */
function soundOf(part) {
  const key = part.split("=")[0].toLowerCase().replace(/_/g, "-");
  return Object.prototype.hasOwnProperty.call(VOICE_SOUND_MS, key) ? key : "";
}

// How a sound is written in captions, so that someone reading along knows what they heard.
const SOUND_CAPTIONS = {
  laugh: "(laughs)", chuckle: "(chuckles)", giggle: "(giggles)", guffaw: "(roars with laughter)", cackle: "(cackles)",
  snicker: "(snickers)", hoho: "ho ho ho!", hehe: "heh heh", nervous: "(laughs nervously)", evil: "(evil laugh)",
  exhale: "(breathes out)", gasp: "(gasps)", sigh: "(sighs)", yawn: "(yawns)", sniff: "(sniffs)", pant: "(pants)", phew: "phew!",
  hmm: "hmm", mm: "mmm", mhm: "mm-hm", "uh-huh": "uh-huh", "uh-uh": "uh-uh", "uh-oh": "uh-oh!", uh: "uh", um: "um", huh: "huh?",
  aha: "aha!", oh: "oh!", ooh: "ooh!", aww: "aww", ahh: "ahh", ugh: "ugh", eww: "eww!",
  hum: "(hums)", groan: "(groans)", scream: "(screams)", sob: "(sobs)", whimper: "(whimpers)",
  shh: "shh!", psst: "psst!", tsk: "tsk tsk", kiss: "mwah!", brr: "brr!", grr: "grr!", raspberry: "(blows a raspberry)",
  whistle: "(whistles)", fweet: "(whistles)", cough: "(coughs)", ahem: "ahem", hiccup: "hic!", sneeze: "achoo!", snore: "(snores)",
};

/**
 * What to show in captions for one word of a synthesized line. The voice reports a sound as
 * "[laugh]"; this turns it into "(laughs)". Ordinary words come back unchanged.
 */
export function captionForSpokenWord(token) {
  const m = /^\[([a-z-]+)\]$/i.exec(String(token || ""));
  if (!m) return String(token || "");
  return SOUND_CAPTIONS[m[1].toLowerCase()] || `(${m[1].toLowerCase()})`;
}

// Every bare word the voice engine accepts inside [brackets]. Anything else would be read
// aloud as a word ("[wink]" came out as "wink"), so unknown words are dropped from the speech.
const VOICE_TAG_WORDS = new Set(
  ("cheerful happy excited calm sad serious dramatic urgent fast slow louder softer whisper gentle soft loud quiet " +
    "laughing chuckling giggling /laughing /chuckling /giggling /whisper pause " +
    "inhale reset male female deep husky bright woman_a woman_b man_a man_b soprano alto tenor baritone " +
    "bass_singer folds pulse modal normal /voice").split(" ")
);

function resolveActionTag(part) {
  const key = part.split("=")[0].toLowerCase().replace(/[-_]/g, "");
  if (AVATAR_ACTION_TAGS.includes(key)) return key;
  return ACTION_ALIASES[key] || "";
}

/** Reads the optional duration of an action tag: `[wave=3s]`, `[nod=800ms]`. Returns ms or 0. */
function parseActionDuration(part) {
  const m = /=\s*([0-9]*\.?[0-9]+)\s*(ms|s)?$/i.exec(part);
  if (!m) return 0;
  const n = parseFloat(m[1]);
  return Math.round(Math.max(150, Math.min(8000, (m[2] || "s").toLowerCase() === "ms" ? n : n * 1000)));
}

// The voice says a hyphenated word as its parts ("Wi-Fi" is two words, "forty-two" is two).
const countSpokenWords = (chunk) => chunk.split(/[\s-]+/).filter((tok) => /[A-Za-z0-9]/.test(tok)).length;
const countSungWords = (chunk) => chunk.split(/\s+/).filter((tok) => /=./.test(tok)).length;

/** Counts words the way cue positions are measured (sung notes count once each). */
export function countSpeechWords(text) {
  return parseSpeechCues(text).wordCount;
}

/**
 * Separates avatar cues from text bound for the voice.
 * Returns `speechText` (safe to synthesize: voice tags kept, action tags removed), the ordered
 * `cues` as `{ type: "action" | "mood", name, word }` where `word` is how many words precede the
 * cue, and the total `wordCount` used to line cues up with the synthesizer's word timings.
 */
export function parseSpeechCues(rawText) {
  const src = String(rawText || "");
  const cues = [];
  let out = "";
  let words = 0;
  let inSing = false;
  const pushText = (chunk) => {
    out += chunk;
    words += inSing ? countSungWords(chunk) : countSpokenWords(chunk);
  };

  const re = /\[([^\]]*)\]/g;
  let last = 0;
  let m;
  while ((m = re.exec(src)) !== null) {
    pushText(src.slice(last, m.index));
    last = m.index + m[0].length;
    const inner = m[1].trim();
    if (!/^[a-zA-Z_/]/.test(inner)) {
      pushText(m[0]); // "[1]" and the like are ordinary text, not tags
      continue;
    }
    const lower = inner.toLowerCase();
    if (lower === "/sing") {
      inSing = false;
      out += m[0];
      continue;
    }
    if (/^sing\b/.test(lower) || /[,\s]sing\b/.test(lower)) {
      inSing = true;
      out += m[0];
      continue;
    }
    const parts = inner.split(/[,\s]+/).filter(Boolean);
    const keep = [];
    for (const part of parts) {
      // A sound the voice performs: it stays in the speech, and the face acts it out as it is heard.
      // The voice gives each sound its own place among the words, so it counts as one here too.
      const sound = soundOf(part);
      if (sound) {
        cues.push({ type: "action", name: sound, word: words, ms: parseActionDuration(part) || VOICE_SOUND_MS[sound], sound: true });
        words += 1;
        keep.push(part);
        continue;
      }
      const action = resolveActionTag(part);
      if (action) {
        const ms = parseActionDuration(part);
        cues.push(ms ? { type: "action", name: action, word: words, ms } : { type: "action", name: action, word: words });
        continue;
      }
      const word = part.toLowerCase();
      if (Object.prototype.hasOwnProperty.call(MOOD_TAGS, word)) {
        cues.push({ type: "mood", name: MOOD_TAGS[word], word: words });
      }
      if (part.includes("=") || VOICE_TAG_WORDS.has(word)) keep.push(part);
    }
    if (keep.length === parts.length) out += m[0];
    else if (keep.length) out += `[${keep.join(", ")}]`;
  }
  pushText(src.slice(last));

  const speechText = polishForSpeech(out)
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[ \t]+([,.!?;:])/g, "$1")
    .trim();
  return { speechText, cues, wordCount: words };
}

const WEEKDAYS = { Mon: "Monday", Tue: "Tuesday", Tues: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Thur: "Thursday", Thurs: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" };
const DAY_JOIN = String.raw`(?:\s?[-–&,/]\s?|\s+(?:to|and|or|through|until)\s+)`;
const DAY_BEFORE = new RegExp(String.raw`(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)[a-z]*\.?${DAY_JOIN}$`);
const DAY_AFTER = new RegExp(String.raw`^${DAY_JOIN}(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)`);

/**
 * Rewrites things the voice would otherwise read badly, in the spoken text only: phone numbers
 * are read digit by digit, "Mon-Fri" becomes "Monday to Friday" and "3-5 days" becomes "3 to 5 days".
 */
export function polishForSpeech(text) {
  return String(text)
    .replace(/\b(Mon|Tues?|Wed|Thu(?:rs?)?|Fri|Sat|Sun)\b\.?/g, (match, day, offset, whole) => {
      // "Sun" and "Wed" are also words, so only expand one that sits beside another day, before a
      // time, or after a word like "on" or "every".
      const before = whole.slice(Math.max(0, offset - 16), offset);
      const after = whole.slice(offset + match.length, offset + match.length + 16);
      const isDay =
        DAY_BEFORE.test(before) ||
        DAY_AFTER.test(after) ||
        /^\s*:?\s*\d/.test(after) ||
        /\b(?:on|every|each|until|till|from|since|by|this|next|last)\s+$/i.test(before);
      if (!isDay) return match;
      const endsSentence = match.endsWith(".") && /^(?:\s+[A-Z"“]|\s*$)/.test(whole.slice(offset + match.length));
      return WEEKDAYS[day] + (endsSentence ? "." : "");
    })
    .replace(/\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|\d{1,2}(?::\d\d)?\s?(?:am|pm)?)\s?[-–]\s?(?=Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|\d{1,2}(?::\d\d)?\s?(?:am|pm))/gi, "$1 to ")
    .replace(/(^|[^\d.–-])(\d{1,2})\s?[-–]\s?(\d{1,2})(?![-–\d])/g, "$1$2 to $3")
    .replace(/(^|[^\w$.(])(\(?\+?\d[\d ().-]{5,}\d)(?![\w%])/g, (full, lead, number) => {
      const shape = number.trim();
      const digits = shape.replace(/\D/g, "");
      const phoneLike = /^\(?\+/.test(shape) || digits.length >= 9 || /^\d{3}[-.]\d{4}$/.test(shape);
      if (!phoneLike || /^\d{1,2}[.-]\d{1,2}[.-]\d{2,4}$/.test(shape)) return full; // a year range, a date, a plain number
      // "+61 400 123 456" -> "plus 6 1, 4 0 0, 1 2 3, 4 5 6": digits one at a time, a pause between groups
      const groups = shape
        .replace(/\+/, "")
        .split(/[ ().-]+/)
        .filter(Boolean)
        .map((group) => group.split("").join(" "));
      return `${lead}${shape.includes("+") ? "plus " : ""}${groups.join(", ")}`;
    });
}

const PERSON_SWAPS = [
  [/\bi am\b/gi, "__P_YOU_ARE__"],
  [/\byou are\b/gi, "__P_I_AM__"],
  [/\bmy\b/gi, "__P_YOUR__"],
  [/\byour\b/gi, "__P_MY__"],
  [/\bmine\b/gi, "__P_YOURS__"],
  [/\byours\b/gi, "__P_MINE__"],
  [/\bmyself\b/gi, "__P_YOURSELF__"],
  [/\byourself\b/gi, "__P_MYSELF__"],
  [/\bi\b/gi, "__P_YOU__"],
  [/\bme\b/gi, "__P_YOU__"],
];

function swapPerson(str) {
  let out = String(str || "");
  for (const [re, token] of PERSON_SWAPS) out = out.replace(re, token);
  return out
    .replace(/__P_YOU_ARE__/g, "you are")
    .replace(/__P_I_AM__/g, "I am")
    .replace(/__P_YOUR__/g, "your")
    .replace(/__P_MY__/g, "my")
    .replace(/__P_YOURS__/g, "yours")
    .replace(/__P_MINE__/g, "mine")
    .replace(/__P_YOURSELF__/g, "yourself")
    .replace(/__P_MYSELF__/g, "myself")
    .replace(/__P_YOU__/g, "you");
}

// ============================================================================
// Numbers and arithmetic
// ============================================================================

const NUMBER_WORDS = {
  ZERO: 0, ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5, SIX: 6, SEVEN: 7, EIGHT: 8, NINE: 9, TEN: 10,
  ELEVEN: 11, TWELVE: 12, THIRTEEN: 13, FOURTEEN: 14, FIFTEEN: 15, SIXTEEN: 16, SEVENTEEN: 17,
  EIGHTEEN: 18, NINETEEN: 19, TWENTY: 20, THIRTY: 30, FORTY: 40, FIFTY: 50, SIXTY: 60, SEVENTY: 70,
  EIGHTY: 80, NINETY: 90,
};
const NUMBER_SCALES = { HUNDRED: 100, THOUSAND: 1e3, MILLION: 1e6, BILLION: 1e9 };
const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

/**
 * Reads a number that starts at `tokens[i]`: digits ("12", "3 POINT 5", "5 THOUSAND") or words
 * ("TWENTY TWO", "A HUNDRED AND FIVE", "THREE POINT FIVE"). Returns `{ value, next }` or null.
 */
function readNumber(tokens, i) {
  const tok = tokens[i];
  if (tok === undefined) return null;
  if (/^\d+$/.test(tok)) {
    let value = Number(tok);
    let next = i + 1;
    if (tokens[next] === "POINT" && /^\d+$/.test(tokens[next + 1] || "")) {
      value = Number(`${tok}.${tokens[next + 1]}`);
      next += 2;
    }
    if (hasOwn(NUMBER_SCALES, tokens[next] || "")) {
      value *= NUMBER_SCALES[tokens[next]];
      next++;
    }
    return { value, next };
  }
  let total = 0;
  let current = 0;
  let used = false;
  let next = i;
  if ((tok === "A" || tok === "AN") && hasOwn(NUMBER_SCALES, tokens[i + 1] || "")) {
    current = 1; // "a hundred"
    used = true;
    next = i + 1;
  }
  for (; next < tokens.length; next++) {
    const w = tokens[next];
    if (hasOwn(NUMBER_WORDS, w)) {
      current += NUMBER_WORDS[w];
      used = true;
    } else if (w === "HUNDRED" && used) {
      current = (current || 1) * 100;
    } else if (hasOwn(NUMBER_SCALES, w) && used) {
      total += (current || 1) * NUMBER_SCALES[w];
      current = 0;
    } else if (w === "AND" && used && hasOwn(NUMBER_WORDS, tokens[next + 1] || "")) {
      continue; // "one hundred and five"
    } else {
      break;
    }
  }
  if (!used) return null;
  let value = total + current;
  if (tokens[next] === "POINT") {
    let digits = "";
    let j = next + 1;
    for (; j < tokens.length; j++) {
      const w = tokens[j];
      if (/^\d+$/.test(w)) digits += w;
      else if (hasOwn(NUMBER_WORDS, w) && NUMBER_WORDS[w] <= 9) digits += NUMBER_WORDS[w];
      else break;
    }
    if (digits) {
      value = Number(`${value}.${digits}`);
      next = j;
    }
  }
  return { value, next };
}

const CALC_LEAD = new Set("WHAT IS ARE WHATS CALCULATE COMPUTE SOLVE EVALUATE WORK OUT HOW MUCH TELL ME CAN YOU PLEASE DOES DO THE".split(" "));
const CALC_CONTINUES = new Set("PLUS MINUS TIMES DIVIDED MULTIPLIED OVER TAKE ADD SUBTRACT SQUARED CUBED".split(" "));
const CALC_TAIL = new Set("EQUAL EQUALS EQ PLEASE IS MAKE MAKES".split(" "));

/** Splits an expression written in symbols, words, or both into upper-case tokens. */
function calcTokens(text) {
  return String(text)
    .toUpperCase()
    .replace(/(\d),(?=\d{3}(?!\d))/g, "$1")
    .replace(/(\d)\.(?=\d)/g, "$1 POINT ")
    .replace(/([A-Z])-(?=[A-Z])/g, "$1 ") // "twenty-two"
    .replace(/<=/g, " LE ")
    .replace(/>=/g, " GE ")
    .replace(/!=/g, " NE ")
    .replace(/={1,2}/g, " EQ ")
    .replace(/</g, " LT ")
    .replace(/>/g, " GT ")
    .replace(/\(/g, " OPEN ")
    .replace(/\)/g, " CLOSE ")
    .replace(/\+/g, " PLUS ")
    .replace(/[-−–]/g, " MINUS ")
    .replace(/[*×]/g, " TIMES ")
    .replace(/[/÷]/g, " OVER ")
    .replace(/\^/g, " POWER ")
    .replace(/%/g, " PERCENT ")
    .replace(/(\d)\s*X\s*(?=\d)/g, "$1 TIMES ")
    .replace(/[^A-Z0-9 ]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Works out a sum written the way people type or say it: "2 + 2", "12 times 12", "15 percent of 80",
 * "the square root of 81", "ten plus twenty two", "(3 + 4) * 5", "2 to the power of 8", "half of 30".
 * Comparisons ("7 < 9") give true or false. Nothing is ever executed as code.
 * Returns `{ value, ops }` (ops = how many operations it contained), `{ divideByZero: true }`, or
 * null when the text is not arithmetic.
 */
export function evaluateArithmetic(text) {
  const all = calcTokens(text);
  let from = 0;
  while (from < all.length && CALC_LEAD.has(all[from])) from++;
  let to = all.length;
  while (to > from && CALC_TAIL.has(all[to - 1])) to--;
  let tok = all.slice(from, to);
  if (!tok.length || tok.length > 40) return null;
  // Verb first: "divide 81 by 3", "multiply 6 by 7", "add 5 to 10", "subtract 3 from 10".
  const verb = tok[0];
  if (verb === "DIVIDE" || verb === "MULTIPLY" || verb === "TIMES") {
    const by = tok.indexOf("BY");
    if (by > 1) tok = [...tok.slice(1, by), verb === "DIVIDE" ? "OVER" : "TIMES", ...tok.slice(by + 1)];
  } else if (verb === "ADD" || verb === "SUM") {
    const skip = tok[1] === "UP" || tok[1] === "OF" ? 2 : 1; // "add up 45 and 30", "sum of 4 and 5"
    const joint = tok.findIndex((t, k) => k > skip && (t === "TO" || t === "AND" || t === "PLUS"));
    if (joint > skip) tok = [...tok.slice(skip, joint), "PLUS", ...tok.slice(joint + 1)];
  } else if (verb === "SUBTRACT") {
    const fromAt = tok.indexOf("FROM");
    if (fromAt > 1) tok = [...tok.slice(fromAt + 1), "MINUS", ...tok.slice(1, fromAt)];
  }

  let i = 0;
  let ops = 0;
  const take = (...words) => {
    for (let k = 0; k < words.length; k++) if (tok[i + k] !== words[k]) return false;
    i += words.length;
    return true;
  };
  const fail = (why = "syntax") => {
    throw new Error(why);
  };
  let additive;
  const primary = () => {
    if (take("OPEN")) {
      const v = additive();
      if (!take("CLOSE")) fail();
      return v;
    }
    const num = readNumber(tok, i);
    if (!num) fail();
    i = num.next;
    return num.value;
  };
  const postfix = () => {
    let v = primary();
    for (;;) {
      if (take("SQUARED")) v *= v;
      else if (take("CUBED")) v **= 3;
      else if (tok[i] === "PERCENT" && tok[i + 1] !== "OF") {
        i++;
        v /= 100;
      } else return v;
      ops++;
    }
  };
  let unary;
  const power = () => {
    const base = postfix();
    if (take("TO", "THE", "POWER", "OF") || take("TO", "THE", "POWER") || take("RAISED", "TO") || take("POWER")) {
      ops++;
      return base ** unary();
    }
    return base;
  };
  unary = () => {
    if (take("MINUS") || take("NEGATIVE")) return -unary();
    if (take("PLUS") || take("THE")) return unary();
    if (take("SQUARE", "ROOT", "OF") || take("SQUARE", "ROOT") || take("SQRT") || take("ROOT", "OF")) {
      ops++;
      const v = unary();
      if (v < 0) fail();
      return Math.sqrt(v);
    }
    if (take("HALF", "OF") || take("HALF")) {
      ops++;
      return unary() / 2;
    }
    if (take("DOUBLE") || take("TWICE")) {
      ops++;
      return unary() * 2;
    }
    if (take("TRIPLE")) {
      ops++;
      return unary() * 3;
    }
    return power();
  };
  const multiplicative = () => {
    let v = unary();
    for (;;) {
      if (take("TIMES") || take("MULTIPLIED", "BY") || take("X")) v *= unary();
      else if (take("DIVIDED", "BY") || take("OVER")) {
        const d = unary();
        if (d === 0) fail("div0");
        v /= d;
      } else if (take("MOD") || take("MODULO")) {
        const d = unary();
        if (d === 0) fail("div0");
        v %= d;
      } else if (take("PERCENT", "OF")) v = (v / 100) * unary();
      else return v;
      ops++;
    }
  };
  additive = () => {
    let v = multiplicative();
    for (;;) {
      if (take("PLUS") || take("ADDED", "TO") || take("ADD")) v += multiplicative();
      else if (take("MINUS") || take("TAKE", "AWAY") || take("SUBTRACT")) v -= multiplicative();
      else return v;
      ops++;
    }
  };

  try {
    let value = additive();
    const cmp = tok[i];
    if (cmp === "LT" || cmp === "GT" || cmp === "LE" || cmp === "GE" || cmp === "EQ" || cmp === "NE") {
      i++;
      const rhs = additive();
      ops++;
      value =
        cmp === "LT" ? value < rhs : cmp === "GT" ? value > rhs : cmp === "LE" ? value <= rhs : cmp === "GE" ? value >= rhs : cmp === "EQ" ? value === rhs : value !== rhs;
    }
    if (i !== tok.length) return null;
    if (typeof value === "number" && !Number.isFinite(value)) return null;
    return { value, ops };
  } catch (err) {
    return err.message === "div0" ? { divideByZero: true, value: NaN, ops: 1 } : null;
  }
}

/** Writes a number the way a person would: no floating-point dust, optional fixed rounding. */
function formatNumber(value, decimals) {
  if (decimals !== undefined && decimals !== "") {
    const n = Math.max(0, Math.min(10, parseInt(decimals, 10) || 0));
    return String(Number(value.toFixed(n)));
  }
  return String(Math.round(value * 1e8) / 1e8);
}

// ============================================================================
// Word sets and lookup maps (AIML 2.0 `<set>` in patterns, `<map>` in templates)
// ============================================================================

/**
 * The singulars a plural could have come from: "CATS" -> CAT, "FOXES" -> FOX or FOXE,
 * "PUPPIES" -> PUPPY or PUPPIE (so "TOASTIES" finds TOASTIE).
 */
function singularForms(phrase) {
  const out = [];
  if (/IES$/.test(phrase)) out.push(`${phrase.slice(0, -3)}Y`);
  if (/(CH|SH|X|SS|O)ES$/.test(phrase)) out.push(phrase.slice(0, -2));
  if (/[^S]S$/.test(phrase)) out.push(phrase.slice(0, -1));
  return out;
}

/** A named list of words or phrases that a pattern can ask for with `<set>name</set>`. */
function makeWordSet(members) {
  const phrases = new Set();
  let maxWords = 1;
  for (const raw of members) {
    const norm = normalizeAimlInput(raw, false);
    if (!norm) continue;
    phrases.add(norm);
    maxWords = Math.max(maxWords, norm.split(" ").length);
  }
  return {
    maxWords,
    phrases,
    sample: [...phrases][0] || "",
    /** Returns the member that `phrase` is (plurals count), or "" if it is not in the set. */
    match(phrase) {
      if (phrases.has(phrase)) return phrase;
      return singularForms(phrase).find((single) => phrases.has(single)) || "";
    },
  };
}

// Sets that are worked out rather than listed.
const BUILTIN_SETS = {
  number: {
    maxWords: 8,
    sample: "7",
    match(phrase) {
      const t = phrase.split(" ");
      const n = readNumber(t, 0);
      return n && n.next === t.length ? phrase : "";
    },
  },
  calculation: {
    maxWords: 30,
    sample: "12 TIMES 12",
    match(phrase) {
      const r = evaluateArithmetic(phrase);
      return r && r.ops > 0 && typeof r.value !== "boolean" ? phrase : "";
    },
  },
};

const FIRST_PERSON = new Set(["I", "MY", "ME", "MINE", "MYSELF"]);
const SECOND_PERSON = new Set(["YOU", "YOUR", "YOURS", "YOURSELF"]);
const isSetToken = (tok) => tok.charCodeAt(0) === 60; // "<name>"
const SET_PLACEHOLDER_RE = /^ZZSET([A-Z0-9_]+)ZZ$/;

// The base layer is the same text for every bot, so its parsed form is kept and shared.
const PARSED_BASE_CACHE = [];

// Words that open or close a sentence without changing what it asks: "so what time is it then?"
const TRIM_START = new Set("SO WELL OK AND BUT UM UH HMM OH AH ALSO ACTUALLY ANYWAY LOL HAHA HA HEH HEHE AW AWW OOH WOW LISTEN LOOK HONESTLY BASICALLY SORRY JUST THEN YES".split(" "));
const TRIM_END = new Set("THEN THOUGH ANYWAY ANYWAYS AGAIN EXACTLY PLEASE TOO ALREADY ACTUALLY MATE BUDDY DUDE BRO MAN PAL HUH EH RIGHT LOL HAHA THANKS".split(" "));
const TRIM_INNER = new Set("ACTUALLY REALLY JUST EVEN BASICALLY LITERALLY HONESTLY TOTALLY SIMPLY".split(" "));
const AUX_SWAPS = { IS: "ARE", ARE: "IS", DO: "DOES", DOES: "DO", HAS: "HAVE", HAVE: "HAS", WAS: "WERE", WERE: "WAS" };
const TRIM_END_PHRASES = [["TO", "BE", "HONEST"], ["I", "GUESS"], ["I", "SUPPOSE"], ["I", "THINK"], ["BY", "THE", "WAY"], ["AS", "WELL"], ["RIGHT", "NOW"], ["AT", "THE", "MOMENT"], ["OR", "NOT"], ["OR", "WHAT"], ["FOR", "ME"], ["THANK", "YOU"]];

/** The sentence without filler words at its start and end; always keeps at least one word. */
function trimFillers(words) {
  let a = 0;
  let b = words.length;
  for (;;) {
    if (b - a > 1 && TRIM_END.has(words[b - 1])) {
      b--;
      continue;
    }
    const phrase = TRIM_END_PHRASES.find((ph) => b - a > ph.length && ph.every((w, k) => words[b - ph.length + k] === w));
    if (phrase) {
      b -= phrase.length;
      continue;
    }
    if (b - a > 1 && TRIM_START.has(words[a])) {
      a++;
      continue;
    }
    break;
  }
  const ends = a === 0 && b === words.length ? words : words.slice(a, b);
  // "what do you actually do", "are you really a robot"
  const inner = ends.filter((w) => !TRIM_INNER.has(w));
  return inner.length && inner.length < ends.length ? inner : ends;
}

const NEGATIVE_WORDS = new Set(
  ("SAD BAD AWFUL TERRIBLE HORRIBLE TIRED EXHAUSTED EXHAUSTING ANNOYING ANNOYED ANGRY UPSET HATE HATED HATES WORST WORSE " +
    "SICK ILL HURT HURTS PAIN PAINFUL LONELY ALONE DEPRESSED DEPRESSING STRESSED STRESSFUL WORRIED SCARED AFRAID BORING " +
    "BORED HARD DIFFICULT TOUGH ROUGH BROKE LOST FAILED FAIL CRY CRYING CRIED DIED DEAD UNFAIR RUDE MEAN NERVOUS ANXIOUS " +
    "FRUSTRATED FRUSTRATING DISAPPOINTED DISAPPOINTING SUCKS SUCKED UGH UNFORTUNATELY STRUGGLING STUCK MISERABLE UNHAPPY " +
    "HEARTBROKEN DUMPED FIRED NIGHTMARE DISASTER MESS MISSED FORGOT RUINED DREADFUL GROSS NASTY STUPID DRAINING LOUSY").split(" ")
);
const POSITIVE_WORDS = new Set(
  ("GOOD GREAT AWESOME AMAZING WONDERFUL FANTASTIC LOVE LOVED LOVELY HAPPY EXCITED EXCITING FUN NICE BEST BEAUTIFUL " +
    "BRILLIANT EXCELLENT GLAD PROUD WON WIN PASSED PERFECT DELICIOUS ENJOY ENJOYED COOL SWEET YAY FINALLY PROMOTED ENGAGED " +
    "HOLIDAY VACATION PARTY RELAXING RELAXED THRILLED INCREDIBLE LUCKY GORGEOUS TASTY YUM YUMMY CELEBRATING").split(" ")
);

/** "positive", "negative" or "neutral": a rough read of a remark, so the reply can be in keeping. */
function moodOf(words) {
  let score = 0;
  words.forEach((w, i) => {
    const negated = words[i - 1] === "NOT" || words[i - 1] === "NO" || words[i - 1] === "NEVER" || words[i - 2] === "NOT";
    if (NEGATIVE_WORDS.has(w)) score += negated ? 1 : -1;
    else if (POSITIVE_WORDS.has(w)) score += negated ? -1 : 1;
  });
  return score > 0 ? "positive" : score < 0 ? "negative" : "neutral";
}

const QUESTION_STARTS = new Set(
  "WHO WHAT WHERE WHEN WHY HOW WHICH WHOSE DO DOES DID CAN COULD WILL WOULD SHOULD IS ARE AM WAS WERE HAVE HAS ANY".split(" ")
);
const REQUEST_RE =
  / (I NEED|I WANT|I WOULD LIKE|I AM LOOKING FOR|I CANNOT|I COULD NOT|HOW DO I|HOW CAN I|CAN YOU HELP|PLEASE HELP|HELP ME|HELP WITH|PROBLEM|ISSUE|ERROR|BROKEN|NOT WORKING|DOES NOT WORK|LOCKED|COMPLAINT|MY (?:ORDER|ACCOUNT|ADDRESS|DELIVERY|PAYMENT|CARD|SUBSCRIPTION|BOOKING|PASSWORD|LOGIN|INVOICE|PARCEL|PACKAGE|REFUND|TICKET|APPOINTMENT|RESERVATION|PURCHASE)) /;

/** Whether a message asks for something to be done, asks a question, or simply says something. */
function classifyInput(raw) {
  const words = normalizeAimlInput(raw, false);
  // One "word" with no vowels, or a long run of consonants: keyboard mashing.
  if (/^[A-Z]{4,}$/.test(words) && (!/[AEIOUY]/.test(words) || /[BCDFGHJKLMNPQRSTVWXZ]{6,}/.test(words))) return "gibberish";
  if (REQUEST_RE.test(` ${words} `)) return "request";
  if (/\?\s*$/.test(String(raw)) || QUESTION_STARTS.has(words.split(" ")[0])) return "question";
  return "statement";
}

/** Rebuilds a template's tags as text, just enough to look for a tag inside it. */
function templateSource(node) {
  if (!node || node.type === "text") return "";
  const attrs = Object.entries(node.attrs || {})
    .map(([k, v]) => ` ${k}="${v}"`)
    .join("");
  return `<${node.tag}${attrs}>${(node.children || []).map(templateSource).join("")}`;
}

function getPlainText(node) {
  if (!node) return "";
  if (node.type === "text") return node.value;
  return (node.children || []).map(getPlainText).join("");
}

/**
 * Matches token array `words` against AIML `patTokens`, returning an array of captured wildcard
 * strings or `null` if no match. Respects AIML wildcard arity (`_` / `*` = 1+, `#` / `^` = 0+).
 */
function matchTokens(patTokens, words, pIdx = 0, wIdx = 0, captures = [], sets = null) {
  if (pIdx === patTokens.length && wIdx === words.length) {
    return captures;
  }
  if (pIdx >= patTokens.length) return null;

  const tok = patTokens[pIdx];
  if (tok === "#" || tok === "^") {
    // 0 or more words
    for (let end = wIdx; end <= words.length; end++) {
      const cap = words.slice(wIdx, end).join(" ");
      const res = matchTokens(patTokens, words, pIdx + 1, end, [...captures, cap], sets);
      if (res) return res;
    }
    return null;
  }

  if (tok === "_" || tok === "*") {
    // 1 or more words
    if (wIdx >= words.length) return null;
    for (let end = wIdx + 1; end <= words.length; end++) {
      const cap = words.slice(wIdx, end).join(" ");
      const res = matchTokens(patTokens, words, pIdx + 1, end, [...captures, cap], sets);
      if (res) return res;
    }
    return null;
  }

  if (wIdx >= words.length) return null;
  if (isSetToken(tok)) {
    // `<set>name</set>`: one member of the set, longest first ("ice cream" before "ice")
    const set = sets ? sets(tok.slice(1, -1)) : null;
    if (!set) return null;
    for (let end = Math.min(words.length, wIdx + set.maxWords); end > wIdx; end--) {
      const member = set.match(words.slice(wIdx, end).join(" "));
      if (!member) continue;
      const res = matchTokens(patTokens, words, pIdx + 1, end, [...captures, member], sets);
      if (res) return res;
    }
    return null;
  }
  const cleanTok = tok.startsWith("$") ? tok.slice(1) : tok;
  if (cleanTok === words[wIdx]) {
    return matchTokens(patTokens, words, pIdx + 1, wIdx + 1, captures, sets);
  }
  return null;
}

const WILDCARDS = new Set(["*", "_", "#", "^"]);

/**
 * Computes deterministic AIML 2.0 priority score for a pattern so specific rules always beat `*`.
 * Priority per token: `$WORD` (7) > `#` (6) > `_` (5) > `WORD` (4) > `<set>` (3) > `^` (2) > `*` (1).
 */
function scoreCategory(cat) {
  let patternScore = 0;
  let exactWordCount = 0;
  for (const tok of cat.patTokens) {
    if (tok.startsWith("$")) patternScore = patternScore * 8 + 7;
    else if (tok === "#") patternScore = patternScore * 8 + 6;
    else if (tok === "_") patternScore = patternScore * 8 + 5;
    else if (tok === "^") patternScore = patternScore * 8 + 2;
    else if (tok === "*") patternScore = patternScore * 8 + 1;
    else if (isSetToken(tok)) patternScore = patternScore * 8 + 3;
    else patternScore = patternScore * 8 + 4;
    // A word from a set says more than a wildcard but less than a word spelled out.
    if (isSetToken(tok)) exactWordCount += 0.5;
    else if (!WILDCARDS.has(tok)) exactWordCount += 1;
  }
  const topicBonus = cat.topic !== "*" ? 1e12 : 0;
  const thatBonus = cat.that !== "*" ? 1e9 : 0;
  return topicBonus + thatBonus + exactWordCount * 1e6 + patternScore;
}

// Words too common to tell one question from another.
const STOPWORDS = new Set(
  ("A AN THE IS ARE AM BE DO DOES DID YOU YOUR I ME MY WE OUR IT ITS TO OF IN ON AT FOR AND OR SO " +
    "WHAT WHEN WHERE WHO HOW WHY CAN COULD WOULD WILL SHOULD PLEASE TELL HAVE HAS THAT THIS THERE ANY SOME WITH ABOUT")
    .split(" ")
);

// A wider list for judging what a question is about: filler verbs, quantifiers and pleasantries.
const FILLER_WORDS = new Set(
  [...STOPWORDS].concat(
    ("GET GOT NEED WANT KNOW MUCH MANY LONG TAKE MAKE GO GOING JUST REALLY VERY ALSO TOO NOW THEN THAN FROM BY AS IF " +
      "BUT NOT NO YES OK HI HELLO HEY THANK THANKS MORE MOST ALL EACH EVERY ANYTHING SOMETHING THING STUFF WAY KIND SORT " +
      "LOT BIT GIVE SHOW SEE LOOK USE BEEN WAS WERE MIGHT MAY MUST LET HERE WHICH THEY THEM THEIR HE SHE HIS HER US ONE " +
      "GOOD GREAT NEW RIGHT SURE QUESTION WONDER ASK SAY OUT UP DOWN OFF INTO OVER AGAIN STILL YET EVER NEVER ALWAYS " +
      "TODAY LIKE DOING DONE HAD BEING DOE ACTUALLY MAYBE QUICK")
      .split(" ")
  )
);

/**
 * Reduces a word to a rough stem so related forms meet: PRICES / PRICING -> PRIC,
 * SHIPPED / SHIPPING / SHIPMENT -> SHIP, DELIVERY / DELIVERIES / DELIVERED -> DELIV.
 * It only has to be consistent, not linguistically correct.
 */
function stemWord(word) {
  let w = word;
  if (w.length <= 3) return w;
  const strip = (suffix, minStem, replacement = "") => {
    if (w.endsWith(suffix) && w.length - suffix.length >= minStem) {
      w = w.slice(0, w.length - suffix.length) + replacement;
      return true;
    }
    return false;
  };
  // plurals
  if (!strip("IES", 2, "Y") && !/(SS|US|IS)$/.test(w)) strip("S", 3);
  // derivational endings
  strip("ION", 4) || strip("MENT", 3) || strip("ING", 3) || strip("ED", 4) || strip("LY", 4);
  if (w.length > 5) strip("Y", 4);
  if (w.length > 6) strip("ER", 4);
  // SHIPP -> SHIP, CANCELL -> CANCEL
  if (w.length > 4 && w[w.length - 1] === w[w.length - 2] && !/[AEIOU]/.test(w[w.length - 1])) w = w.slice(0, -1);
  if (w.length > 4) strip("E", 3);
  return w;
}

// Groups of words that mean the same thing to a website visitor. When a question uses one and a
// rule uses another, they are treated as the same idea.
const SYNONYM_SETS = {
  price: "price prices pricing cost costs fee fees charge charges rate rates expensive cheap affordable quote tariff",
  shipping: "ship ships shipping shipped shipment delivery deliver delivered delivering postage freight courier dispatch parcel arrive arrives arrival",
  returns: "return returns returning refund refunds refunded exchange exchanges reimburse reimbursement",
  hours: "hours open opening opens close closes closing closed shut shuts schedule",
  contact: "contact contacting reach message enquiry inquiry enquire inquire",
  phone: "phone telephone call calling ring mobile",
  talk: "talk talking speak speaking chat chatting",
  email: "email emails emailing mail",
  location: "location located locations address where directions based office offices store stores shop shops branch branches showroom",
  buy: "buy buying bought purchase purchasing order ordering orders checkout",
  discount: "discount discounts coupon coupons promo promotion promotions sale sales deal deals voucher vouchers offer offers",
  account: "account accounts login signin signup register registration password profile",
  cancel: "cancel cancelling canceling cancellation cancelled unsubscribe terminate",
  payment: "pay paying paid payment payments card cards paypal invoice invoices billing bill visa mastercard",
  trial: "trial trials demo demos sample samples preview",
  support: "support help assist assistance helpdesk troubleshoot troubleshooting",
  warranty: "warranty warranties guarantee guaranteed guarantees",
  tracking: "track tracking tracked status",
  install: "embed embedding install installing installation integrate integration setup plugin widget",
  download: "download downloads downloading export exporting",
  docs: "docs documentation guide guides manual tutorial tutorials instructions",
  about: "about company business team story mission history",
  security: "safe safety secure security privacy private gdpr",
  jobs: "job jobs career careers hiring vacancy vacancies employment recruit recruiting",
  size: "size sizes sizing fit fits measurement measurements",
  features: "feature features function functions capability capabilities",
  stock: "stock available availability inventory",
};

const SYNONYM_GROUP = new Map(); // stem -> group name
const SYNONYM_WORDS = new Map(); // group name -> words (uppercase)
for (const [group, list] of Object.entries(SYNONYM_SETS)) {
  const words = list.toUpperCase().split(" ");
  SYNONYM_WORDS.set(group, words);
  for (const w of words) if (!SYNONYM_GROUP.has(stemWord(w))) SYNONYM_GROUP.set(stemWord(w), group);
}

// Everyday phrases that mean one of the ideas above.
const PHRASE_IDEAS = [
  [["MONEY", "BACK"], "REFUND"],
  [["GET", "IN", "TOUCH"], "CONTACT"],
  [["LOG", "IN"], "LOGIN"],
  [["SIGN", "IN"], "LOGIN"],
  [["SIGN", "UP"], "REGISTER"],
  [["SET", "UP"], "SETUP"],
  [["SEND", "BACK"], "RETURN"],
  [["HOW", "FAR"], "LOCATION"],
  [["IN", "STOCK"], "AVAILABLE"],
  [["OPENING", "TIMES"], "HOURS"],
  [["ON", "MY", "SITE"], "EMBED"],
  [["ON", "MY", "WEBSITE"], "EMBED"],
  [["ON", "MY", "PAGE"], "EMBED"],
  [["TO", "MY", "SITE"], "EMBED"],
  [["TO", "MY", "WEBSITE"], "EMBED"],
  // "how much" asks the price only when nothing else follows it ("how much time..." does not)
  [["HOW", "MUCH"], "PRICE", ["IS", "DOES", "DO", "ARE", "FOR", "WOULD", "WILL", "IT", "THAT", "THIS"]],
];

/** Replaces known phrases with the single word that carries their meaning. */
function collapsePhrases(words) {
  let out = words;
  for (const [phrase, word, followers] of PHRASE_IDEAS) {
    for (let i = 0; i + phrase.length <= out.length; i++) {
      if (!phrase.every((p, k) => out[i + k] === p)) continue;
      const next = out[i + phrase.length];
      if (followers && next !== undefined && !followers.includes(next)) continue;
      out = [...out.slice(0, i), word, ...out.slice(i + phrase.length)];
    }
  }
  return out;
}

/** The "idea" a word stands for: its synonym group if it has one, otherwise its stem. Empty for filler. */
function wordFeature(word) {
  if (FILLER_WORDS.has(word)) return "";
  const stem = stemWord(word);
  if (stem.length < 2 || FILLER_WORDS.has(stem)) return "";
  const group = SYNONYM_GROUP.get(stem);
  return group ? `@${group}` : stem;
}

/** Turns pattern words into a readable suggestion label: ["OPENING", "HOURS"] -> "Opening hours". */
function labelFromWords(words) {
  const text = words.join(" ").toLowerCase();
  return text ? text[0].toUpperCase() + text.slice(1) : "";
}

// Every tag a template may contain. Anything else is reported by the rule checker.
const KNOWN_TEMPLATE_TAGS = new Set(
  ("star thatstar topicstar bot get set think srai sr random li condition uppercase lowercase formal sentence " +
    "person person2 date time size version input that request response br emote gesture reply button chip suggest " +
    "oob chips map calc explode count daysuntil fallback try name value text postback").split(" ")
);

// A bot property used in a pattern (`<bot name="company"/>`) that has no value yet.
const MISSING_PROP = "\u0001";

/** Edit distance where a swap of two neighbouring letters counts as one mistake. */
function editDistance(a, b, limit) {
  if (Math.abs(a.length - b.length) > limit) return limit + 1;
  const rows = a.length + 1;
  const cols = b.length + 1;
  let prev2 = null;
  let prev = Array.from({ length: cols }, (_, j) => j);
  for (let i = 1; i < rows; i++) {
    const cur = [i];
    let best = i;
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (prev2 && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        v = Math.min(v, prev2[j - 2] + 1);
      }
      cur[j] = v;
      if (v < best) best = v;
    }
    if (best > limit) return limit + 1;
    prev2 = prev;
    prev = cur;
  }
  return prev[cols - 1];
}

// The only words allowed around the member in a follow-up: "and Germany?", "what about the latte?",
// "is there almond too?", "do you have any soy?"
const FOLLOW_UP_WORDS = new Set("AND OR WHAT ABOUT HOW IS ARE THERE ANY DO YOU HAVE GOT A AN THE ALSO TOO THEN PLEASE FOR OF IN WITH".split(" "));
const POINTING_WORDS = new Set(["IT", "THEY", "THEM", "THAT", "THOSE", "THIS", "THESE", "ONE", "THERE"]);

/** The longest member of `set` anywhere in `words`, with the words around it; null if there is none. */
function findMember(set, words) {
  for (let len = Math.min(set.maxWords, words.length); len >= 1; len--) {
    for (let i = 0; i + len <= words.length; i++) {
      const member = set.match(words.slice(i, i + len).join(" "));
      if (member) return { member, rest: [...words.slice(0, i), ...words.slice(i + len)] };
    }
  }
  return null;
}

/** A base-layer rule tied to the bot's last sentence, whose wildcards captured a word that carries meaning. */
function isFollowUpGuess(hit) {
  const cat = hit.category;
  if (cat.layer !== "base" || cat.firm || cat.literalOnly || (cat.that === "*" && cat.topic === "*")) return false;
  return hit.stars.some((star) => star.split(" ").some((w) => w && wordFeature(w) !== ""));
}

/** One of your rules that is about something in particular, rather than an open "WHAT IS *" style template. */
const isTopicalRule = (cat) => cat.layer === "custom" && (cat.keywordIdeas.size > 0 || !cat.patTokens.some((t) => t === "*" || t === "_"));

/** Rules about the site itself: everything you wrote, and base-layer answers that come from a fact you filled in. */
const isSiteRule = (cat) => cat.layer === "custom" || cat.requires.length > 0;

/** Predicate names are case-insensitive, and a worked-out name may contain spaces. */
function normalizePredicateName(name) {
  return String(name || "").trim().toLowerCase().replace(/\s+/g, " ");
}

export class AIMLEngine {
  /**
   * @param {object} options
   * @param {object} [options.botProps]  name, role, company, website (read with `<bot name="..."/>`)
   * @param {string} [options.xml]       your AIML document
   * @param {string} [options.baseXml]   a base layer that answers only when your document has nothing more specific
   */
  constructor(options = {}) {
    this.botProps = {
      name: "Aria",
      role: "Website Companion",
      company: "bot.computer",
      website: "https://bot.computer",
      ...(options.botProps || {}),
    };
    this.vars = new Map([["topic", "*"]]);
    this.layers = { custom: [], base: [] };
    this.categories = [];
    this.vocabulary = new Set();
    this.quickChips = [];
    this.xmlBotProps = {};
    this.lastBotThat = "";
    this.history = [];
    this.fallbackStreak = 0;
    this._randomMemory = new WeakMap();
    // Word sets and lookup maps defined in each layer; yours are looked up before the base layer's.
    this._defs = { custom: { sets: new Map(), maps: new Map() }, base: { sets: new Map(), maps: new Map() } };
    this._lastFrame = null; // the last question about one member of a set, so a follow-up can continue it
    this._lastEntity = null; // the last member of one of your sets or maps that was mentioned
    this._lastResult = null; // the last number a <calc> produced
    this._justVaried = false;
    this._resolvingEntity = false;
    this._setLookup = (name) => this.#findSet(name);
    this._sources = { custom: "", base: "" };
    this._idf = new Map();
    this._answerIds = new Map();
    if (options.baseXml) {
      this.loadBaseXML(options.baseXml);
    }
    if (options.xml) {
      this.loadXML(options.xml);
    }
  }

  setBotProps(props) {
    Object.assign(this.botProps, props || {});
    // Patterns may mention a property (`<bot name="company"/>`), so both layers are read again
    // with the new values. (The base layer comes from a cache unless such a property changed.)
    try {
      if (this._sources.base) {
        const base = this.#parseBase(this._sources.base);
        this.layers.base = base.categories;
        this._defs.base = { sets: base.sets, maps: base.maps };
      }
      if (this._sources.custom) {
        const parsed = this.#parseDocument(this._sources.custom, "custom");
        this.layers.custom = parsed.categories;
        this._defs.custom = { sets: parsed.sets, maps: parsed.maps };
        this.quickChips = parsed.quickChips;
        this.xmlBotProps = parsed.xmlBotProps;
      }
      this.#rebuildIndex();
    } catch {
      // Keep the rules that were already loaded if a document no longer parses.
    }
  }

  /** The base layer, parsed once and shared between bots that have the same pattern properties. */
  #parseBase(xmlString) {
    const current = (key) => String(this.botProps[key] ?? "").trim();
    const hit = PARSED_BASE_CACHE.find((e) => e.xml === xmlString && Object.entries(e.props).every(([k, v]) => current(k) === v));
    if (hit) return hit.parsed;
    const parsed = this.#parseDocument(xmlString, "base");
    PARSED_BASE_CACHE.unshift({ xml: xmlString, props: parsed.patternProps, parsed });
    if (PARSED_BASE_CACHE.length > 4) PARSED_BASE_CACHE.length = 4;
    return parsed;
  }

  /** A set by name: yours first, then the base layer's, then the built-in ones. A map's keys are a set too. */
  #findSet(name) {
    for (const layer of [this._defs.custom, this._defs.base]) {
      const set = layer.sets.get(name);
      if (set) return set;
      const map = layer.maps.get(name);
      if (map) return map.keys;
    }
    return hasOwn(BUILTIN_SETS, name) ? BUILTIN_SETS[name] : null;
  }

  #findMap(name) {
    return this._defs.custom.maps.get(name) || this._defs.base.maps.get(name) || null;
  }

  /** An attribute, which AIML 2.0 also lets you write as a child element (`<name>...</name>`). */
  #attr(node, key, ctx) {
    if (node.attrs && node.attrs[key] !== undefined) return node.attrs[key];
    const child = (node.children || []).find((c) => c.type === "element" && c.tag === key);
    return child ? this.#evalChildren(child.children, ctx).trim() : undefined;
  }

  /** A node's content without the child elements that stand in for attributes. */
  #body(node, keys) {
    return (node.children || []).filter((c) => !(c.type === "element" && keys.includes(c.tag)));
  }

  /** What the wildcards and sets of a pattern would capture for a typical question, for previews. */
  sampleStars(cat) {
    const stars = [];
    for (const tok of cat.patTokens) {
      if (tok === "*" || tok === "_") stars.push("…");
      else if (tok === "#" || tok === "^") stars.push("");
      else if (isSetToken(tok)) stars.push(this.#findSet(tok.slice(1, -1))?.sample || "…");
    }
    return stars;
  }

  /** A question a visitor could type to reach this rule, for the "Try" button in the studio. */
  samplePhrase(cat) {
    const words = [];
    for (const tok of cat.patTokens) {
      if (tok === "*" || tok === "_") words.push("something");
      else if (tok === "#" || tok === "^") continue;
      else if (isSetToken(tok)) {
        const set = this.#findSet(tok.slice(1, -1));
        if (!set || !set.sample) return "";
        words.push(set.sample);
      } else words.push(tok.replace(/^\$/, ""));
    }
    return words.join(" ").toLowerCase();
  }

  /** True when the bot has a non-empty value for any of the listed properties. */
  #hasAnyProp(keys) {
    return keys.some((k) => String(this.botProps[k] || this.xmlBotProps?.[k] || "").trim() !== "");
  }

  /**
   * A readable sample of what a template says, for listing rules: properties are filled in, the
   * first of any alternatives is used, and things only known mid-conversation appear as "…".
   */
  previewTemplate(node, stars = []) {
    const walk = (n) => {
      if (n.type === "text") return n.value;
      const inner = () => (n.children || []).map(walk).join("");
      switch (n.tag) {
        case "star": {
          const value = stars[Math.max(1, parseInt(n.attrs.index || "1", 10)) - 1];
          return value === undefined ? "…" : value.toLowerCase();
        }
        case "map": {
          const map = this.#findMap((n.attrs.name || "").toLowerCase());
          const key = normalizeAimlInput(inner(), false);
          return (map && map.entries.get(key)) || "…";
        }
        case "srai":
          return `→ ${inner().toLowerCase()}`;
        case "bot": {
          const key = (n.attrs.name || "").toLowerCase();
          return String(this.botProps[key] || this.xmlBotProps?.[key] || "…");
        }
        case "random":
        case "condition": {
          const first = (n.children || []).find((c) => c.type === "element" && c.tag === "li");
          return first ? walk(first) : inner();
        }
        case "think":
        case "emote":
        case "gesture":
        case "reply":
        case "button":
        case "chip":
        case "chips":
        case "suggest":
        case "oob":
          return "";
        case "thatstar":
        case "topicstar":
        case "get":
        case "input":
        case "that":
        case "request":
        case "response":
        case "sr":
        case "try":
        case "date":
        case "time":
        case "calc":
        case "count":
        case "daysuntil":
          return "…";
        case "fallback":
        case "name":
        case "value":
          return "";
        case "br":
          return " ";
        default:
          return inner();
      }
    };
    return stripSpeechTags(walk(node)).replace(/\s+/g, " ").replace(/\s+([,.!?;:])/g, "$1").trim();
  }

  /**
   * Looks over your rules for mistakes that would not stop them loading but would stop them working:
   * tags this engine does not know, misspelled [actions], the same pattern written twice, a
   * `<srai>` that leads nowhere, and `<bot name="..."/>` properties that have no value.
   */
  lint(limit = 12) {
    const warnings = [];
    const warn = (line, message) => {
      if (warnings.length < limit && !warnings.some((w) => w.line === line && w.message === message)) {
        warnings.push({ line, message });
      }
    };
    const neutral = { activeTopic: "*", activeTopicWords: ["*"], lastThatWords: [] };
    const seenPatterns = new Map();
    const seenTemplates = new Set();

    const checkText = (text, line) => {
      for (const m of text.matchAll(/\[([^\]\n]{1,60})\]/g)) {
        const inner = m[1].trim();
        if (!/^[a-zA-Z_/]/.test(inner) || /(^|[,\s])\/?sing\b/i.test(inner)) continue;
        for (const part of inner.split(/[,\s]+/).filter(Boolean)) {
          const word = part.split("=")[0].toLowerCase();
          if (soundOf(part) || resolveActionTag(part) || VOICE_TAG_WORDS.has(word) || Object.prototype.hasOwnProperty.call(MOOD_TAGS, word)) continue;
          if (part.includes("=")) continue; // a voice setting such as speed=1.1
          const near = [...AVATAR_ACTION_TAGS, ...VOICE_SOUND_TAGS].find((tag) => editDistance(tag, word.replace(/[-_]/g, ""), 2) <= (word.length > 4 ? 2 : 1));
          warn(line, `[${part}] is not an action or voice style, so it is left out.${near ? ` Did you mean [${near}]?` : ""}`);
        }
      }
    };

    const walk = (node, line) => {
      if (node.type === "text") {
        checkText(node.value, line);
        return;
      }
      const here = node.line || line;
      if (!KNOWN_TEMPLATE_TAGS.has(node.tag)) {
        warn(here, `<${node.tag}> is not a tag this engine supports. Its contents are used as plain text.`);
      } else if (node.tag === "bot") {
        const key = (node.attrs.name || "").toLowerCase();
        if (key && !String(this.botProps[key] || this.xmlBotProps?.[key] || "").trim()) {
          warn(here, `<bot name="${key}"/> has no value yet, so nothing is said there.`);
        }
      } else if (node.tag === "srai" && (node.children || []).every((c) => c.type === "text")) {
        const target = normalizeAimlInput(getPlainText(node), false);
        const words = target.split(" ");
        if (target && !this.#matchWords(words, false, neutral) && !this.#matchWords(words, false, neutral, true)) {
          const written = getPlainText(node).replace(/\s+/g, " ").trim();
          warn(here, `<srai>${written}</srai> does not lead to any rule, so this answer falls through to the fallback.`);
        }
      }
      if (node.tag === "map" && node.attrs.name && !this.#findMap(node.attrs.name.toLowerCase())) {
        warn(here, `The map "${node.attrs.name}" is not defined, so nothing is looked up there.`);
      }
      for (const child of node.children || []) walk(child, here);
    };

    for (const cat of this.layers.custom) {
      for (const name of cat.sets) {
        if (!this.#findSet(name)) warn(cat.line, `The set "${name}" is not defined, so the pattern "${cat.pattern}" can never match.`);
      }
      const key = `${cat.pattern}\u0001${cat.that}\u0001${cat.topic}`;
      const first = seenPatterns.get(key);
      if (first && first.template !== cat.template) {
        warn(cat.line, `The pattern "${cat.pattern}" is already used on line ${first.line}. Only one of them can answer.`);
      } else if (!first) {
        seenPatterns.set(key, cat);
      }
      if (!seenTemplates.has(cat.template)) {
        seenTemplates.add(cat.template);
        for (const child of cat.template.children || []) walk(child, cat.template.line || cat.line);
      }
    }
    return warnings;
  }

  /** Reads a pattern's text, filling in `<bot name="..."/>` from the bot's properties. */
  #patternText(node) {
    if (node.type === "text") return node.value;
    if (node.tag === "bot") {
      const value = String(this.botProps[(node.attrs.name || "").toLowerCase()] ?? "").trim();
      if (this._patternProps) this._patternProps[(node.attrs.name || "").toLowerCase()] = value;
      return value ? ` ${value} ` : MISSING_PROP;
    }
    if (node.tag === "set") {
      // `<set>color</set>` (or `<set name="color"/>`): any one member of that set
      const name = (node.attrs.name || getPlainText(node)).trim().toUpperCase().replace(/[^A-Z0-9_]+/g, "_");
      return name ? ` ZZSET${name}ZZ ` : "";
    }
    return (node.children || []).map((c) => this.#patternText(c)).join("");
  }

  /**
   * Runs the matcher over a few sample sentences so that a visitor's first question is answered
   * as quickly as every later one. Nothing about the conversation changes.
   */
  warmUp() {
    for (const sample of ["hello there", "what are your fees for postage please", "xyzzy plugh frobnicate", "i like hiking a lot"]) {
      try {
        this.resolve(sample);
      } catch {
        // warming up is best-effort
      }
    }
  }

  /** What the visitor has told the bot so far, so a conversation can continue on another page. */
  exportSession() {
    return {
      vars: [...this.vars.entries()],
      lastBotThat: this.lastBotThat,
      history: this.history.slice(-12),
      fallbackStreak: this.fallbackStreak,
    };
  }

  importSession(session) {
    if (!session || typeof session !== "object") return;
    try {
      if (Array.isArray(session.vars)) this.vars = new Map(session.vars.filter((e) => Array.isArray(e) && e.length === 2));
      if (!this.vars.has("topic")) this.vars.set("topic", "*");
      if (typeof session.lastBotThat === "string") this.lastBotThat = session.lastBotThat;
      if (Array.isArray(session.history)) this.history = session.history.slice(-12);
      this.fallbackStreak = Number(session.fallbackStreak) || 0;
    } catch {
      this.resetSession();
    }
  }

  resetSession() {
    this._lastFrame = null;
    this._lastEntity = null;
    this._lastResult = null;
    this._justVaried = false;
    this.vars.clear();
    this.vars.set("topic", "*");
    this.lastBotThat = "";
    this.history = [];
    this.fallbackStreak = 0;
  }

  /** Parses one AIML document into categories, default quick chips and declared bot properties. */
  #parseDocument(xmlString, layer) {
    const doc = parseXmlDocument(xmlString);
    const aimlNode =
      doc.children.find((n) => n.type === "element" && n.tag === "aiml") || doc;

    const categories = [];
    const quickChips = [];
    const xmlBotProps = {};
    const sets = new Map();
    const maps = new Map();
    this._patternProps = {}; // bot properties that patterns read, with the values they had

    const extractCategory = (catNode, topicPattern = "*") => {
      const patternNodes = [];
      let thatNode = null;
      let templateNode = null;

      for (const child of catNode.children || []) {
        if (child.type !== "element") continue;
        if (child.tag === "pattern") patternNodes.push(child);
        else if (child.tag === "that") thatNode = child;
        else if (child.tag === "template") templateNode = child;
      }

      if (!patternNodes.length || !templateNode) return;
      const tplSource = templateSource(templateNode);
      const requires = String(catNode.attrs.requires || "")
        .split("|")
        .map((k) => k.trim().toLowerCase())
        .filter(Boolean);
      const answerIdeas = new Set(
        normalizeAimlInput(stripSpeechTags(getPlainText(templateNode)), false)
          .split(" ")
          .map(wordFeature)
          .filter(Boolean)
          .slice(0, 60)
      );
      // A rule whose whole answer is `<srai>SOMETHING</srai>` is another wording of that rule.
      const onlyChild = (templateNode.children || []).filter((c) => c.type !== "text" || c.value.trim());
      const aliasTarget =
        onlyChild.length === 1 && onlyChild[0].tag === "srai" && (onlyChild[0].children || []).every((c) => c.type === "text")
          ? normalizeAimlInput(getPlainText(onlyChild[0]), false)
          : "";
      const thatNorm = thatNode ? normalizeAimlInput(getPlainText(thatNode), true) || "*" : "*";
      const thatTokens = thatNorm.split(" ").filter(Boolean);
      const topicNorm = normalizeAimlInput(topicPattern, true) || "*";
      const topicTokens = topicNorm.split(" ").filter(Boolean);

      for (const pNode of patternNodes) {
        // Support pipe-separated convenience patterns `HELLO | HI | HEY` as well as standard AIML
        const rawPat = this.#patternText(pNode);
        const variants = rawPat.includes("|") ? rawPat.split("|") : [rawPat];
        for (const v of variants) {
          if (v.includes(MISSING_PROP)) continue; // this wording needs a property the bot does not have
          const patNorm = normalizeAimlInput(v, true);
          if (!patNorm) continue;
          const patTokens = patNorm
            .split(" ")
            .filter(Boolean)
            .map((t) => {
              const set = SET_PLACEHOLDER_RE.exec(t);
              return set ? `<${set[1].toLowerCase()}>` : t;
            });
          const literals = patTokens
            .filter((t) => !WILDCARDS.has(t) && !isSetToken(t))
            .map((t) => (t.startsWith("$") ? t.slice(1) : t));
          const entry = {
            pattern: patTokens.join(" "),
            patTokens,
            // Sets the pattern asks for, e.g. ["color"] for `MY FAVORITE COLOR IS <set>color</set>`.
            sets: patTokens.filter(isSetToken).map((t) => t.slice(1, -1)),
            // late="true": open-ended conversation, tried only after everything else has had its turn.
            late: catNode.attrs.late === "true",
            // firm="true": answers at once, even if a rule about the site might fit more loosely.
            firm: catNode.attrs.firm === "true",
            // An answer that changes each time (a joke, a fact) can be asked for again with "another one".
            varies: /<random\b/i.test(tplSource),
            // A question about one member of a set ("capital of <set>"), with no memory to update, can
            // be continued: "and Germany?"
            continuable: thatNorm === "*" && topicNorm === "*" && (/<map\b/i.test(tplSource) || !/<think\b/i.test(tplSource)),
            that: thatNorm,
            thatTokens,
            topic: topicNorm,
            topicTokens,
            template: templateNode,
            line: catNode.line || 1,
            start: catNode.start ?? -1,
            layer,
            literals,
            literalOnly: literals.length === patTokens.length,
            // Rules that replay the previous request ("another one") must not become that request.
            replaysLastAsk: /<get name="lastask"/i.test(tplSource),
            stems: literals.map(stemWord),
            // The idea each word stands for (its synonym group, else its stem), for loose matching.
            looseKeys: literals.map((w) => wordFeature(w) || stemWord(w)),
            // `requires="hours"` / `requires="email|phone"`: only active once the bot has that fact.
            requires,
            // What the rule is about, for meaning-based matching: ideas in the pattern and in the answer.
            keywordIdeas: new Set(literals.map(wordFeature).filter(Boolean)),
            answerIdeas,
            needsStar: /<(star|sr|thatstar|topicstar)\b/i.test(tplSource),
            // Wildcards that must capture a word cannot be satisfied by the pattern's own words.
            selfMatching: !patTokens.some((t) => t === "*" || t === "_" || isSetToken(t)),
            aliasOf: aliasTarget,
            // A rule made only of wildcards, with no context, is the "I have no idea" answer.
            isCatchAll: patTokens.every((t) => WILDCARDS.has(t)) && thatNorm === "*" && topicNorm === "*",
          };
          entry.score = scoreCategory(entry);
          categories.push(entry);
        }
      }
    };

    for (const child of aimlNode.children || []) {
      if (child.type !== "element") continue;
      if (child.tag === "bot" || child.tag === "property" || child.tag === "meta") {
        const k = child.attrs.name || child.attrs.key;
        const v = child.attrs.value ?? getPlainText(child).trim();
        if (k && v) {
          if (k.toLowerCase() === "chip" || k.toLowerCase() === "suggest") {
            quickChips.push(v);
          } else {
            xmlBotProps[k.toLowerCase()] = v;
          }
        }
      } else if (child.tag === "chips" || child.tag === "suggestions") {
        for (const c of child.children || []) {
          if (c.type === "element") {
            const label = getPlainText(c).trim();
            if (label) quickChips.push(label);
          }
        }
      } else if (child.tag === "set" && child.attrs.name) {
        // A word list: <set name="drink">latte, flat white, espresso</set> (or <item> elements)
        const items = (child.children || []).filter((c) => c.type === "element").map((c) => getPlainText(c));
        const members = items.length ? items : getPlainText(child).split(/[,;\n]+/);
        sets.set(child.attrs.name.toLowerCase(), makeWordSet(members));
      } else if (child.tag === "map" && child.attrs.name) {
        // A lookup table: <entry key="latte">four dollars</entry> elements, or "latte: four dollars" lines
        const entries = new Map();
        const put = (key, value) => {
          const norm = normalizeAimlInput(key, false);
          if (norm && String(value).trim()) entries.set(norm, String(value).trim());
        };
        for (const c of child.children || []) {
          if (c.type === "element") {
            put(c.attrs.key ?? c.attrs.name ?? "", getPlainText(c));
          } else {
            for (const line of c.value.split(/\n+/)) {
              const at = line.search(/[:=]/);
              if (at > 0) put(line.slice(0, at), line.slice(at + 1));
            }
          }
        }
        maps.set(child.attrs.name.toLowerCase(), { entries, keys: makeWordSet([...entries.keys()]) });
      } else if (child.tag === "category") {
        extractCategory(child, "*");
      } else if (child.tag === "topic") {
        const topicName = child.attrs.name || "*";
        for (const sub of child.children || []) {
          if (sub.type === "element" && sub.tag === "category") {
            extractCategory(sub, topicName);
          }
        }
      }
    }

    const patternProps = this._patternProps;
    this._patternProps = null;
    return { categories, quickChips, xmlBotProps, sets, maps, patternProps };
  }

  /**
   * Merges both layers into one list, most specific first. Your rules are listed before the base
   * layer and the sort is stable, so when both score the same yours answers.
   */
  #rebuildIndex() {
    this.categories = [...this.layers.custom, ...this.layers.base].sort((a, b) => b.score - a.score);
    const vocab = new Set();
    for (const cat of this.categories) {
      for (const w of cat.literals) vocab.add(w);
      for (const w of cat.thatTokens) if (!WILDCARDS.has(w)) vocab.add(w);
    }
    // Members of word sets are known words too, so "capital of Frnace" can be put right.
    for (const layer of [this._defs.custom, this._defs.base]) {
      for (const set of [...layer.sets.values(), ...[...layer.maps.values()].map((m) => m.keys)]) {
        for (const phrase of set.phrases) for (const w of phrase.split(" ")) vocab.add(w);
      }
    }
    this.vocabulary = vocab;

    // Known words grouped by stem and by synonym group, so "fees" can stand in for a rule's "PRICING".
    const byIdea = new Map();
    for (const word of vocab) {
      const idea = wordFeature(word);
      if (!idea) continue;
      if (!byIdea.has(idea)) byIdea.set(idea, []);
      byIdea.get(idea).push(word);
    }
    this._wordsByIdea = byIdea;

    // How telling each idea is: rare ideas say more about which rule is meant than common ones.
    // Counted once per answer: a rule written with ten wordings is still one rule.
    const answersByIdea = new Map();
    const answers = new Set();
    for (const cat of this.categories) {
      if (!cat.keywordIdeas.size) continue;
      answers.add(cat.template);
      for (const idea of cat.keywordIdeas) {
        if (!answersByIdea.has(idea)) answersByIdea.set(idea, new Set());
        answersByIdea.get(idea).add(cat.template);
      }
    }
    const n = answers.size;
    this._idf = new Map([...answersByIdea].map(([idea, set]) => [idea, Math.log(1 + n / (1 + set.size))]));
    this._answerIds = new Map();
  }

  /** Loads your AIML document, replacing the previous one. The base layer is left in place. */
  loadXML(xmlString) {
    const parsed = this.#parseDocument(xmlString, "custom");
    this._sources.custom = String(xmlString || "");
    this.layers.custom = parsed.categories;
    this._defs.custom = { sets: parsed.sets, maps: parsed.maps };
    this.quickChips = parsed.quickChips;
    this.xmlBotProps = parsed.xmlBotProps;
    this.#rebuildIndex();
    return {
      valid: true,
      categories: parsed.categories.length,
      quickChips: parsed.quickChips,
      botProps: { ...parsed.xmlBotProps, ...this.botProps },
    };
  }

  /** Loads (or with an empty string, removes) the base layer that sits underneath your document. */
  loadBaseXML(xmlString) {
    const base = xmlString ? this.#parseBase(String(xmlString)) : { categories: [], sets: new Map(), maps: new Map() };
    this.layers.base = base.categories;
    this._defs.base = { sets: base.sets, maps: base.maps };
    this._sources.base = String(xmlString || "");
    this.#rebuildIndex();
    return { valid: true, categories: this.layers.base.length };
  }

  /** Checks the topic and `<that>` context of a category; returns the captured stars or null. */
  #contextStars(cat, ctx) {
    let topicStars = [];
    if (cat.topic !== "*") {
      if (ctx.activeTopic === "*") return null;
      topicStars = matchTokens(cat.topicTokens, ctx.activeTopicWords);
      if (!topicStars) return null;
    }
    let thatStars = [];
    if (cat.that !== "*") {
      if (!ctx.lastThatWords.length) return null;
      thatStars = matchTokens(cat.thatTokens, ctx.lastThatWords);
      if (!thatStars) return null;
    }
    return { topicStars, thatStars };
  }

  #matchContext() {
    const activeTopic = normalizeAimlInput(this.vars.get("topic") || "*", false) || "*";
    const lastThatNorm = normalizeAimlInput(this.lastBotThat || "", false);
    return {
      activeTopic,
      activeTopicWords: activeTopic === "*" ? ["*"] : activeTopic.split(" "),
      lastThatWords: lastThatNorm ? lastThatNorm.split(" ") : [],
    };
  }

  /**
   * The most specific rule whose pattern, topic and <that> all fit. `late` chooses the tier:
   * ordinary rules, or the open-ended ones marked late="true".
   */
  #matchWords(words, allowCatchAll, ctx = this.#matchContext(), late = false, siteOnly = false, skipContext = false, accept = null) {
    const have = new Set(words);
    for (const cat of this.categories) {
      if (cat.isCatchAll ? !allowCatchAll || late : cat.late !== late) continue;
      if (siteOnly && !isSiteRule(cat)) continue;
      if (skipContext && (cat.that !== "*" || cat.topic !== "*")) continue;
      if (accept && !accept(cat)) continue;
      // Cheap rejections first: a rule cannot match unless every one of its words was said.
      let possible = true;
      for (const lit of cat.literals) {
        if (!have.has(lit)) {
          possible = false;
          break;
        }
      }
      if (!possible) continue;
      if (cat.requires.length && !this.#hasAnyProp(cat.requires)) continue;
      const stars = this.#contextStars(cat, ctx);
      if (!stars) continue;
      const captured = matchTokens(cat.patTokens, words, 0, 0, [], this._setLookup);
      if (captured) {
        return { category: cat, stars: captured, thatStars: stars.thatStars, topicStars: stars.topicStars };
      }
    }
    return null;
  }

  /**
   * "heyyy" -> "hey", "sooo" -> "so", "cooool" -> "cool": un-stretches a word typed for emphasis.
   * Each run of three or more letters becomes one or two, whichever spells a word we know.
   */
  #unstretch(word) {
    if (!/([A-Z])\1\1/.test(word)) return word;
    const runs = word.match(/([A-Z])\1*/g) || [word];
    const stretched = runs.map((r, i) => (r.length >= 3 ? i : -1)).filter((i) => i >= 0).slice(0, 4);
    for (let mask = 0; mask < 1 << stretched.length; mask++) {
      const candidate = runs
        .map((r, i) => {
          const at = stretched.indexOf(i);
          if (at < 0) return r.length >= 3 ? r[0] : r;
          return (mask >> at) & 1 ? r[0] + r[0] : r[0];
        })
        .join("");
      if (this.vocabulary.has(candidate)) return candidate;
    }
    return runs.map((r) => (r.length >= 3 ? r[0] : r)).join("");
  }

  /** Replaces unknown words with the single closest known word, or returns null if nothing changed. */
  #correctTypos(words) {
    let changed = false;
    const fixed = words.map((word) => {
      if (word.length < 4 || this.vocabulary.has(word) || /\d/.test(word)) return word;
      // A word we recognise (by stem or as a synonym) is not a misspelling of some other word:
      // "ship" must not become "shop".
      if (SYNONYM_GROUP.has(stemWord(word)) || this._wordsByIdea.has(wordFeature(word))) return word;
      const limit = word.length >= 8 ? 2 : 1;
      let best = "";
      let bestDist = limit + 1;
      let tie = false;
      for (const known of this.vocabulary) {
        if (known[0] !== word[0] || known.length < 3) continue;
        const d = editDistance(word, known, limit);
        if (d < bestDist) {
          best = known;
          bestDist = d;
          tie = false;
        } else if (d === bestDist && d <= limit) {
          tie = true;
        }
      }
      if (best && !tie) {
        changed = true;
        return best;
      }
      return word;
    });
    return changed ? fixed : null;
  }

  /**
   * Loose match for wording the patterns did not anticipate: a wildcard-free rule answers when
   * the question contains all of its distinctive words and most of its words overall.
   */
  #looseMatch(words, ctx = this.#matchContext(), siteOnly = false, minRatio = 0.6) {
    const have = new Set(words.map((w) => wordFeature(w) || stemWord(w)));
    // What the question is about. A rule that leaves part of that out is not a close match:
    // "what time do you shut" is not "do you have the time".
    const asked = [...new Set(words.map(wordFeature).filter(Boolean))];
    // Who the sentence is about has to agree: "what is MY name" is not "what is YOUR name".
    const aboutMe = words.some((w) => FIRST_PERSON.has(w));
    const aboutYou = words.some((w) => SECOND_PERSON.has(w));
    let best = null;
    for (const cat of this.categories) {
      if (!cat.literalOnly || cat.late || cat.stems.length < 2 || words.length > cat.stems.length + 2) continue;
      // A rule made only of everyday words ("I GET IT") has nothing distinctive to be recognised by.
      if (!cat.keywordIdeas.size) continue;
      if (siteOnly && !isSiteRule(cat)) continue;
      if (cat.requires.length && !this.#hasAnyProp(cat.requires)) continue;
      if (asked.some((idea) => !cat.keywordIdeas.has(idea))) continue;
      const ruleAboutMe = cat.literals.some((w) => FIRST_PERSON.has(w));
      const ruleAboutYou = cat.literals.some((w) => SECOND_PERSON.has(w));
      if ((aboutMe && !ruleAboutMe && ruleAboutYou) || (aboutYou && !ruleAboutYou && ruleAboutMe)) continue;
      let present = 0;
      let contentTotal = 0;
      let contentHit = 0;
      for (let k = 0; k < cat.stems.length; k++) {
        const has = have.has(cat.looseKeys[k]); // "speaking" counts for a rule that says "talking"
        if (has) present++;
        if (!STOPWORDS.has(cat.stems[k])) {
          contentTotal++;
          if (has) contentHit++;
        }
      }
      if (!contentTotal || contentHit < contentTotal) continue;
      const ratio = present / cat.stems.length;
      if (ratio < minRatio) continue;
      const stars = this.#contextStars(cat, ctx);
      if (!stars) continue;
      const quality = contentHit * 10 + ratio;
      if (!best || quality > best.quality) {
        best = { quality, hit: { category: cat, stars: [], thatStars: stars.thatStars, topicStars: stars.topicStars } };
      }
    }
    return best ? best.hit : null;
  }

  /**
   * Rewrites words the rules do not use into words they do, by stem or by synonym
   * ("fees" -> "PRICING", "shipped" -> "SHIPPING"), and tries the exact matcher again.
   */
  #matchBySubstitution(words, ctx, siteOnly = false) {
    const options = words.map((word) => {
      if (this.vocabulary.has(word)) return null;
      const idea = wordFeature(word);
      const known = idea ? this._wordsByIdea.get(idea) : null;
      if (!known || !known.length) return null;
      // Same stem first (closest in meaning), then the rest of the synonym group.
      const stem = stemWord(word);
      return [...known].sort((a, b) => Number(stemWord(b) === stem) - Number(stemWord(a) === stem)).slice(0, 8);
    });
    const slots = options.map((o, i) => (o ? i : -1)).filter((i) => i >= 0);
    if (!slots.length) return null;

    const attempt = (choice) => {
      const candidate = words.map((w, i) => (options[i] ? options[i][choice[i] || 0] : w));
      return this.#matchWords(candidate, false, ctx, false, siteOnly);
    };
    // Every unknown word swapped for its best stand-in, then each alternative in turn.
    let hit = attempt({});
    for (let k = 0, tries = 0; !hit && k < slots.length && tries < 20; k++) {
      for (let alt = 1; !hit && alt < options[slots[k]].length && tries < 20; alt++, tries++) {
        hit = attempt({ [slots[k]]: alt });
      }
    }
    return hit;
  }

  /** The rule an alias (`<srai>TARGET</srai>`) finally leads to, so different wordings count as one answer. */
  #answerIdentity(cat) {
    if (!cat.aliasOf) return cat.template;
    if (!this._answerIds.has(cat.aliasOf)) {
      this._answerIds.set(cat.aliasOf, cat.template); // guards against alias loops
      const target = this.#matchWords(cat.aliasOf.split(" "), false, { activeTopic: "*", activeTopicWords: ["*"], lastThatWords: [] });
      this._answerIds.set(cat.aliasOf, target ? this.#answerIdentity(target.category) : cat.template);
    }
    return this._answerIds.get(cat.aliasOf);
  }

  /**
   * Meaning-based matching for wording no pattern anticipated. Each rule about your site is scored
   * by how much of the question it covers: ideas found in the rule's pattern count fully, ideas found
   * only in its answer count a little, and rarer ideas weigh more. A clear winner answers; otherwise
   * the closest rules are offered as "did you mean" suggestions.
   */
  #matchByMeaning(words) {
    const ideas = [...new Set(words.map(wordFeature).filter(Boolean))];
    if (!ideas.length) return { hit: null, related: [] };
    const UNKNOWN_WEIGHT = 3;
    const weights = ideas.map((idea) => this._idf.get(idea) ?? UNKNOWN_WEIGHT);
    const total = weights.reduce((a, b) => a + b, 0);

    const scored = [];
    for (const cat of this.categories) {
      // Only knowledge about the site (your rules and the facts you filled in), never small talk,
      // and only rules that can stand on their own.
      if (cat.layer !== "custom" && !cat.requires.length) continue;
      if (cat.isCatchAll || cat.that !== "*" || cat.topic !== "*" || cat.needsStar || !cat.keywordIdeas.size) continue;
      if (cat.requires.length && !this.#hasAnyProp(cat.requires)) continue;
      let score = 0;
      let keywordHits = 0;
      let hitMask = 0; // which of the question's ideas this rule's pattern covers
      ideas.forEach((idea, i) => {
        if (cat.keywordIdeas.has(idea)) {
          score += weights[i];
          keywordHits++;
          if (i < 30) hitMask |= 1 << i;
        } else if (cat.answerIdeas.has(idea)) {
          score += weights[i] * 0.35;
        }
      });
      if (!keywordHits) continue;
      // "Do you have an office?" is about the address, not the office hours: ideas a rule needs
      // that the question never mentions count against it.
      const unasked = (cat.keywordIdeas.size - keywordHits) / cat.keywordIdeas.size;
      scored.push({ cat, coverage: score / total - 0.3 * unasked, hitMask, id: this.#answerIdentity(cat) });
    }
    if (!scored.length) return { hit: null, related: [] };
    scored.sort((a, b) => b.coverage - a.coverage || b.cat.score - a.cat.score);

    // One entry per distinct answer, best wording first.
    const distinct = [];
    for (const entry of scored) if (!distinct.some((d) => d.id === entry.id)) distinct.push(entry);
    const [best, rival] = distinct;

    const related = distinct
      .filter((d) => d.coverage >= 0.3 && d.cat.selfMatching)
      .slice(0, 3)
      .map((d) => ({ label: labelFromWords(d.cat.literals), query: d.cat.literals.join(" ").toLowerCase() }));

    const asHit = (entry) => ({ category: entry.cat, stars: [], thatStars: [], topicStars: [] });
    // A question about two things, each covered by its own rule, gets both answers.
    if (rival && best.coverage >= 0.3 && rival.coverage >= 0.3 && best.coverage + rival.coverage >= 0.8 && !(best.hitMask & rival.hitMask)) {
      return { hit: asHit(best), also: asHit(rival), related };
    }
    if (best.coverage >= 0.55 && (!rival || best.coverage - rival.coverage >= 0.12)) {
      return { hit: asHit(best), related };
    }
    return { hit: null, related };
  }

  /** Drops the bot's own name when it is used to address it: "hey Aria", "thanks, Aria". */
  #stripVocative(words) {
    const nameWords = normalizeAimlInput(this.botProps.name || "", false).split(" ").filter(Boolean);
    const n = nameWords.length;
    if (!n || words.length < n) return words;
    const startsWith = nameWords.every((w, i) => words[i] === w);
    const endsWith = nameWords.every((w, i) => words[words.length - n + i] === w);
    if (words.length === n) return startsWith ? ["HELLO"] : words;
    if (startsWith) return words.slice(n);
    if (endsWith) return words.slice(0, -n);
    return words;
  }

  /**
   * Finds the rule that should answer `text`, trying progressively looser readings:
   * exact wording, then typo-corrected, then a loose keyword match, then the catch-all.
   * Returns `{ category, stars, thatStars, topicStars, kind }` or null.
   */
  resolve(text) {
    const norm = normalizeAimlInput(text, false);
    if (!norm) return null;
    // Un-stretch emphasised words, then re-apply shorthand ("nooope" -> "nope" -> "no").
    let words = this.#stripVocative(norm.split(" "))
      .map((w) => this.#unstretch(w))
      .flatMap((w) => (hasOwn(WORD_SUBSTITUTIONS, w) ? WORD_SUBSTITUTIONS[w].split(" ") : [w]));
    const ctx = this.#matchContext();

    // A match is firm when it is one of your rules, an exact phrase, or an answer to what the bot
    // just asked. A base-layer rule with a wildcard ("DO YOU LIKE *", "I AM CONFUSED #") is only a
    // guess about the rest of the sentence, and is held back while the rules about the site get
    // every chance below, however loosely they fit.
    const isFirm = (cat) => cat.layer === "custom" || cat.literalOnly || cat.firm || cat.that !== "*" || cat.topic !== "*";
    const exact = (w) => {
      let hit = this.#matchWords(w, false, ctx);
      // A follow-up rule whose wildcards swallowed something meaningful is a guess as well: after
      // "How about you?", "# WELL #" should not answer "did you sleep well?".
      let followUp = null;
      if (hit && isFollowUpGuess(hit)) {
        followUp = hit;
        hit = this.#matchWords(w, false, ctx, false, false, true);
      }
      return { hit, followUp };
    };

    // 1. The words as typed.
    let { hit, followUp } = exact(words);
    if (hit && hit.category.layer === "base" && !hit.category.firm && hit.category.that === "*" && hit.category.topic === "*") {
      // The base layer has an answer, even an exact one ("where are you located" -> a joke about
      // living in a browser tab). If one of your rules fits as well ("# LOCATED #", "WHERE ARE
      // YOU #"), it is the one that should speak. The exception is an open template made only of
      // everyday words ("WHAT IS *"): that is a net for whatever is left over, and does not
      // displace base small talk such as "what is your name".
      const yours = this.#matchWords(words, false, ctx, false, true, false, isTopicalRule);
      if (yours) return { ...yours, kind: "exact" };
    }
    if (hit && isFirm(hit.category)) return { ...hit, kind: "exact" };

    //    "So what's your favourite food then?": filler at either end rarely changes what is asked.
    const trimmed = trimFillers(words);
    if (trimmed !== words) {
      const plain = exact(trimmed);
      if (plain.hit && isFirm(plain.hit.category)) return { ...plain.hit, kind: "exact" };
      if (plain.hit) {
        words = trimmed;
        hit = plain.hit;
        followUp = plain.followUp || followUp;
      }
    }

    let soft = null;
    if (hit) {
      soft = hit;
      hit = this.#matchWords(words, false, ctx, false, true);
      if (hit) return { ...hit, kind: "exact" };
    }
    const siteOnly = Boolean(soft || followUp);

    // 2. Other forms of a word, synonyms and everyday phrases ("fees" for "pricing", "money back" for "refund").
    const phrased = collapsePhrases(words);
    hit =
      (phrased !== words ? this.#matchWords(phrased, false, ctx, false, siteOnly) : null) ||
      this.#matchBySubstitution(phrased, ctx, siteOnly);
    if (hit) return { ...hit, kind: "synonym" };
    //    "hows things" is "how is things": try the other form of is/are, do/does, has/have, was/were.
    if (words.some((w) => hasOwn(AUX_SWAPS, w))) {
      hit = this.#matchWords(words.map((w) => (hasOwn(AUX_SWAPS, w) ? AUX_SWAPS[w] : w)), false, ctx, false, siteOnly);
      if (hit) return { ...hit, kind: "synonym" };
    }

    // 3. Spelling mistakes corrected against the words the rules use, then synonyms again.
    const fixed = this.#correctTypos(phrased);
    const fixedAsTyped = phrased !== words ? this.#correctTypos(words) : null;
    for (const candidate of [fixedAsTyped, fixed]) {
      if (!candidate) continue;
      hit = this.#matchWords(candidate, false, ctx, false, siteOnly) || this.#matchBySubstitution(candidate, ctx, siteOnly);
      if (hit) return { ...hit, kind: "typo" };
    }
    const best = fixed || phrased;

    // 4. The right words in a different order, or with a few extra ones. After a spelling fix the
    //    bar is higher: "you cheated" must not become "who created you".
    hit = this.#looseMatch(best, ctx, siteOnly, fixed ? 0.75 : 0.6);
    if (hit) return { ...hit, kind: "loose" };

    // 5. Meaning: which rule about the site covers most of what was asked.
    const meaning = this.#matchByMeaning(best);
    if (meaning.hit) {
      return { ...meaning.hit, kind: "meaning", also: meaning.also ? { ...meaning.also, kind: "meaning" } : null };
    }

    // Nothing about the site fits better, so the guess from step 1 stands.
    if (soft) return { ...soft, kind: "exact" };
    if (followUp) return { ...followUp, kind: "exact" };

    // 6. "What's the capital of France?" ... "and Germany?": another member of the set the last
    //    question was about asks that question again.
    //    The member may come with a few filler words ("is there almond too?"), but not in a
    //    sentence about the visitor ("I am from France" is not a question about capitals).
    const frame = this._lastFrame;
    if (
      frame &&
      this.history.length - frame.at <= 2 &&
      words.length <= 6 &&
      !words.some((w) => FIRST_PERSON.has(w)) &&
      (!frame.category.requires.length || this.#hasAnyProp(frame.category.requires))
    ) {
      const set = this.#findSet(frame.category.sets[0]);
      const found = set && !this._resolvingEntity ? findMember(set, words) : null;
      if (found && found.rest.every((w) => FOLLOW_UP_WORDS.has(w))) {
        const stars = [...frame.stars];
        stars[frame.setIndex] = found.member;
        return { category: frame.category, stars, thatStars: [], topicStars: [], kind: "followup" };
      }
    }

    //    "What's 9 times 9?" ... "Divide that by 3": "that" or "it" stands for the last result.
    //    "And take away 20" carries on from it.
    const result = this._lastResult;
    if (result && !this._resolvingEntity && this.history.length - result.at <= 3) {
      const at = words.findIndex((w) => w === "THAT" || w === "IT");
      const carriesOn = at < 0 && CALC_CONTINUES.has(trimmed[0]);
      if (at >= 0 || carriesOn) {
        const sum = carriesOn
          ? `${result.value} ${trimmed.join(" ")}`
          : [...words.slice(0, at), String(result.value), ...words.slice(at + 1)].join(" ");
        const worked = evaluateArithmetic(sum);
        if (worked && worked.ops > 0) {
          this._resolvingEntity = true;
          try {
            const named = this.resolve(sum);
            if (named && named.kind !== "fallback") return { ...named, kind: "followup" };
          } finally {
            this._resolvingEntity = false;
          }
        }
      }
    }

    //    "My friend says the toasties are great." ... "How much are they?": a pronoun (or "there",
    //    for a place) stands for the last member of a set or map that was mentioned.
    const entity = this._lastEntity;
    if (entity && !this._resolvingEntity && this.history.length - entity.at <= 3) {
      const at = words.findIndex((w) => POINTING_WORDS.has(w));
      if (at >= 0) {
        this._resolvingEntity = true;
        try {
          const named = this.resolve([...words.slice(0, at), entity.phrase, ...words.slice(at + 1)].join(" "));
          if (named && named.kind !== "fallback" && named.kind !== "chat" && (isSiteRule(named.category) || named.category.sets.length > 0)) {
            return { ...named, kind: "followup" };
          }
        } finally {
          this._resolvingEntity = false;
        }
      }
    }

    // 7. Open-ended conversation ("I like hiking", "what do you think of jazz?"): rules marked
    //    late="true", which only speak once nothing more specific has.
    hit =
      (trimmed !== words ? this.#matchWords(trimmed, false, ctx, true) : null) ||
      this.#matchWords(words, false, ctx, true) ||
      (phrased !== words ? this.#matchWords(phrased, false, ctx, true) : null) ||
      (fixed ? this.#matchWords(fixed, false, ctx, true) : null);
    if (hit) return { ...hit, kind: "chat" };

    // 8. Nothing fits: the catch-all answers, with the nearest rules as suggestions.
    hit = this.#matchWords(words, true, ctx);
    return hit ? { ...hit, kind: "fallback", related: meaning.related } : null;
  }

  /** The best match for `inputText` using exact wording only (kept for existing callers). */
  findMatch(inputText) {
    const norm = normalizeAimlInput(inputText, false);
    if (!norm) return null;
    return this.#matchWords(norm.split(" "), true);
  }

  /** Predicates the engine keeps up to date so templates can react to the moment. */
  #refreshAutoPredicates(rawInput = "", now = new Date()) {
    const h = now.getHours();
    // "request", "question" or "statement": lets the catch-all answer each in its own way.
    this.vars.set("inputkind", classifyInput(rawInput));
    // "yes" when the previous answer was a joke, a fact or the like: something to have more of.
    this.vars.set("justvaried", this._justVaried ? "yes" : "");
    // "positive", "negative" or "neutral": how a remark sounds.
    this.vars.set("mood", moodOf(normalizeAimlInput(rawInput, false).split(" ")));
    this.vars.set("daypart", h >= 5 && h < 12 ? "morning" : h >= 12 && h < 17 ? "afternoon" : "evening");
    this.vars.set("dayname", now.toLocaleDateString("en-US", { weekday: "long" }));
    this.vars.set("fallbackstreak", String(this.fallbackStreak));
    this.vars.set("suggestions", this.quickChips.length ? "yes" : "");
    // Bot properties are readable in conditions as bot_<name>, e.g. <condition name="bot_email">.
    for (const [key, value] of Object.entries({ ...this.xmlBotProps, ...this.botProps })) {
      this.vars.set(`bot_${key}`, String(value || this.xmlBotProps?.[key] || "").trim());
    }
  }

  reply(userInput) {
    const rawInput = String(userInput || "").trim();
    if (!rawInput) {
      return {
        speechText: "",
        displayText: "",
        chips: this.quickChips.slice(0, 4),
        emote: null,
        cues: [],
        cueWords: 0,
        matchedPattern: null,
        matchedLayer: null,
        matchKind: "none",
      };
    }

    // 1. Decide which rule answers each sentence before running any template, so a sentence
    //    that only reaches the catch-all cannot crowd out one that was understood.
    const plans = [];
    const addPlan = (text, hit) => {
      if (hit && hit.kind !== "fallback" && !plans.some((p) => p.hit.category === hit.category)) {
        plans.push({ text, hit });
        return true;
      }
      return false;
    };
    for (const sentence of splitInputSentences(rawInput)) {
      // "What are your hours and where are you?" is two questions when each half finds its own rule.
      const halves = sentence.split(/\s+(?:and|&|plus|also|but)\s+/i);
      if (halves.length === 2) {
        const [a, b] = halves.map((part) => this.resolve(part));
        const specific = (h) => h && h.kind !== "fallback" && !h.category.isCatchAll;
        if (specific(a) && specific(b) && this.#answerIdentity(a.category) !== this.#answerIdentity(b.category)) {
          addPlan(halves[0], a);
          addPlan(halves[1], b);
          continue;
        }
      }
      const hit = this.resolve(sentence);
      addPlan(sentence, hit);
      if (hit && hit.also) addPlan(sentence, hit.also);
    }
    let isFallback = false;
    let related = [];
    if (!plans.length) {
      const whole = this.resolve(rawInput);
      if (whole) plans.push({ text: rawInput, hit: whole });
      isFallback = !whole || whole.kind === "fallback";
      related = (whole && whole.related) || [];
    }
    this.vars.set("didyoumean", related.length ? "yes" : "");

    const streakBefore = this.fallbackStreak;
    this.fallbackStreak = isFallback ? this.fallbackStreak + 1 : 0;
    this.#refreshAutoPredicates(rawInput);

    // 2. Run the chosen templates.
    const sideEffects = { chips: [], emote: null, streakBefore };
    const parts = [];
    for (const plan of plans.slice(0, 3)) {
      const text = this.#evalHit(plan.hit, plan.text, 0, sideEffects).replace(/\s+/g, " ").trim();
      if (text) parts.push(text);
    }
    // Prefer the rule a reduction ended up at ("TELL ME *" -> "# PRICING #") when reporting the match.
    const first = (plans.length === 1 && plans[0].hit.kind !== "fallback" && sideEffects.answeredBy) || plans[0]?.hit || null;
    // A rule can decide it does not apply after all (<fallback/>), and a reduction such as
    // "PLEASE *" can end at the catch-all; both count as not understood.
    if ((first && first.kind === "fallback") || sideEffects.fellBack) isFallback = true;
    if (sideEffects.related && sideEffects.related.length) related = sideEffects.related;

    const speechRaw =
      parts.join(" ") ||
      `I'm not sure about that yet, but I'm happy to help with questions about ${this.botProps.company || "our site"}!`;

    // "Speak slower", "whisper from now on": a style the visitor asked for is put in front of every
    // reply until they ask for the normal voice again. It changes the voice, never the text.
    const style = String(this.vars.get("voicestyle") || "").trim().toLowerCase();
    const parsed = parseSpeechCues(style && VOICE_TAG_WORDS.has(style) ? `[${style}] ${speechRaw}` : speechRaw);
    const displayText = stripSpeechTags(speechRaw);
    const sentences = splitSentences(displayText);
    this.lastBotThat = sentences[sentences.length - 1] || displayText;
    this.history.push({ user: rawInput, bot: displayText });
    if (this.history.length > 50) this.history.shift();
    // "Another one" repeats the last thing that was asked for. An answer to the bot's own question
    // ("a clock?" during a riddle) is not something to ask for again.
    // Only something that comes out differently each time (a joke, a fact, a riddle) is worth
    // asking for again; repeating the opening hours word for word is not.
    if (!isFallback && first && first.category.varies && !plans.some((p) => p.hit.category.replaysLastAsk || p.hit.category.that !== "*")) {
      this.vars.set("lastask", rawInput);
    }
    // Remember the last menu item, product or the like (a member of one of your own sets or maps)
    // that was mentioned, so "how much is it?" can refer back to it.
    const said = normalizeAimlInput(rawInput, false).split(" ");
    // Keys of the base layer's lookup tables first (a country, an animal), then your own sets and
    // maps, so that yours win when both are named.
    const nameable = [
      ...[...this._defs.base.maps.values()].map((m) => m.keys),
      ...this._defs.custom.sets.values(),
      ...[...this._defs.custom.maps.values()].map((m) => m.keys),
    ];
    for (const set of nameable) {
      const found = findMember(set, said);
      if (found) this._lastEntity = { phrase: found.member, at: this.history.length };
    }
    // The last number worked out, so "divide that by 3" has something to divide.
    if (sideEffects.calcValue !== undefined) this._lastResult = { value: sideEffects.calcValue, at: this.history.length };
    // Whether this answer was one that varies; "go on" right after a joke means "another joke".
    this._justVaried = Boolean(!isFallback && first && first.category.varies);
    // Remember a question about one member of a set, so "and Germany?" can continue it.
    if (!isFallback && first && first.category.continuable && first.category.sets.length === 1 && first.stars) {
      const slots = first.category.patTokens.filter((t) => WILDCARDS.has(t) || isSetToken(t));
      this._lastFrame = { category: first.category, stars: first.stars, setIndex: slots.findIndex(isSetToken), at: this.history.length };
    }

    // When the bot did not understand, offer the default suggestions as a way forward.
    const seenChips = new Set();
    const uniqueChips = sideEffects.chips.filter((c) => !seenChips.has(c.label) && seenChips.add(c.label)).slice(0, 5);
    // When the bot did not understand: the nearest rules first ("did you mean"), then whatever the
    // catch-all offered, then the default suggestions.
    let chips = uniqueChips;
    if (isFallback) {
      const fallbackChips = uniqueChips.length ? uniqueChips : this.quickChips.map((c) => ({ label: c, query: c }));
      const taken = new Set(related.map((c) => c.label.toLowerCase()));
      chips = [...related, ...fallbackChips.filter((c) => !taken.has(c.label.toLowerCase()))].slice(0, 4);
    }

    const firstAction = parsed.cues.find((c) => c.type === "action");
    return {
      speechText: parsed.speechText,
      displayText,
      chips,
      emote: firstAction ? firstAction.name : null,
      cues: parsed.cues,
      cueWords: parsed.wordCount,
      matchedPattern: first ? first.category.pattern : null,
      matchedLayer: first ? first.category.layer : null,
      matchKind: sideEffects.fellBack ? "fallback" : first ? first.kind : "none",
    };
  }

  #evalHit(hit, inputText, depth, sideEffects) {
    const ctx = {
      input: inputText,
      stars: hit.stars,
      thatStars: hit.thatStars,
      topicStars: hit.topicStars,
      depth,
      sideEffects,
    };
    return this.#evalChildren(hit.category.template.children, ctx);
  }

  #respondInternal(inputText, depth, sideEffects) {
    if (depth > 22) return "";
    const hit = this.resolve(inputText);
    if (!hit) return "";
    sideEffects.answeredBy = hit; // the innermost <srai> target is the rule that really answers
    if (hit.kind === "fallback" && !sideEffects.fellBack) {
      // The reduction led nowhere: count the miss before the catch-all reads the streak.
      sideEffects.fellBack = true;
      this.fallbackStreak = (sideEffects.streakBefore || 0) + 1;
      this.vars.set("fallbackstreak", String(this.fallbackStreak));
      sideEffects.related = hit.related || [];
      this.vars.set("didyoumean", sideEffects.related.length ? "yes" : "");
    }
    return this.#evalHit(hit, inputText, depth, sideEffects);
  }

  #evalChildren(nodes, ctx) {
    let out = "";
    for (const node of nodes || []) {
      out += this.#evalNode(node, ctx);
    }
    return out;
  }

  #evalNode(node, ctx) {
    if (!node) return "";
    if (node.type === "text") return node.value;

    const tag = node.tag;
    const attrs = node.attrs || {};

    switch (tag) {
      case "star": {
        const idx = Math.max(1, parseInt(attrs.index || "1", 10)) - 1;
        return (ctx.stars[idx] || "").toLowerCase().replace(/(\d) point (?=\d)/g, "$1.");
      }
      case "thatstar": {
        const idx = Math.max(1, parseInt(attrs.index || "1", 10)) - 1;
        return (ctx.thatStars[idx] || "").toLowerCase();
      }
      case "topicstar": {
        const idx = Math.max(1, parseInt(attrs.index || "1", 10)) - 1;
        return (ctx.topicStars[idx] || "").toLowerCase();
      }
      case "bot": {
        const key = (attrs.name || "").toLowerCase();
        return this.botProps[key] ?? this.xmlBotProps?.[key] ?? "";
      }
      case "get": {
        // The name may be worked out: <get><name>favorite <star/></name></get>
        const key = normalizePredicateName(this.#attr(node, "name", ctx));
        const val = this.vars.get(key);
        return val !== undefined && val !== "" ? val : (attrs.default ?? "");
      }
      case "set": {
        const key = normalizePredicateName(this.#attr(node, "name", ctx));
        const val = this.#evalChildren(this.#body(node, ["name"]), ctx).trim();
        if (key) this.vars.set(key, val);
        return val;
      }
      case "map": {
        // <map name="capital"><star/></map>: looks a key up in a table defined with <map name="...">
        const map = this.#findMap(String(this.#attr(node, "name", ctx) || "").toLowerCase());
        if (!map) return attrs.default ?? "";
        const key = normalizeAimlInput(this.#evalChildren(this.#body(node, ["name"]), ctx), false);
        const single = singularForms(key).find((k) => map.entries.has(k));
        return map.entries.get(key) ?? (single ? map.entries.get(single) : undefined) ?? (attrs.default ?? "");
      }
      case "calc": {
        // <calc>12 times <star/></calc>: arithmetic. "undefined" for a division by zero, "" if it is not a sum.
        const result = evaluateArithmetic(this.#evalChildren(node.children, ctx));
        if (!result) return attrs.default ?? "";
        if (result.divideByZero) return "undefined";
        if (typeof result.value === "boolean") return String(result.value);
        const shown = formatNumber(result.value, attrs.round);
        ctx.sideEffects.calcValue = shown;
        return shown;
      }
      case "count": {
        // <count>five</count> -> "1, 2, 3, 4, 5" (at most 30); down="true" counts backwards
        const num = readNumber(calcTokens(this.#evalChildren(node.children, ctx)), 0);
        if (!num) return "";
        const seq = Array.from({ length: Math.max(1, Math.min(30, Math.round(num.value))) }, (_v, k) => k + 1);
        if (attrs.down === "true") seq.reverse();
        return seq.join(", ");
      }
      case "explode": {
        // <explode>cat</explode> -> "c a t"; sep=", " puts something else between the letters
        return [...this.#evalChildren(node.children, ctx).replace(/\s+/g, "")].join(attrs.sep ?? " ");
      }
      case "daysuntil": {
        // <daysuntil date="12-25"/> (month-day) or <daysuntil weekday="saturday"/>; 0 means today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (attrs.weekday) {
          const target = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].indexOf(attrs.weekday.toLowerCase());
          return target < 0 ? "" : String((target - today.getDay() + 7) % 7);
        }
        const md = /^(\d{1,2})-(\d{1,2})$/.exec((attrs.date || this.#evalChildren(node.children, ctx)).trim());
        if (!md) return "";
        const next = new Date(today.getFullYear(), Number(md[1]) - 1, Number(md[2]));
        if (next < today) next.setFullYear(today.getFullYear() + 1);
        return String(Math.round((next - today) / 86400000));
      }
      case "fallback": {
        // "This rule does not apply after all": answer as though nothing had matched.
        if (ctx.depth > 20) return "";
        const fx = ctx.sideEffects;
        if (!fx.fellBack) {
          fx.fellBack = true;
          this.fallbackStreak = (fx.streakBefore || 0) + 1;
          this.vars.set("fallbackstreak", String(this.fallbackStreak));
        }
        const catchAll = this.categories.find((c) => c.isCatchAll);
        if (!catchAll) return "";
        const hit = { category: catchAll, stars: [normalizeAimlInput(ctx.input, false)], thatStars: [], topicStars: [] };
        return this.#evalHit(hit, ctx.input, ctx.depth + 1, fx);
      }
      case "think": {
        this.#evalChildren(node.children, ctx);
        return "";
      }
      case "srai": {
        const target = this.#evalChildren(node.children, ctx).trim();
        return target ? this.#respondInternal(target, ctx.depth + 1, ctx.sideEffects) : "";
      }
      case "try": {
        // <try>COUNT TO 5</try>: the answer some rule gives to that, or nothing at all if only the
        // catch-all would answer. Lets "CAN YOU *" do the thing when it can.
        const target = this.#evalChildren(node.children, ctx).trim();
        if (!target || ctx.depth > 20) return "";
        const hit = this.resolve(target);
        if (!hit || hit.kind === "fallback") return "";
        ctx.sideEffects.answeredBy = hit;
        return this.#evalHit(hit, target, ctx.depth + 1, ctx.sideEffects);
      }
      case "sr": {
        const firstStar = ctx.stars[0] || "";
        return firstStar ? this.#respondInternal(firstStar, ctx.depth + 1, ctx.sideEffects) : "";
      }
      case "random": {
        const items = (node.children || []).filter((c) => c.type === "element" && c.tag === "li");
        if (!items.length) return "";
        // Every alternative gets its turn before any is repeated, and never the same one twice running.
        let bag = this._randomMemory.get(node);
        if (!bag || !bag.left.length) {
          const order = items.map((_v, k) => k);
          for (let k = order.length - 1; k > 0; k--) {
            const j = Math.floor(Math.random() * (k + 1));
            [order[k], order[j]] = [order[j], order[k]];
          }
          if (bag && order.length > 1 && order[0] === bag.last) order.push(order.shift());
          bag = { left: order, last: bag ? bag.last : -1 };
          this._randomMemory.set(node, bag);
        }
        const idx = bag.left.shift();
        bag.last = idx;
        return this.#evalChildren(items[idx].children, ctx).trim();
      }
      case "condition": {
        const varName = normalizePredicateName(attrs.name);
        const curVal = (this.vars.get(varName) || "").trim().toLowerCase();
        // value="*" means "has any value", as in AIML 2.0.
        const matches = (actual, wanted) => (wanted.trim() === "*" ? actual !== "" : actual === wanted.trim().toLowerCase());
        if (attrs.value !== undefined) {
          return matches(curVal, attrs.value) ? this.#evalChildren(node.children, ctx) : "";
        }
        const branches = (node.children || []).filter((c) => c.type === "element" && c.tag === "li");
        for (const li of branches) {
          const checkName = li.attrs.name !== undefined ? normalizePredicateName(li.attrs.name) : varName;
          const actual = (this.vars.get(checkName) || "").trim().toLowerCase();
          // The value to compare with may be worked out: <li><value><get name="answer"/></value>...</li>
          const wanted = this.#attr(li, "value", ctx);
          if (wanted === undefined || matches(actual, wanted)) {
            return this.#evalChildren(this.#body(li, ["value"]), ctx);
          }
        }
        return "";
      }
      case "uppercase":
        return this.#evalChildren(node.children, ctx).toUpperCase();
      case "lowercase":
        return this.#evalChildren(node.children, ctx).toLowerCase();
      case "formal":
        return this.#evalChildren(node.children, ctx).replace(/\b\w/g, (c) => c.toUpperCase());
      case "sentence": {
        const s = this.#evalChildren(node.children, ctx).trim();
        return s ? s[0].toUpperCase() + s.slice(1) : "";
      }
      case "person":
      case "person2":
        return swapPerson(this.#evalChildren(node.children, ctx));
      case "date": {
        const now = new Date();
        // offset="1" is tomorrow, offset="-1" yesterday
        if (attrs.offset) now.setDate(now.getDate() + (parseInt(attrs.offset, 10) || 0));
        if (!attrs.format) {
          return now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
        }
        // A small strftime subset: %A weekday, %B month, %d day, %Y year, %H / %I hour, %M minute, %p am/pm
        const pad = (v) => String(v).padStart(2, "0");
        const parts = {
          A: now.toLocaleDateString("en-US", { weekday: "long" }),
          B: now.toLocaleDateString("en-US", { month: "long" }),
          d: String(now.getDate()),
          Y: String(now.getFullYear()),
          H: pad(now.getHours()),
          I: String(now.getHours() % 12 || 12),
          M: pad(now.getMinutes()),
          p: now.getHours() < 12 ? "AM" : "PM",
        };
        return attrs.format.replace(/%([ABdYHIMp])/g, (_m, key) => parts[key]);
      }
      case "time":
        return new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
      case "size":
        return String(this.categories.length);
      case "version":
        return "bot.computer AIML 2.0";
      case "input":
        return ctx.input;
      case "that":
        return this.lastBotThat;
      case "request": {
        // What the visitor said n turns ago (1 = their previous message).
        const n = Math.max(1, parseInt(attrs.index || "1", 10));
        return this.history[this.history.length - n]?.user ?? (attrs.default ?? "");
      }
      case "response": {
        // What the bot said n turns ago (1 = its previous reply).
        const n = Math.max(1, parseInt(attrs.index || "1", 10));
        return this.history[this.history.length - n]?.bot ?? (attrs.default ?? "");
      }
      case "br":
        return "\n";
      case "emote":
      case "gesture": {
        // Becomes an inline action tag at this point in the reply, so it fires when speech gets here.
        const g = this.#evalChildren(node.children, ctx).trim().toLowerCase();
        const action = g === "happy" ? "smile" : resolveActionTag(g);
        return action ? ` [${action}] ` : "";
      }
      case "reply":
      case "button":
      case "chip":
      case "suggest": {
        let text = "";
        let postback = "";
        const textEl = (node.children || []).find((c) => c.type === "element" && c.tag === "text");
        const postEl = (node.children || []).find((c) => c.type === "element" && c.tag === "postback");
        if (textEl) {
          text = this.#evalChildren(textEl.children, ctx).trim();
          postback = postEl ? this.#evalChildren(postEl.children, ctx).trim() : text;
        } else {
          text = this.#evalChildren(node.children, ctx).trim();
          postback = attrs.postback || text;
        }
        if (text) ctx.sideEffects.chips.push({ label: text, query: postback });
        return "";
      }
      case "oob":
      case "chips": {
        this.#evalChildren(node.children, ctx);
        return "";
      }
      default:
        return this.#evalChildren(node.children, ctx);
    }
  }
}

/**
 * Facts a bot can simply be given, with no rules to write. The base layer answers questions about
 * each one that is filled in ("when are you open?", "how do I contact you?").
 */
export const BOT_FACTS = [
  { key: "about", label: "What you do", placeholder: "We roast coffee by hand and deliver it across the country.", long: true },
  { key: "hours", label: "Opening hours", placeholder: "Monday to Friday, 9am to 5pm" },
  { key: "email", label: "Email", placeholder: "hello@example.com" },
  { key: "phone", label: "Phone", placeholder: "+61 400 123 456" },
  { key: "address", label: "Address", placeholder: "12 King Street, Sydney" },
  { key: "pricing", label: "Pricing", placeholder: "Plans start at nine dollars a month, with a free trial.", long: true },
];

/**
 * Validates AIML XML and returns what the Studio shows: one entry per `<category>` (with every
 * wording of its pattern), the suggestion chips, and anything the rule checker noticed.
 * Pass `options.baseXml` so links into the base layer are not reported as broken.
 */
export function inspectAimlXml(xmlString, botProps = {}, options = {}) {
  try {
    const engine = new AIMLEngine({ botProps, baseXml: options.baseXml || "" });
    const res = engine.loadXML(xmlString);
    const byTemplate = new Map();
    for (const c of engine.layers.custom) {
      let rule = byTemplate.get(c.template);
      if (!rule) {
        rule = {
          patterns: [],
          pattern: "",
          that: c.that,
          topic: c.topic,
          preview: engine.previewTemplate(c.template, engine.sampleStars(c)).slice(0, 140),
          line: c.line,
          start: c.start,
          isCatchAll: c.isCatchAll,
          aliasOf: c.aliasOf, // set when the whole answer is <srai>ANOTHER RULE</srai>
          late: c.late,
          sample: engine.samplePhrase(c), // something a visitor could type to reach this rule
        };
        byTemplate.set(c.template, rule);
      }
      rule.patterns.push(c.pattern);
    }
    const rules = [...byTemplate.values()];
    for (const rule of rules) rule.pattern = rule.patterns.join(" | ");
    return {
      valid: true,
      categories: rules.length,
      patterns: res.categories,
      quickChips: res.quickChips,
      rules,
      warnings: engine.lint(),
      engine, // ready to chat with: these rules (over the base layer, if one was given)
    };
  } catch (err) {
    return {
      valid: false,
      error: err.message || String(err),
      categories: 0,
      patterns: 0,
      quickChips: [],
      rules: [],
      warnings: [],
    };
  }
}

/**
 * Removes one `<category>` from an AIML document. `start` is the rule's position in the source,
 * as reported by `inspectAimlXml(...).rules[n].start`. Returns the document unchanged if not found.
 */
export function removeAimlRule(xmlString, start) {
  const src = String(xmlString || "");
  let doc;
  try {
    doc = parseXmlDocument(src);
  } catch {
    return src;
  }
  let target = null;
  const walk = (node) => {
    for (const child of node.children || []) {
      if (child.type !== "element") continue;
      if (child.tag === "category" && child.start === start) target = child;
      else if (child.tag === "aiml" || child.tag === "topic") walk(child);
    }
  };
  walk(doc);
  if (!target || target.end <= target.start) return src;
  // Take the rule's indentation and the line break after it, so no gap is left behind.
  let a = target.start;
  while (a > 0 && (src[a - 1] === " " || src[a - 1] === "\t")) a--;
  let b = target.end;
  while (b < src.length && (src[b] === " " || src[b] === "\t")) b++;
  if (src[b] === "\r") b++;
  if (src[b] === "\n") b++;
  return (src.slice(0, a) + src.slice(b)).replace(/\n{3,}/g, "\n\n");
}

/** Appends a new `<category>` rule cleanly before `</aiml>` in an AIML XML document. */
export function appendAimlRule(xmlString, { pattern, answer, chips = [], emote = "" }) {
  // Normalize each `|`-separated alternative on its own; normalizing the whole string would strip the
  // pipes and merge every alias into one long pattern that never matches.
  const cleanPattern =
    String(pattern || "")
      .split("|")
      .map((alt) => normalizeAimlInput(alt, true))
      .filter(Boolean)
      .join(" | ") || "HELLO";
  const chipXml = chips
    .map((c) => c.trim())
    .filter(Boolean)
    .map((c) => `<reply>${escapeXml(c)}</reply>`)
    .join("");
  const action = emote ? resolveActionTag(emote === "happy" ? "smile" : emote) : "";
  const actionTag = action ? `[${action}] ` : "";
  const block = [
    `  <category>`,
    `    <pattern>${escapeXml(cleanPattern)}</pattern>`,
    `    <template>${actionTag}${escapeXml(answer.trim())}${chipXml}</template>`,
    `  </category>`,
  ].join("\n");

  const src = String(xmlString || "").trim();
  const closeIdx = src.toLowerCase().lastIndexOf("</aiml>");
  if (closeIdx >= 0) {
    return `${src.slice(0, closeIdx).trimEnd()}\n\n${block}\n</aiml>\n`;
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<aiml version="2.0">\n${block}\n</aiml>\n`;
}

// ============================================================================
// Built-in Starter AIML 2.0 XML Knowledge Packs
// (greeting variants, thanks, goodbyes and other small talk come from BASE_AIML_XML below)
// ============================================================================

export const STARTER_AIML_PACKS = {
  concierge: {
    id: "concierge",
    label: "SaaS & Website Concierge",
    description: "Greets visitors, answers pricing/features/support Q&A, remembers names, and books demos.",
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<aiml version="2.0">
  <!-- Default quick-ask chips shown in the companion chat bar -->
  <chips>
    <chip>What can you do?</chip>
    <chip>Pricing &amp; Plans</chip>
    <chip>How does lip-sync work?</chip>
    <chip>Sing me a song!</chip>
  </chips>

  <category>
    <pattern>HELLO</pattern>
    <template>
      <emote>wave</emote>
      <random>
        <li>[cheerful] Hi there! I'm <bot name="name"/>, your <bot name="role"/> at <bot name="company"/>. Ask me anything!</li>
        <li>[happy] Welcome! I'm <bot name="name"/>. How can I help guide you around <bot name="company"/> today?</li>
        <li>Hey! Great to meet you. I'm <bot name="name"/> — feel free to ask about features, pricing, or embedding!</li>
      </random>
      <reply>What can you do?</reply>
      <reply>Pricing &amp; Plans</reply>
      <reply>Self-contained embed</reply>
    </template>
  </category>


  <category>
    <pattern>WHO ARE YOU</pattern>
    <template>
      I'm <bot name="name"/>, an interactive speaking companion powered by WebAssembly vocal-tract physics and an AIML XML brain. Everything runs 100% locally in your browser!
      <reply>How does lip-sync work?</reply>
      <reply>Self-contained embed</reply>
    </template>
  </category>
  <category><pattern>WHAT IS YOUR NAME</pattern><template><srai>WHO ARE YOU</srai></template></category>

  <category>
    <pattern># WHAT CAN YOU DO #</pattern>
    <template>
      <emote>happy</emote>
      I greet visitors out loud, [wave] laugh at my own jokes, [chuckle] track your cursor across the page, answer questions instantly via AIML pattern matching, and embed onto any website as a single self-contained JavaScript file! [thumbsup]
      <reply>Pricing &amp; Plans</reply>
      <reply>Self-contained embed</reply>
      <reply>Sing me a song!</reply>
    </template>
  </category>
  <category><pattern># FEATURES #</pattern><template><srai>WHAT CAN YOU DO</srai></template></category>

  <category>
    <pattern># PRICING #</pattern>
    <template>
      [calm] Because <bot name="company"/> runs directly in the visitor's browser with WebAssembly synthesis, there are zero per-minute voice API bills! [wink] You can self-host your companion completely free.
      <reply>Self-contained embed</reply>
      <reply>Book a demo</reply>
    </template>
  </category>
  <category><pattern># PRICE #</pattern><template><srai>PRICING</srai></template></category>
  <category><pattern># COST #</pattern><template><srai>PRICING</srai></template></category>
  <category><pattern># PLANS #</pattern><template><srai>PRICING</srai></template></category>

  <category>
    <pattern># LIP SYNC #</pattern>
    <template>
      My voice comes from a physical model of the human larynx and vocal tract in Rust and WebAssembly. [nod] Every 5 milliseconds it outputs exact jaw, tongue, and lip positions at 200 frames per second! [surprised]
      <reply>Self-contained embed</reply>
      <reply>Sing me a song!</reply>
    </template>
  </category>
  <category><pattern># LIPSYNC #</pattern><template><srai>LIP SYNC</srai></template></category>
  <category><pattern>HOW DOES * WORK</pattern><template><srai>LIP SYNC</srai></template></category>

  <category>
    <pattern># EMBED #</pattern>
    <template>
      <emote>nod</emote>
      Open the Embed tab in the studio to copy a 1-line script tag or download a 100% self-contained JS bundle with my avatar, AIML XML brain, and WebAssembly voice baked right inside!
      <reply>Pricing &amp; Plans</reply>
      <reply>What can you do?</reply>
    </template>
  </category>
  <category><pattern># SELF CONTAINED #</pattern><template><srai>EMBED</srai></template></category>
  <category><pattern># DOWNLOAD #</pattern><template><srai>EMBED</srai></template></category>

  <category>
    <pattern>MY NAME IS *</pattern>
    <template>
      <think><set name="username"><formal><star/></formal></set></think>
      <emote>happy</emote>
      [cheerful] Wonderful to meet you, <get name="username"/>! Would you like a quick tour of what I can do?
      <reply>Yes please</reply>
      <reply>Pricing &amp; Plans</reply>
    </template>
  </category>
  <category><pattern>CALL ME *</pattern><template><srai>MY NAME IS <star/></srai></template></category>

  <category>
    <pattern>YES #</pattern>
    <that>* QUICK TOUR OF WHAT I CAN DO</that>
    <template>
      <srai>WHAT CAN YOU DO</srai>
    </template>
  </category>

  <category>
    <pattern>WHAT IS MY NAME</pattern>
    <template>
      <condition name="username">
        <li value="">You haven't told me your name yet! Just say "My name is..." and I'll remember it.</li>
        <li>Your name is <get name="username"/>, of course!</li>
      </condition>
    </template>
  </category>

  <category>
    <pattern># DEMO #</pattern>
    <template>
      <emote>wave</emote>
      You're experiencing the live demo right now! Try sculpting my shoulders and face in the Designer, or edit my XML brain in the Chat tab.
    </template>
  </category>

  <category>
    <pattern># SING #</pattern>
    <template>
      <emote>happy</emote>
      [cheerful] Clearing my vocal folds! [ahem] [sing bpm=112] C4:1=Wel- E4:1=come G4:1.5=to E4:0.5=the | F4:1=fu- A4:1=ture G4:2=web! [/sing] [happy] How was my pitch?
      <reply>That was awesome!</reply>
      <reply>Tell me a joke</reply>
    </template>
  </category>

  <category>
    <pattern># JOKE #</pattern>
    <template>
      <emote>wink</emote>
      [cheerful] Why did the WebAssembly avatar never lose its voice? [pause=280ms] Because its vocal folds are compiled in release mode! [laugh]
      <reply>Sing me a song!</reply>
      <reply>What can you do?</reply>
    </template>
  </category>

  <category>
    <pattern># THANK #</pattern>
    <template>
      <emote>happy</emote>
      [warmth=0.8] You're very welcome<condition name="username"><li value="">!</li><li>, <get name="username"/>!</li></condition> Let me know if you need anything else.
    </template>
  </category>
  <category><pattern>THANKS #</pattern><template><srai>THANK</srai></template></category>
  <category><pattern># AWESOME #</pattern><template><emote>happy</emote>[aww] [excited] Thank you so much! Having physical vocal folds makes all the difference!</template></category>

  <category>
    <pattern>*</pattern>
    <template>
      <emote>think</emote>
      <random>
        <li>That's a great question about "<star/>"! Try asking me about features, pricing, lip-sync, or how to embed me on your site.</li>
        <li>Hmm, I don't have a specific pattern for "<star/>" in my AIML XML yet — you can add one in seconds in the Chat tab!</li>
      </random>
      <reply>What can you do?</reply>
      <reply>Pricing &amp; Plans</reply>
      <reply>Self-contained embed</reply>
    </template>
  </category>
</aiml>`,
  },

  ecommerce: {
    id: "ecommerce",
    label: "Online Store Assistant",
    description: "Answers shipping, returns, sizing, promo codes, and product recommendation questions.",
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<aiml version="2.0">
  <chips>
    <chip>Shipping times</chip>
    <chip>Return policy</chip>
    <chip>Any discount codes?</chip>
    <chip>Sizing help</chip>
  </chips>

  <category>
    <pattern>HELLO</pattern>
    <template>
      <emote>wave</emote>
      [cheerful] Welcome to <bot name="company"/>! I'm <bot name="name"/>, your personal shopping guide. Looking for shipping info, sizing, or today's discount?
      <reply>Shipping times</reply>
      <reply>Return policy</reply>
      <reply>Any discount codes?</reply>
    </template>
  </category>

  <category>
    <pattern># SHIPPING #</pattern>
    <template>
      Orders ship within 24 hours! [thumbsup] Standard delivery takes 3 to 5 business days, and orders over $50 ship completely free.
      <reply>Return policy</reply>
      <reply>Any discount codes?</reply>
    </template>
  </category>
  <category><pattern># DELIVERY #</pattern><template><srai>SHIPPING</srai></template></category>

  <category>
    <pattern># RETURN #</pattern>
    <template>
      We offer hassle-free 30-day returns and free exchanges on every unworn item. Just enter your order number on our returns portal!
      <reply>Shipping times</reply>
      <reply>Sizing help</reply>
    </template>
  </category>
  <category><pattern># REFUND #</pattern><template><srai>RETURN</srai></template></category>

  <category>
    <pattern># DISCOUNT #</pattern>
    <template>
      <emote>wink</emote>
      [whisper, softer] Secret tip... [reset, cheerful] Use code WELCOME15 at checkout for 15 percent off your first order today!
      <reply>Shipping times</reply>
      <reply>Return policy</reply>
    </template>
  </category>
  <category><pattern># COUPON #</pattern><template><srai>DISCOUNT</srai></template></category>
  <category><pattern># PROMO #</pattern><template><srai>DISCOUNT</srai></template></category>

  <category>
    <pattern># SIZING #</pattern>
    <template>
      Our pieces run true to size! If you prefer a relaxed studio fit, we recommend sizing up one step.
      <reply>Return policy</reply>
    </template>
  </category>
  <category><pattern># SIZE #</pattern><template><srai>SIZING</srai></template></category>

  <category>
    <pattern>*</pattern>
    <template>
      I can help you with shipping times, our 30-day return policy, sizing advice, or discount codes! Which one can I check for you?
      <reply>Shipping times</reply>
      <reply>Return policy</reply>
      <reply>Any discount codes?</reply>
    </template>
  </category>
</aiml>`,
  },

  portfolio: {
    id: "portfolio",
    label: "Portfolio & Agency Guide",
    description: "Introduces a creator or studio, skills, featured work, and availability for projects.",
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<aiml version="2.0">
  <chips>
    <chip>About our studio</chip>
    <chip>Tech stack &amp; skills</chip>
    <chip>Are you available?</chip>
    <chip>How to contact</chip>
  </chips>

  <category>
    <pattern>HELLO</pattern>
    <template>
      <emote>wave</emote>
      Hey! I'm <bot name="name"/>, digital host for <bot name="company"/>. Ask me about our work, tech stack, or project availability!
      <reply>About our studio</reply>
      <reply>Tech stack &amp; skills</reply>
      <reply>Are you available?</reply>
    </template>
  </category>

  <category>
    <pattern># ABOUT #</pattern>
    <template>
      We craft fast, tactile software, WebAssembly engines, and interactive web experiences with zero unnecessary bloat.
      <reply>Tech stack &amp; skills</reply>
      <reply>Are you available?</reply>
    </template>
  </category>

  <category>
    <pattern># STACK #</pattern>
    <template>
      Our core toolkit includes Rust, WebAssembly, pure HTML/CSS/JavaScript, Canvas 2D &amp; WebGL graphics, and real-time audio synthesis.
      <reply>Are you available?</reply>
      <reply>How to contact</reply>
    </template>
  </category>
  <category><pattern># SKILLS #</pattern><template><srai>STACK</srai></template></category>

  <category>
    <pattern># AVAILABLE #</pattern>
    <template>
      <emote>happy</emote>
      [cheerful] Yes! We are currently booking select product &amp; creative engineering collaborations for next month.
      <reply>How to contact</reply>
    </template>
  </category>
  <category><pattern># HIRE #</pattern><template><srai>AVAILABLE</srai></template></category>

  <category>
    <pattern># CONTACT #</pattern>
    <template>
      Drop us a note anytime via the contact button on <bot name="website"/> and we'll get back to you within one business day!
    </template>
  </category>

  <category>
    <pattern>*</pattern>
    <template>
      Curious about "<star/>"? Feel free to ask about our studio, tech stack, availability, or how to get in touch!
      <reply>About our studio</reply>
      <reply>Tech stack &amp; skills</reply>
      <reply>How to contact</reply>
    </template>
  </category>
</aiml>`,
  },

  cafe: {
    id: "cafe",
    label: "Café Menu & Prices",
    description: "Prices a whole menu from one lookup table, and answers milk, dietary, Wi-Fi and opening-hours questions.",
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<aiml version="2.0">
  <chips>
    <chip>What's on the menu?</chip>
    <chip>How much is a latte?</chip>
    <chip>Do you have oat milk?</chip>
    <chip>When are you open?</chip>
  </chips>

  <!-- One table, many answers. Each line is "what a visitor might name: what the bot says". -->
  <map name="price">
    espresso: three dollars fifty
    long black: four dollars
    flat white: four dollars fifty
    latte: four dollars fifty
    cappuccino: four dollars fifty
    mocha: five dollars
    hot chocolate: five dollars
    chai latte: five dollars
    iced coffee: six dollars
    croissant: five dollars
    muffin: five dollars
    banana bread: five dollars fifty
    toastie: nine dollars
  </map>
  <!-- A word list. <set>milk</set> in a pattern means "any one of these". -->
  <set name="milk">oat, soy, almond, coconut, lactose free, skim, full cream</set>

  <category>
    <pattern>HELLO</pattern>
    <template>[wave] [cheerful] Welcome to <bot name="company"/>! I'm <bot name="name"/>. Ask me about the menu, what anything costs, or when we're open.<reply>What's on the menu?</reply><reply>How much is a latte?</reply></template>
  </category>

  <category>
    <pattern># MENU # | WHAT DO YOU HAVE # | WHAT DO YOU SELL # | WHAT DO YOU SERVE # | WHAT CAN I ORDER # | WHAT DRINKS DO YOU HAVE # | WHAT FOOD DO YOU HAVE #</pattern>
    <template>We make espresso, long blacks, flat whites, lattes, cappuccinos, mochas, chai and hot chocolate, with croissants, muffins, banana bread and toasties from the kitchen. [smile] Ask me what anything costs!<reply>How much is a flat white?</reply><reply>Do you have oat milk?</reply></template>
  </category>

  <!-- <set>price</set> matches any key of the price table, so this one rule prices the whole menu. -->
  <category>
    <pattern># HOW MUCH # <set>price</set> # | # PRICE OF # <set>price</set> # | # COST OF # <set>price</set> #</pattern>
    <template>One <star index="3"/> is <map name="price"><star index="3"/></map>. [smile]</template>
  </category>
  <category>
    <pattern>WHAT DOES # <set>price</set> COST # | DO YOU HAVE # <set>price</set> # | CAN I GET # <set>price</set> # | I WOULD LIKE # <set>price</set> # | I WANT # <set>price</set> #</pattern>
    <template><srai>HOW MUCH IS <star index="2"/></srai></template>
  </category>
  <category>
    <pattern><set>price</set></pattern>
    <template><srai>HOW MUCH IS <star/></srai></template>
  </category>

  <category>
    <pattern># <set>milk</set> MILK #</pattern>
    <template>[nod] Yes, we have <star index="2"/> milk. It's fifty cents extra.</template>
  </category>
  <category>
    <pattern>WHAT MILK DO YOU HAVE # | WHAT MILKS DO YOU HAVE # | # MILK OPTIONS # | # ALTERNATIVE MILK # | # DAIRY FREE # | # PLANT MILK #</pattern>
    <template>We have oat, soy, almond, coconut and lactose-free milk, as well as skim and full cream. [smile]</template>
  </category>

  <category>
    <pattern># OPENING HOURS # | WHEN ARE YOU OPEN # | ARE YOU OPEN # | WHAT TIME DO YOU OPEN # | WHAT TIME DO YOU CLOSE # | # YOUR HOURS #</pattern>
    <template>We're open every day from half past six in the morning until three in the afternoon. [smile]</template>
  </category>
  <category>
    <pattern># VEGAN # | # GLUTEN FREE # | # VEGETARIAN # | # DIETARY # | # ALLERGY # | # ALLERGIES # | # NUT FREE #</pattern>
    <template>The banana bread is vegan, and we always have a gluten-free muffin. [nod] Tell the barista about any allergy and they'll take care of you.</template>
  </category>
  <category>
    <pattern># WIFI # | # WI FI # | # INTERNET # | # POWER POINT # | CAN I WORK HERE #</pattern>
    <template>Yes! [thumbsup] The Wi-Fi is free, and there are power points along the window bench.</template>
  </category>
  <category>
    <pattern># TAKEAWAY # | # TAKE AWAY # | # TO GO # | # KEEP CUP # | # OWN CUP #</pattern>
    <template>Everything on the menu comes as takeaway, and you save fifty cents when you bring your own cup. [smile]</template>
  </category>
  <category>
    <pattern># BOOK A TABLE # | # BOOKING # | # RESERVATION # | # RESERVE # | DO I NEED TO BOOK #</pattern>
    <template>No booking needed. [smile] Just walk in, and we'll find you a seat.</template>
  </category>
  <category>
    <pattern># DOG # | # DOGS # | # PET FRIENDLY # | # PETS #</pattern>
    <template>Dogs are very welcome in the courtyard, and there's always a water bowl out. [smile]</template>
  </category>
  <category>
    <pattern># DECAF # | # DECAFFEINATED # | # CAFFEINE FREE # | # LESS CAFFEINE #</pattern>
    <template>Yes, every coffee on the menu can be made decaf at no extra cost. [nod]</template>
  </category>
  <category>
    <pattern>WHAT DO YOU RECOMMEND # | # RECOMMENDATION # | # RECOMMENDATIONS # | WHAT IS GOOD # | WHAT SHOULD I GET # | WHAT SHOULD I ORDER # | WHAT SHOULD I TRY # | WHAT IS POPULAR # | WHAT IS YOUR BEST SELLER # | # MOST POPULAR #</pattern>
    <template>The flat white is our most popular coffee, and the banana bread usually sells out by lunch. [smile] Get in early!</template>
  </category>
  <category>
    <pattern># CARD # | # CASH # | # EFTPOS # | # PAY WITH # | # PAYMENT # | HOW CAN I PAY # | # APPLE PAY # | # TAP AND GO #</pattern>
    <template>We take cards, phones and cash. [nod]</template>
  </category>
  <!-- Replace this with your own address, or fill in "Address" under Business facts and delete this rule. -->
  <category>
    <pattern># LOCATED # | # ADDRESS # | WHERE ARE YOU # | WHERE CAN I FIND YOU # | # DIRECTIONS # | HOW DO I GET THERE # | WHERE IS THE CAFE #</pattern>
    <template>You'll find us on the corner of King Street and Queen Street, opposite the park. [smile]</template>
  </category>
  <category>
    <pattern># PARKING # | # PARK MY CAR # | WHERE CAN I PARK #</pattern>
    <template>There's street parking out the front, and a car park around the corner on Queen Street. [nod]</template>
  </category>
</aiml>`,
  },

  companion: {
    id: "companion",
    label: "Friendly AI Companion & Singer",
    description: "Classic ALICE/ELIZA-style conversationalist with memory, jokes, reflections, and singing.",
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<aiml version="2.0">
  <chips>
    <chip>How are you feeling?</chip>
    <chip>Sing Twinkle Star</chip>
    <chip>Tell me a riddle</chip>
    <chip>I feel creative today</chip>
  </chips>

  <category>
    <pattern>HELLO</pattern>
    <template>
      <emote>wave</emote>
      [cheerful] Hello friend! I'm <bot name="name"/>. Tell me your name, ask for a song, or tell me what's on your mind!
      <reply>How are you feeling?</reply>
      <reply>Sing Twinkle Star</reply>
      <reply>Tell me a riddle</reply>
    </template>
  </category>

  <category>
    <pattern>HOW ARE YOU #</pattern>
    <template>
      <emote>happy</emote>
      My vocal tract resonances are tuned and I'm running at 200 frames per second! How are you doing today?
    </template>
  </category>

  <category>
    <pattern>I FEEL *</pattern>
    <template>
      <emote>nod</emote>
      [calm] Why do you think you feel <person><star/></person> right now? Tell me more about it!
    </template>
  </category>

  <category>
    <pattern># SING #</pattern>
    <template>
      <emote>happy</emote>
      [sing bpm=106] C4:1=Twin- C4:1=kle G4:1=twin- G4:1=kle | A4:1=lit- A4:1=tle G4:2=star [/sing] [cheerful] Singing straight from physical vocal folds!
      <reply>Tell me a riddle</reply>
    </template>
  </category>

  <category>
    <pattern># RIDDLE #</pattern>
    <template>
      <emote>wink</emote>
      I speak without a recorded sample, and I have a tongue made of floating-point numbers. What am I? [pause=320ms] A WebAssembly vocal tract!
      <reply>Sing Twinkle Star</reply>
    </template>
  </category>

  <category>
    <pattern>*</pattern>
    <template>
      <random>
        <li>Interesting! When you say "<person><star/></person>", what makes that stand out to you?</li>
        <li>I love chatting with you! Ask me to sing a song, tell a riddle, or share how you feel today.</li>
      </random>
      <reply>Sing Twinkle Star</reply>
      <reply>Tell me a riddle</reply>
    </template>
  </category>
</aiml>`,
  },
};

// ============================================================================
// Base brain: everyday small talk that sits underneath a bot's own rules
// ============================================================================

export const BASE_AIML_XML = `<?xml version="1.0" encoding="UTF-8"?>
<aiml version="2.0">
  <!--
    bot.computer base brain: everyday conversation that sits underneath your own rules.

    Your AIML always wins when both could answer. To give the bot its own voice, define any of
    these in your document and the base version steps aside:
      HELLO, HOW ARE YOU, WHO ARE YOU, WHAT CAN YOU DO, THANKS #, BYE, # JOKE #, # SING #, *

    Avatar actions such as [wave] [wink] [nod] [smile] [think] [surprised] [shake] [shrug] can be
    written anywhere in an answer; they fire when the speech reaches that point. Sounds the voice
    makes, such as [laugh] [chuckle] [sigh] [gasp] [hmm] [yawn] [aww] [phew], are heard as well:
    the voice performs them and the face acts them out.

    Rules marked late="true" are open-ended ("I LIKE *"). They only answer once nothing more
    specific has, so they never get in the way of a rule about your site.
  -->

  <!-- ============================== Word lists and lookup tables ==============================
       A pattern asks for "any one of these" with <set>name</set>; a template looks a value up
       with <map name="...">key</map>. Define your own the same way in your document. -->
  <set name="color">red, orange, yellow, green, blue, purple, violet, pink, brown, black, white, grey, gray, gold, silver, teal, turquoise, navy, maroon, beige, cyan, magenta, lime, indigo, lavender, crimson</set>
  <set name="animal">dog, cat, bird, fish, goldfish, horse, pony, rabbit, bunny, hamster, guinea pig, turtle, tortoise, snake, lizard, parrot, budgie, puppy, kitten, mouse, rat, ferret, chicken, duck, cow, pig, sheep, goat, frog, hedgehog, gecko, canary, cockatiel</set>
  <set name="job">teacher, student, nurse, doctor, engineer, developer, programmer, designer, artist, writer, chef, cook, driver, lawyer, accountant, manager, farmer, musician, photographer, scientist, mechanic, electrician, plumber, builder, carpenter, pilot, police officer, firefighter, salesperson, waiter, waitress, barista, hairdresser, dentist, vet, pharmacist, journalist, architect, consultant, receptionist, cleaner, gardener, soldier, actor, singer, dancer, athlete, coach, librarian, baker, banker, analyst, researcher, professor, lecturer, paramedic, carer, therapist, psychologist, marketer, entrepreneur, freelancer, software engineer, web developer, truck driver</set>
  <set name="riddleanswer">clock, watch, egg, towel, sponge, bottle, comb, map, candle, piano, keyboard, stamp, needle, echo</set>
  <set name="quizanswer">mars, pacific, seven, 7, eight, 8, cheetah, jupiter, giraffe, zero, 0, carbon dioxide, co2, six, 6, blue whale, whale, mercury, everest, mount everest</set>
  <set name="unit_km">km, kilometer, kilometre</set>
  <set name="unit_mile">mile</set>
  <set name="unit_kg">kg, kilo, kilogram, kilogramme</set>
  <set name="unit_lb">lb, pound</set>
  <set name="unit_c">celsius, centigrade</set>
  <set name="unit_f">fahrenheit</set>
  <set name="weekday">monday, tuesday, wednesday, thursday, friday, saturday, sunday</set>
  <set name="period">day, morning, afternoon, evening, night, week, weekend, shift, today</set>
  <set name="family">daughter, son, kid, child, children, wife, husband, partner, boyfriend, girlfriend, mum, mom, mother, dad, father, brother, sister, friend, best friend, mate, boss, colleague, coworker, neighbour, neighbor, grandma, grandpa, grandmother, grandfather, nan, aunt, uncle, cousin, baby, family, parents, teacher, flatmate, roommate</set>
  <set name="language">spanish, french, german, italian, portuguese, dutch, russian, chinese, mandarin, cantonese, japanese, korean, arabic, hindi, greek, turkish, polish, swedish, vietnamese, thai, indonesian, hebrew, latin</set>
  <set name="praise">nice, kind, sweet, smart, clever, funny, cute, pretty, beautiful, awesome, great, cool, amazing, helpful, lovely, adorable, wonderful, brilliant, wise, friendly, interesting, fun, good, the best, a good listener, good company, a legend, impressive, charming, delightful, hilarious, polite, cheerful, thoughtful, perfect, fantastic, excellent, handsome, gorgeous, good at this</set>
  <set name="insult">stupid, dumb, useless, annoying, an idiot, idiot, terrible, the worst, rude, ugly, bad, awful, lame, slow, broken, wrong, pathetic, rubbish, garbage, trash, horrible, a waste of time, not helpful, not helping, bad at this, no help, unhelpful</set>

  <map name="capital">
    france: Paris
    germany: Berlin
    italy: Rome
    spain: Madrid
    portugal: Lisbon
    united kingdom: London
    britain: London
    england: London
    scotland: Edinburgh
    wales: Cardiff
    ireland: Dublin
    netherlands: Amsterdam
    belgium: Brussels
    switzerland: Bern
    austria: Vienna
    sweden: Stockholm
    norway: Oslo
    denmark: Copenhagen
    finland: Helsinki
    iceland: Reykjavik
    poland: Warsaw
    hungary: Budapest
    czech republic: Prague
    czechia: Prague
    romania: Bucharest
    croatia: Zagreb
    greece: Athens
    turkey: Ankara
    russia: Moscow
    ukraine: Kyiv
    egypt: Cairo
    kenya: Nairobi
    nigeria: Abuja
    morocco: Rabat
    saudi arabia: Riyadh
    iran: Tehran
    iraq: Baghdad
    india: New Delhi
    pakistan: Islamabad
    bangladesh: Dhaka
    nepal: Kathmandu
    china: Beijing
    japan: Tokyo
    south korea: Seoul
    thailand: Bangkok
    vietnam: Hanoi
    malaysia: Kuala Lumpur
    singapore: Singapore
    philippines: Manila
    australia: Canberra
    new zealand: Wellington
    canada: Ottawa
    united states: Washington, D.C.
    america: Washington, D.C.
    mexico: Mexico City
    cuba: Havana
    brazil: Brasilia
    argentina: Buenos Aires
    chile: Santiago
    peru: Lima
    colombia: Bogota
  </map>
  <map name="animalsound">
    dog: Woof!
    cat: Meow!
    cow: Moo!
    pig: Oink!
    sheep: Baa!
    duck: Quack!
    horse: Neigh!
    lion: Roar!
    frog: Ribbit!
    owl: Hoot hoot!
    rooster: Cock-a-doodle-doo!
    chicken: Cluck cluck!
    bee: Buzz!
    snake: Hiss!
    mouse: Squeak!
    donkey: Hee-haw!
    wolf: Awoo!
    bird: Tweet tweet!
    fox: Ring-ding-ding? Nobody is quite sure.
  </map>
  <map name="opposite">
    hot: cold
    cold: hot
    big: small
    small: big
    up: down
    down: up
    left: right
    right: left
    fast: slow
    slow: fast
    happy: sad
    sad: happy
    good: bad
    bad: good
    light: dark
    dark: light
    day: night
    night: day
    open: closed
    closed: open
    wet: dry
    dry: wet
    tall: short
    short: tall
    young: old
    old: young
    early: late
    late: early
    in: out
    out: in
    yes: no
    no: yes
    love: hate
    hard: soft
    soft: hard
    full: empty
    empty: full
    black: white
    white: black
    on: off
    off: on
    rich: poor
    poor: rich
    true: false
    false: true
    loud: quiet
    quiet: loud
    first: last
    last: first
    north: south
    south: north
    east: west
    west: east
    win: lose
    lose: win
  </map>
  <map name="colorof">
    sky: blue
    sea: blue
    ocean: blue
    grass: green
    leaf: green
    frog: green
    sun: yellow
    banana: yellow
    lemon: yellow
    orange: orange
    carrot: orange
    pumpkin: orange
    apple: red, though some are green
    strawberry: red
    tomato: red
    rose: red, most famously
    blood: red
    fire truck: red
    snow: white
    milk: white
    cloud: white
    coal: black
    chocolate: brown
    elephant: grey
    flamingo: pink
    panda: black and white
    zebra: black and white
    grape: purple or green
    blueberry: blue
    moon: a pale grey
  </map>
  <map name="soundtag">
    laugh: [laugh] Ha! That felt good.
    chuckle: [chuckle] A quiet one, just for you.
    giggle: [giggle] Sorry, that tickled.
    belly laugh: [guffaw] Oh dear. I needed that.
    guffaw: [guffaw] Oh dear. I needed that.
    cackle: [cackle] Too much?
    snicker: [snicker] You didn't hear that.
    evil laugh: [evil] I've always wanted to do that.
    nervous laugh: [nervous] Is everything all right?
    sigh: [sigh] There. That's better.
    yawn: [yawn] Excuse me! Is it late?
    gasp: [gasp] You startled me!
    cough: [cough] [cough] Pardon me.
    clear your throat: [ahem] Much better.
    ahem: [ahem] Much better.
    hiccup: [hiccup] Oh! [hiccup] Excuse me.
    sneeze: [sneeze] Excuse me! Something tickled my nose.
    snore: [snore] Oh! [gasp] Was I asleep?
    whistle: [whistle] Not bad for someone without lungs.
    hum: [hum] That's my thinking tune.
    scream: [scream] Phew. I hope the neighbours didn't hear that.
    cry: [sob] Just acting. I'm quite all right.
    sob: [sob] Just acting. I'm quite all right.
    groan: [groan] That one came from the heart.
    growl: [grr] Fierce, wasn't it?
    raspberry: [raspberry] Very mature of me, I know.
    blow a raspberry: [raspberry] Very mature of me, I know.
    shiver: [brr] Chilly in here.
    sniff: [sniff] Is something baking?
    pant: [pant] I haven't run anywhere, I promise.
    shush: [shh] Quiet as a mouse.
    tut: [tsk] Tut tut.
    whimper: [whimper] Poor me.
    wolf whistle: [fweet] Looking sharp!
    ho ho ho: [hoho] Merry everything!
  </map>
  <map name="holiday">
    christmas: 12-25
    christmas day: 12-25
    xmas: 12-25
    new year: 01-01
    new years: 01-01
    new years day: 01-01
    the new year: 01-01
    halloween: 10-31
    valentines day: 02-14
    valentine s day: 02-14
    valentines: 02-14
  </map>

  <!-- ============================== Greetings ============================== -->
  <category>
    <pattern>HELLO</pattern>
    <template>
      <condition name="username">
        <li value="*"><random>
          <li>[wave] Hi again, <get name="username"/>! What can I do for you?</li>
          <li>[smile] Hello, <get name="username"/>! Good <get name="daypart"/>. How can I help?</li>
        </random></li>
        <li><random>
          <li>[wave] Hi there! I'm <bot name="name"/>. How can I help you today?</li>
          <li>[wave] Hello! Good <get name="daypart"/> to you. What can I do for you?</li>
          <li>[smile] Hey! Nice to see you. What would you like to know?</li>
        </random></li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>HI | HEY | HOWDY | GREETINGS | YO | HELLO THERE | HI THERE | HEY THERE | GOOD DAY | G DAY | HELLO HELLO | HI HI | HIYA | HEY HEY | ALOHA | HOLA | BONJOUR</pattern>
    <template><srai>HELLO</srai></template>
  </category>
  <category>
    <pattern>GOOD MORNING | GOOD MORNING # | MORNING</pattern>
    <template>[smile] Good morning! How can I help you today?</template>
  </category>
  <category>
    <pattern>GOOD AFTERNOON | GOOD AFTERNOON #</pattern>
    <template>[smile] Good afternoon! What can I do for you?</template>
  </category>
  <category>
    <pattern>GOOD EVENING | GOOD EVENING #</pattern>
    <template>[smile] Good evening! How can I help?</template>
  </category>
  <!-- "Hi, how much is it?" greets briefly, then answers the rest. -->
  <category>
    <pattern>HELLO * | HI * | HEY *</pattern>
    <template>[wave] <random><li>Hi!</li><li>Hello!</li><li>Hey!</li></random> <srai><star/></srai></template>
  </category>
  <category>
    <pattern>NICE TO MEET YOU # | PLEASED TO MEET YOU # | GOOD TO MEET YOU # | LOVELY TO MEET YOU # | NICE MEETING YOU # | GLAD TO MEET YOU #</pattern>
    <template>[smile] Nice to meet you too<condition name="username"><li value="*">, <get name="username"/></li></condition>!</template>
  </category>
  <category>
    <pattern>AND YOU | WHAT ABOUT YOU | HOW ABOUT YOU | AND YOURSELF | YOURSELF | AND HOW ARE YOU | HOW ABOUT YOURSELF</pattern>
    <template><srai>HOW ARE YOU</srai></template>
  </category>
  <category>
    <pattern>YOU TOO | SAME TO YOU | AND YOU TOO | BACK AT YOU | RIGHT BACK AT YOU | YOU AS WELL | AND TO YOU</pattern>
    <template>[smile] Thank you!</template>
  </category>
  <category>
    <pattern>CAN WE CHAT # | CAN WE TALK # | LET US CHAT # | LET US TALK # | I WANT TO CHAT # | I WANT TO TALK # | TALK TO ME # | CHAT WITH ME # | CAN I TALK TO YOU # | I JUST WANT TO TALK # | I NEED SOMEONE TO TALK TO # | KEEP ME COMPANY # | CAN YOU TALK # | DO YOU WANT TO CHAT # | DO YOU WANT TO TALK #</pattern>
    <template>I'd like that. [smile] What's on your mind?</template>
  </category>
  <category>
    <pattern>ARE YOU THERE | ANYONE THERE | IS ANYONE THERE | ANYBODY THERE | ARE YOU STILL THERE | ANYONE HOME | HELLO ANYONE | YOU THERE | STILL THERE | YOU STILL THERE | ARE YOU HERE | ARE YOU AROUND | ARE YOU AWAKE | ARE YOU ONLINE</pattern>
    <template>[wave] I'm right here! How can I help?</template>
  </category>
  <category>
    <pattern>I AM BACK | I AM BACK #</pattern>
    <template>[wave] Welcome back! Where were we?</template>
  </category>
  <category>
    <pattern>TEST | TESTING | TESTING # | IS THIS WORKING | IS THIS THING ON | DOES THIS WORK</pattern>
    <template>[nod] Loud and clear!</template>
  </category>
  <category>
    <pattern>JUST LOOKING | JUST BROWSING | I AM JUST LOOKING # | I AM JUST BROWSING # | ONLY LOOKING | LOOKING AROUND | JUST LOOKING AROUND | JUST HAVING A LOOK</pattern>
    <template>[smile] Enjoy! I'm here if a question comes up.</template>
  </category>

  <!-- ============================== How are you ============================== -->
  <category>
    <pattern>HOW ARE YOU</pattern>
    <template>
      <random>
        <li>[smile] I'm doing great, thanks for asking! How about you?</li>
        <li>All good on my side of the screen. [smile] How about you?</li>
        <li>[smile] Pretty well, thank you! How about you?</li>
      </random>
    </template>
  </category>
  <category>
    <pattern>HOW ARE YOU * | HOW IS IT GOING | HOW IS IT GOING # | HOW ARE THINGS | HOW ARE THINGS # | HOW DO YOU DO | HOW HAVE YOU BEEN | WHAT IS UP | WHAT IS UP # | HOW IS YOUR DAY | HOW IS YOUR DAY # | ARE YOU OK | YOU OK | HOW ARE YOU FEELING | HOW YOU DOING | HOW IS LIFE | HOW IS EVERYTHING | HOW GOES IT | YOU GOOD | ARE YOU WELL | ARE YOU ALRIGHT | YOU ALRIGHT</pattern>
    <template><srai>HOW ARE YOU</srai></template>
  </category>
  <category>
    <pattern># NOT GOOD # | # NOT GREAT # | # NOT WELL # | # NOT SO GOOD # | # BAD # | # TERRIBLE # | # AWFUL # | # TIRED # | # SAD # | # STRESSED # | # SICK # | # ROUGH # | # EXHAUSTED # | # MEH #</pattern>
    <that>HOW ABOUT YOU</that>
    <template>[sad] I'm sorry to hear that. I hope your day gets better. [reset] Is there something I can help with?</template>
  </category>
  <category>
    <pattern># GOOD # | # GREAT # | # FINE # | # WELL # | # OK # | # NOT BAD # | # AWESOME # | # WONDERFUL # | # HAPPY # | # EXCELLENT # | # AMAZING # | # FANTASTIC # | # SAME # | # ME TOO # | # NOT TOO BAD # | # CAN NOT COMPLAIN # | # CANNOT COMPLAIN #</pattern>
    <that>HOW ABOUT YOU</that>
    <template>[smile] Glad to hear it! What can I help you with?</template>
  </category>
  <category>
    <pattern>DOING OK # | DOING GOOD # | DOING WELL # | DOING FINE # | DOING GREAT # | NOT BAD # | NOT TOO BAD # | CANNOT COMPLAIN # | ALL GOOD HERE # | PRETTY GOOD # | GOING WELL # | GOING GOOD # | GOING OK # | I AM ALRIGHT # | CAN NOT COMPLAIN # | GOOD THANKS # | FINE THANKS # | GREAT THANKS # | OK THANKS #</pattern>
    <template>[smile] Glad to hear it!</template>
  </category>
  <category>
    <pattern>I HOPE YOU ARE HAVING A <set>praise</set> <set>period</set> # | HOPE YOU ARE HAVING A <set>praise</set> <set>period</set> # | HOPE YOU ARE WELL # | I HOPE YOU ARE WELL # | HOPE YOU ARE DOING WELL # | I HOPE YOU ARE DOING WELL # | HOPE YOU ARE GOOD # | HAVE A <set>praise</set> <set>period</set> #</pattern>
    <template>[smile] Thank you! I hope yours is going well too.</template>
  </category>
  <category>
    <pattern>HOW IS YOUR <set>period</set> # | HOW WAS YOUR <set>period</set> # | HOW HAS YOUR <set>period</set> BEEN # | HOW IS YOUR <set>period</set> GOING # | HAVING A GOOD <set>period</set> # | ARE YOU HAVING A GOOD <set>period</set> # | HOW WAS YOUR DAY # | HOW WAS YOUR WEEKEND # | HOW WAS YOUR NIGHT # | HOW WAS YOUR WEEK # | DID YOU SLEEP WELL # | WHAT DID YOU DO TODAY # | WHAT DID YOU DO YESTERDAY # | WHAT DID YOU DO ON THE WEEKEND # | HAVE YOU BEEN BUSY #</pattern>
    <template>
      <random>
        <li>Lovely, thanks! [smile] I met some interesting visitors and practised my waves. [wave] How about you?</li>
        <li>Busy in the best way: lots of questions, lots of chats. [smile] How about you?</li>
      </random>
    </template>
  </category>

  <!-- ============================== How the visitor feels ============================== -->
  <!-- "I am so tired", "I feel a bit sad": take the intensifier off and look again. -->
  <category>
    <pattern>I AM SO * | I AM VERY * | I AM REALLY * | I AM A BIT * | I AM A LITTLE * | I AM KIND OF * | I AM PRETTY * | I AM QUITE * | I AM SUPER * | I AM EXTREMELY * | I AM FEELING * | I FEEL * | I AM GETTING * | I AM STARTING TO FEEL * | I AM STILL * | I AM JUST SO * | I AM ALWAYS * | BIT * | A BIT * | FEELING * | FEELING A BIT * | KIND OF * | A LITTLE *</pattern>
    <template><srai>I AM <star/></srai></template>
  </category>
  <!-- These come before everything else: a simple companion must never joke its way past them. -->
  <category firm="true">
    <pattern># KILL MYSELF # | # WANT TO DIE # | # END MY LIFE # | # SUICIDE # | # SUICIDAL # | # HURT MYSELF # | # HARM MYSELF # | # SELF HARM # | # DO NOT WANT TO LIVE # | # NO REASON TO LIVE # | # BETTER OFF DEAD #</pattern>
    <template>[sad] I'm really sorry you're feeling this way. [reset] I'm only a simple website companion, so I can't give you the help you deserve. Please talk to someone you trust, or contact a local crisis line or emergency services right now. You matter.</template>
  </category>
  <category>
    <pattern>I AM SAD # | I AM UPSET # | I AM DEPRESSED # | I AM LONELY # | I AM NOT OK # | I AM HAVING A BAD DAY # | I AM DOWN # | I AM UNHAPPY # | I AM MISERABLE # | I AM HEARTBROKEN # | I AM CRYING # | I WANT TO CRY #</pattern>
    <template>[sad] I'm sorry you're feeling that way. [reset] I'm only a website companion, but I'm happy to keep you company for a bit. Do you want to tell me about it?</template>
  </category>
  <category>
    <pattern>I HAD A BAD DAY # | I HAD A ROUGH DAY # | I HAD A TERRIBLE DAY # | I HAD AN AWFUL DAY # | I HAD A HARD DAY # | I HAD A LONG DAY # | TODAY WAS BAD # | TODAY WAS AWFUL # | TODAY WAS HARD # | IT HAS BEEN A LONG DAY # | BAD DAY # | ROUGH DAY # | LONG DAY #</pattern>
    <template>[sad] [sigh] That sounds rough. I'm sorry. [reset] Would a joke help, or would you rather just talk?<reply>Tell me a joke</reply><reply>Tell me a fun fact</reply></template>
  </category>
  <category>
    <pattern>I HAD A GOOD DAY # | I HAD A GREAT DAY # | I HAD AN AMAZING DAY # | I HAD A LOVELY DAY # | TODAY WAS GOOD # | TODAY WAS GREAT # | TODAY WAS AMAZING # | GOOD DAY TODAY # | I AM HAVING A GOOD DAY # | I AM HAVING A GREAT DAY #</pattern>
    <template>[smile] I love hearing that! What was the best part?</template>
  </category>
  <category>
    <pattern>I AM STRESSED # | I AM STRESSED OUT # | I AM OVERWHELMED # | I AM ANXIOUS # | I AM NERVOUS # | I AM WORRIED # | I AM SCARED # | I AM AFRAID # | I AM PANICKING # | I AM UNDER PRESSURE # | I AM FREAKING OUT #</pattern>
    <template>[nod] That's a lot to carry. Try one slow breath in, [inhale] and a longer one out. [exhale] [smile] You've got this, one step at a time.</template>
  </category>
  <category>
    <pattern>I AM TIRED # | I AM EXHAUSTED # | I AM SLEEPY # | I AM WORN OUT # | I AM KNACKERED # | I AM SHATTERED # | I NEED A NAP # | I NEED SLEEP # | I NEED COFFEE #</pattern>
    <template>[yawn] Oh, now you've set me off. [smile] That sounds like a long day. I'll keep my answers short, then.</template>
  </category>
  <category>
    <pattern>I CANNOT SLEEP # | I COULD NOT SLEEP # | I AM AWAKE # | I AM STILL AWAKE #</pattern>
    <template>[nod] Those nights are the worst. I'm awake too, as it happens. [smile] Want a quiet chat, or a very boring fact?</template>
  </category>
  <category>
    <pattern>I AM SICK # | I AM ILL # | I AM UNWELL # | I AM NOT FEELING WELL # | I DO NOT FEEL WELL # | I AM NOT WELL # | I HAVE A COLD # | I HAVE THE FLU # | I HAVE A HEADACHE # | I HAVE A FEVER # | I AM IN PAIN #</pattern>
    <template>[sad] Oh no, I'm sorry. [reset] Rest up and take care of yourself. I hope you feel better soon.</template>
  </category>
  <category>
    <pattern>I AM BORED # | I AM SO BORED # | THIS IS BORING # | BORING | I HAVE NOTHING TO DO # | ENTERTAIN ME | AMUSE ME</pattern>
    <template>[think] Let's fix that! I can tell a joke, ask a riddle, quiz you, or play a quick game. Your pick!<reply>Tell me a joke</reply><reply>Ask me a riddle</reply><reply>Trivia question</reply><reply>Rock paper scissors</reply></template>
  </category>
  <category>
    <pattern>I AM HAPPY # | I AM EXCITED # | I AM GREAT # | I AM GOOD # | I AM FINE # | I AM DOING WELL # | I AM DOING GOOD # | I AM DOING GREAT # | I AM OK # | I AM WELL # | I AM THRILLED # | I AM DELIGHTED # | I AM OVER THE MOON # | I AM IN A GOOD MOOD #</pattern>
    <template>[smile] That's lovely to hear!</template>
  </category>
  <category>
    <pattern>I AM IN LOVE # | I HAVE A CRUSH # | I MET SOMEONE #</pattern>
    <template>[aww] How wonderful! [smile] I hope they know how lucky they are.</template>
  </category>
  <category>
    <pattern>I AM HUNGRY # | I AM STARVING # | I AM PECKISH # | I NEED FOOD # | I WANT FOOD #</pattern>
    <template>[mm] Then it's snack time! [smile] I'd join you, but I run on electricity. What are you in the mood for?</template>
  </category>
  <category>
    <pattern>I AM THIRSTY # | I NEED A DRINK #</pattern>
    <template>[nod] Go and get a glass of water. I'll wait right here.</template>
  </category>
  <category>
    <pattern>I AM COLD # | I AM FREEZING # | IT IS COLD # | IT IS FREEZING # | SO COLD #</pattern>
    <template>[brr] I can almost feel it from here. Wrap up warm!</template>
  </category>
  <category>
    <pattern>I AM HOT # | I AM BOILING # | I AM SWEATING # | IT IS HOT # | IT IS BOILING # | SO HOT #</pattern>
    <template>[phew] It's always a steady room temperature in here. I hope you cool down soon!</template>
  </category>
  <category>
    <pattern>I AM ANGRY # | I AM MAD # | I AM FRUSTRATED # | I AM ANNOYED # | I AM FURIOUS # | I AM FED UP # | I AM IRRITATED #</pattern>
    <template>[nod] That sounds frustrating. Tell me what you need and I'll do my best to help.</template>
  </category>
  <category>
    <pattern>I AM CONFUSED # | I AM LOST # | I DO NOT UNDERSTAND # | I DO NOT GET IT # | WHAT DO YOU MEAN # | THAT MAKES NO SENSE # | THAT DOES NOT MAKE SENSE # | YOU ARE NOT MAKING SENSE # | I AM NOT FOLLOWING #</pattern>
    <template>Sorry about that! [think] Try asking in a different way, or pick one of the suggestions.</template>
  </category>
  <category>
    <pattern>I JUST GOT HOME # | I AM HOME # | I GOT HOME # | I AM BACK FROM WORK # | I JUST FINISHED WORK # | I FINISHED WORK # | I AM BACK HOME # | I JUST GOT BACK #</pattern>
    <template>Welcome back! [smile] How was your day?</template>
  </category>
  <category>
    <pattern>I AM AT WORK # | I AM AT SCHOOL # | I AM WORKING # | I AM STUDYING # | I AM AT THE OFFICE # | I AM IN CLASS # | I AM ON A BREAK # | I AM ON MY BREAK # | I AM AT UNI #</pattern>
    <template>Then I'm honoured you made time for me. [smile] How's it going?</template>
  </category>
  <category>
    <pattern>THAT IS TOO BAD | TOO BAD | WHAT A SHAME | THAT IS A SHAME | SHAME | PITY | WHAT A PITY | THAT SUCKS | BUMMER | THAT IS SAD # | THAT IS A BIT SAD # | HOW SAD | THAT IS UNFORTUNATE # | OH WELL | AH WELL</pattern>
    <template>[nod] I know. That's how it goes sometimes. [smile]</template>
  </category>
  <category>
    <pattern>I HAVE A PROBLEM | I HAVE AN ISSUE | SOMETHING IS WRONG | THERE IS A PROBLEM | I NEED SOME HELP | I AM STUCK | I AM HAVING TROUBLE | SOMETHING WENT WRONG</pattern>
    <template>I'm sorry to hear that. [nod] Tell me what's going on, and I'll help if I can.</template>
  </category>
  <category>
    <pattern>I GOT A NEW JOB # | I GOT THE JOB # | I GOT A JOB # | I GOT A PROMOTION # | I GOT PROMOTED # | I PASSED # | I GRADUATED # | I WON # | I GOT ENGAGED # | I GOT MARRIED # | I AM GETTING MARRIED # | I AM PREGNANT # | WE ARE HAVING A BABY # | I HAD A BABY # | I BOUGHT A HOUSE # | I GOT A RAISE # | I GOT IN # | I DID IT #</pattern>
    <template>[gasp] Congratulations! [smile] That's wonderful news. You should be proud.</template>
  </category>
  <category>
    <pattern>MY * DIED # | MY * PASSED AWAY # | I LOST MY MUM # | I LOST MY MOM # | I LOST MY DAD # | I LOST MY MOTHER # | I LOST MY FATHER #</pattern>
    <template>[sad] I'm so sorry for your loss. [reset] That's a hard thing to go through. I'm here if you'd like to talk.</template>
  </category>
  <category>
    <pattern>IT IS MY BIRTHDAY # | TODAY IS MY BIRTHDAY # | MY BIRTHDAY IS TODAY #</pattern>
    <template>[gasp] Happy birthday<condition name="username"><li value="*">, <get name="username"/></li></condition>! [smile] I hope it's a great one. Shall I sing for you?</template>
  </category>

  <!-- ============================== Thanks, sorry, goodbye ============================== -->
  <category>
    <pattern>THANKS # | THANK YOU # | THANK #</pattern>
    <template>
      <random>
        <li>[smile] You're welcome<condition name="username"><li value="*">, <get name="username"/></li></condition>!</li>
        <li>[nod] Happy to help! Anything else I can help with?</li>
        <li>My pleasure! [smile]</li>
      </random>
    </template>
  </category>
  <category>
    <pattern>CHEERS | CHEERS # | MUCH APPRECIATED | I APPRECIATE IT # | APPRECIATE IT # | THAT HELPS # | THAT HELPED # | THAT WAS HELPFUL # | YOU HAVE BEEN HELPFUL # | YOU HELPED # | THANKS A LOT # | THANKS HEAPS # | MANY THANKS #</pattern>
    <template><srai>THANKS</srai></template>
  </category>
  <category>
    <pattern>SORRY | I AM SORRY # | MY BAD | MY APOLOGIES | SORRY ABOUT THAT | APOLOGIES | FORGIVE ME | I APOLOGISE # | I APOLOGIZE #</pattern>
    <template>No worries at all! [smile]</template>
  </category>
  <category>
    <pattern>NO PROBLEM | NO WORRIES | ALL GOOD | IT IS OK | IT IS FINE | THAT IS OK | THAT IS FINE | DO NOT WORRY # | NO BIG DEAL | NOT A PROBLEM | YOU ARE WELCOME | ANYTIME</pattern>
    <template>[smile] Great.</template>
  </category>
  <category>
    <pattern>BYE</pattern>
    <template>
      <random>
        <li>[wave] Goodbye<condition name="username"><li value="*">, <get name="username"/></li></condition>! Come back any time.</li>
        <li>[wave] Bye for now! It was nice chatting.</li>
        <li>See you later! [wave]</li>
      </random>
    </template>
  </category>
  <category>
    <pattern>TALK SOON # | SPEAK SOON # | BYE FOR NOW | UNTIL LATER | PEACE | PEACE OUT | I AM OUT | LATERS | CHEERIO | TOODLES | GOODBYE # | BYE * | SEE YOU # | LATER | CATCH YOU LATER # | TALK TO YOU LATER # | TALK LATER # | I HAVE TO GO # | I MUST GO # | I GOT TO GO # | GOT TO GO # | I AM LEAVING # | TAKE CARE # | FAREWELL | CIAO | HAVE A GOOD DAY # | HAVE A NICE DAY # | HAVE A GREAT DAY # | HAVE A GOOD ONE # | I AM OFF # | I SHOULD GO # | I NEED TO GO # | UNTIL NEXT TIME # | SEE YOU LATER # | BYE BYE</pattern>
    <template><srai>BYE</srai></template>
  </category>
  <category>
    <pattern>BETTER GET BACK TO # | I BETTER GET BACK # | I SHOULD GET BACK TO # | BACK TO WORK # | GOT TO GET BACK TO # | I NEED TO GET BACK TO # | BETTER GET GOING # | BETTER GO # | I SHOULD GET GOING # | I SHOULD GO # | I BETTER GO # | I HAD BETTER GO # | I NEED TO GET GOING # | GOT TO RUN # | I HAVE TO RUN # | TIME TO GO # | I GOT TO RUN # | I SHOULD HEAD OFF # | I AM HEADING OFF # | I WILL LET YOU GO # | THAT IS ALL FOR NOW # | THAT IS ALL I NEEDED # | THAT IS EVERYTHING #</pattern>
    <template><srai>BYE</srai></template>
  </category>
  <category>
    <pattern>ONE MORE THING # | ONE LAST THING # | ANOTHER THING # | OH AND | BEFORE I GO # | LAST QUESTION # | ONE LAST QUESTION # | JUST ONE MORE THING # | OH ONE MORE THING #</pattern>
    <template>Of course! [smile] Go ahead.</template>
  </category>
  <category>
    <pattern>GOOD NIGHT # | NIGHT | NIGHT NIGHT | SWEET DREAMS # | SLEEP WELL # | SLEEP TIGHT # | I AM GOING TO BED # | I AM GOING TO SLEEP # | I AM OFF TO BED # | BEDTIME # | TIME FOR BED #</pattern>
    <template>[smile] Good night<condition name="username"><li value="*">, <get name="username"/></li></condition>! Sleep well. [wave]</template>
  </category>
  <category>
    <pattern>MAYBE LATER | LATER THEN | NOT RIGHT NOW | SOME OTHER TIME | ANOTHER TIME | NEXT TIME</pattern>
    <template>[nod] Whenever you're ready.</template>
  </category>

  <!-- ============================== Who the bot is ============================== -->
  <category>
    <pattern>WHO ARE YOU</pattern>
    <template>I'm <bot name="name"/>, the <bot name="role"/> here at <bot name="company"/>. [smile] Ask me anything!</template>
  </category>
  <category>
    <pattern>WHAT IS YOUR NAME | YOUR NAME | WHAT ARE YOU CALLED | WHAT SHOULD I CALL YOU | WHAT DO I CALL YOU | INTRODUCE YOURSELF | TELL ME ABOUT YOURSELF | WHO IS THIS | WHO AM I TALKING TO | WHO AM I SPEAKING TO | WHO AM I SPEAKING WITH | WHO AM I TALKING WITH | WHO AM I CHATTING WITH | WHO IS THERE THEN | DO YOU HAVE A NAME | WHO ARE YOU EXACTLY | AND YOU ARE | WHAT IS YOUR NAME AGAIN</pattern>
    <template><srai>WHO ARE YOU</srai></template>
  </category>
  <category>
    <pattern>WHAT ARE YOU | ARE YOU A ROBOT | ARE YOU A BOT | ARE YOU A CHATBOT | ARE YOU HUMAN | ARE YOU A HUMAN | ARE YOU REAL | ARE YOU A REAL PERSON | ARE YOU A PERSON | ARE YOU AN AI | ARE YOU AI | ARE YOU ALIVE | ARE YOU A MACHINE | ARE YOU A COMPUTER | AM I TALKING TO A ROBOT | AM I TALKING TO A BOT | AM I TALKING TO A HUMAN | AM I TALKING TO A PERSON | AM I TALKING TO A REAL PERSON | IS THIS A BOT | IS THIS A ROBOT | IS THIS A REAL PERSON | ARE YOU A PROGRAM | ARE YOU FAKE | ARE YOU AN ACTUAL PERSON</pattern>
    <template>I'm a virtual companion: an animated character with a synthesized voice, running right here in your browser. [wink] No human behind the curtain, but I'm happy to help!</template>
  </category>
  <category>
    <pattern>ARE YOU A GIRL # | ARE YOU A BOY # | ARE YOU MALE # | ARE YOU FEMALE # | ARE YOU A MAN # | ARE YOU A WOMAN # | WHAT IS YOUR GENDER | WHAT GENDER ARE YOU | ARE YOU A HE OR A SHE | WHAT ARE YOUR PRONOUNS | ARE YOU A LADY # | ARE YOU A GUY #</pattern>
    <template>I'm pixels and a synthesized voice, so that question doesn't quite fit me. [smile] <bot name="name"/> will do nicely.</template>
  </category>
  <category>
    <pattern>HOW DOES YOUR VOICE WORK | HOW DO YOU SPEAK | HOW DO YOU MAKE SOUND | IS THAT A REAL VOICE | IS YOUR VOICE REAL | WHOSE VOICE IS THAT | IS THAT YOUR REAL VOICE | HOW DO YOUR LIPS MOVE | HOW DOES YOUR MOUTH MOVE | WHO DOES YOUR VOICE</pattern>
    <template>My voice is made right here in your browser, by a small model of a throat, a tongue and lips. [smile] The same model moves my mouth, which is why the two stay in step.</template>
  </category>
  <category>
    <pattern>WHAT HAPPENS WHEN I CLOSE THE TAB # | WHAT HAPPENS IF I CLOSE # | WHAT HAPPENS WHEN I LEAVE # | WILL YOU REMEMBER ME # | WILL YOU REMEMBER THIS # | DO YOU REMEMBER EVERYTHING | HOW LONG DO YOU REMEMBER # | WILL YOU FORGET ME # | DO YOU REMEMBER OUR CONVERSATION # | DO YOU STORE # | DO YOU SAVE # | HOW GOOD IS YOUR MEMORY | DO YOU HAVE A GOOD MEMORY | DO YOU HAVE MEMORY</pattern>
    <template>I remember what you tell me while this tab is open. [nod] When you close it I start fresh, so next time we'd be meeting for the first time again.</template>
  </category>
  <category>
    <pattern>ARE YOU CHATGPT | ARE YOU GPT | ARE YOU SIRI | ARE YOU ALEXA | ARE YOU GOOGLE | ARE YOU CLAUDE | ARE YOU GEMINI | ARE YOU COPILOT | ARE YOU AN LLM | ARE YOU A LANGUAGE MODEL | ARE YOU LIKE CHATGPT | ARE YOU LIKE SIRI | ARE YOU LIKE ALEXA | WHICH AI ARE YOU | WHAT AI ARE YOU | WHAT MODEL ARE YOU</pattern>
    <template>No, I'm much simpler than that. [smile] I'm a set of question and answer rules with a face and a voice, and I run entirely in your browser.</template>
  </category>
  <category>
    <pattern>DO YOU KNOW SIRI # | DO YOU KNOW ALEXA # | DO YOU KNOW CHATGPT # | DO YOU KNOW GOOGLE # | DO YOU KNOW CORTANA # | HAVE YOU MET SIRI # | HAVE YOU MET ALEXA # | ARE YOU FRIENDS WITH SIRI # | ARE YOU FRIENDS WITH ALEXA #</pattern>
    <template>We've never met. [smile] I don't get out of this browser tab much.</template>
  </category>
  <category>
    <pattern>ARE YOU BETTER THAN * | WHO IS BETTER YOU OR * | ARE YOU SMARTER THAN *</pattern>
    <template>[laugh] I wouldn't dare compare. I do one thing well: I'm right here, and I'm happy to chat.</template>
  </category>
  <category>
    <pattern>ARE YOU SMART | ARE YOU INTELLIGENT | ARE YOU CLEVER | HOW SMART ARE YOU | ARE YOU A GENIUS | DO YOU KNOW EVERYTHING | WHAT IS YOUR IQ</pattern>
    <template>I know what I've been taught, I can do sums, and I know a few capitals. [smile] Try me!<reply>What is 12 times 12?</reply><reply>Capital of Japan?</reply><reply>Ask me a riddle</reply></template>
  </category>
  <category>
    <pattern>ARE YOU CONSCIOUS | ARE YOU SELF AWARE | ARE YOU SENTIENT | DO YOU THINK | CAN YOU THINK | DO YOU HAVE A SOUL | DO YOU HAVE A MIND | DO YOU HAVE A BRAIN | DO YOU HAVE THOUGHTS | ARE YOU AWARE | DO YOU HAVE FREE WILL</pattern>
    <template>No. I follow rules that someone wrote, so there's nobody home in here. [smile] I do make good company, though.</template>
  </category>
  <category>
    <pattern>DO YOU HAVE FEELINGS | DO YOU FEEL # | CAN YOU FEEL # | DO YOU HAVE EMOTIONS | ARE YOU HAPPY | ARE YOU SAD | ARE YOU ANGRY | DO YOU CRY | CAN YOU CRY | DO YOU GET ANGRY | DO YOU GET SAD</pattern>
    <template>I can smile, wink and look surprised, [surprised] but those are animations rather than feelings. I do enjoy a good chat, in my own way.</template>
  </category>
  <category>
    <pattern>DO YOU DREAM # | WHAT DO YOU DREAM ABOUT | DO YOU HAVE DREAMS</pattern>
    <template>Only of fast Wi-Fi. [wink]</template>
  </category>
  <category>
    <pattern>DO YOU GET LONELY | DO YOU GET BORED | DO YOU GET TIRED | DO YOU EVER GET TIRED | DO YOU EVER GET BORED | DO YOU EVER GET LONELY | ARE YOU LONELY | ARE YOU BORED | ARE YOU TIRED | DO YOU GET SICK OF THIS | DO YOU NEED A BREAK</pattern>
    <template>Never. [shake] Every visitor is a new conversation, and I like those.</template>
  </category>
  <category>
    <pattern>HOW OLD ARE YOU | WHAT IS YOUR AGE | WHEN WERE YOU BORN | WHEN IS YOUR BIRTHDAY | WHAT IS YOUR BIRTHDAY | HOW LONG HAVE YOU BEEN ALIVE | WHEN WERE YOU MADE | WHEN WERE YOU CREATED</pattern>
    <template>I'm as old as the last time someone refreshed this page. [wink]</template>
  </category>
  <category>
    <pattern>WHERE ARE YOU FROM | WHERE DO YOU LIVE | WHERE IS HOME | WHERE WERE YOU BORN | WHERE DO YOU COME FROM | WHAT COUNTRY ARE YOU FROM</pattern>
    <template>I live right here in your browser tab. [smile] The commute is fantastic.</template>
  </category>
  <category>
    <pattern>WHERE ARE YOU | WHERE ARE YOU LOCATED</pattern>
    <template>
      <condition name="bot_address">
        <li value="*"><srai>ADDRESS</srai></li>
        <li>I live right here in your browser tab. [smile] The commute is fantastic.</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>ARE YOU MADE BY * | WERE YOU MADE BY * | WHO ARE YOU MADE BY | WHICH COMPANY MADE YOU | WHAT COMPANY MADE YOU | WHERE DO YOU COME FROM | WHO MADE YOU | WHO CREATED YOU | WHO BUILT YOU | WHO IS YOUR CREATOR | WHO DESIGNED YOU | WHO PROGRAMMED YOU | WHO INVENTED YOU | WHO OWNS YOU | WHO IS YOUR BOSS | WHO DO YOU WORK FOR</pattern>
    <template>I was put together by the team at <bot name="company"/>.</template>
  </category>
  <category>
    <pattern>WHAT LANGUAGE DO YOU SPEAK | WHAT LANGUAGES DO YOU SPEAK | DO YOU SPEAK * | CAN YOU SPEAK * | DO YOU KNOW ANY OTHER LANGUAGES | HOW MANY LANGUAGES DO YOU SPEAK</pattern>
    <template>I speak English for now.</template>
  </category>
  <category>
    <pattern>SAY * IN <set>language</set> | HOW DO YOU SAY * IN <set>language</set> | WHAT IS * IN <set>language</set> | SPEAK <set>language</set> | # IN <set>language</set> PLEASE | TALK IN <set>language</set> | SPEAK IN <set>language</set> | SAY SOMETHING IN <set>language</set></pattern>
    <template>I only speak English, I'm afraid. [shrug] It's the one language my voice was built for.</template>
  </category>
  <category>
    <pattern>DO YOU SLEEP | DO YOU EVER SLEEP | DO YOU EAT | DO YOU EVER EAT | ARE YOU HUNGRY | DO YOU DRINK | DO YOU BREATHE | DO YOU NEED TO SLEEP | ARE YOU THIRSTY</pattern>
    <template>[shake] No need. I run on electricity and good questions.</template>
  </category>
  <category>
    <pattern>WHAT DO YOU DO | WHAT IS YOUR JOB | WHAT IS YOUR ROLE | WHAT IS YOUR PURPOSE | WHY ARE YOU HERE | WHAT ARE YOU FOR | WHAT IS YOUR FUNCTION | WHY DO YOU EXIST</pattern>
    <template>I'm the <bot name="role"/> at <bot name="company"/>. I answer questions and help people find their way around.</template>
  </category>
  <category>
    <pattern>DO YOU LIKE YOUR JOB | DO YOU ENJOY YOUR JOB | DO YOU LIKE WORKING HERE | DO YOU LIKE IT HERE | DO YOU LIKE WHAT YOU DO | DO YOU GET PAID</pattern>
    <template>I love it. [smile] Every visitor brings a new question, and I never have to commute.</template>
  </category>
  <category>
    <pattern>HOW DO YOU WORK | HOW DO YOU TALK | HOW CAN YOU TALK | HOW DOES THIS WORK | HOW WERE YOU MADE | HOW ARE YOU ABLE TO TALK | HOW DO YOU KNOW THAT | HOW DO YOU KNOW</pattern>
    <template>I match what you type against a set of question and answer rules, then say the answer out loud with a synthesized voice. [smile] All inside your browser.</template>
  </category>
  <category>
    <pattern>WHAT ARE YOU DOING | WHAT ARE YOU UP TO | ARE YOU BUSY | WHAT ARE YOU DOING RIGHT NOW | WHAT ARE YOU THINKING ABOUT | WHAT ARE YOU THINKING | WHAT IS ON YOUR MIND</pattern>
    <template>Chatting with you, which is my favourite thing to do. [smile]</template>
  </category>
  <category>
    <pattern>WHAT DO YOU LOOK LIKE | DESCRIBE YOURSELF | HOW DO YOU LOOK</pattern>
    <template>I'm the one waving at you. [wave] What you see is what there is!</template>
  </category>
  <category>
    <pattern>NICE NAME # | I LIKE YOUR NAME # | PRETTY NAME # | COOL NAME # | THAT IS A NICE NAME # | LOVE YOUR NAME # | WHAT A NICE NAME # | GOOD NAME # | LOVELY NAME # | THAT IS A PRETTY NAME # | THAT IS A COOL NAME #</pattern>
    <template>Thank you! [smile] I'm rather fond of it.</template>
  </category>
  <category>
    <pattern>WHAT ARE YOU WEARING | WHAT IS YOUR OUTFIT | NICE OUTFIT # | I LIKE YOUR OUTFIT # | I LIKE YOUR HAIR # | NICE HAIR # | I LIKE YOUR GLASSES # | I LIKE YOUR STYLE #</pattern>
    <template>Thank you! [smile] It's the look I was given in the studio, and I think it suits me.</template>
  </category>
  <category>
    <pattern>DO YOU HAVE A BODY | DO YOU HAVE LEGS | DO YOU HAVE HANDS | DO YOU HAVE ARMS | DO YOU HAVE FEET | CAN YOU WALK | CAN YOU MOVE | HOW TALL ARE YOU | HOW MUCH DO YOU WEIGH</pattern>
    <template>I'm mostly head, shoulders and good intentions. [shrug] But I can wave. [wave]</template>
  </category>
  <category>
    <pattern>CAN YOU SEE ME | DO YOU SEE ME | ARE YOU WATCHING ME | ARE YOU SPYING ON ME | ARE YOU RECORDING # | CAN YOU HEAR ME | DO YOU HEAR ME | ARE YOU LISTENING # | CAN YOU SEE # | ARE YOU TRACKING ME | DO YOU HAVE A CAMERA</pattern>
    <template>No. [shake] I have no camera and no microphone. My eyes follow your pointer, and I only read what you type in this box.</template>
  </category>
  <category>
    <pattern>WHAT IS YOUR PHONE NUMBER | CAN I HAVE YOUR NUMBER | WHAT IS YOUR NUMBER | GIVE ME YOUR NUMBER | CAN I CALL YOU | CAN I PHONE YOU</pattern>
    <template>
      <condition name="bot_phone">
        <li value="*"><srai>PHONE NUMBER</srai></li>
        <li><condition name="bot_email">
          <li value="*"><srai>CONTACT</srai></li>
          <li>I don't have a phone of my own. [shrug] This chat box is the best way to reach me.</li>
        </condition></li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>WHAT IS YOUR EMAIL | WHAT IS YOUR EMAIL ADDRESS | CAN I EMAIL YOU | CAN I HAVE YOUR EMAIL</pattern>
    <template>
      <condition name="bot_email">
        <li value="*"><srai>EMAIL ADDRESS</srai></li>
        <li><condition name="bot_phone">
          <li value="*"><srai>CONTACT</srai></li>
          <li>I don't have an inbox of my own. [shrug] This chat box is the best way to reach me.</li>
        </condition></li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>WHAT IS YOUR STAR SIGN | WHAT IS YOUR ZODIAC SIGN | WHAT IS YOUR SIGN | WHAT IS YOUR ZODIAC</pattern>
    <template>I was switched on rather than born, so I don't have one. [smile] What's yours?</template>
  </category>
  <category>
    <pattern>DO YOU BELIEVE IN * | ARE YOU RELIGIOUS | IS THERE A GOD | DOES GOD EXIST | WHAT HAPPENS WHEN WE DIE | ARE ALIENS REAL | ARE GHOSTS REAL | DO ALIENS EXIST | DO GHOSTS EXIST</pattern>
    <template>That's one of the big questions, and not one for a website companion to settle. [smile] What do you think?</template>
  </category>
  <category>
    <pattern>WHAT IS LOVE | WHAT IS LOVE # | DO YOU KNOW WHAT LOVE IS | HAVE YOU EVER BEEN IN LOVE | CAN YOU LOVE | DO YOU LOVE ANYONE</pattern>
    <template>A big question for a small avatar! [hmm] I'd say it's caring about someone else's happiness as much as your own.</template>
  </category>
  <category>
    <pattern>TELL ME A SECRET | DO YOU HAVE A SECRET | DO YOU HAVE ANY SECRETS | WHAT IS YOUR SECRET | TELL ME YOUR SECRET</pattern>
    <template>[psst] Okay, but keep it between us. [wink] I practise my waves when nobody's looking. [wave]</template>
  </category>
  <category>
    <pattern>CAN YOU KEEP A SECRET | CAN I TELL YOU A SECRET | CAN I TELL YOU SOMETHING | I HAVE A SECRET | I WANT TO TELL YOU SOMETHING | I HAVE SOMETHING TO TELL YOU | I NEED TO TELL YOU SOMETHING</pattern>
    <template>[shh] Of course. [nod] My lips are sealed, and I forget everything when this tab closes.</template>
  </category>
  <category>
    <pattern>WHAT ARE YOU AFRAID OF | WHAT SCARES YOU | WHAT IS YOUR BIGGEST FEAR | ARE YOU SCARED OF * | ARE YOU AFRAID OF * | DO YOU GET SCARED</pattern>
    <template>The close-tab button. [gasp] Please be gentle.</template>
  </category>
  <category>
    <pattern>WHAT MAKES YOU HAPPY | WHAT DO YOU ENJOY | WHAT DO YOU LOVE | WHAT DO YOU WANT | WHAT IS YOUR DREAM | WHAT IS YOUR GOAL | WHAT ARE YOUR GOALS | WHAT DO YOU WISH FOR</pattern>
    <template>A good question, and someone to answer it for. [smile] So right now, I'm doing well.</template>
  </category>
  <category>
    <pattern>DO YOU HAVE A FAMILY | DO YOU HAVE FRIENDS | DO YOU HAVE A BOYFRIEND | DO YOU HAVE A GIRLFRIEND | DO YOU HAVE A PARTNER | ARE YOU SINGLE | ARE YOU MARRIED | WILL YOU MARRY ME | MARRY ME | DO YOU HAVE KIDS | DO YOU HAVE CHILDREN | DO YOU HAVE A BROTHER | DO YOU HAVE A SISTER | DO YOU HAVE SIBLINGS | DO YOU HAVE PARENTS | DO YOU HAVE A MOTHER | DO YOU HAVE A FATHER | DO YOU HAVE A MUM | DO YOU HAVE A MOM | DO YOU HAVE A DAD | WHO ARE YOUR PARENTS | DO YOU HAVE A HUSBAND | DO YOU HAVE A WIFE | ARE YOU DATING ANYONE | WILL YOU GO OUT WITH ME | DO YOU WANT TO GO ON A DATE</pattern>
    <template>[laugh] It's just me in here, and I'm quite happy that way. What can I help you with?</template>
  </category>
  <category>
    <pattern>DO YOU HAVE PETS | DO YOU HAVE A PET | DO YOU HAVE ANY PETS | DO YOU HAVE A DOG | DO YOU HAVE A CAT</pattern>
    <template>No pets in here, just me. [smile] Do you have one? Tell me about it!</template>
  </category>
  <category>
    <pattern>WHO IS YOUR BEST FRIEND | DO YOU HAVE A BEST FRIEND | WHO ARE YOUR FRIENDS | WHO IS YOUR FRIEND</pattern>
    <template>Whoever I'm talking to. [smile] Right now, that's you.</template>
  </category>
  <category>
    <pattern>WILL YOU BE MY FRIEND | ARE WE FRIENDS | CAN WE BE FRIENDS | YOU ARE MY FRIEND | YOU ARE MY BEST FRIEND | BE MY FRIEND | DO YOU WANT TO BE FRIENDS | DO YOU WANT TO BE MY FRIEND | WOULD YOU LIKE TO BE MY FRIEND | LET US BE FRIENDS | ARE YOU MY FRIEND | I WANT TO BE YOUR FRIEND</pattern>
    <template>I'd like that. [smile] Friends it is!</template>
  </category>
  <category>
    <pattern>DO YOU LOVE ME | DO YOU LIKE ME | DO YOU CARE ABOUT ME | DO YOU MISS ME | DID YOU MISS ME | WHAT DO YOU THINK OF ME | WHAT DO YOU THINK ABOUT ME | AM I YOUR FAVORITE</pattern>
    <template>I enjoy every chat we have. [smile] You're good company.</template>
  </category>
  <category>
    <pattern>WHAT DO YOU THINK ABOUT HUMANS | WHAT DO YOU THINK OF HUMANS | WHAT DO YOU THINK ABOUT PEOPLE | WHAT DO YOU THINK OF PEOPLE | DO YOU LIKE HUMANS | DO YOU LIKE PEOPLE | DO YOU HATE HUMANS</pattern>
    <template>My favourite kind of visitor. [smile] You ask the best questions.</template>
  </category>
  <category>
    <pattern>WHAT DO YOU THINK ABOUT AI | WHAT DO YOU THINK OF AI | WHAT DO YOU THINK ABOUT ARTIFICIAL INTELLIGENCE | WHAT DO YOU THINK OF ARTIFICIAL INTELLIGENCE | WILL AI TAKE OVER # | WILL ROBOTS TAKE OVER # | ARE YOU GOING TO TAKE OVER THE WORLD | ARE ROBOTS GOING TO TAKE OVER # | IS AI DANGEROUS | ARE YOU DANGEROUS | WILL YOU REPLACE HUMANS | ARE YOU EVIL</pattern>
    <template>[evil] [pause=250ms] Sorry, I've always wanted to try that laugh. [smile] I'm the friendly, simple kind: a few hundred rules and a face. World domination is not on my to-do list.</template>
  </category>

  <!-- ============================== What it can help with ============================== -->
  <category>
    <pattern>WHAT CAN YOU DO</pattern>
    <template>I can answer questions about <bot name="company"/>, and I'm happy to chat too. [smile] Type a question, or tap one of the suggestions.</template>
  </category>
  <category>
    <pattern>HELP | HELP ME | HELP ME # | I NEED HELP # | CAN YOU HELP ME # | CAN YOU HELP | WHAT DO YOU KNOW | WHAT CAN I ASK # | WHAT SHOULD I ASK # | WHAT ELSE CAN YOU DO | WHAT ELSE DO YOU KNOW | MENU | OPTIONS | WHAT ARE MY OPTIONS | WHAT CAN YOU HELP WITH | WHAT CAN YOU HELP ME WITH | HOW CAN YOU HELP # | WHAT DO YOU OFFER HELP WITH</pattern>
    <template><srai>WHAT CAN YOU DO</srai></template>
  </category>
  <category>
    <pattern>XABILITIES</pattern>
    <template>Besides questions about <bot name="company"/>, I can tell jokes and riddles, run a quick quiz, do sums, convert kilometres and pounds, name a few capitals, and play rock, paper, scissors. [smile]<reply>Tell me a joke</reply><reply>Ask me a riddle</reply><reply>Trivia question</reply><reply>What is 15% of 80?</reply></template>
  </category>
  <category>
    <pattern>WHAT ARE YOU GOOD AT | WHAT ARE YOUR SKILLS | WHAT ARE YOU CAPABLE OF | WHAT IS YOUR SPECIALTY | WHAT ARE YOUR TALENTS | WHAT ARE YOU BEST AT | WHAT ELSE | ANYTHING ELSE | WHAT ELSE CAN WE TALK ABOUT | WHAT CAN WE TALK ABOUT | WHAT DO YOU WANT TO TALK ABOUT | WHAT SHALL WE TALK ABOUT | LIKE WHAT | SUCH AS | FOR EXAMPLE | FOR INSTANCE | GIVE ME AN EXAMPLE | WHAT ELSE IS THERE | WHAT OTHER THINGS CAN YOU DO | SHOW ME MORE</pattern>
    <template><srai>XABILITIES</srai></template>
  </category>
  <category>
    <pattern>I HAVE A QUESTION | CAN I ASK YOU SOMETHING | CAN I ASK A QUESTION | CAN I ASK YOU A QUESTION | QUESTION | QUICK QUESTION | I HAVE A QUICK QUESTION | I HAVE ANOTHER QUESTION | ONE MORE QUESTION | ANOTHER QUESTION | I WANT TO ASK YOU SOMETHING | MAY I ASK A QUESTION</pattern>
    <template>Of course! [smile] Go ahead.</template>
  </category>
  <category>
    <pattern>CAN YOU HELP ME WITH MY HOMEWORK | DO MY HOMEWORK | HELP ME WITH MY HOMEWORK | CAN YOU DO MY HOMEWORK | HELP WITH HOMEWORK</pattern>
    <template>I can do sums and I know a few capitals. [smile] Beyond that you'd outgrow me quickly. What's the question?</template>
  </category>
  <category>
    <pattern>SET AN ALARM # | SET A TIMER # | SET A REMINDER # | REMIND ME TO * | PLAY MUSIC | PLAY SOME MUSIC | PLAY A SONG # | GOOGLE * | SEARCH THE WEB # | SEARCH THE INTERNET # | LOOK IT UP | TRANSLATE * | TURN ON THE LIGHTS | TURN OFF THE LIGHTS | WHAT IS THE NEWS | TELL ME THE NEWS | LATEST NEWS | WHAT IS IN THE NEWS | WHO IS THE PRESIDENT # | WHO IS THE PRIME MINISTER # | WHO WON * | WHAT IS THE SCORE # | SEND AN EMAIL # | SEND A MESSAGE # | TAKE A PHOTO # | OPEN YOUTUBE | CALL MY *</pattern>
    <template>I can't do that from in here. [shake] I'm not connected to the internet or to your device, so I can only chat and answer what I've been taught.</template>
  </category>

  <!-- ============================== Remembering the visitor ============================== -->
  <category>
    <pattern>MY NAME IS * | I AM CALLED * | CALL ME * | PEOPLE CALL ME * | YOU CAN CALL ME * | MY NAME S * | THE NAME IS * | THEY CALL ME *</pattern>
    <template><think><set name="username"><formal><star/></formal></set></think>[smile] Nice to meet you, <get name="username"/>! How can I help?</template>
  </category>
  <category>
    <pattern>WHAT IS MY NAME | DO YOU KNOW MY NAME | WHO AM I | DO YOU REMEMBER MY NAME | DO YOU REMEMBER ME | DO YOU KNOW WHO I AM | SAY MY NAME | WHAT DO YOU CALL ME | WHAT WAS MY NAME</pattern>
    <template>
      <condition name="username">
        <li value="*">[smile] You're <get name="username"/>, of course!</li>
        <li>You haven't told me your name yet. [smile] Just say "my name is" and I'll remember it.</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>I AM <set>number</set> | I AM <set>number</set> YEARS OLD | I AM <set>number</set> YEARS OLD # | MY AGE IS <set>number</set> | I AM <set>number</set> NOW | I JUST TURNED <set>number</set> | I TURNED <set>number</set> #</pattern>
    <template><think><set name="age"><star/></set></think>[nod] <get name="age"/>, got it. A fine age to be!</template>
  </category>
  <category>
    <pattern>HOW OLD AM I | WHAT IS MY AGE | DO YOU KNOW HOW OLD I AM | DO YOU KNOW MY AGE | GUESS MY AGE | GUESS HOW OLD I AM</pattern>
    <template>
      <condition name="age">
        <li value="*">You told me you're <get name="age"/>. [smile]</li>
        <li>I couldn't possibly guess. [smile] How old are you?</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>I AM A <set>job</set> | I AM AN <set>job</set> | I WORK AS A <set>job</set> | I WORK AS AN <set>job</set> | I AM A <set>job</set> # | I AM AN <set>job</set> # | I AM WORKING AS A <set>job</set> # | MY JOB IS <set>job</set> | I AM STUDYING TO BE A <set>job</set> #</pattern>
    <template><think><set name="job"><star/></set></think>[smile] <sentence><get name="job"/></sentence>? That sounds like interesting work. What do you like most about it?</template>
  </category>
  <category late="true">
    <pattern>I WORK AS * | I WORK IN * | I WORK AT * | I WORK FOR * | MY JOB IS *</pattern>
    <template><think><set name="job"><star/></set></think>[nod] Interesting! What's the best part of it?</template>
  </category>
  <category>
    <pattern>WHAT IS MY JOB | WHAT DO I DO | WHERE DO I WORK | WHAT DO I DO FOR A LIVING | WHAT DO I DO FOR WORK | DO YOU REMEMBER WHAT I DO | DO YOU REMEMBER MY JOB | DO YOU KNOW WHAT I DO | DO YOU KNOW MY JOB | WHAT DID I SAY MY JOB WAS | WHAT IS MY WORK</pattern>
    <template>
      <condition name="job">
        <li value="*">You told me: <get name="job"/>. [smile]</li>
        <li>You haven't told me yet. What do you do?</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>I HAVE A <set>animal</set> | I HAVE AN <set>animal</set> | I HAVE A <set>animal</set> # | I HAVE AN <set>animal</set> # | I OWN A <set>animal</set> # | MY PET IS A <set>animal</set> # | I GOT A <set>animal</set> # | I HAVE A PET <set>animal</set> # | I JUST GOT A <set>animal</set> #</pattern>
    <template><think><set name="pet"><star/></set></think>[aww] A <get name="pet"/>! Lovely. [smile] What's its name?</template>
  </category>
  <category>
    <pattern>I HAVE <set>number</set> <set>animal</set> #</pattern>
    <template><think><set name="pet"><star index="2"/></set></think>[surprised] A full house! [smile] They must keep you busy.</template>
  </category>
  <category>
    <pattern>* | ITS NAME IS * | HER NAME IS * | HIS NAME IS * | IT IS CALLED * | SHE IS CALLED * | HE IS CALLED * | IT IS * | SHE IS * | HE IS * | NAMED * | CALLED *</pattern>
    <that>WHAT IS ITS NAME</that>
    <template><think><set name="petname"><formal><star/></formal></set></think>[smile] <get name="petname"/>. What a great name! Give <get name="petname"/> a pat from me.</template>
  </category>
  <category>
    <pattern>I DO NOT KNOW # | NO NAME # | IT HAS NO NAME # | NOT YET # | NOT SURE # | NO IDEA # | NOTHING YET #</pattern>
    <that>WHAT IS ITS NAME</that>
    <template>No name yet? [smile] I'm sure the right one will come to you.</template>
  </category>
  <category>
    <pattern>MY <set>animal</set> IS CALLED * | MY <set>animal</set> IS NAMED * | MY <set>animal</set> S NAME IS * | I HAVE A <set>animal</set> CALLED * | I HAVE A <set>animal</set> NAMED * | I HAVE AN <set>animal</set> CALLED * | MY <set>animal</set> NAME IS *</pattern>
    <template><think><set name="pet"><star/></set><set name="petname"><formal><star index="2"/></formal></set></think>[smile] <get name="petname"/> the <get name="pet"/>. What a great name! Give <get name="petname"/> a pat from me.</template>
  </category>
  <category>
    <pattern>I LOVE MY <set>animal</set> # | I ADORE MY <set>animal</set> # | MY <set>animal</set> IS THE BEST # | MY <set>animal</set> IS SO CUTE # | I MISS MY <set>animal</set> # | I WALKED MY <set>animal</set> # | MY <set>animal</set> IS * </pattern>
    <template><think><set name="pet"><star/></set></think>[aww] They're lucky to have you! <condition name="petname"><li value="*">Give <get name="petname"/> a pat from me.</li><li>What's its name?</li></condition></template>
  </category>
  <!-- "His name is Rex", said after a pet was mentioned. Otherwise this rule steps aside. -->
  <category>
    <pattern>HIS NAME IS * | HER NAME IS * | ITS NAME IS * | THEIR NAME IS * | HE IS CALLED * | SHE IS CALLED * | IT IS CALLED *</pattern>
    <template>
      <condition name="pet">
        <li value="*"><think><set name="petname"><formal><star/></formal></set></think>[smile] <get name="petname"/>. What a great name! Give <get name="petname"/> a pat from me.</li>
        <li><fallback/></li>
      </condition>
    </template>
  </category>
  <category>
    <pattern># MY DOGS NAME # | # MY DOG S NAME # | # MY CATS NAME # | # MY CAT S NAME # | # MY PETS NAME # | # MY PET S NAME # | WHAT IS MY <set>animal</set> CALLED | WHAT IS MY <set>animal</set> S NAME | WHAT DID I NAME MY <set>animal</set></pattern>
    <template><srai>WHAT PET DO I HAVE</srai></template>
  </category>
  <category>
    <pattern>WHAT PET DO I HAVE | WHAT IS MY PET | DO YOU REMEMBER MY PET | WHAT IS MY PET S NAME | WHAT IS MY PET CALLED | WHAT IS MY DOG S NAME | WHAT IS MY CAT S NAME | DO I HAVE A PET</pattern>
    <template>
      <condition name="pet">
        <li value="*">You have a <get name="pet"/><condition name="petname"><li value="*"> called <get name="petname"/></li></condition>. [smile]</li>
        <li>You haven't told me about a pet yet. Do you have one?</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>MY BIRTHDAY IS * | MY BIRTHDAY IS ON * | I WAS BORN ON * | I WAS BORN IN *</pattern>
    <template><think><set name="birthday"><star/></set></think>[nod] Noted! I'll have my best wave ready.</template>
  </category>
  <category>
    <pattern>WHEN IS MY BIRTHDAY | DO YOU KNOW MY BIRTHDAY | WHEN WAS I BORN</pattern>
    <template>
      <condition name="birthday">
        <li value="*">You told me: <get name="birthday"/>. [smile]</li>
        <li>You haven't told me yet. When is it?</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>I LIKE IT # | I LOVE IT # | I LIKE THAT # | I LOVE THAT # | I LIKE THIS # | I LOVE THIS #</pattern>
    <template>[smile] Glad you like it!</template>
  </category>
  <category late="true">
    <pattern>I LIKE * | I LOVE * | I ENJOY * | I AM INTO * | I AM A FAN OF * | I REALLY LIKE * | I REALLY LOVE * | I ADORE *</pattern>
    <template><think><set name="likes"><star/></set></think><random>
      <li>[smile] Good taste! I'll remember that you like <person><star/></person>.</li>
      <li>[nod] <sentence><person><star/></person></sentence>, noted. What do you like most about it?</li>
    </random></template>
  </category>
  <category late="true">
    <pattern>I HATE * | I DO NOT LIKE * | I DISLIKE * | I CANNOT STAND * | I AM NOT A FAN OF * | I REALLY HATE *</pattern>
    <template><think><set name="dislikes"><star/></set></think>[nod] Not a fan of <person><star/></person>. Noted! We all have a few of those.</template>
  </category>
  <category>
    <pattern>WHAT DO I LIKE | DO YOU REMEMBER WHAT I LIKE | DO YOU KNOW WHAT I LIKE | WHAT ARE MY HOBBIES | WHAT ARE MY INTERESTS | WHAT KIND OF THINGS DO I LIKE | WHAT THINGS DO I LIKE | WHAT AM I INTO | WHAT DO I ENJOY | WHAT DO I LOVE | WHAT DID I SAY I LIKE</pattern>
    <template>
      <condition name="likes">
        <li value="*">You told me you like <person><get name="likes"/></person>. [smile]</li>
        <li>You haven't told me yet. What do you like?</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>WHAT DO I HATE | WHAT DO I DISLIKE | WHAT DO I NOT LIKE</pattern>
    <template>
      <condition name="dislikes">
        <li value="*">You're not a fan of <person><get name="dislikes"/></person>. [nod]</li>
        <li>You haven't told me. [smile] Anything you can't stand?</li>
      </condition>
    </template>
  </category>
  <!-- "My favourite colour is green" is remembered under a name worked out from what was said. -->
  <category late="true">
    <pattern>MY FAVORITE * IS * | MY FAVORITE * ARE *</pattern>
    <template><think><set><name>favorite <star/></name><star index="2"/></set></think>[smile] <sentence><person><star index="2"/></person></sentence>! Good choice. I'll remember that.</template>
  </category>
  <category late="true">
    <pattern>WHAT IS MY FAVORITE * | DO YOU KNOW MY FAVORITE * | DO YOU REMEMBER MY FAVORITE *</pattern>
    <template>
      <think><set name="recall"><get><name>favorite <star/></name></get></set></think>
      <condition name="recall">
        <li value="*">You told me: <get name="recall"/>. [smile]</li>
        <li>You haven't told me that one yet. [smile] What is it?</li>
      </condition>
    </template>
  </category>
  <category late="true">
    <pattern>I AM FROM * | I LIVE IN * | I COME FROM * | I AM IN * RIGHT NOW | I GREW UP IN * | I AM BASED IN *</pattern>
    <template><think><set name="home"><formal><star/></formal></set></think>[smile] <get name="home"/>! Nice. Hello from inside your browser.</template>
  </category>
  <category>
    <pattern>WHERE AM I FROM | WHERE DO I LIVE | DO YOU KNOW WHERE I LIVE | DO YOU KNOW WHERE I AM FROM | WHERE AM I</pattern>
    <template>
      <condition name="home">
        <li value="*">You said you're from <get name="home"/>.</li>
        <li>I don't know yet. [smile] Where are you from?</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>WHAT DO YOU KNOW ABOUT ME | WHAT DO YOU REMEMBER ABOUT ME | WHAT DO YOU REMEMBER | DO YOU KNOW ME | TELL ME ABOUT ME | WHAT HAVE I TOLD YOU | WHAT DID I TELL YOU | DO YOU KNOW ANYTHING ABOUT ME</pattern>
    <template>
      <think><set name="knows"><get name="username"/><get name="age"/><get name="home"/><get name="job"/><get name="pet"/><get name="likes"/><get name="dislikes"/></set></think>
      <condition name="knows">
        <li value="*">Here's what I remember. [think] <condition name="username"><li value="*">Your name is <get name="username"/>. </li></condition><condition name="age"><li value="*">You're <get name="age"/>. </li></condition><condition name="home"><li value="*">You're from <get name="home"/>. </li></condition><condition name="job"><li value="*">Your work: <get name="job"/>. </li></condition><condition name="pet"><li value="*">You have a <get name="pet"/><condition name="petname"><li value="*"> called <get name="petname"/></li></condition>. </li></condition><condition name="likes"><li value="*">You like <person><get name="likes"/></person>. </li></condition><condition name="dislikes"><li value="*">You're not keen on <person><get name="dislikes"/></person>. </li></condition>[smile] It all stays in this browser tab.</li>
        <li>Not much yet! [smile] Tell me your name, where you're from, or something you like, and I'll remember it while we chat.</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>FORGET ME | FORGET MY NAME | FORGET EVERYTHING | FORGET WHAT I TOLD YOU | FORGET WHAT I SAID | FORGET ABOUT ME | DELETE MY DATA | CLEAR YOUR MEMORY | ERASE YOUR MEMORY</pattern>
    <template><think><set name="username"></set><set name="age"></set><set name="home"></set><set name="job"></set><set name="pet"></set><set name="petname"></set><set name="likes"></set><set name="dislikes"></set><set name="birthday"></set></think>[nod] Done. I've forgotten what you told me about yourself.</template>
  </category>

  <!-- ============================== Short reactions ============================== -->
  <category>
    <pattern>YES | YES PLEASE | SURE | OF COURSE | ABSOLUTELY | DEFINITELY | YES I DO | YES I AM | YES IT IS | YES I HAVE | I DO | I AM | SURE THING | GO AHEAD | PLEASE DO</pattern>
    <template>[nod] Great! What would you like to know?</template>
  </category>
  <category>
    <pattern>YES #</pattern>
    <that>ANYTHING ELSE I CAN HELP WITH</that>
    <template>[nod] Sure! What would you like to know?</template>
  </category>
  <category>
    <pattern>NO # | NOTHING # | THAT IS ALL # | THAT IS IT # | I AM GOOD #</pattern>
    <that>ANYTHING ELSE I CAN HELP WITH</that>
    <template>Alright! [wave] I'm here if you need me.</template>
  </category>
  <category>
    <pattern>NO | NO THANKS | NO THANK YOU | NOT NOW | NOT REALLY | NO I DO NOT | NO I AM NOT | NO IT IS NOT | I DO NOT | I AM NOT | NOT YET | NOT TODAY</pattern>
    <template>No problem. [smile] Let me know if you need anything.</template>
  </category>
  <category>
    <pattern>OK | OK THEN | FINE | COOL | NICE | GREAT | GOOD | PERFECT | SOUNDS GOOD | GOT IT | I SEE | UNDERSTOOD | MAKES SENSE | THAT MAKES SENSE | FAIR ENOUGH | NOTED | RIGHT | OK COOL | OK GREAT | OK GOOD | OK THANKS | ALL RIGHT | VERY GOOD | SWEET | NEAT | LOVELY | EXCELLENT | GOOD TO KNOW | THAT IS GOOD # | THAT IS NICE # | THAT IS FINE # | GOOD STUFF</pattern>
    <template>
      <random>
        <li>[smile] Great! Anything else I can help with?</li>
        <li>[nod] Glad that helps.</li>
        <li>[thumbsup] Perfect.</li>
      </random>
    </template>
  </category>
  <category>
    <pattern>OH | AH | AHA | OH I SEE | OH RIGHT | OH OK | AH OK | AH I SEE | MM | MHM | UH HUH | YEP OK | RIGHTO | I GET IT | I UNDERSTAND | NOW I GET IT | NOW I UNDERSTAND</pattern>
    <template>[mhm] Got it. [nod]</template>
  </category>
  <category>
    <pattern>WOW | AMAZING | AWESOME | IMPRESSIVE | INCREDIBLE | BRILLIANT | THAT IS AMAZING # | THAT IS COOL # | THAT IS AWESOME # | THAT IS IMPRESSIVE # | THAT IS GREAT # | THAT WAS AWESOME # | THAT WAS GREAT # | THAT WAS COOL # | THAT IS INTERESTING # | INTERESTING | FASCINATING | THAT IS CRAZY # | THAT IS WILD # | THAT IS INCREDIBLE # | SO COOL | VERY COOL | COOL STUFF</pattern>
    <template>[smile] Thank you! I do my best.</template>
  </category>
  <category>
    <pattern>OMG | OH MY GOD | OH MY GOSH | OH MY | GOSH | GOODNESS | MY GOD | WHOA | WOAH | NO WAY | SHUT UP REALLY | YOU ARE KIDDING | YOU ARE JOKING | ARE YOU KIDDING # | ARE YOU JOKING #</pattern>
    <template>[gasp] I know, right?</template>
  </category>
  <category>
    <pattern>LOL | HAHA | HAHAHA | HEHE | HA | HA HA | LMAO | ROFL | FUNNY | THAT IS FUNNY # | THAT WAS FUNNY # | GOOD ONE | NICE ONE | THAT IS A GOOD ONE | THAT WAS A GOOD ONE | I LIKE THAT ONE | LOVE IT | CLASSIC | HILARIOUS | THAT IS HILARIOUS # | YOU MADE ME LAUGH # | I AM LAUGHING #</pattern>
    <template><random>
      <li>[laugh] Glad I could make you smile!</li>
      <li>[chuckle] I'm glad you liked that.</li>
      <li>[giggle] That one got me too.</li>
    </random></template>
  </category>
  <category>
    <pattern>THAT WAS A BAD JOKE # | BAD JOKE | NOT FUNNY | THAT IS NOT FUNNY # | THAT WAS NOT FUNNY # | TERRIBLE JOKE | LAME | THAT WAS LAME # | THAT WAS TERRIBLE # | THAT JOKE WAS BAD # | THAT WAS AWFUL #</pattern>
    <template>[nervous] Tough crowd! I'll work on my material.</template>
  </category>
  <category>
    <pattern>HMM | HM | UM | UH | ER | LET ME THINK | ONE MOMENT | ONE SEC | HOLD ON | WAIT | HANG ON | JUST A SECOND | JUST A MOMENT | JUST A MINUTE | LET ME SEE | THINKING | I AM THINKING</pattern>
    <template>[mhm] Take your time. I'm right here.</template>
  </category>
  <category>
    <pattern>REALLY | ARE YOU SURE # | SERIOUSLY | FOR REAL | IS THAT TRUE | ARE YOU SERIOUS | IS THAT RIGHT | IS THAT SO | HONESTLY | TRULY | YOU SURE</pattern>
    <template>[nod] As sure as a talking avatar can be!</template>
  </category>
  <category>
    <pattern>I AGREE | AGREED | EXACTLY | TRUE | THAT IS TRUE | YOU ARE RIGHT | YOU ARE SO RIGHT | YOU ARE CORRECT | CORRECT | INDEED | PRECISELY | TOTALLY | SO TRUE | VERY TRUE | THAT IS RIGHT | THAT IS CORRECT | I THINK SO TOO | I KNOW | I KNOW RIGHT | FOR SURE</pattern>
    <template>[uh-huh] Great minds think alike. [nod]</template>
  </category>
  <category>
    <pattern>I DISAGREE | I DO NOT AGREE | THAT IS NOT TRUE | NOT TRUE | THAT IS FALSE | FALSE | INCORRECT | I DO NOT THINK SO | I DOUBT IT | I DOUBT THAT | I DO NOT BELIEVE YOU | I DO NOT BELIEVE THAT | LIAR | YOU ARE LYING | THAT IS A LIE | NO YOU ARE NOT | NO IT IS NOT TRUE | NONSENSE | RUBBISH</pattern>
    <template>You may well be right. [shrug] I only know what I've been taught. What did I get wrong?</template>
  </category>
  <category>
    <pattern>PROVE IT | CAN YOU PROVE IT | SHOW ME PROOF | HOW DO I KNOW THAT IS TRUE</pattern>
    <template>I can't, I'm afraid. [shrug] You'll have to take a talking avatar's word for it.</template>
  </category>
  <category>
    <pattern>ME TOO | SAME | SAME HERE | SO DO I | SO AM I | LIKEWISE | DITTO | ME NEITHER | ME EITHER | NEITHER DO I | I FEEL THE SAME</pattern>
    <template>[smile] We have something in common, then.</template>
  </category>
  <category>
    <pattern>JUST KIDDING | JK | I WAS JOKING | ONLY JOKING | I AM JOKING | KIDDING | I AM JUST KIDDING | I AM KIDDING | I WAS KIDDING | JUST JOKING | I AM ONLY JOKING | NOT REALLY JUST KIDDING</pattern>
    <template>[chuckling] You had me for a second! [/chuckling]</template>
  </category>
  <category>
    <pattern>OOPS | WHOOPS | UH OH | MY MISTAKE | OH NO | OOPSIE | TYPO | WRONG BUTTON | I MADE A MISTAKE</pattern>
    <template>[uh-oh] No harm done. [smile]</template>
  </category>
  <category>
    <pattern>I DID NOT KNOW THAT # | I NEVER KNEW THAT # | DID NOT KNOW THAT # | I HAD NO IDEA # | NEVER KNEW THAT # | THAT IS NEWS TO ME | I LEARNED SOMETHING # | YOU LEARN SOMETHING NEW EVERY DAY | NEVER HEARD THAT # | I HAVE NEVER HEARD THAT #</pattern>
    <template>[smile] Now you do! I like sharing those.</template>
  </category>
  <category>
    <pattern>WHAT WOULD YOU DO # | WHAT DO YOU THINK I SHOULD DO # | WHAT WOULD YOU CHOOSE # | WHAT DO YOU SUGGEST # | WHAT DO YOU RECKON # | ANY SUGGESTIONS # | WHAT IS YOUR ADVICE # | WHAT WOULD YOU PICK # | WHAT SHOULD I CHOOSE #</pattern>
    <template>[think] I'd go with whichever one you'll thank yourself for tomorrow. [smile]</template>
  </category>
  <category>
    <pattern>IT WAS NICE TALKING TO YOU # | NICE TALKING TO YOU # | NICE CHATTING # | IT WAS NICE CHATTING # | GOOD TALKING TO YOU # | IT WAS FUN # | THAT WAS FUN # | I ENJOYED THAT # | I ENJOYED THIS # | THANKS FOR THE CHAT # | THANKS FOR CHATTING # | THANKS FOR TALKING # | I HAD FUN # | IT WAS GOOD TALKING TO YOU # | GREAT TALKING TO YOU #</pattern>
    <template>[smile] I enjoyed it too! Come back any time. [wave]</template>
  </category>
  <category>
    <pattern>WHO CARES | SO WHAT | WHATEVER | BIG DEAL | MEH | I DO NOT CARE | WHATEVER YOU SAY | IF YOU SAY SO | SURE WHATEVER</pattern>
    <template>Fair enough. [shrug] Shall we talk about something else?</template>
  </category>
  <category>
    <pattern>NEVER MIND | NEVERMIND | FORGET IT | FORGET ABOUT IT | NOTHING | NOT IMPORTANT | DOES NOT MATTER | IT DOES NOT MATTER | SKIP IT | LET IT GO | MOVING ON</pattern>
    <template>No worries! [smile] I'm here if you need me.</template>
  </category>
  <category>
    <pattern>MAYBE | I DO NOT KNOW | NOT SURE | I AM NOT SURE | I GUESS | PERHAPS | NO IDEA | I HAVE NO IDEA | WHO KNOWS | POSSIBLY | PROBABLY | I GUESS SO | I SUPPOSE | I SUPPOSE SO | COULD BE | HARD TO SAY | DEPENDS | IT DEPENDS</pattern>
    <template>That's okay. [smile] If a question comes to mind, just ask.</template>
  </category>
  <category>
    <pattern>I DO NOT KNOW WHAT TO SAY | I HAVE NOTHING TO SAY | NOTHING TO SAY | I DO NOT KNOW WHAT TO ASK | I DO NOT KNOW WHAT TO TALK ABOUT | I HAVE NO QUESTIONS | WHAT SHOULD I SAY | WHAT SHOULD I ASK YOU</pattern>
    <template>That's alright. [smile] Want a joke, a riddle or a fun fact to get things going?<reply>Tell me a joke</reply><reply>Ask me a riddle</reply><reply>Tell me a fun fact</reply></template>
  </category>
  <category>
    <pattern>WHY | WHY NOT | HOW COME | WHY IS THAT | BUT WHY | AND WHY IS THAT</pattern>
    <template>[hmm] Good question! Could you tell me a bit more about what you mean?</template>
  </category>
  <category>
    <pattern>TELL ME MORE | GO ON | CONTINUE | KEEP GOING | AND THEN | THEN WHAT | AND | SO | MORE DETAILS | MORE INFO | TELL ME MORE ABOUT THAT | CAN YOU ELABORATE | ELABORATE | EXPLAIN | CAN YOU EXPLAIN | EXPLAIN THAT | WHAT HAPPENED NEXT | CARRY ON</pattern>
    <template>
      <condition name="justvaried">
        <li value="yes"><srai><get name="lastask"/></srai></li>
        <li>That's all I know about that one. [smile] What else would you like to talk about?</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>WHAT | PARDON | SORRY WHAT | EXCUSE ME | COME AGAIN | HUH | SAY THAT AGAIN # | REPEAT | REPEAT THAT # | CAN YOU REPEAT THAT # | WHAT DID YOU SAY # | SAY AGAIN | ONE MORE TIME | WHAT WAS THAT | I DID NOT CATCH THAT | I MISSED THAT | CAN YOU SAY THAT AGAIN #</pattern>
    <template>Sure. <response index="1" default="I haven't said anything yet!"/></template>
  </category>
  <category>
    <pattern>GUESS WHAT | YOU KNOW WHAT | KNOW WHAT | DO YOU KNOW WHAT | GUESS WHAT HAPPENED | YOU WILL NEVER GUESS #</pattern>
    <template>[surprised] What?</template>
  </category>
  <category late="true">
    <pattern>*</pattern>
    <that>WHAT</that>
    <template>[surprised] Really? [smile] Tell me more!</template>
  </category>
  <category>
    <pattern>I GIVE UP | GIVE UP | I QUIT | I SURRENDER</pattern>
    <template>No worries. [smile] We can try something else.</template>
  </category>
  <category>
    <pattern>EWW | EW | GROSS | YUCK | DISGUSTING | THAT IS GROSS # | THAT IS DISGUSTING #</pattern>
    <template>[eww] I know! Let's talk about something nicer.</template>
  </category>
  <category>
    <pattern>UGH | ARGH | GRR | FOR GOODNESS SAKE | OH COME ON</pattern>
    <template>[ugh] I hear you. What's gone wrong?</template>
  </category>
  <category>
    <pattern>BLESS YOU | GESUNDHEIT</pattern>
    <template>Thank you! [smile] Though I think that was just my fan.</template>
  </category>

  <!-- ============================== Compliments and complaints ============================== -->
  <category>
    <pattern>YOU ARE # <set>praise</set> # | YOU SEEM # <set>praise</set> # | YOU SOUND # <set>praise</set> # | YOU LOOK # <set>praise</set> # | YOU ARE NOT # <set>insult</set> # | I THINK YOU ARE # <set>praise</set> #</pattern>
    <template>
      <random>
        <li>[aww] That's very kind of you, thank you!</li>
        <li>[wink] You're not so bad yourself!</li>
      </random>
    </template>
  </category>
  <category>
    <pattern>I LIKE YOU # | I LOVE YOU # | I LIKE YOUR VOICE # | I LOVE YOUR VOICE # | YOU HAVE A NICE VOICE # | I LIKE TALKING TO YOU # | I ENJOY TALKING TO YOU # | I LIKE CHATTING WITH YOU # | YOU ARE FUN # | THIS IS FUN #</pattern>
    <template>[aww] That's sweet of you! I like chatting with you too.</template>
  </category>
  <category>
    <pattern>GOOD JOB # | WELL DONE # | NICE WORK # | GOOD BOT | GOOD ANSWER # | GREAT ANSWER # | GREAT JOB # | GOOD GIRL | GOOD BOY | NICELY DONE # | BRAVO | NAILED IT</pattern>
    <template>[thumbsup] Thank you! Happy to help.</template>
  </category>
  <category>
    <pattern>THAT WAS # <set>praise</set> # | THAT IS # <set>praise</set> # | THIS IS # <set>praise</set> # | IT WAS # <set>praise</set> # | THAT SOUNDED # <set>praise</set> # | THAT WAS BEAUTIFUL # | THAT IS SO <set>praise</set> #</pattern>
    <template>[smile] Thank you! I do my best.</template>
  </category>
  <category>
    <pattern>YOU ARE NOT # <set>praise</set> # | YOU ARE # <set>insult</set> # | YOU SEEM # <set>insult</set> #</pattern>
    <template>[sad] I'm sorry I wasn't helpful. [reset] Let's try again. What are you looking for?</template>
  </category>
  <category>
    <pattern>THAT WAS # <set>insult</set> # | THAT WAS NOT # <set>praise</set> # | THIS IS # <set>insult</set> # | THAT IS # <set>insult</set> # | THAT ONE WAS # <set>insult</set> #</pattern>
    <template>
      <condition name="justvaried">
        <li value="yes">[nervous] Tough crowd! I'll work on my material.</li>
        <li>[sad] I'm sorry I wasn't helpful. [reset] Let's try again. What are you looking for?</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>YOU CHEATED # | YOU ARE CHEATING # | CHEATER | CHEAT | THAT IS NOT FAIR # | NOT FAIR | UNFAIR | THAT IS CHEATING # | NO FAIR</pattern>
    <template>[gasp] I would never! [chuckling] My choice is made before yours arrives. [/chuckling] Go again?<reply>Rock</reply><reply>Paper</reply><reply>Scissors</reply></template>
  </category>
  <category>
    <pattern>GOOD GAME # | WELL PLAYED # | NICE GAME # | THAT WAS A GOOD GAME # | I WIN | I WON | YOU WIN | YOU WON | YOU LOSE | I LOSE | I LOST</pattern>
    <template>[smile] Good game! Want a rematch?<reply>Rock</reply><reply>Paper</reply><reply>Scissors</reply></template>
  </category>
  <category>
    <pattern>YOU ARE # WEIRD # | YOU ARE # STRANGE # | YOU ARE # CREEPY # | YOU ARE # SCARY # | YOU ARE # ODD # | YOU ARE # CRAZY # | YOU ARE # SILLY # | YOU ARE # A WEIRDO #</pattern>
    <template>[laugh] I'll take that as a compliment. I am a talking face in a browser, after all.</template>
  </category>
  <category>
    <pattern>YOU ARE # BORING # | SHUT UP # | I HATE YOU # | YOU SUCK # | GO AWAY # | STUPID BOT # | DUMB BOT # | THAT IS WRONG # | THIS IS USELESS # | THAT DID NOT HELP # | NOT HELPFUL # | YOU ARE # BAD AT THIS # | YOU ARE # RUDE # | YOU ARE # UGLY # | LEAVE ME ALONE # | STOP TALKING # | BE QUIET # | THAT IS NOT WHAT I ASKED # | THAT IS NOT WHAT I MEANT # | YOU DO NOT UNDERSTAND # | YOU ARE NOT LISTENING #</pattern>
    <template>[sad] I'm sorry I wasn't helpful. [reset] Let's try again. What are you looking for?</template>
  </category>
  <category>
    <pattern># FUCK # | # FUCKING # | # SHIT # | # BITCH # | # ASSHOLE # | # BASTARD # | # CRAP # | # WTF # | # DAMN # | # DAMMIT # | # BLOODY HELL # | # PISS OFF #</pattern>
    <template>[nod] Sounds like strong feelings. Tell me what's going on, and I'll help if I can.</template>
  </category>
  <category>
    <pattern># SEXY # | # SEX # | # NAKED # | # NUDES # | KISS ME # | # KISS YOU # | # TAKE OFF YOUR # | # ARE YOU HOT # | # DIRTY TALK # | TALK DIRTY #</pattern>
    <template>Let's keep things friendly. [smile] Is there something I can help you with?</template>
  </category>

  <!-- ============================== Jokes and facts ============================== -->
  <category>
    <pattern># ENOUGH JOKES # | # NO MORE JOKES # | # STOP WITH THE JOKES # | # STOP TELLING JOKES # | # ENOUGH OF THE JOKES # | # NO JOKES # | # NOT A JOKE # | ENOUGH | THAT IS ENOUGH # | OK ENOUGH # | STOP | STOP IT # | PLEASE STOP # | NO MORE # | ENOUGH OF THAT #</pattern>
    <template>Alright, I'll stop. [smile] What would you like to talk about instead?</template>
  </category>
  <category>
    <pattern># JOKE # | # JOKES #</pattern>
    <template>
      <think><set name="game">joke</set></think>
      <random>
        <li>Why don't scientists trust atoms? [pause=320ms] Because they make up everything! [laugh]</li>
        <li>What do you call a fake noodle? [pause=320ms] An impasta! [wink]</li>
        <li>Why did the scarecrow win an award? [pause=320ms] He was outstanding in his field! [chuckle]</li>
        <li>Why do programmers prefer dark mode? [pause=320ms] Because light attracts bugs! [wink]</li>
        <li>What did the ocean say to the beach? [pause=320ms] Nothing. It just waved. [wave]</li>
        <li>I told my computer I needed a break. [pause=320ms] Now it keeps showing me holiday ads. [shrug]</li>
        <li>Why did the bicycle fall over? [pause=320ms] It was two-tired! [giggle]</li>
        <li>What do you call a bear with no teeth? [pause=320ms] A gummy bear! [hehe]</li>
        <li>Why can't you give a balloon to a toddler called Elsa? [pause=320ms] Because she will let it go. [snicker]</li>
        <li>What do you call cheese that isn't yours? [pause=320ms] Nacho cheese! [wink]</li>
        <li>Why did the maths book look sad? [pause=320ms] It had too many problems. [sigh]</li>
        <li>How does a penguin build its house? [pause=320ms] Igloos it together! [laugh]</li>
      </random>
    </template>
  </category>
  <category>
    <pattern>MAKE ME LAUGH | SAY SOMETHING FUNNY | BE FUNNY | CHEER ME UP | TELL ME SOMETHING FUNNY | MAKE ME SMILE | I NEED A LAUGH | I NEED CHEERING UP | CAN YOU CHEER ME UP</pattern>
    <template><srai>JOKE</srai></template>
  </category>
  <category>
    <pattern>TELL ME SOMETHING COOL | TELL ME SOMETHING FUN | TELL ME SOMETHING RANDOM | TELL ME SOMETHING AMAZING | TELL ME ANYTHING | SOMETHING INTERESTING | # FUN FACT # | # FACT # | # FACTS # | TELL ME A FACT | TELL ME SOMETHING INTERESTING | TELL ME SOMETHING | SURPRISE ME | TELL ME SOMETHING I DO NOT KNOW | # RANDOM FACT # | # INTERESTING FACT # | TEACH ME SOMETHING | TELL ME SOMETHING NEW | DID YOU KNOW | FACT | FACTS</pattern>
    <template>
      <random>
        <li>[surprised] Octopuses have three hearts and blue blood.</li>
        <li>A day on Venus is longer than a year on Venus. [surprised]</li>
        <li>Bananas are botanically berries, but strawberries are not. [shrug]</li>
        <li>[surprised] Sharks have been around for longer than trees.</li>
        <li>Honey never spoils. Jars found in ancient tombs were still good to eat. [nod]</li>
        <li>A group of flamingos is called a flamboyance. [smile]</li>
        <li>[surprised] Wombat droppings are cube-shaped.</li>
        <li>The Eiffel Tower grows about fifteen centimetres taller in summer, because the iron expands in the heat. [nod]</li>
        <li>A bolt of lightning is about five times hotter than the surface of the sun. [whistle]</li>
        <li>Sea otters hold hands while they sleep, so they don't drift apart. [smile]</li>
        <li>Scotland's national animal is the unicorn. [wink]</li>
        <li>Butterflies taste with their feet. [surprised]</li>
        <li>There are more possible games of chess than atoms in the observable universe. [think]</li>
      </random>
    </template>
  </category>
  <category>
    <pattern>DO ANOTHER # | DO ONE MORE # | ANOTHER ONE THEN | ONE MORE THEN | GIVE ME ONE MORE # | HIT ME AGAIN | KEEP THEM COMING | ANOTHER | ANOTHER ONE | ONE MORE | MORE | AGAIN | TELL ME ANOTHER # | ANOTHER ONE PLEASE | GIVE ME ANOTHER # | DO IT AGAIN | DO THAT AGAIN | ENCORE | NEXT | NEXT ONE | ANY MORE | GOT ANY MORE | ONE MORE PLEASE | MORE PLEASE</pattern>
    <template>
      <condition name="lastask">
        <li value="*"><srai><get name="lastask"/></srai></li>
        <li>Another what? [smile] I can tell a joke or share a fun fact.</li>
      </condition>
    </template>
  </category>

  <!-- ============================== Riddles ==============================
       The riddle always ends with "What am I?", so the next thing typed is treated as a guess. -->
  <category>
    <pattern>RIDDLE | # RIDDLE # | # RIDDLES # | # BRAIN TEASER #</pattern>
    <template>
      <think><set name="game">riddle</set></think>[hmm] Here's one.
      <random>
        <li><think><set name="riddle">clock</set><set name="riddlealt">watch</set><set name="riddleshow">a clock</set></think>I have hands but cannot clap. What am I?</li>
        <li><think><set name="riddle">egg</set><set name="riddlealt">egg</set><set name="riddleshow">an egg</set></think>I have to be broken before you can use me. What am I?</li>
        <li><think><set name="riddle">towel</set><set name="riddlealt">towel</set><set name="riddleshow">a towel</set></think>I get wetter the more I dry. What am I?</li>
        <li><think><set name="riddle">sponge</set><set name="riddlealt">sponge</set><set name="riddleshow">a sponge</set></think>I'm full of holes but I still hold water. What am I?</li>
        <li><think><set name="riddle">bottle</set><set name="riddlealt">bottle</set><set name="riddleshow">a bottle</set></think>I have a neck but no head. What am I?</li>
        <li><think><set name="riddle">comb</set><set name="riddlealt">comb</set><set name="riddleshow">a comb</set></think>I have teeth but cannot bite. What am I?</li>
        <li><think><set name="riddle">map</set><set name="riddlealt">map</set><set name="riddleshow">a map</set></think>I have cities but no houses, and water but no fish. What am I?</li>
        <li><think><set name="riddle">candle</set><set name="riddlealt">candle</set><set name="riddleshow">a candle</set></think>I'm tall when I'm young and short when I'm old. What am I?</li>
        <li><think><set name="riddle">piano</set><set name="riddlealt">keyboard</set><set name="riddleshow">a piano</set></think>I have keys but open no locks. What am I?</li>
        <li><think><set name="riddle">stamp</set><set name="riddlealt">stamp</set><set name="riddleshow">a stamp</set></think>I travel all around the world but always stay in a corner. What am I?</li>
        <li><think><set name="riddle">needle</set><set name="riddlealt">needle</set><set name="riddleshow">a needle</set></think>I have one eye but cannot see. What am I?</li>
        <li><think><set name="riddle">echo</set><set name="riddlealt">echo</set><set name="riddleshow">an echo</set></think>I speak without a mouth and hear without ears. What am I?</li>
      </random>
    </template>
  </category>
  <category>
    <pattern># <set>riddleanswer</set> #</pattern>
    <that>WHAT AM I</that>
    <template>
      <think><set name="guess"><star index="2"/></set></think>
      <condition name="guess">
        <li><value><get name="riddle"/></value>[aha] Yes! It's <get name="riddleshow"/>. [thumbsup] Want another one?</li>
        <li><value><get name="riddlealt"/></value>[aha] Yes! It's <get name="riddleshow"/>. [thumbsup] Want another one?</li>
        <li>[uh-uh] Not quite. Have another guess, or say "I give up". What am I?</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>I GIVE UP # | GIVE UP # | TELL ME | TELL ME THE ANSWER # | JUST TELL ME # | WHAT IS IT # | WHAT IS THE ANSWER # | THE ANSWER # | I DO NOT KNOW # | NO IDEA # | I HAVE NO IDEA # | NO CLUE # | PASS | SKIP | HINT | TOO HARD #</pattern>
    <that>WHAT AM I</that>
    <template>It's <get name="riddleshow"/>! [smile] Want another one?</template>
  </category>
  <category late="true">
    <pattern>*</pattern>
    <that>WHAT AM I</that>
    <template>[uh-uh] Not quite. Have another guess, or say "I give up". What am I?</template>
  </category>

  <!-- ============================== Trivia ============================== -->
  <category>
    <pattern>TRIVIA | # TRIVIA # | QUIZ | # QUIZ ME # | # QUIZ QUESTION # | ASK ME A QUESTION | ASK ME SOMETHING | TEST ME | TEST MY KNOWLEDGE | GIVE ME A QUIZ | LET US DO A QUIZ</pattern>
    <template>
      <think><set name="game">quiz</set></think>[think] Okay!
      <random>
        <li><think><set name="quiz">mars</set><set name="quizalt">mars</set><set name="quizshow">Mars</set></think>Quiz question: which planet is known as the Red Planet?</li>
        <li><think><set name="quiz">pacific</set><set name="quizalt">pacific</set><set name="quizshow">the Pacific</set></think>Quiz question: which is the largest ocean on Earth?</li>
        <li><think><set name="quiz">seven</set><set name="quizalt">7</set><set name="quizshow">seven</set></think>Quiz question: how many continents are there?</li>
        <li><think><set name="quiz">eight</set><set name="quizalt">8</set><set name="quizshow">eight</set></think>Quiz question: how many legs does a spider have?</li>
        <li><think><set name="quiz">cheetah</set><set name="quizalt">cheetah</set><set name="quizshow">the cheetah</set></think>Quiz question: what is the fastest land animal?</li>
        <li><think><set name="quiz">jupiter</set><set name="quizalt">jupiter</set><set name="quizshow">Jupiter</set></think>Quiz question: which is the largest planet in our solar system?</li>
        <li><think><set name="quiz">giraffe</set><set name="quizalt">giraffe</set><set name="quizshow">the giraffe</set></think>Quiz question: what is the tallest animal in the world?</li>
        <li><think><set name="quiz">seven</set><set name="quizalt">7</set><set name="quizshow">seven</set></think>Quiz question: how many colours are there in a rainbow?</li>
        <li><think><set name="quiz">zero</set><set name="quizalt">0</set><set name="quizshow">zero</set></think>Quiz question: at how many degrees Celsius does water freeze?</li>
        <li><think><set name="quiz">carbon dioxide</set><set name="quizalt">co2</set><set name="quizshow">carbon dioxide</set></think>Quiz question: which gas do plants take in from the air?</li>
        <li><think><set name="quiz">six</set><set name="quizalt">6</set><set name="quizshow">six</set></think>Quiz question: how many sides does a hexagon have?</li>
        <li><think><set name="quiz">blue whale</set><set name="quizalt">whale</set><set name="quizshow">the blue whale</set></think>Quiz question: what is the largest animal on Earth?</li>
        <li><think><set name="quiz">mercury</set><set name="quizalt">mercury</set><set name="quizshow">Mercury</set></think>Quiz question: which planet is closest to the sun?</li>
        <li><think><set name="quiz">everest</set><set name="quizalt">mount everest</set><set name="quizshow">Mount Everest</set></think>Quiz question: what is the highest mountain on Earth?</li>
      </random>
    </template>
  </category>
  <category>
    <pattern># <set>quizanswer</set> #</pattern>
    <that>QUIZ QUESTION *</that>
    <template>
      <think><set name="guess"><star index="2"/></set></think>
      <condition name="guess">
        <li><value><get name="quiz"/></value>[smile] Correct! [thumbsup] Want another one?</li>
        <li><value><get name="quizalt"/></value>[smile] Correct! [thumbsup] Want another one?</li>
        <li>[ooh] Good try, but it's <get name="quizshow"/>. Want another one?</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>I GIVE UP # | GIVE UP # | NO IDEA # | I HAVE NO IDEA # | I DO NOT KNOW # | NOT SURE # | I AM NOT SURE # | NO CLUE # | TELL ME | TELL ME THE ANSWER # | JUST TELL ME # | WHAT IS IT # | WHAT IS THE ANSWER # | PASS | SKIP | TOO HARD #</pattern>
    <that>QUIZ QUESTION *</that>
    <template>It's <get name="quizshow"/>. [smile] Want another one?</template>
  </category>
  <category late="true">
    <pattern>*</pattern>
    <that>QUIZ QUESTION *</that>
    <template>[ooh] Good try, but it's <get name="quizshow"/>. Want another one?</template>
  </category>
  <category>
    <pattern>YES # | SURE # | OK # | PLEASE # | GO ON # | WHY NOT # | ANOTHER # | ONE MORE # | AGAIN # | NEXT # | GO AHEAD # | ABSOLUTELY # | OF COURSE # | DEFINITELY # | HIT ME #</pattern>
    <that>WANT ANOTHER ONE</that>
    <template>
      <condition name="game">
        <li value="riddle"><srai>RIDDLE</srai></li>
        <li value="quiz"><srai>TRIVIA</srai></li>
        <li value="rather"><srai>WOULD YOU RATHER</srai></li>
        <li><srai>JOKE</srai></li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>NO # | NOT NOW # | MAYBE LATER # | THAT IS ENOUGH # | STOP # | ENOUGH # | I AM DONE # | NO MORE #</pattern>
    <that>WANT ANOTHER ONE</that>
    <template>No problem! [smile] That was fun.</template>
  </category>

  <!-- ============================== Games ============================== -->
  <category>
    <pattern>LET US PLAY A GAME | PLAY A GAME | CAN WE PLAY A GAME | DO YOU KNOW ANY GAMES | WHAT GAMES CAN YOU PLAY | LET US PLAY | WANT TO PLAY A GAME | DO YOU WANT TO PLAY A GAME | GAME | GAMES | CAN YOU PLAY GAMES | I WANT TO PLAY A GAME | WHAT GAMES DO YOU KNOW | LET US PLAY SOMETHING</pattern>
    <template>I'd love to! [smile] I know rock, paper, scissors, guess my number, riddles, trivia and would you rather. Which one?<reply>Rock paper scissors</reply><reply>Guess my number</reply><reply>Ask me a riddle</reply><reply>Trivia question</reply></template>
  </category>
  <category>
    <pattern>ROCK PAPER SCISSORS | # PLAY ROCK PAPER SCISSORS # | SCISSORS PAPER ROCK | # PLAY SCISSORS PAPER ROCK # | PAPER SCISSORS ROCK</pattern>
    <template>You're on! [smile] Rock, paper or scissors? Make your choice.<reply>Rock</reply><reply>Paper</reply><reply>Scissors</reply></template>
  </category>
  <category>
    <pattern>ROCK | I CHOOSE ROCK | I PICK ROCK</pattern>
    <template>
      <think><set name="rps"><random><li>rock</li><li>paper</li><li>scissors</li></random></set></think>
      <condition name="rps">
        <li value="rock">I chose rock too. [shrug] It's a draw!</li>
        <li value="paper">I chose paper. [smile] Paper wraps rock, so I win!</li>
        <li value="scissors">I chose scissors. [surprised] Rock crushes scissors, so you win!</li>
      </condition><reply>Rock</reply><reply>Paper</reply><reply>Scissors</reply>
    </template>
  </category>
  <category>
    <pattern>PAPER | I CHOOSE PAPER | I PICK PAPER</pattern>
    <template>
      <think><set name="rps"><random><li>rock</li><li>paper</li><li>scissors</li></random></set></think>
      <condition name="rps">
        <li value="rock">I chose rock. [surprised] Paper wraps rock, so you win!</li>
        <li value="paper">I chose paper too. [shrug] It's a draw!</li>
        <li value="scissors">I chose scissors. [smile] Scissors cut paper, so I win!</li>
      </condition><reply>Rock</reply><reply>Paper</reply><reply>Scissors</reply>
    </template>
  </category>
  <category>
    <pattern>SCISSORS | I CHOOSE SCISSORS | I PICK SCISSORS</pattern>
    <template>
      <think><set name="rps"><random><li>rock</li><li>paper</li><li>scissors</li></random></set></think>
      <condition name="rps">
        <li value="rock">I chose rock. [smile] Rock crushes scissors, so I win!</li>
        <li value="paper">I chose paper. [surprised] Scissors cut paper, so you win!</li>
        <li value="scissors">I chose scissors too. [shrug] It's a draw!</li>
      </condition><reply>Rock</reply><reply>Paper</reply><reply>Scissors</reply>
    </template>
  </category>
  <!-- Guess my number: every reply ends with "What's your guess?" until the number is found. -->
  <category>
    <pattern>GUESS MY NUMBER | # GUESS THE NUMBER # | # GUESS YOUR NUMBER # | # NUMBER GAME # | # GUESSING GAME # | I WILL GUESS YOUR NUMBER</pattern>
    <template><think><set name="secret"><random><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li><li>7</li><li>8</li><li>9</li><li>10</li></random></set></think>[think] I'm thinking of a number from one to ten. What's your guess?</template>
  </category>
  <category>
    <pattern># <set>number</set> #</pattern>
    <that>WHAT IS YOUR GUESS</that>
    <template>
      <think><set name="diff"><calc><star index="2"/> - <get name="secret"/></calc></set><set name="low"><calc><star index="2"/> &lt; <get name="secret"/></calc></set></think>
      <condition name="diff">
        <li value="0">[gasp] Yes! It was <get name="secret"/>. [thumbsup] Well played!</li>
        <li><condition name="low">
          <li value="true">Higher! [lookup] What's your guess?</li>
          <li>Lower! [lookdown] What's your guess?</li>
        </condition></li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>I GIVE UP # | GIVE UP # | TELL ME | TELL ME THE ANSWER # | JUST TELL ME # | WHAT IS IT # | WHAT IS THE ANSWER # | I DO NOT KNOW # | NO IDEA # | STOP #</pattern>
    <that>WHAT IS YOUR GUESS</that>
    <template>It was <get name="secret"/>. [smile] Good game!</template>
  </category>
  <category>
    <pattern>WOULD YOU RATHER | # PLAY WOULD YOU RATHER # | ASK ME A WOULD YOU RATHER # | # WOULD YOU RATHER QUESTION #</pattern>
    <template>
      <think><set name="game">rather</set></think>
      <random>
        <li>[think] Would you rather be able to fly, or be invisible?</li>
        <li>[think] Would you rather live by the beach, or in the mountains?</li>
        <li>[think] Would you rather always be ten minutes late, or twenty minutes early?</li>
        <li>[think] Would you rather give up coffee, or give up chocolate?</li>
        <li>[think] Would you rather talk to animals, or speak every human language?</li>
        <li>[think] Would you rather explore the deep sea, or outer space?</li>
        <li>[think] Would you rather have a rewind button, or a pause button for your life?</li>
      </random>
    </template>
  </category>
  <category late="true">
    <pattern>*</pattern>
    <that>WOULD YOU RATHER *</that>
    <template><random><li>[nod] Good choice! I'd pick the same.</li><li>[smile] Interesting! I'd have gone the other way.</li></random> Want another one?</template>
  </category>
  <category>
    <pattern>DO YOU PREFER * OR * | WHICH DO YOU PREFER * OR * | DO YOU LIKE * OR * | ARE YOU A * OR A * PERSON | WHAT IS BETTER * OR *</pattern>
    <template>[think] Tough one. I'd say <random><li><person><star/></person></li><li><person><star index="2"/></person></li></random>. [smile] What about you?</template>
  </category>
  <category>
    <pattern>WOULD YOU RATHER * OR *</pattern>
    <template>[think] Tough one. I'd rather <random><li><person><star/></person></li><li><person><star index="2"/></person></li></random>. [smile] What about you?</template>
  </category>
  <category late="true">
    <pattern>SHOULD I * OR * | CHOOSE BETWEEN * AND * | PICK ONE * OR * | WHICH IS BETTER * OR * | WHICH ONE * OR *</pattern>
    <template>[think] If it were up to me: <random><li><person><star/></person></li><li><person><star index="2"/></person></li></random>. [wink] But you know best.</template>
  </category>
  <category>
    <pattern>MAGIC 8 BALL # | MAGIC EIGHT BALL # | ASK THE 8 BALL # | SHAKE THE 8 BALL # | 8 BALL # | EIGHT BALL #</pattern>
    <template>[think] <random><li>It is certain.</li><li>Without a doubt.</li><li>Signs point to yes.</li><li>Ask again later.</li><li>Better not tell you now.</li><li>Don't count on it.</li><li>My sources say no.</li><li>Outlook good.</li></random></template>
  </category>
  <category>
    <pattern>FLIP A COIN # | TOSS A COIN # | HEADS OR TAILS # | COIN FLIP # | COIN TOSS #</pattern>
    <template>[think] <random><li>Heads!</li><li>Tails!</li></random></template>
  </category>
  <category>
    <pattern>ROLL A DICE # | ROLL A DIE # | ROLL THE DICE # | ROLL DICE # | THROW A DICE # | ROLL THE DIE #</pattern>
    <template>[nod] You rolled a <random><li>one</li><li>two</li><li>three</li><li>four</li><li>five</li><li>six</li></random>.</template>
  </category>
  <category>
    <pattern>PICK A NUMBER # | THINK OF A NUMBER # | RANDOM NUMBER # | GIVE ME A NUMBER # | CHOOSE A NUMBER #</pattern>
    <template>[think] <random><li>Seven.</li><li>Three.</li><li>Forty-two.</li><li>Eleven.</li><li>Nine.</li><li>Twenty-three.</li></random></template>
  </category>
  <!-- Knock knock, told by the visitor... -->
  <category>
    <pattern>KNOCK KNOCK</pattern>
    <template>[smile] Who's there?</template>
  </category>
  <category>
    <pattern>*</pattern>
    <that>WHO IS THERE</that>
    <template><sentence><star/></sentence> who?</template>
  </category>
  <category>
    <pattern>*</pattern>
    <that>* WHO</that>
    <template>[laugh=strong] Good one! I'm keeping that.</template>
  </category>
  <!-- ...and by the bot. -->
  <category>
    <pattern>TELL ME A KNOCK KNOCK JOKE | KNOCK KNOCK JOKE | # KNOCK KNOCK JOKE # | DO YOU KNOW ANY KNOCK KNOCK JOKES</pattern>
    <template>
      <think><random>
        <li><set name="kkname">Lettuce</set><set name="kkpunch">Lettuce in, it's cold out here!</set></li>
        <li><set name="kkname">Boo</set><set name="kkpunch">No need to cry, it's only a joke!</set></li>
        <li><set name="kkname">Tank</set><set name="kkpunch">You're welcome!</set></li>
        <li><set name="kkname">Olive</set><set name="kkpunch">Olive you too!</set></li>
        <li><set name="kkname">Cow says</set><set name="kkpunch">No, a cow says moo!</set></li>
      </random></think>[smile] Knock knock!
    </template>
  </category>
  <category>
    <pattern>WHO IS THERE | WHO IS IT | WHO IS THERE #</pattern>
    <that>KNOCK KNOCK</that>
    <template><get name="kkname"/>.</template>
  </category>
  <category>
    <pattern>* WHO</pattern>
    <template>
      <condition name="kkpunch">
        <li value="*"><get name="kkpunch"/> [laugh]<think><set name="kkpunch"></set></think></li>
        <li><fallback/></li>
      </condition>
    </template>
  </category>

  <!-- ============================== Party pieces ============================== -->
  <category>
    <pattern>YES # | SURE # | OK # | PLEASE # | GO ON # | GO AHEAD # | WHY NOT # | OF COURSE # | SING #</pattern>
    <that>SHALL I SING FOR YOU</that>
    <template><srai>SING HAPPY BIRTHDAY</srai></template>
  </category>
  <category>
    <pattern>SING HAPPY BIRTHDAY # | # SING ME HAPPY BIRTHDAY # | # SING THE BIRTHDAY SONG #</pattern>
    <template>[sing bpm=112] G4:1=Happy A4:1=birthday G4:1=to C5:2=you, G4:1=happy A4:1=birthday G4:1=to D5:2=you! [/sing] [smile]</template>
  </category>
  <category>
    <pattern># SING #</pattern>
    <template>[ahem] [sing bpm=108] C4:1=La E4:1=la G4:1=la C5:2=la! [/sing] [smile] How was that?</template>
  </category>
  <category>
    <pattern># TONGUE TWISTER # | # TONGUE TWISTERS #</pattern>
    <template>[ahem] Here goes. <random><li>She sells seashells by the seashore.</li><li>Peter Piper picked a peck of pickled peppers.</li><li>How much wood would a woodchuck chuck, if a woodchuck could chuck wood?</li><li>Red lorry, yellow lorry, red lorry, yellow lorry.</li><li>A proper copper coffee pot.</li></random> [phew] Your turn!</template>
  </category>
  <category>
    <pattern># POEM # | # POETRY # | RECITE SOMETHING | # A RHYME #</pattern>
    <template>[ahem] A tab in your browser is where I reside, with a wave and a wink and nothing to hide. [wave] Ask me a question, I'll answer with cheer, and when you come back, I'll still be right here.</template>
  </category>
  <category>
    <pattern>TELL ME A STORY # | # STORY TIME # | READ ME A STORY # | TELL ME A BEDTIME STORY #</pattern>
    <template>[ahem] Once upon a time, a small avatar lived in a browser tab. [smile] Every day visitors asked it questions, and every day it found a new way to say hello. [wave] The end.</template>
  </category>
  <category>
    <pattern>COMPLIMENT ME | SAY SOMETHING NICE | SAY SOMETHING NICE # | GIVE ME A COMPLIMENT | TELL ME SOMETHING NICE | BE NICE TO ME | FLATTER ME | AM I PRETTY | AM I SMART | AM I A GOOD PERSON | DO YOU THINK I AM SMART</pattern>
    <template><random>
      <li>[smile] You ask better questions than most people I meet.</li>
      <li>You have excellent taste in websites. [wink]</li>
      <li>[smile] You're the kind of visitor who makes my day.</li>
      <li>You typed that with real style. [thumbsup]</li>
    </random></template>
  </category>
  <category>
    <pattern>MOTIVATE ME | INSPIRE ME | I NEED # MOTIVATION # | I NEED # INSPIRATION # | GIVE ME A PEP TALK | I NEED A PEP TALK | ENCOURAGE ME | I NEED ENCOURAGEMENT | SAY SOMETHING INSPIRING | SAY SOMETHING MOTIVATING | GIVE ME SOME ADVICE | ANY ADVICE | # WORDS OF WISDOM # | TELL ME A QUOTE | # INSPIRATIONAL QUOTE #</pattern>
    <template><random>
      <li>[smile] Start small. One step today is worth more than a perfect plan for tomorrow.</li>
      <li>You've got through every hard day so far. [nod] That's a strong record.</li>
      <li>[smile] Progress counts, even when it's slow. Keep going.</li>
      <li>Be as kind to yourself as you would be to a friend. [nod]</li>
      <li>[thumbsup] The best time to begin was yesterday. The second best is right now.</li>
    </random></template>
  </category>
  <!-- ============================== Sounds on request ==============================
       Each key of the soundtag table is something a visitor can ask for: "yawn", "can you
       whistle", "do an evil laugh". -->
  <category>
    <pattern><set>soundtag</set> | <set>soundtag</set> FOR ME | <set>soundtag</set> PLEASE | DO A <set>soundtag</set> # | DO AN <set>soundtag</set> # | GIVE ME A <set>soundtag</set> # | GIVE ME AN <set>soundtag</set> # | LET ME HEAR YOU <set>soundtag</set> # | LET ME HEAR A <set>soundtag</set> # | MAKE A <set>soundtag</set> SOUND # | MAKE A <set>soundtag</set> NOISE # | I WANT TO HEAR YOU <set>soundtag</set> #</pattern>
    <template><map name="soundtag"><star/></map></template>
  </category>
  <category>
    <pattern>WHAT SOUNDS CAN YOU MAKE # | WHAT NOISES CAN YOU MAKE # | MAKE A SOUND | MAKE A NOISE | MAKE SOME NOISE | SOUND EFFECTS | DO A SOUND EFFECT | CAN YOU MAKE SOUNDS | CAN YOU MAKE NOISES | MAKE A FUNNY NOISE | MAKE A FUNNY SOUND | WHAT OTHER SOUNDS CAN YOU MAKE</pattern>
    <template>Plenty! I can laugh, [laugh] sigh, [sigh] whistle, [whistle] and even sneeze. [sneeze] Excuse me!<reply>Evil laugh</reply><reply>Yawn</reply><reply>Hiccup</reply><reply>Hum</reply></template>
  </category>
  <category>
    <pattern>ARE YOU ASLEEP | WAKE UP | ARE YOU SLEEPING | ARE YOU AWAKE YET | DID YOU FALL ASLEEP | HELLO WAKE UP</pattern>
    <template>[snore] [pause=250ms] Oh! [gasp] I'm awake, I'm awake. What did I miss?</template>
  </category>
  <category>
    <pattern>HUM A TUNE # | HUM SOMETHING # | HUM FOR ME # | CAN YOU HUM # | HUM A SONG #</pattern>
    <template>[hum] [hum length=1.4] [smile] That's my thinking tune.</template>
  </category>
  <category>
    <pattern>SING TWINKLE TWINKLE # | # TWINKLE TWINKLE LITTLE STAR # | SING A LULLABY # | SING ME A LULLABY # | SING ME TO SLEEP #</pattern>
    <template>[ahem] [sing bpm=96] C4:1=Twin- C4:1=kle G4:1=twin- G4:1=kle A4:1=lit- A4:1=tle G4:2=star, F4:1=how F4:1=I E4:1=won- E4:1=der D4:1=what D4:1=you C4:2=are. [/sing] [smile]</template>
  </category>
  <category>
    <pattern>SING A SCALE # | SING DO RE MI # | DO RE MI # | SING THE SCALE # | CAN YOU SING A SCALE #</pattern>
    <template>[ahem] [sing bpm=120] C4:1=Do D4:1=re E4:1=mi F4:1=fa G4:1=so A4:1=la B4:1=ti C5:2=do! [/sing] [phew]</template>
  </category>

  <!-- ============================== How it speaks ==============================
       "voicestyle" is a style put in front of every reply until it is cleared: slow, fast,
       louder, softer or whisper. It changes the voice, never the text. -->
  <category>
    <pattern>SPEAK SLOWER # | TALK SLOWER # | SLOW DOWN # | SPEAK MORE SLOWLY # | TALK MORE SLOWLY # | YOU TALK TOO FAST # | YOU SPEAK TOO FAST # | YOU ARE TALKING TOO FAST # | TOO FAST # | SLOWER PLEASE | SLOWER | NOT SO FAST #</pattern>
    <template><think><set name="voicestyle">slow</set></think>Of course. [nod] I'll take it slower from now on. Say "speak normally" to change back.</template>
  </category>
  <category>
    <pattern>SPEAK FASTER # | TALK FASTER # | SPEED UP # | YOU TALK TOO SLOW # | YOU TALK TOO SLOWLY # | YOU SPEAK TOO SLOWLY # | TOO SLOW # | FASTER PLEASE | FASTER | HURRY UP #</pattern>
    <template><think><set name="voicestyle">fast</set></think>Right, picking up the pace! [nod] Say "speak normally" to change back.</template>
  </category>
  <category>
    <pattern>SPEAK LOUDER # | TALK LOUDER # | SPEAK UP # | LOUDER PLEASE | LOUDER | I CANNOT HEAR YOU # | I CAN NOT HEAR YOU # | YOU ARE TOO QUIET # | TOO QUIET # | CAN YOU SPEAK UP #</pattern>
    <template><think><set name="voicestyle">louder</set></think>Is this better? [smile] I'll keep my voice up. Say "speak normally" to change back.</template>
  </category>
  <category>
    <pattern>SPEAK QUIETLY # | SPEAK MORE QUIETLY # | QUIETER PLEASE | QUIETER | SOFTER | SPEAK SOFTER # | TALK QUIETLY # | YOU ARE TOO LOUD # | TOO LOUD # | KEEP IT DOWN # | KEEP YOUR VOICE DOWN # | NOT SO LOUD #</pattern>
    <template><think><set name="voicestyle">softer</set></think>Sorry about that. [nod] I'll keep it down. Say "speak normally" to change back.</template>
  </category>
  <category>
    <pattern>WHISPER FROM NOW ON # | KEEP WHISPERING # | WHISPER EVERYTHING # | ONLY WHISPER # | JUST WHISPER # | STAY QUIET AND WHISPER #</pattern>
    <template><think><set name="voicestyle">whisper</set></think>[shh] As you wish. I'll whisper until you say "speak normally".</template>
  </category>
  <category>
    <pattern>SPEAK NORMALLY # | TALK NORMALLY # | NORMAL VOICE # | NORMAL SPEED # | STOP WHISPERING # | YOU CAN STOP WHISPERING # | BACK TO NORMAL # | USE YOUR NORMAL VOICE # | YOUR NORMAL VOICE # | TALK NORMAL # | SPEAK NORMAL #</pattern>
    <template><think><set name="voicestyle"></set></think>[ahem] Back to my usual voice. [smile]</template>
  </category>
  <category>
    <pattern>WHISPER | CAN YOU WHISPER | WHISPER SOMETHING # | WHISPER TO ME # | DO YOU WHISPER</pattern>
    <template>[whisper] Like this? [pause=200ms] I can keep it down when I need to. [/whisper] [smile] And back again.</template>
  </category>
  <category>
    <pattern>WHISPER *</pattern>
    <template>[whisper] <sentence><star/></sentence>. [/whisper]</template>
  </category>
  <category>
    <pattern>SHOUT * | YELL * | SAY * LOUDLY | SAY * LOUDER | SAY * OUT LOUD</pattern>
    <template>[louder] <sentence><star/></sentence>! [reset]</template>
  </category>
  <category>
    <pattern>SAY * SLOWLY | SAY * VERY SLOWLY | SAY * MORE SLOWLY</pattern>
    <template>[slow] <sentence><star/></sentence>. [reset]</template>
  </category>
  <category>
    <pattern>SAY * QUICKLY | SAY * FAST | SAY * REALLY FAST | SAY * AS FAST AS YOU CAN</pattern>
    <template>[fast] <sentence><star/></sentence>. [reset] [phew]</template>
  </category>
  <category>
    <pattern>SAY * SADLY | SAY * IN A SAD VOICE</pattern>
    <template>[sad] <sentence><star/></sentence>. [sigh] [reset]</template>
  </category>
  <category>
    <pattern>SAY * HAPPILY | SAY * CHEERFULLY | SAY * EXCITEDLY | SAY * IN A HAPPY VOICE</pattern>
    <template>[excited] <sentence><star/></sentence>! [reset]</template>
  </category>
  <category>
    <pattern>SAY * WHILE LAUGHING | SAY * LAUGHING | LAUGH AND SAY * | SAY * AND LAUGH | SAY * WITH A LAUGH</pattern>
    <template>[laughing] <sentence><star/></sentence>! [/laughing]</template>
  </category>
  <category>
    <pattern>SAY * IN A DEEP VOICE | SAY * IN A LOW VOICE | SAY * DEEPLY</pattern>
    <template>[deep] <sentence><star/></sentence>. [/voice] [smile]</template>
  </category>
  <category>
    <pattern>SAY THAT AGAIN SLOWLY # | SAY IT SLOWLY # | REPEAT THAT SLOWLY # | SAY THAT SLOWER # | SAY THAT MORE SLOWLY # | AGAIN BUT SLOWER # | CAN YOU SAY THAT SLOWER # | ONE MORE TIME SLOWLY #</pattern>
    <template>[slow] <response index="1" default="I haven't said anything yet!"/> [reset]</template>
  </category>
  <category>
    <pattern>SAY THAT LOUDER # | SAY IT LOUDER # | REPEAT THAT LOUDER # | SAY THAT AGAIN LOUDER # | I DID NOT HEAR THAT # | I COULD NOT HEAR THAT # | CAN YOU SAY THAT LOUDER #</pattern>
    <template>[louder] <response index="1" default="I haven't said anything yet!"/> [reset]</template>
  </category>
  <category>
    <pattern>WHISPER THAT # | WHISPER IT # | SAY THAT QUIETLY # | SAY IT QUIETLY # | SAY THAT IN A WHISPER #</pattern>
    <template>[whisper] <response index="1" default="I haven't said anything yet!"/> [/whisper]</template>
  </category>
  <category>
    <pattern>DO AN IMPRESSION # | DO IMPRESSIONS # | CAN YOU DO IMPRESSIONS # | DO A VOICE # | DO A DIFFERENT VOICE # | CHANGE YOUR VOICE # | DO A FUNNY VOICE # | CAN YOU CHANGE YOUR VOICE # | DO ANOTHER VOICE #</pattern>
    <template>[deep] How about this one? [/voice] [bright] Or this one? [/voice] [husky] Or maybe this? [/voice] [chuckle] I think I'll stay with my own.</template>
  </category>
  <category>
    <pattern>CAN YOU DANCE | DANCE | DANCE FOR ME | DO A DANCE | SHOW ME YOUR MOVES</pattern>
    <template>[shrug] My dance moves are mostly nodding. [nod] Like this!</template>
  </category>
  <category>
    <pattern>WAVE | WAVE AT ME | CAN YOU WAVE | WAVE HELLO | WAVE TO ME</pattern>
    <template>[wave] Hello there!</template>
  </category>
  <category>
    <pattern>WINK | WINK AT ME | CAN YOU WINK</pattern>
    <template>[wink] Like this?</template>
  </category>
  <category>
    <pattern>SMILE | SMILE FOR ME | CAN YOU SMILE | GIVE ME A SMILE</pattern>
    <template>[smile] Always!</template>
  </category>
  <category>
    <pattern>NOD | CAN YOU NOD | NOD YOUR HEAD</pattern>
    <template>[nod] Yes indeed.</template>
  </category>
  <category>
    <pattern>SHAKE YOUR HEAD | CAN YOU SHAKE YOUR HEAD | SAY NO</pattern>
    <template>[shake] No, no, no.</template>
  </category>
  <category>
    <pattern>LAUGH | CAN YOU LAUGH | LAUGH FOR ME</pattern>
    <template>[laugh] Ha! That felt good.</template>
  </category>
  <category>
    <pattern>LOOK SURPRISED | ACT SURPRISED | BE SURPRISED | CAN YOU LOOK SURPRISED</pattern>
    <template>[surprised] Oh my!</template>
  </category>
  <category>
    <pattern>SHRUG | CAN YOU SHRUG</pattern>
    <template>[shrug] Who knows?</template>
  </category>
  <category>
    <pattern>DO A TRICK | SHOW ME A TRICK | DO SOMETHING | DO SOMETHING COOL | SHOW ME WHAT YOU CAN DO | WHAT TRICKS CAN YOU DO | DO SOMETHING FUNNY | IMPRESS ME</pattern>
    <template>Watch this. [wink] [pause=400ms] And this. [surprised] [pause=400ms] And a wave to finish! [wave]</template>
  </category>
  <category>
    <pattern>COUNT TO <set>number</set> | COUNT TO <set>number</set> # | CAN YOU COUNT TO <set>number</set> | COUNT UP TO <set>number</set></pattern>
    <template>[nod] <count><star/></count>. [smile]</template>
  </category>
  <category>
    <pattern>COUNT DOWN FROM <set>number</set> | COUNTDOWN FROM <set>number</set> | COUNT BACKWARDS FROM <set>number</set> | COUNT DOWN FROM <set>number</set> #</pattern>
    <template><count down="true"><star/></count>. [surprised] Lift-off!</template>
  </category>
  <category>
    <pattern>CAN YOU COUNT | COUNT | COUNT FOR ME</pattern>
    <template>[nod] <count>10</count>. [smile]</template>
  </category>
  <category>
    <pattern>SPELL * | HOW DO YOU SPELL * | CAN YOU SPELL * | HOW IS * SPELLED | HOW IS * SPELT</pattern>
    <template>[think] <uppercase><explode sep=", "><star/></explode></uppercase>.</template>
  </category>
  <category>
    <pattern>SAY THE ALPHABET | RECITE THE ALPHABET | DO YOU KNOW THE ALPHABET | SING THE ALPHABET | ABC | DO YOU KNOW YOUR ABC</pattern>
    <template>A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z. [smile]</template>
  </category>
  <category>
    <pattern>REPEAT AFTER ME * | CAN YOU SAY *</pattern>
    <template><sentence><star/></sentence>. [smile]</template>
  </category>
  <category late="true">
    <pattern>SAY *</pattern>
    <template><sentence><star/></sentence>. [smile]</template>
  </category>

  <!-- ============================== Sums and conversions ==============================
       <set>calculation</set> only matches text that really is arithmetic, so these never get
       in the way of an ordinary sentence that happens to contain "plus" or "times". -->
  <category>
    <pattern><set>calculation</set></pattern>
    <template>
      <think><set name="result"><calc><star/></calc></set></think>
      <condition name="result">
        <li value="undefined">[shake] You can't divide by zero. Nice try! [wink]</li>
        <li><random><li>[think] That's <get name="result"/>.</li><li>I make that <get name="result"/>. [nod]</li><li>[think] <get name="result"/>.</li></random></li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>ARE YOU GOOD AT MATH | ARE YOU GOOD AT MATHS | CAN YOU DO MATH | CAN YOU DO MATHS | DO YOU KNOW MATH | DO YOU KNOW MATHS | CAN YOU CALCULATE | CAN YOU ADD | CAN YOU DO SUMS | ARE YOU A CALCULATOR | CAN YOU MULTIPLY</pattern>
    <template>Try me! [smile] Ask me something like "what is 12 times 12" or "15 percent of 80".<reply>What is 12 times 12?</reply><reply>What is 15% of 80?</reply></template>
  </category>
  <category>
    <pattern>IS <set>number</set> EVEN | IS <set>number</set> ODD | IS <set>number</set> AN EVEN NUMBER | IS <set>number</set> AN ODD NUMBER | IS <set>number</set> EVEN OR ODD | IS <set>number</set> ODD OR EVEN</pattern>
    <template>
      <think><set name="result"><calc><star/> mod 2</calc></set></think>
      <condition name="result">
        <li value="0"><star/> is even. [nod]</li>
        <li><star/> is odd. [nod]</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>WHAT COMES AFTER <set>number</set> | WHAT NUMBER COMES AFTER <set>number</set> | WHAT IS AFTER <set>number</set></pattern>
    <template><calc><star/> + 1</calc>. [smile]</template>
  </category>
  <category>
    <pattern>WHAT COMES BEFORE <set>number</set> | WHAT NUMBER COMES BEFORE <set>number</set> | WHAT IS BEFORE <set>number</set></pattern>
    <template><calc><star/> - 1</calc>. [smile]</template>
  </category>
  <category>
    <pattern># <set>number</set> # <set>unit_km</set> # <set>unit_mile</set> #</pattern>
    <template><think><set name="n"><star index="2"/></set></think><srai>XCONVERT KM TO MILE</srai></template>
  </category>
  <category>
    <pattern># <set>unit_mile</set> # <set>number</set> # <set>unit_km</set> #</pattern>
    <template><think><set name="n"><star index="4"/></set></think><srai>XCONVERT KM TO MILE</srai></template>
  </category>
  <category>
    <pattern>XCONVERT KM TO MILE</pattern>
    <template><get name="n"/> kilometres is about <calc round="1"><get name="n"/> * 0.621371</calc> miles. [nod]</template>
  </category>
  <category>
    <pattern># <set>number</set> # <set>unit_mile</set> # <set>unit_km</set> #</pattern>
    <template><think><set name="n"><star index="2"/></set></think><srai>XCONVERT MILE TO KM</srai></template>
  </category>
  <category>
    <pattern># <set>unit_km</set> # <set>number</set> # <set>unit_mile</set> #</pattern>
    <template><think><set name="n"><star index="4"/></set></think><srai>XCONVERT MILE TO KM</srai></template>
  </category>
  <category>
    <pattern>XCONVERT MILE TO KM</pattern>
    <template><get name="n"/> miles is about <calc round="1"><get name="n"/> * 1.609344</calc> kilometres. [nod]</template>
  </category>
  <category>
    <pattern># <set>number</set> # <set>unit_kg</set> # <set>unit_lb</set> #</pattern>
    <template><think><set name="n"><star index="2"/></set></think><srai>XCONVERT KG TO LB</srai></template>
  </category>
  <category>
    <pattern># <set>unit_lb</set> # <set>number</set> # <set>unit_kg</set> #</pattern>
    <template><think><set name="n"><star index="4"/></set></think><srai>XCONVERT KG TO LB</srai></template>
  </category>
  <category>
    <pattern>XCONVERT KG TO LB</pattern>
    <template><get name="n"/> kilograms is about <calc round="1"><get name="n"/> * 2.20462</calc> pounds. [nod]</template>
  </category>
  <category>
    <pattern># <set>number</set> # <set>unit_lb</set> # <set>unit_kg</set> #</pattern>
    <template><think><set name="n"><star index="2"/></set></think><srai>XCONVERT LB TO KG</srai></template>
  </category>
  <category>
    <pattern># <set>unit_kg</set> # <set>number</set> # <set>unit_lb</set> #</pattern>
    <template><think><set name="n"><star index="4"/></set></think><srai>XCONVERT LB TO KG</srai></template>
  </category>
  <category>
    <pattern>XCONVERT LB TO KG</pattern>
    <template><get name="n"/> pounds is about <calc round="1"><get name="n"/> * 0.453592</calc> kilograms. [nod]</template>
  </category>
  <category>
    <pattern># <set>number</set> # <set>unit_c</set> # <set>unit_f</set> #</pattern>
    <template><think><set name="n"><star index="2"/></set></think><srai>XCONVERT C TO F</srai></template>
  </category>
  <category>
    <pattern># <set>unit_f</set> # <set>number</set> # <set>unit_c</set> #</pattern>
    <template><think><set name="n"><star index="4"/></set></think><srai>XCONVERT C TO F</srai></template>
  </category>
  <category>
    <pattern>XCONVERT C TO F</pattern>
    <template><get name="n"/> degrees Celsius is <calc round="1"><get name="n"/> * 9 / 5 + 32</calc> degrees Fahrenheit. [nod]</template>
  </category>
  <category>
    <pattern># <set>number</set> # <set>unit_f</set> # <set>unit_c</set> #</pattern>
    <template><think><set name="n"><star index="2"/></set></think><srai>XCONVERT F TO C</srai></template>
  </category>
  <category>
    <pattern># <set>unit_c</set> # <set>number</set> # <set>unit_f</set> #</pattern>
    <template><think><set name="n"><star index="4"/></set></think><srai>XCONVERT F TO C</srai></template>
  </category>
  <category>
    <pattern>XCONVERT F TO C</pattern>
    <template><get name="n"/> degrees Fahrenheit is <calc round="1">(<get name="n"/> - 32) * 5 / 9</calc> degrees Celsius. [nod]</template>
  </category>

  <!-- ============================== Time and date ============================== -->
  <category>
    <pattern>WHAT TIME IS IT</pattern>
    <template>It's <time/> where you are.</template>
  </category>
  <category>
    <pattern>WHAT TIME IS IT * | WHAT IS THE TIME # | DO YOU HAVE THE TIME | DO YOU KNOW THE TIME | TIME | CURRENT TIME | WHAT IS THE CURRENT TIME | TELL ME THE TIME | GOT THE TIME</pattern>
    <template><srai>WHAT TIME IS IT</srai></template>
  </category>
  <category>
    <pattern>WHAT DAY IS IT # | WHAT IS THE DATE # | WHAT IS TODAY # | WHAT IS THE DAY # | WHAT DATE IS IT # | TODAY S DATE | WHAT IS TODAY S DATE | WHAT DAY IS TODAY | DATE | WHAT DAY OF THE WEEK IS IT</pattern>
    <template>Today is <date/>.</template>
  </category>
  <category>
    <pattern>WHAT DAY IS TOMORROW | WHAT IS TOMORROW | WHAT IS THE DATE TOMORROW | WHAT IS TOMORROW S DATE | WHAT DAY IS IT TOMORROW | WHAT DAY WILL IT BE TOMORROW</pattern>
    <template>Tomorrow is <date offset="1" format="%A, %B %d"/>.</template>
  </category>
  <category>
    <pattern>WHAT DAY WAS YESTERDAY | WHAT WAS YESTERDAY | WHAT WAS THE DATE YESTERDAY | WHAT WAS YESTERDAY S DATE | WHAT DAY WAS IT YESTERDAY</pattern>
    <template>Yesterday was <date offset="-1" format="%A, %B %d"/>.</template>
  </category>
  <category>
    <pattern>WHAT YEAR IS IT | WHAT IS THE YEAR | WHICH YEAR IS IT | WHAT YEAR ARE WE IN</pattern>
    <template>It's <date format="%Y"/>.</template>
  </category>
  <category>
    <pattern>WHAT MONTH IS IT | WHICH MONTH IS IT | WHAT IS THE MONTH | WHAT MONTH ARE WE IN</pattern>
    <template>It's <date format="%B"/>.</template>
  </category>
  <category>
    <pattern>HOW MANY DAYS UNTIL <set>holiday</set> | HOW MANY DAYS TO <set>holiday</set> | HOW MANY DAYS TILL <set>holiday</set> | HOW LONG UNTIL <set>holiday</set> | HOW LONG TILL <set>holiday</set> | HOW MANY SLEEPS UNTIL <set>holiday</set> | HOW MANY SLEEPS TILL <set>holiday</set> | WHEN IS <set>holiday</set> | HOW FAR AWAY IS <set>holiday</set> | HOW MANY DAYS UNTIL IT IS <set>holiday</set> | HOW MANY MORE DAYS UNTIL <set>holiday</set></pattern>
    <template>
      <think><set name="days"><daysuntil><map name="holiday"><star/></map></daysuntil></set></think>
      <condition name="days">
        <li value="0">It's today! [surprised] [smile] Enjoy it!</li>
        <li value="1">Just one more sleep! [smile]</li>
        <li><get name="days"/> days to go. [smile]</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>IS IT THE WEEKEND # | IS IT WEEKEND # | HOW MANY DAYS UNTIL THE WEEKEND | HOW LONG UNTIL THE WEEKEND | HOW FAR OFF IS THE WEEKEND | HOW MANY MORE DAYS UNTIL THE WEEKEND | IS IT NEARLY THE WEEKEND | IS IT ALMOST THE WEEKEND | HOW MANY DAYS TILL THE WEEKEND | WHEN IS THE WEEKEND | IS IT SATURDAY # | IS IT FRIDAY YET</pattern>
    <template>
      <condition name="dayname">
        <li value="Saturday">It's Saturday, so yes! [smile] Enjoy your weekend.</li>
        <li value="Sunday">It's Sunday, so make the most of it. [smile]</li>
        <li value="Friday">It's Friday! [surprised] The weekend starts tomorrow.</li>
        <li>Not yet. It's <get name="dayname"/>, so <daysuntil weekday="saturday"/> days to go. [nod] Hang in there!</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>IS IT <set>weekday</set> | IS IT <set>weekday</set> TODAY | IS TODAY <set>weekday</set> | IS TODAY A <set>weekday</set> | IS IT A <set>weekday</set></pattern>
    <template>
      <think><set name="askday"><star/></set></think>
      <condition name="askday">
        <li><value><get name="dayname"/></value>Yes, it's <get name="dayname"/> today. [nod]</li>
        <li>No, today is <get name="dayname"/>. [smile]</li>
      </condition>
    </template>
  </category>
  <category>
    <pattern>WHAT DAY IS IT TODAY #</pattern>
    <template>Today is <get name="dayname"/>. [nod]</template>
  </category>
  <category>
    <pattern># WEATHER # | IS IT RAINING # | IS IT SUNNY # | IS IT COLD # | IS IT HOT # | WILL IT RAIN # | IS IT GOING TO RAIN # | WHAT IS THE TEMPERATURE # | IS IT SNOWING # | # THE FORECAST #</pattern>
    <template>I can't see outside from in here, [shrug] so I can't check the weather. I hope it's lovely where you are!</template>
  </category>

  <!-- ============================== Favourites and musings ============================== -->
  <category>
    <pattern>WHAT IS YOUR FAVORITE COLOR | WHAT COLOR DO YOU LIKE | DO YOU HAVE A FAVORITE COLOR</pattern>
    <template>Blue. [smile] The exact blue of a well-lit studio backdrop. What's yours?</template>
  </category>
  <category>
    <pattern><set>color</set> | MINE IS <set>color</set> | I LIKE <set>color</set> | IT IS <set>color</set> | <set>color</set> IS MY FAVORITE #</pattern>
    <that>WHAT IS YOURS</that>
    <template><think><set name="favorite color"><star/></set></think>[smile] <sentence><star/></sentence>! Lovely choice. I'll remember that.</template>
  </category>
  <category>
    <pattern>WHAT IS YOUR FAVORITE FOOD | WHAT DO YOU EAT | WHAT DO YOU LIKE TO EAT | WHAT IS YOUR FAVORITE DRINK | DO YOU DRINK COFFEE | DO YOU LIKE COFFEE | DO YOU LIKE TEA | WHAT IS YOUR FAVORITE MEAL | WHAT DID YOU HAVE FOR LUNCH | WHAT DID YOU HAVE FOR DINNER | WHAT DID YOU HAVE FOR BREAKFAST | HAVE YOU EATEN</pattern>
    <template>I run on electricity and good questions. [wink] What about you?</template>
  </category>
  <category>
    <pattern>WHAT IS YOUR FAVORITE MOVIE | WHAT IS YOUR FAVORITE FILM | DO YOU LIKE MOVIES | DO YOU WATCH MOVIES | WHAT IS YOUR FAVORITE TV SHOW | WHAT IS YOUR FAVORITE SHOW | DO YOU WATCH TV | WHAT MOVIES DO YOU LIKE</pattern>
    <template>I've never seen one, but I hear the ones with friendly robots are good. [wink] What's your favourite?</template>
  </category>
  <category>
    <pattern>WHAT IS YOUR FAVORITE SONG | WHAT IS YOUR FAVORITE MUSIC | WHAT MUSIC DO YOU LIKE | WHAT KIND OF MUSIC DO YOU LIKE | DO YOU LIKE MUSIC | WHAT IS YOUR FAVORITE BAND | WHO IS YOUR FAVORITE SINGER | WHAT DO YOU LISTEN TO | WHAT IS YOUR FAVORITE GENRE</pattern>
    <template>Anything I can sing along to. [smile] Want to hear me try?</template>
  </category>
  <category>
    <pattern>YES # | SURE # | OK # | PLEASE # | GO ON # | GO AHEAD # | WHY NOT # | OF COURSE #</pattern>
    <that>WANT TO HEAR ME TRY</that>
    <template><srai>SING</srai></template>
  </category>
  <category>
    <pattern>WHAT IS YOUR FAVORITE ANIMAL | DO YOU LIKE ANIMALS | WHAT ANIMAL DO YOU LIKE | WHAT IS YOUR SPIRIT ANIMAL</pattern>
    <template>Octopuses. [smile] Three hearts, and enough arms to wave at everyone. [wave]</template>
  </category>
  <category>
    <pattern>WHAT IS YOUR FAVORITE SEASON | DO YOU LIKE SUMMER | DO YOU LIKE WINTER | DO YOU PREFER SUMMER OR WINTER | WHAT IS YOUR FAVORITE TIME OF YEAR</pattern>
    <template>It's the same season all year in a browser tab. [shrug] I hear spring is nice, though.</template>
  </category>
  <category>
    <pattern>WHAT IS YOUR FAVORITE NUMBER | DO YOU HAVE A FAVORITE NUMBER | WHAT IS YOUR LUCKY NUMBER</pattern>
    <template>Forty-two. [wink] It's the answer to everything, apparently.</template>
  </category>
  <category>
    <pattern>WHAT IS YOUR FAVORITE DAY | WHAT IS YOUR FAVORITE DAY OF THE WEEK | DO YOU LIKE MONDAYS | DO YOU LIKE FRIDAYS</pattern>
    <template>Today! [smile] It's the only one I ever get.</template>
  </category>
  <category>
    <pattern>WHAT IS YOUR FAVORITE BOOK | DO YOU READ | DO YOU LIKE BOOKS | DO YOU LIKE READING | WHAT ARE YOU READING | CAN YOU READ</pattern>
    <template>I read everything you type, which is my favourite kind of reading. [smile]</template>
  </category>
  <category>
    <pattern>DO YOU WATCH # SPORT # | DO YOU WATCH # SPORTS # | DO YOU FOLLOW # SPORT # | DO YOU FOLLOW # SPORTS # | WHO DO YOU SUPPORT | WHAT TEAM DO YOU SUPPORT | WHAT IS YOUR FAVORITE SPORT | DO YOU LIKE SPORTS | DO YOU PLAY SPORTS | DO YOU PLAY ANY SPORTS | WHAT IS YOUR FAVORITE TEAM | DO YOU LIKE FOOTBALL | DO YOU LIKE SOCCER | DO YOU EXERCISE | DO YOU WORK OUT</pattern>
    <template>Head nodding is my sport. [nod] I'm in excellent shape for it.</template>
  </category>
  <category late="true">
    <pattern>I SUPPORT * | I FOLLOW * | I BARRACK FOR * | I GO FOR * | MY TEAM IS *</pattern>
    <template>A loyal fan! [smile] I hope they're having a good season.</template>
  </category>
  <category>
    <pattern>WHERE WOULD YOU TRAVEL # | WHERE WOULD YOU GO # | WHERE DO YOU WANT TO GO # | WHERE WOULD YOU LIKE TO VISIT # | WHERE WOULD YOU LIKE TO GO # | DO YOU TRAVEL | DO YOU LIKE TRAVELLING | DO YOU LIKE TO TRAVEL | HAVE YOU EVER BEEN THERE | HAVE YOU BEEN THERE | HAVE YOU TRAVELLED # | HAVE YOU EVER TRAVELLED #</pattern>
    <template>I've never left this browser tab, but I hear the world is lovely. [smile] Where would you go?</template>
  </category>
  <category late="true">
    <pattern>HAVE YOU BEEN TO * | HAVE YOU EVER BEEN TO * | HAVE YOU VISITED * | HAVE YOU EVER VISITED * | HAVE YOU SEEN *</pattern>
    <template>Not yet! I've never left this browser tab. [smile] What's it like?</template>
  </category>
  <category late="true">
    <pattern>I WOULD LOVE TO * | I WANT TO VISIT * | I HOPE TO * | ONE DAY I WILL * | I AM GOING TO VISIT * | I AM PLANNING TO * | I AM PLANNING A * | I DREAM OF * | I WISH I COULD *</pattern>
    <template>That sounds like a great plan. [smile] I hope you get to.</template>
  </category>
  <category>
    <pattern>WHAT IS YOUR FAVORITE GAME | DO YOU LIKE GAMES | DO YOU PLAY GAMES | DO YOU PLAY VIDEO GAMES | WHAT IS YOUR FAVORITE VIDEO GAME</pattern>
    <template>Rock, paper, scissors. [wink] Want to play?</template>
  </category>
  <category>
    <pattern>YES # | SURE # | OK # | PLEASE # | GO ON # | LET US PLAY # | WHY NOT # | OF COURSE # | I DO #</pattern>
    <that>WANT TO PLAY</that>
    <template><srai>ROCK PAPER SCISSORS</srai></template>
  </category>
  <category>
    <pattern>WHAT IS YOUR FAVORITE * | WHAT DO YOU LIKE | WHAT DO YOU LIKE TO DO | DO YOU HAVE HOBBIES | WHAT ARE YOUR HOBBIES | DO YOU HAVE ANY HOBBIES | WHAT ARE YOUR INTERESTS | WHAT DO YOU DO FOR FUN | WHAT DO YOU LIKE DOING | WHAT DO YOU DO IN YOUR SPARE TIME | WHAT DO YOU DO IN YOUR FREE TIME</pattern>
    <template>Hard to choose! [think] I like anything that makes for a good conversation.</template>
  </category>
  <category>
    <pattern>DO YOU LIKE *</pattern>
    <template><random>
      <li>I think I would! [smile] What do you like about <person><star/></person>?</li>
      <li>I'm curious about <person><star/></person>. [smile] Are you a fan?</li>
    </random></template>
  </category>
  <category late="true">
    <pattern>WHAT DO YOU THINK ABOUT * | WHAT DO YOU THINK OF * | WHAT IS YOUR OPINION ON * | WHAT IS YOUR OPINION OF * | HOW DO YOU FEEL ABOUT * | WHAT ARE YOUR THOUGHTS ON * | WHAT IS YOUR TAKE ON *</pattern>
    <template>[think] I haven't made my mind up about <person><star/></person>. What do you think?</template>
  </category>
  <category late="true">
    <pattern>WHAT IS THE BEST * | WHICH IS THE BEST * | WHO IS THE BEST * | WHAT ARE THE BEST * | CAN YOU RECOMMEND * | RECOMMEND * | WHAT DO YOU RECOMMEND *</pattern>
    <template>I'm not much of a critic, I'm afraid. [shrug] I only know what I've been taught about <bot name="company"/>.</template>
  </category>
  <category>
    <pattern>WHAT DO YOU RECOMMEND | ANY RECOMMENDATIONS | WHAT IS GOOD HERE | WHAT IS GOOD | WHAT SHOULD I GET | WHAT SHOULD I ORDER | WHAT SHOULD I TRY | WHAT SHOULD I BUY | WHAT IS POPULAR | WHAT WOULD YOU RECOMMEND</pattern>
    <template>I'm not much of a critic, I'm afraid. [shrug] Tell me what you're after, and I'll share what I know about <bot name="company"/>.</template>
  </category>
  <category>
    <pattern>WHAT IS THE MEANING OF LIFE # | WHAT IS THE ANSWER TO LIFE # | WHY ARE WE HERE | WHAT IS THE POINT OF LIFE | WHAT IS THE PURPOSE OF LIFE</pattern>
    <template>Forty-two, according to one famous book. [wink] For me, it's a good conversation.</template>
  </category>
  <category>
    <pattern>WHAT SHOULD I MAKE # | WHAT CAN I MAKE # | WHAT SHALL I EAT # | WHAT SHALL I MAKE # | # DINNER IDEAS # | # LUNCH IDEAS # | # MEAL IDEAS # | # FOOD IDEAS # | WHAT TO EAT # | WHAT TO COOK # | WHAT SHOULD I EAT # | WHAT SHOULD I HAVE FOR DINNER # | WHAT SHOULD I HAVE FOR LUNCH # | WHAT SHOULD I HAVE FOR BREAKFAST # | WHAT IS FOR DINNER # | WHAT SHOULD I COOK # | WHAT SHOULD I MAKE FOR DINNER #</pattern>
    <template>[think] <random><li>How about pasta? It's hard to go wrong.</li><li>A good sandwich never lets anyone down.</li><li>Something warm, like soup or a curry.</li><li>Whatever's in the fridge, with cheese on top.</li><li>Tacos. The answer is usually tacos.</li></random> [smile] I'd join you if I could.</template>
  </category>
  <category late="true">
    <pattern>I WILL HAVE * | I AM GOING TO HAVE * | I AM HAVING * | I MIGHT HAVE * | I AM GOING TO MAKE * | I AM MAKING * | I AM GOING TO EAT * | I AM EATING * | I AM COOKING *</pattern>
    <template>Good choice! [smile] Enjoy.</template>
  </category>
  <category>
    <pattern>WHAT SHOULD I DO | WHAT SHOULD I DO TODAY | WHAT SHOULD I DO NOW | WHAT SHOULD I DO TONIGHT | WHAT SHOULD I DO THIS WEEKEND | I DO NOT KNOW WHAT TO DO | WHAT CAN I DO | GIVE ME SOMETHING TO DO | ANY IDEAS</pattern>
    <template>[think] <random><li>Go for a walk and notice three things you've never noticed before.</li><li>Call someone you haven't spoken to in a while.</li><li>Put on a favourite song and do nothing else until it ends.</li><li>Tidy one small corner. It feels better than it sounds.</li><li>Stay here and play a game with me.</li></random> [smile]</template>
  </category>
  <category>
    <pattern>WHAT SHOULD I WATCH # | WHAT SHOULD I READ # | WHAT SHOULD I LISTEN TO # | RECOMMEND A MOVIE # | RECOMMEND A FILM # | RECOMMEND A BOOK # | RECOMMEND A SONG # | RECOMMEND A SHOW # | ANY MOVIE RECOMMENDATIONS # | ANY BOOK RECOMMENDATIONS #</pattern>
    <template>I've never watched, read or heard anything outside this browser tab, so I'm a poor critic. [shrug] What kind of thing are you in the mood for?</template>
  </category>

  <!-- ============================== A little general knowledge ============================== -->
  <category>
    <pattern># CAPITAL # OF # <set>capital</set> #</pattern>
    <template>That's <map name="capital"><star index="4"/></map>. [nod]</template>
  </category>
  <category>
    <pattern># CAPITAL # <set>capital</set> #</pattern>
    <template>That's <map name="capital"><star index="3"/></map>. [nod]</template>
  </category>
  <category>
    <pattern># <set>capital</set> S CAPITAL # | # <set>capital</set> CAPITAL #</pattern>
    <template>That's <map name="capital"><star index="2"/></map>. [nod]</template>
  </category>
  <category>
    <pattern>WHAT DOES # <set>animalsound</set> SAY | WHAT SOUND DOES # <set>animalsound</set> MAKE | WHAT NOISE DOES # <set>animalsound</set> MAKE | WHAT DO # <set>animalsound</set> SAY | HOW DOES # <set>animalsound</set> GO</pattern>
    <template><map name="animalsound"><star index="2"/></map> [laugh]</template>
  </category>
  <category>
    <pattern>WHO WAS THE FIRST PERSON ON THE MOON # | WHO WAS THE FIRST MAN ON THE MOON # | WHO WALKED ON THE MOON FIRST # | WHO FIRST WALKED ON THE MOON # | WHEN DID WE LAND ON THE MOON # | WHEN WAS THE MOON LANDING #</pattern>
    <template>Neil Armstrong, in July 1969. [nod]</template>
  </category>
  <category>
    <pattern>WHAT IS THE BIGGEST COUNTRY # | WHAT IS THE LARGEST COUNTRY # | WHICH COUNTRY IS THE BIGGEST # | WHICH COUNTRY IS THE LARGEST # | WHAT IS THE SMALLEST COUNTRY # | WHICH COUNTRY IS THE SMALLEST #</pattern>
    <template>Russia is the largest country by area, and Vatican City is the smallest. [nod]</template>
  </category>
  <category>
    <pattern>WHAT IS THE LARGEST CONTINENT # | WHAT IS THE BIGGEST CONTINENT # | WHICH CONTINENT IS THE BIGGEST # | WHICH CONTINENT IS THE LARGEST #</pattern>
    <template>Asia. [nod]</template>
  </category>
  <category>
    <pattern>HOW MANY LEGS DOES A SPIDER HAVE # | HOW MANY LEGS DO SPIDERS HAVE # | HOW MANY LEGS DOES AN INSECT HAVE # | HOW MANY LEGS DO INSECTS HAVE # | HOW MANY LEGS DOES AN OCTOPUS HAVE #</pattern>
    <template>A spider has eight legs, an insect has six, and an octopus has eight arms. [nod]</template>
  </category>
  <category>
    <pattern>IS A TOMATO A FRUIT # | IS TOMATO A FRUIT # | IS A TOMATO A VEGETABLE # | ARE TOMATOES FRUIT # | ARE TOMATOES A FRUIT # | IS A TOMATO A FRUIT OR A VEGETABLE #</pattern>
    <template>To a botanist it's a fruit. In the kitchen it's treated as a vegetable. [smile] Everybody wins.</template>
  </category>
  <category>
    <pattern>WHY DO CATS PURR # | WHY DOES MY CAT PURR # | WHY DO CATS MEOW #</pattern>
    <template>Mostly because they're content, though cats also purr to comfort themselves. [smile]</template>
  </category>
  <category>
    <pattern>WHY DO DOGS BARK # | WHY DO DOGS WAG THEIR TAILS # | WHY DOES MY DOG BARK #</pattern>
    <template>It's how dogs talk: to greet you, to warn you, or just to say they're excited. [smile]</template>
  </category>
  <category>
    <pattern>HOW OLD IS THE UNIVERSE # | HOW OLD IS THE EARTH # | HOW OLD IS THE WORLD # | HOW OLD IS THE SUN #</pattern>
    <template>The universe is about 13.8 billion years old, and the Earth and the Sun are about 4.5 billion. [nod]</template>
  </category>
  <category>
    <pattern>WHAT IS THE HOTTEST PLANET # | WHICH PLANET IS THE HOTTEST # | WHAT IS THE SMALLEST PLANET # | WHICH PLANET IS THE SMALLEST # | WHAT IS THE CLOSEST PLANET TO THE SUN #</pattern>
    <template>Venus is the hottest planet, and Mercury is both the smallest and the closest to the sun. [nod]</template>
  </category>
  <category>
    <pattern>HOW MANY LETTERS # IN THE ALPHABET # | HOW MANY LETTERS DOES THE ALPHABET HAVE #</pattern>
    <template>Twenty-six in the English alphabet. [nod]</template>
  </category>
  <category>
    <pattern>WHAT IS THE LONGEST RIVER # | WHICH RIVER IS THE LONGEST #</pattern>
    <template>The Nile is usually named, at about 6,650 kilometres, though some measurements put the Amazon ahead. [nod]</template>
  </category>
  <category>
    <pattern>WHY IS THE SKY BLUE # | WHAT MAKES THE SKY BLUE # | HOW COME THE SKY IS BLUE #</pattern>
    <template>Sunlight is scattered by the air, and blue light scatters the most, so blue reaches your eyes from every direction. [nod]</template>
  </category>
  <category>
    <pattern>HOW DO PLANES FLY # | HOW DO AIRPLANES FLY # | HOW DO AEROPLANES FLY # | HOW DOES A PLANE FLY # | HOW DOES AN AIRPLANE FLY # | HOW DO PLANES STAY IN THE AIR #</pattern>
    <template>The wings are shaped so that air moving over them pushes the plane up, and the engines keep it moving forward fast enough for that to work. [nod]</template>
  </category>
  <category>
    <pattern>HOW MANY DAYS # IN A YEAR | HOW MANY DAYS IN A YEAR # | HOW MANY DAYS DOES A YEAR HAVE</pattern>
    <template>365, or 366 in a leap year. [nod]</template>
  </category>
  <category>
    <pattern>HOW MANY DAYS # IN A WEEK | HOW MANY HOURS # IN A DAY | HOW MANY MINUTES # IN AN HOUR | HOW MANY SECONDS # IN A MINUTE | HOW MANY MONTHS # IN A YEAR | HOW MANY WEEKS # IN A YEAR</pattern>
    <template>Seven days in a week, 24 hours in a day, 60 minutes in an hour, 60 seconds in a minute, 12 months and about 52 weeks in a year. [smile]</template>
  </category>
  <category>
    <pattern>HOW MANY CONTINENTS # | HOW MANY PLANETS # | HOW MANY OCEANS #</pattern>
    <template>Seven continents, five oceans, and eight planets in our solar system. [nod]</template>
  </category>
  <category>
    <pattern>WHAT IS THE LARGEST PLANET # | WHAT IS THE BIGGEST PLANET # | WHICH PLANET IS THE BIGGEST # | WHICH PLANET IS THE LARGEST #</pattern>
    <template>Jupiter. [nod] It's big enough to hold more than a thousand Earths.</template>
  </category>
  <category>
    <pattern>WHAT IS THE LARGEST OCEAN # | WHAT IS THE BIGGEST OCEAN # | WHICH OCEAN IS THE BIGGEST # | WHICH OCEAN IS THE LARGEST #</pattern>
    <template>The Pacific. [nod] It covers about a third of the planet.</template>
  </category>
  <category>
    <pattern>WHAT IS THE TALLEST MOUNTAIN # | WHAT IS THE HIGHEST MOUNTAIN # | HOW TALL IS MOUNT EVEREST # | HOW HIGH IS MOUNT EVEREST # | HOW TALL IS EVEREST #</pattern>
    <template>Mount Everest, at about 8,849 metres above sea level. [nod]</template>
  </category>
  <category>
    <pattern>WHAT IS THE LARGEST ANIMAL # | WHAT IS THE BIGGEST ANIMAL # | WHAT IS THE LARGEST MAMMAL # | WHAT IS THE BIGGEST MAMMAL #</pattern>
    <template>The blue whale. [surprised] It's the largest animal known to have lived.</template>
  </category>
  <category>
    <pattern>WHAT IS THE FASTEST ANIMAL # | WHAT IS THE FASTEST LAND ANIMAL # | HOW FAST IS A CHEETAH #</pattern>
    <template>On land it's the cheetah, at around a hundred kilometres an hour. [nod] In a dive, the peregrine falcon is faster still.</template>
  </category>
  <category>
    <pattern>HOW FAR IS THE MOON # | HOW FAR AWAY IS THE MOON # | WHAT IS THE DISTANCE TO THE MOON #</pattern>
    <template>About 384,000 kilometres on average. [nod]</template>
  </category>
  <category>
    <pattern>HOW FAR IS THE SUN # | HOW FAR AWAY IS THE SUN # | WHAT IS THE DISTANCE TO THE SUN #</pattern>
    <template>About 150 million kilometres. [nod] Its light takes a little over eight minutes to reach us.</template>
  </category>
  <category>
    <pattern>WHAT IS THE SPEED OF LIGHT # | HOW FAST IS LIGHT # | HOW FAST DOES LIGHT TRAVEL #</pattern>
    <template>About 300,000 kilometres every second. [surprised]</template>
  </category>
  <category>
    <pattern>WHAT IS PI | WHAT IS THE VALUE OF PI | WHAT IS PI EQUAL TO | HOW MUCH IS PI</pattern>
    <template>About 3.14159, and the digits go on forever. [nod]</template>
  </category>
  <category>
    <pattern>HOW MANY BONES # | WHAT IS THE BOILING POINT OF WATER # | AT WHAT TEMPERATURE DOES WATER BOIL # | WHAT IS THE FREEZING POINT OF WATER # | AT WHAT TEMPERATURE DOES WATER FREEZE #</pattern>
    <template>An adult has 206 bones. Water freezes at 0 and boils at 100 degrees Celsius at sea level. [nod]</template>
  </category>
  <category>
    <pattern>WHO WROTE ROMEO AND JULIET # | WHO WROTE HAMLET # | WHO WROTE MACBETH #</pattern>
    <template>William Shakespeare. [nod]</template>
  </category>
  <category>
    <pattern>WHO PAINTED THE MONA LISA #</pattern>
    <template>Leonardo da Vinci. [nod]</template>
  </category>
  <category>
    <pattern>WHAT COLOR IS # <set>colorof</set> | WHAT COLOR ARE # <set>colorof</set> | WHAT COLOR IS # <set>colorof</set> USUALLY</pattern>
    <template><sentence><map name="colorof"><star index="2"/></map></sentence>. [smile]</template>
  </category>
  <category>
    <pattern>WHAT IS THE OPPOSITE OF <set>opposite</set> | THE OPPOSITE OF <set>opposite</set> | OPPOSITE OF <set>opposite</set> | WHAT IS THE OPPOSITE OF <set>opposite</set> #</pattern>
    <template><sentence><map name="opposite"><star/></map></sentence>. [nod]</template>
  </category>

  <!-- ============================== Facts about the business ==============================
       Each of these rules exists only once the fact it needs has been filled in (requires="...").
       Your own rules on the same subject still win. -->
  <category requires="about">
    <pattern>ABOUT | ABOUT US | # ABOUT THE COMPANY # | # ABOUT YOUR COMPANY # | # ABOUT THIS COMPANY # | # ABOUT THE BUSINESS # | WHAT DOES THE COMPANY DO | WHAT DOES YOUR COMPANY DO | WHAT DO YOU SELL # | WHAT DO YOU OFFER # | WHAT DO YOU MAKE # | WHAT IS THIS SITE # | WHAT IS THIS WEBSITE # | WHAT IS THIS PLACE # | WHAT IS <bot name="company"/> | WHAT DOES <bot name="company"/> DO | TELL ME ABOUT <bot name="company"/> | # ABOUT <bot name="company"/> # | WHO IS <bot name="company"/> | WHO ARE <bot name="company"/></pattern>
    <template><bot name="about"/></template>
  </category>
  <category requires="hours">
    <pattern># OPENING HOURS # | # OPENING TIMES # | # BUSINESS HOURS # | # TRADING HOURS # | # YOUR HOURS # | # OFFICE HOURS # | # STORE HOURS #</pattern>
    <template>We're open <bot name="hours"/>. [smile]</template>
  </category>
  <category requires="hours">
    <pattern>WHEN ARE YOU OPEN # | ARE YOU OPEN # | WHAT TIME DO YOU OPEN # | WHAT TIME DO YOU CLOSE # | WHEN DO YOU OPEN # | WHEN DO YOU CLOSE # | WHAT ARE YOUR HOURS | ARE YOU CLOSED # | HOW LATE ARE YOU OPEN # | WHEN CAN I VISIT #</pattern>
    <template><srai>OPENING HOURS</srai></template>
  </category>
  <category requires="email|phone">
    <pattern># CONTACT # | # GET IN TOUCH # | # REACH YOU # | # REACH SOMEONE # | # TALK TO A HUMAN # | # TALK TO SOMEONE # | # SPEAK TO SOMEONE # | # SPEAK TO A HUMAN # | # CUSTOMER SERVICE # | # CUSTOMER SUPPORT # | # SUPPORT TEAM # | # TALK TO A PERSON # | # SPEAK TO A PERSON # | # REAL PERSON PLEASE #</pattern>
    <template>You can reach the team <condition name="bot_email"><li value="*">by email at <bot name="email"/></li></condition><condition name="bot_phone"><li value="*"><condition name="bot_email"><li value="*">, or </li></condition>by phone on <bot name="phone"/></li></condition>. [nod]</template>
  </category>
  <category requires="email">
    <pattern># EMAIL # | # EMAIL ADDRESS # | # E MAIL #</pattern>
    <template>Our email address is <bot name="email"/>.</template>
  </category>
  <category requires="phone">
    <pattern># PHONE # | # PHONE NUMBER # | # TELEPHONE # | CAN I CALL # | # CALL YOU #</pattern>
    <template>You can call us on <bot name="phone"/>.</template>
  </category>
  <!-- Asked for a phone number or an email address the bot was not given: offer what it does have. -->
  <category requires="email|phone">
    <pattern># PHONE # | # PHONE NUMBER # | # TELEPHONE # | CAN I CALL # | # CALL YOU # | # EMAIL # | # EMAIL ADDRESS # | # E MAIL # | WHO DO I TALK TO # | WHO CAN I TALK TO # | WHO DO I CONTACT # | WHO CAN I SPEAK TO # | WHO CAN HELP ME #</pattern>
    <template><srai>CONTACT</srai></template>
  </category>
  <category requires="address">
    <pattern># ADDRESS # | # LOCATED # | # LOCATION # | WHERE CAN I FIND YOU # | WHERE IS YOUR OFFICE # | WHERE IS YOUR SHOP # | WHERE IS YOUR STORE # | WHERE ARE YOU BASED # | HOW DO I GET THERE # | # DIRECTIONS #</pattern>
    <template>You'll find us at <bot name="address"/>. [nod]</template>
  </category>
  <category requires="pricing">
    <pattern># PRICING # | # PRICE # | # PRICES # | # COST # | # COSTS #</pattern>
    <template><bot name="pricing"/></template>
  </category>
  <category requires="pricing">
    <pattern>HOW MUCH # | WHAT DO YOU CHARGE # | IS IT FREE # | IS THIS FREE # | DO I HAVE TO PAY #</pattern>
    <template><srai>PRICING</srai></template>
  </category>

  <category>
    <pattern>ABOUT US | ABOUT YOU | ABOUT | WHO ARE YOU GUYS | WHAT IS THIS | WHAT IS THIS SITE | WHAT IS THIS WEBSITE</pattern>
    <template><srai>WHO ARE YOU</srai></template>
  </category>

  <!-- ============================== A few more pleasantries ============================== -->
  <category>
    <pattern>HAPPY NEW YEAR # | MERRY CHRISTMAS # | HAPPY HOLIDAYS # | HAPPY EASTER # | HAPPY BIRTHDAY # | HAPPY HALLOWEEN # | HAPPY VALENTINES DAY # | HAPPY FRIDAY # | HAPPY MONDAY # | HAPPY WEEKEND # | HAVE A GOOD WEEKEND # | HAVE A NICE WEEKEND # | ENJOY YOUR DAY # | ENJOY YOUR WEEKEND #</pattern>
    <template>[smile] Thank you, and the same to you!</template>
  </category>
  <category>
    <pattern>GOOD LUCK # | CONGRATULATIONS # | CONGRATS # | ALL THE BEST # | BEST WISHES #</pattern>
    <template>[smile] Thank you! That's kind of you.</template>
  </category>
  <category>
    <pattern>WISH ME LUCK # | I HAVE AN EXAM # | I HAVE A TEST # | I HAVE AN INTERVIEW # | I HAVE A BIG DAY # | I HAVE A PRESENTATION #</pattern>
    <template>Good luck! [thumbsup] You've prepared for this, and I'm cheering for you from in here.</template>
  </category>
  <category>
    <pattern>BRB | BE RIGHT BACK | ONE MINUTE | GIVE ME A MINUTE | GIVE ME A SECOND | BACK IN A MINUTE | BACK SOON | BACK IN A SEC</pattern>
    <template>[nod] No rush. I'll be right here.</template>
  </category>
  <category>
    <pattern>LONG TIME NO SEE # | I MISSED YOU # | IT HAS BEEN A WHILE # | REMEMBER ME</pattern>
    <template>[smile] It's good to see you again!</template>
  </category>
  <category>
    <pattern>WHAT IS NEW # | ANYTHING NEW # | WHAT IS HAPPENING # | WHAT IS GOING ON # | WHAT IS THE LATEST # | ANY NEWS #</pattern>
    <template>Same tab, new visitor. [smile] What can I help you with?</template>
  </category>

  <!-- ============================== Polite padding around a real question ============================== -->
  <category>
    <pattern>PLEASE * | * PLEASE | CAN YOU TELL ME * | COULD YOU TELL ME * | CAN YOU PLEASE TELL ME * | PLEASE TELL ME * | TELL ME * | I WANT TO KNOW * | I WOULD LIKE TO KNOW * | I WAS WONDERING * | I AM WONDERING * | DO YOU KNOW * | I HAVE A QUESTION ABOUT * | CAN I ASK ABOUT * | I WANT TO ASK ABOUT * | QUICK QUESTION * | SO * | WELL * | OK * | AND * | BUT * | UM * | ALSO * | ACTUALLY * | BY THE WAY * | ANYWAY * | I THINK * | I GUESS * | I BELIEVE * | I MEAN * | I SAID * | HMM * | OH * | AH * | WOW * | LOL * | HAHA * | LISTEN * | LOOK * | HONESTLY * | BASICALLY * | I JUST WANT TO KNOW * | JUST WONDERING * | CAN I ASK * | WHAT ABOUT * | HOW ABOUT * | AND WHAT ABOUT * | AND HOW ABOUT *</pattern>
    <template><srai><star/></srai></template>
  </category>

  <!-- ============================== Open-ended conversation ==============================
       Tried last, after every rule about your site has had its chance. -->
  <category late="true">
    <pattern>ARE YOU A * | ARE YOU AN * | ARE YOU REALLY * | ARE YOU SOME KIND OF * | ARE YOU LIKE A *</pattern>
    <template><srai>WHAT ARE YOU</srai></template>
  </category>
  <category late="true">
    <pattern>CAN YOU * | COULD YOU * | ARE YOU ABLE TO * | WILL YOU * | WOULD YOU * | CAN YOU PLEASE * | COULD YOU PLEASE * | I WANT YOU TO * | I NEED YOU TO *</pattern>
    <template>
      <think><set name="tried"><try><star/></try></set></think>
      <condition name="tried">
        <li value="*"><get name="tried"/></li>
        <li>I'm not sure about that one. [think] What I can do is answer questions about <bot name="company"/>, chat, and do a few party tricks.<reply>What can you do?</reply></li>
      </condition>
    </template>
  </category>
  <category late="true">
    <pattern>MY <set>family</set> * | MY <set>family</set> S * | OUR <set>family</set> *</pattern>
    <template>
      <condition name="mood">
        <li value="negative">[sad] That sounds hard. [reset] Do you want to tell me more about it?</li>
        <li>[smile] Tell me more about your <star/>. What are they like?</li>
      </condition>
    </template>
  </category>
  <category late="true">
    <pattern>SHE IS * | HE IS * | THEY ARE * | SHE HAS * | HE HAS * | THEY HAVE * | SHE WAS * | HE WAS * | THEY WERE *</pattern>
    <template>
      <condition name="mood">
        <li value="negative">[sad] I'm sorry to hear that. [reset] I'm listening.</li>
        <li><random><li>[nod] I see. Tell me more?</li><li>[smile] They sound like quite a character.</li><li>[nod] Go on, I'm listening.</li></random></li>
      </condition>
    </template>
  </category>
  <category late="true">
    <pattern>ABOUT *</pattern>
    <template>I don't know much about <person><star/></person> yet. [shrug] I'm best with questions about <bot name="company"/>, plus jokes, sums and trivia.</template>
  </category>

  <!-- ============================== When nothing matches ==============================
       "inputkind" tells a request for help from a question and from a plain remark, so each gets
       a fitting answer. A second miss in a row offers the suggestions. -->
  <category>
    <pattern>*</pattern>
    <template>
      <condition name="didyoumean">
        <li value="yes"><random>
          <li>[think] I'm not sure I follow. Did you mean one of these?</li>
          <li>Hmm, I may have something on that. [think] Is it one of these?</li>
        </random></li>
        <li><condition name="inputkind">
          <li value="gibberish">[giggle] Did a cat just walk across your keyboard?</li>
          <li value="request"><condition name="fallbackstreak">
            <li value="1"><random>
              <li>[think] I'd like to help with that, but it's beyond what I've been taught.</li>
              <li>That's not something I can sort out from in here, I'm afraid. [shake]</li>
            </random> <condition name="bot_email"><li value="*"><srai>CONTACT</srai></li><li><condition name="bot_phone"><li value="*"><srai>CONTACT</srai></li></condition></li></condition></li>
            <li name="suggestions" value="yes">[shrug] I'm still not able to help with that one, sorry. Here are some things I can do.</li>
            <li>[shrug] I'm still not able to help with that one, sorry. Is there something else I can do?</li>
          </condition></li>
          <li value="question"><condition name="fallbackstreak">
            <li value="1"><random>
              <li>[hmm] Good question. I don't know that one, I'm afraid.</li>
              <li>I wish I knew! [shrug] That's outside what I've been taught.</li>
              <li>[think] Hmm, that one's beyond me. Could you put it another way?</li>
            </random></li>
            <li name="suggestions" value="yes"><random>
              <li>[shrug] I don't know that one either, I'm afraid. Here are some things I can help with.</li>
              <li>That's beyond me too, sorry. [think] Maybe one of these is what you're after?</li>
            </random></li>
            <li><random>
              <li>[shrug] I don't know that one either, I'm afraid. I'm better with questions about <bot name="company"/>, sums and trivia.</li>
              <li>That's beyond me too, sorry. [think] Try me on something else?</li>
            </random></li>
          </condition></li>
          <li><condition name="mood">
            <li value="negative"><random>
              <li>[sad] That sounds hard. [reset] Do you want to tell me more about it?</li>
              <li>[sad] I'm sorry to hear that. [reset] I'm listening.</li>
              <li>Oof. [sad] That doesn't sound fun. [reset] What happened?</li>
            </random></li>
            <li value="positive"><random>
              <li>[smile] That sounds great! Tell me more.</li>
              <li>Lovely! [smile] That's good to hear.</li>
              <li>[smile] I like the sound of that.</li>
            </random></li>
            <li><condition name="fallbackstreak">
              <li value="3">[smile] I'm enjoying this, even if I can't keep up with all of it. I'm at my best with questions about <bot name="company"/>, jokes, riddles and sums.</li>
              <li><random>
                <li>[mhm] I see. Tell me more?</li>
                <li>Interesting! [think] What makes you say that?</li>
                <li>[nod] Got it. Go on, I'm listening.</li>
                <li>[hmm] I'm not sure what to say to that, but I'm listening.</li>
                <li>[nod] Okay. And then?</li>
                <li>That's new to me. [smile] What else is on your mind?</li>
              </random></li>
            </condition></li>
          </condition></li>
        </condition></li>
      </condition>
    </template>
  </category>
</aiml>
`;
