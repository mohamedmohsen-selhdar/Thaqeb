import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const typewriterPhrases = [
    "founded by engineers.",
    "built for scalability.",
    "obsessed with quality.",
    "engineered for speed."
];

const WavyHighlightSection = () => {
    const [currentPhrase, setCurrentPhrase] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const tick = () => {
            const fullText = typewriterPhrases[currentPhrase];

            if (isDeleting) {
                setDisplayText(fullText.substring(0, displayText.length - 1));
            } else {
                setDisplayText(fullText.substring(0, displayText.length + 1));
            }

            let typeSpeed = isDeleting ? 40 : 80;

            if (!isDeleting && displayText === fullText) {
                typeSpeed = 2500; // Pause at the end
                setIsDeleting(true);
            } else if (isDeleting && displayText === "") {
                setIsDeleting(false);
                setCurrentPhrase((prev) => (prev + 1) % typewriterPhrases.length);
                typeSpeed = 500; // Pause before typing next
            }

            timeout = setTimeout(tick, typeSpeed);
        };

        timeout = setTimeout(tick, 100);
        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, currentPhrase]);

    return (
        <section className="relative w-full py-24 md:py-32 bg-[#0c0c0c] overflow-hidden flex items-center justify-center">
            {/* Wavy Topographic Background using CSS/SVG pattern */}
            <div
                className="absolute inset-0 pointer-events-none opacity-40 z-0"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.392-5.351 2.662-10.05 6.369-13.757C31.26 2.535 36.007 0 41.5 0s10.24 2.535 13.947 6.243c3.707 3.707 5.977 8.406 6.369 13.757H63.84c-.381-4.78-2.316-8.991-5.617-12.293C54.918 4.402 50.317 2.47 45.5 2.47c-4.817 0-9.418 1.932-12.723 5.237-3.301 3.302-5.236 7.513-5.617 12.293h-5.976zM41.5 20c-.392-5.351-2.662-10.05-6.369-13.757C31.424 2.535 26.677 0 21.184 0s-10.24 2.535-13.947 6.243C3.53 9.95 1.26 14.649.868 20H.84c.381-4.78 2.316-8.991 5.617-12.293C9.76 4.402 14.361 2.47 19.178 2.47c4.817 0 9.418 1.932 12.723 5.237 3.301 3.302 5.236 7.513 5.617 12.293H41.5z' fill='%23ffffff' fill-opacity='0.08' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                }}
            />
            {/* Radial gradient mask to fade out the pattern edges */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#0c0c0c_80%)] pointer-events-none z-[1]" />

            <div className="container relative z-10 px-4 md:px-8 max-w-5xl mx-auto flex flex-col justify-center min-h-[40vh]">
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-medium tracking-tight mb-4 leading-[1.2] md:leading-[1.15]">
                    <span className="text-zinc-500">We are an </span>
                    <span className="text-white">advanced manufacturing network,</span>
                </h2>

                <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-medium tracking-tight mb-12 leading-[1.2] md:leading-[1.15] h-[2em] md:h-[1.5em] flex items-center">
                    <span className="text-white border-r-4 border-white pr-2 animate-pulse">{displayText}</span>
                </h2>

                <div className="flex flex-wrap items-center gap-4 mt-8">
                    <Link to="/get-quote">
                        <Button
                            size="lg"
                            className="bg-white text-black hover:bg-zinc-200 px-8 py-6 text-lg rounded-xl font-medium border-0 transition-colors"
                        >
                            Get in touch
                        </Button>
                    </Link>
                    <Link to="/services">
                        <Button
                            size="lg"
                            variant="outline"
                            className="bg-[#2a2a2a]/80 text-white hover:bg-[#333333] border-transparent hover:border-transparent hover:text-white px-8 py-6 text-lg rounded-xl font-medium transition-colors"
                        >
                            More about us
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default WavyHighlightSection;
