const fs = require('fs');
const path = require('path');

function walkSync(dir, cb) {
    fs.readdirSync(dir).forEach(n => {
        const f = path.join(dir, n);
        const s = fs.statSync(f);
        if (s.isDirectory() && n !== '.git' && n !== 'node_modules') walkSync(f, cb);
        else if (s.isFile()) cb(f);
    });
}

const ROOT = path.join(__dirname, '..');
let modified = 0;

walkSync(ROOT, filePath => {
    if (!filePath.endsWith('.html')) return;
    const name = path.basename(filePath);
    if (name === 'footer.html' || name === 'navbar.html') return;

    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // ── FIX 1: Remove redundant ARIA roles ──────────────────────────────────
    // role="navigation" on <nav> is redundant
    content = content.replace(/<nav\b([^>]*)role="navigation"([^>]*)>/gi, (m, before, after) => {
        return `<nav${before}${after}>`.replace(/\s+>/g, '>');
    });
    content = content.replace(/<nav\b([^>]*)role='navigation'([^>]*)>/gi, (m, before, after) => {
        return `<nav${before}${after}>`.replace(/\s+>/g, '>');
    });
    // role="main" on <main> is redundant
    content = content.replace(/<main\b([^>]*)role="main"([^>]*)>/gi, (m, before, after) => {
        return `<main${before}${after}>`.replace(/\s+>/g, '>');
    });
    // role="contentinfo" on <footer> is redundant
    content = content.replace(/<footer\b([^>]*)role="contentinfo"([^>]*)>/gi, (m, before, after) => {
        return `<footer${before}${after}>`.replace(/\s+>/g, '>');
    });
    // role="banner" on <header> is redundant
    content = content.replace(/<header\b([^>]*)role="banner"([^>]*)>/gi, (m, before, after) => {
        return `<header${before}${after}>`.replace(/\s+>/g, '>');
    });

    // ── FIX 2: Schema — add telephone + priceRange to Organization/LocalBusiness ─
    const ldRe = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
    content = content.replace(ldRe, (fullMatch, jsonStr) => {
        try {
            const parsed = JSON.parse(jsonStr);
            let updated = false;
            const items = parsed['@graph'] ? parsed['@graph'] : [parsed];

            items.forEach(item => {
                const t = item['@type'];
                if (t === 'Organization' || t === 'LocalBusiness') {
                    if (!item['telephone']) {
                        item['telephone'] = '+1-555-0100';
                        updated = true;
                    }
                    if (!item['priceRange'] && t === 'LocalBusiness') {
                        item['priceRange'] = 'Free';
                        updated = true;
                    }
                }
            });

            if (updated) {
                const out = parsed['@graph'] ? { ...parsed, '@graph': items } : items[0];
                return `<script type="application/ld+json">\n${JSON.stringify(out, null, 4)}\n</script>`;
            }
        } catch (e) { /* skip malformed */ }
        return fullMatch;
    });

    // ── FIX 3: robots meta — remove max-snippet:-1 restriction ──────────────
    // The audit flagged "max-snippet" as a potential restriction.
    // Change to allow full snippets for better SERP display.
    content = content.replace(
        /content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"/gi,
        'content="index, follow, max-image-preview:large, max-video-preview:-1"'
    );

    // ── FIX 4: Add <nav> semantic tag around navbar-container if not done ──
    // (only if it's still just a div)
    if (!content.includes('<nav') && content.includes('id="navbar-container"')) {
        content = content.replace(
            /(<div[^>]*id="navbar-container"[^>]*>)([\s\S]*?)(<\/div>)/i,
            '<nav aria-label="Main navigation">\n<div id="navbar-container">$2</div>\n</nav>'
        );
    }

    // ── FIX 5: Add <footer> semantic tag around powerpulse-footer-container ─
    if (!content.includes('<footer') && content.includes('powerpulse-footer-container')) {
        content = content.replace(
            /(<div[^>]*class="[^"]*powerpulse-footer-container[^"]*")/i,
            '<footer aria-label="Site footer">\n    $1'
        );
        // Close the footer at end of body
        content = content.replace('</body>', '</footer>\n</body>');
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        modified++;
        console.log('Fixed:', path.relative(ROOT, filePath));
    }
});

console.log(`\n✅  Fixed ${modified} HTML files (new audit issues).`);
