import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Youtube, Instagram, Linkedin, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Issue 8: "For Buyers" dropdown added before "Speaking".
// Accessibility: opens on hover, focus, click/tap.
// Closes on Escape, click outside, and item selection.
// Uses aria-expanded, aria-haspopup, role="menu".

const buyerLinks = [
  { name: "Executive Franchises", href: "/executive-access" },
  { name: "Home-Based Franchises", href: "/home-based-franchises" },
  { name: "Charleston Buyers", href: "/charleston" },
  { name: "Ownership Advisor", href: "/advisor" },
];

const navLinks = [
  { name: "Speaking", href: "/speaking" },
  { name: "About", href: "/about" },
  { name: "Insights", href: "/blog" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileForBuyersOpen, setMobileForBuyersOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);

  const closeDropdown = useCallback(() => setDropdownOpen(false), []);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDropdown();
        dropdownButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [closeDropdown]);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [closeDropdown]);

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
            {/* Hide name text at md breakpoint to prevent collision with nav items; show at lg+ */}
            <div className="hidden lg:flex flex-col justify-center gap-1.5 min-w-0">
              <span className="font-serif font-bold text-sm leading-none text-primary truncate">Charles Stovall</span>
              <span className="text-[9px] uppercase tracking-widest text-secondary font-semibold leading-none">Franchise Friend</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-5 lg:gap-10 flex-shrink-0">

            {/* For Buyers dropdown — Issue 8 */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                ref={dropdownButtonRef}
                onClick={() => setDropdownOpen((v) => !v)}
                onFocus={() => setDropdownOpen(true)}
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
                className="flex items-center gap-1 text-xs font-semibold text-[#0A1F3C] hover:text-[#C9A84C] transition-colors whitespace-nowrap uppercase tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] rounded"
                data-testid="button-for-buyers-dropdown"
              >
                For Buyers
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    role="menu"
                    aria-label="For Buyers navigation"
                    className="absolute left-0 top-full mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50"
                  >
                    {buyerLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        role="menuitem"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-3 text-sm text-[#0A1F3C] hover:bg-[#C9A84C]/10 hover:text-[#C9A84C] transition-colors font-medium focus:outline-none focus-visible:bg-[#C9A84C]/10 focus-visible:text-[#C9A84C]"
                        data-testid={`nav-buyer-link-${link.name.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-semibold text-[#0A1F3C] hover:text-[#C9A84C] transition-colors whitespace-nowrap uppercase tracking-wide"
                data-testid={`nav-link-${link.name.toLowerCase()}`}
              >
                {link.name}
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
              <Button
                className="bg-[#C9A84C] text-[#0A1F3C] hover:bg-[#b8953f] font-semibold text-[11px] uppercase tracking-wide h-8 px-3 py-1"
                data-testid="button-book-consultation"
              >
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
            aria-label={isOpen ? "Close menu" : "Open menu"}
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
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">

              {/* For Buyers nested group — mobile */}
              <div>
                <button
                  onClick={() => setMobileForBuyersOpen((v) => !v)}
                  aria-expanded={mobileForBuyersOpen}
                  className="w-full flex items-center justify-between text-lg font-medium text-[#0A1F3C] py-2 px-2 hover:text-[#C9A84C] transition-colors"
                  data-testid="button-mobile-for-buyers"
                >
                  <span>For Buyers</span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${mobileForBuyersOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {mobileForBuyersOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pl-4"
                    >
                      {buyerLinks.map((link) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          onClick={() => { setIsOpen(false); setMobileForBuyersOpen(false); }}
                          className="block py-2 px-2 text-base text-[#0A1F3C]/80 hover:text-[#C9A84C] transition-colors"
                          data-testid={`mobile-buyer-link-${link.name.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-[#0A1F3C] py-2 px-2 hover:text-[#C9A84C] transition-colors"
                  onClick={() => setIsOpen(false)}
                  data-testid={`mobile-nav-link-${link.name.toLowerCase()}`}
                >
                  {link.name}
                </a>
              ))}

              <div className="pt-2 flex flex-col gap-3">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
