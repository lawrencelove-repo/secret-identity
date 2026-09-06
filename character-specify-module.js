/**
 * Character specify module — pick a specific character to swap into the current slot.
 */
const CharacterSpecifyModule = (() => {
  const root = document.getElementById("character-specify-module");
  const listEl = document.getElementById("character-specify-list");
  const searchEl = document.getElementById("character-specify-search");

  let filterText = "";
  let onPick = null;
  let excludeNames = new Set();

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function isOpen() {
    return Boolean(root && !root.hidden);
  }

  function renderList() {
    if (!listEl) return;
    listEl.replaceChildren();

    const rows = CharacterCatalog.listEnabled()
      .filter((row) => !excludeNames.has(row.name))
      .filter((row) => {
        if (!filterText) return true;
        const hay = `${row.name} ${CharacterCatalog.formatCategories(
          CharacterCatalog.categoriesOf(row)
        )} ${row.description || ""}`.toLowerCase();
        return hay.includes(filterText);
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    rows.forEach((row) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "character-specify-module__row";
      btn.dataset.name = row.name;
      const categoryText = CharacterCatalog.formatCategories(
        CharacterCatalog.categoriesOf(row)
      );
      btn.innerHTML = `
        <span class="character-specify-module__row-name">${escapeHtml(row.name)}</span>
        <span class="character-specify-module__row-meta">${escapeHtml(categoryText)}${
          row.description ? ` · ${escapeHtml(row.description)}` : ""
        }</span>
      `;
      listEl.appendChild(btn);
    });

    if (!rows.length) {
      const empty = document.createElement("p");
      empty.className = "character-specify-module__empty";
      empty.textContent = "No matching characters.";
      listEl.appendChild(empty);
    }
  }

  /**
   * @param {{ excludeNames?: string[], onPick?: (name: string) => void }} options
   */
  function open(options = {}) {
    if (!root) return;
    onPick = typeof options.onPick === "function" ? options.onPick : null;
    excludeNames = new Set(options.excludeNames || []);
    filterText = "";
    if (searchEl) searchEl.value = "";
    renderList();
    root.hidden = false;
    root.setAttribute("aria-hidden", "false");
    document.body.classList.add("character-specify-module-open");
    searchEl?.focus();
  }

  function close() {
    if (!root || root.hidden) return;
    root.hidden = true;
    root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("character-specify-module-open");
    onPick = null;
  }

  root?.addEventListener("click", (event) => {
    if (event.target.closest("[data-character-specify-close]")) {
      close();
      return;
    }
    const row = event.target.closest(".character-specify-module__row");
    if (row?.dataset.name) {
      const pick = onPick;
      const name = row.dataset.name;
      close();
      if (pick) pick(name);
    }
  });

  searchEl?.addEventListener("input", () => {
    filterText = searchEl.value.trim().toLowerCase();
    renderList();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      close();
    }
  });

  return { open, close, isOpen };
})();
