import {
  sanityClient,
  AUCTION_ITEMS_QUERY,
  HOT_AUCTIONS_QUERY,
  FEATURED_AUCTIONS_QUERY,
  ENDING_SOON_QUERY,
  CATEGORIES_QUERY,
  AUCTION_ITEM_BY_ID_QUERY,
  BID_HISTORY_QUERY,
} from './sanity';
import { z } from 'zod';
import { db, users, auctionItems, bids, categories, connectsTransactions, wonItems } from './database';
import { eq, desc, and, gte, lte, like, sql, count, sum } from 'drizzle-orm';
import { redis } from './redis';
import { config } from './config';
import { analytics } from './analytics';

// Enhanced rate limiting store with device fingerprinting
const rateLimitStore = new Map<
  string,
  { count: number; resetTime: number; violations: number }
>();
const suspiciousActivityStore = new Map<
  string,
  { rapidBids: number; lastSecondBids: number; flagged: boolean }
>();

// Enhanced rate limiting configuration
const RATE_LIMITS = {
  default: { requests: 100, windowMs: 15 * 60 * 1000 }, // 100 requests per 15 minutes
  bid: { requests: 10, windowMs: 60 * 1000 }, // 10 bids per minute
  rapidBid: { requests: 3, windowMs: 10 * 1000 }, // 3 bids per 10 seconds
  auth: { requests: 5, windowMs: 15 * 60 * 1000 }, // 5 auth attempts per 15 minutes
  videoWatch: { requests: 10, windowMs: 24 * 60 * 60 * 1000 }, // 10 videos per day
  adminApi: { requests: 50, windowMs: 5 * 60 * 1000 }, // 50 admin API requests per 5 minutes
};

// JWT verification for admin API endpoints
export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    // In production, you would verify the JWT signature
    // For now, we'll check if the token exists in Redis
    const userId = await redis.get(`admin_token:${token}`);
    if (!userId) return false;
    
    // Check if user is admin
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId as string),
    });
    
    return !!user?.isAdmin;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
}

// Enhanced validation schemas
export const BidSchema = z.object({
  auctionItemId: z.string().min(1),
  amount: z.number().min(1),
  userId: z.string().min(1),
  isProxyBid: z.boolean().optional(),
  maxProxyAmount: z.number().optional(),
  deviceFingerprint: z.string().min(1),
  ipAddress: z.string().min(1),
});

export const ProxyBidSchema = z.object({
  auctionItemId: z.string().min(1),
  maxAmount: z.number().min(1),
  userId: z.string().min(1),
  deviceFingerprint: z.string().min(1),
  ipAddress: z.string().min(1),
});

export const UserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6),
});

export const AuctionItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  detailedDescription: z.string().min(1),
  authenticity: z.string().min(1),
  condition: z.string().min(1),
  rarity: z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']),
  minimumBid: z.number().min(1),
  bidIncrement: z.number().min(1),
  endTime: z.string(),
  categoryId: z.string().min(1),
  subcategory: z.string().min(1),
  isHot: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  estimatedValue: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }),
  shippingCost: z.number().min(0),
  shippingTime: z.string().min(1),
  returnPolicy: z.string().min(1),
  curatorNotes: z.string().optional(),
  provenance: z.string().optional(),
});

// Enhanced rate limiting with behavioral analysis
export async function checkRateLimit(
  identifier: string,
  type: keyof typeof RATE_LIMITS = 'default'
): Promise<boolean> {
  const limit = RATE_LIMITS[type];
  const now = Date.now();
  const key = `ratelimit:${type}:${identifier}`;

  try {
    // Use Redis for distributed rate limiting
    const current = await redis.get(key);
    
    if (!current) {
      await redis.set(key, '1', limit.windowMs / 1000);
      return true;
    }
    
    const count = parseInt(current, 10);
    
    if (count >= limit.requests) {
      // Increment violations counter
      const violationsKey = `ratelimit:violations:${identifier}`;
      const violations = await redis.incr(violationsKey);
      
      // Set expiry for violations counter if it's new
      if (violations === 1) {
        await redis.expire(violationsKey, 24 * 60 * 60); // 24 hours
      }
      
      // Flag for suspicious activity if too many violations
      if (violations > 3) {
        await flagSuspiciousActivity(identifier, 'rate_limit_violations');
      }
      
      return false;
    }
    
    await redis.incr(key);
    return true;
  } catch (error) {
    console.error('Rate limit check error:', error);
    
    // Fallback to in-memory rate limiting if Redis fails
    const current = rateLimitStore.get(key);

    if (!current || now > current.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + limit.windowMs,
        violations: 0,
      });
      return true;
    }

    if (current.count >= limit.requests) {
      current.violations++;
      if (current.violations > 3) {
        // Flag for suspicious activity
        flagSuspiciousActivity(identifier, 'rate_limit_violations');
      }
      return false;
    }

    current.count++;
    return true;
  }
}

