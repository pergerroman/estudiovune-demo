const origin = process.env.SITE_URL || 'https://www.estudiovune.com';
const failures = [];
const successes = [];

async function request(path, expectedStatus = 200) {
    const response = await fetch(`${origin}${path}`, {
        redirect: 'follow',
        headers: { 'accept-encoding': 'br, gzip' }
    });
    if (response.status !== expectedStatus) {
        failures.push(`${path}: HTTP ${response.status}; esperado ${expectedStatus}`);
    } else {
        successes.push(`${path}: HTTP ${expectedStatus}`);
    }
    return response;
}

function expectHeader(response, path, name, pattern) {
    const value = response.headers.get(name) || '';
    if (!pattern.test(value)) {
        failures.push(`${path}: ${name} ausente o inesperado (${value || 'vacío'})`);
    } else {
        successes.push(`${path}: ${name} correcto`);
    }
}

try {
    const home = await request('/');
    const homeText = await home.text();
    if (!home.url.startsWith('https://www.estudiovune.com/')) {
        failures.push(`La portada termina en una URL no canónica: ${home.url}`);
    }
    if (!homeText.includes('hola@estudiovune.com')) {
        failures.push('La portada no contiene el correo confirmado');
    }
    expectHeader(home, '/', 'x-content-type-options', /^nosniff$/i);
    expectHeader(home, '/', 'content-security-policy', /default-src 'self'/i);
    expectHeader(home, '/', 'cache-control', /must-revalidate/i);
    expectHeader(home, '/', 'content-encoding', /^(br|gzip)$/i);

    const css = await request('/css/index.css');
    expectHeader(css, 'CSS', 'cache-control', /max-age=86400/i);
    expectHeader(css, 'CSS', 'content-encoding', /^(br|gzip)$/i);

    const three = await request('/js/vendor/three-r128.min.js');
    expectHeader(three, 'Three.js', 'cache-control', /max-age=31536000.*immutable/i);
    expectHeader(three, 'Three.js', 'content-encoding', /^(br|gzip)$/i);

    const responsiveImage = await request('/src/img/optimized/collage-1440.avif');
    expectHeader(responsiveImage, 'imagen AVIF', 'content-type', /^image\/avif/i);
    expectHeader(responsiveImage, 'imagen AVIF', 'cache-control', /max-age=2592000/i);

    const robots = await request('/robots.txt');
    const robotsText = await robots.text();
    if (!robotsText.includes('https://www.estudiovune.com/sitemap.xml')) {
        failures.push('robots.txt no declara el sitemap canónico');
    }

    const sitemap = await request('/sitemap.xml');
    const sitemapText = await sitemap.text();
    if (!sitemapText.includes('<loc>https://www.estudiovune.com/</loc>')) {
        failures.push('sitemap.xml no contiene la URL canónica');
    }

    const social = await request('/src/img/optimized/vune-social-1200x630.jpg');
    expectHeader(social, 'imagen social', 'content-type', /^image\/jpeg/i);

    const internalDoc = await request('/docs/DEPLOYMENT.md');
    expectHeader(internalDoc, 'documentación', 'x-robots-tag', /noindex/i);

    const masterAsset = await request('/src/img/bg/Collage.jpg');
    expectHeader(masterAsset, 'asset maestro', 'x-robots-tag', /noindex/i);

    const missing = await request('/ruta-inexistente-de-monitoreo', 404);
    const missingText = await missing.text();
    if (!missingText.includes('Esta página no existe')) {
        failures.push('La respuesta 404 no usa la página diseñada');
    }
} catch (error) {
    failures.push(`Fallo de red: ${error.message}`);
}

console.log(`${successes.length} controles de producción correctos, ${failures.length} errores.`);
failures.forEach((failure) => console.error(`- ${failure}`));

if (failures.length > 0) process.exit(1);
