import { useEffect, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/hooks/useAppSelector'

interface DeleteConfirmDialogProps {
  open: boolean
  eventTitle: string
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmDialog({
  open,
  eventTitle,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  const { isSubmitting, submitError } = useAppSelector((s) => s.admin)
  const wasSubmittingRef = useRef(false)

  useEffect(() => {
    if (wasSubmittingRef.current && !isSubmitting && !submitError) {
      onCancel()
    }
    wasSubmittingRef.current = isSubmitting
  }, [isSubmitting, submitError, onCancel])

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="sm:max-w-md bg-[oklch(0.16_0_0)] border-[oklch(0.24_0_0)] text-white">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <DialogTitle className="text-white">Delete Event</DialogTitle>
          </div>
        </DialogHeader>

        <p className="text-sm text-[oklch(0.6_0_0)]">
          Are you sure you want to delete{' '}
          <span className="font-medium text-white">"{eventTitle}"</span>? This
          action cannot be undone.
        </p>

        <DialogFooter className="gap-2 mt-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="border-[oklch(0.28_0_0)] text-[oklch(0.75_0_0)] hover:bg-[oklch(0.22_0_0)] hover:text-white"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