// Behavioral anomaly detection
export async function detectSuspiciousBidding(
  userId: string,
  auctionItemId: string,
  bidTime: number,
  auctionEndTime: number
): Promise<boolean> {
  const key = `suspicious:${userId}:${auctionItemId}`;
  
  try {
    // Use Redis for distributed tracking
    let activity = await redis.get(key);
    let activityData = activity ? JSON.parse(activity) : {
      rapidBids: 0,
      lastSecondBids: 0,
      flagged: false,
    };
    
    const timeToEnd = auctionEndTime - bidTime;

    // Check for last-second bidding (within 5 seconds)
    if (timeToEnd < 5000) {
      activityData.lastSecondBids++;
      if (activityData.lastSecondBids > 3) {
        activityData.flagged = true;
        await flagSuspiciousActivity(userId, 'excessive_last_second_bidding');
      }
    }

    // Check for rapid bidding
    const recentBidsKey = `recent_bids:${userId}`;
    const recentBidsCount = await redis.incr(recentBidsKey);
    
    // Set expiry for recent bids counter if it's new
    if (recentBidsCount === 1) {
      await redis.expire(recentBidsKey, 30); // 30 seconds
    }
    
    if (recentBidsCount > 5) {
      activityData.rapidBids++;
      if (activityData.rapidBids > 2) {
        activityData.flagged = true;
        await flagSuspiciousActivity(userId, 'rapid_fire_bidding');
      }
    }
    
    // Save updated activity data
    await redis.set(key, JSON.stringify(activityData), 3600); // 1 hour expiry
    
    return activityData.flagged;
  } catch (error) {
    console.error('Suspicious activity detection error:', error);
    
    // Fallback to in-memory tracking if Redis fails
    const key = `${userId}:${auctionItemId}`;
    const activity = suspiciousActivityStore.get(key) || {
      rapidBids: 0,
      lastSecondBids: 0,
      flagged: false,
    };

    const timeToEnd = auctionEndTime - bidTime;

    // Check for last-second bidding (within 5 seconds)
    if (timeToEnd < 5000) {
      activity.lastSecondBids++;
      if (activity.lastSecondBids > 3) {
        activity.flagged = true;
        flagSuspiciousActivity(userId, 'excessive_last_second_bidding');
      }
    }

    // Check for rapid bidding
    const recentActivity = Array.from(suspiciousActivityStore.entries()).filter(
      ([k, v]) => k.startsWith(userId) && Date.now() - bidTime < 30000
    );

    if (recentActivity.length > 5) {
      activity.rapidBids++;
      if (activity.rapidBids > 2) {
        activity.flagged = true;
        flagSuspiciousActivity(userId, 'rapid_fire_bidding');
      }
    }

    suspiciousActivityStore.set(key, activity);
    return activity.flagged;
  }
}

async function flagSuspiciousActivity(identifier: string, reason: string) {
  try {
    // Log suspicious activity to database for admin review
    // In production, this would trigger admin notifications
    await redis.set(`suspicious:${identifier}:${reason}`, Date.now().toString(), 24 * 60 * 60); // 24 hour expiry
    
    // Log to analytics
    await analytics.trackEvent({
      name: 'suspicious_activity_detected',
      properties: {
        identifier,
        reason,
        timestamp: new Date().toISOString(),
      },
    });
    
    console.warn(`Suspicious activity detected: ${reason} by ${identifier}`);
  } catch (error) {
    console.error('Error flagging suspicious activity:', error);
  }
}

// Calculate dynamic bid increments
export function calculateBidIncrement(currentBid: number): number {
  if (currentBid < 100) return 5;
  if (currentBid < 500) return 10;
  if (currentBid < 1000) return 25;
  if (currentBid < 5000) return 50;
  return 100;
}

// API Error class
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Generic API wrapper with enhanced error handling
async function apiCall<T>(
  operation: () => Promise<T>,
  operationName: string,
  userId?: string,
  deviceFingerprint?: string
): Promise<T> {
  try {
    // Enhanced rate limiting with device fingerprinting
    const identifier = deviceFingerprint || userId || 'anonymous';
    if (!await checkRateLimit(identifier)) {
      throw new APIError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED');
    }

    const result = await operation();
    return result;
  } catch (error) {
    const apiError =
      error instanceof APIError
        ? error
        : new APIError(
            `${operationName} failed: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`,
            500,
            'INTERNAL_ERROR'
          );

    // Log error to analytics
    analytics.trackEvent({
      name: 'api_error',
      properties: {
        operation: operationName,
        error_code: apiError.code,
        error_message: apiError.message,
        user_id: userId,
      },
    });

    throw apiError;
  }
}

