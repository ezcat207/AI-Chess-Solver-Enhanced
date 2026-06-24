# Next Steps to Complete the Course

## What You Have Right Now

A **working, viewable course** with 2 of 5 modules complete. You can open `index.html` in a browser to see:

- Beautiful scroll-based navigation
- Module 1: The Chess Computer's Brain (complete with animations & quiz)
- Module 2: Meet the Cast (complete with diagrams & quiz)
- All interactivity working (tooltips, quizzes, chat animations)

## How to View It

```bash
cd /Volumes/Lexar/Github/AI-Chess-Solver/course
open index.html
```

Or just double-click `index.html` in Finder.

## What's Left to Do

Write 3 more module HTML files. Each takes about 30-45 minutes if you follow the established patterns.

### Module 3: The Crystal Ball (Minimax Deep Dive)

**File:** `modules/03-crystal-ball.html`

**Must include:**
1. Opening: Metaphor of AI as fortune teller seeing possible futures
2. Data flow animation showing tree search (see `interactive-elements.md` for HTML pattern)
3. Code translation of the `minimax()` recursive function
4. Explanation of Alpha-Beta pruning with visual example
5. Callout box: Why depth matters (depth 4 vs depth 6)
6. Quiz: 2-3 questions testing understanding of search behavior

**Key code snippet to translate:**
```javascript
minimax(engine, depth, alpha, beta, maximizing) {
  this.nodesSearched++;
  if (depth === 0) return this.evaluate(engine);
  // ... rest of minimax logic
}
```

**Color:** Use `var(--color-bg)` for even-numbered module (like Module 1)

---

### Module 4: Three Personalities, One Algorithm

**File:** `modules/04-personalities.html`

**Must include:**
1. Opening: How same algorithm creates different playing styles
2. Pattern cards showing the three strategies (aggressive, positional, defensive)
3. Side-by-side comparison table of strategy weights
4. Code translation of the evaluation function with weights
5. Callout box: Strategy emerges from numbers (no hardcoded rules)
6. Quiz: Matching strategies to game situations

**Key code snippet to translate:**
```javascript
static STRATEGY_WEIGHTS = {
  aggressive: { material: 1.0, position: 0.8, mobility: 1.5, attack: 2.0, ... },
  positional: { material: 1.0, position: 1.3, mobility: 1.0, attack: 0.8, ... },
  // ...
}
```

**Color:** Use `var(--color-bg-warm)` for odd-numbered module (like Module 2)

---

### Module 5: When Things Break

**File:** `modules/05-breaks.html`

**Must include:**
1. Opening: Debugging is a superpower for AI-assisted development
2. Common bugs section with 2-3 real examples
3. Spot-the-bug challenge (see `interactive-elements.md` for HTML pattern)
4. Scenario-based quiz: "User reports X, where do you look?"
5. Callout box: How to escape AI bug loops
6. Final takeaway: You now understand how chess computers think

**Spot-the-bug example:**
Show code with off-by-one error in piece-square table indexing.

**Color:** Use `var(--color-bg)` for even-numbered module

---

## Writing Tips

### Follow the Existing Pattern

Look at `modules/01-brain.html` and `02-cast.html` for structure:

```html
<section class="module" id="module-N" style="background: var(--color-bg);">
  <div class="module-content">
    <header class="module-header animate-in">
      <span class="module-number">0N</span>
      <h1 class="module-title">Title</h1>
      <p class="module-subtitle">Subtitle</p>
    </header>

    <!-- Screen 1 -->
    <div class="screen animate-in">
      <p>Opening paragraph...</p>
    </div>

    <!-- Screen 2 with heading -->
    <div class="screen animate-in">
      <h2 class="screen-heading">Section Title</h2>
      <p>Content...</p>
    </div>

    <!-- Quiz at the end -->
    <div class="screen animate-in">
      <h2 class="screen-heading">Check Your Understanding</h2>
      <div class="quiz-container" id="quiz-moduleN">
        <!-- quiz questions -->
      </div>
    </div>
  </div>
</section>
```

### Required Elements Per Module

- ✅ At least 1 code ↔ English translation
- ✅ At least 1 interactive element (animation, cards, or diagram)
- ✅ At least 1 callout box with universal insight
- ✅ At least 2 quiz questions
- ✅ Glossary tooltips on every technical term

### HTML Patterns to Use

All patterns are documented in `/Volumes/Lexar/Github/codebase-to-course/references/interactive-elements.md`:

- **Code translation:** `.translation-block` with `.translation-code` and `.translation-english`
- **Pattern cards:** `.pattern-cards` with `.pattern-card` children
- **Callout boxes:** `.callout.callout-accent` or `.callout-info`
- **Quiz:** `.quiz-container` with `.quiz-question-block` children
- **Glossary:** `<span class="term" data-definition="...">`

### After Writing Each Module

1. Save the HTML file to `modules/`
2. Run `bash build.sh` from the course directory
3. Open `index.html` to test
4. Check that navigation dots update when scrolling

---

## Quick Reference

### File Locations

- **Reference docs:** `/Volumes/Lexar/Github/codebase-to-course/references/`
- **Source codebase:** `/Volumes/Lexar/Github/AI-Chess-Solver/`
- **Course output:** `/Volumes/Lexar/Github/AI-Chess-Solver/course/`

### Key Code Files to Reference

When writing translations, pull real code from:
- `chess-engine.js` — Move generation, legality checking (lines 95-369)
- `chess-ai.js` — Minimax algorithm (lines 130-169), evaluation (lines 38-99)
- `app.js` — UI updates, game flow (lines 832-885)

### Building

```bash
cd /Volumes/Lexar/Github/AI-Chess-Solver/course
bash build.sh
```

Creates `index.html` by concatenating `_base.html` + `modules/*.html` + `_footer.html`.

---

## When You're Done

The complete course will be a single `index.html` file (probably around 50-60KB) that:
- Works offline (only external dependency: Google Fonts)
- Teaches how chess AI works through scroll-based modules
- Includes 15+ interactive elements (quizzes, animations, translations)
- Looks beautiful on desktop and mobile
- Can be shared as a single file

Then you can:
1. Deploy it to GitHub Pages, Vercel, or Netlify
2. Share the link with the AI Chess Solver repo
3. Use it as a template for future codebase-to-course projects

---

**You've already done the hard part** — the infrastructure is complete, the design is locked in, and the first two modules establish the pattern. The remaining three modules are just following that pattern with different content from the codebase.
