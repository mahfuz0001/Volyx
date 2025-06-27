import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { Heart, TrendingUp, Star, Shield, Award } from 'lucide-react-native';
import CountdownTimer from './CountdownTimer';
import PulseAnimation from './PulseAnimation';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 cards per row with padding

interface ProductCardProps {
  id: string;
  title: string;
  image: string;
  currentBid: number;
  endTime: Date;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  estimatedValue?: { min: number; max: number };
  authenticity?: string;
  condition?: string;
  isHot?: boolean;
  isFeatured?: boolean;
  isFavorite?: boolean;
  onPress: () => void;
  onFavoritePress: () => void;
  compact?: boolean;
}

const rarityColors = {
  common: '#6b7280',
  uncommon: '#16a34a',
  rare: '#2563eb',
  epic: '#7c3aed',
  legendary: '#f59e0b',
};

const rarityIcons = {
  common: null,
  uncommon: Shield,
  rare: Star,
  epic: Award,
  legendary: Award,
};

export default function ProductCard({
  id,
  title,
  image,
  currentBid,
  endTime,
  rarity = 'common',
  estimatedValue,
  authenticity,
  condition,
  isHot = false,
  isFeatured = false,
  isFavorite = false,
  onPress,
  onFavoritePress,
  compact = false,
}: ProductCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const cardStyle = compact 
    ? { width: cardWidth } 
    : { width: width - 32 };

  const RarityIcon = rarityIcons[rarity];

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const CardContent = (
    <Animated.View
      style={[
        styles.container,
        cardStyle,
        isFeatured && styles.featuredCard,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
        
        {/* Rarity Badge */}
        {rarity !== 'common' && (
          <View style={[styles.rarityBadge, { backgroundColor: rarityColors[rarity] }]}>
            {RarityIcon && <RarityIcon size={10} color="#ffffff" />}
            <Text style={styles.rarityText}>{rarity.toUpperCase()}</Text>
          </View>
        )}
        
        {/* Hot Badge */}
        {isHot && (
          <PulseAnimation duration={1500}>
            <View style={styles.hotBadge}>
              <TrendingUp size={12} color="#ffffff" />
              <Text style={styles.hotText}>HOT</Text>
            </View>
          </PulseAnimation>
        )}

        {/* Featured Badge */}
        {isFeatured && (
          <View style={styles.featuredBadge}>
            <Star size={10} color="#ffffff" fill="#ffffff" />
            <Text style={styles.featuredText}>FEATURED</Text>
          </View>
        )}
        
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onFavoritePress}
        >
          <Heart
            size={16}
            color={isFavorite ? '#ef4444' : '#ffffff'}
            fill={isFavorite ? '#ef4444' : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {/* Authenticity & Condition */}
        {(authenticity || condition) && (
          <View style={styles.detailsRow}>
            {authenticity && (
              <View style={styles.detailBadge}>
                <Shield size={10} color="#16a34a" />
                <Text style={styles.detailText}>Verified</Text>
              </View>
            )}
            {condition && (
              <View style={styles.detailBadge}>
                <Text style={styles.detailText}>{condition}</Text>
              </View>
            )}
          </View>
        )}

        {/* Estimated Value */}
        {estimatedValue && (
          <Text style={styles.estimatedValue}>
            Est. ${estimatedValue.min}-${estimatedValue.max}
          </Text>
        )}
        
        <View style={styles.bidContainer}>
          <Text style={styles.bidLabel}>Current Bid</Text>
          <Text style={styles.bidAmount}>{currentBid.toLocaleString()} Connects</Text>
        </View>

        <CountdownTimer
          endTime={endTime}
          compact={true}
          style={styles.timer}
        />
      </View>
    </Animated.View>
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      {CardContent}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  featuredCard: {
    borderWidth: 2,
    borderColor: '#f59e0b',
    shadowColor: '#f59e0b',
    shadowOpacity: 0.2,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f3f4f6',
  },
  rarityBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  rarityText: {
    fontSize: 8,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginLeft: 2,
  },
  hotBadge: {
    position: 'absolute',
    top: 8,
    right: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  hotText: {
    fontSize: 9,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginLeft: 3,
  },
  featuredBadge: {
    position: 'absolute',
    top: 32,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f59e0b',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  featuredText: {
    fontSize: 8,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginLeft: 2,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 22,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 6,
    gap: 6,
  },
  detailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  detailText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#16a34a',
    marginLeft: 2,
  },
  estimatedValue: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginBottom: 8,
  },
  bidContainer: {
    marginBottom: 12,
  },
  bidLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginBottom: 4,
  },
  bidAmount: {
    fontSize: 17,
    fontFamily: 'Inter-Bold',
    color: '#1e40af',
  },
  timer: {
    alignSelf: 'flex-start',
  },
});