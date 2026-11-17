import initTTS, { TTS, encodeWav } from "../vendor/tts/tts.js";
import {
  SKIN_TONES,
  HAIR_STYLES,
  OUTFIT_STYLES,
  GLASSES_STYLES,
  FACIAL_HAIR_STYLES,
  POSTURE_STYLES,
  EARRING_STYLES,
  HEADWEAR_STYLES,
  NECKWEAR_STYLES,
  BROOCH_STYLES,
  AVATAR_ACTIONS,
  DEFAULT_AVATAR,
  AVATAR_PRESETS,
  createAnimState,
  sampleSpeechAt,
  stepAvatarPhysics,
  drawBotAvatar,
  triggerAvatarEmote,
  setAvatarMood,
  buildCueTimeline,
  estimateCueTimeline,
  runDueCues,
  getSculptHandles,
  hitTestSculptHandle,
} from "./avatar-renderer.js";
import {
  AIMLEngine,
  STARTER_AIML_PACKS,
  inspectAimlXml,
  appendAimlRule,
  stripSpeechTags,
  parseSpeechCues,
  captionForSpokenWord,
  BASE_AIML_XML,
  BOT_FACTS,
  removeAimlRule,
} from "./aiml-engine.js";
import {
  PERSONALITIES,
  PERSONA_TRAITS,
  PERSONA_SAYS,
  PERSONA_DELIVERIES,
  PERSONA_MOODS,
  PERSONA_LAUGHS,
  PERSONA_THINKS,
  PERSONA_GESTURES,
  normalizePersona,
  randomPersona,
  personaGreeting,
  randomBotName,
  describePersona,
  personalityById,
  stylizeReply,
} from "./persona.js";
import { mountBotWidget } from "./embed-widget-core.js";
import {
  slugifyBotName,
  buildSelfContainedBotJs,
  buildSelfContainedDemoHtml,
  generateEmbedSnippets,
  triggerBrowserDownload,
  downloadRawWasmFile,
  downloadEmbedRuntimeFile,
} from "./embed-builder.js";

const $ = (id) => document.getElementById(id);

// ============================================================================
// Studio Slider & Palette Definitions
// ============================================================================

const BODY_SLIDERS = [
  ["bodyScale", "Overall scale", 0.80, 1.20, 0.01, "×"],
  ["headScale", "Head size", 0.84, 1.22, 0.01, "×"],
  ["neckLength", "Neck length", 0.75, 1.35, 0.01, "×"],
  ["neckWidth", "Neck width", 0.70, 1.35, 0.01, "×"],
  ["shoulderWidth", "Shoulder width", 0.70, 1.42, 0.01, "×"],
  ["shoulderSlope", "Shoulder slope", -0.35, 0.45, 0.01, ""],
  ["chestWidth", "Chest width", 0.70, 1.38, 0.01, "×"],
  ["waistWidth", "Waist", 0.58, 1.38, 0.01, "×"],
  ["hipWidth", "Hips", 0.70, 1.38, 0.01, "×"],
  ["torsoLength", "Torso length", 0.80, 1.28, 0.01, "×"],
  ["armThickness", "Arm build", 0.70, 1.40, 0.01, "×"],
];

const SKIN_MATERIAL_SLIDERS = [
  ["blushIntensity", "Blush", 0, 0.55, 0.01, ""],
  ["synthFinish", "Android finish", 0, 1, 0.02, ""],
  ["freckles", "Freckles", 0, 1, 0.02, ""],
  ["eyeshadow", "Eyeshadow", 0, 1, 0.02, ""],
  ["ageLines", "Age lines", 0, 1, 0.02, ""],
  ["dimples", "Dimples", 0, 1, 0.02, ""],
  ["eyeliner", "Eyeliner", 0, 1, 0.02, ""],
];

const EXPRESSION_SLIDERS = [
  ["restSmile", "Resting smile", -0.4, 1, 0.02, ""],
  ["browMood", "Brows: stern to soft", -1, 1, 0.02, ""],
  ["eyeOpen", "Eyes: sleepy to wide", -0.5, 0.5, 0.02, ""],
];

const HEAD_SLIDERS = [
  ["headWidth", "Head width", 0.78, 1.25, 0.01, "×"],
  ["headHeight", "Head height", 0.84, 1.20, 0.01, "×"],
  ["cheekboneWidth", "Cheekbone width", 0.82, 1.22, 0.01, "×"],
  ["jawWidth", "Jaw width", 0.72, 1.28, 0.01, "×"],
  ["chinLength", "Chin length", -0.35, 0.45, 0.01, ""],
  ["chinRoundness", "Chin squareness", 0.05, 1.0, 0.02, ""],
  ["earSize", "Ear size", 0.65, 1.45, 0.02, "×"],
];

const FEATURES_SLIDERS = [
  ["eyeSize", "Eye size", 0.75, 1.38, 0.01, "×"],
  ["eyeSpacing", "Eye spacing", 0.80, 1.24, 0.01, "×"],
  ["eyeTilt", "Outer eye lift", -0.25, 0.30, 0.01, ""],
  ["browThickness", "Brow thickness", 0.50, 1.60, 0.02, "×"],
  ["browArch", "Brow arch", -0.20, 0.55, 0.01, ""],
  ["noseLength", "Nose length", 0.78, 1.26, 0.01, "×"],
  ["noseWidth", "Nose width", 0.74, 1.32, 0.01, "×"],
  ["mouthWidth", "Mouth width", 0.76, 1.30, 0.01, "×"],
  ["lipFullness", "Lip fullness", 0.65, 1.50, 0.01, "×"],
];

const VOICE_SLIDERS = [
  ["pitchHz", "Pitch (F0)", 65, 320, 1, " Hz"],
  ["tractLengthCm", "Vocal tract length", 12.4, 21.0, 0.1, " cm"],
  ["speed", "Speaking rate", 0.60, 1.65, 0.01, "×"],
  ["expressiveness", "Inflection", 0, 2.2, 0.02, ""],
  ["laughter", "Laughing while speaking", 0, 1, 0.01, ""],
  ["warmth", "Warmth", 0, 1, 0.01, ""],
  ["breathiness", "Breathiness", 0, 0.75, 0.01, ""],
  ["crispness", "Consonant crispness", 0.5, 1.55, 0.01, ""],
  ["roughness", "Creak", 0, 0.65, 0.01, ""],
  ["chestResonance", "Chest resonance", 0, 1, 0.01, ""],
  ["room", "Room ambience", 0, 0.85, 0.01, ""],
  ["volume", "Volume", 0.2, 2.0, 0.02, ""],
];

const BODY_BUILDS = {
  balanced: {
    bodyScale: 1.0, headScale: 1.0, neckLength: 1.0, neckWidth: 0.95,
    shoulderWidth: 0.96, shoulderSlope: 0.08, chestWidth: 0.94, waistWidth: 0.80,
    hipWidth: 0.94, torsoLength: 1.0, armThickness: 0.94,
  },
  athletic: {
    bodyScale: 1.02, headScale: 0.97, neckLength: 1.02, neckWidth: 1.06,
    shoulderWidth: 1.22, shoulderSlope: -0.04, chestWidth: 1.14, waistWidth: 0.80,
    hipWidth: 0.92, torsoLength: 1.04, armThickness: 1.12,
  },
  slender: {
    bodyScale: 0.98, headScale: 0.98, neckLength: 1.16, neckWidth: 0.82,
    shoulderWidth: 0.84, shoulderSlope: 0.16, chestWidth: 0.82, waistWidth: 0.68,
    hipWidth: 0.86, torsoLength: 1.12, armThickness: 0.80,
  },
  hourglass: {
    bodyScale: 1.0, headScale: 1.0, neckLength: 1.04, neckWidth: 0.88,
    shoulderWidth: 0.98, shoulderSlope: 0.10, chestWidth: 1.08, waistWidth: 0.66,
    hipWidth: 1.14, torsoLength: 1.02, armThickness: 0.92,
  },
  heroic: {
    bodyScale: 1.05, headScale: 0.94, neckLength: 0.96, neckWidth: 1.18,
    shoulderWidth: 1.34, shoulderSlope: -0.12, chestWidth: 1.26, waistWidth: 0.94,
    hipWidth: 0.98, torsoLength: 1.06, armThickness: 1.24,
  },
  compact: {
    bodyScale: 0.96, headScale: 1.16, neckLength: 0.84, neckWidth: 0.92,
    shoulderWidth: 0.86, shoulderSlope: 0.18, chestWidth: 0.88, waistWidth: 0.84,
    hipWidth: 0.90, torsoLength: 0.86, armThickness: 0.90,
  },
};

const IRIS_PALETTE = ["#3b82a6", "#2b6cb0", "#2f855a", "#8b5a2b", "#4a3728", "#6b46c1", "#06b6d4", "#475569"];
const LIP_PALETTE = ["#d6687c", "#e15b76", "#c25968", "#b26a6e", "#9e5e5b", "#c04851", "#8b5cf6", "#7c6f88"];
const HAIR_PALETTE = ["#1b1d26", "#3c2734", "#5c3a28", "#8b4f32", "#c88d48", "#d6b881", "#94a3b8", "#2563eb"];

const VOICE_PRESETS = [
  ["female", "Clear female"],
  ["bright", "Bright host"],
  ["male", "Natural male"],
  ["deep", "Deep and resonant"],
  ["husky", "Warm and husky"],
  ["whisper", "Soft whisper"],
];

const ARCTIC_PROFILES = [
  ["arctic_slt", "US Woman (SLT)"],
  ["arctic_clb", "US Woman (CLB)"],
  ["arctic_bdl", "US Man (BDL)"],
  ["arctic_rms", "US Man (RMS)"],
];

// ============================================================================
// Application State
// ============================================================================

const state = {
  activePresetId: "aria",
  name: AVATAR_PRESETS[0].name,
  role: AVATAR_PRESETS[0].role,
  company: "bot.computer",
  greeting: AVATAR_PRESETS[0].greeting,
  chatEnabled: true,
  baseBrain: true, // everyday small talk underneath the bot's own AIML rules
  facts: {}, // about, hours, email, phone, address, pricing: answered by the base brain
  aimlPackId: "concierge",
  aimlXml: STARTER_AIML_PACKS.concierge.xml,
  avatar: structuredClone(AVATAR_PRESETS[0].avatar),
  voiceBaseId: AVATAR_PRESETS[0].voicePreset || "",
  persona: normalizePersona(AVATAR_PRESETS[0].persona), // how replies are worded and delivered; null for none
  showSculptHandles: true,
  activeSculptId: "",
  hoverSculptId: "",
  snippetMode: "self", // "self" | "multi" | "sdk"
  embedOpts: {
    position: "bottom-right",
    size: "standard",
    eyeTracking: true,
    showCaptions: true,
    autoGreet: false,
    chatStartOpen: false,
  },
};

/** Keeps only the known business facts, as trimmed strings. */
function cleanFacts(raw) {
  const out = {};
  if (raw && typeof raw === "object") {
    for (const { key } of BOT_FACTS) {
      const value = typeof raw[key] === "string" ? raw[key].trim().slice(0, 400) : "";
      if (value) out[key] = value;
    }
  }
  return out;
}

/** What the bot knows about itself: its identity plus any business facts that are filled in. */
function studioBotProps() {
  const props = { name: state.name, role: state.role, company: state.company, website: "https://bot.computer" };
  for (const { key } of BOT_FACTS) props[key] = state.facts[key] || "";
  return props;
}

let ttsReady = false;
let ttsFailed = false;
const arcticCache = new Map();

// Hero showcase runtime
let heroPersonaIdx = 0;
let heroVoice = null;
let heroAiml = new AIMLEngine();
const heroAnim = createAnimState();
const heroPointer = { nx: 0, ny: 0, active: false };
const heroAudio = { ctx: null, src: null, speech: null, startAt: 0, playing: false, cueTimeline: null, silentCueStartMs: 0, anim: heroAnim };
let heroCaption = { words: [], labels: [], chunks: [], chunkIdx: -1, key: "" };

// Studio runtime
let studioVoice = null;
let studioAiml = new AIMLEngine();
const studioAnim = createAnimState();
const studioPointer = { nx: 0, ny: 0, active: false };
const studioAudio = { ctx: null, src: null, speech: null, startAt: 0, playing: false, cueTimeline: null, silentCueStartMs: 0, anim: studioAnim };
let previewWidgetHandle = null;
let previewSyncTimer = 0;
let previewMountSeq = 0;
let currentSnippetCode = "";
let stageShapeBeforeCutout = "card";
let savedVoiceSettings = null; // voice restored from autosave, applied once tts.wasm is ready

// tts.wasm 1.2 refitted the two default voices to real speakers, which moved their vocal tract length.
// A design saved before that holds the old default as if it had been chosen, so it is moved to the new
// one, once: anything saved from now on carries `voiceTuning` and is left exactly as it was set.
const VOICE_TUNING = 2;
const RETUNED_TRACT_CM = { male: [17.5, 17.0], female: [13.9, 14.2] };

function retuneSavedVoice(voice, savedWith) {
  if (!voice || typeof voice !== "object" || Number(savedWith?.voiceTuning) >= VOICE_TUNING) return voice;
  const [before, now] = RETUNED_TRACT_CM[voice.gender] || [];
  return before && Math.abs(Number(voice.tractLengthCm) - before) < 0.005 ? { ...voice, tractLengthCm: now } : voice;
}

// ============================================================================
// Small UI helpers: icons, button labels, toasts, clipboard
// ============================================================================

const SVG_NS = "http://www.w3.org/2000/svg";
const clamp01 = (v) => Math.max(0, Math.min(1, Number(v) || 0));

function iconEl(id) {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", "ic");
  svg.setAttribute("aria-hidden", "true");
  const use = document.createElementNS(SVG_NS, "use");
  use.setAttribute("href", `#i-${id}`);
  svg.appendChild(use);
  return svg;
}

/** Swaps the icon and/or label of a button built as `<svg class="ic"><use/></svg><span class="btn-label">`. */
function setBtn(btn, { icon, label } = {}) {
  if (!btn) return;
  if (icon) btn.querySelector("use")?.setAttribute("href", `#i-${icon}`);
  if (label !== undefined) {
    const span = btn.querySelector(".btn-label");
    if (span) span.textContent = label;
  }
}

function toast(message, { error = false, ms = 2800 } = {}) {
  const host = $("toastHost");
  if (!host) return;
  const el = document.createElement("div");
  el.className = `toast${error ? " is-error" : ""}`;
  const text = document.createElement("span");
  text.textContent = message;
  el.append(iconEl(error ? "x" : "check"), text);
  host.appendChild(el);
  while (host.children.length > 3) host.firstChild.remove();
  setTimeout(() => {
    el.classList.add("is-leaving");
    setTimeout(() => el.remove(), 220);
  }, ms);
}

async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}
  // Fallback for non-secure contexts (plain http on a LAN address, file://)
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:-1000px;opacity:0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

