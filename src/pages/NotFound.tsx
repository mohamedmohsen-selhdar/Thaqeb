import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Factory, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[80px] animate-pulse-slow" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 text-center max-w-md">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary shadow-glow transition-all duration-300 group-hover:shadow-glow-strong group-hover:scale-105">
            <Factory className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl font-bold text-foreground">
            Fabri<span className="text-primary">share</span>
          </span>
        </Link>

        {/* 404 Title */}
        <div className="mb-6">
          <h1 className="font-display text-8xl font-bold text-gradient mb-4 animate-fade-in">404</h1>
          <h2 className="font-display text-2xl font-semibold text-foreground mb-2 animate-slide-up">
            Page Not Found
          </h2>
          <p className="text-muted-foreground animate-slide-up" style={{ animationDelay: "0.1s" }}>
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <Link to="/">
            <Button variant="hero" size="lg" className="group w-full sm:w-auto">
              <Home className="h-4 w-4 transition-transform group-hover:scale-110" />
              Go Home
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => window.history.back()}
            className="group transition-all duration-300 hover:border-primary/50 hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Go Back
          </Button>
        </div>

        {/* Suggested Links */}
        <div className="mt-12 pt-8 border-t border-border animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <p className="text-sm text-muted-foreground mb-4">Or try one of these:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { to: "/get-quote", label: "Get Quote" },
              { to: "/login", label: "Sign In" },
              { to: "/register", label: "Register" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 rounded-lg bg-muted text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-surface-elevated hover:text-foreground hover:scale-105"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
