const fs = require('fs');
const path = 'E:/gym/abcv-main/abcv-main/gym-empire-arcade.html';
let html = fs.readFileSync(path, 'utf8');

// 1. Fix startGame
const startGameBad = `        function startGame() {
            playSfx('click');
            const splash = document.getElementById('splash-screen');
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.classList.add('hidden');
                const root = document.getElementById('game-root');
                if (root) root.classList.remove('hidden');
                const tut = document.getElementById('runner-tutorial');
                if (tut) tut.classList.remove('hidden');
            }, 500);
        }`;

const startGameGood = `        function startGame() {
            playSfx('click');
            const splash = document.getElementById('splash-screen');
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.classList.add('hidden');
                const root = document.getElementById('game-root');
                if (root) root.classList.remove('hidden');
                const tut = document.getElementById('runner-tutorial');
                if (tut) tut.classList.remove('hidden');
                
                // CRITICAL: Start the game
                startRunnerGame();
            }, 500);
        }`;

if (html.includes(startGameBad)) {
    html = html.replace(startGameBad, startGameGood);
}

// 2. Inject Boxing Logic
const boxingJs = `
        // =========================================================================
        // BOXING GAME LOGIC
        // =========================================================================
        let boxingCanvas, bctx;
        let boxingState = {
            active: false,
            timeRemaining: 30,
            combo: 0,
            maxCombo: 0,
            lastPunchTime: 0,
            bagAngle: 0,
            bagVel: 0,
            particles: [],
            lastSide: null // To encourage alternating
        };
        let boxingTimer = null;
        let boxingAnimationFrame;

        function initBoxing() {
            boxingCanvas = document.getElementById('boxingCanvas');
            if(!boxingCanvas) return;
            bctx = boxingCanvas.getContext('2d', { alpha: false });
            resizeBoxing();
            
            // Buttons
            const btnLeft = document.getElementById('boxing-btn-left');
            const btnRight = document.getElementById('boxing-btn-right');
            
            const handlePunchLeft = (e) => { e.preventDefault(); if(boxingState.active) punch('left'); };
            const handlePunchRight = (e) => { e.preventDefault(); if(boxingState.active) punch('right'); };
            
            if(btnLeft) {
                btnLeft.addEventListener('touchstart', handlePunchLeft, {passive: false});
                btnLeft.addEventListener('mousedown', handlePunchLeft);
            }
            if(btnRight) {
                btnRight.addEventListener('touchstart', handlePunchRight, {passive: false});
                btnRight.addEventListener('mousedown', handlePunchRight);
            }
            
            // Initial draw
            drawBoxingFrame(performance.now());
        }

        function resizeBoxing() {
            if(!boxingCanvas) return;
            const parent = boxingCanvas.parentElement;
            boxingCanvas.width = parent.clientWidth;
            boxingCanvas.height = parent.clientHeight;
        }

        function startBoxingGame() {
            playSfx('click');
            document.getElementById('boxing-overlay').classList.add('hidden');
            boxingState.active = true;
            boxingState.timeRemaining = 30;
            boxingState.combo = 0;
            boxingState.maxCombo = 0;
            boxingState.bagAngle = 0;
            boxingState.bagVel = 0;
            boxingState.particles = [];
            boxingState.lastSide = null;
            
            document.getElementById('boxing-combo').innerText = '0';
            document.getElementById('boxing-time').innerText = '30s';
            
            if(boxingTimer) clearInterval(boxingTimer);
            boxingTimer = setInterval(() => {
                if(!boxingState.active) return;
                boxingState.timeRemaining--;
                document.getElementById('boxing-time').innerText = boxingState.timeRemaining + 's';
                
                if(boxingState.timeRemaining <= 0) {
                    endBoxingGame();
                }
            }, 1000);
            
            if(!boxingAnimationFrame) {
                boxingAnimationFrame = requestAnimationFrame(updateBoxingLoop);
            }
        }

        function endBoxingGame() {
            boxingState.active = false;
            clearInterval(boxingTimer);
            cancelAnimationFrame(boxingAnimationFrame);
            boxingAnimationFrame = null;
            
            playSfx('success');
            const pointsEarned = Math.floor(boxingState.maxCombo * 2.5);
            addMusclePoints(pointsEarned);
            
            document.getElementById('boxing-overlay').classList.remove('hidden');
            document.getElementById('boxing-overlay-title').innerText = "Time's Up!";
            document.getElementById('boxing-overlay-desc').innerHTML = \`Max Combo: <span class="text-rose-400 font-bold">\${boxingState.maxCombo}</span><br>Earned <span class="text-emerald-400 font-bold">+\${pointsEarned}</span> Power!\`;
            
            checkSessionChallenge('boxing');
        }

        function punch(side) {
            const now = performance.now();
            
            if (boxingState.lastSide === side && boxingState.combo > 0) {
                boxingState.combo = Math.max(0, boxingState.combo - 5);
            } else {
                boxingState.combo++;
            }
            
            if (boxingState.combo > boxingState.maxCombo) {
                boxingState.maxCombo = boxingState.combo;
            }
            
            boxingState.lastSide = side;
            boxingState.lastPunchTime = now;
            
            const force = 0.15 + Math.min(boxingState.combo * 0.005, 0.2);
            boxingState.bagVel += (side === 'left' ? force : -force);
            
            document.getElementById('boxing-combo').innerText = boxingState.combo;
            
            const isHeavy = boxingState.combo % 10 === 0;
            if (isHeavy) {
                playSfx('slam_heavy');
                hapticFeedback('slam_heavy');
                createPunchParticles(side, true);
            } else {
                playSfx('click');
                hapticFeedback('click');
                createPunchParticles(side, false);
            }
            
            const btn = document.getElementById('boxing-btn-' + side);
            if(btn) {
                btn.style.transform = 'scale(0.9)';
                setTimeout(() => btn.style.transform = 'none', 50);
            }
        }

        function createPunchParticles(side, isHeavy) {
            const cx = boxingCanvas.width / 2;
            const cy = boxingCanvas.height / 2;
            
            const bagLen = 180;
            const px = cx + Math.sin(boxingState.bagAngle) * bagLen + (side === 'left' ? -30 : 30);
            const py = cy - 80 + Math.cos(boxingState.bagAngle) * bagLen;
            
            const count = isHeavy ? 15 : 5;
            for(let i=0; i<count; i++) {
                boxingState.particles.push({
                    x: px,
                    y: py + (Math.random() * 40 - 20),
                    vx: (side === 'left' ? Math.random() * 5 + 2 : -Math.random() * 5 - 2),
                    vy: Math.random() * 10 - 5,
                    life: 1.0,
                    color: isHeavy ? '#fb7185' : '#f8fafc',
                    size: isHeavy ? Math.random() * 4 + 2 : Math.random() * 3 + 1
                });
            }
        }

        function updateBoxingLoop(time) {
            if(!boxingState.active && document.getElementById('tab-boxing').classList.contains('hidden')) {
                boxingAnimationFrame = null;
                return;
            }
            drawBoxingFrame(time);
            if(boxingState.active || Math.abs(boxingState.bagVel) > 0.01 || Math.abs(boxingState.bagAngle) > 0.01) {
                boxingAnimationFrame = requestAnimationFrame(updateBoxingLoop);
            } else {
                boxingAnimationFrame = null;
            }
        }

        function drawBoxingFrame(time) {
            if(!bctx || !boxingCanvas) return;
            const w = boxingCanvas.width;
            const h = boxingCanvas.height;
            const cx = w / 2;
            const cy = h / 2 - 80;
            
            bctx.fillStyle = '#0f172a';
            bctx.fillRect(0, 0, w, h);
            
            const spring = 0.05;
            const friction = 0.92;
            boxingState.bagVel -= boxingState.bagAngle * spring;
            boxingState.bagVel *= friction;
            boxingState.bagAngle += boxingState.bagVel;
            
            if (boxingState.active && time - boxingState.lastPunchTime > 1500 && boxingState.combo > 0) {
                boxingState.combo = Math.floor(boxingState.combo * 0.9);
                document.getElementById('boxing-combo').innerText = boxingState.combo;
            }

            bctx.save();
            bctx.translate(cx, cy);
            
            bctx.strokeStyle = '#475569';
            bctx.lineWidth = 4;
            bctx.beginPath();
            bctx.moveTo(0, -50);
            bctx.lineTo(Math.sin(boxingState.bagAngle)*20, Math.cos(boxingState.bagAngle)*20);
            bctx.stroke();

            bctx.rotate(boxingState.bagAngle);

            const comboIntensity = Math.min(boxingState.combo / 50, 1);
            if (comboIntensity > 0) {
                const glow = bctx.createRadialGradient(0, 80, 0, 0, 80, 120);
                glow.addColorStop(0, \`rgba(244, 63, 94, \${comboIntensity * 0.5})\`);
                glow.addColorStop(1, 'rgba(244, 63, 94, 0)');
                bctx.fillStyle = glow;
                bctx.beginPath(); bctx.arc(0, 80, 120, 0, Math.PI*2); bctx.fill();
            }

            bctx.fillStyle = '#be123c';
            bctx.beginPath();
            bctx.roundRect(-40, 20, 80, 160, 20);
            bctx.fill();
            
            bctx.fillStyle = 'rgba(255,255,255,0.15)';
            bctx.beginPath();
            bctx.roundRect(-30, 25, 20, 150, 10);
            bctx.fill();

            bctx.fillStyle = '#0f172a';
            bctx.fillRect(-40, 40, 80, 8);
            bctx.fillRect(-40, 150, 80, 8);

            bctx.restore();

            for(let i = boxingState.particles.length - 1; i >= 0; i--) {
                let p = boxingState.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.2;
                p.life -= 0.03;
                
                if(p.life <= 0) {
                    boxingState.particles[i] = boxingState.particles[boxingState.particles.length - 1];
                    boxingState.particles.pop();
                    continue;
                }
                
                bctx.globalAlpha = p.life;
                bctx.fillStyle = p.color;
                bctx.beginPath();
                bctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
                bctx.fill();
            }
            bctx.globalAlpha = 1.0;
        }

`;

