/**
 * MINI-GAMES COLLECTION FILE (minigames.js)
 * Stores logic for all 10 interactive mini-games with Mobile Touch & Responsive Support
 */

// Universal Helper for Mouse & Touch Coordinates
function getCanvasCoords(e, canvasEl) {
    const rect = canvasEl.getBoundingClientRect();
    let clientX = e.clientX;
    let clientY = e.clientY;

    if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
    }

    const scaleX = canvasEl.width / rect.width;
    const scaleY = canvasEl.height / rect.height;

    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

// Helper to bind both mouse and touch events
function bindCanvasInteraction(canvasEl, handler) {
    const wrappedHandler = (e) => {
        if (e.type === 'touchstart') {
            e.preventDefault();
        }
        const coords = getCanvasCoords(e, canvasEl);
        handler(coords, e);
    };

    canvasEl.onmousedown = wrappedHandler;
    canvasEl.ontouchstart = wrappedHandler;
}

function clearCanvasInteraction(canvasEl) {
    canvasEl.onmousedown = null;
    canvasEl.ontouchstart = null;
}


// ==========================================
// 1. NEON CHROME DINO (IRREGULAR OBSTACLES)
// ==========================================
function runDinoGame() {
    let score = 0;
    const targetScore = 1200; // Preserved user edit
    const groundY = 190;

    const dino = {
        x: 50,
        y: groundY - 30,
        vy: 0,
        width: 24,
        height: 30,
        isJumping: false
    };

    const obstacles = [];
    let frameCount = 0;

    // Irregular interval tracking
    let nextObstacleFrame = 50;

    function jump() {
        if (!dino.isJumping) {
            dino.vy = -11.5;
            dino.isJumping = true;
            playTone(400, 0.1);
        }
    }

    bindCanvasInteraction(minigameCanvas, () => jump());
    window.onkeydown = (e) => {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            e.preventDefault();
            jump();
        }
    };

    function loop() {
        frameCount++;
        mgCtx.clearRect(0, 0, minigameCanvas.width, minigameCanvas.height);

        // Update Dino Physics
        dino.vy += 0.65;
        dino.y += dino.vy;

        if (dino.y >= groundY - dino.height) {
            dino.y = groundY - dino.height;
            dino.vy = 0;
            dino.isJumping = false;
        }

        // Spawn Irregular Obstacles
        if (frameCount >= nextObstacleFrame) {
            obstacles.push({
                x: minigameCanvas.width + 10,
                width: 16 + Math.random() * 16,
                height: 22 + Math.random() * 16,
                speed: 4.5 + Math.random() * 1.5
            });
            // Irregular random gap between 45 and 115 frames
            nextObstacleFrame = frameCount + Math.floor(Math.random() * 70 + 45);
        }

        score += 1;
        minigameStatus.innerText = `Score: ${score} / ${targetScore} (Tap / Space to Jump)`;
        minigameStatus.className = "game-status";

        if (score >= targetScore) {
            clearCanvasInteraction(minigameCanvas);
            window.onkeydown = null;
            onMiniGameWin();
            return;
        }

        // Draw Ground
        mgCtx.strokeStyle = '#00f3ff';
        mgCtx.lineWidth = 2;
        mgCtx.shadowColor = '#00f3ff';
        mgCtx.shadowBlur = 10;
        mgCtx.beginPath();
        mgCtx.moveTo(0, groundY);
        mgCtx.lineTo(minigameCanvas.width, groundY);
        mgCtx.stroke();

        // Draw Dino
        mgCtx.fillStyle = '#ff007f';
        mgCtx.shadowColor = '#ff007f';
        mgCtx.shadowBlur = 12;
        mgCtx.fillRect(dino.x, dino.y, dino.width, dino.height);
        mgCtx.fillStyle = '#ffffff';
        mgCtx.fillRect(dino.x + 14, dino.y + 6, 4, 4);

        // Move & Draw Obstacles
        for (let i = obstacles.length - 1; i >= 0; i--) {
            const obs = obstacles[i];
            obs.x -= obs.speed;

            mgCtx.fillStyle = '#ffe600';
            mgCtx.shadowColor = '#ffe600';
            mgCtx.shadowBlur = 12;
            mgCtx.fillRect(obs.x, groundY - obs.height, obs.width, obs.height);

            // Collision Check
            if (
                dino.x < obs.x + obs.width &&
                dino.x + dino.width > obs.x &&
                dino.y < groundY &&
                dino.y + dino.height > groundY - obs.height
            ) {
                clearCanvasInteraction(minigameCanvas);
                window.onkeydown = null;
                onMiniGameLose(`Collided! Final Score: ${score}. Reach ${targetScore} to win.`);
                return;
            }

            if (obs.x + obs.width < 0) {
                obstacles.splice(i, 1);
            }
        }

        currentGameLoop = requestAnimationFrame(loop);
    }

    loop();
}

