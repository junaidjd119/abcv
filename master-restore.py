import re

with open('E:/gym/temp_extract/abcv-main/gym-empire-arcade.html', 'r', encoding='utf-8') as f:
    orig_html = f.read()

with open('E:/gym/abcv-main/abcv-main/inject-jeep.js', 'r', encoding='utf-8') as f:
    jeep_js = f.read()
truck_js = re.search(r'const jeepJS = `([\s\S]*?)`;', jeep_js).group(1)
truck_js = truck_js.replace(r'\`', '`').replace(r'\$', '$')

with open('E:/gym/abcv-main/abcv-main/inject-boxing-js.js', 'r', encoding='utf-8') as f:
    boxing_js_raw = f.read()
boxing_js = re.search(r'const boxingJs = `([\s\S]*?)`;', boxing_js_raw).group(1)
boxing_js = boxing_js.replace(r'\`', '`').replace(r'\$', '$')

with open('E:/gym/abcv-main/abcv-main/fix-boxing-bugs.js', 'r', encoding='utf-8') as f:
    fix_boxing_bugs = f.read()
fix_match = re.search(r'html = html\.replace\(`([\s\S]*?)`,\n`([\s\S]*?)`\);', fix_boxing_bugs)
if fix_match:
    old_code = fix_match.group(1).replace(r'\`', '`').replace(r'\$', '$')
    new_code = fix_match.group(2).replace(r'\`', '`').replace(r'\$', '$')
    boxing_js = boxing_js.replace(old_code, new_code)

with open('E:/gym/abcv-main/abcv-main/inject-truck.js', 'r', encoding='utf-8') as f:
    truck_html_raw = f.read()
truck_html = re.search(r'const truckTabHtml = `([\s\S]*?)`;', truck_html_raw).group(1)

bad_block = """<div class="flex-1 mx-4">
                    <div class="h-4 bg-slate-800 rounded-full border border-slate-700 overflow-hidden relative">
                        <div id="truck-progress" class="h-full bg-gradient-to-r from-sky-500 to-emerald-400 w-0 transition-all duration-300"></div>
                        <div class="absolute right-1 top-0 text-[10px] h-full flex items-center">🏁</div>
                    </div>
                </div>"""
good_block = """<div class="flex-1 mx-4 flex flex-col gap-2">
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
                </div>"""
truck_html = truck_html.replace(bad_block, good_block)

with open('E:/gym/abcv-main/abcv-main/fix-boxing-html.js', 'r', encoding='utf-8') as f:
    boxing_html_raw = f.read()
boxing_html = re.search(r'const boxingTabHTML = `([\s\S]*?)`;', boxing_html_raw).group(1)

html = re.sub(r'\s*<!-- ========================================================================= -->\s*<!-- TAB 3: PROTEIN CATCHER', 
'\n' + truck_html + '\n' + boxing_html + '\n            <!-- ========================================================================= -->\n            <!-- TAB 3: PROTEIN CATCHER', orig_html)

html = re.sub(r'\s*// Window resize handler', 
'\n' + truck_js.replace('\\', r'\\') + '\n' + boxing_js.replace('\\', r'\\') + '\n        // Window resize handler', html)

truck_btn = """                <button onclick="switchTab('truck')" id="tab-btn-truck" class="tab-btn py-3.5 px-3 flex items-center gap-1.5 border-b-2 hover:text-white font-display font-bold text-[10px] md:text-xs tracking-wide transition-all duration-300 border-transparent text-slate-400">
                    <span class="text-[12px]">🛻</span>
                    <span>Off-Road</span>
                </button>"""
boxing_btn = """                <button onclick="switchTab('boxing')" id="tab-btn-boxing" class="tab-btn py-3.5 px-3 flex items-center gap-1.5 border-b-2 hover:text-white font-display font-bold text-[10px] md:text-xs tracking-wide transition-all duration-300 border-transparent text-slate-400">
                    <span class="text-[12px]">🥊</span>
                    <span>Box Blitz</span>
                </button>"""
html = re.sub(r'\s*<button onclick="switchTab\(\'catcher\'\)" id="tab-btn-catcher"', 
'\n' + truck_btn + '\n' + boxing_btn + '\n                <button onclick="switchTab(\'catcher\')" id="tab-btn-catcher"', html)

switch_tab_add = """
            if (typeof truckState !== 'undefined') {
                truckState.active = false;
                if(typeof truckAnimationFrame !== 'undefined') cancelAnimationFrame(truckAnimationFrame);
            }
            if (typeof boxingState !== 'undefined') {
                boxingState.active = false;
                if (typeof boxingTimer !== 'undefined') clearInterval(boxingTimer);
                if (typeof boxingAnimationFrame !== 'undefined') cancelAnimationFrame(boxingAnimationFrame);
            }
"""
html = re.sub(r'\s*if \(tabId === \'runner\'\) \{', 
switch_tab_add + "\n            if (tabId === 'runner') {", html)

keydown_add = """
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
"""
html = re.sub(r'\s*if \(e.code === \'Space\' \|\| e.code === \'ArrowUp\'\) \{', 
keydown_add + "\n            if (e.code === 'Space' || e.code === 'ArrowUp') {", html)

keyup_add = """
        document.addEventListener('keyup', (e) => {
            const isTruckVisible = !document.getElementById('tab-truck').classList.contains('hidden');
            if (isTruckVisible && typeof truckState !== 'undefined' && truckState.active) {
                if (e.code === 'ArrowRight' || e.code === 'KeyD') { e.preventDefault(); truckState.gas = false; }
                if (e.code === 'ArrowLeft' || e.code === 'KeyA') { e.preventDefault(); truckState.brake = false; }
            }
        });
"""
html = re.sub(r'\s*// Window resize handler', 
keyup_add + "\n        // Window resize handler", html)

html = re.sub(r'\s*startRunnerGame\(\);\r?\n\s*\}, 300\);', 
"\n                startRunnerGame();\n                if(typeof initBoxing === 'function') initBoxing();\n                if(typeof initTruck === 'function') initTruck();\n            }, 300);", html)

with open('E:/gym/abcv-main/abcv-main/gym-empire-arcade.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Master restoration via python complete!')
