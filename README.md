# Find the Path / 记忆寻路
A bilingual rabbit memory game with adaptive difficulty, 10-round sets, and daily best scores. No account required.

Play: https://liuyanstone.github.io/find-the-path/

## Play and progression
Study the landmines for a few seconds. They disappear, and the start and finish appear. Guide Clover along adjacent tiles with taps, dragging, arrow keys, WASD, or the onscreen arrows. You can backtrack, undo, or clear your path. The mines never give early feedback; only the final route is checked at the flag.

Each set has exactly 10 completed rounds and starts at 6×6:
- Success: earn that level's points and move up one size, capped at 14×14.
- One failure: zero points and stay at the same level.
- Two consecutive failures at the same level: drop one size, with a floor of 6×6. The failure counter resets after a success or a drop.
- After 10 rounds: show every result and the sum of successful-round points. A new set starts again at 6×6.

| Grid | Random landmines | Preview | Success points |
| --- | --- | --- | --- |
| 6 × 6 | 4–6 | 4 seconds | 100 |
| 7 × 7 | 6–10 | 4 seconds | 200 |
| 8 × 8 | 7–12 | 5 seconds | 300 |
| 9 × 9 | 8–14 | 5 seconds | 400 |
| 10 × 10 | 9–15 | 6 seconds | 500 |
| 11 × 11 | 10–16 | 6 seconds | 600 |
| 12 × 12 | 11–18 | 7 seconds | 700 |
| 13 × 13 | 12–20 | 7 seconds | 800 |
| 14 × 14 | 13–24 | 8 seconds | 900 |

Every round randomly chooses a mine count within its range, new endpoints, and mine positions. A breadth-first search verifies a safe route, with a bounded fallback that reserves a route if needed. Start and finish never contain mines.

## Daily scores and saved state
Dates use the player's local calendar day. Each new day starts fresh at 6×6; previous daily bests remain saved. Same-day reloads retain completed rounds and score in an unfinished set; an uncompleted field is freshly generated at the earned level. Reloading a completed set shows its summary and cannot add an 11th round.

Only completed 10-round totals qualify for the daily score. Playing more sets keeps the maximum, never the sum of the set scores. Maximum possible set score is 5,400 points. English/Chinese preference, sound setting, active set, and daily history are stored on this browser/device, without accounts or cross-device syncing.

## Sound and readability
Gentle step sounds, a success melody, and a distinct descending failure sound use local Web Audio synthesis. Hidden-mine steps sound identical to safe steps. Use the saved Sound on/off toggle. Large instructions, stronger text contrast, and bigger controls support comfortable reading.

## Development
Buildless HTML/CSS/SVG/ES modules. Serve with `python3 -m http.server 8773`.
- `node check.mjs`: 9,000 randomized boards, exact ranges, variable counts, solvability, route playback, failures, backtracking, bounded fallback, translation parity.
- `node check-session.mjs`: progression, failure streaks, caps, 10-round scores, repeated sets, daily maximums, reloads, local-day rollover, history, and storage validation.
- `node check-audio.mjs`: gentle cue scheduling, mute, saved preferences, and distinct outcome melodies.
