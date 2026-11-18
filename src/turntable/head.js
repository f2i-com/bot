import { drawHair, drawHeadwear } from "./hair.js";
import { blendRgb, mixColor as tint, rgb } from "./geometry.js";
import { patch, scaleHead, stroke } from "./head-surfaces.js";

const PI = Math.PI;
const ink = "#342332";
const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
const lerp = (x, y, t) => x + (y - x) * t;
const bell = x => Math.exp(-x * x);
function smooth(lo, hi, value) {
  const t = clamp((value - lo) / (hi - lo), 0, 1);
  return t * t * (3 - 2 * t);
}

// Horizontal sections describe the cranium, cheekbones and tapered chin in head units.
function faceSurface(a) {
  const angular = a.genderStyle === "masculine" ? 1 : a.genderStyle === "neutral" ? 0.45 : 0;
  const cheek = a.cheekboneWidth ?? 1,
    jaw = (a.jawWidth ?? 0.9) * (1 + 0.105 * angular);
  const chinY = -0.695 - 0.15 * (a.chinLength ?? 0) - 0.022 * angular;
  const round = a.chinRoundness ?? 0.65;
  const rows = [
    [chinY, 0.012, 0.018, 0.14],
    [chinY + 0.044, 0.13 + 0.045 * round + 0.039 * angular, 0.135, 0.125],
    [-0.54, 0.288 * jaw, 0.298, 0.075],
    [-0.39, 0.424 * jaw, 0.414, 0.02],
    [-0.2, 0.49 * cheek, 0.479, 0.003],
    [0.02, 0.525 * cheek, 0.5, -0.024],
    [0.22, 0.535, 0.509, -0.038],
    [0.41, 0.491, 0.472, -0.052],
    [0.57, 0.389, 0.398, -0.057],
    [0.67, 0.22, 0.256, -0.064],
    [0.712, 0.012, 0.018, -0.066],
  ];
  function section(y) {
    let i = 0;
    while (i < rows.length - 2 && y > rows[i + 1][0]) i++;
    const a = rows[i],
      b = rows[i + 1],
      prev = rows[Math.max(0, i - 1)],
      next = rows[Math.min(rows.length - 1, i + 2)];
    const span = b[0] - a[0],
      t = clamp((y - a[0]) / span, 0, 1),
      t2 = t * t,
      t3 = t2 * t;
    return [1, 2, 3].map(
      (k) =>
        (2 * t3 - 3 * t2 + 1) * a[k] +
        ((t3 - 2 * t2 + t) * span * (b[k] - prev[k])) / (b[0] - prev[0]) +
        (3 * t2 - 2 * t3) * b[k] +
        ((t3 - t2) * span * (next[k] - a[k])) / (next[0] - a[0]),
    );
  }
  const noseY = -0.205 - 0.2 * ((a.noseLength ?? 1) - 1),
    noseWidth = 0.079 * (a.noseWidth ?? 1);
  function relief(x, y) {
    const width = x / noseWidth,
      tip = (y - noseY) / 0.078,
      bridge = (y - noseY - 0.07) / 0.138;
    const nose =
      (0.082 + 0.012 * angular) * Math.exp(-width * width - tip * tip) +
      0.041 * Math.exp(-1.7 * width * width - bridge * bridge);
    const mouth = (y + 0.367) / 0.077,
      chin = (y - (chinY + 0.145)) / 0.085;
    const upper = (y + 0.346) / 0.03,
      lower = (y + 0.397) / 0.027;
    const mound =
      0.024 * Math.exp(-mouth * mouth) + 0.024 * Math.exp(-upper * upper) + 0.025 * Math.exp(-lower * lower);
    return nose + mound * Math.exp(-((x / 0.136) ** 2)) + 0.059 * Math.exp(-((x / 0.177) ** 2) - chin * chin);
  }
  function at(x, y, lift = 0) {
    const [rx, rz, cz] = section(y);
    const depth = Math.sqrt(Math.max(0, 1 - (x / rx) ** 2));
    return [x, y, cz + (rz + relief(x, y)) * depth + lift];
  }
  return { chinY, noseY, noseWidth, section, relief, at };
}

function faceOval(p, f, x, y, w, h, lift, color, tilt = 0) {
  patch(
    p,
    20,
    3,
    (u, v) => {
      const angle = u * 2 * PI;
      const dx = w * Math.cos(angle) * v;
      return f.at(x + dx, y + Math.sin(angle) * h * v + dx * tilt, lift);
    },
    color,
    true,
  );
}

