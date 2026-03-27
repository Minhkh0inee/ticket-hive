export interface Category {
  id: string
  label: string
  icon: string
}

export const mockCategories: Category[] = [
  { id: 'all', label: 'All Events', icon: '🎫' },
  { id: 'music', label: 'Music', icon: '🎵' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'theatre', label: 'Theatre', icon: '🎭' },
  { id: 'festival', label: 'Festival', icon: '🎪' },
  { id: 'conference', label: 'Conference', icon: '💼' },
]
