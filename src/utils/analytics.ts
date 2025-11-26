/**
 * Google Analytics 4 Event Tracking Utilities
 *
 * Usage:
 * import { trackEvent } from '@/utils/analytics';
 * trackEvent('button_click', { button_name: 'Contact CTA' });
 */

// Type-safe GA4 event tracking
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

interface EventParams {
  [key: string]: string | number | boolean;
}

/**
 * Track custom events to Google Analytics 4
 * @param eventName - Name of the event (e.g., 'form_submit', 'button_click')
 * @param params - Additional parameters for the event
 */
export function trackEvent(eventName: string, params?: EventParams): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
}

/**
 * Track page views (usually called automatically by GA4)
 * @param pageTitle - Title of the page
 * @param pagePath - Path of the page
 */
export function trackPageView(pageTitle: string, pagePath: string): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: pageTitle,
      page_path: pagePath,
      page_location: window.location.href
    });
  }
}

/**
 * Common event helpers for easy tracking
 */
export const analytics = {
  // Form events
  formStart: (formName: string) => trackEvent('form_start', { form_name: formName }),
  formSubmit: (formName: string) => trackEvent('form_submit', { form_name: formName }),
  formError: (formName: string, error: string) => trackEvent('form_error', { form_name: formName, error_message: error }),

  // Button clicks
  buttonClick: (buttonName: string, location?: string) => trackEvent('button_click', {
    button_name: buttonName,
    click_location: location || 'unknown'
  }),

  // CTA interactions
  ctaClick: (ctaText: string, destination: string) => trackEvent('cta_click', {
    cta_text: ctaText,
    destination: destination
  }),

  // Navigation
  linkClick: (linkText: string, linkUrl: string) => trackEvent('link_click', {
    link_text: linkText,
    link_url: linkUrl
  }),

  // Problem selection (homepage)
  problemSelect: (problemText: string) => trackEvent('problem_select', {
    problem: problemText
  }),

  // Project views
  projectView: (projectName: string, category: string) => trackEvent('project_view', {
    project_name: projectName,
    project_category: category
  }),

  // Engagement
  scrollDepth: (depth: number) => trackEvent('scroll_depth', {
    scroll_percentage: depth
  }),

  // External links
  externalLink: (url: string) => trackEvent('external_link_click', {
    link_url: url
  }),

  // Downloads
  download: (fileName: string) => trackEvent('file_download', {
    file_name: fileName
  }),

  // Video interactions
  videoPlay: (videoName: string) => trackEvent('video_play', {
    video_name: videoName
  }),

  // WhatsApp
  whatsappClick: () => trackEvent('whatsapp_click', {
    action: 'open_whatsapp'
  })
};

/**
 * Set user properties
 * @param properties - User properties to set
 */
export function setUserProperties(properties: EventParams): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', 'user_properties', properties);
  }
}

/**
 * Track exceptions/errors
 * @param description - Description of the error
 * @param fatal - Whether the error is fatal
 */
export function trackException(description: string, fatal: boolean = false): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: description,
      fatal: fatal
    });
  }
}
