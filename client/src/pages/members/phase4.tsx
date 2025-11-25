import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle, Circle } from "lucide-react";
import { useState } from "react";

export default function Phase4() {
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMarkComplete = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/members/member@example.com/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phase: 4, complete: true }),
      });
      if (response.ok) {
        setIsComplete(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <section className="py-12 bg-gradient-to-r from-primary via-primary/95 to-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Phase 4: Discovery Day</h1>
          <p className="text-lg text-primary-foreground/80">Your final step to franchise ownership</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          {/* Progress Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-8 bg-secondary/5 border border-secondary/20 rounded-xl"
          >
            <h2 className="text-2xl font-serif font-bold mb-6 text-primary">Your Progress</h2>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((phase) => (
                <div key={phase} className="flex flex-col items-center">
                  {phase <= 4 ? (
                    <CheckCircle className="w-12 h-12 text-secondary mb-2" />
                  ) : (
                    <Circle className="w-12 h-12 text-muted-foreground mb-2" />
                  )}
                  <span className="text-sm font-semibold text-primary">Phase {phase}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Discovery Day Tools */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <h3 className="text-2xl font-serif font-bold text-primary">Discovery Day Preparation</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Prepare for your on-site franchise experience with our comprehensive Discovery Day checklist.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-primary">Pre-Discovery Day Meeting</p>
                      <p className="text-sm text-muted-foreground">Schedule your site visit and prepare questions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-primary">On-Site Experience</p>
                      <p className="text-sm text-muted-foreground">Tour facilities and meet the franchise team</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-primary">Meet Existing Franchisees</p>
                      <p className="text-sm text-muted-foreground">Connect with successful franchise owners</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Circle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-primary">Final Decision</p>
                      <p className="text-sm text-muted-foreground">Make your franchise investment decision</p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleMarkComplete}
                  disabled={loading || isComplete}
                  className="w-full mt-6 bg-secondary hover:bg-secondary/90"
                  data-testid="button-complete-phase4"
                >
                  {isComplete ? "All Phases Complete ✓" : "Mark Phase 4 Complete"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
