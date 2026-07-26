# Estado actual

Última revisión: 2026-07-26.

## Implementación vigente

- `index.html` es la entrada única.
- La apertura WebGL y la landing editorial están integradas.
- CSS y JavaScript propios están separados por responsabilidad.
- La cabecera aparece cuando finaliza el zoom.
- Las cards de servicios incluyen estilos, pines e interacción de Figma.
- El CTA está integrado en un footer verde de pantalla completa con radios
  superiores, contacto, marca y navegación.
- El favicon y el logotipo externo usan assets existentes.
- El recorrido incluye un índice lateral de capítulos, progreso activo y
  cursor contextual en escritorio.
- Q&A utiliza una composición fotográfica con profundidad; servicios y ensayo
  incorporan textura y movimiento editorial.
- El canvas deja de renderizar cuando la apertura ya no es visible y la
  interfaz conserva un fallback si WebGL no inicia.
- La documentación general está consolidada en `README.md`.

## Validaciones realizadas

- Sintaxis de `js/webgl-effect.js`.
- Sintaxis de `js/page-interactions.js`.
- Ausencia de CSS y JavaScript propios inline.
- Existencia de los recursos locales vinculados.
- Ausencia de referencias documentales a `effect.html` como archivo activo.
- Balance de llaves de las dos hojas CSS.
- Anclas internas únicas y vinculadas a secciones existentes.
- Ausencia de errores de whitespace mediante `git diff --check`.

La revisión visual automatizada no estuvo disponible porque la sesión no
contaba con un navegador conectado. El servidor local tampoco pudo abrir un
puerto dentro del sandbox.

## Pendientes

1. Validar textos y datos de contacto, incluido el teléfono tomado de Figma.
2. Confirmar que `_DSC5885 1.jpg` sea la fotografía definitiva para Q&A.
3. Revisar manualmente Safari, Chrome y Firefox en escritorio y móvil.
4. Confirmar si `css/style.css` puede eliminarse.

## Deuda técnica

- `css/style.css` no está vinculada y conserva una implementación histórica.
- No existen build, lint ni tests automatizados.
- Three.js depende de un CDN externo.

## Cambios externos preservados

El árbol de trabajo contiene eliminaciones y archivos no registrados ajenos a
esta normalización. No deben revertirse sin indicación expresa.
