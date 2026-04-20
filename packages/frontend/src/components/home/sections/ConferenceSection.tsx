import { CategoryEventRow } from "@/components/events/CategoryEventRow";
import { CategoryEventRowSkeleton } from "@/components/events/CategoryEventRowSkeleton";
import { useAppSelector } from "@/hooks/useAppSelector";

const ConferenceSection = () => {
  const conference = useAppSelector((state) => state.home.conference);

  if (conference.error) {
    return <></>;
  }

  if (conference.loading) {
    return <CategoryEventRowSkeleton title="Hội thảo & Workshop" />;
  }
  return (
    <CategoryEventRow
      title="Hội thảo & Workshop"
      events={conference.data}
      href="/events?category=hoi-nghi"
    />
  );
};

export default ConferenceSection;
