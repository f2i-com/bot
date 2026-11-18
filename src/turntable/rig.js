import { legShape } from "./lower-body.js";
import { handPoint } from "./body.js";

// The character faces +Z. Its anatomical left is +X and up is +Y.
// All angles are in degrees. Positive shoulder/hip swing goes forward, elbow
// flexes forward, knee flexes backward, and arm lift opens away from the ribs.
// Positive hip twist rotates the knee outwards; ankle flex raises the toes.
// Positive spine pitch bends forward and positive head nod lowers the chin.
const ROOT = 0,
  TORSO = 1,
  HEAD = 2;
const LEFT = { arm: 3, forearm: 4, thigh: 5, shin: 6, hand: 11, foot: 13,
  knuckles: 20, tips: 21, thumb: 22, index: 23, indexTip: 24 };
const RIGHT = { arm: 7, forearm: 8, thigh: 9, shin: 10, hand: 12, foot: 14,
  knuckles: 15, tips: 16, thumb: 17, index: 18, indexTip: 19 };
export const JOINT_COUNT = 25;
export const HEAD_JOINT = HEAD;
const radians = Math.PI / 180;
const sideNames = ["left", "right"];
const keys = [
  "rootX",
  "rootY",
  "rootZ",
  "rootYaw",
  "rootPitch",
  "rootSway",
  "torsoTurn",
  "torsoLean",
  "torsoPitch",
  "headTurn",
  "headTilt",
  "headNod",
  "plantFeet",
  "groundFeet",
  "thumbUp",
  "leftThumbUp",
  ...sideNames.flatMap((side) =>
    [
      "Shoulder",
      "ArmLift",
      "ArmRoll",
      "Elbow",
      "WristTurn",
      "WristBend",
      "Point",
      "Hip",
      "HipOut",
      "HipTwist",
      "Knee",
      "AnkleFlex",
    ].map((j) => side + j),
  ),
];

const smooth = (lo, hi, v) => {
  const t = Math.max(0, Math.min(1, (v - lo) / (hi - lo)));
  return t * t * (3 - 2 * t);
};

// Column-major matrices are uploaded directly to WebGL. Rotations with a
// rest-space pivot are concatenated with the parent's complete skin transform.
function rotation(yaw = 0, lean = 0, pitch = 0) {
  const c = Math.cos(yaw * radians),
    s = Math.sin(yaw * radians);
  const l = Math.cos(lean * radians),
    k = Math.sin(lean * radians);
  const p = Math.cos(pitch * radians),
    q = Math.sin(pitch * radians);
  // Rx(pitch) * Rz(lean) * Ry(yaw)
  return [
    l * c,
    p * k * c + q * s,
    q * k * c - p * s,
    0,
    -k,
    p * l,
    q * l,
    0,
    l * s,
    p * k * s - q * c,
    q * k * s + p * c,
    0,
    0,
    0,
    0,
    1,
  ];
}

function atPivot(matrix, [x, y, z]) {
  matrix[12] = x - (matrix[0] * x + matrix[4] * y + matrix[8] * z);
  matrix[13] = y - (matrix[1] * x + matrix[5] * y + matrix[9] * z);
  matrix[14] = z - (matrix[2] * x + matrix[6] * y + matrix[10] * z);
  return matrix;
}

function wristRotation(turn, bend, side) {
  // The palm's knuckle line is already turned inward in the neutral mesh.
  // Compose a bend about that line, then rotate the whole hand at the wrist.
  const a = side * 0.88,
    c = Math.cos(a),
    s = Math.sin(a);
  const p = Math.cos(bend * radians),
    q = Math.sin(bend * radians),
    k = 1 - p;
  const wind = side * turn * radians,
    ct = Math.cos(wind),
    st = Math.sin(wind);
  const x = c,
    z = -s;
  const m = [
    p + x * x * k,
    z * q,
    x * z * k,
    0,
    -z * q,
    p,
    x * q,
    0,
    x * z * k,
    -x * q,
    p + z * z * k,
    0,
    0,
    0,
    0,
    1,
  ];
  for (let j = 0; j < 3; j++) {
    const i = j * 4,
      xx = m[i],
      zz = m[i + 2];
    m[i] = ct * xx + st * zz;
    m[i + 2] = ct * zz - st * xx;
  }
  return m;
}

