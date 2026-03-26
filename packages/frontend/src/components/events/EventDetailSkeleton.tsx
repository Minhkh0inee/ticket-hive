export default function EventDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[oklch(0.145_0_0)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-pulse">
        {/* Back button skeleton */}
        <div className="h-8 w-20 bg-white/10 rounded mb-6" />

        {/* Hero skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-4 mb-8">
          <div className="h-64 bg-white/10 rounded-xl" />
          <div className="h-64 bg-white/10 rounded-xl" />
        </div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          <div className="space-y-4">
            <div className="h-40 bg-white/10 rounded-xl" />
            <div className="h-32 bg-white/10 rounded-xl" />
            <div className="h-24 bg-white/10 rounded-xl" />
          </div>
          <div className="h-64 bg-white/10 rounded-xl" />
        </div>
      </div>
    </div>
  )
}