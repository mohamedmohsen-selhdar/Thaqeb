import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, Zap, Shield, Clock } from "lucide-react";
import { useState, useEffect } from "react";

const phrases = ["Made Simple", "On Demand", "Done Right", "Made Local"];

const HeroSection = () => {
  const [displayText, setDisplayText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = isDeleting ? 50 : 2000;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentPhrase.length) {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, phraseIndex]);

  return (
    <section className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Now serving Greater Cairo</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-slide-up">
            Manufacturing{" "}
            <span className="text-gradient">{displayText}</span>
            <span className="inline-block w-[3px] h-[0.9em] bg-primary ml-1 animate-pulse align-middle" />
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Upload your drawings, get instant quotes, and connect with Egypt's top certified 
            workshops. From CNC machining to sheet metal, we handle it all.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/get-quote">
              <Button variant="hero" size="xl" className="group">
                <Upload className="h-5 w-5" />
                Upload Drawings
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="outline-primary" size="xl">
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-3 justify-center sm:justify-start group cursor-default">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-elevated border border-border transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:scale-110">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground transition-colors duration-300 group-hover:text-primary">48h Quotes</p>
                <p className="text-xs text-muted-foreground">Fast turnaround</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center group cursor-default">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-elevated border border-border transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:scale-110">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground transition-colors duration-300 group-hover:text-primary">Quality Assured</p>
                <p className="text-xs text-muted-foreground">ISO certified</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-end group cursor-default">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-elevated border border-border transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:scale-110">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground transition-colors duration-300 group-hover:text-primary">100+ Workshops</p>
                <p className="text-xs text-muted-foreground">Verified partners</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
