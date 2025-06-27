import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, Search, Plus, TrendingUp } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ProductCard from '@/components/ProductCard';
import AnimatedCard from '@/components/AnimatedCard';
import { mockAuctionItems } from '@/data/mockData';

export default function FavoritesScreen() {
  const router = useRouter();
  const [favoriteItems, setFavoriteItems] = useState<string[]>(['2', '4']);

  // Filter items to show only favorites
  const favoritedItems = mockAuctionItems.filter(item => 
    favoriteItems.includes(item.id)
  );

  const toggleFavorite = (itemId: string) => {
    setFavoriteItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleProductPress = (itemId: string) => {
    router.push(`/product-detail?id=${itemId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favorites</Text>
        <Text style={styles.headerSubtitle}>
          Keep track of items you're interested in
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {favoritedItems.length > 0 ? (
          <>
            {/* Stats */}
            <AnimatedCard delay={100} style={styles.statsContainer}>
              <LinearGradient
                colors={['#FF7F00', '#FF6B35']}
                style={styles.statCard}
              >
                <Heart size={20} color="#FFFFFF" fill="#FFFFFF" />
                <Text style={styles.statNumber}>{favoritedItems.length}</Text>
                <Text style={styles.statLabel}>Favorite Items</Text>
              </LinearGradient>
              
              <LinearGradient
                colors={['#EF4444', '#DC2626']}
                style={styles.statCard}
              >
                <TrendingUp size={20} color="#FFFFFF" />
                <Text style={styles.statNumber}>
                  {favoritedItems.filter(item => item.isHot).length}
                </Text>
                <Text style={styles.statLabel}>Hot Items</Text>
              </LinearGradient>
            </AnimatedCard>

            {/* Quick Actions */}
            <AnimatedCard delay={200} style={styles.quickActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push('/watchlist')}
              >
                <Text style={styles.actionButtonText}>View Watchlist</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push('/(tabs)/search')}
              >
                <Text style={styles.actionButtonText}>Find More Items</Text>
              </TouchableOpacity>
            </AnimatedCard>

            {/* Products Section */}
            <AnimatedCard delay={300} style={styles.productsSection}>
              <Text style={styles.sectionTitle}>Your Watchlist</Text>
              <View style={styles.productsGrid}>
                {favoritedItems.map((item) => (
                  <ProductCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    image={item.image}
                    currentBid={item.currentBid}
                    endTime={item.endTime}
                    isHot={item.isHot}
                    isFavorite={true}
                    onPress={() => handleProductPress(item.id)}
                    onFavoritePress={() => toggleFavorite(item.id)}
                    compact
                  />
                ))}
              </View>
            </AnimatedCard>
          </>
        ) : (
          <AnimatedCard delay={100} style={styles.emptyState}>
            <Heart size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptySubtitle}>
              Start adding items to your favorites by tapping the heart icon on any auction
            </Text>
            <TouchableOpacity 
              style={styles.exploreButton}
              onPress={() => router.push('/(tabs)/search')}
            >
              <LinearGradient
                colors={['#FF7F00', '#FF6B35']}
                style={styles.exploreButtonGradient}
              >
                <Search size={16} color="#ffffff" />
                <Text style={styles.exploreButtonText}>Explore Auctions</Text>
              </LinearGradient>
            </TouchableOpacity>
          </AnimatedCard>
        )}

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 16,
  },
  statNumber: {
    fontSize: 24,
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
  quickActions: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  productsSection: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    margin: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
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
    color: '#ffffff',
    marginLeft: 8,
  },
  bottomPadding: {
    height: 120,
  },
});