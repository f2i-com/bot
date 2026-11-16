// Syncs built `tts.wasm`, `tts.js`, `src/glue.js`, and speaker profiles from the local `tts` repository
// into `./vendor/tts/` so `bot.computer` runs as a pure HTML/CSS/JS static web app.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const botRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const candidateTtsDirs = [
  process.env.TTS_REPO_DIR,
  path.resolve(botRoot, "..", "tts"),
  "E:\\repos\\softn_bot\\tts",
  "E:\\repos\\bot-computer-app\\tts",
].filter(Boolean);

const ttsDir = candidateTtsDirs.find((d) => fs.existsSync(path.join(d, "Cargo.toml")));
if (!ttsDir) {
  throw new Error(
    `Could not locate TTS repository. Checked:\n  - ${candidateTtsDirs.join("\n  - ")}`
  );
}

const pkgWasm = path.join(ttsDir, "pkg", "tts.wasm");
if (!fs.existsSync(pkgWasm)) {
  console.log(`[sync-tts] pkg/tts.wasm not found in ${ttsDir}; building via tools/build_wasm.mjs...`);
  execFileSync(process.execPath, [path.join(ttsDir, "tools", "build_wasm.mjs")], {
    cwd: ttsDir,
    stdio: "inherit",
  });
}

const outDir = path.join(botRoot, "vendor", "tts");
const outProfiles = path.join(outDir, "profiles");
fs.mkdirSync(outProfiles, { recursive: true });

fs.copyFileSync(path.join(ttsDir, "pkg", "tts.wasm"), path.join(outDir, "tts.wasm"));
fs.copyFileSync(path.join(ttsDir, "pkg", "tts.js"), path.join(outDir, "tts.js"));
fs.copyFileSync(path.join(ttsDir, "src", "glue.js"), path.join(outDir, "glue.js"));

const profilesSrc = path.join(ttsDir, "profiles");
if (fs.existsSync(profilesSrc)) {
  for (const name of fs.readdirSync(profilesSrc)) {
    if (name.endsWith(".json")) {
      fs.copyFileSync(path.join(profilesSrc, name), path.join(outProfiles, name));
    }
  }
}

const wasmStat = fs.statSync(path.join(outDir, "tts.wasm"));
console.log(
  `[sync-tts] Synced tts.wasm (${(wasmStat.size / 1024).toFixed(0)} KB), tts.js, glue.js & profiles from ${ttsDir} -> vendor/tts/`
);
