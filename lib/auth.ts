import { db, users } from './database';
import { eq } from 'drizzle-orm';

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
      
      return existingUser;
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