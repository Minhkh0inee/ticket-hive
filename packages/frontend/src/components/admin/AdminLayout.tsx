import { useEffect } from 'react'
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import { LayoutGrid, Ticket, Users, CreditCard, ArrowLeft, LogOut } from 'lucide-react'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { logout } from '@/stores/slices/auth.slice'
import { fetchCategoryRequest } from '@/stores/slices/category.slice'

export function AdminLayout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((s) => s.auth.user)

  useEffect(() => {
    dispatch(fetchCategoryRequest())
  }, [dispatch])

  function handleLogout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    dispatch(logout())
    navigate('/login')
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-[oklch(0.6_0.2_250/0.15)] text-[oklch(0.7_0.2_250)]'
        : 'text-[oklch(0.55_0_0)] hover:text-white hover:bg-white/5'
    }`

  return (
    <div className="flex h-screen bg-[oklch(0.13_0_0)] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-[oklch(0.1_0_0)] border-r border-[oklch(0.2_0_0)] flex flex-col">
        {/* Branding */}
        <div className="px-5 py-5 border-b border-[oklch(0.2_0_0)]">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: 'oklch(0.6 0.2 250)' }}
            >
              TH
            </div>
            <div>
              <p className="font-semibold text-sm leading-tight">TicketHive</p>
              <p className="text-[10px] text-[oklch(0.5_0_0)] uppercase tracking-wider">
                Admin
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink to="/admin/events" className={navLinkClass}>
            <LayoutGrid className="w-4 h-4 flex-shrink-0" />
            Events
          </NavLink>
          <NavLink to="/admin/bookings" className={navLinkClass}>
            <Ticket className="w-4 h-4 flex-shrink-0" />
            Bookings
          </NavLink>
          <NavLink to="/admin/users" className={navLinkClass}>
            <Users className="w-4 h-4 flex-shrink-0" />
            Users
          </NavLink>
          <NavLink to="/admin/payments" className={navLinkClass}>
            <CreditCard className="w-4 h-4 flex-shrink-0" />
            Payments
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-[oklch(0.2_0_0)] space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[oklch(0.55_0_0)] hover:text-white hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 flex-shrink-0" />
            Back to site
          </Link>

          <div className="px-3 py-2">
            <p className="text-xs text-[oklch(0.45_0_0)] truncate">
              {user?.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[oklch(0.55_0_0)] hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}
