import { motion } from "framer-motion";
import { CheckCircle2, BarChart3, PhoneCall, Rocket } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Take Questionnaire & Map Your Ideal Life",
    description: "Discover your perfect day—your ideal schedule, environment, lifestyle, and impact. This foundation guides every franchise recommendation.",
    icon: BarChart3,
  },
  {
    number: 2,
    title: "Get Personalized Matches",
    description: "Receive 3-5 vetted franchises perfectly aligned with your goals, backed by industry data and proven success metrics.",
    icon: CheckCircle2,
  },
  {
    number: 3,
    title: "Expert Validation Call",
    description: "One-on-one consultation to validate opportunities, discuss funding strategies, and answer all your questions.",
    icon: PhoneCall,
  },
  {
    number: 4,
    title: "Launch Your Business",
    description: "Get ongoing support through due diligence, negotiations, and your first 90 days as a franchisee.",
    icon: Rocket,
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6 md:px-12 max-w-[1200px]">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-secondary uppercase text-sm font-bold tracking-widest mb-3"
          >
            Simple & Proven
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4"
          >
            The Franchise Friend Proven Process
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            From assessment to launch—I guide you through every step with expertise and confidence.
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative grid md:grid-cols-4 gap-6 md:gap-4">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-secondary/50 via-accent-pop/30 to-transparent" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              {/* Step card */}
              <div className="bg-gradient-to-br from-background to-secondary/5 border border-border/50 rounded-xl p-6 relative z-10 h-full hover:border-accent-pop/40 transition-all group">
                {/* Number badge */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center mb-4 text-white font-bold text-lg group-hover:scale-110 transition-transform">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                  <step.icon className="w-6 h-6 text-secondary" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-primary mb-2 leading-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Arrow indicator for mobile */}
              {index < steps.length - 1 && (
                <div className="md:hidden text-center my-4 text-secondary text-2xl">
                  ↓
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-6 text-lg">
            Ready to find your perfect franchise?
          </p>
          <a href="/executive-access" className="inline-block">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold px-8 py-3 rounded-lg transition-all shadow-lg shadow-secondary/20 hover:shadow-xl hover:shadow-secondary/30"
            >
              Take the Free Franchise Fit Score
            </motion.button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}