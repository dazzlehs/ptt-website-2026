#!/usr/bin/env node
// Renders the site from src/index.html (layout) + content/*.json (words) into dist/.
// The renderer itself has no dependencies; npm is only used to pin the CMS bundle
// that gets copied into dist/admin and the wrangler version Cloudflare deploys with.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const LANGS = ['th', 'en', 'zh', 'ja'];
const DIST = path.join(ROOT, 'dist');
// Canonical production origin. Used for robots.txt, sitemap.xml and the
// canonical/og URLs in the page. No trailing slash. Change here if the domain moves.
const SITE_URL = 'https://pettubtim.com';

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const readJSON = (p) => JSON.parse(read(p));

// content/<section>.json holds that section's editable data. Two-digit keys are
// single translatable strings ({ th, en, zh, ja }); any other key is a list the
// template repeats over with {{#each}}.
const data = {};
const content = {};
for (const f of fs.readdirSync(path.join(ROOT, 'content')).filter((f) => f.endsWith('.json'))) {
  const section = f.replace(/\.json$/, '');
  const obj = readJSON(`content/${f}`);
  data[section] = obj;
  for (const [slot, value] of Object.entries(obj)) {
    if (/^\d\d$/.test(slot)) content[`${section}.${slot}`] = value;
  }
}

const escapeHTML = (v) =>
  String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// src/lang-attrs.json carries the presentational leftovers the words shouldn't
// know about: per-language attributes, non-default language order, and the exact
// whitespace that separated the original spans (it renders as a space, so it matters).
const meta = readJSON('src/lang-attrs.json');

function renderLangSpans(value, m = {}, label = '') {
  const order = m.order || LANGS;
  const seps = m.seps || [];
  return order
    .map((lang, i) => {
      if (value[lang] === undefined) throw new Error(`build: ${label} is missing "${lang}"`);
      const attrs = m.attrs?.[lang] ? ` ${m.attrs[lang]}` : '';
      return (i ? seps[i - 1] ?? '' : '') + `<span data-l="${lang}"${attrs}>${value[lang]}</span>`;
    })
    .join('');
}

function renderGroup(key) {
  const value = content[key];
  if (!value) throw new Error(`build: no content for {{t:${key}}}`);
  return renderLangSpans(value, meta[key] || {}, key);
}

// {{#each products.sizes}} ... {{/each}} repeats its body once per list item.
// Inside the body: {{it.field}} is an escaped plain value, {{t.field}} is a
// translatable { th, en, zh, ja } object, and {{@n}} is the 1-based position
// zero-padded to two digits.
function renderEach(listPath, body) {
  const [section, key] = listPath.split('.');
  const items = data[section]?.[key];
  if (!Array.isArray(items)) throw new Error(`build: {{#each ${listPath}}} is not a list`);
  return items
    .map((item, i) =>
      body
        .replace(/\{\{@n\}\}/g, String(i + 1).padStart(2, '0'))
        .replace(/\{\{t\.([\w-]+)\}\}/g, (_, f) => {
          if (!item[f]) throw new Error(`build: ${listPath}[${i}] is missing "${f}"`);
          return renderLangSpans(item[f], {}, `${listPath}[${i}].${f}`);
        })
        .replace(/\{\{it\.([\w-]+)\}\}/g, (_, f) => {
          if (item[f] === undefined) throw new Error(`build: ${listPath}[${i}] is missing "${f}"`);
          return escapeHTML(item[f]);
        })
    )
    .join('');
}

let html = read('src/index.html')
  .replace(/\{\{#each ([\w.]+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (_, listPath, body) => renderEach(listPath, body))
  .replace(/\{\{t:([\w.]+)\}\}/g, (_, key) => renderGroup(key));

const unresolved = html.match(/\{\{[^}]*\}\}/g);
if (unresolved) throw new Error(`build: unresolved tokens: ${[...new Set(unresolved)].join(', ')}`);

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
fs.writeFileSync(path.join(DIST, 'index.html'), html);
for (const dir of ['assets', 'css', 'js', 'admin']) {
  if (fs.existsSync(path.join(ROOT, dir))) {
    fs.cpSync(path.join(ROOT, dir), path.join(DIST, dir), { recursive: true });
  }
}
// robots.txt — let every crawler in and point them at the sitemap.
fs.writeFileSync(
  path.join(DIST, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
);

// sitemap.xml — one canonical URL for this single-page site. lastmod tracks the
// build date so re-deploys tell search engines the page was refreshed.
const lastmod = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `  <url>\n` +
    `    <loc>${SITE_URL}/</loc>\n` +
    `    <lastmod>${lastmod}</lastmod>\n` +
    `    <changefreq>monthly</changefreq>\n` +
    `    <priority>1.0</priority>\n` +
    `  </url>\n` +
    `</urlset>\n`
);

// Serve the CMS from our own origin instead of a CDN. Pinned in package.json.
const cms = path.join(ROOT, 'node_modules/@sveltia/cms/dist/sveltia-cms.js');
if (fs.existsSync(cms)) {
  fs.mkdirSync(path.join(DIST, 'admin'), { recursive: true });
  fs.copyFileSync(cms, path.join(DIST, 'admin/sveltia-cms.js'));
} else {
  console.warn('build: @sveltia/cms not installed - /admin will not load. Run `npm install`.');
}

console.log(`built dist/index.html (${Object.keys(content).length} strings, ${html.length} bytes)`);
