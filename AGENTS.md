# White-label site template — guía para agentes

Next.js para **un sitio por inmobiliaria**: catálogo público + admin lite en el mismo dominio. API compartida en [`../real_state_api/`](../real_state_api/).

## Reglas

- Lee [`../real_state_api/BUSINESS_RULES.md`](../real_state_api/BUSINESS_RULES.md) §6b (anuncios) y §SiteConfig (white-label).
- **No** reimplementar dominio en el front: usar respuestas del API.
- **`ACCOUNT_ID`** es server-only; scope fijo del deploy (no selector de workspace).
- El BFF añade `account_id` a `/api/public/*` y `X-Account-Id` a `/api/v1/*`.
- **No** filtrar listings en el cliente por cuenta; el scope es en servidor.
- Mantener plantilla **genérica**: sin nombres de clientes, ciudades ni copy exclusivo en código compartido. El texto de marca viene de `SiteConfig.branding` (o env fallback).

## Qué incluye / qué no

| Incluye | No incluye |
|---------|------------|
| Catálogo `/` | CRM completo (contratos, cobros, dashboard) |
| Ficha `/inmueble/[slug]` | Marketplace multi-inmobiliaria |
| Login `/login` | Ops / multi-workspace |
| `/listings` CRUD + fotos (reordenar portada) | Sidebar CRM |
| `/listings/inquiries` | Portales inquilino / propietario |
| `/properties` listado, ficha, editar | Gastos / propietarios CRM |
| `/properties/[id]/units` crear y editar | |
| `/account` mínimo | Resolución dominio→tenant (v1: env por deploy) |
| Formulario + WhatsApp | |

## Arquitectura

### Modelo de deploy

```
┌─────────────────────────────────────────────────────────────┐
│  Vercel: 1 proyecto por inmobiliaria (mismo repo, distinto env) │
│  ACCOUNT_ID + API_URL + dominio del cliente                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  real_state_site_template (Next.js App Router)              │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Catálogo    │  │ Admin lite   │  │ BFF (Route       │  │
│  │ público     │  │ /listings…   │  │ Handlers)        │  │
│  └──────┬──────┘  └──────┬───────┘  └────────┬─────────┘  │
│         │                │                    │            │
│         └────────────────┴────────────────────┘            │
│                          │                                  │
└──────────────────────────┼──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  real_state_api (Rails, instancia compartida en Railway)    │
│  /api/public/*  +  /api/v1/*  +  SiteConfig por Account   │
└─────────────────────────────────────────────────────────────┘
```

- **Un tenant por deploy:** no hay selector de workspace en UI; `ACCOUNT_ID` fija el scope en servidor.
- **Sin Ops ni marketplace:** la configuración de marca la hace Ops en otro app (`real_state_frontend`); este repo solo la consume.
- **Dominio → tenant (v1):** manual — cada cliente tiene su proyecto Vercel con su `ACCOUNT_ID`. No hay resolución dinámica multi-tenant en un solo deploy.

### Capas de la app

| Capa | Rol | Ejemplos |
|------|-----|----------|
| **`src/app/`** | Rutas, metadata, composición | `page.tsx`, `layout.tsx`, `app/api/**/route.ts` |
| **`src/components/`** | UI reutilizable | `listing-form`, `site-header`, `layouts/*`, `ui/*` |
| **`src/lib/`** | Lógica sin JSX: fetch, auth, tipos, labels | `public-api-fetch`, `api-proxy`, `*-types.ts`, `*-labels.ts` |
| **`src/proxy.ts`** | Middleware: auth en rutas admin y `/api/v1` | Redirige a `/login` si no hay JWT válido |

**Flujo de datos:**

1. **Catálogo público (SSR):** `page.tsx` → `publicApiFetch` / `getResolvedSiteConfig` → Rails API (con `account_id` inyectado).
2. **Admin (cliente):** formulario → `fetch("/api/v1/...")` → BFF → Rails con JWT + `X-Account-Id`.
3. **Login:** `POST /api/auth/login` → cookie JWT → middleware valida membership del workspace fijo.

### BFF (Backend-for-Frontend)

