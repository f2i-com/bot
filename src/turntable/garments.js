import { mixColor } from "./geometry.js";

const TAU = Math.PI * 2;
const mix = (a, b, t) => a + (b - a) * t;
const smoothstep = (lo, hi, x) => {
  const t = Math.max(0, Math.min(1, (x - lo) / (hi - lo)));
  return t * t * (3 - 2 * t);
};
const angleFromFront = (theta) => Math.acos(Math.max(-1, Math.min(1, Math.cos(theta))));

// A cut defines the distance below the neck all the way around the body.
// Using the same cut for the cloth and its binding keeps their edges registered.
const cuts = {
  dinner_jacket: {
    dress: false, sleeve: "long", untucked: true,
    neckline(theta) { return -0.055 + 0.12 * Math.max(0, Math.cos(theta)) ** 3; },
    hem(theta) { return 1.92 + 0.12 * Math.sin(theta) ** 2; },
  },
  rugby_shirt: {
    dress: false, sleeve: "short",
    neckline(theta) { return -0.045 + 0.19 * Math.max(0, Math.cos(theta)) ** 5; },
  },
  western_shirt: {
    dress: false, sleeve: "long",
    neckline(theta) { return -0.015 + 0.20 * Math.max(0, Math.cos(theta)) ** 2; },
  },
  wrap_work_jacket: {
    dress: false, sleeve: "long", untucked: true,
    neckline(theta) { return 0.02 + 0.47 * Math.max(0, 1 - angleFromFront(theta) / 1.02); },
    hem(theta) { return 2.04 + 0.10 * Math.sin(theta) ** 2; },
  },
  tailored_waistcoat: {
    dress: false, sleeve: "long",
    neckline(theta) { return -0.03 + 0.15 * Math.max(0, Math.cos(theta)) ** 3; },
  },
  field_overshirt: {
    dress: false, sleeve: "long", untucked: true,
    hem(theta) { return 1.80 + 0.16 * Math.cos(theta) ** 2; },
    neckline(theta) { return -0.035 + 0.22 * Math.max(0, Math.cos(theta)) ** 4; },
  },
  contrast_henley: {
    dress: false, sleeve: "short",
    neckline(theta) { return 0.068 + 0.18 * Math.max(0, Math.cos(theta)) ** 3; },
  },
  mariner_blouse: {
    dress: false, sleeve: "short",
    neckline(theta) { return 0.06 + 0.53 * Math.max(0, 1 - angleFromFront(theta) / 1.14); },
  },
  one_shoulder_dress: {
    dress: true, sleeve: "none",
    neckline(theta) {
      return 0.075 + 0.54 * (1 - smoothstep(-0.45, 0.72, Math.sin(theta))) + 0.04 * Math.cos(theta) ** 2;
    },
  },
  track_jacket: {
    dress: false, sleeve: "long",
    neckline(theta) { return -0.105 + 0.11 * Math.max(0, Math.cos(theta)) ** 12; },
  },
  sweetheart_dress: {
    dress: true,
    sleeve: "none",
    neckline(theta) {
      const a = angleFromFront(theta);
      return (
        0.59 +
        0.2 * Math.exp(-((a / 0.23) ** 2)) -
        0.19 * Math.exp(-(((a - 0.55) / 0.39) ** 2)) +
        0.055 * smoothstep(1.75, 2.93, a)
      );
    },
  },
  wrap_blouse: {
    dress: false,
    sleeve: "long",
    neckline(theta) {
      const a = angleFromFront(theta);
      const lapel = 0.71 * Math.max(0, 1 - a / 1.14) ** 1.27;
      return 0.098 + lapel + 0.09 * smoothstep(1.72, 2.95, a);
    },
  },
  square_knit: {
    dress: false,
    sleeve: "short",
    neckline(theta) {
      const a = angleFromFront(theta);
      return 0.097 + 0.42 * (1 - smoothstep(0.45, 0.81, a)) + 0.19 * smoothstep(2.24, 2.69, a);
    },
  },
  halter_gown: {
    dress: true,
    sleeve: "none",
    neckline(theta) {
      const a = angleFromFront(theta);
      // The front panels grow continuously out of the bodice and meet the
      // neckband. Their outer edges fall away toward the open shoulder blades.
      return (
        0.006 +
        0.82 * Math.max(0, 1 - a / 0.61) +
        0.645 * smoothstep(0.78, 1.47, a) +
        0.09 * smoothstep(1.75, 3, a)
      );
    },
  },
};

