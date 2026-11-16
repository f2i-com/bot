/*!
 * bot.computer — Standalone Speaking Website Companion & AIML Chatbot Embed SDK
 * Powered by tts.wasm (24 kHz physical vocal-tract synthesis & 200 Hz lip-sync).
 * Pure JavaScript · Shadow DOM isolated · Zero external dependencies.
 *
 * @license Apache-2.0
 * Copyright 2026 f2i.com. Licensed under the Apache License, Version 2.0:
 * https://www.apache.org/licenses/LICENSE-2.0
 * Third-party notices: https://github.com/f2i-com/bot/blob/main/THIRD-PARTY-NOTICES.md
 */
(function (global) {
  "use strict";

  const _capturedScript = typeof document !== "undefined" ? document.currentScript : null;

  // --- 1. Embedded TTS WebAssembly Glue (CSP-safe, zero eval) ---
// Embedded JavaScript SDK for TTS (tts.computer).
// Compiled directly inside `tts.wasm` (`tts_glue_ptr` / `tts_glue_len`) so a single `.wasm`
// file contains its own complete JS bindings with zero external glue dependencies.
//
// Evaluated via `Function("wasm", code)(instance.exports)` -> `{ TTS, SpeechStream, encodeWav }`.

const enc = new TextEncoder();
const dec = new TextDecoder();

function bindTTS(w) {
  if (!w || !w.memory || typeof w.tts_new !== "function") {
    throw new Error("Invalid TTS WebAssembly exports object");
  }

  const writeUtf8 = (str) => {
    const bytes = enc.encode(String(str));
    if (bytes.length === 0) return [0, 0];
    const ptr = w.tts_alloc(bytes.length);
    new Uint8Array(w.memory.buffer, ptr, bytes.length).set(bytes);
    return [ptr, bytes.length];
  };

  const readJsonText = () => {
    const len = w.tts_json_len();
    if (!len) return "";
    const ptr = w.tts_json_ptr();
    return dec.decode(new Uint8Array(w.memory.buffer, ptr, len));
  };

  const readJson = () => JSON.parse(readJsonText());

  const copyF32 = (ptrFn, lenFn) => {
    const len = lenFn();
    if (!len) return new Float32Array(0);
    const ptr = ptrFn();
    return new Float32Array(w.memory.buffer, ptr, len).slice();
  };

  const copyBytes = () => {
    const len = w.tts_bytes_len();
    if (!len) return new Uint8Array(0);
    const ptr = w.tts_bytes_ptr();
    return new Uint8Array(w.memory.buffer, ptr, len).slice();
  };

  // Preserve non-finite numbers as sentinel strings so Rust can report "<key> must be a finite number"
  // instead of JSON.stringify silently turning NaN/Infinity into null.
  const serializePayload = (val) =>
    JSON.stringify(val, (_k, v) =>
      typeof v === "number" && !Number.isFinite(v) ? "__TTS_NONFINITE__" : v
    );

  w.tts_meta_json();
  const META = readJson();

  let sharedAudioCtx = null;
  let rngCounter = ((Date.now ? Date.now() : 123456789) ^ 0x5f3759df) >>> 0;
  const nextSeed = () => {
    if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
      const a = new Uint32Array(1);
      crypto.getRandomValues(a);
      return a[0] >>> 0;
    }
    rngCounter = (Math.imul(rngCounter, 1664525) + 1013904223) >>> 0;
    return rngCounter;
  };

  const buildSpeechObject = () => {
    const meta = readJson();
    const out = {
      samples: copyF32(w.tts_samples_ptr, w.tts_samples_len),
      sampleRate: meta.sampleRate,
      duration: meta.duration,
      text: meta.text,
      ipa: meta.ipa,
      words: meta.words,
      phones: meta.phones,
      visemes: copyF32(w.tts_visemes_ptr, w.tts_visemes_len),
      visemeRate: META.visemeRate,
      visemeFields: META.visemeFields.slice(),
      acoustics: copyF32(w.tts_acoustics_ptr, w.tts_acoustics_len),
      acousticFields: META.acousticFields.slice(),
    };
    if (meta.segments) out.segments = meta.segments;
    return out;
  };

  const playSpeechInBrowser = async (speech, audioContext) => {
    const Ctx =
      audioContext ? null : (globalThis.AudioContext || globalThis.webkitAudioContext);
    const ctx = audioContext || (sharedAudioCtx ??= Ctx ? new Ctx() : null);
    if (!ctx) {
      throw new Error("Web Audio API (AudioContext) is not available in this environment");
    }
    if (ctx.state === "suspended") await ctx.resume();
    if (!speech || !speech.samples || speech.samples.length === 0) {
      return { speech, stop() {}, done: Promise.resolve(speech) };
    }
    const buffer = ctx.createBuffer(1, speech.samples.length, speech.sampleRate);
    buffer.copyToChannel(speech.samples, 0);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    const done = new Promise((resolve) => {
      source.onended = () => resolve(speech);
    });
    source.start();
    return {
      speech,
      source,
      stop() {
        try {
          source.stop();
        } catch {}
      },
      done,
    };
  };

  const instRegistry =
    typeof FinalizationRegistry !== "undefined"
      ? new FinalizationRegistry((h) => {
          if (h > 0) w.tts_drop(h);
        })
      : null;

  const streamRegistry =
    typeof FinalizationRegistry !== "undefined"
      ? new FinalizationRegistry((h) => {
          if (h > 0) w.tts_stream_drop(h);
        })
      : null;

  class SpeechStream {
    #handle;
    #meta;
    #visemes;

    constructor(handle, meta, visemes) {
      this.#handle = handle;
      this.#meta = meta;
      this.#visemes = visemes;
      if (streamRegistry) streamRegistry.register(this, handle, this);
    }

    read(maxSamples = 4800) {
      if (!this.#handle) return new Float32Array(0);
      const n = w.tts_stream_read(this.#handle, Math.max(0, Math.floor(Number(maxSamples) || 0)));
      if (n < 0) throw new Error(readJsonText());
      return copyF32(w.tts_samples_ptr, w.tts_samples_len);
    }

    get done() {
      return !this.#handle || w.tts_stream_done(this.#handle) !== 0;
    }

    get duration() {
      return this.#meta.duration;
    }

    get position() {
      return this.#handle ? w.tts_stream_position(this.#handle) : this.#meta.duration;
    }

    get sampleRate() {
      return this.#meta.sampleRate;
    }

    get text() {
      return this.#meta.text;
    }

    get ipa() {
      return this.#meta.ipa;
    }

    get words() {
      return this.#meta.words.map((x) => ({ ...x }));
    }

    get visemes() {
      return this.#visemes.slice();
    }

    free() {
      if (this.#handle) {
        if (streamRegistry) streamRegistry.unregister(this);
        w.tts_stream_drop(this.#handle);
        this.#handle = 0;
      }
    }
  }

  class TTS {
    #handle;

    constructor(options) {
      let ptr = 0;
      let len = 0;
      if (options !== undefined && options !== null) {
        [ptr, len] = writeUtf8(serializePayload(options));
      }
      const h = w.tts_new(ptr, len);
      if (h < 0) throw new Error(readJsonText());
      this.#handle = h;
      if (instRegistry) instRegistry.register(this, h, this);
    }

    #checkHandle() {
      if (!this.#handle) throw new Error("TTS instance has been freed");
      return this.#handle;
    }

    static presets() {
      return structuredClone(META.presets);
    }

    static vowelNames() {
      return META.vowelNames.slice();
    }

    static toneBandsHz() {
      return Float64Array.from(META.toneBandsHz);
    }

    static voiceIds() {
      return META.voiceIds.slice();
    }

    static styleNames() {
      return META.styleNames.slice();
    }

    static noteToHz(note) {
      const [ptr, len] = writeUtf8(String(note));
      const hz = w.tts_note_to_hz(ptr, len);
      if (hz < 0) throw new Error(readJsonText());
      return hz;
    }

    /**
     * Generates a brand-new, physically coherent voice profile object.
     * Any parameters passed in `options` (e.g. `{ gender: "female", speed: 1.1, seed: 42 }`)
     * are locked; all remaining voice parameters are randomized within natural human ranges.
     * Pass the returned object to `new TTS(profile)`, `voice.configure(profile)`, or
     * `voice.registerVoice("alice", profile)` to reuse it anywhere!
     */
    static randomVoice(options) {
      const seed =
        options && typeof options === "object" && Number.isFinite(options.seed)
          ? (Math.abs(Math.trunc(options.seed)) >>> 0)
          : nextSeed();
      let ptr = 0;
      let len = 0;
      if (options !== undefined && options !== null) {
        [ptr, len] = writeUtf8(serializePayload(options));
      }
      if (w.tts_random_voice(seed, ptr, len) < 0) {
        throw new Error(readJsonText());
      }
      return readJson();
    }

    configure(options) {
      const h = this.#checkHandle();
      if (options === undefined || options === null) return this.settings;
      const [ptr, len] = writeUtf8(serializePayload(options));
      if (w.tts_configure(h, ptr, len) < 0) {
        throw new Error(readJsonText());
      }
      return readJson();
    }

    /**
     * Randomizes this instance's voice while respecting any locked parameters in `options`
     * (e.g. `voice.randomize({ gender: "female", warmth: 0.7 })` or
     * `voice.randomize({ name: "alice", gender: "female" })` to also register `[alice]`).
     * Returns the resulting reusable `VoiceSettings` profile object.
     */
    randomize(options) {
      const h = this.#checkHandle();
      const seed =
        options && typeof options === "object" && Number.isFinite(options.seed)
          ? (Math.abs(Math.trunc(options.seed)) >>> 0)
          : nextSeed();
      let ptr = 0;
      let len = 0;
      if (options !== undefined && options !== null) {
        [ptr, len] = writeUtf8(serializePayload(options));
      }
      if (w.tts_randomize(h, seed, ptr, len) < 0) {
        throw new Error(readJsonText());
      }
      return readJson();
    }

    /**
     * Registers a named custom voice (e.g. from `TTS.randomVoice()` or custom settings) so it
     * can be referenced by `[name]` in `speakScript`, `sing`, `singChorus`, and `configure(name)`.
     */
    registerVoice(name, profile) {
      const h = this.#checkHandle();
      if (typeof name !== "string" || !name.trim()) {
        throw new Error("voice name must be a non-empty string");
      }
      const payload = serializePayload({
        name,
        voice: profile === undefined ? this.settings : profile,
      });
      const [ptr, len] = writeUtf8(payload);
      if (w.tts_register_voice(h, ptr, len) < 0) {
        throw new Error(readJsonText());
      }
      return readJson();
    }

    /** Returns a map `{ [name]: VoiceSettings }` of custom voices registered on this instance. */
    voices() {
      const h = this.#checkHandle();
      if (w.tts_list_voices(h) < 0) throw new Error(readJsonText());
      return readJson();
    }

    setGender(gender) {
      const h = this.#checkHandle();
      const [ptr, len] = writeUtf8(String(gender));
      if (w.tts_set_gender(h, ptr, len) < 0) {
        throw new Error(readJsonText());
      }
    }

    get gender() {
      return this.settings.gender;
    }

    get settings() {
      const h = this.#checkHandle();
      if (w.tts_get_settings(h) < 0) throw new Error(readJsonText());
      return readJson();
    }

    get sampleRate() {
      return META.sampleRate;
    }

    speak(text) {
      const h = this.#checkHandle();
      const [ptr, len] = writeUtf8(String(text));
      if (w.tts_speak(h, ptr, len) < 0) throw new Error(readJsonText());
      return buildSpeechObject();
    }

    speakWav(text) {
      const h = this.#checkHandle();
      const [ptr, len] = writeUtf8(String(text));
      if (w.tts_speak_wav(h, ptr, len) < 0) throw new Error(readJsonText());
      return copyBytes();
    }

    speakScript(script) {
      const h = this.#checkHandle();
      const payload =
        typeof script === "string"
          ? script
          : Array.isArray(script)
            ? serializePayload({ __cues: script })
            : null;
      if (payload === null) {
        throw new Error("speakScript expects a script string or an array of cue objects");
      }
      const [ptr, len] = writeUtf8(payload);
      if (w.tts_speak_script(h, ptr, len) < 0) throw new Error(readJsonText());
      return buildSpeechObject();
    }

    speakScriptWav(script) {
      const h = this.#checkHandle();
      const payload =
        typeof script === "string"
          ? script
          : Array.isArray(script)
            ? serializePayload({ __cues: script })
            : null;
      if (payload === null) {
        throw new Error("speakScriptWav expects a script string or an array of cue objects");
      }
      const [ptr, len] = writeUtf8(payload);
      if (w.tts_speak_script_wav(h, ptr, len) < 0) throw new Error(readJsonText());
      return copyBytes();
    }

    #packSingArgs(score, lyrics, bpm) {
      if (typeof score === "string") {
        if (lyrics === undefined && bpm === undefined) return score;
        const o = { notes: score };
        if (lyrics !== undefined && String(lyrics).trim() !== "") o.lyrics = String(lyrics);
        else {
          delete o.notes;
          o.score = score;
        }
        if (bpm !== undefined) o.bpm = bpm;
        return serializePayload(o);
      }
      if (score && typeof score === "object" && !Array.isArray(score)) {
        const merged = { ...score };
        if (lyrics !== undefined && merged.lyrics === undefined) merged.lyrics = lyrics;
        if (bpm !== undefined && merged.bpm === undefined) merged.bpm = bpm;
        return serializePayload(merged);
      }
      throw new Error("sing expects a score string or an options object { bpm, notes, lyrics, … }");
    }

    sing(score, lyrics, bpm) {
      const h = this.#checkHandle();
      const [ptr, len] = writeUtf8(this.#packSingArgs(score, lyrics, bpm));
      if (w.tts_sing(h, ptr, len) < 0) throw new Error(readJsonText());
      return buildSpeechObject();
    }

    singWav(score, lyrics, bpm) {
      const h = this.#checkHandle();
      const [ptr, len] = writeUtf8(this.#packSingArgs(score, lyrics, bpm));
      if (w.tts_sing_wav(h, ptr, len) < 0) throw new Error(readJsonText());
      return copyBytes();
    }

    #packChorusArg(chorus) {
      if (typeof chorus === "string") return chorus;
      if (Array.isArray(chorus)) return serializePayload({ parts: chorus });
      if (chorus && typeof chorus === "object") return serializePayload(chorus);
      throw new Error("singChorus expects a chorus score string or `{ bpm, parts: [...] }`");
    }

    singChorus(chorus) {
      const h = this.#checkHandle();
      const [ptr, len] = writeUtf8(this.#packChorusArg(chorus));
      if (w.tts_sing_chorus(h, ptr, len) < 0) throw new Error(readJsonText());
      return buildSpeechObject();
    }

    singChorusWav(chorus) {
      const h = this.#checkHandle();
      const [ptr, len] = writeUtf8(this.#packChorusArg(chorus));
      if (w.tts_sing_chorus_wav(h, ptr, len) < 0) throw new Error(readJsonText());
      return copyBytes();
    }

    /** Speaks `text` directly through Web Audio in the browser. */
    async play(text, audioContext) {
      const speech = /\[[a-zA-Z_/]/.test(String(text))
        ? this.speakScript(String(text))
        : this.speak(String(text));
      return playSpeechInBrowser(speech, audioContext);
    }

    /** Performs a multi-voice / inline-controlled script directly through Web Audio. */
    async playScript(script, audioContext) {
      return playSpeechInBrowser(this.speakScript(script), audioContext);
    }

    /** Sings a solo melody directly through Web Audio. */
    async playSong(score, lyrics, bpm, audioContext) {
      return playSpeechInBrowser(this.sing(score, lyrics, bpm), audioContext);
    }

    /** Sings a multi-voice chorus directly through Web Audio. */
    async playChorus(chorus, audioContext) {
      return playSpeechInBrowser(this.singChorus(chorus), audioContext);
    }

    stream(text) {
      const h = this.#checkHandle();
      const [ptr, len] = writeUtf8(String(text));
      const sh = w.tts_stream_new(h, ptr, len);
      if (sh < 0) throw new Error(readJsonText());
      const meta = readJson();
      const vis = copyF32(w.tts_visemes_ptr, w.tts_visemes_len);
      return new SpeechStream(sh, meta, vis);
    }

    phonemize(text) {
      const h = this.#checkHandle();
      const [ptr, len] = writeUtf8(String(text));
      if (w.tts_phonemize(h, ptr, len) < 0) throw new Error(readJsonText());
      return readJsonText();
    }

    arpabet(text) {
      const h = this.#checkHandle();
      const [ptr, len] = writeUtf8(String(text));
      if (w.tts_arpabet(h, ptr, len) < 0) throw new Error(readJsonText());
      return readJsonText();
    }

    normalize(text) {
      const h = this.#checkHandle();
      const [ptr, len] = writeUtf8(String(text));
      if (w.tts_normalize(h, ptr, len) < 0) throw new Error(readJsonText());
      return readJsonText();
    }

    addWord(word, phones) {
      const h = this.#checkHandle();
      const [ptr, len] = writeUtf8(`${word}\t${phones}`);
      if (w.tts_add_word(h, ptr, len) < 0) throw new Error(readJsonText());
    }

    loadDictionary(text) {
      const h = this.#checkHandle();
      const [ptr, len] = writeUtf8(String(text));
      const n = w.tts_load_dictionary(h, ptr, len);
      if (n < 0) throw new Error(readJsonText());
      return n;
    }

    free() {
      if (this.#handle) {
        if (instRegistry) instRegistry.unregister(this);
        w.tts_drop(this.#handle);
        this.#handle = 0;
      }
    }
  }

  function encodeWav(samples, sampleRate = META.sampleRate) {
    const arr = samples instanceof Float32Array ? samples : Float32Array.from(samples || []);
    const ptr = arr.length ? w.tts_alloc_f32(arr.length) : 0;
    if (arr.length) {
      new Float32Array(w.memory.buffer, ptr, arr.length).set(arr);
    }
    w.tts_encode_wav(ptr, arr.length, Math.max(1000, Math.floor(Number(sampleRate) || META.sampleRate)));
    return copyBytes();
  }

  return { TTS, SpeechStream, encodeWav };
}

  // --- 2. 2.5D SitePal-Style Avatar Renderer & 200 Hz Lip-Sync ---
// SitePal-inspired 2.5D Customizable Companion Renderer, Interactive Body/Face Sculptor,
// and 200 Hz Physical Vocal-Tract Lip-Sync Engine (powered by tts.wasm visemes & acoustics).
const SKIN_TONES = [
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
const HAIR_STYLES = [
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
const OUTFIT_STYLES = [
  { id: "blazer", label: "Concierge Blazer" },
  { id: "suit_tie", label: "Executive Suit & Tie" },
  { id: "sweater", label: "Studio Crewneck" },
  { id: "turtleneck", label: "Architect Turtleneck" },
  { id: "hoodie", label: "Startup Hoodie" },
  { id: "vest", label: "Support Vest & Shirt" },
  { id: "cyber", label: "Android Chassis" },
];
const GLASSES_STYLES = [
  { id: "none", label: "None" },
  { id: "classic", label: "Studio Frames" },
  { id: "round", label: "Round Wire" },
  { id: "bold", label: "Bold Horn-Rim" },
  { id: "shades", label: "Tinted Shades" },
  { id: "visor", label: "Holo Visor" },
];
const FACIAL_HAIR_STYLES = [
  { id: "none", label: "Clean-Shaven" },
  { id: "stubble", label: "Designer Stubble" },
  { id: "mustache", label: "Classic Mustache" },
  { id: "goatee", label: "Sculpted Goatee" },
  { id: "beard", label: "Full Tailored Beard" },
];
const POSTURE_STYLES = [
  { id: "welcoming", label: "Welcoming Host" },
  { id: "presenter", label: "Active Presenter" },
  { id: "relaxed", label: "Calm & Poised" },
  { id: "confident", label: "Executive Fold" },
];
const DEFAULT_AVATAR = {
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
const AVATAR_PRESETS = [
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
function createAnimState() {
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
function triggerAvatarEmote(anim, emoteName, durationMs = 2200, nowMs = performance.now()) {
  if (!anim || !emoteName) return;
  anim.emote = String(emoteName).toLowerCase();
  anim.emoteUntilMs = nowMs + durationMs;
}

/**
 * Samples `tts.wasm` 200 Hz articulatory `visemes` + `acoustics` + `phones` + `words`
 * with linear sub-frame interpolation (exact same physics model as `tts/demo/app.js`).
 */
function sampleSpeechAt(speech, tSec, fallbackPitch = 150) {
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
function stepAvatarPhysics(anim, nowMs, sampledSpeech, pointer = null, basePitch = 160) {
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
function computeAvatarTransform(w, h, avatar) {
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
function getSculptHandles(w, h, avatar) {
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
function hitTestSculptHandle(handles, px, py, hitRadius = 22) {
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
function drawBotAvatar(ctx, w, h, rawAvatar, anim, nowMs = performance.now(), options = {}) {
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


  // --- 3. AIML 1.0 / 2.0 XML Pattern-Matching Chatbot Engine ---
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
function decodeXmlEntities(str) {
  return String(str).replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (full, ent) => {
    if (ent[0] === "#") {
      const code = ent[1].toLowerCase() === "x" ? parseInt(ent.slice(2), 16) : parseInt(ent.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : full;
    }
    return Object.prototype.hasOwnProperty.call(XML_ENTITIES, ent) ? XML_ENTITIES[ent] : full;
  });
}
function escapeXml(str) {
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
function parseXmlDocument(xmlSource) {
  const src = String(xmlSource || "");
  const root = { type: "element", tag: "__root__", attrs: {}, children: [] };
  const stack = [root];
  let pos = 0;

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
      line: lineNumberAt(src, lt),
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

const CONTRACTIONS = [
  [/\bwhat's\b/gi, "what is"],
  [/\bwho's\b/gi, "who is"],
  [/\bwhere's\b/gi, "where is"],
  [/\bhow's\b/gi, "how is"],
  [/\bit's\b/gi, "it is"],
  [/\bthat's\b/gi, "that is"],
  [/\bthere's\b/gi, "there is"],
  [/\bi'm\b/gi, "i am"],
  [/\byou're\b/gi, "you are"],
  [/\bwe're\b/gi, "we are"],
  [/\bthey're\b/gi, "they are"],
  [/\bi've\b/gi, "i have"],
  [/\bi'll\b/gi, "i will"],
  [/\bi'd\b/gi, "i would"],
  [/\bcan't\b/gi, "cannot"],
  [/\bwon't\b/gi, "will not"],
  [/\bdon't\b/gi, "do not"],
  [/\bdoesn't\b/gi, "does not"],
  [/\bdidn't\b/gi, "did not"],
  [/\bisn't\b/gi, "is not"],
  [/\baren't\b/gi, "are not"],
  [/\blet's\b/gi, "let us"],
];
function normalizeAimlInput(text, isPattern = false) {
  let s = String(text || "").trim();
  for (const [re, rep] of CONTRACTIONS) {
    s = s.replace(re, rep);
  }
  if (isPattern) {
    // Keep AIML wildcards (* _ # ^ $) and alphanumeric words
    s = s
      .toUpperCase()
      .replace(/[^A-Z0-9*_^#$ ]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  } else {
    s = s
      .toUpperCase()
      .replace(/[^A-Z0-9 ]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  return s;
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

/** Strips inline TTS control brackets like `[cheerful, speed=1.1]` for clean visual chat display. */
function stripSpeechTags(text) {
  return String(text || "")
    .replace(/\[sing[^\]]*\]([\s\S]*?)\[\/sing\]/gi, (_m, score) => {
      // Extract lyrics from `Note:Beats=Lyric` tokens when displaying sung phrases in chat
      const lyrics = [];
      for (const tok of score.split(/\s+/)) {
        const eq = tok.indexOf("=");
        if (eq > 0) {
          const lyr = tok.slice(eq + 1).replace(/~/g, "").replace(/-$/, "");
          if (lyr) lyrics.push(lyr);
        }
      }
      return lyrics.length ? `♪ ${lyrics.join(" ")} ♪` : "♪ (singing) ♪";
    })
    .replace(/\[[a-zA-Z_/][^\]]*\]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
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

function getPlainText(node) {
  if (!node) return "";
  if (node.type === "text") return node.value;
  return (node.children || []).map(getPlainText).join("");
}

/**
 * Matches token array `words` against AIML `patTokens`, returning an array of captured wildcard
 * strings or `null` if no match. Respects AIML wildcard arity (`_` / `*` = 1+, `#` / `^` = 0+).
 */
function matchTokens(patTokens, words, pIdx = 0, wIdx = 0, captures = []) {
  if (pIdx === patTokens.length && wIdx === words.length) {
    return captures;
  }
  if (pIdx >= patTokens.length) return null;

  const tok = patTokens[pIdx];
  if (tok === "#" || tok === "^") {
    // 0 or more words: '#' is greedy/early, '^' prefers shorter capture first
    if (tok === "#") {
      for (let end = wIdx; end <= words.length; end++) {
        const cap = words.slice(wIdx, end).join(" ");
        const res = matchTokens(patTokens, words, pIdx + 1, end, [...captures, cap]);
        if (res) return res;
      }
    } else {
      for (let end = wIdx; end <= words.length; end++) {
        const cap = words.slice(wIdx, end).join(" ");
        const res = matchTokens(patTokens, words, pIdx + 1, end, [...captures, cap]);
        if (res) return res;
      }
    }
    return null;
  }

  if (tok === "_" || tok === "*") {
    // 1 or more words
    if (wIdx >= words.length) return null;
    for (let end = wIdx + 1; end <= words.length; end++) {
      const cap = words.slice(wIdx, end).join(" ");
      const res = matchTokens(patTokens, words, pIdx + 1, end, [...captures, cap]);
      if (res) return res;
    }
    return null;
  }

  if (wIdx >= words.length) return null;
  const cleanTok = tok.startsWith("$") ? tok.slice(1) : tok;
  if (cleanTok === words[wIdx]) {
    return matchTokens(patTokens, words, pIdx + 1, wIdx + 1, captures);
  }
  return null;
}

/**
 * Computes deterministic AIML 2.0 priority score for a pattern so specific rules always beat `*`.
 * Priority per token: `$WORD` (6) > `#` (5) > `_` (4) > `WORD` (3) > `^` (2) > `*` (1).
 */
function scoreCategory(cat) {
  let patternScore = 0;
  for (const tok of cat.patTokens) {
    if (tok.startsWith("$")) patternScore = patternScore * 8 + 6;
    else if (tok === "#") patternScore = patternScore * 8 + 5;
    else if (tok === "_") patternScore = patternScore * 8 + 4;
    else if (tok === "^") patternScore = patternScore * 8 + 2;
    else if (tok === "*") patternScore = patternScore * 8 + 1;
    else patternScore = patternScore * 8 + 3;
  }
  const exactWordCount = cat.patTokens.filter((t) => !["*", "_", "#", "^"].includes(t)).length;
  const topicBonus = cat.topic !== "*" ? 1e12 : 0;
  const thatBonus = cat.that !== "*" ? 1e9 : 0;
  return topicBonus + thatBonus + exactWordCount * 1e6 + patternScore;
}
class AIMLEngine {
  constructor(options = {}) {
    this.botProps = {
      name: "Aria",
      role: "Website Companion",
      company: "bot.computer",
      website: "https://bot.computer",
      ...(options.botProps || {}),
    };
    this.vars = new Map([["topic", "*"]]);
    this.categories = [];
    this.quickChips = [];
    this.lastBotThat = "";
    this.history = [];
    this._randomMemory = new WeakMap();
    if (options.xml) {
      this.loadXML(options.xml);
    }
  }

  setBotProps(props) {
    Object.assign(this.botProps, props || {});
  }

  resetSession() {
    this.vars.clear();
    this.vars.set("topic", "*");
    this.lastBotThat = "";
    this.history = [];
  }

  loadXML(xmlString) {
    const doc = parseXmlDocument(xmlString);
    const aimlNode =
      doc.children.find((n) => n.type === "element" && n.tag === "aiml") || doc;

    const categories = [];
    const quickChips = [];
    const xmlBotProps = {};

    const extractCategory = (catNode, topicPattern = "*") => {
      let patternNodes = [];
      let thatNode = null;
      let templateNode = null;

      for (const child of catNode.children || []) {
        if (child.type !== "element") continue;
        if (child.tag === "pattern") patternNodes.push(child);
        else if (child.tag === "that") thatNode = child;
        else if (child.tag === "template") templateNode = child;
      }

      if (!patternNodes.length || !templateNode) return;
      const thatNorm = thatNode ? normalizeAimlInput(getPlainText(thatNode), true) || "*" : "*";
      const thatTokens = thatNorm.split(" ").filter(Boolean);
      const topicNorm = normalizeAimlInput(topicPattern, true) || "*";
      const topicTokens = topicNorm.split(" ").filter(Boolean);

      for (const pNode of patternNodes) {
        // Support pipe-separated convenience patterns `HELLO | HI | HEY` as well as standard AIML
        const rawPat = getPlainText(pNode);
        const variants = rawPat.includes("|") ? rawPat.split("|") : [rawPat];
        for (const v of variants) {
          const patNorm = normalizeAimlInput(v, true);
          if (!patNorm) continue;
          const patTokens = patNorm.split(" ").filter(Boolean);
          const entry = {
            pattern: patNorm,
            patTokens,
            that: thatNorm,
            thatTokens,
            topic: topicNorm,
            topicTokens,
            template: templateNode,
            line: catNode.line || 1,
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

    // Sort highest specificity first
    categories.sort((a, b) => b.score - a.score);

    this.categories = categories;
    this.quickChips = quickChips;
    this.xmlBotProps = xmlBotProps;
    return {
      valid: true,
      categories: categories.length,
      quickChips,
      botProps: { ...xmlBotProps, ...this.botProps },
    };
  }

  findMatch(inputText) {
    const norm = normalizeAimlInput(inputText, false);
    const words = norm ? norm.split(" ") : [];
    if (!words.length) return null;

    const activeTopic = normalizeAimlInput(this.vars.get("topic") || "*", false) || "*";
    const activeTopicWords = activeTopic === "*" ? ["*"] : activeTopic.split(" ");
    const lastThatNorm = normalizeAimlInput(this.lastBotThat || "", false);
    const lastThatWords = lastThatNorm ? lastThatNorm.split(" ") : [];

    for (const cat of this.categories) {
      let topicStars = [];
      if (cat.topic !== "*") {
        if (activeTopic === "*") continue;
        const ts = matchTokens(cat.topicTokens, activeTopicWords);
        if (!ts) continue;
        topicStars = ts;
      }

      let thatStars = [];
      if (cat.that !== "*") {
        if (!lastThatWords.length) continue;
        const ths = matchTokens(cat.thatTokens, lastThatWords);
        if (!ths) continue;
        thatStars = ths;
      }

      const stars = matchTokens(cat.patTokens, words);
      if (stars) {
        return { category: cat, stars, thatStars, topicStars };
      }
    }
    return null;
  }

  reply(userInput) {
    const rawInput = String(userInput || "").trim();
    if (!rawInput) {
      return {
        speechText: "",
        displayText: "",
        chips: this.quickChips.slice(0, 4),
        emote: null,
        matchedPattern: null,
      };
    }

    const sideEffects = { chips: [], emote: null };
    const speechRaw = this.#respondInternal(rawInput, 0, sideEffects).trim();
    const fallback =
      speechRaw ||
      `I'm not sure about that yet, but I'm happy to help with questions about ${this.botProps.company || "our site"}!`;
    const displayText = stripSpeechTags(fallback);
    const sentences = splitSentences(displayText);
    this.lastBotThat = sentences[sentences.length - 1] || displayText;
    this.history.push({ user: rawInput, bot: displayText });

    return {
      speechText: fallback,
      displayText,
      chips: sideEffects.chips.length ? sideEffects.chips : [],
      emote: sideEffects.emote,
      matchedPattern: sideEffects.matchedPattern || null,
    };
  }

  #respondInternal(inputText, depth, sideEffects) {
    if (depth > 22) return "";
    const hit = this.findMatch(inputText);
    if (!hit) return "";
    if (depth === 0) {
      sideEffects.matchedPattern = hit.category.pattern;
    }
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
        return (ctx.stars[idx] || "").toLowerCase();
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
        const key = (attrs.name || "").toLowerCase();
        const val = this.vars.get(key);
        return val !== undefined && val !== "" ? val : (attrs.default ?? "");
      }
      case "set": {
        const key = (attrs.name || "").toLowerCase();
        const val = this.#evalChildren(node.children, ctx).trim();
        if (key) this.vars.set(key, val);
        return val;
      }
      case "think": {
        this.#evalChildren(node.children, ctx);
        return "";
      }
      case "srai": {
        const target = this.#evalChildren(node.children, ctx).trim();
        return target ? this.#respondInternal(target, ctx.depth + 1, ctx.sideEffects) : "";
      }
      case "sr": {
        const firstStar = ctx.stars[0] || "";
        return firstStar ? this.#respondInternal(firstStar, ctx.depth + 1, ctx.sideEffects) : "";
      }
      case "random": {
        const items = (node.children || []).filter((c) => c.type === "element" && c.tag === "li");
        if (!items.length) return "";
        const lastIdx = this._randomMemory.get(node);
        let idx = Math.floor(Math.random() * items.length);
        if (items.length > 1 && idx === lastIdx) {
          idx = (idx + 1) % items.length;
        }
        this._randomMemory.set(node, idx);
        return this.#evalChildren(items[idx].children, ctx).trim();
      }
      case "condition": {
        const varName = (attrs.name || "").toLowerCase();
        const curVal = (this.vars.get(varName) || "").trim().toLowerCase();
        if (attrs.value !== undefined) {
          return curVal === attrs.value.trim().toLowerCase()
            ? this.#evalChildren(node.children, ctx)
            : "";
        }
        const branches = (node.children || []).filter((c) => c.type === "element" && c.tag === "li");
        for (const li of branches) {
          const checkName = (li.attrs.name || varName).toLowerCase();
          const actual = (this.vars.get(checkName) || "").trim().toLowerCase();
          if (li.attrs.value === undefined) {
            return this.#evalChildren(li.children, ctx);
          }
          if (actual === li.attrs.value.trim().toLowerCase()) {
            return this.#evalChildren(li.children, ctx);
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
      case "date":
        return new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
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
      case "br":
        return "\n";
      case "emote":
      case "gesture": {
        const g = this.#evalChildren(node.children, ctx).trim().toLowerCase();
        if (g) ctx.sideEffects.emote = g;
        return "";
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

/** Validates AIML XML and returns summary metadata for the Studio UI. */
function inspectAimlXml(xmlString, botProps = {}) {
  try {
    const engine = new AIMLEngine({ botProps });
    const res = engine.loadXML(xmlString);
    const rules = engine.categories.slice(0, 60).map((c) => ({
      pattern: c.pattern,
      that: c.that,
      topic: c.topic,
      preview: stripSpeechTags(getPlainText(c.template)).replace(/\s+/g, " ").trim().slice(0, 110),
      line: c.line,
    }));
    return {
      valid: true,
      categories: res.categories,
      quickChips: res.quickChips,
      rules,
    };
  } catch (err) {
    return {
      valid: false,
      error: err.message || String(err),
      categories: 0,
      quickChips: [],
      rules: [],
    };
  }
}

/** Appends a new `<category>` rule cleanly before `</aiml>` in an AIML XML document. */
function appendAimlRule(xmlString, { pattern, answer, chips = [], emote = "" }) {
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
  const emoteXml = emote ? `<emote>${escapeXml(emote)}</emote>` : "";
  const block = [
    `  <category>`,
    `    <pattern>${escapeXml(cleanPattern)}</pattern>`,
    `    <template>${emoteXml}${escapeXml(answer.trim())}${chipXml}</template>`,
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
// ============================================================================
const STARTER_AIML_PACKS = {
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

  <category><pattern>HI</pattern><template><srai>HELLO</srai></template></category>
  <category><pattern>HEY</pattern><template><srai>HELLO</srai></template></category>
  <category><pattern>HI *</pattern><template><srai>HELLO</srai></template></category>
  <category><pattern>HEY *</pattern><template><srai>HELLO</srai></template></category>
  <category><pattern>GOOD MORNING</pattern><template><srai>HELLO</srai></template></category>
  <category><pattern>GOOD AFTERNOON</pattern><template><srai>HELLO</srai></template></category>

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
      I greet visitors out loud, track your cursor across the page, answer questions instantly via AIML pattern matching, and embed onto any website as a single self-contained JavaScript file!
      <reply>Pricing &amp; Plans</reply>
      <reply>Self-contained embed</reply>
      <reply>Sing me a song!</reply>
    </template>
  </category>
  <category><pattern># FEATURES #</pattern><template><srai>WHAT CAN YOU DO</srai></template></category>

  <category>
    <pattern># PRICING #</pattern>
    <template>
      [calm] Because <bot name="company"/> runs directly in the visitor's browser with WebAssembly synthesis, there are zero per-minute voice API bills! You can self-host your companion completely free.
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
      My voice comes from a physical model of the human larynx and vocal tract in Rust and WebAssembly. Every 5 milliseconds it outputs exact jaw, tongue, and lip positions at 200 frames per second!
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
      You're experiencing the live demo right now! Try sculpting my shoulders and face in the Designer, or edit my XML brain in the Chat Bot tab.
    </template>
  </category>

  <category>
    <pattern># SING #</pattern>
    <template>
      <emote>happy</emote>
      [cheerful] Clearing my vocal folds! [sing bpm=112] C4:1=Wel- E4:1=come G4:1.5=to E4:0.5=the | F4:1=fu- A4:1=ture G4:2=web! [/sing] [happy] How was my pitch?
      <reply>That was awesome!</reply>
      <reply>Tell me a joke</reply>
    </template>
  </category>

  <category>
    <pattern># JOKE #</pattern>
    <template>
      <emote>wink</emote>
      [cheerful] Why did the WebAssembly avatar never lose its voice? [pause=280ms] Because its vocal folds are compiled in release mode!
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
  <category><pattern># AWESOME #</pattern><template><emote>happy</emote>[excited] Thank you so much! Having physical vocal folds makes all the difference!</template></category>

  <category>
    <pattern>*</pattern>
    <template>
      <emote>think</emote>
      <random>
        <li>That's a great question about "<star/>"! Try asking me about features, pricing, lip-sync, or how to embed me on your site.</li>
        <li>Hmm, I don't have a specific pattern for "<star/>" in my AIML XML yet — you can add one in seconds in the Chat Bot tab!</li>
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
  <category><pattern>HI #</pattern><template><srai>HELLO</srai></template></category>
  <category><pattern>HEY #</pattern><template><srai>HELLO</srai></template></category>

  <category>
    <pattern># SHIPPING #</pattern>
    <template>
      Orders ship within 24 hours! Standard delivery takes 3 to 5 business days, and orders over $50 ship completely free.
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
  <category><pattern>HI #</pattern><template><srai>HELLO</srai></template></category>

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
  <category><pattern>HI #</pattern><template><srai>HELLO</srai></template></category>

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


  // --- 4. Shadow DOM Companion Widget ---
// Embeddable Website Companion Widget Core for bot.computer.
// Supports both ES module import inside the studio preview AND standalone bundling into `embed/bot-embed.js`
// (including 100% self-contained single-file downloads with gzipped base64 `tts.wasm` baked inside).


async function gunzipBytes(compressedBytes) {
  if (typeof DecompressionStream === "function") {
    const ds = new DecompressionStream("gzip");
    const writer = ds.writable.getWriter();
    writer.write(compressedBytes);
    writer.close();
    const resp = new Response(ds.readable);
    return new Uint8Array(await resp.arrayBuffer());
  }
  throw new Error("This browser does not support DecompressionStream('gzip'); use external wasmUrl mode.");
}

function decodeBase64ToBytes(b64) {
  const clean = String(b64).replace(/\s+/g, "");
  const bin = atob(clean);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

let cachedTtsBindingPromise = new Map();

/**
 * Loads `tts.wasm` from either:
 *  1) In-memory `wasmBytes` / `embeddedWasmGzBase64` (100% self-contained offline mode!), or
 *  2) Fetch URL `wasmUrl`.
 * Uses `bindTTSFn` if bundled (CSP-safe, zero `new Function`), falling back to `tts.wasm`'s internal glue.
 */
async function loadTtsEngine({ wasmUrl, wasmBytes, embeddedWasmGzBase64, bindTTSFn } = {}) {
  const cacheKey = embeddedWasmGzBase64
    ? "__embedded_gz__"
    : wasmBytes
      ? "__raw_bytes__"
      : String(wasmUrl || "./tts.wasm");

  if (cachedTtsBindingPromise.has(cacheKey)) {
    return cachedTtsBindingPromise.get(cacheKey);
  }

  const promise = (async () => {
    let instance;
    if (wasmBytes) {
      ({ instance } = await WebAssembly.instantiate(wasmBytes, {}));
    } else if (embeddedWasmGzBase64) {
      const gz = decodeBase64ToBytes(embeddedWasmGzBase64);
      const raw = await gunzipBytes(gz);
      ({ instance } = await WebAssembly.instantiate(raw, {}));
    } else {
      const url = wasmUrl || "./tts.wasm";
      if (typeof WebAssembly.instantiateStreaming === "function") {
        try {
          ({ instance } = await WebAssembly.instantiateStreaming(fetch(url), {}));
        } catch {
          const r = await fetch(url);
          if (!r.ok) throw new Error(`Failed to load tts.wasm from ${url} (${r.status})`);
          ({ instance } = await WebAssembly.instantiate(await r.arrayBuffer(), {}));
        }
      } else {
        const r = await fetch(url);
        if (!r.ok) throw new Error(`Failed to load tts.wasm from ${url} (${r.status})`);
        ({ instance } = await WebAssembly.instantiate(await r.arrayBuffer(), {}));
      }
    }

    const w = instance.exports;
    if (typeof bindTTSFn === "function") {
      return bindTTSFn(w);
    }
    const glueCode = new TextDecoder().decode(
      new Uint8Array(w.memory.buffer, w.tts_glue_ptr(), w.tts_glue_len())
    );
    return Function("wasm", glueCode)(w);
  })();

  cachedTtsBindingPromise.set(cacheKey, promise);
  return promise;
}

const WIDGET_CSS = `
:host {
  all: initial;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
  color: #181715;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}
*, *::before, *::after {
  box-sizing: border-box;
}
.bc-ic {
  width: 15px;
  height: 15px;
  flex: none;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.bc-ic.solid {
  fill: currentColor;
  stroke: none;
}
button:focus-visible,
.bc-stage-card:focus-visible {
  outline: 2px solid #6aa6ff;
  outline-offset: 2px;
}
.bc-root {
  position: fixed;
  z-index: 2147483000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  pointer-events: none;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
.bc-root.pos-bottom-right {
  right: 20px;
  bottom: 20px;
  align-items: flex-end;
}
.bc-root.pos-bottom-left {
  left: 20px;
  bottom: 20px;
  align-items: flex-start;
}
.bc-root.pos-inline,
.bc-root.pos-contained {
  position: relative;
  right: auto;
  left: auto;
  bottom: auto;
  z-index: 20;
  align-items: center;
}
.bc-root.pos-contained {
  position: absolute;
  right: 16px;
  bottom: 16px;
  align-items: flex-end;
}
.bc-root.pos-contained.pos-bottom-left {
  left: 16px;
  right: auto;
  align-items: flex-start;
}

/* Companion Row: Chat Drawer + Avatar Stage side by side on desktop */
.bc-companion-row {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  max-width: calc(100vw - 28px);
}
.pos-bottom-left .bc-companion-row {
  flex-direction: row-reverse;
}

/* Avatar Stage */
.bc-stage-wrap {
  position: relative;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}
.bc-stage-card {
  position: relative;
  width: var(--bc-w, 168px);
  height: var(--bc-h, 204px);
  cursor: pointer;
  user-select: none;
  filter: drop-shadow(0 12px 26px rgba(10, 14, 26, 0.3));
  border-radius: 20px;
  transition: width 0.24s ease, height 0.24s ease, transform 0.18s ease;
}
.bc-stage-card:hover {
  transform: translateY(-2px);
}
.bc-stage-card.shape-circle {
  width: var(--bc-orb, 152px);
  height: var(--bc-orb, 152px);
  border-radius: 50%;
}
.bc-stage-card canvas {
  width: 100%;
  height: 100%;
  display: block;
}

/* Minimized Pill */
.bc-minimized-pill {
  pointer-events: auto;
  display: none;
  align-items: center;
  gap: 9px;
  padding: 8px 14px 8px 10px;
  border-radius: 999px;
  background: #0d1322;
  color: #f4f7ff;
  border: 1px solid rgba(255,255,255,0.14);
  box-shadow: 0 8px 24px rgba(0,0,0,0.28);
  cursor: pointer;
  font: inherit;
  font-size: 13.5px;
  font-weight: 600;
}
.bc-root.is-minimized .bc-companion-row {
  display: none;
}
.bc-root.is-minimized .bc-minimized-pill {
  display: inline-flex;
}
.bc-pill-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #34d6bf;
  box-shadow: 0 0 0 3px rgba(52, 214, 191, 0.24);
}

/* Floating Speech Caption Bubble */
.bc-caption {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  max-width: 260px;
  padding: 9px 12px;
  border-radius: 13px;
  background: rgba(13, 19, 34, 0.95);
  color: rgba(244, 247, 255, 0.72);
  font-size: 12.8px;
  line-height: 1.42;
  box-shadow: 0 8px 22px rgba(0,0,0,0.24);
  border: 1px solid rgba(255,255,255,0.12);
  pointer-events: auto;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.pos-bottom-left .bc-caption {
  right: auto;
  left: 0;
}
.bc-caption.visible {
  opacity: 1;
  transform: translateY(0);
}
.bc-caption .said {
  color: #f4f7ff;
}
.bc-caption mark {
  background: #b83353;
  color: #ffffff;
  padding: 0 3px;
  border-radius: 4px;
}

/* Tap-to-Speak Prompt Badge */
.bc-unmute-prompt {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  padding: 4px 10px;
  border-radius: 999px;
  background: #1a5fe6;
  color: #ffffff;
  font-size: 11.5px;
  font-weight: 650;
  box-shadow: 0 4px 12px rgba(26, 95, 230, 0.45);
  animation: bcPulse 2s infinite;
  pointer-events: none;
}
@keyframes bcPulse {
  0%, 100% { transform: translateX(-50%) scale(1); }
  50% { transform: translateX(-50%) scale(1.05); }
}

/* Stage Mini Controls Dock */
.bc-controls {
  margin-top: 6px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 4px;
  border-radius: 999px;
  background: rgba(13, 19, 34, 0.92);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 4px 14px rgba(0,0,0,0.22);
}
.bc-btn {
  appearance: none;
  border: none;
  background: transparent;
  color: #dbe3f4;
  min-width: 30px;
  height: 30px;
  padding: 0 9px;
  border-radius: 999px;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: background 0.14s ease, color 0.14s ease;
}
.bc-btn:hover {
  background: rgba(255,255,255,0.14);
  color: #ffffff;
}
.bc-btn.accent {
  background: #1a5fe6;
  color: #ffffff;
}
.bc-btn.accent:hover {
  background: #2f71f0;
}

/* AIML Q&A Chat Panel */
.bc-chat {
  pointer-events: auto;
  width: 332px;
  max-width: calc(100vw - 28px);
  max-height: min(460px, 72dvh);
  display: none;
  flex-direction: column;
  background: #ffffff;
  color: #0d1322;
  border-radius: 18px;
  border: 1px solid rgba(13, 19, 34, 0.12);
  box-shadow: 0 18px 44px -10px rgba(13, 19, 34, 0.34);
  overflow: hidden;
}
.bc-chat.open {
  display: flex;
  animation: bcChatIn 0.2s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes bcChatIn {
  from { opacity: 0; transform: translateY(8px) scale(0.98); }
}
.bc-chat-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 11px 12px 11px 14px;
  background: #0d1322;
  color: #f4f7ff;
}
.bc-chat-title {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.bc-chat-title strong {
  font-size: 13.5px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bc-chat-title span {
  font-size: 11.5px;
  color: #8fa0c2;
}
.bc-chat-close {
  appearance: none;
  border: none;
  background: rgba(255,255,255,0.1);
  color: #cbd5e1;
  width: 28px;
  height: 28px;
  flex: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 15px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.bc-chat-close:hover {
  background: rgba(255,255,255,0.2);
  color: #ffffff;
}
.bc-chat-head,
.bc-chips,
.bc-form {
  flex: none;
}
.bc-messages {
  /* The log is the only part that shrinks, so the input row is never clipped in short layouts. */
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #f3f5f9;
  min-height: 84px;
}
.bc-msg {
  max-width: 86%;
  padding: 8.5px 12px;
  border-radius: 13px;
  font-size: 13.2px;
  line-height: 1.45;
  overflow-wrap: anywhere;
}
.bc-msg.bot {
  align-self: flex-start;
  background: #ffffff;
  color: #0d1322;
  border: 1px solid #dbe1ec;
  border-bottom-left-radius: 4px;
}
.bc-msg.user {
  align-self: flex-end;
  background: #1a5fe6;
  color: #ffffff;
  border-bottom-right-radius: 4px;
}
.bc-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding: 7px 10px;
  background: #f3f5f9;
  border-top: 1px solid #e3e8f0;
}
.bc-chips:empty {
  display: none;
}
.bc-chip {
  appearance: none;
  border: 1px solid #c8d0df;
  background: #ffffff;
  color: #2a3348;
  padding: 4px 10px;
  border-radius: 999px;
  font: inherit;
  font-size: 11.8px;
  font-weight: 550;
  cursor: pointer;
  transition: background 0.12s ease, border-color 0.12s ease;
}
.bc-chip:hover {
  background: #edf3ff;
  border-color: #1a5fe6;
  color: #1a5fe6;
}
.bc-form {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  background: #ffffff;
  border-top: 1px solid #e3e8f0;
}
.bc-input {
  flex: 1;
  min-width: 0;
  border: 1px solid #c8d0df;
  border-radius: 999px;
  padding: 8px 13px;
  font: inherit;
  font-size: 16px; /* stops iOS Safari zooming the page on focus */
  background: #f7f9fc;
  color: #0d1322;
  outline: none;
}
.bc-input:focus {
  border-color: #1a5fe6;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(26, 95, 230, 0.16);
}
.bc-send {
  appearance: none;
  border: none;
  background: #1a5fe6;
  color: #ffffff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.bc-send:hover {
  background: #124bc0;
}
.bc-send .bc-ic {
  width: 17px;
  height: 17px;
}

/* Mobile Responsive Layout (Viewport <= 640px OR Narrow Preview Container): Keep Speaking Avatar Visible Above Chat! */
.bc-root.is-narrow-host.pos-contained {
  right: 10px;
  left: 10px;
  bottom: 10px;
  align-items: flex-end;
}
.bc-root.is-narrow-host .bc-companion-row {
  flex-direction: column-reverse;
  align-items: flex-end;
  gap: 8px;
  width: 100%;
}
.bc-root.is-narrow-host.pos-bottom-left .bc-companion-row {
  flex-direction: column-reverse;
  align-items: flex-start;
}
.bc-root.is-narrow-host .bc-stage-card {
  width: 114px;
  height: 138px;
}
.bc-root.is-narrow-host .bc-stage-card.shape-circle {
  width: 108px;
  height: 108px;
}
.bc-root.is-narrow-host.chat-is-open .bc-stage-card {
  width: 88px;
  height: 104px;
}
.bc-root.is-narrow-host.chat-is-open .bc-stage-card.shape-circle {
  width: 84px;
  height: 84px;
}
.bc-root.is-narrow-host .bc-chat {
  width: 100%;
  max-width: 100%;
  max-height: 340px;
}
.bc-root.is-narrow-host .bc-btn {
  min-height: 34px;
  padding: 0 10px;
}

@media (max-width: 640px) {
  .bc-root.pos-bottom-right,
  .bc-root.pos-bottom-left,
  .bc-root.pos-contained {
    right: 10px;
    left: 10px;
    bottom: 10px;
    align-items: flex-end;
  }
  .bc-companion-row {
    flex-direction: column-reverse;
    align-items: flex-end;
    gap: 8px;
    width: 100%;
  }
  .pos-bottom-left .bc-companion-row {
    flex-direction: column-reverse;
    align-items: flex-start;
  }
  .bc-stage-card {
    width: 116px;
    height: 140px;
  }
  .bc-stage-card.shape-circle {
    width: 110px;
    height: 110px;
  }
  .bc-root.chat-is-open .bc-stage-card {
    width: 88px;
    height: 104px;
  }
  .bc-root.chat-is-open .bc-stage-card.shape-circle {
    width: 84px;
    height: 84px;
  }
  .bc-chat {
    width: 100%;
    max-width: 100%;
    max-height: 52dvh;
  }
  .bc-btn {
    min-height: 34px;
    padding: 0 10px;
  }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
  }
}
`;

// Inline line icons (a Shadow DOM widget can't reference the host page's icon sprite).
const ICONS = {
  play: '<svg class="bc-ic solid" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 4.8v14.4a.6.6 0 0 0 .92.5l11.3-7.2a.6.6 0 0 0 0-1L8.42 4.3a.6.6 0 0 0-.92.5z"/></svg>',
  stop: '<svg class="bc-ic solid" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2.2"/></svg>',
  chat: '<svg class="bc-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>',
  volume: '<svg class="bc-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.8 5.2a9.5 9.5 0 0 1 0 13.6"/></svg>',
  muted: '<svg class="bc-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="m22 9-6 6"/><path d="m16 9 6 6"/></svg>',
  minus: '<svg class="bc-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  close: '<svg class="bc-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  send: '<svg class="bc-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5"/><path d="m6 11 6-6 6 6"/></svg>',
};

const SIZE_MAP = {
  compact: { w: 136, h: 166, orb: 126 },
  standard: { w: 172, h: 210, orb: 158 },
  large: { w: 216, h: 262, orb: 196 },
};
async function mountBotWidget(userConfig = {}, internalOpts = {}) {
  const config = {
    name: "Aria",
    role: "Website Companion",
    company: "bot.computer",
    website: typeof location !== "undefined" ? location.origin : "https://bot.computer",
    greeting: "Hi! Welcome to our website! Ask me anything below.",
    position: "bottom-right", // "bottom-right" | "bottom-left" | "inline" | "contained"
    size: "standard", // "compact" | "standard" | "large"
    autoGreet: false,
    eyeTracking: true,
    showCaptions: true,
    chatEnabled: true,
    chatStartOpen: false,
    wasmUrl: "./tts.wasm",
    aimlUrl: "",
    aimlXml: STARTER_AIML_PACKS.concierge.xml,
    voice: { gender: "female", pitchHz: 192, speed: 1.05, expressiveness: 1.06 },
    avatar: { ...DEFAULT_AVATAR },
    ...userConfig,
  };
  config.avatar = { ...DEFAULT_AVATAR, ...(userConfig.avatar || {}) };

  // Create host container & Shadow DOM
  const hostEl = document.createElement("div");
  hostEl.className = "bot-computer-widget-host";
  let parentTarget = document.body;
  if ((config.position === "inline" || config.position === "contained") && config.container) {
    const found =
      typeof config.container === "string"
        ? document.querySelector(config.container)
        : config.container;
    if (found) parentTarget = found;
  }
  parentTarget.appendChild(hostEl);

  const shadow = hostEl.attachShadow({ mode: "open" });
  const styleEl = document.createElement("style");
  styleEl.textContent = WIDGET_CSS;
  shadow.appendChild(styleEl);

  const dims = SIZE_MAP[config.size] || SIZE_MAP.standard;
  const posClass =
    config.position === "bottom-left"
      ? "pos-bottom-left"
      : config.position === "inline"
        ? "pos-inline"
        : config.position === "contained"
          ? `pos-contained ${config.align === "left" ? "pos-bottom-left" : ""}`
          : "pos-bottom-right";

  const rootEl = document.createElement("div");
  rootEl.className = `bc-root ${posClass}`;
  rootEl.style.setProperty("--bc-w", `${dims.w}px`);
  rootEl.style.setProperty("--bc-h", `${dims.h}px`);
  rootEl.style.setProperty("--bc-orb", `${dims.orb}px`);

  // Static markup only: names and other configured text are set with textContent / setAttribute
  // further down, so a bot called `Tom & "Jerry"` or `<b>` can never break or inject markup.
  rootEl.innerHTML = `
    <button type="button" class="bc-minimized-pill" part="pill">
      <span class="bc-pill-dot"></span>
      <span class="bc-pill-label"></span>
    </button>
    <div class="bc-companion-row">
      <section class="bc-chat">
        <header class="bc-chat-head">
          <div class="bc-chat-title">
            <strong class="bc-head-name"></strong>
            <span class="bc-head-status">Ready</span>
          </div>
          <button type="button" class="bc-chat-close" title="Close chat" aria-label="Close chat">${ICONS.close}</button>
        </header>
        <div class="bc-messages" role="log" aria-live="polite"></div>
        <div class="bc-chips"></div>
        <form class="bc-form">
          <input type="text" class="bc-input" placeholder="Ask a question…" autocomplete="off" aria-label="Your question" />
          <button type="submit" class="bc-send" title="Send" aria-label="Send">${ICONS.send}</button>
        </form>
      </section>

      <div class="bc-stage-wrap">
        <div class="bc-caption" aria-live="off"></div>
        <div class="bc-stage-card" role="button" tabindex="0">
          <canvas width="360" height="440"></canvas>
          <div class="bc-unmute-prompt" hidden>Tap to hear</div>
        </div>
        <div class="bc-controls">
          <button type="button" class="bc-btn bc-speak-btn" title="Speak the greeting">${ICONS.play}<span>Speak</span></button>
          <button type="button" class="bc-btn accent bc-ask-btn" title="Ask a question">${ICONS.chat}<span>Ask</span></button>
          <button type="button" class="bc-btn bc-mute-btn" title="Mute" aria-label="Mute" aria-pressed="false">${ICONS.volume}</button>
          <button type="button" class="bc-btn bc-min-btn" title="Minimize" aria-label="Minimize">${ICONS.minus}</button>
        </div>
      </div>
    </div>
  `;
  shadow.appendChild(rootEl);

  const canvas = rootEl.querySelector("canvas");
  const stageCard = rootEl.querySelector(".bc-stage-card");
  const captionEl = rootEl.querySelector(".bc-caption");
  const promptBadge = rootEl.querySelector(".bc-unmute-prompt");
  const chatPanel = rootEl.querySelector(".bc-chat");
  const headNameEl = rootEl.querySelector(".bc-head-name");
  const headStatusEl = rootEl.querySelector(".bc-head-status");
  const messagesEl = rootEl.querySelector(".bc-messages");
  const chipsEl = rootEl.querySelector(".bc-chips");
  const formEl = rootEl.querySelector(".bc-form");
  const inputEl = rootEl.querySelector(".bc-input");
  const speakBtn = rootEl.querySelector(".bc-speak-btn");
  const askBtn = rootEl.querySelector(".bc-ask-btn");
  const muteBtn = rootEl.querySelector(".bc-mute-btn");
  const minBtn = rootEl.querySelector(".bc-min-btn");
  const closeChatBtn = rootEl.querySelector(".bc-chat-close");
  const minPill = rootEl.querySelector(".bc-minimized-pill");
  const pillLabel = rootEl.querySelector(".bc-pill-label");

  const STATUS_READY = "Ready";
  const setSpeakBtn = (playing) => {
    speakBtn.innerHTML = `${playing ? ICONS.stop : ICONS.play}<span>${playing ? "Stop" : "Speak"}</span>`;
  };

  /** Writes every piece of configured text into the DOM (safe for any characters). */
  function applyIdentityText() {
    const name = String(config.name || "Companion");
    headNameEl.textContent = config.role ? `${name} · ${config.role}` : name;
    pillLabel.textContent = name;
    minPill.title = `Open ${name}`;
    chatPanel.setAttribute("aria-label", `Chat with ${name}`);
    stageCard.title = `Click to hear ${name}`;
    stageCard.setAttribute("aria-label", `${name}. Play or stop the spoken greeting.`);
  }
  const syncStageShape = () => {
    const circle = config.avatar.stageShape === "circle" && config.avatar.framing !== "cutout";
    stageCard.classList.toggle("shape-circle", circle);
  };
  applyIdentityText();
  syncStageShape();

  if (!config.chatEnabled) {
    askBtn.style.display = "none";
  } else if (config.chatStartOpen) {
    chatPanel.classList.add("open");
    rootEl.classList.add("chat-is-open");
  }

  // Initialize AIML Engine
  const aiml = new AIMLEngine({
    botProps: {
      name: config.name,
      role: config.role,
      company: config.company,
      website: config.website,
    },
  });

  async function initAimlBrain() {
    let xmlText = config.aimlXml || "";
    if (!xmlText && config.aimlUrl) {
      try {
        const r = await fetch(config.aimlUrl);
        if (r.ok) xmlText = await r.text();
      } catch (err) {
        console.warn("[bot.computer] Could not fetch AIML XML:", err);
      }
    }
    if (xmlText) {
      try {
        aiml.loadXML(xmlText);
      } catch (err) {
        console.warn("[bot.computer] Invalid AIML XML:", err);
      }
    }
    renderChips(aiml.quickChips.map((c) => ({ label: c, query: c })));
  }

  function appendChatMessage(role, text) {
    const div = document.createElement("div");
    div.className = `bc-msg ${role}`;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function renderChips(chips) {
    chipsEl.replaceChildren();
    for (const item of (chips || []).slice(0, 5)) {
      const label = typeof item === "string" ? item : item.label;
      const query = typeof item === "string" ? item : item.query || item.label;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "bc-chip";
      btn.textContent = label;
      btn.onclick = () => handleUserQuestion(query, label);
      chipsEl.appendChild(btn);
    }
  }

  // Initialize TTS WASM + Web Audio Playback + 200 Hz Viseme Loop
  const anim = createAnimState();
  const pointer = { nx: 0, ny: 0, active: false };
  let ttsVoice = null;
  let audioCtx = null;
  let sourceNode = null;
  let activeSpeech = null;
  let playStartedAt = 0;
  let isPlaying = false;
  let isMuted = false;
  let destroyed = false;
  let rafId = 0;
  let captionTimer = 0;

  // Pointer tracking across host window for SitePal eye-tracking!
  const onPointerMove = (e) => {
    if (!config.eyeTracking || destroyed) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const cx = rect.left + rect.width * 0.5;
    const cy = rect.top + rect.height * 0.42;
    pointer.nx = Math.max(-1, Math.min(1, (e.clientX - cx) / Math.max(180, window.innerWidth * 0.35)));
    pointer.ny = Math.max(-1, Math.min(1, (e.clientY - cy) / Math.max(160, window.innerHeight * 0.35)));
    pointer.active = true;
  };
  window.addEventListener("pointermove", onPointerMove, { passive: true });

  function stopSpeech() {
    if (sourceNode) {
      sourceNode.onended = null;
      try {
        sourceNode.stop();
      } catch {}
      sourceNode = null;
    }
    isPlaying = false;
    activeSpeech = null;
    captionKey = "";
    setSpeakBtn(false);
    if (ttsVoice) headStatusEl.textContent = STATUS_READY;
  }

  // Word-synced captions. tts.wasm reports lowercase word timings; when the count lines up with the
  // display text we show the original words (capitals and punctuation) instead.
  let captionKey = "";
  let captionLabels = [];
  let captionFor = null;
  function showCaptionWords(speech, activeTimeSec) {
    if (!config.showCaptions || !speech || !speech.words || !speech.words.length) return;
    if (chatPanel.classList.contains("open")) {
      captionEl.classList.remove("visible");
      return;
    }
    if (captionFor !== speech) {
      captionFor = speech;
      captionKey = "";
      const tokens = String(speech.text || "").split(/\s+/).filter(Boolean);
      captionLabels = tokens.length === speech.words.length ? tokens : speech.words.map((w) => w.word);
    }
    let started = 0;
    let active = -1;
    for (let i = 0; i < speech.words.length; i++) {
      if (activeTimeSec >= speech.words[i].start) {
        started = i;
        if (activeTimeSec < speech.words[i].end) active = i;
      } else break;
    }
    const key = `${started}:${active}`;
    if (key === captionKey) return; // only touch the DOM when the spoken word changes
    captionKey = key;
    captionEl.classList.add("visible");
    clearTimeout(captionTimer);
    captionEl.replaceChildren();
    captionLabels.forEach((label, i) => {
      const el = document.createElement(i === active ? "mark" : "span");
      if (i !== active && (i < started || (i === started && active === -1))) el.className = "said";
      el.textContent = label;
      captionEl.append(el, " ");
    });
  }

  const enginePromise = loadTtsEngine({
    wasmUrl: config.wasmUrl,
    wasmBytes: internalOpts.wasmBytes,
    embeddedWasmGzBase64:
      internalOpts.embeddedWasmGzBase64 ||
      (typeof globalThis !== "undefined" ? globalThis.__BOT_COMPUTER_EMBEDDED_WASM_GZ__ : ""),
    bindTTSFn: internalOpts.bindTTSFn,
  })
    .then(({ TTS }) => {
      ttsVoice = new TTS(config.voice || "female");
      return ttsVoice;
    })
    .catch((err) => {
      console.error("[bot.computer] TTS engine load error:", err);
      headStatusEl.textContent = "Text only (voice unavailable)";
      return null;
    });

  async function speakText(rawText, { emote = "" } = {}) {
    const cleanCheck = stripSpeechTags(rawText);
    if (!cleanCheck) return;
    if (emote) triggerAvatarEmote(anim, emote, 2400);

    const voice = ttsVoice || (await enginePromise);
    if (!voice || isMuted) return;

    stopSpeech();
    const Ctx = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!Ctx) return;
    audioCtx ??= new Ctx();
    if (audioCtx.state === "suspended") {
      try {
        await audioCtx.resume();
      } catch {}
    }
    if (audioCtx.state === "suspended") {
      // Browser autoplay policy requires first user gesture
      promptBadge.hidden = false;
      return;
    }
    promptBadge.hidden = true;

    const hasInlineTags = /\[[a-zA-Z_/]/.test(String(rawText));
    const speech = hasInlineTags ? voice.speakScript(String(rawText)) : voice.speak(String(rawText));
    if (!speech || !speech.samples || !speech.samples.length) return;

    const buffer = audioCtx.createBuffer(1, speech.samples.length, speech.sampleRate);
    buffer.copyToChannel(speech.samples, 0);
    sourceNode = audioCtx.createBufferSource();
    sourceNode.buffer = buffer;
    sourceNode.connect(audioCtx.destination);

    activeSpeech = speech;
    playStartedAt = audioCtx.currentTime + 0.015;
    isPlaying = true;
    setSpeakBtn(true);
    headStatusEl.textContent = "Speaking";

    sourceNode.start(playStartedAt);
    sourceNode.onended = () => {
      isPlaying = false;
      activeSpeech = null;
      captionKey = "";
      setSpeakBtn(false);
      headStatusEl.textContent = STATUS_READY;
      captionTimer = setTimeout(() => captionEl.classList.remove("visible"), 1600);
    };
  }

  async function handleUserQuestion(queryText, displayLabel) {
    const q = String(queryText || "").trim();
    if (!q) return;
    if (!chatPanel.classList.contains("open")) {
      chatPanel.classList.add("open");
      rootEl.classList.add("chat-is-open");
      captionEl.classList.remove("visible");
    }
    appendChatMessage("user", displayLabel || q);
    const res = aiml.reply(q);
    appendChatMessage("bot", res.displayText);
    if (res.chips && res.chips.length) {
      renderChips(res.chips);
    }
    await speakText(res.speechText, { emote: res.emote || "" });
  }

  // Wire UI events
  const toggleGreeting = () => {
    if (isPlaying) stopSpeech();
    else speakText(config.greeting, { emote: "wave" });
  };
  stageCard.onclick = toggleGreeting;
  stageCard.onkeydown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleGreeting();
    }
  };
  speakBtn.onclick = toggleGreeting;

  const closeChat = () => {
    chatPanel.classList.remove("open");
    rootEl.classList.remove("chat-is-open");
  };

  askBtn.onclick = () => {
    const open = chatPanel.classList.toggle("open");
    rootEl.classList.toggle("chat-is-open", open);
    if (open) {
      captionEl.classList.remove("visible");
      if (!messagesEl.children.length) {
        appendChatMessage("bot", stripSpeechTags(config.greeting));
      }
      setTimeout(() => inputEl.focus({ preventScroll: true }), 60);
    }
  };

  closeChatBtn.onclick = closeChat;
  chatPanel.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeChat();
      askBtn.focus();
    }
  });

  muteBtn.onclick = () => {
    isMuted = !isMuted;
    muteBtn.innerHTML = isMuted ? ICONS.muted : ICONS.volume;
    muteBtn.title = isMuted ? "Unmute" : "Mute";
    muteBtn.setAttribute("aria-label", muteBtn.title);
    muteBtn.setAttribute("aria-pressed", String(isMuted));
    if (isMuted) stopSpeech();
  };

  minBtn.onclick = () => {
    stopSpeech();
    rootEl.classList.add("is-minimized");
  };

  minPill.onclick = () => {
    rootEl.classList.remove("is-minimized");
  };

  formEl.onsubmit = (e) => {
    e.preventDefault();
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = "";
    handleUserQuestion(text);
  };

  // Detect narrow host container (e.g. 375px mobile preview frame on desktop)
  let resizeObs = null;
  if (config.position === "contained" && typeof ResizeObserver === "function") {
    const syncNarrow = () => {
      rootEl.classList.toggle("is-narrow-host", (parentTarget.clientWidth || 999) <= 520);
    };
    syncNarrow();
    resizeObs = new ResizeObserver(syncNarrow);
    resizeObs.observe(parentTarget);
  }

  // Continuous 60fps Render Loop
  function tick(nowMs) {
    if (destroyed) return;
    if (!document.hidden && !rootEl.classList.contains("is-minimized")) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = Math.max(120, Math.floor((stageCard.clientWidth || dims.w) * dpr));
      const ch = Math.max(120, Math.floor((stageCard.clientHeight || dims.h) * dpr));
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }

      let sampled = null;
      if (isPlaying && activeSpeech && audioCtx) {
        const tSec = Math.max(0, audioCtx.currentTime - playStartedAt);
        sampled = sampleSpeechAt(activeSpeech, Math.min(tSec, activeSpeech.duration), config.voice?.pitchHz || 160);
        showCaptionWords(activeSpeech, tSec);
      }
      stepAvatarPhysics(
        anim,
        nowMs,
        sampled,
        config.eyeTracking ? pointer : null,
        config.voice?.pitchHz || 160
      );
      const ctx = canvas.getContext("2d");
      drawBotAvatar(ctx, cw, ch, config.avatar, anim, nowMs, { showVoiceWaves: true });
    }
    rafId = requestAnimationFrame(tick);
  }

  await initAimlBrain();
  if (config.chatEnabled && config.chatStartOpen && !messagesEl.children.length) {
    appendChatMessage("bot", stripSpeechTags(config.greeting));
  }
  rafId = requestAnimationFrame(tick);

  if (config.autoGreet) {
    enginePromise.then(() => {
      speakText(config.greeting, { emote: "wave" });
    });
  }

  return {
    hostEl,
    say: (text, emote = "") => speakText(text, { emote }),
    ask: (question) => handleUserQuestion(question),
    stop: stopSpeech,
    emote: (name) => triggerAvatarEmote(anim, name, 2400),
    updateConfig(patch = {}) {
      if (patch.name !== undefined) config.name = patch.name;
      if (patch.role !== undefined) config.role = patch.role;
      if (patch.company !== undefined) config.company = patch.company;
      if (patch.greeting !== undefined) config.greeting = patch.greeting;
      if (patch.eyeTracking !== undefined) config.eyeTracking = patch.eyeTracking;
      if (patch.showCaptions !== undefined) config.showCaptions = patch.showCaptions;
      if (patch.chatEnabled !== undefined) {
        config.chatEnabled = patch.chatEnabled;
        askBtn.style.display = config.chatEnabled ? "" : "none";
        if (!config.chatEnabled) {
          chatPanel.classList.remove("open");
          rootEl.classList.remove("chat-is-open");
        }
      }
      if (patch.avatar) {
        config.avatar = { ...config.avatar, ...patch.avatar };
        syncStageShape();
      }
      if (patch.voice) {
        // Keep the config current even before tts.wasm has loaded, so the voice that is
        // created later starts from the latest settings rather than the mount-time ones.
        config.voice = { ...(typeof config.voice === "object" ? config.voice : {}), ...patch.voice };
        if (ttsVoice) {
          try {
            ttsVoice.configure(patch.voice);
          } catch {}
        }
      }
      if (patch.aimlXml !== undefined) {
        config.aimlXml = patch.aimlXml;
        try {
          aiml.setBotProps({ name: config.name, role: config.role, company: config.company });
          aiml.loadXML(config.aimlXml);
          renderChips(aiml.quickChips.map((c) => ({ label: c, query: c })));
        } catch {}
      }
      applyIdentityText();
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(rafId);
      stopSpeech();
      window.removeEventListener("pointermove", onPointerMove);
      if (resizeObs) resizeObs.disconnect();
      if (ttsVoice) {
        try {
          ttsVoice.free();
        } catch {}
      }
      hostEl.remove();
    },
  };
}


  function resolveDefaultWasmUrl(scriptEl) {
    if (scriptEl && scriptEl.src) {
      try {
        return new URL("../vendor/tts/tts.wasm", scriptEl.src).href;
      } catch {}
    }
    return "./tts.wasm";
  }

  const BotComputer = {
    version: "1.0.0",
    AIMLEngine,
    AVATAR_PRESETS,
    STARTER_AIML_PACKS,
    mount(config = {}) {
      const wasmUrl = config.wasmUrl || resolveDefaultWasmUrl(_capturedScript);
      return mountBotWidget({ ...config, wasmUrl }, { bindTTSFn: bindTTS });
    },
  };

  global.BotComputer = BotComputer;

  // Auto-mount if configured via global `window.BOT_COMPUTER_CONFIG` or `data-*` attributes on <script>
  function autoBoot() {
    if (global.__BOT_COMPUTER_AUTO_CONFIG__) {
      BotComputer.mount(global.__BOT_COMPUTER_AUTO_CONFIG__);
      return;
    }
    if (!_capturedScript) return;
    const ds = _capturedScript.dataset || {};
    if (ds.nomount === "true" || ds.manual === "true") return;
    if (ds.config || ds.name || ds.aiml || ds.wasm || ds.autostart !== undefined) {
      let parsed = {};
      if (ds.config) {
        try {
          parsed = JSON.parse(ds.config);
        } catch (err) {
          console.warn("[bot.computer] Invalid JSON in data-config:", err);
        }
      }
      if (ds.name) parsed.name = ds.name;
      if (ds.role) parsed.role = ds.role;
      if (ds.company) parsed.company = ds.company;
      if (ds.greeting) parsed.greeting = ds.greeting;
      if (ds.position) parsed.position = ds.position;
      if (ds.size) parsed.size = ds.size;
      if (ds.wasm) parsed.wasmUrl = ds.wasm;
      if (ds.aiml) parsed.aimlUrl = ds.aiml;
      if (ds.chat !== undefined) parsed.chatEnabled = ds.chat !== "false";
      if (ds.autogreet !== undefined) parsed.autoGreet = ds.autogreet === "true";
      BotComputer.mount(parsed);
    }
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", autoBoot, { once: true });
    } else {
      autoBoot();
    }
  }
})(typeof globalThis !== "undefined" ? globalThis : window);