// ==========================================
// 2. STAR CATCHER (15 Pink Stars in 10s)
// ==========================================
function runStarCatcherGame() {
    let score = 0;
    const targetScore = 15;
    let timeLeft = 10.0; // Preserved user edit
    const stars = [];
    let frameCount = 0;

    bindCanvasInteraction(minigameCanvas, (coords) => {
        for (let i = stars.length - 1; i >= 0; i--) {
            const s = stars[i];
            const dist = Math.hypot(coords.x - s.x, coords.y - s.y);
            if (dist <= s.size + 14) {
                if (s.type === 'pink') {
                    score++;
                    playTone(600, 0.15);
                } else if (s.type === 'cyan') {
                    timeLeft = Math.max(0, timeLeft - 1.5);
                    playTone(200, 0.15);
                }
                stars.splice(i, 1);
                break;
            }
        }
    });

    function loop() {
        frameCount++;
        timeLeft -= 1 / 60;
        mgCtx.clearRect(0, 0, minigameCanvas.width, minigameCanvas.height);

        if (score >= targetScore) {
            clearCanvasInteraction(minigameCanvas);
            onMiniGameWin();
            return;
        }

        if (timeLeft <= 0) {
            clearCanvasInteraction(minigameCanvas);
            onMiniGameLose(`Time ran out! Collected ${score}/15 Pink Stars.`);
            return;
        }

        minigameStatus.innerText = `Pink Stars: ${score}/${targetScore} | Time Left: ${Math.max(0, timeLeft).toFixed(1)}s`;
        minigameStatus.className = "game-status";

        if (frameCount % 20 === 0) {
            const types = ['pink', 'pink', 'pink', 'cyan', 'gold'];
            const type = types[Math.floor(Math.random() * types.length)];
            let color = '#ff007f';
            if (type === 'cyan') color = '#00f3ff';
            if (type === 'gold') color = '#ffe600';

            stars.push({
                x: 25 + Math.random() * (minigameCanvas.width - 50),
                y: -10,
                vy: 2.0 + Math.random() * 2.5,
                size: 14 + Math.random() * 6,
                type: type,
                color: color
            });
        }

        for (let i = stars.length - 1; i >= 0; i--) {
            const s = stars[i];
            s.y += s.vy;

            mgCtx.save();
            mgCtx.fillStyle = s.color;
            mgCtx.shadowColor = s.color;
            mgCtx.shadowBlur = 12;
            mgCtx.font = `${s.size * 1.4}px sans-serif`;
            mgCtx.textAlign = 'center';
            mgCtx.textBaseline = 'middle';
            mgCtx.fillText('★', s.x, s.y);
            mgCtx.restore();

            if (s.y > minigameCanvas.height + 20) {
                stars.splice(i, 1);
            }
        }

        currentGameLoop = requestAnimationFrame(loop);
    }

    loop();
}

// ==========================================
// 3. QUICK CLICK REFLEX (5 Targets in 3.5s)
// ==========================================
function runQuickClickGame() {
    let targetsHit = 0;
    const totalTargets = 5; // Preserved user edit
    let timeLeft = 3.5;
    let currentTarget = null;

    function spawnTarget() {
        currentTarget = {
            x: 50 + Math.random() * (minigameCanvas.width - 100),
            y: 50 + Math.random() * (minigameCanvas.height - 100),
            radius: 26
        };
    }

    spawnTarget();

    bindCanvasInteraction(minigameCanvas, (coords) => {
        if (!currentTarget) return;

        const dist = Math.hypot(coords.x - currentTarget.x, coords.y - currentTarget.y);
        if (dist <= currentTarget.radius + 6) {
            targetsHit++;
            playTone(700 + targetsHit * 120, 0.15);
            if (targetsHit >= totalTargets) {
                clearCanvasInteraction(minigameCanvas);
                onMiniGameWin();
            } else {
                spawnTarget();
            }
        }
    });

    function loop() {
        timeLeft -= 1 / 60;
        mgCtx.clearRect(0, 0, minigameCanvas.width, minigameCanvas.height);

        if (timeLeft <= 0) {
            clearCanvasInteraction(minigameCanvas);
            onMiniGameLose(`Time's up! Hit ${targetsHit}/${totalTargets} targets.`);
            return;
        }

        minigameStatus.innerText = `Hit Targets: ${targetsHit}/${totalTargets} | Time Left: ${Math.max(0, timeLeft).toFixed(2)}s`;
        minigameStatus.className = "game-status";

        if (currentTarget) {
            mgCtx.strokeStyle = '#00f3ff';
            mgCtx.lineWidth = 4;
            mgCtx.shadowColor = '#00f3ff';
            mgCtx.shadowBlur = 18;
            mgCtx.beginPath();
            mgCtx.arc(currentTarget.x, currentTarget.y, currentTarget.radius, 0, Math.PI * 2);
            mgCtx.stroke();

            mgCtx.fillStyle = '#ff007f';
            mgCtx.beginPath();
            mgCtx.arc(currentTarget.x, currentTarget.y, currentTarget.radius * 0.5, 0, Math.PI * 2);
            mgCtx.fill();

            mgCtx.fillStyle = '#ffffff';
            mgCtx.font = 'bold 10px Orbitron';
            mgCtx.textAlign = 'center';
            mgCtx.textBaseline = 'middle';
            mgCtx.fillText('TAP!', currentTarget.x, currentTarget.y);
        }

        currentGameLoop = requestAnimationFrame(loop);
    }

    loop();
}

