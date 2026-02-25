import { useState } from "react";
import { Check, ArrowRight, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type CapabilitySection = {
    id: string;
    tabLabel: string;
    titleLight: string;
    titleHighlight: string;
    description: string;
    bulletPoints: string[];
    imageUrl: string;
};

const capabilities: CapabilitySection[] = [
    {
        id: "cnc",
        tabLabel: "CNC Machining",
        titleLight: "High-Precision Parts for ",
        titleHighlight: "Complex Requirements",
        description: "Our CNC machining services offer unparalleled precision for both quick-turn prototypes and high-volume production. Get parts milled or turned in as fast as 1 day.",
        bulletPoints: [
            "Tolerances down to ±0.01mm",
            "Over 40+ metals and plastics available",
            "3-axis, 4-axis, and 5-axis capabilities",
            "Instant DFM feedback on your quotes"
        ],
        imageUrl: "https://images.unsplash.com/photo-1615528001716-1f99cbeab31c?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: "3d",
        tabLabel: "3D Printing",
        titleLight: "Rapid Prototyping and ",
        titleHighlight: "End-Use Production",
        description: "Leverage industrial-grade 3D printing technologies including FDM, SLA, SLS, and DMLS to create complex geometries that are impossible with traditional manufacturing.",
        bulletPoints: [
            "No minimum order quantities (MOQ)",
            "High-performance resins and thermoplastics",
            "Direct Metal Laser Sintering (DMLS) available",
            "Unprecedented speed-to-market"
        ],
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: "sheet",
        tabLabel: "Sheet & Tube Fabrication",
        titleLight: "Durable Enclosures and ",
        titleHighlight: "Structural Frames",
        description: "Sheet metal and tube fabrication services delivering precision-cut, folded, and welded assemblies for everything from electronics enclosures to heavy machinery.",
        bulletPoints: [
            "Laser cutting, waterjet, and plasma cutting",
            "Precision braking and automated folding",
            "TIG, MIG, and robotic welding services",
            "Powder coating and finishing options"
        ],
        imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: "injection",
        tabLabel: "Injection Molding",
        titleLight: "Flexible Tooling Options for ",
        titleHighlight: "Every Stage of Production",
        description: "This industry-leading process delivers high-volume parts with precise, repeatable performance and consistent quality you can rely on for demanding end-use applications.",
        bulletPoints: [
            "Support for any moldable resin with SPI, VDI, and MoldTec finishing options",
            "Full range of tooling solutions, from quick-turn to production-grade",
            "Expert DFM and dedicated program management support included",
            "Includes: plastic molding, insert and overmolding, compression molding, and more"
        ],
        imageUrl: "https://images.unsplash.com/photo-1580983546051-5af5fef2ad90?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: "high-vol",
        tabLabel: "High-Volume Metal Production",
        titleLight: "Scalable Manufacturing for ",
        titleHighlight: "Global Supply Chains",
        description: "Consolidate your supply chain with our high-volume production capabilities. From die casting to mass stamping, we ensure scale without sacrificing quality.",
        bulletPoints: [
            "Economies of scale to lower per-part costs",
            "Die casting, stamping, and automated mass-milling",
            "Rigorous ISO-certified quality assurance",
            "Dedicated account management for large accounts"
        ],
        imageUrl: "https://images.unsplash.com/photo-1565514020179-026b92b2d6da?q=80&w=600&auto=format&fit=crop"
    }
];

const CapabilitiesTabs = () => {
    const [activeTab, setActiveTab] = useState(capabilities[3].id); // Default to Injection Molding like screenshot
    const navigate = useNavigate();

    const activeContent = capabilities.find(c => c.id === activeTab) || capabilities[0];

    return (
        <section className="py-20 bg-[#f8fafc] dark:bg-zinc-950 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
                        Industrial Manufacturing Capabilities
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        From single prototypes to million-part production runs, our certified network delivers quality parts on demand.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Side: Tabs */}
                    <div className="w-full lg:w-1/4 flex flex-col gap-2">
                        <div className="flex gap-2 lg:hidden w-full overflow-x-auto pb-4 scrollbar-hide">
                            {capabilities.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`flex-none px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${activeTab === item.id
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "bg-surface-elevated text-foreground hover:bg-muted"
                                        }`}
                                >
                                    {item.tabLabel}
                                </button>
                            ))}
                        </div>

                        <div className="hidden lg:flex flex-col w-full">
                            {capabilities.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`relative text-left px-6 py-5 text-lg font-medium transition-all duration-300 ${activeTab === item.id
                                        ? "text-foreground bg-white dark:bg-zinc-900 shadow-sm rounded-l-xl border-l-4 border-l-primary font-bold"
                                        : "text-foreground/60 hover:text-foreground hover:bg-white/50 dark:hover:bg-zinc-900/50 rounded-xl"
                                        }`}
                                >
                                    {item.tabLabel}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Content Area */}
                    <div className="w-full lg:w-3/4 bg-white dark:bg-zinc-900 rounded-2xl p-6 md:p-10 shadow-sm border border-border/50">
                        <div className="flex justify-between items-start flex-wrap gap-4 mb-8">
                            <h3 className="text-2xl md:text-3xl font-display font-semibold max-w-lg">
                                <span className="text-foreground">{activeContent.titleLight}</span>
                                <span className="text-muted-foreground">{activeContent.titleHighlight}</span>
                            </h3>
                            <div className="flex flex-wrap items-center gap-3">
                                <Button variant="outline" className="bg-white dark:bg-zinc-900">
                                    Learn More
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-10">
                            <div className="w-full md:w-1/2 space-y-6">
                                <p className="text-foreground/80 leading-relaxed text-lg">
                                    {activeContent.description}
                                </p>
                                <ul className="space-y-4">
                                    {activeContent.bulletPoints.map((point, i) => (
                                        <li key={i} className="flex gap-3">
                                            <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                            <span className="text-foreground/80">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="w-full md:w-1/2">
                                <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-inner bg-muted">
                                    <img
                                        src={activeContent.imageUrl}
                                        alt={activeContent.tabLabel}
                                        className="w-full h-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CapabilitiesTabs;
