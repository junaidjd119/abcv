const fs = require('fs');
const path = 'E:/gym/abcv-main/abcv-main/gym-empire-arcade.html';
let html = fs.readFileSync(path, 'utf8');

// 1. Add Navigation Button
const boxingBtn = `                <button onclick="switchTab('boxing')" id="tab-btn-boxing"`;
const truckBtn = `
                <button onclick="switchTab('truck')" id="tab-btn-truck" class="tab-btn py-3.5 px-3 flex items-center gap-1.5 border-b-2 hover:text-white font-display font-bold text-[10px] md:text-xs tracking-wide transition-all duration-300 border-transparent text-slate-400">
                    <span class="text-[12px]">🛻</span>
                    <span>Off-Road</span>
                </button>
`;
if (!html.includes('id="tab-btn-truck"')) {
    html = html.replace(boxingBtn, truckBtn + boxingBtn);
}

// 2. Add Truck Tab HTML
const targetTabHtml = `        <!-- TAB: BOXING -->`;
const truckTabHtml = `
        <!-- TAB: TRUCK -->
        <div id="tab-truck" class="tab-content hidden flex-1 flex flex-col items-center justify-center relative p-4 pb-24">
            <div class="absolute inset-0 bg-gradient-to-b from-sky-900 to-slate-900 -z-10"></div>
            
            <!-- Game Info -->
            <div class="absolute top-6 w-full max-w-2xl px-6 flex justify-between items-center z-10">
                <div class="bg-slate-900/80 border border-slate-700/50 rounded-xl px-4 py-2 backdrop-blur-sm shadow-xl">
                    <span class="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-0.5">Level</span>
                    <span id="truck-level" class="text-3xl font-display font-black text-sky-400">1</span>
                </div>
                
                <div class="flex-1 mx-4">
                    <div class="h-4 bg-slate-800 rounded-full border border-slate-700 overflow-hidden relative">
                        <div id="truck-progress" class="h-full bg-gradient-to-r from-sky-500 to-emerald-400 w-0 transition-all duration-300"></div>
                        <div class="absolute right-1 top-0 text-[10px] h-full flex items-center">🏁</div>
                    </div>
                </div>
            </div>

            <!-- Canvas -->
            <div class="relative w-full max-w-2xl mt-16 flex-1 flex items-center justify-center">
                <div class="relative w-full h-[400px] bg-slate-950/50 rounded-3xl border-2 border-slate-800 overflow-hidden shadow-2xl">
                    <canvas id="truckCanvas" class="w-full h-full block touch-none"></canvas>
                    
                    <!-- Overlay -->
                    <div id="truck-overlay" class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                        <div class="text-6xl mb-4" id="truck-overlay-icon">🛻</div>
                        <h3 id="truck-overlay-title" class="text-2xl font-display font-bold text-white mb-2">Mountain Truck</h3>
                        <p id="truck-overlay-desc" class="text-slate-400 text-sm mb-6 text-center max-w-[250px]">Drive through the treacherous mountain terrain. Use gas and brake to balance in the air!</p>
                        <button onclick="startTruckGame()" class="px-8 py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-full text-lg shadow-[0_0_15px_rgba(14,165,233,0.4)] transition-transform hover:scale-105 active:scale-95" id="truck-start-btn">
                            START ENGINE
                        </button>
                    </div>
                </div>
            </div>

            <!-- Mobile Controls -->
            <div class="w-full max-w-2xl mt-6 flex justify-between px-4 gap-4">
                <button id="truck-btn-brake" class="h-20 flex-1 max-w-[120px] bg-rose-900/50 border-2 border-rose-700 rounded-2xl active:bg-rose-700 transition-colors shadow-lg flex items-center justify-center touch-manipulation">
                    <span class="text-white font-bold text-lg uppercase tracking-widest">Brake</span>
                </button>
                <button id="truck-btn-gas" class="h-20 flex-1 max-w-[150px] bg-emerald-900/50 border-2 border-emerald-700 rounded-2xl active:bg-emerald-700 transition-colors shadow-lg flex items-center justify-center touch-manipulation">
                    <span class="text-white font-bold text-lg uppercase tracking-widest">Gas</span>
                </button>
            </div>
        </div>
`;
if (!html.includes('id="tab-truck"')) {
    html = html.replace(targetTabHtml, truckTabHtml + '\n' + targetTabHtml);
}

