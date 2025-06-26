import { config } from './config';
import { captureMessage } from './sentry';

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  userId?: string;
}

interface UserProperties {
  userId: string;
  email?: string;
  name?: string;
  connectsBalance?: number;
  isAdmin?: boolean;
  joinDate?: string;
}

class AnalyticsService {
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized || !config.app.enableAnalytics) return;

    try {
      // Initialize analytics services here
      // Example: Mixpanel, Google Analytics, etc.
      
      if (config.analytics.mixpanelToken) {
        // Initialize Mixpanel
        console.log('Analytics initialized with Mixpanel');
      }

      if (config.analytics.googleAnalyticsId) {
        // Initialize Google Analytics
        console.log('Analytics initialized with Google Analytics');
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Analytics initialization failed:', error);
    }
  }

  async trackEvent(event: AnalyticsEvent) {
    if (!config.app.enableAnalytics) return;

    try {
      await this.initialize();

      // Track with multiple services
      console.log('Analytics Event:', event);

      // Example implementations:
      // mixpanel.track(event.name, event.properties);
      // gtag('event', event.name, event.properties);

      // Also send to Sentry for debugging
      captureMessage(`Analytics: ${event.name}`, 'info');
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  async identifyUser(user: UserProperties) {
    if (!config.app.enableAnalytics) return;

    try {
      await this.initialize();

      console.log('Analytics User Identified:', user);

      // Example implementations:
      // mixpanel.identify(user.userId);
      // mixpanel.people.set(user);
      // gtag('config', config.analytics.googleAnalyticsId, { user_id: user.userId });
    } catch (error) {
      console.error('Failed to identify user:', error);
    }
  }

  async trackScreen(screenName: string, properties?: Record<string, any>) {
    await this.trackEvent({
      name: 'screen_view',
      properties: {
        screen_name: screenName,
        ...properties,
      },
    });
  }

  // Auction-specific tracking methods
  async trackBidPlaced(auctionId: string, bidAmount: number, userId: string) {
    await this.trackEvent({
      name: 'bid_placed',
      properties: {
        auction_id: auctionId,
        bid_amount: bidAmount,
        user_id: userId,
      },
      userId,
    });
  }

  async trackAuctionViewed(auctionId: string, auctionTitle: string, userId?: string) {
    await this.trackEvent({
      name: 'auction_viewed',
      properties: {
        auction_id: auctionId,
        auction_title: auctionTitle,
      },
      userId,
    });
  }

  async trackConnectsPurchased(amount: number, price: number, userId: string) {
    await this.trackEvent({
      name: 'connects_purchased',
      properties: {
        connects_amount: amount,
        price_paid: price,
        user_id: userId,
      },
      userId,
    });
  }

  async trackVideoWatched(connectsEarned: number, userId: string) {
    await this.trackEvent({
      name: 'video_watched',
      properties: {
        connects_earned: connectsEarned,
        user_id: userId,
      },
      userId,
    });
  }

  async trackAuctionWon(auctionId: string, winningBid: number, userId: string) {
    await this.trackEvent({
      name: 'auction_won',
      properties: {
        auction_id: auctionId,
        winning_bid: winningBid,
        user_id: userId,
      },
      userId,
    });
  }

  async trackUserRegistration(userId: string, method: string) {
    await this.trackEvent({
      name: 'user_registered',
      properties: {
        user_id: userId,
        registration_method: method,
      },
      userId,
    });
  }

  async trackUserLogin(userId: string, method: string) {
    await this.trackEvent({
      name: 'user_login',
      properties: {
        user_id: userId,
        login_method: method,
      },
      userId,
    });
  }

  async trackSearchPerformed(query: string, resultsCount: number, userId?: string) {
    await this.trackEvent({
      name: 'search_performed',
      properties: {
        search_query: query,
        results_count: resultsCount,
      },
      userId,
    });
  }

  async trackAppOpened(userId?: string) {
    await this.trackEvent({
      name: 'app_opened',
      properties: {
        timestamp: new Date().toISOString(),
      },
      userId,
    });
  }
}

export const analytics = new AnalyticsService();

// React hook for easy analytics tracking
export const useAnalytics = () => {
  return {
    trackEvent: analytics.trackEvent.bind(analytics),
    trackScreen: analytics.trackScreen.bind(analytics),
    identifyUser: analytics.identifyUser.bind(analytics),
    trackBidPlaced: analytics.trackBidPlaced.bind(analytics),
    trackAuctionViewed: analytics.trackAuctionViewed.bind(analytics),
    trackConnectsPurchased: analytics.trackConnectsPurchased.bind(analytics),
    trackVideoWatched: analytics.trackVideoWatched.bind(analytics),
    trackAuctionWon: analytics.trackAuctionWon.bind(analytics),
    trackUserRegistration: analytics.trackUserRegistration.bind(analytics),
    trackUserLogin: analytics.trackUserLogin.bind(analytics),
    trackSearchPerformed: analytics.trackSearchPerformed.bind(analytics),
    trackAppOpened: analytics.trackAppOpened.bind(analytics),
  };
};