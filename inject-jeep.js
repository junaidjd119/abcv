const fs = require('fs');
const path = 'E:/gym/abcv-main/abcv-main/gym-empire-arcade.html';
let html = fs.readFileSync(path, 'utf8');

// 1. Add Fuel UI to HTML
const targetUI = `<div class="flex-1 mx-4">
                    <div class="h-4 bg-slate-800 rounded-full border border-slate-700 overflow-hidden relative">
                        <div id="truck-progress" class="h-full bg-gradient-to-r from-sky-500 to-emerald-400 w-0 transition-all duration-300"></div>`;
const replaceUI = `<div class="flex-1 mx-4 flex flex-col gap-2">
                    <div class="h-3 bg-slate-800 rounded-full border border-slate-700 overflow-hidden relative shadow-inner">
                        <div id="truck-progress" class="h-full bg-gradient-to-r from-sky-500 to-emerald-400 w-0 transition-all duration-300"></div>
                        <div class="absolute right-1 top-0 text-[8px] h-full flex items-center">🏁</div>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Fuel</span>
                        <div class="h-2 flex-1 bg-slate-800 rounded-full border border-slate-700 overflow-hidden">
                            <div id="truck-fuel" class="h-full bg-rose-500 w-full transition-all duration-75"></div>
                        </div>
                    </div>`;
if (html.includes(targetUI)) {
    html = html.replace(targetUI, replaceUI);
}

// 2. Replace Truck Game Logic
const targetJSStart = `        // =========================================================================
        // MOUNTAIN TRUCK GAME LOGIC`;
const targetJSEnd = `            tctx.restore();

            tctx.restore();
        }`;

let startIndex = html.indexOf(targetJSStart);
let endIndex = html.indexOf(targetJSEnd) + targetJSEnd.length;

