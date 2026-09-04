/**
 * Character edit module — manage roster, disable flags, and device play counts.
 * Definition changes persist in localStorage; use Export to update characters.js for git.
 * Play counts are always device-local.
 */
const CharacterEditModule = (() => {
  const root = document.getElementById("character-edit-module");
  const listEl = document.getElementById("character-edit-list");
  const searchEl = document.getElementById("character-edit-search");
  const formEl = document.getElementById("character-edit-form");
  const statusEl = document.getElementById("character-edit-status");
  const clearConfirmEl = document.getElementById("clear-history-confirm");

  let selectedKey = null;
  let filterText = "";

  function setStatus(message, isError = false) {
    if (!statusEl) return;
    statusEl.textContent = message || "";
    statusEl.classList.toggle("is-error", Boolean(isError && message));
  }

  function closeMenu() {
    const panel = document.getElementById("app-menu-panel");
    const toggle = document.getElementById("app-menu-toggle");
    if (panel) panel.hidden = true;
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  function rowMatches(row) {
    if (!filterText) return true;
    const hay = `${row.name} ${row.category || ""} ${row.description || ""}`.toLowerCase();
    return hay.includes(filterText);
  }

  function fillCategoryOptions() {
    const datalist = document.getElementById("character-edit-categories");
    if (!datalist) return;
    datalist.replaceChildren();
    CharacterCatalog.categories().forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      datalist.appendChild(option);
    });
  }

  function renderList() {
    if (!listEl) return;
    listEl.replaceChildren();
    const rows = CharacterCatalog.list()
      .filter(rowMatches)
      .sort((a, b) => a.name.localeCompare(b.name));

    rows.forEach((row) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "character-edit-module__row";
      if (row.disabled) btn.classList.add("is-disabled");
      const key = row.source === "seed" ? `seed:${row.seedName}` : `local:${row.localIndex}`;
      if (selectedKey === key) btn.classList.add("is-selected");
      btn.dataset.key = key;

      const plays = CharacterHistory.getCount(row.name);
      btn.innerHTML = `
        <span class="character-edit-module__row-name">${escapeHtml(row.name)}</span>
        <span class="character-edit-module__row-meta">${escapeHtml(row.category || "")}${
          row.disabled ? " · disabled" : ""
        } · plays ${plays}</span>
      `;
      listEl.appendChild(btn);
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function parseKey(key) {
    if (!key) return null;
    if (key.startsWith("seed:")) {
      return { source: "seed", seedName: key.slice(5) };
    }
    if (key.startsWith("local:")) {
      return { source: "local", localIndex: Number(key.slice(6)) };
    }
    return null;
  }

  function findRow(keyObj) {
    if (!keyObj) return null;
    return (
      CharacterCatalog.list().find((row) => {
        if (keyObj.source === "seed") return row.seedName === keyObj.seedName;
        return row.source === "local" && row.localIndex === keyObj.localIndex;
      }) || null
    );
  }

  function loadForm(row) {
    if (!formEl) return;
    formEl.hidden = !row;
    if (!row) {
      selectedKey = null;
      return;
    }
    formEl.querySelector("[name=name]").value = row.name || "";
    formEl.querySelector("[name=category]").value = row.category || "";
    formEl.querySelector("[name=description]").value = row.description || "";
    formEl.querySelector("[name=plays]").value = String(CharacterHistory.getCount(row.name));
    formEl.querySelector("[name=disabled]").checked = Boolean(row.disabled);
    const removeBtn = formEl.querySelector("[data-character-edit-remove]");
    if (removeBtn) removeBtn.hidden = row.source !== "local";
  }

  function selectKey(key) {
    selectedKey = key;
    const row = findRow(parseKey(key));
    fillCategoryOptions();
    loadForm(row);
    renderList();
  }

  function readForm() {
    return {
      name: formEl.querySelector("[name=name]").value,
      category: formEl.querySelector("[name=category]").value,
      description: formEl.querySelector("[name=description]").value,
      plays: Number(formEl.querySelector("[name=plays]").value),
      disabled: formEl.querySelector("[name=disabled]").checked,
    };
  }

  function saveSelected() {
    if (!selectedKey) return;
    const keyObj = parseKey(selectedKey);
    const fields = readForm();
    const result = CharacterCatalog.update(keyObj, fields);
    if (!result.ok) {
      setStatus(result.error || "Could not save.", true);
      return;
    }
    // Reselect by new identity
    if (keyObj.source === "seed") {
      selectedKey = `seed:${keyObj.seedName}`;
    } else {
      selectedKey = `local:${keyObj.localIndex}`;
    }
    setStatus("Saved on this device.");
    fillCategoryOptions();
    renderList();
    loadForm(findRow(parseKey(selectedKey)));
  }

  function startNew() {
    selectedKey = null;
    formEl.hidden = false;
    formEl.querySelector("[name=name]").value = "";
    formEl.querySelector("[name=category]").value = "";
    formEl.querySelector("[name=description]").value = "";
    formEl.querySelector("[name=plays]").value = "0";
    formEl.querySelector("[name=disabled]").checked = false;
    const removeBtn = formEl.querySelector("[data-character-edit-remove]");
    if (removeBtn) removeBtn.hidden = true;
    formEl.dataset.mode = "create";
    renderList();
    formEl.querySelector("[name=name]")?.focus();
    setStatus("Enter a new character, then Save.");
  }

  function createNew() {
    const fields = readForm();
    const result = CharacterCatalog.add(fields);
    if (!result.ok) {
      setStatus(result.error || "Could not add character.", true);
      return;
    }
    formEl.dataset.mode = "edit";
    const created = CharacterCatalog.list().find(
      (row) => row.source === "local" && row.name === result.character.name
    );
    if (created) selectKey(`local:${created.localIndex}`);
    setStatus("Character added on this device. Export to include it in git.");
  }

  function removeSelected() {
    const keyObj = parseKey(selectedKey);
    if (!keyObj || keyObj.source !== "local") return;
    const result = CharacterCatalog.removeLocal(keyObj.localIndex);
    if (!result.ok) {
      setStatus(result.error || "Could not remove.", true);
      return;
    }
    selectedKey = null;
    formEl.hidden = true;
    formEl.dataset.mode = "edit";
    setStatus("Removed local character.");
    renderList();
  }

  function downloadExport() {
    const blob = new Blob([CharacterCatalog.formatCharactersArrayJs()], {
      type: "text/javascript;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "characters-array.js";
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus(
      "Downloaded characters-array.js — replace the CHARACTERS array in characters.js, then commit. Play counts stay on each device."
    );
  }

  function isOpen() {
    return Boolean(root && !root.hidden);
  }

  function open() {
    if (!root) return;
    if (typeof CharactersFullscreen !== "undefined") {
      CharactersFullscreen.setActive(false);
    }
    closeMenu();
    filterText = "";
    if (searchEl) searchEl.value = "";
    selectedKey = null;
    formEl.hidden = true;
    formEl.dataset.mode = "edit";
    fillCategoryOptions();
    renderList();
    setStatus("");
    root.hidden = false;
    root.setAttribute("aria-hidden", "false");
    document.body.classList.add("character-edit-module-open");
    searchEl?.focus();
  }

  function close() {
    if (!root || root.hidden) return;
    root.hidden = true;
    root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("character-edit-module-open");
  }

  function openClearConfirm() {
    closeMenu();
    if (!clearConfirmEl) return;
    clearConfirmEl.hidden = false;
    clearConfirmEl.setAttribute("aria-hidden", "false");
    clearConfirmEl.querySelector("[data-clear-history-yes]")?.focus();
  }

  function closeClearConfirm() {
    if (!clearConfirmEl || clearConfirmEl.hidden) return;
    clearConfirmEl.hidden = true;
    clearConfirmEl.setAttribute("aria-hidden", "true");
  }

  root?.addEventListener("click", (event) => {
    if (event.target.closest("[data-character-edit-close]")) {
      close();
      return;
    }
    const rowBtn = event.target.closest(".character-edit-module__row");
    if (rowBtn?.dataset.key) {
      formEl.dataset.mode = "edit";
      selectKey(rowBtn.dataset.key);
      return;
    }
    if (event.target.closest("[data-character-edit-new]")) {
      startNew();
      return;
    }
    if (event.target.closest("[data-character-edit-remove]")) {
      removeSelected();
      return;
    }
    if (event.target.closest("[data-character-edit-export]")) {
      downloadExport();
    }
  });

  searchEl?.addEventListener("input", () => {
    filterText = searchEl.value.trim().toLowerCase();
    renderList();
  });

  formEl?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (formEl.dataset.mode === "create") createNew();
    else saveSelected();
  });

  clearConfirmEl?.addEventListener("click", (event) => {
    if (event.target.closest("[data-clear-history-no], [data-clear-history-close]")) {
      closeClearConfirm();
      return;
    }
    if (event.target.closest("[data-clear-history-yes]")) {
      CharacterHistory.clear();
      closeClearConfirm();
      if (isOpen()) {
        renderList();
        if (selectedKey) loadForm(findRow(parseKey(selectedKey)));
        setStatus("Play history cleared on this device.");
      }
    }
  });

  document.querySelector("[data-menu-edit-characters]")?.addEventListener("click", () => {
    open();
  });

  document.querySelector("[data-menu-clear-history]")?.addEventListener("click", () => {
    openClearConfirm();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (clearConfirmEl && !clearConfirmEl.hidden) {
      closeClearConfirm();
      return;
    }
    if (isOpen()) close();
  });

  return { open, close, isOpen };
})();
