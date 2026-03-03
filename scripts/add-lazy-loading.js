const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const files = ['index.html', 'about.html', 'contact.html', 'blog.html'];

files.forEach(file => {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        // Match <img ...> tags
        // If it doesn't contain loading="lazy", add it
        let modified = false;
        content = content.replace(/<img\s+([^>]*?)>/gi, (match, attrs) => {
            if (!/loading\s*=\s*['"]lazy['"]/i.test(attrs)) {
                modified = true;
                return `<img loading="lazy" ${attrs}>`;
            }
            return match;
        });

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Added lazy loading to images in ${file}`);
        } else {
            console.log(`Images in ${file} already have lazy loading or no images found.`);
        }
    }
});