// ==========================================
// 4. CONSTELLATION CONNECT (LAST LINE FIXED)
// ==========================================
function runConstellationGame() {
    let timeLeft = 3.5; // Preserved user edit
    let nextDotIndex = 0;
    let isFinished = false;

    const dots = [
        { id: 1, x: 220, y: 205 },
        { id: 2, x: 140, y: 150 },
        { id: 3, x: 120, y: 90 },
        { id: 4, x: 170, y: 55 },
        { id: 5, x: 220, y: 95 },
        { id: 6, x: 270, y: 55 },
        { id: 7, x: 320, y: 90 },
        { id: 8, x: 300, y: 150 }
    ];

    bindCanvasInteraction(minigameCanvas, (coords) => {
        if (isFinished) return;
        const targetDot = dots[nextDotIndex];
        if (targetDot) {
            const dist = Math.hypot(coords.x - targetDot.x, coords.y - targetDot.y);
            if (dist <= 26) {
                nextDotIndex++;
                playTone(400 + nextDotIndex * 80, 0.15);

                // When last dot (Dot 8) is clicked
                if (nextDotIndex >= dots.length) {
                    isFinished = true;
                    clearCanvasInteraction(minigameCanvas);
                    // Pause briefly so closing line rendering is shown visually!
                    setTimeout(() => {
                        onMiniGameWin();
                    }, 550);
                }
            }
        }
    });

    function loop() {
        if (!isFinished) {
            timeLeft -= 1 / 60;
        }
        mgCtx.clearRect(0, 0, minigameCanvas.width, minigameCanvas.height);

        if (timeLeft <= 0 && !isFinished) {
            clearCanvasInteraction(minigameCanvas);
            onMiniGameLose(`Time ran out! Connected ${nextDotIndex}/8 dots.`);
            return;
        }

        if (isFinished) {
            minigameStatus.innerText = `✨ CONSTELLATION COMPLETED! ✨`;
            minigameStatus.className = "game-status win";
        } else {
            minigameStatus.innerText = `Connect Dot #${nextDotIndex + 1} | Time Left: ${Math.max(0, timeLeft).toFixed(1)}s`;
            minigameStatus.className = "game-status";
        }

        // Draw Lines (including closing line back to Dot 1 when Dot 8 is connected!)
        mgCtx.strokeStyle = isFinished ? '#ffe600' : '#ff007f';
        mgCtx.lineWidth = isFinished ? 4 : 3;
        mgCtx.shadowColor = isFinished ? '#ffe600' : '#ff007f';
        mgCtx.shadowBlur = isFinished ? 20 : 12;

        if (nextDotIndex > 0) {
            mgCtx.beginPath();
            mgCtx.moveTo(dots[0].x, dots[0].y);
            for (let i = 1; i < nextDotIndex; i++) {
                mgCtx.lineTo(dots[i].x, dots[i].y);
            }
            // FIXED: If all 8 dots connected, draw the closing line back to dot 1 (heart tip)!
            if (nextDotIndex >= dots.length) {
                mgCtx.lineTo(dots[0].x, dots[0].y);
            }
            mgCtx.stroke();
        }

        // Draw Dots
        dots.forEach((dot, idx) => {
            const isNext = idx === nextDotIndex;
            const isConnected = idx < nextDotIndex;

            mgCtx.save();
            mgCtx.fillStyle = isConnected ? '#ff007f' : (isNext ? '#00f3ff' : '#202550');
            mgCtx.shadowColor = isNext ? '#00f3ff' : '#ff007f';
            mgCtx.shadowBlur = isNext ? 16 : 8;

            mgCtx.beginPath();
            mgCtx.arc(dot.x, dot.y, isNext ? 16 : 12, 0, Math.PI * 2);
            mgCtx.fill();

            mgCtx.fillStyle = '#ffffff';
            mgCtx.font = 'bold 11px Orbitron';
            mgCtx.textAlign = 'center';
            mgCtx.textBaseline = 'middle';
            mgCtx.fillText(dot.id.toString(), dot.x, dot.y);
            mgCtx.restore();
        });

        currentGameLoop = requestAnimationFrame(loop);
    }

    loop();
}

