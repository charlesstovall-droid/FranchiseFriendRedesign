import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { blogPosts, categories, getPostsByCategory, formatDate, type Category } from "@/data/blog-posts";

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  
  const filteredPosts = getPostsByCategory(selectedCategory);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <section className="pt-32 pb-20 bg-gradient-to-r from-primary via-primary/95 to-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">Franchise Insights & Resources</h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Expert articles and guides to help you navigate the franchise ownership journey with confidence.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <h3 className="text-2xl font-bold text-primary mb-6">Filter by Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={selectedCategory === category 
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" 
                    : "border-secondary text-secondary hover:bg-secondary/10"}
                  data-testid={`button-filter-${category.toLowerCase()}`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <div className="h-full bg-white border border-border rounded-xl overflow-hidden hover:border-accent-pop/40 transition-all group shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-primary leading-tight pr-2 group-hover:text-accent-pop transition-colors">
                        {post.title}
                      </h3>
                    </div>
                    
                    <span className="inline-block mb-3 px-2 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded w-fit">
                      {post.category}
                    </span>
                    
                    <p className="text-muted-foreground text-sm mb-4 flex-grow">{post.excerpt}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-xs text-muted-foreground">{formatDate(post.date)}</span>
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-2 text-secondary hover:text-accent-pop transition-colors font-semibold text-sm"
                        data-testid={`link-post-${post.slug}`}
                      >
                        Read More
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground text-lg">No posts found in this category.</p>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
