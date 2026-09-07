#!/usr/bin/env python3
"""Parse CHARACTERS from characters.js and print stats / JSON list."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEXT = (ROOT / "characters.js").read_text(encoding="utf-8")
MATCH = re.search(r"const CHARACTERS = \[(.*?)\];", TEXT, re.S)
BODY = MATCH.group(1)
ENTRIES = re.findall(r"\{([^{}]+)\}", BODY)

rows = []
for e in ENTRIES:
    name_m = re.search(r'name:\s*"([^"]+)"', e)
    desc_m = re.search(r'description:\s*"([^"]*)"', e)
    cat_m = re.search(r'category:\s*"([^"]+)"', e)
    cats_m = re.search(r"categories:\s*(\[[^\]]+\])", e)
    if not name_m:
        continue
    rows.append(
        {
            "name": name_m.group(1),
            "description": desc_m.group(1) if desc_m else None,
            "category": cat_m.group(1) if cat_m else None,
            "categories_raw": cats_m.group(1) if cats_m else None,
            "raw": e.strip(),
        }
    )

print(f"count={len(rows)}")
print(f"with_desc={sum(1 for r in rows if r['description'])}")
print(f"without_desc={sum(1 for r in rows if not r['description'])}")
(ROOT / "scripts" / "_characters-export.json").write_text(
    json.dumps(rows, indent=2, ensure_ascii=False), encoding="utf-8"
)
print("wrote scripts/_characters-export.json")
