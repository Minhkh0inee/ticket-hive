import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface SeatCancelDialogProps {
  open: boolean
  seatCount: number
  onConfirm: () => void
  onCancel: () => void
}

export function SeatCancelDialog({ open, seatCount, onConfirm, onCancel }: SeatCancelDialogProps) {
  return (
    <Dialog open={open} onOpenChange={open => { if (!open) onCancel() }}>
      <DialogContent className="bg-[oklch(0.19_0_0)] border border-[oklch(0.26_0_0)] text-white max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-white text-base font-bold">Xóa ghế đã chọn?</DialogTitle>
        </DialogHeader>
        <p className="text-[oklch(0.6_0_0)] text-sm">
          Nếu đóng, <span className="text-white font-semibold">{seatCount} ghế</span> đang chọn sẽ bị xóa.
        </p>
        <DialogFooter className="flex gap-2 sm:flex-row">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="flex-1 rounded-xl text-white hover:text-white hover:bg-[oklch(0.26_0_0)]"
          >
            Tiếp tục chọn
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            Xóa và đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
