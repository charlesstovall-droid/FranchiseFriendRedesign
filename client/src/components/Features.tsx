import { motion } from "framer-motion";
import { Lightbulb, TrendingUp, Wallet, Search, Compass, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    icon: Compass,
    title: "Strategic Guidance",
    description: "Navigate the complex world of franchise ownership with a personalized roadmap tailored to your goals.",
  },
  {
    icon: Search,
    title: "Franchise Selection",
    description: "We evaluate your position and needs to identify top franchise opportunities that match your vision.",
  },
  {
    icon: Wallet,
    title: "Financial Planning",
    description: "Honest assessments of costs, funding options, and long-term earning potential for your investment.",
  },
  {
    icon: TrendingUp,
    title: "Market Analysis",
    description: "Deep dive into market trends and local opportunities to ensure your business is positioned for growth.",
  },
  {
    icon: Lightbulb,
    title: "Education & Insight",
    description: "Learn the critical dos and don'ts of ownership through our expert consultation and resources.",
  },
  {
    icon: Target,
    title: "Success Coaching",
    description: "From initial research to opening day, we provide the mentorship needed to launch with confidence.",
  },
];

export function Features() {
  return (
    <section id="services" className="py-24 bg-secondary/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
            Expertise for Your Journey
          </h2>
          <p className="text-lg text-muted-foreground">
            We don't just find you a franchise; we build a comprehensive strategy for your future success and financial freedom.
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
              <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow duration-300 bg-background">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-primary" />
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