/**
 * GymTranning - Deep Blog Optimization Script
 * 
 * Applies to all files in /blog/:
 * 1.  Lazy loading on all <img> tags (except hero/LCP image - first img is kept eager)
 * 2.  Preconnect + optimized font loading (non-blocking)
 * 3.  Non-blocking Font Awesome loading
 * 4.  Deferred lite-yt-embed.js
 * 5.  rel="noopener noreferrer" on external links
 * 6.  robots meta tag (index, follow) if missing
 * 7.  Improved line-height and reading UX via CSS injection
 * 8.  Internal CTA links to core tools in sidebar if missing
 * 9.  Preload hint for the article's hero image (og:image already set)
 */

const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '../blog');

function optimizeFile(filePath) {
    const fileName = path.basename(filePath);
    let content = fs.readFileSync(filePath, 'utf-8');
    let changed = false;

    // ---- 1. Robots meta tag ----
    if (!content.includes('name="robots"')) {
        content = content.replace(
            '<link rel="canonical"',
            '<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">\n    <link rel="canonical"'
        );
        changed = true;
    }

    // ---- 2. Preconnect for Google Fonts (if not present) ----
    if (!content.includes('rel="preconnect" href="https://fonts.googleapis.com"')) {
        content = content.replace(
            '<!-- Tailwind CSS -->',
            '<!-- Preconnect for performance -->\n    <link rel="preconnect" href="https://fonts.googleapis.com">\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n\n    <!-- Tailwind CSS -->'
        );
        changed = true;
    }

    // ---- 3. Non-blocking Font Awesome loading ----
    // Replace blocking FA link with non-blocking version
    const faBlocking = /<link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.4\.0\/css\/all\.min\.css">/g;
    if (faBlocking.test(content)) {
        content = content.replace(
            faBlocking,
            '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" media="print" onload="this.media=\'all\'">\n    <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"></noscript>'
        );
        changed = true;
    }

    // ---- 4. Defer lite-yt-embed.js ----
    const liteYtSync = /<script src="\.\.\/js\/lite-yt-embed\.js"><\/script>/;
    if (liteYtSync.test(content)) {
        content = content.replace(liteYtSync, '<script src="../js/lite-yt-embed.js" defer></script>');
        changed = true;
    }

    // ---- 5. Lazy load all <img> tags EXCEPT  the first one (LCP) ----
    // We'll add loading="lazy" to all img tags that don't already have it
    // Strategy: first pass - mark all images, then remove lazy from the very first one
    let imgCount = 0;
    content = content.replace(/<img\s/gi, (match, offset, str) => {
        imgCount++;
        return match; // we handle below
    });

    // Actually do the replacement properly
    imgCount = 0;
    content = content.replace(/<img([^>]*)>/gi, (match, attrs) => {
        imgCount++;
        // Skip if already has loading attribute
        if (/loading=/i.test(attrs)) return match;
        // First image: keep eager (it's likely the LCP or avatar)
        if (imgCount === 1) return match;
        // All others: add lazy loading
        return '<img loading="lazy"' + attrs + '>';
    });
    changed = true;

    // ---- 6. rel="noopener noreferrer" on external links ----
    content = content.replace(/<a\s([^>]*href="https?:\/\/(?!www\.gymtranning\.com)[^"]+")[^>]*>/gi, (match, attrs) => {
        if (/rel=/i.test(attrs)) return match; // already has rel
        return match.replace('<a ', '<a rel="noopener noreferrer" ');
    });
    changed = true;

    // ---- 7. Improved reading UX CSS injection ----
    const readingCss = `
        /* Reading UX Improvements */
        .article-content {
            font-size: 1.1rem;
            line-height: 1.9;
            color: #334155;
        }
        .article-content p { margin-bottom: 1.6rem; }
        .article-content h2 { font-size: 1.75rem; margin-top: 2.5rem; margin-bottom: 1rem; border-bottom: 3px solid #00C9A7; padding-bottom: 0.5rem; }
        .article-content h3 { font-size: 1.35rem; margin-top: 2rem; color: #0f172a; }
        .article-content ul, .article-content ol { padding-left: 1.75rem; margin-bottom: 1.6rem; }
        .article-content li { margin-bottom: 0.6rem; line-height: 1.7; }
        .article-content blockquote { border-left: 4px solid #00C9A7; padding: 1rem 1.5rem; background: #f0fdf4; border-radius: 0 8px 8px 0; margin: 2rem 0; font-style: italic; color: #475569; }
        .article-content strong { color: #0f172a; }
        @media (max-width: 768px) {
            .article-content { font-size: 1rem; line-height: 1.8; }
            .article-content h2 { font-size: 1.4rem; }
            .article-content h3 { font-size: 1.15rem; }
        }`;

    if (!content.includes('Reading UX Improvements')) {
        // Inject before the closing </style> of the last <style> block in <head>
        content = content.replace(/(<\/style>\s*\n\s*<script src="\.\.\/layout\.js")/,
            (match) => match.replace('</style>', readingCss + '\n    </style>')
        );
        changed = true;
    }

    // ---- 8. Add preload hint for hero image (from og:image) ----
    if (!content.includes('<link rel="preload"')) {
        const ogImgMatch = content.match(/<meta property="og:image" content="([^"]+)"/);
        if (ogImgMatch && ogImgMatch[1] && !ogImgMatch[1].includes('gymtranning.com/og')) {
            const preloadHint = `    <link rel="preload" as="image" href="${ogImgMatch[1]}">\n`;
            content = content.replace('<link rel="canonical"', preloadHint + '    <link rel="canonical"');
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('[OK] ' + fileName);
    } else {
        console.log('[SKIP] ' + fileName + ' (no changes needed)');
    }
}

const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));
console.log(`Processing ${files.length} blog files...`);
files.forEach(file => optimizeFile(path.join(blogDir, file)));
console.log('Done!');
