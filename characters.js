/**
 * Seed list of celebrities / pop-culture characters.
 * Add more entries over time — boxes pull random picks per round.
 *
 * Optional fields:
 *   category    — used to limit how many of the same type appear at once
 *   description — shown under the name when present; richer uses later
 *   disabled    — when true, excluded from dealing into the game
 */
const CHARACTERS = [
  { name: "Ariana Grande", category: "Singer/Musician" },
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
  { name: "Elvis Presley", category: "Singer/Musician" },
  { name: "Darth Vader", category: "Movie character", description: "Star Wars" },
  { name: "Hermione Granger", category: "Literary character", description: "Harry Potter" },
  { name: "SpongeBob SquarePants", category: "Cartoon character" },
  { name: "Cleopatra", category: "Historical figure" },
  { name: "Tony Stark", category: "Movie character", description: "Iron Man" },
  { name: "Lara Croft", category: "Video game character" },
  { name: "Mickey Mouse", category: "Cartoon character" },
  { name: "Beyoncé", category: "Singer/Musician" },
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
  { name: "Taylor Swift", category: "Singer/Musician" },
  { name: "Indiana Jones", category: "Movie character" },
  { name: "Daenerys Targaryen", category: "TV character", description: "Game of Thrones" },
  { name: "Link", category: "Video game character", description: "The Legend of Zelda" },
  { name: "Marilyn Monroe", category: "Movie/TV Actress" },
  { name: "Batman", category: "Comic character" },
  { name: "Dorothy Gale", category: "Literary character", description: "The Wizard of Oz" },
  { name: "Shrek", category: "Movie character" },
  { name: "Abraham Lincoln", category: "Historical figure" },
  { name: "Achilles", category: "Literary character" },
  { name: "Adolf Hitler", category: "Historical figure" },
  { name: "Agatha Christie", category: "Author" },
  { name: "Al Capone", category: "Historical figure" },
  { name: "Albert Einstein", category: "Historical figure" },
  { name: "Alexa", category: "Brand/Mascot", description: "Amazon" },
  { name: "Alfred Hitchcock", category: "Director" },
  { name: "Alice", category: "Literary character", description: "Alice in Wonderland" },
  { name: "Amelia Earhart", category: "Historical figure" },
  { name: "Angela Merkel", category: "Historical figure" },
  { name: "Angelina Jolie", category: "Movie/TV Actress" },
  { name: "Anne Frank", category: "Historical figure" },
  { name: "Aphrodite", category: "Literary character" },
  { name: "Arnold Schwarzenegger", category: "Movie/TV Actor" },
  { name: "Arya Stark", category: "TV character", description: "Game of Thrones" },
  { name: "Attila", category: "Historical figure" },
  { name: "Audrey Hepburn", category: "Movie/TV Actress" },
  { name: "Awkwafina", category: "Singer/Actress" },
  { name: "Babe Ruth", category: "Historical figure" },
  { name: "Bambi", category: "Cartoon character" },
  { name: "Barack Obama", category: "Historical figure" },
  { name: "Barbie", category: "Movie character" },
  { name: "Beethoven", category: "Historical figure" },
  { name: "Bigfoot", category: "Literary character" },
  { name: "Bilbo", category: "Literary character", description: "The Hobbit" },
  { name: "Bill Gates", category: "Businessperson" },
  { name: "Billy the Kid", category: "Historical figure" },
  { name: "Blackbeard", category: "Historical figure" },
  { name: "Bob Ross", category: "TV Personality" },
  { name: "Bridget Jones", category: "Movie character" },
  { name: "Britney Spears", category: "Singer/Musician" },
  { name: "Bruce Lee", category: "Historical figure" },
  { name: "Buffy Summers", category: "TV character", description: "Buffy the Vampire Slayer" },
  { name: "Bugs Bunny", category: "Cartoon character" },
  { name: "Calamity Jane", category: "Historical figure" },
  { name: "Calvin Klein", category: "Businessperson" },
  { name: "Catwoman", category: "Comic character" },
  { name: "Cersei Lannister", category: "TV character", description: "Game of Thrones" },
  { name: "Charlie Chaplin", category: "Historical figure" },
  { name: "Cher", category: "Singer/Actress" },
  { name: "Chester the Cheetah", category: "Cartoon character" },
  { name: "Chris Rock", category: "Comedian" },
  { name: "Christopher Columbus", category: "Historical figure" },
  { name: "Cinderella", category: "Movie character" },
  { name: "Cindy Crawford", category: "Model" },
  { name: "Clint Eastwood", category: "Movie/TV Actor" },
  { name: "Condoleezza Rice", category: "Historical figure" },
  { name: "Cristiano Ronaldo", category: "Athlete" },
  { name: "Céline Dion", category: "Singer/Musician" },
  { name: "Daisy Duck", category: "Cartoon character" },
  { name: "Dalai Lama", category: "Historical figure" },
  { name: "Dale Earnhardt", category: "Athlete" },
  { name: "David Bowie", category: "Singer/Musician" },
  { name: "Dexter Morgan", category: "TV character", description: "Dexter" },
  { name: "Django", category: "Movie character", description: "Django Unchained" },
  { name: "Doctor Who", category: "TV character" },
  { name: "Dolly Parton", category: "Singer/Actress" },
  { name: "Don Corleone", category: "Movie character", description: "The Godfather" },
  { name: "Dora the Explorer", category: "Cartoon character" },
  { name: "Dracula", category: "Literary character" },
  { name: "E.T. the Extra-Terrestrial", category: "Movie character" },
  { name: "Edward Scissorhands", category: "Movie character" },
  { name: "Elizabeth II", category: "Historical figure" },
  { name: "Ellen DeGeneres", category: "TV Personality" },
  { name: "Ellen Ripley", category: "Movie character", description: "Alien" },
  { name: "Elon Musk", category: "Businessperson" },
  { name: "Elsa", category: "Movie character", description: "Frozen" },
  { name: "Eminem", category: "Singer/Musician" },
  { name: "Eric Cartman", category: "Cartoon character", description: "South Park" },
  { name: "Forrest Gump", category: "Movie character" },
  { name: "Frank Sinatra", category: "Singer/Actor" },
  { name: "Frankenstein", category: "Literary character" },
  { name: "Freddie Mercury", category: "Singer/Musician" },
  { name: "Gandalf", category: "Literary character", description: "The Lord of the Rings" },
  { name: "Gandhi", category: "Historical figure" },
  { name: "Garfield", category: "Cartoon character" },
  { name: "General Robert E. Lee", category: "Historical figure" },
  { name: "George Foreman", category: "Athlete" },
  { name: "George Lucas", category: "Director" },
  { name: "God", category: "Literary character" },
  { name: "Godzilla", category: "Movie character" },
  { name: "Gollum", category: "Literary character", description: "The Lord of the Rings" },
  { name: "Gordon Ramsay", category: "TV Personality" },
  { name: "Greta Thunberg", category: "Activist" },
  { name: "Groot", category: "Movie character", description: "Guardians of the Galaxy" },
  { name: "Guy Fieri", category: "TV Personality" },
  { name: "H.P. Lovecraft", category: "Author" },
  { name: "Halle Berry", category: "Movie/TV Actress" },
  { name: "Hannibal Lecter", category: "Movie character" },
  { name: "Harry Potter", category: "Literary character" },
  { name: "Hayao Miyazaki", category: "Director", description: "Studio Ghibli" },
  { name: "Henry Ford", category: "Historical figure" },
  { name: "Hercules", category: "Literary character" },
  { name: "Hillary Clinton", category: "Historical figure" },
  { name: "Homer Simpson", category: "Cartoon character" },
  { name: "Howard Stern", category: "TV Personality" },
  { name: "Hulk", category: "Comic character" },
  { name: "Iron Man", category: "Comic character" },
  { name: "Isaac Newton", category: "Historical figure" },
  { name: "J.K. Rowling", category: "Author" },
  { name: "Jack Dawson", category: "Movie character", description: "Titanic" },
  { name: "Jack Sparrow", category: "Movie character", description: "Pirates of the Caribbean" },
  { name: "Jack the Ripper", category: "Historical figure" },
  { name: "Jackie Kennedy", category: "Historical figure" },
  { name: "James Corden", category: "TV Personality" },
  { name: "Jane Austen", category: "Historical figure" },
  { name: "Jason Bourne", category: "Movie character" },
  { name: "Jeff Bezos", category: "Businessperson" },
  { name: "Jessica Rabbit", category: "Movie character", description: "Who Framed Roger Rabbit" },
  { name: "Joe Biden", category: "Historical figure" },
  { name: "Joe Goldberg", category: "TV character", description: "You" },
  { name: "John Cleese", category: "Movie/TV Actor", description: "Monty Python" },
  { name: "John Fitzgerald Kennedy", category: "Historical figure" },
  { name: "John Lennon", category: "Singer/Musician" },
  { name: "Jon Snow", category: "TV character", description: "Game of Thrones" },
  { name: "Joseph Stalin", category: "Historical figure" },
  { name: "Josephine Baker", category: "Historical figure" },
  { name: "Judge Dredd", category: "Comic character" },
  { name: "Julia Child", category: "TV Personality" },
  { name: "Julia Roberts", category: "Movie/TV Actress" },
  { name: "Juliet Capulet", category: "Literary character", description: "Romeo and Juliet" },
  { name: "Julius Caesar", category: "Historical figure" },
  { name: "Katy Perry", category: "Singer/Musician" },
  { name: "Kermit the Frog", category: "TV character" },
  { name: "Kim Jong-un", category: "Historical figure" },
  { name: "Kim Kardashian", category: "TV Personality" },
  { name: "King Arthur", category: "Literary character" },
  { name: "King Kong", category: "Movie character" },
  { name: "Kool-Aid Man", category: "Cartoon character" },
  { name: "Kurt Cobain", category: "Singer/Musician" },
  { name: "Lady Godiva", category: "Historical figure" },
  { name: "Lance Armstrong", category: "Athlete" },
  { name: "Larry Bird", category: "Athlete" },
  { name: "Leonardo da Vinci", category: "Historical figure" },
  { name: "Leonardo DiCaprio", category: "Movie/TV Actor" },
  { name: "Lightning McQueen", category: "Movie character", description: "Cars" },
  { name: "Lionel Messi", category: "Athlete" },
  { name: "Little Red Riding Hood", category: "Literary character" },
  { name: "Louis Armstrong", category: "Singer/Musician" },
  { name: "Louis XIV, The Sun King", category: "Historical figure" },
  { name: "Luke Skywalker", category: "Movie character", description: "Star Wars" },
  { name: "Mad Max", category: "Movie character" },
  { name: "Madonna", category: "Singer/Actress" },
  { name: "Malcolm X", category: "Historical figure" },
  { name: "Marco Polo", category: "Historical figure" },
  { name: "Margaret Thatcher", category: "Historical figure" },
  { name: "Marge Simpson", category: "Cartoon character" },
  { name: "Mark Zuckerberg", category: "Businessperson" },
  { name: "Martin Luther King Jr.", category: "Historical figure" },
  { name: "Mary Poppins", category: "Movie character" },
  { name: "Merlin", category: "Literary character" },
  { name: "Meryl Streep", category: "Movie/TV Actress" },
  { name: "Michael Jackson", category: "Singer/Musician" },
  { name: "Michael Jordan", category: "Athlete" },
  { name: "Michael Myers", category: "Movie character", description: "Halloween" },
  { name: "Michelle Obama", category: "Historical figure" },
  { name: "Minion", category: "Movie character", description: "Despicable Me" },
  { name: "Mona Lisa", category: "Historical figure" },
  { name: "Mother Nature", category: "Literary character" },
  { name: "Mozart", category: "Historical figure" },
  { name: "Mr. Clean", category: "Cartoon character" },
  { name: "Mr. Peanut", category: "Cartoon character" },
  { name: "Mr. Potato Head", category: "Movie character", description: "Toy Story" },
  { name: "Mr. Rogers", category: "TV Personality" },
  { name: "Muhammad Ali", category: "Athlete" },
  { name: "Naomi Campbell", category: "Model" },
  { name: "Natalie Portman", category: "Movie/TV Actress" },
  { name: "Nelson Mandela", category: "Historical figure" },
  { name: "Nemo", category: "Movie character", description: "Finding Nemo" },
  { name: "Neo", category: "Movie character", description: "The Matrix" },
  { name: "Nikola Tesla", category: "Historical figure" },
  { name: "Oprah Winfrey", category: "TV Personality" },
  { name: "Pablo Escobar", category: "Historical figure" },
  { name: "Pablo Picasso", category: "Historical figure" },
  { name: "Pac-Man", category: "Video game character" },
  { name: "Paddington Bear", category: "Literary character" },
  { name: "Patrick Stewart", category: "Movie/TV Actor" },
  { name: "Peppa Pig", category: "Cartoon character" },
  { name: "Phoebe Buffay", category: "TV character", description: "Friends" },
  { name: "Pinocchio", category: "Literary character" },
  { name: "Pocahontas", category: "Historical figure" },
  { name: "Popeye", category: "Cartoon character" },
  { name: "Prince Charles", category: "Royalty" },
  { name: "Prince Charming", category: "Literary character" },
  { name: "Prince William", category: "Royalty" },
  { name: "Princess Leia", category: "Movie character", description: "Star Wars" },
  { name: "Quasimodo", category: "Literary character", description: "The Hunchback of Notre-Dame" },
  { name: "Quentin Tarantino", category: "Director" },
  { name: "Rachel Green", category: "TV character", description: "Friends" },
  { name: "Rafael Nadal", category: "Athlete" },
  { name: "Rapunzel", category: "Literary character" },
  { name: "Rick Sanchez", category: "Cartoon character", description: "Rick and Morty" },
  { name: "Rihanna", category: "Singer/Musician" },
  { name: "Robin Hood", category: "Literary character" },
  { name: "Robinson Crusoe", category: "Literary character" },
  { name: "Rocky Balboa", category: "Movie character" },
  { name: "Romeo Montague", category: "Literary character", description: "Romeo and Juliet" },
  { name: "Ron Burgundy", category: "Movie character", description: "Anchorman" },
  { name: "Ronald McDonald", category: "Cartoon character" },
  { name: "Rosa Parks", category: "Historical figure" },
  { name: "Rose DeWitt Bukater", category: "Movie character", description: "Titanic" },
  { name: "Ryan Seacrest", category: "TV Personality" },
  { name: "Sabrina Spellman", category: "TV character", description: "Sabrina the Teenage Witch" },
  { name: "Salvador Dali", category: "Historical figure" },
  { name: "Santa Claus", category: "Literary character" },
  { name: "Sauron", category: "Literary character", description: "The Lord of the Rings" },
  { name: "Scarlett Johansson", category: "Movie/TV Actress" },
  { name: "Scooby-Doo", category: "Cartoon character" },
  { name: "Sean Connery", category: "Movie/TV Actor" },
  { name: "Serena Williams", category: "Athlete" },
  { name: "Shaun the Sheep", category: "Cartoon character" },
  { name: "Simba", category: "Movie character", description: "The Lion King" },
  { name: "Siri", category: "Brand/Mascot", description: "Apple" },
  { name: "Sitting Bull", category: "Historical figure" },
  { name: "Skeletor", category: "Cartoon character" },
  { name: "Sleeping Beauty", category: "Movie character" },
  { name: "Sneezy", category: "Movie character", description: "Snow White and the Seven Dwarfs" },
  { name: "Snoop Dogg", category: "Singer/Musician" },
  { name: "Snow White", category: "Movie character" },
  { name: "Spider-Man", category: "Comic character" },
  { name: "Spock", category: "TV character", description: "Star Trek" },
  { name: "Stan Lee", category: "Author" },
  { name: "Stephen Hawking", category: "Historical figure" },
  { name: "Stephen King", category: "Author" },
  { name: "Steve Irwin", category: "TV Personality", description: "The Crocodile Hunter" },
  { name: "Steven Spielberg", category: "Director" },
  { name: "Stevie Wonder", category: "Singer/Musician" },
  { name: "Superman", category: "Comic character" },
  { name: "Sylvester the Cat", category: "Cartoon character" },
  { name: "Tarzan", category: "Literary character" },
  { name: "Terminator", category: "Movie character" },
  { name: "The Devil", category: "Literary character" },
  { name: "The Genie", category: "Movie character", description: "Aladdin" },
  { name: "The Invisible Man", category: "Literary character" },
  { name: "The Joker", category: "Comic character" },
  { name: "The Jolly Green Giant", category: "Cartoon character" },
  { name: "The Michelin Man", category: "Cartoon character" },
  { name: "The Professor", category: "TV character", description: "Money Heist" },
  { name: "The Shark", category: "Movie character", description: "Jaws" },
  { name: "Thomas Edison", category: "Historical figure" },
  { name: "Thomas the Tank Engine", category: "TV character" },
  { name: "Thor", category: "Comic character" },
  { name: "Tiger Woods", category: "Athlete" },
  { name: "Tokyo", category: "TV character", description: "Money Heist" },
  { name: "Tom Brady", category: "Athlete" },
  { name: "Tom Cruise", category: "Movie/TV Actor" },
  { name: "Tony Montana", category: "Movie character", description: "Scarface" },
  { name: "Tony Soprano", category: "TV character", description: "The Sopranos" },
  { name: "Tony the Tiger", category: "Cartoon character" },
  { name: "Toto", category: "Literary character", description: "The Wizard of Oz" },
  { name: "Tutankhamen", category: "Historical figure" },
  { name: "Ulysses", category: "Literary character" },
  { name: "Uncle Sam", category: "Literary character" },
  { name: "Usain Bolt", category: "Athlete" },
  { name: "Victoria Beckham", category: "Singer/Musician" },
  { name: "Vincent van Gogh", category: "Historical figure" },
  { name: "Voldemort", category: "Literary character", description: "Harry Potter" },
  { name: "Wall-E", category: "Movie character" },
  { name: "Whoopi Goldberg", category: "Movie/TV Actress" },
  { name: "Willie Mays", category: "Athlete" },
  { name: "Winnie-the-Pooh", category: "Literary character" },
  { name: "Winston Churchill", category: "Historical figure" },
  { name: "Wolverine", category: "Comic character" },
  { name: "Woodstock", category: "Cartoon character", description: "Peanuts" },
  { name: "Woody Allen", category: "Director" },
  { name: "Wyatt Earp", category: "Historical figure" },
  { name: "Yoda", category: "Movie character", description: "Star Wars" },
  { name: "Zelda", category: "Video game character", description: "The Legend of Zelda" },
  { name: "Zeus", category: "Literary character" },
];