function attach(palette, child, parent, local) {
  const source = 16 * parent,
    dest = 16 * child;
  for (let column = 0; column < 4; column++) {
    for (let row = 0; row < 4; row++) {
      let sum = 0;
      for (let i = 0; i < 4; i++) sum += palette[source + i * 4 + row] * local[column * 4 + i];
      palette[dest + 4 * column + row] = sum;
    }
  }
}

export class AvatarRig {
  constructor(design, bounds, stance) {
    this.bounds = bounds;
    this.shoulders = bounds.shoulders;
    this.hips = bounds.hips;
    this.reach = bounds.arm.reach;
    this.armY = bounds.arm.root;
    this.wristY = bounds.arm.wrist[1];
    this.handSize = design.handSize ?? 1;
    this.neckY = -0.56 * design.headScale;
    this.stance = stance;
    this.soles = [];
    this.pivots = [];
    const { shoulder, length, hip, leg } = bounds;
    const { elbow, wrist } = bounds.arm;
    const profile = legShape(design, this.hips),
      socket = profile(-0.2),
      knee = profile(1.62),
      ankle = profile(3.3);
    this.pivots[TORSO] = stance.point([0, shoulder - 1.57 * length, 0]);
    this.pivots[HEAD] = stance.point([0, this.neckY, -0.035]);
    for (const side of [1, -1]) {
      const limb = side === 1 ? LEFT : RIGHT;
      this.pivots[limb.arm] = stance.point([side * this.shoulders * 0.9, this.armY - 0.08 * this.reach, 0]);
      this.pivots[limb.forearm] = stance.point([side * elbow[0], elbow[1], elbow[2]]);
      const hand = [side * wrist[0], wrist[1], wrist[2]];
      this.pivots[limb.hand] = stance.point(hand);
      const pivot = (x, y, z) => stance.point(handPoint(hand, side, this.handSize, x, y, z));
      this.pivots[limb.knuckles] = this.pivots[limb.index] = pivot(0, -0.195, 0.018);
      this.pivots[limb.tips] = this.pivots[limb.indexTip] = pivot(0, -0.28, 0.025);
      this.pivots[limb.thumb] = pivot(-0.061, -0.072, 0.006);
      this.pivots[limb.thigh] = stance.point([side * socket.x, hip + 0.2 * length, socket.z]);
      this.pivots[limb.shin] = stance.point([side * knee.x, hip - 1.62 * leg, knee.z]);
      this.pivots[limb.foot] = stance.point([side * ankle.x, hip - 3.3 * leg, ankle.z]);
      // A rig can be sampled before the footwear mesh is generated.
      for (const z of [-0.14, 0.38])
        this.soles.push({ bone: limb.foot, at: stance.point([side * ankle.x, bounds.floor, z]) });
    }
    this.palette = new Float32Array(16 * JOINT_COUNT);
    this.update({});
  }

