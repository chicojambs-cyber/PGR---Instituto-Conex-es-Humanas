const fs = require('fs');
const code = fs.readFileSync('/tmp/orig_app.js', 'utf8');

// Let's find source maps or comments if any
console.log('Has source map?', code.includes('sourceMappingURL'));

// Find tab IDs and labels: let's search for typical React tabs pattern
const tabRegex = /id:\s*["']([a-zA-Z0-9_-]+)["'],\s*label:\s*["']([^"']+)["']/g;
let m;
console.log('--- Tabs / Navigation ---');
while ((m = tabRegex.exec(code)) !== null) {
  console.log(m[1], '->', m[2]);
}

// Let's search for navigation items or views
const viewRegex = /["']([a-zA-Z0-9_-]+)["']\s*===?\s*activeTab|activeTab\s*===?\s*["']([a-zA-Z0-9_-]+)["']/g;
const tabsFound = new Set();
while ((m = viewRegex.exec(code)) !== null) {
  tabsFound.add(m[1] || m[2]);
}
console.log('Active tab checks:', Array.from(tabsFound));

// Search for component names or major sections
const matches = code.match(/[A-Z][a-zA-Z0-9]{3,30}(?=Tab|View|Modal|Section|Page|Card|Chart|Table)/g) || [];
console.log('Component clues:', [...new Set(matches)].slice(0, 50));
