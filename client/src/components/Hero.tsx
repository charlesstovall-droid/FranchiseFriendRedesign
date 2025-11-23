import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import heroImage from "@assets/generated_images/professional_modern_office_space_with_warm_lighting_and_depth.png";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-background">
      {/* Background abstract shapes */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary/5 -skew-x-12 translate-x-1/4 z-0" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary-foreground text-sm font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            Your Journey Starts Here
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-primary leading-[1.1] mb-6">
            Guiding People to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">
              Franchise Ownership
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
            Expertise, insight, and inside knowledge to help you find a top franchise, change careers, and create your own financial security.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold text-base px-8 h-12">
              Start Your Search
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-primary/20 text-primary hover:bg-primary/5 font-semibold text-base h-12">
              Learn More
            </Button>
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
          className="relative h-[600px] hidden md:block rounded-2xl overflow-hidden shadow-2xl"
        >
          <img 
            src={heroImage} 
            alt="Modern Professional Office" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-60" />
          
          {/* Floating Badge */}
          <div className="absolute bottom-8 left-8 bg-background/95 backdrop-blur p-4 rounded-lg shadow-lg max-w-xs border border-border">
            <p className="font-serif font-bold text-primary text-lg mb-1">Charles Stovall</p>
            <p className="text-muted-foreground text-sm">"I provide a road map and honest assessment of how to succeed."</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}