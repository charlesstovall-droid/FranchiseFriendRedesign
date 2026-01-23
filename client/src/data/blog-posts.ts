export interface BlogPost {
  id: number;
  title: string;
  date: string;
  category: "Trends" | "Financials" | "Lifestyle";
  slug: string;
  excerpt: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Top Franchise Trends for 2026",
    date: "2026-01-15",
    category: "Trends",
    slug: "top-franchise-trends-2026",
    excerpt: "Discover the emerging franchise opportunities and industry shifts shaping the business landscape in 2026.",
    content: "Full content goes here..."
  },
  {
    id: 2,
    title: "Understanding Franchise Investment Costs",
    date: "2026-01-10",
    category: "Financials",
    slug: "understanding-franchise-investment-costs",
    excerpt: "A comprehensive guide to the financial considerations when evaluating franchise opportunities.",
    content: "Full content goes here..."
  },
  {
    id: 3,
    title: "Work-Life Balance as a Franchise Owner",
    date: "2026-01-05",
    category: "Lifestyle",
    slug: "work-life-balance-franchise-owner",
    excerpt: "How successful franchise owners maintain balance while building their dream business.",
    content: "Full content goes here..."
  },
  {
    id: 4,
    title: "The Rise of Service-Based Franchises",
    date: "2026-01-04",
    category: "Trends",
    slug: "rise-of-service-based-franchises",
    excerpt: "Why service-based franchise models are gaining momentum in the current economy.",
    content: "Full content goes here..."
  },
  {
    id: 5,
    title: "Financing Your Franchise Dream",
    date: "2026-01-03",
    category: "Financials",
    slug: "financing-your-franchise-dream",
    excerpt: "Explore different funding options and strategies for your franchise investment.",
    content: "Full content goes here..."
  },
  {
    id: 6,
    title: "Building a Lifestyle You Love Through Franchising",
    date: "2026-01-02",
    category: "Lifestyle",
    slug: "building-lifestyle-through-franchising",
    excerpt: "How franchise ownership can help you design the life you've always wanted.",
    content: "Full content goes here..."
  },
  {
    id: 7,
    title: "Emerging Industries in Franchising",
    date: "2026-01-01",
    category: "Trends",
    slug: "emerging-industries-franchising",
    excerpt: "New sectors and industries opening up exciting franchise opportunities.",
    content: "Full content goes here..."
  },
  {
    id: 8,
    title: "SBA Loans for Franchise Buyers",
    date: "2025-12-28",
    category: "Financials",
    slug: "sba-loans-franchise-buyers",
    excerpt: "How to navigate SBA lending programs for your franchise purchase.",
    content: "Full content goes here..."
  },
  {
    id: 9,
    title: "From Corporate to Franchise Owner",
    date: "2025-12-25",
    category: "Lifestyle",
    slug: "corporate-to-franchise-owner",
    excerpt: "Stories and insights from professionals who made the leap to franchise ownership.",
    content: "Full content goes here..."
  },
  {
    id: 10,
    title: "Technology Trends Shaping Franchising",
    date: "2025-12-20",
    category: "Trends",
    slug: "technology-trends-franchising",
    excerpt: "How technology is transforming franchise operations and customer experience.",
    content: "Full content goes here..."
  },
  {
    id: 11,
    title: "Understanding Franchise Disclosure Documents",
    date: "2025-12-15",
    category: "Financials",
    slug: "understanding-fdd",
    excerpt: "A beginner's guide to reading and understanding franchise disclosure documents.",
    content: "Full content goes here..."
  },
  {
    id: 12,
    title: "Family-Friendly Franchise Ownership",
    date: "2025-12-10",
    category: "Lifestyle",
    slug: "family-friendly-franchise-ownership",
    excerpt: "How to involve your family in your franchise journey and build together.",
    content: "Full content goes here..."
  },
  {
    id: 13,
    title: "Multi-Unit Ownership Strategies",
    date: "2025-12-05",
    category: "Trends",
    slug: "multi-unit-ownership-strategies",
    excerpt: "The growing trend of multi-unit franchise ownership and how to plan for it.",
    content: "Full content goes here..."
  },
  {
    id: 14,
    title: "Franchise ROI Expectations",
    date: "2025-12-01",
    category: "Financials",
    slug: "franchise-roi-expectations",
    excerpt: "Setting realistic expectations for your franchise investment returns.",
    content: "Full content goes here..."
  },
  {
    id: 15,
    title: "The Mindset of Successful Franchise Owners",
    date: "2025-11-25",
    category: "Lifestyle",
    slug: "mindset-successful-franchise-owners",
    excerpt: "Mental habits and attitudes that set thriving franchise owners apart.",
    content: "Full content goes here..."
  },
  {
    id: 16,
    title: "Home Services Franchises on the Rise",
    date: "2025-11-20",
    category: "Trends",
    slug: "home-services-franchises-rise",
    excerpt: "Why home services continue to be a hot sector in franchising.",
    content: "Full content goes here..."
  },
  {
    id: 17,
    title: "Hidden Costs in Franchise Ownership",
    date: "2025-11-15",
    category: "Financials",
    slug: "hidden-costs-franchise-ownership",
    excerpt: "What to look out for beyond the initial franchise fee.",
    content: "Full content goes here..."
  },
  {
    id: 18,
    title: "Time Freedom Through Franchise Ownership",
    date: "2025-11-10",
    category: "Lifestyle",
    slug: "time-freedom-franchise-ownership",
    excerpt: "How owning a franchise can give you more control over your schedule.",
    content: "Full content goes here..."
  },
  {
    id: 19,
    title: "Sustainability Trends in Franchising",
    date: "2025-11-05",
    category: "Trends",
    slug: "sustainability-trends-franchising",
    excerpt: "How eco-conscious practices are becoming a competitive advantage in franchising.",
    content: "Full content goes here..."
  },
  {
    id: 20,
    title: "Exit Strategies for Franchise Owners",
    date: "2025-11-01",
    category: "Financials",
    slug: "exit-strategies-franchise-owners",
    excerpt: "Planning your exit from day one to maximize your franchise investment.",
    content: "Full content goes here..."
  }
];

export const categories = ["All", "Trends", "Financials", "Lifestyle"] as const;
export type Category = typeof categories[number];

export function getLatestPosts(count: number = 3): BlogPost[] {
  return [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

export function getPostsByCategory(category: string): BlogPost[] {
  if (category === "All") return blogPosts;
  return blogPosts.filter(post => post.category === category);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
