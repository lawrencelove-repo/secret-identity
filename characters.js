/**
 * Seed list of celebrities / pop-culture characters.
 * Add more entries over time — boxes pull random picks per round.
 *
 * Optional fields:
 *   category    — used to limit how many of the same type appear at once
 *   description — shown under the name when present; richer uses later
 */
const CHARACTERS = [
  { name: "Ariana Grande", category: "Celebrity" },
  { name: "Joan of Arc", category: "Historical figure" },
  { name: "Ted Lasso", category: "TV character" },
  { name: "Sonic", category: "Cartoon character" },
  { name: "Buzz Lightyear", category: "Movie character", description: "Toy Story" },
  { name: "Peter Pan", category: "Literary character" },
  { name: "Betty Boop", category: "Cartoon character" },
  { name: "Wednesday Addams", category: "TV character", description: "The Addams Family" },
  { name: "Carrie Bradshaw", category: "TV character", description: "Sex and the City" },
  { name: "Sherlock Holmes", category: "Literary character" },
  { name: "Wonder Woman", category: "Comic character" },
  { name: "Elvis Presley", category: "Celebrity" },
  { name: "Darth Vader", category: "Movie character", description: "Star Wars" },
  { name: "Hermione Granger", category: "Literary character", description: "Harry Potter" },
  { name: "SpongeBob SquarePants", category: "Cartoon character" },
  { name: "Cleopatra", category: "Historical figure" },
  { name: "Tony Stark", category: "Movie character", description: "Iron Man" },
  { name: "Lara Croft", category: "Video game character" },
  { name: "Mickey Mouse", category: "Cartoon character" },
  { name: "Beyoncé", category: "Celebrity" },
  { name: "James Bond", category: "Movie character" },
  { name: "Katniss Everdeen", category: "Literary character", description: "The Hunger Games" },
  { name: "Pikachu", category: "Cartoon character" },
  { name: "Napoleon Bonaparte", category: "Historical figure" },
  { name: "Black Panther", category: "Comic character", description: "Marvel" },
  { name: "Moana", category: "Movie character" },
  { name: "Walter White", category: "TV character", description: "Breaking Bad" },
  { name: "Mario", category: "Video game character" },
  { name: "Frida Kahlo", category: "Historical figure" },
  { name: "Captain America", category: "Comic character" },
  { name: "Elle Woods", category: "Movie character", description: "Legally Blonde" },
  { name: "Goku", category: "Cartoon character", description: "Dragon Ball" },
  { name: "Taylor Swift", category: "Celebrity" },
  { name: "Indiana Jones", category: "Movie character" },
  { name: "Daenerys Targaryen", category: "TV character", description: "Game of Thrones" },
  { name: "Link", category: "Video game character", description: "The Legend of Zelda" },
  { name: "Marilyn Monroe", category: "Celebrity" },
  { name: "Batman", category: "Comic character" },
  { name: "Dorothy Gale", category: "Literary character", description: "The Wizard of Oz" },
  { name: "Shrek", category: "Movie character" },
];

/** Max characters that may share the same category in one deal. */
const MAX_PER_CATEGORY = 2;

/** Once the list is large enough, avoid reusing characters across rounds. */
const UNIQUE_ACROSS_ROUNDS_THRESHOLD = 32;

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
 *
 * @param {number} count
 * @param {{ excludeNames?: string[] }} [options]
 */
function pickCharacters(count, options = {}) {
  const excludeNames = new Set(options.excludeNames || []);
  const enforceUnique =
    CHARACTERS.length >= UNIQUE_ACROSS_ROUNDS_THRESHOLD && excludeNames.size > 0;

  let source = CHARACTERS;
  if (enforceUnique) {
    source = CHARACTERS.filter((character) => !excludeNames.has(character.name));
  }

  const pool = shuffle(source);
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

function toSlotCharacter(character, slotNumber) {
  return {
    number: slotNumber,
    name: character.name,
    category: character.category || null,
    description: character.description || null,
  };
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

/**
 * Apply a dealt list of slot characters (length 8) to the left-column boxes.
 * @param {Array<{number:number, name:string, category?:string|null, description?:string|null}>} slotCharacters
 */
function applyCharactersToBoxes(slotCharacters) {
  const slots = document.querySelectorAll(".column--left .box--black");

  slots.forEach((box, index) => {
    const characterEl = box.querySelector(".box__character");
    const character = slotCharacters[index];
    const slotNumber = index + 1;

    if (!character) {
      characterEl.replaceChildren();
      box.removeAttribute("data-character");
      delete box._character;
      box.setAttribute("aria-label", `Character slot ${slotNumber}`);
      return;
    }

    const slotData = {
      number: slotNumber,
      name: character.name,
      category: character.category || null,
      description: character.description || null,
    };

    renderCharacter(characterEl, slotData);
    box._character = slotData;
    box.dataset.character = slotData.name;
    if (slotData.category) {
      box.dataset.category = slotData.category;
    } else {
      delete box.dataset.category;
    }
    box.setAttribute(
      "aria-label",
      `Character slot ${slotNumber}: ${slotData.name}`
    );
  });
}

function dealCharacters(count, excludeNames = []) {
  const picks = pickCharacters(count, { excludeNames });
  return picks.map((character, index) => toSlotCharacter(character, index + 1));
}

function bindCharacterBoxClicks() {
  document.querySelector(".column--left")?.addEventListener("click", (event) => {
    if (event.target.closest(".round-indicator")) return;
    const box = event.target.closest(".box--black");
    if (!box || !box._character) return;
    CharacterModule.open(box._character);
  });
}

bindCharacterBoxClicks();
