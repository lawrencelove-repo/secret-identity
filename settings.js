/**
 * App settings persisted in cookies (device-local preferences).
 */
const AppSettings = (() => {
  const KEYS = {
    specifyCharacter: "si_specify_character",
    allowRandom: "si_allow_random",
  };

  const DEFAULTS = {
    specifyCharacter: false,
    allowRandom: false,
  };

  function readCookie(name) {
    const match = document.cookie.match(
      new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`)
    );
    return match ? decodeURIComponent(match[1]) : null;
  }

  function writeCookie(name, value) {
    const maxAge = 60 * 60 * 24 * 365 * 2; // 2 years
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }

  function getBool(key, fallback) {
    const raw = readCookie(key);
    if (raw === null) return fallback;
    return raw === "1" || raw === "true";
  }

  function setBool(key, value) {
    writeCookie(key, value ? "1" : "0");
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

  return {
    getSpecifyCharacter,
    setSpecifyCharacter,
    getAllowRandom,
    setAllowRandom,
  };
})();
