import { CategoryBadge } from '@/components/common/CategoryBadge'
import type { Category, EventCategory } from '@/types/event.types'

interface CategoryNavProps {
  categories: Category[]
  active: EventCategory | 'all'
  onChange: (id: EventCategory | 'all') => void
}

export function CategoryNav({ categories, active, onChange }: CategoryNavProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {categories.map((cat) => (
        <CategoryBadge
          key={cat.id}
          label={cat.label}
          icon={cat.icon}
          active={active === cat.id}
          onClick={() => onChange(cat.id)}
        />
      ))}
    </div>
  )
}
