/**
 * app.js — AI vs AI Auto-Play Controller
 * Two agents compete autonomously. Matches are tracked, logged, and visualized.
 * Inspired by the Uno MCTS project: agents discover strategy through play.
 */
(function () {
    'use strict';

    // ===== STATE =====
    let game = new ChessEngine();
    let whiteAI = new ChessAI(4, 'aggressive');
    let blackAI = new ChessAI(4, 'positional');
    let whiteIsHuman = false;
    let blackIsHuman = false;
    let running = false;
    let paused = false;
    let moveDelay = 500;
    let lastMove = null;
    let moveList = [];
    let matchCount = 0;
    let totalMovesPlayed = 0;
    let totalNodesSearched = 0;
    let whiteWins = 0;
    let blackWins = 0;
    let draws = 0;
    let matchLog = [];
    let timeoutId = null;
    let selectedSquare = null;
    let legalMovesFromSelected = [];
    let showHints = false;
    let hintMoves = [];
    let moveScores = []; // Store evaluation scores for each move

    const SPEED_MAP = [1500, 800, 500, 200, 50];
    const SPEED_LABELS = ['1.5s', '800ms', '500ms', '200ms', '50ms'];

    // ===== I18N =====
    let currentLang = localStorage.getItem('chess-lang') || 'en';

    const i18n = {
        en: {
            title: "AI Chess Solver",
            subtitle: "Minimax · Alpha-Beta · Autonomous Agents",
            matches: "Matches",
            moves: "Moves",
            nodes: "Nodes",
            agentWhite: "Agent White",
            agentBlack: "Agent Black",
            vs: "VS",
            wins: "wins",
            gameMode: "Game Mode",
            aiVsAi: "AI vs AI",
            humanVsAi: "Human vs AI",
            aiVsHuman: "AI vs Human",
            humanVsHuman: "Human vs Human",
            whitePlayer: "♔ White Player",
            blackPlayer: "♚ Black Player",
            humanPlayer: "Human Player",
            aggressive: "Aggressive",
            positional: "Positional",
            defensive: "Defensive",
            random: "Random (Baseline)",
            depth: "Depth",
            fast: "Fast",
            standard: "Standard",
            strong: "Strong",
            expert: "Expert",
            autoRematch: "Auto-Rematch",
            playContMatch: "Play continuous matches",
            loadPosition: "Load Position (FEN)",
            pasteFen: "Paste FEN...",
            load: "Load",
            selectEndgame: "Select Endgame Type...",
            selectPosition: "Select Position...",
            randomEndgame: "🎲 Random",
            startingPos: "Starting",
            liveEval: "Live Evaluation",
            white: "White",
            black: "Black",
            currentTurn: "Current turn",
            moveNum: "Move #",
            nodesLast: "Nodes (last)",
            timeLast: "Time (last)",
            bestScore: "Best score",
            moveHistory: "Move History",
            matchLog: "Match Log",
            waitingMatch: "Waiting for match to start...",
            noMatches: "No matches played yet.",
            startMatch: "Start Match",
            pause: "Pause",
            resume: "Resume",
            reset: "Reset",
            speed: "Speed",
            getHint: "💡 AI Hint",
            hintAnalyzing: "Analyzing...",
            hintTop2: "Top 2 moves:",
            showScores: "Show Scores",
            hideScores: "Hide Scores",
            thinking: "thinking...",
            yourTurn: "- Your turn",
            waiting: "Waiting...",
            paused: "Paused",
            whiteWins: "White wins by",
            blackWins: "Black wins by",
            draw: "Draw",
            checkmate: "checkmate",
            stalemate: "stalemate",
            insuffMat: "insufficient material",
            threefold: "threefold repetition",
            fiftyMove: "50-move rule",
            nextMatch: "Starting next match in 2s...",
            matchEnded: "Match ended.",
            agentConfig: "Agent Configuration",
            language: "Language"
        },
        zh: {
            title: "AI 国际象棋求解器",
            subtitle: "极小极大 · α-β剪枝 · 自主智能体",
            matches: "对局",
            moves: "走法",
            nodes: "节点",
            agentWhite: "白方智能体",
            agentBlack: "黑方智能体",
            vs: "对战",
            wins: "胜",
            gameMode: "游戏模式",
            aiVsAi: "AI 对战",
            humanVsAi: "人机对战",
            aiVsHuman: "机人对战",
            humanVsHuman: "双人对战",
            whitePlayer: "♔ 白方玩家",
            blackPlayer: "♚ 黑方玩家",
            humanPlayer: "人类玩家",
            aggressive: "进攻型",
            positional: "位置型",
            defensive: "防守型",
            random: "随机（基准）",
            depth: "深度",
            fast: "快速",
            standard: "标准",
            strong: "强力",
            expert: "专家",
            autoRematch: "自动重赛",
            playContMatch: "连续对局",
            loadPosition: "加载局面 (FEN)",
            pasteFen: "粘贴 FEN...",
            load: "加载",
            selectEndgame: "选择残局类型...",
            selectPosition: "选择具体局面...",
            randomEndgame: "🎲 随机",
            startingPos: "标准开局",
            liveEval: "实时评估",
            white: "白方",
            black: "黑方",
            currentTurn: "当前回合",
            moveNum: "第几步",
            nodesLast: "节点数（最近）",
            timeLast: "耗时（最近）",
            bestScore: "最佳评分",
            moveHistory: "走法历史",
            matchLog: "对局日志",
            waitingMatch: "等待对局开始...",
            noMatches: "尚未进行对局。",
            startMatch: "开始对局",
            pause: "暂停",
            resume: "继续",
            reset: "重置",
            speed: "速度",
            getHint: "💡 AI提示",
            hintAnalyzing: "分析中...",
            hintTop2: "最佳2步:",
            showScores: "显示分数",
            hideScores: "隐藏分数",
            thinking: "思考中...",
            yourTurn: "- 您的回合",
            waiting: "等待中...",
            paused: "已暂停",
            whiteWins: "白方获胜",
            blackWins: "黑方获胜",
            draw: "和棋",
            checkmate: "将死",
            stalemate: "逼和",
            insuffMat: "子力不足",
            threefold: "三次重复",
            fiftyMove: "50步规则",
            nextMatch: "2秒后开始下一局...",
            matchEnded: "对局结束。",
            agentConfig: "智能体配置",
            language: "语言"
        }
    };

    function t(key) {
        return i18n[currentLang][key] || key;
    }

    function updateLanguage() {
        // Update all text elements
        document.querySelector('.logo-text h1').textContent = t('title');
        document.querySelector('.logo-subtitle').textContent = t('subtitle');
        document.querySelectorAll('.stat-label')[0].textContent = t('matches');
        document.querySelectorAll('.stat-label')[1].textContent = t('moves');
        document.querySelectorAll('.stat-label')[2].textContent = t('nodes');

        // Agent cards
        document.querySelector('.white-agent-card .agent-title').textContent = t('agentWhite');
        document.querySelector('.black-agent-card .agent-title').textContent = t('agentBlack');
        document.querySelector('.vs-badge').textContent = t('vs');
        document.querySelectorAll('.agent-wins-label')[0].textContent = t('wins');
        document.querySelectorAll('.agent-wins-label')[1].textContent = t('wins');

        // Panel titles
        document.querySelectorAll('.panel-title')[0].textContent = t('agentConfig');
        document.querySelectorAll('.panel-title')[1].textContent = t('liveEval');
        document.querySelectorAll('.panel-title')[2].textContent = t('moveHistory');
        document.querySelectorAll('.panel-title')[3].textContent = t('matchLog');

        // Buttons
        document.getElementById('btn-start').innerHTML = '<span class="ctrl-icon">▶</span> ' + t('startMatch');
        document.getElementById('btn-reset').innerHTML = '<span class="ctrl-icon">↺</span> ' + t('reset');
        document.getElementById('btn-hint').innerHTML = '<span class="ctrl-icon">💡</span> ' + t('getHint');
        document.querySelector('.speed-label').textContent = t('speed');

        const scoresBtn = document.getElementById('toggle-scores');
        if (scoresBtn.classList.contains('active')) {
            scoresBtn.innerHTML = `<span class="ctrl-icon">📊</span> ${t('hideScores')}`;
        } else {
            scoresBtn.innerHTML = `<span class="ctrl-icon">📊</span> ${t('showScores')}`;
        }

        // Settings labels
        document.querySelectorAll('.setting-label')[0].textContent = t('gameMode');
        document.querySelectorAll('.setting-label')[1].textContent = t('whitePlayer');
        document.querySelectorAll('.setting-label')[2].textContent = t('blackPlayer');
        document.querySelectorAll('.setting-label')[3].textContent = t('autoRematch');
        document.querySelectorAll('.setting-label')[4].textContent = t('loadPosition');

        // Game mode buttons
        document.querySelectorAll('.mode-btn')[0].textContent = t('aiVsAi');
        document.querySelectorAll('.mode-btn')[1].textContent = t('humanVsAi');
        document.querySelectorAll('.mode-btn')[2].textContent = t('aiVsHuman');
        document.querySelectorAll('.mode-btn')[3].textContent = t('humanVsHuman');

        // Player type selects
        const whiteTypeOpts = document.querySelectorAll('#white-type option');
        whiteTypeOpts[0].textContent = t('humanPlayer');
        whiteTypeOpts[1].textContent = 'AI';

        const blackTypeOpts = document.querySelectorAll('#black-type option');
        blackTypeOpts[0].textContent = t('humanPlayer');
        blackTypeOpts[1].textContent = 'AI';

        // Strategy selects
        updateStrategyOptions('white-strategy');
        updateStrategyOptions('black-strategy');

        // Depth selects
        updateDepthOptions('white-depth');
        updateDepthOptions('black-depth');

        // Endgame category
        const catSelect = document.getElementById('endgame-category');
        catSelect.options[0].textContent = t('selectEndgame');
        catSelect.options[1].textContent = currentLang === 'zh' ? '基础残局 (8)' : 'Basic Endgames (8)';
        catSelect.options[2].textContent = currentLang === 'zh' ? '战术残局 (10)' : 'Tactical Endgames (10)';
        catSelect.options[3].textContent = currentLang === 'zh' ? '兵残局 (8)' : 'Pawn Endgames (8)';
        catSelect.options[4].textContent = currentLang === 'zh' ? '车残局 (8)' : 'Rook Endgames (8)';
        catSelect.options[5].textContent = currentLang === 'zh' ? '后残局 (6)' : 'Queen Endgames (6)';
        catSelect.options[6].textContent = currentLang === 'zh' ? '著名棋局 (6)' : 'Famous Games (6)';
        catSelect.options[7].textContent = currentLang === 'zh' ? '复杂中局 (7)' : 'Complex Middlegames (7)';
        catSelect.options[8].textContent = currentLang === 'zh' ? '战术谜题 (6)' : 'Tactical Puzzles (6)';

        // Endgame position
        const posSelect = document.getElementById('endgame-position');
        if (posSelect.options.length > 0) {
            posSelect.options[0].textContent = t('selectPosition');
        }

        // Preset buttons
        document.getElementById('btn-random-endgame').innerHTML = t('randomEndgame');
        const presetBtns = document.querySelectorAll('.puzzle-chip[data-fen]');
        if (presetBtns.length > 0) {
            presetBtns[0].textContent = t('startingPos');
        }

        // FEN input
        document.getElementById('fen-input').placeholder = t('pasteFen');
        document.getElementById('btn-load-fen').textContent = t('load');

        // Auto rematch label
        document.querySelector('.toggle-label').textContent = t('playContMatch');

        // Evaluation labels
        document.querySelector('.eval-label-left').textContent = t('white');
        document.querySelector('.eval-label-right').textContent = t('black');

        // Stats
        document.querySelectorAll('.stat-row span')[0].textContent = t('currentTurn');
        document.querySelectorAll('.stat-row span')[2].textContent = t('moveNum');
        document.querySelectorAll('.stat-row span')[4].textContent = t('nodesLast');
        document.querySelectorAll('.stat-row span')[6].textContent = t('timeLast');
        document.querySelectorAll('.stat-row span')[8].textContent = t('bestScore');

        updateAgentLabels();
        updateTurnIndicator();
        renderMoveList();
    }

    function updateStrategyOptions(selectId) {
        const select = document.getElementById(selectId);
        const opts = select.options;
        opts[0].textContent = t('aggressive');
        opts[1].textContent = t('positional');
        opts[2].textContent = t('defensive');
        opts[3].textContent = t('random');
    }

    function updateDepthOptions(selectId) {
        const select = document.getElementById(selectId);
        const opts = select.options;
        opts[0].textContent = `${t('depth')} 2 (${t('fast')})`;
        opts[1].textContent = `${t('depth')} 3`;
        opts[2].textContent = `${t('depth')} 4 (${t('standard')})`;
        opts[3].textContent = `${t('depth')} 5 (${t('strong')})`;
        opts[4].textContent = `${t('depth')} 6 (${t('expert')})`;
    }

    // ===== ENDGAME DATABASE =====
    const ENDGAME_LIBRARY = {
        basic: {
            name: "基础残局",
            positions: [
                { name: "王后杀王", fen: "4k3/8/8/8/8/8/8/4K2Q w - - 0 1" },
                { name: "王车杀王", fen: "4k3/8/8/8/8/8/8/R3K3 w - - 0 1" },
                { name: "双象杀王", fen: "4k3/8/8/8/8/8/3B4/2B1K3 w - - 0 1" },
                { name: "象马杀王", fen: "4k3/8/8/8/8/8/2N5/2B1K3 w - - 0 1" },
                { name: "双车杀王", fen: "4k3/8/8/8/8/8/R7/R3K3 w - - 0 1" },
                { name: "后对车", fen: "4k3/8/8/8/8/8/4Q3/r3K3 w - - 0 1" },
                { name: "车对象", fen: "4k3/8/8/8/8/8/3R4/b3K3 w - - 0 1" },
                { name: "后对双象", fen: "3bk3/8/8/8/8/8/4Q3/4K3 w - - 0 1" }
            ]
        },
        tactics: {
            name: "战术残局",
            positions: [
                { name: "底线将杀", fen: "6k1/5ppp/8/8/8/8/r4PPP/1R4K1 w - - 0 1" },
                { name: "闷杀 (Smothered Mate)", fen: "6rk/6pp/8/8/8/8/8/5N1K w - - 0 1" },
                { name: "阿拉伯将杀", fen: "7k/8/5K2/8/8/8/8/R6N w - - 0 1" },
                { name: "学者将杀", fen: "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4" },
                { name: "法国炸肝", fen: "r3k2r/ppp2ppp/2n5/3Np1q1/2B5/1P6/P1P2PPP/R2QK2R w KQkq - 0 1" },
                { name: "后翼弃兵", fen: "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq d6 0 4" },
                { name: "双车入侵", fen: "6k1/5ppp/8/8/8/8/R6R/6K1 w - - 0 1" },
                { name: "后车配合", fen: "6k1/5ppp/8/8/8/8/Q7/R5K1 w - - 0 1" },
                { name: "草地伴侣杀", fen: "6k1/5ppp/8/8/8/8/5PPP/R4QK1 w - - 0 1" },
                { name: "双象攻击", fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 1" }
            ]
        },
        pawn: {
            name: "兵残局",
            positions: [
                { name: "王对兵 (远)", fen: "4k3/8/8/8/8/8/4P3/4K3 w - - 0 1" },
                { name: "王对兵 (近)", fen: "4k3/8/8/8/8/3P4/8/4K3 w - - 0 1" },
                { name: "通路兵", fen: "4k3/8/8/8/3P4/8/8/4K3 w - - 0 1" },
                { name: "连兵", fen: "4k3/8/8/8/8/3PP3/8/4K3 w - - 0 1" },
                { name: "双兵对王", fen: "4k3/8/8/8/8/2PP4/8/4K3 w - - 0 1" },
                { name: "兵链", fen: "4k3/8/8/3P4/2P5/8/8/4K3 w - - 0 1" },
                { name: "孤兵", fen: "4k3/8/3p4/8/3P4/8/8/4K3 w - - 0 1" },
                { name: "叠兵", fen: "4k3/3p4/3p4/8/8/8/8/4K3 w - - 0 1" }
            ]
        },
        rook: {
            name: "车残局",
            positions: [
                { name: "车兵对王", fen: "4k3/8/8/8/8/8/3P4/3RK3 w - - 0 1" },
                { name: "卢塞纳定理", fen: "1K6/P7/8/8/8/8/5k2/1r6 w - - 0 1" },
                { name: "菲利多守和", fen: "4k3/R7/8/8/8/8/r4KP1/8 w - - 0 1" },
                { name: "车对车兵", fen: "8/8/8/8/8/8/rp5R/k6K w - - 0 1" },
                { name: "车对双兵", fen: "8/8/8/8/8/2pp4/8/R3K2k w - - 0 1" },
                { name: "双车对车", fen: "4k3/8/8/8/8/8/R7/R3K2r w - - 0 1" },
                { name: "车兵对车", fen: "4k3/8/8/8/8/8/r3P3/4K2R w - - 0 1" },
                { name: "活跃车对被动车", fen: "R5k1/6p1/8/8/8/8/5P1r/6K1 w - - 0 1" }
            ]
        },
        queen: {
            name: "后残局",
            positions: [
                { name: "后兵对王", fen: "4k3/8/8/8/8/8/4P3/4KQ2 w - - 0 1" },
                { name: "后对兵 (7路)", fen: "4k3/p7/8/8/8/8/8/4KQ2 w - - 0 1" },
                { name: "后对车兵", fen: "8/8/8/8/8/8/rp5Q/k6K w - - 0 1" },
                { name: "后对双车", fen: "4k3/8/8/8/8/8/r7/r3KQ2 w - - 0 1" },
                { name: "后对车马", fen: "4k3/8/8/8/8/5n2/r7/4KQ2 w - - 0 1" },
                { name: "后对车象", fen: "3bk3/8/8/8/8/8/r7/4KQ2 w - - 0 1" }
            ]
        },
        famous: {
            name: "著名棋局",
            positions: [
                { name: "不朽之局", fen: "r1bk3r/p2pBpNp/n4n2/1p1NP2P/6P1/3P4/P1P1K3/q5b1 b - - 0 1" },
                { name: "常青之局", fen: "r2qk1nr/ppp2ppp/2n5/3N4/2BPp1b1/2P5/P4PPP/R1BQ1K1R w kq - 0 1" },
                { name: "歌剧院之局", fen: "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1" },
                { name: "卡帕布兰卡经典", fen: "r4rk1/1b3ppp/pqn1p3/1p6/4PP2/1BP3P1/PP1Q3P/R4RK1 w - - 0 1" },
                { name: "塔尔攻击", fen: "r1b2rk1/ppq2ppp/2p5/4N3/2BP4/6Q1/PP3PPP/R4RK1 w - - 0 1" },
                { name: "费舍尔牺牲", fen: "1rb2rk1/p4ppp/1p1qp1n1/3n2N1/2pP4/2P3P1/PPQ2PBP/R1B2RK1 w - - 0 1" }
            ]
        },
        complex: {
            name: "复杂中局",
            positions: [
                { name: "意大利开局", fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 1" },
                { name: "西班牙开局", fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 1" },
                { name: "西西里防御", fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 1" },
                { name: "法国防御", fen: "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1" },
                { name: "斯拉夫防御", fen: "rnbqkbnr/pp1ppppp/2p5/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 1" },
                { name: "王翼进攻", fen: "rnbqkb1r/ppp2ppp/3p1n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 1" },
                { name: "龙变体", fen: "rnbqkb1r/pp2pppp/3p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 1" }
            ]
        },
        puzzle: {
            name: "战术谜题",
            positions: [
                { name: "双重攻击", fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 w kq - 0 1" },
                { name: "牵制战术", fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/1PB1P3/5N2/P1PP1PPP/RNBQ1RK1 b kq - 0 1" },
                { name: "串打战术", fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1" },
                { name: "消除防御", fen: "r2qkb1r/ppp2ppp/2np1n2/4p1B1/2B1P3/2NP4/PPP2PPP/R2QK2R w KQkq - 0 1" },
                { name: "引离战术", fen: "r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 1" },
                { name: "困子战术", fen: "r1bqk2r/ppp2ppp/2n2n2/3pp3/1bB1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1" }
            ]
        }
    };

    // Random endgame generator
    function generateRandomEndgame() {
        const pieces = ['q', 'r', 'b', 'n', 'p'];
        const board = Array(64).fill(null);

        // Place white king
        const wkPos = Math.floor(Math.random() * 64);
        board[wkPos] = 'K';

        // Place black king (not adjacent)
        let bkPos;
        do {
            bkPos = Math.floor(Math.random() * 64);
        } while (Math.abs(wkPos % 8 - bkPos % 8) <= 1 && Math.abs(Math.floor(wkPos / 8) - Math.floor(bkPos / 8)) <= 1);
        board[bkPos] = 'k';

        // Add random pieces (1-4 pieces)
        const numPieces = Math.floor(Math.random() * 4) + 1;
        for (let i = 0; i < numPieces; i++) {
            let pos;
            do {
                pos = Math.floor(Math.random() * 64);
            } while (board[pos] !== null);

            const piece = pieces[Math.floor(Math.random() * pieces.length)];
            const color = Math.random() > 0.5 ? piece.toUpperCase() : piece;

            // No pawns on first or last rank
            if (piece === 'p' && (Math.floor(pos / 8) === 0 || Math.floor(pos / 8) === 7)) continue;

            board[pos] = color;
        }

        // Convert to FEN
        let fen = '';
        for (let r = 0; r < 8; r++) {
            let empty = 0;
            for (let c = 0; c < 8; c++) {
                const p = board[r * 8 + c];
                if (!p) {
                    empty++;
                } else {
                    if (empty > 0) {
                        fen += empty;
                        empty = 0;
                    }
                    fen += p;
                }
            }
            if (empty > 0) fen += empty;
            if (r < 7) fen += '/';
        }

        return fen + ' w - - 0 1';
    }

    // ===== PARTICLES =====
    function initParticles() {
        const c = document.getElementById('particles-canvas');
        const ctx = c.getContext('2d');
        const ps = [];
        function resize() { c.width = innerWidth; c.height = innerHeight; }
        resize(); addEventListener('resize', resize);
        for (let i = 0; i < 40; i++) ps.push({ x: Math.random() * c.width, y: Math.random() * c.height, r: Math.random() * 1.5 + 0.5, dx: (Math.random() - 0.5) * 0.25, dy: (Math.random() - 0.5) * 0.25, a: Math.random() * 0.3 + 0.1 });
        (function draw() {
            ctx.clearRect(0, 0, c.width, c.height);
            for (const p of ps) { p.x += p.dx; p.y += p.dy; if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0; if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(99,102,241,${p.a})`; ctx.fill(); }
            requestAnimationFrame(draw);
        })();
    }

    // ===== RENDER BOARD =====
    function renderBoard(animateMove) {
        const boardEl = document.getElementById('chess-board');

        // Capture old piece positions for animation
        let oldPositions = {};
        if (animateMove && lastMove) {
            const oldSquares = boardEl.querySelectorAll('.square');
            oldSquares.forEach(sq => {
                const piece = sq.querySelector('.piece');
                if (piece) {
                    const rect = sq.getBoundingClientRect();
                    oldPositions[sq.dataset.index] = { x: rect.left, y: rect.top };
                }
            });
        }

        boardEl.innerHTML = '';
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const idx = r * 8 + c;
                const sq = document.createElement('div');
                sq.className = 'square ' + ((r + c) % 2 === 0 ? 'light' : 'dark');
                sq.dataset.index = idx;
                if (lastMove && (idx === lastMove.from || idx === lastMove.to)) sq.classList.add('last-move');
                if (game.isInCheck(game.turn) && idx === game.findKing(game.turn)) sq.classList.add('check');

                // Highlight selected square
                if (selectedSquare !== null && idx === selectedSquare) sq.classList.add('selected');

                // Highlight legal moves
                if (legalMovesFromSelected.some(m => m.to === idx)) sq.classList.add('legal-move');

                // Highlight hint moves
                if (showHints && hintMoves.some(h => h.move.to === idx)) {
                    sq.classList.add('hint-move');
                    const hintIdx = hintMoves.findIndex(h => h.move.to === idx);
                    if (hintIdx !== -1) {
                        const hintLabel = document.createElement('div');
                        hintLabel.className = 'hint-label';
                        hintLabel.textContent = hintIdx + 1;
                        sq.appendChild(hintLabel);
                    }
                }

                const p = game.board[idx];
                if (p) {
                    const span = document.createElement('span');
                    span.className = 'piece ' + (p.color === COLOR.WHITE ? 'white-piece' : 'black-piece');
                    span.textContent = PIECE_UNICODE[p.color + p.piece];
                    span.dataset.index = idx;
                    sq.appendChild(span);
                }

                // Add click handler for human players
                if (isCurrentPlayerHuman()) {
                    sq.addEventListener('click', () => handleSquareClick(idx));
                }

                boardEl.appendChild(sq);
            }
        }

        // Animate the moved piece sliding from old square to new square
        if (animateMove && lastMove) {
            const toIdx = lastMove.to;
            const fromIdx = lastMove.from;
            const toSq = boardEl.querySelector(`.square[data-index="${toIdx}"]`);
            const piece = toSq ? toSq.querySelector('.piece') : null;
            if (piece && oldPositions[fromIdx]) {
                const newRect = toSq.getBoundingClientRect();
                const dx = oldPositions[fromIdx].x - newRect.left;
                const dy = oldPositions[fromIdx].y - newRect.top;
                // Start at old position, animate to new
                piece.style.transform = `translate(${dx}px, ${dy}px)`;
                piece.style.transition = 'none';
                // Force reflow then animate
                piece.offsetHeight;
                piece.style.transition = 'transform 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                piece.style.transform = 'translate(0, 0)';
                // Clean up after animation
                piece.addEventListener('transitionend', () => {
                    piece.style.transform = '';
                    piece.style.transition = '';
                }, { once: true });
            }
        }

        // Coordinates
        const ranks = document.getElementById('rank-labels');
        const files = document.getElementById('file-labels');
        ranks.innerHTML = ''; files.innerHTML = '';
        for (let i = 0; i < 8; i++) { const s = document.createElement('span'); s.textContent = 8 - i; ranks.appendChild(s); }
        for (const f of 'abcdefgh') { const s = document.createElement('span'); s.textContent = f; files.appendChild(s); }
    }

    // ===== UPDATE UI =====
    function updateEval() {
        const quickAI = new ChessAI(1, 'positional');
        const raw = quickAI.evaluate(game);
        const whiteEval = game.turn === COLOR.WHITE ? raw : -raw;
        const cp = whiteEval / 100;
        const pct = Math.max(5, Math.min(95, 50 + cp * 4));
        document.getElementById('eval-bar-white').style.width = pct + '%';
        document.getElementById('eval-bar-black').style.width = (100 - pct) + '%';
        document.getElementById('eval-center').textContent = (cp >= 0 ? '+' : '') + cp.toFixed(1);
    }

    function updateTurnIndicator() {
        const dot = document.querySelector('.turn-dot');
        const text = document.getElementById('turn-text');
        if (!running || paused) {
            dot.className = 'turn-dot ' + (paused ? 'paused' : 'ended');
            text.textContent = paused ? t('paused') : t('waiting');
        } else {
            dot.className = 'turn-dot';
            const side = game.turn === COLOR.WHITE ? t('white') : t('black');
            const isHuman = isCurrentPlayerHuman();
            if (isHuman) {
                text.textContent = `${side} (${t('humanPlayer')}) ${t('yourTurn')}`;
            } else {
                const strat = game.turn === COLOR.WHITE ? whiteAI.strategy : blackAI.strategy;
                const stratName = t(strat);
                text.textContent = `${side} (${stratName}) ${t('thinking')}`;
            }
        }
    }

    function updateStats(result) {
        document.getElementById('stat-turn').textContent = game.turn === COLOR.WHITE ? 'White' : 'Black';
        document.getElementById('stat-move-num').textContent = moveList.length;
        if (result) {
            document.getElementById('stat-nodes').textContent = result.nodes.toLocaleString();
            document.getElementById('stat-time').textContent = result.time + 'ms';
            document.getElementById('stat-score').textContent = (result.score / 100).toFixed(2);
        }
    }

    function updateHeaderStats() {
        document.getElementById('total-matches').textContent = matchCount;
        document.getElementById('total-moves-stat').textContent = totalMovesPlayed.toLocaleString();
        document.getElementById('total-nodes-stat').textContent = totalNodesSearched > 1e6 ? (totalNodesSearched / 1e6).toFixed(1) + 'M' : totalNodesSearched.toLocaleString();
        document.getElementById('white-wins').textContent = whiteWins;
        document.getElementById('black-wins').textContent = blackWins;
    }

    function updateAgentLabels() {
        const wt = document.getElementById('white-type').value;
        const ws = document.getElementById('white-strategy').value;
        const wd = document.getElementById('white-depth').value;
        const bt = document.getElementById('black-type').value;
        const bs = document.getElementById('black-strategy').value;
        const bd = document.getElementById('black-depth').value;

        if (wt === 'human') {
            document.getElementById('white-agent-type').textContent = t('humanPlayer');
        } else {
            const stratName = t(ws);
            document.getElementById('white-agent-type').textContent = `${stratName} · ${t('depth')} ${wd}`;
        }

        if (bt === 'human') {
            document.getElementById('black-agent-type').textContent = t('humanPlayer');
        } else {
            const stratName = t(bs);
            document.getElementById('black-agent-type').textContent = `${stratName} · ${t('depth')} ${bd}`;
        }
    }

    // ===== MOVE LIST =====
    function renderMoveList() {
        const el = document.getElementById('move-list');
        if (moveList.length === 0) {
            el.innerHTML = `<div class="move-list-empty">${t('waitingMatch')}</div>`;
            return;
        }

        const showScoresBtn = document.getElementById('toggle-scores');
        const scoresVisible = showScoresBtn && showScoresBtn.classList.contains('active');

        let html = '';
        for (let i = 0; i < moveList.length; i += 2) {
            const n = Math.floor(i / 2) + 1;
            const wCls = i === moveList.length - 1 ? ' move-latest' : '';
            const bCls = i + 1 === moveList.length - 1 ? ' move-latest' : '';

            const wScore = moveScores[i] !== undefined ? moveScores[i] : null;
            const bScore = moveScores[i + 1] !== undefined ? moveScores[i + 1] : null;

            let wMove = moveList[i];
            let bMove = moveList[i + 1] || '';

            if (scoresVisible) {
                if (wScore !== null) wMove += ` <span class="move-score">${(wScore / 100).toFixed(1)}</span>`;
                if (bMove && bScore !== null) bMove += ` <span class="move-score">${(bScore / 100).toFixed(1)}</span>`;
            }

            html += `<div class="move-row">
                <span class="move-num">${n}.</span>
                <span class="move-w${wCls}">${wMove}</span>
                <span class="move-b${bCls}">${bMove}</span>
            </div>`;
        }
        el.innerHTML = html;
        el.scrollTop = el.scrollHeight;
    }

    // ===== MATCH LOG =====
    function addMatchLog(result, reason, numMoves) {
        matchLog.push({ result, reason, numMoves, match: matchCount });
        const el = document.getElementById('match-log');
        let cls = 'match-entry';
        let icon = '', text = '';
        if (result === 'white') { cls += ' white-win'; icon = '♔'; text = 'White wins'; }
        else if (result === 'black') { cls += ' black-win'; icon = '♚'; text = 'Black wins'; }
        else { cls += ' draw-result'; icon = '½'; text = 'Draw'; }
        const entry = document.createElement('div');
        entry.className = cls;
        entry.innerHTML = `<span class="match-num">#${matchCount}</span><span class="match-result">${icon} ${text}</span><span class="match-detail">${reason} · ${numMoves} moves</span>`;
        // Remove empty placeholder
        const empty = el.querySelector('.move-list-empty');
        if (empty) empty.remove();
        el.prepend(entry);
    }

    // ===== GAME OVER =====
    function showGameOver(status) {
        const overlay = document.getElementById('gameover-overlay');
        const icon = document.getElementById('go-icon');
        const text = document.getElementById('go-text');
        const sub = document.getElementById('go-sub');
        const numMoves = moveList.length;

        matchCount++;
        if (status.result === 'white') { whiteWins++; icon.textContent = '♔'; text.textContent = `White wins by ${status.reason}!`; }
        else if (status.result === 'black') { blackWins++; icon.textContent = '♚'; text.textContent = `Black wins by ${status.reason}!`; }
        else { draws++; icon.textContent = '½'; text.textContent = `Draw — ${status.reason}`; }

        addMatchLog(status.result === 'draw' ? 'draw' : status.result, status.reason, numMoves);
        updateHeaderStats();

        const autoRematch = document.getElementById('auto-rematch').checked;
        sub.textContent = autoRematch ? 'Starting next match in 2s...' : 'Match ended.';

        overlay.style.display = 'flex';
        setTimeout(() => { overlay.style.display = 'none'; }, 2500);

        if (autoRematch) {
            setTimeout(() => { resetGame(); startMatch(); }, 2800);
        } else {
            running = false;
            updateTurnIndicator();
            document.getElementById('btn-start').disabled = false;
            document.getElementById('btn-pause').disabled = true;
        }
    }

    // ===== HUMAN PLAYER INTERACTION =====
    function isCurrentPlayerHuman() {
        return (game.turn === COLOR.WHITE && whiteIsHuman) || (game.turn === COLOR.BLACK && blackIsHuman);
    }

    function handleSquareClick(idx) {
        if (!running || paused) return;
        if (!isCurrentPlayerHuman()) return;

        const piece = game.board[idx];

        // If no square selected, try to select this square
        if (selectedSquare === null) {
            if (piece && piece.color === game.turn) {
                selectedSquare = idx;
                legalMovesFromSelected = game.generateLegalMoves().filter(m => m.from === idx);
                renderBoard(false);
            }
        } else {
            // Check if clicked on a legal move destination
            const move = legalMovesFromSelected.find(m => m.to === idx);
            if (move) {
                // Handle pawn promotion
                if (move.promotion) {
                    // For simplicity, always promote to queen
                    move.promotion = PIECE.QUEEN;
                }
                makeHumanMove(move);
            } else if (piece && piece.color === game.turn) {
                // Clicked on another own piece, switch selection
                selectedSquare = idx;
                legalMovesFromSelected = game.generateLegalMoves().filter(m => m.from === idx);
                renderBoard(false);
            } else {
                // Clicked on empty square or opponent piece (but not legal move), deselect
                selectedSquare = null;
                legalMovesFromSelected = [];
                renderBoard(false);
            }
        }
    }

    function makeHumanMove(move) {
        const san = game.moveToSAN(move);
        game.makeMove(move);
        lastMove = move;
        moveList.push(san);

        // Evaluate and store score after move
        const evalAI = new ChessAI(1, 'positional');
        const evalScore = evalAI.evaluate(game);
        moveScores.push(evalScore);

        totalMovesPlayed++;
        selectedSquare = null;
        legalMovesFromSelected = [];
        showHints = false;
        hintMoves = [];

        renderBoard(true);
        renderMoveList();
        updateEval();
        updateStats(null);
        updateHeaderStats();

        // Check game over after move
        const status = game.getGameStatus();
        if (status.over) { showGameOver(status); return; }

        // Continue to next move
        playNextMove();
    }

    // ===== GAME LOOP =====
    function playNextMove() {
        if (!running || paused) return;

        const status = game.getGameStatus();
        if (status.over) { showGameOver(status); return; }

        updateTurnIndicator();

        // Enable/disable hint button based on player type
        const hintBtn = document.getElementById('btn-hint');
        if (isCurrentPlayerHuman()) {
            hintBtn.disabled = false;
        } else {
            hintBtn.disabled = true;
        }

        // If current player is human, wait for click
        if (isCurrentPlayerHuman()) {
            renderBoard(false);
            return;
        }

        // AI move
        const currentAI = game.turn === COLOR.WHITE ? whiteAI : blackAI;

        // Use setTimeout so UI updates between moves
        timeoutId = setTimeout(() => {
            if (!running || paused) return;

            const result = currentAI.findBestMove(game);
            if (!result || !result.move) { running = false; return; }

            const san = game.moveToSAN(result.move);
            game.makeMove(result.move);
            lastMove = result.move;
            moveList.push(san);
            moveScores.push(result.score); // Store AI move score
            totalMovesPlayed++;
            totalNodesSearched += result.nodes;

            renderBoard(true);
            renderMoveList();
            updateEval();
            updateStats(result);
            updateHeaderStats();

            // Check game over after move
            const newStatus = game.getGameStatus();
            if (newStatus.over) { showGameOver(newStatus); return; }

            // Schedule next move
            playNextMove();
        }, moveDelay);
    }

    function startMatch() {
        if (running) return;
        running = true;
        paused = false;

        // Check if players are human or AI
        whiteIsHuman = document.getElementById('white-type').value === 'human';
        blackIsHuman = document.getElementById('black-type').value === 'human';

        // Build AIs from settings
        const ws = document.getElementById('white-strategy').value;
        const wd = parseInt(document.getElementById('white-depth').value);
        const bs = document.getElementById('black-strategy').value;
        const bd = parseInt(document.getElementById('black-depth').value);
        whiteAI = new ChessAI(wd, ws);
        blackAI = new ChessAI(bd, bs);
        updateAgentLabels();

        document.getElementById('btn-start').disabled = true;
        document.getElementById('btn-pause').disabled = false;

        playNextMove();
    }

    function pauseMatch() {
        if (!running) return;
        paused = !paused;
        const btn = document.getElementById('btn-pause');
        btn.innerHTML = paused ? '<span class="ctrl-icon">▶</span> Resume' : '<span class="ctrl-icon">⏸</span> Pause';
        updateTurnIndicator();
        if (!paused) playNextMove();
    }

    function resetGame() {
        running = false;
        paused = false;
        if (timeoutId) clearTimeout(timeoutId);

        const fen = document.getElementById('fen-input').value.trim();
        game = fen ? new ChessEngine(fen) : new ChessEngine();
        lastMove = null;
        moveList = [];
        moveScores = [];
        selectedSquare = null;
        legalMovesFromSelected = [];
        showHints = false;
        hintMoves = [];

        renderBoard();
        renderMoveList();
        updateEval();
        updateTurnIndicator();
        updateStats(null);

        document.getElementById('btn-start').disabled = false;
        document.getElementById('btn-pause').disabled = true;
        document.getElementById('btn-pause').innerHTML = `<span class="ctrl-icon">⏸</span> ${t('pause')}`;
    }

    // ===== AI HINT SYSTEM =====
    function getAIHint() {
        if (!running || !isCurrentPlayerHuman()) return;

        const btn = document.getElementById('btn-hint');
        btn.disabled = true;
        btn.innerHTML = `<span class="ctrl-icon">⏳</span> ${t('hintAnalyzing')}`;

        setTimeout(() => {
            const allMoves = game.generateLegalMoves();

            // 🚀 Phase 1: Quick static evaluation (fast screening)
            const quickEval = [];
            for (const move of allMoves) {
                game.makeMove(move);
                const quickScore = -evaluateQuick(game); // Simple eval
                game.unmakeMove();
                quickEval.push({ move, quickScore, san: game.moveToSAN(move) });
            }

            // Sort and take top 5 candidates
            quickEval.sort((a, b) => b.quickScore - a.quickScore);
            const topCandidates = quickEval.slice(0, Math.min(5, quickEval.length));

            // 🔍 Phase 2: Deep search on top candidates (accurate but slower)
            const depth = Math.max(2, Math.min(3, (game.turn === COLOR.WHITE ? whiteAI.maxDepth : blackAI.maxDepth) - 1));
            const hintAI = new ChessAI(depth, game.turn === COLOR.WHITE ? whiteAI.strategy : blackAI.strategy);

            const scoredMoves = [];
            for (const candidate of topCandidates) {
                game.makeMove(candidate.move);
                hintAI.nodesSearched = 0;
                const deepScore = -hintAI.minimax(game, depth - 1, -Infinity, Infinity, false);
                game.unmakeMove();
                scoredMoves.push({
                    move: candidate.move,
                    score: deepScore,
                    san: candidate.san,
                    nodes: hintAI.nodesSearched
                });
            }

            // Sort and get top 2
            scoredMoves.sort((a, b) => b.score - a.score);
            hintMoves = scoredMoves.slice(0, 2);
            showHints = true;

            renderBoard(false);

            btn.disabled = false;
            btn.innerHTML = `<span class="ctrl-icon">💡</span> ${t('getHint')}`;

            // Show hint tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'hint-tooltip';
            tooltip.innerHTML = `<div class="hint-title">${t('hintTop2')}</div>` +
                `<div class="hint-move">1️⃣ ${hintMoves[0].san} <span class="hint-score">${(hintMoves[0].score / 100).toFixed(1)}</span></div>` +
                `<div class="hint-move">2️⃣ ${hintMoves[1].san} <span class="hint-score">${(hintMoves[1].score / 100).toFixed(1)}</span></div>` +
                `<div class="hint-info">${currentLang === 'zh' ? '搜索' : 'Searched'} ${scoredMoves[0].nodes.toLocaleString()} ${currentLang === 'zh' ? '节点' : 'nodes'}</div>`;

            document.body.appendChild(tooltip);
            setTimeout(() => tooltip.remove(), 5000);
        }, 100);
    }

    // Quick evaluation without deep search
    function evaluateQuick(engine) {
        const quickAI = new ChessAI(1, 'positional');
        return quickAI.evaluate(engine);
    }

    // ===== GAME MODE SWITCHER =====
    function setGameMode(mode) {
        const modes = {
            'ai-vs-ai': { white: 'ai', black: 'ai' },
            'human-vs-ai': { white: 'human', black: 'ai' },
            'ai-vs-human': { white: 'ai', black: 'human' },
            'human-vs-human': { white: 'human', black: 'human' }
        };

        const config = modes[mode];
        document.getElementById('white-type').value = config.white;
        document.getElementById('black-type').value = config.black;

        // Update active button
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        updateAgentLabels();
    }

    // ===== INIT =====
    function init() {
        initParticles();
        renderBoard();
        updateEval();
        updateTurnIndicator();
        updateAgentLabels();

        // Set initial language
        const savedLang = localStorage.getItem('chess-lang') || 'zh';
        currentLang = savedLang;
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === savedLang);
        });
        updateLanguage();

        // Language switcher
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentLang = btn.dataset.lang;
                localStorage.setItem('chess-lang', currentLang);
                document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                updateLanguage();
            });
        });

        // Game mode switcher
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                setGameMode(btn.dataset.mode);
            });
        });

        // Set initial mode
        setGameMode('human-vs-ai');

        // Controls
        document.getElementById('btn-start').addEventListener('click', startMatch);
        document.getElementById('btn-pause').addEventListener('click', pauseMatch);
        document.getElementById('btn-reset').addEventListener('click', resetGame);
        document.getElementById('btn-hint').addEventListener('click', getAIHint);

        // Toggle scores button
        document.getElementById('toggle-scores').addEventListener('click', (e) => {
            const btn = e.target.closest('.toggle-scores-btn');
            btn.classList.toggle('active');
            if (btn.classList.contains('active')) {
                btn.innerHTML = `<span class="ctrl-icon">📊</span> ${t('hideScores')}`;
            } else {
                btn.innerHTML = `<span class="ctrl-icon">📊</span> ${t('showScores')}`;
            }
            renderMoveList();
        });

        // Speed
        document.getElementById('speed-slider').addEventListener('input', (e) => {
            const v = parseInt(e.target.value);
            moveDelay = SPEED_MAP[v];
            document.getElementById('speed-value').textContent = SPEED_LABELS[v];
        });

        // Strategy selectors
        ['white-type', 'white-strategy', 'white-depth', 'black-type', 'black-strategy', 'black-depth'].forEach(id => {
            document.getElementById(id).addEventListener('change', updateAgentLabels);
        });

        // FEN
        document.getElementById('btn-load-fen').addEventListener('click', () => {
            resetGame();
        });

        // Endgame category selector
        document.getElementById('endgame-category').addEventListener('change', (e) => {
            const category = e.target.value;
            const posSelect = document.getElementById('endgame-position');

            if (!category) {
                posSelect.disabled = true;
                posSelect.innerHTML = `<option value="">${t('selectPosition')}</option>`;
                return;
            }

            posSelect.disabled = false;
            posSelect.innerHTML = `<option value="">${t('selectPosition')}</option>`;

            const positions = ENDGAME_LIBRARY[category].positions;
            positions.forEach((pos, idx) => {
                const opt = document.createElement('option');
                opt.value = idx;
                opt.textContent = pos.name;
                posSelect.appendChild(opt);
            });
        });

        // Endgame position selector
        document.getElementById('endgame-position').addEventListener('change', (e) => {
            const category = document.getElementById('endgame-category').value;
            const posIdx = e.target.value;

            if (category && posIdx !== '') {
                const fen = ENDGAME_LIBRARY[category].positions[posIdx].fen;
                document.getElementById('fen-input').value = fen;
                resetGame();
            }
        });

        // Random endgame
        document.getElementById('btn-random-endgame').addEventListener('click', () => {
            const fen = generateRandomEndgame();
            document.getElementById('fen-input').value = fen;
            resetGame();
        });

        // Puzzle presets
        document.querySelectorAll('.puzzle-chip[data-fen]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('fen-input').value = btn.dataset.fen;
                resetGame();
            });
        });
    }

    document.addEventListener('DOMContentLoaded', init);
})();