function drawEars(p, a, skin) {
  const size = a.earSize ?? 1;
  for (const s of [-1, 1]) {
    const cx = s * (0.494 + 0.024 * size),
      ear = a.earStyle;
    if (ear === "pointed") {
      p.tube(
        [
          [s * 0.471, -0.16, -0.014],
          [cx, 0.007, -0.023],
          [s * (0.52 + 0.16 * size), 0.12 * size, -0.11],
        ],
        [[0.06, 0.065], [0.09 * size, 0.08 * size], 0.004],
        skin,
        { sides: 14 },
      );
    } else {
      p.ellipsoid(
        [cx, -0.077, -0.044],
        [0.101 * size, 0.155 * size, 0.087 * size],
        ear === "cyber" ? "#8091a3" : skin,
        { rotation: [0, 0, -s * 0.19] },
      );
    }
    p.ellipsoid(
      [cx + s * 0.026, -0.077, 0.026 * size],
      [0.045 * size, 0.078 * size, 0.021],
      ear === "cyber" ? "#72edf3" : tint(skin, "#ab686a", 0.32),
      { rotation: [0, 0, -s * 0.18] },
    );
    if (a.earrings && a.earrings !== "none") {
      const x = cx + s * 0.03,
        y = -0.083 - 0.13 * size,
        color = a.earringColor || "#e8be7e";
      p.ellipsoid([x, y, 0.042], [0.026, 0.026, 0.024], color);
      if (a.earrings === "hoops") {
        stroke(
          p,
          22,
          (t) => [x + 0.06 * Math.sin(2 * PI * t), y - 0.071 + 0.074 * Math.cos(2 * PI * t), 0.045],
          0.01,
          color,
        );
      } else if (a.earrings === "drops" || a.earrings === "hearts") {
        stroke(p, 3, (t) => [x, y - 0.087 * t, 0.041], 0.0075, color);
        if (a.earrings === "hearts") {
          for (const d of [-1, 1])
            p.ellipsoid([x + d * 0.016, y - 0.101, 0.042], [0.025, 0.041, 0.014], color, {
              rotation: [0, 0, -d * 0.55],
            });
        } else p.ellipsoid([x, y - 0.115, 0.042], [0.029, 0.055, 0.023], color);
      }
    }
  }
}

