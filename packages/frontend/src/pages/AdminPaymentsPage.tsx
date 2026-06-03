import { useEffect, useRef, useState } from 'react'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import {
  fetchAdminPaymentsRequest,
  cancelPaymentRequest,
} from '@/stores/slices/admin.slice'
import { type AdminPayment, PaymentStatus } from '@/types/event.types'
import { fmtDate, fmtPrice } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/common/Pagination'
import { XCircle } from 'lucide-react'

const LIMIT = 10

const STATUS_COLORS: Record<PaymentStatus, string> = {
  [PaymentStatus.COMPLETED]: 'oklch(0.55 0.18 160)',
  [PaymentStatus.PENDING]: 'oklch(0.55 0.12 80)',
  [PaymentStatus.CANCELLED]: 'oklch(0.55 0.18 25)',
}

const STATUS_LABELS: Record<PaymentStatus, string> = {
  [PaymentStatus.COMPLETED]: 'Completed',
  [PaymentStatus.PENDING]: 'Pending',
  [PaymentStatus.CANCELLED]: 'Cancelled',
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i} className="border-[oklch(0.2_0_0)] hover:bg-transparent">
          {Array.from({ length: 6 }).map((_, j) => (
            <TableCell key={j}>
              <div className="h-4 bg-[oklch(0.22_0_0)] rounded animate-pulse" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

export function AdminPaymentsPage() {
  const dispatch = useAppDispatch()
  const {
    payments,
    paymentsTotal,
    paymentsLoading,
    paymentsError,
    isCancellingPayment,
  } = useAppSelector((s) => s.admin)

  const [page, setPage] = useState(1)
  const [cancelTarget, setCancelTarget] = useState<AdminPayment | null>(null)
  const wasCancellingRef = useRef(false)

  useEffect(() => {
    dispatch(fetchAdminPaymentsRequest({ offset: (page - 1) * LIMIT, limit: LIMIT }))
  }, [dispatch, page])

  // Close cancel dialog after cancel completes
  useEffect(() => {
    if (wasCancellingRef.current && !isCancellingPayment && cancelTarget) {
      setCancelTarget(null)
    }
    wasCancellingRef.current = isCancellingPayment
  }, [isCancellingPayment, cancelTarget])

  const totalPages = Math.max(1, Math.ceil(paymentsTotal / LIMIT))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Payments</h1>
          <p className="text-sm text-[oklch(0.5_0_0)] mt-0.5">{paymentsTotal} total payments</p>
        </div>
      </div>

      {paymentsError && (
        <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {paymentsError}
        </div>
      )}

      <div className="rounded-xl border border-[oklch(0.2_0_0)] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-[oklch(0.2_0_0)] hover:bg-transparent">
              <TableHead className="text-[oklch(0.5_0_0)] font-medium">Order Code</TableHead>
              <TableHead className="text-[oklch(0.5_0_0)] font-medium">Event</TableHead>
              <TableHead className="text-[oklch(0.5_0_0)] font-medium">Attendee</TableHead>
              <TableHead className="text-[oklch(0.5_0_0)] font-medium">Amount</TableHead>
              <TableHead className="text-[oklch(0.5_0_0)] font-medium">Status</TableHead>
              <TableHead className="text-[oklch(0.5_0_0)] font-medium">Created</TableHead>
              <TableHead className="text-[oklch(0.5_0_0)] font-medium w-16">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentsLoading ? (
              <TableSkeleton />
            ) : payments.length === 0 ? (
              <TableRow className="border-[oklch(0.2_0_0)] hover:bg-transparent">
                <TableCell colSpan={7} className="text-center py-12 text-[oklch(0.45_0_0)]">
                  No payments found
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment: AdminPayment) => (
                <TableRow
                  key={payment.id}
                  className="border-[oklch(0.2_0_0)] hover:bg-[oklch(0.15_0_0)]"
                >
                  <TableCell>
                    <span className="font-mono text-xs text-[oklch(0.6_0_0)]">
                      {payment.orderCode}
                    </span>
                  </TableCell>
                  <TableCell className="text-white font-medium max-w-[180px]">
                    <span className="block truncate" title={payment.booking?.event?.title}>
                      {payment.booking?.event?.title ?? '—'}
                    </span>
                  </TableCell>
                  <TableCell className="text-[oklch(0.6_0_0)]">
                    {payment.booking?.attendeeName ?? '—'}
                  </TableCell>
                  <TableCell className="text-[oklch(0.6_0_0)] whitespace-nowrap">
                    {fmtPrice(String(payment.amount))}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="text-white border-0 text-xs capitalize"
                      style={{ background: STATUS_COLORS[payment.status] }}
                    >
                      {STATUS_LABELS[payment.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[oklch(0.6_0_0)] whitespace-nowrap">
                    {fmtDate(payment.createdAt)}
                  </TableCell>
                  <TableCell>
                    {payment.status === PaymentStatus.PENDING && (
                      <button
                        onClick={() => setCancelTarget(payment)}
                        className="p-1.5 rounded hover:bg-red-500/10 text-[oklch(0.55_0_0)] hover:text-red-400 transition-colors"
                        title="Cancel payment"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Cancel confirmation dialog */}
      <Dialog open={cancelTarget !== null} onOpenChange={(open) => { if (!open) setCancelTarget(null) }}>
        <DialogContent className="bg-[oklch(0.19_0_0)] border-[oklch(0.26_0_0)] text-white sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white">Cancel Payment</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[oklch(0.6_0_0)]">
            Cancel payment{' '}
            <span className="font-mono text-white">{cancelTarget?.orderCode}</span> for{' '}
            <span className="text-white">{cancelTarget?.booking?.attendeeName}</span>?
            This will also cancel the associated booking and restore seat availability.
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setCancelTarget(null)}
              className="border-[oklch(0.3_0_0)] text-[oklch(0.7_0_0)] hover:bg-[oklch(0.22_0_0)]"
            >
              Keep
            </Button>
            <Button
              onClick={() => {
                if (cancelTarget) dispatch(cancelPaymentRequest(cancelTarget.orderCode))
              }}
              disabled={isCancellingPayment}
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              {isCancellingPayment ? 'Cancelling…' : 'Cancel Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
