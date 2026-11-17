// Bundles `vendor/tts/glue.js`, `src/avatar-renderer.js`, `src/persona.js`, `src/aiml-engine.js`, and
// `src/embed-widget-core.js` into a standalone, zero-dependency `<script src="bot-embed.js">`
// file in `embed/bot-embed.js`!
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "embed");
fs.mkdirSync(outDir, { recursive: true });

function stripEsmSyntax(code) {
  return code
    .replace(/^\s*import\s+[\s\S]*?from\s+["'][^"']+["'];?\s*$/gm, "")
    .replace(/^\s*export\s+default\s+/gm, "")
    .replace(/^\s*export\s+(?=(?:async\s+)?(?:function|class|const|let|var)\b)/gm, "");
}

const glueSrc = fs
  .readFileSync(path.join(root, "vendor", "tts", "glue.js"), "utf8")
  .replace(/if\s*\(typeof wasm !== "undefined"[\s\S]*$/, "")
  .trim();

const rendererSrc = stripEsmSyntax(
  fs.readFileSync(path.join(root, "src", "avatar-renderer.js"), "utf8")
);
const personaSrc = stripEsmSyntax(
  fs.readFileSync(path.join(root, "src", "persona.js"), "utf8")
);
const aimlSrc = stripEsmSyntax(
  fs.readFileSync(path.join(root, "src", "aiml-engine.js"), "utf8")
);
const widgetSrc = stripEsmSyntax(
  fs.readFileSync(path.join(root, "src", "embed-widget-core.js"), "utf8")
);

const currentScriptTag = new URL(".", import.meta.url).href; // build-time unused

const bundle = `/*!
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
${glueSrc}

  // --- 2. 2.5D SitePal-Style Avatar Renderer & 200 Hz Lip-Sync ---
${rendererSrc}

  // --- 3. Personalities: how a bot words and delivers its replies ---
${personaSrc}

  // --- 3b. AIML 1.0 / 2.0 XML Pattern-Matching Chatbot Engine ---
${aimlSrc}

  // --- 4. Shadow DOM Companion Widget ---
${widgetSrc}

  function resolveDefaultWasmUrl(scriptEl) {
    if (scriptEl && scriptEl.src) {
      try {
        return new URL("../vendor/tts/tts.wasm", scriptEl.src).href;
      } catch {}
    }
    return "./tts.wasm";
  }

  const BotComputer = {
    version: "1.3.0",
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

  // Auto-mount if configured via global \`window.BOT_COMPUTER_CONFIG\` or \`data-*\` attributes on <script>
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
`;

const outPath = path.join(outDir, "bot-embed.js");
fs.writeFileSync(outPath, bundle, "utf8");
console.log(
  `[build-embed] Built standalone embed/bot-embed.js (${(Buffer.byteLength(bundle) / 1024).toFixed(1)} KB)`
);
