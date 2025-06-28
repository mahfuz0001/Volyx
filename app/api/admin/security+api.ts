import { securityAPI } from '@/lib/api';
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

    // Get security data
    const suspiciousActivity = await securityAPI.getSuspiciousActivity();
    const rateLimitViolations = await securityAPI.getRateLimitViolations();

    return new Response(JSON.stringify({ suspiciousActivity, rateLimitViolations }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to get security data:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request: Request) {
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

    // Get request body
    const { action, userId, ipAddress, reason } = await request.json();
    
    if (!action) {
      return new Response(JSON.stringify({ error: 'Action is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Handle different actions
    switch (action) {
      case 'blockUser':
        if (!userId || !reason) {
          return new Response(JSON.stringify({ error: 'User ID and reason are required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        await securityAPI.blockUser(userId, token, reason);
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Failed to perform security action:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}