import { mixColor } from "./geometry.js";
import { drawLowerBody } from "./lower-body.js";
import { makeTorso, ribWidth, torsoBand } from "./torso.js";
import { garmentCut, drawGarmentDetails } from "./garments.js";

// Measurements are relative to the head. The same joints fit the skin, sleeves,
// trousers and shoes so changes in length cannot leave gaps between garments.
export function measurements(a) {
  const shoulder = -0.57 * a.headScale - 0.39 * a.neckLength;
  const length = a.torsoLength * a.bodyScale;
  const hip = shoulder - 2.59 * length;
  const leg = (a.legLength ?? 1) * a.bodyScale;
  const shoulders = 0.96 * a.shoulderWidth,
    hips = 0.84 * a.hipWidth;
  const posed = a.posture === "confident" || a.posture === "presenter";
  const reach = (a.armLength ?? 1) * a.bodyScale;
  const armRoot = shoulder - (0.18 + 0.32 * a.shoulderSlope) * length;
  const arm = {
    posed,
    reach,
    root: armRoot,
    elbow: [shoulders + 0.16, armRoot - 1.28 * reach, 0.042],
    wrist: [shoulders + (posed ? -0.36 : 0.2), armRoot - (posed ? 2.14 : 2.58) * reach, 0.17 + (posed ? 0.3 : 0)],
  };
  return { shoulder, shoulders, length, hip, hips, leg, arm, chest: ribWidth(a), floor: hip - 3.58 * leg };
}

function panel(p, points, color) {
  const faces = [];
  for (let i = 1; i + 1 < points.length; i++) faces.push([0, i, i + 1]);
  p.mesh(points, faces, color);
}

function bow(p, x, y, z, size, color) {
  for (const side of [-1, 1]) {
    const points = [
      [0, 0, 0],
      [0.93, 0.36, -0.06],
      [1, 0.02, -0.1],
      [0.85, -0.36, -0.04],
      [0.2, -0.14, 0.1],
    ];
    panel(
      p,
      points.map(([dx, dy, dz]) => [x + side * dx * size, y + dy * size, z + dz * size]),
      color,
    );
    panel(
      p,
      [
        [x, y, z],
        [x + side * size * 0.45, y - size * 0.9, z - 0.01],
        [x + side * size * 0.72, y - size * 0.69, z - 0.015],
      ],
      color,
    );
  }
  p.ellipsoid([x, y, z + 0.01], [size * 0.21, size * 0.2, size * 0.14], color);
}

const palmYaw = 0.88;
// The finger mesh and its rig pivots share this wrist-relative frame.
export function handPoint([x, y, z], side, size, dx, dy, dz) {
  const c = Math.cos(palmYaw), s = Math.sin(palmYaw);
  return [x + side * (dx * c - dz * s) * size, y + dy * size, z - (dx * s + dz * c) * size];
}

function hand(p, wrist, side, size, skin) {
  const point = (dx, dy, dz) => handPoint(wrist, side, size, dx, dy, dz);
  const radius = (rx, ry, rz) => [rx * size, ry * size, rz * size];
  p.ellipsoid(point(0, -0.115, 0.019), radius(0.102, 0.168, 0.079), skin, {
    rotation: [0.12, side * palmYaw, side * 0.06],
  });
  const handSide = side < 0 ? "right" : "left";
  for (const [i, length] of [0.159, 0.181, 0.167, 0.133].entries()) {
    if (i < 2) p.markPart(handSide + (i === 0 ? "Index" : "Fingers"));
    const u = -0.066 + i * 0.044;
    const path = [
      point(u, -0.194, 0.018),
      point(u * 1.05, -0.23 - length * 0.33, 0.023),
      point(u * 1.03, -0.214 - length * 0.87, 0.053),
      point(u * 0.96, -0.211 - length, 0.069),
    ];
    p.tube(
      path,
      [0.03, 0.025, 0.022, 0.012].map((v) => v * size),
      skin,
      { sides: 10 },
    );
  }
  p.markPart(handSide + "Thumb");
  p.tube(
    [
      point(-0.061, -0.072, 0.006),
      point(-0.112, -0.134, 0.046),
      point(-0.135, -0.196, 0.081),
      point(-0.123, -0.239, 0.095),
    ],
    [0.046, 0.04, 0.031, 0.013].map((v) => v * size),
    skin,
    { sides: 12 },
  );
}

