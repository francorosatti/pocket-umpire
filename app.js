// Tennis Score Tracker with Voice Commands
// Pocket Umpire - Mobile-First with ESPN-Style Display

class TennisMatch {
    constructor() {
        // Load saved player names from localStorage
        const savedNames = this.loadPlayerNames();

        // Player names
        this.playerNames = {
            player1: savedNames.player1 || 'Jugador 1',
            player2: savedNames.player2 || 'Jugador 2'
        };

        // Match configuration
        this.totalSets = 3; // Default to best of 3

        // Match state
        this.score = {
            player1: { points: 0, games: 0, sets: 0 },
            player2: { points: 0, games: 0, sets: 0 }
        };
        this.setHistory = this.createSetHistory(3);
        this.currentSet = 0; // 0-indexed
        this.server = 'player1'; // Track who is serving
        this.history = [];
        this.matchWinner = null;
        this.tiebreak = false;
        this.tiebreakPoints = { player1: 0, player2: 0 };
        this.tiebreakStartServer = null;

        // Tennis scoring points map
        this.pointsDisplay = {
            0: '0',
            1: '15',
            2: '30',
            3: '40',
            4: 'AD',
            5: 'GAME'
        };

        // Score name to value mapping for exact score commands
        this.scoreNameMap = {
            'cero': 0, 'zero': 0, '0': 0,
            'quince': 1, 'fifteen': 1, '15': 1,
            'treinta': 2, 'thirty': 2, '30': 2,
            'cuarenta': 3, 'forty': 3, '40': 3,
            'ventaja': 4, 'advantage': 4, 'ad': 4
        };

        // Voice recognition
        this.recognition = null;
        this.isListening = false;
        this.initVoiceRecognition();

        // Selected server for new match
        this.selectedServer = 'player1';

        // Current theme
        this.currentTheme = this.loadTheme();

        // DOM elements
        this.elements = {
            // Modals
            namesModal: document.getElementById('names-modal'),
            matchOverModal: document.getElementById('match-over-modal'),
            matchResultDisplay: document.getElementById('match-result-display'),
            shareResultBtn: document.getElementById('share-result-btn'),
            newMatchBtn: document.getElementById('new-match-btn'),
            // Names modal
            player1NameInput: document.getElementById('player1-name-input'),
            player2NameInput: document.getElementById('player2-name-input'),
            startMatchBtn: document.getElementById('start-match-btn'),
            skipNamesBtn: document.getElementById('skip-names-btn'),
            player1ServesBtn: document.getElementById('player1-serves'),
            player2ServesBtn: document.getElementById('player2-serves'),
            player1ServeLabel: document.getElementById('player1-serve-label'),
            player2ServeLabel: document.getElementById('player2-serve-label'),
            // Player name displays
            player1NameDisplay: document.getElementById('player1-name-display'),
            player2NameDisplay: document.getElementById('player2-name-display'),
            // Edit names (menu)
            editPlayer1Name: document.getElementById('edit-player1-name'),
            editPlayer2Name: document.getElementById('edit-player2-name'),
            saveNamesBtn: document.getElementById('save-names-btn'),
            // Set history
            player1Serve: document.getElementById('player1-serve'),
            player2Serve: document.getElementById('player2-serve'),
            p1Set1: document.getElementById('p1-set1'),
            p1Set2: document.getElementById('p1-set2'),
            p1Set3: document.getElementById('p1-set3'),
            p2Set1: document.getElementById('p2-set1'),
            p2Set2: document.getElementById('p2-set2'),
            p2Set3: document.getElementById('p2-set3'),
            // Current points
            player1Points: document.getElementById('player1-points'),
            player2Points: document.getElementById('player2-points'),
            // Status and feedback
            matchStatus: document.getElementById('match-status'),
            voiceFeedback: document.getElementById('voice-feedback'),
            // Menu
            menuBtn: document.getElementById('menu-btn'),
            menuPanel: document.getElementById('menu-panel'),
            menuOverlay: document.getElementById('menu-overlay'),
            closeMenu: document.getElementById('close-menu'),
            // Controls
            voiceBtn: document.getElementById('voice-btn'),
            player1PointBtn: document.getElementById('player1-point'),
            player2PointBtn: document.getElementById('player2-point'),
            undoBtn: document.getElementById('undo-btn'),
            resetBtn: document.getElementById('reset-btn')
        };

        this.initEventListeners();
        this.applyTheme(this.currentTheme);
        this.showNamesModal();
    }

