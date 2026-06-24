# AI Chess Solver Enhanced

Play chess against AI or watch autonomous AI agents compete, with 59 classic endgame positions and human vs AI gameplay. Built from scratch with Minimax and Alpha-Beta Pruning in vanilla JavaScript.

> **Based on:** [AI-Chess-Solver](https://github.com/Vedag812/AI-Chess-Solver) by Vedag812
> **Enhancements:** Human vs AI gameplay, bilingual UI (EN/中), AI hint system, interactive learning materials

## The big picture

The core idea is the same one behind Monte Carlo Tree Search agents in games like Uno: rather than hardcoding chess strategy, the agents figure out what works by searching through thousands of possible future positions and measuring which moves lead to better outcomes. There are no rules like "always control the center" or "trade when you're up material." Strategy emerges entirely from the evaluation function and the depth of the search.

Each agent runs on a simple loop. Every turn, the engine calls `findBestMove()` which runs Minimax with Alpha-Beta pruning to a configurable depth, evaluates every reachable leaf position, and propagates scores back up the tree. The move with the highest score gets played. Both agents use the same search algorithm but with different **evaluation weight vectors** — this is what gives each agent its own personality and playing style.

The game state is a flat 64-element array representing the board. Moves are objects with `from`, `to`, and optional fields for castling, en passant, and promotion. The engine generates all pseudo-legal moves, filters out ones that leave the king in check, and hands the legal move list to the AI. After the AI picks a move, `makeMove()` applies it and `unmakeMove()` can reverse it — this is how the search tree gets explored without copying the entire board every node.

## How the agents work

### Evaluation function

The evaluation function is where the agents' "personalities" come from. It scores a position by combining several factors, each scaled by a strategy-specific weight:

- **Material** — piece values (pawn = 100, knight = 320, bishop = 330, rook = 500, queen = 900)
- **Position** — piece-square tables that reward pieces on strong squares (knights in the center, rooks on open files, etc.)
- **Mobility** — number of legal moves available, rewarding active positions
- **Attack** — count of captures available, rewarding aggressive piece placement
- **King safety** — pawn shield around the king, penalizing exposed kings
- **Center control** — bonus for occupying d4, d5, e4, e5

Each strategy profile scales these differently:

| Strategy | Material | Position | Mobility | Attack | King Safety | Center |
|---|---|---|---|---|---|---|
| **Aggressive** | 1.0 | 0.8 | 1.5 | **2.0** | 0.5 | 1.0 |
| **Positional** | 1.0 | **1.3** | 1.0 | 0.8 | 1.2 | **1.5** |
| **Defensive** | **1.2** | 1.0 | 0.8 | 0.5 | **2.0** | 0.8 |
| **Random** | 0.3 | 0.2 | 0.1 | 0.1 | 0.1 | 0.1 |

The Random agent exists as a baseline, similar to the `RandomAgent` in the Uno project — it provides a floor to measure how much better the strategic agents actually are.

### Minimax with Alpha-Beta pruning

`minimax()` is the core search. It explores the game tree to a fixed depth, alternating between maximizing (current player wants the highest score) and minimizing (opponent wants the lowest). Alpha-Beta pruning cuts off branches that can't possibly affect the final decision — if a branch is already worse than a known alternative, there's no point searching deeper into it.

Move ordering matters a lot for pruning efficiency. Before searching, moves are sorted by:
1. **Captures first** — using MVV-LVA (Most Valuable Victim - Least Valuable Attacker), so capturing a queen with a pawn gets searched before capturing a pawn with a queen
2. **Promotions** — pawn promotions are high priority
3. **Castling** — slight bonus since it's usually a good move

Good move ordering means the alpha-beta cutoffs happen early, which lets the engine search the same depth in far fewer nodes.

### The search loop

`findBestMove()` generates all legal moves, orders them, then evaluates each one by calling `minimax()` on the resulting position. The move with the highest score is returned along with statistics: nodes searched, search depth, and computation time. These stats are displayed in the UI in real time so you can watch the engine's "thought process."

## What you can do with it

- **Human vs AI gameplay** — play against the AI with click-to-move interface and highlighted legal moves
- **AI hint system** — get top 2 move recommendations with evaluation scores during gameplay (optimized two-phase search: 85%+ node reduction)
- **Bilingual interface** — toggle between English and Chinese with one click
- **Watch AI vs AI matches** — press Start and two agents play automatically at adjustable speed (50ms to 1.5s per move)
- **59 classic endgame positions** — organized in 8 categories (basic, tactics, pawn, rook, queen, famous, complex, puzzles)
- **Random endgame generator** — practice with procedurally generated positions
- **Configure strategies** — pick Human, Aggressive, Positional, Defensive, or Random for each side
- **Adjust search depth** — from depth 2 (fast, weak) to depth 6 (slow, strong)
- **Auto-rematch** — agents play continuous matches, tracking wins/losses/draws across games
- **Load any position** — paste FEN strings or select from the endgame library
- **Live evaluation bar** — shows which side the engine thinks is winning in real time
- **Full match log** — records every game result with move counts and outcomes

## File structure

```
AI-Chess-Solver/
├── index.html          # UI layout — agent config, board, panels, controls
├── style.css           # Dark-mode design system, piece styling, animations
├── chess-engine.js     # Full chess rules engine (move gen, validation, FEN, SAN)
├── chess-ai.js         # Minimax + Alpha-Beta AI with strategy weight profiles
├── app.js              # Auto-play controller, match tracking, board rendering
├── course/             # Interactive course (40% complete)
│   ├── index.html      # Main course page
│   ├── styles.css      # Course design system
│   ├── main.js         # Interactive engine
│   └── modules/        # Course modules
│       ├── 01-brain.html     # ✅ The Chess Computer's Brain
│       └── 02-cast.html      # ✅ Meet the Cast
└── tutorials/          # Standalone learning resources
    ├── chess-tutorial.html      # How to play chess (beginner to advanced)
    └── chess-modeling.html      # Data structures & algorithms deep-dive
```

## Educational Materials

This project includes three comprehensive learning resources designed to help you understand both chess and the AI implementation:

### 🎓 Interactive Course (40% Complete)
**Path:** `course/index.html`

A single-page interactive course teaching how the AI Chess Solver works, designed for "vibe coders" who build with AI but want to understand what's happening under the hood.

**✅ Completed Modules:**
- **Module 1: The Chess Computer's Brain** — How AI makes move decisions
- **Module 2: Meet the Cast** — The three JavaScript files and their jobs

**⏳ Coming Soon:**
- Module 3: The Crystal Ball (Minimax algorithm deep dive)
- Module 4: Three Personalities (Strategy weights explained)
- Module 5: When Things Break (Debugging chess AI)

**Features:**
- Scroll-based navigation with animated progress bar
- Group chat animations showing component communication
- Code ↔ English translation blocks
- Interactive quizzes with instant feedback
- Glossary tooltips on technical terms
- Responsive design for mobile

### ♟️ Chess Tutorial
**Path:** `tutorials/chess-tutorial.html`

Learn how to play chess from scratch! A self-contained HTML resource (79KB, 1,919 lines) covering:

- **Beginner Level:** Piece movements, board setup, special moves (castling, en passant, promotion)
- **Intermediate Level:** Tactical patterns (forks, pins, skewers, discovered attacks)
- **Advanced Level:** Strategic concepts, famous openings, endgame principles

**Interactive Elements:**
- Animated chess boards demonstrating piece movements
- Tactical visualizations
- Knowledge check quizzes
- Real chess position examples

### 🔬 Chess Modeling Guide
**Path:** `tutorials/chess-modeling.html`

Technical deep-dive into the data structures and algorithms used in this chess solver (103KB, 2,181 lines).

**Eight Core Topics:**
1. Board representation (flat array, coordinate systems)
2. Piece representation and encoding
3. Move generation algorithms
4. Move validation and legal move filtering
5. State management (makeMove/unmakeMove)
6. Search algorithms (Minimax, Alpha-Beta pruning)
7. Evaluation functions and piece-square tables
8. Performance optimizations (move ordering, transposition tables)

**Interactive Elements:**
- Array indexing demo
- Bitboard visualizer
- Knight move generator
- Minimax tree visualizer
- Real code examples from this project

**Why These Materials?**
These resources were created to support learners like Luna who want to:
- Understand graph theory and search algorithms through a concrete application
- See how classical AI techniques work in practice
- Build intuition for game tree search and evaluation
- Learn by modifying real, working code

## How to run

Open `index.html` in any modern browser. No build step, no dependencies, no server needed.

Or visit the live deployment: [**ai-chess-solver-enhanced.vercel.app**](https://ai-chess-solver-enhanced-2ij6v33hk-ezcat207s-projects.vercel.app/)

## Tech

JavaScript, HTML, CSS, Minimax, Alpha-Beta Pruning, Piece-Square Tables, MVV-LVA Move Ordering, FEN Parsing, SAN Notation, CSS Animations.
