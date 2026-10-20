# Completed Clearline asset library

`src/visuals/clearline.js` is the custom code-native vector renderer preserved unchanged from commit `a0ba4f0e7cb9961c5e956a7abe34a3dab6c1140b`. It covers 125 ingredient identities and 225 prepared dishes, including existing Medium/Hard visual differences and the corrected rolled burritos, open wraps, sandwiches, bowls, and subs.

`asset-manifest.json` provides names, categories/families, and visual component IDs for offline QA. The component lists contain no scored quantities and are not canonical game recipes. Including completed artwork for future dishes does not activate or approve experimental content.

Automated checks cover every ID in both visual modes, explicit prepared-dish presentations, distinct SVG bodies, missing-ID failures, and absence of emoji or externally loaded image/script content. Automated uniqueness does not guarantee that every dish is effortless to recognize at 40 px; the preserved artwork is unchanged, and activating it in the playable interface requires a separate review.

This library is intentionally inactive in this PR. The existing game imports, page markup, styles, service worker, mechanics, and build script are unchanged, so the renderer is not shipped in `dist/`. No preview routes, animations, UI controls, experimental puzzles, or new game features are introduced here.
