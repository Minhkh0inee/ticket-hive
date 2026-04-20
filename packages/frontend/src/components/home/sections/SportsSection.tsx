import { CategoryEventRow } from "@/components/events/CategoryEventRow";
import { CategoryEventRowSkeleton } from "@/components/events/CategoryEventRowSkeleton";
import { useAppSelector } from "@/hooks/useAppSelector";

const SportsSection = () => {
  const sports = useAppSelector((state) => state.home.sports);

  if (sports.error) {
    return <></>;
  }

  if (sports.loading) {
    return <CategoryEventRowSkeleton title="Mới nhất" />;
  }

  return (
    <CategoryEventRow
      title="Thể thao"
      events={sports.data}
      href="/events?category=the-thao"
    />
  );
};

export default SportsSection;
