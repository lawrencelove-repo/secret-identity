/**
 * Main-stage sizing configurator (configurator branch only).
 * Click an element → edit related CSS tokens live → export for styles.css.
 */
const ConfiguratorModule = (() => {
  const root = document.getElementById("configurator-module");
  const propsEl = document.getElementById("configurator-props");
  const targetTitleEl = document.getElementById("configurator-target-title");
  const targetPathEl = document.getElementById("configurator-target-path");
  const inspectorEl = document.getElementById("configurator-inspector");
  const layoutSelect = document.getElementById("configurator-layout");
  const formFactorSelect = document.getElementById("configurator-form-factor");
  const statusEl = document.getElementById("configurator-status");

  /** @type {Map<string, string>} varName → value */
  const overrides = new Map();
  /** @type {string|null} */
  let activeTargetId = null;
  /** @type {Element|null} */
  let selectedEl = null;
  /** @type {string|null} */
  let focusVar = null;
  let collapsed = false;

  const FORM_FACTORS = {
    auto: null,
    "ipad-landscape": { width: 1180, height: 820, label: "iPad landscape" },
    "ipad-portrait": { width: 820, height: 1180, label: "iPad portrait" },
    "ipad-pro-landscape": { width: 1366, height: 1024, label: "iPad Pro landscape" },
    "ipad-pro-portrait": { width: 1024, height: 1366, label: "iPad Pro portrait" },
    desktop: { width: 1440, height: 900, label: "Desktop" },
    compact: { width: 390, height: 844, label: "Compact phone" },
  };

  /**
   * Editable targets. Most specific match wins (higher priority).
   * `layouts`: which preview modes show these props (empty = all).
   */
  const TARGETS = [
    {
      id: "round-num",
      label: "Round number button",
      priority: 90,
      match: (el) => el.closest(".round-indicator__num"),
      highlight: (el) => el.closest(".round-indicator__num"),
      layouts: ["landscape", "portrait"],
      props: [
        { varName: "--round-num-size-art", label: "Button size (art H)", kind: "art", step: 2, defaultValue: "48" },
        { varName: "--round-num-font-art", label: "Font (art H)", kind: "art", step: 1, defaultValue: "28" },
        {
          varName: "--portrait-round-num-size",
          label: "Portrait button size",
          kind: "css",
          step: 0.05,
          defaultValue: "clamp(1.55rem, 4.3cqh, 2.45rem)",
          layouts: ["portrait"],
        },
        {
          varName: "--portrait-round-num-font",
          label: "Portrait font",
          kind: "css",
          step: 0.05,
          defaultValue: "clamp(0.85rem, 2.7cqh, 1.4rem)",
          layouts: ["portrait"],
        },
      ],
    },
    {
      id: "round-label",
      label: "Round label",
      priority: 85,
      match: (el) => el.closest(".round-indicator__label"),
      highlight: (el) => el.closest(".round-indicator__label"),
      layouts: ["landscape", "portrait"],
      props: [
        { varName: "--round-label-font-art", label: "Font (art H)", kind: "art", step: 1, defaultValue: "42" },
        {
          varName: "--portrait-round-label-font",
          label: "Portrait font",
          kind: "css",
          step: 0.05,
          defaultValue: "clamp(1.15rem, 3.7cqh, 2.05rem)",
          layouts: ["portrait"],
        },
      ],
    },
    {
      id: "round-indicator",
      label: "Round indicator",
      priority: 70,
      match: (el) => el.closest(".round-indicator"),
      highlight: (el) => el.closest(".round-indicator"),
      layouts: ["landscape", "portrait"],
      children: [
        { label: "Label", selector: ".round-indicator__label" },
        { label: "Number", selector: ".round-indicator__num" },
      ],
      props: [
        { varName: "--round-indicator-gap", label: "Gap", kind: "css", step: 0.05, defaultValue: "0.85em", group: "Layout" },
        { varName: "--round-indicator-pad", label: "Padding", kind: "css", step: 0.05, defaultValue: "0.2em 0.2em 0.45em", group: "Layout" },
        { varName: "--round-label-font-art", label: "Label font (art H)", kind: "art", step: 1, defaultValue: "42", group: "Text" },
        { varName: "--round-num-font-art", label: "Number font (art H)", kind: "art", step: 1, defaultValue: "28", group: "Text" },
        { varName: "--round-num-size-art", label: "Number button size (art H)", kind: "art", step: 2, defaultValue: "48", group: "Text" },
        {
          varName: "--portrait-round-label-font",
          label: "Portrait label font",
          kind: "css",
          step: 0.05,
          defaultValue: "clamp(1.15rem, 3.7cqh, 2.05rem)",
          layouts: ["portrait"],
          group: "Text",
        },
        {
          varName: "--portrait-round-num-font",
          label: "Portrait number font",
          kind: "css",
          step: 0.05,
          defaultValue: "clamp(0.85rem, 2.7cqh, 1.4rem)",
          layouts: ["portrait"],
          group: "Text",
        },
      ],
    },
    {
      id: "box-number",
      label: "Character number badge",
      priority: 90,
      match: (el) => el.closest(".box__number"),
      highlight: (el) => el.closest(".box__number") || first(".column__boxes .box__number"),
      layouts: ["landscape", "portrait", "fullscreen"],
      props: [
        { varName: "--number-size-art", label: "Badge size (art W)", kind: "art", step: 2, defaultValue: "56" },
        { varName: "--number-font-art", label: "Font (art H)", kind: "art", step: 1, defaultValue: "28" },
        { varName: "--number-left", label: "Left offset", kind: "css", step: 0.25, defaultValue: "7.5%" },
        {
          varName: "--portrait-box-number-size",
          label: "Portrait badge size",
          kind: "css",
          step: 0.05,
          defaultValue: "clamp(1.85rem, 6.2cqh, 3.35rem)",
          layouts: ["portrait"],
        },
        {
          varName: "--portrait-number-font",
          label: "Portrait font",
          kind: "css",
          step: 0.05,
          defaultValue: "clamp(0.95rem, 3.1cqh, 1.65rem)",
          layouts: ["portrait"],
        },
        {
          varName: "--fs-number-size",
          label: "Fullscreen badge size",
          kind: "css",
          step: 0.05,
          defaultValue: "clamp(3.75rem, 11vmin, 7rem)",
          layouts: ["fullscreen"],
        },
        {
          varName: "--fs-number-font",
          label: "Fullscreen font",
          kind: "css",
          step: 0.05,
          defaultValue: "clamp(1.85rem, 5.5vmin, 3.5rem)",
          layouts: ["fullscreen"],
        },
      ],
    },
    {
      id: "box-name",
      label: "Character name",
      priority: 88,
      match: (el) => el.closest(".box__name"),
      highlight: (el) => el.closest(".box__name") || first(".column__boxes .box__name"),
      layouts: ["landscape", "portrait", "fullscreen"],
      props: [
        { varName: "--name-font-art", label: "Font (art H)", kind: "art", step: 1, defaultValue: "42" },
        {
          varName: "--portrait-name-font",
          label: "Portrait font",
          kind: "css",
          step: 0.05,
          defaultValue: "clamp(1.2rem, 4.5cqh, 2.4rem)",
          layouts: ["portrait"],
        },
        {
          varName: "--fs-name-font",
          label: "Fullscreen font",
          kind: "css",
          step: 0.05,
          defaultValue: "clamp(1.45rem, 4.6vmin, 2.75rem)",
          layouts: ["fullscreen"],
        },
        {
          varName: "--fs-flip-name-font",
          label: "Fullscreen flip font",
          kind: "css",
          step: 0.05,
          defaultValue: "clamp(1.15rem, 3.6vmin, 2.15rem)",
          layouts: ["fullscreen"],
        },
      ],
    },
    {
      id: "box-qualifier",
      label: "Character qualifier",
      priority: 87,
      match: (el) => el.closest(".box__qualifier"),
      highlight: (el) => el.closest(".box__qualifier") || first(".column__boxes .box__qualifier"),
      layouts: ["landscape", "portrait", "fullscreen"],
      props: [
        { varName: "--qualifier-font-art", label: "Font (art H)", kind: "art", step: 1, defaultValue: "22" },
        { varName: "--qualifier-gap", label: "Gap above qualifier", kind: "css", step: 0.05, defaultValue: "0.15em" },
        {
          varName: "--portrait-qualifier-font",
          label: "Portrait font",
          kind: "css",
          step: 0.05,
          defaultValue: "clamp(0.72rem, 2.55cqh, 1.35rem)",
          layouts: ["portrait"],
        },
        {
          varName: "--fs-qualifier-font",
          label: "Fullscreen font",
          kind: "css",
          step: 0.05,
          defaultValue: "clamp(0.85rem, 2.5vmin, 1.35rem)",
          layouts: ["fullscreen"],
        },
        {
          varName: "--fs-flip-qualifier-font",
          label: "Fullscreen flip font",
          kind: "css",
          step: 0.05,
          defaultValue: "clamp(0.7rem, 2vmin, 1.1rem)",
          layouts: ["fullscreen"],
        },
      ],
    },
    {
      id: "player-name",
      label: "Player name",
      priority: 86,
      match: (el) => el.closest(".box__player-name"),
      highlight: (el) => el.closest(".box__player-name") || first(".players-panel .box__player-name"),
      layouts: ["landscape", "portrait"],
      children: [{ label: "Player box", selector: ".box[data-color]", upward: true }],
      props: [
        { varName: "--player-name-font-art", label: "Font (art H)", kind: "art", step: 1, defaultValue: "36", group: "Text" },
        { varName: "--player-box-w-art", label: "Box width (art W)", kind: "art", step: 4, defaultValue: "960", group: "Box size" },
        { varName: "--player-box-h-art", label: "Box height (art H)", kind: "art", step: 2, defaultValue: "152", group: "Box size" },
        { varName: "--player-box-pad", label: "Box padding", kind: "css", step: 1, defaultValue: "0", group: "Box size" },
        { varName: "--score-pad", label: "Inner text padding", kind: "css", step: 1, defaultValue: "0 12% 0 8%", group: "Box size" },
      ],
    },
    {
      id: "player-points",
      label: "Player points",
      priority: 86,
      match: (el) => el.closest(".box__player-points"),
      highlight: (el) => el.closest(".box__player-points") || first(".players-panel .box__player-points"),
      layouts: ["landscape", "portrait"],
      children: [{ label: "Player box", selector: ".box[data-color]", upward: true }],
      props: [
        { varName: "--player-points-font-art", label: "Font (art H)", kind: "art", step: 1, defaultValue: "52", group: "Text" },
        { varName: "--player-box-w-art", label: "Box width (art W)", kind: "art", step: 4, defaultValue: "960", group: "Box size" },
        { varName: "--player-box-h-art", label: "Box height (art H)", kind: "art", step: 2, defaultValue: "152", group: "Box size" },
        { varName: "--player-box-pad", label: "Box padding", kind: "css", step: 1, defaultValue: "0", group: "Box size" },
        { varName: "--score-pad", label: "Inner text padding", kind: "css", step: 1, defaultValue: "0 12% 0 8%", group: "Box size" },
      ],
    },
    {
      id: "box-score",
      label: "Score overlay",
      priority: 55,
      match: (el) => el.closest(".box__score"),
      highlight: (el) => el.closest(".box__score") || first(".players-panel .box__score"),
      layouts: ["landscape", "portrait"],
      children: [
        { label: "Player box", selector: ".box[data-color]", upward: true },
        { label: "Player name", selector: ".box__player-name" },
        { label: "Points", selector: ".box__player-points" },
      ],
      props: [
        { varName: "--player-box-w-art", label: "Box width (art W)", kind: "art", step: 4, defaultValue: "960", group: "Size" },
        { varName: "--player-box-h-art", label: "Box height (art H)", kind: "art", step: 2, defaultValue: "152", group: "Size" },
        { varName: "--player-box-pad", label: "Box padding", kind: "css", step: 1, defaultValue: "0", group: "Size" },
        { varName: "--score-pad", label: "Inner text padding", kind: "css", step: 1, defaultValue: "0 12% 0 8%", group: "Size" },
        { varName: "--tabulated-width", label: "Tabulated plate width", kind: "css", step: 1, defaultValue: "30px", group: "Size" },
        { varName: "--player-name-font-art", label: "Name font (art H)", kind: "art", step: 1, defaultValue: "36", group: "Text" },
        { varName: "--player-points-font-art", label: "Points font (art H)", kind: "art", step: 1, defaultValue: "52", group: "Text" },
      ],
    },
    {
      id: "character-box",
      label: "Character box",
      priority: 60,
      match: (el) => {
        const box = el.closest(".box--black");
        return box && box.closest(".column__boxes") ? box : null;
      },
      highlight: (el) => el.closest(".box--black") || first(".column__boxes .box--black"),
      layouts: ["landscape", "portrait", "fullscreen"],
      children: [
        { label: "Number", selector: ".box__number" },
        { label: "Name", selector: ".box__name" },
        { label: "Qualifier", selector: ".box__qualifier" },
      ],
      props: [
        { varName: "--character-box-w-art", label: "Width (art W)", kind: "art", step: 4, defaultValue: "960", group: "Size" },
        { varName: "--character-box-h-art", label: "Height (art H)", kind: "art", step: 2, defaultValue: "152", group: "Size" },
        { varName: "--character-pad-left", label: "Text pad left", kind: "css", step: 0.25, defaultValue: "16.5%", group: "Size" },
        { varName: "--character-pad-right", label: "Text pad right", kind: "css", step: 0.25, defaultValue: "7%", group: "Size" },
        {
          varName: "--portrait-char-pad-gap",
          label: "Portrait badge→text gap",
          kind: "css",
          step: 0.05,
          defaultValue: "0.65rem",
          layouts: ["portrait"],
          group: "Size",
        },
        {
          varName: "--fs-char-pad-gap",
          label: "Fullscreen badge→text gap",
          kind: "css",
          step: 0.05,
          defaultValue: "1rem",
          layouts: ["fullscreen"],
          group: "Size",
        },
        {
          varName: "--fs-boxes-gap",
          label: "Fullscreen grid gap",
          kind: "css",
          step: 0.05,
          defaultValue: "clamp(0.45rem, 1.2vmin, 0.85rem)",
          layouts: ["fullscreen"],
          group: "Size",
        },
        { varName: "--name-font-art", label: "Name font (art H)", kind: "art", step: 1, defaultValue: "42", group: "Text" },
        { varName: "--qualifier-font-art", label: "Qualifier font (art H)", kind: "art", step: 1, defaultValue: "22", group: "Text" },
        { varName: "--number-font-art", label: "Number font (art H)", kind: "art", step: 1, defaultValue: "28", group: "Text" },
        {
          varName: "--portrait-name-font",
          label: "Portrait name font",
          kind: "css",
          step: 0.05,
          defaultValue: "clamp(1.2rem, 4.5cqh, 2.4rem)",
          layouts: ["portrait"],
          group: "Text",
        },
        {
          varName: "--portrait-qualifier-font",
          label: "Portrait qualifier font",
          kind: "css",
          step: 0.05,
          defaultValue: "clamp(0.72rem, 2.55cqh, 1.35rem)",
          layouts: ["portrait"],
          group: "Text",
        },
        {
          varName: "--fs-name-font",
          label: "Fullscreen name font",
          kind: "css",
          step: 0.05,
          defaultValue: "clamp(1.45rem, 4.6vmin, 2.75rem)",
          layouts: ["fullscreen"],
          group: "Text",
        },
        {
          varName: "--fs-qualifier-font",
          label: "Fullscreen qualifier font",
          kind: "css",
          step: 0.05,
          defaultValue: "clamp(0.85rem, 2.5vmin, 1.35rem)",
          layouts: ["fullscreen"],
          group: "Text",
        },
      ],
    },
    {
      id: "player-box",
      label: "Player color box",
      priority: 70,
      match: (el) => {
        const box = el.closest(".box[data-color]");
        return box && box.closest(".players-panel") ? box : null;
      },
      highlight: (el) => el.closest(".box[data-color]") || first(".players-panel .box"),
      layouts: ["landscape", "portrait"],
      children: [
        { label: "Players panel", selector: ".players-panel", upward: true },
        { label: "Player name", selector: ".box__player-name" },
        { label: "Points", selector: ".box__player-points" },
      ],
      props: [
        { varName: "--player-box-w-art", label: "Width (art W)", kind: "art", step: 4, defaultValue: "960", group: "Size" },
        { varName: "--player-box-h-art", label: "Height (art H)", kind: "art", step: 2, defaultValue: "152", group: "Size" },
        { varName: "--player-box-pad", label: "Box padding", kind: "css", step: 1, defaultValue: "0", group: "Size" },
        { varName: "--score-pad", label: "Inner text padding", kind: "css", step: 1, defaultValue: "0 12% 0 8%", group: "Size" },
        { varName: "--rivet-inset", label: "Rivet inset", kind: "css", step: 0.1, defaultValue: "3.2%", group: "Size" },
        { varName: "--rivet-size-art", label: "Rivet size (art W)", kind: "art", step: 1, defaultValue: "20", group: "Size" },
        {
          varName: "--portrait-panel-gap-factor",
          label: "Portrait seat gap factor",
          kind: "number",
          step: 0.05,
          defaultValue: "0.4",
          layouts: ["portrait"],
          group: "Size",
        },
        { varName: "--player-name-font-art", label: "Name font (art H)", kind: "art", step: 1, defaultValue: "36", group: "Text" },
        { varName: "--player-points-font-art", label: "Points font (art H)", kind: "art", step: 1, defaultValue: "52", group: "Text" },
      ],
    },
    {
      id: "players-panel",
      label: "Players panel",
      priority: 50,
      match: (el) => el.closest(".players-panel"),
      highlight: () => first(".players-panel"),
      layouts: ["landscape", "portrait"],
      children: [{ label: "Player box", selector: ".box[data-color]" }],
      props: [
        {
          varName: "--players-panel-width",
          label: "Width",
          kind: "css",
          step: 4,
          defaultValue: "calc(var(--player-box-width) + var(--players-panel-extra-w))",
          group: "Size",
        },
        { varName: "--players-panel-height", label: "Height", kind: "css", step: 4, defaultValue: "100%", group: "Size" },
        { varName: "--players-panel-pad", label: "Padding", kind: "css", step: 1, defaultValue: "14px 18px", group: "Size" },
        {
          varName: "--players-panel-gap",
          label: "Seat gap",
          kind: "css",
          step: 1,
          defaultValue: "calc((100% - 8 * var(--player-box-height)) / 7)",
          group: "Size",
        },
        { varName: "--players-panel-extra-w", label: "Extra width (feeds default width)", kind: "css", step: 1, defaultValue: "36px", group: "Size" },
        { varName: "--column-right-pad-top", label: "Column top pad", kind: "css", step: 0.1, defaultValue: "3.2%", group: "Size" },
        { varName: "--player-box-w-art", label: "Seat width (art W)", kind: "art", step: 4, defaultValue: "960", group: "Seats" },
        { varName: "--player-box-h-art", label: "Seat height (art H)", kind: "art", step: 2, defaultValue: "152", group: "Seats" },
        { varName: "--player-box-pad", label: "Seat padding", kind: "css", step: 1, defaultValue: "0", group: "Seats" },
      ],
    },
    {
      id: "columns",
      label: "Stage columns",
      priority: 40,
      match: (el) => el.closest(".columns"),
      highlight: () => first(".columns"),
      layouts: ["landscape", "portrait", "fullscreen"],
      props: [
        { varName: "--column-gap", label: "Column gap", kind: "css", step: 0.25, defaultValue: "6.5%" },
        { varName: "--columns-padding", label: "Columns padding", kind: "css", step: 0.1, defaultValue: "1.6% 0 2%" },
        { varName: "--column-left-gap", label: "Left column gap", kind: "css", step: 0.1, defaultValue: "1.2%" },
        {
          varName: "--portrait-columns-gap",
          label: "Portrait column gap",
          kind: "css",
          step: 0.25,
          defaultValue: "3.25%",
          layouts: ["portrait"],
        },
        {
          varName: "--portrait-columns-padding",
          label: "Portrait columns padding",
          kind: "css",
          step: 0.1,
          defaultValue: "1.1% 2.4% 1.4%",
          layouts: ["portrait"],
        },
        {
          varName: "--portrait-column-left-gap",
          label: "Portrait left gap",
          kind: "css",
          step: 0.05,
          defaultValue: "0.75%",
          layouts: ["portrait"],
        },
        {
          varName: "--portrait-boxes-gap",
          label: "Portrait character gaps",
          kind: "css",
          step: 0.05,
          defaultValue: "0.65%",
          layouts: ["portrait"],
        },
        {
          varName: "--fs-columns-padding",
          label: "Fullscreen columns padding",
          kind: "css",
          step: 0.1,
          defaultValue:
            "1.5% 2% calc(env(safe-area-inset-bottom, 0px) + 4rem) calc(env(safe-area-inset-left, 0px) + 7.5rem)",
          layouts: ["fullscreen"],
        },
      ],
    },
    {
      id: "stage",
      label: "Stage",
      priority: 10,
      match: (el) => el.closest(".stage"),
      highlight: () => first(".stage"),
      layouts: ["landscape", "portrait", "fullscreen"],
      props: [
        { varName: "--text-scale", label: "Global text scale", kind: "number", step: 0.05, defaultValue: "1" },
        { varName: "--column-gap", label: "Column gap", kind: "css", step: 0.25, defaultValue: "6.5%" },
        { varName: "--character-box-w-art", label: "Character box width", kind: "art", step: 4, defaultValue: "960" },
        { varName: "--character-box-h-art", label: "Character box height", kind: "art", step: 2, defaultValue: "152" },
        { varName: "--player-box-w-art", label: "Player box width", kind: "art", step: 4, defaultValue: "960" },
        { varName: "--player-box-h-art", label: "Player box height", kind: "art", step: 2, defaultValue: "152" },
      ],
    },
  ];

  function first(selector) {
    return document.querySelector(selector);
  }

  function isActive() {
    return document.body.classList.contains("configurator-active");
  }

  function currentLayout() {
    return layoutSelect?.value || "auto";
  }

  function effectiveLayout() {
    const mode = currentLayout();
    if (mode === "portrait") return "portrait";
    if (mode === "fullscreen") return "fullscreen";
    if (mode === "landscape") return "landscape";
    if (document.body.classList.contains("characters-fullscreen")) return "fullscreen";
    if (document.body.classList.contains("is-portrait-layout")) return "portrait";
    return "landscape";
  }

  function setStatus(message) {
    if (statusEl) statusEl.textContent = message || "";
  }

  function describeElement(el) {
    if (!el || el.nodeType !== 1) return "(none)";
    const tag = el.tagName.toLowerCase();
    const id = el.id ? `#${el.id}` : "";
    const classes = el.classList?.length
      ? `.${Array.from(el.classList).filter((c) => !c.startsWith("configurator-")).join(".")}`
      : "";
    const attrs = [];
    if (el.dataset?.slot) attrs.push(`data-slot="${el.dataset.slot}"`);
    if (el.dataset?.color) attrs.push(`data-color="${el.dataset.color}"`);
    if (el.dataset?.round) attrs.push(`data-round="${el.dataset.round}"`);
    const attrText = attrs.length ? `[${attrs.join("][")}]` : "";
    return `${tag}${id}${classes}${attrText}`;
  }

  function resolveTarget(el) {
    if (!el || !el.closest) return null;
    if (!el.closest(".stage")) return null;
    let best = null;
    for (const target of TARGETS) {
      const hit = target.match(el);
      if (!hit) continue;
      if (!best || target.priority > best.priority) best = target;
    }
    return best;
  }

  function propsForTarget(target) {
    const layout = effectiveLayout();
    return (target?.props || []).filter((prop) => {
      if (prop.layouts && !prop.layouts.includes(layout)) return false;
      if (target.layouts && !target.layouts.includes(layout) && layout !== "auto") {
        /* target already filtered at select time */
      }
      return true;
    });
  }

  function readComputedVar(varName, fallback) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    return raw || fallback || "";
  }

  function currentValue(prop) {
    if (overrides.has(prop.varName)) return overrides.get(prop.varName);
    return readComputedVar(prop.varName, prop.defaultValue);
  }

  function applyOverride(varName, value) {
    const trimmed = String(value).trim();
    if (!trimmed) {
      overrides.delete(varName);
      document.documentElement.style.removeProperty(varName);
      return;
    }
    overrides.set(varName, trimmed);
    document.documentElement.style.setProperty(varName, trimmed);
  }

  function clearHighlights() {
    document.querySelectorAll(".configurator-highlight").forEach((node) => {
      node.classList.remove("configurator-highlight");
    });
    document.querySelectorAll(".configurator-prop-focus").forEach((node) => {
      node.classList.remove("configurator-prop-focus");
    });
  }

  function highlightFor(target, el, propVar) {
    clearHighlights();
    if (!target) return;
    const primary = (target.highlight && target.highlight(el || selectedEl)) || selectedEl;
    if (primary) primary.classList.add("configurator-highlight");

    // When focusing a font/spacing control, also mark every matching sample.
    if (propVar) {
      const map = {
        "--name-font-art": ".box__name",
        "--portrait-name-font": ".column__boxes .box__name",
        "--fs-name-font": ".column__boxes .box__name",
        "--fs-flip-name-font": ".column__boxes .box__name",
        "--qualifier-font-art": ".box__qualifier",
        "--portrait-qualifier-font": ".column__boxes .box__qualifier",
        "--fs-qualifier-font": ".column__boxes .box__qualifier",
        "--number-size-art": ".box__number",
        "--number-font-art": ".box__number",
        "--portrait-box-number-size": ".column__boxes .box__number",
        "--player-name-font-art": ".box__player-name",
        "--player-points-font-art": ".box__player-points",
        "--round-num-size-art": ".round-indicator__num",
        "--round-num-font-art": ".round-indicator__num",
        "--round-label-font-art": ".round-indicator__label",
        "--character-box-w-art": ".column__boxes .box",
        "--character-box-h-art": ".column__boxes .box",
        "--player-box-w-art": ".players-panel .box",
        "--player-box-h-art": ".players-panel .box",
        "--player-box-pad": ".players-panel .box",
        "--players-panel-width": ".players-panel",
        "--players-panel-height": ".players-panel",
        "--players-panel-pad": ".players-panel",
        "--players-panel-gap": ".players-panel",
      };
      const selector = map[propVar];
      if (selector) {
        document.querySelectorAll(selector).forEach((node) => {
          node.classList.add("configurator-prop-focus");
        });
      }
    }
  }

  function parseNumericToken(value) {
    const match = String(value).trim().match(/^(-?[\d.]+)\s*([a-z%]*)$/i);
    if (!match) return null;
    return { number: Number(match[1]), unit: match[2] || "" };
  }

  function nudgeValue(prop, direction) {
    const value = currentValue(prop);
    const step = Number(prop.step) || 1;
    const parsed = parseNumericToken(value);
    if (parsed && Number.isFinite(parsed.number)) {
      const next = +(parsed.number + direction * step).toFixed(4);
      return `${next}${parsed.unit}`;
    }
    // clamp(min, preferred, max) — nudge the preferred middle token when possible
    const clampMatch = value.match(
      /^clamp\(\s*([^,]+)\s*,\s*(-?[\d.]+)([a-z%]*)\s*,\s*([^)]+)\)$/i
    );
    if (clampMatch) {
      const mid = +(Number(clampMatch[2]) + direction * step).toFixed(4);
      return `clamp(${clampMatch[1].trim()}, ${mid}${clampMatch[3]}, ${clampMatch[4].trim()})`;
    }
    return value;
  }

  function renderProps() {
    if (!propsEl) return;
    propsEl.replaceChildren();
    const target = TARGETS.find((entry) => entry.id === activeTargetId);
    if (!target) {
      propsEl.innerHTML =
        '<p class="configurator-empty">Tap an element on the stage to edit its sizing tokens.</p>';
      return;
    }

    const props = propsForTarget(target);
    if (!props.length && !(target.children && target.children.length)) {
      propsEl.innerHTML =
        '<p class="configurator-empty">No tokens for this element in the current layout mode. Try Landscape / Portrait / Fullscreen.</p>';
      return;
    }

    if (target.children?.length && selectedEl) {
      const childBar = document.createElement("div");
      childBar.className = "configurator-children";
      const childLabel = document.createElement("div");
      childLabel.className = "configurator-group__title";
      childLabel.textContent = "Parts — click on stage or here";
      childBar.append(childLabel);

      const chips = document.createElement("div");
      chips.className = "configurator-children__chips";
      target.children.forEach((child) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "configurator-child-chip";
        chip.textContent = child.label;
        chip.addEventListener("click", () => {
          const scope = selectedEl;
          if (!scope) return;
          let nested = null;
          if (child.upward) {
            nested = scope.closest?.(child.selector) || null;
          } else if (scope.matches?.(child.selector)) {
            nested = scope;
          } else {
            nested = scope.querySelector?.(child.selector) || null;
          }
          if (nested) selectElement(nested);
          else setStatus(`No “${child.label}” found in this element.`);
        });
        chips.append(chip);
      });
      childBar.append(chips);
      propsEl.append(childBar);
    }

    const groups = [];
    props.forEach((prop) => {
      const groupName = prop.group || "Controls";
      let group = groups.find((entry) => entry.name === groupName);
      if (!group) {
        group = { name: groupName, props: [] };
        groups.push(group);
      }
      group.props.push(prop);
    });

    groups.forEach((group) => {
      const heading = document.createElement("div");
      heading.className = "configurator-group__title";
      heading.textContent = group.name;
      propsEl.append(heading);

      group.props.forEach((prop) => {
        const row = document.createElement("div");
        row.className = "configurator-prop";
        row.dataset.var = prop.varName;
        if (focusVar === prop.varName) row.classList.add("is-focused");

        const label = document.createElement("label");
        label.className = "configurator-prop__label";
        label.textContent = prop.label;

        const varTag = document.createElement("code");
        varTag.className = "configurator-prop__var";
        varTag.textContent = prop.varName;

        const controls = document.createElement("div");
        controls.className = "configurator-prop__controls";

        const minus = document.createElement("button");
        minus.type = "button";
        minus.className = "configurator-step";
        minus.textContent = "−";
        minus.setAttribute("aria-label", `Decrease ${prop.label}`);

        const input = document.createElement("input");
        input.type = "text";
        input.className = "configurator-prop__input";
        input.value = currentValue(prop);
        input.spellcheck = false;
        input.autocapitalize = "off";

        const plus = document.createElement("button");
        plus.type = "button";
        plus.className = "configurator-step";
        plus.textContent = "+";
        plus.setAttribute("aria-label", `Increase ${prop.label}`);

        const stepHint = document.createElement("span");
        stepHint.className = "configurator-prop__step";
        stepHint.textContent = `±${prop.step}`;

        const focusProp = () => {
          focusVar = prop.varName;
          propsEl.querySelectorAll(".configurator-prop").forEach((node) => {
            node.classList.toggle("is-focused", node.dataset.var === prop.varName);
          });
          const t = TARGETS.find((entry) => entry.id === activeTargetId);
          highlightFor(t, selectedEl, prop.varName);
        };

        minus.addEventListener("click", () => {
          focusProp();
          applyOverride(prop.varName, nudgeValue(prop, -1));
          input.value = currentValue(prop);
        });
        plus.addEventListener("click", () => {
          focusProp();
          applyOverride(prop.varName, nudgeValue(prop, 1));
          input.value = currentValue(prop);
        });
        input.addEventListener("focus", focusProp);
        input.addEventListener("input", () => {
          focusProp();
          applyOverride(prop.varName, input.value);
        });

        controls.append(minus, input, plus, stepHint);
        row.append(label, varTag, controls);
        propsEl.append(row);
      });
    });
  }

  function selectElement(el) {
    const target = resolveTarget(el);
    selectedEl = el;
    activeTargetId = target ? target.id : null;
    focusVar = null;

    if (targetTitleEl) {
      targetTitleEl.textContent = target ? target.label : "No editable target";
    }
    if (targetPathEl) {
      targetPathEl.textContent = describeElement(el);
    }
    if (inspectorEl) {
      inspectorEl.hidden = false;
      inspectorEl.textContent = describeElement(el);
    }

    highlightFor(target, el, null);
    renderProps();
  }

  function applyLayoutMode(mode) {
    const html = document.documentElement;
    const body = document.body;

    if (mode === "auto") {
      delete html.dataset.configuratorOrientationLock;
      if (typeof CharactersFullscreen !== "undefined") {
        CharactersFullscreen.setActive(false);
      }
      if (typeof AppViewport !== "undefined") AppViewport.syncPortraitClass();
      return;
    }

    html.dataset.configuratorOrientationLock = mode;

    if (mode === "fullscreen") {
      body.classList.remove("is-portrait-layout");
      if (typeof CharactersFullscreen !== "undefined") {
        CharactersFullscreen.setActive(true);
      }
      return;
    }

    if (typeof CharactersFullscreen !== "undefined") {
      CharactersFullscreen.setActive(false);
    }
    body.classList.toggle("is-portrait-layout", mode === "portrait");
  }

  function applyFormFactor(key) {
    const html = document.documentElement;
    const preset = FORM_FACTORS[key] || null;
    html.dataset.configuratorFormFactor = key || "auto";

    if (!preset) {
      html.classList.remove("configurator-sim-frame");
      if (typeof AppViewport !== "undefined") AppViewport.updateViewportSize();
      return;
    }

    html.classList.add("configurator-sim-frame");
    html.style.setProperty("--app-width", `${preset.width}px`);
    html.style.setProperty("--app-height", `${preset.height}px`);
    html.style.setProperty("--configurator-sim-w", `${preset.width}px`);
    html.style.setProperty("--configurator-sim-h", `${preset.height}px`);

    // Match orientation class to the simulated aspect when layout mode is Auto.
    if (currentLayout() === "auto") {
      document.body.classList.toggle("is-portrait-layout", preset.height > preset.width);
    }
  }

  function exportCssText() {
    const lines = [
      "/* Secret Identity — main stage sizing export",
      ` * Generated: ${new Date().toISOString()}`,
      ` * Layout preview: ${effectiveLayout()}`,
      ` * Form factor: ${formFactorSelect?.value || "auto"}`,
      " * Paste these custom properties into styles.css (:root / portrait / fullscreen).",
      " */",
      "",
      ":root {",
    ];

    const ordered = [...overrides.entries()].sort(([a], [b]) => a.localeCompare(b));
    if (!ordered.length) {
      lines.push("  /* (no overrides — defaults unchanged) */");
    } else {
      ordered.forEach(([name, value]) => {
        lines.push(`  ${name}: ${value};`);
      });
    }
    lines.push("}", "");
    return lines.join("\n");
  }

  async function copyExport() {
    const text = exportCssText();
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied CSS overrides to clipboard.");
    } catch {
      // Fallback for older iPad Safari / insecure context
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
        setStatus("Copied CSS overrides to clipboard.");
      } catch {
        setStatus("Copy failed — use Download instead.");
      }
      area.remove();
    }
  }

  function downloadExport() {
    const text = exportCssText();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    anchor.href = url;
    anchor.download = `secret-identity-sizing-${stamp}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setStatus("Downloaded sizing export.");
  }

  function resetOverrides() {
    overrides.forEach((_value, name) => {
      document.documentElement.style.removeProperty(name);
    });
    overrides.clear();
    renderProps();
    setStatus("Reset all configurator overrides.");
  }

  function onStagePointer(event) {
    if (!isActive()) return;
    if (event.target.closest("#configurator-module")) return;
    if (event.target.closest("#configurator-inspector")) return;
    if (!event.target.closest(".stage")) return;

    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === "function") {
      event.stopImmediatePropagation();
    }

    const el = event.target.closest(".stage *") || event.target;
    selectElement(el);
  }

  function seedDemoGame() {
    if (typeof ResumeGameModule !== "undefined" && ResumeGameModule.isOpen?.()) {
      ResumeGameModule.close();
    }
    if (typeof NewGameModule !== "undefined" && NewGameModule.isOpen?.()) {
      NewGameModule.close();
    }

    if (typeof RoundModule === "undefined") return;

    const colors = ["green", "red", "yellow", "purple"];
    RoundModule.startNewGame(colors);
    RoundModule.setPlayerName("green", "Alex");
    RoundModule.setPlayerName("red", "Blake");
    RoundModule.setPlayerName("yellow", "Casey");
    RoundModule.setPlayerName("purple", "Drew");
    RoundModule.commitPlayerRoundScore(1, "green", 7);
    RoundModule.commitPlayerRoundScore(1, "red", 4);
    RoundModule.commitPlayerRoundScore(1, "yellow", 9);
    RoundModule.commitPlayerRoundScore(1, "purple", 2);
    RoundModule.refreshView?.();
  }

  function setCollapsed(next) {
    collapsed = Boolean(next);
    root?.classList.toggle("is-collapsed", collapsed);
    document.body.classList.toggle("configurator-collapsed", collapsed);
  }

  function open() {
    if (!root) return;
    document.body.classList.add("configurator-active");
    root.hidden = false;
    root.setAttribute("aria-hidden", "false");
    seedDemoGame();
    applyLayoutMode(currentLayout());
    applyFormFactor(formFactorSelect?.value || "auto");
    setStatus("Click any stage element. Game actions are blocked while configuring.");
    if (inspectorEl) {
      inspectorEl.hidden = false;
      inspectorEl.textContent = "Click an element…";
    }
  }

  function close() {
    document.body.classList.remove("configurator-active", "configurator-collapsed");
    clearHighlights();
    delete document.documentElement.dataset.configuratorOrientationLock;
    delete document.documentElement.dataset.configuratorFormFactor;
    document.documentElement.classList.remove("configurator-sim-frame");
    if (typeof AppViewport !== "undefined") AppViewport.update();
    if (root) {
      root.hidden = true;
      root.setAttribute("aria-hidden", "true");
    }
    if (inspectorEl) inspectorEl.hidden = true;
  }

  function bindUi() {
    root?.addEventListener("click", (event) => {
      if (event.target.closest("[data-configurator-collapse]")) {
        setCollapsed(!collapsed);
        return;
      }
      if (event.target.closest("[data-configurator-copy]")) {
        copyExport();
        return;
      }
      if (event.target.closest("[data-configurator-download]")) {
        downloadExport();
        return;
      }
      if (event.target.closest("[data-configurator-reset]")) {
        resetOverrides();
      }
    });

    layoutSelect?.addEventListener("change", () => {
      applyLayoutMode(currentLayout());
      renderProps();
      const target = TARGETS.find((entry) => entry.id === activeTargetId);
      highlightFor(target, selectedEl, focusVar);
      setStatus(`Layout preview: ${effectiveLayout()}`);
    });

    formFactorSelect?.addEventListener("change", () => {
      applyFormFactor(formFactorSelect.value);
      setStatus(`Form factor: ${formFactorSelect.value}`);
    });

    // Capture phase so character / score / round clicks never fire.
    document.addEventListener("click", onStagePointer, true);
    document.addEventListener(
      "pointerdown",
      (event) => {
        if (!isActive()) return;
        if (event.target.closest("#configurator-module")) return;
        if (!event.target.closest(".stage")) return;
        // Prevent :active press affordances from feeling like game taps.
        event.stopPropagation();
      },
      true
    );
  }

  bindUi();

  // Auto-start on this branch once modules are ready.
  window.addEventListener("load", () => {
    window.setTimeout(() => open(), 0);
  });

  return {
    open,
    close,
    isActive,
    selectElement,
    exportCssText,
  };
})();
