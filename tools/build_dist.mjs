// Builds the complete upload-ready static website (`dist/site/`) and release bundles (`dist/*.zip`,
// `dist/bot-embed.js`, `dist/tts.wasm`, `dist/bot-sample-self-contained.js`) for https://bot.computer.
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { AVATAR_PRESETS } from "../src/avatar-renderer.js";
import { STARTER_AIML_PACKS } from "../src/aiml-engine.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const siteDir = path.join(distDir, "site");

// 1. Sync tts.wasm (if local ../tts repo exists) and rebuild embed/bot-embed.js
if (
  fs.existsSync(path.resolve(root, "..", "tts", "Cargo.toml")) ||
  fs.existsSync("E:\\repos\\softn_bot\\tts\\Cargo.toml")
) {
  execFileSync(process.execPath, [path.join(root, "tools", "sync_tts.mjs")], {
    cwd: root,
    stdio: "inherit",
  });
}
execFileSync(process.execPath, [path.join(root, "tools", "build_embed.mjs")], {
  cwd: root,
  stdio: "inherit",
});

// 2. Clean & populate upload-ready `dist/site/`
fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(siteDir, { recursive: true });

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

const siteFiles = [
  "index.html",
  "embed-demo.html",
  "conversation", // the spoken conversation page: https://bot.computer/conversation/
  "styles.css",
  "favicon.svg",
  "favicon.ico",
  "apple-touch-icon.png",
  "assets",
  "robots.txt",
  "sitemap.xml",
  "LICENSE",
  "NOTICE",
  "THIRD-PARTY-NOTICES.md",
  "CNAME",
  ".nojekyll",
];
for (const f of siteFiles) {
  const p = path.join(root, f);
  if (fs.existsSync(p)) copyRecursive(p, path.join(siteDir, f));
}
copyRecursive(path.join(root, "src"), path.join(siteDir, "src"));
copyRecursive(path.join(root, "embed"), path.join(siteDir, "embed"));
copyRecursive(path.join(root, "vendor"), path.join(siteDir, "vendor"));

// 3. Copy standalone release assets & generate pre-packed 1-file self-contained companion JS
const embedRuntimeSrc = fs.readFileSync(path.join(root, "embed", "bot-embed.js"), "utf8");
const rawWasmBytes = fs.readFileSync(path.join(root, "vendor", "tts", "tts.wasm"));
const wasmGzB64 = zlib.gzipSync(rawWasmBytes, { level: 9 }).toString("base64");

fs.copyFileSync(path.join(root, "embed", "bot-embed.js"), path.join(distDir, "bot-embed.js"));
fs.copyFileSync(path.join(root, "vendor", "tts", "tts.wasm"), path.join(distDir, "tts.wasm"));

const sampleConfig = {
  name: AVATAR_PRESETS[0].name,
  role: AVATAR_PRESETS[0].role,
  company: "bot.computer",
  greeting: AVATAR_PRESETS[0].greeting,
  chatEnabled: true,
  position: "bottom-right",
  size: "standard",
  eyeTracking: true,
  showCaptions: true,
  autoGreet: false,
  chatStartOpen: false,
  voice: AVATAR_PRESETS[0].voiceOverrides,
  avatar: AVATAR_PRESETS[0].avatar,
  aimlXml: STARTER_AIML_PACKS.concierge.xml,
};

const selfContainedSample = [
  `/*!`,
  ` * bot.computer — Pre-built 100% Self-Contained Sample Companion (Aria)`,
  ` * Includes 2.5D Avatar + AIML 2.0 XML Brain + Gzipped tts.wasm inside a single JS file.`,
  ` * Usage: <script src="./bot-sample-self-contained.js" defer></script>`,
  ` */`,
  `(function(){`,
  `  globalThis.__BOT_COMPUTER_EMBEDDED_WASM_GZ__ = "${wasmGzB64}";`,
  `  globalThis.__BOT_COMPUTER_AUTO_CONFIG__ = ${JSON.stringify(sampleConfig, null, 2).replace(/<\//g, "<\\/")};`,
  `})();`,
  embedRuntimeSrc,
].join("\n");

fs.writeFileSync(path.join(distDir, "bot-sample-self-contained.js"), selfContainedSample, "utf8");

