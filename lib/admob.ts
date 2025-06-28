import { Platform } from 'react-native';
import { AdMobBanner, AdMobInterstitial, AdMobRewarded, setTestDeviceIDAsync } from 'expo-ads-admob';
import { config } from './config';

// AdMob unit IDs
const BANNER_ID = {
  ios: config.ads.iosBannerId || 'ca-app-pub-3940256099942544/2934735716', // Test ID for iOS
  android: config.ads.androidBannerId || 'ca-app-pub-3940256099942544/6300978111', // Test ID for Android
};

const INTERSTITIAL_ID = {
  ios: config.ads.iosInterstitialId || 'ca-app-pub-3940256099942544/4411468910', // Test ID for iOS
  android: config.ads.androidInterstitialId || 'ca-app-pub-3940256099942544/1033173712', // Test ID for Android
};

const REWARDED_ID = {
  ios: config.ads.iosRewardedId || 'ca-app-pub-3940256099942544/1712485313', // Test ID for iOS
  android: config.ads.androidRewardedId || 'ca-app-pub-3940256099942544/5224354917', // Test ID for Android
};

class AdMobService {
  private isInitialized = false;
  private lastInterstitialTime = 0;
  private interstitialCooldown = 60000; // 1 minute cooldown between interstitials

  async initialize() {
    if (this.isInitialized || Platform.OS === 'web') return;

    try {
      // Set test device ID for development
      if (__DEV__) {
        await setTestDeviceIDAsync('EMULATOR');
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('AdMob initialization failed:', error);
    }
  }

  getBannerAdUnitId() {
    return Platform.OS === 'ios' ? BANNER_ID.ios : BANNER_ID.android;
  }

  getInterstitialAdUnitId() {
    return Platform.OS === 'ios' ? INTERSTITIAL_ID.ios : INTERSTITIAL_ID.android;
  }

  getRewardedAdUnitId() {
    return Platform.OS === 'ios' ? REWARDED_ID.ios : REWARDED_ID.android;
  }

  async showInterstitial() {
    if (Platform.OS === 'web') return false;
    
    try {
      await this.initialize();
      
      // Check cooldown
      const now = Date.now();
      if (now - this.lastInterstitialTime < this.interstitialCooldown) {
        return false;
      }

      // Load interstitial
      await AdMobInterstitial.setAdUnitID(this.getInterstitialAdUnitId());
      await AdMobInterstitial.requestAdAsync();
      
      // Show interstitial
      await AdMobInterstitial.showAdAsync();
      
      // Update last shown time
      this.lastInterstitialTime = now;
      
      return true;
    } catch (error) {
      console.error('Failed to show interstitial ad:', error);
      return false;
    }
  }

  async showRewarded(): Promise<{ success: boolean; reward?: { type: string; amount: number } }> {
    if (Platform.OS === 'web') {
      return { success: false };
    }
    
    try {
      await this.initialize();

      // Load rewarded ad
      await AdMobRewarded.setAdUnitID(this.getRewardedAdUnitId());
      await AdMobRewarded.requestAdAsync();
      
      // Set up reward listener
      return new Promise((resolve) => {
        // Set up reward listener
        AdMobRewarded.addEventListener('rewardedVideoUserDidEarnReward', (reward) => {
          resolve({ success: true, reward });
          AdMobRewarded.removeAllListeners();
        });
        
        AdMobRewarded.addEventListener('rewardedVideoDidFailToLoad', () => {
          resolve({ success: false });
          AdMobRewarded.removeAllListeners();
        });
        
        AdMobRewarded.addEventListener('rewardedVideoDidFailToPresent', () => {
          resolve({ success: false });
          AdMobRewarded.removeAllListeners();
        });
        
        AdMobRewarded.addEventListener('rewardedVideoDidDismiss', () => {
          // If we get here without getting a reward, the user closed the ad early
          resolve({ success: false });
          AdMobRewarded.removeAllListeners();
        });
        
        // Show the ad
        AdMobRewarded.showAdAsync();
      });
    } catch (error) {
      console.error('Failed to show rewarded ad:', error);
      return { success: false };
    }
  }
}

export const adMobService = new AdMobService();

// React components for ads
export { AdMobBanner };

// React hook for using AdMob
export const useAdMob = () => {
  useEffect(() => {
    adMobService.initialize();
  }, []);

  return {
    showInterstitial: adMobService.showInterstitial.bind(adMobService),
    showRewarded: adMobService.showRewarded.bind(adMobService),
    getBannerAdUnitId: adMobService.getBannerAdUnitId.bind(adMobService),
  };
};