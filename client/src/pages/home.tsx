import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustBanner } from "@/components/TrustBanner";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { MediaFeatures } from "@/components/MediaFeatures";
import { ReviewsSection } from "@/components/ReviewsSection";
import { PodcastSection } from "@/components/PodcastSection";
import { About } from "@/components/About";
import { MeetCharlesFamily } from "@/components/MeetCharlesFamily";
import { BlackBookCTA } from "@/components/BlackBookCTA";
import { LatestInsights } from "@/components/LatestInsights";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-secondary/30">
      <Navbar />
      <main>
        <Hero />
        <TrustBanner />
        <LatestInsights />
        <HowItWorks />
        <Features />
        <MediaFeatures />
        <ReviewsSection />
        <PodcastSection />
        <About />
        <MeetCharlesFamily />
        <BlackBookCTA />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}