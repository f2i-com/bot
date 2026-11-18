import { mixColor } from "./geometry.js";
import { drawTailoredShoe } from "./footwear.js";

const TAU = Math.PI * 2;
const lerp = (a, b, t) => a + (b - a) * t;

// Rings run from top to bottom. Material changes share a boundary ring so the
// waistband, hosiery and hems meet without overlapping, even at grazing angles.
function rings(p, sections, color, { flip = false, capTop = false, capBottom = false, pleats = 0 } = {}) {
  const count = sections[0].length,
    faces = [],
    folded = [];
  for (let j = 1; j < sections.length; j++) {
    for (let i = 0; i < count; i++) {
      const a = (j - 1) * count + i,
        b = (j - 1) * count + ((i + 1) % count);
      const c = a + count,
        d = b + count;
      const foldPosition = ((i * pleats) / count) % 1;
      const section = pleats && foldPosition >= 0.26 && foldPosition < 0.43 ? folded : faces;
      section.push([a, c, b], [b, c, d]);
    }
  }
  const emit = (vertices, triangles, tint, reverse) => {
    if (reverse) for (const face of triangles) [face[1], face[2]] = [face[2], face[1]];
    p.mesh(vertices, triangles, tint);
  };
  const vertices = sections.flat();
  emit(vertices, faces, color, flip);
  if (folded.length) emit(vertices, folded, mixColor(color, "#55344b", 0.19), flip);
  // Caps have their own normals; sharing them with the outer rim makes dark
  // triangles across the hem of a skirt or the sidewall of a platform sole.
  for (const [enabled, row, reverse] of [
    [capTop, sections[0], flip],
    [capBottom, sections.at(-1), !flip],
  ]) {
    if (!enabled) continue;
    const center = [0, 1, 2].map((k) => row.reduce((sum, vertex) => sum + vertex[k], 0) / count);
    const cap = [];
    for (let i = 0; i < count; i++) cap.push([count, i, (i + 1) % count]);
    emit([...row, center], cap, mixColor(color, "#3c2f40", 0.12), reverse);
  }
}

function circle(steps, point) {
  return Array.from({ length: steps }, (_, i) => point((i * TAU) / steps));
}

// Each station holds height from the hip (in leg units), width, depth and
// forward offset. Subdivision rounds out the knee, calf and Achilles tendon.
export function legShape(a, hips) {
  const thigh = a.thighWidth ?? 1,
    calf = a.calfWidth ?? 1;
  const thickness = 0.87 + (0.13 * hips) / 0.84;
  const stations = [
    [-0.2, 0.35 * thigh, 0.34 * thigh, -0.01],
    [0.15, 0.362 * thigh, 0.355 * thigh, -0.013],
    [0.52, 0.337 * thigh, 0.327 * thigh, 0.001],
    [0.94, 0.28 * thigh, 0.276 * thigh, 0.025],
    [1.26, 0.233 * thigh, 0.227 * thigh, 0.036],
    [1.47, 0.185 * thigh, 0.189 * thigh, 0.041],
    [1.62, 0.176, 0.179, 0.055],
    [1.76, 0.165, 0.158, 0.041],
    [1.95, 0.179 * calf, 0.178 * calf, 0.001],
    [2.19, 0.213 * calf, 0.218 * calf, -0.045],
    [2.39, 0.221 * calf, 0.226 * calf, -0.058],
    [2.65, 0.197 * calf, 0.197 * calf, -0.062],
    [2.91, 0.15 * calf, 0.161 * calf, -0.033],
    [3.15, 0.11 * calf, 0.128 * calf, -0.014],
    [3.31, 0.106 * calf, 0.12 * calf, -0.002],
    [3.48, 0.116 * calf, 0.13 * calf, 0.01],
  ];
  return (d) => {
    let i = 0;
    while (i < stations.length - 2 && d > stations[i + 1][0]) i++;
    const prev = stations[Math.max(0, i - 1)],
      low = stations[i],
      high = stations[i + 1];
    const next = stations[Math.min(stations.length - 1, i + 2)],
      span = high[0] - low[0];
    const t = Math.max(0, Math.min(1, (d - low[0]) / span)),
      t2 = t * t,
      t3 = t2 * t;
    const values = [1, 2, 3].map(
      (k) =>
        (2 * t3 - 3 * t2 + 1) * low[k] +
        ((t3 - 2 * t2 + t) * span * (high[k] - prev[k])) / (high[0] - prev[0]) +
        (3 * t2 - 2 * t3) * high[k] +
        ((t3 - t2) * span * (next[k] - low[k])) / (next[0] - low[0]),
    );
    const rx = values[0] * thickness;
    // A narrow hip and a large thigh can otherwise put both inner leg surfaces
    // in the same space and produce a moving seam at the crotch and knees.
    return { x: Math.max(hips * (0.48 + 0.039 * d), rx + 0.01), rx, rz: values[1] * thickness, z: values[2] };
  };
}