function drawSkinDetails(p, a, f, skin) {
  for (const s of [-1, 1]) {
    if (a.freckles > 0) {
      const coords = [
        [0.31, -0.159],
        [0.345, -0.137],
        [0.273, -0.15],
        [0.24, -0.173],
        [0.38, -0.172],
        [0.16, -0.16],
        [0.101, -0.171],
        [0.303, -0.195],
        [0.361, -0.152],
        [0.227, -0.139],
      ];
      for (const [x, y] of coords.slice(0, Math.ceil(coords.length * a.freckles))) {
        faceOval(
          p,
          f,
          s * x,
          y + s * 0.003,
          0.006,
          0.0045,
          0.0065,
          tint(skin, "#6b3842", 0.26 + 0.4 * a.freckles),
        );
      }
    }
    if (a.dimples > 0 || a.ageLines > 0) {
      const strength = Math.max(a.dimples || 0, a.ageLines || 0);
      stroke(
        p,
        8,
        (t) => f.at(s * (0.172 + 0.013 * Math.sin(t * PI)), -0.374 + 0.044 * t, 0.005),
        (t) => 0.001 + 0.0035 * strength * Math.sin(t * PI),
        tint(skin, "#995d63", strength * 0.42),
      );
    }
    if (a.ageLines > 0.1) {
      stroke(
        p,
        8,
        (t) => f.at(s * (0.374 + 0.047 * t), -0.052 - 0.016 * t, 0.005),
        (t) => 0.001 + 0.003 * a.ageLines * Math.sin(t * PI),
        tint(skin, "#925f65", a.ageLines * 0.5),
      );
    }
    stroke(
      p,
      8,
      (t) => f.at(s * f.noseWidth * (0.45 + 0.31 * t), f.noseY - 0.037 + 0.005 * Math.sin(t * PI), 0.0028),
      (t) => 0.001 + 0.003 * Math.sin(t * PI),
      tint(skin, "#974f58", 0.42),
    );
  }
  // A tapered warm plane separates the bridge and tip at smaller framing sizes.
  // Sample the sculpt so this accent turns out of sight naturally in profile.
  patch(
    p,
    16,
    5,
    (along, across) => {
      const width = Math.sin(PI * along) ** 0.8;
      const x = f.noseWidth * (0.38 + 0.21 * along + (across - 0.5) * 0.39 * width);
      const y = f.noseY + 0.073 - 0.105 * along;
      return f.at(x, y, 0.0038);
    },
    tint(skin, "#ab6973", 0.23),
  );
  patch(
    p,
    10,
    3,
    (u, v) => {
      const x = f.noseWidth * (u * 0.74 - 0.13),
        y = f.noseY - 0.028 + 0.017 * u * u;
      return f.at(x, y + 0.01 * v * Math.sin(PI * u), 0.005);
    },
    tint(skin, "#ac626a", 0.43),
  );
  faceOval(p, f, -0.19 * f.noseWidth, f.noseY + 0.008, 0.014, 0.006, 0.004, tint(skin, "#fff0dc", 0.55), 0.16);
  if (a.beautyMark) faceOval(p, f, 0.305, -0.245, 0.011, 0.009, 0.005, "#69424c");
  if (a.noseStud)
    p.ellipsoid(
      f.at(-f.noseWidth * 0.7, f.noseY - 0.005, 0.007),
      [0.012, 0.011, 0.012],
      a.earringColor || "#f9e5b2",
    );
  if (a.facialHair && a.facialHair !== "none") {
    const beard = tint(a.hairColor || "#332532", skin, 0.16);
    const boxed = a.facialHair === "boxed_beard";
    if (["beard", "goatee", "boxed_beard"].includes(a.facialHair)) {
      const goatee = a.facialHair === "goatee";
      const root = rgb(beard), tips = blendRgb(root, rgb(skin), 0.58);
      patch(
        p,
        36,
        10,
        (u, v) => {
          const edge = Math.abs(2 * u - 1),
            theta = (2 * u - 1) * (goatee ? 0.65 : 1.73);
          let top = -0.47 + 0.4 * edge ** 1.55 + 0.039 * bell(edge / 0.12) - 0.045 * bell((edge - 0.19) / 0.13);
          if (goatee) top = -0.465 - 0.12 * edge;
          if (boxed) top = -0.44 + 0.32 * edge ** 1.15 + 0.035 * Math.sin(PI * edge);
          const floor = f.chinY + 0.004 + 0.012 * edge;
          const y = lerp(floor, top, v),
            [rx, rz, cz] = f.section(y);
          const lift = 0.005 + (boxed ? 0.025 : 0.022) * Math.sin(PI * v);
          const x = (rx + lift) * Math.sin(theta),
            depth = Math.cos(theta);
          return [x, y, cz + (rz + lift + 0.001 + (depth > 0 ? f.relief(x, y) : 0)) * depth];
        },
        (u, v) => blendRgb(root, tips, 0.78 * smooth(0.74, 1, v) + 0.07 * (1 + Math.cos(37 * u + 2 * v))),
      );
    }
    if (a.facialHair !== "stubble") {
      for (const s of [-1, 1]) {
        patch(
          p,
          15,
          3,
          (u, v) => {
            if (boxed || a.facialHair === "chevron") {
              const x = s * (0.001 + 0.171 * u);
              const arch = -0.326 - 0.047 * u + 0.032 * Math.sin(PI * u);
              const width = (0.024 + 0.031 * Math.sin(PI * u)) * (1 - u ** 5);
              return f.at(x, arch + width * (v - 0.2), 0.013);
            }
            const taper = (0.42 + 0.58 * Math.sin(PI * u) ** 0.6) * (1 - u ** 3);
            return f.at(
              s * (0.004 + 0.155 * u),
              -0.342 - 0.03 * u + 0.018 * Math.sin(PI * u) + 0.036 * taper * v,
              0.009 + 0.007 * taper * Math.sin(PI * v),
            );
          },
          beard,
          s < 0,
        );
      }
    }
  }
}

