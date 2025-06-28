import { db, users } from './database';
import { eq } from 'drizzle-orm';
import { redis } from './redis';
import { analytics } from './analytics';

export async function createOrUpdateUser({
  clerkId,
  email,
  name,
  imageUrl,
}: {
  clerkId: string;
  email: string;
  name: string;
  imageUrl?: string;
}) {
  try {
    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (existingUser) {
      // Update user
      await db
        .update(users)
        .set({
          email,
          name,
          imageUrl,
          updatedAt: new Date(),
        })
        .where(eq(users.clerkId, clerkId));
      
      // Get updated user
      const updatedUser = await db.query.users.findFirst({
        where: eq(users.clerkId, clerkId),
      });
      
      return updatedUser;
    } else {
      // Create new user
      const [newUser] = await db
        .insert(users)
        .values({
          clerkId,
          email,
          name,
          imageUrl,
          connectsBalance: 100, // Starting balance
          isAdmin: email === 'admin@example.com', // Make admin@example.com an admin
        })
        .returning();
      
      // Track user creation in analytics
      await analytics.trackEvent({
        name: 'user_created',
        properties: {
          user_id: newUser.id,
          email: newUser.email,
          is_admin: newUser.isAdmin,
        },
      });
      
      return newUser;
    }
  } catch (error) {
    console.error('Error creating or updating user:', error);
    throw error;
  }
}

export async function getUserByClerkId(clerkId: string) {
  try {
    return await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });
  } catch (error) {
    console.error('Error getting user by Clerk ID:', error);
    throw error;
  }
}

export async function createAdminToken(userId: string): Promise<string> {
  try {
    // Generate a secure random token
    const token = crypto.randomUUID();
    
    // Store token in Redis with user ID as value
    await redis.set(`admin_token:${token}`, userId, 24 * 60 * 60); // 24 hour expiry
    
    return token;
  } catch (error) {
    console.error('Error creating admin token:', error);
    throw error;
  }
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    // Get user ID from Redis
    const userId = await redis.get(`admin_token:${token}`);
    if (!userId) return false;
    
    // Check if user is admin
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId as string),
    });
    
    return !!user?.isAdmin;
  } catch (error) {
    console.error('Error verifying admin token:', error);
    return false;
  }
}

export async function revokeAdminToken(token: string): Promise<void> {
  try {
    await redis.del(`admin_token:${token}`);
  } catch (error) {
    console.error('Error revoking admin token:', error);
    throw error;
  }
}