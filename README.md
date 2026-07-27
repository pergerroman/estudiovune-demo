# Vuné — Estudio creativo patagónico

Landing interactiva de una página para presentar el estudio Vuné, sus servicios
y sus canales de contacto.

El proyecto combina una experiencia inicial WebGL con un recorrido editorial
long-scroll. Está construido como un sitio estático, sin proceso de compilación
ni dependencias locales.

## Tecnologías

- HTML semántico.
- CSS.
- JavaScript.
- WebGL mediante Three.js r128, cargado desde CDN.
- Tipografías Inter y Averia Gruesa Libre, cargadas desde Google Fonts.

## Estructura

`index.html` es la entrada única. Los estilos propios viven en `css/`, los
scripts en `js/` y los recursos visuales en `src/`, separados entre imágenes,
logos y elementos gráficos auxiliares.

La responsabilidad de cada archivo y el orden de carga se documentan en
[Arquitectura](docs/memory/architecture.md). El recorrido y funcionamiento de
la página se describen exclusivamente en
[Estructura funcional](ESTRUCTURA-land.md).

## Ejecución local

No hay comandos de build, lint o tests configurados. Para servir el sitio
localmente desde la raíz:

```bash
python3 -m http.server 8000
```

Después se puede abrir `http://localhost:8000/`.

No se recomienda abrir `index.html` directamente con `file://`, porque el
comportamiento de recursos y canvas puede diferir entre navegadores.

## Documentación del proyecto

- [Estructura funcional](ESTRUCTURA-land.md)
- [Marca](docs/memory/brand.md)
- [Producto](docs/memory/product.md)
- [Arquitectura](docs/memory/architecture.md)
- [Decisiones](docs/memory/decisions.md)
- [Estado actual](docs/memory/current-state.md)
- [Referencias](docs/memory/references.md)

## Criterios de mantenimiento

- Trabajar exclusivamente con el contexto e identidad del estudio Vuné.
- Verificar textos y datos de contacto antes de publicar.
- No trasladar criterios ni recursos de otras marcas.
- Mantener estilos y scripts propios fuera del HTML.
- Conservar rutas relativas a los recursos.
- Respetar `prefers-reduced-motion`.
- Preservar los cambios existentes del usuario.
- Registrar aquí las modificaciones relevantes y actualizar `docs/memory/`
  cuando cambie una decisión duradera.

## Registro de trabajo

### 2026-07-27

- Se retiró el texto superpuesto “Coffee days” de la imagen en la sección Q&A,
  junto con el degradado y los estilos usados exclusivamente para sostenerlo.
- Se actualizaron todos los fondos activos para usar la versión JPG ubicada en
  `src/img/bg/Collage.jpg`; la variante PNG queda disponible sin vincular.
- Se retiró el enlace “Nosotros” de la navegación superior; la sección conserva
  su acceso desde el índice lateral.
- Se agregó un respaldo blanco cálido en el 10% inferior del contenedor WebGL
  mobile y se declaró `theme-color` para evitar que la barra translúcida de
  Safari muestre el collage durante la apertura.
- Se amplió aproximadamente un 10% la imagen de la Card 5, conservando su
  centro visual.
- Se amplió la imagen del clip de la Card 4 y se desplazó hacia abajo sobre el
  borde superior, manteniendo su eje horizontal.
- Se amplió aproximadamente un 10% la imagen de la Card 3 y se desplazó
  ligeramente hacia abajo, conservando su alineación central.
- Se bajó nuevamente la imagen del pin de la Card 2 para igualar la posición de
  la referencia visual entregada.
- Se ajustó la escala y la posición de la imagen de la Card 1 para apoyarla
  sobre el borde superior según la referencia visual entregada.
- Se retiraron del footer los iconos de Instagram y LinkedIn junto con el
  usuario `@vune.estudio`.
- Se agregó un índice interactivo fijo en el lateral derecho, con seis accesos
  al recorrido y actualización en tiempo real de la sección visible.
- Se incorporó una variante compacta del índice para pantallas mobile y se
  respetó `prefers-reduced-motion`.
- Se ocultó el índice durante la apertura WebGL para que aparezca recién al
  ingresar en la sección Presentación.
- Se configuró el índice lateral en blanco puro mientras la sección Contacto
  está activa.
- Se vincularon los cinco enlaces “Saber más” de las cards de servicios al
  contacto de WhatsApp indicado, con apertura en una pestaña nueva.

### 2026-07-26

- Se incorporó un fondo micropunteado marrón sobre base crema en la sección de
  servicios, generado con CSS y ajustado al 15% de opacidad.
- Se reemplazó el apilado vertical de las cards de servicios en mobile por un
  recorrido horizontal táctil con encastre entre tarjetas.
