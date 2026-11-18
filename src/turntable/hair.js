import { mixColor as tint } from "./geometry.js";
import { patch, stroke } from "./head-surfaces.js";

const PI = Math.PI,
  TAU = 2 * PI;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const pulse = (t) => Math.sin(clamp(t, 0, 1) * PI);
const polar = (azimuth, latitude, lift = 0) => [
  (0.599 + lift) * Math.sin(latitude) * Math.sin(azimuth),
  (0.785 + lift) * Math.cos(latitude) + 0.008,
  (0.591 + lift) * Math.sin(latitude) * Math.cos(azimuth) - 0.045,
];

function capLimit(theta) {
  return 1.06 + 0.99 * (1 - Math.cos(theta)) * 0.5 + 0.16 * Math.sin(theta) ** 2;
}

// A lock follows the scalp from the crown, then narrows to a pointed tip.
// The ridge and its painted highlight share a surface, even in profile.
function scalpLock(p, start, sweep, endLat, halfWidth, baseColor, shine, index, volume = 0) {
  const startLat = 0.13 + 0.025 * (index % 3);
  function surface(side, t, lift = 0) {
    const eased = t * (0.28 + 0.72 * t);
    const width =
      halfWidth * (0.33 + 0.67 * Math.sin(t * PI * 0.77)) * (1 - clamp((t - 0.63) / 0.37, 0, 1) ** 1.28);
    const azimuth = start + sweep * eased + side * width;
    const lat = lerp(startLat, endLat, t) + 0.018 * Math.sin(t * PI) * side;
    return polar(
      azimuth,
      lat,
      0.025 + (volume + 0.0028 * index) * pulse(t) + 0.03 * (1 - side * side) * Math.sin(PI * t) ** 0.6 + lift,
    );
  }
  patch(p, 8, 19, (u, v) => surface(u * 2 - 1, v), baseColor, true);
  patch(
    p,
    2,
    12,
    (u, v) => {
      const t = 0.25 + 0.025 * (index % 3) + 0.53 * v,
        w = 0.13 * pulse(v) ** 0.65 * (1 + 0.42 * Math.sin(v * PI * 2.1));
      return surface(-0.27 + (2 * u - 1) * w, t, 0.0025);
    },
    shine,
    true,
  );
}

function fringe(p, a, base, highlight) {
  if (["none", "buzz", "afro", "curly_halo", "mohawk"].includes(a.hairStyle)) return;
  const bang = a.fringe && !["swept", "side_sweep", "updo", "updo_bun", "quiff"].includes(a.hairStyle);
  if (!bang) {
    // The part is offset towards the temple. Strands fan across the forehead.
    const tips = [
      [-1.27, 1.62],
      [-0.91, 1.31],
      [-0.34, 1.07],
      [0.32, 1.21],
      [0.66, 1.34],
      [0.97, 1.48],
      [1.27, 1.64],
    ];
    for (const [i, [tip, lat]] of tips.entries()) {
      const crown = -0.62 + (i - 2) * 0.115;
      scalpLock(
        p,
        crown,
        tip - crown,
        lat,
        0.4,
        tint(base, highlight, 0.046 * (i % 3)),
        tint(base, highlight, 0.61),
        i,
        a.hairStyle === "quiff" ? 0.091 : 0.022,
      );
    }
    return;
  }
  const ends = [1.51, 1.36, 1.29, 1.45, 1.28, 1.36, 1.54];
  for (let i = 0; i < 7; i++) {
    const t = i / 6,
      theta = lerp(-1.18, 1.18, t);
    const crown = theta * 0.47 - 0.41;
    scalpLock(
      p,
      crown,
      theta - crown,
      ends[i],
      0.35,
      tint(base, highlight, 0.02 + 0.045 * (i % 3)),
      tint(base, highlight, 0.58),
      i,
      0.01,
    );
  }
}

