// Additive animation in joint-local degrees. Root offsets use model units.
// The phase is absolute so pausing, scrubbing or skipping a frame is lossless.
const TAU = Math.PI * 2;

export const ACTION_CATALOG = [
  { id: "rest", label: "Rest", duration: 0 },
  { id: "wave", label: "Wave", duration: 3.6 },
  { id: "walk", label: "Walk", duration: 1.16 },
  { id: "dance", label: "Dance", duration: 2.18 },
  { id: "stretch", label: "Stretch", duration: 5.6 },
  { id: "squat", label: "Squat", duration: 3.4 },
];

const durations = Object.fromEntries(ACTION_CATALOG.map(({ id, duration }) => [id, duration]));

function phase(seconds, duration) {
  const position = (seconds % duration) / duration;
  return position < 0 ? position + 1 : position;
}

// A compact, smooth peak that wraps across the ends of the cycle.
const beat = (phase, center, power = 2) => Math.max(0, Math.cos(TAU * (phase - center))) ** power;

function wave(seconds) {
  const t = phase(seconds, durations.wave);
  // The arm settles briefly between greetings. The external shoulder rotation
  // brings a flexed forearm upright so the hand can pass either side of it.
  const raised = 1 - 0.57 * beat(t, 0.79, 5);
  const sweep = raised * Math.sin(TAU * 3 * t);
  const returnSweep = raised * Math.cos(TAU * 3 * t);
  return {
    rightArmLift: 22 + 60 * raised + 8 * sweep,
    rightShoulder: 5 + 8 * raised + 4 * returnSweep,
    rightArmRoll: 26 + 57 * raised - 11 * sweep,
    rightElbow: 31 + 53 * raised + 14 * sweep,
    rightWristBend: 13 * returnSweep,
    rightWristTurn: 35 * raised + 9 * sweep,
    leftArmLift: 5 + 3 * raised,
    leftShoulder: -4 + 2 * Math.cos(TAU * t),
    leftElbow: 8 + 4 * raised,
    torsoTurn: -4 * raised + 1.7 * sweep,
    torsoLean: -3.4 * raised,
    headTurn: 8 * raised - 2.5 * sweep,
    headTilt: 4 * raised,
    headNod: 3.5 * beat(t, 0.8),
    rootY: 0.014 * Math.sin(TAU * t),
  };
}

function walk(seconds) {
  const t = phase(seconds, durations.walk);
  const stride = Math.cos(TAU * t);
  const transfer = Math.sin(TAU * t);
  // Each knee yields a little at heel strike, then flexes much farther on
  // toe-off so the swinging foot clears the straight supporting leg.
  const knee = (p) => 4 + 12 * beat(p, 0.105, 4) + 52 * beat(p, 0.66, 2.5);
  const hip = (p) => 3 + 24 * Math.cos(TAU * p);
  const ankle = (p) => {
    // Lift the toe at heel strike, roll onto the forefoot, then let the
    // swinging foot clear the ground. Pitch is relative to the flexed shin.
    const shoePitch = -10 * beat(p, 0.01, 3) + 27 * beat(p, 0.5, 3) - 7 * beat(p, 0.83, 5);
    return Math.min(43, Math.max(-31, knee(p) - hip(p) - shoePitch));
  };
  return {
    leftHip: hip(t),
    rightHip: hip(t + 0.5),
    leftKnee: knee(t),
    rightKnee: knee(t + 0.5),
    leftAnkleFlex: ankle(t),
    rightAnkleFlex: ankle(t + 0.5),
    leftShoulder: -18 * stride - 3 * transfer,
    rightShoulder: 18 * stride + 3 * transfer,
    leftArmLift: 4,
    rightArmLift: 4,
    leftElbow: 15 - 7 * stride,
    rightElbow: 15 + 7 * stride,
    torsoTurn: 5.8 * stride,
    torsoPitch: 3.2 + 1.3 * Math.cos(2 * TAU * t),
    headTurn: -3.1 * stride,
    headNod: -2 - 1.6 * Math.cos(2 * TAU * t),
    torsoLean: -1.9 * transfer,
    rootSway: 0.048 * transfer,
    groundFeet: 1,
  };
}

