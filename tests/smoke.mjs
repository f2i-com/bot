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
  parseSpeechCues,
  AVATAR_ACTION_TAGS,
  BASE_AIML_XML,
  BOT_FACTS,
  removeAimlRule,
  polishForSpeech,
  evaluateArithmetic,
  normalizeAimlInput,
  VOICE_SOUND_TAGS,
  captionForSpokenWord,
} from "../src/aiml-engine.js";
import {
  DEFAULT_AVATAR,
  AVATAR_PRESETS,
  createAnimState,
  sampleSpeechAt,
  stepAvatarPhysics,
  getSculptHandles,
  hitTestSculptHandle,
  AVATAR_ACTIONS,
  isAvatarAction,
  triggerAvatarEmote,
  setAvatarMood,
  buildCueTimeline,
  estimateCueTimeline,
  runDueCues,
  HAIR_STYLES,
  OUTFIT_STYLES,
  GLASSES_STYLES,
  HEADWEAR_STYLES,
  NECKWEAR_STYLES,
  BROOCH_STYLES,
  drawBotAvatar,
} from "../src/avatar-renderer.js";
import {
  PERSONALITIES,
  PERSONA_SAYS,
  BOT_NAMES,
  normalizePersona,
  randomPersona,
  personaGreeting,
  randomBotName,
  describePersona,
  stylizeReply,
  personaToXml,
} from "../src/persona.js";

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
  baseXml: BASE_AIML_XML,
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

