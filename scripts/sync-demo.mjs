#!/usr/bin/env node
// Copies the app's demo account data and the UI labels the phone uses into the site.
// Usage: npm run sync-demo -- <path to the tigerduck-app repository>
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import qrcode from 'qrcode-generator';
import { cleanHtml } from './demo-html.mjs';

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PHONE_SRC = path.join(SITE, 'src/components/phone');
const OUT_DIR = path.join(PHONE_SRC, 'data');

// Sign-in secrets and file bodies are not needed to draw the screens.
const DROPPED_KEYS = new Set(['school-password', 'library-password', 'password', 'base64']);

function fail(message) {
  console.error(message);
  process.exit(1);
}


function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`Cannot read ${file}: ${error.message}`);
  }
}

const isLocalized = (value) =>
  value && typeof value === 'object' && !Array.isArray(value) && Object.values(value).every((inner) => typeof inner === 'string');

/** Copies the demo without secrets; an object whose HTML held images is marked `remoteImages`. */
function strip(value, where = 'demo', found = { images: 0 }) {
  if (typeof value === 'string') return cleanHtml(value, where, found);
  if (Array.isArray(value)) return value.map((inner, index) => strip(inner, `${where}[${index}]`, found));
  if (!value || typeof value !== 'object') return value;
  // A localized text's images count for the object that holds it.
  const own = isLocalized(value) ? found : { images: 0 };
  const copy = Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !DROPPED_KEYS.has(key))
      .map(([key, inner]) => [key, strip(inner, `${where}.${key}`, own)])
  );
  return own !== found && own.images ? { ...copy, remoteImages: true } : copy;
}

function qrModules(content) {
  const qr = qrcode(0, 'M');
  qr.addData(content);
  qr.make();
  const size = qr.getModuleCount();
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => (qr.isDark(row, col) ? '1' : '0')).join('')
  );
}

function sourceFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === 'data' ? [] : sourceFiles(full);
    return /\.tsx?$/.test(entry.name) ? [full] : [];
  });
}

/** Every key the phone passes to t() or k(). */
function usedKeys() {
  const pattern = /\b[tk]\(\s*'([a-z0-9_]+)'/g;
  const keys = new Set();
  for (const file of sourceFiles(PHONE_SRC)) {
    for (const match of readFileSync(file, 'utf8').matchAll(pattern)) keys.add(match[1]);
  }
  return [...keys].sort();
}

function pickStrings(translations, keys, label) {
  const table = { ...translations.shared, ...translations.apple };
  const missing = keys.filter((key) => typeof table[key] !== 'string');
  if (missing.length) fail(`${label} has no ${missing.join(', ')}`);
  return Object.fromEntries(keys.map((key) => [key, table[key]]));
}

const repo = process.argv[2];
if (!repo) fail('Usage: npm run sync-demo -- <path to the tigerduck-app repository>');
const demo = readJson(path.join(repo, 'swift/TigerDuck/Account/Demo/demo.json'));
const zh = readJson(path.join(repo, 'app-translation/source/zh-Hant.json'));
const en = readJson(path.join(repo, 'app-translation/source/en.json'));

let data;
try {
  data = strip(demo);
} catch (error) {
  fail(`demo.json: ${error.message}; allow it in scripts/demo-html.mjs once reviewed`);
}
// The phone moves every date from this day to the visitor's, as the app's DemoFixture.shifted does.
if (!/^\d{4}-\d{2}-\d{2}$/.test(data.anchor ?? '')) fail('demo.json has no top-level anchor day (yyyy-MM-dd)');
if (data.libraryQr?.content) data.libraryQr.modules = qrModules(data.libraryQr.content);

const keys = usedKeys();
const strings = { zh: pickStrings(zh, keys, 'zh-Hant.json'), en: pickStrings(en, keys, 'en.json') };

writeFileSync(path.join(OUT_DIR, 'demo.json'), `${JSON.stringify(data, null, 1)}\n`);
writeFileSync(path.join(OUT_DIR, 'strings.json'), `${JSON.stringify(strings, null, 1)}\n`);
console.log(`demo.json: anchored on ${data.anchor}; strings.json: ${keys.length} keys`);
