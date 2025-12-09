import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle, Circle, Zap, Target, TrendingUp, Award, Briefcase } from "lucide-react";
import { useState } from "react";
import { useProtectedRoute } from "@/lib/AuthContext";
import { useLocation } from "wouter";

export default function Phase2() {
  const { member, loading: authLoading } = useProtectedRoute();
  const [, setLocation] = useLocation();
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
        body: JSON.stringify({ phase: 2, complete: true }),
      });
      if (response.ok) {
        setIsComplete(true);
        setTimeout(() => setLocation("/phase3"), 1000);
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
      title: "Franchise Fit Assessment",
      description: "Test specific franchises against your ideal day blueprint. Does the business model align with your vision? Will it provide the lifestyle you want?",
      status: "ready",
    },
    {
      icon: TrendingUp,
      title: "Investment Analysis",
      description: "Evaluate the financial requirements and ROI potential of franchises you're considering. Compare investment ranges against your financial goals and timeline.",
      status: "ready",
    },
    {
      icon: Award,
      title: "Strengths & Values Match",
      description: "Determine which franchises leverage your natural strengths and align with your core values. Build on what you do best.",
      status: "ready",
    },
    {
      icon: Briefcase,
      title: "Lifestyle Simulation",
      description: "Project what your typical day, week, and year would look like in each franchise. Test if it matches the ideal day you've envisioned.",
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
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">Phase 2: Evaluation</h1>
            <p className="text-lg text-primary-foreground/80">Welcome back, {member?.name}!</p>
            <p className="text-primary-foreground/70 mt-2">Now let's evaluate how specific franchises fit your ideal day and goals</p>
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
                    item.phase === 2 ? 'bg-secondary text-secondary-foreground' : item.phase < 2 ? 'bg-secondary/40 text-secondary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-primary text-center">{item.name}</span>
                  <span className="text-xs text-muted-foreground mt-1">Phase {item.phase}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Evaluation Tools */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-serif font-bold mb-8 text-primary">Evaluation Tools</h2>
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

          {/* Phase 2 Focus */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <h2 className="text-2xl font-serif font-bold text-primary">Your Evaluation Focus</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-base text-muted-foreground leading-relaxed">
                  Phase 2 is where your ideal day blueprint becomes your evaluation filter. You'll take the franchises you're interested in and test them against your personal vision, financial goals, lifestyle preferences, and strengths.
                </p>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                      <span className="text-secondary font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">Narrow Your Focus</p>
                      <p className="text-sm text-muted-foreground">At this phase, you'll consider which brands to explore deeper. You may remove one or more brands to focus on one or two concepts that truly resonate with you.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                      <span className="text-secondary font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">Test Against Your Blueprint</p>
                      <p className="text-sm text-muted-foreground">Does each franchise support your ideal day? Will you work the hours you want? Does the business model match your strengths?</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                      <span className="text-secondary font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">Evaluate the Numbers</p>
                      <p className="text-sm text-muted-foreground">Verify the investment requirements, typical income expectations, and profitability timeline match your financial goals.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                      <span className="text-secondary font-bold">4</span>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">Narrow Your Finalists</p>
                      <p className="text-sm text-muted-foreground">Complete the evaluation process. By the end of Phase 2, you'll have 1-3 franchises that truly align with who you are.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 mt-6">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">Key Principle:</span> Evaluation isn't about finding the "perfect" franchise—it's about finding franchises that work for YOU. Use your ideal day as the filter.
                  </p>
                </div>
              </CardContent>
            </Card>
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
              <p className="text-sm text-muted-foreground">Once you've evaluated your top franchises, Phase 3 dives deeper into detailed analysis.</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setLocation("/phase1")}
                variant="outline"
                className="border-secondary text-secondary hover:bg-secondary/10 font-semibold"
                data-testid="button-previous-phase"
              >
                ← Previous Phase
              </Button>
              <Button
                onClick={() => setLocation("/phase3")}
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
                data-testid="button-complete-phase2"
              >
                {isComplete ? "✓ Phase 2 Complete" : "Complete Phase 2"}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
