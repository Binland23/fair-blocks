# Fair Blocks v1.0

**Play:** https://binland23.github.io/fair-blocks/

An original, mobile-first 8×8 block puzzle. No borrowed logos, artwork, sounds or fonts. The complete game is in `index.html`; no build, libraries, analytics or remote assets are needed.

## Open it
- iPhone: open the play link in Safari. Share → Add to Home Screen for the app-like, offline-capable version (visit online first).
- Mac: double-click **Open Fair Blocks.command**. If macOS asks, right-click → Open. It opens the live game, falling back to the local copy if offline. `--local` explicitly uses the local Python server; keep that terminal window open. If Python is absent, the standalone HTML still opens directly.
- Linux: **Open Fair Blocks.sh** provides the same behavior.
- Any computer: `index.html` also works directly as a file. Installation/offline caching requires HTTP(S).

## Play
Drag any tray piece onto the board. It floats above your finger, with a green valid/red invalid ghost. Alternatively, tap a piece, then tap the board cell for its top-left corner. Pieces do not rotate. Complete rows and columns clear simultaneously. The next trio arrives after all three pieces are used. The game ends when none of your remaining pieces fit. Restart uses a fresh seed; best score stays. The current run, board, tray, randomizer state, score and sound choice save locally; clearing browser data clears these records.

Each cell placed earns 5. Each cleared line earns 100 × your consecutive-clear streak; each extra simultaneous line adds 50. A move without a clear resets the streak. Sound starts muted. Haptics use the browser vibration API if available; iOS Safari generally does not support vibration.

## Precisely what “fair” means
1. Every newly offered trio has a concrete search witness: all three can be placed in at least one order, including intervening simultaneous clears. A solvable deal does not mean every move wins; your placements can still leave the remaining pieces blocked.
2. Eight families (single, line, square, L/J, T, S/Z, corner, rectangle) are shuffled in bags containing one of each family. A variant/orientation within the family is chosen by the seeded randomizer. Lines 2–5, 2×2/3×3 squares, both corner sizes and all shape rotations are included.
3. The dealer first tries the oldest three queued pieces, then a fixed limited set of lookahead trios. It never consumes a rejected piece. Deferred pieces wait, so accepted frequencies can differ from the bag frequencies; a fixed drought bound is not promised when a board cannot accommodate a family. This feasibility exception is disclosed in the in-game Fair Mode screen.
4. If none of those trios proves solvable, three rescue singles are dealt only after their own solution is verified. These are explicitly labeled and do not discard queued pieces. Only an exhaustive failure for three singles can prevent a new deal. Search work caps can reject candidates but can never admit an unproven deal.
5. The dealer has no score or streak input, no increasing difficulty, ads, paywalls or hidden engagement mechanics.
6. Run seeds appear in the footer/info screen. Open `?seed=FINDLAY` to replay a fresh seeded run. Identical seeds **and identical moves** reproduce deals. Ordinary reloads resume the saved run; an explicit seed starts it fresh.

## Tests
`node tests/engine.cjs` requires only Node. It tests placement, simultaneous clears, intervening-clear search, full-board rejection, shuffled family bags, deterministic seeds, 4,000 consecutive witness-path deals, and 3,000 random-density boards whose returned witnesses are validated with a separate cell-array oracle.

Browser tests (`mobile.cjs`, `pwa.cjs`, `persistence.cjs`) use Playwright Chromium. Start `python3 -m http.server 8777 --bind 127.0.0.1`, then run the test files with Node. In this build environment Playwright lives at `/workspace/starship_launch/node_modules/playwright`, and Chromium at `/opt/ungoogled-chromium/chrome`. The tests cover mobile pointer drags, native CDP touch, invalid drops, simultaneous clears, scores, game over/restart, sound/info, storage, corrupted saves, standalone file use, offline reload and four viewport sizes. Screenshots are under `shots/`.

## Offline updates
`sw.js` uses a versioned, game-scoped cache and network-first HTML. Only same-origin GET requests are considered, and activation removes only older Fair Blocks caches. Bump the cache version when changing shipped assets.
