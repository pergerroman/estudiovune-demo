# Vuné — Interpretación de la estructura y funcionamiento de la web

Documento de referencia de cómo estoy interpretando la maqueta (imagen de referencia)
y cómo se traduce en el código de [index.html](index.html) + [css/scroll.css](css/scroll.css).

> **Objetivo del sitio:** landing de una sola página (one-page scroll) para el estudio
> creativo Vuné. El recorrido vertical cuenta quiénes son, qué hacen y cómo trabajar
> juntos, alternando bloques claros (cálidos/cream) con bloques oscuros para dar ritmo.

---

## 1. Mapa general del scroll

El sitio es un **long-scroll de 8 bloques** apilados verticalmente. No hay rutas ni
páginas internas: la navegación es por anclas (`#seccion`) dentro del mismo documento.

| # | Sección | Clase / id | Fondo | Rol narrativo |
|---|---------|-----------|-------|---------------|
| 1 | Collage hero | `.collage` `#top` | Imagen full-bleed | Impacto visual / marca |
| 2 | Hero naranja | `.intro` `#intro` | Degradado coral | Declaración de identidad + CTA |
| 3 | Q&A + imágenes | `.about` `#nosotros` | Oscuro (ink) | Quiénes somos / qué hacemos |
| 4 | Llamanos si necesitás | `.services` `#servicios` | Cream | Servicios (tarjetas post-it) |
| 5 | Ventana Registros | `.archive` `#registros` | Foto blur + parallax | Archivo / portfolio |
| 6 | Miremos tu proyecto | `.cta` `#contacto` | Verde oliva (mint) | Conversión / cierre |
| 7 | Footer | `.foot` | Oscuro (ink) | Contacto + navegación |
| 8 | Mirar / Co-diseño | `.essay` | Foto oscura | Manifiesto / cierre conceptual |

El patrón de contraste es intencional: **claro → oscuro → claro → oscuro**, para que
cada bloque respire y el ojo distinga dónde empieza y termina cada idea.

---

## 2. Bloque por bloque

### 1 · Collage hero
- Pantalla completa (`100vh`) con `Collage fondo.png` a `cover`.
- Degradado inferior que funde la imagen hacia el negro del bloque siguiente, sin corte duro.
- No lleva texto: es puramente atmosférico, la "portada".

### 2 · Hero naranja — *"Experimentales, versátiles y locales."*
- Fondo: degradado radial cálido (naranja → coral → marrón) con un "blob" de luz difusa
  arriba a la izquierda, imitando la textura pintada de la referencia.
- Contenido alineado a la izquierda: **título grande + párrafo manifiesto + botón cyan**.
- El botón *"Miremos juntos tu proyecto"* apunta a `#contacto` (la CTA verde).

### 3 · Sección oscura — Q&A
- Grid de 2 columnas: **texto (izquierda) + imágenes (derecha)**.
- Izquierda: tres bloques con título subrayado y respuesta:
  *¿Qué es Vuné?* · *¿Quiénes somos?* · *¿Qué hacemos?*
- Derecha: tres "shots" apilados. Hoy son recortes del collage (`background-position`);
  están pensados como **placeholders** a reemplazar por fotos reales (workspace, pantallas,
  y la foto "Coffee days" que ya lleva su rótulo).

### 4 · Servicios — *"Llamanos si necesitás"*
- Título centrado en coral.
- **5 tarjetas tipo post-it** en fila, cada una con:
  - un **clip metálico** (pseudo-elemento `::before`),
  - una **rotación leve** distinta y desfase vertical, para el efecto "pegado a mano",
  - color de marca propio: mint · coral · cyan · marrón · rosa.
- La quinta (*Eventos y experiencias*) lleva el **logo de Vuné** en la esquina.
- Al hover la tarjeta se endereza y sube (feedback lúdico).