  update(pose) {
    const values = keys.map((key) => (Number.isFinite(pose?.[key]) ? pose[key] : 0));
    const key = values.join("/");
    if (key === this.key) return;
    this.key = key;
    this.moving = values.some((v) => v !== 0);
    const angles = Object.fromEntries(keys.map((key, i) => [key, values[i]]));
    const root = rotation(angles.rootYaw);
    if (angles.rootPitch) {
      // Recline about the hips, then turn the whole pose to the furniture's heading.
      const c = Math.cos(angles.rootPitch * radians), s = Math.sin(angles.rootPitch * radians);
      root[4] = root[8] * s;
      root[5] = c;
      root[6] = root[10] * s;
      root[8] *= c;
      root[9] = -s;
      root[10] *= c;
      atPivot(root, [0, this.bounds.hip, 0]);
    }
    root[12] += angles.rootX + root[0] * angles.rootSway;
    root[13] += angles.rootY;
    root[14] += angles.rootZ + root[2] * angles.rootSway;
    this.palette.set(root);
    const joint = (id, parent, matrix) => attach(this.palette, id, parent, atPivot(matrix, this.pivots[id]));
    joint(TORSO, ROOT, rotation(angles.torsoTurn, angles.torsoLean, angles.torsoPitch));
    joint(HEAD, TORSO, rotation(angles.headTurn, angles.headTilt, angles.headNod));
    for (const name of sideNames) {
      const side = name === "left" ? 1 : -1,
        limb = side === 1 ? LEFT : RIGHT;
      joint(
        limb.arm,
        TORSO,
        rotation(side * angles[name + "ArmRoll"], side * angles[name + "ArmLift"], -angles[name + "Shoulder"]),
      );
      joint(limb.forearm, limb.arm, rotation(0, 0, -angles[name + "Elbow"]));
      joint(limb.hand, limb.forearm, wristRotation(angles[name + "WristTurn"], angles[name + "WristBend"], side));
      const thumbUp = side === 1 ? angles.leftThumbUp : angles.thumbUp;
      const point = angles[name + "Point"];
      const curl = Math.max(thumbUp, point);
      joint(limb.knuckles, limb.hand, wristRotation(0, 77 * curl, side));
      joint(limb.tips, limb.knuckles, wristRotation(0, 83 * curl, side));
      joint(limb.index, limb.hand, wristRotation(0, 77 * thumbUp, side));
      joint(limb.indexTip, limb.index, wristRotation(0, 83 * thumbUp, side));
      joint(limb.thumb, limb.hand, rotation(0, 0, -64 * thumbUp + 30 * point));
      joint(
        limb.thigh,
        ROOT,
        rotation(side * angles[name + "HipTwist"], side * angles[name + "HipOut"], -angles[name + "Hip"]),
      );
      joint(limb.shin, limb.thigh, rotation(0, 0, angles[name + "Knee"]));
      joint(limb.foot, limb.shin, rotation(0, 0, -angles[name + "AnkleFlex"]));
    }
    if (angles.plantFeet) this.plantFeet(Math.min(1, Math.max(0, angles.plantFeet)));
    if (angles.groundFeet) {
      // The supporting foot can switch mid-cycle. Its lowest sole point
      // determines the pelvis height, also for long legs and raised heels.
      let lowest = Infinity;
      for (const {
        bone,
        at: [x, y, z],
      } of this.soles) {
        const i = 16 * bone + 1;
        lowest = Math.min(
          lowest,
          this.palette[i] * x + this.palette[i + 4] * y + this.palette[i + 8] * z + this.palette[i + 12],
        );
      }
      const lift = (this.bounds.floor + angles.rootY - lowest) * Math.min(1, Math.max(0, angles.groundFeet));
      for (let bone = 0; bone < JOINT_COUNT; bone++) this.palette[bone * 16 + 13] += lift;
    }
  }

  // Keep the midpoint between the ankles at its rest placement by translating
  // the whole pose. Travel, heading and the character's stagger are preserved.
  // This uses this character's actual leg lengths, including asymmetric stance.
  plantFeet(strength) {
    const palette = this.palette;
    for (let axis = 0; axis < 3; axis++) {
      let offset = 0;
      for (const { foot } of [LEFT, RIGHT]) {
        const [x, y, z] = this.pivots[foot],
          i = foot * 16 + axis;
        offset +=
          (palette[axis] - palette[i]) * x +
          (palette[4 + axis] - palette[i + 4]) * y +
          (palette[8 + axis] - palette[i + 8]) * z +
          palette[12 + axis] -
          palette[i + 12];
      }
      offset *= 0.5 * strength;
      for (let joint = 0; joint < JOINT_COUNT; joint++) palette[16 * joint + 12 + axis] += offset;
    }
  }