// 3. switchTab logic
const targetSwitch1 = `            if (typeof boxingState !== 'undefined') {
                boxingState.active = false;`;
const replaceSwitch1 = `            if (typeof truckState !== 'undefined') {
                truckState.active = false;
                if(typeof truckAnimationFrame !== 'undefined') cancelAnimationFrame(truckAnimationFrame);
            }
            if (typeof boxingState !== 'undefined') {
                boxingState.active = false;`;
if (!html.includes('truckState.active = false;')) {
    html = html.replace(targetSwitch1, replaceSwitch1);
}

const targetSwitch2 = `            } else if (tabId === 'boxing') {`;
const replaceSwitch2 = `            } else if (tabId === 'truck') {
                if (typeof resizeTruck === 'function') resizeTruck();
                document.getElementById('truck-overlay').classList.remove('hidden');
                document.getElementById('truck-overlay-title').innerText = "Mountain Truck";
                document.getElementById('truck-overlay-desc').innerText = "Ready for Level " + (truckState ? truckState.level : 1) + "?";
                document.getElementById('truck-start-btn').innerText = "START ENGINE";
            } else if (tabId === 'boxing') {`;
if (!html.includes("tabId === 'truck'")) {
    html = html.replace(targetSwitch2, replaceSwitch2);
}

// 4. Game Logic
const targetJS = `        // =========================================================================
        // BOXING GAME LOGIC`;
