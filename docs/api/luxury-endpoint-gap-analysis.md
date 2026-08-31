# Luxury — gap analysis de endpoints

| Campo | Valor |
| --- | --- |
| Título | Luxury endpoint gap analysis — `real_state_site_template` |
| Estado | Draft |
| Versión | 0.2 |
| Fecha | 2026-08-30 |
| Rama | `docs/luxury-product-spec` |
| Complemento | [`docs/architecture/luxury-layout-implementation.md`](../architecture/luxury-layout-implementation.md) |
| Responsables | Por definir (backend, frontend) |
| Clasificación | **Comprobado** · **Inferido** · **Propuesto** · **Pending backend confirmation** |

Este documento no aprueba contratos nuevos. Prefiere **extender** `GET /api/public/listings` y `GET /api/public/listings/:slug` frente a un endpoint por componente. `real_state_api` **no está** en este workspace; OpenAPI y `BUSINESS_RULES.md` §6b no pudieron leerse.

---

## 1. Control documental

Auditoría de lo que el **BFF Next** y los **clientes RSC** de este template realmente llaman. No se infiere el comportamiento de Rails salvo lo que los tipos y query strings de este repo demuestran.

---

## 2. Objetivo y alcance

- Inventariar endpoints del BFF y el dual-path (RSC → Rails directo).
- Contrastar capacidades Luxury P0/P1 con evidencia.
- Proponer extensiones de contrato **solo** donde el código actual no alcanza, marcadas como propuestas.
- **Fuera de alcance:** rediseñar `/api/v1/*` staff, CRM, portales, marketplace.

---

## 3. Metodología de auditoría

1. `rg --files` del repo y listado de `src/app/api/**/route.ts`.
2. Lectura de `proxyToApi`, `proxyPublicToApi`, `proxyMultipartToApi`, `publicApiFetch`, `apiFetch`.
3. Consumidores: `src/app/page.tsx`, `src/app/inmueble/[slug]/page.tsx`, `listing-inquiry-form.tsx`, admin.
4. Tipos: `src/lib/listing-types.ts`, `property-types.ts`, `unit-types.ts`.
5. Búsqueda de `amenities`, `facet`, `sort`, `featured`, `related`, `development`, `page=`, `offset`.
6. Intento de leer `../real_state_api`: **directorio ausente** → secciones Rails = **Pending backend confirmation**.

Limitación: no se ejecutó el API en esta auditoría; los JSON de ejemplo P0 son **propuestos** para discusión, no capturas de producción.

---

## 4. Inventario comprobado de endpoints del BFF

Convenciones:

- **Auth BFF staff:** cookie `auth_token` → `getBearerAuthHeaders()`; si falta, `401 { error: "No autorizado" }` (`proxyToApi`).
- **ACCOUNT_ID público:** `withAccountId` / `scopedPublicPath` setean `account_id` al valor de `accountId()` (env). El query del browser **no gana**: se sobreescribe.
- **ACCOUNT_ID staff:** header `X-Account-Id` (`ACCOUNT_HEADER`) = `accountId()`, no el body del cliente.
- **Caché:** `cache: "no-store"` en todos los proxies y fetches.

### 4.1 Público

| Método | Ruta BFF | Archivo | Backend llamado | Auth | ACCOUNT_ID | Consumidor | Propósito |
| --- | --- | --- | --- | --- | --- | --- | --- |
| GET | `/api/public/listings` | `src/app/api/public/listings/route.ts` | `GET /api/public/listings?{qs}&account_id=` | No | Query inyectada | BFF para cliente; **el catálogo RSC usa `publicApiFetch` directo a Rails** | Listado publicado |
| GET | `/api/public/listings/[slug]` | `src/app/api/public/listings/[slug]/route.ts` | `GET /api/public/listings/:slug?account_id=` | No | Query inyectada | BFF; ficha RSC usa `publicApiFetch` directo | Ficha |
| POST | `/api/public/listings/[slug]/inquiries` | `src/app/api/public/listings/[slug]/inquiries/route.ts` | mismo path Rails | No | Query inyectada | `ListingInquiryForm` (browser) | Lead |

`GET` ficha: slug vacío → `400 { error: "slug inválido" }` **antes** de proxy.

`POST` inquiry: JSON inválido → `400 { error: "JSON inválido" }` (`readJsonBody`).

### 4.2 Auth

