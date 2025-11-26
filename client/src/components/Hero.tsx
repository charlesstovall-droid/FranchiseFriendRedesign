import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import charlesPhoto from "@assets/IMG_2636_1763927193167.jpeg";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-background via-background to-secondary/5">
      {/* Background abstract shapes */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-secondary/10 via-transparent to-transparent -skew-x-12 translate-x-1/4 z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl z-0" />
      
      {/* Animated dots pattern */}
      <div className="absolute inset-0 opacity-30 z-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-secondary rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/4 left-1/2 w-2.5 h-2.5 bg-secondary/50 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary-foreground text-sm font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            Charleston, SC
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-primary leading-[1.1] mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">
              Charles Stovall
            </span>
            <br />
            <span className="text-3xl md:text-4xl lg:text-5xl">Your Franchise Friend</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
            I guide people to franchise ownership with expertise, insight, and inside knowledge—helping you find the right opportunity, secure funding, and build lasting success.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <a href="https://calendly.com/charles-stovall/intro" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold text-base px-8 h-12 shadow-lg shadow-secondary/20 hover:shadow-xl hover:shadow-secondary/30 transition-all">
                Start Your Search
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </a>
            <a href="#services">
              <Button size="lg" variant="outline" className="border-primary/20 text-primary hover:bg-primary/5 font-semibold text-base h-12 hover:border-primary/40 transition-all">
                Learn More
              </Button>
            </a>
          </div>

          <div className="flex flex-col gap-3 text-sm font-medium text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-secondary" />
              <span>Expert Guidance on Franchise Selection</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-secondary" />
              <span>Financial Planning & Funding Strategies</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-secondary" />
              <span>Exclusive Market Opportunities</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-[600px] hidden md:block rounded-2xl overflow-hidden shadow-2xl border-2 border-secondary/10"
        >
          <img 
            src={charlesPhoto} 
            alt="Charles Stovall - Your Franchise Friend" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
          
          {/* Floating Badge */}
          <div className="absolute bottom-8 left-8 bg-background/95 backdrop-blur p-4 rounded-lg shadow-lg max-w-xs border border-border">
            <p className="text-secondary uppercase text-xs font-bold tracking-widest mb-1">Your Franchise Friend™</p>
            <p className="text-muted-foreground text-sm italic">"I provide a road map and honest assessment of how to succeed."</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}