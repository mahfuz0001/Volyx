import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, TrendingUp, TrendingDown, Award, Clock, Calendar, ListFilter as Filter, Eye, ArrowUpRight, ArrowDownRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedCard from '@/components/AnimatedCard';

interface BidHistoryItem {
  id: string;
  auctionId: string;
  auctionTitle: string;
  auctionImage: string;
  bidAmount: number;
  bidTime: Date;
  status: 'winning' | 'outbid' | 'won' | 'lost';
  finalPrice?: number;
  isCurrentHighest: boolean;
  category: string;
}

const mockBidHistory: BidHistoryItem[] = [
  {
    id: '1',
    auctionId: '1',
    auctionTitle: 'Vintage Rolex Submariner',
    auctionImage: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800',
    bidAmount: 15750,
    bidTime: new Date(Date.now() - 30 * 60 * 1000),
    status: 'outbid',
    isCurrentHighest: false,
    category: 'Watches',
  },
  {
    id: '2',
    auctionId: '2',
    auctionTitle: 'Limited Edition Hermès Birkin',
    auctionImage: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800',
    bidAmount: 28900,
    bidTime: new Date(Date.now() - 45 * 60 * 1000),
    status: 'winning',
    isCurrentHighest: true,
    category: 'Fashion',
  },
  {
    id: '3',
    auctionId: '3',
    auctionTitle: 'Vintage Gibson Les Paul',
    auctionImage: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=800',
    bidAmount: 12500,
    bidTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'winning',
    isCurrentHighest: true,
    category: 'Music',
  },
  {
    id: '4',
    auctionId: '4',
    auctionTitle: 'Leica M6 Camera',
    auctionImage: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
    bidAmount: 3250,
    bidTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'won',
    finalPrice: 3250,
    isCurrentHighest: false,
    category: 'Photography',
  },
  {
    id: '5',
    auctionId: '5',
    auctionTitle: 'Supreme Box Logo Hoodie',
    auctionImage: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
    bidAmount: 1850,
    bidTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: 'won',
    finalPrice: 1850,
    isCurrentHighest: false,
    category: 'Fashion',
  },
  {
    id: '6',
    auctionId: '6',
    auctionTitle: 'Rare Comic Book Collection',
    auctionImage: 'https://images.pexels.com/photos/1337247/pexels-photo-1337247.jpeg?auto=compress&cs=tinysrgb&w=800',
    bidAmount: 8500,
    bidTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: 'lost',
    finalPrice: 9200,
    isCurrentHighest: false,
    category: 'Collectibles',
  },
];

