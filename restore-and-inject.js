const fs = require('fs');

const origPath = 'E:/gym/temp_extract/abcv-main/gym-empire-arcade.html';
const currentPath = 'E:/gym/abcv-main/abcv-main/gym-empire-arcade.html';

let origHtml = fs.readFileSync(origPath, 'utf8');
let currentHtml = fs.readFileSync(currentPath, 'utf8');

// 1. Extract the Boxing and Truck JS from the current file
let boxingJsStart = currentHtml.indexOf('// =========================================================================\r\n        // BOXING GAME LOGIC');
if (boxingJsStart === -1) boxingJsStart = currentHtml.indexOf('// =========================================================================\n        // BOXING GAME LOGIC');

let truckJsStart = currentHtml.indexOf('// =========================================================================\r\n        // MOUNTAIN TRUCK GAME LOGIC');
if (truckJsStart === -1) truckJsStart = currentHtml.indexOf('// =========================================================================\n        // MOUNTAIN TRUCK GAME LOGIC');

let endJs = currentHtml.indexOf('// Audio Context for sound effects');

let newGamesJs = currentHtml.substring(truckJsStart, endJs); // Contains both truck and boxing because truck is before boxing

// Inject new games JS into original HTML right before Audio Context
origHtml = origHtml.replace('        // Audio Context for sound effects', newGamesJs + '        // Audio Context for sound effects');

// 2. Extract SwitchTab additions
// In original switchTab, I added:
// if (typeof truckState !== 'undefined') ...
// if (typeof boxingState !== 'undefined') ...
const switchTabAdditions = `
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
origHtml = origHtml.replace('            if (tabId === \\\'runner\\\') {', switchTabAdditions + '            if (tabId === \\\'runner\\\') {');


// 3. We need to grab the HTML for Boxing and Truck from my injection scripts because it's guaranteed to be clean there
// Or I can just read them directly from the injection scripts I saved on disk!
let injectTruck = fs.readFileSync('E:/gym/abcv-main/abcv-main/inject-truck.js', 'utf8');
let injectJeep = fs.readFileSync('E:/gym/abcv-main/abcv-main/inject-jeep.js', 'utf8');
let fixBoxingHtml = fs.readFileSync('E:/gym/abcv-main/abcv-main/fix-boxing-html.js', 'utf8');

// The truck tab HTML was in injectTruck, but we updated the UI in injectJeep.
// Let's just recreate the truckTabHtml string by extracting it from inject-truck.js, then applying the replaceUI from inject-jeep.js
let truckHtmlMatch = injectTruck.match(/const truckTabHtml = \`([\s\S]*?)\`;/);
let truckHtml = truckHtmlMatch[1];
// Apply jeep UI update
let targetUI = `<div class="flex-1 mx-4">
                    <div class="h-4 bg-slate-800 rounded-full border border-slate-700 overflow-hidden relative">
                        <div id="truck-progress" class="h-full bg-gradient-to-r from-sky-500 to-emerald-400 w-0 transition-all duration-300"></div>`;
let replaceUI = `<div class="flex-1 mx-4 flex flex-col gap-2">
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
// IMPORTANT: We need to also fix the unclosed tag bug in the original string!
// Since we are doing it on the string we control, let's just make it right.
let cleanTruckHtml = truckHtml.replace(targetUI, replaceUI + `
                </div>
            </div>`);
// wait, the original string in inject-truck.js had:
/*
                <div class="flex-1 mx-4">
                    <div class="h-4 bg-slate-800 rounded-full border border-slate-700 overflow-hidden relative">
                        <div id="truck-progress" class="h-full bg-gradient-to-r from-sky-500 to-emerald-400 w-0 transition-all duration-300"></div>
                        <div class="absolute right-1 top-0 text-[10px] h-full flex items-center">🏁</div>
                    </div>
                </div>
*/
// If I replace targetUI with replaceUI, I leave the remaining:
// `                        <div class="absolute right-1 top-0 text-[10px] h-full flex items-center">🏁</div>\n                    </div>\n                </div>`
// This gives the exact overlap bug!
// So let's replace the ENTIRE block!
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
cleanTruckHtml = truckHtml.replace(badBlock, goodBlock);


let boxingHtmlMatch = fixBoxingHtml.match(/const boxingTabHTML = \`([\s\S]*?)\`;/);
let boxingHtml = boxingHtmlMatch[1];
// Boxing HTML doesn't have broken tags, it was fine.

// Now insert Tabs HTML into origHtml before <!-- TAB 3: PROTEIN CATCHER -->
origHtml = origHtml.replace('              <!-- ========================================================================= -->\r\n              <!-- TAB 3: PROTEIN CATCHER', 
cleanTruckHtml + '\n' + boxingHtml + '\n              <!-- ========================================================================= -->\r\n              <!-- TAB 3: PROTEIN CATCHER');
if(!origHtml.includes('TAB: TRUCK')) {
    origHtml = origHtml.replace('              <!-- ========================================================================= -->\n              <!-- TAB 3: PROTEIN CATCHER', 
    cleanTruckHtml + '\n' + boxingHtml + '\n              <!-- ========================================================================= -->\n              <!-- TAB 3: PROTEIN CATCHER');
}

// 4. Inject Tab buttons
let truckBtn = `                <button onclick="switchTab('truck')" id="tab-btn-truck" class="tab-btn py-3.5 px-3 flex items-center gap-1.5 border-b-2 hover:text-white font-display font-bold text-[10px] md:text-xs tracking-wide transition-all duration-300 border-transparent text-slate-400">
                    <span class="text-[12px]">🛻</span>
                    <span>Off-Road</span>
                </button>`;
let boxingBtn = `                <button onclick="switchTab('boxing')" id="tab-btn-boxing" class="tab-btn py-3.5 px-3 flex items-center gap-1.5 border-b-2 hover:text-white font-display font-bold text-[10px] md:text-xs tracking-wide transition-all duration-300 border-transparent text-slate-400">
                    <span class="text-[12px]">🥊</span>
                    <span>Box Blitz</span>
                </button>`;

origHtml = origHtml.replace('                <button onclick="switchTab(\\\'catcher\\\')" id="tab-btn-catcher"', truckBtn + '\n' + boxingBtn + '\n                <button onclick="switchTab(\\\'catcher\\\')" id="tab-btn-catcher"');

// 5. Inject Keydown events
let keydownAdditions = `
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
`;
origHtml = origHtml.replace('            if (e.code === \\\'Space\\\' || e.code === \\\'ArrowUp\\\') {', keydownAdditions + '\n            if (e.code === \\\'Space\\\' || e.code === \\\'ArrowUp\\\') {');

// 6. Inject keyup event for truck
let keyupAdditions = `
        document.addEventListener('keyup', (e) => {
            const isTruckVisible = !document.getElementById('tab-truck').classList.contains('hidden');
            if (isTruckVisible && truckState.active) {
                if (e.code === 'ArrowRight' || e.code === 'KeyD') { e.preventDefault(); truckState.gas = false; }
                if (e.code === 'ArrowLeft' || e.code === 'KeyA') { e.preventDefault(); truckState.brake = false; }
            }
        });
`;
origHtml = origHtml.replace('        // Audio Context for sound effects', keyupAdditions + '\n        // Audio Context for sound effects');


// Save the restored file!
fs.writeFileSync(currentPath, origHtml, 'utf8');
console.log("Restoration Complete!");
