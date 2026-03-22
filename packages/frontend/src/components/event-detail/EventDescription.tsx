import { memo } from 'react'

interface EventDescriptionProps {
  text: string
}

export const EventDescription = memo(function EventDescription({ text }: EventDescriptionProps) {
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

      <p className="text-[oklch(0.7_0_0)] text-sm leading-relaxed">
        {text}
      </p>
    </section>
  )
})