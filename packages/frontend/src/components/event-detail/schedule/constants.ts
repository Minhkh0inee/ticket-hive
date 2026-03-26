import { Crown, Music2, Layers, Users,  } from 'lucide-react'
import type { SeatSection } from '@/types/event.types'
import type { ElementType } from 'react';

export const SECTION_CONFIG: Record<SeatSection, {
  label: string; color: string; bg: string; Icon: ElementType
}> = {
  vip:     { label: 'VIP',       color: 'oklch(0.75 0.18 85)',  bg: 'oklch(0.22 0.04 85)',  Icon: Crown  },
  floor:   { label: 'Sàn',       color: 'oklch(0.6 0.2 250)',   bg: 'oklch(0.2 0.04 250)',  Icon: Music2 },
  balcony: { label: 'Ban công',  color: 'oklch(0.65 0.18 300)', bg: 'oklch(0.2 0.04 300)',  Icon: Layers },
  general: { label: 'Phổ thông', color: 'oklch(0.6 0 0)',       bg: 'oklch(0.22 0 0)',      Icon: Users  },
}