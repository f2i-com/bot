import { mountBotWidget } from "../src/embed-widget-core.js";
import { AVATAR_ACTIONS, AVATAR_PRESETS } from "../src/avatar-renderer.js";
import { PERSONALITIES, randomPersona, randomBotName, personaGreeting } from "../src/persona.js";
import { AIMLEngine, STARTER_AIML_PACKS, BASE_AIML_XML, BOT_FACTS, VOICE_SOUND_TAGS, parseSpeechCues } from "../src/aiml-engine.js";
import { FULL_SDK, HAS_SPEECH } from "../src/embed-capabilities.js";
import { bindTTS } from "#tts-bindings";
import { version } from "../package.json";

// Capture each script's own settings before the next deferred widget runs.
const script = typeof document === "undefined" ? null : document.currentScript;
const packedConfig = globalThis.__BOT_COMPUTER_AUTO_CONFIG__;
const packedVoice = globalThis.__BOT_COMPUTER_EMBEDDED_WASM_GZ__;
if (packedConfig) delete globalThis.__BOT_COMPUTER_AUTO_CONFIG__;
if (packedVoice) delete globalThis.__BOT_COMPUTER_EMBEDDED_WASM_GZ__;

const sdk = {
  version,
  mount(config = {}) {
    const wasmUrl = config.wasmUrl || (script?.src ? new URL("../vendor/tts/tts.wasm", script.src).href : "./tts.wasm");
    return mountBotWidget({ ...config, wasmUrl }, {
      bindTTSFn: HAS_SPEECH ? bindTTS : null,
      embeddedWasmGzBase64: packedVoice,
    });
  },
};
if (FULL_SDK) Object.assign(sdk, {
  AIMLEngine, AVATAR_PRESETS, AVATAR_ACTIONS, STARTER_AIML_PACKS, BASE_AIML_XML, BOT_FACTS,
  VOICE_SOUND_TAGS, PERSONALITIES, randomPersona, randomBotName, personaGreeting, parseSpeechCues,
});
const runtimes = globalThis.BotComputer?.runtimes || Object.create(null);
sdk.runtimes = runtimes;
runtimes[__BC_RUNTIME_NAME__] = sdk;
if (FULL_SDK || !globalThis.BotComputer) globalThis.BotComputer = sdk;

function autoBoot() {
  if (packedConfig) return sdk.mount(packedConfig);
  if (!script) return;
  const ds = script.dataset;
  if (ds.nomount === "true" || ds.manual === "true") return;
  if (!["config", "name", "aiml", "wasm", "autostart", "customize", "renderMode", "speech", "chat"].some(key => ds[key] !== undefined)) return;
  let config = {};
  if (ds.config) {
    try { config = JSON.parse(ds.config); }
    catch (error) { console.warn("[bot.computer] Invalid JSON in data-config:", error); }
  }
  for (const key of ["name", "role", "company", "greeting", "position", "size", "renderMode"]) {
    if (ds[key]) config[key] = ds[key];
  }
  if (ds.wasm) config.wasmUrl = ds.wasm;
  if (ds.aiml) config.aimlUrl = ds.aiml;
  if (ds.customize !== undefined) config.allowVisitorCustomization = ds.customize === "true";
  if (ds.chat !== undefined) config.chatEnabled = ds.chat !== "false";
  if (ds.speech !== undefined) config.speechEnabled = ds.speech !== "false";
  if (ds.autogreet !== undefined) config.autoGreet = ds.autogreet === "true";
  return sdk.mount(config);
}
if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", autoBoot, { once: true });
  else autoBoot();
}
