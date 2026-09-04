/**
 * Winner module — shown once when Round 4 scores are fully entered.
 * First place uses a score-module-style color bar; second place is a smaller bar.
 */
const WinnerModule = (() => {
  const root = document.getElementById("winner-module");
  const titleEl = document.getElementById("winner-module-title");
  const firstEl = document.getElementById("winner-module-first");
  const secondWrapEl = document.getElementById("winner-module-second-wrap");
  const secondEl = document.getElementById("winner-module-second");

  function isOpen() {
    return Boolean(root && !root.hidden);
  }

  function buildHero(entry, sizeClass) {
    const hero = document.createElement("div");
    hero.className = `winner-module__hero ${sizeClass} box--${entry.color}`;
    hero.setAttribute(
      "aria-label",
      `${entry.name} — ${entry.score} points`
    );

    const overlay = document.createElement("div");
    overlay.className = "winner-module__overlay";

    const name = document.createElement("span");
    name.className = "winner-module__player-name";
    name.textContent = entry.name;

    const points = document.createElement("span");
    points.className = "winner-module__points";
    points.textContent = String(entry.score);

    overlay.append(name, points);
    hero.appendChild(overlay);
    return hero;
  }

  function open(podium) {
    if (!root) return;

    const first = podium?.first || [];
    const second = podium?.second || [];
    if (!first.length) return;

    const tied = first.length > 1;
    if (titleEl) {
      titleEl.textContent = tied ? "It's a tie!" : "Winner!";
    }

    if (firstEl) {
      firstEl.replaceChildren();
      first.forEach((entry) => {
        firstEl.appendChild(buildHero(entry, "winner-module__hero--first"));
      });
    }

    if (secondWrapEl && secondEl) {
      secondEl.replaceChildren();
      if (second.length) {
        secondWrapEl.hidden = false;
        second.forEach((entry) => {
          secondEl.appendChild(buildHero(entry, "winner-module__hero--second"));
        });
      } else {
        secondWrapEl.hidden = true;
      }
    }

    root.hidden = false;
    root.setAttribute("aria-hidden", "false");
    document.body.classList.add("winner-module-open");
    root.querySelector("[data-winner-module-close]")?.focus();
  }

  function close() {
    if (!root || root.hidden) return;
    root.hidden = true;
    root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("winner-module-open");
  }

  root?.addEventListener("click", (event) => {
    if (event.target.closest("[data-winner-module-close]")) {
      close();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      close();
    }
  });

  return { open, close, isOpen };
})();