export function garmentCut(style) {
  return Object.hasOwn(cuts, style) ? cuts[style] : null;
}

function ribbon(p, steps, edgePair, color) {
  const vertices = [],
    triangles = [];
  for (let i = 0; i <= steps; i++) {
    vertices.push(...edgePair(i / steps));
    if (i) {
      const k = i * 2;
      triangles.push([k - 2, k, k - 1], [k - 1, k, k + 1]);
    }
  }
  p.mesh(vertices, triangles, color);
}

function necklineBand(p, cut, ring, breadth, color, offset = 0) {
  ribbon(
    p,
    96,
    (t) => {
      const angle = TAU * t;
      const d = cut(angle) + offset;
      return [ring(d, angle, 0.025), ring(d + breadth, angle, 0.026)];
    },
    color,
  );
}

function seam(p, ring, path, color, width = 0.006, lift = 0.032) {
  const points = Array.from({ length: 39 }, (_, i) => {
    const [d, angle] = path(i / 38);
    return ring(d, angle, lift);
  });
  p.tube(points, width, color, { sides: 7 });
}

function sweetheartStraps(p, cut, ring, cloth, accent) {
  // Trace the intersection of a vertical plane with the shoulder. Each side
  // of the strap has its own shoulder crest so its width stays uniform there.
  const radius = (d) => ring(d, Math.PI / 2)[0];
  const angle = 0.56,
    midpoint = Math.sin(angle) * radius(cut(angle));
  const halfWidth = radius(cut(angle)) * 0.034;
  const strapEdge = (across, side, lift) => {
    const x = midpoint + across * halfWidth;
    let low = 0,
      high = 0.36;
    for (let i = 0; i < 12; i++) {
      const mid = (low + high) / 2;
      if (radius(mid) < x) low = mid;
      else high = mid;
    }
    return (t) => {
      const rear = t > 0.5;
      const end = cut(rear ? Math.PI - angle : angle) + 0.038;
      const distance = mix(high, end, Math.cos(Math.PI * t) ** 2);
      const azimuth = Math.asin(Math.min(1, x / radius(distance)));
      return ring(distance, side * (rear ? Math.PI - azimuth : azimuth), lift);
    };
  };
  for (const side of [-1, 1]) {
    const left = strapEdge(-1, side, 0.009),
      right = strapEdge(1, side, 0.009);
    ribbon(p, 64, (t) => [left(t), right(t)], cloth);
    const welt = strapEdge(-0.83, side, 0.011),
      weltEdge = strapEdge(-0.57, side, 0.011);
    ribbon(p, 64, (t) => [welt(t), weltEdge(t)], accent);
  }
}

function waistBand(p, ring, height, width, cloth) {
  ribbon(p, 72, (t) => [ring(height, TAU * t, 0.032), ring(height + width, TAU * t, 0.033)], cloth);
}

// Tessellate both dimensions so broad swathes of cloth stay on the fitted
// torso through changes to the rib cage, pectorals, bust and waist.
function clothPanel(p, ring, from, to, upper, lower, color, lift = 0.044) {
  const vertices = [], faces = [];
  const segments = Math.max(16, Math.ceil(16 * Math.abs(to - from)));
  const rows = 12;
  for (let row = 0; row <= rows; row++) {
    for (let i = 0; i <= segments; i++) {
      const angle = mix(from, to, i / segments);
      vertices.push(ring(mix(upper(angle), lower(angle), row / rows), angle, lift));
      if (i && row) {
        const n = vertices.length - 1;
        faces.push([n - segments - 2, n - 1, n - segments - 1], [n - segments - 1, n - 1, n]);
      }
    }
  }
  p.mesh(vertices, faces, color);
}

