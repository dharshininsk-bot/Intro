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

// Spin Wheel Modal Elements
const spinWheelModal = document.getElementById('spinWheelModal');
const spinModalCloseBtn = document.getElementById('spinModalCloseBtn');
const btnOpenSpinWheel = document.getElementById('btnOpenSpinWheel');
const wheelCanvas = document.getElementById('wheelCanvas');
const wCtx = wheelCanvas.getContext('2d');
const wheelStatus = document.getElementById('wheelStatus');
const btnSpinWheel = document.getElementById('btnSpinWheel');
const btnPlayUnlockedTile = document.getElementById('btnPlayUnlockedTile');

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

let totalTiles = 16;
let brokenCount = 0;
let activeTileElement = null;
let activeTileIndex = -1;
let currentGameLoop = null;
let unlockedTileIndex = null; // Currently unlocked tile index granted by Spin Wheel
let completedModalTimeout = null;
let allTilesStateData = {};
let previousTilesData = null;

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
// 3.1 SPIN WHEEL ENGINE (DYNAMIC: REMOVES BROKEN TILES & MATCHING MISSES)
// ==========================================
function getActiveWheelSlots() {
    const activeSlots = [];
    for (let i = 1; i <= 16; i++) {
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
let wheelAngle = 0;
let wheelSpeed = 0;
let wheelAnimId = null;
let lastSegmentTickIndex = -1;

function drawSpinWheel() {
    if (!wheelCanvas) return;
    const width = wheelCanvas.width;
    const height = wheelCanvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const outerRadius = width / 2 - 10;
    const innerRadius = 38;

    wCtx.clearRect(0, 0, width, height);

    const activeSlots = getActiveWheelSlots();
    const totalSlots = activeSlots.length;

    if (totalSlots === 0) {
        wCtx.save();
        wCtx.fillStyle = '#0a0d24';
        wCtx.strokeStyle = '#ffe600';
        wCtx.lineWidth = 3;
        wCtx.shadowColor = '#ffe600';
        wCtx.shadowBlur = 12;
        wCtx.beginPath();
        wCtx.arc(cx, cy, outerRadius, 0, Math.PI * 2);
        wCtx.fill();
        wCtx.stroke();

        wCtx.fillStyle = '#ffe600';
        wCtx.font = 'bold 16px "Orbitron", sans-serif';
        wCtx.textAlign = 'center';
        wCtx.textBaseline = 'middle';
        wCtx.fillText('ALL CLEARED! 🏆', cx, cy);
        wCtx.restore();
        return;
    }

    const arcSize = (Math.PI * 2) / totalSlots;

    // Outer Glow Ring
    wCtx.save();
    wCtx.shadowColor = '#00f3ff';
    wCtx.shadowBlur = 16;
    wCtx.strokeStyle = '#00f3ff';
    wCtx.lineWidth = 4;
    wCtx.beginPath();
    wCtx.arc(cx, cy, outerRadius, 0, Math.PI * 2);
    wCtx.stroke();
    wCtx.restore();

    // Render Slices
    for (let i = 0; i < totalSlots; i++) {
        const slot = activeSlots[i];
        const startAngle = wheelAngle + i * arcSize - Math.PI / 2;
        const endAngle = startAngle + arcSize;
        const midAngle = startAngle + arcSize / 2;

        wCtx.save();
        wCtx.beginPath();
        wCtx.moveTo(cx, cy);
        wCtx.arc(cx, cy, outerRadius, startAngle, endAngle);
        wCtx.closePath();

        if (slot.type === 'number') {
            const numIndex = (slot.value - 1) % NEON_COLORS.length;
            wCtx.fillStyle = NEON_COLORS[numIndex].fill.replace('0.4', '0.85');
            wCtx.strokeStyle = NEON_COLORS[numIndex].glow;
        } else {
            wCtx.fillStyle = 'rgba(15, 18, 42, 0.95)';
            wCtx.strokeStyle = 'rgba(255, 0, 127, 0.4)';
        }
        wCtx.fill();
        wCtx.lineWidth = 1;
        wCtx.stroke();

        // Draw Labels
        wCtx.translate(cx, cy);
        wCtx.rotate(midAngle);
        wCtx.textAlign = 'right';
        wCtx.textBaseline = 'middle';

        if (slot.type === 'number') {
            wCtx.fillStyle = '#ffffff';
            wCtx.font = 'bold 12px "Orbitron", sans-serif';
            wCtx.shadowColor = '#000';
            wCtx.shadowBlur = 4;
            wCtx.fillText(slot.label, outerRadius - 12, 0);
        } else {
            wCtx.fillStyle = '#ff007f';
            wCtx.font = 'bold 9px "Orbitron", sans-serif';
            wCtx.fillText('MISS ❌', outerRadius - 10, 0);
        }

        wCtx.restore();
    }

    // Center Hub
    wCtx.save();
    wCtx.fillStyle = '#0a0d24';
    wCtx.strokeStyle = '#ffe600';
    wCtx.lineWidth = 3;
    wCtx.shadowColor = '#ffe600';
    wCtx.shadowBlur = 12;
    wCtx.beginPath();
    wCtx.arc(cx, cy, innerRadius, 0, Math.PI * 2);
    wCtx.fill();
    wCtx.stroke();

    wCtx.fillStyle = '#ffe600';
    wCtx.font = '900 11px "Orbitron", sans-serif';
    wCtx.textAlign = 'center';
    wCtx.textBaseline = 'middle';
    wCtx.fillText('SPIN', cx, cy);
    wCtx.restore();
}

function animateSpinWheel() {
    if (!isWheelSpinning) return;

    const activeSlots = getActiveWheelSlots();
    const totalSlots = activeSlots.length;

    if (totalSlots === 0) {
        isWheelSpinning = false;
        return;
    }

    const arcSize = (Math.PI * 2) / totalSlots;

    wheelAngle += wheelSpeed;
    wheelSpeed *= 0.984; // Smooth friction

    // Tick SFX per segment pass
    const normalizedAngle = (Math.PI * 2 - (wheelAngle % (Math.PI * 2))) % (Math.PI * 2);
    const currentSegmentIdx = Math.floor(normalizedAngle / arcSize) % totalSlots;

    if (currentSegmentIdx !== lastSegmentTickIndex) {
        lastSegmentTickIndex = currentSegmentIdx;
        playTone(700, 0.02);
    }

    drawSpinWheel();

    if (wheelSpeed <= 0.002) {
        wheelSpeed = 0;
        isWheelSpinning = false;
        onSpinComplete(currentSegmentIdx);
    } else {
        wheelAnimId = requestAnimationFrame(animateSpinWheel);
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
    wheelSpeed = Math.random() * 0.35 + 0.45; // Initial rotational force
    wheelStatus.innerText = "Wheel is spinning... 🌀";
    wheelStatus.className = "game-status";
    btnSpinWheel.classList.add('hidden');
    btnPlayUnlockedTile.classList.add('hidden');

    if (wheelAnimId) cancelAnimationFrame(wheelAnimId);
    animateSpinWheel();
}

function onSpinComplete(landedSegmentIdx) {
    const activeSlots = getActiveWheelSlots();
    if (activeSlots.length === 0) return;
    const slot = activeSlots[landedSegmentIdx];
    if (!slot) return;

    if (slot.type === 'miss') {
        unlockedTileIndex = null;
        wheelStatus.innerText = "❌ MISS! No tile selected. Spin again!";
        wheelStatus.className = "game-status lose";
        playTone(200, 0.25);
        btnSpinWheel.innerText = "SPIN AGAIN 🎡";
        btnSpinWheel.classList.remove('hidden');
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
            wheelStatus.innerText = `Tile #${tileNum} is already cracked by ${solver}! Spin again!`;
            wheelStatus.className = "game-status";
            btnSpinWheel.innerText = "SPIN AGAIN 🎡";
            btnSpinWheel.classList.remove('hidden');
        } else {
            unlockedTileIndex = tileIdx;
            wheelStatus.innerText = `✨ TILE #${tileNum} UNLOCKED! ✨`;
            wheelStatus.className = "game-status win";
            playSuccessFanfare();
            btnPlayUnlockedTile.innerText = `PLAY TILE #${tileNum} 🚀`;
            btnPlayUnlockedTile.classList.remove('hidden');
        }
    }
}

function openSpinWheelModal() {
    updatePlayerNameDisplay();
    spinWheelModal.classList.remove('hidden');
    drawSpinWheel();
}

function closeSpinWheelModal() {
    if (isWheelSpinning) return;
    spinWheelModal.classList.add('hidden');
}

btnSpinWheel.addEventListener('click', startSpin);
btnOpenSpinWheel.addEventListener('click', openSpinWheelModal);
spinModalCloseBtn.addEventListener('click', closeSpinWheelModal);

btnPlayUnlockedTile.addEventListener('click', () => {
    if (unlockedTileIndex !== null) {
        const targetTile = document.querySelector(`.tile[data-index="${unlockedTileIndex}"]`);
        closeSpinWheelModal();
        openMiniGameModal(unlockedTileIndex, targetTile);
    }
});


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
            const tileKey = `tile_${i}`;
            const tileInfo = allTilesStateData[tileKey];
            const isBroken = tile.classList.contains('broken') || tile.classList.contains('shattering') || (tileInfo && tileInfo.broken);

            if (isBroken) {
                const solver = (tileInfo && tileInfo.solverName) ? tileInfo.solverName : "A player";
                showAlreadyCompletedModal(i + 1, solver);
                return;
            }

            // Tile can only be played if selected via Spin Wheel
            if (unlockedTileIndex === i) {
                openMiniGameModal(i, tile);
            } else {
                wheelStatus.innerText = `🔒 TILE #${i + 1} IS LOCKED! SPIN THE WHEEL TO SELECT!`;
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
        for (let i = 0; i < 16; i++) {
            const key = `tile_${i}`;
            const prev = previousTilesData[key];
            const curr = tilesData[key];
            if ((!prev || !prev.broken) && curr && curr.broken) {
                const solver = curr.solverName || "A Hunter";
                showSideToast(`<strong>${solver}</strong> cracked Tile #${i + 1}!`);
            }
        }
    }
    previousTilesData = tilesData || {};
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
    drawSpinWheel();

    if (brokenCount >= totalTiles) {
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
// 4. MINI-GAME MODAL LOGIC
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
    
    // Ensure start button is visible and active
    btnStartGame.classList.remove('hidden');
    btnStartGame.style.display = 'inline-block';

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
    // Revoke unlocked tile access if player closes modal without winning
    unlockedTileIndex = null;
    minigameModal.classList.add('hidden');
}

function showAlreadyCompletedModal(tileNumber, solverName) {
    closeMiniGameModal(); // Ensure game canvas/modal is completely hidden
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
completedOkBtn.addEventListener('click', () => {
    closeCompletedModal();
    openSpinWheelModal();
});

btnStartGame.addEventListener('click', () => {
    btnStartGame.classList.add('hidden');
    btnStartGame.style.display = 'none';
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
    minigameStatus.innerText = "OOPS... NICE TRY!! SPIN THE WHEEL AGAIN TO RETRY!";
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

// Display Spin Wheel Modal on Link Open
setTimeout(() => {
    openSpinWheelModal();
}, 300);


