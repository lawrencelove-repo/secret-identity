/**
 * App settings persisted in cookies (device-local preferences).
 */
const AppSettings = (() => {
  const KEYS = {
    specifyCharacter: "si_specify_character",
    allowRandom: "si_allow_random",
    textScale: "si_text_scale",
    animateCubeMoves: "si_animate_cube_moves",
  };

  /** Five ticks: 80% … 100% (default) … 120% */
  const TEXT_SCALE_STEPS = [0.8, 0.9, 1.0, 1.1, 1.2];
  const DEFAULT_TEXT_SCALE_INDEX = 2;

  const DEFAULTS = {
    specifyCharacter: false,
    allowRandom: false,
    textScaleIndex: DEFAULT_TEXT_SCALE_INDEX,
    animateCubeMoves: true,
  };

  function readCookie(name) {
    const match = document.cookie.match(
      new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`)
    );
    return match ? decodeURIComponent(match[1]) : null;
  }

  function writeCookie(name, value) {
    const maxAge = 60 * 60 * 24 * 365 * 2; // 2 years
    const expires = new Date(Date.now() + maxAge * 1000).toUTCString();
    document.cookie =
      `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; expires=${expires}; SameSite=Lax`;
  }

  function getBool(key, fallback) {
    const raw = readCookie(key);
    if (raw === null) return fallback;
    return raw === "1" || raw === "true";
  }

  function setBool(key, value) {
    writeCookie(key, value ? "1" : "0");
  }

  function clampTextScaleIndex(index) {
    const value = Number(index);
    if (!Number.isFinite(value)) return DEFAULT_TEXT_SCALE_INDEX;
    return Math.min(TEXT_SCALE_STEPS.length - 1, Math.max(0, Math.round(value)));
  }

  function applyTextScale(scale) {
    document.documentElement.style.setProperty("--text-scale", String(scale));
  }

  function getSpecifyCharacter() {
    return getBool(KEYS.specifyCharacter, DEFAULTS.specifyCharacter);
  }

  function setSpecifyCharacter(value) {
    setBool(KEYS.specifyCharacter, Boolean(value));
    document.dispatchEvent(
      new CustomEvent("secret-identity:settings-change", {
        detail: { key: "specifyCharacter", value: Boolean(value) },
      })
    );
  }

  function getAllowRandom() {
    return getBool(KEYS.allowRandom, DEFAULTS.allowRandom);
  }

  function setAllowRandom(value) {
    setBool(KEYS.allowRandom, Boolean(value));
    document.dispatchEvent(
      new CustomEvent("secret-identity:settings-change", {
        detail: { key: "allowRandom", value: Boolean(value) },
      })
    );
  }

  function getAnimateCubeMoves() {
    return getBool(KEYS.animateCubeMoves, DEFAULTS.animateCubeMoves);
  }

  function setAnimateCubeMoves(value) {
    setBool(KEYS.animateCubeMoves, Boolean(value));
    document.dispatchEvent(
      new CustomEvent("secret-identity:settings-change", {
        detail: { key: "animateCubeMoves", value: Boolean(value) },
      })
    );
  }

  /** Resolve a cookie/storage raw value to a step index. */
  function indexFromStored(raw) {
    if (raw === null || raw === undefined || raw === "") {
      return DEFAULTS.textScaleIndex;
    }
    const num = Number(raw);
    if (!Number.isFinite(num)) return DEFAULTS.textScaleIndex;

    // Step index 0–4
    if (Number.isInteger(num) && num >= 0 && num <= 4) {
      return clampTextScaleIndex(num);
    }

    // Percent (80–120) or scale factor (0.8–1.2)
    const asScale = num > 2 ? num / 100 : num;
    let best = DEFAULT_TEXT_SCALE_INDEX;
    let bestDist = Infinity;
    TEXT_SCALE_STEPS.forEach((step, index) => {
      const dist = Math.abs(step - asScale);
      if (dist < bestDist) {
        bestDist = dist;
        best = index;
      }
    });
    return best;
  }

  function getTextScaleIndex() {
    // Cookie is canonical; localStorage is a fallback when cookies are blocked.
    const fromCookie = readCookie(KEYS.textScale);
    if (fromCookie !== null) return indexFromStored(fromCookie);
    try {
      const fromStorage = localStorage.getItem(KEYS.textScale);
      if (fromStorage !== null) return indexFromStored(fromStorage);
    } catch {
      /* private mode / blocked */
    }
    return DEFAULTS.textScaleIndex;
  }

  function getTextScale() {
    return TEXT_SCALE_STEPS[getTextScaleIndex()];
  }

  function setTextScaleIndex(index) {
    const next = clampTextScaleIndex(index);
    const percent = String(Math.round(TEXT_SCALE_STEPS[next] * 100));
    // Persist percent in the cookie (e.g. "110") — same jar as other settings.
    writeCookie(KEYS.textScale, percent);
    try {
      localStorage.setItem(KEYS.textScale, percent);
    } catch {
      /* ignore */
    }
    applyTextScale(TEXT_SCALE_STEPS[next]);
    document.dispatchEvent(
      new CustomEvent("secret-identity:settings-change", {
        detail: { key: "textScale", value: TEXT_SCALE_STEPS[next], index: next },
      })
    );
  }

  function init() {
    applyTextScale(getTextScale());
  }

  init();

  return {
    TEXT_SCALE_STEPS,
    getSpecifyCharacter,
    setSpecifyCharacter,
    getAllowRandom,
    setAllowRandom,
    getAnimateCubeMoves,
    setAnimateCubeMoves,
    getTextScaleIndex,
    getTextScale,
    setTextScaleIndex,
  };
})();
