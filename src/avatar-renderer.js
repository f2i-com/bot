// SitePal-inspired 2.5D Customizable Companion Renderer, Interactive Body/Face Sculptor,
// and 200 Hz Physical Vocal-Tract Lip-Sync Engine (powered by tts.wasm visemes & acoustics).

export const SKIN_TONES = [
  { id: "porcelain", label: "Porcelain", hex: "#f6d8c8" },
  { id: "fair", label: "Fair Peach", hex: "#f1c6b0" },
  { id: "warm_ivory", label: "Warm Ivory", hex: "#eab69b" },
  { id: "sand", label: "Golden Sand", hex: "#dfa482" },
  { id: "olive", label: "Warm Olive", hex: "#cf936e" },
  { id: "honey", label: "Honey Bronze", hex: "#bd7e58" },
  { id: "caramel", label: "Caramel", hex: "#a56643" },
  { id: "chestnut", label: "Chestnut", hex: "#884e32" },
  { id: "espresso", label: "Rich Espresso", hex: "#633724" },
  { id: "synth_pearl", label: "Synth Pearl", hex: "#dce5f2" },
];

export const HAIR_STYLES = [
  { id: "side_sweep", label: "Studio Side-Sweep" },
  { id: "long_waves", label: "Long Flowing Waves" },
  { id: "sleek_bob", label: "Sleek Concierge Bob" },
  { id: "quiff", label: "Textured Quiff" },
  { id: "curly_halo", label: "Curly Crown" },
  { id: "pixie", label: "Modern Pixie Crop" },
  { id: "updo_bun", label: "Poised High Bun" },
  { id: "shoulder_lob", label: "Shoulder Lob" },
  { id: "buzz", label: "Clean Buzz Fade" },
  { id: "none", label: "Smooth / Bald" },
];

export const OUTFIT_STYLES = [
  { id: "blazer", label: "Concierge Blazer" },
  { id: "suit_tie", label: "Executive Suit & Tie" },
  { id: "sweater", label: "Studio Crewneck" },
  { id: "turtleneck", label: "Architect Turtleneck" },
  { id: "hoodie", label: "Startup Hoodie" },
  { id: "vest", label: "Support Vest & Shirt" },
  { id: "cyber", label: "Android Chassis" },
];

export const GLASSES_STYLES = [
  { id: "none", label: "None" },
  { id: "classic", label: "Studio Frames" },
  { id: "round", label: "Round Wire" },
  { id: "bold", label: "Bold Horn-Rim" },
  { id: "shades", label: "Tinted Shades" },
  { id: "visor", label: "Holo Visor" },
];

export const FACIAL_HAIR_STYLES = [
  { id: "none", label: "Clean-Shaven" },
  { id: "stubble", label: "Designer Stubble" },
  { id: "mustache", label: "Classic Mustache" },
  { id: "goatee", label: "Sculpted Goatee" },
  { id: "beard", label: "Full Tailored Beard" },
];

export const POSTURE_STYLES = [
  { id: "welcoming", label: "Welcoming Host" },
  { id: "presenter", label: "Active Presenter" },
  { id: "relaxed", label: "Calm & Poised" },
  { id: "confident", label: "Executive Fold" },
];

export const DEFAULT_AVATAR = {
  // Framing & Stage
  framing: "half", // "bust" | "half" | "full" | "cutout"
  stageShape: "card", // "circle" | "card" | "arch" | "cutout"
  bgStyle: "studio_dark", // "studio_dark" | "warm_cream" | "sky_glass" | "emerald_mist" | "sunset" | "custom" | "transparent"
  bgColor: "#141b2d",
  bgAccent: "#2b6cb0",
  haloGlow: true,

  // Body & Silhouette Shaping (sculptable!)
  bodyScale: 1.0, // 0.80 .. 1.20
  headScale: 1.0, // 0.84 .. 1.22
  neckLength: 1.0, // 0.75 .. 1.35
  neckWidth: 0.95, // 0.70 .. 1.35
  shoulderWidth: 0.96, // 0.70 .. 1.42
  shoulderSlope: 0.08, // -0.35 (square) .. +0.45 (sloped)
  chestWidth: 0.94, // 0.70 .. 1.38
  waistWidth: 0.80, // 0.58 .. 1.38
  hipWidth: 0.94, // 0.70 .. 1.38
  torsoLength: 1.0, // 0.80 .. 1.28
  armThickness: 0.94, // 0.70 .. 1.40
  posture: "welcoming",

  // Head & Face Shaping (sculptable!)
  genderStyle: "feminine", // "feminine" | "masculine" | "neutral"
  headWidth: 0.97, // 0.78 .. 1.25
  headHeight: 1.0, // 0.84 .. 1.20
  cheekboneWidth: 1.02, // 0.82 .. 1.22
  jawWidth: 0.90, // 0.72 .. 1.28
  chinLength: 0.0, // -0.35 .. +0.45
  chinRoundness: 0.65, // 0 (sharp) .. 1 (round/square)
  earSize: 1.0, // 0.65 .. 1.45
  earStyle: "human", // "human" | "pointed" | "cyber"

  // Skin & Finish
  skinColor: "#f1c6b0",
  blushIntensity: 0.24, // 0 .. 0.65
  synthFinish: 0.0, // 0 (organic skin) .. 1 (metallic/android)

  // Eyes & Brows
  eyeSize: 1.04, // 0.75 .. 1.38
  eyeSpacing: 1.0, // 0.80 .. 1.24
  eyeTilt: 0.06, // -0.25 .. +0.30
  irisColor: "#3b82a6",
  lashStyle: "lush", // "subtle" | "classic" | "lush"
  browThickness: 0.92, // 0.50 .. 1.60
  browArch: 0.22, // -0.20 .. +0.55

  // Nose & Mouth
  noseLength: 1.0, // 0.78 .. 1.26
  noseWidth: 0.96, // 0.74 .. 1.32
  mouthWidth: 0.98, // 0.76 .. 1.30
  lipFullness: 1.08, // 0.65 .. 1.50
  lipColor: "#d6687c",

  // Hair, Wardrobe & Accessories
  hairStyle: "long_waves",
  hairColor: "#3c2734",
  hairHighlight: "#7b546c",
  facialHair: "none",
  outfitStyle: "blazer",
  outfitPrimary: "#1e2f4d",
  outfitSecondary: "#f4f6fb",
  outfitAccent: "#38bdf8",
  glasses: "none",
  glassesColor: "#1f2430",
  headsetMic: true,
  nameBadge: true,
};

export const AVATAR_PRESETS = [
  {
    id: "aria",
    name: "Aria",
    role: "Website Concierge",
    tagline: "Classic SitePal hostess with headset & warm soprano voice",
    voicePreset: "arctic_slt",
    voiceOverrides: { gender: "female", pitchHz: 192, speed: 1.05, expressiveness: 1.08, warmth: 0.66 },
    greeting: "[cheerful] Hi! Welcome to our website! I'm Aria, your virtual companion. Click below to ask me any question!",
    avatar: { ...DEFAULT_AVATAR },
  },
  {
    id: "marcus",
    name: "Marcus",
    role: "Executive Advisor",
    tagline: "Broad-shouldered tailored suit & confident baritone",
    voicePreset: "arctic_bdl",
    voiceOverrides: { gender: "male", pitchHz: 112, speed: 1.04, expressiveness: 1.0, warmth: 0.62 },
    greeting: "Hello and welcome! I'm Marcus. I can walk you through our plans, features, or technical documentation anytime.",
    avatar: {
      ...DEFAULT_AVATAR,
      genderStyle: "masculine",
      bgStyle: "sky_glass",
      neckWidth: 1.08,
      shoulderWidth: 1.16,
      shoulderSlope: 0.02,
      chestWidth: 1.12,
      waistWidth: 0.96,
      hipWidth: 0.96,
      armThickness: 1.08,
      posture: "presenter",
      headWidth: 1.03,
      jawWidth: 1.08,
      chinLength: 0.08,
      chinRoundness: 0.82,
      skinColor: "#cf936e",
      blushIntensity: 0.10,
      eyeSize: 0.96,
      eyeTilt: 0.0,
      irisColor: "#4f6d4a",
      lashStyle: "subtle",
      browThickness: 1.24,
      browArch: 0.08,
      noseWidth: 1.06,
      mouthWidth: 1.04,
      lipFullness: 0.90,
      lipColor: "#ad686d",
      hairStyle: "quiff",
      hairColor: "#232631",
      hairHighlight: "#4c546b",
      facialHair: "stubble",
      outfitStyle: "suit_tie",
      outfitPrimary: "#1b263b",
      outfitSecondary: "#f8fafc",
      outfitAccent: "#2563eb",
      glasses: "none",
      headsetMic: false,
    },
  },
  {
    id: "chloe",
    name: "Chloe",
    role: "Product Support",
    tagline: "Friendly studio sweater, round frames & lively voice",
    voicePreset: "bright",
    voiceOverrides: { gender: "female", pitchHz: 214, speed: 1.08, expressiveness: 1.18, warmth: 0.72 },
    greeting: "[happy] Hey there! Need a quick hand finding something? Just type a question and I'll answer right away!",
    avatar: {
      ...DEFAULT_AVATAR,
      bgStyle: "warm_cream",
      shoulderWidth: 0.92,
      waistWidth: 0.78,
      posture: "welcoming",
      headWidth: 0.99,
      jawWidth: 0.92,
      chinRoundness: 0.72,
      skinColor: "#f6d8c8",
      blushIntensity: 0.30,
      eyeSize: 1.10,
      irisColor: "#7c5836",
      lashStyle: "lush",
      hairStyle: "sleek_bob",
      hairColor: "#7c3f2c",
      hairHighlight: "#b86b4d",
      lipColor: "#db6b7b",
      outfitStyle: "sweater",
      outfitPrimary: "#0f766e",
      outfitSecondary: "#ffffff",
      outfitAccent: "#5eead4",
      glasses: "round",
      glassesColor: "#43342b",
      headsetMic: true,
    },
  },
  {
    id: "viktor",
    name: "Viktor",
    role: "Solutions Architect",
    tagline: "Minimalist turtleneck, sculpted beard & resonant voice",
    voicePreset: "arctic_rms",
    voiceOverrides: { gender: "male", pitchHz: 94, speed: 1.0, expressiveness: 0.96, chestResonance: 0.75 },
    greeting: "[calm] Greetings. I'm Viktor. Ask me how our self-contained WebAssembly architecture runs with zero cloud servers.",
    avatar: {
      ...DEFAULT_AVATAR,
      genderStyle: "masculine",
      bgStyle: "emerald_mist",
      shoulderWidth: 1.12,
      chestWidth: 1.08,
      waistWidth: 0.92,
      posture: "confident",
      headWidth: 1.0,
      cheekboneWidth: 1.08,
      jawWidth: 1.04,
      chinLength: 0.12,
      skinColor: "#eab69b",
      blushIntensity: 0.08,
      eyeSize: 0.95,
      irisColor: "#3b6998",
      lashStyle: "subtle",
      browThickness: 1.28,
      lipFullness: 0.88,
      lipColor: "#b46c72",
      hairStyle: "side_sweep",
      hairColor: "#3b302a",
      hairHighlight: "#69584f",
      facialHair: "beard",
      outfitStyle: "turtleneck",
      outfitPrimary: "#1e222b",
      outfitSecondary: "#334155",
      outfitAccent: "#10b981",
      glasses: "classic",
      glassesColor: "#18181b",
      headsetMic: false,
    },
  },
  {
    id: "nova",
    name: "Nova-7",
    role: "Cybernetic Companion",
    tagline: "Synth-porcelain android chassis, holo visor & crisp vocal tract",
    voicePreset: "female",
    voiceOverrides: { gender: "female", pitchHz: 202, tractLengthCm: 14.1, crispness: 1.28, expressiveness: 0.92 },
    greeting: "Systems online! I am Nova Seven, running 100 percent locally inside your browser via WebAssembly.",
    avatar: {
      ...DEFAULT_AVATAR,
      bgStyle: "studio_dark",
      shoulderWidth: 1.02,
      shoulderSlope: -0.10,
      chestWidth: 0.98,
      waistWidth: 0.74,
      posture: "presenter",
      skinColor: "#dce5f2",
      blushIntensity: 0.12,
      synthFinish: 0.85,
      earStyle: "cyber",
      eyeSize: 1.08,
      eyeTilt: 0.12,
      irisColor: "#06b6d4",
      lashStyle: "classic",
      lipColor: "#7e8ce0",
      hairStyle: "pixie",
      hairColor: "#1e293b",
      hairHighlight: "#38bdf8",
      outfitStyle: "cyber",
      outfitPrimary: "#0f172a",
      outfitSecondary: "#1e293b",
      outfitAccent: "#22d3ee",
      glasses: "visor",
      glassesColor: "#06b6d4",
      headsetMic: false,
    },
  },
  {
    id: "arthur",
    name: "Prof. Arthur",
    role: "Knowledge Curator",
    tagline: "Distinguished scholar with classic mustache & warm timbre",
    voicePreset: "deep",
    voiceOverrides: { gender: "male", pitchHz: 90, speed: 0.95, warmth: 0.82, expressiveness: 1.05 },
    greeting: "[warmth=0.85] Good day! I am Professor Arthur. Feel free to inquire about any topic in my AIML knowledge base.",
    avatar: {
      ...DEFAULT_AVATAR,
      genderStyle: "masculine",
      bgStyle: "sunset",
      shoulderWidth: 1.08,
      chestWidth: 1.10,
      waistWidth: 1.06,
      posture: "relaxed",
      headWidth: 1.04,
      jawWidth: 1.05,
      chinLength: 0.06,
      skinColor: "#dfa482",
      blushIntensity: 0.14,
      eyeSize: 0.94,
      irisColor: "#5c6f84",
      lashStyle: "subtle",
      browThickness: 1.38,
      lipFullness: 0.85,
      lipColor: "#a8686c",
      hairStyle: "buzz",
      hairColor: "#94a3b8",
      hairHighlight: "#e2e8f0",
      facialHair: "mustache",
      outfitStyle: "vest",
      outfitPrimary: "#5b3e31",
      outfitSecondary: "#f8f4ec",
      outfitAccent: "#d97706",
      glasses: "round",
      glassesColor: "#78552b",
      headsetMic: false,
    },
  },
];