| Método | Ruta BFF | Archivo | Backend | Auth | ACCOUNT_ID | Consumidor | Propósito |
| --- | --- | --- | --- | --- | --- | --- | --- |
| POST | `/api/auth/login` | `src/app/api/auth/login/route.ts` | `POST /api/v1/users/sign_in` | Credenciales | Scope vía `findMembership` + `authenticatedSessionResponse` | `login-form.tsx` | JWT cookie |
| POST | `/api/auth/logout` | `src/app/api/auth/logout/route.ts` | `DELETE /api/v1/users/sign_out` | Bearer si hay cookie | No inyecta account en sign_out | `AdminShell.onLogout` | Cierra sesión |

Login **no** es un proxy genérico: parsea body, exige Bearer en respuesta Rails, carga `fetchCurrentUserWithToken`, rechaza portal/ops (`session-cookies.ts`).

### 4.3 Staff (`/api/v1/*`)

`src/proxy.ts` exige cookie para estas rutas (redirige a `/login` si no hay token). El BFF además exige Bearer al llamar Rails.

| Método | Ruta BFF | Archivo | Backend | Consumidor principal | Propósito |
| --- | --- | --- | --- | --- | --- |
| GET, PATCH | `/api/v1/account` | `account/route.ts` | `/api/v1/account` | `account/page.tsx` (GET vía **`apiFetch` directo**), `WorkspaceSettingsForm` (PATCH BFF) | Workspace |
| POST, DELETE | `/api/v1/account/logo` | `account/logo/route.ts` | multipart / DELETE | `WorkspaceLogoForm` | Logo |
| GET | `/api/v1/account/logo/download` | `account/logo/download/route.ts` | idem | download | Binario logo |
| GET | `/api/v1/listing_inquiries` | `listing_inquiries/route.ts` | qs forwarded | `listings/inquiries/page.tsx` vía **`apiFetch` directo** | Leads |
| PATCH | `/api/v1/users/me` | `users/me/route.ts` | `/api/v1/users/me` | `AccountEmailForm` | Email perfil |
| GET, POST | `/api/v1/listings` | `listings/route.ts` | idem | list RSC **directo**; create `ListingForm` BFF | Anuncios |
| GET, PATCH, DELETE | `/api/v1/listings/[id]` | `listings/[id]/route.ts` | idem | detalle RSC **directo**; form BFF | Anuncio |
| POST | `/api/v1/listings/[id]/photos` | `photos/route.ts` | multipart | `ListingPhotosForm` | Alta fotos |
| DELETE | `/api/v1/listings/[id]/photos/[photoId]` | `photos/[photoId]/route.ts` | idem | `ListingPhotosForm` | Baja foto |
| GET | `.../photos/[photoId]/download` | `download/route.ts` | idem | (proxy) | Binario |
| PATCH | `.../photos/reorder` | `reorder/route.ts` | body text JSON | `ListingPhotosForm` `{ photo_ids: number[] }` | Orden/portada |
| GET, POST | `/api/v1/properties` | `properties/route.ts` | idem | list RSC **directo**; `PropertyForm` BFF | Propiedades |
| GET, PATCH, DELETE | `/api/v1/properties/[id]` | `properties/[id]/route.ts` | idem | ficha RSC **directo** | Propiedad |
| GET, POST | `/api/v1/properties/[id]/units` | `units/route.ts` | idem | unidades | Unidades |
| GET, PATCH, DELETE | `/api/v1/properties/[id]/units/[unitId]` | `units/[unitId]/route.ts` | idem | `UnitForm` | Unidad |
| GET | `/api/v1/units` | `units/route.ts` (raíz) | `/api/v1/units` | `fetchPropertyUnits` **directo** | Lookup unidades |

IDs no numéricos en listings/properties/units: `assertIntegerId` → `400 { error: "ID inválido" }`.

**Comprobado:** no hay BFF `GET /api/v1/users/me`. `getSessionContext` / `account/page.tsx` / `fetchCurrentUserWithToken` llaman Rails directo.

### 4.4 Dual-path (importante para contratos)

| Superficie | ¿Usa BFF Next? |
| --- | --- |
| Catálogo `/` | No — `publicApiFetch` → Rails |
| Ficha `/inmueble/[slug]` | No — `publicApiFetch` → Rails |
| Inquiry | Sí — `POST /api/public/.../inquiries` |
| Admin listados RSC | No — `apiFetch` → Rails |
| Admin forms client | Sí — `/api/v1/*` |

