
        // =========================================================================
        // SFX CHIP SYNTH ENGINE (Web Audio API)
        // =========================================================================
        let audioCtx = null;

        function initAudio() {
            if (!audioCtx) {
                audioCtx = new(window.AudioContext || window.webkitAudioContext)();
            }
        }

        function playSfx(type) {
            try {
                initAudio();
                if (!audioCtx) return;

                const now = audioCtx.currentTime;
                const osc = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                osc.connect(gainNode);
                gainNode.connect(audioCtx.destination);

                if (type === 'click') {
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(450, now);
                    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
                    gainNode.gain.setValueAtTime(0.12, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
                    osc.start(now);
                    osc.stop(now + 0.08);
                } else if (type === 'jump') {
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(280, now);
                    osc.frequency.exponentialRampToValueAtTime(700, now + 0.12);
                    gainNode.gain.setValueAtTime(0.1, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
                    osc.start(now);
                    osc.stop(now + 0.12);
                } else if (type === 'powerup') {
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(580, now);
                    osc.frequency.exponentialRampToValueAtTime(1300, now + 0.22);
                    gainNode.gain.setValueAtTime(0.12, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
                    osc.start(now);
                    osc.stop(now + 0.22);
                } else if (type === 'slam_heavy') {
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(140, now);
                    osc.frequency.linearRampToValueAtTime(45, now + 0.35);
                    gainNode.gain.setValueAtTime(0.22, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
                    osc.start(now);
                    osc.stop(now + 0.35);
                } else if (type === 'success') {
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(523.25, now);
                    osc.frequency.setValueAtTime(659.25, now + 0.08);
                    osc.frequency.setValueAtTime(783.99, now + 0.16);
                    gainNode.gain.setValueAtTime(0.1, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
                    osc.start(now);
                    osc.stop(now + 0.35);
                } else if (type === 'cheer') {
                    const bufferSize = audioCtx.sampleRate * 0.45;
                    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
                    const data = buffer.getChannelData(0);
                    for (let i = 0; i < bufferSize; i++) {
                        data[i] = Math.random() * 2 - 1;
                    }
                    const noise = audioCtx.createBufferSource();
                    noise.buffer = buffer;
                    const filter = audioCtx.createBiquadFilter();
                    filter.type = 'bandpass';
                    filter.frequency.value = 850;
                    noise.connect(filter);
                    filter.connect(gainNode);
                    gainNode.gain.setValueAtTime(0.04, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
                    noise.start(now);
                    noise.stop(now + 0.45);
                } else if (type === 'fail') {
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(260, now);
                    osc.frequency.linearRampToValueAtTime(90, now + 0.32);
                    gainNode.gain.setValueAtTime(0.15, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.32);
                    osc.start(now);
                    osc.stop(now + 0.32);
                } else if (type === 'levelup') {
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(440, now);
                    osc.frequency.exponentialRampToValueAtTime(880, now + 0.4);
                    gainNode.gain.setValueAtTime(0.15, now);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
                    osc.start(now);
                    osc.stop(now + 0.45);
                }
            } catch (err) {
                console.warn("AudioContext init blocked or failed:", err);
            }
        }


        // =========================================================================
        // STATE MANAGEMENTS
        // =========================================================================
        const STATE = {
            musclePoints: parseInt(localStorage.getItem('ge_points') || '0'),
            equippedSkin: localStorage.getItem('ge_equipped_skin') || 'default',
            unlockedSkins: JSON.parse(localStorage.getItem('ge_unlocked_skins') || '["default"]'),
            highScores: {
                runner: parseInt(localStorage.getItem('ge_best_runner') || '0'),
                slam: parseInt(localStorage.getItem('ge_best_slam') || '0'),
                catcher: parseInt(localStorage.getItem('ge_best_catcher') || '0'),

            }
        };

        // Session challenge tracking
        let sessionGames = { runner: false, slam: false, catcher: false };
        let sessionBonusApplied = false;

        const SKINS_LIST = [
            { id: 'default', name: 'Skinny Bobby', emoji: '👶', cost: 0, mult: 1.0,
            desc: 'Your standard default training avatar. He is ready to grind!' },
            { id: 'gorilla', name: 'Gorilla Beast', emoji: '🦍', cost: 2500, mult: 2.2,
            desc: 'Absolute primal mass! Bobby unleashes the giant ape within. (+120% points boost)' },
            { id: 'fit', name: 'Fit Athlete', emoji: '🏃‍♂️', cost: 200, mult: 1.3,
            desc: 'Bobby after high-intensity cardio treadmill runs! (+30% points boost)' },
            { id: 'buff', name: 'Buff Champion', emoji: '💪', cost: 800, mult: 1.7,
            desc: 'Getting sturdy! Bobby stacks on beefy lifting weights. (+70% points boost)' },
            { id: 'god', name: 'Golden Gym God', emoji: '👑', cost: 6000, mult: 3.0,
            desc: 'Radiating golden god vibes. Pure limit-breaker performance! (+200% points boost)' },
            { id: 'mecha', name: 'Cybernetic Mecha', emoji: '🤖', cost: 15000, mult: 4.5,
            desc: 'Optimized synthetic titanium hydraulics. Unlimited cyber output! (+350% points boost)' }
        ];

        function getEquippedSkinObject() {
            return SKINS_LIST.find(s => s.id === STATE.equippedSkin) || SKINS_LIST[0];
        }

        function saveState() {
            localStorage.setItem('ge_points', STATE.musclePoints.toString());
            localStorage.setItem('ge_equipped_skin', STATE.equippedSkin);
            localStorage.setItem('ge_unlocked_skins', JSON.stringify(STATE.unlockedSkins));
            localStorage.setItem('ge_best_runner', STATE.highScores.runner.toString());
            localStorage.setItem('ge_best_slam', STATE.highScores.slam.toString());
            localStorage.setItem('ge_best_catcher', STATE.highScores.catcher.toString());

        }

        function showNotification(text) {
            const el = document.getElementById('system-notif');
            document.getElementById('system-notif-text').innerText = text;
            el.classList.remove('translate-y-10', 'opacity-0');
            el.classList.add('translate-y-0', 'opacity-100');

            setTimeout(() => {
                el.classList.remove('translate-y-0', 'opacity-100');
                el.classList.add('translate-y-10', 'opacity-0');
            }, 3000);
        }

        function triggerScreenShake(elementId = 'game-root') {
            const el = document.getElementById(elementId);
            if (el) {
                el.classList.remove('shake-active');
                void el.offsetWidth;
                el.classList.add('shake-active');
                setTimeout(() => el.classList.remove('shake-active'), 350);
            }
        }

        function spawnFloatingText(text, x, y, containerId, colorClass = 'text-emerald-400') {
            const container = document.getElementById(containerId);
            if (!container) return;

            const popup = document.createElement('div');
            popup.className =
                `absolute pointer-events-none font-display font-black text-sm tracking-wider select-none z-30 floating-popup ${colorClass}`;
            popup.style.left = `${x}px`;
            popup.style.top = `${y}px`;
            popup.innerText = text;

            container.appendChild(popup);
            setTimeout(() => popup.remove(), 850);
        }


        // =========================================================================
        // NAVIGATION TABS IMPLEMENTATIONS
        // =========================================================================
        function switchTab(tabId) {
            document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
            document.querySelectorAll('.tab-btn').forEach(el => {
                el.classList.remove('border-emerald-500', 'text-emerald-400');
                el.classList.add('border-transparent', 'text-slate-400', 'hover:text-white');
            });

            document.getElementById(`tab-${tabId}`).classList.remove('hidden');
            const activeBtn = document.getElementById(`tab-btn-${tabId}`);
            activeBtn.classList.add('border-emerald-500', 'text-emerald-400');
            activeBtn.classList.remove('border-transparent', 'text-slate-400');

            playSfx('click');

            // Instantly shut down active gameplay frames to avoid overlay loops
            runnerState.active = false;
            slamState.active = false;
            catcherState.active = false;
            if (typeof truckState !== 'undefined') {
                truckState.active = false;
                if(typeof truckAnimationFrame !== 'undefined') cancelAnimationFrame(truckAnimationFrame);
            }
            if (typeof boxingState !== 'undefined') {
                boxingState.active = false;
                if (typeof boxingTimer !== 'undefined') clearInterval(boxingTimer);
                if (typeof boxingAnimationFrame !== 'undefined') cancelAnimationFrame(boxingAnimationFrame);
            }

            if (tabId === 'runner') {
                resizeRunner();
                document.getElementById('runner-over-overlay').classList.add('hidden');
                setTimeout(function () { startRunnerGame(); }, 100);
            } else if (tabId === 'slam') {
                // Show slam tutorial when switching to tab
                document.getElementById('slam-tutorial').classList.remove('hidden');
                document.getElementById('slam-highscore').innerText = (STATE.highScores.slam || 0).toLocaleString();
                document.getElementById('slam-score').innerText = '0';
                updateGlobalDashboard();
            } else if (tabId === 'catcher') {
                resizeCatcher();
                document.getElementById('catcher-tutorial').classList.remove('hidden');
                document.getElementById('catcher-over-overlay').classList.add('hidden');
            } else if (tabId === 'locker') {
                renderLockerRoom();

            }
        }


        // =========================================================================
        // GAME 1: CARDIO RUNNER - ENHANCED EDITION
        // =========================================================================
        const runnerCanvas = document.getElementById('runner-canvas');
        const runnerCtx = runnerCanvas.getContext('2d');

        let runnerState = {
            active: false,
            score: 0,
            player: { x: 50, y: 150, w: 38, h: 38, velocityY: 0, jumps: 0 },
            obstacles: [],
            particles: [],
            hearts: 3,
            gameSpeed: 4.5,
            backgroundX: 0,
            spawnTimer: 0,
            comboStreak: 0,
            maxCombo: 0,
            jumpCount: 0,
            proteinCount: 0,
            distance: 0,
            frameCount: 0,
            isRunning: false,
            runCycle: 0,
            isDead: false,
            groundY: 0,
            difficultyLevel: 1,
            difficultyLabel: 'Warm Up',
            spawnCycle: 0,
            lastDiffLevel: 1,
        };

        function resizeRunner() {
            if (!runnerCanvas) return;
            const parent = runnerCanvas.parentElement;
            if (parent) {
                runnerCanvas.width = parent.clientWidth || 709;
                runnerCanvas.height = 280;
                // Update ground Y based on canvas height
                runnerState.groundY = runnerCanvas.height - 50;
                runnerState.player.y = runnerState.groundY - runnerState.player.h;
            }
        }

        function startRunnerGame() {
            initAudio();
            document.getElementById('runner-tutorial').classList.add('hidden');
            document.getElementById('runner-over-overlay').classList.add('hidden');
            document.getElementById('runner-tap-tip').classList.add('hidden');

            const canvas = runnerCanvas;
            const groundY = canvas.height - 50;

            runnerState.active = true;
            sessionGames.runner = true;
            runnerState.score = 0;
            runnerState.hearts = 3;
            runnerState.gameSpeed = 4.8;
            runnerState.obstacles = [];
            runnerState.particles = [];
            runnerState.comboStreak = 0;
            runnerState.maxCombo = 0;
            runnerState.jumpCount = 0;
            runnerState.proteinCount = 0;
            runnerState.distance = 0;
            runnerState.frameCount = 0;
            runnerState.isRunning = false;
            runnerState.runCycle = 0;
            runnerState.isDead = false;
            runnerState.groundY = groundY;
            runnerState.player.x = 50;
            runnerState.player.y = groundY - runnerState.player.h;
            runnerState.player.velocityY = 0;
            runnerState.player.jumps = 0;
            runnerState.backgroundX = 0;
            runnerState.spawnTimer = 0;
            runnerState.difficultyLevel = 1;
            runnerState.difficultyLabel = 'Warm Up';
            runnerState.spawnCycle = 0;
            runnerState.lastDiffLevel = 1;

            // Hide combo display initially
            const comboDisplay = document.getElementById('runner-combo-display');
            comboDisplay.classList.add('opacity-0');

            updateRunnerHUD();
            playSfx('success');
            requestAnimationFrame(updateRunnerFrame);
        }

        function triggerRunnerJump() {
            if (!runnerState.active || runnerState.isDead) return;
            if (runnerState.player.jumps < 2) {
                runnerState.player.velocityY = -8.5;
                runnerState.player.jumps++;
                runnerState.jumpCount++;
                playSfx('jump');

                // Enhanced jump particles with trail
                const skinObj = getEquippedSkinObject();
                for (let i = 0; i < 12; i++) {
                    runnerState.particles.push({
                        x: runnerState.player.x + 20 + (Math.random() - 0.5) * 10,
                        y: runnerState.player.y + 35,
                        vx: (Math.random() - 0.5) * 5,
                        vy: (Math.random() - 0.5) * 5 - 1,
                        size: Math.random() * 4 + 2,
                        color: `hsl(${180 + Math.random() * 60}, 80%, 60%)`,
                        life: 20 + Math.random() * 15,
                        gravity: 0.05,
                    });
                }

                // Show jump indicator
                const jumpText = runnerState.player.jumps === 2 ? 'DOUBLE JUMP!' : 'JUMP!';
                spawnFloatingText(jumpText, runnerState.player.x + 10, runnerState.player.y - 20, 'runner-wrapper',
                    runnerState.player.jumps === 2 ? 'text-amber-400' : 'text-cyan-400');
            }
        }

        function updateRunnerHUD() {
            document.getElementById('runner-score').innerText = runnerState.score;
            document.getElementById('runner-highscore').innerText = STATE.highScores.runner;
            const heartsDisplay = '❤️'.repeat(Math.max(0, runnerState.hearts)) || '💀';
            document.getElementById('runner-hearts').innerText = heartsDisplay;

            document.getElementById('runner-stat-speed').innerHTML = `<span class="${runnerState.gameSpeed > 10 ? 'text-red-400' : runnerState.gameSpeed > 7 ? 'text-yellow-400' : 'text-cyan-400'}">${runnerState.gameSpeed.toFixed(1)}x Speed</span>`;
            document.getElementById('runner-stat-combo').innerText = runnerState.comboStreak > 1 ? `x${runnerState.comboStreak} Combo` :
                'None';
            document.getElementById('runner-stat-multiplier').innerText = `${getEquippedSkinObject().mult.toFixed(1)}x Gains`;

            // Session stats
            document.getElementById('runner-stat-jumps').innerText = runnerState.jumpCount || 0;
            document.getElementById('runner-stat-proteins').innerText = runnerState.proteinCount || 0;
            document.getElementById('runner-stat-distance').innerText = `${Math.floor(runnerState.distance || 0)}m`;

            // Combo display
            const comboDisplay = document.getElementById('runner-combo-display');
            const comboText = document.getElementById('runner-combo-text');
            if (runnerState.comboStreak >= 3) {
                comboText.innerText = `🔥 x${runnerState.comboStreak} COMBO`;
                comboDisplay.classList.remove('opacity-0');
                comboDisplay.classList.add('combo-pulse');
                setTimeout(() => comboDisplay.classList.remove('combo-pulse'), 300);
            } else {
                comboDisplay.classList.add('opacity-0');
            }
        }

        function updateRunnerFrame() {
            if (!runnerState.active) return;

            const canvas = runnerCanvas;
            const ctx = runnerCtx;
            const W = canvas.width;
            const H = canvas.height;
            const groundY = runnerState.groundY;

            // --- BACKGROUND ---
            // Sky gradient
            const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
            skyGrad.addColorStop(0, '#0a0e1a');
            skyGrad.addColorStop(0.5, '#0f1a2e');
            skyGrad.addColorStop(0.8, '#0d1520');
            skyGrad.addColorStop(1, '#060a12');
            ctx.fillStyle = skyGrad;
            ctx.fillRect(0, 0, W, H);

            // Stars twinkling
            if (runnerState.frameCount % 3 === 0) {
                const starCount = 30;
                for (let i = 0; i < starCount; i++) {
                    const sx = (i * 137.5 + runnerState.frameCount * 0.02) % W;
                    const sy = (i * 97.3 + 20) % (groundY - 40);
                    const brightness = 0.2 + 0.8 * Math.sin(i * 1.7 + runnerState.frameCount * 0.02);
                    ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.3})`;
                    ctx.fillRect(sx, sy, 1.5, 1.5);
                }
            }

            // Parallax far mountains
            ctx.globalAlpha = 0.15;
            ctx.fillStyle = '#1a2a4a';
            const mountainOffset = runnerState.backgroundX * 0.1;
            for (let i = 0; i < 4; i++) {
                const baseX = i * 200 - mountainOffset % 200;
                ctx.beginPath();
                ctx.moveTo(baseX - 80, groundY);
                ctx.quadraticCurveTo(baseX - 40, groundY - 60 - i * 10, baseX, groundY - 90 - i * 8);
                ctx.quadraticCurveTo(baseX + 40, groundY - 60 - i * 10, baseX + 80, groundY);
                ctx.fill();
            }
            ctx.globalAlpha = 1;

            // Moving grid lines (depth)
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
            ctx.lineWidth = 1;
            runnerState.backgroundX -= (runnerState.gameSpeed * 0.5);
            if (runnerState.backgroundX <= -60) runnerState.backgroundX = 0;

            for (let x = runnerState.backgroundX; x < W + 60; x += 60) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, groundY);
                ctx.stroke();
            }

            // Horizon glow
            const glowGrad = ctx.createLinearGradient(0, groundY - 20, 0, groundY + 10);
            glowGrad.addColorStop(0, 'rgba(16, 185, 129, 0)');
            glowGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.08)');
            glowGrad.addColorStop(1, 'rgba(16, 185, 129, 0.02)');
            ctx.fillStyle = glowGrad;
            ctx.fillRect(0, groundY - 20, W, 30);

            // Ground / Treadmill
            // Main ground
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, groundY, W, H - groundY);

            // Treadmill belt with moving texture
            const beltSpeed = runnerState.gameSpeed * 0.8;
            const beltStripeGap = Math.max(20, 40 - runnerState.gameSpeed * 1.5);
            const beltOffset = (runnerState.backgroundX * 1.2) % beltStripeGap;

            // Belt stripes - speed affects gap and brightness
            for (let x = -beltOffset; x < W + beltStripeGap; x += beltStripeGap) {
                const stripeBright = Math.sin(x * 0.5 + runnerState.frameCount * 0.03) * 0.08 + 0.12 + (runnerState.gameSpeed / 40);
                ctx.fillStyle = `rgba(34, 197, 94, ${Math.min(0.4, stripeBright)})`;
                ctx.fillRect(x, groundY + 4, beltStripeGap * 0.4, 4);
            }

            // Speed glow effect on belt at high speed
            if (runnerState.gameSpeed > 8) {
                const speedGlowAlpha = Math.min(0.3, (runnerState.gameSpeed - 8) * 0.04) * (0.5 + 0.5 * Math.sin(runnerState.frameCount * 0.05));
                const speedGlow = ctx.createLinearGradient(0, groundY, 0, groundY + 15);
                speedGlow.addColorStop(0, `rgba(251, 191, 36, ${speedGlowAlpha})`);
                speedGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
                ctx.fillStyle = speedGlow;
                ctx.fillRect(0, groundY, W, 15);
            }

            // Treadmill glow border
            ctx.shadowBlur = 12;
            ctx.shadowColor = 'rgba(16, 185, 129, 0.3)';
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, groundY);
            ctx.lineTo(W, groundY);
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Ground secondary glow
            const groundGlow = ctx.createLinearGradient(0, groundY, 0, groundY + 25);
            groundGlow.addColorStop(0, 'rgba(16, 185, 129, 0.08)');
            groundGlow.addColorStop(1, 'rgba(16, 185, 129, 0)');
            ctx.fillStyle = groundGlow;
            ctx.fillRect(0, groundY, W, 25);

            // --- PLAYER PHYSICS ---
            runnerState.player.velocityY += 0.45;
            runnerState.player.y += runnerState.player.velocityY;

            // Ground collision
            if (runnerState.player.y >= groundY - runnerState.player.h) {
                runnerState.player.y = groundY - runnerState.player.h;
                runnerState.player.velocityY = 0;
                runnerState.player.jumps = 0;
                runnerState.isRunning = true;

                // Running dust particles
                if (runnerState.frameCount % 3 === 0 && runnerState.gameSpeed > 2) {
                    runnerState.particles.push({
                        x: runnerState.player.x + 5,
                        y: groundY - 3,
                        vx: -(Math.random() * 0.8 + 0.3) * runnerState.gameSpeed * 0.5,
                        vy: -Math.random() * 1.2 - 0.3,
                        size: Math.random() * 4 + 2,
                        color: `rgba(200, 220, 255, ${0.1 + Math.random() * 0.15})`,
                        life: 12 + Math.random() * 10,
                        gravity: 0.02,
                    });
                }
            } else {
                runnerState.isRunning = false;
            }

            // Update running cycle
            if (runnerState.isRunning) {
                runnerState.runCycle += runnerState.gameSpeed * 0.08;
            } else {
                runnerState.runCycle += 0.05;
            }

            // Distance tracking
            runnerState.distance += runnerState.gameSpeed * 0.15;

            // Distance milestone check
            const distMilestones = [100, 250, 500, 1000, 2000];
            const currentDist = Math.floor(runnerState.distance);
            for (let mi = 0; mi < distMilestones.length; mi++) {
                if (currentDist === distMilestones[mi]) {
                    showNotification(`🏃 ${distMilestones[mi]}m DASHED! Bobby is on fire! 🔥`);
                }
            }

            // --- DRAW PLAYER ---
            const equipped = getEquippedSkinObject();
            const pX = runnerState.player.x + runnerState.player.w / 2;
            const pY = runnerState.player.y + runnerState.player.h / 2;

            // Player glow aura
            const auraSize = runnerState.player.w * 0.7 + Math.sin(runnerState.frameCount * 0.05) * 3;
            ctx.save();
            ctx.shadowBlur = 25;
            ctx.shadowColor = runnerState.isRunning ? 'rgba(56, 189, 248, 0.25)' : 'rgba(16, 185, 129, 0.25)';
            ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
            ctx.beginPath();
            ctx.arc(pX, pY, auraSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.restore();

            // Draw player emoji with squash/stretch
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            let scaleX = 1;
            let scaleY = 1;

            if (runnerState.isRunning) {
                // Running bounce squash
                const bouncePhase = Math.sin(runnerState.runCycle);
                scaleX = 1 + bouncePhase * 0.06;
                scaleY = 1 - bouncePhase * 0.06;
            } else if (runnerState.player.velocityY < -2) {
                // Jumping - stretch
                scaleX = 0.85;
                scaleY = 1.15;
            } else if (runnerState.player.velocityY > 2) {
                // Falling - squash
                scaleX = 1.15;
                scaleY = 0.85;
            }

            ctx.translate(pX, pY);
            ctx.scale(scaleX, scaleY);

            // Flip emoji direction for running skins
            const flipSkin = equipped.id === 'fit' || equipped.id === 'gorilla';
            if (flipSkin) ctx.scale(-1, 1);

            // Shadow under player
            ctx.shadowBlur = 20;
            ctx.shadowColor = 'rgba(16, 185, 129, 0.3)';
            ctx.font = `${runnerState.player.w * 1.2}px sans-serif`;
            // Stroke outline for visibility
            ctx.strokeStyle = 'rgba(0,0,0,0.6)';
            ctx.lineWidth = 3;
            ctx.strokeText(equipped.emoji, 0, 0);
            ctx.fillText(equipped.emoji, 0, 0);
            ctx.shadowBlur = 0;
            ctx.restore();

            // --- PARTICLES UPDATE ---
            for (let i = runnerState.particles.length - 1; i >= 0; i--) {
                const p = runnerState.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                if (p.gravity) p.vy += p.gravity;
                p.life--;

                ctx.fillStyle = p.color;
                ctx.globalAlpha = Math.min(1, p.life / 10);
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * (p.life / 20 + 0.3), 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;

                if (p.life <= 0) {
                    runnerState.particles.splice(i, 1);
                }
            }

            // --- DIFFICULTY LEVEL SYSTEM ---
            const score = runnerState.score;
            let diffLevel = 1;
            let diffLabel = 'Warm Up';
            if (score >= 1500) { diffLevel = 5; diffLabel = 'EXTREME'; }
            else if (score >= 800) { diffLevel = 4; diffLabel = 'Hardcore'; }
            else if (score >= 400) { diffLevel = 3; diffLabel = 'Intense'; }
            else if (score >= 150) { diffLevel = 2; diffLabel = 'Steady'; }
            runnerState.difficultyLevel = diffLevel;
            runnerState.difficultyLabel = diffLabel;

            // Difficulty level-up notification
            if (diffLevel > runnerState.lastDiffLevel) {
                runnerState.lastDiffLevel = diffLevel;
                const diffNotif = ['', 'Warm Up', 'Steady', 'Intense', 'Hardcore', 'EXTREME'];
                showNotification(`⚡ DIFFICULTY UP: ${diffNotif[diffLevel]} LV${diffLevel}!`);
            }

            // --- OBSTACLE SPAWNING (CONSISTENT WAVE SYSTEM) ---
            runnerState.spawnTimer++;
            // Spawn interval decreases with difficulty
            const spawnThresholds = [0, 58, 48, 38, 30, 22];
            const spawnInterval = spawnThresholds[diffLevel] || 40 + Math.floor(Math.random() * 8);

            if (runnerState.spawnTimer > spawnInterval) {
                runnerState.spawnTimer = 0;
                runnerState.spawnCycle++;

                // Determine how many obstacles this cycle (1 or 2)
                const canDoubleSpawn = diffLevel >= 2;
                const doubleChance = Math.min(0.6, 0.15 + (diffLevel - 1) * 0.1);
                const spawnCount = (canDoubleSpawn && Math.random() < doubleChance) ? 2 : 1;

                // Junk food pool - ground obstacles (must jump to avoid)
                const groundJunk = [
                    { emoji: '🍔', size: 32, name: 'Burger' },
                    { emoji: '🍕', size: 32, name: 'Pizza' },
                    { emoji: '🌭', size: 32, name: 'Hot Dog' },
                    { emoji: '🍪', size: 28, name: 'Cookie' },
                    { emoji: '🥧', size: 30, name: 'Pie' },
                    { emoji: '🍰', size: 30, name: 'Cake' },
                ];

                // Air junk pool - floating obstacles (trap for jumpers)
                const airJunk = [
                    { emoji: '🍩', size: 28, name: 'Donut' },
                    { emoji: '🍟', size: 28, name: 'Fries' },
                    { emoji: '🍿', size: 28, name: 'Popcorn' },
                ];

                // Protein pool - good collectibles at various heights
                const proteinItems = [
                    { emoji: '🥛', pts: 50, size: 28 },
                    { emoji: '💪', pts: 60, size: 28 },
                    { emoji: '🥩', pts: 55, size: 26 },
                ];

                for (let si = 0; si < spawnCount; si++) {
                    // For each spawn slot, decide what type
                    const roll = Math.random();
                    // Higher difficulty = more junk, less protein
                    const junkRatio = 0.30 + (diffLevel - 1) * 0.06; // 0.30 -> 0.54
                    const powerupRatio = 0.10;
                    const airJunkRatio = diffLevel >= 3 ? 0.08 : 0;

                    if (roll < junkRatio) {
                        // Ground junk food (must jump)
                        const chosen = groundJunk[Math.floor(Math.random() * groundJunk.length)];
                        const yOffset = (Math.random() - 0.5) * 4;
                        runnerState.obstacles.push({
                            type: 'junk',
                            x: W + 30 + si * 15,
                            y: groundY - chosen.size + yOffset,
                            w: chosen.size,
                            h: chosen.size,
                            emoji: chosen.emoji,
                            color: '#f43f5e',
                            glowColor: 'rgba(244, 63, 94, 0.6)',
                            speed: runnerState.gameSpeed,
                            points: -1,
                        });
                    } else if (roll < junkRatio + powerupRatio && diffLevel >= 2) {
                        // Power-up (rare, high reward)
                        runnerState.obstacles.push({
                            type: 'powerup',
                            x: W + 30 + si * 15,
                            y: groundY - 55 - Math.random() * 35,
                            w: 30,
                            h: 30,
                            emoji: '⚡',
                            color: '#fbbf24',
                            glowColor: 'rgba(251, 191, 36, 0.7)',
                            speed: runnerState.gameSpeed,
                            points: 100,
                        });
                    } else if (roll < junkRatio + powerupRatio + airJunkRatio && diffLevel >= 3) {
                        // Air junk food (floating - trap for jumpers)
                        const chosen = airJunk[Math.floor(Math.random() * airJunk.length)];
                        runnerState.obstacles.push({
                            type: 'junk',
                            x: W + 30 + si * 15,
                            y: groundY - 65 - Math.random() * 30,
                            w: chosen.size,
                            h: chosen.size,
                            emoji: chosen.emoji,
                            color: '#f97316',
                            glowColor: 'rgba(249, 115, 22, 0.5)',
                            speed: runnerState.gameSpeed,
                            points: -1,
                        });
                    } else {
                        // Protein / good item (must jump to catch)
                        const chosen = proteinItems[Math.floor(Math.random() * proteinItems.length)];
                        const heightVariety = Math.random();
                        let itemY;
                        if (heightVariety < 0.33) {
                            itemY = groundY - 30 - chosen.size; // Low (easy catch)
                        } else if (heightVariety < 0.66) {
                            itemY = groundY - 60 - chosen.size; // Mid
                        } else {
                            itemY = groundY - 90 - chosen.size; // High (must double jump!)
                        }
                        runnerState.obstacles.push({
                            type: 'protein',
                            x: W + 30 + si * 15 + Math.random() * 10,
                            y: itemY + (Math.random() - 0.5) * 8,
                            w: chosen.size,
                            h: chosen.size,
                            emoji: chosen.emoji,
                            color: '#10b981',
                            glowColor: 'rgba(16, 185, 129, 0.6)',
                            speed: runnerState.gameSpeed,
                            points: chosen.pts,
                        });
                    }
                }

                // Special obstacle for higher difficulties: flying bird formation
                if (diffLevel >= 4 && Math.random() < 0.15 && spawnCount === 1) {
                    // Add an air junk as a second obstacle
                    const chosen = airJunk[Math.floor(Math.random() * airJunk.length)];
                    runnerState.obstacles.push({
                        type: 'junk',
                        x: W + 60,
                        y: groundY - 70 - Math.random() * 25,
                        w: chosen.size,
                        h: chosen.size,
                        emoji: chosen.emoji,
                        color: '#f97316',
                        glowColor: 'rgba(249, 115, 22, 0.5)',
                        speed: runnerState.gameSpeed + 1.5,
                        points: -1,
                    });
                }
            }

            // --- UPDATE & DRAW OBSTACLES ---
            for (let i = runnerState.obstacles.length - 1; i >= 0; i--) {
                const obs = runnerState.obstacles[i];
                obs.x -= obs.speed || runnerState.gameSpeed;

                // Draw obstacle with glow
                const centerX = obs.x + obs.w / 2;
                const centerY = obs.y + obs.h / 2;

                // Glow aura
                ctx.save();
                ctx.shadowBlur = 25;
                ctx.shadowColor = obs.glowColor || obs.color;
                ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
                ctx.beginPath();
                ctx.arc(centerX, centerY, obs.w * 0.8, 0, Math.PI * 2);
                ctx.fill();

                // Ring
                ctx.strokeStyle = obs.color;
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.4 + 0.3 * Math.sin(runnerState.frameCount * 0.05 + i);
                ctx.stroke();
                ctx.globalAlpha = 1;
                ctx.shadowBlur = 0;
                ctx.restore();

                // Draw emoji
                ctx.save();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = `${obs.w * 1.1}px sans-serif`;

                // Stroke outline for visibility
                ctx.strokeStyle = 'rgba(0,0,0,0.7)';
                ctx.lineWidth = 3;
                const bobY = Math.sin(runnerState.frameCount * 0.04 + i * 1.5) * 2;
                ctx.strokeText(obs.emoji, centerX, centerY + bobY);
                ctx.fillText(obs.emoji, centerX, centerY + bobY);
                ctx.restore();

                // --- COLLISION DETECTION ---
                const playerRight = runnerState.player.x + runnerState.player.w;
                const playerBottom = runnerState.player.y + runnerState.player.h;
                const obsRight = obs.x + obs.w;
                const obsBottom = obs.y + obs.h;

                // More generous hitbox for player
                const hitPadding = 4;
                const hit = (runnerState.player.x + hitPadding < obsRight - hitPadding &&
                    playerRight - hitPadding > obs.x + hitPadding &&
                    runnerState.player.y + hitPadding < obsBottom - hitPadding &&
                    playerBottom - hitPadding > obs.y + hitPadding);

                if (hit) {
                    if (obs.type === 'protein') {
                        // Protein collect!
                        runnerState.comboStreak++;
                        runnerState.proteinCount++;
                        if (runnerState.comboStreak > runnerState.maxCombo) {
                            runnerState.maxCombo = runnerState.comboStreak;
                        }

                        const comboBonus = Math.min(runnerState.comboStreak, 10);
                        const ptsGained = obs.points || 50;
                        const totalPts = ptsGained + (comboBonus * 5);

                        runnerState.score += totalPts;
                        playSfx('powerup');

                        const label = runnerState.comboStreak >= 3 ?
                            `🔥 x${runnerState.comboStreak} +${totalPts}!` :
                            `+${totalPts} Protein!`;
                        spawnFloatingText(label, runnerState.player.x + 10, runnerState.player.y - 15, 'runner-wrapper',
                            runnerState.comboStreak >= 3 ? 'text-amber-400' : 'text-emerald-400');

                        // Explosion particles
                        for (let j = 0; j < 20; j++) {
                            const angle = Math.random() * Math.PI * 2;
                            const speed = Math.random() * 5 + 2;
                            runnerState.particles.push({
                                x: centerX,
                                y: centerY,
                                vx: Math.cos(angle) * speed,
                                vy: Math.sin(angle) * speed - 1,
                                size: Math.random() * 5 + 2,
                                color: `hsl(${140 + Math.random() * 40}, 90%, 60%)`,
                                life: 25 + Math.random() * 15,
                                gravity: 0.04,
                            });
                        }

                        // Speed boost on protein collect
                        runnerState.gameSpeed = Math.min(12, runnerState.gameSpeed + 0.08);

                    } else if (obs.type === 'powerup') {
                        // Power-up! Extra bonus + speed burst
                        runnerState.comboStreak += 2;
                        runnerState.proteinCount += 2;
                        const bonus = 100;
                        runnerState.score += bonus;
                        playSfx('cheer');
                        spawnFloatingText(`⚡ +${bonus} POWER!`, runnerState.player.x + 10, runnerState.player.y - 20,
                            'runner-wrapper', 'text-amber-400 font-extrabold text-base');

                        // Big explosion
                        for (let j = 0; j < 35; j++) {
                            const angle = Math.random() * Math.PI * 2;
                            const speed = Math.random() * 8 + 3;
                            runnerState.particles.push({
                                x: centerX,
                                y: centerY,
                                vx: Math.cos(angle) * speed,
                                vy: Math.sin(angle) * speed - 2,
                                size: Math.random() * 6 + 3,
                                color: `hsl(${40 + Math.random() * 30}, 100%, 60%)`,
                                life: 30 + Math.random() * 20,
                                gravity: 0.03,
                            });
                        }
                        runnerState.gameSpeed = Math.min(14, runnerState.gameSpeed + 0.3);
                        triggerScreenShake('runner-wrapper');

                    } else {
                        // Junk food hit!
                        runnerState.hearts--;
                        runnerState.comboStreak = 0;
                        playSfx('fail');
                        triggerScreenShake('runner-wrapper');
                        // Flash screen
                        const flashEl = document.getElementById('runner-flash');
                        if (flashEl) {
                            flashEl.classList.remove('opacity-0');
                            flashEl.classList.add('opacity-100');
                            setTimeout(() => {
                                flashEl.classList.remove('opacity-100');
                                flashEl.classList.add('opacity-0');
                            }, 150);
                        }
                        spawnFloatingText("💔 -1 Heart!", runnerState.player.x + 10, runnerState.player.y - 15,
                            'runner-wrapper', 'text-rose-500 font-extrabold');

                        // Red particles
                        for (let j = 0; j < 18; j++) {
                            const angle = Math.random() * Math.PI * 2;
                            const speed = Math.random() * 6 + 2;
                            runnerState.particles.push({
                                x: centerX,
                                y: centerY,
                                vx: Math.cos(angle) * speed,
                                vy: Math.sin(angle) * speed - 1,
                                size: Math.random() * 5 + 2,
                                color: `hsl(${340 + Math.random() * 20}, 90%, 55%)`,
                                life: 20 + Math.random() * 15,
                                gravity: 0.05,
                            });
                        }

                        // Slow down a bit on hit
                        runnerState.gameSpeed = Math.max(3, runnerState.gameSpeed - 0.3);

                        updateRunnerHUD();
                        if (runnerState.hearts <= 0) {
                            endRunnerGame();
                            return;
                        }
                    }

                    runnerState.obstacles.splice(i, 1);
                    updateRunnerHUD();
                    continue;
                }

                // Remove offscreen
                if (obs.x + obs.w < -20) {
                    // Passed junk food gives a small penalty avoidance bonus
                    if (obs.type === 'junk') {
                        runnerState.score += 5;
                        updateRunnerHUD();
                    }
                    runnerState.obstacles.splice(i, 1);
                }
            }

            // --- DIFFICULTY SCALING (LEVEL-BASED) ---
            // Speed caps by difficulty level
            const speedCaps = [0, 6.0, 8.0, 10.5, 13.0, 16.0];
            const speedCap = speedCaps[diffLevel] || 16;
            const baseSpeed = 4.0 + (diffLevel - 1) * 0.8;

            // Gradually increase speed toward the cap
            if (runnerState.gameSpeed < speedCap) {
                runnerState.gameSpeed += 0.008 + (diffLevel - 1) * 0.003;
                if (runnerState.gameSpeed > speedCap) runnerState.gameSpeed = speedCap;
            }

            // Speed mini-boosts on protein catch (handled in collision)
            // Speed penalty on junk hit (handled in collision)

            // Update difficulty in HUD every 30 frames
            if (runnerState.frameCount % 30 === 0) {
                const diffEl = document.getElementById('runner-stat-difficulty');
                if (diffEl) {
                    const diffColors = ['', 'text-cyan-400', 'text-emerald-400', 'text-yellow-400', 'text-orange-400', 'text-rose-400'];
                    diffEl.className = `font-mono ${diffColors[diffLevel] || 'text-cyan-400'}`;
                    diffEl.innerText = `Lv${diffLevel} - ${diffLabel}`;
                }
            }

            // Update frame counter
            runnerState.frameCount++;

            // Check game over
            if (runnerState.hearts <= 0) {
                endRunnerGame();
                return;
            }

            // Update HUD periodically
            if (runnerState.frameCount % 10 === 0) {
                updateRunnerHUD();
            }

            requestAnimationFrame(updateRunnerFrame);
        }

        function endRunnerGame() {
            if (runnerState.isDead) return;
            runnerState.isDead = true;
            runnerState.active = false;
            playSfx('fail');
            triggerScreenShake('runner-wrapper');

            // Best High Scores
            if (runnerState.score > STATE.highScores.runner) {
                STATE.highScores.runner = runnerState.score;
                showNotification(`🏆 New Cardio Dash High Score: ${runnerState.score}!`);
            }

            const skinObj = getEquippedSkinObject();
            const basePayout = Math.floor(runnerState.score * 0.45) + Math.floor(runnerState.proteinCount * 2);
            const totalPayout = Math.floor(basePayout * skinObj.mult);

            STATE.musclePoints += totalPayout;
            saveState();

            document.getElementById('runner-bonus-earned').innerText =
                `+${totalPayout.toLocaleString()} Muscle Points (Multiplied by ${skinObj.emoji})`;
            document.getElementById('runner-over-overlay').classList.remove('hidden');

            // Show final stats in game over
            document.querySelector('#runner-over-overlay .text-xs.text-slate-300').innerHTML =
                `Bobby ran <span class="text-amber-400 font-bold">${Math.floor(runnerState.distance)}m</span>, collected <span class="text-emerald-400 font-bold">${runnerState.proteinCount}</span> proteins, and achieved a max combo of <span class="text-amber-400 font-bold">x${runnerState.maxCombo}</span>!`;

            updateGlobalDashboard();
        }


        // =========================================================================
        // GAME 2: IRON SQUAT SLAM (unchanged)
        // =========================================================================
        let slamState = {
            active: false,
            score: 0,
            cursorLeft: 0,
            direction: 1,
            speed: 1.8,
            streak: 0,
            maxStreak: 0,
            plates: 1
        };
        let slamRequestFrameId = null;

        function startSlamGame() {
            initAudio();
            document.getElementById('slam-tutorial').classList.add('hidden');
            slamState.active = true;
            sessionGames.slam = true;
            slamState.score = 0;
            slamState.streak = 0;
            slamState.maxStreak = 0;
            slamState.plates = 1;
            slamState.speed = 1.8;
            slamState.cursorLeft = 0;
            slamState.direction = 1;

            // Show best score
            const best = parseInt(localStorage.getItem('ge_best_slam') || '0');
            document.getElementById('slam-highscore').innerText = best.toLocaleString();

            updateSlamHUD();
            loopSlamCursor();
        }

        function updateSlamHUD() {
            document.getElementById('slam-streak').innerText = slamState.streak;
            // Best streak display
            const bestStreakRow = document.getElementById('slam-best-streak-row');
            const bestStreakEl = document.getElementById('slam-best-streak');
            if (slamState.maxStreak >= 2) {
                bestStreakRow.classList.remove('hidden');
                bestStreakEl.innerText = `${slamState.maxStreak} 🔥`;
            } else {
                bestStreakRow.classList.add('hidden');
            }
            // Fire emoji escalation
            const fireEl = document.getElementById('slam-streak-fire');
            if (fireEl) {
                if (slamState.streak >= 10) fireEl.innerText = '🔥🔥🔥🔥🔥';
                else if (slamState.streak >= 7) fireEl.innerText = '🔥🔥🔥🔥';
                else if (slamState.streak >= 5) fireEl.innerText = '🔥🔥🔥';
                else if (slamState.streak >= 3) fireEl.innerText = '🔥🔥';
                else if (slamState.streak >= 1) fireEl.innerText = '🔥';
                else fireEl.innerText = '';
            }
            const scoreEl = document.getElementById('slam-score');
            if (scoreEl) scoreEl.innerText = slamState.score.toLocaleString();
            document.getElementById('slam-plates').innerText =
                `${slamState.plates} Heavy Plate${slamState.plates > 1 ? 's' : ''} (${50 * slamState.plates}kg)`;

            const leftStack = document.getElementById('left-plates-stack');
            const rightStack = document.getElementById('right-plates-stack');
            leftStack.innerHTML = '';
            rightStack.innerHTML = '';

            for (let i = 0; i < slamState.plates; i++) {
                const leftPlate = document.createElement('div');
                leftPlate.className = 'w-3 h-14 border border-rose-900 rounded-lg shadow shadow-rose-500/40';
                leftPlate.style.backgroundColor = i % 2 === 0 ? '#f43f5e' : '#fda4af';
                leftStack.appendChild(leftPlate);

                const rightPlate = document.createElement('div');
                rightPlate.className = 'w-3 h-14 border border-rose-900 rounded-lg shadow shadow-rose-500/40';
                rightPlate.style.backgroundColor = i % 2 === 0 ? '#f43f5e' : '#fda4af';
                rightStack.appendChild(rightPlate);
            }
        }

        function loopSlamCursor() {
            if (!slamState.active) return;
            if (slamRequestFrameId) cancelAnimationFrame(slamRequestFrameId);

            function runStep() {
                if (!slamState.active) return;

                slamState.cursorLeft += (slamState.speed * slamState.direction);
                if (slamState.cursorLeft >= 98.5) {
                    slamState.cursorLeft = 98.5;
                    slamState.direction = -1;
                } else if (slamState.cursorLeft <= 0) {
                    slamState.cursorLeft = 0;
                    slamState.direction = 1;
                }

                const cursorEl = document.getElementById('slam-cursor');
                if (cursorEl) {
                    cursorEl.style.left = `${slamState.cursorLeft}%`;
                    // Visual feedback: cursor changes color based on zone
                    const isPerfect = (slamState.cursorLeft >= 42 && slamState.cursorLeft <= 58);
                    const isGood = (slamState.cursorLeft >= 25 && slamState.cursorLeft <= 75);
                    if (isPerfect) {
                        cursorEl.style.backgroundColor = '#34d399';
                        cursorEl.style.boxShadow = '0 0 12px rgba(52,211,153,0.9)';
                    } else if (isGood) {
                        cursorEl.style.backgroundColor = '#fbbf24';
                        cursorEl.style.boxShadow = '0 0 8px rgba(251,191,36,0.7)';
                    } else {
                        cursorEl.style.backgroundColor = '#f43f5e';
                        cursorEl.style.boxShadow = '0 0 6px rgba(244,63,94,0.5)';
                    }
                }

                slamRequestFrameId = requestAnimationFrame(runStep);
            }
            slamRequestFrameId = requestAnimationFrame(runStep);
        }

        function triggerSlamStop() {
            if (!slamState.active) return;

            slamState.active = false;
            cancelAnimationFrame(slamRequestFrameId);

            const hit = slamState.cursorLeft;
            const isPerfect = (hit >= 42 && hit <= 58);
            const isGood = (hit >= 25 && hit <= 75);

            const lifter = document.getElementById('slam-lifter-avatar');
            const face = document.getElementById('slam-lifter-face');
            const barbell = document.getElementById('barbell-graphic');
            const bubble = document.getElementById('slam-bubble');

            if (isPerfect) {
                slamState.streak++;
                if (slamState.streak > slamState.maxStreak) {
                    slamState.maxStreak = slamState.streak;
                }
                if (slamState.streak % 2 === 0 && slamState.plates < 8) {
                    slamState.plates++;
                }
                // Smoother speed curve with cap
                const speedCap = 8.0;
                const speedIncrement = Math.max(0.15, 0.42 - (slamState.speed - 1.8) * 0.04);
                slamState.speed = Math.min(speedCap, slamState.speed + speedIncrement);

                const skinObj = getEquippedSkinObject();
                const ptsEarned = Math.floor((120 * slamState.plates) * skinObj.mult);
                STATE.musclePoints += ptsEarned;
                slamState.score += ptsEarned;

                // Update high score
                if (slamState.score > (STATE.highScores.slam || 0)) {
                    STATE.highScores.slam = slamState.score;
                    document.getElementById('slam-highscore').innerText = slamState.score.toLocaleString();
                    showNotification(`New Squat Slam High Score: ${slamState.score.toLocaleString()}! 🏆`);
                }

                saveState();

                playSfx('slam_heavy');
                playSfx('cheer');
                triggerScreenShake('slam-wrapper-container');

                face.innerText = '🤩';
                bubble.innerText = `PERFECT SLAM! +${ptsEarned}💪`;
                bubble.style.color = '#34d399';
                bubble.style.borderColor = 'rgba(52,211,153,0.4)';
                bubble.style.opacity = '1';

                lifter.style.transform = 'translateY(24px) scaleY(0.85)';
                barbell.style.transform = 'translateY(24px)';

                for (let j = 0; j < 30; j++) {
                    spawnPerfectSparkle();
                }

                setTimeout(() => {
                    lifter.style.transform = 'translateY(-30px) scaleY(1.15)';
                    barbell.style.transform = 'translateY(-30px)';
                    setTimeout(() => {
                        lifter.style.transform = '';
                        barbell.style.transform = '';
                        face.innerText = '😀';
                        bubble.style.opacity = '0';

                        slamState.active = true;
                        slamState.direction = 1;
                        updateSlamHUD();
                        loopSlamCursor();
                    }, 350);
                }, 250);

            } else if (isGood) {
                slamState.streak++;
                if (slamState.streak > slamState.maxStreak) {
                    slamState.maxStreak = slamState.streak;
                }
                const speedCap = 8.0;
                slamState.speed = Math.min(speedCap, slamState.speed + 0.15);

                const skinObj = getEquippedSkinObject();
                const ptsEarned = Math.floor((45 * slamState.plates) * skinObj.mult);
                STATE.musclePoints += ptsEarned;
                slamState.score += ptsEarned;

                // Update high score
                if (slamState.score > (STATE.highScores.slam || 0)) {
                    STATE.highScores.slam = slamState.score;
                    document.getElementById('slam-highscore').innerText = slamState.score.toLocaleString();
                }

                saveState();

                playSfx('slam_heavy');
                face.innerText = '😅';
                bubble.innerText = `GOOD EFFORT! +${ptsEarned}💪`;
                bubble.style.color = '#fbbf24';
                bubble.style.borderColor = 'rgba(251,191,36,0.4)';
                bubble.style.opacity = '1';

                lifter.style.transform = 'translateY(12px)';
                barbell.style.transform = 'translateY(12px)';

                setTimeout(() => {
                    lifter.style.transform = '';
                    barbell.style.transform = '';
                    face.innerText = '😀';
                    bubble.style.opacity = '0';

                    slamState.active = true;
                    updateSlamHUD();
                    loopSlamCursor();
                }, 450);

            } else {
                playSfx('fail');
                triggerScreenShake('slam-wrapper-container');
                // Red flash on miss
                const sFlash = document.getElementById('slam-flash');
                if (sFlash) {
                    sFlash.classList.remove('opacity-0');
                    sFlash.classList.add('opacity-100');
                    setTimeout(() => { sFlash.classList.remove('opacity-100'); sFlash.classList.add('opacity-0'); }, 200);
                }
                face.innerText = '😵';
                bubble.innerText = 'CRASH FAILURE! ❌';
                bubble.style.color = '#f43f5e';
                bubble.style.borderColor = 'rgba(244,63,94,0.4)';
                bubble.style.opacity = '1';

                lifter.style.transform = 'rotate(-30deg) translateY(18px)';
                barbell.style.transform = 'rotate(18deg) translateY(50px)';

                setTimeout(() => {
                    lifter.style.transform = '';
                    barbell.style.transform = '';
                    face.innerText = '😀';
                    bubble.style.opacity = '0';

                    slamState.streak = 0;
                    slamState.plates = Math.max(1, slamState.plates - 1);
                    slamState.speed = Math.max(2.0, slamState.speed - 0.4);

                    slamState.active = true;
                    updateSlamHUD();
                    loopSlamCursor();
                }, 1300);
            }

            updateGlobalDashboard();
        }

        function spawnPerfectSparkle() {
            const container = document.getElementById('slam-wrapper-container');
            const sparkle = document.createElement('div');
            const isStar = Math.random() > 0.6;
            sparkle.className = `absolute pointer-events-none z-15 ${isStar ? '' : 'rounded-full'}`;
            const size = Math.random() * 6 + 3;
            sparkle.style.width = `${size}px`;
            sparkle.style.height = `${size}px`;
            if (!isStar) sparkle.style.borderRadius = '50%';
            const hue = Math.random() * 60 + 80; // green to yellow range
            sparkle.style.backgroundColor = `hsl(${hue}, 100%, 65%)`;
            sparkle.style.boxShadow = `0 0 6px hsl(${hue}, 100%, 65%)`;
            sparkle.style.opacity = '0.9';

            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 7 + 4;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed - 2;

            let x = container.clientWidth / 2;
            let y = container.clientHeight / 2 - 20;
            sparkle.style.left = `${x}px`;
            sparkle.style.top = `${y}px`;

            container.appendChild(sparkle);

            let frame = 0;

            function moveSparkle() {
                x += vx;
                y += vy;
                frame++;
                sparkle.style.left = `${x}px`;
                sparkle.style.top = `${y}px`;
                sparkle.style.opacity = (1 - (frame / 45)).toString();
                sparkle.style.transform = `rotate(${frame * 15}deg) scale(${1 - frame / 50})`;

                if (frame < 45) {
                    requestAnimationFrame(moveSparkle);
                } else {
                    sparkle.remove();
                }
            }
            requestAnimationFrame(moveSparkle);
        }


        // =========================================================================
        // GAME 3: PROTEIN CATCHER (unchanged)
        // =========================================================================
        const catcherCanvas = document.getElementById('catcher-canvas');
        const catcherCtx = catcherCanvas.getContext('2d');

        let catcherState = {
            active: false,
            score: 0,
            timeLeft: 30,
            basket: { x: 150, y: 270, w: 75, h: 42, speed: 18, targetX: 150, smoothing: 0.18 },
            items: [],
            particles: [],
            shakeJuice: 0,
            spawnTimer: 0,
            combo: 0,
            maxCombo: 0
        };

        function resizeCatcher() {
            if (!catcherCanvas) return;
            catcherCanvas.width = catcherCanvas.parentElement.clientWidth;
            catcherCanvas.height = 320;
            catcherState.basket.y = catcherCanvas.height - 48;
        }

        const catcherContainer = document.getElementById('catcher-field-container');

        catcherContainer.addEventListener('mousemove', (e) => {
            if (!catcherState.active) return;
            const rect = catcherCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            catcherState.basket.targetX = Math.max(0, Math.min(catcherCanvas.width - catcherState.basket.w, x - catcherState.basket.w /
            2));
        });

        catcherContainer.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (!catcherState.active) return;
            const rect = catcherCanvas.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            catcherState.basket.targetX = Math.max(0, Math.min(catcherCanvas.width - catcherState.basket.w, x - catcherState.basket.w / 2));
        }, { passive: false });

        catcherContainer.addEventListener('touchmove', (e) => {
            if (!catcherState.active) return;
            e.preventDefault();
            const rect = catcherCanvas.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            catcherState.basket.targetX = Math.max(0, Math.min(catcherCanvas.width - catcherState.basket.w, x - catcherState.basket.w /
            2));
        }, { passive: false });

        window.addEventListener('keydown', (e) => {
            if (!catcherState.active) return;
            if (e.code === 'ArrowLeft') {
                catcherState.basket.targetX = Math.max(0, catcherState.basket.targetX - catcherState.basket.speed * 3);
            } else if (e.code === 'ArrowRight') {
                catcherState.basket.targetX = Math.min(catcherCanvas.width - catcherState.basket.w, catcherState.basket.targetX + catcherState.basket
                    .speed * 3);
            }
        });

        let catcherCountdownInterval = null;

        function startCatcherGame() {
            initAudio();
            resizeCatcher(); // Ensure canvas is sized
            document.getElementById('catcher-tutorial').classList.add('hidden');
            document.getElementById('catcher-over-overlay').classList.add('hidden');

            catcherState.active = true;
            sessionGames.catcher = true;
            catcherState.score = 0;
            catcherState.timeLeft = 30;
            catcherState.shakeJuice = 0;
            catcherState.items = [];
            catcherState.particles = [];
            catcherState.combo = 0;
            catcherState.maxCombo = 0;
            catcherState.basket.x = catcherCanvas.width / 2 - catcherState.basket.w / 2;
            catcherState.basket.targetX = catcherState.basket.x;

            updateCatcherHUD();
            playSfx('success');

            if (catcherCountdownInterval) clearInterval(catcherCountdownInterval);
            catcherCountdownInterval = setInterval(() => {
                if (!catcherState.active) return;
                catcherState.timeLeft--;
                updateCatcherHUD();

                if (catcherState.timeLeft <= 0) {
                    endCatcherGame();
                }
            }, 1000);

            requestAnimationFrame(updateCatcherFrame);
        }

        function updateCatcherHUD() {
            document.getElementById('catcher-score').innerText = catcherState.score;
            document.getElementById('catcher-time').innerText = `${catcherState.timeLeft}s`;
            document.getElementById('catcher-shake-juice').innerText = `${catcherState.shakeJuice}%`;
            document.getElementById('liquid-shaker-gauge').style.height = `${catcherState.shakeJuice}%`;
            const bestEl = document.getElementById('catcher-highscore');
            if (bestEl) bestEl.innerText = (STATE.highScores.catcher || 0).toLocaleString();
            // Combo display
            const comboEl = document.getElementById('catcher-combo-display');
            if (comboEl) {
                comboEl.innerText = catcherState.combo > 0 ? `${catcherState.combo}` : '0';
                comboEl.style.color = catcherState.combo >= 5 ? '#f59e0b' : catcherState.combo >= 3 ? '#fbbf24' : '#10b981';
            }
        }

        function updateCatcherFrame() {
            if (!catcherState.active) return;
            if (catcherCanvas.width < 10) return; // Guard: canvas not sized yet

            // Input smoothing: lerp basket toward target position
            const b = catcherState.basket;
            b.x += (b.targetX - b.x) * b.smoothing;

            const ctx = catcherCtx;
            const canvas = catcherCanvas;
            const W = canvas.width;
            const H = canvas.height;

            ctx.fillStyle = '#060a12';
            ctx.fillRect(0, 0, W, H);

            // Background gradient
            const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
            bgGrad.addColorStop(0, '#060a12');
            bgGrad.addColorStop(0.5, '#0a1a2e');
            bgGrad.addColorStop(0.8, '#0d1520');
            bgGrad.addColorStop(1, '#060a12');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, W, H);

            // Animated bubbles in background
            const bubbleTime = Date.now() / 1000;
            for (let bi = 0; bi < 8; bi++) {
                const bx = (bi * 87 + bubbleTime * 15 * (bi % 3 + 1)) % W;
                const by = (H - 20) - ((bubbleTime * 25 + bi * 130) % H);
                const bsize = 4 + (bi % 3) * 3;
                ctx.fillStyle = `rgba(16, 185, 129, ${0.03 + Math.sin(bubbleTime + bi) * 0.02})`;
                ctx.beginPath();
                ctx.arc(bx, by, bsize, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.strokeStyle = 'rgba(16, 185, 129, 0.05)';
            ctx.lineWidth = 1;
            for (let x = 0; x < W; x += 30) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, H);
                ctx.stroke();
            }

            // Draw basket / shaker cup
            ctx.save();
            // Shaker body
            const bx = catcherState.basket.x;
            const by = catcherState.basket.y;
            const bw = catcherState.basket.w;
            const bh = catcherState.basket.h;

            // Glow behind shaker
            ctx.shadowBlur = 25;
            ctx.shadowColor = 'rgba(16, 185, 129, 0.3)';
            ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
            ctx.beginPath();
            ctx.moveTo(bx + 4, by);
            ctx.lineTo(bx + bw - 4, by);
            ctx.quadraticCurveTo(bx + bw + 4, by + bh * 0.3, bx + bw - 6, by + bh);
            ctx.lineTo(bx + 6, by + bh);
            ctx.quadraticCurveTo(bx - 4, by + bh * 0.3, bx + 4, by);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;

            // Shaker rim
            ctx.strokeStyle = '#34d399';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(bx, by + 2);
            ctx.lineTo(bx + bw, by + 2);
            ctx.stroke();

            // Shaker body outline
            ctx.strokeStyle = 'rgba(52, 211, 153, 0.6)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(bx + 4, by + 2);
            ctx.quadraticCurveTo(bx - 2, by + bh * 0.3, bx + 6, by + bh);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(bx + bw - 4, by + 2);
            ctx.quadraticCurveTo(bx + bw + 2, by + bh * 0.3, bx + bw - 6, by + bh);
            ctx.stroke();
            ctx.restore();

            // Liquid fill inside shaker
            if (catcherState.shakeJuice > 0) {
                ctx.save();
                const fillHeight = (bh - 10) * (catcherState.shakeJuice / 100);
                ctx.fillStyle = `rgba(16, 185, 129, ${0.2 + catcherState.shakeJuice / 200})`;
                ctx.beginPath();
                ctx.moveTo(bx + 8, by + bh - fillHeight);
                ctx.lineTo(bx + 10, by + bh);
                ctx.lineTo(bx + bw - 10, by + bh);
                ctx.lineTo(bx + bw - 8, by + bh - fillHeight);
                ctx.quadraticCurveTo(bx + bw / 2, by + bh - fillHeight + 5, bx + 8, by + bh - fillHeight);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }

            // Liquid level gauge (vertical bar on side)
            ctx.save();
            const gaugeX = bx + bw + 8;
            const gaugeH = 60;
            const gaugeY = by + bh / 2 - gaugeH / 2;
            ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
            ctx.strokeStyle = 'rgba(52, 211, 153, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(gaugeX + 4, gaugeY);
            ctx.lineTo(gaugeX + 4, gaugeY + gaugeH);
            ctx.stroke();
            ctx.fillRect(gaugeX, gaugeY, 8, gaugeH);
            const fillGaugeH = (gaugeH - 4) * (catcherState.shakeJuice / 100);
            ctx.fillStyle = '#10b981';
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#10b981';
            ctx.fillRect(gaugeX + 2, gaugeY + gaugeH - 2 - fillGaugeH, 4, fillGaugeH);
            ctx.shadowBlur = 0;
            ctx.restore();

            // Particles
            for (let i = catcherState.particles.length - 1; i >= 0; i--) {
                const p = catcherState.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life--;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                if (p.life <= 0) catcherState.particles.splice(i, 1);
            }

            // Spawn items
            catcherState.spawnTimer++;
            const speedScale = 1 + (30 - catcherState.timeLeft) * 0.05;
            if (catcherState.spawnTimer > Math.max(15, 26 - speedScale * 2)) {
                catcherState.spawnTimer = 0;

                const types = [
                    { emoji: '🍌', weight: 'good', pts: 10, color: '#facc15', rarity: 25 },
                    { emoji: '🥚', weight: 'good', pts: 15, color: '#f8fafc', rarity: 22 },
                    { emoji: '🥜', weight: 'good', pts: 20, color: '#fb923c', rarity: 20 },
                    { emoji: '🥤', weight: 'good', pts: 35, color: '#38bdf8', rarity: 15 },
                    { emoji: '🍟', weight: 'bad', pts: -20, color: '#f43f5e', rarity: 10 },
                    { emoji: '🍕', weight: 'bad', pts: -30, color: '#f43f5e', rarity: 7 },
                    { emoji: '🏆', weight: 'golden', pts: 100, color: '#fbbf24', rarity: 1 }, // Rare golden!
                ];
                // Weighted random selection
                const totalWeight = types.reduce((s, t) => s + t.rarity, 0);
                let rollW = Math.random() * totalWeight;
                let chosen = types[0];
                for (let ti = 0; ti < types.length; ti++) {
                    rollW -= types[ti].rarity;
                    if (rollW <= 0) { chosen = types[ti]; break; }
                }
                catcherState.items.push({
                    x: Math.random() * (W - 35) + 15,
                    y: -15,
                    speed: (Math.random() * 1.8 + 2.2) * speedScale,
                    emoji: chosen.emoji,
                    weight: chosen.weight,
                    pts: chosen.pts,
                    color: chosen.color,
                    w: 28,
                    h: 28
                });
            }

            // Update items
            for (let i = catcherState.items.length - 1; i >= 0; i--) {
                const item = catcherState.items[i];
                item.y += item.speed;

                ctx.save();
                ctx.shadowBlur = 15;
                ctx.shadowColor = item.color;
                ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
                ctx.beginPath();
                ctx.arc(item.x, item.y, 18, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = item.color;
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.restore();

                ctx.save();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = '24px sans-serif';
                ctx.strokeStyle = 'rgba(0,0,0,0.7)';
                ctx.lineWidth = 3;
                ctx.strokeText(item.emoji, item.x, item.y);
                ctx.fillText(item.emoji, item.x, item.y);
                ctx.restore();

                const hitX = (item.x >= catcherState.basket.x - 5 && item.x <= catcherState.basket.x + catcherState.basket.w +
                5);
                const hitY = (item.y >= catcherState.basket.y - 10 && item.y <= catcherState.basket.y + 15);

                if (hitX && hitY) {
                    catcherState.score += item.pts;
                    if (item.weight === 'golden') {
                        // Rare golden item - big celebration!
                        catcherState.combo += 3;
                        if (catcherState.combo > catcherState.maxCombo) catcherState.maxCombo = catcherState.combo;
                        catcherState.shakeJuice = Math.min(100, catcherState.shakeJuice + 25);
                        playSfx('cheer');
                        playSfx('levelup');
                        triggerScreenShake('catcher-field-container');
                        showNotification('🌟 GOLDEN PROTEIN! +100 MEGA BONUS! 🌟');
                        spawnFloatingText('🏆 GOLDEN +100!', item.x - 20, item.y - 25, 'catcher-field-container', 'text-yellow-400 font-extrabold text-base');
                        for (let b = 0; b < 30; b++) {
                            catcherState.particles.push({
                                x: item.x,
                                y: catcherState.basket.y,
                                vx: (Math.random() - 0.5) * 8,
                                vy: -Math.random() * 8 - 3,
                                size: Math.random() * 6 + 2,
                                color: `hsl(${40 + Math.random() * 20}, 100%, 60%)`,
                                life: 35
                            });
                        }
                    } else if (item.weight === 'good') {
                        catcherState.combo++;
                        if (catcherState.combo > catcherState.maxCombo) catcherState.maxCombo = catcherState.combo;
                        // Combo bonus
                        if (catcherState.combo >= 3) {
                            const comboBonus = Math.floor(item.pts * 0.3 * catcherState.combo);
                            catcherState.score += comboBonus;
                            spawnFloatingText(`🔥 x${catcherState.combo} +${comboBonus}!`, item.x + 20, item.y - 25, 'catcher-field-container',
                                'text-amber-400 font-extrabold');
                        }
                        playSfx('powerup');
                        catcherState.shakeJuice = Math.min(100, catcherState.shakeJuice + 10 + Math.min(catcherState.combo, 5));

                        for (let b = 0; b < 10; b++) {
                            catcherState.particles.push({
                                x: item.x,
                                y: catcherState.basket.y,
                                vx: (Math.random() - 0.5) * 4,
                                vy: -Math.random() * 5 - 2,
                                size: Math.random() * 4 + 1.5,
                                color: item.color,
                                life: 25
                            });
                        }
                        spawnFloatingText(`+${item.pts} Protein!`, item.x - 20, item.y - 15, 'catcher-field-container',
                            'text-emerald-400 font-extrabold');
                    } else {
                        catcherState.combo = 0;
                        playSfx('fail');
                        catcherState.shakeJuice = Math.max(0, catcherState.shakeJuice - 15);
                        triggerScreenShake('catcher-field-container');
                        spawnFloatingText(`${item.pts} Bad Fat!`, item.x - 20, item.y - 15, 'catcher-field-container',
                            'text-rose-500 font-extrabold');

                        for (let b = 0; b < 10; b++) {
                            catcherState.particles.push({
                                x: item.x,
                                y: catcherState.basket.y,
                                vx: (Math.random() - 0.5) * 5,
                                vy: -Math.random() * 4 - 1,
                                size: Math.random() * 4 + 1,
                                color: '#f43f5e',
                                life: 20
                            });
                        }
                    }
                    catcherState.items.splice(i, 1);
                    updateCatcherHUD();
                    continue;
                }

                if (item.y > H) {
                    catcherState.items.splice(i, 1);
                }
            }

            // Jackpot
            if (catcherState.shakeJuice >= 100) {
                catcherState.shakeJuice = 0;
                catcherState.score += 200;
                playSfx('success');
                playSfx('cheer');
                triggerScreenShake('catcher-field-container');
                showNotification("💥 WHEY JACKPOT! +200 POINTS! 💥");

                for (let c = 0; c < 55; c++) {
                    catcherState.particles.push({
                        x: W / 2 + (Math.random() - 0.5) * 250,
                        y: H / 2,
                        vx: (Math.random() - 0.5) * 10,
                        vy: -Math.random() * 12 - 2,
                        size: Math.random() * 8 + 2,
                        color: `hsl(${Math.random() * 360}, 100%, 60%)`,
                        life: 55
                    });
                }
                spawnFloatingText('💥 JACKPOT! +200!', W / 2 - 80, H / 2 - 40, 'catcher-field-container', 'text-yellow-400 font-extrabold text-lg');
                updateCatcherHUD();
            }

            requestAnimationFrame(updateCatcherFrame);
        }

        function endCatcherGame() {
            catcherState.active = false;
            clearInterval(catcherCountdownInterval);

            const isPositive = catcherState.score > 0;
            if (isPositive) {
                playSfx('success');
            } else {
                playSfx('fail');
            }
            triggerScreenShake('catcher-field-container');

            if (catcherState.score > STATE.highScores.catcher) {
                STATE.highScores.catcher = catcherState.score;
                showNotification(`New Protein Catcher High Score: ${catcherState.score.toLocaleString()}! 🏆`);
            }

            const skinObj = getEquippedSkinObject();
            const basePayout = Math.max(0, Math.floor(catcherState.score * 0.4));
            const totalPayout = Math.floor(basePayout * skinObj.mult);

            STATE.musclePoints += totalPayout;
            saveState();

            document.getElementById('catcher-bonus-earned').innerText =
                `+${totalPayout.toLocaleString()} Muscle Points (${skinObj.emoji} ${skinObj.mult}x Multiplier)`;
            document.getElementById('catcher-end-combo').innerText =
                catcherState.maxCombo > 0 ? `${catcherState.maxCombo}` : '0';
            document.getElementById('catcher-over-overlay').classList.remove('hidden');
            updateGlobalDashboard();
        }


        // =========================================================================
        // LOCKER ROOM
        // =========================================================================
        function renderLockerRoom() {
            const equipped = getEquippedSkinObject();
            document.getElementById('locker-avatar-emoji').innerText = equipped.emoji;
            document.getElementById('locker-title-name').innerText = equipped.name;

            const globalLvl = 1 + Math.floor(STATE.musclePoints / 400);
            document.getElementById('locker-sub-desc').innerText = `Level ${globalLvl} • ${globalLvl >= 15 ? 'Elite Lifter' : 'Arcade Rookie'}`;

            const progressToNext = Math.min(100, Math.floor(((STATE.musclePoints % 400) / 400) * 100));
            document.getElementById('locker-level-percent').innerText = `${progressToNext}% to Level ${globalLvl + 1}`;
            document.getElementById('locker-level-bar').style.width = `${progressToNext}%`;

            const grid = document.getElementById('locker-skins-grid');
            grid.innerHTML = '';

            SKINS_LIST.forEach(skin => {
                const isUnlocked = STATE.unlockedSkins.includes(skin.id);
                const isEquipped = STATE.equippedSkin === skin.id;
                const canAfford = STATE.musclePoints >= skin.cost;

                const card = document.createElement('div');
                card.className =
                    `p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${isEquipped ? 'bg-emerald-500/10 border-emerald-400 shadow shadow-emerald-500/10' : isUnlocked ? 'bg-slate-900 border-slate-800 hover:border-slate-700 cursor-pointer' : 'bg-slate-900/40 border-slate-800/60'}`;

                card.onclick = () => {
                    if (isEquipped) return;
                    if (isUnlocked) {
                        STATE.equippedSkin = skin.id;
                        playSfx('levelup');
                        showNotification(`Outfit changed to ${skin.name}!`);
                        saveState();
                        updateGlobalDashboard();
                        renderLockerRoom();
                    } else if (canAfford) {
                        STATE.musclePoints -= skin.cost;
                        STATE.unlockedSkins.push(skin.id);
                        STATE.equippedSkin = skin.id;
                        playSfx('levelup');
                        showNotification(`Success! Unlocked: ${skin.name}!`);
                        saveState();
                        updateGlobalDashboard();
                        renderLockerRoom();
                    } else {
                        playSfx('fail');
                        showNotification(`Not enough Muscle Points to unlock ${skin.name}!`);
                    }
                };

                let actionBtnMarkup = '';
                if (isEquipped) {
                    actionBtnMarkup =
                        '<span class="text-[10px] font-bold text-emerald-400 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 uppercase">Equipped</span>';
                } else if (isUnlocked) {
                    actionBtnMarkup =
                        '<span class="text-[10px] font-bold text-sky-400 px-2.5 py-1 rounded bg-sky-500/10 border border-sky-500/20 uppercase">EQUIP</span>';
                } else {
                    actionBtnMarkup = `
                        <button class="text-[11px] font-extrabold px-3 py-1 rounded-xl flex items-center gap-1 ${canAfford ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-500'}" style="pointer-events: none">
                          <span>UNLOCK</span>
                          <span class="font-mono">${skin.cost.toLocaleString()} pts</span>
                        </button>
                      `;
                }

                card.innerHTML = `
                    <div class="flex items-start justify-between gap-3">
                      <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-center text-3xl">
                          ${skin.emoji}
                        </div>
                        <div>
                          <h4 class="font-display font-extrabold text-sm text-slate-100">${skin.name}</h4>
                          <p class="text-[10px] text-amber-400 font-mono font-bold">${skin.mult.toFixed(1)}x Gains multiplier</p>
                        </div>
                      </div>
                      ${actionBtnMarkup}
                    </div>
                    <p class="text-[11px] text-slate-400 leading-relaxed">${skin.desc}</p>
                  `;

                grid.appendChild(card);
            });
        }


        // =========================================================================
        // GLOBAL DASHBOARD
        // =========================================================================
        function updateGlobalDashboard() {
            document.getElementById('global-muscle-points').innerText = STATE.musclePoints.toLocaleString();
            const equipped = getEquippedSkinObject();
            document.getElementById('global-equipped-emoji').innerText = equipped.emoji;
            document.getElementById('global-equipped-name').innerText = equipped.name;
            renderLockerRoom();
            updateSessionChallenge();
        }

        function updateSessionChallenge() {
            const badge = document.getElementById('session-challenge-badge');
            const text = document.getElementById('session-challenge-text');
            const bonusText = document.getElementById('session-bonus-text');
            if (!badge) return;
            const played = [sessionGames.runner, sessionGames.slam, sessionGames.catcher].filter(Boolean).length;
            if (played === 0) { badge.classList.add('hidden'); return; }
            badge.classList.remove('hidden');
            text.innerText = `${played}/3 Games`;
            if (played >= 3 && !sessionBonusApplied) {
                sessionBonusApplied = true;
                const bonusPts = Math.floor(STATE.musclePoints * 0.25);
                if (bonusPts > 0) {
                    STATE.musclePoints += bonusPts;
                    saveState();
                    showNotification(`🎉 SESSION BONUS! +${bonusPts} Muscle Points for completing all 3 games!`);
                    document.getElementById('global-muscle-points').innerText = STATE.musclePoints.toLocaleString();
                }
                bonusText.classList.remove('hidden');
            } else if (played >= 3) {
                bonusText.classList.remove('hidden');
            } else {
                bonusText.classList.add('hidden');
            }
        }


        // =========================================================================
        // DOWNLOAD STANDALONE
        // =========================================================================
        function downloadStandaloneHTML() {
            const wholeCode = document.documentElement.outerHTML;
            const blob = new Blob([wholeCode], { type: 'text/html' });
            const trigger = document.createElement('a');
            trigger.href = URL.createObjectURL(blob);
            trigger.download = 'gym-empire-arcade.html';
            document.body.appendChild(trigger);
            trigger.click();
            document.body.removeChild(trigger);
            showNotification("Single-file HTML Arcade downloaded! Play anywhere offline!");
        }


        // =========================================================================
        // INIT
        // =========================================================================
        updateGlobalDashboard();
        // Initialize canvas sizes
        setTimeout(() => {
            resizeRunner();
            resizeCatcher();
        }, 100);

        // Auto-show runner tutorial
        document.getElementById('runner-tutorial').classList.remove('hidden');

        // Key binding for runner space
        document.addEventListener('keydown', (e) => {
            const isTruckVisible = !document.getElementById('tab-truck').classList.contains('hidden');
            if (isTruckVisible && truckState.active) {
                if (e.code === 'ArrowRight' || e.code === 'KeyD') { e.preventDefault(); truckState.gas = true; }
                if (e.code === 'ArrowLeft' || e.code === 'KeyA') { e.preventDefault(); truckState.brake = true; }
            }
            
            const isBoxingVisible = !document.getElementById('tab-boxing').classList.contains('hidden');
            if (isBoxingVisible && boxingState.active) {
                if (e.code === 'ArrowLeft' || e.code === 'KeyA') { e.preventDefault(); tapBoxing('left'); }
                if (e.code === 'ArrowRight' || e.code === 'KeyD') { e.preventDefault(); tapBoxing('right'); }
            }

            if (e.code === 'Space' || e.code === 'ArrowUp') {
                const isRunnerVisible = !document.getElementById('tab-runner').classList.contains('hidden');
                if (isRunnerVisible) {
                    e.preventDefault();
                    triggerRunnerJump();
                }
                const isSlamVisible = !document.getElementById('tab-slam').classList.contains('hidden');
                if (isSlamVisible) {
                    e.preventDefault();
                    triggerSlamStop();
                }
            }
        });

        // Also support click on runner canvas for jumping (already done via onclick)
        // But also support touch events more robustly
        document.getElementById('runner-wrapper').addEventListener('touchstart', (e) => {
            if (!document.getElementById('runner-tutorial').classList.contains('hidden')) return;
            e.preventDefault();
            triggerRunnerJump();
        }, { passive: false });
        // =========================================================================
        // MOUNTAIN TRUCK GAME LOGIC (JEEP OVERHAUL)
        // =========================================================================
        let truckCanvas, tctx;
        let truckState = {
            active: false,
            level: 1,
            gas: false,
            brake: false,
            car: { x: 0, y: 0, vx: 0, vy: 0, angle: 0, angVel: 0, airborne: false, wheelAng: 0, headAng: 0, chassisSpring: 0, chassisVel: 0 },
            fuel: 100,
            trackLength: 3000,
            cameraX: 0,
            track: [],
            coins: [],
            gasCans: [],
            particles: []
        };
        let truckAnimationFrame;

        function initTruck() {
            truckCanvas = document.getElementById('truckCanvas');
            if(!truckCanvas) return;
            tctx = truckCanvas.getContext('2d', { alpha: false });
            resizeTruck();
            
            const btnGas = document.getElementById('truck-btn-gas');
            const btnBrake = document.getElementById('truck-btn-brake');
            
            const gasOn = (e) => { e.preventDefault(); truckState.gas = true; };
            const gasOff = (e) => { e.preventDefault(); truckState.gas = false; };
            const brakeOn = (e) => { e.preventDefault(); truckState.brake = true; };
            const brakeOff = (e) => { e.preventDefault(); truckState.brake = false; };
            
            if(btnGas) {
                btnGas.addEventListener('touchstart', gasOn, {passive: false});
                btnGas.addEventListener('mousedown', gasOn);
                btnGas.addEventListener('touchend', gasOff);
                btnGas.addEventListener('mouseup', gasOff);
                btnGas.addEventListener('mouseleave', gasOff);
            }
            if(btnBrake) {
                btnBrake.addEventListener('touchstart', brakeOn, {passive: false});
                btnBrake.addEventListener('mousedown', brakeOn);
                btnBrake.addEventListener('touchend', brakeOff);
                btnBrake.addEventListener('mouseup', brakeOff);
                btnBrake.addEventListener('mouseleave', brakeOff);
            }
            
            drawTruckFrame(performance.now());
        }

        function resizeTruck() {
            if(!truckCanvas) return;
            const parent = truckCanvas.parentElement;
            truckCanvas.width = parent.clientWidth;
            truckCanvas.height = parent.clientHeight;
        }

        function startTruckGame() {
            playSfx('click');
            document.getElementById('truck-overlay').classList.add('hidden');
            
            truckState.active = true;
            truckState.fuel = 100;
            truckState.car = { x: 400, y: 200, vx: 0, vy: 0, angle: 0, angVel: 0, airborne: false, wheelAng: 0, headAng: 0, chassisSpring: 0, chassisVel: 0 };
            truckState.cameraX = 0;
            truckState.particles = [];
            
            document.getElementById('truck-level').innerText = truckState.level;
            buildTrack(truckState.level);
            
            if(!truckAnimationFrame) {
                truckAnimationFrame = requestAnimationFrame(updateTruckLoop);
            }
        }

        function getTerrainHeightRaw(x, level) {
            if (x < 600) return 300; 
            let nx = x - 600;
            let y = 300;
            let seed = level * 1.234;
            
            y -= Math.sin(nx * 0.0015 + seed) * (60 + level * 6); 
            y -= Math.sin(nx * 0.005 - seed) * (30 + level * 3);  
            y -= Math.sin(nx * 0.02 + seed*2) * (10 + level * 2);
            y -= Math.sin(nx * 0.05 + seed) * 5; // tiny bumps
            
            return Math.max(80, Math.min(500, y));
        }

        function buildTrack(level) {
            truckState.track = [];
            truckState.coins = [];
            truckState.gasCans = [];
            let len = 3000 + level * 1500;
            truckState.trackLength = len;
            
            for(let x=0; x<=len + 800; x+=10) {
                let ty = getTerrainHeightRaw(x, level);
                truckState.track.push({x: x, y: ty});
                
                // Spawn Collectibles
                if (x > 800 && x < len) {
                    if (x % 300 === 0 && Math.random() > 0.3) {
                        truckState.coins.push({x: x, y: ty - 60, collected: false});
                    }
                    if (x % 1500 === 0) {
                        truckState.gasCans.push({x: x, y: ty - 50, collected: false});
                    }
                }
            }
        }

        function getTrackY(x) {
            if (x <= 0) return 300;
            let idx = Math.floor(x / 10);
            if (idx >= truckState.track.length - 1) return 300;
            let p1 = truckState.track[idx];
            let p2 = truckState.track[idx+1];
            let t = (x - p1.x) / 10;
            return p1.y + (p2.y - p1.y) * t;
        }

        function normalizeAngle(a) {
            while (a > Math.PI) a -= Math.PI * 2;
            while (a < -Math.PI) a += Math.PI * 2;
            return a;
        }

        function createParticle(x, y, color, vx, vy, life) {
            truckState.particles.push({x, y, color, vx, vy, life, maxLife: life, size: Math.random()*3+2});
        }

        function updateTruckLoop(time) {
            if(!truckState.active && document.getElementById('tab-truck').classList.contains('hidden')) {
                truckAnimationFrame = null;
                return;
            }
            
            if (truckState.active) {
                let car = truckState.car;
                
                // Fuel Logic
                if (truckState.fuel > 0) {
                    truckState.fuel -= 0.03;
                    if (truckState.gas) truckState.fuel -= 0.08;
                } else {
                    truckState.fuel = 0;
                    truckState.gas = false;
                    if (Math.abs(car.vx) < 0.5 && !car.airborne) {
                        crashTruck("Out of Fuel!");
                        return;
                    }
                }
                
                // Physics
                car.vy += 0.45; // Gravity
                car.x += car.vx;
                car.y += car.vy;

                let txFront = car.x + 30;
                let tyFront = getTrackY(txFront);
                let txRear = car.x - 30;
                let tyRear = getTrackY(txRear);

                let targetAngle = Math.atan2(tyFront - tyRear, 60);
                let targetY = (tyFront + tyRear) / 2 - 22; // Suspension baseline

                // Ground Collision
                if (car.y >= targetY) {
                    if (car.airborne) {
                        car.airborne = false;
                        if(car.vy > 5) {
                            playSfx('slam_heavy');
                            car.chassisVel = 10; // big bounce
                            // Dust
                            for(let i=0; i<10; i++) createParticle(car.x, car.y+20, '#78350f', (Math.random()-0.5)*10, -Math.random()*5, 30);
                        }
                        
                        let angDiff = normalizeAngle(car.angle - targetAngle);
                        if (Math.abs(angDiff) > Math.PI / 1.7) {
                            crashTruck("Neck Snapped!");
                            return;
                        } else if (Math.abs(angDiff) < 0.2 && car.vy > 8) {
                            // Perfect landing bonus
                            addMusclePoints(50);
                            createParticle(car.x, car.y-40, '#fbbf24', 0, -2, 40); // gold float
                        }
                    }
                    
                    car.y = targetY;
                    car.vy = 0;
                    
                    car.angle += (targetAngle - car.angle) * 0.5;
                    car.angVel = 0;
                    car.vx *= 0.95; // Friction

                    if (truckState.gas && truckState.fuel > 0) {
                        car.vx += Math.cos(car.angle) * 0.7;
                        car.vx -= Math.sin(car.angle) * 0.4;
                        if(Math.random() > 0.5) createParticle(txRear, tyRear, '#78350f', -car.vx + (Math.random()-0.5)*2, -2-Math.random()*2, 20);
                        if(Math.random() > 0.7) createParticle(car.x-40, car.y-10, '#94a3b8', -car.vx*0.5, -Math.random(), 25); // smoke
                    } else if (truckState.brake) {
                        car.vx -= Math.cos(car.angle) * 0.6;
                        if(Math.random() > 0.5) createParticle(txFront, tyFront, '#78350f', -car.vx + (Math.random()-0.5)*2, -2-Math.random()*2, 20);
                    }
                } else {
                    car.airborne = true;
                    if (truckState.gas && truckState.fuel > 0) {
                        car.angVel -= 0.04;
                        if(Math.random() > 0.8) createParticle(car.x-40, car.y, '#94a3b8', -car.vx*0.5, -Math.random(), 25);
                    }
                    if (truckState.brake) car.angVel += 0.04;
                    car.angle += car.angVel;
                    car.angVel *= 0.94;
                }
                
                // Chassis Spring Physics
                car.chassisVel -= car.chassisSpring * 0.2;
                car.chassisVel *= 0.8;
                car.chassisSpring += car.chassisVel;
                if(truckState.gas && !car.airborne) car.chassisVel += 0.5; // torque lifts front
                if(truckState.brake && !car.airborne) car.chassisVel -= 0.5;
                
                // Driver Head Bobble
                let targetHeadAng = -car.angVel * 10 - car.chassisVel * 0.1;
                car.headAng += (targetHeadAng - car.headAng) * 0.2;
                
                // Wheel Rotation
                car.wheelAng += car.vx * 0.1;
                
                // Limits
                if (car.vx > 20) car.vx = 20;
                if (car.vx < -10) car.vx = -10;
                
                // Collectibles Collision
                truckState.coins.forEach(c => {
                    if(!c.collected && Math.abs(c.x - car.x) < 40 && Math.abs(c.y - car.y) < 40) {
                        c.collected = true;
                        playSfx('click');
                        addMusclePoints(10);
                        for(let i=0; i<5; i++) createParticle(c.x, c.y, '#fbbf24', (Math.random()-0.5)*5, (Math.random()-0.5)*5, 20);
                    }
                });
                truckState.gasCans.forEach(g => {
                    if(!g.collected && Math.abs(g.x - car.x) < 40 && Math.abs(g.y - car.y) < 40) {
                        g.collected = true;
                        playSfx('success');
                        truckState.fuel = Math.min(100, truckState.fuel + 40);
                        for(let i=0; i<10; i++) createParticle(g.x, g.y, '#ef4444', (Math.random()-0.5)*5, (Math.random()-0.5)*5, 30);
                    }
                });
                
                // UI
                let progress = Math.min(100, Math.max(0, (car.x / truckState.trackLength) * 100));
                document.getElementById('truck-progress').style.width = progress + '%';
                document.getElementById('truck-fuel').style.width = truckState.fuel + '%';
                if(truckState.fuel < 20) document.getElementById('truck-fuel').classList.add('animate-pulse');
                else document.getElementById('truck-fuel').classList.remove('animate-pulse');
                
                if (car.x >= truckState.trackLength) { winTruckLevel(); return; }
                if (car.y > 1000) { crashTruck("Fell into the abyss!"); return; }
            }
            
            drawTruckFrame(time);
            
            if(truckState.active || Math.abs(truckState.car.vx) > 0.1 || Math.abs(truckState.car.vy) > 0.1) {
                truckAnimationFrame = requestAnimationFrame(updateTruckLoop);
            } else {
                truckAnimationFrame = null;
            }
        }

        function crashTruck(reason) {
            truckState.active = false;
            playSfx('fail');
            hapticFeedback('fail');
            document.getElementById('truck-overlay').classList.remove('hidden');
            document.getElementById('truck-overlay-icon').innerText = "💥";
            document.getElementById('truck-overlay-title').innerText = "Game Over!";
            document.getElementById('truck-overlay-desc').innerText = reason || "You crashed!";
            document.getElementById('truck-start-btn').innerText = "RETRY LEVEL " + truckState.level;
        }

        function winTruckLevel() {
            truckState.active = false;
            playSfx('success');
            
            const pts = truckState.level * 500;
            addMusclePoints(pts);
            
            truckState.level++;
            if(truckState.level > 10) truckState.level = 1;
            
            document.getElementById('truck-overlay').classList.remove('hidden');
            document.getElementById('truck-overlay-icon').innerText = "🏆";
            document.getElementById('truck-overlay-title').innerText = "Level Cleared!";
            document.getElementById('truck-overlay-desc').innerHTML = `Awesome driving! Earned <span class="text-emerald-400 font-bold">+${pts}</span> Power.`

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
            document.getElementById('boxing-overlay-desc').innerHTML = `Max Combo: <span class="text-rose-400 font-bold">${boxingState.maxCombo}</span><br>Earned <span class="text-emerald-400 font-bold">+${pointsEarned}</span> Power!`
        document.addEventListener('keyup', (e) => {
            const isTruckVisible = !document.getElementById('tab-truck').classList.contains('hidden');
            if (isTruckVisible && typeof truckState !== 'undefined' && truckState.active) {
                if (e.code === 'ArrowRight' || e.code === 'KeyD') { e.preventDefault(); truckState.gas = false; }
                if (e.code === 'ArrowLeft' || e.code === 'KeyA') { e.preventDefault(); truckState.brake = false; }
            }
        });

        // Window resize handler
        window.addEventListener('resize', () => {
            resizeRunner();
            resizeCatcher();
        });

        // Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    