if (!html.includes('function initBoxing()')) {
    html = html.replace('// Lucide icons', boxingJs + '\n\n        // Lucide icons');
}

// 3. Ensure initBoxing and resizeBoxing are called
const domContentLoadedTarget = `        document.addEventListener('DOMContentLoaded', function () {
            setTimeout(function () {
                resizeRunner();
                // Game waits for user to click PLAY NOW
            }, 300);
        });`;

const domContentLoadedReplace = `        document.addEventListener('DOMContentLoaded', function () {
            // Initialize other games that don't need immediate start
            initBoxing();
            setTimeout(function () {
                resizeRunner();
                resizeCatcher();
                resizeBoxing();
                // Game waits for user to click PLAY NOW
            }, 300);
        });`;

if (html.includes(domContentLoadedTarget)) {
    html = html.replace(domContentLoadedTarget, domContentLoadedReplace);
}

// Ensure keybindings support boxing
const keyBindingTarget = `        // Also support click on runner canvas for jumping (already done via onclick)`;
const keyBindingReplace = `        document.addEventListener('keydown', (e) => {
            const isBoxingVisible = !document.getElementById('tab-boxing').classList.contains('hidden');
            if (isBoxingVisible && boxingState.active) {
                if (e.code === 'ArrowLeft') {
                    e.preventDefault();
                    punch('left');
                } else if (e.code === 'ArrowRight') {
                    e.preventDefault();
                    punch('right');
                }
            }
        });

        // Also support click on runner canvas for jumping (already done via onclick)`;
if (!html.includes('if (isBoxingVisible && boxingState.active)')) {
    html = html.replace(keyBindingTarget, keyBindingReplace);
}

fs.writeFileSync(path, html, 'utf8');
console.log("Fixed startGame and injected Box Blitz.");