const truckJS = `
        // =========================================================================
        // MOUNTAIN TRUCK GAME LOGIC
        // =========================================================================
        let truckCanvas, tctx;
        let truckState = {
            active: false,
            level: 1,
            gas: false,
            brake: false,
            car: { x: 0, y: 0, vx: 0, vy: 0, angle: 0, angVel: 0, airborne: false },
            trackLength: 3000,
            cameraX: 0
        };
        let truckAnimationFrame;

        function initTruck() {
            truckCanvas = document.getElementById('truckCanvas');
            if(!truckCanvas) return;
            tctx = truckCanvas.getContext('2d', { alpha: false });
            resizeTruck();
            
            // Controls
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
            truckState.trackLength = 3000 + truckState.level * 1000;
            truckState.car = { x: 400, y: 200, vx: 0, vy: 0, angle: 0, angVel: 0, airborne: false };
            truckState.cameraX = 0;
            
            document.getElementById('truck-level').innerText = truckState.level;
            
            if(!truckAnimationFrame) {
                truckAnimationFrame = requestAnimationFrame(updateTruckLoop);
            }
        }

        function getTerrainHeight(x, level) {
            if (x < 600) return 300; // Flat start
            if (x > truckState.trackLength - 500) return 300; // Flat finish
            
            let nx = x - 600;
            let y = 300;
            let seed = level * 1.234;
            
            // Combine sine waves
            y -= Math.sin(nx * 0.0015 + seed) * (60 + level * 5); // Huge hills
            y -= Math.sin(nx * 0.005 - seed) * (30 + level * 3);  // Medium
            y -= Math.sin(nx * 0.02 + seed*2) * (10 + level * 2); // Bumps
            
            // Limit height so we don't go off screen too easily
            return Math.max(100, Math.min(500, y));
        }
        
        function normalizeAngle(a) {
            while (a > Math.PI) a -= Math.PI * 2;
            while (a < -Math.PI) a += Math.PI * 2;
            return a;
        }

        function updateTruckLoop(time) {
            if(!truckState.active && document.getElementById('tab-truck').classList.contains('hidden')) {
                truckAnimationFrame = null;
                return;
            }
            
            if (truckState.active) {
                let car = truckState.car;
                
                // Physics
                car.vy += 0.45; // Gravity
                car.x += car.vx;
                car.y += car.vy;

                let txFront = car.x + 30;
                let tyFront = getTerrainHeight(txFront, truckState.level);
                let txRear = car.x - 30;
                let tyRear = getTerrainHeight(txRear, truckState.level);

                let targetAngle = Math.atan2(tyFront - tyRear, 60);
                let targetY = (tyFront + tyRear) / 2 - 25; // 25 is wheel radius/suspension

                // Ground Collision
                if (car.y >= targetY) {
                    // Landing Impact
                    if (car.airborne) {
                        car.airborne = false;
                        if(car.vy > 5) playSfx('slam_heavy');
                        
                        let angDiff = normalizeAngle(car.angle - targetAngle);
                        if (Math.abs(angDiff) > Math.PI / 1.8) {
                            crashTruck();
                            return;
                        }
                    }
                    
                    car.y = targetY;
                    car.vy = 0;
                    
                    // Match ground angle
                    car.angle += (targetAngle - car.angle) * 0.4;
                    car.angVel = 0;

                    // Friction
                    car.vx *= 0.96;

                    // Acceleration
                    if (truckState.gas) {
                        car.vx += Math.cos(car.angle) * 0.6;
                        car.vx -= Math.sin(car.angle) * 0.4; // Gravity pushing back on slopes
                    } else if (truckState.brake) {
                        car.vx -= Math.cos(car.angle) * 0.5; // Reverse/Brake
                    }
                } else {
                    car.airborne = true;
                    // Mid-air rotation
                    if (truckState.gas) car.angVel -= 0.035; // lean back
                    if (truckState.brake) car.angVel += 0.035; // lean forward
                    
                    car.angle += car.angVel;
                    car.angVel *= 0.95;
                }
                
                // Max limits
                if (car.vx > 18) car.vx = 18;
                if (car.vx < -8) car.vx = -8;
                
                // Engine Sound pitch logic could go here
                
                // Progress Bar
                let progress = Math.min(100, Math.max(0, (car.x / truckState.trackLength) * 100));
                document.getElementById('truck-progress').style.width = progress + '%';
                
                // Win Condition
                if (car.x >= truckState.trackLength) {
                    winTruckLevel();
                    return;
                }
                
                // Fall off the map fallback
                if (car.y > 1000) crashTruck();
            }
            
            drawTruckFrame(time);
            
            if(truckState.active || Math.abs(truckState.car.vx) > 0.1 || Math.abs(truckState.car.vy) > 0.1) {
                truckAnimationFrame = requestAnimationFrame(updateTruckLoop);
            } else {
                truckAnimationFrame = null;
            }
        }

        function crashTruck() {
            truckState.active = false;
            playSfx('fail');
            hapticFeedback('fail');
            document.getElementById('truck-overlay').classList.remove('hidden');
            document.getElementById('truck-overlay-icon').innerText = "💥";
            document.getElementById('truck-overlay-title').innerText = "Crashed!";
            document.getElementById('truck-overlay-desc').innerText = "You flipped over! Try again.";
            document.getElementById('truck-start-btn').innerText = "RETRY LEVEL " + truckState.level;
        }

        function winTruckLevel() {
            truckState.active = false;
            playSfx('success');
            
            const pts = truckState.level * 500;
            addMusclePoints(pts);
            
            truckState.level++;
            if(truckState.level > 10) truckState.level = 1; // loop
            
            document.getElementById('truck-overlay').classList.remove('hidden');
            document.getElementById('truck-overlay-icon').innerText = "🏆";
            document.getElementById('truck-overlay-title').innerText = "Level Complete!";
            document.getElementById('truck-overlay-desc').innerHTML = \`Awesome driving! Earned <span class="text-emerald-400 font-bold">+\${pts}</span> Power.\`;
            document.getElementById('truck-start-btn').innerText = "NEXT LEVEL";
        }

        function drawTruckFrame(time) {
            if(!tctx || !truckCanvas) return;
            const w = truckCanvas.width;
            const h = truckCanvas.height;
            
            // Camera follows car
            let targetCamX = truckState.car.x - w/3;
            truckState.cameraX += (targetCamX - truckState.cameraX) * 0.1;
            
            // Clear sky
            tctx.fillStyle = '#0f172a';
            tctx.fillRect(0, 0, w, h);
            
            // Draw background mountains (parallax)
            tctx.fillStyle = '#1e293b';
            tctx.beginPath();
            tctx.moveTo(0, h);
            for(let x = 0; x < w; x += 50) {
                let bgY = 200 + Math.sin((x + truckState.cameraX * 0.3) * 0.005) * 100;
                tctx.lineTo(x, bgY);
            }
            tctx.lineTo(w, h);
            tctx.fill();

            tctx.save();
            tctx.translate(-truckState.cameraX, 0);
            
            // Draw Terrain
            tctx.fillStyle = '#065f46'; // Emerald dark
            tctx.strokeStyle = '#34d399'; // Emerald light border
            tctx.lineWidth = 6;
            
            tctx.beginPath();
            let startX = Math.max(0, truckState.cameraX - 100);
            let endX = truckState.cameraX + w + 100;
            tctx.moveTo(startX, h);
            for(let x = startX; x <= endX; x += 20) {
                tctx.lineTo(x, getTerrainHeight(x, truckState.level));
            }
            tctx.lineTo(endX, h);
            tctx.fill();
            tctx.stroke();
            
            // Finish line
            let flX = truckState.trackLength;
            tctx.fillStyle = '#f8fafc';
            tctx.fillRect(flX, getTerrainHeight(flX, truckState.level) - 150, 10, 150);
            
            // Draw Car
            let cx = truckState.car.x;
            let cy = truckState.car.y;
            
            tctx.translate(cx, cy);
            tctx.rotate(truckState.car.angle);
            
            // Body
            tctx.fillStyle = '#ef4444'; // Red truck
            tctx.beginPath();
            tctx.roundRect(-40, -25, 80, 30, 8);
            tctx.fill();
            
            // Cabin
            tctx.fillStyle = '#b91c1c';
            tctx.beginPath();
            tctx.roundRect(-10, -50, 40, 25, 5);
            tctx.fill();
            // Window
            tctx.fillStyle = '#bae6fd';
            tctx.fillRect(0, -45, 25, 15);
            
            // Wheels
            tctx.fillStyle = '#1e293b';
            tctx.strokeStyle = '#94a3b8';
            tctx.lineWidth = 4;
            
            let wheelRot = truckState.car.x * 0.1; // fake wheel rotation
            
            // Rear wheel
            tctx.save();
            tctx.translate(-30, 10);
            tctx.rotate(wheelRot);
            tctx.beginPath(); tctx.arc(0,0, 15, 0, Math.PI*2); tctx.fill(); tctx.stroke();
            // Rim
            tctx.beginPath(); tctx.moveTo(-10,0); tctx.lineTo(10,0); tctx.moveTo(0,-10); tctx.lineTo(0,10); tctx.stroke();
            tctx.restore();
            
            // Front wheel
            tctx.save();
            tctx.translate(30, 10);
            tctx.rotate(wheelRot);
            tctx.beginPath(); tctx.arc(0,0, 15, 0, Math.PI*2); tctx.fill(); tctx.stroke();
            // Rim
            tctx.beginPath(); tctx.moveTo(-10,0); tctx.lineTo(10,0); tctx.moveTo(0,-10); tctx.lineTo(0,10); tctx.stroke();
            tctx.restore();

            tctx.restore();
        }
`;

