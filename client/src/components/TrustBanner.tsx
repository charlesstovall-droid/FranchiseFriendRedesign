import { Award, Shield, TrendingUp, Users, Star, CheckCircle, ArrowUpRight } from "lucide-react";

// Issue 4 — TODO Charles: confirm Inc. 500 context — was this you personally, a company
// you were part of, or a client? Currently commented out because showing it standalone
// could be misleading. Uncomment the Inc500 entry below once you've confirmed context.

const affiliations = [
  { icon: Shield, name: "IFA Member", subtitle: "International Franchise Association" },
  { icon: Award, name: "FranChoice", subtitle: "National Network" },
  // { icon: TrendingUp, name: "Inc. 500", subtitle: "Recognized Growth" }, // TODO Charles: confirm Inc. 500 context before re-enabling
  { icon: Users, name: "100+ Clients", subtitle: "Successfully Placed" }, // TODO Charles: verify exact client count
  { icon: Star, name: "15+ Years", subtitle: "Industry Experience" }, // Issue 5: canonical number
  { icon: ArrowUpRight, name: "1 → 20", subtitle: "Units Scaled Across Multiple States" }, // Issue 6
  { icon: CheckCircle, name: "Charleston", subtitle: "Based in SC" },
];

// Issue 3 — animations removed; all tiles render at full opacity/position immediately.
// Issue 4 — Inc. 500 tile commented out above.
// Issue 5 — "10+ Years" changed to "15+ Years" (canonical across all pages).
// Issue 6 — "1 → 20" tile added.
// Issue D: Net 6 tiles. Grid is lg:grid-cols-6 — perfectly balanced on desktop (6 across).
//           Mobile renders 2-column (grid-cols-2), 6 tiles = 3 rows, clean.

export function TrustBanner() {
  return (
    <section className="py-14 bg-gradient-to-r from-primary via-primary/95 to-primary text-primary-foreground border-y border-white/10">
      <div className="container mx-auto px-6 md:px-12 max-w-[1200px]">
        <div className="text-center mb-8">
          <p className="text-secondary uppercase text-xs font-bold tracking-widest mb-2">
            Trusted Expertise
          </p>
          <h3 className="text-2xl font-serif font-bold">
            Backed by Industry Leaders
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {affiliations.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group"
              data-testid={`trust-tile-${index}`}
            >
              <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur flex items-center justify-center mb-3 group-hover:bg-secondary/20 transition-all duration-300 group-hover:scale-110">
                <item.icon className="w-8 h-8 text-secondary" />
              </div>
              <h4 className="font-bold text-sm text-white mb-1">{item.name}</h4>
              <p className="text-xs text-primary-foreground/60">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
