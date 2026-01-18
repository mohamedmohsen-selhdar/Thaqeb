import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import ProcessSection from "@/components/landing/ProcessSection";
import CapabilitiesSection from "@/components/landing/CapabilitiesSection";
import SupplierCTASection from "@/components/landing/SupplierCTASection";
import CTASection from "@/components/landing/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <ProcessSection />
        <CapabilitiesSection />
        <SupplierCTASection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
