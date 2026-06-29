const fs = require('fs');

const origPath = 'E:/gym/temp_extract/abcv-main/gym-empire-arcade.html';
const currentPath = 'E:/gym/abcv-main/abcv-main/gym-empire-arcade.html';
let html = fs.readFileSync(origPath, 'utf8');

const injectJeep = fs.readFileSync('E:/gym/abcv-main/abcv-main/inject-jeep.js', 'utf8');
const truckJsMatch = injectJeep.match(/const jeepJS = \`([\s\S]*?)\`;/);
let truckJs = truckJsMatch[1];
// FIX: Replace exact escaped substrings
truckJs = truckJs.split('\\`').join('`').split('\\$').join('$');

const injectBoxingJs = fs.readFileSync('E:/gym/abcv-main/abcv-main/inject-boxing-js.js', 'utf8');
let boxingJsMatch = injectBoxingJs.match(/const boxingJs = \`([\s\S]*?)\`;/);
let boxingJs = boxingJsMatch[1];
boxingJs = boxingJs.split('\\`').join('`').split('\\$').join('$');

const fixBoxingBugs = fs.readFileSync('E:/gym/abcv-main/abcv-main/fix-boxing-bugs.js', 'utf8');
let fixMatch1 = fixBoxingBugs.match(/html = html.replace\(\`([\s\S]*?)\`,\n\`([\s\S]*?)\`\);/);
if(fixMatch1) {
    let oldCode = fixMatch1[1].split('\\`').join('`').split('\\$').join('$');
    let newCode = fixMatch1[2].split('\\`').join('`').split('\\$').join('$');
    boxingJs = boxingJs.replace(oldCode, newCode);
}

const injectTruck = fs.readFileSync('E:/gym/abcv-main/abcv-main/inject-truck.js', 'utf8');
let truckHtmlMatch = injectTruck.match(/const truckTabHtml = \`([\s\S]*?)\`;/);
let truckHtml = truckHtmlMatch[1];
let badBlock = `<div class="flex-1 mx-4">
                    <div class="h-4 bg-slate-800 rounded-full border border-slate-700 overflow-hidden relative">
                        <div id="truck-progress" class="h-full bg-gradient-to-r from-sky-500 to-emerald-400 w-0 transition-all duration-300"></div>
                        <div class="absolute right-1 top-0 text-[10px] h-full flex items-center">🏁</div>
                    </div>
                </div>`;
let goodBlock = `<div class="flex-1 mx-4 flex flex-col gap-2">
                    <div class="h-3 bg-slate-800 rounded-full border border-slate-700 overflow-hidden relative shadow-inner">
                        <div id="truck-progress" class="h-full bg-gradient-to-r from-sky-500 to-emerald-400 w-0 transition-all duration-300"></div>
                        <div class="absolute right-1 top-0 text-[8px] h-full flex items-center">🏁</div>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Fuel</span>
                        <div class="h-2 flex-1 bg-slate-800 rounded-full border border-slate-700 overflow-hidden">
                            <div id="truck-fuel" class="h-full bg-rose-500 w-full transition-all duration-75"></div>
                        </div>
                    </div>
                </div>`;
truckHtml = truckHtml.replace(badBlock, goodBlock);

const fixBoxingHtml = fs.readFileSync('E:/gym/abcv-main/abcv-main/fix-boxing-html.js', 'utf8');
let boxingHtmlMatch = fixBoxingHtml.match(/const boxingTabHTML = \`([\s\S]*?)\`;/);
let boxingHtml = boxingHtmlMatch[1];

html = html.replace(/\s*<!-- ========================================================================= -->\s*<!-- TAB 3: PROTEIN CATCHER/, 
'\n' + truckHtml + '\n' + boxingHtml + '\n            <!-- ========================================================================= -->\n            <!-- TAB 3: PROTEIN CATCHER');

html = html.replace(/\s*\/\/ Window resize handler/, 
'\n' + truckJs + '\n' + boxingJs + '\n        // Window resize handler');

let truckBtn = `                <button onclick="switchTab('truck')" id="tab-btn-truck" class="tab-btn py-3.5 px-3 flex items-center gap-1.5 border-b-2 hover:text-white font-display font-bold text-[10px] md:text-xs tracking-wide transition-all duration-300 border-transparent text-slate-400">
                    <span class="text-[12px]">🛻</span>
                    <span>Off-Road</span>
                </button>`;
let boxingBtn = `                <button onclick="switchTab('boxing')" id="tab-btn-boxing" class="tab-btn py-3.5 px-3 flex items-center gap-1.5 border-b-2 hover:text-white font-display font-bold text-[10px] md:text-xs tracking-wide transition-all duration-300 border-transparent text-slate-400">
                    <span class="text-[12px]">🥊</span>
                    <span>Box Blitz</span>
                </button>`;
html = html.replace(/\s*<button onclick="switchTab\('catcher'\)" id="tab-btn-catcher"/, 
'\n' + truckBtn + '\n' + boxingBtn + '\n                <button onclick="switchTab(\'catcher\')" id="tab-btn-catcher"');

let switchTabAdditions = `
            if (typeof truckState !== 'undefined') {
                truckState.active = false;
                if(typeof truckAnimationFrame !== 'undefined') cancelAnimationFrame(truckAnimationFrame);
            }
            if (typeof boxingState !== 'undefined') {
                boxingState.active = false;
                if (typeof boxingTimer !== 'undefined') clearInterval(boxingTimer);
                if (typeof boxingAnimationFrame !== 'undefined') cancelAnimationFrame(boxingAnimationFrame);
            }
`;
html = html.replace(/\s*if \(tabId === 'runner'\) \{/, 
switchTabAdditions + `\n            if (tabId === 'runner') {`);

let keydownAdditions = `
            const isTruckVisible = !document.getElementById('tab-truck').classList.contains('hidden');
            if (isTruckVisible && typeof truckState !== 'undefined' && truckState.active) {
                if (e.code === 'ArrowRight' || e.code === 'KeyD') { e.preventDefault(); truckState.gas = true; }
                if (e.code === 'ArrowLeft' || e.code === 'KeyA') { e.preventDefault(); truckState.brake = true; }
            }
            
            const isBoxingVisible = !document.getElementById('tab-boxing').classList.contains('hidden');
            if (isBoxingVisible && typeof boxingState !== 'undefined' && boxingState.active) {
                if (e.code === 'ArrowLeft' || e.code === 'KeyA') { e.preventDefault(); tapBoxing('left'); }
                if (e.code === 'ArrowRight' || e.code === 'KeyD') { e.preventDefault(); tapBoxing('right'); }
            }
`;
html = html.replace(/\s*if \(e.code === 'Space' \|\| e.code === 'ArrowUp'\) \{/, 
keydownAdditions + `\n            if (e.code === 'Space' || e.code === 'ArrowUp') {`);

let keyupAdditions = `
        document.addEventListener('keyup', (e) => {
            const isTruckVisible = !document.getElementById('tab-truck').classList.contains('hidden');
            if (isTruckVisible && typeof truckState !== 'undefined' && truckState.active) {
                if (e.code === 'ArrowRight' || e.code === 'KeyD') { e.preventDefault(); truckState.gas = false; }
                if (e.code === 'ArrowLeft' || e.code === 'KeyA') { e.preventDefault(); truckState.brake = false; }
            }
        });
`;
html = html.replace(/\s*\/\/ Window resize handler/, 
keyupAdditions + `\n        // Window resize handler`);

html = html.replace(/\s*startRunnerGame\(\);\r?\n\s*\}, 300\);/, 
`\n                startRunnerGame();\n                if(typeof initBoxing === 'function') initBoxing();\n                if(typeof initTruck === 'function') initTruck();\n            }, 300);`);


fs.writeFileSync(currentPath, html, 'utf8');
console.log('Master restoration 2 complete!');
