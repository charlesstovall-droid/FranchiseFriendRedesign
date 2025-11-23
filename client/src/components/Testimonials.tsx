import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Charles is a great teacher and leader. I appreciate his approach on all matters including the various different franchise opportunities, and enjoy his guidance on all things.",
    author: "Mark Murrel",
    role: "Principal, Murrel Investments"
  },
  {
    quote: "He was patient and took the time to learn about my background and work history and then helped me strategize a plan for my future. Charles provided me with several franchise options.",
    author: "Chad Tinney",
    role: "Owner, Distek Inc"
  },
  {
    quote: "Charles helped me research 3 separate franchises. Without his guidance, my wife and I would have never known what the process entailed. We were able to find and fund our first franchise.",
    author: "Joe Bosso",
    role: "Franchise Owner, Atlanta GA"
  },
  {
    quote: "I've always thought that I would be buying a Chick-Fil-A or Subway. Charles opened up so many more opportunities. I was enlightened by the process.",
    author: "Erik",
    role: "Brothers Gutters"
  }
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
            Client Success Stories
          </h2>
          <p className="text-lg text-muted-foreground">
            Don't just take my word for it. See how Charles has helped others achieve their dreams of franchise ownership.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent className="-ml-4 md:-ml-6">
            {testimonials.map((item, index) => (
              <CarouselItem key={index} className="pl-4 md:pl-6 md:basis-1/2 lg:basis-1/2">
                <div className="p-1">
                  <Card className="bg-secondary/5 border-none shadow-none h-full">
                    <CardContent className="flex flex-col justify-between h-full p-8">
                      <div>
                        <Quote className="w-10 h-10 text-secondary/40 mb-6" />
                        <p className="text-lg text-foreground/80 italic mb-8 leading-relaxed">
                          "{item.quote}"
                        </p>
                      </div>
                      <div>
                        <p className="font-bold text-primary font-serif">{item.author}</p>
                        <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">{item.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
}