function backPanel(p, style, length, base, highlight) {
  const wavy = ["long_waves", "wolf_shag", "bob", "half_up", "side_braid"].includes(style);
  const roundBob = ["bob", "french_bob", "sleek_bob"].includes(style);
  const edge = roundBob ? 0.91 : 0.99;
  const count = roundBob ? 8 : 10;
  const rootHeight = 0.33;
  function point(u, t, lift = 0) {
    const comb = 0.15 * Math.sin(PI * u * 2.0 + 0.5);
    const theta = lerp(edge, TAU - edge, u) + 0.6 * comb * (1 - t) ** 2;
    const ripple = Math.cos(TAU * count * u + (wavy ? 0.69 * Math.sin(5 * t) : 0));
    if (t < rootHeight) {
      const lat = 0.002 + ((1.38 - 0.002) * t) / rootHeight;
      return polar(theta, lat, 0.018 + 0.014 * ripple * Math.sin(lat) + lift);
    }
    const root = polar(theta, 1.38, 0.018);
    t = (t - rootHeight) / (1 - rootHeight);
    const side = Math.sin(theta);
    const wave = wavy ? 0.072 * t * Math.sin(8 * t + theta * 2) : 0;
    const rib = 0.014 * ripple;
    const width =
      0.044 * Math.sin(PI * t) ** 0.64 +
      (roundBob ? 0.048 * Math.sin(PI * t) - 0.068 * t ** 4 : 0.076 * t + 0.027 * Math.sin(PI * t));
    const depth = 0.057 * t - 0.097 * t ** 2;
    return [
      root[0] + side * (width + wave + rib + lift),
      root[1] -
        length * t +
        (0.049 * Math.cos(TAU * count * u) + 0.073 * Math.sin(TAU * 3 * u - 0.5)) * t ** 4 +
        0.16 * t ** 3 * (1 - side * side),
      root[2] + Math.cos(theta) * (depth + wave + rib + lift) - 0.036 * t,
    ];
  }
  patch(p, 64, 29, (u, v) => point(u, v), base, true);
  patch(p, 42, 14, (u, v) => point(u, v, -0.041), tint(base, "#24182b", 0.34));
  patch(p, 72, 2, (u, v) => point(u, 1, -0.041 * v), tint(base, "#24182b", 0.29), true);
  for (let i = 0; i < count; i++) {
    patch(
      p,
      4,
      25,
      (u, v) => {
        const t = 0.049 + 0.89 * v;
        const offset = (i + 0.21 + (wavy ? 0.15 * Math.sin(5 * t) : 0)) / count;
        return point(offset + (2 * u - 1) * 0.015 * pulse(v) ** 0.7, t, 0.004);
      },
      tint(base, highlight, 0.36 + (i % 3) * 0.07),
      true,
    );
  }
}

// A three-dimensional tapered tress with an elliptical cross-section.
function tress(p, path, angle, halfWidth, depth, base, highlight, taperRoot = false) {
  function point(a, t, lift = 0) {
    const [x, y, z] = path(t);
    const theta = typeof angle === "function" ? angle(t) : angle;
    const root = taperRoot ? 0.04 + 0.96 * Math.min(1, t / 0.19) ** 0.68 : 1;
    const width = root * (0.68 + 0.32 * Math.sin(PI * t)) * (1 - 0.98 * t ** 2.5);
    const lateral = Math.cos(a) * halfWidth * width,
      radial = (depth * width + lift) * Math.sin(a);
    return [
      x + Math.cos(theta) * lateral + Math.sin(theta) * radial,
      y,
      z - Math.sin(theta) * lateral + Math.cos(theta) * radial,
    ];
  }
  patch(p, 12, 19, (u, v) => point(TAU * u, v), base);
  patch(p, 3, 12, (u, v) => point(1.37 + (2 * u - 1) * 0.23 * pulse(v), 0.1 + 0.71 * v, 0.004), highlight);
}

