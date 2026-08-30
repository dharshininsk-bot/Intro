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

// Spin Reel Modal Elements
const spinWheelModal = document.getElementById('spinWheelModal');
const spinModalCloseBtn = document.getElementById('spinModalCloseBtn');
const btnOpenSpinWheel = document.getElementById('btnOpenSpinWheel');
const btnRankings = document.getElementById('btnRankings');
const spinnerCanvas = document.getElementById('spinnerCanvas') || document.getElementById('wheelCanvas');
const sCtx = spinnerCanvas ? spinnerCanvas.getContext('2d') : null;
const btnSpinReel = document.getElementById('btnSpinReel');
const wheelStatus = document.getElementById('wheelStatus');

// Player Name Modal & Storage
const playerNameModal = document.getElementById('playerNameModal');
const initialPlayerNameInput = document.getElementById('initialPlayerNameInput');
const btnSaveInitialPlayerName = document.getElementById('btnSaveInitialPlayerName');
const spinPlayerNameDisplay = document.getElementById('spinPlayerNameDisplay');
const btnEditPlayerName = document.getElementById('btnEditPlayerName');
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
    const remainingRatio = totalTiles > 0 ? (totalTiles - brokenCount) / totalTiles : 0;
    // Enhanced non-linear blur scale (pow 0.6) so blur stays strong even when only 1 or 2 tiles are left
    const effectiveRatio = Math.pow(remainingRatio, 0.6);
    const blurPx = (effectiveRatio * 35).toFixed(2);
    const brightnessPct = ((1 - effectiveRatio * 0.75) * 100).toFixed(2);
    logoImg.style.filter = `blur(${blurPx}px) brightness(${brightnessPct}%)`;
}

let savedPlayerName = localStorage.getItem('neon_player_name') || '';

