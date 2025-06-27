import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, TrendingUp, Plus, Star, Clock, Zap, Gift } from 'lucide-react-native';
import ProductCard from '@/components/ProductCard';
import ConnectsBalance from '@/components/ConnectsBalance';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import AnimatedCard from '@/components/AnimatedCard';
import { useAuctions } from '@/hooks/useAuctions';
import { useAuth } from '@/hooks/useAuth';
import { urlFor } from '@/lib/sanity';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { auctions, hotAuctions, featuredAuctions, endingSoon, loading, error, refreshing, refresh } = useAuctions();
  const [favoriteItems, setFavoriteItems] = useState<string[]>(['2', '4']);

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

  const handleConnectsPress = () => {
    router.push('/get-connects');
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={48} />
          <Text style={styles.loadingText}>Loading curated auctions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Volyx</Text>
        <Text style={styles.tagline}>Curated Treasures</Text>
        <View style={styles.headerRight}>
          <ConnectsBalance
            balance={user?.connectsBalance || 0}
            onPress={handleConnectsPress}
          />
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={20} color="#374151" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        {error && (
          <ErrorMessage 
            message={error} 
            onDismiss={() => {}} 
            type="error" 
          />
        )}

        {/* Featured Auctions */}
        {featuredAuctions.length > 0 && (
          <AnimatedCard delay={100} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Star size={20} color="#f59e0b" fill="#f59e0b" />
              <Text style={styles.sectionTitle}>Curator's Choice</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {featuredAuctions.map((item) => (
                <View key={item._id} style={{ marginRight: 12 }}>
                  <ProductCard
                    id={item._id}
                    title={item.title}
                    image={urlFor(item.image).width(400).height(300).url()}
                    currentBid={item.currentBid}
                    endTime={new Date(item.endTime)}
                    rarity={item.rarity}
                    estimatedValue={item.estimatedValue}
                    isHot={item.isHot}
                    isFeatured={item.isFeatured}
                    isFavorite={favoriteItems.includes(item._id)}
                    onPress={() => handleProductPress(item._id)}
                    onFavoritePress={() => toggleFavorite(item._id)}
                  />
                </View>
              ))}
            </ScrollView>
          </AnimatedCard>
        )}

        {/* Ending Soon Section */}
        {endingSoon.length > 0 && (
          <AnimatedCard delay={200} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={20} color="#ef4444" />
              <Text style={styles.sectionTitle}>Ending Soon!</Text>
              <View style={styles.urgentBadge}>
                <Text style={styles.urgentText}>URGENT</Text>
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {endingSoon.map((item) => (
                <View key={item._id} style={{ marginRight: 12 }}>
                  <ProductCard
                    id={item._id}
                    title={item.title}
                    image={urlFor(item.image).width(400).height(300).url()}
                    currentBid={item.currentBid}
                    endTime={new Date(item.endTime)}
                    rarity={item.rarity}
                    estimatedValue={item.estimatedValue}
                    isHot={item.isHot}
                    isFavorite={favoriteItems.includes(item._id)}
                    onPress={() => handleProductPress(item._id)}
                    onFavoritePress={() => toggleFavorite(item._id)}
                  />
                </View>
              ))}
            </ScrollView>
          </AnimatedCard>
        )}

        {/* Hot Auctions */}
        {hotAuctions.length > 0 && (
          <AnimatedCard delay={300} style={styles.section}>
            <View style={styles.sectionHeader}>
              <TrendingUp size={20} color="#f97316" />
              <Text style={styles.sectionTitle}>Hot Auctions</Text>
              <Zap size={16} color="#f97316" />
            </View>
            <View style={styles.productsGrid}>
              {hotAuctions.map((item) => (
                <ProductCard
                  key={item._id}
                  id={item._id}
                  title={item.title}
                  image={urlFor(item.image).width(400).height(300).url()}
                  currentBid={item.currentBid}
                  endTime={new Date(item.endTime)}
                  rarity={item.rarity}
                  estimatedValue={item.estimatedValue}
                  isHot={item.isHot}
                  isFavorite={favoriteItems.includes(item._id)}
                  onPress={() => handleProductPress(item._id)}
                  onFavoritePress={() => toggleFavorite(item._id)}
                  compact
                />
              ))}
            </View>
          </AnimatedCard>
        )}

        {/* All Auctions */}
        <AnimatedCard delay={400} style={styles.section}>
          <Text style={styles.sectionTitle}>All Live Auctions</Text>
          <Text style={styles.sectionSubtitle}>
            Discover unique collectibles, limited editions, and rare finds
          </Text>
          <View style={styles.productsGrid}>
            {auctions.map((item) => (
              <ProductCard
                key={item._id}
                id={item._id}
                title={item.title}
                image={urlFor(item.image).width(400).height(300).url()}
                currentBid={item.currentBid}
                endTime={new Date(item.endTime)}
                rarity={item.rarity}
                estimatedValue={item.estimatedValue}
                isHot={item.isHot}
                isFavorite={favoriteItems.includes(item._id)}
                onPress={() => handleProductPress(item._id)}
                onFavoritePress={() => toggleFavorite(item._id)}
                compact
              />
            ))}
          </View>
        </AnimatedCard>

        {/* Get More Connects CTA */}
        <AnimatedCard delay={500} style={styles.section}>
          <View style={styles.connectsCTA}>
            <Gift size={32} color="#1e40af" />
            <Text style={styles.ctaTitle}>Boost Your Bidding Power!</Text>
            <Text style={styles.ctaSubtitle}>
              Get more Connects to bid on exclusive collectibles and rare finds
            </Text>
            <View style={styles.ctaButtons}>
              <TouchableOpacity
                style={[styles.ctaButton, styles.watchButton]}
                onPress={handleConnectsPress}
              >
                <Text style={styles.watchButtonText}>Watch Videos</Text>
                <Text style={styles.watchButtonSubtext}>Earn 10 Connects</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.ctaButton, styles.buyButton]}
                onPress={handleConnectsPress}
              >
                <Text style={styles.buyButtonText}>Buy Connects</Text>
                <Plus size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        </AnimatedCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  logo: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1e40af',
  },
  tagline: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    position: 'absolute',
    left: 16,
    bottom: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    marginLeft: 16,
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginLeft: 8,
    flex: 1,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  urgentBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  urgentText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  horizontalScroll: {
    paddingHorizontal: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  connectsCTA: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  ctaTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  ctaButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  watchButton: {
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    flexDirection: 'column',
  },
  watchButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1e40af',
  },
  watchButtonSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginTop: 2,
  },
  buyButton: {
    backgroundColor: '#1e40af',
  },
  buyButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginRight: 4,
  },
});