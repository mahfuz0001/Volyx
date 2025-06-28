import { getUserByClerkId } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const clerkId = url.searchParams.get('clerkId');

    if (!clerkId) {
      return new Response(JSON.stringify({ error: 'Clerk ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user = await getUserByClerkId(clerkId);

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found', isAdmin: false }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ isAdmin: user.isAdmin }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to verify admin status:', error);
    return new Response(JSON.stringify({ error: 'Internal server error', isAdmin: false }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}