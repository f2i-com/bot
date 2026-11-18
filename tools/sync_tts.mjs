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
].filter(Boolean);

const ttsDir = candidateTtsDirs.find((d) => fs.existsSync(path.join(d, "Cargo.toml")));
if (!ttsDir) {
  throw new Error(
    `Set TTS_REPO_DIR to your TTS checkout. Checked:\n  - ${candidateTtsDirs.join("\n  - ")}`
  );
}

const outDir = path.join(botRoot, "vendor", "tts");
const versionFile = path.join(outDir, "VERSION");

// Never replace a newer vendored build with an older local checkout. `vendor/tts/VERSION` records
// which tts release is vendored; pass --force to copy the local build regardless.
const versionOf = (text) => (/^\s*version\s*=\s*"([^"]+)"/m.exec(text) || [])[1] || "";
const asNumbers = (v) => String(v).trim().split(".").map((n) => parseInt(n, 10) || 0);
const isOlder = (a, b) => {
  const [x, y] = [asNumbers(a), asNumbers(b)];
  for (let i = 0; i < 3; i++) {
    if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) < (y[i] || 0);
  }
  return false;
};
const localVersion = versionOf(fs.readFileSync(path.join(ttsDir, "Cargo.toml"), "utf8"));
const vendoredVersion = fs.existsSync(versionFile) ? fs.readFileSync(versionFile, "utf8").trim() : "";
if (!process.argv.includes("--force") && localVersion && vendoredVersion && isOlder(localVersion, vendoredVersion)) {
  console.log(
    `[sync-tts] Skipped: the tts checkout in ${ttsDir} is v${localVersion}, older than the vendored v${vendoredVersion}. ` +
      `Update that checkout, or run with --force to copy it anyway.`
  );
  process.exit(0);
}

const pkgWasm = path.join(ttsDir, "pkg", "tts.wasm");
if (!fs.existsSync(pkgWasm)) {
  console.log(`[sync-tts] pkg/tts.wasm not found in ${ttsDir}; building via tools/build_wasm.mjs...`);
  execFileSync(process.execPath, [path.join(ttsDir, "tools", "build_wasm.mjs")], {
    cwd: ttsDir,
    stdio: "inherit",
  });
}

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

if (localVersion) fs.writeFileSync(versionFile, `${localVersion}\n`);

const wasmStat = fs.statSync(path.join(outDir, "tts.wasm"));
console.log(
  `[sync-tts] Synced tts.wasm (${(wasmStat.size / 1024).toFixed(0)} KB), tts.js, glue.js & profiles from ${ttsDir} -> vendor/tts/`
);
