/**
 * New game module — choose any player colors and start (or restart) a game.
 */
const NewGameModule = (() => {
  const root = document.getElementById("new-game-module");
  const colorsEl = document.getElementById("new-game-colors");
  const countEl = document.getElementById("new-game-count");
  const cancelBtn = document.querySelector("[data-new-game-cancel]");
  const confirmEl = document.getElementById("new-game-confirm");

  /** @type {Set<string>} */
  let draftColors = new Set();
  let openedFromGame = false;

  function isOpen() {
    return Boolean(root && !root.hidden);
  }

  function draftCount() {
    return draftColors.size;
  }

  function renderCount() {
    if (countEl) countEl.textContent = String(draftCount());
  }

  function renderColors() {
    if (!colorsEl) return;
    colorsEl.replaceChildren();

    RoundModule.PLAYER_COLORS.forEach((color) => {
      const selected = draftColors.has(color);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `new-game-module__color box--${color}`;
      btn.dataset.newGameColor = color;
      btn.setAttribute("aria-label", RoundModule.COLOR_LABELS[color]);
      btn.setAttribute("aria-pressed", selected ? "true" : "false");
      if (selected) btn.classList.add("is-selected");
      colorsEl.appendChild(btn);
    });
  }

  function renderActions() {
    const startBtn = root?.querySelector("[data-new-game-start]");
    if (startBtn) {
      startBtn.disabled = draftCount() < RoundModule.MIN_PLAYERS;
    }
    if (cancelBtn) {
      cancelBtn.hidden = !openedFromGame && !RoundModule.gameStarted;
    }
  }

  function render() {
    renderCount();
    renderColors();
    renderActions();
  }

  function toggleColor(color) {
    if (!RoundModule.PLAYER_COLORS.includes(color)) return;

    if (draftColors.has(color)) {
      draftColors.delete(color);
    } else if (draftColors.size < RoundModule.MAX_PLAYERS) {
      draftColors.add(color);
    }

    render();
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

  function beginGame() {
    closeConfirm();
    RoundModule.startNewGame([...draftColors]);
    close();
  }

  function requestStart() {
    if (draftCount() < RoundModule.MIN_PLAYERS) return;
    beginGame();
  }

  function requestOpenFromMenu() {
    const panel = document.getElementById("app-menu-panel");
    const toggle = document.getElementById("app-menu-toggle");
    if (panel) panel.hidden = true;
    if (toggle) toggle.setAttribute("aria-expanded", "false");

    if (RoundModule.hasActiveGame()) {
      openConfirm();
      return;
    }
    open({ fromGame: true });
  }

  function open(options = {}) {
    if (!root) return;
    openedFromGame = Boolean(options.fromGame);
    draftColors = new Set();
    closeConfirm();
    if (typeof CharactersFullscreen !== "undefined") {
      CharactersFullscreen.setActive(false);
    }
    render();
    root.hidden = false;
    root.setAttribute("aria-hidden", "false");
    document.body.classList.add("new-game-module-open");
    if (!RoundModule.gameStarted) {
      document.body.classList.add("is-boot");
    }
    root.querySelector("[data-new-game-start]")?.focus();
  }

  function close() {
    if (!root || root.hidden) return;
    closeConfirm();
    root.hidden = true;
    root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("new-game-module-open");
  }

  root?.addEventListener("click", (event) => {
    const colorBtn = event.target.closest("[data-new-game-color]");
    if (colorBtn) {
      toggleColor(colorBtn.dataset.newGameColor);
      return;
    }
    if (event.target.closest("[data-new-game-cancel]")) {
      if (!RoundModule.gameStarted) return;
      close();
      return;
    }
    if (event.target.closest("[data-new-game-start]")) {
      requestStart();
    }
  });

  confirmEl?.addEventListener("click", (event) => {
    if (event.target.closest("[data-new-game-confirm-no]")) {
      closeConfirm();
      return;
    }
    if (event.target.closest("[data-new-game-confirm-yes]")) {
      closeConfirm();
      open({ fromGame: true });
      return;
    }
    if (event.target.closest("[data-new-game-confirm-close]")) {
      closeConfirm();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (confirmEl && !confirmEl.hidden) {
      closeConfirm();
      return;
    }
    if (isOpen() && RoundModule.gameStarted) {
      close();
    }
  });

  document.getElementById("app-menu-toggle")?.addEventListener("click", (event) => {
    event.stopPropagation();
    const toggle = document.getElementById("app-menu-toggle");
    const panel = document.getElementById("app-menu-panel");
    if (!toggle || !panel) return;
    const open = panel.hidden;
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  document.querySelector("[data-menu-new-game]")?.addEventListener("click", () => {
    requestOpenFromMenu();
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest("#app-menu")) return;
    const panel = document.getElementById("app-menu-panel");
    const toggle = document.getElementById("app-menu-toggle");
    if (panel && !panel.hidden) {
      panel.hidden = true;
      toggle?.setAttribute("aria-expanded", "false");
    }
  });

  // Fresh load — show new-game module over blank background before round 1.
  open({ fromGame: false });

  return { open, close, isOpen };
})();
