import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Factory, TrendingUp, Calendar, Award, ArrowRight } from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    description: "Access new customers without marketing spend",
  },
  {
    icon: Calendar,
    title: "Fill Idle Capacity",
    description: "Get matched to jobs that fit your schedule",
  },
  {
    icon: Award,
    title: "Build Your Reputation",
    description: "Earn ratings and showcase your capabilities",
  },
];

const SupplierCTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-card to-card" />
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
          
          {/* Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />

          <div className="relative z-10 p-8 md:p-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6">
                  <Factory className="h-4 w-4" />
                  For Workshops & Factories
                </div>

                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Join Egypt's Largest Manufacturing Network
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Partner with Fabrishare to receive qualified orders matched to your capabilities. 
                  We handle customer acquisition, project management, and quality assurance—you focus on what you do best.
                </p>

                <Link to="/for-suppliers">
                  <Button variant="hero" size="lg" className="group">
                    Become a Partner
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>

              {/* Benefits */}
              <div className="space-y-6">
                {benefits.map((benefit) => (
                  <div
                    key={benefit.title}
                    className="flex gap-4 p-4 rounded-xl bg-card/50 border border-border"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {benefit.description}
                      </p>
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
