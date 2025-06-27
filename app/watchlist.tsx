import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Heart,
  Clock,
  TrendingUp,
  Eye,
  Filter,
  SortAsc,
  Trash2,
  Plus,
  Search,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedCard from '@/components/AnimatedCard';
import CountdownTimer from '@/components/CountdownTimer';

interface WatchlistItem {
  id: string;
  title: string;
  description: string;
  image: string;
  currentBid: number;
  minimumBid: number;
  endTime: Date;
  category: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  isHot: boolean;
  bidCount: number;
  watchers: number;
  addedAt: Date;
  priceAlert?: number;
}

const mockWatchlist: WatchlistItem[] = [
  {
    id: '1',
    title: 'Vintage Omega Speedmaster',
    description: 'Moon landing commemorative edition with original box',
    image: 'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=800',
    currentBid: 6750,
    minimumBid: 5000,
    endTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
    category: 'Watches',
    rarity: 'epic',
    isHot: true,
    bidCount: 67,
    watchers: 234,
    addedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    priceAlert: 7000,
  },
  {
    id: '2',
    title: 'Rare Pokémon Card Collection',
    description: 'First edition holographic Charizard and complete base set',
    image: 'https://images.pexels.com/photos/1337247/pexels-photo-1337247.jpeg?auto=compress&cs=tinysrgb&w=800',
    currentBid: 8750,
    minimumBid: 5000,
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
    category: 'Collectibles',
    rarity: 'epic',
    isHot: false,
    bidCount: 156,
    watchers: 892,
    addedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    title: 'Vintage Gibson Les Paul',
    description: '1959 Gibson Les Paul Standard in sunburst finish',
    image: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=800',
    currentBid: 12500,
    minimumBid: 10000,
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
    category: 'Music',
    rarity: 'epic',
    isHot: true,
    bidCount: 78,
    watchers: 445,
    addedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    priceAlert: 15000,
  },
  {
    id: '4',
    title: 'Leica M6 Camera',
    description: 'Professional 35mm rangefinder camera with original lens',
    image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
    currentBid: 3250,
    minimumBid: 2500,
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
    category: 'Photography',
    rarity: 'rare',
    isHot: false,
    bidCount: 34,
    watchers: 167,
    addedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
];

export default function WatchlistScreen() {
  const router = useRouter();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(mockWatchlist);
  const [sortBy, setSortBy] = useState<'endTime' | 'currentBid' | 'addedAt'>('endTime');
  const [filterBy, setFilterBy] = useState<string | null>(null);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '#FFD700';
      case 'epic': return '#9D4EDD';
      case 'rare': return '#2196F3';
      case 'uncommon': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  const removeFromWatchlist = (itemId: string) => {
    Alert.alert(
      'Remove from Watchlist',
      'Are you sure you want to remove this item from your watchlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setWatchlist(prev => prev.filter(item => item.id !== itemId));
          },
        },
      ]
    );
  };

  const setPriceAlert = (itemId: string, alertPrice: number) => {
    setWatchlist(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, priceAlert: alertPrice } : item
      )
    );
    Alert.alert('Price Alert Set', `You'll be notified when the bid reaches ${alertPrice.toLocaleString()} Connects`);
  };

  const sortedWatchlist = [...watchlist].sort((a, b) => {
    switch (sortBy) {
      case 'endTime':
        return a.endTime.getTime() - b.endTime.getTime();
      case 'currentBid':
        return b.currentBid - a.currentBid;
      case 'addedAt':
        return b.addedAt.getTime() - a.addedAt.getTime();
      default:
        return 0;
    }
  });

  const filteredWatchlist = filterBy
    ? sortedWatchlist.filter(item => item.category === filterBy)
    : sortedWatchlist;

  const categories = [...new Set(watchlist.map(item => item.category))];

  const WatchlistCard = ({ item }: { item: WatchlistItem }) => (
    <AnimatedCard style={styles.watchlistCard}>
      <TouchableOpacity
        onPress={() => router.push(`/product-detail?id=${item.id}`)}
        activeOpacity={0.9}
      >
        <View style={styles.cardImageContainer}>
          <Image source={{ uri: item.image }} style={styles.cardImage} />
          
          {/* Rarity Badge */}
          <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(item.rarity) }]}>
            <Text style={styles.rarityText}>{item.rarity.charAt(0).toUpperCase()}</Text>
          </View>
          
          {/* Hot Badge */}
          {item.isHot && (
            <View style={styles.hotBadge}>
              <TrendingUp size={12} color="#FFFFFF" />
              <Text style={styles.hotText}>HOT</Text>
            </View>
          )}
          
          {/* Remove Button */}
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeFromWatchlist(item.id)}
          >
            <Trash2 size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.cardCategory}>{item.category}</Text>

          <View style={styles.bidInfo}>
            <Text style={styles.bidLabel}>Current Bid</Text>
            <Text style={styles.bidAmount}>
              {item.currentBid.toLocaleString()} Connects
            </Text>
          </View>

          {item.priceAlert && (
            <View style={styles.priceAlert}>
              <Text style={styles.priceAlertText}>
                Alert at {item.priceAlert.toLocaleString()} Connects
              </Text>
            </View>
          )}

          <View style={styles.cardStats}>
            <View style={styles.statItem}>
              <TrendingUp size={12} color="#FF7F00" />
              <Text style={styles.statText}>{item.bidCount} bids</Text>
            </View>
            <View style={styles.statItem}>
              <Eye size={12} color="#6B7280" />
              <Text style={styles.statText}>{item.watchers} watching</Text>
            </View>
          </View>

          <CountdownTimer endTime={item.endTime} compact style={styles.timer} />
        </View>
      </TouchableOpacity>
    </AnimatedCard>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#1A2B42" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Watchlist</Text>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => router.push('/(tabs)/search')}
        >
          <Search size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <LinearGradient
          colors={['#FF7F00', '#FF6B35']}
          style={styles.statCard}
        >
          <Heart size={20} color="#FFFFFF" fill="#FFFFFF" />
          <Text style={styles.statNumber}>{watchlist.length}</Text>
          <Text style={styles.statLabel}>Items Watching</Text>
        </LinearGradient>
        
        <LinearGradient
          colors={['#2196F3', '#1976D2']}
          style={styles.statCard}
        >
          <Clock size={20} color="#FFFFFF" />
          <Text style={styles.statNumber}>
            {watchlist.filter(item => item.endTime.getTime() - Date.now() < 60 * 60 * 1000).length}
          </Text>
          <Text style={styles.statLabel}>Ending Soon</Text>
        </LinearGradient>
        
        <LinearGradient
          colors={['#16A34A', '#15803D']}
          style={styles.statCard}
        >
          <TrendingUp size={20} color="#FFFFFF" />
          <Text style={styles.statNumber}>
            {watchlist.filter(item => item.isHot).length}
          </Text>
          <Text style={styles.statLabel}>Hot Items</Text>
        </LinearGradient>
      </View>

      {/* Filters and Sort */}
      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              !filterBy && styles.filterChipActive
            ]}
            onPress={() => setFilterBy(null)}
          >
            <Text style={[
              styles.filterChipText,
              !filterBy && styles.filterChipTextActive
            ]}>
              All
            </Text>
          </TouchableOpacity>
          
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterChip,
                filterBy === category && styles.filterChipActive
              ]}
              onPress={() => setFilterBy(filterBy === category ? null : category)}
            >
              <Text style={[
                styles.filterChipText,
                filterBy === category && styles.filterChipTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <TouchableOpacity style={styles.sortButton}>
          <SortAsc size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Watchlist */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredWatchlist.length > 0 ? (
          <View style={styles.watchlistGrid}>
            {filteredWatchlist.map((item) => (
              <WatchlistCard key={item.id} item={item} />
            ))}
          </View>
        ) : (
          <AnimatedCard style={styles.emptyState}>
            <Heart size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Your watchlist is empty</Text>
            <Text style={styles.emptySubtitle}>
              Start adding items to your watchlist by tapping the heart icon on any auction
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => router.push('/(tabs)')}
            >
              <LinearGradient
                colors={['#FF7F00', '#FF6B35']}
                style={styles.exploreButtonGradient}
              >
                <Plus size={16} color="#FFFFFF" />
                <Text style={styles.exploreButtonText}>Explore Auctions</Text>
              </LinearGradient>
            </TouchableOpacity>
          </AnimatedCard>
        )}
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1A2B42',
  },
  searchButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filtersScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
  },
  filterChipActive: {
    backgroundColor: '#FF7F00',
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  sortButton: {
    padding: 12,
    marginRight: 8,
  },
  content: {
    flex: 1,
  },
  watchlistGrid: {
    padding: 20,
    gap: 16,
  },
  watchlistCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  cardImageContainer: {
    height: 200,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  rarityBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rarityText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  hotBadge: {
    position: 'absolute',
    top: 12,
    right: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  hotText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1A2B42',
    marginBottom: 4,
    lineHeight: 22,
  },
  cardCategory: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  bidInfo: {
    marginBottom: 8,
  },
  bidLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  bidAmount: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FF7F00',
    marginBottom: 8,
  },
  priceAlert: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  priceAlertText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#92400E',
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 4,
  },
  timer: {
    alignSelf: 'flex-start',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1A2B42',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  exploreButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  exploreButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  exploreButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  bottomPadding: {
    height: 100,
  },
});