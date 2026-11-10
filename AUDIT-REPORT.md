# Vape Co technical audit and maintenance report

Date: 10 November 2026

## Scope and result

The uploaded website contained 61 static pages, the Vape Co logo, and 13
reference assets. This version retains every page, image file, image
placement, and page-directory entry while making neutral maintenance fixes.
The complete editable source is included.

The requested external product-image sourcing and prominent full-width
promotional banner redesign were not completed. The Starter Kits detail
image remains labelled as missing. The existing two hero banners retain
their original presentation and sizing. No new external assets were added.

## Completed changes

| Area | Change |
| --- | --- |
| Announcement | Removed the visible placeholder from all 61 pages; disabled by default in editable configuration. |
| Starter Kits Overview | Replaced the pending string with brief neutral descriptive text, editable through `site-content.json`. |
| Rebuild safety | Synced `build.py` with all 13 existing homepage reference-image placements. |
| Search data | Regenerate `pages.json` and `page-directory.js` together. |
| Featured tabs | Cache and restore the original Featured panel so its existing images survive a tab round trip. |
| Navigation | Keep disclosure visibility and ARIA state aligned; add Escape and focus handling. |
| Tab accessibility | Add keyboard selection, roving focus, and matching tab/panel relationships. |
| Carousel accessibility | Add slide labels and a live status while retaining the existing visual treatment. |
| Age confirmation | Handle unavailable session storage; isolate dialog focus and background interactions. |
| Image layout metadata | Add correct intrinsic width and height to every existing image element. |
| Narrow-screen navigation | Add a collapsed menu through the tablet breakpoint and protect flexible elements from intrinsic-width overflow. |
| Packaging | Exclude cached bytecode and nested ZIP files; keep packaging separate from the build. |

## Static verification

| Check | Result |
| --- | --- |
| HTML pages inspected | 61 |
| Local URL reference occurrences | 6,396 |
| Broken relative file references | 0 |
| Broken local fragments | 0 |
| Duplicate HTML IDs | 0 |
| Existing image elements | 196 |
| Missing image alt attributes | 0 |
| Missing or incorrect image dimensions | 0 |
| Original asset files with matching SHA-256 hashes | 14 of 14 |
| Original image placements and order preserved | All 61 pages |
| Local page index entries | 61, matching in both indexes |
| JavaScript syntax | Passed for both scripts |
| Python source compilation | Passed |
| Rebuild regression | All 61 HTML files and both indexes reproduced byte-for-byte in a separate scratch copy. |

These checks establish source, file, and rebuild consistency. They do not
establish browser rendering quality or prove the new interaction behavior.
The exact measurements and asset hashes are included in `AUDIT-DATA.json`.

## Browser verification limitation

Desktop, tablet, and mobile browser testing could not be completed. The
local Chromium process failed before loading a page because its environment
denied a required socket operation. A separate browser tool rejected
local-file navigation under its URL security policy. No workaround was
attempted after that security rejection.

Accordingly, there are no verified browser screenshots, viewport overflow
measurements, click/keyboard interaction results, or mobile crop checks.
The narrow-screen CSS and accessibility changes received source review only.

## Material findings still open

There are **104 static image placeholders across 54 pages**. The original
37 pending category/brand Overviews are now **36** after the Starter Kits
text change. The two other tab panels also retain their existing generated
placeholders; these are not included in the static count.

Both hero source images are 3602 × 1114 pixels and have the same aspect
ratio. Their small visible boxes come from the existing split-column slide,
side padding, and image-height limits. That promotional design was not
changed in this version.

The old image report lists 96 additional source filenames, but none of those
files is included in the upload. A separate complete image archive was not
attached to this request. `MISSING-CONTENT.md` lists every remaining image
placeholder and those absent filenames.

Company history, contact/social details, city store records, articles, and
policy wording remain unverified or pending. No details were invented.
The contact and complaints forms still validate locally without sending
messages. The website still has no checkout, product-listing, or payment
backend. Age confirmation remains a UI prompt, not identity verification.

## Editing

Use `site-content.json` for the announcement and approved Overview text.
Run `python3 build.py` after editing source, then `python3 package.py` to
create an updated ZIP. See `README.md` for complete instructions.

## Bundled image inventory

| File | Dimensions | Bytes | Integrity |
| --- | --- | ---: | --- |
| `assets/logo.png` | 2048 × 682 | 845,715 | Unchanged |
| `assets/reference-images/004_7_8.webp` | 3602 × 1114 | 236,127 | Unchanged |
| `assets/reference-images/008_5_8_1.webp` | 3602 × 1114 | 220,481 | Unchanged |
| `assets/reference-images/029_SM2.webp` | 450 × 270 | 80,762 | Unchanged |
| `assets/reference-images/030_SM1.webp` | 450 × 270 | 103,745 | Unchanged |
| `assets/reference-images/031_SM3.webp` | 450 × 270 | 90,040 | Unchanged |
| `assets/reference-images/035_black-leather-oxva-nexlim-2-dual-mesh-2026_3.webp` | 600 × 600 | 25,190 | Unchanged |
| `assets/reference-images/037_saltnic_drytobacco_25mg.png` | 700 × 700 | 208,004 | Unchanged |
| `assets/reference-images/042_voopoo-logo.png` | 230 × 85 | 3,913 | Unchanged |
| `assets/reference-images/043_OXVA_Banner_Square_Resized.png` | 497 × 84 | 11,896 | Unchanged |
| `assets/reference-images/050_SMOK.png` | 900 × 500 | 16,287 | Unchanged |
| `assets/reference-images/051_juul.png` | 230 × 85 | 2,529 | Unchanged |
| `assets/reference-images/058_infinity.png` | 230 × 85 | 9,361 | Unchanged |
| `assets/reference-images/059_Uwell.webp` | 900 × 900 | 14,474 | Unchanged |
