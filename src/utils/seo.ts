/**
 * SEO configuration utility for different page types
 */

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  twitterHandle?: string;
  robots?: string;
  canonical?: string;
  siteName?: string;
  locale?: string;
  structuredData?: Record<string, any>;
}

// Default site configuration
export const defaultSEO: SEOConfig = {
  title: 'Jonas Perusquia Morales - Chief Technology Officer',
  description: 'Jonas Perusquia Morales - Chief Technology Officer and Software Engineer with expertise in full-stack development, cloud architecture, and team leadership.',
  keywords: [
    'Jonas Perusquia Morales',
    'CTO',
    'Chief Technology Officer',
    'Software Engineer',
    'Web Developer',
    'Full Stack Developer',
    'Cloud Architecture',
    'Team Leadership',
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'Astro'
  ],
  image: '/profile.png',
  imageAlt: 'Jonas Perusquia Morales - Professional Profile',
  type: 'website',
  author: 'Jonas Perusquia Morales',
  twitterHandle: '@jonaspm',
  robots: 'index, follow',
  siteName: 'Jonas Perusquia Morales',
  locale: 'en_US'
};

// Page-specific SEO configurations
export const pageSEO = {
  home: {
    title: 'Jonas Perusquia Morales - Chief Technology Officer & Software Engineer',
    description: 'Welcome to the portfolio of Jonas Perusquia Morales, a passionate Chief Technology Officer and Software Engineer specializing in full-stack development, cloud architecture, and leading high-performing engineering teams.',
    keywords: [
      ...defaultSEO.keywords!,
      'Portfolio',
      'Personal Website',
      'Technology Leadership',
      'Software Development'
    ],
    type: 'profile' as const,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Jonas Perusquia Morales",
      "jobTitle": "Chief Technology Officer",
      "description": "Chief Technology Officer and Software Engineer with expertise in full-stack development, cloud architecture, and team leadership.",
      "url": "https://jonaspm.github.io",
      "image": "/profile.png",
      "sameAs": [
        "https://linkedin.com/in/jonaspm",
        "https://github.com/jonaspm",
        "https://twitter.com/jonaspm"
      ],
      "worksFor": {
        "@type": "Organization",
        "name": "Technology Companies"
      },
      "knowsAbout": [
        "Software Engineering",
        "Web Development",
        "Cloud Architecture",
        "Team Leadership",
        "Full Stack Development",
        "JavaScript",
        "TypeScript",
        "React",
        "Node.js"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Chihuahua",
        "addressCountry": "Mexico"
      }
    }
  },

  about: {
    title: 'About Jonas Perusquia Morales - CTO & Software Engineer',
    description: 'Learn more about Jonas Perusquia Morales, his journey as a Chief Technology Officer, technical expertise, and passion for building innovative software solutions.',
    keywords: [
      ...defaultSEO.keywords!,
      'About',
      'Biography',
      'Career',
      'Experience',
      'Technical Skills'
    ],
    section: 'About'
  },

  projects: {
    title: 'Projects by Jonas Perusquia Morales - Portfolio & Case Studies',
    description: 'Explore the portfolio of projects developed by Jonas Perusquia Morales, featuring web applications, software solutions, and technical innovations.',
    keywords: [
      ...defaultSEO.keywords!,
      'Projects',
      'Portfolio',
      'Web Applications',
      'Software Solutions',
      'Case Studies'
    ],
    section: 'Projects',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Projects by Jonas Perusquia Morales",
      "description": "Portfolio of projects developed by Jonas Perusquia Morales",
      "author": {
        "@type": "Person",
        "name": "Jonas Perusquia Morales"
      }
    }
  },

  contact: {
    title: 'Contact Jonas Perusquia Morales - Get in Touch',
    description: 'Get in touch with Jonas Perusquia Morales for collaboration opportunities, technical consulting, or to discuss your next software project.',
    keywords: [
      ...defaultSEO.keywords!,
      'Contact',
      'Collaboration',
      'Consulting',
      'Hire',
      'Get in Touch'
    ],
    section: 'Contact',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact Jonas Perusquia Morales",
      "description": "Get in touch with Jonas Perusquia Morales for collaboration opportunities",
      "author": {
        "@type": "Person",
        "name": "Jonas Perusquia Morales"
      }
    }
  }
};

/**
 * Merge default SEO config with page-specific config
 */
export function mergeSEOConfig(pageConfig: Partial<SEOConfig> = {}): SEOConfig {
  return {
    ...defaultSEO,
    ...pageConfig,
    keywords: pageConfig.keywords || defaultSEO.keywords
  };
}

/**
 * Get SEO config for a specific page
 */
export function getPageSEO(page: keyof typeof pageSEO): SEOConfig {
  return mergeSEOConfig(pageSEO[page]);
}
