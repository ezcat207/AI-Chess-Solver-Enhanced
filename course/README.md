# AI Chess Solver — Interactive Course

## What This Is

A single-page HTML course that teaches how the AI Chess Solver works, designed for "vibe coders" who build with AI but want to understand what's happening under the hood.

## Current Status

✅ **Complete Infrastructure**
- `styles.css` — Complete design system
- `main.js` — Interactive JavaScript engine
- `_base.html` — HTML shell with navigation
- `_footer.html` — Closing tags
- `build.sh` — Assembly script

✅ **Completed Modules** (2 of 5)
- **Module 1:** The Chess Computer's Brain — How AI makes move decisions
- **Module 2:** Meet the Cast — The three JavaScript files and their jobs

⏳ **Remaining Modules** (3 of 5)
- **Module 3:** The Crystal Ball — Minimax algorithm deep dive
- **Module 4:** Three Personalities — Strategy weights explained
- **Module 5:** When Things Break — Debugging chess AI

## How to Build & View

From this directory (`/Volumes/Lexar/Github/AI-Chess-Solver/course/`):

```bash
# Assemble the course
bash build.sh

# Open in browser
open index.html
```

The build script concatenates `_base.html` + all `modules/*.html` + `_footer.html` into one `index.html` file.

## What Works Right Now

Even with only 2 modules complete, you can build and view the course to see:

- Scroll-based navigation with animated progress bar
- Module 1 with group chat animation showing component communication
- Code ↔ English translation blocks
- Interactive quizzes with instant feedback
- Glossary tooltips on technical terms
- Responsive design that works on mobile

## Course Design Decisions

**Accent Color:** Teal (#2A7B9B) — Chosen to evoke strategic thinking and intelligence

**Target Audience:** People who build software by directing AI tools, without traditional CS backgrounds

**Teaching Approach:**
- Start with what learners can see (watching AI play)
- Trace actual execution (not abstract theory)
- Use real code from the project (no simplified examples)
- Test application, not memorization

## Completing the Course

### Module 3: The Crystal Ball
Should include:
- Data flow animation showing tree search
- Alpha-Beta pruning visualization
- Code translation of the minimax recursion
- Explanation of search depth vs breadth tradeoffs

### Module 4: Three Personalities
Should include:
- Side-by-side strategy comparison (aggressive vs positional)
- Code translation of evaluation weights
- Pattern cards for each playing style
- Quiz about choosing strategies for different situations

### Module 5: When Things Break
Should include:
- Spot-the-bug challenge with real code
- Common chess AI bugs (off-by-one in piece-square tables, etc.)
- Debugging scenarios
- Quiz about diagnosing issues

Each module needs 200-300 lines of HTML following the patterns established in modules 1 and 2.

## File Structure

```
course/
├── styles.css           ✅ Design system
├── main.js              ✅ Interactive engine
├── _base.html           ✅ HTML shell
├── _footer.html         ✅ Closing tags
├── build.sh             ✅ Build script
├── README.md            ✅ This file
├── COURSE_SUMMARY.md    ✅ Detailed design doc
└── modules/
    ├── 01-brain.html          ✅ Complete
    ├── 02-cast.html           ✅ Complete
    ├── 03-crystal-ball.html   ⏳ To be written
    ├── 04-personalities.html  ⏳ To be written
    └── 05-breaks.html         ⏳ To be written
```

## Interactive Elements Used

- ✅ **Group Chat** — Components talking (Module 1)
- ✅ **Code ↔ English** — Translation blocks (Modules 1 & 2)
- ✅ **Quizzes** — Multiple choice (Both modules)
- ✅ **Glossary Tooltips** — All technical terms
- ✅ **Callout Boxes** — Key insights (Both modules)
- ✅ **Pattern Cards** — Component roles (Module 2)
- ✅ **Flow Diagrams** — Communication sequence (Module 2)
- ⏳ **Data Flow Animation** — Needed for Module 3
- ⏳ **Spot-the-Bug** — Needed for Module 5

## Design Philosophy

Every element follows these principles:
- **Show, don't tell** — Max 2-3 sentences per text block
- **Code from the project** — No simplified examples
- **One concept per screen** — No information overload
- **Application over memorization** — Quizzes test practical understanding
- **Aggressive tooltips** — Every technical term defined

## References

All reference documentation lives in `/Volumes/Lexar/Github/codebase-to-course/references/`:
- `content-philosophy.md` — Writing guidelines
- `interactive-elements.md` — HTML patterns
- `design-system.md` — Color/typography specs
- `gotchas.md` — Common mistakes to avoid

---

**Built with the codebase-to-course skill** — Transform any codebase into an interactive learning experience.
