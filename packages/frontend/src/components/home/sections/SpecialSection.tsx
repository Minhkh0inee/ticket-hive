import { useAppSelector } from "@/hooks/useAppSelector";
import { CategoryEventRowSkeleton } from "../../events/CategoryEventRowSkeleton";
import { CategoryEventRow } from "../../events/CategoryEventRow";

const SpecialSection = () => {
  const special = useAppSelector((state) => state.home.special);

  if(special.error){
    return <></>
  }

  if (special.loading) {
    return <CategoryEventRowSkeleton title="Sự kiện đặc biệt" />;
  }
  return (
    <CategoryEventRow
      title="Sự kiện đặc biệt"
      events={special.data}
      href="/events?type=special"
    />
  );
};

export default SpecialSection;