/** Two-step confirm for destructive buttons: first click arms it, second click within 3.5 s runs it. */
function armConfirm(btn, confirmLabel, action) {
  let armedTimer = 0;
  const labelNode = [...btn.childNodes].find((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
  const original = labelNode ? labelNode.textContent : "";
  const disarm = () => {
    clearTimeout(armedTimer);
    armedTimer = 0;
    btn.classList.remove("active-pill");
    if (labelNode) labelNode.textContent = original;
  };
  btn.addEventListener("click", () => {
    if (armedTimer) {
      disarm();
      action();
      return;
    }
    btn.classList.add("active-pill");
    if (labelNode) labelNode.textContent = confirmLabel;
    armedTimer = setTimeout(disarm, 3500);
  });
  btn.addEventListener("blur", disarm);
}

// ============================================================================
// Theme switcher (system / light / dark), remembered in this browser
// ============================================================================

const THEME_MODES = ["auto", "light", "dark"];
const THEME_META = {
  auto: { icon: "auto", label: "Theme: match system" },
  light: { icon: "sun", label: "Theme: light" },
  dark: { icon: "moon", label: "Theme: dark" },
};
let themeMode = "auto";

function applyTheme(mode, persist = true) {
  themeMode = THEME_MODES.includes(mode) ? mode : "auto";
  if (themeMode === "auto") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", themeMode);
  if (persist) {
    try {
      if (themeMode === "auto") localStorage.removeItem("bc-theme");
      else localStorage.setItem("bc-theme", themeMode);
    } catch {}
  }
  const btn = $("themeToggleBtn");
  const meta = THEME_META[themeMode];
  setBtn(btn, { icon: meta.icon });
  btn.title = meta.label;
  btn.setAttribute("aria-label", `${meta.label}. Click to switch.`);
}

function cycleTheme() {
  applyTheme(THEME_MODES[(THEME_MODES.indexOf(themeMode) + 1) % THEME_MODES.length]);
}

// ============================================================================
// Autosave: the studio design is kept in localStorage so a refresh doesn't lose it
// ============================================================================

const STORE_KEY = "bc-studio-v1";
let autosaveTimer = 0;
let storageWorks = true;

function snapshotStudio() {
  return {
    v: 1,
    voiceTuning: VOICE_TUNING,
    activePresetId: state.activePresetId,
    name: state.name,
    role: state.role,
    company: state.company,
    greeting: state.greeting,
    chatEnabled: state.chatEnabled,
    baseBrain: state.baseBrain,
    facts: state.facts,
    aimlPackId: state.aimlPackId,
    aimlXml: state.aimlXml,
    avatar: state.avatar,
    voiceBaseId: state.voiceBaseId,
    voice: studioVoice ? studioVoice.settings : savedVoiceSettings,
    persona: state.persona,
    embedOpts: state.embedOpts,
    auditionText: $("auditionText").value,
  };
}

function scheduleAutosave() {
  if (!storageWorks) return;
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(snapshotStudio()));
    } catch {
      storageWorks = false;
      $("autosaveNote").hidden = true;
    }
  }, 500);
}

/** Applies a saved or imported configuration object to `state`. Returns false if it isn't usable. */
function applyConfigObject(cfg) {
  if (!cfg || typeof cfg !== "object" || Array.isArray(cfg)) return false;
  const str = (v, max) => (typeof v === "string" && v.trim() ? v.slice(0, max) : null);

  state.name = str(cfg.name, 40) ?? state.name;
  state.role = str(cfg.role, 60) ?? state.role;
  state.company = str(cfg.company, 60) ?? state.company;
  if (typeof cfg.greeting === "string") state.greeting = cfg.greeting;
  if (cfg.chatEnabled !== undefined) state.chatEnabled = Boolean(cfg.chatEnabled);
  state.baseBrain = cfg.baseBrain === undefined ? true : Boolean(cfg.baseBrain);
  state.facts = cleanFacts(cfg.facts);
  if (cfg.avatar && typeof cfg.avatar === "object") state.avatar = { ...DEFAULT_AVATAR, ...cfg.avatar };
  if (typeof cfg.aimlXml === "string" && cfg.aimlXml.trim()) state.aimlXml = cfg.aimlXml;
  state.aimlPackId = typeof cfg.aimlPackId === "string" ? cfg.aimlPackId : "";
  state.activePresetId = typeof cfg.activePresetId === "string" ? cfg.activePresetId : "custom";
  state.voiceBaseId = typeof cfg.voiceBaseId === "string" ? cfg.voiceBaseId : "";
  state.persona = normalizePersona(cfg.persona); // a bot saved before personalities has none

  // Embed options are stored nested by autosave and flat by "Save config" / exported bots.
  const eo = cfg.embedOpts && typeof cfg.embedOpts === "object" ? cfg.embedOpts : cfg;
  const o = state.embedOpts;
  if (eo.position === "bottom-left" || eo.position === "bottom-right") o.position = eo.position;
  if (["compact", "standard", "large"].includes(eo.size)) o.size = eo.size;
  for (const key of ["eyeTracking", "showCaptions", "autoGreet", "chatStartOpen"]) {
    if (eo[key] !== undefined) o[key] = Boolean(eo[key]);
  }
  return true;
}

function restoreSavedStudio() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (!saved || saved.v !== 1 || !applyConfigObject(saved)) return;
    if (saved.voice && typeof saved.voice === "object") savedVoiceSettings = retuneSavedVoice(saved.voice, saved);
    if (typeof saved.auditionText === "string") $("auditionText").value = saved.auditionText;
  } catch {
    // Unreadable or blocked storage: start from the default bot.
  }
}

// ============================================================================
// Undo / redo for the avatar's look (shape, colors, hair, outfit, framing)
// ============================================================================

const undoHistory = { stack: [], index: -1, timer: 0 };

function updateHistoryButtons() {
  $("undoBtn").disabled = undoHistory.index <= 0;
  $("redoBtn").disabled = undoHistory.index >= undoHistory.stack.length - 1;
}

function commitHistory() {
  clearTimeout(undoHistory.timer);
  const snap = JSON.stringify(state.avatar);
  if (undoHistory.stack[undoHistory.index] === snap) return;
  undoHistory.stack.splice(undoHistory.index + 1);
  undoHistory.stack.push(snap);
  if (undoHistory.stack.length > 80) undoHistory.stack.shift();
  undoHistory.index = undoHistory.stack.length - 1;
  updateHistoryButtons();
}

function commitHistorySoon() {
  clearTimeout(undoHistory.timer);
  undoHistory.timer = setTimeout(commitHistory, 350);
}

function stepHistory(dir) {
  commitHistory(); // flush an edit still inside the debounce window so it can be redone
  const next = undoHistory.index + dir;
  if (next < 0 || next >= undoHistory.stack.length) return;
  undoHistory.index = next;
  state.avatar = JSON.parse(undoHistory.stack[next]);
  markCustomArchetype();
  syncAllAvatarControls();
  schedulePreviewSync();
  updateHistoryButtons();
}

// ============================================================================
// Voice scope: rolling traces of what the vocal tract is doing
// ============================================================================

const SCOPE_WINDOW_MS = 3600;

const SCOPE_CHANNELS = {
  jaw: { color: "#6aa6ff", read: (a) => a.jaw },
  tongue: { color: "#f47cc4", read: (a) => Math.max(a.tH, a.tTip * 0.9) },
  lips: { color: "#ff7a93", read: (a) => Math.max(a.lipR, a.lipC, a.lipS) },
  nasal: { color: "#f7b73b", read: (a) => a.velum },
  voice: { color: "#34d6bf", read: (a) => a.voicing },
};

class VoiceScope {
  /** `lanes: true` gives each channel its own row; otherwise the traces share one baseline. */
  constructor(canvas, channelIds, { lanes = false } = {}) {
    this.canvas = canvas;
    this.channels = channelIds.map((id) => SCOPE_CHANNELS[id]);
    this.lanes = lanes;
    this.samples = [];
  }

  push(nowMs, anim) {
    this.samples.push({ t: nowMs, v: this.channels.map((c) => clamp01(c.read(anim))) });
    const cutoff = nowMs - SCOPE_WINDOW_MS - 250;
    while (this.samples.length && this.samples[0].t < cutoff) this.samples.shift();
  }

  draw(nowMs, dpr) {
    const c = this.canvas;
    const cssW = c.clientWidth;
    const cssH = c.clientHeight;
    if (!cssW || !cssH) return;
    const w = Math.round(cssW * dpr);
    const h = Math.round(cssH * dpr);
    if (c.width !== w || c.height !== h) {
      c.width = w;
      c.height = h;
    }
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, w, h);

