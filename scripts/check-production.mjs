const origin = (process.env.SITE_URL || 'https://www.estudiovune.com').replace(/\/$/, '');
const failures = [];
let successes = 0;

function expect(condition, message) {
    if (condition) {
        successes += 1;
    } else {
        failures.push(message);
    }
}

async function request(path, expectedStatus = 200) {
    const response = await fetch(`${origin}${path}`, {
        redirect: 'follow',
        headers: { 'accept-encoding': 'br, gzip' },
        signal: AbortSignal.timeout(15_000)
    });
    expect(response.status === expectedStatus, `${path}: HTTP ${response.status}; esperado ${expectedStatus}`);
    return response;
}

function expectHeader(response, path, name, pattern) {
    const value = response.headers.get(name) || '';
    expect(pattern.test(value), `${path}: ${name} ausente o inesperado (${value || 'vacío'})`);
}

try {
    const home = await request('/');
    const homeText = await home.text();
    expect(home.url === 'https://www.estudiovune.com/', `La portada termina en una URL no canónica: ${home.url}`);
    expect(homeText.includes('hola@estudiovune.com'), 'La portada no contiene el correo confirmado');
    expect(homeText.includes('https://www.estudiovune.com/src/images/social/og.png'), 'La portada no contiene la imagen social vigente');
    expect(homeText.includes('./js/google-tag-manager.js'), 'La portada no carga Google Tag Manager desde el archivo local');
    expect(homeText.includes('./js/vendor/three-r128.min.js'), 'La portada no carga la copia local de Three.js');
    expect(!homeText.includes('cdnjs.cloudflare.com'), 'La portada publicada todavía depende de cdnjs');
    expectHeader(home, '/', 'content-type', /^text\/html/i);
    expectHeader(home, '/', 'x-content-type-options', /^nosniff$/i);
    expectHeader(home, '/', 'content-security-policy', /default-src 'self'/i);
    expectHeader(home, '/', 'content-security-policy', /script-src[^;]*https:\/\/www\.googletagmanager\.com/i);
    expectHeader(home, '/', 'cache-control', /must-revalidate/i);

    const explicitIndex = await request('/index.html');
    expect(explicitIndex.url === 'https://www.estudiovune.com/', '/index.html no redirige a la portada canónica');

    const css = await request('/css/index.css');
    expectHeader(css, 'CSS', 'content-type', /^text\/css/i);
    expectHeader(css, 'CSS', 'cache-control', /max-age=0.*must-revalidate/i);

    const javascript = await request('/js/page-interactions.js');
    expectHeader(javascript, 'JavaScript', 'content-type', /javascript/i);
    expectHeader(javascript, 'JavaScript', 'cache-control', /max-age=0.*must-revalidate/i);

    const tagManager = await request('/js/google-tag-manager.js');
    const tagManagerText = await tagManager.text();
    expectHeader(tagManager, 'Google Tag Manager', 'content-type', /javascript/i);
    expectHeader(tagManager, 'Google Tag Manager', 'cache-control', /max-age=0.*must-revalidate/i);
    expect(tagManagerText.includes('GTM-MQQSHQZM'), 'El cargador publicado no usa el contenedor de Google Tag Manager confirmado');

    const three = await request('/js/vendor/three-r128.min.js');
    expectHeader(three, 'Three.js', 'content-type', /javascript/i);
    expectHeader(three, 'Three.js', 'cache-control', /max-age=31536000.*immutable/i);

    const social = await request('/src/images/social/og.png');
    expectHeader(social, 'imagen social', 'content-type', /^image\/png/i);
    expectHeader(social, 'imagen social', 'cache-control', /max-age=604800/i);

    const favicon = await request('/favicon.ico');
    expectHeader(favicon, 'favicon', 'content-type', /^image\/x-icon|image\/vnd\.microsoft\.icon/i);

    const appleIcon = await request('/apple-touch-icon.png');
    expectHeader(appleIcon, 'Apple Touch Icon', 'content-type', /^image\/png/i);

    const robots = await request('/robots.txt');
    const robotsText = await robots.text();
    expect(robotsText.includes('https://www.estudiovune.com/sitemap.xml'), 'robots.txt no declara el sitemap canónico');

    const sitemap = await request('/sitemap.xml');
    const sitemapText = await sitemap.text();
    expectHeader(sitemap, 'sitemap', 'content-type', /xml/i);
    expect(sitemapText.includes('<loc>https://www.estudiovune.com/</loc>'), 'sitemap.xml no contiene la URL canónica');

    const internalDoc = await request('/docs/CHANGELOG.md');
    expectHeader(internalDoc, 'documentación', 'x-robots-tag', /noindex/i);

    const missing = await request('/ruta-inexistente-de-monitoreo', 404);
    const missingText = await missing.text();
    expect(missingText.includes('Esta página no existe'), 'La respuesta 404 no usa la página diseñada');
} catch (error) {
    failures.push(`Fallo de red: ${error.message}`);
}

console.log(`${successes} controles de producción correctos, ${failures.length} errores.`);
for (const failure of failures) console.error(`- ${failure}`);
if (failures.length > 0) process.exit(1);