function drawGlasses(p, a, f) {
  const style = a.glasses,
    color = a.glassesColor || "#302938";
  if (!style || style === "none") return;
  if (style === "visor") {
    const visor = (u, v, lift = 0.078) => {
      const x = (2 * u - 1) * 0.455,
        edge = Math.abs(2 * u - 1);
      const bottom = -0.095 + 0.074 * edge ** 3,
        height = 0.209 - 0.083 * edge ** 4;
      return f.at(x, bottom + height * v, lift);
    };
    // Open the visor across the eyes. The tinted temples and floating rails
    // suggest glass without concealing heterochromia or blinking.
    for (const [lo, hi] of [
      [0, 0.12],
      [0.88, 1],
    ])
      patch(p, 8, 4, (u, v) => visor(lerp(lo, hi, u), v), color);
    for (const v of [0, 1])
      stroke(p, 42, (u) => visor(u, v), v ? 0.013 : 0.007, tint(color, "#baf3ff", v ? 0.19 : 0.52));
    for (const s of [-1, 1]) {
      const end = visor(s < 0 ? 0 : 1, 0.56);
      p.tube([end, [s * 0.506, 0.022, 0.228], [s * 0.551, 0.02, -0.052]], [0.028, 0.034, 0.023], color);
    }
    return;
  }
  const width = 0.195,
    xCenter = 0.242 * (a.eyeSpacing ?? 1);
  const lens = (s, t, r = 1) => {
    const ang = t * PI * 2,
      cos = Math.cos(ang),
      sin = Math.sin(ang);
    const round = ["round", "aviator", "heart"].includes(style);
    let dx = Math.sign(cos) * Math.abs(cos) ** (round ? 1 : 0.66),
      dy = Math.sign(sin) * Math.abs(sin) ** (round ? 1 : 0.63);
    if (style === "heart") dy -= 0.39 * Math.exp(-15 * dx * dx) * Math.max(0, dy);
    if (style === "cat_eye") dy += 0.44 * Math.max(dx, 0) ** 2;
    if (style === "aviator") dy -= 0.16 * Math.max(0, dx);
    const x = s * (xCenter + dx * width * r),
      y = 0.004 + dy * 0.134 * r;
    return f.at(x, y, 0.079);
  };
  for (const s of [-1, 1]) {
    if (style === "shades") patch(p, 32, 5, (u, v) => lens(s, u, v), tint(color, "#54708c", 0.39), s > 0);
    stroke(p, 32, (t) => lens(s, t), style === "bold" ? 0.019 : 0.011, color);
    const outside = lens(s, 0);
    p.tube([outside, [s * 0.493, 0.057, 0.239], [s * 0.546, 0.055, -0.049]], [0.012, 0.014, 0.014], color);
  }
  const inner = lens(1, 0.5);
  stroke(
    p,
    10,
    (t) => [inner[0] * (2 * t - 1), inner[1] + 0.024 * Math.sin(PI * t), inner[2] + 0.008 * Math.sin(PI * t)],
    0.01,
    color,
  );
}

// Recede at the temples and taper in front of each ear. A close cut follows
// the sculpt of the skull all the way around, including an edited head shape.
function buzzHairline(angle) {
  const side = Math.abs(angle);
  return 0.32 - 0.32 * (1 - Math.cos(angle)) + 0.075 * bell((side - 0.88) / 0.33)
    - 0.11 * bell((side - 1.42) / 0.19);
}

function skullPoint(f, angle, y, sculpt, lift = 0) {
  const [rx, rz, cz] = f.section(y);
  const x = (rx + lift) * Math.sin(angle), z = Math.cos(angle);
  return [x, y, cz + (rz + lift + (z > 0 ? f.relief(x, y) * sculpt : 0)) * z];
}

// Small tapered strokes follow the direction of growth. They sit on the same
// curved scalp as the underpainting, so the hairline stays soft in profile.
function drawBuzzGrain(p, f, hair, highlight) {
  const vertices = [], faces = [], pigments = [];
  const lowlight = blendRgb(hair, rgb("#302938"), 0.46);
  for (let row = 0; row < 28; row++) {
    const y = -0.23 + row * 0.034;
    const around = Math.round(f.section(y)[0] * 131);
    for (let col = 0; col < around; col++) {
      const jitter = Math.sin(col * 13.3 + row * 4.9);
      const angle = -PI + (col + 0.5 + 0.29 * jitter) * 2 * PI / around;
      const root = y + 0.012 * Math.cos(col * 3.1 + row * 2.7);
      const density = smooth(0.025, 0.11, root - buzzHairline(angle));
      if (!density) continue;
      const tip = Math.min(0.71, root + 0.028 + 0.009 * jitter);
      const lean = 0.035 * Math.cos(angle) + 0.025 * jitter;
      const index = vertices.length;
      vertices.push(skullPoint(f, angle - 0.012, root, 1, 0.004),
        skullPoint(f, angle + 0.012, root, 1, 0.004), skullPoint(f, angle + lean, tip, 1, 0.004));
      faces.push([index, index + 1, index + 2]);
      const strand = blendRgb(hair, jitter < 0 ? lowlight : highlight, density * (0.48 + 0.35 * Math.abs(jitter)));
      pigments.push(strand, strand, blendRgb(strand, hair, 0.48));
    }
  }
  p.mesh(vertices, faces, pigments);
}

