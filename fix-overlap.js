const fs = require('fs');
const path = 'E:/gym/abcv-main/abcv-main/gym-empire-arcade.html';
let html = fs.readFileSync(path, 'utf8');

// The messed up UI is currently:
const badUI = `                    <div class="flex items-center gap-2">
                        <span class="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Fuel</span>
                        <div class="h-2 flex-1 bg-slate-800 rounded-full border border-slate-700 overflow-hidden">
                            <div id="truck-fuel" class="h-full bg-rose-500 w-full transition-all duration-75"></div>
                        </div>
                    </div>
                        <div class="absolute right-1 top-0 text-[10px] h-full flex items-center">🏁</div>
                    </div>
                </div>`;

const goodUI = `                    <div class="flex items-center gap-2">
                        <span class="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Fuel</span>
                        <div class="h-2 flex-1 bg-slate-800 rounded-full border border-slate-700 overflow-hidden">
                            <div id="truck-fuel" class="h-full bg-rose-500 w-full transition-all duration-75"></div>
                        </div>
                    </div>
                </div>`; // just close the flex-1 mx-4 container!

// Wait, the flag character might be malformed in the file depending on encoding. 
// Let's use a regex replace instead.
html = html.replace(/<div class="flex items-center gap-2">[\s\S]*?<div id="truck-fuel" class="h-full bg-rose-500 w-full transition-all duration-75"><\/div>\s*<\/div>\s*<\/div>\s*<div class="absolute right-1 top-0 text-\[10px\] h-full flex items-center">.*?<\/div>\s*<\/div>\s*<\/div>/,
`<div class="flex items-center gap-2">
                        <span class="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Fuel</span>
                        <div class="h-2 flex-1 bg-slate-800 rounded-full border border-slate-700 overflow-hidden">
                            <div id="truck-fuel" class="h-full bg-rose-500 w-full transition-all duration-75"></div>
                        </div>
                    </div>
                </div>`);

fs.writeFileSync(path, html, 'utf8');
console.log('Fixed overlapping tabs!');
