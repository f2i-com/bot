// Distance runs down from the base of the neck in torso units. Azimuth zero
// points forward. Skin, fabric, seams and accessories all sample these sections.
const TAU = 2 * Math.PI;
const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
const bell = (x) => Math.exp(-x * x);
const blend = (a, b, t) => a + (b - a) * t;

function profileSampler(stations) {
  // A monotone Hermite curve preserves the waist and shoulder silhouettes without
  // introducing extra bulges between closely spaced collarbone sections.
  const slope = (i, k) => {
    const a = stations[i],
      b = stations[i + 1];
    return (b[k] - a[k]) / (b[0] - a[0]);
  };
  const tangents = stations.map((_, i) =>
    [1, 2, 3].map((k) => {
      if (i === 0) return slope(0, k);
      if (i === stations.length - 1) return slope(i - 1, k);
      const before = slope(i - 1, k),
        after = slope(i, k);
      return before * after > 0 ? (2 * before * after) / (before + after) : 0;
    }),
  );
  return (distance) => {
    let j = 1;
    while (j < stations.length - 1 && distance > stations[j][0]) j++;
    const a = stations[j - 1],
      b = stations[j],
      span = b[0] - a[0],
      t = clamp((distance - a[0]) / span, 0, 1);
    const t2 = t * t,
      t3 = t2 * t;
    return [1, 2, 3].map(
      (k) =>
        (2 * t3 - 3 * t2 + 1) * a[k] +
        (t3 - 2 * t2 + t) * span * tangents[j - 1][k - 1] +
        (-2 * t3 + 3 * t2) * b[k] +
        (t3 - t2) * span * tangents[j][k - 1],
    );
  };
}

function hasPectorals(design) {
  return design.chestShape ? design.chestShape === "pectoral" : design.genderStyle === "masculine";
}

export function ribWidth(design) {
  return (
    0.86 * (0.61 + 0.39 * design.chestWidth) +
    0.09 * (design.shoulderWidth - 1) +
    0.065 * ((design.depth ?? 1) - 1) +
    0.13 * (design.ribWidth ?? 0) +
    (hasPectorals(design) ? 0.045 : 0)
  );
}

// The abdomen and upper pelvis span the top/bottom split. Apply the same
// displacement to skin, shell, skirt panels, waistbands and trouser yokes.
function makeFlankContour(design, shoulder, length) {
  const definition = design.waistDefinition ?? 0;
  const hip = design.hipCurve ?? 0;
  const belly = design.bellyFullness ?? 0;
  if (!definition && !hip && !belly) return (point) => point;
  function mound(d, high, peak, low) {
    const t = clamp(d < peak ? (d - high) / (peak - high) : (low - d) / (low - peak), 0, 1);
    return t * t * (3 - 2 * t);
  }
  return (point, lateral, forward) => {
    const d = (shoulder - point[1]) / length;
    if (d <= 0.96 || d >= 2.58) return point;
    const tuck = 0.082 * definition * mound(d, 1.08, 1.49, 1.96);
    const flare = 0.132 * hip * mound(d, 1.54, 1.98, 2.53);
    const bellyDepth = belly * (belly > 0 ? 0.24 : 0.087) * mound(d, 0.96, 1.76, 2.58);
    return [
      point[0] + (flare - tuck) * lateral,
      point[1],
      point[2] + (0.28 * flare - 0.21 * tuck) * forward + bellyDepth * Math.max(0, forward) ** 2,
    ];
  };
}

