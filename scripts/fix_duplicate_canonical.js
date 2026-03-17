const fs = require('fs');
const path = require('path');

const baseDir = path.join('e:', 'gym', 'github', 'abcv');
const dirsToCheck = [baseDir, path.join(baseDir, 'blog')];

let totalFixed = 0;

for (const dir of dirsToCheck) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

  for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Find all canonical tags
    const canonicalRegex = /<link[^>]+rel=["']canonical["'][^>]*>/gi;
    const matches = content.match(canonicalRegex);

    if (matches && matches.length > 1) {
      // Keep only the FIRST canonical tag, remove all subsequent ones
      let firstFound = false;
      let fixed = content.replace(canonicalRegex, (match) => {
        if (!firstFound) {
          firstFound = true;
          return match; // keep the first one
        }
        // Remove extra ones (replace with empty string, also remove trailing newline if any)
        return '';
      });

      // Clean up any double blank lines that result from the removal
      fixed = fixed.replace(/\n{3,}/g, '\n\n');

      fs.writeFileSync(filePath, fixed, 'utf-8');
      console.log(`Fixed: ${file} (had ${matches.length} canonical tags)`);
      totalFixed++;
    }
  }
}

console.log(`\nDone! Fixed ${totalFixed} pages.`);