function dance(seconds) {
  const t = phase(seconds, durations.dance);
  const step = Math.sin(TAU * t);
  const turn = Math.cos(TAU * t);
  const bounce = 0.5 + 0.5 * Math.cos(2 * TAU * t - 0.32);
  // A two-step groove. The elbow follows the shoulder a fraction of a beat
  // later while the knee on the unloaded side rises into the next accent.
  const arms = Math.sin(TAU * t - 0.19);
  const elbows = Math.sin(TAU * t - 0.68);
  return {
    leftArmLift: 43 + 32 * arms,
    rightArmLift: 43 - 32 * arms,
    leftShoulder: 14 - 18 * turn,
    rightShoulder: 14 + 18 * turn,
    leftArmRoll: 31 + 26 * arms,
    rightArmRoll: 31 - 26 * arms,
    leftElbow: 51 + 31 * elbows,
    rightElbow: 51 - 31 * elbows,
    leftHip: 9 + 12 * step + 5 * bounce,
    rightHip: 9 - 12 * step + 5 * bounce,
    leftHipOut: 4 + 16 * beat(t, 0.25),
    rightHipOut: 4 + 16 * beat(t, 0.75),
    leftKnee: 8 + 14 * bounce + 22 * beat(t, 0.24),
    rightKnee: 8 + 14 * bounce + 22 * beat(t, 0.74),
    torsoTurn: 13 * turn,
    torsoLean: 6.7 * step,
    torsoPitch: 2 + 4 * bounce,
    headTurn: -9 * turn + 3 * Math.sin(2 * TAU * t),
    headTilt: -4 * step,
    headNod: -2 + 6 * bounce,
    leftHipTwist: 9 * beat(t, 0.25, 3),
    rightHipTwist: 9 * beat(t, 0.75, 3),
    leftAnkleFlex: 4 + 9 * bounce - 10 * beat(t, 0.25, 3),
    rightAnkleFlex: 4 + 9 * bounce - 10 * beat(t, 0.75, 3),
    rootSway: -0.17 * step,
    groundFeet: 1,
  };
}

function stretch(seconds) {
  // Each side takes a turn reaching overhead. The other arm folds toward the
  // waist; the ribs tip away from the reach while the eyes follow the hand.
  const t = phase(seconds, durations.stretch);
  const side = Math.sin(TAU * t + 0.92);
  const left = 0.5 + 0.5 * side,
    right = 1 - left;
  return {
    leftArmLift: 24 + 132 * left,
    rightArmLift: 24 + 132 * right,
    leftElbow: 50 - 43 * left,
    rightElbow: 50 - 43 * right,
    leftArmRoll: 28 + 34 * left,
    rightArmRoll: 28 + 34 * right,
    leftShoulder: 9 - 12 * left,
    rightShoulder: 9 - 12 * right,
    leftWristBend: 9 - 16 * left,
    rightWristBend: 9 - 16 * right,
    torsoLean: 14 * side,
    torsoPitch: -4,
    headNod: -9 - 4 * side * side,
    headTilt: -7 * side,
    headTurn: 12 * side,
  };
}

function squat(seconds) {
  const t = phase(seconds, durations.squat);
  // Smooth the change of direction at full depth and extension. Counter-rotate
  // each ankle so the soles remain horizontal while the shins tilt forward.
  const u = 0.5 + 0.5 * Math.cos(TAU * t);
  const depth = u * u * (3 - 2 * u);
  const hip = 5 + 69 * depth,
    knee = 8 + 91 * depth;
  return {
    leftHip: hip,
    rightHip: hip,
    leftKnee: knee,
    rightKnee: knee,
    leftAnkleFlex: knee - hip,
    rightAnkleFlex: knee - hip,
    plantFeet: 1,
    torsoPitch: 3 + 23 * depth,
    headNod: -2 - 19 * depth,
    leftShoulder: 4 + 62 * depth,
    rightShoulder: 4 + 62 * depth,
    leftArmLift: 4 + 6 * depth,
    rightArmLift: 4 + 6 * depth,
    leftElbow: 9 + 12 * depth,
    rightElbow: 9 + 12 * depth,
  };
}

export function sampleAction(action, seconds = 0) {
  const time = Number.isFinite(seconds) ? seconds : 0;
  switch (action) {
    case "wave":
      return wave(time);
    case "walk":
      return walk(time);
    case "dance":
      return dance(time);
    case "stretch":
      return stretch(time);
    case "squat":
      return squat(time);
    default:
      return {};
  }
}