// ==========================================
// 5. MAGICAL SOUND PIANO
// ==========================================
function runPianoGame() {
    const keys = [
        { id: 1, label: 'C', freq: 261.63, color: '#00f3ff', x: 40, width: 80 },
        { id: 2, label: 'E', freq: 329.63, color: '#ff007f', x: 135, width: 80 },
        { id: 3, label: 'G', freq: 392.00, color: '#b537f2', x: 230, width: 80 },
        { id: 4, label: 'C5', freq: 523.25, color: '#ffe600', x: 325, width: 80 }
    ];

    const targetSequence = [1, 3, 2, 4];
    let userSequence = [];
    let isDemonstrating = true;
    let activeHighlightKey = null;

    function playPatternDemo() {
        isDemonstrating = true;
        minigameStatus.innerText = "🎵 Listen closely to the magic melody...";
        minigameStatus.className = "game-status";

        targetSequence.forEach((keyId, idx) => {
            setTimeout(() => {
                const k = keys.find(item => item.id === keyId);
                activeHighlightKey = keyId;
                playTone(k.freq, 0.35);

                setTimeout(() => { activeHighlightKey = null; }, 300);

                if (idx === targetSequence.length - 1) {
                    setTimeout(() => {
                        isDemonstrating = false;
                        minigameStatus.innerText = "🎹 Your turn! Tap the piano keys in sequence.";
                    }, 400);
                }
            }, (idx + 1) * 600);
        });
    }

    playPatternDemo();

    bindCanvasInteraction(minigameCanvas, (coords) => {
        if (isDemonstrating) return;

        if (coords.y >= 60 && coords.y <= 200) {
            keys.forEach(k => {
                if (coords.x >= k.x && coords.x <= k.x + k.width) {
                    playTone(k.freq, 0.25);
                    activeHighlightKey = k.id;
                    userSequence.push(k.id);

                    setTimeout(() => activeHighlightKey = null, 250);

                    const currentIdx = userSequence.length - 1;
                    if (userSequence[currentIdx] !== targetSequence[currentIdx]) {
                        clearCanvasInteraction(minigameCanvas);
                        onMiniGameLose("Wrong note! Listen carefully and try again.");
                    } else if (userSequence.length === targetSequence.length) {
                        clearCanvasInteraction(minigameCanvas);
                        onMiniGameWin();
                    }
                }
            });
        }
    });

    function loop() {
        mgCtx.clearRect(0, 0, minigameCanvas.width, minigameCanvas.height);

        keys.forEach(k => {
            const isHighlighted = activeHighlightKey === k.id;

            mgCtx.save();
            mgCtx.fillStyle = isHighlighted ? k.color : 'rgba(15, 20, 45, 0.9)';
            mgCtx.strokeStyle = k.color;
            mgCtx.lineWidth = 2;
            mgCtx.shadowColor = k.color;
            mgCtx.shadowBlur = isHighlighted ? 22 : 8;

            mgCtx.beginPath();
            mgCtx.roundRect(k.x, 60, k.width, 140, 10);
            mgCtx.fill();
            mgCtx.stroke();

            mgCtx.fillStyle = isHighlighted ? '#000000' : '#ffffff';
            mgCtx.font = 'bold 16px Orbitron';
            mgCtx.textAlign = 'center';
            mgCtx.fillText(k.label, k.x + k.width / 2, 170);
            mgCtx.restore();
        });

        currentGameLoop = requestAnimationFrame(loop);
    }

    loop();
}

