/* Shopping cart - quantities only, no totals */
(function () {
  const STORAGE_KEY = 'zv_cart_v1';

  function loadCart() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function saveCart(cart) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cart:update', { detail: { cart } }));
  }

  function itemCount(cart) {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }

  window.ZV_Cart = {
    get() { return loadCart(); },

    add(id, qty) {
      const cart = loadCart();
      cart[id] = (cart[id] || 0) + (qty || 1);
      saveCart(cart);
    },

    setQty(id, qty) {
      const cart = loadCart();
      if (qty <= 0) delete cart[id];
      else cart[id] = qty;
      saveCart(cart);
    },

    remove(id) {
      const cart = loadCart();
      delete cart[id];
      saveCart(cart);
    },

    clear() {
      saveCart({});
    },

    count() {
      return itemCount(loadCart());
    },

    lines() {
      const cart = loadCart();
      return Object.entries(cart).map(([id, qty]) => ({
        id,
        qty,
        name: window.ZV_getProductName(id),
      }));
    },

    formatForSubmit(extraText) {
      const lines = this.lines();
      const parts = [];
      if (lines.length) {
        parts.push('Warenkorb:');
        lines.forEach(l => parts.push(`${l.qty}× ${l.name}`));
      }
      const extra = (extraText || '').trim();
      if (extra) {
        if (parts.length) parts.push('');
        parts.push('Weitere Wünsche:');
        parts.push(extra);
      }
      return parts.join('\n');
    },

    tentSummary() {
      const cart = loadCart();
      const sizes = [];
      let count = 0;
      window.ZV_TENTS.forEach(t => {
        const qty = cart[t.id] || 0;
        if (qty > 0) {
          count += qty;
          sizes.push(`${t.code} (${t.dims})${qty > 1 ? ' ×' + qty : ''}`);
        }
      });
      return { count: count || null, sizes: sizes.length ? sizes.join(', ') : null };
    },
  };

  function buildCartUI() {
    const fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'cart-fab';
    fab.id = 'cartFab';
    fab.setAttribute('aria-label', 'Warenkorb öffnen');
    fab.innerHTML = `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
      <span class="cart-fab__badge" id="cartBadge" hidden>0</span>`;

    const overlay = document.createElement('div');
    overlay.className = 'cart-overlay';
    overlay.id = 'cartOverlay';
    overlay.hidden = true;

    const panel = document.createElement('aside');
    panel.className = 'cart-panel';
    panel.id = 'cartPanel';
    panel.setAttribute('aria-label', 'Warenkorb');
    panel.innerHTML = `
      <div class="cart-panel__head">
        <h3>Ihr Warenkorb</h3>
        <button type="button" class="cart-panel__close" id="cartClose" aria-label="Schließen">&times;</button>
      </div>
      <div class="cart-panel__body" id="cartBody"></div>
      <div class="cart-panel__foot">
        <button type="button" class="btn btn--light cart-panel__clear" id="cartClear">Warenkorb leeren</button>
        <a href="#kontakt" class="btn btn--green" id="cartToForm">Zur Anfrage →</a>
      </div>`;

    document.body.appendChild(fab);
    document.body.appendChild(overlay);
    document.body.appendChild(panel);

    function openCart() {
      overlay.hidden = false;
      panel.classList.add('open');
      document.body.classList.add('cart-open');
      renderCartBody();
    }

    function closeCart() {
      overlay.hidden = true;
      panel.classList.remove('open');
      document.body.classList.remove('cart-open');
    }

    fab.addEventListener('click', openCart);
    overlay.addEventListener('click', closeCart);
    document.getElementById('cartClose').addEventListener('click', closeCart);
    document.getElementById('cartClear').addEventListener('click', () => {
      window.ZV_Cart.clear();
      renderCartBody();
      updateFormPreview();
    });
    document.getElementById('cartToForm').addEventListener('click', () => {
      closeCart();
      if (typeof closeMenu === 'function') closeMenu();
      updateFormPreview();
    });

    function renderCartBody() {
      const body = document.getElementById('cartBody');
      const lines = window.ZV_Cart.lines();
      if (!lines.length) {
        body.innerHTML = '<p class="cart-empty">Noch keine Artikel - wählen Sie Zelte oder Material aus der Preisliste.</p>';
        return;
      }
      body.innerHTML = lines.map(l => `
        <div class="cart-line" data-id="${l.id}">
          <div class="cart-line__info">
            <span class="cart-line__name">${escapeHtml(l.name)}</span>
          </div>
          <div class="cart-line__qty">
            <button type="button" class="cart-qty-btn" data-action="dec" aria-label="Menge verringern">-</button>
            <span class="cart-qty-val">${l.qty}</span>
            <button type="button" class="cart-qty-btn" data-action="inc" aria-label="Menge erhöhen">+</button>
          </div>
          <button type="button" class="cart-line__remove" aria-label="Entfernen">&times;</button>
        </div>`).join('');

      body.querySelectorAll('.cart-line').forEach(row => {
        const id = row.dataset.id;
        row.querySelector('[data-action="dec"]').addEventListener('click', () => {
          const cur = window.ZV_Cart.get()[id] || 0;
          window.ZV_Cart.setQty(id, cur - 1);
          renderCartBody();
          updateFormPreview();
        });
        row.querySelector('[data-action="inc"]').addEventListener('click', () => {
          window.ZV_Cart.add(id, 1);
          renderCartBody();
          updateFormPreview();
        });
        row.querySelector('.cart-line__remove').addEventListener('click', () => {
          window.ZV_Cart.remove(id);
          renderCartBody();
          updateFormPreview();
        });
      });
    }

    function updateBadge() {
      const n = window.ZV_Cart.count();
      const badge = document.getElementById('cartBadge');
      badge.textContent = String(n);
      badge.hidden = n === 0;
    }

    window.addEventListener('cart:update', () => {
      updateBadge();
      if (panel.classList.contains('open')) renderCartBody();
    });

    updateBadge();
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  function renderPriceRow(p, allItems) {
    const note = p.note ? `<span class="price-note-inline">${escapeHtml(p.note)}</span>` : '';
    const expandBtn = p.priceExpandId
      ? `<button type="button" class="price-expand-toggle" aria-expanded="false" aria-label="Mit / ohne Biertischgarnitur anzeigen"><svg class="price-expand-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>`
      : '';
    let rows = `
      <tr class="price-row">
        <td><div class="price-row__title"><span class="price-row__name">${escapeHtml(p.name)}</span>${expandBtn}</div>${note}</td>
        <td>${window.ZV_formatPrice(p.day)}</td>
        <td>${window.ZV_formatPrice(p.we)}</td>
        <td><button type="button" class="btn btn--green btn--sm price-add" data-id="${p.id}">Hinzufügen</button></td>
      </tr>`;
    if (p.priceExpandId) {
      const alt = allItems.find(x => x.id === p.priceExpandId);
      if (alt) {
        rows += `
      <tr class="price-row-expand" hidden>
        <td><span class="price-row__name price-row__name--alt">${escapeHtml(alt.name)}</span></td>
        <td>${window.ZV_formatPrice(alt.day)}</td>
        <td>${window.ZV_formatPrice(alt.we)}</td>
        <td><button type="button" class="btn btn--green btn--sm price-add" data-id="${alt.id}">Hinzufügen</button></td>
      </tr>`;
      }
    }
    return rows;
  }

  function activatePriceTab(catId) {
    const root = document.getElementById('priceListRoot');
    if (!root) return false;
    const tabs = root.querySelector('.price-tabs');
    const panels = root.querySelector('.price-panels');
    if (!tabs || !panels) return false;
    const tab = tabs.querySelector(`.price-tab[data-cat="${catId}"]`);
    if (!tab) return false;
    tabs.querySelectorAll('.price-tab').forEach(t => {
      const active = t.dataset.cat === catId;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    panels.querySelectorAll('.price-panel').forEach(p => {
      p.classList.toggle('active', p.dataset.cat === catId);
    });
    return true;
  }

  window.ZV_openPriceTab = function (catId) {
    activatePriceTab(catId);
    document.getElementById('preisliste')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (location.hash !== '#preisliste') {
      history.pushState(null, '', '#preisliste');
    }
  };

  window.ZV_buildPriceList = function () {
    const root = document.getElementById('priceListRoot');
    if (!root) return;

    const tabs = document.createElement('div');
    tabs.className = 'price-tabs';
    tabs.setAttribute('role', 'tablist');

    const panels = document.createElement('div');
    panels.className = 'price-panels';

    window.ZV_PRICE_CATEGORIES.forEach((cat, i) => {
      const tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'price-tab' + (i === 0 ? ' active' : '');
      tab.textContent = cat.label;
      tab.dataset.cat = cat.id;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      tabs.appendChild(tab);

      const panel = document.createElement('div');
      panel.className = 'price-panel' + (i === 0 ? ' active' : '');
      panel.dataset.cat = cat.id;
      panel.setAttribute('role', 'tabpanel');

      const items = window.ZV_PRODUCTS.filter(p => p.category === cat.id && !p.listHidden);
      panel.innerHTML = `
        <div class="price-table-wrap">
          <table class="price-table">
            <thead>
              <tr>
                <th>Artikel</th>
                <th>Tag*</th>
                <th>WE**</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${items.map(p => renderPriceRow(p, window.ZV_PRODUCTS)).join('')}
            </tbody>
          </table>
        </div>`;
      panels.appendChild(panel);
    });

    root.appendChild(tabs);
    root.appendChild(panels);

    tabs.querySelectorAll('.price-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        activatePriceTab(tab.dataset.cat);
      });
    });

    panels.querySelectorAll('.price-add').forEach(btn => {
      btn.addEventListener('click', () => {
        window.ZV_Cart.add(btn.dataset.id, 1);
        btn.textContent = '✓ Hinzugefügt';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = 'Hinzufügen';
          btn.disabled = false;
        }, 1200);
        updateFormPreview();
      });
    });

    panels.querySelectorAll('.price-expand-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const expandRow = btn.closest('tr').nextElementSibling;
        if (!expandRow || !expandRow.classList.contains('price-row-expand')) return;
        const open = expandRow.hidden;
        expandRow.hidden = !open;
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        btn.setAttribute('aria-label', open ? 'Mit / ohne Biertischgarnitur ausblenden' : 'Mit / ohne Biertischgarnitur anzeigen');
        btn.classList.toggle('is-open', open);
      });
    });
  };

  window.updateFormPreview = function () {
    const preview = document.getElementById('cart-preview');
    if (!preview) return;
    const lines = window.ZV_Cart.lines();
    if (!lines.length) {
      preview.innerHTML = '<p class="cart-preview-empty">Noch leer - Artikel über Zelte oder Preisliste hinzufügen.</p>';
      return;
    }
    preview.innerHTML = lines.map(l =>
      `<div class="cart-preview-line"><span>${escapeHtml(l.name)}</span><strong>${l.qty}×</strong></div>`
    ).join('');
  };

  document.addEventListener('DOMContentLoaded', () => {
    buildCartUI();
    window.ZV_buildPriceList();
    window.updateFormPreview();

    document.querySelectorAll('.acc-card[data-price-cat]').forEach(card => {
      const body = card.querySelector('.acc-card__body--link');
      if (!body) return;
      const open = () => window.ZV_openPriceTab(card.dataset.priceCat);
      body.addEventListener('click', open);
      body.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      });
    });
  });
})();
