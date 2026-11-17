<p><img src="./assets/logo.svg" alt="bot.computer" width="300"></p>

# bot.computer

**bot.computer** ([https://bot.computer](https://bot.computer)) is a pure HTML, CSS, JavaScript, and WebAssembly studio for creating customizable SitePal-inspired speaking website companions and AIML XML Q&A chatbots — powered locally in the browser by [`tts.wasm`](https://github.com/f2i-com/tts).

## Features

- **Interactive Body & Face Sculpting**: Drag handles directly on your companion's head, jaw, chin, neck, shoulders, chest, waist, and arms (mouse + mobile touch) or fine-tune proportions via studio sliders.
- **200 Hz Vocal-Tract Lip Sync (`tts.wasm`)**: Real-time 24 kHz physical vocal-tract speech synthesis drives 9 articulatory parameters every 5 ms (`jaw`, `tongueHeight`, `tongueFront`, `tongueTip`, `lipRound`, `lipSpread`, `lipClose`, `velum`, `energy`) plus prosodic brow lift, head nods, and cursor eye-tracking.
- **AIML 2.0 XML Chatbot Brain**: Turn any companion into an interactive Q&A guide using standard AIML XML (`<pattern>`, `*` / `_` / `#` / `^` wildcards, `<srai>`, `<random>`, `<that>`, `<topic>`, `<set>`/`<get>` memory, `<condition>`, `<emote>`, and `<reply>` quick chips), plus word sets and lookup maps (`<set>` in patterns, `<map>` in templates), arithmetic (`<calc>`), date maths, and rules that can step aside (`<fallback/>`).
- **Inline Avatar Actions**: Write `[wave]`, `[wink]`, `[nod]`, `[smile]`, `[laugh]`, `[think]`, `[surprised]`, `[shake]`, `[shrug]`, `[thumbsup]`, `[tilt]` or `[bow]` anywhere in a greeting or an answer. The tag is never spoken; the avatar performs it when the speech reaches that point. Voice styles such as `[cheerful]`, `[sad]` and `[serious]` also set the face.
- **A Voice That Laughs, Sighs and Whispers**: With `tts.wasm` 1.1 the voice makes 53 sounds that are not words, and the avatar acts each one out as it is heard: `[laugh]`, `[chuckle]`, `[giggle]`, `[gasp]`, `[sigh]`, `[yawn]`, `[hmm]`, `[aww]`, `[phew]`, `[whistle]`, `[ahem]`, `[sneeze]` and more. It can also speak while laughing (`[laughing] ... [/laughing]`, or the "Laughing while speaking" slider). The studio has a palette that plays any sound and inserts its tag, and captions say what was heard: "(laughs)".
- **Base Brain for General Conversation**: A built-in AIML layer of about 360 rules sits underneath your own, which always win. It handles greetings and goodbyes, how the visitor feels (with care for the serious cases), questions about the bot itself, compliments and complaints, jokes, riddles, trivia, rock paper scissors, guess my number, knock knock jokes, sums ("what's 15% of 80?"), unit conversions, dates ("how many days until Christmas?"), capitals and a little general knowledge. It remembers what a visitor says about themselves (name, age, work, pets, likes, favourites) for as long as the tab is open, and forgets it on request. How well does it do? On the five test conversations used to build it (33 to 159 everyday lines each) it has a specific, fitting answer for 93% to 99% of lines. Those scripts shaped the rules, so that is the best case. Each new script, on its first run, got a specific answer to between 57% and 68% of its lines; most of the rest got an honest "I don't know that one" or a sympathetic general reply, and a few got a wrong answer that was then fixed. It is a rule-based bot, not a language model: expect good small talk, not open-ended conversation.
- **Conversation That Keeps Its Thread**: "What's the capital of France?" then "and Germany?" continues the question. "My friend says the toasties are great" then "how much are they?" knows what "they" are. A riddle waits for a guess, but lets go when the subject changes. Something it has no rule for is answered in keeping with how it sounds: sympathy for a rough day, a question it cannot answer is admitted honestly, and a request it cannot help with is pointed to your contact details.
- **Matching That Understands What Was Meant**: Typos, chat shorthand ("whats ur pricing"), stretched words ("heyyy"), other forms of a word ("shipped" for "shipping"), synonyms ("fees" for "pricing", "voucher" for "discount"), everyday phrases ("money back"), several questions in one message ("hours and address?"), and being addressed by name. Wording no pattern anticipated is matched by what it is about, and when two rules fit equally well the bot offers both as "did you mean" suggestions instead of guessing. A reply is computed in about a millisecond, so it appears the moment Send is pressed.
- **Business Facts, No Rules Needed**: Fill in what you do, opening hours, email, phone, address and pricing, and the bot answers questions about them by itself. Phone numbers are read digit by digit and "Mon-Fri" is spoken as "Monday to Friday", while the chat bubble keeps the original text with clickable links.
- **Deeper Customisation**: Resting expression (smile, brow mood, eye openness), freckles, age lines, a beauty mark, eyeshadow, separate brow colour, earrings, neckwear (necklace, bow tie, scarf, lanyard), headwear (beanie, cap, headband, beret, headphones, headscarf), glasses including cat-eye and aviators, outfits including a polo, a scoop-neck top and an apron, hairstyles including twin braids and an optional fringe, extra backdrops, sculpt handles for brows, nose and hips, and "Random face" / "Random style" buttons. Left alone, the avatar makes small movements of its own.
- **100% Self-Contained Single-File Export**: Download a single local `<name>-bot.js` script (about 1.3 MB) with your sculpted avatar, voice settings, embedded AIML XML, and gzipped `tts.wasm` baked inside — zero servers, zero API keys, and zero external dependencies.
- **Studio Conveniences**: Undo / redo for the avatar's look (Ctrl+Z, Ctrl+Shift+Z), autosave of your design in the browser, save / load of the full configuration as JSON, a live articulation scope that traces jaw, tongue, lips, nasal and voicing while the bot speaks, a list of your rules with Try / Find / Remove, and a rule checker that points out misspelled `[actions]`, unknown tags, duplicate patterns and `<srai>` links that lead nowhere.
- **Mobile-First Studio & Embedded Dock**: Sticky docked mobile stage, thumb-friendly bottom navigation bar, touch-scaled sculpt handles, and Shadow-DOM-isolated mobile companion widget.

## Quick Start

```sh
npm run build   # syncs tts.wasm from ../tts (or E:\repos\softn_bot\tts) & bundles embed/bot-embed.js
npm test        # runs automated TTS viseme, sculptor, AIML XML, and embed SDK smoke tests
npm start       # serves https://bot.computer locally at http://localhost:8090/
```

## Embedding on Any Website

### Option 1: 100% Self-Contained Single Local File
Click **Download self-contained .js** in the studio and add one tag to your webpage:

```html
<script src="./aria-bot.js" defer></script>
```

### Option 2: Hosted on `https://bot.computer` (or Self-Hosted Assets)

```html
<script
  src="https://bot.computer/embed/bot-embed.js"
  data-wasm="https://bot.computer/vendor/tts/tts.wasm"
  data-aiml="./aria-brain.aiml"
  data-name="Aria"
  data-role="Website Concierge"
  defer
></script>
```

## Actions, Moods and the Base Brain

Actions and voice styles go straight into any spoken text: a greeting, an AIML `<template>`, or `bot.say()`.

```xml
<category>
  <pattern># OPENING HOURS # | WHEN ARE YOU OPEN</pattern>
  <template>[cheerful] We're open nine to five, Monday to Friday. [thumbsup] See you soon! [wave]</template>
</category>
```

- An action can carry its own length: `[wave=3s]`, `[nod=800ms]`.
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
bot.emote("wave");    // play one silent gesture now
bot.sound("laugh");   // a sound in the bot's own voice, with the face to match
bot.sound("sigh", { length: 1.5 });   // also: intensity (0..1, "gentle", "strong"), durationMs
bot.mood("happy");    // lasting facial mood: happy, excited, calm, sad, serious, or "" to clear
BotComputer.VOICE_SOUND_TAGS;         // every sound tag the voice performs
```

To give the bot its own voice for small talk, define any of `HELLO`, `HOW ARE YOU`, `WHO ARE YOU`, `WHAT CAN YOU DO`, `THANKS #`, `BYE`, `# JOKE #`, `# SING #` or `*` in your document and the base version steps aside. The full base layer is exported as `BotComputer.BASE_AIML_XML` (and `BASE_AIML_XML` from `src/aiml-engine.js`).

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

**What the engine tells your templates.** These predicates are kept up to date and can be used in `<condition>`: `voicestyle` (a speaking style put in front of every reply while it is set), `inputkind` (`request`, `question`, `statement` or `gibberish`), `mood` (`positive`, `negative`, `neutral`), `justvaried` (`yes` straight after a joke, a fact or anything else from a `<random>`), `fallbackstreak`, `didyoumean`, `daypart`, `dayname`, and `bot_<property>` for each bot property.

## License

Licensed under the [Apache License, Version 2.0](./LICENSE). Copyright 2026 f2i.com.

The vendored `tts.wasm` engine comes from [f2i-com/tts](https://github.com/f2i-com/tts), by the same authors. Third-party data, fonts and icons that ship with the project are credited in [THIRD-PARTY-NOTICES.md](./THIRD-PARTY-NOTICES.md).

## Brand Assets & Fonts

- `favicon.svg`, `favicon.ico`, `apple-touch-icon.png` — site icons (the mark is a little monitor whose face has a waveform for a mouth).
- `assets/logo.svg` (mark + wordmark, adapts to dark mode) and `assets/logo-mark.svg` (mark only).
- `assets/share-card.jpg` — the 1200×630 link-preview image used by the Open Graph and Twitter card tags in `index.html`.
- `robots.txt` and `sitemap.xml` — search engine housekeeping; update the `lastmod` date in the sitemap when the page changes meaningfully.
- `vendor/fonts/` — [Bricolage Grotesque](https://github.com/ateliertriay/bricolage) (SIL Open Font License), self-hosted for headings so the site still makes no third-party requests.
