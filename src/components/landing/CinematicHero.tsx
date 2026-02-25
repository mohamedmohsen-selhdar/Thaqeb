import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { ArrowRight, Settings, Cpu, Layers, Zap, Hexagon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FloatingSquares } from "./FloatingSquares";

const CinematicHero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const iconsRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const [currentWord, setCurrentWord] = React.useState(0);
    const words = ["FRICTIONLESS", "EFFORTLESS", "LIMITLESS"];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWord((prev) => (prev + 1) % words.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(
            titleRef.current,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, delay: 0.5 }
        )
            .fromTo(
                subtitleRef.current,
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 1 },
                "-=0.8"
            )
            .fromTo(
                ctaRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8 },
                "-=0.6"
            )
            .fromTo(
                iconsRef.current?.children || [],
                { scale: 0, opacity: 0, rotation: -45 },
                { scale: 1, opacity: 1, rotation: 0, duration: 0.8, stagger: 0.1 },
                "-=0.4"
            );

        // Continuous orbiting animation for the icons
        if (iconsRef.current) {
            gsap.to(iconsRef.current.children, {
                y: "random(-15, 15)",
                x: "random(-15, 15)",
                rotation: "random(-10, 10)",
                duration: "random(3, 5)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: 0.2
            });
        }
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative min-h-[90vh] w-full overflow-hidden bg-black flex flex-col items-center justify-center p-4 md:p-8"
        >
            {/* Top-Left Volumetric Light Ray */}
            <div className="absolute top-[-20%] left-[20%] w-[120%] h-[150%] origin-top-left -rotate-45 pointer-events-none z-0 mix-blend-screen opacity-100">
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-transparent blur-3xl"></div>
            </div>

            <FloatingSquares />

            <div className="relative z-10 max-w-5xl text-center flex flex-col items-center pointer-events-none mt-16 w-full">
                {/* Semantic Badge */}
                <div ref={subtitleRef} className="flex items-center gap-2 mb-8 text-zinc-400 font-mono tracking-widest uppercase text-[10px] md:text-xs border border-zinc-800/50 px-4 py-1.5 rounded-full bg-zinc-900/40 backdrop-blur-md">
                    <span>MANUFACTURING NETWORK</span>
                </div>

                <h1
                    ref={titleRef}
                    className="text-5xl md:text-6xl lg:text-7xl font-sans tracking-tight text-white mb-6 leading-tight drop-shadow-xl w-full"
                >
                    Turning blueprints into <br className="hidden md:block" />
                    <span className="relative inline-block w-[6em] h-[1.1em] text-left align-top overflow-hidden">
                        {words.map((word, index) => (
                            <span
                                key={word}
                                className={`absolute left-0 top-0 w-full text-white transition-all duration-700 ease-in-out ${currentWord === index
                                    ? "opacity-100 translate-y-0"
                                    : currentWord < index
                                        ? "opacity-0 translate-y-full"
                                        : "opacity-0 -translate-y-full"
                                    }`}
                            >
                                {word}
                            </span>
                        ))}
                    </span>
                </h1>

                <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed mb-12">
                    Transform designs into high-precision fabricated parts that captivate your customers and fuel business growth.
                </p>

                {/* Central Glowing CTA */}
                <div className="relative pointer-events-auto flex items-center justify-center w-full max-w-[600px] mt-4">

                    {/* Orbiting Icons */}
                    <div ref={iconsRef} className="absolute inset-0 pointer-events-none opacity-20 hidden md:block">
                        <div className="absolute top-[10%] left-[20%] text-foreground/40 bg-surface-elevated p-3 rounded-xl border border-border/50 shadow-industrial backdrop-blur-sm">
                            <Cpu className="w-6 h-6 md:w-8 md:h-8" />
                        </div>
                        <div className="absolute bottom-[20%] left-[10%] text-foreground/40 bg-surface-elevated p-3 rounded-xl border border-border/50 shadow-industrial backdrop-blur-sm">
                            <Layers className="w-6 h-6 md:w-8 md:h-8" />
                        </div>
                        <div className="absolute top-[20%] right-[15%] text-foreground/40 bg-surface-elevated p-3 rounded-xl border border-border/50 shadow-industrial backdrop-blur-sm">
                            <Zap className="w-6 h-6 md:w-8 md:h-8" />
                        </div>
                        <div className="absolute bottom-[25%] right-[15%] text-foreground/40 bg-surface-elevated p-3 rounded-xl border border-border/50 shadow-industrial backdrop-blur-sm">
                            <Hexagon className="w-6 h-6 md:w-8 md:h-8" />
                        </div>
                    </div>

                    <div ref={ctaRef} className="relative z-10 flex flex-col items-center gap-6">
                        <button
                            className="magic-button relative group cursor-pointer"
                            onClick={() => navigate("/get-quote")}
                        >
                            <span className="absolute inset-x-0 -bottom-px h-px w-full bg-gradient-to-r from-transparent via-[hsl(var(--ai-glow))] to-transparent opacity-50"></span>
                            <span className="absolute inset-0 rounded-pill overflow-hidden">
                                <span className="absolute inset-0 rounded-pill bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                            </span>
                            <div className="relative flex items-center justify-center gap-3 space-x-2 rounded-pill bg-[#1f1f1f] px-8 py-4 text-base md:text-lg font-medium text-white z-10 hover:bg-[#2a2a2a] transition-all duration-300">
                                <span className="relative mt-0.5">Upload Part & Get Quote</span>
                            </div>

                        </button>
                    </div>
                </div>
            </div>

            {/* Subtle Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-5 pointer-events-none" />
        </section>
    );
};

export default CinematicHero;
