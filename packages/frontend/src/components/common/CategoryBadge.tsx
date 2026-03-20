interface CategoryBadgeProps {
  label: string
  icon?: string
  active?: boolean
  onClick?: () => void
}

export function CategoryBadge({ label, icon, active = false, onClick }: CategoryBadgeProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 whitespace-nowrap cursor-pointer border ${
        active
          ? 'bg-[oklch(0.6_0.2_250)] text-white border-[oklch(0.6_0.2_250)]'
          : 'bg-white text-gray-600 border-gray-200 hover:border-[oklch(0.6_0.2_250)] hover:text-[oklch(0.6_0.2_250)]'
      }`}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  )
}
