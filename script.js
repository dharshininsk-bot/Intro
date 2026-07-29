/**
 * MAGICAL LOGO UNVEIL - CORE APP ENGINE & REALTIME FIREBASE CONTROLLER
 */

// ==========================================
// 1. NEON BUTTERFLIES & BACKGROUND CANVAS
// ==========================================
const canvas = document.getElementById('butterflyCanvas');
const ctx = canvas.getContext('2d');

let width, height;
function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const NEON_COLORS = [
    { fill: 'rgba(0, 243, 255, 0.4)', glow: '#00f3ff' },
    { fill: 'rgba(255, 0, 127, 0.4)', glow: '#ff007f' },
    { fill: 'rgba(181, 55, 242, 0.4)', glow: '#b537f2' },
    { fill: 'rgba(255, 230, 0, 0.4)', glow: '#ffe600' }
];

class Sparkle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5 - 0.5;
        this.color = color;
        this.life = 1;
        this.decay = Math.random() * 0.03 + 0.015;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
    }

    draw(ctx) {
        if (this.life <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class TileShard {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 8 + 4;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.rotation = Math.random() * Math.PI * 2;
        this.vRot = (Math.random() - 0.5) * 0.3;
        this.color = color;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.02;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.15;
        this.rotation += this.vRot;
        this.life -= this.decay;
    }

    draw(ctx) {
        if (this.life <= 0) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        
        ctx.beginPath();
        ctx.moveTo(-this.size / 2, -this.size / 2);
        ctx.lineTo(this.size / 2, -this.size / 4);
        ctx.lineTo(this.size / 4, this.size / 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

class NeonButterfly {
    constructor() {
        this.reset();
        this.x = Math.random() * width;
        this.y = Math.random() * height;
    }

    reset() {
        this.x = Math.random() < 0.5 ? -30 : width + 30;
        this.y = Math.random() * height;
        this.size = Math.random() * 12 + 10;
        this.speed = Math.random() * 1.5 + 1;
        
        const targetX = Math.random() * width;
        const targetY = Math.random() * height;
        const angle = Math.atan2(targetY - this.y, targetX - this.x);
        
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
        this.wingAngle = Math.random() * Math.PI;
        this.wingSpeed = Math.random() * 0.15 + 0.1;
        this.color = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
        this.turnTimer = 0;
    }

    update() {
        this.turnTimer++;
        if (this.turnTimer > 120) {
            this.turnTimer = 0;
            const heading = Math.atan2(this.vy, this.vx) + (Math.random() - 0.5) * 0.8;
            this.vx = Math.cos(heading) * this.speed;
            this.vy = Math.sin(heading) * this.speed;
        }

        this.x += this.vx;
        this.y += this.vy;
        this.wingAngle += this.wingSpeed;

        if (this.x < -50 || this.x > width + 50 || this.y < -50 || this.y > height + 50) {
            this.reset();
        }

        if (Math.random() < 0.35) {
            sparkles.push(new Sparkle(this.x, this.y, this.color.glow));
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        const heading = Math.atan2(this.vy, this.vx) + Math.PI / 2;
        ctx.rotate(heading);

        const wingScale = Math.sin(this.wingAngle);

        ctx.shadowColor = this.color.glow;
        ctx.shadowBlur = 14;
        ctx.fillStyle = this.color.fill;
        ctx.strokeStyle = this.color.glow;
        ctx.lineWidth = 1.5;

        // Wings
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
            -this.size * 2.2 * wingScale, -this.size * 1.8,
            -this.size * 2.8 * wingScale, this.size * 0.2,
            0, this.size * 0.5
        );
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
            this.size * 2.2 * wingScale, -this.size * 1.8,
            this.size * 2.8 * wingScale, this.size * 0.2,
            0, this.size * 0.5
        );
        ctx.fill();
        ctx.stroke();

        // Body
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.ellipse(0, 0, 1.5, this.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

const butterflies = Array.from({ length: 14 }, () => new NeonButterfly());
const sparkles = [];
const shards = [];

function animateCanvas() {
    ctx.clearRect(0, 0, width, height);

    for (let i = sparkles.length - 1; i >= 0; i--) {
        sparkles[i].update();
        sparkles[i].draw(ctx);
        if (sparkles[i].life <= 0) sparkles.splice(i, 1);
    }

    for (let i = shards.length - 1; i >= 0; i--) {
        shards[i].update();
        shards[i].draw(ctx);
        if (shards[i].life <= 0) shards.splice(i, 1);
    }

    butterflies.forEach(b => {
        b.update();
        b.draw(ctx);
    });

    requestAnimationFrame(animateCanvas);
}
animateCanvas();

function spawnShatterBurst(screenX, screenY) {
    const color = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)].glow;
    for (let i = 0; i < 24; i++) {
        shards.push(new TileShard(screenX, screenY, color));
    }
    for (let i = 0; i < 15; i++) {
        sparkles.push(new Sparkle(screenX, screenY, '#ffffff'));
    }
}


// ==========================================
// 2. SYNTHESIZED AUDIO SFX
// ==========================================
let audioCtx = null;

function getAudioCtx() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function playShatterSound() {
    try {
        const ctx = getAudioCtx();
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const baseFreq = 500 + Math.random() * 600;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.5, now + 0.15);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
    } catch (e) {}
}

function playTone(freq, duration = 0.2) {
    try {
        const ctx = getAudioCtx();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + duration);
    } catch (e) {}
}

function playSuccessFanfare() {
    try {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            setTimeout(() => playTone(freq, 0.25), idx * 80);
        });
    } catch (e) {}
}


