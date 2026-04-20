import { useEffect } from "react";
import { HeroBanner } from "@/components/home/sections/HeroBanner";

import { CitiesSection } from "@/components/events/CitiesSection";
import { EventPromoBanner } from "@/components/event-detail/EventPromoBanner";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { loadHomePageRequest } from "@/stores/slices/home.slice";
import SpecialSection from "@/components/home/sections/SpecialSection";
import TrendingSection from "@/components/home/sections/TrendingSection";
import LatestSection from "@/components/home/sections/LatestSection";
import MusicSection from "@/components/home/sections/MusicSection";
import TheatreSection from "@/components/home/sections/TheatreSection";
import FestivalSection from "@/components/home/sections/FestivalSection";
import ConferenceSection from "@/components/home/sections/ConferenceSection";
import SportsSection from "@/components/home/sections/SportsSection";

export function HomePage() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(loadHomePageRequest());
  }, [dispatch]);
  return (
    <main className="min-h-screen bg-[oklch(0.145_0_0)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-0">
        <HeroBanner />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        <SpecialSection />
        <TrendingSection />
        <LatestSection />
        <EventPromoBanner />
        <MusicSection />
        <TheatreSection />
        <FestivalSection />
        <ConferenceSection />
        <SportsSection />
        <CitiesSection />
      </div>
    </main>
  );
}
