/* Vape Co demo cart: browser-only, no backend, orders or payments. */
(() => {
  'use strict';
  const STORAGE_KEY = 'vapeco-demo-cart-v1';
  const MAX_QTY = 99;
  let memoryFallback = [];
  const $ = (s, root = document) => root.querySelector(s);
  const money = cents => '$' + (cents / 100).toFixed(2);
  const prices = () => window.VAPECO_SAMPLE_PRICES || {};
  const validHandle = handle => typeof handle === 'string' &&
    Object.prototype.hasOwnProperty.call(prices(), handle) &&
    Number.isFinite(Number(prices()[handle])) && Number(prices()[handle]) >= 0;
  const unitCents = handle => Math.round(Number(prices()[handle]) * 100);
  const productByHandle = handle => (window.VAPECO_STARTER_KITS || []).find(p => p.handle === handle);

  function normalize(input) {
    if (!Array.isArray(input)) return [];
    const results = new Map();
    for (const row of input) {
      if (!row || !validHandle(row.handle)) continue;
      const qty = Number(row.quantity);
      if (!Number.isSafeInteger(qty) || qty < 1) continue;
      results.set(row.handle, Math.min(MAX_QTY, (results.get(row.handle) || 0) + qty));
    }
    return [...results].map(([handle, quantity]) => ({handle, quantity}));
  }

  function readCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) return normalize(memoryFallback);
      return normalize(JSON.parse(raw));
    } catch {
      return normalize(memoryFallback);
    }
  }

  function writeCart(items) {
    const clean = normalize(items);
    memoryFallback = clean;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
    } catch {
      // Keep the cart usable in memory if the browser blocks local storage.
    }
    updateCartViews();
  }

  function totalQuantity(items) { return items.reduce((n, item) => n + item.quantity, 0); }
  function setQty(handle, quantity) {
    if (!validHandle(handle)) return;
    const items = readCart();
    const index = items.findIndex(row => row.handle === handle);
    if (quantity < 1) {
      if (index !== -1) items.splice(index, 1);
    } else if (index === -1) {
      items.push({handle, quantity: Math.min(MAX_QTY, quantity)});
    } else {
      items[index].quantity = Math.min(MAX_QTY, quantity);
    }
    writeCart(items);
  }
  function add(handle) {
    if (!validHandle(handle)) return false;
    const current = readCart().find(row => row.handle === handle);
    setQty(handle, (current?.quantity || 0) + 1);
    return true;
  }

  // Floating bag positioned at the bottom-right (in place of a WhatsApp-style widget).
  // The demo cart uses localStorage and never contacts a payment service.
  function installFloatingCart() {
    document.querySelectorAll('.header-cart').forEach(link => link.remove());
    if ($('.floating-cart')) return;
    const link = document.createElement('a');
    link.className = 'floating-cart';
    link.href = 'cart.html';
    link.setAttribute('aria-label', 'Open demo shopping cart, 0 items');
    link.setAttribute('title', 'View demo cart');
    link.innerHTML = `<svg class="floating-cart-icon" viewBox="0 0 24 24" width="27" height="27" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8h12l1 12H5L6 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg><span class="floating-cart-count" data-cart-count>0</span><span class="floating-cart-tooltip" aria-hidden="true">Demo Cart</span>`;
    document.body.append(link);
    // Prevent access to the floating cart while the existing 18+ gate is visible.
    const gate = $('#age');
    if (gate) {
      const syncAgeGate = () => {
        const blocked = !gate.hidden;
        link.inert = blocked;
        if (blocked) link.setAttribute('aria-hidden', 'true');
        else link.removeAttribute('aria-hidden');
      };
      syncAgeGate();
      new MutationObserver(syncAgeGate).observe(gate, {attributes:true,attributeFilter:['hidden']});
    }
  }

  function updateFloatingCart(items) {
    const count = totalQuantity(items);
    document.querySelectorAll('[data-cart-count]').forEach(el => { el.textContent = String(count); });
    const link = $('.floating-cart');
    if (link) link.setAttribute('aria-label', `Open demo shopping cart, ${count} item${count === 1 ? '' : 's'}`);
  }

  function button(label, cls, aria, action, disabled = false) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = cls; b.textContent = label;
    b.setAttribute('aria-label', aria);
    b.dataset.cartAction = action;
    b.disabled = disabled;
    return b;
  }

  function renderCart(items) {
    const list = $('#cart-items');
    if (!list) return;
    const empty = $('#cart-empty');
    const summary = $('#cart-summary');
    const label = $('#cart-items-count');
    const isEmpty = items.length === 0;
    if (empty) empty.hidden = !isEmpty;
    if (summary) summary.hidden = isEmpty;
    if (label) label.textContent = `${totalQuantity(items)} item${totalQuantity(items) === 1 ? '' : 's'}`;
    list.replaceChildren();
    let subtotalCents = 0;
    for (const item of items) {
      const product = productByHandle(item.handle);
      // Never use saved name, image, or price. Products and prices come from local data files.
      if (!product) continue;
      const cents = unitCents(item.handle);
      subtotalCents += cents * item.quantity;
      const row = document.createElement('article');
      row.className = 'cart-item';
      row.dataset.cartProduct = item.handle;

      const imageLink = document.createElement('a');
      imageLink.className = 'cart-item-photo';
      imageLink.href = 'starter-kit-product.html?product=' + encodeURIComponent(item.handle);
      const pic = document.createElement('img');
      pic.src = product.image; pic.alt = product.name; pic.loading = 'lazy';
      imageLink.append(pic);

      const body = document.createElement('div');
      body.className = 'cart-item-body';
      const brand = document.createElement('p');
      brand.className = 'cart-item-brand'; brand.textContent = product.brand;
      const title = document.createElement('a');
      title.className = 'cart-item-name'; title.href = imageLink.href; title.textContent = product.name;
      const sample = document.createElement('p');
      sample.className = 'cart-item-price'; sample.textContent = `Sample price (USD): ${money(cents)} each`;
      const controls = document.createElement('div'); controls.className = 'cart-item-actions';
      const quantity = document.createElement('div'); quantity.className = 'cart-quantity';
      quantity.setAttribute('role', 'group'); quantity.setAttribute('aria-label', `Quantity for ${product.name}`);
      const minus = button('−', 'cart-qty-btn', `Decrease quantity of ${product.name}`, 'decrease', item.quantity === 1);
      const n = document.createElement('output'); n.className = 'cart-qty-number'; n.textContent = String(item.quantity);
      n.setAttribute('aria-label', `Quantity ${item.quantity}`);
      const plus = button('+', 'cart-qty-btn', `Increase quantity of ${product.name}`, 'increase', item.quantity === MAX_QTY);
      quantity.append(minus, n, plus);
      const remove = button('Remove', 'cart-remove', `Remove ${product.name} from cart`, 'remove');
      controls.append(quantity, remove);
      body.append(brand, title, sample, controls);

      const total = document.createElement('div'); total.className = 'cart-line-total';
      const totalLabel = document.createElement('small'); totalLabel.textContent = 'Line total';
      const totalValue = document.createElement('strong'); totalValue.textContent = money(cents * item.quantity);
      total.append(totalLabel, totalValue);
      row.append(imageLink, body, total);
      list.append(row);
    }
    const subtotal = $('#cart-subtotal');
    if (subtotal) subtotal.textContent = money(subtotalCents);
    const checkoutMessage = $('#checkout-message');
    if (checkoutMessage) checkoutMessage.hidden = true;
  }

  function updateCartViews() {
    const items = readCart();
    updateFloatingCart(items);
    renderCart(items);
  }

  document.addEventListener('click', event => {
    const addButton = event.target.closest('[data-add-to-cart]');
    if (addButton) {
      event.preventDefault();
      if (!add(addButton.dataset.addToCart)) return;
      const status = $('#cart-feedback') || createStatus();
      const item = productByHandle(addButton.dataset.addToCart);
      status.textContent = `${item ? item.name : 'Item'} added to demo cart. Open the bag icon to view.`;
      addButton.classList.add('added-to-cart');
      setTimeout(() => addButton.classList.remove('added-to-cart'), 800);
      return;
    }
    const control = event.target.closest('[data-cart-action]');
    if (control) {
      const row = control.closest('[data-cart-product]');
      if (!row) return;
      const handle = row.dataset.cartProduct;
      const current = readCart().find(item => item.handle === handle);
      if (!current) return;
      if (control.dataset.cartAction === 'remove') setQty(handle, 0);
      if (control.dataset.cartAction === 'decrease') setQty(handle, Math.max(1, current.quantity - 1));
      if (control.dataset.cartAction === 'increase') setQty(handle, Math.min(MAX_QTY, current.quantity + 1));
      return;
    }
    const checkout = event.target.closest('#demo-checkout');
    if (checkout) {
      const message = $('#checkout-message');
      if (message) {
        message.hidden = false;
        message.textContent = 'Demo only — no payment gateway or ordering system is connected. No payment was collected and no order was placed.';
        message.focus();
      }
    }
  });

  function createStatus() {
    const live = document.createElement('p');
    live.id = 'cart-feedback'; live.className = 'sr-only';
    live.setAttribute('role', 'status'); live.setAttribute('aria-live', 'polite');
    document.body.append(live); return live;
  }

  installFloatingCart();
  updateFloatingCart(readCart());
  // Product catalog scripts can load after this script on legacy collection pages.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateCartViews, {once: true});
  } else {
    updateCartViews();
  }
  window.addEventListener('storage', event => {
    if (event.key === STORAGE_KEY || event.key === null) updateCartViews();
  });
  // Small public surface for integration tests / optional custom product buttons.
  window.VapeCoDemoCart = Object.freeze({add, getItems: readCart});
})();
