import { applyStageClipAndBackdrop, drawBotAvatar } from "../avatar-renderer.js";
import { sampleAvatarMotion } from "../avatar-motion.js";
import { AvatarTurntable } from "./renderer.js";

const reducedMotionQuery = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)");

export function liveAvatarOptions(anim, nowMs, options = {}) {
  const blinkPhase = (nowMs - anim.blinkStartMs) / 145;
  const blink = blinkPhase >= 0 && blinkPhase < 1 ? Math.sin(blinkPhase * Math.PI) : 0;
  const x = anim.x;
  return {
    ...sampleAvatarMotion(anim, nowMs, options),
    framing: options.framing,
    force: options.force,
    cameraTime: options.smoothFraming && !(options.reducedMotion ?? reducedMotionQuery?.matches) ? nowMs : undefined,
    blink: Math.max(blink, x.shut),
    wink: x.wink,
    viseme: {
      jaw: Math.max(0, anim.jaw - 0.045),
      lipRound: anim.lipR,
      lipSpread: anim.lipS,
      lipClose: anim.lipC,
      tongueTip: anim.tTip,
      tongueHeight: anim.tH,
      labiodental: anim.phone === "F" || anim.phone === "V",
    },
    expression: {
      smile: x.smile - x.frown,
      gazeX: anim.lookX,
      gazeY: anim.lookY,
      eyeWide: x.eyeWide,
      browLift: x.browUp,
      browSlope: x.browIn,
    },
  };
}

function drawFloorShadow(ctx, { x, y, rx, ry }) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(rx, ry);
  const shade = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  shade.addColorStop(0, "rgba(24, 20, 34, 0.29)");
  shade.addColorStop(0.45, "rgba(24, 20, 34, 0.18)");
  shade.addColorStop(1, "rgba(24, 20, 34, 0)");
  ctx.fillStyle = shade;
  ctx.fillRect(-1, -1, 2, 2);
  ctx.restore();
}

// Match the Canvas 2D stage path in CSS pixels so an arm can pass behind the
// same arch, card or circular frame as the painted backdrop.
function stageClip(shape, width, height, displayWidth) {
  const scale = displayWidth / width;
  const pad = 2 * scale;
  if (shape === "circle") return `circle(${Math.max(10, Math.min(width, height) / 2 - 2) * scale}px)`;
  if (shape === "card") return `inset(${pad}px round ${Math.min(26, width * 0.08) * scale}px)`;
  if (shape === "arch") {
    const radius = Math.max(0, (width - 4) / 2) * scale;
    const lower = 18 * scale;
    return `inset(${pad}px round ${radius}px ${radius}px ${lower}px ${lower}px)`;
  }
  return "none";
}

// The existing canvas remains the visible backdrop and the software fallback.
// Keeping the two layers in the DOM avoids reading pixels back from the GPU.
export class LiveAvatar {
  constructor(webglCanvas, fallbackCanvas, { orbitControls = false, view = "front" } = {}) {
    this.webglCanvas = webglCanvas;
    this.fallback = fallbackCanvas;
    this.ctx = fallbackCanvas.getContext("2d");
    this.turntable = new AvatarTurntable(webglCanvas, { orbitControls });
    this.setView(view);
  }

  get supported() {
    return this.turntable.supported;
  }

  setView(view) {
    this.turntable.setView(view);
  }

  rotateBy(yawRadians) {
    this.turntable.rotateBy(yawRadians);
  }

  render(avatar, anim, nowMs, options = {}) {
    const width = this.fallback.width, height = this.fallback.height;
    if (width < 5 || height < 5) return;
    const framing = options.framing ?? avatar.framing;
    const stage = options.transparent || framing !== avatar.framing
      ? { ...avatar, framing, bgStyle: options.transparent ? "transparent" : avatar.bgStyle }
      : avatar;
    const canvas = this.webglCanvas;
    const useWebGL = options.renderMode !== "2d" && this.supported;
    const visibility = useWebGL ? "visible" : "hidden";
    if (canvas.style.visibility !== visibility) canvas.style.visibility = visibility;
    if (!useWebGL) {
      this.backdropKey = null;
      drawBotAvatar(this.ctx, width, height, stage, anim, nowMs, options);
      return;
    }
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    const shape = framing === "cutout" ? "cutout" : stage.stageShape || "card";
    const displayWidth = this.fallback.clientWidth || width;
    const clipKey = [width, height, displayWidth, shape].join("/");
    if (this.clipKey !== clipKey) {
      canvas.style.clipPath = stageClip(shape, width, height, displayWidth);
      this.clipKey = clipKey;
    }
    this.turntable.render(avatar, liveAvatarOptions(anim, nowMs, { ...options, framing }));
    const paintedFloor = options.contactShadow ?? (stage.bgStyle !== "transparent");
    const shadow = paintedFloor && shape !== "cutout" && (framing === "full" || this.turntable.cameraMove)
      ? this.turntable.floorShadow() : null;
    const pulse = stage.haloGlow && stage.bgStyle !== "transparent" && shape !== "cutout"
      ? Math.round((anim.voicing * 0.28 + anim.energy * 0.18) * 32) : 0;
    const backdropKey = [clipKey, stage.bgStyle, stage.bgColor, stage.bgAccent, stage.haloGlow, pulse,
      shadow?.x, shadow?.y, shadow?.rx, shadow?.ry].join("/");
    if (this.backdropKey !== backdropKey || options.force) {
      this.ctx.clearRect(0, 0, width, height);
      this.ctx.save();
      applyStageClipAndBackdrop(this.ctx, width, height, stage, anim);
      if (shadow) drawFloorShadow(this.ctx, shadow);
      this.ctx.restore();
      this.backdropKey = backdropKey;
    }
  }

  dispose() {
    this.turntable.dispose();
  }
}
