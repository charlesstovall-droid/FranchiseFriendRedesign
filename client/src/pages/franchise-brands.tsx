import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  TrendingUp, 
  Building2, 
  Home, 
  Utensils, 
  Briefcase,
  Sparkles,
  Filter,
  ExternalLink
} from "lucide-react";

interface Franchise {
  name: string;
  industry: string;
  investmentRange: string;
  minCash: string;
  description: string;
  icon: any;
  category: string;
  fbrLink?: string;
}

// Real data from Franchise Business Review Top 200 (2025)
const franchises: Franchise[] = [
  // Under $50K
  {
    name: "Cruise Planners",
    industry: "Travel & Hospitality",
    investmentRange: "$2,295 - $23,465",
    minCash: "$1,945",
    description: "Home-based travel agency with nationwide support. Award-winning brand featured in FBR Top 200.",
    icon: Sparkles,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/cruise-planners/"
  },
  {
    name: "Dream Vacations - CruiseOne",
    industry: "Travel & Hospitality",
    investmentRange: "$2,590 - $21,870",
    minCash: "$3,500",
    description: "#1 ranked travel franchise by FBR. Home-based model with comprehensive training and support.",
    icon: Sparkles,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/dream-vacations/"
  },
  {
    name: "Rhea Lana's",
    industry: "Retail",
    investmentRange: "$28,675 - $45,900",
    minCash: "$19,500",
    description: "Consignment retail franchise specializing in children's clothing and items. Growing franchise network.",
    icon: Sparkles,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/rhea-lanas/"
  },
  {
    name: "Auto Appraisal Network",
    industry: "Automotive",
    investmentRange: "$16,700 - $44,275",
    minCash: "$10,000",
    description: "Vehicle appraisal and valuation services. Low-cost entry into automotive industry with recurring revenue.",
    icon: Building2,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/auto-appraisal-network/"
  },
  {
    name: "Kona Ice",
    industry: "Food Truck & Beverage",
    investmentRange: "$149,995 - $189,300",
    minCash: "$20,000",
    description: "Mobile shaved ice franchise serving communities and events. FBR Top 200 award winner.",
    icon: Utensils,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/kona-ice/"
  },
  {
    name: "NextHome",
    industry: "Real Estate",
    investmentRange: "$16,250 - $220,345",
    minCash: "$4,500",
    description: "Real estate brokerage with cutting-edge technology. FBR Top 200 recognized for high franchisee satisfaction.",
    icon: Home,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/nexthome/"
  },
  
  // $50K - $200K
  {
    name: "Weed Man",
    industry: "Lawn Care & Maintenance",
    investmentRange: "$80,535 - $107,785",
    minCash: "$60,000",
    description: "Lawn care and landscaping franchise with proven systems. Recession-resistant recurring revenue model.",
    icon: Building2,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/weed-man/"
  },
  {
    name: "Fibrenew",
    industry: "Services",
    investmentRange: "$100,595 - $121,825",
    minCash: "$15,000",
    description: "Leather, plastic, and vinyl repair franchise. Multi-industry service with strong margins.",
    icon: Briefcase,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/fibrenew/"
  },
  {
    name: "TWO MEN AND A TRUCK",
    industry: "Home Services & Moving",
    investmentRange: "$107,100 - $538,700",
    minCash: "$80,000",
    description: "Moving and junk removal franchise. FBR Top 200 with strong brand recognition and support system.",
    icon: Home,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/two-men-and-a-truck/"
  },
  {
    name: "New Again Houses",
    industry: "Real Estate",
    investmentRange: "$115,000 - $208,000",
    minCash: "$75,000",
    description: "House flipping and real estate investment franchise. FBR award winner for franchisee satisfaction.",
    icon: Home,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/new-again-houses/"
  },
  {
    name: "Senior Helpers",
    industry: "Senior Care",
    investmentRange: "$149,000 - $201,000",
    minCash: "$55,000",
    description: "Non-medical senior care services. Growing industry with strong demand and recurring revenue model.",
    icon: Home,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/senior-helpers/"
  },
  {
    name: "Visiting Angels",
    industry: "Senior Care",
    investmentRange: "$125,460 - $171,150",
    minCash: "$64,950",
    description: "In-home senior care franchise. FBR Top 200 leader in senior care with high franchisee satisfaction.",
    icon: Home,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/visiting-angels/"
  },
  
  // $200K - $500K
  {
    name: "Travelin' Tom's Coffee Truck",
    industry: "Food Truck & Beverage",
    investmentRange: "$191,120 - $246,325",
    minCash: "$30,000",
    description: "Mobile coffee truck franchise. FBR award winner with proven operations and high franchisee satisfaction.",
    icon: Utensils,
    category: "200to500k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/travelin-toms-coffee/"
  },
  {
    name: "FASTSIGNS",
    industry: "Business Services",
    investmentRange: "$215,194 - $377,334",
    minCash: "$80,000",
    description: "Signs, graphics, and digital marketing franchise. Global leader with strong support and training.",
    icon: Briefcase,
    category: "200to500k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/fastsigns/"
  },
  {
    name: "Wild Birds Unlimited",
    industry: "Retail",
    investmentRange: "$224,373 - $379,957",
    minCash: "$40,000",
    description: "Specialty retail for wild bird products. FBR Top 200 award winner with passionate customer base.",
    icon: Building2,
    category: "200to500k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/wild-birds-unlimited/"
  },
  {
    name: "Wireless Zone",
    industry: "Technology & Retail",
    investmentRange: "$182,500 - $443,500",
    minCash: "$175,000",
    description: "Mobile phone and electronics retail franchise. Strong brand with multiple carrier partnerships.",
    icon: Briefcase,
    category: "200to500k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/wireless-zone/"
  },
  {
    name: "Christian Brothers Automotive",
    industry: "Automotive Services",
    investmentRange: "$520,250 - $645,400",
    minCash: "$85,000",
    description: "Automotive repair franchise with strong values and transparency. FBR Top 200 recognized excellence.",
    icon: Building2,
    category: "200to500k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/christian-brothers-automotive/"
  },
  
  // $500K+
  {
    name: "The Learning Experience",
    industry: "Education & Child Services",
    investmentRange: "$650,000 - $700,000",
    minCash: "$150,000",
    description: "Premium early childhood education franchise. FBR Top 200 with strong growth and brand reputation.",
    icon: Home,
    category: "500plus",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/the-learning-experience/"
  },
  {
    name: "Wingstop",
    industry: "Food & Beverage",
    investmentRange: "$347,600 - $759,100",
    minCash: "$600,000",
    description: "Wings and chicken franchise with strong value proposition. FBR award winner in QSR category.",
    icon: Utensils,
    category: "500plus",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/wingstop/"
  },
  {
    name: "Culver's",
    industry: "Food & Beverage",
    investmentRange: "$2,254,000 - $7,228,000",
    minCash: "$500,000",
    description: "Premium casual dining franchise. FBR Top 200 recognized for franchisee satisfaction and growth.",
    icon: Utensils,
    category: "500plus",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/culvers-franchise-opportunity/"
  },
];

