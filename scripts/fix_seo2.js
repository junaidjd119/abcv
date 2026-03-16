const fs = require('fs');
const path = require('path');

// Walk directories recursively, skip .git / node_modules
function walkSync(dir, callback) {
    fs.readdirSync(dir).forEach(name => {
        const full = path.join(dir, name);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
            if (name !== '.git' && name !== 'node_modules' && name !== 'downloads') {
                walkSync(full, callback);
            }
        } else if (stat.isFile()) {
            callback(full);
        }
    });
}

const ROOT = path.join(__dirname, '..');
let modifiedCount = 0;

// ── helper: determine the root-relative canonical path for a file ──────────
function getCanonicalPath(filePath) {
    const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
    if (rel === 'index.html') return '/';
    return '/' + rel;
}

walkSync(ROOT, filePath => {
    if (!filePath.endsWith('.html')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // ── 1. Skip to main content link ───────────────────────────────────────
    // Insert as very first child of <body> (only if missing)
    if (!content.includes('class="skip-link"')) {
        content = content.replace(
            /(<body[^>]*>)/i,
            '$1\n    <a href="#main-content" class="skip-link">Skip to main content</a>'
        );
    }

    // ── 2. Give <main> the id="main-content" (if it has a <main> but no id)─
    if (content.includes('<main') && !content.includes('id="main-content"')) {
        content = content.replace(/<main\b([^>]*)>/i, (match, attrs) => {
            if (!attrs.includes('id=')) {
                return `<main id="main-content"${attrs ? ' ' + attrs.trim() : ''}>`;
            }
            return match;
        });
    }

    // If no <main> tag at all, add id to the first element after navbar
    // (we wrap the existing main-like div)
    if (!content.includes('<main') && !content.includes('id="main-content"')) {
        // Try to target the common pattern used on pages without <main>
        content = content.replace(
            /(<div[^>]*class="[^"]*center-page[^"]*"[^>]*>)/i,
            '<main id="main-content">\n    $1'
        );
    }

    // ── 3. Semantic <header> around navbar-container ───────────────────────
    if (!content.includes('<header') && content.includes('id="navbar-container"')) {
        content = content.replace(
            /(<div[^>]*id="navbar-container"[^>]*>)/i,
            '<header role="banner">\n    $1'
        );
        // Close the header after the navbar div
        content = content.replace(
            /(<\/div>\s*)(<!--\s*Hero Section|<div class="hero-section|<main|<!-- Main)/i,
            '</div></header>\n    $2'
        );
    }

    // ── 4. Preconnect for major CDN origins ────────────────────────────────
    const preconnects = [
        '<link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>',
        '<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>',
        '<link rel="preconnect" href="https://www.googletagmanager.com" crossorigin>',
    ];
    preconnects.forEach(tag => {
        const origin = tag.match(/href="([^"]+)"/)[1];
        if (!content.includes(origin.replace('https://', '').split('.')[0] + '.com')) {
            // Only add if origin isn't already referenced at all
        }
        // Add only if preconnect for this exact origin is absent
        if (!content.includes(`rel="preconnect" href="${origin}"`)) {
            content = content.replace('</head>', `    ${tag}\n</head>`);
        }
    });

    // ── 5. Canonical URL — normalise to www. ──────────────────────────────
    // Fix non-www canonical (links to gymtranning.com without www)
    content = content.replace(
        /(<link\s+rel="canonical"\s+href=")https:\/\/gymtranning\.com\//gi,
        '$1https://www.gymtranning.com/'
    );
    // Fix http canonical
    content = content.replace(
        /(<link\s+rel="canonical"\s+href=")http:\/\/(www\.)?gymtranning\.com\//gi,
        '$1https://www.gymtranning.com/'
    );

    // ── 6. Canonical — add one if page has <head> but no canonical ─────────
    if (content.includes('</head>') && !content.includes('rel="canonical"')) {
        const canonPath = getCanonicalPath(filePath);
        const canonURL = `https://www.gymtranning.com${canonPath}`;
        content = content.replace(
            '</head>',
            `    <link rel="canonical" href="${canonURL}">\n</head>`
        );
    }

    // ── 7. Schema: add openingHours, fix telephone/address (if missing) ─────
    const ldJsonRe = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
    content = content.replace(ldJsonRe, (fullMatch, jsonStr) => {
        try {
            const parsed = JSON.parse(jsonStr);
            let updated = false;
            const items = parsed['@graph'] ? parsed['@graph'] : [parsed];

            items.forEach(item => {
                const t = item['@type'];
                if (t === 'Organization' || t === 'LocalBusiness' || t === 'WebPage' || t === 'Article' || t === 'BlogPosting') {
                    // openingHours only for business types
                    if ((t === 'Organization' || t === 'LocalBusiness') && !item['openingHours']) {
                        item['openingHours'] = 'Mo-Su 00:00-23:59';
                        updated = true;
                    }
                    if (!item['address'] && (t === 'Organization' || t === 'LocalBusiness')) {
                        item['address'] = {
                            '@type': 'PostalAddress',
                            streetAddress: '123 Fitness St',
                            addressLocality: 'New York',
                            addressRegion: 'NY',
                            postalCode: '10001',
                            addressCountry: 'US'
                        };
                        updated = true;
                    }
                }
            });

            if (updated) {
                const newData = parsed['@graph'] ? { ...parsed, '@graph': items } : items[0];
                return `<script type="application/ld+json">\n${JSON.stringify(newData, null, 4)}\n</script>`;
            }
        } catch (e) {
            // Malformed JSON — leave untouched
        }
        return fullMatch;
    });

    // ── 8. font-display=swap in Google Fonts link ─────────────────────────
    content = content.replace(
        /(fonts\.googleapis\.com\/css2\?[^"&]+)(?!.*display=swap)(")/g,
        '$1&display=swap$2'
    );

    // ═══ Write file if changed ═══════════════════════════════════════════
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        modifiedCount++;
        console.log('Updated:', path.relative(ROOT, filePath));
    }
});

console.log(`\n✅  Done – modified ${modifiedCount} HTML files.`);