// ==========================================
// 6. MAGIC TILES (Rhythm Piano Tiles)
// ==========================================
function runMagicTilesGame() {
    let tilesHit = 0;
    const targetHits = 12;
    const fallingTiles = [];
    let frameCount = 0;
    const numLanes = 4;
    const laneWidth = minigameCanvas.width / numLanes;
    const laneNotes = [261.63, 329.63, 392.00, 523.25];

    bindCanvasInteraction(minigameCanvas, (coords) => {
        for (let i = fallingTiles.length - 1; i >= 0; i--) {
            const tile = fallingTiles[i];
            if (
                coords.x >= tile.lane * laneWidth &&
                coords.x <= (tile.lane + 1) * laneWidth &&
                coords.y >= tile.y &&
                coords.y <= tile.y + tile.height
            ) {
                tilesHit++;
                playTone(laneNotes[tile.lane], 0.2);
                fallingTiles.splice(i, 1);

                if (tilesHit >= targetHits) {
                    clearCanvasInteraction(minigameCanvas);
                    onMiniGameWin();
                }
                break;
            }
        }
    });

    function loop() {
        frameCount++;
        mgCtx.clearRect(0, 0, minigameCanvas.width, minigameCanvas.height);

        minigameStatus.innerText = `Tiles Hit: ${tilesHit}/${targetHits} | Tap falling black tiles!`;
        minigameStatus.className = "game-status";

        for (let l = 0; l < numLanes; l++) {
            mgCtx.strokeStyle = 'rgba(0, 243, 255, 0.15)';
            mgCtx.strokeRect(l * laneWidth, 0, laneWidth, minigameCanvas.height);
        }

        if (frameCount % 45 === 0 && tilesHit + fallingTiles.length < targetHits + 4) {
            fallingTiles.push({
                lane: Math.floor(Math.random() * numLanes),
                y: -70,
                height: 65,
                speed: 4.2
            });
        }

        for (let i = fallingTiles.length - 1; i >= 0; i--) {
            const tile = fallingTiles[i];
            tile.y += tile.speed;

            mgCtx.save();
            mgCtx.fillStyle = '#00f3ff';
            mgCtx.shadowColor = '#00f3ff';
            mgCtx.shadowBlur = 12;
            mgCtx.fillRect(tile.lane * laneWidth + 4, tile.y, laneWidth - 8, tile.height);
            mgCtx.restore();

            if (tile.y > minigameCanvas.height) {
                clearCanvasInteraction(minigameCanvas);
                onMiniGameLose(`Missed a tile! Hit ${tilesHit}/${targetHits}.`);
                return;
            }
        }

        currentGameLoop = requestAnimationFrame(loop);
    }

    loop();
}

