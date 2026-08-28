import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustBanner } from "@/components/TrustBanner";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { MediaFeatures } from "@/components/MediaFeatures";
import { ReviewsSection } from "@/components/ReviewsSection";
import { About } from "@/components/About";
import { MeetCharlesFamily } from "@/components/MeetCharlesFamily";
import { LatestInsights } from "@/components/LatestInsights";
import { HomeFAQ } from "@/components/HomeFAQ";
import { CTASection } from "@/components/CTASection";
import { PodcastSection } from "@/components/PodcastSection";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-secondary/30">
      <SEO
        title="Charles Stovall | Expert Franchise Consulting in Charleston SC | Franchise Friend"
        description="Expert franchise consulting by Charles Stovall in Charleston, SC. Find top franchises 2026, business evaluation, due diligence services, and personalized franchise discovery."
        canonicalUrl="https://www.charlesstovall.com/"
      />
      <Navbar />
      <main>
        <Hero />
        <TrustBanner />
        <LatestInsights />
        <HowItWorks />
        <Features />
        <MediaFeatures />
        <ReviewsSection />
        {/* Issue 9: PodcastSection moved above Footer (thin strip, no stats) */}
        <About />
        <MeetCharlesFamily />
        <HomeFAQ />
        <CTASection />
      </main>
      {/* Issue 9: PodcastSection strip sits just above the footer */}
      <PodcastSection />
      <Footer />
    </div>
  );
}
