import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: process.env.EXPO_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.EXPO_PUBLIC_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
  token: process.env.EXPO_PUBLIC_SANITY_TOKEN,
});

const builder = imageUrlBuilder(sanityClient);

export const urlFor = (source: any) => builder.image(source);

// Enhanced Sanity schemas for curated products
export interface SanityAuctionItem {
  _id: string;
  _type: 'auctionItem';
  title: string;
  description: string;
  detailedDescription: string;
  authenticity: string;
  condition: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  image: {
    asset: {
      _ref: string;
      _type: 'reference';
    };
    alt?: string;
  };
  gallery: Array<{
    asset: {
      _ref: string;
      _type: 'reference';
    };
    alt?: string;
  }>;
  minimumBid: number;
  currentBid: number;
  bidIncrement: number;
  endTime: string;
  category: {
    _ref: string;
    _type: 'reference';
    name: string;
    icon: string;
  };
  subcategory: string;
  isHot: boolean;
  isFeatured: boolean;
  isActive: boolean;
  estimatedValue: {
    min: number;
    max: number;
  };
  shippingCost: number;
  shippingTime: string;
  returnPolicy: string;
  curatorNotes: string;
  provenance: string;
  createdAt: string;
  updatedAt: string;
}

export interface SanityCategory {
  _id: string;
  _type: 'category';
  name: string;
  icon: string;
  description: string;
  subcategories: string[];
  isActive: boolean;
}

export interface SanityUser {
  _id: string;
  _type: 'user';
  email: string;
  name: string;
  connectsBalance: number;
  isAdmin: boolean;
  isCurator: boolean;
  trustScore: number;
  bidHistory: Array<{
    auctionItemId: string;
    amount: number;
    timestamp: string;
  }>;
  watchlist: string[];
  notificationPreferences: {
    outbid: boolean;
    endingSoon: boolean;
    newAuctions: boolean;
    connects: boolean;
    wonItems: boolean;
  };
  createdAt: string;
}

export interface SanityBid {
  _id: string;
  _type: 'bid';
  auctionItem: {
    _ref: string;
    _type: 'reference';
  };
  user: {
    _ref: string;
    _type: 'reference';
  };
  amount: number;
  isProxyBid: boolean;
  maxProxyAmount?: number;
  ipAddress: string;
  deviceFingerprint: string;
  createdAt: string;
}

// Enhanced GROQ queries
export const AUCTION_ITEMS_QUERY = `
  *[_type == "auctionItem" && isActive == true] | order(endTime asc) {
    _id,
    title,
    description,
    detailedDescription,
    authenticity,
    condition,
    rarity,
    image,
    gallery,
    minimumBid,
    currentBid,
    bidIncrement,
    endTime,
    category->{name, icon},
    subcategory,
    isHot,
    isFeatured,
    isActive,
    estimatedValue,
    shippingCost,
    shippingTime,
    returnPolicy,
    curatorNotes,
    provenance,
    createdAt,
    updatedAt
  }
`;

export const HOT_AUCTIONS_QUERY = `
  *[_type == "auctionItem" && isActive == true && isHot == true] | order(endTime asc) {
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
    isFeatured,
    estimatedValue,
    createdAt,
    updatedAt
  }
`;

export const FEATURED_AUCTIONS_QUERY = `
  *[_type == "auctionItem" && isActive == true && isFeatured == true] | order(endTime asc) {
    _id,
    title,
    description,
    image,
    gallery,
    minimumBid,
    currentBid,
    bidIncrement,
    endTime,
    category->{name, icon},
    rarity,
    isHot,
    isFeatured,
    estimatedValue,
    curatorNotes,
    createdAt,
    updatedAt
  }
`;

export const ENDING_SOON_QUERY = `
  *[_type == "auctionItem" && isActive == true && dateTime(endTime) < dateTime(now()) + 60*60] | order(endTime asc) {
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
`;

export const CATEGORIES_QUERY = `
  *[_type == "category" && isActive == true] | order(name asc) {
    _id,
    name,
    icon,
    description,
    subcategories,
    isActive
  }
`;

export const AUCTION_ITEM_BY_ID_QUERY = `
  *[_type == "auctionItem" && _id == $id][0] {
    _id,
    title,
    description,
    detailedDescription,
    authenticity,
    condition,
    rarity,
    image,
    gallery,
    minimumBid,
    currentBid,
    bidIncrement,
    endTime,
    category->{name, icon},
    subcategory,
    isHot,
    isFeatured,
    isActive,
    estimatedValue,
    shippingCost,
    shippingTime,
    returnPolicy,
    curatorNotes,
    provenance,
    createdAt,
    updatedAt
  }
`;

export const BID_HISTORY_QUERY = `
  *[_type == "bid" && auctionItem._ref == $auctionItemId] | order(createdAt desc) {
    _id,
    amount,
    isProxyBid,
    user->{name},
    createdAt
  }
`;