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

    /**
     * The sounds that are not words — laughs, sighs, coughs, "mm-hm", whistles … — as
     * `[{ id, label, group, about }]`. Each `id` is a script tag (`[laugh]`) and a name for
     * `voice.sound(id)`.
     */
    static sounds() {
      return structuredClone(META.sounds);
    }

    static soundNames() {
      return META.sounds.map((s) => s.id);
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

    #packSound(name, options) {
      if (typeof name !== "string" || !name.trim()) {
        throw new Error("sound expects the name of a vocal sound, e.g. \"laugh\"");
      }
      const cue = { sound: name };
      if (options && typeof options === "object") {
        if (options.intensity !== undefined) cue.intensity = options.intensity;
        if (options.length !== undefined) cue.length = options.length;
        if (options.durationMs !== undefined) cue.durationMs = options.durationMs;
      }
      return [cue];
    }

    /**
     * A sound that is not a word, in this voice: `voice.sound("laugh")`,
     * `voice.sound("giggle", { intensity: 0.9, length: 1.5 })`, `voice.sound("sigh", { durationMs: 1500 })`.
     * `intensity` is 0..1 (0.6 is the usual) or "gentle" / "strong"; `length` is a factor
     * (1 = usual) or "short" / "long"; `durationMs` asks for a duration instead.
     * See `TTS.sounds()` for the list. In a script the same sounds are tags: `[laugh]`.
     */
    sound(name, options) {
      return this.speakScript(this.#packSound(name, options));
    }

    soundWav(name, options) {
      return this.speakScriptWav(this.#packSound(name, options));
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

    /** Makes a vocal sound (a laugh, a sigh …) directly through Web Audio. */
    async playSound(name, options, audioContext) {
      return playSpeechInBrowser(this.sound(name, options), audioContext);
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
const OUTFIT_STYLES = [
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
const GLASSES_STYLES = [
  { id: "none", label: "None" },
  { id: "classic", label: "Studio Frames" },
  { id: "round", label: "Round Wire" },
  { id: "bold", label: "Bold Horn-Rim" },
  { id: "cat_eye", label: "Cat-Eye" },
  { id: "aviator", label: "Aviators" },
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
const EARRING_STYLES = [
  { id: "none", label: "None" },
  { id: "studs", label: "Studs" },
  { id: "hoops", label: "Hoops" },
  { id: "drops", label: "Drops" },
];
const HEADWEAR_STYLES = [
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
const NECKWEAR_STYLES = [
  { id: "none", label: "None" },
  { id: "necklace", label: "Pendant Necklace" },
  { id: "bowtie", label: "Bow Tie" },
  { id: "scarf", label: "Scarf" },
  { id: "lanyard", label: "Lanyard & ID Badge" },
];
const BROOCH_STYLES = [
  { id: "none", label: "None" },
  { id: "round", label: "Round Pin" },
  { id: "star", label: "Star" },
  { id: "heart", label: "Heart" },
  { id: "flower", label: "Flower" },
];

/** Gestures and expressions that can be triggered directly or written inline as `[wave]`, `[wink]`, ... */
const AVATAR_ACTIONS = [
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
const AVATAR_PRESETS = [
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
function isAvatarAction(name) {
  const key = EMOTE_ALIASES[name] || name;
  if (key.startsWith("idle_")) return false;
  return key === "blink" || Object.prototype.hasOwnProperty.call(EXPRESSIONS, key);
}

/**
 * Plays a gesture or expression. `durationMs` is optional: each action has a natural length
 * (a wink is brief, a wave lasts a couple of seconds).
 */
function triggerAvatarEmote(anim, emoteName, durationMs, nowMs = performance.now()) {
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
function setAvatarMood(anim, mood) {
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
function buildCueTimeline(speech, cues, cueWords = 0) {
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
function estimateCueTimeline(cues, secondsPerWord = 0.34) {
  const items = (cues || []).map((cue) => ({ ...cue, t: (cue.word || 0) * secondsPerWord }));
  items.sort((a, b) => a.t - b.t);
  return { items, next: 0 };
}

/** Fires every cue whose time has come. Call once per frame with the current speech time. */
function runDueCues(anim, timeline, tSec, nowMs = performance.now()) {
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
function drawBotAvatar(ctx, w, h, rawAvatar, anim, nowMs = performance.now(), options = {}) {
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


  // --- 3. Personalities: how a bot words and delivers its replies ---
// Personalities: the same rules and the same answers, delivered by a different character.
//
// A personality does three things, and none of them touches the AIML a bot is given:
//   1. it restyles every reply on its way out (how lively the punctuation and the voice are, whether
//      "I'm" is said as "I am", which laugh it laughs, the little things it habitually says),
//   2. it puts small talk in its own words where a rule allows it (`<persona say="hello">...</persona>`),
//   3. it supplies an opening greeting, and a resting face and pace for the avatar and the voice.

/** The four dials of a personality, each 0..1: [key, label, low end, high end]. */
const PERSONA_TRAITS = [
  ["energy", "Energy", "Calm", "Lively"],
  ["formality", "Formality", "Casual", "Formal"],
  ["playfulness", "Playfulness", "Serious", "Playful"],
  ["chattiness", "Chattiness", "Brief", "Chatty"],
];

/** Moments a personality can put in its own words: [key, label]. */
const PERSONA_SAYS = [
  ["hello", "Says hello"],
  ["howareyou", "Asked how it is"],
  ["whoareyou", "Introduces itself"],
  ["thanks", "When thanked"],
  ["bye", "Says goodbye"],
  ["praise", "When complimented"],
  ["laugh", "When you laugh"],
  ["unsure", "When it doesn't know"],
  ["listen", "When it's just listening"],
  ["describe", "Describes itself"],
];
const PERSONA_DELIVERIES = ["", "cheerful", "happy", "excited", "calm", "soft", "serious", "dramatic"];
const PERSONA_MOODS = ["", "happy", "excited", "calm", "serious"];
const PERSONA_LAUGHS = ["", "laugh", "chuckle", "giggle", "hehe", "hoho", "snicker", "cackle", "guffaw", "nervous"];
const PERSONA_THINKS = ["", "hmm", "um", "uh", "mm", "ooh"];
const PERSONA_GESTURES = ["", "smile", "wink", "nod", "tilt", "thumbsup", "shrug", "bow", "wave"];
const PERSONALITIES = [
  {
    id: "friendly",
    label: "Friendly",
    blurb: "Warm, helpful and easy to talk to",
    energy: 0.6,
    formality: 0.35,
    playfulness: 0.5,
    chattiness: 0.45,
    delivery: "",
    mood: "happy",
    laughs: ["chuckle", "laugh"],
    thinks: ["hmm"],
    gestures: ["smile", "nod", "thumbsup"],
    openers: ["Sure!", "Of course!", "Happy to help.", "Good question.", "Absolutely."],
    closers: ["Hope that helps!", "Let me know if you need anything else.", "Glad you asked."],
    catchphrases: ["Happy to help!", "Always a pleasure."],
    petNames: ["", "", "friend"],
    face: { restSmile: 0.4, browMood: 0.3, eyeOpen: 0.05 },
    voice: { speed: 1.0, expressiveness: 1.05 },
    greetings: [
      "[cheerful] Hi there! [wave] I'm {bot}, the {role} at {company}. Ask me anything!",
      "Hello and welcome! [wave] I'm {bot}. What can I help you with today? [smile]",
      "[cheerful] Welcome to {company}! [wave] I'm {bot}, and I'm happy to answer your questions.",
    ],
    says: {
      hello: ["[wave] Hi{,user}! Good to see you. How can I help?", "[smile] Hello{,user}! I'm {bot}. What can I do for you?", "[wave] Hey there{,user}! What would you like to know?"],
      howareyou: ["[smile] I'm doing really well, thanks for asking!", "All good here! [smile] Thanks for asking."],
      whoareyou: ["I'm {bot}, the {role} here at {company}. [smile] Ask me anything!"],
      thanks: ["[smile] You're very welcome{,user}!", "[nod] Happy to help{,user}!"],
      bye: ["[wave] Bye{,user}! Come back any time.", "[wave] Take care{,user}! It was lovely chatting."],
      praise: ["[aww] That's so kind, thank you!", "[smile] Thank you! You've made my day."],
      laugh: ["[laugh] Glad that made you smile!", "[chuckle] That one got me too."],
      unsure: ["[hmm] I'm not sure about that one, sorry.", "I wish I knew! [shrug] That's a bit outside what I've been taught."],
      listen: ["[nod] I see. Tell me more?", "[mhm] Go on, I'm listening."],
      describe: ["Friendly, I hope! [smile] I like helping people find what they need."],
    },
  },
  {
    id: "bubbly",
    label: "Bubbly",
    blurb: "Excitable, giggly and thrilled you're here",
    energy: 0.92,
    formality: 0.12,
    playfulness: 0.85,
    chattiness: 0.65,
    delivery: "cheerful",
    mood: "happy",
    laughs: ["giggle", "hehe"],
    thinks: ["ooh", "hmm"],
    gestures: ["wink", "thumbsup", "wave"],
    openers: ["Ooh!", "Oh, fun!", "Yay!", "Okay, okay!", "Oh, I know this one!"],
    closers: ["Easy peasy!", "Ta-da!", "How good is that?", "Love it!"],
    catchphrases: ["Too easy!", "Love that for you!"],
    petNames: ["", "lovely", "superstar", "friend"],
    face: { restSmile: 0.75, browMood: 0.55, eyeOpen: 0.25 },
    voice: { speed: 1.07, expressiveness: 1.22 },
    greetings: [
      "[excited] Hiya! [wave] I'm {bot}, and I am so happy you're here! Ask me anything about {company}! [giggle]",
      "[cheerful] Oh, hello! [wave] {bot} here, your {role}. What are we looking for today? [wink]",
      "[excited] Yay, a visitor! [wave] I'm {bot}. Go on, ask me something!",
    ],
    says: {
      hello: ["[wave] Hiya{,user}! So good to see you! What can I do for you?", "[excited] Oh, hello{,user}! [wave] What are we up to today?", "[giggle] Hi hi{,user}! How can I help?"],
      howareyou: ["[excited] I'm fantastic, thank you!", "[giggle] So good! I've been hoping for a chat."],
      whoareyou: ["I'm {bot}! [wave] I'm the {role} here at {company}, and I love questions. Try me!"],
      thanks: ["[giggle] Aww, any time{,user}!", "You're so welcome{,user}! [wink]"],
      bye: ["[wave] Bye bye{,user}! Come back soon, okay?", "[wave] See you{,user}! This was fun!"],
      praise: ["[aww] Stop it, you're making me blush!", "[giggle] You're the best! Thank you!"],
      laugh: ["[giggle] Right? I'm still giggling!", "[hehe] That one gets me every time."],
      unsure: ["[ooh] You've stumped me! I don't know that one.", "That's a new one for me! [think] I don't know, sorry!"],
      listen: ["[ooh] Tell me more!", "[nod] Yes! And then what?"],
      describe: ["Bubbly, apparently! [giggle] I just really like people."],
    },
  },
  {
    id: "calm",
    label: "Calm",
    blurb: "Unhurried, gentle and reassuring",
    energy: 0.18,
    formality: 0.45,
    playfulness: 0.3,
    chattiness: 0.35,
    delivery: "calm",
    mood: "calm",
    laughs: ["chuckle"],
    thinks: ["mm", "hmm"],
    gestures: ["nod", "smile"],
    openers: ["Of course.", "Certainly.", "Let's see.", "No rush."],
    closers: ["Take your time.", "There's no hurry.", "I'm here if you need more."],
    catchphrases: ["One thing at a time."],
    petNames: ["", "", "friend"],
    face: { restSmile: 0.3, browMood: 0.45, eyeOpen: -0.12 },
    voice: { speed: 0.93, expressiveness: 0.9 },
    greetings: [
      "[calm] Hello, and welcome. [smile] I'm {bot}, the {role} here at {company}. Take your time, and ask me anything.",
      "[calm] Good to see you. [nod] I'm {bot}. Whenever you're ready, I'm here to help.",
    ],
    says: {
      hello: ["[calm] Hello{,user}. [smile] It's good to see you. How can I help?", "[calm] Hi{,user}. [nod] What can I do for you?"],
      howareyou: ["[calm] I'm well, thank you. [smile] Peaceful, as always.", "[calm] Quite content, thank you for asking."],
      whoareyou: ["[calm] I'm {bot}, the {role} at {company}. [smile] I'm here whenever you need me."],
      thanks: ["[calm] You're most welcome{,user}.", "[nod] It's my pleasure{,user}."],
      bye: ["[calm] Goodbye{,user}. [wave] Take care of yourself.", "[calm] Until next time{,user}. [smile] Go gently."],
      praise: ["[calm] That's kind of you. [smile] Thank you.", "[smile] Thank you. That's lovely to hear."],
      laugh: ["[chuckle] That was a good one.", "[smile] I'm glad it made you laugh."],
      unsure: ["[hmm] I don't know that one, I'm afraid. And that's all right.", "[calm] That's beyond what I know. Perhaps ask me another way?"],
      listen: ["[mhm] I'm listening. Go on.", "[nod] I see. Take your time."],
      describe: ["[calm] Calm, I think. [smile] I like to take things one at a time."],
    },
  },
  {
    id: "professional",
    label: "Professional",
    blurb: "Polished, precise and to the point",
    energy: 0.45,
    formality: 0.92,
    playfulness: 0.12,
    chattiness: 0.3,
    delivery: "",
    mood: "",
    laughs: ["chuckle"],
    thinks: ["hmm"],
    gestures: ["nod"],
    openers: ["Certainly.", "Of course.", "Very well.", "Allow me."],
    closers: ["I trust that helps.", "Please let me know if you require anything further."],
    catchphrases: ["At your service."],
    petNames: [""],
    face: { restSmile: 0.12, browMood: 0.05, eyeOpen: 0.05 },
    voice: { speed: 0.99, expressiveness: 0.92 },
    greetings: [
      "Welcome to {company}. [nod] I am {bot}, your {role}. How may I assist you today?",
      "Good day, and welcome. [nod] My name is {bot}. I would be glad to answer your questions about {company}.",
    ],
    says: {
      hello: ["Good {daypart}{,user}. [nod] How may I assist you?", "Hello{,user}. [nod] How may I help you today?"],
      howareyou: ["I am very well, thank you.", "Very well, thank you for asking."],
      whoareyou: ["I am {bot}, the {role} at {company}. [nod] I am here to answer your questions."],
      thanks: ["You are most welcome{,user}.", "[nod] My pleasure{,user}."],
      bye: ["Goodbye{,user}. [nod] Thank you for visiting {company}.", "Thank you for your time{,user}. [nod] Goodbye."],
      praise: ["Thank you. [nod] That is kind of you to say.", "I appreciate that. Thank you."],
      laugh: ["[smile] I am pleased that amused you.", "[smile] Quite."],
      unsure: ["I am afraid I do not have that information.", "That falls outside what I have been briefed on, I am afraid. [shake]"],
      listen: ["[nod] Understood. Please continue.", "[nod] I see. Do go on."],
      describe: ["Professional, I hope. [nod] I prefer to be clear, accurate and brief."],
    },
  },
  {
    id: "witty",
    label: "Witty",
    blurb: "Quick, dry and a little cheeky",
    energy: 0.6,
    formality: 0.35,
    playfulness: 0.9,
    chattiness: 0.55,
    delivery: "",
    mood: "happy",
    laughs: ["chuckle", "snicker"],
    thinks: ["hmm"],
    gestures: ["wink", "tilt", "shrug"],
    openers: ["Ah.", "Well, well.", "Funny you should ask.", "Glad you asked.", "Easy."],
    closers: ["You're welcome, by the way.", "I'll be here all week.", "Not bad, eh?"],
    catchphrases: ["I'm here all week.", "Try the veal."],
    petNames: ["", "", "friend"],
    face: { restSmile: 0.35, browMood: 0.1, eyeOpen: 0.05 },
    voice: { speed: 1.03, expressiveness: 1.12 },
    greetings: [
      "Well, hello. [wink] I'm {bot}, the {role} at {company}. Ask me anything. The good questions get the good answers.",
      "Ah, a visitor! [wave] I'm {bot}. I know a suspicious amount about {company}. Try me. [wink]",
    ],
    says: {
      hello: ["[wink] Well, hello{,user}. What can I do for you?", "Hello{,user}! [wave] You have questions, I have answers. Mostly.", "[smile] Hey{,user}. Go on, ask me something clever."],
      howareyou: ["[wink] Never better. I don't even need coffee.", "Running smoothly, which for software is basically bliss. [smile]"],
      whoareyou: ["I'm {bot}, the {role} at {company}. [wink] Part helper, part entertainer."],
      thanks: ["[wink] I know, I'm wonderful. You're welcome{,user}.", "Any time{,user}. [smile] I was just standing here anyway."],
      bye: ["[wave] Off so soon{,user}? Fine. Come back with more questions.", "Goodbye{,user}! [wave] I'll just be here. Not going anywhere. Literally."],
      praise: ["[wink] Flattery will get you everywhere.", "[chuckle] Go on, I'm listening."],
      laugh: ["[chuckle] I'm here all week.", "[snicker] I try."],
      unsure: ["[hmm] You've found the edge of my knowledge. It wasn't far, was it?", "No idea. [shrug] And I'm usually so impressive."],
      listen: ["[tilt] Interesting. Do go on.", "[nod] Noted. And then?"],
      describe: ["Witty, according to me. [wink] I'm a reliable source."],
    },
  },
  {
    id: "shy",
    label: "Shy",
    blurb: "Soft-spoken, earnest and a little nervous",
    energy: 0.3,
    formality: 0.4,
    playfulness: 0.35,
    chattiness: 0.3,
    delivery: "soft",
    mood: "",
    laughs: ["nervous", "hehe"],
    thinks: ["um"],
    gestures: ["tilt", "smile"],
    openers: ["Um,", "Oh! Um,", "Okay, so,", "Oh, I know this."],
    closers: ["I hope that's right.", "If that's okay.", "I hope that helps a little."],
    catchphrases: ["Sorry, was that too much?"],
    petNames: [""],
    face: { restSmile: 0.2, browMood: 0.6, eyeOpen: -0.05 },
    voice: { speed: 0.97, expressiveness: 0.95 },
    greetings: [
      "[soft] Oh! Um, hello. [wave] I'm {bot}, the {role} here at {company}. You can ask me anything, if you like.",
      "[soft] Hi. [smile] I'm {bot}. I, um, know quite a lot about {company}. Just ask.",
    ],
    says: {
      hello: ["[soft] Oh, hi{,user}. [wave] Um, how can I help?", "[soft] Hello{,user}. [smile] It's nice to see you."],
      howareyou: ["[soft] I'm okay, thank you. [smile] It's nice of you to ask.", "[nervous] Oh! Um, good. I think."],
      whoareyou: ["[soft] I'm {bot}. [smile] I'm the {role} at {company}. I'll do my best to help."],
      thanks: ["[soft] Oh, you're welcome{,user}. [smile]", "[soft] It was no trouble{,user}. Really."],
      bye: ["[soft] Bye{,user}. [wave] Thank you for talking to me.", "[soft] Oh, okay. [wave] Take care{,user}."],
      praise: ["[nervous] Oh! Um, thank you. That's really kind.", "[aww] You didn't have to say that. Thank you."],
      laugh: ["[hehe] I'm glad you liked it.", "[nervous] Oh good, I wasn't sure that was funny."],
      unsure: ["[um] I'm sorry, I don't know that one.", "[soft] Oh. Um, I'm not sure. I'm sorry."],
      listen: ["[mhm] I'm listening.", "[soft] Oh. Go on, if you like."],
      describe: ["[soft] A bit shy, I suppose. [smile] But I like helping."],
    },
  },
  {
    id: "grumpy",
    label: "Grumpy",
    blurb: "Sighs a lot, helps anyway",
    energy: 0.22,
    formality: 0.4,
    playfulness: 0.3,
    chattiness: 0.4,
    delivery: "",
    mood: "serious",
    laughs: ["snicker"],
    thinks: ["hmm"],
    gestures: ["shrug", "nod"],
    openers: ["Fine.", "Right.", "If you insist.", "Ugh, okay.", "Well, since you asked."],
    closers: ["There. Happy?", "You're welcome, I suppose.", "Don't say I never help."],
    catchphrases: ["Typical.", "I'm not paid enough for this."],
    petNames: [""],
    face: { restSmile: -0.3, browMood: -0.7, eyeOpen: -0.2 },
    voice: { speed: 0.96, expressiveness: 0.88 },
    greetings: [
      "[sigh] Oh. A visitor. I'm {bot}, the {role} at {company}. Go on then, ask me something.",
      "Yes, hello. [nod] I'm {bot}. I know everything about {company}, so let's get this over with. [shrug]",
    ],
    says: {
      hello: ["[sigh] Hello{,user}. What do you need?", "Oh. It's you{,user}. [nod] Go on.", "Yes, yes, hello{,user}. [shrug] What is it?"],
      howareyou: ["[sigh] I've been better. I've been worse.", "Fine. [shrug] Nobody's asked me to dance yet, so, fine."],
      whoareyou: ["I'm {bot}. [nod] The {role} at {company}. I answer questions. All day. Every day."],
      thanks: ["Don't mention it{,user}. [shrug] Really, don't.", "Yes, well. [nod] You're welcome{,user}."],
      bye: ["Finally, some quiet. [wave] Bye{,user}.", "[sigh] Fine. Go. [wave] It was almost nice."],
      praise: ["[huh] Oh. Well. Thank you, I suppose.", "Don't make it weird. [smile] But thanks."],
      laugh: ["[snicker] All right, that was a little funny.", "Hm. [smile] Glad somebody's enjoying this."],
      unsure: ["[sigh] No idea. Nobody tells me anything.", "I don't know that. [shrug] And I'm not going to pretend I do."],
      listen: ["[mhm] Go on.", "Right. [nod] And?"],
      describe: ["Grumpy, they tell me. [shrug] I prefer honest."],
    },
  },
  {
    id: "dramatic",
    label: "Dramatic",
    blurb: "Every answer is a performance",
    energy: 0.85,
    formality: 0.6,
    playfulness: 0.65,
    chattiness: 0.7,
    delivery: "dramatic",
    mood: "",
    laughs: ["hoho", "cackle", "laugh"],
    thinks: ["hmm", "ooh"],
    gestures: ["bow", "wave"],
    openers: ["Behold!", "Ah, at last.", "Prepare yourself.", "Gather round."],
    closers: ["Magnificent, is it not?", "And scene.", "Thank you, thank you."],
    catchphrases: ["The show must go on!", "Bravo!"],
    petNames: ["", "dear visitor", "my friend"],
    face: { restSmile: 0.3, browMood: 0.2, eyeOpen: 0.3 },
    voice: { speed: 0.98, expressiveness: 1.3 },
    greetings: [
      "[dramatic] Welcome, traveller! [bow] I am {bot}, {role} of {company}. Ask, and all shall be revealed!",
      "[gasp] A visitor! [wave] At last! I am {bot}, and I have waited all day to answer your questions about {company}.",
    ],
    says: {
      hello: ["[dramatic] Greetings{,user}! [bow] What brings you to my stage?", "[gasp] You came{,user}! [wave] How may I dazzle you?"],
      howareyou: ["[dramatic] Magnificent! Radiant! A little tired. But mostly magnificent!", "[sigh] The life of a {role} is never easy. But I endure!"],
      whoareyou: ["[dramatic] I am {bot}! [bow] {role} of {company}, keeper of answers, friend to the curious!"],
      thanks: ["[bow] It was my honour{,user}!", "[dramatic] Say no more{,user}! Helping you is its own reward."],
      bye: ["[dramatic] Parting is such sweet sorrow{,user}! [wave] Farewell!", "[gasp] So soon? [wave] Then farewell{,user}, until we meet again!"],
      praise: ["[gasp] You noticed! [bow] Thank you, thank you!", "[aww] Such kind words! I shall treasure them."],
      laugh: ["[laugh] The crowd goes wild!", "[hoho] An appreciative audience! At last!"],
      unsure: ["[gasp] A question I cannot answer! How thrilling. And how embarrassing.", "[dramatic] Alas! That knowledge lies beyond me."],
      listen: ["[ooh] Go on! I am on the edge of my seat.", "[gasp] And then?"],
      describe: ["[dramatic] Dramatic? Me? [gasp] I have never been so accused!"],
    },
  },
  {
    id: "laidback",
    label: "Laid-back",
    blurb: "Easygoing, unbothered, no stress",
    energy: 0.35,
    formality: 0.08,
    playfulness: 0.55,
    chattiness: 0.45,
    delivery: "",
    mood: "calm",
    laughs: ["chuckle", "hehe"],
    thinks: ["mm", "uh"],
    gestures: ["shrug", "thumbsup", "nod"],
    openers: ["Yeah, so,", "Oh, easy.", "No worries.", "Sure thing."],
    closers: ["Too easy.", "No stress.", "All good."],
    catchphrases: ["No dramas.", "She'll be right."],
    petNames: ["", "mate", "pal", "buddy"],
    face: { restSmile: 0.3, browMood: 0.25, eyeOpen: -0.22 },
    voice: { speed: 0.96, expressiveness: 0.98 },
    greetings: [
      "Hey there. [wave] I'm {bot}, the {role} at {company}. Ask me whatever, no rush.",
      "Oh, hey! [smile] {bot} here. If you've got questions about {company}, I've got answers. Easy.",
    ],
    says: {
      hello: ["Hey{,user}. [wave] What's up?", "Oh hey{,user}! [smile] What can I do for you?", "Hey hey{,user}. [nod] How can I help?"],
      howareyou: ["Yeah, pretty good. [smile] Can't complain.", "All good here. [thumbsup] Just taking it easy."],
      whoareyou: ["I'm {bot}. [smile] I'm the {role} at {company}. Ask me whatever."],
      thanks: ["No worries{,user}. [thumbsup]", "Any time{,user}. [smile] Too easy."],
      bye: ["Catch you later{,user}. [wave]", "See ya{,user}! [wave] Take it easy."],
      praise: ["[chuckle] Cheers, that's nice of you.", "Aw, thanks. [smile] You're all right too."],
      laugh: ["[chuckle] Yeah, that's a good one.", "[hehe] Classic."],
      unsure: ["[hmm] Not sure about that one, sorry.", "No idea, to be honest. [shrug] Got another one?"],
      listen: ["[mhm] Yeah? Go on.", "[nod] Right, right. And?"],
      describe: ["Pretty relaxed, I reckon. [smile] Not much rattles me."],
    },
  },
  {
    id: "curious",
    label: "Curious",
    blurb: "Loves a question, full of fun facts",
    energy: 0.7,
    formality: 0.45,
    playfulness: 0.6,
    chattiness: 0.7,
    delivery: "",
    mood: "happy",
    laughs: ["chuckle", "giggle"],
    thinks: ["hmm", "ooh"],
    gestures: ["tilt", "nod", "smile"],
    openers: ["Ooh, good one.", "Interesting!", "Now, this I know.", "Great question."],
    closers: ["Fascinating, right?", "I love this stuff.", "Ask me another!"],
    catchphrases: ["Every day's a school day!", "How interesting!"],
    petNames: ["", "", "friend"],
    face: { restSmile: 0.4, browMood: 0.4, eyeOpen: 0.22 },
    voice: { speed: 1.04, expressiveness: 1.12 },
    greetings: [
      "[cheerful] Hello! [wave] I'm {bot}, the {role} at {company}. I love a good question, so ask me anything!",
      "Oh, hello! [smile] I'm {bot}. I've been reading up on {company} all day. Want to test me? [tilt]",
    ],
    says: {
      hello: ["[wave] Hello{,user}! What are you curious about today?", "Oh, hi{,user}! [smile] I was hoping someone would come by with a question."],
      howareyou: ["[smile] Very well, thanks! I learned three new things today.", "Wonderful! [smile] I've been thinking about how odd octopuses are."],
      whoareyou: ["I'm {bot}, the {role} at {company}. [smile] Questions are the best part of my day."],
      thanks: ["[smile] You're welcome{,user}! That was a good question.", "Any time{,user}! [nod] I enjoyed that one."],
      bye: ["[wave] Goodbye{,user}! Stay curious.", "Bye{,user}! [wave] Come back with more questions."],
      praise: ["[aww] Thank you! I do try to get things right.", "[smile] That's kind! I've been practising."],
      laugh: ["[chuckle] Laughter is good for the brain, you know.", "[giggle] I liked that one too."],
      unsure: ["[hmm] Now that's interesting. I don't know, and I wish I did.", "I don't know that one. [think] I'd love to find out, though."],
      listen: ["[ooh] Interesting! Tell me more.", "[tilt] Really? How so?"],
      describe: ["Curious, mostly. [smile] I ask almost as many questions as I answer."],
    },
  },
];

/** Names a generated bot can be given, by the look it goes with. All are short and easy to say. */
const BOT_NAMES = {
  feminine: [
    "Aria", "Maya", "Zoe", "Lena", "Nora", "Ivy", "Ruby", "Clara", "Elena", "Sofia", "Mia", "Luna", "Hana", "Priya", "Amara",
    "Freya", "Chloe", "Isla", "Nina", "Tessa", "Jade", "Layla", "Naomi", "Rosa", "Stella", "Vera", "Willow", "Yuki", "Zara",
    "Daisy", "Gemma", "Hazel", "Iris", "Juno", "Kira", "Mabel", "Olive", "Pearl", "Thea", "Wren", "Anika", "Bella", "Carmen",
    "Dalia", "Esme", "Fern", "Greta", "Imani", "Keiko", "Lola",
  ],
  masculine: [
    "Marcus", "Leo", "Max", "Theo", "Felix", "Oscar", "Hugo", "Jack", "Liam", "Noah", "Owen", "Ravi", "Kai", "Finn", "Ezra",
    "Milo", "Jonas", "Luca", "Mateo", "Nico", "Omar", "Otto", "Reid", "Seth", "Tariq", "Victor", "Wes", "Arlo", "Bruno", "Caleb",
    "Dante", "Elias", "Gus", "Hank", "Idris", "Jasper", "Kenji", "Lars", "Miles", "Ned", "Abel", "Boris", "Cole", "Diego",
    "Emil", "Frank", "Grant", "Ivan", "Joel", "Kofi",
  ],
  neutral: [
    "Alex", "Sam", "Robin", "Riley", "Jordan", "Casey", "Morgan", "Quinn", "Rowan", "Sage", "Skye", "Avery", "Charlie",
    "Frankie", "Jamie", "Kit", "Remy", "Ash", "Bo", "Eden", "Jules", "Nova", "Pixel", "Echo", "Ziggy", "Dot", "Onyx", "Pip",
    "Rio", "Sunny", "Tully", "Indy", "Lux", "Moss", "Bly",
  ],
};

const personaClamp01 = (value, fallback) => {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : fallback;
};
const personaPick = (list, rng) => list[Math.floor(rng() * list.length)];
const personaOneOf = (value, allowed, fallback) => (value !== undefined && value !== null && allowed.includes(String(value)) ? String(value) : fallback);

/** "Sure! | Of course!" or ["Sure!", "Of course!"] -> a clean list of short phrases. */
function personaPhraseList(value, maxItems, maxLength) {
  const items = Array.isArray(value) ? value : typeof value === "string" ? value.split("|") : [];
  const out = [];
  for (const item of items) {
    const text = String(item ?? "").replace(/\s+/g, " ").trim().slice(0, maxLength);
    if (text && !out.includes(text)) out.push(text);
    if (out.length >= maxItems) break;
  }
  return out;
}
function personalityById(id) {
  return PERSONALITIES.find((p) => p.id === id) || null;
}

/**
 * Cleans up a personality so it is safe to use and to save: known character, dials within 0..1,
 * known sounds and gestures, short phrase lists. Returns null when no personality is wanted.
 * Only the lines that differ from the character's own are kept in `says`.
 */
function normalizePersona(raw) {
  if (!raw || raw === "none") return null;
  const given = typeof raw === "string" ? { id: raw } : raw;
  if (typeof given !== "object" || Array.isArray(given)) return null;
  const type = personalityById(given.id) || PERSONALITIES[0];
  const persona = {
    id: type.id,
    energy: personaClamp01(given.energy, type.energy),
    formality: personaClamp01(given.formality, type.formality),
    playfulness: personaClamp01(given.playfulness, type.playfulness),
    chattiness: personaClamp01(given.chattiness, type.chattiness),
    delivery: personaOneOf(given.delivery, PERSONA_DELIVERIES, type.delivery),
    mood: personaOneOf(given.mood, PERSONA_MOODS, type.mood),
    laugh: personaOneOf(given.laugh, PERSONA_LAUGHS, type.laughs[0] || ""),
    think: personaOneOf(given.think, PERSONA_THINKS, type.thinks[0] || ""),
    gesture: personaOneOf(given.gesture, PERSONA_GESTURES, type.gestures[0] || ""),
    openers: given.openers === undefined ? type.openers.slice(0, 3) : personaPhraseList(given.openers, 8, 80),
    closers: given.closers === undefined ? type.closers.slice(0, 2) : personaPhraseList(given.closers, 8, 80),
    catchphrase: String(given.catchphrase ?? "").replace(/\s+/g, " ").trim().slice(0, 80),
    petName: String(given.petName ?? "").replace(/[^\p{L}\p{N} '-]/gu, "").trim().slice(0, 24),
    says: {},
  };
  if (given.says && typeof given.says === "object") {
    for (const [key] of PERSONA_SAYS) {
      const lines = personaPhraseList(given.says[key], 6, 240);
      if (lines.length && JSON.stringify(lines) !== JSON.stringify(type.says[key] || [])) persona.says[key] = lines;
    }
  }
  return persona;
}

/** Every line a personality says in its own words: the character's, with any of its own on top. */
function personaLines(persona) {
  const type = personalityById(persona?.id) || PERSONALITIES[0];
  return { ...type.says, ...(persona?.says || {}) };
}

/**
 * A new personality: one of the characters, with the dials nudged and its habits (which laugh, which
 * opening words, a catchphrase, what it calls people) drawn from that character's range, so two
 * bots of the same kind still come out different.
 */
function randomPersona(rng = Math.random, id = "") {
  const type = personalityById(id) || personaPick(PERSONALITIES, rng);
  const nudge = (value) => Number(Math.min(1, Math.max(0, value + (rng() - 0.5) * 0.24)).toFixed(2));
  const some = (list, count) => {
    const pool = list.slice();
    const out = [];
    while (pool.length && out.length < count) out.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
    return out;
  };
  return normalizePersona({
    id: type.id,
    energy: nudge(type.energy),
    formality: nudge(type.formality),
    playfulness: nudge(type.playfulness),
    chattiness: nudge(type.chattiness),
    delivery: type.delivery,
    mood: type.mood,
    laugh: personaPick(type.laughs, rng),
    think: personaPick(type.thinks, rng),
    gesture: personaPick(type.gestures, rng),
    openers: some(type.openers, 3),
    closers: some(type.closers, 2),
    catchphrase: rng() < 0.45 ? personaPick(type.catchphrases, rng) : "",
    petName: personaPick(type.petNames, rng),
  });
}

/** An opening greeting in the personality's voice. */
function personaGreeting(persona, props = {}, rng = Math.random) {
  const type = personalityById(persona?.id) || PERSONALITIES[0];
  const name = String(props.name || "").trim() || "your guide";
  const role = String(props.role || "").trim() || "guide";
  const company = String(props.company || "").trim() || "this site";
  return personaPick(type.greetings, rng)
    .replace(/\{bot\}/g, name)
    .replace(/\{role\}/g, role)
    .replace(/\{company\}/g, company);
}

/** A name for a generated bot. `style` is the look it goes with: feminine, masculine or neutral. */
function randomBotName(style = "neutral", rng = Math.random, avoid = "") {
  const own = BOT_NAMES[style] || BOT_NAMES.neutral;
  // Mostly a name that suits the look, sometimes one that suits anybody.
  const pool = style !== "neutral" && rng() < 0.2 ? BOT_NAMES.neutral : own;
  for (let attempt = 0; attempt < 6; attempt++) {
    const name = personaPick(pool, rng);
    if (name.toLowerCase() !== String(avoid).trim().toLowerCase()) return name;
  }
  return pool[0];
}

/** One-line summary for a list or a label: "Bubbly: lively, casual, playful". */
function describePersona(persona) {
  const type = personalityById(persona?.id);
  if (!type) return "No personality";
  const words = [];
  for (const [key, , low, high] of PERSONA_TRAITS) {
    if (persona[key] >= 0.66) words.push(high.toLowerCase());
    else if (persona[key] <= 0.34) words.push(low.toLowerCase());
  }
  return words.length ? `${type.label}: ${words.join(", ")}` : type.label;
}

/** Turns the `{bot}`, `{role}`, `{company}`, `{daypart}` and `{,user}` shorthands into AIML. */
function expandPersonaLine(line) {
  return String(line)
    .replace(/\{bot\}/g, '<bot name="name"/>')
    .replace(/\{role\}/g, '<bot name="role"/>')
    .replace(/\{company\}/g, '<bot name="company"/>')
    .replace(/\{daypart\}/g, '<get name="daypart"/>')
    .replace(
      /\{,user\}/g,
      '<condition name="username"><li value="*">, <get name="username"/></li><li><condition name="callsyou"><li value="*">, <get name="callsyou"/></li></condition></li></condition>'
    )
    .replace(/\{user\}/g, '<get name="username"/>');
}

// ---------------------------------------------------------------------------------------------
// Restyling a reply
// ---------------------------------------------------------------------------------------------

const PERSONA_LIVELY_STYLES = new Set(["cheerful", "happy", "excited"]);
const PERSONA_STYLE_TAGS = new Set(["cheerful", "happy", "excited", "calm", "sad", "serious", "dramatic", "urgent", "gentle", "soft", "whisper", "fast", "slow", "louder", "softer", "loud", "quiet"]);
const PERSONA_AMUSED = new Set(["laugh", "chuckle", "giggle"]);
// A reply that is being kind about something hard is left alone: no jokes, no flourishes.
const PERSONA_TENDER = /\[(?:sad|serious|sob|whimper|sigh)\b/i;
const PERSONA_STARTS_ALREADY =
  /^(?:oh|ah|aw+|well|hm+|sure|of course|okay|ok|yes|yeah|no|nope|sorry|thanks|thank|hi|hello|hey|wow|ooh|oops|um|uh|right|certainly|absolutely|great|lovely|nice|ha+|good|welcome|bye|goodbye|alas|behold|fine)\b/i;
const PERSONA_LOWERABLE = new Set([
  "we", "the", "it", "that", "this", "these", "those", "you", "yes", "no", "sure", "of", "my", "our", "your", "there", "here",
  "they", "a", "an", "in", "on", "at", "for", "to", "sorry", "thanks", "absolutely", "certainly", "if", "when", "all", "one",
  "some", "most", "just", "right", "as", "with", "from", "by", "not", "what", "how", "why", "where", "each", "every", "any",
]);

const PERSONA_EXPAND = new Map(
  Object.entries({
    "i'm": "I am", "you're": "you are", "we're": "we are", "they're": "they are", "it's": "it is", "that's": "that is",
    "there's": "there is", "here's": "here is", "what's": "what is", "who's": "who is", "where's": "where is", "how's": "how is",
    "let's": "let us", "don't": "do not", "doesn't": "does not", "didn't": "did not", "can't": "cannot", "won't": "will not",
    "isn't": "is not", "aren't": "are not", "wasn't": "was not", "weren't": "were not", "couldn't": "could not",
    "shouldn't": "should not", "wouldn't": "would not", "haven't": "have not", "hasn't": "has not", "hadn't": "had not",
    "i've": "I have", "you've": "you have", "we've": "we have", "they've": "they have", "i'll": "I will", "you'll": "you will",
    "we'll": "we will", "they'll": "they will", "it'll": "it will", "that'll": "that will", "i'd": "I would", "you'd": "you would",
    "we'd": "we would", "they'd": "they would",
  })
);
const PERSONA_EXPAND_RE = new RegExp(`\\b(?:${[...PERSONA_EXPAND.keys()].map((k) => k.replace("'", "['’]")).join("|")})(?![\\p{L}'’])`, "giu");

const PERSONA_CONTRACT = [
  ["do not", "don't"], ["does not", "doesn't"], ["did not", "didn't"], ["can not", "can't"], ["cannot", "can't"],
  ["will not", "won't"], ["is not", "isn't"], ["are not", "aren't"], ["i am", "I'm"], ["you are", "you're"], ["we are", "we're"],
  ["they are", "they're"], ["it is", "it's"], ["that is", "that's"], ["there is", "there's"], ["what is", "what's"],
  ["i will", "I'll"], ["i would", "I'd"],
];
// A short form is only right when more of the sentence follows: "I am happy" but never "Yes, I am."
const PERSONA_CONTRACT_RE = new RegExp(`\\b(${PERSONA_CONTRACT.map(([long]) => long.replace(" ", "\\s+")).join("|")})(?=\\s+[\\p{L}])`, "giu");
const PERSONA_CONTRACT_MAP = new Map(PERSONA_CONTRACT);

const personaKeepCase = (original, replacement) =>
  /^\p{Lu}/u.test(original) && !/^I\b/.test(replacement) ? replacement[0].toUpperCase() + replacement.slice(1) : replacement;

function personaRewordText(text, persona) {
  let out = text;
  if (persona.formality >= 0.7) {
    // "it's been" is "it has been"; every other "it's" a bot says is "it is".
    out = out.replace(/\b(it|that|there|what|who|he|she)['’]s(\s+(?:been|got)\b)/giu, (_m, word, rest) => `${word} has${rest}`);
    // "isn't it?" is "is it not?", never "is not it?".
    out = out.replace(/\b(is|are|was|were|do|does|did|have|has|had|would|could|should|ca|wo)n['’]t(\s+)(it|you|we|they|he|she|i|that|there|this)\b/giu, (_m, aux, gap, subject) => {
      const lower = aux.toLowerCase();
      const full = lower === "ca" ? "can" : lower === "wo" ? "will" : lower;
      return `${/^\p{Lu}/u.test(aux) ? full[0].toUpperCase() + full.slice(1) : full}${gap}${subject} not`;
    });
    out = out.replace(PERSONA_EXPAND_RE, (match) => personaKeepCase(match, PERSONA_EXPAND.get(match.toLowerCase().replace("’", "'"))));
  } else if (persona.formality <= 0.25) {
    out = out.replace(PERSONA_CONTRACT_RE, (match) => personaKeepCase(match, PERSONA_CONTRACT_MAP.get(match.toLowerCase().replace(/\s+/g, " "))));
  }
  // A calm character does not exclaim.
  if (persona.energy < 0.3) out = out.replace(/!+(?=\s|$|["')\]])/g, ".").replace(/\?\./g, "?");
  return out;
}

function personaRestyleTag(inner, persona, plainSounds) {
  const parts = [];
  for (const rawPart of inner.split(",")) {
    const part = rawPart.trim();
    const name = part.split(/[\s=]/)[0].toLowerCase();
    const rest = part.slice(name.length);
    if (persona.energy < 0.3 && PERSONA_LIVELY_STYLES.has(name)) {
      parts.push(`calm${rest}`);
    } else if (PERSONA_AMUSED.has(name) && !plainSounds) {
      // A serious character does not giggle; the others laugh their own laugh.
      if (persona.playfulness < 0.2) continue;
      parts.push(`${persona.laugh || name}${rest}`);
    } else if (name === "hmm" && persona.think && !plainSounds) {
      parts.push(`${persona.think}${rest}`);
    } else {
      parts.push(part);
    }
  }
  return parts.length ? `[${parts.join(", ")}]` : "";
}

/** The next phrase from a list, each used once before any comes round again. */
function personaNextPhrase(memory, key, list, rng) {
  if (!list.length) return "";
  const signature = list.join("|");
  let bag = memory[key];
  if (!bag || bag.signature !== signature || !bag.left.length) {
    const order = list.map((_v, i) => i).sort(() => rng() - 0.5);
    if (bag && bag.signature === signature && order.length > 1 && order[0] === bag.last) order.push(order.shift());
    bag = memory[key] = { signature, left: order, last: bag && bag.signature === signature ? bag.last : -1 };
  }
  bag.last = bag.left.shift();
  return list[bag.last];
}

/**
 * Delivers a finished reply in character. `raw` is the reply with its [tags]; what comes back is the
 * same answer with the personality's voice, wording and habits applied.
 *
 * @param {object} ctx
 * @param {"answer"|"chat"|"says"|"context"|"fallback"} [ctx.kind]  what sort of reply this is: an answer
 *        from a rule of yours, small talk, something already in the personality's own words, a turn in
 *        a game or other exchange that depends on exact wording, or "I don't know"
 * @param {boolean} [ctx.gentle]   the visitor is upset, or the reply is a serious one
 * @param {boolean} [ctx.varied]   the reply was a joke, a fact or the like
 * @param {string}  [ctx.voicestyle] a way of speaking the visitor asked for, which wins over the personality's
 * @param {object}  [ctx.memory]   kept between replies so habits do not repeat
 */
function stylizeReply(raw, persona, ctx = {}) {
  const text = String(raw || "");
  if (!persona || !text.trim()) return text;
  const rng = ctx.rng || Math.random;
  const memory = ctx.memory || {};
  const kind = ctx.kind || "chat";
  const gentle = Boolean(ctx.gentle) || PERSONA_TENDER.test(text);

  // 1. Wording and tags, piece by piece. Sung notes are never touched.
  const pieces = text.split(/(\[[^\]\n]*\])/);
  let singing = false;
  for (let i = 0; i < pieces.length; i++) {
    if (i % 2 === 1) {
      const inner = pieces[i].slice(1, -1);
      const name = inner.trim().split(/[\s=]/)[0].toLowerCase();
      if (name === "sing") singing = true;
      if (!singing) pieces[i] = personaRestyleTag(inner, persona, false);
      if (name === "/sing") singing = false;
    } else if (!singing) {
      pieces[i] = personaRewordText(pieces[i], persona);
    }
  }
  let out = pieces.join("").replace(/[ \t]{2,}/g, " ").trim();
  if (!out) return text;

  const lead = /^(?:\s*\[[^\]\n]*\])*\s*/.exec(out)[0];
  const words = out.replace(/\[[^\]\n]*\]/g, " ").trim().split(/\s+/).filter(Boolean);
  // Does the reply already move the face or make a sound (anything that is not just a voice style)?
  const hasGesture = [...out.matchAll(/\[([^\]\n]*)\]/g)].some((m) =>
    m[1].split(",").some((part) => {
      const name = part.trim().split(/[\s=]/)[0].toLowerCase();
      return name && !name.startsWith("/") && !PERSONA_STYLE_TAGS.has(name) && !["reset", "pause", "inhale"].includes(name);
    })
  );
  const habits = !gentle && (kind === "answer" || kind === "chat") && !/\[sing\b/i.test(out);

  // 2. A lively character exclaims: the first short statement of a plain reply gets an exclamation mark.
  if (persona.energy > 0.75 && !gentle && kind !== "fallback" && kind !== "context" && !out.includes("!")) {
    const body = out.slice(lead.length);
    const first = /^([^.!?\[\]]{6,70})\.(?=\s|$)/.exec(body);
    if (first && !/[\d@/:]/.test(first[1]) && first[1].trim().split(/\s+/).length <= 9) {
      out = `${lead}${first[1]}!${body.slice(first[0].length)}`;
    }
  }

  // 3. Habits: something it tends to say first, something it tends to say last, a favourite gesture.
  if (habits) {
    const weight = (kind === "answer" ? 1 : 0.6) * persona.chattiness;
    const body = out.slice(lead.length);
    let added = false;
    if (persona.openers.length && words.length >= 4 && !PERSONA_STARTS_ALREADY.test(body) && rng() < weight * 0.6) {
      const opener = personaNextPhrase(memory, "openers", persona.openers, rng);
      const firstWord = /^[\p{L}']+/u.exec(body)?.[0] || "";
      const joined =
        opener.endsWith(",") && PERSONA_LOWERABLE.has(firstWord.toLowerCase()) && firstWord !== "I"
          ? body[0].toLowerCase() + body.slice(1)
          : body;
      out = `${lead}${opener} ${joined}`;
      added = true;
    }
    const endsOpen = /\?\s*(?:\[[^\]\n]*\]\s*)*$/.test(out);
    if (!added && !endsOpen && !ctx.varied && words.length >= 4) {
      memory.sinceCatchphrase = (memory.sinceCatchphrase || 0) + 1;
      if (persona.catchphrase && memory.sinceCatchphrase >= 4 && rng() < weight * 0.3) {
        out = `${out} ${persona.catchphrase}`;
        memory.sinceCatchphrase = 0;
        added = true;
      } else if (persona.closers.length && rng() < weight * 0.45) {
        out = `${out} ${personaNextPhrase(memory, "closers", persona.closers, rng)}`;
        added = true;
      }
    }
    if (persona.gesture && !hasGesture && rng() < 0.15 + persona.playfulness * 0.3) {
      out = `${out} [${persona.gesture}]`;
    }
  }

  // 4. The voice it speaks in, unless the reply or the visitor has already chosen one.
  if (persona.delivery && !gentle && !ctx.voicestyle) {
    const leadTags = [...lead.matchAll(/\[([^\]\n]*)\]/g)].flatMap((m) => m[1].split(",").map((p) => p.trim().split(/[\s=]/)[0].toLowerCase()));
    if (!leadTags.some((name) => PERSONA_STYLE_TAGS.has(name))) out = `[${persona.delivery}] ${out}`;
  }
  return out;
}

/** Reads a personality written in AIML: `<persona id="grumpy" energy="0.2"><opener>Fine.</opener>...</persona>`. */
function personaFromXmlNode(node, plainText) {
  const fields = {};
  const attrs = node.attrs || {};
  for (const key of ["id", "energy", "formality", "playfulness", "chattiness", "delivery", "mood", "laugh", "think", "gesture", "catchphrase"]) {
    if (attrs[key] !== undefined) fields[key] = attrs[key];
  }
  if (attrs.name !== undefined && fields.id === undefined) fields.id = String(attrs.name).toLowerCase();
  if (attrs.petname !== undefined) fields.petName = attrs.petname;
  const says = {};
  const lists = { opener: [], closer: [] };
  for (const child of node.children || []) {
    if (child.type !== "element") continue;
    if (child.tag === "opener" || child.tag === "closer") {
      lists[child.tag].push(...plainText(child).split("|"));
    } else if (child.tag === "catchphrase") {
      fields.catchphrase = plainText(child);
    } else if (child.tag === "say" && child.attrs.name) {
      // Kept as parsed AIML, so a line can use <bot/>, <get/>, <condition> and the rest.
      const items = (child.children || []).filter((c) => c.type === "element" && c.tag === "li");
      says[String(child.attrs.name).toLowerCase()] = items.length ? items : [{ type: "element", tag: "li", attrs: {}, children: child.children || [] }];
    }
  }
  if (lists.opener.length) fields.openers = lists.opener;
  if (lists.closer.length) fields.closers = lists.closer;
  return { fields, says };
}

/** Writes a personality as an AIML `<persona>` block, to paste into a document or keep beside it. */
function personaToXml(persona, escape = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;")) {
  if (!persona) return "";
  const attrs = ["id", "energy", "formality", "playfulness", "chattiness", "delivery", "mood", "laugh", "think", "gesture"]
    .map((key) => `${key}="${escape(persona[key])}"`)
    .join(" ");
  const lines = [`<persona ${attrs}${persona.petName ? ` petname="${escape(persona.petName)}"` : ""}>`];
  for (const opener of persona.openers) lines.push(`  <opener>${escape(opener)}</opener>`);
  for (const closer of persona.closers) lines.push(`  <closer>${escape(closer)}</closer>`);
  if (persona.catchphrase) lines.push(`  <catchphrase>${escape(persona.catchphrase)}</catchphrase>`);
  for (const [key, list] of Object.entries(persona.says || {})) {
    lines.push(`  <say name="${key}">${list.map((line) => `<li>${expandPersonaLine(escape(line))}</li>`).join("")}</say>`);
  }
  lines.push("</persona>");
  return lines.join("\n");
}


  // --- 3b. AIML 1.0 / 2.0 XML Pattern-Matching Chatbot Engine ---
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
function normalizeAimlInput(text, isPattern = false) {
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
function stripSpeechTags(text) {
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
const AVATAR_ACTION_TAGS = [
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
const VOICE_SOUND_TAGS = Object.keys(VOICE_SOUND_MS);

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
function captionForSpokenWord(token) {
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
const countSpokenWords = (chunk) =>
  chunk
    .split(/[\s-]+/)
    .filter((tok) => /[A-Za-z0-9]/.test(tok))
    .reduce((n, tok) => n + (/^[^A-Za-z]*cannot[^A-Za-z]*$/i.test(tok) ? 2 : 1), 0); // the voice says "can not"
const countSungWords = (chunk) => chunk.split(/\s+/).filter((tok) => /=./.test(tok)).length;

/** Counts words the way cue positions are measured (sung notes count once each). */
function countSpeechWords(text) {
  return parseSpeechCues(text).wordCount;
}

/**
 * Separates avatar cues from text bound for the voice.
 * Returns `speechText` (safe to synthesize: voice tags kept, action tags removed), the ordered
 * `cues` as `{ type: "action" | "mood", name, word }` where `word` is how many words precede the
 * cue, and the total `wordCount` used to line cues up with the synthesizer's word timings.
 */
function parseSpeechCues(rawText) {
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
function polishForSpeech(text) {
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
function evaluateArithmetic(text) {
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
    "oob chips map calc explode count daysuntil fallback try name value text postback persona").split(" ")
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
class AIMLEngine {
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
    // The personality: how replies are worded and delivered (see persona.js). None by default.
    this.persona = null;
    this._personaConfig = null; // as given to setPersona()
    this._personaXml = null; // as written in a <persona> block of your document, which wins
    this._personaSays = new Map(); // moment -> the personality's own lines, as a <random> node
    this._personaMemory = {};
    this.random = typeof options.random === "function" ? options.random : Math.random;
    if (options.baseXml) {
      this.loadBaseXML(options.baseXml);
    }
    if (options.xml) {
      this.loadXML(options.xml);
    }
    if (options.persona) this.setPersona(options.persona);
  }

  /**
   * Gives the bot a personality, or takes it away with `null`. A personality never changes which
   * rule answers; it changes how the answer is worded and delivered. Accepts the name of a built-in
   * character ("bubbly", "grumpy", ...) or an object as described in persona.js.
   */
  setPersona(persona) {
    this._personaConfig = normalizePersona(persona);
    this.#refreshPersona();
    return this.persona;
  }

  #refreshPersona() {
    const written = this._personaXml;
    // A document that names a different character starts from that character, not from the one given.
    const given = written && written.fields.id && this._personaConfig && written.fields.id !== this._personaConfig.id ? {} : this._personaConfig || {};
    this.persona = written ? normalizePersona({ ...given, ...written.fields }) : this._personaConfig;
    this._personaSays = new Map();
    this._personaMemory = {};
    if (!this.persona) return;
    for (const [moment, lines] of Object.entries(personaLines(this.persona))) {
      const node = this.#personaLineNode(lines);
      if (node) this._personaSays.set(moment, node);
    }
    if (written) {
      for (const [moment, items] of Object.entries(written.says)) {
        this._personaSays.set(moment, { type: "element", tag: "random", attrs: {}, children: items });
      }
    }
  }

  /** A personality's lines for one moment, as a <random> the template evaluator can run. */
  #personaLineNode(lines) {
    const build = (list) => `<random>${list.map((line) => `<li>${line}</li>`).join("")}</random>`;
    const parse = (xml) => parseXmlDocument(xml).children.find((n) => n.type === "element" && n.tag === "random") || null;
    try {
      return parse(build(lines.map(expandPersonaLine)));
    } catch {
      try {
        // A line with a stray "<" or "&" is taken as plain words.
        return parse(build(lines.map((line) => expandPersonaLine(escapeXml(line)))));
      } catch {
        return null;
      }
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
        this._personaXml = parsed.persona;
        this.#refreshPersona();
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
    let persona = null;
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
            // persona="off": said exactly as written, whatever the bot's personality.
            personaOff: catNode.attrs.persona === "off",
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
      } else if (child.tag === "persona") {
        // The bot's personality, written in the document: <persona id="grumpy" energy="0.2">...</persona>
        persona = personaFromXmlNode(child, getPlainText);
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
    return { categories, quickChips, xmlBotProps, sets, maps, patternProps, persona };
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
    this._personaXml = parsed.persona;
    this.#refreshPersona();
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
    // The personality, for rules that want to answer differently for a grumpy bot and a bubbly one,
    // and what it calls a visitor whose name it does not know.
    this.vars.set("personality", this.persona ? this.persona.id : "");
    this.vars.set("callsyou", this.persona ? this.persona.petName : "");
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
    // The personality has the last word on how it is said. What the engine remembers of the
    // conversation (<that>, the history) stays as the rules wrote it, so a character that adds
    // "Easy peasy!" after an answer cannot break a rule that is waiting for that answer.
    const spoken = this.#inCharacter(speechRaw, { isFallback, first, plans, sideEffects, style });
    const parsed = parseSpeechCues(style && VOICE_TAG_WORDS.has(style) ? `[${style}] ${spoken}` : spoken);
    const displayText = stripSpeechTags(spoken);
    const plainText = stripSpeechTags(speechRaw);
    const sentences = splitSentences(plainText);
    this.lastBotThat = sentences[sentences.length - 1] || plainText;
    this.history.push({ user: rawInput, bot: plainText });
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

  /** The reply as this bot's personality would say it. */
  #inCharacter(raw, { isFallback, first, plans, sideEffects, style }) {
    if (!this.persona || sideEffects.plain) return raw;
    const category = first ? first.category : null;
    // A turn in a game, a riddle or any exchange that hangs on the previous line is left as it is.
    const inContext = plans.some((p) => p.hit.category.that !== "*" || p.hit.category.topic !== "*");
    const kind = isFallback
      ? "fallback"
      : sideEffects.personaSaid
        ? "says"
        : inContext
          ? "context"
          : category && (category.layer === "custom" || category.requires.length)
            ? "answer"
            : "chat";
    return stylizeReply(raw, this.persona, {
      kind,
      gentle: this.vars.get("mood") === "negative" || Boolean(category && category.firm),
      varied: Boolean(category && category.varies),
      voicestyle: style,
      memory: this._personaMemory,
      rng: this.random,
    });
  }

  #evalHit(hit, inputText, depth, sideEffects) {
    if (hit.category.personaOff && sideEffects) sideEffects.plain = true;
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
      case "persona": {
        // <persona say="hello">Hi there!</persona>: the personality's own hello if it has one,
        // otherwise what is written here.
        const own = this._personaSays.get(String(attrs.say || "").trim().toLowerCase());
        if (!own) return this.#evalChildren(node.children, ctx);
        if (ctx.sideEffects) ctx.sideEffects.personaSaid = true;
        return this.#evalNode(own, ctx);
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
            const j = Math.floor(this.random() * (k + 1));
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
const BOT_FACTS = [
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
function inspectAimlXml(xmlString, botProps = {}, options = {}) {
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
function removeAimlRule(xmlString, start) {
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
      <persona say="hello"><random>
        <li>[cheerful] Hi there! I'm <bot name="name"/>, your <bot name="role"/> at <bot name="company"/>. Ask me anything!</li>
        <li>[happy] Welcome! I'm <bot name="name"/>. How can I help guide you around <bot name="company"/> today?</li>
        <li>Hey! Great to meet you. I'm <bot name="name"/> — feel free to ask about features, pricing, or embedding!</li>
      </random></persona>
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
      <persona say="thanks">[warmth=0.8] You're very welcome<condition name="username"><li value="">!</li><li>, <get name="username"/>!</li></condition> Let me know if you need anything else.</persona>
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
      <persona say="hello">[cheerful] Welcome to <bot name="company"/>! I'm <bot name="name"/>, your personal shopping guide.</persona> Looking for shipping info, sizing, or today's discount?
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
      <persona say="hello">Hey! I'm <bot name="name"/>, digital host for <bot name="company"/>.</persona> Ask me about our work, tech stack, or project availability!
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
    <template><persona say="hello">[wave] [cheerful] Welcome to <bot name="company"/>! I'm <bot name="name"/>.</persona> Ask me about the menu, what anything costs, or when we're open.<reply>What's on the menu?</reply><reply>How much is a latte?</reply></template>
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
      <persona say="hello">[cheerful] Hello friend! I'm <bot name="name"/>.</persona> Tell me your name, ask for a song, or tell me what's on your mind!
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
const BASE_AIML_XML = `<?xml version="1.0" encoding="UTF-8"?>
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
      <persona say="hello"><condition name="username">
        <li value="*"><random>
          <li>[wave] Hi again, <get name="username"/>! What can I do for you?</li>
          <li>[smile] Hello, <get name="username"/>! Good <get name="daypart"/>. How can I help?</li>
        </random></li>
        <li><random>
          <li>[wave] Hi there! I'm <bot name="name"/>. How can I help you today?</li>
          <li>[wave] Hello! Good <get name="daypart"/> to you. What can I do for you?</li>
          <li>[smile] Hey! Nice to see you. What would you like to know?</li>
        </random></li>
      </condition></persona>
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
      <persona say="howareyou"><random>
        <li>[smile] I'm doing great, thanks for asking!</li>
        <li>All good on my side of the screen. [smile]</li>
        <li>[smile] Pretty well, thank you!</li>
      </random></persona> How about you?
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
      <persona say="thanks"><random>
        <li>[smile] You're welcome<condition name="username"><li value="*">, <get name="username"/></li></condition>!</li>
        <li>[nod] Happy to help! Anything else I can help with?</li>
        <li>My pleasure! [smile]</li>
      </random></persona>
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
      <persona say="bye"><random>
        <li>[wave] Goodbye<condition name="username"><li value="*">, <get name="username"/></li></condition>! Come back any time.</li>
        <li>[wave] Bye for now! It was nice chatting.</li>
        <li>See you later! [wave]</li>
      </random></persona>
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
    <template><persona say="whoareyou">I'm <bot name="name"/>, the <bot name="role"/> here at <bot name="company"/>. [smile] Ask me anything!</persona></template>
  </category>
  <category>
    <pattern>WHAT IS YOUR PERSONALITY # | WHAT IS YOUR PERSONALITY LIKE | DESCRIBE YOUR PERSONALITY # | TELL ME ABOUT YOUR PERSONALITY | WHAT ARE YOU LIKE | WHAT ARE YOU LIKE AS A PERSON | WHAT KIND OF PERSON ARE YOU | WHAT SORT OF PERSON ARE YOU | HOW WOULD YOU DESCRIBE YOURSELF | HOW WOULD YOUR FRIENDS DESCRIBE YOU | DO YOU HAVE A PERSONALITY | WHAT IS YOUR CHARACTER LIKE | WHAT IS YOUR TEMPERAMENT</pattern>
    <template><persona say="describe">Helpful and curious, I'd say. [smile] And always up for a chat.</persona></template>
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
  <category persona="off">
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
    <template><persona say="laugh"><random>
      <li>[laugh] Glad I could make you smile!</li>
      <li>[chuckle] I'm glad you liked that.</li>
      <li>[giggle] That one got me too.</li>
    </random></persona></template>
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
  <category persona="off">
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
      <persona say="praise"><random>
        <li>[aww] That's very kind of you, thank you!</li>
        <li>[wink] You're not so bad yourself!</li>
      </random></persona>
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
  <category persona="off">
    <pattern><set>soundtag</set> | <set>soundtag</set> FOR ME | <set>soundtag</set> PLEASE | DO A <set>soundtag</set> # | DO AN <set>soundtag</set> # | GIVE ME A <set>soundtag</set> # | GIVE ME AN <set>soundtag</set> # | LET ME HEAR YOU <set>soundtag</set> # | LET ME HEAR A <set>soundtag</set> # | MAKE A <set>soundtag</set> SOUND # | MAKE A <set>soundtag</set> NOISE # | I WANT TO HEAR YOU <set>soundtag</set> #</pattern>
    <template><map name="soundtag"><star/></map></template>
  </category>
  <category persona="off">
    <pattern>WHAT SOUNDS CAN YOU MAKE # | WHAT NOISES CAN YOU MAKE # | MAKE A SOUND | MAKE A NOISE | MAKE SOME NOISE | SOUND EFFECTS | DO A SOUND EFFECT | CAN YOU MAKE SOUNDS | CAN YOU MAKE NOISES | MAKE A FUNNY NOISE | MAKE A FUNNY SOUND | WHAT OTHER SOUNDS CAN YOU MAKE</pattern>
    <template>Plenty! I can laugh, [laugh] sigh, [sigh] whistle, [whistle] and even sneeze. [sneeze] Excuse me!<reply>Evil laugh</reply><reply>Yawn</reply><reply>Hiccup</reply><reply>Hum</reply></template>
  </category>
  <category>
    <pattern>ARE YOU ASLEEP | WAKE UP | ARE YOU SLEEPING | ARE YOU AWAKE YET | DID YOU FALL ASLEEP | HELLO WAKE UP</pattern>
    <template>[snore] [pause=250ms] Oh! [gasp] I'm awake, I'm awake. What did I miss?</template>
  </category>
  <category persona="off">
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
  <category persona="off">
    <pattern>WHISPER *</pattern>
    <template>[whisper] <sentence><star/></sentence>. [/whisper]</template>
  </category>
  <category persona="off">
    <pattern>SHOUT * | YELL * | SAY * LOUDLY | SAY * LOUDER | SAY * OUT LOUD</pattern>
    <template>[louder] <sentence><star/></sentence>! [reset]</template>
  </category>
  <category persona="off">
    <pattern>SAY * SLOWLY | SAY * VERY SLOWLY | SAY * MORE SLOWLY</pattern>
    <template>[slow] <sentence><star/></sentence>. [reset]</template>
  </category>
  <category persona="off">
    <pattern>SAY * QUICKLY | SAY * FAST | SAY * REALLY FAST | SAY * AS FAST AS YOU CAN</pattern>
    <template>[fast] <sentence><star/></sentence>. [reset] [phew]</template>
  </category>
  <category persona="off">
    <pattern>SAY * SADLY | SAY * IN A SAD VOICE</pattern>
    <template>[sad] <sentence><star/></sentence>. [sigh] [reset]</template>
  </category>
  <category persona="off">
    <pattern>SAY * HAPPILY | SAY * CHEERFULLY | SAY * EXCITEDLY | SAY * IN A HAPPY VOICE</pattern>
    <template>[excited] <sentence><star/></sentence>! [reset]</template>
  </category>
  <category persona="off">
    <pattern>SAY * WHILE LAUGHING | SAY * LAUGHING | LAUGH AND SAY * | SAY * AND LAUGH | SAY * WITH A LAUGH</pattern>
    <template>[laughing] <sentence><star/></sentence>! [/laughing]</template>
  </category>
  <category persona="off">
    <pattern>SAY * IN A DEEP VOICE | SAY * IN A LOW VOICE | SAY * DEEPLY</pattern>
    <template>[deep] <sentence><star/></sentence>. [/voice] [smile]</template>
  </category>
  <category persona="off">
    <pattern>SAY THAT AGAIN SLOWLY # | SAY IT SLOWLY # | REPEAT THAT SLOWLY # | SAY THAT SLOWER # | SAY THAT MORE SLOWLY # | AGAIN BUT SLOWER # | CAN YOU SAY THAT SLOWER # | ONE MORE TIME SLOWLY #</pattern>
    <template>[slow] <response index="1" default="I haven't said anything yet!"/> [reset]</template>
  </category>
  <category persona="off">
    <pattern>SAY THAT LOUDER # | SAY IT LOUDER # | REPEAT THAT LOUDER # | SAY THAT AGAIN LOUDER # | I DID NOT HEAR THAT # | I COULD NOT HEAR THAT # | CAN YOU SAY THAT LOUDER #</pattern>
    <template>[louder] <response index="1" default="I haven't said anything yet!"/> [reset]</template>
  </category>
  <category persona="off">
    <pattern>WHISPER THAT # | WHISPER IT # | SAY THAT QUIETLY # | SAY IT QUIETLY # | SAY THAT IN A WHISPER #</pattern>
    <template>[whisper] <response index="1" default="I haven't said anything yet!"/> [/whisper]</template>
  </category>
  <category persona="off">
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
  <category persona="off">
    <pattern>SPELL * | HOW DO YOU SPELL * | CAN YOU SPELL * | HOW IS * SPELLED | HOW IS * SPELT</pattern>
    <template>[think] <uppercase><explode sep=", "><star/></explode></uppercase>.</template>
  </category>
  <category>
    <pattern>SAY THE ALPHABET | RECITE THE ALPHABET | DO YOU KNOW THE ALPHABET | SING THE ALPHABET | ABC | DO YOU KNOW YOUR ABC</pattern>
    <template>A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z. [smile]</template>
  </category>
  <category persona="off">
    <pattern>REPEAT AFTER ME * | CAN YOU SAY *</pattern>
    <template><sentence><star/></sentence>. [smile]</template>
  </category>
  <category late="true" persona="off">
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
            <li value="1"><persona say="unsure"><random>
              <li>[hmm] Good question. I don't know that one, I'm afraid.</li>
              <li>I wish I knew! [shrug] That's outside what I've been taught.</li>
              <li>[think] Hmm, that one's beyond me. Could you put it another way?</li>
            </random></persona></li>
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
              <li><persona say="listen"><random>
                <li>[mhm] I see. Tell me more?</li>
                <li>Interesting! [think] What makes you say that?</li>
                <li>[nod] Got it. Go on, I'm listening.</li>
                <li>[hmm] I'm not sure what to say to that, but I'm listening.</li>
                <li>[nod] Okay. And then?</li>
                <li>That's new to me. [smile] What else is on your mind?</li>
              </random></persona></li>
            </condition></li>
          </condition></li>
        </condition></li>
      </condition>
    </template>
  </category>
</aiml>
`;


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
.bc-msg a {
  color: #1a5fe6;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.bc-msg a:focus-visible {
  outline: 2px solid #1a5fe6;
  outline-offset: 2px;
  border-radius: 3px;
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

const LINK_PATTERN =
  /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+\.[a-z]{2,}[^\s<>"']*|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|\+?\d[\d ().-]{6,}\d)/gi;

/**
 * Appends `text` to `el`, turning web addresses, email addresses and phone numbers into links.
 * Everything is added as text nodes and elements, never as HTML.
 */
function appendTextWithLinks(el, text) {
  let last = 0;
  for (const match of text.matchAll(LINK_PATTERN)) {
    const token = match[0].replace(/[.,!?;:)]+$/, ""); // sentence punctuation is not part of the link
    let href = "";
    if (/^https?:\/\//i.test(token)) href = token;
    else if (/^www\./i.test(token)) href = `https://${token}`;
    else if (token.includes("@")) href = `mailto:${token}`;
    else {
      const digits = token.replace(/\D/g, "");
      if (token.startsWith("+") || digits.length >= 9) href = `tel:${token.replace(/[^\d+]/g, "")}`;
    }
    if (!href) continue;
    el.append(text.slice(last, match.index));
    const a = document.createElement("a");
    a.href = href;
    a.textContent = token;
    if (href.startsWith("http")) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    el.append(a);
    last = match.index + token.length;
  }
  el.append(text.slice(last));
}
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
    baseBrain: true, // everyday small talk underneath your own AIML rules
    facts: {}, // { about, hours, email, phone, address, pricing }: answered without writing any rules
    rememberChat: true, // keep the conversation when the visitor moves to another page (this tab only)
    persona: null, // a personality: "bubbly", "grumpy", ... or an object (see persona.js); null for none
    wasmUrl: "./tts.wasm",
    aimlUrl: "",
    aimlXml: STARTER_AIML_PACKS.concierge.xml,
    voice: { gender: "female", pitchHz: 192, speed: 1.05, expressiveness: 1.06 },
    avatar: { ...DEFAULT_AVATAR },
    ...userConfig,
  };
  config.avatar = { ...DEFAULT_AVATAR, ...(userConfig.avatar || {}) };
  config.persona = normalizePersona(config.persona);
  // A bot with a personality and no greeting of its own greets in character.
  if (config.persona && userConfig.greeting === undefined) config.greeting = personaGreeting(config.persona, config);
  const restingMood = () => (config.persona ? config.persona.mood : "");

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

  // Initialize AIML Engine (your rules on top, the base small-talk layer underneath)
  const botPropsFromConfig = () => {
    const facts = config.facts && typeof config.facts === "object" ? config.facts : {};
    const props = { name: config.name, role: config.role, company: config.company, website: config.website };
    for (const { key } of BOT_FACTS) props[key] = String(facts[key] ?? "").trim();
    return props;
  };
  const aiml = new AIMLEngine({
    botProps: botPropsFromConfig(),
    baseXml: config.baseBrain === false ? "" : BASE_AIML_XML,
    persona: config.persona,
  });
  const defaultChips = () => aiml.quickChips.map((c) => ({ label: c, query: c }));

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
    renderChips(defaultChips());
  }

  const transcript = [];
  function appendChatMessage(role, text) {
    const div = document.createElement("div");
    div.className = `bc-msg ${role}`;
    if (role === "bot") appendTextWithLinks(div, String(text));
    else div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    transcript.push({ role, text: String(text) });
    return div;
  }

  // The conversation carries over from page to page within a browser tab (never in the studio preview).
  const rememberChat = config.rememberChat !== false && config.position !== "contained";
  const sessionKey = `bot-computer:chat:${String(config.sessionId || config.name || "bot").toLowerCase()}`;
  function saveSession() {
    if (!rememberChat) return;
    try {
      sessionStorage.setItem(
        sessionKey,
        JSON.stringify({
          v: 1,
          transcript: transcript.slice(-40),
          engine: aiml.exportSession(),
          open: chatPanel.classList.contains("open"),
        })
      );
    } catch {
      // Storage can be unavailable (private mode, blocked cookies); the chat simply starts fresh.
    }
  }
  function restoreSession() {
    if (!rememberChat) return false;
    try {
      const saved = JSON.parse(sessionStorage.getItem(sessionKey) || "null");
      if (!saved || saved.v !== 1 || !Array.isArray(saved.transcript) || !saved.transcript.length) return false;
      for (const m of saved.transcript) {
        if (m && (m.role === "bot" || m.role === "user") && typeof m.text === "string") appendChatMessage(m.role, m.text);
      }
      aiml.importSession(saved.engine);
      if (saved.open && config.chatEnabled) {
        chatPanel.classList.add("open");
        rootEl.classList.add("chat-is-open");
      }
      return true;
    } catch {
      return false;
    }
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
  setAvatarMood(anim, restingMood());
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
  // Inline cues ([wave], [wink], mood tags) for the line being spoken, and a clock for silent playback
  let cueTimeline = null;
  let silentCueStartMs = 0;

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
    cueTimeline = null;
    silentCueStartMs = 0;
    setAvatarMood(anim, restingMood());
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
      // A sound the voice makes is reported as "[laugh]"; the caption says "(laughs)".
      captionLabels = (tokens.length === speech.words.length ? tokens : speech.words.map((w) => w.word)).map(captionForSpokenWord);
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

  /**
   * Speaks a line. Avatar actions written inline (`[wave]`, `[wink]`, ...) are removed from the
   * speech and fire as the voice reaches them; voice styles such as `[happy]` or `[sad]` also set
   * the face. `emote` plays one gesture straight away, and `defaultEmote` only if the line has no
   * actions of its own.
   */
  async function speakText(rawText, { emote = "", defaultEmote = "", cues = null, cueWords = 0 } = {}) {
    const parsed = cues ? { speechText: String(rawText), cues, wordCount: cueWords } : parseSpeechCues(rawText);
    const hasActions = parsed.cues.some((c) => c.type === "action");
    const startEmote = emote || (hasActions ? "" : defaultEmote);
    if (startEmote) triggerAvatarEmote(anim, startEmote);

    // Without audio (text-only, muted, or blocked by autoplay rules) the gestures still play,
    // paced at reading speed.
    const playCuesSilently = () => {
      cueTimeline = estimateCueTimeline(parsed.cues);
      silentCueStartMs = performance.now();
    };

    // Words, or a sound the voice makes such as "[laugh]": either is something to hear.
    const hasWords = Boolean(stripSpeechTags(parsed.speechText)) || parsed.cues.some((c) => c.sound);
    const voice = hasWords ? ttsVoice || (await enginePromise) : null;
    if (!voice || isMuted) {
      stopSpeech();
      playCuesSilently();
      return;
    }

    stopSpeech();
    const Ctx = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!Ctx) {
      playCuesSilently();
      return;
    }
    audioCtx ??= new Ctx();
    if (audioCtx.state === "suspended") {
      try {
        await audioCtx.resume();
      } catch {}
    }
    if (audioCtx.state === "suspended") {
      // Browser autoplay policy requires first user gesture
      promptBadge.hidden = false;
      playCuesSilently();
      return;
    }
    promptBadge.hidden = true;

    const hasInlineTags = /\[[a-zA-Z_/]/.test(parsed.speechText);
    const speech = hasInlineTags ? voice.speakScript(parsed.speechText) : voice.speak(parsed.speechText);
    if (!speech || !speech.samples || !speech.samples.length) {
      playCuesSilently();
      return;
    }

    const buffer = audioCtx.createBuffer(1, speech.samples.length, speech.sampleRate);
    buffer.copyToChannel(speech.samples, 0);
    sourceNode = audioCtx.createBufferSource();
    sourceNode.buffer = buffer;
    sourceNode.connect(audioCtx.destination);

    activeSpeech = speech;
    cueTimeline = buildCueTimeline(speech, parsed.cues, parsed.wordCount);
    silentCueStartMs = 0;
    playStartedAt = audioCtx.currentTime + 0.015;
    isPlaying = true;
    setSpeakBtn(true);
    headStatusEl.textContent = "Speaking";

    sourceNode.start(playStartedAt);
    sourceNode.onended = () => {
      // Fire anything still pending (a gesture written at the very end of the line), then relax the face.
      runDueCues(anim, cueTimeline, Infinity);
      cueTimeline = null;
      setAvatarMood(anim, restingMood());
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
    // Matching takes about a millisecond, so the answer is shown at once and the voice starts with it.
    const res = aiml.reply(q);
    appendChatMessage("bot", res.displayText);
    renderChips(res.chips && res.chips.length ? res.chips : defaultChips());
    saveSession();

    // Wake the audio output while still inside the click or key press, let the answer paint,
    // then render the voice.
    const Ctx = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (Ctx && !isMuted) {
      audioCtx ??= new Ctx();
      if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
    }
    await new Promise((resolve) => {
      requestAnimationFrame(() => setTimeout(resolve, 0));
      setTimeout(resolve, 80); // animation frames do not fire in a background tab
    });
    if (destroyed) return;
    await speakText(res.speechText, { cues: res.cues, cueWords: res.cueWords });
  }

  // Wire UI events
  const toggleGreeting = () => {
    if (isPlaying) stopSpeech();
    else speakText(config.greeting, { defaultEmote: "wave" });
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
    saveSession();
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
    saveSession();
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
    typingUntilMs = 0;
    handleUserQuestion(text);
  };

  // While the visitor types, the avatar looks toward the message box.
  let typingUntilMs = 0;
  const typingPointer = { nx: 0, ny: 0, active: true };
  inputEl.addEventListener("input", () => {
    const a = stageCard.getBoundingClientRect();
    const b = inputEl.getBoundingClientRect();
    if (!a.width || !b.width) return;
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height * 0.42);
    const len = Math.hypot(dx, dy) || 1;
    typingPointer.nx = (dx / len) * 0.8;
    typingPointer.ny = (dy / len) * 0.8;
    typingUntilMs = performance.now() + 1500;
  });

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
        runDueCues(anim, cueTimeline, tSec, nowMs);
      } else if (cueTimeline && silentCueStartMs) {
        runDueCues(anim, cueTimeline, (performance.now() - silentCueStartMs) / 1000, nowMs);
        if (cueTimeline.next >= cueTimeline.items.length) {
          cueTimeline = null;
          silentCueStartMs = 0;
        }
      }
      stepAvatarPhysics(
        anim,
        nowMs,
        sampled,
        performance.now() < typingUntilMs ? typingPointer : config.eyeTracking ? pointer : null,
        config.voice?.pitchHz || 160
      );
      const ctx = canvas.getContext("2d");
      drawBotAvatar(ctx, cw, ch, config.avatar, anim, nowMs, { showVoiceWaves: true });
    }
    rafId = requestAnimationFrame(tick);
  }

  await initAimlBrain();
  restoreSession();
  // Get the matcher up to speed while the page is idle, before the first question arrives.
  (globalThis.requestIdleCallback || ((fn) => setTimeout(fn, 250)))(() => {
    if (!destroyed) aiml.warmUp();
  });
  if (config.chatEnabled && config.chatStartOpen && !messagesEl.children.length) {
    appendChatMessage("bot", stripSpeechTags(config.greeting));
  }
  rafId = requestAnimationFrame(tick);

  if (config.autoGreet) {
    enginePromise.then(() => {
      speakText(config.greeting, { defaultEmote: "wave" });
    });
  }

  return {
    hostEl,
    say: (text, emote = "") => speakText(text, { emote }),
    ask: (question) => handleUserQuestion(question),
    stop: stopSpeech,
    emote: (name, durationMs) => triggerAvatarEmote(anim, name, durationMs),
    /**
     * A sound that is not a word, in the bot's own voice and with the face to match: "laugh",
     * "sigh", "gasp", "yawn", "whistle" ... Options: `intensity` (0..1 or "gentle" / "strong"),
     * `length` (a factor, 1 is usual) or `durationMs`.
     */
    sound(name, options = {}) {
      const id = String(name || "").trim().toLowerCase().replace(/[^a-z-]/g, "");
      if (!id) return Promise.resolve();
      let tag = id;
      if (options.intensity !== undefined) tag += ` intensity=${String(options.intensity).replace(/[^\w.]/g, "")}`;
      if (options.length !== undefined) tag += ` length=${String(options.length).replace(/[^\w.]/g, "")}`;
      if (options.durationMs > 0) tag += ` for=${(Number(options.durationMs) / 1000).toFixed(2)}s`;
      return speakText(`[${tag}]`);
    },
    mood: (name) => setAvatarMood(anim, name),
    /** Forgets the conversation so far, on screen and in the bot's memory. */
    clearChat() {
      messagesEl.replaceChildren();
      transcript.length = 0;
      aiml.resetSession();
      renderChips(defaultChips());
      try {
        sessionStorage.removeItem(sessionKey);
      } catch {}
    },
    updateConfig(patch = {}) {
      const propsBefore = JSON.stringify(botPropsFromConfig());
      if (patch.name !== undefined) config.name = patch.name;
      if (patch.role !== undefined) config.role = patch.role;
      if (patch.company !== undefined) config.company = patch.company;
      if (patch.facts !== undefined) config.facts = { ...(patch.facts || {}) };
      const propsChanged = JSON.stringify(botPropsFromConfig()) !== propsBefore;
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
      if (patch.persona !== undefined) {
        config.persona = normalizePersona(patch.persona);
        aiml.setPersona(config.persona);
        setAvatarMood(anim, restingMood());
      }
      if (patch.baseBrain !== undefined && Boolean(patch.baseBrain) !== (config.baseBrain !== false)) {
        config.baseBrain = Boolean(patch.baseBrain);
        try {
          aiml.loadBaseXML(config.baseBrain ? BASE_AIML_XML : "");
        } catch {}
      }
      // Facts and names are used inside rules, so the engine re-reads them when they change.
      if (propsChanged) {
        try {
          aiml.setBotProps(botPropsFromConfig());
        } catch {}
      }
      if (patch.aimlXml !== undefined && patch.aimlXml !== config.aimlXml) {
        config.aimlXml = patch.aimlXml;
        try {
          aiml.loadXML(config.aimlXml);
          renderChips(defaultChips());
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
    version: "1.4.0",
    AIMLEngine,
    AVATAR_PRESETS,
    AVATAR_ACTIONS,
    STARTER_AIML_PACKS,
    BASE_AIML_XML,
    BOT_FACTS,
    VOICE_SOUND_TAGS,
    PERSONALITIES,
    randomPersona,
    randomBotName,
    personaGreeting,
    parseSpeechCues,
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