// The side part opens toward the nape as it falls. Broad curved ridges gather
// into individual tips, with shorter pieces next to the cheeks and the longest
// layers behind the shoulders.
function longWaves(p, base, highlight) {
  const lobes = 9;
  function sheet(u, t, lift = 0) {
    const angle = lerp(0.96, TAU - 0.96, u);
    const fan = Math.sin(2 * PI * u);
    const ridgePhase = TAU * lobes * u + 0.69 * Math.sin(3 * TAU * u);
    if (t <= 0.32) {
      const lat = lerp(0.004, 1.39, t / 0.32);
      return polar(angle, lat, 0.019 + 0.013 * Math.cos(ridgePhase) * Math.sin(lat) + lift);
    }
    const v = (t - 0.32) / 0.68;
    const root = polar(angle, 1.39, 0.019);
    const comb = Math.sin(2.3 * PI * v - 0.58 + 0.55 * Math.sin(angle * 2));
    const spread = 0.078 * Math.sin(PI * v) + 0.12 * v ** 1.32 * comb - 0.032 * v ** 3;
    const ridge = (0.013 + 0.005 * v) * Math.cos(ridgePhase + 1.28 * v * comb);
    const toNape = (0.52 * Math.cos(PI * u) + 0.1 * fan * comb) * v ** 1.28;
    const theta = angle + toNape;
    const length = 1.52 - 0.3 * Math.abs(Math.cos(PI * u)) ** 6;
    const end = (0.038 + 0.014 * Math.cos(TAU * 3 * u)) * Math.cos(ridgePhase) + 0.047 * Math.sin(PI * 5 * u);
    return [
      ((0.599 + 0.019 + ridge + lift) * Math.sin(1.39) + spread) * Math.sin(theta),
      root[1] - length * v - end * v ** 4,
      ((0.591 + 0.019 + ridge + lift) * Math.sin(1.39) + 0.7 * spread) * Math.cos(theta) - 0.045 - 0.066 * v,
    ];
  }
  patch(p, 86, 42, (u, v) => sheet(u, v), base, true);
  const shaded = tint(base, "#24182b", 0.33);
  patch(p, 72, 27, (u, v) => sheet(u, v, -0.029), shaded);
  patch(p, 86, 2, (u, v) => sheet(u, 1, -0.029 * v), shaded, true);
  for (const edge of [0, 1]) patch(p, 2, 29, (u, v) => sheet(edge, v, -0.029 * u), shaded, edge === 0);
  for (let i = 0; i < lobes; i++) {
    const start = 0.06 + 0.043 * (i % 3);
    patch(
      p,
      4,
      34,
      (u, v) => {
        const t = lerp(start, 0.925 - 0.021 * (i % 2), v);
        const bend = Math.max(0, (t - 0.32) / 0.68);
        const s = (i + 0.53 - 0.26 * bend * Math.sin(2.3 * PI * bend + i * 0.71)) / lobes;
        const glint = 0.01 * pulse(v) ** 0.65 * (1 + 0.29 * Math.sin(9.2 * v + 0.6 * i));
        return sheet(s + (2 * u - 1) * glint, t, 0.003);
      },
      tint(base, highlight, 0.31 + (i % 3) * 0.055),
      true,
    );
  }

  // Rolling the flattened cross-section through each bend lets the highlight
  // turn away naturally in profile while retaining a tapered front silhouette.
  for (const side of [-1, 1]) {
    for (const [i, [azimuth, latitude, length, width, phase]] of [
      [0.94, 1.04, 1.16, 0.095, -0.65],
      [1.15, 1.12, 1.47, 0.132, 0.47],
      [1.48, 1.15, 1.56, 0.133, 1.35],
    ].entries()) {
      const theta = side * azimuth;
      const root = polar(theta, latitude, 0.022);
      const wave = (t) => 2.18 * PI * t + phase + 0.2 * side;
      const path = (t) => {
        const curve = Math.sin(wave(t)) * t ** 0.77;
        return [
          root[0] + side * (0.11 * pulse(t) + 0.075 * t + (0.093 + 0.014 * i) * curve),
          root[1] - length * t + 0.026 * curve,
          root[2] + 0.068 * pulse(t) - (0.014 + i * 0.061) * t + 0.062 * t * Math.cos(wave(t)),
        ];
      };
      tress(
        p,
        path,
        (t) => theta + side * 0.62 * Math.sin(wave(t)),
        width,
        0.058,
        tint(base, highlight, 0.05 + i * 0.04),
        tint(base, highlight, 0.54 - i * 0.04),
        true,
      );
    }
  }
}

