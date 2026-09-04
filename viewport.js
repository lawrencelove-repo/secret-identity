/**
 * Keep the stage fitted to Safari's *visible* viewport on iPad.
 * visualViewport excludes the URL bar / tab bar chrome that 100vh includes.
 */
(function syncAppViewport() {
  const root = document.documentElement;

  function update() {
    const viewport = window.visualViewport;
    const width = viewport ? viewport.width : window.innerWidth;
    const height = viewport ? viewport.height : window.innerHeight;

    root.style.setProperty("--app-width", `${Math.round(width)}px`);
    root.style.setProperty("--app-height", `${Math.round(height)}px`);
  }

  update();
  window.addEventListener("resize", update);
  window.visualViewport?.addEventListener("resize", update);
  window.visualViewport?.addEventListener("scroll", update);
  window.addEventListener("orientationchange", () => {
    // iPad Safari often reports the old size briefly during rotation.
    window.setTimeout(update, 250);
  });
})();
