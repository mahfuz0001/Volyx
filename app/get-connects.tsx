import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Play,
  Coins,
  Gift,
  Crown,
  Zap,
  Star,
  Shield,
  Award,
} from 'lucide-react-native';
import ConnectsBalance from '@/components/ConnectsBalance';
import AnimatedCard from '@/components/AnimatedCard';
import { mockUserData } from '@/data/mockData';

interface ConnectsPack {
  id: string;
  amount: number;
  bonus: number;
  price: number;
  popular?: boolean;
  bestValue?: boolean;
  icon: any;
  color: string;
  description: string;
}

const connectsPacks: ConnectsPack[] = [
  {
    id: '1',
    amount: 100,
    bonus: 0,
    price: 0.99,
    icon: Coins,
    color: '#f59e0b',
    description: 'Perfect for testing the waters',
  },
  {
    id: '2',
    amount: 500,
    bonus: 50,
    price: 4.99,
    popular: true,
    icon: Gift,
    color: '#1e40af',
    description: 'Most popular choice',
  },
  {
    id: '3',
    amount: 1000,
    bonus: 200,
    price: 9.99,
    bestValue: true,
    icon: Crown,
    color: '#7c3aed',
    description: 'Best value for serious bidders',
  },
  {
    id: '4',
    amount: 2500,
    bonus: 750,
    price: 19.99,
    icon: Zap,
    color: '#ef4444',
    description: 'For the ultimate collector',
  },
];

const videoRewards = [
  { connects: 10, description: 'Standard video ad' },
  { connects: 15, description: 'Interactive ad' },
  { connects: 20, description: 'Survey completion' },
];

