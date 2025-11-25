import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const mediaFeatures = [
  {
    outlet: "Entrepreneur Magazine",
    title: "Top Franchise Consulting Trends 2025",
    description: "How personalized franchise matching is revolutionizing the industry with data-driven recommendations.",
    link: "https://www.entrepreneur.com/franchises",
    color: "from-blue-500/10 to-blue-600/5",
  },
  {
    outlet: "Forbes Councils",
    title: "The Future of Franchise Ownership",
    description: "Expert perspective on emerging franchise models and success factors for modern entrepreneurs.",
    link: "https://www.forbes.com/councils/forbesfinancecouncil/",
    color: "from-red-500/10 to-red-600/5",
  },
  {
    outlet: "Franchise Business Review",
    title: "2025 Top Franchises Report",
    description: "Curated analysis of highest-satisfaction franchises based on 34,000+ franchisee reviews.",
    link: "https://www.franchisebusinessreview.com/top200",
    color: "from-green-500/10 to-green-600/5",
  },
  {
    outlet: "Franchise Times",
    title: "Inside the Franchise Consulting Business",
    description: "How consultants help franchisees navigate due diligence and minimize risk in their investments.",
    link: "https://www.franchisetimes.com",
    color: "from-purple-500/10 to-purple-600/5",
  },
];

export function MediaFeatures() {
  return (
    <section className="py-20 bg-secondary/5 border-y border-border/30">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-secondary uppercase text-sm font-bold tracking-widest mb-3"
          >
            Featured In
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4"
          >
            Media & Industry Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Insights and expertise recognized by leading franchise industry publications.
          </motion.p>
        </div>

        {/* Media Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {mediaFeatures.map((feature, index) => (
            <motion.a
              key={index}
              href={feature.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ translateY: -5 }}
              className="group"
            >
              <div className={`bg-gradient-to-br ${feature.color} border border-border/50 rounded-xl p-6 h-full hover:border-secondary/30 hover:shadow-xl transition-all cursor-pointer`}>
                <div className="flex items-start justify-between mb-4">
                  <span className="text-sm font-bold text-secondary uppercase tracking-widest">
                    {feature.outlet}
                  </span>
                  <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors" />
                </div>

                <h3 className="text-lg font-bold text-primary mb-2 leading-tight group-hover:text-secondary transition-colors">
                  {feature.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                <div className="mt-4 pt-4 border-t border-border/30 flex items-center text-secondary text-sm font-semibold group-hover:gap-2 transition-all">
                  Read Feature
                  <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}