import { MATERIAL_CATEGORY, MATERIAL_CATEGORY_ORDER } from '@/lib/status'
import type { MaterialCategoryFilter, MaterialSort } from '@/lib/materials'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface MaterialListControlsProps {
  category: MaterialCategoryFilter
  sort: MaterialSort
  onCategoryChange: (value: MaterialCategoryFilter) => void
  onSortChange: (value: MaterialSort) => void
}

export function MaterialListControls({
  category,
  sort,
  onCategoryChange,
  onSortChange,
}: MaterialListControlsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1.5">
        <Label htmlFor="material-category-filter">Kategorie</Label>
        <Select
          value={category}
          onValueChange={(v) => onCategoryChange(v as MaterialCategoryFilter)}
        >
          <SelectTrigger id="material-category-filter" className="w-full sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Alle Kategorien</SelectItem>
            {MATERIAL_CATEGORY_ORDER.map((key) => (
              <SelectItem key={key} value={key}>
                {MATERIAL_CATEGORY[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="material-sort">Sortierung</Label>
        <Select value={sort} onValueChange={(v) => onSortChange(v as MaterialSort)}>
          <SelectTrigger id="material-sort" className="w-full sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="category">Nach Kategorie</SelectItem>
            <SelectItem value="name">Nach Name</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
