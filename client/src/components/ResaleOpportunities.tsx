import { motion } from "framer-motion";
import { Handshake, Banknote, ClipboardCheck, ArrowRight, Building2, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ResaleOpportunities() {
  const features = [
    {
      icon: TrendingUp,
      title: "Valuation & Expectations",
      description: "Setting the right price is critical. I bring years of experience to help you understand the true market value of your business and set realistic expectations for the sale."
    },
    {
      icon: Banknote,
      title: "Lender Relationships",
      description: "I connect you with specialized lenders who understand resale acquisitions, helping buyers secure the necessary funding to close the deal."
    },
    {
      icon: ClipboardCheck,
      title: "Professional Representation",
      description: "From due diligence to the final signature, I represent your interests with the professionalism and technical insight required for a successful transition."
    }
  ];

  const currentOpportunities = [
    {
      title: "Established Service Franchise",
      location: "Charleston, SC",
      highlight: "High Retention Rate",
      description: "A well-established service business with a loyal customer base and consistent year-over-year growth."
    },
    {
      title: "Multi-Unit Retail Operation",
      location: "Southeast Region",
      highlight: "SBA Pre-Qualified",
      description: "An excellent opportunity for an owner-operator looking to scale with an existing footprint and trained staff."
    }
  ];

  return (
    <section id="resales" className="py-24 bg-primary/5 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Column: Expert Representation */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                Expert Business Resale Representation
              </h2>
              <p className="text-lg text-muted-foreground mb-12">
                Selling a business is more than just a transaction—it's the culmination of your hard work. 
                I provide the expertise, lender connections, and strategic positioning needed to represent your business effectively to the right buyers.
              </p>

              <div className="space-y-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-primary mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Featured Opportunities */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-xl border border-secondary/10"
            >
              <div className="flex items-center gap-3 mb-8">
                <Building2 className="w-6 h-6 text-secondary" />
                <h3 className="text-2xl font-serif font-bold text-primary">Featured Resale Opportunities</h3>
              </div>

              <div className="space-y-6 mb-8">
                {currentOpportunities.map((opp, index) => (
                  <div key={index} className="p-6 rounded-xl bg-primary/5 border border-primary/10 hover:border-secondary/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-primary">{opp.title}</h4>
                      <span className="text-[10px] uppercase tracking-widest bg-secondary/20 text-secondary px-2 py-1 rounded font-bold">
                        {opp.highlight}
                      </span>
                    </div>
                    <p className="text-xs text-secondary font-semibold mb-3">{opp.location}</p>
                    <p className="text-sm text-muted-foreground">{opp.description}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground italic text-center">
                  Private inquiries only. Contact for a full portfolio of current confidential listings.
                </p>
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold h-12 group">
                  Inquire About Resales
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
