import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { fmtPrice } from '@/lib/format'
import { SECTION_CONFIG } from './constants'
import type { SeatSection } from '@/types/event.types'

interface SectionSummary {
  section: SeatSection
  total: number
  available: number
  priceModifier: number
}

interface SectionListProps {
  isLoading: boolean
  sectionSummaries: SectionSummary[]
  basePrice: number
  onSelect: (section: SeatSection) => void
}

export function SectionList({ isLoading, sectionSummaries, basePrice, onSelect }: SectionListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2 mt-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="mt-4">
      <p className="text-[oklch(0.55_0_0)] text-xs font-semibold uppercase tracking-wider mb-3">
        Khu vực
      </p>
      <ul className="space-y-0" role="list">
        {sectionSummaries.map(({ section, available, total, priceModifier }) => {
          const { Icon, label, color, bg } = SECTION_CONFIG[section]
          const price = basePrice * Number(priceModifier)
          const soldOut = available === 0

          return (
            <li
              key={section}
              className="flex items-center justify-between gap-3 py-3 border-b border-[oklch(0.23_0_0)] last:border-0"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1"
                  style={{ color, backgroundColor: bg }}
                >
                  <Icon size={10} aria-hidden="true" />
                  {label}
                </span>
                <p className="text-[oklch(0.5_0_0)] text-xs">
                  {soldOut ? 'Hết vé' : `${available}/${total} ghế trống`}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[oklch(0.6_0.2_250)] text-sm font-semibold whitespace-nowrap">
                  {fmtPrice(String(price))}
                </span>
                {soldOut ? (
                  <Badge
                    variant="secondary"
                    className="bg-[oklch(0.28_0_0)] text-[oklch(0.5_0_0)] border-0 text-xs"
                  >
                    Hết vé
                  </Badge>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => onSelect(section)}
                    className="rounded-lg text-xs h-7 bg-[oklch(0.75_0.18_350)] hover:bg-[oklch(0.7_0.18_350)] text-white whitespace-nowrap"
                  >
                    Đặt vé
                  </Button>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}