import { useState, useMemo, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { mockCategories } from '@/mocks/categories.mock'
import { EventFilterBar } from '@/components/events/EventFilterBar'
import { EventGrid } from '@/components/events/EventGrid'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import type { EventCategory } from '@/types/event.types'
import { fetchEventsRequest } from '@/stores/slices/event.slice'
import { Pagination } from '@/components/common/Pagination'
import { applyDateFilter } from '@/utils/applyDateFilter'

const LIMIT = 12

export function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [dateFilter, setDateFilter] = useState('all')

  const dispatch = useAppDispatch()
  const { events, error, pagination } = useAppSelector((state) => state.event)

  const categoryParam = searchParams.get('category') as EventCategory | null
  const venueParam = searchParams.get('venue')
  const offsetParam = Number(searchParams.get('offset')) || 0

  useEffect(() => {
    dispatch(fetchEventsRequest({
      offset: offsetParam,
      limit: LIMIT,
      category: categoryParam ?? undefined,
      city: venueParam ?? undefined,
    }))
  }, [dispatch, offsetParam, categoryParam, venueParam])

  const filteredEvents = useMemo(() => {
    return applyDateFilter(events, dateFilter)
  }, [events, dateFilter])

  const categoryMeta = useMemo(
    () => (categoryParam ? mockCategories.find(c => c.id === categoryParam) : null),
    [categoryParam]
  )

  const pageTitle = useMemo(
    () => categoryMeta?.label ?? venueParam ?? 'Tất cả sự kiện',
    [categoryMeta, venueParam]
  )

  const hasActiveFilter = useMemo(
    () => !!(categoryParam || venueParam),
    [categoryParam, venueParam]
  )

  const currentPage = Math.floor(offsetParam / LIMIT) + 1

  const handlePageChange = useCallback((page: number) => {
    const newOffset = (page - 1) * LIMIT
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('offset', String(newOffset))
      return next
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [setSearchParams])

  const clearFilter = useCallback(() => {
    setSearchParams({})
    setDateFilter('all')
  }, [setSearchParams])

  if (error) return (
    <div className="min-h-screen bg-[oklch(0.145_0_0)] flex items-center justify-center">
      <p className="text-red-400">{error}</p>
    </div>
  )
  console.log(events)
  return (
    <div className="min-h-screen bg-[oklch(0.145_0_0)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <EventFilterBar
          pageTitle={pageTitle}
          filteredCount={pagination.total}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          hasActiveFilter={hasActiveFilter}
          onClearFilter={clearFilter}
        />

        <EventGrid
          events={filteredEvents}
          // loading={isLoading}
          totalFilteredCount={pagination.total}
          onClearFilter={clearFilter}
        />

        {pagination.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  )
}