export function makeTorso(design, bounds) {
  const { shoulder, length } = bounds;
  const y = (d) => shoulder - d * length;
  const shoulders = bounds.shoulders;
  const waist = 0.66 * design.waistWidth,
    hips = bounds.hips;
  const hipDepth = 0.45 * (design.gluteFullness ?? 1);
  const neck = 0.224 * design.neckWidth;
  const slope = 0.18 + 0.32 * design.shoulderSlope;
  const neckTop = (shoulder + 0.47 * design.headScale) / length;
  const fullness = design.depth ?? 1;
  const chest = bounds.chest;
  const ribDepth = 0.413 * fullness + 0.034 * (design.ribWidth ?? 0);
  const bust = clamp((design.chestWidth - 0.7) / 0.68, 0, 1);
  const pectoral = hasPectorals(design);
  const projection = design.bustProjection ?? 0;
  const spacing = design.bustSpacing ?? 0;
  const volume = pectoral
    ? (0.042 + 0.16 * bust) * (1 + 0.55 * projection)
    : (0.033 + 0.347 * bust) * (1 + 0.62 * projection) + 0.048 * Math.max(0, projection);
  // Painted cels use broader shading planes than the actual fitted profile.
  // Limit the relief in shading normals so a projecting bust does not produce
  // isolated circles of shadow on a continuous dress panel.
  const paintedVolume = Math.min(volume, 0.225);
  const bustCenter = (pectoral ? 0.59 + 0.06 * bust : 0.676 + 0.117 * bust) - 0.145 * (design.bustHeight ?? 0);
  const medialOffset = 0.395 + 0.12 * spacing;
  const bustAngle = Math.asin(medialOffset);
  const shapeContour = makeFlankContour(design, shoulder, length);
  const section = profileSampler([
    [neckTop, neck * 0.91, neck * 0.93, -0.041],
    [neckTop * 0.64, neck * 0.85, neck * 0.87, -0.036],
    [neckTop * 0.23, neck * 0.94, neck * 0.91, -0.023],
    [0, neck * 1.23, neck * 1.01, -0.011],
    [0.36 * slope, shoulders * 0.58, 0.29, -0.014],
    [0.8 * slope, shoulders * 0.87, 0.343, -0.024],
    [slope + 0.036, shoulders * 0.958, 0.36, -0.031],
    [0.42, blend(shoulders * 0.9, chest, 0.72), ribDepth * 0.96, -0.034],
    [0.7, chest, ribDepth * 1.08, -0.03],
    [0.92, chest * 0.994, ribDepth * 1.06, -0.02],
    [1.09, chest * 0.957, ribDepth * 0.994, -0.007],
    [1.26, blend(chest * 0.89, waist, 0.32), blend(ribDepth, 0.345, 0.32), 0.002],
    [1.43, blend(chest * 0.88, waist, 0.8), blend(ribDepth, 0.34, 0.67), 0.005],
    [1.57, waist, 0.344, 0],
    [1.6, waist * 0.992, 0.342, 0],
    [1.81, blend(waist, hips, 0.36), blend(0.35, hipDepth, 0.39), 0],
    [2.18, hips, hipDepth, 0],
    [2.59, hips * 0.9, hipDepth * 0.91, 0],
  ]);

  function ring(distance, angle, lift = 0, drape = 0, painted = false) {
    const sin = Math.sin(angle),
      cos = Math.cos(angle),
      u = Math.abs(sin);
    const [rx, rz, cz] = section(distance);
    let relief,
      lateral = (rx + lift) * sin;
    if (cos >= 0) {
      const reliefVolume = painted ? paintedVolume : volume;
      let front;
      if (pectoral) {
        // Broad planes from the sternum to the upper arm, with a short lower edge.
        const rise = distance - bustCenter + 0.1 * u * u;
        const vertical = Math.exp(-((rise / (rise < 0 ? 0.38 : 0.29)) ** 4));
        const plane = Math.exp(-(((u - medialOffset) / 0.55) ** 4));
        const sternum = 0.16 * (1 - drape) * bell(sin / (0.1 + 0.035 * spacing));
        front = reliefVolume * (plane - sternum) * vertical;
      } else {
        const medial = medialOffset + 0.045 * Math.tanh((distance - bustCenter) * 4);
        const rise = distance - bustCenter + 0.065 * u;
        const vertical = bell(rise / (rise < 0 ? 0.38 : 0.325));
        const span = 0.38 + 0.043 * spacing;
        const lobes = bell((sin - medial) / span) + bell((sin + medial) / span);
        const cleavage = bell(sin / 0.19) * bell((distance - bustCenter + 0.06) / 0.27);
        const bridge = reliefVolume * drape * 0.75 * bell(sin / 0.34) * vertical;
        front = reliefVolume * (lobes * vertical - 0.135 * cleavage) + bridge;
        lateral += 0.15 * spacing * sin * cos * cos * vertical;
      }
      const collarLine = 0.23 - 0.095 * u + 0.015 * bell((u - 0.7) / 0.16);
      const collar =
        0.026 * bell((distance - collarLine) / 0.053) * (1 - bell(u / 0.13)) * bell((u - 0.48) / 0.47);
      const hollow = 0.025 * bell(sin / 0.13) * bell((distance - 0.105) / 0.082);
      const abdomen = 0.023 * bell((distance - 1.33) / 0.22) * bell(sin / 0.56);
      relief = (front + collar - hollow + abdomen) * cos * cos;
    } else {
      // The small plane change at either scapula and shallow spinal groove make
      // a low-backed dress legible in a rear or three-quarter view.
      const blades = 0.043 * bell((u - 0.48) / 0.28) * bell((distance - 0.51) / 0.34);
      const spine = 0.022 * bell(sin / 0.13) * bell((distance - 0.72) / 0.64);
      relief = -(blades - spine) * cos * cos;
    }
    return shapeContour([lateral, y(distance), cz + (rz + lift) * cos + relief], sin, cos);
  }

  function occlusion(d, angle) {
    const c = Math.cos(angle);
    if (d < 0) {
      // The cranium occludes the upper neck. Tie the falloff to the model's
      // neck length so it follows head and shoulder proportion edits.
      const underJaw = clamp(d / neckTop, 0, 1);
      return (0.20 + 0.10 * Math.max(0, c)) * underJaw ** 1.4;
    }
    if (c <= 0) return 0;
    const u = Math.abs(Math.sin(angle));
    const valley =
      (pectoral ? 0.012 + 0.018 * bust : 0.038 + 0.115 * bust) *
      (1 + 0.2 * projection - 0.2 * spacing) *
      bell(u / (0.095 + 0.025 * bust)) *
      bell((d - bustCenter + 0.018) / 0.24);
    const clavicle = 0.033 * bell(u / 0.67) * bell((d - 0.25 + 0.09 * u) / 0.048);
    return (valley + clavicle) * c * c;
  }

  function fabricShade(d, angle, drape) {
    const forward = Math.cos(angle);
    if (forward <= 0) return 0;
    const u = Math.abs(Math.sin(angle));
    if (pectoral) {
      const lowerEdge = bustCenter + 0.27 - 0.1 * u * u;
      return volume * 0.23 * (1 - 0.7 * drape) * forward * forward *
        bell((u - medialOffset) / 0.48) * bell((d - lowerEdge) / 0.1);
    }
    const fromCenter = (u - medialOffset) / 0.45;
    const lowerArc = bustCenter + 0.16 + 0.14 * Math.max(0, 1 - fromCenter * fromCenter);
    // Smooth painted falloff under the curved fabric keeps the volume legible
    // in front view, including the softer plane across a loose shirt.
    return (
      Math.min(volume, 0.55) *
      0.38 *
      (1 - 0.69 * drape) *
      forward *
      forward *
      bell(fromCenter) *
      bell((d - lowerArc) / 0.14)
    );
  }

  return {
    y,
    shoulders,
    waist,
    hips,
    hipDepth,
    neck,
    slope,
    chest,
    neckTop,
    bustCenter,
    bustAngle,
    softenNormals: paintedVolume < volume,
    section,
    ring,
    occlusion,
    fabricShade,
    shapeContour,
  };
}

// Both patches terminate at the same angular sample on the cut edge. Thin binding
// can be rendered separately without overlapping a complete skin mesh under cloth.
export function torsoBand(
  p,
  ring,
  start,
  end,
  color,
  { shading = null, normalRing = null, rows = 28, sides = 88 } = {},
) {
  const vertices = [],
    faces = [],
    normalVertices = normalRing ? [] : vertices,
    ambient = shading ? [] : null;
  for (let j = 0; j <= rows; j++) {
    for (let i = 0; i < sides; i++) {
      const angle = i < sides / 2 ? (TAU * i) / sides : (TAU * (i - sides)) / sides;
      const d = blend(start(angle), end(angle), j / rows);
      vertices.push(ring(d, angle));
      if (normalRing) normalVertices.push(normalRing(d, angle));
      if (shading) ambient.push(shading(d, angle));
      if (j > 0) {
        const a = (j - 1) * sides + i,
          b = (j - 1) * sides + ((i + 1) % sides);
        faces.push([a, a + sides, b], [b, a + sides, b + sides]);
      }
    }
  }
  p.mesh(vertices, faces, color, normalVertices, ambient);
}