Cualquier extensión de query pública debe funcionar en **Rails**, no solo en el BFF (el BFF ya reenvía `searchParams` enteros).

---

## 5. Contratos actuales observados

### 5.1 `GET /api/public/listings`

**Query que el front envía hoy** (`src/app/page.tsx`):

| Param | Cuándo |
| --- | --- |
| `city` | si el usuario llenó ubicación |
| `offer_type` | `rent` o `sale`; **omitido** si oferta = todas |
| `property_type` | si `tipo` no vacío |
| `bedrooms` | si `recamaras` no vacío (valores `"1"`–`"4"`, UI “N+”) |
| `limit` | siempre `"24"` |

El BFF reenvía **cualquier** qs del request más `account_id`. Params extra en URL del BFF llegarían a Rails. El catálogo RSC **no** envía `page`, `offset`, `sort`, `bathrooms`, `q`.

**Response tipada en el front:**

```ts
{
  listings: PublicListingCard[];
  meta: { total: number };
}
```

`PublicListingCard` (**comprobado** `listing-types.ts`): `slug`, `title`, `rent_cents`, `currency`, `offer_type`, `city`, `state_or_region`, `colony`, `location_label`, `property_type`, `bedrooms`, `bathrooms`, `built_area`, `land_area`, `photo_url`, `agency_name`, `agency_logo_url`, `latitude?`, `longitude?`.

**Errores:** `publicApiFetch` devuelve `{ ok: false, status, data }`. UI muestra status. Códigos Rails **Pending backend confirmation**.

**Caché:** `no-store`.

**Limitaciones observadas:**

- No hay paginación en UI; si `total > 24` el resto es inaccesible.
- `meta` solo se usa `.total`.
- Placeholder “Ciudad o colonia” vs param `city` — **inferido:** colonia podría no buscarse.
- `agency_logo_url` no se pinta en `PublicListingCard`.

### 5.2 `GET /api/public/listings/:slug`

Sin query de negocio desde el front (solo `account_id` inyectado).

**Response:** `PublicListingDetail` = card + `description`, `address_label`, `show_exact_address`, `contact_phone`, `photos: ListingPhoto[]`, `published_at`.

`ListingPhoto`: `id`, `url | null`, `position`.

404 → `notFound()` en la página. Otros errores → mensaje con status.

**Limitaciones:** no `amenities`, no `parking_spaces`, no `related`, no JSON-LD extra. Specs públicas no incluyen estacionamiento.

### 5.3 `POST /api/public/listings/:slug/inquiries`

**Body comprobado** (`ListingInquiryForm`):

```json
{
  "inquiry": {
    "name": "string",
    "phone": "10 dígitos",
    "message": "string"
  }
}
```

Validación cliente: teléfono `/^\d{10}$/`. Errores: `parseApiFailureMessage` (`error` | `message` | `errors`).

Staff lee `GET /api/v1/listing_inquiries` como `ListingInquiry[]` (`id`, `listing_id`, `listing_title`, `listing_slug`, `listing_offer_type?`, `name`, `phone`, `message`, `created_at`).

### 5.4 Staff (solo lo relevante a datos de ficha)

Campos de inmueble “de verdad” (parking, floors, year) viven en `Property`, no en el DTO público del listing. WhatsApp público sale de `listing.contact_phone` (obligatorio para publicar en `ListingForm`).

---

## 6. Matriz funcional Luxury

