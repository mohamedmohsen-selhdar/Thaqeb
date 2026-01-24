import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Factory, TrendingUp, Calendar, Award, ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const SupplierCTASection = () => {
  const { t, isRTL } = useLanguage();

  const benefits = [
    { icon: TrendingUp, title: t.supplierCta.benefits.grow.title, description: t.supplierCta.benefits.grow.description },
    { icon: Calendar, title: t.supplierCta.benefits.capacity.title, description: t.supplierCta.benefits.capacity.description },
    { icon: Award, title: t.supplierCta.benefits.reputation.title, description: t.supplierCta.benefits.reputation.description },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-card to-card" />
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />

          <div className="relative z-10 p-8 md:p-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6 hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 cursor-default">
                  <Factory className="h-4 w-4" />
                  {t.supplierCta.badge}
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">{t.supplierCta.title}</h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">{t.supplierCta.subtitle}</p>
                <Link to="/register?role=supplier">
                  <Button variant="hero" size="lg" className="group hover:shadow-glow-strong transition-all duration-300 hover:-translate-y-0.5">
                    {t.supplierCta.cta}
                    <ArrowRight className={`h-4 w-4 transition-transform ${isRTL ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
                  </Button>
                </Link>
              </div>

              <div className="space-y-6">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="flex gap-4 p-4 rounded-xl bg-card/50 border border-border transition-all duration-300 hover:border-primary/30 hover:shadow-glow hover:-translate-y-1 cursor-default group">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                      <benefit.icon className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground mb-1 transition-colors duration-300 group-hover:text-primary">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupplierCTASection;
