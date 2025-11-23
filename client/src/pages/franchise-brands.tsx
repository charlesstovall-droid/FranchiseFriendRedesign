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
  Filter
} from "lucide-react";

interface Franchise {
  name: string;
  industry: string;
  investmentRange: string;
  minCash: string;
  description: string;
  icon: any;
  category: string;
}

const franchises: Franchise[] = [
  // Under $50K
  {
    name: "Cruise Planners",
    industry: "Travel & Hospitality",
    investmentRange: "$2,295 - $23,465",
    minCash: "$1,945",
    description: "Home-based travel agency with nationwide support. Work from anywhere helping clients plan dream vacations.",
    icon: Sparkles,
    category: "under50k"
  },
  {
    name: "Dream Vacations",
    industry: "Travel Agency",
    investmentRange: "$2,590 - $21,870",
    minCash: "$3,500",
    description: "#1 ranked travel franchise. Home-based model with no storefront required and comprehensive training.",
    icon: Sparkles,
    category: "under50k"
  },
  {
    name: "360clean",
    industry: "Commercial Cleaning",
    investmentRange: "$21,800 - $35,600",
    minCash: "$15,000",
    description: "Commercial cleaning with recurring revenue model. Eco-friendly products and proven systems.",
    icon: Building2,
    category: "under50k"
  },
  {
    name: "NextHome",
    industry: "Real Estate",
    investmentRange: "$16,250 - $220,345",
    minCash: "$4,500",
    description: "Real estate brokerage with cutting-edge technology and marketing support for agents.",
    icon: Home,
    category: "under50k"
  },
  {
    name: "Kona Ice",
    industry: "Food Truck",
    investmentRange: "$149,995 - $189,300",
    minCash: "$20,000",
    description: "Mobile shaved ice franchise serving events and communities. Family-friendly business model.",
    icon: Utensils,
    category: "under50k"
  },
  
  // $50K - $200K
  {
    name: "Our Town America",
    industry: "Marketing & Advertising",
    investmentRange: "$64,200 - $86,500",
    minCash: "$70,000",
    description: "New mover marketing franchise helping local businesses reach new residents in their community.",
    icon: Briefcase,
    category: "50to200k"
  },
  {
    name: "ActionCOACH",
    industry: "Business Coaching",
    investmentRange: "$139,951 - $317,022",
    minCash: "$100,000",
    description: "World's #1 business coaching franchise helping entrepreneurs achieve their goals.",
    icon: TrendingUp,
    category: "50to200k"
  },
  {
    name: "Visiting Angels",
    industry: "Senior Care",
    investmentRange: "$125,460 - $171,150",
    minCash: "$85,000",
    description: "Non-medical senior care franchise. Growing industry with strong demand and recurring revenue.",
    icon: Home,
    category: "50to200k"
  },
  {
    name: "CMIT Solutions",
    industry: "IT Services",
    investmentRange: "$106,450 - $159,450",
    minCash: "$75,000",
    description: "Managed IT services for small businesses. Recurring revenue model with strong support.",
    icon: Briefcase,
    category: "50to200k"
  },
  {
    name: "Jersey Mike's Subs",
    industry: "Fast Casual Restaurant",
    investmentRange: "$140,000 - $750,000",
    minCash: "$100,000",
    description: "Premium sub sandwich franchise with strong brand recognition and proven systems.",
    icon: Utensils,
    category: "50to200k"
  },
  
  // $200K - $500K
  {
    name: "DreamMaker Bath & Kitchen",
    industry: "Home Remodeling",
    investmentRange: "$235,075 - $507,231",
    minCash: "$200,000",
    description: "Residential remodeling franchise specializing in kitchens and bathrooms with proven sales process.",
    icon: Home,
    category: "200to500k"
  },
  {
    name: "Anago Cleaning Systems",
    industry: "Commercial Cleaning (Master)",
    investmentRange: "$219,000 - $339,000",
    minCash: "$350,000",
    description: "Master franchise opportunity building your own network of cleaning franchisees.",
    icon: Building2,
    category: "200to500k"
  },
  {
    name: "Christian Brothers Automotive",
    industry: "Auto Repair",
    investmentRange: "$520,250 - $645,400",
    minCash: "$85,000",
    description: "Honest auto repair with strong values and exceptional customer service reputation.",
    icon: Building2,
    category: "200to500k"
  },
  {
    name: "Little Caesars",
    industry: "Pizza QSR",
    investmentRange: "$393,000 - $1,700,000",
    minCash: "$200,000",
    description: "Hot-N-Ready pizza franchise with strong value proposition and high volume sales.",
    icon: Utensils,
    category: "200to500k"
  },
  
  // $500K+
  {
    name: "Dunkin'",
    industry: "Coffee & Donuts",
    investmentRange: "$121,400 - $1,787,700",
    minCash: "$250,000",
    description: "America's favorite coffee and baked goods chain with strong brand loyalty.",
    icon: Utensils,
    category: "500plus"
  },
  {
    name: "Taco Bell",
    industry: "Fast Food",
    investmentRange: "$1,298,600 - $3,370,100",
    minCash: "$750,000",
    description: "Innovative Mexican-inspired QSR with late-night focus and strong digital presence.",
    icon: Utensils,
    category: "500plus"
  },
  {
    name: "Sotheby's International Realty",
    industry: "Luxury Real Estate",
    investmentRange: "$127,650 - $512,150",
    minCash: "$50,000",
    description: "Prestigious luxury real estate brand with global reach and affluent clientele.",
    icon: Home,
    category: "500plus"
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
              Franchise Opportunities <br />
              <span className="text-secondary">I Represent</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed">
              Curated selection of top-rated franchises across all investment levels. 
              From home-based businesses to multi-unit operations, find the perfect match for your goals.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full">
                <DollarSign className="w-4 h-4 text-secondary" />
                <span>Investments from $2K to $3M+</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full">
                <TrendingUp className="w-4 h-4 text-secondary" />
                <span>Top-Rated by Franchisees</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-12 bg-secondary/5 border-b border-border">
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
                      <Button size="sm" variant="outline" className="border-secondary/30 text-secondary hover:bg-secondary/5">
                        Learn More
                      </Button>
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
    </div>
  );
}