function fabricPanel(p, at, bands, color, lift = 0.025) {
  const points = [],
    triangles = [];
  const steps = 12;
  function addBand(distance, left, right) {
    const row = points.length / (steps + 1);
    for (let i = 0; i <= steps; i++) {
      points.push(at(distance, left + ((right - left) * i) / steps, lift));
      const k = points.length - 1;
      if (row && i) triangles.push([k - steps - 2, k - 1, k], [k - steps - 2, k, k - steps - 1]);
    }
  }
  addBand(...bands[0]);
  for (let j = 1; j < bands.length; j++) {
    const [d0, l0, r0] = bands[j - 1],
      [d1, l1, r1] = bands[j];
    const slices = Math.max(1, Math.ceil(Math.abs(d1 - d0) / 0.075));
    for (let k = 1; k <= slices; k++) {
      const t = k / slices;
      addBand(d0 + (d1 - d0) * t, l0 + (l1 - l0) * t, r0 + (r1 - r0) * t);
    }
  }
  p.mesh(points, triangles, color);
}

function classicNeckline(style) {
  const crew = ["tee", "sweater", "sweater_dress", "apron", "oversized_tee"].includes(style);
  return (theta) => {
    const front = Math.max(0, Math.cos(theta));
    const angle = Math.abs(theta);
    const sweetheart =
      0.57 + 0.16 * Math.exp(-((angle / 0.255) ** 2)) - 0.13 * Math.exp(-(((angle - 0.56) / 0.38) ** 2));
    switch (style) {
      case "satin":
      case "cocktail":
      case "corset_top":
      case "bodycon":
        return sweetheart;
      case "wrap_dress":
        return 0.09 + 0.7 * Math.max(0, 1 - angle / 1.2) ** 1.12 + 0.11 * Math.max(0, -Math.cos(theta));
      case "peasant_blouse":
      case "sleeved":
        return 0.13 + 0.42 * front ** 3 + 0.16 * Math.max(0, -Math.cos(theta));
      case "scoop":
        return 0.08 + 0.48 * front ** 3;
      case "sweater":
        return -0.018 + 0.12 * front ** 2;
      case "camisole":
      case "bra":
        return 0.54 + 0.18 * front ** 4 - 0.1 * Math.exp(-(((angle - 0.54) / 0.27) ** 2));
      case "halter":
        return 0.51 + 0.23 * Math.max(0, 1 - angle / 0.62);
      case "overall_dress":
        return 0.1 + 0.2 * front ** 2;
      default:
        return crew ? 0.04 + 0.22 * front ** 2 : -0.018;
    }
  };
}

function drawStraps(p, top, ring, cut, color) {
  const thin = ["camisole", "bra", "satin"].includes(top);
  const width = thin ? 0.041 : 0.1;
  const halter = top === "halter";
  const vertices = [],
    faces = [];
  for (const side of [-1, 1]) {
    const offset = vertices.length;
    for (let i = 0; i <= 44; i++) {
      const t = i / 44;
      const angle = 0.54 + (Math.PI - 1.08) * t;
      const crest = halter ? 0.023 : 0.08;
      const endpoint = t < 0.5 ? cut(side * 0.54) : cut(side * (Math.PI - 0.54));
      const d = crest + (endpoint + 0.02 - crest) * Math.abs(2 * t - 1) ** 1.6;
      for (const edge of [-1, 1]) {
        vertices.push(
          ring(
            d + edge * 0.12 * width * Math.sin(angle) ** 3,
            side * (angle + edge * width * Math.cos(angle)),
            0.017,
          ),
        );
      }
      if (i) {
        const a = offset + i * 2;
        faces.push([a - 2, a, a - 1], [a - 1, a, a + 1]);
      }
    }
  }
  p.mesh(vertices, faces, color);
}

