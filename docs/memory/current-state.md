# Estado actual

Última revisión: 2026-08-21.

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
- El footer conserva correo, WhatsApp y ubicación, sin iconos de Instagram o
  LinkedIn ni usuario social.
- El botón principal del footer abre el contacto de WhatsApp con el mensaje de
  consulta indicado por el estudio.
- El favicon y el logotipo externo usan assets existentes.
- La portada y la página 404 declaran un favicon ICO con tamaños de 16, 32 y
  48 px, el favicon SVG oficial y un Apple Touch Icon de 180 × 180 px.
- El documento incluye metadatos SEO y sociales, datos estructurados de
  servicio profesional y señales de relevancia local para Cipolletti, Río Negro
  y Patagonia Argentina.
- `robots.txt` permite el rastreo del sitio.
- El collage y el fondo final se sirven mediante variantes responsive AVIF,
  WebP y JPG; el fondo final utiliza carga diferida.
- El WebGL adapta su resolución, se pausa fuera de la apertura o en segundo
  plano y dispone de una apertura estática para movimiento reducido y fallos.
- El renderer usa DPR máximo 2 en mobile y 2.5 en desktop; con ahorro de datos
  mantiene DPR 1.
- Three.js r128 se sirve localmente desde `js/vendor/`.
- `https://www.estudiovune.com/` es la URL canónica confirmada; Open Graph,
  Twitter y `sitemap.xml` utilizan URLs absolutas de ese dominio.
- La imagen social es `src/img/optimized/vune-social-1200x630.jpg`.
- `hola@estudiovune.com` es el correo institucional confirmado y se declara en
  el footer y el JSON-LD.
- El teléfono `+54 299 421 5193`, el destino y los mensajes de WhatsApp, la
  ubicación en Cipolletti, Río Negro, y la definición “Estudio creativo
  patagónico” están confirmados.
- El JSON-LD declara correo, teléfono, dirección y punto de contacto de
  WhatsApp.
- La cabecera queda fuera del árbol accesible y del orden de tabulación
  mientras está oculta; el enlace de salto fue retirado por decisión visual.
- El overscroll vertical se contiene únicamente en la raíz para evitar el
  rebote externo sin bloquear el desplazamiento normal en Chrome.
- La sección Nosotros posee un encabezado de segundo nivel accesible; el canvas
  se declara decorativo y los contrastes del CTA celeste y del cierre fueron
  reforzados.
- La documentación general está consolidada en `README.md`.
- `404.html` ofrece una respuesta de error liviana con rutas seguras desde
  cualquier URL; Vercel deberá confirmarse con una prueba posterior al deploy.
- `npm run check` valida estructura, rutas, scripts, SEO y presupuestos de peso;
  GitHub Actions ejecuta el mismo control sin desplegar.
- `docs/DEPLOYMENT.md` documenta la configuración esperada de dominio, HTTPS,
  caché, compresión, publicación, monitoreo y rollback.
- `docs/memory/master-assets.md` es lectura obligatoria y documenta fuentes
  maestras, derivados, regeneración y presupuestos de imágenes.
- `_headers` excluye de indexación documentación, configuración, scripts
  internos y fuentes maestras; `robots.txt` permite leer esos headers y no
  bloquea los assets activos.
- Vercel es el hosting confirmado y BlueHosting mantiene dominio y correo.
- `vercel.json` configura seguridad, caché, redirección e indexación.
- CSS y JavaScript propios usan la revisión de URL `20260821-1` para invalidar
  copias anteriores y se entregan con `max-age=0, must-revalidate`; sólo los
  recursos con nombre versionado, como Three.js r128, conservan caché
  inmutable.
- Web Analytics y Speed Insights están activos en producción.
- Google Tag Manager usa el contenedor confirmado `GTM-MQQSHQZM`, con cargador
  en `head`, fallback `noscript` y permisos explícitos en la CSP.
