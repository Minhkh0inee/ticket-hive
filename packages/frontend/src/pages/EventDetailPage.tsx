import { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Calendar,
  MapPin,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Building2,
  Ticket,
  Users,
} from 'lucide-react'
import { mockEvents } from '@/mocks/events.mock'
import { getEventDetail } from '@/mocks/event-detail.mock'
import { EventGridCard } from '@/components/common/EventGridCard'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function fmtPrice(price: string) {
  const n = parseInt(price, 10)
  return n === 0 ? 'Miễn phí' : `${n.toLocaleString('vi-VN')}.000 đ`
}

function fmtBasePrice(price: string) {
  const n = parseInt(price, 10)
  if (n === 0) return 'Miễn phí'
  return `${n.toLocaleString('vi-VN')} đ`
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function HeroGallery({
  images,
  title,
}: {
  images: string[]
  title: string
}) {
  const [img0, img1, img2] = [images[0], images[1], images[2]]

  return (
    <div className="relative rounded-2xl overflow-hidden h-[320px] sm:h-[380px]">
      <div className="grid h-full" style={{ gridTemplateColumns: '2fr 1.4fr 2fr' }}>
        {/* Image 1 */}
        <div className="relative overflow-hidden">
          <img
            src={img0}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>

        {/* Image 2 — middle (slightly narrower) */}
        <div className="relative overflow-hidden border-x border-[oklch(0.12_0_0)]">
          <img
            src={img1 ?? img0}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>

        {/* Image 3 — with event title overlay */}
        <div className="relative overflow-hidden">
          <img
            src={img2 ?? img0}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
            loading="eager"
          />
          {/* Dark gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          {/* Event name overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white font-black text-2xl sm:text-3xl leading-tight uppercase tracking-wide drop-shadow-2xl line-clamp-3">
              {title}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoPanel({
  title,
  eventDate,
  endDate,
  venue,
  venueAddress,
  basePrice,
  isSoldOut,
}: {
  title: string
  eventDate: string
  endDate?: string
  venue: string
  venueAddress?: string
  basePrice: string
  isSoldOut?: boolean
}) {
  const dateText = endDate
    ? `${fmtDate(eventDate)} - ${fmtDate(endDate)}`
    : fmtDate(eventDate)

  const priceNum = parseInt(basePrice, 10)

  return (
    <div className="bg-[oklch(0.19_0_0)] border border-[oklch(0.26_0_0)] rounded-2xl p-6 flex flex-col h-full">
      {/* Title */}
      <h1 className="text-white font-bold text-xl sm:text-2xl leading-snug mb-5">
        {title}
      </h1>

      {/* Date */}
      <div className="flex items-start gap-3 mb-4">
        <Calendar size={18} className="text-[oklch(0.6_0.2_250)] mt-0.5 shrink-0" aria-hidden="true" />
        <time
          dateTime={eventDate}
          className="text-[oklch(0.6_0.2_250)] text-sm font-medium leading-relaxed"
        >
          {dateText}
        </time>
      </div>

      {/* Venue */}
      <div className="flex items-start gap-3 mb-2">
        <MapPin size={18} className="text-[oklch(0.6_0.2_250)] mt-0.5 shrink-0" aria-hidden="true" />
        <div>
          <p className="text-[oklch(0.6_0.2_250)] text-sm font-semibold hover:underline cursor-pointer">
            {venue}
          </p>
          {venueAddress && (
            <p className="text-[oklch(0.6_0_0)] text-xs mt-0.5 leading-relaxed">
              {venueAddress}
            </p>
          )}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Divider */}
      <div className="border-t border-[oklch(0.28_0_0)] my-5" />

      {/* Price */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[oklch(0.75_0_0)] text-sm font-medium">Giá từ</span>
        <span className="text-[oklch(0.6_0.2_250)] text-xl font-bold">
          {priceNum === 0 ? 'Miễn phí' : `${priceNum.toLocaleString('vi-VN')} đ`}
        </span>
        {priceNum > 0 && (
          <ChevronRight size={18} className="text-[oklch(0.6_0.2_250)]" aria-hidden="true" />
        )}
      </div>

      {/* CTA Button */}
      <button
        disabled={isSoldOut}
        className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
          isSoldOut
            ? 'bg-[oklch(0.28_0_0)] text-[oklch(0.5_0_0)] cursor-not-allowed'
            : 'bg-[oklch(0.6_0.2_250)] hover:bg-[oklch(0.54_0.2_250)] active:bg-[oklch(0.5_0.2_250)] text-white'
        }`}
        aria-disabled={isSoldOut}
      >
        {isSoldOut ? 'Vé ngừng bán online' : 'Mua vé ngay'}
      </button>
    </div>
  )
}

function DescriptionSection({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false)
  const paragraphs = text.split('\n\n').filter(Boolean)
  const preview = paragraphs.slice(0, 2)
  const rest = paragraphs.slice(2)

  return (
    <section aria-labelledby="desc-heading" className="bg-[oklch(0.19_0_0)] border border-[oklch(0.26_0_0)] rounded-2xl p-6">
      <h2
        id="desc-heading"
        className="text-white font-bold text-base mb-4 flex items-center gap-2"
      >
        <span className="w-1 h-5 bg-[oklch(0.6_0.2_250)] rounded-full inline-block" aria-hidden="true" />
        Giới thiệu
      </h2>
      <div className="text-[oklch(0.7_0_0)] text-sm leading-relaxed space-y-3">
        {preview.map((p, i) => <p key={i}>{p}</p>)}
        {expanded && rest.map((p, i) => <p key={`r${i}`}>{p}</p>)}
      </div>
      {rest.length > 0 && (
        <button
          onClick={() => setExpanded(v => !v)}
          className="mt-4 flex items-center gap-1 text-[oklch(0.6_0.2_250)] text-sm font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.6_0.2_250)] rounded"
          aria-expanded={expanded}
        >
          {expanded ? (
            <>Ẩn bớt <ChevronUp size={15} aria-hidden="true" /></>
          ) : (
            <>Xem thêm <ChevronDown size={15} aria-hidden="true" /></>
          )}
        </button>
      )}
    </section>
  )
}

function ScheduleSection({
  eventDate,
  endDate,
  ticketTypes,
}: {
  eventDate: string
  endDate?: string
  ticketTypes: { id: string; name: string; price: string; description?: string; available: boolean }[]
}) {
  const dateText = endDate
    ? `${fmtDate(eventDate)} - ${fmtDate(endDate)}`
    : fmtDate(eventDate)

  const hasAvailable = ticketTypes.some(t => t.available)

  return (
    <section aria-labelledby="schedule-heading" className="bg-[oklch(0.19_0_0)] border border-[oklch(0.26_0_0)] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2
          id="schedule-heading"
          className="text-white font-bold text-base flex items-center gap-2"
        >
          <span className="w-1 h-5 bg-[oklch(0.6_0.2_250)] rounded-full inline-block" aria-hidden="true" />
          Lịch diễn
        </h2>
      </div>

      {/* Date row */}
      <div className="flex items-center justify-between flex-wrap gap-3 py-3 border-b border-[oklch(0.26_0_0)]">
        <div className="flex items-center gap-2 text-[oklch(0.65_0_0)] text-sm">
          <Calendar size={14} aria-hidden="true" />
          <time dateTime={eventDate}>{dateText}</time>
        </div>
        <button
          disabled={!hasAvailable}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors duration-150 ${
            hasAvailable
              ? 'bg-[oklch(0.6_0.2_250)] hover:bg-[oklch(0.54_0.2_250)] text-white'
              : 'bg-[oklch(0.28_0_0)] text-[oklch(0.5_0_0)] cursor-not-allowed'
          }`}
          aria-disabled={!hasAvailable}
        >
          {hasAvailable ? 'Mua vé' : 'Vé ngừng bán online'}
        </button>
      </div>

      {/* Ticket types */}
      <div className="mt-4">
        <h3 className="text-[oklch(0.55_0_0)] text-xs font-semibold uppercase tracking-wider mb-3">
          Thông tin vé
        </h3>
        <ul className="space-y-2" role="list">
          {ticketTypes.map(ticket => (
            <li
              key={ticket.id}
              className="flex items-center justify-between gap-3 py-3 border-b border-[oklch(0.23_0_0)] last:border-0"
            >
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{ticket.name}</p>
                {ticket.description && (
                  <p className="text-[oklch(0.5_0_0)] text-xs mt-0.5">{ticket.description}</p>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[oklch(0.6_0.2_250)] text-sm font-semibold whitespace-nowrap">
                  {fmtBasePrice(ticket.price)}
                </span>
                <button
                  disabled={!ticket.available}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors duration-150 ${
                    ticket.available
                      ? 'bg-[oklch(0.75_0.18_350)] hover:bg-[oklch(0.7_0.18_350)] text-white'
                      : 'bg-[oklch(0.28_0_0)] text-[oklch(0.5_0_0)] cursor-not-allowed'
                  }`}
                  aria-disabled={!ticket.available}
                >
                  {ticket.available ? 'Đặt vé' : 'Hết vé'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function OrganizerSection({
  organizer,
}: {
  organizer: { name: string; logoUrl: string | null; description: string }
}) {
  return (
    <section aria-labelledby="organizer-heading" className="bg-[oklch(0.19_0_0)] border border-[oklch(0.26_0_0)] rounded-2xl p-6">
      <h2
        id="organizer-heading"
        className="text-white font-bold text-base mb-4 flex items-center gap-2"
      >
        <span className="w-1 h-5 bg-[oklch(0.6_0.2_250)] rounded-full inline-block" aria-hidden="true" />
        Ban tổ chức
      </h2>
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="w-14 h-14 rounded-xl bg-[oklch(0.25_0_0)] flex items-center justify-center shrink-0 overflow-hidden border border-[oklch(0.3_0_0)]">
          {organizer.logoUrl ? (
            <img
              src={organizer.logoUrl}
              alt={organizer.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <Building2 size={24} className="text-[oklch(0.5_0_0)]" aria-hidden="true" />
          )}
        </div>
        {/* Info */}
        <div className="min-w-0">
          <p className="text-white font-bold text-sm mb-1">{organizer.name}</p>
          <p className="text-[oklch(0.6_0_0)] text-xs leading-relaxed">
            {organizer.description}
          </p>
        </div>
      </div>
    </section>
  )
}

function AdSidebar() {
  return (
    <div className="space-y-4">
      {/* Promo card 1 */}
      <div className="bg-gradient-to-br from-[oklch(0.35_0.15_280)] to-[oklch(0.25_0.12_300)] border border-[oklch(0.4_0.12_280)] rounded-2xl p-5 text-center">
        <p className="text-white/60 text-xs mb-1 uppercase tracking-wider">Độc quyền</p>
        <p className="text-white font-black text-2xl mb-0.5">GIẢM 50%</p>
        <p className="text-[oklch(0.85_0.1_280)] text-xs mb-4">phí dịch vụ khi thanh toán qua thẻ</p>
        <div className="bg-white/10 rounded-xl px-4 py-2 text-white font-bold text-sm">
          TPBank Mastercard
        </div>
      </div>

      {/* Promo card 2 */}
      <div className="bg-[oklch(0.19_0_0)] border border-[oklch(0.26_0_0)] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Ticket size={16} className="text-[oklch(0.6_0.2_250)]" aria-hidden="true" />
          <p className="text-white font-semibold text-sm">Chia sẻ sự kiện</p>
        </div>
        <p className="text-[oklch(0.55_0_0)] text-xs mb-4 leading-relaxed">
          Chia sẻ với bạn bè và nhận thêm ưu đãi hấp dẫn khi mua vé cùng nhau.
        </p>
        <button className="w-full py-2 text-sm font-semibold rounded-xl border border-[oklch(0.6_0.2_250)] text-[oklch(0.6_0.2_250)] hover:bg-[oklch(0.6_0.2_250)] hover:text-white transition-all duration-150">
          Sao chép liên kết
        </button>
      </div>

      {/* Stats card */}
      <div className="bg-[oklch(0.19_0_0)] border border-[oklch(0.26_0_0)] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Users size={16} className="text-[oklch(0.6_0.2_250)]" aria-hidden="true" />
          <p className="text-white font-semibold text-sm">Đang quan tâm</p>
        </div>
        <p className="text-[oklch(0.6_0.2_250)] text-2xl font-black">
          {(Math.floor(Math.random() * 900) + 100).toLocaleString('vi-VN')}
        </p>
        <p className="text-[oklch(0.5_0_0)] text-xs mt-1">người đang theo dõi sự kiện này</p>
      </div>
    </div>
  )
}

function PromoBanner() {
  return (
    <div className="bg-gradient-to-r from-[oklch(0.35_0.18_290)] via-[oklch(0.4_0.2_270)] to-[oklch(0.35_0.18_250)] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <p className="text-white/70 text-xs uppercase tracking-widest mb-1 font-medium">
          Tích điểm đổi thưởng
        </p>
        <p className="text-white font-black text-xl sm:text-2xl">
          Mua vé thả ga — Tích điểm cực đà
        </p>
        <p className="text-white/60 text-sm mt-1">
          Tích 20% điểm thưởng cho mỗi giao dịch mua vé
        </p>
      </div>
      <button className="shrink-0 bg-[oklch(0.9_0.15_100)] hover:bg-[oklch(0.85_0.15_100)] text-[oklch(0.3_0.15_280)] font-bold text-sm px-6 py-3 rounded-xl transition-colors duration-150 whitespace-nowrap">
        Tham gia ngay
      </button>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const event = useMemo(() => mockEvents.find(e => e.id === id), [id])
  const detail = useMemo(() => (id ? getEventDetail(id) : null), [id])

  const relatedEvents = useMemo(
    () =>
      event
        ? mockEvents.filter(e => e.category === event.category && e.id !== id).slice(0, 8)
        : [],
    [event, id]
  )

  const moreEvents = useMemo(
    () => mockEvents.filter(e => e.id !== id).slice(0, 4),
    [id]
  )

  // Not found state
  if (!event || !detail) {
    return (
      <div className="min-h-screen bg-[oklch(0.145_0_0)] flex flex-col items-center justify-center gap-4">
        <p className="text-white text-xl font-bold">Không tìm thấy sự kiện</p>
        <button
          onClick={() => navigate('/events')}
          className="bg-[oklch(0.6_0.2_250)] hover:bg-[oklch(0.54_0.2_250)] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          Quay lại danh sách
        </button>
      </div>
    )
  }

  const isSoldOut = event.availableSeats === 0

  return (
    <div className="min-h-screen bg-[oklch(0.145_0_0)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[oklch(0.55_0_0)] hover:text-white text-sm mb-6 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.6_0.2_250)] rounded"
          aria-label="Quay lại"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Quay lại
        </button>

        {/* ── HERO ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-4 mb-8">
          {/* Left: info panel */}
          <InfoPanel
            title={event.title}
            eventDate={event.eventDate}
            endDate={detail.endDate}
            venue={event.venue}
            venueAddress={detail.venueAddress}
            basePrice={event.basePrice}
            isSoldOut={isSoldOut || detail.isSoldOut}
          />

          {/* Right: image gallery */}
          <HeroGallery images={detail.galleryImages} title={event.title} />
        </div>

        {/* ── CONTENT + SIDEBAR ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 mb-10">
          {/* Main content */}
          <div className="space-y-4">
            <DescriptionSection text={detail.fullDescription} />
            <ScheduleSection
              eventDate={event.eventDate}
              endDate={detail.endDate}
              ticketTypes={detail.ticketTypes}
            />
            <OrganizerSection organizer={detail.organizer} />
          </div>

          {/* Sidebar */}
          <aside aria-label="Thông tin thêm" className="lg:sticky lg:top-24 self-start">
            <AdSidebar />
          </aside>
        </div>

        {/* ── RELATED EVENTS ────────────────────────────────────────── */}
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
              {relatedEvents.map(e => (
                <EventGridCard key={e.id} event={e} />
              ))}
            </div>
          </section>
        )}

        {/* ── PROMO BANNER ──────────────────────────────────────────── */}
        <div className="mb-10">
          <PromoBanner />
        </div>

        {/* ── MORE EVENTS ───────────────────────────────────────────── */}
        <section aria-labelledby="more-heading" className="mb-10">
          <h2 id="more-heading" className="text-white font-bold text-lg mb-5">
            Sự kiện khác
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {moreEvents.map(e => (
              <EventGridCard key={e.id} event={e} />
            ))}
          </div>
          <div className="flex justify-center">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 bg-transparent border border-[oklch(0.6_0.2_250)] text-[oklch(0.6_0.2_250)] hover:bg-[oklch(0.6_0.2_250)] hover:text-white font-semibold text-sm px-8 py-3 rounded-full transition-all duration-150"
            >
              Xem thêm sự kiện
              <ChevronRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}
