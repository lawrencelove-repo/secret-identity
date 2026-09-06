/**
 * Character edit module — manage roster, disable flags, and device play counts.
 * Definition changes persist in localStorage; use Export to update characters.js for git.
 * Play counts are always device-local.
 */
const CharacterEditModule = (() => {
  const root = document.getElementById("character-edit-module");
  const listEl = document.getElementById("character-edit-list");
  const searchEl = document.getElementById("character-edit-search");
  const categoryFilterEl = document.getElementById("character-edit-category-filter");
  const formEl = document.getElementById("character-edit-form");
  const statusEl = document.getElementById("character-edit-status");
  const clearConfirmEl = document.getElementById("clear-history-confirm");

  let selectedKey = null;
  let filterText = "";
  let filterCategory = "";
  /** @type {string[]} */
  let draftCategories = [];

  const chipsEl = document.getElementById("character-edit-category-chips");
  const categoryPickEl = document.getElementById("character-edit-category-pick");
  const categoryManageEl = document.getElementById("character-edit-category-manage");
  const categoryManageListEl = document.getElementById("character-edit-category-manage-list");
  const categoryNewEl = document.getElementById("character-edit-category-new");
  const categoriesFieldEl = document.getElementById("character-edit-categories-field");

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
    if (filterCategory) {
      const categories = CharacterCatalog.categoriesOf(row);
      if (!categories.includes(filterCategory)) return false;
    }

    if (!filterText) return true;
    const categoryText = CharacterCatalog.formatCategories(
      CharacterCatalog.categoriesOf(row)
    );
    const hay = `${row.name} ${categoryText} ${row.description || ""}`.toLowerCase();
    return hay.includes(filterText);
  }

  function fillCategoryOptions() {
    const categories = CategoryCatalog.list();

    if (categoryFilterEl) {
      const previous = filterCategory;
      categoryFilterEl.replaceChildren();

      const allOption = document.createElement("option");
      allOption.value = "";
      allOption.textContent = "All categories";
      categoryFilterEl.appendChild(allOption);

      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilterEl.appendChild(option);
      });

      filterCategory = previous && categories.includes(previous) ? previous : "";
      categoryFilterEl.value = filterCategory;
    }

    renderCategoryPick();
    if (categoryManageEl && !categoryManageEl.hidden) {
      renderCategoryManageList();
    }
  }

  function renderCategoryPick() {
    if (!categoryPickEl) return;
    const selected = new Set(draftCategories.map((item) => item.toLowerCase()));
    const available = CategoryCatalog.list().filter(
      (category) => !selected.has(category.toLowerCase())
    );

    categoryPickEl.replaceChildren();
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = available.length ? "Add category…" : "All categories added";
    categoryPickEl.appendChild(placeholder);

    available.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryPickEl.appendChild(option);
    });

    categoryPickEl.disabled = available.length === 0;
  }

  function renderCategoryChips() {
    if (!chipsEl) return;
    chipsEl.replaceChildren();

    if (!draftCategories.length) {
      const empty = document.createElement("span");
      empty.className = "character-edit-module__chips-empty";
      empty.textContent = "No categories yet";
      chipsEl.appendChild(empty);
      renderCategoryPick();
      return;
    }

    draftCategories.forEach((category) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "character-edit-module__chip";
      chip.dataset.removeCategory = category;
      chip.setAttribute("aria-label", `Remove ${category}`);
      chip.innerHTML = `<span>${escapeHtml(category)}</span><span aria-hidden="true">×</span>`;
      chipsEl.appendChild(chip);
    });

    renderCategoryPick();
  }

  function setDraftCategories(categories) {
    if (!categories || (Array.isArray(categories) && categories.length === 0)) {
      draftCategories = [];
    } else {
      draftCategories = CharacterCatalog.normalizeCategories(categories);
    }
    renderCategoryChips();
  }

  function addDraftCategory(category) {
    const label = String(category || "").trim();
    if (!label) return;
    if (draftCategories.some((item) => item.toLowerCase() === label.toLowerCase())) return;
    draftCategories = [...draftCategories, label];
    renderCategoryChips();
  }

  function removeDraftCategory(category) {
    draftCategories = draftCategories.filter(
      (item) => item.toLowerCase() !== String(category).toLowerCase()
    );
    renderCategoryChips();
  }

  function setCategoryManageOpen(openManage) {
    if (!categoryManageEl || !categoriesFieldEl) return;
    categoryManageEl.hidden = !openManage;
    categoriesFieldEl.hidden = openManage;
    if (openManage) {
      renderCategoryManageList();
      categoryNewEl?.focus();
    }
  }

  function renderCategoryManageList() {
    if (!categoryManageListEl) return;
    categoryManageListEl.replaceChildren();
    CategoryCatalog.list().forEach((category) => {
      const row = document.createElement("div");
      row.className = "character-edit-module__manage-row";
      row.dataset.category = category;

      const input = document.createElement("input");
      input.type = "text";
      input.className = "character-edit-module__manage-input";
      input.dataset.categoryRenameInput = "true";
      input.value = category;
      input.setAttribute("aria-label", `Rename ${category}`);

      const renameBtn = document.createElement("button");
      renameBtn.type = "button";
      renameBtn.className = "character-edit-module__btn";
      renameBtn.dataset.categoryRename = "true";
      renameBtn.textContent = "Rename";

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className =
        "character-edit-module__btn character-edit-module__btn--danger";
      deleteBtn.dataset.categoryDelete = "true";
      deleteBtn.textContent = "Delete";

      row.append(input, renameBtn, deleteBtn);
      categoryManageListEl.appendChild(row);
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
      const metaParts = [];
      const categoryText = CharacterCatalog.formatCategories(
        CharacterCatalog.categoriesOf(row)
      );
      if (categoryText) metaParts.push(categoryText);
      if (row.description) metaParts.push(row.description);
      if (row.disabled) metaParts.push("disabled");
      metaParts.push(`plays ${plays}`);

      btn.innerHTML = `
        <span class="character-edit-module__row-name">${escapeHtml(row.name)}</span>
        <span class="character-edit-module__row-meta">${escapeHtml(metaParts.join(" · "))}</span>
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
    setCategoryManageOpen(false);
    if (!row) {
      selectedKey = null;
      setDraftCategories([]);
      return;
    }
    formEl.querySelector("[name=name]").value = row.name || "";
    setDraftCategories(CharacterCatalog.categoriesOf(row));
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
      categories: draftCategories.length ? [...draftCategories] : ["Celebrity"],
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
    setDraftCategories([]);
    setCategoryManageOpen(false);
    formEl.querySelector("[name=description]").value = "";
    formEl.querySelector("[name=plays]").value = "0";
    formEl.querySelector("[name=disabled]").checked = false;
    const removeBtn = formEl.querySelector("[data-character-edit-remove]");
    if (removeBtn) removeBtn.hidden = true;
    formEl.dataset.mode = "create";
    fillCategoryOptions();
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
    filterCategory = "";
    if (searchEl) searchEl.value = "";
    if (categoryFilterEl) categoryFilterEl.value = "";
    selectedKey = null;
    formEl.hidden = true;
    formEl.dataset.mode = "edit";
    setDraftCategories([]);
    setCategoryManageOpen(false);
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
    setCategoryManageOpen(false);
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
      return;
    }
    if (event.target.closest("[data-manage-categories]")) {
      setCategoryManageOpen(true);
      return;
    }
    if (event.target.closest("[data-manage-categories-done]")) {
      setCategoryManageOpen(false);
      fillCategoryOptions();
      return;
    }
    if (event.target.closest("[data-add-category]")) {
      const value = categoryPickEl?.value;
      if (value) {
        addDraftCategory(value);
        if (categoryPickEl) categoryPickEl.value = "";
      }
      return;
    }
    const removeChip = event.target.closest("[data-remove-category]");
    if (removeChip?.dataset.removeCategory) {
      removeDraftCategory(removeChip.dataset.removeCategory);
      return;
    }
    if (event.target.closest("[data-category-manage-add]")) {
      const result = CategoryCatalog.add(categoryNewEl?.value || "");
      if (!result.ok) {
        setStatus(result.error || "Could not add category.", true);
        return;
      }
      if (categoryNewEl) categoryNewEl.value = "";
      fillCategoryOptions();
      renderCategoryManageList();
      setStatus(`Added category “${result.category}”.`);
      return;
    }
    const manageRow = event.target.closest(".character-edit-module__manage-row");
    if (manageRow?.dataset.category) {
      const current = manageRow.dataset.category;
      if (event.target.closest("[data-category-rename]")) {
        const input = manageRow.querySelector("[data-category-rename-input]");
        const result = CategoryCatalog.rename(current, input?.value || "");
        if (!result.ok) {
          setStatus(result.error || "Could not rename.", true);
          return;
        }
        draftCategories = draftCategories.map((item) =>
          item.toLowerCase() === current.toLowerCase() ? result.category : item
        );
        fillCategoryOptions();
        renderCategoryChips();
        renderCategoryManageList();
        setStatus(
          `Renamed to “${result.category}”${
            result.updated ? ` (${result.updated} characters updated)` : ""
          }.`
        );
        return;
      }
      if (event.target.closest("[data-category-delete]")) {
        const ok = window.confirm(
          `Delete category “${current}”? It will be removed from any characters that use it on this device.`
        );
        if (!ok) return;
        const result = CategoryCatalog.remove(current);
        if (!result.ok) {
          setStatus(result.error || "Could not delete.", true);
          return;
        }
        removeDraftCategory(current);
        fillCategoryOptions();
        renderCategoryManageList();
        if (selectedKey) {
          loadForm(findRow(parseKey(selectedKey)));
        }
        renderList();
        setStatus(
          `Deleted “${current}”${
            result.updated ? ` (${result.updated} characters updated)` : ""
          }.`
        );
      }
    }
  });

  categoryPickEl?.addEventListener("change", () => {
    const value = categoryPickEl.value;
    if (!value) return;
    addDraftCategory(value);
    categoryPickEl.value = "";
  });

  searchEl?.addEventListener("input", () => {
    filterText = searchEl.value.trim().toLowerCase();
    renderList();
  });

  categoryFilterEl?.addEventListener("change", () => {
    filterCategory = categoryFilterEl.value;
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
    if (categoryManageEl && !categoryManageEl.hidden) {
      setCategoryManageOpen(false);
      return;
    }
    if (isOpen()) close();
  });

  return { open, close, isOpen };
})();