- Se extendió al 110% de la altura de la pantalla el fondo del contenedor del
  canvas WebGL en la versión mobile.
- Se vinculó el botón “Agendemos una charla” del footer al contacto de WhatsApp
  con el mensaje de consulta indicado y validado por el estudio.
- Se dividió `src/misc/` en `cards/` para los pines y `blob/` para la figura
  orgánica del hero.
- Se convirtió el hero de presentación en una pantalla completa marrón, se
  incorporó `src/misc/blob/hero-orange-blur.svg` y se cambió a blanco el texto del
  botón celeste.
- Se retiró la sección Registros/Archivo de esta versión, junto con sus enlaces
  de navegación y estilos exclusivos.
- Se reemplazó el fondo de `section.essay` por
  `src/img/bg/_DSC5866 1.jpg`.
- Se configuró `section.essay` con una altura mínima de pantalla completa.
- Se actualizó el footer según el nodo Figma `140:1291`, incorporando el título
  principal, iconos sociales y la franja inferior de copyright.
- Se normalizaron sus medidas con los tokens, el contenedor, la escala
  tipográfica y el ritmo responsive del resto de la landing.
- Se agregó un tema claro automático para la navegación cuando la cabecera
  atraviesa la sección oscura de Q&A.
- Se configuró Live Server para ignorar Markdown, metadatos de Finder y `.git`,
  con un debounce de 500 ms para evitar recargas ajenas al sitio.
- Se aplicó Averia Gruesa Libre a todos los títulos `<h2>` del landing.
- Se ubicó `section.essay` debajo del footer como cierre final del recorrido.
- Se actualizaron las rutas después de reorganizar los assets en `src/img/`,
  `src/logos/` y `src/misc/`.
- Se reemplazó el favicon PNG anterior por `src/logos/v-fav.svg` y se
  actualizaron los usos del logotipo a `src/logos/vuné-logo.svg`.
- Se reemplazaron las cinco imágenes embebidas de las cards por los archivos
  `src/misc/cards/Card1.png` a `src/misc/cards/Card5.png`.
- Se implementaron los siete nodos de Figma del cierre y se integró el CTA
  dentro de un footer verde de pantalla completa con esquinas superiores
  redondeadas.
- Se normalizaron los márgenes, espaciados y escalas tipográficas del footer con
  el sistema fluido utilizado por el resto de la landing.
- Se incorporó el teléfono corregido y su enlace de WhatsApp desde Figma.
- Se revisaron, jerarquizaron y corrigieron todos los archivos Markdown contra
  la implementación vigente de `index.html`.
- Se consolidó la referencia básica de `landing.md` dentro de
  `ESTRUCTURA-land.md` y se eliminó el documento redundante.
- Se actualizó `ESTRUCTURA-land.md` para documentar la apertura WebGL integrada, el
  recorrido real, las interacciones y los pendientes.
- Se reorganizó `docs/memory/` por marca, producto, arquitectura, decisiones,
  estado, landing y referencias.
- Se retiraron referencias activas a `effect.html` y a documentos eliminados de
  `proyect/`.
- Se consolidaron los dos README del repositorio en este documento.
- Se organizó `index.html` para contener únicamente estructura y referencias.
- Se extrajeron los estilos inline a `css/index.css`, manteniendo
  `css/scroll.css` como hoja general.
- Se separó el JavaScript en `js/webgl-effect.js` y
  `js/page-interactions.js`.
- Se corrigieron las rutas relativas de imágenes después de mover el CSS.
- Se corrigieron los enlaces de inicio que todavía apuntaban a `effect.html`.
- Se restauró `lang="es"` en el documento principal.
- Se incorporó el contenido visual de la landing al recorrido posterior al
  efecto WebGL.
- Se configuró el logotipo externo, el favicon y la navegación por anclas.
- Se ajustó el efecto del canvas para que el desenfoque afecte a la estela del
  puntero y no al SVG.
- Se añadieron ajustes específicos para la representación del rastro en Chrome.
- Se implementaron las tarjetas de servicios diseñadas en Figma, con su paleta
  complementaria, pines y movimientos de 300 ms.
- Se añadió aparición por disolución de “Saber más”, soporte de foco y
  tratamiento para dispositivos táctiles y movimiento reducido.
- Se actualizó la memoria de marca con colores, assets y rutas vigentes.
- Se verificó la sintaxis de los scripts y la existencia de los recursos locales
  vinculados. La comprobación visual automatizada no estuvo disponible en la
  sesión.

## Estado del proyecto

Los pendientes, validaciones y deuda técnica se mantienen únicamente en
[Estado actual](docs/memory/current-state.md).
