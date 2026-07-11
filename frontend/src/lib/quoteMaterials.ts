import type { QuoteRequest } from './types'

/** Website product / tent slugs → admin material IDs (see scripts/seed-materials.sql). */
export const WEBSITE_PRODUCT_TO_MATERIAL_ID: Record<string, number> = {
  'tent-xs': 1,
  'tent-s': 2,
  'tent-pagode': 3,
  'tent-m1': 4,
  'tent-m2': 5,
  'tent-l': 6,
  'tent-xl1': 7,
  'tent-xl2': 8,
  'tent-xxl': 9,
  zeltfussboden: 10,
  ballastierung: 11,
  regenrinne: 12,
  biertischgarnitur: 13,
  biergartentisch: 14,
  biergartenstuhl: 15,
  buffettisch: 16,
  stehtisch: 17,
  polsterstuhl: 18,
  'husse-bzg-ungeb-mit': 19,
  'husse-bzg-ungeb-ohne': 20,
  'husse-bzg-geb-mit': 21,
  'husse-bzg-geb-ohne': 22,
  'husse-stehtisch': 23,
  'tischdecke-grau': 24,
  'tischdecke-rot': 25,
  'polster-stuhl': 26,
  'polster-bank': 27,
  bodenschoner: 28,
  tischdeckenklammern: 29,
  lichterkette: 30,
  'led-leuchte-30w': 31,
  'led-tischleuchte': 32,
  ampelschirm: 33,
  schirmstaender: 34,
  'sonnensegel-36': 35,
  'sonnensegel-40': 36,
  'sonnensegel-50': 37,
  'sonnensegel-befestigung': 38,
  kuehlschrank: 39,
  klimageraet: 40,
  'heizung-240v': 41,
  'heizung-400v': 42,
  'kabel-240v-25m': 43,
  'kabel-400v-25m': 44,
  'kabel-400v-10m': 45,
  feuerschale: 46,
  brennmaterial: 47,
  tischtennis: 48,
  tischkicker: 49,
  'hufeisen-selbst': 50,
  'hufeisen-montage': 51,
  jenga: 52,
  kegeln: 53,
}

/** Display names as shown in the website cart / form. */
const WEBSITE_NAME_TO_MATERIAL_ID: Record<string, number> = {
  'Zelt XS (4×2 m)': 1,
  'Zelt S (3×3 m)': 2,
  'Zelt Pagode (3×3 m)': 3,
  'Zelt M/1 (4×4 m)': 4,
  'Zelt M/2 (3×6 m)': 5,
  'Zelt L (4×6 m)': 6,
  'Zelt XL/1 (4×8 m)': 7,
  'Zelt XL/2 (4×9 m)': 8,
  'Zelt XXL (4×10 m)': 9,
  'Zeltfußboden (je qm)': 10,
  'Ballastierung (je Zelt)': 11,
  'Regenrinne für Längs- oder Giebelseite': 12,
  'Biertischgarnitur mit 2 Bänken': 13,
  'Biergartentisch': 14,
  'Biergartenstühle': 15,
  'Buffettisch, extra breit': 16,
  'Stehtische': 17,
  'Polsterstühle': 18,
  'Hussen Bierzeltgarnitur (weiß, ungebügelt) - bei Miete mit Biertischgarnitur': 19,
  'Hussen Bierzeltgarnitur (weiß, ungebügelt) - ohne Miete Biertischgarnitur': 20,
  'Hussen Bierzeltgarnitur (weiß, gebügelt) - bei Miete mit Biertischgarnitur': 21,
  'Hussen Bierzeltgarnitur (weiß, gebügelt) - ohne Miete Biertischgarnitur': 22,
  'Hussen Stehtische (anthrazit oder weiß)': 23,
  'Tischdecke (dunkelgrau) für Biergartentisch': 24,
  'Tischdecke (dunkelrot) für Biertischgarnitur': 25,
  'Sitzpolster (dunkelrot) für Biergartenstühle': 26,
  'Sitzpolster (dunkelrot) für Bierbank': 27,
  'Bodenschoner für Biertischgarnituren (je Satz)': 28,
  'Tischdeckenklammern (Satz)': 29,
  'Party-Lichterkette mit 10 bunten oder weißen Glühlampen': 30,
  'LED-Leuchte 30 Watt': 31,
  'LED-Tischleuchte (mehrfarbig)': 32,
  'Ampelschirm, Durchmesser 3,30 m': 33,
  'Schirmständer + Gewichte': 34,
  'Sonnensegel, wasserabweisend 3,6 × 3,6 m': 35,
  'Sonnensegel, wasserabweisend 4,0 × 3,0 m': 36,
  'Sonnensegel, wasserabweisend 5,0 × 5,0 m': 37,
  'Befestigungsset für Sonnensegel (Stange, Haken, Abspannseil, Ösen, incl. Erdbohrer)': 38,
  'Kühlschrank ca. 120 l': 39,
  'Klimagerät, Kühlleistung 2,6 kW': 40,
  'Zeltheizung, elektrisch (240 Volt, 3 kW)': 41,
  'Zeltheizung, elektrisch (400 Volt, 9 kW)': 42,
  'Verlängerungskabel 25 m, 240 Volt': 43,
  'Verlängerungskabel 25 m, 400 Volt': 44,
  'Verlängerungskabel 10 m, 400 Volt': 45,
  'Feuerschale': 46,
  'Brennmaterial (Anzünd- & Feuerholz + Anzündwolle)': 47,
  'Mobile Tischtennisplatte 125 × 75 cm (incl. Schläger und Bälle)': 48,
  'Tischkicker': 49,
  'Hufeisenwerfen (zum Selbstaufbau)': 50,
  'Hufeisenwerfen (mit Montage)': 51,
  'Jenga (Wackelturm)': 52,
  'Kegeln': 53,
}

