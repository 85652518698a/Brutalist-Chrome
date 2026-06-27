/**
 * BRUTALIST CHROME — Zip Script
 * Creates dist/Brutalist-Chrome.zip for Chrome Web Store upload.
 * Run: node scripts/zip.js
 */

const fs      = require('fs');
const path    = require('path');
const { execSync } = require('child_process');

const ROOT    = path.resolve(__dirname, '..');
const DIST    = path.join(ROOT, 'dist');
const OUTPUT  = path.join(DIST, 'Brutalist-Chrome.zip');

// Files/dirs to exclude from the zip
const EXCLUDE = [
  'dist',
  'node_modules',
  '.git',
  '.gitignore',
  'scripts',
  'docs',
  'package.json',
  'package-lock.json',
  '*.md',
];

if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });
if (fs.existsSync(OUTPUT)) fs.unlinkSync(OUTPUT);

console.log('\n📦 BRUTALIST CHROME — Creating zip...\n');

const excludeFlags = EXCLUDE.map(e => `--exclude="${e}"`).join(' ');

try {
  execSync(`cd "${ROOT}" && zip -r "${OUTPUT}" . ${excludeFlags}`, { stdio: 'inherit' });
  const size = (fs.statSync(OUTPUT).size / 1024).toFixed(1);
  console.log(`\n  ✓ Created: dist/Brutalist-Chrome.zip (${size} KB)\n`);
  console.log('  Upload this file to: https://chrome.google.com/webstore/devconsole\n');
} catch (err) {
  // Fallback: manual file list
  console.log('  zip command not found. Listing files to include manually:\n');
  walkDir(ROOT, (f) => {
    const rel = path.relative(ROOT, f);
    if (!EXCLUDE.some(e => rel.startsWith(e))) console.log(`  ${rel}`);
  });
}

function walkDir(dir, cb) {
  fs.readdirSync(dir).forEach(name => {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walkDir(full, cb);
    else cb(full);
  });
}