// ==========================================
// 7. FIND THE STAR IN THE JAR (Top-Down Smooth Shuffle)
// ==========================================
function runJarShuffleGame() {
    const jarRadius = 36;
    const baseY = 125;
    const slotsX = [80, 220, 360]; // 3 Slot positions

    const starJarIdx = Math.floor(Math.random() * 3);

    // 3 Jars with current & target positions (No numbers drawn!)
    const jars = [
        { id: 0, slot: 0, x: slotsX[0], y: baseY, startX: slotsX[0], startY: baseY, targetX: slotsX[0], targetY: baseY, hasStar: (starJarIdx === 0) },
        { id: 1, slot: 1, x: slotsX[1], y: baseY, startX: slotsX[1], startY: baseY, targetX: slotsX[1], targetY: baseY, hasStar: (starJarIdx === 1) },
        { id: 2, slot: 2, x: slotsX[2], y: baseY, startX: slotsX[2], startY: baseY, targetX: slotsX[2], targetY: baseY, hasStar: (starJarIdx === 2) }
    ];

    let state = 'REVEAL'; // 'REVEAL', 'SHUFFLE', 'GUESS', 'WIN', 'LOSE'
    let currentSwapIndex = 0;
    const totalSwaps = 7;
    let swapProgress = 0;
    let activeSwapPair = null;

    // Generate sequence of 7 smooth swaps
    const swapQueue = [];
    for (let s = 0; s < totalSwaps; s++) {
        const s1 = Math.floor(Math.random() * 3);
        let s2 = (s1 + 1 + Math.floor(Math.random() * 2)) % 3;
        swapQueue.push([s1, s2]);
    }

    minigameStatus.innerText = "⭐ Track which top-down jar holds the star!";
    minigameStatus.className = "game-status";

    // Reveal star for 1.5 seconds, then begin smooth shuffling
    setTimeout(() => {
        state = 'SHUFFLE';
        minigameStatus.innerText = "🔀 Watch the jars slide smoothly...";
        prepareNextSwap();
    }, 1500);

    function prepareNextSwap() {
        if (currentSwapIndex >= swapQueue.length) {
            state = 'GUESS';
            minigameStatus.innerText = "🔍 Tap the jar containing the star!";
            return;
        }

        const [slotA, slotB] = swapQueue[currentSwapIndex];
        const jarA = jars.find(j => j.slot === slotA);
        const jarB = jars.find(j => j.slot === slotB);

        // Swap slot assignments
        jarA.slot = slotB;
        jarB.slot = slotA;

        jarA.startX = jarA.x;
        jarA.startY = baseY;
        jarA.targetX = slotsX[slotB];
        jarA.arcDir = -1; // Arc up

        jarB.startX = jarB.x;
        jarB.startY = baseY;
        jarB.targetX = slotsX[slotA];
        jarB.arcDir = 1; // Arc down

        activeSwapPair = [jarA, jarB];
        swapProgress = 0;
        playTone(350 + currentSwapIndex * 40, 0.1);
    }

    bindCanvasInteraction(minigameCanvas, (coords) => {
        if (state !== 'GUESS') return;

        for (let i = 0; i < jars.length; i++) {
            const j = jars[i];
            const dist = Math.hypot(coords.x - j.x, coords.y - j.y);
            if (dist <= jarRadius + 8) {
                if (j.hasStar) {
                    state = 'WIN';
                    clearCanvasInteraction(minigameCanvas);
                    onMiniGameWin();
                } else {
                    state = 'LOSE';
                    clearCanvasInteraction(minigameCanvas);
                    onMiniGameLose("Empty jar! The star was in another jar.");
                }
                break;
            }
        }
    });

    function loop() {
        mgCtx.clearRect(0, 0, minigameCanvas.width, minigameCanvas.height);

        // Update Smooth Sliding Swap Animation
        if (state === 'SHUFFLE' && activeSwapPair) {
            swapProgress += 0.055; // ~18 frames per smooth sliding swap
            if (swapProgress >= 1) {
                swapProgress = 1;
                activeSwapPair[0].x = activeSwapPair[0].targetX;
                activeSwapPair[0].y = baseY;
                activeSwapPair[1].x = activeSwapPair[1].targetX;
                activeSwapPair[1].y = baseY;

                activeSwapPair = null;
                currentSwapIndex++;
                setTimeout(() => prepareNextSwap(), 60);
            } else {
                // Smooth Sine Arc interpolation
                activeSwapPair.forEach(jar => {
                    jar.x = jar.startX + (jar.targetX - jar.startX) * swapProgress;
                    jar.y = baseY + Math.sin(swapProgress * Math.PI) * (38 * jar.arcDir);
                });
            }
        }

        // Render 3 Jars (Top-Down Aerial View)
        jars.forEach(j => {
            mgCtx.save();

            // Outer Top-Down Glass Jar Rim
            mgCtx.fillStyle = 'rgba(15, 25, 55, 0.95)';
            mgCtx.strokeStyle = '#00f3ff';
            mgCtx.lineWidth = 4;
            mgCtx.shadowColor = '#00f3ff';
            mgCtx.shadowBlur = 16;

            mgCtx.beginPath();
            mgCtx.arc(j.x, j.y, jarRadius, 0, Math.PI * 2);
            mgCtx.fill();
            mgCtx.stroke();

            // Inner Lid Accent Ring
            mgCtx.strokeStyle = 'rgba(181, 55, 242, 0.7)';
            mgCtx.lineWidth = 2;
            mgCtx.beginPath();
            mgCtx.arc(j.x, j.y, jarRadius * 0.7, 0, Math.PI * 2);
            mgCtx.stroke();

            // Center Knob / Seal
            mgCtx.fillStyle = 'rgba(0, 243, 255, 0.25)';
            mgCtx.beginPath();
            mgCtx.arc(j.x, j.y, jarRadius * 0.35, 0, Math.PI * 2);
            mgCtx.fill();

            // Draw Star inside Jar if in REVEAL or WIN state
            if (j.hasStar && (state === 'REVEAL' || state === 'WIN')) {
                mgCtx.fillStyle = '#ffe600';
                mgCtx.shadowColor = '#ffe600';
                mgCtx.shadowBlur = 24;
                mgCtx.font = '28px sans-serif';
                mgCtx.textAlign = 'center';
                mgCtx.textBaseline = 'middle';
                mgCtx.fillText('★', j.x, j.y);
            }

            mgCtx.restore();
        });

        currentGameLoop = requestAnimationFrame(loop);
    }

    loop();
}

