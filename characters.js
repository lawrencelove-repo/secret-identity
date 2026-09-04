/**
 * Seed list of celebrities / pop-culture characters.
 * Add more entries over time — boxes pull random picks on load.
 *
 * Optional fields:
 *   category    — used to limit how many of the same type appear at once
 *   description — shown under the name when present; richer uses later
 */
const CHARACTERS = [
  {
    name: "Ariana Grande",
    category: "Celebrity",
  },
  {
    name: "Joan of Arc",
    category: "Historical figure",
  },
  {
    name: "Ted Lasso",
    category: "TV character",
  },
  {
    name: "Sonic",
    category: "Cartoon character",
  },
  {
    name: "Buzz Lightyear",
    category: "Movie character",
    description: "Toy Story",
  },
  {
    name: "Peter Pan",
    category: "Literary character",
  },
  {
    name: "Betty Boop",
    category: "Cartoon character",
  },
  {
    name: "Wednesday Addams",
    category: "TV character",
    description: "The Addams Family",
  },
  {
    name: "Carrie Bradshaw",
    description: "Sex and the City",
  },
];

/** Max characters that may share the same category in one deal. */
const MAX_PER_CATEGORY = 2;

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Pick `count` unique characters, allowing at most MAX_PER_CATEGORY
 * from any single category. Entries without a category are unrestricted.
 */
function pickCharacters(count) {
  const pool = shuffle(CHARACTERS);
  const picks = [];
  const categoryCounts = Object.create(null);

  for (const character of pool) {
    if (picks.length >= count) break;

    const category = character.category;
    if (category) {
      const used = categoryCounts[category] || 0;
      if (used >= MAX_PER_CATEGORY) continue;
      categoryCounts[category] = used + 1;
    }

    picks.push(character);
  }

  if (picks.length < count) {
    console.warn(
      `Could only pick ${picks.length} of ${count} characters under the ` +
        `max-${MAX_PER_CATEGORY}-per-category rule. Add more variety to CHARACTERS.`
    );
  }

  return picks;
}

function renderCharacter(container, character) {
  container.replaceChildren();

  const nameEl = document.createElement("span");
  nameEl.className = "box__name";
  nameEl.textContent = character.name;
  container.appendChild(nameEl);

  if (character.description) {
    const descEl = document.createElement("span");
    descEl.className = "box__qualifier";
    descEl.textContent = character.description;
    container.appendChild(descEl);
  }
}

function populateCharacterBoxes() {
  const slots = document.querySelectorAll(".column--left .box--black");
  const picks = pickCharacters(slots.length);

  slots.forEach((box, index) => {
    const characterEl = box.querySelector(".box__character");
    const character = picks[index];
    const slotNumber = index + 1;

    if (!character) {
      characterEl.replaceChildren();
      box.removeAttribute("data-character");
      delete box._character;
      box.setAttribute("aria-label", `Character slot ${slotNumber}`);
      return;
    }

    renderCharacter(characterEl, character);
    box._character = {
      number: slotNumber,
      name: character.name,
      category: character.category || null,
      description: character.description || null,
    };
    box.dataset.character = character.name;
    if (character.category) {
      box.dataset.category = character.category;
    } else {
      delete box.dataset.category;
    }
    box.setAttribute(
      "aria-label",
      `Character slot ${slotNumber}: ${character.name}`
    );
  });
}

function bindCharacterBoxClicks() {
  document.querySelector(".column--left")?.addEventListener("click", (event) => {
    const box = event.target.closest(".box--black");
    if (!box || !box._character) return;
    CharacterModule.open(box._character);
  });
}

populateCharacterBoxes();
bindCharacterBoxClicks();
