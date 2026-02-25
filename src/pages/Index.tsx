import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CinematicHero from "@/components/landing/CinematicHero";
import CompanyMarquee from "@/components/landing/CompanyMarquee";
import CapabilitiesTabs from "@/components/landing/CapabilitiesTabs";
import StatsSection from "@/components/landing/StatsSection";
import FlipCardSection from "@/components/landing/FlipCardSection";
import WavyHighlightSection from "@/components/landing/WavyHighlightSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-white">
      <Navbar />
      <main>
        <CinematicHero />
        <CompanyMarquee />
        <FlipCardSection />
        <CapabilitiesTabs />
        <WavyHighlightSection />
        <StatsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
