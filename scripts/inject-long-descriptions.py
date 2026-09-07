#!/usr/bin/env python3
"""Inject longDescription from scripts/_long-descriptions.json into characters.js."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CHARS_PATH = ROOT / "characters.js"
LONG_PATH = ROOT / "scripts" / "_long-descriptions.json"

text = CHARS_PATH.read_text(encoding="utf-8")
long_map = json.loads(LONG_PATH.read_text(encoding="utf-8"))


def js_escape(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def inject_into_object(obj_body: str) -> str:
    name_m = re.search(r'name:\s*"([^"]+)"', obj_body)
    if not name_m:
        return obj_body
    name = name_m.group(1)
    long_desc = long_map.get(name)
    if not long_desc:
        return obj_body

    # Remove any existing longDescription
    cleaned = re.sub(
        r',?\s*longDescription:\s*"(?:\\.|[^"\\])*"',
        "",
        obj_body,
    )
    cleaned = re.sub(
        r',?\s*longDescription:\s*null',
        "",
        cleaned,
    )

    # Insert after description if present, else after category/categories, else after name
    long_field = f", longDescription: {js_escape(long_desc)}"

    if re.search(r"description:\s*", cleaned):
        cleaned = re.sub(
            r'(description:\s*"(?:\\.|[^"\\])*")',
            r"\1" + long_field,
            cleaned,
            count=1,
        )
    elif re.search(r"categories:\s*\[", cleaned):
        cleaned = re.sub(
            r"(categories:\s*\[[^\]]*\])",
            r"\1" + long_field,
            cleaned,
            count=1,
        )
    elif re.search(r'category:\s*"', cleaned):
        cleaned = re.sub(
            r'(category:\s*"(?:\\.|[^"\\])*")',
            r"\1" + long_field,
            cleaned,
            count=1,
        )
    else:
        cleaned = re.sub(
            r'(name:\s*"(?:\\.|[^"\\])*")',
            r"\1" + long_field,
            cleaned,
            count=1,
        )
    return cleaned


match = re.search(r"(const CHARACTERS = \[)(.*?)(\];)", text, re.S)
if not match:
    raise SystemExit("CHARACTERS array not found")

prefix, body, suffix = match.group(1), match.group(2), match.group(3)

# Replace each object body carefully
def repl_obj(m):
    return "{" + inject_into_object(m.group(1)) + "}"


new_body = re.sub(r"\{([^{}]+)\}", repl_obj, body)

# Update header comment
text_out = text[: match.start()] + prefix + new_body + suffix + text[match.end() :]
text_out = text_out.replace(
    " *   description — shown under the name when present; richer uses later\n",
    " *   description — short label (often a franchise/title) where brevity matters\n"
    " *   longDescription — longer clue-helper text shown on the character card\n",
)

CHARS_PATH.write_text(text_out, encoding="utf-8")

# Verify
verify = CHARS_PATH.read_text(encoding="utf-8")
count = len(re.findall(r"longDescription:", verify))
print(f"injected longDescription fields: {count}")
missing = [n for n in long_map if f'name: "{n}"' in verify and f"longDescription:" not in verify[verify.find(f'name: "{n}"') : verify.find(f'name: "{n}"') + 500]]
# better verify per name
still_missing = []
for name in long_map:
    idx = verify.find(f'name: "{name}"')
    if idx < 0:
        still_missing.append(name)
        continue
    chunk = verify[idx : idx + 800]
    end = chunk.find("},")
    if end > 0:
        chunk = chunk[:end]
    if "longDescription:" not in chunk:
        still_missing.append(name)
print(f"missing after inject: {len(still_missing)}")
if still_missing[:10]:
    print(still_missing[:10])
