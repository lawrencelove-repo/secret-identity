/**
 * Score module — per-player round scoring UI.
 * Toggle other players' colors to add/remove points for the selected player.
 * Inline name editing with explicit Done / Cancel (touch- and desktop-friendly).
 */
const ScoreModule = (() => {
  const root = document.getElementById("score-module");
  const heroEl = document.getElementById("score-module-hero");
  const nameWrapEl = document.getElementById("score-module-name-wrap");
  const nameEl = document.getElementById("score-module-player-name");
  const nameEditEl = document.getElementById("score-module-name-edit");
  const nameInputEl = document.getElementById("score-module-name-input");
  const pointsEl = document.getElementById("score-module-points");
  const marksEl = document.getElementById("score-module-marks");
  const othersEl = document.getElementById("score-module-others");
  const resetConfirmEl = document.getElementById("score-reset-confirm");

  let previouslyFocused = null;
  let selectedColor = null;
  let roundNumber = 1;
  let draftScore = 0;
  /** @type {Set<string>} insertion order = left → right (newest on the right) */
  let draftMarks = new Set();
  let editingName = false;
  let nameEditOriginal = "";

  function isOpen() {
    return Boolean(root && !root.hidden);
  }

  function defaultNameFor(colorId) {
    return RoundModule.COLOR_LABELS[colorId] || colorId;
  }

  function renderPoints() {
    if (pointsEl) pointsEl.textContent = String(draftScore);
  }

  function renderHero() {
    if (!heroEl || !selectedColor) return;
    const playerName = RoundModule.getPlayerName(selectedColor);
    heroEl.className = `score-module__hero box--${selectedColor}`;
    heroEl.dataset.color = selectedColor;
    if (nameEl && !editingName) nameEl.textContent = playerName;
    heroEl.setAttribute(
      "aria-label",
      `${playerName} — ${draftScore} points`
    );
  }

  function renderMarks() {
    if (!marksEl) return;
    marksEl.replaceChildren();

    [...draftMarks].forEach((color) => {
      const key = document.createElement("span");
      key.className = `score-module__mark-key box--${color}`;
      key.setAttribute("aria-hidden", "true");
      key.title = RoundModule.getPlayerName(color);
      marksEl.appendChild(key);
    });
  }

  function renderOthers() {
    if (!othersEl || !selectedColor) return;
    othersEl.replaceChildren();

    RoundModule.activeColors()
      .filter((color) => color !== selectedColor)
      .forEach((color) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `score-module__other box--${color}`;
        btn.dataset.scoreMark = color;
        btn.setAttribute("aria-label", RoundModule.getPlayerName(color));
        btn.setAttribute("aria-pressed", draftMarks.has(color) ? "true" : "false");
        if (draftMarks.has(color)) {
          btn.classList.add("is-marked");
        }
        othersEl.appendChild(btn);
      });
  }

  function render() {
    renderHero();
    renderPoints();
    renderMarks();
    renderOthers();
  }

  function setNameEditMode(enabled) {
    editingName = enabled;
    nameWrapEl?.classList.toggle("is-editing", enabled);
    if (nameEl) nameEl.hidden = enabled;
    if (nameEditEl) nameEditEl.hidden = !enabled;
    root?.classList.toggle("score-module--editing-name", enabled);
  }

  function beginNameEdit() {
    if (!selectedColor || !nameInputEl) return;
    nameEditOriginal = RoundModule.getPlayerName(selectedColor);
    nameInputEl.value = nameEditOriginal;
    setNameEditMode(true);
    nameInputEl.focus();
    nameInputEl.select();
  }

  function clearNameInput() {
    if (!nameInputEl) return;
    nameInputEl.value = "";
    nameInputEl.focus();
  }

  function cancelNameEdit() {
    if (!editingName) return;
    setNameEditMode(false);
    renderHero();
  }

  function saveNameEdit() {
    if (!editingName || !selectedColor || !nameInputEl) return false;
    const next = nameInputEl.value.trim() || defaultNameFor(selectedColor);
    RoundModule.setPlayerName(selectedColor, next);
    setNameEditMode(false);
    render();
    return true;
  }

  function toggleMark(color) {
    if (editingName) return;
    if (!selectedColor || color === selectedColor) return;
    if (!RoundModule.activeColors().includes(color)) return;

    if (draftMarks.has(color)) {
      draftMarks.delete(color);
      draftScore = Math.max(RoundModule.MIN_SCORE, draftScore - 1);
    } else {
      if (draftScore >= RoundModule.MAX_SCORE) return;
      draftMarks.add(color);
      draftScore = Math.min(RoundModule.MAX_SCORE, draftScore + 1);
    }

    render();
  }

  function open(colorId) {
    if (!root) return;
    if (!RoundModule.activeColors().includes(colorId)) return;

    if (typeof CharacterModule !== "undefined" && CharacterModule.isOpen()) {
      CharacterModule.close();
    }

    previouslyFocused = document.activeElement;
    selectedColor = colorId;
    roundNumber = RoundModule.viewingRound;

    const saved = RoundModule.getPlayerScore(roundNumber, colorId);
    draftScore = typeof saved === "number" ? saved : 0;
    draftMarks = new Set(RoundModule.getPlayerMarks(roundNumber, colorId));
    editingName = false;
    setNameEditMode(false);

    render();

    root.hidden = false;
    root.setAttribute("aria-hidden", "false");
    document.body.classList.add("score-module-open");
    root.querySelector("[data-score-ok]")?.focus();
  }

  function close() {
    if (!root || root.hidden) return;
    cancelNameEdit();
    closeResetConfirm();

    root.hidden = true;
    root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("score-module-open");

    selectedColor = null;
    draftMarks = new Set();

    if (previouslyFocused && typeof previouslyFocused.focus === "function") {
      previouslyFocused.focus();
    }
    previouslyFocused = null;
  }

  function commitAndClose() {
    if (!selectedColor) return;
    if (editingName) saveNameEdit();

    RoundModule.commitPlayerRoundScore(
      roundNumber,
      selectedColor,
      draftScore,
      [...draftMarks]
    );
    RoundModule.refreshView();
    close();
    RoundModule.notifyGameCompleteIfNeeded();
  }

  function openResetConfirm() {
    if (!resetConfirmEl) return;
    if (editingName) cancelNameEdit();
    resetConfirmEl.hidden = false;
    resetConfirmEl.setAttribute("aria-hidden", "false");
    resetConfirmEl.querySelector("[data-score-reset-yes]")?.focus();
  }

  function closeResetConfirm() {
    if (!resetConfirmEl || resetConfirmEl.hidden) return;
    resetConfirmEl.hidden = true;
    resetConfirmEl.setAttribute("aria-hidden", "true");
  }

  function applyReset() {
    draftScore = 0;
    draftMarks = new Set();
    if (selectedColor) {
      RoundModule.commitPlayerRoundScore(roundNumber, selectedColor, 0, []);
      RoundModule.refreshView();
    }
    render();
    closeResetConfirm();
  }

  root?.addEventListener("click", (event) => {
    if (event.target.closest("#score-module-player-name")) {
      beginNameEdit();
      return;
    }
    if (event.target.closest("[data-score-name-clear]")) {
      clearNameInput();
      return;
    }
    if (event.target.closest("[data-score-name-save]")) {
      saveNameEdit();
      return;
    }
    if (event.target.closest("[data-score-name-cancel]")) {
      cancelNameEdit();
      return;
    }

    const markBtn = event.target.closest("[data-score-mark]");
    if (markBtn) {
      toggleMark(markBtn.dataset.scoreMark);
      return;
    }
    if (event.target.closest("[data-score-back]")) {
      cancelNameEdit();
      close();
      return;
    }
    if (event.target.closest("[data-score-reset]")) {
      openResetConfirm();
      return;
    }
    if (event.target.closest("[data-score-ok]")) {
      commitAndClose();
    }
  });

  nameInputEl?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      saveNameEdit();
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      cancelNameEdit();
    }
  });

  resetConfirmEl?.addEventListener("click", (event) => {
    if (event.target.closest("[data-score-reset-no]")) {
      closeResetConfirm();
      return;
    }
    if (event.target.closest("[data-score-reset-yes]")) {
      applyReset();
      return;
    }
    if (event.target.closest("[data-score-reset-close]")) {
      closeResetConfirm();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (resetConfirmEl && !resetConfirmEl.hidden) {
      closeResetConfirm();
      return;
    }
    if (editingName) {
      cancelNameEdit();
      return;
    }
    if (isOpen()) close();
  });

  return { open, close, isOpen };
})();
