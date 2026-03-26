import { EventCardSkeleton } from '@/components/common/EventCardSkeleton'

interface CategoryEventRowSkeletonProps {
  title: string
  count?: number
}

export function CategoryEventRowSkeleton({ title, count = 5 }: CategoryEventRowSkeletonProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-bold text-lg">{title}</h2>
        <div className="h-4 w-16 bg-[oklch(0.26_0_0)] rounded animate-pulse" />
      </div>
      <div className="flex gap-3 overflow-x-hidden pb-2">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="min-w-[190px] max-w-[190px] sm:min-w-[210px] sm:max-w-[210px] shrink-0">
            <EventCardSkeleton />
          </div>
        ))}
      </div>
    </section>
  )
}
