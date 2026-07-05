/* Product catalog - prices from zeltverleiherfurt.de (zzgl. MwSt.) */
window.ZV_TENTS = [
  { id: 'tent-xs',     code: 'XS',     dims: '4×2 m',  persons: 'mind. 8 Pers.',  day: 65,  we: 95,  material: 'PVC-Plane', sides: 'Inklusive', deposit: 75 },
  { id: 'tent-s',      code: 'S',      dims: '3×3 m',  persons: 'mind. 8 Pers.',  day: 75,  we: 105, material: 'PVC-Plane', sides: 'Inklusive', deposit: 75 },
  { id: 'tent-pagode', code: 'Pagode', dims: '3×3 m',  persons: 'mind. 8 Pers.',  day: 80,  we: 115, material: 'PVC-Plane', sides: 'Inklusive', deposit: 75 },
  { id: 'tent-m1',     code: 'M/1',    dims: '4×4 m',  persons: 'mind. 16 Pers.', day: 85,  we: 125, material: 'PVC-Plane', sides: 'Inklusive', deposit: 75 },
  { id: 'tent-m2',     code: 'M/2',    dims: '3×6 m',  persons: 'mind. 24 Pers.', day: 90,  we: 130, material: 'PVC-Plane', sides: 'Inklusive', deposit: 75 },
  { id: 'tent-l',      code: 'L',      dims: '4×6 m',  persons: 'mind. 32 Pers.', day: 100, we: 145, material: 'PVC-Plane', sides: 'Inklusive', deposit: 75 },
  { id: 'tent-xl1',    code: 'XL/1',   dims: '4×8 m',  persons: 'mind. 48 Pers.', day: 110, we: 170, material: 'PVC-Plane', sides: 'Inklusive', deposit: 75 },
  { id: 'tent-xl2',    code: 'XL/2',   dims: '4×9 m',  persons: 'mind. 48 Pers.', day: 125, we: 185, material: 'PVC-Plane', sides: 'Inklusive', deposit: 75 },
  { id: 'tent-xxl',    code: 'XXL',    dims: '4×10 m', persons: 'mind. 64 Pers.', day: 140, we: 200, material: 'PVC-Plane', sides: 'Inklusive', deposit: 75 },
];

window.ZV_PRICE_CATEGORIES = [
  { id: 'tische',       label: 'Tische & Stühle' },
  { id: 'licht',        label: 'Licht & Schatten' },
  { id: 'waerme',       label: 'Wärme & Kälte' },
  { id: 'aktivitaeten', label: 'Aktivitäten' },
  { id: 'zelt_zubehoer', label: 'Zelt-Zubehör' },
];

