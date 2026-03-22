import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, ChevronDown, X, Loader2, Calendar } from 'lucide-react'
import { mockEvents } from '@/mocks/events.mock'
import { mockCategories } from '@/mocks/categories.mock'
import { EventGridCard } from '@/components/common/EventGridCard'
import type { Event, EventCategory } from '@/types/event.types'

const PAGE_SIZE = 20

const DATE_FILTERS = [
  { id: 'all', label: 'Tất cả các ngày' },
  { id: 'today', label: 'Hôm nay' },
  { id: 'week', label: 'Tuần này' },
  { id: 'month', label: 'Tháng này' },
]

function applyDateFilter(events: Event[], filter: string): Event[] {
  if (filter === 'all') return events
  const now = new Date()
  return events.filter(e => {
    const d = new Date(e.eventDate)
    if (filter === 'today') {
      return d.toDateString() === now.toDateString()
    }
    if (filter === 'week') {
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      return d >= weekStart && d <= weekEnd
    }
    if (filter === 'month') {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }
    return true
  })
}

function EventCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-[oklch(0.19_0_0)] border border-[oklch(0.25_0_0)] animate-pulse">
      <div className="bg-[oklch(0.24_0_0)]" style={{ aspectRatio: '3/2' }} />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-[oklch(0.28_0_0)] rounded w-full" />
        <div className="h-3 bg-[oklch(0.28_0_0)] rounded w-3/4" />
        <div className="h-2.5 bg-[oklch(0.26_0_0)] rounded w-1/2 mt-1" />
        <div className="h-2.5 bg-[oklch(0.26_0_0)] rounded w-2/3" />
      </div>
    </div>
  )
}

