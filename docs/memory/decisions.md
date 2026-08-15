# Decisiones

## `index.html` como entrada única

- Fecha: 2026-07-26.
- Estado: aceptada.
- Contexto: la experiencia interactiva se desarrolló inicialmente en
  `effect.html`.
- Decisión: integrar la experiencia y el contenido editorial en `index.html`.
- Consecuencia: los enlaces de inicio apuntan a `index.html` y `effect.html` ya
  no forma parte de la arquitectura vigente.

## Landing de una página

- Fecha: anterior a 2026-07-26.
- Estado: aceptada en la implementación.
- Decisión: mantener un recorrido long-scroll con navegación por anclas.
- Consecuencia: Servicios funciona como sección; Archivo queda fuera de esta
  versión.
- Actualización: se incorpora un índice lateral fijo con accesos a las seis
  etapas y estado activo sincronizado con el scroll; en mobile se compacta.
- Actualización: el índice permanece oculto durante la apertura WebGL y aparece
  cuando el recorrido ingresa en Presentación.

## Apertura WebGL

- Fecha: 2026-07-26.
- Estado: aceptada en la implementación.
- Decisión: usar el collage como fondo y una máscara WebGL del logotipo con
  estela de puntero y zoom por scroll.
- Consecuencia: Three.js r128 es una dependencia de ejecución.
- Actualización: en mobile, el 10% inferior extendido del contenedor WebGL usa
  un respaldo blanco cálido y el documento declara el mismo `theme-color` para
  armonizar la interfaz translúcida de Safari.
- Actualización: `src/img/bg/Collage.jpg` es la variante vinculada en todos los
  fondos activos; la versión PNG permanece disponible sin vincular.
- Actualización: el viewport se extiende hasta los bordes seguros mediante
  `viewport-fit=cover`; `theme-color` y el fondo raíz comparten el blanco cálido
  `#f7f7f4` para colorear la interfaz y el overscroll de Safari móvil.
- Actualización 2026-08-15: la apertura usa variantes responsive AVIF, WebP y
  JPG; limita el pixel ratio según dispositivo y ahorro de datos; pausa el loop
  fuera de la apertura o con la pestaña oculta; y ofrece una versión estática
  ante movimiento reducido o fallos de WebGL.
- Actualización 2026-08-15: Three.js r128 se sirve desde una copia local para
  evitar que la apertura dependa de la disponibilidad de un CDN.

## Imágenes responsive y carga diferida

- Fecha: 2026-08-15.
- Estado: aceptada.
- Decisión: preservar los originales como fuentes y servir derivados AVIF,
  WebP o JPG según soporte y ancho de pantalla.
- Consecuencia: el collage inicial conserva carga prioritaria, mientras el
  fondo de la sección Mirada se solicita al aproximarse al viewport.
- Actualización 2026-08-15: los recortes actuales del collage en Nosotros se
  confirman como imágenes definitivas y dejan de considerarse placeholders.

## Accesibilidad de la apertura y contraste

- Fecha: 2026-08-15.
- Estado: aceptada.
- Decisión: ofrecer un enlace de salto al contenido, retirar la cabecera del
  orden de tabulación mientras esté oculta y declarar el canvas como
  decorativo.
- Decisión: completar la jerarquía de Nosotros con un encabezado accesible,
  usar texto oscuro sobre el CTA celeste y reforzar la legibilidad del cierre
  fotográfico mediante overlay y mayor opacidad de texto.

## Publicación en Vercel

- Fecha: 2026-08-15.
- Estado: aceptada.
- Decisión: mantener el sitio sin build y agregar comprobaciones Node.js sin
  dependencias mediante `npm run check`.
- Consecuencia: GitHub Actions ejecuta los mismos controles en pushes y pull
  requests, sin desplegar ni escribir en servicios externos.
- Decisión: publicar en Vercel, mantener DNS y correo en BlueHosting y usar
  `https://www.estudiovune.com/` como URL primaria.
- Consecuencia: `vercel.json` define redirecciones, CSP, headers de seguridad,
  caché e indexación; `404.html` usa rutas absolutas desde la raíz.
- Decisión: integrar Vercel Web Analytics y Speed Insights, más un smoke test
  horario optativo desde GitHub Actions.
- Decisión: usar también Google Analytics mediante el contenedor confirmado
  `GTM-MQQSHQZM`; la verificación DNS de Google no sustituye la etiqueta.
- Consecuencia: el cargador se mantiene en un archivo local para evitar
  `unsafe-inline`, el fallback `noscript` queda al inicio del body y la CSP
  permite únicamente los hosts necesarios de Tag Manager y Analytics.
- Actualización 2026-08-15: GA4 se inicializa directamente con
  `G-Y0DP1ZTWEZ`; GTM se reserva para eventos y no debe repetir la etiqueta
  base con activación en todas las páginas.
- Decisión: no incorporar `@vercel/analytics/next`, porque el sitio es HTML
  estático y no utiliza Next.js ni un proceso de build.
- Restricción: la actualización de Three.js y la migración del WebGL requieren
  copia previa y trabajo separado.

## Limpieza de recursos históricos

- Fecha: 2026-08-15.
- Estado: aceptada.
- Decisión: eliminar la hoja histórica `css/style.css`, los iconos no usados de
  Instagram y LinkedIn, la fotografía retirada de Registros y los metadatos de
  Finder.
