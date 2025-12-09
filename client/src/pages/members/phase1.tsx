import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle, Circle, Zap, Target, TrendingUp, Award, Download, ExternalLink, Mail, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { useProtectedRoute } from "@/lib/AuthContext";
import { useLocation } from "wouter";

interface Brand {
  id: string;
  name: string;
  website: string;
  logoUrl?: string;
  devPersonName?: string;
  devPersonEmail?: string;
  devPersonPhone?: string;
}

export default function Phase1() {
  const { member, loading: authLoading } = useProtectedRoute();
  const [, setLocation] = useLocation();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(true);

  useEffect(() => {
    if (member?.id) {
      fetchBrands();
    }
  }, [member?.id]);

  const fetchBrands = async () => {
    try {
      const response = await fetch(`/api/members/${member?.id}/brands`);
      if (response.ok) {
        const data = await response.json();
        setBrands(data.brands || []);
      }
    } catch (err) {
      console.error("Error fetching brands:", err);
    } finally {
      setBrandsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const handleDownloadIdealDay = () => {
    window.location.href = "/api/download/ideal-day-blueprint";
  };

  const handleDownloadExplorationGuide = () => {
    window.location.href = "/api/download/phase1-exploration-guide";
  };

  const tools = [
    {
      icon: Target,
      title: "Your Ideal Day Blueprint",
      description: "Paint a picture of your ideal day. Let's explore what success looks like to you—your schedule, environment, and impact. This foundation guides everything we discover together.",
      status: "ready",
    },
    {
      icon: TrendingUp,
      title: "Personal Business Profile",
      description: "Reflect on your strengths, work style, and values. Understanding who you are helps us align you with franchise opportunities that complement your natural talents.",
      status: "ready",
    },
    {
      icon: Award,
      title: "Investment & Lifestyle Goals",
      description: "Clarify your investment range, time commitment, and desired lifestyle. These personal priorities shape which franchises make sense for your journey.",
      status: "ready",
    },
    {
      icon: Zap,
      title: "Deep Dive into Your Brands",
      description: "Explore the target franchise brands I've selected for you. Dive deep into each opportunity to understand how they align with your ideal day and investment goals.",
      status: "ready",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <section className="pt-24 pb-12 bg-gradient-to-r from-primary via-primary/95 to-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">Phase 1: Discovery</h1>
            <p className="text-lg text-primary-foreground/80">Welcome, {member?.name}!</p>
            <p className="text-primary-foreground/70 mt-2">Let's explore franchise opportunities aligned with your goals</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          {/* Progress Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-6 md:p-8 bg-gradient-to-r from-secondary/5 to-accent-pop/5 border border-accent-pop/20 rounded-xl"
          >
            <h2 className="text-2xl font-serif font-bold mb-6 text-primary">Your Journey</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { phase: 1, name: "Discovery", icon: Target },
                { phase: 2, name: "Evaluation", icon: TrendingUp },
                { phase: 3, name: "Analysis", icon: Award },
                { phase: 4, name: "Decision", icon: Zap },
              ].map((item) => (
                <motion.div
                  key={item.phase}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: item.phase * 0.1 }}
                  className="flex flex-col items-center cursor-pointer hover:opacity-75 transition-opacity"
                  onClick={() => setLocation(`/phase${item.phase}`)}
                  data-testid={`button-phase-${item.phase}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                    item.phase === 1 ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-primary text-center">{item.name}</span>
                  <span className="text-xs text-muted-foreground mt-1">Phase {item.phase}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Your Franchise Brands */}
          {brands.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-serif font-bold text-primary mb-8">Your Target Franchise Brands</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brands.map((brand, index) => (
                  <motion.div
                    key={brand.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + index * 0.1 }}
                  >
                    <Card className="h-full border-2 border-secondary/30 hover:border-secondary/50 transition-all bg-gradient-to-br from-primary via-primary/90 to-primary/95">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          {brand.logoUrl && (
                            <div className="w-16 h-16 flex-shrink-0 bg-white rounded-lg p-2 border border-secondary/10 flex items-center justify-center">
                              <img 
                                src={brand.logoUrl} 
                                alt={`${brand.name} logo`}
                                className="w-full h-full object-contain"
                                data-testid={`img-brand-logo-${index}`}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          <h3 className="text-xl font-bold text-secondary">{brand.name}</h3>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <a
                          href={brand.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors text-sm"
                          data-testid={`link-brand-website-${index}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                          Visit Website
                        </a>
                        
                        {brand.devPersonName && (
                          <div className="p-3 bg-accent-pop/20 rounded-lg space-y-2 border border-accent-pop/30">
                            <p className="text-xs font-semibold text-accent-pop/80">Development Contact</p>
                            <p className="font-semibold text-accent-pop">{brand.devPersonName}</p>
                            {brand.devPersonEmail && (
                              <a
                                href={`mailto:${brand.devPersonEmail}`}
                                className="flex items-center gap-2 text-accent-pop hover:text-accent-pop/80 transition-colors text-sm"
                                data-testid={`link-dev-email-${index}`}
                              >
                                <Mail className="w-4 h-4" />
                                {brand.devPersonEmail}
                              </a>
                            )}
                            {brand.devPersonPhone && (
                              <a
                                href={`tel:${brand.devPersonPhone}`}
                                className="flex items-center gap-2 text-accent-pop hover:text-accent-pop/80 transition-colors text-sm"
                                data-testid={`link-dev-phone-${index}`}
                              >
                                <Phone className="w-4 h-4" />
                                {brand.devPersonPhone}
                              </a>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Discovery Tools */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-serif font-bold text-primary">Discovery Tools</h2>
              <div className="flex gap-3">
                <Button
                  onClick={handleDownloadIdealDay}
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold flex items-center gap-2"
                  data-testid="button-download-ideal-day"
                >
                  <Download className="w-4 h-4" />
                  Ideal Day Blueprint
                </Button>
                <Button
                  onClick={handleDownloadExplorationGuide}
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold flex items-center gap-2"
                  data-testid="button-download-exploration-guide"
                >
                  <Download className="w-4 h-4" />
                  Exploration Guide
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tools.map((tool, index) => (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="h-full border-2 border-secondary/20 hover:border-secondary/40 transition-all">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-secondary/10 rounded-lg">
                          <tool.icon className="w-6 h-6 text-secondary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-primary">{tool.title}</h3>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{tool.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* What to Expect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <h2 className="text-2xl font-serif font-bold text-primary">Your Discovery Journey</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-base text-muted-foreground leading-relaxed">
                  Phase 1 is about building <span className="font-semibold text-primary">momentum</span> and clarity. You'll engage in a guided discovery process designed to help you understand yourself—your values, strengths, and vision for your ideal day—and then align that with franchise opportunities that truly fit your goals.
                </p>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                      <span className="text-secondary font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">Define Your Vision</p>
                      <p className="text-sm text-muted-foreground">You'll complete your Ideal Day Blueprint, clarifying what success looks like for you personally and professionally. This becomes your north star throughout the process.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                      <span className="text-secondary font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">Learn & Discover</p>
                      <p className="text-sm text-muted-foreground">Explore the target franchise brands I've selected specifically for you. You'll learn how each model works and evaluate which ones align with your goals and lifestyle preferences.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                      <span className="text-secondary font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">Test Alignment</p>
                      <p className="text-sm text-muted-foreground">As you learn about franchises, you'll continuously evaluate which ones fit your ideal day. This real-world testing helps you discover what actually works for you—not what sounds good on paper.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                      <span className="text-secondary font-bold">4</span>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">Build Momentum</p>
                      <p className="text-sm text-muted-foreground">Each discovery moves you forward. By the end of Phase 1, you'll have momentum, clarity, and confidence about which opportunities deserve deeper exploration in the next phases.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 mt-6">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">Remember:</span> Momentum is everything. The more you engage in this discovery process, the clearer your path becomes. You're not just learning about franchises—you're discovering what's right for your unique situation.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Schedule Consultation CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="mb-12 p-8 bg-gradient-to-r from-accent-pop/5 to-accent-pop/10 border border-accent-pop/30 rounded-lg"
          >
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">Need Guidance?</h3>
                <p className="text-muted-foreground">Schedule a consultation with Charles to discuss your progress and get personalized recommendations.</p>
              </div>
              <a 
                href="https://calendly.com/charles-stovall/intro" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button className="bg-accent-pop hover:bg-accent-pop/90 text-primary font-semibold whitespace-nowrap">
                  Schedule Consultation
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col md:flex-row gap-4 justify-between items-center bg-secondary/10 p-6 rounded-lg border border-secondary/20"
          >
            <div>
              <h3 className="text-lg font-bold text-primary mb-1">Ready to Move Forward?</h3>
              <p className="text-sm text-muted-foreground">Once you've explored Phase 1, we'll help you dive deeper into evaluation and analysis.</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setLocation("/phase2")}
                variant="outline"
                className="border-secondary text-secondary hover:bg-secondary/10 font-semibold"
                data-testid="button-next-phase"
              >
                Next Phase →
              </Button>
              <Button
                onClick={handleMarkComplete}
                disabled={loading || isComplete}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold whitespace-nowrap"
                data-testid="button-complete-phase1"
              >
                {isComplete ? "✓ Phase 1 Complete" : "Complete Phase 1"}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
