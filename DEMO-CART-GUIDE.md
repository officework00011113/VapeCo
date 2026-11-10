# Vape Co Starter Kits — Demo cart update

## What changed

- **Cart icon** appears in the floating bottom-right on all HTML pages, with a quantity badge.
- **Starter Kits**: 38 product cards and corresponding detail pages have **Add to Cart** and **Sample price (USD)** labels. The Add to Cart buttons are placed at the **bottom-right** of each product card and the product-detail purchase area on desktop and mobile.
- **cart.html**: browse product photos/names, edit quantity (1–99), remove, see line totals and the sample subtotal, or continue shopping when empty.
- Cart contents are stored **only in the visitor’s browser** in `localStorage` under `vapeco-demo-cart-v1`. Saved handles and quantities are re-priced from the local data file at display time. No customer or payment data is collected by the cart.
- **Demo Checkout** only displays a message; there is no checkout, payment gateway, order creation or success confirmation.
- Existing design, banners, image files, navigation, age confirmation and other functions are retained.

## Edit sample prices

Open **`sample-prices.js`** and change the USD amount next to each product handle (e.g., `"uwell-caliburn-g5-pod-kit": 2.33`). Use a numeric value with no `$` sign. A single edit updates prices on cards, detail pages and cart calculations. All numbers are deliberately *samples*, not quotes or offers.

## Preview / testing

Open `index.html` in a browser, or serve the entire `vapeco-site` directory with any static web server (`python -m http.server 8000`) then visit `http://localhost:8000`. Confirm the 18+ gate. Browse `starter-kits.html`, add items, open `cart.html`, change quantities and remove items; reload and verify quantities persist. Repeat at desktop and mobile widths. **No backend or install is required.**

Note: `localStorage` persists on the same browser + site origin. Private/incognito sessions or storage restrictions may discard data; in that case the demo works for the current page session only.

## Floating bag icon location

The demo cart launcher is the green circular shopping bag at the lower-right on every page, replacing the previous header cart. To adjust its location use `.floating-cart` in `style.css`; `cart.js` updates its quantity badge and accessibility label. The green bag is a cart link, not a WhatsApp widget.
