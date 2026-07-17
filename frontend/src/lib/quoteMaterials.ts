import type { QuoteRequest } from './types'

/**
 * Website product / tent slugs → admin material IDs.
 * IDs match production (VPS) material table: 10, 20, … 580.
 */
export const WEBSITE_PRODUCT_TO_MATERIAL_ID: Record<string, number> = {
  'tent-xs': 10,
  'tent-s': 20,
  'tent-pagode': 30,
  'tent-m1': 40,
  'tent-m2': 50,
  'tent-l': 60,
  'tent-xl1': 70,
  'tent-xl2': 80,
  'tent-xxl': 90,
  zeltfussboden: 100,
  abkantung: 110,
  ballastierung: 120,
  regenrinne: 130,
  biertischgarnitur: 140,
  biergartentisch: 150,
  biergartenstuhl: 160,
  buffettisch: 170,
  'einzelne-tische': 180,
  'einzelne-baenke': 190,
  stehtisch: 200,
  polsterstuhl: 210,
  'husse-bzg-ungeb-mit': 220,
  'husse-bzg-ungeb-ohne': 230,
  'husse-bzg-geb-mit': 240,
  'husse-bzg-geb-ohne': 250,
  'husse-stehtisch-anthrazit': 260,
  'husse-stehtisch-weiss': 270,
  'tischdecke-grau': 280,
  'tischdecke-rot': 290,
  'polster-stuhl': 300,
  'polster-bank': 310,
  bodenschoner: 320,
  tischdeckenklammern: 330,
  lichterkette: 340,
  'led-leuchte-30w': 350,
  'led-tischleuchte': 360,
  ampelschirm: 370,
  schirmstaender: 380,
  'sonnensegel-36': 390,
  'sonnensegel-40': 400,
  'sonnensegel-50': 410,
  'sonnensegel-befestigung': 420,
  kuehlschrank: 430,
  flaschenkuehlschrank: 440,
  klimageraet: 450,
  'heizung-240v': 460,
  'heizung-400v': 470,
  'kabel-240v-25m': 480,
  'kabel-400v-25m': 490,
  'kabel-400v-10m': 500,
  feuerschale: 510,
  brennmaterial: 520,
  tischtennis: 530,
  tischkicker: 540,
  'hufeisen-selbst': 550,
  'hufeisen-montage': 560,
  jenga: 570,
  kegeln: 580,
}

/** Display names as shown in the website cart / form. */
const WEBSITE_NAME_TO_MATERIAL_ID: Record<string, number> = {
  'Zelt XS (4×2 m)': 10,
  'Zelt S (3×3 m)': 20,
  'Zelt Pagode (3×3 m)': 30,
  'Zelt M/1 (4×4 m)': 40,
  'Zelt M/2 (3×6 m)': 50,
  'Zelt L (4×6 m)': 60,
  'Zelt XL/1 (4×8 m)': 70,
  'Zelt XL/2 (4×9 m)': 80,
  'Zelt XXL (4×10 m)': 90,
  'Zeltfußboden (je qm)': 100,
  Abkantung: 110,
  'Ballastierung (je Zelt)': 120,
  'Regenrinne für Längs- oder Giebelseite': 130,
  'Biertischgarnitur mit 2 Bänken': 140,
  Biergartentisch: 150,
  Biergartenstühle: 160,
  'Buffettisch, extra breit': 170,
  'einzelne Tische': 180,
  'einzelne Bänke': 190,
  Stehtische: 200,
  Polsterstühle: 210,
  'Hussen Bierzeltgarnitur (weiß, ungebügelt) - bei Miete mit Biertischgarnitur': 220,
  'Hussen Bierzeltgarnitur (weiß, ungebügelt) - ohne Miete Biertischgarnitur': 230,
  'Hussen Bierzeltgarnitur (weiß, gebügelt) - bei Miete mit Biertischgarnitur': 240,
  'Hussen Bierzeltgarnitur (weiß, gebügelt) - ohne Miete Biertischgarnitur': 250,
  'Hussen Stehtische (anthrazit)': 260,
  'Hussen Stehtische (weiß)': 270,
  'Hussen Stehtische (weiss)': 270,
  'Tischdecke (dunkelgrau) für Biergartentisch': 280,
  'Tischdecke (dunkelrot) für Biertischgarnitur': 290,
  'Sitzpolster (dunkelrot) für Biergartenstühle': 300,
  'Sitzpolster (dunkelrot) für Bierbank': 310,
  'Bodenschoner für Biertischgarnituren (je Satz)': 320,
  'Tischdeckenklammern (Satz)': 330,
  'Party-Lichterkette mit 10 bunten oder weißen Glühlampen': 340,
  'LED-Leuchte 30 Watt': 350,
  'LED-Tischleuchte (mehrfarbig)': 360,
  'Ampelschirm, Durchmesser 3,30 m': 370,
  'Schirmständer + Gewichte': 380,
  'Sonnensegel, wasserabweisend 3,6 × 3,6 m': 390,
  'Sonnensegel 3,6 × 3,6 m': 390,
  'Sonnensegel, wasserabweisend 4,0 × 3,0 m': 400,
  'Sonnensegel 4,0 × 3,0 m': 400,
  'Sonnensegel, wasserabweisend 5,0 × 5,0 m': 410,
  'Sonnensegel 5,0 × 5,0 m': 410,
  'Befestigungsset für Sonnensegel (Stange, Haken, Abspannseil, Ösen, incl. Erdbohrer)': 420,
  'Befestigungsset für Sonnensegel': 420,
  'Kühlschrank ca. 120 l': 430,
  'Flaschenkühlschrank mit Glastür und blauer LED-Beleuchtung, ca. 90 l': 440,
  'Klimagerät, Kühlleistung 2,6 kW': 450,
  'Zeltheizung, elektrisch (240 Volt, 3 kW)': 460,
  'Zeltheizung, elektrisch (400 Volt, 9 kW)': 470,
  'Verlängerungskabel 25 m, 240 Volt': 480,
  'Verlängerungskabel 25 m, 400 Volt': 490,
  'Verlängerungskabel 10 m, 400 Volt': 500,
  Feuerschale: 510,
  'Brennmaterial (Anzünd- & Feuerholz + Anzündwolle)': 520,
  'Mobile Tischtennisplatte 125 × 75 cm (incl. Schläger und Bälle)': 530,
  'Mobile Tischtennisplatte': 530,
  Tischkicker: 540,
  'Hufeisenwerfen (zum Selbstaufbau)': 550,
  'Hufeisenwerfen (mit Montage)': 560,
  'Jenga (Wackelturm)': 570,
  Kegeln: 580,
}

const TENT_CODE_TO_MATERIAL_ID: Record<string, number> = {
  XS: 10,
  S: 20,
  Pagode: 30,
  'M/1': 40,
  'M/2': 50,
  L: 60,
  'XL/1': 70,
  'XL/2': 80,
  XXL: 90,
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
      const numericId = Number(line.id)
      if (Number.isInteger(numericId) && numericId > 0) {
        addQuantity(quantities, numericId, line.qty)
        continue
      }
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
