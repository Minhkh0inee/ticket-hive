import type { Event } from "@/types/event.types"

export function applyDateFilter(events: Event[], filter: string): Event[] {
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