function steps(from, to, density = 0.12) {
  const count = Math.max(1, Math.ceil((to - from) / density));
  return Array.from({ length: count + 1 }, (_, i) => lerp(from, to, i / count));
}

function legSection(shape, hip, leg, side, d, extra = 0) {
  const { x, rx, rz, z } = shape(d);
  return circle(32, (t) => [
    side * (x + (rx + extra) * Math.sin(t)),
    hip - d * leg,
    z + (rz + extra) * Math.cos(t),
  ]);
}

export function drawFootwear(p, style, w, skin, side, footX, floor, scale, shape) {
  if (style === "barefoot") {
    p.ellipsoid([side * footX, floor + 0.115 * scale, 0.082],
      [0.136, 0.115 * scale, 0.29], skin, { rotation: [0, side * 0.07, 0], sides: 24, rings: 12 });
    return;
  }
  const color=w.shoeColor || "#3f3240", trim=w.shoeTrim || mixColor(color,"#fff8f4",.4);
  const dark=w.shoeSole || mixColor(color,"#1e1525",.45);
  if(drawTailoredShoe(p,style,{shoeColor:color,shoeTrim:trim,shoeSole:dark},skin,side,footX,floor,scale,shape)) return;
  const boot = ["ankle", "heels", "knee_boots"].includes(style);
  const dressHeel = style === "strappy" || style === "heels";
  const heel = dressHeel ? 0.18 : boot ? 0.075 : 0;
  const sole = style === "sneakers" || style === "mary_janes" ? 0.064 : 0.037;
  const length = dressHeel ? 0.65 : style === "slippers" ? 0.61 : 0.59;
  const width = style === "slippers" || style === "sneakers" ? 0.19 : 0.165;
  const shoePoint = (x, y, z) => [side * (footX + x + 0.08 * z), floor + y * scale, z];
  const plan = (t, size) => {
    const z = Math.cos(t),
      wide = 1 + 0.12 * z;
    return [width * wide * Math.sin(t) * size, 0.115 + z * length * 0.5 * size];
  };
  const arch = (z) => heel * Math.max(0, Math.min(1, (0.23 - z) / 0.29));
  const footRing = (size, height) =>
    circle(36, (t) => {
      const [x, z] = plan(t, size);
      return shoePoint(x, arch(z) + height(t), z);
    });
  const outsole = footRing(1, () => sole);
  const bottom = footRing(0.98, () => 0.009);
  rings(p, [outsole, bottom], dark, { flip: side < 0, capBottom: true });
  if (style!=="slippers") p.tube([...outsole,outsole[0]],.006,mixColor(dark,trim,.43),{sides:6});
  if (heel) {
    const radius = style === "strappy" ? 0.035 : 0.074;
    p.tube(
      [shoePoint(0, 0.013, -0.124), shoePoint(0, heel + 0.02, -0.108)],
      [
        [radius, radius * 0.88],
        [radius * 1.2, radius],
      ],
      dark,
      { sides: 16 },
    );
  }
  const upper = (size, h) => footRing(size, (t) => sole + h + 0.018 * Math.cos(t));
  const open = ["strappy", "flats", "mary_janes", "slippers"].includes(style);
  if (open && !skin) {
    rings(p,[upper(.95,.025),outsole],mixColor(color,trim,.32),{flip:side<0,capTop:true});
  } else if (open) {
    const foot = shoePoint(0, sole + 0.097 + heel * 0.67, 0.074);
    p.ellipsoid(foot, [width * 0.84, (0.12 + heel * 0.3) * scale, 0.236], skin, {
      rotation: [0.17 + heel * 0.8, side * 0.07, 0],
      sides: 26,
      rings: 12,
    });
  }
  if (style !== "strappy") {
    const edge = circle(36, (t) => {
      const [, z] = plan(t, 1),
        front = (1 + Math.cos(t)) / 2;
      const openTop = open || style === "loafers";
      const height = openTop ? 0.059 + 0.075 * front ** 2 : 0.13 + 0.14 * (1 - front);
      const size = style === "slippers" ? 0.9 : 0.85;
      const [x] = plan(t, size);
      return shoePoint(x, arch(z) + sole + height, 0.014 + (z - 0.014) * size);
    });
    rings(p, [edge, upper(0.995, 0.027), outsole], color, { flip: side < 0 });
    if (boot || style === "sneakers" || style === "loafers" || style === "slippers") {
      const dome = upper(0.45, boot || style === "sneakers" ? 0.185 : 0.122);
      rings(p, [dome, edge], color, { flip: side < 0 });
      p.ellipsoid(shoePoint(0, sole + 0.12 + heel * 0.33, 0.11), [width * 0.71, 0.08 * scale, 0.2], color, {
        sides: 20,
        rings: 9,
      });
    } else {
      // A close-fitting toe cap leaves the instep visible above the quarter.
      p.ellipsoid(shoePoint(0, sole + 0.071, 0.255), [width * 0.9, 0.085 * scale, 0.152], color, {
        sides: 22,
        rings: 10,
      });
      p.tube([...edge, edge[0]], 0.009, trim, { sides: 6 });
    }
  }
  const strap = (z, thickness, tint, rise = 0.101, skew = 0) => {
    const path = steps(0, 1, 0.08).map((k) =>
      shoePoint(
        (k - 0.5) * width * 1.8,
        sole + 0.08 + arch(z) + rise * Math.sin(Math.PI * k),
        z + (k - 0.5) * skew,
      ),
    );
    p.tube(path, thickness, tint, { sides: 8 });
  };
  if (boot) {
    const height = style === "knee_boots" ? 1.59 : style === "heels" ? 0.85 : 0.64;
    const stations = Math.ceil((height - 0.15) / 0.09);
    const cross = (h) => {
      const station = shape(3.58 - h);
      return circle(32, (t) =>
        shoePoint(
          station.x - footX + (station.rx + 0.024) * Math.sin(t),
          h,
          station.z + (station.rz + 0.033) * Math.cos(t),
        ),
      );
    };
    const rows = Array.from({ length: stations + 1 }, (_, i) => cross(lerp(height, 0.15, i / stations)));
    rings(p, rows, color, { flip: side < 0, capTop: true });
    p.tube([...rows[0], rows[0][0]], 0.012, trim, { sides: 6 });
    const ankleBand = cross(0.39);
    p.tube([...ankleBand, ankleBand[0]], 0.023, dark, { sides: 7 });
    const outside = ankleBand[8];
    p.ellipsoid(outside, [0.014, 0.038 * scale, 0.04], trim, { sides: 10, rings: 6 });
    p.tube(
      rows.map((r) => r[16]),
      0.008,
      dark,
      { sides: 5 },
    );
  } else if (style === "sneakers") {
    for (const z of [0.046, 0.104, 0.162]) {
      strap(z, 0.011, trim, 0.148, 0.052);
      strap(z, 0.011, trim, 0.149, -0.052);
    }
    const heelTab=steps(-1,1,.12).map(t=>shoePoint(.095*t,.219-.047*t*t,-.126+.035*t*t));
    p.tube(heelTab,.016,trim,{sides:7});
  } else if (style === "mary_janes" || style === "loafers") {
    strap(0.092, style === "mary_janes" ? 0.027 : 0.022, style === "loafers" ? trim : color, 0.139);
    if(style==="mary_janes") {
      const buckle=[[0,.01],[.035,.01],[.035,.07],[0,.07],[0,.01]].map(([dy,dz])=>shoePoint(width*.88,.145+dy,.052+dz));
      p.tube(buckle,.009,trim,{sides:7});
    }
  } else if (style === "strappy") {
    strap(0.245, 0.022, color);
    const ankle = circle(20, (t) => shoePoint(0.117 * Math.sin(t), 0.36, 0.125 * Math.cos(t)));
    p.tube([...ankle, ankle[0]], 0.02, trim, { sides: 7 });
  } else if (style === "flats") {
    for (const s of [-1, 1])
      p.ellipsoid(shoePoint(s * 0.038, 0.178, 0.207), [0.049, 0.023, 0.026], trim, { rotation: [0, 0, s * 0.35] });
  } else if (style === "slippers") {
    p.ellipsoid(shoePoint(0, 0.233, 0.203), [0.087, 0.056, 0.078], trim, { sides: 14, rings: 8 });
  }
}

