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

const franchises: Franchise[] = [
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
  { name: "Aussie Pet Mobile", industry: "Pet Grooming", category: "50to200k", description: "This mobile grooming service brings the salon directly to the customer's driveway, offering convenience that busy pet owners love. It is a scalable, van-based business that eliminates the need for expensive retail real estate." },
  { name: "Bar-B-Clean", industry: "BBQ Grill Cleaning", category: "50to200k", description: "This niche service focuses on cleaning and maintaining high-end outdoor grills, a task most homeowners dread doing themselves. It offers a low-cost entry point with high repeat business potential, especially in affluent neighborhoods." },
  { name: "Bath Tune-Up", industry: "Bathroom Remodeling", category: "50to200k", description: "Specializing in curated bathroom updates rather than full demolition remodels, this concept offers a faster, less intrusive renovation experience. It allows franchisees to capture the middle-market demand for affordable luxury with quicker project turnover." },
  { name: "beem Light Sauna", industry: "Wellness/Sauna Services", category: "50to200k", description: "This wellness brand focuses on infrared light therapy in a spa-like setting, tapping into the growing demand for holistic health and recovery. The membership-based model provides recurring revenue and appeals to health-conscious communities." },
  { name: "Benetrends", industry: "Financial Services", category: "50to200k", description: "While not a traditional franchise to own, Benetrends is a leading funding partner that helps candidates use their retirement funds tax-deferred to start a business. They are a critical resource for capitalizing your venture without debt." },
  { name: "Big Frog Custom T-Shirts & More", industry: "Custom T-Shirts/Retail", category: "50to200k", description: "This retail concept revolutionizes custom apparel with direct-to-garment printing that allows for no minimum orders and 24-hour turnaround. It is a fun, creative business that serves both individual walk-ins and large B2B accounts like schools and local businesses." },
  { name: "Bio-One", industry: "Biohazard/Crime Scene Cleanup", category: "50to200k", description: "Specializing in crime scene and trauma cleanup, this brand provides a highly necessary service with compassion and discretion. It is a recession-proof model with high margins, working closely with law enforcement and insurance companies." },
  { name: "Blingle!", industry: "Holiday Lighting", category: "under50k", description: "This premier lighting franchise covers everything from landscape and patio lighting to holiday displays and event lighting. It offers year-round revenue opportunities by combining seasonal peaks with permanent installation projects." },
  { name: "Bloomin' Blinds", industry: "Blinds/Window Coverings", category: "50to200k", description: "This mobile window covering franchise offers sales, installation, and repairs, giving it a unique advantage over sales-only competitors. The model is technology-driven and scalable, with low overhead and strong margins." },
  { name: "Blue Kangaroo Packoutz", industry: "Packout Services", category: "50to200k", description: "Focusing on contents restoration, this brand restores furniture, art, and documents damaged by water or fire. It is a vital partner to restoration companies and offers a facility-based model where technical expertise drives high-value insurance claims." },
  { name: "Blue Moon Estate Sales", industry: "Estate Sales", category: "50to200k", description: "This franchise professionalizes the estate sale industry, helping families liquidate assets with dignity and efficiency. It is a low-investment model that thrives on organization, marketing, and managing weekend sale events." },
  { name: "Body20", industry: "Fitness/EMS Training", category: "50to200k", description: "Utilizing Electro-Muscle Stimulation (EMS) technology, this fitness concept delivers a full workout in just 20 minutes. It attracts busy professionals and provides a high-revenue-per-member model with a small studio footprint." },
  { name: "Boost Home Healthcare", industry: "Home Healthcare", category: "50to200k", description: "This brand focuses on clinical, in-home medical care, bridging the gap between hospital and home recovery. It is a higher-level healthcare play that demands strong operational management but offers significant revenue potential in the medical sector." },
  { name: "British Swim School", industry: "Swim Lessons", category: "50to200k", description: "This swim safety franchise operates out of rented pools in hotels and fitness centers, eliminating the need for expensive real estate build-outs. It is a high-margin, mission-driven business focused on saving lives and teaching water survival skills." },
  { name: "Budget Blinds", industry: "Blinds/Window Coverings", category: "50to200k", description: "As the #1 window covering franchise in North America, this brand offers massive buying power and high brand recognition. It is a proven, home-based model that allows owners to offer premium custom solutions at competitive price points." },
  { name: "Bumble Bee Blinds", industry: "Blinds/Window Coverings", category: "50to200k", description: "This technology-forward window treatment brand focuses on a modern customer experience and streamlined sales process. It offers a scalable mobile model backed by a parent company with deep resources in the home services sector." },
  { name: "Cabinet IQ", industry: "Cabinet Refacing", category: "50to200k", description: "This brand modernizes the kitchen and bath remodeling experience with a high-tech showroom and simplified selection process. It targets the massive home renovation market with a model designed to be more efficient and customer-friendly than traditional contractors." },
  { name: "CarePatrol", industry: "Senior Care Placement", category: "50to200k", description: "This senior placement agency helps families find safe and appropriate assisted living communities at no cost to them. It is a low-overhead, relationship-based business that generates revenue through referral commissions from partner facilities." },
  { name: "Cascadia Pizza", industry: "Food Trucks", category: "50to200k", description: "Starting as a food truck and expanding to brick-and-mortar, this brand brings wood-fired pizza to local communities with a focus on quality and vibe. It offers a flexible footprint for owners who want to bring a beloved product to their neighborhood." },
  { name: "CertaPro Painters", industry: "Interior/Exterior Painting", category: "50to200k", description: "The largest painting franchise in North America, CertaPro offers a highly scalable executive model focused on management and sales. Owners build large territories by managing teams of subcontractors for both residential and commercial projects." },
  { name: "Chatime", industry: "Bubble Tea", category: "50to200k", description: "As a global leader in the bubble tea market, Chatime offers a trendy, high-volume beverage concept with a streamlined operation. It appeals to investors looking for a retail footprint with a simple menu and a young, loyal customer base." },
  { name: "CMIT Solutions", industry: "IT Services", category: "50to200k", description: "This B2B franchise provides enterprise-level IT support and cybersecurity to small and medium-sized businesses. It is a recurring revenue model perfect for executive owners who want to serve the professional business community." },
  { name: "ComForCare Home Care", industry: "Senior Home Care", category: "50to200k", description: "This brand provides non-medical in-home care with specialized programs for dementia and Alzheimer's patients. It is a scalable business for compassionate leaders who want to build a large team of caregivers to support the aging population." },
  { name: "COOL-BINZ", industry: "Dumpster Rental", category: "50to200k", description: "This innovative portable storage concept utilizes climate-controlled bins, differentiating itself in the moving and storage market. It offers a semi-passive ownership potential with a focus on logistics and asset rental." },
  { name: "CoolVu Glass and Surface Solutions", industry: "Window Film/Glass Treatment", category: "50to200k", description: "Specializing in architectural films and surface enhancements, this brand serves both residential and commercial clients with energy-saving and security solutions. It is a low-overhead model with diverse revenue streams from solar control to privacy graphics." },
  { name: "Creative Colors International", industry: "Flooring/Color Consulting", category: "50to200k", description: "This mobile franchise specializes in the repair and restoration of leather, vinyl, and fabric, saving customers the cost of replacement. It serves a wide range of B2B clients, including car dealerships, restaurants, and medical facilities." },
  { name: "D1 Sports Training", industry: "Athletic Training", category: "50to200k", description: "Founded by elite athletes, this fitness franchise offers scholastic and adult athletic training in a high-energy facility. It appeals to investors passionate about sports who want to impact youth development and adult fitness performance." },
  { name: "Degree Wellness", industry: "Fitness/Wellness", category: "50to200k", description: "This self-care studio offers a variety of technology-driven wellness services like cryotherapy, infrared saunas, and red light therapy. It is a membership-based model designed for high throughput and minimal staffing requirements." },
  { name: "Deka Lash", industry: "Eyelash Extensions", category: "50to200k", description: "This beauty brand focuses exclusively on eyelash extensions and brow services in a modern, membership-driven studio. It offers a recurring revenue model with high customer retention in the booming beauty services sector." },
  { name: "dermani MEDSPA®", industry: "Medical Spa", category: "50to200k", description: "Bridging the gap between luxury day spas and medical clinics, this brand offers laser hair removal, injectables, and skin rejuvenation. It is a high-revenue model that capitalizes on the growing accessibility of medical aesthetics." },
  { name: "Discover Strength", industry: "Fitness", category: "50to200k", description: "This science-based strength training concept focuses on efficient, 30-minute workouts guided by expert exercise physiologists. It attracts busy clients who value results and offers a high-retention membership model." },
  { name: "DonutNV", industry: "Food Trucks", category: "50to200k", description: "This interactive mobile food trailer brings hot, fresh mini donuts to events and parties. It is a fun, event-based business with low entry costs and high margins, perfect for owner-operators or semi-absentee investors." },
  { name: "ecomaids", industry: "Green Cleaning", category: "50to200k", description: "This eco-friendly cleaning franchise differentiates itself by using only non-toxic, allergen-free products. It appeals to health-conscious homeowners and offers a recurring revenue model with a focus on employee retention and quality service." },
  { name: "Ellie Mental Health", industry: "Mental Health Services", category: "50to200k", description: "This innovative concept fills a critical gap in outpatient mental health care by combining a therapist-friendly culture with a highly accessible patient experience. It offers a scalable opportunity in a rapidly expanding medical niche with strong community impact." },
  { name: "ERA Group", industry: "Real Estate", category: "under50k", description: "This B2B consulting franchise helps companies reduce overhead costs through expense management analysis. It is a white-collar, home-based business ideal for former executives with strong financial or corporate backgrounds." },
  { name: "EverLine Coatings", industry: "Parking Lot Coating", category: "50to200k", description: "Specializing in parking lot line striping and pavement maintenance, this brand brings professionalism to a fragmented industry. It offers a B2B model with recurring maintenance contracts and strong potential for multi-unit scaling." },
  { name: "Exercise Coach", industry: "Fitness Training", category: "50to200k", description: "Using bio-adaptive robotic technology, this fitness brand delivers a full workout in just two 20-minute sessions per week. It specifically targets the demographic that hates the traditional gym scene, offering a unique, low-impact solution." },
  { name: "Express Employment Professionals", industry: "Staffing Services", category: "50to200k", description: "As a leading staffing franchise, this brand connects local businesses with qualified workers in industrial, office, and professional roles. It is a professional B2B sales office with massive revenue potential for owners who can build strong community relationships." },
  { name: "Face Foundrie", industry: "Skincare/Cosmetics", category: "50to200k", description: "This modern facial bar focuses on efficient, accessible skincare services like 40-minute facials and lash lifts. It captures the affordable luxury market with a high-volume model and a sleek, open-concept studio design." },
  { name: "Fastest Labs", industry: "Drug Testing", category: "50to200k", description: "This B2B franchise provides drug, alcohol, and DNA testing services for employers and individuals. It operates with standard business hours, low staffing requirements, and high margins driven by corporate compliance needs." },
  { name: "Fibrenew", industry: "Leather/Vinyl Repair", category: "50to200k", description: "This mobile service specializes in the repair of leather, plastic, and vinyl, catering to automotive, aviation, medical, and residential markets. It is a hands-on, high-margin business with diverse revenue streams and low overhead." },
  { name: "FirstLight Home Care", industry: "Senior Home Care", category: "50to200k", description: "Providing non-medical home care to seniors and adults with disabilities, this brand emphasizes a culture of care and strong caregiver support. It offers a scalable business model in a sector with explosive demographic demand." },
  { name: "Fish Window Cleaning", industry: "Window Cleaning", category: "50to200k", description: "As the world's largest window cleaning franchise, this brand dominates the low-rise commercial and residential niche. It is a Monday-to-Friday business model that builds a valuable recurring revenue base through route density." },
  { name: "Five Star Bath Solutions", industry: "Bathroom Remodeling", category: "50to200k", description: "This brand disrupts the bathroom remodeling industry with proprietary technology and a focus on one-day installations. It offers a scalable sales and management model that delivers high-end results without the headaches of general contracting." },
  { name: "Floor Coverings International", industry: "Flooring Sales", category: "50to200k", description: "This mobile flooring franchise brings the showroom to the customer's home with a van containing thousands of samples. It offers a high average ticket and differentiates itself through a consultative sales process and superior customer convenience." },
  { name: "Floyd's 99 Barbershop", industry: "Barbershop", category: "50to200k", description: "This hair care brand blends an old-school barbershop vibe with a rock-and-roll environment, appealing to a broad demographic. It is a manager-run investment model that generates high volume through a unique, repeatable customer experience." },
  { name: "FocalPoint Coaching", industry: "Business Coaching", category: "50to200k", description: "This B2B franchise trains former executives to become certified business coaches and trainers. It is a low-overhead, high-impact consulting model that allows you to leverage your corporate experience to help other business owners succeed." },
  { name: "FranFund", industry: "Franchise Financing", category: "50to200k", description: "FranFund is a premier funding partner that assists franchise candidates in securing the capital they need through 401(k) rollovers and SBA loans. They provide a streamlined, consultative approach to financial readiness for business ownership." },
  { name: "Fundraising University", industry: "Fundraising Services", category: "50to200k", description: "This brand partners with high school sports teams to run highly effective fundraising campaigns. It is a home-based, seasonal business that allows former athletes or coaches to stay involved in sports while earning a strong income." },
  { name: "Furry Land Mobile Grooming", industry: "Pet Grooming", category: "50to200k", description: "This mobile pet grooming franchise offers a convenient, stress-free experience for pets and owners alike. It is a scalable, membership-friendly model that capitalizes on the booming pet economy without the cost of retail real estate." },
  { name: "Gatsby Glass", industry: "Glass Repair", category: "50to200k", description: "Focusing on high-end glass installations like shower doors, mirrors, and railings, this brand serves the luxury home improvement market. It offers a sophisticated, consultation-based sales model with strong margins on custom products." },
  { name: "goGLOW", industry: "Beauty/Tanning", category: "50to200k", description: "This sunless tanning brand offers a safe, high-quality alternative to UV tanning with proprietary skin-nourishing solutions. It is a boutique beauty concept with a recurring membership model and strong retail product sales." },
  { name: "Gotcha Covered", industry: "Blinds/Shades", category: "50to200k", description: "This custom window treatment franchise offers a consultative, low-pressure sales approach with a massive selection of soft and hard window coverings. It is a low-overhead, home-based business with high margins and no inventory requirements." },
  { name: "Groovy Hues", industry: "Painting/Art", category: "50to200k", description: "This painting and wall covering franchise brings energy and technology to the trade with a fresh brand and comprehensive service offering. Owners manage the business and sales while subcontractors handle the labor, making it highly scalable." },
  { name: "Hallmark Homecare", industry: "Senior Home Care", category: "50to200k", description: "This unique model functions as a caregiver recruitment and placement agency rather than a traditional home care agency. It eliminates the burden of employing caregivers directly, focusing instead on matching families with independent care professionals." },
  { name: "HealthSource Chiropractic", industry: "Chiropractic", category: "50to200k", description: "This franchise combines chiropractic care with progressive rehabilitation and wellness services to treat the whole patient. It offers a proven clinic model that can be owned by chiropractors or investors who hire clinical directors." },
  { name: "Heights Wellness Retreat", industry: "Wellness", category: "50to200k", description: "This emerging wellness brand offers a sanctuary for mental and physical recovery through various holistic therapies. It targets the growing market of consumers seeking a comprehensive, retreat-style experience in their local community." },
  { name: "Hello Sugar", industry: "Sugar/Wax Services", category: "50to200k", description: "Specializing in speed-waxing and sugaring, this brand offers a high-volume, membership-based model with a focus on technique and customer comfort. The compact studio footprint keeps overhead low while maximizing throughput." },
  { name: "Heroes Lawn Care", industry: "Lawn Care", category: "50to200k", description: "This brand modernizes the lawn care industry with eco-friendly electric equipment and agronomic expertise. It offers a recurring revenue model with multiple service lines, including fertilization, irrigation, and pet waste removal." },
  { name: "HOMEstretch", industry: "Real Estate", category: "50to200k", description: "This pre-sale home preparation franchise helps realtors and sellers get homes market-ready with cosmetic improvements and clearing services. It solves a major pain point in the real estate transaction process with a one-stop-shop solution." },
  { name: "House Doctors", industry: "Handyman Services", category: "50to200k", description: "This handyman and home improvement franchise focuses on smaller projects that big contractors ignore. It offers a professional, reliable service model that builds trust and generates high repeat business from homeowners." },
  { name: "Hunters-Humbug", industry: "Pest Control", category: "50to200k", description: "Formerly Mosquito Hunters, this brand provides residential and commercial mosquito and tick control services. It is a seasonal, recurring revenue business with high customer retention and a low fixed-cost structure." },
  { name: "iFlex", industry: "Fitness", category: "50to200k", description: "This stretch therapy concept focuses on assisted stretching to improve mobility and reduce pain for a wide demographic. It is a simple, labor-light model that complements active lifestyles and aging populations alike." },
  { name: "iFOAM", industry: "Spray Foam Insulation", category: "50to200k", description: "Specializing in high-performance spray foam insulation, this brand taps into the demand for energy efficiency in homes and businesses. It is a specialized construction model with high ticket averages and a focus on professional installation." },
  { name: "Image Studios", industry: "Photography", category: "50to200k", description: "This salon suite franchise is a real estate model where you act as the landlord for beauty professionals renting private studios. It offers a semi-absentee ownership style with high occupancy stability and minimal employee management." },
  { name: "Insulation Commandos", industry: "Insulation Services", category: "50to200k", description: "This brand focuses on insulation removal and replacement, critical for energy efficiency and attic health. It is a high-margin, essential home service that benefits from green energy trends and utility rebates." },
  { name: "ISI® Elite Training", industry: "Athletic Training", category: "50to200k", description: "This group fitness concept focuses on athletic-based training (ABT) in a team environment, fostering a strong community culture. It offers a high-energy, membership-driven model with a focus on retention and coach-led workouts." },
  { name: "Ivybrook Academy", industry: "Education", category: "50to200k", description: "This virtual learning platform provides personalized education for gifted and advanced students. It offers a low-overhead model that leverages technology to serve a growing market of families seeking individualized education solutions." },
];

// Continued below in component...
export default function FranchiseBrands() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary to-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-8 h-8 fill-secondary text-secondary" />
            <h1 className="text-4xl md:text-5xl font-serif font-bold">Verified Franchise Opportunities</h1>
          </div>
          <p className="text-lg text-primary-foreground/80">Browse {franchises.length}+ carefully selected franchise brands</p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 md:px-6">
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

          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
            <TabsList className="grid w-full grid-cols-4 h-auto gap-2 bg-transparent p-0">
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-secondary/5 border border-secondary text-sm text-foreground rounded-lg"
          >
            <p className="font-medium text-secondary">📌 Important:</p>
            <p className="text-xs mt-1">Information about franchise brands is for educational purposes. Each franchise has unique requirements and opportunities.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 flex items-center gap-2 text-sm text-primary"
          >
            <Filter className="w-4 h-4" />
            <span>Showing {filteredFranchises.length} franchise{filteredFranchises.length !== 1 ? 's' : ''}</span>
          </motion.div>

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
                    {franchise.description && (
                      <p className="text-sm text-foreground leading-relaxed">{franchise.description}</p>
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
