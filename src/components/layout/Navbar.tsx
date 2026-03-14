import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Factory, Settings } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { ModeToggle } from "@/components/mode-toggle";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  const navLinks = [
    { label: t.nav.howItWorks, href: "/#process" },
    { label: t.nav.services, href: "/services" },
    { label: t.nav.caseStudies, href: "/case-studies" },
    { label: t.nav.careers, href: "/careers" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-4 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-4 md:px-8`}
    >
      <div
        className={`mx-auto transition-all duration-500 ease-in-out ${scrolled
          ? "max-w-4xl bg-background/80 backdrop-blur-xl border border-border/50 rounded-full py-2 px-6 shadow-lg"
          : "max-w-7xl bg-transparent py-4 px-2"
          }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-pill bg-primary shadow-glow transition-all group-hover:shadow-glow-strong">
              <Settings className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className={`font-display text-xl font-bold transition-colors ${scrolled ? "text-foreground" : "text-white"}`}>
              Tha<span className="text-primary italic">qeb</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors ${isActive(link.href)
                  ? "text-primary"
                  : scrolled ? "text-foreground hover:text-primary" : "text-white/80 hover:text-white"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA/Tools */}
          <div className="hidden md:flex items-center gap-4">
            <ModeToggle />
            <LanguageSwitcher />
            <Link to="/login">
              <span className={`text-sm font-medium transition-colors cursor-pointer ${scrolled ? "text-foreground hover:text-primary" : "text-white/80 hover:text-white"}`}>
                {t.nav.login}
              </span>
            </Link>
            <Link to="/get-quote">
              <Button variant="default" className="shadow-none rounded-full px-6 transition-transform hover:-translate-y-0.5" size="sm">
                {t.nav.getQuote}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-full transition-colors ${scrolled ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10"}`}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 py-6 border-t border-border/10 animate-fade-in bg-background/95 backdrop-blur-2xl rounded-industrial px-6">
            <div className="flex flex-col gap-4">
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full justify-center rounded-full border-border text-foreground hover:bg-surface-hover">
                  {t.nav.login}
                </Button>
              </Link>
              <Link to="/get-quote" onClick={() => setIsOpen(false)}>
                <Button className="w-full justify-center rounded-full">
                  {t.nav.getQuote}
                </Button>
              </Link>
              <div className="flex justify-between items-center px-2">
                <span className="text-sm font-medium text-muted-foreground">Appearance</span>
                <ModeToggle />
              </div>
              <div className="flex justify-between items-center px-2">
                <span className="text-sm font-medium text-muted-foreground">Language</span>
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
