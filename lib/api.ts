import { sanityClient, AUCTION_ITEMS_QUERY, HOT_AUCTIONS_QUERY, FEATURED_AUCTIONS_QUERY, ENDING_SOON_QUERY, CATEGORIES_QUERY, AUCTION_ITEM_BY_ID_QUERY, BID_HISTORY_QUERY } from './sanity';
import { captureError, captureMessage } from './sentry';
import { z } from 'zod';

// Enhanced rate limiting store with device fingerprinting
const rateLimitStore = new Map<string, { count: number; resetTime: number; violations: number }>();
const suspiciousActivityStore = new Map<string, { rapidBids: number; lastSecondBids: number; flagged: boolean }>();

// Enhanced rate limiting configuration
const RATE_LIMITS = {
  default: { requests: 100, windowMs: 15 * 60 * 1000 }, // 100 requests per 15 minutes
  bid: { requests: 10, windowMs: 60 * 1000 }, // 10 bids per minute
  rapidBid: { requests: 3, windowMs: 10 * 1000 }, // 3 bids per 10 seconds
  auth: { requests: 5, windowMs: 15 * 60 * 1000 }, // 5 auth attempts per 15 minutes
  videoWatch: { requests: 10, windowMs: 24 * 60 * 60 * 1000 }, // 10 videos per day
};

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
export function checkRateLimit(identifier: string, type: keyof typeof RATE_LIMITS = 'default'): boolean {
  const limit = RATE_LIMITS[type];
  const now = Date.now();
  const key = `${type}:${identifier}`;
  
  const current = rateLimitStore.get(key);
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + limit.windowMs, violations: 0 });
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

