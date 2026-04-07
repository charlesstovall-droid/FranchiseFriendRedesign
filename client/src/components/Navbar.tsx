import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Youtube, Instagram, Linkedin } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Speaking", href: "/speaking" },
    { name: "About", href: "#about" },
    { name: "Insights", href: "/blog" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <a 
        href="tel:9198273921" 
        className="bg-[#0A1F3C] text-white py-2 px-4 flex items-center justify-center gap-2 hover:bg-[#0A1F3C]/90 transition-colors"
        data-testid="button-call-top"
      >
        <Phone size={16} className="animate-pulse" />
        <span className="font-semibold text-sm">Call Now: (919) 827-3921</span>
      </a>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between py-5 px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3.5 flex-shrink-0">
            <img 
              src="/cs-shield-logo.png" 
              alt="Charles Stovall Logo" 
              className="w-10 h-10 object-contain flex-shrink-0"
            />
            <div className="flex flex-col justify-center gap-1.5 min-w-0">
              <span className="font-serif font-bold text-sm leading-none text-primary truncate">Charles Stovall</span>
              <span className="text-[9px] uppercase tracking-widest text-secondary font-semibold leading-none">Franchise Friend</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-16 flex-shrink-0">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-semibold text-[#0A1F3C] hover:text-[#C9A84C] transition-colors whitespace-nowrap uppercase tracking-wide relative"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-pop group-hover:w-full transition-all"></span>
              </a>
            ))}
            <Link href="/client-portal">
              <Button 
                variant="outline" 
                className="border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C]/10 bg-white font-semibold text-[11px] uppercase tracking-wide h-8 px-3 py-1"
                data-testid="button-client-portal"
              >
                Candidate Portal
              </Button>
            </Link>
            <a href="https://calendly.com/charles-stovall/intro" target="_blank" rel="noopener noreferrer">
              <Button className="bg-[#C9A84C] text-[#0A1F3C] hover:bg-[#b8953f] font-semibold text-[11px] uppercase tracking-wide h-8 px-3 py-1">
                Book Consultation
              </Button>
            </a>
            <div className="flex items-center gap-4 ml-4 border-l border-border/40 pl-4">
              <a href="https://www.youtube.com/@yourfranchisefriend" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent-pop transition-colors" title="YouTube">
                <Youtube size={18} />
              </a>
              <a href="https://www.linkedin.com/in/charles-stovall/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent-pop transition-colors" title="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="https://www.instagram.com/thefranchisefriend" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent-pop transition-colors" title="Instagram">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-primary flex-shrink-0 ml-2"
            onClick={() => setIsOpen(!isOpen)}
            data-testid="button-mobile-menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-gray-200 bg-white overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-[#0A1F3C] py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <Link href="/client-portal" onClick={() => setIsOpen(false)}>
                <Button 
                  variant="outline" 
                  className="w-full border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C]/10 bg-white font-semibold"
                >
                  Candidate Portal
                </Button>
              </Link>
              <a href="https://calendly.com/charles-stovall/intro" target="_blank" rel="noopener noreferrer" className="w-full">
                <Button className="w-full bg-[#C9A84C] text-[#0A1F3C] hover:bg-[#b8953f] font-semibold">
                  Book a Consultation
                </Button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}