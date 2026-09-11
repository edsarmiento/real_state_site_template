# Auditoría CodeRabbit / theme Dark

**Actualizado:** 2026-09-10 (smoke visual ejecutado)  
**Rama local:** `feat/dark-theme` (sin push; CodeRabbit oficial **0 %**)  
**Servidor smoke:** `http://localhost:3002`  
**SiteConfig live (ACCOUNT_ID del `.env` local):** `layout_key: dark`  
**Override:** ninguno — `resolveSiteThemeFromConfig` → `getTheme(themeNameFromLayoutKey(config.layoutKey))`

---

## Coberturas

| Capa | Estado |
|------|--------|
| CodeRabbit oficial | **0 %** — no hay PR de este diff |
| Auditoría independiente + smoke local | Ejecutada (ver § Smoke) |

---

## Activación Dark

**Confirmado en esta sesión:** `GET /api/public/site_config` → `layout_key: "dark"`, HTML con `data-site-theme="dark"`, sin force-theme.

El bloqueo Ops/API de activación **se retira del informe operativo** para este entorno de pruebas. No se solicitaron ni aplicaron cambios a cuentas de producción ni a yellow.

(La coordinación API `LAYOUT_KEYS` sigue siendo requisito de plataforma para *otras* cuentas nuevas; aquí ya está habilitado.)

---

## Smoke visual — resultados

**Herramienta:** Chrome headless via `puppeteer-core` (efímero, no añadido a `package.json`) + `scripts/smoke-dark-visual.mjs`.  
**Evidencias:** `docs/audits/smoke-dark/*.png` (14 capturas) + `docs/audits/smoke-dark/results.json`.

| Comprobación | Resultado | Evidencia / notas |
|--------------|-----------|-------------------|
| Theme `data-site-theme="dark"` en `/` y ficha | **PASS** | SSR + browser |
| Sin override `getTheme("dark")` | **PASS** | Código + HTML |
| Vacío `/?city=__smoke_empty_city__` (0 cards) | **PASS** | `home-empty-1440.png` |
| Ubicación → filtro ciudad | **PASS** | `/?city=San+Quintin#propiedades` |
| Overflow catálogo 360–1440 | **PASS** (tras fix) | Antes fallaba ~4px en 360/390 |
| Overflow ficha 360–1440 | **PASS** | |
| Galería vertical+horizontal | **PASS** | 1 vertical + 8 landscape; strip |
| Flechas / contador | **PASS** | |
| Miniaturas sincronizadas | **PASS** (tras fix) | |
| Lightbox open / Escape+foco / scrim | **PASS** | Scrim validado en esquina (centro = panel) |
| Precio, specs, título, gallery, inquiry, share, WA | **PASS** | Ficha Burdeos |
| Form vacío → `:invalid`, sin navegación | **PASS** | Sin POST |
| WhatsApp `wa.me` hrefs (sin abrir) | **PASS** | |
| Share UI “Compartir” (sin enviar) | **PASS** | |
| Teclado (muestra Tab/foco) | **PASS** limitado | No auditoría WCAG completa |

**Resumen automatizado final:** 27 PASS / 0 FAIL (`results.json`).

### Limitaciones (no marcadas como aprobadas)

- Contraste WCAG automatizado / zoom 200 % / `prefers-reduced-motion`: **no medidos**.
- Recorrido de teclado exhaustivo de toda la página: **muestra solamente**.
- Descripción de capturas por visión es auxiliar; la fuente de verdad es `results.json` + PNGs.
- `puppeteer-core` no queda como dependencia del repo (instalación temporal para el smoke).

---

## Correcciones hechas durante el smoke

1. **Overflow móvil catálogo** — `html`/`body` `overflow-x: clip` con `:has([data-site-theme=dark])`; `dark-hero__media { overflow:hidden }`; about/contact `min-width:0`.  
   Archivo: `src/themes/dark/dark-theme.css`.

2. **Miniaturas vs scroll sync** — el listener de scroll pisaba la selección; thumbs usan `data-index` + `goTo(..., "auto")` y el scroll programático ignora sync hasta asentar `scrollLeft`.  
   Archivo: `src/components/listing-photo-gallery-strip.tsx`.

Re-smoke completo tras los fixes: **27/27 PASS**.

---

## Pruebas técnicas post-fix

| Comando | Resultado |
|---------|-----------|
| `node --test` gallery-strip + public-api-fetch | Pass |
| Smoke visual repetido | 27 PASS |

(Lint/build globales ya OK en pasadas previas; cambios CSS/strip acotados.)

---

## Pendientes reales

1. **CodeRabbit 0 %** hasta commit → push → PR → review real.  
2. Mediciones a11y avanzadas (WCAG/zoom/reduced-motion) si se exigen formalmente.  
3. Commit/push/PR **no hechos** (pendiente de tu autorización).

---

## Alcance propuesto para commit y PR

**Título:** `feat: add Dark public theme and strip gallery variant`

**Incluiría:**

- Theme `src/themes/dark/**` + registry/`theme-definitions` (+ tests)
- `ListingPhotoGallery` `variant="strip"` + `listing-photo-gallery-strip.tsx` + libs gallery/dialog
- `public-api-fetch` transport (red→503; abort rethrow) + tests
- `docs/dark-theme-agent-prompt.txt`, `docs/audits/coderabbit-theme-audit.md`
- `docs/audits/smoke-dark/**` (evidencias) y `scripts/smoke-dark-visual.mjs` (opcional pero útil)

**No incluir:** cambios a SiteConfig/Ops, overrides, dependencias puppeteer en `package.json`.

---

## Matriz IND (estado vivo)

| ID | Estado |
|----|--------|
| IND-08 galería strip compartida | Resuelto |
| IND-07 fetch sin 499 inventado | Resuelto |
| IND-12 activación dark | **Retirado como bloqueo** en este entorno (`layout_key: dark` confirmado) |
| IND-13 smoke visual | **Ejecutado** — 27/27; evidencias en `docs/audits/smoke-dark/` |
| IND-14 CodeRabbit | **0 %** — sin PR |