// ==========================================
// 3. TILE GRID & APP CONTROLLER
// ==========================================
const tileGrid = document.getElementById('tileGrid');
const tilesLeftEl = document.getElementById('tilesLeft');
const progressTextEl = document.getElementById('progressText');
const progressBarEl = document.getElementById('progressBar');
const winBanner = document.getElementById('winBanner');
const btnRehide = document.getElementById('btnRehide');

// Mini-Game Modal Elements
const minigameModal = document.getElementById('minigameModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalTileBadge = document.getElementById('modalTileBadge');
const modalGameTitle = document.getElementById('modalGameTitle');
const modalGameDesc = document.getElementById('modalGameDesc');
const minigameCanvas = document.getElementById('minigameCanvas');
const mgCtx = minigameCanvas.getContext('2d');
const minigameStatus = document.getElementById('minigameStatus');
const btnStartGame = document.getElementById('btnStartGame');

// Name Prompt Modal Elements
const namePromptModal = document.getElementById('namePromptModal');
const playerGameNameInput = document.getElementById('playerGameNameInput');
const btnSubmitGameName = document.getElementById('btnSubmitGameName');

// Completed Modal Elements
const completedModal = document.getElementById('completedModal');
const completedCloseBtn = document.getElementById('completedCloseBtn');
const completedOkBtn = document.getElementById('completedOkBtn');
const completedTileBadge = document.getElementById('completedTileBadge');
const completedMessage = document.getElementById('completedMessage');

let totalTiles = 16;
let brokenCount = 0;
let activeTileElement = null;
let activeTileIndex = -1;
let currentGameLoop = null;
let scannedTileIndex = null; // Currently scanned tile from URL query parameter ?tile=X
let completedModalTimeout = null;
let allTilesStateData = {};

// Game Type Definitions for Tiles 1..16
const MINI_GAMES = [
    { title: "Neon Chrome Dino", desc: "Press Space or Tap to jump over obstacles! Reach 1200 points to shatter the tile.", type: "dino" },
    { title: "Star Catcher", desc: "Click and collect 15 Pink Stars in 10 seconds! ", type: "star_catcher" },
    { title: "Reflex Clicker", desc: "Click 5 glowing targets correctly within 3.5 seconds!", type: "quick_click" },
    { title: "Constellation Connect", desc: "Connect dots 1 to 8 in numerical order in 3.5s to form a heart!", type: "constellation" },
    { title: "Magical Sound Piano", desc: "Listen to the note pattern and replicate it on the neon piano!", type: "piano" },
    { title: "Magic Rhythm Tiles", desc: "Music plays! Tap 12 falling neon tiles before they hit the bottom.", type: "magic_tiles" },
    { title: "Find the Star in the Jar", desc: "The star is put in a jar and shuffled. Pick the top-down jar containing the star!", type: "jar_shuffle" },
    { title: "Catch the Fast Firefly", desc: "Catch the super fast glowing firefly by clicking it!", type: "fast_firefly" },
    { title: "Tower Stacker", desc: "Stack sliding blocks up to height 10 cleanly!", type: "tower_stacker" },
    { title: "Tower of Hanoi", desc: "Solve Tower of Hanoi: move all 3 disks from Peg A to Peg C!", type: "hanoi" },
    
    // Cycles for Tiles 11-16
    { title: "Magic Rhythm Tiles II", desc: "Tap 12 falling neon tiles cleanly!", type: "magic_tiles" },
    { title: "Find the Star II", desc: "Pick the correct top-down jar containing the hidden star!", type: "jar_shuffle" },
    { title: "Catch the Fast Firefly II", desc: "Tap the fast erratic firefly!", type: "fast_firefly" },
    { title: "Tower Stacker II", desc: "Stack blocks up to height 10!", type: "tower_stacker" },
    { title: "Tower of Hanoi II", desc: "Move all 3 disks to Peg C!", type: "hanoi" },
    { title: "Grand Dino Challenge", desc: "Reach 1200 points to shatter the final tile!", type: "dino" }
];

const TILE_ICONS = ['🦖', '⭐', '⚡', '✨', '🎹', '🎵', '🏺', '🪲', '🧱', '🧩', '🎶', '💫', '⚡', '🏢', '🏛️', '👑'];

function initGrid() {
    totalTiles = 16;
    brokenCount = 0;
    winBanner.classList.add('hidden');
    tileGrid.innerHTML = '';

    for (let i = 0; i < totalTiles; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.dataset.index = i;

        const num = document.createElement('span');
        num.className = 'tile-number';
        num.innerText = `#${i + 1}`;

        const icon = document.createElement('span');
        icon.className = 'tile-icon';
        icon.innerText = TILE_ICONS[i % TILE_ICONS.length];

        const label = document.createElement('span');
        label.innerText = `TILE ${i + 1}`;

        tile.appendChild(num);
        tile.appendChild(icon);
        tile.appendChild(label);

        tile.addEventListener('click', () => {
            if (tile.classList.contains('broken') || tile.classList.contains('shattering')) {
                return;
            }

            // Tile can only be played if scanned via QR code for this specific tile
            if (scannedTileIndex === i) {
                openMiniGameModal(i, tile);
            } else {
                alert(`🔒 TILE #${i + 1} IS LOCKED!\n\nYou must scan the physical QR code for Tile #${i + 1} to unlock and play this challenge!`);
            }
        });

        tileGrid.appendChild(tile);
    }

    updateStats();
}

let isInitialLoadProcessed = false;

function checkScannedTileStatus() {
    if (scannedTileIndex === null || isInitialLoadProcessed) return;

    const tileIdx = scannedTileIndex;
    const tileNum = tileIdx + 1;
    const targetTile = document.querySelector(`.tile[data-index="${tileIdx}"]`);
    const tileKey = `tile_${tileIdx}`;
    const tileInfo = allTilesStateData[tileKey];

    if (targetTile) {
        isInitialLoadProcessed = true;
        if (targetTile.classList.contains('broken') || (tileInfo && tileInfo.broken)) {
            const solver = (tileInfo && tileInfo.solverName) ? tileInfo.solverName : "A player";
            showAlreadyCompletedModal(tileNum, solver);
        } else {
            openMiniGameModal(tileIdx, targetTile);
        }
    }
}

/**
 * Realtime Tile Sync callback (Receives data from Firebase or LocalStorage)
 */
function handleRealtimeUpdate(tilesData) {
    allTilesStateData = tilesData || {};
    let currentBroken = 0;
    const tiles = document.querySelectorAll('.tile');

    tiles.forEach((tileEl, idx) => {
        const key = `tile_${idx}`;
        const info = tilesData[key];

        if (info && info.broken) {
            currentBroken++;
            if (!tileEl.classList.contains('broken')) {
                tileEl.classList.add('broken');
            }
        } else {
            tileEl.classList.remove('broken', 'shattering');
        }
    });

    brokenCount = currentBroken;
    updateStats();

    if (brokenCount >= totalTiles) {
        triggerVictory();
    }

    // Check scanned tile after initial data load
    checkScannedTileStatus();
}

/**
 * MANDATORY METHOD: onClick(tileElement)
 * Breaks the specified tile upon completing the mini-game
 */
function onClick(tileElement, solverName = "A Player") {
    if (!tileElement || tileElement.classList.contains('shattering') || tileElement.classList.contains('broken')) {
        return;
    }

    const tileIdx = parseInt(tileElement.dataset.index, 10);

    const randRot = (Math.random() * 60 - 30) + 'deg';
    const randX = (Math.random() * 80 - 40) + 'px';
    const randY = (Math.random() * 80 - 40) + 'px';
    tileElement.style.setProperty('--rand-rot', randRot);
    tileElement.style.setProperty('--rand-x', randX);
    tileElement.style.setProperty('--rand-y', randY);

    tileElement.classList.add('shattering');
    playShatterSound();

    const rect = tileElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    spawnShatterBurst(centerX, centerY);

    // Save broken state & solver name to Firebase Realtime Database
    setTileBrokenInFirebase(tileIdx, solverName);

    setTimeout(() => {
        tileElement.classList.remove('shattering');
        tileElement.classList.add('broken');
        
        updateStats();

        if (brokenCount >= totalTiles) {
            triggerVictory();
        }
    }, 450);
}

function updateStats() {
    const remaining = totalTiles - brokenCount;
    tilesLeftEl.innerText = Math.max(0, remaining);

    const progressPct = Math.min(100, Math.round((brokenCount / totalTiles) * 100));
    progressTextEl.innerText = progressPct + '%';
    progressBarEl.style.width = progressPct + '%';
}

function triggerVictory() {
    setTimeout(() => {
        winBanner.classList.remove('hidden');
        playSuccessFanfare();
        for (let i = 0; i < 8; i++) {
            butterflies.push(new NeonButterfly());
        }
    }, 300);
}


// ==========================================
// 4. MINI-GAME MODAL & QR CODE LOGIC
// ==========================================
function openMiniGameModal(tileIndex, tileElement) {
    activeTileElement = tileElement;
    activeTileIndex = tileIndex;
    const config = MINI_GAMES[tileIndex % MINI_GAMES.length];

    modalTileBadge.innerText = `TILE ${tileIndex + 1}`;
    modalGameTitle.innerText = config.title;
    modalGameDesc.innerText = config.desc;
    minigameStatus.innerText = "Press 'Start Challenge' to begin!";
    minigameStatus.className = "game-status";
    btnStartGame.classList.remove('hidden');

    // Draw initial preview on canvas
    mgCtx.clearRect(0, 0, minigameCanvas.width, minigameCanvas.height);
    mgCtx.fillStyle = '#0a0a16';
    mgCtx.fillRect(0, 0, minigameCanvas.width, minigameCanvas.height);
    mgCtx.fillStyle = '#00f3ff';
    mgCtx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
    mgCtx.textAlign = 'center';
    mgCtx.fillText(config.title, minigameCanvas.width / 2, minigameCanvas.height / 2 - 10);
    mgCtx.fillStyle = '#b537f2';
    mgCtx.font = '13px "Plus Jakarta Sans", sans-serif';
    mgCtx.fillText("Click 'Start Challenge' below when ready", minigameCanvas.width / 2, minigameCanvas.height / 2 + 20);

    minigameModal.classList.remove('hidden');
}

function closeMiniGameModal() {
    if (currentGameLoop) {
        cancelAnimationFrame(currentGameLoop);
        currentGameLoop = null;
    }
    minigameModal.classList.add('hidden');
}

function showAlreadyCompletedModal(tileNumber, solverName) {
    completedTileBadge.innerText = `TILE #${tileNumber}`;
    const nameStr = solverName ? solverName : "A player";
    completedMessage.innerHTML = `<strong style="color: var(--neon-pink); font-size: 1.1rem;">${nameStr}</strong> has already cracked the tile.`;
    completedModal.classList.remove('hidden');

    // Auto disappear after 5 seconds
    if (completedModalTimeout) {
        clearTimeout(completedModalTimeout);
    }
    completedModalTimeout = setTimeout(() => {
        closeCompletedModal();
    }, 5000);
}

function closeCompletedModal() {
    if (completedModalTimeout) {
        clearTimeout(completedModalTimeout);
        completedModalTimeout = null;
    }
    completedModal.classList.add('hidden');
}

modalCloseBtn.addEventListener('click', closeMiniGameModal);
completedCloseBtn.addEventListener('click', closeCompletedModal);
completedOkBtn.addEventListener('click', closeCompletedModal);

btnStartGame.addEventListener('click', () => {
    btnStartGame.classList.add('hidden');
    if (activeTileIndex >= 0) {
        const config = MINI_GAMES[activeTileIndex % MINI_GAMES.length];
        minigameStatus.innerText = "Game in progress...";
        startMiniGame(config.type);
    }
});

function onMiniGameWin() {
    if (currentGameLoop) {
        cancelAnimationFrame(currentGameLoop);
        currentGameLoop = null;
    }
    minigameStatus.innerText = "✨ CHALLENGE CLEARED! Tile Unlocked ✨";
    minigameStatus.className = "game-status win";
    btnStartGame.classList.add('hidden');

    playSuccessFanfare();

    setTimeout(() => {
        closeMiniGameModal();
        openNamePromptModal();
    }, 1100);
}

function openNamePromptModal() {
    playerGameNameInput.value = '';
    namePromptModal.classList.remove('hidden');
    setTimeout(() => playerGameNameInput.focus(), 200);
}

btnSubmitGameName.addEventListener('click', handleNameSubmission);
playerGameNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        handleNameSubmission();
    }
});

