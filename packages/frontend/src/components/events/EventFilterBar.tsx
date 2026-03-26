import { memo, useMemo } from 'react'
import { Calendar, Filter, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const DATE_FILTERS = [
  { id: 'all', label: 'Tất cả các ngày' },
  { id: 'today', label: 'Hôm nay' },
  { id: 'week', label: 'Tuần này' },
  { id: 'month', label: 'Tháng này' },
] as const

interface EventFilterBarProps {
  pageTitle: string
  filteredCount: number
  dateFilter: string
  onDateFilterChange: (value: string) => void
  hasActiveFilter: boolean
  onClearFilter: () => void
}

export const EventFilterBar = memo(function EventFilterBar({
  pageTitle,
  filteredCount,
  dateFilter,
  onDateFilterChange,
  hasActiveFilter,
  onClearFilter,
}: EventFilterBarProps) {
  const activeDateLabel = useMemo(
    () => DATE_FILTERS.find(d => d.id === dateFilter)?.label ?? 'Tất cả các ngày',
    [dateFilter]
  )

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
      {/* Left: result label */}
      <p className="text-[oklch(0.55_0_0)] text-sm">
        Kết quả tìm kiếm:{' '}
        <span className="text-white font-semibold">{pageTitle}</span>
        <span className="ml-2 text-[oklch(0.45_0_0)]">
          ({filteredCount} sự kiện)
        </span>
      </p>

      {/* Right: filter controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Date filter — shadcn DropdownMenu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-[oklch(0.3_0_0)] bg-[oklch(0.2_0_0)] text-[oklch(0.85_0_0)] hover:bg-[oklch(0.25_0_0)] hover:border-[oklch(0.45_0_0)] hover:text-white gap-2 h-9"
            >
              <Calendar size={13} aria-hidden="true" />
              {activeDateLabel}
              <ChevronDown size={13} aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="min-w-[190px] bg-[oklch(0.22_0_0)] border-[oklch(0.3_0_0)] rounded-xl"
          >
            {DATE_FILTERS.map(f => (
              <DropdownMenuItem
                key={f.id}
                onClick={() => onDateFilterChange(f.id)}
                className={`text-sm cursor-pointer rounded-lg transition-colors ${
                  dateFilter === f.id
                    ? 'bg-[oklch(0.6_0.2_250)] text-white font-medium focus:bg-[oklch(0.54_0.2_250)] focus:text-white'
                    : 'text-[oklch(0.75_0_0)] focus:bg-[oklch(0.28_0_0)] focus:text-white'
                }`}
              >
                {f.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Bộ lọc button — shadcn Button */}
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-[oklch(0.3_0_0)] bg-[oklch(0.2_0_0)] text-[oklch(0.85_0_0)] hover:bg-[oklch(0.25_0_0)] hover:border-[oklch(0.45_0_0)] hover:text-white gap-2 h-9"
          aria-label="Bộ lọc nâng cao"
        >
          <Filter size={13} aria-hidden="true" />
          Bộ lọc
        </Button>

        {/* Active filter badge — shadcn Badge wrapped in Button for interactivity */}
        {hasActiveFilter && (
          <Badge
            asChild
            className="rounded-full bg-[oklch(0.6_0.2_250)] hover:bg-[oklch(0.54_0.2_250)] text-white cursor-pointer px-3 h-9 gap-1.5 font-medium text-sm transition-colors duration-150"
          >
            <button onClick={onClearFilter} aria-label={`Xóa bộ lọc: ${pageTitle}`}>
              {pageTitle}
              <X size={13} aria-hidden="true" />
            </button>
          </Badge>
        )}
      </div>
    </div>
  )
})
