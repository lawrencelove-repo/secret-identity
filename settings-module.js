/**
 * Settings module — device preferences opened from the hamburger menu.
 */
const SettingsModule = (() => {
  const root = document.getElementById("settings-module");
  const refreshConfirmEl = document.getElementById("force-refresh-confirm");

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
    const animateCubesInput = root?.querySelector("[data-setting-animate-cubes]");
    const textScaleInput = root?.querySelector("[data-setting-text-scale]");
    const textScaleValue = root?.querySelector("[data-setting-text-scale-value]");

    if (specifyInput && typeof AppSettings !== "undefined") {
      specifyInput.checked = AppSettings.getSpecifyCharacter();
    }
    if (randomInput && typeof AppSettings !== "undefined") {
      randomInput.checked = AppSettings.getAllowRandom();
    }
    if (animateCubesInput && typeof AppSettings !== "undefined") {
      animateCubesInput.checked = AppSettings.getAnimateCubeMoves();
    }
    if (textScaleInput && typeof AppSettings !== "undefined") {
      const index = AppSettings.getTextScaleIndex();
      textScaleInput.value = String(index);
      if (textScaleValue) textScaleValue.textContent = textScalePercent(index);
    }
  }

  function openRefreshConfirm() {
    if (!refreshConfirmEl) return;
    refreshConfirmEl.hidden = false;
    refreshConfirmEl.setAttribute("aria-hidden", "false");
    refreshConfirmEl.querySelector("[data-force-refresh-yes]")?.focus();
  }

  function closeRefreshConfirm() {
    if (!refreshConfirmEl || refreshConfirmEl.hidden) return;
    refreshConfirmEl.hidden = true;
    refreshConfirmEl.setAttribute("aria-hidden", "true");
  }

  /**
   * PWA-safe refresh: unregister service workers, delete Cache Storage,
   * then reload. Keeps cookies / localStorage (saved game + settings).
   * A plain location.reload() is not enough on iPad home-screen PWAs.
   */
  async function forceRefreshApp() {
    closeRefreshConfirm();
    close();

    try {
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((reg) => reg.unregister()));
      }
    } catch {
      /* continue — still try caches + reload */
    }

    try {
      if (typeof caches !== "undefined") {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      }
    } catch {
      /* continue */
    }

    // Bust any remaining HTTP cache on the document navigation.
    const url = new URL(window.location.href);
    url.searchParams.set("_refresh", String(Date.now()));
    window.location.replace(url.toString());
  }

  function open() {
    if (!root) return;
    closeMenu();
    closeRefreshConfirm();
    if (typeof CharactersFullscreen !== "undefined") {
      CharactersFullscreen.setActive(false);
    }
    // Keep the board open underneath so closing settings returns there.
    syncInputs();
    root.hidden = false;
    root.setAttribute("aria-hidden", "false");
    document.body.classList.add("settings-module-open");
    root.querySelector("[data-settings-close]")?.focus();
  }

  function close() {
    if (!root || root.hidden) return;
    closeRefreshConfirm();
    root.hidden = true;
    root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("settings-module-open");
  }

  function bindInputs() {
    const specifyInput = root?.querySelector("[data-setting-specify-character]");
    const randomInput = root?.querySelector("[data-setting-allow-random]");
    const animateCubesInput = root?.querySelector("[data-setting-animate-cubes]");
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

    animateCubesInput?.addEventListener("change", () => {
      if (typeof AppSettings !== "undefined") {
        AppSettings.setAnimateCubeMoves(animateCubesInput.checked);
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
    if (event.target.closest("[data-settings-force-refresh]")) {
      openRefreshConfirm();
      return;
    }
    if (event.target.closest("[data-settings-close]")) {
      close();
    }
  });

  refreshConfirmEl?.addEventListener("click", (event) => {
    if (event.target.closest("[data-force-refresh-no]")) {
      closeRefreshConfirm();
      root?.querySelector("[data-settings-force-refresh]")?.focus();
      return;
    }
    if (event.target.closest("[data-force-refresh-yes]")) {
      forceRefreshApp();
      return;
    }
    if (event.target.closest("[data-force-refresh-close]")) {
      closeRefreshConfirm();
    }
  });

  document.querySelector("[data-menu-settings]")?.addEventListener("click", () => {
    open();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (refreshConfirmEl && !refreshConfirmEl.hidden) {
      closeRefreshConfirm();
      return;
    }
    if (isOpen()) {
      close();
    }
  });

  bindInputs();

  return { open, close, isOpen, forceRefreshApp };
})();
