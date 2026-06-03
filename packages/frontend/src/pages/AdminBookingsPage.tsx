import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import {
  fetchAdminBookingsRequest,
  setSelectedBooking,
} from '@/stores/slices/admin.slice'
import { type Booking, BookingStatus } from '@/types/event.types'
import { fmtDate, fmtPrice } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pagination } from '@/components/common/Pagination'
import { BookingDetailDialog } from '@/components/common/BookingDetailDialog'

const LIMIT = 10

const STATUS_COLORS: Record<BookingStatus, string> = {
  [BookingStatus.CONFIRMED]: 'oklch(0.55 0.18 160)',
  [BookingStatus.PENDING]: 'oklch(0.55 0.12 80)',
  [BookingStatus.CANCELLED]: 'oklch(0.55 0.18 25)',
}

const STATUS_LABELS: Record<BookingStatus, string> = {
  [BookingStatus.CONFIRMED]: 'Confirmed',
  [BookingStatus.PENDING]: 'Pending',
  [BookingStatus.CANCELLED]: 'Cancelled',
}

type StatusTab = 'all' | BookingStatus

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

export function AdminBookingsPage() {
  const dispatch = useAppDispatch()
  const { bookings, bookingsTotal, bookingsLoading, bookingsError, selectedBooking } =
    useAppSelector((s) => s.admin)

  const [page, setPage] = useState(1)
  const [activeTab, setActiveTab] = useState<StatusTab>('all')

  useEffect(() => {
    dispatch(
      fetchAdminBookingsRequest({
        offset: (page - 1) * LIMIT,
        limit: LIMIT,
        status: activeTab === 'all' ? undefined : activeTab,
      }),
    )
  }, [dispatch, page, activeTab])

  function handleTabChange(tab: string) {
    setActiveTab(tab as StatusTab)
    setPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(bookingsTotal / LIMIT))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Bookings</h1>
          <p className="text-sm text-[oklch(0.5_0_0)] mt-0.5">{bookingsTotal} total bookings</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-4">
        <TabsList className="bg-[oklch(0.16_0_0)] border border-[oklch(0.2_0_0)]">
          <TabsTrigger value="all" className="text-xs data-[state=active]:bg-[oklch(0.22_0_0)] data-[state=active]:text-white">
            All
          </TabsTrigger>
          <TabsTrigger value={BookingStatus.PENDING} className="text-xs data-[state=active]:bg-[oklch(0.22_0_0)] data-[state=active]:text-white">
            Pending
          </TabsTrigger>
          <TabsTrigger value={BookingStatus.CONFIRMED} className="text-xs data-[state=active]:bg-[oklch(0.22_0_0)] data-[state=active]:text-white">
            Confirmed
          </TabsTrigger>
          <TabsTrigger value={BookingStatus.CANCELLED} className="text-xs data-[state=active]:bg-[oklch(0.22_0_0)] data-[state=active]:text-white">
            Cancelled
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {bookingsError && (
        <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {bookingsError}
        </div>
      )}

      <div className="rounded-xl border border-[oklch(0.2_0_0)] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-[oklch(0.2_0_0)] hover:bg-transparent">
              <TableHead className="text-[oklch(0.5_0_0)] font-medium">Booking ID</TableHead>
              <TableHead className="text-[oklch(0.5_0_0)] font-medium">Event</TableHead>
              <TableHead className="text-[oklch(0.5_0_0)] font-medium">Attendee</TableHead>
              <TableHead className="text-[oklch(0.5_0_0)] font-medium">Status</TableHead>
              <TableHead className="text-[oklch(0.5_0_0)] font-medium">Total</TableHead>
              <TableHead className="text-[oklch(0.5_0_0)] font-medium">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookingsLoading ? (
              <TableSkeleton />
            ) : bookings.length === 0 ? (
              <TableRow className="border-[oklch(0.2_0_0)] hover:bg-transparent">
                <TableCell colSpan={6} className="text-center py-12 text-[oklch(0.45_0_0)]">
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking: Booking) => (
                <TableRow
                  key={booking.id}
                  className="border-[oklch(0.2_0_0)] hover:bg-[oklch(0.15_0_0)] cursor-pointer"
                  onClick={() => dispatch(setSelectedBooking(booking))}
                >
                  <TableCell>
                    <span className="font-mono text-xs text-[oklch(0.6_0_0)]">
                      {booking.id.slice(0, 8)}
                    </span>
                  </TableCell>
                  <TableCell className="text-white font-medium max-w-[180px]">
                    <span className="block truncate" title={booking.event.title}>
                      {booking.event.title}
                    </span>
                  </TableCell>
                  <TableCell className="text-[oklch(0.6_0_0)]">
                    {booking.attendeeName}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="text-white border-0 text-xs capitalize"
                      style={{ background: STATUS_COLORS[booking.status] }}
                    >
                      {STATUS_LABELS[booking.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[oklch(0.6_0_0)] whitespace-nowrap">
                    {fmtPrice(booking.totalPrice)}
                  </TableCell>
                  <TableCell className="text-[oklch(0.6_0_0)] whitespace-nowrap">
                    {fmtDate(booking.createdAt)}
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

      <BookingDetailDialog
        booking={selectedBooking}
        onClose={() => dispatch(setSelectedBooking(null))}
      />
    </div>
  )
}
