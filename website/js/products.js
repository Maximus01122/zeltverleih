/* Product catalog — loaded from GET /api/catalog/materials (DB prices).
 * UI-only overlays: tent meta, color variants, husse expand pairs. */
(function () {
  window.ZV_PRICE_CATEGORIES = [
    { id: 'zelte', label: 'Zelte' },
    { id: 'tische', label: 'Tische & Stühle' },
    { id: 'licht', label: 'Licht & Schatten' },
    { id: 'waerme', label: 'Wärme & Kälte' },
    { id: 'aktivitaeten', label: 'Aktivitäten' },
    { id: 'zelt_zubehoer', label: 'Zelt-Zubehör' },
  ];

  window.ZV_TENTS = [];
  window.ZV_PRODUCTS = [];

  /** Extra display fields for tents (not stored in DB). */
  const TENT_META = {
    XS: { persons: 'mind. 8 Pers.', material: 'PVC-Plane', sides: 'Inklusive' },
    S: { persons: 'mind. 8 Pers.', material: 'PVC-Plane', sides: 'Inklusive' },
    Pagode: { persons: 'mind. 8 Pers.', material: 'PVC-Plane', sides: 'Inklusive' },
    'M/1': { persons: 'mind. 16 Pers.', material: 'PVC-Plane', sides: 'Inklusive' },
    'M/2': { persons: 'mind. 24 Pers.', material: 'PVC-Plane', sides: 'Inklusive' },
    L: { persons: 'mind. 32 Pers.', material: 'PVC-Plane', sides: 'Inklusive' },
    'XL/1': { persons: 'mind. 48 Pers.', material: 'PVC-Plane', sides: 'Inklusive' },
    'XL/2': { persons: 'mind. 48 Pers.', material: 'PVC-Plane', sides: 'Inklusive' },
    XXL: { persons: 'mind. 64 Pers.', material: 'PVC-Plane', sides: 'Inklusive' },
  };

  const CATEGORY_MAP = {
    TISCHE_BAENKE_STUEHLE: 'tische',
    LICHT_SCHATTEN: 'licht',
    WAERME_KAELTE: 'waerme',
    AKTIVITAETEN: 'aktivitaeten',
  };

  function num(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  function isTentName(name) {
    return /^Zelt\s+.+\(/.test(name || '');
  }

  function parseTentName(name) {
    const match = (name || '').match(/^Zelt\s+(.+?)\s+\((.+)\)$/);
    if (!match) return null;
    return { code: match[1].trim(), dims: match[2].trim() };
  }

  function websiteCategory(material) {
    if (material.category === 'ZELTE') {
      return isTentName(material.name) ? 'zelte' : 'zelt_zubehoer';
    }
    return CATEGORY_MAP[material.category] || 'tische';
  }

  function toProduct(material) {
    return {
      id: String(material.id),
      materialId: material.id,
      category: websiteCategory(material),
      name: material.name,
      day: num(material.dailyPrice),
      we: num(material.weekendPrice),
      assembly: num(material.assemblyPrice),
    };
  }

  /** Group anthrazit/weiß husse stehtische into one row with color select. */
  function applyHusseStehtischGroup(products) {
    const anthrazit = products.find(p => /Hussen Stehtische \(anthrazit\)/i.test(p.name));
    const weiss = products.find(p => /Hussen Stehtische \(wei[sß]s?\)/i.test(p.name));
    if (!anthrazit || !weiss) return products;

    anthrazit.listHidden = true;
    weiss.listHidden = true;

    const parent = {
      id: 'husse-stehtisch',
      category: 'tische',
      name: 'Hussen Stehtische',
      day: anthrazit.day,
      we: anthrazit.we,
      assembly: anthrazit.assembly,
      colorVariants: [
        { id: anthrazit.id, label: 'Anthrazit' },
        { id: weiss.id, label: 'Weiß' },
      ],
    };

    const insertAt = products.findIndex(p => p === anthrazit);
    const without = products.filter(p => p !== anthrazit && p !== weiss);
    without.splice(Math.max(0, insertAt), 0, parent, anthrazit, weiss);
    return without;
  }

  /** Link "mit Biertischgarnitur" rows to their "ohne" expand alternative. */
  function applyHusseExpandPairs(products) {
    products.forEach(p => {
      const mit = p.name.match(/^(Hussen Bierzeltgarnitur .+?) - bei Miete mit Biertischgarnitur$/);
      if (!mit) return;
      const ohne = products.find(
        x => x.name === `${mit[1]} - ohne Miete Biertischgarnitur`,
      );
      if (!ohne) return;
      p.priceExpandId = ohne.id;
      ohne.listHidden = true;
    });
    return products;
  }

  function buildTents(products) {
    return products
      .filter(p => p.category === 'zelte')
      .map(p => {
        const parsed = parseTentName(p.name);
        if (!parsed) return null;
        const meta = TENT_META[parsed.code] || {
          persons: '',
          material: 'PVC-Plane',
          sides: 'Inklusive',
        };
        return {
          id: p.id,
          code: parsed.code,
          dims: parsed.dims,
          persons: meta.persons,
          material: meta.material,
          sides: meta.sides,
          day: p.day,
          we: p.we,
          assembly: p.assembly,
        };
      })
      .filter(Boolean);
  }

  function catalogUrl() {
    const isLocal =
      ['localhost', '127.0.0.1', ''].includes(location.hostname) ||
      location.protocol === 'file:';
    return (isLocal ? 'http://localhost:8080' : '') + '/api/catalog/materials';
  }

  window.ZV_getProductName = function (id) {
    const tent = window.ZV_TENTS.find(t => t.id === id);
    if (tent) return `Zelt ${tent.code} (${tent.dims})`;
    const p = window.ZV_PRODUCTS.find(x => x.id === id);
    return p ? p.name : id;
  };

  window.ZV_formatPrice = function (value) {
    if (value == null) return '–';
    return value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  };

  window.ZV_formatAssemblyPrice = function (value) {
    if (value == null || value === 0) return '–';
    return window.ZV_formatPrice(value);
  };

  /**
   * Fetch materials from Spring Boot and populate ZV_PRODUCTS / ZV_TENTS.
   * Falls back to empty lists on error (UI shows empty price tabs).
   */
  window.ZV_loadCatalog = async function () {
    const res = await fetch(catalogUrl(), { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error('Katalog konnte nicht geladen werden (' + res.status + ').');
    const materials = await res.json();
    if (!Array.isArray(materials)) throw new Error('Ungültige Katalog-Antwort.');

    let products = materials
      .slice()
      .sort((a, b) => Number(a.id) - Number(b.id))
      .map(toProduct);

    products = applyHusseStehtischGroup(products);
    products = applyHusseExpandPairs(products);

    window.ZV_PRODUCTS = products;
    window.ZV_TENTS = buildTents(products);
    return products;
  };
})();
