// Parametric patches keep ink lines, irises and hair highlights on the curved model.
export function patch(p, columns, rows, point, color, reverse = false, normalPoint = null) {
  const vertices = [],
    faces = [];
  const normalVertices = normalPoint ? [] : undefined;
  const pigments = typeof color === "function" ? [] : null;
  for (let j = 0; j <= rows; j++) {
    for (let i = 0; i <= columns; i++) {
      const u = i / columns, v = j / rows;
      const position = point(u, v);
      vertices.push(position);
      if (normalPoint) normalVertices.push(normalPoint(u, v));
      if (pigments) pigments.push(color(u, v, position));
    }
  }
  const stride = columns + 1;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < columns; i++) {
      const a = j * stride + i,
        b = a + 1,
        c = b + stride,
        d = a + stride;
      if (reverse) faces.push([a, c, b], [a, d, c]);
      else faces.push([a, b, c], [a, c, d]);
    }
  }
  p.mesh(vertices, faces, pigments ?? color, normalVertices);
}

export function stroke(p, count, at, radius, color) {
  const points = [],
    radii = [];
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    points.push(at(t));
    radii.push(typeof radius === "function" ? radius(t) : radius);
  }
  p.tube(points, radii, color, { sides: 6 });
}

export function scaleHead(primitives, design) {
  const sx = design.headWidth ?? 1,
    sy = design.headHeight ?? 1;
  const scale = ([x, y, z]) => [x * sx, y * sy, z];
  return {
    mesh: (v, faces, color, normalVertices) =>
      primitives.mesh(v.map(scale), faces, color, normalVertices?.map(scale)),
    tube: (points, radii, color, options) => primitives.tube(points.map(scale), radii, color, options),
    ellipsoid: (center, radii, color, options) =>
      primitives.ellipsoid(scale(center), scale(radii), color, options),
  };
}
