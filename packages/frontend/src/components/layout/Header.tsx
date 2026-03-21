import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { mockCategories } from '@/mocks/categories.mock'
import { useAppSelector } from '@/hooks/useAppSelector'

export function Header() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const accessToken = useAppSelector((state) => state.auth.accessToken)
  const loading = useAppSelector((state) => state.auth.loading)
  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : ''

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
            <div className="flex items-center gap-2.5">
              <Avatar className="size-8">
                <AvatarFallback className="bg-[oklch(0.6_0.2_250)] text-white text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {user.firstName}
              </span>
            </div>
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
