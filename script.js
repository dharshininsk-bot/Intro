/**
 * MAGICAL LOGO UNVEIL - CORE APP ENGINE & REALTIME FIREBASE CONTROLLER
 */

// ==========================================
// 1. PARTICLES & SHATTER EFFECTS CANVAS
// ==========================================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

let width, height;
function resizeCanvas() {
    if (!canvas) return;
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

const sparkles = [];
const shards = [];
let particlesAnimId = null;

function animateParticles() {
    if (!ctx) return;
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

    if (sparkles.length > 0 || shards.length > 0) {
        particlesAnimId = requestAnimationFrame(animateParticles);
    } else {
        ctx.clearRect(0, 0, width, height);
        particlesAnimId = null;
    }
}

function spawnShatterBurst(screenX, screenY) {
    if (!ctx) return;
    const color = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)].glow;
    for (let i = 0; i < 24; i++) {
        shards.push(new TileShard(screenX, screenY, color));
    }
    for (let i = 0; i < 15; i++) {
        sparkles.push(new Sparkle(screenX, screenY, '#ffffff'));
    }
    if (!particlesAnimId) {
        particlesAnimId = requestAnimationFrame(animateParticles);
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
    } catch (e) { }
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
    } catch (e) { }
}

function playSuccessFanfare() {
    try {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            setTimeout(() => playTone(freq, 0.25), idx * 80);
        });
    } catch (e) { }
}


// ==========================================
// 3. TILE GRID & APP CONTROLLER
// ==========================================
const pageTitleEl = document.getElementById('pageTitle') || document.querySelector('.header .title');
const tileGrid = document.getElementById('tileGrid');
const tilesLeftEl = document.getElementById('tilesLeft');
const tilesBrokenEl = document.getElementById('tilesBroken');
const progressTextEl = document.getElementById('progressText');
const progressBarEl = document.getElementById('progressBar');
const winBanner = document.getElementById('winBanner');

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

// Spin Reel Modal Elements
const spinWheelModal = document.getElementById('spinWheelModal');
const spinModalCloseBtn = document.getElementById('spinModalCloseBtn');
const btnOpenSpinWheel = document.getElementById('btnOpenSpinWheel');
const btnRankings = document.getElementById('btnRankings');
const reelSingleSlot = document.getElementById('reelSingleSlot');
const reelSlotValue = document.getElementById('reelSlotValue');
const btnSpinReel = document.getElementById('btnSpinReel');
const wheelStatus = document.getElementById('wheelStatus');

// Player Name Modal & Storage
const playerNameModal = document.getElementById('playerNameModal');
const initialPlayerNameInput = document.getElementById('initialPlayerNameInput');
const btnSaveInitialPlayerName = document.getElementById('btnSaveInitialPlayerName');
const spinPlayerNameDisplay = document.getElementById('spinPlayerNameDisplay');
const playerNameError = document.getElementById('playerNameError');

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

// Side Toast Container Element
const sideToastContainer = document.getElementById('sideToastContainer');

// ==========================================
// DYNAMIC GRID & TOTAL TILES CONFIGURATION
// ==========================================
// GRID_COLS, GRID_ROWS, TOTAL_TILES are now imported from config.js
let totalTiles = TOTAL_TILES;
let brokenCount = 0;
let activeTileElement = null;
let activeTileIndex = -1;
let currentGameLoop = null;
let unlockedTileIndex = null; // Currently unlocked tile index granted by Spin Wheel
let completedModalTimeout = null;
let allTilesStateData = {};
let previousTilesData = null;

function updateLogoImageEffect() {
    const logoImg = document.getElementById('logoImage');
    if (!logoImg) return;
    if (totalTiles > 0 && brokenCount >= totalTiles) {
        if (!logoImg.src || !logoImg.src.includes('logo_trial.jpg')) {
            logoImg.src = 'logo_trial.jpg';
        }
        logoImg.classList.add('loaded');
        logoImg.style.display = 'block';
    } else {
        logoImg.classList.remove('loaded');
        logoImg.style.display = 'none';
    }
}

