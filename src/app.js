import initTTS, { TTS, encodeWav } from "../vendor/tts/tts.js";
import {
  SKIN_TONES,
  HAIR_STYLES,
  OUTFIT_STYLES,
  GLASSES_STYLES,
  FACIAL_HAIR_STYLES,
  POSTURE_STYLES,
  DEFAULT_AVATAR,
  AVATAR_PRESETS,
  createAnimState,
  sampleSpeechAt,
  stepAvatarPhysics,
  drawBotAvatar,
  triggerAvatarEmote,
  getSculptHandles,
  hitTestSculptHandle,
} from "./avatar-renderer.js";
import {
  AIMLEngine,
  STARTER_AIML_PACKS,
  inspectAimlXml,
  appendAimlRule,
  stripSpeechTags,
} from "./aiml-engine.js";
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
  ["bodyScale", "Overall Scale", 0.80, 1.20, 0.01, "×"],
  ["headScale", "Head Proportion", 0.84, 1.22, 0.01, "×"],
  ["neckLength", "Neck Length", 0.75, 1.35, 0.01, "×"],
  ["neckWidth", "Neck Width", 0.70, 1.35, 0.01, "×"],
  ["shoulderWidth", "Shoulder Width", 0.70, 1.42, 0.01, "×"],
  ["shoulderSlope", "Shoulder Slope", -0.35, 0.45, 0.01, ""],
  ["chestWidth", "Chest / Torso Width", 0.70, 1.38, 0.01, "×"],
  ["waistWidth", "Waist Taper", 0.58, 1.38, 0.01, "×"],
  ["hipWidth", "Lower Torso / Hips", 0.70, 1.38, 0.01, "×"],
  ["torsoLength", "Torso Length", 0.80, 1.28, 0.01, "×"],
  ["armThickness", "Arm Build", 0.70, 1.40, 0.01, "×"],
];

const SKIN_MATERIAL_SLIDERS = [
  ["blushIntensity", "Cheek Warmth / Blush", 0, 0.55, 0.01, ""],
  ["synthFinish", "Android / Synth Finish", 0, 1, 0.02, ""],
];

const HEAD_SLIDERS = [
  ["headWidth", "Cranium Width", 0.78, 1.25, 0.01, "×"],
  ["headHeight", "Cranium Height", 0.84, 1.20, 0.01, "×"],
  ["cheekboneWidth", "Cheekbone Width", 0.82, 1.22, 0.01, "×"],
  ["jawWidth", "Jawline Width", 0.72, 1.28, 0.01, "×"],
  ["chinLength", "Chin Length", -0.35, 0.45, 0.01, ""],
  ["chinRoundness", "Chin Softness / Square", 0.05, 1.0, 0.02, ""],
  ["earSize", "Ear Scale", 0.65, 1.45, 0.02, "×"],
];

const FEATURES_SLIDERS = [
  ["eyeSize", "Eye Size", 0.75, 1.38, 0.01, "×"],
  ["eyeSpacing", "Eye Spacing", 0.80, 1.24, 0.01, "×"],
  ["eyeTilt", "Outer Eye Lift", -0.25, 0.30, 0.01, ""],
  ["browThickness", "Eyebrow Thickness", 0.50, 1.60, 0.02, "×"],
  ["browArch", "Eyebrow Arch", -0.20, 0.55, 0.01, ""],
  ["noseLength", "Nose Length", 0.78, 1.26, 0.01, "×"],
  ["noseWidth", "Nose Bridge & Tip", 0.74, 1.32, 0.01, "×"],
  ["mouthWidth", "Mouth Width", 0.76, 1.30, 0.01, "×"],
  ["lipFullness", "Lip Fullness", 0.65, 1.50, 0.01, "×"],
];

const VOICE_SLIDERS = [
  ["pitchHz", "Pitch (F0)", 65, 320, 1, " Hz"],
  ["tractLengthCm", "Vocal Tract Length", 12.4, 21.0, 0.1, " cm"],
  ["speed", "Speaking Rate", 0.60, 1.65, 0.01, "×"],
  ["expressiveness", "Prosody / Inflection", 0, 2.2, 0.02, ""],
  ["warmth", "Glottal Warmth", 0, 1, 0.01, ""],
  ["breathiness", "Breathiness", 0, 0.75, 0.01, ""],
  ["crispness", "Consonant Crispness", 0.5, 1.55, 0.01, ""],
  ["roughness", "Vocal Texture / Creak", 0, 0.65, 0.01, ""],
  ["chestResonance", "Chest Resonance", 0, 1, 0.01, ""],
  ["room", "Studio Ambience", 0, 0.85, 0.01, ""],
  ["volume", "Output Gain", 0.2, 2.0, 0.02, ""],
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
  ["female", "Female Clear"],
  ["bright", "Bright Host"],
  ["male", "Male Natural"],
  ["deep", "Deep Resonant"],
  ["husky", "Warm Husky"],
  ["whisper", "Soft Whisper"],
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
  aimlPackId: "concierge",
  aimlXml: STARTER_AIML_PACKS.concierge.xml,
  avatar: structuredClone(AVATAR_PRESETS[0].avatar),
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

let ttsReady = false;
const arcticCache = new Map();

// Hero Showcase Runtime
let heroPersonaIdx = 0;
let heroVoice = null;
let heroAiml = new AIMLEngine();
const heroAnim = createAnimState();
const heroPointer = { nx: 0, ny: 0, active: false };
let heroAudio = { ctx: null, src: null, speech: null, startAt: 0, playing: false };

// Studio Designer Runtime
let studioVoice = null;
let studioAiml = new AIMLEngine();
const studioAnim = createAnimState();
const studioPointer = { nx: 0, ny: 0, active: false };
let studioAudio = { ctx: null, src: null, speech: null, startAt: 0, playing: false };
let previewWidgetHandle = null;
let previewSyncTimer = 0;

// ============================================================================
// Theme Switcher
// ============================================================================

const THEME_MODES = ["auto", "light", "dark"];
let themeModeIdx = 0;

function cycleTheme() {
  themeModeIdx = (themeModeIdx + 1) % THEME_MODES.length;
  const mode = THEME_MODES[themeModeIdx];
  if (mode === "auto") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", mode);
  $("themeToggleBtn").textContent = `Theme: ${mode[0].toUpperCase()}${mode.slice(1)}`;
}

// ============================================================================
// Shared Web Audio Speech Player (Hero & Designer Stages)
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
  if (onStopUi) onStopUi();
}