function updatePlayerNameDisplay() {
    if (spinPlayerNameDisplay) {
        spinPlayerNameDisplay.innerText = savedPlayerName.trim() ? savedPlayerName : 'Not Set';
    }
    if (btnEditPlayerName) {
        btnEditPlayerName.style.display = 'none'; // Name cannot be changed after saving
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
                playerNameError.innerText = "❌ Please enter a valid name!";
                playerNameError.classList.remove('hidden');
            }
            return;
        }

        btnSaveInitialPlayerName.disabled = true;
        btnSaveInitialPlayerName.innerText = "Checking... ⏳";

        checkIfPlayerNameTaken(val, (isTaken) => {
            btnSaveInitialPlayerName.disabled = false;
            btnSaveInitialPlayerName.innerText = "Save & Spin 🚀";

            if (isTaken) {
                if (playerNameError) {
                    playerNameError.innerText = `❌ Name "${val}" is already taken! Please enter a different name.`;
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
        <span class="toast-icon">🎉</span>
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

const TILE_ICONS = [
    '🦖', '⭐', '⚡', '✨', '🎹', '🎵', '🏺', '🪲', '🧱', '🧩',
    '🎶', '💫', '⚡', '🏢', '🏛️', '👑', '🔥', '💎', '🚀', '🔮',
    '🛸', '🎯', '🌟', '🕹️', '👾', '🌈', '🌌', '⚡', '🌀', '🏆',
    '🗝️', '🛡️', '⚔️', '🪄', '🎩', '🎲', '♟️', '🎳', '🎸', '🥁',
    '🎺', '🎻', '🪐', '☄️', '🌙', '☀️', '🌋', '🌊', '🌴'
];

// ==========================================
// 3.2 HORIZONTAL SPINNER REEL ENGINE
// ==========================================
function getActiveWheelSlots() {
    const activeSlots = [];
    for (let i = 1; i <= TOTAL_TILES; i++) {
        const tileIdx = i - 1;
        const tileKey = `tile_${tileIdx}`;
        const tileInfo = allTilesStateData[tileKey];
        const targetTile = document.querySelector(`.tile[data-index="${tileIdx}"]`);
        const isBroken = (tileInfo && tileInfo.broken) || (targetTile && targetTile.classList.contains('broken'));

        if (!isBroken) {
            activeSlots.push({ type: 'number', value: i, label: `${i}` });
            activeSlots.push({ type: 'miss', value: null, label: 'MISS' });
        }
    }
    return activeSlots;
}

let isWheelSpinning = false;
let scrollX = 0;
let scrollSpeed = 0;
let wheelAnimId = null;
let lastSegmentTickIndex = -1;

const CARD_WIDTH = 96;
const CARD_GAP = 12;
const STEP = CARD_WIDTH + CARD_GAP; // 108px per card slot

function drawHorizontalSpinner() {
    if (!spinnerCanvas || !sCtx) return;
    const width = spinnerCanvas.width;
    const height = spinnerCanvas.height;
    const cx = width / 2;
    const cy = height / 2;

    sCtx.clearRect(0, 0, width, height);

    const activeSlots = getActiveWheelSlots();
    const totalSlots = activeSlots.length;

    if (totalSlots === 0) {
        sCtx.save();
        sCtx.fillStyle = '#0a0d24';
        sCtx.strokeStyle = '#ffe600';
        sCtx.lineWidth = 3;
        sCtx.beginPath();
        if (sCtx.roundRect) {
            sCtx.roundRect(10, 10, width - 20, height - 20, 12);
        } else {
            sCtx.rect(10, 10, width - 20, height - 20);
        }
        sCtx.fill();
        sCtx.stroke();

        sCtx.fillStyle = '#ffe600';
        sCtx.font = 'bold 18px "Orbitron", sans-serif';
        sCtx.textAlign = 'center';
        sCtx.textBaseline = 'middle';
        sCtx.fillText('ALL TILES CLEARED! 🏆', cx, cy);
        sCtx.restore();
        return;
    }

    const trackLength = totalSlots * STEP;
    const normalizedScroll = ((scrollX % trackLength) + trackLength) % trackLength;

    const visibleCount = Math.ceil(width / STEP) + 3;
    const centerSlotFloat = normalizedScroll / STEP;
    const startIdx = Math.floor(centerSlotFloat) - Math.floor(visibleCount / 2);

    for (let k = startIdx; k <= startIdx + visibleCount; k++) {
        const slotIndex = ((k % totalSlots) + totalSlots) % totalSlots;
        const slot = activeSlots[slotIndex];
        const itemCenterX = cx + (k * STEP - normalizedScroll);

        if (itemCenterX < -CARD_WIDTH || itemCenterX > width + CARD_WIDTH) continue;

        const distFromCenter = Math.abs(itemCenterX - cx);
        const isCloseToCenter = distFromCenter < STEP / 2;

        sCtx.save();
        sCtx.translate(itemCenterX, cy);

        const cardW = CARD_WIDTH;
        const cardH = 92;
        const cardRadius = 10;

        if (slot.type === 'number') {
            const colorObj = NEON_COLORS[(slot.value - 1) % NEON_COLORS.length];

            sCtx.fillStyle = isCloseToCenter ? 'rgba(18, 22, 50, 0.95)' : 'rgba(12, 15, 36, 0.85)';
            sCtx.strokeStyle = isCloseToCenter ? colorObj.glow : colorObj.fill.replace('0.4', '0.7');
            sCtx.lineWidth = isCloseToCenter ? 2.5 : 1.2;
            if (isCloseToCenter) {
                sCtx.shadowColor = colorObj.glow;
                sCtx.shadowBlur = 14;
            }

            sCtx.beginPath();
            if (sCtx.roundRect) {
                sCtx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, cardRadius);
            } else {
                sCtx.rect(-cardW / 2, -cardH / 2, cardW, cardH);
            }
            sCtx.fill();
            sCtx.stroke();

            sCtx.shadowBlur = 0;
            sCtx.textAlign = 'center';
            sCtx.textBaseline = 'middle';

            sCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            sCtx.font = '600 10px "Orbitron", sans-serif';
            sCtx.fillText('TILE', 0, -26);

            sCtx.fillStyle = '#ffffff';
            sCtx.font = 'bold 22px "Orbitron", sans-serif';
            sCtx.shadowColor = colorObj.glow;
            sCtx.shadowBlur = 6;
            sCtx.fillText(`#${slot.value}`, 0, -2);

            sCtx.shadowBlur = 0;
            sCtx.font = '16px "Orbitron", sans-serif';
            sCtx.fillText(TILE_ICONS[(slot.value - 1) % TILE_ICONS.length] || '⭐', 0, 24);
        } else {
            sCtx.fillStyle = isCloseToCenter ? 'rgba(32, 10, 24, 0.95)' : 'rgba(18, 8, 18, 0.85)';
            sCtx.strokeStyle = isCloseToCenter ? '#ff007f' : 'rgba(255, 0, 127, 0.45)';
            sCtx.lineWidth = isCloseToCenter ? 2.5 : 1.2;
            if (isCloseToCenter) {
                sCtx.shadowColor = '#ff007f';
                sCtx.shadowBlur = 14;
            }

            sCtx.beginPath();
            if (sCtx.roundRect) {
                sCtx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, cardRadius);
            } else {
                sCtx.rect(-cardW / 2, -cardH / 2, cardW, cardH);
            }
            sCtx.fill();
            sCtx.stroke();

            sCtx.shadowBlur = 0;
            sCtx.textAlign = 'center';
            sCtx.textBaseline = 'middle';

            sCtx.fillStyle = 'rgba(255, 0, 127, 0.6)';
            sCtx.font = '600 10px "Orbitron", sans-serif';
            sCtx.fillText('NO TILE', 0, -24);

            sCtx.fillStyle = '#ff007f';
            sCtx.font = 'bold 18px "Orbitron", sans-serif';
            sCtx.shadowColor = '#ff007f';
            sCtx.shadowBlur = 8;
            sCtx.fillText('MISS', 0, -2);

            sCtx.shadowBlur = 0;
            sCtx.font = '18px "Orbitron", sans-serif';
            sCtx.fillText('❌', 0, 24);
        }

        sCtx.restore();
    }

    // Vignette / Shadow edges
    const leftGrad = sCtx.createLinearGradient(0, 0, 60, 0);
    leftGrad.addColorStop(0, 'rgba(6, 8, 24, 0.95)');
    leftGrad.addColorStop(1, 'rgba(6, 8, 24, 0)');
    sCtx.fillStyle = leftGrad;
    sCtx.fillRect(0, 0, 60, height);

    const rightGrad = sCtx.createLinearGradient(width - 60, 0, width, 0);
    rightGrad.addColorStop(0, 'rgba(6, 8, 24, 0)');
    rightGrad.addColorStop(1, 'rgba(6, 8, 24, 0.95)');
    sCtx.fillStyle = rightGrad;
    sCtx.fillRect(width - 60, 0, 60, height);
}

function animateHorizontalSpinner() {
    if (!isWheelSpinning) return;

    const activeSlots = getActiveWheelSlots();
    const totalSlots = activeSlots.length;

    if (totalSlots === 0) {
        isWheelSpinning = false;
        return;
    }

    scrollX += scrollSpeed;
    scrollSpeed *= 0.983;

    // Tick SFX per card passing center
    const currentSegmentIdx = Math.floor((scrollX + STEP / 2) / STEP);
    if (currentSegmentIdx !== lastSegmentTickIndex) {
        lastSegmentTickIndex = currentSegmentIdx;
        playTone(650 + Math.min(300, scrollSpeed * 8), 0.02);
    }

    drawHorizontalSpinner();

    if (scrollSpeed <= 0.35) {
        scrollX = Math.round(scrollX / STEP) * STEP;
        scrollSpeed = 0;
        isWheelSpinning = false;
        drawHorizontalSpinner();

        const trackLength = totalSlots * STEP;
        const finalNormalized = ((scrollX % trackLength) + trackLength) % trackLength;
        const landedIndex = Math.round(finalNormalized / STEP) % totalSlots;
        onSpinComplete(landedIndex);
    } else {
        wheelAnimId = requestAnimationFrame(animateHorizontalSpinner);
    }
}

function startSpin() {
    if (isWheelSpinning) return;

    const activeSlots = getActiveWheelSlots();
    if (activeSlots.length === 0) {
        wheelStatus.innerText = "🎉 ALL TILES HAVE BEEN BROKEN!";
        wheelStatus.className = "game-status win";
        return;
    }

    // Check if player name is saved before spinning!
    if (!savedPlayerName.trim()) {
        promptForPlayerName(() => startSpin());
        return;
    }

    isWheelSpinning = true;
    scrollSpeed = Math.random() * 22 + 40; // Initial velocity
    wheelStatus.innerText = "Reel is scrolling... 🎰";
    wheelStatus.className = "game-status";

    if (wheelAnimId) cancelAnimationFrame(wheelAnimId);
    animateHorizontalSpinner();
}

function onSpinComplete(landedSegmentIdx) {
    const activeSlots = getActiveWheelSlots();
    if (activeSlots.length === 0) return;
    const slot = activeSlots[landedSegmentIdx];
    if (!slot) return;

    if (slot.type === 'miss') {
        unlockedTileIndex = null;
        wheelStatus.innerText = "❌ MISS! No tile selected. Click SPIN to try again!";
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
            wheelStatus.innerText = `✨ TILE #${tileNum} UNLOCKED! LAUNCHING CHALLENGE... 🚀`;
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
    drawHorizontalSpinner();
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

// Spinner Canvas click event to trigger spin by clicking anywhere on the reel
if (spinnerCanvas) {
    spinnerCanvas.style.cursor = 'pointer';
    spinnerCanvas.addEventListener('click', () => {
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
                wheelStatus.innerText = `🔒 TILE #${i + 1} IS LOCKED! SPIN TO SELECT!`;
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
    drawHorizontalSpinner();

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
        drawSpinWheel();

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
        if (pageTitleEl) pageTitleEl.innerText = "AR/VR & GAME DEV";
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
        for (let i = 0; i < 8; i++) {
            butterflies.push(new NeonButterfly());
        }
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
    completedMessage.innerHTML = `This tile has already been unlocked by <strong>${solverName}</strong>! 🎉<br>Spin the reel to select an unsolved tile.`;
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
    minigameStatus.innerText = "✨ CHALLENGE CLEARED! Tile Unlocked ✨";
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


