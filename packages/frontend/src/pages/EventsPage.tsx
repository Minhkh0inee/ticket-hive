import { useState, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { mockEvents } from '@/mocks/events.mock'
import { mockCategories } from '@/mocks/categories.mock'
import { EventFilterBar } from '@/components/events/EventFilterBar'
import { EventGrid } from '@/components/events/EventGrid'
import type { Event, EventCategory } from '@/types/event.types'

function applyDateFilter(events: Event[], filter: string): Event[] {
  if (filter === 'all') return events
  const now = new Date()
  return events.filter(e => {
    const d = new Date(e.eventDate)
    if (filter === 'today') return d.toDateString() === now.toDateString()
    if (filter === 'week') {
      const start = new Date(now)
      start.setDate(now.getDate() - now.getDay())
      const end = new Date(start)
      end.setDate(start.getDate() + 6)
      return d >= start && d <= end
    }
    if (filter === 'month') {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }
    return true
  })
}

export function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [dateFilter, setDateFilter] = useState('all')

  const categoryParam = searchParams.get('category') as EventCategory | null
  const venueParam = searchParams.get('venue')

  const filteredEvents = useMemo(() => {
    let events = mockEvents
    if (categoryParam) events = events.filter(e => e.category === categoryParam)
    if (venueParam) events = events.filter(e => e.venue.toLowerCase().includes(venueParam.toLowerCase()))
    return applyDateFilter(events, dateFilter)
  }, [categoryParam, venueParam, dateFilter])

  const categoryMeta = useMemo(
    () => (categoryParam ? mockCategories.find(c => c.id === categoryParam) : null),
    [categoryParam]
  )
  const pageTitle = useMemo(
    () => categoryMeta?.label ?? venueParam ?? 'Tất cả sự kiện',
    [categoryMeta, venueParam]
  )
  const hasActiveFilter = useMemo(() => !!(categoryParam || venueParam), [categoryParam, venueParam])

  const clearFilter = useCallback(() => {
    setSearchParams({})
    setDateFilter('all')
  }, [setSearchParams])

  return (
    <div className="min-h-screen bg-[oklch(0.145_0_0)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <EventFilterBar
          pageTitle={pageTitle}
          filteredCount={filteredEvents.length}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          hasActiveFilter={hasActiveFilter}
          onClearFilter={clearFilter}
        />

        <EventGrid
          events={filteredEvents}
          totalFilteredCount={filteredEvents.length}
          onClearFilter={clearFilter}
        />
      </div>
    </div>
  )
}
