// Self-Contained Local Script & Snippet Generator for bot.computer.
// Packages `embed/bot-embed.js` + Gzipped Base64 `tts.wasm` + Customized Avatar + AIML XML
// into a single zero-dependency local `.js` (or standalone `.html`) file!

import { inspectAimlXml } from "./aiml-engine.js";
import { embedRuntimeName } from "./embed-profile.js";

// Prefer a question the author can try without first entering a topic or a conversation branch.
export function pageGuideExamples(rules) {
  const destinations = new Map();
  for (const rule of rules) {
    const standalone = !rule.isCatchAll && rule.that === "*" && rule.topic === "*";
    for (const target of rule.showcases) {
      if (!destinations.has(target)) destinations.set(target, { target, question: "", tourQuestions: [] });
      const example = destinations.get(target);
      if (!standalone || !rule.sample) continue;
      if (rule.tours.some(route => route[0] === target)) {
        if (!example.tourQuestions.includes(rule.sample)) example.tourQuestions.push(rule.sample);
      } else if (!rule.tours.length && rule.showcases.length === 1 && !example.question) {
        example.question = rule.sample;
      }
    }
  }
  return Array.from(destinations.values());
}

// Independent hosts and retries must not reuse another URL’s response or a failed fetch.
const runtimeCache = new Map();
const compressedWasmCache = new Map();
const rawWasmCache = new Map();

function loadCached(cache, url, load) {
  if (!cache.has(url)) {
    cache.set(url, load().catch(error => {
      cache.delete(url);
      throw error;
    }));
  }
  return cache.get(url);
}

export function slugifyBotName(name) {
  return (
    String(name || "my-bot")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "my-bot"
  );
}

async function getRawWasmBytes(wasmUrl = "./vendor/tts/tts.wasm") {
  return loadCached(rawWasmCache, wasmUrl, async () => {
    const response = await fetch(wasmUrl);
    if (!response.ok) throw new Error(`Could not fetch ${wasmUrl} (${response.status})`);
    return new Uint8Array(await response.arrayBuffer());
  });
}

async function gzipBytesInBrowser(rawBytes) {
  if (typeof CompressionStream !== "function") {
    throw new Error("CompressionStream('gzip') is required to pack self-contained single-file bundle.");
  }
  const cs = new CompressionStream("gzip");
  const writer = cs.writable.getWriter();
  writer.write(rawBytes);
  writer.close();
  const resp = new Response(cs.readable);
  return new Uint8Array(await resp.arrayBuffer());
}

function bytesToBase64(bytes) {
  const chunkSize = 0x8000;
  const parts = [];
  for (let i = 0; i < bytes.length; i += chunkSize) {
    parts.push(String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize)));
  }
  return btoa(parts.join(""));
}

async function getCompressedWasmBase64(wasmUrl = "./vendor/tts/tts.wasm") {
  return loadCached(compressedWasmCache, wasmUrl, async () => {
    const raw = await getRawWasmBytes(wasmUrl);
    return bytesToBase64(await gzipBytesInBrowser(raw));
  });
}

async function getEmbedRuntimeSource(embedJsUrl = "./embed/bot-embed.js") {
  return loadCached(runtimeCache, embedJsUrl, async () => {
    const response = await fetch(embedJsUrl);
    if (!response.ok) throw new Error(`Could not fetch ${embedJsUrl} (${response.status})`);
    return response.text();
  });
}

function safeJsonForScript(obj) {
  // Escape every `<` so configured text can never end the surrounding <script> block
  // (`</script>`) or open an HTML comment (`<!--`) when the bundle is inlined into a page.
  return JSON.stringify(obj, null, 2).replace(/</g, "\\u003c");
}

