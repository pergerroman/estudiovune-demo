# Publicación y operación

Runbook para publicar la landing estática de Vuné en Vercel. BlueHosting
continúa administrando el dominio y las casillas de correo.

## Estado previo

- URL canónica: `https://www.estudiovune.com/`.
- Entrada principal: `index.html`.
- Página de error: `404.html`.
- Sitemap: `sitemap.xml`.
- Validación local: `npm run check`.
- El repositorio no requiere build ni instalación de dependencias.

## DNS, HTTPS y redirecciones

Configurar el dominio para que todas las variantes resuelvan hacia una única
URL pública:

```text
http://estudiovune.com
http://www.estudiovune.com
https://estudiovune.com
                 ↓ 301
https://www.estudiovune.com/
```

Requisitos:

1. Certificado TLS válido para el dominio raíz y `www`.
2. Redirección permanente desde HTTP hacia HTTPS.
3. Redirección permanente desde el dominio raíz hacia `www`.
4. Una sola redirección por solicitud, sin cadenas.
5. Activar HSTS únicamente después de verificar HTTPS y los subdominios que
   deban permanecer disponibles.

En Vercel se deben agregar `estudiovune.com` y `www.estudiovune.com`, dejando
`www` como dominio primario. En BlueHosting se copian exactamente los registros
DNS que muestre Vercel para el proyecto; no se deben reemplazar ni eliminar los
registros MX, SPF, DKIM o DMARC usados por el correo.

## Caché recomendada

Mientras CSS, JavaScript e imágenes no utilicen hash de contenido, no deben
marcarse como inmutables.

| Rutas | `Cache-Control` sugerido |
| --- | --- |
| `/`, `/index.html`, `/404.html` | `public, max-age=0, must-revalidate` |
| `/robots.txt`, `/sitemap.xml` | `public, max-age=3600` |
| `/css/*`, `/js/*.js` | `public, max-age=86400` |
| `/js/vendor/three-r128.min.js` | `public, max-age=31536000, immutable` |
| `/src/img/optimized/*` | `public, max-age=2592000` |
| Logos, iconos y resto de assets | `public, max-age=604800` |

Si en el futuro se incorporan nombres con hash, esos archivos pueden usar un
año de caché y `immutable`.

## Compresión y tipos MIME

Habilitar Brotli y Gzip para HTML, CSS, JavaScript, JSON, XML y SVG. AVIF,
WebP, JPG y PNG no necesitan recompresión HTTP adicional.

Verificar especialmente:

| Extensión | Tipo esperado |
| --- | --- |
| `.avif` | `image/avif` |
| `.webp` | `image/webp` |
| `.svg` | `image/svg+xml` |
| `.xml` | `application/xml` o `text/xml` |
| `.js` | `text/javascript` o `application/javascript` |

## Headers de seguridad iniciales

Configurar como base:

```text
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
X-Frame-Options: SAMEORIGIN
```

La política CSP debe definirse después de inventariar Google Fonts, WhatsApp y
cualquier herramienta de analítica o monitoreo elegida. No activar una CSP
restrictiva sin probar WebGL, fuentes y enlaces externos.

## Control de indexación de archivos internos

`_headers` aplica `X-Robots-Tag: noindex` a documentación, configuración,
scripts de control y fuentes maestras. `robots.txt` permite que el crawler lea
esas respuestas: bloquearlas con `Disallow` impediría comprobar el header y
podría dejar URLs descubiertas por otros medios dentro del índice.

`vercel.json` traduce estas reglas a la configuración efectiva del hosting.
Verificar en producción que los recursos internos respondan con
`X-Robots-Tag`.

Se mantienen rastreables:

- `index.html`;
- `robots.txt` y `sitemap.xml`;
- CSS y JavaScript requeridos para representar el sitio;
- logos, iconos, cards e imágenes optimizadas activas;
- imagen social de Open Graph.

Las fuentes maestras de `src/img/bg/` deben estar disponibles para el equipo,
pero no indexarse ni aparecer en búsqueda de imágenes.

## Página 404

El proveedor debe servir `404.html` con estado HTTP `404`. No usar una regla
SPA que responda `index.html` con estado `200` para cualquier ruta.

## Procedimiento de publicación

1. Crear una copia o tag de la versión estable anterior.
2. Ejecutar `npm run check`.
3. Revisar el preview de despliegue en desktop y mobile.
4. Probar navegación con teclado y movimiento reducido.
5. Confirmar textos, imágenes y datos de contacto.
6. Publicar el commit aprobado.
7. Verificar dominio, HTTPS, redirecciones y código de estado de la página 404.
8. Verificar `robots.txt`, `sitemap.xml` e imagen social.
9. Confirmar que no existan errores de consola.
10. Registrar la versión publicada y la hora del despliegue.

## Verificación posterior

Comprobar:

```text
https://www.estudiovune.com/
https://www.estudiovune.com/robots.txt
https://www.estudiovune.com/sitemap.xml
https://www.estudiovune.com/src/img/optimized/vune-social-1200x630.jpg
https://www.estudiovune.com/una-ruta-inexistente
```

La última URL debe mostrar la página diseñada y responder `404`.

Verificar también:

- `Content-Encoding: br` o `gzip` en documentos de texto.
- `Cache-Control` según la tabla anterior.
- `X-Robots-Tag: noindex` en documentación, configuración y fuentes maestras.
- ausencia de contenido duplicado en el dominio sin `www`.
- canonical y Open Graph con URLs absolutas de producción.

## Rollback

1. Identificar el último commit o despliegue estable.
2. Restaurarlo desde el historial del proveedor o redeplegar ese commit.
3. No reescribir ni borrar el historial de Git.
4. Repetir las verificaciones posteriores al despliegue.
5. Registrar el motivo del rollback.
6. Resolver el incidente en una rama separada antes de volver a publicar.

Para releases públicas se recomienda crear tags `v1.0.0`, `v1.0.1`, etc.

## Monitoreo

`npm run check:production` comprueba disponibilidad, URL canónica, headers,
compresión, tipos MIME, sitemap, indexación y el estado 404. El workflow
`production-monitor.yml` lo ejecuta manualmente y, cuando la variable de
repositorio `PRODUCTION_MONITORING_ENABLED` vale `true`, cada hora.

Activarlo sólo después del primer deploy correcto. Además conviene configurar
alertas de despliegue y dominio dentro de Vercel. El control cubre:

- disponibilidad de la portada;
- estado de `sitemap.xml` y de la imagen social;
- certificado HTTPS;
- tiempo de respuesta;
- errores JavaScript y activaciones del fallback WebGL;
- Core Web Vitals en mobile y desktop.

No capturar texto introducido, parámetros de WhatsApp ni información personal.

## Analítica y rendimiento

El sitio carga Vercel Web Analytics y Speed Insights únicamente en producción
y previews de Vercel. Para completar la integración hay que habilitar ambos
productos en el panel del proyecto y volver a desplegar.

No se agregan eventos personalizados porque requieren decidir plan, retención
y responsables de acceso. Si luego se habilitan, medir únicamente eventos
accionables:

- CTA del hero;
- “Saber más” de cada servicio;
- CTA principal de WhatsApp;
- correo y teléfono;
- llegada a Servicios y Contacto.

No capturar texto introducido, parámetros de WhatsApp ni información personal.

## Trabajo deliberadamente separado

Los siguientes cambios requieren copia previa, rama y regresión visual:

- actualización de Three.js r128;
- migración del efecto a módulos ES;
- nombres de assets con hash y pipeline de build;
- incorporación de un proveedor de analítica o reporte de errores;
