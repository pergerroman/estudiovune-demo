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
- Actualización 2026-09-02: la dependencia se sirve desde
  `js/vendor/three-r128.min.js`; se elimina la carga desde cdnjs y el permiso
  correspondiente de la política de seguridad.
- Actualización: en mobile, el 10% inferior extendido del contenedor WebGL usa
  un respaldo blanco cálido y el documento declara el mismo `theme-color` para
  armonizar la interfaz translúcida de Safari.
- Actualización: `src/images/backgrounds/collage.jpg` es la variante vinculada
  en todos los fondos activos.
- Actualización: el viewport se extiende hasta los bordes seguros mediante
  `viewport-fit=cover`; `theme-color` y el fondo raíz comparten el blanco cálido
  `#f7f7f4` para colorear la interfaz y el overscroll de Safari móvil.

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
- Decisión: cargar los cinco pines desde `src/graphics/cards/card-1.png` a
  `src/graphics/cards/card-5.png`.
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
  LinkedIn junto con `@vune.estudio`; el SVG de Instagram se conserva como
  recurso para una futura integración.

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
- Restricción inicial: `canonical`, `og:url` y `sitemap.xml` quedaron pospuestos
  hasta confirmar el dominio. La URL se confirmó el 2026-09-02; el sitemap
  permanece pendiente.

## Imagen social y URL canónica

- Fecha: 2026-09-02.
- Estado: aceptada.
- Decisión: usar `src/images/social/og.png`, optimizada a 1200 × 630 px, como
  imagen compartida por Open Graph y Twitter.
- Consecuencia: la imagen social, `canonical` y `og:url` utilizan URLs absolutas
  de `https://www.estudiovune.com/`; los metadatos declaran formato,
  dimensiones y texto alternativo.

## Correo institucional

- Fecha: 2026-09-02.
- Estado: confirmado.
- Decisión: usar `hola@estudiovune.com` como correo institucional en todo el
  sitio.
- Consecuencia: el footer, el enlace `mailto:` y los datos estructurados deben
  mantener esta dirección.

## Publicación del dominio

- Fecha: 2026-09-02.
- Estado: aceptada.
- Decisión: publicar `https://www.estudiovune.com/` exclusivamente desde
  `main` mediante Vercel.
- Consecuencia: `vercel.json` define redirecciones, seguridad y caché; la raíz
  incorpora sitemap, página 404, favicons y controles automatizados.
- Actualización: la versión aprobada se recuperó desde el commit `0a19be4` para
  convertirla en el contenido canónico de `main`.
- Restricción: las ramas anteriores quedan como historial y no se integran sin
  indicación y revisión explícitas.

## Organización de recursos

- Fecha: 2026-09-02.
- Estado: aceptada.
- Decisión: organizar los recursos activos por función dentro de `src/` y usar
  nombres ASCII en minúsculas y `kebab-case`.
- Consecuencia: las imágenes editoriales viven en `src/images/`, las piezas
  gráficas en `src/graphics/`, los iconos en `src/icons/` y las marcas en
  `src/logos/`.
- Consecuencia: se retiraron archivos históricos o sin referencias confirmadas
  para evitar ambigüedad durante mantenimiento y publicación.
- Excepción: `src/icons/instagram.svg` se conserva, todavía sin vincular, por
  decisión del estudio para una futura integración.

## Medición con Google Tag Manager

- Fecha: 2026-09-02.
- Estado: aceptada.
- Decisión: cargar el contenedor `GTM-MQQSHQZM` desde
  `js/google-tag-manager.js` al inicio del `<head>`.
- Consecuencia: el script oficial se obtiene de `www.googletagmanager.com` de
  forma asíncrona y la política de seguridad habilita únicamente los dominios
  necesarios para Tag Manager y Analytics.
- Restricción: mantener el código de inicialización fuera del HTML y revisar
  las etiquetas y el consentimiento antes de publicar cambios del contenedor.
