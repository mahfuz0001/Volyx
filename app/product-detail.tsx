import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ChevronLeft,
  Heart,
  Share,
  Eye,
  Clock,
  Users,
  TrendingUp,
  Plus,
  Minus,
  Gavel,
  Shield,
  Star,
  Award,
  RefreshCw,
  TriangleAlert as AlertTriangle,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CountdownTimer from '@/components/CountdownTimer';
import ConnectsBalance from '@/components/ConnectsBalance';
import LoadingSpinner from '@/components/LoadingSpinner';
import AnimatedCard from '@/components/AnimatedCard';
import { useAuth } from '@/hooks/useAuth';
import { auctionAPI } from '@/lib/api';
import { useSocket } from '@/lib/socket';
import { useAdMob, AdMobBanner } from '@/lib/admob';

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const { showInterstitial } = useAdMob();
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [auction, setAuction] = useState(null);
  const [bidHistory, setBidHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Set up socket connection for real-time updates
  const { on, emit } = useSocket(user?.id);
  
  useEffect(() => {
    fetchAuctionData();
    
    // Set up socket listeners for real-time updates
    const unsubscribeAuctionUpdate = on('auction_update', handleAuctionUpdate);
    const unsubscribeNewBid = on('new_bid', handleNewBid);
    
    return () => {
      unsubscribeAuctionUpdate();
      unsubscribeNewBid();
    };
  }, [id]);
  
  const handleAuctionUpdate = (data) => {
    // Update auction data if it matches the current auction
    if (data.id === id) {
      setAuction(data);
    }
  };
  
  const handleNewBid = (data) => {
    // Update auction data and bid history if it matches the current auction
    if (data.auction.id === id) {
      setAuction(data.auction);
      setBidHistory(prev => [data.bid, ...prev]);
    }
  };

  const fetchAuctionData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch auction details and bid history
      const [auctionData, bidHistoryData] = await Promise.all([
        auctionAPI.getById(id as string),
        auctionAPI.getBidHistory(id as string),
      ]);
      
      setAuction(auctionData);
      setBidHistory(bidHistoryData);
      
      // Show interstitial ad with 10% chance when viewing product details
      if (Math.random() < 0.1) {
        showInterstitial();
      }
    } catch (error) {
      console.error('Failed to fetch auction data:', error);
      setError('Failed to load auction details. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAuctionData();
  };

  const handleBidPress = () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to place a bid.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: () => router.push('/auth') },
      ]);
      return;
    }
    
    const minimumBid = auction.currentBid + 10; // Simplified, would use calculateBidIncrement in production
    setBidAmount(minimumBid.toString());
    setShowBidModal(true);
  };

  const handlePlaceBid = async () => {
    const bid = parseInt(bidAmount, 10);
    const minimumBid = auction.currentBid + 10; // Simplified, would use calculateBidIncrement in production
    
    if (bid < minimumBid) {
      Alert.alert('Invalid Bid', `Your bid must be at least ${minimumBid} Connects`);
      return;
    }

    if (bid > user.connectsBalance) {
      Alert.alert(
        'Insufficient Connects', 
        'You don\'t have enough Connects for this bid. Would you like to get more?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Get Connects', onPress: () => {
            setShowBidModal(false);
            router.push('/get-connects');
          }},
        ]
      );
      return;
    }

    setIsLoading(true);
    
    try {
      // Place bid
      await auctionAPI.placeBid({
        auctionItemId: auction.id,
        amount: bid,
        userId: user.id,
        deviceFingerprint: 'device_fingerprint', // Would use actual device fingerprint in production
        ipAddress: '127.0.0.1', // Would use actual IP in production
      });
      
      // Emit socket event for real-time updates
      emit('place_bid', {
        auctionId: auction.id,
        userId: user.id,
        amount: bid,
      });
      
      // Update local state
      setAuction(prev => ({
        ...prev,
        currentBid: bid,
      }));
      
      // Add bid to history
      setBidHistory(prev => [{
        id: Date.now().toString(),
        amount: bid,
        user: {
          name: user.name,
        },
        createdAt: new Date().toISOString(),
      }, ...prev]);
      
      setShowBidModal(false);
      setBidAmount('');
      
      Alert.alert('Bid Placed!', `Your bid of ${bid} Connects has been placed successfully.`);
    } catch (error) {
      console.error('Failed to place bid:', error);
      Alert.alert('Bid Failed', error.message || 'Failed to place bid. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const adjustBidAmount = (increment: number) => {
    const current = parseInt(bidAmount, 10) || (auction?.currentBid + 10);
    const minimumBid = auction?.currentBid + 10;
    const newAmount = Math.max(minimumBid, current + increment);
    setBidAmount(newAmount.toString());
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '#FFD700';
      case 'epic': return '#9D4EDD';
      case 'rare': return '#2196F3';
      case 'uncommon': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return Award;
      case 'epic': return Star;
      case 'rare': return Shield;
      default: return null;
    }
  };

  if (loading && !auction) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF7F00" />
          <Text style={styles.loadingText}>Loading auction details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <AlertTriangle size={64} color="#EF4444" />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchAuctionData}>
            <RefreshCw size={16} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!auction) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Auction not found</Text>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const minimumBid = auction.currentBid + 10; // Simplified, would use calculateBidIncrement in production
  const userConnects = user?.connectsBalance || 0;
  const RarityIcon = getRarityIcon(auction.rarity || 'rare');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <ConnectsBalance
            balance={userConnects}
            onPress={() => router.push('/get-connects')}
            showAddButton={false}
          />
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Heart
              size={20}
              color={isFavorite ? '#ef4444' : '#6b7280'}
              fill={isFavorite ? '#ef4444' : 'transparent'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Share size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: auction.image }} 
            style={styles.productImage} 
          />
          {auction.isHot && (
            <View style={styles.hotBadge}>
              <TrendingUp size={16} color="#ffffff" />
              <Text style={styles.hotText}>HOT AUCTION</Text>
            </View>
          )}
          {RarityIcon && (
            <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(auction.rarity || 'rare') }]}>
              <RarityIcon size={12} color="#FFFFFF" />
              <Text style={styles.rarityText}>{auction.rarity?.toUpperCase() || 'RARE'}</Text>
            </View>
          )}
        </View>

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

        {/* Product Info */}
        <AnimatedCard delay={100} style={styles.productInfo}>
          <Text style={styles.productTitle}>{auction.title}</Text>
          <Text style={styles.productCategory}>{auction.category?.name || 'Collectible'}</Text>
          <Text style={styles.productDescription}>{auction.description}</Text>
          
          {/* Authenticity Badge */}
          <View style={styles.authenticityBadge}>
            <Shield size={16} color="#16A34A" />
            <Text style={styles.authenticityText}>Authenticated & Verified</Text>
          </View>
        </AnimatedCard>

        {/* Bidding Section */}
        <AnimatedCard delay={200} style={styles.biddingSection}>
          <View style={styles.currentBidContainer}>
            <Text style={styles.currentBidLabel}>Current Highest Bid</Text>
            <Text style={styles.currentBidAmount}>
              {auction.currentBid.toLocaleString()} Connects
            </Text>
            <Text style={styles.minimumBidText}>
              Next bid: {minimumBid.toLocaleString()} Connects minimum
            </Text>
          </View>

          <CountdownTimer
            endTime={new Date(auction.endTime)}
            style={styles.countdown}
          />

          <View style={styles.auctionStats}>
            <View style={styles.statItem}>
              <Gavel size={16} color="#6B7280" />
              <Text style={styles.statText}>{bidHistory.length} bids</Text>
            </View>
            <View style={styles.statItem}>
              <Users size={16} color="#6B7280" />
              <Text style={styles.statText}>{Math.floor(Math.random() * 200) + 50} watching</Text>
            </View>
            <View style={styles.statItem}>
              <Eye size={16} color="#6B7280" />
              <Text style={styles.statText}>{Math.floor(Math.random() * 1000) + 500} views</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.bidButton}
            onPress={handleBidPress}
          >
            <LinearGradient
              colors={['#FF7F00', '#FF6B35']}
              style={styles.bidButtonGradient}
            >
              <Gavel size={20} color="#FFFFFF" />
              <Text style={styles.bidButtonText}>Place Bid</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.watchlistButton}
            onPress={() => router.push('/watchlist')}
          >
            <Eye size={16} color="#1e40af" />
            <Text style={styles.watchlistButtonText}>Add to Watchlist</Text>
          </TouchableOpacity>
        </AnimatedCard>
        
        {/* Bid History */}
        <AnimatedCard delay={250} style={styles.bidHistorySection}>
          <Text style={styles.bidHistoryTitle}>Bid History</Text>
          
          {bidHistory.length > 0 ? (
            <View style={styles.bidHistoryList}>
              {bidHistory.slice(0, 5).map((bid, index) => (
                <View key={bid.id || index} style={styles.bidHistoryItem}>
                  <View style={styles.bidHistoryUser}>
                    <Text style={styles.bidHistoryUserName}>{bid.user?.name || 'Anonymous'}</Text>
                    <Text style={styles.bidHistoryTime}>
                      {new Date(bid.createdAt).toLocaleString()}
                    </Text>
                  </View>
                  <Text style={styles.bidHistoryAmount}>
                    {bid.amount.toLocaleString()} Connects
                  </Text>
                </View>
              ))}
              
              {bidHistory.length > 5 && (
                <TouchableOpacity style={styles.viewAllBidsButton}>
                  <Text style={styles.viewAllBidsText}>View All {bidHistory.length} Bids</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.noBidsContainer}>
              <Text style={styles.noBidsText}>No bids yet. Be the first to bid!</Text>
            </View>
          )}
        </AnimatedCard>

        {/* Related Actions */}
        <AnimatedCard delay={300} style={styles.relatedActions}>
          <Text style={styles.relatedTitle}>Quick Actions</Text>
          <View style={styles.actionsList}>
            <TouchableOpacity 
              style={styles.relatedAction}
              onPress={() => router.push('/bid-history')}
            >
              <Text style={styles.relatedActionText}>View Bid History</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.relatedAction}
              onPress={() => router.push('/(tabs)/search')}
            >
              <Text style={styles.relatedActionText}>Find Similar Items</Text>
            </TouchableOpacity>
          </View>
        </AnimatedCard>
        
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
      </ScrollView>

      {/* Bid Modal */}
      <Modal
        visible={showBidModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBidModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Place Your Bid</Text>
            <Text style={styles.modalSubtitle}>
              Minimum bid: {minimumBid.toLocaleString()} Connects
            </Text>

            <View style={styles.bidInputContainer}>
              <TouchableOpacity
                style={styles.adjustButton}
                onPress={() => adjustBidAmount(-10)}
              >
                <Minus size={16} color="#6b7280" />
              </TouchableOpacity>
              <TextInput
                style={styles.bidInput}
                value={bidAmount}
                onChangeText={setBidAmount}
                keyboardType="numeric"
                placeholder={minimumBid.toString()}
              />
              <TouchableOpacity
                style={styles.adjustButton}
                onPress={() => adjustBidAmount(10)}
              >
                <Plus size={16} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.bidInputLabel}>Connects</Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowBidModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBidButton, isLoading && styles.confirmBidButtonDisabled]}
                onPress={handlePlaceBid}
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner size={16} color="#ffffff" />
                ) : (
                  <Text style={styles.confirmBidButtonText}>Place Bid</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ef4444',
    marginBottom: 20,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerBackButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
    backgroundColor: '#f3f4f6',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  hotBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  hotText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginLeft: 4,
  },
  rarityBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rarityText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  bannerAdContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  productInfo: {
    padding: 16,
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 16,
  },
  productTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  productCategory: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1e40af',
    marginBottom: 12,
  },
  productDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  authenticityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  authenticityText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
    marginLeft: 6,
  },
  biddingSection: {
    padding: 16,
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  currentBidContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  currentBidLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginBottom: 4,
  },
  currentBidAmount: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1e40af',
    marginBottom: 8,
  },
  minimumBidText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  countdown: {
    marginBottom: 20,
    alignSelf: 'center',
  },
  auctionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginLeft: 6,
  },
  bidButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  bidButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  bidButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginLeft: 8,
  },
  watchlistButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#1e40af',
    borderRadius: 12,
  },
  watchlistButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1e40af',
    marginLeft: 8,
  },
  bidHistorySection: {
    padding: 16,
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  bidHistoryTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  bidHistoryList: {
    gap: 12,
  },
  bidHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  bidHistoryUser: {
    flex: 1,
  },
  bidHistoryUserName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  bidHistoryTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  bidHistoryAmount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FF7F00',
  },
  viewAllBidsButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  viewAllBidsText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1e40af',
  },
  noBidsContainer: {
    padding: 16,
    alignItems: 'center',
  },
  noBidsText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  relatedActions: {
    padding: 16,
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  relatedTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  actionsList: {
    gap: 8,
  },
  relatedAction: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    alignItems: 'center',
  },
  relatedActionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  backButton: {
    backgroundColor: '#1e40af',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  bidInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    marginBottom: 8,
  },
  adjustButton: {
    padding: 16,
    borderColor: '#e5e7eb',
  },
  bidInput: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    paddingVertical: 16,
  },
  bidInputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  confirmBidButton: {
    flex: 1,
    backgroundColor: '#1e40af',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmBidButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  confirmBidButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  bottomPadding: {
    height: 100,
  },
});