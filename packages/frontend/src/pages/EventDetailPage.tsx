import { useMemo, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mockEvents } from '@/mocks/events.mock'
import { getEventDetail } from '@/mocks/event-detail.mock'
import { HeroGallery } from '@/components/event-detail/HeroGallery'
import { EventInfoPanel } from '@/components/event-detail/EventInfoPanel'
import { EventDescription } from '@/components/event-detail/EventDescription'
import { EventSchedule } from '@/components/event-detail/EventSchedule'
import { EventOrganizer } from '@/components/event-detail/EventOrganizer'
import { EventSidebar } from '@/components/event-detail/EventSidebar'
import { EventPromoBanner } from '@/components/event-detail/EventPromoBanner'
import { EventGridCard } from '@/components/common/EventGridCard'

/** Deterministic viewer count from event id (avoids Math.random re-render flicker) */
function deriveViewerCount(id: string): number {
  const seed = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return 100 + (seed * 37) % 900
}

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const handleBack = useCallback(() => navigate(-1), [navigate])

  const event = useMemo(() => mockEvents.find(e => e.id === id), [id])
  const detail = useMemo(() => (id ? getEventDetail(id) : null), [id])

  const relatedEvents = useMemo(
    () => event ? mockEvents.filter(e => e.category === event.category && e.id !== id).slice(0, 8) : [],
    [event, id]
  )

  const moreEvents = useMemo(
    () => mockEvents.filter(e => e.id !== id).slice(0, 4),
    [id]
  )

  // ── Not found ──────────────────────────────────────────────────────────────
  if (!event || !detail) {
    return (
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
  }

  const viewerCount = useMemo(() => deriveViewerCount(event.id), [event.id])
  const isSoldOut = event.availableSeats === 0

  return (
    <div className="min-h-screen bg-[oklch(0.145_0_0)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* Back */}
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

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-4 mb-8">
          <EventInfoPanel
            title={event.title}
            eventDate={event.eventDate}
            endDate={detail.endDate}
            venue={event.venue}
            venueAddress={detail.venueAddress}
            basePrice={event.basePrice}
            isSoldOut={isSoldOut || detail.isSoldOut}
          />
          <HeroGallery images={detail.galleryImages} title={event.title} />
        </div>

        {/* ── CONTENT + SIDEBAR ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 mb-10">
          <div className="space-y-4">
            <EventDescription text={detail.fullDescription} />
            <EventSchedule
              eventDate={event.eventDate}
              endDate={detail.endDate}
              ticketTypes={detail.ticketTypes}
            />
            <EventOrganizer organizer={detail.organizer} />
          </div>

          <aside aria-label="Thông tin thêm" className="lg:sticky lg:top-24 self-start">
            <EventSidebar viewerCount={viewerCount} />
          </aside>
        </div>

        {/* ── RELATED EVENTS ───────────────────────────────────────────────── */}
        {relatedEvents.length > 0 && (
          <section aria-labelledby="related-heading" className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 id="related-heading" className="text-white font-bold text-lg">
                Có thể bạn cũng thích
              </h2>
              <Link
                to={`/events?category=${event.category}`}
                className="text-[oklch(0.6_0.2_250)] text-sm hover:underline flex items-center gap-1"
              >
                Xem tất cả <ChevronRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {relatedEvents.map(e => <EventGridCard key={e.id} event={e} />)}
            </div>
          </section>
        )}

        {/* ── PROMO BANNER ─────────────────────────────────────────────────── */}
        <div className="mb-10">
          <EventPromoBanner />
        </div>

        {/* ── MORE EVENTS ──────────────────────────────────────────────────── */}
        <section aria-labelledby="more-heading" className="mb-10">
          <h2 id="more-heading" className="text-white font-bold text-lg mb-5">
            Sự kiện khác
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {moreEvents.map(e => <EventGridCard key={e.id} event={e} />)}
          </div>
          <div className="flex justify-center">
            <Button
              variant="outline"
              asChild
              className="rounded-full border-[oklch(0.6_0.2_250)] text-[oklch(0.6_0.2_250)] hover:bg-[oklch(0.6_0.2_250)] hover:text-white bg-transparent px-8"
            >
              <Link to="/events">
                Xem thêm sự kiện
                <ChevronRight size={16} aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>

      </div>
    </div>
  )
}
