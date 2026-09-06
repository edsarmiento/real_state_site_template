# CodeRabbit code review — real_state_site_template

You are reviewing a white-label Next.js App Router site: public catalog + lite admin on one domain, scoped to a single `ACCOUNT_ID`, talking to a shared Rails API.

Leave review comments in **Spanish**.

## Context — read this first

1. **`AGENTS.md` (repository root) is the only architecture source of truth.** Read it before commenting on structure, themes, BFF, auth, SiteConfig, or i18n. Do not invent a different app model from training data or from `README.md`.
2. **`README.md` is deploy / quickstart only.** If README and `AGENTS.md` disagree, `AGENTS.md` wins. Flag README drift only when the PR changes architecture and does not update `AGENTS.md`.
3. Domain rules live in the Rails API (`BUSINESS_RULES.md` §6b and §SiteConfig). This template displays data, posts forms, and surfaces API `message` / `errors`.

## Must-flag

- **Reusable components, used props only.** Shared UI lives in `src/components/` (or `src/lib/` if there is no JSX). A component may declare **only the props it actually reads and renders**. Unused props, unused fields on a props type, and “pass it through just in case” are defects. Do not add optional props that no call site uses.
- **Themes are skins.** `src/themes/*` receive already-resolved values (listings, `SiteConfig`, locale, copy) and paint. Reuse `ListingInquiryForm`, `ListingWhatsAppButton`, `ListingShareButton`, `ListingPhotoGallery`, `publicListingCardModel`, `listingPublicSpecsLocalized`, `PublicCatalogSearch`. Do not copy inquiry POST, `wa.me` parsing, or specs mapping into a theme.
- **No theme branching in `src/app/`.** Routes fetch + delegate to `THEME_REGISTRY`. No `if (theme.name === …)` in `page.tsx`. Catalog knobs (`pageSize`, `heroGallery`) and listing load errors live on the theme registry.
- **No domain reimplementation** in the front (listing state, permissions, amounts). Trust the API.
- **`ACCOUNT_ID` is server-only.** No client-side account filtering; the BFF / SSR injects scope.
- **Server Components by default.** `"use client"` only for state, effects, event handlers, or navigation hooks. Do not import `getResolvedSiteConfig` in a client component — pass `pickSiteBranding` (or similar) from the server parent.
- **Reuse before inventing.** `publicApiFetch`, `scopedPublicPath`, `proxyToApi`, `getResolvedSiteConfig`, `site-i18n` / `getSiteUi`, `parseApiFailureMessage`, types in `src/lib/*-types.ts`.
- **Generic template.** No client names, cities, or exclusive copy in shared code. Branding comes from `SiteConfig` / `getPublicSiteContent()`.

## Do not comment on

- Formatting or import-order nits already covered by `npm run lint` / TypeScript, unless they hide a bug.
- Drive-by refactors or files outside the diff.
- Asking the author to duplicate architecture into `README.md`. Architecture stays in `AGENTS.md`.