- Consecuencia: se conservan `Collage.jpg` y `_DSC5866 1.jpg` como fuentes
  maestras necesarias para regenerar los derivados optimizados.

## Indexación limitada a contenido público

- Fecha: 2026-08-15.
- Estado: aceptada.
- Decisión: permitir el rastreo de la portada, sitemap y assets activos, y
  excluir documentación, configuración, controles internos y fuentes maestras.
- Consecuencia: `_headers` conserva la política portable y `vercel.json` la
  aplica en Vercel; `robots.txt` permite que el crawler lea la respuesta.
- Alcance: estas reglas sólo controlan `estudiovune.com` y `www`; cada proyecto
  servido desde otro subdominio debe declarar su propio `noindex`.

## Desenfoque de la estela

- Fecha: 2026-07-26.
- Estado: aceptada.
- Decisión: aplicar blur únicamente a `tTrail`, manteniendo definida la máscara
  SVG.
- Consecuencia: Chrome recibe ajustes específicos de radio y blur para acercar
  su representación a Safari.

## Separación de responsabilidades

- Fecha: 2026-07-26.
- Estado: aceptada.
- Decisión: mantener el HTML sin estilos ni scripts propios inline.
- Consecuencia: estilos específicos en `css/index.css`, efecto en
  `js/webgl-effect.js` e interfaz en `js/page-interactions.js`.

## Tarjetas de servicios

- Fecha: 2026-07-26.
- Estado: aceptada.
- Decisión: implementar la composición y el movimiento entregados desde Figma.
- Consecuencia: cinco cards con paleta extendida, pines, transiciones de 300 ms,
  disolución del enlace y soporte de foco y movimiento reducido.
- Actualización: la sección utiliza un micropunteado marrón institucional sobre
  base crema, generado mediante un gradiente radial CSS al 15% de opacidad.
- Actualización: en pantallas de hasta 680 px, las cards se recorren mediante
  scroll horizontal con encastre, en lugar de apilarse verticalmente.
- Actualización: los cinco enlaces “Saber más” abren el contacto de WhatsApp en
  una pestaña nueva con el mensaje de consulta indicado por el estudio.

## Assets de las tarjetas

- Fecha: 2026-07-26.
- Estado: aceptada.
- Decisión: cargar los cinco pines desde `src/misc/cards/Card1.png` a
  `src/misc/cards/Card5.png`.
- Consecuencia: `index.html` ya no contiene las imágenes de las tarjetas como
  data URI.
- Actualización: la imagen de la Card 1 adopta la escala y posición superior
  definidas por la referencia visual vigente.
- Actualización: la imagen de la Card 2 se desplaza hacia abajo para coincidir
  con la referencia visual vigente.
- Actualización: la imagen de la Card 3 aumenta su escala, conserva el centrado
  y se desplaza ligeramente hacia abajo según la referencia visual vigente.
- Actualización: la imagen de la Card 4 aumenta su escala y se desplaza hacia
  abajo, conservando su orientación vertical.
- Actualización: la imagen de la Card 5 aumenta su escala y conserva su centro
  visual.

## CTA integrado en el footer

- Fecha: 2026-07-26.
- Estado: aceptada.
- Decisión: reemplazar la CTA y el footer separados por un único cierre verde
  de pantalla completa, con esquinas superiores redondeadas.
- Consecuencia: `.foot#contacto` contiene el CTA y `.essay` aparece debajo como
  último bloque del recorrido.
- Referencia: nodos Figma `50:13`, `50:24`, `50:30`, `50:35`, `50:20`,
  `50:16` y `58:17`.
- Actualización: el nodo integral `140:1291` pasa a ser la referencia vigente e
  incorpora título, iconos sociales y franja inferior de copyright.
- Actualización: se retiran de la implementación los iconos de Instagram y
  LinkedIn junto con `@vune.estudio`; los assets permanecen disponibles.

## Archivo fuera de esta versión

- Fecha: 2026-07-26.
- Estado: aceptada.
- Decisión: retirar la sección Registros/Archivo y sus accesos de navegación.
- Consecuencia: se eliminan `#registros`, `.archive`, `.window` y sus estilos
  asociados.

## SEO local y rastreo

- Fecha: 2026-07-27.
- Estado: aceptada.
- Decisión: posicionar Vuné como estudio de diseño patagónico con sede en
  Cipolletti mediante metadatos descriptivos, contenido visible y datos
  estructurados de `ProfessionalService`.
- Consecuencia: el documento usa `es-AR`, explicita Patagonia Argentina,
  Cipolletti y Río Negro, y declara las principales áreas de servicio.
- Actualización 2026-08-15: se confirma `https://www.estudiovune.com/` como URL
  pública y se incorporan canonical, `og:url`, sitemap, URLs sociales absolutas
  y una imagen social JPG de 1200 × 630 px.
- Actualización 2026-08-15: se confirma `hola@estudiovune.com` como correo
  institucional y se incorpora al footer y al JSON-LD.
- Actualización 2026-08-15: se confirman el teléfono `+54 299 421 5193`, el
  destino y los mensajes de WhatsApp, la ubicación en Cipolletti, Río Negro, y
  la definición “Estudio creativo patagónico”. El JSON-LD incorpora teléfono,
  dirección y punto de contacto.
