import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronLeft, Calendar } from "lucide-react";
import { useRoute, Link } from "wouter";
import { 
  getPostBySlug, 
  formatDate, 
  getRelatedPosts, 
  calculateReadingTime,
  extractHeadings,
  addHeadingIds 
} from "@/data/blog-posts";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { KeyTakeaways } from "@/components/blog/KeyTakeaways";
import { FAQSection } from "@/components/blog/FAQSection";
import { AuthorBio } from "@/components/blog/AuthorBio";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { SocialShare } from "@/components/blog/SocialShare";
import { ReadingTime } from "@/components/blog/ReadingTime";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function getMetaDescription(excerpt: string, content: string): string {
  const plainExcerpt = stripHtml(excerpt);
  if (plainExcerpt.length >= 120 && plainExcerpt.length <= 160) {
    return plainExcerpt;
  }
  
  const plainContent = stripHtml(content);
  const combined = `${plainExcerpt} ${plainContent}`;
  return combined.substring(0, 155).trim() + "...";
}

function convertHeadings(html: string): string {
  return html
    .replace(/<h4>/g, '<h3>')
    .replace(/<\/h4>/g, '</h3>')
    .replace(/<h3>/g, '<h2>')
    .replace(/<\/h3>/g, '</h2>')
    .replace(/<h5>/g, '<h3>')
    .replace(/<\/h5>/g, '</h3>');
}

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);
  
  const post = slug ? getPostBySlug(slug) : null;
  
  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SEO 
          title="Post Not Found | Charles Stovall"
          description="The blog post you're looking for doesn't exist. Browse our franchise consulting articles and guides."
          canonicalUrl="https://www.charlesstovall.com/blog"
        />
        <Navbar />
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
            <h1 className="text-4xl font-serif font-bold text-primary mb-6">Post Not Found</h1>
            <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
            <Link href="/blog">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  const canonicalUrl = `https://www.charlesstovall.com/blog/${post.slug}`;
  const metaDescription = getMetaDescription(post.excerpt, post.content);
  const convertedContent = convertHeadings(post.content);
  const processedContent = addHeadingIds(convertedContent);
  const headings = extractHeadings(convertedContent);
  const readingTime = calculateReadingTime(post.content);
  const relatedPosts = getRelatedPosts(post.slug, post.category, 3);

  const blogPostSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": canonicalUrl,
    "headline": post.title,
    "description": metaDescription,
    "image": "https://www.charlesstovall.com/opengraph.jpg",
    "author": {
      "@id": "https://www.charlesstovall.com/#person"
    },
    "publisher": {
      "@id": "https://www.charlesstovall.com/#organization"
    },
    "datePublished": post.date,
    "dateModified": post.date,
    "articleSection": post.category,
    "keywords": `franchise consulting, ${post.category.toLowerCase()}, Charleston SC, franchise investment`,
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "wordCount": stripHtml(post.content).split(' ').length
  };

  const faqSchema = post.faqs && post.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  const combinedSchema = faqSchema 
    ? [blogPostSchema, faqSchema]
    : blogPostSchema;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO 
        title={`${post.title} | Charles Stovall`}
        description={metaDescription}
        canonicalUrl={canonicalUrl}
        type="article"
        article={{
          publishedTime: post.date,
          modifiedTime: post.date,
          author: "Charles Stovall",
          section: post.category
        }}
        schema={combinedSchema}
      />
      <Navbar />
      
      <section className="pt-32 pb-12 bg-gradient-to-r from-primary via-primary/95 to-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link href="/blog">
              <Button 
                variant="ghost" 
                className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 mb-6"
                data-testid="button-back-to-blog"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Insights
              </Button>
            </Link>
            <span className="inline-block mb-4 px-3 py-1 bg-secondary/20 text-secondary text-sm font-semibold rounded">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-primary-foreground/70">
              <span className="inline-flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(post.date)}
              </span>
              <span>•</span>
              <ReadingTime minutes={readingTime} />
              <span>•</span>
              <span>Charles Stovall</span>
            </div>
            <div className="mt-6 pt-6 border-t border-white/20">
              <SocialShare url={canonicalUrl} title={post.title} />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {post.keyTakeaways && post.keyTakeaways.length > 0 && (
              <KeyTakeaways takeaways={post.keyTakeaways} />
            )}

            {headings.length > 2 && (
              <TableOfContents headings={headings} />
            )}

            <div className="bg-white border border-border rounded-xl p-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6 italic border-l-4 border-secondary/30 pl-4">
                {post.excerpt}
              </p>
              <div 
                className="prose prose-lg max-w-none text-foreground 
                  [&_p]:mb-4 [&_p]:leading-relaxed [&_i]:italic
                  [&_h2]:text-2xl [&_h2]:font-serif [&_h2]:font-bold [&_h2]:text-primary [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:scroll-mt-24
                  [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-primary [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:scroll-mt-24
                  [&_ul]:my-4 [&_ul]:pl-6 [&_li]:mb-2 [&_li]:text-foreground
                  [&_ol]:my-4 [&_ol]:pl-6 [&_ol_li]:mb-2
                  [&_table]:w-full [&_table]:my-6 [&_table]:border-collapse
                  [&_th]:bg-secondary/10 [&_th]:p-3 [&_th]:text-left [&_th]:font-semibold [&_th]:border [&_th]:border-border
                  [&_td]:p-3 [&_td]:border [&_td]:border-border
                  [&_strong]:font-semibold [&_strong]:text-primary
                  [&_a]:text-secondary [&_a]:underline [&_a:hover]:text-accent-pop"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            </div>

            {post.faqs && post.faqs.length > 0 && (
              <FAQSection faqs={post.faqs} />
            )}

            <AuthorBio />

            <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-muted-foreground">Found this helpful? Share it with others:</p>
              <SocialShare url={canonicalUrl} title={post.title} />
            </div>

            <RelatedPosts posts={relatedPosts} />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-12 bg-primary text-primary-foreground rounded-xl p-8 text-center"
            >
              <h2 className="text-2xl font-serif font-bold mb-4">Ready to Explore Franchise Opportunities?</h2>
              <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
                Get personalized guidance from a certified franchise consultant. 
                Let's find the right franchise fit for your goals and lifestyle.
              </p>
              <a href="https://calendly.com/charles-stovall/intro" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-accent-pop text-primary hover:bg-accent-pop/90 font-semibold">
                  Book a Free Consultation
                </Button>
              </a>
            </motion.div>
          </motion.article>
        </div>
      </section>

      <Footer />
    </div>
  );
}
