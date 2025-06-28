import { createOrUpdateUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { clerkId, email, name, imageUrl } = await request.json();

    if (!clerkId || !email || !name) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user = await createOrUpdateUser({
      clerkId,
      email,
      name,
      imageUrl,
    });

    return new Response(JSON.stringify({ success: true, user }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to create user:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}