| Prefijo | Auth | Scope | Helper |
|---------|------|-------|--------|
| `/api/public/*` | Ninguna | `account_id` query param | `publicApiFetch`, `scopedPublicPath` |
| `/api/v1/*` | JWT cookie + `X-Account-Id` | `ACCOUNT_ID` del env | `proxyToApi`, `getBearerAuthHeaders` |
| `/api/auth/*` | Público (login/logout) | — | handlers en `app/api/auth/` |

Reglas del BFF:

- Rutas **delgadas:** delegar en `proxyToApi` / `readJsonBody`; no duplicar reglas de negocio.
- El browser **no** llama al Rails directamente en producción; siempre pasa por el BFF o SSR server-side.
- Respuestas del API se reenvían tal cual (`proxyResponse`); errores con `message` / `errors` del Rails.

### Auth y rutas protegidas

- Cookie `AUTH_COOKIE` (JWT). Workspace header fijo: `X-Account-Id` = `ACCOUNT_ID`.
- `proxy.ts`: catálogo público (`/`, `/inmueble/*`) y `/api/public/*` sin login; `/listings`, `/properties`, `/account`, `/api/v1/*` requieren staff del workspace.
- Layout admin: `requireStaffAccess()` en `app/(admin)/layout.tsx`.
- Usuarios de otros workspaces o portales → `?auth=no_access`.

### Relación con el monorepo

| Repo | Rol respecto al template |
|------|--------------------------|
| `real_state_api` | Fuente de verdad (listings, inquiries, SiteConfig, auth) |
| `real_state_frontend` | CRM + Ops (edita SiteConfig; no comparte deploy) |
| `real_state_site_template` | Runtime white-label por cliente |

Al cambiar contratos API, actualizar tipos en `src/lib/*-types.ts` y specs en el API — no inventar campos en el front.

## Configuración del sitio (SiteConfig)

Cada deploy = un `ACCOUNT_ID`. La marca y el layout viven en el API (`SiteConfig`, 1:1 con `Account`), editables desde Ops (`/ops/accounts/:id/site` en `real_state_frontend`).

```
Ops guarda SiteConfig (API)
        ↓
GET /api/public/site_config?account_id=
        ↓
getResolvedSiteConfig()  ← merge con env (fallback)
        ↓
Server Components (header, footer, catálogo, metadata, login/admin props)
```

| Fuente | Cuándo |
|--------|--------|
| **API** (`SiteConfig`) | Hay registro; prioridad sobre env |
| **Env** (`NEXT_PUBLIC_SITE_*`, `NEXT_PUBLIC_PRIMARY_COLOR`) | Sin registro, fetch fallido, o campos vacíos en `branding` |
| **Deploy** (`ACCOUNT_ID`, `API_URL`) | Siempre por proyecto Vercel; no viene del API |

**Política de deploy:** guardar `SiteConfig` en Ops antes de desplegar. En Vercel solo `ACCOUNT_ID` + `API_URL`; no duplicar marca en env.

**Campos relevantes:** `layout_key`, `public_url` (origen para metadata, WhatsApp, links), `branding` (`site_name`, `tagline`, `logo_url`, `primary_color`, `show_powered_by`).

**Sin redeploy** al cambiar marca/layout/dominio en Ops. **Sí redeploy** si cambia `ACCOUNT_ID` o `API_URL`.

## Archivos clave

| Área | Ubicación |
|------|-----------|
| Tipos SiteConfig | `src/lib/site-config-types.ts` |
| Resolver API + env | `src/lib/resolved-site-config.ts` |
| Solo env / `ACCOUNT_ID` | `src/lib/site-config-env.ts` |
| Props de marca (client) | `src/lib/site-branding.ts` → `pickSiteBranding()` |
| CSS `--site-primary` | `src/components/site-branding-styles.tsx` (en `app/layout.tsx`) |
| Layouts de catálogo | `src/components/layouts/` |
| Header / footer público | `src/components/site-header.tsx`, `site-footer.tsx` |
| Auth JWT + workspace | `src/lib/api-auth.ts`, `session-cookies.ts` |
| Guards | `src/proxy.ts`, `src/lib/route-guards.ts` |
| Admin shell | `src/components/admin-shell.tsx` (recibe `siteName` / `siteLogoUrl` del layout) |
| BFF público | `src/app/api/public/listings/` |
| BFF staff | `src/app/api/v1/` |
| Catálogo | `src/app/page.tsx` |
| Admin anuncios | `src/app/(admin)/listings/` |
| Admin propiedades | `src/app/(admin)/properties/` |

