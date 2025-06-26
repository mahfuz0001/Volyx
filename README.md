# Volyx - Premium Auction Platform

A modern, production-ready auction platform built with React Native, Expo, Sanity CMS, and comprehensive error handling.

## 🚀 Features

### Core Functionality
- **Real-time Auctions**: Live bidding with countdown timers
- **Sanity CMS Integration**: Content management for auction items
- **User Authentication**: Secure login with admin roles
- **Connects System**: Virtual currency for bidding
- **Rate Limiting**: API protection against abuse
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Performance Monitoring**: Sentry integration for error tracking

### Modern UI/UX
- **GSAP Animations**: Smooth, professional animations
- **Responsive Design**: Optimized for all screen sizes
- **Modern Typography**: Inter font family implementation
- **Gradient Backgrounds**: Beautiful visual effects
- **Loading States**: Elegant loading indicators
- **Error States**: User-friendly error messages

### Admin Features
- **Admin Dashboard**: Complete platform management
- **Product Management**: Add and manage auction items
- **User Analytics**: Real-time statistics and insights
- **Content Control**: Full CMS integration

## 🛠 Tech Stack

- **Frontend**: React Native with Expo
- **Database**: NeonDB with Drizzle ORM
- **CMS**: Sanity for content management
- **Monitoring**: Sentry for error tracking
- **Animations**: GSAP and React Native Reanimated
- **Validation**: Zod for type-safe validation
- **TypeScript**: Full type safety

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd volyx-auction-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy `.env.example` to `.env` and fill in your credentials:
   ```env
   EXPO_PUBLIC_DATABASE_URL=your_neon_database_url
   EXPO_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
   EXPO_PUBLIC_SANITY_DATASET=production
   EXPO_PUBLIC_SANITY_TOKEN=your_sanity_token
   EXPO_PUBLIC_SENTRY_DSN=your_sentry_dsn
   ```

4. **Database Setup**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🏗 Sanity CMS Setup

1. **Create a Sanity project**
   ```bash
   npm create sanity@latest
   ```

2. **Configure schemas**
   Use the schemas provided in `sanity/schema.ts`

3. **Deploy Sanity Studio**
   ```bash
   cd sanity-studio
   npm run deploy
   ```

## 🔐 Admin Access

To access admin features, log in with:
- **Email**: admin@example.com
- **Password**: Any password (demo mode)

## 🎯 Key Features Explained

### Rate Limiting
- **Default**: 100 requests per 15 minutes
- **Bidding**: 10 bids per minute
- **Authentication**: 5 attempts per 15 minutes

### Error Handling
- **API Errors**: Structured error responses with codes
- **UI Errors**: User-friendly error messages
- **Error Boundaries**: Graceful error recovery
- **Sentry Integration**: Automatic error reporting

### Performance
- **Optimized Images**: Sanity image optimization
- **Lazy Loading**: Efficient component loading
- **Caching**: Smart data caching strategies
- **Bundle Optimization**: Minimal bundle size

## 🔔 Notifications

### Push Notifications
- **Outbid Alerts**: Instant notifications when outbid
- **Ending Soon**: Reminders for auctions ending
- **Won Items**: Congratulations for successful bids
- **Connects Earned**: Updates on earned currency

### Setup
1. Configure Firebase for push notifications
2. Add your FCM server key to environment variables
3. Test notifications in development mode

## 💰 Payments

### Connects Packages
- **Starter**: 100 Connects for $0.99
- **Popular**: 500 + 50 bonus for $4.99
- **Best Value**: 1000 + 200 bonus for $9.99
- **Premium**: 2500 + 750 bonus for $19.99

### Payment Processing
- Stripe integration for secure payments
- Server-side validation for all transactions
- Automatic connects balance updates

## 📊 Analytics

### Tracking Events
- User registration and login
- Auction views and bids
- Connects purchases and usage
- App engagement metrics

### Services Supported
- Mixpanel for detailed user analytics
- Google Analytics for web tracking
- Sentry for error and performance monitoring

## 🚀 Deployment

### Web Deployment
```bash
npm run build:web
```

### Mobile Deployment
1. **Build for iOS/Android**
   ```bash
   eas build --platform all
   ```

2. **Submit to stores**
   ```bash
   eas submit --platform all
   ```

## 📱 Platform Support

- **Web**: Full functionality with server-side rendering
- **iOS**: Native app with all features
- **Android**: Native app with all features

## 🔧 Development

### Environment Variables
Create environment files for different stages:
- `.env` - Development defaults
- `.env.staging` - Staging environment  
- `.env.production` - Production environment

### Code Structure
```
app/                 # Expo Router pages
├── (tabs)/         # Tab navigation
├── admin/          # Admin-only pages
├── auth.tsx        # Authentication
└── _layout.tsx     # Root layout

components/         # Reusable components
├── ErrorBoundary.tsx
├── LoadingSpinner.tsx
└── ...

lib/               # Core utilities
├── api.ts         # API functions
├── sanity.ts      # Sanity client
├── sentry.ts      # Error monitoring
├── config.ts      # Environment config
├── notifications.ts # Push notifications
├── analytics.ts   # Analytics tracking
└── payments.ts    # Payment processing

hooks/             # Custom hooks
├── useAuth.ts     # Authentication
├── useAuctions.ts # Auction data
└── useBidding.ts  # Bidding logic
```

### Best Practices
- **Type Safety**: Full TypeScript coverage
- **Error Handling**: Comprehensive error management
- **Performance**: Optimized for mobile and web
- **Accessibility**: WCAG compliant components
- **Security**: Rate limiting and fraud detection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review error logs in Sentry

---

Built with ❤️ using modern React Native and Expo technologies.