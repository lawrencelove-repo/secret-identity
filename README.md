# Secret Identity

A landscape iPad web app for dealing and scoring **Secret Identity**-style rounds: character slots on the left, player color scores on the right.

Open `index.html` via a local static server (or your usual hosting). The game is a set of front-end modules (`characters.js`, `round-module.js`, `score-module.js`, etc.) with no backend required.

---

## Settings menu

From the hamburger menu (visible once a game has started):

| Item | What it does |
|---|---|
| **New Game** | Opens color selection (confirms first if a game is already in progress) |
| **Edit Characters** | Opens the character editor |
| **Clear Play History** | Confirms, then resets deal counts **on this device only** |
| **Settings** | Opens the settings panel |

### Settings

| Setting | What it does |
|---|---|
| **Specify character** | Cookie toggle. When on, a pencil appears in the character modal to pick a specific replacement |
| **Allow Random** | Cookie toggle. When on, the **Random** button appears on the incomplete-round confirm |

Installable as a PWA (manifest + service worker) with icons under `assets/favicon/`.

---

## Characters, play history, and devices

The roster is seeded in `characters.js` (`CHARACTERS`). Deals prefer characters that have been shown **less often on this browser/device**, using counts stored in `localStorage`.

### How data is split

| Data | This device | Git / other players |
|---|---|---|
| **Play counts** | Always local (`localStorage`) | Never exported |
| **Add / edit / disable** | Saved locally right away | Use **Export**, then update `characters.js` and commit |

### On iPad

- Edits, disables, and play counts stick on **that iPad**.
- Nothing is written to a server automatically.
- Clearing play history only affects that device.

### On desktop (local server)

- Same local saves as above.
- In **Edit Characters**, use **Export** to download `characters-array.js`.
- Replace the `CHARACTERS` array in `characters.js` with the downloaded contents, then commit so other players get the updated roster.
- Play counts still never leave the device.

### Optional fields on a character

```js
{ name: "Example", category: "Movie character", description: "Some Film", disabled: true }
```

- `category` — limits how many of the same type appear in one deal  
- `description` — shown under the name when present  
- `disabled: true` — excluded from dealing  

---

## Fullscreen characters

Bottom-left controls (while playing):

- **Expand / collapse** — characters fill the screen in a 2×4 grid (scores hidden)
- **Flip** — shows each name upright and upside-down (for a tablet flat on the table)

---

## Local server

From the project root:

```powershell
.\scripts\start-server.ps1
```

Or in **Cursor / VS Code**: **Terminal → Run Task… → Start local server** (also bound as the default build task: `Ctrl+Shift+B`). The script clears anything already on port 5173, then serves at http://127.0.0.1:5173/.

---

## Development notes

- Character deals and replacements go through `CharacterCatalog` + `CharacterHistory` in `characters.js`.
- Device catalog overlays (extras / overrides) live under the `secret-identity.character-catalog` key; play counts under `secret-identity.character-plays`.
- To wipe play counts from a desktop console: `CharacterHistory.clear()`.
