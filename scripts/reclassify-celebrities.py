#!/usr/bin/env python3
"""Reclassify Celebrity entries and report other Royalty candidates."""

from __future__ import annotations

import re
from pathlib import Path

JS = Path(__file__).resolve().parents[1] / "characters.js"

# New category for every former Celebrity (and Bugs Bunny fix).
RECLASSIFY: dict[str, str] = {
    "Ariana Grande": "Singer/Musician",
    "Elvis Presley": "Singer/Musician",
    "Beyoncé": "Singer/Musician",
    "Taylor Swift": "Singer/Musician",
    "Marilyn Monroe": "Movie/TV Actress",
    "Agatha Christie": "Author",
    "Alexa": "Brand/Mascot",
    "Alfred Hitchcock": "Director",
    "Angelina Jolie": "Movie/TV Actress",
    "Arnold Schwarzenegger": "Movie/TV Actor",
    "Audrey Hepburn": "Movie/TV Actress",
    "Awkwafina": "Singer/Actress",
    "Bill Gates": "Businessperson",
    "Bob Ross": "TV Personality",
    "Britney Spears": "Singer/Musician",
    "Bugs Bunny": "Cartoon character",
    "Calvin Klein": "Businessperson",
    "Cher": "Singer/Actress",
    "Chris Rock": "Comedian",
    "Cindy Crawford": "Model",
    "Clint Eastwood": "Movie/TV Actor",
    "Cristiano Ronaldo": "Athlete",
    "Céline Dion": "Singer/Musician",
    "Dale Earnhardt": "Athlete",
    "David Bowie": "Singer/Musician",
    "Dolly Parton": "Singer/Actress",
    "Ellen DeGeneres": "TV Personality",
    "Elon Musk": "Businessperson",
    "Eminem": "Singer/Musician",
    "Frank Sinatra": "Singer/Actor",
    "Freddie Mercury": "Singer/Musician",
    "George Foreman": "Athlete",
    "George Lucas": "Director",
    "Gordon Ramsay": "TV Personality",
    "Greta Thunberg": "Activist",
    "Guy Fieri": "TV Personality",
    "H.P. Lovecraft": "Author",
    "Halle Berry": "Movie/TV Actress",
    "Hayao Miyazaki": "Director",
    "Howard Stern": "TV Personality",
    "J.K. Rowling": "Author",
    "James Corden": "TV Personality",
    "Jeff Bezos": "Businessperson",
    "John Cleese": "Movie/TV Actor",
    "John Lennon": "Singer/Musician",
    "Julia Child": "TV Personality",
    "Julia Roberts": "Movie/TV Actress",
    "Katy Perry": "Singer/Musician",
    "Kim Kardashian": "TV Personality",
    "Kurt Cobain": "Singer/Musician",
    "Lance Armstrong": "Athlete",
    "Larry Bird": "Athlete",
    "Leonardo DiCaprio": "Movie/TV Actor",
    "Lionel Messi": "Athlete",
    "Louis Armstrong": "Singer/Musician",
    "Madonna": "Singer/Actress",
    "Mark Zuckerberg": "Businessperson",
    "Meryl Streep": "Movie/TV Actress",
    "Michael Jackson": "Singer/Musician",
    "Michael Jordan": "Athlete",
    "Mr. Rogers": "TV Personality",
    "Muhammad Ali": "Athlete",
    "Naomi Campbell": "Model",
    "Natalie Portman": "Movie/TV Actress",
    "Oprah Winfrey": "TV Personality",
    "Patrick Stewart": "Movie/TV Actor",
    "Prince Charles": "Royalty",
    "Prince William": "Royalty",
    "Quentin Tarantino": "Director",
    "Rafael Nadal": "Athlete",
    "Rihanna": "Singer/Musician",
    "Ryan Seacrest": "TV Personality",
    "Scarlett Johansson": "Movie/TV Actress",
    "Sean Connery": "Movie/TV Actor",
    "Serena Williams": "Athlete",
    "Siri": "Brand/Mascot",
    "Snoop Dogg": "Singer/Musician",
    "Stan Lee": "Author",
    "Stephen King": "Author",
    "Steve Irwin": "TV Personality",
    "Steven Spielberg": "Director",
    "Stevie Wonder": "Singer/Musician",
    "Tiger Woods": "Athlete",
    "Tom Brady": "Athlete",
    "Tom Cruise": "Movie/TV Actor",
    "Usain Bolt": "Athlete",
    "Victoria Beckham": "Singer/Musician",
    "Whoopi Goldberg": "Movie/TV Actress",
    "Willie Mays": "Athlete",
    "Woody Allen": "Director",
}

