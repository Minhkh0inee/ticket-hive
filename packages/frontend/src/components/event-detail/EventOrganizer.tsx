import { memo, useMemo } from 'react'
import { Building2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { EventOrganizer as OrganizerType } from '@/types/event.types'

interface EventOrganizerProps {
  organizer: OrganizerType
}

export const EventOrganizer = memo(function EventOrganizer({ organizer }: EventOrganizerProps) {
  const initials = useMemo(
    () => organizer.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase(),
    [organizer.name]
  )

  return (
    <section
      aria-labelledby="organizer-heading"
      className="bg-[oklch(0.19_0_0)] border border-[oklch(0.26_0_0)] rounded-2xl p-6"
    >
      <h2
        id="organizer-heading"
        className="text-white font-bold text-base mb-4 flex items-center gap-2"
      >
        <span className="w-1 h-5 bg-[oklch(0.6_0.2_250)] rounded-full inline-block" aria-hidden="true" />
        Ban tổ chức
      </h2>

      <div className="flex items-start gap-4">
        <Avatar className="w-14 h-14 rounded-xl border border-[oklch(0.3_0_0)] shrink-0">
          {organizer.logoUrl && <AvatarImage src={organizer.logoUrl} alt={organizer.name} />}
          <AvatarFallback className="rounded-xl bg-[oklch(0.25_0_0)] text-[oklch(0.5_0_0)]">
            {organizer.logoUrl ? (
              <Building2 size={22} aria-hidden="true" />
            ) : (
              initials || <Building2 size={22} aria-hidden="true" />
            )}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="text-white font-bold text-sm mb-1">{organizer.name}</p>
          <p className="text-[oklch(0.6_0_0)] text-xs leading-relaxed">
            {organizer.description}
          </p>
        </div>
      </div>
    </section>
  )
})