// ============================================================================
// Color & Math Helpers
// ============================================================================

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function parseHex(hex, fallback = [230, 180, 155]) {
  const s = String(hex || "").trim().replace(/^#/, "");
  if (s.length === 3) {
    const r = parseInt(s[0] + s[0], 16);
    const g = parseInt(s[1] + s[1], 16);
    const b = parseInt(s[2] + s[2], 16);
    return Number.isFinite(r + g + b) ? [r, g, b] : fallback;
  }
  if (s.length >= 6) {
    const r = parseInt(s.slice(0, 2), 16);
    const g = parseInt(s.slice(2, 4), 16);
    const b = parseInt(s.slice(4, 6), 16);
    return Number.isFinite(r + g + b) ? [r, g, b] : fallback;
  }
  return fallback;
}

function rgbStr([r, g, b], a = 1) {
  const rr = clamp(Math.round(r), 0, 255);
  const gg = clamp(Math.round(g), 0, 255);
  const bb = clamp(Math.round(b), 0, 255);
  return a >= 0.999 ? `rgb(${rr}, ${gg}, ${bb})` : `rgba(${rr}, ${gg}, ${bb}, ${a.toFixed(3)})`;
}

function shadeRgb([r, g, b], factor, warmShift = 0) {
  return [
    r * factor + warmShift * 14,
    g * factor - Math.abs(warmShift) * 4,
    b * factor - warmShift * 10,
  ];
}

function mixRgb(a, b, t) {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

// ============================================================================
// Live Animation & 200 Hz TTS Viseme Sampling
// ============================================================================

export function createAnimState() {
  return {
    jaw: 0.045,
    tH: 0.46,
    tF: 0.50,
    tTip: 0.16,
    lipR: 0.04,
    lipS: 0.08,
    lipC: 0.20,
    velum: 0.0,
    energy: 0.0,
    voicing: 0.0,
    noise: 0.0,
    f0: 160,
    f1: 500,
    f2: 1500,
    f3: 2500,
    pitchSt: 0,
    phone: "",
    ipa: "",
    word: "",
    glotPhase: 0,
    wavePhase: 0,
    lastTickMs: 0,
    blinkStartMs: -1000,
    nextBlinkMs: 1600,
    saccadeX: 0,
    saccadeY: 0,
    nextSaccadeMs: 1100,
    lookX: 0,
    lookY: 0,
    emote: "",
    emoteUntilMs: 0,
  };
}

export function triggerAvatarEmote(anim, emoteName, durationMs = 2200, nowMs = performance.now()) {
  if (!anim || !emoteName) return;
  anim.emote = String(emoteName).toLowerCase();
  anim.emoteUntilMs = nowMs + durationMs;
}

/**
 * Samples `tts.wasm` 200 Hz articulatory `visemes` + `acoustics` + `phones` + `words`
 * with linear sub-frame interpolation (exact same physics model as `tts/demo/app.js`).
 */
export function sampleSpeechAt(speech, tSec, fallbackPitch = 150) {
  if (!speech || !speech.visemes || !speech.visemes.length) return null;
  const stride = (speech.visemeFields && speech.visemeFields.length) || 9;
  const rate = speech.visemeRate || 200;
  const total = Math.floor(speech.visemes.length / stride);
  if (total <= 0) return null;

  const exact = clamp(tSec * rate, 0, total - 1);
  const i0 = Math.floor(exact);
  const i1 = Math.min(total - 1, i0 + 1);
  const a = exact - i0;
  const v = speech.visemes;
  const o0 = i0 * stride;
  const o1 = i1 * stride;
  const lerp = (x, y) => x + (y - x) * a;

  const out = {
    jaw: lerp(v[o0], v[o1]),
    tH: lerp(v[o0 + 1], v[o1 + 1]),
    tF: lerp(v[o0 + 2], v[o1 + 2]),
    tTip: lerp(v[o0 + 3], v[o1 + 3]),
    lipR: lerp(v[o0 + 4], v[o1 + 4]),
    lipS: lerp(v[o0 + 5], v[o1 + 5]),
    lipC: lerp(v[o0 + 6], v[o1 + 6]),
    velum: lerp(v[o0 + 7], v[o1 + 7]),
    energy: lerp(v[o0 + 8], v[o1 + 8]),
    f0: fallbackPitch,
    f1: 500,
    f2: 1500,
    f3: 2500,
    voicing: 0,
    noise: 0,
    phone: "",
    ipa: "",
    word: "",
  };

  if (speech.acoustics && speech.acoustics.length >= 6) {
    const as = (speech.acousticFields && speech.acousticFields.length) || 6;
    const ac = speech.acoustics;
    const a0 = i0 * as;
    const a1 = i1 * as;
    if (a1 + 5 < ac.length) {
      out.f0 = lerp(ac[a0], ac[a1]);
      out.f1 = lerp(ac[a0 + 1], ac[a1 + 1]);
      out.f2 = lerp(ac[a0 + 2], ac[a1 + 2]);
      out.f3 = lerp(ac[a0 + 3], ac[a1 + 3]);
      out.voicing = lerp(ac[a0 + 4], ac[a1 + 4]);
      out.noise = lerp(ac[a0 + 5], ac[a1 + 5]);
    }
  } else {
    out.voicing = out.energy;
  }

  if (speech.phones) {
    for (let k = 0; k < speech.phones.length; k++) {
      const ph = speech.phones[k];
      if (tSec >= ph.start && tSec < ph.end) {
        out.phone = ph.phone;
        out.ipa = ph.ipa;
        break;
      }
    }
  }
  if (speech.words) {
    for (let k = 0; k < speech.words.length; k++) {
      const wd = speech.words[k];
      if (tSec >= wd.start && tSec < wd.end) {
        out.word = wd.word;
        break;
      }
    }
  }
  if (speech.segments && speech.segments.length) {
    let chosen = speech.segments[0];
    for (let k = 0; k < speech.segments.length; k++) {
      const sg = speech.segments[k];
      if (tSec >= sg.start && tSec <= sg.end) {
        chosen = sg;
        break;
      }
      if (tSec >= sg.start) chosen = sg;
    }
    out.segPitch = chosen.pitchHz;
  }

  return out;
}

/**
 * Advances continuous 60/120fps avatar articulation, cursor gaze tracking, blinking, and gestures.
 * `pointer` is `{ nx: -1..1, ny: -1..1, active: boolean }`.
 */
export function stepAvatarPhysics(anim, nowMs, sampledSpeech, pointer = null, basePitch = 160) {
  const dt = anim.lastTickMs > 0 ? Math.min(0.05, (nowMs - anim.lastTickMs) / 1000) : 0.016;
  anim.lastTickMs = nowMs;

  if (anim.emote && nowMs > anim.emoteUntilMs) {
    anim.emote = "";
  }

  const idleBreath = 0.5 + 0.5 * Math.sin(nowMs * 0.0019);
  const emoteSmile = anim.emote === "happy" || anim.emote === "wave" || anim.emote === "wink" ? 0.34 : 0.09;

  const goal = sampledSpeech || {
    jaw: 0.038 + 0.012 * idleBreath,
    tH: 0.46,
    tF: 0.50,
    tTip: 0.16,
    lipR: 0.03,
    lipS: emoteSmile,
    lipC: 0.22,
    velum: 0.0,
    energy: 0.0,
    voicing: 0.0,
    noise: 0.0,
    f0: basePitch,
    f1: 500,
    f2: 1500,
    f3: 2500,
    phone: "",
    ipa: "",
    word: "",
  };

  const kFast = 1 - Math.exp(-dt * (sampledSpeech ? 38 : 10));
  const kMed = 1 - Math.exp(-dt * (sampledSpeech ? 22 : 7.5));

  anim.jaw += (goal.jaw - anim.jaw) * kFast;
  anim.tH += (goal.tH - anim.tH) * kFast;
  anim.tF += (goal.tF - anim.tF) * kFast;
  anim.tTip += (goal.tTip - anim.tTip) * kFast;
  anim.lipR += (goal.lipR - anim.lipR) * kFast;
  anim.lipS += (Math.max(goal.lipS, anim.emote === "happy" ? 0.26 : 0) - anim.lipS) * kFast;
  anim.lipC += (goal.lipC - anim.lipC) * kFast;
  anim.velum += (goal.velum - anim.velum) * kMed;
  anim.energy += (goal.energy - anim.energy) * kFast;
  anim.voicing += (goal.voicing - anim.voicing) * kFast;
  anim.noise += (goal.noise - anim.noise) * kFast;
  anim.f0 += (goal.f0 - anim.f0) * kMed;
  anim.f1 += (goal.f1 - anim.f1) * kMed;
  anim.f2 += (goal.f2 - anim.f2) * kMed;
  anim.f3 += (goal.f3 - anim.f3) * kMed;
  anim.phone = goal.phone || "";
  anim.ipa = goal.ipa || "";
  anim.word = goal.word || "";

  const refPitch = sampledSpeech?.segPitch || basePitch || 150;
  const rawSt =
    anim.voicing > 0.12 ? 12 * Math.log2(Math.max(50, anim.f0) / Math.max(50, refPitch)) : 0;
  anim.pitchSt += (clamp(rawSt, -6, 9) - anim.pitchSt) * kMed;

  anim.glotPhase = (anim.glotPhase + dt * (6 + anim.f0 * 0.055)) % 1;
  anim.wavePhase = (anim.wavePhase + dt * (1.7 + anim.energy * 1.4)) % 1;

  // Natural blinking
  if (nowMs >= anim.nextBlinkMs) {
    anim.blinkStartMs = nowMs;
    anim.nextBlinkMs = nowMs + 2500 + Math.random() * 3100;
  }

  // Micro-saccades + smooth SitePal cursor tracking
  if (nowMs >= anim.nextSaccadeMs) {
    anim.saccadeX = (Math.random() - 0.5) * 0.24;
    anim.saccadeY = (Math.random() - 0.5) * 0.16;
    anim.nextSaccadeMs = nowMs + 1200 + Math.random() * 2200;
  }

  let targetLookX = anim.saccadeX;
  let targetLookY = anim.saccadeY;
  if (anim.emote === "think") {
    targetLookX = -0.55;
    targetLookY = -0.55;
  } else if (pointer && pointer.active) {
    targetLookX = clamp(pointer.nx, -1, 1) * 0.92 + anim.saccadeX * 0.22;
    targetLookY = clamp(pointer.ny, -1, 1) * 0.85 + anim.saccadeY * 0.22;
  }

  const kGaze = 1 - Math.exp(-dt * 8.5);
  anim.lookX += (targetLookX - anim.lookX) * kGaze;
  anim.lookY += (targetLookY - anim.lookY) * kGaze;
}

// ============================================================================
// Camera Framing & Coordinate Projection (Shared with Sculpt Handles!)
// ============================================================================

export function computeAvatarTransform(w, h, avatar) {
  const framing = avatar.framing || "half";
  let boxW = 240;
  let boxH = 240;
  let focusY = 18;

  if (framing === "bust") {
    boxW = 205;
    boxH = 210;
    focusY = 6;
  } else if (framing === "half") {
    boxW = 265;
    boxH = 290;
    focusY = 46;
  } else {
    // "full" or "cutout"
    boxW = 290;
    boxH = 340;
    focusY = 68;
  }

  const bodyScale = clamp(Number(avatar.bodyScale) || 1, 0.78, 1.24);
  const scale = Math.min(w / boxW, h / boxH) * bodyScale;
  const cx = w * 0.5;
  const cy = h * 0.5 - focusY * scale + (framing === "bust" ? 10 * scale : 8 * scale);
  return { cx, cy, scale, framing };
}

function deriveMetrics(avatar) {
  const isFem = avatar.genderStyle === "feminine";
  const isMasc = avatar.genderStyle === "masculine";
  const headScale = clamp(Number(avatar.headScale) || 1, 0.82, 1.25);

  const headW = (isFem ? 50.5 : isMasc ? 54.0 : 52.2) * clamp(avatar.headWidth ?? 1, 0.76, 1.28) * headScale;
  const headH = 66 * clamp(avatar.headHeight ?? 1, 0.82, 1.22) * headScale;
  const cheekW = headW * clamp(avatar.cheekboneWidth ?? 1, 0.82, 1.24);
  const jawW = (isFem ? 36.5 : isMasc ? 43.5 : 40.0) * clamp(avatar.jawWidth ?? 1, 0.70, 1.32) * headScale;
  const chinBaseY = (55 + (avatar.chinLength ?? 0) * 22) * headScale;

  const neckHalfW = (isFem ? 16.8 : isMasc ? 21.5 : 19.0) * clamp(avatar.neckWidth ?? 1, 0.68, 1.38);
  const neckLen = 34 * clamp(avatar.neckLength ?? 1, 0.72, 1.40);
  const shoulderY = 44 + neckLen;
  const shoulderHalfW = (isFem ? 68 : isMasc ? 82 : 75) * clamp(avatar.shoulderWidth ?? 1, 0.68, 1.45);
  const shoulderDrop = 13 + clamp(avatar.shoulderSlope ?? 0.08, -0.4, 0.5) * 24;

  const torsoLen = 128 * clamp(avatar.torsoLength ?? 1, 0.78, 1.32);
  const chestHalfW = (isFem ? 52 : isMasc ? 62 : 57) * clamp(avatar.chestWidth ?? 1, 0.68, 1.42);
  const waistHalfW = (isFem ? 41 : isMasc ? 53 : 47) * clamp(avatar.waistWidth ?? 1, 0.55, 1.42);
  const hipHalfW = (isFem ? 55 : isMasc ? 56 : 55) * clamp(avatar.hipWidth ?? 1, 0.68, 1.42);
  const armThick = (isFem ? 14.5 : isMasc ? 18.0 : 16.2) * clamp(avatar.armThickness ?? 1, 0.68, 1.45);

  return {
    isFem,
    isMasc,
    headScale,
    headW,
    headH,
    cheekW,
    jawW,
    chinBaseY,
    neckHalfW,
    neckLen,
    shoulderY,
    shoulderHalfW,
    shoulderDrop,
    torsoLen,
    chestHalfW,
    waistHalfW,
    hipHalfW,
    armThick,
  };
}

// ============================================================================
// Interactive On-Canvas Sculpt Handles (Drag to Shape Body & Face!)
// ============================================================================

export function getSculptHandles(w, h, avatar) {
  const { cx, cy, scale } = computeAvatarTransform(w, h, avatar);
  const m = deriveMetrics(avatar);
  const toScreen = (lx, ly) => ({ x: cx + lx * scale, y: cy + ly * scale });

  const handles = [
    {
      id: "crown",
      label: "Head Height",
      ...toScreen(0, -m.headH - 6),
      axis: "y",
      apply(dx, dy, cur) {
        return { headHeight: clamp((cur.headHeight ?? 1) - (dy / scale) * 0.009, 0.82, 1.22) };
      },
    },
    {
      id: "temple",
      label: "Head Width",
      ...toScreen(m.headW + 4, -18 * m.headScale),
      axis: "x",
      mirrorX: cx - (m.headW + 4) * scale,
      apply(dx, _dy, cur) {
        return { headWidth: clamp((cur.headWidth ?? 1) + (dx / scale) * 0.012, 0.78, 1.25) };
      },
    },
    {
      id: "jaw",
      label: "Jaw Width",
      ...toScreen(m.jawW + 3, 34 * m.headScale),
      axis: "x",
      mirrorX: cx - (m.jawW + 3) * scale,
      apply(dx, _dy, cur) {
        return { jawWidth: clamp((cur.jawWidth ?? 1) + (dx / scale) * 0.014, 0.72, 1.28) };
      },
    },
    {
      id: "chin",
      label: "Chin Length & Shape",
      ...toScreen(0, m.chinBaseY + 4),
      axis: "xy",
      apply(dx, dy, cur) {
        return {
          chinLength: clamp((cur.chinLength ?? 0) + (dy / scale) * 0.018, -0.35, 0.45),
          chinRoundness: clamp((cur.chinRoundness ?? 0.65) + (dx / scale) * 0.015, 0.05, 1.0),
        };
      },
    },
    {
      id: "eyes",
      label: "Eye Spacing & Size",
      ...toScreen(22 * (avatar.eyeSpacing ?? 1) * m.headScale + 10, -12 * m.headScale),
      axis: "xy",
      apply(dx, dy, cur) {
        return {
          eyeSpacing: clamp((cur.eyeSpacing ?? 1) + (dx / scale) * 0.016, 0.80, 1.24),
          eyeSize: clamp((cur.eyeSize ?? 1) - (dy / scale) * 0.018, 0.75, 1.38),
        };
      },
    },
    {
      id: "mouth",
      label: "Mouth Width & Lips",
      ...toScreen(21 * (avatar.mouthWidth ?? 1) * m.headScale + 4, 31 * m.headScale),
      axis: "xy",
      apply(dx, dy, cur) {
        return {
          mouthWidth: clamp((cur.mouthWidth ?? 1) + (dx / scale) * 0.018, 0.76, 1.30),
          lipFullness: clamp((cur.lipFullness ?? 1) + (dy / scale) * 0.022, 0.65, 1.50),
        };
      },
    },
    {
      id: "neck",
      label: "Neck Width & Length",
      ...toScreen(m.neckHalfW + 3, 44 + m.neckLen * 0.48),
      axis: "xy",
      mirrorX: cx - (m.neckHalfW + 3) * scale,
      apply(dx, dy, cur) {
        return {
          neckWidth: clamp((cur.neckWidth ?? 1) + (dx / scale) * 0.018, 0.70, 1.35),
          neckLength: clamp((cur.neckLength ?? 1) + (dy / scale) * 0.015, 0.75, 1.35),
        };
      },
    },
    {
      id: "shoulder",
      label: "Shoulders (Width & Slope)",
      ...toScreen(m.shoulderHalfW, m.shoulderY + m.shoulderDrop),
      axis: "xy",
      mirrorX: cx - m.shoulderHalfW * scale,
      apply(dx, dy, cur) {
        return {
          shoulderWidth: clamp((cur.shoulderWidth ?? 1) + (dx / scale) * 0.010, 0.70, 1.42),
          shoulderSlope: clamp((cur.shoulderSlope ?? 0.08) + (dy / scale) * 0.014, -0.35, 0.45),
        };
      },
    },
  ];

  if (avatar.framing !== "bust") {
    handles.push(
      {
        id: "chest",
        label: "Chest / Bust Width",
        ...toScreen(m.chestHalfW, m.shoulderY + m.torsoLen * 0.34),
        axis: "x",
        mirrorX: cx - m.chestHalfW * scale,
        apply(dx, _dy, cur) {
          return { chestWidth: clamp((cur.chestWidth ?? 1) + (dx / scale) * 0.012, 0.70, 1.38) };
        },
      },
      {
        id: "waist",
        label: "Waist Taper & Torso Length",
        ...toScreen(m.waistHalfW, m.shoulderY + m.torsoLen * 0.70),
        axis: "xy",
        mirrorX: cx - m.waistHalfW * scale,
        apply(dx, dy, cur) {
          return {
            waistWidth: clamp((cur.waistWidth ?? 1) + (dx / scale) * 0.013, 0.58, 1.38),
            torsoLength: clamp((cur.torsoLength ?? 1) + (dy / scale) * 0.008, 0.80, 1.28),
          };
        },
      },
      {
        id: "arm",
        label: "Arm Build",
        ...toScreen(m.shoulderHalfW + m.armThick * 0.78, m.shoulderY + m.shoulderDrop + m.torsoLen * 0.42),
        axis: "x",
        mirrorX: cx - (m.shoulderHalfW + m.armThick * 0.78) * scale,
        apply(dx, _dy, cur) {
          return { armThickness: clamp((cur.armThickness ?? 1) + (dx / scale) * 0.022, 0.70, 1.40) };
        },
      }
    );
  }

  return handles.filter((pt) => pt.y > 10 && pt.y < h - 10);
}

export function hitTestSculptHandle(handles, px, py, hitRadius = 22) {
  let best = null;
  let bestDist = hitRadius * hitRadius;
  for (const h of handles) {
    const dMain = (px - h.x) ** 2 + (py - h.y) ** 2;
    if (dMain < bestDist) {
      bestDist = dMain;
      best = { handle: h, mirrored: false };
    }
    if (h.mirrorX !== undefined) {
      const dMir = (px - h.mirrorX) ** 2 + (py - h.y) ** 2;
      if (dMir < bestDist) {
        bestDist = dMir;
        best = { handle: h, mirrored: true };
      }
    }
  }
  return best;
}

// ============================================================================
// Main 2.5D Avatar Canvas Renderer
// ============================================================================

function applyStageClipAndBackdrop(ctx, w, h, avatar, anim) {
  const shape = avatar.framing === "cutout" ? "cutout" : avatar.stageShape || "card";
  const pad = 2;

  ctx.beginPath();
  if (shape === "circle") {
    const r = Math.min(w, h) * 0.5 - pad;
    ctx.arc(w * 0.5, h * 0.5, Math.max(10, r), 0, Math.PI * 2);
  } else if (shape === "arch") {
    const rw = w - pad * 2;
    const rh = h - pad * 2;
    const archR = rw * 0.5;
    ctx.moveTo(pad, pad + archR);
    ctx.arc(w * 0.5, pad + archR, archR, Math.PI, 0);
    ctx.lineTo(pad + rw, pad + rh - 18);
    ctx.quadraticCurveTo(pad + rw, pad + rh, pad + rw - 18, pad + rh);
    ctx.lineTo(pad + 18, pad + rh);
    ctx.quadraticCurveTo(pad, pad + rh, pad, pad + rh - 18);
    ctx.closePath();
  } else if (shape === "card") {
    ctx.roundRect(pad, pad, w - pad * 2, h - pad * 2, Math.min(26, w * 0.08));
  } else {
    // cutout: full rect clip, transparent bg
    ctx.rect(0, 0, w, h);
  }
  ctx.clip();

  if (shape === "cutout" || avatar.bgStyle === "transparent") {
    return;
  }

  let topCol = "#162033";
  let botCol = "#0b101b";
  let glowCol = "rgba(56, 189, 248, 0.22)";

  switch (avatar.bgStyle) {
    case "warm_cream":
      topCol = "#f6efe4";
      botCol = "#e3d8c6";
      glowCol = "rgba(217, 119, 6, 0.16)";
      break;
    case "sky_glass":
      topCol = "#dcebfa";
      botCol = "#b8d2ef";
      glowCol = "rgba(37, 99, 235, 0.18)";
      break;
    case "emerald_mist":
      topCol = "#132a28";
      botCol = "#091515";
      glowCol = "rgba(45, 212, 191, 0.22)";
      break;
    case "sunset":
      topCol = "#3a2234";
      botCol = "#1b121c";
      glowCol = "rgba(251, 146, 60, 0.24)";
      break;
    case "custom": {
      const c = parseHex(avatar.bgColor, [22, 32, 51]);
      topCol = rgbStr(shadeRgb(c, 1.18));
      botCol = rgbStr(shadeRgb(c, 0.68));
      const ac = parseHex(avatar.bgAccent, [56, 189, 248]);
      glowCol = rgbStr(ac, 0.25);
      break;
    }
    default:
      break;
  }

  const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0, topCol);
  bgGrad.addColorStop(1, botCol);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  if (avatar.haloGlow !== false) {
    const pulse = 1 + anim.voicing * 0.28 + anim.energy * 0.18;
    const rad = Math.min(w, h) * 0.46 * pulse;
    const rg = ctx.createRadialGradient(w * 0.5, h * 0.42, rad * 0.08, w * 0.5, h * 0.42, rad);
    rg.addColorStop(0, glowCol);
    rg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, w, h);
  }
}

