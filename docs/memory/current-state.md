# Estado actual

Última revisión: 2026-09-30.

## Implementación vigente

- `index.html` es la entrada única.
- La apertura WebGL y la landing editorial están integradas.
- La apertura incluye un indicador sutil “↓ Scroll” que desaparece al iniciar
  el desplazamiento.
- CSS y JavaScript propios están separados por responsabilidad.
- La cabecera aparece cuando finaliza el zoom.
- La navegación superior ofrece Inicio y Contacto; Nosotros se accede desde el
  índice lateral.
- Las imágenes de la sección Q&A se muestran sin texto superpuesto.
- Un índice lateral fijo permite navegar las seis etapas y marca en tiempo real
  la sección visible; permanece oculto durante la apertura y en mobile adopta
  una variante compacta. En Contacto se muestra en blanco puro.
- En mobile, el fondo del contenedor del canvas WebGL ocupa el 110% de la altura
  de la pantalla y completa el tramo inferior con blanco cálido para Safari.
- El viewport cubre las áreas seguras del dispositivo y mantiene `#f7f7f4`
  como color de tema y fondo raíz para la interfaz de Safari móvil.
- El respaldo blanco del tramo inferior mobile se renderiza por encima del
  canvas para que el collage no aparezca detrás de la barra de Safari.
- Las cards de servicios incluyen estilos, pines e interacción de Figma sobre
  un fondo crema micropunteado en marrón al 15% de opacidad.
- En mobile, las cards de servicios forman un recorrido horizontal táctil con
  encastre entre tarjetas.
- Los cinco enlaces “Saber más” de las cards abren el contacto de WhatsApp en
  una pestaña nueva con un mensaje de consulta predefinido.
- El CTA está integrado en un footer verde de pantalla completa con radios
  superiores, contacto, marca y navegación.
- El footer presenta Instagram, WhatsApp, correo, Cipolletti y “Estudio creativo
  de la Patagonia argentina”, en ese orden. Instagram enlaza al perfil oficial
  `@estudiovune` y utiliza el icono disponible en `src/icons/instagram.svg`.
- `hola@estudiovune.com` es el correo institucional confirmado y se utiliza en
  el footer y los datos estructurados.
- El botón principal del footer abre el contacto de WhatsApp con el mensaje de
  consulta indicado por el estudio.
- El favicon y el logotipo externo usan assets existentes.
- La portada y la página 404 declaran favicon SVG, favicon ICO en 16, 32 y 48 px
  y Apple Touch Icon de 180 × 180 px.
- El documento incluye metadatos SEO y sociales, datos estructurados de
  servicio profesional y señales de relevancia local para Cipolletti, Río Negro
  y Patagonia Argentina.
- Open Graph y Twitter utilizan `src/images/social/og.png`, optimizada a
  1200 × 630 px, con URL absoluta, formato, dimensiones y texto alternativo
  declarados.
- `https://www.estudiovune.com/` se declara como URL canónica y `og:url`.
- `robots.txt` permite el rastreo del sitio.
- `robots.txt` declara el sitemap canónico y `sitemap.xml` contiene la portada.
- `404.html` replica el lenguaje del hero principal mediante fondo marrón,
  figura orgánica naranja, Averia Gruesa Libre, cabecera y CTA celeste.
- `vercel.json` y `_headers` definen seguridad, caché, redirección canónica y
  exclusión de documentación de los buscadores.
- Three.js r128 se sirve desde `js/vendor/three-r128.min.js` con caché inmutable;
  la apertura ya no depende de cdnjs.
- Google Tag Manager se inicia desde `js/google-tag-manager.js` en el `<head>`
  con el contenedor `GTM-MQQSHQZM`; la política de seguridad permite sus
  scripts y conexiones habituales de Analytics sin habilitar scripts inline.
- `npm run check` valida el paquete local y `npm run check:production` controla
  el sitio publicado.
- GitHub Actions ejecuta las comprobaciones locales y permite monitorear
  producción cada hora.
- `main` es la única rama autorizada para publicación; las ramas anteriores se
  conservan únicamente como historial.
- `README.md` funciona como índice documental y `docs/CHANGELOG.md` concentra
  el historial de cambios.
- Los recursos activos están organizados por función en `src/images/`,
  `src/graphics/`, `src/icons/` y `src/logos/`, con nombres ASCII consistentes.
- Los recursos históricos o sin referencias confirmadas fueron retirados del
  árbol de publicación, excepto el icono de Instagram reservado expresamente.

## Validaciones realizadas

- Sintaxis de `js/webgl-effect.js`.
- Sintaxis de `js/page-interactions.js`.
- Ausencia de CSS y JavaScript propios inline.
- Existencia de los recursos locales vinculados.
- Ausencia de referencias documentales a `effect.html` como archivo activo.
- Presencia de los metadatos Open Graph y Twitter requeridos.
- Formato PNG, dimensiones 1200 × 630 px y servicio HTTP correcto de `og.png`.
- Presencia y dimensiones de favicon ICO y Apple Touch Icon.
- Integridad de anclas, rutas HTML/CSS y enlaces Markdown.
- Sintaxis de JavaScript, JSON-LD, `vercel.json` y `package.json`.
- Sintaxis y presencia de la copia local de Three.js r128.
- Carga local, ID de contenedor y permisos de seguridad de Google Tag Manager.
- Configuración de `robots.txt`, `sitemap.xml`, 404, headers y caché.

La revisión visual automatizada no estuvo disponible en la sesión.

## Pendientes

1. Validar los textos restantes y los datos de contacto distintos del correo,
   incluido el teléfono tomado de Figma.
2. Confirmar imágenes definitivas para los placeholders.
3. Revisar manualmente Safari, Chrome y Firefox.
4. Revisar en Google Tag Manager las etiquetas publicadas y la configuración de
   consentimiento antes del despliegue definitivo.
5. Publicar esta rama y ejecutar `npm run check:production`.
6. Configurar esta rama como predeterminada en GitHub y activar
   `PRODUCTION_MONITORING_ENABLED=true` después del primer despliegue correcto.

## Deuda técnica

- No existe una regresión visual automatizada.
- Three.js permanece en la versión r128 y requiere una actualización futura
  con regresión visual controlada.
