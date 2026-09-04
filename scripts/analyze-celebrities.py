#!/usr/bin/env python3
"""Analyze and reclassify Celebrity entries in characters.js."""

from __future__ import annotations

import re
from collections import Counter, defaultdict
from pathlib import Path

JS = Path(__file__).resolve().parents[1] / "characters.js"

# Manual classification for every current Celebrity entry.
# Values are the new category string.
CLASSIFY: dict[str, str] = {
    # --- Singer/Musician ---
    "Ariana Grande": "Singer/Musician",
    "Elvis Presley": "Singer/Musician",
    "Beyoncé": "Singer/Musician",
    "Taylor Swift": "Singer/Musician",
    "Céline Dion": "Singer/Musician",
    "Britney Spears": "Singer/Musician",
    "Cher": "Singer/Musician",
    "David Bowie": "Singer/Musician",
    "Dolly Parton": "Singer/Musician",  # also actress — Singer/Actress also fits; prefer musician primary
    "Eminem": "Singer/Musician",
    "Frank Sinatra": "Singer/Musician",  # also actor — Singer/Actor
    "Freddie Mercury": "Singer/Musician",
    "John Lennon": "Singer/Musician",
    "Katy Perry": "Singer/Musician",
    "Kurt Cobain": "Singer/Musician",
    "Louis Armstrong": "Singer/Musician",
    "Madonna": "Singer/Musician",  # also actress
    "Michael Jackson": "Singer/Musician",
    "Rihanna": "Singer/Musician",
    "Snoop Dogg": "Singer/Musician",
    "Stevie Wonder": "Singer/Musician",
    # --- Singer/Actor / Singer/Actress ---
    "Frank Sinatra_ALT": "Singer/Actor",  # placeholder unused
    "Jennifer?": "Singer/Actress",
    # Revisit dual roles below in COMBOS section of output
    # --- Movie/TV Actor ---
    "Arnold Schwarzenegger": "Movie/TV Actor",
    "Clint Eastwood": "Movie/TV Actor",
    "Leonardo DiCaprio": "Movie/TV Actor",
    "Tom Cruise": "Movie/TV Actor",
    "Chris Rock": "Movie/TV Actor",  # comedian/actor — borderline TV Personality
    "Patrick Stewart": "Movie/TV Actor",
    "Sean Connery": "Movie/TV Actor",
    "John Cleese": "Movie/TV Actor",
    "Woody Allen": "Movie/TV Actor",  # director/actor
    "George Foreman": "Athlete",  # not actor
    # --- Movie/TV Actress ---
    "Marilyn Monroe": "Movie/TV Actress",
    "Angelina Jolie": "Movie/TV Actress",
    "Audrey Hepburn": "Movie/TV Actress",
    "Awkwafina": "Movie/TV Actress",  # also rapper — Singer/Actress?
    "Halle Berry": "Movie/TV Actress",
    "Julia Roberts": "Movie/TV Actress",
    "Meryl Streep": "Movie/TV Actress",
    "Natalie Portman": "Movie/TV Actress",
    "Scarlett Johansson": "Movie/TV Actress",
    "Whoopi Goldberg": "Movie/TV Actress",  # also TV personality
    "Cindy Crawford": "Model",
    "Naomi Campbell": "Model",
    "Victoria Beckham": "Singer/Musician",  # Spice Girls; also fashion
    # --- TV Personality ---
    "Ellen DeGeneres": "TV Personality",
    "Gordon Ramsay": "TV Personality",
    "Guy Fieri": "TV Personality",
    "Howard Stern": "TV Personality",
    "James Corden": "TV Personality",
    "Oprah Winfrey": "TV Personality",
    "Ryan Seacrest": "TV Personality",
    "Mr. Rogers": "TV Personality",
    "Bob Ross": "TV Personality",
    "Steve Irwin": "TV Personality",
    "Julia Child": "TV Personality",
    # --- leave rest for analysis ---
}

# Full intended mapping after review — complete set
FINAL: dict[str, str] = {
    # Seed celebrities
    "Ariana Grande": "Singer/Musician",
    "Elvis Presley": "Singer/Musician",
    "Beyoncé": "Singer/Musician",
    "Taylor Swift": "Singer/Musician",
    "Marilyn Monroe": "Movie/TV Actress",
    # Imported
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
    "Bugs Bunny": "Cartoon character",  # misclassified — fix back
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
    "Quentin Tarantino": "Director",
    "Rafael Nadal": "Athlete",
    "Rihanna": "Singer/Musician",
    "Ryan Seacrest": "TV Personality",
    "Scarlett Johansson": "Movie/TV Actress",
    "Sean Connery": "Movie/TV Actor",
    "Serena Williams": "Athlete",
    "Siri": "Brand/Mascot",
    "Snoop Dogg": "Singer/Musician",
    "Stan Lee": "Author",  # comic creator — Author/Creator?
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


def main() -> None:
    text = JS.read_text(encoding="utf-8")
    entries = re.findall(
        r'\{\s*name:\s*"([^"]+)"\s*,\s*category:\s*"([^"]+)"',
        text,
    )
    celebs = [name for name, cat in entries if cat == "Celebrity"]
    print(f"Celebrity count: {len(celebs)}\n")

    by_cat: dict[str, list[str]] = defaultdict(list)
    missing = []
    for name in celebs:
        cat = FINAL.get(name)
        if not cat:
            missing.append(name)
            continue
        by_cat[cat].append(name)

    print("=== Mapped into requested / proposed categories ===")
    for cat in sorted(by_cat, key=lambda c: (-len(by_cat[c]), c)):
        names = by_cat[cat]
        print(f"\n{cat} ({len(names)})")
        print("  " + ", ".join(names))

    if missing:
        print(f"\n=== UNMAPPED ({len(missing)}) ===")
        print(", ".join(missing))

    # Proposed new categories summary (not in user's list)
    user_cats = {
        "Celebrity",
        "Movie/TV Actor",
        "Movie/TV Actress",
        "Singer/Musician",
        "Singer/Actor",
        "Singer/Actress",
        "TV Personality",
    }
    print("\n=== Proposed additional categories (not in your list) ===")
    for cat in sorted(by_cat):
        if cat in user_cats:
            continue
        names = by_cat[cat]
        print(f"{cat}: {len(names)} — e.g. {', '.join(names[:5])}")


if __name__ == "__main__":
    main()
