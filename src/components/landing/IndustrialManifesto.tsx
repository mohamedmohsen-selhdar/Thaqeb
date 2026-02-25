import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const IndustrialManifesto = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse",
            },
        });

        tl.fromTo(
            ".manifesto-line",
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out" }
        );
    }, []);

    return (
        <section
            ref={containerRef}
            className="py-32 md:py-64 bg-white text-black bg-noise relative overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-8">
                <div className="grid lg:grid-cols-2 gap-24 items-start">
                    <div className="space-y-12">
                        <div className="manifesto-line">
                            <span className="text-primary font-mono font-bold tracking-widest uppercase text-sm">Our Philosophy</span>
                        </div>
                        <h2 className="manifesto-line text-7xl md:text-9xl font-display font-black leading-[0.85] tracking-tighter">
                            PRECISION IS <br />NOT AN <br />ACCIDENT.
                        </h2>
                    </div>

                    <div className="space-y-16 pt-12 md:pt-32">
                        <div className="manifesto-line flex gap-8 items-start">
                            <span className="text-3xl font-mono text-primary">01</span>
                            <div>
                                <h3 className="text-4xl font-display font-bold mb-4 uppercase italic">Others Guess.</h3>
                                <p className="text-xl text-black/60 max-w-sm">
                                    Traditional fabrication relies on fragmented communication and estimated lead times.
                                </p>
                            </div>
                        </div>

                        <div className="manifesto-line flex gap-8 items-start">
                            <span className="text-3xl font-mono text-primary">02</span>
                            <div>
                                <h3 className="text-4xl font-display font-bold mb-4 uppercase italic">We Engineer.</h3>
                                <p className="text-xl text-black/60 max-w-sm">
                                    Fabrishare synchronizes design data with machine capacity, turning uncertainty into operational certainty.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Industrial Aesthetic Background Element */}
            <div className="absolute top-0 right-[-5%] text-[300px] font-display font-black text-black/5 select-none pointer-events-none rotate-90 leading-none">
                PRECISION
            </div>
        </section>
    );
};

export default IndustrialManifesto;
