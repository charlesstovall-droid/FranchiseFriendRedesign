import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Linkedin, Mail, Phone, Mic, TrendingUp, DollarSign, Users, Building2, Brain, Shield, Podcast, ExternalLink, Instagram, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "20", label: "Franchise Locations Scaled" },
  { value: "4+", label: "Franchise Concepts Owned" },
  { value: "$1.4M+", label: "Active Build-out Experience" },
  { value: "100+", label: "Clients Guided" },
];

const topics = [
  {
    icon: TrendingUp,
    title: "The \"Franchise Friend\" Framework",
    description: "How to identify which of the 500+ available franchise brands actually aligns with your lifestyle, income goals, and risk tolerance — and why most people get it wrong.",
    talking_points: ["The 4-phase discovery process", "Why brand recognition ≠ profitability", "Matching personality to business model"],
  },
  {
    icon: DollarSign,
    title: "Financing Franchise Ownership in 2026",
    description: "SBA loans, ROBS (401k rollovers), portfolio lending, and creative deal structures — breaking down how real people fund franchise purchases with little to no money out of pocket.",
    talking_points: ["ROBS strategy deep dive", "SBA 7(a) loan mechanics", "Under-capitalization: the silent killer"],
  },
  {
    icon: Building2,
    title: "From 1 Location to 20: The Multi-Unit Playbook",
    description: "The real story of scaling from a single Massage Envy in Virginia to 20 locations across the Southeast — the wins, the losses, and the lessons that changed everything.",
    talking_points: ["Hiring your first general manager", "Territory strategy from Day 1", "When to scale vs. when to stabilize"],
  },
  {
    icon: Users,
    title: "The Corporate Refugee Roadmap",
    description: "Why high-earning professionals are leaving corporate America for franchise ownership — and the ego check, mindset shift, and financial planning it takes to do it right.",
    talking_points: ["Semi-absentee vs. owner-operator models", "The 'golden handcuffs' problem", "Year 1 reality vs. expectations"],
  },
  {
    icon: Brain,
    title: "AI & Technology in Modern Franchising",
    description: "How forward-thinking franchisors are using AI to automate scheduling, optimize marketing, and give franchisees their lives back — and why it's a competitive advantage.",
    talking_points: ["AI dispatching and scheduling", "Marketing automation for franchisees", "Tech-forward brands vs. legacy systems"],
  },
  {
    icon: Shield,
    title: "Reading the FDD Like a Pro",
    description: "The Franchise Disclosure Document is a 200+ page legal minefield. I break down the items that matter most — and the red flags that could cost you six figures.",
    talking_points: ["Item 19 financial analysis", "Territory traps and renewal clauses", "Non-compete landmines"],
  },
];

const mediaAppearances = [
  "Available for in-studio, remote, and video podcast formats",
  "Professional audio setup for remote recordings",
  "Flexible scheduling — early mornings, evenings, and weekends",
  "Happy to promote episodes across my network and social channels",
  "Can provide custom talking points tailored to your audience",
];

