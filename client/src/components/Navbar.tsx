import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "Brands", href: "/franchise-brands" },
    { name: "Podcast", href: "/podcasts" },
    { name: "About", href: "#about" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between py-4 px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 bg-primary rounded flex items-center justify-center flex-shrink-0">
              <span className="font-serif font-bold text-primary-foreground text-xs">CS</span>
            </div>
            <div className="flex flex-col justify-center gap-1 min-w-0">
              <span className="font-serif font-bold text-xs leading-none text-primary truncate">Charles Stovall</span>
              <span className="text-[8px] uppercase tracking-wider text-secondary font-semibold leading-none">Franchise Friend</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10 flex-shrink-0">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors whitespace-nowrap uppercase tracking-wide"
              >
                {link.name}
              </a>
            ))}
            <Link href="/client-portal">
              <Button 
                variant="outline" 
                className="border-secondary text-secondary hover:bg-secondary/10 font-semibold text-xs uppercase tracking-wide h-9"
                data-testid="button-client-portal"
              >
                Client Portal
              </Button>
            </Link>
            <a href="#contact">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs uppercase tracking-wide h-9">
                Book a Consultation
              </Button>
            </a>
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
            className="md:hidden border-b border-border bg-background overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-foreground py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <Link href="/client-portal" onClick={() => setIsOpen(false)}>
                <Button 
                  variant="outline" 
                  className="w-full border-secondary text-secondary hover:bg-secondary/10 font-semibold"
                >
                  Client Portal
                </Button>
              </Link>
              <a href="#contact" className="w-full">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
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