export default function BidHistoryScreen() {
  const router = useRouter();
  const [bidHistory] = useState<BidHistoryItem[]>(mockBidHistory);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'winning': return '#16A34A';
      case 'outbid': return '#EF4444';
      case 'won': return '#0EA5E9';
      case 'lost': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'winning': return TrendingUp;
      case 'outbid': return TrendingDown;
      case 'won': return Award;
      case 'lost': return TrendingDown;
      default: return Clock;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'winning': return 'Winning';
      case 'outbid': return 'Outbid';
      case 'won': return 'Won';
      case 'lost': return 'Lost';
      default: return status;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredHistory = filterStatus
    ? bidHistory.filter(bid => bid.status === filterStatus)
    : bidHistory;

  const stats = {
    totalBids: bidHistory.length,
    activeBids: bidHistory.filter(bid => bid.status === 'winning' || bid.status === 'outbid').length,
    wonItems: bidHistory.filter(bid => bid.status === 'won').length,
    totalSpent: bidHistory.filter(bid => bid.status === 'won').reduce((sum, bid) => sum + (bid.finalPrice || 0), 0),
  };

  const BidCard = ({ bid }: { bid: BidHistoryItem }) => {
    const StatusIcon = getStatusIcon(bid.status);
    const statusColor = getStatusColor(bid.status);

    return (
      <AnimatedCard style={styles.bidCard}>
        <TouchableOpacity
          onPress={() => router.push(`/product-detail?id=${bid.auctionId}`)}
          activeOpacity={0.9}
        >
          <View style={styles.bidContent}>
            <View style={styles.bidImageContainer}>
              <Image source={{ uri: bid.auctionImage }} style={styles.bidImage} />
              <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                <StatusIcon size={12} color="#FFFFFF" />
              </View>
            </View>

            <View style={styles.bidDetails}>
              <Text style={styles.bidTitle} numberOfLines={2}>
                {bid.auctionTitle}
              </Text>
              <Text style={styles.bidCategory}>{bid.category}</Text>

              <View style={styles.bidAmountContainer}>
                <Text style={styles.bidAmountLabel}>Your Bid</Text>
                <View style={styles.bidAmountRow}>
                  <Text style={styles.bidAmount}>
                    {bid.bidAmount.toLocaleString()} Connects
                  </Text>
                  {bid.isCurrentHighest && (
                    <View style={styles.highestBidBadge}>
                      <ArrowUpRight size={10} color="#16A34A" />
                      <Text style={styles.highestBidText}>Highest</Text>
                    </View>
                  )}
                </View>
              </View>

              {bid.finalPrice && bid.status !== 'winning' && (
                <View style={styles.finalPriceContainer}>
                  <Text style={styles.finalPriceLabel}>
                    {bid.status === 'won' ? 'Won for' : 'Sold for'}
                  </Text>
                  <Text style={[
                    styles.finalPrice,
                    { color: bid.status === 'won' ? '#16A34A' : '#6B7280' }
                  ]}>
                    {bid.finalPrice.toLocaleString()} Connects
                  </Text>
                </View>
              )}

              <View style={styles.bidFooter}>
                <View style={styles.bidStatus}>
                  <StatusIcon size={14} color={statusColor} />
                  <Text style={[styles.statusText, { color: statusColor }]}>
                    {getStatusText(bid.status)}
                  </Text>
                </View>
                <Text style={styles.bidTime}>
                  {formatTimeAgo(bid.bidTime)}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </AnimatedCard>
    );
  };

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
        <Text style={styles.headerTitle}>Bid History</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <LinearGradient
          colors={['#FF7F00', '#FF6B35']}
          style={styles.statCard}
        >
          <TrendingUp size={20} color="#FFFFFF" />
          <Text style={styles.statNumber}>{stats.totalBids}</Text>
          <Text style={styles.statLabel}>Total Bids</Text>
        </LinearGradient>
        
        <LinearGradient
          colors={['#2196F3', '#1976D2']}
          style={styles.statCard}
        >
          <Clock size={20} color="#FFFFFF" />
          <Text style={styles.statNumber}>{stats.activeBids}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </LinearGradient>
        
        <LinearGradient
          colors={['#16A34A', '#15803D']}
          style={styles.statCard}
        >
          <Award size={20} color="#FFFFFF" />
          <Text style={styles.statNumber}>{stats.wonItems}</Text>
          <Text style={styles.statLabel}>Won</Text>
        </LinearGradient>
        
        <LinearGradient
          colors={['#7C3AED', '#6D28D9']}
          style={styles.statCard}
        >
          <Calendar size={20} color="#FFFFFF" />
          <Text style={styles.statNumber}>{stats.totalSpent.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Spent</Text>
        </LinearGradient>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsContent}
        >
          {[
            { key: null, label: 'All', count: bidHistory.length },
            { key: 'winning', label: 'Winning', count: bidHistory.filter(b => b.status === 'winning').length },
            { key: 'outbid', label: 'Outbid', count: bidHistory.filter(b => b.status === 'outbid').length },
            { key: 'won', label: 'Won', count: bidHistory.filter(b => b.status === 'won').length },
            { key: 'lost', label: 'Lost', count: bidHistory.filter(b => b.status === 'lost').length },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key || 'all'}
              style={[
                styles.filterTab,
                filterStatus === tab.key && styles.filterTabActive
              ]}
              onPress={() => setFilterStatus(tab.key)}
            >
              <Text style={[
                styles.filterTabText,
                filterStatus === tab.key && styles.filterTabTextActive
              ]}>
                {tab.label}
              </Text>
              <View style={[
                styles.filterTabBadge,
                filterStatus === tab.key && styles.filterTabBadgeActive
              ]}>
                <Text style={[
                  styles.filterTabBadgeText,
                  filterStatus === tab.key && styles.filterTabBadgeTextActive
                ]}>
                  {tab.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Bid History List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredHistory.length > 0 ? (
          <View style={styles.bidsList}>
            {filteredHistory.map((bid) => (
              <BidCard key={bid.id} bid={bid} />
            ))}
          </View>
        ) : (
          <AnimatedCard style={styles.emptyState}>
            <TrendingUp size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No bids found</Text>
            <Text style={styles.emptySubtitle}>
              {filterStatus 
                ? `No ${filterStatus} bids in your history`
                : 'Start bidding on auctions to see your history here'
              }
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => router.push('/(tabs)')}
            >
              <LinearGradient
                colors={['#FF7F00', '#FF6B35']}
                style={styles.exploreButtonGradient}
              >
                <Eye size={16} color="#FFFFFF" />
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
  filterButton: {
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
    marginHorizontal: 2,
  },
  statNumber: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  filterTabs: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterTabsContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
  },
  filterTabActive: {
    backgroundColor: '#FF7F00',
  },
  filterTabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginRight: 6,
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  filterTabBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 20,
    alignItems: 'center',
  },
  filterTabBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterTabBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#6B7280',
  },
  filterTabBadgeTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  bidsList: {
    padding: 20,
    gap: 16,
  },
  bidCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  bidContent: {
    flexDirection: 'row',
    padding: 16,
  },
  bidImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginRight: 16,
  },
  bidImage: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bidDetails: {
    flex: 1,
  },
  bidTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1A2B42',
    marginBottom: 4,
    lineHeight: 22,
  },
  bidCategory: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  bidAmountContainer: {
    marginBottom: 8,
  },
  bidAmountLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  bidAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bidAmount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FF7F00',
    marginRight: 8,
  },
  highestBidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  highestBidText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
    marginLeft: 2,
  },
  finalPriceContainer: {
    marginBottom: 8,
  },
  finalPriceLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 2,
  },
  finalPrice: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  bidFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bidStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 6,
  },
  bidTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
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