- Google Analytics 4 usa directamente el ID confirmado `G-Y0DP1ZTWEZ`; GTM
  queda disponible para eventos sin duplicar la etiqueta base de todas las páginas.
- GA4 registra directamente `hero_cta_click`, `service_click`,
  `whatsapp_click` y `email_click` sin enviar correos ni mensajes predefinidos
  de WhatsApp como parámetros.
- `npm run check:production` y el workflow horario verifican el sitio publicado.

## Validaciones realizadas

- Sintaxis de `js/webgl-effect.js`.
- Sintaxis de `js/page-interactions.js`.
- Ausencia de CSS y JavaScript propios inline.
- Existencia de los recursos locales vinculados.
- Sintaxis de la copia local de Three.js.
- Generación y tamaño de las variantes AVIF, WebP y JPG.
- Ausencia de referencias documentales a `effect.html` como archivo activo.
- Ausencia de referencias a los recursos históricos eliminados.
- Existencia, formato, dimensiones y declaraciones del favicon ICO y el Apple
  Touch Icon.
- Versionado de las referencias CSS/JavaScript y revalidación obligatoria de
  los recursos propios sin hash.
- Lighthouse local con Chrome y WebGL por software: mobile 65 rendimiento,
  desktop 94; accesibilidad, buenas prácticas y SEO 100 en ambos perfiles.
- Consola del navegador sin errores en las auditorías mobile y desktop.
- Métricas mobile: FCP 3,1 s, LCP 6,1 s, Speed Index 8,0 s, TBT 40 ms y CLS 0.
- Métricas desktop: FCP 0,9 s, LCP 1,3 s, Speed Index 1,4 s, TBT 0 ms y CLS 0.
- Publicación verificada: 23 de 23 controles de producción correctos, incluida
  la caché larga e inmutable de Three.js.
- Lighthouse publicado: mobile 55 y desktop 82 en rendimiento; accesibilidad y
  SEO 100 en ambos. Los errores de consola provienen de Web Analytics todavía
  inactivo; Speed Insights sí responde correctamente.
- No se encontraron resultados indexados para los subdominios revisados, pero
  `pgm`, `muy-mucho`, `mis-xv-sofia` y `fpg2026` responden públicamente sin
  `X-Robots-Tag`; `demo` está protegido por Vercel y `tizval` responde 404.

Lighthouse y la consola deben volver a medirse después del deploy definitivo,
con compresión, caché y red de producción activas.

## Pendientes

1. Desplegar el commit vigente con GA4 y sus eventos directos.
2. Validar `G-Y0DP1ZTWEZ` y sus cuatro eventos en Tiempo real o
   DebugView. El contenedor GTM puede quedar disponible para futuras etiquetas,
   sin repetir la medición base ni estos eventos.
3. Revisar manualmente Safari, Chrome y Firefox, incluida la selección de
   formatos, el fallback estático y la pausa del canvas.
4. Activar en GitHub la variable de repositorio
   `PRODUCTION_MONITORING_ENABLED=true` y confirmar la primera ejecución.
5. Aplicar `noindex` en cada proyecto que responda desde un subdominio ajeno a
   esta landing; el dominio principal no puede imponer headers a otros hosts.
6. Repetir `npm run check:production` y Lighthouse después del deploy, y
   decidir el alcance de la optimización
   WebGL mobile.

Los recortes actuales del collage fueron confirmados como imágenes definitivas.

## Deuda técnica

- No existe build; las comprobaciones automatizadas no incluyen todavía una
  regresión visual con navegador.
- Three.js permanece en r128 y requiere una actualización futura con regresión
  visual controlada.
- La apertura WebGL limita el rendimiento mobile sintético: Three.js aporta
  aproximadamente 589 KiB sin compresión en el servidor local y el LCP medido
  fue 6,1 s. Resolverlo requiere optimizar o reemplazar la dependencia con una
  regresión visual separada.

## Cambios externos preservados

El árbol de trabajo contiene eliminaciones y archivos no registrados ajenos a
esta normalización. No deben revertirse sin indicación expresa.
