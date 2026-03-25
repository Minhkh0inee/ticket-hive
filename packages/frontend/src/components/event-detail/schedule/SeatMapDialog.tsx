import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Ticket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { fmtPrice } from '@/lib/format'
import { SeatMapGrid } from './SeatMapGrid'
import type { Seat, SeatSection } from '@/types/event.types'
import { SeatChips } from './SeatChip'
import { SECTION_CONFIG } from './constants'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { lockSeatRequest } from '@/stores/slices/seat.slice'
import { AuthRequiredDialog } from '@/components/common/AuthRequiredDialog'

const MAX_SEATS = 4

interface SeatMapDialogProps {
  selectedSection: SeatSection
  allRowsGrouped: Record<string, Seat[]>
  seats: Seat[]
  selectedSeats: string[]
  totalPrice: number
  price: number
  eventId: string
  onClose: () => void
  onSeatClick: (seatId: string, isSelected: boolean) => void
  onRemoveSeat: (seatId: string) => void
}

export function SeatMapDialog({
  selectedSection, allRowsGrouped, seats, selectedSeats,
  totalPrice, price, onClose, onSeatClick, onRemoveSeat, eventId
}: SeatMapDialogProps) {
  const { Icon, label, color, bg } = SECTION_CONFIG[selectedSection]
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useAppSelector(s => s.seat)
  const { user } = useAppSelector(s => s.auth)
  const lockPendingRef = useRef(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)

  function handleLockingSeat() {
    if (!user) {
      setShowAuthDialog(true)
      return
    }
    lockPendingRef.current = true
    dispatch(lockSeatRequest({
      eventId: eventId,
      seatIds: selectedSeats,
    }))
  }

  useEffect(() => {
    if (!lockPendingRef.current || isLoading) return
    lockPendingRef.current = false
    if (!error) {
      navigate('/checkout')
    }
  }, [isLoading, error, navigate])
  
  return (
    <>
    <Dialog open onOpenChange={open => { if (!open) onClose() }}>
      <DialogContent className="bg-[oklch(0.19_0_0)] border border-[oklch(0.26_0_0)] text-white max-w-lg rounded-2xl p-0 gap-0 overflow-hidden">

        <DialogHeader className="px-5 pt-5 pb-4 pr-12 border-b border-[oklch(0.26_0_0)]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 shrink-0"
              style={{ color, backgroundColor: bg }}>
              <Icon size={10} aria-hidden="true" />
              {label}
            </span>
            <DialogTitle className="text-white text-sm font-bold">
              {fmtPrice(String(price))}
              <span className="text-[oklch(0.5_0_0)] font-normal"> / ghế</span>
            </DialogTitle>
          </div>
          <p className="text-[oklch(0.45_0_0)] text-xs mt-0.5">Chọn tối đa {MAX_SEATS} ghế</p>
        </DialogHeader>

        <div className="px-5 pt-4 pb-3 overflow-y-auto max-h-[52vh]">
          <div className="mb-4 flex justify-center">
            <div className="w-2/3 h-6 rounded-t-full bg-[oklch(0.26_0_0)] flex items-center justify-center">
              <span className="text-[oklch(0.5_0_0)] text-[10px] uppercase tracking-widest font-semibold">Sân khấu</span>
            </div>
          </div>

          <SeatMapGrid
            allRowsGrouped={allRowsGrouped}
            selectedSection={selectedSection}
            selectedSeats={selectedSeats}
            color={color}
            onSeatClick={onSeatClick}
          />

          <div className="mt-4 flex items-center gap-4 justify-center">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-[oklch(0.28_0_0)]" />
              <span className="text-[oklch(0.5_0_0)] text-[10px]">Còn trống</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
              <span className="text-[oklch(0.5_0_0)] text-[10px]">Đang chọn</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-[oklch(0.24_0_0)]" />
              <span className="text-[oklch(0.5_0_0)] text-[10px]">Đã đặt</span>
            </div>
          </div>
        </div>

        <div className="border-t border-[oklch(0.26_0_0)] px-5 py-4 space-y-3">
          <div className="min-h-[28px] flex flex-wrap gap-1.5 items-center">
            <SeatChips
              selectedSeats={selectedSeats}
              seats={seats}
              color={color}
              bg={bg}
              onRemove={onRemoveSeat}
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[oklch(0.5_0_0)] text-[10px]">
                {selectedSeats.length} ghế × {fmtPrice(String(price))}
              </p>
              <p className="text-white font-bold text-base tabular-nums leading-tight">
                {selectedSeats.length > 0 ? fmtPrice(String(totalPrice)) : '—'}
              </p>
            </div>
            <Button
              disabled={selectedSeats.length === 0 || isLoading}
              onClick={handleLockingSeat}
              className="rounded-xl h-10 px-5 font-semibold text-sm bg-[oklch(0.6_0.2_250)] hover:bg-[oklch(0.54_0.2_250)] text-white gap-2 disabled:opacity-40"
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                  Đang đặt...
                </>
              ) : (
                <>
                  <Ticket size={14} aria-hidden="true" />
                  Đặt {selectedSeats.length > 0 ? `${selectedSeats.length} ghế` : 'vé'}
                </>
              )}
            </Button>
          </div>
        </div>

      </DialogContent>
    </Dialog>

    <AuthRequiredDialog open={showAuthDialog} onClose={() => setShowAuthDialog(false)} />
  </>
  )
}