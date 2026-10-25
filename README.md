# Find the Path / 记忆寻路
A rabbit memory game in English and Simplified Chinese. Public browser game; no account required.

## Play
https://liuyanstone.github.io/find-the-path/

Study the landmines for a few seconds. They disappear, and the start and finish appear. Guide Clover along adjacent tiles with clicks, dragging, arrow keys, WASD, or onscreen arrows. Undo, clear, or backtrack before finishing. Mines never give early feedback. Only the final route is checked on reaching the flag. Review a safe route after either result.

| Difficulty | Grid | Landmines | Preview |
| --- | --- | --- | --- |
| Meadow / 草地 | 6 × 6 | 6 | 4 seconds |
| Orchard / 果园 | 8 × 8 | 12 | 5 seconds |
| Woodland / 森林 | 10 × 10 | 20 | 6 seconds |
| Highlands / 山野 | 12 × 12 | 32 | 7 seconds |
| Twilight / 暮色 | 14 × 14 | 44 | 8 seconds |
| Moonlight / 月夜 | 16 × 16 | 60 | 9 seconds |

Every round chooses new endpoints and mines. Start and finish are mine-free and separated by at least the grid width in Manhattan distance. Breadth-first search verifies a safe route; a bounded fallback reserves a random route if needed. Difficulty and mine counts stay exact.

Language preference and win/streak totals stay in this browser's local storage. There is no time limit during path finding. Hiding the tab during a preview prepares a fresh board.

## Development
Buildless HTML/CSS/SVG/ES modules. Serve with `python3 -m http.server 8768`. Run `node check.mjs` for 6,000 randomized board checks, solution playback, losing-path detection, backtracking, the fallback generator, and translation parity.

## Sound and readability
Gentle step sounds and a short success melody are synthesized locally with Web Audio. Use the Sound on / Sound off button; the setting is saved in this browser. A failed completed route plays a separate descending melody. Hidden-mine steps sound identical to safe steps. Audio begins after a player interaction.

Instructions use 18px text, controls use 16–18px text or larger, secondary labels use 14px or larger, and buttons have larger touch targets. English and Chinese layouts are supported.

Run `node check-audio.mjs` to verify cue scheduling, mute behavior, saved preferences, and distinct outcome melodies.