function handleNameSubmission() {
    const enteredName = playerGameNameInput.value.trim() || "Anonymous Hunter";
    namePromptModal.classList.add('hidden');

    if (activeTileElement) {
        onClick(activeTileElement, enteredName);
    }
}

function onMiniGameLose(reason = "Game Over!") {
    if (currentGameLoop) {
        cancelAnimationFrame(currentGameLoop);
        currentGameLoop = null;
    }
    minigameStatus.innerText = "OOPS... NICE TRY!! TRY SCANNING OTHER QR CODES AROUND THE CAMPUS";
    minigameStatus.className = "game-status lose";
    btnStartGame.classList.add('hidden');
}

function startMiniGame(type) {
    if (currentGameLoop) {
        cancelAnimationFrame(currentGameLoop);
        currentGameLoop = null;
    }

    switch (type) {
        case 'dino':
            runDinoGame();
            break;
        case 'star_catcher':
            runStarCatcherGame();
            break;
        case 'quick_click':
            runQuickClickGame();
            break;
        case 'constellation':
            runConstellationGame();
            break;
        case 'piano':
            runPianoGame();
            break;
        case 'magic_tiles':
            runMagicTilesGame();
            break;
        case 'jar_shuffle':
            runJarShuffleGame();
            break;
        case 'fast_firefly':
            runFastFireflyGame();
            break;
        case 'tower_stacker':
            runTowerStackerGame();
            break;
        case 'hanoi':
            runHanoiGame();
            break;
    }
}

// Rehide / Reset Listener
btnRehide.addEventListener('click', () => {
    resetFirebaseTiles();
});

// Startup Initialization & Realtime Subscription
initGrid();

listenToTileUpdates((tilesData) => {
    handleRealtimeUpdate(tilesData);
});

// Detect QR Code URL Query Parameter (e.g., index.html?tile=3)
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tileQuery = urlParams.get('tile');

    if (tileQuery) {
        const tileNum = parseInt(tileQuery, 10); // 1-based (1 to 16)
        if (!isNaN(tileNum) && tileNum >= 1 && tileNum <= 16) {
            scannedTileIndex = tileNum - 1;
            checkScannedTileStatus();
        }
    }
});


