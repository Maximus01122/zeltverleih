import type { Material, MaterialCategory } from './types'
import { MATERIAL_CATEGORY_ORDER } from './status'

export type MaterialCategoryFilter = MaterialCategory | 'ALL'

export type MaterialSort = 'category' | 'name'

export function filterMaterialsByCategory(
  materials: Material[],
  category: MaterialCategoryFilter,
): Material[] {
  if (category === 'ALL') return materials
  return materials.filter((m) => m.category === category)
}

export function sortMaterials(materials: Material[], sort: MaterialSort): Material[] {
  const copy = [...materials]
  if (sort === 'name') {
    return copy.sort((a, b) => a.name.localeCompare(b.name, 'de'))
  }
  return copy.sort((a, b) => {
    const byCategory =
      MATERIAL_CATEGORY_ORDER.indexOf(a.category) -
      MATERIAL_CATEGORY_ORDER.indexOf(b.category)
    if (byCategory !== 0) return byCategory
    return a.id - b.id
  })
}

export function prepareMaterialList(
  materials: Material[],
  category: MaterialCategoryFilter,
  sort: MaterialSort,
): Material[] {
  return sortMaterials(filterMaterialsByCategory(materials, category), sort)
}
