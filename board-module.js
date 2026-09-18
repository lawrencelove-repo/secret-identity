/**
 * Board module — physical-style scoring track with character card slots.
 * Opens as a full-viewport view (same control cluster as characters fullscreen).
 * Supports pan (drag), zoom (wheel / pinch), and 3-finger tilt + azimuth on touch.
 */
const BoardModule = (() => {
  const TRACK_MAX = 30;
  const SLOT_COUNT = 8;
  const MAX_CUBES_PER_CELL = 8;
  const MIN_SCALE = 0.55;
  const MAX_SCALE = 5.5;
  const DEFAULT_TILT_X = 38;
  const DEFAULT_TILT_Y = -8;
  const DEFAULT_AZIMUTH = 0;
  const MIN_TILT_X = -85;
  const MAX_TILT_X = 85;
  const MIN_AZIMUTH = -180;
  const MAX_AZIMUTH = 180;
  const PAN_CLICK_THRESHOLD = 6;
  const TILT_SENSITIVITY = 0.4;
  const AZIMUTH_SENSITIVITY = 0.35;
  const HOP_MS = 450;
  const CELEBRATION_TILT_X = 30;
  const CELEBRATION_TILT_Y = -10;
  const CELEBRATION_SPIN_DEG_PER_SEC = 10;
  const CELEBRATION_IDLE_MS = 10000;
  const CELEBRATION_BURST_MS = 900;
  const FX_COLORS = ["#ffd54a", "#ff5a5a", "#7ec8ff", "#ffffff", "#ff9f43", "#c56cff", "#7dffb3"];
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
  const fxCanvas = document.getElementById("board-fx");
  const toggle = document.getElementById("board-module-toggle");

  let built = false;
  let scale = 1;
  let panX = 0;
  let panY = 0;
  let tiltX = DEFAULT_TILT_X;
  let tiltY = DEFAULT_TILT_Y;
  let azimuth = DEFAULT_AZIMUTH;

  /** @type {{ pointerId: number, startX: number, startY: number, originPanX: number, originPanY: number, moved: boolean, card: Element|null, cube: Element|null } | null} */
  let drag = null;
  /** @type {{ distance: number, scale: number, idA: number, idB: number } | null} */
  let pinch = null;
  /** @type {{ startX: number, startY: number, originTiltX: number, originAzimuth: number } | null} */
  let tiltGesture = null;
  /** @type {Record<string, number>} colorId → last rendered cumulative score */
  const cubeScoreByColor = {};
  /** @type {Record<string, number>} colorId → permanent seat index 0–7 */
  const cubeSeatByColor = {};
  /** @type {Record<string, number>} colorId → permanent azimuth degrees */
  const cubeAzimuthByColor = {};
  /** @type {ReturnType<typeof setInterval> | null} */
  let hopTimer = null;
  let hopGeneration = 0;
  /** True when Round scores changed while the board was closed. */
  let scoresDirty = false;

  let celebrationActive = false;
  let pendingCelebration = false;
  /** @type {string[]} */
  let celebrationColors = [];
  let celebrationAutoSpin = false;
  let celebrationLastActivity = 0;
  let celebrationRaf = 0;
  let celebrationLastTs = 0;
  let celebrationBurstAcc = 0;
  /** @type {Array<{ x: number, y: number, vx: number, vy: number, life: number, age: number, color: string, size: number }>} */
  let fxParticles = [];

  function isActive() {
    return document.body.classList.contains("board-module-open");
  }

  function setBoardOpenClass(open) {
    document.body.classList.toggle("board-module-open", open);
    document.documentElement.classList.toggle("board-module-open", open);
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
    // Tip first, then spin on the board's vertical axis so the "ground" stays
    // level (turntable), instead of orbiting in screen space.
    assemblyEl.style.transform =
      `rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${azimuth}deg)`;
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
    azimuth = DEFAULT_AZIMUTH;
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

  function threeFingerMidpoint(touches) {
    const x = (touches[0].clientX + touches[1].clientX + touches[2].clientX) / 3;
    const y = (touches[0].clientY + touches[1].clientY + touches[2].clientY) / 3;
    return { x, y };
  }

  function touchCentroid(touches) {
    let x = 0;
    let y = 0;
    for (let i = 0; i < touches.length; i += 1) {
      x += touches[i].clientX;
      y += touches[i].clientY;
    }
    const n = touches.length || 1;
    return { x: x / n, y: y / n };
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
   * Eight seats in a single file across the zone (px from center).
   * Leaves a small center gap so the score number stays readable.
   * Seat indexes 0–7 are stable for a cube's whole game.
   */
  function seatsForCell(cellWidth, cellHeight, cubeSize) {
    const half = cubeSize / 2 + cubeSize * 0.08;
    const fenceX = Math.max(cubeSize * 0.12, cellWidth * 0.03);
    const maxX = Math.max(0, cellWidth / 2 - fenceX - half);
    // 8 seats: 4 left of center, 4 right — skip dead center for the number.
    const left = [-maxX, -maxX * (5 / 7), -maxX * (3 / 7), -maxX * (1 / 7)];
    const right = [maxX * (1 / 7), maxX * (3 / 7), maxX * (5 / 7), maxX];
    return left.concat(right).map((x) => [x, 0]);
  }

  function shuffleIndexes(indexes, seed) {
    const list = indexes.slice();
    for (let i = list.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rand(`${seed}:${i}`) * (i + 1));
      const tmp = list[i];
      list[i] = list[j];
      list[j] = tmp;
    }
    return list;
  }

  function clearCubeIdentity() {
    Object.keys(cubeScoreByColor).forEach((key) => {
      delete cubeScoreByColor[key];
    });
    Object.keys(cubeSeatByColor).forEach((key) => {
      delete cubeSeatByColor[key];
    });
    Object.keys(cubeAzimuthByColor).forEach((key) => {
      delete cubeAzimuthByColor[key];
    });
    scoresDirty = false;
  }

  /** Call when Round scores/view change while the board is closed. */
  function markScoresChanged() {
    if (!isActive()) scoresDirty = true;
  }

  /** Drop seats for colors no longer on the board (full roster only). */
  function pruneInactiveSeats(activeColorIds) {
    const active = new Set(activeColorIds);
    Object.keys(cubeSeatByColor).forEach((colorId) => {
      if (!active.has(colorId)) {
        delete cubeSeatByColor[colorId];
        delete cubeAzimuthByColor[colorId];
      }
    });
  }

  /**
   * Assign each color a permanent seat (0–7) the first time it appears.
   * Seats stay fixed as the cube hops zone to zone — never reassigned mid-game.
   */
  function ensurePermanentSeats(colorIds) {
    const needed = colorIds.filter((colorId) => cubeSeatByColor[colorId] === undefined);
    if (!needed.length) return;

    const used = new Set(Object.values(cubeSeatByColor));
    const free = [0, 1, 2, 3, 4, 5, 6, 7].filter((seat) => !used.has(seat));
    const order = shuffleIndexes(free, `seats:${needed.slice().sort().join(",")}`);
    needed.forEach((colorId, index) => {
      cubeSeatByColor[colorId] = order[index] ?? index % MAX_CUBES_PER_CELL;
      cubeAzimuthByColor[colorId] = randRange(`${colorId}:az`, -10, 10);
    });
  }

  function layoutForColor(colorId, cellWidth, cellHeight, cubeSize) {
    const seatIndex = cubeSeatByColor[colorId] ?? 0;
    const seats = seatsForCell(cellWidth, cellHeight, cubeSize);
    const seat = seats[seatIndex] || [0, 0];
    const seedBase = `seat:${colorId}:${seatIndex}`;
    const jitterX = Math.min(cellWidth * 0.008, cubeSize * 0.08);
    const jitterY = Math.min(cellHeight * 0.04, cubeSize * 0.12);
    return {
      seatIndex,
      x: seat[0] + randRange(`${seedBase}:x`, -jitterX, jitterX),
      y: seat[1] + randRange(`${seedBase}:y`, -jitterY, jitterY),
      azimuth: cubeAzimuthByColor[colorId] ?? 0,
      cubeSize,
    };
  }

  /** Largest cube that still fits 8 in a single file across the zone. */
  function cubeSizeForCell(cellWidth, cellHeight) {
    const fenceX = cellWidth * 0.03;
    const gapFactor = 0.92; // small gutters between neighbors
    const byW = ((cellWidth - 2 * fenceX) / 8) * gapFactor;
    const byH = cellHeight * 0.62;
    return clamp(Math.min(byW, byH), 5, 16);
  }

  /**
   * One cube size for the whole board — based on a normal column cell, not the
   * wide bridge (15) zone, so cubes don't grow when they land on 15.
   */
  function standardCubeSize(zones) {
    const fromZones =
      (zones && (zones[1] || zones[0] || zones[14] || zones[16])) || null;
    if (fromZones?.width && fromZones?.height) {
      return cubeSizeForCell(fromZones.width, fromZones.height);
    }
    const refCell =
      trackEl?.querySelector('.board-track__cell[data-score="1"]') ||
      trackEl?.querySelector('.board-track__cell[data-score="0"]') ||
      trackEl?.querySelector('.board-track__cell:not([data-score="15"])');
    if (!refCell) return 12;
    const zone = measureZoneInCubesLayer(refCell);
    if (!zone.width || !zone.height) return 12;
    return cubeSizeForCell(zone.width, zone.height);
  }

  /**
   * Measure zone geometry in the cubes layer without board tilt/perspective
   * distorting getBoundingClientRect. Sync — browser won't paint mid-call.
   */
  function withFlatBoard(measureFn) {
    if (!assemblyEl) return measureFn();
    const sceneEl = root?.querySelector(".board-module__scene");
    const prevAssembly = assemblyEl.style.transform;
    const prevPerspective = sceneEl ? sceneEl.style.perspective : "";
    assemblyEl.style.transform = "rotateX(0deg) rotateY(0deg) rotateZ(0deg)";
    if (sceneEl) sceneEl.style.perspective = "none";
    void assemblyEl.offsetWidth;
    try {
      return measureFn();
    } finally {
      assemblyEl.style.transform =
        prevAssembly ||
        `rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${azimuth}deg)`;
      if (sceneEl) sceneEl.style.perspective = prevPerspective;
    }
  }

  /**
   * Zone box in cubesEl local pixels (cubes layer shares the track inset box).
   */
  function measureZoneInCubesLayer(cell) {
    return withFlatBoard(() => {
      const cellRect = cell.getBoundingClientRect();
      const layerRect = cubesEl.getBoundingClientRect();
      if (!layerRect.width || !layerRect.height) {
        return { cx: 0, cy: 0, width: 0, height: 0 };
      }
      const sx = cubesEl.clientWidth / layerRect.width;
      const sy = cubesEl.clientHeight / layerRect.height;
      return {
        cx: (cellRect.left + cellRect.width / 2 - layerRect.left) * sx,
        cy: (cellRect.top + cellRect.height / 2 - layerRect.top) * sy,
        width: cellRect.width * sx,
        height: cellRect.height * sy,
      };
    });
  }

  function clearBoardCubes() {
    trackEl?.querySelectorAll(".board-cube").forEach((cube) => cube.remove());
    cubesEl?.replaceChildren();
  }

  function stopHopAnimation() {
    if (hopTimer) {
      clearInterval(hopTimer);
      hopTimer = null;
    }
    hopGeneration += 1;
    cubesEl?.querySelectorAll(".board-cube__hop.is-hopping").forEach((el) => {
      el.classList.remove("is-hopping");
    });
    cubesEl?.querySelectorAll(".board-cube").forEach((cube) => {
      cube.classList.remove("board-cube--moving");
    });
  }

  function cubeHopEnabled() {
    return typeof AppSettings !== "undefined" && AppSettings.getAnimateCubeMoves();
  }

  function resizeFxCanvas() {
    if (!fxCanvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    fxCanvas.width = Math.max(1, Math.floor(w * dpr));
    fxCanvas.height = Math.max(1, Math.floor(h * dpr));
    fxCanvas.style.width = `${w}px`;
    fxCanvas.style.height = `${h}px`;
    const ctx = fxCanvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function clearFireworks() {
    fxParticles = [];
    if (!fxCanvas) return;
    const ctx = fxCanvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
    fxCanvas.classList.remove("is-active");
  }

  /** Fireworks only on the final round while celebrating a finished game. */
  function fireworksAllowed() {
    return Boolean(
      celebrationActive &&
        typeof RoundModule !== "undefined" &&
        RoundModule.viewingRound === RoundModule.TOTAL_ROUNDS
    );
  }

  function syncFireworksForViewingRound() {
    if (!celebrationActive) return;
    if (fireworksAllowed()) {
      fxCanvas?.classList.add("is-active");
      // Burst on the next celebration frame when returning to round 4.
      celebrationBurstAcc = CELEBRATION_BURST_MS;
      return;
    }
    fxParticles = [];
    if (!fxCanvas) return;
    const ctx = fxCanvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    fxCanvas.classList.remove("is-active");
  }

  function burstFireworksFromColor(colorId) {
    if (!fireworksAllowed()) return;
    const cube = cubesEl?.querySelector(`.board-cube--${colorId}`);
    if (!cube) return;
    const rect = cube.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const count = 26 + Math.floor(Math.random() * 10);
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 90 + Math.random() * 240;
      fxParticles.push({
        x: cx + (Math.random() - 0.5) * 8,
        y: cy + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 50,
        life: 0.55 + Math.random() * 0.85,
        age: 0,
        color: FX_COLORS[i % FX_COLORS.length],
        size: 1.6 + Math.random() * 3.2,
      });
    }
  }

  function updateFireworks(dt) {
    if (!fxCanvas || !celebrationActive) return;
    if (!fireworksAllowed()) {
      if (fxParticles.length || fxCanvas.classList.contains("is-active")) {
        syncFireworksForViewingRound();
      }
      return;
    }

    const ctx = fxCanvas.getContext("2d");
    if (!ctx) return;

    fxCanvas.classList.add("is-active");
    celebrationBurstAcc += dt * 1000;
    if (celebrationBurstAcc >= CELEBRATION_BURST_MS) {
      celebrationBurstAcc = 0;
      celebrationColors.forEach((colorId) => burstFireworksFromColor(colorId));
    }

    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    fxParticles = fxParticles.filter((p) => {
      p.age += dt;
      if (p.age >= p.life) return false;
      p.vy += 420 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      const t = 1 - p.age / p.life;
      ctx.globalAlpha = Math.max(0, t);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (0.55 + 0.45 * t), 0, Math.PI * 2);
      ctx.fill();
      return true;
    });
    ctx.globalAlpha = 1;
  }

  function noteCelebrationActivity() {
    if (!celebrationActive) return;
    celebrationAutoSpin = false;
    celebrationLastActivity = performance.now();
  }

  function celebrationFrame(ts) {
    if (!celebrationActive) return;
    const now = ts || performance.now();
    const dt = celebrationLastTs ? Math.min(0.05, (now - celebrationLastTs) / 1000) : 0.016;
    celebrationLastTs = now;

    if (!celebrationAutoSpin && now - celebrationLastActivity >= CELEBRATION_IDLE_MS) {
      celebrationAutoSpin = true;
    }

    if (celebrationAutoSpin) {
      azimuth += CELEBRATION_SPIN_DEG_PER_SEC * dt;
      applyTilt();
    }

    updateFireworks(dt);
    celebrationRaf = requestAnimationFrame(celebrationFrame);
  }

  function startCelebration(colorIds) {
    celebrationColors = (colorIds || []).filter(Boolean);
    if (!celebrationColors.length) return;

    celebrationActive = true;
    pendingCelebration = false;
    celebrationAutoSpin = true;
    celebrationLastActivity = performance.now();
    celebrationLastTs = 0;
    celebrationBurstAcc = CELEBRATION_BURST_MS;
    tiltX = CELEBRATION_TILT_X;
    tiltY = CELEBRATION_TILT_Y;
    applyTilt();

    resizeFxCanvas();
    fxCanvas?.classList.toggle("is-active", fireworksAllowed());
    fxParticles = [];
    if (fireworksAllowed()) {
      celebrationColors.forEach((colorId) => burstFireworksFromColor(colorId));
    }
    syncCubeTabulatedStates();

    if (celebrationRaf) cancelAnimationFrame(celebrationRaf);
    celebrationRaf = requestAnimationFrame(celebrationFrame);
    root?.classList.add("board-module--celebrating");
  }

  function stopCelebration() {
    pendingCelebration = false;
    celebrationActive = false;
    celebrationAutoSpin = false;
    celebrationColors = [];
    if (celebrationRaf) {
      cancelAnimationFrame(celebrationRaf);
      celebrationRaf = 0;
    }
    clearFireworks();
    root?.classList.remove("board-module--celebrating");
  }

  function maybeStartPendingCelebration() {
    if (!pendingCelebration || !isActive() || hopTimer) return;
    startCelebration(celebrationColors);
  }

  /**
   * Open the board behind the winner modal and begin spin + fireworks
   * once cubes are in their final seats.
   */
  function presentForWinner(colorIds) {
    celebrationColors = (colorIds || []).filter(Boolean);
    pendingCelebration = true;
    if (!isActive()) {
      setActive(true);
      return;
    }
    refreshCards();
    refreshCubes();
    maybeStartPendingCelebration();
  }

  function clampTrackScore(raw) {
    return Math.max(0, Math.min(TRACK_MAX, typeof raw === "number" ? raw : 0));
  }

  function isReviewingPastRound() {
    return Boolean(
      typeof RoundModule !== "undefined" &&
        RoundModule.gameStarted &&
        RoundModule.viewingRound < RoundModule.currentRound
    );
  }

  /** Cumulative seat scores through `roundNumber` (0 → everyone at 0). */
  function scoresThroughRound(roundNumber) {
    /** @type {Record<string, number>} */
    const scores = {};
    if (typeof RoundModule === "undefined" || !RoundModule.gameStarted) {
      return scores;
    }
    const cumulative =
      roundNumber < 1 ? {} : RoundModule.getCumulativeScoresThrough(roundNumber);
    RoundModule.activeColors().forEach((colorId) => {
      scores[colorId] = clampTrackScore(cumulative[colorId]);
    });
    return scores;
  }

  function groupColorsByScore(scoreMap) {
    /** @type {Record<number, string[]>} */
    const byScore = {};
    Object.entries(scoreMap).forEach(([colorId, score]) => {
      if (!byScore[score]) byScore[score] = [];
      byScore[score].push(colorId);
    });
    return byScore;
  }

  function formatCubeTitle(colorId, cumulativeScore) {
    const name = RoundModule.getPlayerName(colorId);
    if (isReviewingPastRound()) {
      const delta = RoundModule.getEffectiveRoundScore(
        RoundModule.viewingRound,
        colorId
      );
      return `${name}: +${delta} this round`;
    }
    return `${name}: ${cumulativeScore}`;
  }

  function formatCubeAria(colorId, cumulativeScore, tabulated) {
    const name = RoundModule.getPlayerName(colorId);
    if (isReviewingPastRound()) {
      const delta = RoundModule.getEffectiveRoundScore(
        RoundModule.viewingRound,
        colorId
      );
      return `${name} advanced +${delta} points in round ${RoundModule.viewingRound}${
        tabulated ? ", scored that round" : ""
      }.`;
    }
    return `${name} at ${cumulativeScore} points${
      tabulated ? ", scored this round" : ""
    }. Open score.`;
  }

  function shouldShowCubeTabulated(colorId) {
    if (typeof RoundModule === "undefined") return false;
    // No scored outline during past-round replay or after the game is finished.
    if (isReviewingPastRound()) return false;
    if (RoundModule.isGameComplete()) return false;
    return RoundModule.isPlayerTabulated(RoundModule.viewingRound, colorId);
  }

  function buildCubeElement(colorId, score, size, zone, layout) {
    const cube = document.createElement("div");
    cube.className = `board-cube board-cube--${colorId}`;
    cube.dataset.color = colorId;
    cube.dataset.score = String(score);
    cube.dataset.seat = String((layout.seatIndex ?? 0) + 1);
    cube.setAttribute("role", "button");
    cube.tabIndex = 0;
    cube.title = formatCubeTitle(colorId, score);
    const tabulated = shouldShowCubeTabulated(colorId);
    cube.classList.toggle("is-tabulated", tabulated);
    cube.setAttribute("aria-label", formatCubeAria(colorId, score, tabulated));
    cube.style.setProperty("--cube-size", `${size}px`);
    cube.style.left = `${zone.cx + layout.x}px`;
    cube.style.top = `${zone.cy + layout.y}px`;

    const hop = document.createElement("div");
    hop.className = "board-cube__hop";
    hop.setAttribute("aria-hidden", "true");

    const solid = document.createElement("div");
    solid.className = "board-cube__solid";
    solid.style.transform =
      `translateZ(${size / 2}px) rotateZ(${layout.azimuth}deg)`;

    CUBE_FACES.forEach((face) => {
      const faceEl = document.createElement("div");
      faceEl.className = `board-cube__face board-cube__face--${face}`;
      faceEl.setAttribute("aria-hidden", "true");
      solid.appendChild(faceEl);
    });

    hop.appendChild(solid);
    cube.appendChild(hop);
    return cube;
  }

  /** Sync white outline with which colors are tabulated for the current round. */
  function syncCubeTabulatedStates() {
    if (!cubesEl || typeof RoundModule === "undefined") return;
    cubesEl.querySelectorAll(".board-cube").forEach((cube) => {
      const colorId = cube.dataset.color;
      if (!colorId) return;
      cube.classList.toggle("is-tabulated", shouldShowCubeTabulated(colorId));
    });
  }

  function triggerHop(cube) {
    const hop = cube.querySelector(".board-cube__hop");
    if (!hop) return;
    hop.classList.remove("is-hopping");
    void hop.offsetWidth;
    hop.classList.add("is-hopping");
  }

  function measureAllZones() {
    /** @type {Record<number, { cx: number, cy: number, width: number, height: number }>} */
    const zones = {};
    for (let score = 0; score <= TRACK_MAX; score += 1) {
      const cell = trackEl?.querySelector(`.board-track__cell[data-score="${score}"]`);
      if (!cell) continue;
      const zone = measureZoneInCubesLayer(cell);
      if (zone.width && zone.height) zones[score] = zone;
    }
    return zones;
  }

  function rebuildCubesInstant(byScore) {
    clearBoardCubes();
    Object.keys(cubeScoreByColor).forEach((key) => {
      delete cubeScoreByColor[key];
    });

    const allColors = Object.values(byScore).flat();
    pruneInactiveSeats(allColors);
    ensurePermanentSeats(allColors);

    const size = standardCubeSize();

    Object.entries(byScore).forEach(([scoreStr, colors]) => {
      const score = Number(scoreStr);
      const cell = trackEl?.querySelector(`.board-track__cell[data-score="${score}"]`);
      if (!cell) return;

      const zone = measureZoneInCubesLayer(cell);
      if (!zone.width || !zone.height) return;

      colors.forEach((colorId) => {
        const layout = layoutForColor(colorId, zone.width, zone.height, size);
        const cube = buildCubeElement(colorId, score, size, zone, layout);
        cubesEl.appendChild(cube);
        cubeScoreByColor[colorId] = score;
      });
    });

    maybeStartPendingCelebration();
  }

  /**
   * Hop each moved cube zone-by-zone along its permanent seat, then settle.
   */
  function startHopAnimation(movers, finalByScore) {
    stopHopAnimation();
    const zones = measureAllZones();
    if (!Object.keys(zones).length) {
      rebuildCubesInstant(finalByScore);
      return;
    }

    ensurePermanentSeats(movers.map((mover) => mover.color));

    const size = standardCubeSize(zones);

    // Keep existing DOM cubes; ensure each mover exists.
    movers.forEach((mover) => {
      let cube = cubesEl?.querySelector(`.board-cube--${mover.color}`);
      const startZone = zones[mover.from] || zones[0];
      if (!startZone) return;
      const layout = layoutForColor(mover.color, startZone.width, startZone.height, size);
      if (!cube) {
        cube = buildCubeElement(mover.color, mover.from, size, startZone, layout);
        cubesEl.appendChild(cube);
      } else {
        cube.dataset.seat = String(layout.seatIndex + 1);
        cube.style.setProperty("--cube-size", `${size}px`);
        cube.style.left = `${startZone.cx + layout.x}px`;
        cube.style.top = `${startZone.cy + layout.y}px`;
      }
      cube.classList.add("board-cube--moving");
      cube.dataset.score = String(mover.from);
    });

    const gen = hopGeneration;
    const states = movers.map((mover) => ({
      color: mover.color,
      current: mover.from,
      target: mover.to,
      seatIndex: cubeSeatByColor[mover.color] ?? 0,
      el: cubesEl?.querySelector(`.board-cube--${mover.color}`) || null,
    }));

    const stepMovers = () => {
      if (gen !== hopGeneration) return false;

      let anyMoving = false;
      states.forEach((state) => {
        if (!state.el || state.current === state.target) return;
        anyMoving = true;
        state.current += state.current < state.target ? 1 : -1;
        const zone = zones[state.current];
        if (!zone) return;

        const layout = layoutForColor(state.color, zone.width, zone.height, size);
        state.el.style.setProperty("--cube-size", `${size}px`);
        state.el.dataset.score = String(state.current);
        state.el.dataset.seat = String(layout.seatIndex + 1);
        state.el.title = formatCubeTitle(state.color, state.current);
        state.el.setAttribute(
          "aria-label",
          formatCubeAria(
            state.color,
            state.current,
            shouldShowCubeTabulated(state.color)
          )
        );
        // Same seat number in every zone along the path.
        state.el.style.left = `${zone.cx + layout.x}px`;
        state.el.style.top = `${zone.cy + layout.y}px`;
        triggerHop(state.el);
        cubeScoreByColor[state.color] = state.current;
      });

      if (!anyMoving) {
        stopHopAnimation();
        rebuildCubesInstant(finalByScore);
        return false;
      }
      return true;
    };

    // First hop immediately, then continue on the interval cadence.
    if (stepMovers()) {
      hopTimer = setInterval(() => {
        if (!stepMovers()) return;
      }, HOP_MS);
    }
  }

  function refreshCubes(options = {}) {
    if (!cubesEl || !trackEl || typeof RoundModule === "undefined") return;
    // Interrupt an in-flight hop so a new viewing-round target can animate.
    if (hopTimer) {
      stopHopAnimation();
    }
    ensureTrack();

    const active = RoundModule.gameStarted ? RoundModule.activeColors() : [];
    const viewing = RoundModule.viewingRound;
    const reviewing = isReviewingPastRound();
    const endScores = scoresThroughRound(RoundModule.gameStarted ? viewing : 0);
    const byScoreEnd = groupColorsByScore(endScores);

    const scoreModalOpen = document.body.classList.contains("score-module-open");
    const hopsAllowed =
      cubeHopEnabled() && isActive() && !scoreModalOpen;

    // Past-round replay: always start at end of prior round, then hop forward.
    if (reviewing) {
      scoresDirty = false;
      const startScores = scoresThroughRound(viewing - 1);
      const byScoreStart = groupColorsByScore(startScores);

      if (hopsAllowed) {
        rebuildCubesInstant(byScoreStart);
        /** @type {Array<{ color: string, from: number, to: number }>} */
        const movers = [];
        active.forEach((colorId) => {
          const from = startScores[colorId] ?? 0;
          const to = endScores[colorId] ?? 0;
          if (from !== to) movers.push({ color: colorId, from, to });
        });
        if (movers.length) {
          startHopAnimation(movers, byScoreEnd);
          return;
        }
      }

      stopHopAnimation();
      rebuildCubesInstant(byScoreEnd);
      return;
    }

    // Live / current round: hop from last-known seats when scores change.
    const allowHop = options.fromOpen ? scoresDirty : true;
    const canAnimate =
      allowHop && hopsAllowed && Object.keys(cubeScoreByColor).length > 0;

    /** @type {Array<{ color: string, from: number, to: number }>} */
    const movers = [];
    if (canAnimate) {
      active.forEach((colorId) => {
        const from = cubeScoreByColor[colorId];
        const to = endScores[colorId];
        if (typeof from === "number" && from !== to) {
          movers.push({ color: colorId, from, to });
        }
      });
    }

    scoresDirty = false;

    if (movers.length) {
      startHopAnimation(movers, byScoreEnd);
      return;
    }

    stopHopAnimation();
    rebuildCubesInstant(byScoreEnd);
  }

  function refresh() {
    if (!root) return;
    ensureTrack();
    refreshCards();
    refreshCubes();
    syncFireworksForViewingRound();
  }

  function openCharacterFromCard(card) {
    if (celebrationActive || document.body.classList.contains("winner-module-open")) {
      return;
    }
    const character = card?._character;
    if (!character || typeof CharacterModule === "undefined") return;
    CharacterModule.open(character);
  }

  function openScoreFromCube(cube) {
    if (celebrationActive || document.body.classList.contains("winner-module-open")) {
      return;
    }
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
    // Keep the board visible while the winner dialog is up.
    if (!next && document.body.classList.contains("winner-module-open")) {
      return;
    }
    if (next) {
      if (typeof CharactersFullscreen !== "undefined") {
        CharactersFullscreen.setActive(false);
      }
      ensureTrack();
      resetView();
      // Open first so refreshCubes can animate hops from last-known seats.
      root.hidden = false;
      root.setAttribute("aria-hidden", "false");
      setBoardOpenClass(true);
      syncToggleUi();
      refreshCards();
      // Wait two frames so layout/zone measures are valid after becoming visible.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!isActive()) return;
          refreshCubes({ fromOpen: true });
        });
      });
    } else {
      stopCelebration();
      stopHopAnimation();
      // Keep seats + last-known scores so a later open can hop from them.
      // If a hop was interrupted, snap stored scores to each cube's current zone.
      cubesEl?.querySelectorAll(".board-cube").forEach((cube) => {
        const colorId = cube.dataset.color;
        const score = Number(cube.dataset.score);
        if (colorId && Number.isFinite(score)) {
          cubeScoreByColor[colorId] = score;
        }
      });
      endDrag();
      pinch = null;
      tiltGesture = null;
      root.hidden = true;
      root.setAttribute("aria-hidden", "true");
      setBoardOpenClass(false);
      root.classList.remove("board-module--panning");
      syncToggleUi();
    }
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
    noteCelebrationActivity();

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

    noteCelebrationActivity();
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
    noteCelebrationActivity();
    const direction = event.deltaY > 0 ? -1 : 1;
    const factor = direction > 0 ? 1.08 : 1 / 1.08;
    zoomAt(event.clientX, event.clientY, factor);
  }

  /** Touch: 2-finger pinch zoom; 3-finger tilt (vertical) + azimuth (horizontal). */
  function onTouchStart(event) {
    if (!isActive()) return;
    if (event.touches.length === 3) {
      event.preventDefault();
      noteCelebrationActivity();
      endDrag();
      pinch = null;
      const midpoint = threeFingerMidpoint(event.touches);
      tiltGesture = {
        startX: midpoint.x,
        startY: midpoint.y,
        originTiltX: tiltX,
        originAzimuth: azimuth,
      };
      root?.classList.add("board-module--panning");
      return;
    }
    if (event.touches.length > 3) {
      tiltGesture = null;
    }
    if (event.touches.length === 2) {
      event.preventDefault();
      noteCelebrationActivity();
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

    if (tiltGesture && event.touches.length === 3) {
      event.preventDefault();
      noteCelebrationActivity();
      const midpoint = threeFingerMidpoint(event.touches);
      const dx = midpoint.x - tiltGesture.startX;
      const dy = midpoint.y - tiltGesture.startY;
      // Horizontal → spin board (azimuth). Left swipe → clockwise.
      azimuth = clamp(
        tiltGesture.originAzimuth - dx * AZIMUTH_SENSITIVITY,
        MIN_AZIMUTH,
        MAX_AZIMUTH
      );
      tiltX = clamp(
        tiltGesture.originTiltX - dy * TILT_SENSITIVITY,
        MIN_TILT_X,
        MAX_TILT_X
      );
      applyTilt();
      return;
    }

    if (!pinch || event.touches.length < 2) return;
    event.preventDefault();
    noteCelebrationActivity();
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
    if (celebrationActive) resizeFxCanvas();
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
    markScoresChanged,
    clearCubeIdentity,
    presentForWinner,
    stopCelebration,
  };
})();
