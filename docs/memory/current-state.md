# Estado actual

Última revisión: 2026-07-27.

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
- El documento incluye metadatos SEO y sociales, datos estructurados de
  servicio profesional y señales de relevancia local para Cipolletti, Río Negro
  y Patagonia Argentina.
- `robots.txt` permite el rastreo del sitio.
- La documentación general está consolidada en `README.md`.

## Validaciones realizadas

- Sintaxis de `js/webgl-effect.js`.
- Sintaxis de `js/page-interactions.js`.
- Ausencia de CSS y JavaScript propios inline.
- Existencia de los recursos locales vinculados.
- Ausencia de referencias documentales a `effect.html` como archivo activo.

La revisión visual automatizada no estuvo disponible en la sesión.

## Pendientes

1. Validar textos y datos de contacto, incluido el teléfono tomado de Figma.
2. Confirmar imágenes definitivas para los placeholders.
3. Revisar manualmente Safari, Chrome y Firefox.
4. Confirmar si `css/style.css` puede eliminarse.
5. Confirmar el dominio público para agregar URL canónica, `og:url`, URLs
   absolutas en datos sociales y `sitemap.xml`.

## Deuda técnica

- `css/style.css` no está vinculada y conserva una implementación histórica.
- No existen build, lint ni tests automatizados.
- Three.js depende de un CDN externo.

## Cambios externos preservados

El árbol de trabajo contiene eliminaciones y archivos no registrados ajenos a
esta normalización. No deben revertirse sin indicación expresa.
