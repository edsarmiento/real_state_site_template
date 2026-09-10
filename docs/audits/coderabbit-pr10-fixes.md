# Revisión local de CodeRabbit — PR #10

Base revisada: `e6343fc0bc65ddddc0589718d271f133c4ed2508` (`feat/dark-theme`).

23 hilos vigentes y sin resolver: 21 atendidos, 1 descartado y 1 pendiente externo. La revisión inicial se realizó localmente antes de autorizar el commit y push.

| # | Comentario de CodeRabbit | Resultado |
|---|---|---|
| 1 | Sustituye la ruta local por una referencia genérica al archivo de diseño. — `docs/dark-theme-agent-prompt.txt` | Corregido. |
| 2 | Declare `puppeteer-core` como dependencia de desarrollo. — `scripts/smoke-dark-visual.mjs` | Corregido. |
| 3 | `emptyOk` no se usa y puede abortar el smoke con `ReferenceError`. — `scripts/smoke-dark-visual.mjs` | Corregido. |
| 4 | Escriba el informe también cuando el smoke falla. — `scripts/smoke-dark-visual.mjs` | Corregido. |
| 5 | Revierte este cambio en `src/app/page.tsx`. — `src/app/page.tsx` | Descartado: revertir concatena «disponiblesen Ciudad». El cambio existente corrige el espacio y no introduce lógica del tema en la ruta; se conserva. |
| 6 | `settle` puede reintentar sin límite y dejar la sincronización de scroll desactivada. — `src/components/listing-photo-gallery-strip.tsx` | Corregido. |
| 7 | Cada imagen cargada reposiciona el strip y puede interrumpir el desplazamiento manual. — `src/components/listing-photo-gallery-strip.tsx` | Corregido. |
| 8 | Tipar `portalSiteTheme` con `SiteThemeName`. — `src/components/listing-photo-gallery.tsx` | Corregido. |
| 9 | Considere mover el chrome del lightbox al diccionario. — `src/lib/listing-gallery-strip.ts` | Corregido. |
| 10 | Usar un efecto seguro para SSR — `src/themes/dark/dark-catalog-hash-scroll.tsx` | Aplicado por coherencia con Orange; la advertencia descrita depende de la versión de React, no se afirma haberla reproducido. |
| 11 | Revalide el hash y cancele el frame pendiente en `onHashChange`. — `src/themes/dark/dark-catalog-hash-scroll.tsx` | Corregido. |
| 12 | Mueve la carga de ubicaciones fuera de `DarkCatalog`. — `src/themes/dark/dark-catalog.tsx` | Corregido. |
| 13 | Componga el mensaje vacío con una plantilla localizada. — `src/themes/dark/dark-catalog.tsx` | Corregido. |
| 14 | Sincroniza `hash` tras la navegación cliente de `next/link`. — `src/themes/dark/dark-header-nav.tsx` | Corregido. |
| 15 | Reutilice `specIcon` en el detalle para eliminar la duplicación de iconos por spec. — `src/themes/dark/dark-listing-card.tsx` | Corregido. |
| 16 | El `aria-label` del enlace oculta el precio y la ubicación a los lectores de pantalla. — `src/themes/dark/dark-listing-card.tsx` | Corregido. |
| 17 | Anuncie que el enlace del mapa abre una pestaña nueva. — `src/themes/dark/dark-listing-detail.tsx` | Corregido. |
| 18 | La validación de tarjetas no cubre los campos obligatorios que el tema renderiza. — `src/themes/dark/dark-listings.ts` | Corregido. |
| 19 | Protege `result.data` y gestiona los abortos. — `src/themes/dark/dark-location-listings.ts` | Corregido. |
| 20 | Alinea la semántica ARIA con el comportamiento real del panel. — `src/themes/dark/dark-mobile-nav.tsx` | Corregido. |
| 21 | Anuncie la nueva pestaña en el enlace de agenda. — `src/themes/dark/dark-sections.tsx` | Corregido. |
| 22 | Usa `--dark-gold` o declara `--dark-accent` en el tema oscuro. — `src/themes/dark/dark-theme.css` | Corregido. |
| 23 | Coordine `"dark"` en API y Ops para las cuentas nuevas. — `src/themes/theme-definitions.ts` | Pendiente externo: API y Ops no están en este checkout. Verificar SiteConfig::LAYOUT_KEYS, selector de Ops y specs antes de habilitar nuevas cuentas. Se conserva el fallback para claves desconocidas. |

## Decisiones y validación

- La carga de ubicaciones se resuelve en el adaptador del registro, también para páginas sin filtros: no depende de los resultados paginados. Una API vacía o abortada deja las ubicaciones vacías; errores inesperados siguen propagándose.
- Galería: destino limitado al ancho desplazable, máximo de reintentos y recuperación de sincronización al interrumpir el scroll; carga de fotos inactivas no realinea la galería.
- Se añadió `npm test` con resolución del alias TypeScript para ejecutar la suite existente con Node 25.3.0. El hook requiere una versión de Node compatible con `registerHooks` y TypeScript nativo.
- Para permitir TypeScript/build: `allowImportingTsExtensions` y eliminación de IDs ajenos al contrato en fixtures de pruebas existentes.
- `npm test`: 183 pruebas correctas, ninguna fallida.
- `npm run lint`: correcto.
- `npx tsc --noEmit`: correcto.
- `ACCOUNT_ID=1 API_URL=http://127.0.0.1:9 npm run build`: correcto, con configuración sintética y sin API real. La ejecución sin ACCOUNT_ID falla por la configuración obligatoria del deploy.
- No se ejecutó el smoke visual completo: requiere una API con el tema Dark y anuncios/fotos configurados.
- El repositorio hermano con BUSINESS_RULES.md no está disponible. No se modificaron contratos de dominio.

Las correcciones se agrupan en un único commit para el PR #10.
