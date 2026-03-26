import { memo } from 'react'
import { Ticket, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface EventSidebarProps {
  /** Stable viewer count derived from event id */
  viewerCount: number
}

export const EventSidebar = memo(function EventSidebar({ viewerCount }: EventSidebarProps) {
  return (
    <div className="space-y-4">
      {/* Bank promo card */}
      <div className="bg-gradient-to-br from-[oklch(0.35_0.15_280)] to-[oklch(0.25_0.12_300)] border border-[oklch(0.4_0.12_280)] rounded-2xl p-5 text-center">
        <p className="text-white/60 text-xs mb-1 uppercase tracking-wider">Độc quyền</p>
        <p className="text-white font-black text-2xl mb-0.5">GIẢM 50%</p>
        <p className="text-[oklch(0.85_0.1_280)] text-xs mb-4">phí dịch vụ khi thanh toán qua thẻ</p>
        <div className="bg-white/10 rounded-xl px-4 py-2 text-white font-bold text-sm">
          TPBank Mastercard
        </div>
      </div>

      {/* Share card */}
      <div className="bg-[oklch(0.19_0_0)] border border-[oklch(0.26_0_0)] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <Ticket size={16} className="text-[oklch(0.6_0.2_250)]" aria-hidden="true" />
          <p className="text-white font-semibold text-sm">Chia sẻ sự kiện</p>
        </div>
        <p className="text-[oklch(0.55_0_0)] text-xs mb-4 leading-relaxed">
          Chia sẻ với bạn bè và nhận thêm ưu đãi hấp dẫn khi mua vé cùng nhau.
        </p>
        <Button
          variant="outline"
          className="w-full rounded-xl border-[oklch(0.6_0.2_250)] text-[oklch(0.6_0.2_250)] hover:bg-[oklch(0.6_0.2_250)] hover:text-white transition-all duration-150 bg-transparent"
        >
          Sao chép liên kết
        </Button>
      </div>

      {/* Viewer stats card */}
      <div className="bg-[oklch(0.19_0_0)] border border-[oklch(0.26_0_0)] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Users size={16} className="text-[oklch(0.6_0.2_250)]" aria-hidden="true" />
          <p className="text-white font-semibold text-sm">Đang quan tâm</p>
        </div>
        <Separator className="mb-3 bg-[oklch(0.26_0_0)]" />
        <p className="text-[oklch(0.6_0.2_250)] text-2xl font-black">
          {viewerCount.toLocaleString('vi-VN')}
        </p>
        <p className="text-[oklch(0.5_0_0)] text-xs mt-1">
          người đang theo dõi sự kiện này
        </p>
      </div>
    </div>
  )
})
