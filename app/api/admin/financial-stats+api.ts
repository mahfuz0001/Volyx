import { analyticsAPI } from '@/lib/api';
import { verifyAdminToken } from '@/lib/api';

export async function GET(request: Request) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    
    // Verify admin token
    const isAdmin = await verifyAdminToken(token);
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get financial stats
    const stats = await analyticsAPI.getFinancialStats();

    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to get financial stats:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}