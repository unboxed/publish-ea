# AGENTS.md

This file provides guidance to OpenCode and Claude Code when working with code in this repository.

## Scope

Work in this session is scoped to the `gds-local/` folder only. The parent `publish-ea` repository contains other architecture resources — ignore them unless explicitly asked.

## What This Is

GDS Local is the **Local Government Architecture Model (LGAM)** — a 9-layer reference architecture for UK local government digital services. It is part of the wider PublishEA enterprise architecture resource library.

The upstream repository is `https://github.com/gds-dtx/publish-ea`. Deployment is via **GitHub Pages** (auto-deploys on merge to main). Live at `architecture.cddo.cabinetoffice.gov.uk/gds-local/`.

## Development

This project uses the official `govuk-frontend` NPM package for styling and JavaScript, plus `@ministryofjustice/frontend` for the feedback modal dialog component.

**Prerequisites:**
- Node.js (for `npm` and `npx`)
- Python 3 (for the build script)
- Dart Sass (via `npx sass`, installed as a dependency of govuk-frontend)

**Workflow:**
1. Install dependencies: `npm install` (within `gds-local/`)
2. Edit custom styles in `src/scss/`
3. Edit page content in `_build/_pages/`
4. Run the build script: `python3 _build/build.py`

### Customisation Approach

To ensure updates to GOV.UK Frontend do not break LGAM customizations, we use an override-first approach:
- **Never modify `govuk-frontend` files directly.**
- GOV.UK Frontend is imported via `@use` with configuration in `src/scss/application.scss`:
  ```scss
  @use "node_modules/govuk-frontend/dist/govuk/index" as * with (
    $govuk-assets-path: "../assets/"
  );
  ```
- Component-specific overrides (like `_lgam-accordion.scss`, `_lgam-tags.scss`, `_taxonomy-workbench.scss`) are imported *after* the GOV.UK dependency using `@import`.
- Use `@extend` targeting vanilla classes (e.g. `@extend .govuk-tag`) or custom variables (`%lgam-tag-base`) whenever possible rather than duplicating CSS blocks.

### Build system for subpages

Subpages (everything except `index.html` and `gds-local-alt.html`) are **generated** by a Python build script from shared partials + per-page source files:

```bash
python3 _build/build.py
```

This script:
1. Compiles `src/scss/application.scss` to `css/application.css` using Dart Sass (via `npx sass`).
2. Copies the UMD JavaScript bundle (`all.bundle.js`) from `node_modules` to `js/govuk-frontend.min.js`.
3. Assembles the output HTML files from `_build/_partials/` (header, footer) and `_build/_pages/` (content).

**Do not edit generated HTML files directly** — edit the source in `_build/_pages/` instead, then re-run `build.py`. Generated files are committed to git for legacy GitHub Pages deploy-from-branch.

The build script also generates a local preview index at `preview/directory.html`, grouping pages by folder hierarchy.

### Page source format

Each `_build/_pages/*.html` file has front matter and tagged content blocks:

```html
---
title: Page Title
caption: LGAM Capabilities
status: published
description: "Summary outlining the purpose and content design concept of the page"
layout: default
parent: "../index.html"
parent_title: "Parent Page"
redirect_from:
  - "old-path.html"
---
<style>/* page-specific CSS */</style>
<nav-contents><!-- sidebar Contents li items --></nav-contents>
<main-content><!-- main page content --></main-content>
<page-script>/* optional page-specific JS */</page-script>
<page-modules>tenders</page-modules>
<page-history><!-- optional version history --></page-history>
```

**Front matter fields:**
- `title` — page heading (required)
- `caption` — subtitle / layer label (optional, shown in preview directory)
- `status` — `published` | `draft` | `modified` (controls linking from index and build output location)
- `description` — shown in the preview directory listing (optional)
- `layout` — `default` (sidebar + main) or `full-width` (no sidebar)
- `parent` / `parent_title` — back-link for hierarchical navigation (optional)
- `redirect_from` — generates a redirect shim at the old path (optional)

**Content blocks:**
- `<nav-contents>` — sidebar navigation list items
- `<main-content>` — primary page content (required)
- `<page-script>` — inline JavaScript (optional)
- `<page-modules>` — comma-separated partial names to include (e.g. `tenders` loads `_partials/script-tenders.html`)
- `<page-history>` — version history shown in a collapsible details element (optional)

