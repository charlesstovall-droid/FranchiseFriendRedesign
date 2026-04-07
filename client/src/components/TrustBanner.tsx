import { motion } from "framer-motion";
import { Award, Shield, TrendingUp, Users, Star, CheckCircle } from "lucide-react";

const affiliations = [
  {
    icon: Shield,
    name: "IFA Member",
    subtitle: "International Franchise Association",
  },
  {
    icon: Award,
    name: "FranChoice",
    subtitle: "National Network",
  },
  {
    icon: TrendingUp,
    name: "Inc. 500",
    subtitle: "Recognized Growth",
  },
  {
    icon: Users,
    name: "100+ Clients",
    subtitle: "Successfully Placed",
  },
  {
    icon: Star,
    name: "10+ Years",
    subtitle: "Industry Experience",
  },
  {
    icon: CheckCircle,
    name: "Charleston",
    subtitle: "Based in SC",
  },
];

export function TrustBanner() {
  return (
    <section className="py-14 bg-gradient-to-r from-primary via-primary/95 to-primary text-primary-foreground border-y border-white/10">
      <div className="container mx-auto px-6 md:px-12 max-w-[1200px]">
        <div className="text-center mb-8">
          <p className="text-secondary uppercase text-xs font-bold tracking-widest mb-2">
            Trusted Expertise
          </p>
          <h3 className="text-2xl font-serif font-bold">
            Backed by Industry Leaders
          </h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {affiliations.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur flex items-center justify-center mb-3 group-hover:bg-secondary/20 transition-all duration-300 group-hover:scale-110">
                <item.icon className="w-8 h-8 text-secondary" />
              </div>
              <h4 className="font-bold text-sm text-white mb-1">{item.name}</h4>
              <p className="text-xs text-primary-foreground/60">{item.subtitle}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}