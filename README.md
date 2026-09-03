# Vuné — Estudio creativo patagónico

Landing interactiva de una página para presentar el estudio Vuné, sus servicios
y sus canales de contacto. Combina una apertura WebGL con un recorrido
editorial long-scroll.

## Tecnologías

- HTML semántico.
- CSS.
- JavaScript.
- Three.js r128 desde `js/vendor/three-r128.min.js`.
- Google Tag Manager mediante el cargador local `js/google-tag-manager.js`.
- Inter y Averia Gruesa Libre desde Google Fonts.

El sitio es estático y no requiere compilación ni dependencias de ejecución.
Node.js 20 o superior se utiliza únicamente para las comprobaciones de
publicación.

## Estructura

- `index.html`: entrada única, contenido y referencias.
- `css/`: estilos propios.
- `js/`: comportamiento e interacción.
- `src/`: imágenes, logos, iconos y recursos gráficos.
- `docs/memory/`: contexto vigente de marca, producto y arquitectura.
- `docs/CHANGELOG.md`: registro cronológico de cambios relevantes.
- `scripts/`: controles locales y de producción.
- `vercel.json` y `_headers`: seguridad, caché e indexación del hosting.

La responsabilidad detallada de los archivos está en
[Arquitectura](docs/memory/architecture.md) y el recorrido de la página en
[Estructura funcional](docs/memory/landing.md).

## Ejecución local

Desde la raíz del repositorio:

```bash
python3 -m http.server 8000
```

Abrir `http://localhost:8000/`. No se recomienda usar `file://`, porque los
recursos y el canvas pueden comportarse de forma diferente.

## Documentación

- [Estado actual](docs/memory/current-state.md): implementación, validaciones y
  pendientes.
- [Estructura funcional](docs/memory/landing.md): recorrido e
  interacciones.
- [Marca](docs/memory/brand.md): identidad, voz y assets.
- [Producto](docs/memory/product.md): propósito, alcance y aceptación.
- [Arquitectura](docs/memory/architecture.md): responsabilidades técnicas.
- [Decisiones](docs/memory/decisions.md): criterios duraderos aceptados.
- [Referencias](docs/memory/references.md): fuentes de diseño y código.
- [Registro de cambios](docs/CHANGELOG.md): historial cronológico consolidado.
- [Publicación](docs/DEPLOYMENT.md): despliegue, dominio, validación y rollback.

## Validación

```bash
npm run check
```

Después de publicar:

```bash
npm run check:production
```

Los controles no requieren instalar paquetes.

## Mantenimiento

- Trabajar exclusivamente con el contexto e identidad de Vuné.
- Verificar textos y datos de contacto antes de publicar.
- Mantener `index.html` como entrada única.
- Mantener CSS y JavaScript propios fuera del HTML.
- Conservar rutas relativas correctas y respetar `prefers-reduced-motion`.
- Actualizar `docs/memory/` cuando cambie una decisión o el estado vigente.
- Registrar cambios relevantes en `docs/CHANGELOG.md`.
- Trabajar únicamente sobre `02.09.0---arreglando-cagadas`, salvo indicación
  explícita.
- Preservar los cambios existentes del usuario.

## Estado del proyecto

La situación vigente, las validaciones y la deuda técnica se mantienen en
[Estado actual](docs/memory/current-state.md).
