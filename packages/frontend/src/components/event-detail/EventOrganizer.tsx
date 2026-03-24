import { memo, useMemo } from 'react'
import { Mail } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { EventOrganizer as OrganizerType } from '@/types/event.types'

interface EventOrganizerProps {
  organizer: OrganizerType
}

export const EventOrganizer = memo(function EventOrganizer({ organizer }: EventOrganizerProps) {
  const initials = useMemo(
    () => `${organizer.firstName[0]}${organizer.lastName[0]}`.toUpperCase(),
    [organizer.firstName, organizer.lastName]
  )

  const fullName = `${organizer.firstName} ${organizer.lastName}`

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

      <div className="flex items-center gap-4">
        <Avatar className="w-12 h-12 rounded-xl border border-[oklch(0.3_0_0)] shrink-0">
          <AvatarFallback className="rounded-xl bg-[oklch(0.6_0.2_250)] text-white text-sm font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="text-white font-bold text-sm">{fullName}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Mail size={11} className="text-[oklch(0.5_0_0)] shrink-0" aria-hidden="true" />
            <p className="text-[oklch(0.5_0_0)] text-xs truncate">{organizer.email}</p>
          </div>
        </div>
      </div>
    </section>
  )
})