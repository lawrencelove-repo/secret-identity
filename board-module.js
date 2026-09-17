/**
 * Board module — physical-style scoring track with character card slots.
 * Opens as a full-viewport view (same control cluster as characters fullscreen).
 * Supports pan (drag), zoom (wheel / pinch), and 3-finger tilt on touch.
 */
const BoardModule = (() => {
  const TRACK_MAX = 30;
  const SLOT_COUNT = 8;
  const MAX_CUBES_PER_CELL = 8;
  const MIN_SCALE = 0.55;
  const MAX_SCALE = 5.5;
  const DEFAULT_TILT_X = 26;
  const DEFAULT_TILT_Y = -8;
  const MIN_TILT_X = -12;
  const MAX_TILT_X = 62;
  const MIN_TILT_Y = -48;
  const MAX_TILT_Y = 48;
  const PAN_CLICK_THRESHOLD = 6;
  const CUBE_FACES = ["front", "back", "right", "left", "top", "bottom"];

  const SECTION_COLORS = {
    yellow: { mid: "#e8c230", light: "#f2d85a", dark: "#c9a018" },
    green: { mid: "#3a9e48", light: "#56b862", dark: "#2a7a36" },
    blue: { mid: "#4ab0d4", light: "#6ec4e0", dark: "#2f8fad" },
    purple: { mid: "#7a3eb0", light: "#9658c8", dark: "#5a2a88" },
    pink: { mid: "#d84a8a", light: "#e86aa2", dark: "#b0306c" },
    red: { mid: "#e04830", light: "#f06850", dark: "#b83020" },
    black: { mid: "#1a1a1a", light: "#2a2a2a", dark: "#0c0c0c" },
  };

  /** Score → section color key (matches physical board blocks). */
  function colorKeyForScore(score) {
    if (score === 0 || score === 5 || score === 10 || score === 15 || score === 20 || score === 25 || score === 30) {
      return "black";
    }
    if (score >= 1 && score <= 4) return "yellow";
    if (score >= 6 && score <= 9) return "green";
    if (score >= 11 && score <= 14) return "blue";
    if (score >= 16 && score <= 19) return "purple";
    if (score >= 21 && score <= 24) return "pink";
    if (score >= 26 && score <= 29) return "red";
    return "black";
  }

  const root = document.getElementById("board-module");
  const stageEl = root?.querySelector(".board-module__stage");
  const canvasEl = root?.querySelector(".board-module__canvas");
  const assemblyEl = root?.querySelector(".board-module__assembly");
  const trackEl = document.getElementById("board-track");
  const cubesEl = document.getElementById("board-cubes");
  const toggle = document.getElementById("board-module-toggle");

  /** @type {Record<string, { score: number, index: number, cellCount: number, x: number, y: number, rot: number }>} */
  const cubeLayouts = {};

  let built = false;
  let scale = 1;
  let panX = 0;
  let panY = 0;
  let tiltX = DEFAULT_TILT_X;
  let tiltY = DEFAULT_TILT_Y;

  /** @type {{ pointerId: number, startX: number, startY: number, originPanX: number, originPanY: number, moved: boolean, card: Element|null, cube: Element|null } | null} */
  let drag = null;
  /** @type {{ distance: number, scale: number, idA: number, idB: number } | null} */
  let pinch = null;
  /** @type {{ startX: number, startY: number, originTiltX: number, originTiltY: number } | null} */
  let tiltGesture = null;
  let suppressCardClick = false;

  function isActive() {
    return document.body.classList.contains("board-module-open");
  }

  function syncToggleUi() {
    if (!toggle) return;
    const active = isActive();
    toggle.setAttribute("aria-pressed", active ? "true" : "false");
    toggle.setAttribute("aria-label", active ? "Close game board" : "Open game board");
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function applyPanZoom() {
    if (!canvasEl) return;
    canvasEl.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
  }

  function applyTilt() {
    if (!assemblyEl) return;
    assemblyEl.style.setProperty("--tilt-x", `${tiltX}deg`);
    assemblyEl.style.setProperty("--tilt-y", `${tiltY}deg`);
  }

  function applyTransform() {
    applyPanZoom();
    applyTilt();
  }

  function resetView() {
    scale = 1;
    panX = 0;
    panY = 0;
    tiltX = DEFAULT_TILT_X;
    tiltY = DEFAULT_TILT_Y;
    applyTransform();
  }

  function zoomAt(clientX, clientY, factor) {
    if (!stageEl) return;
    const rect = stageEl.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const next = clamp(scale * factor, MIN_SCALE, MAX_SCALE);
    if (next === scale) return;
    const ratio = next / scale;
    panX = x - ratio * (x - panX);
    panY = y - ratio * (y - panY);
    scale = next;
    applyPanZoom();
  }

  function touchCentroid(touches) {
    let x = 0;
    let y = 0;
    for (let i = 0; i < touches.length; i += 1) {
      x += touches[i].clientX;
      y += touches[i].clientY;
    }
    return { x: x / touches.length, y: y / touches.length };
  }

  function hashString(value) {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i += 1) {
      hash ^= value.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  /** Deterministic pseudo-random in [0, 1) from a seed string. */
  function rand(seed) {
    const x = Math.sin(hashString(seed)) * 10000;
    return x - Math.floor(x);
  }

  function randRange(seed, min, max) {
    return min + rand(seed) * (max - min);
  }

  function ensureTrack() {
    if (built || !trackEl) return;
    built = true;

    const left = document.createElement("div");
    left.className = "board-track__column board-track__column--left";
    left.setAttribute("aria-hidden", "true");

    // Left column: 0 at bottom → 14 at top
    for (let score = 14; score >= 0; score -= 1) {
      left.appendChild(makeCell(score, "horizontal"));
    }

    const bridge = document.createElement("div");
    bridge.className = "board-track__bridge";
    bridge.setAttribute("aria-hidden", "true");
    bridge.appendChild(makeCell(15, "bridge"));

    const right = document.createElement("div");
    right.className = "board-track__column board-track__column--right";
    right.setAttribute("aria-hidden", "true");

    // Right column: 16 at top → 30 at bottom
    for (let score = 16; score <= 30; score += 1) {
      right.appendChild(makeCell(score, "horizontal"));
    }

    trackEl.append(left, bridge, right);
  }

  function makeCell(score, orientation) {
    const key = colorKeyForScore(score);
    const colors = SECTION_COLORS[key];
    const cell = document.createElement("div");
    cell.className = `board-track__cell board-track__cell--${orientation} board-track__cell--${key}`;
    cell.dataset.score = String(score);
    cell.style.setProperty("--cell-mid", colors.mid);
    cell.style.setProperty("--cell-light", colors.light);
    cell.style.setProperty("--cell-dark", colors.dark);

    const label = document.createElement("span");
    label.className = "board-track__label";
    label.textContent = String(score);
    cell.appendChild(label);

    return cell;
  }

  function getCharacters() {
    if (typeof RoundModule === "undefined" || !RoundModule.gameStarted) return [];
    const round = RoundModule.getRound(RoundModule.viewingRound);
    return round?.characters || [];
  }

  function formatCardLabel(character) {
    if (!character) return "";
    return character.name || "";
  }

  function refreshCards() {
    if (!root) return;
    const characters = getCharacters();
    for (let slot = 1; slot <= SLOT_COUNT; slot += 1) {
      const card = root.querySelector(`[data-board-slot="${slot}"]`);
      if (!card) continue;
      const character = characters[slot - 1] || null;
      card._character = character;
      const label = formatCardLabel(character);
      card.querySelectorAll(".board-card__name").forEach((el) => {
        el.textContent = label;
      });
      card.classList.toggle("board-card--empty", !label);
      card.disabled = !character;
      card.setAttribute(
        "aria-label",
        label ? `Slot ${slot}: ${label}` : `Slot ${slot}: empty`
      );
    }
  }

  /**
   * Eight fixed seats in each score cell (2 rows × 4 columns), skipping the
   * dead-center so the printed number stays readable. Fractions of cell size.
   */
  const CELL_SLOT_FRACTIONS = [
    [-0.30, -0.22],
    [-0.30, 0.22],
    [-0.16, -0.18],
    [-0.16, 0.18],
    [0.16, -0.18],
    [0.16, 0.18],
    [0.30, -0.22],
    [0.30, 0.22],
  ];

  /** Seeded shuffle of slot indexes; first `count` are the occupied seats. */
  function pickSlotIndexes(count, seed) {
    const indexes = CELL_SLOT_FRACTIONS.map((_, i) => i);
    for (let i = indexes.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rand(`${seed}:slot:${i}`) * (i + 1));
      const tmp = indexes[i];
      indexes[i] = indexes[j];
      indexes[j] = tmp;
    }
    return indexes.slice(0, Math.min(count, MAX_CUBES_PER_CELL));
  }

  /**
   * Assign each cube in a cell a unique random slot (stable for color+score set).
   */
  function layoutsForCell(colorIds, score, cellWidth, cellHeight) {
    const seed = `v3:${score}:${colorIds.join(",")}`;
    const slotIndexes = pickSlotIndexes(colorIds.length, seed);
    const layouts = {};

    colorIds.forEach((colorId, index) => {
      const prior = cubeLayouts[colorId];
      if (
        prior &&
        prior.version === 3 &&
        prior.score === score &&
        prior.cellKey === seed &&
        prior.index === index
      ) {
        layouts[colorId] = prior;
        return;
      }

      const slot = CELL_SLOT_FRACTIONS[slotIndexes[index]];
      const seedBase = `${seed}:${colorId}`;
      const layout = {
        version: 3,
        score,
        cellKey: seed,
        index,
        x: slot[0] * cellWidth + randRange(`${seedBase}:x`, -cellWidth * 0.02, cellWidth * 0.02),
        y: slot[1] * cellHeight + randRange(`${seedBase}:y`, -cellHeight * 0.06, cellHeight * 0.06),
        rot: randRange(`${seedBase}:r`, -12, 12),
      };
      cubeLayouts[colorId] = layout;
      layouts[colorId] = layout;
    });

    return layouts;
  }

  function cubeSizePx() {
    const assembly = root?.querySelector(".board-module__assembly");
    const size = assembly?.getBoundingClientRect().width / (scale || 1) || 400;
    // Large enough that side faces read as real cubes under board tilt.
    return clamp(size * 0.028, 11, 22);
  }

  function refreshCubes() {
    if (!cubesEl || typeof RoundModule === "undefined") return;
    ensureTrack();

    const active = RoundModule.gameStarted ? RoundModule.activeColors() : [];
    const cumulative = RoundModule.gameStarted
      ? RoundModule.getCumulativeScoresThrough(RoundModule.viewingRound)
      : {};

    /** @type {Record<number, string[]>} */
    const byScore = {};
    active.forEach((colorId) => {
      const raw = cumulative[colorId];
      const score = Math.max(0, Math.min(TRACK_MAX, typeof raw === "number" ? raw : 0));
      if (!byScore[score]) byScore[score] = [];
      byScore[score].push(colorId);
    });

    cubesEl.replaceChildren();
    const size = cubeSizePx();

    Object.entries(byScore).forEach(([scoreStr, colors]) => {
      const score = Number(scoreStr);
      const cell = trackEl?.querySelector(`.board-track__cell[data-score="${score}"]`);
      if (!cell || !trackEl) return;

      const trackRect = trackEl.getBoundingClientRect();
      const cellRect = cell.getBoundingClientRect();
      if (!trackRect.width || !trackRect.height) return;

      // Undo parent scale so layout uses unscaled cell metrics.
      const cellW = cellRect.width / scale;
      const cellH = cellRect.height / scale;
      const layouts = layoutsForCell(colors, score, cellW, cellH);

      colors.forEach((colorId) => {
        const layout = layouts[colorId];
        const cube = document.createElement("div");
        cube.className = `board-cube board-cube--${colorId}`;
        cube.dataset.color = colorId;
        cube.setAttribute("role", "button");
        cube.tabIndex = 0;
        cube.title = `${RoundModule.getPlayerName(colorId)}: ${score}`;
        cube.setAttribute(
          "aria-label",
          `${RoundModule.getPlayerName(colorId)} at ${score} points. Open score.`
        );
        cube.style.setProperty("--cube-size", `${size}px`);
        // Lift by half-height so the cube sits on the track; small yaw shows side faces.
        cube.style.transform =
          `translate3d(${layout.x}px, ${layout.y}px, ${size * 0.5}px) ` +
          `rotateZ(${layout.rot}deg)`;

        CUBE_FACES.forEach((face) => {
          const faceEl = document.createElement("span");
          faceEl.className = `board-cube__face board-cube__face--${face}`;
          faceEl.setAttribute("aria-hidden", "true");
          cube.appendChild(faceEl);
        });

        const cx =
          ((cellRect.left + cellRect.width / 2 - trackRect.left) / trackRect.width) * 100;
        const cy =
          ((cellRect.top + cellRect.height / 2 - trackRect.top) / trackRect.height) * 100;
        cube.style.left = `${cx}%`;
        cube.style.top = `${cy}%`;
        cubesEl.appendChild(cube);
      });
    });
  }

  function refresh() {
    if (!root) return;
    ensureTrack();
    refreshCards();
    refreshCubes();
  }

  function openCharacterFromCard(card) {
    const character = card?._character;
    if (!character || typeof CharacterModule === "undefined") return;
    CharacterModule.open(character);
  }

  function openScoreFromCube(cube) {
    const colorId = cube?.dataset?.color;
    if (!colorId || typeof ScoreModule === "undefined") return;
    if (typeof RoundModule !== "undefined" && !RoundModule.activeColors().includes(colorId)) {
      return;
    }
    ScoreModule.open(colorId);
  }

  function cardFromEventTarget(target) {
    if (!(target instanceof Element)) return null;
    const card = target.closest("[data-board-slot]");
    return card && root?.contains(card) ? card : null;
  }

  function cubeFromEventTarget(target) {
    if (!(target instanceof Element)) return null;
    const cube = target.closest(".board-cube");
    return cube && root?.contains(cube) ? cube : null;
  }

  function hitFromPoint(clientX, clientY) {
    const stack = document.elementsFromPoint(clientX, clientY);
    let card = null;
    for (const el of stack) {
      const cube = cubeFromEventTarget(el);
      if (cube) return { cube, card: null };
      if (!card) card = cardFromEventTarget(el);
    }
    return { cube: null, card };
  }

  function setActive(active) {
    if (!root) return;
    const next = Boolean(active);
    if (next) {
      if (typeof CharactersFullscreen !== "undefined") {
        CharactersFullscreen.setActive(false);
      }
      ensureTrack();
      resetView();
      refresh();
      root.hidden = false;
      root.setAttribute("aria-hidden", "false");
      document.body.classList.add("board-module-open");
      requestAnimationFrame(() => {
        refreshCubes();
        requestAnimationFrame(refreshCubes);
      });
    } else {
      endDrag();
      pinch = null;
      tiltGesture = null;
      root.hidden = true;
      root.setAttribute("aria-hidden", "true");
      document.body.classList.remove("board-module-open");
      root.classList.remove("board-module--panning");
    }
    syncToggleUi();
  }

  function toggleMode() {
    setActive(!isActive());
  }

  function open() {
    setActive(true);
  }

  function close() {
    setActive(false);
  }

  function endDrag() {
    if (!drag) return;
    try {
      stageEl?.releasePointerCapture?.(drag.pointerId);
    } catch {
      /* ignore */
    }
    drag = null;
    root?.classList.remove("board-module--panning");
  }

  function pointerDistance(a, b) {
    const dx = a.clientX - b.clientX;
    const dy = a.clientY - b.clientY;
    return Math.hypot(dx, dy);
  }

  function onPointerDown(event) {
    if (!isActive() || !stageEl) return;
    if (event.button != null && event.button !== 0) return;
    if (pinch || tiltGesture) return;

    suppressCardClick = false;
    const fromTargetCube = cubeFromEventTarget(event.target);
    const fromTargetCard = cardFromEventTarget(event.target);
    const fromPoint = (!fromTargetCube && !fromTargetCard)
      ? hitFromPoint(event.clientX, event.clientY)
      : null;
    drag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originPanX: panX,
      originPanY: panY,
      moved: false,
      cube: fromTargetCube || fromPoint?.cube || null,
      card: fromTargetCube ? null : (fromTargetCard || fromPoint?.card || null),
    };
    // Delay capture until a pan starts so card/cube clicks still fire normally.
  }

  function onPointerMove(event) {
    if (!isActive()) return;

    if ((pinch || tiltGesture) && event.pointerType === "touch") {
      return;
    }

    if (!drag || event.pointerId !== drag.pointerId) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) >= PAN_CLICK_THRESHOLD) {
      drag.moved = true;
      root?.classList.add("board-module--panning");
      try {
        stageEl?.setPointerCapture?.(drag.pointerId);
      } catch {
        /* ignore */
      }
    }
    if (!drag.moved) return;

    panX = drag.originPanX + dx;
    panY = drag.originPanY + dy;
    applyPanZoom();
  }

  function onPointerUp(event) {
    if (!isActive()) return;

    if (pinch) {
      if (event.pointerId === pinch.idA || event.pointerId === pinch.idB) {
        pinch = null;
      }
      endDrag();
      return;
    }

    if (tiltGesture) {
      endDrag();
      return;
    }

    if (!drag || event.pointerId !== drag.pointerId) return;

    const hit = hitFromPoint(event.clientX, event.clientY);
    const cube = drag.cube || hit.cube;
    const card = cube ? null : (drag.card || hit.card);
    const shouldOpen = !drag.moved && (cube || card);
    if (drag.moved) suppressCardClick = true;
    endDrag();

    if (!shouldOpen) return;

    // Open immediately — pointer capture / touch often skips the follow-up click.
    if (cube) {
      openScoreFromCube(cube);
    } else {
      openCharacterFromCard(card);
    }
    suppressCardClick = true;
  }

  function onPointerCancel(event) {
    if (pinch && (event.pointerId === pinch.idA || event.pointerId === pinch.idB)) {
      pinch = null;
    }
    if (drag && event.pointerId === drag.pointerId) endDrag();
  }

  function onWheel(event) {
    if (!isActive()) return;
    event.preventDefault();
    const direction = event.deltaY > 0 ? -1 : 1;
    const factor = direction > 0 ? 1.08 : 1 / 1.08;
    zoomAt(event.clientX, event.clientY, factor);
  }

  /** Touch: 2-finger pinch zoom, 3-finger tilt. */
  function onTouchStart(event) {
    if (!isActive()) return;
    if (event.touches.length >= 3) {
      event.preventDefault();
      endDrag();
      pinch = null;
      const center = touchCentroid(event.touches);
      tiltGesture = {
        startX: center.x,
        startY: center.y,
        originTiltX: tiltX,
        originTiltY: tiltY,
      };
      root?.classList.add("board-module--panning");
      return;
    }
    if (event.touches.length === 2) {
      event.preventDefault();
      endDrag();
      tiltGesture = null;
      pinch = {
        distance: pointerDistance(event.touches[0], event.touches[1]),
        scale,
        idA: event.touches[0].identifier,
        idB: event.touches[1].identifier,
      };
      root?.classList.add("board-module--panning");
    }
  }

  function onTouchMove(event) {
    if (!isActive()) return;

    if (tiltGesture && event.touches.length >= 3) {
      event.preventDefault();
      const center = touchCentroid(event.touches);
      const dx = center.x - tiltGesture.startX;
      const dy = center.y - tiltGesture.startY;
      // Dragging down increases looking-down tilt; sideways yaws the board.
      tiltX = clamp(tiltGesture.originTiltX + dy * 0.18, MIN_TILT_X, MAX_TILT_X);
      tiltY = clamp(tiltGesture.originTiltY + dx * 0.16, MIN_TILT_Y, MAX_TILT_Y);
      applyTilt();
      return;
    }

    if (!pinch || event.touches.length < 2) return;
    event.preventDefault();
    const a = event.touches[0];
    const b = event.touches[1];
    const distance = pointerDistance(a, b);
    if (!pinch.distance) return;
    const midX = (a.clientX + b.clientX) / 2;
    const midY = (a.clientY + b.clientY) / 2;
    const next = clamp(pinch.scale * (distance / pinch.distance), MIN_SCALE, MAX_SCALE);
    const factor = next / scale;
    if (Math.abs(factor - 1) < 0.001) return;
    zoomAt(midX, midY, factor);
  }

  function onTouchEnd(event) {
    if (tiltGesture) {
      if (event.touches.length >= 3) return;
      if (event.touches.length === 2) {
        // Drop from tilt into pinch without jump.
        tiltGesture = null;
        pinch = {
          distance: pointerDistance(event.touches[0], event.touches[1]),
          scale,
          idA: event.touches[0].identifier,
          idB: event.touches[1].identifier,
        };
        return;
      }
      tiltGesture = null;
      root?.classList.remove("board-module--panning");
      return;
    }

    if (!pinch) return;
    if (event.touches.length < 2) {
      pinch = null;
      root?.classList.remove("board-module--panning");
    }
  }

  function bindViewport() {
    if (!stageEl || !root) return;
    stageEl.addEventListener("pointerdown", onPointerDown);
    stageEl.addEventListener("pointermove", onPointerMove);
    stageEl.addEventListener("pointerup", onPointerUp);
    stageEl.addEventListener("pointercancel", onPointerCancel);
    stageEl.addEventListener("wheel", onWheel, { passive: false });
    stageEl.addEventListener("touchstart", onTouchStart, { passive: false });
    stageEl.addEventListener("touchmove", onTouchMove, { passive: false });
    stageEl.addEventListener("touchend", onTouchEnd);
    stageEl.addEventListener("touchcancel", onTouchEnd);

    root.addEventListener("click", (event) => {
      const cube = event.target.closest?.(".board-cube");
      if (cube && root.contains(cube)) {
        if (suppressCardClick) {
          suppressCardClick = false;
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        openScoreFromCube(cube);
        return;
      }

      const card = event.target.closest?.("[data-board-slot]");
      if (!card || !root.contains(card)) return;
      if (suppressCardClick) {
        suppressCardClick = false;
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      openCharacterFromCard(card);
    });

    root.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const cube = event.target.closest?.(".board-cube");
      if (!cube || !root.contains(cube)) return;
      event.preventDefault();
      openScoreFromCube(cube);
    });
  }

  toggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleMode();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !isActive()) return;
    if (document.body.classList.contains("character-module-open")) return;
    if (document.body.classList.contains("score-module-open")) return;
    if (document.body.classList.contains("new-game-module-open")) return;
    if (document.body.classList.contains("settings-module-open")) return;
    if (document.body.classList.contains("winner-module-open")) return;
    if (document.body.classList.contains("character-edit-module-open")) return;
    const replaceConfirm = document.getElementById("character-replace-confirm");
    if (replaceConfirm && !replaceConfirm.hidden) return;
    setActive(false);
  });

  window.addEventListener("resize", () => {
    if (isActive()) refreshCubes();
  });

  bindViewport();
  applyTransform();
  syncToggleUi();

  return {
    isActive,
    setActive,
    toggleMode,
    open,
    close,
    refresh,
  };
})();