// Enhanced Auction Items API
export const auctionAPI = {
  async getAll() {
    return apiCall(
      async () => {
        // Get auction items from database
        const items = await db.query.auctionItems.findMany({
          where: eq(auctionItems.isActive, true),
          orderBy: auctionItems.endTime,
          with: {
            category: true,
          },
        });
        
        return items;
      },
      'fetchAuctionItems'
    );
  },

  async getHot() {
    return apiCall(
      async () => {
        // Get hot auction items from database
        const items = await db.query.auctionItems.findMany({
          where: and(
            eq(auctionItems.isActive, true),
            eq(auctionItems.isHot, true)
          ),
          orderBy: auctionItems.endTime,
          with: {
            category: true,
          },
        });
        
        return items;
      },
      'fetchHotAuctions'
    );
  },

  async getFeatured() {
    return apiCall(
      async () => {
        // Get featured auction items from database
        const items = await db.query.auctionItems.findMany({
          where: and(
            eq(auctionItems.isActive, true),
            eq(auctionItems.isFeatured, true)
          ),
          orderBy: auctionItems.endTime,
          with: {
            category: true,
          },
        });
        
        return items;
      },
      'fetchFeaturedAuctions'
    );
  },

  async getEndingSoon() {
    return apiCall(
      async () => {
        // Get auction items ending soon (within 1 hour)
        const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
        
        const items = await db.query.auctionItems.findMany({
          where: and(
            eq(auctionItems.isActive, true),
            lte(auctionItems.endTime, oneHourFromNow)
          ),
          orderBy: auctionItems.endTime,
          with: {
            category: true,
          },
        });
        
        return items;
      },
      'fetchEndingSoonAuctions'
    );
  },

  async getById(id: string) {
    return apiCall(
      async () => {
        // Get auction item by ID
        const item = await db.query.auctionItems.findFirst({
          where: eq(auctionItems.id, id),
          with: {
            category: true,
          },
        });
        
        if (!item) {
          throw new APIError('Auction item not found', 404, 'AUCTION_NOT_FOUND');
        }
        
        return item;
      },
      'fetchAuctionItemById'
    );
  },

  async getBidHistory(auctionItemId: string) {
    return apiCall(
      async () => {
        // Get bid history for auction item
        const bidHistory = await db.query.bids.findMany({
          where: eq(bids.auctionItemId, auctionItemId),
          orderBy: desc(bids.createdAt),
          with: {
            user: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        });
        
        return bidHistory;
      },
      'fetchBidHistory'
    );
  },

  async create(data: z.infer<typeof AuctionItemSchema>, userId: string) {
    const validatedData = AuctionItemSchema.parse(data);

    return apiCall(
      async () => {
        // Check if user is admin or curator
        const user = await db.query.users.findFirst({
          where: eq(users.id, userId),
        });
        
        if (!user?.isAdmin) {
          throw new APIError('Unauthorized', 403, 'UNAUTHORIZED');
        }
        
        // Create auction item
        const [newItem] = await db
          .insert(auctionItems)
          .values({
            title: validatedData.title,
            description: validatedData.description,
            image: 'https://via.placeholder.com/400', // Placeholder, would be replaced with actual image upload
            currentBid: 0,
            minimumBid: validatedData.minimumBid,
            endTime: new Date(validatedData.endTime),
            categoryId: validatedData.categoryId,
            isHot: validatedData.isHot || false,
            isActive: true,
            createdBy: userId,
          })
          .returning();
        
        return newItem;
      },
      'createAuctionItem',
      userId
    );
  },

  async placeBid(data: z.infer<typeof BidSchema>) {
    const validatedData = BidSchema.parse(data);

    // Enhanced rate limiting for bidding
    if (!await checkRateLimit(validatedData.userId, 'bid')) {
      throw new APIError('Bid rate limit exceeded', 429, 'BID_RATE_LIMIT');
    }

    if (!await checkRateLimit(validatedData.deviceFingerprint, 'rapidBid')) {
      throw new APIError('Too many rapid bids', 429, 'RAPID_BID_LIMIT');
    }

    return apiCall(
      async () => {
        // Get current auction item
        const auctionItem = await db.query.auctionItems.findFirst({
          where: eq(auctionItems.id, validatedData.auctionItemId),
        });

        if (!auctionItem) {
          throw new APIError(
            'Auction item not found',
            404,
            'AUCTION_NOT_FOUND'
          );
        }

        const auctionEndTime = auctionItem.endTime.getTime();
        const now = Date.now();

        // Check if auction has ended
        if (now > auctionEndTime) {
          throw new APIError('Auction has ended', 400, 'AUCTION_ENDED');
        }

        // Behavioral analysis
        if (
          await detectSuspiciousBidding(
            validatedData.userId,
            validatedData.auctionItemId,
            now,
            auctionEndTime
          )
        ) {
          throw new APIError(
            'Suspicious bidding pattern detected',
            403,
            'SUSPICIOUS_ACTIVITY'
          );
        }

        const requiredIncrement = calculateBidIncrement(auctionItem.currentBid);
        const minimumBid = auctionItem.currentBid + requiredIncrement;

        if (validatedData.amount < minimumBid) {
          throw new APIError(
            `Bid must be at least ${minimumBid} Connects`,
            400,
            'INVALID_BID_AMOUNT'
          );
        }

        // Check if user has enough connects
        const user = await db.query.users.findFirst({
          where: eq(users.id, validatedData.userId),
        });
        
        if (!user) {
          throw new APIError('User not found', 404, 'USER_NOT_FOUND');
        }
        
        if (user.connectsBalance < validatedData.amount) {
          throw new APIError(
            'Insufficient connects balance',
            400,
            'INSUFFICIENT_CONNECTS'
          );
        }

        // Handle overtime/soft close (extend auction by 2 minutes if bid placed in last 30 seconds)
        let newEndTime = auctionItem.endTime;
        if (auctionEndTime - now < 30000) {
          newEndTime = new Date(now + 2 * 60 * 1000);
        }

        // Update auction item with new bid
        await db
          .update(auctionItems)
          .set({
            currentBid: validatedData.amount,
            endTime: newEndTime,
            updatedAt: new Date(),
          })
          .where(eq(auctionItems.id, validatedData.auctionItemId));

        // Create bid record
        const [newBid] = await db
          .insert(bids)
          .values({
            auctionItemId: validatedData.auctionItemId,
            userId: validatedData.userId,
            amount: validatedData.amount,
          })
          .returning();
        
        // Track bid in analytics
        await analytics.trackBidPlaced(
          validatedData.auctionItemId,
          validatedData.amount,
          validatedData.userId
        );
        
        return newBid;
      },
      'placeBid',
      validatedData.userId,
      validatedData.deviceFingerprint
    );
  },

  async setProxyBid(data: z.infer<typeof ProxyBidSchema>) {
    const validatedData = ProxyBidSchema.parse(data);

    return apiCall(
      async () => {
        // Implementation for proxy bidding system
        // This would set up automatic bidding up to the max amount
        // For now, we'll just place a regular bid
        return this.placeBid({
          auctionItemId: validatedData.auctionItemId,
          amount: validatedData.maxAmount,
          userId: validatedData.userId,
          deviceFingerprint: validatedData.deviceFingerprint,
          ipAddress: validatedData.ipAddress,
          isProxyBid: true,
          maxProxyAmount: validatedData.maxAmount,
        });
      },
      'setProxyBid',
      validatedData.userId,
      validatedData.deviceFingerprint
    );
  },
};

// Enhanced Categories API
export const categoriesAPI = {
  async getAll() {
    return apiCall(
      async () => {
        // Get all categories from database
        const allCategories = await db.query.categories.findMany();
        return allCategories;
      },
      'fetchCategories'
    );
  },

  async getByCategory(categoryId: string) {
    return apiCall(
      async () => {
        // Get auction items by category
        const items = await db.query.auctionItems.findMany({
          where: and(
            eq(auctionItems.isActive, true),
            eq(auctionItems.categoryId, categoryId)
          ),
          orderBy: auctionItems.endTime,
          with: {
            category: true,
          },
        });
        
        return items;
      },
      'fetchAuctionsByCategory'
    );
  },
};

// Enhanced Users API with Connects management
export const usersAPI = {
  async create(data: z.infer<typeof UserSchema>) {
    const validatedData = UserSchema.parse(data);

    return apiCall(
      async () => {
        // Check if email already exists
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, validatedData.email),
        });
        
        if (existingUser) {
          throw new APIError('Email already in use', 400, 'EMAIL_IN_USE');
        }
        
        // Create user
        const [newUser] = await db
          .insert(users)
          .values({
            email: validatedData.email,
            name: validatedData.name,
            clerkId: 'pending', // This would be updated after Clerk registration
            connectsBalance: 100, // Starting balance
            isAdmin: validatedData.email === 'admin@example.com', // Make admin@example.com an admin
          })
          .returning();
        
        return newUser;
      },
      'createUser'
    );
  },

  async updateConnects(
    userId: string,
    amount: number,
    type: 'add' | 'subtract',
    reason: string
  ) {
    return apiCall(
      async () => {
        // Get user
        const user = await db.query.users.findFirst({
          where: eq(users.id, userId),
        });

        if (!user) {
          throw new APIError('User not found', 404, 'USER_NOT_FOUND');
        }

        const newBalance =
          type === 'add'
            ? user.connectsBalance + amount
            : user.connectsBalance - amount;

        if (newBalance < 0) {
          throw new APIError(
            'Insufficient connects',
            400,
            'INSUFFICIENT_CONNECTS'
          );
        }

        // Update user balance
        await db
          .update(users)
          .set({ connectsBalance: newBalance })
          .where(eq(users.id, userId));

        // Create transaction record
        const [transaction] = await db
          .insert(connectsTransactions)
          .values({
            userId,
            type: type === 'add' ? 'earned' : 'spent',
            amount: type === 'add' ? amount : -amount,
            description: reason,
          })
          .returning();
        
        return transaction;
      },
      'updateUserConnects',
      userId
    );
  },

  async watchVideo(userId: string, deviceFingerprint: string) {
    // Check daily video limit
    if (!await checkRateLimit(`${userId}:${deviceFingerprint}`, 'videoWatch')) {
      throw new APIError(
        'Daily video limit reached',
        429,
        'VIDEO_LIMIT_EXCEEDED'
      );
    }

    const connectsEarned = 10; // Base amount, could be dynamic

    return apiCall(
      () =>
        this.updateConnects(
          userId,
          connectsEarned,
          'add',
          'Watched video advertisement'
        ),
      'watchVideo',
      userId,
      deviceFingerprint
    );
  },

  async purchaseConnects(
    userId: string,
    packageId: string,
    amount: number,
    bonus: number
  ) {
    const totalConnects = amount + bonus;

    return apiCall(
      async () => {
        // In production, this would integrate with payment processing
        await this.updateConnects(
          userId,
          totalConnects,
          'add',
          `Purchased ${amount} + ${bonus} bonus Connects`
        );

        // Create purchase record
        // In a real implementation, you would store payment details
        const transaction = await this.updateConnects(
          userId,
          totalConnects,
          'add',
          `Purchased ${amount} + ${bonus} bonus Connects`
        );
        
        return transaction;
      },
      'purchaseConnects',
      userId
    );
  },
};

