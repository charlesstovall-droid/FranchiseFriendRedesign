import { motion } from "framer-motion";
import { Scale, BarChart3, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExpertServices() {
  const services = [
    {
      icon: Scale,
      title: "Expert Witness & Litigation Support",
      description:
        "Technical advisory for legal counsel involved in franchise disputes. I provide unbiased analysis on Standard of Care, FDD disclosures, and operational negligence.",
      bullets: [
        "Standard of Care Opinions",
        "Territory Encroachment",
        "Earnings Verification",
      ],
      price: "Retainers from $3,500",
      cta: "Inquire for Case Review",
      testId: "card-expert-witness",
    },
    {
      icon: BarChart3,
      title: "Commercial Due Diligence (PE/M&A)",
      description:
        "'Boots on the ground' operational auditing for Private Equity. I validate quality of earnings and operational health before you close the deal.",
      bullets: [
        "Unit-Level Economics Audit",
        "Franchisee Sentiment Interviews",
        "Red Flag Stress Testing",
      ],
      price: "Project Min. $5,000",
      cta: "Request Deal Capabilities",
      testId: "card-due-diligence",
    },
    {
      icon: Shield,
      title: "Strategic Deal Assurance",
      description:
        "For buyers who need certainty. I act as an independent auditor to verify territory data and site feasibility before you sign an LOI.",
      bullets: [
        "Site & Lease Feasibility",
        "SBA Loan Package Optimization",
        "Off-Market Resale Hunting",
      ],
      price: "Packages start at $1,500",
      cta: "Secure Your Investment",
      testId: "card-deal-assurance",
    },
  ];

  return (
    <section
      id="services"
      className="py-16 md:py-24 bg-background text-foreground"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            Expert Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional advisory for legal counsel, private equity, and serious
            franchise buyers
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                data-testid={service.testId}
              >
                {/* Card Content */}
                <div className="p-8 flex flex-col h-full">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-14 h-14 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-7 h-7 text-secondary" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-serif font-bold text-primary mb-3">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Bullets */}
                  <ul className="space-y-2 mb-8 flex-grow">
                    {service.bullets.map((bullet, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <span className="text-secondary font-bold mt-1">
                          •
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Price */}
                  <div className="mb-6 pt-6 border-t border-secondary/10">
                    <p className="text-sm font-semibold text-primary">
                      {service.price}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold group"
                    data-testid={`button-${service.testId}`}
                  >
                    {service.cta}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
