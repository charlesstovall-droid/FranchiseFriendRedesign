import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { NAP, formattedAddressLine } from "@shared/nap";
import { absoluteUrl } from "@shared/site";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="About Charles Stovall | Your Franchise Friend"
        description={`Charles Stovall — franchise consultant at ${formattedAddressLine()}. Built 30 locations across 4 brands and exited to private equity.`}
        canonicalUrl={absoluteUrl("/about")}
      />
      <Navbar />

      <section className="pt-24 pb-12 bg-gradient-to-r from-primary via-primary/95 to-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">About Charles Stovall</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl">
            {NAP.name}
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl space-y-6 text-muted-foreground leading-relaxed">
          <img
            src="/charles-headshot.jpeg"
            alt="Charles Stovall, franchise consultant in Mt Pleasant, SC"
            className="w-48 h-48 object-cover rounded-xl border border-secondary/30"
          />
          <p>
            I opened my first franchise location in 2013. By 2017 I had scaled to 20 units across
            multiple states, and I went on to build and operate 30 locations across four very
            different brands before selling to private equity.
          </p>
          <p>
            Most franchise consultants have never signed a lease, made payroll on a slow month, or
            negotiated a multi-unit development agreement. I have done all three, many times over.
          </p>
          <p>
            When we review an FDD together, you get an operator&apos;s read on Item 19, territory,
            labor model, and unit economics. If a concept is not right for you, I will tell you.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>30 locations built and exited</li>
            <li>4 franchise brands owned</li>
            <li>Private equity exit</li>
            <li>Based in Mt Pleasant, SC — work with buyers nationwide</li>
          </ul>
          <address className="not-italic border border-border rounded-xl p-6 bg-secondary/5 text-foreground">
            <p className="font-serif font-bold text-primary">{NAP.name}</p>
            <p>{NAP.streetAddress}</p>
            <p>
              {NAP.addressLocality}, {NAP.addressRegion} {NAP.postalCode}
            </p>
            <p>
              <a href="tel:9198273921" className="text-secondary hover:text-accent-pop">
                {NAP.telephoneDisplay}
              </a>
            </p>
          </address>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a href="https://calendly.com/charles-stovall/intro" target="_blank" rel="noopener noreferrer">
              <Button className="bg-accent-pop hover:bg-accent-pop/90 text-primary font-semibold">
                Book a consultation
              </Button>
            </a>
            <a href="/charleston" className="inline-flex items-center text-secondary font-semibold hover:text-accent-pop">
              Charleston franchise consulting
            </a>
            <a href="/blog/fdd-red-flags" className="inline-flex items-center text-secondary font-semibold hover:text-accent-pop">
              FDD Red Flags
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
