# For GitHub Pages deployment, read [GITHUB-PAGES-SETUP.md](GITHUB-PAGES-SETUP.md) first.

# Vape Co — complete static website with demo cart

This package includes the existing page design, banners, local product photography,
brand/category/store-information pages, and the **Starter Kits demo shopping cart**. Open
`index.html`, or serve the `vapeco-site` folder from any basic static web server.
No build system, app store, backend or internet connection is needed to view pages.

## Demo cart

- Floating bottom-right shopping-bag icon (WhatsApp-style placement) and live item badge on every page; header cart is intentionally removed.
- All 38 Starter Kits cards and their shared product-detail page support **Add to Cart**.
- Separate `cart.html`: product images, quantity changes, remove, USD sample subtotal,
  empty state and Continue Shopping.
- Contents persist in **localStorage** in the same browser/site origin. On browsers
  that block storage, interactions work in memory but cannot persist across reloads.
- **Demo Checkout** does not collect payments, create orders or claim order success.
- Every price is clearly labeled an illustrative **sample price (USD)**; no product
  pricing or availability has been verified.

**Edit prices in `sample-prices.js`.** Every Starter Kit has its own editable entry.
Changes automatically apply to cards, detail pages, cart and sorting. See
`DEMO-CART-GUIDE.md` for specific examples and test steps.

## Site content and regeneration

- `site-content.json` contains editable announcement and Overview text.
- `style.css`, `site.js`, `collection.js` and `cart.js` control layout and behaviour.
- `starter-kits-products.js` contains product names, handles and local images.
- All HTML is already generated and deployable as-is.
- `build.py` remains included for legacy page scaffolding and search indexes. It now
  **preserves every existing HTML file** to ensure that regenerating an index cannot
  erase the hand-polished homepage, premium footers, starter kit collection or cart.
- `python3 package.py --output ../VapeCo-Updated-Demo-Cart.zip` repackages the site.

## Premium design update (November 2026)

- Sticky, softly blurred black header on every page with more polished logo/search/navigation styles.
- Homepage uses an Apple-inspired minimal dark aesthetic with spacious cards, original full-bleed two-slide banners, subtle lime accents and improved responsive spacing.
- Full premium footer on every HTML page, with useful categories, brand links, policies, and a clear 18+ / demo disclaimer.
- The green floating shopping bag sits on the lower-right like the example WhatsApp launcher, **instead of** the previous header cart. Icon count, aria label and localStorage demo cart work as before.
- All assets are bundled locally; no external image or chat provider is required. The example WhatsApp/Chat widgets are **not** installed.

## Existing functionality and limits

The home carousel, navigation, featured category tabs, existing images and banners,
contact/complaints validation, search and 18+ UI were retained. Search uses local
page titles. The general contact form can email an enquiry when hosted on PHP and configured; complaints validation remains demo-only. The 18+ UI is session-based, not
identity verification. Some original content and commercial claims are placeholders
pending approval. Products and prices shown for testing are not real offers.

## Quality checks

The cart was exercised in headless Chromium using the original HTML/CSS/scripts
in an isolated test harness at 1440px desktop, 390px mobile and 320px small-mobile
widths. Checks included adding from cards and product details, counts, quantities,
removal, totals, empty state, visible demo checkout warning and restoring a saved
cart state across page re-renders. All 38 product image paths and JavaScript syntax
were checked. The restricted test environment blocked direct browser navigation to
local URLs, so full HTTP navigation and real browser reload were not verified there.
See `DEMO-CART-GUIDE.md` for how to test in your own browser after hosting.

Historical audit and imagery reports remain included for reference.

## November 2026 updates: age contrast, locations, contact email

- The white 18+ confirmation popup now has explicit dark title, body, small-print and button text across desktop and mobile.
- Removed all 10 unverified Pakistan city store pages from navigation, search index and deliverable. `locations.html` now shows a neutral store information message with a general contact link.
- Added **non-transactional** PHP general contact email endpoint (`api/contact.php`), wired to the Contact Us page. It requires hosting email setup and your actual recipient address before sending works. See `CONTACT-BACKEND-SETUP.md`.
- All cart items and prices remain **demonstration-only**. There is no payment processing, delivery booking, real order submission, or product-fulfillment system.