export function drawHead(primitives, a) {
  const p = scaleHead(primitives, a),
    f = faceSurface(a);
  const skin = tint(a.skinColor || "#f1c6b0", "#b5cde0", (a.synthFinish || 0) * 0.28);
  const skinRgb = rgb(skin), blushColor = rgb("#e77986"), hair = rgb(a.hairColor || "#483248");
  const buzz = a.hairStyle === "buzz" && a.headwear !== "headscarf";
  const stubble = a.facialHair === "stubble";
  const blush = clamp(a.blushIntensity ?? 0.24, 0, 1);
  const skull = (u, v, sculpt) => {
    // Extra sections around the mouth and chin resolve their profile curves.
    const y = v < 0.48 ? lerp(f.chinY, -0.27, v / 0.48) : lerp(-0.27, 0.712, (v - 0.48) / 0.52);
    return skullPoint(f, (u - 0.5) * 2 * PI, y, sculpt);
  };
  const complexion = (u, v, [x, y]) => {
    const angle = (u - 0.5) * 2 * PI, side = Math.abs(angle);
    const front = Math.max(0, Math.cos(angle));
    const cheek = bell((Math.abs(x) - 0.32) / 0.145) * bell((y + 0.17) / 0.078);
    let color = blendRgb(skinRgb, blushColor, blush * 0.64 * cheek * front);
    if (stubble && side < 1.9) {
      const edge = side / 1.9;
      const line = -0.455 + 0.39 * edge ** 1.5 + 0.024 * bell(edge / 0.14);
      const jaw = (1 - smooth(line - 0.07, line + 0.07, y)) * (1 - smooth(1.56, 1.9, side));
      const lip = bell((y + 0.322) / 0.023) * bell(x / 0.125) * front;
      color = blendRgb(color, hair, Math.max(jaw * 0.26, lip * 0.2));
    }
    if (buzz) {
      const line = buzzHairline(angle);
      const fade = 0.058 + 0.038 * Math.sin(angle) ** 2;
      color = blendRgb(color, hair, smooth(line - 0.015, line + fade, y));
    }
    return color;
  };
  // Anime artists describe the small nose primarily in silhouette; soften
  // its shading normals while retaining its full projection from the side.
  patch(
    p,
    64,
    60,
    (u, v) => skull(u, v, 1),
    complexion,
    false,
    (u, v) => skull(u, v, 0.48),
  );
  drawEars(p, a, skin);
  drawSkinDetails(p, a, f, skin);
  if (buzz) drawBuzzGrain(p, f, hair, rgb(a.hairHighlight || "#dacbd5"));
  else if (a.headwear !== "headscarf") {
    primitives.finish = 5;
    drawHair(p, a);
    primitives.finish = 0;
  }
  drawGlasses(p, a, f);
  drawHeadwear(p, a);
  if (a.headsetMic) {
    const tip = f.at(0.222, -0.392, 0.035);
    p.tube(
      [
        [0.548, -0.066, 0.015],
        [0.566, -0.178, 0.178],
        f.at(0.397, -0.307, 0.046),
        tip,
      ],
      [0.014, 0.014, 0.012, 0.01],
      "#393240",
    );
    p.ellipsoid(tip, [0.044, 0.022, 0.023], "#352c37");
  }
}

// Horizontal span, corner lift, lower and upper lid height, then their curvature.
const eyeShapes = {
  classic: [1, 0, 1, 1, 0.84, 0.76],
  round: [0.9, -0.017, 1.3, 1.17, 0.59, 0.62],
  feline: [1.05, 0.058, 0.78, 0.87, 1.05, 0.89],
  hooded: [1.01, -0.012, 0.92, 0.64, 0.85, 0.63],
};

