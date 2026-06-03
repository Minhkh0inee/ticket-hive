import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, Armchair } from 'lucide-react'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import {
  fetchAdminEventsRequest,
  setSelectedEvent,
  clearSelectedEvent,
  deleteEventRequest,
} from '@/stores/slices/admin.slice'
import { type Event, EventStatus } from '@/types/event.types'
import { fmtDate, fmtPrice } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pagination } from '@/components/common/Pagination'
import { EventFormModal } from '@/components/admin/EventFormModal'
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog'

const LIMIT = 10

const STATUS_COLORS: Record<EventStatus, string> = {
  [EventStatus.UPCOMING]: 'oklch(0.55 0.18 250)',
  [EventStatus.ONGOING]: 'oklch(0.55 0.18 160)',
  [EventStatus.SOLD_OUT]: 'oklch(0.55 0.12 80)',
  [EventStatus.ENDED]: 'oklch(0.5 0 0)',
  [EventStatus.CANCELLED]: 'oklch(0.55 0.18 25)',
}

const STATUS_LABELS: Record<EventStatus, string> = {
  [EventStatus.UPCOMING]: 'Upcoming',
  [EventStatus.ONGOING]: 'Ongoing',
  [EventStatus.SOLD_OUT]: 'Sold Out',
  [EventStatus.ENDED]: 'Ended',
  [EventStatus.CANCELLED]: 'Cancelled',
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i} className="border-[oklch(0.2_0_0)] hover:bg-transparent">
          {Array.from({ length: 7 }).map((_, j) => (
            <TableCell key={j}>
              <div className="h-4 bg-[oklch(0.22_0_0)] rounded animate-pulse" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

export function AdminEventsPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { events, total, isLoading, error, selectedEvent, isSubmitting, submitError } =
    useAppSelector((s) => s.admin)

  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null)
  const wasSubmittingDeleteRef = useRef(false)

  useEffect(() => {
    dispatch(fetchAdminEventsRequest({ offset: (page - 1) * LIMIT, limit: LIMIT }))
  }, [dispatch, page])

  // Close delete dialog when delete completes successfully
  useEffect(() => {
    if (wasSubmittingDeleteRef.current && !isSubmitting && !submitError && deleteTarget) {
      setDeleteTarget(null)
    }
    wasSubmittingDeleteRef.current = isSubmitting
  }, [isSubmitting, submitError, deleteTarget])

  function handleCreate() {
    dispatch(clearSelectedEvent())
    setFormMode('create')
    setFormOpen(true)
  }

  function handleEdit(event: Event) {
    dispatch(setSelectedEvent(event))
    setFormMode('edit')
    setFormOpen(true)
  }

  function handleFormClose() {
    setFormOpen(false)
    dispatch(clearSelectedEvent())
  }

  function handleDeleteConfirm() {
    if (deleteTarget) {
      dispatch(deleteEventRequest(deleteTarget.id))
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / LIMIT))

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Events</h1>
          <p className="text-sm text-[oklch(0.5_0_0)] mt-0.5">{total} total events</p>
        </div>
        <Button
          onClick={handleCreate}
          className="text-white gap-2"
          style={{ background: 'oklch(0.6 0.2 250)' }}
        >
          <Plus className="w-4 h-4" />
          Create Event
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-[oklch(0.2_0_0)] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-[oklch(0.2_0_0)] hover:bg-transparent">
              <TableHead className="text-[oklch(0.5_0_0)] font-medium">Title</TableHead>
              <TableHead className="text-[oklch(0.5_0_0)] font-medium">Category</TableHead>
              <TableHead className="text-[oklch(0.5_0_0)] font-medium">Date</TableHead>
              <TableHead className="text-[oklch(0.5_0_0)] font-medium">Venue</TableHead>
              <TableHead className="text-[oklch(0.5_0_0)] font-medium">Status</TableHead>
              <TableHead className="text-[oklch(0.5_0_0)] font-medium">Seats</TableHead>
              <TableHead className="text-[oklch(0.5_0_0)] font-medium">Price</TableHead>
              <TableHead className="text-[oklch(0.5_0_0)] font-medium w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : events.length === 0 ? (
              <TableRow className="border-[oklch(0.2_0_0)] hover:bg-transparent">
                <TableCell
                  colSpan={8}
                  className="text-center py-12 text-[oklch(0.45_0_0)]"
                >
                  No events found
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow
                  key={event.id}
                  className="border-[oklch(0.2_0_0)] hover:bg-[oklch(0.15_0_0)]"
                >
                  <TableCell className="text-white font-medium max-w-[200px]">
                    <span className="block truncate" title={event.title}>
                      {event.title}
                    </span>
                  </TableCell>
                  <TableCell className="text-[oklch(0.6_0_0)]">
                    {event.category?.name ?? '—'}
                  </TableCell>
                  <TableCell className="text-[oklch(0.6_0_0)] whitespace-nowrap">
                    {fmtDate(event.eventDate)}
                  </TableCell>
                  <TableCell className="text-[oklch(0.6_0_0)] max-w-[150px]">
                    <span className="block truncate" title={`${event.venue}, ${event.city}`}>
                      {event.venue}, {event.city}
                    </span>
                  </TableCell>
                  <TableCell>
                    {event.status ? (
                      <Badge
                        className="text-white border-0 text-xs"
                        style={{ background: STATUS_COLORS[event.status] }}
                      >
                        {STATUS_LABELS[event.status]}
                      </Badge>
                    ) : (
                      <span className="text-[oklch(0.4_0_0)]">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-[oklch(0.6_0_0)] whitespace-nowrap">
                    {event.availableSeats}/{event.totalSeats}
                  </TableCell>
                  <TableCell className="text-[oklch(0.6_0_0)] whitespace-nowrap">
                    {fmtPrice(String(event.basePrice))}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/admin/events/${event.id}/seats`)}
                        className="p-1.5 rounded hover:bg-[oklch(0.22_0_0)] text-[oklch(0.55_0_0)] hover:text-white transition-colors"
                        title="View Seats"
                      >
                        <Armchair className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleEdit(event)}
                        className="p-1.5 rounded hover:bg-[oklch(0.22_0_0)] text-[oklch(0.55_0_0)] hover:text-white transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(event)}
                        className="p-1.5 rounded hover:bg-red-500/10 text-[oklch(0.55_0_0)] hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Modals */}
      <EventFormModal
        open={formOpen}
        onClose={handleFormClose}
        mode={formMode}
        event={selectedEvent}
      />

      <DeleteConfirmDialog
        open={deleteTarget !== null}
        eventTitle={deleteTarget?.title ?? ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
