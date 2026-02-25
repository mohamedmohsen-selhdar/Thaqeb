import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const OurServices = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-24 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-display font-bold text-foreground">Our Services</h1>
                    <p className="text-muted-foreground text-xl">Coming soon...</p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default OurServices;