`src/lib/site-config.ts` solo reexporta helpers legacy; **no** añadir lógica nueva ahí.

## Layouts y estilos

### Layouts (`layout_key`)

El catálogo (`/`) usa `CatalogHero`, que elige el componente según `layoutKey`:

| `layout_key` | Componente | Notas |
|--------------|------------|-------|
| `default` | `default-catalog-hero.tsx` | Hero azul genérico |
| `deo` | `deo-catalog-hero.tsx` | Hero oscuro; acento con `var(--site-primary)` |

**Añadir un layout nuevo** (cambio coordinado API + template):

1. **API:** añadir clave en `SiteConfig::LAYOUT_KEYS` y validación; actualizar `BUSINESS_RULES.md`; Ops UI si hace falta opción en el select.
2. **Template:** añadir en `SiteLayoutKey` (`site-config-types.ts`), en `LAYOUT_KEYS` (`resolved-site-config.ts`), crear `src/components/layouts/<nombre>-catalog-hero.tsx`, registrar en `catalog-hero.tsx`.
3. Probar con `npm run build`; smoke en `/` con el `layout_key` guardado en Ops.

Los layouts solo afectan **zonas públicas** que pasen por `CatalogHero` (hoy: home). Header/footer comparten branding pero no cambian de archivo por layout.

### Marca y color

