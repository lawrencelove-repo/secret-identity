/**
 * Keep the stage fitted to Safari's *visible* viewport on iPad.
 * visualViewport excludes the URL bar / tab bar chrome that 100vh includes.
 *
 * Also syncs body.is-portrait-layout from the device orientation so portrait
 * rules can be preview-forced by the configurator without relying only on
 * @media (orientation), which desktop DevTools cannot always emulate well.
 */
(function syncAppViewport() {
  const root = document.documentElement;
  const portraitQuery = window.matchMedia("(orientation: portrait)");

  function updateViewportSize() {
    if (root.dataset.configuratorFormFactor && root.dataset.configuratorFormFactor !== "auto") {
      return;
    }

    const viewport = window.visualViewport;
    const width = viewport ? viewport.width : window.innerWidth;
    const height = viewport ? viewport.height : window.innerHeight;

    root.style.setProperty("--app-width", `${Math.round(width)}px`);
    root.style.setProperty("--app-height", `${Math.round(height)}px`);
  }

  function syncPortraitClass() {
    if (root.dataset.configuratorOrientationLock) return;
    if (root.dataset.configuratorFormFactor && root.dataset.configuratorFormFactor !== "auto") {
      return;
    }
    document.body.classList.toggle("is-portrait-layout", portraitQuery.matches);
  }

  function update() {
    updateViewportSize();
    syncPortraitClass();
  }

  update();
  window.addEventListener("resize", update);
  window.visualViewport?.addEventListener("resize", update);
  window.visualViewport?.addEventListener("scroll", updateViewportSize);
  window.addEventListener("orientationchange", () => {
    // iPad Safari often reports the old size briefly during rotation.
    window.setTimeout(update, 250);
  });

  if (typeof portraitQuery.addEventListener === "function") {
    portraitQuery.addEventListener("change", syncPortraitClass);
  } else if (typeof portraitQuery.addListener === "function") {
    portraitQuery.addListener(syncPortraitClass);
  }

  window.AppViewport = {
    update,
    syncPortraitClass,
    updateViewportSize,
  };
})();