function frontStrip(p, ring, start, end, center, breadth, color, lift = 0.064) {
  ribbon(p, 56, t => {
    const d = mix(start, end, t), a = center(t), w = breadth(t);
    return [ring(d, a - w, lift), ring(d, a + w, lift)];
  }, color);
}

export function drawGarmentDetails(p, design, surface) {
  const style = design.outfitStyle;
  const cut = garmentCut(style);
  if (!cut) return;
  const { ring } = surface;
  const cloth = design.outfitPrimary,
    accent = design.outfitAccent;
  const piping = mixColor(cloth, accent, 0.62);
  const shadow = mixColor(cloth, "#292032", 0.24);
  const edge = cut.neckline;

  if (style === "dinner_jacket") {
    const linen = mixColor("#faf1e2", cloth, 0.06);
    const inset = a => edge(a) + 0.89 * Math.max(0, 1 - Math.abs(a) / 0.98);
    clothPanel(p, ring, -0.98, 0.98, edge, inset, linen);
    for (const side of [-1, 1]) {
      frontStrip(p, ring, 0.02, 1.14, t => side * mix(0.95, -0.05, t),
        t => 0.034 + 0.22 * Math.sin(Math.PI * t) ** 0.8, accent, 0.082);
      seam(p, ring, t => [1.34 - 0.085 * t, side * mix(0.43, 1.08, t)], accent, 0.023, 0.080);
      for (const d of [1.12, 1.39])
        p.ellipsoid(ring(d, side * 0.255, 0.083), [0.041, 0.041, 0.022], mixColor(cloth, accent, 0.68), { sides: 12, rings: 7 });
    }
    clothPanel(p, ring, 0.42, 0.92, a => 0.68 - 0.13 * Math.abs(Math.sin((a - 0.42) * 11)), () => 0.73, linen, 0.079);
    seam(p, ring, t => [0.73 - t * 0.02, 0.40 + t * 0.55], accent, 0.019, 0.089);
    const [x, y, z] = ring(0.193, 0, 0.115);
    for (const side of [-1, 1]) {
      const points = [[0, 0, 0.012], [0.21, 0.086, -0.012], [0.22, 0.013, -0.005],
        [0.20, -0.078, 0], [0.050, -0.029, 0.015], [0.105, 0.012, 0.039]];
      p.mesh(points.map(([dx, dy, dz]) => [x + side * dx, y + dy, z + dz]),
        [[0, 1, 5], [1, 2, 5], [2, 3, 5], [3, 4, 5], [4, 0, 5]], accent);
    }
    p.ellipsoid([x, y, z + 0.028], [0.043, 0.043, 0.030], accent, { sides: 12, rings: 6 });
  } else if (style === "rugby_shirt") {
    for (const d of [0.43, 1.04]) {
      clothPanel(p, ring, 0, TAU, () => d, () => d + 0.26, accent);
      necklineBand(p, () => d + 0.30, ring, 0.030, accent);
    }
    for (const side of [-1, 1]) {
      clothPanel(p, ring, side < 0 ? -1.36 : 0.025, side < 0 ? -0.025 : 1.36,
        edge, a => edge(a) + 0.048 + 0.25 * (1 - Math.abs(Math.abs(a) - 0.48) / 1.04), design.outfitSecondary, 0.067);
    }
    frontStrip(p, ring, edge(0), 0.50, () => 0, () => 0.066, mixColor(cloth, accent, 0.65), 0.076);
    for (const d of [0.24, 0.37])
      p.ellipsoid(ring(d, 0, 0.087), [0.022, 0.022, 0.015], accent, { sides: 10, rings: 5 });
  } else if (style === "western_shirt") {
    const yoke = a => 0.34 + 0.24 * Math.max(0, 1 - Math.abs(angleFromFront(a) - 0.63) / 0.52)
      + 0.20 * smoothstep(2.26, Math.PI, angleFromFront(a));
    clothPanel(p, ring, 0, TAU, edge, yoke, mixColor(cloth, accent, 0.48));
    necklineBand(p, yoke, ring, 0.033, accent);
    for (const side of [-1, 1]) {
      const points = a => 0.74 + 0.09 * Math.abs(Math.sin((Math.abs(a) - 0.32) * 9.8));
      const lo = side < 0 ? -0.98 : 0.32, hi = side < 0 ? -0.32 : 0.98;
      clothPanel(p, ring, lo, hi, () => 0.70, points, mixColor(cloth, accent, 0.45), 0.061);
      seam(p, ring, t => { const a = mix(lo, hi, t); return [points(a), a]; }, accent, 0.009, 0.069);
      clothPanel(p, ring, side < 0 ? -1.15 : 0.025, side < 0 ? -0.025 : 1.15,
        edge, a => edge(a) + 0.02 + 0.26 * Math.max(0, 1 - Math.abs(Math.abs(a) - 0.59) / 0.55), cloth, 0.073);
    }
    frontStrip(p, ring, edge(0), 1.57, () => 0, () => 0.054, mixColor(cloth, accent, 0.17), 0.067);
    for (const d of [0.29, 0.54, 0.79, 1.04, 1.29, 1.54])
      p.ellipsoid(ring(d, 0, 0.079), [0.029, 0.029, 0.018], mixColor(accent, "#fff9e2", 0.64), { sides: 10, rings: 6 });
  } else if (style === "wrap_work_jacket") {
    necklineBand(p, edge, ring, 0.128, accent);
    frontStrip(p, ring, edge(0) + 0.058, 1.44, t => 0.92 * t, () => 0.105, accent);
    clothPanel(p, ring, 0, TAU, a => 1.34 + 0.041 * Math.sin(a), a => 1.55 + 0.041 * Math.sin(a), accent, 0.072);
    for (const [offset, end] of [[0.30, 1.92], [-0.16, 1.83]]) {
      frontStrip(p, ring, 1.45, end, t => 0.92 + offset * t, t => 0.055 - 0.017 * t, accent, 0.096);
    }
    p.ellipsoid(ring(1.46, 0.92, 0.102), [0.075, 0.081, 0.052], mixColor(accent, cloth, 0.32), { sides: 14, rings: 8 });
    necklineBand(p, a => cut.hem(a) - 0.035, ring, 0.029, mixColor(cloth, accent, 0.65));
  } else if (["tailored_waistcoat", "field_overshirt", "contrast_henley"].includes(style)) {
    const vest = style === "tailored_waistcoat", henley = style === "contrast_henley";
    const buttons = vest ? [0.77, 0.97, 1.17, 1.37] : henley ? [0.31, 0.43, 0.55] : [0.32, 0.58, 0.84, 1.10, 1.36];
    const facing = vest ? accent : mixColor(cloth, henley ? accent : design.outfitSecondary, 0.32);
    const placketEnd = henley ? 0.60 : cut.hem?.(0) ?? 1.56;
    ribbon(p, 48, t => {
      const d = mix(edge(0), placketEnd, t);
      return [ring(d, -0.054, 0.054), ring(d, 0.054, 0.054)];
    }, vest ? shadow : facing);
    if (vest) {
      // The triangular shirt front follows the vest's V from neck to sternum.
      for (let panel = 0; panel < 12; panel++) {
        ribbon(p, 48, t => {
          const a = mix(-1.25, 1.25, t);
          const lower = edge(a) + 0.58 * (1 - Math.abs(a) / 1.25);
          return [ring(mix(edge(a), lower, panel / 12), a, 0.061),
            ring(mix(edge(a), lower, (panel + 1) / 12), a, 0.061)];
        }, accent);
      }
    }
    for (const side of [-1, 1]) {
      if (henley) {
        // A curved raglan seam joins the contrast shoulder to its matching sleeve.
        for (let panel = 0; panel < 8; panel++) {
          ribbon(p, 40, t => {
            const a = mix(0.85, Math.PI - 0.7, t);
            const depth = 0.02 + 0.54 * Math.sin(Math.PI * t);
            return [ring(edge(a) + depth * panel / 8, side * a, 0.04),
              ring(edge(a) + depth * (panel + 1) / 8, side * a, 0.04)];
          }, accent);
        }
      } else {
        ribbon(p, 36, t => {
          const a = side * mix(0.045, 1.26, t);
          const point = 0.245 * (1 - Math.abs(2 * t - 1));
          return [ring(edge(a), a, 0.074), ring(edge(a) + 0.034 + point, a, 0.074)];
        }, vest ? mixColor(accent, cloth, 0.18) : facing);
        const pocketY = vest ? 1.22 : 0.62;
        if (!vest) {
          for (let panel = 0; panel < 6; panel++) {
            ribbon(p, 27, t => {
              const a = side * mix(0.28, 0.92, t);
              const depth = 0.29 + 0.065 * Math.sin(Math.PI * t);
              return [ring(pocketY + depth * panel / 6, a, 0.045),
                ring(pocketY + depth * (panel + 1) / 6, a, 0.045)];
            }, mixColor(cloth, accent, 0.20));
          }
        }
        ribbon(p, 28, t => {
          const a = side * mix(0.27, 0.95, t);
          const y = pocketY - (vest ? 0.115 * t : 0);
          return [ring(y, a, 0.065), ring(y + (vest ? 0.036 : 0.08 + 0.04 * Math.sin(Math.PI * t)), a, 0.065)];
        }, vest ? mixColor(cloth, accent, 0.40) : shadow);
      }
    }
    necklineBand(p, edge, ring, henley ? 0.052 : 0.026, henley ? accent : facing);
    if (cut.untucked) necklineBand(p, angle => cut.hem(angle) - 0.026, ring, 0.024, mixColor(cloth, accent, 0.20));
    for (const d of buttons) p.ellipsoid(ring(d, 0, 0.077), [0.032, 0.031, 0.019], vest ? accent : shadow, { sides: 10, rings: 6 });
  } else if (style === "mariner_blouse") {
    const flap = (a) => {
      const angle = angleFromFront(a);
      return 0.19 + 0.57 * Math.max(0,1-angle/1.10) + 0.57*smoothstep(1.36,2.22,angle);
    };
    for(let band=0;band<10;band++) {
      ribbon(p,112,t=>{
        const a=t*TAU, d=edge(a), end=flap(a);
        return [ring(mix(d,end,band/10),a,.035),ring(mix(d,end,(band+1)/10),a,.035)];
      },mixColor(cloth,accent,.47));
    }
    for (const inset of [.04,.09]) {
      ribbon(p,112,t=>{
        const a=t*TAU, d=flap(a)-inset;
        return [ring(d,a,.046),ring(d+.018,a,.046)];
      },cloth);
    }
    for (const side of [-1,1]) {
      ribbon(p,40,t=>{
        const a=side*(.035+.235*t), d=.61+.47*t, width=.06*(1-.64*t);
        return [ring(d,a-width,.06),ring(d+.026*t,a+width,.059)];
      },accent);
    }
    p.ellipsoid(ring(.62,0,.055),[.061,.055,.044],mixColor(accent,cloth,.18),{sides:14,rings:9});
    waistBand(p,ring,1.515,.057,mixColor(cloth,accent,.30));
  } else if (style === "one_shoulder_dress") {
    necklineBand(p,edge,ring,.071,mixColor(cloth,accent,.42));
    necklineBand(p,edge,ring,.017,accent,.009);
    for(let i=0;i<3;i++) {
      const start=.55+.24*i;
      seam(p,ring,t=>[mix(start,1.36+.028*i,t)+.12*Math.sin(Math.PI*t),mix(.73,-.95,t)],mixColor(cloth,accent,.18),.014);
    }
    const clasp=ring(1.395,-.95,.07);
    p.ellipsoid(clasp,[.07,.064,.045],accent,{sides:15,rings:9});
  } else if (style === "track_jacket") {
    const chevron=a=>.38+.39*Math.abs(Math.cos(a))**3;
    necklineBand(p,chevron,ring,.135,accent);
    necklineBand(p,chevron,ring,.023,mixColor(cloth,"#222438",.54),.146);
    necklineBand(p,edge,ring,.032,accent);
    ribbon(p,50,t=>{
      const d=mix(edge(0),1.56,t);
      return [ring(d,-.031,.057),ring(d,.031,.057)];
    },shadow);
    seam(p,ring,t=>[mix(edge(0),1.57,t),0],mixColor(accent,"#b3b7bd",.42),.01,.064);
    p.ellipsoid(ring(.35,0,.078),[.034,.063,.024],accent,{sides:12,rings:8});
    for(const s of [-1,1]) seam(p,ring,t=>[1.11+.24*t,s*(.68-.32*t)],shadow,.017);
    waistBand(p,ring,1.47,.095,mixColor(cloth,"#332d43",.35));
  } else if (style === "sweetheart_dress") {
    sweetheartStraps(p, edge, ring, cloth, piping);
    necklineBand(p, edge, ring, 0.027, piping);
    for (const side of [-1, 1]) {
      for (const rear of [false, true]) {
        const seamAngle = (t) => {
          const a = 0.48 + 0.15 * Math.sin(Math.PI * t) - 0.12 * t;
          return side * (rear ? Math.PI - a : a);
        };
        seam(p, ring, (t) => [mix(edge(seamAngle(0)) + 0.027, 1.57, t), seamAngle(t)], shadow, 0.009);
      }
    }
    waistBand(p, ring, 1.51, 0.045, piping);
  } else if (style === "wrap_blouse") {
    necklineBand(p, edge, ring, 0.045, mixColor(cloth, accent, 0.34));
    const crossover = (t) => [mix(edge(0), 1.49, t), mix(0, 1.04, t)];
    ribbon(
      p,
      56,
      (t) => {
        const [d, a] = crossover(t);
        return [ring(d, a, 0.038), ring(d + 0.055, a, 0.035)];
      },
      mixColor(cloth, accent, 0.34),
    );
    seam(p, ring, crossover, shadow, 0.006, 0.044);
    const sash = mixColor(cloth, accent, 0.47);
    waistBand(p, ring, 1.39, 0.116, sash);
    const clasp = ring(1.451, 1.06, 0.055);
    p.ellipsoid(clasp, [0.059, 0.048, 0.052], accent, { sides: 14, rings: 9 });
    for (const flank of [-1, 1]) {
      ribbon(
        p,
        23,
        (t) => {
          const d = mix(1.47, 1.597, t),
            a = 1.06 + flank * 0.29 * t;
          return [ring(d, a - 0.029, 0.053), ring(d + 0.012, a + 0.029, 0.052)];
        },
        sash,
      );
    }
  } else if (style === "square_knit") {
    necklineBand(p, edge, ring, 0.065, mixColor(cloth, accent, 0.47));
    necklineBand(p, edge, ring, 0.015, accent, 0.047);
    waistBand(p, ring, 1.48, 0.079, mixColor(cloth, accent, 0.34));
    for (const side of [-1, 1]) {
      for (const start of [0.52, 0.57]) {
        const a = side * start;
        seam(
          p,
          ring,
          (t) => [mix(edge(a) + 0.073, 1.479, t), a + side * 0.026 * Math.sin(Math.PI * t)],
          mixColor(cloth, accent, 0.24),
          0.006,
        );
      }
    }
  } else {
    ribbon(
      p,
      88,
      (t) => {
        const a = mix(0.64, TAU - 0.64, t);
        return [ring(-0.034, a, 0.013), ring(0.018, a, 0.013)];
      },
      cloth,
    );
    necklineBand(p, edge, ring, 0.022, piping);
    for (const side of [-1, 1]) {
      seam(p, ring, (t) => [mix(0.57, 1.5, t), side * mix(0.64, 0.12, t)], mixColor(cloth, accent, 0.25), 0.008);
      seam(p, ring, (t) => [mix(0.64, 1.5, t), side * mix(0.82, 0.23, t)], shadow, 0.007);
    }
    const clasp = ring(1.5, 0, 0.052);
    p.ellipsoid(clasp, [0.075, 0.04, 0.022], accent, { sides: 16, rings: 8 });
  }
}
