/**
 * Round module — tracks the 4-round game flow, per-round characters,
 * and per-round / cumulative player scores (2–8 players, 0–14 pts each).
 */
const RoundModule = (() => {
  const TOTAL_ROUNDS = 4;
  const SLOT_COUNT = 8;
  const MIN_PLAYERS = 2;
  const MAX_PLAYERS = 8;
  const MIN_SCORE = 0;
  const MAX_SCORE = 14;

  /** Color ids aligned with the right-column boxes (top → bottom). */
  const PLAYER_COLORS = [
    "green",
    "red",
    "pink",
    "grey",
    "yellow",
    "white",
    "purple",
    "light-blue",
  ];

  const COLOR_LABELS = {
    green: "Green",
    red: "Red",
    pink: "Pink",
    grey: "Grey",
    yellow: "Yellow",
    white: "White",
    purple: "Purple",
    "light-blue": "Light blue",
  };

  /** Placeholder until a player-setup flow exists. */
  let playerCount = 8;

  /** Active seat colors for this game (any subset of PLAYER_COLORS, order preserved). */
  let activePlayerColors = [...PLAYER_COLORS];

  /** True after the first Start from the new-game module. */
  let gameStarted = false;

  /** Display names per color — defaults to the color label until custom entry exists. */
  let playerNames = Object.fromEntries(
    Object.entries(COLOR_LABELS).map(([color, label]) => [color, label])
  );

  /** Active play round (1–4). */
  let currentRound = 1;

  /** Round whose characters/scores are currently shown. */
  let viewingRound = 1;

  /** @type {Array<{ number: number, characters: Array|null, scores: Record<string, number|null>, marks: Record<string, string[]>, tabulated: Record<string, boolean> }>} */
  let rounds = [];

  let pendingAdvanceTo = null;
  let defaultColorOrder = [];
  /** Set only by round-indicator clicks; enables Round 4 summary after game end. */
  let summaryRoundFromClick = null;

  const indicatorEl = document.getElementById("round-indicator");
  const confirmEl = document.getElementById("round-confirm");
  const scoreboardEl = document.getElementById("round-scoreboard");

  function createEmptyScores() {
    return Object.fromEntries(PLAYER_COLORS.map((color) => [color, null]));
  }

  function createEmptyMarks() {
    return Object.fromEntries(PLAYER_COLORS.map((color) => [color, []]));
  }

  function createEmptyTabulated() {
    return Object.fromEntries(PLAYER_COLORS.map((color) => [color, false]));
  }

  function createRounds() {
    return Array.from({ length: TOTAL_ROUNDS }, (_, index) => ({
      number: index + 1,
      characters: null,
      scores: createEmptyScores(),
      marks: createEmptyMarks(),
      tabulated: createEmptyTabulated(),
    }));
  }

  function getRound(roundNumber) {
    return rounds[roundNumber - 1] || null;
  }

  function activeColors() {
    return [...activePlayerColors];
  }

  function getPlayersRack() {
    return (
      document.querySelector(".players-panel") ||
      document.querySelector(".column--right")
    );
  }

  function updateActivePlayerVisibility() {
    const column = getPlayersRack();
    if (!column) return;

    const boxes = [...column.querySelectorAll(".box[data-color]")];
    const byColor = Object.fromEntries(boxes.map((box) => [box.dataset.color, box]));
    const active = activePlayerColors;
    const activeSet = new Set(active);

    PLAYER_COLORS.forEach((color) => {
      const box = byColor[color];
      if (!box) return;
      const isActive = activeSet.has(color);
      box.hidden = !isActive;
      box.style.display = isActive ? "" : "none";
      if (!isActive) {
        box.classList.remove("is-tabulated");
        const badge = box.querySelector(".box__tabulated");
        const scoreEl = box.querySelector(".box__score");
        if (badge) badge.hidden = true;
        if (scoreEl) scoreEl.hidden = true;
      }
    });

    // Stack active colors in palette order, then inactive (hidden) after.
    active.forEach((color) => {
      if (byColor[color]) column.appendChild(byColor[color]);
    });
    PLAYER_COLORS.filter((color) => !activeSet.has(color)).forEach((color) => {
      if (byColor[color]) column.appendChild(byColor[color]);
    });

    defaultColorOrder = active.map((color) => byColor[color]).filter(Boolean);
  }

  /**
   * Set which colors are playing. Preserves PLAYER_COLORS order.
   * @param {string[]} colorIds
   */
  function setActivePlayers(colorIds) {
    const wanted = new Set(
      (colorIds || []).filter((color) => PLAYER_COLORS.includes(color))
    );
    activePlayerColors = PLAYER_COLORS.filter((color) => wanted.has(color));
    playerCount = activePlayerColors.length;
    updateActivePlayerVisibility();
    return playerCount;
  }

  function setPlayerCount(count) {
    const next = Math.max(MIN_PLAYERS, Math.min(MAX_PLAYERS, Number(count) || MIN_PLAYERS));
    activePlayerColors = PLAYER_COLORS.slice(0, next);
    playerCount = activePlayerColors.length;
    updateActivePlayerVisibility();
    return playerCount;
  }

  function getUsedCharacterNames(beforeRound = Infinity) {
    const names = [];
    for (const round of rounds) {
      if (round.number >= beforeRound) break;
      if (!round.characters) continue;
      for (const character of round.characters) {
        names.push(character.name);
      }
    }
    return names;
  }

  /**
   * Placeholder score helpers — wire to a score-entry UI later.
   * Points must be integers from 0–14 (or null to clear).
   */
  function setPlayerScore(roundNumber, colorId, points) {
    const round = getRound(roundNumber);
    if (!round) return false;
    if (!activeColors().includes(colorId)) return false;

    if (points === null || points === undefined) {
      round.scores[colorId] = null;
      return true;
    }

    const value = Number(points);
    if (!Number.isInteger(value) || value < MIN_SCORE || value > MAX_SCORE) {
      console.warn(`Score must be an integer ${MIN_SCORE}–${MAX_SCORE}.`);
      return false;
    }

    round.scores[colorId] = value;
    return true;
  }

  function getPlayerScore(roundNumber, colorId) {
    return getRound(roundNumber)?.scores[colorId] ?? null;
  }

  function getPlayerMarks(roundNumber, colorId) {
    const round = getRound(roundNumber);
    if (!round) return [];
    return [...(round.marks[colorId] || [])];
  }

  /**
   * Points this player received because other players marked them.
   * Not stored on their score — derived from everyone else's marks.
   */
  function getIncomingMarkPoints(roundNumber, colorId) {
    const round = getRound(roundNumber);
    if (!round || !activeColors().includes(colorId)) return 0;
    let count = 0;
    activeColors().forEach((other) => {
      if (other === colorId) return;
      if ((round.marks[other] || []).includes(colorId)) count += 1;
    });
    return count;
  }

  /**
   * Effective round points: own entered score + points from being marked.
   */
  function getEffectiveRoundScore(roundNumber, colorId) {
    const own = getPlayerScore(roundNumber, colorId);
    const ownPoints = typeof own === "number" ? own : 0;
    return ownPoints + getIncomingMarkPoints(roundNumber, colorId);
  }

  function adjustPlayerScore(roundNumber, colorId, delta) {
    if (!delta) return false;
    const current = getPlayerScore(roundNumber, colorId);
    const base = typeof current === "number" ? current : 0;
    const next = Math.max(MIN_SCORE, Math.min(MAX_SCORE, base + delta));
    return setPlayerScore(roundNumber, colorId, next);
  }

  /**
   * Commit a player's round score and opponent marks from the score module.
   * `points` are only what this player earned via their own mark selections.
   * Opponents' board totals still rise from being marked (computed, not written
   * into their score-module value).
   */
  function commitPlayerRoundScore(roundNumber, colorId, points, marks = []) {
    const round = getRound(roundNumber);
    if (!round || !activeColors().includes(colorId)) return false;

    const allowed = new Set(activeColors().filter((color) => color !== colorId));
    const nextMarks = [...new Set(marks.filter((mark) => allowed.has(mark)))];

    if (!setPlayerScore(roundNumber, colorId, points)) return false;
    round.marks[colorId] = nextMarks;
    round.tabulated[colorId] = true;
    persistGame();
    return true;
  }

  function clearPlayerRoundScore(roundNumber, colorId) {
    return commitPlayerRoundScore(roundNumber, colorId, 0, []);
  }

  function isPlayerTabulated(roundNumber, colorId) {
    return Boolean(getRound(roundNumber)?.tabulated[colorId]);
  }

  function refreshView() {
    displayRound(viewingRound);
  }

  function getRoundTotal(colorId) {
    return rounds.reduce((sum, round) => {
      return sum + getEffectiveRoundScore(round.number, colorId);
    }, 0);
  }

  /** Running totals from rounds 1 through `roundNumber` (inclusive). */
  function getCumulativeScoresThrough(roundNumber) {
    return Object.fromEntries(
      PLAYER_COLORS.map((color) => {
        let sum = 0;
        for (const round of rounds) {
          if (round.number > roundNumber) break;
          sum += getEffectiveRoundScore(round.number, color);
        }
        return [color, sum];
      })
    );
  }

  function areRoundScoresComplete(roundNumber) {
    const round = getRound(roundNumber);
    if (!round) return false;
    return activeColors().every((color) => round.tabulated[color] === true);
  }

  /** True if this round has started (characters dealt) but scores are incomplete. */
  function isRoundIncomplete(roundNumber) {
    const round = getRound(roundNumber);
    if (!round || !round.characters) return false;
    return !areRoundScoresComplete(roundNumber);
  }

  function dealRound(roundNumber) {
    const round = getRound(roundNumber);
    if (!round) return null;

    const excludeNames = getUsedCharacterNames(roundNumber);
    round.characters = dealCharacters(SLOT_COUNT, excludeNames);
    return round.characters;
  }

  /** True if any active player has a numeric score or is tabulated this round. */
  /** True if any active player has awarded points this round (own or incoming). */
  function roundHasAwardedPoints(roundNumber) {
    const round = getRound(roundNumber);
    if (!round) return false;
    return activeColors().some((color) => {
      if (round.tabulated[color] === true) return true;
      if (typeof round.scores[color] === "number") return true;
      return getIncomingMarkPoints(roundNumber, color) > 0;
    });
  }

  /**
   * Replace is only for the active (current) round while viewing it —
   * not past rounds under review.
   */
  function canReplaceCharacter() {
    return Boolean(
      gameStarted &&
        viewingRound === currentRound &&
        getRound(currentRound)?.characters
    );
  }

  /**
   * Swap the character in `slotNumber` (1–8) for a fresh pick.
   * @returns {{ ok: boolean, character?: object, needsConfirm?: boolean, error?: string }}
   */
  function replaceCharacter(slotNumber, options = {}) {
    if (!canReplaceCharacter()) {
      return { ok: false, error: "Characters can only be replaced on the current round." };
    }

    const round = getRound(currentRound);
    if (!round?.characters) {
      return { ok: false, error: "No characters dealt for this round." };
    }

    const hasPoints = roundHasAwardedPoints(currentRound);
    if (hasPoints && !options.confirmed) {
      return { ok: false, needsConfirm: true };
    }

    const index = round.characters.findIndex(
      (entry) => entry.number === Number(slotNumber)
    );
    if (index < 0) {
      return { ok: false, error: "Character slot not found." };
    }

    const remaining = round.characters.filter((_, i) => i !== index);
    const excludeNames = [
      ...getUsedCharacterNames(currentRound),
      ...remaining.map((entry) => entry.name),
    ];

    const categoryCounts = Object.create(null);
    remaining.forEach((entry) => {
      CharacterCatalog.categoriesOf(entry).forEach((category) => {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
    });

    let next = null;
    if (options.characterName) {
      const wanted = String(options.characterName).trim();
      const catalog = CharacterCatalog.listEnabled();
      const found = catalog.find((entry) => entry.name === wanted);
      if (!found) {
        return { ok: false, error: "Character not found or is disabled." };
      }
      if (excludeNames.includes(found.name)) {
        return { ok: false, error: "That character is already in use." };
      }
      next = found;
      CharacterHistory.record([found.name]);
    } else {
      next = pickReplacementCharacter({ excludeNames, categoryCounts });
    }

    if (!next) {
      return { ok: false, error: "No replacement character available." };
    }

    const slotCharacter = toSlotCharacter(next, Number(slotNumber));
    round.characters[index] = slotCharacter;
    displayRound(currentRound);
    return { ok: true, character: slotCharacter };
  }

  function ensureRoundDealt(roundNumber) {
    const round = getRound(roundNumber);
    if (!round) return;
    if (!round.characters) {
      dealRound(roundNumber);
    }
  }

  function renderIndicator() {
    document.querySelectorAll(".round-indicator").forEach((indicator) => {
      indicator.querySelectorAll("[data-round]").forEach((btn) => {
        const num = Number(btn.dataset.round);
        btn.classList.toggle("is-current", num === currentRound);
        btn.classList.toggle("is-viewing", num === viewingRound);
        btn.classList.toggle("is-past", num < currentRound);
        btn.classList.toggle("is-future", num > currentRound);
        btn.setAttribute("aria-current", num === viewingRound ? "true" : "false");
      });
    });
  }

  function captureDefaultColorOrder() {
    const column = getPlayersRack();
    if (!column) return;
    defaultColorOrder = [...column.querySelectorAll(".box[data-color]")];
  }

  function restoreColorOrder() {
    const column = getPlayersRack();
    if (!column || !defaultColorOrder.length) return;
    defaultColorOrder.forEach((box) => column.appendChild(box));
  }

  function clearScoreOverlays() {
    document.querySelectorAll(".column--right .box__score").forEach((el) => {
      el.hidden = true;
      const nameEl = el.querySelector(".box__player-name");
      const pointsEl = el.querySelector(".box__player-points");
      if (nameEl) nameEl.textContent = "";
      if (pointsEl) pointsEl.textContent = "";
    });
  }

  function getPlayerName(colorId) {
    const custom = playerNames[colorId];
    if (custom && String(custom).trim()) return String(custom).trim();
    return COLOR_LABELS[colorId] || colorId;
  }

  function setPlayerName(colorId, name) {
    if (!PLAYER_COLORS.includes(colorId)) return false;
    const trimmed = name == null ? "" : String(name).trim();
    playerNames[colorId] = trimmed || COLOR_LABELS[colorId];
    persistGame();
    refreshView();
    return true;
  }

  function updateTabulatedIndicators(roundNumber) {
    const round = getRound(roundNumber);

    document.querySelectorAll(".column--right .box[data-color]").forEach((box) => {
      const color = box.dataset.color;
      const badge = box.querySelector(".box__tabulated");
      const isActive = activeColors().includes(color);
      const isTabulated = Boolean(isActive && round?.tabulated[color]);

      box.classList.toggle("is-tabulated", isTabulated);
      if (badge) {
        badge.hidden = !isTabulated;
      }
    });
  }

  function showScoreOverlays(scores) {
    document.querySelectorAll(".column--right .box[data-color]").forEach((box) => {
      const color = box.dataset.color;
      const scoreEl = box.querySelector(".box__score");
      if (!scoreEl) return;

      const nameEl = scoreEl.querySelector(".box__player-name");
      const pointsEl = scoreEl.querySelector(".box__player-points");

      if (!activeColors().includes(color)) {
        scoreEl.hidden = true;
        if (nameEl) nameEl.textContent = "";
        if (pointsEl) pointsEl.textContent = "";
        return;
      }

      const value = scores[color];
      if (nameEl) nameEl.textContent = getPlayerName(color);
      if (pointsEl) {
        pointsEl.textContent =
          typeof value === "number" ? String(value) : "0";
      }
      scoreEl.hidden = false;
    });
  }

  function reorderColorsByStanding(scores) {
    const column = getPlayersRack();
    if (!column) return;

    const boxes = [...column.querySelectorAll(".box[data-color]")];
    boxes.sort((a, b) => {
      const colorA = a.dataset.color;
      const colorB = b.dataset.color;
      const activeA = activeColors().includes(colorA);
      const activeB = activeColors().includes(colorB);
      if (activeA !== activeB) return activeA ? -1 : 1;

      const scoreA = typeof scores[colorA] === "number" ? scores[colorA] : -1;
      const scoreB = typeof scores[colorB] === "number" ? scores[colorB] : -1;
      if (scoreB !== scoreA) return scoreB - scoreA;

      return PLAYER_COLORS.indexOf(colorA) - PLAYER_COLORS.indexOf(colorB);
    });
    boxes.forEach((box) => column.appendChild(box));
  }

  function hideScoreboard() {
    if (!scoreboardEl || scoreboardEl.hidden) return;
    scoreboardEl.hidden = true;
  }

  /**
   * Round summary for past rounds always; for Round 4 only after an explicit
   * indicator click once the game is complete (not on the post-winner board open).
   */
  function shouldShowRoundSummary(roundNumber) {
    if (roundNumber < currentRound) return true;
    return (
      isGameComplete() &&
      roundNumber === TOTAL_ROUNDS &&
      summaryRoundFromClick === TOTAL_ROUNDS
    );
  }

  function renderScoreboard(roundNumber) {
    if (!scoreboardEl) return;

    const round = getRound(roundNumber);
    if (!round || !shouldShowRoundSummary(roundNumber)) {
      scoreboardEl.hidden = true;
      scoreboardEl.replaceChildren();
      return;
    }

    const standings = activeColors()
      .map((color) => ({
        color,
        label: getPlayerName(color),
        score: getEffectiveRoundScore(roundNumber, color),
      }))
      .sort((a, b) => {
        const scoreA = typeof a.score === "number" ? a.score : -1;
        const scoreB = typeof b.score === "number" ? b.score : -1;
        return scoreB - scoreA;
      });

    scoreboardEl.replaceChildren();
    const title = document.createElement("div");
    title.className = "round-scoreboard__title";
    title.textContent = `Round ${roundNumber} scores`;
    scoreboardEl.appendChild(title);

    const list = document.createElement("ol");
    list.className = "round-scoreboard__list";

    standings.forEach((entry, index) => {
      const item = document.createElement("li");
      item.className = "round-scoreboard__item";
      item.dataset.color = entry.color;

      const rank = document.createElement("span");
      rank.className = "round-scoreboard__rank";
      rank.textContent = String(index + 1);

      const swatch = document.createElement("span");
      swatch.className = `round-scoreboard__swatch box--${entry.color}`;

      const name = document.createElement("span");
      name.className = "round-scoreboard__name";
      name.textContent = entry.label;

      const pts = document.createElement("span");
      pts.className = "round-scoreboard__pts";
      pts.textContent =
        typeof entry.score === "number" ? `${entry.score} pts` : "—";

      item.append(rank, swatch, name, pts);
      list.appendChild(item);
    });

    scoreboardEl.appendChild(list);
    scoreboardEl.hidden = false;
  }

  function displayRound(roundNumber) {
    const round = getRound(roundNumber);
    if (!round || !round.characters) return;

    viewingRound = roundNumber;
    applyCharactersToBoxes(round.characters);
    renderIndicator();

    // Boxes always show cumulative totals through the end of the selected round.
    // At game start (no scores yet), show color names with 0.
    const cumulative = getCumulativeScoresThrough(roundNumber);
    const hasScoredRounds = rounds.some(
      (entry) =>
        entry.number <= roundNumber &&
        activeColors().some((color) => typeof entry.scores[color] === "number")
    );

    if (hasScoredRounds) {
      reorderColorsByStanding(cumulative);
    } else {
      restoreColorOrder();
    }

    if (gameStarted) {
      showScoreOverlays(cumulative);
    } else {
      clearScoreOverlays();
    }

    updateTabulatedIndicators(roundNumber);

    if (shouldShowRoundSummary(roundNumber)) {
      renderScoreboard(roundNumber);
      document.body.classList.add("round-reviewing");
    } else {
      renderScoreboard(roundNumber);
      document.body.classList.remove("round-reviewing");
    }

    if (typeof BoardModule !== "undefined" && BoardModule.isActive()) {
      BoardModule.refresh();
    } else if (typeof BoardModule !== "undefined") {
      BoardModule.markScoresChanged();
    }

    if (gameStarted) persistGame();
  }

  function openConfirm(targetRound) {
    pendingAdvanceTo = targetRound;
    if (!confirmEl) return;
    const randomBtn = confirmEl.querySelector("[data-round-confirm-random]");
    if (randomBtn) {
      const allow =
        typeof AppSettings !== "undefined" && AppSettings.getAllowRandom();
      randomBtn.hidden = !allow;
    }
    confirmEl.hidden = false;
    confirmEl.setAttribute("aria-hidden", "false");
    document.body.classList.add("round-confirm-open");
    confirmEl.querySelector("[data-round-confirm-yes]")?.focus();
  }

  function closeConfirm() {
    pendingAdvanceTo = null;
    if (!confirmEl) return;
    confirmEl.hidden = true;
    confirmEl.setAttribute("aria-hidden", "true");
    document.body.classList.remove("round-confirm-open");
  }

  function advanceToRound(targetRound) {
    if (targetRound < 1 || targetRound > TOTAL_ROUNDS) return;
    if (targetRound <= currentRound) {
      displayRound(targetRound);
      return;
    }

    // Mark current as left behind; deal any skipped future rounds as well.
    for (let n = currentRound + 1; n <= targetRound; n += 1) {
      ensureRoundDealt(n);
    }

    currentRound = targetRound;
    displayRound(targetRound);
  }

  function requestRound(targetRound) {
    const clickingFinalSummary =
      isGameComplete() &&
      targetRound === TOTAL_ROUNDS &&
      viewingRound === TOTAL_ROUNDS &&
      currentRound === TOTAL_ROUNDS;

    if (
      targetRound === viewingRound &&
      targetRound === currentRound &&
      !clickingFinalSummary
    ) {
      return;
    }

    // Past round — review characters + scores.
    if (targetRound < currentRound) {
      if (CharacterModule.isOpen()) CharacterModule.close();
      summaryRoundFromClick = targetRound;
      displayRound(targetRound);
      return;
    }

    // Current round — leave review mode if needed (or show final-round summary).
    if (targetRound === currentRound) {
      if (CharacterModule.isOpen()) CharacterModule.close();
      summaryRoundFromClick =
        isGameComplete() && targetRound === TOTAL_ROUNDS ? TOTAL_ROUNDS : null;
      displayRound(currentRound);
      return;
    }

    // Future round — confirm if the active round still needs scores.
    summaryRoundFromClick = null;
    if (isRoundIncomplete(currentRound)) {
      openConfirm(targetRound);
      return;
    }

    if (CharacterModule.isOpen()) CharacterModule.close();
    advanceToRound(targetRound);
  }

  function fillPlaceholderScores(roundNumber = currentRound) {
    const round = getRound(roundNumber);
    if (!round) return;

    const colors = activeColors();

    // Clear everything — checkboxes only appear after a real calculation below.
    colors.forEach((color) => {
      round.marks[color] = [];
      round.tabulated[color] = false;
      round.scores[color] = null;
    });

    // Calculate each player in turn, same as opening the score module and hitting OK.
    colors.forEach((color) => {
      const others = colors.filter((entry) => entry !== color);
      const markCount = Math.floor(Math.random() * (others.length + 1));
      const picks = [...others];
      for (let i = picks.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [picks[i], picks[j]] = [picks[j], picks[i]];
      }
      const marks = picks.slice(0, markCount);
      const points = Math.min(MAX_SCORE, marks.length);

      commitPlayerRoundScore(roundNumber, color, points, marks);
    });

    if (viewingRound === roundNumber) {
      displayRound(roundNumber);
    }
    notifyGameCompleteIfNeeded();
  }

  function bindUi() {
    document.querySelectorAll(".round-indicator").forEach((indicator) => {
      indicator.addEventListener("click", (event) => {
        const btn = event.target.closest("[data-round]");
        if (!btn || !indicator.contains(btn)) return;
        requestRound(Number(btn.dataset.round));
      });
    });

    document.querySelector(".column--right")?.addEventListener("click", (event) => {
      const box = event.target.closest(".box[data-color]");
      if (!box) return;
      const colorId = box.dataset.color;
      if (!activeColors().includes(colorId)) return;
      if (typeof ScoreModule !== "undefined") {
        ScoreModule.open(colorId);
      }
    });

    confirmEl?.addEventListener("click", (event) => {
      if (event.target.closest("[data-round-confirm-no]")) {
        closeConfirm();
        return;
      }
      if (event.target.closest("[data-round-confirm-random]")) {
        const target = pendingAdvanceTo;
        const roundToScore = currentRound;
        fillPlaceholderScores(roundToScore);
        closeConfirm();
        if (target) advanceToRound(target);
        return;
      }
      if (event.target.closest("[data-round-confirm-yes]")) {
        const target = pendingAdvanceTo;
        closeConfirm();
        if (target) advanceToRound(target);
        return;
      }
      if (event.target.closest("[data-round-confirm-close]")) {
        closeConfirm();
      }
    });

    document.addEventListener("click", (event) => {
      if (!document.body.classList.contains("round-reviewing")) return;
      if (!scoreboardEl || scoreboardEl.hidden) return;
      // Keep summary visible when choosing another past round via the indicator
      if (event.target.closest("#round-indicator")) return;
      if (event.target.closest("#board-round-indicator")) return;
      if (event.target.closest("#board-module")) return;
      if (event.target.closest("#round-confirm")) return;
      if (event.target.closest("#score-module")) return;
      if (event.target.closest("#score-reset-confirm")) return;
      if (event.target.closest("#new-game-module")) return;
      if (event.target.closest("#new-game-confirm")) return;
      if (event.target.closest("#app-menu")) return;
      hideScoreboard();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && confirmEl && !confirmEl.hidden) {
        closeConfirm();
      }
    });
  }

  function init() {
    captureDefaultColorOrder();
    bindUi();
  }

  function resetPlayerNames() {
    playerNames = Object.fromEntries(
      Object.entries(COLOR_LABELS).map(([color, label]) => [color, label])
    );
  }

  let winnerAnnounced = false;

  function isGameComplete() {
    const finalRound = getRound(TOTAL_ROUNDS);
    return Boolean(finalRound?.characters) && areRoundScoresComplete(TOTAL_ROUNDS);
  }

  function getPodium() {
    const totals = getCumulativeScoresThrough(TOTAL_ROUNDS);
    const standings = activeColors()
      .map((color) => ({
        color,
        name: getPlayerName(color),
        score: typeof totals[color] === "number" ? totals[color] : 0,
      }))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return PLAYER_COLORS.indexOf(a.color) - PLAYER_COLORS.indexOf(b.color);
      });

    if (!standings.length) return { first: [], second: [] };

    const firstScore = standings[0].score;
    const first = standings.filter((entry) => entry.score === firstScore);
    const rest = standings.filter((entry) => entry.score < firstScore);
    if (!rest.length) return { first, second: [] };

    const secondScore = rest[0].score;
    const second = rest.filter((entry) => entry.score === secondScore);
    return { first, second };
  }

  /** @deprecated use getPodium().first */
  function getWinners() {
    return getPodium().first;
  }

  function notifyGameCompleteIfNeeded() {
    if (!isGameComplete() || winnerAnnounced) return false;
    presentCompletedGame();
    return true;
  }

  /** Open winner UI and celebrating board for a finished game (live or resumed). */
  function presentCompletedGame() {
    winnerAnnounced = true;
    // Board opens on Round 4 without a summary until the indicator is clicked.
    summaryRoundFromClick = null;
    hideScoreboard();
    document.body.classList.remove("round-reviewing");
    if (typeof CharactersFullscreen !== "undefined") {
      CharactersFullscreen.setActive(false);
    }
    const podium = getPodium();
    const winnerColors = (podium.first || []).map((entry) => entry.color);
    if (typeof BoardModule !== "undefined") {
      BoardModule.presentForWinner(winnerColors);
    }
    if (typeof WinnerModule !== "undefined") {
      WinnerModule.open(podium);
    }
    // Keep finished games saved until the player starts a new game.
    persistGame();
  }

  function hasActiveGame() {
    return gameStarted && !isGameComplete();
  }

  /**
   * Begin a fresh game at round 1 with the given player colors.
   * @param {string[]|number} colorIdsOrCount — selected color ids, or legacy count
   */
  function startNewGame(colorIdsOrCount) {
    if (typeof colorIdsOrCount === "number") {
      setPlayerCount(colorIdsOrCount);
    } else {
      setActivePlayers(colorIdsOrCount);
    }
    if (activePlayerColors.length < MIN_PLAYERS) return false;

    resetPlayerNames();
    rounds = createRounds();
    currentRound = 1;
    viewingRound = 1;
    gameStarted = true;
    pendingAdvanceTo = null;
    winnerAnnounced = false;
    summaryRoundFromClick = null;
    if (typeof WinnerModule !== "undefined") WinnerModule.close();
    if (typeof BoardModule !== "undefined") {
      BoardModule.clearCubeIdentity();
    }
    restoreColorOrder();
    updateActivePlayerVisibility();
    dealRound(1);
    displayRound(1);
    document.body.classList.remove("is-boot");
    document.body.classList.add("is-playing");
    const menuToggle = document.getElementById("app-menu-toggle");
    if (menuToggle) menuToggle.hidden = false;
    if (typeof CharactersFullscreen !== "undefined") {
      CharactersFullscreen.showToggle(true);
    }
    persistGame();
    return true;
  }

  function slotCharacterFromName(name, slotNumber) {
    if (!name) return null;
    let found = null;
    if (typeof CharacterCatalog !== "undefined" && CharacterCatalog.listEnabled) {
      found = CharacterCatalog.listEnabled().find((entry) => entry.name === name) || null;
    }
    if (!found && typeof CHARACTERS !== "undefined") {
      found = CHARACTERS.find((entry) => entry.name === name) || null;
    }
    if (found && typeof toSlotCharacter === "function") {
      return toSlotCharacter(found, slotNumber);
    }
    return {
      number: slotNumber,
      name: String(name),
      categories: [],
      category: null,
      description: null,
      longDescription: null,
    };
  }

  function serializeGame() {
    if (!gameStarted) return null;
    return {
      v: 1,
      gameStarted: true,
      colors: [...activePlayerColors],
      names: { ...playerNames },
      currentRound,
      viewingRound,
      winnerAnnounced: Boolean(winnerAnnounced),
      rounds: rounds.map((round) => ({
        number: round.number,
        characters: Array.isArray(round.characters)
          ? round.characters.map((entry) => (entry && entry.name ? entry.name : null))
          : null,
        scores: { ...round.scores },
        marks: Object.fromEntries(
          Object.entries(round.marks || {}).map(([color, list]) => [
            color,
            Array.isArray(list) ? [...list] : [],
          ])
        ),
        tabulated: { ...round.tabulated },
      })),
    };
  }

  function persistGame() {
    if (typeof GameProgress === "undefined") return;
    if (!gameStarted) {
      GameProgress.clear();
      return;
    }
    const snapshot = serializeGame();
    if (snapshot) GameProgress.save(snapshot);
  }

  function clearPersistedGame() {
    if (typeof GameProgress !== "undefined") GameProgress.clear();
  }

  function hasPersistedGame() {
    try {
      if (typeof GameProgress === "undefined") return false;
      const data = GameProgress.load();
      if (!data || !data.gameStarted) return false;
      const colors = Array.isArray(data.colors) ? data.colors : [];
      const valid = colors.filter((color) => PLAYER_COLORS.includes(color));
      return valid.length >= MIN_PLAYERS;
    } catch {
      return false;
    }
  }

  function restorePersistedGame() {
    if (typeof GameProgress === "undefined") return false;
    const data = GameProgress.load();
    if (!data || !data.gameStarted) return false;

    const colors = (Array.isArray(data.colors) ? data.colors : []).filter((color) =>
      PLAYER_COLORS.includes(color)
    );
    if (colors.length < MIN_PLAYERS) return false;

    setActivePlayers(colors);
    resetPlayerNames();
    if (data.names && typeof data.names === "object") {
      Object.keys(data.names).forEach((color) => {
        if (!PLAYER_COLORS.includes(color)) return;
        const label = String(data.names[color] || "").trim();
        if (label) playerNames[color] = label;
      });
    }

    rounds = createRounds();
    const savedRounds = Array.isArray(data.rounds) ? data.rounds : [];
    savedRounds.forEach((saved) => {
      const round = getRound(saved.number);
      if (!round) return;
      if (Array.isArray(saved.characters)) {
        round.characters = saved.characters.map((name, index) =>
          slotCharacterFromName(name, index + 1)
        );
      }
      if (saved.scores && typeof saved.scores === "object") {
        PLAYER_COLORS.forEach((color) => {
          const value = saved.scores[color];
          round.scores[color] =
            value === null || value === undefined
              ? null
              : Number.isInteger(Number(value))
                ? Number(value)
                : null;
        });
      }
      if (saved.marks && typeof saved.marks === "object") {
        PLAYER_COLORS.forEach((color) => {
          round.marks[color] = Array.isArray(saved.marks[color])
            ? [...saved.marks[color]]
            : [];
        });
      }
      if (saved.tabulated && typeof saved.tabulated === "object") {
        PLAYER_COLORS.forEach((color) => {
          round.tabulated[color] = Boolean(saved.tabulated[color]);
        });
      }
    });

    currentRound = Math.min(
      TOTAL_ROUNDS,
      Math.max(1, Number(data.currentRound) || 1)
    );
    viewingRound = Math.min(
      TOTAL_ROUNDS,
      Math.max(1, Number(data.viewingRound) || currentRound)
    );
    winnerAnnounced = Boolean(data.winnerAnnounced);
    summaryRoundFromClick = null;
    pendingAdvanceTo = null;
    gameStarted = true;

    if (typeof WinnerModule !== "undefined") WinnerModule.close();
    if (typeof BoardModule !== "undefined") {
      BoardModule.clearCubeIdentity();
      BoardModule.setActive(false);
    }

    // Ensure current round has characters if somehow missing.
    ensureRoundDealt(currentRound);
    if (!getRound(viewingRound)?.characters) {
      viewingRound = currentRound;
    }

    restoreColorOrder();
    updateActivePlayerVisibility();
    displayRound(viewingRound);

    document.body.classList.remove("is-boot");
    document.body.classList.add("is-playing");
    const menuToggle = document.getElementById("app-menu-toggle");
    if (menuToggle) menuToggle.hidden = false;
    if (typeof CharactersFullscreen !== "undefined") {
      CharactersFullscreen.showToggle(true);
    }

    persistGame();

    // Finished games stay saved until New Game; resume back into winner + board.
    if (isGameComplete()) {
      presentCompletedGame();
    }

    return true;
  }

  // Public API — score entry UI can call these later.
  return {
    init,
    startNewGame,
    hasActiveGame,
    hasPersistedGame,
    restorePersistedGame,
    clearPersistedGame,
    persistGame,
    isGameComplete,
    getWinners,
    getPodium,
    notifyGameCompleteIfNeeded,
    get gameStarted() {
      return gameStarted;
    },
    TOTAL_ROUNDS,
    MIN_SCORE,
    MAX_SCORE,
    MIN_PLAYERS,
    MAX_PLAYERS,
    PLAYER_COLORS,
    COLOR_LABELS,
    get currentRound() {
      return currentRound;
    },
    get viewingRound() {
      return viewingRound;
    },
    get playerCount() {
      return playerCount;
    },
    activeColors,
    setActivePlayers,
    setPlayerCount,
    getPlayerName,
    setPlayerName,
    setPlayerScore,
    getPlayerScore,
    getPlayerMarks,
    getIncomingMarkPoints,
    getEffectiveRoundScore,
    commitPlayerRoundScore,
    clearPlayerRoundScore,
    isPlayerTabulated,
    getRoundTotal,
    getCumulativeScoresThrough,
    areRoundScoresComplete,
    isRoundIncomplete,
    getRound,
    requestRound,
    refreshView,
    canReplaceCharacter,
    roundHasAwardedPoints,
    replaceCharacter,
    /** Dev/placeholder: fill random scores for active players on a round. */
    fillPlaceholderScores,
  };
})();
RoundModule.init();
