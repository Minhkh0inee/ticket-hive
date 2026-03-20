import { SectionTitle } from '@/components/common/SectionTitle'
import { EventCard } from '@/components/common/EventCard'
import type { Event } from '@/types/event.types'

interface EventRowProps {
  title: string
  events: Event[]
  href?: string
}

export function EventRow({ title, events, href }: EventRowProps) {
  if (events.length === 0) return null

  return (
    <section>
      <SectionTitle title={title} href={href} />
      <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  )
}