function drawEye(p, a, f, s, blink) {
  const masculine = a.genderStyle === "masculine",
    size = a.eyeSize ?? 1;
  const [span, cornerLift, lowerHeight, upperHeight, lowerCurve, upperCurve] =
    eyeShapes[a.eyeShape] ?? eyeShapes.classic;
  const room = f.section(0)[0] * 0.93;
  const width = Math.min(0.15 * size * span, room * 0.455);
  const center = clamp(0.217 * (a.eyeSpacing ?? 1), width * 1.055, room - width);
  const inner = center - width,
    tilt = 0.021 + (a.eyeTilt ?? 0.06) * 0.23 + cornerLift;
  const aperture = (1 - blink) * (1 + 0.55 * (a.eyeOpen ?? 0)) * (masculine ? 0.76 : 0.87);
  const iris = s === 1 && a.irisColor2 ? a.irisColor2 : a.irisColor || "#5892bd";
  const eyeInk = tint(ink, a.hairColor || ink, 0.16);
  const eyeBounds = (u) => {
    const sin = Math.max(0, Math.sin(PI * u)),
      y = -0.012 + tilt * (u - 0.5) + 0.01 * Math.sin(PI * u);
    return [
      y - 0.064 * size * aperture * lowerHeight * sin ** lowerCurve,
      y + 0.085 * size * aperture * upperHeight * sin ** upperCurve * (0.86 + 0.28 * u),
    ];
  };
  const at = (u, y, layer) => {
    const x = inner + 2 * width * u;
    return f.at(s * x, y, layer + 0.012 * Math.max(0, Math.sin(u * PI)));
  };
  const shellPoint = (u, v) => {
    const [lo, hi] = eyeBounds(u);
    return at(u, lerp(lo, hi, v), 0.0115);
  };
  if (aperture > 0.04) {
    patch(p, 22, 4, shellPoint, "#fff7f4", s < 0);
    const irisCenter = 0.492 + s * 0.14 * (a.gazeX ?? 0),
      irisLift = -0.038 * (a.gazeY ?? 0),
      irisSpan = 0.32;
    // Clip each iris band against both lids, including during a blink.
    const disc = (color, span, vertical, offset, layer, diamond = false) => {
      patch(
        p,
        22,
        4,
        (u, v) => {
          const dx = 2 * u - 1,
            pos = irisCenter + span * dx;
          const [bottom, top] = eyeBounds(pos);
          const arc = (diamond ? 1 - Math.abs(dx) : Math.sqrt(Math.max(0, 1 - dx * dx))) * vertical * size;
          const lo = clamp(offset + irisLift - arc, bottom, top),
            hi = clamp(offset + irisLift + arc, bottom, top);
          return at(pos, lerp(lo, hi, v), layer);
        },
        color,
        s < 0,
      );
    };
    disc(tint(iris, "#252239", 0.68), irisSpan, 0.121, 0.019, 0.0155);
    disc(tint(iris, "#3c3d68", 0.17), irisSpan * 0.89, 0.106, 0.02, 0.0175);
    disc(iris, irisSpan * 0.83, 0.081, 0.007, 0.0195);
    disc(tint(iris, "#fff0ae", 0.56), irisSpan * 0.75, 0.058, -0.005, 0.021);
    const irisPoint = (angle, radius, layer) => {
      const u = irisCenter + irisSpan * radius * Math.cos(angle);
      const [low, high] = eyeBounds(u);
      return at(u, clamp(0.015 + irisLift + 0.114 * size * radius * Math.sin(angle), low, high), layer);
    };
    if (a.irisPattern === "halo") {
      for (const [r, thickness, color] of [
        [0.76, 0.11, "#f6e5ab"],
        [0.52, 0.055, "#c2f5ef"],
      ]) {
        patch(
          p,
          36,
          2,
          (t, v) => irisPoint(2 * PI * t, r + v * thickness, 0.0223),
          tint(iris, color, 0.72),
          s > 0,
        );
      }
    } else if (a.irisPattern === "sunburst" || a.irisPattern === "prism") {
      const facets = a.irisPattern === "prism",
        count = facets ? 8 : 15;
      for (let i = 0; i < count; i++) {
        const theta = ((i + 0.22) * 2 * PI) / count;
        const color = tint(iris, i % 2 ? "#fbe2a4" : "#b5f5fc", i % 2 ? 0.65 : 0.46);
        patch(
          p,
          4,
          4,
          (u, v) => {
            // Each tapered mark lives on the iris and follows its eyelid clipping.
            const arc = facets ? 0.37 * (1 - v) : 0.055 * Math.sin(PI * v);
            const angle = theta + (2 * u - 1) * arc;
            return irisPoint(angle, lerp(0.33, i % 3 ? 0.87 : 0.76, v), 0.0222);
          },
          color,
          s > 0,
        );
      }
    }
    const prism = a.irisPattern === "prism";
    disc(
      tint(iris, "#24233a", 0.77),
      irisSpan * (prism ? 0.43 : 0.49),
      0.081,
      prism ? 0.018 : 0.034,
      0.0235,
      prism,
    );
    function sparkle(u, y, rx, ry, color) {
      y += irisLift;
      const [lo, hi] = eyeBounds(u);
      if (y - ry <= lo || y + ry >= hi) return;
      patch(
        p,
        14,
        2,
        (t, r) => at(u + Math.cos(2 * PI * t) * rx * r, y + Math.sin(2 * PI * t) * ry * r, 0.027),
        color,
        s > 0,
      );
    }
    sparkle(irisCenter - s * 0.082, 0.031, 0.071, 0.019, "#fffdf2");
    sparkle(irisCenter + s * 0.156, -0.025, 0.038, 0.01, "#fff6e5");
    sparkle(irisCenter + s * 0.055, -0.042, 0.023, 0.005, "#fff6e5");
  }
  if (a.eyeshadow > 0) {
    const shade = tint(a.skinColor || "#f1c6b0", a.eyeshadowColor || "#a06885", a.eyeshadow * 0.58);
    patch(
      p,
      24,
      2,
      (u, v) => {
        const [, hi] = eyeBounds(u);
        return at(u, hi + 0.009 + 0.029 * Math.sin(PI * u) * v, 0.006);
      },
      shade,
      s < 0,
    );
  }
  if (a.eyeShape === "hooded") {
    patch(
      p,
      22,
      2,
      (t, v) => {
        const u = 0.16 + 0.7 * t,
          [, top] = eyeBounds(u);
        const arch = Math.sin(PI * t);
        return at(u, top + 0.012 + 0.023 * arch + 0.005 * v * arch, 0.009);
      },
      tint(a.skinColor || "#f1c6b0", eyeInk, 0.28),
      s < 0,
    );
  }
  const lashSize = a.lashStyle === "subtle" ? 0.009 : a.lashStyle === "lush" ? 0.021 : 0.016;
  patch(
    p,
    30,
    2,
    (u, v) => {
      const [, hi] = eyeBounds(u),
        thickness = (lashSize + 0.008 * (a.eyeliner || 0)) * (0.2 + Math.sin(PI * u * 0.88));
      return at(u, hi + v * thickness - 0.003, 0.032);
    },
    eyeInk,
    s < 0,
  );
  for (const [start, length, rise] of [
    [0.88, 0.17, 0.014],
    [0.78, 0.1, 0.028],
  ]) {
    if (a.lashStyle === "subtle" && start < 0.8) continue;
    patch(
      p,
      8,
      2,
      (u, v) => {
        const pos = start + length * u + (a.eyeliner || 0) * 0.09 * u;
        const [, top] = eyeBounds(start);
        return at(pos, top + rise * u + 0.016 * u * u + v * 0.017 * (1 - u), 0.033);
      },
      eyeInk,
      s < 0,
    );
  }
  patch(
    p,
    24,
    2,
    (u, v) => {
      const pos = 0.2 + 0.8 * u,
        [lo] = eyeBounds(pos);
      return at(pos, lo - v * (0.001 + 0.006 * Math.sin(PI * u * 0.83)), 0.026);
    },
    tint(eyeInk, a.skinColor || "#f1c6b0", 0.23),
    s > 0,
  );
  const brow = a.browColor || tint(a.hairColor || "#473344", "#67404b", 0.25);
  patch(
    p,
    24,
    3,
    (u, v) => {
      const x = 0.085 * (a.eyeSpacing ?? 1) + u * width * 1.66;
      const y =
        0.138 + 0.038 * (a.browLift ?? 0) +
        0.012 * u +
        (0.016 + 0.074 * (a.browArch ?? 0.22)) * Math.sin(PI * u * 0.94) +
        0.038 * (a.browMood ?? 0) * (0.5 - u);
      return f.at(
        s * x,
        y + (masculine ? 0.034 : 0.023) * (a.browThickness ?? 1) * (0.25 + Math.sin(PI * u) ** 0.6) * (v - 0.5),
        0.009,
      );
    },
    brow,
    s < 0,
  );
}

