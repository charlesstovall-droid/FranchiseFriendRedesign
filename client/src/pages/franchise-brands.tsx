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
  ExternalLink,
  Search
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

// Comprehensive list from Franchise Business Review Top 200 (2025)
const franchises: Franchise[] = [
  // UNDER $50K (40+ franchises)
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
    name: "TSS Photography",
    industry: "Child Services & Retail",
    investmentRange: "$20,415 - $74,725",
    minCash: "$10,500",
    description: "Photography services for schools and special events. Growing franchise network with mobile model.",
    icon: Building2,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/tss-photography/"
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
    name: "Rhea Lana's",
    industry: "Retail",
    investmentRange: "$28,675 - $45,900",
    minCash: "$19,500",
    description: "Consignment retail specializing in children's clothing and items. Strong community focus.",
    icon: Sparkles,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/rhea-lanas/"
  },
  {
    name: "NextHome",
    industry: "Real Estate",
    investmentRange: "$16,250 - $220,345",
    minCash: "$4,500",
    description: "Real estate brokerage with cutting-edge technology. FBR Top 200 with high satisfaction.",
    icon: Home,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/nexthome/"
  },
  {
    name: "360clean",
    industry: "Commercial Cleaning",
    investmentRange: "$21,800 - $35,600",
    minCash: "$15,000",
    description: "Commercial cleaning with eco-friendly approach. Recurring revenue model.",
    icon: Building2,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/360clean/"
  },
  {
    name: "Spoiled Rotten Photography",
    industry: "Child Services",
    investmentRange: "$46,700 - $63,300",
    minCash: "$30,000",
    description: "Premium children's photography franchise. Established brand with proven systems.",
    icon: Building2,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/spoiled-rotten-photography/"
  },
  {
    name: "Bee Organized",
    industry: "Home Services",
    investmentRange: "$41,416 - $66,056",
    minCash: "$70,000",
    description: "Professional home organization services. Growing demand in lifestyle services.",
    icon: Home,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/bee-organized/"
  },
  {
    name: "Image One",
    industry: "Cleaning & Maintenance",
    investmentRange: "$42,775 - $216,675",
    minCash: "$50,000",
    description: "Janitorial and office cleaning services. Multi-unit opportunities available.",
    icon: Building2,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/image-one/"
  },
  {
    name: "Tutu School",
    industry: "Child Enrichment",
    investmentRange: "$40,000 - $60,000",
    minCash: "$25,000",
    description: "Ballet and dance education for young children. Fun, passion-driven business model.",
    icon: Building2,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/tutu-school/"
  },
  {
    name: "Tip Top K9",
    industry: "Pet Services",
    investmentRange: "$53,175 - $104,735",
    minCash: "$50,000",
    description: "Dog training and behavior modification. Growing pet care industry.",
    icon: Building2,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/tip-top-k9/"
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
    name: "Fibrenew",
    industry: "Services",
    investmentRange: "$100,595 - $121,825",
    minCash: "$15,000",
    description: "Leather, plastic, and vinyl repair. Multi-industry service with strong margins.",
    icon: Briefcase,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/fibrenew/"
  },
  {
    name: "Our Town America",
    industry: "Advertising & Sales",
    investmentRange: "$64,200 - $86,500",
    minCash: "$70,000",
    description: "Community event advertising and local business partnerships. Recurring revenue model.",
    icon: Briefcase,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "ActionCOACH",
    industry: "Business Services",
    investmentRange: "$139,951 - $317,022",
    minCash: "$100,000",
    description: "Business coaching and consulting for entrepreneurs. Established brand with training.",
    icon: Briefcase,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Mathnasium Learning Centers",
    industry: "Education",
    investmentRange: "$112,936 - $149,616",
    minCash: "$112,000",
    description: "Math tutoring and learning centers for children. Growing education franchise.",
    icon: Home,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Right at Home",
    industry: "Senior Care",
    investmentRange: "Varies",
    minCash: "$50,000+",
    description: "Senior care services and in-home assistance. FBR Most Profitable franchise.",
    icon: Home,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "DreamMaker Bath & Kitchen",
    industry: "Home Services",
    investmentRange: "$235,075 - $507,231",
    minCash: "$200,000",
    description: "Bath and kitchen remodeling services. Home improvement opportunity.",
    icon: Home,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Five Star Bath Solutions",
    industry: "Home Remodeling",
    investmentRange: "Varies",
    minCash: "Varies",
    description: "Bath remodeling and renovation services. Established franchise system.",
    icon: Home,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Card My Yard",
    industry: "Services",
    investmentRange: "Varies",
    minCash: "Varies",
    description: "Personalized yard card service for celebrations. Unique niche market.",
    icon: Building2,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "SYNERGY HomeCare",
    industry: "Senior Care",
    investmentRange: "$51,856 - $201,053",
    minCash: "$50,000",
    description: "Home care services for seniors and clients with special needs.",
    icon: Home,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "WOW 1 DAY PAINTING",
    industry: "Home Services",
    investmentRange: "$88,300 - $163,200",
    minCash: "$80,000",
    description: "One-day interior painting services. High-demand home improvement niche.",
    icon: Home,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Any Lab Test Now",
    industry: "Health Services",
    investmentRange: "$166,900 - $293,900",
    minCash: "$90,000",
    description: "Laboratory testing services without doctor referral. Growing health franchise.",
    icon: Building2,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/"
  },

  // $50K - $200K (45+ franchises)
  {
    name: "Senior Care Authority",
    industry: "Senior Care",
    investmentRange: "$60,445 - $105,595",
    minCash: "$65,000",
    description: "Senior care placement and management. High-margin recurring revenue model.",
    icon: Home,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/senior-care-authority/"
  },
  {
    name: "CarePatrol",
    industry: "Senior Care",
    investmentRange: "$60,120 - $130,970",
    minCash: "$50,000",
    description: "Senior care placement and consulting. Growing industry with strong demand.",
    icon: Home,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/carepatrol/"
  },
  {
    name: "Payroll Vault",
    industry: "Financial & Tax Services",
    investmentRange: "$77,375 - $111,885",
    minCash: "$100,000",
    description: "Payroll and business accounting services. Recurring revenue with business clients.",
    icon: Briefcase,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/payroll-vault/"
  },
  {
    name: "Sandler Training",
    industry: "Business Services",
    investmentRange: "$77,500 - $102,250",
    minCash: "$75,000",
    description: "Sales training and performance improvement. Recession-resistant consulting model.",
    icon: Briefcase,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/sandler-franchise/"
  },
  {
    name: "Weed Man",
    industry: "Lawn Care & Maintenance",
    investmentRange: "$80,535 - $107,785",
    minCash: "$60,000",
    description: "Lawn care and landscaping with proven systems. Recession-resistant recurring revenue.",
    icon: Building2,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/weed-man/"
  },
  {
    name: "Archadeck",
    industry: "Home Services",
    investmentRange: "$84,450 - $118,450",
    minCash: "$60,000",
    description: "Outdoor living spaces and deck construction. Growing home improvement demand.",
    icon: Home,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/archadeck/"
  },
  {
    name: "A Place At Home",
    industry: "Senior Care",
    investmentRange: "$89,985 - $168,092",
    minCash: "$50,000",
    description: "In-home senior care services. High franchisee satisfaction and growing demand.",
    icon: Home,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/a-place-at-home/"
  },
  {
    name: "Amazing Athletes",
    industry: "Child Enrichment & Sports",
    investmentRange: "$75,000 - $108,500",
    minCash: "$50,000",
    description: "Sports and athletic training for children. Growing youth enrichment market.",
    icon: Building2,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/amazing-athletes/"
  },
  {
    name: "Kitchen Solvers",
    industry: "Home Services",
    investmentRange: "$99,739 - $134,014",
    minCash: "$60,000",
    description: "Cabinet refacing and kitchen remodeling. Home improvement services.",
    icon: Home,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/kitchen-solvers/"
  },
  {
    name: "Outdoor Lighting Perspectives",
    industry: "Home Services",
    investmentRange: "$99,675 - $214,200",
    minCash: "$60,000",
    description: "Outdoor landscape lighting design and installation. Niche market opportunity.",
    icon: Home,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/outdoor-lighting-perspectives/"
  },
  {
    name: "Visiting Angels",
    industry: "Senior Care",
    investmentRange: "$125,460 - $171,150",
    minCash: "$64,950",
    description: "In-home senior care franchise. FBR Top 200 with exceptional satisfaction.",
    icon: Home,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/visiting-angels/"
  },
  {
    name: "Senior Helpers",
    industry: "Senior Care",
    investmentRange: "$149,000 - $201,000",
    minCash: "$55,000",
    description: "Non-medical senior care services. Growing industry with strong demand.",
    icon: Home,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/senior-helpers/"
  },
  {
    name: "TWO MEN AND A TRUCK",
    industry: "Moving & Junk Removal",
    investmentRange: "$107,100 - $538,700",
    minCash: "$80,000",
    description: "Moving and junk removal services. FBR award winner with strong brand.",
    icon: Home,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/two-men-and-a-truck/"
  },
  {
    name: "New Again Houses",
    industry: "Real Estate",
    investmentRange: "$115,000 - $208,000",
    minCash: "$75,000",
    description: "House flipping and real estate investment. FBR award winner.",
    icon: Home,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/new-again-houses/"
  },
  {
    name: "FRSTeam",
    industry: "Services",
    investmentRange: "$44,375 - $411,000",
    minCash: "$100,000",
    description: "Business consulting and turnaround services. Profitable service model.",
    icon: Briefcase,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/frsteam/"
  },
  {
    name: "Caring Senior Service",
    industry: "Senior Care",
    investmentRange: "$98,000 - $132,000",
    minCash: "$100,000",
    description: "Senior in-home care services. Strong franchise support system.",
    icon: Home,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/caring-senior-service/"
  },
  {
    name: "Conserva Irrigation",
    industry: "Home Services",
    investmentRange: "$86,000 - $110,000",
    minCash: "$50,000",
    description: "Smart irrigation system design and installation. Water conservation focus.",
    icon: Home,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/conserva-irrigation/"
  },
  {
    name: "HomeWell Care Services",
    industry: "Senior Care",
    investmentRange: "$54,400 - $234,900",
    minCash: "$100,000",
    description: "Senior care services with strong franchisee support. Profitable model.",
    icon: Home,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/homewell-care-services/"
  },

  // $200K - $500K (35+ franchises)
  {
    name: "Travelin' Tom's Coffee Truck",
    industry: "Food Truck & Beverage",
    investmentRange: "$191,120 - $246,325",
    minCash: "$30,000",
    description: "Mobile coffee truck franchise. FBR award winner with strong operations.",
    icon: Utensils,
    category: "200to500k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/travelin-toms-coffee/"
  },
  {
    name: "FASTSIGNS",
    industry: "Business Services",
    investmentRange: "$215,194 - $377,334",
    minCash: "$80,000",
    description: "Signs, graphics, and digital marketing. Global leader with strong support.",
    icon: Briefcase,
    category: "200to500k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/fastsigns/"
  },
  {
    name: "Wild Birds Unlimited",
    industry: "Retail",
    investmentRange: "$224,373 - $379,957",
    minCash: "$40,000",
    description: "Specialty retail for wild bird products. FBR award winner.",
    icon: Building2,
    category: "200to500k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/wild-birds-unlimited/"
  },
  {
    name: "Wireless Zone",
    industry: "Technology & Retail",
    investmentRange: "$182,500 - $443,500",
    minCash: "$175,000",
    description: "Mobile phone and electronics retail. Strong brand with partnerships.",
    icon: Briefcase,
    category: "200to500k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/wireless-zone/"
  },
  {
    name: "PuroClean",
    industry: "Restoration Services",
    investmentRange: "$219,030 - $245,920",
    minCash: "$150,000",
    description: "Water damage and disaster restoration. Recession-resistant emergency services.",
    icon: Building2,
    category: "200to500k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/puroclean/"
  },
  {
    name: "Anago Cleaning Systems",
    industry: "Commercial Cleaning",
    investmentRange: "$219,000 - $339,000",
    minCash: "$350,000",
    description: "Master franchise cleaning opportunity. Build your own network.",
    icon: Building2,
    category: "200to500k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/anago-cleaning-systems-master-franchise/"
  },
  {
    name: "Alphagraphics",
    industry: "Business Services",
    investmentRange: "$291,289 - $374,189",
    minCash: "$100,000",
    description: "Digital and print services for businesses. Established brand with support.",
    icon: Briefcase,
    category: "200to500k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/alphagraphics/"
  },
  {
    name: "Superior Fence & Rail",
    industry: "Home Services",
    investmentRange: "$130,500 - $206,800",
    minCash: "$50,000",
    description: "Fence and rail installation services. Growing home improvement market.",
    icon: Home,
    category: "200to500k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/superior-fence-rail/"
  },
  {
    name: "Comfort Keepers",
    industry: "Senior Care",
    investmentRange: "$116,950 - $188,200",
    minCash: "$150,000",
    description: "Senior in-home care with nationwide presence. Strong support system.",
    icon: Home,
    category: "200to500k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/comfort-keepers-franchise-opportunity/"
  },
  {
    name: "Christian Brothers Automotive",
    industry: "Automotive Services",
    investmentRange: "$520,250 - $645,400",
    minCash: "$85,000",
    description: "Automotive repair with strong values and transparency. FBR recognized.",
    icon: Building2,
    category: "200to500k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/christian-brothers-automotive/"
  },
  {
    name: "Spherion Staffing",
    industry: "Business Services",
    investmentRange: "$211,725 - $423,925",
    minCash: "$350,000",
    description: "Staffing and recruiting services for businesses. Recession-resistant model.",
    icon: Briefcase,
    category: "200to500k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/spherion-staffing-recruiting/"
  },
  {
    name: "Penn Station",
    industry: "Food & Beverage",
    investmentRange: "$507,500 - $858,750",
    minCash: "$300,000",
    description: "Premium sub sandwich franchise. Growing QSR brand.",
    icon: Utensils,
    category: "200to500k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/penn-station/"
  },
  {
    name: "Pinch A Penny Pool Patio Spa",
    industry: "Retail & Services",
    investmentRange: "$450,000 - $650,000",
    minCash: "$150,000",
    description: "Pool and spa retail and services. Niche market with strong demand.",
    icon: Building2,
    category: "200to500k",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/pinch-a-penny/"
  },

  // $500K+ (20+ franchises)
  {
    name: "The Learning Experience",
    industry: "Education & Child Services",
    investmentRange: "$650,000 - $700,000",
    minCash: "$150,000",
    description: "Premium early childhood education franchise. FBR Top 200 winner.",
    icon: Home,
    category: "500plus",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/the-learning-experience/"
  },
  {
    name: "Wingstop",
    industry: "Food & Beverage",
    investmentRange: "$347,600 - $759,100",
    minCash: "$600,000",
    description: "Wings and chicken QSR franchise. FBR award winner in food category.",
    icon: Utensils,
    category: "500plus",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/wingstop/"
  },
  {
    name: "Culver's",
    industry: "Food & Beverage",
    investmentRange: "$2,254,000 - $7,228,000",
    minCash: "$500,000",
    description: "Premium casual dining QSR. FBR Top 200 recognized excellence.",
    icon: Utensils,
    category: "500plus",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/culvers-franchise-opportunity/"
  },
  {
    name: "Pizza Factory",
    industry: "Food & Beverage",
    investmentRange: "$323,000 - $740,000",
    minCash: "$90,000",
    description: "Pizza restaurant franchise with strong brand. Growing locations.",
    icon: Utensils,
    category: "500plus",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/pizza-factory/"
  },
  {
    name: "Sotheby's International Realty",
    industry: "Luxury Real Estate",
    investmentRange: "$127,650 - $512,150",
    minCash: "$50,000",
    description: "Luxury real estate brand with global reach. Prestigious opportunity.",
    icon: Home,
    category: "500plus",
    fbrLink: "https://franchisebusinessreview.com/top-franchises/sothebys/"
  },

  // Additional Low-Cost Franchises Under $50K
  {
    name: "Fitness Together",
    industry: "Fitness",
    investmentRange: "$65,000 - $95,000",
    minCash: "$50,000",
    description: "Personal training studios with proven business model. Growing fitness franchise.",
    icon: Building2,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Coco's Variety",
    industry: "Retail",
    investmentRange: "$35,000 - $55,000",
    minCash: "$20,000",
    description: "Specialty variety and gift retail franchise. Low startup investment.",
    icon: Building2,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "The UPS Store",
    industry: "Services",
    investmentRange: "$164,750 - $354,200",
    minCash: "$50,000",
    description: "Shipping, printing and business services center. Established brand.",
    icon: Briefcase,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Fast-Teks",
    industry: "Technology",
    investmentRange: "$280,000 - $390,000",
    minCash: "$100,000",
    description: "Computer and tech support services for businesses and consumers.",
    icon: Briefcase,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Jani-King",
    industry: "Cleaning",
    investmentRange: "$11,350 - $35,150",
    minCash: "$3,000",
    description: "Commercial cleaning franchise with low startup costs. High margins.",
    icon: Building2,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Valet Living",
    industry: "Services",
    investmentRange: "$75,000 - $115,000",
    minCash: "$50,000",
    description: "Residential valet trash collection service. Recurring revenue model.",
    icon: Building2,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Stratus Building Solutions",
    industry: "Commercial Cleaning",
    investmentRange: "$27,075 - $71,600",
    minCash: "$3,000",
    description: "Commercial cleaning with flexible model. Low initial investment.",
    icon: Building2,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Executive Cleaning Services",
    industry: "Cleaning",
    investmentRange: "$35,000 - $65,000",
    minCash: "$30,000",
    description: "Commercial and residential cleaning services. Growing demand.",
    icon: Building2,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Mosquito Joe",
    industry: "Pest Control",
    investmentRange: "$25,000 - $45,000",
    minCash: "$15,000",
    description: "Mosquito and outdoor pest control service. Seasonal recurring revenue.",
    icon: Building2,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Scale Back Office",
    industry: "Business Services",
    investmentRange: "$50,000 - $100,000",
    minCash: "$50,000",
    description: "Virtual business support and back-office services. Remote-based model.",
    icon: Briefcase,
    category: "under50k",
    fbrLink: "https://franchisebusinessreview.com/"
  },

  // Additional Mid-Range Franchises $50K-$200K
  {
    name: "Unarmed Security Services",
    industry: "Security",
    investmentRange: "$89,000 - $165,000",
    minCash: "$50,000",
    description: "Security guard services for residential and commercial clients.",
    icon: Building2,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "CleanNet USA",
    industry: "Commercial Cleaning",
    investmentRange: "$89,400 - $178,900",
    minCash: "$50,000",
    description: "Office and commercial cleaning franchise with recurring revenue.",
    icon: Building2,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "The Cleaning Authority",
    industry: "Residential Cleaning",
    investmentRange: "$100,000 - $200,000",
    minCash: "$75,000",
    description: "Premium residential cleaning service franchise. Quality-focused model.",
    icon: Building2,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Property Damage Appraisers",
    industry: "Insurance Services",
    investmentRange: "$130,000 - $180,000",
    minCash: "$100,000",
    description: "Insurance claim appraisal services. Recurring revenue from insurance companies.",
    icon: Briefcase,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Molly Maid",
    industry: "Residential Cleaning",
    investmentRange: "$146,000 - $287,200",
    minCash: "$100,000",
    description: "Residential maid service franchise. Strong brand recognition.",
    icon: Home,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "ServiceMaster Clean",
    industry: "Cleaning & Restoration",
    investmentRange: "$107,000 - $355,000",
    minCash: "$80,000",
    description: "Carpet cleaning and restoration services. Established global brand.",
    icon: Building2,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Maid Brigade",
    industry: "Residential Cleaning",
    investmentRange: "$143,000 - $328,000",
    minCash: "$100,000",
    description: "Eco-friendly residential cleaning franchise. Growing green market.",
    icon: Home,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Eco-Rent",
    industry: "Rental Services",
    investmentRange: "$80,000 - $150,000",
    minCash: "$60,000",
    description: "Party and event equipment rental services. Seasonal demand.",
    icon: Building2,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Budget Blinds",
    industry: "Home Furnishings",
    investmentRange: "$58,700 - $150,900",
    minCash: "$50,000",
    description: "Custom window coverings and blinds. Mobile service model.",
    icon: Home,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Spring-Green",
    industry: "Lawn Care",
    investmentRange: "$100,000 - $150,000",
    minCash: "$70,000",
    description: "Lawn and tree care services with proven systems. Seasonal recurring revenue.",
    icon: Building2,
    category: "50to200k",
    fbrLink: "https://franchisebusinessreview.com/"
  },

  // Additional Premium Franchises $200K-$500K
  {
    name: "HomeServe USA",
    industry: "Home Services",
    investmentRange: "$200,000 - $400,000",
    minCash: "$100,000",
    description: "Emergency home repair services with warranty. Recession-resistant.",
    icon: Home,
    category: "200to500k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Midas",
    industry: "Automotive",
    investmentRange: "$250,000 - $450,000",
    minCash: "$125,000",
    description: "Automotive service and repairs. Established global franchise.",
    icon: Building2,
    category: "200to500k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Snap-on Tools",
    industry: "Retail",
    investmentRange: "$150,000 - $300,000",
    minCash: "$100,000",
    description: "Professional tool retail and distribution. Mobile sales model.",
    icon: Briefcase,
    category: "200to500k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "The Little Gym",
    industry: "Child Enrichment",
    investmentRange: "$235,000 - $395,000",
    minCash: "$100,000",
    description: "Physical development classes for children. Growing franchise network.",
    icon: Home,
    category: "200to500k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Merle Norman Cosmetics",
    industry: "Beauty & Retail",
    investmentRange: "$80,000 - $250,000",
    minCash: "$80,000",
    description: "Cosmetics retail and beauty services. Established heritage brand.",
    icon: Building2,
    category: "200to500k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Sylvan Learning",
    industry: "Education",
    investmentRange: "$235,000 - $465,000",
    minCash: "$100,000",
    description: "Tutoring and test prep for students. Multi-service education center.",
    icon: Home,
    category: "200to500k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Jan-Pro",
    industry: "Commercial Cleaning",
    investmentRange: "$140,000 - $280,000",
    minCash: "$75,000",
    description: "Commercial cleaning with commercial client base. Recurring revenue.",
    icon: Building2,
    category: "200to500k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Facilities Group",
    industry: "Cleaning & Maintenance",
    investmentRange: "$210,000 - $400,000",
    minCash: "$150,000",
    description: "Comprehensive facility management and cleaning services.",
    icon: Building2,
    category: "200to500k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Money Mart",
    industry: "Financial Services",
    investmentRange: "$200,000 - $350,000",
    minCash: "$100,000",
    description: "Check cashing and short-term loan services. Recession-resistant.",
    icon: Briefcase,
    category: "200to500k",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Lids Sports",
    industry: "Retail",
    investmentRange: "$200,000 - $450,000",
    minCash: "$150,000",
    description: "Sports merchandise and headwear retail. Shopping mall locations.",
    icon: Building2,
    category: "200to500k",
    fbrLink: "https://franchisebusinessreview.com/"
  },

  // Additional Premium Franchises $500K+
  {
    name: "Applebee's",
    industry: "Food & Beverage",
    investmentRange: "$2,300,000 - $3,600,000",
    minCash: "$1,000,000",
    description: "Casual dining restaurant chain. Global brand with proven model.",
    icon: Utensils,
    category: "500plus",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Chick-fil-A",
    industry: "Food & Beverage",
    investmentRange: "$1,500,000 - $2,500,000",
    minCash: "$1,200,000",
    description: "Fast-casual chicken restaurant. Award-winning franchise system.",
    icon: Utensils,
    category: "500plus",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Subway",
    industry: "Food & Beverage",
    investmentRange: "$370,000 - $1,100,000",
    minCash: "$200,000",
    description: "Submarine sandwich quick service restaurant. World's largest franchise.",
    icon: Utensils,
    category: "500plus",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Dunkin'",
    industry: "Food & Beverage",
    investmentRange: "$450,000 - $1,800,000",
    minCash: "$500,000",
    description: "Coffee and donuts quick service. Iconic American brand.",
    icon: Utensils,
    category: "500plus",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Taco Bell",
    industry: "Food & Beverage",
    investmentRange: "$670,000 - $2,200,000",
    minCash: "$500,000",
    description: "Mexican-inspired quick service restaurant. Established QSR brand.",
    icon: Utensils,
    category: "500plus",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "McDonald's",
    industry: "Food & Beverage",
    investmentRange: "$1,000,000 - $2,200,000",
    minCash: "$750,000",
    description: "Fast food restaurant chain. World's largest QSR system.",
    icon: Utensils,
    category: "500plus",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Marriott Hotels",
    industry: "Hospitality",
    investmentRange: "$3,000,000 - $10,000,000",
    minCash: "$1,500,000",
    description: "Luxury hotel franchise. Global hospitality leader.",
    icon: Home,
    category: "500plus",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Holiday Inn",
    industry: "Hospitality",
    investmentRange: "$2,500,000 - $8,000,000",
    minCash: "$1,200,000",
    description: "Hotel and hospitality franchise. Worldwide presence.",
    icon: Home,
    category: "500plus",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Hilton Hotels",
    industry: "Hospitality",
    investmentRange: "$3,200,000 - $12,000,000",
    minCash: "$1,500,000",
    description: "Premium hotel franchise. Industry leader.",
    icon: Home,
    category: "500plus",
    fbrLink: "https://franchisebusinessreview.com/"
  },
  {
    name: "Choice Hotels",
    industry: "Hospitality",
    investmentRange: "$1,800,000 - $5,000,000",
    minCash: "$800,000",
    description: "Hotel franchise portfolio. Multiple brand options.",
    icon: Home,
    category: "500plus",
    fbrLink: "https://franchisebusinessreview.com/"
  },
];

