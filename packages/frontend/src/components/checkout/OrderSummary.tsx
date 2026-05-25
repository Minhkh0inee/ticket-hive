
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { fmtDate, fmtPrice } from '@/lib/format'
import { CalendarDays, MapPin } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useBookingSummary } from '@/hooks/useBookingSummary'
import { Badge } from '../ui/badge'



const OrderSummary = () => {
    const { selectedSeatObjects, sectionConfig, unitPrice, subtotal, bookingFee, total, currentEvent} = useBookingSummary()
    return (
    <Card className="bg-[oklch(0.19_0_0)] border-[oklch(0.26_0_0)] text-white sticky top-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold">Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">

                {/* Event info */}
                <div>
                  <p className="font-semibold text-sm leading-snug">
                    {currentEvent?.title ?? 'Sự kiện'}
                  </p>
                  <div className="mt-2 space-y-1">
                    {currentEvent?.eventDate && (
                      <p className="text-[oklch(0.55_0_0)] text-xs flex items-center gap-1.5">
                        <CalendarDays size={11} />
                        {fmtDate(currentEvent.eventDate)}
                      </p>
                    )}
                    {currentEvent?.venue && (
                      <p className="text-[oklch(0.55_0_0)] text-xs flex items-center gap-1.5">
                        <MapPin size={11} />
                        {currentEvent.venue}
                        {currentEvent.city && `, ${currentEvent.city}`}
                      </p>
                    )}
                  </div>
                </div>

                <Separator className="bg-[oklch(0.26_0_0)]" />

                {/* Seat info */}
                <div>
                  <p className="text-[oklch(0.55_0_0)] text-xs mb-2">Ghế đã chọn</p>
                  {selectedSeatObjects.length === 0 ? (
                    <p className="text-[oklch(0.4_0_0)] text-xs italic">Chưa có ghế được chọn</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {sectionConfig && (
                        <Badge
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                          style={{ color: sectionConfig.color, backgroundColor: sectionConfig.bg }}
                        >
                          {sectionConfig.label}
                        </Badge>
                      )}
                      {selectedSeatObjects.map(s => (
                        <Badge 
                          key={s.id}
                          variant="outline"
                          className="text-[10px] border-[oklch(0.3_0_0)] text-[oklch(0.7_0_0)]"
                        >
                          {s.label}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Separator className="bg-[oklch(0.26_0_0)]" />

                {/* Price breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-[oklch(0.55_0_0)]">
                    <span>{selectedSeatObjects.length} vé × {fmtPrice(String(unitPrice))}</span>
                    <span>{fmtPrice(String(subtotal))}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[oklch(0.55_0_0)]">
                    <span>Phí đặt vé (5%)</span>
                    <span>{fmtPrice(String(bookingFee))}</span>
                  </div>
                </div>

                <Separator className="bg-[oklch(0.26_0_0)]" />

                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">Tổng cộng</span>
                  <span className="text-white font-bold text-lg tabular-nums">
                    {total > 0 ? fmtPrice(String(total)) : '—'}
                  </span>
                </div>

              </CardContent>
            </Card>
  )
}

export default OrderSummary