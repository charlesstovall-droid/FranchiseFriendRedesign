import { motion } from "framer-motion";
import { Lightbulb, TrendingUp, Wallet, Search, Compass, Target, Scale, BarChart3, Shield, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Compass,
    title: "Strategic Guidance",
    description: "I help you navigate the complex world of franchise ownership with a personalized roadmap tailored to your goals.",
  },
  {
    icon: Search,
    title: "Franchise Selection",
    description: "I evaluate your position and needs to identify top franchise opportunities that match your vision.",
  },
  {
    icon: Wallet,
    title: "Financial Planning",
    description: "Get honest assessments of costs, funding options, and long-term earning potential for your investment.",
  },
  {
    icon: TrendingUp,
    title: "Market Analysis",
    description: "I dive deep into market trends and local opportunities to ensure your business is positioned for growth.",
  },
  {
    icon: Lightbulb,
    title: "Education & Insight",
    description: "Learn the critical dos and don'ts of ownership through expert consultation and resources.",
  },
  {
    icon: Target,
    title: "Success Coaching",
    description: "From initial research to opening day, I provide the mentorship you need to launch with confidence.",
  },
];

const expertServices = [
  {
    icon: Scale,
    title: "Expert Witness & Litigation Support",
    description: "Technical advisory for legal counsel involved in franchise disputes. I provide unbiased analysis on Standard of Care, FDD disclosures, and operational negligence.",
    bullets: ["Standard of Care Opinions", "Territory Encroachment", "Earnings Verification"],
    price: "Retainers from $3,500",
    cta: "Inquire for Case Review",
  },
  {
    icon: BarChart3,
    title: "Commercial Due Diligence (PE/M&A)",
    description: "'Boots on the ground' operational auditing for Private Equity. I validate quality of earnings and operational health before you close the deal.",
    bullets: ["Unit-Level Economics Audit", "Franchisee Sentiment Interviews", "Red Flag Stress Testing"],
    price: "Project Min. $5,000",
    cta: "Request Deal Capabilities",
  },
  {
    icon: Shield,
    title: "Strategic Deal Assurance",
    description: "For buyers who need certainty. I act as an independent auditor to verify territory data and site feasibility before you sign an LOI.",
    bullets: ["Site & Lease Feasibility", "SBA Loan Package Optimization", "Off-Market Resale Hunting"],
    price: "Packages start at $1,500",
    cta: "Secure Your Investment",
  },
];

export function Features() {
  return (
    <section id="services" className="py-24 bg-gradient-to-b from-secondary/5 via-background to-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-secondary uppercase text-sm font-bold tracking-widest mb-3">
            Your Franchise Friend™
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
            How Charles Guides You
          </h2>
          <p className="text-lg text-muted-foreground">
            I don't just find you a franchise—I build a comprehensive strategy for your future success and financial freedom.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border border-border/50 shadow-sm hover:shadow-xl hover:border-secondary/30 transition-all duration-300 bg-background/80 backdrop-blur group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary/20 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
                  </div>
                  <CardTitle className="font-serif text-xl text-primary">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Expert Services Section */}
        <div className="mt-20 pt-20 border-t border-secondary/20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-4">
              Expert Professional Services
            </h3>
            <p className="text-lg text-muted-foreground">
              For legal counsel, private equity, and institutional buyers
            </p>
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {expertServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (services.length + index) * 0.1 }}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className="p-8 flex flex-col h-full">
                    <div className="mb-6">
                      <div className="w-14 h-14 bg-secondary/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-7 h-7 text-secondary" />
                      </div>
                    </div>

                    <h4 className="text-xl font-serif font-bold text-primary mb-3">
                      {service.title}
                    </h4>

                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed flex-grow">
                      {service.description}
                    </p>

                    <ul className="space-y-2 mb-8">
                      {service.bullets.map((bullet, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-secondary font-bold mt-1">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mb-6 pt-6 border-t border-secondary/10">
                      <p className="text-sm font-semibold text-primary">
                        {service.price}
                      </p>
                    </div>

                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold group">
                      {service.cta}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}