// Analytics API for admin dashboard
export const analyticsAPI = {
  async getDashboardStats() {
    return apiCall(async () => {
      // Check rate limit for admin API
      if (!await checkRateLimit('admin', 'adminApi')) {
        throw new APIError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED');
      }
      
      // Get dashboard stats from database
      const [
        totalUsersResult,
        activeAuctionsResult,
        totalBidsResult,
        totalRevenueResult,
      ] = await Promise.all([
        db.select({ count: count() }).from(users),
        db.select({ count: count() }).from(auctionItems).where(eq(auctionItems.isActive, true)),
        db.select({ count: count() }).from(bids),
        db.select({ total: sum(connectsTransactions.amount) }).from(connectsTransactions).where(eq(connectsTransactions.type, 'purchased')),
      ]);

      const totalUsers = totalUsersResult[0]?.count || 0;
      const activeAuctions = activeAuctionsResult[0]?.count || 0;
      const totalBids = totalBidsResult[0]?.count || 0;
      const totalRevenue = totalRevenueResult[0]?.total || 0;

      return {
        totalUsers,
        activeAuctions,
        totalBids,
        revenue: totalRevenue * 0.01, // Convert connects to dollars (example conversion)
      };
    }, 'fetchDashboardStats');
  },

  async getAuctionPerformance() {
    return apiCall(
      async () => {
        // Check rate limit for admin API
        if (!await checkRateLimit('admin', 'adminApi')) {
          throw new APIError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED');
        }
        
        // Get auction performance from database
        const auctionPerformance = await db.query.auctionItems.findMany({
          with: {
            bids: true,
          },
          orderBy: desc(auctionItems.currentBid),
        });
        
        // Calculate additional metrics
        const enhancedPerformance = auctionPerformance.map(auction => ({
          ...auction,
          bidCount: auction.bids.length,
          averageBidAmount: auction.bids.length > 0 
            ? auction.bids.reduce((sum, bid) => sum + bid.amount, 0) / auction.bids.length 
            : 0,
        }));
        
        return enhancedPerformance;
      },
      'fetchAuctionPerformance'
    );
  },
  
  async getUserStats() {
    return apiCall(
      async () => {
        // Check rate limit for admin API
        if (!await checkRateLimit('admin', 'adminApi')) {
          throw new APIError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED');
        }
        
        // Get user statistics from database
        const [
          newUsersResult,
          activeUsersResult,
          topBiddersResult,
        ] = await Promise.all([
          // New users in the last 7 days
          db.select({ count: count() }).from(users).where(
            gte(users.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
          ),
          
          // Active users (placed a bid in the last 30 days)
          db.select({ 
            distinctUsers: sql`count(distinct ${bids.userId})` 
          }).from(bids).where(
            gte(bids.createdAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
          ),
          
          // Top bidders
          db.query.users.findMany({
            with: {
              bids: true,
              wonItems: true,
            },
            orderBy: desc(sql`(select count(*) from ${bids} where ${bids.userId} = ${users.id})`),
            limit: 10,
          }),
        ]);
        
        const newUsers = newUsersResult[0]?.count || 0;
        const activeUsers = activeUsersResult[0]?.distinctUsers || 0;
        
        // Process top bidders data
        const topBidders = topBiddersResult.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          bidCount: user.bids.length,
          wonCount: user.wonItems.length,
          connectsBalance: user.connectsBalance,
          successRate: user.bids.length > 0 
            ? (user.wonItems.length / user.bids.length) * 100 
            : 0,
        }));
        
        return {
          newUsers,
          activeUsers,
          topBidders,
        };
      },
      'fetchUserStats'
    );
  },
  
  async getFinancialStats() {
    return apiCall(
      async () => {
        // Check rate limit for admin API
        if (!await checkRateLimit('admin', 'adminApi')) {
          throw new APIError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED');
        }
        
        // Get financial statistics from database
        const [
          totalRevenueResult,
          connectsSoldResult,
          avgOrderValueResult,
          revenueByDayResult,
        ] = await Promise.all([
          // Total revenue
          db.select({ 
            total: sum(connectsTransactions.amount) 
          }).from(connectsTransactions).where(
            eq(connectsTransactions.type, 'purchased')
          ),
          
          // Total connects sold
          db.select({ 
            total: sum(connectsTransactions.amount) 
          }).from(connectsTransactions).where(
            eq(connectsTransactions.type, 'purchased')
          ),
          
          // Average order value
          db.select({ 
            avg: sql`avg(${connectsTransactions.amount})` 
          }).from(connectsTransactions).where(
            eq(connectsTransactions.type, 'purchased')
          ),
          
          // Revenue by day (last 30 days)
          db.select({ 
            day: sql`date_trunc('day', ${connectsTransactions.createdAt})`,
            total: sum(connectsTransactions.amount) 
          })
          .from(connectsTransactions)
          .where(
            and(
              eq(connectsTransactions.type, 'purchased'),
              gte(connectsTransactions.createdAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
            )
          )
          .groupBy(sql`date_trunc('day', ${connectsTransactions.createdAt})`)
          .orderBy(sql`date_trunc('day', ${connectsTransactions.createdAt})`),
        ]);
        
        const totalRevenue = totalRevenueResult[0]?.total || 0;
        const connectsSold = connectsSoldResult[0]?.total || 0;
        const avgOrderValue = avgOrderValueResult[0]?.avg || 0;
        
        // Process revenue by day
        const revenueByDay = revenueByDayResult.map(day => ({
          date: day.day,
          revenue: day.total * 0.01, // Convert connects to dollars
        }));
        
        return {
          totalRevenue: totalRevenue * 0.01, // Convert connects to dollars
          connectsSold,
          avgOrderValue: avgOrderValue * 0.01, // Convert connects to dollars
          revenueByDay,
        };
      },
      'fetchFinancialStats'
    );
  },
};

