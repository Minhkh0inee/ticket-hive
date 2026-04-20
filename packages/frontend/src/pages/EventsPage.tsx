import {useMemo, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { EventFilterBar } from '@/components/events/EventFilterBar'
import { EventGrid } from '@/components/events/EventGrid'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { fetchEventsRequest } from '@/stores/slices/event.slice'
import { Pagination } from '@/components/common/Pagination'
import { applyDateFilter } from '@/utils/applyDateFilter'

const LIMIT = 12

export function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  
  const events = useAppSelector((state) => state.event.events)
  const error = useAppSelector((state) => state.event.error)
  const pagination = useAppSelector((state) => state.event.pagination)
  const categories = useAppSelector((state) => state.category.categories)

  const categoryParam = searchParams.get('category')
  const venueParam = searchParams.get('venue')
  const offsetParam = Number(searchParams.get('offset')) || 0
  const dateFilter = searchParams.get('date') || 'all' // Đưa vào URL

  useEffect(() => {
    dispatch(fetchEventsRequest({
      offset: offsetParam,
      limit: LIMIT,
      category: categoryParam ?? undefined,
      city: venueParam ?? undefined,
    }))
  }, [dispatch, offsetParam, categoryParam, venueParam])

  const filteredEvents = useMemo(() => applyDateFilter(events, dateFilter), [events, dateFilter])
  
  const categoryMeta = useMemo(
    () => (categoryParam ? categories.find(c => c.slug === categoryParam) : null),
    [categoryParam, categories]
  )

  const pageTitle = useMemo(
    () => categoryMeta?.name ?? venueParam ?? 'Tất cả sự kiện',
    [categoryMeta, venueParam]
  )

  const handlePageChange = useCallback((page: number) => {
    const newOffset = (page - 1) * LIMIT
    setSearchParams((prev) => {
      prev.set('offset', String(newOffset))
      return prev
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [setSearchParams])

  const onDateFilterChange = useCallback((val: string) => {
    setSearchParams((prev) => {
      prev.set('date', val)
      prev.set('offset', '0') 
      return prev
    })
  }, [setSearchParams])

  return (
    <div className="min-h-screen bg-[oklch(0.145_0_0)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {error ? (
          <div className="flex items-center justify-center h-64">
             <p className="text-red-400">{error}</p>
          </div>
        ) : (
          <>
            <EventFilterBar
              pageTitle={pageTitle}
              filteredCount={pagination.total}
              dateFilter={dateFilter}
              onDateFilterChange={onDateFilterChange}
              hasActiveFilter={!!(categoryParam || venueParam || dateFilter !== 'all')}
              onClearFilter={() => setSearchParams({})}
            />

            <EventGrid
              key={events.length > 0 ? 'results' : 'empty'}
              events={filteredEvents}
              totalFilteredCount={pagination.total}
              onClearFilter={() => setSearchParams({})}
            />

            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={Math.floor(offsetParam / LIMIT) + 1}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}