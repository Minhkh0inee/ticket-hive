import { useAppSelector } from "@/hooks/useAppSelector";
import { CategoryEventRowSkeleton } from "../../events/CategoryEventRowSkeleton";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { TrendingCard } from "../../events/TrendingCard";

const TrendingSection = () => {
  const trending = useAppSelector((state) => state.home.trending);

  if (trending.error) {
    return <></>;
  }

  if (trending.loading) {
    return <CategoryEventRowSkeleton title="Thịnh hành" count={4} />;
  }
  return (
    <section aria-labelledby="trending-heading">
      <div className="flex items-center justify-between mb-4">
        <h2 id="trending-heading" className="text-white font-bold text-lg">
          Sự kiện xu hướng
        </h2>
        <Link
          to="/events?type=trending"
          className="text-[oklch(0.6_0.2_250)] text-sm hover:underline flex items-center gap-0.5 shrink-0"
        >
          Xem thêm <ChevronRight size={14} aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {trending.data.map((event, index) => (
          <TrendingCard key={event.id} event={event} rank={index + 1} />
        ))}
      </div>
    </section>
  );
};



export default TrendingSection;