console.log("4. Testing inline avatar actions and speech cues...");
{
  const parsed = parseSpeechCues("Hi there! [wave] I am Aria. [cheerful, wink] Ask [dance] me. [nod=800ms] [sing bpm=110] C4:1=La E4:1=la [/sing] [smile]");
  assert.ok(!/\[(wave|wink|nod|smile|dance)/.test(parsed.speechText), `Action and unknown tags must not reach the voice: ${parsed.speechText}`);
  assert.ok(parsed.speechText.includes("[cheerful]") && parsed.speechText.includes("[sing bpm=110]"), "Voice tags must be kept for the synthesizer");
  const actions = parsed.cues.filter((c) => c.type === "action");
  assert.deepEqual(actions.map((c) => [c.name, c.word]), [["wave", 2], ["wink", 5], ["nod", 7], ["smile", 9]]);
  assert.equal(actions.find((c) => c.name === "nod").ms, 800, "An action can carry its own duration");
  assert.ok(parsed.cues.some((c) => c.type === "mood" && c.name === "happy"), "[cheerful] should also set a happy facial mood");
  assert.equal(stripSpeechTags("Hello [wave], friend [wink]!"), "Hello, friend!");

  // The real synthesizer must never be handed an action tag (it would say the word "wave" aloud).
  const v = new TTS("female");
  const script = parseSpeechCues("[cheerful] Hello [wave] my friend [nod] yes.");
  const spoken = v.speakScript(script.speechText);
  assert.deepEqual(spoken.words.map((w) => w.word), ["hello", "my", "friend", "yes"]);

  // Cues line up with word timings and fire in order.
  const timeline = buildCueTimeline(spoken, script.cues, script.wordCount);
  const wave = timeline.items.find((c) => c.name === "wave");
  assert.ok(Math.abs(wave.t - (spoken.words[1].start - 0.08)) < 0.02, "[wave] after one word should fire as word two begins");
  const cueAnim = createAnimState();
  runDueCues(cueAnim, timeline, wave.t + 0.01, 1000);
  assert.equal(cueAnim.emote, "wave");
  assert.equal(cueAnim.mood, "happy");
  runDueCues(cueAnim, timeline, Infinity, 2000);
  assert.equal(cueAnim.emote, "nod");
  assert.equal(estimateCueTimeline(script.cues).items.length, script.cues.length);
  v.free();

  // Every action the engine recognises is one the avatar can perform, and vice versa for the UI list.
  for (const tag of AVATAR_ACTION_TAGS) assert.ok(isAvatarAction(tag), `Avatar cannot perform [${tag}]`);
  for (const a of AVATAR_ACTIONS) assert.ok(AVATAR_ACTION_TAGS.includes(a.id), `Engine does not recognise [${a.id}]`);

  // Expressions ease in, moods persist, and new handles exist.
  const exprAnim = createAnimState();
  triggerAvatarEmote(exprAnim, "surprised", undefined, 0);
  setAvatarMood(exprAnim, "sad");
  for (let t = 0; t <= 400; t += 16) stepAvatarPhysics(exprAnim, t, null, null, 160);
  assert.ok(exprAnim.x.browUp > 0.8 && exprAnim.x.mouthO > 0.5, "Surprise should raise the brows and open the mouth");
  for (let t = 416; t <= 4000; t += 16) stepAvatarPhysics(exprAnim, t, null, null, 160);
  assert.equal(exprAnim.emote, "", "A gesture should end on its own");
  assert.ok(exprAnim.x.frown > 0.4, "The sad mood should remain after the gesture ends");
  const moreHandles = getSculptHandles(520, 580, DEFAULT_AVATAR).map((h) => h.id);
  assert.ok(moreHandles.includes("brow") && moreHandles.includes("nose"), "Expected brow and nose sculpt handles");
}

console.log("4b. Testing the sounds the voice makes: laughs, sighs, gasps...");
{
  const v = new TTS("female");
  const wordsOf = (script) => v.speakScript(script).words.map((w) => w.word);

  // The engine's list of sounds is the voice's own list ("inhale" is a breath cue, not a timed sound).
  assert.deepEqual([...VOICE_SOUND_TAGS].sort(), TTS.soundNames().filter((id) => id !== "inhale").sort());
  for (const id of VOICE_SOUND_TAGS) {
    assert.deepEqual(wordsOf(`[${id}] zebra`), [`[${id}]`, "zebra"], `The voice should perform [${id}] as a sound of its own`);
    if (id !== "exhale") assert.ok(isAvatarAction(id), `The avatar has no face for [${id}]`);
  }

  // A sound is kept for the voice, becomes a cue for the face, and counts as one word for both.
  const line = "Hello there! [laugh] That was funny. [wave] [sigh length=1.5] Oh well. [wink]";
  const parsed = parseSpeechCues(line);
  assert.equal(parsed.speechText, "Hello there! [laugh] That was funny. [sigh length=1.5] Oh well.");
  assert.deepEqual(parsed.cues.filter((c) => c.type === "action").map((c) => [c.name, c.word, Boolean(c.sound)]), [
    ["laugh", 2, true],
    ["wave", 6, false],
    ["sigh", 6, true],
    ["wink", 9, false],
  ]);
  assert.equal(stripSpeechTags(line), "Hello there! That was funny. Oh well.", "The chat bubble shows the words only");
  const spoken = v.speakScript(parsed.speechText);
  assert.deepEqual(spoken.words.map((w) => w.word), ["hello", "there", "[laugh]", "that", "was", "funny", "[sigh]", "oh", "well"]);
  assert.equal(parsed.wordCount, spoken.words.length, "The engine and the voice count the same words");

  // The face holds the laugh for exactly as long as it is heard.
  const timeline = buildCueTimeline(spoken, parsed.cues, parsed.wordCount);
  const laugh = timeline.items.find((c) => c.name === "laugh");
  const heard = spoken.words[2];
  assert.ok(Math.abs(laugh.t - heard.start) < 0.1 && Math.abs(laugh.ms - (heard.end - heard.start) * 1000) < 200, JSON.stringify(laugh));
  const face = createAnimState();
  runDueCues(face, timeline, laugh.t + 0.01, 1000);
  assert.equal(face.emote, "laugh");

  // Captions say what was heard.
  assert.deepEqual(spoken.words.map((w) => captionForSpokenWord(w.word)).slice(1, 4), ["there", "(laughs)", "that"]);
  assert.equal(captionForSpokenWord("[uh-huh]"), "uh-huh");

  // Strength, length and duration pass through to the voice; a duration also times the face.
  const long = parseSpeechCues("[laugh=3s] Oh dear. [laugh=strong] [snore for=2s]");
  assert.equal(long.speechText, "[laugh=3s] Oh dear. [laugh=strong] [snore for=2s]");
  assert.equal(long.cues[0].ms, 3000);
  const longSpoken = v.speakScript(long.speechText);
  assert.ok(Math.abs(longSpoken.words[0].end - longSpoken.words[0].start - 3) < 0.4, "[laugh=3s] should last about three seconds");

  // A line can be all sound and no words, and still be something to say.
  const only = parseSpeechCues("[giggle]");
  assert.ok(only.cues.some((c) => c.sound) && only.wordCount === 1 && stripSpeechTags(only.speechText) === "");
  assert.ok(v.speakScript(only.speechText).samples.length > 4000);

  // Every other tag word the engine lets through is one the voice acts on rather than reads out.
  for (const tag of ["cheerful", "excited", "calm", "sad", "serious", "fast", "slow", "louder", "softer", "whisper", "laughing", "chuckling", "giggling", "deep", "bright", "husky", "reset", "inhale", "pause=200ms"]) {
    assert.deepEqual(wordsOf(parseSpeechCues(`[${tag}] zebra`).speechText), ["zebra"], `[${tag}] should not be read aloud`);
  }
  assert.deepEqual(wordsOf(parseSpeechCues("[laughing] zebra [/laughing] [whisper] zebra [/whisper] [deep] zebra [/voice]").speechText), ["zebra", "zebra", "zebra"]);
  assert.deepEqual(wordsOf(parseSpeechCues("[wibble] zebra [/fast] [angry]").speechText), ["zebra"], "Unknown tags are dropped, not spoken");

  // "Laughing while speaking" is a setting of the voice.
  const amused = new TTS({ gender: "female", laughter: 0.6 });
  assert.equal(amused.settings.laughter, 0.6);
  assert.ok(amused.speak("I can not believe you did that").duration > v.speak("I can not believe you did that").duration);
  amused.free();

  // The faces: eyes close for a sneeze, and every sound's face can be drawn.
  const sneezing = createAnimState();
  triggerAvatarEmote(sneezing, "sneeze", 2000, 0);
  for (let t = 0; t <= 400; t += 16) stepAvatarPhysics(sneezing, t, null, null, 160);
  assert.ok(sneezing.x.shut > 0.8, "A sneeze should close the eyes");

  // In conversation: sounds on request, and a way of speaking that lasts until changed back.
  const bot = new AIMLEngine({ botProps: { name: "Aria", company: "Acme" }, xml: "<aiml></aiml>", baseXml: BASE_AIML_XML });
  const said = (text) => bot.reply(text);
  assert.ok(said("can you do an evil laugh").speechText.startsWith("[evil]"));
  assert.ok(/\[yawn\]/.test(said("yawn").speechText) && !/yawn/i.test(said("yawn").displayText.replace("Excuse me! Is it late?", "")));
  assert.ok(/\[whisper\] I know a secret\. \[\/whisper\]/.test(said("whisper i know a secret").speechText));
  assert.ok(/^\[laughing\]/.test(said("say i love mondays while laughing").speechText));
  const slower = said("could you speak slower please");
  assert.ok(/slower from now on/.test(slower.displayText));
  const next = said("what time is it");
  assert.ok(next.speechText.startsWith("[slow] ") && !next.displayText.includes("[slow]"), next.speechText);
  assert.ok(next.cueWords === v.speakScript(next.speechText).words.length || /\d/.test(next.displayText));
  said("speak normally");
  assert.ok(!said("what time is it").speechText.includes("[slow]"));
  const joke = said("tell me a joke");
  assert.equal(joke.cueWords, v.speakScript(joke.speechText).words.length, `A joke lines up with the voice: ${joke.speechText}`);
  assert.equal(stripSpeechTags("[sing bpm=96] C4:1=Twin- C4:1=kle G4:2=star [/sing]"), "♪ Twinkle star ♪");

  // The rule checker accepts sounds and suggests one for a near miss.
  const lint = inspectAimlXml(`<aiml><category><pattern>A</pattern><template>[chuckle] Fine. [chukle] [giggling] ok [/giggling]</template></category></aiml>`);
  assert.equal(lint.warnings.length, 1);
  assert.ok(/\[chukle\].*Did you mean \[chuckle\]/.test(lint.warnings[0].message), lint.warnings[0].message);
  v.free();
}

console.log("5. Testing the base brain and natural-chat matching...");
{
  assert.equal(inspectAimlXml(BASE_AIML_XML).valid, true, "Base brain should be valid AIML");
  const bot = new AIMLEngine({
    botProps: { name: "Aria", role: "Concierge", company: "Acme" },
    xml: STARTER_AIML_PACKS.concierge.xml,
    baseXml: BASE_AIML_XML,
  });

  // Your own rules win over the base layer when both could answer.
  const hello = bot.reply("heyyy");
  assert.equal(hello.matchedLayer, "custom");
  assert.equal(hello.matchedPattern, "HELLO");

  // Small talk the pack never mentions is answered by the base layer.
  const how = bot.reply("hi, how are you?");
  assert.equal(how.matchedLayer, "base");
  assert.ok(/how about you/i.test(how.displayText), how.displayText);
  assert.ok(/glad to hear/i.test(bot.reply("not bad thanks").displayText), "<that> follow-up after 'How about you?'");

  // Curly apostrophes, chat shorthand, typos and loose wording.
  assert.equal(bot.reply("What’s your name?").matchedPattern, "WHO ARE YOU");
  assert.equal(bot.reply("whats ur pricing").matchedPattern, "# PRICING #");
  const typo = bot.reply("tell me about the pricng plz");
  assert.equal(typo.matchedPattern, "# PRICING #");
  assert.equal(typo.matchKind, "typo");
  assert.equal(bot.reply("do you know what the time is").matchedPattern, "WHAT TIME IS IT");
  assert.equal(bot.reply("nooope").matchedPattern, "NO", "Stretched words and shorthand should normalise");

  // Addressing the bot by name, and two questions in one message.
  assert.equal(bot.reply("thanks aria").matchedPattern, "# THANK #");
  const two = bot.reply("How much does it cost? Also can you sing?");
  assert.ok(/API bills/.test(two.displayText) && two.displayText.includes("♪"), `Both sentences should be answered: ${two.displayText}`);

  // Inline actions arrive as cues; "another one" replays the last request.
  const joke = bot.reply("are u a robot");
  assert.ok(joke.cues.some((c) => c.type === "action" && c.name === "wink"), "Base answers carry inline actions");
  assert.ok(!/\[wink\]/.test(joke.speechText) && !/\[wink\]/.test(joke.displayText));
  bot.reply("tell me something");
  assert.equal(bot.reply("one more").matchedPattern, "TELL ME SOMETHING");

  // Unknown input falls back, offers the default suggestions, and escalates on a second miss.
  const baseOnly = new AIMLEngine({ botProps: { name: "Zed", company: "Acme" }, xml: "<aiml><chips><chip>Pricing</chip></chips></aiml>", baseXml: BASE_AIML_XML });
  const miss1 = baseOnly.reply("what is the airspeed of a laden swallow?");
  assert.equal(miss1.matchKind, "fallback");
  assert.equal(miss1.chips[0].label, "Pricing");
  assert.ok(/don't know that one|wish I knew|beyond me/i.test(miss1.displayText), miss1.displayText);
  const miss2 = baseOnly.reply("and how heavy is a coconut?");
  assert.ok(/either|beyond me too/i.test(miss2.displayText), miss2.displayText);

  // Without the base layer the engine behaves as before.
  const bare = new AIMLEngine({ xml: "<aiml><category><pattern>HELLO</pattern><template>Hi.</template></category></aiml>" });
  assert.equal(bare.reply("how are you").matchKind, "none");
}

console.log("6. Testing smarter matching, business facts and the rule checker...");
{
  const shop = new AIMLEngine({ botProps: { name: "Aria", company: "Acme" }, xml: STARTER_AIML_PACKS.ecommerce.xml, baseXml: BASE_AIML_XML });

  // Other words for the same idea reach the same rule.
  const fees = shop.reply("what are your fees for postage");
  assert.equal(fees.matchedPattern, "# SHIPPING #");
  assert.equal(fees.matchKind, "synonym");
  assert.equal(shop.reply("do you ship to canada").matchedPattern, "# SHIPPING #", "A real word must not be 'corrected' into another one");
  assert.equal(shop.reply("is there a voucher").matchedPattern, "# DISCOUNT #");
  assert.equal(shop.reply("can i get my money back").matchedPattern, "# RETURN #", "Everyday phrases map onto one idea");
  assert.equal(shop.reply("when will my parcel arrive").matchedPattern, "# SHIPPING #");

  // Two questions joined by "and" are both answered; small talk is still small talk.
  const both = shop.reply("shipping and returns");
  assert.ok(/ship within 24 hours/i.test(both.displayText) && /30-day returns/i.test(both.displayText), both.displayText);
  assert.equal(shop.reply("blah blah").matchKind, "fallback");

  // Every reply is computed in well under a frame.
  const t0 = performance.now();
  for (let i = 0; i < 200; i++) shop.reply(i % 2 ? "what are your fees for postage" : "tell me about sizes please");
  const perReply = (performance.now() - t0) / 200;
  assert.ok(perReply < 8, `Replies should be near-instant, took ${perReply.toFixed(2)} ms each`);

  // Business facts: rules that exist only once a fact is filled in.
  const noFacts = new AIMLEngine({ botProps: { name: "Zed", company: "Acme" }, xml: "<aiml></aiml>", baseXml: BASE_AIML_XML });
  assert.equal(noFacts.reply("when are you open").matchKind, "fallback");
  const facts = { about: "Acme makes rocket skates.", hours: "Mon-Fri, 9am-5pm", email: "hello@acme.com", phone: "+61 400 123 456", address: "12 King Street, Sydney" };
  assert.deepEqual(BOT_FACTS.map((f) => f.key), ["about", "hours", "email", "phone", "address", "pricing"]);
  noFacts.setBotProps(facts);
  const open = noFacts.reply("when are you open");
  assert.ok(/We're open Mon-Fri, 9am-5pm/.test(open.displayText), open.displayText);
  assert.ok(/Monday to Friday, 9am to 5pm/.test(open.speechText), `Hours should be spoken in full: ${open.speechText}`);
  assert.ok(/rocket skates/.test(noFacts.reply("what is acme").displayText), "Patterns can mention the company name");
  const reach = noFacts.reply("how can i reach you");
  assert.ok(/hello@acme\.com/.test(reach.displayText) && /\+61 400 123 456/.test(reach.displayText), reach.displayText);
  assert.ok(/plus 6 1, 4 0 0, 1 2 3, 4 5 6/.test(reach.speechText), `Phone numbers are read digit by digit: ${reach.speechText}`);
  assert.ok(/12 King Street/.test(noFacts.reply("where are you located").displayText));
  const two = noFacts.reply("whats your address and opening hours");
  assert.ok(/King Street/.test(two.displayText) && /We're open/.test(two.displayText), two.displayText);
  assert.equal(noFacts.reply("how much is it").matchKind, "fallback", "No pricing fact, so no pricing answer");
  noFacts.setBotProps({ hours: "" });
  assert.equal(noFacts.reply("when are you open").matchKind, "fallback", "Clearing a fact removes its answers");

  // Wording no pattern anticipated is matched by what it is about; the looser matchers do not
  // ignore the rest of the question.
  noFacts.setBotProps({ hours: "9 to 5" });
  const office = noFacts.reply("do you have an office");
  assert.equal(office.matchKind, "meaning");
  assert.ok(/12 King Street/.test(office.displayText), office.displayText);
  assert.ok(/We're open 9 to 5/.test(noFacts.reply("what time do you shut").displayText), "Not the clock: the opening hours");
  assert.ok(/call us on/.test(noFacts.reply("can i ring you").displayText));
  noFacts.setBotProps({ phone: "" });
  assert.ok(/by email at hello@acme\.com/.test(noFacts.reply("whats your phone number").displayText), "No phone on file: offer the email");
  noFacts.setBotProps({ phone: "+61 400 123 456" });

  // A question about two things, each covered by its own rule, gets both answers.
  const visit = noFacts.reply("is there a shop i can visit");
  assert.ok(/King Street/.test(visit.displayText) && /We're open/.test(visit.displayText), visit.displayText);

  // When two rules fit equally well, both are offered instead of guessing.
  const twoReturns = new AIMLEngine({
    botProps: { name: "Zed" },
    baseXml: BASE_AIML_XML,
    xml: `<aiml>
      <category><pattern>WHAT IS THE RETURN POLICY</pattern><template>Thirty days.</template></category>
      <category><pattern>WHERE IS MY RETURN LABEL</pattern><template>In your inbox.</template></category>
    </aiml>`,
  });
  const near = twoReturns.reply("something about refunds");
  assert.equal(near.matchKind, "fallback");
  assert.ok(near.chips.length === 2 && /one of these/i.test(near.displayText), `Expected "did you mean" suggestions: ${near.displayText} ${JSON.stringify(near.chips)}`);
  assert.equal(twoReturns.reply(near.chips[0].query).matchKind, "exact", "A suggestion leads straight to its rule");

  // Memory of what the visitor says, carried to another page.
  noFacts.reply("i like rockets");
  const session = JSON.parse(JSON.stringify(noFacts.exportSession()));
  const nextPage = new AIMLEngine({ botProps: { name: "Zed", company: "Acme" }, xml: "<aiml></aiml>", baseXml: BASE_AIML_XML });
  nextPage.importSession(session);
  assert.ok(/rockets/.test(nextPage.reply("what do i like").displayText), "The session should survive export and import");

  // Speech polish only touches what the voice says.
  assert.equal(polishForSpeech("Call 0400 123 456 today"), "Call 0 4 0 0, 1 2 3, 4 5 6 today");
  assert.equal(polishForSpeech("Delivery takes 3-5 days"), "Delivery takes 3 to 5 days");
  assert.equal(polishForSpeech("Founded in 2019, 30-day returns, $1,200"), "Founded in 2019, 30-day returns, $1,200");

  // The rule checker finds mistakes that load fine but would not work.
  const flawed = `<aiml version="2.0">
  <category><pattern>HELLO | HI</pattern><template>Hi there! [wve]</template></category>
  <category><pattern># PRICING #</pattern><template>Free. <blink/> Open <bot name="hours"/>.</template></category>
  <category><pattern>HOW MUCH</pattern><template><srai>PRICNG</srai></template></category>
  <category><pattern>HELLO</pattern><template>Second hello.</template></category>
</aiml>`;
  const report = inspectAimlXml(flawed, { name: "Aria" }, { baseXml: BASE_AIML_XML });
  assert.equal(report.valid, true);
  assert.equal(report.categories, 4, "One entry per <category>, however many wordings it has");
  assert.deepEqual(report.rules[0].patterns, ["HELLO", "HI"]);
  const messages = report.warnings.map((w) => w.message).join("\n");
  assert.ok(/\[wve\].*Did you mean \[wave\]/.test(messages), messages);
  assert.ok(/<blink> is not a tag/.test(messages), messages);
  assert.ok(/<bot name="hours"\/> has no value/.test(messages), messages);
  assert.ok(/<srai>PRICNG<\/srai> does not lead/.test(messages), messages);
  assert.ok(/"HELLO" is already used on line 2/.test(messages), messages);
  for (const pack of Object.values(STARTER_AIML_PACKS)) {
    const clean = inspectAimlXml(pack.xml, { name: "Aria", role: "Guide", company: "Acme", website: "https://example.com" }, { baseXml: BASE_AIML_XML });
    assert.deepEqual(clean.warnings, [], `${pack.label} should pass the rule checker`);
  }

  // Removing a rule takes exactly that rule out and leaves a valid document.
  const trimmed = removeAimlRule(flawed, report.rules[2].start);
  assert.ok(!/PRICNG/.test(trimmed) && /Second hello/.test(trimmed));
  assert.equal(inspectAimlXml(trimmed).categories, 3);
  assert.equal(removeAimlRule(flawed, 99999), flawed, "An unknown position changes nothing");
}

console.log("7. Testing general conversation: sets, maps, sums, games, memory and fallbacks...");
{
  const mk = (xml = "<aiml><chips><chip>Pricing</chip></chips></aiml>", props = {}) =>
    new AIMLEngine({ botProps: { name: "Aria", role: "Guide", company: "Acme", ...props }, xml, baseXml: BASE_AIML_XML });
  const said = (bot, text) => bot.reply(text).displayText;

  // Arithmetic, however it is typed. Nothing is ever executed as code.
  for (const [text, value] of [
    ["2+2", 4], ["what is 15% of 80", 12], ["12 times 12", 144], ["the square root of 81", 9],
    ["ten plus twenty two", 32], ["(3 + 4) * 5", 35], ["2 to the power of 8", 256], ["half of 30", 15],
    ["a hundred and five minus five", 100], ["three point five times two", 7], ["0.1 + 0.2", 0.3],
  ]) {
    assert.equal(Math.round(evaluateArithmetic(text).value * 1e8) / 1e8, value, text);
  }
  assert.equal(evaluateArithmetic("7 < 9").value, true);
  assert.equal(evaluateArithmetic("10 / 0").divideByZero, true);
  for (const notMaths of ["hello", "24 7", "9 to 5", "2 plus", "alert(1)", "constructor"]) assert.equal(evaluateArithmetic(notMaths), null, notMaths);
  assert.equal(normalizeAimlInput("what's 10/4?"), "WHAT IS 10 DIVIDED BY 4");
  assert.equal(normalizeAimlInput("555-1234"), "555 1234", "A phone number is not a subtraction");
  assert.equal(normalizeAimlInput("10/10"), "10 10", "A score out of ten is not a division");

  const bot = mk();
  assert.ok(/\b4\b/.test(said(bot, "what's 2+2")));
  assert.ok(/\b12\b/.test(said(bot, "what is 15% of 80?")));
  assert.ok(/\b144\b/.test(said(bot, "12 x 12")));
  assert.ok(/divide by zero/.test(said(bot, "5 divided by 0")));
  assert.ok(/1, 2, 3, 4, 5/.test(said(bot, "count to five")));
  assert.ok(/B, A, N, A, N, A/.test(said(bot, "spell banana")));
  assert.ok(/6\.2 miles/.test(said(bot, "how many miles is 10 km")));
  assert.ok(/86 degrees Fahrenheit/.test(said(bot, "what's 30 celsius in fahrenheit")));
  assert.equal(bot.reply("i would like pizza plus a drink").matchKind, "fallback", "A sentence with 'plus' in it is not a sum");

  // Word sets and lookup maps from the base layer.
  assert.ok(/Tokyo/.test(said(bot, "what's the capital of Japan?")));
  assert.ok(/Washington/.test(said(bot, "what is the capital city of the united states")));
  assert.ok(/Paris/.test(said(bot, "capital of frnace")), "Set members are known words, so typos in them are put right");
  assert.equal(bot.reply("what is the capital of wakanda").matchKind, "fallback", "Unknown keys are not guessed at");
  assert.ok(/Moo/.test(said(bot, "what does a cow say")));
  assert.ok(/Quack/.test(said(bot, "what sound do ducks make") + said(bot, "what do ducks say")), "Plurals of set members match");

  // Dates.
  const year = String(new Date().getFullYear());
  assert.ok(said(bot, "what year is it").includes(year));
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  assert.ok(said(bot, "what day is tomorrow").includes(tomorrow.toLocaleDateString("en-US", { weekday: "long" })));
  assert.ok(/days to go|one more sleep|today/i.test(said(bot, "how many days until christmas")));

  // Memory, including a predicate whose name is worked out from what was said.
  said(bot, "my name is sam");
  assert.ok(/25/.test(said(bot, "i am 25 years old")));
  assert.ok(/What's its name/.test(said(bot, "i have a cat")));
  assert.ok(/Bella/.test(said(bot, "Bella")));
  said(bot, "i work as a teacher");
  assert.equal(bot.reply("my favourite colour is green").matchKind, "chat");
  assert.ok(/green/.test(said(bot, "what's my favourite colour")), "Not the bot's own favourite colour");
  assert.ok(/Blue/.test(said(bot, "what is your favourite colour")));
  const about = said(bot, "what do you know about me");
  assert.ok(/Sam/.test(about) && /25/.test(about) && /teacher/.test(about) && /cat called Bella/.test(about), about);
  said(bot, "forget me");
  assert.ok(/haven't told me your name/.test(said(bot, "what is my name")));

  // Games keep their place in the conversation, and let go of it when the subject changes.
  const riddle = said(bot, "tell me a riddle");
  assert.ok(/What am I\?$/.test(riddle), riddle);
  assert.ok(/Not quite/.test(said(bot, "a shoe")));
  assert.equal(bot.reply("another one").matchedPattern, "# RIDDLE #", "A guess does not become the last thing asked for");
  const answer = bot.vars.get("riddle");
  assert.ok(/Yes!/.test(said(bot, `is it a ${answer}?`)), `Expected "${answer}" to be accepted`);
  assert.equal(bot.reply("yes please").matchedPattern, "# RIDDLE #", "'Want another one?' continues the same game");
  assert.ok(/I'm Aria/.test(said(bot, "what's your name")), "Another question is answered, not treated as a guess");

  const quiz = said(bot, "quiz me");
  assert.ok(/Quiz question:/.test(quiz), quiz);
  assert.ok(/Correct!/.test(said(bot, bot.vars.get("quizalt"))));

  said(bot, "guess my number");
  const secret = Number(bot.vars.get("secret"));
  assert.ok(/Higher|Lower/.test(said(bot, String(secret === 10 ? 9 : secret + 1))));
  assert.ok(/Well played/.test(said(bot, `is it ${secret}?`)));

  assert.ok(/draw|win/.test(said(bot, "rock")));
  assert.ok(/Who's there\?/.test(said(bot, "knock knock")));
  assert.ok(/Lettuce who\?/.test(said(bot, "lettuce")));
  assert.ok(/Good one/.test(said(bot, "lettuce in, it's cold out here")));
  assert.ok(/Knock knock!/.test(said(bot, "tell me a knock knock joke")));
  const kkName = said(bot, "who's there?");
  assert.ok(new RegExp(`^${bot.vars.get("kkname")}`).test(kkName), kkName);
  const punchline = bot.vars.get("kkpunch");
  assert.ok(said(bot, `${kkName.replace(".", "")} who?`).includes(punchline), "The punchline follows");
  assert.equal(bot.vars.get("kkpunch"), "", "and is then cleared, so '... who?' means nothing special afterwards");
  assert.equal(bot.reply("doctor who").matchKind, "fallback");

  // <random> gives every alternative a turn before repeating one.
  const jokes = new Set();
  for (let i = 0; i < 12; i++) jokes.add(said(bot, "tell me a joke"));
  assert.equal(jokes.size, 12, "Twelve jokes asked for, twelve different jokes told");

  // Feelings, including the ones that must never be joked past.
  assert.ok(/breath/.test(said(bot, "i'm so stressed")), "Intensifiers are taken off: so stressed -> stressed");
  assert.ok(/crisis line|emergency services/.test(said(bot, "honestly i want to die")));
  assert.ok(/Congratulations/.test(said(bot, "i got a new job!")));
  assert.ok(/camera/.test(said(bot, "can you see me")), "Honest about what it can and cannot do");
  assert.ok(/much simpler/.test(said(bot, "are you chatgpt")));

  // A follow-up rule does not swallow a new question; a short answer still belongs to it.
  said(bot, "how are you");
  assert.equal(bot.reply("did you sleep well").matchedPattern, "DID YOU SLEEP WELL #");
  said(bot, "how are you");
  assert.ok(/Glad to hear it/.test(said(bot, "pretty good thanks")));

  // The catch-all tells a request from a question from a remark.
  const fresh = mk();
  assert.ok(/Tell me more|What makes you say|listening|And then|on your mind/.test(said(fresh, "the moon was very bright last night")));
  const helpless = mk("<aiml></aiml>", { email: "hello@acme.com" });
  const cannot = helpless.reply("i need to change my delivery address");
  assert.equal(cannot.matchKind, "fallback");
  assert.ok(/hello@acme\.com/.test(cannot.displayText), `A request it cannot help with points to a person: ${cannot.displayText}`);
  assert.ok(/cat/.test(said(mk(), "asdfghjkl")));

  // Rules about the site beat base-layer guesses, even when they only fit by synonym.
  const shop = mk(STARTER_AIML_PACKS.ecommerce.xml);
  assert.equal(shop.reply("i am confused about refunds").matchedPattern, "# RETURN #", "Not the base 'I AM CONFUSED #'");
  assert.equal(shop.reply("do you like free shipping").matchedPattern, "# SHIPPING #", "Not the base 'DO YOU LIKE *'");
  assert.equal(shop.reply("do you like pizza").matchedPattern, "DO YOU LIKE *");
  assert.equal(shop.reply("i like the return policy").matchedPattern, "# RETURN #", "Not the open-ended 'I LIKE *'");

  // One of your rules that is about something beats even an exact base phrase; a rule made only of
  // everyday words does not push base small talk aside.
  const located = mk(`<aiml>
    <category><pattern># LOCATED #</pattern><template>Corner of King and Queen.</template></category>
    <category><pattern>WHAT IS *</pattern><template>No idea what that is.</template></category>
  </aiml>`);
  assert.equal(said(located, "where are you located"), "Corner of King and Queen.");
  assert.ok(/I'm Aria/.test(said(located, "what is your name")));
  assert.equal(said(located, "what is a flux capacitor"), "No idea what that is.");
  assert.ok(/King Street/.test(said(mk(STARTER_AIML_PACKS.cafe.xml), "where are you located")), "'WHERE ARE YOU #' is yours, so it answers");

  // Your own sets and maps: one rule prices a whole menu.
  const cafe = mk(STARTER_AIML_PACKS.cafe.xml, { company: "Bean Scene" });
  assert.ok(/four dollars fifty/.test(said(cafe, "how much is a flat white?")));
  assert.ok(/six dollars/.test(said(cafe, "whats the price of an iced coffee")));
  assert.ok(/five dollars/.test(said(cafe, "muffins")), "A bare menu item, in the plural");
  assert.ok(/oat milk/.test(said(cafe, "do you have oat milk?")));
  assert.equal(cafe.reply("how much is a unicorn frappe").matchKind, "fallback");
  const cafeInfo = inspectAimlXml(STARTER_AIML_PACKS.cafe.xml, { name: "Aria", company: "Bean Scene" }, { baseXml: BASE_AIML_XML });
  assert.deepEqual(cafeInfo.warnings, []);
  assert.ok(cafeInfo.rules.some((r) => /^how much espresso$/.test(r.sample)), "Set patterns get a sample question for the Try button");

  // The rule checker knows about sets and maps.
  const broken = inspectAimlXml(
    `<aiml><category><pattern>PRICE OF <set>drinks</set></pattern><template><map name="prices"><star/></map></template></category></aiml>`,
    {},
    { baseXml: BASE_AIML_XML }
  );
  const brokenText = broken.warnings.map((w) => w.message).join("\n");
  assert.ok(/set "drinks" is not defined/.test(brokenText) && /map "prices" is not defined/.test(brokenText), brokenText);

  // <fallback/>, <li><value>, late rules and firm rules in your own AIML.
  const custom = mk(`<aiml>
    <category><pattern>CODE *</pattern><template><think><set name="code"><star/></set></think><condition name="code"><li><value><bot name="company"/></value>Unlocked.</li><li><fallback/></li></condition></template></category>
    <category late="true"><pattern>* PLEASE NOW</pattern><template>Open-ended.</template></category>
  </aiml>`);
  assert.equal(said(custom, "code acme"), "Unlocked.");
  const refused = custom.reply("code wrong");
  assert.equal(refused.matchKind, "fallback");
  assert.equal(custom.reply("code wrong").chips.length > 0 || refused.displayText.length > 0, true);
  assert.equal(custom.reply("tell me a joke please now").matchedPattern, "# JOKE #", "A late rule waits for everything else");
  assert.equal(custom.reply("xyzzy please now").matchKind, "chat");

  // A follow-up that only names another member of the set continues the last question.
  const geo = mk();
  assert.ok(/Paris/.test(said(geo, "what's the capital of france")));
  const next = geo.reply("and germany?");
  assert.equal(next.matchKind, "followup");
  assert.ok(/Berlin/.test(next.displayText));
  assert.ok(/Tokyo/.test(said(geo, "what about japan")));
  said(geo, "tell me a joke");
  said(geo, "haha");
  said(geo, "nice one");
  assert.equal(geo.reply("italy").matchKind, "fallback", "...but only straight after the question");
  assert.ok(/four dollars fifty/.test(said(cafe, "how much is a latte")));
  assert.ok(/five dollars/.test(said(cafe, "and a mocha?")), "Works for your own sets and maps too");
  assert.ok(/four dollars fifty/.test(said(cafe, "how much is a capuccino")), "A typo inside a longer phrase is still put right");
  assert.ok(/soy milk/.test(said(cafe, "do you have soy milk")));
  assert.ok(/almond milk/.test(said(cafe, "is there almond too")), "The follow-up may come with a few filler words");
  // A pronoun points back at the last item from your own sets or maps that was mentioned.
  said(cafe, "my friend says the toasties are great");
  const they = cafe.reply("how much are they?");
  assert.equal(they.matchKind, "followup");
  assert.ok(/nine dollars/.test(they.displayText), they.displayText);
  assert.ok(/nine dollars/.test(said(cafe, "how much are toasties")), "'toasties' is the plural of 'toastie', not of 'toasty'");

  // Filler at either end of a sentence does not hide an exact phrase.
  assert.equal(geo.reply("so what's your name again").matchedPattern, "WHO ARE YOU");
  assert.equal(geo.reply("whats your favourite food then").matchedPattern, "WHAT IS YOUR FAVORITE FOOD");
  assert.equal(geo.reply("lets do a quiz").matchedPattern, "LET US DO A QUIZ", "'lets' is read as 'let us'");
  assert.ok(/It's /.test(said(geo, "no idea")), "Giving up on a quiz question reveals the answer");

  // A spelling fix followed by a loose match needs more of the rule to be present.
  assert.notEqual(geo.reply("you cheated").matchedPattern, "WHO CREATED YOU");
  // Who the sentence is about has to agree.
  said(geo, "my favourite colour is green");
  assert.ok(!/Blue/.test(said(geo, "what's my favourite colour")));

  // Compliments and complaints come from word lists, and a "not" turns them round.
  assert.ok(/kind of you|not so bad/.test(said(geo, "you seem really nice")));
  assert.ok(/sorry I wasn't helpful/.test(said(geo, "you are not very helpful")));
  assert.ok(/kind of you|not so bad/.test(said(geo, "you're not stupid")));

  // A remark the bot has no rule for is answered in keeping with how it sounds.
  assert.ok(/sounds hard|sorry to hear|doesn't sound fun/.test(said(geo, "work was exhausting today")));
  assert.ok(/sounds great|good to hear|like the sound/.test(said(geo, "we won the grand final last night")));

  // "Another one" repeats something that varies, not a fixed answer.
  said(geo, "what time is it");
  assert.ok(/Another what/.test(said(mk(), "another one")));
  said(geo, "tell me a fun fact");
  assert.equal(geo.reply("another one").matchedPattern, "# FUN FACT #");

  // Pointing back: at the last result, and at the last place or thing that was mentioned.
  const back = mk();
  assert.ok(/\b81\b/.test(said(back, "what's 9 times 9")));
  const divided = back.reply("divide that by 3");
  assert.equal(divided.matchKind, "followup");
  assert.ok(/\b27\b/.test(divided.displayText));
  assert.ok(/\b54\b/.test(said(back, "double it")));
  assert.equal(evaluateArithmetic("subtract 3 from 10").value, 7);
  assert.equal(evaluateArithmetic("add 5 to 10").value, 15);
  assert.equal(evaluateArithmetic("multiply 6 by 7").value, 42);
  said(back, "i'm planning a trip to italy");
  assert.ok(/Rome/.test(said(back, "whats the capital there")));
  assert.ok(/Madrid/.test(said(back, "and spain")));

  // A sum carries on; a follow-up needs more than a place name buried in another sentence.
  assert.ok(/\b75\b/.test(said(back, "could you add up 45 and 30")));
  assert.ok(/\b55\b/.test(said(back, "and take away 20")));
  assert.ok(/Ottawa/.test(said(back, "what's the capital of canada")));
  assert.ok(/Wellington/.test(said(back, "what about new zealand")));
  assert.ok(!/Wellington/.test(said(back, "have you ever been there")), "Not every sentence with 'there' is about capitals");
  assert.ok(/days to go|Enjoy|weekend/.test(said(back, "how long till the weekend")), "'till' is read as 'until'");
  assert.ok(/daughter/.test(said(back, "my daughter is learning japanese")));

  // "Can you ...": does it when there is a rule for it, and says so plainly when there is not.
  assert.ok(/5, 4, 3, 2, 1/.test(said(back, "can you count backwards from 5")));
  const unsure = back.reply("can you make me a sandwich");
  assert.equal(unsure.matchKind, "chat");
  assert.ok(/not sure about that one/.test(unsure.displayText));

  // "Go on" right after a joke means another joke; later it does not.
  const first = said(back, "tell me a joke");
  const second = said(back, "go on then");
  assert.ok(second !== first && back.vars.get("lastask") === "tell me a joke", second);
  assert.ok(/Tough crowd/.test(said(back, "lol thats terrible")), "'That's terrible' after a joke is about the joke");
  assert.ok(/I'll stop/.test(said(back, "ok enough jokes")), "'enough jokes' is not a request for a joke");
  assert.ok(/all I know about that one/.test(said(back, "go on")));

  // Slips and fillers: "hows things", "what do you actually do", "who am i speaking with".
  assert.equal(back.reply("hows things").matchedPattern, "HOW ARE YOU");
  assert.equal(back.reply("so what do you actually do").matchedPattern, "WHAT DO YOU DO");
  assert.equal(back.reply("who am i chatting to").matchedPattern, "WHO ARE YOU", "A synonym in a loosely worded question");
  assert.ok(/Cold/.test(said(back, "whats the opposite of hot")));
  assert.ok(/Orange/.test(said(back, "what colour is an orange")));
  assert.ok(/Mittens/.test(said(back, "my cat is called mittens")) && /Mittens/.test(said(back, "whats my cats name")));

  // Warming up changes nothing about the conversation.
  const warm = mk();
  said(warm, "my name is sam");
  const before = JSON.stringify(warm.exportSession());
  warm.warmUp();
  assert.equal(JSON.stringify(warm.exportSession()), before);

  // Speed, with the much larger base layer.
  const t0 = performance.now();
  const lines = ["hello", "how are you", "what is 12 times 12", "capital of japan", "i like hiking", "tell me a joke", "blah blah blah"];
  for (let i = 0; i < 20; i++) for (const line of lines) bot.reply(line);
  const each = (performance.now() - t0) / (20 * lines.length);
  assert.ok(each < 8, `Replies should stay near-instant, took ${each.toFixed(2)} ms each`);
}

console.log("7b. Testing personalities: the same answers, said in character...");
{
  const xml = `<aiml>
    <category><pattern># HOURS #</pattern><template>We're open from nine to five. I'm here until then!</template></category>
    <category><pattern>HELP ME</pattern><template>I am happy to help. We do not close early, and I will stay as long as you need.</template></category>
    <category persona="off"><pattern>MOTTO</pattern><template>We're Acme. It's what we do! [laugh]</template></category>
    <category><pattern>HI</pattern><template><persona say="hello">Hello from the rules.</persona></template></category>
    <category><pattern>TICKLE</pattern><template>That tickles, it really does! [laugh]</template></category>
    <category><pattern>MOOD CHECK</pattern><template><condition name="personality"><li value="grumpy">Bah.</li><li>Yay.</li></condition></template></category>
  </aiml>`;
  const props = { name: "Juno", role: "Guide", company: "Acme" };
  const make = (persona, random) => new AIMLEngine({ botProps: props, xml, baseXml: BASE_AIML_XML, persona, random });
  const always = () => 0; // every habit that could happen does
  const pv = new TTS("female");

  // No personality: every reply is exactly as written.
  const plain = make(null);
  assert.equal(plain.persona, null);
  assert.equal(plain.reply("what are your hours").displayText, "We're open from nine to five. I'm here until then!");
  assert.equal(plain.reply("hi").displayText, "Hello from the rules.");
  assert.equal(plain.reply("mood check").displayText, "Yay.");

  // Formality: a formal character spells contractions out, a casual one draws them together.
  const formal = make({ id: "professional", chattiness: 0 });
  assert.equal(formal.reply("what are your hours").displayText, "We are open from nine to five. I am here until then!");
  const casual = make({ id: "laidback", chattiness: 0 });
  assert.equal(casual.reply("help me").displayText, "I'm happy to help. We don't close early, and I'll stay as long as you need.");
  assert.equal(stylizeReply("Yes, I am. It's been fun, and that's that.", normalizePersona({ id: "laidback", chattiness: 0 }), { rng: () => 1 }), "Yes, I am. It's been fun, and that's that.");
  assert.equal(stylizeReply("It's been fun. That's all, isn't it?", normalizePersona({ id: "professional", chattiness: 0 }), { rng: () => 1 }), "It has been fun. That is all, is it not?");
  assert.equal(stylizeReply("Isn't that great? Don't worry, I can't stay.", normalizePersona({ id: "professional", chattiness: 0 }), { rng: () => 1 }), "Is that not great? Do not worry, I cannot stay.");

  // Energy: a calm character does not exclaim and speaks calmly; a lively one does both.
  const calm = make({ id: "calm", chattiness: 0 });
  const calmHours = calm.reply("what are your hours");
  assert.equal(calmHours.displayText, "We're open from nine to five. I'm here until then.");
  assert.ok(calmHours.speechText.startsWith("[calm] "), calmHours.speechText);
  assert.equal(stylizeReply("[cheerful] Come in! [excited] It is great.", normalizePersona({ id: "grumpy", chattiness: 0 }), { rng: () => 1 }), "[calm] Come in. [calm] It is great.");
  assert.equal(stylizeReply("That is Paris.", normalizePersona({ id: "bubbly", chattiness: 0, delivery: "" }), { rng: () => 1 }), "That's Paris!");

  // Habits: something it tends to say first, or last, and a catchphrase now and then.
  const opens = make({ id: "bubbly", chattiness: 1, openers: "Ooh!", closers: "Ta-da!" }, always);
  const opened = opens.reply("what are your hours");
  assert.ok(opened.displayText.startsWith("Ooh! We're open from nine to five."), opened.displayText);
  assert.ok(opened.speechText.startsWith("[cheerful] Ooh! "), opened.speechText);
  const closes = make({ id: "friendly", chattiness: 1, openers: "", closers: "Ta-da!" }, always);
  assert.ok(closes.reply("what are your hours").displayText.endsWith("until then! Ta-da!"));
  const catches = make({ id: "friendly", chattiness: 1, openers: "", closers: "", catchphrase: "Splendid." }, always);
  const four = [1, 2, 3, 4].map(() => catches.reply("what are your hours").displayText);
  assert.deepEqual(four.map((t) => t.endsWith("Splendid.")), [false, false, false, true]);
  assert.equal(stylizeReply("We are open all day.", normalizePersona({ id: "shy", chattiness: 1, openers: "Um,", formality: 0.5 }), { kind: "answer", rng: always }).replace(/ \[\w+\]$/, ""), "[soft] Um, we are open all day.");
  // What the engine remembers of the conversation is the reply as the rules wrote it.
  assert.equal(opens.lastBotThat, "I'm here until then!");

  // Its own laugh: the sound a rule asks for becomes the character's, and a serious one does not laugh.
  assert.ok(make({ id: "friendly", laugh: "hoho", chattiness: 0 }).reply("tickle").speechText.includes("[hoho]"));
  assert.ok(!/\[(laugh|chuckle|hoho)/.test(make({ id: "professional", chattiness: 0 }).reply("tickle").speechText));
  // ...but a sound that was asked for, and anything marked persona="off", is left exactly as it is.
  const hearty = make({ id: "dramatic", laugh: "hoho", chattiness: 1 }, always);
  assert.ok(hearty.reply("do an evil laugh").speechText.startsWith("[evil]"));
  assert.ok(/^\[giggle\]/.test(hearty.reply("giggle").speechText));
  assert.equal(formal.reply("motto").displayText, "We're Acme. It's what we do!");
  assert.ok(formal.reply("motto").speechText.includes("[laugh]"));

  // In its own words: where a rule says <persona say="...">, the character's line is used.
  for (const type of PERSONALITIES) {
    const bot = make(type.id);
    assert.equal(bot._personaSays.size, PERSONA_SAYS.length, `${type.id} should have a line for every moment`);
    const hello = bot.reply("hi");
    assert.notEqual(hello.displayText, "Hello from the rules.", type.id);
    assert.equal(hello.matchedLayer, "custom");
    const howAreYou = bot.reply("how are you");
    assert.ok(howAreYou.displayText.endsWith("How about you?"), `${type.id}: ${howAreYou.displayText}`);
    assert.notEqual(bot.reply("good thanks").matchKind, "fallback", `${type.id}: the answer to "how about you?" should still be understood`);
    assert.ok(bot.reply("what is your personality").displayText.length > 8);
    // Every line and greeting is something the voice can say, with nothing read out as a tag.
    for (const text of [...Object.values(type.says).flat(), ...type.greetings, ...type.openers, ...type.closers, ...type.catchphrases]) {
      const filled = personaGreeting({ id: type.id }, props, () => 0) && text.replace(/\{bot\}/g, "Juno").replace(/\{role\}/g, "Guide").replace(/\{company\}/g, "Acme").replace(/\{daypart\}/g, "morning").replace(/\{,user\}/g, ", Sam");
      const parsed = parseSpeechCues(filled);
      const spokenWords = pv.speakScript(parsed.speechText).words;
      assert.equal(parsed.wordCount, spokenWords.length, `${type.id}: "${filled}" -> ${spokenWords.map((w) => w.word).join(" ")}`);
      for (const tag of filled.match(/\[[^\]]+\]/g) || []) assert.ok(!stripSpeechTags(filled).includes(tag), tag);
    }
  }
  const knowsYou = make("friendly");
  knowsYou.reply("my name is sam");
  assert.ok(/, Sam[!.?]/.test(knowsYou.reply("hi").displayText), "It uses the visitor's name once it knows it");
  assert.ok(/, mate[!.?]/.test(make({ id: "laidback", petName: "mate" }).reply("hi").displayText), "Otherwise, what it calls people");
  assert.ok(/sorry/i.test(make("shy").reply("what is a zorbleflux made of").displayText));
  assert.equal(make("grumpy").reply("mood check").displayText, "Bah.");

  // A game, a riddle or any exchange that hangs on the last line is not decorated.
  assert.ok(/Knock knock/.test(opens.reply("tell me a knock knock joke").displayText));
  const whoIsThere = opens.reply("who's there");
  assert.ok(!/Ooh!|Ta-da!/.test(whoIsThere.displayText) && whoIsThere.matchKind !== "fallback", whoIsThere.displayText);
  // Neither is a reply to someone who is upset, and a voice the visitor asked for wins.
  const upset = opens.reply("i am so sad today");
  assert.ok(!/Ooh!|Ta-da!/.test(upset.displayText) && !upset.speechText.startsWith("[cheerful]"), upset.speechText);
  opens.reply("speak slower please");
  const slow = opens.reply("what are your hours");
  assert.ok(slow.speechText.startsWith("[slow] ") && !slow.speechText.includes("[cheerful]"), slow.speechText);
  // Gestures still line up with the voice after a reply has been restyled.
  for (const id of ["professional", "bubbly", "grumpy"]) {
    const res = make({ id, chattiness: 1 }, always).reply("help me");
    assert.equal(res.cueWords, pv.speakScript(res.speechText).words.length, `${id}: ${res.speechText}`);
  }

  // A personality can be written in the AIML itself, and that wins over the one that was given.
  const written = new AIMLEngine({
    botProps: props,
    baseXml: BASE_AIML_XML,
    persona: "bubbly",
    xml: `<aiml>
      <persona id="grumpy" chattiness="0" laugh="hoho" petname="pal">
        <opener>Fine.</opener><opener>Right.</opener>
        <say name="hello"><li>Oh, it is <bot name="name"/><condition name="callsyou"><li value="*">, <get name="callsyou"/></li></condition>. What?</li></say>
      </persona>
      <category><pattern>TICKLE</pattern><template>Stop that. [laugh]</template></category>
    </aiml>`,
  });
  assert.equal(written.persona.id, "grumpy");
  assert.deepEqual([written.persona.laugh, written.persona.petName, written.persona.openers], ["hoho", "pal", ["Fine.", "Right."]]);
  assert.equal(written.reply("hello").displayText, "Oh, it is Juno, pal. What?");
  assert.ok(written.reply("tickle").speechText.includes("[hoho]"));
  const checked = inspectAimlXml(`<aiml>${personaToXml(normalizePersona({ id: "witty", says: { hello: "Well, well{,user}. [wink]" } }))}
    <category persona="off"><pattern>A</pattern><template><persona say="thanks">Sure.</persona></template></category></aiml>`, props, { baseXml: BASE_AIML_XML });
  assert.ok(checked.valid && checked.warnings.length === 0, JSON.stringify(checked.warnings));
  assert.equal(checked.engine.persona.id, "witty");
  assert.equal(checked.engine.reply("hello").displayText, "Well, well.");
  // Taking it away again restores the plain replies.
  written.setPersona(null);
  assert.equal(make("bubbly").setPersona(null), null);

  // The generator's parts: a personality, a name and a greeting that go together.
  for (let i = 0; i < 200; i++) {
    const persona = randomPersona();
    assert.deepEqual(normalizePersona(persona), persona, "A generated personality is already clean");
    assert.ok(PERSONALITIES.some((t) => t.id === persona.id) && persona.openers.length && persona.closers.length);
    for (const key of ["energy", "formality", "playfulness", "chattiness"]) assert.ok(persona[key] >= 0 && persona[key] <= 1);
    const style = ["feminine", "masculine", "neutral"][i % 3];
    const name = randomBotName(style, Math.random, "Aria");
    assert.ok(name !== "Aria" && [...BOT_NAMES[style], ...BOT_NAMES.neutral].includes(name), name);
    const greeting = personaGreeting(persona, { name, role: "Guide", company: "Acme" });
    assert.ok(greeting.includes(name) && !/[{}]/.test(greeting), greeting);
    assert.ok(describePersona(persona).startsWith(PERSONALITIES.find((t) => t.id === persona.id).label));
  }
  assert.equal(new Set(Object.values(BOT_NAMES).flat()).size, Object.values(BOT_NAMES).flat().length, "No name is listed twice");
  assert.equal(normalizePersona(null), null);
  assert.equal(normalizePersona({ id: "nope", energy: 9, laugh: "moo", openers: ["  A  ", "A", ""] }).id, "friendly");
  assert.deepEqual(normalizePersona({ id: "calm", energy: 9, laugh: "moo", openers: ["  A  ", "A", ""] }), { ...normalizePersona("calm"), energy: 1, openers: ["A"] });
  for (const preset of AVATAR_PRESETS) assert.ok(PERSONALITIES.some((t) => t.id === preset.persona), `${preset.name} should start with a personality`);
  pv.free();
}

console.log("8. Testing the new avatar options draw without errors...");
{
  // A recording stand-in for a 2D canvas context: every call is accepted, gradients included.
  const makeCtx = () => {
    const gradient = { addColorStop() {} };
    return new Proxy(
      {},
      {
        get(target, prop) {
          if (prop in target) return target[prop];
          if (prop === "createLinearGradient" || prop === "createRadialGradient" || prop === "createConicGradient") return () => gradient;
          if (prop === "measureText") return () => ({ width: 10 });
          if (prop === "canvas") return { width: 300, height: 360 };
          return () => {};
        },
        set(target, prop, value) {
          target[prop] = value;
          return true;
        },
      }
    );
  };
  const still = createAnimState();
  stepAvatarPhysics(still, 1000, null, null, 160);
  const draw = (overrides) => drawBotAvatar(makeCtx(), 300, 360, { ...DEFAULT_AVATAR, ...overrides }, still, 1016, {});
  for (const h of HAIR_STYLES) draw({ hairStyle: h.id, fringe: true });
  for (const o of OUTFIT_STYLES) for (const n of NECKWEAR_STYLES) draw({ outfitStyle: o.id, neckwear: n.id, framing: "half" });
  for (const g of GLASSES_STYLES) draw({ glasses: g.id });
  for (const hw of HEADWEAR_STYLES) for (const h of ["long_waves", "braids", "afro", "none"]) draw({ headwear: hw.id, hairStyle: h });
  for (const bg of ["violet_haze", "mint_fresh", "graphite"]) draw({ bgStyle: bg, ageLines: 1, beautyMark: true });
  for (const b of BROOCH_STYLES) draw({ brooch: b.id, framing: "half", dimples: 1, eyeliner: 1, noseStud: true, irisColor2: "#7c5836" });
  for (const id of ["pigtails", "space_buns", "mohawk"]) assert.ok(HAIR_STYLES.some((h) => h.id === id), id);
  for (const id of ["tee", "shirt", "cardigan", "jacket"]) assert.ok(OUTFIT_STYLES.some((o) => o.id === id), id);
  for (const id of ["bow", "flower", "tiara", "fedora", "chef"]) assert.ok(HEADWEAR_STYLES.some((h) => h.id === id), id);
  assert.ok(NECKWEAR_STYLES.some((n) => n.id === "lanyard") && HEADWEAR_STYLES.some((n) => n.id === "headscarf"));

  // Idle life: left alone, the avatar makes a small movement of its own; it can be switched off.
  const idle = createAnimState();
  let moved = false;
  for (let t = 0; t < 40000 && !moved; t += 16) {
    stepAvatarPhysics(idle, t, null, null, 160);
    moved = idle.emote.startsWith("idle_");
  }
  assert.ok(moved, "Expected an idle movement within 40 seconds");
  assert.ok(!isAvatarAction("idle_smile"), "Idle movements are not writable actions");
  const frozen = createAnimState();
  frozen.idleLife = false;
  for (let t = 0; t < 40000; t += 16) stepAvatarPhysics(frozen, t, null, null, 160);
  assert.equal(frozen.emote, "");
}

console.log("9. Testing standalone embed/bot-embed.js bundle...");
const embedBundleCode = fs.readFileSync(path.join(root, "embed", "bot-embed.js"), "utf8");
const sandbox = { console, TextEncoder, TextDecoder, Uint8Array, Float32Array, Float64Array, WebAssembly };
sandbox.globalThis = sandbox;
vm.runInNewContext(embedBundleCode, sandbox);
assert.ok(sandbox.BotComputer, "Expected global BotComputer SDK");
assert.equal(typeof sandbox.BotComputer.mount, "function");
assert.equal(sandbox.BotComputer.AVATAR_PRESETS.length, AVATAR_PRESETS.length);
assert.equal(sandbox.BotComputer.BOT_FACTS.length, BOT_FACTS.length, "The SDK lists the business facts a bot can be given");
assert.equal(sandbox.BotComputer.VOICE_SOUND_TAGS.length, VOICE_SOUND_TAGS.length, "The SDK lists the sounds the voice performs");
assert.equal(sandbox.BotComputer.PERSONALITIES.length, PERSONALITIES.length, "The SDK lists the personalities");
assert.equal(typeof sandbox.BotComputer.randomPersona().id, "string");
{
  const sdkBot = new sandbox.BotComputer.AIMLEngine({ baseXml: sandbox.BotComputer.BASE_AIML_XML, xml: "<aiml></aiml>", persona: "professional" });
  assert.ok(/I am|How may I/.test(sdkBot.reply("hello").displayText), "A personality works in the standalone bundle");
}

console.log("✓ All bot.computer smoke tests passed!");
