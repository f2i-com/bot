// Create a universal SDK plus standalone, tree-shaken runtimes for Studio exports.
import fs from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { embedRuntimeName } from "../src/embed-profile.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "embed");
fs.mkdirSync(out, { recursive: true });
const glue = fs.readFileSync(path.join(root, "vendor/tts/glue.js"), "utf8")
  .replace(/^if \(typeof wasm !== "undefined"[\s\S]*$/m, "export { bindTTS };");
const license = "/*! bot.computer | Copyright 2026 f2i.com | Apache-2.0 | https://github.com/f2i-com/bot/blob/main/THIRD-PARTY-NOTICES.md */";
const profiles = [{}];
for (const renderMode of ["2d", "3d"]) {
  for (const speechEnabled of [true, false]) {
    for (const brain of ["chat", "rules", "avatar"]) {
      profiles.push({ renderMode, speechEnabled, chatEnabled: brain !== "avatar", baseBrain: brain === "chat" });
    }
  }
}
const sizes = {};
for (const config of profiles) {
  const full = !config.renderMode;
  const name = embedRuntimeName(config);
  const flags = {
    FULL_SDK: full, HAS_WEBGL: config.renderMode !== "2d", HAS_SPEECH: config.speechEnabled !== false,
    HAS_CHAT: config.chatEnabled !== false, HAS_BASE_BRAIN: config.baseBrain !== false,
  };
  const result = await build({
    absWorkingDir: root,
    entryPoints: ["tools/embed-entry.js"],
    bundle: true, minify: true, format: "iife", target: "es2020", write: false,
    banner: { js: license }, legalComments: "none", define: {
      ...Object.fromEntries(Object.entries(flags).map(([key, enabled]) => [key, String(enabled)])),
      __BC_RUNTIME_NAME__: JSON.stringify(name),
    },
    plugins: [{
      name: "selected-features",
      setup(builder) {
        builder.onResolve({ filter: /^#tts-bindings$/ }, () => ({ path: "tts", namespace: "bindings" }));
        builder.onLoad({ filter: /.*/, namespace: "bindings" }, () => ({
          contents: flags.HAS_SPEECH ? glue : "export const bindTTS = null;",
        }));
        // Substitute feature flags before each module is parsed, so imports in
        // disabled branches never retain their dependencies in the bundle.
        builder.onLoad({ filter: /[\\/]embed-(widget-core|entry)\.js$/ }, ({ path: file }) => ({
          contents: fs.readFileSync(file, "utf8").replace(/^import .*?embed-capabilities\.js";\r?$/m, ""),
        }));
        // No WebGL initialization or mesh/material tables in an illustrated-only bot.
        if (!flags.HAS_WEBGL) builder.onLoad({ filter: /[\\/]turntable[\\/]live-avatar\.js$/ }, () => ({
          contents: "export const LiveAvatar = null;",
        }));
      },
    }],
  });
  const bytes = result.outputFiles[0].contents;
  fs.writeFileSync(path.join(out, name), bytes);
  sizes[name] = { bytes: bytes.length, gzip: gzipSync(bytes).length };
}
fs.writeFileSync(path.join(out, "sizes.json"), JSON.stringify(sizes, null, 2) + "\n");
console.log(`[build-embed] Built the SDK and ${profiles.length - 1} specialized runtimes`);
