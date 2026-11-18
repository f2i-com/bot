import { ACTION_CATALOG, sampleAction } from "./turntable/actions.js";

export const BODY_ACTIONS = ACTION_CATALOG.filter(({ duration }) => duration > 0);

// Leave enough time for a round trip on the stage and two bars of the dance.
const repetitions = { walk: 4, dance: 2 };
const actionLengths = new Map(BODY_ACTIONS.map(({ id, duration }) => [
  id, Math.round(duration * (repetitions[id] || 1) * 1000),
]));
const motionPreference = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)");
const TAU = Math.PI * 2;

export function bodyActionDurationMs(id) {
  return actionLengths.get(id) || 0;
}

function easeMotion(t) {
  const u = Math.max(0, Math.min(t, 1));
  return u * u * (3 - 2 * u);
}

// Keep full-body cues on their own clock so a wink or a word-timed nod can
// happen in the middle of a walk without cutting the stride short.
export function startBodyMotion(anim, id, nowMs, durationMs) {
  if (!actionLengths.has(id)) return;
  const previous = sampleBodyMotion(anim, nowMs);
  anim.bodyMotion = { id, start: nowMs, end: nowMs + durationMs, from: previous };
}

/** Joint angles in degrees and root travel in gfxx model units. */
export function sampleBodyMotion(anim, nowMs, reducedMotion = motionPreference?.matches) {
  const motion = anim?.bodyMotion;
  if (!motion || nowMs < motion.start || nowMs >= motion.end) return null;
  const elapsed = nowMs - motion.start;
  const remaining = motion.end - nowMs;
  // Reduced motion shows a representative pose for each requested action.
  const pose = sampleAction(motion.id, reducedMotion ? 0.2 : elapsed / 1000);
  if (reducedMotion) return pose;

  const attack = easeMotion(elapsed / 180);
  const release = easeMotion(remaining / 240);
  for (const key of Object.keys(pose)) pose[key] *= release;
  if (motion.id === "walk") {
    // A small circuit starts facing the visitor and closes at the exact point
    // it began. The root faces the tangent while the gait continues underneath.
    const progress = elapsed / (motion.end - motion.start);
    const heading = TAU * progress;
    pose.rootX = 0.56 * (1 - Math.cos(heading));
    pose.rootZ = 0.56 * Math.sin(heading);
    pose.rootYaw = 360 * progress;
  }
  if (attack < 1) {
    // Include the outgoing limbs even when the incoming action omits them.
    const from = motion.from || {};
    for (const key of new Set([...Object.keys(from), ...Object.keys(pose)])) {
      const previous = from[key] || 0;
      let change = (pose[key] || 0) - previous;
      if (key === "rootYaw") change -= 360 * Math.round(change / 360);
      pose[key] = previous + change * attack;
    }
  }
  return pose;
}

// Page movement supplies the translation. Both renderers sample the same
// in-place footsteps and heading, including the weight transfer into the stop.
export function sampleGuideBody(anim, nowMs, reducedMotion = motionPreference?.matches) {
  const travel = anim.guideTravel;
  if (travel) {
    const gait = sampleAction("walk", reducedMotion ? 0.2 : travel.elapsed * 1.28);
    for (const key of Object.keys(gait)) gait[key] *= travel.stride;
    gait.rootYaw = travel.facing * (68 - 44 * travel.point);
    return gait;
  }
  const body = sampleBodyMotion(anim, nowMs, reducedMotion);
  if (!anim.tourPointing || !anim.guideDirection) return body;
  // Keep the pointing hand facing the page even during an authored walk.
  return { ...body, rootX: 0, rootZ: 0, rootYaw: 24 * anim.guideDirection.x };
}

// Single showcases yield to authored gestures. A tour keeps one hand free
// to indicate the target while the other hand performs the authored gesture.
export function presentingArm(anim, bodyMotion) {
  const direction = anim.guideDirection;
  if (!direction) return null;
  const tour = anim.tourPointing || anim.guideTravel;
  if (!tour && (bodyMotion || ["thumbsup", "think", "shrug"].includes(anim.emote))) return null;
  const elevation = Math.atan2(-direction.y, Math.abs(direction.x));
  return {
    side: direction.x < 0 ? -1 : 1,
    elevation: Math.max(tour ? -1.5 : -0.95, Math.min(tour ? 1.5 : 1.12, elevation)),
    weight: anim.guideTravel?.point ?? 1,
  };
}

