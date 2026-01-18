import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Cog, 
  Layers, 
  Printer, 
  Scissors, 
  Droplets, 
  CircleDot,
  ArrowRight 
} from "lucide-react";

const capabilities = [
  {
    icon: Cog,
    title: "CNC Machining",
    description: "Precision milling and turning for complex parts with tight tolerances",
    materials: ["Aluminum", "Steel", "Brass", "Plastics"],
  },
  {
    icon: Layers,
    title: "Sheet Metal",
    description: "Cutting, bending, and welding for enclosures and structural components",
    materials: ["Steel", "Stainless", "Aluminum"],
  },
  {
    icon: Printer,
    title: "3D Printing",
    description: "Rapid prototyping and production parts in various materials",
    materials: ["PLA", "ABS", "Nylon", "Resin"],
  },
  {
    icon: Scissors,
    title: "Wire Cutting",
    description: "EDM wire cutting for intricate shapes and hardened materials",
    materials: ["Tool Steel", "Carbide", "Titanium"],
  },
  {
    icon: Droplets,
    title: "Galvanization",
    description: "Surface treatment and coating for corrosion protection",
    materials: ["Zinc", "Chrome", "Nickel"],
  },
  {
    icon: CircleDot,
    title: "Die Casting",
    description: "High-volume production of complex metal components",
    materials: ["Aluminum", "Zinc", "Magnesium"],
  },
];

const CapabilitiesSection = () => {
  return (
    <section className="py-24 bg-card/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Manufacturing Capabilities
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Access a wide range of fabrication processes through our network of certified workshops
            </p>
          </div>
          <Link to="/capabilities">
            <Button variant="outline-primary" className="group">
              View All Capabilities
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((capability, index) => (
            <div
              key={capability.title}
              className="group p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-glow"
            >
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 mb-4 transition-colors group-hover:bg-primary/20">
                <capability.icon className="h-6 w-6 text-primary" />
              </div>

              {/* Content */}
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {capability.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {capability.description}
              </p>

              {/* Materials */}
              <div className="flex flex-wrap gap-2">
                {capability.materials.map((material) => (
                  <span
                    key={material}
                    className="px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground"
                  >
                    {material}
                  </span>
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