function sideLocks(p, a, base, highlight) {
  const style = a.hairStyle;
  let length = 0.64;
  if (["long_waves", "long_straight", "half_up", "twin_ringlets", "side_braid", "wolf_shag"].includes(style))
    length = 1.45;
  if (["french_bob", "bob", "sleek_bob", "shoulder_lob"].includes(style))
    length = style === "shoulder_lob" ? 1.29 : 0.88;
  if (["pixie", "swept", "side_sweep", "quiff", "mohawk"].includes(style)) length = 0.48;
  const waves = ["long_waves", "wolf_shag", "twin_ringlets", "bob", "half_up"].includes(style);
  for (const s of [-1, 1]) {
    for (let strand = 0; strand < 2; strand++) {
      const theta = s * (0.89 + strand * 0.255);
      const l = length * (strand === 0 ? 0.89 : 1);
      const root = polar(theta, 1.045 + 0.075 * strand, 0.027);
      const path = (t) => {
        const x = s * (0.084 * Math.sin(PI * t) + 0.041 * t + (waves ? 0.048 * t * Math.sin(7 * t + strand) : 0));
        return [root[0] + x, root[1] - l * t, root[2] - 0.054 * t + 0.019 * Math.sin(PI * t * 2 + strand * 0.6)];
      };
      tress(
        p,
        path,
        theta,
        0.112 + (waves ? 0.015 : 0),
        0.061,
        tint(base, highlight, 0.04 + strand * 0.08),
        tint(base, highlight, 0.6),
        true,
      );
    }
  }
}

function ponytail(p, a, base, highlight, side = 0, low = false) {
  const root = side ? [side * 0.5, 0.32, -0.23] : [0, low ? -0.17 : 0.475, -0.485];
  const angle = side ? side * 1.8 : PI;
  const length = side ? 1.45 : low ? 1.16 : 1.56;
  p.ellipsoid(root, [0.148, 0.13, 0.142], a.outfitAccent || highlight);
  for (let i = -1; i <= 1; i++) {
    const curve = (t) => {
      const spread = Math.sin(PI * t);
      return [
        root[0] +
          (side ? side * (0.25 * spread + 0.07 * t) : 0.205 * Math.sin(4.9 * t) * t) +
          i * (0.066 + 0.041 * spread),
        root[1] - t * length + 0.19 * spread,
        root[2] - 0.29 * Math.sin(t * PI * 0.74) - 0.11 * t + 0.049 * Math.cos(i * 2),
      ];
    };
    tress(
      p,
      curve,
      angle + 0.23 * i,
      0.135,
      0.098,
      tint(base, highlight, (i + 1) * 0.052),
      tint(base, highlight, 0.5),
    );
  }
}

function braid(p, side, base, highlight, accent) {
  const y0 = -0.08;
  for (let i = 0; i < 7; i++) {
    const x = side * (0.499 + 0.048 * Math.sin(i * 0.65)),
      y = y0 - i * 0.133,
      radius = 0.128 - 0.009 * i;
    for (const s of [-1, 1]) {
      p.ellipsoid(
        [x + 0.033 * s, y + 0.031 * s, -0.075 + 0.047 * i],
        [radius * 0.65, radius * 1.24, radius * 0.75],
        tint(base, highlight, 0.075 * (s + 1)),
        { rotation: [0, 0, s * 0.51] },
      );
    }
  }
  p.ellipsoid([side * 0.463, -0.965, 0.225], [0.072, 0.035, 0.072], accent);
  tress(
    p,
    (t) => [side * (0.463 + 0.052 * t), -0.98 - 0.2 * t, 0.225 + 0.02 * t],
    side,
    0.078,
    0.051,
    base,
    highlight,
  );
}

