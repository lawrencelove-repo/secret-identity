/**
 * Settings module — device preferences opened from the hamburger menu.
 */
const SettingsModule = (() => {
  const root = document.getElementById("settings-module");

  function closeMenu() {
    const panel = document.getElementById("app-menu-panel");
    const toggle = document.getElementById("app-menu-toggle");
    if (panel) panel.hidden = true;
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  function isOpen() {
    return Boolean(root && !root.hidden);
  }

  function syncInputs() {
    const specifyInput = root?.querySelector("[data-setting-specify-character]");
    const randomInput = root?.querySelector("[data-setting-allow-random]");
    if (specifyInput && typeof AppSettings !== "undefined") {
      specifyInput.checked = AppSettings.getSpecifyCharacter();
    }
    if (randomInput && typeof AppSettings !== "undefined") {
      randomInput.checked = AppSettings.getAllowRandom();
    }
  }

  function open() {
    if (!root) return;
    closeMenu();
    if (typeof CharactersFullscreen !== "undefined") {
      CharactersFullscreen.setActive(false);
    }
    syncInputs();
    root.hidden = false;
    root.setAttribute("aria-hidden", "false");
    document.body.classList.add("settings-module-open");
    root.querySelector("[data-settings-close]")?.focus();
  }

  function close() {
    if (!root || root.hidden) return;
    root.hidden = true;
    root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("settings-module-open");
  }

  function bindInputs() {
    const specifyInput = root?.querySelector("[data-setting-specify-character]");
    const randomInput = root?.querySelector("[data-setting-allow-random]");

    specifyInput?.addEventListener("change", () => {
      if (typeof AppSettings !== "undefined") {
        AppSettings.setSpecifyCharacter(specifyInput.checked);
      }
    });

    randomInput?.addEventListener("change", () => {
      if (typeof AppSettings !== "undefined") {
        AppSettings.setAllowRandom(randomInput.checked);
      }
    });
  }

  root?.addEventListener("click", (event) => {
    if (event.target.closest("[data-settings-close]")) {
      close();
    }
  });

  document.querySelector("[data-menu-settings]")?.addEventListener("click", () => {
    open();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      close();
    }
  });

  bindInputs();

  return { open, close, isOpen };
})();
