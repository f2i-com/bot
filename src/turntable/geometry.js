// Geometry is authored in model space (+Y up, +Z front). One interleaved
// buffer per layer lets a blink update the face without uploading the hair.
const TAU = 2 * Math.PI;
const unit = ([x, y, z]) => {
  const length = Math.hypot(x, y, z) || 1;
  return [x / length, y / length, z / length];
};
const cross = ([ax, ay, az], [bx, by, bz]) => [ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx];
const difference = (a, b) => a.map((v, i) => v - b[i]);

// Packed RGB lets a painted mesh interpolate pigment across its vertices.
export const rgb = hex => Number.parseInt(hex.slice(1), 16);
export function blendRgb(a, b, t) {
  const ar = a >> 16, ag = (a >> 8) & 255, ab = a & 255;
  return (Math.round(ar + ((b >> 16) - ar) * t) << 16)
    | (Math.round(ag + (((b >> 8) & 255) - ag) * t) << 8)
    | Math.round(ab + ((b & 255) - ab) * t);
}

export function mixColor(a, b, t) {
  return "#" + blendRgb(rgb(a), rgb(b), t).toString(16).padStart(6, "0");
}

function joinRings(rows, columns, reverse = false) {
  const triangles = [];
  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < columns; i++) {
      const a = j * columns + i,
        b = j * columns + ((i + 1) % columns);
      const c = a + columns,
        d = b + columns;
      triangles.push(
        ...(reverse
          ? [
              [a, c, b],
              [b, c, d],
            ]
          : [
              [a, b, c],
              [b, d, c],
            ]),
      );
    }
  }
  return triangles;
}

function capEnds(vertices, faces, sides, flip) {
  // Separate cap vertices give the flat rim its own normals. Sharing them
  // with the side makes wide hems and collars acquire triangular highlights.
  const start = vertices.length,
    end = start + sides;
  vertices.push(...vertices.slice(0, sides), ...vertices.slice(-sides));
  for (let i = 1; i < sides - 1; i++) {
    if (flip) faces.push([start, start + i, start + i + 1], [end, end + i + 1, end + i]);
    else faces.push([start, start + i + 1, start + i], [end, end + i, end + i + 1]);
  }
}

export class MeshBuilder {
  data = [];
  indices = [];
  parts = [];
  finish = 0;
  scale = 1;

  // Anatomical ranges stay separate even when overlapping clothing is drawn
  // into the same indexed buffer as the skin (for example a hand beside a hip).
  markPart(name) {
    this.parts.push({ start: this.data.length / 10, name });
  }

  mesh(vertices, triangles, color, normalVertices = vertices, occlusion = null) {
    const normals = vertices.map(() => [0, 0, 0]);
    for (const [a, b, c] of triangles) {
      const normal = cross(
        difference(normalVertices[b], normalVertices[a]),
        difference(normalVertices[c], normalVertices[a]),
      );
      for (const index of [a, b, c]) {
        for (let k = 0; k < 3; k++) normals[index][k] += normal[k];
      }
    }
    const uniformColor = typeof color === "string" ? rgb(color) : null;
    const offset = this.data.length / 10;
    for (let i = 0; i < vertices.length; i++) {
      const [x, y, z] = vertices[i];
      const pigment = uniformColor ?? color[i];
      const r = (pigment >> 16) / 255, g = ((pigment >> 8) & 255) / 255, b = (pigment & 255) / 255;
      const shade = occlusion ? occlusion[i] : 0;
      this.data.push(x * this.scale, y * this.scale, z * this.scale, ...unit(normals[i]),
        r * (1 - .62 * shade), g * (1 - shade), b * (1 - .86 * shade), this.finish);
    }
    for (const [a, b, c] of triangles) this.indices.push(offset + a, offset + b, offset + c);
  }

  ellipsoid(center, radii, color, { rotation = [0, 0, 0], sides = 20, rings = 12 } = {}) {
    const vertices = [];
    const [cx, cy, cz] = center,
      [rx, ry, rz] = radii;
    const [sx, sy, sz] = rotation.map(Math.sin),
      [kx, ky, kz] = rotation.map(Math.cos);
    for (let j = 0; j <= rings; j++) {
      const lat = Math.PI * (j / rings - 0.5);
      for (let i = 0; i < sides; i++) {
        const lon = (TAU * i) / sides;
        const x = rx * Math.cos(lat) * Math.sin(lon);
        const y = ry * Math.sin(lat),
          z = rz * Math.cos(lat) * Math.cos(lon);
        const yy = y * kx - z * sx,
          zz = y * sx + z * kx;
        const xx = x * ky + zz * sy;
        vertices.push([cx + xx * kz - yy * sz, cy + xx * sz + yy * kz, cz + zz * ky - x * sy]);
      }
    }
    this.mesh(vertices, joinRings(rings + 1, sides), color);
  }

  // Each profile row is [height, horizontal radius, depth radius, Z offset, X offset].
  loft(rows, color, { sides = 28, pleat = 0 } = {}) {
    const vertices = [];
    for (const [y, rx, rz, z = 0, x = 0] of rows) {
      for (let i = 0; i < sides; i++) {
        const phi = (i * TAU) / sides;
        const fold = 1 + pleat * Math.cos(12 * phi);
        vertices.push([x + rx * Math.sin(phi) * fold, y, z + rz * Math.cos(phi) * fold]);
      }
    }
    const descending = rows[1][0] < rows[0][0];
    const faces = joinRings(rows.length, sides, descending);
    capEnds(vertices, faces, sides, descending);
    this.mesh(vertices, faces, color);
  }

  tube(points, radii, color, { sides = 10 } = {}) {
    const vertices = [];
    for (let j = 0; j < points.length; j++) {
      const tangent = unit(difference(points[Math.min(points.length - 1, j + 1)], points[Math.max(0, j - 1)]));
      const u = unit(cross(tangent, Math.abs(tangent[2]) < 0.94 ? [0, 0, 1] : [0, 1, 0]));
      const v = cross(u, tangent);
      const radius = Array.isArray(radii) ? radii[j] : radii;
      const [rx, rz] = Array.isArray(radius) ? radius : [radius, radius];
      for (let i = 0; i < sides; i++) {
        const s = Math.cos((TAU * i) / sides) * rx,
          t = Math.sin((TAU * i) / sides) * rz;
        vertices.push(points[j].map((value, k) => value + s * u[k] + t * v[k]));
      }
    }
    const faces = joinRings(points.length, sides, true);
    capEnds(vertices, faces, sides, true);
    this.mesh(vertices, faces, color);
  }
}
