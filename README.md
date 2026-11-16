# bot.computer

**bot.computer** ([https://bot.computer](https://bot.computer)) is a pure HTML, CSS, JavaScript, and WebAssembly studio for creating customizable SitePal-inspired speaking website companions and AIML XML Q&A chatbots — powered locally in the browser by [`tts.wasm`](https://github.com/f2i-com/tts).

## Features

- **Interactive Body & Face Sculpting**: Drag handles directly on your companion's head, jaw, chin, neck, shoulders, chest, waist, and arms (mouse + mobile touch) or fine-tune proportions via studio sliders.
- **200 Hz Vocal-Tract Lip Sync (`tts.wasm`)**: Real-time 24 kHz physical vocal-tract speech synthesis drives 9 articulatory parameters every 5 ms (`jaw`, `tongueHeight`, `tongueFront`, `tongueTip`, `lipRound`, `lipSpread`, `lipClose`, `velum`, `energy`) plus prosodic brow lift, head nods, and cursor eye-tracking.
- **AIML 2.0 XML Chatbot Brain**: Turn any companion into an interactive Q&A guide using standard AIML XML (`<pattern>`, `*` / `_` / `#` / `^` wildcards, `<srai>`, `<random>`, `<that>`, `<topic>`, `<set>`/`<get>` memory, `<condition>`, `<emote>`, and `<reply>` quick chips).
- **100% Self-Contained Single-File Export**: Download a single local `<name>-bot.js` script (~910 KB) with your sculpted avatar, voice settings, embedded AIML XML, and gzipped `tts.wasm` baked inside — zero servers, zero API keys, and zero external dependencies.
- **Mobile-First Studio & Embedded Dock**: Sticky docked mobile stage, thumb-friendly bottom navigation bar, touch-scaled sculpt handles, and Shadow-DOM-isolated mobile companion widget.

## Quick Start

```sh
npm run build   # syncs tts.wasm from ../tts (or E:\repos\softn_bot\tts) & bundles embed/bot-embed.js
npm test        # runs automated TTS viseme, sculptor, AIML XML, and embed SDK smoke tests
npm start       # serves https://bot.computer locally at http://localhost:8090/
```

## Embedding on Any Website

### Option 1: 100% Self-Contained Single Local File
Click **⬇ Download Self-Contained .JS** in the studio and add one tag to your webpage:

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