let savedPlayerName = localStorage.getItem('neon_player_name') || '';

function updatePlayerNameDisplay() {
    if (spinPlayerNameDisplay) {
        spinPlayerNameDisplay.innerText = savedPlayerName.trim() ? savedPlayerName : 'Not Set';
    }
}

function promptForPlayerName(onSuccessCallback) {
    if (savedPlayerName.trim()) {
        updatePlayerNameDisplay();
        if (onSuccessCallback) onSuccessCallback();
        return;
    }

    if (playerNameError) {
        playerNameError.innerText = '';
        playerNameError.classList.add('hidden');
    }
    initialPlayerNameInput.value = '';
    playerNameModal.classList.remove('hidden');
    setTimeout(() => initialPlayerNameInput.focus(), 200);

    const handleSave = () => {
        const val = initialPlayerNameInput.value.trim();
        if (!val) {
            if (playerNameError) {
                playerNameError.innerText = "Please enter a valid name!";
                playerNameError.classList.remove('hidden');
            }
            return;
        }

        btnSaveInitialPlayerName.disabled = true;
        btnSaveInitialPlayerName.innerText = "Checking...";

        checkIfPlayerNameTaken(val, (isTaken) => {
            btnSaveInitialPlayerName.disabled = false;
            btnSaveInitialPlayerName.innerText = "Save & Spin";

            if (isTaken) {
                if (playerNameError) {
                    playerNameError.innerText = `Name "${val}" is already taken! Please enter a different name.`;
                    playerNameError.classList.remove('hidden');
                }
                initialPlayerNameInput.focus();
                initialPlayerNameInput.select();
            } else {
                savedPlayerName = val;
                localStorage.setItem('neon_player_name', savedPlayerName);
                if (typeof registerPlayerNameInFirebase === 'function') {
                    registerPlayerNameInFirebase(savedPlayerName);
                }
                updatePlayerNameDisplay();
                playerNameModal.classList.add('hidden');
                if (onSuccessCallback) onSuccessCallback();
            }
        });
    };

    btnSaveInitialPlayerName.onclick = handleSave;
    initialPlayerNameInput.onkeydown = (e) => {
        if (e.key === 'Enter') handleSave();
    };
}

