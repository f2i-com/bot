import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

import { initSync, TTS } from "../vendor/tts/tts.js";
import {
  AIMLEngine,
  STARTER_AIML_PACKS,
  inspectAimlXml,
  appendAimlRule,
  stripSpeechTags,
} from "../src/aiml-engine.js";
import {
  DEFAULT_AVATAR,
  AVATAR_PRESETS,
  createAnimState,
  sampleSpeechAt,
  stepAvatarPhysics,
  getSculptHandles,
  hitTestSculptHandle,
} from "../src/avatar-renderer.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

console.log("1. Testing tts.wasm integration & 200 Hz viseme lip-sync sampling...");
const wasmBytes = fs.readFileSync(path.join(root, "vendor", "tts", "tts.wasm"));
initSync(wasmBytes);
const voice = new TTS("female");
const speech = voice.speak("Hello! Welcome to bot dot computer, please pass the butter and water.");

assert.ok(speech.samples.length > 24000, "Expected >1s of 24 kHz PCM samples");
assert.equal(speech.sampleRate, 24000);
assert.equal(speech.visemeRate, 200);
assert.equal(speech.visemeFields.length, 9);
assert.ok(speech.visemes.length >= 9 * 100, "Expected 200 Hz viseme frames");

const anim = createAnimState();
let maxJaw = 0;
let maxLipClose = 0;
let sawPhone = false;
for (let t = 0; t < speech.duration; t += 0.01) {
  const s = sampleSpeechAt(speech, t, voice.settings.pitchHz);
  assert.ok(s, `Expected sampled viseme frame at t=${t.toFixed(2)}`);
  stepAvatarPhysics(anim, t * 1000, s, { nx: 0.4, ny: -0.2, active: true }, voice.settings.pitchHz);
  if (anim.jaw > maxJaw) maxJaw = anim.jaw;
  if (anim.lipC > maxLipClose) maxLipClose = anim.lipC;
  if (anim.phone && anim.phone !== "SIL") sawPhone = true;
}
assert.ok(maxJaw > 0.15, `Expected clear jaw opening during speech, got ${maxJaw}`);
assert.ok(maxLipClose > 0.35, `Expected bilabial lip closure (/p, b, m/), got ${maxLipClose}`);
assert.ok(sawPhone, "Expected active phoneme tracking during utterance");
assert.ok(anim.lookX > 0.1, "Expected eye-tracking gaze interpolation toward pointer");
voice.free();

console.log("2. Testing body & face sculpt handles...");
const handles = getSculptHandles(520, 580, DEFAULT_AVATAR);
assert.ok(handles.length >= 10, `Expected >=10 sculpt handles in half-body mode, got ${handles.length}`);
const shoulderHandle = handles.find((h) => h.id === "shoulder");
assert.ok(shoulderHandle, "Expected shoulder sculpt handle");
const hit = hitTestSculptHandle(handles, shoulderHandle.x + 3, shoulderHandle.y - 2, 22);
assert.equal(hit?.handle.id, "shoulder");
const morphed = shoulderHandle.apply(28, -10, DEFAULT_AVATAR);
assert.ok(morphed.shoulderWidth > DEFAULT_AVATAR.shoulderWidth, "Dragging shoulder outward should widen shoulders");

console.log("3. Testing AIML 2.0 XML engine, wildcards, <srai>, memory & starter packs...");
for (const [id, pack] of Object.entries(STARTER_AIML_PACKS)) {
  const info = inspectAimlXml(pack.xml);
  assert.equal(info.valid, true, `Starter pack ${id} should be valid XML: ${info.error || ""}`);
  assert.ok(info.categories >= 5, `Starter pack ${id} should have >=5 categories`);
}

const botAiml = new AIMLEngine({
  botProps: { name: "Aria", role: "Concierge", company: "Acme" },
  xml: STARTER_AIML_PACKS.concierge.xml,
});

const r1 = botAiml.reply("Hey there!");
assert.ok(r1.displayText.includes("Aria"), `Expected <srai>HELLO</srai> with bot name, got: ${r1.displayText}`);
assert.equal(r1.emote, "wave");

const r2 = botAiml.reply("My name is Jordan");
assert.ok(r2.displayText.includes("Jordan"), `Expected captured name Jordan, got: ${r2.displayText}`);

const r3 = botAiml.reply("Yes please");
assert.ok(r3.displayText.includes("WebAssembly") || r3.displayText.includes("AIML"), `Expected <that> context follow-up, got: ${r3.displayText}`);

const r4 = botAiml.reply("What is my name?");
assert.ok(r4.displayText.includes("Jordan"), `Expected <condition> memory recall, got: ${r4.displayText}`);

const rSing = botAiml.reply("Can you sing a song?");
assert.ok(rSing.speechText.includes("[sing"), "Expected inline [sing] tag for TTS engine");
assert.ok(!rSing.displayText.includes("[sing"), "Display text should cleanly format sung lyrics");

const updatedXml = appendAimlRule(STARTER_AIML_PACKS.concierge.xml, {
  pattern: "# REFUND POLICY #",
  answer: "[calm] Full refunds within 30 days!",
  chips: ["Pricing", "Support"],
  emote: "nod",
});
botAiml.loadXML(updatedXml);
const rCustom = botAiml.reply("Tell me about your refund policy please");
assert.equal(rCustom.displayText, "Full refunds within 30 days!");
assert.equal(rCustom.emote, "nod");
assert.equal(rCustom.chips.length, 2);

// Quick-add rules accept `|`-separated alternatives; each one must match on its own.
const aliasXml = appendAimlRule(STARTER_AIML_PACKS.concierge.xml, {
  pattern: "# opening hours # | when are you open",
  answer: "We're open 9 to 5 & always online!",
});
assert.equal(inspectAimlXml(aliasXml).valid, true, "Alias rule should produce valid XML");
botAiml.loadXML(aliasXml);
assert.equal(botAiml.reply("When are you open?").displayText, "We're open 9 to 5 & always online!");
assert.equal(botAiml.reply("What are your opening hours today").displayText, "We're open 9 to 5 & always online!");

const badXmlCheck = inspectAimlXml("<aiml><category><pattern>HI</pattern><template>Unclosed</aiml>");
assert.equal(badXmlCheck.valid, false, "Malformed XML should be caught with line diagnostics");

console.log("4. Testing standalone embed/bot-embed.js bundle...");
const embedBundleCode = fs.readFileSync(path.join(root, "embed", "bot-embed.js"), "utf8");
const sandbox = { console, TextEncoder, TextDecoder, Uint8Array, Float32Array, Float64Array, WebAssembly };
sandbox.globalThis = sandbox;
vm.runInNewContext(embedBundleCode, sandbox);
assert.ok(sandbox.BotComputer, "Expected global BotComputer SDK");
assert.equal(typeof sandbox.BotComputer.mount, "function");
assert.equal(sandbox.BotComputer.AVATAR_PRESETS.length, AVATAR_PRESETS.length);

console.log("✓ All bot.computer smoke tests passed!");