if (!html.includes('let truckState = {')) {
    html = html.replace(targetJS, truckJS + '\n' + targetJS);
}

// 5. Hooks
const targetHooks = `            initBoxing();`;
const replaceHooks = `            initTruck();\n            initBoxing();`;
if (!html.includes('initTruck();')) {
    html = html.replace(targetHooks, replaceHooks);
}

const targetKeybd = `            const isBoxingVisible = !document.getElementById('tab-boxing').classList.contains('hidden');`;
const replaceKeybd = `            const isTruckVisible = !document.getElementById('tab-truck').classList.contains('hidden');
            if (isTruckVisible && truckState.active) {
                if (e.code === 'ArrowRight' || e.code === 'KeyD') { e.preventDefault(); truckState.gas = true; }
                if (e.code === 'ArrowLeft' || e.code === 'KeyA') { e.preventDefault(); truckState.brake = true; }
            }
            
            const isBoxingVisible = !document.getElementById('tab-boxing').classList.contains('hidden');`;
if (!html.includes('isTruckVisible')) {
    html = html.replace(targetKeybd, replaceKeybd);
}

const targetKeybdUp = `        // Also support click on runner canvas`;
const replaceKeybdUp = `        document.addEventListener('keyup', (e) => {
            if (e.code === 'ArrowRight' || e.code === 'KeyD') { truckState.gas = false; }
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') { truckState.brake = false; }
        });

        // Also support click on runner canvas`;
if (!html.includes('truckState.gas = false;')) {
    html = html.replace(targetKeybdUp, replaceKeybdUp);
}

fs.writeFileSync(path, html, 'utf8');
console.log('Successfully injected Mountain Truck game.');
