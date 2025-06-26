import { config } from '@/lib/config';
import { redis } from '@/lib/redis';

export async function POST(request: Request) {
  try {
    const { token, userId } = await request.json();

    if (!token) {
      return new Response(JSON.stringify({ error: 'Token is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Store the push token in Redis or database
    if (userId) {
      await redis.set(`push_token:${userId}`, token, 86400 * 30); // 30 days
    }

    // Store token for broadcast notifications
    await redis.set(`token:${token}`, JSON.stringify({ 
      userId, 
      registeredAt: new Date().toISOString() 
    }), 86400 * 30);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to register push token:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}