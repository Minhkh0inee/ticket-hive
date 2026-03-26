import { memo } from 'react'
import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'

const CITIES = [
  {
    name: 'TP. Hồ Chí Minh',
    venue: 'Ho Chi Minh City',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&q=80',
  },
  {
    name: 'Hà Nội',
    venue: 'Ha Noi',
    image: 'https://images.unsplash.com/photo-1619546952812-520e98064a52?w=600&q=80',
  },
  {
    name: 'Đà Nẵng',
    venue: 'Da Nang',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80',
  },
  {
    name: 'Vị trí khác',
    venue: '',
    image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80',
  },
] as const

export const CitiesSection = memo(function CitiesSection() {
  return (
    <section aria-labelledby="cities-heading">
      <h2 id="cities-heading" className="text-white font-bold text-lg mb-4">
        Diễn đàn dịch vụ
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {CITIES.map(city => (
          <Link
            key={city.name}
            to={city.venue ? `/events?venue=${encodeURIComponent(city.venue)}` : '/events'}
            className="group relative rounded-xl overflow-hidden block focus:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.6_0.2_250)]"
            style={{ aspectRatio: '4/3' }}
            aria-label={`Sự kiện tại ${city.name}`}
          >
            <img
              src={city.image}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-300"
              loading="lazy"
              width={400}
              height={300}
            />
            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

            {/* Label */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
              <MapPin size={13} className="text-white/80 shrink-0" aria-hidden="true" />
              <span className="text-white font-bold text-sm drop-shadow-md">{city.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
})
