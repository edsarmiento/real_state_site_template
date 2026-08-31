# real_state_site_template

Plantilla **Next.js** para sitios white-label de una inmobiliaria: catálogo público + **admin lite** en el mismo dominio (login, anuncios, leads, mi cuenta). Usa el mismo **`real_state_api`**; cada deploy apunta a un workspace con `ACCOUNT_ID`.

## Inicio rápido

```bash
cp .env.example .env
# Edita ACCOUNT_ID, NEXT_PUBLIC_SITE_*, API_URL

npm install
npm run dev   # http://localhost:3002
```

Requisitos:

- API Rails en marcha (`real_state_api`, puerto 3000)
- Workspace con plan `listings` y anuncios **publicados**
- `ACCOUNT_ID` = id numérico del `Account` en PostgreSQL

## Variables de entorno

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `ACCOUNT_ID` | Sí | Workspace de la inmobiliaria |
| `API_URL` | Sí (prod) | URL del Rails API |
| `NEXT_PUBLIC_SITE_URL` | Sí (prod) | Origen público (dominio del cliente) |
| `NEXT_PUBLIC_SITE_NAME` | Fallback | Nombre en header y metadata (si no hay `SiteConfig` en API) |
| `NEXT_PUBLIC_SITE_TAGLINE` | No | Subtítulo del catálogo (fallback) |
| `NEXT_PUBLIC_SITE_LOGO_URL` | No | Logo en header (fallback) |
| `NEXT_PUBLIC_SHOW_POWERED_BY` | No | `false` oculta «Tecnología Evenia» (fallback) |

En producción, Ops puede configurar marca, layout y dominio público desde **Configurar sitio** (`/ops/accounts/:id/site`); el template lee esos valores del API sin redeploy (salvo `ACCOUNT_ID` y `API_URL`, que siguen siendo por deploy).

El BFF inyecta `account_id` en `/api/public/*`. Las rutas staff (`/api/v1/*`) envían JWT + `X-Account-Id` fijado a `ACCOUNT_ID`.

## Admin en el dominio del cliente

| Ruta | Descripción |
|------|-------------|
| `/login` | Inicio de sesión (solo usuarios del workspace `ACCOUNT_ID`) |
| `/listings` | CRUD de anuncios |
| `/listings/setup` | Crear propiedad + unidad (onboarding) |
| `/properties` | Listado de propiedades; agregar unidades |
| `/listings/inquiries` | Leads del catálogo |
| `/account` | Perfil, logo y datos de la inmobiliaria |

El header público muestra «Acceder» o «Administrar» según la sesión. No hay sidebar CRM: solo anuncios + mi cuenta.

## Nuevo cliente (checklist)

1. Ops: invitar owner con `plan: listings` → anotar `Account` id
2. Duplicar este repo / proyecto en Vercel o Railway
3. Configurar env (`ACCOUNT_ID`, dominio, marca)
4. DNS del cliente → deploy
5. Agregar dominio a `FRONTEND_ORIGINS` en el API si el browser llama al API directamente (con BFF no suele hacer falta)
6. Smoke: `/`, `/inmueble/:slug`, formulario, WhatsApp, `/login`, `/listings`

## Estructura

```
src/
  app/                  Catálogo (/) y ficha (/inmueble/[slug])
  app/(admin)/          Listings + account (shell mínimo)
  app/login/            Auth JWT scoped a ACCOUNT_ID
  app/api/public/       BFF catálogo (account_id)
  app/api/v1/           BFF staff (JWT + X-Account-Id)
  components/           Header, forms, admin-shell
  lib/
    resolved-site-config.ts  SiteConfig API + merge con env
    site-config-env.ts       ACCOUNT_ID y fallbacks NEXT_PUBLIC_*
    site-branding.ts         Helpers para props de marca
    api-auth.ts         JWT + header de workspace
    public-api-fetch.ts
  proxy.ts              Protege /listings, /account, /api/v1/*
```

## Docs relacionados

- Reglas de anuncios: [`../real_state_api/BUSINESS_RULES.md`](../real_state_api/BUSINESS_RULES.md) §6b
- Guía para agentes: [`AGENTS.md`](./AGENTS.md)

## Producción

```bash
npm run build
npm start
```

Puerto por defecto en dev/prod local: **3002** (el CRM front usa 3001).
