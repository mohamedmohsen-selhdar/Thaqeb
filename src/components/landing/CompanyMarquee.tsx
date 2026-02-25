import React from "react";

const companies = [
    "Egypt Gold", "TRONIX", "SAWA Parking", "SYNERGY",
    "Egypt Gold", "TRONIX", "SAWA Parking", "SYNERGY"
];

const CompanyMarquee = () => {
    return (
        <section className="py-20 bg-background border-b border-border overflow-hidden relative">
            <div className="container mx-auto px-4 mb-8 text-center">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                    Trusted by Industry Leaders
                </p>
            </div>

            {/* Marquee Container */}
            <div className="flex w-[200%] md:w-[150%] animate-[marquee_20s_linear_infinite]">
                <div className="flex w-1/2 items-center justify-around translate-x-0">
                    {companies.slice(0, 4).map((company, index) => (
                        <div key={`company-1-${index}`} className="flex items-center justify-center h-16 px-12 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                            <span className="font-display font-black text-2xl tracking-tighter text-foreground">{company}</span>
                        </div>
                    ))}
                </div>
                <div className="flex w-1/2 items-center justify-around translate-x-0">
                    {companies.slice(4).map((company, index) => (
                        <div key={`company-2-${index}`} className="flex items-center justify-center h-16 px-12 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                            <span className="font-display font-black text-2xl tracking-tighter text-foreground">{company}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Fade edges */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
        </section>
    );
};

export default CompanyMarquee;
