import { useMemo, useCallback, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HeroGallery } from '@/components/event-detail/HeroGallery'
import { EventInfoPanel } from '@/components/event-detail/EventInfoPanel'
import { EventDescription } from '@/components/event-detail/EventDescription'
import { EventSidebar } from '@/components/event-detail/EventSidebar'
import { EventPromoBanner } from '@/components/event-detail/EventPromoBanner'
import { EventGridCard } from '@/components/common/EventGridCard'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { fetchEventDetailRequest, fetchEventsRequest } from '@/stores/slices/event.slice'
import EventDetailSkeleton from '@/components/events/EventDetailSkeleton'
import EventDetailError from '@/components/events/EventDetailError'
import { EventSchedule } from '@/components/event-detail/schedule/EventSchedule'
import { EventOrganizer } from '@/components/event-detail/EventOrganizer'
import { clearSeats } from '@/stores/slices/seat.slice'
import EventMoreSection from '@/components/event-detail/EventMoreSection'
import EventRelatedSection from '@/components/event-detail/EventRelatedSection'

function deriveViewerCount(id: string): number {
  const seed = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return 100 + (seed * 37) % 900
}

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { currentEvent, detailLoading, detailError, events } = useAppSelector(
    (state) => state.event
  )

  const handleBack = useCallback(() => navigate(-1), [navigate])

  useEffect(() => {
    if (id) {
      dispatch(fetchEventDetailRequest(id))
    }
  }, [dispatch, id])

  useEffect(() => {
    if (events.length === 0) {
      dispatch(fetchEventsRequest({ limit: 12 }))
    }
  }, [dispatch, events.length])


  useEffect(() => {
    return () => {
      dispatch(clearSeats())
    }
  }, [dispatch])

  const relatedEvents = useMemo(
    () => currentEvent
      ? events.filter(e => e.category === currentEvent.category && e.id !== id).slice(0, 8)
      : [],
    [currentEvent, events, id]
  )

  const moreEvents = useMemo(
    () => events.filter(e => e.id !== id).slice(0, 4),
    [events, id]
  )

  if (detailLoading) return <EventDetailSkeleton />

  if (detailError) return <EventDetailError detailError={detailError} />

  if (!currentEvent) return (
    <div className="min-h-screen bg-[oklch(0.145_0_0)] flex flex-col items-center justify-center gap-4">
      <p className="text-white text-xl font-bold">Không tìm thấy sự kiện</p>
      <Button
        onClick={() => navigate('/events')}
        className="bg-[oklch(0.6_0.2_250)] hover:bg-[oklch(0.54_0.2_250)] text-white rounded-xl"
      >
        Quay lại danh sách
      </Button>
    </div>
  )

  const viewerCount = deriveViewerCount(currentEvent.id)
  const isSoldOut = currentEvent.availableSeats === 0

  return (
    <div className="min-h-screen bg-[oklch(0.145_0_0)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="mb-6 gap-2 text-[oklch(0.55_0_0)] hover:text-white hover:bg-transparent px-0"
          aria-label="Quay lại"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Quay lại
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-4 mb-8">
          <EventInfoPanel
            title={currentEvent.title}
            eventDate={currentEvent.eventDate}
            venue={currentEvent.venue}
            basePrice={String(currentEvent.basePrice)}
            isSoldOut={isSoldOut}
          />
          <HeroGallery
            images={currentEvent.bannerUrl ?? `https://picsum.photos/seed/${currentEvent.id.slice(0, 8)}/800/450`}
            title={currentEvent.title}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 mb-10">
          <div className="space-y-4">
            <EventDescription text={currentEvent.description} />
            <EventSchedule
              eventId={id!}
              eventDate={currentEvent.eventDate}
              basePrice={currentEvent.basePrice}
            />
          </div>
          <aside aria-label="Thông tin thêm" className="lg:sticky lg:top-24 self-start">
            <EventSidebar viewerCount={viewerCount} />
          </aside>
        </div>

        {relatedEvents.length > 0 && (
            <EventRelatedSection category={currentEvent.category} relatedEvents={relatedEvents}/>
        )}

        <div className="mb-10">
          <EventPromoBanner />
        </div>

      <EventMoreSection moreEvents={moreEvents}/>

      </div>
    </div>
  )
}