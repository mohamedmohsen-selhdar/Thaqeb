import { ShieldCheck, Truck, BarChart3, Clock } from "lucide-react";

const advantages = [
    {
        id: "quality",
        icon: ShieldCheck,
        title: "ISO-Certified Quality",
        description: "Every part is meticulously inspected against strict ISO 9001 standards. We guarantee precision, material authenticity, and reliable performance out of the box."
    },
    {
        id: "delivery",
        icon: Truck,
        title: "Last-Mile Delivery",
        description: "We handle all logistics so you don't have to. Enjoy seamless door-to-door delivery with expedited shipping options ensuring your production lines never halt."
    },
    {
        id: "metrology",
        icon: BarChart3,
        title: "Metrology Analysis",
        description: "Advanced CMM inspections and first-article reports provided upon request. We verify tolerances down to the micron before any part leaves the partner facility."
    },
    {
        id: "speed",
        icon: Clock,
        title: "Unmatched Speed",
        description: "AI-driven quoting in seconds and capacity matching in hours. We eliminate weeks of sourcing friction to deliver your crucial components up to 3x faster."
    }
];

const FlipCardSection = () => {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
                        The Thaqeb Edge
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Beyond just matching you with a CNC machine, we embed quality assurance, logistics, and speed directly into your supply chain.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {advantages.map((adv) => (
                        <div key={adv.id} className="group perspective-1000 h-[300px] w-full cursor-pointer">
                            {/* Card Container - Preserves 3D space */}
                            <div className="relative w-full h-full transition-transform duration-700 preserve-3d group-hover:rotate-y-180">

                                {/* Front of Card */}
                                <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 bg-surface-elevated border border-border rounded-2xl shadow-sm">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                                        <adv.icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-display font-semibold text-foreground text-center">
                                        {adv.title}
                                    </h3>
                                    <div className="mt-8 text-primary font-medium text-sm flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        Hover to reveal
                                    </div>
                                </div>

                                {/* Back of Card */}
                                <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col justify-center p-8 bg-zinc-900 border border-zinc-800 text-white rounded-2xl shadow-xl">
                                    <adv.icon className="w-8 h-8 text-white/50 mb-4" />
                                    <h3 className="text-xl font-display font-bold mb-3">
                                        {adv.title}
                                    </h3>
                                    <p className="text-zinc-400 leading-relaxed text-sm">
                                        {adv.description}
                                    </p>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FlipCardSection;
