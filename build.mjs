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

function render(template, label) {
  const out = template
    .replace(/\{\{#each ([\w.]+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (_, listPath, body) => renderEach(listPath, body))
    .replace(/\{\{t:([\w.]+)\}\}/g, (_, key) => renderGroup(key));
  const unresolved = out.match(/\{\{[^}]*\}\}/g);
  if (unresolved) throw new Error(`build: ${label}: unresolved tokens: ${[...new Set(unresolved)].join(', ')}`);
  return out;
}

const html = render(read('src/index.html'), 'src/index.html');

// Area landing pages: one Thai page per service area in content/areas.json,
// rendered from src/area.html to dist/area/<slug>/index.html. Each targets a
// local search phrase ("น้ำดื่ม<area>") with its own title, copy and FAQ.
const areas = data.areas?.items || [];
const areaURL = (a) => `${SITE_URL}/area/${a.slug}/`;
function renderAreaPage(a, i) {
  const label = `areas.items[${i}]`;
  for (const f of ['slug', 'title', 'description', 'h1', 'lead']) {
    if (!a[f]) throw new Error(`build: ${label} is missing "${f}"`);
  }
  if (!/^[a-z0-9-]+$/.test(a.slug)) throw new Error(`build: ${label}.slug must be lowercase a-z, 0-9 or "-"`);
  const faq = a.faq || [];
  const jsonld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${areaURL(a)}#webpage`,
        url: areaURL(a),
        name: a.title,
        description: a.description,
        inLanguage: 'th',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#business` },
      },
      {
        '@type': 'Service',
        name: a.h1,
        serviceType: 'จัดส่งน้ำดื่ม',
        provider: { '@id': `${SITE_URL}/#business` },
        areaServed: [a.place.th, ...(a.nearby || [])].map((name) => ({ '@type': 'Place', name })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: a.place.th, item: areaURL(a) },
        ],
      },
      ...(faq.length
        ? [{
            '@type': 'FAQPage',
            mainEntity: faq.map((x) => ({
              '@type': 'Question',
              name: x.q,
              acceptedAnswer: { '@type': 'Answer', text: x.a },
            })),
          }]
        : []),
    ],
  };
  const fields = {
    ...a,
    place: a.place.th,
    url: areaURL(a),
    paragraphs: (a.paragraphs || []).map((p) => `<p>${escapeHTML(p)}</p>`).join('\n        '),
    nearby: (a.nearby || []).map((n) => `<li>${escapeHTML(n)}</li>`).join(''),
    faq: faq
      .map((x) => `<details class="area-faq-item"><summary>${escapeHTML(x.q)}</summary><p>${escapeHTML(x.a)}</p></details>`)
      .join(''),
    others: areas
      .filter((o) => o !== a)
      .map((o) => `<li><a href="/area/${o.slug}/">${escapeHTML(o.name.th)}</a></li>`)
      .join(''),
  };
  const raw = new Set(['paragraphs', 'nearby', 'faq', 'others']);
  // Substitute {{a.*}} first so the shared renderer's unresolved-token check
  // still catches typos. JSON-LD goes in as-is ("<" escaped so it can't close
  // the script tag).
  const page = read('src/area.html')
    .replace('{{a.jsonld}}', () => JSON.stringify(jsonld, null, 2).replace(/</g, '\\u003c'))
    .replace(/\{\{a\.([\w-]+)\}\}/g, (_, f) => {
      if (fields[f] === undefined) throw new Error(`build: ${label} is missing "${f}"`);
      return raw.has(f) ? fields[f] : escapeHTML(fields[f]);
    });
  return render(page, `area/${a.slug}`);
}

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
fs.writeFileSync(path.join(DIST, 'index.html'), html);
areas.forEach((a, i) => {
  const dir = path.join(DIST, 'area', a.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), renderAreaPage(a, i));
});
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

// sitemap.xml — the home page plus every area landing page. lastmod tracks the
// build date so re-deploys tell search engines the pages were refreshed.
const lastmod = new Date().toISOString().slice(0, 10);
const sitemapEntry = (loc, priority) =>
  `  <url>\n` +
  `    <loc>${loc}</loc>\n` +
  `    <lastmod>${lastmod}</lastmod>\n` +
  `    <changefreq>monthly</changefreq>\n` +
  `    <priority>${priority}</priority>\n` +
  `  </url>\n`;
fs.writeFileSync(
  path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    sitemapEntry(`${SITE_URL}/`, '1.0') +
    areas.map((a) => sitemapEntry(areaURL(a), '0.8')).join('') +
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

console.log(`built dist/index.html (${Object.keys(content).length} strings, ${html.length} bytes) + ${areas.length} area pages`);