/** Max characters that may share the same category in one deal. */
const MAX_PER_CATEGORY = 2;

/** Once the list is large enough, avoid reusing characters across rounds. */
const UNIQUE_ACROSS_ROUNDS_THRESHOLD = 32;

/**
 * Persist how often each character has been dealt on this browser/device.
 * Deals prefer less-played names so the roster rotates over time.
 */
const CharacterHistory = (() => {
  const STORAGE_KEY = "secret-identity.character-plays";

  function loadPlays() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const data = JSON.parse(raw);
      if (data && data.plays && typeof data.plays === "object") return data.plays;
      if (data && typeof data === "object" && !Array.isArray(data)) return data;
    } catch (_) {
      /* ignore corrupt storage */
    }
    return {};
  }

  function savePlays(plays) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: 1, plays })
      );
    } catch (_) {
      /* private mode / quota — dealing still works without persistence */
    }
  }

  function getCount(name) {
    const plays = loadPlays();
    return Number(plays[name]) || 0;
  }

  /** Increment play counts for the given character names. */
  function record(names) {
    if (!names || !names.length) return;
    const plays = loadPlays();
    names.forEach((name) => {
      if (!name) return;
      plays[name] = (Number(plays[name]) || 0) + 1;
    });
    savePlays(plays);
  }

  /**
   * Shuffle within each play-count bucket, then concatenate from least → most played.
   * So never-seen characters are tried before ones already dealt on this device.
   */
  function orderByLeastPlayed(characters) {
    const plays = loadPlays();
    const groups = new Map();

    characters.forEach((character) => {
      const count = Number(plays[character.name]) || 0;
      if (!groups.has(count)) groups.set(count, []);
      groups.get(count).push(character);
    });

    const ordered = [];
    [...groups.keys()]
      .sort((a, b) => a - b)
      .forEach((count) => {
        ordered.push(...shuffle(groups.get(count)));
      });
    return ordered;
  }

  function clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {
      /* ignore */
    }
  }

  return { getCount, record, orderByLeastPlayed, clear, loadPlays };
})();

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
 * Prefers characters dealt fewer times on this device (localStorage).
 *
 * @param {number} count
 * @param {{ excludeNames?: string[], categoryCounts?: Record<string, number> }} [options]
 */
