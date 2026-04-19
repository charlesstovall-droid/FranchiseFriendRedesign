import { useState } from "react";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Issue 3: All whileInView / scroll-reveal animations removed. Cards render at full opacity.

const googleReviews = [
  {
    author: "Mark Murrel",
    role: "Principal, Murrel Investments",
    rating: 5,
    date: "2 months ago",
    text: "Charles is a great teacher and leader, and has found me several franchise opportunities to consider. I appreciate his approach on all matters including the various different franchise opportunities, and enjoy his guidance on all things. Thanks for directing me towards the right ideas, much appreciated!",
    platform: "Google",
  },
  {
    author: "Chad Tinney",
    role: "Redbox+ Owner",
    rating: 5,
    date: "3 months ago",
    text: "Charles helped guide me through the process of starting a franchise. He was patient and took the time to learn about my background and work history and then helped me strategize a plan for my future. Charles provided me with several franchise options and then meticulously walked me through each business to find the one that best fits my needs.",
    platform: "Google",
  },
  {
    author: "Matthew Groves",
    role: "4 Ever Young Owner",
    rating: 5,
    date: "4 months ago",
    text: "Charles was able to find us a franchise that we could compare to what we were already researching. My wife and I were looking for our next opportunity. He guided us through finding that match.",
    platform: "Google",
  },
  {
    author: "Joe Bosso",
    role: "Atlanta, GA",
    rating: 5,
    date: "5 months ago",
    text: "Charles helped me research 3 separate franchises. Atlanta is a hard market to find the right opportunity. Without his guidance, my wife and I would have never known what the process entailed. With his industry insight - we were able to find and fund our first franchise.",
    platform: "Google",
  },
  {
    author: "Rob Davis",
    role: "All Dry Franchisee",
    rating: 5,
    date: "6 months ago",
    text: "Charles helped me find financing and a Franchise that I could scale. Charles will help you on your journey and is a great advisor. I wouldn't have wanted anyone else on my side. His honest and straight forward approach helped me focus on making the right decision.",
    platform: "Google",
  },
  {
    author: "Freddy",
    role: "4 Ever Young",
    rating: 5,
    date: "7 months ago",
    text: "Charles was instrumental in my search for a Franchise. I have always been a business owner and never thought I would explore franchise ownership. Once I was able to connect with the right brands, it was hard for me to make a decision on which brand to choose. Charles help guide me through the decision making process. I am forever grateful I was able to meet Charles.",
    platform: "Google",
  },
  {
    author: "Erik",
    role: "Brothers Gutters",
    rating: 5,
    date: "8 months ago",
    text: "I've always thought that I would be buying a Chick-Fil-A or Subway. Charles opened up so many more opportunities. I was enlightened by the process that took me through to ensure I was able to select the right franchise for me and my family. He always took a personalized approach with me and made sure my goals were in line with the Franchisor.",
    platform: "Google",
  },
  {
    author: "Maria Riffe",
    role: "Local Guide • 5 Reviews",
    rating: 5,
    date: "11 weeks ago",
    text: "Chuck is so very thorough and professional. I highly recommend working with him. He takes the time to educate and explain, in a way that is obvious he is passionate about his knowledge. Thank you again Chuck for your direction in helping us make the best business decision currently for my family and I.",
    platform: "Google",
  },
  {
    author: "DK Patel",
    role: "Local Guide • 16 Reviews",
    rating: 5,
    date: "15 weeks ago",
    text: "Excellent partner and guide in our journey into the Franchise world. We gained valuable exposure to what is suitable and received great advice to help address our concerns and anxiety as we prepared to take a significant step from the corporate world to Franchising. Reached the finish line together, but unfortunately, we had to pause due to the shifting political policies and economic uncertainties. Would recommend to friends and family.",
    platform: "Google",
  },
  {
    author: "Brandon Dunevant",
    role: "Local Guide • 16 Reviews",
    rating: 5,
    date: "20 weeks ago",
    text: "Charles was helpful pointing out some real potential pitfalls that we wouldn't have seen coming! Highly recommend getting him involved in any high stakes transaction!",
    platform: "Google",
  },
  {
    author: "Nate F",
    role: "Local Guide • 10 Reviews",
    rating: 5,
    date: "28 weeks ago",
    text: "Charles was fantastic to work with. He's incredibly knowledgeable about franchising, but what really stands out is how much he genuinely cares about helping you find the right fit. He's honest, professional, and patient throughout the entire process. I highly recommend him to anyone considering franchise ownership.",
    platform: "Google",
  },
  {
    author: "Jon Cohen",
    role: "Local Guide • 8 Reviews",
    rating: 5,
    date: "13 months ago",
    text: "Just a fantastic experience all around. I let Charles know I was not interested in seeing 100 opportunities, but just a few that were extremely well curated to my needs. He clearly listened and did his due diligence and made it a positive experience all around.",
    platform: "Google",
  },
  {
    author: "Brent Ely",
    role: "Local Guide • 9 Reviews",
    rating: 5,
    date: "15 months ago",
    text: "Charles is a great person with strong morals and that shows in how he works with his customers. He is positive, but also very honest to help you evaluate and make the best decision for you and your family. He draws on a ton of personal experience in the franchising world and could not recommend him more for anyone who is looking at franchising.",
    platform: "Google",
  },
  {
    author: "Michael Howard",
    role: "Local Guide • 1 Review",
    rating: 5,
    date: "16 months ago",
    text: "Charles took the time to really get to know me and did an outstanding job of helping guide me through the franchise review/selection process. I would highly recommend him and his approach to anyone considering franchise ownership!",
    platform: "Google",
  },
  {
    author: "Hunter Bishop Hockey",
    role: "Local Guide • 4 Reviews",
    rating: 5,
    date: "22 months ago",
    text: "Top-notch franchise consultant! Incredibly knowledgeable, guided me seamlessly through the process. A true expert who has a ton of first hand experience in the franchising world. Loved his honestly and feedback for the good, the bad, and the ugly parts of business. Highly recommended.",
    platform: "Google",
  },
  {
    author: "Parker Wishneff",
    role: "Local Guide • 7 Reviews",
    rating: 5,
    date: "23 months ago",
    text: "Charles proved to be the epitome of professionalism throughout our collaboration. From the inception of the idea to embark on a franchise journey to the moment I finalized my contract, he stood by my side as a valuable guide. Leveraging his extensive experience in franchises, he provided valuable insights to guide me in selecting the most suitable franchise. Additionally, he consistently addressed all my questions with intelligent and seasoned advice. I wholeheartedly recommend him to anyone committed to the serious endeavor of starting a franchise.",
    platform: "Google",
  },
];

