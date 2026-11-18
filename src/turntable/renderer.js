// bot.computer · Copyright 2026 f2i.com · SPDX-License-Identifier: Apache-2.0
import { MeshBuilder } from "./geometry.js";
import { drawBody, measurements } from "./body.js";
import { drawHead, drawEyes, drawLips } from "./head.js";
import { Stance } from "./stance.js";
import { AvatarRig, HEAD_JOINT, JOINT_COUNT } from "./rig.js";

// Orthographic projection keeps facial proportions consistent around the turntable.
const vertexSource = `
attribute vec3 position, normal, pigment;
attribute float material;
attribute vec4 joints, weights;
uniform mat4 bones[${JOINT_COUNT}];
uniform bool moving;
uniform vec2 orbit, fit;
uniform vec2 outlineOffset;
uniform vec2 focus;
varying vec3 ink, surface;
varying vec2 weave;
varying float finish;
vec3 toView(vec3 p) {
  float c = cos(orbit.x), s = sin(orbit.x), cp = cos(orbit.y), sp = sin(orbit.y);
  float depth = p.x*s + p.z*c;
  return vec3(p.x*c - p.z*s, p.y*cp - depth*sp, p.y*sp + depth*cp);
}
void main() {
  vec3 world=position, direction=normal;
  if (moving) {
    mat4 skin=weights.x*bones[int(joints.x)]+weights.y*bones[int(joints.y)]
      +weights.z*bones[int(joints.z)]+weights.w*bones[int(joints.w)];
    world=(skin*vec4(position,1.)).xyz;
    // Blended rotations can shear at a flexed joint. The cofactor matrix is
    // proportional to the inverse transpose and preserves the surface normal.
    mat3 basis=mat3(skin);
    vec3 corrected=mat3(cross(basis[1],basis[2]),cross(basis[2],basis[0]),cross(basis[0],basis[1]))*normal;
    direction=dot(corrected,corrected)>.000001 ? normalize(corrected) : basis*normal;
  }
  vec3 point = toView(world - vec3(0., focus.y, 0.));
  point.x -= focus.x;
  surface = toView(direction);
  vec2 edge = surface.xy / max(length(surface.xy), .15);
  gl_Position = vec4(point.xy*fit + edge*outlineOffset, -point.z/18., 1.);
  ink = pigment;
  weave = position.xy;
  finish = material;
}`;

const fragmentSource = `
precision mediump float;
varying vec3 ink, surface;
varying vec2 weave;
varying float finish;
uniform bool outline;
uniform float clothDetail;
void main() {
  if (outline) {
    gl_FragColor = vec4(mix(vec3(.14,.09,.14),ink,.36),1.);
    return;
  }
  vec3 n = normalize(surface);
  if (!gl_FrontFacing) n = -n;
  float light = dot(n, vec3(-.43,.55,.71));
  // Retain a painted shadow edge over a continuous falloff. The broad key
  // describes the cheek and the narrower cool fill separates a dark sleeve.
  float lit = .77*smoothstep(-.48,.88,light) + .23*smoothstep(.04,.20,light);
  float highlight = smoothstep(.60,1.,light);
  vec3 shadow = ink * vec3(.71,.65,.76);
  vec3 color = mix(shadow,ink,lit) + highlight * (1.-ink)*vec3(.080,.073,.065);
  float fill = smoothstep(.25,.91,dot(n,vec3(.82,.35,-.44)));
  color += vec3(.043,.049,.069)*fill*(1.-ink);
  if (finish > .5 && finish < 1.5) {
    color *= 1. - clothDetail*.015*(1.-cos(weave.x*145.));
  } else if (finish > 1.5 && finish < 2.5) {
    float shine = smoothstep(.77,.88,dot(n,vec3(-.28,.31,.91)));
    color = mix(color,vec3(1.,.96,.98),shine*.27);
  } else if (finish > 2.5 && finish < 3.5) {
    color = mix(color*.92,vec3(.91,.82,.89),pow(1.-abs(n.z),3.)*.28);
  } else if (finish > 3.5 && finish < 4.5) {
    color *= 1. - clothDetail*.024*(1.-cos((weave.x+weave.y)*179.));
  } else if (finish > 4.5) {
    float sheen = smoothstep(.56,.95,dot(n,vec3(-.44,.62,.65)));
    color += vec3(.057,.048,.055)*sheen*(1.-ink);
  }
  float rim = 1. - smoothstep(.01,.13,abs(n.z));
  gl_FragColor = vec4(color*(1.-.20*rim),1.);
}`;

