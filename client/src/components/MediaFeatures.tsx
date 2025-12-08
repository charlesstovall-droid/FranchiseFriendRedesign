import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const mediaFeatures = [
  {
    outlet: "FeedSpot",
    title: "100 Best Franchise Podcasts to Listen to in 2025",
    description: "Your Franchise Friend Podcast recognized among the top franchise podcasts in the industry, featured in FeedSpot's comprehensive ranking.",
    link: "https://podcast.feedspot.com/franchise_podcasts/",
    color: "from-blue-500/10 to-blue-600/5",
  },
  {
    outlet: "FranChoice",
    title: "Charles Stovall - Franchise Consultant",
    description: "Featured franchise consultant profile showcasing expertise in franchise evaluation, multi-unit operations, and franchise scaling strategies.",
    link: "https://www.franchoice.com/our-consultants/charles-stovall/",
    color: "from-red-500/10 to-red-600/5",
  },
  {
    outlet: "LinkedIn",
    title: "Charles Stovall - Franchise Industry Thought Leader",
    description: "Follow Charles Stovall's professional insights on franchise strategy, honest consulting advice, and industry trends shaping franchisee success.",
    link: "https://www.linkedin.com/in/charles-stovall/",
    color: "from-green-500/10 to-green-600/5",
  },
  {
    outlet: "Business.com",
    title: "Best Franchise Podcasts to Listen To",
    description: "Your Franchise Friend Podcast featured among the best franchise podcasts for entrepreneurs seeking education and guidance on franchise ownership.",
    link: "https://www.business.com/articles/best-franchise-podcasts/",
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