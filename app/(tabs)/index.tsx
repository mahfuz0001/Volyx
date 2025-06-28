import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Image,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Bell,
  TrendingUp,
  Plus,
  Star,
  Clock,
  Zap,
  Gift,
  Crown,
  Sparkles,
  Timer,
  Eye,
  Heart,
  Users,
  Award,
  Flame,
  TriangleAlert as AlertTriangle,
  RefreshCw,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import ConnectsBalance from '@/components/ConnectsBalance';
import CountdownTimer from '@/components/CountdownTimer';
import { useAuth } from '@/hooks/useAuth';
import { auctionAPI } from '@/lib/api';
import { useSocket } from '@/lib/socket';
import { useAdMob, AdMobBanner } from '@/lib/admob';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { showInterstitial } = useAdMob();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteItems, setFavoriteItems] = useState<string[]>(['2', '4']);
  const scrollY = useSharedValue(0);
  
  const [featuredAuctions, setFeaturedAuctions] = useState([]);
  const [hotAuctions, setHotAuctions] = useState([]);
  const [endingSoon, setEndingSoon] = useState([]);
  
  // Set up socket connection for real-time updates
  const { on } = useSocket(user?.id);
  
  useEffect(() => {
    fetchAuctions();
    
    // Show interstitial ad with 20% chance when opening the home screen
    if (Math.random() < 0.2) {
      showInterstitial();
    }
    
    // Set up socket listeners for real-time updates
    const unsubscribeAuctionUpdate = on('auction_update', handleAuctionUpdate);
    const unsubscribeNewBid = on('new_bid', handleNewBid);
    
    return () => {
      unsubscribeAuctionUpdate();
      unsubscribeNewBid();
    };
  }, []);
  
  const handleAuctionUpdate = (data) => {
    // Update auction data in real-time
    updateAuctionData(data);
  };
  
  const handleNewBid = (data) => {
    // Update auction data when a new bid is placed
    updateAuctionData(data.auction);
  };
  
  const updateAuctionData = (updatedAuction) => {
    // Update featured auctions
    setFeaturedAuctions(prev => 
      prev.map(auction => 
        auction.id === updatedAuction.id ? { ...auction, ...updatedAuction } : auction
      )
    );
    
    // Update hot auctions
    setHotAuctions(prev => 
      prev.map(auction => 
        auction.id === updatedAuction.id ? { ...auction, ...updatedAuction } : auction
      )
    );
    
    // Update ending soon auctions
    setEndingSoon(prev => 
      prev.map(auction => 
        auction.id === updatedAuction.id ? { ...auction, ...updatedAuction } : auction
      )
    );
  };

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch auctions from API
      const [featuredData, hotData, endingSoonData] = await Promise.all([
        auctionAPI.getFeatured(),
        auctionAPI.getHot(),
        auctionAPI.getEndingSoon(),
      ]);
      
      setFeaturedAuctions(featuredData);
      setHotAuctions(hotData);
      setEndingSoon(endingSoonData);
    } catch (error) {
      console.error('Failed to fetch auctions:', error);
      setError('Failed to load auctions. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 100], [1, 0.9]);
    const translateY = interpolate(scrollY.value, [0, 100], [0, -10]);

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const handleSeeAllPress = () => {
    router.push('/(tabs)/auctions');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAuctions();
  };

  const toggleFavorite = (itemId: string) => {
    setFavoriteItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleProductPress = (itemId: string) => {
    router.push(`/product-detail?id=${itemId}`);
  };

  const handleConnectsPress = () => {
    router.push('/get-connects');
  };

  const FeaturedCard = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      style={[styles.featuredCard, { marginLeft: index === 0 ? 20 : 0 }]}
      onPress={() => handleProductPress(item.id)}
      activeOpacity={0.9}
    >
      <View style={styles.featuredImageContainer}>
        <Image source={{ uri: item.image }} style={styles.featuredImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.featuredGradient}
        />

        <LinearGradient
          colors={getRarityGradient(item.rarity)}
          style={styles.rarityBadge}
        >
          <Crown size={12} color="#FFFFFF" />
          <Text style={styles.rarityText}>{item.rarity.toUpperCase()}</Text>
        </LinearGradient>

        {item.isHot && (
          <View style={styles.hotBadge}>
            <Flame size={12} color="#FFFFFF" />
            <Text style={styles.hotText}>HOT</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <Heart
            size={16}
            color={favoriteItems.includes(item.id) ? '#FF3B30' : '#FFFFFF'}
            fill={favoriteItems.includes(item.id) ? '#FF3B30' : 'transparent'}
          />
        </TouchableOpacity>

        <View style={styles.featuredInfo}>
          <Text style={styles.featuredTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.featuredStats}>
            <View style={styles.statItem}>
              <Users size={12} color="#FFFFFF" />
              <Text style={styles.statText}>{item.bidCount || 0} bids</Text>
            </View>
            <View style={styles.statItem}>
              <Eye size={12} color="#FFFFFF" />
              <Text style={styles.statText}>{item.watchers || 0}</Text>
            </View>
          </View>
          <View style={styles.bidInfo}>
            <Text style={styles.currentBidLabel}>Current Bid</Text>
            <Text style={styles.currentBidAmount}>
              {item.currentBid.toLocaleString()} Connects
            </Text>
          </View>
          <CountdownTimer endTime={new Date(item.endTime)} compact style={styles.timer} />
        </View>
      </View>
    </TouchableOpacity>
  );

  // Modified HotAuctionCard to use a consistent size
  const CompactAuctionCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.compactCard}
      onPress={() => handleProductPress(item.id)}
      activeOpacity={0.9}
    >
      <View style={styles.compactImageContainer}>
        <Image source={{ uri: item.image }} style={styles.compactImage} />
        <LinearGradient
          colors={getRarityGradient(item.rarity)}
          style={styles.compactRarityBadge}
        >
          <Text style={styles.compactRarityText}>
            {item.rarity.charAt(0).toUpperCase()}
          </Text>
        </LinearGradient>

        <TouchableOpacity
          style={styles.compactFavoriteButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <Heart
            size={14}
            color={favoriteItems.includes(item.id) ? '#FF3B30' : '#FFFFFF'}
            fill={favoriteItems.includes(item.id) ? '#FF3B30' : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.compactCardContent}>
        <Text style={styles.compactTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.compactBidInfo}>
          <Text style={styles.compactBidAmount}>
            {item.currentBid.toLocaleString()}{' '}
            <Text style={styles.compactBidLabel}>Connects</Text>
          </Text>
        </View>
        <View style={styles.compactStats}>
          <View style={styles.compactStatItem}>
            <TrendingUp size={10} color="#FF7F00" />
            <Text style={styles.compactStatText}>{item.bidCount || 0} bids</Text>
          </View>
          <CountdownTimer endTime={new Date(item.endTime)} compact />
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const getRarityGradient = (rarity: string): [string, string] => {
    switch (rarity) {
      case 'legendary':
        return ['#FFD700', '#FFA000'];
      case 'epic':
        return ['#9D4EDD', '#7B2CBF'];
      case 'rare':
        return ['#2196F3', '#1976D2'];
      case 'uncommon':
        return ['#4CAF50', '#388E3C'];
      default:
        return ['#9E9E9E', '#757575'];
    }
  };

  if (loading && !featuredAuctions.length && !hotAuctions.length && !endingSoon.length) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />
        
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <LinearGradient
                colors={['#FF7F00', '#FF6B35']}
                style={styles.logoContainer}
              >
                <Text style={styles.logo}>V</Text>
              </LinearGradient>
            </View>

            <View style={styles.headerRight}>
              <ConnectsBalance balance={user?.connectsBalance || 0} onPress={handleConnectsPress} />
              <TouchableOpacity style={styles.notificationButton}>
                <Bell size={20} color="#1A2B42" />
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationCount}>3</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF7F00" />
          <Text style={styles.loadingText}>Loading auctions...</Text>
        </View>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />
        
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <LinearGradient
                colors={['#FF7F00', '#FF6B35']}
                style={styles.logoContainer}
              >
                <Text style={styles.logo}>V</Text>
              </LinearGradient>
            </View>

            <View style={styles.headerRight}>
              <ConnectsBalance balance={user?.connectsBalance || 0} onPress={handleConnectsPress} />
              <TouchableOpacity style={styles.notificationButton}>
                <Bell size={20} color="#1A2B42" />
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationCount}>3</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
        
        <View style={styles.errorContainer}>
          <AlertTriangle size={64} color="#EF4444" />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchAuctions}>
            <RefreshCw size={16} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <LinearGradient
              colors={['#FF7F00', '#FF6B35']}
              style={styles.logoContainer}
            >
              <Text style={styles.logo}>V</Text>
            </LinearGradient>
          </View>

          <View style={styles.headerRight}>
            <ConnectsBalance balance={user?.connectsBalance || 0} onPress={handleConnectsPress} />
            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={20} color="#1A2B42" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={(event) => {
          scrollY.value = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        {/* Banner Ad */}
        {Platform.OS !== 'web' && (
          <View style={styles.bannerAdContainer}>
            <AdMobBanner
              bannerSize="smartBannerPortrait"
              servePersonalizedAds={true}
              onDidFailToReceiveAdWithError={(error) => console.error(error)}
            />
          </View>
        )}
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <LinearGradient
                colors={['#FFD700', '#FFA000']}
                style={styles.sectionIcon}
              >
                <Sparkles size={16} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.sectionTitle}>Curator's Choice</Text>
            </View>
            <TouchableOpacity style={styles.seeAllButton} onPress={handleSeeAllPress}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {featuredAuctions.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredScroll}
            >
              {featuredAuctions.map((item, index) => (
                <FeaturedCard key={item.id} item={item} index={index} />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No featured auctions available</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <LinearGradient
                colors={['#FF3B30', '#FF6B35']}
                style={styles.sectionIcon}
              >
                <Timer size={16} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.sectionTitle}>Ending Soon!</Text>
            </View>
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>URGENT</Text>
            </View>
          </View>

          {endingSoon.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.compactHorizontalScroll}
            >
              {endingSoon.map((item) => (
                <CompactAuctionCard key={item.id} item={item} />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No auctions ending soon</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <LinearGradient
                colors={['#FF7F00', '#FF6B35']}
                style={styles.sectionIcon}
              >
                <TrendingUp size={16} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.sectionTitle}>Trending Now</Text>
            </View>
          </View>

          {hotAuctions.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.compactHorizontalScroll}
            >
              {hotAuctions.map((item) => (
                <CompactAuctionCard key={item.id} item={item} />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No trending auctions available</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <LinearGradient
            colors={['#1A2B42', '#2D4A6B']}
            style={styles.connectsCTA}
          >
            <View style={styles.ctaContent}>
              <Gift size={32} color="#FF7F00" />
              <Text style={styles.ctaTitle}>Boost Your Bidding Power!</Text>
              <Text style={styles.ctaSubtitle}>
                Get more Connects to bid on exclusive collectibles
              </Text>
              <TouchableOpacity
                style={styles.ctaButton}
                onPress={handleConnectsPress}
              >
                <LinearGradient
                  colors={['#FF7F00', '#FF6B35']}
                  style={styles.ctaButtonGradient}
                >
                  <Plus size={16} color="#FFFFFF" />
                  <Text style={styles.ctaButtonText}>Get Connects</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
        
        {/* Bottom Banner Ad */}
        {Platform.OS !== 'web' && (
          <View style={styles.bannerAdContainer}>
            <AdMobBanner
              bannerSize="smartBannerPortrait"
              servePersonalizedAds={true}
              onDidFailToReceiveAdWithError={(error) => console.error(error)}
            />
          </View>
        )}

        <View style={styles.bottomPadding} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logo: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  welcomeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  brandText: {
    fontSize: 19,
    fontFamily: 'Inter-Bold',
    color: '#1A2B42',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    marginLeft: 16,
    padding: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 18,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#1A2B42',
  },
  seeAllButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FF7F00',
  },
  urgentBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  urgentText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  featuredScroll: {
    // paddingHorizontal: 20,
  },
  featuredCard: {
    width: width * 0.78,
    height: 330,
    marginRight: 18,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 25,
    elevation: 12,
  },
  featuredImageContainer: {
    flex: 1,
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '65%',
  },
  rarityBadge: {
    position: 'absolute',
    top: 15,
    left: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  rarityText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 5,
  },
  hotBadge: {
    position: 'absolute',
    top: 15,
    right: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  hotText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 5,
  },
  favoriteButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  featuredTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  featuredStats: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#E0E0E0',
    marginLeft: 5,
  },
  bidInfo: {
    marginBottom: 10,
  },
  currentBidLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  currentBidAmount: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  timer: {
    alignSelf: 'flex-start',
    marginTop: 5,
  },

  // New styles for the CompactAuctionCard
  compactCard: {
    width: (width - 20) / 2, // Half width minus total padding for two items per row
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 20,
    marginHorizontal: 6, // Added margin for grid spacing
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  compactImageContainer: {
    height: 140, // Retain image height
    position: 'relative',
  },
  compactImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  compactRarityBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactRarityText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  compactFavoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactCardContent: {
    padding: 15,
  },
  compactTitle: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#1A2B42',
    marginBottom: 10,
    lineHeight: 20,
  },
  compactBidInfo: {
    marginBottom: 10,
  },
  compactBidAmount: {
    fontSize: 17,
    fontFamily: 'Inter-Bold',
    color: '#FF7F00',
  },
  compactBidLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  compactStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactStatText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 5,
  },

  compactHorizontalScroll: {
    paddingHorizontal: 10, // Adjust padding for compact horizontal scroll
  },
  compactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', // Align items to the start for left-to-right filling
    paddingHorizontal: 10, // Adjust padding for grid
  },

  connectsCTA: {
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 15,
  },
  ctaContent: {
    padding: 28,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 25,
    textAlign: 'center',
    lineHeight: 22,
  },
  ctaButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  ctaButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  ctaButtonText: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  bannerAdContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  bottomPadding: {
    height: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1A2B42',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e40af',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  emptyStateContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
});