import { motion } from "framer-motion";
import { ChevronRight, ArrowRight, BookOpen, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { getLatestPosts, formatDate, blogPosts } from "@/data/blog-posts";

export function LatestInsights() {
  const latestPosts = getLatestPosts(7);
  const featuredPost = latestPosts[0];
  const otherPosts = latestPosts.slice(1);

  return (
    <section id="insights" className="py-16 bg-gradient-to-b from-secondary/5 to-background">
      <div className="container mx-auto px-6 md:px-12 max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-pop/10 rounded-full mb-6">
            <BookOpen className="w-4 h-4 text-accent-pop" />
            <span className="text-sm font-semibold text-accent-pop">Franchise Insights & Guides</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            Expert Franchise Knowledge
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            In-depth guides, market analysis, and actionable advice to help Charleston entrepreneurs 
            make informed franchise investment decisions
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-secondary" />
              {blogPosts.length} Expert Articles
            </span>
            <span>•</span>
            <span>Updated Weekly</span>
            <span>•</span>
            <span>Charleston SC Focus</span>
          </div>
        </motion.div>

        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <Link href={`/blog/${featuredPost.slug}`}>
              <div className="relative bg-primary rounded-2xl overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80"></div>
                <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-accent-pop text-primary text-xs font-bold rounded-full uppercase tracking-wide">
                        Featured
                      </span>
                      <span className="px-3 py-1 bg-white/10 text-white/80 text-xs font-semibold rounded-full">
                        {featuredPost.category}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4 group-hover:text-accent-pop transition-colors leading-tight">
                      {featuredPost.title}
                    </h3>
                    <p className="text-white/70 text-base md:text-lg mb-6 max-w-2xl">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-white/50 text-sm">{formatDate(featuredPost.date)}</span>
                      <span className="inline-flex items-center gap-2 text-accent-pop font-semibold group-hover:gap-3 transition-all">
                        Read Full Article
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {otherPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <article className="h-full bg-white border border-border rounded-xl overflow-hidden hover:border-accent-pop/40 hover:shadow-lg transition-all group cursor-pointer">
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-2.5 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full">
                        {post.category}
                      </span>
                      <span className="text-xs text-muted-foreground">{formatDate(post.date)}</span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-primary leading-tight mb-3 group-hover:text-accent-pop transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-end pt-4 border-t border-border">
                      <span 
                        className="inline-flex items-center gap-2 text-secondary hover:text-accent-pop transition-colors font-semibold text-sm group-hover:gap-3"
                        data-testid={`link-insight-${post.slug}`}
                      >
                        Read More
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
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
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8"
              data-testid="button-view-all-insights"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Browse All {blogPosts.length} Articles
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            Covering franchise financing, industry trends, Charleston market insights, and more
          </p>
        </motion.div>
      </div>
    </section>
  );
}
