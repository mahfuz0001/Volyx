import React, { useState } from 'react';
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
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CountdownTimer from '@/components/CountdownTimer';
import ConnectsBalance from '@/components/ConnectsBalance';
import LoadingSpinner from '@/components/LoadingSpinner';
import AnimatedCard from '@/components/AnimatedCard';
import { mockAuctionItems } from '@/data/mockData';

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Find the auction item by ID
  const auction = mockAuctionItems.find(item => item.id === id);

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

  const minimumBid = auction.currentBid + 10;
  const userConnects = 2750; // Mock user balance

  const handleBidPress = () => {
    setBidAmount(minimumBid.toString());
    setShowBidModal(true);
  };

  const handlePlaceBid = async () => {
    const bid = parseInt(bidAmount, 10);
    if (bid < minimumBid) {
      Alert.alert('Invalid Bid', `Your bid must be at least ${minimumBid} Connects`);
      return;
    }

    if (bid > userConnects) {
      Alert.alert('Insufficient Connects', 'You don\'t have enough Connects for this bid.');
      return;
    }

    setIsLoading(true);
    
    // Simulate bid placement
    setTimeout(() => {
      setIsLoading(false);
      setShowBidModal(false);
      setBidAmount('');
      Alert.alert('Bid Placed!', `Your bid of ${bid} Connects has been placed successfully.`);
    }, 1500);
  };

  const adjustBidAmount = (increment: number) => {
    const current = parseInt(bidAmount, 10) || minimumBid;
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

  const RarityIcon = getRarityIcon('rare'); // Mock rarity

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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
            <View style={[styles.rarityBadge, { backgroundColor: getRarityColor('rare') }]}>
              <RarityIcon size={12} color="#FFFFFF" />
              <Text style={styles.rarityText}>RARE</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <AnimatedCard delay={100} style={styles.productInfo}>
          <Text style={styles.productTitle}>{auction.title}</Text>
          <Text style={styles.productCategory}>{auction.category}</Text>
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
            endTime={auction.endTime}
            style={styles.countdown}
          />

          <View style={styles.auctionStats}>
            <View style={styles.statItem}>
              <Gavel size={16} color="#6B7280" />
              <Text style={styles.statText}>47 bids</Text>
            </View>
            <View style={styles.statItem}>
              <Users size={16} color="#6B7280" />
              <Text style={styles.statText}>234 watching</Text>
            </View>
            <View style={styles.statItem}>
              <Eye size={16} color="#6B7280" />
              <Text style={styles.statText}>1.2k views</Text>
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