/**
 * Resume game module — shown on boot when a saved in-progress game exists.
 */
const ResumeGameModule = (() => {
  const root = document.getElementById("resume-game-module");
  const confirmEl = document.getElementById("new-game-confirm");

  function isOpen() {
    return Boolean(root && !root.hidden);
  }

  function openConfirm() {
    if (!confirmEl) return;
    confirmEl.hidden = false;
    confirmEl.setAttribute("aria-hidden", "false");
    confirmEl.querySelector("[data-new-game-confirm-yes]")?.focus();
  }

  function closeConfirm() {
    if (!confirmEl || confirmEl.hidden) return;
    confirmEl.hidden = true;
    confirmEl.setAttribute("aria-hidden", "true");
  }

  function open() {
    if (!root) return;
    if (typeof NewGameModule !== "undefined") NewGameModule.close();
    root.hidden = false;
    root.setAttribute("aria-hidden", "false");
    document.body.classList.add("resume-game-module-open");
    document.body.classList.add("is-boot");
    root.querySelector("[data-resume-game]")?.focus();
  }

  function close() {
    if (!root || root.hidden) return;
    closeConfirm();
    root.hidden = true;
    root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("resume-game-module-open");
  }

  function resume() {
    close();
    if (typeof RoundModule === "undefined") return;
    const ok = RoundModule.restorePersistedGame();
    if (!ok && typeof NewGameModule !== "undefined") {
      NewGameModule.open({ fromGame: false });
    }
  }

  function requestNewGame() {
    openConfirm();
  }

  function confirmNewGame() {
    closeConfirm();
    close();
    if (typeof RoundModule !== "undefined") {
      RoundModule.clearPersistedGame();
    }
    if (typeof NewGameModule !== "undefined") {
      NewGameModule.open({ fromGame: false });
    }
  }

  root?.addEventListener("click", (event) => {
    if (event.target.closest("[data-resume-game]")) {
      resume();
      return;
    }
    if (event.target.closest("[data-resume-new-game]")) {
      requestNewGame();
    }
  });

  confirmEl?.addEventListener("click", (event) => {
    if (!isOpen()) return;
    if (event.target.closest("[data-new-game-confirm-no]")) {
      closeConfirm();
      return;
    }
    if (event.target.closest("[data-new-game-confirm-yes]")) {
      confirmNewGame();
      return;
    }
    if (event.target.closest("[data-new-game-confirm-close]")) {
      closeConfirm();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !isOpen()) return;
    if (confirmEl && !confirmEl.hidden) {
      closeConfirm();
      return;
    }
    // Stay on resume — no dismiss without choosing.
  });

  return { open, close, isOpen, resume };
})();
