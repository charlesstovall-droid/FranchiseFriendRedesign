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
    title: "Placeholder Post 4",
    date: "2026-01-04",
    category: "Trends",
    slug: "placeholder-post-4",
    excerpt: "Excerpt for post 4 goes here.",
    content: "Full content goes here..."
  },
  {
    id: 5,
    title: "Placeholder Post 5",
    date: "2026-01-03",
    category: "Financials",
    slug: "placeholder-post-5",
    excerpt: "Excerpt for post 5 goes here.",
    content: "Full content goes here..."
  },
  {
    id: 6,
    title: "Placeholder Post 6",
    date: "2026-01-02",
    category: "Lifestyle",
    slug: "placeholder-post-6",
    excerpt: "Excerpt for post 6 goes here.",
    content: "Full content goes here..."
  },
  {
    id: 7,
    title: "Placeholder Post 7",
    date: "2026-01-01",
    category: "Trends",
    slug: "placeholder-post-7",
    excerpt: "Excerpt for post 7 goes here.",
    content: "Full content goes here..."
  },
  {
    id: 8,
    title: "Placeholder Post 8",
    date: "2025-12-28",
    category: "Financials",
    slug: "placeholder-post-8",
    excerpt: "Excerpt for post 8 goes here.",
    content: "Full content goes here..."
  },
  {
    id: 9,
    title: "Placeholder Post 9",
    date: "2025-12-25",
    category: "Lifestyle",
    slug: "placeholder-post-9",
    excerpt: "Excerpt for post 9 goes here.",
    content: "Full content goes here..."
  },
  {
    id: 10,
    title: "Placeholder Post 10",
    date: "2025-12-20",
    category: "Trends",
    slug: "placeholder-post-10",
    excerpt: "Excerpt for post 10 goes here.",
    content: "Full content goes here..."
  },
  {
    id: 11,
    title: "Placeholder Post 11",
    date: "2025-12-15",
    category: "Financials",
    slug: "placeholder-post-11",
    excerpt: "Excerpt for post 11 goes here.",
    content: "Full content goes here..."
  },
  {
    id: 12,
    title: "Placeholder Post 12",
    date: "2025-12-10",
    category: "Lifestyle",
    slug: "placeholder-post-12",
    excerpt: "Excerpt for post 12 goes here.",
    content: "Full content goes here..."
  },
  {
    id: 13,
    title: "Placeholder Post 13",
    date: "2025-12-05",
    category: "Trends",
    slug: "placeholder-post-13",
    excerpt: "Excerpt for post 13 goes here.",
    content: "Full content goes here..."
  },
  {
    id: 14,
    title: "Placeholder Post 14",
    date: "2025-12-01",
    category: "Financials",
    slug: "placeholder-post-14",
    excerpt: "Excerpt for post 14 goes here.",
    content: "Full content goes here..."
  },
  {
    id: 15,
    title: "Placeholder Post 15",
    date: "2025-11-25",
    category: "Lifestyle",
    slug: "placeholder-post-15",
    excerpt: "Excerpt for post 15 goes here.",
    content: "Full content goes here..."
  },
  {
    id: 16,
    title: "Placeholder Post 16",
    date: "2025-11-20",
    category: "Trends",
    slug: "placeholder-post-16",
    excerpt: "Excerpt for post 16 goes here.",
    content: "Full content goes here..."
  },
  {
    id: 17,
    title: "Placeholder Post 17",
    date: "2025-11-15",
    category: "Financials",
    slug: "placeholder-post-17",
    excerpt: "Excerpt for post 17 goes here.",
    content: "Full content goes here..."
  },
  {
    id: 18,
    title: "Placeholder Post 18",
    date: "2025-11-10",
    category: "Lifestyle",
    slug: "placeholder-post-18",
    excerpt: "Excerpt for post 18 goes here.",
    content: "Full content goes here..."
  },
  {
    id: 19,
    title: "Placeholder Post 19",
    date: "2025-11-05",
    category: "Trends",
    slug: "placeholder-post-19",
    excerpt: "Excerpt for post 19 goes here.",
    content: "Full content goes here..."
  },
  {
    id: 20,
    title: "Placeholder Post 20",
    date: "2025-11-01",
    category: "Financials",
    slug: "placeholder-post-20",
    excerpt: "Excerpt for post 20 goes here.",
    content: "Full content goes here..."
  }
];

export const categories = ["All", "Trends", "Financials", "Lifestyle"] as const;

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
