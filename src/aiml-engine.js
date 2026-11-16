// Pure-JS AIML 1.0 / 2.0 XML Pattern-Matching Engine for bot.computer.
// Zero external dependencies; runs identically in browsers, Shadow DOM embeds, and Node.js.

const XML_ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

export function decodeXmlEntities(str) {
  return String(str).replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (full, ent) => {
    if (ent[0] === "#") {
      const code = ent[1].toLowerCase() === "x" ? parseInt(ent.slice(2), 16) : parseInt(ent.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : full;
    }
    return Object.prototype.hasOwnProperty.call(XML_ENTITIES, ent) ? XML_ENTITIES[ent] : full;
  });
}

export function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function lineNumberAt(src, index) {
  let line = 1;
  for (let i = 0; i < index && i < src.length; i++) {
    if (src.charCodeAt(i) === 10) line++;
  }
  return line;
}

function parseAttributes(attrText) {
  const attrs = {};
  const re = /([a-zA-Z_:][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
  let m;
  while ((m = re.exec(attrText)) !== null) {
    attrs[m[1].toLowerCase()] = decodeXmlEntities(m[2] !== undefined ? m[2] : m[3]);
  }
  return attrs;
}

/**
 * Lightweight, strict XML parser producing `{ type: "element", tag, attrs, children }`
 * and `{ type: "text", value }` nodes with exact line diagnostics on malformed XML.
 */
export function parseXmlDocument(xmlSource) {
  const src = String(xmlSource || "");
  const root = { type: "element", tag: "__root__", attrs: {}, children: [] };
  const stack = [root];
  let pos = 0;

  while (pos < src.length) {
    const lt = src.indexOf("<", pos);
    if (lt < 0) {
      const tail = src.slice(pos);
      if (tail) stack[stack.length - 1].children.push({ type: "text", value: decodeXmlEntities(tail) });
      break;
    }
    if (lt > pos) {
      const text = src.slice(pos, lt);
      stack[stack.length - 1].children.push({ type: "text", value: decodeXmlEntities(text) });
    }

    if (src.startsWith("<!--", lt)) {
      const endComment = src.indexOf("-->", lt + 4);
      if (endComment < 0) {
        throw new Error(`Unclosed XML comment starting at line ${lineNumberAt(src, lt)}`);
      }
      pos = endComment + 3;
      continue;
    }

    if (src.startsWith("<![CDATA[", lt)) {
      const endCdata = src.indexOf("]]>", lt + 9);
      if (endCdata < 0) {
        throw new Error(`Unclosed CDATA section starting at line ${lineNumberAt(src, lt)}`);
      }
      stack[stack.length - 1].children.push({ type: "text", value: src.slice(lt + 9, endCdata) });
      pos = endCdata + 3;
      continue;
    }

    if (src.startsWith("<?", lt)) {
      const endPi = src.indexOf("?>", lt + 2);
      if (endPi < 0) {
        throw new Error(`Unclosed XML declaration starting at line ${lineNumberAt(src, lt)}`);
      }
      pos = endPi + 2;
      continue;
    }

    if (src.startsWith("<!", lt)) {
      const endDecl = src.indexOf(">", lt + 2);
      if (endDecl < 0) {
        throw new Error(`Unclosed <! declaration at line ${lineNumberAt(src, lt)}`);
      }
      pos = endDecl + 1;
      continue;
    }

    // Find closing '>' while respecting quotes
    let gt = lt + 1;
    let quote = "";
    while (gt < src.length) {
      const ch = src[gt];
      if (quote) {
        if (ch === quote) quote = "";
      } else if (ch === '"' || ch === "'") {
        quote = ch;
      } else if (ch === ">") {
        break;
      }
      gt++;
    }
    if (gt >= src.length) {
      throw new Error(`Unclosed '<' tag starting at line ${lineNumberAt(src, lt)}`);
    }

    const rawTag = src.slice(lt + 1, gt).trim();
    pos = gt + 1;

    if (!rawTag) {
      throw new Error(`Empty <> tag at line ${lineNumberAt(src, lt)}`);
    }

    if (rawTag[0] === "/") {
      const closeName = rawTag.slice(1).trim().toLowerCase();
      if (stack.length <= 1) {
        throw new Error(`Unexpected closing tag </${closeName}> at line ${lineNumberAt(src, lt)}`);
      }
      const top = stack.pop();
      if (top.tag !== closeName) {
        throw new Error(
          `Mismatched closing tag </${closeName}> at line ${lineNumberAt(src, lt)} (expected </${top.tag}> opened at line ${top.line})`
        );
      }
      continue;
    }

    const selfClosing = rawTag.endsWith("/");
    const cleanInside = selfClosing ? rawTag.slice(0, -1).trim() : rawTag;
    const nameMatch = /^([a-zA-Z_:][\w:.-]*)([\s\S]*)$/.exec(cleanInside);
    if (!nameMatch) {
      throw new Error(`Invalid tag syntax <${rawTag}> at line ${lineNumberAt(src, lt)}`);
    }
    const tag = nameMatch[1].toLowerCase();
    const attrs = parseAttributes(nameMatch[2] || "");
    const elem = {
      type: "element",
      tag,
      attrs,
      children: [],
      line: lineNumberAt(src, lt),
    };
    stack[stack.length - 1].children.push(elem);
    if (!selfClosing) {
      stack.push(elem);
    }
  }

  if (stack.length > 1) {
    const unclosed = stack[stack.length - 1];
    throw new Error(`Unclosed tag <${unclosed.tag}> opened at line ${unclosed.line}`);
  }

  return root;
}

const CONTRACTIONS = [
  [/\bwhat's\b/gi, "what is"],
  [/\bwho's\b/gi, "who is"],
  [/\bwhere's\b/gi, "where is"],
  [/\bhow's\b/gi, "how is"],
  [/\bit's\b/gi, "it is"],
  [/\bthat's\b/gi, "that is"],
  [/\bthere's\b/gi, "there is"],
  [/\bi'm\b/gi, "i am"],
  [/\byou're\b/gi, "you are"],
  [/\bwe're\b/gi, "we are"],
  [/\bthey're\b/gi, "they are"],
  [/\bi've\b/gi, "i have"],
  [/\bi'll\b/gi, "i will"],
  [/\bi'd\b/gi, "i would"],
  [/\bcan't\b/gi, "cannot"],
  [/\bwon't\b/gi, "will not"],
  [/\bdon't\b/gi, "do not"],
  [/\bdoesn't\b/gi, "does not"],
  [/\bdidn't\b/gi, "did not"],
  [/\bisn't\b/gi, "is not"],
  [/\baren't\b/gi, "are not"],
  [/\blet's\b/gi, "let us"],
];

export function normalizeAimlInput(text, isPattern = false) {
  let s = String(text || "").trim();
  for (const [re, rep] of CONTRACTIONS) {
    s = s.replace(re, rep);
  }
  if (isPattern) {
    // Keep AIML wildcards (* _ # ^ $) and alphanumeric words
    s = s
      .toUpperCase()
      .replace(/[^A-Z0-9*_^#$ ]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  } else {
    s = s
      .toUpperCase()
      .replace(/[^A-Z0-9 ]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  return s;
}

function splitSentences(text) {
  const clean = stripSpeechTags(text).trim();
  if (!clean) return [""];
  const parts = clean
    .split(/(?<=[.!?])\s+/)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length ? parts : [clean];
}

/** Strips inline TTS control brackets like `[cheerful, speed=1.1]` for clean visual chat display. */
export function stripSpeechTags(text) {
  return String(text || "")
    .replace(/\[sing[^\]]*\]([\s\S]*?)\[\/sing\]/gi, (_m, score) => {
      // Extract lyrics from `Note:Beats=Lyric` tokens when displaying sung phrases in chat
      const lyrics = [];
      for (const tok of score.split(/\s+/)) {
        const eq = tok.indexOf("=");
        if (eq > 0) {
          const lyr = tok.slice(eq + 1).replace(/~/g, "").replace(/-$/, "");
          if (lyr) lyrics.push(lyr);
        }
      }
      return lyrics.length ? `♪ ${lyrics.join(" ")} ♪` : "♪ (singing) ♪";
    })
    .replace(/\[[a-zA-Z_/][^\]]*\]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

const PERSON_SWAPS = [
  [/\bi am\b/gi, "__P_YOU_ARE__"],
  [/\byou are\b/gi, "__P_I_AM__"],
  [/\bmy\b/gi, "__P_YOUR__"],
  [/\byour\b/gi, "__P_MY__"],
  [/\bmine\b/gi, "__P_YOURS__"],
  [/\byours\b/gi, "__P_MINE__"],
  [/\bmyself\b/gi, "__P_YOURSELF__"],
  [/\byourself\b/gi, "__P_MYSELF__"],
  [/\bi\b/gi, "__P_YOU__"],
  [/\bme\b/gi, "__P_YOU__"],
];

function swapPerson(str) {
  let out = String(str || "");
  for (const [re, token] of PERSON_SWAPS) out = out.replace(re, token);
  return out
    .replace(/__P_YOU_ARE__/g, "you are")
    .replace(/__P_I_AM__/g, "I am")
    .replace(/__P_YOUR__/g, "your")
    .replace(/__P_MY__/g, "my")
    .replace(/__P_YOURS__/g, "yours")
    .replace(/__P_MINE__/g, "mine")
    .replace(/__P_YOURSELF__/g, "yourself")
    .replace(/__P_MYSELF__/g, "myself")
    .replace(/__P_YOU__/g, "you");
}

function getPlainText(node) {
  if (!node) return "";
  if (node.type === "text") return node.value;
  return (node.children || []).map(getPlainText).join("");
}

/**
 * Matches token array `words` against AIML `patTokens`, returning an array of captured wildcard
 * strings or `null` if no match. Respects AIML wildcard arity (`_` / `*` = 1+, `#` / `^` = 0+).
 */
function matchTokens(patTokens, words, pIdx = 0, wIdx = 0, captures = []) {
  if (pIdx === patTokens.length && wIdx === words.length) {
    return captures;
  }
  if (pIdx >= patTokens.length) return null;

  const tok = patTokens[pIdx];
  if (tok === "#" || tok === "^") {
    // 0 or more words: '#' is greedy/early, '^' prefers shorter capture first
    if (tok === "#") {
      for (let end = wIdx; end <= words.length; end++) {
        const cap = words.slice(wIdx, end).join(" ");
        const res = matchTokens(patTokens, words, pIdx + 1, end, [...captures, cap]);
        if (res) return res;
      }
    } else {
      for (let end = wIdx; end <= words.length; end++) {
        const cap = words.slice(wIdx, end).join(" ");
        const res = matchTokens(patTokens, words, pIdx + 1, end, [...captures, cap]);
        if (res) return res;
      }
    }
    return null;
  }

  if (tok === "_" || tok === "*") {
    // 1 or more words
    if (wIdx >= words.length) return null;
    for (let end = wIdx + 1; end <= words.length; end++) {
      const cap = words.slice(wIdx, end).join(" ");
      const res = matchTokens(patTokens, words, pIdx + 1, end, [...captures, cap]);
      if (res) return res;
    }
    return null;
  }

  if (wIdx >= words.length) return null;
  const cleanTok = tok.startsWith("$") ? tok.slice(1) : tok;
  if (cleanTok === words[wIdx]) {
    return matchTokens(patTokens, words, pIdx + 1, wIdx + 1, captures);
  }
  return null;
}

/**
 * Computes deterministic AIML 2.0 priority score for a pattern so specific rules always beat `*`.
 * Priority per token: `$WORD` (6) > `#` (5) > `_` (4) > `WORD` (3) > `^` (2) > `*` (1).
 */
function scoreCategory(cat) {
  let patternScore = 0;
  for (const tok of cat.patTokens) {
    if (tok.startsWith("$")) patternScore = patternScore * 8 + 6;
    else if (tok === "#") patternScore = patternScore * 8 + 5;
    else if (tok === "_") patternScore = patternScore * 8 + 4;
    else if (tok === "^") patternScore = patternScore * 8 + 2;
    else if (tok === "*") patternScore = patternScore * 8 + 1;
    else patternScore = patternScore * 8 + 3;
  }
  const exactWordCount = cat.patTokens.filter((t) => !["*", "_", "#", "^"].includes(t)).length;
  const topicBonus = cat.topic !== "*" ? 1e12 : 0;
  const thatBonus = cat.that !== "*" ? 1e9 : 0;
  return topicBonus + thatBonus + exactWordCount * 1e6 + patternScore;
}

export class AIMLEngine {
  constructor(options = {}) {
    this.botProps = {
      name: "Aria",
      role: "Website Companion",
      company: "bot.computer",
      website: "https://bot.computer",
      ...(options.botProps || {}),
    };
    this.vars = new Map([["topic", "*"]]);
    this.categories = [];
    this.quickChips = [];
    this.lastBotThat = "";
    this.history = [];
    this._randomMemory = new WeakMap();
    if (options.xml) {
      this.loadXML(options.xml);
    }
  }

  setBotProps(props) {
    Object.assign(this.botProps, props || {});
  }

  resetSession() {
    this.vars.clear();
    this.vars.set("topic", "*");
    this.lastBotThat = "";
    this.history = [];
  }

  loadXML(xmlString) {
    const doc = parseXmlDocument(xmlString);
    const aimlNode =
      doc.children.find((n) => n.type === "element" && n.tag === "aiml") || doc;

    const categories = [];
    const quickChips = [];
    const xmlBotProps = {};

    const extractCategory = (catNode, topicPattern = "*") => {
      let patternNodes = [];
      let thatNode = null;
      let templateNode = null;

      for (const child of catNode.children || []) {
        if (child.type !== "element") continue;
        if (child.tag === "pattern") patternNodes.push(child);
        else if (child.tag === "that") thatNode = child;
        else if (child.tag === "template") templateNode = child;
      }

      if (!patternNodes.length || !templateNode) return;
      const thatNorm = thatNode ? normalizeAimlInput(getPlainText(thatNode), true) || "*" : "*";
      const thatTokens = thatNorm.split(" ").filter(Boolean);
      const topicNorm = normalizeAimlInput(topicPattern, true) || "*";
      const topicTokens = topicNorm.split(" ").filter(Boolean);

      for (const pNode of patternNodes) {
        // Support pipe-separated convenience patterns `HELLO | HI | HEY` as well as standard AIML
        const rawPat = getPlainText(pNode);
        const variants = rawPat.includes("|") ? rawPat.split("|") : [rawPat];
        for (const v of variants) {
          const patNorm = normalizeAimlInput(v, true);
          if (!patNorm) continue;
          const patTokens = patNorm.split(" ").filter(Boolean);
          const entry = {
            pattern: patNorm,
            patTokens,
            that: thatNorm,
            thatTokens,
            topic: topicNorm,
            topicTokens,
            template: templateNode,
            line: catNode.line || 1,
          };
          entry.score = scoreCategory(entry);
          categories.push(entry);
        }
      }
    };

    for (const child of aimlNode.children || []) {
      if (child.type !== "element") continue;
      if (child.tag === "bot" || child.tag === "property" || child.tag === "meta") {
        const k = child.attrs.name || child.attrs.key;
        const v = child.attrs.value ?? getPlainText(child).trim();
        if (k && v) {
          if (k.toLowerCase() === "chip" || k.toLowerCase() === "suggest") {
            quickChips.push(v);
          } else {
            xmlBotProps[k.toLowerCase()] = v;
          }
        }
      } else if (child.tag === "chips" || child.tag === "suggestions") {
        for (const c of child.children || []) {
          if (c.type === "element") {
            const label = getPlainText(c).trim();
            if (label) quickChips.push(label);
          }
        }
      } else if (child.tag === "category") {
        extractCategory(child, "*");
      } else if (child.tag === "topic") {
        const topicName = child.attrs.name || "*";
        for (const sub of child.children || []) {
          if (sub.type === "element" && sub.tag === "category") {
            extractCategory(sub, topicName);
          }
        }
      }
    }

    // Sort highest specificity first
    categories.sort((a, b) => b.score - a.score);

    this.categories = categories;
    this.quickChips = quickChips;
    this.xmlBotProps = xmlBotProps;
    return {
      valid: true,
      categories: categories.length,
      quickChips,
      botProps: { ...xmlBotProps, ...this.botProps },
    };
  }

  findMatch(inputText) {
    const norm = normalizeAimlInput(inputText, false);
    const words = norm ? norm.split(" ") : [];
    if (!words.length) return null;

    const activeTopic = normalizeAimlInput(this.vars.get("topic") || "*", false) || "*";
    const activeTopicWords = activeTopic === "*" ? ["*"] : activeTopic.split(" ");
    const lastThatNorm = normalizeAimlInput(this.lastBotThat || "", false);
    const lastThatWords = lastThatNorm ? lastThatNorm.split(" ") : [];

    for (const cat of this.categories) {
      let topicStars = [];
      if (cat.topic !== "*") {
        if (activeTopic === "*") continue;
        const ts = matchTokens(cat.topicTokens, activeTopicWords);
        if (!ts) continue;
        topicStars = ts;
      }

      let thatStars = [];
      if (cat.that !== "*") {
        if (!lastThatWords.length) continue;
        const ths = matchTokens(cat.thatTokens, lastThatWords);
        if (!ths) continue;
        thatStars = ths;
      }

      const stars = matchTokens(cat.patTokens, words);
      if (stars) {
        return { category: cat, stars, thatStars, topicStars };
      }
    }
    return null;
  }

  reply(userInput) {
    const rawInput = String(userInput || "").trim();
    if (!rawInput) {
      return {
        speechText: "",
        displayText: "",
        chips: this.quickChips.slice(0, 4),
        emote: null,
        matchedPattern: null,
      };
    }

    const sideEffects = { chips: [], emote: null };
    const speechRaw = this.#respondInternal(rawInput, 0, sideEffects).trim();
    const fallback =
      speechRaw ||
      `I'm not sure about that yet, but I'm happy to help with questions about ${this.botProps.company || "our site"}!`;
    const displayText = stripSpeechTags(fallback);
    const sentences = splitSentences(displayText);
    this.lastBotThat = sentences[sentences.length - 1] || displayText;
    this.history.push({ user: rawInput, bot: displayText });

    return {
      speechText: fallback,
      displayText,
      chips: sideEffects.chips.length ? sideEffects.chips : [],
      emote: sideEffects.emote,
      matchedPattern: sideEffects.matchedPattern || null,
    };
  }

  #respondInternal(inputText, depth, sideEffects) {
    if (depth > 22) return "";
    const hit = this.findMatch(inputText);
    if (!hit) return "";
    if (depth === 0) {
      sideEffects.matchedPattern = hit.category.pattern;
    }
    const ctx = {
      input: inputText,
      stars: hit.stars,
      thatStars: hit.thatStars,
      topicStars: hit.topicStars,
      depth,
      sideEffects,
    };
    return this.#evalChildren(hit.category.template.children, ctx);
  }

  #evalChildren(nodes, ctx) {
    let out = "";
    for (const node of nodes || []) {
      out += this.#evalNode(node, ctx);
    }
    return out;
  }

  #evalNode(node, ctx) {
    if (!node) return "";
    if (node.type === "text") return node.value;

    const tag = node.tag;
    const attrs = node.attrs || {};

    switch (tag) {
      case "star": {
        const idx = Math.max(1, parseInt(attrs.index || "1", 10)) - 1;
        return (ctx.stars[idx] || "").toLowerCase();
      }
      case "thatstar": {
        const idx = Math.max(1, parseInt(attrs.index || "1", 10)) - 1;
        return (ctx.thatStars[idx] || "").toLowerCase();
      }
      case "topicstar": {
        const idx = Math.max(1, parseInt(attrs.index || "1", 10)) - 1;
        return (ctx.topicStars[idx] || "").toLowerCase();
      }
      case "bot": {
        const key = (attrs.name || "").toLowerCase();
        return this.botProps[key] ?? this.xmlBotProps?.[key] ?? "";
      }
      case "get": {
        const key = (attrs.name || "").toLowerCase();
        const val = this.vars.get(key);
        return val !== undefined && val !== "" ? val : (attrs.default ?? "");
      }
      case "set": {
        const key = (attrs.name || "").toLowerCase();
        const val = this.#evalChildren(node.children, ctx).trim();
        if (key) this.vars.set(key, val);
        return val;
      }
      case "think": {
        this.#evalChildren(node.children, ctx);
        return "";
      }
      case "srai": {
        const target = this.#evalChildren(node.children, ctx).trim();
        return target ? this.#respondInternal(target, ctx.depth + 1, ctx.sideEffects) : "";
      }
      case "sr": {
        const firstStar = ctx.stars[0] || "";
        return firstStar ? this.#respondInternal(firstStar, ctx.depth + 1, ctx.sideEffects) : "";
      }
      case "random": {
        const items = (node.children || []).filter((c) => c.type === "element" && c.tag === "li");
        if (!items.length) return "";
        const lastIdx = this._randomMemory.get(node);
        let idx = Math.floor(Math.random() * items.length);
        if (items.length > 1 && idx === lastIdx) {
          idx = (idx + 1) % items.length;
        }
        this._randomMemory.set(node, idx);
        return this.#evalChildren(items[idx].children, ctx).trim();
      }
      case "condition": {
        const varName = (attrs.name || "").toLowerCase();
        const curVal = (this.vars.get(varName) || "").trim().toLowerCase();
        if (attrs.value !== undefined) {
          return curVal === attrs.value.trim().toLowerCase()
            ? this.#evalChildren(node.children, ctx)
            : "";
        }
        const branches = (node.children || []).filter((c) => c.type === "element" && c.tag === "li");
        for (const li of branches) {
          const checkName = (li.attrs.name || varName).toLowerCase();
          const actual = (this.vars.get(checkName) || "").trim().toLowerCase();
          if (li.attrs.value === undefined) {
            return this.#evalChildren(li.children, ctx);
          }
          if (actual === li.attrs.value.trim().toLowerCase()) {
            return this.#evalChildren(li.children, ctx);
          }
        }
        return "";
      }
      case "uppercase":
        return this.#evalChildren(node.children, ctx).toUpperCase();
      case "lowercase":
        return this.#evalChildren(node.children, ctx).toLowerCase();
      case "formal":
        return this.#evalChildren(node.children, ctx).replace(/\b\w/g, (c) => c.toUpperCase());
      case "sentence": {
        const s = this.#evalChildren(node.children, ctx).trim();
        return s ? s[0].toUpperCase() + s.slice(1) : "";
      }
      case "person":
      case "person2":
        return swapPerson(this.#evalChildren(node.children, ctx));
      case "date":
        return new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
      case "time":
        return new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
      case "size":
        return String(this.categories.length);
      case "version":
        return "bot.computer AIML 2.0";
      case "input":
        return ctx.input;
      case "that":
        return this.lastBotThat;
      case "br":
        return "\n";
      case "emote":
      case "gesture": {
        const g = this.#evalChildren(node.children, ctx).trim().toLowerCase();
        if (g) ctx.sideEffects.emote = g;
        return "";
      }
      case "reply":
      case "button":
      case "chip":
      case "suggest": {
        let text = "";
        let postback = "";
        const textEl = (node.children || []).find((c) => c.type === "element" && c.tag === "text");
        const postEl = (node.children || []).find((c) => c.type === "element" && c.tag === "postback");
        if (textEl) {
          text = this.#evalChildren(textEl.children, ctx).trim();
          postback = postEl ? this.#evalChildren(postEl.children, ctx).trim() : text;
        } else {
          text = this.#evalChildren(node.children, ctx).trim();
          postback = attrs.postback || text;
        }
        if (text) ctx.sideEffects.chips.push({ label: text, query: postback });
        return "";
      }
      case "oob":
      case "chips": {
        this.#evalChildren(node.children, ctx);
        return "";
      }
      default:
        return this.#evalChildren(node.children, ctx);
    }
  }
}

/** Validates AIML XML and returns summary metadata for the Studio UI. */
export function inspectAimlXml(xmlString, botProps = {}) {
  try {
    const engine = new AIMLEngine({ botProps });
    const res = engine.loadXML(xmlString);
    const rules = engine.categories.slice(0, 60).map((c) => ({
      pattern: c.pattern,
      that: c.that,
      topic: c.topic,
      preview: stripSpeechTags(getPlainText(c.template)).replace(/\s+/g, " ").trim().slice(0, 110),
      line: c.line,
    }));
    return {
      valid: true,
      categories: res.categories,
      quickChips: res.quickChips,
      rules,
    };
  } catch (err) {
    return {
      valid: false,
      error: err.message || String(err),
      categories: 0,
      quickChips: [],
      rules: [],
    };
  }
}

/** Appends a new `<category>` rule cleanly before `</aiml>` in an AIML XML document. */
export function appendAimlRule(xmlString, { pattern, answer, chips = [], emote = "" }) {
  // Normalize each `|`-separated alternative on its own; normalizing the whole string would strip the
  // pipes and merge every alias into one long pattern that never matches.
  const cleanPattern =
    String(pattern || "")
      .split("|")
      .map((alt) => normalizeAimlInput(alt, true))
      .filter(Boolean)
      .join(" | ") || "HELLO";
  const chipXml = chips
    .map((c) => c.trim())
    .filter(Boolean)
    .map((c) => `<reply>${escapeXml(c)}</reply>`)
    .join("");
  const emoteXml = emote ? `<emote>${escapeXml(emote)}</emote>` : "";
  const block = [
    `  <category>`,
    `    <pattern>${escapeXml(cleanPattern)}</pattern>`,
    `    <template>${emoteXml}${escapeXml(answer.trim())}${chipXml}</template>`,
    `  </category>`,
  ].join("\n");

  const src = String(xmlString || "").trim();
  const closeIdx = src.toLowerCase().lastIndexOf("</aiml>");
  if (closeIdx >= 0) {
    return `${src.slice(0, closeIdx).trimEnd()}\n\n${block}\n</aiml>\n`;
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<aiml version="2.0">\n${block}\n</aiml>\n`;
}

// ============================================================================
// Built-in Starter AIML 2.0 XML Knowledge Packs
// ============================================================================

export const STARTER_AIML_PACKS = {
  concierge: {
    id: "concierge",
    label: "SaaS & Website Concierge",
    description: "Greets visitors, answers pricing/features/support Q&A, remembers names, and books demos.",
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<aiml version="2.0">
  <!-- Default quick-ask chips shown in the companion chat bar -->
  <chips>
    <chip>What can you do?</chip>
    <chip>Pricing &amp; Plans</chip>
    <chip>How does lip-sync work?</chip>
    <chip>Sing me a song!</chip>
  </chips>

  <category>
    <pattern>HELLO</pattern>
    <template>
      <emote>wave</emote>
      <random>
        <li>[cheerful] Hi there! I'm <bot name="name"/>, your <bot name="role"/> at <bot name="company"/>. Ask me anything!</li>
        <li>[happy] Welcome! I'm <bot name="name"/>. How can I help guide you around <bot name="company"/> today?</li>
        <li>Hey! Great to meet you. I'm <bot name="name"/> — feel free to ask about features, pricing, or embedding!</li>
      </random>
      <reply>What can you do?</reply>
      <reply>Pricing &amp; Plans</reply>
      <reply>Self-contained embed</reply>
    </template>
  </category>

  <category><pattern>HI</pattern><template><srai>HELLO</srai></template></category>
  <category><pattern>HEY</pattern><template><srai>HELLO</srai></template></category>
  <category><pattern>HI *</pattern><template><srai>HELLO</srai></template></category>
  <category><pattern>HEY *</pattern><template><srai>HELLO</srai></template></category>
  <category><pattern>GOOD MORNING</pattern><template><srai>HELLO</srai></template></category>
  <category><pattern>GOOD AFTERNOON</pattern><template><srai>HELLO</srai></template></category>

  <category>
    <pattern>WHO ARE YOU</pattern>
    <template>
      I'm <bot name="name"/>, an interactive speaking companion powered by WebAssembly vocal-tract physics and an AIML XML brain. Everything runs 100% locally in your browser!
      <reply>How does lip-sync work?</reply>
      <reply>Self-contained embed</reply>
    </template>
  </category>
  <category><pattern>WHAT IS YOUR NAME</pattern><template><srai>WHO ARE YOU</srai></template></category>

  <category>
    <pattern># WHAT CAN YOU DO #</pattern>
    <template>
      <emote>happy</emote>
      I greet visitors out loud, track your cursor across the page, answer questions instantly via AIML pattern matching, and embed onto any website as a single self-contained JavaScript file!
      <reply>Pricing &amp; Plans</reply>
      <reply>Self-contained embed</reply>
      <reply>Sing me a song!</reply>
    </template>
  </category>
  <category><pattern># FEATURES #</pattern><template><srai>WHAT CAN YOU DO</srai></template></category>

  <category>
    <pattern># PRICING #</pattern>
    <template>
      [calm] Because <bot name="company"/> runs directly in the visitor's browser with WebAssembly synthesis, there are zero per-minute voice API bills! You can self-host your companion completely free.
      <reply>Self-contained embed</reply>
      <reply>Book a demo</reply>
    </template>
  </category>
  <category><pattern># PRICE #</pattern><template><srai>PRICING</srai></template></category>
  <category><pattern># COST #</pattern><template><srai>PRICING</srai></template></category>
  <category><pattern># PLANS #</pattern><template><srai>PRICING</srai></template></category>

  <category>
    <pattern># LIP SYNC #</pattern>
    <template>
      My voice comes from a physical model of the human larynx and vocal tract in Rust and WebAssembly. Every 5 milliseconds it outputs exact jaw, tongue, and lip positions at 200 frames per second!
      <reply>Self-contained embed</reply>
      <reply>Sing me a song!</reply>
    </template>
  </category>
  <category><pattern># LIPSYNC #</pattern><template><srai>LIP SYNC</srai></template></category>
  <category><pattern>HOW DOES * WORK</pattern><template><srai>LIP SYNC</srai></template></category>

  <category>
    <pattern># EMBED #</pattern>
    <template>
      <emote>nod</emote>
      Open the Embed tab in the studio to copy a 1-line script tag or download a 100% self-contained JS bundle with my avatar, AIML XML brain, and WebAssembly voice baked right inside!
      <reply>Pricing &amp; Plans</reply>
      <reply>What can you do?</reply>
    </template>
  </category>
  <category><pattern># SELF CONTAINED #</pattern><template><srai>EMBED</srai></template></category>
  <category><pattern># DOWNLOAD #</pattern><template><srai>EMBED</srai></template></category>

  <category>
    <pattern>MY NAME IS *</pattern>
    <template>
      <think><set name="username"><formal><star/></formal></set></think>
      <emote>happy</emote>
      [cheerful] Wonderful to meet you, <get name="username"/>! Would you like a quick tour of what I can do?
      <reply>Yes please</reply>
      <reply>Pricing &amp; Plans</reply>
    </template>
  </category>
  <category><pattern>CALL ME *</pattern><template><srai>MY NAME IS <star/></srai></template></category>

  <category>
    <pattern>YES #</pattern>
    <that>* QUICK TOUR OF WHAT I CAN DO</that>
    <template>
      <srai>WHAT CAN YOU DO</srai>
    </template>
  </category>

  <category>
    <pattern>WHAT IS MY NAME</pattern>
    <template>
      <condition name="username">
        <li value="">You haven't told me your name yet! Just say "My name is..." and I'll remember it.</li>
        <li>Your name is <get name="username"/>, of course!</li>
      </condition>
    </template>
  </category>

  <category>
    <pattern># DEMO #</pattern>
    <template>
      <emote>wave</emote>
      You're experiencing the live demo right now! Try sculpting my shoulders and face in the Designer, or edit my XML brain in the Chat Bot tab.
    </template>
  </category>

  <category>
    <pattern># SING #</pattern>
    <template>
      <emote>happy</emote>
      [cheerful] Clearing my vocal folds! [sing bpm=112] C4:1=Wel- E4:1=come G4:1.5=to E4:0.5=the | F4:1=fu- A4:1=ture G4:2=web! [/sing] [happy] How was my pitch?
      <reply>That was awesome!</reply>
      <reply>Tell me a joke</reply>
    </template>
  </category>

  <category>
    <pattern># JOKE #</pattern>
    <template>
      <emote>wink</emote>
      [cheerful] Why did the WebAssembly avatar never lose its voice? [pause=280ms] Because its vocal folds are compiled in release mode!
      <reply>Sing me a song!</reply>
      <reply>What can you do?</reply>
    </template>
  </category>

  <category>
    <pattern># THANK #</pattern>
    <template>
      <emote>happy</emote>
      [warmth=0.8] You're very welcome<condition name="username"><li value="">!</li><li>, <get name="username"/>!</li></condition> Let me know if you need anything else.
    </template>
  </category>
  <category><pattern>THANKS #</pattern><template><srai>THANK</srai></template></category>
  <category><pattern># AWESOME #</pattern><template><emote>happy</emote>[excited] Thank you so much! Having physical vocal folds makes all the difference!</template></category>

  <category>
    <pattern>*</pattern>
    <template>
      <emote>think</emote>
      <random>
        <li>That's a great question about "<star/>"! Try asking me about features, pricing, lip-sync, or how to embed me on your site.</li>
        <li>Hmm, I don't have a specific pattern for "<star/>" in my AIML XML yet — you can add one in seconds in the Chat Bot tab!</li>
      </random>
      <reply>What can you do?</reply>
      <reply>Pricing &amp; Plans</reply>
      <reply>Self-contained embed</reply>
    </template>
  </category>
</aiml>`,
  },

  ecommerce: {
    id: "ecommerce",
    label: "Online Store Assistant",
    description: "Answers shipping, returns, sizing, promo codes, and product recommendation questions.",
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<aiml version="2.0">
  <chips>
    <chip>Shipping times</chip>
    <chip>Return policy</chip>
    <chip>Any discount codes?</chip>
    <chip>Sizing help</chip>
  </chips>

  <category>
    <pattern>HELLO</pattern>
    <template>
      <emote>wave</emote>
      [cheerful] Welcome to <bot name="company"/>! I'm <bot name="name"/>, your personal shopping guide. Looking for shipping info, sizing, or today's discount?
      <reply>Shipping times</reply>
      <reply>Return policy</reply>
      <reply>Any discount codes?</reply>
    </template>
  </category>
  <category><pattern>HI #</pattern><template><srai>HELLO</srai></template></category>
  <category><pattern>HEY #</pattern><template><srai>HELLO</srai></template></category>

  <category>
    <pattern># SHIPPING #</pattern>
    <template>
      Orders ship within 24 hours! Standard delivery takes 3 to 5 business days, and orders over $50 ship completely free.
      <reply>Return policy</reply>
      <reply>Any discount codes?</reply>
    </template>
  </category>
  <category><pattern># DELIVERY #</pattern><template><srai>SHIPPING</srai></template></category>

  <category>
    <pattern># RETURN #</pattern>
    <template>
      We offer hassle-free 30-day returns and free exchanges on every unworn item. Just enter your order number on our returns portal!
      <reply>Shipping times</reply>
      <reply>Sizing help</reply>
    </template>
  </category>
  <category><pattern># REFUND #</pattern><template><srai>RETURN</srai></template></category>

  <category>
    <pattern># DISCOUNT #</pattern>
    <template>
      <emote>wink</emote>
      [whisper, softer] Secret tip... [reset, cheerful] Use code WELCOME15 at checkout for 15 percent off your first order today!
      <reply>Shipping times</reply>
      <reply>Return policy</reply>
    </template>
  </category>
  <category><pattern># COUPON #</pattern><template><srai>DISCOUNT</srai></template></category>
  <category><pattern># PROMO #</pattern><template><srai>DISCOUNT</srai></template></category>

  <category>
    <pattern># SIZING #</pattern>
    <template>
      Our pieces run true to size! If you prefer a relaxed studio fit, we recommend sizing up one step.
      <reply>Return policy</reply>
    </template>
  </category>
  <category><pattern># SIZE #</pattern><template><srai>SIZING</srai></template></category>

  <category>
    <pattern>*</pattern>
    <template>
      I can help you with shipping times, our 30-day return policy, sizing advice, or discount codes! Which one can I check for you?
      <reply>Shipping times</reply>
      <reply>Return policy</reply>
      <reply>Any discount codes?</reply>
    </template>
  </category>
</aiml>`,
  },

  portfolio: {
    id: "portfolio",
    label: "Portfolio & Agency Guide",
    description: "Introduces a creator or studio, skills, featured work, and availability for projects.",
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<aiml version="2.0">
  <chips>
    <chip>About our studio</chip>
    <chip>Tech stack &amp; skills</chip>
    <chip>Are you available?</chip>
    <chip>How to contact</chip>
  </chips>

  <category>
    <pattern>HELLO</pattern>
    <template>
      <emote>wave</emote>
      Hey! I'm <bot name="name"/>, digital host for <bot name="company"/>. Ask me about our work, tech stack, or project availability!
      <reply>About our studio</reply>
      <reply>Tech stack &amp; skills</reply>
      <reply>Are you available?</reply>
    </template>
  </category>
  <category><pattern>HI #</pattern><template><srai>HELLO</srai></template></category>

  <category>
    <pattern># ABOUT #</pattern>
    <template>
      We craft fast, tactile software, WebAssembly engines, and interactive web experiences with zero unnecessary bloat.
      <reply>Tech stack &amp; skills</reply>
      <reply>Are you available?</reply>
    </template>
  </category>

  <category>
    <pattern># STACK #</pattern>
    <template>
      Our core toolkit includes Rust, WebAssembly, pure HTML/CSS/JavaScript, Canvas 2D &amp; WebGL graphics, and real-time audio synthesis.
      <reply>Are you available?</reply>
      <reply>How to contact</reply>
    </template>
  </category>
  <category><pattern># SKILLS #</pattern><template><srai>STACK</srai></template></category>

  <category>
    <pattern># AVAILABLE #</pattern>
    <template>
      <emote>happy</emote>
      [cheerful] Yes! We are currently booking select product &amp; creative engineering collaborations for next month.
      <reply>How to contact</reply>
    </template>
  </category>
  <category><pattern># HIRE #</pattern><template><srai>AVAILABLE</srai></template></category>

  <category>
    <pattern># CONTACT #</pattern>
    <template>
      Drop us a note anytime via the contact button on <bot name="website"/> and we'll get back to you within one business day!
    </template>
  </category>

  <category>
    <pattern>*</pattern>
    <template>
      Curious about "<star/>"? Feel free to ask about our studio, tech stack, availability, or how to get in touch!
      <reply>About our studio</reply>
      <reply>Tech stack &amp; skills</reply>
      <reply>How to contact</reply>
    </template>
  </category>
</aiml>`,
  },

  companion: {
    id: "companion",
    label: "Friendly AI Companion & Singer",
    description: "Classic ALICE/ELIZA-style conversationalist with memory, jokes, reflections, and singing.",
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<aiml version="2.0">
  <chips>
    <chip>How are you feeling?</chip>
    <chip>Sing Twinkle Star</chip>
    <chip>Tell me a riddle</chip>
    <chip>I feel creative today</chip>
  </chips>

  <category>
    <pattern>HELLO</pattern>
    <template>
      <emote>wave</emote>
      [cheerful] Hello friend! I'm <bot name="name"/>. Tell me your name, ask for a song, or tell me what's on your mind!
      <reply>How are you feeling?</reply>
      <reply>Sing Twinkle Star</reply>
      <reply>Tell me a riddle</reply>
    </template>
  </category>
  <category><pattern>HI #</pattern><template><srai>HELLO</srai></template></category>

  <category>
    <pattern>HOW ARE YOU #</pattern>
    <template>
      <emote>happy</emote>
      My vocal tract resonances are tuned and I'm running at 200 frames per second! How are you doing today?
    </template>
  </category>

  <category>
    <pattern>I FEEL *</pattern>
    <template>
      <emote>nod</emote>
      [calm] Why do you think you feel <person><star/></person> right now? Tell me more about it!
    </template>
  </category>

  <category>
    <pattern># SING #</pattern>
    <template>
      <emote>happy</emote>
      [sing bpm=106] C4:1=Twin- C4:1=kle G4:1=twin- G4:1=kle | A4:1=lit- A4:1=tle G4:2=star [/sing] [cheerful] Singing straight from physical vocal folds!
      <reply>Tell me a riddle</reply>
    </template>
  </category>

  <category>
    <pattern># RIDDLE #</pattern>
    <template>
      <emote>wink</emote>
      I speak without a recorded sample, and I have a tongue made of floating-point numbers. What am I? [pause=320ms] A WebAssembly vocal tract!
      <reply>Sing Twinkle Star</reply>
    </template>
  </category>

  <category>
    <pattern>*</pattern>
    <template>
      <random>
        <li>Interesting! When you say "<person><star/></person>", what makes that stand out to you?</li>
        <li>I love chatting with you! Ask me to sing a song, tell a riddle, or share how you feel today.</li>
      </random>
      <reply>Sing Twinkle Star</reply>
      <reply>Tell me a riddle</reply>
    </template>
  </category>
</aiml>`,
  },
};
