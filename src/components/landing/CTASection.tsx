import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const CTASection = () => {
  const { t, isRTL } = useLanguage();

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">{t.cta.title}</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">{t.cta.subtitle}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/get-quote">
              <Button variant="hero" size="xl" className="group">
                <Upload className="h-5 w-5" />
                {t.cta.getStarted}
                <ArrowRight className={`h-5 w-5 transition-transform ${isRTL ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline-primary" size="xl">{t.cta.talkToSales}</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