function showSideToast(message) {
    if (!sideToastContainer) return;
    playTone(600, 0.15);
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <div>
            <div class="toast-title">TILE CRACKED!</div>
            <div>${message}</div>
        </div>
    `;
    sideToastContainer.appendChild(toast);
    setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 5000);
}

// ==========================================
// 3.1 DYNAMIC GAME ALLOCATION & ICONS
// ==========================================
const BASE_GAME_TYPES = [
    { type: "dino", title: "Neon Chrome Dino", desc: "Press Space or Tap to jump over obstacles! Reach 1200 points to shatter the tile." },
    { type: "star_catcher", title: "Star Catcher", desc: "Click and collect 15 Pink Stars in 10 seconds!" },
    { type: "quick_click", title: "Reflex Clicker", desc: "Click 5 glowing targets correctly within 3.5 seconds!" },
    { type: "constellation", title: "Constellation Connect", desc: "Connect dots 1 to 8 in numerical order in 3.5s to form a heart!" },
    { type: "piano", title: "Magical Sound Piano", desc: "Listen to the note pattern and replicate it on the neon piano!" },
    { type: "magic_tiles", title: "Magic Rhythm Tiles", desc: "Music plays! Tap 12 falling neon tiles before they hit the bottom." },
    { type: "jar_shuffle", title: "Find the Star in the Jar", desc: "The star is put in a jar and shuffled. Pick the jar containing the star!" },
    { type: "fast_firefly", title: "Catch the Fast Firefly", desc: "Catch the super fast glowing firefly by clicking it!" },
    { type: "tower_stacker", title: "Tower Stacker", desc: "Stack sliding blocks up to height 10 cleanly!" },
    { type: "hanoi", title: "Tower of Hanoi", desc: "Solve Tower of Hanoi: move all 3 disks from Peg A to Peg C!" }
];

function getGameConfigForTile(tileIndex) {
    const gameIdx = tileIndex % BASE_GAME_TYPES.length;
    const base = BASE_GAME_TYPES[gameIdx];
    const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
    const cycle = Math.floor(tileIndex / BASE_GAME_TYPES.length);
    const suffix = cycle > 0 ? ` ${romanNumerals[cycle % romanNumerals.length] || (cycle + 1)}` : "";

    return {
        type: base.type,
        title: `${base.title}${suffix}`,
        desc: base.desc
    };
}

const TILE_ICONS = Array.from({ length: 50 }, (_, idx) => `${idx + 1}`);

// ==========================================
// 3.2 SINGLE ELEMENT SPINNER REEL ENGINE
// ==========================================
let isWheelSpinning = false;
let currentReelSlotIndex = 0;
let spinTimeoutId = null;

function getActiveWheelSlots() {
    const activeSlots = [];
    for (let i = 1; i <= TOTAL_TILES; i++) {
        const tileIdx = i - 1;
        const tileKey = `tile_${tileIdx}`;
        const tileInfo = allTilesStateData[tileKey];
        const targetTile = document.querySelector(`.tile[data-index="${tileIdx}"]`);
        const isBroken = (tileInfo && tileInfo.broken) || (targetTile && targetTile.classList.contains('broken'));

        if (!isBroken) {
            activeSlots.push({ type: 'number', value: i, label: `TILE #${i}` });
            activeSlots.push({ type: 'miss', value: null, label: 'MISS' });
        }
    }
    return activeSlots;
}

function renderSingleReelSlot(slot) {
    if (!reelSingleSlot || !reelSlotValue) return;
    if (!slot) {
        reelSlotValue.innerText = "ALL CLEAR";
        reelSingleSlot.classList.remove('miss-slot');
        return;
    }

    if (slot.type === 'miss') {
        reelSlotValue.innerText = "MISS";
        reelSingleSlot.classList.add('miss-slot');
    } else {
        reelSlotValue.innerText = `${slot.value}`;
        reelSingleSlot.classList.remove('miss-slot');
    }

    // Quick micro-tick animation
    reelSingleSlot.classList.add('spin-tick');
    setTimeout(() => {
        if (reelSingleSlot) reelSingleSlot.classList.remove('spin-tick');
    }, 70);
}

function updateReelDisplay() {
    const activeSlots = getActiveWheelSlots();
    if (activeSlots.length === 0) {
        renderSingleReelSlot(null);
        if (wheelStatus) {
            wheelStatus.innerText = "ALL TILES CLEARED!";
            wheelStatus.className = "game-status win";
        }
        return;
    }
    const previewSlot = activeSlots.find(s => s.type === 'number') || activeSlots[0];
    renderSingleReelSlot(previewSlot);
}

