import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  TrendingUp, 
  Clock, 
  Trophy, 
  Eye,
  Heart,
  Gavel,
  Award,
  Target,
  Activity
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CountdownTimer from '@/components/CountdownTimer';

const { width } = Dimensions.get('window');

// Demo user bidding data
const myBids = [
  {
    id: '1',
    title: 'Vintage Rolex Submariner',
    image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800',
    myBid: 15750,
    currentBid: 16200,
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    status: 'outbid',
    bidCount: 47,
    isWinning: false,
  },
  {
    id: '2',
    title: 'Limited Edition Hermès Birkin',
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800',
    myBid: 28900,
    currentBid: 28900,
    endTime: new Date(Date.now() + 45 * 60 * 1000),
    status: 'winning',
    bidCount: 89,
    isWinning: true,
  },
  {
    id: '3',
    title: 'Vintage Gibson Les Paul',
    image: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=800',
    myBid: 12500,
    currentBid: 12500,
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
    status: 'winning',
    bidCount: 78,
    isWinning: true,
  },
];

const wonItems = [
  {
    id: '4',
    title: 'Leica M6 Camera',
    image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
    winningBid: 3250,
    wonAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'won',
  },
  {
    id: '5',
    title: 'Supreme Box Logo Hoodie',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
    winningBid: 1850,
    wonAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: 'won',
  },
];

const watchlist = [
  {
    id: '6',
    title: 'Rare Pokémon Card Collection',
    image: 'https://images.pexels.com/photos/1337247/pexels-photo-1337247.jpeg?auto=compress&cs=tinysrgb&w=800',
    currentBid: 8750,
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
    bidCount: 156,
  },
  {
    id: '7',
    title: 'Vintage Omega Speedmaster',
    image: 'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=800',
    currentBid: 6750,
    endTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
    bidCount: 67,
  },
];

