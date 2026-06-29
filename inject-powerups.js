const fs = require('fs');
const path = 'E:/gym/abcv-main/abcv-main/gym-empire-arcade.html';
let html = fs.readFileSync(path, 'utf8');

// SLAM: Fire Plates
if (!html.includes('slamState.firePlates')) {
    html = html.replace('plates: 1', 'plates: 1,\n            firePlates: 0');
    
    // In triggerSlamStop
    const slamPerfectTarget = `            if (isPerfect) {\n                slamState.streak++;`;
    const slamPerfectReplacement = `            if (isPerfect) {\n                if (slamState.streak > 0 && slamState.streak % 4 === 0) {\n                    slamState.firePlates = 2;\n                    showNotification('Fire Plates! 3x Points!');\n                    playSfx('powerup');\n                }\n                slamState.streak++;`;
    html = html.replace(slamPerfectTarget, slamPerfectReplacement);
    
    const slamPtsTarget = `const ptsEarned = Math.floor((120 * slamState.plates) * skinObj.mult);`;
    const slamPtsReplacement = `let ptsEarned = Math.floor((120 * slamState.plates) * skinObj.mult);\n                if (slamState.firePlates > 0) {\n                    ptsEarned *= 3;\n                    slamState.firePlates--;\n                    document.getElementById('slam-bubble').style.backgroundColor = '#fb923c';\n                }`;
    html = html.replace(slamPtsTarget, slamPtsReplacement);
}

// RUNNER: Shield
if (!html.includes('runnerState.shieldTime')) {
    html = html.replace('particles: [],', 'particles: [],\n            shieldTime: 0,');
    
    const runnerSpawnTarget = `                        runnerState.obstacles.push({
                            type: 'protein',`;
    const runnerSpawnReplacement = `                        if (Math.random() < 0.05) {
                            runnerState.obstacles.push({
                                type: 'shield', x: W + 100, y: groundY - 60 - 24, w: 24, h: 24,
                                emoji: '🛡️', color: '#3b82f6', glowColor: 'rgba(59, 130, 246, 0.6)',
                                speed: runnerState.gameSpeed, points: 0
                            });
                        }
                        runnerState.obstacles.push({
                            type: 'protein',`;
    html = html.replace(runnerSpawnTarget, runnerSpawnReplacement);
    
    const runnerUpdateTarget = `            // Update player`;
    const runnerUpdateReplacement = `            if (runnerState.shieldTime > 0) runnerState.shieldTime--;\n            // Update player`;
    html = html.replace(runnerUpdateTarget, runnerUpdateReplacement);
    
    const runnerCollisionTarget = `                        // Collision!`;
    const runnerCollisionReplacement = `                        // Collision!
                        if (obs.type === 'shield') {
                            playSfx('powerup');
                            runnerState.shieldTime = 400;
                            showNotification('Shield Active!');
                            runnerState.obstacles.splice(i, 1);
                            createParticles(obs.x + obs.w/2, obs.y + obs.h/2, '#3b82f6', 20);
                            break;
                        }`;
    html = html.replace(runnerCollisionTarget, runnerCollisionReplacement);
    
    const runnerFailTarget = `                        if (obs.type === 'protein') {`;
    const runnerFailReplacement = `                        if (obs.type === 'shield') {
                            /* handled above */
                        } else if (obs.type === 'protein') {`;
    html = html.replace(runnerFailTarget, runnerFailReplacement);
    
    const runnerDieTarget = `                        } else {
                            // Hit a weight!`;
    const runnerDieReplacement = `                        } else {
                            // Hit a weight!
                            if (runnerState.shieldTime > 0) {
                                // Break obstacle
                                runnerState.obstacles.splice(i, 1);
                                createParticles(obs.x + obs.w/2, obs.y + obs.h/2, '#94a3b8', 20);
                                playSfx('slam_heavy');
                                hapticFeedback('slam_heavy');
                                break;
                            }`;
    html = html.replace(runnerDieTarget, runnerDieReplacement);
    
    const playerDrawTarget = `            // Draw Player`;
    const playerDrawReplacement = `            // Draw Player
            if (runnerState.shieldTime > 0) {
                ctx.save();
                ctx.globalAlpha = (runnerState.shieldTime < 60 && Math.floor(runnerState.shieldTime / 5) % 2 === 0) ? 0.2 : 0.6;
                ctx.fillStyle = '#3b82f6';
                ctx.beginPath();
                ctx.arc(p.x + p.w/2, p.y + p.h/2, p.w, 0, Math.PI*2);
                ctx.fill();
                ctx.restore();
            }`;
    html = html.replace(playerDrawTarget, playerDrawReplacement);
}

