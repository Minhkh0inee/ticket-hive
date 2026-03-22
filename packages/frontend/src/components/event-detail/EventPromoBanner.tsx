import { memo } from 'react'
import { Button } from '@/components/ui/button'

export const EventPromoBanner = memo(function EventPromoBanner() {
  return (
    <div className="bg-gradient-to-r from-[oklch(0.35_0.18_290)] via-[oklch(0.4_0.2_270)] to-[oklch(0.35_0.18_250)] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <p className="text-white/70 text-xs uppercase tracking-widest mb-1 font-medium">
          Tích điểm đổi thưởng
        </p>
        <p className="text-white font-black text-xl sm:text-2xl">
          Mua vé thả ga — Tích điểm cực đà
        </p>
        <p className="text-white/60 text-sm mt-1">
          Tích 20% điểm thưởng cho mỗi giao dịch mua vé
        </p>
      </div>
      <Button
        className="shrink-0 bg-[oklch(0.9_0.15_100)] hover:bg-[oklch(0.85_0.15_100)] text-[oklch(0.3_0.15_280)] font-bold whitespace-nowrap"
      >
        Tham gia ngay
      </Button>
    </div>
  )
})
