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
  let playerCount = 4;

  /** Active play round (1–4). */
  let currentRound = 1;

  /** Round whose characters/scores are currently shown. */
  let viewingRound = 1;

  /** @type {Array<{ number: number, characters: Array|null, scores: Record<string, number|null> }>} */
  let rounds = [];

  let pendingAdvanceTo = null;
  let defaultColorOrder = [];

  const indicatorEl = document.getElementById("round-indicator");
  const confirmEl = document.getElementById("round-confirm");
  const scoreboardEl = document.getElementById("round-scoreboard");

  function createEmptyScores() {
    return Object.fromEntries(PLAYER_COLORS.map((color) => [color, null]));
  }

  function createRounds() {
    return Array.from({ length: TOTAL_ROUNDS }, (_, index) => ({
      number: index + 1,
      characters: null,
      scores: createEmptyScores(),
    }));
  }

  function getRound(roundNumber) {
    return rounds[roundNumber - 1] || null;
  }

  function activeColors() {
    return PLAYER_COLORS.slice(0, playerCount);
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

  function getRoundTotal(colorId) {
    return rounds.reduce((sum, round) => {
      const value = round.scores[colorId];
      return sum + (typeof value === "number" ? value : 0);
    }, 0);
  }

  function areRoundScoresComplete(roundNumber) {
    const round = getRound(roundNumber);
    if (!round) return false;
    return activeColors().every((color) => typeof round.scores[color] === "number");
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

  function ensureRoundDealt(roundNumber) {
    const round = getRound(roundNumber);
    if (!round) return;
    if (!round.characters) {
      dealRound(roundNumber);
    }
  }

  function renderIndicator() {
    if (!indicatorEl) return;

    indicatorEl.querySelectorAll("[data-round]").forEach((btn) => {
      const num = Number(btn.dataset.round);
      btn.classList.toggle("is-current", num === currentRound);
      btn.classList.toggle("is-viewing", num === viewingRound);
      btn.classList.toggle("is-past", num < currentRound);
      btn.classList.toggle("is-future", num > currentRound);
      btn.setAttribute("aria-current", num === viewingRound ? "true" : "false");
    });
  }

  function captureDefaultColorOrder() {
    const column = document.querySelector(".column--right");
    if (!column) return;
    defaultColorOrder = [...column.querySelectorAll(".box[data-color]")];
  }

  function restoreColorOrder() {
    const column = document.querySelector(".column--right");
    if (!column || !defaultColorOrder.length) return;
    defaultColorOrder.forEach((box) => column.appendChild(box));
  }

  function clearScoreOverlays() {
    document.querySelectorAll(".column--right .box__score").forEach((el) => {
      el.hidden = true;
      el.textContent = "";
    });
  }

  function showScoreOverlays(scores) {
    document.querySelectorAll(".column--right .box[data-color]").forEach((box) => {
      const color = box.dataset.color;
      const scoreEl = box.querySelector(".box__score");
      if (!scoreEl) return;

      if (!activeColors().includes(color)) {
        scoreEl.hidden = true;
        scoreEl.textContent = "";
        return;
      }

      const value = scores[color];
      if (typeof value === "number") {
        scoreEl.textContent = String(value);
        scoreEl.hidden = false;
      } else {
        scoreEl.textContent = "—";
        scoreEl.hidden = false;
      }
    });
  }

  function reorderColorsByStanding(scores) {
    const column = document.querySelector(".column--right");
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

  function renderScoreboard(roundNumber) {
    if (!scoreboardEl) return;

    const round = getRound(roundNumber);
    const reviewingPast = roundNumber < currentRound;

    if (!reviewingPast || !round) {
      scoreboardEl.hidden = true;
      scoreboardEl.replaceChildren();
      return;
    }

    const standings = activeColors()
      .map((color) => ({
        color,
        label: COLOR_LABELS[color],
        score: round.scores[color],
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

    if (roundNumber < currentRound) {
      reorderColorsByStanding(round.scores);
      showScoreOverlays(round.scores);
      renderScoreboard(roundNumber);
      document.body.classList.add("round-reviewing");
    } else {
      restoreColorOrder();
      clearScoreOverlays();
      renderScoreboard(roundNumber);
      document.body.classList.remove("round-reviewing");
    }
  }

  function openConfirm(targetRound) {
    pendingAdvanceTo = targetRound;
    if (!confirmEl) return;
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
    if (targetRound === viewingRound && targetRound === currentRound) return;

    // Past round — review characters + scores.
    if (targetRound < currentRound) {
      if (CharacterModule.isOpen()) CharacterModule.close();
      displayRound(targetRound);
      return;
    }

    // Current round — leave review mode if needed.
    if (targetRound === currentRound) {
      if (CharacterModule.isOpen()) CharacterModule.close();
      displayRound(currentRound);
      return;
    }

    // Future round — confirm if the active round still needs scores.
    if (isRoundIncomplete(currentRound)) {
      openConfirm(targetRound);
      return;
    }

    if (CharacterModule.isOpen()) CharacterModule.close();
    advanceToRound(targetRound);
  }

  function setPlayerCount(count) {
    const next = Math.max(MIN_PLAYERS, Math.min(MAX_PLAYERS, Number(count) || MIN_PLAYERS));
    playerCount = next;
    // Inactive colors keep null scores; no wipe of existing active scores.
    return playerCount;
  }

  function bindUi() {
    indicatorEl?.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-round]");
      if (!btn) return;
      requestRound(Number(btn.dataset.round));
    });

    confirmEl?.addEventListener("click", (event) => {
      if (event.target.closest("[data-round-confirm-no]")) {
        closeConfirm();
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

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && confirmEl && !confirmEl.hidden) {
        closeConfirm();
      }
    });
  }

  function init() {
    rounds = createRounds();
    currentRound = 1;
    viewingRound = 1;
    captureDefaultColorOrder();
    bindUi();
    dealRound(1);
    displayRound(1);
  }

  // Public API — score entry UI can call these later.
  return {
    init,
    TOTAL_ROUNDS,
    MIN_SCORE,
    MAX_SCORE,
    MIN_PLAYERS,
    MAX_PLAYERS,
    PLAYER_COLORS,
    get currentRound() {
      return currentRound;
    },
    get viewingRound() {
      return viewingRound;
    },
    get playerCount() {
      return playerCount;
    },
    setPlayerCount,
    setPlayerScore,
    getPlayerScore,
    getRoundTotal,
    areRoundScoresComplete,
    isRoundIncomplete,
    getRound,
    requestRound,
    /** Dev/placeholder: fill random scores for active players on a round. */
    fillPlaceholderScores(roundNumber = currentRound) {
      activeColors().forEach((color) => {
        setPlayerScore(
          roundNumber,
          color,
          Math.floor(Math.random() * (MAX_SCORE + 1))
        );
      });
      if (viewingRound === roundNumber && roundNumber < currentRound) {
        displayRound(roundNumber);
      }
    },
  };
})();

RoundModule.init();