  // Bind once on an appearance change, *before* the artist's rest stance is
  // baked in. Each vertex gets four indices and normalized linear blend weights.
  bind(mesh) {
    const vertices = mesh.data.length / 10;
    const data = new Float32Array(vertices * 8);
    let region = 0;
    const soles = [[], []];
    for (let i = 0; i < vertices; i++) {
      while (region + 1 < mesh.parts.length && mesh.parts[region + 1].start <= i) region++;
      const part = mesh.parts[region].name,
        j = i * 10,
        y = mesh.data[j + 1];
      this.bindVertex(data, i * 8, part, mesh.data[j], y);
      if (part.endsWith("Leg") && y <= this.bounds.floor + 0.027 * this.bounds.leg) {
        soles[part === "leftLeg" ? 0 : 1].push(this.stance.point([mesh.data[j], y, mesh.data[j + 2]]));
      }
    }
    if (soles.every((sole) => sole.length)) {
      this.soles = [];
      for (const [side, points] of soles.entries()) {
        // Keep eight outline points from the actual outsole and heel. Costs
        // stay fixed per frame for every shoe style and level of mesh detail.
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI) / 4,
            dx = Math.sin(angle),
            dz = Math.cos(angle);
          const at = points.reduce((a, b) => (b[0] * dx + b[2] * dz > a[0] * dx + a[2] * dz ? b : a));
          this.soles.push({ bone: side === 0 ? LEFT.foot : RIGHT.foot, at });
        }
      }
    }
    return data;
  }

  bindVertex(data, offset, part, x, y) {
    const { hip, leg, shoulder, length } = this.bounds;
    const depth = (hip - y) / leg;
    const blend = (a, b, t) => {
      data[offset] = a;
      data[offset + 1] = b;
      data[offset + 4] = 1 - t;
      data[offset + 5] = t;
    };
    if (part === "head") {
      blend(HEAD, HEAD, 0);
      return;
    }
    if (part.endsWith("Thumb") || part.endsWith("Index") || part.endsWith("Fingers")) {
      const limb = part.startsWith("left") ? LEFT : RIGHT;
      const index = part.endsWith("Index");
      const base = index ? limb.index : limb.knuckles;
      const tip = index ? limb.indexTip : limb.tips;
      const d = (this.wristY - y) / this.handSize;
      if (part.endsWith("Thumb")) blend(limb.hand, limb.thumb, smooth(0.072, 0.13, d));
      else if (d < 0.225) blend(limb.hand, base, smooth(0.18, 0.225, d));
      else blend(base, tip, smooth(0.255, 0.303, d));
      return;
    }
    if (part === "skirt" || (part === "torso" && y < shoulder - 1.74 * length)) {
      // Connected fabric shares left and right leg motion across a broad zone;
      // the center line retains the average instead of splitting at the crotch.
      const left = smooth(-0.7 * this.hips, 0.7 * this.hips, x);
      const thigh = smooth(-0.68, 0.44, depth),
        knee = smooth(1.39, 1.86, depth);
      if (knee === 0) {
        data.set([ROOT, LEFT.thigh, RIGHT.thigh, 0, 1 - thigh, thigh * left, thigh * (1 - left), 0], offset);
      } else {
        data.set(
          [
            LEFT.thigh,
            RIGHT.thigh,
            LEFT.shin,
            RIGHT.shin,
            (1 - knee) * left,
            (1 - knee) * (1 - left),
            knee * left,
            knee * (1 - left),
          ],
          offset,
        );
      }
      return;
    }
    if (part.endsWith("Leg")) {
      const limb = part === "leftLeg" ? LEFT : RIGHT;
      if (depth > 3.1) {
        // The blend spans the ankle and boot shaft. Soles and toe caps share
        // the foot transform so they stay rigid when the toes lift.
        blend(limb.shin, limb.foot, smooth(3.1, 3.43, depth));
        return;
      }
      const knee = smooth(1.44, 1.81, depth);
      if (knee > 0) blend(limb.thigh, limb.shin, knee);
      else {
        const seam = Math.min(1, smooth(0, 0.25 * this.hips, Math.abs(x)) + smooth(-0.05, 0.32, depth));
        blend(ROOT, limb.thigh, smooth(-0.68, 0.34, depth) * seam);
      }
      return;
    }
    const shoulderWeight =
      smooth(0.65, 0.99, Math.abs(x) / this.shoulders) * (1 - smooth(0.15, 0.75, (shoulder - y) / length));
    if (part.endsWith("Arm")) {
      const limb = part === "leftArm" ? LEFT : RIGHT;
      const d = (this.armY - y) / this.reach;
      const elbow = smooth(1.1, 1.46, d);
      if (y < this.wristY + 0.1 * this.reach)
        blend(limb.forearm, limb.hand, smooth(-0.1, 0.08, (this.wristY - y) / this.reach));
      else if (elbow > 0) blend(limb.arm, limb.forearm, elbow);
      else blend(TORSO, limb.arm, shoulderWeight + (1 - shoulderWeight) * smooth(0.03, 0.34, d));
      return;
    }
    if (y > shoulder) blend(TORSO, HEAD, smooth(shoulder, this.neckY, y));
    else if (shoulderWeight > 0) blend(TORSO, x > 0 ? LEFT.arm : RIGHT.arm, shoulderWeight);
    else blend(ROOT, TORSO, smooth(-1.95, -1.08, (y - shoulder) / length));
  }
}
