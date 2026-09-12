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

  function textScalePercent(index) {
    if (typeof AppSettings === "undefined") return "100%";
    const scale = AppSettings.TEXT_SCALE_STEPS[index] ?? 1;
    return `${Math.round(scale * 100)}%`;
  }

  function syncInputs() {
    const specifyInput = root?.querySelector("[data-setting-specify-character]");
    const randomInput = root?.querySelector("[data-setting-allow-random]");
    const textScaleInput = root?.querySelector("[data-setting-text-scale]");
    const textScaleValue = root?.querySelector("[data-setting-text-scale-value]");

    if (specifyInput && typeof AppSettings !== "undefined") {
      specifyInput.checked = AppSettings.getSpecifyCharacter();
    }
    if (randomInput && typeof AppSettings !== "undefined") {
      randomInput.checked = AppSettings.getAllowRandom();
    }
    if (textScaleInput && typeof AppSettings !== "undefined") {
      const index = AppSettings.getTextScaleIndex();
      textScaleInput.value = String(index);
      if (textScaleValue) textScaleValue.textContent = textScalePercent(index);
    }
  }

  function open() {
    if (!root) return;
    closeMenu();
    if (typeof CharactersFullscreen !== "undefined") {
      CharactersFullscreen.setActive(false);
    }
    if (typeof BoardModule !== "undefined") {
      BoardModule.setActive(false);
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
    const textScaleInput = root?.querySelector("[data-setting-text-scale]");
    const textScaleValue = root?.querySelector("[data-setting-text-scale-value]");

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

    const onTextScaleInput = () => {
      if (typeof AppSettings === "undefined" || !textScaleInput) return;
      const index = Number(textScaleInput.value);
      AppSettings.setTextScaleIndex(index);
      if (textScaleValue) textScaleValue.textContent = textScalePercent(index);
    };

    textScaleInput?.addEventListener("input", onTextScaleInput);
    textScaleInput?.addEventListener("change", onTextScaleInput);
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
