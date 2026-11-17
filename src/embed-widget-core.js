// Embeddable Website Companion Widget Core for bot.computer.
// Supports both ES module import inside the studio preview AND standalone bundling into `embed/bot-embed.js`
// (including 100% self-contained single-file downloads with gzipped base64 `tts.wasm` baked inside).

import {
  DEFAULT_AVATAR,
  createAnimState,
  sampleSpeechAt,
  stepAvatarPhysics,
  drawBotAvatar,
  triggerAvatarEmote,
  setAvatarMood,
  buildCueTimeline,
  estimateCueTimeline,
  runDueCues,
} from "./avatar-renderer.js";
import { normalizePersona, personaGreeting } from "./persona.js";
import {
  AIMLEngine,
  stripSpeechTags,
  parseSpeechCues,
  captionForSpokenWord,
  STARTER_AIML_PACKS,
  BASE_AIML_XML,
  BOT_FACTS,
} from "./aiml-engine.js";

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
export async function loadTtsEngine({ wasmUrl, wasmBytes, embeddedWasmGzBase64, bindTTSFn } = {}) {
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
export function appendTextWithLinks(el, text) {
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

export async function mountBotWidget(userConfig = {}, internalOpts = {}) {
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
