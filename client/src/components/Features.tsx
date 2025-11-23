import { motion } from "framer-motion";
import { Lightbulb, TrendingUp, Wallet, Search, Compass, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      </div>
    </section>
  );
}