function startSpin() {
    if (isWheelSpinning) return;

    const activeSlots = getActiveWheelSlots();
    if (activeSlots.length === 0) {
        wheelStatus.innerText = "ALL TILES HAVE BEEN BROKEN!";
        wheelStatus.className = "game-status win";
        return;
    }

    // Check if player name is saved before spinning!
    if (!savedPlayerName.trim()) {
        promptForPlayerName(() => startSpin());
        return;
    }

    isWheelSpinning = true;
    wheelStatus.innerText = "Reel is spinning...";
    wheelStatus.className = "game-status";
    if (btnSpinReel) btnSpinReel.disabled = true;

    if (spinTimeoutId) clearTimeout(spinTimeoutId);

    // Pick a truly random landing target from the entire set of unbroken slots
    const targetSlot = activeSlots[Math.floor(Math.random() * activeSlots.length)];

    // Timing curve summing to 4.0s (4000ms) with gentle deceleration (~1/3s per option, no jitter)
    const stepDelays = [
        180, 190, 200, 210, 230, 250, 280, 320, 370, 440, 530, 640, 160
    ];
    const totalSteps = stepDelays.length;

    // Generate a diverse scroll sequence spanning across all areas of the board
    const spinSequence = [];
    let lastVal = null;
    for (let i = 0; i < totalSteps - 1; i++) {
        let randSlot;
        let attempts = 0;
        do {
            randSlot = activeSlots[Math.floor(Math.random() * activeSlots.length)];
            attempts++;
        } while (attempts < 10 && randSlot.value === lastVal);
        lastVal = randSlot.value;
        spinSequence.push(randSlot);
    }
    // Final step lands decisively on targetSlot!
    spinSequence.push(targetSlot);

    let step = 0;

    function stepReel() {
        const currentSlot = spinSequence[step];
        renderSingleReelSlot(currentSlot);

        // Gentle audio tick per step
        const toneFreq = currentSlot.type === 'miss' ? 380 : 620 + ((currentSlot.value || 1) % 6) * 30;
        playTone(toneFreq, 0.03);

        if (step >= totalSteps - 1) {
            // Spin completed (4.0s elapsed)
            isWheelSpinning = false;
            if (btnSpinReel) btnSpinReel.disabled = false;
            onSpinComplete(currentSlot);
        } else {
            const delay = stepDelays[step];
            step++;
            spinTimeoutId = setTimeout(stepReel, delay);
        }
    }

    stepReel();
}

function onSpinComplete(slotOrIdx) {
    const activeSlots = getActiveWheelSlots();
    if (activeSlots.length === 0) return;
    const slot = (typeof slotOrIdx === 'object' && slotOrIdx !== null) ? slotOrIdx : activeSlots[slotOrIdx];
    if (!slot) return;

    if (slot.type === 'miss') {
        unlockedTileIndex = null;
        wheelStatus.innerText = "MISS! No tile selected. Click SPIN to try again!";
        wheelStatus.className = "game-status lose";
        playTone(200, 0.25);
    } else {
        const tileNum = slot.value;
        const tileIdx = tileNum - 1;
        const tileKey = `tile_${tileIdx}`;
        const tileInfo = allTilesStateData[tileKey];
        const targetTile = document.querySelector(`.tile[data-index="${tileIdx}"]`);
        const isBroken = (tileInfo && tileInfo.broken) || (targetTile && targetTile.classList.contains('broken'));

        if (isBroken) {
            unlockedTileIndex = null;
            const solver = (tileInfo && tileInfo.solverName) ? tileInfo.solverName : "A player";
            wheelStatus.innerText = `Tile #${tileNum} is already cracked by ${solver}! Click SPIN to try again!`;
            wheelStatus.className = "game-status";
        } else {
            unlockedTileIndex = tileIdx;
            wheelStatus.innerText = `TILE #${tileNum} UNLOCKED! LAUNCHING CHALLENGE...`;
            wheelStatus.className = "game-status win";
            playSuccessFanfare();

            // Automatically open mini game modal after brief pause
            setTimeout(() => {
                closeSpinWheelModal();
                openMiniGameModal(tileIdx, targetTile);
            }, 700);
        }
    }
}

function openSpinWheelModal() {
    updatePlayerNameDisplay();
    spinWheelModal.classList.remove('hidden');
    updateReelDisplay();
}

function closeSpinWheelModal() {
    if (isWheelSpinning) return;
    spinWheelModal.classList.add('hidden');
}

btnOpenSpinWheel.addEventListener('click', openSpinWheelModal);
spinModalCloseBtn.addEventListener('click', closeSpinWheelModal);

if (btnSpinReel) {
    btnSpinReel.addEventListener('click', startSpin);
}

if (reelSingleSlot) {
    reelSingleSlot.addEventListener('click', () => {
        if (!isWheelSpinning) {
            startSpin();
        }
    });
}

