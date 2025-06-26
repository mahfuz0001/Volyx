import { config } from './config';
import { analytics } from './analytics';
import { captureError, captureMessage } from './sentry';

export interface ConnectsPackage {
  id: string;
  name: string;
  amount: number;
  bonus: number;
  price: number;
  popular?: boolean;
  bestValue?: boolean;
  description: string;
}

export const connectsPackages: ConnectsPackage[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    amount: 100,
    bonus: 0,
    price: 0.99,
    description: 'Perfect for testing the waters',
  },
  {
    id: 'popular',
    name: 'Popular Pack',
    amount: 500,
    bonus: 50,
    price: 4.99,
    popular: true,
    description: 'Most popular choice',
  },
  {
    id: 'best_value',
    name: 'Best Value Pack',
    amount: 1000,
    bonus: 200,
    price: 9.99,
    bestValue: true,
    description: 'Best value for serious bidders',
  },
  {
    id: 'premium',
    name: 'Premium Pack',
    amount: 2500,
    bonus: 750,
    price: 19.99,
    description: 'For the ultimate collector',
  },
];

class PaymentService {
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Initialize Stripe or other payment processors
      if (config.payments.stripePublishableKey) {
        // Initialize Stripe
        console.log('Payment service initialized with Stripe');
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Payment service initialization failed:', error);
      captureError(error as Error, { context: 'payment_initialization' });
    }
  }

  async purchaseConnects(packageId: string, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.initialize();

      const package_ = connectsPackages.find(p => p.id === packageId);
      if (!package_) {
        throw new Error('Invalid package selected');
      }

      // In a real implementation, you would:
      // 1. Create a payment intent with Stripe
      // 2. Process the payment
      // 3. Update user's connects balance
      // 4. Create transaction record

      // For demo purposes, we'll simulate a successful purchase
      const totalConnects = package_.amount + package_.bonus;

      // Track the purchase
      await analytics.trackConnectsPurchased(totalConnects, package_.price, userId);

      // Log successful purchase
      captureMessage(`Connects purchased: ${totalConnects} for $${package_.price}`, 'info');

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      captureError(error as Error, { 
        context: 'connects_purchase', 
        packageId, 
        userId 
      });
      
      return { success: false, error: errorMessage };
    }
  }

  async createPaymentIntent(amount: number, currency: string = 'usd'): Promise<{ clientSecret?: string; error?: string }> {
    try {
      const response = await fetch(`${config.api.url}/api/payments/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.api.key}`,
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent');
      }

      return { clientSecret: data.client_secret };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment setup failed';
      captureError(error as Error, { context: 'payment_intent_creation' });
      
      return { error: errorMessage };
    }
  }

  async confirmPayment(clientSecret: string, paymentMethodId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // In a real implementation, you would use Stripe's confirmPayment
      // This is a simplified version for demo purposes
      
      const response = await fetch(`${config.api.url}/api/payments/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.api.key}`,
        },
        body: JSON.stringify({
          client_secret: clientSecret,
          payment_method_id: paymentMethodId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment confirmation failed');
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment confirmation failed';
      captureError(error as Error, { context: 'payment_confirmation' });
      
      return { success: false, error: errorMessage };
    }
  }

  getPackageById(packageId: string): ConnectsPackage | undefined {
    return connectsPackages.find(p => p.id === packageId);
  }

  getAllPackages(): ConnectsPackage[] {
    return connectsPackages;
  }

  calculateTotal(packageId: string): { amount: number; bonus: number; total: number; price: number } | null {
    const package_ = this.getPackageById(packageId);
    if (!package_) return null;

    return {
      amount: package_.amount,
      bonus: package_.bonus,
      total: package_.amount + package_.bonus,
      price: package_.price,
    };
  }
}

export const paymentService = new PaymentService();

// React hook for payment operations
export const usePayments = () => {
  return {
    purchaseConnects: paymentService.purchaseConnects.bind(paymentService),
    createPaymentIntent: paymentService.createPaymentIntent.bind(paymentService),
    confirmPayment: paymentService.confirmPayment.bind(paymentService),
    getPackageById: paymentService.getPackageById.bind(paymentService),
    getAllPackages: paymentService.getAllPackages.bind(paymentService),
    calculateTotal: paymentService.calculateTotal.bind(paymentService),
  };
};