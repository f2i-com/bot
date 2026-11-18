// A showcase is scoped to one widget. Its outline lives in the widget's shadow
// tree, so inspecting a section never changes the host element's styles or events.
import { isShowcaseTarget } from "./aiml-engine.js";

const activeGuides = new Set();

function escapePageGuide(event) {
  if (event.key !== "Escape" || event.defaultPrevented || event.isComposing) return;
  // A control inside another widget or an open host editor handles its own keys.
  if (event.target.closest?.(".bot-computer-widget-host, dialog, [role=dialog], [popover], [aria-expanded=true], input, select, textarea, [contenteditable=true]")) return;
  const latest = Array.from(activeGuides).pop();
  if (latest) {
    latest();
    event.preventDefault();
  }
}
function intersect(a, b) {
  return { left: Math.max(a.left, b.left), top: Math.max(a.top, b.top),
    right: Math.min(a.right, b.right), bottom: Math.min(a.bottom, b.bottom) };
}

function viewportBounds() {
  const view = window.visualViewport;
  const left = view?.offsetLeft || 0, top = view?.offsetTop || 0;
  return { left, top, right: left + (view?.width || document.documentElement.clientWidth),
    bottom: top + (view?.height || document.documentElement.clientHeight) };
}

function clippingAncestors(target) {
  const clips = [];
  for (let node = target.parentElement; node && node !== document.body; node = node.parentElement) {
    const css = getComputedStyle(node);
    const x = css.overflowX !== "visible", y = css.overflowY !== "visible";
    if (x || y) clips.push({ node, x, y });
  }
  return clips;
}

function visibleTarget(rect, boundary, clips) {
  let result = intersect(rect, boundary);
  for (const { node, x, y } of clips) {
    const box = node.getBoundingClientRect();
    if (x) {
      result.left = Math.max(result.left, box.left);
      result.right = Math.min(result.right, box.right);
    }
    if (y) {
      result.top = Math.max(result.top, box.top);
      result.bottom = Math.min(result.bottom, box.bottom);
    }
  }
  return result;
}

function resolveTarget(scope, key) {
  if (!isShowcaseTarget(key)) return null;
  // Explicit marks take precedence over existing IDs. Responsive layouts may
  // have separate mobile and desktop copies of a mark.
  for (const attr of ["data-bot-showcase", "id"]) {
    for (const el of scope.querySelectorAll(`[${attr}="${key}"]`)) {
      if (!el.closest(".bot-computer-widget-host, [inert], [aria-hidden=true]") &&
          getComputedStyle(el).visibility === "visible") {
        const box = el.getBoundingClientRect();
        if (box.width > 0 && box.height > 0) return el;
      }
    }
  }
  return null;
}

function clamp(n, low, high) {
  return Math.max(low, Math.min(n, high));
}

// Score the four adjacent positions after fitting each to the viewport. A
// button stays clickable wherever there is room for the companion beside it.
function placeBeside(t, bounds, w, h) {
  const midX = (t.left + t.right) / 2, midY = (t.top + t.bottom) / 2;
  const gap = 12;
  const choices = [
    [t.right + gap, midY - h / 2], [t.left - gap - w, midY - h / 2],
    [midX - w / 2, t.bottom + gap], [midX - w / 2, t.top - gap - h],
  ];
  let best;
  for (const [left, top] of choices) {
    const x = clamp(left, bounds.left + 6, bounds.right - w - 6);
    const y = clamp(top, bounds.top + 6, bounds.bottom - h - 6);
    const overlap = Math.max(0, Math.min(x + w, t.right) - Math.max(x, t.left)) *
      Math.max(0, Math.min(y + h, t.bottom) - Math.max(y, t.top));
    const shift = Math.abs(left - x) + Math.abs(top - y);
    if (!best || overlap < best.overlap || (overlap === best.overlap && shift < best.shift)) {
      best = { x, y, overlap, shift };
    }
  }
  return best;
}