| Capacidad | Prio | Endpoint actual | Estado | Evidencia | Gap | Recomendación |
| --- | --- | --- | --- | --- | --- | --- |
| Catálogo listado | P0 | `GET /api/public/listings` | **Covered** | `page.tsx` + tipos | — | Seguir este recurso |
| Detalle | P0 | `GET /api/public/listings/:slug` | **Covered** | `inmueble/[slug]/page.tsx` | — | Seguir este recurso |
| Filtro operación | P0 | mismo GET `offer_type` | **Covered** | `parseCatalogOfferFilter` | Labels Comprar vs Venta son UI | No nuevo endpoint |
| Filtro tipo | P0 | `property_type` | **Covered** | `PROPERTY_TYPES` | Valores no validados vs enum Rails | Confirmar enum |
| Filtro recámaras | P0 | `bedrooms` | **Covered** | `recamaras` → `bedrooms` | Semántica `>= N` vs `= N` | **Pending backend confirmation** |
| Ubicación | P0 | `city` | **Partial** | placeholder colonia vs `city` | colonia/`q` | Extender **mismo** GET si hace falta |
| URL state | P0 | n/a (front) | **Covered** | searchParams | page/sort no en URL | Front + API |
| Paginación | P0 | `limit` + `meta.total` | **Partial** | `limit=24` | no `page`/`offset` en front | Extender **mismo** GET |
| Ordenamiento | P0 | — | **Missing** (front) | ningún `sort` | contrato sort | Extender **mismo** GET si Rails no lo tiene |
| Facets | P1 | — | **Missing** | rg sin `facet` | conteos por tipo/zona | `meta.facets` en el mismo GET, no endpoint nuevo |
| Baños (filtro) | P1* | — | **Missing** filtro; campo en DTO | `bathrooms` en card | no query | Mismo GET `bathrooms` si producto lo sube a P0 |
| Estacionamientos filtro | P1 | — | **Missing** | `parking_spaces` solo `Property` | no en listing público | No filtrar hasta que el listing público lo exponga |
| Superficie filtro | P1 | — | **Missing** | `built_area`/`land_area` display | no min/max query | Mismo GET |
| Grid / cards | P0 | listado | **Covered** | `PublicListingCard` | visual luxury | Sin API |
| Loading/empty/error | P0 | — | **Partial** | empty/error; no loading | UX | Sin API |
| Galería | P0 | detalle `photos` | **Covered** | `ListingPhotoGallery` | — | Sin API nuevo |
| Características | P0 | detalle + `listingPublicSpecs` | **Partial** | no parking en public DTO | parking/amenities | Extender **detalle** si el JSON ya puede |
| Descripción | P0 | `description` | **Covered** | ficha | — | — |
| Amenidades | P0 cond. | — | **Missing** / **Unknown** | cero `amenities` en `src/` | modelo | Ver §8; no fingir |
| Coordenadas / mapa | P0 | `latitude`/`longitude` | **Partial** | opcionales en card; usados en ficha | no embed API | Link actual; no Places API |
| Inquiry | P0 | `POST .../inquiries` | **Covered** | form | — | — |
| WhatsApp | P0 | campo `contact_phone` | **Partial** | `ListingWhatsAppButton` | no site-config API; `52` fijo | Config front; no endpoint |
| Branding público | P0 | env `site-config.ts` | **Partial** | no GET público | CMS | Env-first; site-config API opcional §10 |
| SEO | P0 | metadata Next | **Partial** | `generateMetadata` | sitemap/robots ausentes; no fields SEO extra | sitemap puede ser estático + slugs del listado existente |
| Featured | P1 | — | **Missing** | — | flag | Query `featured=true` en **mismo** GET si existe flag |
| Related | P1 | — | **Missing** | — | — | Preferir query al listado o subrecurso; no aprobar aún |
| Developments | P1 | — | **Missing** | — | — | No P0 |
| Zones editoriales | P1 | — | **Missing** | — | — | No P0 |
| Admin listings/properties | n/a — MVP layout | `/api/v1/*` | **Covered** | admin lite | fuera luxury UI | No cambiar |

\*Baños: en el brief P0 del buscador **no** aparecen; están en ficha como dato. Filtro = P1 salvo que producto lo eleve.

---

## 7. Análisis por capacidad

### 7.1 Catálogo y detalle

Cubiertos. No crear `GET /api/public/luxury/listings`.

### 7.2 Filtros y facets

Filtros P0 del buscador están cableados. Facets (conteos) **no**. **Propuesto:** si se necesitan, `meta.facets` en la respuesta del listado (`include=facets` opcional) para un round-trip. Un `GET /api/public/listings/facets` solo si el payload de listado se vuelve enorme — no es el caso actual (`limit` 24).

### 7.3 Paginación y sort

Front: no. BFF: passthrough. Rails: **Pending backend confirmation**.

Hasta confirmar, **no** se afirma que `page` funcione.

### 7.4 Búsqueda por ubicación

Solo `city`. **Pending:** ¿match parcial, case, colonia, estado?

### 7.5 Operación / tipo / recámaras

Cubierto. Confirmar semántica `bedrooms=2` (mínimo vs exacto) porque la UI dice “2+”.

### 7.6 Baños, estacionamientos, superficie

Display (baños, m²) sí en card/ficha. Filtros no. Parking no está en DTO público (**comprobado**).

### 7.7 Galería