// 4. Pure-Node Cross-Platform ZIP Writer (zero external CLI dependencies!)
const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function createZipBuffer(entries) {
  // entries: Array<{ name: string, data: Buffer }>
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBuf = Buffer.from(entry.name.replace(/\\/g, "/"), "utf8");
    const raw = Buffer.isBuffer(entry.data) ? entry.data : Buffer.from(entry.data);
    const deflated = zlib.deflateRawSync(raw, { level: 9 });
    const useDeflate = deflated.length < raw.length;
    const body = useDeflate ? deflated : raw;
    const method = useDeflate ? 8 : 0;
    const crc = crc32(raw);

    const localHdr = Buffer.alloc(30);
    localHdr.writeUInt32LE(0x04034b50, 0);
    localHdr.writeUInt16LE(20, 4); // version needed
    localHdr.writeUInt16LE(0x0800, 6); // UTF-8 flag
    localHdr.writeUInt16LE(method, 8);
    localHdr.writeUInt16LE(0, 10); // mod time
    localHdr.writeUInt16LE(0x5970, 12); // mod date
    localHdr.writeUInt32LE(crc, 14);
    localHdr.writeUInt32LE(body.length, 18);
    localHdr.writeUInt32LE(raw.length, 22);
    localHdr.writeUInt16LE(nameBuf.length, 26);
    localHdr.writeUInt16LE(0, 28);

    localParts.push(localHdr, nameBuf, body);

    const centHdr = Buffer.alloc(46);
    centHdr.writeUInt32LE(0x02014b50, 0);
    centHdr.writeUInt16LE(20, 4);
    centHdr.writeUInt16LE(20, 6);
    centHdr.writeUInt16LE(0x0800, 8);
    centHdr.writeUInt16LE(method, 10);
    centHdr.writeUInt16LE(0, 12);
    centHdr.writeUInt16LE(0x5970, 14);
    centHdr.writeUInt32LE(crc, 16);
    centHdr.writeUInt32LE(body.length, 20);
    centHdr.writeUInt32LE(raw.length, 24);
    centHdr.writeUInt16LE(nameBuf.length, 28);
    centHdr.writeUInt16LE(0, 30);
    centHdr.writeUInt16LE(0, 32);
    centHdr.writeUInt16LE(0, 34);
    centHdr.writeUInt16LE(0, 36);
    centHdr.writeUInt32LE(0, 38);
    centHdr.writeUInt32LE(offset, 42);

    centralParts.push(centHdr, nameBuf);
    offset += localHdr.length + nameBuf.length + body.length;
  }

  const centralBuf = Buffer.concat(centralParts);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralBuf.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, centralBuf, eocd]);
}

function collectFiles(baseDir, prefix = "") {
  const list = [];
  for (const name of fs.readdirSync(baseDir)) {
    const full = path.join(baseDir, name);
    const rel = prefix ? `${prefix}/${name}` : name;
    if (fs.statSync(full).isDirectory()) {
      list.push(...collectFiles(full, rel));
    } else {
      list.push({ name: rel, data: fs.readFileSync(full) });
    }
  }
  return list;
}

// 5. Build `dist/bot-computer-site.zip` (ready to upload straight to any web host!)
const siteZipBuf = createZipBuffer(collectFiles(siteDir));
fs.writeFileSync(path.join(distDir, "bot-computer-site.zip"), siteZipBuf);

// 6. Build `dist/bot-computer-embed-sdk.zip` (standalone embed kit for developers)
const sdkDemoHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>bot.computer · Local Embed SDK Demo</title>
</head>
<body style="font-family:system-ui,sans-serif;max-width:720px;margin:48px auto;padding:0 20px;line-height:1.6">
  <h1>bot.computer Embed SDK Demo</h1>
  <p>This page loads <code>./bot-sample-self-contained.js</code> — a single self-contained script with Aria's avatar, AIML XML chatbot brain, and <code>tts.wasm</code> baked inside.</p>
  <script src="./bot-sample-self-contained.js" defer></script>
</body>
</html>
`;

const sdkZipBuf = createZipBuffer([
  { name: "bot-embed.js", data: Buffer.from(embedRuntimeSrc, "utf8") },
  { name: "tts.wasm", data: rawWasmBytes },
  { name: "bot-sample-self-contained.js", data: Buffer.from(selfContainedSample, "utf8") },
  { name: "concierge.aiml", data: Buffer.from(STARTER_AIML_PACKS.concierge.xml, "utf8") },
  { name: "demo.html", data: Buffer.from(sdkDemoHtml, "utf8") },
  // Apache 2.0 asks that every copy carries the license and notices.
  ...["LICENSE", "NOTICE", "THIRD-PARTY-NOTICES.md"].map((name) => ({
    name,
    data: fs.readFileSync(path.join(root, name)),
  })),
]);
fs.writeFileSync(path.join(distDir, "bot-computer-embed-sdk.zip"), sdkZipBuf);

console.log(`[build-dist] Upload-ready site built in: dist/site/`);
console.log(
  `[build-dist] Release bundles ready:\n` +
    `  - dist/bot-computer-site.zip          (${(siteZipBuf.length / 1024).toFixed(0)} KB — full https://bot.computer web app)\n` +
    `  - dist/bot-computer-embed-sdk.zip     (${(sdkZipBuf.length / 1024).toFixed(0)} KB — standalone website embed kit)\n` +
    `  - dist/bot-embed.js                   (${(Buffer.byteLength(embedRuntimeSrc) / 1024).toFixed(0)} KB — Shadow DOM embed runtime)\n` +
    `  - dist/bot-sample-self-contained.js   (${(Buffer.byteLength(selfContainedSample) / 1024).toFixed(0)} KB — 1-file offline companion)\n` +
    `  - dist/tts.wasm                       (${(rawWasmBytes.length / 1024).toFixed(0)} KB — 24 kHz vocal-tract synthesizer)`
);
