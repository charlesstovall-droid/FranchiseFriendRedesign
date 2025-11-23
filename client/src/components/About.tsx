import { Button } from "@/components/ui/button";
import aboutImage from "@assets/generated_images/professional_male_consultant_portrait_placeholder.png";

export function About() {
  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
               <img 
                src={aboutImage} 
                alt="Charles Stovall" 
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-secondary rounded-full z-[-1]" />
            <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-primary/10 rounded-full z-[-1]" />
          </div>
          
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              About Charles
            </h2>
            <p className="text-xl text-secondary font-bold mb-2 uppercase tracking-wider text-sm">
              Your Franchise Friend™
            </p>
            <h3 className="text-lg text-muted-foreground font-medium mb-6">
              Franchise Consultant & Business Strategist
            </h3>
            
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed mb-8">
              <p>
                Based in Charleston, SC, Charles brings over a decade of entrepreneurial experience to the table. From scaling a single location to 20 successful units across multiple states, he understands the grit required to succeed.
              </p>
              <p>
                As a consultant with FranChoice, Charles uses his real-world experience to guide individuals through the due diligence process, helping them avoid common pitfalls and find the perfect business match for their lifestyle and financial goals.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base">
                  Work With Charles
                </Button>
              </a>
              <a href="mailto:CStovall@FranChoice.com">
                <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/5 px-8 h-12 text-base">
                  Send Email
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}