// Subdivide the panels along their length. A monotone cubic keeps the flare
// smooth at the knees without introducing extra bulges at the waistband.
function skirtRows(stations) {
  const rows = [stations[0]];
  const slope = (i, k) => (stations[i + 1][k] - stations[i][k]) / (stations[i][0] - stations[i + 1][0]);
  const tangent = (i, k) => {
    if (i === 0) return slope(0, k);
    if (i === stations.length - 1) return slope(i - 1, k);
    const before = slope(i - 1, k),
      after = slope(i, k);
    return before * after > 0 ? (2 * before * after) / (before + after) : 0;
  };
  for (let i = 0; i < stations.length - 1; i++) {
    const a = stations[i],
      b = stations[i + 1],
      length = a[0] - b[0];
    const samples = Math.max(1, Math.ceil(length / 0.15));
    for (let j = 1; j <= samples; j++) {
      const t = j / samples,
        t2 = t * t,
        t3 = t2 * t;
      const row = [lerp(a[0], b[0], t)];
      for (let k = 1; k < a.length; k++) {
        row.push(
          (2 * t3 - 3 * t2 + 1) * a[k] +
            (t3 - 2 * t2 + t) * length * tangent(i, k) +
            (3 * t2 - 2 * t3) * b[k] +
            (t3 - t2) * length * tangent(i + 1, k),
        );
      }
      rows.push(row);
    }
  }
  return rows;
}