const TENT_CODE_TO_MATERIAL_ID: Record<string, number> = {
  XS: 1,
  S: 2,
  Pagode: 3,
  'M/1': 4,
  'M/2': 5,
  L: 6,
  'XL/1': 7,
  'XL/2': 8,
  XXL: 9,
}

interface CartJsonLine {
  id: string
  qty: number
}

function addQuantity(target: Record<number, number>, materialId: number, qty: number) {
  if (qty <= 0) return
  target[materialId] = (target[materialId] ?? 0) + qty
}

function resolveName(name: string): number | undefined {
  const trimmed = name.trim()
  if (WEBSITE_NAME_TO_MATERIAL_ID[trimmed] != null) {
    return WEBSITE_NAME_TO_MATERIAL_ID[trimmed]
  }
  const normalized = trimmed.toLowerCase()
  for (const [label, materialId] of Object.entries(WEBSITE_NAME_TO_MATERIAL_ID)) {
    if (label.toLowerCase() === normalized) return materialId
  }
  return undefined
}

function parseCartJson(cartJson: string | null | undefined): Record<number, number> | null {
  if (!cartJson?.trim()) return null
  try {
    const lines = JSON.parse(cartJson) as CartJsonLine[]
    if (!Array.isArray(lines)) return null
    const quantities: Record<number, number> = {}
    for (const line of lines) {
      const materialId = WEBSITE_PRODUCT_TO_MATERIAL_ID[line.id]
      if (materialId != null) addQuantity(quantities, materialId, line.qty)
    }
    return Object.keys(quantities).length > 0 ? quantities : null
  } catch {
    return null
  }
}

function parseAccessoriesText(accessories: string | null | undefined): {
  quantities: Record<number, number>
  parsedWarenkorb: boolean
} {
  const quantities: Record<number, number> = {}
  if (!accessories?.trim()) return { quantities, parsedWarenkorb: false }

  const lines = accessories.split('\n')
  let inWarenkorb = false
  let parsedAnyLine = false

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) continue
    if (line === 'Warenkorb:') {
      inWarenkorb = true
      continue
    }
    if (line === 'Weitere Wünsche:' || line.startsWith('Weitere Wünsche:')) {
      inWarenkorb = false
      continue
    }
    if (!inWarenkorb) continue

    const match = line.match(/^(\d+)\s*[×x]\s*(.+)$/i)
    if (!match) continue

    const qty = Number(match[1])
    const materialId = resolveName(match[2])
    if (materialId != null) {
      addQuantity(quantities, materialId, qty)
      parsedAnyLine = true
    }
  }

  return { quantities, parsedWarenkorb: parsedAnyLine }
}

function parseTentSizeText(tentSize: string | null | undefined, target: Record<number, number>) {
  if (!tentSize?.trim()) return

  for (const part of tentSize.split(',')) {
    const trimmed = part.trim()
    const match = trimmed.match(/^(.+?)\s*\([^)]+\)(?:\s*[×x]\s*(\d+))?$/i)
    if (!match) continue
    const code = match[1].trim()
    const qty = match[2] ? Number(match[2]) : 1
    const materialId = TENT_CODE_TO_MATERIAL_ID[code]
    if (materialId != null) addQuantity(target, materialId, qty)
  }
}

/** Derive preselected material quantities from a website quote request. */
export function quoteMaterialQuantities(quote: QuoteRequest): Record<number, number> {
  const fromJson = parseCartJson(quote.cartJson)
  if (fromJson) return fromJson

  const { quantities, parsedWarenkorb } = parseAccessoriesText(quote.accessories)
  if (!parsedWarenkorb) {
    parseTentSizeText(quote.tentSize, quantities)
  }
  return quantities
}
