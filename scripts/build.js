/**
 * BRUTALIST CHROME — Build Script
 * Validates the extension structure and reports any missing files.
 */

const fs   = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const REQUIRED = [
  'manifest.json',
  'assets/icons/icon16.png',
  'assets/icons/icon32.png',
  'assets/icons/icon48.png',
  'assets/icons/icon128.png',
  'assets/wallpapers/background.webp',
  'newtab/index.html',
  'newtab/style.css',
  'newtab/script.js',
  'extension/background.js',
  'extension/popup/popup.html',
  'extension/options/options.html',
  'extension/sidebar/sidebar.html',
  'theme/variables.css',
];

let allGood = true;
console.log('\n🔨 BRUTALIST CHROME — Build Check\n');

REQUIRED.forEach(file => {
  const full = path.join(ROOT, file);
  if (fs.existsSync(full)) {
    console.log(`  ✓  ${file}`);
  } else {
    console.error(`  ✕  MISSING: ${file}`);
    allGood = false;
  }
});

// Validate manifest
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf-8'));
console.log(`\n  Manifest: ${manifest.name} v${manifest.version} (MV${manifest.manifest_version})`);

if (allGood) {
  console.log('\n  ✓ All checks passed. Ready to load unpacked.\n');
} else {
  console.error('\n  ✕ Some files are missing. Fix before loading.\n');
  process.exit(1);
}