export function drawHair(p, a) {
  const style = a.hairStyle || "long_waves",
    base = a.hairColor || "#483248",
    highlight = a.hairHighlight || tint(base, "#ffdde3", 0.38);
  if (style === "none") return;
  const afro = ["afro", "curly_halo"].includes(style),
    hawk = style === "mohawk";
  const lengths = {
    long_waves: 1.66,
    long_straight: 1.64,
    half_up: 1.58,
    wolf_shag: 1.24,
    shoulder_lob: 1.2,
    bob: 0.88,
    french_bob: 0.77,
    sleek_bob: 0.83,
    side_braid: 0.78,
    twin_ringlets: 1.36,
  };
  const capColor = tint(base, "#211527", 0.12);
  const halfCap = lengths[style] ? 1.08 : PI;
  patch(
    p,
    lengths[style] ? 28 : 64,
    25,
    (u, v) => {
      const theta = (2 * u - 1) * halfCap;
      const limit = capLimit(theta);
      const lat = 0.001 + (limit - 0.001) * v;
      return polar(theta, lat, hawk ? -0.012 : 0.012);
    },
    capColor,
    true,
  );
  if (style === "taper_crop" || style === "side_part") {
    const parted = style === "side_part";
    // Short, close-combed temple sections hold the silhouette around the ears.
    for (let i = 0; i < 16; i++) {
      const theta = lerp(1.04, TAU - 1.04, i / 15);
      scalpLock(p, theta - 0.28, 0.28, capLimit(theta) + 0.055, 0.25, base, tint(base, highlight, 0.29), i % 4);
    }
    // A high side part has one continuous sweep. The crop breaks the hairline
    // into alternating locks and leaves a little more volume above the crown.
    for (let i = 0; i < 10; i++) {
      const tip = lerp(-1.3, 1.3, i / 9);
      const start = parted ? (tip < -0.72 ? -1.09 : -0.77 + 0.13 * tip) : 0.47 * tip - 0.32;
      const length = (parted ? 1.1 : 1.16) + 0.22 * Math.abs(tip) + (parted ? 0 : 0.14 * Math.sin(i * 3.7));
      scalpLock(p, start, tip - start, length + (a.fringe ? 0.13 : 0), parted ? 0.39 : 0.34,
        tint(base, highlight, 0.055 * (i % 3)), tint(base, highlight, 0.62), i, parted ? 0.052 : 0.095);
    }
    return;
  }
  if (afro) {
    const fullness = style === "afro" ? 1.13 : 0.94;
    for (let ring = 0; ring < 4; ring++) {
      const num = [5, 10, 15, 18][ring];
      for (let i = 0; i < num; i++) {
        const th = (TAU * (i + (ring % 2) * 0.5)) / num,
          lat = 0.2 + ((capLimit(th) - 0.19) * ring) / 3;
        const [x, y, z] = polar(th, lat, 0.045 * fullness);
        const r = (0.132 + 0.015 * Math.sin(14 * th + ring)) * fullness;
        p.ellipsoid([x, y + 0.031, z], [r * 1.19, r, r * 1.07], tint(base, highlight, 0.08 * ((i + ring) % 3)));
      }
    }
    return;
  }
  if (hawk) {
    for (let i = 0; i < 7; i++) {
      const lat = 1.0 - i * 0.28;
      const start = polar(0, lat, 0.003);
      p.tube(
        [start, [0, start[1] + 0.082, start[2] - 0.03], [0, start[1] + 0.22, start[2] - 0.14]],
        [[0.114, 0.086], [0.09, 0.077], 0.003],
        tint(base, highlight, 0.08 * (i % 3)),
      );
    }
    return;
  }
  if (style === "long_waves") longWaves(p, base, highlight);
  else if (lengths[style]) backPanel(p, style, lengths[style], base, highlight);
  // Combed sections continue around the crown in the rear view.
  for (let i = 0; !lengths[style] && i < 10; i++) {
    const th = lerp(1.25, TAU - 1.25, i / 9),
      lat = capLimit(th);
    scalpLock(
      p,
      th - 0.19,
      0.19,
      lat + 0.08,
      0.31,
      tint(base, highlight, 0.04 + (i % 3) * 0.04),
      tint(base, highlight, 0.44),
      i,
    );
  }
  fringe(p, a, base, highlight);
  if (style !== "long_waves") sideLocks(p, a, base, highlight);
  if (style === "ponytail" || style === "low_ponytail" || style === "half_up")
    ponytail(p, a, base, highlight, 0, style === "low_ponytail");
  if (style === "pigtails" || style === "twin_ringlets") {
    for (const s of [-1, 1]) ponytail(p, a, base, highlight, s);
  }
  if (style === "braids" || style === "side_braid") {
    for (const s of style === "braids" ? [-1, 1] : [1]) braid(p, s, base, highlight, a.outfitAccent || highlight);
  }
  if (["updo", "updo_bun", "space_buns"].includes(style)) {
    for (const s of style === "space_buns" ? [-1, 1] : [0]) {
      const x = s * 0.49,
        y = s ? 0.58 : 0.7,
        z = s ? -0.224 : -0.29;
      p.ellipsoid([x, y, z], [0.214, 0.206, 0.218], base);
      for (let k = 0; k < 3; k++) {
        stroke(
          p,
          22,
          (t) => {
            const ang = t * PI,
              plane = (k - 1) * 0.57 + 0.25;
            return [
              x + 0.21 * Math.cos(ang) * Math.cos(plane),
              y + 0.203 * Math.sin(ang),
              z + 0.218 * Math.cos(ang) * Math.sin(plane),
            ];
          },
          (t) => 0.003 + 0.009 * pulse(t),
          tint(base, highlight, 0.41),
        );
      }
    }
  }
}

