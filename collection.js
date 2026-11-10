(() => {
  const root = document.querySelector('[data-collection]');
  if (!root) return;
  const sidebar = root.querySelector('.collection-sidebar');
  const toggle = root.querySelector('.filter-toggle');
  const sort = root.querySelector('#sort');
  const brand = root.querySelector('#brand');
  const grid = root.querySelector('.collection-grid');
  const count = root.querySelector('.item-count');
  const catalog = [...(window.VAPECO_APPROVED_PRODUCTS || []), ...(window.VAPECO_STARTER_KITS || [])]
    .filter(product => product.category === root.dataset.collection);
  const isStarter = p => p.category === 'Starter Kits';
  const demoPrice = p => window.VAPECO_SAMPLE_PRICES?.[p.handle];
  const getPrice = p => isStarter(p) ? Number(demoPrice(p)) : Number(p.price);
  const dollar = value => '$' + Number(value).toFixed(2);

  toggle?.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(sidebar.classList.contains('open')));
  });

  function render() {
    const rows = catalog.filter(p => String(p.brand || '').toLowerCase().includes(brand.value.toLowerCase()));
    const v = sort.value;
    if (v === 'az' || v === 'za') rows.sort((a, b) => String(a.name).localeCompare(String(b.name)) * (v === 'az' ? 1 : -1));
    if (v === 'low' || v === 'high') rows.sort((a, b) => (getPrice(a) - getPrice(b)) * (v === 'low' ? 1 : -1));
    count.textContent = rows.length + ' items';
    grid.replaceChildren();
    if (!rows.length) {
      const el = document.createElement('div'); el.className = 'collection-empty';
      const h = document.createElement('h2'); h.textContent = catalog.length ? 'No matching items' : 'Approved product catalog unavailable';
      const note = document.createElement('p');
      note.textContent = catalog.length ? 'Try a different brand filter.' : 'Individual product names, prices and matching product images were not included in the supplied files.';
      el.append(h, note); grid.append(el); return;
    }
    for (const p of rows) {
      const el = document.createElement('article'); el.className = 'collection-card';
      const productUrl = p.gallery ? 'starter-kit-product.html?product=' + encodeURIComponent(p.handle) : '#';
      if (p.image && p.image.startsWith('assets/')) {
        const imageLink = document.createElement('a'); imageLink.href = productUrl; imageLink.className = 'collection-image';
        const image = document.createElement('img'); image.src = p.image; image.alt = p.name; image.loading = 'lazy'; image.decoding = 'async';
        imageLink.append(image); el.append(imageLink);
      }
      const label = document.createElement('p'); label.className = 'collection-brand'; label.textContent = p.brand || ''; el.append(label);
      const name = document.createElement('a'); name.className = 'collection-name'; name.href = productUrl; name.textContent = p.name; el.append(name);
      const price = document.createElement('p'); price.className = 'collection-price';
      if (isStarter(p) && Number.isFinite(getPrice(p))) {
        price.textContent = 'Sample price (USD): ' + dollar(getPrice(p));
        price.classList.add('sample-price');
      } else {
        price.textContent = p.price == null ? 'Price not provided' : (p.currency || '') + ' ' + p.price;
      }
      el.append(price);
      if (isStarter(p) && Number.isFinite(getPrice(p))) {
        const add = document.createElement('button'); add.type = 'button';
        add.className = 'add-to-cart'; add.dataset.addToCart = p.handle;
        add.textContent = 'Add to Cart'; add.setAttribute('aria-label', `Add ${p.name} to demo cart`);
        el.append(add);
      }
      grid.append(el);
    }
  }
  brand.addEventListener('input', render);
  sort.addEventListener('change', render);
  render();
})();
