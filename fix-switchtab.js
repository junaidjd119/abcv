const fs = require('fs');
const path = 'E:/gym/abcv-main/abcv-main/gym-empire-arcade.html';
let html = fs.readFileSync(path, 'utf8');

const targetShutDown = `            runnerState.active = false;
            slamState.active = false;
            catcherState.active = false;`;

const replaceShutDown = `            runnerState.active = false;
            slamState.active = false;
            catcherState.active = false;
            if (typeof boxingState !== 'undefined') boxingState.active = false;
            if (typeof endBoxingGame === 'function') endBoxingGame();`;

if (html.includes(targetShutDown)) {
    html = html.replace(targetShutDown, replaceShutDown);
}

const targetTab = `            } else if (tabId === 'catcher') {
                resizeCatcher();
                document.getElementById('catcher-tutorial').classList.remove('hidden');
                document.getElementById('catcher-over-overlay').classList.add('hidden');
            } else if (tabId === 'locker') {`;

const replaceTab = `            } else if (tabId === 'catcher') {
                resizeCatcher();
                document.getElementById('catcher-tutorial').classList.remove('hidden');
                document.getElementById('catcher-over-overlay').classList.add('hidden');
            } else if (tabId === 'boxing') {
                if (typeof resizeBoxing === 'function') resizeBoxing();
                document.getElementById('boxing-overlay').classList.remove('hidden');
                document.getElementById('boxing-combo').innerText = '0';
                document.getElementById('boxing-time').innerText = '30s';
            } else if (tabId === 'locker') {`;

if (html.includes(targetTab)) {
    html = html.replace(targetTab, replaceTab);
}

fs.writeFileSync(path, html, 'utf8');
console.log('Fixed switchTab for boxing.');
