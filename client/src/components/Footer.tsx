import { Facebook, Linkedin, Twitter, Mail, Phone, MapPin, Settings } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useLocation } from "wouter";

export function Footer() {
  const { member } = useAuth();
  const [, setLocation] = useLocation();
  const isAdmin = member?.email === "charles@franchisefriend.net";

  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-secondary rounded-sm flex items-center justify-center">
                <span className="font-serif font-bold text-secondary-foreground text-lg">CS</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg leading-tight text-white">Charles Stovall</span>
                <span className="text-[10px] uppercase tracking-widest text-secondary font-semibold">Franchise Friend</span>
              </div>
            </div>
            <p className="text-primary-foreground/70 leading-relaxed mb-6">
              Personal guidance through the complexities of franchise ownership with honesty, integrity, and real-world experience.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-primary-foreground/60 hover:text-secondary transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="text-primary-foreground/60 hover:text-secondary transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-primary-foreground/60 hover:text-secondary transition-colors"><Facebook className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg mb-6 text-secondary">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-primary-foreground/70 hover:text-white transition-colors">Home</a></li>
              <li><a href="#services" className="text-primary-foreground/70 hover:text-white transition-colors">Services</a></li>
              <li><a href="#podcast" className="text-primary-foreground/70 hover:text-white transition-colors">Podcast</a></li>
              <li><a href="#testimonials" className="text-primary-foreground/70 hover:text-white transition-colors">Success Stories</a></li>
              <li><a href="#about" className="text-primary-foreground/70 hover:text-white transition-colors">About Charles</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg mb-6 text-secondary">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-primary-foreground/70 hover:text-white transition-colors">Franchise 101</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-white transition-colors">Financing Guide</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-white transition-colors">Latest Blog Posts</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg mb-6 text-secondary">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-primary-foreground/70">
                <Mail className="w-5 h-5 mt-0.5 text-secondary" />
                <span>CStovall@FranChoice.com</span>
              </li>
              <li className="flex items-start gap-3 text-primary-foreground/70">
                <Phone className="w-5 h-5 mt-0.5 text-secondary" />
                <span>(843) 981-0100</span>
              </li>
              <li className="flex items-start gap-3 text-primary-foreground/70">
                <MapPin className="w-5 h-5 mt-0.5 text-secondary" />
                <span>Charleston, SC</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-primary-foreground/40">&copy; {new Date().getFullYear()} Charles Stovall. All rights reserved.</p>
            <button
              onClick={() => {
                if (isAdmin) {
                  setLocation("/members-admin");
                } else {
                  setLocation("/client-portal");
                }
              }}
              className="inline-flex items-center gap-2 text-sm text-secondary hover:text-secondary/80 transition-colors"
              data-testid="link-member-admin"
            >
              <Settings className="w-4 h-4" />
              {isAdmin ? "Member Management" : "Admin"}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}