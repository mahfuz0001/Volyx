import { config } from '@/lib/config';

export async function POST(request: Request) {
  try {
    const { amount, currency = 'usd' } = await request.json();

    if (!amount || amount < 50) { // Minimum 50 cents
      return new Response(JSON.stringify({ error: 'Invalid amount' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // In a real implementation, you would create a Stripe payment intent here
    // const stripe = require('stripe')(config.payments.stripeSecretKey);
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount,
    //   currency,
    //   metadata: { source: 'volyx_connects' },
    // });

    // For demo purposes, return a mock client secret
    const mockClientSecret = `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`;

    return new Response(JSON.stringify({ 
      client_secret: mockClientSecret,
      amount,
      currency,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to create payment intent:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}