// ==========================================
// 8. CATCH THE SUPER FAST FIREFLY
// ==========================================
function runFastFireflyGame() {
    const firefly = {
        x: 220,
        y: 125,
        vx: (Math.random() - 0.5) * 24,
        vy: (Math.random() - 0.5) * 24,
        radius: 12
    };

    let frameCount = 0;
    const trail = [];

    bindCanvasInteraction(minigameCanvas, (coords) => {
        const dist = Math.hypot(coords.x - firefly.x, coords.y - firefly.y);
        if (dist <= firefly.radius + 26) {
            clearCanvasInteraction(minigameCanvas);
            playTone(850, 0.25);
            onMiniGameWin();
        }
    });

    function loop() {
        frameCount++;

        if (frameCount % 10 === 0) {
            firefly.vx = (Math.random() - 0.5) * 28;
            firefly.vy = (Math.random() - 0.5) * 28;
        }

        firefly.x += firefly.vx;
        firefly.y += firefly.vy;

        if (firefly.x < 20 || firefly.x > minigameCanvas.width - 20) firefly.vx *= -1;
        if (firefly.y < 20 || firefly.y > minigameCanvas.height - 20) firefly.vy *= -1;

        trail.push({ x: firefly.x, y: firefly.y, alpha: 1 });
        if (trail.length > 15) trail.shift();

        mgCtx.clearRect(0, 0, minigameCanvas.width, minigameCanvas.height);

        minigameStatus.innerText = "⚡ Tap the super fast glowing firefly!";
        minigameStatus.className = "game-status";

        trail.forEach(t => {
            t.alpha -= 0.06;
            if (t.alpha > 0) {
                mgCtx.save();
                mgCtx.globalAlpha = t.alpha;
                mgCtx.fillStyle = '#ffe600';
                mgCtx.shadowColor = '#ffe600';
                mgCtx.shadowBlur = 10;
                mgCtx.beginPath();
                mgCtx.arc(t.x, t.y, 4, 0, Math.PI * 2);
                mgCtx.fill();
                mgCtx.restore();
            }
        });

        mgCtx.save();
        mgCtx.fillStyle = '#ffe600';
        mgCtx.shadowColor = '#ffe600';
        mgCtx.shadowBlur = 24;
        mgCtx.beginPath();
        mgCtx.arc(firefly.x, firefly.y, firefly.radius, 0, Math.PI * 2);
        mgCtx.fill();

        mgCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        mgCtx.beginPath();
        mgCtx.ellipse(firefly.x - 6, firefly.y - 6, 8, 4, Math.PI / 4, 0, Math.PI * 2);
        mgCtx.ellipse(firefly.x + 6, firefly.y - 6, 8, 4, -Math.PI / 4, 0, Math.PI * 2);
        mgCtx.fill();

        mgCtx.restore();

        currentGameLoop = requestAnimationFrame(loop);
    }

    loop();
}

// ==========================================
// 9. TOWER STACKER (Stack up to 10)
// ==========================================
function runTowerStackerGame() {
    const targetStack = 10;
    const blockHeight = 18;

    const stack = [
        { x: 140, y: 220, width: 160 }
    ];

    let currentBlock = {
        x: 0,
        y: 220 - blockHeight,
        width: 160,
        speed: 4.5,
        dir: 1
    };

    function placeBlock() {
        const prev = stack[stack.length - 1];
        const leftOverlap = Math.max(currentBlock.x, prev.x);
        const rightOverlap = Math.min(currentBlock.x + currentBlock.width, prev.x + prev.width);
        const overlapWidth = rightOverlap - leftOverlap;

        if (overlapWidth <= 0) {
            clearCanvasInteraction(minigameCanvas);
            window.onkeydown = null;
            onMiniGameLose(`Missed the stack! Height reached: ${stack.length - 1}/${targetStack}.`);
            return;
        }

        stack.push({
            x: leftOverlap,
            y: currentBlock.y,
            width: overlapWidth
        });

        playTone(450 + stack.length * 40, 0.15);

        if (stack.length - 1 >= targetStack) {
            clearCanvasInteraction(minigameCanvas);
            window.onkeydown = null;
            onMiniGameWin();
            return;
        }

        currentBlock = {
            x: 0,
            y: 220 - stack.length * blockHeight,
            width: overlapWidth,
            speed: 4.5 + stack.length * 0.4,
            dir: 1
        };
    }

    bindCanvasInteraction(minigameCanvas, () => placeBlock());
    window.onkeydown = (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            placeBlock();
        }
    };

    function loop() {
        currentBlock.x += currentBlock.speed * currentBlock.dir;
        if (currentBlock.x <= 0 || currentBlock.x + currentBlock.width >= minigameCanvas.width) {
            currentBlock.dir *= -1;
        }

        mgCtx.clearRect(0, 0, minigameCanvas.width, minigameCanvas.height);

        minigameStatus.innerText = `Tower Stack: ${stack.length - 1}/${targetStack} (Tap / Space)`;
        minigameStatus.className = "game-status";

        stack.forEach((b, idx) => {
            mgCtx.save();
            mgCtx.fillStyle = idx === 0 ? '#00f3ff' : '#ff007f';
            mgCtx.shadowColor = '#ff007f';
            mgCtx.shadowBlur = 10;
            mgCtx.fillRect(b.x, b.y, b.width, blockHeight - 2);
            mgCtx.restore();
        });

        mgCtx.save();
        mgCtx.fillStyle = '#ffe600';
        mgCtx.shadowColor = '#ffe600';
        mgCtx.shadowBlur = 14;
        mgCtx.fillRect(currentBlock.x, currentBlock.y, currentBlock.width, blockHeight - 2);
        mgCtx.restore();

        currentGameLoop = requestAnimationFrame(loop);
    }

    loop();
}

