import { db, users } from '@/lib/database';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    // Check if admin already exists
    const existingAdmin = await db.query.users.findFirst({
      where: eq(users.email, 'admin@example.com'),
    });

    if (existingAdmin) {
      return new Response(JSON.stringify({ message: 'Admin already exists', admin: existingAdmin }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create admin user
    const [admin] = await db
      .insert(users)
      .values({
        email: 'admin@example.com',
        name: 'Admin User',
        clerkId: 'admin_clerk_id', // This would be a real Clerk ID in production
        isAdmin: true,
        connectsBalance: 10000,
        trustScore: 100,
        isVerified: true,
      })
      .returning();

    return new Response(JSON.stringify({ message: 'Admin created successfully', admin }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to seed admin:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}