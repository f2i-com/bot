// Embeddable Website Companion Widget Core for bot.computer.
// Supports both ES module import inside the studio preview AND standalone bundling into `embed/bot-embed.js`
// (including 100% self-contained single-file downloads with gzipped base64 `tts.wasm` baked inside).

import { LiveAvatar } from "./turntable/live-avatar.js";
import { HAS_WEBGL, HAS_SPEECH, HAS_CHAT, HAS_BASE_BRAIN, FULL_SDK } from "./embed-capabilities.js";
import { createVisitorCustomizer, visitorLookKey } from "./visitor-customizer.js";
import { createPageShowcase } from "./page-showcase.js";
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
  replyDisplayText,
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
.bc-stage-slot { display: contents; }
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
.bc-stage-card canvas[hidden] { display: none; }
.bc-stage-card canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
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
.bc-root [hidden], .bc-root.customizing .bc-chat:not(.bc-customizer) { display: none; }
.bc-customizer { width: 306px; }
.bc-look-body { overflow-y: auto; overscroll-behavior: contain; min-height: 0; padding: 15px; }
.bc-look-fields, .bc-look-colors { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.bc-look-fields label, .bc-look-colors label { color: #3b4556; font: 600 12px/1.35 system-ui, sans-serif; }
.bc-look-fields label { display: grid; gap: 5px; }
.bc-look-fields select {
  width: 100%; min-width: 0; padding: 7px 4px; border-radius: 7px; border: 1px solid #c8d0df;
  color: #202837; background: #fff; font: 400 13px/1.3 system-ui, sans-serif;
}
.bc-look-colors { border-top: 1px solid #e1e5ec; margin-top: 14px; padding-top: 13px; gap: 8px 12px; }
.bc-look-colors label { display: flex; align-items: center; justify-content: space-between; gap: 4px; }
.bc-look-colors input {
  appearance: none; box-sizing: border-box; width: 35px; height: 30px; padding: 3px; border: 1px solid #c8d0df;
  border-radius: 8px; background: #fff; cursor: pointer;
}
.bc-look-colors input::-webkit-color-swatch-wrapper { padding: 0; }
.bc-look-colors input::-webkit-color-swatch { border: 0; border-radius: 4px; }
.bc-look-colors input::-moz-color-swatch { border: 0; border-radius: 4px; }
.bc-look-footer {
  display: flex; align-items: center; justify-content: space-between; flex: none; padding: 9px 13px;
  border-top: 1px solid #e1e5ec; background: #f6f8fb;
}
.bc-look-reset { border: 0; background: transparent; color: #374257; padding: 6px 0; font: 600 12px system-ui; cursor: pointer; }
.bc-look-reset:disabled { opacity: .5; cursor: default; }
.bc-customizer :focus-visible { outline: 2px solid #3549ca; outline-offset: 2px; }
.bc-look-toggle[aria-expanded="true"] { background: #e6eaff; color: #192558; }
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
.bc-root.is-narrow-host:is(.chat-is-open,.customizing) .bc-stage-card {
  width: 88px;
  height: 104px;
}
.bc-root.is-narrow-host:is(.chat-is-open,.customizing) .bc-stage-card.shape-circle {
  width: 84px;
  height: 84px;
}
.bc-root.is-narrow-host .bc-chat {
  width: 100%;
  max-width: 100%;
  max-height: 340px;
}
.bc-root.is-narrow-host.pos-contained .bc-customizer {
  max-height: min(390px, calc(var(--bc-host-h, 520px) - 182px), calc(100dvh - 192px));
}
.bc-root.is-narrow-host .bc-stage-wrap { max-width: 100%; }
.bc-root.is-narrow-host .bc-controls { max-width: 100%; gap: 2px; flex-wrap: wrap; justify-content: center; }
.bc-root.is-narrow-host .bc-btn {
  min-height: 34px;
  padding: 0 6px;
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
  .bc-root:is(.chat-is-open,.customizing) .bc-stage-card {
    width: 88px;
    height: 104px;
  }
  .bc-root:is(.chat-is-open,.customizing) .bc-stage-card.shape-circle {
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
  .bc-customizer { max-height: min(398px, calc(100dvh - 186px - env(safe-area-inset-bottom, 0px))); }
  .bc-look-fields select { font-size: 16px; }
}
@media (max-width: 640px) and (min-height: 600px) {
  .bc-root.customizing:not(.is-narrow-host) .bc-stage-card { width: 136px; height: 164px; }
  .bc-root.customizing:not(.is-narrow-host) .bc-stage-card.shape-circle { width: 136px; height: 136px; }
  .bc-customizer { max-height: min(398px, calc(100dvh - 250px - env(safe-area-inset-bottom, 0px))); }
}
@media (max-width: 360px) {
  .bc-controls { gap: 2px; }
  .bc-controls .bc-btn { padding: 0 6px; }
}

${HAS_CHAT ? `
.bc-guide-layer { position: fixed; inset: 0; pointer-events: none; z-index: 2147483001; overflow: hidden; }
.bc-guide-layer.is-contained { position: absolute; z-index: 21; }
.bc-guide-layer[hidden], .bc-guide-ring[hidden], .bc-guide-summary { display: none; }
.bc-guide-ring {
  position: absolute; pointer-events: none; border: 3px solid #544bd1;
  box-shadow: inset 0 0 0 2px #fff, 0 0 0 2px #fff, 0 0 12px #25207155;
}
.bc-root.is-guiding {
  position: fixed; right: auto; bottom: auto; left: var(--bc-guide-x); top: var(--bc-guide-y);
  z-index: 2147483002;
  width: min(260px, var(--bc-guide-width)); max-width: none; padding: 0;
  transition: left .23s ease-out, top .23s ease-out;
}
.bc-root.pos-contained.is-guiding { position: absolute; z-index: 22; }
.bc-root.is-guiding .bc-companion-row { display: block; max-width: none; width: 100%; }
.bc-root.is-guiding .bc-stage-wrap {
  display: flex; flex-direction: row; align-items: center; width: 100%; gap: 4px;
  padding: 5px 8px 5px 2px; color: #24253a; background: #fff; border: 1px solid #d6d1ed;
  border-radius: 15px; box-shadow: 0 6px 22px #17132d33;
}
.bc-root.avatar-on-right .bc-stage-wrap { flex-direction: row-reverse; padding: 5px 2px 5px 8px; }
.bc-root.is-guiding .bc-stage-slot { display: block; flex: 0 0 37%; }
.bc-root.is-guiding .bc-stage-wrap .bc-stage-card[role] {
  width: 100%; height: 107px; filter: none; transform: none; transition: none;
}
.bc-root.is-guiding :is(.bc-chat, .bc-controls, .bc-caption, .bc-unmute-prompt) { display: none; }
.bc-root.is-guiding .bc-guide-summary {
  display: grid; min-width: 0; flex: 1; gap: 3px;
  font: 13px/1.35 system-ui, sans-serif;
}
.bc-guide-label { font-weight: 700; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; overflow-wrap: anywhere; color: #343056; }
.bc-guide-answer { max-height: 4.05em; overflow-y: auto; overflow-wrap: anywhere; overscroll-behavior: contain; }
.bc-guide-answer:empty { display: none; }
.bc-guide-back {
  justify-self: start; border: 0; border-radius: 5px; padding: 4px 0; background: transparent;
  color: #3f37a2; font: 650 12px/1.4 system-ui, sans-serif; cursor: pointer;
}
.bc-guide-back:hover { text-decoration: underline; }
.bc-tour-progress, .bc-tour-controls { display: none; }
.bc-root.is-touring { width: min(304px, var(--bc-guide-width)); transition: none; }
.bc-root.is-touring .bc-stage-slot { height: 120px; }
.bc-root.is-touring .bc-stage-wrap .bc-stage-card[role] { height: 100%; }
.bc-root.is-travelling .bc-stage-wrap .bc-stage-card[role] {
  transform: translate3d(var(--bc-walk-x, 0px), var(--bc-walk-y, 0px), 0);
  pointer-events: none; z-index: 1;
}
.bc-root.is-travelling .bc-guide-answer { visibility: hidden; }
.bc-root.is-travelling .bc-stage-wrap { background: transparent; border-color: transparent; box-shadow: none; }
.bc-root.is-travelling .bc-guide-summary { position: relative; isolation: isolate; }
.bc-root.is-travelling .bc-guide-summary::before {
  content: ""; position: absolute; z-index: -1; inset: -6px; background: #fff;
  border: 1px solid #d6d1ed; border-radius: 12px; box-shadow: 0 4px 16px #17132d22;
}
.bc-root.is-touring .bc-guide-back { display: none; }
.bc-root.is-touring .bc-tour-progress { display: block; color: #58516d; font: 600 11px/1.4 system-ui, sans-serif; }
.bc-root.is-touring .bc-tour-controls { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 3px; }
.bc-tour-controls button {
  min-height: 32px; padding: 3px 7px; border-radius: 6px; border: 1px solid #d6d1ed;
  background: white; color: #38325d; font: 600 12px/1.3 system-ui, sans-serif; cursor: pointer;
}
.bc-tour-controls .bc-tour-next:not(:disabled), .bc-tour-controls .bc-tour-next:disabled + .bc-tour-finish {
  background: #463baf; border-color: #463baf; color: white;
}
.bc-tour-controls button:disabled { opacity: .44; cursor: default; }
.bc-tour-controls button:focus-visible { outline: 2px solid #4239a9; outline-offset: 2px; }
@media (pointer: coarse), (max-width: 640px) {
  .bc-tour-controls button { min-width: 44px; min-height: 44px; }
}
@media (prefers-reduced-motion: reduce) { .bc-root.is-guiding { transition: none; } }
` : ""}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
  }
}
`;

// Inline line icons (a Shadow DOM widget can't reference the host page's icon sprite).
const ICONS = {
  look: '<svg class="bc-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21a9 9 0 1 1 9-9c0 2.5-1.5 4-4 4h-2a1.5 1.5 0 0 0-1.3 2.3l.4.6C15 20.2 13.7 21 12 21Z"/><circle cx="7.5" cy="11" r=".8"/><circle cx="10" cy="7" r=".8"/><circle cx="15" cy="8" r=".8"/></svg>',
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
    speechEnabled: true,
    chatStartOpen: false,
    allowVisitorCustomization: false,
    baseBrain: true, // everyday small talk underneath your own AIML rules
    facts: {}, // { about, hours, email, phone, address, pricing }: answered without writing any rules
    rememberChat: true, // keep the conversation when the visitor moves to another page (this tab only)
    persona: null, // a personality: "bubbly", "grumpy", ... or an object (see persona.js); null for none
    wasmUrl: "./tts.wasm",
    aimlUrl: "",
    aimlXml: !FULL_SDK || userConfig.aimlUrl ? "" : STARTER_AIML_PACKS.concierge.xml,
    voice: { gender: "female", pitchHz: 192, speed: 1.05, expressiveness: 1.06 },
    avatar: { ...DEFAULT_AVATAR },
    ...userConfig,
  };
  if (!HAS_CHAT) config.chatEnabled = false;
  if (!HAS_SPEECH) config.speechEnabled = false;
  if (!HAS_WEBGL) config.renderMode = "2d";
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

      <section id="bc-look" class="bc-chat bc-customizer" aria-label="Customize avatar" hidden>
        <header class="bc-chat-head">
          <div class="bc-chat-title"><strong>Customize avatar</strong><span>Only your view changes</span></div>
          <button type="button" class="bc-chat-close bc-look-close" aria-label="Close customizer">${ICONS.close}</button>
        </header>
        <div class="bc-look-body">
          <div class="bc-look-fields"></div>
          <div class="bc-look-colors"></div>
        </div>
        <footer class="bc-look-footer">
          <button type="button" class="bc-look-reset">Restore original look</button>
          <button type="button" class="bc-btn accent bc-look-done">Done</button>
        </footer>
      </section>
      <div class="bc-stage-wrap">
        <div class="bc-caption" aria-live="off"></div>
        <div class="bc-stage-slot">
          <div class="bc-stage-card" role="button" tabindex="0">
            <canvas width="360" height="440"></canvas>
            <canvas class="bc-model" width="360" height="440" aria-hidden="true"></canvas>
            <div class="bc-unmute-prompt" hidden>Tap to hear</div>
          </div>
        </div>
${HAS_CHAT ? `        <div class="bc-guide-summary">
          <div role="status" aria-atomic="true"><span id="bc-tour-progress" class="bc-tour-progress"></span><strong id="bc-guide-label" class="bc-guide-label"></strong></div>
          <div id="bc-guide-answer" class="bc-guide-answer"></div>
          <button type="button" class="bc-guide-back" aria-describedby="bc-guide-label bc-guide-answer">← Back to chat</button>
          <div class="bc-tour-controls" role="group" aria-label="Tour navigation" aria-describedby="bc-tour-progress bc-guide-label bc-guide-answer">
            <button type="button" class="bc-tour-prev">Back</button>
            <button type="button" class="bc-tour-next">Next</button>
            <button type="button" class="bc-tour-finish">Finish</button>
          </div>
        </div>` : ""}
        <div class="bc-controls">
          <button type="button" class="bc-btn bc-speak-btn" title="Speak the greeting">${ICONS.play}<span>Speak</span></button>
          <button type="button" class="bc-btn accent bc-ask-btn" title="Ask a question">${ICONS.chat}<span>Ask</span></button>
          <button type="button" class="bc-btn bc-look-toggle" aria-label="Customize avatar" title="Customize avatar" aria-controls="bc-look" aria-expanded="false" hidden>${ICONS.look}<span>Customize</span></button>
          <button type="button" class="bc-btn bc-mute-btn" title="Mute" aria-label="Mute" aria-pressed="false">${ICONS.volume}</button>
          <button type="button" class="bc-btn bc-min-btn" title="Minimize" aria-label="Minimize">${ICONS.minus}</button>
        </div>
      </div>
    </div>
  `;
  shadow.appendChild(rootEl);

  const canvas = rootEl.querySelector("canvas");
  const modelCanvas = rootEl.querySelector(".bc-model");
  let liveAvatar = null;
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
  const lookBtn = rootEl.querySelector(".bc-look-toggle");
  const lookPanel = rootEl.querySelector(".bc-customizer");
  let lookEditor = null;
  let lookKey = visitorLookKey(config);
  let displayAvatar = config.avatar;

  function setLookOpen(open, returnFocus = false) {
    lookPanel.hidden = !open;
    lookPanel.classList.toggle("open", open);
    rootEl.classList.toggle("customizing", open);
    lookBtn.setAttribute("aria-expanded", String(open));
    if (open) lookPanel.querySelector("select")?.focus({ preventScroll: true });
    else if (returnFocus) lookBtn.focus({ preventScroll: true });
  }

  function syncLook() {
    const enabled = config.allowVisitorCustomization === true;
    if (!enabled && (lookPanel.contains(shadow.activeElement) || shadow.activeElement === lookBtn)) {
      (config.chatEnabled ? askBtn : stageCard).focus({ preventScroll: true });
    }
    lookBtn.hidden = !enabled;
    if (!enabled) {
      setLookOpen(false);
      displayAvatar = config.avatar;
    } else if (lookEditor) {
      lookEditor.setOwnerAvatar(config.avatar);
    } else {
      lookEditor = createVisitorCustomizer({
        panel: lookPanel,
        ownerAvatar: config.avatar,
        storageKey: internalOpts.preview ? null : lookKey,
        onChange: avatar => { displayAvatar = avatar; },
      });
    }
  }
  function openCustomizer() {
    if (config.allowVisitorCustomization !== true || destroyed) return false;
    showcase.end();
    rootEl.classList.remove("is-minimized");
    setLookOpen(true);
    return true;
  }
  lookBtn.onclick = () => {
    if (lookPanel.hidden) openCustomizer();
    else setLookOpen(false, true);
  };
  for (const button of lookPanel.querySelectorAll(".bc-look-close, .bc-look-done")) {
    button.onclick = () => setLookOpen(false, true);
  }
  lookPanel.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      event.preventDefault();
      setLookOpen(false, true);
    }
  });
  syncLook();

  const STATUS_READY = "Ready";
  const setSpeakBtn = (playing) => {
    speakBtn.innerHTML = `${playing ? ICONS.stop : ICONS.play}<span>${playing ? "Stop" : config.speechEnabled ? "Speak" : "Greet"}</span>`;
  };

  /** Writes every piece of configured text into the DOM (safe for any characters). */
  function applyIdentityText() {
    const name = String(config.name || "Companion");
    headNameEl.textContent = config.role ? `${name} · ${config.role}` : name;
    pillLabel.textContent = name;
    minPill.title = `Open ${name}`;
    chatPanel.setAttribute("aria-label", `Chat with ${name}`);
    const guiding = rootEl.classList.contains("is-guiding");
    stageCard.title = guiding ? "Replay this answer" : config.speechEnabled ? `Click to hear ${name}` : `Show the greeting from ${name}`;
    stageCard.setAttribute("aria-label", stageCard.title);
  }
  const syncStageShape = () => {
    const circle = config.avatar.stageShape === "circle" && config.avatar.framing !== "cutout";
    stageCard.classList.toggle("shape-circle", circle);
  };
  applyIdentityText();
  syncStageShape();
  if (!config.speechEnabled) {
    muteBtn.style.display = "none";
    speakBtn.title = "Show the greeting";
    setSpeakBtn(false);
  }

  if (!config.chatEnabled) {
    askBtn.style.display = "none";
  } else if (config.chatStartOpen) {
    chatPanel.classList.add("open");
    rootEl.classList.add("chat-is-open");
  }

  // Initialize AIML Engine (your rules on top, the base small-talk layer underneath)
  const botPropsFromConfig = () => {
    if (!HAS_CHAT) return {};
    const facts = config.facts && typeof config.facts === "object" ? config.facts : {};
    const props = { name: config.name, role: config.role, company: config.company, website: config.website };
    for (const { key } of BOT_FACTS) props[key] = String(facts[key] ?? "").trim();
    return props;
  };
  const aiml = HAS_CHAT ? new AIMLEngine({
    botProps: botPropsFromConfig(),
    baseXml: HAS_BASE_BRAIN && config.baseBrain !== false ? BASE_AIML_XML : "",
    persona: config.persona,
  }) : null;
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
  const rememberChat = HAS_CHAT && config.rememberChat !== false && config.position !== "contained" && !internalOpts.preview;
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
  const showcase = HAS_CHAT ? createPageShowcase({
    root: rootEl, stage: stageCard, host: hostEl, parent: parentTarget, position: config.position, anim,
    onModeChange: applyIdentityText,
    onReturn: () => (chatPanel.classList.contains("open") ? inputEl : stageCard).focus({ preventScroll: true }),
    onTourDepart: () => {
      stopSpeech();
      triggerAvatarEmote(anim, "rest");
      unlockAudio();
    },
    onTourStop: (stop, firstVisit) => {
      if (firstVisit) {
        appendChatMessage("bot", replyDisplayText(stop) || `[Show ${stop.target}]`);
        saveSession();
      }
      playAnswer(stop);
    },
    onTourEnd: () => {
      stopSpeech();
      triggerAvatarEmote(anim, "rest");
    },
  }) : { end() {}, refresh() { return null; } };
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
  let speechRevision = 0;
  let lastReply = null;
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
    speechRevision++;
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

  let enginePromise;
  function requestVoice() {
    if (HAS_SPEECH && config.speechEnabled) {
      enginePromise ??= loadTtsEngine({
        wasmUrl: config.wasmUrl,
        wasmBytes: internalOpts.wasmBytes,
        embeddedWasmGzBase64: internalOpts.embeddedWasmGzBase64 || globalThis.__BOT_COMPUTER_EMBEDDED_WASM_GZ__,
        bindTTSFn: internalOpts.bindTTSFn,
      }).then(({ TTS }) => {
        if (destroyed) return null;
        ttsVoice = new TTS(config.voice || "female");
        config.voice = ttsVoice.settings;
        return ttsVoice;
      }).catch(error => {
        console.error("[bot.computer] TTS engine load error:", error);
        headStatusEl.textContent = "Text only (voice unavailable)";
        return null;
      });
      return enginePromise;
    }
    return Promise.resolve(null);
  }

  // Unlock during the original visitor gesture, before downloading the voice or painting a reply.
  function unlockAudio() {
    const Ctx = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (HAS_SPEECH && config.speechEnabled && !isMuted && Ctx) {
      audioCtx ??= new Ctx();
      if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
    }
  }

  /**
   * Speaks a line. Avatar actions written inline (`[wave]`, `[wink]`, ...) are removed from the
   * speech and fire as the voice reaches them; voice styles such as `[happy]` or `[sad]` also set
   * the face. `emote` plays one gesture straight away, and `defaultEmote` only if the line has no
   * actions of its own.
   */
  async function speakText(rawText, { emote = "", defaultEmote = "", cues = null, cueWords = 0 } = {}) {
    stopSpeech();
    const revision = speechRevision;
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
    if (hasWords) unlockAudio();
    const voice = HAS_SPEECH && config.speechEnabled && hasWords && !isMuted ? ttsVoice || (await requestVoice()) : null;
    if (destroyed || revision !== speechRevision) return;
    if (!voice || isMuted) {
      playCuesSilently();
      if (!config.speechEnabled && config.showCaptions && hasWords) {
        captionEl.textContent = stripSpeechTags(parsed.speechText);
        captionEl.classList.add("visible");
        clearTimeout(captionTimer);
        captionTimer = setTimeout(() => captionEl.classList.remove("visible"), Math.max(3500, Math.min(15000, parsed.wordCount * 350)));
      }
      return;
    }

    if (!audioCtx) {
      playCuesSilently();
      return;
    }
    if (audioCtx.state === "suspended") {
      try {
        await audioCtx.resume();
      } catch {}
    }
    if (destroyed || revision !== speechRevision) return;
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
    if (!HAS_CHAT) return;
    const q = String(queryText || "").trim();
    if (!q) return;
    const departure = stageCard.getBoundingClientRect();
    if (!lookPanel.hidden) setLookOpen(false);
    if (!chatPanel.classList.contains("open")) {
      chatPanel.classList.add("open");
      rootEl.classList.add("chat-is-open");
      captionEl.classList.remove("visible");
    }
    appendChatMessage("user", displayLabel || q);
    const res = aiml.reply(q);
    lastReply = res;
    const stop = res.tour?.length ? showcase.startTour(res.tour, departure) : null;
    if (!stop) {
      appendChatMessage("bot", replyDisplayText(res));
      showcase.start(res.showcase, res.displayText || "");
    }
    renderChips(res.chips && res.chips.length ? res.chips : defaultChips());
    saveSession();
    if (!stop) await playAnswer(res);
  }

  async function playAnswer(answer) {
    stopSpeech();
    if (showcase.currentStop) triggerAvatarEmote(anim, "rest");
    const revision = speechRevision;
    // Wake the audio output while still inside the click or key press, let the answer paint,
    // then render the voice.
    unlockAudio();
    await new Promise((resolve) => {
      requestAnimationFrame(() => setTimeout(resolve, 0));
      setTimeout(resolve, 80); // animation frames do not fire in a background tab
    });
    if (destroyed || revision !== speechRevision) return;
    await speakText(answer.speechText, { cues: answer.cues, cueWords: answer.cueWords });
  }

  // Wire UI events
  const toggleGreeting = () => {
    if (anim.guideTravel) return;
    if (isPlaying) stopSpeech();
    else if (rootEl.classList.contains("is-guiding") && lastReply) {
      const answer = showcase.currentStop || lastReply;
      speakText(answer.speechText, { cues: answer.cues, cueWords: answer.cueWords });
    } else speakText(config.greeting, { defaultEmote: "wave" });
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
    const wasCustomizing = !lookPanel.hidden;
    if (wasCustomizing) setLookOpen(false);
    const open = wasCustomizing || !chatPanel.classList.contains("open");
    chatPanel.classList.toggle("open", open);
    rootEl.classList.toggle("chat-is-open", open);
    if (open) {
      captionEl.classList.remove("visible");
      if (!messagesEl.children.length) {
        appendChatMessage("bot", stripSpeechTags(config.greeting));
      }
      inputEl.focus({ preventScroll: true });
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
    if (!lookPanel.hidden) setLookOpen(false);
    rootEl.classList.add("is-minimized");
    minPill.focus({ preventScroll: true });
  };

  minPill.onclick = () => {
    rootEl.classList.remove("is-minimized");
    minBtn.focus({ preventScroll: true });
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
  if (["inline", "contained"].includes(config.position) && typeof ResizeObserver === "function") {
    const syncNarrow = () => {
      rootEl.classList.toggle("is-narrow-host", parentTarget.clientWidth <= 640);
      if (config.position === "contained") rootEl.style.setProperty("--bc-host-h", `${parentTarget.clientHeight}px`);
    };
    syncNarrow();
    resizeObs = new ResizeObserver(syncNarrow);
    resizeObs.observe(parentTarget);
  }

  let stageOnScreen = typeof IntersectionObserver !== "function";
  const visibilityObserver = typeof IntersectionObserver === "function" ? new IntersectionObserver(([entry]) => {
    stageOnScreen = entry.isIntersecting;
  }) : null;
  visibilityObserver?.observe(stageCard);

  // Speech and cue timing continue while the avatar is outside the viewport.
  function tick(nowMs) {
    if (destroyed) return;
    if (!document.hidden && !rootEl.classList.contains("is-minimized")) {
      const guidePointer = showcase.refresh();
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
        guidePointer || (performance.now() < typingUntilMs ? typingPointer : config.eyeTracking ? pointer : null),
        config.voice?.pitchHz || 160
      );
      if (stageOnScreen || anim.guideTravel) {
        const guided = rootEl.classList.contains("is-guiding");
        const avatar = guided ? { ...displayAvatar, framing: "half", stageShape: "cutout", bgStyle: "transparent" } : displayAvatar;
        const framing = anim.guideTravel?.phase === "walk" ? "full" : avatar.framing;
        const options = { framing, smoothFraming: guided, showVoiceWaves: !guided };
        if (!HAS_WEBGL || config.renderMode === "2d") {
          modelCanvas.hidden = true;
          drawBotAvatar(canvas.getContext("2d"), cw, ch, framing === avatar.framing ? avatar : { ...avatar, framing }, anim, nowMs, options);
        } else {
          options.force = modelCanvas.hidden;
          modelCanvas.hidden = false;
          liveAvatar ??= new LiveAvatar(modelCanvas, canvas, { orbitControls: false, view: "front" });
          liveAvatar.render(avatar, anim, nowMs, options);
        }
      }
    }
    rafId = requestAnimationFrame(tick);
  }

  if (HAS_CHAT) await initAimlBrain();
  restoreSession();
  // Get the matcher up to speed while the page is idle, before the first question arrives.
  (globalThis.requestIdleCallback || ((fn) => setTimeout(fn, 250)))(() => {
    if (HAS_CHAT && !destroyed) aiml.warmUp();
  });
  if (config.chatEnabled && config.chatStartOpen && !messagesEl.children.length) {
    appendChatMessage("bot", stripSpeechTags(config.greeting));
  }
  rafId = requestAnimationFrame(tick);

  if (config.autoGreet) {
    requestVoice().then(() => {
      if (!destroyed && !lastReply && !isPlaying) speakText(config.greeting, { defaultEmote: "wave" });
    });
  }

  return {
    hostEl,
    openCustomizer,
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
      showcase.end();
      stopSpeech();
      lastReply = null;
      messagesEl.replaceChildren();
      transcript.length = 0;
      if (HAS_CHAT) {
        aiml.resetSession();
        renderChips(defaultChips());
      }
      try {
        sessionStorage.removeItem(sessionKey);
      } catch {}
    },
    updateConfig(patch = {}) {
      const propsBefore = JSON.stringify(botPropsFromConfig());
      const identityChanged = ["name", "role", "company"].some(key => patch[key] !== undefined && patch[key] !== config[key]);
      if (patch.name !== undefined) config.name = patch.name;
      if (patch.role !== undefined) config.role = patch.role;
      if (patch.company !== undefined) config.company = patch.company;
      if (patch.facts !== undefined) config.facts = { ...(patch.facts || {}) };
      const propsChanged = JSON.stringify(botPropsFromConfig()) !== propsBefore;
      if (patch.greeting !== undefined) config.greeting = patch.greeting;
      if (HAS_SPEECH && patch.speechEnabled !== undefined && config.speechEnabled !== Boolean(patch.speechEnabled)) {
        config.speechEnabled = Boolean(patch.speechEnabled);
        stopSpeech();
        muteBtn.style.display = config.speechEnabled ? "" : "none";
        speakBtn.title = config.speechEnabled ? "Speak the greeting" : "Show the greeting";
        setSpeakBtn(false);
      }
      if (patch.renderMode !== undefined) config.renderMode = patch.renderMode;
      if (patch.eyeTracking !== undefined) config.eyeTracking = patch.eyeTracking;
      if (patch.showCaptions !== undefined) config.showCaptions = patch.showCaptions;
      if (HAS_CHAT && patch.chatEnabled !== undefined) {
        config.chatEnabled = patch.chatEnabled;
        askBtn.style.display = config.chatEnabled ? "" : "none";
        if (!config.chatEnabled) {
          showcase.end();
          chatPanel.classList.remove("open");
          rootEl.classList.remove("chat-is-open");
        }
      }
      if (patch.avatar) {
        config.avatar = { ...config.avatar, ...patch.avatar };
        syncStageShape();
      }
      if (patch.allowVisitorCustomization !== undefined) config.allowVisitorCustomization = patch.allowVisitorCustomization === true;
      if (identityChanged && !config.sessionId) {
        lookKey = visitorLookKey(config);
        lookEditor = null;
      }
      if (identityChanged || patch.avatar || patch.allowVisitorCustomization !== undefined) syncLook();
      if (patch.voice) {
        // Keep the config current even before tts.wasm has loaded, so the voice that is
        // created later starts from the latest settings rather than the mount-time ones.
        if (ttsVoice) {
          try {
            config.voice = ttsVoice.configure(patch.voice);
          } catch {}
        } else if (typeof patch.voice === "string" || patch.voice.preset) {
          config.voice = patch.voice;
        } else {
          const current = typeof config.voice === "string" ? { preset: config.voice } : config.voice;
          config.voice = { ...current, ...patch.voice };
        }
      }
      if (patch.persona !== undefined) {
        config.persona = normalizePersona(patch.persona);
        if (HAS_CHAT) aiml.setPersona(config.persona);
        setAvatarMood(anim, restingMood());
      }
      if (HAS_BASE_BRAIN && patch.baseBrain !== undefined && Boolean(patch.baseBrain) !== (config.baseBrain !== false)) {
        config.baseBrain = Boolean(patch.baseBrain);
        try {
          aiml.loadBaseXML(config.baseBrain ? BASE_AIML_XML : "");
        } catch {}
      }
      // Facts and names are used inside rules, so the engine re-reads them when they change.
      if (HAS_CHAT && propsChanged) {
        try {
          aiml.setBotProps(botPropsFromConfig());
        } catch {}
      }
      if (HAS_CHAT && patch.aimlXml !== undefined && patch.aimlXml !== config.aimlXml) {
        showcase.end();
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
      showcase.end();
      cancelAnimationFrame(rafId);
      visibilityObserver?.disconnect();
      liveAvatar?.dispose();
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
