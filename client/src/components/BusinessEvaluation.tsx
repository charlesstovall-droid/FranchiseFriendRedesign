import { motion } from "framer-motion";
import { ShieldAlert, FileSearch, TrendingUp, Clock, FileText, CheckCircle2, AlertTriangle, Scale, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BusinessEvaluation() {
  const highlights = [
    {
      icon: ShieldAlert,
      title: "100% Confidential",
      description: "I work for you, not the seller or the broker."
    },
    {
      icon: FileSearch,
      title: "Expertise",
      description: "I know where sellers hide the bodies and what a healthy P&L looks like."
    },
    {
      icon: Clock,
      title: "Speed",
      description: "Comprehensive review delivered quickly so you don't lose the deal."
    }
  ];

  const reportItems = [
    {
      title: "Financial Reality Check",
      description: "Determining true historical cash flow past seller 'add-backs' and ability to service debt."
    },
    {
      title: "Valuation Analysis",
      description: "Objective breakdown of market value based on performance so you don't overpay."
    },
    {
      title: "Lease & Contract Review",
      description: "Identifying dangerous clauses like relocation or bad renewal terms that could kill investment."
    },
    {
      title: "Operational Red Flags",
      description: "Highlighting inconsistencies suggesting operational problems or deferred maintenance."
    }
  ];

  return (
    <section id="evaluation" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-4">
            Business Evaluation & Deal Review
          </h2>
          <p className="text-xl text-secondary font-semibold mb-6">
            Don’t Buy Blind. Get an Expert Second Opinion.
          </p>
          <p className="text-lg text-muted-foreground">
            You’ve found a promising business, but do the numbers add up? Before you commit capital, let me identify hidden risks and validate what the business is actually worth.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
          {/* Main Evaluation Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-primary/5 rounded-2xl p-8 border border-primary/10"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-serif font-bold text-primary mb-2">Evaluation Report</h3>
                <p className="text-secondary font-bold text-lg">Flat Fee: $1,500</p>
              </div>
              <FileText className="w-12 h-12 text-secondary/40" />
            </div>

            <div className="space-y-6 mb-8">
              {reportItems.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-primary mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-xl border border-secondary/20 mb-8">
              <p className="text-primary font-serif font-bold italic">
                "The Result: You get a clear 'Go' or 'No-Go' perspective and the leverage you need to negotiate a better price."
              </p>
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12">
              Request Evaluation
            </Button>
          </motion.div>

          {/* Side Info & Optional Services */}
          <div className="space-y-8">
            <div className="grid gap-6">
              {highlights.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 items-center p-4 bg-white rounded-xl shadow-sm border border-border"
                >
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-secondary/5 rounded-2xl p-8 border border-secondary/20"
            >
              <h3 className="text-xl font-serif font-bold text-primary mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-secondary" />
                Advanced Transaction Support
              </h3>
              <p className="text-secondary font-bold mb-4">Rate: $1,000 / Hour</p>
              <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                <li className="flex gap-2"><span>•</span> Negotiation Strategy & Counter-offers</li>
                <li className="flex gap-2"><span>•</span> Deal Architecture to protect cash flow</li>
                <li className="flex gap-2"><span>•</span> Crisis Management during due diligence</li>
              </ul>
              <p className="text-xs italic text-muted-foreground">
                Available for clients who decide to proceed with purchase after the initial report.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Disclaimers */}
        <div className="max-w-4xl mx-auto bg-slate-50 rounded-xl p-6 border border-slate-200">
          <div className="flex gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h4 className="font-bold text-primary">Important Disclaimers</h4>
          </div>
          <div className="grid md:grid-cols-2 gap-6 text-xs text-muted-foreground">
            <p>
              <span className="font-bold block mb-1">Not a Bank Appraisal:</span>
              This report is a strategic consulting tool for personal due diligence. SBA lenders will likely require their own certified third-party valuation.
            </p>
            <p>
              <span className="font-bold block mb-1">Scope of Advice:</span>
              I provide business and financial consulting. I am not an attorney or CPA. I recommend retaining legal counsel for final closing documents.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
