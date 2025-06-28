import Constants from 'expo-constants';

// Environment configuration with fallbacks
export const config = {
  // Database
  database: {
    url: process.env.EXPO_PUBLIC_DATABASE_URL || '',
  },

  // Sanity CMS
  sanity: {
    projectId: process.env.EXPO_PUBLIC_SANITY_PROJECT_ID || '',
    dataset: process.env.EXPO_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.EXPO_PUBLIC_SANITY_TOKEN || '',
    apiVersion: process.env.EXPO_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  },

  // Redis
  redis: {
    url: process.env.EXPO_PUBLIC_REDIS_URL || 'redis://localhost:6379',
  },

  // API
  api: {
    url: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
    key: process.env.EXPO_PUBLIC_API_KEY || '',
  },

  // Payments
  payments: {
    stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  },

  // App
  app: {
    env:
      (process.env.EXPO_PUBLIC_APP_ENV as
        | 'development'
        | 'staging'
        | 'production') || 'development',
    version: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
    enableAnalytics: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === 'true',
    isDev: __DEV__,
    isWeb: Constants.platform?.web !== undefined,
  },

  // Security
  security: {
    jwtSecret: process.env.EXPO_PUBLIC_JWT_SECRET || 'default-secret',
    encryptionKey: process.env.EXPO_PUBLIC_ENCRYPTION_KEY || 'default-key',
  },

  // External Services
  cloudinary: {
    cloudName: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },

  // Email
  email: {
    sendgridApiKey: process.env.EXPO_PUBLIC_SENDGRID_API_KEY || '',
    fromEmail: process.env.EXPO_PUBLIC_FROM_EMAIL || 'noreply@volyx.com',
  },

  // Analytics
  analytics: {
    googleAnalyticsId: process.env.EXPO_PUBLIC_GOOGLE_ANALYTICS_ID || '',
    mixpanelToken: process.env.EXPO_PUBLIC_MIXPANEL_TOKEN || '',
  },

  // Social Auth
  socialAuth: {
    googleClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
    appleClientId: process.env.EXPO_PUBLIC_APPLE_CLIENT_ID || '',
  },

  // Rate Limiting
  rateLimiting: {
    windowMs: parseInt(process.env.EXPO_PUBLIC_RATE_LIMIT_WINDOW || '900000'),
    maxRequests: parseInt(
      process.env.EXPO_PUBLIC_RATE_LIMIT_MAX_REQUESTS || '100'
    ),
  },
};

// Validation function to check required environment variables
export const validateConfig = () => {
  const requiredVars = [
    'EXPO_PUBLIC_SANITY_PROJECT_ID',
    'EXPO_PUBLIC_DATABASE_URL',
  ];

  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.warn('Missing required environment variables:', missing);
    if (config.app.env === 'production') {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}`
      );
    }
  }
};

// Initialize config validation
validateConfig();
