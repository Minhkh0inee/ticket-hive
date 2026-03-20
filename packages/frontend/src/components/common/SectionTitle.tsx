import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface SectionTitleProps {
  title: string
  href?: string
}

export function SectionTitle({ title, href }: SectionTitleProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      {href && (
        <Link
          to={href}
          className="flex items-center gap-0.5 text-sm font-medium text-[oklch(0.6_0.2_250)] hover:underline"
        >
          See all <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  )
}
