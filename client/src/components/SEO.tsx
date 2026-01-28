import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl: string;
  type?: "website" | "article";
  article?: {
    publishedTime: string;
    modifiedTime?: string;
    author: string;
    section?: string;
  };
  schema?: object;
}

export function SEO({ 
  title, 
  description, 
  canonicalUrl, 
  type = "website",
  article,
  schema 
}: SEOProps) {
  useEffect(() => {
    document.title = title;

    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (meta) {
        meta.setAttribute("content", content);
      } else {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        meta.setAttribute("content", content);
        document.head.appendChild(meta);
      }
    };

    const updateCanonical = (url: string) => {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (link) {
        link.href = url;
      } else {
        link = document.createElement("link");
        link.rel = "canonical";
        link.href = url;
        document.head.appendChild(link);
      }
    };

    updateMetaTag("description", description);
    updateMetaTag("title", title);
    updateCanonical(canonicalUrl);

    updateMetaTag("og:title", title, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:url", canonicalUrl, true);
    updateMetaTag("og:type", type, true);

    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:url", canonicalUrl);

    if (article) {
      updateMetaTag("article:published_time", article.publishedTime, true);
      if (article.modifiedTime) {
        updateMetaTag("article:modified_time", article.modifiedTime, true);
      }
      updateMetaTag("article:author", article.author, true);
      if (article.section) {
        updateMetaTag("article:section", article.section, true);
      }
    }

    if (schema) {
      const existingSchema = document.getElementById("dynamic-schema");
      if (existingSchema) {
        existingSchema.remove();
      }
      const script = document.createElement("script");
      script.id = "dynamic-schema";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      const dynamicSchema = document.getElementById("dynamic-schema");
      if (dynamicSchema) {
        dynamicSchema.remove();
      }
    };
  }, [title, description, canonicalUrl, type, article, schema]);

  return null;
}
