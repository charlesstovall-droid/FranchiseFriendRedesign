import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  link: string;
  category?: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "what-does-franchising-mean",
    title: "What Does Franchising Really Mean? Is It the Right Fit for You?",
    excerpt: "Explore the fundamentals of franchising and determine if franchise ownership aligns with your goals and lifestyle.",
    date: "February 12, 2025",
    category: "Franchise Basics",
    link: "/blog/what-does-franchising-mean"
  },
  {
    id: "create-business-plan",
    title: "How to Create a Business Plan",
    excerpt: "Learn the essential steps to create a comprehensive business plan that guides your franchise success.",
    date: "February 12, 2025",
    category: "Planning",
    link: "/blog/create-business-plan"
  },
  {
    id: "navigating-financial-fears",
    title: "Franchising: Navigating Financial Fears with Informed Decision-Making",
    excerpt: "Address common financial concerns and learn how to make confident, informed decisions about franchise investment.",
    date: "February 20, 2024",
    category: "Finance",
    link: "/blog/navigating-financial-fears"
  },
  {
    id: "questions-to-clarity",
    title: "From Questions to Clarity",
    excerpt: "Embarking on the franchise discovery journey often feels like being a detective in a mystery novel. We guide you through the clues.",
    date: "February 20, 2024",
    category: "Discovery",
    link: "/blog/questions-to-clarity"
  },
  {
    id: "franchise-success-guide",
    title: "Mastering Franchise Success: A Comprehensive Guide to Ownership and Growth",
    excerpt: "Comprehensive guide to building a successful franchise business and achieving sustainable growth.",
    date: "June 13, 2023",
    category: "Success",
    link: "/blog/franchise-success-guide"
  },
  {
    id: "overcoming-fear",
    title: "Overcoming Fear and Building Confidence",
    excerpt: "Discover strategies to overcome common fears and build the confidence needed for franchise ownership.",
    date: "April 24, 2023",
    category: "Mindset",
    link: "/blog/overcoming-fear"
  },
  {
    id: "lease-negotiation",
    title: "Strategic Tips for Negotiating a Favorable Commercial Lease",
    excerpt: "Master the art of lease negotiation to secure the best terms for your franchise location.",
    date: "April 10, 2023",
    category: "Operations",
    link: "/blog/lease-negotiation"
  },
  {
    id: "manage-people",
    title: "How to Manage People in Your Franchise Business",
    excerpt: "Essential management principles for building and leading an effective franchise team.",
    date: "April 4, 2023",
    category: "Management",
    link: "/blog/manage-people"
  },
  {
    id: "sba-loan",
    title: "Securing an SBA Loan for Your Franchise",
    excerpt: "Key considerations and timelines for securing SBA financing for your franchise investment.",
    date: "April 4, 2023",
    category: "Finance",
    link: "/blog/sba-loan"
  },
  {
    id: "franchisee-truths",
    title: "5 Truths from an Experienced Franchisee",
    excerpt: "Learn valuable insights from someone who has walked the franchise ownership path before you.",
    date: "March 13, 2023",
    category: "Insights",
    link: "/blog/franchisee-truths"
  },
  {
    id: "franchisor-looking-for",
    title: "What are Franchisors Looking for in Franchisees?",
    excerpt: "Understand the criteria franchisors use when evaluating potential franchisees.",
    date: "March 13, 2023",
    category: "Franchise Basics",
    link: "/blog/franchisor-looking-for"
  },
  {
    id: "signs-not-buy",
    title: "5 Signs You Should Not Buy a Franchise",
    excerpt: "Important warning signs that might indicate franchise ownership isn't the right path for you.",
    date: "March 13, 2023",
    category: "Decision Making",
    link: "/blog/signs-not-buy"
  },
  {
    id: "franchisee-mistakes",
    title: "Top 5 Mistakes a New Franchisee Makes",
    excerpt: "Avoid common pitfalls by learning from mistakes others have made in their franchise journey.",
    date: "March 13, 2023",
    category: "Learning",
    link: "/blog/franchisee-mistakes"
  },
];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = Array.from(new Set(blogPosts.map(post => post.category))).sort();
  const filteredPosts = selectedCategory 
    ? blogPosts.filter(post => post.category === selectedCategory)
    : blogPosts;

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
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <h3 className="text-2xl font-bold text-primary mb-6">Filter by Category</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setSelectedCategory(null)}
                variant={selectedCategory === null ? "default" : "outline"}
                className={selectedCategory === null ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" : "border-secondary text-secondary hover:bg-secondary/10"}
                data-testid="button-filter-all"
              >
                All Posts
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={selectedCategory === category ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" : "border-secondary text-secondary hover:bg-secondary/10"}
                  data-testid={`button-filter-${category}`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Blog Posts Grid */}
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
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className="h-full bg-white border border-border rounded-lg overflow-hidden hover:border-accent-pop/40 transition-all group">
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-primary leading-tight pr-2 group-hover:text-accent-pop transition-colors">{post.title}</h3>
                    </div>
                    
                    {post.category && (
                      <span className="inline-block mb-3 px-2 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded w-fit">
                        {post.category}
                      </span>
                    )}
                    
                    <p className="text-muted-foreground text-sm mb-4 flex-grow">{post.excerpt}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-xs text-muted-foreground">{post.date}</span>
                      <Link 
                        href={post.link}
                        className="inline-flex items-center gap-2 text-secondary hover:text-accent-pop transition-colors font-semibold text-sm"
                        data-testid={`link-post-${post.id}`}
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
