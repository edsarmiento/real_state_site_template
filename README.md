# real_state_site_template

Plantilla **Next.js** para sitios white-label de una inmobiliaria: catálogo público + **admin lite** en el mismo dominio (login, anuncios, leads, mi cuenta). Usa el mismo **`real_state_api`**; cada deploy apunta a un workspace con `ACCOUNT_ID`.

**Arquitectura, capas, themes y reglas de código:** [`AGENTS.md`](./AGENTS.md) es la **única fuente de verdad**. Este README solo cubre cómo correr y desplegar.

## Inicio rápido

```bash
cp .env.example .env
# Edita ACCOUNT_ID y API_URL; guarda SiteConfig en Ops antes de probar marca/layout

npm install
npm run dev   # http://localhost:3002
```

Requisitos:

- API Rails en marcha (`real_state_api`, puerto 3000)
- **`SiteConfig` guardado en Ops** para ese `ACCOUNT_ID` (marca, layout, URL pública)
- Workspace con plan `listings` y anuncios **publicados**
- `ACCOUNT_ID` = id numérico del `Account` en PostgreSQL

## Variables de entorno

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `ACCOUNT_ID` | Sí | Workspace de la inmobiliaria |
| `API_URL` | Sí (prod) | URL del Rails API |

Marca, layout (`default` / `deo`), dominio canónico, logo, color y footer se configuran en **Ops → Configurar sitio** (`/ops/accounts/:id/site`) y el template los lee del API (`GET /api/public/site_config`). **No** duplicar esos valores en Vercel.

El BFF inyecta `account_id` en `/api/public/*`. Las rutas staff (`/api/v1/*`) envían JWT + `X-Account-Id` fijado a `ACCOUNT_ID`.

## Admin en el dominio del cliente

| Ruta | Descripción |
|------|-------------|
| `/login` | Inicio de sesión (solo usuarios del workspace `ACCOUNT_ID`) |
| `/listings` | CRUD de anuncios |
| `/listings/setup` | Crear propiedad + unidad (onboarding) |
| `/listings/inquiries` | Leads del catálogo |
| `/properties` | Listado de propiedades; agregar unidades |
| `/properties/[id]/units` | Crear y editar unidades |
| `/account` | Perfil, logo y datos de la inmobiliaria |

El header público muestra «Acceder» o «Administrar» según la sesión. No hay sidebar CRM: solo anuncios + mi cuenta.

## Nuevo cliente (checklist)

1. Ops: invitar owner con `plan: listings` → anotar `Account` id
2. Ops: **Configurar sitio** (marca, layout, URL pública) y guardar
3. Nuevo proyecto Vercel → root `real_state_site_template`, env solo `ACCOUNT_ID` + `API_URL`
4. DNS del cliente → deploy
5. Agregar dominio a `FRONTEND_ORIGINS` en el API si el browser llama al API directamente (con BFF no suele hacer falta)
6. Smoke: `/`, `/inmueble/:slug`, formulario, WhatsApp, `/login`, `/listings`

## Docs relacionados

- Arquitectura (fuente de verdad): [`AGENTS.md`](./AGENTS.md)
- Reglas de anuncios / SiteConfig: [`../real_state_api/BUSINESS_RULES.md`](../real_state_api/BUSINESS_RULES.md) §6b y §SiteConfig
- Revisión automática de PRs: [`.coderabbit.yaml`](./.coderabbit.yaml) + [`.github/coderabbit-instructions.md`](./.github/coderabbit-instructions.md) (requiere la GitHub App de CodeRabbit instalada en el repo).

## Producción

```bash
npm run build
npm start
```

Puerto por defecto en dev/prod local: **3002** (el CRM front usa 3001).

## Tema Luxury (layout `deo`)

En producción el tema público se elige en **Ops → Configurar sitio** con `layout_key: deo` (mapea al tema Luxury en código). No uses `SITE_THEME` en Vercel.

Variables opcionales solo para Luxury (fuentes, hero, contacto, i18n) — ver `docs/api/luxury-endpoint-gap-analysis.md` y `AGENTS.md`. Ejemplos:

```bash
SITE_HEADING_FONT=cormorant-garamond
SITE_BODY_FONT=manrope
NEXT_PUBLIC_SITE_HERO_IMAGE_URL=https://…
```