`photos[]` en detalle + `photo_url` de card. Staff reorder no afecta el contrato público salvo el orden/portada que Rails ya persiste.

### 7.8 Amenidades

No hay campo en tipos públicos ni staff listing ni `Property`. **Unknown** en Rails. Tratar como gap de modelo, no como olvido de UI.

### 7.9 Mapa

Coords en detalle. No geocoding endpoint. `maps-links.ts` es cliente.

### 7.10 Inquiry y WhatsApp

Inquiry cubierto. WhatsApp no es API: es `contact_phone` + `wa.me`.

### 7.11 Branding y SEO

Branding: env. Staff `GET /api/v1/account` no sirve al anónimo. SEO: Next metadata; no hay endpoint SEO. Sitemap puede generarse iterando el listado público existente (**propuesto**, con paginación real si `total` es grande).

### 7.12 Featured, related, developments, zones

Cero evidencia en este template. P1. No diseñar OpenAPI completo.

---

## 8. Gaps P0 — propuestas de contrato (no aprobadas)

Regla: **extender el recurso existente**. JSON de ejemplo = discusión. Implementación bloqueada a confirmación Rails.

### 8.1 Paginación del catálogo

| | |
| --- | --- |
| Caso de uso | Mostrar página N de resultados scoped al `ACCOUNT_ID` del deploy |
| ¿Nuevo endpoint? | **No.** Extender `GET /api/public/listings` |
| Método / ruta | `GET /api/public/listings` |
| Request propuesto | Query actuales + `page` (entero ≥1) **o** `offset` + `limit` (ya existe `limit`) |
| Compatibilidad | Sin `page`: comportamiento actual (primera página, `limit=24`) |
| Tenant | `account_id` solo servidor |
| Caché | Seguir `no-store` hasta definir key `account_id+query` |
| Tests contrato | `page=1` ⊂ resultados actuales; `page` enorme → `listings: []` + `total` estable; ignorar `page` negativo |
| Impacto front | URL `page`; UI paginación |
| Abierto | ¿`page`/`per_page` o `offset`? ¿`meta.total_pages`? |

**Response ejemplo (propuesto, no observado):**

```json
{
  "listings": [],
  "meta": {
    "total": 48,
    "page": 2,
    "per_page": 24,
    "total_pages": 2
  }
}
```

**Status:** 200 lista vacía; 400 si se acuerda validar `page` no entero. **Pending backend confirmation** de códigos actuales.

### 8.2 Ordenamiento

| | |
| --- | --- |
| Caso de uso | Ordenar el mismo result set |
| ¿Nuevo endpoint? | **No.** Query `sort` en el mismo GET |
| Request propuesto | `sort=price_asc\|price_desc\|newest` (ids tentativos) |
| Default | omitir = orden actual Rails (**unknown**) |
| Tenant | igual |
| Tests | sort desconocido → default, no 500 |
| Abierto | keys reales; ¿`relevance` existe? |

No inventar un `POST /search`.

### 8.3 Ubicación más rica (solo si `city` no cubre el placeholder)

| | |
| --- | --- |
| Caso de uso | “Polanco” encuentra colonia, no solo ciudad |
| ¿Nuevo endpoint? | **No**, salvo que Rails ya tenga `q` |
| Request propuesto | `q` full-text **o** documentar que `city` ya busca colonia |
| Recomendación | Preguntar a backend **antes** de añadir param |
| Tenant | igual |

### 8.4 Amenidades y parking en ficha (P0 condicional)

| | |
| --- | --- |
| Caso de uso | Pintar amenidades / estacionamientos **si existen en dominio** |
| ¿Nuevo endpoint? | **No.** Extender JSON de `GET /api/public/listings/:slug` (y card si se muestran en grid) |
| Response ejemplo (propuesto) | `"parking_spaces": 2, "amenities": [{ "key": "pool", "label": "Alberca" }]` |
| Si Rails no tiene el modelo | **No implementar UI** y bajar a P1 |
| Tenant | slug + `account_id`; 404 si el anuncio no es del account (**Pending** confirmar 404 cross-tenant) |
| Front | secciones condicionales |

### 8.5 Branding — `GET /api/public/site-config` (recomendado, no bloqueante)

Ver §10. El MVP de layout puede shippear con env. Este endpoint **no** es bloqueante de P0 si producto acepta env.

Si se hace:

