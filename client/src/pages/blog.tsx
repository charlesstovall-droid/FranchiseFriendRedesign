import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

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
    id: 1,
    title: "What Does Franchising Really Mean? Is It the Right Fit for You?",
    excerpt: "Explore the fundamentals of franchising and determine if franchise ownership aligns with your goals and lifestyle.",
    date: "February 12, 2025",
    category: "Franchise Basics",
    link: "https://www.franchisefriend.net/blog/what-does-franchising-really-mean-is-it-the-right-fit-for-you"
  },
  {
    id: 2,
    title: "How to Create a Business Plan",
    excerpt: "Learn the essential steps to create a comprehensive business plan that guides your franchise success.",
    date: "February 12, 2025",
    category: "Planning",
    link: "https://www.franchisefriend.net/blog/how-to-create-a-business-plan"
  },
  {
    id: 3,
    title: "Franchising: Navigating Financial Fears with Informed Decision-Making",
    excerpt: "Address common financial concerns and learn how to make confident, informed decisions about franchise investment.",
    date: "February 20, 2024",
    category: "Finance",
    link: "https://www.franchisefriend.net/blog/franchising-navigating-financial-fears-with-informed-decision-making"
  },
  {
    id: 4,
    title: "From Questions to Clarity",
    excerpt: "Embarking on the franchise discovery journey often feels like being a detective in a mystery novel. We guide you through the clues.",
    date: "February 20, 2024",
    category: "Discovery",
    link: "https://www.franchisefriend.net/blog/from-questions-to-clarity"
  },
  {
    id: 5,
    title: "Mastering Franchise Success: A Comprehensive Guide to Ownership and Growth",
    excerpt: "Comprehensive guide to building a successful franchise business and achieving sustainable growth.",
    date: "June 13, 2023",
    category: "Success",
    link: "https://www.franchisefriend.net/blog/mastering-franchise-success-a-comprehensive-guide-to-ownership-and-growth"
  },
  {
    id: 6,
    title: "Overcoming Fear and Building Confidence",
    excerpt: "Discover strategies to overcome common fears and build the confidence needed for franchise ownership.",
    date: "April 24, 2023",
    category: "Mindset",
    link: "https://www.franchisefriend.net/blog/overcoming-fear-and-building-confidence-a-guide-to-opening-a-franchise"
  },
  {
    id: 7,
    title: "Strategic Tips for Negotiating a Favorable Commercial Lease",
    excerpt: "Master the art of lease negotiation to secure the best terms for your franchise location.",
    date: "April 10, 2023",
    category: "Operations",
    link: "https://www.franchisefriend.net/blog/strategic-tips-for-negotiating-a-favorable-commercial-lease-for-your-business"
  },
  {
    id: 8,
    title: "How to Manage People in Your Franchise Business",
    excerpt: "Essential management principles for building and leading an effective franchise team.",
    date: "April 4, 2023",
    category: "Management",
    link: "https://www.franchisefriend.net/blog/how-to-manage-people-in-your-franchise-business"
  },
  {
    id: 9,
    title: "Securing an SBA Loan for Your Franchise",
    excerpt: "Key considerations and timelines for securing SBA financing for your franchise investment.",
    date: "April 4, 2023",
    category: "Finance",
    link: "https://www.franchisefriend.net/blog/securing-an-sba-loan-for-your-franchise-key-considerations-and-timelines-to-keep-in-mind"
  },
  {
    id: 10,
    title: "5 Truths from an Experienced Franchisee",
    excerpt: "Learn valuable insights from someone who has walked the franchise ownership path before you.",
    date: "March 13, 2023",
    category: "Insights",
    link: "https://www.franchisefriend.net/blog/5-truths-from-an-experience-franchisee"
  },
  {
    id: 11,
    title: "What are Franchisors Looking for in Franchisees?",
    excerpt: "Understand the criteria franchisors use when evaluating potential franchisees.",
    date: "March 13, 2023",
    category: "Franchise Basics",
    link: "https://www.franchisefriend.net/blog/what-are-franchisors-looking-for-in-frachisees"
  },
  {
    id: 12,
    title: "5 Signs You Should Not Buy a Franchise",
    excerpt: "Important warning signs that might indicate franchise ownership isn't the right path for you.",
    date: "March 13, 2023",
    category: "Decision Making",
    link: "https://www.franchisefriend.net/blog/5-signs-you-should-not-buy-a-franchise"
  },
  {
    id: 13,
    title: "Top 5 Mistakes a New Franchisee Makes",
    excerpt: "Avoid common pitfalls by learning from mistakes others have made in their franchise journey.",
    date: "March 13, 2023",
    category: "Learning",
    link: "https://www.franchisefriend.net/blog/top-5-mistakes-a-new-franchisee-makes"
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
      
      <section className="pt-24 pb-12 bg-gradient-to-r from-primary via-primary/95 to-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Franchise Insights & Resources</h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl">
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
            <h3 className="text-lg font-bold text-primary mb-4">Filter by Category</h3>
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
                      <a 
                        href={post.link}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-secondary hover:text-accent-pop transition-colors font-semibold text-sm"
                        data-testid={`link-post-${post.id}`}
                      >
                        Read More
                        <ExternalLink className="w-3 h-3" />
                      </a>
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
