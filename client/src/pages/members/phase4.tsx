import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Zap, Target, TrendingUp, Award, Calendar, Users, CheckCircle as CheckCircleIcon, Briefcase, Download } from "lucide-react";
import { useState } from "react";
import { useProtectedRoute } from "@/lib/AuthContext";

export default function Phase4() {
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

  const handleDownloadChecklist = () => {
    window.location.href = "/api/download/final-decision-checklist";
  };

  const handleMarkComplete = async () => {
    if (!member) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/members/${member.email}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phase: 4, complete: true }),
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
      icon: Calendar,
      title: "Discovery Day Schedule",
      description: "Plan your visit. Understand the typical agenda, what to expect, and how to maximize your time with corporate and franchisees.",
      status: "ready",
    },
    {
      icon: Users,
      title: "Meet the Team",
      description: "Know who you'll be meeting, what roles they play, and what to listen for in their messages and coaching.",
      status: "ready",
    },
    {
      icon: Briefcase,
      title: "Operations Deep Dive",
      description: "Tour facilities, watch operations, ask about processes. See if the way they do business matches your values.",
      status: "ready",
    },
    {
      icon: CheckCircleIcon,
      title: "Final Decision Checklist",
      description: "Before you sign, review your complete decision framework. Ensure this franchise aligns with your ideal day and goals.",
      status: "ready",
    },
  ];

  const discoveryDayTips = [
    {
      title: "Come Prepared, Not Pushy",
      description: "They'll be selling to you, but you're also evaluating them. Ask thoughtful questions based on what you learned in Phase 3."
    },
    {
      title: "Pay Attention to Culture",
      description: "How do corporate staff treat each other? How do franchisees interact with the brand? Is there respect and collaboration?"
    },
    {
      title: "Trust Your Gut",
      description: "After all the data and analysis, your instinct matters. Do you feel confident in this partnership? Can you see yourself in this community?"
    },
    {
      title: "Get It in Writing",
      description: "If corporate promises support, training, or specific resources, get confirmation in writing. Don't rely on verbal agreements."
    },
    {
      title: "Observe Everything",
      description: "Notice the small things: how calls are answered, how issues are addressed, how franchisees talk about their experience."
    },
    {
      title: "Don't Rush the Decision",
      description: "You don't have to decide on Discovery Day. Take time to process what you've learned. This is a long-term commitment."
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
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">Phase 4: Discovery Day</h1>
            <p className="text-lg text-primary-foreground/80">Your on-site experience and final decision</p>
            <p className="text-primary-foreground/70 mt-2">You've done the homework. Now it's time to see it all in action.</p>
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
                { phase: 3, name: "Validation", icon: Award },
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
                    item.phase === 4 ? 'bg-secondary text-secondary-foreground' : 'bg-secondary/40 text-secondary-foreground'
                  }`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-primary text-center">{item.name}</span>
                  <span className="text-xs text-muted-foreground mt-1">Phase {item.phase}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Discovery Day Tools */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-serif font-bold text-primary">Discovery Day Resources</h2>
              <Button
                onClick={handleDownloadChecklist}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold flex items-center gap-2"
                data-testid="button-download-final-checklist"
              >
                <Download className="w-4 h-4" />
                Final Decision Checklist
              </Button>
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

          {/* Discovery Day Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <h2 className="text-2xl font-serif font-bold text-primary">Tips for a Successful Discovery Day</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {discoveryDayTips.map((tip, idx) => (
                    <div key={idx} className="border-l-4 border-secondary/30 pl-4">
                      <h3 className="font-bold text-primary mb-2">{tip.title}</h3>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* What to Expect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardHeader>
                <h2 className="text-2xl font-serif font-bold text-primary">What to Expect at Discovery Day</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-base text-muted-foreground leading-relaxed">
                  Discovery Day is your opportunity to see the franchise in action and connect with the team. Here's what typically happens:
                </p>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                      <span className="text-secondary font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">Corporate Welcome & Overview</p>
                      <p className="text-sm text-muted-foreground">Leadership presents the company vision, growth strategy, and their perspective on franchisee success. Listen for what they emphasize and what they gloss over.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                      <span className="text-secondary font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">Operations Tour & Demo</p>
                      <p className="text-sm text-muted-foreground">See a flagship or model location. Watch operations. Ask about systems, efficiency, and how closely franchisees can replicate what you're seeing.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                      <span className="text-secondary font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">Meet Current Franchisees</p>
                      <p className="text-sm text-muted-foreground">This is your chance to connect with people living your potential future. Ask about their real experience vs. what corporate promised. Pay attention to their energy and honesty.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                      <span className="text-secondary font-bold">4</span>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">Financial & Legal Discussion</p>
                      <p className="text-sm text-muted-foreground">Review costs, support structure, and agreement terms. Ask about financing options, what's included in support, and ongoing royalties/fees.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                      <span className="text-secondary font-bold">5</span>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">Your Questions & Final Thoughts</p>
                      <p className="text-sm text-muted-foreground">Take time to reflect. Does this franchise feel like the right fit? What questions remain? You don't need to decide today—but you should feel confident about next steps.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 mt-6">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">Remember:</span> You're not just evaluating a franchise—you're evaluating a partnership. This is a relationship you'll be in for years. Make sure it feels right, not just on paper, but in your gut.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Final Decision Framework */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <Card className="border-2 border-secondary/30">
              <CardHeader>
                <h2 className="text-2xl font-serif font-bold text-primary">After Discovery Day: The Final Decision</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base text-muted-foreground">
                  Take time to process everything you've learned. Here are the key questions to ask yourself before making your final decision:
                </p>
                
                <div className="space-y-3 bg-muted/5 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <p className="text-sm"><span className="font-semibold text-primary">Does this franchise align with my ideal day?</span> Will I be doing work I enjoy, with the schedule and lifestyle I want?</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <p className="text-sm"><span className="font-semibold text-primary">Can I afford this investment?</span> Not just financially, but mentally and emotionally—can I handle the risk and commitment?</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <p className="text-sm"><span className="font-semibold text-primary">Do I trust this team?</span> Does corporate feel supportive? Will they have my back when things get tough?</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <p className="text-sm"><span className="font-semibold text-primary">Are franchisees genuinely successful?</span> Did their stories feel honest? Would they do it again?</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <p className="text-sm"><span className="font-semibold text-primary">Do I feel confident and ready?</span> Not nervous—but confident. This isn't about being fearless; it's about being clear-eyed and committed.</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-4">
                  If you can answer "yes" to all of these, you've found your franchise. Congratulations—you're ready to move forward with confidence and clarity.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col md:flex-row gap-4 justify-between items-center bg-secondary/10 p-6 rounded-lg border border-secondary/20"
          >
            <div>
              <h3 className="text-lg font-bold text-primary mb-1">Journey Complete</h3>
              <p className="text-sm text-muted-foreground">You've completed all four phases of discovery. You're ready to make your franchise decision with confidence.</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setLocation("/phase3")}
                variant="outline"
                className="border-secondary text-secondary hover:bg-secondary/10 font-semibold"
                data-testid="button-previous-phase"
              >
                ← Previous Phase
              </Button>
              <Button
                onClick={handleMarkComplete}
                disabled={loading || isComplete}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold whitespace-nowrap"
                data-testid="button-complete-phase4"
              >
                {isComplete ? "✓ All Complete" : "Mark Complete"}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
