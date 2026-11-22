#!/usr/bin/env node
// Copies the app's demo account data and the UI labels the phone uses into the site.
// Usage: npm run sync-demo -- <path to the tigerduck-app repository> [--today YYYY-MM-DD]
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import qrcode from 'qrcode-generator';

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PHONE_SRC = path.join(SITE, 'src/components/phone');
const OUT_DIR = path.join(PHONE_SRC, 'data');

// Sign-in secrets and file bodies are not needed to draw the screens.
const DROPPED_KEYS = new Set(['school-password', 'library-password', 'password', 'base64']);
// Keys whose dates lie ahead of the demo's "today"; the rest record something that already happened.
const FUTURE_KEYS = new Set(['due', 'calendar', 'start', 'end', 'cutoff']);

function fail(message) {
  console.error(message);
  process.exit(1);
}

function parseArgs(argv) {
  const args = { repo: null, today: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--today') args.today = argv[++i];
    else args.repo = argv[i];
  }
  if (!args.repo) fail('Usage: npm run sync-demo -- <path to the tigerduck-app repository> [--today YYYY-MM-DD]');
  if (args.today && !/^\d{4}-\d{2}-\d{2}$/.test(args.today)) fail('--today takes YYYY-MM-DD');
  return args;
}

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`Cannot read ${file}: ${error.message}`);
  }
}

/** The site renders demo HTML as is, so nothing in it may run. */
function inert(html) {
  return html
    .replace(/<(script|style|iframe|object|embed)\b[\s\S]*?<\/\1\s*>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '$1="#"');
}

function strip(value) {
  if (Array.isArray(value)) return value.map(strip);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !DROPPED_KEYS.has(key))
        .map(([key, inner]) => [key, strip(inner)])
    );
  }
  return typeof value === 'string' && value.includes('<') ? inert(value) : value;
}

const DATE_PREFIX = /^(\d{4}-\d{2}-\d{2})/;

/** The latest day on which something in the data already happened. */
function latestPastDay(value, key = '') {
  if (FUTURE_KEYS.has(key)) return null;
  if (typeof value === 'string') return DATE_PREFIX.exec(value)?.[1] ?? null;
  const children = Array.isArray(value)
    ? value.map((inner) => latestPastDay(inner))
    : value && typeof value === 'object'
      ? Object.entries(value).map(([k, inner]) => latestPastDay(inner, k))
      : [];
  return children.filter(Boolean).sort().at(-1) ?? null;
}

function nextDay(day) {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
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

const { repo, today } = parseArgs(process.argv.slice(2));
const demo = readJson(path.join(repo, 'swift/TigerDuck/Account/Demo/demo.json'));
const zh = readJson(path.join(repo, 'app-translation/source/zh-Hant.json'));
const en = readJson(path.join(repo, 'app-translation/source/en.json'));

const data = strip(demo);
const latest = latestPastDay(data);
const anchor = today ?? (latest ? nextDay(latest) : null);
if (!anchor) fail('The demo data has no dates to anchor on; pass --today YYYY-MM-DD');
if (data.libraryQr?.content) data.libraryQr.modules = qrModules(data.libraryQr.content);

const keys = usedKeys();
const strings = { zh: pickStrings(zh, keys, 'zh-Hant.json'), en: pickStrings(en, keys, 'en.json') };

writeFileSync(path.join(OUT_DIR, 'demo.json'), `${JSON.stringify({ anchor, ...data }, null, 1)}\n`);
writeFileSync(path.join(OUT_DIR, 'strings.json'), `${JSON.stringify(strings, null, 1)}\n`);
console.log(`demo.json: anchored on ${anchor}; strings.json: ${keys.length} keys`);
