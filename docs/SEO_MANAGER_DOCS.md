# SEO Manager Documentation

The SEO Manager component provides comprehensive SEO functionality for your Astro v5 website, handling meta tags, Open Graph, Twitter Cards, and structured data.

## Features

- ✅ Primary meta tags (title, description, keywords, author, robots)
- ✅ Open Graph meta tags for Facebook and other social platforms
- ✅ Twitter Card meta tags
- ✅ Structured data (JSON-LD) for search engines
- ✅ Canonical URLs
- ✅ Article-specific meta tags for blog posts
- ✅ Automatic absolute URL generation
- ✅ TypeScript support with full type safety

## Quick Start

### 1. Basic Usage

```astro
---
import Layout from "@/layouts/Layout.astro";

const seoConfig = {
  title: "My Page Title",
  description: "My page description",
  keywords: ["keyword1", "keyword2", "keyword3"]
};
---

<Layout {...seoConfig}>
  <main>
    <!-- Your page content -->
  </main>
</Layout>
```

### 2. Using Predefined Page Configurations

```astro
---
import Layout from "@/layouts/Layout.astro";
import { getPageSEO } from "@/utils/seo";

const seoConfig = getPageSEO('home'); // or 'about', 'projects', 'contact'
---

<Layout {...seoConfig}>
  <!-- Your content -->
</Layout>
```

### 3. Custom Configuration with Merge

```astro
---
import Layout from "@/layouts/Layout.astro";
import { mergeSEOConfig } from "@/utils/seo";

const seoConfig = mergeSEOConfig({
  title: "Custom Page Title",
  description: "Custom description for this specific page",
  keywords: ["custom", "keywords"]
});
---

<Layout {...seoConfig}>
  <!-- Your content -->
</Layout>
```

## Configuration Options

All options are optional and have sensible defaults:

### Basic Options

- `title`: Page title (string)
- `description`: Page description (string)
- `keywords`: Array of keywords (string[])
- `author`: Content author (string)
- `robots`: Robot instructions (string, default: "index, follow")
- `canonical`: Canonical URL (string)

### Social Media Options

- `image`: Social media image URL (string)
- `imageAlt`: Alt text for social media image (string)
- `twitterHandle`: Twitter handle (string, e.g., "@username")
- `siteName`: Site name for Open Graph (string)
- `locale`: Content locale (string, default: "en_US")

### Content Type Options

- `type`: Content type - "website", "article", or "profile" (default: "website")
- `section`: Content section for articles (string)
- `tags`: Tags for articles (string[])
- `publishedTime`: Publication date for articles (ISO string)
- `modifiedTime`: Last modified date for articles (ISO string)

### Advanced Options

- `structuredData`: Custom structured data object (Record<string, any>)

## Page Type Examples

### Website/Homepage

```astro
---
const seoConfig = {
  title: "My Website - Welcome",
  description: "Welcome to my personal website",
  type: "website",
  image: "/home-banner.jpg"
};
---
```

### Blog Article

```astro
---
const seoConfig = {
  title: "How to Build Better Websites",
  description: "A comprehensive guide to modern web development",
  type: "article",
  section: "Web Development",
  tags: ["HTML", "CSS", "JavaScript"],
  publishedTime: "2024-01-15T10:00:00Z",
  modifiedTime: "2024-01-16T14:30:00Z",
  image: "/blog/web-development.jpg"
};
---
```

### Profile Page

```astro
---
const seoConfig = {
  title: "About John Doe - Web Developer",
  description: "Learn about John Doe's journey in web development",
  type: "profile",
  image: "/profile.jpg"
};
---
```

## Structured Data

The SEO Manager automatically generates appropriate structured data based on the content type:

### Person (Profile/Homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Jonas Perusquia Morales",
  "jobTitle": "Chief Technology Officer",
  "description": "...",
  "url": "https://jonaspm.github.io",
  "image": "/profile.png",
  "sameAs": ["..."],
  "worksFor": {...},
  "knowsAbout": [...]
}
```

### Article (Blog Posts)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "description": "Article description",
  "image": "/article-image.jpg",
  "datePublished": "2024-01-15T10:00:00Z",
  "dateModified": "2024-01-15T10:00:00Z",
  "author": {...},
  "publisher": {...}
}
```

### Custom Structured Data

You can provide your own structured data:

```astro
---
const seoConfig = {
  title: "My Product Page",
  structuredData: {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "My Product",
    "description": "Product description",
    "offers": {
      "@type": "Offer",
      "price": "99.99",
      "priceCurrency": "USD"
    }
  }
};
---
```

## Best Practices

### 1. Title Tags
- Keep titles under 60 characters
- Include primary keywords naturally
- Make each page title unique
- Use descriptive, compelling language

### 2. Meta Descriptions
- Keep descriptions between 150-160 characters
- Include primary and secondary keywords
- Write compelling copy that encourages clicks
- Make each description unique

### 3. Keywords
- Use 3-10 relevant keywords per page
- Focus on long-tail keywords
- Include variations and synonyms
- Don't keyword stuff

### 4. Images
- Use high-quality images (1200x630px for social media)
- Include descriptive alt text
- Optimize file sizes for performance
- Use absolute URLs

### 5. URLs
- Use clean, descriptive URLs
- Include primary keywords in URLs
- Avoid special characters and numbers
- Keep URLs under 100 characters

## Validation

You can validate your SEO implementation using these tools:

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [SEO Site Checkup](https://seositecheckup.com/)

## Examples in This Project

- **Homepage**: Uses profile-type structured data with personal information
- **Blog Post**: Demonstrates article-type SEO with publication dates and tags
- **Custom Pages**: Shows how to merge configurations for specific needs

## File Structure

```
src/
├── components/
│   └── SEOManager.astro        # Main SEO component
├── layouts/
│   └── Layout.astro            # Updated to use SEOManager
├── utils/
│   └── seo.ts                  # SEO utility functions and configs
└── pages/
    ├── index.astro             # Homepage with SEO
    └── example-blog-post.astro # Article example
```

## Migration from Hardcoded SEO

If you're migrating from hardcoded meta tags:

1. Remove existing meta tags from your layout
2. Import and use the SEOManager component
3. Move SEO data to the page level or utility functions
4. Test with the validation tools mentioned above

This approach provides much more flexibility and maintainability for your SEO needs!