    const n = this.channels.length;
    const pad = 3 * dpr;
    const laneH = this.lanes ? h / n : h;
    const t0 = nowMs - SCOPE_WINDOW_MS;
    const xOf = (t) => ((t - t0) / SCOPE_WINDOW_MS) * w;

    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    for (let i = 0; i < n; i++) {
      const base = (this.lanes ? i * laneH : 0) + laneH - pad;
      const amp = laneH - pad * 2;

      ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
      ctx.lineWidth = dpr;
      ctx.beginPath();
      ctx.moveTo(0, base);
      ctx.lineTo(w, base);
      ctx.stroke();

      if (this.samples.length < 2) continue;
      const color = this.channels[i].color;
      ctx.beginPath();
      let firstX = 0;
      let lastX = 0;
      this.samples.forEach((s, k) => {
        const x = xOf(s.t);
        const y = base - s.v[i] * amp;
        if (k === 0) {
          firstX = x;
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        lastX = x;
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5 * dpr;
      ctx.stroke();

      ctx.lineTo(lastX, base);
      ctx.lineTo(firstX, base);
      ctx.closePath();
      ctx.globalAlpha = this.lanes ? 0.2 : 0.13;
      ctx.fillStyle = color;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
}

let heroScope = null;
let studioScope = null;

// ============================================================================
// Shared Web Audio speech player (hero and studio stages)
// ============================================================================

function stopChannel(chan, onStopUi) {
  if (chan.src) {
    chan.src.onended = null;
    try {
      chan.src.stop();
    } catch {}
    chan.src = null;
  }
  chan.playing = false;
  chan.speech = null;
  chan.cueTimeline = null;
  chan.silentCueStartMs = 0;
  if (chan.anim) setAvatarMood(chan.anim, chan.restMood || "");
  if (onStopUi) onStopUi();
}

/** Plays a line's gestures without audio, paced at reading speed (voice not ready, or a line that is only actions). */
function playCuesSilently(chan, cues) {
  chan.cueTimeline = estimateCueTimeline(cues);
  chan.silentCueStartMs = performance.now();
}

/** Called every frame for a channel that is not playing audio. */
function runSilentCues(chan, nowMs) {
  if (!chan.cueTimeline || !chan.silentCueStartMs) return;
  runDueCues(chan.anim, chan.cueTimeline, (performance.now() - chan.silentCueStartMs) / 1000, nowMs);
  if (chan.cueTimeline.next >= chan.cueTimeline.items.length) {
    chan.cueTimeline = null;
    chan.silentCueStartMs = 0;
  }
}

/**
 * Speaks `rawText` on a channel. Inline avatar actions (`[wave]`, `[wink]`, ...) are taken out of the
 * speech and scheduled against the synthesizer's word timings; pass `cues` when they are already parsed.
 */
async function playOnChannel(chan, voiceInst, rawText, { cues = null, cueWords = 0, onStart, onEnd } = {}) {
  const parsed = cues ? { speechText: String(rawText), cues, wordCount: cueWords } : parseSpeechCues(rawText);
  stopChannel(chan);
  // A line can be all sound and no words ("[laugh]"): that is still something for the voice to do.
  if (!voiceInst || !(stripSpeechTags(parsed.speechText) || parsed.cues.some((c) => c.sound))) {
    playCuesSilently(chan, parsed.cues);
    return null;
  }

  const Ctx = window.AudioContext || window.webkitAudioContext;
  chan.ctx ??= new Ctx();
  if (chan.ctx.state === "suspended") {
    await chan.ctx.resume();
  }

  const t0 = performance.now();
  const textStr = parsed.speechText;
  const speech = /\[[a-zA-Z_/]/.test(textStr)
    ? voiceInst.speakScript(textStr)
    : voiceInst.speak(textStr);
  const synthMs = Math.max(0.2, performance.now() - t0);

  if (!speech || !speech.samples || !speech.samples.length) {
    playCuesSilently(chan, parsed.cues);
    return null;
  }

  const buffer = chan.ctx.createBuffer(1, speech.samples.length, speech.sampleRate);
  buffer.copyToChannel(speech.samples, 0);
  const src = chan.ctx.createBufferSource();
  src.buffer = buffer;
  src.connect(chan.ctx.destination);

  chan.src = src;
  chan.speech = speech;
  chan.cueTimeline = buildCueTimeline(speech, parsed.cues, parsed.wordCount);
  chan.silentCueStartMs = 0;
  chan.startAt = chan.ctx.currentTime + 0.015;
  chan.playing = true;

  if (onStart) onStart(speech, synthMs);
  src.start(chan.startAt);
  src.onended = () => {
    // Fire anything still pending (a gesture written at the very end of the line), then relax the face.
    runDueCues(chan.anim, chan.cueTimeline, Infinity);
    chan.cueTimeline = null;
    if (chan.anim) setAvatarMood(chan.anim, chan.restMood || "");
    chan.playing = false;
    chan.speech = null;
    chan.src = null;
    if (onEnd) onEnd(speech);
  };
  return speech;
}

async function loadArcticProfile(profileId) {
  if (arcticCache.has(profileId)) return arcticCache.get(profileId);
  const r = await fetch(`./vendor/tts/profiles/${profileId}.json`);
  if (!r.ok) throw new Error(`Could not load ${profileId}`);
  const data = await r.json();
  arcticCache.set(profileId, data);
  return data;
}

async function applyPresetVoiceToInstance(voiceInst, presetObj) {
  if (!voiceInst) return;
  if (presetObj.voicePreset && presetObj.voicePreset.startsWith("arctic_")) {
    try {
      const prof = await loadArcticProfile(presetObj.voicePreset);
      voiceInst.configure(prof);
    } catch {
      voiceInst.configure(presetObj.voiceOverrides?.gender || "female");
    }
  } else if (presetObj.voicePreset) {
    voiceInst.configure(presetObj.voicePreset);
  }
  if (presetObj.voiceOverrides) {
    voiceInst.configure(presetObj.voiceOverrides);
  }
}

function voiceUnavailableMessage() {
  return ttsFailed
    ? "The voice engine could not load, so speech is unavailable. Reload the page to try again."
    : "The voice is still loading. Try again in a moment.";
}

// ============================================================================
// 1. Hero showcase and chat
// ============================================================================

function resetHeroSpeakUi() {
  setBtn($("heroSpeakBtn"), { icon: "play", label: "Hear the greeting" });
  $("heroCaptionBubble").hidden = true;
  heroCaption.chunkIdx = -1;
  heroCaption.key = "";
}

async function selectHeroPersona(idx, speakGreeting = false) {
  heroPersonaIdx = idx;
  const preset = AVATAR_PRESETS[idx] || AVATAR_PRESETS[0];

  for (const btn of $("heroPersonaPills").children) {
    const on = Number(btn.dataset.presetIdx) === idx;
    btn.classList.toggle("active", on);
    btn.setAttribute("aria-pressed", String(on));
  }
  $("heroBotName").textContent = preset.name;
  $("heroBotRole").textContent = preset.role;
  $("heroChatInput").placeholder = `Ask ${preset.name} a question…`;

  stopChannel(heroAudio, resetHeroSpeakUi);

  heroAiml = new AIMLEngine({
    botProps: { name: preset.name, role: preset.role, company: "bot.computer", website: "https://bot.computer" },
    xml: STARTER_AIML_PACKS.concierge.xml,
    baseXml: BASE_AIML_XML,
    persona: preset.persona,
  });
  heroAudio.restMood = heroAiml.persona ? heroAiml.persona.mood : "";
  setAvatarMood(heroAnim, heroAudio.restMood);

  // Get the matcher up to speed before the first question is typed.
  const warming = heroAiml;
  setTimeout(() => warming.warmUp(), 300);

  $("heroChatLog").replaceChildren();
  addChatBubble($("heroChatLog"), "bot", stripSpeechTags(preset.greeting));
  renderQuickChipBar($("heroQuickChips"), heroAiml.quickChips, (q) => askHeroBot(q));

  if (heroVoice) {
    await applyPresetVoiceToInstance(heroVoice, preset);
    // Ignore a stale selection if the visitor clicked another persona while the profile loaded.
    if (speakGreeting && heroPersonaIdx === idx) {
      speakHeroLine(preset.greeting, "wave");
    }
  }
}

/** Splits a spoken line into short caption lines and maps tts.wasm word timings onto the display words. */
function prepareHeroCaption(speech) {
  const words = speech.words || [];
  const tokens = String(speech.text || "").split(/\s+/).filter(Boolean);
  // A sound the voice makes is reported as "[laugh]"; the caption says "(laughs)".
  const labels = (tokens.length === words.length ? tokens : words.map((w) => w.word)).map(captionForSpokenWord);
  const chunks = [];
  let cur = [];
  labels.forEach((label, i) => {
    cur.push(i);
    if (/[.!?…]["')\]]?$/.test(label) || cur.length >= 9) {
      chunks.push(cur);
      cur = [];
    }
  });
  if (cur.length) chunks.push(cur);
  heroCaption = { words, labels, chunks, chunkIdx: -1, key: "", text: stripSpeechTags(speech.text || "") };
}

function updateHeroCaption(tSec) {
  const cap = heroCaption;
  const bubble = $("heroCaptionBubble");
  if (!cap.words.length) {
    if (cap.key !== "static" && cap.text) {
      bubble.textContent = cap.text;
      bubble.hidden = false;
      cap.key = "static";
    }
    return;
  }

  let started = 0; // index of the latest word that has begun
  let active = -1; // index of the word being spoken right now, if any
  for (let i = 0; i < cap.words.length; i++) {
    if (tSec >= cap.words[i].start) {
      started = i;
      if (tSec < cap.words[i].end) active = i;
    } else break;
  }

  const key = `${started}:${active}`;
  if (key === cap.key) return;
  cap.key = key;

  const chunkIdx = cap.chunks.findIndex((ch) => ch.includes(started));
  if (chunkIdx !== cap.chunkIdx) {
    cap.chunkIdx = chunkIdx;
    bubble.replaceChildren();
    for (const wi of cap.chunks[chunkIdx] || []) {
      const span = document.createElement("span");
      span.dataset.wi = String(wi);
      span.textContent = cap.labels[wi];
      bubble.append(span, " ");
    }
    bubble.hidden = false;
  }
  for (const span of bubble.children) {
    const wi = Number(span.dataset.wi);
    span.className = wi === active ? "now" : wi < started || (wi === started && active === -1) ? "said" : "";
  }
}

function speakHeroLine(text, emote = "", cueOpts = {}) {
  if (emote) triggerAvatarEmote(heroAnim, emote);
  if (!heroVoice) {
    toast(voiceUnavailableMessage(), { error: ttsFailed });
    stopChannel(heroAudio);
    playCuesSilently(heroAudio, cueOpts.cues || parseSpeechCues(text).cues);
    return;
  }
  playOnChannel(heroAudio, heroVoice, text, {
    ...cueOpts,
    onStart(speech) {
      prepareHeroCaption(speech);
      setBtn($("heroSpeakBtn"), { icon: "stop", label: "Stop" });
    },
    onEnd: resetHeroSpeakUi,
  }).catch((err) => {
    resetHeroSpeakUi();
    toast(`Could not speak that line: ${err.message}`, { error: true });
  });
}

/** Runs `fn` once the browser has painted, so new text is on screen before heavier work starts. */
function afterPaint(fn) {
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    fn();
  };
  requestAnimationFrame(() => setTimeout(run, 0));
  setTimeout(run, 80); // animation frames do not fire in a background tab
}

/** Wakes a channel's audio output; called inside the click or key press that asked for sound. */
function unlockChannelAudio(chan) {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;
  chan.ctx ??= new Ctx();
  if (chan.ctx.state === "suspended") chan.ctx.resume().catch(() => {});
}

// Matching a question takes about a millisecond, so the answer is on screen the moment Send is
// pressed. The voice (a few more milliseconds to render) starts right after that first paint.
function askHeroBot(question) {
  const q = String(question || "").trim();
  if (!q) return;
  const log = $("heroChatLog");
  const engine = heroAiml;
  addChatBubble(log, "user", q);
  const res = engine.reply(q);
  addChatBubble(log, "bot", res.displayText);
  renderQuickChipBar($("heroQuickChips"), res.chips.length ? res.chips : engine.quickChips, (nextQ) => askHeroBot(nextQ));
  unlockChannelAudio(heroAudio);
  afterPaint(() => {
    if (engine !== heroAiml) return; // the persona was switched in the meantime
    speakHeroLine(res.speechText, "", { cues: res.cues, cueWords: res.cueWords });
  });
}

function toggleHeroGreeting() {
  if (heroAudio.playing) {
    stopChannel(heroAudio, resetHeroSpeakUi);
  } else {
    const p = AVATAR_PRESETS[heroPersonaIdx] || AVATAR_PRESETS[0];
    speakHeroLine(p.greeting, "wave");
  }
}

function initHeroSection() {
  const heroPersonas = [0, 1, 2, 4]; // Aria, Marcus, Chloe, Nova-7
  const pillsHost = $("heroPersonaPills");
  for (const presetIdx of heroPersonas) {
    const p = AVATAR_PRESETS[presetIdx];
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "persona-pill";
    btn.dataset.presetIdx = String(presetIdx);
    btn.textContent = p.name;
    btn.onclick = () => selectHeroPersona(presetIdx, true);
    pillsHost.appendChild(btn);
  }

  selectHeroPersona(0, false);

  $("heroSpeakBtn").onclick = toggleHeroGreeting;
  $("heroAvatarBox").onclick = toggleHeroGreeting;
  $("heroAvatarBox").addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleHeroGreeting();
    }
  });

  $("heroWaveBtn").onclick = () => {
    triggerAvatarEmote(heroAnim, "wave");
  };

  $("heroChatForm").onsubmit = (e) => {
    e.preventDefault();
    const val = $("heroChatInput").value.trim();
    if (!val) return;
    $("heroChatInput").value = "";
    askHeroBot(val);
  };

  heroScope = new VoiceScope($("heroScopeCanvas"), ["jaw", "lips", "voice"]);
}

// ============================================================================
// 2. Studio controls, sliders and on-canvas sculpting
// ============================================================================

function addChatBubble(container, role, text, metaText = "") {
  const div = document.createElement("div");
  div.className = `chat-bubble ${role}`;
  div.textContent = text;
  if (metaText) {
    const meta = document.createElement("span");
    meta.className = "match-meta";
    meta.textContent = metaText;
    div.appendChild(meta);
  }
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function renderQuickChipBar(container, chips, onSelect) {
  container.replaceChildren();
  for (const item of (chips || []).slice(0, 5)) {
    const label = typeof item === "string" ? item : item.label;
    const query = typeof item === "string" ? item : item.query || item.label;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "quick-chip";
    btn.textContent = label;
    btn.onclick = () => onSelect(query);
    container.appendChild(btn);
  }
}

function formatSliderVal(val, step, unit) {
  const decimals = step >= 1 ? 0 : step >= 0.1 ? 1 : 2;
  return `${Number(val).toFixed(decimals)}${unit}`;
}

/** Updates one avatar slider's value label and marks it when it differs from the default. */
function paintAvatarSlider(input) {
  const key = input.dataset.avKey;
  const valBtn = $(`val_av_${key}`);
  if (!valBtn) return;
  const v = Number(input.value);
  valBtn.textContent = formatSliderVal(v, Number(input.step) || 0.01, input.dataset.unit || "");
  valBtn.classList.toggle("is-changed", Math.abs(v - Number(DEFAULT_AVATAR[key])) > 1e-9);
}

function buildAvatarSliders(hostId, defs) {
  const host = $(hostId);
  host.replaceChildren();
  for (const [key, label, min, max, step, unit] of defs) {
    const wrap = document.createElement("div");
    wrap.className = "slider-item";
    const id = `sl_av_${key}`;
    const initVal = state.avatar[key] ?? DEFAULT_AVATAR[key] ?? 1;
    wrap.innerHTML = `
      <div class="slider-top">
        <label for="${id}">${label}</label>
        <button type="button" class="slider-val" id="val_av_${key}" title="Reset to default" aria-label="Reset ${label} to default"></button>
      </div>
      <input type="range" id="${id}" data-av-key="${key}" data-unit="${unit}" min="${min}" max="${max}" step="${step}" value="${initVal}">
    `;
    const input = wrap.querySelector("input");
    input.addEventListener("input", () => {
      state.avatar[key] = Number(input.value);
      paintAvatarSlider(input);
      markCustomArchetype();
      syncBodyBuildPills();
      schedulePreviewSync();
    });
    const resetVal = () => {
      const def = DEFAULT_AVATAR[key];
      state.avatar[key] = def;
      input.value = def;
      paintAvatarSlider(input);
      markCustomArchetype();
      syncBodyBuildPills();
      schedulePreviewSync();
    };
    input.addEventListener("dblclick", resetVal);
    wrap.querySelector(".slider-val").addEventListener("click", resetVal);
    host.appendChild(wrap);
    paintAvatarSlider(input);
  }
}

function buildVoiceSliders() {
  const host = $("voiceSlidersHost");
  host.replaceChildren();
  for (const [key, label, min, max, step, unit] of VOICE_SLIDERS) {
    const wrap = document.createElement("div");
    wrap.className = "slider-item";
    const id = `sl_vc_${key}`;
    wrap.innerHTML = `
      <div class="slider-top">
        <label for="${id}">${label}</label>
        <span class="slider-val static" id="val_vc_${key}">…</span>
      </div>
      <input type="range" id="${id}" data-vc-key="${key}" data-unit="${unit}" min="${min}" max="${max}" step="${step}" value="${min}" disabled>
    `;
    const input = wrap.querySelector("input");
    input.addEventListener("input", () => {
      if (!studioVoice) return;
      const v = Number(input.value);
      studioVoice.configure({ [key]: v });
      $(`val_vc_${key}`).textContent = formatSliderVal(v, step, unit);
      schedulePreviewSync();
    });
    input.addEventListener("change", () => {
      if ($("autoAuditionVoiceCheck").checked) {
        speakStudioLine(`Testing ${state.name}'s voice.`);
      }
    });
    host.appendChild(wrap);
  }
}

function syncSwatchGroup(hostId, hex) {
  const want = String(hex || "").toLowerCase();
  for (const btn of $(hostId).children) {
    const on = btn.dataset.hex.toLowerCase() === want;
    btn.classList.toggle("active", on);
    btn.setAttribute("aria-pressed", String(on));
  }
}

/** Highlights a quick build only while every one of its proportions still matches. */
function syncBodyBuildPills() {
  for (const btn of $("bodyBuildPills").children) {
    const build = BODY_BUILDS[btn.dataset.build];
    const on = Boolean(build) && Object.entries(build).every(([k, v]) => Math.abs(Number(state.avatar[k]) - v) < 1e-9);
    btn.classList.toggle("active", on);
    btn.setAttribute("aria-pressed", String(on));
  }
}

function setSegActive(segEl, predicate) {
  for (const btn of segEl.querySelectorAll("button")) {
    const on = predicate(btn);
    btn.classList.toggle("active", on);
    btn.setAttribute("aria-pressed", String(on));
  }
}

function syncAllAvatarControls() {
  const av = state.avatar;

  setSegActive($("framingSeg"), (b) => b.dataset.framing === av.framing);
  setSegActive($("genderStyleSeg"), (b) => b.dataset.gstyle === av.genderStyle);

  for (const input of document.querySelectorAll("input[data-av-key]")) {
    const val = av[input.dataset.avKey];
    if (val !== undefined) {
      input.value = val;
      paintAvatarSlider(input);
    }
  }

  $("postureSelect").value = av.posture || "welcoming";
  $("stageShapeSelect").value = av.stageShape || "card";
  $("bgStyleSelect").value = av.bgStyle || "studio_dark";
  $("bgColorPicker").value = av.bgColor || "#141b2d";
  $("bgAccentPicker").value = av.bgAccent || "#2b6cb0";
  $("haloGlowCheck").checked = av.haloGlow !== false;

  $("skinColorPicker").value = av.skinColor || "#f1c6b0";
  $("earStyleSelect").value = av.earStyle || "human";
  $("lashStyleSelect").value = av.lashStyle || "lush";
  $("irisColorPicker").value = av.irisColor || "#3b82a6";
  $("lipColorPicker").value = av.lipColor || "#d6687c";

  $("hairColorPicker").value = av.hairColor || "#3c2734";
  $("hairHighlightPicker").value = av.hairHighlight || "#7b546c";
  $("facialHairSelect").value = av.facialHair || "none";

  $("outfitPrimaryPicker").value = av.outfitPrimary || "#1e2f4d";
  $("outfitSecondaryPicker").value = av.outfitSecondary || "#f4f6fb";
  $("outfitAccentPicker").value = av.outfitAccent || "#38bdf8";

  $("glassesSelect").value = av.glasses || "none";
  $("glassesColorPicker").value = av.glassesColor || "#1f2430";
  $("headsetMicCheck").checked = Boolean(av.headsetMic);
  $("nameBadgeCheck").checked = Boolean(av.nameBadge);
  $("headwearSelect").value = av.headwear || "none";
  $("headwearColorPicker").value = av.headwearColor || "#b4452f";
  $("earringsSelect").value = av.earrings || "none";
  $("earringColorPicker").value = av.earringColor || "#e6c35c";
  $("neckwearSelect").value = av.neckwear || "none";
  $("neckwearColorPicker").value = av.neckwearColor || "#d9a441";
  $("fringeCheck").checked = Boolean(av.fringe);
  $("beautyMarkCheck").checked = Boolean(av.beautyMark);
  $("noseStudCheck").checked = Boolean(av.noseStud);
  $("broochSelect").value = av.brooch || "none";
  $("broochColorPicker").value = av.broochColor || "#e6c35c";
  $("oddEyesCheck").checked = Boolean(av.irisColor2);
  if (av.irisColor2) $("irisColor2Picker").value = av.irisColor2;
  $("eyeshadowColorPicker").value = av.eyeshadowColor || "#7a5c8f";
  // An empty brow color means "follow the hair", so show the hair color until one is picked.
  $("browColorPicker").value = av.browColor || av.hairColor || "#3c2734";
  $("browMatchHairBtn").disabled = !av.browColor;

  for (const btn of $("hairStylePills").children) {
    const on = btn.dataset.val === av.hairStyle;
    btn.classList.toggle("active", on);
    btn.setAttribute("aria-pressed", String(on));
  }
  for (const btn of $("outfitStylePills").children) {
    const on = btn.dataset.val === av.outfitStyle;
    btn.classList.toggle("active", on);
    btn.setAttribute("aria-pressed", String(on));
  }
  syncSwatchGroup("skinSwatches", av.skinColor);
  syncSwatchGroup("irisSwatches", av.irisColor);
  syncSwatchGroup("lipSwatches", av.lipColor);
  syncSwatchGroup("hairSwatches", av.hairColor);
  syncBodyBuildPills();

  // Backdrop colors only apply to the "Custom colors" backdrop; the frame is fixed while cut out.
  const bgLocked = av.framing === "cutout" || av.stageShape === "cutout" || av.bgStyle === "transparent";
  $("bgStyleSelect").disabled = av.framing === "cutout" || av.stageShape === "cutout";
  $("customBgColorsWrap").classList.toggle("is-dimmed", bgLocked);
}

function syncIdentityControls() {
  $("botNameInput").value = state.name;
  $("botRoleInput").value = state.role;
  $("botCompanyInput").value = state.company;
  $("botGreetingInput").value = state.greeting;
  $("chatEnabledCheck").checked = state.chatEnabled;
  $("baseBrainCheck").checked = state.baseBrain;
  for (const input of document.querySelectorAll("input[data-fact]")) {
    input.value = state.facts[input.dataset.fact] || "";
  }
  $("aimlXmlEditor").value = state.aimlXml;
  for (const btn of $("aimlPackPills").children) {
    const on = btn.dataset.packId === state.aimlPackId;
    btn.classList.toggle("active", on);
    btn.setAttribute("aria-pressed", String(on));
  }
  for (const card of $("studioPresetStrip").querySelectorAll(".archetype-card")) {
    const on = card.dataset.presetId === state.activePresetId;
    card.classList.toggle("active", on);
    card.setAttribute("aria-pressed", String(on));
  }
}

function syncEmbedControls() {
  const o = state.embedOpts;
  $("embedPositionSelect").value = o.position;
  $("embedSizeSelect").value = o.size;
  $("embedEyeTrackCheck").checked = o.eyeTracking;
  $("embedCaptionsCheck").checked = o.showCaptions;
  $("embedAutoGreetCheck").checked = o.autoGreet;
  $("embedStartOpenCheck").checked = o.chatStartOpen;
}

function syncVoiceControls() {
  if (!studioVoice) return;
  const s = studioVoice.settings;
  setSegActive($("voiceGenderSeg"), (b) => b.dataset.vgender === s.gender);
  setSegActive($("glottalSourceSeg"), (b) => (b.dataset.folds === "true") === Boolean(s.folds));
  $("voiceWhisperCheck").checked = Boolean(s.whisper);

  for (const input of document.querySelectorAll("input[data-vc-key]")) {
    const key = input.dataset.vcKey;
    input.disabled = false;
    if (s[key] !== undefined) {
      input.value = s[key];
      const span = $(`val_vc_${key}`);
      if (span) {
        span.textContent = formatSliderVal(s[key], Number(input.step) || 0.01, input.dataset.unit || "");
      }
    }
  }
  for (const btn of document.querySelectorAll("#voicePresetPills button, #voiceArcticPills button")) {
    const on = btn.dataset.voiceId === state.voiceBaseId;
    btn.classList.toggle("active", on);
    btn.setAttribute("aria-pressed", String(on));
  }
}

function markCustomArchetype() {
  if (state.activePresetId === "custom") return;
  state.activePresetId = "custom";
  for (const card of $("studioPresetStrip").querySelectorAll(".archetype-card")) {
    card.classList.remove("active");
    card.setAttribute("aria-pressed", "false");
  }
}

/** Call after any change to `state.avatar` made outside a slider. */
function commitAvatarChange() {
  markCustomArchetype();
  syncAllAvatarControls();
  schedulePreviewSync();
}

async function applyStudioPreset(preset, speakAfter = false) {
  state.activePresetId = preset.id;
  state.name = preset.name;
  state.role = preset.role;
  state.greeting = preset.greeting;
  state.avatar = structuredClone(preset.avatar);
  state.voiceBaseId = preset.voicePreset || "";
  state.persona = normalizePersona(preset.persona);
  $("auditionText").value = preset.greeting;

  if (studioVoice) {
    await applyPresetVoiceToInstance(studioVoice, preset);
    syncVoiceControls();
  }
  syncAllAvatarControls();
  syncIdentityControls();
  rebuildStudioAiml();
  syncPersonaControls();
  schedulePreviewSync();

  if (speakAfter) {
    speakStudioLine(preset.greeting, "wave");
  }
}

function setupDesignerCanvasSculpting() {
  const canvas = $("designerCanvas");
  const hud = $("sculptLiveHud");
  let dragInfo = null; // { handle, mirrored, lastX, lastY }

  const canvasCoords = (e) => {
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / Math.max(1, rect.width);
    const sy = canvas.height / Math.max(1, rect.height);
    return {
      x: (e.clientX - rect.left) * sx,
      y: (e.clientY - rect.top) * sy,
      dpr: sx,
    };
  };

  canvas.addEventListener("pointerdown", (e) => {
    if (!state.showSculptHandles) return;
    const { x, y, dpr } = canvasCoords(e);
    const handles = getSculptHandles(canvas.width, canvas.height, state.avatar);
    const hitRadius = (e.pointerType === "touch" ? 34 : 24) * dpr;
    const hit = hitTestSculptHandle(handles, x, y, hitRadius);
    if (!hit) return;

    e.preventDefault();
    dragInfo = { ...hit, lastX: x, lastY: y };
    state.activeSculptId = hit.handle.id;
    hud.hidden = false;
    hud.textContent = hit.handle.label;
    canvas.style.cursor = "grabbing";
    canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener("pointermove", (e) => {
    const { x, y, dpr } = canvasCoords(e);
    if (dragInfo) {
      const rawDx = x - dragInfo.lastX;
      const rawDy = y - dragInfo.lastY;
      dragInfo.lastX = x;
      dragInfo.lastY = y;
      const signedDx = dragInfo.mirrored ? -rawDx : rawDx;
      const patch = dragInfo.handle.apply(signedDx, rawDy, state.avatar);
      Object.assign(state.avatar, patch);
      commitAvatarChange();
      return;
    }

    if (state.showSculptHandles) {
      const handles = getSculptHandles(canvas.width, canvas.height, state.avatar);
      const hit = hitTestSculptHandle(handles, x, y, 22 * dpr);
      state.hoverSculptId = hit ? hit.handle.id : "";
      canvas.style.cursor = hit ? "grab" : "default";
      // Name the handle under the cursor so it's clear what a drag will change.
      hud.hidden = !hit;
      if (hit) hud.textContent = hit.handle.label;
    } else {
      state.hoverSculptId = "";
      canvas.style.cursor = "default";
      hud.hidden = true;
    }
  });

  const endDrag = () => {
    if (dragInfo) $("sculptHintBar").classList.add("is-faded");
    dragInfo = null;
    state.activeSculptId = "";
    hud.hidden = true;
    canvas.style.cursor = "default";
  };
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);
  canvas.addEventListener("pointerleave", () => {
    if (!dragInfo) {
      state.hoverSculptId = "";
      hud.hidden = true;
    }
  });
}

// ============================================================================
// Studio speech, WAV export and randomizer
// ============================================================================

function setStudioStatus(text) {
  $("studioStatusLine").textContent = text;
}

function resetStudioSpeakUi() {
  setBtn($("studioSpeakBtn"), { label: "Speak" });
  $("studioStopBtn").disabled = true;
  setBtn($("mobileQuickSpeakBtn"), { icon: "play", label: "Speak" });
}

function speakStudioLine(text, emote = "", cueOpts = {}) {
  if (emote) triggerAvatarEmote(studioAnim, emote);
  const raw = String(text || "");
  const parsed = cueOpts.cues
    ? { speechText: raw, cues: cueOpts.cues, wordCount: cueOpts.cueWords || 0 }
    : parseSpeechCues(raw);
  // Words, or a sound the voice makes such as "[laugh]": either is something to hear.
  const hasWords = Boolean(stripSpeechTags(parsed.speechText)) || parsed.cues.some((c) => c.sound);
  const actionCount = parsed.cues.filter((c) => c.type === "action").length;

  if (!hasWords && !actionCount) {
    setStudioStatus("Type a line for the bot to say first.");
    return;
  }
  if (!studioVoice || !hasWords) {
    // No voice yet, or a line made only of actions: play the gestures on their own.
    stopChannel(studioAudio, resetStudioSpeakUi);
    playCuesSilently(studioAudio, parsed.cues);
    setStudioStatus(hasWords ? voiceUnavailableMessage() : "Played the actions. Add some words to hear them spoken.");
    return;
  }
  playOnChannel(studioAudio, studioVoice, parsed.speechText, {
    cues: parsed.cues,
    cueWords: parsed.wordCount,
    onStart(speech, synthMs) {
      setBtn($("studioSpeakBtn"), { label: "Replay" });
      $("studioStopBtn").disabled = false;
      setBtn($("mobileQuickSpeakBtn"), { icon: "stop", label: "Stop" });
      const rtf = Math.max(1, Math.round(speech.duration / (synthMs / 1000)));
      const actions = actionCount ? `, ${actionCount} ${actionCount === 1 ? "action" : "actions"}` : "";
      setStudioStatus(`Rendered ${speech.duration.toFixed(2)} s of speech in ${synthMs.toFixed(1)} ms (${rtf}× real time${actions})`);
    },
    onEnd: resetStudioSpeakUi,
  })
    .then((speech) => {
      if (!speech) setStudioStatus("That line produced no audio. Try plain words between the tags.");
    })
    .catch((err) => {
      resetStudioSpeakUi();
      setStudioStatus(`Could not speak that line: ${err.message}`);
    });
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
// Generated hair is a natural shade most of the time, and now and then something bolder.
const NATURAL_HAIR = ["#1b1d26", "#2a1f1c", "#3c2734", "#5c3a28", "#8b4f32", "#a8642c", "#c88d48", "#d6b881", "#94a3b8", "#c9ccd4"];
const BOLD_HAIR = ["#2563eb", "#d946a8", "#7c3aed", "#0f9d8a", "#e0453a"];
const randBetween = (lo, hi) => Number((lo + Math.random() * (hi - lo)).toFixed(2));

function randomFaceTraits(gStyle) {
  return {
    genderStyle: gStyle,
    skinColor: pick(SKIN_TONES.slice(0, 9)).hex,
    blushIntensity: randBetween(0.08, 0.36),
    freckles: Math.random() < 0.25 ? randBetween(0.3, 0.9) : 0,
    ageLines: Math.random() < 0.2 ? randBetween(0.3, 0.9) : 0,
    beautyMark: Math.random() < 0.12,
    dimples: Math.random() < 0.25 ? randBetween(0.4, 1) : 0,
    eyeliner: gStyle === "feminine" && Math.random() < 0.35 ? randBetween(0.4, 0.9) : 0,
    noseStud: Math.random() < 0.08,
    irisColor2: Math.random() < 0.03 ? pick(IRIS_PALETTE) : "",
    eyeshadow: gStyle === "feminine" && Math.random() < 0.4 ? randBetween(0.3, 0.8) : 0,
    eyeshadowColor: pick(["#7a5c8f", "#8b5a2b", "#1f9e8f", "#b0577e", "#4a5d8f"]),
    headWidth: randBetween(0.88, 1.12),
    headHeight: randBetween(0.92, 1.10),
    cheekboneWidth: randBetween(0.90, 1.14),
    jawWidth: randBetween(0.82, 1.16),
    chinLength: randBetween(-0.15, 0.22),
    chinRoundness: randBetween(0.25, 0.88),
    eyeSize: randBetween(0.88, 1.18),
    eyeSpacing: randBetween(0.90, 1.12),
    eyeTilt: randBetween(-0.08, 0.16),
    irisColor: pick(IRIS_PALETTE),
    lashStyle: gStyle === "feminine" ? "lush" : pick(["subtle", "classic"]),
    browThickness: randBetween(0.75, 1.38),
    browArch: randBetween(0.0, 0.42),
    browColor: "",
    noseLength: randBetween(0.88, 1.14),
    noseWidth: randBetween(0.86, 1.16),
    mouthWidth: randBetween(0.88, 1.14),
    lipFullness: randBetween(0.80, 1.28),
    lipColor: pick(LIP_PALETTE),
    restSmile: randBetween(-0.1, 0.6),
    browMood: randBetween(-0.4, 0.6),
    eyeOpen: randBetween(-0.15, 0.2),
  };
}

function randomStyleTraits(masculine) {
  const outfit = pick(OUTFIT_STYLES);
  const traits = {
    hairStyle: pick(HAIR_STYLES).id,
    hairColor: Math.random() < 0.1 ? pick(BOLD_HAIR) : pick(NATURAL_HAIR),
    hairHighlight: "#94a3b8",
    browColor: "", // brows follow the hair
    facialHair: masculine ? pick(["none", "none", "stubble", "beard", "mustache"]) : "none",
    outfitStyle: outfit.id,
    outfitPrimary: pick(["#1e2f4d", "#0f766e", "#3b234a", "#1e293b", "#5b3e31", "#1d4ed8", "#3f3f46"]),
    outfitAccent: pick(["#38bdf8", "#2dd4bf", "#f59e0b", "#fb7185", "#a78bfa", "#34d399"]),
    glasses: pick(["none", "none", "none", "classic", "round", "bold", "cat_eye", "aviator"]),
    headsetMic: Math.random() < 0.3,
    headwear:
      Math.random() < 0.26
        ? pick(masculine ? ["beanie", "cap", "headphones", "beret", "fedora"] : ["beanie", "cap", "headband", "beret", "headphones", "headscarf", "bow", "flower", "fedora", "tiara"])
        : "none",
    brooch: Math.random() < 0.18 ? pick(["round", "star", "heart", "flower"]) : "none",
    broochColor: pick(["#e6c35c", "#d8dde6", "#e04a6b", "#38bdf8", "#34d399"]),
    neckwear: Math.random() < 0.3 ? pick(["necklace", "bowtie", "scarf", "lanyard"]) : "none",
    neckwearColor: pick(["#d9a441", "#c9d3e0", "#b4452f", "#1a5fe6", "#2f6f5e", "#e04a6b"]),
    fringe: Math.random() < 0.2,
    headwearColor: pick(["#b4452f", "#1d4ed8", "#2f6f5e", "#3f3f46", "#6b46c1", "#e04a6b"]),
    earrings: Math.random() < 0.35 ? pick(["studs", "hoops", "drops"]) : "none",
    earringColor: pick(["#e6c35c", "#d8dde6", "#9ad0ff"]),
  };
  if (outfit.id === "cyber") traits.synthFinish = 0.75;
  // Someone in an apron may well be the chef.
  if (outfit.id === "apron" && Math.random() < 0.45) Object.assign(traits, { headwear: "chef", headwearColor: "#f4f6fb", headsetMic: false });
  // A tiara and a headset do not go together.
  if (traits.headwear === "tiara" || traits.headwear === "chef" || traits.headwear === "fedora") traits.headsetMic = false;
  if (traits.headwear === "tiara") traits.headwearColor = pick(["#e6c35c", "#d8dde6"]);
  return traits;
}

function randomBodyTraits() {
  return {
    neckLength: randBetween(0.88, 1.16),
    neckWidth: randBetween(0.82, 1.16),
    shoulderWidth: randBetween(0.82, 1.26),
    shoulderSlope: randBetween(-0.14, 0.24),
    chestWidth: randBetween(0.82, 1.20),
    waistWidth: randBetween(0.66, 1.08),
    hipWidth: randBetween(0.82, 1.16),
    armThickness: randBetween(0.82, 1.18),
    posture: pick(POSTURE_STYLES).id,
  };
}

function randomizeFace() {
  Object.assign(state.avatar, randomFaceTraits(pick(["feminine", "masculine", "neutral"])));
  commitAvatarChange();
  triggerAvatarEmote(studioAnim, "smile");
}

function randomizeStyle() {
  Object.assign(state.avatar, randomStyleTraits(state.avatar.genderStyle === "masculine"));
  commitAvatarChange();
  triggerAvatarEmote(studioAnim, "nod");
}

/** Which parts of the bot "Generate a bot" replaces, as ticked in its menu. */
function generatorParts() {
  const parts = {};
  for (const box of document.querySelectorAll("#generatorMenu input[data-gen]")) parts[box.dataset.gen] = box.checked;
  return parts;
}

/**
 * Makes a new bot: a name, a look, a voice and a personality that go together, with a greeting in
 * that personality's own words. The chat rules and the business details are yours and are kept.
 */
function generateBot() {
  const want = generatorParts();
  if (!Object.values(want).some(Boolean)) {
    $("generatorMenu").open = true;
    toast("Tick at least one thing for Generate to change", { error: true });
    return;
  }
  const oldName = state.name;
  const gStyle = want.look ? pick(["feminine", "masculine", "neutral"]) : state.avatar.genderStyle;
  const currentGender = studioVoice ? studioVoice.settings.gender : gStyle === "masculine" ? "male" : "female";
  const vGender = want.voice ? (gStyle === "masculine" ? "male" : gStyle === "feminine" ? "female" : pick(["female", "male"])) : currentGender;

  if (want.persona) state.persona = randomPersona();
  const character = state.persona ? personalityById(state.persona.id) : null;

  if (want.look) {
    Object.assign(state.avatar, { synthFinish: 0 }, randomFaceTraits(gStyle), randomBodyTraits(), randomStyleTraits(vGender === "male"));
  }
  // The face a character wears at rest goes with its temperament: a grumpy brow, a bubbly smile.
  if (character && (want.look || want.persona)) {
    const near = (value, lo, hi) => Number(Math.min(hi, Math.max(lo, value + (Math.random() - 0.5) * 0.2)).toFixed(2));
    Object.assign(state.avatar, {
      restSmile: near(character.face.restSmile, -0.4, 1),
      browMood: near(character.face.browMood, -1, 1),
      eyeOpen: near(character.face.eyeOpen, -0.5, 0.5),
    });
  }
  if (want.voice && studioVoice) {
    studioVoice.randomize({ gender: vGender });
    if (character) {
      // And so does its pace: a calm character speaks a little slower, a lively one with more lilt.
      const s = studioVoice.settings;
      studioVoice.configure({
        speed: Number(Math.min(1.4, Math.max(0.75, s.speed * character.voice.speed)).toFixed(2)),
        expressiveness: Number(Math.min(1.8, Math.max(0.4, s.expressiveness * character.voice.expressiveness)).toFixed(2)),
      });
    }
    state.voiceBaseId = "";
  }
  if (want.name) state.name = randomBotName(gStyle, Math.random, oldName);
  if (want.persona) {
    state.greeting = personaGreeting(state.persona, { name: state.name, role: state.role, company: state.company });
  } else if (want.name && oldName) {
    state.greeting = state.greeting.split(oldName).join(state.name); // a greeting you wrote keeps its words
  }
  $("auditionText").value = state.greeting;

  syncVoiceControls();
  syncIdentityControls();
  commitAvatarChange();
  rebuildStudioAiml();
  syncPersonaControls();
  if (want.name || want.persona) resetStudioChat();
  speakStudioLine(state.greeting, "wave");
  toast(`Meet ${state.name}${state.persona ? `. ${describePersona(state.persona)}.` : ""}`, { ms: 3600 });
}

// ============================================================================
// Personality: the character, its temperament and its speaking habits
// ============================================================================

const PERSONA_SELECTS = [
  ["delivery", "Speaks in a voice that is", PERSONA_DELIVERIES, { "": "As written", cheerful: "Cheerful", happy: "Happy", excited: "Excited", calm: "Calm", soft: "Soft", serious: "Serious", dramatic: "Dramatic" }],
  ["laugh", "Laughs with a", PERSONA_LAUGHS, { "": "As written", laugh: "Laugh", chuckle: "Chuckle", giggle: "Giggle", hehe: "Hehe", hoho: "Ho ho ho", snicker: "Snicker", cackle: "Cackle", guffaw: "Belly laugh", nervous: "Nervous laugh" }],
  ["think", "Thinks with a", PERSONA_THINKS, { "": "As written", hmm: "Hmm", um: "Um", uh: "Uh", mm: "Mm", ooh: "Ooh" }],
  ["gesture", "Favorite gesture", PERSONA_GESTURES, { "": "None", smile: "Smile", wink: "Wink", nod: "Nod", tilt: "Head tilt", thumbsup: "Thumbs up", shrug: "Shrug", bow: "Bow", wave: "Wave" }],
  ["mood", "Resting face", PERSONA_MOODS, { "": "Neutral", happy: "Happy", excited: "Excited", calm: "Calm", serious: "Serious" }],
];
const PERSONA_TEXT_HABITS = [
  ["personaOpenersInput", "openers"],
  ["personaClosersInput", "closers"],
  ["personaCatchphraseInput", "catchphrase"],
  ["personaPetNameInput", "petName"],
];

let personaPreviewTimer = 0;

/** "Calm", "Lively" or "Balanced", for the label beside a temperament slider. */
function traitWord(key, value) {
  const [, , low, high] = PERSONA_TRAITS.find(([k]) => k === key);
  return value >= 0.66 ? high : value <= 0.34 ? low : "Balanced";
}

function buildPersonaControls() {
  $("personaPills").replaceChildren(
    makeChoicePill("None", { personaId: "" }, () => choosePersonality(""), "Every reply is said exactly as it is written"),
    ...PERSONALITIES.map((p) => makeChoicePill(p.label, { personaId: p.id }, () => choosePersonality(p.id), p.blurb))
  );

  const sliders = $("personaSlidersHost");
  sliders.replaceChildren();
  for (const [key, label, low, high] of PERSONA_TRAITS) {
    const wrap = document.createElement("div");
    wrap.className = "slider-item";
    const id = `sl_pe_${key}`;
    wrap.innerHTML = `
      <div class="slider-top">
        <label for="${id}">${label}</label>
        <span class="slider-val static" id="val_pe_${key}"></span>
      </div>
      <input type="range" id="${id}" data-pe-key="${key}" min="0" max="1" step="0.01" value="0.5">
      <div class="slider-ends" aria-hidden="true"><span>${low}</span><span>${high}</span></div>
    `;
    const input = wrap.querySelector("input");
    input.addEventListener("input", () => {
      if (!state.persona) return;
      state.persona[key] = Number(input.value);
      $(`val_pe_${key}`).textContent = traitWord(key, state.persona[key]);
      onPersonaChange(false);
    });
    sliders.appendChild(wrap);
  }

  const selects = $("personaSelectsHost");
  selects.replaceChildren();
  for (const [key, label, options, names] of PERSONA_SELECTS) {
    const field = document.createElement("label");
    field.className = "field";
    const caption = document.createElement("span");
    caption.textContent = label;
    const select = document.createElement("select");
    select.id = `personaSel_${key}`;
    for (const value of options) select.add(new Option(names[value] ?? value, value));
    select.addEventListener("change", () => {
      if (!state.persona) return;
      state.persona[key] = select.value;
      onPersonaChange(false);
      // Let the choice be heard or seen straight away.
      if ((key === "laugh" || key === "think") && select.value) speakStudioLine(`[${select.value}]`);
      else if (key === "gesture" && select.value) triggerAvatarEmote(studioAnim, select.value);
      else if (key === "delivery") speakStudioLine(`${select.value ? `[${select.value}] ` : ""}This is how I sound.`);
    });
    field.append(caption, select);
    selects.appendChild(field);
  }

  for (const [id, key] of PERSONA_TEXT_HABITS) {
    $(id).addEventListener("input", () => {
      if (!state.persona) return;
      state.persona = normalizePersona({ ...state.persona, [key]: $(id).value });
      onPersonaChange(false);
    });
  }

  const says = $("personaSaysHost");
  says.replaceChildren();
  for (const [key, label] of PERSONA_SAYS) {
    const field = document.createElement("label");
    field.className = "field";
    const caption = document.createElement("span");
    caption.textContent = label;
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 900;
    input.dataset.say = key;
    input.addEventListener("input", () => {
      if (!state.persona) return;
      state.persona = normalizePersona({ ...state.persona, says: { ...state.persona.says, [key]: input.value } });
      onPersonaChange(false);
    });
    field.append(caption, input);
    says.appendChild(field);
  }

  $("randomPersonaBtn").onclick = () => {
    state.persona = randomPersona();
    onPersonaChange();
    const res = personaSampleEngine().reply("hello");
    speakStudioLine(res.speechText, "", { cues: res.cues, cueWords: res.cueWords });
  };
  $("personaGreetingBtn").onclick = () => {
    const before = state.greeting;
    for (let attempt = 0; attempt < 5 && state.greeting === before; attempt++) {
      state.greeting = personaGreeting(state.persona || normalizePersona("friendly"), { name: state.name, role: state.role, company: state.company });
    }
    $("botGreetingInput").value = state.greeting;
    $("auditionText").value = state.greeting;
    renderPersonaPreview();
    schedulePreviewSync();
    speakStudioLine(state.greeting, "wave");
  };
}

/** Picks one of the characters as it comes, or none. */
function choosePersonality(id) {
  state.persona = id ? normalizePersona({ id }) : null;
  onPersonaChange();
  if (state.persona) {
    const res = personaSampleEngine().reply("hello");
    speakStudioLine(res.speechText, "", { cues: res.cues, cueWords: res.cueWords });
  }
}

/** Every change to the personality goes through here. */
function onPersonaChange(syncControls = true) {
  markCustomArchetype();
  studioAiml.setPersona(state.persona);
  studioAudio.restMood = state.persona ? state.persona.mood : "";
  if (!studioAudio.playing) setAvatarMood(studioAnim, studioAudio.restMood);
  if (syncControls) syncPersonaControls();
  else {
    clearTimeout(personaPreviewTimer);
    personaPreviewTimer = setTimeout(renderPersonaPreview, 160);
  }
  schedulePreviewSync();
}

function syncPersonaControls() {
  const persona = state.persona;
  const character = persona ? personalityById(persona.id) : null;
  for (const btn of $("personaPills").children) {
    const on = btn.dataset.personaId === (persona ? persona.id : "");
    btn.classList.toggle("active", on);
    btn.setAttribute("aria-pressed", String(on));
  }
  $("personaBlurb").textContent = character
    ? `${character.label}: ${character.blurb.toLowerCase()}.`
    : "No personality: every reply is said exactly as it is written.";
  $("personaDetails").hidden = !persona;
  if (persona) {
    for (const input of document.querySelectorAll("input[data-pe-key]")) {
      const key = input.dataset.peKey;
      input.value = persona[key];
      $(`val_pe_${key}`).textContent = traitWord(key, persona[key]);
    }
    for (const [key] of PERSONA_SELECTS) $(`personaSel_${key}`).value = persona[key];
    $("personaOpenersInput").value = persona.openers.join(" | ");
    $("personaClosersInput").value = persona.closers.join(" | ");
    $("personaCatchphraseInput").value = persona.catchphrase;
    $("personaPetNameInput").value = persona.petName;
    for (const input of document.querySelectorAll("input[data-say]")) {
      const key = input.dataset.say;
      input.value = (persona.says[key] || []).join(" | ");
      input.placeholder = (character.says[key] || []).join(" | ");
    }
  }
  renderPersonaPreview();
}

/** A throwaway copy of the bot for showing how lines come out, so the real chat is left alone. */
function personaSampleEngine(steady = false) {
  return new AIMLEngine({
    botProps: studioBotProps(),
    xml: state.aimlXml,
    baseXml: state.baseBrain ? BASE_AIML_XML : "",
    persona: state.persona,
    random: steady ? () => 0.02 : Math.random,
  });
}

/** Shows the same few moments as this bot would say them, each with a button to hear it. */
function renderPersonaPreview() {
  const host = $("personaPreviewHost");
  const rows = [];
  const fromReply = (label, res) => rows.push({ label, text: res.displayText, play: () => speakStudioLine(res.speechText, "", { cues: res.cues, cueWords: res.cueWords }) });
  rows.push({ label: "Greeting", text: stripSpeechTags(state.greeting), play: () => speakStudioLine(state.greeting, "wave") });
  try {
    const sample = personaSampleEngine(true);
    fromReply("“Hello”", sample.reply("hello"));
    const plain = "We're open from nine to five, Monday to Friday.";
    const answer = state.persona ? stylizeReply(plain, state.persona, { kind: "answer", rng: () => 0.02, memory: {} }) : plain;
    rows.push({ label: "A plain answer", text: stripSpeechTags(answer), play: () => speakStudioLine(answer) });
    fromReply("“Thank you”", sample.reply("thank you"));
    fromReply("Doesn't know", sample.reply("what is a zorbleflux made of"));
  } catch {
    // The AIML has an error at the moment; the greeting row is still worth showing.
  }
  host.replaceChildren(
    ...rows.map((row) => {
      const line = document.createElement("div");
      line.className = "persona-line";
      const label = document.createElement("span");
      label.className = "persona-line-label";
      label.textContent = row.label;
      const text = document.createElement("p");
      text.textContent = row.text;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn xs icon-btn";
      btn.title = "Hear it";
      btn.setAttribute("aria-label", `Hear: ${row.label}`);
      btn.appendChild(iconEl("play"));
      btn.onclick = row.play;
      line.append(label, text, btn);
      return line;
    })
  );
}

// ============================================================================
// 3. AIML studio and live chat tester
// ============================================================================

/** Scrolls the AIML editor to a line and selects it. */
function revealEditorLine(line) {
  const editor = $("aimlXmlEditor");
  const lines = editor.value.split("\n");
  const idx = Math.max(0, Math.min(lines.length - 1, line - 1));
  let from = 0;
  for (let i = 0; i < idx; i++) from += lines[i].length + 1;
  editor.focus({ preventScroll: true });
  editor.setSelectionRange(from, from + lines[idx].length);
  const lineHeight = parseFloat(getComputedStyle(editor).lineHeight) || 19;
  editor.scrollTop = Math.max(0, (idx - 2) * lineHeight);
  editor.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

/** Lists the rules in the AIML document with what each one answers, plus anything the checker noticed. */
function renderRuleInsights(info) {
  const warnHost = $("aimlWarnings");
  warnHost.replaceChildren();
  warnHost.hidden = !info.valid || !info.warnings.length;
  for (const w of info.warnings) {
    const li = document.createElement("li");
    const where = document.createElement("button");
    where.type = "button";
    where.className = "lint-line";
    where.textContent = `Line ${w.line}`;
    where.title = "Show this line in the editor";
    where.onclick = () => revealEditorLine(w.line);
    const text = document.createElement("span");
    text.textContent = w.message;
    li.append(where, text);
    warnHost.appendChild(li);
  }
  if (!info.valid) return; // the last good list stays up while the XML is being fixed

  $("aimlRuleCount").textContent = String(info.rules.length);
  const list = $("aimlRuleList");
  list.replaceChildren();
  for (const rule of info.rules) {
    const li = document.createElement("li");
    li.className = "rule-row";

    const text = document.createElement("div");
    text.className = "rule-text";
    const pattern = document.createElement("code");
    pattern.className = "rule-pattern";
    pattern.textContent = rule.isCatchAll ? "anything else" : rule.pattern.toLowerCase();
    pattern.title = rule.pattern;
    const preview = document.createElement("span");
    preview.className = "rule-preview";
    const context =
      rule.that !== "*" ? `After “${rule.that.toLowerCase()}”: ` : rule.topic !== "*" ? `Topic ${rule.topic.toLowerCase()}: ` : "";
    preview.textContent =
      context + (rule.aliasOf ? `Same answer as “${rule.aliasOf.toLowerCase()}”` : rule.preview || "(no spoken text)");
    text.append(pattern, preview);

    const actions = document.createElement("div");
    actions.className = "rule-actions";
    const mkBtn = (label, title) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn xs";
      btn.textContent = label;
      btn.title = title;
      return btn;
    };
    const standalone = !rule.isCatchAll && rule.that === "*" && rule.topic === "*";
    const sample = standalone ? rule.sample : "";
    const tryBtn = mkBtn("Try", sample ? `Ask “${sample}” in the test chat` : "This rule only answers in the middle of a conversation");
    tryBtn.disabled = !sample;
    tryBtn.onclick = () => {
      askStudioBot(sample);
      $("studioChatMessages").scrollIntoView({ block: "nearest", behavior: "smooth" });
    };
    const findBtn = mkBtn("Find", `Show line ${rule.line} in the editor`);
    findBtn.onclick = () => revealEditorLine(rule.line);
    const removeBtn = mkBtn("Remove", "Delete this rule");
    armConfirm(removeBtn, "Sure?", () => {
      state.aimlXml = removeAimlRule(state.aimlXml, rule.start);
      state.aimlPackId = "";
      syncIdentityControls();
      rebuildStudioAiml();
      schedulePreviewSync();
      toast("Rule removed");
    });
    actions.append(tryBtn, findBtn, removeBtn);

    li.append(text, actions);
    list.appendChild(li);
  }
}

let studioWarmTimer = 0;
let fillSoundBars = () => {}; // set once the controls are built; run when the voice engine is ready

function rebuildStudioAiml() {
  const botProps = studioBotProps();
  const info = inspectAimlXml(state.aimlXml, botProps, { baseXml: state.baseBrain ? BASE_AIML_XML : "" });
  const badge = $("aimlValidBadge");
  const note = $("aimlErrorNote");
  const editor = $("aimlXmlEditor");
  // Business facts are answered by the base brain, so they need it switched on.
  $("factsHost").classList.toggle("is-dimmed", !state.baseBrain);
  $("factsNeedBaseNote").hidden = state.baseBrain;
  renderRuleInsights(info);
  if (info.valid) {
    badge.className = "status-pill ok";
    const checks = info.warnings.length ? `, ${info.warnings.length} to check` : "";
    badge.textContent = `Valid AIML, ${info.categories} ${info.categories === 1 ? "rule" : "rules"}${checks}`;
    note.hidden = true;
    editor.classList.remove("has-error");
    editor.removeAttribute("aria-invalid");
    studioAiml = info.engine; // the engine the checker just built: your rules over the base brain
    studioAiml.setPersona(state.persona);
    studioAudio.restMood = state.persona ? state.persona.mood : "";
    if (!studioAudio.playing) setAvatarMood(studioAnim, studioAudio.restMood);
    clearTimeout(studioWarmTimer);
    studioWarmTimer = setTimeout(() => studioAiml.warmUp(), 400);
    renderQuickChipBar($("studioChatChips"), studioAiml.quickChips, (q) => askStudioBot(q));
  } else {
    badge.className = "status-pill err";
    badge.textContent = "XML error";
    note.textContent = `${info.error}. The chat keeps using the last valid version until this is fixed.`;
    note.hidden = false;
    editor.classList.add("has-error");
    editor.setAttribute("aria-invalid", "true");
  }
  return info;
}

/** Explains in the tester which rule answered, and from which layer. */
function describeMatch(res) {
  if (!res.matchedPattern) return "no rule matched";
  const where = res.matchedLayer === "base" ? "base brain" : "your rules";
  if (res.matchKind === "fallback") return `nothing matched, so the catch-all answered (${where})`;
  const how =
    {
      typo: ", after fixing a typo",
      synonym: ", same idea in other words",
      loose: ", close match",
      meaning: ", closest rule by meaning",
      chat: ", open conversation",
      followup: ", continuing the last question",
    }[res.matchKind] || "";
  return `matched ${res.matchedPattern} (${where}${how})`;
}

function askStudioBot(question) {
  const q = String(question || "").trim();
  if (!q) return;
  const log = $("studioChatMessages");
  const engine = studioAiml;
  addChatBubble(log, "user", q);
  const res = engine.reply(q);
  addChatBubble(log, "bot", res.displayText, describeMatch(res));
  renderQuickChipBar($("studioChatChips"), res.chips.length ? res.chips : engine.quickChips, (nextQ) => askStudioBot(nextQ));
  unlockChannelAudio(studioAudio);
  afterPaint(() => speakStudioLine(res.speechText, "", { cues: res.cues, cueWords: res.cueWords }));
}

function resetStudioChat() {
  studioAiml.resetSession();
  $("studioChatMessages").replaceChildren();
  addChatBubble($("studioChatMessages"), "bot", stripSpeechTags(state.greeting));
  renderQuickChipBar($("studioChatChips"), studioAiml.quickChips, (q) => askStudioBot(q));
}

// ============================================================================
// 4. Live embedded preview and self-contained export
// ============================================================================

function getFullBotExportConfig() {
  return {
    name: state.name,
    role: state.role,
    company: state.company,
    greeting: state.greeting,
    chatEnabled: state.chatEnabled,
    baseBrain: state.baseBrain,
    facts: { ...state.facts },
    position: state.embedOpts.position,
    size: state.embedOpts.size,
    eyeTracking: state.embedOpts.eyeTracking,
    showCaptions: state.embedOpts.showCaptions,
    autoGreet: state.embedOpts.autoGreet,
    chatStartOpen: state.embedOpts.chatStartOpen,
    voice: studioVoice ? studioVoice.settings : savedVoiceSettings || { gender: "female", pitchHz: 192, speed: 1.05 },
    persona: state.persona ? structuredClone(state.persona) : null,
    avatar: structuredClone(state.avatar),
    aimlXml: state.aimlXml,
  };
}

function formatPreviewSiteUrl(rawCompany) {
  const clean = String(rawCompany || "").trim();
  if (!clean || clean.toLowerCase() === "bot.computer") return "https://bot.computer";
  if (/^https?:\/\//i.test(clean)) return clean;
  if (clean.includes(".") && !/\s/.test(clean)) return `https://${clean.toLowerCase()}`;
  return `https://bot.computer/${slugifyBotName(clean)}`;
}

const SNIPPET_TOKEN_RE =
  /(<!--[\s\S]*?-->)|(\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|(<\/?[a-zA-Z][\w-]*|\/?>)|(\b[a-zA-Z][\w-]*(?==))/g;

/** Light syntax coloring for the embed snippet (comments, strings, tags, attribute names). */
function highlightSnippet(code) {
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  let out = "";
  let last = 0;
  SNIPPET_TOKEN_RE.lastIndex = 0;
  let m;
  while ((m = SNIPPET_TOKEN_RE.exec(code)) !== null) {
    out += esc(code.slice(last, m.index));
    const cls = m[1] || m[2] ? "tk-c" : m[3] ? "tk-s" : m[4] ? "tk-t" : "tk-a";
    out += `<span class="${cls}">${esc(m[0])}</span>`;
    last = m.index + m[0].length;
  }
  return out + esc(code.slice(last));
}

function updateEmbedSnippetsUI() {
  const cfg = getFullBotExportConfig();
  const { slug, selfContainedHtml, multiFileHtml, sdkJs } = generateEmbedSnippets(cfg);
  $("selfContainedFilenameLabel").textContent = `${slug}-bot.js`;
  $("mockSiteBrand").textContent = state.company || "bot.computer";
  $("mockUrlDisplay").textContent = formatPreviewSiteUrl(state.company);

  currentSnippetCode =
    state.snippetMode === "multi"
      ? multiFileHtml
      : state.snippetMode === "sdk"
        ? sdkJs
        : selfContainedHtml;
  $("embedCodeOutput").innerHTML = highlightSnippet(currentSnippetCode);
}

async function mountOrRefreshPreviewWidget(forceRemount = false) {
  updateEmbedSnippetsUI();
  const cfg = getFullBotExportConfig();

  if (previewWidgetHandle && !forceRemount) {
    previewWidgetHandle.updateConfig(cfg);
    return;
  }

  const seq = ++previewMountSeq;
  if (previewWidgetHandle) {
    previewWidgetHandle.destroy();
    previewWidgetHandle = null;
  }

  const handle = await mountBotWidget({
    ...cfg,
    position: "contained",
    align: state.embedOpts.position === "bottom-left" ? "left" : "right",
    container: $("mockWebpage"),
    wasmUrl: "./vendor/tts/tts.wasm",
    autoGreet: false, // don't speak over the studio on page load
  });
  if (seq !== previewMountSeq) {
    handle.destroy(); // a newer remount started while this one was loading
    return;
  }
  previewWidgetHandle = handle;
}

let pendingForceRemount = false;

/** The one hook every design change goes through: refreshes the preview, autosaves, records undo history. */
function schedulePreviewSync(forceRemount = false) {
  pendingForceRemount = pendingForceRemount || forceRemount;
  clearTimeout(previewSyncTimer);
  previewSyncTimer = setTimeout(() => {
    const force = pendingForceRemount;
    pendingForceRemount = false;
    mountOrRefreshPreviewWidget(force);
  }, 90);
  commitHistorySoon();
  scheduleAutosave();
}

// ============================================================================
// Continuous render loop for both stages (hero + studio)
// ============================================================================

function startRenderLoop() {
  const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

  // Track the pointer across the window for eye tracking on both stages
  window.addEventListener(
    "pointermove",
    (e) => {
      const hc = $("heroCanvas");
      if (hc) {
        const r = hc.getBoundingClientRect();
        if (r.width > 0 && r.bottom > 0 && r.top < window.innerHeight) {
          heroPointer.nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width * 0.5)) / 260));
          heroPointer.ny = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height * 0.42)) / 220));
          heroPointer.active = true;
        }
      }
      const dc = $("designerCanvas");
      if (dc) {
        const r = dc.getBoundingClientRect();
        if (r.width > 0 && r.bottom > 0 && r.top < window.innerHeight) {
          studioPointer.nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width * 0.5)) / 300));
          studioPointer.ny = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height * 0.42)) / 250));
          studioPointer.active = true;
        }
      }
    },
    { passive: true }
  );

  const heroCanvas = $("heroCanvas");
  const heroCtx = heroCanvas.getContext("2d");
  const desCanvas = $("designerCanvas");
  const desCtx = desCanvas.getContext("2d");
  const ipaBadge = $("heroIpaBadge");
  const hzBadge = $("heroF0Badge");
  let lastIpa = "";
  let lastHz = "";

  function frame(nowMs) {
    if (!document.hidden) {
      const ratio = dpr();

      // 1. Hero canvas (only while near the viewport)
      const heroRect = heroCanvas.getBoundingClientRect();
      if (heroRect.bottom > -50 && heroRect.top < window.innerHeight + 50) {
        const hw = Math.max(200, Math.floor(heroRect.width * ratio));
        const hh = Math.max(220, Math.floor(heroRect.height * ratio));
        if (heroCanvas.width !== hw || heroCanvas.height !== hh) {
          heroCanvas.width = hw;
          heroCanvas.height = hh;
        }
        let sampledHero = null;
        if (heroAudio.playing && heroAudio.speech && heroAudio.ctx) {
          const tSec = Math.max(0, heroAudio.ctx.currentTime - heroAudio.startAt);
          sampledHero = sampleSpeechAt(heroAudio.speech, tSec, heroVoice?.settings.pitchHz || 180);
          updateHeroCaption(tSec);
          runDueCues(heroAnim, heroAudio.cueTimeline, tSec, nowMs);
        } else {
          runSilentCues(heroAudio, nowMs);
        }
        const heroPreset = AVATAR_PRESETS[heroPersonaIdx] || AVATAR_PRESETS[0];
        stepAvatarPhysics(heroAnim, nowMs, sampledHero, heroPointer, heroVoice?.settings.pitchHz || 180);
        drawBotAvatar(heroCtx, hw, hh, heroPreset.avatar, heroAnim, nowMs, {
          showVoiceWaves: true,
        });

        heroScope.push(nowMs, heroAnim);
        heroScope.draw(nowMs, ratio);

        const speaking = Boolean(sampledHero);
        const ipa = speaking && heroAnim.ipa && heroAnim.phone !== "SIL" ? `/${heroAnim.ipa}/` : "· · ·";
        const hz = speaking
          ? heroAnim.voicing > 0.14 && heroAnim.f0 > 45
            ? `${Math.round(heroAnim.f0)} Hz`
            : "unvoiced"
          : ttsReady
            ? "tap to speak"
            : ttsFailed
              ? "voice offline"
              : "loading voice";
        if (ipa !== lastIpa) ipaBadge.textContent = lastIpa = ipa;
        if (hz !== lastHz) hzBadge.textContent = lastHz = hz;
      }

      // 2. Studio designer canvas
      const desRect = desCanvas.getBoundingClientRect();
      if (desRect.width > 0 && desRect.height > 0) {
        const dw = Math.max(220, Math.floor(desRect.width * ratio));
        const dh = Math.max(220, Math.floor(desRect.height * ratio));
        if (desCanvas.width !== dw || desCanvas.height !== dh) {
          desCanvas.width = dw;
          desCanvas.height = dh;
        }
        let sampledStudio = null;
        if (studioAudio.playing && studioAudio.speech && studioAudio.ctx) {
          const tSec = Math.max(0, studioAudio.ctx.currentTime - studioAudio.startAt);
          sampledStudio = sampleSpeechAt(studioAudio.speech, tSec, studioVoice?.settings.pitchHz || 160);
          runDueCues(studioAnim, studioAudio.cueTimeline, tSec, nowMs);
        } else {
          runSilentCues(studioAudio, nowMs);
        }
        // The avatar holds still while a sculpt handle is being used.
        studioAnim.idleLife = !(state.activeSculptId || state.hoverSculptId);
        stepAvatarPhysics(studioAnim, nowMs, sampledStudio, studioPointer, studioVoice?.settings.pitchHz || 160);
        drawBotAvatar(desCtx, dw, dh, state.avatar, studioAnim, nowMs, {
          showVoiceWaves: true,
          showSculptHandles: state.showSculptHandles,
          activeSculptId: state.activeSculptId,
          hoverSculptId: state.hoverSculptId,
        });

        // Live articulation traces + word / phoneme / pitch badges
        studioScope.push(nowMs, studioAnim);
        studioScope.draw(nowMs, ratio);

        const wb = $("liveWordBadge");
        const pb = $("livePhoneBadge");
        const fb = $("liveF0Badge");
        if (studioAnim.word) {
          wb.hidden = false;
          wb.textContent = captionForSpokenWord(studioAnim.word);
        } else wb.hidden = true;

        if (studioAnim.ipa && studioAnim.phone && studioAnim.phone !== "SIL") {
          pb.hidden = false;
          pb.textContent = `/${studioAnim.ipa}/`;
        } else pb.hidden = true;

        if (studioAnim.voicing > 0.14 && studioAnim.f0 > 45 && sampledStudio) {
          fb.hidden = false;
          fb.textContent = `${Math.round(studioAnim.f0)} Hz`;
        } else fb.hidden = true;
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// ============================================================================
// Build static choices (characters, pills, swatches, sliders)
// ============================================================================

function makeChoicePill(label, dataset, onClick, title = "") {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "choice-pill";
  b.textContent = label;
  Object.assign(b.dataset, dataset);
  if (title) b.title = title;
  b.onclick = onClick;
  return b;
}

function populateStaticChoices() {
  // Starter characters, each with a small rendered portrait
  const strip = $("studioPresetStrip");
  const thumbAnim = createAnimState();
  for (const p of AVATAR_PRESETS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "archetype-card";
    btn.dataset.presetId = p.id;

    const thumb = document.createElement("canvas");
    thumb.className = "archetype-thumb";
    thumb.width = 92;
    thumb.height = 92;
    thumb.setAttribute("aria-hidden", "true");
    try {
      drawBotAvatar(thumb.getContext("2d"), 92, 92, { ...p.avatar, framing: "bust", stageShape: "circle" }, thumbAnim, 4000, {});
    } catch {}

    const text = document.createElement("span");
    text.className = "archetype-text";
    const name = document.createElement("strong");
    name.textContent = p.name;
    const role = document.createElement("span");
    role.textContent = p.role;
    text.append(name, role);

    btn.append(thumb, text);
    btn.onclick = () => applyStudioPreset(p, true);
    strip.appendChild(btn);
  }

  // Posture, facial hair, glasses selects
  for (const item of POSTURE_STYLES) {
    $("postureSelect").add(new Option(item.label, item.id));
  }
  for (const item of FACIAL_HAIR_STYLES) {
    $("facialHairSelect").add(new Option(item.label, item.id));
  }
  for (const item of GLASSES_STYLES) {
    $("glassesSelect").add(new Option(item.label, item.id));
  }
  for (const item of HEADWEAR_STYLES) {
    $("headwearSelect").add(new Option(item.label, item.id));
  }
  for (const item of EARRING_STYLES) {
    $("earringsSelect").add(new Option(item.label, item.id));
  }
  for (const item of NECKWEAR_STYLES) {
    $("neckwearSelect").add(new Option(item.label, item.id));
  }
  for (const item of BROOCH_STYLES) {
    $("broochSelect").add(new Option(item.label, item.id));
  }

  // Business facts: one field for each thing the base brain can answer about
  for (const fact of BOT_FACTS) {
    const label = document.createElement("label");
    label.className = `field${fact.long ? " span-all" : ""}`;
    const caption = document.createElement("span");
    caption.textContent = fact.label;
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 400;
    input.placeholder = fact.placeholder;
    input.autocomplete = "off";
    input.dataset.fact = fact.key;
    input.addEventListener("input", () => {
      state.facts = cleanFacts({ ...state.facts, [fact.key]: input.value });
      rebuildStudioAiml();
      schedulePreviewSync();
    });
    label.append(caption, input);
    $("factsHost").appendChild(label);
  }

  // Avatar actions: each chip previews the gesture on the stage and inserts its tag at the cursor
  const insertAtCursor = (field, text) => {
    const from = field.selectionStart ?? field.value.length;
    const to = field.selectionEnd ?? field.value.length;
    field.value = field.value.slice(0, from) + text + field.value.slice(to);
    field.focus();
    field.selectionStart = field.selectionEnd = from + text.length;
    field.dispatchEvent(new Event("input", { bubbles: true }));
  };
  const fillActionBar = (barId, fieldId) => {
    for (const action of AVATAR_ACTIONS) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "mini-tag action";
      b.textContent = action.label;
      b.title = `Preview this gesture and insert [${action.id}]`;
      b.onclick = () => {
        triggerAvatarEmote(studioAnim, action.id);
        insertAtCursor($(fieldId), `[${action.id}] `);
      };
      $(barId).appendChild(b);
    }
  };
  fillActionBar("actionTagBar", "auditionText");
  fillActionBar("qaActionBar", "qaAnswerInput");

  // Sounds the voice can make. The list comes from the voice engine itself once it has loaded, so
  // a newer engine brings its new sounds with it. Each chip plays the sound, with the face that
  // goes with it, and inserts its tag at the cursor.
  fillSoundBars = () => {
    const sounds = typeof TTS.sounds === "function" ? TTS.sounds() : [];
    for (const [barId, fieldId] of [["soundTagBar", "auditionText"], ["qaSoundBar", "qaAnswerInput"]]) {
      const bar = $(barId);
      for (const old of bar.querySelectorAll(".mini-tag")) old.remove();
      let group = "";
      for (const sound of sounds) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = `mini-tag sound${sound.group !== group && group ? " group-start" : ""}`;
        group = sound.group;
        b.textContent = sound.label;
        b.title = `${sound.about} Plays it and inserts [${sound.id}]`;
        b.onclick = () => {
          insertAtCursor($(fieldId), `[${sound.id}] `);
          speakStudioLine(`[${sound.id}]`);
        };
        bar.appendChild(b);
      }
      bar.hidden = !sounds.length;
    }
  };

  // The chip rows under the stage scroll sideways; let an ordinary mouse wheel do it.
  for (const bar of document.querySelectorAll(".audition-box .tag-insert-bar")) {
    bar.addEventListener(
      "wheel",
      (e) => {
        if (bar.scrollWidth <= bar.clientWidth || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
        bar.scrollLeft += e.deltaY;
        e.preventDefault();
      },
      { passive: false }
    );
  }
  for (const action of AVATAR_ACTIONS) {
    $("qaEmoteSelect").add(new Option(action.label, action.id));
  }

  // Hair and outfit pills
  for (const h of HAIR_STYLES) {
    $("hairStylePills").appendChild(
      makeChoicePill(h.label, { val: h.id }, () => {
        state.avatar.hairStyle = h.id;
        commitAvatarChange();
      })
    );
  }
  for (const o of OUTFIT_STYLES) {
    $("outfitStylePills").appendChild(
      makeChoicePill(o.label, { val: o.id }, () => {
        state.avatar.outfitStyle = o.id;
        commitAvatarChange();
      })
    );
  }

  // Swatch palettes
  const fillSwatches = (hostId, colors, avKey) => {
    const host = $(hostId);
    for (const c of colors) {
      const hex = typeof c === "string" ? c : c.hex;
      const label = typeof c === "string" ? c : c.label;
      const b = document.createElement("button");
      b.type = "button";
      b.className = "swatch-btn";
      b.dataset.hex = hex;
      b.title = label;
      b.setAttribute("aria-label", label);
      b.style.background = hex;
      b.onclick = () => {
        state.avatar[avKey] = hex;
        commitAvatarChange();
      };
      host.appendChild(b);
    }
  };
  fillSwatches("skinSwatches", SKIN_TONES, "skinColor");
  fillSwatches("irisSwatches", IRIS_PALETTE, "irisColor");
  fillSwatches("lipSwatches", LIP_PALETTE, "lipColor");
  fillSwatches("hairSwatches", HAIR_PALETTE, "hairColor");

  // Built-in voices and CMU Arctic profiles
  for (const [id, label] of VOICE_PRESETS) {
    $("voicePresetPills").appendChild(
      makeChoicePill(label, { voiceId: id }, () => {
        if (!studioVoice) return setStudioStatus(voiceUnavailableMessage());
        studioVoice.configure(id);
        state.voiceBaseId = id;
        syncVoiceControls();
        schedulePreviewSync();
        if ($("autoAuditionVoiceCheck").checked) speakStudioLine(`Hi, I'm ${state.name}!`);
      })
    );
  }
  for (const [id, label] of ARCTIC_PROFILES) {
    $("voiceArcticPills").appendChild(
      makeChoicePill(label, { voiceId: id }, async () => {
        if (!studioVoice) return setStudioStatus(voiceUnavailableMessage());
        try {
          const prof = await loadArcticProfile(id);
          studioVoice.configure(prof);
        } catch (err) {
          toast(`Could not load that speaker profile: ${err.message}`, { error: true });
          return;
        }
        state.voiceBaseId = id;
        syncVoiceControls();
        schedulePreviewSync();
        if ($("autoAuditionVoiceCheck").checked) speakStudioLine(`Hi, I'm ${state.name}, using a recorded speaker profile!`);
      })
    );
  }

  // Starter AIML knowledge packs
  for (const pack of Object.values(STARTER_AIML_PACKS)) {
    $("aimlPackPills").appendChild(
      makeChoicePill(
        pack.label,
        { packId: pack.id },
        () => {
          state.aimlPackId = pack.id;
          state.aimlXml = pack.xml;
          syncIdentityControls();
          rebuildStudioAiml();
          resetStudioChat();
          schedulePreviewSync();
          toast(`Loaded the ${pack.label} pack`);
        },
        pack.description
      )
    );
  }

  // Sliders
  buildAvatarSliders("bodySlidersHost", BODY_SLIDERS);
  buildAvatarSliders("skinMaterialSlidersHost", SKIN_MATERIAL_SLIDERS);
  buildAvatarSliders("expressionSlidersHost", EXPRESSION_SLIDERS);
  buildAvatarSliders("headSlidersHost", HEAD_SLIDERS);
  buildAvatarSliders("featuresSlidersHost", FEATURES_SLIDERS);
  buildVoiceSliders();
}

// ============================================================================
// Tabs and section navigation
// ============================================================================

function activateStudioTab(tabId, { focus = false } = {}) {
  for (const btn of document.querySelectorAll(".studio-tab")) {
    const on = btn.dataset.tab === tabId;
    btn.classList.toggle("active", on);
    btn.setAttribute("aria-selected", String(on));
    btn.tabIndex = on ? 0 : -1;
    if (on) {
      const strip = btn.parentElement;
      strip.scrollTo({ left: btn.offsetLeft - (strip.clientWidth - btn.offsetWidth) / 2, behavior: "smooth" });
      if (focus) btn.focus();
    }
  }
  for (const pane of document.querySelectorAll(".tab-content")) {
    const on = pane.id === tabId;
    pane.classList.toggle("active", on);
    pane.hidden = !on;
  }
}

function setupTabsAndNav() {
  const tabs = [...document.querySelectorAll(".studio-tab")];
  for (const btn of tabs) {
    btn.onclick = () => {
      activateStudioTab(btn.dataset.tab);
      refreshSpy();
    };
  }
  document.querySelector(".studio-tabs").addEventListener("keydown", (e) => {
    const cur = tabs.indexOf(document.activeElement);
    if (cur < 0) return;
    let next = -1;
    if (e.key === "ArrowRight") next = (cur + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (cur - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    if (next < 0) return;
    e.preventDefault();
    activateStudioTab(tabs[next].dataset.tab, { focus: true });
    refreshSpy();
  });

  // Links that jump straight to a tab (the "Chat brain" nav items)
  for (const link of document.querySelectorAll("[data-jump-tab]")) {
    link.addEventListener("click", () => {
      activateStudioTab(link.dataset.jumpTab);
      refreshSpy();
    });
  }
  for (const link of document.querySelectorAll('.nav-link[data-spy="studio"], .mob-nav-item[data-mob-nav="studio"]')) {
    link.addEventListener("click", () => {
      if ($("tabChat").classList.contains("active")) activateStudioTab("tabBody");
      refreshSpy();
    });
  }

  // Highlight the section in view on both the desktop nav and the mobile app bar
  let currentSection = "top";
  function refreshSpy() {
    const key =
      currentSection === "studio" && $("tabChat").classList.contains("active") ? "chat" : currentSection;
    for (const a of document.querySelectorAll(".nav-link[data-spy]")) {
      const on = a.dataset.spy === key;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    }
    for (const a of document.querySelectorAll(".mob-nav-item")) {
      a.classList.toggle("active", a.dataset.mobNav === key);
    }
  }
  if (typeof IntersectionObserver === "function") {
    const secObs = new IntersectionObserver(
      (entries) => {
        for (const ent of entries) {
          if (!ent.isIntersecting) continue;
          if (ent.target.id === "faqSection") currentSection = "faq";
          else if (ent.target.id === "embedSection") currentSection = "embed";
          else if (ent.target.id === "studioSection") currentSection = "studio";
          else currentSection = "top";
        }
        refreshSpy();
      },
      { rootMargin: "-25% 0px -55% 0px" }
    );
    for (const el of [document.querySelector(".hero-section"), document.querySelector(".features-grid"), $("studioSection"), $("embedSection"), $("faqSection")]) {
      if (el) secObs.observe(el);
    }
  }
  refreshSpy();
}

// ============================================================================
// Wire up the studio controls
// ============================================================================

function bindStudioEvents() {
  $("themeToggleBtn").onclick = cycleTheme;

  // Framing. "Cutout" also makes the frame transparent, and leaving it restores the previous frame.
  for (const btn of $("framingSeg").querySelectorAll("button")) {
    btn.onclick = () => {
      const av = state.avatar;
      const next = btn.dataset.framing;
      if (next === "cutout" && av.framing !== "cutout") {
        if (av.stageShape !== "cutout") stageShapeBeforeCutout = av.stageShape || "card";
        av.stageShape = "cutout";
      } else if (next !== "cutout" && av.framing === "cutout" && av.stageShape === "cutout") {
        av.stageShape = stageShapeBeforeCutout || "card";
      }
      av.framing = next;
      syncAllAvatarControls();
      schedulePreviewSync();
    };
  }

  $("toggleSculptBtn").onclick = () => {
    state.showSculptHandles = !state.showSculptHandles;
    const btn = $("toggleSculptBtn");
    btn.classList.toggle("active-pill", state.showSculptHandles);
    btn.setAttribute("aria-pressed", String(state.showSculptHandles));
    $("sculptHintBar").hidden = !state.showSculptHandles;
    if (!state.showSculptHandles) {
      state.hoverSculptId = "";
      $("sculptLiveHud").hidden = true;
    }
  };

  $("resetMorphsBtn").onclick = () => {
    for (const [key] of [...BODY_SLIDERS, ...HEAD_SLIDERS, ...FEATURES_SLIDERS]) {
      state.avatar[key] = DEFAULT_AVATAR[key];
    }
    commitAvatarChange();
    toast("Proportions reset. Undo brings them back.");
  };

  $("undoBtn").onclick = () => stepHistory(-1);
  $("redoBtn").onclick = () => stepHistory(1);
  window.addEventListener("keydown", (e) => {
    if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k !== "z" && k !== "y") return;
    // Leave native text undo alone inside inputs and editors.
    const t = e.target;
    if (t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) && t.type !== "range") return;
    e.preventDefault();
    stepHistory(k === "y" || e.shiftKey ? 1 : -1);
  });

  $("mobileCompactStageBtn").onclick = () => {
    const expanded = $("stageColumn").classList.toggle("is-expanded-mobile");
    const btn = $("mobileCompactStageBtn");
    btn.classList.toggle("active-pill", expanded);
    setBtn(btn, { icon: expanded ? "shrink" : "expand", label: expanded ? "Dock" : "Taller" });
  };

  $("mobileQuickSpeakBtn").onclick = () => {
    if (studioAudio.playing) stopChannel(studioAudio, resetStudioSpeakUi);
    else speakStudioLine($("auditionText").value);
  };

  $("mobileScriptToggleBtn").onclick = () => {
    const open = $("stageColumn").classList.toggle("show-mobile-script");
    setBtn($("mobileScriptToggleBtn"), { icon: open ? "x" : "pencil", label: open ? "Close" : "Script" });
  };

  // Body quick builds
  for (const btn of $("bodyBuildPills").querySelectorAll("button")) {
    btn.onclick = () => {
      const build = BODY_BUILDS[btn.dataset.build];
      if (!build) return;
      Object.assign(state.avatar, build);
      commitAvatarChange();
    };
  }

  // Facial contour style
  for (const btn of $("genderStyleSeg").querySelectorAll("button")) {
    btn.onclick = () => {
      state.avatar.genderStyle = btn.dataset.gstyle;
      commitAvatarChange();
    };
  }

  // Avatar dropdowns, color pickers and checkboxes
  const bindAv = (id, key, isCheck = false) => {
    $(id).addEventListener("input", (e) => {
      const av = state.avatar;
      av[key] = isCheck ? e.target.checked : e.target.value;
      if (key === "bgColor" || key === "bgAccent") av.bgStyle = "custom";
      if (key === "stageShape") {
        // Picking a real frame while cut out goes back to a framed camera; picking cutout remembers the frame.
        if (av.stageShape !== "cutout" && av.framing === "cutout") av.framing = "full";
        if (av.stageShape !== "cutout") stageShapeBeforeCutout = av.stageShape;
      }
      commitAvatarChange();
    });
  };
  bindAv("postureSelect", "posture");
  bindAv("stageShapeSelect", "stageShape");
  bindAv("bgStyleSelect", "bgStyle");
  bindAv("bgColorPicker", "bgColor");
  bindAv("bgAccentPicker", "bgAccent");
  bindAv("haloGlowCheck", "haloGlow", true);
  bindAv("skinColorPicker", "skinColor");
  bindAv("earStyleSelect", "earStyle");
  bindAv("lashStyleSelect", "lashStyle");
  bindAv("irisColorPicker", "irisColor");
  bindAv("lipColorPicker", "lipColor");
  bindAv("hairColorPicker", "hairColor");
  bindAv("hairHighlightPicker", "hairHighlight");
  bindAv("facialHairSelect", "facialHair");
  bindAv("outfitPrimaryPicker", "outfitPrimary");
  bindAv("outfitSecondaryPicker", "outfitSecondary");
  bindAv("outfitAccentPicker", "outfitAccent");
  bindAv("glassesSelect", "glasses");
  bindAv("glassesColorPicker", "glassesColor");
  bindAv("headsetMicCheck", "headsetMic", true);
  bindAv("nameBadgeCheck", "nameBadge", true);
  bindAv("headwearSelect", "headwear");
  bindAv("headwearColorPicker", "headwearColor");
  bindAv("earringsSelect", "earrings");
  bindAv("earringColorPicker", "earringColor");
  bindAv("neckwearSelect", "neckwear");
  bindAv("neckwearColorPicker", "neckwearColor");
  bindAv("fringeCheck", "fringe", true);
  bindAv("beautyMarkCheck", "beautyMark", true);
  bindAv("noseStudCheck", "noseStud", true);
  bindAv("broochSelect", "brooch");
  bindAv("broochColorPicker", "broochColor");
  // The second eye takes its own color only while the box is ticked.
  const setSecondEye = () => {
    state.avatar.irisColor2 = $("oddEyesCheck").checked ? $("irisColor2Picker").value : "";
    commitAvatarChange();
  };
  $("oddEyesCheck").addEventListener("input", setSecondEye);
  $("irisColor2Picker").addEventListener("input", () => {
    $("oddEyesCheck").checked = true;
    setSecondEye();
  });
  // A chef's hat starts out white, as chef's hats are.
  $("headwearSelect").addEventListener("change", (e) => {
    if (e.target.value === "chef") {
      state.avatar.headwearColor = "#f4f6fb";
      commitAvatarChange();
    }
  });
  bindAv("eyeshadowColorPicker", "eyeshadowColor");
  bindAv("browColorPicker", "browColor");
  $("browMatchHairBtn").onclick = () => {
    state.avatar.browColor = "";
    commitAvatarChange();
  };
  $("randomizeFaceBtn").onclick = randomizeFace;
  $("randomizeStyleBtn").onclick = randomizeStyle;

  // Voice tab
  for (const btn of $("voiceGenderSeg").querySelectorAll("button")) {
    btn.onclick = () => {
      if (!studioVoice) return setStudioStatus(voiceUnavailableMessage());
      studioVoice.setGender(btn.dataset.vgender);
      state.voiceBaseId = "";
      syncVoiceControls();
      schedulePreviewSync();
      if ($("autoAuditionVoiceCheck").checked) speakStudioLine(`Switched to a ${btn.dataset.vgender} vocal tract.`);
    };
  }
  for (const btn of $("glottalSourceSeg").querySelectorAll("button")) {
    btn.onclick = () => {
      if (!studioVoice) return setStudioStatus(voiceUnavailableMessage());
      studioVoice.configure({ folds: btn.dataset.folds === "true" });
      syncVoiceControls();
      schedulePreviewSync();
    };
  }
  $("voiceWhisperCheck").onchange = (e) => {
    if (!studioVoice) return;
    studioVoice.configure({ whisper: e.target.checked });
    syncVoiceControls();
    schedulePreviewSync();
  };
  $("randomVoiceOnlyBtn").onclick = () => {
    if (!studioVoice) return setStudioStatus(voiceUnavailableMessage());
    const g = studioVoice.settings.gender;
    studioVoice.randomize({ gender: g });
    state.voiceBaseId = "";
    syncVoiceControls();
    schedulePreviewSync();
    speakStudioLine(`Here is a freshly randomized ${g} vocal tract!`);
  };

  // Speech test and gestures
  for (const btn of document.querySelectorAll(".mini-tag[data-ins]")) {
    btn.onclick = () => {
      const ta = $("auditionText");
      const tag = btn.dataset.ins || "";
      const s = ta.selectionStart ?? ta.value.length;
      const e = ta.selectionEnd ?? ta.value.length;
      ta.value = ta.value.slice(0, s) + tag + ta.value.slice(e);
      ta.focus();
      ta.selectionStart = ta.selectionEnd = s + tag.length;
      scheduleAutosave();
    };
  }
  $("auditionText").addEventListener("input", scheduleAutosave);
  $("auditionText").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      speakStudioLine($("auditionText").value);
    }
  });

  $("studioSpeakBtn").onclick = () => speakStudioLine($("auditionText").value);
  $("studioStopBtn").onclick = () => stopChannel(studioAudio, resetStudioSpeakUi);
  $("downloadWavBtn").onclick = () => {
    if (!studioVoice) return setStudioStatus(voiceUnavailableMessage());
    const txt = $("auditionText").value.trim() || state.greeting;
    try {
      const speech = /\[[a-zA-Z_/]/.test(txt) ? studioVoice.speakScript(txt) : studioVoice.speak(txt);
      if (!speech.samples.length) return setStudioStatus("That line produced no audio to save.");
      const wavBytes = encodeWav(speech.samples, speech.sampleRate);
      const fname = `${slugifyBotName(state.name)}-voice.wav`;
      triggerBrowserDownload(fname, wavBytes, "audio/wav");
      toast(`Saved ${fname}`);
    } catch (err) {
      setStudioStatus(`Could not render that line: ${err.message}`);
    }
  };

  // Randomize, save / load config, start over
  $("randomizeAllBtn").onclick = generateBot;
  // The generator's menu closes when you click anywhere else.
  document.addEventListener("pointerdown", (e) => {
    const menu = $("generatorMenu");
    if (menu.open && !menu.contains(e.target)) menu.open = false;
  });
  $("savePresetJsonBtn").onclick = () => {
    const json = JSON.stringify({ ...getFullBotExportConfig(), voiceTuning: VOICE_TUNING }, null, 2);
    const fname = `${slugifyBotName(state.name)}-config.json`;
    triggerBrowserDownload(fname, json, "application/json");
    toast(`Downloaded ${fname}`);
  };
  $("loadPresetJsonBtn").onclick = () => $("loadPresetJsonInput").click();
  $("loadPresetJsonInput").onchange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (!applyConfigObject(parsed)) throw new Error("the file is not a bot configuration");
      if (parsed.voice && typeof parsed.voice === "object") {
        const voice = retuneSavedVoice(parsed.voice, parsed);
        if (studioVoice) studioVoice.configure(voice);
        else savedVoiceSettings = voice;
      }
      syncVoiceControls();
      syncAllAvatarControls();
      syncIdentityControls();
      syncEmbedControls();
      rebuildStudioAiml();
      syncPersonaControls();
      resetStudioChat();
      schedulePreviewSync(true);
      toast(`Loaded ${state.name} from ${file.name}`);
    } catch (err) {
      toast(`Could not load that config: ${err.message}`, { error: true, ms: 4500 });
    }
  };
  armConfirm($("startOverBtn"), "Click again to reset", async () => {
    try {
      localStorage.removeItem(STORE_KEY);
    } catch {}
    stopChannel(studioAudio, resetStudioSpeakUi);
    state.company = "bot.computer";
    state.chatEnabled = true;
    state.baseBrain = true;
    state.facts = {};
    state.aimlPackId = "concierge";
    state.aimlXml = STARTER_AIML_PACKS.concierge.xml;
    Object.assign(state.embedOpts, {
      position: "bottom-right",
      size: "standard",
      eyeTracking: true,
      showCaptions: true,
      autoGreet: false,
      chatStartOpen: false,
    });
    syncEmbedControls();
    await applyStudioPreset(AVATAR_PRESETS[0], false);
    resetStudioChat();
    schedulePreviewSync(true);
    toast("Started over with Aria");
  });

  // Chat tab: identity, greeting, AIML
  const onIdentityChange = () => {
    state.name = $("botNameInput").value.trim() || "Companion";
    state.role = $("botRoleInput").value.trim() || "Website Host";
    state.company = $("botCompanyInput").value.trim() || "Our Website";
    state.greeting = $("botGreetingInput").value;
    state.chatEnabled = $("chatEnabledCheck").checked;
    state.baseBrain = $("baseBrainCheck").checked;
    rebuildStudioAiml();
    schedulePreviewSync();
  };
  for (const id of ["botNameInput", "botRoleInput", "botCompanyInput", "botGreetingInput", "chatEnabledCheck", "baseBrainCheck"]) {
    $(id).addEventListener("input", onIdentityChange);
  }

  $("aimlXmlEditor").addEventListener("input", (e) => {
    state.aimlXml = e.target.value;
    state.aimlPackId = "";
    for (const b of $("aimlPackPills").children) {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    }
    rebuildStudioAiml();
    schedulePreviewSync();
  });

  const addQaRule = () => {
    const pattern = $("qaPatternInput").value.trim();
    const answer = $("qaAnswerInput").value.trim();
    if (!pattern || !answer) {
      toast(pattern ? "Add the answer the bot should give" : "Add what the visitor says first", { error: true });
      (pattern ? $("qaAnswerInput") : $("qaPatternInput")).focus();
      return;
    }
    const chips = $("qaChipsInput").value.split(",").map((s) => s.trim()).filter(Boolean);
    const emote = $("qaEmoteSelect").value;
    state.aimlXml = appendAimlRule(state.aimlXml, { pattern, answer, chips, emote });
    state.aimlPackId = "";
    syncIdentityControls();
    $("qaPatternInput").value = "";
    $("qaAnswerInput").value = "";
    $("qaChipsInput").value = "";
    const info = rebuildStudioAiml();
    schedulePreviewSync();
    const editor = $("aimlXmlEditor");
    editor.scrollTop = editor.scrollHeight;
    toast(info.valid ? `Rule added. The brain now has ${info.categories} rules.` : "Rule added, but the document has an XML error", {
      error: !info.valid,
    });
  };
  $("addQaRuleBtn").onclick = addQaRule;
  for (const id of ["qaPatternInput", "qaAnswerInput", "qaChipsInput"]) {
    $(id).addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addQaRule();
      }
    });
  }

  $("importAimlBtn").onclick = () => $("importAimlFileInput").click();
  $("importAimlFileInput").onchange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    state.aimlXml = await file.text();
    state.aimlPackId = "";
    syncIdentityControls();
    const info = rebuildStudioAiml();
    schedulePreviewSync();
    toast(info.valid ? `Imported ${file.name} with ${info.categories} rules` : `Imported ${file.name}, but it has an XML error`, {
      error: !info.valid,
    });
  };

  const downloadBrain = () => {
    const fname = `${slugifyBotName(state.name)}-brain.aiml`;
    triggerBrowserDownload(fname, state.aimlXml, "application/xml; charset=utf-8");
    toast(`Saved ${fname}`);
  };
  $("exportAimlFileBtn").onclick = downloadBrain;
  $("dlAimlOnlyBtn").onclick = downloadBrain;

  $("studioChatForm").onsubmit = (e) => {
    e.preventDefault();
    const q = $("studioChatInput").value.trim();
    if (!q) return;
    $("studioChatInput").value = "";
    askStudioBot(q);
  };
  $("resetStudioChatBtn").onclick = resetStudioChat;

  // Preview and export
  for (const btn of $("previewViewportSeg").querySelectorAll("button")) {
    btn.onclick = () => {
      setSegActive($("previewViewportSeg"), (b) => b === btn);
      $("mockBrowser").classList.toggle("is-mobile-vp", btn.dataset.vp === "mobile");
    };
  }

  $("remountPreviewBtn").onclick = () => mountOrRefreshPreviewWidget(true);

  const onEmbedOptChange = () => {
    state.embedOpts.position = $("embedPositionSelect").value;
    state.embedOpts.size = $("embedSizeSelect").value;
    state.embedOpts.eyeTracking = $("embedEyeTrackCheck").checked;
    state.embedOpts.showCaptions = $("embedCaptionsCheck").checked;
    state.embedOpts.autoGreet = $("embedAutoGreetCheck").checked;
    state.embedOpts.chatStartOpen = $("embedStartOpenCheck").checked;
    schedulePreviewSync(true);
  };
  for (const id of ["embedPositionSelect", "embedSizeSelect", "embedEyeTrackCheck", "embedCaptionsCheck", "embedAutoGreetCheck", "embedStartOpenCheck"]) {
    $(id).addEventListener("change", onEmbedOptChange);
  }

  for (const btn of $("snippetModeSeg").querySelectorAll("button")) {
    btn.onclick = () => {
      state.snippetMode = btn.dataset.snip;
      setSegActive($("snippetModeSeg"), (b) => b === btn);
      updateEmbedSnippetsUI();
    };
  }

  let copyResetTimer = 0;
  $("copySnippetBtn").onclick = async () => {
    const btn = $("copySnippetBtn");
    const ok = await copyText(currentSnippetCode);
    clearTimeout(copyResetTimer);
    if (ok) {
      btn.classList.add("is-done");
      setBtn(btn, { icon: "check", label: "Copied" });
      copyResetTimer = setTimeout(() => {
        btn.classList.remove("is-done");
        setBtn(btn, { icon: "copy", label: "Copy" });
      }, 1600);
    } else {
      toast("Copy was blocked by the browser. Select the code and copy it manually.", { error: true, ms: 4500 });
    }
  };

  const setExportStatus = (text, isError = false) => {
    const el = $("exportStatusText");
    el.hidden = false;
    el.textContent = text;
    el.classList.toggle("is-error", isError);
  };

  let exportBusy = false;
  const runExport = async (kind) => {
    if (exportBusy) return;
    exportBusy = true;
    setExportStatus(kind === "js" ? "Packing the avatar, AIML brain and compressed tts.wasm into one file…" : "Building the standalone demo page…");
    try {
      const cfg = getFullBotExportConfig();
      const slug = slugifyBotName(cfg.name);
      if (kind === "js") {
        const jsBundle = await buildSelfContainedBotJs(cfg);
        const fname = `${slug}-bot.js`;
        triggerBrowserDownload(fname, jsBundle, "text/javascript; charset=utf-8");
        setExportStatus(`Downloaded ${fname} (${(jsBundle.length / 1024).toFixed(0)} KB). Add it to a page with the snippet below.`);
        toast(`Downloaded ${fname}`);
      } else {
        const html = await buildSelfContainedDemoHtml(cfg);
        const fname = `${slug}-demo.html`;
        triggerBrowserDownload(fname, html, "text/html; charset=utf-8");
        setExportStatus(`Downloaded ${fname}. Open it in any browser, even offline.`);
        toast(`Downloaded ${fname}`);
      }
    } catch (err) {
      setExportStatus(`The export failed: ${err.message}`, true);
      toast(`The export failed: ${err.message}`, { error: true, ms: 4500 });
    } finally {
      exportBusy = false;
    }
  };

  $("downloadSelfContainedJsBtn").onclick = () => runExport("js");
  $("headerExportBtn").onclick = () => runExport("js");
  $("downloadDemoHtmlBtn").onclick = () => runExport("html");

  const guardedDownload = (fn, label) => async () => {
    try {
      await fn();
      toast(`Saved ${label}`);
    } catch (err) {
      toast(`Could not download ${label}: ${err.message}`, { error: true, ms: 4500 });
    }
  };
  $("dlEmbedRuntimeBtn").onclick = guardedDownload(downloadEmbedRuntimeFile, "bot-embed.js");
  $("dlRawWasmBtn").onclick = guardedDownload(downloadRawWasmFile, "tts.wasm");
}

