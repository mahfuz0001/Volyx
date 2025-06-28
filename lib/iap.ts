import * as InAppPurchases from 'expo-in-app-purchases';
import { Platform } from 'react-native';
import { usersAPI } from './api';
import { analytics } from './analytics';

// Product IDs for in-app purchases
const PRODUCT_IDS = {
  ios: [
    'com.volyx.auction.connects.100',
    'com.volyx.auction.connects.500',
    'com.volyx.auction.connects.1000',
    'com.volyx.auction.connects.2500',
  ],
  android: [
    'com.volyx.auction.connects.100',
    'com.volyx.auction.connects.500',
    'com.volyx.auction.connects.1000',
    'com.volyx.auction.connects.2500',
  ],
};

// Connect packages
export const CONNECTS_PACKAGES = [
  { id: 'com.volyx.auction.connects.100', amount: 100, bonus: 0, price: 0.99, name: 'Starter Pack' },
  { id: 'com.volyx.auction.connects.500', amount: 500, bonus: 50, price: 4.99, name: 'Popular Pack', popular: true },
  { id: 'com.volyx.auction.connects.1000', amount: 1000, bonus: 200, price: 9.99, name: 'Best Value Pack', bestValue: true },
  { id: 'com.volyx.auction.connects.2500', amount: 2500, bonus: 750, price: 19.99, name: 'Premium Pack' },
];

class InAppPurchaseService {
  private isInitialized = false;
  private products: InAppPurchases.IAPItemDetails[] = [];

  async initialize() {
    if (this.isInitialized || Platform.OS === 'web') return;

    try {
      // Set up purchase listener
      InAppPurchases.setPurchaseListener(({ responseCode, results, errorCode }) => {
        if (responseCode === InAppPurchases.IAPResponseCode.OK) {
          results?.forEach(purchase => {
            this.handlePurchase(purchase);
          });
        } else if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
          console.log('User canceled the transaction');
        } else if (responseCode === InAppPurchases.IAPResponseCode.DEFERRED) {
          console.log('User does not have permissions to buy but requested parental approval');
        } else {
          console.error(`Purchase failed with error code: ${errorCode}`);
        }
      });

      // Connect to the store
      await InAppPurchases.connectAsync();

      // Get product information
      const productIds = Platform.OS === 'ios' ? PRODUCT_IDS.ios : PRODUCT_IDS.android;
      const { responseCode, results } = await InAppPurchases.getProductsAsync(productIds);
      
      if (responseCode === InAppPurchases.IAPResponseCode.OK) {
        this.products = results || [];
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('In-app purchase initialization failed:', error);
    }
  }

  async getProducts() {
    await this.initialize();
    return this.products;
  }

  async purchaseConnects(productId: string, userId: string) {
    if (Platform.OS === 'web') {
      throw new Error('In-app purchases are not supported on web');
    }

    await this.initialize();

    // Find the product
    const product = this.products.find(p => p.productId === productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Start the purchase
    const { responseCode, results } = await InAppPurchases.purchaseItemAsync(productId);
    
    if (responseCode !== InAppPurchases.IAPResponseCode.OK) {
      throw new Error('Purchase failed');
    }

    return results?.[0];
  }

  private async handlePurchase(purchase: InAppPurchases.InAppPurchase) {
    try {
      // Find the package
      const packageInfo = CONNECTS_PACKAGES.find(p => p.id === purchase.productId);
      if (!packageInfo) {
        console.error('Package not found for product ID:', purchase.productId);
        return;
      }

      // Extract user ID from purchase
      const userId = purchase.userId || '';
      if (!userId) {
        console.error('User ID not found in purchase');
        return;
      }

      // Credit connects to user
      await usersAPI.purchaseConnects(
        userId,
        packageInfo.id,
        packageInfo.amount,
        packageInfo.bonus
      );

      // Track purchase in analytics
      analytics.trackEvent({
        name: 'connects_purchased',
        properties: {
          product_id: purchase.productId,
          amount: packageInfo.amount,
          bonus: packageInfo.bonus,
          price: packageInfo.price,
          user_id: userId,
        },
      });

      // Finish the transaction
      await InAppPurchases.finishTransactionAsync(purchase, true);
    } catch (error) {
      console.error('Error handling purchase:', error);
    }
  }

  async disconnect() {
    if (this.isInitialized && Platform.OS !== 'web') {
      await InAppPurchases.disconnectAsync();
      this.isInitialized = false;
    }
  }
}

export const iapService = new InAppPurchaseService();

// React hook for using in-app purchases
export const useIAP = (userId?: string) => {
  const [products, setProducts] = useState<InAppPurchases.IAPItemDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const products = await iapService.getProducts();
        setProducts(products);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();

    return () => {
      iapService.disconnect();
    };
  }, []);

  const purchaseConnects = async (productId: string) => {
    if (!userId) {
      throw new Error('User must be logged in to make purchases');
    }
    
    try {
      return await iapService.purchaseConnects(productId, userId);
    } catch (err) {
      console.error('Purchase failed:', err);
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    purchaseConnects,
  };
};