function drawOutfitDetails(p, a, at, ring) {
  const { outfitStyle: style, outfitPrimary: cloth, outfitSecondary: trim, outfitAccent: accent } = a;
  const shade = mixColor(cloth, "#30283d", 0.27);
  if (style === "apron") {
    fabricPanel(
      p,
      at,
      [
        [0.48, -0.49, 0.49],
        [0.68, -0.5, 0.5],
        [1.04, -0.57, 0.57],
        [1.57, -0.89, 0.89],
        [2.18, -0.96, 0.96],
        [2.59, -0.98, 0.98],
        [2.83, -0.98, 0.98],
      ],
      trim,
      0.14,
    );
    for (const s of [-1, 1]) {
      const strap = [
        [0.02, 0.84],
        [0.18, 0.46],
        [0.32, 0.46],
        [0.49, 0.47],
      ].map(([d, u]) => at(d, s * u, 0.14));
      p.tube(strap, 0.035, trim);
    }
    fabricPanel(
      p,
      at,
      [
        [0.77, -0.3, 0.3],
        [1.02, -0.29, 0.29],
        [1.11, -0.21, 0.21],
      ],
      mixColor(trim, cloth, 0.22),
      0.16,
    );
    fabricPanel(
      p,
      at,
      [
        [0.78, -0.3, 0.3],
        [0.82, -0.3, 0.3],
      ],
      accent,
      0.18,
    );
    const back = ring(1.54, Math.PI, 0.025);
    for (const s of [-1, 1]) {
      const tie = [
        [0, 0.02],
        [0.24, 0.1],
        [0.39, 0.025],
        [0.22, -0.03],
        [0, 0.02],
        [0.2, -0.43],
      ];
      p.tube(
        tie.map(([x, dy]) => [s * x, back[1] + dy, back[2] - 0.04]),
        0.023,
        trim,
        { sides: 8 },
      );
    }
  } else if (style === "hoodie") {
    for (const s of [-1, 1]) {
      const cord = [
        [0.15, 0.36],
        [0.29, 0.31],
        [0.48, 0.28],
        [0.64, 0.25],
        [0.82, 0.3],
      ].map(([d, u]) => at(d, s * u, 0.079));
      p.tube(cord, 0.015, trim, { sides: 8 });
      p.tube(cord.slice(-2), 0.021, accent, { sides: 8 });
    }
    fabricPanel(
      p,
      at,
      [
        [1.16, -0.41, 0.41],
        [1.37, -0.7, 0.7],
        [1.56, -0.69, 0.69],
      ],
      shade,
      0.029,
    );
  } else if (["shirt", "blouse", "polo", "polo_knit"].includes(style)) {
    const blouse = style === "blouse";
    const long = blouse || style === "shirt";
    const bands = [0.24, 0.5, 0.67, 0.81];
    if (long) bands.push(1.03, 1.34, 1.59);
    fabricPanel(
      p,
      at,
      bands.map((d) => [d, -0.038, 0.038]),
      blouse ? mixColor(cloth, accent, 0.29) : shade,
    );
    for (const d of long ? [0.46, 0.71, 0.96, 1.21, 1.46] : [0.46, 0.69]) {
      p.ellipsoid(at(d, 0, 0.05), [0.024, 0.024, 0.013], blouse ? mixColor(accent, "#9c7176", 0.32) : trim, {
        sides: 12,
        rings: 6,
      });
    }
    if (style === "shirt")
      fabricPanel(
        p,
        at,
        [
          [0.61, -0.7, -0.33],
          [0.84, -0.68, -0.34],
          [0.91, -0.5, -0.49],
        ],
        mixColor(cloth, trim, 0.2),
        0.035,
      );
  } else if (style === "tee") {
    for (const [radius, color, lift] of [
      [0.19, accent, 0.009],
      [0.088, trim, 0.014],
    ]) {
      const bands = Array.from({ length: 25 }, (_, i) => {
        const angle = (Math.PI * i) / 24;
        const width = radius * 1.14 * Math.sin(angle);
        return [0.78 - radius * Math.cos(angle), -width, width];
      });
      fabricPanel(p, at, bands, color, lift);
    }
  } else if (style === "cyber") {
    // The chest circuit on the illustration wraps around the same shell in 3D.
    const line = [];
    for (let i = 0; i <= 32; i++) {
      const u = -0.70 + i * 1.4 / 32;
      const d = 0.60 - 0.56 * Math.max(0, Math.abs(u) - 0.20);
      line.push(at(d, u, 0.027));
    }
    p.tube(line, 0.019, accent, { sides: 8 });
    const center = at(0.60, 0, 0.034);
    p.ellipsoid(center, [0.096, 0.096, 0.022], mixColor(cloth, accent, 0.44));
    p.ellipsoid([center[0], center[1], center[2] + 0.016], [0.054, 0.054, 0.014], accent);
  }
}

