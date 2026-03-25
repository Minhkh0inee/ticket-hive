import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, User, Ticket, LogOut } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { mockCategories } from '@/mocks/categories.mock'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { logout } from '@/stores/slices/auth.slice'
import axiosInstance from '@/lib/axios'

export function Header() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const accessToken = useAppSelector((state) => state.auth.accessToken)
  const loading = useAppSelector((state) => state.auth.loading)
  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : ''

  function handleLogout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    delete axiosInstance.defaults.headers.common['Authorization']
    dispatch(logout())
    navigate('/login')
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[oklch(0.6_0.2_250)] flex items-center justify-center">
            <span className="text-white font-bold text-sm">TH</span>
          </div>
          <span className="font-bold text-gray-900 text-lg hidden sm:block">TicketHive</span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events, artists, venues..."
              className="pl-9 h-9 text-sm bg-gray-50 border-gray-200 focus-visible:ring-[oklch(0.6_0.2_250)]"
            />
          </div>
          <Button
            type="submit"
            size="sm"
            className="h-9 bg-[oklch(0.6_0.2_250)] hover:bg-[oklch(0.54_0.2_250)] text-white"
          >
            Search
          </Button>
        </form>

        <nav className="hidden lg:flex items-center gap-1">
          {mockCategories.filter((c) => c.id !== 'all').map((cat) => (
            <Link
              key={cat.id}
              to={`/events?category=${cat.id}`}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-[oklch(0.6_0.2_250)] rounded-md hover:bg-blue-50 transition-colors"
            >
              {cat.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
          {accessToken && loading && !user ? (
            <div className="flex items-center gap-2.5 animate-pulse">
              <div className="size-8 rounded-full bg-gray-200" />
              <div className="hidden sm:block h-4 w-20 rounded bg-gray-200" />
            </div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.6_0.2_250)] focus-visible:ring-offset-2">
                  <Avatar className="size-8 cursor-pointer">
                    <AvatarFallback className="bg-[oklch(0.6_0.2_250)] text-white text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user.firstName}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/my-tickets" className="flex items-center gap-2 cursor-pointer">
                    <Ticket className="w-4 h-4" />
                    My Tickets
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="text-gray-700 hover:text-[oklch(0.6_0.2_250)]">
                <Link to="/login">Login</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="bg-[oklch(0.6_0.2_250)] hover:bg-[oklch(0.54_0.2_250)] text-white"
              >
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
