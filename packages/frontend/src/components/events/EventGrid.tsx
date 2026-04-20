import { useRef, useEffect, useCallback, useState, useMemo, memo } from 'react'
import { Loader2, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EventGridCard } from '@/components/common/EventGridCard'
import { EventCardSkeleton } from '@/components/common/EventCardSkeleton'
import type { Event } from '@/types/event.types'

const PAGE_SIZE = 20

interface EventGridProps {
  events: Event[]
  totalFilteredCount: number
  onClearFilter: () => void
}

export const EventGrid = memo(function EventGrid({ events, totalFilteredCount, onClearFilter }: EventGridProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [prevEvents, setPrevEvents] = useState(events);
  if (events !== prevEvents) {
      setPrevEvents(events);
      setVisibleCount(PAGE_SIZE);
  }

  const visibleEvents = useMemo(() => events.slice(0, visibleCount), [events, visibleCount])
  const hasMore = useMemo(() => visibleCount < events.length, [visibleCount, events.length])

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
        if (entries[0].isIntersecting) loadMore()
      },
      { rootMargin: '300px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loadMore])

  // ── Empty state ──────────────────────────────────────────────────────────
  if (totalFilteredCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-16 h-16 rounded-full bg-[oklch(0.22_0_0)] flex items-center justify-center mb-4">
          <Filter className="text-[oklch(0.4_0_0)]" size={28} aria-hidden="true" />
        </div>
        <p className="text-[oklch(0.6_0_0)] text-lg font-medium mb-1">
          Không tìm thấy sự kiện nào
        </p>
        <p className="text-[oklch(0.4_0_0)] text-sm mb-6">
          Thử tìm kiếm với bộ lọc khác
        </p>
        <Button
          onClick={onClearFilter}
          className="rounded-full bg-[oklch(0.6_0.2_250)] hover:bg-[oklch(0.54_0.2_250)] text-white"
        >
          Xem tất cả sự kiện
        </Button>
      </div>
    )
  }

  // ── Grid ─────────────────────────────────────────────────────────────────
  return (
    <>
      <div
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        role="list"
        aria-label="Danh sách sự kiện"
      >
        {visibleEvents.map(event => (
          <div key={event.id} role="listitem">
            <EventGridCard event={event} />
          </div>
        ))}

        {/* Skeleton cards while loading */}
        {isLoadingMore &&
          Array.from({ length: 4 }).map((_, i) => (
            <EventCardSkeleton key={`skeleton-${i}`} />
          ))}
      </div>

      <div ref={sentinelRef} className="h-1" aria-hidden="true" />

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
            Đã hiển thị tất cả {totalFilteredCount} sự kiện
          </p>
        )}
      </div>
    </>
  )
})
