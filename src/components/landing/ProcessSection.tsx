import { Upload, Search, Factory, Truck, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Drawings",
    description: "Submit your CAD files (PDF, DXF, STEP) with specifications",
  },
  {
    icon: Search,
    title: "Get Matched",
    description: "We find the best workshop for your project requirements",
  },
  {
    icon: Factory,
    title: "Production",
    description: "Track real-time progress with quality checkpoints",
  },
  {
    icon: Truck,
    title: "Delivery",
    description: "Receive your parts with full quality documentation",
  },
];

const ProcessSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            How Fabrishare Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From upload to delivery, we manage every step of your manufacturing project
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-16 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative flex flex-col items-center text-center group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Step Number */}
                <div className="absolute -top-2 -right-2 lg:top-0 lg:right-auto lg:-translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground z-10">
                  {index + 1}
                </div>

                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-card border border-border transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-glow">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { value: "48h", label: "Average Quote Time" },
            { value: "95%", label: "On-Time Delivery" },
            { value: "<5%", label: "Rework Rate" },
            { value: "100+", label: "Active Suppliers" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-6 rounded-xl bg-card/50 border border-border">
              <p className="font-display text-3xl font-bold text-primary mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
