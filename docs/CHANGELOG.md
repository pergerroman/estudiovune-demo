# Registro de cambios

Historial cronológico de cambios relevantes de la landing Vuné. El estado
vigente y los pendientes se documentan en
[`docs/memory/current-state.md`](memory/current-state.md).

## 2026-09-02

### Documentación

- Se trasladó la estructura funcional a `docs/memory/landing.md`.
- Se redujo `README.md` a una guía de entrada y se consolidó el historial en
  este documento.
- Se corrigieron las rutas y responsabilidades de la documentación para evitar
  registros duplicados.

### Open Graph

- Se adoptó `src/images/social/og.png` como imagen social de la landing.
- La imagen se optimizó a 1200 × 630 px, RGB y 767 KB.
- Open Graph y Twitter usan URLs absolutas y declaran formato, dimensiones,
  texto alternativo, URL segura, URL canónica y `og:url`.

### Contacto

- Se confirmó `hola@estudiovune.com` como correo institucional y se unificó en
  el footer, el enlace `mailto:` y los datos estructurados.

### Publicación

- Se configuraron Vercel y headers portables para seguridad, caché, redirección
  canónica e indexación controlada.
- Se incorporaron `sitemap.xml`, `404.html`, favicon ICO y Apple Touch Icon.
- Se alineó la página 404 con la estética del hero principal: fondo marrón,
  figura orgánica, tipografía Averia, cabecera y CTA celeste.
- Se agregaron controles locales y de producción mediante Node.js 20.
- Se incorporaron workflows de GitHub Actions para validación y monitoreo.
- Three.js r128 se incorporó en `js/vendor/`, se eliminó la dependencia de
  cdnjs y se configuró caché inmutable para la copia local.
- Se documentaron despliegue, dominio, verificación y rollback en
  `docs/DEPLOYMENT.md`.

### Medición

- Se incorporó el cargador local `js/google-tag-manager.js` al `<head>` con el
  contenedor `GTM-MQQSHQZM`.
- Se ajustó la política de seguridad para Tag Manager y Analytics sin permitir
  scripts inline ni `eval`.
- Los controles locales y de producción verifican el cargador, el contenedor y
  sus permisos de seguridad.

### Organización del proyecto

- Los recursos se ordenaron por función en `src/images/`, `src/graphics/`,
  `src/icons/` y `src/logos/`.
- Los archivos activos adoptaron nombres ASCII en minúsculas y `kebab-case`.
- Se retiraron la hoja histórica `css/style.css`, el icono de LinkedIn sin uso,
  un fondo sin referencias y los archivos `.DS_Store`.
- Se conservó `src/icons/instagram.svg` como recurso disponible para una futura
  integración, todavía sin vincularlo al sitio.
- Se actualizaron el código, la documentación y los controles para utilizar
  exclusivamente las rutas vigentes.

### Rama principal

- Se adoptó `main` como única rama de producción y como fuente esperada para
  Vercel y los workflows programados.
- Las ramas anteriores quedaron reservadas como historial y no deben volver a
  mezclarse sin una revisión explícita.
- El commit aprobado `0a19be4` quedó documentado como fuente de recuperación de
  la versión funcional.

## 2026-07-31

### Apertura WebGL y Safari móvil

- Se agregó el indicador “↓ Scroll” y su desaparición al iniciar el recorrido.
- Se extendió el viewport a los bordes seguros y se unificaron `theme-color`,
  canvas y fondo raíz en `#f7f7f4`.
- Se elevó el respaldo blanco inferior sobre el canvas para evitar que el
  collage aparezca detrás de la barra translúcida de Safari.

## 2026-07-27

### Contenido y SEO

- “Estudio de diseño patagónico” pasó a una cintilla superior en Inter dentro
  del hero de presentación.
- Se incorporaron título, descripción, metadatos sociales, datos estructurados
  de `ProfessionalService`, señales geográficas y `robots.txt`.
- Se retiró el texto “Coffee days” y su degradado de la sección Q&A.
- Los fondos activos pasaron a usar `src/images/backgrounds/collage.jpg`.

### Navegación y contacto

- Se retiró “Nosotros” de la navegación superior; la sección permanece en el
  índice lateral.
- Se agregó un índice fijo con seis accesos, estado activo por scroll, variante
  mobile y tratamiento blanco sobre Contacto.
- El índice se oculta durante la apertura WebGL.
- Los cinco enlaces “Saber más” se vincularon al WhatsApp del estudio.
- Se retiraron del footer los iconos de Instagram y LinkedIn y el usuario
  `@vune.estudio`.

### Tarjetas de servicios

- Se ajustaron escala y posición de las imágenes de las cinco tarjetas contra
  sus referencias visuales.

## 2026-07-26

### Arquitectura y documentación

- La experiencia WebGL se integró en `index.html`, que quedó como entrada única.
- Los estilos propios se separaron en `css/scroll.css` y `css/index.css`.
- El comportamiento se separó en `js/webgl-effect.js` y
  `js/page-interactions.js`.
- Se corrigieron rutas de assets y enlaces históricos a `effect.html`.
- Se restauró `lang="es"` y se consolidó la documentación del proyecto.
- Se configuró Live Server para ignorar Markdown, `.DS_Store` y `.git`.

### Identidad y contenido

- El hero de presentación pasó a pantalla completa marrón e incorporó
  `src/graphics/hero/orange-blur.svg`.
- Averia Gruesa Libre se aplicó a todos los títulos `<h2>`.
- Los assets se organizaron por función dentro de `src/`.
- Se adoptaron `src/logos/favicon.svg` y `src/logos/vune-logo.svg`.
- Se retiró la sección Registros/Archivo de esta versión.
- El cierre “Mirar / Co-diseño” pasó debajo del footer y adoptó
  `src/images/backgrounds/essay.jpg` como fondo.

### Servicios e interacción

- Se implementaron cinco tarjetas de servicios a partir de Figma, con paleta,
  pines, transiciones de 300 ms y soporte de foco.
- Las imágenes embebidas se reemplazaron por `src/graphics/cards/card-1.png` a
  `src/graphics/cards/card-5.png`.
- La sección recibió un fondo micropunteado institucional.
- En mobile, las tarjetas pasaron a un recorrido horizontal táctil con encastre.
- Se incorporó soporte para dispositivos táctiles y movimiento reducido.

### Apertura WebGL

- El desenfoque se aplicó únicamente a la estela, preservando la definición de
  la máscara SVG.
- Se agregaron ajustes específicos para Chrome.
- En mobile, el contenedor se extendió al 110% de la altura y sumó un respaldo
  blanco cálido inferior para Safari.

### Footer y contacto

- El CTA y el footer se integraron en un cierre verde de pantalla completa con
  esquinas superiores redondeadas.
- Se incorporaron contacto, marca, navegación, copyright y el teléfono
  corregido desde Figma.
- El CTA “Agendemos una charla” se vinculó al mensaje de WhatsApp validado por
  el estudio.

### Validación

- Se verificaron la sintaxis de los scripts y la existencia de los recursos
  locales vinculados.
- La revisión visual automatizada no estuvo disponible en esa sesión.
