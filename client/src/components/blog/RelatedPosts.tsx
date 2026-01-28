import { Link } from "wouter";
import { ChevronRight, BookOpen } from "lucide-react";
import { formatDate, type BlogPost } from "@/data/blog-posts";

interface RelatedPostsProps {
  posts: BlogPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <div className="mt-12">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5 text-secondary" />
        <h2 className="text-2xl font-serif font-bold text-primary">Related Articles</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <article className="h-full bg-white border border-border rounded-xl p-5 hover:border-accent-pop/40 hover:shadow-md transition-all group cursor-pointer">
              <span className="inline-block mb-2 px-2 py-0.5 bg-secondary/10 text-secondary text-xs font-semibold rounded">
                {post.category}
              </span>
              <h3 className="text-base font-bold text-primary leading-tight mb-2 group-hover:text-accent-pop transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{formatDate(post.date)}</span>
                <span className="inline-flex items-center gap-1 text-secondary text-xs font-semibold group-hover:text-accent-pop transition-colors">
                  Read
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
