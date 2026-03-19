import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Hammer, Briefcase, ChevronRight } from "lucide-react";

type Service = {
  id: string;
  title: string;
  description: string;
};

const OurServices = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = () => {
      try {
        const localData = localStorage.getItem('thaqeb_services');
        if (localData) {
          setServices(JSON.parse(localData));
        }
      } catch (err) {
        console.error("Error fetching local services", err);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 w-full mt-24">
        {/* Header Section */}
        <section className="bg-zinc-950/40 relative border-y border-border/50 py-20 px-6">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="container mx-auto max-w-7xl relative z-10">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Our <span className="text-primary italic">Capabilities</span> & Services
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
              We leverage an extensive network of verified manufacturing workshops to offer an end-to-end suite of production services, ensuring high quality and precise tolerances.
            </p>
          </div>
        </section>

        {/* Dynamic Services List */}
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-7xl">
            {services.length === 0 ? (
              <div className="text-center bg-card border border-border/40 rounded-2xl p-16">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-white mb-2">Check back soon</h3>
                <p className="text-muted-foreground">We are actively updating our service catalog.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service) => (
                  <div key={service.id} className="group relative bg-card border border-border/40 rounded-3xl p-8 hover:border-primary/50 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-glow/20">
                    <div className="absolute top-0 right-0 p-8 opacity-5 filter grayscale group-hover:opacity-10 transition-opacity">
                      <Hammer className="w-32 h-32" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4 line-clamp-2">
                        {service.title}
                      </h3>
                      <p className="text-zinc-400 leading-relaxed line-clamp-4 flex-1">
                        {service.description}
                      </p>
                      
                      {/* Decorative Link Action */}
                      <div className="mt-8 flex items-center gap-2 text-primary font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        View Specifics <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OurServices;