export function drawBotAvatar(ctx, w, h, rawAvatar, anim, nowMs = performance.now(), options = {}) {
  const avatar = { ...DEFAULT_AVATAR, ...(rawAvatar || {}) };
  ctx.clearRect(0, 0, w, h);
  ctx.save();

  applyStageClipAndBackdrop(ctx, w, h, avatar, anim);

  const { cx, cy, scale } = computeAvatarTransform(w, h, avatar);
  const m = deriveMetrics(avatar);
  const timeSec = nowMs * 0.001;

  // Skin palette (blends toward porcelain/metallic when synthFinish > 0)
  const baseSkinRgb = parseHex(avatar.skinColor, [241, 198, 176]);
  const synthAmt = clamp(avatar.synthFinish ?? 0, 0, 1);
  const skinMid = mixRgb(baseSkinRgb, [218, 228, 242], synthAmt * 0.55);
  const skinLight = mixRgb(shadeRgb(skinMid, 1.12, 0.25), [248, 252, 255], synthAmt * 0.45);
  const skinShadow = mixRgb(shadeRgb(skinMid, 0.80, 0.35), [118, 136, 166], synthAmt * 0.55);
  const skinDeep = mixRgb(shadeRgb(skinMid, 0.64, 0.45), [72, 88, 118], synthAmt * 0.55);

  const hairRgb = parseHex(avatar.hairColor, [60, 39, 52]);
  const hairHiRgb = parseHex(avatar.hairHighlight, shadeRgb(hairRgb, 1.45));
  const outPriRgb = parseHex(avatar.outfitPrimary, [30, 47, 77]);
  const outSecRgb = parseHex(avatar.outfitSecondary, [244, 246, 251]);
  const outAccRgb = parseHex(avatar.outfitAccent, [56, 189, 248]);

  // Breathing, speech prosody nod, and 2.5D head parallax
  const breathLift = Math.sin(timeSec * 1.9) * 1.15;
  const emoteNod = anim.emote === "nod" ? Math.sin(timeSec * 11) * 3.8 : 0;
  const nodY = anim.energy * 2.5 - anim.pitchSt * 0.52 + Math.sin(timeSec * 1.4) * 0.75 + emoteNod;
  const headTilt =
    Math.sin(timeSec * 0.82) * 0.015 +
    anim.pitchSt * 0.006 * Math.cos(timeSec * 1.8) +
    anim.lookX * 0.032 +
    (anim.emote === "think" ? -0.065 : 0);

  const yawX = anim.lookX * 5.2;
  const pitchY = anim.lookY * 3.0;
  const chinDrop = anim.jaw * 14.2 * (1 - anim.lipC * 0.55) * m.headScale;
  const chinY = m.chinBaseY + chinDrop;

  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // ==========================================================================
  // 1. Back Hair Silhouette (drawn BEHIND neck & shoulders — zero throat seam!)
  // ==========================================================================
  if (avatar.hairStyle === "long_waves" || avatar.hairStyle === "shoulder_lob" || avatar.hairStyle === "sleek_bob" || avatar.hairStyle === "curly_halo") {
    ctx.save();
    ctx.translate(-yawX * 0.42, nodY * 0.65);
    ctx.rotate(headTilt * 0.55);
    const backLen =
      avatar.hairStyle === "long_waves" ? m.shoulderY + 46 :
      avatar.hairStyle === "shoulder_lob" ? m.shoulderY + 18 :
      avatar.hairStyle === "curly_halo" ? 42 : 48;
    const flare = avatar.hairStyle === "curly_halo" ? 24 : avatar.hairStyle === "long_waves" ? 17 : 11;
    const bhGrad = ctx.createLinearGradient(0, -m.headH - 16, 0, backLen);
    bhGrad.addColorStop(0, rgbStr(shadeRgb(hairRgb, 1.05)));
    bhGrad.addColorStop(0.6, rgbStr(shadeRgb(hairRgb, 0.75)));
    bhGrad.addColorStop(1, rgbStr(shadeRgb(hairRgb, 0.48)));
    ctx.fillStyle = bhGrad;
    ctx.beginPath();
    if (avatar.hairStyle === "curly_halo") {
      ctx.ellipse(0, -14, m.headW + flare, m.headH * 0.92 + 16, 0, 0, Math.PI * 2);
    } else {
      ctx.moveTo(-m.headW - 9, -12);
      ctx.bezierCurveTo(-m.headW - 15, -m.headH - 20, m.headW + 15, -m.headH - 20, m.headW + 9, -12);
      ctx.bezierCurveTo(m.headW + flare + 4, 34, m.headW + flare, backLen - 16, m.headW + 2, backLen);
      ctx.lineTo(-m.headW - 2, backLen);
      ctx.bezierCurveTo(-m.headW - flare, backLen - 16, -m.headW - flare - 4, 34, -m.headW - 9, -12);
      ctx.closePath();
    }
    ctx.fill();
    ctx.restore();
  }

  // ==========================================================================
  // 2. Sculpted Neck, Trapezius, Torso, Waist, Hips & Expressive Arms
  // ==========================================================================
  const sy = m.shoulderY + breathLift * 0.65;
  const shEndY = sy + m.shoulderDrop;
  const waistY = sy + m.torsoLen * 0.68;
  const hipY = sy + m.torsoLen * 1.12;

  // Neck cylinder + trapezius flare into shoulders
  const neckGrad = ctx.createLinearGradient(-m.neckHalfW - 8, 42, m.neckHalfW + 8, sy + 16);
  neckGrad.addColorStop(0, rgbStr(skinShadow));
  neckGrad.addColorStop(0.36, rgbStr(skinLight));
  neckGrad.addColorStop(0.72, rgbStr(skinMid));
  neckGrad.addColorStop(1, rgbStr(skinDeep));
  ctx.fillStyle = neckGrad;
  ctx.beginPath();
  ctx.moveTo(-m.neckHalfW, 34);
  ctx.quadraticCurveTo(-m.neckHalfW - 1, sy - 6, -m.neckHalfW - 24, sy + 18);
  ctx.lineTo(m.neckHalfW + 24, sy + 18);
  ctx.quadraticCurveTo(m.neckHalfW + 1, sy - 6, m.neckHalfW, 34);
  ctx.closePath();
  ctx.fill();

  // Synth neck seam rings for cyber characters
  if (synthAmt > 0.35) {
    ctx.strokeStyle = rgbStr(outAccRgb, 0.42 * synthAmt);
    ctx.lineWidth = 1.2;
    for (const ny of [49, 59]) {
      ctx.beginPath();
      ctx.moveTo(-m.neckHalfW * 0.92, ny);
      ctx.quadraticCurveTo(0, ny + 3.5, m.neckHalfW * 0.92, ny);
      ctx.stroke();
    }
  }

  // Cast shadow of mandible onto upper neck
  const jawShadow = ctx.createRadialGradient(yawX * 0.5, 51 + nodY, 4, yawX * 0.3, 56 + nodY, m.neckHalfW * 1.48);
  jawShadow.addColorStop(0, "rgba(38, 18, 16, 0.44)");
  jawShadow.addColorStop(1, "rgba(38, 18, 16, 0)");
  ctx.fillStyle = jawShadow;
  ctx.beginPath();
  ctx.ellipse(yawX * 0.35, 55 + nodY, m.neckHalfW * 1.28, 15 + chinDrop * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();

  // Back/Upper Arms (connected smoothly to deltoid caps)
  const speakBounce = anim.energy * 5.5 + Math.max(0, anim.pitchSt) * 0.7;
  const isWaving = anim.emote === "wave";

  for (const dir of [-1, 1]) {
    const shX = dir * m.shoulderHalfW;
    const shY = shEndY;
    const elbowX = dir * (m.shoulderHalfW + m.armThick * 0.55);
    const elbowY = sy + m.torsoLen * 0.58;

    const armGrad = ctx.createLinearGradient(shX - dir * m.armThick, shY, elbowX + dir * m.armThick, elbowY);
    armGrad.addColorStop(0, rgbStr(shadeRgb(outPriRgb, dir < 0 ? 1.12 : 0.96)));
    armGrad.addColorStop(1, rgbStr(shadeRgb(outPriRgb, 0.68)));

    ctx.strokeStyle = armGrad;
    ctx.lineWidth = m.armThick * 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (isWaving && dir === 1) {
      // Friendly raised waving right arm + hand!
      const waveAngle = Math.sin(timeSec * 12) * 14;
      const wElbowX = shX + 18;
      const wElbowY = shY + 18;
      const handX = wElbowX + 10 + waveAngle;
      const handY = shY - 38;

      ctx.beginPath();
      ctx.moveTo(shX - 4, shY + 4);
      ctx.quadraticCurveTo(wElbowX, wElbowY + 8, wElbowX, wElbowY);
      ctx.lineTo(handX, handY + 10);
      ctx.stroke();

      // Open waving palm
      ctx.fillStyle = rgbStr(skinLight);
      ctx.beginPath();
      ctx.ellipse(handX + 1, handY, 9.5, 12, (waveAngle * Math.PI) / 180, 0, Math.PI * 2);
      ctx.fill();
      continue;
    }

    ctx.beginPath();
    ctx.moveTo(shX - dir * 5, shY + 4);
    ctx.quadraticCurveTo(elbowX + dir * 3, (shY + elbowY) * 0.52, elbowX, elbowY);

    let wristX = dir * (m.waistHalfW + m.armThick * 0.95);
    let wristY = hipY + 12;
    let showFrontHand = false;

    if (avatar.posture === "welcoming") {
      wristX = dir * (m.chestHalfW + m.armThick * 1.15);
      wristY = hipY + 8 - speakBounce * 0.6;
    } else if (avatar.posture === "presenter") {
      if (dir === 1) {
        wristX = m.chestHalfW * 0.62;
        wristY = waistY - 26 - speakBounce * 1.3;
        showFrontHand = true;
      } else {
        wristX = -m.waistHalfW - m.armThick * 0.85;
        wristY = hipY + 10;
      }
    } else if (avatar.posture === "confident") {
      wristX = dir * 20;
      wristY = waistY - 8;
      showFrontHand = true;
    }

    ctx.lineTo(wristX, wristY);
    ctx.stroke();

    if (showFrontHand && avatar.framing !== "bust") {
      ctx.fillStyle = rgbStr(outSecRgb);
      ctx.beginPath();
      ctx.ellipse(wristX + dir * 2, wristY + 2, m.armThick * 0.56, m.armThick * 0.44, dir * -0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = rgbStr(dir < 0 ? skinLight : skinMid);
      ctx.beginPath();
      ctx.ellipse(wristX - dir * 3, wristY - 2, m.armThick * 0.62, m.armThick * 0.48, dir * -0.35, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Sculpted Torso Silhouette (Shoulders -> Chest -> Waist -> Hips)
  const torsoGrad = ctx.createLinearGradient(-m.shoulderHalfW, sy, m.shoulderHalfW, hipY);
  torsoGrad.addColorStop(0, rgbStr(shadeRgb(outPriRgb, 1.16)));
  torsoGrad.addColorStop(0.48, rgbStr(outPriRgb));
  torsoGrad.addColorStop(1, rgbStr(shadeRgb(outPriRgb, 0.66)));

  ctx.fillStyle = torsoGrad;
  ctx.beginPath();
  // Collar base left -> shoulder slope -> underarm/chest -> tapered waist -> hip flare
  ctx.moveTo(-m.neckHalfW - 4, sy - 3);
  ctx.quadraticCurveTo(-m.shoulderHalfW * 0.62, sy - 2, -m.shoulderHalfW, shEndY);
  ctx.quadraticCurveTo(-m.shoulderHalfW - 4, shEndY + 18, -m.chestHalfW, sy + m.torsoLen * 0.32);
  ctx.bezierCurveTo(
    -m.chestHalfW + 2,
    sy + m.torsoLen * 0.50,
    -m.waistHalfW,
    waistY - 12,
    -m.waistHalfW,
    waistY
  );
  ctx.quadraticCurveTo(-m.waistHalfW, (waistY + hipY) * 0.5, -m.hipHalfW, hipY);
  ctx.lineTo(m.hipHalfW, hipY);
  ctx.quadraticCurveTo(m.waistHalfW, (waistY + hipY) * 0.5, m.waistHalfW, waistY);
  ctx.bezierCurveTo(
    m.waistHalfW,
    waistY - 12,
    m.chestHalfW - 2,
    sy + m.torsoLen * 0.50,
    m.chestHalfW,
    sy + m.torsoLen * 0.32
  );
  ctx.quadraticCurveTo(m.shoulderHalfW + 4, shEndY + 18, m.shoulderHalfW, shEndY);
  ctx.quadraticCurveTo(m.shoulderHalfW * 0.62, sy - 2, m.neckHalfW + 4, sy - 3);
  ctx.quadraticCurveTo(0, sy + 14, -m.neckHalfW - 4, sy - 3);
  ctx.closePath();
  ctx.fill();

  // Subtle rim highlight along shoulders
  ctx.strokeStyle = "rgba(255, 255, 255, 0.14)";
  ctx.lineWidth = 1.3;
  ctx.stroke();

  // Outfit Collar, Inner Shirt, Tie, Cyber Core, or Turtleneck Details
  const outfit = avatar.outfitStyle || "blazer";
  if (outfit === "blazer" || outfit === "suit_tie" || outfit === "vest") {
    // Exposed collarbone/throat v-skin + tailored inner shirt V
    ctx.fillStyle = rgbStr(skinMid);
    ctx.beginPath();
    ctx.moveTo(-m.neckHalfW + 1, sy - 4);
    ctx.quadraticCurveTo(0, sy + 20, m.neckHalfW - 1, sy - 4);
    ctx.closePath();
    ctx.fill();

    const vDepth = outfit === "suit_tie" ? sy + 64 : sy + 54;
    ctx.fillStyle = rgbStr(outSecRgb);
    ctx.beginPath();
    ctx.moveTo(-m.neckHalfW - 3, sy - 2);
    ctx.lineTo(0, vDepth);
    ctx.lineTo(m.neckHalfW + 3, sy - 2);
    ctx.quadraticCurveTo(0, sy + 14, -m.neckHalfW - 3, sy - 2);
    ctx.closePath();
    ctx.fill();

    if (outfit === "suit_tie") {
      // Crisp tie knot & blade
      ctx.fillStyle = rgbStr(outAccRgb);
      ctx.beginPath();
      ctx.moveTo(-5.5, sy + 12);
      ctx.lineTo(5.5, sy + 12);
      ctx.lineTo(3.8, sy + 21);
      ctx.lineTo(6.8, vDepth - 6);
      ctx.lineTo(0, vDepth + 4);
      ctx.lineTo(-6.8, vDepth - 6);
      ctx.lineTo(-3.8, sy + 21);
      ctx.closePath();
      ctx.fill();
    }

    // Tailored Jacket Lapels
    ctx.fillStyle = rgbStr(shadeRgb(outPriRgb, 1.22));
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1;
    for (const dir of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(dir * (m.neckHalfW + 3), sy - 3);
      ctx.lineTo(dir * (m.neckHalfW + 17), sy + 18);
      ctx.lineTo(dir * (m.neckHalfW + 8), sy + 24);
      ctx.lineTo(dir * 2, vDepth + 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  } else if (outfit === "turtleneck") {
    const tnGrad = ctx.createLinearGradient(-m.neckHalfW - 5, sy - 18, m.neckHalfW + 5, sy + 8);
    tnGrad.addColorStop(0, rgbStr(shadeRgb(outPriRgb, 1.25)));
    tnGrad.addColorStop(1, rgbStr(shadeRgb(outPriRgb, 0.78)));
    ctx.fillStyle = tnGrad;
    ctx.beginPath();
    ctx.roundRect(-m.neckHalfW - 4, sy - 17, (m.neckHalfW + 4) * 2, 24, 7);
    ctx.fill();
  } else if (outfit === "hoodie" || outfit === "sweater") {
    // Crew neckline + subtle rib collar
    ctx.fillStyle = rgbStr(skinMid);
    ctx.beginPath();
    ctx.moveTo(-m.neckHalfW + 1, sy - 4);
    ctx.quadraticCurveTo(0, sy + 13, m.neckHalfW - 1, sy - 4);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = rgbStr(shadeRgb(outPriRgb, 1.28));
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(-m.neckHalfW - 3, sy - 2);
    ctx.quadraticCurveTo(0, sy + 15, m.neckHalfW + 3, sy - 2);
    ctx.stroke();

    if (outfit === "hoodie") {
      // Drawstrings
      ctx.strokeStyle = rgbStr(outSecRgb, 0.85);
      ctx.lineWidth = 2;
      for (const dx of [-9, 9]) {
        ctx.beginPath();
        ctx.moveTo(dx, sy + 9);
        ctx.quadraticCurveTo(dx + (dx < 0 ? -1.5 : 1.5), sy + 28, dx, sy + 40);
        ctx.stroke();
      }
    }
  } else if (outfit === "cyber") {
    // Glowing chest arc / synth telemetry lines
    ctx.strokeStyle = rgbStr(outAccRgb, 0.75);
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-m.chestHalfW * 0.65, sy + 18);
    ctx.lineTo(-16, sy + 32);
    ctx.lineTo(16, sy + 32);
    ctx.lineTo(m.chestHalfW * 0.65, sy + 18);
    ctx.stroke();

    const corePulse = 0.55 + anim.voicing * 0.45;
    const cg = ctx.createRadialGradient(0, sy + 32, 1, 0, sy + 32, 14);
    cg.addColorStop(0, rgbStr(outAccRgb, corePulse));
    cg.addColorStop(1, rgbStr(outAccRgb, 0));
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.arc(0, sy + 32, 14, 0, Math.PI * 2);
    ctx.fill();
  }

  // Optional Concierge Lapel Pin / Accent Badge
  if (avatar.nameBadge && outfit !== "cyber") {
    ctx.fillStyle = rgbStr(outAccRgb);
    ctx.beginPath();
    ctx.roundRect(m.chestHalfW * 0.36, sy + 24, 15, 5.5, 2.5);
    ctx.fill();
  }

  // ==========================================================================
  // 3. Expressive Head Group (Tilts, Nods, 2.5D Parallax & 200 Hz Lip Sync!)
  // ==========================================================================
  ctx.save();
  ctx.translate(yawX * 0.35, nodY + pitchY * 0.4);
  ctx.rotate(headTilt);

  // Back crown hair for shorter masculine/cropped styles
  if (avatar.hairStyle === "side_sweep" || avatar.hairStyle === "quiff" || avatar.hairStyle === "pixie" || avatar.hairStyle === "buzz" || avatar.hairStyle === "updo_bun") {
    const chGrad = ctx.createLinearGradient(0, -m.headH - 28, 0, 18);
    chGrad.addColorStop(0, rgbStr(shadeRgb(hairRgb, 1.15)));
    chGrad.addColorStop(1, rgbStr(shadeRgb(hairRgb, 0.62)));
    ctx.fillStyle = chGrad;

    if (avatar.hairStyle === "updo_bun") {
      ctx.beginPath();
      ctx.arc(-yawX * 0.35, -m.headH - 12, 20 * m.headScale, 0, Math.PI * 2);
      ctx.fill();
    }

    const pad = avatar.hairStyle === "buzz" ? 2.2 : 5.5;
    ctx.beginPath();
    ctx.moveTo(-m.headW - pad, -10);
    ctx.bezierCurveTo(-m.headW - pad - 4, -m.headH - 14, m.headW + pad + 4, -m.headH - 14, m.headW + pad, -10);
    ctx.lineTo(m.headW - 2, 16);
    ctx.lineTo(-m.headW + 2, 16);
    ctx.closePath();
    ctx.fill();
  }

  // Sculpted Ears (human, pointed, or cyber pods)
  const earSc = clamp(avatar.earSize ?? 1, 0.65, 1.45) * m.headScale;
  for (const dir of [-1, 1]) {
    const earX = dir * (m.headW - 0.5) - yawX * 0.42;
    const earY = -2;
    if (avatar.earStyle === "cyber") {
      ctx.fillStyle = rgbStr(outPriRgb);
      ctx.strokeStyle = rgbStr(outAccRgb, 0.85);
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(earX - 5 * earSc, earY - 14 * earSc, 10 * earSc, 28 * earSc, 4 * earSc);
      ctx.fill();
      ctx.stroke();
      continue;
    }
    const earGrad = ctx.createLinearGradient(earX, earY - 16 * earSc, earX, earY + 15 * earSc);
    earGrad.addColorStop(0, rgbStr(skinLight));
    earGrad.addColorStop(1, rgbStr(skinShadow));
    ctx.fillStyle = earGrad;
    ctx.beginPath();
    if (avatar.earStyle === "pointed") {
      ctx.moveTo(earX - dir * 4 * earSc, earY - 11 * earSc);
      ctx.quadraticCurveTo(earX + dir * 15 * earSc, earY - 22 * earSc, earX + dir * 13 * earSc, earY - 4 * earSc);
      ctx.quadraticCurveTo(earX + dir * 8 * earSc, earY + 14 * earSc, earX - dir * 3 * earSc, earY + 14 * earSc);
      ctx.closePath();
    } else {
      ctx.ellipse(earX, earY, 8.5 * earSc, 15.8 * earSc, dir * -0.09, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.fillStyle = rgbStr(skinDeep, 0.34);
    ctx.beginPath();
    ctx.ellipse(earX - dir * 1.2 * earSc, earY + 1, 4.0 * earSc, 8.8 * earSc, dir * -0.08, 0, Math.PI * 2);
    ctx.fill();
  }

  // Sculpted Cranium, Cheekbones, Mandible & Chin
  const skinGrad = ctx.createRadialGradient(-14 + yawX * 0.3, -26 * m.headScale, 8, 0, 6, m.headH * 1.48);
  skinGrad.addColorStop(0, rgbStr(skinLight));
  skinGrad.addColorStop(0.54, rgbStr(skinMid));
  skinGrad.addColorStop(0.88, rgbStr(skinShadow));
  skinGrad.addColorStop(1, rgbStr(skinDeep));

  const chinSpread = (6 + clamp(avatar.chinRoundness ?? 0.65, 0, 1) * 15) * m.headScale;
  ctx.fillStyle = skinGrad;
  ctx.beginPath();
  ctx.moveTo(-m.headW, -20 * m.headScale);
  ctx.bezierCurveTo(-m.headW, -m.headH - 4, m.headW, -m.headH - 4, m.headW, -20 * m.headScale);
  ctx.bezierCurveTo(m.cheekW + 1.5, -2, m.cheekW, 14 * m.headScale, m.jawW + 3, 34 * m.headScale + chinDrop * 0.45);
  ctx.bezierCurveTo(m.jawW - 4, 48 * m.headScale + chinDrop * 0.78, chinSpread, chinY - 0.8, 0, chinY + 2.8);
  ctx.bezierCurveTo(-chinSpread, chinY - 0.8, -m.jawW + 4, 48 * m.headScale + chinDrop * 0.78, -m.jawW - 3, 34 * m.headScale + chinDrop * 0.45);
  ctx.bezierCurveTo(-m.cheekW, 14 * m.headScale, -m.cheekW - 1.5, -2, -m.headW, -20 * m.headScale);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = rgbStr(skinDeep, 0.28);
  ctx.lineWidth = 1.25;
  ctx.stroke();

  // Studio forehead & cheekbone specular key-light
  const fhGlow = ctx.createRadialGradient(-10 + yawX * 0.5, -34 * m.headScale, 2, -6 + yawX * 0.4, -32 * m.headScale, 29 * m.headScale);
  fhGlow.addColorStop(0, `rgba(255, 248, 244, ${0.26 + synthAmt * 0.22})`);
  fhGlow.addColorStop(1, "rgba(255, 248, 244, 0)");
  ctx.fillStyle = fhGlow;
  ctx.beginPath();
  ctx.ellipse(-6 + yawX * 0.4, -32 * m.headScale, 28 * m.headScale, 15 * m.headScale, -0.1, 0, Math.PI * 2);
  ctx.fill();

  // Facial Feature Parallax Plane (shifts smoothly with 2.5D head yaw/pitch!)
  ctx.save();
  ctx.translate(yawX * 0.65, pitchY * 0.6);

  // Cheek warmth (lifts naturally with lipSpread smile!)
  const smileLift = anim.lipS * 3.6;
  const blushAlpha = clamp(avatar.blushIntensity ?? 0.2, 0, 0.65);
  if (blushAlpha > 0.01) {
    for (const dir of [-1, 1]) {
      const bx = dir * 29 * m.headScale;
      const by = 9 * m.headScale - smileLift * 0.5;
      const bg = ctx.createRadialGradient(bx, by, 2, bx, by, 18 * m.headScale);
      bg.addColorStop(0, `rgba(232, 104, 116, ${blushAlpha})`);
      bg.addColorStop(1, "rgba(232, 104, 116, 0)");
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(bx, by, 18 * m.headScale, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Facial Hair (Stubble, Beard, Goatee) — moves seamlessly with mandible jawDrop!
  const fhStyle = avatar.facialHair || "none";
  if (fhStyle === "stubble" || fhStyle === "beard" || fhStyle === "goatee") {
    const beardAlpha = fhStyle === "stubble" ? 0.22 : 0.88;
    ctx.fillStyle = rgbStr(shadeRgb(hairRgb, 0.85), beardAlpha);
    ctx.beginPath();
    if (fhStyle === "goatee") {
      ctx.ellipse(0, chinY - 9, 16 * m.headScale, 14 * m.headScale, 0, 0, Math.PI * 2);
    } else {
      const topJawY = 14 * m.headScale;
      ctx.moveTo(-m.cheekW + 2, topJawY);
      ctx.quadraticCurveTo(-m.jawW + 6, 28 * m.headScale + chinDrop * 0.3, -18 * m.headScale, 25 * m.headScale + chinDrop * 0.25);
      ctx.quadraticCurveTo(0, 22 * m.headScale + chinDrop * 0.22, 18 * m.headScale, 25 * m.headScale + chinDrop * 0.25);
      ctx.quadraticCurveTo(m.jawW - 6, 28 * m.headScale + chinDrop * 0.3, m.cheekW - 2, topJawY);
      ctx.bezierCurveTo(m.cheekW, 28 * m.headScale, m.jawW + 2, 46 * m.headScale + chinDrop * 0.75, 0, chinY + 3.5);
      ctx.bezierCurveTo(-m.jawW - 2, 46 * m.headScale + chinDrop * 0.75, -m.cheekW, 28 * m.headScale, -m.cheekW + 2, topJawY);
      ctx.closePath();
    }
    ctx.fill();
  }

  // ==========================================================================
  // Eyes, Sclera, Limbal Ring, Dual Catchlights, Lashes & Sculpted Brows
  // ==========================================================================
  const blinkElapsed = nowMs - anim.blinkStartMs;
  const naturalBlink = blinkElapsed >= 0 && blinkElapsed < 145 ? Math.sin((blinkElapsed / 145) * Math.PI) : 0;
  const eyeSc = clamp(avatar.eyeSize ?? 1, 0.75, 1.38) * m.headScale;
  const eyeSpan = 21.5 * clamp(avatar.eyeSpacing ?? 1, 0.80, 1.24) * m.headScale;
  const tilt = clamp(avatar.eyeTilt ?? 0.04, -0.3, 0.35);
  const browLift = clamp(anim.pitchSt * 0.85 + anim.energy * 2.4 + (anim.emote === "happy" ? 1.8 : 0), -2.5, 7.0);
  const irisRgb = parseHex(avatar.irisColor, [59, 130, 166]);

  for (const dir of [-1, 1]) {
    const ex = dir * eyeSpan;
    const ey = -12.5 * m.headScale;
    const winkClose = anim.emote === "wink" && dir === 1 ? 0.94 : 0;
    const blinkAmt = Math.max(naturalBlink, winkClose);
    const openH = Math.max(0.55, 6.2 * eyeSc * (1 - blinkAmt * 0.94));
    const ew = 11.4 * eyeSc;
    const outerLift = -tilt * 5.5;

    // Orbital socket shading
    const sockGrad = ctx.createRadialGradient(ex, ey - 1, 2, ex, ey - 1, 15 * eyeSc);
    sockGrad.addColorStop(0, rgbStr(skinDeep, 0.18));
    sockGrad.addColorStop(1, rgbStr(skinDeep, 0));
    ctx.fillStyle = sockGrad;
    ctx.beginPath();
    ctx.ellipse(ex, ey - 1, 15 * eyeSc, 11 * eyeSc, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyelid fold crease
    ctx.strokeStyle = rgbStr(skinDeep, 0.36);
    ctx.lineWidth = 1.05;
    ctx.beginPath();
    ctx.moveTo(ex - dir * ew * 0.92, ey - 2.8 - openH * 0.52);
    ctx.quadraticCurveTo(ex, ey - 5.8 - openH * 0.85, ex + dir * ew * 0.95, ey - 2.6 - openH * 0.52 + outerLift * 0.6);
    ctx.stroke();

    // Clipped Sclera + Iris + Pupil + Dual Catchlights
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(ex - dir * ew, ey + 0.6);
    ctx.quadraticCurveTo(ex, ey - openH * 1.46, ex + dir * ew, ey + 0.4 + outerLift);
    ctx.quadraticCurveTo(ex, ey + openH * 1.16, ex - dir * ew, ey + 0.6);
    ctx.closePath();

    const scleraGrad = ctx.createLinearGradient(ex, ey - openH, ex, ey + openH);
    scleraGrad.addColorStop(0, "#d6dce8");
    scleraGrad.addColorStop(0.35, "#f9fafe");
    scleraGrad.addColorStop(1, "#ebeff7");
    ctx.fillStyle = scleraGrad;
    ctx.fill();
    ctx.clip();

    const ix = ex + anim.lookX * 3.2 * eyeSc;
    const iy = ey + anim.lookY * 2.1 * eyeSc;
    const ir = 5.6 * eyeSc;

    const irisGrad = ctx.createRadialGradient(ix - 1.2 * eyeSc, iy - 1.4 * eyeSc, 0.7 * eyeSc, ix, iy, ir);
    irisGrad.addColorStop(0, rgbStr(shadeRgb(irisRgb, 1.38)));
    irisGrad.addColorStop(0.68, rgbStr(irisRgb));
    irisGrad.addColorStop(1, rgbStr(shadeRgb(irisRgb, 0.36)));
    ctx.fillStyle = irisGrad;
    ctx.beginPath();
    ctx.arc(ix, iy, ir, 0, Math.PI * 2);
    ctx.fill();

    // Pupil
    ctx.fillStyle = "#090c14";
    ctx.beginPath();
    ctx.arc(ix, iy, 2.45 * eyeSc, 0, Math.PI * 2);
    ctx.fill();

    // Dual studio corneal catchlights
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.beginPath();
    ctx.arc(ix - 1.8 * eyeSc, iy - 1.9 * eyeSc, 1.45 * eyeSc, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 255, 255, 0.56)";
    ctx.beginPath();
    ctx.arc(ix + 1.9 * eyeSc, iy + 1.5 * eyeSc, 0.78 * eyeSc, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Upper lash line
    const lashStyle = avatar.lashStyle || "classic";
    ctx.strokeStyle = "#17141f";
    ctx.lineWidth = (lashStyle === "lush" ? 2.45 : lashStyle === "classic" ? 1.95 : 1.55) * Math.sqrt(eyeSc);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(ex - dir * (ew + 0.3), ey + 0.6);
    ctx.quadraticCurveTo(
      ex,
      ey - openH * 1.48,
      ex + dir * (ew + (lashStyle === "lush" ? 1.9 : 0.4)),
      ey + 0.3 + outerLift - (lashStyle === "lush" ? 1.0 : 0)
    );
    ctx.stroke();

    // Sculpted, tapered eyebrow
    const browSc = clamp(avatar.browThickness ?? 1, 0.5, 1.65);
    const arch = clamp(avatar.browArch ?? 0.2, -0.2, 0.6) * 10;
    const by = ey - (12.8 + browLift) * m.headScale;
    const thick = 3.0 * browSc * m.headScale;
    ctx.fillStyle = rgbStr(shadeRgb(hairRgb, 0.85));
    ctx.beginPath();
    ctx.moveTo(ex - dir * (ew + 0.5), by + 1.8);
    ctx.quadraticCurveTo(ex + dir * 2, by - 3.0 - arch, ex + dir * (ew + 2.4), by + 1.5);
    ctx.quadraticCurveTo(ex + dir * 2, by - 3.0 - arch + thick, ex - dir * ew, by + 1.8 + thick * 0.82);
    ctx.closePath();
    ctx.fill();
  }

  // ==========================================================================
  // 3D Sculpted Nose (Bridge, Tip Highlight, Alar Wings, Nostrils, Philtrum)
  // ==========================================================================
  const noseLen = clamp(avatar.noseLength ?? 1, 0.76, 1.28) * m.headScale;
  const noseW = clamp(avatar.noseWidth ?? 1, 0.72, 1.35) * m.headScale;
  const tipY = 10.2 * noseLen;

  const noseShade = ctx.createLinearGradient(-7 * noseW, -13, 6 * noseW, tipY + 3);
  noseShade.addColorStop(0, rgbStr(skinDeep, 0.05));
  noseShade.addColorStop(1, rgbStr(skinDeep, 0.26));
  ctx.fillStyle = noseShade;
  ctx.beginPath();
  ctx.moveTo(1, -13 * m.headScale);
  ctx.quadraticCurveTo(6.5 * noseW, 1, 9.2 * noseW, tipY - 0.6);
  ctx.quadraticCurveTo(3 * noseW, tipY + 4.2, 0, tipY + 3.2);
  ctx.closePath();
  ctx.fill();

  // Underside tip & nostrils
  ctx.fillStyle = rgbStr(skinDeep, 0.30);
  ctx.beginPath();
  ctx.moveTo(-9.2 * noseW, tipY);
  ctx.quadraticCurveTo(0, tipY + 5.8, 9.2 * noseW, tipY);
  ctx.quadraticCurveTo(0, tipY + 3.0, -9.2 * noseW, tipY);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(56, 24, 20, 0.62)";
  for (const dir of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(dir * 4.5 * noseW, tipY + 1.1, 2.2 * noseW, 1.1, dir * -0.28, 0, Math.PI * 2);
    ctx.fill();
  }

  // Alar wing contours & nasal bridge specular key-light
  ctx.strokeStyle = rgbStr(skinDeep, 0.38);
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(-6.3 * noseW, tipY - 0.5, 3.2 * noseW, Math.PI * 0.55, Math.PI * 1.45);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(6.3 * noseW, tipY - 0.5, 3.2 * noseW, -Math.PI * 0.45, Math.PI * 0.45);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255, 246, 240, 0.38)";
  ctx.lineWidth = 2.1;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-0.8, -10 * m.headScale);
  ctx.lineTo(-0.9, tipY - 4.4);
  ctx.stroke();
  ctx.fillStyle = "rgba(255, 246, 240, 0.35)";
  ctx.beginPath();
  ctx.ellipse(-0.5, tipY - 1.4, 3.1 * noseW, 2.3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Subtle philtrum dimple
  ctx.fillStyle = rgbStr(skinDeep, 0.14);
  ctx.beginPath();
  ctx.ellipse(0, (tipY + 29 * m.headScale) * 0.5, 2.6, 4.6 * m.headScale, 0, 0, Math.PI * 2);
  ctx.fill();

  // ==========================================================================
  // 200 Hz Articulatory Mouth (Oral Cavity, Tongue, Incisors, Vermilion Lips!)
  // ==========================================================================
  const my = 30.8 * m.headScale + chinDrop * 0.30;
  const mouthSc = clamp(avatar.mouthWidth ?? 1, 0.76, 1.30) * m.headScale;
  const lipSc = clamp(avatar.lipFullness ?? 1, 0.65, 1.52) * m.headScale;
  const isLabiodental = anim.phone === "F" || anim.phone === "V";
  const roundAmt = anim.lipR;
  const spreadAmt = anim.lipS;
  const closeAmt = isLabiodental ? Math.min(0.68, anim.lipC) : anim.lipC;

  const halfW = (20.2 + spreadAmt * 8.6 - roundAmt * 7.0) * mouthSc;
  const rawOpen = (1.1 + anim.jaw * 21.0) * (1 - closeAmt * 0.97) * m.headScale;
  const openH = isLabiodental ? Math.max(2.6 * m.headScale, rawOpen) : Math.max(0.24, rawOpen);
  const cornerY = my - smileLift * 0.85 + roundAmt * 1.4;
  const upperInnerY = my - openH * 0.44;
  const lowerInnerY = my + openH * 0.56;
  const lowerThick = ((isLabiodental ? 4.1 : 5.6) + roundAmt * 2.4 - spreadAmt * 0.8) * lipSc;
  const upperThick = (4.4 + roundAmt * 2.1 - spreadAmt * 0.7) * lipSc;

  // Labiomental crease shadow + chin highlight
  ctx.fillStyle = rgbStr(skinDeep, 0.24);
  ctx.beginPath();
  ctx.ellipse(0, lowerInnerY + lowerThick + 3.0, halfW * 0.52, 2.3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Inner oral cavity, tongue & incisors (clipped cleanly to lip aperture)
  if (openH > 0.78) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-halfW + 1.4, cornerY);
    ctx.quadraticCurveTo(0, upperInnerY - 2.1, halfW - 1.4, cornerY);
    ctx.quadraticCurveTo(0, lowerInnerY + 2.4, -halfW + 1.4, cornerY);
    ctx.closePath();
    ctx.clip();

    const cavGrad = ctx.createLinearGradient(0, upperInnerY - 4, 0, lowerInnerY + 6);
    cavGrad.addColorStop(0, "#1c0b12");
    cavGrad.addColorStop(0.55, "#361320");
    cavGrad.addColorStop(1, "#1d0911");
    ctx.fillStyle = cavGrad;
    ctx.fillRect(-halfW - 4, upperInnerY - 8, halfW * 2 + 8, openH + 18);

    // Articulatory tongue (tracks 200 Hz `tH` and `tTip`!)
    const tongueLift = Math.max(anim.tH * 0.72, anim.tTip * 0.96);
    const tongueTopY = lowerInnerY + 2 - tongueLift * (openH * 0.88 + 3.4 * m.headScale);
    const tongueHalfW = halfW * (anim.tTip > 0.6 ? 0.58 : 0.78);
    const tGrad = ctx.createRadialGradient(0, tongueTopY + 5, 2, 0, tongueTopY + 8, tongueHalfW);
    tGrad.addColorStop(0, "#f5879b");
    tGrad.addColorStop(1, "#b84962");
    ctx.fillStyle = tGrad;
    ctx.beginPath();
    ctx.ellipse(0, tongueTopY + 8, tongueHalfW, 9.5 * m.headScale, 0, Math.PI, Math.PI * 2);
    ctx.fill();

    // Upper incisors
    const teethW = halfW * 0.78;
    const upperTeethBottom = upperInnerY + (3.6 - roundAmt * 1.1) * m.headScale;
    ctx.fillStyle = "#f7f6f1";
    ctx.beginPath();
    ctx.roundRect(-teethW, upperInnerY - 5, teethW * 2, Math.max(1, upperTeethBottom - (upperInnerY - 5)), 2.2);
    ctx.fill();

    ctx.strokeStyle = "rgba(155, 148, 138, 0.34)";
    ctx.lineWidth = 0.7;
    for (const tx of [-teethW * 0.48, 0, teethW * 0.48]) {
      ctx.beginPath();
      ctx.moveTo(tx, upperInnerY - 4);
      ctx.lineTo(tx, upperTeethBottom);
      ctx.stroke();
    }

    // Lower incisors (move with jawDrop)
    if (openH > 5.4 * m.headScale && !isLabiodental) {
      const lowerTeethTop = lowerInnerY - 2.3 * m.headScale + anim.jaw * 1.3;
      ctx.fillStyle = "#eae8e1";
      ctx.beginPath();
      ctx.roundRect(-teethW * 0.88, lowerTeethTop, teethW * 1.76, 6 * m.headScale, 1.8);
      ctx.fill();
    }
    ctx.restore();
  }

  // Sculpted Upper Cupid's Bow & Lower Lip Vermilion Cushion
  const lipRgb = parseHex(avatar.lipColor, [214, 104, 124]);
  ctx.fillStyle = rgbStr(shadeRgb(lipRgb, 0.82));
  ctx.beginPath();
  ctx.moveTo(-halfW, cornerY);
  ctx.bezierCurveTo(-halfW * 0.55, upperInnerY - upperThick, -5.2 * mouthSc, upperInnerY - upperThick - 1.6, 0, upperInnerY - upperThick + 0.9);
  ctx.bezierCurveTo(5.2 * mouthSc, upperInnerY - upperThick - 1.6, halfW * 0.55, upperInnerY - upperThick, halfW, cornerY);
  ctx.quadraticCurveTo(0, upperInnerY - (openH < 0.9 ? 0 : 1.5), -halfW, cornerY);
  ctx.closePath();
  ctx.fill();

  const lowLipOffset = isLabiodental ? -1.8 * m.headScale : 0;
  ctx.fillStyle = rgbStr(lipRgb);
  ctx.beginPath();
  ctx.moveTo(-halfW, cornerY);
  ctx.quadraticCurveTo(0, lowerInnerY + (openH < 0.9 ? 0.2 : 1.7) + lowLipOffset, halfW, cornerY);
  ctx.bezierCurveTo(halfW * 0.62, lowerInnerY + lowerThick + lowLipOffset, -halfW * 0.62, lowerInnerY + lowerThick + lowLipOffset, -halfW, cornerY);
  ctx.closePath();
  ctx.fill();

  // Lower-lip studio sheen + corner commissures
  ctx.strokeStyle = "rgba(255, 238, 242, 0.40)";
  ctx.lineWidth = 1.45;
  ctx.beginPath();
  ctx.moveTo(-7.2 * mouthSc, lowerInnerY + lowerThick * 0.48 + lowLipOffset);
  ctx.quadraticCurveTo(0, lowerInnerY + lowerThick * 0.64 + lowLipOffset, 7.2 * mouthSc, lowerInnerY + lowerThick * 0.48 + lowLipOffset);
  ctx.stroke();

  for (const dir of [-1, 1]) {
    ctx.fillStyle = "rgba(68, 20, 32, 0.42)";
    ctx.beginPath();
    ctx.arc(dir * (halfW + 0.35), cornerY, 1.45, 0, Math.PI * 2);
    ctx.fill();
  }

  if (openH < 1.25) {
    ctx.strokeStyle = "rgba(68, 20, 32, 0.66)";
    ctx.lineWidth = 1.35;
    ctx.beginPath();
    ctx.moveTo(-halfW + 1, cornerY);
    ctx.quadraticCurveTo(0, my + 0.4, halfW - 1, cornerY);
    ctx.stroke();
  }

  // Mustache (drawn cleanly above upper lip!)
  if (fhStyle === "mustache" || fhStyle === "beard" || fhStyle === "goatee") {
    ctx.fillStyle = rgbStr(shadeRgb(hairRgb, 0.82));
    ctx.beginPath();
    const musY = upperInnerY - upperThick - 2.2;
    ctx.moveTo(0, musY - 2.6);
    ctx.quadraticCurveTo(halfW * 0.65, musY - 3.6, halfW + 2, cornerY - 1.5);
    ctx.quadraticCurveTo(halfW * 0.55, musY + 2.2, 0, musY + 0.8);
    ctx.quadraticCurveTo(-halfW * 0.55, musY + 2.2, -halfW - 2, cornerY - 1.5);
    ctx.quadraticCurveTo(-halfW * 0.65, musY - 3.6, 0, musY - 2.6);
    ctx.closePath();
    ctx.fill();
  }

  // ==========================================================================
  // Glasses / Holo Visor
  // ==========================================================================
  const gl = avatar.glasses || "none";
  if (gl !== "none") {
    const gCol = parseHex(avatar.glassesColor, [31, 36, 48]);
    const gy = -11.5 * m.headScale;
    const gw = 16.5 * eyeSc;
    const gh = 11.8 * eyeSc;

    if (gl === "visor") {
      const vg = ctx.createLinearGradient(-eyeSpan - gw, gy - gh, eyeSpan + gw, gy + gh);
      vg.addColorStop(0, rgbStr(gCol, 0.58));
      vg.addColorStop(0.5, "rgba(255, 255, 255, 0.35)");
      vg.addColorStop(1, rgbStr(gCol, 0.62));
      ctx.fillStyle = vg;
      ctx.strokeStyle = rgbStr(gCol, 0.95);
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(-eyeSpan - gw, gy - gh * 0.85, (eyeSpan + gw) * 2, gh * 1.75, 8);
      ctx.fill();
      ctx.stroke();
    } else {
      const isShades = gl === "shades";
      ctx.strokeStyle = rgbStr(gCol);
      ctx.lineWidth = gl === "bold" ? 3.0 : gl === "round" ? 1.5 : 2.2;
      for (const dir of [-1, 1]) {
        const gx = dir * eyeSpan;
        ctx.fillStyle = isShades ? rgbStr(gCol, 0.72) : "rgba(220, 238, 255, 0.11)";
        ctx.beginPath();
        if (gl === "round") {
          ctx.arc(gx, gy, gw * 0.86, 0, Math.PI * 2);
        } else {
          ctx.roundRect(gx - gw * 0.92, gy - gh * 0.82, gw * 1.84, gh * 1.64, gl === "bold" ? 4.5 : 6);
        }
        ctx.fill();
        ctx.stroke();
      }
      // Nose bridge bar
      ctx.beginPath();
      ctx.moveTo(-eyeSpan + gw * (gl === "round" ? 0.84 : 0.90), gy - 1.5);
      ctx.quadraticCurveTo(0, gy - 4.2, eyeSpan - gw * (gl === "round" ? 0.84 : 0.90), gy - 1.5);
      ctx.stroke();
    }
  }

  ctx.restore(); // end facial parallax plane

  // ==========================================================================
  // Front Crown Hair, Fringe & Specular Studio Highlight
  // ==========================================================================
  const hs = avatar.hairStyle || "side_sweep";
  if (hs !== "none") {
    const fGrad = ctx.createLinearGradient(-26, -m.headH - 24, 26, -10);
    fGrad.addColorStop(0, rgbStr(shadeRgb(hairRgb, 1.18)));
    fGrad.addColorStop(0.55, rgbStr(hairRgb));
    fGrad.addColorStop(1, rgbStr(shadeRgb(hairRgb, 0.66)));
    ctx.fillStyle = fGrad;

    ctx.beginPath();
    if (hs === "long_waves" || hs === "sleek_bob" || hs === "shoulder_lob") {
      const sideDrop = hs === "sleek_bob" ? 36 * m.headScale : 24 * m.headScale;
      const hlTop = -m.headH * 0.73;
      ctx.moveTo(-m.headW - 7, -8);
      ctx.bezierCurveTo(-m.headW - 13, -m.headH - 22, m.headW + 13, -m.headH - 22, m.headW + 7, -8);
      ctx.quadraticCurveTo(m.headW + 4, 14, m.headW - 0.5, sideDrop);
      ctx.bezierCurveTo(m.headW - 1.5, -14, m.headW - 9, hlTop + 10, 14, hlTop + 5);
      ctx.quadraticCurveTo(-8, hlTop - 3, -24, hlTop + 2);
      ctx.bezierCurveTo(-m.headW + 7, hlTop + 9, -m.headW + 1.5, -14, -m.headW + 0.5, sideDrop);
      ctx.quadraticCurveTo(-m.headW - 4, 14, -m.headW - 7, -8);
    } else if (hs === "quiff") {
      ctx.moveTo(-m.headW - 4, -10);
      ctx.bezierCurveTo(-m.headW - 9, -m.headH - 18, -18, -m.headH - 32, 10, -m.headH - 25);
      ctx.bezierCurveTo(36, -m.headH - 19, m.headW + 9, -m.headH - 8, m.headW + 4, -10);
      ctx.lineTo(m.headW, 4);
      ctx.lineTo(m.headW - 4.2, 4);
      ctx.quadraticCurveTo(m.headW - 5, -24, m.headW - 10, -40 * m.headScale);
      ctx.bezierCurveTo(22, -46 * m.headScale, -8, -55 * m.headScale, -26, -50 * m.headScale);
      ctx.bezierCurveTo(-38, -45 * m.headScale, -m.headW + 6, -30, -m.headW + 4.2, 4);
      ctx.lineTo(-m.headW, 4);
    } else if (hs === "curly_halo") {
      ctx.moveTo(-m.headW - 11, -6);
      ctx.bezierCurveTo(-m.headW - 22, -m.headH - 28, m.headW + 22, -m.headH - 28, m.headW + 11, -6);
      ctx.quadraticCurveTo(m.headW - 4, -36 * m.headScale, 18, -44 * m.headScale);
      ctx.quadraticCurveTo(0, -39 * m.headScale, -18, -44 * m.headScale);
      ctx.quadraticCurveTo(-m.headW + 4, -36 * m.headScale, -m.headW - 11, -6);
    } else if (hs === "buzz") {
      ctx.fillStyle = rgbStr(hairRgb, 0.72);
      ctx.moveTo(-m.headW - 1.5, -12);
      ctx.bezierCurveTo(-m.headW - 4, -m.headH - 8, m.headW + 4, -m.headH - 8, m.headW + 1.5, -12);
      ctx.quadraticCurveTo(m.headW - 5, -42 * m.headScale, 0, -46 * m.headScale);
      ctx.quadraticCurveTo(-m.headW + 5, -42 * m.headScale, -m.headW - 1.5, -12);
    } else {
      // side_sweep, pixie, updo_bun
      ctx.moveTo(-m.headW - 5, -10);
      ctx.bezierCurveTo(-m.headW - 10, -m.headH - 15, -20, -m.headH - 22, 6, -m.headH - 19);
      ctx.bezierCurveTo(32, -m.headH - 16, m.headW + 10, -m.headH - 10, m.headW + 5, -10);
      ctx.lineTo(m.headW, 5);
      ctx.lineTo(m.headW - 4, 5);
      ctx.quadraticCurveTo(m.headW - 4.5, -24, m.headW - 10, -38 * m.headScale);
      ctx.bezierCurveTo(22, -41 * m.headScale, -4, -49 * m.headScale, -24, -50 * m.headScale);
      ctx.bezierCurveTo(-36, -45 * m.headScale, -m.headW + 6, -30, -m.headW + 4, 5);
      ctx.lineTo(-m.headW, 5);
    }
    ctx.closePath();
    ctx.fill();

    // Specular hair crown ribbon
    if (hs !== "buzz") {
      ctx.strokeStyle = rgbStr(hairHiRgb, 0.34);
      ctx.lineWidth = 2.8;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-24, -m.headH + 4);
      ctx.quadraticCurveTo(2, -m.headH - 5, 28, -m.headH + 8);
      ctx.stroke();
    }
  }

  // ==========================================================================
  // Classic SitePal Concierge Headset Boom Mic
  // ==========================================================================
  if (avatar.headsetMic) {
    const earRightX = m.headW - 0.5 - yawX * 0.42;
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(earRightX + 2, -2);
    ctx.quadraticCurveTo(earRightX - 2, 29 * m.headScale + chinDrop * 0.25, 22 * m.headScale + yawX * 0.5, 34 * m.headScale + chinDrop * 0.3);
    ctx.stroke();

    // Earpiece & glowing mic capsule
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.ellipse(earRightX + 2.5, -2, 4.2, 8.5, 0, 0, Math.PI * 2);
    ctx.fill();

    const micX = 21 * m.headScale + yawX * 0.5;
    const micY = 34 * m.headScale + chinDrop * 0.3;
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.ellipse(micX, micY, 4.2, 2.8, -0.15, 0, Math.PI * 2);
    ctx.fill();

    if (anim.energy > 0.06) {
      ctx.fillStyle = rgbStr(outAccRgb, Math.min(0.95, 0.35 + anim.energy * 0.8));
      ctx.beginPath();
      ctx.arc(micX - 1.5, micY, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Subtle acoustic soundwave arcs near mouth when speaking (optional)
  if (options.showVoiceWaves && anim.energy > 0.08) {
    for (let k = 0; k < 2; k++) {
      const u = (anim.wavePhase + k * 0.5) % 1;
      const r = 30 * m.headScale + u * 24;
      const alpha = (1 - u) * Math.min(0.42, anim.energy * 0.48);
      ctx.strokeStyle = rgbStr(outAccRgb, alpha);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(yawX * 0.65, 31 * m.headScale + chinDrop * 0.3, r, -0.42, 0.42);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(yawX * 0.65, 31 * m.headScale + chinDrop * 0.3, r, Math.PI - 0.42, Math.PI + 0.42);
      ctx.stroke();
    }
  }

  ctx.restore(); // end head group
  ctx.restore(); // end stage clip & scale

  // ==========================================================================
  // 4. Optional Direct On-Canvas Body & Face Sculpt Handles Overlay
  // ==========================================================================
  if (options.showSculptHandles) {
    const handles = getSculptHandles(w, h, avatar);
    const activeId = options.activeSculptId || "";
    const hoverId = options.hoverSculptId || "";

    const uiSc = Math.max(1, Math.min(w, h) / 340);
    ctx.save();
    for (const pt of handles) {
      const isHot = pt.id === activeId || pt.id === hoverId;
      const r = (isHot ? 9.5 : 7.0) * uiSc;

      // Guide dash between mirrored pair
      if (pt.mirrorX !== undefined) {
        ctx.save();
        ctx.setLineDash([3 * uiSc, 4 * uiSc]);
        ctx.strokeStyle = isHot ? "rgba(56, 189, 248, 0.55)" : "rgba(255, 255, 255, 0.16)";
        ctx.lineWidth = 1.1 * uiSc;
        ctx.beginPath();
        ctx.moveTo(pt.mirrorX, pt.y);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();
        ctx.restore();

        // Mirror node
        ctx.beginPath();
        ctx.arc(pt.mirrorX, pt.y, r * 0.85, 0, Math.PI * 2);
        ctx.fillStyle = isHot ? "#38bdf8" : "rgba(15, 23, 42, 0.72)";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.7 * uiSc;
        ctx.stroke();
      }

      // Primary draggable node
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, r + 4.5 * uiSc, 0, Math.PI * 2);
      ctx.fillStyle = isHot ? "rgba(56, 189, 248, 0.28)" : "rgba(56, 189, 248, 0.14)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
      ctx.fillStyle = isHot ? "#38bdf8" : "#0ea5e9";
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2 * uiSc;
      ctx.stroke();

      if (isHot) {
        ctx.font = `600 ${Math.round(11.5 * uiSc)}px system-ui, -apple-system, sans-serif`;
        const tw = ctx.measureText(pt.label).width + 16 * uiSc;
        const th = 22 * uiSc;
        const lx = clamp(pt.x - tw * 0.5, 6 * uiSc, w - tw - 6 * uiSc);
        const ly = pt.y > 44 * uiSc ? pt.y - 32 * uiSc : pt.y + 16 * uiSc;
        ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
        ctx.beginPath();
        ctx.roundRect(lx, ly, tw, th, 6 * uiSc);
        ctx.fill();
        ctx.strokeStyle = "rgba(56, 189, 248, 0.65)";
        ctx.lineWidth = 1 * uiSc;
        ctx.stroke();
        ctx.fillStyle = "#f8fafc";
        ctx.fillText(pt.label, lx + 8 * uiSc, ly + th * 0.68);
      }
    }
    ctx.restore();
  }
}
