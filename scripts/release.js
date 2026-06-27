/**
 * BRUTALIST CHROME — Release Script
 * Bumps version in manifest.json and package.json, then runs zip.
 */

const fs   = require('fs');
const path = require('path');

const ROOT         = path.resolve(__dirname, '..');
const manifestPath = path.join(ROOT, 'manifest.json');
const packagePath  = path.join(ROOT, 'package.json');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
const pkg      = JSON.parse(fs.readFileSync(packagePath,  'utf-8'));

const [major, minor, patch] = manifest.version.split('.').map(Number);
const newVersion = `${major}.${minor}.${patch + 1}`;

manifest.version = newVersion;
pkg.version      = newVersion;

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
fs.writeFileSync(packagePath,  JSON.stringify(pkg,      null, 2));

console.log(`\n🚀 BRUTALIST CHROME — Released v${newVersion}\n`);
require('./zip.js');