export function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const categoryParam = searchParams.get('category') as EventCategory | null
  const venueParam = searchParams.get('venue')

  const [dateFilter, setDateFilter] = useState('all')
  const [showDateDropdown, setShowDateDropdown] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const sentinelRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDateDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Filter events based on URL params + date filter
  const filteredEvents = useMemo(() => {
    let events = mockEvents
    if (categoryParam && categoryParam !== 'all') {
      events = events.filter(e => e.category === categoryParam)
    }
    if (venueParam) {
      events = events.filter(e =>
        e.venue.toLowerCase().includes(venueParam.toLowerCase())
      )
    }
    return applyDateFilter(events, dateFilter)
  }, [categoryParam, venueParam, dateFilter])

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [categoryParam, venueParam, dateFilter])

  const visibleEvents = useMemo(
    () => filteredEvents.slice(0, visibleCount),
    [filteredEvents, visibleCount]
  )

  const hasMore = visibleCount < filteredEvents.length

  // Infinite scroll via IntersectionObserver
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return
    setIsLoadingMore(true)
    setTimeout(() => {
      setVisibleCount(prev => prev + PAGE_SIZE)
      setIsLoadingMore(false)
    }, 500)
  }, [isLoadingMore, hasMore])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { rootMargin: '300px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loadMore])

  // Labels for UI
  const categoryMeta = categoryParam
    ? mockCategories.find(c => c.id === categoryParam)
    : null

  const pageTitle = categoryMeta
    ? `${categoryMeta.label}`
    : venueParam
      ? venueParam
      : 'Tất cả sự kiện'

  const activeDateLabel =
    DATE_FILTERS.find(d => d.id === dateFilter)?.label ?? 'Tất cả các ngày'

  const hasActiveFilter = !!(categoryParam || venueParam)

  function clearFilter() {
    setSearchParams({})
  }

  return (
    <div className="min-h-screen bg-[oklch(0.145_0_0)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filter Bar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          {/* Left: result label */}
          <p className="text-[oklch(0.55_0_0)] text-sm">
            Kết quả tìm kiếm:{' '}
            <span className="text-white font-semibold">{pageTitle}</span>
            <span className="ml-2 text-[oklch(0.45_0_0)]">
              ({filteredEvents.length} sự kiện)
            </span>
          </p>

          {/* Right: filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Date filter dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDateDropdown(p => !p)}
                className="flex items-center gap-2 bg-[oklch(0.2_0_0)] border border-[oklch(0.3_0_0)] text-[oklch(0.85_0_0)] text-sm px-3 py-2 rounded-full hover:border-[oklch(0.45_0_0)] hover:text-white transition-all duration-150 min-h-[36px]"
                aria-haspopup="listbox"
                aria-expanded={showDateDropdown}
              >
                <Calendar size={13} aria-hidden="true" />
                <span>{activeDateLabel}</span>
                <ChevronDown
                  size={13}
                  aria-hidden="true"
                  className={`transition-transform duration-150 ${showDateDropdown ? 'rotate-180' : ''}`}
                />
              </button>

              {showDateDropdown && (
                <div
                  className="absolute right-0 top-[calc(100%+6px)] bg-[oklch(0.22_0_0)] border border-[oklch(0.3_0_0)] rounded-xl overflow-hidden z-30 min-w-[190px] shadow-2xl shadow-black/60"
                  role="listbox"
                  aria-label="Lọc theo ngày"
                >
                  {DATE_FILTERS.map(f => (
                    <button
                      key={f.id}
                      role="option"
                      aria-selected={dateFilter === f.id}
                      onClick={() => {
                        setDateFilter(f.id)
                        setShowDateDropdown(false)
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-100 ${
                        dateFilter === f.id
                          ? 'bg-[oklch(0.6_0.2_250)] text-white font-medium'
                          : 'text-[oklch(0.75_0_0)] hover:bg-[oklch(0.28_0_0)] hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter button (decorative) */}
            <button
              className="flex items-center gap-2 bg-[oklch(0.2_0_0)] border border-[oklch(0.3_0_0)] text-[oklch(0.85_0_0)] text-sm px-3 py-2 rounded-full hover:border-[oklch(0.45_0_0)] hover:text-white transition-all duration-150 min-h-[36px]"
              aria-label="Bộ lọc nâng cao"
            >
              <Filter size={13} aria-hidden="true" />
              Bộ lọc
            </button>

            {/* Active category/venue badge */}
            {hasActiveFilter && (
              <button
                onClick={clearFilter}
                className="flex items-center gap-1.5 bg-[oklch(0.6_0.2_250)] text-white text-sm px-3 py-2 rounded-full hover:bg-[oklch(0.54_0.2_250)] active:bg-[oklch(0.5_0.2_250)] transition-all duration-150 min-h-[36px] font-medium"
                aria-label={`Xóa bộ lọc: ${pageTitle}`}
              >
                <span>{pageTitle}</span>
                <X size={13} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Empty state */}
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 rounded-full bg-[oklch(0.22_0_0)] flex items-center justify-center mb-4">
              <Filter className="text-[oklch(0.4_0_0)]" size={28} />
            </div>
            <p className="text-[oklch(0.6_0_0)] text-lg font-medium mb-1">
              Không tìm thấy sự kiện nào
            </p>
            <p className="text-[oklch(0.4_0_0)] text-sm mb-6">
              Thử tìm kiếm với bộ lọc khác
            </p>
            <button
              onClick={() => {
                clearFilter()
                setDateFilter('all')
              }}
              className="bg-[oklch(0.6_0.2_250)] hover:bg-[oklch(0.54_0.2_250)] text-white text-sm px-4 py-2 rounded-full transition-colors duration-150"
            >
              Xem tất cả sự kiện
            </button>
          </div>
        ) : (
          <>
            {/* Event Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {visibleEvents.map(event => (
                <EventGridCard key={event.id} event={event} />
              ))}
              {/* Loading skeletons while loading more */}
              {isLoadingMore &&
                Array.from({ length: 4 }).map((_, i) => (
                  <EventCardSkeleton key={`skeleton-${i}`} />
                ))}
            </div>

            {/* Sentinel div — triggers load more via IntersectionObserver */}
            <div ref={sentinelRef} className="h-1" aria-hidden="true" />

            {/* Bottom status */}
            <div className="mt-8 flex flex-col items-center justify-center py-4 gap-2">
              {isLoadingMore && (
                <div className="flex items-center gap-2 text-[oklch(0.55_0_0)] text-sm">
                  <Loader2
                    className="animate-spin text-[oklch(0.6_0.2_250)]"
                    size={20}
                    aria-hidden="true"
                  />
                  <span>Đang tải thêm...</span>
                </div>
              )}
              {!hasMore && (
                <p className="text-[oklch(0.4_0_0)] text-sm">
                  Đã hiển thị tất cả {filteredEvents.length} sự kiện
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