**Statuses and index linking:**
- `published` — built to root (live) AND preview/. `build.py` automatically adds a "View X detail →" link in the matching `index.html` section.
- `draft` — built to preview/ only. No link appears in `index.html`.
- `modified` — built to preview/ only (root keeps last-published version). Link remains in `index.html` pointing to the root (last-published) version.

## Architecture: The 9-Layer Model

The LGAM describes local government technology as a stack of nine layers (top to bottom):

1. **Public Channels** — how citizens reach the council (Online, Phone, In Person, Post, etc.)
2. **Council Interfaces** — interfaces that handle interactions (Website, API Gateway, App, Human, Chatbot, etc.)
3. **Capabilities** — reusable functional tools (Payments, Forms, Identity, Booking, Workflow, Notifications, etc.)
4. **Business Areas** — service domains (Planning, Housing, Adult Social Care, Children's Social Care, etc.)
5. **Corporate Areas** — back-office functions (Finance, HR, Procurement, Legal, Facilities, etc.)
6. **Foundational Technology** — underlying platforms subdivided into:
   - Artificial Intelligence
   - Developer and Operations Tooling
   - End User and Productivity
   - Service Management
   - Infrastructure & Hosting
7. **Integration** — data exchange, APIs, messaging, bulk data movement
8. **Security** — cyber security, identity management, access control
9. **Data and Information** — standards, sharing, analytics, registers

Relationships flow downward: channels route to interfaces, interfaces use capabilities, capabilities support business/corporate areas, all underpinned by foundational technology, integration, security, and data layers.

## Key Files

| File | Purpose |
|---|---|
| `index.html` | Main LGAM page — hand-authored, sidebar nav, coloured layer blocks |
| `gds-local-alt.html` | Interactive graph view using **Vis.js Network** — hand-authored |
| `_build/build.py` | Build script — compiles SCSS, assembles subpages from partials + page sources |
| `_build/_partials/` | Shared HTML fragments (header, footer, sidebar-lgam, script modules) |
| `_build/_pages/` | Page source files (edit these to change subpage content) |
| `_build/generate_taxonomy_workbench.py` | Generates the ESD→LGAM taxonomy mapping workbench page |
| `preview/directory.html` | **Generated** — Local preview index grouping drafts and modifications |
| `js/feedback-modal.js` | Progressive enhancement — feedback modal (MoJ dialog pattern) |
| `js/govuk-frontend.min.js` | **Copied** — GOV.UK Frontend JS bundle |
| `resources/` | JSON data models (multiple historical versions — see `resources/README.md` for inventory) |
| `resources/taxonomy/` | ESD taxonomy data (functions, services, hierarchy, powers & duties, LGAM mapping) |

## Tech Stack & Asset Dependencies

- **GOV.UK Frontend 6.3** (CSS + JS) compiled locally via npm/Dart Sass — provides Design System components (accordions, details, header, footer, radios, textareas, tags)
- **MoJ Frontend** (`@ministryofjustice/frontend`) — dialog pattern reference for the feedback modal
- **Vis.js Network** via unpkg — interactive graph rendering in `gds-local-alt.html`
- **Tailwind CSS** via CDN — used only in `gds-local-alt.html`
- **GDS Transport** web font with Arial fallback

All pages initialise GOV.UK Frontend JS using local paths. `build.py` handles the prefixing to ensure relative paths resolve correctly from subdirectories:
```html
<script src="{{ prefix }}js/govuk-frontend.min.js"></script>
<script>
  window.GOVUKFrontend.initAll();
</script>
```

## Customising the Frontend (Sass / CSS)

All styling is managed in `src/scss/`. **Do not** edit `css/application.css` directly, as it will be overwritten by `build.py`.

1. **GOV.UK Frontend is imported with `@use`** in `src/scss/application.scss`:
   ```scss
   @use "node_modules/govuk-frontend/dist/govuk/index" as * with (
     $govuk-assets-path: "../assets/"
   );
   ```
2. **Custom component styles** live in `src/scss/components/` — imported via `@import` after the `@use` directive. Current components: `_layout.scss`, `_shared-components.scss`, `_lgam-accordion.scss`, `_lgam-tags.scss`, `_index.scss`, `_taxonomy-workbench.scss`, `_feedback-modal.scss`.
3. **Recompiling**: Run `python3 _build/build.py` from the `gds-local` directory. The script calls `npx sass --load-path=. src/scss/application.scss css/application.css`.

## GOV.UK Frontend v6 Header Layout Note

In GOV.UK Frontend v6, the standard `govuk-header` component was split, removing the inline service name and moving it to a new `govuk-service-navigation` band. To preserve vertical space, we have manually recreated the v5 inline layout classes (`.govuk-header__content`, `.govuk-header__service-name`) in `src/scss/components/_index.scss`. 
**Do not** replace the header layout with `govuk-service-navigation` unless explicitly requested. Keep the service name inline inside the `govuk-header`.

## Data Models

**There is no single canonical JSON model yet.** Multiple historical JSON files exist in `resources/` representing different iterations and purposes (graph view, system registry, ESD mapping). See `resources/README.md` for a detailed inventory of each file, its format, and what (if anything) loads it.

The agreed structural hierarchy for LGAM is:

```
Layer → [Sublayer] → Domain → Component
         optional
```

- **Layer** — one of the 9 top-level technology concerns
- **Sublayer** — optional intermediate grouping (only Foundational Technology currently uses these: AI, DevOps, End User, Service Management, Infrastructure)
- **Domain** — named technology grouping at the working level (e.g. "Adult Social Care", "Generative AI", "API Management"). This is the universal term regardless of which layer a domain sits in.
- **Component** — individual technology element (e.g. a specific platform or system)

`gds-local-alt.html` inlines its graph data (originally from `lgam-data-lgaFunctions.json`) rather than fetching it at runtime. The inline data and the JSON files are **not currently in sync**.

## Feedback Mechanism

User feedback is collected via a **service navigation link** ("Give feedback") rather than a phase banner. This link:
- **Without JS (base):** navigates to a `mailto:` with pre-filled subject line
- **With JS (enhanced):** opens a modal dialog (following the MoJ Design System dialog pattern) with structured prompts, then constructs a richer mailto on submit

Per-page "suggest a change" links appear at the bottom of each built subpage. A full structured survey (MS Forms, to be replaced with GOV.UK Forms when governance allows) is linked from the site footer.

## Design Conventions

- Follow **GOV.UK Design System** patterns: https://design-system.service.gov.uk/
- Use the GOV.UK colour palette — each layer has a distinct colour (see Taxonomy Colours below)
- All pages carry a **service nav** with Documentation, Contact, and Give feedback links
- New subpages: create a file in the appropriate taxonomy-aligned folder (e.g., `_build/_pages/business-area/`) or a specific `topics/` folder (e.g. for cross-cutting concepts like the data sharing hub). Set `status: draft`, run `build.py`, iterate, then flip to `status: published` when ready
- Ensure accessibility: skip links, semantic HTML, sufficient contrast, ARIA attributes where needed

## Content Development Rules

- **Taxonomy Alignment:** Always check capabilities and business areas against the official taxonomy before adding them to pages. Do not deviate from the exact naming. Use `resources/lgam-data.json` or `_hand/lgam-content-tracker.csv` as the source of truth for LGAM nodes.
- **British English:** Always use British English spellings (e.g., categorise, centre, colour, cancelling).
- **Architectural Principles:** Ensure all domain and capability designs are consistent with the principles defined in `resources/lgam_architectural_principles.md`. If there is a compelling domain-specific reason to deviate, this must be discussed between you and the user and potentially recorded in the principles document. **Do not** include these internal debates or justifications in the public-facing HTML pages.

## LGAM Taxonomy Colours

When adding or styling elements for each LGAM layer, use the following hex codes for consistency:

- **Public Channels:** `#CC00CC`
- **Council Interfaces:** `#800080`
- **Capabilities:** `#000080`
- **Business Areas:** `#0000FF`
- **Corporate Areas:** `#696969`
- **Foundational Technology:** `#008080`
  - Artificial Intelligence: `#006400`
  - Developer and Operations Tooling: `#008000`
  - End User and Productivity: `#228B22`
  - Service Management: `#2E8B57`
  - Infrastructure & Hosting: `#556B2F`
- **Integration:** `#6B6B00`
- **Security:** `#CC0000`
- **Data and Information:** `#800000`
