import { pgTable, serial, text, integer, timestamp, boolean, uuid, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  connectsBalance: integer('connects_balance').default(100),
  isAdmin: boolean('is_admin').default(false),
  clerkId: text('clerk_id').notNull().unique(),
  imageUrl: text('image_url'),
  phone: text('phone'),
  location: text('location'),
  bio: text('bio'),
  trustScore: integer('trust_score').default(100),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  icon: text('icon').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const auctionItems = pgTable('auction_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  image: text('image').notNull(),
  currentBid: integer('current_bid').default(0),
  minimumBid: integer('minimum_bid').notNull(),
  endTime: timestamp('end_time').notNull(),
  categoryId: uuid('category_id').references(() => categories.id),
  isHot: boolean('is_hot').default(false),
  isActive: boolean('is_active').default(true),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const bids = pgTable('bids', {
  id: uuid('id').primaryKey().defaultRandom(),
  auctionItemId: uuid('auction_item_id').references(() => auctionItems.id),
  userId: uuid('user_id').references(() => users.id),
  amount: integer('amount').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const connectsTransactions = pgTable('connects_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  type: text('type').notNull(), // 'earned', 'spent', 'purchased'
  amount: integer('amount').notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const wonItems = pgTable('won_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  auctionItemId: uuid('auction_item_id').references(() => auctionItems.id),
  userId: uuid('user_id').references(() => users.id),
  winningBid: integer('winning_bid').notNull(),
  wonAt: timestamp('won_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  bids: many(bids),
  connectsTransactions: many(connectsTransactions),
  wonItems: many(wonItems),
  createdAuctions: many(auctionItems),
}));

export const auctionItemsRelations = relations(auctionItems, ({ one, many }) => ({
  category: one(categories, {
    fields: [auctionItems.categoryId],
    references: [categories.id],
  }),
  creator: one(users, {
    fields: [auctionItems.createdBy],
    references: [users.id],
  }),
  bids: many(bids),
  wonItems: many(wonItems),
}));

export const bidsRelations = relations(bids, ({ one }) => ({
  auctionItem: one(auctionItems, {
    fields: [bids.auctionItemId],
    references: [auctionItems.id],
  }),
  user: one(users, {
    fields: [bids.userId],
    references: [users.id],
  }),
}));

export const connectsTransactionsRelations = relations(connectsTransactions, ({ one }) => ({
  user: one(users, {
    fields: [connectsTransactions.userId],
    references: [users.id],
  }),
}));

export const wonItemsRelations = relations(wonItems, ({ one }) => ({
  auctionItem: one(auctionItems, {
    fields: [wonItems.auctionItemId],
    references: [auctionItems.id],
  }),
  user: one(users, {
    fields: [wonItems.userId],
    references: [users.id],
  }),
}));