# Arquitectura

## Resumen

Sitio estático de una sola página. `index.html` es la entrada única y carga
estilos, scripts, tipografías y Three.js mediante rutas relativas o CDN.

## Capas

### Documento

- `index.html`: estructura semántica, contenido y referencias.

### Presentación

- `css/scroll.css`: tokens, layout y estilos generales del recorrido.
- `css/index.css`: cabecera vigente, canvas y tarjetas de servicios.
- `css/style.css`: hoja histórica no vinculada.

### Comportamiento

- `js/webgl-effect.js`: Three.js, shaders, máscara, estela y zoom.
- `js/page-interactions.js`: reveal, índice de recorrido, tema de navegación,
  cursor contextual, progreso de sección y estados de las tarjetas.

### Recursos

- `src/img/`: collage, fotografías y fondos.
- `src/icons/`: iconos sociales exportados desde Figma.
- `src/logos/`: logotipo principal y favicon.
- `src/misc/cards/`: imágenes independientes de los pines de las tarjetas.
- `src/misc/blob/`: figuras orgánicas utilizadas como fondo.

## Dependencias externas

- Three.js r128 desde cdnjs.
- Inter y Averia Gruesa Libre desde Google Fonts.

No existe gestor de paquetes ni proceso de compilación.

## Flujo de carga

1. El navegador carga `scroll.css` y luego `index.css`.
2. Se construye la apertura y el contenido editorial.
3. Three.js queda disponible globalmente.
4. `webgl-effect.js` inicializa el canvas.
5. `page-interactions.js` inicializa reveal, navegación contextual, progreso,
   respuesta al puntero y cards.

## Rendimiento y resiliencia

- Los eventos continuos de scroll y puntero se agrupan con
  `requestAnimationFrame`.
- El canvas deja de actualizar textura y GPU una vez finalizada la apertura.
- El render WebGL se pausa cuando el documento no está visible.
- Si Three.js o WebGL no inicializan, el contenido y la cabecera siguen
  disponibles.
- La capa ornamental se reduce o elimina con `prefers-reduced-motion` y en
  dispositivos de puntero táctil.

## Restricciones

- Mantener `index.html` como entrada única.
- Mantener CSS y JavaScript propios fuera del HTML.
- Cargar `webgl-effect.js` después de Three.js.
- Preservar el recorrido long-scroll y las anclas vigentes.
- Mantener rutas relativas correctas desde cada carpeta.
- Respetar movimiento reducido y navegación por teclado.

## Ejecución y validación

No hay build, lint ni tests automatizados. El sitio puede servirse con:

```bash
python3 -m http.server 8000
```

La validación disponible comprende sintaxis JavaScript, existencia de archivos
vinculados y revisión manual en navegador.