// Behavioral anomaly detection
export function detectSuspiciousBidding(userId: string, auctionItemId: string, bidTime: number, auctionEndTime: number): boolean {
  const key = `${userId}:${auctionItemId}`;
  const activity = suspiciousActivityStore.get(key) || { rapidBids: 0, lastSecondBids: 0, flagged: false };
  
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
  const recentActivity = Array.from(suspiciousActivityStore.entries())
    .filter(([k, v]) => k.startsWith(userId) && Date.now() - bidTime < 30000);
  
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

function flagSuspiciousActivity(identifier: string, reason: string) {
  captureMessage(`Suspicious activity detected: ${reason} for ${identifier}`, 'warning');
  // In production, this would trigger admin notifications
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
    if (!checkRateLimit(identifier)) {
      throw new APIError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED');
    }

    const result = await operation();
    captureMessage(`${operationName} completed successfully`, 'info');
    return result;
  } catch (error) {
    const apiError = error instanceof APIError ? error : new APIError(
      `${operationName} failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      500,
      'INTERNAL_ERROR'
    );
    
    captureError(apiError, {
      operation: operationName,
      userId,
      deviceFingerprint,
      timestamp: new Date().toISOString(),
    });
    
    throw apiError;
  }
}

// Enhanced Auction Items API
export const auctionAPI = {
  async getAll() {
    return apiCall(
      () => sanityClient.fetch(AUCTION_ITEMS_QUERY),
      'fetchAuctionItems'
    );
  },

  async getHot() {
    return apiCall(
      () => sanityClient.fetch(HOT_AUCTIONS_QUERY),
      'fetchHotAuctions'
    );
  },

  async getFeatured() {
    return apiCall(
      () => sanityClient.fetch(FEATURED_AUCTIONS_QUERY),
      'fetchFeaturedAuctions'
    );
  },

  async getEndingSoon() {
    return apiCall(
      () => sanityClient.fetch(ENDING_SOON_QUERY),
      'fetchEndingSoonAuctions'
    );
  },

  async getById(id: string) {
    return apiCall(
      () => sanityClient.fetch(AUCTION_ITEM_BY_ID_QUERY, { id }),
      'fetchAuctionItemById'
    );
  },

  async getBidHistory(auctionItemId: string) {
    return apiCall(
      () => sanityClient.fetch(BID_HISTORY_QUERY, { auctionItemId }),
      'fetchBidHistory'
    );
  },

  async create(data: z.infer<typeof AuctionItemSchema>, userId: string) {
    const validatedData = AuctionItemSchema.parse(data);
    
    return apiCall(
      () => sanityClient.create({
        _type: 'auctionItem',
        ...validatedData,
        currentBid: 0,
        isActive: true,
        createdBy: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
      'createAuctionItem',
      userId
    );
  },

  async placeBid(data: z.infer<typeof BidSchema>) {
    const validatedData = BidSchema.parse(data);
    
    // Enhanced rate limiting for bidding
    if (!checkRateLimit(validatedData.userId, 'bid')) {
      throw new APIError('Bid rate limit exceeded', 429, 'BID_RATE_LIMIT');
    }

    if (!checkRateLimit(validatedData.deviceFingerprint, 'rapidBid')) {
      throw new APIError('Too many rapid bids', 429, 'RAPID_BID_LIMIT');
    }

    return apiCall(
      async () => {
        // Get current auction item
        const auctionItem = await sanityClient.fetch(AUCTION_ITEM_BY_ID_QUERY, { 
          id: validatedData.auctionItemId 
        });

        if (!auctionItem) {
          throw new APIError('Auction item not found', 404, 'AUCTION_NOT_FOUND');
        }

        const auctionEndTime = new Date(auctionItem.endTime).getTime();
        const now = Date.now();

        // Check if auction has ended
        if (now > auctionEndTime) {
          throw new APIError('Auction has ended', 400, 'AUCTION_ENDED');
        }

        // Behavioral analysis
        if (detectSuspiciousBidding(validatedData.userId, validatedData.auctionItemId, now, auctionEndTime)) {
          throw new APIError('Suspicious bidding pattern detected', 403, 'SUSPICIOUS_ACTIVITY');
        }

        const requiredIncrement = calculateBidIncrement(auctionItem.currentBid);
        const minimumBid = auctionItem.currentBid + requiredIncrement;

        if (validatedData.amount < minimumBid) {
          throw new APIError(`Bid must be at least ${minimumBid} Connects`, 400, 'INVALID_BID_AMOUNT');
        }

        // Handle overtime/soft close (extend auction by 2 minutes if bid placed in last 30 seconds)
        let newEndTime = auctionItem.endTime;
        if (auctionEndTime - now < 30000) {
          newEndTime = new Date(now + 2 * 60 * 1000).toISOString();
        }

        // Update auction item with new bid
        await sanityClient
          .patch(validatedData.auctionItemId)
          .set({ 
            currentBid: validatedData.amount,
            endTime: newEndTime,
            updatedAt: new Date().toISOString()
          })
          .commit();

        // Create bid record
        return sanityClient.create({
          _type: 'bid',
          auctionItem: {
            _type: 'reference',
            _ref: validatedData.auctionItemId,
          },
          user: {
            _type: 'reference',
            _ref: validatedData.userId,
          },
          amount: validatedData.amount,
          isProxyBid: validatedData.isProxyBid || false,
          maxProxyAmount: validatedData.maxProxyAmount,
          ipAddress: validatedData.ipAddress,
          deviceFingerprint: validatedData.deviceFingerprint,
          createdAt: new Date().toISOString(),
        });
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
        return sanityClient.create({
          _type: 'proxyBid',
          auctionItem: {
            _type: 'reference',
            _ref: validatedData.auctionItemId,
          },
          user: {
            _type: 'reference',
            _ref: validatedData.userId,
          },
          maxAmount: validatedData.maxAmount,
          isActive: true,
          createdAt: new Date().toISOString(),
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
      () => sanityClient.fetch(CATEGORIES_QUERY),
      'fetchCategories'
    );
  },

  async getByCategory(categoryId: string) {
    return apiCall(
      () => sanityClient.fetch(`
        *[_type == "auctionItem" && isActive == true && category._ref == $categoryId] | order(endTime asc) {
          _id,
          title,
          description,
          image,
          minimumBid,
          currentBid,
          bidIncrement,
          endTime,
          category->{name, icon},
          rarity,
          isHot,
          estimatedValue,
          createdAt,
          updatedAt
        }
      `, { categoryId }),
      'fetchAuctionsByCategory'
    );
  },
};

// Enhanced Users API with Connects management
export const usersAPI = {
  async create(data: z.infer<typeof UserSchema>) {
    const validatedData = UserSchema.parse(data);
    
    return apiCall(
      () => sanityClient.create({
        _type: 'user',
        ...validatedData,
        connectsBalance: 100, // Starting balance
        isAdmin: false,
        isCurator: false,
        trustScore: 100,
        bidHistory: [],
        watchlist: [],
        notificationPreferences: {
          outbid: true,
          endingSoon: true,
          newAuctions: false,
          connects: true,
          wonItems: true,
        },
        createdAt: new Date().toISOString(),
      }),
      'createUser'
    );
  },

  async updateConnects(userId: string, amount: number, type: 'add' | 'subtract', reason: string) {
    return apiCall(
      async () => {
        const user = await sanityClient.fetch(`*[_type == "user" && _id == $userId][0]`, { userId });
        
        if (!user) {
          throw new APIError('User not found', 404, 'USER_NOT_FOUND');
        }

        const newBalance = type === 'add' 
          ? user.connectsBalance + amount 
          : user.connectsBalance - amount;

        if (newBalance < 0) {
          throw new APIError('Insufficient connects', 400, 'INSUFFICIENT_CONNECTS');
        }

        // Update user balance
        await sanityClient
          .patch(userId)
          .set({ connectsBalance: newBalance })
          .commit();

        // Create transaction record
        return sanityClient.create({
          _type: 'connectsTransaction',
          user: {
            _type: 'reference',
            _ref: userId,
          },
          type: type === 'add' ? 'earned' : 'spent',
          amount: type === 'add' ? amount : -amount,
          reason,
          createdAt: new Date().toISOString(),
        });
      },
      'updateUserConnects',
      userId
    );
  },

  async watchVideo(userId: string, deviceFingerprint: string) {
    // Check daily video limit
    if (!checkRateLimit(`${userId}:${deviceFingerprint}`, 'videoWatch')) {
      throw new APIError('Daily video limit reached', 429, 'VIDEO_LIMIT_EXCEEDED');
    }

    const connectsEarned = 10; // Base amount, could be dynamic
    
    return apiCall(
      () => this.updateConnects(userId, connectsEarned, 'add', 'Watched video advertisement'),
      'watchVideo',
      userId,
      deviceFingerprint
    );
  },

  async purchaseConnects(userId: string, packageId: string, amount: number, bonus: number) {
    const totalConnects = amount + bonus;
    
    return apiCall(
      async () => {
        // In production, this would integrate with payment processing
        await this.updateConnects(userId, totalConnects, 'add', `Purchased ${amount} + ${bonus} bonus Connects`);
        
        // Create purchase record
        return sanityClient.create({
          _type: 'connectsPurchase',
          user: {
            _type: 'reference',
            _ref: userId,
          },
          packageId,
          amount,
          bonus,
          totalConnects,
          createdAt: new Date().toISOString(),
        });
      },
      'purchaseConnects',
      userId
    );
  },
};

// Analytics API for admin dashboard
export const analyticsAPI = {
  async getDashboardStats() {
    return apiCall(
      async () => {
        const [totalUsers, activeAuctions, totalBids, totalRevenue] = await Promise.all([
          sanityClient.fetch(`count(*[_type == "user"])`),
          sanityClient.fetch(`count(*[_type == "auctionItem" && isActive == true])`),
          sanityClient.fetch(`count(*[_type == "bid"])`),
          sanityClient.fetch(`count(*[_type == "connectsPurchase"])`),
        ]);

        return {
          totalUsers,
          activeAuctions,
          totalBids,
          revenue: totalRevenue * 4.99, // Mock calculation
        };
      },
      'fetchDashboardStats'
    );
  },

  async getAuctionPerformance() {
    return apiCall(
      () => sanityClient.fetch(`
        *[_type == "auctionItem"] {
          _id,
          title,
          currentBid,
          minimumBid,
          "bidCount": count(*[_type == "bid" && auctionItem._ref == ^._id]),
          endTime,
          isActive
        } | order(bidCount desc)
      `),
      'fetchAuctionPerformance'
    );
  },
};