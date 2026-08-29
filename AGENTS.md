# White-label site template — guía para agentes

Next.js para **un sitio por inmobiliaria**: catálogo público + admin lite en el mismo dominio. API compartida en [`../real_state_api/`](../real_state_api/).

## Reglas

- Lee [`../real_state_api/BUSINESS_RULES.md`](../real_state_api/BUSINESS_RULES.md) §6b (anuncios).
- **No** reimplementar dominio en el front: usar respuestas del API.
- **`ACCOUNT_ID`** es server-only; scope fijo del deploy (no selector de workspace).
- El BFF añade `account_id` a `/api/public/*` y `X-Account-Id` a `/api/v1/*`.
- **No** filtrar listings en el cliente por cuenta; el scope es en servidor.

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

## Archivos clave

| Área | Ubicación |
|------|-----------|
| Config tenant/marca | `src/lib/site-config.ts` |
| Auth JWT + workspace | `src/lib/api-auth.ts`, `session-cookies.ts` |
| Guards | `src/proxy.ts`, `src/lib/route-guards.ts` |
| Admin shell | `src/components/admin-shell.tsx` |
| BFF público | `src/app/api/public/listings/` |
| BFF staff | `src/app/api/v1/` |
| Catálogo | `src/app/page.tsx` |
| Admin anuncios | `src/app/(admin)/listings/` |
| Admin propiedades | `src/app/(admin)/properties/` |

## Convenciones

- Puerto dev **3002** (no chocar con `real_state_frontend` en 3001).
- Copiar `.env.example` → `.env` por cliente/deploy.
- Mantener plantilla **genérica** (sin nombres de clientes en código).
- Reutilizar componentes del CRM (`listing-form`, `ui/*`) cuando aplique; adaptar imports y quitar dependencias CRM.

## Comandos

```bash
npm run dev
npm run build
npm run lint
```

## Extender la plantilla

- Colores: CSS variables en `globals.css` o env futuro `NEXT_PUBLIC_PRIMARY_COLOR`
- Página contacto: nueva ruta estática bajo `src/app/contacto/`
- Logo dinámico desde API: endpoint `site_config` futuro o `GET /api/v1/account`
