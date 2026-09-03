# Publicación del sitio

Procedimiento para publicar la landing estática de Vuné en
`https://www.estudiovune.com/` mediante Vercel.

## Fuente de publicación

- Rama autorizada: `02.09.0---arreglando-cagadas`.
- Entrada del sitio: `index.html`.
- Página de error: `404.html`.
- No se deben fusionar ni copiar cambios de otras ramas sin indicación
  explícita.

## Requisitos previos

1. Usar Node.js 20 o superior.
2. Confirmar que el árbol de trabajo contiene únicamente cambios intencionales.
3. Ejecutar:

```bash
npm run check
```

4. Revisar el sitio servido localmente:

```bash
python3 -m http.server 8000
```

5. Probar desktop, mobile, navegación por teclado y movimiento reducido.

## Configuración de Vercel

- Conectar el repositorio del proyecto.
- Establecer `02.09.0---arreglando-cagadas` como rama de producción.
- Usar la raíz del repositorio como directorio del proyecto.
- Seleccionar un proyecto estático sin framework.
- No configurar comando de build ni directorio de salida personalizado.
- Mantener `vercel.json` como fuente de redirecciones, headers y caché.

`_headers` replica las reglas esenciales para proveedores compatibles; en
Vercel prevalece `vercel.json`.

## Dominio y DNS

La URL canónica es `https://www.estudiovune.com/`.

1. Agregar `estudiovune.com` y `www.estudiovune.com` al proyecto de Vercel.
2. Definir `www.estudiovune.com` como dominio principal.
3. Copiar en el proveedor DNS únicamente los registros indicados por Vercel.
4. Preservar los registros MX, SPF, DKIM y DMARC del correo institucional.
5. Verificar que HTTP y el dominio sin `www` redirijan a la URL canónica por
   HTTPS.

## Publicación

1. Revisar `git diff --check` y `git status`.
2. Crear un commit con todos los archivos de la versión.
3. Subir la rama autorizada al remoto.
4. Revisar el preview de Vercel.
5. Promover el despliegue aprobado a producción.
6. Registrar el commit y la fecha de publicación en `docs/CHANGELOG.md`.

## Verificación posterior

Ejecutar:

```bash
npm run check:production
```

El control verifica:

- portada, URL canónica y correo institucional;
- headers de seguridad y caché;
- CSS y JavaScript activos;
- `og.png`, favicon y Apple Touch Icon;
- `robots.txt` y `sitemap.xml`;
- exclusión de documentación de los buscadores;
- cargador local y política de seguridad de Google Tag Manager;
- página 404 con estado HTTP correcto.

También se debe comprobar manualmente que los previews de Open Graph utilicen
`https://www.estudiovune.com/src/images/social/og.png`.
En Google Tag Manager se debe verificar que el contenedor `GTM-MQQSHQZM` esté
publicado, reciba el evento `gtm.js` y contenga únicamente las etiquetas
aprobadas por el estudio.

## Monitoreo

El workflow `production-monitor.yml` puede ejecutarse manualmente. Para
habilitarlo cada hora, crear en GitHub la variable de repositorio:

```text
PRODUCTION_MONITORING_ENABLED=true
```

Los workflows programados de GitHub se ejecutan desde la rama predeterminada.
Para monitorear esta versión, `02.09.0---arreglando-cagadas` debe ser también la
rama predeterminada del repositorio. Activar la variable únicamente después del
primer despliegue correcto.

## Rollback

1. Identificar el último commit estable.
2. Restaurar ese despliegue desde Vercel o volver a desplegar el commit.
3. No borrar ni reescribir el historial Git.
4. Repetir `npm run check:production`.
5. Corregir el incidente en esta misma rama antes de publicar nuevamente.
