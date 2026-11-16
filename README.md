<p><img src="./assets/logo.svg" alt="bot.computer" width="300"></p>

# bot.computer

**bot.computer** ([https://bot.computer](https://bot.computer)) is a pure HTML, CSS, JavaScript, and WebAssembly studio for creating customizable SitePal-inspired speaking website companions and AIML XML Q&A chatbots — powered locally in the browser by [`tts.wasm`](https://github.com/f2i-com/tts).

## Features

- **Interactive Body & Face Sculpting**: Drag handles directly on your companion's head, jaw, chin, neck, shoulders, chest, waist, and arms (mouse + mobile touch) or fine-tune proportions via studio sliders.
- **200 Hz Vocal-Tract Lip Sync (`tts.wasm`)**: Real-time 24 kHz physical vocal-tract speech synthesis drives 9 articulatory parameters every 5 ms (`jaw`, `tongueHeight`, `tongueFront`, `tongueTip`, `lipRound`, `lipSpread`, `lipClose`, `velum`, `energy`) plus prosodic brow lift, head nods, and cursor eye-tracking.
- **AIML 2.0 XML Chatbot Brain**: Turn any companion into an interactive Q&A guide using standard AIML XML (`<pattern>`, `*` / `_` / `#` / `^` wildcards, `<srai>`, `<random>`, `<that>`, `<topic>`, `<set>`/`<get>` memory, `<condition>`, `<emote>`, and `<reply>` quick chips).
- **100% Self-Contained Single-File Export**: Download a single local `<name>-bot.js` script (~910 KB) with your sculpted avatar, voice settings, embedded AIML XML, and gzipped `tts.wasm` baked inside — zero servers, zero API keys, and zero external dependencies.
- **Studio Conveniences**: Undo / redo for the avatar's look (Ctrl+Z, Ctrl+Shift+Z), autosave of your design in the browser, save / load of the full configuration as JSON, and a live articulation scope that traces jaw, tongue, lips, nasal and voicing while the bot speaks.
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

## Brand Assets & Fonts

- `favicon.svg`, `favicon.ico`, `apple-touch-icon.png` — site icons (the mark is a little monitor whose face has a waveform for a mouth).
- `assets/logo.svg` (mark + wordmark, adapts to dark mode) and `assets/logo-mark.svg` (mark only).
- `assets/share-card.jpg` — the 1200×630 link-preview image used by the Open Graph and Twitter card tags in `index.html`.
- `robots.txt` and `sitemap.xml` — search engine housekeeping; update the `lastmod` date in the sitemap when the page changes meaningfully.
- `vendor/fonts/` — [Bricolage Grotesque](https://github.com/ateliertriay/bricolage) (SIL Open Font License), self-hosted for headings so the site still makes no third-party requests.