function initGrid() {
    totalTiles = TOTAL_TILES;
    brokenCount = 0;
    if (winBanner) winBanner.classList.add('hidden');
    if (!tileGrid) return;
    tileGrid.innerHTML = '';
    tileGrid.style.setProperty('--grid-cols', GRID_COLS);
    tileGrid.style.setProperty('--grid-rows', GRID_ROWS);

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

        tile.appendChild(num);
        tile.appendChild(icon);

        tile.addEventListener('click', () => {
            const tileKey = `tile_${i}`;
            const tileInfo = allTilesStateData[tileKey];
            const isBroken = tile.classList.contains('broken') || tile.classList.contains('shattering') || (tileInfo && tileInfo.broken);

            if (isBroken) {
                const solver = (tileInfo && tileInfo.solverName) ? tileInfo.solverName : "A player";
                showAlreadyCompletedModal(i + 1, solver);
                return;
            }

            // Tile can only be played if selected via Horizontal Spinner
            if (unlockedTileIndex === i) {
                openMiniGameModal(i, tile);
            } else {
                wheelStatus.innerText = `TILE #${i + 1} IS LOCKED! SPIN TO SELECT!`;
                wheelStatus.className = "game-status lose";
                openSpinWheelModal();
            }
        });

        tileGrid.appendChild(tile);
    }

    updateStats();
}

let hasReceivedRealtimeData = false;

/**
 * Realtime Tile Sync callback (Receives data from Firebase or LocalStorage)
 */
