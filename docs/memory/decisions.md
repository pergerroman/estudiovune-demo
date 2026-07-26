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

## Apertura WebGL

- Fecha: 2026-07-26.
- Estado: aceptada en la implementación.
- Decisión: usar el collage como fondo y una máscara WebGL del logotipo con
  estela de puntero y zoom por scroll.
- Consecuencia: Three.js r128 es una dependencia de ejecución.

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

## Assets de las tarjetas

- Fecha: 2026-07-26.
- Estado: aceptada.
- Decisión: cargar los cinco pines desde `src/misc/cards/Card1.png` a
  `src/misc/cards/Card5.png`.
- Consecuencia: `index.html` ya no contiene las imágenes de las tarjetas como
  data URI.

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

## Archivo fuera de esta versión

- Fecha: 2026-07-26.
- Estado: aceptada.
- Decisión: retirar la sección Registros/Archivo y sus accesos de navegación.
- Consecuencia: se eliminan `#registros`, `.archive`, `.window` y sus estilos
  asociados.
