export function HeroBannerSkeleton() {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-[320px] rounded-xl bg-[oklch(0.24_0_0)] animate-pulse" />
        <div className="h-[320px] rounded-xl bg-[oklch(0.24_0_0)] animate-pulse hidden md:block" />
      </div>
      <div className="flex justify-center gap-1.5 mt-4">
        <div className="w-6 h-1.5 rounded-full bg-[oklch(0.32_0_0)] animate-pulse" />
        <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.28_0_0)] animate-pulse" />
        <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.28_0_0)] animate-pulse" />
      </div>
    </div>
  )
}
