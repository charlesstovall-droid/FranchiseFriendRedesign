import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle, Circle, Zap, Target, TrendingUp, Award } from "lucide-react";
import { useState } from "react";
import { useProtectedRoute } from "@/lib/AuthContext";

export default function Phase1() {
  const { member, loading: authLoading } = useProtectedRoute();
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const handleMarkComplete = async () => {
    if (!member) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/members/${member.email}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phase: 1, complete: true }),
      });
      if (response.ok) {
        setIsComplete(true);
      }
    } catch (err) {
      console.error("Error updating progress:", err);
    } finally {
      setLoading(false);
    }
  };

  const tools = [
    {
      icon: Target,
      title: "Franchise Matcher",
      description: "Find franchises based on your investment range and business interests. Filter by industry, location, and growth potential.",
      status: "ready",
    },
    {
      icon: TrendingUp,
      title: "Market Analysis",
      description: "Analyze opportunities in your target markets. Compare franchise performance data and growth metrics.",
      status: "ready",
    },
    {
      icon: Award,
      title: "Top 200 Performers",
      description: "Review our curated list of highest-rated franchises from Franchise Business Review and industry experts.",
      status: "ready",
    },
    {
      icon: Zap,
      title: "Disclosure Documents",
      description: "Request detailed FDD (Franchise Disclosure Document) and financial information directly from franchisors.",
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
            className="mb-12 p-6 md:p-8 bg-secondary/5 border border-secondary/20 rounded-xl"
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
                  className="flex flex-col items-center"
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

          {/* Discovery Tools */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-serif font-bold mb-8 text-primary">Discovery Tools</h2>
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
                          <span className="inline-block mt-1 px-2 py-1 bg-secondary/20 text-secondary text-xs font-semibold rounded">
                            {tool.status === "ready" ? "✓ Ready to Use" : "Coming Soon"}
                          </span>
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
                <h2 className="text-2xl font-serif font-bold text-primary">What to Expect in Phase 1</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex gap-3">
                    <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-primary">Understand Your Profile</p>
                      <p className="text-sm text-muted-foreground">Identify your investment range, skills, and business goals</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-primary">Explore Opportunities</p>
                      <p className="text-sm text-muted-foreground">Browse 247+ verified franchises across all investment categories</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-primary">Get Initial Guidance</p>
                      <p className="text-sm text-muted-foreground">Receive personalized recommendations based on your profile</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-primary">Request Information</p>
                      <p className="text-sm text-muted-foreground">Start conversations with franchisors that interest you</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Next Steps */}
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
            <Button
              onClick={handleMarkComplete}
              disabled={loading || isComplete}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold whitespace-nowrap"
              data-testid="button-complete-phase1"
            >
              {isComplete ? "✓ Phase 1 Complete" : "Complete Phase 1"}
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
