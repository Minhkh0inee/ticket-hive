import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Ticket, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { SearchBar } from '@/components/layout/SearchBar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { logout } from '@/stores/slices/auth.slice'
import axiosInstance from '@/lib/axios'
import { fetchCategoryRequest } from '@/stores/slices/category.slice'

export function Header() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const accessToken = useAppSelector((state) => state.auth.accessToken)
  const profileLoading = useAppSelector((state) => state.auth.profileLoading)

  const categories = useAppSelector((state) => state.category.categories)
  useEffect(() => {
    dispatch(fetchCategoryRequest())
  }, [dispatch])
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
        <SearchBar />

        <nav className="hidden lg:flex items-center gap-1">
          {categories.filter((c) => c.id !== 'all').map((cat) => (
            <Link key={cat.id} className="px-3 py-1.5 text-sm text-gray-600 hover:text-[oklch(0.6_0.2_250)] rounded-md hover:bg-blue-50 transition-colors" to={`/events?category=${cat.slug}`}>
              {cat.name}
            </Link>
          ))}

        </nav>

        <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
          {accessToken && profileLoading && !user ? (
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
