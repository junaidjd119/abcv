const fs = require('fs');

const path = 'E:/gym/abcv-main/abcv-main/gym-empire-arcade.html';
let html = fs.readFileSync(path, 'utf8');

// 1. Insert Splash Screen before <div id="game-root"
const splashHTML = `
    <!-- SPLASH SCREEN -->
    <div id="splash-screen" class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md transition-opacity duration-500">
        <h1 class="text-5xl md:text-7xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-6 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)] tracking-tighter text-center" style="-webkit-background-clip: text;">
            GYM EMPIRE<br/><span class="text-3xl md:text-5xl text-white drop-shadow-none">ARCADE</span>
        </h1>
        <p class="text-slate-400 mb-12 text-center max-w-sm px-6 font-mono text-sm">Welcome to the international arena. Tap to start grinding.</p>
        <button onclick="startGame()" class="px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-full text-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all transform hover:scale-105 active:scale-95 animate-pulse">
            PLAY NOW
        </button>
    </div>

    <!-- SETTINGS MODAL -->
    <div id="settings-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur hidden opacity-0 transition-opacity duration-300">
        <div class="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl transform scale-95 transition-transform duration-300" id="settings-content">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-display font-bold text-white">Settings</h2>
                <button onclick="toggleSettings()" class="text-slate-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
            </div>
            
            <div class="space-y-4">
                <div class="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <div class="flex items-center gap-3">
                        <span class="text-xl">🔊</span>
                        <span class="font-semibold text-slate-200">Sound Effects</span>
                    </div>
                    <button id="toggle-sound-btn" onclick="toggleSetting('sound')" class="w-12 h-6 rounded-full relative transition-colors duration-300">
                        <div class="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm transition-transform duration-300"></div>
                    </button>
                </div>

                <div class="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <div class="flex items-center gap-3">
                        <span class="text-xl">📳</span>
                        <span class="font-semibold text-slate-200">Haptic Feedback</span>
                    </div>
                    <button id="toggle-vibration-btn" onclick="toggleSetting('vibration')" class="w-12 h-6 rounded-full relative transition-colors duration-300">
                        <div class="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm transition-transform duration-300"></div>
                    </button>
                </div>
            </div>
        </div>
    </div>
`;
html = html.replace('<div id="game-root" class="relative z-10 flex flex-col min-h-screen">', splashHTML + '\n    <div id="game-root" class="relative z-10 flex flex-col min-h-screen hidden">');

// 2. Add Settings Icon next to the badge
const badgeHTML = `<div id="session-challenge-badge" class="hidden flex items-center gap-1 text-amber-400">`;
const wrapperStart = `<div class="flex items-center gap-2">\n                <div id="session-challenge-badge" class="hidden flex items-center gap-1 text-amber-400">`;
html = html.replace(badgeHTML, wrapperStart);

const badgeEndHTML = `                    <span id="session-bonus-text" class="text-emerald-400 font-bold hidden">+25%</span>\n                </div>\n            </div>`;
const wrapperEnd = `                    <span id="session-bonus-text" class="text-emerald-400 font-bold hidden">+25%</span>\n                </div>\n                <button onclick="toggleSettings()" class="text-slate-400 hover:text-white transition-colors" title="Settings">\n                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>\n                </button>\n            </div>\n            </div>`;
html = html.replace(badgeEndHTML, wrapperEnd);

// 3. Inject JS logic
const jsLogic = `        function startGame() {
            playSfx('click');
            const splash = document.getElementById('splash-screen');
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.classList.add('hidden');
                document.getElementById('game-root').classList.remove('hidden');
                document.getElementById('runner-tutorial').classList.remove('hidden');
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
                void modal.offsetWidth;
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
            const btn = document.getElementById(\`toggle-\${key}-btn\`);
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

        // Handle resizing for both canvases`;
html = html.replace(`        // Handle resizing for both canvases`, jsLogic);

// 4. Remove auto-show tutorial
html = html.replace(`        // Auto-show runner tutorial\n        document.getElementById('runner-tutorial').classList.remove('hidden');`, `        // Runner tutorial shown after splash screen`);

fs.writeFileSync(path, html, 'utf8');
console.log('Successfully applied updates.');
