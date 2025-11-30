import { Button } from "@/components/ui/button";
import { Play, Headphones } from "lucide-react";

export function PodcastSection() {
  return (
    <section id="podcast" className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-square max-w-md mx-auto lg:mr-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img 
                src="/podcast-artwork.png" 
                alt="The Charles Stovall Podcast" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                data-testid="img-podcast-artwork"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-secondary-foreground ml-1" fill="currentColor" />
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-2 text-secondary font-medium mb-4">
              <Headphones className="w-5 h-5" />
              <span>Listen Now</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
              The Charles Stovall <br />
              <span className="text-secondary">Podcast</span>
            </h2>
            
            <p className="text-lg text-primary-foreground/80 mb-8 leading-relaxed">
              Hear the latest on how to buy a franchise with no money, how to evaluate the best franchise for you, and key notes for navigating ownership. Charles helps you make educated decisions for your future.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold h-12 px-8">
                Listen to Episodes
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 h-12">
                View All Topics
              </Button>
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/10 flex gap-8">
              <div>
                <p className="text-3xl font-bold text-secondary">100+</p>
                <p className="text-sm text-primary-foreground/60">Episodes</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-secondary">5k+</p>
                <p className="text-sm text-primary-foreground/60">Listeners</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}