const channel = (x) => (Number.isFinite(x) ? clamp(x, 0, 1) : 0);

function drawMouth(p, a, f, jaw, viseme) {
  const round = channel(viseme?.lipRound),
    spread = channel(viseme?.lipSpread);
  const labiodental = viseme?.labiodental === true;
  const close = labiodental ? Math.min(0.68, channel(viseme?.lipClose)) : channel(viseme?.lipClose);
  const tongueTip = channel(viseme?.tongueTip);
  const tongueLift = Math.max(tongueTip, 0.75 * channel(viseme?.tongueHeight));
  // Spreading widens the corners. Rounded vowels bring the vermilion forward,
  // while a bilabial consonant can seal the lips even with a lowered jaw.
  const opened = Math.max(labiodental ? 0.12 : 0, Math.min(1, jaw + 0.09 * round) * (1 - close) ** 1.25);
  const w = 0.198 * (a.mouthWidth ?? 1) * (1 - 0.41 * round + 0.36 * spread),
    fullness = a.lipFullness ?? 1;
  const skin = a.skinColor || "#f1c6b0",
    lip = a.lipColor || "#d6687c";
  const center = (u) =>
    -0.368 +
    (0.011 + 0.035 * (a.restSmile ?? 0)) * (1 - 0.62 * round + 0.25 * spread) * Math.abs(2 * u - 1) ** 1.7;
  const bow = (u) => Math.sin(PI * u) ** (0.75 - 0.22 * round);
  const projection = (u) => bow(u) * (0.045 * round + 0.003 * close);
  // Keep the animated surface above the beard and stubble as the jaw opens.
  const plane = a.facialHair && a.facialHair !== "none" && a.facialHair !== "stubble" ? 0.029 : 0.007;
  const cavityTop = (u) => center(u) + opened * 0.060 * bow(u);
  const cavityBottom = (u) => center(u) - (0.005 * (1 - close) + 0.097 * opened) * bow(u);
  const lipTop = (u) =>
    cavityTop(u) + fullness * (0.032 + 0.012 * round - 0.003 * spread - 0.005 * Math.cos((u - 0.5) * PI * 7)) * bow(u);
  const lipBottom = (u) => cavityBottom(u) - (labiodental ? 0.029 : 0.044 + 0.012 * round) * fullness * bow(u);
  const surface = (u, v, lo, hi, depth) => {
    const x = (2 * u - 1) * w,
      y = lerp(lo(u), hi(u), v);
    return f.at(x, y, plane + projection(u) + bow(u) * depth * Math.sin(PI * v) ** 0.75);
  };
  const upper = (u, v, depth) => surface(u, v, cavityTop, lipTop, depth);
  const lower = (u, v, depth) => surface(u, v, lipBottom, cavityBottom, depth);
  // Each lip rolls out from the seam. Soften its painted normals independently
  // so the edge retains its profile while the front reads as a fine ink line.
  const upperDepth = 0.016 * fullness,
    lowerDepth = 0.02 * fullness;
  patch(
    p,
    24,
    7,
    (u, v) => upper(u, v, upperDepth),
    tint(lip, "#55263a", 0.24),
    false,
    (u, v) => upper(u, v, 0.004),
  );
  patch(
    p,
    24,
    7,
    (u, v) => lower(u, v, lowerDepth),
    tint(lip, skin, 0.07),
    false,
    (u, v) => lower(u, v, 0.004),
  );
  patch(
    p,
    24,
    3,
    (u, v) => f.at((2 * u - 1) * w, lerp(cavityBottom(u), cavityTop(u), v), plane + 0.001 + projection(u)),
    tint(lip, "#280e1b", 0.94),
  );
  if (opened > 0.16 || labiodental)
    patch(
      p,
      20,
      2,
      (t, v) => {
        const u = 0.105 + 0.79 * t;
        const depth = Math.min(0.026 + 0.01 * spread - 0.012 * round,
          (cavityTop(u) - cavityBottom(u)) * (labiodental ? 0.83 : 0.39));
        return f.at(
          (2 * u - 1) * w,
          cavityTop(u) - depth * Math.sin(PI * t) ** 0.45 * v,
          plane + 0.003 + projection(u),
        );
      },
      "#f7e9df",
      true,
    );
  if (opened > 0.16 && !labiodental) {
    patch(
      p,
      16,
      3,
      (t, v) => {
        const u = 0.17 + 0.66 * t;
        const height = opened * (0.031 + 0.043 * tongueLift) * Math.sin(PI * t);
        return f.at((2 * u - 1) * w, cavityBottom(u) + height * v, plane + 0.003 + projection(u));
      },
      tint(lip, "#cb7b8c", 0.52),
    );
  }
  stroke(
    p,
    12,
    (t) => {
      const xyz = lower(0.34 + t * 0.32, 0.46, lowerDepth);
      xyz[2] += 0.002;
      return xyz;
    },
    (t) => 0.001 + 0.0023 * Math.sin(PI * t),
    tint(lip, "#fff0e4", 0.63),
  );
}

export function drawEyes(primitives, a, blink = 0, winkLid = blink) {
  const p = scaleHead(primitives, a),
    f = faceSurface(a);
  for (const s of [-1, 1]) drawEye(p, a, f, s, clamp(s === 1 ? winkLid : blink, 0, 1));
}

export function drawLips(primitives, a, mouthOpen, viseme) {
  drawMouth(scaleHead(primitives, a), a, faceSurface(a), channel(mouthOpen ?? viseme?.jaw), viseme);
}
