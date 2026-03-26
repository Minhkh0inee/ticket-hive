export function EventCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-[oklch(0.19_0_0)] border border-[oklch(0.25_0_0)] animate-pulse">
      <div className="bg-[oklch(0.24_0_0)]" style={{ aspectRatio: '3/2' }} />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-[oklch(0.28_0_0)] rounded w-full" />
        <div className="h-3 bg-[oklch(0.28_0_0)] rounded w-3/4" />
        <div className="h-2.5 bg-[oklch(0.26_0_0)] rounded w-1/2 mt-1" />
        <div className="h-2.5 bg-[oklch(0.26_0_0)] rounded w-2/3" />
      </div>
    </div>
  )
}
