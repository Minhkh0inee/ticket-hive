import { useRef, useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Search, MapPin, Calendar } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { searchEventsRequest, clearSearch } from '@/stores/slices/event.slice'
import { fmtDate, fmtPrice } from '@/lib/format'
import { cn } from '@/lib/utils'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const searchResults = useAppSelector((state) => state.event.searchResults)
  const searchLoading = useAppSelector((state) => state.event.searchLoading)

  useEffect(() => {
    dispatch(clearSearch());
  }, [location.pathname, dispatch]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleChange = useCallback((value: string) => {
    setQuery(value)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!value.trim()) {
      dispatch(clearSearch())
      setOpen(false)
      return
    }

    if (value.trim().length < 2) return

    setOpen(true)
    debounceRef.current = setTimeout(() => {
      dispatch(searchEventsRequest(value.trim()))
    }, 350)
  }, [dispatch])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    dispatch(clearSearch())
    setOpen(false)
    navigate(`/events?search=${encodeURIComponent(query.trim())}`)
    setQuery('')
  }

  function handleResultClick(eventId: string) {
    dispatch(clearSearch())
    setOpen(false)
    setQuery('')
    navigate(`/events/${eventId}`)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const results = Array.isArray(searchResults) ? searchResults : []
  const showDropdown = open && query.trim().length >= 2
  const hasResults = results.length > 0
  const displayResults = results.slice(0, 6)

  return (
    <div ref={wrapperRef} className="flex-1 flex items-center gap-2 max-w-md relative">
      <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (query.trim().length >= 2) setOpen(true) }}
            placeholder="Search events, artists, venues..."
            className="pl-9 h-9 text-sm bg-gray-50 border-gray-200 focus-visible:ring-[oklch(0.6_0.2_250)]"
            autoComplete="off"
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

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-10 mt-1.5 bg-white rounded-xl border border-gray-100 shadow-lg z-50 overflow-hidden">
          {searchLoading ? (
            <div className="p-2 space-y-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg animate-pulse">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                    <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : hasResults ? (
            <ul className="p-2 space-y-0.5">
              {displayResults.map((event) => (
                <li key={event.id}>
                  <button
                    type="button"
                    onClick={() => handleResultClick(event.id)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    {/* Thumbnail */}
                    {event.bannerUrl ? (
                      <img
                        src={event.bannerUrl}
                        alt={event.title}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-[oklch(0.92_0.05_250)] flex items-center justify-center flex-shrink-0">
                        <Search className="w-4 h-4 text-[oklch(0.6_0.2_250)]" />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'text-sm font-medium text-gray-900 truncate',
                      )}>
                        {event.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1 text-xs text-gray-400 truncate">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          {event.venue}
                        </span>
                        <span className="text-gray-200">·</span>
                        <span className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          {fmtDate(event.eventDate)}
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <span className="text-xs font-semibold text-[oklch(0.6_0.2_250)] whitespace-nowrap flex-shrink-0">
                      {fmtPrice(String(event.basePrice))}
                    </span>
                  </button>
                </li>
              ))}

              {results.length > 6 && (
                <li>
                  <button
                    type="button"
                    onClick={handleSubmit as unknown as React.MouseEventHandler}
                    className="w-full text-center text-xs text-[oklch(0.6_0.2_250)] py-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    See all {results.length} results →
                  </button>
                </li>
              )}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-gray-400">
              No results for «{query}»
            </div>
          )}
        </div>
      )}
    </div>
  )
}
