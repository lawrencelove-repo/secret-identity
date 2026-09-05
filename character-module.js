/**
 * Character module — modal detail view for a dealt character slot.
 * Supports numbered prev/next navigation with wraparound across the 8 slots,
 * plus replace / specify (current round only; confirms if scores already started).
 */
const CharacterModule = (() => {
  const root = document.getElementById("character-module");
  const numberEl = document.getElementById("character-module-number");
  const nameEl = document.getElementById("character-module-name");
  const categoryEl = document.getElementById("character-module-category");
  const descriptionEl = document.getElementById("character-module-description");
  const replaceBtn = root?.querySelector("[data-character-module-replace]");
  const specifyBtn = root?.querySelector("[data-character-module-specify]");
  const confirmEl = document.getElementById("character-replace-confirm");

  let previouslyFocused = null;
  let currentIndex = 0;
  let pendingReplaceSlot = null;
  let pendingCharacterName = null;

  function getRoster() {
    return [...document.querySelectorAll(".column--left .box--black")]
      .map((box) => box._character)
      .filter(Boolean);
  }

  function setMeta(el, value) {
    if (value) {
      el.textContent = value;
      el.hidden = false;
    } else {
      el.textContent = "";
      el.hidden = true;
    }
  }

  function updateActionButtons() {
    const allowed =
      typeof RoundModule !== "undefined" && RoundModule.canReplaceCharacter();
    if (replaceBtn) replaceBtn.hidden = !allowed;
    if (specifyBtn) {
      const specifyOn =
        typeof AppSettings !== "undefined" && AppSettings.getSpecifyCharacter();
      specifyBtn.hidden = !(allowed && specifyOn);
    }
  }

  function render(character) {
    numberEl.textContent = String(character.number);
    nameEl.textContent = character.name;
    setMeta(categoryEl, character.category || null);
    setMeta(descriptionEl, character.description || null);
    updateActionButtons();
  }

  function showAt(index) {
    const roster = getRoster();
    if (!roster.length) return;

    currentIndex = ((index % roster.length) + roster.length) % roster.length;
    render(roster[currentIndex]);
  }

  function open(character) {
    if (!root) return;

    const roster = getRoster();
    if (!roster.length) return;

    previouslyFocused = document.activeElement;

    const matchIndex = roster.findIndex((entry) => entry.number === character.number);
    currentIndex = matchIndex >= 0 ? matchIndex : 0;
    showAt(currentIndex);

    root.hidden = false;
    root.setAttribute("aria-hidden", "false");
    document.body.classList.add("character-module-open");

    const okBtn = root.querySelector(".character-module__ok");
    if (okBtn) okBtn.focus();
  }

  function close() {
    if (!root || root.hidden) return;

    closeConfirm();
    if (typeof CharacterSpecifyModule !== "undefined") {
      CharacterSpecifyModule.close();
    }
    root.hidden = true;
    root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("character-module-open");

    if (previouslyFocused && typeof previouslyFocused.focus === "function") {
      previouslyFocused.focus();
    }
    previouslyFocused = null;
  }

  function isOpen() {
    return Boolean(root && !root.hidden);
  }

  function next() {
    showAt(currentIndex + 1);
  }

  function prev() {
    showAt(currentIndex - 1);
  }

  function openConfirm(slotNumber, characterName = null) {
    pendingReplaceSlot = slotNumber;
    pendingCharacterName = characterName;
    if (!confirmEl) return;
    confirmEl.hidden = false;
    confirmEl.setAttribute("aria-hidden", "false");
    confirmEl.querySelector("[data-character-replace-confirm-yes]")?.focus();
  }

  function closeConfirm() {
    pendingReplaceSlot = null;
    pendingCharacterName = null;
    if (!confirmEl || confirmEl.hidden) return;
    confirmEl.hidden = true;
    confirmEl.setAttribute("aria-hidden", "true");
  }

  function refreshAfterReplace(result) {
    closeConfirm();
    const nextRoster = getRoster();
    const matchIndex = nextRoster.findIndex(
      (entry) => entry.number === result.character.number
    );
    currentIndex = matchIndex >= 0 ? matchIndex : currentIndex;
    showAt(currentIndex);
  }

  function applyReplace(confirmed, characterName = null) {
    const roster = getRoster();
    const current = roster[currentIndex];
    if (!current) return;

    const options = { confirmed };
    if (characterName) options.characterName = characterName;

    const result = RoundModule.replaceCharacter(current.number, options);
    if (result.needsConfirm) {
      openConfirm(current.number, characterName);
      return;
    }
    if (!result.ok) {
      console.warn(result.error || "Could not replace character.");
      return;
    }

    refreshAfterReplace(result);
  }

  function requestReplace() {
    if (!RoundModule.canReplaceCharacter()) return;
    applyReplace(false);
  }

  function requestSpecify() {
    if (!RoundModule.canReplaceCharacter()) return;
    if (typeof AppSettings !== "undefined" && !AppSettings.getSpecifyCharacter()) {
      return;
    }
    if (typeof CharacterSpecifyModule === "undefined") return;

    const roster = getRoster();
    const current = roster[currentIndex];
    if (!current) return;

    const excludeNames = roster
      .filter((entry) => entry.number !== current.number)
      .map((entry) => entry.name);

    CharacterSpecifyModule.open({
      excludeNames,
      onPick: (name) => {
        applyReplace(false, name);
      },
    });
  }

  root?.addEventListener("click", (event) => {
    if (event.target.closest("[data-character-module-close]")) {
      close();
      return;
    }
    if (event.target.closest("[data-character-module-next]")) {
      next();
      return;
    }
    if (event.target.closest("[data-character-module-prev]")) {
      prev();
      return;
    }
    if (event.target.closest("[data-character-module-replace]")) {
      requestReplace();
      return;
    }
    if (event.target.closest("[data-character-module-specify]")) {
      requestSpecify();
    }
  });

  confirmEl?.addEventListener("click", (event) => {
    if (event.target.closest("[data-character-replace-confirm-no]")) {
      closeConfirm();
      replaceBtn?.focus();
      return;
    }
    if (event.target.closest("[data-character-replace-confirm-yes]")) {
      const slot = pendingReplaceSlot;
      const name = pendingCharacterName;
      closeConfirm();
      if (slot != null) {
        applyReplace(true, name);
      }
      return;
    }
    if (event.target.closest("[data-character-replace-confirm-close]")) {
      closeConfirm();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (typeof CharacterSpecifyModule !== "undefined" && CharacterSpecifyModule.isOpen()) {
      return;
    }

    if (confirmEl && !confirmEl.hidden) {
      if (event.key === "Escape") {
        closeConfirm();
        replaceBtn?.focus();
      }
      return;
    }

    if (!isOpen()) return;

    if (event.key === "Escape") {
      close();
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      prev();
    }
  });

  document.addEventListener("secret-identity:settings-change", (event) => {
    if (event.detail?.key === "specifyCharacter" && isOpen()) {
      updateActionButtons();
    }
  });

  return { open, close, isOpen, next, prev };
})();