### 5 · Ventana Registros (archivo)
- Fondo: la imagen del collage con **blur + overlay oscuro + parallax** (`background-attachment: fixed`).
- Encima, un **mockup de ventana macOS**: barra con los 3 "traffic lights", rótulo
  *vuné / archivo*, y cuerpo con el título **Registros** + un **menú de categorías**
  (Registros, Experiencias digitales, Marcas, Videos, Eventos y experiencias, Diseño de
  datos, Desktop) y un *"Ver más"*.
- Representa el portfolio/archivo del estudio como si fuera un explorador de archivos.

### 6 · CTA verde — *"Miremos tu proyecto"*
- Bloque verde oliva, texto invitación + botón oscuro *"Agendemos una charla"* (`mailto:`).
- Es el punto de conversión principal antes del footer.

### 7 · Footer
- Grid de 2 columnas:
  - Izquierda: datos de contacto (`@vune.estudio`, mail, teléfono, ubicación, tagline) + copyright.
  - Derecha: marca **vuné** + navegación (Home, Archivo, Nosotros, Contacto).

### 8 · Mirar / Co-diseño
- Cierre conceptual sobre foto oscurecida: dos definiciones (*Mirar*, *Co-diseño*) que
  explican la filosofía. Funciona como epílogo del scroll.

---

## 3. Funcionamiento / interacciones

Todo el comportamiento vive en un `<script>` al final de [index.html](index.html):

- **Navbar fija con estado `scrolled`:** arranca transparente usando `mix-blend-mode: difference`
  (se lee sobre cualquier fondo); al pasar los 40px de scroll gana fondo oscuro con blur.
- **Menú responsive (burger):** en ≤720px el botón hamburguesa abre un panel lateral
  (`body.nav-open`); al tocar un enlace se cierra.
- **Reveal on scroll:** un `IntersectionObserver` agrega la clase `.in` a los elementos
  `.reveal` cuando entran al viewport (fade + subida). Se respeta `prefers-reduced-motion`.
- **Navegación por anclas:** los enlaces del nav y footer hacen scroll suave (`scroll-behavior: smooth`)
  a cada sección por su `id`.

---

## 4. Sistema de diseño

- **Paleta de marca** (variables CSS en `:root` de [css/scroll.css](css/scroll.css)):
  `--cyan #32c8e1` · `--coral #bc5727` · `--mint #979e6c` · `--brown #5b3321` ·
  `--pink #d99bd0` · `--cream #f6f3ec` · `--ink #16171b`.
- **Tipografía:** Inter (Google Fonts), pesos 700 para títulos, 400/500 para texto.
- **Layout:** contenedor central `.wrap` (máx. 1180px). Espaciados y tipografías con
  `clamp()` para escalar de forma fluida entre mobile y desktop.
- **Formas:** bordes redondeados generosos, sombras suaves, blobs y rotaciones para el
  tono "descontracturado" de la marca.

---

## 5. Estado actual y pendientes

**Hecho:** estructura completa de las 8 secciones, estilos, responsive e interacciones.

**Placeholders a reemplazar por assets reales** (hoy se resuelven con recortes del
`Collage fondo.png`):
- Fotos de la sección 3 (workspace, pantallas, "Coffee days").
- Fondo real de la ventana de Registros (sección 5).
- Imagen de fondo de Mirar / Co-diseño (sección 8).
- Si el collage superior debía ser el **hero WebGL interactivo** (versión anterior,
  guardada en git commit `db24445`), habría que decidir si se integra aquí o se mantiene
  el collage estático.

**Supuestos que conviene confirmar:**
- Textos transcritos desde la imagen: algunos párrafos se completaron donde la referencia
  no era 100% legible.
- Datos de contacto (`hola@vune.com`, `+54 299 421 5593`, `@vune.estudio`) tomados de la
  maqueta; validar que sean los definitivos.
- El sitio es one-page; "Archivo/Registros" hoy es una sección, no una página aparte.
