/**
 * Character module — modal detail view for a dealt character slot.
 * Supports numbered prev/next navigation with wraparound across the 8 slots.
 */
const CharacterModule = (() => {
  const root = document.getElementById("character-module");
  const numberEl = document.getElementById("character-module-number");
  const nameEl = document.getElementById("character-module-name");
  const categoryEl = document.getElementById("character-module-category");
  const descriptionEl = document.getElementById("character-module-description");

  let previouslyFocused = null;
  let currentIndex = 0;

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

  function render(character) {
    numberEl.textContent = String(character.number);
    nameEl.textContent = character.name;
    setMeta(categoryEl, character.category || null);
    setMeta(descriptionEl, character.description || null);
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
    }
  });

  document.addEventListener("keydown", (event) => {
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
