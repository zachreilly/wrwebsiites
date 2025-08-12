// Analytics tracking utilities
export class Analytics {
  private static instance: Analytics;
  
  public static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  // Track page view
  public trackPageView(page: string) {
    try {
      fetch('/api/analytics/pageview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page: page,
        }),
      }).catch(error => {
        console.error('Failed to track page view:', error);
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  // Track click event
  public trackClick(element: string, page: string = window.location.pathname) {
    try {
      fetch('/api/analytics/click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          element: element,
          page: page,
        }),
      }).catch(error => {
        console.error('Failed to track click event:', error);
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  // Auto-track all button and link clicks
  public autoTrackClicks() {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      
      // Track button clicks
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        const button = target.tagName === 'BUTTON' ? target : target.closest('button');
        const buttonText = button?.textContent?.trim() || 'Unknown Button';
        this.trackClick(`Button: ${buttonText}`);
      }
      
      // Track link clicks
      if (target.tagName === 'A' || target.closest('a')) {
        const link = target.tagName === 'A' ? target : target.closest('a');
        const linkText = link?.textContent?.trim() || link?.getAttribute('href') || 'Unknown Link';
        this.trackClick(`Link: ${linkText}`);
      }
      
      // Track phone number clicks
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('tel:')) {
        const phoneNumber = target.getAttribute('href')?.replace('tel:', '') || 'Unknown Phone';
        this.trackClick(`Phone Call: ${phoneNumber}`);
      }
      
      // Track email clicks
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('mailto:')) {
        const email = target.getAttribute('href')?.replace('mailto:', '') || 'Unknown Email';
        this.trackClick(`Email: ${email}`);
      }
    });
  }
}

// Export singleton instance
export const analytics = Analytics.getInstance();