const angles = {
  front: 0,
  portrait: Math.PI / 11,
  "three-quarter": Math.PI / 4,
  profile: Math.PI / 2,
  right: Math.PI / 2,
  left: -Math.PI / 2,
  back: Math.PI,
};
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const speechStep = (value, steps) =>
  Number.isFinite(value) ? Math.round(clamp(value, 0, 1) * steps) / steps : 0;
const expressionStep = (value) => Number.isFinite(value) ? Math.round(clamp(value, -1, 1) * 8) / 8 : 0;

function createProgram(gl) {
  const program = gl.createProgram();
  const shaders = [];
  try {
    for (const [type, text] of [
      [gl.VERTEX_SHADER, vertexSource],
      [gl.FRAGMENT_SHADER, fragmentSource],
    ]) {
      const shader = gl.createShader(type);
      shaders.push(shader);
      gl.shaderSource(shader, text);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    return program;
  } catch (error) {
    gl.deleteProgram(program);
    throw error;
  } finally {
    for (const shader of shaders) gl.deleteShader(shader);
  }
}

export class AvatarTurntable {
  constructor(canvas, { orbitControls = true } = {}) {
    this.canvas = canvas;
    this.yaw = 0;
    this.pitch = 0;
    this.supported = false;
    this.listeners = new AbortController();
    const on = (name, listener) => canvas.addEventListener(name, listener, { signal: this.listeners.signal });
    this.gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      depth: true,
      stencil: true,
      premultipliedAlpha: true,
    });
    if (!this.gl) return;
    this.initialize();
    on("webglcontextlost", (e) => {
      e.preventDefault();
      this.supported = false;
    });
    on("webglcontextrestored", () => this.initialize());
    if (!orbitControls) return;
    on("pointerdown", (e) => {
      if (!e.isPrimary || e.button !== 0) return;
      this.drag = { id: e.pointerId, x: e.clientX, y: e.clientY };
      canvas.setPointerCapture(e.pointerId);
    });
    on("pointermove", (e) => {
      if (this.drag?.id !== e.pointerId) return;
      const factor = (Math.PI * 2) / Math.max(280, canvas.clientWidth);
      this.yaw -= (e.clientX - this.drag.x) * factor;
      this.pitch = clamp(this.pitch + (e.clientY - this.drag.y) * factor, -0.55, 0.55);
      this.drag.x = e.clientX;
      this.drag.y = e.clientY;
    });
    for (const event of ["pointerup", "pointercancel", "lostpointercapture"]) {
      on(event, (e) => {
        if (this.drag?.id === e.pointerId) this.drag = null;
      });
    }
  }

  initialize() {
    const gl = this.gl;
    try {
      this.program = createProgram(gl);
      this.attributes = ["position", "normal", "pigment", "material"].map((name) =>
        gl.getAttribLocation(this.program, name),
      );
      this.skinAttributes = ["joints", "weights"].map((name) => gl.getAttribLocation(this.program, name));
      this.uniforms = Object.fromEntries(
        [
          "orbit",
          "fit",
          "focus",
          "outline",
          "outlineOffset",
          "clothDetail",
          "moving",
          "bones[0]",
        ].map((name) => [name, gl.getUniformLocation(this.program, name)]),
      );
      this.hasStencil = gl.getParameter(gl.STENCIL_BITS) > 0;
      this.fixed = this.createLayer();
      this.eyes = this.createLayer();
      this.lips = this.createLayer();
      this.designKey = null;
      this.frameKey = null;
      this.supported = true;
    } catch (error) {
      console.warn("Avatar turntable initialization failed", error);
      this.supported = false;
    }
  }

  createLayer() {
    return { buffer: this.gl.createBuffer(), elements: this.gl.createBuffer(), count: 0, skin: null };
  }

  setView(view) {
    this.yaw = angles[view] ?? 0;
    this.pitch = 0;
    this.frameKey = null;
  }

  rotateBy(yawRadians) {
    if (Number.isFinite(yawRadians)) this.yaw += yawRadians;
  }

  // Project a model-space landmark into canvas pixels for the editor overlay.
  project(point) {
    if (!this.camera) return null;
    return this.projectWorld(this.stance.point(point));
  }

  projectWorld([x, y, z]) {
    const { focus, focusX, halfHeight } = this.camera;
    const cos = Math.cos(this.yaw),
      sin = Math.sin(this.yaw);
    const depth = x * sin + z * cos;
    const units = this.canvas.height / (2 * halfHeight);
    return {
      x: this.canvas.width / 2 + (x * cos - z * sin - focusX) * units,
      y: this.canvas.height / 2 - ((y - focus) * Math.cos(this.pitch) - depth * Math.sin(this.pitch)) * units,
    };
  }

  // The soles have been skinned and can move independently during a step.
  // Place the shadow on the stage floor under this pose, including after orbit.
  floorShadow() {
    const { palette, soles } = this.rig;
    let left = Infinity, right = -Infinity, ySum = 0;
    for (const { bone, at: [x, y, z] } of soles) {
      const k = bone * 16;
      const wx = palette[k] * x + palette[k + 4] * y + palette[k + 8] * z + palette[k + 12];
      const wz = palette[k + 2] * x + palette[k + 6] * y + palette[k + 10] * z + palette[k + 14];
      const point = this.projectWorld([wx, this.bounds.floor, wz]);
      left = Math.min(left, point.x);
      right = Math.max(right, point.x);
      ySum += point.y;
    }
    const units = this.canvas.height / (2 * this.camera.halfHeight);
    const rx = (right - left) * 0.5 + units * 0.46;
    return {
      x: Math.round((left + right) / 2),
      y: Math.round(ySum / soles.length),
      rx: Math.max(1, Math.round(rx)),
      ry: Math.max(1, Math.round(rx * (0.16 + 0.29 * Math.abs(Math.sin(this.pitch))))),
    };
  }

  upload(layer, builder, usage, skin = null) {
    const gl = this.gl;
    let data = new Float32Array(builder.data);
    const needsWideIndex = data.length / 10 > 65535;
    layer.indexed = !needsWideIndex || Boolean(gl.getExtension("OES_element_index_uint"));
    layer.count = builder.indices.length;
    if (layer.indexed) {
      const Index = needsWideIndex ? Uint32Array : Uint16Array;
      layer.indexType = needsWideIndex ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, layer.elements);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Index(builder.indices), usage);
    } else {
      const expanded = new Float32Array(layer.count * 10);
      builder.indices.forEach((vertex, i) => expanded.set(data.subarray(vertex * 10, vertex * 10 + 10), i * 10));
      data = expanded;
      if (skin) {
        const expandedSkin = new Float32Array(layer.count * 8);
        builder.indices.forEach((vertex, i) =>
          expandedSkin.set(skin.subarray(vertex * 8, vertex * 8 + 8), i * 8),
        );
        skin = expandedSkin;
      }
    }
    if (skin) {
      layer.skin ??= gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, layer.skin);
      gl.bufferData(gl.ARRAY_BUFFER, skin, gl.STATIC_DRAW);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, layer.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, usage);
  }

  render(
    avatar,
    {
      framing = "bust",
      mouthOpen,
      viseme,
      blink = 0,
      wink = 0,
      force = false,
      pose = null,
      movementSpace = false,
      presenting = false,
      pointingPan = 0,
      expression = {},
      cameraTime,
    } = {},
  ) {
    if (!this.supported || !this.canvas.width || !this.canvas.height) return;
    const gl = this.gl,
      width = this.canvas.width,
      height = this.canvas.height;
    // The studio mutates a single avatar object during continuous slider edits.
    const designKey = JSON.stringify(avatar);
    const changed = designKey !== this.designKey;
    // The illustrated avatars use a larger head relative to the shoulder span.
    // Carry that baseline through the mesh, its rig, the eyes and the camera.
    if (changed) this.modelDesign = { ...avatar, headScale: (avatar.headScale ?? 1) * 1.19 };
    const design = this.modelDesign;
    if (changed) {
      const model = new MeshBuilder();
      drawBody(model, design);
      model.finish = 0;
      model.scale = design.headScale;
      const headStart = model.data.length;
      model.markPart("head");
      drawHead(model, design);
      this.bounds = measurements(design);
      this.stance = new Stance(design, this.bounds);
      this.rig = new AvatarRig(design, this.bounds, this.stance);
      const weights = this.rig.bind(model);
      this.stance.apply(model);
      this.upload(this.fixed, model, gl.STATIC_DRAW, weights);
      this.bounds.top = -Infinity;
      this.bounds.radius = this.bounds.headRadius = 0;
      for (let i = 0; i < model.data.length; i += 10) {
        const radius = Math.hypot(model.data[i], model.data[i + 2]);
        this.bounds.radius = Math.max(this.bounds.radius, radius);
        if (i >= headStart) {
          this.bounds.top = Math.max(this.bounds.top, model.data[i + 1]);
          this.bounds.headRadius = Math.max(this.bounds.headRadius, radius);
        }
      }
      this.designKey = designKey;
    }
    const mouth = speechStep(mouthOpen ?? viseme?.jaw, 16);
    const articulation = {
      lipRound: speechStep(viseme?.lipRound, 12),
      lipSpread: speechStep(viseme?.lipSpread, 12),
      lipClose: speechStep(viseme?.lipClose, 16),
      tongueTip: speechStep(viseme?.tongueTip, 6),
      tongueHeight: speechStep(viseme?.tongueHeight, 6),
      labiodental: Boolean(viseme?.labiodental),
    };
    const smile = expressionStep(expression.smile);
    const mouthKey = [
      mouth,
      articulation.lipRound,
      articulation.lipSpread,
      articulation.lipClose,
      articulation.tongueTip,
      articulation.tongueHeight,
      articulation.labiodental,
      smile,
    ].join("/");
    const lids = Math.round(clamp(blink, 0, 1) * 12) / 12;
    const winkLid = Math.max(lids, Math.round(clamp(wink, 0, 1) * 12) / 12);
    const gazeX = expressionStep(expression.gazeX), gazeY = expressionStep(expression.gazeY);
    const browLift = expressionStep(expression.browLift), browSlope = expressionStep(expression.browSlope);
    const eyeWide = expressionStep(expression.eyeWide);
    const eyeKey = [lids, winkLid, gazeX, gazeY, browLift, browSlope, eyeWide].join("/");
    if (changed || mouthKey !== this.mouthKey) {
      const lips = new MeshBuilder();
      lips.scale = design.headScale;
      drawLips(lips, { ...design, restSmile: (design.restSmile ?? 0) + smile }, mouth, articulation);
      this.stance.apply(lips);
      this.upload(this.lips, lips, gl.DYNAMIC_DRAW);
      this.mouth = mouth;
      this.mouthKey = mouthKey;
    }
    if (changed || eyeKey !== this.eyeKey) {
      const eyes = new MeshBuilder();
      eyes.scale = design.headScale;
      drawEyes(eyes, {
        ...design, gazeX, gazeY, browLift,
        browMood: (design.browMood ?? 0) + browSlope,
        eyeOpen: (design.eyeOpen ?? 0) + eyeWide * 0.65,
      }, lids, winkLid);
      this.stance.apply(eyes);
      this.upload(this.eyes, eyes, gl.DYNAMIC_DRAW);
      this.eyeKey = eyeKey;
    }
    this.rig.update(pose);
    const frameKey = [
      width,
      height,
      this.yaw,
      this.pitch,
      framing,
      mouthKey,
      eyeKey,
      movementSpace,
      presenting,
      pointingPan,
      this.rig.key,
    ].join("/");
    if (!changed && !force && this.frameKey === frameKey && !this.cameraMove) return;
    this.frameKey = frameKey;
    const fullBody = framing === "full" || framing === "cutout";
    const stageSpace = movementSpace && fullBody;
    // Reserve the full reach once for animation so the camera stays still
    // throughout an overhead stretch. Account for long arms and large hands.
    const overhead = stageSpace || (fullBody && Math.max(pose?.leftArmLift || 0, pose?.rightArmLift || 0) > 110);
    const armTop = this.bounds.arm.root + 2.61 * this.bounds.arm.reach + 0.45 * (design.handSize ?? 1);
    const top = Math.max(this.bounds.top, overhead ? armTop : -Infinity) + 0.24 * design.headScale;
    const base = fullBody ? this.bounds.floor - (stageSpace ? 0.64 : 0.22)
      : framing === "half" ? this.bounds.shoulder - 1.95 * this.bounds.length : this.bounds.shoulder - 0.64;
    let focus = (top + base) / 2;
    const presentingWidth = presenting ? this.bounds.shoulders + 2.68 * this.bounds.arm.reach + 0.55 * (design.handSize ?? 1) : 0;
    // Leave the extra hand room on the target side. At phone size a centered
    // two-arm wingspan would spend much of the canvas on empty space.
    const pointing = framing === "half" && (pose?.leftPoint || pose?.rightPoint);
    let focusX = pointing ? pointingPan * 0.18 * presentingWidth : 0;
    const halfWidth = framing === "bust" || framing === "portrait"
      ? Math.max(0.84 * design.headScale, this.bounds.headRadius + 0.05)
      : Math.max(stageSpace ? 3.7 : 0, presentingWidth * (pointing ? 0.82 : 1), this.bounds.radius + 0.1);
    let halfHeight = Math.max((top - base) / 2, (halfWidth * height) / width);
    if (pointing) focus = Math.min(focus, Math.max(top, armTop) - 0.91 * halfHeight);
    const previous = this.camera;
    if (!Number.isFinite(cameraTime) || changed || force || previous?.width !== width || previous?.height !== height) {
      this.cameraMove = null;
    } else if (previous.targetFocus !== focus || previous.targetX !== focusX || previous.targetHeight !== halfHeight) {
      this.cameraMove = { start: cameraTime, focus: previous.focus, focusX: previous.focusX, halfHeight: previous.halfHeight };
    }
    const targetFocus = focus, targetX = focusX, targetHeight = halfHeight;
    if (this.cameraMove) {
      const t = clamp((cameraTime - this.cameraMove.start) / 360, 0, 1);
      const eased = t * t * (3 - 2 * t);
      focus = this.cameraMove.focus + (focus - this.cameraMove.focus) * eased;
      focusX = this.cameraMove.focusX + (focusX - this.cameraMove.focusX) * eased;
      halfHeight = this.cameraMove.halfHeight + (halfHeight - this.cameraMove.halfHeight) * eased;
      if (t === 1) this.cameraMove = null;
    }
    this.camera = { focus, focusX, halfHeight, targetFocus, targetX, targetHeight, width, height };
    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.useProgram(this.program);
    gl.uniform2f(this.uniforms.orbit, this.yaw, this.pitch);
    gl.uniform2f(this.uniforms.fit, height / (width * halfHeight), 1 / halfHeight);
    gl.uniform2f(this.uniforms.focus, focusX, focus);
    // Fade the fine woven stripes below two pixels per cycle to avoid
    // shimmering fabric when a small widget animates or the view pulls back.
    gl.uniform1f(this.uniforms.clothDetail, clamp((height / (2 * halfHeight) - 50) / 55, 0, 1));
    gl.uniform1i(this.uniforms.outline, 0);
    gl.uniform2f(this.uniforms.outlineOffset, 0, 0);
    if (this.hasStencil) {
      gl.enable(gl.STENCIL_TEST);
      gl.stencilFunc(gl.ALWAYS, 1, 0xff);
      gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
    }
    gl.uniform1i(this.uniforms.moving, this.rig.moving ? 1 : 0);
    if (this.rig.moving) gl.uniformMatrix4fv(this.uniforms["bones[0]"], false, this.rig.palette);
    for (const layer of [this.fixed, this.eyes, this.lips]) this.drawLayer(layer);
    // Ink only the outer contour. The stencil keeps narrow hair highlights,
    // face decals and overlapping garment panels from acquiring false edges.
    if (this.hasStencil) {
      const stroke = clamp(height / 570, 0.85, 2.4);
      gl.stencilFunc(gl.EQUAL, 0, 0xff);
      gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
      gl.uniform1i(this.uniforms.outline, 1);
      gl.uniform2f(this.uniforms.outlineOffset, (2 * stroke) / width, (2 * stroke) / height);
      this.drawLayer(this.fixed);
      gl.disable(gl.STENCIL_TEST);
    }
  }

  drawLayer(layer) {
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, layer.buffer);
    this.attributes.forEach((location, index) => {
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, index === 3 ? 1 : 3, gl.FLOAT, false, 40, index * 12);
    });
    if (layer.skin) {
      gl.bindBuffer(gl.ARRAY_BUFFER, layer.skin);
      this.skinAttributes.forEach((location, i) => {
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, 4, gl.FLOAT, false, 32, 16 * i);
      });
    } else {
      // Dynamic expression layers are rigid children of the head. Blinking or
      // changing a viseme never rebuilds or uploads skin weights.
      for (const location of this.skinAttributes) gl.disableVertexAttribArray(location);
      gl.vertexAttrib4f(this.skinAttributes[0], HEAD_JOINT, 0, 0, 0);
      gl.vertexAttrib4f(this.skinAttributes[1], 1, 0, 0, 0);
    }
    if (layer.indexed) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, layer.elements);
      gl.drawElements(gl.TRIANGLES, layer.count, layer.indexType, 0);
    } else gl.drawArrays(gl.TRIANGLES, 0, layer.count);
  }
  dispose() {
    if (this.listeners.signal.aborted) return;
    this.listeners.abort();
    if (this.program) {
      for (const layer of [this.fixed, this.eyes, this.lips]) {
        this.gl.deleteBuffer(layer.buffer);
        this.gl.deleteBuffer(layer.elements);
        if (layer.skin) this.gl.deleteBuffer(layer.skin);
      }
      this.gl.deleteProgram(this.program);
      this.program = null;
    }
    this.gl?.getExtension("WEBGL_lose_context")?.loseContext();
    this.supported = false;
  }
}
