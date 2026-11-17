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
  { id: "long_straight", label: "Long & Straight" },
  { id: "ponytail", label: "Ponytail" },
  { id: "afro", label: "Afro" },
  { id: "braids", label: "Twin Braids" },
  { id: "pigtails", label: "Pigtails" },
  { id: "space_buns", label: "Space Buns" },
  { id: "mohawk", label: "Mohawk" },
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
  { id: "polo", label: "Polo Shirt" },
  { id: "scoop", label: "Scoop-Neck Top" },
  { id: "apron", label: "Barista Apron" },
  { id: "tee", label: "Graphic Tee" },
  { id: "shirt", label: "Button-Up Shirt" },
  { id: "cardigan", label: "Cozy Cardigan" },
  { id: "jacket", label: "Zip Jacket" },
  { id: "cyber", label: "Android Chassis" },
];

export const GLASSES_STYLES = [
  { id: "none", label: "None" },
  { id: "classic", label: "Studio Frames" },
  { id: "round", label: "Round Wire" },
  { id: "bold", label: "Bold Horn-Rim" },
  { id: "cat_eye", label: "Cat-Eye" },
  { id: "aviator", label: "Aviators" },
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

export const EARRING_STYLES = [
  { id: "none", label: "None" },
  { id: "studs", label: "Studs" },
  { id: "hoops", label: "Hoops" },
  { id: "drops", label: "Drops" },
];

export const HEADWEAR_STYLES = [
  { id: "none", label: "None" },
  { id: "beanie", label: "Beanie" },
  { id: "cap", label: "Cap" },
  { id: "headband", label: "Headband" },
  { id: "beret", label: "Beret" },
  { id: "headphones", label: "Headphones" },
  { id: "headscarf", label: "Headscarf" },
  { id: "bow", label: "Hair Bow" },
  { id: "flower", label: "Flower" },
  { id: "tiara", label: "Tiara" },
  { id: "fedora", label: "Fedora" },
  { id: "chef", label: "Chef's Hat" },
];

export const NECKWEAR_STYLES = [
  { id: "none", label: "None" },
  { id: "necklace", label: "Pendant Necklace" },
  { id: "bowtie", label: "Bow Tie" },
  { id: "scarf", label: "Scarf" },
  { id: "lanyard", label: "Lanyard & ID Badge" },
];

export const BROOCH_STYLES = [
  { id: "none", label: "None" },
  { id: "round", label: "Round Pin" },
  { id: "star", label: "Star" },
  { id: "heart", label: "Heart" },
  { id: "flower", label: "Flower" },
];

/** Gestures and expressions that can be triggered directly or written inline as `[wave]`, `[wink]`, ... */
export const AVATAR_ACTIONS = [
  { id: "wave", label: "Wave" },
  { id: "smile", label: "Smile" },
  { id: "wink", label: "Wink" },
  { id: "nod", label: "Nod" },
  { id: "shake", label: "Shake head" },
  { id: "laugh", label: "Laugh" },
  { id: "think", label: "Think" },
  { id: "surprised", label: "Surprised" },
  { id: "shrug", label: "Shrug" },
  { id: "thumbsup", label: "Thumbs up" },
  { id: "tilt", label: "Tilt head" },
  { id: "bow", label: "Bow" },
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

  // Resting expression: the face the character wears when nothing else is happening
  restSmile: 0.0, // -0.4 (reserved) .. 1 (beaming)
  browMood: 0.0, // -1 (stern) .. +1 (soft)
  eyeOpen: 0.0, // -0.5 (sleepy) .. +0.5 (wide awake)

  // Skin details, make-up and accessories
  freckles: 0.0, // 0 .. 1
  eyeshadow: 0.0, // 0 .. 1
  eyeshadowColor: "#7a5c8f",
  browColor: "", // "" = follow the hair colour
  earrings: "none", // "none" | "studs" | "hoops" | "drops"
  earringColor: "#e6c35c",
  headwear: "none", // "none" | "beanie" | "cap" | "headband" | "beret" | "headphones" | "headscarf"
  headwearColor: "#b4452f",
  neckwear: "none", // "none" | "necklace" | "bowtie" | "scarf" | "lanyard"
  neckwearColor: "#d9a441",
  fringe: false, // straight bangs across the forehead
  ageLines: 0.0, // 0 .. 1 (laugh lines, crow's feet, forehead lines)
  beautyMark: false,
  dimples: 0.0, // 0 .. 1
  eyeliner: 0.0, // 0 .. 1 (a winged line at the outer corner of each eye)
  noseStud: false, // a small stud in the earring metal
  irisColor2: "", // "" = both eyes the same; otherwise the colour of the second eye
  brooch: "none", // "none" | "round" | "star" | "heart" | "flower"
  broochColor: "#e6c35c",
};

export const AVATAR_PRESETS = [
  {
    id: "aria",
    persona: "friendly",
    name: "Aria",
    role: "Website Concierge",
    tagline: "Classic SitePal hostess with headset & warm soprano voice",
    voicePreset: "arctic_slt",
    voiceOverrides: { gender: "female", pitchHz: 192, speed: 1.05, expressiveness: 1.08, warmth: 0.66 },
    greeting: "[cheerful] Hi! [wave] Welcome to our website! I'm Aria, your virtual companion. Click below to ask me any question! [wink]",
    avatar: { ...DEFAULT_AVATAR, earrings: "studs", restSmile: 0.25 },
  },
  {
    id: "marcus",
    persona: "professional",
    name: "Marcus",
    role: "Executive Advisor",
    tagline: "Broad-shouldered tailored suit & confident baritone",
    voicePreset: "arctic_bdl",
    voiceOverrides: { gender: "male", pitchHz: 112, speed: 1.04, expressiveness: 1.0, warmth: 0.62 },
    greeting: "Hello and welcome! [nod] I'm Marcus. I can walk you through our plans, features, or technical documentation anytime.",
    avatar: {
      ...DEFAULT_AVATAR,
      browMood: -0.2,
      restSmile: 0.15,
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
    persona: "bubbly",
    name: "Chloe",
    role: "Product Support",
    tagline: "Friendly studio sweater, round frames & lively voice",
    voicePreset: "bright",
    voiceOverrides: { gender: "female", pitchHz: 214, speed: 1.08, expressiveness: 1.18, warmth: 0.72 },
    greeting: "[happy] Hey there! [wave] Need a quick hand finding something? Just type a question and I'll answer right away! [smile]",
    avatar: {
      ...DEFAULT_AVATAR,
      freckles: 0.55,
      restSmile: 0.35,
      browMood: 0.3,
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
    persona: "calm",
    name: "Viktor",
    role: "Solutions Architect",
    tagline: "Minimalist turtleneck, sculpted beard & resonant voice",
    voicePreset: "arctic_rms",
    voiceOverrides: { gender: "male", pitchHz: 94, speed: 1.0, expressiveness: 0.96, chestResonance: 0.75 },
    greeting: "[calm] Greetings. I'm Viktor. Ask me how our self-contained WebAssembly architecture runs with zero cloud servers.",
    avatar: {
      ...DEFAULT_AVATAR,
      browMood: -0.45,
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
    persona: "witty",
    name: "Nova-7",
    role: "Cybernetic Companion",
    tagline: "Synth-porcelain android chassis, holo visor & crisp vocal tract",
    voicePreset: "female",
    voiceOverrides: { gender: "female", pitchHz: 202, tractLengthCm: 14.1, crispness: 1.28, expressiveness: 0.92 },
    greeting: "Systems online! [tilt] I am Nova Seven, running 100 percent locally inside your browser via WebAssembly.",
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
    persona: "curious",
    name: "Prof. Arthur",
    role: "Knowledge Curator",
    tagline: "Distinguished scholar with classic mustache & warm timbre",
    voicePreset: "deep",
    voiceOverrides: { gender: "male", pitchHz: 90, speed: 0.95, warmth: 0.82, expressiveness: 1.05 },
    greeting: "[warmth=0.85] Good day! [bow] I am Professor Arthur. Feel free to inquire about any topic in my AIML knowledge base.",
    avatar: {
      ...DEFAULT_AVATAR,
      restSmile: 0.2,
      browMood: 0.25,
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
    mood: "",
    idleLife: true, // small unprompted movements while nothing else is happening
    nextIdleMs: 0,
    x: Object.fromEntries(EXPRESSION_CHANNELS.map((ch) => [ch, 0])),
  };
}

// Every expression is a set of targets for the face and body channels below. Unsigned channels
// run 0..1; browIn (-1 stern .. +1 worried), eyeWide (-1 squint .. +1 wide) and tilt are signed.
const EXPRESSION_CHANNELS = [
  "smile", "frown", "browUp", "browIn", "eyeWide", "mouthO", "wink",
  "nod", "shake", "tilt", "bow", "bounce", "shrug", "think", "laugh", "gazeX", "gazeY", "shut",
];
const SIGNED_CHANNELS = new Set(["browIn", "eyeWide", "tilt", "gazeX", "gazeY"]);

const EXPRESSIONS = {
  smile: { smile: 0.85, browUp: 0.3, eyeWide: -0.12 },
  wave: { smile: 0.75, browUp: 0.3 },
  wink: { smile: 0.7, wink: 1, tilt: 0.3 },
  nod: { nod: 1, smile: 0.3 },
  shake: { shake: 1, browIn: 0.25 },
  laugh: { smile: 1, eyeWide: -0.6, browUp: 0.35, bounce: 1, laugh: 1 },
  think: { think: 1, browIn: -0.3, tilt: -0.7, gazeX: -0.55, gazeY: -0.55 },
  surprised: { browUp: 1, eyeWide: 0.9, mouthO: 0.75 },
  shrug: { shrug: 1, browUp: 0.7, tilt: 0.45, frown: 0.2 },
  tilt: { tilt: 1, smile: 0.3 },
  bow: { bow: 1, smile: 0.3 },
  thumbsup: { smile: 0.8, browUp: 0.35 },
  lookleft: { gazeX: -0.95 },
  lookright: { gazeX: 0.95 },
  lookup: { gazeY: -0.85, browUp: 0.3 },
  lookdown: { gazeY: 0.85 },
  // Faces for the sounds the voice makes (tts.wasm 1.1). The mouth follows the sound itself; these
  // add the eyes, brows, head and shoulders. With no audio, "mouthO" and "laugh" move the mouth too.
  chuckle: { smile: 0.8, eyeWide: -0.35, browUp: 0.2, bounce: 0.45, laugh: 0.5 },
  giggle: { smile: 0.9, eyeWide: -0.5, tilt: 0.35, bounce: 0.7, laugh: 0.6 },
  guffaw: { smile: 1, shut: 0.7, browUp: 0.5, bounce: 1, laugh: 1 },
  nervous: { smile: 0.4, browIn: 0.7, gazeX: 0.5, bounce: 0.3, laugh: 0.4 },
  evil: { smile: 0.75, browIn: -0.95, eyeWide: -0.3, bounce: 0.45, laugh: 0.7, tilt: -0.3 },
  sigh: { browIn: 0.5, eyeWide: -0.35, bow: 0.3, frown: 0.2 },
  yawn: { shut: 0.85, browUp: 0.55, tilt: 0.3, mouthO: 0.9 },
  sniff: { browIn: 0.6, frown: 0.3, eyeWide: -0.2 },
  pant: { bounce: 0.6, mouthO: 0.35, browIn: 0.3 },
  phew: { browUp: 0.6, smile: 0.4, eyeWide: -0.25 },
  worried: { browIn: 0.85, eyeWide: 0.6, mouthO: 0.35 },
  puzzled: { browUp: 0.7, tilt: 0.55, browIn: 0.3 },
  aha: { browUp: 0.8, smile: 0.7, eyeWide: 0.3 },
  ooh: { browUp: 0.7, mouthO: 0.6, eyeWide: 0.4 },
  aww: { smile: 0.7, browIn: 0.6, tilt: 0.5, eyeWide: -0.2 },
  relief: { smile: 0.5, eyeWide: -0.45, browUp: 0.2 },
  disgust: { browIn: -0.6, frown: 0.75, eyeWide: -0.45, tilt: -0.3 },
  hum: { smile: 0.4, eyeWide: -0.35, tilt: 0.35 },
  groan: { frown: 0.6, browIn: 0.5, eyeWide: -0.55, tilt: -0.3 },
  scream: { browUp: 1, eyeWide: 1, mouthO: 1 },
  cry: { browIn: 0.95, frown: 0.9, shut: 0.55, bow: 0.25 },
  shush: { browUp: 0.35, eyeWide: 0.25, mouthO: 0.5 },
  psst: { gazeX: -0.6, tilt: -0.35, browUp: 0.35 },
  tsk: { shake: 0.55, browIn: -0.45 },
  kiss: { mouthO: 0.85, shut: 0.6, smile: 0.2 },
  shiver: { bounce: 0.85, browIn: 0.5, shrug: 0.7 },
  angry: { browIn: -1, frown: 0.5, eyeWide: -0.3 },
  raspberry: { shut: 0.5, mouthO: 0.4, tilt: 0.3 },
  whistle: { mouthO: 0.7, browUp: 0.45 },
  cough: { bow: 0.35, shut: 0.6, bounce: 0.3 },
  hiccup: { bounce: 0.9, browUp: 0.6, eyeWide: 0.45 },
  sneeze: { shut: 1, bow: 0.55, browIn: 0.4 },
  sleep: { shut: 1, tilt: 0.5, bow: 0.2 },
  // Small unprompted movements while idle (never written in text)
  idle_tilt_left: { tilt: -0.42 },
  idle_tilt_right: { tilt: 0.42, smile: 0.2 },
  idle_smile: { smile: 0.5, browUp: 0.15 },
  idle_brows: { browUp: 0.55 },
  idle_glance_left: { gazeX: -0.6, gazeY: -0.1 },
  idle_glance_right: { gazeX: 0.6, gazeY: -0.1 },
  // Moods (also usable as actions)
  happy: { smile: 0.7, browUp: 0.22 },
  excited: { smile: 0.9, browUp: 0.65, eyeWide: 0.3 },
  calm: { smile: 0.22, eyeWide: -0.1 },
  sad: { browIn: 0.9, frown: 0.85, eyeWide: -0.2, bow: 0.15, gazeY: 0.3 },
  serious: { browIn: -0.75, eyeWide: -0.12 },
};

const EMOTE_ALIASES = {
  happy: "smile", grin: "smile", yes: "nod", no: "shake",
  // sounds whose face is shared with another sound or gesture
  cackle: "laugh", hoho: "laugh", snicker: "chuckle", hehe: "giggle", gasp: "surprised",
  hmm: "think", um: "think", uh: "think", mm: "relief", ahh: "relief", mhm: "nod", "uh-huh": "nod", "uh-uh": "shake",
  "uh-oh": "worried", huh: "puzzled", oh: "ooh", ugh: "disgust", eww: "disgust", sob: "cry", whimper: "cry",
  shh: "shush", brr: "shiver", grr: "angry", fweet: "whistle", ahem: "cough", snore: "sleep",
};

const EMOTE_DURATIONS_MS = {
  wave: 2200, smile: 1900, wink: 750, nod: 1000, shake: 1150, laugh: 1700, think: 2000,
  surprised: 1500, shrug: 1500, tilt: 1500, bow: 1300, thumbsup: 1900,
  lookleft: 1300, lookright: 1300, lookup: 1300, lookdown: 1300,
  sad: 2400, serious: 2000, excited: 1800, calm: 1800,
};

const IDLE_GESTURES = [
  ["idle_tilt_left", 1500], ["idle_tilt_right", 1500], ["idle_smile", 1700],
  ["idle_brows", 800], ["idle_glance_left", 1100], ["idle_glance_right", 1100],
];

/** True when `name` is a gesture or expression the avatar can perform. */
export function isAvatarAction(name) {
  const key = EMOTE_ALIASES[name] || name;
  if (key.startsWith("idle_")) return false;
  return key === "blink" || Object.prototype.hasOwnProperty.call(EXPRESSIONS, key);
}

/**
 * Plays a gesture or expression. `durationMs` is optional: each action has a natural length
 * (a wink is brief, a wave lasts a couple of seconds).
 */
export function triggerAvatarEmote(anim, emoteName, durationMs, nowMs = performance.now()) {
  if (!anim || !emoteName) return;
  const raw = String(emoteName).toLowerCase();
  const name = EMOTE_ALIASES[raw] || raw;
  if (name === "blink") {
    anim.blinkStartMs = nowMs;
    return;
  }
  if (!Object.prototype.hasOwnProperty.call(EXPRESSIONS, name)) return;
  anim.emote = name;
  anim.emoteUntilMs = nowMs + (durationMs > 0 ? durationMs : EMOTE_DURATIONS_MS[name] || 1800);
}

/** Sets the lasting facial mood ("happy", "excited", "calm", "sad", "serious") or clears it with "". */
export function setAvatarMood(anim, mood) {
  if (!anim) return;
  const name = String(mood || "").toLowerCase();
  anim.mood = Object.prototype.hasOwnProperty.call(EXPRESSIONS, name) ? name : "";
}

// ============================================================================
// Speech cues: fire inline actions and moods at the right moment of a spoken line
// ============================================================================

/**
 * Turns cues from `parseSpeechCues` into a timeline against a synthesized `speech`.
 * A cue placed after N words fires as word N+1 begins; when the synthesizer's word count
 * differs from ours (it expands numbers), positions are mapped proportionally.
 */
export function buildCueTimeline(speech, cues, cueWords = 0) {
  const words = speech?.words || [];
  const n = words.length;
  const duration = speech?.duration || 0;
  const items = (cues || []).map((cue) => {
    let idx = cue.word || 0;
    if (cueWords > 0 && n > 0 && cueWords !== n) idx = Math.round((idx / cueWords) * n);
    let t = 0;
    if (n > 0 && idx > 0) t = idx >= n ? Math.max(0, duration - 0.3) : Math.max(0, words[idx].start - 0.08);
    // A sound the voice performs ("[laugh]") has its own timed entry: the face holds for as long as it lasts.
    const own = cue.sound && idx < n ? words[idx] : null;
    if (own && String(own.word).startsWith("[")) {
      return { ...cue, t: Math.max(0, own.start - 0.04), ms: Math.max(350, (own.end - own.start) * 1000 + 120) };
    }
    return { ...cue, t };
  });
  items.sort((a, b) => a.t - b.t);
  return { items, next: 0 };
}

/** A timeline for when there is no audio (muted or text-only): cues are paced at reading speed. */
export function estimateCueTimeline(cues, secondsPerWord = 0.34) {
  const items = (cues || []).map((cue) => ({ ...cue, t: (cue.word || 0) * secondsPerWord }));
  items.sort((a, b) => a.t - b.t);
  return { items, next: 0 };
}

/** Fires every cue whose time has come. Call once per frame with the current speech time. */
export function runDueCues(anim, timeline, tSec, nowMs = performance.now()) {
  if (!timeline) return;
  while (timeline.next < timeline.items.length && timeline.items[timeline.next].t <= tSec) {
    const cue = timeline.items[timeline.next++];
    if (cue.type === "mood") setAvatarMood(anim, cue.name);
    else triggerAvatarEmote(anim, cue.name, cue.ms, nowMs);
  }
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

  // Idle life: every so often, when nothing else is going on, a small movement of its own
  // (a head tilt, a glance, a passing smile). Set `anim.idleLife = false` to keep it still.
  if (anim.idleLife !== false) {
    if (sampledSpeech || (anim.emote && !anim.emote.startsWith("idle_")) || !anim.nextIdleMs) {
      anim.nextIdleMs = nowMs + 5000 + Math.random() * 7000;
    } else if (!anim.emote && nowMs >= anim.nextIdleMs) {
      const [gesture, ms] = IDLE_GESTURES[Math.floor(Math.random() * IDLE_GESTURES.length)];
      anim.emote = gesture;
      anim.emoteUntilMs = nowMs + ms;
      anim.nextIdleMs = nowMs + ms + 6000 + Math.random() * 9000;
    }
  } else {
    anim.nextIdleMs = 0; // the wait starts afresh when idle life is switched back on
    if (anim.emote.startsWith("idle_")) anim.emote = "";
  }

  // Ease every expression channel toward what the current gesture and mood ask for.
  // A gesture wins on the channels it defines; the mood fills in the rest at lower strength.
  const emoteDef = anim.emote ? EXPRESSIONS[anim.emote] : null;
  const moodDef = anim.mood ? EXPRESSIONS[anim.mood] : null;
  const x = anim.x;
  const kX = 1 - Math.exp(-dt * 13);
  for (const ch of EXPRESSION_CHANNELS) {
    let target = 0;
    if (emoteDef && emoteDef[ch] !== undefined) target = emoteDef[ch];
    else if (moodDef && moodDef[ch] !== undefined) target = moodDef[ch] * 0.7;
    x[ch] += (target - x[ch]) * kX;
    if (!SIGNED_CHANNELS.has(ch) && x[ch] < 0.0005) x[ch] = 0;
  }

  const idleBreath = 0.5 + 0.5 * Math.sin(nowMs * 0.0019);
  const emoteSmile = 0.09 + x.smile * 0.3;
  // A silent laugh opens the mouth in little bursts; surprise rounds it into an "oh".
  const laughJaw = x.laugh * (0.2 + 0.14 * Math.abs(Math.sin(nowMs * 0.019)));

  const goal = sampledSpeech || {
    jaw: 0.038 + 0.012 * idleBreath + x.mouthO * 0.3 + laughJaw,
    tH: 0.46,
    tF: 0.50,
    tTip: 0.16,
    lipR: 0.03 + x.mouthO * 0.5,
    lipS: emoteSmile,
    lipC: 0.22 * (1 - Math.max(x.mouthO, x.laugh)),
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
  anim.lipS += (Math.max(goal.lipS, x.smile * 0.3) - anim.lipS) * kFast;
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
  if (pointer && pointer.active) {
    targetLookX = clamp(pointer.nx, -1, 1) * 0.92 + anim.saccadeX * 0.22;
    targetLookY = clamp(pointer.ny, -1, 1) * 0.85 + anim.saccadeY * 0.22;
  }
  // Gestures that move the eyes (thinking, looking around, a downcast sad glance) override the pointer.
  const gazePull = Math.min(1, Math.abs(x.gazeX) + Math.abs(x.gazeY));
  if (gazePull > 0.02) {
    targetLookX += (x.gazeX - targetLookX) * gazePull;
    targetLookY += (x.gazeY - targetLookY) * gazePull;
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

  handles.push(
    {
      id: "brow",
      label: "Brow Arch & Thickness",
      ...toScreen(-(21.5 * (avatar.eyeSpacing ?? 1) * m.headScale + 6), -(27 + (avatar.browArch ?? 0.2) * 9) * m.headScale),
      axis: "xy",
      apply(dx, dy, cur) {
        return {
          browArch: clamp((cur.browArch ?? 0.2) - (dy / scale) * 0.03, -0.2, 0.55),
          browThickness: clamp((cur.browThickness ?? 1) - (dx / scale) * 0.03, 0.5, 1.6),
        };
      },
    },
    {
      id: "nose",
      label: "Nose Length & Width",
      ...toScreen(-9.5 * (avatar.noseWidth ?? 1) * m.headScale, 10.2 * (avatar.noseLength ?? 1) * m.headScale),
      axis: "xy",
      apply(dx, dy, cur) {
        return {
          noseWidth: clamp((cur.noseWidth ?? 1) - (dx / scale) * 0.03, 0.74, 1.32),
          noseLength: clamp((cur.noseLength ?? 1) + (dy / scale) * 0.03, 0.78, 1.26),
        };
      },
    }
  );

  if (avatar.framing !== "bust") {
    handles.push(
      {
        id: "hips",
        label: "Hip Width",
        ...toScreen(m.hipHalfW, m.shoulderY + m.torsoLen * 1.06),
        axis: "x",
        mirrorX: cx - m.hipHalfW * scale,
        apply(dx, _dy, cur) {
          return { hipWidth: clamp((cur.hipWidth ?? 1) + (dx / scale) * 0.013, 0.7, 1.38) };
        },
      },
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

// Fixed freckle positions [x, y, radius] in head units, densest across the nose bridge and upper cheeks.
const FRECKLE_POINTS = [
  [-4, 1.5, 0.7], [5, 2.5, 0.65], [-9, 3.5, 0.75], [10, 4, 0.7], [0.5, 4.5, 0.6],
  [-15, 4.5, 0.8], [16, 5.5, 0.75], [-20, 6.5, 0.7], [21, 7, 0.7], [-12, 8, 0.65],
  [13, 9, 0.7], [-25, 9.5, 0.75], [26, 10, 0.7], [-18, 11, 0.6], [19, 11.5, 0.65],
  [-6, 6.5, 0.55], [7, 7.5, 0.6], [-23, 13, 0.6], [24, 13.5, 0.6], [-29, 8, 0.6],
  [30, 8.5, 0.6], [-14, 13.5, 0.55], [15, 14, 0.55], [-2, 0, 0.55], [2.5, 8.5, 0.5],
  [-27, 5, 0.55], [28, 5.5, 0.55], [-10, 11.5, 0.5], [11, 12.5, 0.5], [-21, 3, 0.55],
];

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
    case "violet_haze":
      topCol = "#2a2146";
      botCol = "#120e22";
      glowCol = "rgba(167, 139, 250, 0.26)";
      break;
    case "mint_fresh":
      topCol = "#e2f4ec";
      botCol = "#bfe3d3";
      glowCol = "rgba(16, 185, 129, 0.18)";
      break;
    case "graphite":
      topCol = "#3a3f4a";
      botCol = "#1c1f26";
      glowCol = "rgba(226, 232, 240, 0.16)";
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
  if (avatar.headwear === "headscarf") avatar.hairStyle = "none"; // the scarf covers the hair completely
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
  const x = anim.x || {};
  const xv = (ch) => x[ch] || 0;
  const emoteNod =
    xv("nod") * Math.sin(timeSec * 11) * 3.8 +
    xv("bow") * 7.5 -
    xv("bounce") * Math.abs(Math.sin(timeSec * 15)) * 2.4;
  const nodY = anim.energy * 2.5 - anim.pitchSt * 0.52 + Math.sin(timeSec * 1.4) * 0.75 + emoteNod;
  const headTilt =
    Math.sin(timeSec * 0.82) * 0.015 +
    anim.pitchSt * 0.006 * Math.cos(timeSec * 1.8) +
    anim.lookX * 0.032 +
    xv("tilt") * 0.095;

  // Resting expression from the designer, layered under whatever gesture or mood is playing.
  const restSmile = clamp(avatar.restSmile ?? 0, -0.4, 1);
  const smileX = clamp(xv("smile") + restSmile * 0.75, -0.4, 1.2);
  const browIn = clamp(xv("browIn") - clamp(avatar.browMood ?? 0, -1, 1) * 0.55, -1.2, 1.2);
  const eyeWide = clamp(xv("eyeWide") + clamp(avatar.eyeOpen ?? 0, -0.5, 0.5), -0.8, 1);

  const yawX = anim.lookX * 5.2 + xv("shake") * Math.sin(timeSec * 13) * 7;

  // A beanie or cap covers the top of the head, so hair above its edge must not be drawn.
  const headwear = avatar.headwear || "none";
  const hatOn = headwear === "beanie" || headwear === "cap" || headwear === "beret" || headwear === "fedora" || headwear === "chef";
  const hatLine = -m.headH * 0.56 - 5;
  const clipBelowHat = () => {
    if (!hatOn) return;
    ctx.beginPath();
    ctx.rect(-400, hatLine, 800, 1200);
    ctx.clip();
  };
  const pitchY = anim.lookY * 3.0;
  const chinDrop = anim.jaw * 14.2 * (1 - anim.lipC * 0.55) * m.headScale;
  const chinY = m.chinBaseY + chinDrop;

  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // ==========================================================================
  // 1. Back Hair Silhouette (drawn BEHIND neck & shoulders — zero throat seam!)
  // ==========================================================================
  if (headwear === "headscarf") {
    // The scarf's drape behind the neck and over the shoulders
    const scarfRgb = parseHex(avatar.headwearColor, [180, 69, 47]);
    ctx.save();
    ctx.translate(-yawX * 0.42, nodY * 0.65);
    ctx.rotate(headTilt * 0.55);
    const drapeGrad = ctx.createLinearGradient(0, -m.headH, 0, m.shoulderY + 30);
    drapeGrad.addColorStop(0, rgbStr(shadeRgb(scarfRgb, 0.95)));
    drapeGrad.addColorStop(1, rgbStr(shadeRgb(scarfRgb, 0.62)));
    ctx.fillStyle = drapeGrad;
    ctx.beginPath();
    ctx.moveTo(-m.headW - 9, -14);
    ctx.bezierCurveTo(-m.headW - 15, -m.headH * 1.36 - 16, m.headW + 15, -m.headH * 1.36 - 16, m.headW + 9, -14);
    ctx.bezierCurveTo(m.headW + 16, 30, m.shoulderHalfW * 0.74, m.shoulderY + 2, m.shoulderHalfW * 0.82, m.shoulderY + 22);
    ctx.lineTo(-m.shoulderHalfW * 0.82, m.shoulderY + 22);
    ctx.bezierCurveTo(-m.shoulderHalfW * 0.74, m.shoulderY + 2, -m.headW - 16, 30, -m.headW - 9, -14);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  const isHalo = avatar.hairStyle === "curly_halo" || avatar.hairStyle === "afro";
  if (avatar.hairStyle === "ponytail") {
    // A tail gathered at the back of the crown, falling over one shoulder behind the neck.
    ctx.save();
    ctx.translate(-yawX * 0.42, nodY * 0.65);
    ctx.rotate(headTilt * 0.55);
    clipBelowHat();
    const sway = Math.sin(timeSec * 1.6) * 1.6 + xv("shake") * Math.sin(timeSec * 13 - 0.6) * 5;
    const tailTop = -m.headH * 0.58;
    const tailEnd = m.shoulderY + 34;
    const tailGrad = ctx.createLinearGradient(0, tailTop, 0, tailEnd);
    tailGrad.addColorStop(0, rgbStr(shadeRgb(hairRgb, 0.95)));
    tailGrad.addColorStop(1, rgbStr(shadeRgb(hairRgb, 0.55)));
    ctx.fillStyle = tailGrad;
    ctx.beginPath();
    ctx.moveTo(m.headW * 0.35, tailTop);
    ctx.bezierCurveTo(m.headW + 26, tailTop - 4, m.headW + 30 + sway, 18, m.headW + 20 + sway, tailEnd - 20);
    ctx.quadraticCurveTo(m.headW + 14 + sway, tailEnd + 4, m.headW + 6 + sway, tailEnd);
    ctx.bezierCurveTo(m.headW + 12 + sway * 0.6, 26, m.headW + 6, -6, m.headW * 0.2, tailTop + 14);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  if (avatar.hairStyle === "pigtails") {
    // Two bunches tied at the sides, falling behind the shoulders.
    ctx.save();
    ctx.translate(-yawX * 0.42, nodY * 0.65);
    ctx.rotate(headTilt * 0.55);
    clipBelowHat();
    const sway = Math.sin(timeSec * 1.6) * 1.4 + xv("shake") * Math.sin(timeSec * 13 - 0.6) * 4;
    const tieY = 4;
    const endY = m.shoulderY + 30;
    for (const dir of [-1, 1]) {
      const x0 = dir * (m.headW - 3);
      const tailGrad = ctx.createLinearGradient(0, tieY - 10, 0, endY);
      tailGrad.addColorStop(0, rgbStr(shadeRgb(hairRgb, 1.02)));
      tailGrad.addColorStop(1, rgbStr(shadeRgb(hairRgb, 0.58)));
      ctx.fillStyle = tailGrad;
      ctx.beginPath();
      ctx.moveTo(x0, tieY - 12);
      ctx.bezierCurveTo(x0 + dir * 34, tieY - 12, x0 + dir * 40 + sway, endY - 36, x0 + dir * 24 + sway, endY - 6);
      ctx.quadraticCurveTo(x0 + dir * 15 + sway, endY + 7, x0 + dir * 6 + sway, endY - 8);
      ctx.bezierCurveTo(x0 + dir * 12, endY - 40, x0 + dir * 5, tieY + 24, x0 - dir * 3, tieY + 10);
      ctx.closePath();
      ctx.fill();
      // the tie that gathers each bunch
      ctx.fillStyle = rgbStr(outAccRgb);
      ctx.beginPath();
      ctx.ellipse(x0 + dir * 12.5, tieY + 3, 4.4, 7, dir * 0.45, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  if (avatar.hairStyle === "long_waves" || avatar.hairStyle === "shoulder_lob" || avatar.hairStyle === "sleek_bob" || avatar.hairStyle === "long_straight" || avatar.hairStyle === "braids" || isHalo) {
    ctx.save();
    ctx.translate(-yawX * 0.42, nodY * 0.65);
    ctx.rotate(headTilt * 0.55);
    clipBelowHat();
    const backLen =
      avatar.hairStyle === "braids" ? 36 :
      avatar.hairStyle === "long_straight" ? m.shoulderY + 66 :
      avatar.hairStyle === "long_waves" ? m.shoulderY + 46 :
      avatar.hairStyle === "shoulder_lob" ? m.shoulderY + 18 :
      isHalo ? 42 : 48;
    const flare =
      avatar.hairStyle === "afro" ? 38 :
      avatar.hairStyle === "curly_halo" ? 24 :
      avatar.hairStyle === "long_waves" ? 17 :
      avatar.hairStyle === "long_straight" ? 7 : 11;
    const bhGrad = ctx.createLinearGradient(0, -m.headH - 16, 0, backLen);
    bhGrad.addColorStop(0, rgbStr(shadeRgb(hairRgb, 1.05)));
    bhGrad.addColorStop(0.6, rgbStr(shadeRgb(hairRgb, 0.75)));
    bhGrad.addColorStop(1, rgbStr(shadeRgb(hairRgb, 0.48)));
    ctx.fillStyle = bhGrad;
    ctx.beginPath();
    if (isHalo) {
      const lift = avatar.hairStyle === "afro" ? 30 : 16;
      ctx.ellipse(0, avatar.hairStyle === "afro" ? -22 : -14, m.headW + flare, m.headH * 0.92 + lift, 0, 0, Math.PI * 2);
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
  const shEndY = sy + m.shoulderDrop - xv("shrug") * 10;
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

    if (anim.emote === "thumbsup" && dir === 1) {
      // Raised forearm with a closed fist and the thumb up
      const bob = Math.sin(timeSec * 7) * 1.5;
      const tElbowX = shX + 16;
      const tElbowY = shY + 20;
      const fistX = tElbowX + 6;
      const fistY = shY - 24 + bob;

      ctx.beginPath();
      ctx.moveTo(shX - 4, shY + 4);
      ctx.quadraticCurveTo(tElbowX, tElbowY + 8, tElbowX, tElbowY);
      ctx.lineTo(fistX, fistY + 10);
      ctx.stroke();

      ctx.fillStyle = rgbStr(skinLight);
      ctx.beginPath();
      ctx.roundRect(fistX - 4.5, fistY - 19, 8.5, 17, 4.2); // thumb
      ctx.fill();
      ctx.fillStyle = rgbStr(skinMid);
      ctx.beginPath();
      ctx.roundRect(fistX - 10, fistY - 8, 20, 17, 7); // fist
      ctx.fill();
      ctx.strokeStyle = rgbStr(skinDeep, 0.35);
      ctx.lineWidth = 1;
      for (const ky of [-2.5, 1.5, 5.5]) {
        ctx.beginPath();
        ctx.moveTo(fistX - 1, fistY + ky);
        ctx.lineTo(fistX + 9, fistY + ky);
        ctx.stroke();
      }
      ctx.strokeStyle = armGrad;
      ctx.lineWidth = m.armThick * 2;
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

    if (outfit === "suit_tie" && avatar.neckwear !== "bowtie") {
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
  } else if (outfit === "polo") {
    // Open collar with a short buttoned placket
    ctx.fillStyle = rgbStr(skinMid);
    ctx.beginPath();
    ctx.moveTo(-m.neckHalfW + 1, sy - 4);
    ctx.lineTo(0, sy + 18);
    ctx.lineTo(m.neckHalfW - 1, sy - 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = rgbStr(shadeRgb(outPriRgb, 0.86));
    ctx.fillRect(-3.2, sy + 17, 6.4, 24);
    ctx.fillStyle = rgbStr(outSecRgb);
    for (const by of [sy + 23, sy + 33]) {
      ctx.beginPath();
      ctx.arc(0, by, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = rgbStr(shadeRgb(outPriRgb, 1.22));
    ctx.strokeStyle = "rgba(0, 0, 0, 0.16)";
    ctx.lineWidth = 0.9;
    for (const dir of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(dir * (m.neckHalfW + 2), sy - 5);
      ctx.lineTo(dir * (m.neckHalfW + 17), sy + 9);
      ctx.lineTo(dir * 6, sy + 22);
      ctx.lineTo(0, sy + 17);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  } else if (outfit === "scoop") {
    // Wide scoop neckline showing the collarbones, edged with a trim
    const scoopW = m.neckHalfW + 20;
    ctx.fillStyle = rgbStr(skinMid);
    ctx.beginPath();
    ctx.moveTo(-scoopW, sy - 1);
    ctx.quadraticCurveTo(0, sy + 46, scoopW, sy - 1);
    ctx.quadraticCurveTo(0, sy + 9, -scoopW, sy - 1);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = rgbStr(skinDeep, 0.22);
    ctx.lineWidth = 1.1;
    for (const dir of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(dir * 6, sy + 12);
      ctx.quadraticCurveTo(dir * 16, sy + 8.5, dir * (scoopW - 5), sy + 6);
      ctx.stroke();
    }
    ctx.strokeStyle = rgbStr(outSecRgb, 0.9);
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(-scoopW, sy - 1);
    ctx.quadraticCurveTo(0, sy + 46, scoopW, sy - 1);
    ctx.stroke();
  } else if (outfit === "apron") {
    // Crew neckline, then a bib apron with a neck strap and a chest pocket
    ctx.fillStyle = rgbStr(skinMid);
    ctx.beginPath();
    ctx.moveTo(-m.neckHalfW + 1, sy - 4);
    ctx.quadraticCurveTo(0, sy + 12, m.neckHalfW - 1, sy - 4);
    ctx.closePath();
    ctx.fill();
    const bibTop = sy + 26;
    const bibHalf = m.chestHalfW * 0.6;
    ctx.strokeStyle = rgbStr(shadeRgb(outSecRgb, 0.82));
    ctx.lineWidth = 3.2;
    ctx.lineCap = "round";
    for (const dir of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(dir * (m.neckHalfW + 2), sy - 1);
      ctx.lineTo(dir * (bibHalf - 3), bibTop + 2);
      ctx.stroke();
    }
    const bibGrad = ctx.createLinearGradient(0, bibTop, 0, hipY);
    bibGrad.addColorStop(0, rgbStr(outSecRgb));
    bibGrad.addColorStop(1, rgbStr(shadeRgb(outSecRgb, 0.8)));
    ctx.fillStyle = bibGrad;
    ctx.beginPath();
    ctx.moveTo(-bibHalf, bibTop);
    ctx.lineTo(bibHalf, bibTop);
    ctx.quadraticCurveTo(bibHalf + 4, waistY - 10, m.waistHalfW + 1, waistY + 2);
    ctx.lineTo(m.hipHalfW, hipY);
    ctx.lineTo(-m.hipHalfW, hipY);
    ctx.lineTo(-m.waistHalfW - 1, waistY + 2);
    ctx.quadraticCurveTo(-bibHalf - 4, waistY - 10, -bibHalf, bibTop);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = rgbStr(shadeRgb(outSecRgb, 0.66), 0.8);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(-13, bibTop + 14, 26, 17, 3);
    ctx.stroke();
    ctx.fillStyle = rgbStr(outAccRgb);
    ctx.beginPath();
    ctx.roundRect(-13, bibTop + 14, 26, 4, 2);
    ctx.fill();
  } else if (outfit === "tee") {
    // Crew-neck T-shirt with a ribbed collar and a round print on the chest
    ctx.fillStyle = rgbStr(skinMid);
    ctx.beginPath();
    ctx.moveTo(-m.neckHalfW + 1, sy - 4);
    ctx.quadraticCurveTo(0, sy + 15, m.neckHalfW - 1, sy - 4);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = rgbStr(shadeRgb(outPriRgb, 0.78));
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-m.neckHalfW - 2, sy - 2);
    ctx.quadraticCurveTo(0, sy + 17, m.neckHalfW + 2, sy - 2);
    ctx.stroke();
    ctx.fillStyle = rgbStr(outAccRgb, 0.94);
    ctx.beginPath();
    ctx.arc(0, sy + 50, 10.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = rgbStr(outSecRgb, 0.92);
    ctx.beginPath();
    ctx.arc(0, sy + 50, 4.6, 0, Math.PI * 2);
    ctx.fill();
  } else if (outfit === "shirt") {
    // Open-collar shirt: buttons down the front under two collar points, and a chest pocket
    ctx.fillStyle = rgbStr(skinMid);
    ctx.beginPath();
    ctx.moveTo(-m.neckHalfW + 1, sy - 4);
    ctx.lineTo(0, sy + 20);
    ctx.lineTo(m.neckHalfW - 1, sy - 4);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = rgbStr(shadeRgb(outPriRgb, 0.68), 0.75);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, sy + 20);
    ctx.lineTo(0, hipY);
    ctx.stroke();
    ctx.fillStyle = rgbStr(outSecRgb);
    for (let by = sy + 32; by < hipY - 4; by += 15) {
      ctx.beginPath();
      ctx.arc(0, by, 1.7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = rgbStr(shadeRgb(outPriRgb, 0.68), 0.65);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-m.chestHalfW * 0.66, sy + 40, 15, 16, 2);
    ctx.stroke();
    ctx.fillStyle = rgbStr(shadeRgb(outPriRgb, 1.22));
    ctx.strokeStyle = "rgba(0, 0, 0, 0.18)";
    ctx.lineWidth = 0.9;
    for (const dir of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(dir * (m.neckHalfW + 2), sy - 6);
      ctx.lineTo(dir * (m.neckHalfW + 15), sy + 12);
      ctx.lineTo(dir * 4, sy + 25);
      ctx.lineTo(0, sy + 19);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  } else if (outfit === "cardigan") {
    // An open cardigan over a top: a deep V edged with a ribbed band, and buttons below it
    const vBottom = sy + 62;
    ctx.fillStyle = rgbStr(skinMid);
    ctx.beginPath();
    ctx.moveTo(-m.neckHalfW + 1, sy - 4);
    ctx.quadraticCurveTo(0, sy + 14, m.neckHalfW - 1, sy - 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = rgbStr(outSecRgb);
    ctx.beginPath();
    ctx.moveTo(-m.neckHalfW - 4, sy - 2);
    ctx.lineTo(0, vBottom);
    ctx.lineTo(m.neckHalfW + 4, sy - 2);
    ctx.quadraticCurveTo(0, sy + 15, -m.neckHalfW - 4, sy - 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = rgbStr(shadeRgb(outPriRgb, 1.3));
    ctx.lineWidth = 5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-m.neckHalfW - 5, sy - 3);
    ctx.lineTo(0, vBottom);
    ctx.lineTo(m.neckHalfW + 5, sy - 3);
    ctx.moveTo(0, vBottom);
    ctx.lineTo(0, hipY);
    ctx.stroke();
    ctx.fillStyle = rgbStr(outAccRgb);
    for (let by = vBottom + 13; by < hipY - 4; by += 16) {
      ctx.beginPath();
      ctx.arc(0, by, 2.1, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (outfit === "jacket") {
    // Zip-up jacket: a stand collar, the top underneath showing at the neck, a zip down the middle
    ctx.fillStyle = rgbStr(skinMid);
    ctx.beginPath();
    ctx.moveTo(-m.neckHalfW + 1, sy - 4);
    ctx.quadraticCurveTo(0, sy + 14, m.neckHalfW - 1, sy - 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = rgbStr(outSecRgb);
    ctx.beginPath();
    ctx.moveTo(-m.neckHalfW - 2, sy - 2);
    ctx.lineTo(0, sy + 32);
    ctx.lineTo(m.neckHalfW + 2, sy - 2);
    ctx.quadraticCurveTo(0, sy + 14, -m.neckHalfW - 2, sy - 2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = rgbStr(shadeRgb(outPriRgb, 1.22));
    ctx.strokeStyle = "rgba(0, 0, 0, 0.16)";
    ctx.lineWidth = 0.9;
    for (const dir of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(dir * (m.neckHalfW + 3), sy - 10);
      ctx.quadraticCurveTo(dir * (m.neckHalfW + 16), sy - 2, dir * (m.neckHalfW + 13), sy + 11);
      ctx.lineTo(0, sy + 33);
      ctx.lineTo(dir * (m.neckHalfW - 1), sy + 1);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.strokeStyle = rgbStr(outAccRgb, 0.95);
    ctx.lineWidth = 2;
    ctx.lineCap = "butt";
    ctx.beginPath();
    ctx.moveTo(0, sy + 33);
    ctx.lineTo(0, hipY);
    ctx.stroke();
    ctx.fillStyle = rgbStr(outAccRgb);
    ctx.beginPath();
    ctx.roundRect(-2.8, sy + 31, 5.6, 9.5, 1.8);
    ctx.fill();
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
  if (avatar.nameBadge && outfit !== "cyber" && outfit !== "apron") {
    ctx.fillStyle = rgbStr(outAccRgb);
    ctx.beginPath();
    ctx.roundRect(m.chestHalfW * 0.36, sy + 24, 15, 5.5, 2.5);
    ctx.fill();
  }

  // A brooch on the other side of the chest
  const brooch = avatar.brooch || "none";
  if (brooch !== "none" && outfit !== "cyber") {
    const pinRgb = parseHex(avatar.broochColor, [230, 195, 92]);
    const bx = -m.chestHalfW * 0.4;
    const by = sy + 29;
    ctx.fillStyle = rgbStr(pinRgb);
    ctx.strokeStyle = rgbStr(shadeRgb(pinRgb, 0.62), 0.8);
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    if (brooch === "star") {
      for (let i = 0; i < 10; i++) {
        const r = i % 2 ? 2.9 : 6.6;
        const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
        ctx[i ? "lineTo" : "moveTo"](bx + Math.cos(a) * r, by + Math.sin(a) * r);
      }
      ctx.closePath();
    } else if (brooch === "heart") {
      ctx.moveTo(bx, by + 5.8);
      ctx.bezierCurveTo(bx - 9.5, by - 0.5, bx - 4.4, by - 7.6, bx, by - 2.6);
      ctx.bezierCurveTo(bx + 4.4, by - 7.6, bx + 9.5, by - 0.5, bx, by + 5.8);
    } else if (brooch === "flower") {
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        ctx.moveTo(bx + Math.cos(a) * 3.9 + 3, by + Math.sin(a) * 3.9);
        ctx.arc(bx + Math.cos(a) * 3.9, by + Math.sin(a) * 3.9, 3, 0, Math.PI * 2);
      }
    } else {
      ctx.arc(bx, by, 4.8, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = brooch === "flower" ? rgbStr(shadeRgb(pinRgb, 0.6)) : "rgba(255, 255, 255, 0.55)";
    ctx.beginPath();
    ctx.arc(brooch === "flower" ? bx : bx - 1.4, brooch === "flower" ? by : by - 1.6, brooch === "flower" ? 2.2 : 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Neckwear
  const neckwear = avatar.neckwear || "none";
  if (neckwear !== "none") {
    const nwRgb = parseHex(avatar.neckwearColor, [217, 164, 65]);
    if (neckwear === "necklace") {
      ctx.strokeStyle = rgbStr(nwRgb);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-m.neckHalfW + 1.5, sy - 6);
      ctx.quadraticCurveTo(0, sy + 19, m.neckHalfW - 1.5, sy - 6);
      ctx.stroke();
      ctx.fillStyle = rgbStr(nwRgb);
      ctx.beginPath();
      ctx.moveTo(0, sy + 9);
      ctx.quadraticCurveTo(4.4, sy + 14.5, 0, sy + 18.5);
      ctx.quadraticCurveTo(-4.4, sy + 14.5, 0, sy + 9);
      ctx.fill();
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.beginPath();
      ctx.arc(-1, sy + 12.6, 1, 0, Math.PI * 2);
      ctx.fill();
    } else if (neckwear === "bowtie") {
      ctx.fillStyle = rgbStr(nwRgb);
      for (const dir of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(dir * 2, sy + 5.5);
        ctx.quadraticCurveTo(dir * 9, sy - 3.5, dir * 15, sy - 0.5);
        ctx.lineTo(dir * 15, sy + 12);
        ctx.quadraticCurveTo(dir * 9, sy + 14.5, dir * 2, sy + 6.5);
        ctx.closePath();
        ctx.fill();
      }
      ctx.fillStyle = rgbStr(shadeRgb(nwRgb, 0.74));
      ctx.beginPath();
      ctx.roundRect(-3.2, sy + 1.2, 6.4, 9.6, 2.4);
      ctx.fill();
    } else if (neckwear === "scarf") {
      const wrapGrad = ctx.createLinearGradient(0, sy - 22, 0, sy + 12);
      wrapGrad.addColorStop(0, rgbStr(shadeRgb(nwRgb, 1.16)));
      wrapGrad.addColorStop(1, rgbStr(shadeRgb(nwRgb, 0.78)));
      ctx.fillStyle = wrapGrad;
      ctx.beginPath();
      ctx.moveTo(-m.neckHalfW - 9, sy - 13);
      ctx.quadraticCurveTo(0, sy - 23, m.neckHalfW + 9, sy - 13);
      ctx.quadraticCurveTo(m.neckHalfW + 14, sy + 1, m.neckHalfW + 6, sy + 9);
      ctx.quadraticCurveTo(0, sy + 19, -m.neckHalfW - 6, sy + 9);
      ctx.quadraticCurveTo(-m.neckHalfW - 14, sy + 1, -m.neckHalfW - 9, sy - 13);
      ctx.closePath();
      ctx.fill();
      // one end hanging down the chest
      ctx.fillStyle = rgbStr(shadeRgb(nwRgb, 0.88));
      ctx.beginPath();
      ctx.moveTo(4, sy + 8);
      ctx.lineTo(17, sy + 6);
      ctx.lineTo(21, sy + 52);
      ctx.lineTo(8, sy + 54);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = rgbStr(shadeRgb(nwRgb, 0.62), 0.7);
      ctx.lineWidth = 1;
      for (const fy of [sy - 6, sy + 2]) {
        ctx.beginPath();
        ctx.moveTo(-m.neckHalfW - 7, fy);
        ctx.quadraticCurveTo(0, fy + 8, m.neckHalfW + 7, fy);
        ctx.stroke();
      }
    } else if (neckwear === "lanyard") {
      const badgeY = sy + 56;
      ctx.strokeStyle = rgbStr(nwRgb);
      ctx.lineWidth = 2.4;
      ctx.lineCap = "round";
      for (const dir of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(dir * (m.neckHalfW + 1), sy - 2);
        ctx.lineTo(0, badgeY);
        ctx.stroke();
      }
      ctx.fillStyle = "#f8fafc";
      ctx.strokeStyle = "rgba(15, 23, 42, 0.28)";
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.roundRect(-10, badgeY - 2, 20, 26, 2.6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = rgbStr(nwRgb);
      ctx.fillRect(-10, badgeY - 2, 20, 6);
      ctx.fillStyle = rgbStr(skinMid);
      ctx.beginPath();
      ctx.arc(0, badgeY + 10, 3.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(15, 23, 42, 0.5)";
      ctx.fillRect(-6, badgeY + 16.5, 12, 1.6);
      ctx.fillRect(-4, badgeY + 19.6, 8, 1.4);
    }
  }

  // Twin braids hang in front of the shoulders
  if (avatar.hairStyle === "braids") {
    ctx.save();
    clipBelowHat();
    for (const dir of [-1, 1]) {
      const bx = dir * (m.headW - 1.5) - yawX * 0.3;
      const top = 8;
      const end = sy + 54;
      const links = Math.max(8, Math.round((end - top) / 8.5));
      for (let i = 0; i < links; i++) {
        const u = i / (links - 1);
        const ly = top + (end - top) * u;
        const lx = bx + dir * Math.sin(u * 2.2) * 5 + Math.sin(timeSec * 1.5 + u * 3) * 0.6;
        const r = 8.4 - u * 2.6;
        // each link leans the other way, which reads as the strands crossing over
        const lean = (i % 2 ? 1 : -1) * 0.62;
        ctx.fillStyle = rgbStr(shadeRgb(hairRgb, i % 2 ? 0.8 : 1.08));
        ctx.beginPath();
        ctx.ellipse(lx + (i % 2 ? 1.4 : -1.4), ly, r * 0.82, r * 1.12, lean, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = rgbStr(shadeRgb(hairRgb, 0.56), 0.55);
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
      const tieX = bx + dir * Math.sin(2.2) * 5;
      ctx.fillStyle = rgbStr(outAccRgb);
      ctx.beginPath();
      ctx.roundRect(tieX - 4, end + 1, 8, 4, 2);
      ctx.fill();
      ctx.fillStyle = rgbStr(shadeRgb(hairRgb, 0.9));
      ctx.beginPath();
      ctx.moveTo(tieX - 3.4, end + 5);
      ctx.quadraticCurveTo(tieX, end + 17, tieX + 3.4, end + 5);
      ctx.fill();
    }
    ctx.restore();
  }

  // ==========================================================================
  // 3. Expressive Head Group (Tilts, Nods, 2.5D Parallax & 200 Hz Lip Sync!)
  // ==========================================================================
  ctx.save();
  ctx.translate(yawX * 0.35, nodY + pitchY * 0.4);
  ctx.rotate(headTilt);

  // Back crown hair for shorter masculine/cropped styles
  if (["side_sweep", "quiff", "pixie", "buzz", "updo_bun", "ponytail", "pigtails", "space_buns", "mohawk"].includes(avatar.hairStyle)) {
    const chGrad = ctx.createLinearGradient(0, -m.headH - 28, 0, 18);
    chGrad.addColorStop(0, rgbStr(shadeRgb(hairRgb, 1.15)));
    chGrad.addColorStop(1, rgbStr(shadeRgb(hairRgb, 0.62)));
    ctx.fillStyle = chGrad;
    ctx.save();
    clipBelowHat();

    if (avatar.hairStyle === "updo_bun") {
      ctx.beginPath();
      ctx.arc(-yawX * 0.35, -m.headH - 12, 20 * m.headScale, 0, Math.PI * 2);
      ctx.fill();
    }

    if (avatar.hairStyle === "space_buns") {
      for (const dir of [-1, 1]) {
        ctx.beginPath();
        ctx.arc(dir * m.headW * 0.7 - yawX * 0.35, -m.headH - 8, 15 * m.headScale, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const pad = avatar.hairStyle === "buzz" || avatar.hairStyle === "mohawk" ? 2.2 : 5.5;
    ctx.beginPath();
    ctx.moveTo(-m.headW - pad, -10);
    ctx.bezierCurveTo(-m.headW - pad - 4, -m.headH - 14, m.headW + pad + 4, -m.headH - 14, m.headW + pad, -10);
    ctx.lineTo(m.headW - 2, 16);
    ctx.lineTo(-m.headW + 2, 16);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
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

  // Earrings hang from the lobes (hidden under long hair, as they would be)
  const earringStyle = avatar.earrings || "none";
  if (earringStyle !== "none" && avatar.earStyle !== "cyber" && headwear !== "headscarf") {
    const metal = parseHex(avatar.earringColor, [230, 195, 92]);
    for (const dir of [-1, 1]) {
      const lobeX = dir * (m.headW + 2.2 * earSc) - yawX * 0.42;
      const lobeY = 11.5 * earSc;
      ctx.fillStyle = rgbStr(metal);
      ctx.strokeStyle = rgbStr(metal);
      if (earringStyle === "studs") {
        ctx.beginPath();
        ctx.arc(lobeX, lobeY, 2.5 * earSc, 0, Math.PI * 2);
        ctx.fill();
      } else if (earringStyle === "hoops") {
        ctx.lineWidth = 1.7 * earSc;
        ctx.beginPath();
        ctx.arc(lobeX + dir * 0.8, lobeY + 6.5 * earSc, 6 * earSc, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // drops: a fine chain with a teardrop that sways with the head
        const sway = (anim.lookX * 1.8 + xv("shake") * Math.sin(timeSec * 13 - 0.8) * 3) * earSc;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(lobeX, lobeY);
        ctx.lineTo(lobeX + sway * 0.5, lobeY + 6 * earSc);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(lobeX + sway * 0.5, lobeY + 5 * earSc);
        ctx.quadraticCurveTo(lobeX + sway + 3.6 * earSc, lobeY + 12 * earSc, lobeX + sway, lobeY + 14.5 * earSc);
        ctx.quadraticCurveTo(lobeX + sway - 3.6 * earSc, lobeY + 12 * earSc, lobeX + sway * 0.5, lobeY + 5 * earSc);
        ctx.fill();
      }
      // small highlight so it reads as metal
      ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
      ctx.beginPath();
      ctx.arc(lobeX - 0.7 * earSc, lobeY - 0.7 * earSc + (earringStyle === "drops" ? 11 * earSc : 0), 0.9 * earSc, 0, Math.PI * 2);
      ctx.fill();
    }
  }

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
  const smileLift = anim.lipS * 3.6 + smileX * 3.2 - xv("frown") * 4.4;
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

  // Freckles scattered over the nose bridge and cheeks
  const freckleAmt = clamp(avatar.freckles ?? 0, 0, 1);
  if (freckleAmt > 0.02) {
    ctx.fillStyle = rgbStr(shadeRgb(skinMid, 0.62, 0.5), 0.2 + freckleAmt * 0.42);
    const shown = Math.round(FRECKLE_POINTS.length * (0.35 + freckleAmt * 0.65));
    for (let i = 0; i < shown; i++) {
      const [fx, fy, fr] = FRECKLE_POINTS[i];
      ctx.beginPath();
      ctx.arc(fx * m.headScale, fy * m.headScale - smileLift * 0.3, fr * m.headScale, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Age lines: forehead, crow's feet, under-eye and laugh lines
  const ageAmt = clamp(avatar.ageLines ?? 0, 0, 1);
  if (ageAmt > 0.02) {
    const hs2 = m.headScale;
    ctx.strokeStyle = rgbStr(skinDeep, 0.16 + ageAmt * 0.4);
    ctx.lineCap = "round";
    ctx.lineWidth = 0.9 + ageAmt * 0.5;
    for (const fy of [-39, -45.5]) {
      ctx.beginPath();
      ctx.moveTo(-17 * hs2, fy * hs2);
      ctx.quadraticCurveTo(0, (fy - 2.2) * hs2, 17 * hs2, fy * hs2);
      ctx.stroke();
    }
    for (const dir of [-1, 1]) {
      // crow's feet
      for (const [dy, len] of [[-3, 5], [0, 6], [3, 5]]) {
        ctx.beginPath();
        ctx.moveTo(dir * 35.5 * hs2, (-12 + dy * 0.5) * hs2);
        ctx.lineTo(dir * (35.5 + len) * hs2, (-12 + dy * 1.5) * hs2);
        ctx.stroke();
      }
      // under-eye
      ctx.beginPath();
      ctx.moveTo(dir * 13 * hs2, -4.5 * hs2);
      ctx.quadraticCurveTo(dir * 22 * hs2, -1.5 * hs2, dir * 30 * hs2, -5 * hs2);
      ctx.stroke();
      // laugh line from the nose wing to the corner of the mouth
      ctx.beginPath();
      ctx.moveTo(dir * 12 * hs2, 12 * hs2);
      ctx.quadraticCurveTo(dir * 23 * hs2, 21 * hs2 - smileLift * 0.4, dir * 25 * hs2, 33 * hs2 - smileLift * 0.6 + chinDrop * 0.3);
      ctx.stroke();
    }
  }

  if (avatar.beautyMark) {
    ctx.fillStyle = rgbStr(shadeRgb(skinDeep, 0.5), 0.82);
    ctx.beginPath();
    ctx.arc(-17.5 * m.headScale, 24.5 * m.headScale - smileLift * 0.5 + chinDrop * 0.2, 1.25 * m.headScale, 0, Math.PI * 2);
    ctx.fill();
  }

  // Brows and facial hair share one colour: the hair's, unless one was picked
  const browRgb = avatar.browColor ? parseHex(avatar.browColor, shadeRgb(hairRgb, 0.85)) : shadeRgb(hairRgb, 0.85);

  // Facial Hair (Stubble, Beard, Goatee) — moves seamlessly with mandible jawDrop!
  const fhStyle = avatar.facialHair || "none";
  if (fhStyle === "stubble" || fhStyle === "beard" || fhStyle === "goatee") {
    const beardAlpha = fhStyle === "stubble" ? 0.22 : 0.88;
    ctx.fillStyle = rgbStr(browRgb, beardAlpha);
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
  const browLift = clamp(anim.pitchSt * 0.85 + anim.energy * 2.4 + xv("browUp") * 5.2, -2.5, 8.5);
  const shadowAmt = clamp(avatar.eyeshadow ?? 0, 0, 1);
  const shadowRgb = parseHex(avatar.eyeshadowColor, [122, 92, 143]);
  const irisFirstRgb = parseHex(avatar.irisColor, [59, 130, 166]);
  const irisSecondRgb = avatar.irisColor2 ? parseHex(avatar.irisColor2, irisFirstRgb) : irisFirstRgb;
  const linerAmt = clamp(avatar.eyeliner ?? 0, 0, 1);

  for (const dir of [-1, 1]) {
    const ex = dir * eyeSpan;
    const ey = -12.5 * m.headScale;
    const winkClose = dir === 1 ? xv("wink") * 0.94 : 0;
    const blinkAmt = Math.max(naturalBlink, winkClose, xv("shut") * 0.96);
    const openH = Math.max(0.55, 6.2 * eyeSc * (1 + eyeWide * 0.34) * (1 - blinkAmt * 0.94));
    const ew = 11.4 * eyeSc;
    const outerLift = -tilt * 5.5;
    const irisRgb = dir === 1 ? irisSecondRgb : irisFirstRgb;

    // Orbital socket shading
    const sockGrad = ctx.createRadialGradient(ex, ey - 1, 2, ex, ey - 1, 15 * eyeSc);
    sockGrad.addColorStop(0, rgbStr(skinDeep, 0.18));
    sockGrad.addColorStop(1, rgbStr(skinDeep, 0));
    ctx.fillStyle = sockGrad;
    ctx.beginPath();
    ctx.ellipse(ex, ey - 1, 15 * eyeSc, 11 * eyeSc, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyeshadow washed over the lid, strongest at the lash line
    if (shadowAmt > 0.02) {
      const sg = ctx.createLinearGradient(ex, ey - openH * 1.5 - 7.5 * eyeSc, ex, ey - openH * 0.6);
      sg.addColorStop(0, rgbStr(shadowRgb, 0));
      sg.addColorStop(1, rgbStr(shadowRgb, 0.3 + shadowAmt * 0.5));
      ctx.fillStyle = sg;
      ctx.beginPath();
      ctx.moveTo(ex - dir * (ew + 0.5), ey + 0.4);
      ctx.quadraticCurveTo(ex - dir * 2, ey - openH * 1.5 - 8.5 * eyeSc, ex + dir * (ew + 3.2), ey - 1.2 + outerLift);
      ctx.quadraticCurveTo(ex, ey - openH * 1.46, ex - dir * (ew + 0.5), ey + 0.4);
      ctx.closePath();
      ctx.fill();
    }

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

    // Eyeliner: the lash line carried out past the corner of the eye in a small wing
    if (linerAmt > 0.02) {
      ctx.strokeStyle = `rgba(23, 20, 31, ${0.6 + linerAmt * 0.4})`;
      ctx.lineWidth = (1.2 + linerAmt * 1.5) * Math.sqrt(eyeSc);
      ctx.beginPath();
      ctx.moveTo(ex + dir * (ew - 3), ey - 0.6 + outerLift * 0.8);
      ctx.quadraticCurveTo(ex + dir * (ew + 1.5), ey - 0.2 + outerLift, ex + dir * (ew + 2.6 + linerAmt * 3.6), ey - 1.4 - linerAmt * 3 + outerLift);
      ctx.stroke();
    }

    // Sculpted, tapered eyebrow
    const browSc = clamp(avatar.browThickness ?? 1, 0.5, 1.65);
    const arch = clamp(avatar.browArch ?? 0.2, -0.2, 0.6) * 10;
    const by = ey - (12.8 + browLift) * m.headScale;
    const thick = 3.0 * browSc * m.headScale;
    // browIn > 0 lifts the inner ends (worried, sad); < 0 pulls them down (stern)
    const innerDy = -browIn * 3.6 * m.headScale;
    const outerDy = browIn * 1.5 * m.headScale;
    ctx.fillStyle = rgbStr(browRgb);
    ctx.beginPath();
    ctx.moveTo(ex - dir * (ew + 0.5), by + 1.8 + innerDy);
    ctx.quadraticCurveTo(ex + dir * 2, by - 3.0 - arch, ex + dir * (ew + 2.4), by + 1.5 + outerDy);
    ctx.quadraticCurveTo(ex + dir * 2, by - 3.0 - arch + thick, ex - dir * ew, by + 1.8 + thick * 0.82 + innerDy);
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

  if (avatar.noseStud) {
    const studRgb = parseHex(avatar.earringColor, [230, 195, 92]);
    ctx.fillStyle = rgbStr(studRgb);
    ctx.beginPath();
    ctx.arc(7.4 * noseW, tipY - 2.2, 1.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.beginPath();
    ctx.arc(7.0 * noseW, tipY - 2.6, 0.5, 0, Math.PI * 2);
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

  const halfW = (20.2 + spreadAmt * 8.6 - roundAmt * 7.0 + smileX * 1.8 - xv("frown") * 1.2) * mouthSc;
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

  // Dimples: a small crease beside each corner of the mouth, deeper in a smile
  const dimpleAmt = clamp(avatar.dimples ?? 0, 0, 1);
  if (dimpleAmt > 0.02) {
    ctx.strokeStyle = rgbStr(skinDeep, (0.18 + dimpleAmt * 0.34) * clamp(0.65 + smileLift * 0.1, 0.6, 1.25));
    ctx.lineWidth = 1.3;
    ctx.lineCap = "round";
    for (const dir of [-1, 1]) {
      const dx = dir * (halfW + 5.4 * m.headScale);
      ctx.beginPath();
      ctx.moveTo(dx - dir * 0.6, cornerY - 4.4 * m.headScale);
      ctx.quadraticCurveTo(dx + dir * 2.8, cornerY, dx - dir * 0.4, cornerY + 4.8 * m.headScale);
      ctx.stroke();
    }
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
    ctx.fillStyle = rgbStr(shadeRgb(browRgb, 0.97));
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
      ctx.lineWidth = gl === "bold" ? 3.0 : gl === "cat_eye" ? 2.6 : gl === "round" || gl === "aviator" ? 1.5 : 2.2;
      for (const dir of [-1, 1]) {
        const gx = dir * eyeSpan;
        ctx.fillStyle = isShades ? rgbStr(gCol, 0.72) : gl === "aviator" ? "rgba(120, 150, 170, 0.34)" : "rgba(220, 238, 255, 0.11)";
        ctx.beginPath();
        if (gl === "round") {
          ctx.arc(gx, gy, gw * 0.86, 0, Math.PI * 2);
        } else if (gl === "cat_eye") {
          // upswept outer corners
          ctx.moveTo(gx - dir * gw * 0.9, gy - gh * 0.5);
          ctx.quadraticCurveTo(gx, gy - gh * 0.86, gx + dir * gw * 1.12, gy - gh * 1.02);
          ctx.quadraticCurveTo(gx + dir * gw * 1.02, gy + gh * 0.5, gx + dir * gw * 0.3, gy + gh * 0.78);
          ctx.quadraticCurveTo(gx - dir * gw * 0.86, gy + gh * 0.8, gx - dir * gw * 0.9, gy - gh * 0.5);
          ctx.closePath();
        } else if (gl === "aviator") {
          // teardrop lenses
          ctx.moveTo(gx - dir * gw * 0.88, gy - gh * 0.62);
          ctx.quadraticCurveTo(gx, gy - gh * 0.9, gx + dir * gw * 0.98, gy - gh * 0.6);
          ctx.quadraticCurveTo(gx + dir * gw * 1.04, gy + gh * 0.6, gx + dir * gw * 0.2, gy + gh * 1.0);
          ctx.quadraticCurveTo(gx - dir * gw * 0.84, gy + gh * 0.86, gx - dir * gw * 0.88, gy - gh * 0.62);
          ctx.closePath();
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

    ctx.save();
    clipBelowHat();
    ctx.beginPath();
    if (hs === "long_waves" || hs === "sleek_bob" || hs === "shoulder_lob" || hs === "long_straight" || hs === "braids") {
      const sideDrop = hs === "sleek_bob" ? 36 * m.headScale : hs === "long_straight" ? 31 * m.headScale : 24 * m.headScale;
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
    } else if (hs === "curly_halo" || hs === "afro") {
      const vol = hs === "afro" ? 1.7 : 1; // an afro is the same shape with far more volume
      ctx.moveTo(-m.headW - 11 * vol, -6);
      ctx.bezierCurveTo(-m.headW - 22 * vol, -m.headH - 28 * vol, m.headW + 22 * vol, -m.headH - 28 * vol, m.headW + 11 * vol, -6);
      ctx.quadraticCurveTo(m.headW - 4, -36 * m.headScale, 18, -44 * m.headScale);
      ctx.quadraticCurveTo(0, -39 * m.headScale, -18, -44 * m.headScale);
      ctx.quadraticCurveTo(-m.headW + 4, -36 * m.headScale, -m.headW - 11 * vol, -6);
    } else if (hs === "buzz") {
      ctx.fillStyle = rgbStr(hairRgb, 0.72);
      ctx.moveTo(-m.headW - 1.5, -12);
      ctx.bezierCurveTo(-m.headW - 4, -m.headH - 8, m.headW + 4, -m.headH - 8, m.headW + 1.5, -12);
      ctx.quadraticCurveTo(m.headW - 5, -42 * m.headScale, 0, -46 * m.headScale);
      ctx.quadraticCurveTo(-m.headW + 5, -42 * m.headScale, -m.headW - 1.5, -12);
    } else if (hs === "mohawk") {
      // Cropped sides, drawn faintly like a buzz cut, under a tall crest down the middle
      ctx.fillStyle = rgbStr(hairRgb, 0.55);
      ctx.moveTo(-m.headW - 1.5, -12);
      ctx.bezierCurveTo(-m.headW - 4, -m.headH - 8, m.headW + 4, -m.headH - 8, m.headW + 1.5, -12);
      ctx.quadraticCurveTo(m.headW - 5, -42 * m.headScale, 0, -46 * m.headScale);
      ctx.quadraticCurveTo(-m.headW + 5, -42 * m.headScale, -m.headW - 1.5, -12);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = fGrad;
      const crestHalf = m.headW * 0.3;
      const crestTop = -m.headH - 31;
      ctx.beginPath();
      ctx.moveTo(-crestHalf, -43 * m.headScale);
      ctx.bezierCurveTo(-crestHalf - 5, -m.headH - 6, -crestHalf - 1, crestTop + 8, -crestHalf * 0.45, crestTop);
      ctx.quadraticCurveTo(1, crestTop - 6, crestHalf * 0.6, crestTop + 3);
      ctx.bezierCurveTo(crestHalf + 4, crestTop + 10, crestHalf + 5, -m.headH - 6, crestHalf, -43 * m.headScale);
      ctx.quadraticCurveTo(0, -49 * m.headScale, -crestHalf, -43 * m.headScale);
    } else {
      // side_sweep, pixie, updo_bun, ponytail, pigtails, space_buns
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

    // Straight fringe across the forehead, ending just above the brows
    if (avatar.fringe && hs !== "buzz" && hs !== "mohawk") {
      const fTop = -m.headH * 0.82;
      const fBottom = -35 * m.headScale;
      const fHalf = m.headW - 3;
      ctx.beginPath();
      ctx.moveTo(-fHalf - 2, fTop + 10);
      ctx.quadraticCurveTo(0, fTop - 6, fHalf + 2, fTop + 10);
      ctx.lineTo(fHalf, fBottom + 1);
      for (let i = 5; i >= -5; i--) {
        // a softly uneven lower edge reads as strands rather than a block
        ctx.lineTo((i / 5) * fHalf, fBottom + (i % 2 ? 2.2 : 0) + Math.abs(i) * 0.35);
      }
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // Specular hair crown ribbon
    if (hs !== "buzz" && hs !== "mohawk" && !hatOn) {
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
  // Headwear (drawn over the hair)
  // ==========================================================================
  if (headwear !== "none") {
    const wearRgb = parseHex(avatar.headwearColor, [180, 69, 47]);
    const bandY = -m.headH * 0.56;
    const rimX = m.headW + (headwear === "headband" ? 5.5 : 7.5);
    if (headwear === "headband") {
      ctx.strokeStyle = rgbStr(wearRgb);
      ctx.lineWidth = 6.5 * m.headScale;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-rimX + 1, bandY + 8);
      ctx.quadraticCurveTo(0, bandY - 15, rimX - 1, bandY + 8);
      ctx.stroke();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-rimX + 5, bandY + 4);
      ctx.quadraticCurveTo(0, bandY - 17.5, rimX - 5, bandY + 4);
      ctx.stroke();
    } else if (headwear === "beret") {
      // A soft round cap worn tilted to one side, with a little stalk on top
      const beretGrad = ctx.createLinearGradient(-rimX, -m.headH - 26, rimX, bandY + 8);
      beretGrad.addColorStop(0, rgbStr(shadeRgb(wearRgb, 1.18)));
      beretGrad.addColorStop(1, rgbStr(shadeRgb(wearRgb, 0.72)));
      ctx.fillStyle = beretGrad;
      ctx.beginPath();
      ctx.moveTo(-rimX + 1, bandY + 6);
      ctx.bezierCurveTo(-rimX - 20, bandY - 12, -m.headW * 0.9, -m.headH - 30, -4, -m.headH - 24);
      ctx.bezierCurveTo(m.headW * 0.9, -m.headH - 19, rimX + 9, bandY - 12, rimX - 1, bandY + 6);
      ctx.quadraticCurveTo(0, bandY - 6, -rimX + 1, bandY + 6);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = rgbStr(shadeRgb(wearRgb, 0.66));
      ctx.beginPath();
      ctx.moveTo(-rimX + 1, bandY + 6);
      ctx.quadraticCurveTo(0, bandY - 6, rimX - 1, bandY + 6);
      ctx.quadraticCurveTo(0, bandY - 1.5, -rimX + 1, bandY + 6);
      ctx.fill();
      ctx.strokeStyle = rgbStr(shadeRgb(wearRgb, 0.7));
      ctx.lineWidth = 2.2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-7, -m.headH - 25);
      ctx.lineTo(-9.5, -m.headH - 30.5);
      ctx.stroke();
    } else if (headwear === "headphones") {
      // Over-ear headphones: a band across the crown and a cushioned cup on each ear
      ctx.strokeStyle = rgbStr(shadeRgb(wearRgb, 0.9));
      ctx.lineWidth = 5.2 * m.headScale;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-m.headW - 5, -8);
      ctx.bezierCurveTo(-m.headW - 9, -m.headH - 22, m.headW + 9, -m.headH - 22, m.headW + 5, -8);
      ctx.stroke();
      for (const dir of [-1, 1]) {
        const cupX = dir * (m.headW + 3.5) - yawX * 0.42;
        const cupGrad = ctx.createLinearGradient(cupX - 7, -18, cupX + 7, 14);
        cupGrad.addColorStop(0, rgbStr(shadeRgb(wearRgb, 1.2)));
        cupGrad.addColorStop(1, rgbStr(shadeRgb(wearRgb, 0.68)));
        ctx.fillStyle = cupGrad;
        ctx.beginPath();
        ctx.roundRect(cupX - 7.5, -18, 15, 33, 7);
        ctx.fill();
        ctx.fillStyle = "rgba(15, 23, 42, 0.5)";
        ctx.beginPath();
        ctx.roundRect(cupX - dir * 6.5 - 2, -14, 4, 25, 2);
        ctx.fill();
      }
    } else if (headwear === "bow") {
      // A ribbon bow worn to one side of the crown
      ctx.save();
      ctx.translate(m.headW * 0.5, -m.headH - 7);
      ctx.rotate(0.3);
      for (const dir of [-1, 1]) {
        const loopGrad = ctx.createLinearGradient(0, -10, dir * 18, 10);
        loopGrad.addColorStop(0, rgbStr(shadeRgb(wearRgb, 0.8)));
        loopGrad.addColorStop(1, rgbStr(shadeRgb(wearRgb, 1.16)));
        ctx.fillStyle = loopGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(dir * 6, -13, dir * 20, -12, dir * 18, 0);
        ctx.bezierCurveTo(dir * 20, 12, dir * 6, 13, 0, 0);
        ctx.fill();
      }
      ctx.fillStyle = rgbStr(shadeRgb(wearRgb, 0.68));
      ctx.beginPath();
      ctx.roundRect(-3.8, -4.8, 7.6, 9.6, 2.6);
      ctx.fill();
      ctx.restore();
    } else if (headwear === "flower") {
      // A flower tucked above one ear
      const fx = -m.headW * 0.86;
      const fy = -m.headH * 0.5;
      ctx.fillStyle = rgbStr(wearRgb);
      ctx.strokeStyle = rgbStr(shadeRgb(wearRgb, 0.7), 0.7);
      ctx.lineWidth = 0.7;
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.ellipse(fx + Math.cos(a) * 6.4, fy + Math.sin(a) * 6.4, 5.4, 3.7, a, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.fillStyle = "#f2c94c";
      ctx.beginPath();
      ctx.arc(fx, fy, 3.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (headwear === "tiara") {
      // A slim band across the hair with three points and a jewel
      const ty = -m.headH * 0.93;
      const half = m.headW * 0.64;
      ctx.fillStyle = rgbStr(wearRgb);
      ctx.strokeStyle = rgbStr(shadeRgb(wearRgb, 0.66), 0.85);
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-half, ty + 5);
      ctx.quadraticCurveTo(0, ty - 4, half, ty + 5);
      ctx.lineTo(half - 1, ty + 9);
      ctx.quadraticCurveTo(0, ty, -half + 1, ty + 9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      for (const [px, rise] of [[-half * 0.5, 7.5], [0, 12.5], [half * 0.5, 7.5]]) {
        const base = px === 0 ? ty + 0.5 : ty + 1.6;
        ctx.beginPath();
        ctx.moveTo(px - 4.6, base + 1.6);
        ctx.lineTo(px, base - rise);
        ctx.lineTo(px + 4.6, base + 1.6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      ctx.fillStyle = rgbStr(outAccRgb);
      ctx.beginPath();
      ctx.arc(0, ty - 5.4, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.beginPath();
      ctx.arc(-0.8, ty - 6.2, 0.8, 0, Math.PI * 2);
      ctx.fill();
    } else if (headwear === "fedora") {
      // A brimmed hat: a pinched crown, a ribbon band and a wide brim over the brow
      const brimY = bandY + 5;
      const brimHalf = m.headW + 25;
      const crownTop = -m.headH - 31;
      const crownGrad = ctx.createLinearGradient(-rimX, crownTop, rimX, brimY);
      crownGrad.addColorStop(0, rgbStr(shadeRgb(wearRgb, 1.18)));
      crownGrad.addColorStop(1, rgbStr(shadeRgb(wearRgb, 0.74)));
      ctx.fillStyle = crownGrad;
      ctx.beginPath();
      ctx.moveTo(-rimX + 2, brimY);
      ctx.bezierCurveTo(-rimX - 2, crownTop + 14, -m.headW * 0.62, crownTop, -8, crownTop + 3);
      ctx.quadraticCurveTo(0, crownTop + 9, 8, crownTop + 3);
      ctx.bezierCurveTo(m.headW * 0.62, crownTop, rimX + 2, crownTop + 14, rimX - 2, brimY);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = rgbStr(shadeRgb(wearRgb, 0.48));
      ctx.beginPath();
      ctx.moveTo(-rimX + 1, brimY - 10);
      ctx.quadraticCurveTo(0, brimY - 18, rimX - 1, brimY - 10);
      ctx.lineTo(rimX - 2, brimY);
      ctx.quadraticCurveTo(0, brimY - 9, -rimX + 2, brimY);
      ctx.closePath();
      ctx.fill();
      const brimGrad = ctx.createLinearGradient(0, brimY - 10, 0, brimY + 6);
      brimGrad.addColorStop(0, rgbStr(shadeRgb(wearRgb, 1.06)));
      brimGrad.addColorStop(1, rgbStr(shadeRgb(wearRgb, 0.6)));
      ctx.fillStyle = brimGrad;
      ctx.beginPath();
      ctx.moveTo(-brimHalf, brimY + 4);
      ctx.quadraticCurveTo(0, brimY - 15, brimHalf, brimY + 4);
      ctx.quadraticCurveTo(0, brimY - 2, -brimHalf, brimY + 4);
      ctx.closePath();
      ctx.fill();
    } else if (headwear === "chef") {
      // A chef's toque: a tall band under a puffed crown
      const bandTop = bandY - 17;
      const puffTop = -m.headH - 46;
      const toqueGrad = ctx.createLinearGradient(-rimX, puffTop, rimX, bandY + 6);
      toqueGrad.addColorStop(0, rgbStr(shadeRgb(wearRgb, 1.08)));
      toqueGrad.addColorStop(1, rgbStr(shadeRgb(wearRgb, 0.84)));
      ctx.fillStyle = toqueGrad;
      ctx.beginPath();
      ctx.moveTo(-rimX + 2, bandTop + 2);
      ctx.bezierCurveTo(-rimX - 22, bandTop - 6, -rimX - 14, puffTop + 6, -m.headW * 0.42, puffTop + 6);
      ctx.bezierCurveTo(-m.headW * 0.3, puffTop - 8, m.headW * 0.3, puffTop - 8, m.headW * 0.42, puffTop + 6);
      ctx.bezierCurveTo(rimX + 14, puffTop + 6, rimX + 22, bandTop - 6, rimX - 2, bandTop + 2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = rgbStr(shadeRgb(wearRgb, 0.66), 0.55);
      ctx.lineWidth = 1;
      for (const sx of [-0.5, 0, 0.5]) {
        ctx.beginPath();
        ctx.moveTo(sx * rimX, bandTop - 5 + Math.abs(sx) * 4);
        ctx.quadraticCurveTo(sx * rimX * 1.25, puffTop + 26, sx * rimX * 1.05, puffTop + 14);
        ctx.stroke();
      }
      ctx.fillStyle = rgbStr(shadeRgb(wearRgb, 0.93));
      ctx.beginPath();
      ctx.moveTo(-rimX + 1, bandY + 6);
      ctx.lineTo(-rimX + 2, bandTop);
      ctx.quadraticCurveTo(0, bandTop - 9, rimX - 2, bandTop);
      ctx.lineTo(rimX - 1, bandY + 6);
      ctx.quadraticCurveTo(0, bandY - 5, -rimX + 1, bandY + 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (headwear === "headscarf") {
      // A scarf wrapped around the head and under the chin, leaving the face open
      const faceTop = -m.headH * 0.64;
      const crownY = -m.headH * 1.36 - 10; // control height that lifts the cloth clear of the scalp
      const faceBottom = chinY + 1;
      const faceHalf = m.cheekW * 0.93;
      const scarfGrad = ctx.createLinearGradient(-rimX, -m.headH - 12, rimX, faceBottom + 16);
      scarfGrad.addColorStop(0, rgbStr(shadeRgb(wearRgb, 1.16)));
      scarfGrad.addColorStop(0.6, rgbStr(wearRgb));
      scarfGrad.addColorStop(1, rgbStr(shadeRgb(wearRgb, 0.74)));
      ctx.fillStyle = scarfGrad;
      ctx.beginPath();
      // outer edge: over the crown, down past the jaw, round under the chin
      ctx.moveTo(-m.headW - 8, 4);
      ctx.bezierCurveTo(-m.headW - 13, crownY, m.headW + 13, crownY, m.headW + 8, 4);
      ctx.bezierCurveTo(m.headW + 9, 34, m.jawW + 12, faceBottom + 6, m.neckHalfW + 15, faceBottom + 20);
      ctx.lineTo(-m.neckHalfW - 15, faceBottom + 20);
      ctx.bezierCurveTo(-m.jawW - 12, faceBottom + 6, -m.headW - 9, 34, -m.headW - 8, 4);
      ctx.closePath();
      // inner edge: the opening for the face (wound the other way so it is left unfilled)
      ctx.moveTo(0, faceTop);
      ctx.bezierCurveTo(-faceHalf * 1.02, faceTop, -faceHalf * 1.04, faceBottom - 14, 0, faceBottom);
      ctx.bezierCurveTo(faceHalf * 1.04, faceBottom - 14, faceHalf * 1.02, faceTop, 0, faceTop);
      ctx.closePath();
      ctx.fill("evenodd");
      // soft folds
      ctx.strokeStyle = rgbStr(shadeRgb(wearRgb, 0.66), 0.6);
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(-m.headW * 0.5, -m.headH * 0.93);
      ctx.quadraticCurveTo(-m.headW - 1, -m.headH * 0.5, -m.headW - 2, 14);
      ctx.moveTo(m.headW * 0.5, -m.headH * 0.93);
      ctx.quadraticCurveTo(m.headW + 1, -m.headH * 0.5, m.headW + 2, 14);
      ctx.stroke();
    } else {
      const isCap = headwear === "cap";
      const peakY = -m.headH - (isCap ? 17 : 23);
      const domeGrad = ctx.createLinearGradient(-rimX, peakY, rimX, bandY + 10);
      domeGrad.addColorStop(0, rgbStr(shadeRgb(wearRgb, 1.2)));
      domeGrad.addColorStop(0.6, rgbStr(wearRgb));
      domeGrad.addColorStop(1, rgbStr(shadeRgb(wearRgb, 0.7)));
      ctx.fillStyle = domeGrad;
      ctx.beginPath();
      ctx.moveTo(-rimX, bandY + 6);
      ctx.bezierCurveTo(-rimX - 5, peakY + 6, -m.headW * 0.5, peakY, 0, peakY);
      ctx.bezierCurveTo(m.headW * 0.5, peakY, rimX + 5, peakY + 6, rimX, bandY + 6);
      ctx.quadraticCurveTo(0, bandY - 5, -rimX, bandY + 6);
      ctx.closePath();
      ctx.fill();

      if (isCap) {
        // Panel seams, a button on top, and a visor curving forward over the brow
        ctx.strokeStyle = rgbStr(shadeRgb(wearRgb, 0.7), 0.55);
        ctx.lineWidth = 1.1;
        for (const sx of [-0.52, 0, 0.52]) {
          ctx.beginPath();
          ctx.moveTo(0, peakY + 1);
          ctx.quadraticCurveTo(sx * rimX * 1.25, peakY + 12, sx * rimX, bandY + 2 - (1 - sx * sx) * 6);
          ctx.stroke();
        }
        ctx.fillStyle = rgbStr(shadeRgb(wearRgb, 0.78));
        ctx.beginPath();
        ctx.arc(0, peakY + 1.2, 2.8, 0, Math.PI * 2);
        ctx.fill();

        const visorGrad = ctx.createLinearGradient(0, bandY - 4, 0, bandY + 17);
        visorGrad.addColorStop(0, rgbStr(shadeRgb(wearRgb, 0.74)));
        visorGrad.addColorStop(1, rgbStr(shadeRgb(wearRgb, 0.5)));
        ctx.fillStyle = visorGrad;
        ctx.beginPath();
        ctx.moveTo(-rimX + 0.5, bandY + 6);
        ctx.quadraticCurveTo(0, bandY - 5, rimX - 0.5, bandY + 6);
        ctx.bezierCurveTo(rimX + 4, bandY + 15, m.headW * 0.6, bandY + 18, 0, bandY + 15);
        ctx.bezierCurveTo(-m.headW * 0.6, bandY + 18, -rimX - 4, bandY + 15, -rimX + 0.5, bandY + 6);
        ctx.closePath();
        ctx.fill();
      } else {
        // Knitted cuff with rib lines
        const cuffH = 12 * m.headScale;
        ctx.fillStyle = rgbStr(shadeRgb(wearRgb, 0.84));
        ctx.beginPath();
        ctx.moveTo(-rimX - 1.5, bandY + 7);
        ctx.quadraticCurveTo(0, bandY - 5, rimX + 1.5, bandY + 7);
        ctx.lineTo(rimX + 1.5, bandY + 7 - cuffH);
        ctx.quadraticCurveTo(0, bandY - 5 - cuffH, -rimX - 1.5, bandY + 7 - cuffH);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = rgbStr(shadeRgb(wearRgb, 0.62), 0.7);
        ctx.lineWidth = 1.1;
        for (let k = -6; k <= 6; k++) {
          const rx = (k / 6.5) * rimX;
          const arc = (1 - (rx / rimX) ** 2) * 12;
          ctx.beginPath();
          ctx.moveTo(rx, bandY + 7 - arc - 0.5);
          ctx.lineTo(rx, bandY + 7 - arc - cuffH + 0.5);
          ctx.stroke();
        }
      }
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