- `branding.primary_color` (#RRGGBB) → `--site-primary` en `:root` vía `SiteBrandingStyles`.
- En componentes, usar `var(--site-primary, #fallback)` para acentos dinámicos (ver `deo-catalog-hero.tsx`).
- Tailwind fijo (gradientes, zinc, blue) está bien para estructura del layout; el color de marca va por CSS variable cuando deba ser configurable por Ops.
- Logo y nombre: siempre desde `getResolvedSiteConfig()` o props `SiteBranding` — no leer `process.env.NEXT_PUBLIC_*` en UI.

### Server vs client

| Patrón | Uso |
|--------|-----|
| `getResolvedSiteConfig()` | Server Components (`page.tsx`, `layout.tsx`, `site-header`, etc.) |
| `pickSiteBranding(config)` | Pasar marca a `"use client"` (`LoginForm`, `AdminShell`, `AuthPageShell`) |
| `site-config-env.ts` | Solo `ACCOUNT_ID`, BFF, URLs cuando no hay config resuelta |

**No** importar `getResolvedSiteConfig` en client components.

## Buenas prácticas de código

### Alcance y dominio

- **Cambio mínimo:** solo toca lo necesario para la tarea; no refactorizar archivos ajenos.
- **Sin lógica de negocio en el front:** validaciones de dominio (estado de anuncio, permisos, montos) viven en el API. El template muestra, envía formularios y maneja errores del API.
- **Errores del API:** usar `parseApiFailureMessage`, `parseValidationErrors`, `notifyApiResponseFailure` (`src/lib/notifications.ts`). No `window.alert` / `window.confirm`.
- **Copy en español** para UI visible al usuario final (inmobiliaria y visitantes).

### React y Next.js

- **Server Components por defecto.** `"use client"` solo si hay estado, efectos, event handlers o hooks de navegación.
- **Config y fetch en servidor:** `getResolvedSiteConfig()`, `publicApiFetch()` desde `page.tsx` / layouts async; pasar datos a client components vía props (ej. `pickSiteBranding`).
- **No** leer `process.env.NEXT_PUBLIC_*` en componentes de UI para marca — usar config resuelta.
- **`ACCOUNT_ID` nunca en el cliente** ni en URLs del browser; solo en servidor/BFF.
- Metadata: `generateMetadata` async con `getResolvedSiteConfig()` donde aplique.

### Organización de archivos

| Qué | Dónde |
|-----|-------|
| Tipos de API / dominio | `src/lib/<entidad>-types.ts` |
| Etiquetas humanas (español) | `src/lib/<entidad>-labels.ts` |
| Fetch público server-side | `src/lib/public-api-fetch.ts` |
| Proxy staff BFF | `src/lib/api-proxy.ts` |
| Formularios admin | `src/components/*-form.tsx` |
| Primitivos UI | `src/components/ui/` (reexport en `ui/index.ts`) |

- Nombres de archivo: **kebab-case**. Componentes: **PascalCase** exportados.
- Evitar archivos “god” — si un `page.tsx` crece mucho, extraer secciones a `components/`.

### Estilos y UI

- **Tailwind CSS v4** (`globals.css` + clases en JSX). Sin CSS modules salvo necesidad excepcional.
- Paleta base en `:root` (`globals.css`); marca dinámica con `--site-primary` (ver sección Layouts).
- Reutilizar `components/ui/*` (Button, TextField, Card, ErrorBanner) antes de inventar estilos nuevos.
- Diseño responsive: mobile-first (`sm:`, `md:`). Mantener contraste legible en heroes oscuros.
- **Accesibilidad básica:** `alt` en imágenes de contenido, `aria-hidden` en decorativos, labels en campos de formulario.

### Formularios y API

- Validación **mínima** en cliente (required, formato email); el API es la fuente de verdad.
- `POST`/`PATCH` admin → BFF `/api/v1/...`; catálogo público (inquiries) → `/api/public/...`.
- Tras mutación exitosa: `router.refresh()` o redirección según patrón existente en el formulario hermano.
- Subida de archivos (fotos, logo): seguir rutas BFF existentes con `omitContentType` donde ya se use.

### Seguridad

- No exponer tokens ni `API_URL` secreto al cliente (solo `NEXT_PUBLIC_*` permitidos).
- No confiar en `account_id` del query en el browser; el BFF/SSR lo fija desde `ACCOUNT_ID`.
- Links externos: `rel="noopener noreferrer"` en `target="_blank"`.
- Sanitizar HTML solo si se introduce contenido rich-text (hoy no aplica).

### Calidad antes de merge

```bash
npm run build    # obligatorio — debe pasar TypeScript
npm run lint     # corregir warnings nuevos en archivos tocados
```

- Tipos explícitos en límites API (`PublicApiResult<T>`, `*-types.ts`).
- Sin `any` salvo parseo JSON intermedio con narrowing inmediato.
- Sin nombres de clientes, ciudades o dominios hardcodeados en código compartido.

### Code smells, DRY y código muerto

#### DRY — una sola fuente de verdad

Reutilizar helpers existentes antes de copiar lógica:

| Concern | Usar | No duplicar |
|---------|------|-------------|
| Marca / tenant | `getResolvedSiteConfig`, `pickSiteBranding`, `site-config-env` | `process.env.NEXT_PUBLIC_*` en UI; lectura directa del API en cada página |
| Fetch catálogo | `publicApiFetch`, `scopedPublicPath` | `fetch` manual con `account_id` armado a mano |
| BFF staff | `proxyToApi`, `readJsonBody`, `proxyResponse` | Lógica de auth/header en cada `route.ts` |
| Errores API | `parseApiFailureMessage`, `notifyApiResponseFailure` | Strings de error custom por formulario |
| Tipos | `src/lib/*-types.ts` | Interfaces inline repetidas en varios archivos |
| Labels UI | `src/lib/*-labels.ts` | Mapas `{ draft: "Borrador" }` copiados en componentes |
| Layout keys | `SiteLayoutKey`, `LAYOUT_KEYS` en `resolved-site-config.ts` | Strings `"deo"` / `"default"` sueltos |

**Cuándo extraer:** si la misma lógica aparece **2+ veces** con el mismo significado (p. ej. armar URL pública, mapear branding, validar teléfono). **No** crear util de una línea solo “por si acaso”.

**Cuándo no forzar DRY:** rutas BFF de una línea (`return proxyToApi(...)`) están bien repetidas; layouts con markup distinto (`default-catalog-hero` vs `deo-catalog-hero`) no deben fusionarse en un mega-componente con flags.

#### Code smells a evitar

| Smell | Señal | Corrección |
|-------|-------|------------|
| **Lógica en el lugar equivocado** | Validar estado de anuncio o permisos en React | Mover al API; el front solo muestra `message` / `errors` |
| **Env en client** | `"use client"` + `process.env.NEXT_PUBLIC_SITE_NAME` | Props desde server con `pickSiteBranding` |
| **Fetch en client innecesario** | `useEffect` + `fetch` para datos que puede cargar el `page.tsx` | Server Component + props |
| **Estado espejo de props** | `useEffect(() => setX(props.x), [props.x])` | Derivar en render o `key` en el hijo para reset |
| **God file** | `page.tsx` > ~150 líneas con JSX anidado | Extraer bloques a `components/` con nombres de dominio |
| **Magic strings** | `"deo"`, `"published"`, rutas hardcodeadas sin constante | Tipos union + arrays como `LAYOUT_KEYS` |
| **Copy de cliente en código genérico** | Ciudad/marca fija en un layout compartido | Campo de `branding` o `tagline` desde API |
| **Doble fuente de config** | Nuevo helper que lee env ignorando `SiteConfig` | Extender `mergeApiPayload` / tipos |
| **Abstracción prematura** | Wrapper genérico usado una sola vez | Inline hasta que haya segunda repetición real |
| **Cliente innecesario** | `"use client"` en componente sin estado ni eventos | Quitar directiva; dejar Server Component |

#### Código muerto — eliminar, no comentar

Al tocar un archivo, **deja el diff más limpio**:

- **Imports y exports** sin uso → quitar (incl. tipos).
- **Funciones / componentes** sin referencias → borrar el archivo o el export.
- **Rutas o BFF** de features retiradas → eliminar carpeta completa bajo `app/`.
- **Código comentado** “por si acaso” → no commitear; el historial de git basta.
- **Reexports legacy** (`site-config.ts`): no añadir lógica nueva; migrar imports al módulo correcto y no expandir la superficie deprecada.
- **Variables de entorno** documentadas en `.env.example` pero ya no leídas → quitar del example y del código.
- **Props muertas** en tipos (ej. `slug` en un botón que ya usa `listingUrl`) → actualizar tipo y call sites.

Si eliminas un campo de branding o layout en el API, borrar también del template: tipos, merge, componentes y docs — en el **mismo cambio**.

#### Checklist rápido antes de terminar

1. ¿Hay lógica copiada que ya existe en `lib/`?
2. ¿Algún import, prop o función quedó sin usar?
3. ¿El nuevo código podría ser Server Component?
4. ¿Strings de dominio están en `*-types` / `*-labels` y no repetidos?
5. `npm run build` pasa sin warnings nuevos de TypeScript en archivos tocados.

### Qué no hacer

| Evitar | Hacer en su lugar |
|--------|-------------------|
| Filtrar listings por cuenta en el cliente | Confiar en scope del API + `account_id` en servidor |
| Llamar Rails desde el browser | BFF o `publicApiFetch` en SSR |
| Duplicar reglas de anuncios / SiteConfig | Leer `BUSINESS_RULES.md` y el API |
| Nuevo layout solo en front | Coordinar `layout_key` en API + Ops + template |
| `getResolvedSiteConfig` en `"use client"` | Props desde server parent |
| Commits con secretos en `.env` | Solo `.env.example` documentado |
| Util/helper de 1 uso “por limpieza” | Inline hasta segunda repetición |
| `useEffect` para copiar props → state | Derivar o reset con `key` |
| Código comentado o imports sin usar | Borrar en el mismo PR |

## Next.js

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Convenciones

- Puerto dev **3002** (no chocar con `real_state_frontend` en 3001).
- Copiar `.env.example` → `.env` por cliente/deploy.
- Reutilizar componentes del CRM (`listing-form`, `ui/*`) cuando aplique; adaptar imports y quitar dependencias CRM.

## Comandos

```bash
npm run dev
npm run build
npm run lint
```

## Extender la plantilla

- **Página contacto:** nueva ruta bajo `src/app/contacto/`.
- **Más secciones públicas con layout:** reutilizar `CatalogHero` o extraer bloques compartidos en `src/components/layouts/`.
- **Nuevo campo de branding:** añadir en API (`SiteConfig` + presenter + Ops form), luego en `site-config-types.ts`, `mergeApiPayload`, `envSiteConfig` si aplica, y componentes que lo consuman.
- **Deploy Vercel:** checklist manual en Ops (Fase 4 pendiente); ver `README.md`.