// The midi flares gradually from the hip. The gown follows the seat and knees
// before flaring at the ankles, with a slightly longer sweep at the back.
function drawAtelierSkirt(p, style, cloth, trim, upper, lower, seatWidth, seatDepth, hip, leg, y, shapeContour) {
  const gown = style === "halter_gown", cascade=style === "one_shoulder_dress";
  const hem = gown ? 3.29 : 2.11;
  const hemY = hip - hem * leg;
  const sections = [
    [...upper, 0, 0],
    [...lower, 0.002, 0],
    [y(1.94), lerp(lower[1], seatWidth, 0.68), lerp(lower[2], seatDepth, 0.68), 0.004, 0],
    [y(2.18), seatWidth, seatDepth, 0.008, 0],
    [hip, seatWidth * (gown ? 1.015 : 1.08), seatDepth * 1.07, 0.012, 0],
    [hip - 0.82 * leg, seatWidth * (gown ? 0.97 : 1.23), seatDepth * (gown ? 1.01 : 1.33), 0.025, 0.06],
    [hip - 1.48 * leg, seatWidth * (gown ? 0.88 : 1.39), seatDepth * (gown ? 0.93 : 1.49), 0.039, 0.1],
  ];
  if (gown)
    sections.push(
      [hip - 2.18 * leg, seatWidth * 0.91, seatDepth, 0.048, 0.17],
      [hip - 2.69 * leg, seatWidth * 1.13, seatDepth * 1.43, 0.07, 0.25],
    );
  const endWidth = seatWidth * (gown ? 1.58 : 1.54);
  const endDepth = seatDepth * (gown ? 1.98 : 1.69);
  const bottom = [hemY, endWidth, endDepth, gown ? 0.095 : 0.073, gown ? 0.41 : 0.18];
  const border = [hemY + 0.038 * leg, endWidth * 0.989, endDepth * 0.989, bottom[3], bottom[4]];
  const folds = gown ? 8 : 10;
  const ringPoint = ([yy, rx, rz, depth, twist], theta, lift = 0) => {
    const fold = 1 + depth * Math.cos(folds * theta + twist);
    const sweep = gown ? (depth / bottom[3]) ** 3 * 0.078 * (1 - Math.cos(theta)) * leg : 0;
    const lateral = Math.sin(theta), forward = Math.cos(theta);
    const petal = cascade ? (depth / bottom[3])**2 * (.18+.38*lateral+.17*forward)*leg : 0;
    return shapeContour([(rx * fold + lift) * lateral, yy - sweep + petal, (rz * fold + lift) * forward], lateral, forward);
  };
  const panels = skirtRows([...sections.slice(1), border]);
  const contours = [sections[0], ...panels, bottom].map((row) => circle(96, (theta) => ringPoint(row, theta)));
  rings(p, contours.slice(0, 2), mixColor(cloth, trim, gown ? 0.1 : 0.3));
  rings(p, contours.slice(1, -1), cloth);
  rings(p, contours.slice(-2), mixColor(cloth, trim, gown ? 0.2 : 0.45), { capBottom: true });
  if(cascade) {
    const length=upper[0]-hemY;
    const wrap=panels.map(row=>{
      const t=Math.max(0,(upper[0]-row[0])/length);
      return ringPoint(row,-1.1+2.13*t**1.34,.015);
    });
    p.tube(wrap,.014,mixColor(cloth,trim,.50),{sides:8});
  } else if (!gown) {
    for (const theta of [-0.43, 0.43, Math.PI - 0.43, Math.PI + 0.43]) {
      const path = panels.map((row) => ringPoint(row, theta, 0.006));
      p.tube(path, 0.006, mixColor(cloth, "#483545", 0.26), { sides: 6 });
    }
  }
  return cascade ? hem-.76 : hem;
}

