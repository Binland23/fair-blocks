# Fair Blocks Implementation Plan

Goal: Ship a polished iPhone-first original block puzzle with demonstrably solvable deals.
Architecture: A self-contained index.html contains pure bitmask board/seeded dealer logic, DOM rendering, pointer controls, audio and effects. A tiny service worker and manifest provide offline installation. Tests extract the production engine and exercise the real mobile UI.
Tech: HTML/CSS/JS, Node assertions, Playwright Chromium, GitHub Pages.

1. Write failing engine tests for simultaneous clears, placement rejection, three-piece search, reproducibility, shuffled family bags and thousands of deals. Run red; implement the engine; run green.
2. Write mobile browser tests for pointer placement, invalid drops, clears, game over, restart, sound/info, persistence and viewport fit. Run red; implement the responsive original glossy-block UI; run green and capture screenshots.
3. Add versioned network-first service worker, icons/manifest, executable Mac/Linux one-click openers and truthful fairness documentation. Verify standalone/offline behavior.
4. Run all tests and inspect screenshots; initialize the new repository, publish to Binland23/fair-blocks and enable main-root Pages. Verify live HTML hash against local and report any blocked deployment honestly.

Fairness contract: Each returned trio has an actual placement witness including intermediate clears. A seed drives shuffled family bags; candidates are postponed, not silently discarded, when incompatible with the board. Search may reject on a bounded work budget but never accepts without a witness. Three rescue singles are used when normal candidates fail; only an exhaustive failed single-trio search may end a deal. Conditional fairness necessarily changes accepted frequencies; the info screen explicitly discloses postponement and rescue exceptions. There is no score input to the dealer.