function handleRealtimeUpdate(tilesData) {
    hasReceivedRealtimeData = true;

    // Check for newly cracked tiles to show live side toasts
    if (previousTilesData) {
        for (let i = 0; i < TOTAL_TILES; i++) {
            const key = `tile_${i}`;
            const prev = previousTilesData[key];
            const curr = tilesData ? tilesData[key] : null;
            if ((!prev || !prev.broken) && curr && curr.broken) {
                const solver = curr.solverName || "A Hunter";
                showSideToast(`<strong>${solver}</strong> cracked Tile #${i + 1}!`);
            }
        }
    }
    previousTilesData = tilesData || {};
    allTilesStateData = tilesData || {};

    // Check grid count in DOM matches TOTAL_TILES
    const tilesInDom = document.querySelectorAll('.tile');
    if (tilesInDom.length !== TOTAL_TILES) {
        initGrid();
    }

    let currentBroken = 0;
    const tiles = document.querySelectorAll('.tile');

    tiles.forEach((tileEl, idx) => {
        const key = `tile_${idx}`;
        const info = tilesData ? tilesData[key] : null;

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
    updateReelDisplay();

    if (totalTiles > 0 && brokenCount >= totalTiles) {
        triggerVictory();
    }
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

    // Reset unlocked tile authorization after shattering
    unlockedTileIndex = null;

    // Save broken state & solver name to Firebase Realtime Database
    setTileBrokenInFirebase(tileIdx, solverName);

    setTimeout(() => {
        tileElement.classList.remove('shattering');
        tileElement.classList.add('broken');

        updateStats();
        updateReelDisplay();

        if (brokenCount >= totalTiles) {
            triggerVictory();
        }
    }, 450);
}

function updateStats() {
    const remaining = totalTiles - brokenCount;
    tilesLeftEl.innerText = Math.max(0, remaining);
    if (tilesBrokenEl) tilesBrokenEl.innerText = brokenCount;

    const progressPct = Math.min(100, Math.round((brokenCount / totalTiles) * 100));
    progressTextEl.innerText = progressPct + '%';
    progressBarEl.style.width = progressPct + '%';

    updateLogoImageEffect();

    if (brokenCount >= totalTiles) {
        if (pageTitleEl) pageTitleEl.innerText = "GAME DEV & AR/VR";
        if (btnOpenSpinWheel) btnOpenSpinWheel.style.display = 'none';
        if (btnRankings) {
            btnRankings.style.flex = 'none';
            btnRankings.style.width = '100%';
            btnRankings.style.maxWidth = '280px';
            btnRankings.style.margin = '0 auto';
        }
    } else {
        if (pageTitleEl) pageTitleEl.innerText = "REVEAL";
        if (btnOpenSpinWheel) btnOpenSpinWheel.style.display = '';
        if (btnRankings) {
            btnRankings.style.flex = '1';
            btnRankings.style.width = 'auto';
            btnRankings.style.maxWidth = 'none';
            btnRankings.style.margin = '0';
        }
    }
}

function triggerVictory() {
    setTimeout(() => {
        if (winBanner) winBanner.classList.remove('hidden');
        playSuccessFanfare();
    }, 300);
}


// ==========================================
// 4. MINI-GAME MODAL LOGIC
// ==========================================
function openMiniGameModal(tileIndex, tileElement) {
    activeTileElement = tileElement;
    activeTileIndex = tileIndex;
    const config = getGameConfigForTile(tileIndex);

    modalTileBadge.innerText = `TILE ${tileIndex + 1}`;
    modalGameTitle.innerText = config.title;
    modalGameDesc.innerText = config.desc;
    minigameStatus.innerText = "Press 'Start Challenge' to begin!";
    minigameStatus.className = "game-status";

    // Ensure start button is visible and active
    btnStartGame.classList.remove('hidden');
    btnStartGame.style.display = 'inline-block';

    // Draw initial preview on canvas
    mgCtx.clearRect(0, 0, minigameCanvas.width, minigameCanvas.height);
    mgCtx.fillStyle = '#0a0a16';
    mgCtx.fillRect(0, 0, minigameCanvas.width, minigameCanvas.height);

    minigameModal.classList.remove('hidden');
}

function closeMiniGameModal() {
    minigameModal.classList.add('hidden');
    if (currentGameLoop) {
        cancelAnimationFrame(currentGameLoop);
        currentGameLoop = null;
    }
    clearCanvasInteraction(minigameCanvas);
}

function showAlreadyCompletedModal(tileNum, solverName) {
    completedTileBadge.innerText = `TILE #${tileNum}`;
    completedMessage.innerHTML = `This tile has already been unlocked by <strong>${solverName}</strong>!<br>Spin the reel to select an unsolved tile.`;
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
completedOkBtn.addEventListener('click', () => {
    closeCompletedModal();
    openSpinWheelModal();
});

btnStartGame.addEventListener('click', () => {
    btnStartGame.classList.add('hidden');
    btnStartGame.style.display = 'none';
    if (activeTileIndex >= 0) {
        const config = getGameConfigForTile(activeTileIndex);
        minigameStatus.innerText = "Game in progress...";
        startMiniGame(config.type);
    }
});

function onMiniGameWin() {
    if (currentGameLoop) {
        cancelAnimationFrame(currentGameLoop);
        currentGameLoop = null;
    }
    minigameStatus.innerText = "CHALLENGE CLEARED! Tile Unlocked";
    minigameStatus.className = "game-status win";
    btnStartGame.classList.add('hidden');

    playSuccessFanfare();

    setTimeout(() => {
        closeMiniGameModal();
        // Automatically crack tile using saved player name!
        if (activeTileElement) {
            const nameToUse = savedPlayerName.trim() ? savedPlayerName : "Anonymous Hunter";
            onClick(activeTileElement, nameToUse);
        }
    }, 1100);
}

function onMiniGameLose(reason = "Game Over!") {
    if (currentGameLoop) {
        cancelAnimationFrame(currentGameLoop);
        currentGameLoop = null;
    }
    // Must spin again if failed!
    unlockedTileIndex = null;
    minigameStatus.innerText = "OOPS... NICE TRY!! SPIN THE REEL AGAIN TO RETRY!";
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

// Startup Initialization & Realtime Subscription
initGrid();
updatePlayerNameDisplay();

listenToTileUpdates((tilesData) => {
    handleRealtimeUpdate(tilesData);
});


