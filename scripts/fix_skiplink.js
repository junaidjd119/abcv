const fs = require('fs');
const path = require('path');

// The skip-link MUST have inline style so it works even if style.css is not loaded
// Replace the old skip-link (which had no inline style) with this new one
const OLD_SKIP = '<a href="#main-content" class="skip-link">Skip to main content</a>';
const NEW_SKIP = '<a href="#main-content" class="skip-link" style="position:absolute;top:-100px;left:1rem;z-index:9999;background:#00C9A7;color:#fff;padding:0.75rem 1.5rem;border-radius:0 0 8px 8px;font-weight:700;font-size:1rem;text-decoration:none;transition:top 0.2s ease;" onfocus="this.style.top=\'0\'" onblur="this.style.top=\'-100px\'">Skip to main content</a>';

function walkSync(dir, cb) {
    fs.readdirSync(dir).forEach(n => {
        const f = path.join(dir, n);
        const s = fs.statSync(f);
        if (s.isDirectory() && n !== '.git' && n !== 'node_modules') walkSync(f, cb);
        else if (s.isFile()) cb(f);
    });
}

const ROOT = path.join(__dirname, '..');
let fixed = 0;

walkSync(ROOT, filePath => {
    if (!filePath.endsWith('.html')) return;
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('class="skip-link"')) return; // no skip-link on this page

    const original = content;
    // Replace any existing skip-link (with or without style attr) with the definitive version
    content = content.replace(/<a[^>]*class="skip-link"[^>]*>Skip to main content<\/a>/g, NEW_SKIP);

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        fixed++;
    }
});

console.log(`✅  Fixed skip-link inline styles in ${fixed} files.`);
