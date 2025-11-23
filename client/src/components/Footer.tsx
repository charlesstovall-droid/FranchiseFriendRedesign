import { Facebook, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-secondary rounded-sm flex items-center justify-center">
                <span className="font-serif font-bold text-secondary-foreground text-xl">F</span>
              </div>
              <span className="font-serif font-bold text-xl tracking-tight text-white">Franchise Friend</span>
            </div>
            <p className="text-primary-foreground/70 leading-relaxed mb-6">
              Guiding you through the complexities of franchise ownership with honesty, integrity, and experience.
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

        <div className="border-t border-white/10 pt-8 text-center text-sm text-primary-foreground/40">
          <p>&copy; {new Date().getFullYear()} Franchise Friend. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}