export default function Speaking() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#1B2B3A] text-white">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#D4AF37] transition-colors" data-testid="link-back-home">
            <ArrowLeft size={16} />
            Back to CharlesStovall.com
          </Link>
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-20 pt-8">
          <div className="grid md:grid-cols-3 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="md:col-span-1"
            >
              <div className="sticky top-10">
                <div className="aspect-square bg-gray-700 rounded-2xl mb-6 overflow-hidden shadow-2xl border-2 border-[#D4AF37]/30">
                  <img
                    src="/charles-speaking-headshot.png"
                    alt="Charles Stovall — Franchise Consultant & Multi-Unit Owner"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    data-testid="img-charles-speaking"
                  />
                </div>

                <h2 className="text-2xl font-serif font-bold text-white" data-testid="text-speaker-name">Charles Stovall</h2>
                <p className="text-[#D4AF37] font-semibold tracking-wide text-sm uppercase mb-2">Franchise Advisor & Multi-Unit Owner</p>
                <p className="text-gray-400 text-sm mb-6">Charleston, SC — Available Nationwide</p>

                <div className="space-y-3 mb-8">
                  <a href="https://calendly.com/charles-stovall/intro" target="_blank" rel="noopener noreferrer" className="w-full" data-testid="link-book-interview">
                    <Button className="w-full bg-[#D4AF37] hover:bg-[#c9a432] text-[#1B2B3A] font-bold text-sm h-12 gap-2">
                      <Calendar size={18} />
                      Book Me for Your Podcast
                    </Button>
                  </a>
                  <a href="mailto:charles@franchisefriend.net" className="w-full block" data-testid="link-email">
                    <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-white/10 hover:text-white font-semibold text-sm h-11 gap-2">
                      <Mail size={16} />
                      charles@franchisefriend.net
                    </Button>
                  </a>
                  <a href="tel:9198273921" className="w-full block" data-testid="link-phone">
                    <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-white/10 hover:text-white font-semibold text-sm h-11 gap-2">
                      <Phone size={16} />
                      (919) 827-3921
                    </Button>
                  </a>
                </div>

                <div className="border-t border-gray-700 pt-6">
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-semibold">Connect</p>
                  <div className="space-y-3">
                    <a href="https://www.charlesstovall.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-[#D4AF37] transition-colors text-sm" data-testid="link-website">
                      <Globe size={18} />
                      charlesstovall.com
                      <ExternalLink size={12} className="ml-auto" />
                    </a>
                    <a href="https://www.linkedin.com/in/charlesstovall/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-[#D4AF37] transition-colors text-sm" data-testid="link-linkedin">
                      <Linkedin size={18} />
                      LinkedIn
                      <ExternalLink size={12} className="ml-auto" />
                    </a>
                    <a href="https://www.instagram.com/thefranchisefriend" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-[#D4AF37] transition-colors text-sm" data-testid="link-instagram">
                      <Instagram size={18} />
                      Instagram
                      <ExternalLink size={12} className="ml-auto" />
                    </a>
                    <a href="/podcasts" className="flex items-center gap-3 text-gray-400 hover:text-[#D4AF37] transition-colors text-sm" data-testid="link-podcast">
                      <Podcast size={18} />
                      The Franchise Friend Podcast
                      <ExternalLink size={12} className="ml-auto" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="md:col-span-2"
            >
              <div className="mb-2">
                <span className="inline-block text-[#D4AF37] text-xs font-semibold tracking-[0.2em] uppercase mb-4">Podcast & Media Guest</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight" data-testid="text-speaking-headline">
                The Franchise Expert Your Audience Needs to Hear
              </h1>

              <p className="text-lg text-gray-300 mb-4 leading-relaxed">
                I've personally owned and scaled <strong className="text-white">20 franchise locations</strong> across four different concepts — Massage Envy, Image Studios, YogaSix, and more. I've navigated mergers, acquisitions, million-dollar build-outs, and the gut-wrenching reality of Year 1 ownership.
              </p>
              <p className="text-lg text-gray-300 mb-10 leading-relaxed">
                Today, as a certified franchise consultant with FranChoice, I help your listeners understand that franchising isn't just about fast food — it's a sophisticated investment vehicle that can replace a corporate salary, build generational wealth, and give people the life they actually want.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                    className="bg-white/5 border border-gray-700 rounded-xl p-4 text-center"
                  >
                    <span className="block text-2xl font-bold text-[#D4AF37]" data-testid={`stat-value-${i}`}>{stat.value}</span>
                    <span className="text-xs text-gray-400 leading-tight">{stat.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[#D4AF37] text-xs font-semibold tracking-[0.2em] uppercase">What We Can Talk About</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1B2B3A] mt-3">Core Podcast Topics</h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">Each topic comes with real stories, actionable frameworks, and the kind of candid insight that keeps audiences engaged and coming back for more.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {topics.map((topic, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#D4AF37]/30 transition-all duration-300"
                data-testid={`topic-card-${i}`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#1B2B3A] rounded-xl flex items-center justify-center flex-shrink-0">
                    <topic.icon size={22} className="text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-bold text-[#1B2B3A]">{topic.title}</h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{topic.description}</p>
                <div className="flex flex-wrap gap-2">
                  {topic.talking_points.map((point, j) => (
                    <span key={j} className="text-xs bg-[#1B2B3A]/5 text-[#1B2B3A] px-3 py-1.5 rounded-full font-medium">{point}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#D4AF37] text-xs font-semibold tracking-[0.2em] uppercase">Why Book Charles</span>
              <h2 className="text-3xl font-serif font-bold text-[#1B2B3A] mt-3 mb-6">I Don't Give Textbook Answers</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Your audience doesn't want another corporate talking head reading from a script. They want someone who's been in the trenches — who's signed personal guarantees, managed payroll for 200+ employees, and built a business from a single location to a multi-state operation.
              </p>
              <p className="text-gray-600 leading-relaxed">
                I bring energy, real stories, and frameworks your listeners can actually use. Whether your show is about entrepreneurship, investing, career transitions, or wealth building — I'll make your episode one they share with friends.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <h3 className="font-serif font-bold text-[#1B2B3A] mb-4 flex items-center gap-2">
                <Mic size={20} className="text-[#D4AF37]" />
                Media Info
              </h3>
              <ul className="space-y-3">
                {mediaAppearances.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full flex-shrink-0 mt-1.5"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1B2B3A] py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">Let's Make Your Next Episode Unforgettable</h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
              I'm ready to bring real franchise stories, actionable advice, and the kind of energy that keeps your audience hitting play.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://calendly.com/charles-stovall/intro" target="_blank" rel="noopener noreferrer" data-testid="link-book-bottom">
                <Button className="bg-[#D4AF37] hover:bg-[#c9a432] text-[#1B2B3A] font-bold text-base h-14 px-10 gap-2">
                  <Calendar size={20} />
                  Book Me for Your Show
                </Button>
              </a>
              <a href="mailto:charles@franchisefriend.net" data-testid="link-email-bottom">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-white/10 hover:text-white font-semibold text-base h-14 px-10 gap-2">
                  <Mail size={20} />
                  Email Me
                </Button>
              </a>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-700 flex flex-wrap justify-center gap-6">
              <a href="https://www.charlesstovall.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#D4AF37] transition-colors text-sm flex items-center gap-2">
                <Globe size={16} /> Website
              </a>
              <a href="https://www.linkedin.com/in/charlesstovall/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#D4AF37] transition-colors text-sm flex items-center gap-2">
                <Linkedin size={16} /> LinkedIn
              </a>
              <a href="https://www.instagram.com/thefranchisefriend" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#D4AF37] transition-colors text-sm flex items-center gap-2">
                <Instagram size={16} /> Instagram
              </a>
              <a href="/podcasts" className="text-gray-500 hover:text-[#D4AF37] transition-colors text-sm flex items-center gap-2">
                <Podcast size={16} /> Franchise Friend Podcast
              </a>
              <a href="tel:9198273921" className="text-gray-500 hover:text-[#D4AF37] transition-colors text-sm flex items-center gap-2">
                <Phone size={16} /> (919) 827-3921
              </a>
              <a href="mailto:charles@franchisefriend.net" className="text-gray-500 hover:text-[#D4AF37] transition-colors text-sm flex items-center gap-2">
                <Mail size={16} /> charles@franchisefriend.net
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
