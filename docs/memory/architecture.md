# Arquitectura

## Resumen

Sitio estático de una sola página. `index.html` es la entrada única y carga
estilos, scripts y Three.js mediante rutas relativas; las tipografías se cargan
desde Google Fonts.

## Capas

### Documento

- `index.html`: estructura semántica, contenido y referencias.
- `404.html`: respuesta de error pública y liviana.

### Presentación

- `css/scroll.css`: tokens, layout y estilos generales del recorrido.
- `css/index.css`: cabecera vigente, canvas y tarjetas de servicios.
- `css/404.css`: presentación exclusiva de la página de error.

### Comportamiento

- `js/webgl-effect.js`: Three.js, shaders, máscara, estela y zoom.
- `js/page-interactions.js`: reveal, estados interactivos de las tarjetas e
  índice lateral sincronizado con el scroll.
- `js/google-tag-manager.js`: inicialización local del contenedor de Google Tag
  Manager.
- `js/vendor/three-r128.min.js`: copia local versionada de Three.js r128.

### Recursos

- `src/images/backgrounds/`: fondos fotográficos activos.
- `src/images/social/`: imagen social para Open Graph y Twitter.
- `src/graphics/cards/`: imágenes independientes de las tarjetas.
- `src/graphics/hero/`: figuras orgánicas utilizadas como fondo.
- `src/icons/`: iconos funcionales; WhatsApp está activo e Instagram queda
  reservado para una futura integración.
- `src/logos/`: logotipo principal y favicon.

### Documentación

- `README.md`: guía de entrada e índice documental.
- `docs/CHANGELOG.md`: registro cronológico de cambios.
- `docs/DEPLOYMENT.md`: operación del dominio y procedimiento de publicación.
- `docs/memory/`: estado vigente, contexto y decisiones duraderas.

### Publicación y control

- `vercel.json`: redirección canónica, seguridad, caché e indexación.
- `_headers`: equivalente portable de los headers esenciales.
- `robots.txt` y `sitemap.xml`: rastreo del dominio canónico.
- `favicon.ico`, `src/logos/favicon.svg` y `apple-touch-icon.png`: iconos
  públicos.
- `package.json`: comandos de validación, sin dependencias de ejecución.
- `scripts/check-site.mjs`: control estático local.
- `scripts/check-production.mjs`: verificación HTTP posterior al despliegue.
- `.github/workflows/`: validación continua y monitoreo de producción.

## Dependencias

- Three.js r128, servido desde `js/vendor/three-r128.min.js`.
- Google Tag Manager, contenedor `GTM-MQQSHQZM`, cargado desde el dominio
  oficial mediante un inicializador local.
- Inter y Averia Gruesa Libre desde Google Fonts.

No existe proceso de compilación ni dependencias de ejecución. Los scripts de
control requieren Node.js 20 o superior.

## Flujo de carga

1. El cargador local inicia Google Tag Manager desde el `<head>`.
2. El navegador carga `scroll.css` y luego `index.css`.
3. Se construye la apertura y el contenido editorial.
4. Three.js queda disponible globalmente.
5. `webgl-effect.js` inicializa el canvas.
6. `page-interactions.js` inicializa reveal y cards.

## Restricciones

- Mantener `index.html` como entrada única.
- Mantener CSS y JavaScript propios fuera del HTML.
- Cargar `webgl-effect.js` después de Three.js.
- Preservar el recorrido long-scroll y las anclas vigentes.
- Mantener rutas relativas correctas desde cada carpeta.
- Respetar movimiento reducido y navegación por teclado.

## Ejecución y validación

El sitio puede servirse con:

```bash
python3 -m http.server 8000
```

Antes de publicar se ejecuta:

```bash
npm run check
```

Después del despliegue se ejecuta `npm run check:production`. La revisión
manual en navegadores continúa siendo obligatoria.
