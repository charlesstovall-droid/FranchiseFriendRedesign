import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useRoute, Link } from "wouter";
import { getPostBySlug, formatDate } from "@/data/blog-posts";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;
  
  const post = slug ? getPostBySlug(slug) : null;
  
  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
            <h1 className="text-4xl font-serif font-bold text-primary mb-6">Post Not Found</h1>
            <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
            <Link href="/blog">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <section className="pt-32 pb-12 bg-gradient-to-r from-primary via-primary/95 to-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link href="/blog">
              <Button 
                variant="ghost" 
                className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 mb-6"
                data-testid="button-back-to-blog"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Insights
              </Button>
            </Link>
            <span className="inline-block mb-4 px-3 py-1 bg-secondary/20 text-secondary text-sm font-semibold rounded">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-primary-foreground/70">
              <span>{formatDate(post.date)}</span>
              <span>•</span>
              <span>Charles Stovall</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            <div className="bg-white border border-border rounded-xl p-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {post.excerpt}
              </p>
              <div 
                className="border-t border-border pt-6 prose prose-lg max-w-none text-foreground [&_p]:mb-4 [&_p]:leading-relaxed [&_i]:italic"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </motion.article>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <p className="text-lg text-muted-foreground mb-6">
              Ready to explore franchise opportunities?
            </p>
            <a href="https://calendly.com/charles-stovall/intro" target="_blank" rel="noopener noreferrer">
              <Button className="bg-accent-pop text-primary hover:bg-accent-pop/90 font-semibold">
                Book a Free Consultation
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