    createSetHistory(numSets) {
        const history = [];
        for (let i = 0; i < numSets; i++) {
            history.push({ player1: 0, player2: 0 });
        }
        return history;
    }

    loadTheme() {
        try {
            const saved = localStorage.getItem('pocketUmpireTheme');
            return saved || 'default';
        } catch (e) {
            console.warn('Failed to load saved theme:', e);
            return 'default';
        }
    }

    saveTheme(theme) {
        try {
            localStorage.setItem('pocketUmpireTheme', theme);
        } catch (e) {
            console.warn('Failed to save theme:', e);
        }
    }

    applyTheme(theme) {
        // Remove all theme classes
        document.body.classList.remove(
            'theme-australian-open',
            'theme-french-open',
            'theme-wimbledon',
            'theme-us-open'
        );

        // Apply new theme if not default
        if (theme !== 'default') {
            document.body.classList.add(`theme-${theme}`);
        }

        // Update active button
        document.querySelectorAll('.theme-btn').forEach(btn => {
            const btnTheme = btn.dataset.theme;
            btn.classList.toggle('active', btnTheme === theme);
        });

        this.currentTheme = theme;
        this.saveTheme(theme);
    }

    loadPlayerNames() {
        try {
            const saved = localStorage.getItem('pocketUmpireNames');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Failed to load saved names:', e);
        }
        return { player1: null, player2: null };
    }

    savePlayerNames() {
        try {
            localStorage.setItem('pocketUmpireNames', JSON.stringify(this.playerNames));
        } catch (e) {
            console.warn('Failed to save names:', e);
        }
    }

    initVoiceRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.warn('Web Speech API not supported');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.lang = 'es-ES';