if (startIndex !== -1 && endIndex !== -1) {
    const jeepJS = `        // =========================================================================
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
            document.getElementById('truck-overlay-desc').innerHTML = \`Awesome driving! Earned <span class="text-emerald-400 font-bold">+\${pts}</span> Power.\`;
            document.getElementById('truck-start-btn').innerText = "NEXT LEVEL";
        }

        function drawTruckFrame(time) {
            if(!tctx || !truckCanvas) return;
            const w = truckCanvas.width;
            const h = truckCanvas.height;
            let car = truckState.car;
            
            let targetCamX = car.x - w * 0.35;
            let targetCamY = car.y - h * 0.6; // Pan up/down slightly
            truckState.cameraX += (targetCamX - truckState.cameraX) * 0.1;
            
            let camYOffset = h/2 - targetCamY;
            camYOffset = Math.max(-200, Math.min(200, camYOffset)); // limit vertical camera pan

            // 1. Sky & Parallax
            let skyGrad = tctx.createLinearGradient(0,0,0,h);
            skyGrad.addColorStop(0, '#0ea5e9');
            skyGrad.addColorStop(1, '#e0f2fe');
            tctx.fillStyle = skyGrad;
            tctx.fillRect(0, 0, w, h);
            
            // Sun
            tctx.fillStyle = 'rgba(253, 224, 71, 0.8)';
            tctx.beginPath(); tctx.arc(w - 100, 100 + camYOffset*0.1, 40, 0, Math.PI*2); tctx.fill();

            tctx.save();
            tctx.translate(0, camYOffset * 0.5); // vertical parallax

            // Distant Mountains (Parallax 0.2)
            tctx.fillStyle = '#94a3b8';
            tctx.beginPath(); tctx.moveTo(0, h);
            for(let x = 0; x <= w; x += 60) {
                let mY = 250 + Math.sin((x + truckState.cameraX * 0.2) * 0.003) * 150;
                tctx.lineTo(x, mY);
            }
            tctx.lineTo(w, h); tctx.fill();
            
            // Near Hills / Trees (Parallax 0.5)
            tctx.fillStyle = '#166534';
            tctx.beginPath(); tctx.moveTo(0, h);
            for(let x = 0; x <= w; x += 40) {
                let mY = 300 + Math.sin((x + truckState.cameraX * 0.5) * 0.008) * 80;
                tctx.lineTo(x, mY);
            }
            tctx.lineTo(w, h); tctx.fill();

            tctx.restore();

            tctx.save();
            tctx.translate(-truckState.cameraX, camYOffset);
            
            // 2. Terrain
            tctx.fillStyle = '#78350f'; // Dirt body
            tctx.strokeStyle = '#22c55e'; // Grass edge
            tctx.lineWidth = 12;
            tctx.lineJoin = 'round';
            
            tctx.beginPath();
            let startX = Math.max(0, truckState.cameraX - 100);
            let endX = truckState.cameraX + w + 100;
            tctx.moveTo(startX, h + 500); // go deep
            
            // Find track indices
            let sIdx = Math.max(0, Math.floor(startX / 10));
            let eIdx = Math.min(truckState.track.length - 1, Math.ceil(endX / 10));
            for(let i = sIdx; i <= eIdx; i++) {
                tctx.lineTo(truckState.track[i].x, truckState.track[i].y);
            }
            tctx.lineTo(endX, h + 500);
            tctx.fill();
            tctx.stroke();
            
            // Draw grass tufts
            tctx.fillStyle = '#16a34a';
            for(let i = sIdx; i <= eIdx; i+=8) {
                let p = truckState.track[i];
                tctx.fillRect(p.x, p.y - 10, 4, 10);
            }
            
            // Finish Line
            let flX = truckState.trackLength;
            if (flX > startX && flX < endX) {
                tctx.fillStyle = '#f8fafc';
                tctx.fillRect(flX, getTrackY(flX) - 150, 10, 150);
                for(let i=0; i<5; i++) {
                    tctx.fillStyle = i%2==0 ? '#000' : '#fff';
                    tctx.fillRect(flX-10, getTrackY(flX) - 150 + i*15, 20, 15);
                }
            }

            // 3. Collectibles
            truckState.coins.forEach(c => {
                if(!c.collected && c.x > startX && c.x < endX) {
                    tctx.fillStyle = '#fbbf24';
                    tctx.beginPath(); tctx.arc(c.x, c.y + Math.sin(time*0.005 + c.x)*5, 12, 0, Math.PI*2); tctx.fill();
                    tctx.fillStyle = '#f59e0b';
                    tctx.beginPath(); tctx.arc(c.x, c.y + Math.sin(time*0.005 + c.x)*5, 8, 0, Math.PI*2); tctx.fill();
                }
            });
            truckState.gasCans.forEach(g => {
                if(!g.collected && g.x > startX && g.x < endX) {
                    tctx.fillStyle = '#ef4444';
                    let gy = g.y + Math.sin(time*0.004 + g.x)*5;
                    tctx.fillRect(g.x-10, gy-15, 20, 30);
                    tctx.fillStyle = '#f8fafc';
                    tctx.fillRect(g.x-5, gy-5, 10, 10); // white label
                    tctx.fillStyle = '#b91c1c';
                    tctx.fillRect(g.x-4, gy-20, 8, 5); // cap
                }
            });

            // 4. Particles
            for(let i = truckState.particles.length - 1; i >= 0; i--) {
                let p = truckState.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life--;
                if(p.life <= 0) {
                    truckState.particles.splice(i, 1);
                    continue;
                }
                tctx.globalAlpha = p.life / p.maxLife;
                tctx.fillStyle = p.color;
                tctx.beginPath(); tctx.arc(p.x, p.y, p.size, 0, Math.PI*2); tctx.fill();
            }
            tctx.globalAlpha = 1.0;
            
            // 5. Draw Jeep
            tctx.translate(car.x, car.y);
            tctx.rotate(car.angle);
            
            let chassisY = car.chassisSpring; 
            
            // Suspension struts (background)
            tctx.strokeStyle = '#cbd5e1'; tctx.lineWidth = 4;
            tctx.beginPath(); tctx.moveTo(-30, chassisY); tctx.lineTo(-30, 22); tctx.stroke();
            tctx.beginPath(); tctx.moveTo(30, chassisY); tctx.lineTo(30, 22); tctx.stroke();

            // Wheels
            tctx.fillStyle = '#1e293b'; tctx.strokeStyle = '#64748b'; tctx.lineWidth = 5;
            
            // Rear Wheel
            tctx.save();
            tctx.translate(-30, 22); tctx.rotate(car.wheelAng);
            tctx.beginPath(); tctx.arc(0,0, 16, 0, Math.PI*2); tctx.fill(); tctx.stroke();
            // Spokes
            tctx.lineWidth = 3; tctx.strokeStyle = '#e2e8f0';
            for(let i=0; i<4; i++) { tctx.rotate(Math.PI/4); tctx.beginPath(); tctx.moveTo(0,0); tctx.lineTo(12,0); tctx.stroke(); }
            tctx.restore();
            
            // Front Wheel
            tctx.save();
            tctx.translate(30, 22); tctx.rotate(car.wheelAng);
            tctx.beginPath(); tctx.arc(0,0, 16, 0, Math.PI*2); tctx.fill(); tctx.stroke();
            tctx.lineWidth = 3; tctx.strokeStyle = '#e2e8f0';
            for(let i=0; i<4; i++) { tctx.rotate(Math.PI/4); tctx.beginPath(); tctx.moveTo(0,0); tctx.lineTo(12,0); tctx.stroke(); }
            tctx.restore();

            // Chassis
            tctx.translate(0, chassisY);

            // Driver
            tctx.fillStyle = '#2563eb'; // blue shirt
            tctx.fillRect(-10, -40, 20, 30);
            tctx.fillStyle = '#fb923c'; // arm
            tctx.beginPath(); tctx.moveTo(-5, -35); tctx.lineTo(15, -20); tctx.lineWidth=6; tctx.strokeStyle='#fb923c'; tctx.stroke();
            
            // Head (bobble)
            tctx.save();
            tctx.translate(0, -45);
            tctx.rotate(car.headAng);
            tctx.fillStyle = '#fcd34d'; // skin
            tctx.beginPath(); tctx.arc(0, -10, 12, 0, Math.PI*2); tctx.fill();
            tctx.fillStyle = '#ef4444'; // helmet
            tctx.beginPath(); tctx.arc(0, -12, 13, Math.PI, Math.PI*2); tctx.fill();
            tctx.restore();

            // Jeep Body
            tctx.fillStyle = '#dc2626'; // Red Jeep
            tctx.beginPath(); tctx.roundRect(-45, -20, 90, 25, 6); tctx.fill();
            tctx.fillStyle = '#991b1b'; // Darker bottom
            tctx.fillRect(-45, -5, 90, 10);
            
            // Windshield
            tctx.fillStyle = '#38bdf8'; tctx.globalAlpha = 0.6;
            tctx.beginPath(); tctx.moveTo(20, -20); tctx.lineTo(30, -45); tctx.lineTo(35, -45); tctx.lineTo(25, -20); tctx.fill();
            tctx.globalAlpha = 1.0;
            
            // Roll cage
            tctx.strokeStyle = '#475569'; tctx.lineWidth = 4;
            tctx.beginPath(); tctx.moveTo(-35, -20); tctx.lineTo(-35, -50); tctx.lineTo(15, -50); tctx.lineTo(25, -20); tctx.stroke();
            
            // Spare Tire
            tctx.fillStyle = '#1e293b'; tctx.beginPath(); tctx.arc(-45, -10, 12, 0, Math.PI*2); tctx.fill();

            tctx.restore();
        }`;
    
    html = html.substring(0, startIndex) + jeepJS + html.substring(endIndex);
    fs.writeFileSync(path, html, 'utf8');
    console.log("Successfully overhauled the Off-Road game into Jeep Racing.");
} else {
    console.log("Could not find the target Javascript section to replace!");
}
