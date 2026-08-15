import { readFileSync, statSync } from 'node:fs';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const checks = [];

function read(relativePath) {
    return readFileSync(resolve(root, relativePath), 'utf8');
}

function assert(condition, message) {
    if (condition) {
        checks.push(message);
    } else {
        errors.push(message);
    }
}

function exists(relativePath) {
    try {
        return statSync(resolve(root, relativePath)).isFile();
    } catch {
        return false;
    }
}

function localPath(reference) {
    const cleanReference = reference.split(/[?#]/, 1)[0];
    const path = decodeURI(cleanReference.replace(/^\.\//, '').replace(/^\//, ''));
    return path || 'index.html';
}

const requiredFiles = [
    'index.html',
    '404.html',
    '_headers',
    'robots.txt',
    'sitemap.xml',
    'vercel.json',
    'css/scroll.css',
    'css/index.css',
    'js/webgl-effect.js',
    'js/page-interactions.js',
    'js/vercel-observability.js',
    'js/vendor/three-r128.min.js',
    'src/img/optimized/collage-768.avif',
    'src/img/optimized/collage-1440.avif',
    'src/img/optimized/collage-2560.avif',
    'src/img/optimized/vune-social-1200x630.jpg'
];

requiredFiles.forEach((file) => assert(exists(file), `Existe ${file}`));

const htmlFiles = ['index.html', '404.html'];
const htmlByFile = Object.fromEntries(htmlFiles.map((file) => [file, read(file)]));
const indexHtml = htmlByFile['index.html'];

for (const [file, html] of Object.entries(htmlByFile)) {
    const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
    const localAnchors = [...html.matchAll(/\bhref="#([^"]+)"/g)].map((match) => match[1]);
    localAnchors.forEach((anchor) => assert(ids.has(anchor), `${file}: existe el ancla #${anchor}`));

    const references = [...html.matchAll(/\b(?:src|href)="([^"]+)"/g)].map((match) => match[1]);
    references
        .filter((reference) => !/^(?:#|https?:|mailto:|tel:|data:)/.test(reference))
        .forEach((reference) => {
            const path = localPath(reference);
            assert(exists(path), `${file}: existe ${path}`);
        });

    const blankLinks = [...html.matchAll(/<a\b[^>]*\btarget="_blank"[^>]*>/g)];
    blankLinks.forEach(([tag]) => {
        const rel = tag.match(/\brel="([^"]+)"/)?.[1]?.split(/\s+/) ?? [];
        assert(rel.includes('noopener') && rel.includes('noreferrer'), `${file}: enlace externo protegido`);
    });
}

for (const cssFile of ['css/scroll.css', 'css/index.css']) {
    const css = read(cssFile);
    const references = [...css.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g)].map((match) => match[1]);
    references
        .filter((reference) => !/^(?:data:|https?:|#)/.test(reference))
        .forEach((reference) => {
            const path = resolve(dirname(resolve(root, cssFile)), decodeURI(reference));
            let valid = false;
            try {
                valid = statSync(path).isFile();
            } catch {
                valid = false;
            }
            assert(valid, `${cssFile}: existe ${reference}`);
        });
}

for (const script of [
    'js/webgl-effect.js',
    'js/page-interactions.js',
    'js/vercel-observability.js',
    'js/vendor/three-r128.min.js',
    'scripts/check-production.mjs'
]) {
    const result = spawnSync(process.execPath, ['--check', resolve(root, script)], { encoding: 'utf8' });
    assert(result.status === 0, `${script}: sintaxis válida${result.stderr ? ` (${result.stderr.trim()})` : ''}`);
}

const jsonLdBlocks = [...indexHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
assert(jsonLdBlocks.length > 0, 'Existe JSON-LD');
jsonLdBlocks.forEach((match, index) => {
    try {
        const data = JSON.parse(match[1]);
        assert(data['@context'] === 'https://schema.org', `JSON-LD ${index + 1}: contexto válido`);
        assert(data.url === 'https://www.estudiovune.com/', `JSON-LD ${index + 1}: URL canónica consistente`);
        assert(data.email === 'hola@estudiovune.com', `JSON-LD ${index + 1}: correo institucional confirmado`);
        assert(data.telephone === '+54 299 421-5193', `JSON-LD ${index + 1}: teléfono confirmado`);
        assert(data.address?.addressLocality === 'Cipolletti', `JSON-LD ${index + 1}: localidad confirmada`);
        assert(data.address?.addressRegion === 'Río Negro', `JSON-LD ${index + 1}: provincia confirmada`);
        assert(data.contactPoint?.url === 'https://wa.me/542994215193', `JSON-LD ${index + 1}: WhatsApp confirmado`);
    } catch (error) {
        errors.push(`JSON-LD ${index + 1}: JSON inválido (${error.message})`);
    }
});

assert(indexHtml.includes('<link rel="canonical" href="https://www.estudiovune.com/">'), 'Canonical correcta');
assert(indexHtml.includes('<meta property="og:url" content="https://www.estudiovune.com/">'), 'og:url correcta');
assert(indexHtml.includes('href="mailto:hola@estudiovune.com"'), 'Enlace de correo institucional correcto');
assert(indexHtml.includes('>+54 299 421 5193</a>'), 'Teléfono visible confirmado');
assert(/<meta property="og:image" content="https:\/\//.test(indexHtml), 'og:image absoluta');
assert(/<meta name="twitter:image" content="https:\/\//.test(indexHtml), 'twitter:image absoluta');
assert(!indexHtml.includes('cdnjs.cloudflare.com/ajax/libs/three.js'), 'Three.js no depende de CDN');
assert(!exists('css/style.css'), 'La hoja histórica fue eliminada');

const robots = read('robots.txt');
const headers = read('_headers');
const sitemap = read('sitemap.xml');
const vercelConfig = JSON.parse(read('vercel.json'));
assert(robots.includes('Sitemap: https://www.estudiovune.com/sitemap.xml'), 'robots.txt declara el sitemap');
assert(sitemap.includes('<loc>https://www.estudiovune.com/</loc>'), 'Sitemap contiene la URL canónica');
assert(vercelConfig.$schema === 'https://openapi.vercel.sh/vercel.json', 'vercel.json declara el schema oficial');
assert(vercelConfig.redirects?.some((rule) => rule.source === '/index.html' && rule.destination === '/'), 'Vercel redirige /index.html a /');

const vercelHeadersText = JSON.stringify(vercelConfig.headers);
assert(vercelHeadersText.includes('Content-Security-Policy'), 'Vercel configura CSP');
assert(vercelHeadersText.includes('X-Content-Type-Options'), 'Vercel configura headers de seguridad');
assert(vercelHeadersText.includes('X-Robots-Tag'), 'Vercel traduce la política noindex');
assert(vercelHeadersText.includes('max-age=31536000, immutable'), 'Vercel aplica caché larga al vendor versionado');
assert(vercelHeadersText.includes('max-age=2592000'), 'Vercel aplica caché a imágenes optimizadas');

assert(!robots.includes('Disallow:'), 'robots.txt permite leer los headers noindex');

[
    '/404.html',
    '/docs/*',
    '/scripts/*',
    '/.github/*',
    '/.vscode/*',
    '/.gitattributes',
    '/.gitignore',
    '/src/img/bg/*',
    '/AGENTS.md',
    '/CLAUDE.md',
    '/ESTRUCTURA-land.md',
    '/README.md',
    '/package.json',
    '/_headers'
].forEach((path) => {
    assert(headers.includes(`${path}\n  X-Robots-Tag: noindex`), `_headers aplica noindex a ${path}`);
});

const sizeBudgets = {
    'src/img/optimized/collage-768.avif': 100_000,
    'src/img/optimized/collage-1440.avif': 400_000,
    'src/img/optimized/collage-2560.avif': 600_000,
    'src/img/optimized/vune-social-1200x630.jpg': 300_000
};

for (const [file, limit] of Object.entries(sizeBudgets)) {
    const size = statSync(resolve(root, file)).size;
    assert(size <= limit, `${file}: ${Math.ceil(size / 1024)} KiB dentro del presupuesto`);
}

const initialAssets = [
    'index.html',
    'css/scroll.css',
    'css/index.css',
    'js/webgl-effect.js',
    'js/page-interactions.js',
    'js/vercel-observability.js',
    'js/vendor/three-r128.min.js',
    'src/img/optimized/collage-1440.avif'
];
const initialBytes = initialAssets.reduce((total, file) => total + statSync(resolve(root, file)).size, 0);
assert(initialBytes <= 1_000_000, `Carga inicial propia estimada: ${Math.ceil(initialBytes / 1024)} KiB`);

const summary = `${checks.length} comprobaciones correctas, ${errors.length} errores.`;

if (errors.length > 0) {
    console.error(`\n${summary}`);
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
}

console.log(summary);
