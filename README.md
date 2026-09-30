# REDEFREIRAUM static rebuild

This package was rebuilt directly from the original saved Jimdo pages.

- Public HTML files are at the repository root for GitHub Pages.
- Shared files live under `assets/`.
- Jimdo renderer JavaScript has been removed and replaced by `assets/js/site.js`.
- Desktop dropdowns, mobile navigation, and content accordions are implemented statically.
- All original visible text from the supplied archive is preserved.
- Jimdo CDN content images remain referenced from their original image URLs because the supplied browser save did not contain those image files. Each image now has a normal `src` fallback in addition to `srcset`, so it no longer depends on Jimdo's lazy-loader.
- AGB and the separate Hypnose FAQ page were not in the supplied archive; links to those pages remain pointed at the live site.

GitHub Pages: Settings > Pages > Deploy from branch > main > /(root).
