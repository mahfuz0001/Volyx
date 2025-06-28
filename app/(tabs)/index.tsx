import React, { useState } from 'react';
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
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import ConnectsBalance from '@/components/ConnectsBalance';
import CountdownTimer from '@/components/CountdownTimer';

const { width } = Dimensions.get('window');

const featuredAuctions = [
  {
    id: '1',
    title: 'Vintage Rolex Submariner',
    description: 'Rare 1960s Rolex Submariner in pristine condition',
    image:
      'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800',
    currentBid: 15750,
    estimatedValue: { min: 18000, max: 25000 },
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    rarity: 'legendary',
    isHot: true,
    isFeatured: true,
    bidCount: 47,
    watchers: 234,
  },
  {
    id: '2',
    title: 'Limited Edition Hermès Birkin',
    description: 'Exclusive crocodile leather Birkin bag with gold hardware',
    image:
      'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800',
    currentBid: 28900,
    estimatedValue: { min: 35000, max: 45000 },
    endTime: new Date(Date.now() + 45 * 60 * 1000),
    rarity: 'legendary',
    isHot: true,
    isFeatured: true,
    bidCount: 89,
    watchers: 567,
  },
  {
    id: '3',
    title: 'Rare Pokémon Card Collection',
    description: 'First edition holographic Charizard and complete base set',
    image:
      'https://images.pexels.com/photos/1337247/pexels-photo-1337247.jpeg?auto=compress&cs=tinysrgb&w=800',
    currentBid: 8750,
    estimatedValue: { min: 12000, max: 18000 },
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
    rarity: 'epic',
    isHot: false,
    isFeatured: true,
    bidCount: 156,
    watchers: 892,
  },
];

const hotAuctions = [
  {
    id: '4',
    title: 'Vintage Gibson Les Paul',
    description: '1959 Gibson Les Paul Standard in sunburst finish',
    image:
      'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=800',
    currentBid: 12500,
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
    rarity: 'epic',
    isHot: true,
    bidCount: 78,
  },
  {
    id: '5',
    title: 'Leica M6 Camera',
    description: 'Professional 35mm rangefinder camera with original lens',
    image:
      'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
    currentBid: 3250,
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
    rarity: 'rare',
    isHot: true,
    bidCount: 34,
  },
  {
    id: '6',
    title: 'Supreme Box Logo Hoodie',
    description: 'Deadstock Supreme x Louis Vuitton collaboration hoodie',
    image:
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
    currentBid: 1850,
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    rarity: 'rare',
    isHot: true,
    bidCount: 92,
  },
  {
    id: '7',
    title: 'Vintage Omega Speedmaster',
    description: 'Moon landing commemorative edition with original box',
    image:
      'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=800',
    currentBid: 6750,
    endTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
    rarity: 'epic',
    isHot: true,
    bidCount: 67,
  },
];

const endingSoon = [
  {
    id: '8',
    title: 'Rare Wine Collection',
    description: 'Vintage Bordeaux collection from prestigious vineyard',
    image:
      'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=800',
    currentBid: 4500,
    endTime: new Date(Date.now() + 15 * 60 * 1000),
    rarity: 'rare',
    bidCount: 23,
  },
  {
    id: '9',
    title: 'Signed Basketball Jersey',
    description: 'Michael Jordan signed Chicago Bulls jersey with COA',
    image:
      'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=800',
    currentBid: 2750,
    endTime: new Date(Date.now() + 8 * 60 * 1000),
    rarity: 'epic',
    bidCount: 45,
  },
];

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

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [favoriteItems, setFavoriteItems] = useState<string[]>(['2', '4']);
  const scrollY = useSharedValue(0);

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
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
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
              <Text style={styles.statText}>{item.bidCount} bids</Text>
            </View>
            <View style={styles.statItem}>
              <Eye size={12} color="#FFFFFF" />
              <Text style={styles.statText}>{item.watchers}</Text>
            </View>
          </View>
          <View style={styles.bidInfo}>
            <Text style={styles.currentBidLabel}>Current Bid</Text>
            <Text style={styles.currentBidAmount}>
              {item.currentBid.toLocaleString()} Connects
            </Text>
          </View>
          <CountdownTimer endTime={item.endTime} compact style={styles.timer} />
        </View>
      </View>
    </TouchableOpacity>
  );

  // Modified HotAuctionCard to use a consistent size
  const CompactAuctionCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.compactCard} // Use the new compactCard style
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
            <Text style={styles.compactStatText}>{item.bidCount} bids</Text>
          </View>
          <CountdownTimer endTime={item.endTime} compact />
        </View>
      </View>
    </TouchableOpacity>
  );

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
            <ConnectsBalance balance={2750} onPress={handleConnectsPress} />
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
            <TouchableOpacity style={styles.seeAllButton}>
              <Text
                style={styles.seeAllText}
                onAccessibilityTap={handleSeeAllPress}
              >
                See All
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredScroll}
          >
            {featuredAuctions.map((item, index) => (
              <FeaturedCard key={item.id} item={item} index={index} />
            ))}
          </ScrollView>
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

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.compactHorizontalScroll} // New style for horizontal compact cards
          >
            {endingSoon.map((item) => (
              <CompactAuctionCard key={item.id} item={item} />
            ))}
          </ScrollView>
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

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.compactHorizontalScroll} // New style for horizontal compact cards
          >
            {hotAuctions.map((item) => (
              <CompactAuctionCard key={item.id} item={item} />
            ))}
          </ScrollView>
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
  bottomPadding: {
    height: 120,
  },
});
