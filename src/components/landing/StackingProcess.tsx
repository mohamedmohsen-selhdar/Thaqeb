import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const panels = [
    {
        title: "1. DESIGN",
        description: "Upload your CAD files. Our system analyzes geometric complexity and material viability instantly.",
        bg: "bg-black",
        icon: "01"
    },
    {
        title: "2. MATCH",
        description: "AI-driven capacity routing connects your part with the exact machine required for perfect precision.",
        bg: "bg-zinc-950",
        icon: "02"
    },
    {
        title: "3. FABRICATE",
        description: "Real-time production tracking. From the first cut to final delivery, visibility is engineered into the process.",
        bg: "bg-zinc-900",
        icon: "03"
    }
];

const StackingProcess = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const panelsElements = gsap.utils.toArray(".process-panel");

        panelsElements.forEach((panel: any, i) => {
            ScrollTrigger.create({
                trigger: panel,
                start: "top top",
                pin: true,
                pinSpacing: false,
                snap: 1,
                scrub: true,
            });

            // Scale compression effect for previous panel
            if (i > 0) {
                gsap.to(panelsElements[i - 1] as HTMLElement, {
                    scrollTrigger: {
                        trigger: panel,
                        start: "top bottom",
                        end: "top top",
                        scrub: true,
                    },
                    scale: 0.95,
                    opacity: 0.5,
                    filter: "blur(10px)",
                });
            }
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <div ref={containerRef} className="relative">
            {panels.map((panel, i) => (
                <section
                    key={i}
                    className="process-panel h-screen w-full flex items-center justify-center p-8 md:p-24 sticky top-0 bg-noise"
                    style={{ backgroundColor: panel.bg }}
                >
                    <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <span className="text-primary font-mono text-xl">{panel.icon} —</span>
                            <h2 className="text-6xl md:text-8xl font-display font-bold text-white tracking-tighter">
                                {panel.title}
                            </h2>
                            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-md">
                                {panel.description}
                            </p>
                        </div>
                        <div className="hidden md:flex justify-end">
                            <div className="w-96 h-96 border border-white/10 rounded-industrial flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                                <div className="text-[200px] font-display font-black text-white/5 select-none transition-transform group-hover:scale-110 duration-1000">
                                    {panel.icon}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ))}
        </div>
    );
};

export default StackingProcess;
