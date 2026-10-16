# Clinisport Barcelona · Demo Astro

HOME responsive de seis diapositivas, en castellano, català e inglés. HTML en componentes `.astro`, CSS y JavaScript independientes. Proyecto local, sin publicar.

## 1. Ejecutar este proyecto (recomendado)

Instala Node.js 24 LTS (o una versión compatible con Astro, mínimo 22.12; evita versiones impares). Descomprime el ZIP y abre la carpeta `clinisport-astro` en VS Code. Abre una terminal dentro de ella:

```bash
npm install
npm run dev
```

Visita la dirección que muestra la terminal, normalmente http://localhost:4321/es/.

- Castellano: http://localhost:4321/es/
- Català: http://localhost:4321/ca/
- English: http://localhost:4321/en/
- La raíz `/` muestra castellano.

Para comprobar desde un móvil conectado a la misma red:

```bash
npm run dev -- --host 0.0.0.0
```

Abre en el móvil la dirección de red que indique Astro; puede ser necesario permitir Node en el firewall de tu equipo.

## 2. Si prefieres crear la carpeta desde cero

En una carpeta de trabajo, ejecuta:

```bash
npm create astro@latest clinisport-barcelona -- --template minimal
cd clinisport-barcelona
```

Elige instalar dependencias. Copia desde este paquete `src/`, `public/`, `package.json`, `package-lock.json`, `astro.config.mjs` y `tsconfig.json` a la carpeta nueva, sustituyendo los archivos iniciales. Quita cualquier `src/pages/index.astro` inicial antes de copiar para usar el incluido. Después:

```bash
npm install
npm run dev
```

No necesitas crear un proyecto vacío si has elegido el método 1.

## Archivos principales

| Archivo | Qué modificar |
| --- | --- |
| `src/pages/[lang]/index.astro` | HTML de las seis secciones, estructura y CTA |
| `src/pages/index.astro` | Entrada en castellano desde `/` |
| `src/data/content.js` | Todos los textos ES, CA, EN y textos accesibles |
| `src/styles/global.css` | Colores, fuentes, overlays, tamaños y responsive |
| `src/scripts/navigation.js` | Scroll, teclado, menú, idiomas y diálogo |
| `src/components/Header.astro` | Logo, menú y selector de idioma |
| `src/components/SlideNavigation.astro` | Rail derecho y controles anterior/siguiente |
| `src/components/FullScreenSection.astro` | Contenedor reutilizable de sección |
| `src/components/Brand.astro` | Símbolo original raster y nombre de marca en HTML |
| `src/layouts/BaseLayout.astro` | Documento HTML, fuentes locales y metadatos |
| `public/images/` | Fotografías incluidas |
| `dist/` | HTML, CSS, JS y recursos compilados, listos para hosting estático |

Las fuentes Manrope e Inter se instalan mediante Fontsource y se sirven desde el propio proyecto, sin llamadas a Google Fonts durante la visita. El logotipo recibido tiene resolución baja; para el resultado final sustituye el tratamiento de marca por el archivo oficial SVG o PNG transparente de alta resolución. El retrato de Bruno se integra con una máscara y filtro CSS/SVG: para un recorte más preciso, sustituye `bruno.png` por un PNG transparente y elimina `filter` de `.hero-portrait > img`.

## Comportamiento

- Pantallas de al menos 901px de ancho y 651px de alto con puntero fino: cada gesto de rueda avanza una sección; se filtra la inercia del trackpad. Se puede cambiar desde la cabecera, rail o CTA.
- Tablet, móvil y pantallas bajas: scroll nativo con encaje por proximidad, sin capturar los gestos táctiles. Las secciones crecen si necesitan espacio, usando `min-height: 100svh`.
- Si el contenido de una sección supera la altura visible, se conserva scroll nativo, también en escritorio.
- Teclado: Tab para enlaces; flechas verticales, PageUp/PageDown, Home/End y espacio cuando el foco está en una sección. Escape cierra el menú o diálogo.
- El selector ES/CA/EN conserva el identificador de la sección actual.
- Los botones de valoración abren un diálogo de contacto con teléfono. No hay formulario, API, agenda, envío ni almacenamiento de datos. Sin JavaScript los botones llaman al teléfono directamente.
- Las fotografías, dirección y teléfono proceden de los materiales aportados. Confirmar los datos con el centro antes de publicar.
- Se respeta `prefers-reduced-motion`. Si JavaScript está desactivado las secciones, anclas y selector de idioma siguen funcionando.

## Ajustes rápidos de estilo

Al principio de `src/styles/global.css`:

```css
:root {
  --green: #061f1a;
  --green-light: #123d36;
  --orange: #e8793e;
  --ivory: #faf9f6;
  --rail: 76px;
  --header: 100px;
}
```

Los degradados están en `.slide-shade` y `.slide--right .slide-shade`. Los encuadres están en `object-position`, con ajustes específicos en móvil.

## Compilar

```bash
npm run build
npm run preview
```

Tras modificar el código, vuelve a compilar. `dist/` se puede subir a un hosting estático. Para publicarlo bajo una subcarpeta es necesario adaptar `base` y las rutas absolutas; este paquete está preparado para la raíz del dominio.

## Antes de la web definitiva

Esta demo lleva `noindex, nofollow` para evitar su indexación. Al publicar el proyecto aprobado, configurar dominio real, canonical, hreflang y sitemap, retirar noindex y revisar contenidos con el centro. No se han inventado páginas legales, reseñas ni credenciales. No incluye analítica ni cookies de seguimiento.

## Validación de esta entrega

Compilación Astro y comprobación de sintaxis JavaScript. Revisiones estáticas de las cuatro rutas, seis secciones por idioma y recursos referenciados. No se ha realizado una prueba visual interactiva en navegador en este entorno: comprobar encuadres y scroll con tus dispositivos antes de presentar.

Documentación: https://docs.astro.build/en/install-and-setup/
