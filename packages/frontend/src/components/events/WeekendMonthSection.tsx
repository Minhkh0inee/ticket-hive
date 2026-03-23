import { memo } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EventGridCard } from '@/components/common/EventGridCard'
import type { Event } from '@/types/event.types'

interface WeekendMonthSectionProps {
  weekendEvents: Event[]
  monthEvents: Event[]
  loading?: boolean
}

export const WeekendMonthSection = memo(function WeekendMonthSection({
  weekendEvents,
  monthEvents,
  loading = false,
}: WeekendMonthSectionProps) {
  return (
    <section aria-labelledby="weekend-heading">
      <Tabs defaultValue="weekend">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-[oklch(0.22_0_0)] border border-[oklch(0.28_0_0)] p-1 rounded-xl h-auto gap-0.5">
            <TabsTrigger
              value="weekend"
              id="weekend-heading"
              className="rounded-lg px-4 py-1.5 text-sm font-medium text-[oklch(0.6_0_0)] data-[state=active]:bg-[oklch(0.6_0.2_250)] data-[state=active]:text-white data-[state=active]:shadow-none transition-colors duration-150 cursor-pointer"
            >
              Cuối tuần này
            </TabsTrigger>
            <TabsTrigger
              value="month"
              className="rounded-lg px-4 py-1.5 text-sm font-medium text-[oklch(0.6_0_0)] data-[state=active]:bg-[oklch(0.6_0.2_250)] data-[state=active]:text-white data-[state=active]:shadow-none transition-colors duration-150 cursor-pointer"
            >
              Tháng này
            </TabsTrigger>
          </TabsList>

          <Link
            to="/events"
            className="text-[oklch(0.6_0.2_250)] text-sm hover:underline flex items-center gap-0.5 shrink-0"
          >
            Xem thêm <ChevronRight size={14} aria-hidden="true" />
          </Link>
        </div>

        <TabsContent value="weekend" className="mt-0">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-[oklch(0.19_0_0)] animate-pulse aspect-[3/4]" />
              ))}
            </div>
          ) : weekendEvents.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {weekendEvents.map(event => (
                <EventGridCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-[oklch(0.5_0_0)] text-sm py-8 text-center">
              Không có sự kiện cuối tuần này
            </p>
          )}
        </TabsContent>

        <TabsContent value="month" className="mt-0">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-[oklch(0.19_0_0)] animate-pulse aspect-[3/4]" />
              ))}
            </div>
          ) : monthEvents.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {monthEvents.map(event => (
                <EventGridCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-[oklch(0.5_0_0)] text-sm py-8 text-center">
              Không có sự kiện tháng này
            </p>
          )}
        </TabsContent>
      </Tabs>
    </section>
  )
})
