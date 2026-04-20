import { CategoryEventRow } from '@/components/events/CategoryEventRow';
import { useAppSelector } from '@/hooks/useAppSelector';

const FestivalSection = () => {
  const festival = useAppSelector((state) => state.home.festival);

    if(festival.error){
        return <></>
    }

    if(festival.loading) {
        return <CategoryEventRow title="Lễ hội" events={festival.data} href="/events?category=le-hoi" />
    }
  return (
    <div>FestivalSection</div>
  )
}

export default FestivalSection