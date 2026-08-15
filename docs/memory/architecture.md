# Arquitectura

## Resumen

Sitio estático de una sola página publicado en Vercel. `index.html` es la
entrada única y carga estilos, scripts, tipografías y Three.js mediante rutas
locales, salvo las tipografías de Google Fonts.

## Capas

### Documento

- `index.html`: estructura semántica, contenido y referencias.
- `404.html`: respuesta visual liviana para rutas inexistentes.

### Presentación

- `css/scroll.css`: tokens, layout y estilos generales del recorrido.
- `css/index.css`: cabecera vigente, canvas y tarjetas de servicios.

### Comportamiento

- `js/webgl-effect.js`: Three.js, shaders, máscara, estela y zoom.
- `js/page-interactions.js`: reveal, estados interactivos de las tarjetas e
  índice lateral sincronizado con el scroll.
- `js/google-tag-manager.js`: carga el contenedor `GTM-MQQSHQZM` sin requerir
  JavaScript inline ni relajar la CSP.
- `js/vercel-observability.js`: carga Web Analytics y Speed Insights solamente
  en el dominio público o previews de Vercel.

### Recursos

- `src/img/bg/`: collage, fotografías y fondos activos.
- `src/icons/`: iconos de contacto y redes exportados desde Figma; solo
  WhatsApp está vinculado en la implementación vigente.
- `src/logos/`: logotipo principal y favicon.
- `src/misc/cards/`: imágenes independientes de los pines de las tarjetas.
- `src/misc/blob/`: figuras orgánicas utilizadas como fondo.

## Dependencias

- Three.js r128 desde `js/vendor/three-r128.min.js`.
- Inter y Averia Gruesa Libre desde Google Fonts.

No existe gestor de paquetes ni proceso de compilación.

## Flujo de carga

1. El navegador carga `scroll.css` y luego `index.css`.
2. Se construye la apertura y el contenido editorial.
3. La copia local de Three.js queda disponible globalmente.
4. `webgl-effect.js` inicializa el canvas.
5. `page-interactions.js` inicializa reveal y cards.

## Restricciones

- Mantener `index.html` como entrada única.
- Mantener CSS y JavaScript propios fuera del HTML.
- Cargar `webgl-effect.js` después de Three.js.
- Preservar la apertura estática cuando WebGL no esté disponible o el usuario
  prefiera movimiento reducido.
- Preservar el recorrido long-scroll y las anclas vigentes.
- Mantener rutas relativas correctas desde cada carpeta.
- Respetar movimiento reducido y navegación por teclado.

## Ejecución y validación

No hay build. Las comprobaciones automatizadas se ejecutan con:

```bash
npm run check
```

GitHub Actions ejecuta el mismo comando en pushes y pull requests. El sitio
puede servirse con:

```bash
python3 -m http.server 8000
```

`vercel.json` define headers, caché y la redirección de `/index.html`. El
monitor de producción se ejecuta con `npm run check:production` y puede
habilitarse en GitHub mediante `PRODUCTION_MONITORING_ENABLED=true`.