// Admin API for user management
export const adminAPI = {
  async getAllUsers() {
    return apiCall(
      async () => {
        // Check rate limit for admin API
        if (!await checkRateLimit('admin', 'adminApi')) {
          throw new APIError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED');
        }
        
        // Get all users from database
        const allUsers = await db.query.users.findMany({
          with: {
            bids: true,
            wonItems: true,
          },
        });
        
        // Process user data
        const processedUsers = allUsers.map(user => ({
          id: user.id,
          email: user.email,
          name: user.name,
          connectsBalance: user.connectsBalance,
          isAdmin: user.isAdmin,
          clerkId: user.clerkId,
          imageUrl: user.imageUrl,
          phone: user.phone,
          location: user.location,
          bio: user.bio,
          trustScore: user.trustScore,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          totalBids: user.bids.length,
          itemsWon: user.wonItems.length,
          successRate: user.bids.length > 0 
            ? (user.wonItems.length / user.bids.length) * 100 
            : 0,
        }));
        
        return processedUsers;
      },
      'getAllUsers'
    );
  },
  
  async getUserById(userId: string) {
    return apiCall(
      async () => {
        // Check rate limit for admin API
        if (!await checkRateLimit('admin', 'adminApi')) {
          throw new APIError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED');
        }
        
        // Get user by ID
        const user = await db.query.users.findFirst({
          where: eq(users.id, userId),
          with: {
            bids: {
              with: {
                auctionItem: true,
              },
            },
            wonItems: {
              with: {
                auctionItem: true,
              },
            },
            connectsTransactions: true,
          },
        });
        
        if (!user) {
          throw new APIError('User not found', 404, 'USER_NOT_FOUND');
        }
        
        return user;
      },
      'getUserById'
    );
  },
  
  async updateUser(userId: string, data: Partial<typeof users.$inferInsert>) {
    return apiCall(
      async () => {
        // Check rate limit for admin API
        if (!await checkRateLimit('admin', 'adminApi')) {
          throw new APIError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED');
        }
        
        // Update user
        await db
          .update(users)
          .set({
            ...data,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userId));
        
        // Get updated user
        const updatedUser = await db.query.users.findFirst({
          where: eq(users.id, userId),
        });
        
        if (!updatedUser) {
          throw new APIError('User not found', 404, 'USER_NOT_FOUND');
        }
        
        return updatedUser;
      },
      'updateUser'
    );
  },
  
  async deleteUser(userId: string) {
    return apiCall(
      async () => {
        // Check rate limit for admin API
        if (!await checkRateLimit('admin', 'adminApi')) {
          throw new APIError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED');
        }
        
        // Check if user exists
        const user = await db.query.users.findFirst({
          where: eq(users.id, userId),
        });
        
        if (!user) {
          throw new APIError('User not found', 404, 'USER_NOT_FOUND');
        }
        
        // Delete user
        await db
          .delete(users)
          .where(eq(users.id, userId));
        
        return { success: true };
      },
      'deleteUser'
    );
  },
  
  async searchUsers(query: string) {
    return apiCall(
      async () => {
        // Check rate limit for admin API
        if (!await checkRateLimit('admin', 'adminApi')) {
          throw new APIError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED');
        }
        
        // Search users
        const searchResults = await db.query.users.findMany({
          where: or(
            like(users.name, `%${query}%`),
            like(users.email, `%${query}%`)
          ),
          with: {
            bids: true,
            wonItems: true,
          },
        });
        
        // Process search results
        const processedResults = searchResults.map(user => ({
          id: user.id,
          email: user.email,
          name: user.name,
          connectsBalance: user.connectsBalance,
          isAdmin: user.isAdmin,
          totalBids: user.bids.length,
          itemsWon: user.wonItems.length,
        }));
        
        return processedResults;
      },
      'searchUsers'
    );
  },
};

