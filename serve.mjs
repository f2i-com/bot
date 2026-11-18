// Zero-dependency static development server for bot.computer (pure HTML, CSS, JS, WASM, AIML/XML).
// Usage: node serve.mjs [port]
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const startPort = Number(process.argv[2] || process.env.PORT || 8090);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".wasm": "application/wasm",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".aiml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".wav": "audio/wav",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

function makeServer() {
  return http.createServer((req, res) => {
    const urlObj = new URL(req.url || "/", "http://localhost");
    let rel = decodeURIComponent(urlObj.pathname);
    // A folder asked for without its trailing slash (/conversation) goes to the folder, as hosts do,
    // so the page's relative links resolve.
    if (!rel.endsWith("/") && !path.extname(rel)) {
      const dir = path.resolve(root, rel.replace(/^[/\\]+/, ""));
      if (dir.startsWith(root + path.sep) && fs.existsSync(path.join(dir, "index.html"))) {
        res.writeHead(301, { Location: `${rel}/${urlObj.search}` });
        return res.end();
      }
    }
    if (rel.endsWith("/")) rel += "index.html";
    const safeRel = rel.replace(/^[/\\]+/, "");
    const filePath = path.resolve(root, safeRel);
    if (filePath !== root && !filePath.startsWith(root + path.sep)) {
      res.writeHead(403, { "Content-Type": "text/plain" });
      return res.end("Forbidden");
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end(`Not found: ${rel}`);
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
        "Cache-Control": "no-cache",
        "Access-Control-Allow-Origin": "*",
      });
      res.end(data);
    });
  });
}

function listen(port, triesLeft = 10) {
  const server = makeServer();
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE" && triesLeft > 0) {
      listen(port + 1, triesLeft - 1);
    } else {
      throw err;
    }
  });
  server.listen(port, "127.0.0.1", () => {
    console.log(`bot.computer running at http://localhost:${port}/`);
  });
}

listen(startPort);
