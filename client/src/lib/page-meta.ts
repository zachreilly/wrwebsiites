export interface PageMeta {
  title: string;
  description: string;
  canonical?: string;
}

export const pageMetaData: Record<string, PageMeta> = {
  '/': {
    title: 'wrwebsites - Professional Web Development Services | Affordable Static Websites UK',
    description: 'Professional static website development from £75. Fast, secure, and affordable web solutions with hosting, domain setup, and ongoing support. Basic and Premium packages starting at just £10/month.',
    canonical: 'https://wrwebsites.com'
  },
  '/onboarding': {
    title: 'Project Onboarding - Tell Us About Your Website | wrwebsites',
    description: 'Complete our quick onboarding form to get started with your professional website. We\'ll gather all the details we need to build your perfect online presence.',
    canonical: 'https://wrwebsites.com/onboarding'
  },
  '/consultation': {
    title: 'Custom Quote - Get a Personalized Estimate | wrwebsites',
    description: 'Need something more advanced? Get a custom quote for your web development project. We offer user authentication, databases, payment processing, and custom features.',
    canonical: 'https://wrwebsites.com/consultation'
  },
  '/portfolio': {
    title: 'Portfolio - Our Recent Projects | wrwebsites',
    description: 'View our portfolio of professional websites we\'ve created for businesses. See the quality and variety of our web development work.',
    canonical: 'https://wrwebsites.com/portfolio'
  },
  '/onboarding-complete': {
    title: 'Onboarding Complete - Next Steps | wrwebsites',
    description: 'Thanks for sending your project details. We will be in touch within 24 hours.',
    canonical: 'https://wrwebsites.com/onboarding-complete'
  },
  '/website-update-request': {
    title: 'Request Website Update | wrwebsites',
    description: 'Submit a request for updates or changes to your website.',
  },
  '/not-found': {
    title: 'Page Not Found | wrwebsites',
    description: 'The page you are looking for could not be found.',
  }
};

export function updatePageMeta(path: string): void {
  const meta = pageMetaData[path] || pageMetaData['/'];
  
  // Update document title
  document.title = meta.title;
  
  // Update meta description
  let descriptionTag = document.querySelector('meta[name="description"]');
  if (descriptionTag) {
    descriptionTag.setAttribute('content', meta.description);
  } else {
    descriptionTag = document.createElement('meta');
    descriptionTag.setAttribute('name', 'description');
    descriptionTag.setAttribute('content', meta.description);
    document.head.appendChild(descriptionTag);
  }
  
  // Update canonical URL - always update or remove if not provided
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (meta.canonical) {
    if (canonicalLink) {
      canonicalLink.setAttribute('href', meta.canonical);
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      canonicalLink.setAttribute('href', meta.canonical);
      document.head.appendChild(canonicalLink);
    }
    // Also update og:url to match canonical
    updateMetaTag('property', 'og:url', meta.canonical);
  } else if (canonicalLink) {
    // Remove canonical and og:url if not specified for this route
    canonicalLink.remove();
    const ogUrlTag = document.querySelector('meta[property="og:url"]');
    if (ogUrlTag) {
      ogUrlTag.remove();
    }
  }
  
  // Update Open Graph tags
  updateMetaTag('property', 'og:title', meta.title.split('|')[0].trim());
  updateMetaTag('property', 'og:description', meta.description);
  updateMetaTag('property', 'og:image', 'https://wrwebsites.com/wrwebsites-logo.png');
  
  // Update Twitter Card tags
  updateMetaTag('name', 'twitter:title', meta.title.split('|')[0].trim());
  updateMetaTag('name', 'twitter:description', meta.description);
  updateMetaTag('name', 'twitter:image', 'https://wrwebsites.com/wrwebsites-logo.png');
}

function updateMetaTag(attrName: string, attrValue: string, content: string): void {
  let tag = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (tag) {
    tag.setAttribute('content', content);
  } else {
    tag = document.createElement('meta');
    tag.setAttribute(attrName, attrValue);
    tag.setAttribute('content', content);
    document.head.appendChild(tag);
  }
}