// ============================================================================
// Boot
// ============================================================================

async function boot() {
  applyTheme(document.documentElement.getAttribute("data-theme") || "auto", false);
  restoreSavedStudio();

  populateStaticChoices();
  buildPersonaControls();
  initHeroSection();
  studioScope = new VoiceScope($("studioScopeCanvas"), ["jaw", "tongue", "lips", "nasal", "voice"], { lanes: true });
  setupDesignerCanvasSculpting();
  setupTabsAndNav();
  bindStudioEvents();

  syncAllAvatarControls();
  syncIdentityControls();
  syncEmbedControls();
  rebuildStudioAiml();
  syncPersonaControls();
  resetStudioChat();
  updateEmbedSnippetsUI();
  commitHistory();
  startRenderLoop();

  // Load tts.wasm
  const badge = $("heroEngineBadge");
  try {
    await initTTS();
    heroVoice = new TTS("female");
    studioVoice = new TTS("female");
    await applyPresetVoiceToInstance(heroVoice, AVATAR_PRESETS[heroPersonaIdx] || AVATAR_PRESETS[0]);

    let restoredVoice = false;
    if (savedVoiceSettings) {
      try {
        studioVoice.configure(savedVoiceSettings);
        restoredVoice = true;
      } catch {
        state.voiceBaseId = "";
      }
    }
    if (!restoredVoice) {
      const preset = AVATAR_PRESETS.find((p) => p.id === state.activePresetId) || AVATAR_PRESETS[0];
      await applyPresetVoiceToInstance(studioVoice, preset);
      state.voiceBaseId = preset.voicePreset || "";
    }
    savedVoiceSettings = null;

    ttsReady = true;
    syncVoiceControls();
    fillSoundBars();
    badge.textContent = "Voice ready";
    badge.classList.remove("is-loading");
    setStudioStatus("Voice ready. 24 kHz speech, synthesized in your browser.");
  } catch (err) {
    console.error("Failed to initialize tts.wasm:", err);
    ttsFailed = true;
    badge.textContent = "Voice unavailable";
    badge.classList.remove("is-loading");
    badge.classList.add("is-error");
    setStudioStatus(`The voice engine could not load (${err.message}). Everything else still works.`);
  }

  // Mount the real Shadow DOM widget inside the sample page
  await mountOrRefreshPreviewWidget(true);
}

boot();