export function drawLowerBody(p, a, { hip, leg, floor, waist, hips, hipDepth, y, shapeContour, dress, finish }, { garmentOnly = false } = {}) {
  const w = a.wardrobe || {},
    bottom = w.bottom || "trousers";
  const cloth = dress ? a.outfitPrimary : w.bottomColor || mixColor(a.outfitPrimary, "#241c30", 0.42);
  const trim = dress ? a.outfitAccent : w.bottomAccent || a.outfitAccent;
  const shoe = w.shoes || "loafers",
    legwear = w.legwear || "none";
  const shape = legShape(a, hips);
  const upperThigh = shape(0.1);
  const seatWidth = Math.max(hips + 0.036, upperThigh.x + upperThigh.rx + 0.035);
  const seatDepth = Math.max(hipDepth + 0.052, upperThigh.rz + 0.075);
  const skirt = dress || /skirt|tennis/.test(bottom);
  const short = { briefs: 0.18, denim: 0.55, lounge_shorts: 0.58, biker_shorts: 1.03, court_shorts: 1.22 }[bottom];
  const bootHeight = { knee_boots: 1.59, heels: 0.85, ankle: 0.64, court_high_tops: .52 }[shoe] || 0;
  const footCutoff = 3.58 - (bootHeight || 0.145);
  const longHem = bootHeight ? footCutoff : 3.31;
  let hem = short ?? longHem;
  const waistY = y(1.57),
    bandY = y(1.7);
  const upper = [waistY, waist + 0.045, 0.385],
    lower = [bandY, waist + 0.075, 0.407];
  const fittedRows = (stations) => a.waistDefinition || a.hipCurve || a.bellyFullness ? skirtRows(stations) : stations;
  const pleats = bottom === "tennis" ? 20 : 14;
  const ellipse = ([yy, rx, rz], fold = 0) =>
    circle(pleats * 8, (t) => {
      const wave = 1 + fold * Math.cos(pleats * t);
      const lateral = Math.sin(t), forward = Math.cos(t);
      return shapeContour([rx * wave * lateral, yy, rz * wave * forward], lateral, forward);
    });
  p.finish = finish;
  const atelierSkirt = ["sweetheart_dress","halter_gown","one_shoulder_dress"].includes(a.outfitStyle);
  p.markPart("skirt");
  if (atelierSkirt) {
    hem = drawAtelierSkirt(p, a.outfitStyle, cloth, trim,
      upper, lower, seatWidth, seatDepth, hip, leg, y, shapeContour);
  } else if (skirt) {
    hem = dress
      ? a.outfitStyle === "sweater_dress"
        ? 0.73
        : 0.97
      : bottom === "midi_skirt"
        ? 2.09
        : bottom === "tennis"
          ? 0.41
          : 0.56;
    const folded = ["skirt", "midi_skirt", "tennis"].includes(bottom) && !dress;
    const rib = a.outfitStyle === "bodycon" ? 0.008 : folded ? 0.074 : 0.023;
    const width =
      a.outfitStyle === "bodycon" ? 1.07 : bottom === "tennis" ? 1.5 : bottom === "midi_skirt" ? 1.48 : 1.33;
    const thigh = shape(hem),
      rz = Math.max(hipDepth + 0.145, thigh.rz + 0.17);
    const rx = Math.max(hips * width, (thigh.x + thigh.rx + 0.055) / (1 - rib));
    const hemY = hip - hem * leg;
    const hemSection = ellipse([hemY, rx, rz], rib);
    const trimSection = ellipse([hemY + 0.045, rx - 0.004, rz - 0.004], rib);
    rings(p, [ellipse(upper), ellipse(lower)], dress ? trim : mixColor(cloth, trim, 0.26));
    const yoke = [y(1.91), lerp(lower[1], seatWidth, 0.56), lerp(lower[2], seatDepth, 0.54), 0.003];
    const fit = (row) => ellipse(row, row[3]);
    rings(p, fittedRows([[...lower, 0], yoke]).map(fit), cloth);
    rings(
      p,
      [
        ...fittedRows([
          yoke,
          [y(2.18), seatWidth, seatDepth, rib * 0.2],
          [hip, lerp(seatWidth, rx, 0.37), lerp(seatDepth, rz, 0.4), rib * 0.75],
        ]).map(fit),
        trimSection,
      ],
      cloth,
      { pleats: folded ? pleats : 0 },
    );
    rings(p, [trimSection, hemSection], mixColor(cloth, trim, 0.44), { capBottom: true });
    if (bottom === "skirt" && !dress) {
      const by = (waistY + bandY) * 0.5,
        bz = (upper[2] + lower[2]) * 0.5 + 0.011;
      const buckle = [
        [-0.065, -0.032],
        [0.065, -0.032],
        [0.065, 0.032],
        [-0.065, 0.032],
        [-0.065, -0.032],
      ];
      p.tube(
        buckle.map(([x, dy]) => shapeContour([x, by + dy, bz], x / upper[1], 1)),
        0.012,
        trim,
        { sides: 7 },
      );
    }
  }
  const tights = legwear === "sheer" ? mixColor(a.skinColor, w.legwearColor, 0.53) : a.skinColor;
  for (const side of [-1, 1]) {
    p.markPart(side > 0 ? "leftLeg" : "rightLeg");
    const section = (d, extra = 0) => legSection(shape, hip, leg, side, d, extra);
    if (!skirt) {
      const half = ([yy, rx, rz]) =>
        circle(32, (t) => {
          const lateral = side * Math.max(0, Math.sin(t)), forward = Math.cos(t);
          return shapeContour([rx * lateral, yy, rz * forward], lateral, forward);
        });
      const fit = (d) => {
        if (bottom === "court_shorts") return 0.082 + 0.066 * Math.max(0, d);
        if (bottom === "flare_jeans") return 0.028 + 0.155 * Math.max(0, (d - 1.55) / 1.85);
        if (bottom === "pleat_trousers") {
          // Pressed twill bridges the knee and calf in a straight taper.
          const thighWidth = shape(0.32).rx + 0.09;
          const ankleWidth = shape(0.32).rx * 0.55 + 0.06;
          const radius = lerp(thighWidth, ankleWidth, Math.min(1, Math.max(0, (d - 0.32) / 2.99)));
          return Math.max(0.040, radius - shape(d).rx);
        }
        if (bottom === "baggy_jeans" || bottom === "trousers")
          return 0.052 + 0.105 * Math.max(0, Math.min(1, (d - 0.6) / 1.8));
        if (bottom === "cargo_pants") return 0.071 + 0.045 * Math.sin((Math.PI * Math.max(0, d)) / 3.58);
        return bottom === "leggings" || bottom === "briefs" ? 0.009 : 0.035;
      };
      const opening = (d, lift = 0) => {
        let extra = fit(d);
        if (bootHeight && !short) extra *= Math.max(0, Math.min(1, (hem - d) / 0.31));
        return section(d, extra + lift);
      };
      const hipRing = half([hip + 0.065, seatWidth, seatDepth]);
      const firstFull = Math.min(0.32, hem * 0.55);
      const branch = opening(firstFull);
      const transition = hipRing.map((v, i) => v.map((n, k) => lerp(n, branch[i][k], 0.46)));
      const calf = steps(firstFull, hem - 0.041).map(d => opening(d));
      const last = opening(hem);
      if (bottom === "court_shorts") {
        const vents = steps(firstFull, hem - 0.046, 0.09).map(d => opening(d, 0.009));
        const vertices = vents.flatMap(row => row.slice(6, 10)), faces = [];
        for (let j = 1; j < vents.length; j++) {
          for (let k = 1; k < 4; k++) {
            const i = j * 4 + k;
            faces.push([i - 5, i - 1, i - 4], [i - 4, i - 1, i]);
          }
        }
        p.mesh(vertices, faces, trim);
        rings(p, [opening(hem - 0.075, 0.009), opening(hem - 0.039, 0.009)], trim, { flip: side < 0 });
      }
      if (bottom === "pleat_trousers") {
        rings(p, [opening(hem - 0.105, 0.015), opening(hem, 0.015)], mixColor(cloth, trim, 0.30), { flip: side < 0 });
        for (const index of [0, 1]) {
          const crease = steps(firstFull, hem - 0.108, 0.10).map(d => {
            const [x, yy, z] = opening(d)[index];
            return [x, yy, z + 0.009];
          });
          p.tube(crease, index ? 0.006 : 0.009, mixColor(cloth, trim, index ? 0.16 : 0.40), { sides: 6 });
        }
      }
      p.finish = finish;
      rings(p, [half(upper), half(lower)], mixColor(cloth, trim, 0.22), { flip: side < 0 });
      rings(
        p,
        [
          ...fittedRows([
            lower,
            [y(1.94), lerp(lower[1], seatWidth, 0.51), lerp(lower[2], seatDepth, 0.52)],
            [y(2.18), seatWidth, seatDepth],
            [hip + 0.065, seatWidth, seatDepth],
          ]).map(half),
          transition,
          ...calf,
        ],
        cloth,
        { flip: side < 0 },
      );
      rings(
        p,
        [calf.at(-1), last],
        mixColor(cloth, trim, bottom === "denim" || bottom === "baggy_jeans" ? 0.37 : 0.1),
        { flip: side < 0, capBottom: true },
      );
    }
    if (garmentOnly) continue;
    p.finish = 0;
    const from = Math.max(-0.2, hem - 0.016),
      to = footCutoff + 0.019;
    if (from < to) {
      const sockFrom = { stockings: 0.91, knee_socks: 1.8, leg_warmers: 2.54, ankle_socks: 2.99 }[legwear] ?? to;
      const sock = w.legwearColor || "#ece9ec";
      const bareTo = Math.min(to, Math.max(from, sockFrom));
      if (bareTo > from)
        rings(
          p,
          steps(from, bareTo).map((d) => section(d)),
          tights,
          { flip: side < 0 },
        );
      if (bareTo < to) {
        const sockRing = (d) => section(d, legwear === "leg_warmers" ? 0.039 + 0.013 * Math.cos(30 * d) : 0.012);
        const cuff = Math.min(to, bareTo + 0.08);
        rings(p, [sockRing(bareTo), sockRing(cuff)], mixColor(sock, "#3a2a40", 0.12), { flip: side < 0 });
        if (cuff < to) rings(p, steps(cuff, to, 0.075).map(sockRing), sock, { flip: side < 0 });
      }
    }
    const stocking = ["stockings", "knee_socks", "ankle_socks"].includes(legwear) && w.legwearColor;
    drawFootwear(p, shoe, w, stocking || tights, side, shape(3.34).x, floor, leg, shape);
  }
  p.finish = 0;
}