| | |
| --- | --- |
| Caso de uso | Hero, colores, nav, WhatsApp de marca por inmobiliaria sin redeploy de código |
| ¿Nuevo? | **Sí**, porque `GET /api/v1/account` es staff |
| Método / ruta propuesta | `GET /api/public/site-config` |
| Request | sin `account_id` de cliente; BFF inyecta |
| Response ejemplo (propuesto) | `{ "version": 1, "brand": { "name": "…", "logo_url": null, "tagline": "…" }, "hero": { "title": "…", "image_url": null }, "footer": { "show_powered_by": true } }` |
| **Nunca** | `account_id`, API keys, plan de facturación, memberships |
| Status | 200; 404 si el account deploy no existe |
| Caché | posible `s-maxage` **con vary/key por tenant**; no cache global |
| Front | `parseSiteConfig` + fallback env |
| Abierto | ¿quién edita hero en ops vs Mi cuenta? |

---

## 9. P1 — alto nivel (no contrato aprobado)

| Capacidad | Dependencias | Enfoque preferido |
| --- | --- | --- |
| Facets | Conteos en Rails | `meta.facets` en GET listado |
| Featured | Flag en listing | `?featured=true` mismo GET |
| Related | Regla de similitud en API | `GET .../listings/:slug/related` **o** `?related_to=slug`; decidir después |
| Developments | Modelo nuevo | Recurso propio cuando exista dominio |
| Zones | CMS | Recurso editorial, no mezclar con listings |
| Filtro baños/parking/m² | Campos en índice público | Query en el mismo GET |
| Favoritos / comparador / i18n | identidad visitante / copy | Fuera de API listings actual |

No tratar estas filas como OpenAPI.

---

## 10. Recomendaciones específicas

### 10.1 `GET /api/public/site-config`

**Recomendado P0 de producto, opcional P0 de ingeniería.** Empezar con SiteConfigV1 desde env (`src/lib/site-config.ts`). Añadir el GET público cuando ops no quiera redeploy para cambiar hero. No usar `GET /api/v1/account` en páginas anónimas.

### 10.2 `GET /api/public/listings`

**Recurso canónico P0.** Extenderlo para page/sort/q. No fragmentar en `/search`, `/luxury`, `/catalog`.

### 10.3 Facets

P1. Preferir `meta.facets` opcional. No endpoint dedicado en MVP.

### 10.4 Featured

P1. Un boolean/query en el mismo listado, no `/featured`.

### 10.5 Related

P1. Evitar N+1 desde el front (no N GETs de ficha). Un array en el detalle **o** un subrecurso paginado. **Pending** modelo.

### 10.6 Developments / locations / zones

P1. Sin evidencia en este repo. No crear rutas “por si acaso”. Locations de filtro = `city` (+ `q` si se confirma).

**Comprobado en el catálogo actual:** `src/app/page.tsx` envía a Rails únicamente `city`, `offer_type`, `property_type`, `bedrooms`, `limit`. Luxury enlaza ubicaciones **solo** con `?city=`. No se envían `zone`, `colony` ni `neighborhood`. Santa Fe, Playas, Otay o Zona Río **no** deben usarse como `city` si el backend no las resuelve como ciudad.

**Proposed. No aprobado. No implementado.**

```text
GET /api/public/locations
```

Contrato sugerido:

```json
{
  "data": [
    {
      "id": "string",
      "slug": "string",
      "name": "string",
      "kind": "city|zone|neighborhood",
      "image_url": "https://...",
      "listings_count": 12,
      "query": {
        "city": "Tijuana",
        "zone": "Santa Fe"
      }
    }
  ]
}
```

Pendiente de confirmar en backend (no afirmar que está aprobado):

- filtros `zone` y `neighborhood` en `GET /api/public/listings`
- counts reales por tenant (nunca inferir el total desde una página de 24)
- orden configurable
- imagen editorial
- únicamente ubicaciones con publicaciones activas
- contenido localizado (`name` / `shortDescription` por locale)

Hasta ese endpoint, Luxury usa `SITE_LOCATIONS_JSON` (adapter en `getPublicSiteContent`) o ciudades únicas de los listings ya cargados.

### 10.7 i18n y SEO bilingüe

**Pending (listings API).** MVP Luxury: query `?lang=en`. Default `es`. Diccionario de interfaz en `src/lib/site-i18n.ts`.

Luxury translates its interface. Listing-authored content remains in its source language until the listings API supports localized fields.