export function drawBody(p, a, lowerBody = drawLowerBody) {
  p.markPart("torso");
  const bounds = measurements(a);
  const { shoulder, hip, length, leg, floor } = bounds;
  const w = a.wardrobe || {};
  const style = a.outfitStyle;
  const primary = a.outfitPrimary,
    accent = a.outfitAccent,
    shirt = a.outfitSecondary;
  const skin = mixColor(a.skinColor, "#b5cde0", (a.synthFinish || 0) * 0.28),
    outer = w.outerwear || "none";
  const torso = makeTorso(a, bounds);
  const { shoulders, waist, hips, hipDepth, neck, slope, y } = torso;
  const cut = garmentCut(style);
  const layers = ["blazer", "suit_tie", "jacket", "cardigan", "vest"].includes(style);
  const bare = cut
    ? cut.sleeve === "none"
    : [
        "satin",
        "cocktail",
        "sleeved",
        "bodycon",
        "halter",
        "camisole",
        "corset_top",
        "bra",
        "wrap_dress",
        "overall_dress",
      ].includes(style);
  const dress = cut
    ? cut.dress
    : ["satin", "cocktail", "sleeved", "bodycon", "wrap_dress", "overall_dress", "sweater_dress"].includes(style);
  const collar = ["blouse", "shirt", "blazer", "suit_tie", "polo", "polo_knit", "vest", "overall_dress"].includes(
    style,
  );
  const top = layers ? shirt : primary;
  const shell = outer !== "none" ? w.outerColor : primary;
  const hasShell = layers || outer !== "none";
  const finishes = { knit: 1, satin: 2, velvet: 3, denim: 4 };
  const topFinish = finishes[w.topFabric] || 0;
  const necklineAt = cut?.neckline ?? classicNeckline(style);
  const hemAt = cut?.hem ?? (() => 1.6);
  const drape = cut?.untucked || ["hoodie", "oversized_tee", "sweater", "sweater_dress", "peasant_blouse"].includes(style)
    ? 0.98
    : bare || cut
      ? 0.22
      : 0.68;
  const clothLift = d => 0.014 + (cut?.untucked ? 0.13 * Math.min(1, Math.max(0, d - 0.56)) : 0);
  const ring = (d, t, r = 0) => torso.ring(d, t, clothLift(d) + r, drape);
  const front = (d, u, r = 0.025) => ring(d, Math.asin(Math.max(-1, Math.min(1, u))), r);
  p.finish = 0;
  const skinNormals = torso.softenNormals ? (d, t) => torso.ring(d, t, 0, 0, true) : null;
  const clothNormals = torso.softenNormals ? (d, t) => torso.ring(d, t, clothLift(d), drape, true) : null;
  torsoBand(p, torso.ring, () => torso.neckTop, necklineAt, skin, { shading: torso.occlusion, normalRing: skinNormals, rows: 31 });
  if (cut?.hem && !cut.untucked) torsoBand(p, torso.ring, hemAt, () => 1.6, skin, { shading: torso.occlusion, rows: 14 });
  p.finish = topFinish;
  torsoBand(p, ring, necklineAt, hemAt, top, { normalRing: clothNormals, shading: (d, t) => torso.fabricShade(d, t, drape) });
  // A turned edge closes the small space between cloth and skin along the opening.
  const edges = [],
    edgeFaces = [],
    rim = [];
  const count = 88;
  for (let i = 0; i < count; i++) {
    const t = i < count / 2 ? (Math.PI * 2 * i) / count : (Math.PI * 2 * (i - count)) / count;
    const d = necklineAt(t);
    edges.push(torso.ring(d, t), ring(d, t));
    rim.push(ring(d, t, 0.002));
    const v = 2 * i,
      n = 2 * ((i + 1) % count);
    edgeFaces.push([v, v + 1, n], [n, v + 1, n + 1]);
  }
  p.mesh(edges, edgeFaces, top);
  if (!cut && !collar && necklineAt(0) > 0) {
    const knit = style === "sweater";
    p.tube([...rim, rim[0]], knit ? 0.042 : 0.011,
      knit ? mixColor(top, "#dad7dd", 0.16) : mixColor(top, accent, 0.36), { sides: 8 });
  }
  if (["camisole", "bra", "satin", "halter", "overall_dress"].includes(style))
    drawStraps(p, style, torso.ring, necklineAt, top);
  drawOutfitDetails(p, a, front, ring);
  if (cut) drawGarmentDetails(p, a, { point: ring, ring, front, skinRing: torso.ring, neckline: necklineAt });

  let badgePoint = front;
  if (hasShell) {
    const bottom = outer === "trench" ? 2.59 + 0.8 / length : outer === "bolero" ? 1.02 : 2.1;
    const opening = outer === "none"
      ? d => 0.009 + 0.52 * Math.max(0, 1 - Math.max(0, d) / (style === "suit_tie" ? 1.31 : 1.08))
      : d => 0.34 + 0.39 * Math.exp(-Math.max(0, d) * 2.0);
    const shellRing = (d, t, lift = 0) => {
      const belowWaist = Math.max(0, d - 1.42);
      const ease = 0.068 + 0.106 * Math.min(1, belowWaist * 1.7) + (outer === "trench" ? 0.12 * belowWaist : 0);
      return torso.ring(d, t, ease + lift, 1.12);
    };
    const shellPoint = (d, u, lift = 0.025) => shellRing(d, Math.asin(Math.max(-1, Math.min(1, u))), lift);
    const vertices = [],
      faces = [],
      edgePoints = [];
    const bands = 44,
      sides = 64;
    p.finish = finishes[outer === "cardigan" ? "knit" : "cotton"] || 0;
    for (let j = 0; j <= bands; j++) {
      const d = -0.022 + ((bottom + 0.022) * j) / bands;
      const gap = opening(d);
      edgePoints.push([d, gap]);
      for (let i = 0; i <= sides; i++) {
        const t = gap + ((2 * Math.PI - 2 * gap) * i) / sides;
        vertices.push(shellRing(d, t));
        const k = j * (sides + 1) + i;
        if (j && i) faces.push([k - sides - 2, k - 1, k - sides - 1], [k - sides - 1, k - 1, k]);
      }
    }
    p.mesh(vertices, faces, shell);
    badgePoint = shellPoint;
    for (const side of [-1, 1]) {
      const edge = edgePoints.map(([d, t]) => shellRing(d, side * t, 0.002));
      p.tube(edge, style === "cardigan" ? 0.029 : 0.014, mixColor(shell, accent, style === "jacket" ? 0.58 : 0.17));
      if (outer !== "none") continue;
      if (style === "blazer" || style === "suit_tie") {
        const lapel = (d, width, lift) => shellPoint(d, side * (Math.sin(opening(d)) + width), lift);
        fabricPanel(
          p,
          lapel,
          [
            [0.03, 0, 0.13],
            [0.20, 0, 0.29],
            [0.31, 0, 0.16],
            [0.37, 0, 0.27],
            [0.67, 0, 0.18],
            [1.06, 0, 0.012],
          ],
          mixColor(shell, "#d6d4e7", 0.16),
        );
      } else if (style === "cardigan" && side === 1) {
        for (const d of [1.12, 1.45, 1.78]) {
          p.ellipsoid(shellPoint(d, 0.02, 0.048), [0.033, 0.034, 0.017], accent, { sides: 12, rings: 6 });
        }
      } else if (style === "jacket") {
        for (let d = 0.42; d < 2; d += 0.065) {
          const u = Math.sin(opening(d));
          p.tube([shellPoint(d, side * u, 0.029), shellPoint(d, side * (u + 0.037), 0.029)], 0.007, accent, {
            sides: 5,
          });
        }
      }
    }
  }

  for (const side of [-1, 1]) {
    // Each arm has a gentle elbow bend even in a neutral stance.
    p.markPart(side > 0 ? "leftArm" : "rightArm");
    const { reach, posed, root: armRoot, elbow } = bounds.arm;
    const wide = 0.235 * a.armThickness;
    const wrist = [side * bounds.arm.wrist[0], bounds.arm.wrist[1], bounds.arm.wrist[2]];
    const arm = [
      // Y, width, depth, Z, X (relative to the shoulder)
      [y(slope - 0.08), 0.05, 0.08, -0.01, shoulders * 0.78],
      [y(slope - 0.03), 0.38, 0.51, -0.01, shoulders * 0.83],
      [y(slope + 0.036), 0.65, 0.77, 0, shoulders * 0.89],
      [armRoot - 0.15 * reach, 0.89, 0.98, 0, shoulders * 0.95],
      [armRoot - 0.32 * reach, 1, 1.1, 0, shoulders + 0.025],
      [armRoot - 0.49 * reach, 0.97, 1.06, 0, shoulders + 0.064],
      [armRoot - 0.93 * reach, 0.79, 0.88, 0.011, shoulders + 0.13],
      [elbow[1], 0.67, 0.73, elbow[2], elbow[0]],
      [armRoot - 1.57 * reach, 0.77, 0.79, 0.075, shoulders + (posed ? 0.07 : 0.19)],
      [armRoot - 1.76 * reach, 0.75, 0.76, 0.14, shoulders + (posed ? -0.016 : 0.2)],
      [wrist[1], 0.435, 0.53, wrist[2], Math.abs(wrist[0])],
    ].map(([yy, rx, rz, z, x]) => [yy, wide * rx, wide * rz, z, x * side]);
    p.finish = 0;
    const coatSleeves = outer !== "none" && !["puffer_vest", "shawl"].includes(outer);
    const longSleeve =
      cut?.sleeve === "long" ||
      coatSleeves ||
      layers ||
      ["blouse", "shirt", "sweater", "sweater_dress", "hoodie", "peasant_blouse", "turtleneck", "cyber"].includes(
        style,
      );
    const sleeved = !bare || coatSleeves || style === "sleeved";
    if (!sleeved || !longSleeve) {
      // A separate inner arm across the sleeve head can push through when the
      // shoulder twists. The exposed forearm starts just inside the cuff.
      p.loft(sleeved ? arm.slice(5) : arm, skin, { sides: 22 });
    }
    if (sleeved) {
      const sleeve = (longSleeve ? arm : arm.slice(0, 6)).map(([yy, rx, rz, z, x], i) => {
        const puffed = ["blouse", "peasant_blouse", "hoodie", "sweater", "wrap_work_jacket"].includes(style);
        const ease = puffed && i > 1 && i < 10 ? 1.21 : 1.09;
        return [yy + 0.014, rx * ease + 0.009, rz * ease + 0.01, z, x];
      });
      const contrastSleeve = style === "tailored_waistcoat" || style === "contrast_henley";
      const sleeveColor = coatSleeves || (layers && style !== "vest") ? shell : contrastSleeve ? accent : top;
      p.finish = topFinish;
      const [yy, rx, rz, z, x] = sleeve.at(-1);
      const cuffHeight = longSleeve ? 0.13 : 0.048;
      if (longSleeve) sleeve.splice(-1, 0, [yy + 0.18, rx * 1.29, rz * 1.28, z - 0.011, x]);
      p.loft(sleeve, sleeveColor, { sides: 22 });
      if (!coatSleeves && style === "rugby_shirt") {
        const band = sleeve.slice(-2).map(([sy, sw, sd, sz, sx]) => [sy, sw + 0.006, sd + 0.006, sz, sx]);
        p.loft(band, accent, { sides: 22 });
      }
      if (!coatSleeves && style === "western_shirt") {
        for (const d of [0.042, 0.108])
          p.ellipsoid([x + side * rx * 0.75, yy + d, z + rz * 0.87],
            [0.022, 0.022, 0.014], accent, { sides: 10, rings: 5 });
      }
      if (!coatSleeves && style === "track_jacket") {
        for (const front of [-0.18, 0.24]) {
          const line=sleeve.slice(2).map(([sy,sw,sd,sz,sx])=>[sx+side*(sw+.005)*Math.sqrt(1-front*front),sy,sz+sd*front]);
          p.tube(line,.013,accent,{sides:7});
        }
      }
      const cuffTop = longSleeve ? 1.19 : 1.024;
      const cuffEnd = longSleeve ? 1.05 : 1.009;
      p.loft(
        [
          [yy + cuffHeight, rx * cuffTop, rz * cuffTop, z, x],
          [yy - 0.01, rx * cuffEnd, rz * cuffEnd, z, x],
        ],
        mixColor(sleeveColor, accent, 0.32),
        { sides: 22 },
      );
    }
    p.finish = 0;
    hand(p, wrist, side, a.handSize ?? 1, skin);
  }

  p.markPart("torso");
  const neckline = shoulder + 0.017;
  if (style === "turtleneck" || style === "hoodie" || a.neckwear === "scarf") {
    const scarf = a.neckwear === "scarf",
      radius = neck + (scarf || style === "hoodie" ? 0.14 : 0.025);
    p.loft(
      [
        [y(0.18), radius * 1.22, radius],
        [neckline + 0.01, radius * 1.15, radius * 1.08],
        [neckline + (style === "turtleneck" && !scarf ? 0.20 : 0.13), radius * 0.95, radius * 0.93],
      ],
      scarf ? a.neckwearColor : primary,
    );
    if (style === "hoodie") p.ellipsoid([0, y(0.25), -0.37], [0.58, 0.48, 0.26], primary);
  } else if (collar) {
    const collarColor = layers ? shirt : mixColor(top, accent, 0.15);
    for (const side of [-1, 1]) {
      const at = (d, u, lift) => front(d, side * u, lift);
      const bands = [
        [0, 0.52, 0.91],
        [0.065, 0.25, 0.89],
        [0.14, 0.07, 0.75],
        [0.2, 0.08, 0.64],
        [0.34, 0.42, 0.43],
      ];
      fabricPanel(p, at, bands, collarColor, 0.033);
      p.tube(
        bands.slice(1).map(([d, , u]) => at(d, u, 0.045)),
        0.009,
        mixColor(collarColor, accent, 0.65),
        { sides: 7 },
      );
    }
  }
  if (style === "suit_tie" && a.neckwear !== "bowtie") {
    const at = front;
    fabricPanel(
      p,
      at,
      [
        [0.26, -0.052, 0.052],
        [0.88, -0.115, 0.115],
        [1.14, -0.115, 0.115],
        [1.23, -0.004, 0.004],
      ],
      accent,
      0.039,
    );
    fabricPanel(
      p,
      at,
      [
        [0.175, -0.064, 0.064],
        [0.212, -0.105, 0.105],
        [0.3, -0.056, 0.056],
      ],
      mixColor(accent, "#352738", 0.13),
      0.054,
    );
  } else if (a.neckwear === "bowtie" || (style === "blouse" && a.neckwear === "none")) {
    const knot = front(0.23, 0, 0.04);
    bow(p, ...knot, 0.26, a.neckwear === "bowtie" ? a.neckwearColor : accent);
  } else if (["necklace", "pendant", "pearls", "lanyard", "choker"].includes(a.neckwear)) {
    const metal = a.neckwearColor;
    if (a.neckwear === "choker")
      p.loft(
        [
          [neckline + 0.115, neck * 1.01, neck * 0.97],
          [neckline + 0.19, neck, neck * 0.97],
        ],
        metal,
      );
    else {
      const deep = a.neckwear === "lanyard",
        chain = [];
      for (let i = 0; i <= 24; i++) {
        const t = (i * Math.PI * 2) / 24,
          front = (Math.cos(t) + 1) / 2;
        const chainY = neckline + 0.11 - front * (deep ? 0.84 : 0.38);
        const chainX = Math.sin(t) * neck * 1.42;
        const d = (shoulder - chainY) / length;
        const radius = torso.section(d)[0];
        const z = Math.cos(t) * (neck + 0.04);
        const angle = Math.asin(Math.min(0.999, Math.abs(chainX / radius)));
        const near = necklineAt(angle) > d ? torso.ring : ring;
        const overFabric = near(d, angle, 0.026)[2];
        chain.push([chainX, chainY, chainY <= neckline && Math.cos(t) > 0 ? Math.max(z, overFabric) : z]);
      }
      p.tube(chain, deep ? 0.037 : 0.015, metal);
      if (a.neckwear === "pearls")
        for (const point of chain.slice(0, -1))
          p.ellipsoid(point, [0.029, 0.029, 0.029], metal, { sides: 8, rings: 5 });
      else p.ellipsoid(chain[0], [deep ? 0.13 : 0.047, deep ? 0.18 : 0.08, 0.027], metal);
    }
  }
  if (a.nameBadge || (a.brooch && a.brooch !== "none")) {
    const backing = style === "apron" ? 0.16 : style === "cyber" ? 0.09 : 0.025;
    const at = (d, u, lift) => badgePoint(d, u, lift + backing);
    if (a.nameBadge && style !== "apron" && style !== "cyber") {
      fabricPanel(
        p,
        at,
        [
          [0.52, 0.40, 0.65],
          [0.54, 0.37, 0.68],
          [0.60, 0.37, 0.68],
          [0.62, 0.40, 0.65],
        ],
        accent,
        0.02,
      );
    }
    if (a.brooch && a.brooch !== "none") {
      const count = { heart: 12, star: 10, flower: 16, round: 16 }[a.brooch] || 16;
      const shape = Array.from({ length: count }, (_, i) => {
        const t = (Math.PI * 2 * i) / count;
        if (a.brooch === "heart")
          return at(
            0.58 - 0.006 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)),
            -0.59 + 0.09 * Math.sin(t) ** 3,
            0.03,
          );
        const r = i % 2 === 0 || a.brooch === "round" ? 0.1 : a.brooch === "star" ? 0.047 : 0.076;
        return at(0.58 - r * Math.cos(t), -0.59 + r * Math.sin(t), 0.03);
      });
      p.mesh(
        [at(0.58, -0.59, 0.063), ...shape],
        shape.map((_, i) => [0, i + 1, ((i + 1) % count) + 1]),
        a.broochColor,
      );
    }
  }

  lowerBody(p, a, {
    hip,
    leg,
    floor,
    waist,
    hips,
    hipDepth,
    y,
    shapeContour: torso.shapeContour,
    dress,
    finish: dress ? topFinish : finishes[w.bottomFabric] || 0,
  });
}