        this.recognition.onresult = (event) => {
            const last = event.results.length - 1;
            const command = event.results[last][0].transcript.toLowerCase().trim();

            this.showFeedback(`🎤 "${command}"`, 'info');
            this.processVoiceCommand(command);
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error !== 'no-speech' && event.error !== 'aborted') {
                this.showFeedback(`Error: ${event.error}`, 'error');
            }
        };

        this.recognition.onend = () => {
            if (this.isListening) {
                try {
                    this.recognition.start();
                } catch (e) {
                    console.log('Recognition restart failed:', e);
                }
            }
        };
    }

    initEventListeners() {
        // Names modal
        this.elements.startMatchBtn.addEventListener('click', () => this.startMatch());
        this.elements.skipNamesBtn.addEventListener('click', () => this.startMatch());
        this.elements.player1NameInput.addEventListener('input', () => this.updateServeLabels());
        this.elements.player2NameInput.addEventListener('input', () => this.updateServeLabels());
        this.elements.player1NameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.elements.player2NameInput.focus();
        });
        this.elements.player2NameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startMatch();
        });

        // Match over modal
        this.elements.shareResultBtn.addEventListener('click', () => this.shareResult());
        this.elements.newMatchBtn.addEventListener('click', () => this.startNewMatch());

        // Set selection
        document.querySelectorAll('.btn-sets').forEach(btn => {
            btn.addEventListener('click', () => this.selectSets(parseInt(btn.dataset.sets)));
        });

        // Serve selection
        this.elements.player1ServesBtn.addEventListener('click', () => this.selectServer('player1'));
        this.elements.player2ServesBtn.addEventListener('click', () => this.selectServer('player2'));

        // Theme selection
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                this.applyTheme(theme);
                this.showFeedback(`✓ Theme: ${btn.querySelector('.theme-name').textContent}`, 'success');
            });
        });

        // Edit names (menu)
        this.elements.saveNamesBtn.addEventListener('click', () => this.saveNames());
        this.elements.editPlayer1Name.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.elements.editPlayer2Name.focus();
        });
        this.elements.editPlayer2Name.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.saveNames();
        });

        // Menu controls
        this.elements.menuBtn.addEventListener('click', () => this.openMenu());
        this.elements.closeMenu.addEventListener('click', () => this.closeMenu());
        this.elements.menuOverlay.addEventListener('click', () => this.closeMenu());

        // Voice control
        this.elements.voiceBtn.addEventListener('click', () => this.toggleVoiceRecognition());

        // Manual controls
        this.elements.player1PointBtn.addEventListener('click', () => this.addPoint('player1'));
        this.elements.player2PointBtn.addEventListener('click', () => this.addPoint('player2'));
        this.elements.undoBtn.addEventListener('click', () => this.undo());
        this.elements.resetBtn.addEventListener('click', () => this.resetMatch());

        // Touch interaction on score display
        this.elements.player1Points.addEventListener('click', () => this.addPoint('player1'));
        this.elements.player2Points.addEventListener('click', () => this.addPoint('player2'));

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === '1') this.addPoint('player1');
            if (e.key === '2') this.addPoint('player2');
            if (e.key === 'u' || e.key === 'U') this.undo();
            if (e.key === 'z' && e.ctrlKey) this.undo();
        });
    }

    showNamesModal() {
        // Load saved names into inputs
        this.elements.player1NameInput.value = this.playerNames.player1 !== 'Jugador 1' ? this.playerNames.player1 : '';
        this.elements.player2NameInput.value = this.playerNames.player2 !== 'Jugador 2' ? this.playerNames.player2 : '';

        // Update serve button labels with saved names
        this.updateServeLabels();

        // Select default server
        this.selectServer('player1');

        this.elements.namesModal.classList.remove('hidden');
        this.elements.player1NameInput.focus();
    }

    selectSets(numSets) {
        this.totalSets = numSets;

        // Update button states
        document.querySelectorAll('.btn-sets').forEach(btn => {
            const sets = parseInt(btn.dataset.sets);
            btn.classList.toggle('selected', sets === numSets);
        });
    }

    selectServer(player) {
        this.selectedServer = player;

        // Update button states
        this.elements.player1ServesBtn.classList.toggle('selected', player === 'player1');
        this.elements.player2ServesBtn.classList.toggle('selected', player === 'player2');
    }

    updateServeLabels() {
        // Update serve button labels with current names
        const name1 = this.elements.player1NameInput.value.trim() || this.playerNames.player1;
        const name2 = this.elements.player2NameInput.value.trim() || this.playerNames.player2;

        this.elements.player1ServeLabel.textContent = name1;
        this.elements.player2ServeLabel.textContent = name2;
    }

    startMatch() {
        // Get player names or use Spanish defaults
        const name1 = this.elements.player1NameInput.value.trim() || 'Jugador 1';
        const name2 = this.elements.player2NameInput.value.trim() || 'Jugador 2';

        this.playerNames.player1 = name1;
        this.playerNames.player2 = name2;

        // Save names to localStorage
        this.savePlayerNames();

        // Set the server based on selection
        this.server = this.selectedServer;

        // Initialize set history based on selected number of sets
        this.setHistory = this.createSetHistory(this.totalSets);

        // Update set display columns
        this.updateSetColumns();

        // Update displays
        this.updatePlayerNames();

        // Hide modal
        this.elements.namesModal.classList.add('hidden');

        this.updateDisplay();
    }

    updateSetColumns() {
        // Show/hide set columns based on totalSets
        for (let i = 1; i <= 5; i++) {
            const p1Set = document.getElementById(`p1-set${i}`);
            const p2Set = document.getElementById(`p2-set${i}`);

            if (p1Set && p2Set) {
                if (i <= this.totalSets) {
                    p1Set.style.display = 'block';
                    p2Set.style.display = 'block';
                } else {
                    p1Set.style.display = 'none';
                    p2Set.style.display = 'none';
                }
            }
        }

        // Update grid columns
        const containers = document.querySelectorAll('.sets-container');
        containers.forEach(container => {
            container.style.gridTemplateColumns = `repeat(${this.totalSets}, 1fr)`;
        });
    }

    updatePlayerNames() {
        // Update all displays with current player names
        this.elements.player1NameDisplay.textContent = this.playerNames.player1;
        this.elements.player2NameDisplay.textContent = this.playerNames.player2;
        this.elements.player1PointBtn.textContent = `Point ${this.playerNames.player1}`;
        this.elements.player2PointBtn.textContent = `Point ${this.playerNames.player2}`;

        // Update edit fields in menu
        this.elements.editPlayer1Name.placeholder = this.playerNames.player1;
        this.elements.editPlayer2Name.placeholder = this.playerNames.player2;
    }

    saveNames() {
        // Get new names from menu or keep current
        const name1 = this.elements.editPlayer1Name.value.trim() || this.playerNames.player1;
        const name2 = this.elements.editPlayer2Name.value.trim() || this.playerNames.player2;

        this.playerNames.player1 = name1;
        this.playerNames.player2 = name2;

        // Save to localStorage
        this.savePlayerNames();

        // Update all displays
        this.updatePlayerNames();

        // Clear input fields
        this.elements.editPlayer1Name.value = '';
        this.elements.editPlayer2Name.value = '';

        this.showFeedback('✓ Names updated', 'success');
    }

    openMenu() {
        // Update edit name placeholders when opening menu
        this.elements.editPlayer1Name.placeholder = this.playerNames.player1;
        this.elements.editPlayer2Name.placeholder = this.playerNames.player2;

        this.elements.menuPanel.classList.add('active');
        this.elements.menuOverlay.classList.add('active');
    }

    closeMenu() {
        this.elements.menuPanel.classList.remove('active');
        this.elements.menuOverlay.classList.remove('active');
    }

    toggleVoiceRecognition() {
        if (!this.recognition) {
            this.showFeedback('Voice not available', 'error');
            return;
        }

        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    startListening() {
        try {
            this.recognition.start();
            this.isListening = true;
            this.elements.voiceBtn.classList.add('listening');
            this.elements.voiceBtn.querySelector('.btn-text').textContent = 'Stop Listening';
            this.showFeedback('🎤 Listening...', 'success');
        } catch (error) {
            console.error('Failed to start recognition:', error);
            this.showFeedback('Failed to start', 'error');
        }
    }

    stopListening() {
        if (this.recognition) {
            this.recognition.stop();
        }
        this.isListening = false;
        this.elements.voiceBtn.classList.remove('listening');
        this.elements.voiceBtn.querySelector('.btn-text').textContent = 'Start Listening';
        this.showFeedback('Stopped', 'info');
    }

    processVoiceCommand(command) {
        const normalized = command.toLowerCase().trim();

        console.log('Processing command:', normalized);

        // Check for exact score commands first (e.g., "cuarenta cero", "treinta quince")
        if (this.handleExactScoreCommand(normalized)) {
            return;
        }

        // Point commands for player 2 (check first to avoid conflicts with "uno" in "dos")
        if (normalized.match(/punto\s*(dos|2)|point\s*(two|2)/) ||
            (normalized.includes('dos') && !normalized.includes('uno'))) {
            this.addPoint('player2');
            this.showFeedback('✓ Point Player 2', 'success');
        }
        // Point commands for player 1
        else if (normalized.match(/punto\s*(uno|1)|point\s*(one|1)/) ||
                 normalized.includes('uno')) {
            this.addPoint('player1');
            this.showFeedback('✓ Point Player 1', 'success');
        }
        // Game command - award game to player who is one point from winning
        else if (normalized.match(/\b(game|juego)\b/)) {
            this.handleGameCommand();
        }
        // Undo command
        else if (normalized.match(/deshacer|undo|atrás/)) {
            this.undo();
            this.showFeedback('✓ Undone', 'success');
        }
        // Reset command
        else if (normalized.match(/reiniciar|reset|nuevo/)) {
            this.resetMatch();
            this.showFeedback('✓ Reset', 'success');
        }
        else {
            this.showFeedback(`❓ "${command}"`, 'warning');
        }
    }

    handleExactScoreCommand(command) {
        // Normalize common speech recognition errors
        let normalized = command;

        // Handle "300" -> "treinta cero"
        normalized = normalized.replace(/\b300\b/, 'treinta cero');
        normalized = normalized.replace(/\btrescientos\b/, 'treinta cero');

        // Handle "150" -> "quince cero"
        normalized = normalized.replace(/\b150\b/, 'quince cero');
        normalized = normalized.replace(/\bciento cincuenta\b/, 'quince cero');

        // Handle "0XX" patterns (e.g., "040" -> "cero cuarenta")
        normalized = normalized.replace(/\b040\b/, 'cero cuarenta');
        normalized = normalized.replace(/\b015\b/, 'cero quince');
        normalized = normalized.replace(/\b030\b/, 'cero treinta');

        // Handle other number concatenations
        normalized = normalized.replace(/\b1530\b/, 'quince treinta');
        normalized = normalized.replace(/\b1540\b/, 'quince cuarenta');
        normalized = normalized.replace(/\b3015\b/, 'treinta quince');
        normalized = normalized.replace(/\b3040\b/, 'treinta cuarenta');
        normalized = normalized.replace(/\b4015\b/, 'cuarenta quince');
        normalized = normalized.replace(/\b4030\b/, 'cuarenta treinta');

        // Handle "X iguales" patterns
        normalized = normalized.replace(/\b15\s+iguales\b/, 'quince quince');
        normalized = normalized.replace(/\bquince\s+iguales\b/, 'quince quince');
        normalized = normalized.replace(/\b30\s+iguales\b/, 'treinta treinta');
        normalized = normalized.replace(/\btreinta\s+iguales\b/, 'treinta treinta');
        normalized = normalized.replace(/\b40\s+iguales\b/, 'iguales');
        normalized = normalized.replace(/\bcuarenta\s+iguales\b/, 'iguales');

        const words = normalized.split(/\s+/);

        // Check for "deuce" or "iguales" or "40 40"
        if (words.includes('deuce') || words.includes('iguales') ||
            (words.includes('40') && words.lastIndexOf('40') !== words.indexOf('40')) ||
            (words.includes('cuarenta') && words.lastIndexOf('cuarenta') !== words.indexOf('cuarenta'))) {
            this.setExactScore(3, 3);
            this.showFeedback('✓ Deuce', 'success');
            return true;
        }

        // Look for two score words
        let score1 = null;
        let score2 = null;

        for (let i = 0; i < words.length - 1; i++) {
            const word1 = words[i];
            const word2 = words[i + 1];

            if (this.scoreNameMap.hasOwnProperty(word1) &&
                this.scoreNameMap.hasOwnProperty(word2)) {
                score1 = this.scoreNameMap[word1];
                score2 = this.scoreNameMap[word2];
                break;
            }
        }

        if (score1 !== null && score2 !== null) {
            this.setExactScore(score1, score2);
            this.showFeedback(`✓ ${this.getPointDisplay('player1')} - ${this.getPointDisplay('player2')}`, 'success');
            return true;
        }

        return false;
    }

    setExactScore(player1Points, player2Points) {
        if (this.matchWinner) return;

        // Save state for undo
        this.saveState();

        this.score.player1.points = player1Points;
        this.score.player2.points = player2Points;

        this.updateDisplay();
    }

    handleGameCommand() {
        if (this.matchWinner) {
            this.showFeedback('Match over!', 'warning');
            return;
        }

        const p1Points = this.score.player1.points;
        const p2Points = this.score.player2.points;

        // Check if player1 is one point from winning
        const player1CanWin = p1Points >= 3 && p1Points - p2Points >= 1;
        // Check if player2 is one point from winning
        const player2CanWin = p2Points >= 3 && p2Points - p1Points >= 1;

        if (player1CanWin && !player2CanWin) {
            this.addPoint('player1');
            this.showFeedback(`✓ Game ${this.playerNames.player1}`, 'success');
        } else if (player2CanWin && !player1CanWin) {
            this.addPoint('player2');
            this.showFeedback(`✓ Game ${this.playerNames.player2}`, 'success');
        } else if (player1CanWin && player2CanWin) {
            // Both at AD? Shouldn't happen, but handle it
            this.showFeedback('Both players at AD!', 'warning');
        } else {
            // Neither player is one point from winning
            this.showFeedback('No player close to winning', 'warning');
        }
    }

    addPoint(player) {
        if (this.matchWinner) {
            this.showMatchStatus('Match over! Reset to start new match');
            return;
        }

        // Save state for undo
        this.saveState();

        const opponent = player === 'player1' ? 'player2' : 'player1';

        // Tie-break mode
        if (this.tiebreak) {
            this.tiebreakPoints[player]++;

            // Check for tie-break win
            if (this.checkTiebreakWin(player, opponent)) {
                // Player wins the tie-break and the set
                this.score[player].games++;
                this.setHistory[this.currentSet][player] = this.score[player].games;
                this.score[player].sets++;

                // Reset for next set
                this.score.player1.games = 0;
                this.score.player2.games = 0;
                this.score.player1.points = 0;
                this.score.player2.points = 0;
                this.tiebreak = false;
                this.tiebreakPoints = { player1: 0, player2: 0 };

                // Alternate server after tie-break
                this.server = this.server === 'player1' ? 'player2' : 'player1';

                // Check for match win
                const setsToWin = Math.ceil(this.totalSets / 2);
                if (this.score[player].sets === setsToWin) {
                    this.matchWinner = player;
                    this.showMatchStatus(`🏆 ${this.playerNames[player].toUpperCase()} WINS! 🏆`);
                    // Show match over modal after a brief delay
                    setTimeout(() => this.showMatchOverModal(), 2000);
                } else {
                    this.currentSet++;
                    this.showMatchStatus(`${this.playerNames[player]} wins Set ${this.currentSet} (Tie-break)`);
                }
            } else {
                // In tie-break, server alternates every 2 points
                const totalPoints = this.tiebreakPoints.player1 + this.tiebreakPoints.player2;
                if (totalPoints % 2 === 1) {
                    this.server = this.server === 'player1' ? 'player2' : 'player1';
                }
            }
        } else {
            // Regular game
            this.score[player].points++;

            // Check for game win
            if (this.checkGameWin(player, opponent)) {
                this.score[player].games++;
                this.setHistory[this.currentSet][player] = this.score[player].games;

                // Reset points
                this.score.player1.points = 0;
                this.score.player2.points = 0;

                // Check if we should enter tie-break (6-6)
                if (this.score.player1.games === 6 && this.score.player2.games === 6) {
                    this.tiebreak = true;
                    this.tiebreakStartServer = this.server;
                    this.showMatchStatus('Tie-break!');
                }
                // Check for set win
                else if (this.checkSetWin(player, opponent)) {
                    this.score[player].sets++;
                    this.score.player1.games = 0;
                    this.score.player2.games = 0;

                    // Check for match win
                    const setsToWin = Math.ceil(this.totalSets / 2);
                    if (this.score[player].sets === setsToWin) {
                        this.matchWinner = player;
                        this.showMatchStatus(`🏆 ${this.playerNames[player].toUpperCase()} WINS! 🏆`);
                        // Show match over modal after a brief delay
                        setTimeout(() => this.showMatchOverModal(), 2000);
                    } else {
                        this.currentSet++;
                        this.showMatchStatus(`${this.playerNames[player]} wins Set ${this.currentSet}`);
                    }
                } else {
                    this.showMatchStatus(`${this.playerNames[player]} wins game`);
                }

                // Alternate server after game (unless entering tie-break)
                if (!this.tiebreak) {
                    this.server = this.server === 'player1' ? 'player2' : 'player1';
                }
            }
        }

        this.updateDisplay();
    }

    checkGameWin(player, opponent) {
        const playerPoints = this.score[player].points;
        const opponentPoints = this.score[opponent].points;

        // Standard game win (4 points with 2 point lead)
        if (playerPoints >= 4 && playerPoints - opponentPoints >= 2) {
            return true;
        }

        return false;
    }

    checkSetWin(player, opponent) {
        const playerGames = this.score[player].games;
        const opponentGames = this.score[opponent].games;

        // Win set: first to 6 games with 2 game lead (or 7-5)
        if (playerGames >= 6 && playerGames - opponentGames >= 2) {
            return true;
        }

        return false;
    }

    checkTiebreakWin(player, opponent) {
        const playerPoints = this.tiebreakPoints[player];
        const opponentPoints = this.tiebreakPoints[opponent];

        // Win tie-break: first to 7 points with 2 point lead
        if (playerPoints >= 7 && playerPoints - opponentPoints >= 2) {
            return true;
        }

        return false;
    }

    getPointDisplay(player) {
        // In tie-break, show actual points
        if (this.tiebreak) {
            return this.tiebreakPoints[player].toString();
        }

        const playerPoints = this.score[player].points;
        const opponent = player === 'player1' ? 'player2' : 'player1';
        const opponentPoints = this.score[opponent].points;

        // Deuce situation (both at 3+ points)
        if (playerPoints >= 3 && opponentPoints >= 3) {
            if (playerPoints === opponentPoints) {
                return '40';
            } else if (playerPoints > opponentPoints) {
                return 'AD';
            } else {
                return '40';
            }
        }

        // Normal scoring
        return this.pointsDisplay[Math.min(playerPoints, 3)] || '0';
    }

    updateDisplay() {
        // Update current points
        this.elements.player1Points.textContent = this.getPointDisplay('player1');
        this.elements.player2Points.textContent = this.getPointDisplay('player2');

        // Update serve indicators
        this.elements.player1Serve.classList.toggle('active', this.server === 'player1');
        this.elements.player2Serve.classList.toggle('active', this.server === 'player2');

        // Update set history
        this.updateSetHistory();

        // Update undo button state
        this.elements.undoBtn.disabled = this.history.length === 0;
    }

    updateSetHistory() {
        // Update all sets (up to 5)
        for (let i = 0; i < this.totalSets; i++) {
            const p1Element = document.getElementById(`p1-set${i + 1}`);
            const p2Element = document.getElementById(`p2-set${i + 1}`);

            if (!p1Element || !p2Element) continue;

            const p1Games = this.setHistory[i].player1;
            const p2Games = this.setHistory[i].player2;

            // Display "-" for unplayed sets
            if (p1Games === 0 && p2Games === 0 && i > this.currentSet) {
                p1Element.textContent = '-';
                p2Element.textContent = '-';
                p1Element.classList.remove('current', 'winner');
                p2Element.classList.remove('current', 'winner');
            } else {
                p1Element.textContent = p1Games;
                p2Element.textContent = p2Games;

                // Mark current set
                if (i === this.currentSet && !this.matchWinner) {
                    p1Element.classList.add('current');
                    p2Element.classList.add('current');
                    p1Element.classList.remove('winner');
                    p2Element.classList.remove('winner');
                } else {
                    p1Element.classList.remove('current');
                    p2Element.classList.remove('current');

                    // Mark winner of completed set
                    if (p1Games > p2Games && p1Games >= 6) {
                        p1Element.classList.add('winner');
                        p2Element.classList.remove('winner');
                    } else if (p2Games > p1Games && p2Games >= 6) {
                        p2Element.classList.add('winner');
                        p1Element.classList.remove('winner');
                    } else {
                        p1Element.classList.remove('winner');
                        p2Element.classList.remove('winner');
                    }
                }
            }
        }
    }

    showMatchStatus(message) {
        this.elements.matchStatus.textContent = message;

        // Clear status after 4 seconds unless it's a match win
        if (!this.matchWinner) {
            setTimeout(() => {
                this.elements.matchStatus.textContent = '';
            }, 4000);
        }
    }

    showFeedback(message, type = 'info') {
        this.elements.voiceFeedback.textContent = message;
        this.elements.voiceFeedback.style.color =
            type === 'success' ? 'var(--accent-green)' :
            type === 'error' ? 'var(--accent-red)' :
            type === 'warning' ? 'var(--accent-yellow)' :
            'var(--accent-blue)';

        // Clear feedback after 3 seconds
        setTimeout(() => {
            if (this.elements.voiceFeedback.textContent === message) {
                this.elements.voiceFeedback.textContent = '';
            }
        }, 3000);
    }

    saveState() {
        // Deep copy current state
        this.history.push({
            score: JSON.parse(JSON.stringify(this.score)),
            setHistory: JSON.parse(JSON.stringify(this.setHistory)),
            currentSet: this.currentSet,
            server: this.server,
            matchWinner: this.matchWinner,
            tiebreak: this.tiebreak,
            tiebreakPoints: JSON.parse(JSON.stringify(this.tiebreakPoints)),
            tiebreakStartServer: this.tiebreakStartServer,
            totalSets: this.totalSets
        });

        // Limit history to last 50 moves
        if (this.history.length > 50) {
            this.history.shift();
        }
    }

    undo() {
        if (this.history.length === 0) {
            this.showFeedback('Nothing to undo', 'warning');
            return;
        }

        const previousState = this.history.pop();
        this.score = previousState.score;
        this.setHistory = previousState.setHistory;
        this.currentSet = previousState.currentSet;
        this.server = previousState.server;
        this.matchWinner = previousState.matchWinner;
        this.tiebreak = previousState.tiebreak;
        this.tiebreakPoints = previousState.tiebreakPoints;
        this.tiebreakStartServer = previousState.tiebreakStartServer;
        this.totalSets = previousState.totalSets;

        // Update set columns display
        this.updateSetColumns();

        if (this.matchWinner) {
            this.showMatchStatus(`🏆 ${this.playerNames[this.matchWinner].toUpperCase()} WINS! 🏆`);
        } else {
            this.elements.matchStatus.textContent = '';
        }

        this.updateDisplay();
        this.showFeedback('✓ Undo', 'success');
    }

    resetMatch() {
        const confirmed = confirm('Start a new match?');
        if (!confirmed) return;

        // Reset to default 3 sets
        this.totalSets = 3;

        this.score = {
            player1: { points: 0, games: 0, sets: 0 },
            player2: { points: 0, games: 0, sets: 0 }
        };
        this.setHistory = this.createSetHistory(3);
        this.currentSet = 0;
        this.server = 'player1';
        this.history = [];
        this.matchWinner = null;
        this.tiebreak = false;
        this.tiebreakPoints = { player1: 0, player2: 0 };
        this.tiebreakStartServer = null;

        // Clear input fields for new names
        this.elements.player1NameInput.value = '';
        this.elements.player2NameInput.value = '';

        // Reset set selection to 3
        document.querySelectorAll('.btn-sets').forEach(btn => {
            const sets = parseInt(btn.dataset.sets);
            btn.classList.toggle('selected', sets === 3);
        });

        this.elements.matchStatus.textContent = '';
        this.closeMenu();

        // Show names modal for new match
        this.showNamesModal();
    }

    formatMatchResult() {
        if (!this.matchWinner) return '';

        const winner = this.playerNames[this.matchWinner];
        const loser = this.playerNames[this.matchWinner === 'player1' ? 'player2' : 'player1'];
        const winnerSets = this.score[this.matchWinner].sets;
        const loserSets = this.score[this.matchWinner === 'player1' ? 'player2' : 'player1'].sets;

        // Build set scores
        let setScores = '';
        for (let i = 0; i < this.totalSets; i++) {
            const p1Games = this.setHistory[i].player1;
            const p2Games = this.setHistory[i].player2;

            if (p1Games === 0 && p2Games === 0) break; // Unplayed set

            if (this.matchWinner === 'player1') {
                setScores += `Set ${i + 1}: ${p1Games}-${p2Games}\n`;
            } else {
                setScores += `Set ${i + 1}: ${p2Games}-${p1Games}\n`;
            }
        }

        return `🎾 Pocket Umpire Match Result 🎾

${winner} defeats ${loser}
${winnerSets}-${loserSets}

${setScores}
🏆 ${winner} wins!`;
    }

    showMatchOverModal() {
        const resultText = this.formatMatchResult();
        this.elements.matchResultDisplay.textContent = resultText;
        this.elements.matchOverModal.classList.remove('hidden');
    }

    async shareResult() {
        const resultText = this.formatMatchResult();

        // Try Web Share API first (works great on mobile)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: '🎾 Tennis Match Result',
                    text: resultText
                });
                this.showFeedback('✓ Shared!', 'success');
                return;
            } catch (err) {
                // User cancelled or error occurred
                if (err.name !== 'AbortError') {
                    console.log('Share failed:', err);
                }
            }
        }

        // Fallback: Try clipboard
        try {
            await navigator.clipboard.writeText(resultText);
            this.showFeedback('✓ Copied to clipboard!', 'success');
        } catch (err) {
            // Last resort: Show alert with text to copy manually
            alert('Copy this result:\n\n' + resultText);
        }
    }

    startNewMatch() {
        // Hide match over modal
        this.elements.matchOverModal.classList.add('hidden');

        // Reset match state
        this.totalSets = 3;
        this.score = {
            player1: { points: 0, games: 0, sets: 0 },
            player2: { points: 0, games: 0, sets: 0 }
        };
        this.setHistory = this.createSetHistory(3);
        this.currentSet = 0;
        this.server = 'player1';
        this.history = [];
        this.matchWinner = null;
        this.tiebreak = false;
        this.tiebreakPoints = { player1: 0, player2: 0 };
        this.tiebreakStartServer = null;

        // Clear input fields for new names
        this.elements.player1NameInput.value = '';
        this.elements.player2NameInput.value = '';

        // Reset set selection to 3
        document.querySelectorAll('.btn-sets').forEach(btn => {
            const sets = parseInt(btn.dataset.sets);
            btn.classList.toggle('selected', sets === 3);
        });

        this.elements.matchStatus.textContent = '';

        // Show names modal for new match
        this.showNamesModal();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const match = new TennisMatch();

    // Make it available globally for debugging
    window.tennisMatch = match;

    console.log('🎾 Pocket Umpire initialized!');
    console.log('Voice commands: "punto uno", "punto dos", "cuarenta cero", etc.');
    console.log('Keyboard: 1 (player 1 point), 2 (player 2 point), U (undo)');
});