/** Makes configured text safe inside a JS block comment. */
function safeForBlockComment(text) {
  return String(text).replace(/\*\//g, "* /").replace(/[\r\n]+/g, " ");
}

function exportConfig(fullBotConfig) {
  const config = structuredClone(fullBotConfig);
  if (config.chatEnabled === false) {
    for (const key of ["aimlXml", "aimlUrl", "baseBrain", "facts", "chatStartOpen", "rememberChat"]) delete config[key];
  }
  if (config.speechEnabled === false) {
    delete config.wasmUrl;
    delete config.voice;
  }
  return config;
}

/**
 * Builds a 100% self-contained single `.js` file containing:
 *  - Compressed `tts.wasm` (24 kHz physical vocal-tract synthesizer + 200 Hz visemes)
 *  - Complete sculpted Avatar + Voice settings
 *  - Complete embedded AIML XML knowledge base
 *  - Shadow DOM Website Companion Widget
 */
export async function buildSelfContainedBotJs(fullBotConfig, urls = {}) {
  const [runtimeSrc, wasmGzB64] = await Promise.all([
    getEmbedRuntimeSource(urls.embedJsUrl || `./embed/${embedRuntimeName(fullBotConfig)}`),
    fullBotConfig.speechEnabled === false ? null : getCompressedWasmBase64(urls.wasmUrl || "./vendor/tts/tts.wasm"),
  ]);

  const cleanConfig = exportConfig(fullBotConfig);
  delete cleanConfig.wasmUrl;
  delete cleanConfig.aimlUrl;

  return [
    `/*!`,
    ` * Self-Contained Website Companion Bot — Generated by bot.computer`,
    ` * Bot: ${safeForBlockComment(cleanConfig.name || "Companion")} (${safeForBlockComment(cleanConfig.role || "Assistant")})`,
    ` * Renderer: ${cleanConfig.renderMode === "2d" ? "Canvas 2D" : "WebGL with Canvas fallback"}`,
    // No literal closing script tag in this comment: the bundle is also inlined into a <script>
    // block by the standalone demo page, where that text would end the script early.
    ` * Usage: add a script tag with src="./${slugifyBotName(cleanConfig.name)}-bot.js" and the defer attribute.`,
    ` */`,
    `(function(){`,
    ...(wasmGzB64 ? [`  globalThis.__BOT_COMPUTER_EMBEDDED_WASM_GZ__ = "${wasmGzB64}";`] : []),
    `  globalThis.__BOT_COMPUTER_AUTO_CONFIG__ = ${safeJsonForScript(cleanConfig)};`,
    `})();`,
    runtimeSrc,
  ].join("\n");
}

/**
 * Builds a complete single-file `.html` demo page with the self-contained bot embedded inline,
 * working offline even when opened directly from `file://`!
 */
export async function buildSelfContainedDemoHtml(fullBotConfig, urls = {}) {
  // The bundle goes inside an inline <script>, so neutralise the two sequences the HTML parser
  // reacts to there. `<\/script` and `<\!--` mean the same thing to JavaScript inside strings,
  // template literals, regexes and comments, which are the only places they occur in the bundle.
  const selfContainedJs = (await buildSelfContainedBotJs(fullBotConfig, urls))
    .replace(/<\/script/gi, "<\\/script")
    .replace(/<!--/g, "<\\!--");
  const escHtml = (text) =>
    String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const botName = escHtml(fullBotConfig.name || "Aria");
  const company = escHtml(fullBotConfig.company || "Your Website");
  const guideRules = fullBotConfig.chatEnabled !== false && fullBotConfig.aimlXml
    ? inspectAimlXml(fullBotConfig.aimlXml).rules : [];
  const destinations = pageGuideExamples(guideRules || []).map(({ target, question, tourQuestions }) => `
    <section class="card" data-bot-showcase="${escHtml(target)}" aria-label="${escHtml(target)}">
      <h2>${escHtml(target)}</h2>
      ${question ? `<p>Ask the avatar “${escHtml(question)}”.</p>` : ""}
      ${tourQuestions.map(q => `<p>Start a tour by asking “${escHtml(q)}”.</p>`).join("")}
      <code>data-bot-showcase="${escHtml(target)}"</code>
    </section>`).join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${botName} on ${company}</title>
  <style>
    body {
      margin: 0;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      background: #f3f5f9;
      color: #0d1322;
      line-height: 1.6;
    }
    .wrap {
      max-width: 760px;
      margin: 0 auto;
      padding: 64px 24px 220px;
    }
    h1 {
      font-size: clamp(30px, 5vw, 46px);
      line-height: 1.08;
      margin: 0 0 16px;
      letter-spacing: -0.03em;
    }
    p { color: #3b4660; font-size: 17px; margin: 0 0 14px; }
    .card {
      margin-top: 28px;
      padding: 20px 22px;
      background: #ffffff;
      border: 1px solid #dbe1ec;
      border-radius: 16px;
      color: #3b4660;
    }
    .card strong { color: #0d1322; }
    .card h2 { margin: 0 0 8px; font-size: 20px; overflow-wrap: anywhere; }
    .card code { overflow-wrap: anywhere; }
    code {
      background: #e8ecf3;
      padding: 2px 6px;
      border-radius: 6px;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <main class="wrap">
    <h1>Meet ${botName}, embedded on ${company}.</h1>
    <p>
      Move your cursor around this page and <strong>${botName}</strong> follows it.
      ${fullBotConfig.speechEnabled === false ? "Press <strong>Greet</strong> to see the greeting." : "Press <strong>Speak</strong> to hear the greeting."}${fullBotConfig.chatEnabled === false ? "" : " Press <strong>Ask</strong> to try a conversation."}
      ${fullBotConfig.allowVisitorCustomization === true ? "Open <strong>Customize</strong> on the widget to try a different hairstyle, outfit or color." : ""}
    </p>
    <div class="card">
      This HTML file contains your avatar and all the features you selected. It works offline.
    </div>
    ${destinations}
  </main>
  <script>
${selfContainedJs}
  </script>
</body>
</html>`;
}

/** Build install snippets against the same hosted release as the running studio. */
export function generateEmbedSnippets(fullBotConfig, studioBase = "https://bot.computer/") {
  const slug = slugifyBotName(fullBotConfig.name);
  const name = embedRuntimeName(fullBotConfig);
  const runtimeUrl = new URL("embed/" + name, studioBase).href;
  const hostedConfig = exportConfig({ ...fullBotConfig, wasmUrl: new URL("vendor/tts/tts.wasm", studioBase).href });
  const externalConfig = exportConfig({ ...fullBotConfig, wasmUrl: "./tts.wasm", aimlUrl: `./${slug}-brain.aiml` });
  delete externalConfig.aimlXml;

  // Site-owner text can include quotes, literal entity names, and AIML markup.
  function scriptTag(src, config) {
    const data = JSON.stringify(config).replace(/&/g, "&amp;").replace(/'/g, "&#39;").replace(/</g, "&lt;");
    return `<script src="${src}" data-config='${data}' defer></script>`;
  }

  const selfContainedHtml = `<script src="./${slug}-bot.js" defer></script>`;
  const hostedHtml = scriptTag(runtimeUrl, hostedConfig);
  const multiFileHtml = scriptTag("./bot-embed.js", externalConfig);
  const sdkJs = [
    `<script src="${runtimeUrl}" data-manual="true"></script>`,
    `<script type="module">`,
    `  const bot = await BotComputer.runtimes[${JSON.stringify(name)}].mount(${safeJsonForScript(hostedConfig).replace(/\n/g, "\n  ")});`,
    `  // From a button on your page: bot.emote("wave") or bot.ask("What moves can you do?")`,
    `</script>`,
  ].join("\n");
  return { slug, selfContainedHtml, hostedHtml, multiFileHtml, sdkJs };
}

export function triggerBrowserDownload(filename, content, mimeType = "application/octet-stream") {
  const blob =
    content instanceof Blob
      ? content
      : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function downloadRawWasmFile(wasmUrl = "./vendor/tts/tts.wasm") {
  const raw = await getRawWasmBytes(wasmUrl);
  triggerBrowserDownload("tts.wasm", raw, "application/wasm");
}

export async function downloadEmbedRuntimeFile(embedJsUrl = "./embed/bot-embed.js") {
  const src = await getEmbedRuntimeSource(embedJsUrl);
  triggerBrowserDownload("bot-embed.js", src, "text/javascript; charset=utf-8");
}
