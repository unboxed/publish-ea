# Local Government Architecture Model (LGAM)

A guide to the public technology layers that are used to deliver local public services.

**Live site:** [architecture.cddo.cabinetoffice.gov.uk/gds-local/](https://architecture.cddo.cabinetoffice.gov.uk/gds-local/)

LGAM is a sector-specific technology reference architecture — a shared map of the digital estate used to deliver local public services. It describes local government technology as a stack of nine layers, from citizen-facing channels down to foundational infrastructure.

## The 9 layers

| Layer | Description |
|---|---|
| Public Channels | How citizens reach the council (online, phone, in person, post) |
| Council Interfaces | Technical components that handle interactions (websites, API gateways, apps) |
| Capabilities | Shared technology platforms (payments, forms, identity, booking) |
| Business Areas | Domain-specific systems (adult social care, planning, housing — 12 domains) |
| Corporate Areas | Cross-domain systems (finance, HR, procurement — 10 domains) |
| Foundational Technology | Infrastructure & platforms (AI, DevOps, end user, service management, hosting) |
| Integration | Middleware, APIs, data pipelines |
| Security | IAM, SOC, endpoint protection, vulnerability management |
| Data & Information | BI, data governance, document management, geospatial |

## Getting started

**Prerequisites:**
- Node.js (for npm)
- Python 3
- Dart Sass (installed via npm dependencies)

**Setup:**
```bash
cd gds-local
npm install
```

**Building pages:**
```bash
python3 _build/build.py
```

This compiles SCSS, copies the GOV.UK Frontend JS bundle, and assembles HTML pages from shared partials (`_build/_partials/`) and page sources (`_build/_pages/`). See `_build/WORKFLOW.md` for full details.

**Editing content:**
- Subpages: edit source files in `_build/_pages/`, then rebuild
- Main index: edit `index.html` directly (hand-authored)
- Styles: edit SCSS in `src/scss/components/`, then rebuild

Do not edit generated HTML files in root or `preview/` directly — they're overwritten by the build.

## Contributing

1. Fork the repository
2. Create a branch for your changes
3. Edit source files and rebuild
4. Commit both sources and generated output
5. Open a PR against [gds-dtx/publish-ea](https://github.com/gds-dtx/publish-ea)

See `_build/WORKFLOW.md` for the publication status system (published/draft/modified).

## Project structure

```
gds-local/
├── index.html                  # Main LGAM page (hand-authored)
├── gds-local-alt.html          # Interactive graph view (hand-authored)
├── _build/
│   ├── build.py                # Build script
│   ├── _partials/              # Shared HTML fragments
│   ├── _pages/                 # Page source files (edit these)
│   ├── _hand/                  # Working copies of hand-authored pages
│   └── generate_taxonomy_workbench.py
├── preview/                    # Generated preview pages (all statuses)
├── css/                        # Compiled CSS (generated)
├── js/                         # JavaScript (GOV.UK Frontend + feedback modal)
├── src/scss/                   # SCSS source files (edit these)
├── resources/                  # JSON data models and reference data
│   └── taxonomy/               # ESD taxonomy data for the mapping workbench
└── json/                       # External graph data
```

## Further documentation

- `AGENTS.md` — detailed codebase guidance for AI coding assistants
- `_build/WORKFLOW.md` — build system and publication workflow
- `resources/README.md` — JSON data file inventory
- `resources/lgam_architectural_principles.md` — LGAM architectural principles
