# resources/

Data files supporting the LGAM site. Multiple JSON models exist from different iterations — consolidation is planned but not yet done.

## LGAM Model Files

### lgam-data.json
**Format:** Graph (types/nodes/edges)
**Created:** April 2026
**Status:** Not loaded at runtime — a newer iteration of the model with 9-layer types (PublicChannel, CouncilAgent, Capability, ITSystem, FunctionGroup, Layer, FoundationalTechnology, Integration, Security, DataAndInfo). Contains 93 nodes, 94 edges. Relationships: ROUTES_TO, USES, PROVIDED_BY, REALIZES. The lower-layer edges (PROVIDED_BY, REALIZES) are known to be brittle — they assert council-specific system/domain relationships as universal truths.

### lgam-data-lgaFunctions.json
**Format:** Graph (types/nodes/edges)
**Created:** April 2026
**Status:** Source data for `gds-local-alt.html` (inlined, not fetched). Contains 229 nodes, 414 edges. Extends the base graph model with 163 LGA/ESD Function nodes and PART_OF hierarchy relationships. Uses a simpler 5-type model (PublicChannel, CouncilAgent, Capability, ITSystem, Function, FunctionGroup) without the lower architecture layers.

### lgam-register-data.json
**Format:** Taxonomy registry + system catalogue
**Created:** May 2026
**Status:** Not loaded at runtime. Most structured file — layers, domains, capabilities, and 38 systems with metadata (lifecycle, hosting, contracts, dependencies). Missing Public Channels and Council Interfaces layers. FT subdomain colours not yet added (canonical colours are in AGENTS.md).

## taxonomy/

ESD (Electronic Service Delivery) taxonomy data used by the taxonomy mapping workbench.

### lgam-to-esd-mapping.json
**Format:** Domain → ESD function mappings with full service hierarchy
**Created:** August 2026
**Status:** Active — used at build time by `generate_taxonomy_workbench.py` and at runtime by `taxonomy-mapping.html`. Contains 22 LGAM domains mapped to 176 ESD functions and 210 child services.

### esd-functions.json
Raw ESD functions list (176 entries). Source data, not directly loaded by any page.

### esd-functions-hierarchy.json
ESD function hierarchy with parent-child relationships. Used by `generate_taxonomy_workbench.py` at build time.

### esd-services.json
Raw ESD services list. Source data, not directly loaded by any page.

### esd-powers-and-duties.json
ESD statutory powers and duties. Used by `generate_taxonomy_workbench.py` to populate the inspector pane.

## Other files

### planning_and_development.html
A standalone resource/prototype page for the Planning & Development domain — not part of the build system.