const GoogleLogo = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-secondary text-secondary" : "fill-muted text-muted"}`} />
      ))}
    </div>
  );
}

function ReviewCard({ review, index }: { review: typeof googleReviews[0]; index: number }) {
  return (
    <Card className="h-full bg-background border-border/50 hover:border-secondary/30 hover:shadow-lg transition-all group" data-testid={`review-card-${index}`}>
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <StarRating rating={review.rating} />
              <span className="text-xs text-muted-foreground">{review.date}</span>
            </div>
            <h4 className="font-bold text-primary">{review.author}</h4>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{review.role}</p>
          </div>
          <Quote className="w-8 h-8 text-secondary/20 group-hover:text-secondary/40 transition-colors" />
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed flex-1 italic">
          "{review.text}"
        </p>
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <GoogleLogo size={16} />
            <span>Posted on {review.platform}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReviewsSection() {
  const [showAll, setShowAll] = useState(false);
  const reviewsToShow = showAll ? googleReviews : googleReviews.slice(0, 6);

  const averageRating = (
    googleReviews.reduce((sum, r) => sum + r.rating, 0) / googleReviews.length
  ).toFixed(1);

  return (
    <section id="reviews" className="py-24 bg-gradient-to-b from-background via-secondary/5 to-background relative overflow-hidden">
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-secondary uppercase text-sm font-bold tracking-widest mb-3">
            Client Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
            What Clients Say About Charles
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Real stories from franchise owners who found success with expert guidance
          </p>

          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold text-primary mb-2">{averageRating}</div>
              <StarRating rating={5} />
              <p className="text-sm text-muted-foreground mt-2">{googleReviews.length} reviews</p>
            </div>
            <div className="h-16 w-px bg-border" />
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <GoogleLogo size={24} />
                <span className="font-semibold">Google Reviews</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="all">All Reviews ({googleReviews.length})</TabsTrigger>
            <TabsTrigger value="google">Google ({googleReviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviewsToShow.map((review, index) => (
                <ReviewCard key={index} review={review} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="google" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviewsToShow.map((review, index) => (
                <ReviewCard key={index} review={review} index={index} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-12 space-y-4">
          {googleReviews.length > 6 && (
            <Button
              onClick={() => setShowAll(!showAll)}
              variant="outline"
              size="lg"
              className="border-secondary/30 text-primary hover:bg-secondary/5"
              data-testid="button-view-more-reviews"
            >
              {showAll ? "View Less" : `View More (${googleReviews.length - 6} more)`}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