No se traducen título, descripción, amenidades, colonia/desarrollo, dirección ni nombres propios. No hay reemplazos automáticos ni servicio externo. DTO, API y BFF no cambian en este pase.

**P1:** localized pathnames `/en/...` y `hreflang`. El query param no es SEO internacional completo; `?lang=en` puede duplicar URLs. Canonical del home sin filtros permanece `/`.

`<html lang>` global permanece `es` (layout compartido con default/admin).

### 10.8 WhatsApp y redes (config front)

**Comprobado:** `SITE_WHATSAPP_NUMBER` / `SITE_WHATSAPP_MESSAGE` en `getPublicSiteContent` → `https://wa.me/{digits}?text=`. Número inválido oculta CTAs. Footer Contacto (Luxury) pinta WhatsApp, `SITE_CONTACT_EMAIL` y teléfono si existen.

**Comprobado:** `SITE_INSTAGRAM_URL`, `SITE_FACEBOOK_URL` con allowlist de hosts. Sin handle visible. No hay endpoint de site-config; sustituible por `GET /api/public/site-config` futuro.

**Comprobado (Luxury):** inquiry de ficha POST a `POST /api/public/listings/[slug]/inquiries` (mismo BFF que default). Default usa `ListingInquiryForm`. El contrato del endpoint no cambia.

**Comprobado (Luxury):** `SITE_TESTIMONIALS_JSON` opcional; vacío omite la sección. Parser retrocompatible: `quote` (string u objeto `{es,en}`), más `quoteEs` / `quoteEn` y opcional `roleEs` / `roleEn`. ES: `quoteEs ?? quote`. EN: `quoteEn ?? quote`. Sin texto resoluble se omite el item. Máximo 6. `preview: true` identifica la vista previa. No hay testimonios inventados en código.

---

## 11. Seguridad multi-tenant

**Comprobado / normas a preservar:**

| Control | Dónde |
| --- | --- |
| `ACCOUNT_ID` solo env | `accountId()` |
| Query `account_id` overwrite | `scopedPublicPath`, `withAccountId` |
| Header staff fijo | `getBearerAuthHeaders` → `X-Account-Id` |
| No selector workspace | `findMembership` ignora cookie para el id |
| Catálogo no filtra en cliente por cuenta | `page.tsx` pinta `result.data.listings` tal cual |
| Staff | `proxy.ts` + `requireStaffAccess` |
| Inquiry | scoped por slug + account_id servidor |

**Propuesto — pruebas negativas:**

1. Llamar BFF público con `?account_id=OTRO` y verificar que Rails recibe el del env.
2. Slug de otra cuenta → 404 (confirmar Rails).
3. Staff JWT de otra cuenta + `X-Account-Id` del deploy → no listar ajeno (confirmar Rails).
4. Cache (si se activa): key incluye `accountId()`; un HIT no sirve HTML de otro tenant.

**Nunca:** `NEXT_PUBLIC_ACCOUNT_ID`, ni `account_id` en SiteConfig público.

---

## 12. Estrategia de versionado

- Paths actuales `/api/public/*` y `/api/v1/*` se mantienen.
- Extensiones **aditivas** (query opcional, campos JSON nuevos).
- Breaking change → `/api/public/v2/...` o campo `meta.api_version`; no en el primer luxury.
- SiteConfig `version: 1` independiente del path HTTP.

---

## 13. Estrategia de compatibilidad

- Front luxury debe funcionar contra el contrato **actual** (sin page/sort): una sola página de 24.
- Campos nuevos: optional chaining; UI condicional.
- BFF sigue siendo proxy tonto (qs in, qs out + account_id).
- Dual-path: cambiar Rails es suficiente para RSC y BFF a la vez.

---

## 14. Preguntas para el equipo backend

1. ¿OpenAPI vigente de `GET /api/public/listings` (params y `meta`)?
2. ¿`bedrooms=2` es mínimo 2 o exacto 2?
3. ¿`city` busca colonia / estado / texto libre?
4. ¿Existe `page`, `offset`, `sort` o equivalentes ignorados hoy?
5. ¿Cuál es el orden default?
6. ¿El JSON de ficha incluye campos no tipados aquí (`amenities`, `parking_spaces`, `year_built`)?
7. ¿404 vs 403 en slug de otro `account_id`?
8. ¿Límite máximo de `limit`?
9. ¿Rate limit de POST inquiry?
10. ¿Hay o habrá `GET /api/public/site-config`? ¿Quién escribe hero/logo público vs `GET /api/v1/account`?
11. ¿Flag `featured` o listings “destacados”?
12. ¿Modelo de desarrollos / amenidades / zonas?
13. ¿Caché HTTP permitido en públicos con key por account?
14. Confirmar `BUSINESS_RULES.md` §6b (anuncios publicados, visibilidad) — archivo no accesible aquí.

