import { config } from '@/lib/config';

export async function POST(request: Request) {
  try {
    const { client_secret, payment_method_id } = await request.json();

    if (!client_secret || !payment_method_id) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // In a real implementation, you would confirm the payment with Stripe
    // const stripe = require('stripe')(config.payments.stripeSecretKey);
    // const paymentIntent = await stripe.paymentIntents.confirm(client_secret, {
    //   payment_method: payment_method_id,
    // });

    // For demo purposes, simulate successful payment
    const mockPaymentResult = {
      id: `pi_mock_${Date.now()}`,
      status: 'succeeded',
      amount: 499, // $4.99 in cents
      currency: 'usd',
    };

    return new Response(JSON.stringify({ 
      success: true,
      payment: mockPaymentResult,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to confirm payment:', error);
    return new Response(JSON.stringify({ error: 'Payment confirmation failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}