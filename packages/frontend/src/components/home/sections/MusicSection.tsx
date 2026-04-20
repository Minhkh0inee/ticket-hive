import { CategoryEventRow } from "@/components/events/CategoryEventRow";
import { CategoryEventRowSkeleton } from "@/components/events/CategoryEventRowSkeleton";
import { useAppSelector } from "@/hooks/useAppSelector";

const MusicSection = () => {
  const music = useAppSelector((state) => state.home.music);

  if (music.error) {
    return <></>;
  }
  if (music.loading) {
    return <CategoryEventRowSkeleton title="Nhạc sống" />;
  }

  return (
<>
      {music.loading ? (
        <CategoryEventRowSkeleton title="Nhạc sống" />
      ) : (
        <CategoryEventRow
          title="Nhạc sống"
          events={music.data}
          href="/events?category=am-nhac"
        />
      )}
    </>
  );
};

export default MusicSection;
