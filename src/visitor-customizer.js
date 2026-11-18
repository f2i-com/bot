import { GLASSES_STYLES, HAIR_STYLES, HEADWEAR_STYLES, OUTFIT_STYLES } from "./avatar-renderer.js";

const choices = [
  ["hairStyle", "Hairstyle", HAIR_STYLES],
  ["headwear", "Headwear", HEADWEAR_STYLES],
  ["outfitStyle", "Outfit", OUTFIT_STYLES],
  ["glasses", "Glasses", GLASSES_STYLES],
];
const colors = [
  ["skinColor", "Skin tone"],
  ["hairColor", "Hair color"],
  ["outfitPrimary", "Outfit color"],
  ["outfitAccent", "Accent color"],
];

function cleanOverrides(raw) {
  const result = {};
  if (!raw || typeof raw !== "object") return result;
  for (const [key, , options] of choices) {
    if (options.some(({ id }) => raw[key] === id)) result[key] = raw[key];
  }
  for (const [key] of colors) {
    if (typeof raw[key] === "string" && /^#[0-9a-f]{6}$/i.test(raw[key])) result[key] = raw[key].toLowerCase();
  }
  return result;
}

/** An explicit sessionId keeps the same visitor look across revisions of an embed.
 * Otherwise identify the published character by its identity and original appearance.
 */
export function visitorLookKey(config) {
  const prefix = "bot-computer:look:v1:";
  if (config.sessionId) return prefix + "id:" + String(config.sessionId);
  const look = Object.keys(config.avatar).sort().map(key => config.avatar[key]);
  let hash = 2166136261;
  for (const letter of JSON.stringify(look)) hash = Math.imul(hash ^ letter.charCodeAt(0), 16777619);
  return prefix + JSON.stringify([config.company, config.name, config.role, hash >>> 0]);
}

/** Local visitor changes overlay the host's avatar. The renderer receives a new
 * design only when the visitor or the host actually changes it.
 */
export function createVisitorCustomizer({ panel, ownerAvatar, storageKey, onChange }) {
  let base = ownerAvatar;
  const fields = new Map();
  const grid = panel.querySelector(".bc-look-fields");
  const palette = panel.querySelector(".bc-look-colors");
  const reset = panel.querySelector(".bc-look-reset");
  grid.replaceChildren();
  palette.replaceChildren();
  function read() {
    try {
      return cleanOverrides(JSON.parse(localStorage.getItem(storageKey)));
    } catch {
      return {};
    }
  }
  let overrides = storageKey ? read() : {};

  function sync() {
    const avatar = { ...base, ...overrides };
    for (const [key, input] of fields) input.value = avatar[key];
    reset.disabled = !Object.keys(overrides).length;
    onChange(avatar);
  }

  function store(key) {
    if (!storageKey) return;
    try {
      // Merge this field with the latest settings if another tab has updated
      // the same bot. A reset clears every personal choice for this character.
      const stored = key ? read() : {};
      if (key && Object.hasOwn(overrides, key)) stored[key] = overrides[key];
      else if (key) delete stored[key];
      if (Object.keys(stored).length) localStorage.setItem(storageKey, JSON.stringify(stored));
      else localStorage.removeItem(storageKey);
    } catch {
      // Sandboxed frames and private windows can still edit for this visit.
    }
  }

  function addField(container, key, title, input) {
    const label = document.createElement("label");
    const text = document.createElement("span");
    text.id = `bc-label-${key}`;
    text.textContent = title;
    input.setAttribute("aria-labelledby", text.id);
    label.append(text, input);
    container.appendChild(label);
    fields.set(key, input);
    const change = () => {
      if (input.value === base[key]) delete overrides[key];
      else overrides[key] = input.value;
      sync();
    };
    input.addEventListener("input", change);
    input.addEventListener("change", () => {
      change();
      store(key);
    });
  }

  for (const [key, title, options] of choices) {
    const select = document.createElement("select");
    for (const { id, label } of options) select.add(new Option(label, id));
    addField(grid, key, title, select);
  }
  for (const [key, title] of colors) {
    const input = document.createElement("input");
    input.type = "color";
    addField(palette, key, title, input);
  }
  reset.onclick = () => {
    overrides = {};
    store();
    sync();
  };
  sync();
  return {
    setOwnerAvatar(avatar) {
      base = avatar;
      sync();
    },
  };
}
