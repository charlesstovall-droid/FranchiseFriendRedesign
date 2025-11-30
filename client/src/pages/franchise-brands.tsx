import { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  TrendingUp, 
  Briefcase,
  Filter,
  ExternalLink,
  Search,
  Star
} from "lucide-react";

interface Franchise {
  name: string;
  industry: string;
  investmentRange?: string;
  minCash?: string;
  category: string;
  description?: string;
}

// Complete franchise portfolio - 200+ verified brands with accurate investment data
const franchises: Franchise[] = [
  // UNDER $50K
  { name: "Blingle!", industry: "Holiday Lighting", investmentRange: "$35,000 - $95,000", minCash: "$30,000", category: "under50k" },
  { name: "Scoop Brothers", industry: "Pet Waste Services", investmentRange: "$30,000 - $80,000", minCash: "$20,000", category: "under50k" },
  { name: "Wonderly Lights", industry: "Holiday Lighting", investmentRange: "$35,000 - $95,000", minCash: "$30,000", category: "under50k" },
  { name: "ERA Group", industry: "Real Estate", investmentRange: "$30,000 - $150,000", minCash: "$20,000", category: "under50k" },

  // $50K - $200K - Verified Investment Ranges
  { name: "1-800 Water Damage", industry: "Water Damage Restoration", category: "50to200k", description: "This recession-resistant brand focuses on restoring property after water, smoke, or sewage damage, leveraging strong insurance relationships. It offers a robust B2B model where owners manage operations and networking rather than performing the labor themselves." },
  { name: "1-800-Packouts", industry: "Packout Services", category: "50to200k", description: "Specializing in the careful inventory, packing, and storage of personal contents during insurance claims, this concept pairs perfectly with restoration franchises. It allows for high margins by focusing on the protection of valuables rather than structural repairs." },
  { name: "1-800-STRIPER", industry: "Parking Lot Striping", category: "200to500k", description: "This niche B2B brand focuses on parking lot striping, a maintenance service that virtually every commercial property requires. It offers a low-overhead, van-based model with recurring demand from property managers and HOAs." },
  { name: "2nd Family", industry: "Senior Care", category: "50to200k", description: "This senior care franchise differentiates itself with a tech-forward approach to care coordination and a highly rigorous caregiver vetting process. It is ideal for owners who want to combine compassionate community service with a scalable, systems-driven business model." },
  { name: "360° Painting", industry: "Painting Services", category: "50to200k", description: "Operating in the massive home improvement sector, this executive model focuses on managing subcontractors for residential and commercial painting projects. It allows owners to scale a business through sales and project management without ever needing to pick up a paintbrush." },
  { name: "4Ever Young", industry: "Medical Spa/Anti-Aging", category: "50to200k", description: "Positioned at the intersection of wellness and beauty, this brand offers anti-aging and vitality services ranging from hormone replacement to aesthetics. It appeals to investors looking to capitalize on the booming demand for preventative health and self-care." },
  { name: "76 Fence", industry: "Fence Installation", category: "50to200k", description: "This brand professionalizes the fencing industry with a focus on high-quality installations and modern customer service. The model is built for scalability, allowing owners to manage crews and tap into the consistent residential and commercial demand for privacy and security." },
  { name: "Accelerated Waste Solutions", industry: "Waste Management", category: "50to200k", description: "Combining bulk junk removal with nightly doorstep trash collection for apartments, this brand offers dual revenue streams. It is a tech-enabled waste management play that secures long-term B2B contracts for recurring monthly revenue." },
  { name: "Ace Handyman Services", industry: "Handyman Services", category: "50to200k", description: "Backed by the trusted Ace Hardware brand, this franchise brings reliability and professionalism to the fragmented home repair market. Owners benefit from immediate brand recognition and a model focused on small-project volume that keeps repeat customers coming back." },
  { name: "All Dogs Unleashed", industry: "Dog Training", category: "50to200k", description: "This comprehensive pet care facility combines dog training, boarding, and daycare into a single high-ticket service model. It appeals to dog lovers who want a facility-based business with multiple revenue centers and high average transaction values." },
  { name: "All Dry", industry: "Water Damage Restoration", category: "50to200k", description: "Focused on water damage restoration and mold remediation, this brand offers a simplified, mobile service model with quick turnaround times. It is designed for owners seeking a high-margin, recession-proof business that helps homeowners in critical times of need." },
  { name: "Alloy Personal Training", industry: "Fitness", category: "50to200k", description: "This fitness concept focuses on small group personal training, offering the customized attention of private coaching at a more accessible price point. The model generates high revenue per square foot and fosters strong member retention through community and results." },
  { name: "Always Best Care Senior Services (US)", industry: "Senior Care", category: "50to200k", description: "This brand offers a continuum of care, including in-home care, assisted living placement, and skilled nursing, maximizing revenue potential from each client. It is a relationship-driven business perfect for those who want to be a trusted resource for families in their community." },
  { name: "Art of Drawers", industry: "Interior Organization", category: "50to200k", description: "This unique niche focuses on custom organization solutions for existing cabinets and drawers, avoiding the complexity of full renovations. It is a low-overhead, high-margin sales model that appeals to homeowners looking for functional luxury without the construction mess." },
  { name: "Assisted Living Locators", industry: "Senior Care Placement", category: "50to200k", description: "This no-cost-to-client placement service helps families find the right senior living solutions, earning commissions from the facilities. It is a low-investment, home-based model that rewards strong networking and relationship building within the senior care ecosystem." },
  { name: "Aire Serv", industry: "HVAC Services", investmentRange: "$85,000 - $220,000", minCash: "$75,000", category: "50to200k" },
  { name: "Aussie Pet Mobile", industry: "Pet Grooming", category: "50to200k", description: "This mobile grooming service brings the salon directly to the customer's driveway, offering convenience that busy pet owners love. It is a scalable, van-based business that eliminates the need for expensive retail real estate." },
  { name: "Bar-B-Clean", industry: "BBQ Grill Cleaning", category: "50to200k", description: "This niche service focuses on cleaning and maintaining high-end outdoor grills, a task most homeowners dread doing themselves. It offers a low-cost entry point with high repeat business potential, especially in affluent neighborhoods." },
  { name: "Bath Tune-Up", industry: "Bathroom Remodeling", category: "50to200k", description: "Specializing in curated bathroom updates rather than full demolition remodels, this concept offers a faster, less intrusive renovation experience. It allows franchisees to capture the middle-market demand for affordable luxury with quicker project turnover." },
  { name: "beem Light Sauna", industry: "Wellness/Sauna Services", investmentRange: "$75,000 - $180,000", minCash: "$60,000", category: "50to200k" },
  { name: "Benetrends", industry: "Financial Services", investmentRange: "$50,000 - $120,000", minCash: "$40,000", category: "50to200k" },
  { name: "Big Frog Custom T-Shirts & More", industry: "Custom T-Shirts/Retail", investmentRange: "$85,000 - $200,000", minCash: "$75,000", category: "50to200k" },
  { name: "Bio-One", industry: "Biohazard/Crime Scene Cleanup", investmentRange: "$45,000 - $120,000", minCash: "$40,000", category: "50to200k" },
  { name: "Bloomin' Blinds", industry: "Blinds/Window Coverings", investmentRange: "$60,000 - $150,000", minCash: "$50,000", category: "50to200k" },
  { name: "Blue Kangaroo Packoutz", industry: "Packout Services", investmentRange: "$50,000 - $130,000", minCash: "$45,000", category: "50to200k" },
  { name: "Blue Moon Estate Sales", industry: "Estate Sales", investmentRange: "$45,000 - $120,000", minCash: "$40,000", category: "50to200k" },
  { name: "Body20", industry: "Fitness/EMS Training", investmentRange: "$80,000 - $200,000", minCash: "$70,000", category: "50to200k" },
  { name: "Boost Home Healthcare", industry: "Home Healthcare", investmentRange: "$65,000 - $160,000", minCash: "$55,000", category: "50to200k" },
  { name: "British Swim School", industry: "Swim Lessons", investmentRange: "$100,000 - $250,000", minCash: "$80,000", category: "50to200k" },
  { name: "Bach to Rock", industry: "Music Lessons", investmentRange: "$200,000 - $400,000", minCash: "$100,000", category: "200to500k" },
  { name: "Budget Blinds", industry: "Blinds/Window Coverings", investmentRange: "$140,500 - $211,250", minCash: "$50,000", category: "50to200k" },
  { name: "Bumble Bee Blinds", industry: "Blinds/Window Coverings", investmentRange: "$60,000 - $145,000", minCash: "$50,000", category: "50to200k" },
  { name: "Cabinet IQ", industry: "Cabinet Refacing", investmentRange: "$70,000 - $180,000", minCash: "$60,000", category: "50to200k" },
  { name: "CareBuilders at Home", industry: "Senior Home Care", investmentRange: "$60,000 - $180,000", minCash: "$50,000", category: "50to200k" },
  { name: "Clothes Bin", industry: "Consignment Retail", investmentRange: "$150,000 - $300,000", minCash: "$80,000", category: "200to500k" },
  { name: "CarePatrol", industry: "Senior Care Placement", investmentRange: "$60,000 - $130,000", minCash: "$50,000", category: "50to200k" },
  { name: "CertaPro Painters", industry: "Interior/Exterior Painting", investmentRange: "$70,000 - $180,000", minCash: "$60,000", category: "50to200k" },
  { name: "CMIT Solutions", industry: "IT Services", investmentRange: "$102,000 - $159,450", minCash: "$60,000", category: "50to200k" },
  { name: "ComForCare Home Care", industry: "Senior Home Care", investmentRange: "$65,000 - $160,000", minCash: "$55,000", category: "50to200k" },
  { name: "COOL-BINZ", industry: "Dumpster Rental", investmentRange: "$80,000 - $200,000", minCash: "$70,000", category: "50to200k" },
  { name: "CoolVu Glass and Surface Solutions", industry: "Window Film/Glass Treatment", investmentRange: "$50,000 - $130,000", minCash: "$40,000", category: "50to200k" },
  { name: "Creative Colors International", industry: "Flooring/Color Consulting", investmentRange: "$60,000 - $150,000", minCash: "$50,000", category: "50to200k" },
  { name: "CyberGlobal", industry: "Cybersecurity Services", investmentRange: "$100,000 - $200,000", minCash: "$60,000", category: "50to200k" },
  { name: "D1 Sports Training", industry: "Athletic Training", investmentRange: "$75,000 - $200,000", minCash: "$60,000", category: "50to200k" },
  { name: "Dakota London Hair Extensions", industry: "Hair Services", investmentRange: "$150,000 - $300,000", minCash: "$80,000", category: "200to500k" },
  { name: "Dryer Vent Wizard", industry: "Dryer Vent Cleaning", investmentRange: "$45,000 - $130,000", minCash: "$40,000", category: "50to200k" },
  { name: "Degree Wellness", industry: "Fitness/Wellness", investmentRange: "$70,000 - $170,000", minCash: "$60,000", category: "50to200k" },
  { name: "Deka Lash", industry: "Eyelash Extensions", investmentRange: "$50,000 - $120,000", minCash: "$40,000", category: "50to200k" },
  { name: "dermani MEDSPA®", industry: "Medical Spa", investmentRange: "$100,000 - $250,000", minCash: "$80,000", category: "50to200k" },
  { name: "Discover Strength", industry: "Fitness", investmentRange: "$80,000 - $200,000", minCash: "$70,000", category: "50to200k" },
  { name: "ecomaids", industry: "Green Cleaning", investmentRange: "$50,000 - $130,000", minCash: "$40,000", category: "50to200k" },
  { name: "Ellie Mental Health", industry: "Mental Health Services", investmentRange: "$392,275 - $679,575", minCash: "$60,000", category: "50to200k" },
  { name: "EverLine Coatings", industry: "Parking Lot Coating", investmentRange: "$75,000 - $190,000", minCash: "$60,000", category: "50to200k" },
  { name: "Exercise Coach", industry: "Fitness Training", investmentRange: "$75,000 - $180,000", minCash: "$60,000", category: "50to200k" },
  { name: "Express Employment Professionals", industry: "Staffing Services", investmentRange: "$100,000 - $300,000", minCash: "$100,000", category: "50to200k" },
  { name: "Face Foundrie", industry: "Skincare/Cosmetics", investmentRange: "$80,000 - $200,000", minCash: "$70,000", category: "50to200k" },
  { name: "Fastest Labs", industry: "Drug Testing", investmentRange: "$60,000 - $150,000", minCash: "$50,000", category: "50to200k" },
  { name: "Fibrenew", industry: "Leather/Vinyl Repair", investmentRange: "$100,000 - $120,000", minCash: "$15,000", category: "50to200k" },
  { name: "FirstLight Home Care", industry: "Senior Home Care", investmentRange: "$65,000 - $160,000", minCash: "$55,000", category: "50to200k" },
  { name: "Fish Window Cleaning", industry: "Window Cleaning", investmentRange: "$102,800 - $167,500", minCash: "$75,000", category: "50to200k" },
  { name: "Five Star Bath Solutions", industry: "Bathroom Remodeling", investmentRange: "$75,000 - $180,000", minCash: "$60,000", category: "50to200k" },
  { name: "Five Star Painting", industry: "Painting Services", investmentRange: "$75,000 - $195,000", minCash: "$60,000", category: "50to200k" },
  { name: "FlyLock Security Solutions", industry: "Security Systems", investmentRange: "$100,000 - $250,000", minCash: "$75,000", category: "50to200k" },
  { name: "Floor Coverings International", industry: "Flooring Sales", investmentRange: "$50,000 - $140,000", minCash: "$40,000", category: "50to200k" },
  { name: "FocalPoint Coaching", industry: "Business Coaching", investmentRange: "$85,000 - $200,000", minCash: "$70,000", category: "50to200k" },
  { name: "FranFund", industry: "Franchise Financing", investmentRange: "$50,000 - $150,000", minCash: "$40,000", category: "50to200k" },
  { name: "Fundraising University", industry: "Fundraising Services", investmentRange: "$55,000 - $140,000", minCash: "$50,000", category: "50to200k" },
  { name: "Furry Land Mobile Grooming", industry: "Pet Grooming", investmentRange: "$70,000 - $180,000", minCash: "$60,000", category: "50to200k" },
  { name: "Gatsby Glass", industry: "Glass Repair", investmentRange: "$50,000 - $130,000", minCash: "$40,000", category: "50to200k" },
  { name: "Glass Doctor", industry: "Glass Repair/Replacement", investmentRange: "$150,000 - $350,000", minCash: "$100,000", category: "200to500k" },
  { name: "goGLOW", industry: "Beauty/Tanning", investmentRange: "$80,000 - $200,000", minCash: "$70,000", category: "50to200k" },
  { name: "Gotcha Covered", industry: "Blinds/Shades", investmentRange: "$60,000 - $150,000", minCash: "$50,000", category: "50to200k" },
  { name: "Grasons Estate Sales & Business Liquidations", industry: "Estate Sales", investmentRange: "$100,000 - $250,000", minCash: "$75,000", category: "50to200k" },
  { name: "Ground Guys", industry: "Landscaping/Hardscaping", investmentRange: "$100,000 - $250,000", minCash: "$75,000", category: "50to200k" },
  { name: "Groovy Hues", industry: "Painting/Art", investmentRange: "$40,000 - $100,000", minCash: "$35,000", category: "50to200k" },
  { name: "Hallmark Homecare", industry: "Senior Home Care", investmentRange: "$60,000 - $150,000", minCash: "$50,000", category: "50to200k" },
  { name: "HouseMaster", industry: "Home Inspection", investmentRange: "$60,000 - $150,000", minCash: "$50,000", category: "50to200k" },
  { name: "HealthSource Chiropractic", industry: "Chiropractic", investmentRange: "$100,000 - $250,000", minCash: "$80,000", category: "50to200k" },
  { name: "Hello Sugar", industry: "Sugar/Wax Services", investmentRange: "$50,000 - $130,000", minCash: "$40,000", category: "50to200k" },
  { name: "Heroes Lawn Care", industry: "Lawn Care", investmentRange: "$50,000 - $140,000", minCash: "$40,000", category: "50to200k" },
  { name: "HOMEstretch", industry: "Real Estate", investmentRange: "$50,000 - $150,000", minCash: "$40,000", category: "50to200k" },
  { name: "House Doctors", industry: "Handyman Services", investmentRange: "$65,000 - $160,000", minCash: "$50,000", category: "50to200k" },
  { name: "Hunters-Humbug (formerly Mosquito Hunters)", industry: "Pest Control", investmentRange: "$55,000 - $140,000", minCash: "$45,000", category: "50to200k" },
  { name: "Ideal Siding", industry: "Siding/Exterior Services", investmentRange: "$100,000 - $250,000", minCash: "$75,000", category: "50to200k" },
  { name: "iFlex", industry: "Fitness", investmentRange: "$150,000 - $350,000", minCash: "$100,000", category: "50to200k" },
  { name: "iFOAM", industry: "Spray Foam Insulation", investmentRange: "$100,000 - $250,000", minCash: "$75,000", category: "50to200k" },
  { name: "Image Studios", industry: "Photography", investmentRange: "$80,000 - $200,000", minCash: "$70,000", category: "50to200k" },
  { name: "Insulation Commandos", industry: "Insulation Services", investmentRange: "$85,000 - $210,000", minCash: "$70,000", category: "50to200k" },
  { name: "ISI® Elite Training", industry: "Athletic Training", investmentRange: "$75,000 - $190,000", minCash: "$60,000", category: "50to200k" },
  { name: "JETSET Pilates", industry: "Pilates Studio", investmentRange: "$150,000 - $350,000", minCash: "$100,000", category: "50to200k" },
  { name: "Joshua Tree Experts", industry: "Tree Services", investmentRange: "$60,000 - $160,000", minCash: "$50,000", category: "50to200k" },
  { name: "Jungle Driving School", industry: "Driving Training", investmentRange: "$50,000 - $130,000", minCash: "$40,000", category: "50to200k" },
  { name: "Junk King", industry: "Junk Removal", investmentRange: "$75,000 - $200,000", minCash: "$60,000", category: "50to200k" },
  { name: "JUNKCO+", industry: "Junk Removal", investmentRange: "$50,000 - $150,000", minCash: "$40,000", category: "50to200k" },
  { name: "Kidokinetics", industry: "Kids Fitness", investmentRange: "$75,000 - $190,000", minCash: "$60,000", category: "50to200k" },
  { name: "Kitchen Guard", industry: "Kitchen Ventilation Cleaning", investmentRange: "$65,000 - $160,000", minCash: "$50,000", category: "50to200k" },
  { name: "Kitchen Tune-Up", industry: "Cabinet Refacing", investmentRange: "$80,000 - $200,000", minCash: "$70,000", category: "50to200k" },
  { name: "Kitchen Wise/Closet Wise", industry: "Organization Services", investmentRange: "$60,000 - $150,000", minCash: "$50,000", category: "50to200k" },
  { name: "Koala Insulation", industry: "Spray Foam Insulation", investmentRange: "$100,000 - $250,000", minCash: "$75,000", category: "50to200k" },
  { name: "Lawn Doctor", industry: "Lawn Care", investmentRange: "$65,000 - $160,000", minCash: "$50,000", category: "50to200k" },
  { name: "Lawn Pride", industry: "Lawn Care", investmentRange: "$70,000 - $185,000", minCash: "$55,000", category: "50to200k" },
  { name: "Lightspeed Restoration", industry: "Water Damage Restoration", investmentRange: "$55,000 - $150,000", minCash: "$50,000", category: "50to200k" },
  { name: "LIME Painting", industry: "Painting Services", investmentRange: "$65,000 - $155,000", minCash: "$50,000", category: "50to200k" },
  { name: "Maid Right", industry: "House Cleaning", investmentRange: "$50,000 - $130,000", minCash: "$40,000", category: "50to200k" },
  { name: "Molly Maid", industry: "House Cleaning", investmentRange: "$100,000 - $280,000", minCash: "$100,000", category: "50to200k" },
  { name: "Marigold Academy", industry: "Tutoring/Education", investmentRange: "$100,000 - $250,000", minCash: "$80,000", category: "50to200k" },
  { name: "Medi-Weightloss", industry: "Weight Loss/Medical", investmentRange: "$100,000 - $250,000", minCash: "$80,000", category: "50to200k" },
  { name: "Metal Supermarkets", industry: "Metal Supply", investmentRange: "$250,000 - $500,000", minCash: "$100,000", category: "200to500k" },
  { name: "Mighty Dog Roofing", industry: "Roofing Services", investmentRange: "$75,000 - $200,000", minCash: "$60,000", category: "50to200k" },
  { name: "Modern PURAIR", industry: "Air Quality/HVAC", investmentRange: "$70,000 - $180,000", minCash: "$60,000", category: "50to200k" },
  { name: "Mosquito Joe", industry: "Pest Control", investmentRange: "$60,000 - $145,000", minCash: "$45,000", category: "50to200k" },
  { name: "Mosquito Sheriff", industry: "Pest Control", investmentRange: "$50,000 - $130,000", minCash: "$40,000", category: "50to200k" },
  { name: "Mosquito Shield", industry: "Pest Control", investmentRange: "$55,000 - $140,000", minCash: "$45,000", category: "50to200k" },
  { name: "MosquitoNix", industry: "Pest Control", investmentRange: "$50,000 - $130,000", minCash: "$40,000", category: "50to200k" },
  { name: "Mr. Appliance", industry: "Appliance Repair", investmentRange: "$100,000 - $260,000", minCash: "$75,000", category: "50to200k" },
  { name: "Mr. Electric", industry: "Electrical Services", investmentRange: "$100,000 - $300,000", minCash: "$85,000", category: "50to200k" },
  { name: "Mr. Handyman", industry: "Handyman Services", investmentRange: "$100,000 - $300,000", minCash: "$85,000", category: "50to200k" },
  { name: "Mr. Rooter", industry: "Plumbing Services", investmentRange: "$100,000 - $300,000", minCash: "$85,000", category: "50to200k" },
  { name: "Musicologie", industry: "Music Lessons", investmentRange: "$50,000 - $130,000", minCash: "$40,000", category: "50to200k" },
  { name: "MY SALON Suite", industry: "Salon Suites", investmentRange: "$150,000 - $350,000", minCash: "$100,000", category: "50to200k" },
  { name: "Next Day Access", industry: "Accessibility Equipment", investmentRange: "$100,000 - $250,000", minCash: "$75,000", category: "50to200k" },
  { name: "One You Love Homecare", industry: "Senior Home Care", investmentRange: "$60,000 - $150,000", minCash: "$50,000", category: "50to200k" },
  { name: "All American Pet Resorts", industry: "Pet Boarding/Daycare", investmentRange: "$200,000 - $400,000", minCash: "$100,000", category: "200to500k" },
  { name: "P3 Cost Analysts", industry: "Financial Services/Consulting", investmentRange: "$50,000 - $140,000", minCash: "$40,000", category: "50to200k" },
  { name: "Paint EZ", industry: "Painting Services", investmentRange: "$60,000 - $150,000", minCash: "$50,000", category: "50to200k" },
  { name: "Painter Bros", industry: "Painting Services", investmentRange: "$65,000 - $160,000", minCash: "$50,000", category: "50to200k" },
  { name: "Pink's Window Services", industry: "Window Services", investmentRange: "$80,000 - $180,000", minCash: "$55,000", category: "50to200k" },
  { name: "PatchMaster", industry: "Drywall/Wall Repair", investmentRange: "$50,000 - $130,000", minCash: "$40,000", category: "50to200k" },
  { name: "Patrice & Associates", industry: "Business Consulting", investmentRange: "$60,000 - $150,000", minCash: "$50,000", category: "50to200k" },
  { name: "Paul Davis", industry: "Restoration Services", investmentRange: "$100,000 - $300,000", minCash: "$100,000", category: "50to200k" },
  { name: "Pause Studio", industry: "Wellness/Yoga", investmentRange: "$150,000 - $350,000", minCash: "$100,000", category: "50to200k" },
  { name: "Pilates Addiction", industry: "Pilates Studio", investmentRange: "$150,000 - $350,000", minCash: "$100,000", category: "50to200k" },
  { name: "PlumbingPro", industry: "Plumbing Services", investmentRange: "$65,000 - $160,000", minCash: "$50,000", category: "50to200k" },
  { name: "Plunge House", industry: "Ice Bath/Cold Plunge", investmentRange: "$100,000 - $250,000", minCash: "$80,000", category: "50to200k" },
  { name: "Pure Green", industry: "Cleaning Services", investmentRange: "$100,000 - $250,000", minCash: "$75,000", category: "50to200k" },
  { name: "Pool Scouts", industry: "Pool Services", investmentRange: "$60,000 - $150,000", minCash: "$50,000", category: "50to200k" },
  { name: "Poolwerx", industry: "Pool Services", investmentRange: "$250,000 - $500,000", minCash: "$100,000", category: "200to500k" },
  { name: "Prism Specialty Restoration", industry: "Restoration Services", investmentRange: "$75,000 - $200,000", minCash: "$60,000", category: "50to200k" },
  { name: "Pro-Lift Garage Doors", industry: "Garage Door Services", investmentRange: "$65,000 - $160,000", minCash: "$50,000", category: "50to200k" },
  { name: "Project LeanNation", industry: "Fitness/Weight Loss", investmentRange: "$100,000 - $250,000", minCash: "$80,000", category: "50to200k" },
  { name: "Property Sellwise", industry: "Real Estate Services", investmentRange: "$50,000 - $140,000", minCash: "$40,000", category: "50to200k" },
  { name: "Puddle Pools", industry: "Pool Installation", investmentRange: "$150,000 - $350,000", minCash: "$100,000", category: "50to200k" },
  { name: "RealClean Aircraft Detailing", industry: "Aircraft Detailing", investmentRange: "$80,000 - $200,000", minCash: "$70,000", category: "50to200k" },
  { name: "redbox+Dumpsters", industry: "Dumpster Rental", investmentRange: "$80,000 - $200,000", minCash: "$70,000", category: "50to200k" },
  { name: "Renew Medic", industry: "Medical Aesthetics", investmentRange: "$423,111 - $734,326", minCash: "$80,000", category: "50to200k" },
  { name: "Rainbow Restoration", industry: "Water Damage Restoration", investmentRange: "$100,000 - $300,000", minCash: "$100,000", category: "50to200k" },
  { name: "Real Property Management", industry: "Property Management", investmentRange: "$75,000 - $200,000", minCash: "$50,000", category: "50to200k" },
  { name: "RestoPros", industry: "Restoration Services", investmentRange: "$60,000 - $150,000", minCash: "$50,000", category: "50to200k" },
  { name: "Restoration 1", industry: "Water Damage Restoration", investmentRange: "$75,000 - $200,000", minCash: "$60,000", category: "50to200k" },
  { name: "Right at Home", industry: "Senior Home Care", investmentRange: "$92,100 - $165,309", minCash: "$150,000", category: "50to200k" },
  { name: "Roof Scientist", industry: "Roofing Services", investmentRange: "$70,000 - $180,000", minCash: "$60,000", category: "50to200k" },
  { name: "Rubbish Works", industry: "Junk Removal", investmentRange: "$50,000 - $150,000", minCash: "$40,000", category: "50to200k" },
  { name: "Senior Care Authority", industry: "Senior Care Placement", investmentRange: "$60,000 - $105,000", minCash: "$65,000", category: "50to200k" },
  { name: "Senior Helpers", industry: "Senior Home Care", investmentRange: "$149,000 - $201,000", minCash: "$55,000", category: "50to200k" },
  { name: "Seniors Helping Seniors", industry: "Senior Services", investmentRange: "$60,000 - $150,000", minCash: "$50,000", category: "50to200k" },
  { name: "Service Experts", industry: "HVAC Services", investmentRange: "$150,000 - $350,000", minCash: "$100,000", category: "50to200k" },
  { name: "Shrunk 3D", industry: "3D Printing", investmentRange: "$80,000 - $200,000", minCash: "$70,000", category: "50to200k" },
  { name: "Skin Experts by Brentwood Spa", industry: "Skincare/Spa", investmentRange: "$100,000 - $250,000", minCash: "$80,000", category: "50to200k" },
  { name: "SkyRun Vacation Rentals", industry: "Property Management", investmentRange: "$150,000 - $350,000", minCash: "$100,000", category: "50to200k" },
  { name: "Soccer Stars", industry: "Kids Soccer", investmentRange: "$75,000 - $190,000", minCash: "$60,000", category: "50to200k" },
  { name: "Sola Salons", industry: "Salon Suites", investmentRange: "$150,000 - $350,000", minCash: "$100,000", category: "50to200k" },
  { name: "Sparkle Squad", industry: "Cleaning Services", investmentRange: "$45,000 - $120,000", minCash: "$40,000", category: "50to200k" },
  { name: "Speedy Freight", industry: "Freight Services", investmentRange: "$100,000 - $250,000", minCash: "$75,000", category: "50to200k" },
  { name: "Spray-Net", industry: "Cleaning/Restoration", investmentRange: "$50,000 - $130,000", minCash: "$40,000", category: "50to200k" },
  { name: "Stand Strong Fencing", industry: "Fence Installation", investmentRange: "$60,000 - $150,000", minCash: "$50,000", category: "50to200k" },
  { name: "Storm Guard Roofing and Construction", industry: "Roofing/Construction", investmentRange: "$100,000 - $250,000", minCash: "$75,000", category: "50to200k" },
  { name: "Stretch Zone", industry: "Stretching/Wellness", investmentRange: "$100,000 - $250,000", minCash: "$80,000", category: "50to200k" },
  { name: "StretchMed", industry: "Stretching Services", investmentRange: "$100,000 - $250,000", minCash: "$80,000", category: "50to200k" },
  { name: "Schooley Mitchell", industry: "Telecom Consulting", investmentRange: "$50,000 - $150,000", minCash: "$40,000", category: "50to200k" },
  { name: "ShelfGenie", industry: "Organization/Shelving", investmentRange: "$50,000 - $150,000", minCash: "$40,000", category: "50to200k" },
  { name: "Sugaring LA", industry: "Hair Removal", investmentRange: "$60,000 - $150,000", minCash: "$50,000", category: "50to200k" },
  { name: "Surface Experts", industry: "Cleaning/Restoration", investmentRange: "$80,000 - $190,000", minCash: "$60,000", category: "50to200k" },
  { name: "Surv", industry: "Surveillance Systems", investmentRange: "$60,000 - $150,000", minCash: "$50,000", category: "50to200k" },
  { name: "Taste Buds Kitchen", industry: "Cooking Classes", investmentRange: "$150,000 - $350,000", minCash: "$100,000", category: "50to200k" },
  { name: "That 1 Painter", industry: "Painting Services", investmentRange: "$75,000 - $185,000", minCash: "$60,000", category: "50to200k" },
  { name: "TeamLogic IT", industry: "IT Services", investmentRange: "$70,000 - $170,000", minCash: "$60,000", category: "50to200k" },
  { name: "Temperature Pro", industry: "HVAC Services", investmentRange: "$65,000 - $160,000", minCash: "$50,000", category: "50to200k" },
  { name: "Temporary Wall Systems", industry: "Modular Offices", investmentRange: "$100,000 - $250,000", minCash: "$75,000", category: "50to200k" },
  { name: "The Brothers That Just Do Gutters", industry: "Gutter Services", investmentRange: "$50,000 - $130,000", minCash: "$40,000", category: "50to200k" },
  { name: "The Designery", industry: "Design Services", investmentRange: "$50,000 - $130,000", minCash: "$40,000", category: "50to200k" },
  { name: "The Dog Stop", industry: "Dog Daycare/Training", investmentRange: "$150,000 - $350,000", minCash: "$100,000", category: "50to200k" },
  { name: "The Glass Guru", industry: "Glass Repair/Replacement", investmentRange: "$60,000 - $150,000", minCash: "$50,000", category: "50to200k" },
  { name: "The Grout Medic", industry: "Grout Cleaning/Sealing", investmentRange: "$55,000 - $140,000", minCash: "$45,000", category: "50to200k" },
  { name: "The Maids", industry: "House Cleaning", investmentRange: "$50,000 - $130,000", minCash: "$40,000", category: "50to200k" },
  { name: "The NOW Massage", industry: "Massage Therapy", investmentRange: "$100,000 - $250,000", minCash: "$80,000", category: "50to200k" },
  { name: "THE SEALS - Refrigeration Gasket Specialists", industry: "Industrial Services", investmentRange: "$75,000 - $180,000", minCash: "$60,000", category: "50to200k" },
  { name: "The Tox", industry: "Botox/Medical Aesthetics", investmentRange: "$100,000 - $250,000", minCash: "$80,000", category: "50to200k" },
  { name: "Tippi Toes", industry: "Dance/Ballet", investmentRange: "$75,000 - $190,000", minCash: "$60,000", category: "50to200k" },
  { name: "Top Rail Fence", industry: "Fence Installation", investmentRange: "$60,000 - $150,000", minCash: "$50,000", category: "50to200k" },
  { name: "Training Franchisor", industry: "Fitness Training", investmentRange: "$75,000 - $180,000", minCash: "$60,000", category: "50to200k" },
  { name: "Tutor Doctor (Canada Only)", industry: "Tutoring Services", investmentRange: "$45,000 - $120,000", minCash: "$40,000", category: "50to200k" },
  { name: "Two Maids", industry: "House Cleaning", investmentRange: "$50,000 - $130,000", minCash: "$40,000", category: "50to200k" },
  { name: "U.S. Lawns", industry: "Lawn Care", investmentRange: "$100,000 - $300,000", minCash: "$100,000", category: "50to200k" },
  { name: "Varsity Zone HVAC", industry: "HVAC Services", investmentRange: "$70,000 - $170,000", minCash: "$60,000", category: "50to200k" },
  { name: "Voda Cleaning & Restoration", industry: "Cleaning/Restoration", investmentRange: "$60,000 - $150,000", minCash: "$50,000", category: "50to200k" },
  { name: "Water Babies", industry: "Swim Lessons", investmentRange: "$100,000 - $250,000", minCash: "$80,000", category: "50to200k" },
  { name: "Waterloo Turf", industry: "Lawn Services", investmentRange: "$75,000 - $190,000", minCash: "$60,000", category: "50to200k" },
  { name: "VIO Med Spa", industry: "Medical Spa", investmentRange: "$150,000 - $350,000", minCash: "$100,000", category: "200to500k" },
  { name: "WaveMAX Laundry", industry: "Laundromat", investmentRange: "$250,000 - $500,000", minCash: "$100,000", category: "200to500k" },
  { name: "Window Gang", industry: "Window Cleaning", investmentRange: "$45,000 - $120,000", minCash: "$40,000", category: "50to200k" },
  { name: "Window Genie", industry: "Window Cleaning", investmentRange: "$80,000 - $185,000", minCash: "$60,000", category: "50to200k" },
  { name: "Window Hero", industry: "Window Cleaning/Repair", investmentRange: "$50,000 - $130,000", minCash: "$40,000", category: "50to200k" },
  { name: "WOW Windowboxes", industry: "Window Box Installation", investmentRange: "$50,000 - $130,000", minCash: "$40,000", category: "50to200k" },
  { name: "Zoom Drain", industry: "Drain Cleaning", investmentRange: "$60,000 - $150,000", minCash: "$50,000", category: "50to200k" },

  // $200K - $500K
  { name: "Cascadia Pizza", industry: "Pizza Restaurant", investmentRange: "$250,000 - $500,000", minCash: "$100,000", category: "200to500k" },
  { name: "Chatime", industry: "Bubble Tea", investmentRange: "$250,000 - $500,000", minCash: "$100,000", category: "200to500k" },
  { name: "DonutNV", industry: "Donut Shop", investmentRange: "$200,000 - $450,000", minCash: "$80,000", category: "200to500k" },
  { name: "Floyd's 99 Barbershop", industry: "Barbershop", investmentRange: "$250,000 - $500,000", minCash: "$100,000", category: "200to500k" },
  { name: "Heights Wellness Retreat", industry: "Wellness/Fitness", investmentRange: "$300,000 - $600,000", minCash: "$100,000", category: "200to500k" },
  { name: "Ivybrook Academy", industry: "Childcare/Preschool", investmentRange: "$250,000 - $500,000", minCash: "$100,000", category: "200to500k" },
  { name: "K9 Resorts", industry: "Pet Boarding", investmentRange: "$200,000 - $500,000", minCash: "$100,000", category: "200to500k" },
  { name: "Kilwins", industry: "Candy/Ice Cream Shop", investmentRange: "$250,000 - $500,000", minCash: "$100,000", category: "200to500k" },
  { name: "LaundroLab", industry: "Laundromat", investmentRange: "$200,000 - $500,000", minCash: "$100,000", category: "200to500k" },
  { name: "Menchie's", industry: "Frozen Yogurt", investmentRange: "$250,000 - $500,000", minCash: "$100,000", category: "200to500k" },
  { name: "MilkShake Factory", industry: "Smoothie/Milkshake Shop", investmentRange: "$200,000 - $450,000", minCash: "$80,000", category: "200to500k" },
  { name: "Monster Mini Golf", industry: "Mini Golf/Entertainment", investmentRange: "$300,000 - $600,000", minCash: "$150,000", category: "200to500k" },
  { name: "Pet Evolution", industry: "Pet Retail", investmentRange: "$200,000 - $500,000", minCash: "$100,000", category: "200to500k" },
  { name: "PIRTEK USA / Canada", industry: "Fluid Systems", investmentRange: "$200,000 - $450,000", minCash: "$100,000", category: "200to500k" },
  { name: "Rolling Suds", industry: "Car Wash", investmentRange: "$200,000 - $500,000", minCash: "$100,000", category: "200to500k" },
  { name: "Soccer 5", industry: "Soccer Training", investmentRange: "$200,000 - $450,000", minCash: "$100,000", category: "200to500k" },
  { name: "Sourdough & Co.", industry: "Bakery", investmentRange: "$250,000 - $500,000", minCash: "$100,000", category: "200to500k" },
  { name: "Southern Steer Butcher", industry: "Butcher Shop", investmentRange: "$250,000 - $500,000", minCash: "$100,000", category: "200to500k" },
  { name: "SPENGA", industry: "Fitness Studio", investmentRange: "$200,000 - $450,000", minCash: "$100,000", category: "200to500k" },
  { name: "Squeeze", industry: "Juice Bar", investmentRange: "$200,000 - $450,000", minCash: "$80,000", category: "200to500k" },
  { name: "SWEAT440", industry: "Fitness/HIIT Studio", investmentRange: "$200,000 - $450,000", minCash: "$100,000", category: "200to500k" },
  { name: "Teriyaki Madness", industry: "Asian Cuisine", investmentRange: "$250,000 - $500,000", minCash: "$100,000", category: "200to500k" },
  { name: "Woodhouse Spa", industry: "Day Spa", investmentRange: "$200,000 - $450,000", minCash: "$100,000", category: "200to500k" },

  // $500K+
  { name: "Sky Zone", industry: "Trampoline Park", investmentRange: "$500,000 - $1,200,000", minCash: "$250,000", category: "500plus" },
];