// Admin API for content management
export const contentAPI = {
  async getAllAuctions() {
    return apiCall(
      async () => {
        // Check rate limit for admin API
        if (!await checkRateLimit('admin', 'adminApi')) {
          throw new APIError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED');
        }
        
        // Get all auctions from database
        const allAuctions = await db.query.auctionItems.findMany({
          with: {
            category: true,
            bids: true,
          },
          orderBy: desc(auctionItems.createdAt),
        });
        
        // Process auction data
        const processedAuctions = allAuctions.map(auction => ({
          ...auction,
          bidCount: auction.bids.length,
          highestBid: auction.currentBid,
          categoryName: auction.category.name,
        }));
        
        return processedAuctions;
      },
      'getAllAuctions'
    );
  },
  
  async createAuction(data: typeof auctionItems.$inferInsert, userId: string) {
    return apiCall(
      async () => {
        // Check rate limit for admin API
        if (!await checkRateLimit('admin', 'adminApi')) {
          throw new APIError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED');
        }
        
        // Check if user is admin
        const user = await db.query.users.findFirst({
          where: eq(users.id, userId),
        });
        
        if (!user?.isAdmin) {
          throw new APIError('Unauthorized', 403, 'UNAUTHORIZED');
        }
        
        // Create auction
        const [newAuction] = await db
          .insert(auctionItems)
          .values({
            ...data,
            createdBy: userId,
          })
          .returning();
        
        return newAuction;
      },
      'createAuction',
      userId
    );
  },
  
  async updateAuction(auctionId: string, data: Partial<typeof auctionItems.$inferInsert>, userId: string) {
    return apiCall(
      async () => {
        // Check rate limit for admin API
        if (!await checkRateLimit('admin', 'adminApi')) {
          throw new APIError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED');
        }
        
        // Check if user is admin
        const user = await db.query.users.findFirst({
          where: eq(users.id, userId),
        });
        
        if (!user?.isAdmin) {
          throw new APIError('Unauthorized', 403, 'UNAUTHORIZED');
        }
        
        // Update auction
        await db
          .update(auctionItems)
          .set({
            ...data,
            updatedAt: new Date(),
          })
          .where(eq(auctionItems.id, auctionId));
        
        // Get updated auction
        const updatedAuction = await db.query.auctionItems.findFirst({
          where: eq(auctionItems.id, auctionId),
          with: {
            category: true,
          },
        });
        
        if (!updatedAuction) {
          throw new APIError('Auction not found', 404, 'AUCTION_NOT_FOUND');
        }
        
        return updatedAuction;
      },
      'updateAuction',
      userId
    );
  },
  
  async deleteAuction(auctionId: string, userId: string) {
    return apiCall(
      async () => {
        // Check rate limit for admin API
        if (!await checkRateLimit('admin', 'adminApi')) {
          throw new APIError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED');
        }
        
        // Check if user is admin
        const user = await db.query.users.findFirst({
          where: eq(users.id, userId),
        });
        
        if (!user?.isAdmin) {
          throw new APIError('Unauthorized', 403, 'UNAUTHORIZED');
        }
        
        // Check if auction exists
        const auction = await db.query.auctionItems.findFirst({
          where: eq(auctionItems.id, auctionId),
        });
        
        if (!auction) {
          throw new APIError('Auction not found', 404, 'AUCTION_NOT_FOUND');
        }
        
        // Delete auction
        await db
          .delete(auctionItems)
          .where(eq(auctionItems.id, auctionId));
        
        return { success: true };
      },
      'deleteAuction',
      userId
    );
  },
  
  async getAllCategories() {
    return apiCall(
      async () => {
        // Check rate limit for admin API
        if (!await checkRateLimit('admin', 'adminApi')) {
          throw new APIError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED');
        }
        
        // Get all categories from database
        const allCategories = await db.query.categories.findMany();
        
        return allCategories;
      },
      'getAllCategories'
    );
  },
  
  async createCategory(data: typeof categories.$inferInsert, userId: string) {
    return apiCall(
      async () => {
        // Check rate limit for admin API
        if (!await checkRateLimit('admin', 'adminApi')) {
          throw new APIError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED');
        }
        
        // Check if user is admin
        const user = await db.query.users.findFirst({
          where: eq(users.id, userId),
        });
        
        if (!user?.isAdmin) {
          throw new APIError('Unauthorized', 403, 'UNAUTHORIZED');
        }
        
        // Create category
        const [newCategory] = await db
          .insert(categories)
          .values(data)
          .returning();
        
        return newCategory;
      },
      'createCategory',
      userId
    );
  },
};