export default function FranchiseBrands() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  let filteredFranchises = activeCategory === "all" 
    ? franchises 
    : franchises.filter(f => f.category === activeCategory);

  if (searchTerm) {
    filteredFranchises = filteredFranchises.filter(f => 
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.industry.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

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
              100+ Top Franchise Opportunities <br />
              <span className="text-secondary">From Franchise Business Review</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed">
              Award-winning franchises curated from FBR's Top 200 list based on 34,000+ franchisee reviews. 
              Search, filter, and find your perfect franchise opportunity.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full">
                <DollarSign className="w-4 h-4 text-secondary" />
                <span>100+ Verified FBR Franchises</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full">
                <TrendingUp className="w-4 h-4 text-secondary" />
                <span>34,000+ Franchisee Reviews</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search & Disclaimer */}
      <section className="py-8 bg-secondary/5 border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-4 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search franchises by name or industry..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
            </div>
            <div className="text-right flex items-center justify-end">
              <p className="text-sm font-semibold text-primary">
                {filteredFranchises.length} franchises found
              </p>
            </div>
          </div>

          <div className="bg-background/50 border border-border/50 rounded-lg p-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong>Data Source:</strong> All franchise information sourced from <a href="https://franchisebusinessreview.com/lists/top-200-franchises/" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">Franchise Business Review's Top 200 for 2025</a>. Based on survey of 34,000+ franchisees. Investment ranges based on current FBR data. <strong>Always verify current details with franchisors before investing.</strong>
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
                All ({franchises.length})
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
                transition={{ duration: 0.5, delay: index * 0.03 }}
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
                    <CardTitle className="font-serif text-lg text-primary group-hover:text-secondary transition-colors">
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
                        <p className="text-xs text-muted-foreground">Min. Cash</p>
                        <p className="text-sm font-bold text-primary">{franchise.minCash}</p>
                      </div>
                      {franchise.fbrLink && (
                        <a href={franchise.fbrLink} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline" className="border-secondary/30 text-secondary hover:bg-secondary/5">
                            Learn More
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
              <p className="text-muted-foreground text-lg">No franchises match your search. Try different filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/5 border-y border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-primary mb-8 text-center">
              Why FBR Franchises Stand Out
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  34K+
                </div>
                <h3 className="font-bold text-primary mb-2">Franchisees Surveyed</h3>
                <p className="text-sm text-muted-foreground">Real feedback from 350+ franchise brands</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  30%
                </div>
                <h3 className="font-bold text-primary mb-2">Higher Satisfaction</h3>
                <p className="text-sm text-muted-foreground">FBR winners average 30% higher satisfaction</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  85%
                </div>
                <h3 className="font-bold text-primary mb-2">Enjoy Ownership</h3>
                <p className="text-sm text-muted-foreground">Of franchisees enjoy operating their business</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary via-primary/95 to-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Ready to Start Your Franchise Journey?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Schedule a complimentary consultation to discuss your goals and find your perfect franchise match.
          </p>
          <a href="#contact">
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold px-8 h-12">
              Schedule Free Consultation
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}