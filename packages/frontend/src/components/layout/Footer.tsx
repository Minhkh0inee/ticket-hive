import { Link } from 'react-router-dom'

const links = {
  Company: ['About Us', 'Careers', 'Press', 'Contact'],
  Support: ['Help Center', 'Terms of Service', 'Privacy Policy', 'Cookie Policy'],
  Discover: ['Browse Events', 'Music', 'Sports', 'Theatre', 'Festivals'],
}

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[oklch(0.6_0.2_250)] flex items-center justify-center">
                <span className="text-white font-bold text-xs">TH</span>
              </div>
              <span className="font-bold text-gray-900">TicketHive</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Your go-to platform for booking tickets to the best events in Vietnam.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-semibold text-gray-900 text-sm mb-3">{title}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <Link
                      to="#"
                      className="text-sm text-gray-500 hover:text-[oklch(0.6_0.2_250)] transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">© 2026 TicketHive. All rights reserved.</p>
          <p className="text-xs text-gray-400">Made with love in Vietnam</p>
        </div>
      </div>
    </footer>
  )
}
