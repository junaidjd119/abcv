const fs = require('fs');
const path = 'E:/gym/abcv-main/abcv-main/gym-empire-arcade.html';
let html = fs.readFileSync(path, 'utf8');

// 1. Fix switchTab
const targetSwitchTab = `            if (typeof boxingState !== 'undefined') boxingState.active = false;
            if (typeof endBoxingGame === 'function') endBoxingGame();`;

const replaceSwitchTab = `            if (typeof boxingState !== 'undefined') {
                boxingState.active = false;
                if (typeof boxingTimer !== 'undefined') clearInterval(boxingTimer);
                if (typeof boxingAnimationFrame !== 'undefined') cancelAnimationFrame(boxingAnimationFrame);
            }`;

if (html.includes(targetSwitchTab)) {
    html = html.replace(targetSwitchTab, replaceSwitchTab);
}

// 2. Fix endBoxingGame (remove checkSessionChallenge)
const targetEndBoxing = `            document.getElementById('boxing-overlay-desc').innerHTML = \`Max Combo: <span class="text-rose-400 font-bold">\${boxingState.maxCombo}</span><br>Earned <span class="text-emerald-400 font-bold">+\${pointsEarned}</span> Power!\`;
            
            checkSessionChallenge('boxing');
        }`;

const replaceEndBoxing = `            document.getElementById('boxing-overlay-desc').innerHTML = \`Max Combo: <span class="text-rose-400 font-bold">\${boxingState.maxCombo}</span><br>Earned <span class="text-emerald-400 font-bold">+\${pointsEarned}</span> Power!\`;
            
            // Restore overlay properly
            document.getElementById('boxing-overlay-title').innerText = "Time's Up!";
        }`;

if (html.includes(targetEndBoxing)) {
    html = html.replace(targetEndBoxing, replaceEndBoxing);
}

fs.writeFileSync(path, html, 'utf8');
console.log('Fixed boxing switchTab and endBoxingGame bugs.');
