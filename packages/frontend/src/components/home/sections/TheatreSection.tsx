import { CategoryEventRow } from "@/components/events/CategoryEventRow";
import { CategoryEventRowSkeleton } from "@/components/events/CategoryEventRowSkeleton";
import { useAppSelector } from "@/hooks/useAppSelector";

const TheatreSection = () => {
  const theatre = useAppSelector((state) => state.home.theatre);

  if (theatre.error) {
    return <></>;
  }
  if (theatre.loading) {
    return <CategoryEventRowSkeleton title="Sân khấu & Nghệ thuật" />;
  }

  return (
    <CategoryEventRow
      title="Sân khấu & Nghệ thuật"
      events={theatre.data}
      href="/events?category=kich"
    />
  );
};

export default TheatreSection;
