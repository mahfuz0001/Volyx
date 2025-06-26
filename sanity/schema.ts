// Enhanced Sanity Studio Schema Configuration for Curated Auction Platform

export const schemaTypes = [
  {
    name: 'category',
    title: 'Category',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Name',
        type: 'string',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'icon',
        title: 'Icon',
        type: 'string',
        description: 'Emoji or icon identifier',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text',
      },
      {
        name: 'subcategories',
        title: 'Subcategories',
        type: 'array',
        of: [{ type: 'string' }],
        description: 'List of subcategories for this category',
      },
      {
        name: 'isActive',
        title: 'Active',
        type: 'boolean',
        initialValue: true,
      },
    ],
  },
  {
    name: 'auctionItem',
    title: 'Auction Item',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'description',
        title: 'Short Description',
        type: 'text',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'detailedDescription',
        title: 'Detailed Description',
        type: 'text',
        description: 'Comprehensive description for product detail page',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'authenticity',
        title: 'Authenticity Information',
        type: 'string',
        description: 'Authentication details, certificates, provenance',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'condition',
        title: 'Condition',
        type: 'string',
        options: {
          list: [
            { title: 'Mint', value: 'mint' },
            { title: 'Near Mint', value: 'near-mint' },
            { title: 'Excellent', value: 'excellent' },
            { title: 'Very Good', value: 'very-good' },
            { title: 'Good', value: 'good' },
            { title: 'Fair', value: 'fair' },
          ],
        },
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'rarity',
        title: 'Rarity Level',
        type: 'string',
        options: {
          list: [
            { title: 'Common', value: 'common' },
            { title: 'Uncommon', value: 'uncommon' },
            { title: 'Rare', value: 'rare' },
            { title: 'Epic', value: 'epic' },
            { title: 'Legendary', value: 'legendary' },
          ],
        },
        initialValue: 'common',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'image',
        title: 'Main Image',
        type: 'image',
        options: {
          hotspot: true,
        },
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'gallery',
        title: 'Image Gallery',
        type: 'array',
        of: [
          {
            type: 'image',
            options: {
              hotspot: true,
            },
          },
        ],
        description: 'Additional images for the product gallery',
      },
      {
        name: 'minimumBid',
        title: 'Starting Bid',
        type: 'number',
        validation: (Rule: any) => Rule.required().min(1),
      },
      {
        name: 'currentBid',
        title: 'Current Highest Bid',
        type: 'number',
        initialValue: 0,
      },
      {
        name: 'bidIncrement',
        title: 'Bid Increment',
        type: 'number',
        description: 'Minimum amount to increase bid by',
        validation: (Rule: any) => Rule.required().min(1),
      },
      {
        name: 'endTime',
        title: 'Auction End Time',
        type: 'datetime',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'category',
        title: 'Category',
        type: 'reference',
        to: [{ type: 'category' }],
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'subcategory',
        title: 'Subcategory',
        type: 'string',
        description: 'Specific subcategory within the main category',
      },
      {
        name: 'isHot',
        title: 'Hot Auction',
        type: 'boolean',
        initialValue: false,
        description: 'Mark as trending/popular auction',
      },
      {
        name: 'isFeatured',
        title: 'Featured Item',
        type: 'boolean',
        initialValue: false,
        description: 'Curator\'s choice - featured prominently',
      },
      {
        name: 'isActive',
        title: 'Active',
        type: 'boolean',
        initialValue: true,
      },
      {
        name: 'estimatedValue',
        title: 'Estimated Value Range',
        type: 'object',
        fields: [
          {
            name: 'min',
            title: 'Minimum Value ($)',
            type: 'number',
            validation: (Rule: any) => Rule.required().min(0),
          },
          {
            name: 'max',
            title: 'Maximum Value ($)',
            type: 'number',
            validation: (Rule: any) => Rule.required().min(0),
          },
        ],
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'shippingCost',
        title: 'Shipping Cost',
        type: 'number',
        initialValue: 0,
        description: 'Shipping cost in dollars',
      },
      {
        name: 'shippingTime',
        title: 'Shipping Time',
        type: 'string',
        description: 'Expected shipping timeframe (e.g., "3-5 business days")',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'returnPolicy',
        title: 'Return Policy',
        type: 'text',
        description: 'Return policy specific to this item',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'curatorNotes',
        title: 'Curator Notes',
        type: 'text',
        description: 'Special notes from the curator about this item',
      },
      {
        name: 'provenance',
        title: 'Provenance',
        type: 'text',
        description: 'History and origin of the item',
      },
      {
        name: 'createdBy',
        title: 'Created By',
        type: 'string',
        description: 'User ID of the creator/curator',
      },
    ],
    preview: {
      select: {
        title: 'title',
        media: 'image',
        subtitle: 'category.name',
        rarity: 'rarity',
      },
      prepare(selection: any) {
        const { title, media, subtitle, rarity } = selection;
        return {
          title: `${title} (${rarity?.toUpperCase() || 'COMMON'})`,
          media,
          subtitle: subtitle || 'No category',
        };
      },
    },
  },
  {
    name: 'user',
    title: 'User',
    type: 'document',
    fields: [
      {
        name: 'email',
        title: 'Email',
        type: 'string',
        validation: (Rule: any) => Rule.required().email(),
      },
      {
        name: 'name',
        title: 'Name',
        type: 'string',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'connectsBalance',
        title: 'Connects Balance',
        type: 'number',
        initialValue: 100,
      },
      {
        name: 'isAdmin',
        title: 'Admin',
        type: 'boolean',
        initialValue: false,
      },
      {
        name: 'isCurator',
        title: 'Curator',
        type: 'boolean',
        initialValue: false,
        description: 'Can add and manage auction items',
      },
      {
        name: 'trustScore',
        title: 'Trust Score',
        type: 'number',
        initialValue: 100,
        description: 'User trust score based on bidding behavior',
      },
      {
        name: 'bidHistory',
        title: 'Bid History',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              {
                name: 'auctionItemId',
                title: 'Auction Item ID',
                type: 'string',
              },
              {
                name: 'amount',
                title: 'Bid Amount',
                type: 'number',
              },
              {
                name: 'timestamp',
                title: 'Timestamp',
                type: 'datetime',
              },
            ],
          },
        ],
      },
      {
        name: 'watchlist',
        title: 'Watchlist',
        type: 'array',
        of: [{ type: 'string' }],
        description: 'Array of auction item IDs user is watching',
      },
      {
        name: 'notificationPreferences',
        title: 'Notification Preferences',
        type: 'object',
        fields: [
          {
            name: 'outbid',
            title: 'Outbid Notifications',
            type: 'boolean',
            initialValue: true,
          },
          {
            name: 'endingSoon',
            title: 'Ending Soon Notifications',
            type: 'boolean',
            initialValue: true,
          },
          {
            name: 'newAuctions',
            title: 'New Auctions Notifications',
            type: 'boolean',
            initialValue: false,
          },
          {
            name: 'connects',
            title: 'Connects Notifications',
            type: 'boolean',
            initialValue: true,
          },
          {
            name: 'wonItems',
            title: 'Won Items Notifications',
            type: 'boolean',
            initialValue: true,
          },
        ],
      },
    ],
    preview: {
      select: {
        title: 'name',
        subtitle: 'email',
        connectsBalance: 'connectsBalance',
      },
      prepare(selection: any) {
        const { title, subtitle, connectsBalance } = selection;
        return {
          title,
          subtitle: `${subtitle} • ${connectsBalance} Connects`,
        };
      },
    },
  },
  {
    name: 'bid',
    title: 'Bid',
    type: 'document',
    fields: [
      {
        name: 'auctionItem',
        title: 'Auction Item',
        type: 'reference',
        to: [{ type: 'auctionItem' }],
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'user',
        title: 'User',
        type: 'reference',
        to: [{ type: 'user' }],
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'amount',
        title: 'Bid Amount',
        type: 'number',
        validation: (Rule: any) => Rule.required().min(1),
      },
      {
        name: 'isProxyBid',
        title: 'Proxy Bid',
        type: 'boolean',
        initialValue: false,
        description: 'Whether this is an automatic proxy bid',
      },
      {
        name: 'maxProxyAmount',
        title: 'Maximum Proxy Amount',
        type: 'number',
        description: 'Maximum amount for proxy bidding',
      },
      {
        name: 'ipAddress',
        title: 'IP Address',
        type: 'string',
        description: 'IP address for fraud detection',
      },
      {
        name: 'deviceFingerprint',
        title: 'Device Fingerprint',
        type: 'string',
        description: 'Device fingerprint for fraud detection',
      },
      {
        name: 'createdAt',
        title: 'Created At',
        type: 'datetime',
        initialValue: () => new Date().toISOString(),
      },
    ],
    preview: {
      select: {
        title: 'amount',
        subtitle: 'auctionItem.title',
        user: 'user.name',
      },
      prepare(selection: any) {
        const { title, subtitle, user } = selection;
        return {
          title: `${title} Connects`,
          subtitle: `${user} bid on: ${subtitle}`,
        };
      },
    },
  },
  {
    name: 'connectsTransaction',
    title: 'Connects Transaction',
    type: 'document',
    fields: [
      {
        name: 'user',
        title: 'User',
        type: 'reference',
        to: [{ type: 'user' }],
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'type',
        title: 'Transaction Type',
        type: 'string',
        options: {
          list: [
            { title: 'Earned', value: 'earned' },
            { title: 'Spent', value: 'spent' },
            { title: 'Purchased', value: 'purchased' },
            { title: 'Refunded', value: 'refunded' },
          ],
        },
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'amount',
        title: 'Amount',
        type: 'number',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'reason',
        title: 'Reason',
        type: 'string',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'createdAt',
        title: 'Created At',
        type: 'datetime',
        initialValue: () => new Date().toISOString(),
      },
    ],
    preview: {
      select: {
        title: 'amount',
        subtitle: 'reason',
        type: 'type',
      },
      prepare(selection: any) {
        const { title, subtitle, type } = selection;
        const sign = type === 'spent' ? '-' : '+';
        return {
          title: `${sign}${title} Connects`,
          subtitle: subtitle,
        };
      },
    },
  },
  {
    name: 'connectsPurchase',
    title: 'Connects Purchase',
    type: 'document',
    fields: [
      {
        name: 'user',
        title: 'User',
        type: 'reference',
        to: [{ type: 'user' }],
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'packageId',
        title: 'Package ID',
        type: 'string',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'amount',
        title: 'Base Amount',
        type: 'number',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'bonus',
        title: 'Bonus Amount',
        type: 'number',
        initialValue: 0,
      },
      {
        name: 'totalConnects',
        title: 'Total Connects',
        type: 'number',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'price',
        title: 'Price Paid ($)',
        type: 'number',
        validation: (Rule: any) => Rule.required(),
      },
      {
        name: 'paymentMethod',
        title: 'Payment Method',
        type: 'string',
      },
      {
        name: 'transactionId',
        title: 'Transaction ID',
        type: 'string',
      },
      {
        name: 'createdAt',
        title: 'Created At',
        type: 'datetime',
        initialValue: () => new Date().toISOString(),
      },
    ],
    preview: {
      select: {
        title: 'totalConnects',
        subtitle: 'price',
        user: 'user.name',
      },
      prepare(selection: any) {
        const { title, subtitle, user } = selection;
        return {
          title: `${title} Connects`,
          subtitle: `${user} - $${subtitle}`,
        };
      },
    },
  },
];