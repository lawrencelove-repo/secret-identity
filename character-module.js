/**
 * Character module — modal detail view for a dealt character slot.
 * Supports numbered prev/next navigation with wraparound across the 8 slots,
 * plus replace (current round only; confirms if scores already started).
 */
const CharacterModule = (() => {
  const root = document.getElementById("character-module");
  const numberEl = document.getElementById("character-module-number");
  const nameEl = document.getElementById("character-module-name");
  const categoryEl = document.getElementById("character-module-category");
  const descriptionEl = document.getElementById("character-module-description");
  const replaceBtn = root?.querySelector("[data-character-module-replace]");
  const confirmEl = document.getElementById("character-replace-confirm");

  let previouslyFocused = null;
  let currentIndex = 0;
  let pendingReplaceSlot = null;

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

  function updateReplaceButton() {
    if (!replaceBtn) return;
    const allowed = typeof RoundModule !== "undefined" && RoundModule.canReplaceCharacter();
    replaceBtn.hidden = !allowed;
  }

  function render(character) {
    numberEl.textContent = String(character.number);
    nameEl.textContent = character.name;
    setMeta(categoryEl, character.category || null);
    setMeta(descriptionEl, character.description || null);
    updateReplaceButton();
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

  function openConfirm(slotNumber) {
    pendingReplaceSlot = slotNumber;
    if (!confirmEl) return;
    confirmEl.hidden = false;
    confirmEl.setAttribute("aria-hidden", "false");
    confirmEl.querySelector("[data-character-replace-confirm-yes]")?.focus();
  }

  function closeConfirm() {
    pendingReplaceSlot = null;
    if (!confirmEl || confirmEl.hidden) return;
    confirmEl.hidden = true;
    confirmEl.setAttribute("aria-hidden", "true");
  }

  function applyReplace(confirmed) {
    const roster = getRoster();
    const current = roster[currentIndex];
    if (!current) return;

    const result = RoundModule.replaceCharacter(current.number, { confirmed });
    if (result.needsConfirm) {
      openConfirm(current.number);
      return;
    }
    if (!result.ok) {
      console.warn(result.error || "Could not replace character.");
      return;
    }

    closeConfirm();
    // Roster updated on the board — refresh modal to the same slot number.
    const nextRoster = getRoster();
    const matchIndex = nextRoster.findIndex(
      (entry) => entry.number === result.character.number
    );
    currentIndex = matchIndex >= 0 ? matchIndex : currentIndex;
    showAt(currentIndex);
  }

  function requestReplace() {
    if (!RoundModule.canReplaceCharacter()) return;
    applyReplace(false);
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
      closeConfirm();
      if (slot != null) {
        applyReplace(true);
      }
      return;
    }
    if (event.target.closest("[data-character-replace-confirm-close]")) {
      closeConfirm();
    }
  });

  document.addEventListener("keydown", (event) => {
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

  return { open, close, isOpen, next, prev };
})();