window.ZV_PRODUCTS = [
  /* Tische, Bänke, Stühle */
  { id: 'biertischgarnitur', category: 'tische', name: 'Biertischgarnitur mit 2 Bänken', day: 9.5, we: 13.5 },
  { id: 'buffettisch', category: 'tische', name: 'Buffettisch, extra breit', day: 9.5, we: 13.5 },
  { id: 'biergartentisch', category: 'tische', name: 'Biergartentisch', day: 8, we: 10 },
  { id: 'biergartenstuhl', category: 'tische', name: 'Biergartenstühle', day: 3, we: 4 },
  { id: 'polsterstuhl', category: 'tische', name: 'Polsterstühle', day: 4, we: 5 },
  { id: 'bodenschoner', category: 'tische', name: 'Bodenschoner für Biertischgarnituren (je Satz)', day: 2.5, we: 3.5 },
  { id: 'stehtisch', category: 'tische', name: 'Stehtische', day: 8, we: 10 },
  { id: 'husse-stehtisch', category: 'tische', name: 'Hussen Stehtische (anthrazit oder weiß)', day: 4, we: 5.5 },
  { id: 'husse-bzg-ungeb-mit', category: 'tische', name: 'Hussen Bierzeltgarnitur (weiß, ungebügelt) - bei Miete mit Biertischgarnitur', day: 5, we: 7, priceExpandId: 'husse-bzg-ungeb-ohne' },
  { id: 'husse-bzg-ungeb-ohne', category: 'tische', name: 'Hussen Bierzeltgarnitur (weiß, ungebügelt) - ohne Miete Biertischgarnitur', day: 6.5, we: 8.5, listHidden: true },
  { id: 'husse-bzg-geb-mit', category: 'tische', name: 'Hussen Bierzeltgarnitur (weiß, gebügelt) - bei Miete mit Biertischgarnitur', day: 15.5, we: 18.5, priceExpandId: 'husse-bzg-geb-ohne' },
  { id: 'husse-bzg-geb-ohne', category: 'tische', name: 'Hussen Bierzeltgarnitur (weiß, gebügelt) - ohne Miete Biertischgarnitur', day: 17.5, we: 21, listHidden: true },
  { id: 'polster-stuhl', category: 'tische', name: 'Sitzpolster (dunkelrot) für Biergartenstühle', day: 2, we: 2.5 },
  { id: 'polster-bank', category: 'tische', name: 'Sitzpolster (dunkelrot) für Bierbank', day: 2.5, we: 3.5 },
  { id: 'tischdecke-grau', category: 'tische', name: 'Tischdecke (dunkelgrau) für Biergartentisch', day: 4, we: 5.5 },
  { id: 'tischdecke-rot', category: 'tische', name: 'Tischdecke (dunkelrot) für Biertischgarnitur', day: 4, we: 5.5 },
  { id: 'tischdeckenklammern', category: 'tische', name: 'Tischdeckenklammern (Satz)', day: 2, we: 2.5 },

  /* Licht & Schatten */
  { id: 'led-leuchte-30w', category: 'licht', name: 'LED-Leuchte 30 Watt', day: 8.5, we: 12.5 },
  { id: 'led-tischleuchte', category: 'licht', name: 'LED-Tischleuchte (mehrfarbig)', day: 6.5, we: 9.5 },
  { id: 'lichterkette', category: 'licht', name: 'Party-Lichterkette mit 10 bunten oder weißen Glühlampen', day: 8.5, we: 12.5 },
  { id: 'sonnensegel-36', category: 'licht', name: 'Sonnensegel, wasserabweisend 3,6 × 3,6 m', day: 14, we: 19.5 },
  { id: 'sonnensegel-40', category: 'licht', name: 'Sonnensegel, wasserabweisend 4,0 × 3,0 m', day: 14, we: 19.5 },
  { id: 'sonnensegel-50', category: 'licht', name: 'Sonnensegel, wasserabweisend 5,0 × 5,0 m', day: 21, we: 29.5 },
  { id: 'sonnensegel-befestigung', category: 'licht', name: 'Befestigungsset für Sonnensegel (Stange, Haken, Abspannseil, Ösen, incl. Erdbohrer)', day: 5.5, we: 7.5 },
  { id: 'ampelschirm', category: 'licht', name: 'Ampelschirm, Durchmesser 3,30 m', day: 27.5, we: 39.5 },
  { id: 'schirmstaender', category: 'licht', name: 'Schirmständer + Gewichte', day: 10.5, we: 14.5 },

  /* Wärme & Kälte */
  { id: 'heizung-240v', category: 'waerme', name: 'Zeltheizung, elektrisch (240 Volt, 3 kW)', day: 15, we: 20 },
  { id: 'kabel-240v-25m', category: 'waerme', name: 'Verlängerungskabel 25 m, 240 Volt', day: 7, we: 9.5 },
  { id: 'heizung-400v', category: 'waerme', name: 'Zeltheizung, elektrisch (400 Volt, 9 kW)', day: 30, we: 45 },
  { id: 'kabel-400v-25m', category: 'waerme', name: 'Verlängerungskabel 25 m, 400 Volt', day: 12.5, we: 17.5 },
  { id: 'kabel-400v-10m', category: 'waerme', name: 'Verlängerungskabel 10 m, 400 Volt', day: 7, we: 9.5 },
  { id: 'feuerschale', category: 'waerme', name: 'Feuerschale', day: 13.5, we: 19.5 },
  { id: 'brennmaterial', category: 'waerme', name: 'Brennmaterial (Anzünd- & Feuerholz + Anzündwolle)', day: 9.5, we: 9.5 },
  { id: 'kuehlschrank', category: 'waerme', name: 'Kühlschrank ca. 120 l', day: 30, we: 40 },
  { id: 'klimageraet', category: 'waerme', name: 'Klimagerät, Kühlleistung 2,6 kW', day: 30, we: 43 },

  /* Aktivitäten */
  { id: 'tischtennis', category: 'aktivitaeten', name: 'Mobile Tischtennisplatte 125 × 75 cm (incl. Schläger und Bälle)', day: 17.5, we: 24.5 },
  { id: 'tischkicker', category: 'aktivitaeten', name: 'Tischkicker', day: 26.5, we: 37.5 },
  { id: 'hufeisen-selbst', category: 'aktivitaeten', name: 'Hufeisenwerfen (zum Selbstaufbau)', day: 17.5, we: 24.5 },
  { id: 'hufeisen-montage', category: 'aktivitaeten', name: 'Hufeisenwerfen (mit Montage)', day: 42.5, we: 49.5 },
  { id: 'jenga', category: 'aktivitaeten', name: 'Jenga (Wackelturm)', day: 13.5, we: 19.5 },
  { id: 'kegeln', category: 'aktivitaeten', name: 'Kegeln', day: 13.5, we: 19.5 },

  /* Zelt-Zubehör */
  { id: 'regenrinne', category: 'zelt_zubehoer', name: 'Regenrinne für Längs- oder Giebelseite', day: 6.5, we: 9.5 },
  { id: 'zeltfussboden', category: 'zelt_zubehoer', name: 'Zeltfußboden (je qm)', day: 3, we: 4 },
  { id: 'ballastierung', category: 'zelt_zubehoer', name: 'Ballastierung (je Zelt)', day: 25, we: 25 },
];

window.ZV_getProductName = function (id) {
  const tent = window.ZV_TENTS.find(t => t.id === id);
  if (tent) return `Zelt ${tent.code} (${tent.dims})`;
  const p = window.ZV_PRODUCTS.find(x => x.id === id);
  return p ? p.name : id;
};

window.ZV_formatPrice = function (value) {
  if (value == null) return '-';
  return value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
};
