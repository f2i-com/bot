<p><img src="./assets/logo.svg" alt="bot.computer" width="300"></p>

# bot.computer

**bot.computer** ([https://bot.computer](https://bot.computer)) is a pure HTML, CSS, JavaScript, and WebAssembly studio for creating customizable SitePal-inspired speaking website companions and AIML XML Q&A chatbots — powered locally in the browser by [`tts.wasm`](https://github.com/f2i-com/tts).

## Features

- **Interactive Body & Face Sculpting**: Drag handles directly on your companion's head, jaw, chin, neck, shoulders, chest, waist, and arms (mouse + mobile touch) or fine-tune proportions via studio sliders.
- **2D and 3D avatars.** Choose any of the six characters on the homepage and switch between its illustrated and rigged 3D versions. Drag the 3D character to rotate it. In the studio, use **2D sculpt** to reshape it with handles, or **3D turntable** to inspect it from different angles. **Save PNG** exports the current view with a transparent background in either style. **Voice & gestures** opens the speech editor and articulation display below the stage. The export panel has its own **Avatar style** setting. Browsers without WebGL use the 2D renderer automatically.
- **200 Hz vocal-tract lip sync.** The voice produces 24 kHz audio and nine mouth and tongue measurements every 5 ms. The studio, conversation page and exported bots share the same synthesizer. Version 1.3 adds the Crisp, Elder, Soft and Mellow voices, adjustable phrase-final vocal fry and improved pronunciation of dates, times and version numbers. [TTS v1.3.0 release](https://github.com/f2i-com/tts/releases/tag/v1.3.0)
- **AIML 2.0 XML Chatbot Brain**: Turn any companion into an interactive Q&A guide using standard AIML XML (`<pattern>`, `*` / `_` / `#` / `^` wildcards, `<srai>`, `<random>`, `<that>`, `<topic>`, `<set>`/`<get>` memory, `<condition>`, `<emote>`, and `<reply>` quick chips), plus word sets and lookup maps (`<set>` in patterns, `<map>` in templates), arithmetic (`<calc>`), date maths, and rules that can step aside (`<fallback/>`).
- **Avatar movements and expressions.** Use `[walk]` for a circuit around the stage, `[dance]` for a two-step, `[stretch]` for alternating overhead reaches and `[squat]` for a knee bend. Other cues include `[wave]`, `[wink]`, `[nod]`, `[smile]`, `[laugh]`, `[think]`, `[surprised]`, `[shake]`, `[shrug]`, `[thumbsup]`, `[tilt]` and `[bow]`. Place a cue in a greeting or reply to time it to the words. Visitors can ask “What moves can you do?”, request “Walk then wave”, try “Show me a warm-up”, repeat a routine, or say “Stop moving”. The **Movement studio** starter pack in the Chat tab includes editable movement rules.
- **A Voice That Laughs, Sighs and Whispers**: The voice makes 53 sounds that are not words, and the avatar acts each one out as it is heard: `[laugh]`, `[chuckle]`, `[giggle]`, `[gasp]`, `[sigh]`, `[yawn]`, `[hmm]`, `[aww]`, `[phew]`, `[whistle]`, `[ahem]`, `[sneeze]` and more. It can also speak while laughing (`[laughing] ... [/laughing]`, or the "Laughing while speaking" slider). The studio has a palette that plays any sound and inserts its tag, and captions say what was heard: "(laughs)".
- **Spoken Conversation** ([bot.computer/conversation/](https://bot.computer/conversation/)): Talk with a character out loud. [`stt.wasm`](https://github.com/f2i-com/stt) turns your voice into words, the AIML brain answers and `tts.wasm` talks back, with captions, gestures and the avatar listening while you speak. Pick one of the starting characters, or design your own bot in the studio and press **Talk to** to have a conversation with it. Nothing you say leaves the browser. See [Conversation](#conversation).
- **Personalities**: Give a bot a character (friendly, bubbly, calm, professional, witty, shy, grumpy, dramatic, laid-back or curious) and the same rules come out differently: its own hello and goodbye, "I'm" or "I am", exclamation marks or none, the laugh it laughs, the things it tends to say first and last, a catchphrase, what it calls visitors. Four dials (energy, formality, playfulness, chattiness) and a set of speaking habits are yours to change, and none of it touches your AIML. See [Personalities](#personalities).
- **Bot Generator**: One click makes a whole new bot: a name, a look, a voice and a personality that go together, with a greeting in that personality's own words. Tick which of the four it may change. "Download config" saves the result as one JSON file and "Load config" brings it back.
- **Base Brain for General Conversation**: A built-in AIML layer of about 390 rules sits underneath your own, which always win. It handles greetings and goodbyes, how the visitor feels (with care for the serious cases), questions about the bot itself, compliments and complaints, jokes, riddles, trivia, rock paper scissors, guess my number, knock knock jokes, sums ("what's 15% of 80?"), unit conversions, dates ("how many days until Christmas?"), capitals and a little general knowledge. It remembers what a visitor says about themselves (name, age, work, pets, likes, favourites) for as long as the tab is open, and forgets it on request. How well does it do? On the five test conversations used to build it (33 to 159 everyday lines each) it has a specific, fitting answer for 93% to 99% of lines. Those scripts shaped the rules, so that is the best case. Each new script, on its first run, got a specific answer to between 57% and 68% of its lines; most of the rest got an honest "I don't know that one" or a sympathetic general reply, and a few got a wrong answer that was then fixed. It is a rule-based bot, not a language model: expect good small talk, not open-ended conversation.
- **Conversation That Keeps Its Thread**: "What's the capital of France?" then "and Germany?" continues the question. "My friend says the toasties are great" then "how much are they?" knows what "they" are. A riddle waits for a guess, but lets go when the subject changes. Something it has no rule for is answered in keeping with how it sounds: sympathy for a rough day, a question it cannot answer is admitted honestly, and a request it cannot help with is pointed to your contact details.
- **Matching That Understands What Was Meant**: Typos, chat shorthand ("whats ur pricing"), stretched words ("heyyy"), other forms of a word ("shipped" for "shipping"), synonyms ("fees" for "pricing", "voucher" for "discount"), everyday phrases ("money back"), several questions in one message ("hours and address?"), and being addressed by name. Wording no pattern anticipated is matched by what it is about, and when two rules fit equally well the bot offers both as "did you mean" suggestions instead of guessing. A reply is computed in about a millisecond, so it appears the moment Send is pressed.
- **Business Facts, No Rules Needed**: Fill in what you do, opening hours, email, phone, address and pricing, and the bot answers questions about them by itself. Phone numbers are read digit by digit and "Mon-Fri" is spoken as "Monday to Friday", while the chat bubble keeps the original text with clickable links.
- **Deeper Customisation**: Resting expression (smile, brow mood, eye openness), freckles, age lines, a beauty mark, eyeshadow, separate brow colour, earrings, neckwear (necklace, bow tie, scarf, lanyard), headwear (beanie, cap, headband, beret, headphones, headscarf), glasses including cat-eye and aviators, outfits including a polo, a scoop-neck top, an apron, a graphic tee, a button-up shirt, a cardigan and a zip jacket, hairstyles including twin braids, pigtails, space buns, a mohawk and an optional fringe, more headwear (hair bow, flower, tiara, fedora, chef's hat), a brooch, dimples, eyeliner, a nose stud, eyes of two different colours, extra backdrops, sculpt handles for brows, nose and hips, and "Random face" / "Random style" buttons. Left alone, the avatar makes small movements of its own.
- **Self-contained export.** Download a single `<name>-bot.js` with your character and the features selected in the studio. The voice-enabled download includes compressed `tts.wasm` and works offline.
- **Studio Conveniences**: Undo / redo for the avatar's look (Ctrl+Z, Ctrl+Shift+Z), autosave of your design in the browser, save / load of the full configuration as JSON, a live articulation scope that traces jaw, tongue, lips, nasal and voicing while the bot speaks, a list of your rules with Try / Find / Remove, and a rule checker that points out misspelled `[actions]`, unknown tags, duplicate patterns and `<srai>` links that lead nowhere.
- **Mobile-First Studio & Embedded Dock**: Sticky docked mobile stage, thumb-friendly bottom navigation bar, touch-scaled sculpt handles, and Shadow-DOM-isolated mobile companion widget.

## Quick Start

```sh
npm ci          # installs the build-time bundler
npm run build   # builds the site and embed from the checked-in voice engine
npm test        # runs automated TTS viseme, sculptor, AIML XML, and embed SDK smoke tests
npm start       # serves https://bot.computer locally at http://localhost:8090/
                # (the spoken conversation is at http://localhost:8090/conversation/)
```

To update the vendored engine from a built TTS checkout, run `npm run sync-tts`. It reads `../tts`, or the checkout specified by `TTS_REPO_DIR`.

## Embedding on Any Website

In **Preview and export**, choose the avatar style, size and corner. Enable **Let visitors customize the avatar** to add a Customize button beside the published bot. Try it in the preview, then select an installation method under **Add to your site**.

- **One file** downloads a script containing the avatar and the selected voice and chat features. Put it beside your HTML page and paste the generated tag before `</body>`.
- **Hosted embed** gives you one tag containing your design and AIML. The script and speech engine load from the studio where you copied the code. Use a publicly reachable studio for a public site.
- **Separate files** gives you a local script tag. Upload the files shown beside your page. Selecting voice adds `tts.wasm`, and selecting chat adds a separately editable `.aiml` file.
- **JavaScript API** provides a mount example you can call from your own page. **Download an offline demo page** packages the current bot into an HTML file you can open directly.

**Embed size.** Select **2D illustration** for a Canvas-only runtime or **3D character** for WebGL with a 2D fallback. Under **Include in the embed**, choose spoken voice, chat and tours, and built-in small talk. Turning off small talk keeps your own AIML rules. Turning off chat omits the AIML interpreter and tours. The studio shows the selected runtime’s raw and gzipped sizes. With hosted or separate files, the browser fetches the speech engine on first use. Turning off voice removes the speech engine from the export altogether.

All installation methods use the selected runtime. The full `embed/bot-embed.js` SDK remains available to sites that switch features dynamically or use the exported authoring libraries. Its script tag accepts `data-render-mode="2d"` and `data-speech="false"`; use a specialized export to also reduce the script download.

### Guide visitors to a section or button

In the studio’s **Chat** tab, select the **Website guide** starter pack for editable pricing, features, contact and sign-up examples. To add a rule to your current bot, open **Add a Q&A rule → Guide to a page element**. Enter the question, an optional spoken answer and the page target name. Choose an opening gesture or add movements such as `[wave]` to the answer. **Preview and export** includes sample elements for your rules so you can try the questions before installing the bot.

For example, mark your plans section or use its existing `id="pricing"`.

```html
<section data-bot-showcase="pricing" aria-labelledby="pricing-title">
  <h2 id="pricing-title">Plans and pricing</h2>
  <!-- Your plans go here. -->
</section>
```

The corresponding AIML rule can combine speech, a gesture and a destination.

```xml
<category>
  <pattern>SHOW ME PRICING | WHERE ARE YOUR PLANS</pattern>
  <template>[nod] Our plans are here. <showcase target="pricing"/></template>
</category>
```

When the visitor asks, the widget brings the element into view and the avatar moves beside it. The visitor can still use the highlighted element and can return to chat. The same attribute works on a `div`, a button or another visible element. Target names are case-sensitive, start with a letter, and accept up to 64 letters, digits, hyphens or underscores. Give each destination a unique name. The explicit attribute takes precedence over a matching HTML ID. If the destination is missing from a page, the spoken reply and its gestures still work. [Try the pricing and button examples](https://bot.computer/embed-demo.html)

For an ordered tour, choose **Add tour stop** in the same rule form. Give each stop a target, explanation and gesture. Use **Move up** or **Move down** to put them in visiting order. The **Website guide** starter includes a “Give me a tour” question to try in the preview.

```xml
<category>
  <pattern>GIVE ME A TOUR</pattern>
  <template>
    <tour>
      <stop target="features">[wave] Here are the features included with your account.</stop>
      <stop target="pricing">[nod] Compare the plans here.</stop>
      <stop target="signup">[thumbsup] Use this button when you’re ready to sign up.</stop>
    </tour>
  </template>
</category>
```

Mark each destination with a matching ID or `data-bot-showcase` attribute. On **Next** or **Back**, the avatar walks to the stop, turns toward the highlighted section or button, and points as its explanation begins. The gesture in the stop’s AIML plays with that explanation. **Finish** ends the tour, even mid-walk. Visitors who prefer reduced motion go straight to the pointing pose. The same tour works with the 3D avatar and its 2D fallback.

To embed a starter with visitor customization, use the script attribute or pass `allowVisitorCustomization: true` to `BotComputer.mount()`:

```html
<script src="https://bot.computer/embed/bot-embed.js"
        data-name="Aria" data-customize="true" defer></script>
```

Visitors can change hair, headwear, glasses, outfits and colors. **Restore original look** returns to the owner's design. Preferences are stored on the visitor's browser for that bot. Set a stable, unique `sessionId` in the configuration to carry preferences across revisions. Studio preview changes stay in the preview and are excluded from the published design.

## Actions, Moods and the Base Brain

Actions and voice styles go straight into any spoken text: a greeting, an AIML `<template>`, or `bot.say()`.

```xml
<category>
  <pattern># OPENING HOURS # | WHEN ARE YOU OPEN</pattern>
  <template>[cheerful] We're open nine to five, Monday to Friday. [thumbsup] See you soon! [wave]</template>
</category>
```

- Give an action a duration with `[walk=4s]` or `[nod=800ms]`. A line such as `[walk] Come with me! [wink]` lets a facial expression overlap the walk. Visitors who prefer reduced motion see a held pose for each full-body action.
- Choose a speaker with `[voice=crisp]`, `[voice=elder]`, `[voice=soft]` or `[voice=mellow]`. Use `[soft]` for a quieter delivery in the current voice and `[creak=0.9]` for stronger vocal fry at the end of phrases.
- `<emote>wave</emote>` still works and is treated as an inline `[wave]` at that point.
- Unknown `[tags]` are dropped rather than read aloud.

### Sounds the voice makes

A sound tag is different from an action: it is **heard**. The voice performs it, the avatar's face acts it out for exactly as long as it lasts, and captions name it.

```xml
<template>[gasp] Really? [chuckle] I did not see that coming. [sigh] Mondays.</template>
```

| Group | Tags |
|---|---|
| Laughter | `laugh` `chuckle` `giggle` `guffaw` `cackle` `snicker` `hoho` `hehe` `nervous` `evil` |
| Breath | `inhale` `exhale` `gasp` `sigh` `yawn` `sniff` `pant` `phew` |
| Reactions | `hmm` `mm` `mhm` `uh-huh` `uh-uh` `uh-oh` `uh` `um` `huh` `aha` `oh` `ooh` `aww` `ahh` `ugh` `eww` |
| Voice | `hum` `groan` `scream` `sob` `whimper` |
| Mouth | `shh` `psst` `tsk` `kiss` `brr` `grr` `raspberry` `whistle` `fweet` |
| Body | `cough` `ahem` `hiccup` `sneeze` `snore` |

- How strongly or how long: `[laugh=strong]`, `[sigh length=1.5]`, `[laugh=3s]`, `[snore for=5s]`.
- Speaking while laughing: `[laughing] And then he dropped it again! [/laughing]` (also `[chuckling]`, `[giggling]`), or set `voice: { laughter: 0.5 }` for the whole voice.
- `[laugh]`, `[chuckle]`, `[giggle]` and `[hmm]` used to be silent gestures. They are now sounds, so they are heard as well as seen. For a silent face use an action such as `[smile]` or `[think]`.
- In the chat bubble only the words are shown. With the voice muted the face still acts the sound out.

The base brain uses these where they fit (a `[chuckle]` after a joke, a `[sigh]` for a rough day, a `[yawn]` when you say you are tired), makes any of them on request ("can you do an evil laugh?", "yawn", "what sounds can you make?"), and takes direction about how it speaks: "speak slower", "speak louder", "whisper from now on" and "speak normally" set a style that lasts; "say that again slowly", "whisper that" and "say good morning in a deep voice" apply to one line. In your own templates the lasting style is the `voicestyle` predicate: `<set name="voicestyle">slow</set>`.

From JavaScript:

```js
const bot = await BotComputer.mount({ /* ... */ baseBrain: true }); // set false to use only your own AIML
bot.say("Hello! [wave] Nice to meet you. [wink]");
bot.emote("dance");   // play the two-step without speaking
bot.sound("laugh");   // a sound in the bot's own voice, with the face to match
bot.sound("sigh", { length: 1.5 });   // also: intensity (0..1, "gentle", "strong"), durationMs
bot.mood("happy");    // lasting facial mood: happy, excited, calm, sad, serious, or "" to clear
BotComputer.VOICE_SOUND_TAGS;         // every sound tag the voice performs
```

To give the bot its own voice for small talk, define any of `HELLO`, `HOW ARE YOU`, `WHO ARE YOU`, `WHAT CAN YOU DO`, `THANKS #`, `BYE`, `# JOKE #`, `# SING #` or `*` in your document and the base version steps aside. The full base layer is exported as `BotComputer.BASE_AIML_XML` (and `BASE_AIML_XML` from `src/aiml-engine.js`).

## Conversation

[`conversation/`](./conversation/) (live at **https://bot.computer/conversation/**) is a full-screen spoken conversation with a character. Press **Start talking** and say hello:

1. `vendor/stt/stt.wasm` ([stt.computer](https://github.com/f2i-com/stt)) listens to the microphone in a Web Worker and turns each phrase into words, with a confidence for every word.
2. The bot's AIML brain chooses the answer: the base brain plus a topic pack for the starting characters, or your own rules, facts and personality for a bot you designed.
3. `tts.wasm` speaks the answer while the avatar's lips follow the voice, gestures fire on cue and a caption highlights each word.

The microphone works like a walkie-talkie: it is paused while the character talks, so the character never hears itself, and it listens again 0.3 s after. Your turn ends when you have been quiet for the pause set in **Settings** (0.7 s to start with). Click or tap the character, or press Esc, to interrupt it. You can also type, or tap a suggestion.

**Talking with your own bot.** The studio saves your design in the browser, and the conversation page reads it: press **Talk to** (in the studio header) or **Talk out loud** (beside the chat tester) to open a conversation with the bot on screen, with its look, voice, personality, rules and business facts. Keep both tabs open and changes made in the studio reach the conversation within a second or two, without losing what it remembers about you. "Your bot" is also in the list of characters at the top of the page.

**Links.** `conversation/` opens with the last character used; `conversation/?with=chloe` (or `marcus`, `viktor`, `nova`, `arthur`, `aria`) opens with that character, and the address bar always shows the link for the current one, ready to share. `?with=yours` opens your own bot, in a browser where one has been designed.

**Size.** `stt.wasm` is about 14 MB (12 MB gzipped), with NVIDIA's English Conformer-CTC speech model inside (CC-BY-4.0, see `THIRD-PARTY-NOTICES.md`). Typed chat works immediately while the voice and recognizer load in the background. **Start talking** becomes available when the recognizer is ready. Only this page loads it: the studio and the embed widget do not. `vendor/stt/VERSION` records which stt release is vendored (the published v1.0.0).

## Personalities

A personality never changes which rule answers a question. It changes how the answer is worded and delivered, so one AIML document can power a bubbly bot on one site and a dry, formal one on another.

```js
const bot = await BotComputer.mount({ name: "Juno", persona: "bubbly" });   // a built-in character
bot.updateConfig({ persona: { id: "grumpy", chattiness: 0.8, laugh: "snicker", catchphrase: "Typical." } });
bot.updateConfig({ persona: null });                                         // exactly as written again

BotComputer.PERSONALITIES;                       // the ten characters and everything they say
const persona = BotComputer.randomPersona();     // a new one: a character with its dials and habits shuffled
const name = BotComputer.randomBotName("neutral");
const greeting = BotComputer.personaGreeting(persona, { name, role: "Guide", company: "Acme" });
```

With a `persona` and no `greeting`, the bot greets in character. What a personality is made of:

| Part | What it does |
|---|---|
| `id` | The character: `friendly`, `bubbly`, `calm`, `professional`, `witty`, `shy`, `grumpy`, `dramatic`, `laidback`, `curious`. It supplies the lines below and the defaults for everything else. |
| `energy` (0 to 1) | Low: exclamation marks become full stops and `[cheerful]` is spoken calmly. High: a short plain statement gets an exclamation mark. |
| `formality` | High: "I'm" becomes "I am", "isn't it?" becomes "is it not?". Low: the other way round. |
| `playfulness` | Low: the bot does not laugh, even where a rule says `[laugh]`. Higher: it adds its favourite gesture more often. |
| `chattiness` | How often its opening and closing habits appear. 0 switches them off. |
| `delivery`, `mood` | The voice style it speaks in (`cheerful`, `calm`, `soft`, `dramatic` ...) and the face it wears at rest. |
| `laugh`, `think`, `gesture` | The sound used wherever a rule says `[laugh]`, `[chuckle]` or `[giggle]`; the one used for `[hmm]`; a gesture it is fond of. |
| `openers`, `closers`, `catchphrase` | Things it tends to say first ("Ooh!", "Well, well."), last ("Easy peasy!") and now and then. |
| `petName` | What it calls a visitor whose name it does not know ("mate", "friend"). |
| `says` | Its own lines for ten moments: `hello`, `howareyou`, `whoareyou`, `thanks`, `bye`, `praise`, `laugh`, `unsure`, `listen`, `describe`. |

A few guard rails are built in. A reply to someone who is upset, and any reply that is `[sad]` or `[serious]`, is left without flourishes. A turn in a game or a riddle is not decorated, and what the engine remembers for `<that>` is always the reply as the rule wrote it. A voice the visitor asked for ("speak slower") wins over the personality's. Sounds made on request ("do an evil laugh") and anything a visitor asks to have repeated are said exactly as written.

**In your own AIML.** Three things are available:

```xml
<!-- 1. Let a line be said in the bot's own words when its personality has some -->
<category>
  <pattern>HELLO</pattern>
  <template><persona say="hello">Hi there! Welcome to Acme.</persona> Ask me about the menu.</template>
</category>

<!-- 2. Keep a rule out of it: said exactly as written, whatever the personality -->
<category persona="off">
  <pattern># TERMS #</pattern>
  <template>Our terms are at acme.example/terms. We're not able to give legal advice.</template>
</category>

<!-- 3. Answer differently for different characters -->
<template><condition name="personality"><li value="grumpy">Bah.</li><li>Lovely!</li></condition></template>
```

The personality itself can also be written in the document, which is handy when the AIML is all you ship. It wins over a `persona` passed in the config:

```xml
<persona id="grumpy" chattiness="0.6" laugh="snicker" petname="pal">
  <opener>Fine.</opener>
  <opener>If you insist.</opener>
  <closer>There. Happy?</closer>
  <say name="hello"><li>Oh. It's you. What do you need?</li></say>
</persona>
```

In lines written in the studio or passed in `says`, `{bot}`, `{role}` and `{company}` stand for the bot's details, `{daypart}` for morning, afternoon or evening, and `{,user}` for the visitor's name with a comma in front, or what the bot calls people, or nothing.

## Business Facts and Chat Memory

```js
const bot = await BotComputer.mount({
  name: "Aria",
  company: "Acme",
  facts: {
    about: "Acme roasts coffee by hand and delivers it across the country.",
    hours: "Mon-Fri, 9am-5pm",
    email: "hello@example.com",
    phone: "+61 400 123 456",
    address: "12 King Street, Sydney",
    pricing: "Bags start at fourteen dollars, and delivery is free over fifty.",
  },
  rememberChat: true, // default: the conversation continues on the visitor's next page (this tab only)
});
bot.clearChat(); // forget the conversation, on screen and in the bot's memory
```

Each fact is optional. "When are you open?", "what time do you shut?", "how do I get in touch?", "where are you?" and "how much is it?" are then answered from them, and a rule of your own on the same subject still wins. `BotComputer.BOT_FACTS` lists the keys.

In your own AIML, a fact is a bot property like `name` and `company`:

```xml
<!-- This rule only exists once the bot has an address. -->
<category requires="address">
  <pattern># PARKING # | WHERE CAN I PARK</pattern>
  <template>There is free parking behind <bot name="address"/>. [thumbsup]</template>
</category>

<!-- Properties work inside patterns too. -->
<category>
  <pattern>WHAT IS <bot name="company"/></pattern>
  <template><bot name="about"/></template>
</category>
```

`requires="email|phone"` means "any of these". In a `<condition>`, properties are available as `bot_<name>`, for example `<condition name="bot_phone"><li value="*">Call us on <bot name="phone"/>.</li></condition>`.

## How a Question Is Matched

Each step is tried only if the one before found nothing:

1. The words as typed (after shorthand, contractions, stretched words and filler such as "so ... then" are tidied up).
2. Other forms of a word, synonyms and everyday phrases.
3. Spelling mistakes, corrected against the words your rules use.
4. The right words in a different order, or with a few extra ones.
5. Meaning: the rule about your site that covers most of what was asked. A question about two things gets both answers.
6. Follow-ups: another member of the set the last question was about ("and Germany?"), a pronoun standing for the last item that was mentioned ("how much is it?", "what's the capital there?"), or "that" standing for the last sum ("divide that by 3").
7. Open-ended conversation: rules marked `late="true"`, such as `I LIKE *`.
8. The catch-all (`*`), with the nearest rules offered as suggestions.

Your rules come first throughout. A base-brain rule that contains a wildcard is treated as a guess: it only answers after steps 1 to 5 have been tried against your rules. And if one of your rules fits a sentence, it answers even where the base brain has an exact phrase for it, unless yours is an open template made only of everyday words (`WHAT IS *`).

The studio's test chat shows which step answered under every reply.

## Sets, Maps, Sums and Other AIML Extras

**Word sets and lookup maps.** Define them at the top level of your document, and one rule can answer for a whole list:

```xml
<map name="price">
  latte: four dollars fifty
  flat white: four dollars fifty
  banana bread: five dollars fifty
</map>
<set name="milk">oat, soy, almond, lactose free</set>

<category>
  <pattern># HOW MUCH # <set>price</set> #</pattern>
  <template>One <star index="3"/> is <map name="price"><star index="3"/></map>.</template>
</category>
<category>
  <pattern># <set>milk</set> MILK #</pattern>
  <template>Yes, we have <star index="2"/> milk.</template>
</category>
```

`<set>name</set>` in a pattern matches any one member (plurals included) and captures it like a wildcard. A map's keys can be used as a set of the same name. Maps also accept `<entry key="latte">four dollars fifty</entry>` elements. The "Café Menu & Prices" starter pack is a worked example. Built in: `<set>number</set>` (digits or words) and `<set>calculation</set>` (anything that is arithmetic). The base brain also defines `color`, `animal`, `job`, `weekday`, `language`, `praise`, `insult`, `capital` and a few more, which your rules may use.

**Arithmetic and dates.**

```xml
<calc><star/> * 1.1</calc>                 <!-- symbols or words: "12 times 12", "15 percent of 80", "half of 30" -->
<calc round="1"><get name="n"/> * 0.621371</calc>
<calc><star/> &lt; 10</calc>               <!-- comparisons give true or false -->
<date offset="1" format="%A, %B %d"/>      <!-- tomorrow -->
<daysuntil date="12-25"/>                  <!-- month-day; or weekday="saturday" -->
<count>5</count>                           <!-- 1, 2, 3, 4, 5 -->
<explode sep=", "><star/></explode>        <!-- c, a, t -->
```

`<calc>` only ever does arithmetic; nothing is run as code. It also reads sums given verb first: "divide 81 by 3", "add 5 to 10", "subtract 3 from 10".

**Recalling a sentence.** Inside a template, `<input index="1"/>` reads the visitor's original sentence, including when an `<srai>` redirects it. Index 2 reads the sentence immediately before it, which can be in the same message. For a bot reply, `<that index="2,1"/>` reads the final sentence of the reply two turns ago. Both indices count backwards from 1. Use `<request index="1"/>` or `<response index="1"/>` for the whole previous message or reply.

```xml
<category>
  <pattern>REPEAT THE LAST SENTENCE</pattern>
  <template><that index="1,1" default="I haven't said anything yet."/></template>
</category>
```

When the widget remembers a chat between pages, it restores the last twelve exchanges and recent references to items, calculations and questions about a set. A visitor can ask the price of a latte, open another page and type “and a mocha?” to continue the same question.

**Names and values worked out at run time.** As in AIML 2.0, an attribute can be written as a child element:

```xml
<set><name>favorite <star/></name><star index="2"/></set>          <!-- MY FAVORITE * IS * -->
<condition name="guess"><li><value><get name="answer"/></value>Correct!</li><li>Not quite.</li></condition>
```

**Rules that wait, insist, or step aside.**

```xml
<category late="true">   <!-- open-ended: tried only after everything else -->
  <pattern>I LIKE *</pattern> ...
</category>
<category firm="true">   <!-- base-layer rule that always answers at once -->
<template><condition name="pet"><li value="*">...</li><li><fallback/></li></condition></template>
```

`<fallback/>` answers as though nothing had matched, which lets a rule decide it does not apply after all. `<try>COUNT TO <star/></try>` is its opposite number: it gives the answer some rule has for that text, or nothing at all if only the catch-all would reply. The base brain's `CAN YOU *` uses it to do the thing when it can.

**What the engine tells your templates.** These predicates are kept up to date and can be used in `<condition>`: `personality` (the bot's character, such as `grumpy`, or empty), `voicestyle` (a speaking style put in front of every reply while it is set), `inputkind` (`request`, `question`, `statement` or `gibberish`), `mood` (`positive`, `negative`, `neutral`), `justvaried` (`yes` straight after a joke, a fact or anything else from a `<random>`), `fallbackstreak`, `didyoumean`, `daypart`, `dayname`, and `bot_<property>` for each bot property.

## License

Licensed under the [Apache License, Version 2.0](./LICENSE). Copyright 2026 f2i.com.

The vendored `tts.wasm` engine comes from [f2i-com/tts](https://github.com/f2i-com/tts), by the same authors. Third-party data, fonts and icons that ship with the project are credited in [THIRD-PARTY-NOTICES.md](./THIRD-PARTY-NOTICES.md).

## Brand Assets & Fonts

- `favicon.svg`, `favicon.ico`, `apple-touch-icon.png` — site icons (the mark is a little monitor whose face has a waveform for a mouth).
- `assets/logo.svg` (mark + wordmark, adapts to dark mode) and `assets/logo-mark.svg` (mark only).
- `assets/share-card.jpg` — the 1200×630 link-preview image used by the Open Graph and Twitter card tags in `index.html`.
- `robots.txt` and `sitemap.xml` — search engine housekeeping; update the `lastmod` date in the sitemap when the page changes meaningfully.
- `vendor/fonts/` — [Bricolage Grotesque](https://github.com/ateliertriay/bricolage) (SIL Open Font License), self-hosted for headings so the site still makes no third-party requests.