// Security API for admin
export const securityAPI = {
  async getSuspiciousActivity() {
    return apiCall(
      async () => {
        // Check rate limit for admin API
        if (!await checkRateLimit('admin', 'adminApi')) {
          throw new APIError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED');
        }
        
        // In a real implementation, you would query a security events table
        // For now, we'll return data from Redis
        
        // Get all keys matching suspicious activity pattern
        const keys = await redis.keys('suspicious:*');
        
        // Get data for each key
        const suspiciousActivities = await Promise.all(
          keys.map(async (key) => {
            const value = await redis.get(key);
            const parts = key.split(':');
            
            return {
              identifier: parts[1],
              reason: parts[2],
              timestamp: value ? new Date(parseInt(value, 10)) : new Date(),
            };
          })
        );
        
        return suspiciousActivities;
      },
      'getSuspiciousActivity'
    );
  },
  
  async getRateLimitViolations() {
    return apiCall(
      async () => {
        // Check rate limit for admin API
        if (!await checkRateLimit('admin', 'adminApi')) {
          throw new APIError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED');
        }
        
        // In a real implementation, you would query a rate limit violations table
        // For now, we'll return data from Redis
        
        // Get all keys matching rate limit violations pattern
        const keys = await redis.keys('ratelimit:violations:*');
        
        // Get data for each key
        const violations = await Promise.all(
          keys.map(async (key) => {
            const value = await redis.get(key);
            const identifier = key.replace('ratelimit:violations:', '');
            
            return {
              identifier,
              violations: parseInt(value || '0', 10),
            };
          })
        );
        
        return violations;
      },
      'getRateLimitViolations'
    );
  },
  
  async blockUser(userId: string, adminId: string, reason: string) {
    return apiCall(
      async () => {
        // Check rate limit for admin API
        if (!await checkRateLimit('admin', 'adminApi')) {
          throw new APIError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED');
        }
        
        // Check if admin user is valid
        const admin = await db.query.users.findFirst({
          where: eq(users.id, adminId),
        });
        
        if (!admin?.isAdmin) {
          throw new APIError('Unauthorized', 403, 'UNAUTHORIZED');
        }
        
        // Update user to blocked status
        // In a real implementation, you would have a 'status' field on the user
        // For now, we'll just add a flag in Redis
        await redis.set(`blocked:${userId}`, reason, 30 * 24 * 60 * 60); // 30 days
        
        return { success: true };
      },
      'blockUser',
      adminId
    );
  },
};