async function playOnChannel(chan, voiceInst, rawText, { onStart, onEnd } = {}) {
  if (!voiceInst || !rawText.trim()) return null;
  stopChannel(chan);

  const Ctx = window.AudioContext || window.webkitAudioContext;
  chan.ctx ??= new Ctx();
  if (chan.ctx.state === "suspended") {
    await chan.ctx.resume();
  }

  const t0 = performance.now();
  const textStr = String(rawText);
  const speech = /\[[a-zA-Z_/]/.test(textStr)
    ? voiceInst.speakScript(textStr)
    : voiceInst.speak(textStr);
  const synthMs = Math.max(0.2, performance.now() - t0);

  if (!speech || !speech.samples || !speech.samples.length) return null;

  const buffer = chan.ctx.createBuffer(1, speech.samples.length, speech.sampleRate);
  buffer.copyToChannel(speech.samples, 0);
  const src = chan.ctx.createBufferSource();
  src.buffer = buffer;
  src.connect(chan.ctx.destination);

  chan.src = src;
  chan.speech = speech;
  chan.startAt = chan.ctx.currentTime + 0.015;
  chan.playing = true;

  if (onStart) onStart(speech, synthMs);
  src.start(chan.startAt);
  src.onended = () => {
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

// ============================================================================
// 1. Hero Showcase Initialization & Chat
// ============================================================================

async function selectHeroPersona(idx, speakGreeting = false) {
  heroPersonaIdx = idx;
  const preset = AVATAR_PRESETS[idx] || AVATAR_PRESETS[0];

  for (const [i, btn] of [...$("heroPersonaPills").children].entries()) {
    btn.classList.toggle("active", i === idx);
  }
  $("heroBotName").textContent = preset.name;
  $("heroBotRole").textContent = `${preset.role} · AIML Q&A`;
  $("heroChatInput").placeholder = `Ask ${preset.name} a question…`;

  heroAiml = new AIMLEngine({
    botProps: { name: preset.name, role: preset.role, company: "bot.computer", website: "https://bot.computer" },
    xml: STARTER_AIML_PACKS.concierge.xml,
  });

  $("heroChatLog").replaceChildren();
  addChatBubble($("heroChatLog"), "bot", stripSpeechTags(preset.greeting));
  renderQuickChipBar($("heroQuickChips"), heroAiml.quickChips, (q) => askHeroBot(q));

  if (heroVoice) {
    await applyPresetVoiceToInstance(heroVoice, preset);
    if (speakGreeting) {
      speakHeroLine(preset.greeting, "wave");
    }
  }
}

function speakHeroLine(text, emote = "") {
  if (emote) triggerAvatarEmote(heroAnim, emote, 2400);
  if (!heroVoice) return;
  playOnChannel(heroAudio, heroVoice, text, {
    onStart() {
      $("heroSpeakBtn").textContent = "■ Stop Demo";
    },
    onEnd() {
      $("heroSpeakBtn").textContent = "▶ Hear Live Greeting";
      $("heroCaptionBubble").hidden = true;
    },
  });
}

function askHeroBot(question) {
  const q = String(question || "").trim();
  if (!q) return;
  addChatBubble($("heroChatLog"), "user", q);
  const res = heroAiml.reply(q);
  addChatBubble($("heroChatLog"), "bot", res.displayText);
  if (res.chips && res.chips.length) {
    renderQuickChipBar($("heroQuickChips"), res.chips, (nextQ) => askHeroBot(nextQ));
  }
  speakHeroLine(res.speechText, res.emote || "");
}

function initHeroSection() {
  const heroPersonas = [0, 1, 2, 4]; // Aria, Marcus, Chloe, Nova-7
  const pillsHost = $("heroPersonaPills");
  heroPersonas.forEach((presetIdx, btnIdx) => {
    const p = AVATAR_PRESETS[presetIdx];
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `persona-pill ${btnIdx === 0 ? "active" : ""}`;
    btn.textContent = p.name;
    btn.onclick = async () => {
      await selectHeroPersona(presetIdx, true);
      for (const b of pillsHost.children) b.classList.toggle("active", b === btn);
    };
    pillsHost.appendChild(btn);
  });

  selectHeroPersona(0, false);

  $("heroSpeakBtn").onclick = () => {
    if (heroAudio.playing) {
      stopChannel(heroAudio, () => {
        $("heroSpeakBtn").textContent = "▶ Hear Live Greeting";
        $("heroCaptionBubble").hidden = true;
      });
    } else {
      const p = AVATAR_PRESETS[heroPersonaIdx] || AVATAR_PRESETS[0];
      speakHeroLine(p.greeting, "wave");
    }
  };

  $("heroAvatarBox").onclick = () => {
    const p = AVATAR_PRESETS[heroPersonaIdx] || AVATAR_PRESETS[0];
    if (heroAudio.playing) {
      stopChannel(heroAudio, () => {
        $("heroSpeakBtn").textContent = "▶ Hear Live Greeting";
        $("heroCaptionBubble").hidden = true;
      });
    } else {
      speakHeroLine(p.greeting, "wave");
    }
  };

  $("heroWaveBtn").onclick = () => {
    triggerAvatarEmote(heroAnim, "wave", 2400);
  };

  $("heroChatForm").onsubmit = (e) => {
    e.preventDefault();
    const val = $("heroChatInput").value.trim();
    if (!val) return;
    $("heroChatInput").value = "";
    askHeroBot(val);
  };
}

// ============================================================================
// 2. Studio Controls, Sliders & Direct On-Canvas Sculpting
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
        <span class="slider-val" id="val_av_${key}">${formatSliderVal(initVal, step, unit)}</span>
      </div>
      <input type="range" id="${id}" data-av-key="${key}" data-unit="${unit}" min="${min}" max="${max}" step="${step}" value="${initVal}">
    `;
    const input = wrap.querySelector("input");
    input.addEventListener("input", () => {
      const v = Number(input.value);
      state.avatar[key] = v;
      $(`val_av_${key}`).textContent = formatSliderVal(v, step, unit);
      markCustomArchetype();
      schedulePreviewSync();
    });
    const resetVal = () => {
      const def = DEFAULT_AVATAR[key];
      state.avatar[key] = def;
      input.value = def;
      $(`val_av_${key}`).textContent = formatSliderVal(def, step, unit);
      schedulePreviewSync();
    };
    input.addEventListener("dblclick", resetVal);
    const valPill = wrap.querySelector(".slider-val");
    valPill.title = "Tap or double-click slider to reset default";
    valPill.addEventListener("click", resetVal);
    host.appendChild(wrap);
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
        <span class="slider-val" id="val_vc_${key}">—</span>
      </div>
      <input type="range" id="${id}" data-vc-key="${key}" data-unit="${unit}" min="${min}" max="${max}" step="${step}" value="${min}">
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

function formatSliderVal(val, step, unit) {
  const decimals = step >= 1 ? 0 : step >= 0.1 ? 1 : 2;
  return `${Number(val).toFixed(decimals)}${unit}`;
}

function syncAllAvatarControls() {
  const av = state.avatar;

  // Framing segmented control
  for (const btn of $("framingSeg").querySelectorAll("button")) {
    btn.classList.toggle("active", btn.dataset.framing === av.framing);
  }

  // Gender style segmented control
  for (const btn of $("genderStyleSeg").querySelectorAll("button")) {
    btn.classList.toggle("active", btn.dataset.gstyle === av.genderStyle);
  }

  // All avatar range sliders
  for (const input of document.querySelectorAll("input[data-av-key]")) {
    const key = input.dataset.avKey;
    const val = av[key];
    if (val !== undefined) {
      input.value = val;
      const valSpan = $(`val_av_${key}`);
      if (valSpan) {
        valSpan.textContent = formatSliderVal(val, Number(input.step) || 0.01, input.dataset.unit || "");
      }
    }
  }

  // Selects & Checkboxes & Color Pickers
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

  // Pill grids active states
  for (const btn of $("hairStylePills").querySelectorAll("button")) {
    btn.classList.toggle("active", btn.dataset.val === av.hairStyle);
  }
  for (const btn of $("outfitStylePills").querySelectorAll("button")) {
    btn.classList.toggle("active", btn.dataset.val === av.outfitStyle);
  }
  for (const btn of $("skinSwatches").querySelectorAll("button")) {
    btn.classList.toggle("active", btn.dataset.hex.toLowerCase() === String(av.skinColor).toLowerCase());
  }

  // Identity & Chat fields
  $("botNameInput").value = state.name;
  $("botRoleInput").value = state.role;
  $("botCompanyInput").value = state.company;
  $("botGreetingInput").value = state.greeting;
  $("chatEnabledCheck").checked = state.chatEnabled;
}

function syncVoiceControls() {
  if (!studioVoice) return;
  const s = studioVoice.settings;
  for (const btn of $("voiceGenderSeg").querySelectorAll("button")) {
    btn.classList.toggle("active", btn.dataset.vgender === s.gender);
  }
  for (const btn of $("glottalSourceSeg").querySelectorAll("button")) {
    btn.classList.toggle("active", (btn.dataset.folds === "true") === Boolean(s.folds));
  }
  $("voiceWhisperCheck").checked = Boolean(s.whisper);

  for (const input of document.querySelectorAll("input[data-vc-key]")) {
    const key = input.dataset.vcKey;
    if (s[key] !== undefined) {
      input.value = s[key];
      const span = $(`val_vc_${key}`);
      if (span) {
        span.textContent = formatSliderVal(s[key], Number(input.step) || 0.01, input.dataset.unit || "");
      }
    }
  }
}

function markCustomArchetype() {
  state.activePresetId = "custom";
  for (const card of $("studioPresetStrip").querySelectorAll(".archetype-card")) {
    card.classList.remove("active");
  }
}

async function applyStudioPreset(preset, speakAfter = false) {
  state.activePresetId = preset.id;
  state.name = preset.name;
  state.role = preset.role;
  state.greeting = preset.greeting;
  state.avatar = structuredClone(preset.avatar);
  $("auditionText").value = preset.greeting;

  for (const card of $("studioPresetStrip").querySelectorAll(".archetype-card")) {
    card.classList.toggle("active", card.dataset.presetId === preset.id);
  }

  if (studioVoice) {
    await applyPresetVoiceToInstance(studioVoice, preset);
    syncVoiceControls();
  }
  syncAllAvatarControls();
  rebuildStudioAiml();
  schedulePreviewSync();

  if (speakAfter) {
    speakStudioLine(preset.greeting, "wave");
  }
}

function setupDesignerCanvasSculpting() {
  const canvas = $("designerCanvas");
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
    const hud = $("sculptLiveHud");
    if (hud) {
      hud.hidden = false;
      hud.textContent = `✦ ${hit.handle.label}`;
    }
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
      markCustomArchetype();
      syncAllAvatarControls();
      schedulePreviewSync();
      return;
    }

    if (state.showSculptHandles) {
      const handles = getSculptHandles(canvas.width, canvas.height, state.avatar);
      const hit = hitTestSculptHandle(handles, x, y, 22 * dpr);
      state.hoverSculptId = hit ? hit.handle.id : "";
      canvas.style.cursor = hit ? "grab" : "default";
    } else {
      state.hoverSculptId = "";
      canvas.style.cursor = "default";
    }
  });

  const endDrag = () => {
    dragInfo = null;
    state.activeSculptId = "";
    const hud = $("sculptLiveHud");
    if (hud) hud.hidden = true;
  };
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);
}

// ============================================================================
// Studio Speech, WAV Export & Randomizer
// ============================================================================

function speakStudioLine(text, emote = "") {
  if (emote) triggerAvatarEmote(studioAnim, emote, 2400);
  if (!studioVoice) return;
  playOnChannel(studioAudio, studioVoice, text, {
    onStart(speech, synthMs) {
      $("studioSpeakBtn").textContent = "▶ Replay";
      $("studioStopBtn").disabled = false;
      if ($("mobileQuickSpeakBtn")) $("mobileQuickSpeakBtn").textContent = "■ Stop";
      const rtf = Math.max(1, Math.round(speech.duration / (synthMs / 1000)));
      $("studioStatusLine").textContent = `Rendered ${speech.duration.toFixed(2)}s in ${synthMs.toFixed(1)} ms (${rtf}× real-time · 200 Hz visemes)`;
    },
    onEnd() {
      $("studioSpeakBtn").textContent = "▶ Speak Test";
      $("studioStopBtn").disabled = true;
      if ($("mobileQuickSpeakBtn")) $("mobileQuickSpeakBtn").textContent = "▶ Speak";
    },
  });
}

function randomizeEverything() {
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const rand = (lo, hi) => Number((lo + Math.random() * (hi - lo)).toFixed(2));

  const gStyle = pick(["feminine", "masculine", "neutral"]);
  const vGender = gStyle === "masculine" ? "male" : gStyle === "feminine" ? "female" : pick(["female", "male"]);
  const skin = pick(SKIN_TONES.slice(0, 9));
  const hair = pick(HAIR_STYLES);
  const hairCol = pick(HAIR_PALETTE);
  const outfit = pick(OUTFIT_STYLES);
  const outPrimary = pick(["#1e2f4d", "#0f766e", "#3b234a", "#1e293b", "#5b3e31", "#1d4ed8", "#3f3f46"]);
  const outAccent = pick(["#38bdf8", "#2dd4bf", "#f59e0b", "#fb7185", "#a78bfa", "#34d399"]);

  Object.assign(state.avatar, {
    genderStyle: gStyle,
    skinColor: skin.hex,
    synthFinish: outfit.id === "cyber" ? 0.75 : 0,
    headWidth: rand(0.88, 1.12),
    headHeight: rand(0.92, 1.10),
    cheekboneWidth: rand(0.90, 1.14),
    jawWidth: rand(0.82, 1.16),
    chinLength: rand(-0.15, 0.22),
    chinRoundness: rand(0.25, 0.88),
    neckLength: rand(0.88, 1.16),
    neckWidth: rand(0.82, 1.16),
    shoulderWidth: rand(0.82, 1.26),
    shoulderSlope: rand(-0.14, 0.24),
    chestWidth: rand(0.82, 1.20),
    waistWidth: rand(0.66, 1.08),
    hipWidth: rand(0.82, 1.16),
    armThickness: rand(0.82, 1.18),
    posture: pick(POSTURE_STYLES).id,
    eyeSize: rand(0.88, 1.18),
    eyeSpacing: rand(0.90, 1.12),
    eyeTilt: rand(-0.08, 0.16),
    irisColor: pick(IRIS_PALETTE),
    lashStyle: gStyle === "feminine" ? "lush" : pick(["subtle", "classic"]),
    browThickness: rand(0.75, 1.38),
    browArch: rand(0.0, 0.42),
    noseLength: rand(0.88, 1.14),
    noseWidth: rand(0.86, 1.16),
    mouthWidth: rand(0.88, 1.14),
    lipFullness: rand(0.80, 1.28),
    lipColor: pick(LIP_PALETTE),
    hairStyle: hair.id,
    hairColor: hairCol,
    hairHighlight: "#94a3b8",
    facialHair: vGender === "male" ? pick(["none", "none", "stubble", "beard", "mustache"]) : "none",
    outfitStyle: outfit.id,
    outfitPrimary: outPrimary,
    outfitAccent: outAccent,
    glasses: pick(["none", "none", "classic", "round", "bold"]),
    headsetMic: Math.random() < 0.45,
  });

  if (studioVoice) {
    studioVoice.randomize({ gender: vGender });
    syncVoiceControls();
  }

  markCustomArchetype();
  syncAllAvatarControls();
  schedulePreviewSync();
  speakStudioLine(`[cheerful] Hello! I was just sculpted with a brand new vocal tract and body build!`, "wave");
}

// ============================================================================
// 3. AIML XML Studio & Live Chat Tester
// ============================================================================

function rebuildStudioAiml() {
  const botProps = {
    name: state.name,
    role: state.role,
    company: state.company,
    website: "https://bot.computer",
  };
  const info = inspectAimlXml(state.aimlXml, botProps);
  const badge = $("aimlValidBadge");
  if (info.valid) {
    badge.className = "status-pill ok";
    badge.textContent = `✓ Valid AIML · ${info.categories} patterns`;
    studioAiml = new AIMLEngine({ botProps, xml: state.aimlXml });
    renderQuickChipBar($("studioChatChips"), studioAiml.quickChips, (q) => askStudioBot(q));
  } else {
    badge.className = "status-pill err";
    badge.textContent = `✕ ${info.error}`;
  }
}

function askStudioBot(question) {
  const q = String(question || "").trim();
  if (!q) return;
  addChatBubble($("studioChatMessages"), "user", q);
  const res = studioAiml.reply(q);
  const meta = res.matchedPattern ? `Matched <pattern>${res.matchedPattern}</pattern>` : "";
  addChatBubble($("studioChatMessages"), "bot", res.displayText, meta);
  if (res.chips && res.chips.length) {
    renderQuickChipBar($("studioChatChips"), res.chips, (nextQ) => askStudioBot(nextQ));
  }
  speakStudioLine(res.speechText, res.emote || "");
}

// ============================================================================
// 4. Live Embedded Website Preview & Self-Contained Export
// ============================================================================

function getFullBotExportConfig() {
  return {
    name: state.name,
    role: state.role,
    company: state.company,
    greeting: state.greeting,
    chatEnabled: state.chatEnabled,
    position: state.embedOpts.position,
    size: state.embedOpts.size,
    eyeTracking: state.embedOpts.eyeTracking,
    showCaptions: state.embedOpts.showCaptions,
    autoGreet: state.embedOpts.autoGreet,
    chatStartOpen: state.embedOpts.chatStartOpen,
    voice: studioVoice ? studioVoice.settings : { gender: "female", pitchHz: 192, speed: 1.05 },
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

function updateEmbedSnippetsUI() {
  const cfg = getFullBotExportConfig();
  const { slug, selfContainedHtml, multiFileHtml, sdkJs } = generateEmbedSnippets(cfg);
  $("selfContainedFilenameLabel").textContent = `${slug}-bot.js`;
  $("mockSiteBrand").textContent = state.company || "bot.computer";
  $("mockUrlDisplay").textContent = formatPreviewSiteUrl(state.company);

  const code =
    state.snippetMode === "multi"
      ? multiFileHtml
      : state.snippetMode === "sdk"
        ? sdkJs
        : selfContainedHtml;
  $("embedCodeOutput").textContent = code;
}

async function mountOrRefreshPreviewWidget(forceRemount = false) {
  updateEmbedSnippetsUI();
  const cfg = getFullBotExportConfig();

  if (previewWidgetHandle && !forceRemount) {
    previewWidgetHandle.updateConfig(cfg);
    return;
  }

  if (previewWidgetHandle) {
    previewWidgetHandle.destroy();
    previewWidgetHandle = null;
  }

  previewWidgetHandle = await mountBotWidget({
    ...cfg,
    position: "contained",
    align: state.embedOpts.position === "bottom-left" ? "left" : "right",
    container: $("mockWebpage"),
    wasmUrl: "./vendor/tts/tts.wasm",
    autoGreet: false, // Don't double-speak on initial page load
  });
}

function schedulePreviewSync(forceRemount = false) {
  updateEmbedSnippetsUI();
  clearTimeout(previewSyncTimer);
  previewSyncTimer = setTimeout(() => {
    mountOrRefreshPreviewWidget(forceRemount);
  }, 90);
}

// ============================================================================
// Continuous 60fps Dual-Stage Render Loop (Hero + Studio Designer)
// ============================================================================

function startRenderLoop() {
  const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

  // Track pointer across window for eye-tracking on both stages
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

  function frame(nowMs) {
    if (!document.hidden) {
      const ratio = dpr();

      // 1. Hero Canvas (when near viewport)
      const heroCanvas = $("heroCanvas");
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
          if (sampledHero?.word) {
            $("heroCaptionBubble").hidden = false;
            $("heroCaptionBubble").textContent = heroAudio.speech.text;
          }
        }
        const heroPreset = AVATAR_PRESETS[heroPersonaIdx] || AVATAR_PRESETS[0];
        stepAvatarPhysics(heroAnim, nowMs, sampledHero, heroPointer, heroVoice?.settings.pitchHz || 180);
        drawBotAvatar(heroCanvas.getContext("2d"), hw, hh, heroPreset.avatar, heroAnim, nowMs, {
          showVoiceWaves: true,
        });
      }

      // 2. Studio Designer Canvas
      const desCanvas = $("designerCanvas");
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
        }
        stepAvatarPhysics(studioAnim, nowMs, sampledStudio, studioPointer, studioVoice?.settings.pitchHz || 160);
        drawBotAvatar(desCanvas.getContext("2d"), dw, dh, state.avatar, studioAnim, nowMs, {
          showVoiceWaves: true,
          showSculptHandles: state.showSculptHandles,
          activeSculptId: state.activeSculptId,
          hoverSculptId: state.hoverSculptId,
        });

        // Update 200 Hz Viseme Telemetry Meters & Live Phoneme Badges
        $("vmJaw").style.width = `${Math.round(Math.min(1, studioAnim.jaw) * 100)}%`;
        $("vmTongue").style.width = `${Math.round(Math.min(1, Math.max(studioAnim.tH, studioAnim.tTip * 0.9)) * 100)}%`;
        $("vmLips").style.width = `${Math.round(Math.min(1, Math.max(studioAnim.lipR, studioAnim.lipC, studioAnim.lipS)) * 100)}%`;
        $("vmVelum").style.width = `${Math.round(Math.min(1, studioAnim.velum) * 100)}%`;
        $("vmVoice").style.width = `${Math.round(Math.min(1, studioAnim.voicing) * 100)}%`;

        const wb = $("liveWordBadge");
        const pb = $("livePhoneBadge");
        const fb = $("liveF0Badge");
        if (studioAnim.word) {
          wb.hidden = false;
          wb.textContent = studioAnim.word;
        } else wb.hidden = true;

        if (studioAnim.ipa && studioAnim.phone && studioAnim.phone !== "SIL") {
          pb.hidden = false;
          pb.textContent = `/${studioAnim.ipa}/ · ${studioAnim.phone}`;
        } else pb.hidden = true;

        if (studioAnim.voicing > 0.14 && studioAnim.f0 > 45) {
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
// Wire DOM Controls & Boot WebAssembly Engine
// ============================================================================

function populateStaticChoices() {
  // Character Archetype Strip
  const strip = $("studioPresetStrip");
  for (const p of AVATAR_PRESETS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `archetype-card ${p.id === state.activePresetId ? "active" : ""}`;
    btn.dataset.presetId = p.id;
    btn.innerHTML = `<strong>${p.name}</strong><span>${p.role}</span>`;
    btn.onclick = () => applyStudioPreset(p, true);
    strip.appendChild(btn);
  }

  // Posture, Facial Hair, Glasses selects
  for (const item of POSTURE_STYLES) {
    $("postureSelect").add(new Option(item.label, item.id));
  }
  for (const item of FACIAL_HAIR_STYLES) {
    $("facialHairSelect").add(new Option(item.label, item.id));
  }
  for (const item of GLASSES_STYLES) {
    $("glassesSelect").add(new Option(item.label, item.id));
  }

  // Hair & Outfit Pill Grids
  for (const h of HAIR_STYLES) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "choice-pill";
    b.dataset.val = h.id;
    b.textContent = h.label;
    b.onclick = () => {
      state.avatar.hairStyle = h.id;
      markCustomArchetype();
      syncAllAvatarControls();
      schedulePreviewSync();
    };
    $("hairStylePills").appendChild(b);
  }

  for (const o of OUTFIT_STYLES) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "choice-pill";
    b.dataset.val = o.id;
    b.textContent = o.label;
    b.onclick = () => {
      state.avatar.outfitStyle = o.id;
      markCustomArchetype();
      syncAllAvatarControls();
      schedulePreviewSync();
    };
    $("outfitStylePills").appendChild(b);
  }

  // Swatch Palettes
  const fillSwatches = (hostId, colors, onPick) => {
    const host = $(hostId);
    for (const c of colors) {
      const hex = typeof c === "string" ? c : c.hex;
      const title = typeof c === "string" ? c : c.label;
      const b = document.createElement("button");
      b.type = "button";
      b.className = "swatch-btn";
      b.dataset.hex = hex;
      b.title = title;
      b.style.background = hex;
      b.onclick = () => onPick(hex);
      host.appendChild(b);
    }
  };

  fillSwatches("skinSwatches", SKIN_TONES, (hex) => {
    state.avatar.skinColor = hex;
    markCustomArchetype();
    syncAllAvatarControls();
    schedulePreviewSync();
  });
  fillSwatches("irisSwatches", IRIS_PALETTE, (hex) => {
    state.avatar.irisColor = hex;
    $("irisColorPicker").value = hex;
    schedulePreviewSync();
  });
  fillSwatches("lipSwatches", LIP_PALETTE, (hex) => {
    state.avatar.lipColor = hex;
    $("lipColorPicker").value = hex;
    schedulePreviewSync();
  });
  fillSwatches("hairSwatches", HAIR_PALETTE, (hex) => {
    state.avatar.hairColor = hex;
    $("hairColorPicker").value = hex;
    schedulePreviewSync();
  });

  // Voice Presets & CMU Arctic Pills
  for (const [id, label] of VOICE_PRESETS) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "choice-pill";
    b.textContent = label;
    b.onclick = () => {
      if (!studioVoice) return;
      studioVoice.configure(id);
      syncVoiceControls();
      schedulePreviewSync();
      if ($("autoAuditionVoiceCheck").checked) speakStudioLine(`Hi, I'm ${state.name}!`);
    };
    $("voicePresetPills").appendChild(b);
  }

  for (const [id, label] of ARCTIC_PROFILES) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "choice-pill";
    b.textContent = label;
    b.onclick = async () => {
      if (!studioVoice) return;
      const prof = await loadArcticProfile(id);
      studioVoice.configure(prof);
      syncVoiceControls();
      schedulePreviewSync();
      if ($("autoAuditionVoiceCheck").checked) speakStudioLine(`Hi, I'm ${state.name}, using an acoustic speaker profile!`);
    };
    $("voiceArcticPills").appendChild(b);
  }

  // Starter AIML Knowledge Packs
  for (const pack of Object.values(STARTER_AIML_PACKS)) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = `choice-pill ${pack.id === state.aimlPackId ? "active" : ""}`;
    b.dataset.packId = pack.id;
    b.textContent = pack.label;
    b.title = pack.description;
    b.onclick = () => {
      state.aimlPackId = pack.id;
      state.aimlXml = pack.xml;
      $("aimlXmlEditor").value = pack.xml;
      for (const x of $("aimlPackPills").children) x.classList.toggle("active", x === b);
      rebuildStudioAiml();
      schedulePreviewSync();
    };
    $("aimlPackPills").appendChild(b);
  }

  // Sliders
  buildAvatarSliders("bodySlidersHost", BODY_SLIDERS);
  buildAvatarSliders("skinMaterialSlidersHost", SKIN_MATERIAL_SLIDERS);
  buildAvatarSliders("headSlidersHost", HEAD_SLIDERS);
  buildAvatarSliders("featuresSlidersHost", FEATURES_SLIDERS);
  buildVoiceSliders();
}

