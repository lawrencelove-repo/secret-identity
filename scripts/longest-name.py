from pathlib import Path
import re

t = Path("characters.js").read_text(encoding="utf-8")
names = re.findall(r'name: "([^"]+)"', t)
names.sort(key=len, reverse=True)
for n in names[:15]:
    print(f"{len(n):3}  {n}")
