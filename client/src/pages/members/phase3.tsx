import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Zap, Target, TrendingUp, Award, MessageCircle, Users, HelpCircle, CheckCircle, Mail } from "lucide-react";
import { useState } from "react";
import { useProtectedRoute } from "@/lib/AuthContext";
import { useLocation } from "wouter";

export default function Phase3() {
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
        body: JSON.stringify({ phase: 3, complete: true }),
      });
      if (response.ok) {
        setIsComplete(true);
        setTimeout(() => setLocation("/phase4"), 1000);
      }
    } catch (err) {
      console.error("Error updating progress:", err);
    } finally {
      setLoading(false);
    }
  };

  const tools = [
    {
      icon: HelpCircle,
      title: "Key Questions to Ask",
      description: "Master the essential questions that reveal the real story of franchise ownership. Learn what successful franchisees ask, and what the answers tell you.",
      status: "ready",
    },
    {
      icon: Users,
      title: "Franchisee Interviews",
      description: "Connect with current and past franchisees. Understand their experience, challenges, and how closely reality matches the corporate vision.",
      status: "ready",
    },
    {
      icon: MessageCircle,
      title: "Corporate Interview Prep",
      description: "Prepare for your conversation with franchise leadership. Know what to listen for, what matters, and what red flags to watch.",
      status: "ready",
    },
    {
      icon: CheckCircle,
      title: "Validation Checklist",
      description: "Work through our comprehensive validation framework before moving to Discovery Day. Confirm your finalists truly fit your ideal day.",
      status: "ready",
    },
  ];

  const keyQuestions = [
    {
      category: "Honest Reality Check",
      questions: [
        "What's one thing you wish you knew before investing?",
        "If you could change one thing about your franchise experience, what would it be?",
        "Would you invest in this franchise again today?"
      ]
    },
    {
      category: "Daily Operations",
      questions: [
        "What does your typical day actually look like?",
        "How many hours per week do you really work?",
        "How much time did it take to reach profitability?"
      ]
    },
    {
      category: "Financial Reality",
      questions: [
        "Are the financial projections from corporate realistic?",
        "What were your total costs (both initial and ongoing)?",
        "How does your actual revenue compare to projections?"
      ]
    },
    {
      category: "Corporate Support",
      questions: [
        "How responsive is corporate support to your needs?",
        "Do they provide the training and resources they promised?",
        "How much control do you really have over operations?"
      ]
    },
    {
      category: "Growth & Lifestyle",
      questions: [
        "Can you take time off when you need to?",
        "What's the real path to scaling or multi-unit ownership?",
        "Does this business fit the lifestyle you wanted?"
      ]
    }
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
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">Phase 3: Validation</h1>
            <p className="text-lg text-primary-foreground/80">Connect with franchise owners and ask the right questions</p>
            <p className="text-primary-foreground/70 mt-2">This is where you learn what franchise ownership really feels like</p>
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
                    item.phase === 3 ? 'bg-secondary text-secondary-foreground' : item.phase < 3 ? 'bg-secondary/40 text-secondary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-primary text-center">{item.name}</span>
                  <span className="text-xs text-muted-foreground mt-1">Phase {item.phase}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Validation Tools */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-serif font-bold mb-8 text-primary">Validation Tools</h2>
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

          {/* Key Questions Framework */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <h2 className="text-2xl font-serif font-bold text-primary">The Right Questions to Ask Franchisees</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-base text-muted-foreground leading-relaxed">
                  Talking to current and past franchisees is your window into the real story. Here are the questions that reveal what franchise ownership truly entails:
                </p>
                
                <div className="space-y-6">
                  {keyQuestions.map((section, idx) => (
                    <div key={idx} className="border-l-4 border-secondary/30 pl-4">
                      <h3 className="font-bold text-primary mb-3">{section.category}</h3>
                      <ul className="space-y-2">
                        {section.questions.map((q, qidx) => (
                          <li key={qidx} className="flex items-start gap-2">
                            <span className="text-secondary font-bold mt-0.5">•</span>
                            <span className="text-sm text-muted-foreground">{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 mt-6">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">Pro Tip:</span> Listen for the emotional tone, not just the words. Pay attention to what franchisees hesitate about or gloss over. Ask follow-up questions. The franchisees who are hesitant or guarded are often the most honest about challenges.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Validation Process */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardHeader>
                <h2 className="text-2xl font-serif font-bold text-primary">Your Validation Process</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                      <span className="text-secondary font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">Get Franchisee Referrals</p>
                      <p className="text-sm text-muted-foreground">Ask corporate for a list of current franchisees. Request a mix of newer and established owners. Ask for former franchisees too.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                      <span className="text-secondary font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">Conduct Phone Interviews</p>
                      <p className="text-sm text-muted-foreground">Reach out to at least 5-10 franchisees. Use the key questions. Take detailed notes on their responses and emotions.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                      <span className="text-secondary font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">Validate with Corporate</p>
                      <p className="text-sm text-muted-foreground">Review financial documents, Item 19 (if available), and FDD disclosures. Ask hard questions about claims made.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                      <span className="text-secondary font-bold">4</span>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">Confirm Fit</p>
                      <p className="text-sm text-muted-foreground">After validation, does this franchise still align with your ideal day? Are there concerns? Do you want to move to Discovery Day?</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Funding Consultation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-secondary/5 to-transparent">
              <CardHeader>
                <h2 className="text-2xl font-serif font-bold text-primary">Ready to Explore Funding Options?</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-base text-muted-foreground leading-relaxed">
                  Franchise financing is a critical piece of your decision. If you haven't already connected with our funding consultant, now is the time to explore your options and understand the real costs of ownership.
                </p>
                
                <div className="bg-muted/5 p-4 rounded-lg border border-secondary/20">
                  <div className="flex items-start gap-3 mb-3">
                    <Mail className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-primary">Brandon Lusk</p>
                      <p className="text-sm text-muted-foreground">Funding Consultant at Benetrends</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Brandon specializes in helping franchise candidates understand their financing options and structure the best deal for their situation. He'll answer your questions about SBA loans, alternative financing, and what to expect throughout the process.
                  </p>
                  <a
                    href="mailto:blusk@benetrends.com?subject=Schedule Funding Consultation for Franchise Investment&body=Hi Brandon,%0A%0AI'm in Phase 3 of my franchise discovery journey and would like to schedule a consultation to discuss funding options for my franchise investment.%0A%0AHere's your calendar link: https://www.benetrends.com/brandon-lusk%0A%0ALooking forward to connecting!%0A%0AThank you"
                    className="inline-block"
                  >
                    <Button
                      className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
                      data-testid="button-email-funding-consultant"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Schedule Funding Consultation
                    </Button>
                  </a>
                </div>

                <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">Why Now?</span> Understanding your financing options before Discovery Day helps you negotiate confidently and make a fully informed decision about the total investment required.
                  </p>
                </div>
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
              <h3 className="text-lg font-bold text-primary mb-1">Validation Complete?</h3>
              <p className="text-sm text-muted-foreground">Once you've validated with franchise owners and corporate, you're ready for Discovery Day—your final step before deciding.</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setLocation("/phase2")}
                variant="outline"
                className="border-secondary text-secondary hover:bg-secondary/10 font-semibold"
                data-testid="button-previous-phase"
              >
                ← Previous Phase
              </Button>
              <Button
                onClick={() => setLocation("/phase4")}
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
                data-testid="button-complete-phase3"
              >
                {isComplete ? "✓ Phase 3 Complete" : "Complete Phase 3"}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
