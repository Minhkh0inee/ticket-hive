import { useAppSelector } from "@/hooks/useAppSelector";
import { CategoryEventRow } from "../../events/CategoryEventRow";
import { CategoryEventRowSkeleton } from "../../events/CategoryEventRowSkeleton";

const LatestSection = () => {
  const latest = useAppSelector((state) => state.home.newEvents);

    if(latest.error){
        return <></>
    }

    if(latest.loading) {
        return <CategoryEventRowSkeleton title="Mới nhất" />
    }

  return (
    <CategoryEventRow title="Mới nhất" events={latest.data} href="/events" />
  );
};

export default LatestSection;