export default function GetConnectsScreen() {
  const router = useRouter();
  const [isLoadingAd, setIsLoadingAd] = useState(false);
  const [adsWatchedToday, setAdsWatchedToday] = useState(3);
  const [dailyAdLimit] = useState(10);

  const handleWatchAd = async () => {
    if (adsWatchedToday >= dailyAdLimit) {
      Alert.alert(
        'Daily Limit Reached', 
        'You\'ve watched all available ads for today. Come back tomorrow for more free Connects!',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsLoadingAd(true);
    
    // Simulate ad loading and watching
    setTimeout(() => {
      setIsLoadingAd(false);
      setAdsWatchedToday(prev => prev + 1);
      const reward = videoRewards[Math.floor(Math.random() * videoRewards.length)];
      Alert.alert(
        'Connects Earned!', 
        `You earned ${reward.connects} Connects for watching the ad. Keep collecting!`,
        [{ text: 'Awesome!' }]
      );
    }, 3000);
  };

  const handlePurchasePack = (pack: ConnectsPack) => {
    Alert.alert(
      'Purchase Connects',
      `Purchase ${pack.amount.toLocaleString()}${pack.bonus > 0 ? ` + ${pack.bonus} bonus` : ''} Connects for $${pack.price}?\n\n${pack.description}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Purchase', 
          onPress: () => {
            Alert.alert(
              'Purchase Successful!', 
              `You received ${(pack.amount + pack.bonus).toLocaleString()} Connects! Start bidding on exclusive items now.`,
              [{ text: 'Start Bidding!' }]
            );
          }
        },
      ]
    );
  };

  const remainingAds = dailyAdLimit - adsWatchedToday;
  const canWatchAds = remainingAds > 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Get More Connects</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Balance */}
        <AnimatedCard delay={100} style={styles.balanceSection}>
          <ConnectsBalance
            balance={mockUserData.connectsBalance}
            onPress={() => {}}
            showAddButton={false}
          />
          <Text style={styles.balanceLabel}>Your Current Balance</Text>
          <Text style={styles.balanceSubtext}>
            Use Connects to bid on curated collectibles and rare finds
          </Text>
        </AnimatedCard>

        {/* Watch Videos */}
        <AnimatedCard delay={200} style={styles.section}>
          <Text style={styles.sectionTitle}>Earn Free Connects</Text>
          <Text style={styles.sectionSubtitle}>
            Watch video ads to earn Connects daily
          </Text>
          
          <View style={styles.adContainer}>
            <View style={styles.adInfo}>
              <Play size={24} color="#16a34a" />
              <View style={styles.adTextContainer}>
                <Text style={styles.adTitle}>Watch Video Ads</Text>
                <Text style={styles.adSubtitle}>
                  Earn 10-20 Connects per video
                </Text>
                <Text style={styles.adProgress}>
                  {remainingAds} ads remaining today ({adsWatchedToday}/{dailyAdLimit} watched)
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={[
                styles.watchAdButton,
                !canWatchAds && styles.watchAdButtonDisabled
              ]}
              onPress={handleWatchAd}
              disabled={!canWatchAds || isLoadingAd}
            >
              {isLoadingAd ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Play size={16} color="#ffffff" />
                  <Text style={styles.watchAdButtonText}>
                    {canWatchAds ? 'Watch Ad' : 'Come Back Tomorrow'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {isLoadingAd && (
            <View style={styles.adLoadingContainer}>
              <Text style={styles.adLoadingText}>Loading advertisement...</Text>
              <Text style={styles.adLoadingSubtext}>
                Your ad will start shortly. Please wait.
              </Text>
            </View>
          )}

          {/* Video Rewards Info */}
          <View style={styles.rewardsInfo}>
            <Text style={styles.rewardsTitle}>Earning Opportunities:</Text>
            {videoRewards.map((reward, index) => (
              <View key={index} style={styles.rewardItem}>
                <Coins size={14} color="#f59e0b" />
                <Text style={styles.rewardText}>
                  {reward.connects} Connects - {reward.description}
                </Text>
              </View>
            ))}
          </View>
        </AnimatedCard>

        {/* Purchase Connects */}
        <AnimatedCard delay={300} style={styles.section}>
          <Text style={styles.sectionTitle}>Purchase Connects</Text>
          <Text style={styles.sectionSubtitle}>
            Get instant Connects to bid on exclusive collectibles and rare items
          </Text>
          
          <View style={styles.packsGrid}>
            {connectsPacks.map((pack, index) => {
              const IconComponent = pack.icon;
              const totalConnects = pack.amount + pack.bonus;
              
              return (
                <AnimatedCard key={pack.id} delay={400 + index * 100} style={styles.packContainer}>
                  {pack.popular && (
                    <View style={styles.popularBadge}>
                      <Star size={12} color="#ffffff" fill="#ffffff" />
                      <Text style={styles.popularText}>POPULAR</Text>
                    </View>
                  )}
                  
                  {pack.bestValue && (
                    <View style={styles.bestValueBadge}>
                      <Award size={12} color="#ffffff" fill="#ffffff" />
                      <Text style={styles.bestValueText}>BEST VALUE</Text>
                    </View>
                  )}
                  
                  <TouchableOpacity
                    style={[
                      styles.packCard,
                      pack.popular && styles.popularPack,
                      pack.bestValue && styles.bestValuePack,
                    ]}
                    onPress={() => handlePurchasePack(pack)}
                  >
                    <View style={[styles.packIcon, { backgroundColor: pack.color }]}>
                      <IconComponent size={24} color="#ffffff" />
                    </View>
                    
                    <Text style={styles.packAmount}>
                      {pack.amount.toLocaleString()}
                    </Text>
                    
                    {pack.bonus > 0 && (
                      <View style={styles.bonusContainer}>
                        <Text style={styles.bonusText}>
                          +{pack.bonus} BONUS
                        </Text>
                      </View>
                    )}
                    
                    <Text style={styles.packTotal}>
                      Total: {totalConnects.toLocaleString()} Connects
                    </Text>
                    
                    <Text style={styles.packDescription}>
                      {pack.description}
                    </Text>
                    
                    <View style={styles.packPrice}>
                      <Text style={styles.priceText}>${pack.price}</Text>
                    </View>
                  </TouchableOpacity>
                </AnimatedCard>
              );
            })}
          </View>
        </AnimatedCard>

        {/* Value Proposition */}
        <AnimatedCard delay={600} style={styles.valueSection}>
          <Text style={styles.valueTitle}>Why Get More Connects?</Text>
          <View style={styles.valuePoints}>
            <View style={styles.valuePoint}>
              <Shield size={16} color="#1e40af" />
              <Text style={styles.valuePointText}>
                Bid on authenticated, curated collectibles
              </Text>
            </View>
            <View style={styles.valuePoint}>
              <Gift size={16} color="#16a34a" />
              <Text style={styles.valuePointText}>
                Win rare finds and limited edition items
              </Text>
            </View>
            <View style={styles.valuePoint}>
              <Zap size={16} color="#ef4444" />
              <Text style={styles.valuePointText}>
                Join exciting live auctions with real-time bidding
              </Text>
            </View>
            <View style={styles.valuePoint}>
              <Crown size={16} color="#7c3aed" />
              <Text style={styles.valuePointText}>
                Access exclusive curator's choice items
              </Text>
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  balanceSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginTop: 8,
  },
  balanceSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#ffffff',
    marginBottom: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginBottom: 20,
  },
  adContainer: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 16,
    padding: 16,
  },
  adInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  adTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  adTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  adSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#16a34a',
    marginBottom: 4,
  },
  adProgress: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  watchAdButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16a34a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  watchAdButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  watchAdButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginLeft: 8,
  },
  adLoadingContainer: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fed7aa',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    alignItems: 'center',
  },
  adLoadingText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#92400e',
    marginBottom: 4,
  },
  adLoadingSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#a16207',
    textAlign: 'center',
  },
  rewardsInfo: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  rewardsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rewardText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginLeft: 8,
  },
  packsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  packContainer: {
    position: 'relative',
    width: '48%',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: '50%',
    transform: [{ translateX: -40 }],
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  popularText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginLeft: 2,
  },
  bestValueBadge: {
    position: 'absolute',
    top: -8,
    left: '50%',
    transform: [{ translateX: -45 }],
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7c3aed',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  bestValueText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginLeft: 2,
  },
  packCard: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  popularPack: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  bestValuePack: {
    borderColor: '#7c3aed',
    backgroundColor: '#f3f4f6',
  },
  packIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  packAmount: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  bonusContainer: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 8,
  },
  bonusText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  packTotal: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  packDescription: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    marginBottom: 12,
    textAlign: 'center',
  },
  packPrice: {
    backgroundColor: '#1e40af',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  priceText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  valueSection: {
    backgroundColor: '#ffffff',
    marginBottom: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  valueTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  valuePoints: {
    gap: 12,
  },
  valuePoint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valuePointText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
});