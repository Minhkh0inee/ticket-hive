import { useState, useMemo, memo } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EventDescriptionProps {
  text: string
}

export const EventDescription = memo(function EventDescription({ text }: EventDescriptionProps) {
  const [expanded, setExpanded] = useState(false)
  const paragraphs = useMemo(() => text.split('\n\n').filter(Boolean), [text])
  const preview = useMemo(() => paragraphs.slice(0, 2), [paragraphs])
  const rest = useMemo(() => paragraphs.slice(2), [paragraphs])

  return (
    <section
      aria-labelledby="desc-heading"
      className="bg-[oklch(0.19_0_0)] border border-[oklch(0.26_0_0)] rounded-2xl p-6"
    >
      <h2
        id="desc-heading"
        className="text-white font-bold text-base mb-4 flex items-center gap-2"
      >
        <span className="w-1 h-5 bg-[oklch(0.6_0.2_250)] rounded-full inline-block" aria-hidden="true" />
        Giới thiệu
      </h2>

      <div className="text-[oklch(0.7_0_0)] text-sm leading-relaxed space-y-3">
        {preview.map((p, i) => <p key={i}>{p}</p>)}
        {expanded && rest.map((p, i) => <p key={`r${i}`}>{p}</p>)}
      </div>

      {rest.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(v => !v)}
          className="mt-4 h-auto p-0 text-[oklch(0.6_0.2_250)] hover:text-[oklch(0.7_0.2_250)] hover:bg-transparent gap-1 font-medium"
          aria-expanded={expanded}
        >
          {expanded ? (
            <>Ẩn bớt <ChevronUp size={15} aria-hidden="true" /></>
          ) : (
            <>Xem thêm <ChevronDown size={15} aria-hidden="true" /></>
          )}
        </Button>
      )}
    </section>
  )
})
