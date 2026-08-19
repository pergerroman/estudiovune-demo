# Estructura y funcionamiento de la landing Vuné

Referencia funcional de la implementación vigente en `index.html`.

La página trabajada anteriormente como `effect.html` fue integrada en
`index.html`, que ahora es la única entrada del sitio. La experiencia combina
una apertura WebGL con el contenido editorial de la landing.

## 1. Recorrido general

| Orden | Bloque | Selector | Función |
| --- | --- | --- | --- |
| 1 | Apertura interactiva | `.hero-stage`, `#webgl-container` | Collage, máscara WebGL y zoom por scroll |
| 2 | Presentación | `.intro`, `#intro` | Declaración de identidad y CTA |
| 3 | Nosotros | `.about`, `#nosotros` | Q&A y composición visual |
| 4 | Servicios | `.services`, `#servicios` | Cinco tarjetas interactivas |
| 5 | CTA y pie | `.foot`, `#contacto` | Pantalla completa, contacto y navegación |
| 6 | Glosario | `.essay` | Cierre final sobre mirar y co-diseñar |

La navegación es interna mediante anclas. No existen rutas de contenido ni
páginas interiores verificadas.

Un índice fijo en el lateral derecho representa las seis etapas del recorrido,
destaca en tiempo real la sección visible y permite navegar directamente a cada
una. Permanece oculto durante la apertura WebGL y aparece al ingresar en
Presentación. Sobre la sección Contacto cambia a blanco puro. En mobile conserva
números y marcadores en una variante compacta.

## 2. Apertura WebGL

`#webgl-container` permanece fijo sobre `.hero-stage` durante el primer tramo
del scroll. `js/webgl-effect.js` contiene:

- La textura dinámica de la estela.
- Los shaders de máscara, grano y distorsión.
- El SVG del logotipo utilizado como máscara interna.
- El zoom exponencial asociado al scroll.
- El ajuste de escala al redimensionar la ventana.
- Ajustes de radio y desenfoque específicos para Chrome.

En el borde inferior del canvas se muestra el indicador sutil “↓ Scroll”, que
se desvanece apenas comienza el desplazamiento.

El desenfoque afecta a `tTrail`, no al SVG. La cabecera se muestra y habilita
cuando termina el zoom. Three.js r128 se carga desde `js/vendor/` antes del
script del efecto. El renderer limita el pixel ratio a 2 en mobile y 2.5 en
desktop, o a 1 con ahorro de datos; se pausa fuera de la apertura o con la
pestaña oculta y ofrece una apertura estática cuando se solicita movimiento
reducido o WebGL falla.
En mobile, el contenedor fijo del canvas se extiende al 110% de la altura de la
pantalla. El 10% inferior utiliza un respaldo blanco cálido para que la interfaz
translúcida de Safari no revele el collage detrás de la barra del navegador.

## 3. Contenido editorial

### 3.1 Presentación

El hero ocupa una pantalla completa sobre fondo marrón. A la izquierda utiliza
`src/misc/blob/hero-orange-blur.svg` como figura desenfocada. El título
“Experimentales, versátiles y locales.” usa Averia Gruesa Libre; el resto de la
interfaz usa Inter.

### 3.2 Nosotros

La sección responde qué es Vuné, quiénes integran el estudio y qué hace. La
columna visual utiliza como imágenes definitivas los recortes actuales del
collage, sin texto superpuesto.
El collage se sirve mediante variantes responsive AVIF, WebP y JPG.

### 3.3 Servicios

La composición contiene cinco tarjetas importadas del diseño de Figma:

1. Webs y experiencias digitales.
2. Identidad y dirección visual de marcas.
3. Estrategia y contenido.
4. Producción audiovisual.
5. Eventos y experiencias.

Cada tarjeta posee color, rotación y pin propios. Las interacciones duran
300 ms, responden al puntero y al foco de teclado y revelan “Saber más”. En
dispositivos táctiles el enlace permanece visible; con
`prefers-reduced-motion` se eliminan las transiciones.
Los cinco enlaces “Saber más” abren en una pestaña nueva el contacto de
WhatsApp con el mensaje de consulta de servicios indicado por el estudio.

En pantallas de hasta 680 px, las tarjetas se presentan en un recorrido
horizontal táctil con encastre entre elementos.

Los cinco pines se cargan desde `src/misc/cards/Card1.png` a
`src/misc/cards/Card5.png`. La imagen de la Card 1 se ubica ligeramente a la
izquierda del centro y apoyada sobre el borde superior según la referencia
visual vigente.
La imagen de la Card 2 conserva su alineación horizontal y se apoya más abajo
sobre el borde superior según su referencia visual.
La imagen de la Card 3 se presenta centrada, con una escala mayor y ligeramente
más abajo sobre el borde superior según su referencia visual.
La imagen de la Card 4 se presenta en vertical, con una escala mayor y más abajo
sobre el borde superior según su referencia visual.
La imagen de la Card 5 utiliza una escala mayor y conserva su centro visual.

### 3.4 Glosario, contacto y cierre

El CTA está integrado en `.foot`, que ocupa como mínimo una pantalla completa, tiene
esquinas superiores redondeadas y reúne invitación, contacto, logotipo,
navegación y copyright. `.essay` aparece a continuación y cierra el documento
con los conceptos “Mirar” y “Co-diseño”.
El contacto visible conserva correo, WhatsApp y ubicación; no incluye iconos de
Instagram o LinkedIn ni el usuario social.

El teléfono, su destino de WhatsApp, los mensajes predefinidos, la ubicación y
la definición institucional fueron confirmados por el estudio.
El destino y el mensaje predefinido del botón principal “Agendemos una charla”
fueron indicados por el estudio.
La fotografía del glosario se carga de forma diferida al acercarse al viewport
y selecciona una variante AVIF, WebP o JPG según soporte y ancho de pantalla.

## 4. Navegación e interacción

- La cabecera enlaza a Inicio y Contacto; Nosotros permanece accesible desde el
  índice lateral.
- Mientras la cabecera está oculta queda fuera del orden de tabulación y del
  árbol accesible; movimiento reducido y fallback estático la habilitan desde
  el inicio.
- El logotipo enlaza a `index.html`.
- `js/page-interactions.js` controla reveal y cards.
- `js/page-interactions.js` actualiza el estado activo del índice lateral.
- El scroll suave se define en CSS.
- El overscroll vertical se contiene en la raíz para evitar el rebote externo
  sin interferir con el desplazamiento normal en Chrome.
- No hay menú burger implementado en el HTML vigente.

## 5. Estilos

- `css/scroll.css`: sistema visual y estilos generales.
- `css/index.css`: cabecera vigente, WebGL y tarjetas.

## 6. Pendientes

- Habilitar Vercel Web Analytics desde el panel y volver a desplegar.
- Publicar y validar el contenedor Google Tag Manager `GTM-MQQSHQZM` y sus
  etiquetas desde Vista previa y Tiempo real.
- Revisar Safari, Chrome, Firefox y dispositivos móviles reales.
- Repetir Lighthouse y los controles de producción después del próximo deploy.
