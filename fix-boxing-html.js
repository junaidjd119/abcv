const fs = require('fs');
const path = 'E:/gym/abcv-main/abcv-main/gym-empire-arcade.html';
let html = fs.readFileSync(path, 'utf8');

const boxingTabHTML = `        <!-- TAB: BOXING -->
        <div id="tab-boxing" class="tab-content hidden flex-1 flex flex-col items-center justify-center relative p-4 pb-24">
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-950/40 via-slate-900 to-slate-950 -z-10"></div>
            
            <!-- Game Info -->
            <div class="absolute top-6 w-full max-w-md px-6 flex justify-between items-center z-10">
                <div class="bg-slate-900/80 border border-slate-700/50 rounded-xl px-4 py-2 backdrop-blur-sm shadow-xl">
                    <span class="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-0.5">Combos</span>
                    <span id="boxing-combo" class="text-3xl font-display font-black text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.5)]">0</span>
                </div>
                <div class="bg-slate-900/80 border border-slate-700/50 rounded-xl px-4 py-2 backdrop-blur-sm shadow-xl text-right">
                    <span class="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-0.5">Time</span>
                    <span id="boxing-time" class="text-3xl font-display font-black text-white">30s</span>
                </div>
            </div>

            <!-- Canvas -->
            <div class="relative w-full max-w-md mt-16 flex-1 flex items-center justify-center">
                <div class="relative w-full h-[400px] bg-slate-900/50 rounded-3xl border-2 border-slate-800 overflow-hidden shadow-2xl">
                    <canvas id="boxingCanvas" class="w-full h-full block touch-none"></canvas>
                    
                    <!-- Start/Game Over Overlay -->
                    <div id="boxing-overlay" class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                        <div class="text-6xl mb-4">🥊</div>
                        <h3 id="boxing-overlay-title" class="text-2xl font-display font-bold text-white mb-2">Punching Bag Blitz</h3>
                        <p id="boxing-overlay-desc" class="text-slate-400 text-sm mb-6 text-center max-w-[200px]">Tap left and right sides rapidly to build your combo!</p>
                        <button onclick="startBoxingGame()" class="px-8 py-3 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-full text-lg shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-transform hover:scale-105 active:scale-95">
                            START
                        </button>
                    </div>
                </div>
            </div>

            <!-- Mobile Controls -->
            <div class="w-full max-w-md mt-6 grid grid-cols-2 gap-4 px-4">
                <button id="boxing-btn-left" class="h-20 bg-slate-800 border-2 border-slate-700 rounded-2xl active:bg-slate-700 active:border-rose-500 transition-colors shadow-lg flex items-center justify-center touch-manipulation">
                    <span class="text-3xl opacity-50">🤛</span>
                </button>
                <button id="boxing-btn-right" class="h-20 bg-slate-800 border-2 border-slate-700 rounded-2xl active:bg-slate-700 active:border-rose-500 transition-colors shadow-lg flex items-center justify-center touch-manipulation">
                    <span class="text-3xl opacity-50">🤜</span>
                </button>
            </div>
        </div>

`;

if (!html.includes('id="tab-boxing"')) {
    html = html.replace('<div id="tab-catcher" class="tab-content hidden">', boxingTabHTML + '        <div id="tab-catcher" class="tab-content hidden">');
    fs.writeFileSync(path, html, 'utf8');
    console.log('Successfully injected Box Blitz HTML.');
} else {
    console.log('HTML already injected.');
}