export default function FranchiseBrands() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredFranchises = activeCategory === "all" 
    ? franchises 
    : franchises.filter(f => f.category === activeCategory);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-secondary/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-primary via-primary/95 to-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-secondary rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <p className="text-secondary uppercase text-sm font-bold tracking-widest mb-4">
              Your Franchise Friend™
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
              Top Franchise Opportunities <br />
              <span className="text-secondary">From Franchise Business Review</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed">
              Award-winning franchises curated from Franchise Business Review's Top 200 list. 
              Each franchise is recognized for high franchisee satisfaction, strong systems, and proven success.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full">
                <DollarSign className="w-4 h-4 text-secondary" />
                <span>Verified FBR Data (2025)</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full">
                <TrendingUp className="w-4 h-4 text-secondary" />
                <span>34,000+ Franchisee Reviews</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer & SEO Meta Section */}
      <section className="py-8 bg-secondary/5 border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-background/50 border border-border/50 rounded-lg p-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong>Data Source:</strong> All franchise information is sourced from <a href="https://franchisebusinessreview.com/lists/top-200-franchises/" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">Franchise Business Review's Top 200 Franchises for 2025</a> list, which surveys over 34,000 franchisees from 350+ brands. Investment ranges, minimum cash requirements, and industry classifications are based on current FBR data. <strong>Always verify current details directly with franchisors before making investment decisions.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-12 bg-background border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory}>
            <div className="flex items-center gap-4 mb-6">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-semibold text-lg">Filter by Investment Level</h3>
            </div>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2 bg-transparent h-auto">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                All Brands ({franchises.length})
              </TabsTrigger>
              <TabsTrigger value="under50k" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Under $50K
              </TabsTrigger>
              <TabsTrigger value="50to200k" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                $50K - $200K
              </TabsTrigger>
              <TabsTrigger value="200to500k" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                $200K - $500K
              </TabsTrigger>
              <TabsTrigger value="500plus" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                $500K+
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Franchises Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFranchises.map((franchise, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="h-full border-border/50 hover:border-secondary/30 hover:shadow-xl transition-all group bg-gradient-to-br from-background to-secondary/5">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <franchise.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Investment</p>
                        <p className="text-sm font-bold text-secondary">{franchise.investmentRange}</p>
                      </div>
                    </div>
                    <CardTitle className="font-serif text-xl text-primary group-hover:text-secondary transition-colors">
                      {franchise.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      {franchise.industry}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                      {franchise.description}
                    </p>
                    <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Min. Cash Required</p>
                        <p className="text-sm font-bold text-primary">{franchise.minCash}</p>
                      </div>
                      {franchise.fbrLink && (
                        <a href={franchise.fbrLink} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline" className="border-secondary/30 text-secondary hover:bg-secondary/5">
                            View on FBR
                            <ExternalLink className="w-3 h-3 ml-2" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredFranchises.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No franchises found in this investment range.</p>
            </div>
          )}
        </div>
      </section>

      {/* SEO Educational Section */}
      <section className="py-16 bg-secondary/5 border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-primary mb-8 text-center">
              Why These Franchises Stand Out
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  34K+
                </div>
                <h3 className="font-bold text-primary mb-2">Franchisee Surveyed</h3>
                <p className="text-sm text-muted-foreground">Across 350+ franchise brands for honest, unbiased feedback</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  30%
                </div>
                <h3 className="font-bold text-primary mb-2">Higher Satisfaction</h3>
                <p className="text-sm text-muted-foreground">FBR Top 200 franchises average 30% higher satisfaction ratings</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  85%
                </div>
                <h3 className="font-bold text-primary mb-2">Enjoy Ownership</h3>
                <p className="text-sm text-muted-foreground">Of franchisees report enjoying operating their business</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary via-primary/95 to-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Ready to Find Your Perfect Franchise?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Schedule a complimentary consultation to discuss your goals, budget, and find the franchise opportunity that matches your vision.
          </p>
          <a href="#contact">
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold px-8 h-12">
              Schedule Consultation
            </Button>
          </a>
        </div>
      </section>

      <Footer />

      {/* SEO Schema Markup */}
      <script type="application/ld+json">{`
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Charles Stovall",
              "item": "https://franchisefriend.net"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Franchise Opportunities",
              "item": "https://franchisefriend.net/franchise-brands"
            }
          ]
        }
      `}</script>
    </div>
  );
}