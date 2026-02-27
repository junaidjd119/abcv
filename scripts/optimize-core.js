const fs = require('fs');
const path = require('path');

const coreFiles = [
    'index.html',
    'workoutplanner.html',
    'dietplanner.html',
    'caloriecalculator.html',
    'nutrition.html',
    'about.html',
    'contact.html',
    'blog.html',
    'privacy.html',
    'terms_of_service.html',
    'accessibility.html'
];
const rootDir = path.join(__dirname, '..');

function optimizeCoreFile(filename) {
    const filePath = path.join(rootDir, filename);
    if (!fs.existsSync(filePath)) {
        console.log(`[SKIPPED] ${filename} not found.`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf-8');
    let changed = false;

    // 1. Lazy load all images except the first (LCP)
    let imgCount = 0;
    content = content.replace(/<img([^>]*)>/gi, (match, attrs) => {
        imgCount++;
        if (/loading=/i.test(attrs)) return match;
        if (imgCount === 1) return match; // skip first
        return '<img loading="lazy"' + attrs + '>';
    });

    // 2. Preload LCP hero images (if any obvious og:image in head)
    if (!content.includes('<link rel="preload"')) {
        const ogImgMatch = content.match(/<meta property="og:image" content="([^"]+)"/);
        if (ogImgMatch && ogImgMatch[1]) {
            const preloadHint = `    <link rel="preload" as="image" href="${ogImgMatch[1]}">\n`;
            if (content.includes('<link rel="canonical"')) {
                content = content.replace('<link rel="canonical"', preloadHint + '    <link rel="canonical"');
                changed = true;
            }
        }
    }

    // 3. Ensure alt attributes are present, even if empty (accessibility), add generic if missing
    content = content.replace(/<img([^>]*)>/gi, (match, attrs) => {
        if (!/alt=/i.test(attrs)) {
            return `<img alt="GymTranning content"${attrs}>`;
        }
        return match;
    });

    // 4. Implement rel="noopener" on external links
    content = content.replace(/<a\s([^>]*href="https?:\/\/(?!www\.gymtranning\.com)[^"]+")[^>]*>/gi, (match, attrs) => {
        if (/rel=/i.test(attrs)) return match;
        return match.replace('<a ', '<a rel="noopener noreferrer" ');
    });

    // 5. Preload core fonts (already did some but to be sure)
    const fontPreload = `
    <!-- Preconnect & Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`;

    if (!content.includes('rel="preconnect" href="https://fonts.googleapis.com"')) {
        if (content.includes('<!-- Tailwind CSS -->')) {
            content = content.replace('<!-- Tailwind CSS -->', fontPreload + '\n    <!-- Tailwind CSS -->');
        } else if (content.includes('</head>')) {
            content = content.replace('</head>', fontPreload + '\n</head>');
        }
    }

    // Checking heading hierarchy for multiple H1s (we'll just log them to fix manually as automated replacement of H1 to H2 can break styling)
    const h1Matches = content.match(/<h1[^>]*>.*?<\/h1>/gis);
    if (h1Matches && h1Matches.length > 1) {
        console.warn(`[WARNING] Multiple H1 tags found in ${filename}: ${h1Matches.length}`);
    }

    // Lazy load iframes
    content = content.replace(/<iframe([^>]*)>/gi, (match, attrs) => {
        if (/loading=/i.test(attrs)) return match;
        return '<iframe loading="lazy"' + attrs + '>';
    });

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`[OPTIMIZED] ${filename}`);
}

coreFiles.forEach(optimizeCoreFile);
console.log('Core pages optimization complete.');
