# Vuné — Estudio creativo patagónico

Landing interactiva de una página para presentar el estudio Vuné, sus servicios,
su archivo y sus canales de contacto.

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

### 2026-07-26

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
  `src/misc/Card1.png` a `src/misc/Card5.png`.
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
