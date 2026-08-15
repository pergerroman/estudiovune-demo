# Assets maestros y derivados

Documento de lectura obligatoria antes de modificar, optimizar, reemplazar o
eliminar imágenes del proyecto Vuné.

## Fuentes maestras

Los siguientes archivos son fuentes maestras y deben preservarse aunque no se
vinculen directamente desde HTML o CSS:

| Uso | Archivo maestro |
| --- | --- |
| Collage de apertura, recortes y redes | `src/img/bg/Collage.jpg` |
| Fondo fotográfico de la sección Mirada | `src/img/bg/_DSC5866 1.jpg` |

Reglas:

- No sobrescribir, recomprimir, redimensionar, renombrar ni eliminar estos
  archivos sin autorización expresa.
- No vincularlos directamente en producción: su peso está destinado a
  conservación y regeneración, no a descarga por visitantes.
- Todo cambio visual debe realizarse sobre una copia derivada.
- Los derivados nuevos se generan siempre desde el maestro, nunca desde otro
  AVIF, WebP o JPG optimizado. Esto evita pérdida acumulativa.
- Preservar encuadre, orientación y perfil de color perceptual salvo que exista
  una decisión visual explícita que indique lo contrario.
- Antes de reemplazar un maestro, conservar una copia verificable y registrar
  el cambio en `README.md` y `docs/memory/decisions.md`.

## Derivados activos

Los archivos servidos por el sitio viven en `src/img/optimized/`.

### Collage

```text
collage-768.avif
collage-768.webp
collage-768.jpg
collage-1440.avif
collage-1440.webp
collage-1440.jpg
collage-2560.avif
collage-2560.webp
collage-2560.jpg
```

### Fondo de Mirada

```text
essay-768.avif
essay-768.webp
essay-768.jpg
essay-1440.avif
essay-1440.webp
essay-1440.jpg
essay-2000.avif
essay-2000.webp
essay-2000.jpg
```

### Imagen social

```text
vune-social-1200x630.jpg
```

La imagen social debe conservar 1200 × 630 px, relación 1.91:1, formato JPG y
un peso máximo de 300 KB para compatibilidad con rastreadores sociales.

## Herramienta de generación

Los derivados vigentes fueron generados con ImageMagick. Verificar primero:

```bash
magick -version
```

Si no está disponible en macOS:

```bash
brew install imagemagick
```

La instalación modifica herramientas del entorno, no el repositorio, y debe
contar con autorización cuando el entorno la requiera.

## Regeneración del collage

Ejecutar desde la raíz del repositorio:

```bash
for w in 768 1440 2560; do
  magick src/img/bg/Collage.jpg \
    -auto-orient -strip -resize "${w}x>" \
    -quality 50 -define heic:speed=6 \
    "src/img/optimized/collage-${w}.avif"

  magick src/img/bg/Collage.jpg \
    -auto-orient -strip -resize "${w}x>" \
    -quality 72 -define webp:method=6 \
    "src/img/optimized/collage-${w}.webp"

  magick src/img/bg/Collage.jpg \
    -auto-orient -strip -resize "${w}x>" \
    -quality 78 -interlace Plane \
    "src/img/optimized/collage-${w}.jpg"
done
```

## Regeneración del fondo de Mirada

```bash
for w in 768 1440 2000; do
  magick 'src/img/bg/_DSC5866 1.jpg' \
    -auto-orient -strip -resize "${w}x>" \
    -quality 48 -define heic:speed=6 \
    "src/img/optimized/essay-${w}.avif"

  magick 'src/img/bg/_DSC5866 1.jpg' \
    -auto-orient -strip -resize "${w}x>" \
    -quality 72 -define webp:method=6 \
    "src/img/optimized/essay-${w}.webp"

  magick 'src/img/bg/_DSC5866 1.jpg' \
    -auto-orient -strip -resize "${w}x>" \
    -quality 78 -interlace Plane \
    "src/img/optimized/essay-${w}.jpg"
done
```

## Regeneración de la imagen social

```bash
magick src/img/bg/Collage.jpg \
  -auto-orient -strip \
  -resize '1200x630^' \
  -gravity center \
  -extent 1200x630 \
  -quality 82 \
  -interlace Plane \
  src/img/optimized/vune-social-1200x630.jpg
```

El recorte social debe inspeccionarse visualmente después de regenerarlo. No se
debe asumir que un nuevo collage conserva los elementos importantes dentro del
recorte central.

## Integración en el sitio

- `css/scroll.css` define las variantes responsive mediante `image-set()`.
- `index.html` precarga el AVIF del collage correspondiente al ancho de
  pantalla.
- La fotografía de Mirada se activa mediante `IntersectionObserver` desde
  `js/page-interactions.js`.
- Open Graph y Twitter utilizan la URL absoluta de
  `vune-social-1200x630.jpg`.
- Mantener un JPG optimizado como fallback para navegadores que no interpreten
  `image-set()` o formatos modernos.

Al agregar un ancho o formato nuevo, actualizar conjuntamente CSS, precargas,
el validador y este documento.

## Validación obligatoria

Después de generar o reemplazar derivados:

1. Ejecutar:

   ```bash
   npm run check
   ```

2. Confirmar dimensiones y decodificación:

   ```bash
   magick identify src/img/optimized/*
   ```

3. Comparar visualmente cada derivado con su maestro.
4. Revisar encuadre, color, detalle, banding y artefactos.
5. Comprobar desktop, mobile y una pantalla ancha.
6. Verificar que la fotografía de Mirada no se solicite antes de aproximarse a
   la sección.
7. Verificar la imagen social con un depurador de Open Graph después de
   publicar.

## Presupuestos vigentes

El script `scripts/check-site.mjs` controla como mínimo:

| Archivo | Máximo |
| --- | ---: |
| `collage-768.avif` | 100 KB |
| `collage-1440.avif` | 400 KB |
| `collage-2560.avif` | 600 KB |
| `vune-social-1200x630.jpg` | 300 KB |

No aumentar estos límites para hacer pasar una validación. Si un derivado los
supera, revisar resolución, calidad y encuadre, y documentar cualquier cambio
de presupuesto aprobado.

## Eliminación de imágenes

Antes de eliminar cualquier imagen:

1. Buscar consumidores en HTML, CSS, JavaScript, sitemap y documentación.
2. Distinguir entre archivo servido, fuente maestra y recurso histórico.
3. No considerar innecesaria una fuente maestra sólo porque no tenga una
   referencia de ejecución.
4. Confirmar que los derivados puedan regenerarse sin ella.
5. Registrar las eliminaciones relevantes en `README.md` y memoria.

La ausencia de una referencia en `index.html` no autoriza por sí sola la
eliminación de un asset maestro.
