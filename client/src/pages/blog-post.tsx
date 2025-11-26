import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useRoute } from "wouter";

const blogContent: Record<string, { title: string; date: string; author: string; content: string }> = {
  "what-does-franchising-mean": {
    title: "What Does Franchising Really Mean? Is It the Right Fit for You?",
    date: "February 12, 2025",
    author: "Charles Stovall",
    content: `Let's cut to the chase: franchising isn't for everyone. But for the right person, it can be life-changing. If you've been thinking about franchising, you've probably heard the buzzwords—proven systems, brand recognition, support networks. But what does it _really_ mean to own a franchise? And more importantly, is it the right move for _you_?

Let's break it down, no fluff, no sugarcoating—just real talk.

## What Is Franchising, Really?

At its core, franchising is a partnership. You're buying into a proven business model, complete with a brand, systems, and processes that have already been tested and refined. In exchange, you pay fees—like an initial franchise fee and ongoing royalties—to the franchisor.

Think of it like this: instead of starting a business from scratch, you're stepping into a ready-made operation. You're not reinventing the wheel; you're driving it.

But here's the thing: franchising isn't a magic ticket to success. It's a tool. And like any tool, it only works if you're willing to put in the effort.

## Is Franchising a Good Fit for You?

Franchising can be an incredible opportunity, but it's not a one-size-fits-all solution. Here's how to know if it's the right move for you:

### You're Ready for a Change

Let's be real—if you're happy with your 9-to-5 and your life feels fulfilling as it is, franchising might not be on your radar. But if you're feeling stuck, restless, or just ready for something more, franchising could be the change you're looking for.

Maybe you're tired of working for someone else's dream. Maybe you're craving more control over your time and income. Or maybe you're just ready to take a leap into something new. If any of that resonates, franchising could be worth exploring.

### You've Got Drive—Like, Real Drive

Franchising isn't a passive investment. Sure, you're buying into a system, but you're still the one running the show. That means long hours, tough decisions, and a whole lot of hustle—especially in the beginning.

If you've got that fire in your belly, that urgency in your blood to build something of your own, franchising could be a perfect fit. But if you're looking for a "set it and forget it" opportunity, this might not be the path for you.

### You're Willing to Follow the System

Here's the deal: when you buy a franchise, you're buying into a system that's already working. That means you don't get to reinvent the wheel. You'll need to follow the franchisor's processes, guidelines, and brand standards.

If you're someone who loves to innovate and do things your own way, this might feel restrictive. But if you're okay with following a proven roadmap in exchange for support and stability, franchising could be a great fit.

## The Realities of Franchising

Let's keep it real: franchising isn't a guaranteed path to success. It's still a business, and like any business, it comes with risks. You'll need to:

- Put in the work (especially in the early days).
- Manage finances carefully (royalties and fees add up).
- Be prepared for challenges (because they _will_ come).

But here's the upside: franchising gives you a head start. You're not starting from zero. You've got a brand, a system, and a network of support behind you. And for the right person, that can make all the difference.

## So, Is Franchising Right for You?

Only you can answer that. But here's a quick checklist to help you decide:

- Are you ready for a change in your life?
- Do you have the drive and determination to build something of your own?
- Are you willing to follow a proven system, even if it means giving up some creative control?

If you answered yes to these questions, franchising might be worth a closer look.`
  },
};

export default function BlogPost() {
  const [match, params] = useRoute("/blog/:slug");
  
  if (!match) return null;
  
  const slug = (params?.slug as string) || "";
  const post = blogContent[slug];

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <section className="pt-32 pb-12">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-3xl font-bold text-primary mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-6">This blog post doesn't exist yet.</p>
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              <a href="/blog">Back to Blog</a>
            </Button>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <section className="pt-24 pb-8 bg-gradient-to-r from-primary via-primary/95 to-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <a href="/blog" className="inline-flex items-center gap-2 text-accent-pop hover:text-accent-pop/80 mb-6 transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Back to Blog
            </a>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-primary-foreground/70">
              <span>{post.date}</span>
              <span>•</span>
              <span>By {post.author}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="prose prose-lg max-w-none text-foreground"
          >
            <div className="space-y-6">
              {post.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('##')) {
                  return (
                    <h2 key={index} className="text-2xl font-bold text-primary mt-8 mb-4">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                if (paragraph.startsWith('###')) {
                  return (
                    <h3 key={index} className="text-xl font-bold text-primary mt-6 mb-3">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                if (paragraph.startsWith('-')) {
                  return (
                    <ul key={index} className="list-disc list-inside space-y-2 text-muted-foreground">
                      {paragraph.split('\n').map((item, i) => (
                        <li key={i} className="ml-4">{item.replace('- ', '')}</li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={index} className="text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </motion.article>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-16 p-8 bg-gradient-to-r from-accent-pop/5 to-accent-pop/10 border border-accent-pop/30 rounded-lg text-center"
          >
            <h3 className="text-2xl font-bold text-primary mb-3">Ready to explore franchise ownership?</h3>
            <p className="text-muted-foreground mb-6">Schedule a consultation with Charles to discuss your specific goals.</p>
            <a 
              href="https://calendly.com/charles-stovall/intro" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button className="bg-accent-pop hover:bg-accent-pop/90 text-primary font-semibold">
                Book Your Free Consultation
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
