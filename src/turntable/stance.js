// A small pelvis tilt over the planted leg, an opposing shoulder line and
// a stagger at the knees give the resting figure a sense of weight. All
// garments and landmarks use the same transformation as the skin.
export class Stance {
  constructor(design, { floor, hip, shoulder, leg, length }) {
    const weight = { confident: 1.2, relaxed: 1.0, presenter: 0.76, welcoming: 0.8 }[design.posture] ?? 0.85;
    // Height, lateral shift, hip/shoulder slope, depth slope, forward shift.
    this.sections = [
      [floor, 0, 0, -0.19, 0],
      [floor + 0.6 * leg, 0.014, 0.007, -0.16, 0.006],
      [hip - 1.62 * leg, 0.051, 0.026, -0.19, 0.05],
      [hip - 0.48 * leg, 0.093, 0.061, -0.02, 0.02],
      [hip + 0.35 * length, 0.123, 0.083, 0.072, 0],
      [shoulder - 1.5 * length, 0.077, 0.028, 0.02, -0.009],
      [shoulder - 0.66 * length, 0.008, -0.025, -0.035, 0],
      [shoulder, -0.033, -0.049, -0.048, 0.009],
      [-0.52 * design.headScale, -0.023, 0, 0, 0.014],
    ].map(([y, ...values]) => [y, ...values.map((v) => v * weight)]);
    this.values = new Float64Array(8);
  }

  sample(y) {
    const rows = this.sections;
    let i = 1;
    while (i < rows.length - 1 && y > rows[i][0]) i++;
    const a = rows[i - 1],
      b = rows[i],
      span = b[0] - a[0];
    const t = Math.max(0, Math.min(1, (y - a[0]) / span));
    const blend = t * t * (3 - 2 * t),
      slope = (6 * t * (1 - t)) / span;
    for (let k = 0; k < 4; k++) {
      const delta = b[k + 1] - a[k + 1];
      this.values[k] = a[k + 1] + blend * delta;
      this.values[k + 4] = slope * delta;
    }
    return this.values;
  }

  point([x, y, z]) {
    const [shift, tilt, turn, forward] = this.sample(y);
    return [x + shift, y + tilt * x, z + turn * x + forward];
  }

  apply(builder) {
    const data = builder.data;
    let lastY = NaN;
    for (let i = 0; i < data.length; i += 10) {
      const x = data[i],
        y = data[i + 1],
        nx = data[i + 3],
        ny = data[i + 4],
        nz = data[i + 5];
      if (y !== lastY) {
        this.sample(y);
        lastY = y;
      }
      const v = this.values;
      data[i] += v[0];
      data[i + 1] += v[1] * x;
      data[i + 2] += v[2] * x + v[3];
      // Apply the inverse transpose of the local deformation to the normal.
      const nY = (ny - v[4] * (nx - v[2] * nz) - (v[6] * x + v[7]) * nz) / (1 + v[5] * x - v[4] * v[1]);
      const nX = nx - v[1] * nY - v[2] * nz;
      const scale = 1 / (Math.hypot(nX, nY, nz) || 1);
      data[i + 3] = nX * scale;
      data[i + 4] = nY * scale;
      data[i + 5] = nz * scale;
    }
  }
}