export function drawHeadwear(p, a) {
  const style = a.headwear,
    color = a.headwearColor || "#c75f87";
  if (!style || style === "none") return;
  const light = tint(color, "#fff2de", 0.4),
    dark = tint(color, "#311f37", 0.27);
  if (["headband", "headphones", "cat_ears", "tiara"].includes(style)) {
    stroke(
      p,
      32,
      (t) => {
        const ang = (t - 0.5) * PI * 1.065;
        return [0.604 * Math.sin(ang), 0.786 * Math.cos(ang) + 0.01, 0.015 + 0.12 * Math.cos(ang)];
      },
      style === "tiara" ? 0.017 : 0.036,
      color,
    );
    for (const s of [-1, 1]) {
      if (style === "headphones") {
        p.ellipsoid([s * 0.582, -0.017, 0.005], [0.093, 0.181, 0.144], dark);
        p.ellipsoid([s * 0.643, -0.017, 0.009], [0.054, 0.147, 0.117], color);
      }
      if (style === "cat_ears") {
        const ear = [
          [s * 0.245, 0.67, -0.069],
          [s * 0.581, 0.463, -0.061],
          [s * 0.514, 0.995, -0.076],
          [s * 0.42, 0.649, 0.131],
        ];
        p.mesh(
          ear,
          [
            [0, 1, 2],
            [0, 2, 3],
            [1, 3, 2],
            [0, 3, 1],
          ],
          color,
        );
        p.mesh(
          [
            [s * 0.32, 0.68, 0.016],
            [s * 0.545, 0.552, 0.003],
            [s * 0.496, 0.926, -0.041],
          ],
          [[0, 1, 2]],
          tint(color, "#fad0db", 0.6),
        );
      }
    }
    if (style === "tiara") {
      for (let i = -2; i <= 2; i++) {
        const h = 0.122 - 0.027 * Math.abs(i),
          x = i * 0.111,
          y = 0.632 - 0.034 * Math.abs(i),
          z = 0.329 - 0.024 * Math.abs(i);
        p.tube(
          [
            [x - 0.083, y - 0.014, z],
            [x, y + h, z],
            [x + 0.083, y - 0.014, z],
          ],
          [0.012, 0.016, 0.012],
          light,
        );
        p.ellipsoid([x, y + h, z], [0.023, 0.031, 0.021], i ? light : "#dca0ae");
      }
    }
  } else if (style === "bow" || style === "flower") {
    if (style === "bow") {
      for (const s of [-1, 1]) {
        p.ellipsoid([0.369 + s * 0.106, 0.584 + s * 0.034, 0.311], [0.133, 0.08, 0.044], color, {
          rotation: [0, 0, s * 0.37],
        });
        p.tube(
          [
            [0.369, 0.584, 0.297],
            [0.369 + s * 0.058, 0.469, 0.321],
            [0.369 + s * 0.115, 0.391, 0.313],
          ],
          [
            [0.04, 0.018],
            [0.051, 0.018],
            [0.035, 0.012],
          ],
          dark,
        );
      }
      p.ellipsoid([0.369, 0.584, 0.353], [0.053, 0.059, 0.032], light);
    } else {
      for (let i = 0; i < 6; i++) {
        const ang = (TAU * i) / 6;
        p.ellipsoid(
          [0.467 + 0.066 * Math.cos(ang), 0.428 + 0.066 * Math.sin(ang), 0.261],
          [0.067, 0.054, 0.039],
          i % 2 ? color : light,
        );
      }
      p.ellipsoid([0.467, 0.428, 0.295], [0.041, 0.04, 0.029], "#f5d891");
    }
  } else if (style === "headscarf") {
    patch(
      p,
      50,
      18,
      (u, v) => {
        const theta = (u - 0.5) * TAU;
        return polar(theta, 0.002 + v * (1.09 + 1.43 * (1 - Math.cos(theta)) * 0.5), 0.076);
      },
      color,
      true,
    );
    tress(p, (t) => [0.22 + 0.08 * t, -0.26 - 0.78 * t, -0.448 - 0.05 * t], 2.6, 0.18, 0.066, color, light);
  } else if (style === "beret") {
    // The band wraps the crown at a fixed radius. Its lower edge follows the
    // tilt of the felt, keeping hair below the rim from every camera angle.
    const ring = (u, w, d, y, shift = 0) => {
      const theta = (u - 0.5) * TAU,
        x = w * Math.sin(theta) + shift;
      return [x, y + x * 0.105, -0.045 + d * Math.cos(theta)];
    };
    patch(
      p,
      48,
      2,
      (u, v) => ring(u, lerp(0.475, 0.605, v), lerp(0.485, 0.62, v), lerp(0.447, 0.432, v)),
      dark,
      true,
    );
    patch(p, 48, 4, (u, v) => ring(u, lerp(0.605, 0.574, v), lerp(0.62, 0.583, v), lerp(0.432, 0.535, v)), dark);
    const rows = [
      [0.51, 0.574, 0.583, 0],
      [0.531, 0.635, 0.614, -0.023],
      [0.581, 0.684, 0.628, -0.052],
      [0.662, 0.666, 0.617, -0.069],
      [0.76, 0.6, 0.552, -0.076],
      [0.846, 0.461, 0.448, -0.073],
      [0.903, 0.292, 0.315, -0.07],
      [0.925, 0.135, 0.157, -0.072],
      [0.928, 0, 0, -0.075],
    ];
    patch(
      p,
      48,
      rows.length - 1,
      (u, v) => {
        const [y, w, d, offset] = rows[Math.round(v * (rows.length - 1))];
        return ring(u, w, d, y, offset);
      },
      color,
    );
    p.ellipsoid([-0.078, 0.937, -0.044], [0.027, 0.031, 0.028], dark);
  } else {
    const chef = style === "chef",
      brim = style === "fedora",
      cap = style === "cap";
    p.ellipsoid([0, chef ? 0.8 : 0.59, -0.042], [chef ? 0.62 : 0.555, chef ? 0.34 : 0.29, 0.539], color);
    p.ellipsoid([0, 0.526, -0.027], [0.564, 0.095, 0.528], dark);
    if (cap || brim)
      p.ellipsoid([0, 0.493, cap ? 0.335 : -0.025], [brim ? 0.692 : 0.47, 0.043, brim ? 0.636 : 0.366], color, {
        rotation: [0.042, 0, 0],
      });
    if (style === "beanie") p.ellipsoid([0, 0.881, -0.065], [0.08, 0.077, 0.08], light);
    if (chef) for (const s of [-1, 0, 1]) p.ellipsoid([s * 0.28, 0.949, -0.061], [0.28, 0.233, 0.37], color);
  }
}
