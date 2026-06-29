const fs = require('fs');
const vm = require('vm');
const text = fs.readFileSync('E:/gym/abcv-main/abcv-main/gym-empire-arcade.html', 'utf8');
const js = text.match(/<script>([\s\S]*?)<\/script>/)[1];

const listeners = {};

const sandbox = {
    console: console,
    setTimeout: setTimeout,
    setInterval: setInterval,
    clearTimeout: clearTimeout,
    clearInterval: clearInterval,
    window: { 
        innerWidth: 800, 
        innerHeight: 600, 
        addEventListener: (event, cb) => { listeners[event] = listeners[event] || []; listeners[event].push(cb); },
        devicePixelRatio: 1
    },
    document: {
        getElementById: (id) => ({
            id: id,
            getContext: () => ({
                fillRect:()=>{}, arc:()=>{}, fill:()=>{}, beginPath:()=>{},
                moveTo:()=>{}, lineTo:()=>{}, stroke:()=>{}, translate:()=>{},
                rotate:()=>{}, restore:()=>{}, save:()=>{}, fillText:()=>{},
                measureText:()=>({width:10}), createLinearGradient:()=>({addColorStop:()=>{}}),
                drawImage:()=>{}, ellipse:()=>{}
            }),
            classList: { add:()=>{}, remove:()=>{}, contains:()=>false, toggle:()=>{} },
            style: {},
            addEventListener: (event, cb) => { listeners[event] = listeners[event] || []; listeners[event].push(cb); },
            parentElement: { clientWidth: 800, clientHeight: 600 }
        }),
        querySelectorAll: () => [],
        addEventListener: (event, cb) => { listeners[event] = listeners[event] || []; listeners[event].push(cb); },
        querySelector: () => null
    },
    requestAnimationFrame: (cb) => { },
    cancelAnimationFrame: () => {},
    performance: { now: () => Date.now() },
    AudioContext: class { createOscillator() { return {connect:()=>{}, start:()=>{}, stop:()=>{}, frequency:{setValueAtTime:()=>{}}}; } createGain() { return {connect:()=>{}, gain:{setValueAtTime:()=>{}, exponentialRampToValueAtTime:()=>{}}}; } },
    localStorage: { getItem:()=>null, setItem:()=>null },
    Image: class {},
    Math: Math,
    URL: URL,
    Blob: Blob
};
sandbox.window.parent = sandbox.window;
vm.createContext(sandbox);

try {
    const script = new vm.Script(js);
    script.runInContext(sandbox);
    console.log("VM EXECUTION OK");
    
    // Trigger DOMContentLoaded
    if(listeners['DOMContentLoaded']) {
        listeners['DOMContentLoaded'].forEach(cb => {
            try { cb(); console.log("DOMContentLoaded callback OK"); } catch(e) { console.error("DOMContentLoaded ERROR:", e); }
        });
    }
    
} catch(e) {
    console.error("VM ERROR:", e);
}