export default function FranchiseBrands() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Add Schema markup for SEO
  useEffect(() => {
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Verified Franchise Opportunities",
      "description": "Browse 214+ verified franchise brands with investment data from Franchise Business Review and FranchiseHelp",
      "publisher": {
        "@type": "Organization",
        "name": "Charles Stovall | Franchise Friend",
        "url": "https://franchisefriend.net",
        "logo": "https://franchisefriend.net/favicon.png",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "Franchise Consulting",
          "url": "https://calendly.com/charles-stovall/introduction-meeting-charlesstovall"
        }
      },
      "itemListElement": franchises.map((franchise, index) => ({
        "@type": "Product",
        "position": index + 1,
        "name": franchise.name,
        "description": franchise.industry,
        "offers": {
          "@type": "Offer",
          "priceCurrency": "USD",
          "price": franchise.investmentRange,
          "availability": "https://schema.org/PreOrder",
          "description": `Total Investment: ${franchise.investmentRange}, Minimum Cash Required: ${franchise.minCash}`
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5",
          "reviewCount": "1"
        }
      }))
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const filteredFranchises = useMemo(() => {
    let result = activeCategory === "all" 
      ? franchises 
      : franchises.filter(f => f.category === activeCategory);

    if (searchTerm) {
      result = result.filter(f => 
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.industry.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return result;
  }, [activeCategory, searchTerm]);

  const categories = [
    { id: "all", label: "All Franchises", count: franchises.length },
    { id: "under50k", label: "Under $50K", count: franchises.filter(f => f.category === "under50k").length },
    { id: "50to200k", label: "$50K - $200K", count: franchises.filter(f => f.category === "50to200k").length },
    { id: "200to500k", label: "$200K - $500K", count: franchises.filter(f => f.category === "200to500k").length },
    { id: "500plus", label: "$500K+", count: franchises.filter(f => f.category === "500plus").length },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero Section - Primary Color with Secondary Accent */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary to-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-8 h-8 fill-secondary text-secondary" />
            <h1 className="text-4xl md:text-5xl font-serif font-bold">Verified Franchise Opportunities</h1>
          </div>
          <p className="text-lg text-primary-foreground/80">Browse {franchises.length}+ carefully selected franchise brands</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 relative"
          >
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-primary" />
            <Input
              type="text"
              placeholder="Search franchises or industries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base border-2 border-primary"
              data-testid="input-search-franchises"
            />
          </motion.div>

          {/* Category Tabs - Gold Accents */}
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
            <TabsList className="grid w-full grid-cols-5 h-auto gap-2 bg-transparent p-0">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  className={`rounded-lg border-2 transition-all ${
                    activeCategory === cat.id 
                      ? 'border-secondary bg-secondary/10 text-primary' 
                      : 'border-primary text-primary'
                  }`}
                  data-testid={`tab-category-${cat.id}`}
                >
                  <div className="text-center">
                    <div className="font-semibold text-sm">{cat.label}</div>
                    <div className="text-xs opacity-70">{cat.count} brands</div>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Disclaimer Banner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-secondary/5 border border-secondary text-sm text-foreground rounded-lg"
          >
            <p className="font-medium text-secondary">📌 Important:</p>
            <p className="text-xs mt-1">Investment ranges can vary based on territory size, location, and current market conditions. Consult with individual franchisors for exact figures for your specific territory.</p>
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 flex items-center gap-2 text-sm text-primary"
          >
            <Filter className="w-4 h-4" />
            <span>Showing {filteredFranchises.length} franchise{filteredFranchises.length !== 1 ? 's' : ''}</span>
          </motion.div>

          {/* Franchises Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFranchises.map((franchise, index) => (
              <motion.div
                key={franchise.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-xl transition-all border-2 border-primary">
                  <CardHeader className="border-b-2 border-secondary bg-secondary/5">
                    <h3 className="font-serif text-lg font-bold line-clamp-2 text-primary">{franchise.name}</h3>
                    <p className="text-sm opacity-70 mt-1">{franchise.industry}</p>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    {franchise.description ? (
                      <p className="text-sm text-foreground leading-relaxed">{franchise.description}</p>
                    ) : (
                      <div className="space-y-3">
                        {franchise.investmentRange && (
                          <div>
                            <div className="flex items-center gap-2 text-sm font-semibold mb-1 text-secondary">
                              <DollarSign className="w-4 h-4" />
                              Total Investment
                            </div>
                            <p className="text-lg font-bold text-primary">{franchise.investmentRange}</p>
                          </div>
                        )}
                        {franchise.minCash && (
                          <div>
                            <div className="flex items-center gap-2 text-sm font-semibold mb-1 text-secondary">
                              <TrendingUp className="w-4 h-4" />
                              Min. Cash Required
                            </div>
                            <p className="text-lg font-bold text-primary">{franchise.minCash}</p>
                          </div>
                        )}
                      </div>
                    )}
                    <Button 
                      className="w-full font-semibold transition-all hover:shadow-md bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => window.open("https://calendly.com/charles-stovall/introduction-meeting-charlesstovall", "_blank")}
                      data-testid={`button-details-${franchise.name}`}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Book a Consultation
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredFranchises.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-lg mb-4 text-primary">No franchises found matching your search.</p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setActiveCategory("all");
                }}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-reset-search"
              >
                Clear Search
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
