const fs = require('fs');
const path = 'E:/gym/abcv-main/abcv-main/gym-empire-arcade.html';
let html = fs.readFileSync(path, 'utf8');

const jsInject = `
        // === SPLASH AND SETTINGS LOGIC ===
        function startGame() {
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
        }

        function toggleSettings() {
            playSfx('click');
            const modal = document.getElementById('settings-modal');
            const content = document.getElementById('settings-content');
            
            if (modal.classList.contains('hidden')) {
                updateToggleUI('sound', STATE.settings.sound);
                updateToggleUI('vibration', STATE.settings.vibration);
                
                modal.classList.remove('hidden');
                void modal.offsetWidth; // trigger reflow
                modal.classList.remove('opacity-0');
                content.classList.remove('scale-95');
                content.classList.add('scale-100');
            } else {
                modal.classList.add('opacity-0');
                content.classList.remove('scale-100');
                content.classList.add('scale-95');
                setTimeout(() => {
                    modal.classList.add('hidden');
                }, 300);
            }
        }

        function toggleSetting(key) {
            playSfx('click');
            STATE.settings[key] = !STATE.settings[key];
            saveState();
            updateToggleUI(key, STATE.settings[key]);
            if (key === 'vibration' && STATE.settings.vibration) {
                hapticFeedback('click');
            }
        }

        function updateToggleUI(key, isOn) {
            const btn = document.getElementById('toggle-' + key + '-btn');
            if(!btn) return;
            const knob = btn.querySelector('div');
            if (isOn) {
                btn.classList.add('bg-emerald-500');
                btn.classList.remove('bg-slate-600');
                knob.style.transform = 'translateX(24px)';
            } else {
                btn.classList.add('bg-slate-600');
                btn.classList.remove('bg-emerald-500');
                knob.style.transform = 'translateX(0)';
            }
        }
`;

if (!html.includes('function startGame()')) {
    html = html.replace('// Lucide icons', jsInject + '\n\n        // Lucide icons');
}

// Ensure the auto-start of Runner is disabled so Splash screen is visible!
const autoStartOld = `        document.addEventListener('DOMContentLoaded', function () {
            setTimeout(function () {
                resizeRunner();
                startRunnerGame();
            }, 300);
        });`;

const autoStartNew = `        document.addEventListener('DOMContentLoaded', function () {
            setTimeout(function () {
                resizeRunner();
                // Game waits for user to click PLAY NOW
            }, 300);
        });`;

if (html.includes(autoStartOld)) {
    html = html.replace(autoStartOld, autoStartNew);
} else if (html.includes('startRunnerGame();')) {
     html = html.replace('startRunnerGame();', '// startRunnerGame(); // Wait for splash');
}

fs.writeFileSync(path, html, 'utf8');
console.log("Fixed splash screen and settings JS logic.");
