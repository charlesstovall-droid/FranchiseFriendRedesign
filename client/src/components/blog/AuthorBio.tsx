import { Linkedin, Mail, Phone } from "lucide-react";

export function AuthorBio() {
  return (
    <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 mt-10">
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
          <span className="font-serif font-bold text-primary-foreground text-2xl">CS</span>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-serif font-bold text-primary mb-1">Charles Stovall</h3>
          <p className="text-secondary font-semibold mb-3">Franchise Consultant | 1531 N Lakeshore Dr, Mt Pleasant, SC 29466</p>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Charles Stovall is a certified franchise consultant with FranChoice, helping aspiring entrepreneurs 
            navigate franchise ownership opportunities. With a focus on personalized guidance and honest advice, 
            Charles has helped dozens of clients find their ideal franchise fit across South Carolina and nationwide.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <a 
              href="mailto:CStovall@FranChoice.com" 
              className="inline-flex items-center gap-2 text-secondary hover:text-accent-pop transition-colors"
            >
              <Mail className="w-4 h-4" />
              CStovall@FranChoice.com
            </a>
            <a 
              href="tel:+19198273921" 
              className="inline-flex items-center gap-2 text-secondary hover:text-accent-pop transition-colors"
            >
              <Phone className="w-4 h-4" />
              (919) 827-3921
            </a>
            <a 
              href="https://www.linkedin.com/in/charles-stovall/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-secondary hover:text-accent-pop transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
