import { config } from './config';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, any>;
  categoryId?: string;
  sound?: boolean;
  badge?: number;
}

export interface ScheduledNotificationData extends NotificationData {
  trigger: {
    seconds?: number;
    date?: Date;
    repeats?: boolean;
  };
}

class NotificationService {
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Notification permissions not granted');
        return;
      }

      // Get push token for remote notifications
      if (Platform.OS !== 'web') {
        const token = await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId,
        });
        console.log('Push token:', token.data);
        
        // Send token to your backend here
        await this.registerPushToken(token.data);
      }

      // Configure notification categories
      await this.setupNotificationCategories();

      this.isInitialized = true;
    } catch (error) {
      console.error('Notification initialization failed:', error);
    }
  }

  private async registerPushToken(token: string) {
    try {
      // Send token to your backend
      await fetch(`${config.api.url}/api/notifications/register-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.api.key}`,
        },
        body: JSON.stringify({ token }),
      });
    } catch (error) {
      console.error('Failed to register push token:', error);
    }
  }

  private async setupNotificationCategories() {
    await Notifications.setNotificationCategoryAsync('auction', [
      {
        identifier: 'view_auction',
        buttonTitle: 'View Auction',
        options: { opensAppToForeground: true },
      },
      {
        identifier: 'place_bid',
        buttonTitle: 'Place Bid',
        options: { opensAppToForeground: true },
      },
    ]);

    await Notifications.setNotificationCategoryAsync('connects', [
      {
        identifier: 'get_connects',
        buttonTitle: 'Get Connects',
        options: { opensAppToForeground: true },
      },
    ]);
  }

  async sendLocalNotification(notification: NotificationData) {
    try {
      await this.initialize();
      
      await Notifications.presentNotificationAsync({
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        categoryIdentifier: notification.categoryId,
        sound: notification.sound !== false,
        badge: notification.badge,
      });
    } catch (error) {
      console.error('Failed to send local notification:', error);
    }
  }

  async scheduleNotification(notification: ScheduledNotificationData) {
    try {
      await this.initialize();

      let trigger: any = null;

      if (notification.trigger.seconds) {
        trigger = { seconds: notification.trigger.seconds };
      } else if (notification.trigger.date) {
        trigger = { date: notification.trigger.date };
      }

      if (notification.trigger.repeats) {
        trigger.repeats = true;
      }

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          categoryIdentifier: notification.categoryId,
          sound: notification.sound !== false,
          badge: notification.badge,
        },
        trigger,
      });

      return id;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      return null;
    }
  }

  async cancelNotification(notificationId: string) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Failed to cancel notification:', error);
    }
  }

  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Failed to cancel all notifications:', error);
    }
  }

  // Auction-specific notification helpers
  async notifyOutbid(auctionTitle: string, auctionId: string) {
    await this.sendLocalNotification({
      title: 'You\'ve been outbid!',
      body: `Someone placed a higher bid on "${auctionTitle}"`,
      data: { auctionId, type: 'outbid' },
      categoryId: 'auction',
    });
  }

  async notifyAuctionEnding(auctionTitle: string, auctionId: string, minutesLeft: number) {
    await this.sendLocalNotification({
      title: 'Auction ending soon!',
      body: `"${auctionTitle}" ends in ${minutesLeft} minutes`,
      data: { auctionId, type: 'ending_soon' },
      categoryId: 'auction',
    });
  }

  async notifyAuctionWon(auctionTitle: string, auctionId: string, winningBid: number) {
    await this.sendLocalNotification({
      title: 'Congratulations! You won!',
      body: `You won "${auctionTitle}" for ${winningBid} Connects`,
      data: { auctionId, type: 'won', winningBid },
      categoryId: 'auction',
    });
  }

  async notifyConnectsEarned(amount: number, reason: string) {
    await this.sendLocalNotification({
      title: 'Connects Earned!',
      body: `You earned ${amount} Connects: ${reason}`,
      data: { amount, reason, type: 'connects_earned' },
      categoryId: 'connects',
    });
  }

  async notifyNewAuctions(count: number) {
    await this.sendLocalNotification({
      title: 'New Auctions Available!',
      body: `${count} new curated items are now available for bidding`,
      data: { count, type: 'new_auctions' },
      categoryId: 'auction',
    });
  }
}

export const notificationService = new NotificationService();

// Notification listener hooks
export const useNotificationListener = () => {
  const [notification, setNotification] = React.useState<Notifications.Notification | null>(null);

  React.useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(setNotification);
    return () => subscription.remove();
  }, []);

  return notification;
};

export const useNotificationResponseListener = () => {
  React.useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      
      // Handle notification tap based on type
      switch (data.type) {
        case 'outbid':
        case 'ending_soon':
        case 'won':
          // Navigate to auction detail
          // router.push(`/product-detail?id=${data.auctionId}`);
          break;
        case 'connects_earned':
          // Navigate to connects screen
          // router.push('/get-connects');
          break;
        case 'new_auctions':
          // Navigate to home/search
          // router.push('/(tabs)');
          break;
      }
    });

    return () => subscription.remove();
  }, []);
};