export default function AuctionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'active' | 'won' | 'watching'>('active');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'winning': return '#16A34A';
      case 'outbid': return '#EF4444';
      case 'won': return '#0EA5E9';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'winning': return Trophy;
      case 'outbid': return TrendingUp;
      case 'won': return Award;
      default: return Clock;
    }
  };

  const BidCard = ({ item }: { item: any }) => {
    const StatusIcon = getStatusIcon(item.status);
    
    return (
      <TouchableOpacity
        style={styles.bidCard}
        onPress={() => router.push(`/product-detail?id=${item.id}`)}
        activeOpacity={0.9}
      >
        <View style={styles.bidImageContainer}>
          <Image source={{ uri: item.image }} style={styles.bidImage} />
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <StatusIcon size={12} color="#FFFFFF" />
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>
        
        <View style={styles.bidContent}>
          <Text style={styles.bidTitle} numberOfLines={2}>
            {item.title}
          </Text>
          
          <View style={styles.bidInfo}>
            <View style={styles.bidRow}>
              <Text style={styles.bidLabel}>My Bid</Text>
              <Text style={styles.myBidAmount}>
                {item.myBid.toLocaleString()} Connects
              </Text>
            </View>
            
            <View style={styles.bidRow}>
              <Text style={styles.bidLabel}>Current Bid</Text>
              <Text style={[
                styles.currentBidAmount,
                { color: item.isWinning ? '#16A34A' : '#EF4444' }
              ]}>
                {item.currentBid.toLocaleString()} Connects
              </Text>
            </View>
          </View>
          
          <View style={styles.bidFooter}>
            <View style={styles.bidStats}>
              <Gavel size={12} color="#6B7280" />
              <Text style={styles.bidStatsText}>{item.bidCount} bids</Text>
            </View>
            <CountdownTimer endTime={item.endTime} compact />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const WonCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.wonCard}
      onPress={() => router.push(`/product-detail?id=${item.id}`)}
      activeOpacity={0.9}
    >
      <View style={styles.wonImageContainer}>
        <Image source={{ uri: item.image }} style={styles.wonImage} />
        <LinearGradient
          colors={['#0EA5E9', '#0284C7']}
          style={styles.wonBadge}
        >
          <Trophy size={12} color="#FFFFFF" />
          <Text style={styles.wonText}>WON</Text>
        </LinearGradient>
      </View>
      
      <View style={styles.wonContent}>
        <Text style={styles.wonTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.winningBid}>
          Won for {item.winningBid.toLocaleString()} Connects
        </Text>
        <Text style={styles.wonDate}>
          {item.wonAt.toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const WatchCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.watchCard}
      onPress={() => router.push(`/product-detail?id=${item.id}`)}
      activeOpacity={0.9}
    >
      <View style={styles.watchImageContainer}>
        <Image source={{ uri: item.image }} style={styles.watchImage} />
        <TouchableOpacity style={styles.favoriteButton}>
          <Heart size={14} color="#FF3B30" fill="#FF3B30" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.watchContent}>
        <Text style={styles.watchTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.watchBid}>
          {item.currentBid.toLocaleString()} Connects
        </Text>
        <View style={styles.watchFooter}>
          <View style={styles.watchStats}>
            <Eye size={12} color="#6B7280" />
            <Text style={styles.watchStatsText}>{item.bidCount} bids</Text>
          </View>
          <CountdownTimer endTime={item.endTime} compact />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'active':
        return (
          <View style={styles.content}>
            {myBids.map((item) => (
              <BidCard key={item.id} item={item} />
            ))}
          </View>
        );
      case 'won':
        return (
          <View style={styles.wonGrid}>
            {wonItems.map((item) => (
              <WonCard key={item.id} item={item} />
            ))}
          </View>
        );
      case 'watching':
        return (
          <View style={styles.watchGrid}>
            {watchlist.map((item) => (
              <WatchCard key={item.id} item={item} />
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Auctions</Text>
        <Text style={styles.headerSubtitle}>Track your bidding activity</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <LinearGradient
          colors={['#16A34A', '#15803D']}
          style={styles.statCard}
        >
          <Trophy size={20} color="#FFFFFF" />
          <Text style={styles.statNumber}>{wonItems.length}</Text>
          <Text style={styles.statLabel}>Won</Text>
        </LinearGradient>
        
        <LinearGradient
          colors={['#FF7F00', '#FF6B35']}
          style={styles.statCard}
        >
          <Activity size={20} color="#FFFFFF" />
          <Text style={styles.statNumber}>{myBids.length}</Text>
          <Text style={styles.statLabel}>Active Bids</Text>
        </LinearGradient>
        
        <LinearGradient
          colors={['#0EA5E9', '#0284C7']}
          style={styles.statCard}
        >
          <Eye size={20} color="#FFFFFF" />
          <Text style={styles.statNumber}>{watchlist.length}</Text>
          <Text style={styles.statLabel}>Watching</Text>
        </LinearGradient>
        
        <LinearGradient
          colors={['#8B5CF6', '#7C3AED']}
          style={styles.statCard}
        >
          <Target size={20} color="#FFFFFF" />
          <Text style={styles.statNumber}>87%</Text>
          <Text style={styles.statLabel}>Win Rate</Text>
        </LinearGradient>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {[
          { key: 'active', label: 'Active Bids', count: myBids.length },
          { key: 'won', label: 'Won Items', count: wonItems.length },
          { key: 'watching', label: 'Watching', count: watchlist.length },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
            <View style={[
              styles.tabBadge,
              activeTab === tab.key && styles.activeTabBadge,
            ]}>
              <Text style={[
                styles.tabBadgeText,
                activeTab === tab.key && styles.activeTabBadgeText,
              ]}>
                {tab.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderContent()}
        <View style={styles.bottomPadding} />
      </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1A2B42',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
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
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FF7F00',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginRight: 6,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  tabBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 20,
    alignItems: 'center',
  },
  activeTabBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#6B7280',
  },
  activeTabBadgeText: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  bidCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  bidImageContainer: {
    height: 120,
    position: 'relative',
  },
  bidImage: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  bidContent: {
    padding: 16,
  },
  bidTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1A2B42',
    marginBottom: 12,
    lineHeight: 22,
  },
  bidInfo: {
    marginBottom: 12,
  },
  bidRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  bidLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  myBidAmount: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1A2B42',
  },
  currentBidAmount: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  bidFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bidStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bidStatsText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 4,
  },
  wonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  wonCard: {
    width: (width - 52) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  wonImageContainer: {
    height: 100,
    position: 'relative',
  },
  wonImage: {
    width: '100%',
    height: '100%',
  },
  wonBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  wonText: {
    fontSize: 9,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 3,
  },
  wonContent: {
    padding: 12,
  },
  wonTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1A2B42',
    marginBottom: 6,
    lineHeight: 18,
  },
  winningBid: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#16A34A',
    marginBottom: 4,
  },
  wonDate: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  watchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  watchCard: {
    width: (width - 52) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  watchImageContainer: {
    height: 100,
    position: 'relative',
  },
  watchImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  watchContent: {
    padding: 12,
  },
  watchTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1A2B42',
    marginBottom: 6,
    lineHeight: 18,
  },
  watchBid: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FF7F00',
    marginBottom: 8,
  },
  watchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  watchStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  watchStatsText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 4,
  },
  bottomPadding: {
    height: 120,
  },
});