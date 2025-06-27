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
} from 'lucide-react-native';
import CountdownTimer from '@/components/CountdownTimer';
import ConnectsBalance from '@/components/ConnectsBalance';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { useAuctionItem } from '@/hooks/useAuctions';
import { useBidding } from '@/hooks/useBidding';
import { useAuth } from '@/hooks/useAuth';
import { urlFor } from '@/lib/sanity';

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const { auction, loading, error } = useAuctionItem(id as string);
  const { placeBid, loading: bidLoading, error: bidError, clearError } = useBidding();
  
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={48} />
          <Text style={styles.loadingText}>Loading auction details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !auction) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <ErrorMessage message={error || 'Auction not found'} />
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

  const handleBidPress = () => {
    if (!user) {
      router.push('/auth');
      return;
    }
    setBidAmount(minimumBid.toString());
    setShowBidModal(true);
  };

  const handlePlaceBid = async () => {
    const bid = parseInt(bidAmount, 10);
    if (bid < minimumBid) {
      return;
    }

    const success = await placeBid(auction._id, bid);
    if (success) {
      setShowBidModal(false);
      setBidAmount('');
    }
  };

  const adjustBidAmount = (increment: number) => {
    const current = parseInt(bidAmount, 10) || minimumBid;
    const newAmount = Math.max(minimumBid, current + increment);
    setBidAmount(newAmount.toString());
  };

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
            balance={user?.connectsBalance || 0}
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
            source={{ uri: urlFor(auction.image).width(800).height(600).url() }} 
            style={styles.productImage} 
          />
          {auction.isHot && (
            <View style={styles.hotBadge}>
              <TrendingUp size={16} color="#ffffff" />
              <Text style={styles.hotText}>HOT AUCTION</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{auction.title}</Text>
          <Text style={styles.productCategory}>{auction.category?.name}</Text>
          <Text style={styles.productDescription}>{auction.description}</Text>
        </View>

        {/* Bidding Section */}
        <View style={styles.biddingSection}>
          {bidError && (
            <ErrorMessage 
              message={bidError} 
              onDismiss={clearError}
              type="error" 
            />
          )}
          
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

          <TouchableOpacity
            style={[styles.bidButton, bidLoading && styles.bidButtonDisabled]}
            onPress={handleBidPress}
            disabled={bidLoading}
          >
            {bidLoading ? (
              <LoadingSpinner size={20} color="#ffffff" />
            ) : (
              <Text style={styles.bidButtonText}>Place Bid</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.watchlistButton}>
            <Eye size={16} color="#1e40af" />
            <Text style={styles.watchlistButtonText}>Add to Watchlist</Text>
          </TouchableOpacity>
        </View>
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
                style={[styles.confirmBidButton, bidLoading && styles.confirmBidButtonDisabled]}
                onPress={handlePlaceBid}
                disabled={bidLoading}
              >
                {bidLoading ? (
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  productInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
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
  },
  biddingSection: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
  },
  bidButton: {
    backgroundColor: '#1e40af',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  bidButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  bidButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  watchlistButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  watchlistButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1e40af',
    marginLeft: 8,
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
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  confirmBidButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  confirmBidButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});