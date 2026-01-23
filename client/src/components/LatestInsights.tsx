import { motion } from "framer-motion";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { getLatestPosts, formatDate } from "@/data/blog-posts";

export function LatestInsights() {
  const latestPosts = getLatestPosts(3);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            Latest Insights
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay informed with the latest franchise trends, tips, and guidance
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {latestPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="h-full bg-white border border-border rounded-xl overflow-hidden hover:border-accent-pop/40 transition-all group shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="p-6 flex flex-col h-full">
                  <span className="inline-block mb-3 px-2 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded w-fit">
                    {post.category}
                  </span>
                  
                  <h3 className="text-lg font-bold text-primary leading-tight mb-3 group-hover:text-accent-pop transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4 flex-grow">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground">{formatDate(post.date)}</span>
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-secondary hover:text-accent-pop transition-colors font-semibold text-sm"
                      data-testid={`link-insight-${post.slug}`}
                    >
                      Read More
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/blog">
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold"
              data-testid="button-view-all-insights"
            >
              View All Insights
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