export function createPageShowcase({ root, stage, host, parent, position, anim, onModeChange, onReturn, onTourDepart, onTourStop, onTourEnd }) {
  const scoped = position === "contained";
  const scope = scoped ? parent : document;
  const layer = document.createElement("div");
  layer.className = "bc-guide-layer" + (scoped ? " is-contained" : "");
  layer.hidden = true;
  layer.setAttribute("aria-hidden", "true");
  const ring = document.createElement("div");
  ring.className = "bc-guide-ring";
  layer.append(ring);
  const shadow = host.shadowRoot;
  shadow.append(layer);
  const back = root.querySelector(".bc-guide-back");
  const reply = root.querySelector(".bc-guide-answer");
  const label = root.querySelector(".bc-guide-label");
  const progress = root.querySelector(".bc-tour-progress");
  const previousBtn = root.querySelector(".bc-tour-prev");
  const nextBtn = root.querySelector(".bc-tour-next");
  const finishBtn = root.querySelector(".bc-tour-finish");
  const gaze = { nx: 0, ny: 0, active: true };
  const slot = stage.parentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let target = null, key = "", clips = [], space = null, seen = false, started = 0;
  let targetParent = null, layoutKey = "";
  let tour = null, journey = null, scrolling = [];

  function bounds() {
    const view = viewportBounds();
    return scoped ? intersect(view, parent.getBoundingClientRect()) : view;
  }

  function end(focus = false) {
    if (tour) {
      stopTourScroll();
      tour.observer.disconnect();
      window.removeEventListener("resize", markStopsDirty);
      tour = null;
      clearTravel();
      anim.tourPointing = false;
      root.classList.remove("is-touring", "avatar-on-right");
      onTourEnd();
    }
    if (!target) return;
    target = null;
    key = "";
    activeGuides.delete(end);
    if (!activeGuides.size) document.removeEventListener("keydown", escapePageGuide);
    anim.guideDirection = null;
    if (space) {
      space.replaceWith(host);
      space = null;
    }
    root.classList.remove("is-guiding");
    onModeChange();
    root.style.removeProperty("--bc-guide-x");
    root.style.removeProperty("--bc-guide-y");
    root.style.removeProperty("--bc-guide-width");
    layer.hidden = true;
    if (focus) onReturn();
  }
  back.onclick = () => end(true);
  finishBtn.onclick = () => end(true);
  previousBtn.onclick = () => move(-1);
  nextBtn.onclick = () => move(1);
  root.addEventListener("keydown", event => {
    if (target && event.key === "Escape") {
      event.preventDefault();
      end(true);
    }
  });

  function markStopsDirty() {
    if (tour) tour.dirty = true;
  }

  function findStops() {
    const entries = [];
    tour.stops.forEach((stop, index) => {
      const element = resolveTarget(scope, stop.target);
      if (element) entries.push({ index, element });
    });
    tour.entries = entries;
    tour.dirty = false;
  }

  function syncNavigation() {
    const i = tour.entries.findIndex(entry => entry.index === tour.index);
    const caption = `Stop ${i + 1} of ${tour.entries.length}`;
    if (progress.textContent !== caption) progress.textContent = caption;
    const focused = shadow.activeElement;
    previousBtn.disabled = i <= 0;
    nextBtn.disabled = i + 1 >= tour.entries.length;
    if ((focused === nextBtn && nextBtn.disabled) || (focused === previousBtn && previousBtn.disabled)) {
      (nextBtn.disabled ? finishBtn : nextBtn).focus({ preventScroll: true });
    }
  }

  function clearTravel() {
    journey = null;
    anim.guideTravel = null;
    root.classList.remove("is-travelling");
    stage.tabIndex = 0;
    stage.removeAttribute("aria-disabled");
    stage.style.removeProperty("--bc-walk-x");
    stage.style.removeProperty("--bc-walk-y");
  }

  function stopTourScroll() {
    // An old native smooth scroll would otherwise carry a newly selected
    // (already visible) stop out of view, or continue after Finish.
    for (const node of scrolling) {
      node.scrollTo({ left: node.scrollLeft, top: node.scrollTop, behavior: "instant" });
    }
    scrolling = [];
  }

  function arrive(visible = true) {
    const stop = tour.stops[tour.index];
    const firstVisit = !tour.visited.has(tour.index);
    tour.visited.add(tour.index);
    label.textContent = (visible ? "Showing " : "About ") + journey.name;
    clearTravel();
    scrolling = [];
    anim.tourPointing = visible;
    onTourStop(stop, firstVisit);
  }

  function visit(entry, from = stage.getBoundingClientRect()) {
    const stop = tour.stops[entry.index];
    // Read the translated stage *before* changing destinations, including when
    // a visitor presses Back halfway through a stride.
    const now = performance.now();
    const facing = anim.guideTravel?.facing ?? anim.guideDirection?.x ?? 0;
    onTourDepart();
    journey = { x: from.left + from.width / 2, y: from.bottom, started: now,
      last: now, speed: 0, settledSince: now, name: "" };
    anim.guideTravel = { phase: "walk", elapsed: 0, facing, stride: 0, point: 0 };
    anim.guideDirection = null;
    anim.tourPointing = false;
    root.classList.add("is-travelling");
    stage.tabIndex = -1;
    stage.setAttribute("aria-disabled", "true");
    tour.index = entry.index;
    syncNavigation();
    show(entry.element, stop.target, stop.displayText);
    return stop;
  }

  function move(direction) {
    if (!tour) return;
    findStops();
    const candidates = tour.entries.filter(entry => direction * (entry.index - tour.index) > 0);
    const entry = direction > 0 ? candidates[0] : candidates.at(-1);
    if (entry) visit(entry);
    else refreshStops();
  }

  // Re-resolve live host elements when a route or responsive layout changes.
  // Replacing a section with another copy of the same target keeps its narration.
  function refreshStops() {
    if (tour.dirty) findStops();
    const current = tour.entries.find(entry => entry.index === tour.index);
    if (current) {
      syncNavigation();
      if (target !== current.element) show(current.element, key, reply.textContent);
    } else {
      const adjacent = tour.entries.find(entry => entry.index > tour.index) || tour.entries.at(-1);
      if (adjacent) visit(adjacent);
      else end(root.contains(shadow.activeElement));
    }
  }

  function startTour(stops, from = stage.getBoundingClientRect()) {
    if (target || tour) end();
    if (!stops?.length) return null;
    const observer = new MutationObserver(markStopsDirty);
    tour = { stops, entries: [], visited: new Set(), observer, index: -1, dirty: true };
    findStops();
    if (!tour.entries.length) {
      tour = null;
      return null;
    }
    observer.observe(scope, {
      subtree: true, childList: true, attributes: true,
      attributeFilter: ["data-bot-showcase", "id", "class", "style", "hidden", "aria-hidden", "inert", "open"],
    });
    window.addEventListener("resize", markStopsDirty);
    root.classList.add("is-touring");
    return visit(tour.entries[0], from);
  }

  // Translate only the live canvas. The caption and controls stay beside the
  // destination, and the slot is a stable landing point while the page scrolls.
  function advanceTravel(boundary, sx, sy, visible) {
    const j = journey, pose = anim.guideTravel, now = performance.now();
    const dt = Math.min(0.08, Math.max(0, now - j.last) / 1000);
    j.last = now;
    pose.elapsed = (now - j.started) / 1000;
    const landing = slot.getBoundingClientRect();
    const clampX = x => clamp(x, boundary.left + landing.width / 2, boundary.right - landing.width / 2);
    const clampY = y => clamp(y, boundary.top + landing.height, boundary.bottom);
    const goalX = landing.left + landing.width / 2, goalY = landing.bottom;
    j.x = clampX(j.x);
    j.y = clampY(j.y);
    if (reduceMotion.matches && visible) {
      arrive();
      return;
    }
    if (pose.phase === "walk") {
      // Walk toward the appropriate screen edge until a distant stop scrolls
      // into view, then follow its actual position without jumping.
      let destX = goalX, destY = goalY;
      if (!visible) {
        const targetBox = target.getBoundingClientRect();
        destX = clampX(targetBox.left + targetBox.width / 2);
        destY = clampY(targetBox.top + targetBox.height / 2);
      }
      // A smooth scroll can briefly bring the landing point to the walker's
      // feet while it is still moving. Finish the stride once it settles.
      if (j.goalX === undefined || Math.hypot(destX - j.goalX, destY - j.goalY) > 1.5) {
        j.settledSince = now;
        j.goalX = destX;
        j.goalY = destY;
      }
      const dx = destX - j.x, dy = destY - j.y, distance = Math.hypot(dx, dy);
      j.speed = Math.max(j.speed, clamp(distance / 0.78, 230, 1600));
      const step = Math.min(distance, dt * j.speed);
      if (distance > 1) {
        j.x += dx / distance * step;
        j.y += dy / distance * step;
        if (Math.abs(dx) > 2) pose.facing += (dx / distance - pose.facing) * Math.min(1, dt * 12);
      }
      pose.stride = Math.min(1, pose.elapsed / 0.12, distance / 18);
      if (visible && distance - step <= 1 && (now - j.settledSince >= 90 || pose.elapsed > 2)) {
        j.x = goalX;
        j.y = goalY;
        j.turnStart = now;
        j.turnFrom = pose.facing;
        pose.phase = "turn";
      }
    }
    if (pose.phase === "turn") {
      const t = clamp((now - j.turnStart) / 300, 0, 1);
      const eased = t * t * (3 - 2 * t);
      pose.stride = 0;
      pose.point = eased;
      pose.facing = j.turnFrom + (gaze.nx - j.turnFrom) * eased;
      j.x = goalX;
      j.y = goalY;
      if (t >= 1 && visible) {
        arrive();
        return;
      }
    }
    stage.style.setProperty("--bc-walk-x", ((j.x - goalX) * sx).toFixed(2) + "px");
    stage.style.setProperty("--bc-walk-y", ((j.y - goalY) * sy).toFixed(2) + "px");
  }

  function refresh() {
    if (tour?.dirty) refreshStops();
    if (!target) return null;
    const rect = target.getBoundingClientRect();
    if (!target.isConnected || !rect.width || !rect.height || getComputedStyle(target).visibility !== "visible" ||
        target.closest("[inert], [aria-hidden=true]") || (target.getAttribute("data-bot-showcase") !== key && target.id !== key) ||
        (scoped && !parent.contains(target))) {
      if (tour) {
        findStops();
        refreshStops();
      } else {
        start(key, reply.textContent);
      }
      return null;
    }
    if (targetParent !== target.parentElement) {
      targetParent = target.parentElement;
      clips = clippingAncestors(target);
    }
    const boundary = bounds();
    const anchor = layer.getBoundingClientRect();
    const sx = anchor.width ? layer.clientWidth / anchor.width : 1;
    const sy = anchor.height ? layer.clientHeight / anchor.height : 1;
    const t = visibleTarget(rect, boundary, clips);
    const visible = t.right > t.left && t.bottom > t.top;
    if (!visible && !tour && (seen || performance.now() - started > 2000)) {
      end(shadow.activeElement === back);
      return null;
    }
    ring.hidden = !visible;
    if (!visible) {
      // Keep navigation reachable when the visitor scrolls away and then turns
      // the phone or opens a keyboard. The tour only moves on at their request.
      if (tour && boundary.right > boundary.left && boundary.bottom > boundary.top) {
        const box = root.getBoundingClientRect();
        const x = clamp(box.left, boundary.left + 6, boundary.right - box.width - 6);
        const y = clamp(box.top, boundary.top + 6, boundary.bottom - box.height - 6);
        root.style.setProperty("--bc-guide-width", Math.max(1, boundary.right - boundary.left - 12) * sx + "px");
        if (Math.abs(x - box.left) > 1) root.style.setProperty("--bc-guide-x", (x - anchor.left) * sx + "px");
        if (Math.abs(y - box.top) > 1) root.style.setProperty("--bc-guide-y", (y - anchor.top) * sy + "px");
        layoutKey = "";
      }
      anim.guideDirection = null;
      anim.tourPointing = false;
      if (journey) {
        // A hidden carousel slide or a clipping ancestor may make a real DOM
        // target unreachable. Still deliver its explanation and navigation.
        if (reduceMotion.matches || performance.now() - started > 2000) arrive(false);
        else if (boundary.right > boundary.left && boundary.bottom > boundary.top) advanceTravel(boundary, sx, sy, false);
      }
      return null;
    }
    seen = true;
    const px = n => Math.round(n * 10) / 10 + "px";
    const box = root.getBoundingClientRect();
    const { x, y } = placeBeside(t, boundary, box.width, box.height);
    const geometry = [t.left, t.top, t.right, t.bottom, anchor.left, anchor.top, sx, sy, x, y, boundary.left, boundary.right].join("/");
    if (geometry !== layoutKey) {
      layoutKey = geometry;
      ring.style.left = px((t.left - anchor.left) * sx);
      ring.style.top = px((t.top - anchor.top) * sy);
      ring.style.width = px((t.right - t.left) * sx);
      ring.style.height = px((t.bottom - t.top) * sy);
      root.style.setProperty("--bc-guide-width", px(Math.max(1, boundary.right - boundary.left - 12) * sx));
      root.style.setProperty("--bc-guide-x", px((x - anchor.left) * sx));
      root.style.setProperty("--bc-guide-y", px((y - anchor.top) * sy));
      if (tour) root.classList.toggle("avatar-on-right", x + box.width <= t.left);
    }
    const avatar = (tour ? slot : stage).getBoundingClientRect();
    const dx = (t.left + t.right) / 2 - (avatar.left + avatar.width / 2);
    const dy = (t.top + t.bottom) / 2 - (avatar.top + avatar.height / 2);
    const length = Math.hypot(dx, dy) || 1;
    gaze.nx = dx / length;
    gaze.ny = dy / length;
    if (journey) advanceTravel(boundary, sx, sy, true);
    if (anim.guideTravel?.phase === "walk") {
      anim.guideDirection = null;
      return null;
    }
    if (tour && !journey) anim.tourPointing = true;
    anim.guideDirection ??= { x: 0, y: 0 };
    anim.guideDirection.x = gaze.nx;
    anim.guideDirection.y = gaze.ny;
    return gaze;
  }

  function start(targetKey, answer) {
    if (tour) end();
    const found = resolveTarget(scope, targetKey);
    if (!found) {
      end(shadow.activeElement === back);
      return false;
    }
    show(found, targetKey, answer);
    return true;
  }

  function show(found, targetKey, answer) {
    stopTourScroll();
    const previous = stage.getBoundingClientRect();
    const hadFocus = shadow.activeElement != null;
    const movingBetweenStops = target && tour;
    if (!target && position === "inline") {
      // Keep the author's inline layout stable and escape any clipped or
      // transformed ancestors for the duration of this visit.
      space = document.createElement("div");
      space.style.height = root.getBoundingClientRect().height + "px";
      host.before(space);
      document.body.append(host);
    }
    target = found;
    key = targetKey;
    targetParent = target.parentElement;
    layoutKey = "";
    activeGuides.delete(end);
    activeGuides.add(end);
    document.addEventListener("keydown", escapePageGuide);
    seen = false;
    started = performance.now();
    clips = clippingAncestors(target);
    const name = (target.getAttribute("aria-label") || target.querySelector("h1,h2,h3,h4,h5,h6")?.textContent ||
      (target.matches("button,a,label,summary,h1,h2,h3,h4,h5,h6") && target.textContent) || key).trim();
    if (journey) journey.name = name;
    label.textContent = (journey ? "Walking to " : "Showing ") + name;
    reply.textContent = answer;
    reply.scrollTop = 0;
    layer.hidden = false;
    ring.hidden = true;
    ring.style.borderRadius = getComputedStyle(target).borderRadius;
    const boundary = bounds(), anchor = layer.getBoundingClientRect();
    root.style.setProperty("--bc-guide-width", Math.max(1, boundary.right - boundary.left - 12) + "px");
    if (!movingBetweenStops) {
      root.style.setProperty("--bc-guide-x", clamp(previous.left, boundary.left + 6, boundary.right - 260) - anchor.left + "px");
      root.style.setProperty("--bc-guide-y", clamp(previous.top, boundary.top + 6, boundary.bottom - 110) - anchor.top + "px");
    }
    root.classList.remove("is-minimized");
    root.classList.add("is-guiding");
    onModeChange();
    if (hadFocus && !movingBetweenStops) {
      (tour ? (nextBtn.disabled ? finishBtn : nextBtn) : back).focus({ preventScroll: true });
    }
    const rect = target.getBoundingClientRect(), visible = visibleTarget(rect, boundary, clips);
    if (visible.left > rect.left || visible.top > rect.top || visible.right < rect.right || visible.bottom < rect.bottom) {
      const behavior = reduceMotion.matches ? "instant" : "smooth";
      if (scoped) {
        // scrollIntoView also moves the outer document. A contained preview
        // owns only its inner scrollports.
        for (const { node, x, y } of clips) {
          if (node !== parent && !parent.contains(node)) break;
          const area = node.getBoundingClientRect(), r = target.getBoundingClientRect();
          const dx = x && (r.left < area.left || r.right > area.right) ? r.left - area.left : 0;
          const dy = y && (r.top < area.top || r.bottom > area.bottom) ? r.top - area.top : 0;
          if (dx || dy) {
            if (tour && behavior === "smooth") scrolling.push(node);
            node.scrollBy({ left: dx, top: dy, behavior });
          }
        }
      } else {
        if (tour && behavior === "smooth") {
          scrolling = clips.map(clip => clip.node);
          if (document.scrollingElement) scrolling.push(document.scrollingElement);
        }
        target.scrollIntoView({ block: rect.height > (boundary.bottom - boundary.top) * 0.7 ? "start" : "center", inline: "nearest", behavior });
      }
    }
    refresh();
  }
  return { start, startTour, end, refresh, get currentStop() { return tour?.stops[tour.index]; } };
}