---

## 15. Resumen ejecutivo de gaps

### Bloqueadores P0 (confirmar o degradar el MVP)

1. **Paginación real** — sin ella el criterio “resultados paginados” no se cumple si `total > 24`. Deuda aceptable solo con decisión explícita de producto.
2. **Sort** — no hay param en el front; puede ser solo UI sobre el contrato actual **si** Rails ya ordena de forma aceptable, o extensión del mismo GET.
3. **Amenidades** — si producto las exige en P0 y el API no las tiene, el ítem es bloqueante de **modelo**, no de un endpoint extra.
4. **Semántica de `city` / `bedrooms`** — riesgo de UX falsa (“colonia”, “2+”).

Ninguno de estos exige, por sí solo, un recurso HTTP nuevo.

### Recomendados P0 (no bloquean layout si hay fallback)

- SiteConfig env + parser.
- Copy de error sin secretos.
- `loading.tsx`.
- `GET /api/public/site-config` si ops necesita hero sin redeploy.
- Campos aditivos en ficha (`parking_spaces`) **si ya existen en Rails**.

### P1

Facets, featured, related, developments, zones, filtros baños/parking/m², mapa embed, i18n path-based (`/en/...` + hreflang), favoritos, comparador, counts reales por ubicación, imágenes editoriales de locations.

### No requeridos para Luxury MVP

- Endpoints staff nuevos.
- Endpoint por widget (hero, card, footer).
- Marketplace / search global multi-cuenta.
- `GET /api/public/listings` duplicado “luxury”.
- Geocoding / Google Maps Platform (el link externo basta para P0 de mapa).

---

## 16. Formulario general de contacto — no implementado

**Propuesto. No aprobado. No implementado.**

El inquiry actual (`POST /api/public/listings/:slug/inquiries`, BFF `src/app/api/public/listings/[slug]/inquiries`) es **exclusivo de un anuncio**. Luxury no lo reutiliza para contacto general.

| Campo | Estado |
| --- | --- |
| Endpoint propuesto | `POST /api/public/contact-inquiries` |
| Implementado en este repo | No |
| Aprobado | No |
| Bloquea el catálogo | No |
| Bloquea captura general por formulario | Sí |
| Fallback actual | WhatsApp / llamada / correo / agenda **solo si** hay valores válidos en `getPublicSiteContent()`; si no, se invita a usar el formulario de la ficha |

`contact.formEnabled` permanece en `false`. Los únicos modos aceptados son `hidden` y `preview`. `enabled` no está disponible: se resuelve a `hidden` con warning server-side (sin imprimir el valor crudo). `preview` muestra campos con submit deshabilitado; no hay success, persistencia ni adapter de envío. El formulario general no llama al BFF de inquiry de listing.

Las rutas internas `/aviso-de-privacidad`, `/terminos` y `/cookies` son scaffolding con `robots: noindex, nofollow`. **Release blocker por tenant:** no publicar sin documentos o URLs legales aprobados. Un formulario general real no podrá habilitarse sin privacidad válida.

Payload propuesto (sujeto a confirmación de backend): `name`, `phone`, `email?`, `operation?`, `location?`, `message`, `privacyAccepted`. Requiere rate limit, validación, privacidad y tenant scope server-side. El checkbox de privacidad no va preseleccionado y no puede habilitarse el envío sin aviso de privacidad y endpoint reales.

---

## Apéndice — evidencia de búsquedas

| Término | Resultado en este repo |
| --- | --- |
| `amenities` | Sin usos |
| `facet` | Sin usos de API |
| `featured` / `related` / `development` (dominio) | Sin usos de catálogo |
| `sort` como query | Solo `sortPhotos` admin |
| `limit` | `page.tsx` `"24"` |
| `parking_spaces` | `Property` + admin, no public listing |
| `latitude`/`longitude` | Property, staff listing, public card opcional, ficha |
| `ACCOUNT_ID` | `site-config.accountId`, docs, mensaje de error catálogo |
