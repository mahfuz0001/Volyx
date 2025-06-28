declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Database
      EXPO_PUBLIC_DATABASE_URL: string;

      // Sanity CMS
      EXPO_PUBLIC_SANITY_PROJECT_ID: string;
      EXPO_PUBLIC_SANITY_DATASET: string;
      EXPO_PUBLIC_SANITY_TOKEN: string;
      EXPO_PUBLIC_SANITY_API_VERSION: string;

      // Redis
      EXPO_PUBLIC_REDIS_URL: string;

      // API
      EXPO_PUBLIC_API_URL: string;
      EXPO_PUBLIC_API_KEY: string;

      // Push Notifications
      EXPO_PUBLIC_FCM_SERVER_KEY: string;
      EXPO_PUBLIC_FCM_SENDER_ID: string;

      // Payments
      EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
      STRIPE_SECRET_KEY: string;

      // App Configuration
      EXPO_PUBLIC_APP_ENV: 'development' | 'staging' | 'production';
      EXPO_PUBLIC_APP_VERSION: string;
      EXPO_PUBLIC_ENABLE_ANALYTICS: string;

      // Security
      EXPO_PUBLIC_JWT_SECRET: string;
      EXPO_PUBLIC_ENCRYPTION_KEY: string;

      // External Services
      EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME: string;
      EXPO_PUBLIC_CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;

      // Email
      EXPO_PUBLIC_SENDGRID_API_KEY: string;
      EXPO_PUBLIC_FROM_EMAIL: string;

      // Analytics
      EXPO_PUBLIC_GOOGLE_ANALYTICS_ID: string;
      EXPO_PUBLIC_MIXPANEL_TOKEN: string;

      // Social Auth
      EXPO_PUBLIC_GOOGLE_CLIENT_ID: string;
      EXPO_PUBLIC_APPLE_CLIENT_ID: string;

      // Rate Limiting
      EXPO_PUBLIC_RATE_LIMIT_WINDOW: string;
      EXPO_PUBLIC_RATE_LIMIT_MAX_REQUESTS: string;
    }
  }
}

export {};