// Aim the portrait framing toward a horizontal reach. A near-vertical target
// keeps both shoulders centered, leaving room for the other hand to gesture.
export function tourCameraPan(direction) {
  const x = direction?.x || 0;
  return Math.sign(x) * Math.min(1, Math.max(0, (Math.abs(x) - 0.25) / 0.6));
}

/** Frame options for the 3D renderer, including gaze, authored gestures and speech. */
export function sampleAvatarMotion(anim, nowMs, { reducedMotion = motionPreference?.matches, framing } = {}) {
  const body = sampleGuideBody(anim, nowMs, reducedMotion);
  const pose = body || {};
  // Keep the face inside a visitor's saved portrait or circular widget as the avatar turns.
  if (pose.rootX !== undefined) {
    const travel = framing === "bust" || framing === "portrait" ? 0.22 : framing === "half" ? 0.65 : 1;
    pose.rootX *= travel;
    pose.rootZ *= travel;
  }
  const x = anim.x || {};
  const time = nowMs / 1000;
  const breath = !reducedMotion && anim.idleLife !== false ? Math.sin(time * 1.9) : 0;
  const nod = reducedMotion ? 1 : Math.sin(time * 11);
  const shake = reducedMotion ? 1 : Math.sin(time * 13);
  const bounce = reducedMotion ? 0 : Math.abs(Math.sin(time * 15));
  pose.headTurn = (pose.headTurn || 0) + anim.lookX * 10 + x.shake * shake * 18;
  pose.headTilt = (pose.headTilt || 0) + x.tilt * 11;
  pose.headNod = (pose.headNod || 0) + anim.lookY * 6 + x.nod * nod * 9 + x.bow * 7 + anim.energy * 2;
  pose.torsoPitch = (pose.torsoPitch || 0) + x.bow * 22;
  pose.rootY = (pose.rootY || 0) + breath * 0.012 + x.bounce * bounce * 0.055;
  for (const side of ["left", "right"]) {
    pose[side + "ArmLift"] = (pose[side + "ArmLift"] || 0) + x.shrug * 30;
    pose[side + "Elbow"] = (pose[side + "Elbow"] || 0) + x.shrug * 60;
  }
  pose.thumbUp = x.thumbUp;
  pose.rightShoulder = (pose.rightShoulder || 0) + x.thumbUp * 32 + x.think * 40;
  pose.rightElbow += x.thumbUp * 92 + x.think * 120;
  pose.rightArmRoll = (pose.rightArmRoll || 0) - x.think * 30;
  pose.rightWristTurn = (pose.rightWristTurn || 0) + x.thumbUp * 18;
  const arm = presentingArm(anim, body);
  if (arm) {
    // The model faces the visitor, so its left arm is on the right of the screen.
    const side = arm.side > 0 ? "left" : "right";
    const tour = Boolean(anim.tourPointing || anim.guideTravel);
    if (tour && side === "right" && (anim.bodyMotion?.id === "wave" || x.thumbUp || x.think)) {
      for (const joint of ["ArmLift", "Shoulder", "Elbow", "ArmRoll", "WristTurn", "WristBend"])
        pose["left" + joint] = pose["right" + joint] || 0;
      pose.leftThumbUp = pose.thumbUp;
      pose.thumbUp = 0;
    }
    const angle = arm.elevation * 180 / Math.PI;
    const target = { ArmLift: (tour ? 80 : 78) + angle, Elbow: tour ? 10 : 26, Shoulder: tour ? 8 : 15,
      WristTurn: tour ? 32 : 50, WristBend: tour ? -24 : 0, ArmRoll: 0 };
    for (const [joint, value] of Object.entries(target)) {
      const rest = pose[side + joint] || 0;
      pose[side + joint] = rest + (value - rest) * arm.weight;
    }
    if (tour) pose[side + "Point"] = arm.weight;
  }
  return {
    pose,
    movementSpace: Boolean(body && !anim.guideTravel && !anim.tourPointing),
    presenting: Boolean(anim.guideDirection),
    pointingPan: tourCameraPan(anim.guideDirection),
  };
}
