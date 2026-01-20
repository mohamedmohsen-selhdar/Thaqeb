import { Link } from "react-router-dom";
import { Factory, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  const services = [
    { label: t.capabilities.items.cnc.title, path: "/capabilities" },
    { label: t.capabilities.items.sheetMetal.title, path: "/capabilities" },
    { label: t.capabilities.items.printing3d.title, path: "/capabilities" },
    { label: t.capabilities.items.wireCutting.title, path: "/capabilities" },
    { label: t.capabilities.items.dieCasting.title, path: "/capabilities" },
  ];

  const companyLinks = [
    { label: t.footer.aboutUs, path: "/about" },
    { label: t.nav.forSuppliers, path: "/for-suppliers" },
    { label: t.footer.qualityAssurance, path: "/quality" },
    { label: t.footer.careers, path: "/careers" },
  ];

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-glow">
                <Factory className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-foreground">
                Fabri<span className="text-primary">share</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t.footer.tagline}
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">{t.footer.services}</h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.label}>
                  <Link to={service.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">{t.footer.company}</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">{t.footer.contact}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{t.footer.location}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span dir="ltr">+20 123 456 7890</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@fabrishare.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Fabrishare. {t.footer.allRightsReserved}
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t.footer.privacyPolicy}
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t.footer.termsOfService}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