function bindStudioEvents() {
  $("themeToggleBtn").onclick = cycleTheme;

  // Navigation jump to specific tab (e.g. AIML Brain link)
  for (const link of document.querySelectorAll("[data-jump-tab]")) {
    link.addEventListener("click", () => {
      activateStudioTab(link.dataset.jumpTab);
    });
  }

  // Studio Inspector Tabs (auto-centers active tab pill on mobile!)
  const activateStudioTab = (tabId) => {
    for (const btn of document.querySelectorAll(".studio-tab")) {
      const on = btn.dataset.tab === tabId;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-selected", String(on));
      if (on && typeof btn.scrollIntoView === "function") {
        btn.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
      }
    }
    for (const pane of document.querySelectorAll(".tab-content")) {
      pane.classList.toggle("active", pane.id === tabId);
    }
  };
  for (const btn of document.querySelectorAll(".studio-tab")) {
    btn.onclick = () => activateStudioTab(btn.dataset.tab);
  }

  // Mobile Bottom Navigation Bar Active State
  const mobNavEl = $("mobileBottomNav");
  if (mobNavEl) {
    const mobLinks = [...mobNavEl.querySelectorAll(".mob-nav-item")];
    const setMobActive = (key) => {
      for (const a of mobLinks) a.classList.toggle("active", a.dataset.mobNav === key);
    };
    for (const a of mobLinks) {
      a.addEventListener("click", () => setMobActive(a.dataset.mobNav));
    }
    if (typeof IntersectionObserver === "function") {
      const secObs = new IntersectionObserver(
        (entries) => {
          for (const ent of entries) {
            if (!ent.isIntersecting) continue;
            if (ent.target.id === "embedSection") setMobActive("embed");
            else if (ent.target.id === "studioSection") {
              const isChat = $("tabChat")?.classList.contains("active");
              setMobActive(isChat ? "chat" : "studio");
            } else if (ent.target.classList.contains("hero-section")) {
              setMobActive("top");
            }
          }
        },
        { rootMargin: "-25% 0px -55% 0px" }
      );
      const heroSec = document.querySelector(".hero-section");
      if (heroSec) secObs.observe(heroSec);
      if ($("studioSection")) secObs.observe($("studioSection"));
      if ($("embedSection")) secObs.observe($("embedSection"));
    }
  }

  // Stage Framing & Sculpt Mode Toggles
  for (const btn of $("framingSeg").querySelectorAll("button")) {
    btn.onclick = () => {
      state.avatar.framing = btn.dataset.framing;
      if (btn.dataset.framing === "cutout") {
        state.avatar.stageShape = "cutout";
      }
      syncAllAvatarControls();
      schedulePreviewSync();
    };
  }

  $("toggleSculptBtn").onclick = () => {
    state.showSculptHandles = !state.showSculptHandles;
    $("toggleSculptBtn").classList.toggle("active-pill", state.showSculptHandles);
    $("toggleSculptBtn").textContent = `✦ Sculpt: ${state.showSculptHandles ? "ON" : "OFF"}`;
    $("sculptHintBar").hidden = !state.showSculptHandles;
  };

  $("resetMorphsBtn").onclick = () => {
    for (const [key] of [...BODY_SLIDERS, ...HEAD_SLIDERS, ...FEATURES_SLIDERS]) {
      state.avatar[key] = DEFAULT_AVATAR[key];
    }
    syncAllAvatarControls();
    schedulePreviewSync();
  };

  $("mobileCompactStageBtn").onclick = () => {
    const expanded = $("stageColumn").classList.toggle("is-expanded-mobile");
    $("mobileCompactStageBtn").classList.toggle("active-pill", expanded);
    $("mobileCompactStageBtn").textContent = expanded ? "⤡ Dock Stage" : "⤢ Full Stage";
  };

  if ($("mobileQuickSpeakBtn")) {
    $("mobileQuickSpeakBtn").onclick = () => {
      if (studioAudio.playing) {
        stopChannel(studioAudio, () => {
          $("studioSpeakBtn").textContent = "▶ Speak Test";
          $("studioStopBtn").disabled = true;
          $("mobileQuickSpeakBtn").textContent = "▶ Speak";
        });
      } else {
        speakStudioLine($("auditionText").value);
      }
    };
  }

  if ($("mobileScriptToggleBtn")) {
    $("mobileScriptToggleBtn").onclick = () => {
      const open = $("stageColumn").classList.toggle("show-mobile-script");
      $("mobileScriptToggleBtn").classList.toggle("primary", open);
      $("mobileScriptToggleBtn").textContent = open ? "✕ Close" : "✎ Script";
    };
  }

  // Body Quick-Builds
  for (const btn of $("bodyBuildPills").querySelectorAll("button")) {
    btn.onclick = () => {
      const build = BODY_BUILDS[btn.dataset.build];
      if (!build) return;
      Object.assign(state.avatar, build);
      for (const b of $("bodyBuildPills").children) b.classList.toggle("active", b === btn);
      markCustomArchetype();
      syncAllAvatarControls();
      schedulePreviewSync();
    };
  }

  // Gender Contour Style
  for (const btn of $("genderStyleSeg").querySelectorAll("button")) {
    btn.onclick = () => {
      state.avatar.genderStyle = btn.dataset.gstyle;
      markCustomArchetype();
      syncAllAvatarControls();
      schedulePreviewSync();
    };
  }

  // Avatar Dropdowns, Pickers & Checkboxes
  const bindAv = (id, key, isCheck = false) => {
    $(id).addEventListener("input", (e) => {
      state.avatar[key] = isCheck ? e.target.checked : e.target.value;
      if (key === "bgColor" || key === "bgAccent") {
        state.avatar.bgStyle = "custom";
        $("bgStyleSelect").value = "custom";
      }
      markCustomArchetype();
      schedulePreviewSync();
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

  // Voice Tab Controls
  for (const btn of $("voiceGenderSeg").querySelectorAll("button")) {
    btn.onclick = () => {
      if (!studioVoice) return;
      studioVoice.setGender(btn.dataset.vgender);
      syncVoiceControls();
      schedulePreviewSync();
      if ($("autoAuditionVoiceCheck").checked) speakStudioLine(`Switched to ${btn.dataset.vgender} vocal tract.`);
    };
  }
  for (const btn of $("glottalSourceSeg").querySelectorAll("button")) {
    btn.onclick = () => {
      if (!studioVoice) return;
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
    if (!studioVoice) return;
    const g = studioVoice.settings.gender;
    studioVoice.randomize({ gender: g });
    syncVoiceControls();
    schedulePreviewSync();
    speakStudioLine(`Here is a freshly randomized ${g} vocal tract!`);
  };

  // Audition Bar & Emotes
  for (const btn of document.querySelectorAll(".mini-tag")) {
    btn.onclick = () => {
      const ta = $("auditionText");
      const tag = btn.dataset.ins || "";
      const s = ta.selectionStart ?? ta.value.length;
      const e = ta.selectionEnd ?? ta.value.length;
      ta.value = ta.value.slice(0, s) + tag + ta.value.slice(e);
      ta.focus();
      ta.selectionStart = ta.selectionEnd = s + tag.length;
    };
  }

  $("studioSpeakBtn").onclick = () => speakStudioLine($("auditionText").value);
  $("studioStopBtn").onclick = () => {
    stopChannel(studioAudio, () => {
      $("studioSpeakBtn").textContent = "▶ Speak Test";
      $("studioStopBtn").disabled = true;
      if ($("mobileQuickSpeakBtn")) $("mobileQuickSpeakBtn").textContent = "▶ Speak";
    });
  };
  for (const btn of document.querySelectorAll(".emote-btn")) {
    btn.onclick = () => triggerAvatarEmote(studioAnim, btn.dataset.emote, 2400);
  }
  $("downloadWavBtn").onclick = () => {
    if (!studioVoice) return;
    const txt = $("auditionText").value.trim() || state.greeting;
    const speech = /\[[a-zA-Z_/]/.test(txt) ? studioVoice.speakScript(txt) : studioVoice.speak(txt);
    if (!speech.samples.length) return;
    const wavBytes = encodeWav(speech.samples, speech.sampleRate);
    triggerBrowserDownload(`${slugifyBotName(state.name)}-voice.wav`, wavBytes, "audio/wav");
  };

  // Randomize All + Save/Load JSON
  $("randomizeAllBtn").onclick = randomizeEverything;
  $("savePresetJsonBtn").onclick = () => {
    const json = JSON.stringify(getFullBotExportConfig(), null, 2);
    triggerBrowserDownload(`${slugifyBotName(state.name)}-config.json`, json, "application/json");
  };
  $("loadPresetJsonInput").onchange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (parsed.name) state.name = parsed.name;
      if (parsed.role) state.role = parsed.role;
      if (parsed.company) state.company = parsed.company;
      if (parsed.greeting) state.greeting = parsed.greeting;
      if (parsed.chatEnabled !== undefined) state.chatEnabled = Boolean(parsed.chatEnabled);
      if (parsed.avatar) state.avatar = { ...DEFAULT_AVATAR, ...parsed.avatar };
      if (parsed.voice && studioVoice) {
        studioVoice.configure(parsed.voice);
        syncVoiceControls();
      }
      if (parsed.aimlXml) {
        state.aimlXml = parsed.aimlXml;
        $("aimlXmlEditor").value = parsed.aimlXml;
      }
      syncAllAvatarControls();
      rebuildStudioAiml();
      schedulePreviewSync(true);
    } catch (err) {
      alert(`Could not parse JSON config: ${err.message}`);
    }
    e.target.value = "";
  };

  // AIML Chat Bot Tab Controls
  const onIdentityChange = () => {
    state.name = $("botNameInput").value.trim() || "Companion";
    state.role = $("botRoleInput").value.trim() || "Website Host";
    state.company = $("botCompanyInput").value.trim() || "Our Website";
    state.greeting = $("botGreetingInput").value;
    state.chatEnabled = $("chatEnabledCheck").checked;
    rebuildStudioAiml();
    schedulePreviewSync();
  };
  for (const id of ["botNameInput", "botRoleInput", "botCompanyInput", "botGreetingInput", "chatEnabledCheck"]) {
    $(id).addEventListener("input", onIdentityChange);
  }

  $("aimlXmlEditor").value = state.aimlXml;
  $("aimlXmlEditor").addEventListener("input", (e) => {
    state.aimlXml = e.target.value;
    rebuildStudioAiml();
    schedulePreviewSync();
  });

  $("addQaRuleBtn").onclick = () => {
    const pattern = $("qaPatternInput").value.trim();
    const answer = $("qaAnswerInput").value.trim();
    if (!pattern || !answer) return;
    const chips = $("qaChipsInput").value.split(",").map((s) => s.trim()).filter(Boolean);
    const emote = $("qaEmoteSelect").value;
    state.aimlXml = appendAimlRule(state.aimlXml, { pattern, answer, chips, emote });
    $("aimlXmlEditor").value = state.aimlXml;
    $("qaPatternInput").value = "";
    $("qaAnswerInput").value = "";
    $("qaChipsInput").value = "";
    rebuildStudioAiml();
    schedulePreviewSync();
  };

  $("importAimlFileInput").onchange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const xml = await file.text();
    state.aimlXml = xml;
    $("aimlXmlEditor").value = xml;
    rebuildStudioAiml();
    schedulePreviewSync();
    e.target.value = "";
  };

  $("exportAimlFileBtn").onclick = () => {
    triggerBrowserDownload(`${slugifyBotName(state.name)}-brain.aiml`, state.aimlXml, "application/xml; charset=utf-8");
  };

  $("studioChatForm").onsubmit = (e) => {
    e.preventDefault();
    const q = $("studioChatInput").value.trim();
    if (!q) return;
    $("studioChatInput").value = "";
    askStudioBot(q);
  };

  $("resetStudioChatBtn").onclick = () => {
    studioAiml.resetSession();
    $("studioChatMessages").replaceChildren();
    addChatBubble($("studioChatMessages"), "bot", stripSpeechTags(state.greeting));
  };

  // Embed Section Controls & Self-Contained Exports
  for (const btn of $("previewViewportSeg").querySelectorAll("button")) {
    btn.onclick = () => {
      for (const b of $("previewViewportSeg").children) b.classList.toggle("active", b === btn);
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
      for (const b of $("snippetModeSeg").children) b.classList.toggle("active", b === btn);
      updateEmbedSnippetsUI();
    };
  }

  $("copySnippetBtn").onclick = async () => {
    await navigator.clipboard.writeText($("embedCodeOutput").textContent);
    $("copySnippetBtn").textContent = "✓ Copied!";
    setTimeout(() => {
      $("copySnippetBtn").textContent = "Copy Code";
    }, 1500);
  };

  const handleSelfContainedDownload = async () => {
    const statusEl = $("exportStatusText");
    statusEl.hidden = false;
    statusEl.textContent = "Packing avatar + AIML XML + gzipping tts.wasm into single .js file…";
    try {
      const cfg = getFullBotExportConfig();
      const jsBundle = await buildSelfContainedBotJs(cfg);
      const fname = `${slugifyBotName(cfg.name)}-bot.js`;
      triggerBrowserDownload(fname, jsBundle, "text/javascript; charset=utf-8");
      statusEl.textContent = `✓ Downloaded ${fname} (${(jsBundle.length / 1024).toFixed(0)} KB · 100% self-contained)!`;
    } catch (err) {
      statusEl.textContent = `Export error: ${err.message}`;
    }
  };

  $("downloadSelfContainedJsBtn").onclick = handleSelfContainedDownload;
  $("headerExportBtn").onclick = handleSelfContainedDownload;

  $("downloadDemoHtmlBtn").onclick = async () => {
    const statusEl = $("exportStatusText");
    statusEl.hidden = false;
    statusEl.textContent = "Building standalone offline HTML preview page…";
    try {
      const cfg = getFullBotExportConfig();
      const html = await buildSelfContainedDemoHtml(cfg);
      const fname = `${slugifyBotName(cfg.name)}-demo.html`;
      triggerBrowserDownload(fname, html, "text/html; charset=utf-8");
      statusEl.textContent = `✓ Downloaded ${fname} — open it directly in any browser (even offline)!`;
    } catch (err) {
      statusEl.textContent = `Export error: ${err.message}`;
    }
  };

  $("dlEmbedRuntimeBtn").onclick = () => downloadEmbedRuntimeFile();
  $("dlRawWasmBtn").onclick = () => downloadRawWasmFile();
  $("dlAimlOnlyBtn").onclick = () => {
    triggerBrowserDownload(`${slugifyBotName(state.name)}-brain.aiml`, state.aimlXml, "application/xml; charset=utf-8");
  };
}

async function boot() {
  populateStaticChoices();
  initHeroSection();
  setupDesignerCanvasSculpting();
  bindStudioEvents();
  syncAllAvatarControls();
  rebuildStudioAiml();
  addChatBubble($("studioChatMessages"), "bot", stripSpeechTags(state.greeting));
  updateEmbedSnippetsUI();
  startRenderLoop();

  // Initialize tts.wasm!
  try {
    await initTTS();
    ttsReady = true;
    heroVoice = new TTS("female");
    studioVoice = new TTS("female");
    await applyPresetVoiceToInstance(heroVoice, AVATAR_PRESETS[0]);
    await applyPresetVoiceToInstance(studioVoice, AVATAR_PRESETS[0]);
    syncVoiceControls();
    $("heroEngineBadge").textContent = "tts.wasm Ready · 24 kHz";
  } catch (err) {
    console.error("Failed to initialize tts.wasm:", err);
    $("heroEngineBadge").textContent = "WASM Offline";
    $("studioStatusLine").textContent = `TTS init error: ${err.message}`;
  }

  // Mount real Shadow DOM widget inside Mock Website Preview
  await mountOrRefreshPreviewWidget(true);
}

boot();
