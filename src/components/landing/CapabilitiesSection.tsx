import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cog, Layers, Printer, Scissors, Droplets, CircleDot, ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const CapabilitiesSection = () => {
  const { t, isRTL } = useLanguage();

  const capabilities = [
    { icon: Cog, title: t.capabilities.items.cnc.title, description: t.capabilities.items.cnc.description, materials: [t.capabilities.materials.aluminum, t.capabilities.materials.steel, t.capabilities.materials.brass, t.capabilities.materials.plastics] },
    { icon: Layers, title: t.capabilities.items.sheetMetal.title, description: t.capabilities.items.sheetMetal.description, materials: [t.capabilities.materials.steel, t.capabilities.materials.stainless, t.capabilities.materials.aluminum] },
    { icon: Printer, title: t.capabilities.items.printing3d.title, description: t.capabilities.items.printing3d.description, materials: [t.capabilities.materials.pla, t.capabilities.materials.abs, t.capabilities.materials.nylon, t.capabilities.materials.resin] },
    { icon: Scissors, title: t.capabilities.items.wireCutting.title, description: t.capabilities.items.wireCutting.description, materials: [t.capabilities.materials.toolSteel, t.capabilities.materials.carbide, t.capabilities.materials.titanium] },
    { icon: Droplets, title: t.capabilities.items.galvanization.title, description: t.capabilities.items.galvanization.description, materials: [t.capabilities.materials.zinc, t.capabilities.materials.chrome, t.capabilities.materials.nickel] },
    { icon: CircleDot, title: t.capabilities.items.dieCasting.title, description: t.capabilities.items.dieCasting.description, materials: [t.capabilities.materials.aluminum, t.capabilities.materials.zinc, t.capabilities.materials.magnesium] },
  ];

  return (
    <section className="py-24 bg-card/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">{t.capabilities.title}</h2>
            <p className="text-muted-foreground max-w-xl">{t.capabilities.subtitle}</p>
          </div>
          <Link to="/capabilities">
            <Button variant="outline-primary" className="group">
              {t.capabilities.viewAll}
              <ArrowRight className={`h-4 w-4 transition-transform ${isRTL ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((capability) => (
            <div key={capability.title} className="group p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-glow">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 mb-4 transition-colors group-hover:bg-primary/20">
                <capability.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{capability.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{capability.description}</p>
              <div className="flex flex-wrap gap-2">
                {capability.materials.map((material) => (
                  <span key={material} className="px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground">{material}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesSection;
