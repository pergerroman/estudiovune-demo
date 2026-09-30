import { access, readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const failures = [];
let successes = 0;

function expect(condition, message) {
    if (condition) {
        successes += 1;
    } else {
        failures.push(message);
    }
}

async function exists(relativePath) {
    try {
        await access(path.join(root, relativePath));
        return true;
    } catch {
        return false;
    }
}

async function walk(directory, predicate) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        if (entry.name === '.git' || entry.name === 'node_modules') continue;
        const absolutePath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            files.push(...await walk(absolutePath, predicate));
        } else if (predicate(absolutePath)) {
            files.push(absolutePath);
        }
    }

    return files;
}

function localTarget(sourceFile, reference) {
    const decoded = decodeURIComponent(reference.split(/[?#]/)[0].replaceAll('&amp;', '&'));
    if (!decoded || decoded === '/') return path.join(root, 'index.html');
    if (decoded.startsWith('/')) return path.join(root, decoded.slice(1));
    return path.resolve(path.dirname(sourceFile), decoded);
}

function isLocalReference(reference) {
    return !/^(?:[a-z]+:|#|\/\/)/i.test(reference);
}

function pngDimensions(buffer) {
    const signature = '89504e470d0a1a0a';
    if (buffer.subarray(0, 8).toString('hex') !== signature) return null;
    return {
        width: buffer.readUInt32BE(16),
        height: buffer.readUInt32BE(20)
    };
}

function icoSizes(buffer) {
    if (buffer.length < 6 || buffer.readUInt16LE(0) !== 0 || buffer.readUInt16LE(2) !== 1) {
        return [];
    }

    const count = buffer.readUInt16LE(4);
    const sizes = [];

    for (let index = 0; index < count; index += 1) {
        const offset = 6 + (index * 16);
        if (offset + 16 > buffer.length) break;
        const width = buffer[offset] || 256;
        const height = buffer[offset + 1] || 256;
        sizes.push(`${width}x${height}`);
    }

    return sizes;
}

const requiredFiles = [
    'index.html',
    '404.html',
    'robots.txt',
    'sitemap.xml',
    'vercel.json',
    '_headers',
    'package.json',
    'favicon.ico',
    'apple-touch-icon.png',
    'src/logos/favicon.svg',
    'src/logos/vune-logo.svg',
    'src/images/backgrounds/collage.jpg',
    'src/images/backgrounds/essay.jpg',
    'src/images/social/og.png',
    'src/graphics/hero/orange-blur.svg',
    'src/icons/instagram.svg',
    'css/scroll.css',
    'css/index.css',
    'css/404.css',
    'js/google-tag-manager.js',
    'js/webgl-effect.js',
    'js/page-interactions.js',
    'js/vendor/three-r128.min.js'
];

for (const file of requiredFiles) {
    expect(await exists(file), `Falta el archivo requerido: ${file}`);
}

const obsoleteFiles = [
    'css/style.css',
    'src/icons/linkedin.svg',
    'src/img/bg/_DSC5885 1.jpg'
];

for (const file of obsoleteFiles) {
    expect(!await exists(file), `El proyecto conserva un archivo obsoleto: ${file}`);
}

const indexPath = path.join(root, 'index.html');
const indexHtml = await readFile(indexPath, 'utf8');
const canonical = 'https://www.estudiovune.com/';
const socialImage = `${canonical}src/images/social/og.png`;

const requiredMarkup = [
    '<!DOCTYPE html>',
    '<html lang="es-AR">',
    `<link rel="canonical" href="${canonical}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:image" content="${socialImage}">`,
    '<meta property="og:image:type" content="image/png">',
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:image" content="${socialImage}">`,
    '<link rel="icon" href="./favicon.ico" sizes="any">',
    '<link rel="apple-touch-icon" sizes="180x180" href="./apple-touch-icon.png">',
    '<script src="./js/google-tag-manager.js"></script>',
    'href="https://www.instagram.com/estudiovune/"',
    'hola@estudiovune.com'
];

for (const markup of requiredMarkup) {
    expect(indexHtml.includes(markup), `Falta contenido requerido en index.html: ${markup}`);
}

expect(!indexHtml.includes('hola@vune.com'), 'index.html conserva el correo anterior');
expect(indexHtml.indexOf('./js/google-tag-manager.js') < indexHtml.indexOf('</head>'), 'Google Tag Manager debe cargarse desde el head');
expect(indexHtml.includes('<script src="./js/vendor/three-r128.min.js"></script>'), 'index.html no carga Three.js desde la copia local');
expect(!indexHtml.includes('cdnjs.cloudflare.com'), 'index.html todavía depende de cdnjs');
expect(!indexHtml.includes('&family='), 'La URL de Google Fonts contiene un ampersand sin escapar');
expect(!indexHtml.includes('&display='), 'La URL de Google Fonts contiene un ampersand sin escapar');
expect(!indexHtml.includes('css/style.css'), 'index.html enlaza la hoja histórica css/style.css');
expect(!/<style\b/i.test(indexHtml), 'index.html contiene CSS inline');

const footerContactStart = indexHtml.indexOf('<address class="foot__contact">');
const footerContactEnd = indexHtml.indexOf('</address>', footerContactStart);
const footerContact = indexHtml.slice(footerContactStart, footerContactEnd);
const footerContactOrder = [
    'instagram.com/estudiovune/',
    'wa.me/542994215193',
    'mailto:hola@estudiovune.com',
    'Cipolletti, Río Negro',
    '<span>Estudio creativo de la Patagonia argentina</span>'
];
expect(footerContactStart >= 0 && footerContactEnd > footerContactStart, 'No se encontró el bloque de contacto del footer');
expect(
    footerContactOrder.every((item, index) => {
        const position = footerContact.indexOf(item);
        const previousPosition = index === 0 ? -1 : footerContact.indexOf(footerContactOrder[index - 1]);
        return position >= 0 && position > previousPosition;
    }),
    'El contacto del footer debe respetar el orden Instagram, WhatsApp, correo, Cipolletti y la leyenda patagónica'
);

const inlineScripts = [...indexHtml.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(([, , body]) => body.trim())
    .filter(([, attributes]) => !/type=["']application\/ld\+json["']/i.test(attributes));
expect(inlineScripts.length === 0, 'index.html contiene JavaScript propio inline');

const tagManagerLoader = await readFile(path.join(root, 'js/google-tag-manager.js'), 'utf8');
expect(tagManagerLoader.includes("window.dataLayer = window.dataLayer || []"), 'El cargador de Google Tag Manager no inicializa dataLayer');
expect(tagManagerLoader.includes("event: 'gtm.js'"), 'El cargador de Google Tag Manager no registra el evento inicial');
expect(tagManagerLoader.includes('https://www.googletagmanager.com/gtm.js?id=GTM-MQQSHQZM'), 'El cargador de Google Tag Manager no usa el contenedor confirmado');
expect(tagManagerLoader.includes('tagManager.async = true'), 'Google Tag Manager no se carga de forma asíncrona');

const jsonLdMatch = indexHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
expect(Boolean(jsonLdMatch), 'Faltan los datos estructurados JSON-LD');
if (jsonLdMatch) {
    try {
        const jsonLd = JSON.parse(jsonLdMatch[1]);
        expect(jsonLd['@type'] === 'ProfessionalService', 'El JSON-LD no describe un ProfessionalService');
        expect(jsonLd.email === 'hola@estudiovune.com', 'El correo del JSON-LD no es el confirmado');
    } catch (error) {
        failures.push(`JSON-LD inválido: ${error.message}`);
    }
}

const ids = [...indexHtml.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
expect(duplicateIds.length === 0, `IDs duplicados: ${[...new Set(duplicateIds)].join(', ')}`);

const anchors = [...indexHtml.matchAll(/\bhref="#([^"]+)"/g)].map((match) => match[1]);
const missingAnchors = anchors.filter((anchor) => !ids.includes(anchor));
expect(missingAnchors.length === 0, `Anclas sin destino: ${[...new Set(missingAnchors)].join(', ')}`);

const blankLinks = [...indexHtml.matchAll(/<a\b[^>]*target="_blank"[^>]*>/gi)];
for (const [link] of blankLinks) {
    expect(/rel="[^"]*noopener[^"]*noreferrer[^"]*"/i.test(link), `Enlace externo inseguro: ${link}`);
}

const htmlFiles = ['index.html', '404.html'];
for (const relativeFile of htmlFiles) {
    const absoluteFile = path.join(root, relativeFile);
    const html = await readFile(absoluteFile, 'utf8');
    const references = [...html.matchAll(/\b(?:src|href)="([^"]+)"/g)].map((match) => match[1]);

    for (const reference of references) {
        if (!isLocalReference(reference)) continue;
        expect(await exists(path.relative(root, localTarget(absoluteFile, reference))), `${relativeFile} referencia un archivo inexistente: ${reference}`);
    }
}

const cssFiles = ['css/scroll.css', 'css/index.css', 'css/404.css'];
for (const relativeFile of cssFiles) {
    const absoluteFile = path.join(root, relativeFile);
    const css = await readFile(absoluteFile, 'utf8');
    const references = [...css.matchAll(/url\(['"]?([^)'"?#]+)['"]?\)/g)].map((match) => match[1]);

    for (const reference of references) {
        if (!isLocalReference(reference) || reference.startsWith('data:')) continue;
        expect(await exists(path.relative(root, localTarget(absoluteFile, reference))), `${relativeFile} referencia un archivo inexistente: ${reference}`);
    }
}

const ogPath = path.join(root, 'src/images/social/og.png');
const ogBuffer = await readFile(ogPath);
const ogDimensions = pngDimensions(ogBuffer);
expect(ogDimensions?.width === 1200 && ogDimensions?.height === 630, 'og.png debe medir 1200 × 630 px');
expect((await stat(ogPath)).size <= 1_000_000, 'og.png supera el presupuesto de 1 MB');

const appleBuffer = await readFile(path.join(root, 'apple-touch-icon.png'));
const appleDimensions = pngDimensions(appleBuffer);
expect(appleDimensions?.width === 180 && appleDimensions?.height === 180, 'apple-touch-icon.png debe medir 180 × 180 px');

const faviconBuffer = await readFile(path.join(root, 'favicon.ico'));
const faviconSizes = icoSizes(faviconBuffer);
for (const size of ['16x16', '32x32', '48x48']) {
    expect(faviconSizes.includes(size), `favicon.ico no contiene el tamaño ${size}`);
}

const robots = await readFile(path.join(root, 'robots.txt'), 'utf8');
expect(/User-agent:\s*\*/i.test(robots), 'robots.txt no declara User-agent');
expect(/Allow:\s*\//i.test(robots), 'robots.txt no permite rastrear la portada');
expect(robots.includes(`${canonical}sitemap.xml`), 'robots.txt no declara el sitemap canónico');

const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
expect(sitemap.includes(`<loc>${canonical}</loc>`), 'sitemap.xml no contiene la URL canónica');
expect(sitemap.includes('<lastmod>2026-09-02</lastmod>'), 'sitemap.xml no declara una fecha de actualización');

try {
    const vercel = JSON.parse(await readFile(path.join(root, 'vercel.json'), 'utf8'));
    expect(vercel.redirects?.some((redirect) => redirect.source === '/index.html' && redirect.destination === '/'), 'vercel.json no redirige /index.html a /');
    const globalHeaders = vercel.headers?.find((rule) => rule.source === '/(.*)')?.headers ?? [];
    const headerNames = globalHeaders.map((header) => header.key.toLowerCase());
    for (const header of ['content-security-policy', 'x-content-type-options', 'referrer-policy', 'permissions-policy']) {
        expect(headerNames.includes(header), `vercel.json no configura ${header}`);
    }
    const contentSecurityPolicy = globalHeaders.find((header) => header.key.toLowerCase() === 'content-security-policy')?.value ?? '';
    expect(!contentSecurityPolicy.includes('cdnjs.cloudflare.com'), 'La CSP conserva un permiso innecesario para cdnjs');
    expect(contentSecurityPolicy.includes('script-src\x20\'self\' https://www.googletagmanager.com'), 'La CSP no permite cargar Google Tag Manager');
    expect(contentSecurityPolicy.includes('connect-src\x20\'self\' https://www.googletagmanager.com'), 'La CSP no permite las conexiones de Google Tag Manager');
    expect(!contentSecurityPolicy.includes("'unsafe-inline'"), 'La CSP permite scripts inline inseguros');
    expect(!contentSecurityPolicy.includes("'unsafe-eval'"), 'La CSP permite eval inseguro');
    const threeHeaders = vercel.headers?.find((rule) => rule.source === '/js/vendor/three-r128.min.js')?.headers ?? [];
    expect(threeHeaders.some((header) => header.key === 'Cache-Control' && /immutable/.test(header.value)), 'vercel.json no asigna caché inmutable a Three.js');
} catch (error) {
    failures.push(`vercel.json inválido: ${error.message}`);
}

try {
    const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
    expect(packageJson.scripts?.check === 'node scripts/check-site.mjs', 'package.json no declara npm run check');
    expect(packageJson.scripts?.['check:production'] === 'node scripts/check-production.mjs', 'package.json no declara npm run check:production');
} catch (error) {
    failures.push(`package.json inválido: ${error.message}`);
}

const sourceFiles = await walk(root, (file) => /\.(?:js|mjs)$/.test(file));
for (const file of sourceFiles) {
    const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    expect(result.status === 0, `Sintaxis JavaScript inválida en ${path.relative(root, file)}: ${result.stderr.trim()}`);
}

const markdownFiles = await walk(root, (file) => file.endsWith('.md'));
for (const file of markdownFiles) {
    const markdown = await readFile(file, 'utf8');
    const links = [...markdown.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((match) => match[1]);

    for (const reference of links) {
        if (!isLocalReference(reference)) continue;
        expect(await exists(path.relative(root, localTarget(file, reference))), `${path.relative(root, file)} contiene un enlace roto: ${reference}`);
    }
}

console.log(`${successes} comprobaciones correctas, ${failures.length} errores.`);
for (const failure of failures) console.error(`- ${failure}`);
if (failures.length > 0) process.exit(1);
