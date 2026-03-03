const fs = require('fs');
const path = require('path');

const walk = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            if (file !== '.git' && file !== 'node_modules' && file !== 'downloads') {
                results = results.concat(walk(fullPath));
            }
        } else {
            if (file.endsWith('.html')) {
                results.push(fullPath);
            }
        }
    });
    return results;
};

const rootDir = process.cwd();
const htmlFiles = walk(rootDir);

console.log(`Found ${htmlFiles.length} HTML files.`);

htmlFiles.forEach((file) => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // 1. Remove justify-content: center from body styles (internal CSS)
    // This is the main culprit for vertical centering.
    content = content.replace(/(body\s*{[^}]*?)justify-content:\s*center;([^}]*?})/gi, '$1justify-content: flex-start;$2');

    // 2. Ensure body is always top-aligned in internal styles
    if (content.match(/body\s*{/) && !content.includes('justify-content: flex-start')) {
        content = content.replace(/(body\s*{[^}]*?)}/i, '$1justify-content: flex-start;$2}');
    }

    // 3. Check for .center-page class which has min-height: 100vh and centers content
    // We should change it to flex-start as well if it's used as a wrapper.
    content = content.replace(/(\.center-page\s*{[^}]*?)justify-content:\s*center;([^}]*?})/gi, '$1justify-content: flex-start;$2');

    // 4. Remove any rogue min-height: 100vh on containers that might be pushing footer
    // (Only if it's accompanied by centering)

    // 5. Tailwind cleanup (if any body tag has centering classes)
    content = content.replace(/<body([^>]*?)class="([^"]*?)\bitems-center\b([^"]*?)"/gi, '<body$1class="$2$3"');
    content = content.replace(/<body([^>]*?)class="([^"]*?)\bjustify-center\b([^"]*?)"/gi, '<body$1class="$2$3"');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Fixed layout gaps in: ${path.relative(rootDir, file)}`);
    }
});

console.log('Global layout gap fix complete.');