// CATCHER: Frenzy Pill
if (!html.includes('catcherState.frenzyTime')) {
    html = html.replace('particles: []', 'particles: [],\n            frenzyTime: 0');
    
    const catcherSpawnTarget = `                catcherState.items.push({
                    x: Math.random() * (W - 35) + 15,
                    y: -15,
                    speed: (Math.random() * 1.8 + 2.2) * speedScale,
                    emoji: chosen.emoji,`;
    const catcherSpawnReplacement = `                let isFrenzy = Math.random() < 0.05;
                catcherState.items.push({
                    x: Math.random() * (W - 35) + 15,
                    y: -15,
                    speed: (Math.random() * 1.8 + 2.2) * speedScale,
                    emoji: isFrenzy ? '💊' : chosen.emoji,
                    type: isFrenzy ? 'frenzy' : 'normal',`;
    html = html.replace(catcherSpawnTarget, catcherSpawnReplacement);
    
    const catcherUpdateTarget = `            // Update items`;
    const catcherUpdateReplacement = `            if (catcherState.frenzyTime > 0) {
                catcherState.frenzyTime--;
                let lowestY = -999;
                let targetX = catcherState.basket.x + catcherState.basket.w/2;
                for (let i=0; i<catcherState.items.length; i++) {
                    if (catcherState.items[i].y > lowestY && catcherState.items[i].pts >= 0) {
                        lowestY = catcherState.items[i].y;
                        targetX = catcherState.items[i].x;
                    }
                }
                catcherState.basket.x += (targetX - (catcherState.basket.x + catcherState.basket.w/2)) * 0.2;
                if(catcherState.basket.x < 0) catcherState.basket.x = 0;
                if(catcherState.basket.x > catcherCanvas.width - catcherState.basket.w) catcherState.basket.x = catcherCanvas.width - catcherState.basket.w;
            }
            // Update items`;
    html = html.replace(catcherUpdateTarget, catcherUpdateReplacement);
    
    const catcherCollisionTarget = `                    // Caught!`;
    const catcherCollisionReplacement = `                    // Caught!
                    if (item.type === 'frenzy') {
                        playSfx('powerup');
                        catcherState.frenzyTime = 400;
                        showNotification('Frenzy Pill! Auto-Catch!');
                    }`;
    html = html.replace(catcherCollisionTarget, catcherCollisionReplacement);
    
    const catcherPtsTarget = `                    } else {
                        catcherState.score += item.pts;`;
    const catcherPtsReplacement = `                    } else if (item.type !== 'frenzy') {
                        catcherState.score += item.pts;`;
    html = html.replace(catcherPtsTarget, catcherPtsReplacement);
    
    const catcherDrawTarget = `            // Shaker body`;
    const catcherDrawReplacement = `            // Frenzy Glow
            if (catcherState.frenzyTime > 0) {
                ctx.fillStyle = 'rgba(244, 114, 182, 0.4)';
                ctx.beginPath();
                ctx.arc(bx + bw/2, by + bh/2, bw*1.5, 0, Math.PI*2);
                ctx.fill();
            }
            // Shaker body`;
    html = html.replace(catcherDrawTarget, catcherDrawReplacement);
}

fs.writeFileSync(path, html, 'utf8');
console.log('Successfully injected powerups.');
