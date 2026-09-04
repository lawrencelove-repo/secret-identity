/**
 * Seed list of celebrities / pop-culture characters.
 * Add more entries over time — boxes pull 8 unique random picks on load.
 * Optional qualifier in parentheses is shown smaller beneath the name.
 */
const CHARACTERS = [
  "Ariana Grande",
  "Joan of Arc",
  "Ted Lasso",
  "Sonic",
  "Buzz Lightyear",
  "Peter Pan",
  "Betty Boop",
  "Wednesday Addams (The Addams Family)",
  "Carrie Bradshaw (Sx and the City)",
];

function parseCharacter(raw) {
  const match = raw.match(/^(.*?)\s*\((.+)\)\s*$/);
  if (match) {
    return { name: match[1].trim(), qualifier: match[2].trim() };
  }
  return { name: raw.trim(), qualifier: null };
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickCharacters(count) {
  if (CHARACTERS.length < count) {
    console.warn(
      `CHARACTERS has ${CHARACTERS.length} entries; need ${count}. Some boxes may repeat.`
    );
  }
  const pool = shuffle(CHARACTERS);
  const picks = [];
  for (let i = 0; i < count; i += 1) {
    picks.push(pool[i % pool.length]);
  }
  return picks;
}

function renderCharacter(container, raw) {
  const { name, qualifier } = parseCharacter(raw);
  container.replaceChildren();

  const nameEl = document.createElement("span");
  nameEl.className = "box__name";
  nameEl.textContent = name;
  container.appendChild(nameEl);

  if (qualifier) {
    const qualEl = document.createElement("span");
    qualEl.className = "box__qualifier";
    qualEl.textContent = qualifier;
    container.appendChild(qualEl);
  }
}

function populateCharacterBoxes() {
  const slots = document.querySelectorAll(".column--left .box--black");
  const picks = pickCharacters(slots.length);

  slots.forEach((box, index) => {
    const characterEl = box.querySelector(".box__character");
    const raw = picks[index];
    renderCharacter(characterEl, raw);
    box.setAttribute("aria-label", `Character slot ${index + 1}: ${raw}`);
    box.dataset.character = raw;
  });
}

populateCharacterBoxes();
