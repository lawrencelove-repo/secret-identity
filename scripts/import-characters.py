#!/usr/bin/env python3
"""Build characters.js from the original seed list + data/full-list.csv."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "data" / "full-list.csv"
JS_PATH = ROOT / "characters.js"

# Original seed list (keep as-is; do not re-import from CSV).
SEED: list[dict] = [
    {"name": "Ariana Grande", "category": "Celebrity"},
    {"name": "Joan of Arc", "category": "Historical figure"},
    {"name": "Ted Lasso", "category": "TV character"},
    {"name": "Sonic", "category": "Cartoon character"},
    {"name": "Buzz Lightyear", "category": "Movie character", "description": "Toy Story"},
    {"name": "Peter Pan", "category": "Literary character"},
    {"name": "Betty Boop", "category": "Cartoon character"},
    {"name": "Wednesday Addams", "category": "TV character", "description": "The Addams Family"},
    {"name": "Carrie Bradshaw", "category": "TV character", "description": "Sex and the City"},
    {"name": "Sherlock Holmes", "category": "Literary character"},
    {"name": "Wonder Woman", "category": "Comic character"},
    {"name": "Elvis Presley", "category": "Celebrity"},
    {"name": "Darth Vader", "category": "Movie character", "description": "Star Wars"},
    {"name": "Hermione Granger", "category": "Literary character", "description": "Harry Potter"},
    {"name": "SpongeBob SquarePants", "category": "Cartoon character"},
    {"name": "Cleopatra", "category": "Historical figure"},
    {"name": "Tony Stark", "category": "Movie character", "description": "Iron Man"},
    {"name": "Lara Croft", "category": "Video game character"},
    {"name": "Mickey Mouse", "category": "Cartoon character"},
    {"name": "Beyoncé", "category": "Celebrity"},
    {"name": "James Bond", "category": "Movie character"},
    {"name": "Katniss Everdeen", "category": "Literary character", "description": "The Hunger Games"},
    {"name": "Pikachu", "category": "Cartoon character"},
    {"name": "Napoleon Bonaparte", "category": "Historical figure"},
    {"name": "Black Panther", "category": "Comic character", "description": "Marvel"},
    {"name": "Moana", "category": "Movie character"},
    {"name": "Walter White", "category": "TV character", "description": "Breaking Bad"},
    {"name": "Mario", "category": "Video game character"},
    {"name": "Frida Kahlo", "category": "Historical figure"},
    {"name": "Captain America", "category": "Comic character"},
    {"name": "Elle Woods", "category": "Movie character", "description": "Legally Blonde"},
    {"name": "Goku", "category": "Cartoon character", "description": "Dragon Ball"},
    {"name": "Taylor Swift", "category": "Celebrity"},
    {"name": "Indiana Jones", "category": "Movie character"},
    {"name": "Daenerys Targaryen", "category": "TV character", "description": "Game of Thrones"},
    {"name": "Link", "category": "Video game character", "description": "The Legend of Zelda"},
    {"name": "Marilyn Monroe", "category": "Celebrity"},
    {"name": "Batman", "category": "Comic character"},
    {"name": "Dorothy Gale", "category": "Literary character", "description": "The Wizard of Oz"},
    {"name": "Shrek", "category": "Movie character"},
]

LINE_FIXES = {
    "Ellen Ripley (Alie": "Ellen Ripley (Alien)",
    "Eliazbeth II": "Elizabeth II",
    "Ellen Degeneres": "Ellen DeGeneres",
    "Bill the Kid": "Billy the Kid",
    "Nicola Tesla": "Nikola Tesla",
    "Muhammed Ali": "Muhammad Ali",
    "Rachel Greene (Friends)": "Rachel Green (Friends)",
    "Sabrina Spellman (Sabring the Teenage Witch)": "Sabrina Spellman (Sabrina the Teenage Witch)",
    "Simb (The Lion King)": "Simba (The Lion King)",
    "Alexa (Google *Actually Amazon)": "Alexa (Amazon)",
    '"Louis XIV, The Sun King"': "Louis XIV, The Sun King",
    "Hayao Miyazaki [Director of Studio Ghibli]": "Hayao Miyazaki (Studio Ghibli)",
    "The Shark (from JAWS)": "The Shark (Jaws)",
    "The Genie of the lamp (Aladdin)": "The Genie (Aladdin)",
    "Steve Irwin (Crocodile Hunter)": "Steve Irwin (The Crocodile Hunter)",
}

# name -> (category, description|None). None description keeps parsed paren text.
OVERRIDES: dict[str, tuple[str, str | None]] = {
    "Achilles": ("Literary character", None),
    "Aphrodite": ("Literary character", None),
    "Hercules": ("Literary character", None),
    "Zeus": ("Literary character", None),
    "God": ("Literary character", None),
    "The Devil": ("Literary character", None),
    "Mother Nature": ("Literary character", None),
    "Santa Claus": ("Literary character", None),
    "Bigfoot": ("Literary character", None),
    "Merlin": ("Literary character", None),
    "King Arthur": ("Literary character", None),
    "Robin Hood": ("Literary character", None),
    "Lady Godiva": ("Historical figure", None),
    "Uncle Sam": ("Literary character", None),
    "Ulysses": ("Literary character", None),
    "Alexa": ("Celebrity", "Amazon"),
    "Siri": ("Celebrity", "Apple"),
    "Chester the Cheetah": ("Cartoon character", None),
    "Kool-Aid Man": ("Cartoon character", None),
    "Mr. Clean": ("Cartoon character", None),
    "Mr. Peanut": ("Cartoon character", None),
    "Ronald McDonald": ("Cartoon character", None),
    "Tony the Tiger": ("Cartoon character", None),
    "The Jolly Green Giant": ("Cartoon character", None),
    "The Michelin Man": ("Cartoon character", None),
    "Barbie": ("Movie character", None),
    "Mona Lisa": ("Historical figure", None),
    "Catwoman": ("Comic character", None),
    "Hulk": ("Comic character", None),
    "Iron Man": ("Comic character", None),
    "Spider-Man": ("Comic character", None),
    "Superman": ("Comic character", None),
    "Thor": ("Comic character", None),
    "Wolverine": ("Comic character", None),
    "The Joker": ("Comic character", None),
    "Judge Dredd": ("Comic character", None),
    "Pac-Man": ("Video game character", None),
    "Skeletor": ("Cartoon character", None),
    "Zelda": ("Video game character", "The Legend of Zelda"),
    "Bambi": ("Cartoon character", None),
    "Cinderella": ("Movie character", None),
    "Daisy Duck": ("Cartoon character", None),
    "Doctor Who": ("TV character", None),
    "Dora the Explorer": ("Cartoon character", None),
    "Dracula": ("Literary character", None),
    "E.T. the Extra-Terrestrial": ("Movie character", None),
    "Edward Scissorhands": ("Movie character", None),
    "Forrest Gump": ("Movie character", None),
    "Frankenstein": ("Literary character", None),
    "Gandalf": ("Literary character", "The Lord of the Rings"),
    "Garfield": ("Cartoon character", None),
    "Godzilla": ("Movie character", None),
    "Gollum": ("Literary character", "The Lord of the Rings"),
    "Hannibal Lecter": ("Movie character", None),
    "Harry Potter": ("Literary character", None),
    "Homer Simpson": ("Cartoon character", None),
    "Jack Sparrow": ("Movie character", "Pirates of the Caribbean"),
    "Kermit the Frog": ("TV character", None),
    "King Kong": ("Movie character", None),
    "Little Red Riding Hood": ("Literary character", None),
    "Mad Max": ("Movie character", None),
    "Marge Simpson": ("Cartoon character", None),
    "Mary Poppins": ("Movie character", None),
    "Mr. Potato Head": ("Movie character", "Toy Story"),
    "Nemo": ("Movie character", "Finding Nemo"),
    "Paddington Bear": ("Literary character", None),
    "Peppa Pig": ("Cartoon character", None),
    "Pinocchio": ("Literary character", None),
    "Pocahontas": ("Historical figure", None),
    "Popeye": ("Cartoon character", None),
    "Prince Charming": ("Literary character", None),
    "Rapunzel": ("Literary character", None),
    "Robinson Crusoe": ("Literary character", None),
    "Rocky Balboa": ("Movie character", None),
    "Scooby-Doo": ("Cartoon character", None),
    "Shaun the Sheep": ("Cartoon character", None),
    "Sleeping Beauty": ("Movie character", None),
    "Snow White": ("Movie character", None),
    "Sylvester the Cat": ("Cartoon character", None),
    "Tarzan": ("Literary character", None),
    "Terminator": ("Movie character", None),
    "The Invisible Man": ("Literary character", None),
    "Thomas the Tank Engine": ("TV character", None),
    "Voldemort": ("Literary character", "Harry Potter"),
    "Wall-E": ("Movie character", None),
    "Winnie-the-Pooh": ("Literary character", None),
    "Bridget Jones": ("Movie character", None),
    "Attila": ("Historical figure", None),
    "Blackbeard": ("Historical figure", None),
    "Billy the Kid": ("Historical figure", None),
    "Calamity Jane": ("Historical figure", None),
    "Jack the Ripper": ("Historical figure", None),
    "Dalai Lama": ("Historical figure", None),
    "Gandhi": ("Historical figure", None),
    "Beethoven": ("Historical figure", None),
    "Mozart": ("Historical figure", None),
    "Mr. Rogers": ("Celebrity", None),
    "Prince Charles": ("Celebrity", None),
    "Prince William": ("Celebrity", None),
    "Elizabeth II": ("Historical figure", None),
    "Louis XIV, The Sun King": ("Historical figure", None),
    "Tutankhamen": ("Historical figure", None),
    "General Robert E. Lee": ("Historical figure", None),
    "John Fitzgerald Kennedy": ("Historical figure", None),
    "Jackie Kennedy": ("Historical figure", None),
    "Pablo Escobar": ("Historical figure", None),
    "Hayao Miyazaki": ("Celebrity", "Studio Ghibli"),
    "Stan Lee": ("Celebrity", None),
    "George Lucas": ("Celebrity", None),
    "Steven Spielberg": ("Celebrity", None),
    "Quentin Tarantino": ("Celebrity", None),
    "J.K. Rowling": ("Celebrity", None),
    "H.P. Lovecraft": ("Celebrity", None),
    "Stephen King": ("Celebrity", None),
    "Agatha Christie": ("Celebrity", None),
    "Jane Austen": ("Historical figure", None),
    "Patrick Stewart": ("Celebrity", None),
    "Sean Connery": ("Celebrity", None),
    "John Cleese": ("Celebrity", "Monty Python"),
    "Woody Allen": ("Celebrity", None),
    "Minion": ("Movie character", "Despicable Me"),
    "The Shark": ("Movie character", "Jaws"),
    "The Genie": ("Movie character", "Aladdin"),
    "The Professor": ("TV character", "Money Heist"),
    "Tokyo": ("TV character", "Money Heist"),
    "Neo": ("Movie character", "The Matrix"),
    "Django": ("Movie character", "Django Unchained"),
    "Bilbo": ("Literary character", "The Hobbit"),
    "Alice": ("Literary character", "Alice in Wonderland"),
    "Don Corleone": ("Movie character", "The Godfather"),
    "Quasimodo": ("Literary character", "The Hunchback of Notre-Dame"),
    "Sauron": ("Literary character", "The Lord of the Rings"),
    "Spock": ("TV character", "Star Trek"),
    "Woodstock": ("Cartoon character", "Peanuts"),
    "Toto": ("Literary character", "The Wizard of Oz"),
    "Sneezy": ("Movie character", "Snow White and the Seven Dwarfs"),
    "Groot": ("Movie character", "Guardians of the Galaxy"),
    "Jessica Rabbit": ("Movie character", "Who Framed Roger Rabbit"),
    "Lightning McQueen": ("Movie character", "Cars"),
    "Jack Dawson": ("Movie character", "Titanic"),
    "Rose DeWitt Bukater": ("Movie character", "Titanic"),
    "Michael Myers": ("Movie character", "Halloween"),
    "Ron Burgundy": ("Movie character", "Anchorman"),
    "Tony Montana": ("Movie character", "Scarface"),
    "Juliet Capulet": ("Literary character", "Romeo and Juliet"),
    "Romeo Montague": ("Literary character", "Romeo and Juliet"),
    "Luke Skywalker": ("Movie character", "Star Wars"),
    "Princess Leia": ("Movie character", "Star Wars"),
    "Yoda": ("Movie character", "Star Wars"),
    "Ellen Ripley": ("Movie character", "Alien"),
    "Elsa": ("Movie character", "Frozen"),
    "Simba": ("Movie character", "The Lion King"),
    "Arya Stark": ("TV character", "Game of Thrones"),
    "Cersei Lannister": ("TV character", "Game of Thrones"),
    "Jon Snow": ("TV character", "Game of Thrones"),
    "Dexter Morgan": ("TV character", "Dexter"),
    "Eric Cartman": ("Cartoon character", "South Park"),
    "Buffy Summers": ("TV character", "Buffy the Vampire Slayer"),
    "Joe Goldberg": ("TV character", "You"),
    "Phoebe Buffay": ("TV character", "Friends"),
    "Rachel Green": ("TV character", "Friends"),
    "Rick Sanchez": ("Cartoon character", "Rick and Morty"),
    "Sabrina Spellman": ("TV character", "Sabrina the Teenage Witch"),
    "Tony Soprano": ("TV character", "The Sopranos"),
    "Céline Dion": ("Celebrity", None),
    "Alfred Hitchcock": ("Celebrity", None),
    "Angelina Jolie": ("Celebrity", None),
    "Arnold Schwarzenegger": ("Celebrity", None),
    "Audrey Hepburn": ("Celebrity", None),
    "Awkwafina": ("Celebrity", None),
    "Bill Gates": ("Celebrity", None),
    "Bob Ross": ("Celebrity", None),
    "Britney Spears": ("Celebrity", None),
    "Bruce Lee": ("Historical figure", None),
    "Calvin Klein": ("Celebrity", None),
    "Cher": ("Celebrity", None),
    "Chris Rock": ("Celebrity", None),
    "Cindy Crawford": ("Celebrity", None),
    "Clint Eastwood": ("Celebrity", None),
    "Cristiano Ronaldo": ("Celebrity", None),
    "Dale Earnhardt": ("Celebrity", None),
    "David Bowie": ("Celebrity", None),
    "Dolly Parton": ("Celebrity", None),
    "Ellen DeGeneres": ("Celebrity", None),
    "Elon Musk": ("Celebrity", None),
    "Eminem": ("Celebrity", None),
    "Frank Sinatra": ("Celebrity", None),
    "Freddie Mercury": ("Celebrity", None),
    "George Foreman": ("Celebrity", None),
    "Gordon Ramsay": ("Celebrity", None),
    "Greta Thunberg": ("Celebrity", None),
    "Guy Fieri": ("Celebrity", None),
    "Halle Berry": ("Celebrity", None),
    "Howard Stern": ("Celebrity", None),
    "James Corden": ("Celebrity", None),
    "Jeff Bezos": ("Celebrity", None),
    "Julia Child": ("Celebrity", None),
    "Julia Roberts": ("Celebrity", None),
    "Katy Perry": ("Celebrity", None),
    "Kim Kardashian": ("Celebrity", None),
    "Kurt Cobain": ("Celebrity", None),
    "Lance Armstrong": ("Celebrity", None),
    "Larry Bird": ("Celebrity", None),
    "Leonardo DiCaprio": ("Celebrity", None),
    "Lionel Messi": ("Celebrity", None),
    "Louis Armstrong": ("Celebrity", None),
    "Madonna": ("Celebrity", None),
    "Mark Zuckerberg": ("Celebrity", None),
    "Meryl Streep": ("Celebrity", None),
    "Michael Jackson": ("Celebrity", None),
    "Michael Jordan": ("Celebrity", None),
    "Naomi Campbell": ("Celebrity", None),
    "Natalie Portman": ("Celebrity", None),
    "Oprah Winfrey": ("Celebrity", None),
    "Rafael Nadal": ("Celebrity", None),
    "Rihanna": ("Celebrity", None),
    "Ryan Seacrest": ("Celebrity", None),
    "Scarlett Johansson": ("Celebrity", None),
    "Serena Williams": ("Celebrity", None),
    "Snoop Dogg": ("Celebrity", None),
    "Stevie Wonder": ("Celebrity", None),
    "Tiger Woods": ("Celebrity", None),
    "Tom Brady": ("Celebrity", None),
    "Tom Cruise": ("Celebrity", None),
    "Usain Bolt": ("Celebrity", None),
    "Victoria Beckham": ("Celebrity", None),
    "Whoopi Goldberg": ("Celebrity", None),
    "Willie Mays": ("Celebrity", None),
    "Jason Bourne": ("Movie character", None),
}

HISTORICAL = {
    "Abraham Lincoln",
    "Adolf Hitler",
    "Al Capone",
    "Albert Einstein",
    "Amelia Earhart",
    "Angela Merkel",
    "Anne Frank",
    "Babe Ruth",
    "Barack Obama",
    "Charlie Chaplin",
    "Christopher Columbus",
    "Condoleezza Rice",
    "Henry Ford",
    "Hillary Clinton",
    "Isaac Newton",
    "Joe Biden",
    "Joseph Stalin",
    "Josephine Baker",
    "Julius Caesar",
    "Kim Jong-un",
    "Leonardo da Vinci",
    "Malcolm X",
    "Marco Polo",
    "Margaret Thatcher",
    "Martin Luther King Jr.",
    "Michelle Obama",
    "Nelson Mandela",
    "Nikola Tesla",
    "Pablo Picasso",
    "Rosa Parks",
    "Salvador Dali",
    "Sitting Bull",
    "Stephen Hawking",
    "Thomas Edison",
    "Vincent van Gogh",
    "Winston Churchill",
    "Wyatt Earp",
}


def normalize_key(name: str) -> str:
    key = name.casefold().strip()
    for a, b in (
        ("é", "e"),
        ("è", "e"),
        ("ê", "e"),
        ("ë", "e"),
        ("á", "a"),
        ("à", "a"),
        ("ä", "a"),
        ("í", "i"),
        ("ó", "o"),
        ("ö", "o"),
        ("ú", "u"),
        ("ü", "u"),
        ("ç", "c"),
        ("ñ", "n"),
        ("\ufffd", ""),
    ):
        key = key.replace(a, b)
    return re.sub(r"[^a-z0-9]+", "", key)


def fix_mojibake(line: str) -> str:
    """Repair common UTF-8/cp1252 mojibake for Beyoncé / Céline."""
    if "Beyonc" in line and "Beyoncé" not in line:
        return "Beyoncé"
    if "line Dion" in line or re.search(r"C.line Dion", line):
        return "Céline Dion"
    return line


def parse_line(raw: str) -> tuple[str, str | None]:
    line = raw.strip()
    line = fix_mojibake(line)
    if line in LINE_FIXES:
        line = LINE_FIXES[line]
    if line.startswith('"') and line.endswith('"'):
        line = line[1:-1]

    description = None
    m = re.match(r"^(.*?)\s*[\(\[](.+)[\)\]]\s*$", line)
    if m:
        name = m.group(1).strip()
        description = m.group(2).strip()
        if description.lower().startswith("from "):
            description = description[5:].strip()
    else:
        name = line

    return name, description or None


def categorize(name: str, description: str | None) -> tuple[str, str | None]:
    if name in OVERRIDES:
        cat, desc = OVERRIDES[name]
        return cat, desc if desc is not None else description
    if name in HISTORICAL:
        return "Historical figure", description
    return "Celebrity", description


def js_escape(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def format_entry(entry: dict) -> str:
    parts = [
        f'name: "{js_escape(entry["name"])}"',
        f'category: "{js_escape(entry["category"])}"',
    ]
    if entry.get("description"):
        parts.append(f'description: "{js_escape(entry["description"])}"')
    if entry.get("disabled"):
        parts.append("disabled: true")
    return "  { " + ", ".join(parts) + " },"


def main() -> None:
    raw = CSV_PATH.read_bytes()
    # Prefer cp1252 for the mojibake bytes in this file, fall back utf-8.
    try:
        text = raw.decode("cp1252")
    except UnicodeDecodeError:
        text = raw.decode("utf-8", errors="replace")

    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]

    seen = {normalize_key(e["name"]) for e in SEED}
    imported: list[dict] = []
    skipped: list[str] = []

    for line in lines:
        name, description = parse_line(line)
        key = normalize_key(name)
        if key in seen:
            skipped.append(name)
            continue
        seen.add(key)
        category, description = categorize(name, description)
        entry: dict = {"name": name, "category": category}
        if description:
            entry["description"] = description
        imported.append(entry)

    imported.sort(key=lambda e: e["name"].casefold())
    all_entries = SEED + imported

    array_body = "\n".join(format_entry(e) for e in all_entries)

    header = '''/**
 * Seed list of celebrities / pop-culture characters.
 * Add more entries over time — boxes pull random picks per round.
 *
 * Optional fields:
 *   category    — used to limit how many of the same type appear at once
 *   description — shown under the name when present; richer uses later
 *   disabled    — when true, excluded from dealing into the game
 */
const CHARACTERS = [
'''

    # Keep everything after the CHARACTERS array from the current file,
    # but rewrite the pickCharacters source filter.
    js_text = JS_PATH.read_text(encoding="utf-8")
    match = re.search(r"const CHARACTERS = \[.*?\];", js_text, re.S)
    if not match:
        raise SystemExit("Could not find CHARACTERS array")

    rest = js_text[match.end() :]
    # Ensure disabled filter exists in pickCharacters
    if "character.disabled" not in rest and "!character.disabled" not in rest:
        rest = rest.replace(
            "  let source = CHARACTERS;\n"
            "  if (enforceUnique) {\n"
            "    source = CHARACTERS.filter((character) => !excludeNames.has(character.name));\n"
            "  }",
            "  let source = CHARACTERS.filter((character) => !character.disabled);\n"
            "  if (enforceUnique) {\n"
            "    source = source.filter((character) => !excludeNames.has(character.name));\n"
            "  }",
        )
    # If a previous run already applied a partial filter using CHARACTERS.length
    # for unique threshold, also count only enabled characters.
    rest = rest.replace(
        "    CHARACTERS.length >= UNIQUE_ACROSS_ROUNDS_THRESHOLD && excludeNames.size > 0;",
        "    CHARACTERS.filter((c) => !c.disabled).length >= UNIQUE_ACROSS_ROUNDS_THRESHOLD &&\n"
        "    excludeNames.size > 0;",
    )

    JS_PATH.write_text(header + array_body + "\n];" + rest, encoding="utf-8")
    print(f"Seed {len(SEED)} + imported {len(imported)} = {len(all_entries)} total")
    print(f"Skipped {len(skipped)} already present")
    print("Sample skipped:", ", ".join(skipped[:12]))


if __name__ == "__main__":
    main()