function pickCharacters(count, options = {}) {
  const excludeNames = new Set(options.excludeNames || []);
  const enforceUnique =
    CHARACTERS.filter((c) => !c.disabled).length >= UNIQUE_ACROSS_ROUNDS_THRESHOLD &&
    excludeNames.size > 0;

  let source = CHARACTERS.filter((character) => !character.disabled);
  if (enforceUnique) {
    source = source.filter((character) => !excludeNames.has(character.name));
  } else if (excludeNames.size > 0) {
    // Always avoid names already on the board / explicitly excluded,
    // even when the unique-across-rounds threshold isn't in play.
    source = source.filter((character) => !excludeNames.has(character.name));
  }

  const pool = CharacterHistory.orderByLeastPlayed(source);
  const picks = [];
  const categoryCounts = Object.create(null);
  if (options.categoryCounts) {
    Object.assign(categoryCounts, options.categoryCounts);
  }

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

/**
 * Pick a single replacement character for a slot.
 * @param {{ excludeNames?: string[], categoryCounts?: Record<string, number> }} [options]
 */
function pickReplacementCharacter(options = {}) {
  const picks = pickCharacters(1, options);
  const next = picks[0] || null;
  if (next) CharacterHistory.record([next.name]);
  return next;
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
  CharacterHistory.record(picks.map((character) => character.name));
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

/**
 * In-app characters fullscreen: 2×4 grid of black boxes, scores hidden.
 */
const CharactersFullscreen = (() => {
  const toggle = document.getElementById("characters-fullscreen-toggle");
  const expandIcon = toggle?.querySelector(".characters-fullscreen-toggle__icon--expand");
  const collapseIcon = toggle?.querySelector(".characters-fullscreen-toggle__icon--collapse");

  function isActive() {
    return document.body.classList.contains("characters-fullscreen");
  }

  function syncToggleUi() {
    if (!toggle) return;
    const active = isActive();
    toggle.setAttribute("aria-pressed", active ? "true" : "false");
    toggle.setAttribute("aria-label", active ? "Collapse characters" : "Expand characters");
    if (expandIcon) expandIcon.hidden = active;
    if (collapseIcon) collapseIcon.hidden = !active;
  }

  function setActive(active) {
    document.body.classList.toggle("characters-fullscreen", Boolean(active));
    syncToggleUi();
  }

  function toggleMode() {
    setActive(!isActive());
  }

  function showToggle(visible) {
    if (!toggle) return;
    toggle.hidden = !visible;
    if (!visible) setActive(false);
  }

  toggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleMode();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isActive()) {
      // Don't steal Escape from open modals.
      if (document.body.classList.contains("character-module-open")) return;
      if (document.body.classList.contains("score-module-open")) return;
      if (document.body.classList.contains("new-game-module-open")) return;
      if (document.getElementById("character-replace-confirm") && !document.getElementById("character-replace-confirm").hidden) {
        return;
      }
      setActive(false);
    }
  });

  syncToggleUi();

  return { isActive, setActive, toggleMode, showToggle };
})();
