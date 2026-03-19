import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";

const AnimatedNumber = ({ end, suffix = "" }: { end: number, suffix?: string }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const duration = 2500;
        let startTime: number | null = null;
        
        let observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    const step = (timestamp: number) => {
                        if (!startTime) startTime = timestamp;
                        const progress = Math.min((timestamp - startTime) / duration, 1);
                        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                        setCount(Math.floor(easeProgress * end));
                        
                        if (progress < 1) {
                            window.requestAnimationFrame(step);
                        } else {
                            setCount(end);
                        }
                    };
                    window.requestAnimationFrame(step);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [end]);

    return <span ref={ref}>{count}{suffix}</span>;
}

const StatsSection = () => {
    return (
        <section className="py-24 bg-black border-y border-zinc-900 border-opacity-50">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-20 gap-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-sans tracking-tight leading-[1.1]">
                            <span className="text-zinc-600 block mb-2 font-semibold">Numbers that</span>
                            <span className="text-white font-bold">drive success</span>
                        </h2>
                    </div>
                    <Button variant="outline" className="bg-white hover:bg-zinc-100 text-black border-0 rounded-full px-6 whitespace-nowrap hidden md:flex">
                        More about us
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16 lg:px-8">
                    {/* Stat 1 */}
                    <div className="flex flex-col md:border-b-0 border-b border-zinc-800 pb-10 md:pb-0">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]"></div>
                            </div>
                            <span className="text-6xl md:text-7xl lg:text-8xl font-sans font-medium tracking-tighter text-white">
                                <AnimatedNumber end={2500} suffix="+" />
                            </span>
                        </div>
                        <p className="text-xl md:text-2xl text-zinc-400">Parts Fabricated</p>
                    </div>

                    {/* Stat 2 */}
                    <div className="flex flex-col md:border-b-0 border-b border-zinc-800 pb-10 md:pb-0">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-lime-500/10">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#a3e635]"></div>
                            </div>
                            <span className="text-6xl md:text-7xl lg:text-8xl font-sans font-medium tracking-tighter text-white">
                                <AnimatedNumber end={112} suffix="+" />
                            </span>
                        </div>
                        <p className="text-xl md:text-2xl text-zinc-400">Clients Served</p>
                    </div>

                    {/* Stat 3 */}
                    <div className="flex flex-col pb-4 md:pb-0">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]"></div>
                            </div>
                            <span className="text-6xl md:text-7xl lg:text-8xl font-sans font-medium tracking-tighter text-white">
                                <AnimatedNumber end={97} suffix="+" />
                            </span>
                        </div>
                        <p className="text-xl md:text-2xl text-zinc-400">Workshops Network</p>
                    </div>
                </div>

                <div className="mt-8 flex md:hidden justify-center">
                    <Button variant="outline" className="bg-white hover:bg-zinc-100 text-black border-0 rounded-full px-6 w-full">
                        More about us
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