// ==========================================
// 10. TOWER OF HANOI (Solve 3 Disks)
// ==========================================
function runHanoiGame() {
    const pegs = [
        [3, 2, 1],
        [],
        []
    ];

    const pegX = [90, 220, 350];
    const diskColors = { 1: '#ffe600', 2: '#00f3ff', 3: '#ff007f' };
    const diskWidths = { 1: 45, 2: 70, 3: 100 };

    let selectedPegIndex = null;

    bindCanvasInteraction(minigameCanvas, (coords) => {
        let clickedPeg = -1;
        if (coords.x < 155) clickedPeg = 0;
        else if (coords.x < 285) clickedPeg = 1;
        else clickedPeg = 2;

        if (selectedPegIndex === null) {
            if (pegs[clickedPeg].length > 0) {
                selectedPegIndex = clickedPeg;
                playTone(500, 0.1);
            }
        } else {
            if (selectedPegIndex === clickedPeg) {
                selectedPegIndex = null;
            } else {
                const sourcePeg = pegs[selectedPegIndex];
                const targetPeg = pegs[clickedPeg];
                const diskToMove = sourcePeg[sourcePeg.length - 1];

                if (targetPeg.length === 0 || targetPeg[targetPeg.length - 1] > diskToMove) {
                    targetPeg.push(sourcePeg.pop());
                    selectedPegIndex = null;
                    playTone(650, 0.15);

                    if (pegs[2].length === 3) {
                        clearCanvasInteraction(minigameCanvas);
                        onMiniGameWin();
                    }
                } else {
                    playTone(200, 0.2);
                    selectedPegIndex = null;
                }
            }
        }
    });

    function loop() {
        mgCtx.clearRect(0, 0, minigameCanvas.width, minigameCanvas.height);

        minigameStatus.innerText = "🧩 Move all 3 disks to Peg C! Tap peg to select/drop.";
        minigameStatus.className = "game-status";

        for (let i = 0; i < 3; i++) {
            const x = pegX[i];
            const isSelected = selectedPegIndex === i;

            mgCtx.save();
            mgCtx.strokeStyle = isSelected ? '#ffe600' : '#00f3ff';
            mgCtx.lineWidth = 4;
            mgCtx.shadowColor = isSelected ? '#ffe600' : '#00f3ff';
            mgCtx.shadowBlur = isSelected ? 16 : 8;

            mgCtx.beginPath();
            mgCtx.moveTo(x, 70);
            mgCtx.lineTo(x, 210);
            mgCtx.stroke();

            mgCtx.fillStyle = '#ffffff';
            mgCtx.font = 'bold 12px Orbitron';
            mgCtx.textAlign = 'center';
            mgCtx.fillText(i === 0 ? 'A' : (i === 1 ? 'B' : 'C (Target)'), x, 230);
            mgCtx.restore();

            pegs[i].forEach((diskSize, level) => {
                const dWidth = diskWidths[diskSize];
                const dY = 190 - level * 20;

                mgCtx.save();
                mgCtx.fillStyle = diskColors[diskSize];
                mgCtx.shadowColor = diskColors[diskSize];
                mgCtx.shadowBlur = 12;

                const isLifted = isSelected && level === pegs[i].length - 1;
                const finalY = isLifted ? dY - 25 : dY;

                mgCtx.beginPath();
                mgCtx.roundRect(x - dWidth / 2, finalY, dWidth, 16, 6);
                mgCtx.fill();
                mgCtx.restore();
            });
        }

        currentGameLoop = requestAnimationFrame(loop);
    }

    loop();
}