# Likely royalty among non-Celebrity entries (for report + optional apply).
# Only move clear monarchs / princes / royal consorts — not mythic kings unless user wants.
ROYALTY_CANDIDATES = {
    "Elizabeth II": "Royalty",
    "Louis XIV, The Sun King": "Royalty",
    "Cleopatra": "Royalty",
    "Tutankhamen": "Royalty",
    # Borderline — present but do NOT auto-apply unless flagged True
}

# Do not auto-apply other royalty — report candidates for user decision.
APPLY_ROYALTY: set[str] = set()

# Strong royalty candidates currently in other categories:
STRONG_ROYALTY = [
    ("Elizabeth II", "Historical figure"),
    ("Louis XIV, The Sun King", "Historical figure"),
    ("Cleopatra", "Historical figure"),
    ("Tutankhamen", "Historical figure"),
]

# Borderline:
BORDERLINE_ROYALTY = [
    ("Julius Caesar", "Historical figure", "Roman dictator / imperial founder — not a king"),
    ("Napoleon Bonaparte", "Historical figure", "Emperor by title; often kept as historical figure"),
    ("King Arthur", "Literary character", "Legendary king"),
    ("Prince Charming", "Literary character", "Fairy-tale prince"),
    ("Dalai Lama", "Historical figure", "Spiritual leader, not secular royalty"),
]


def main() -> None:
    text = JS.read_text(encoding="utf-8")

    def replacer(match: re.Match) -> str:
        name = match.group(1)
        rest = match.group(2)  # everything after category value's opening through end of object-ish
        # match is name + category only
        old_cat = match.group(2)
        after = match.group(3)
        new_cat = None
        if name in RECLASSIFY:
            new_cat = RECLASSIFY[name]
        elif name in APPLY_ROYALTY:
            new_cat = "Royalty"
        if not new_cat:
            return match.group(0)
        return f'name: "{name}", category: "{new_cat}"{after}'

    pattern = re.compile(r'name: "([^"]+)", category: "([^"]+)"(,|\s*\})')
    new_text, n = pattern.subn(replacer, text)

    # Count remaining Celebrity
    remaining = re.findall(r'name: "([^"]+)", category: "Celebrity"', new_text)
    royalty = re.findall(r'name: "([^"]+)", category: "Royalty"', new_text)

    JS.write_text(new_text, encoding="utf-8")

    changed = sum(1 for name in RECLASSIFY if f'name: "{name}", category: "{RECLASSIFY[name]}"' in new_text)
    print(f"Reclassified entries present: {changed}/{len(RECLASSIFY)}")
    print(f"Remaining Celebrity: {len(remaining)} -> {remaining}")
    print(f"Royalty now: {len(royalty)} -> {', '.join(royalty)}")
    print("\nStrong royalty candidates (NOT changed):")
    for name, cat in STRONG_ROYALTY:
        print(f"  - {name} [{cat}]")
    print("\nBorderline (NOT changed):")
    for name, cat, note in BORDERLINE_ROYALTY:
        print(f"  - {name} [{cat}]: {note}")


if __name__ == "__main__":
    main()
