import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Gavel, 
  Trophy, 
  Coins, 
  Eye, 
  Heart, 
  Clock, 
  Filter,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Package,
  DollarSign
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedCard from '@/components/AnimatedCard';
import GradientBackground from '@/components/GradientBackground';

export default function UserActivityScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');
  const [activityFilter, setActivityFilter] = useState('all');

  const timeRanges = [
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: '90D', value: '90d' },
    { label: '1Y', value: '1y' },
  ];

  const activityFilters = [
    { label: 'All', value: 'all' },
    { label: 'Bids', value: 'bids' },
    { label: 'Wins', value: 'wins' },
    { label: 'Connects', value: 'connects' },
    { label: 'Views', value: 'views' },
  ];

  const activityStats = {
    totalBids: 127,
    successfulBids: 23,
    totalSpent: 45680,
    connectsEarned: 2340,
    auctionsViewed: 456,
    favoriteItems: 34,
    averageBid: 359,
    winRate: 18.1,
    mostActiveDay: 'Tuesday',
    favoriteCategory: 'Electronics',
  };

  const recentActivity = [
    {
      id: '1',
      type: 'bid',
      title: 'Placed bid on Vintage Camera Collection',
      amount: 450,
      timestamp: '2 hours ago',
      status: 'active',
      auctionId: 'auction_1',
    },
    {
      id: '2',
      type: 'won',
      title: 'Won Rare Comic Book Collection',
      amount: 1250,
      timestamp: '1 day ago',
      status: 'won',
      auctionId: 'auction_2',
    },
    {
      id: '3',
      type: 'outbid',
      title: 'Outbid on Designer Watch',
      amount: 890,
      timestamp: '2 days ago',
      status: 'outbid',
      auctionId: 'auction_3',
    },
    {
      id: '4',
      type: 'earned',
      title: 'Earned Connects from video',
      amount: 25,
      timestamp: '2 days ago',
      status: 'completed',
    },
    {
      id: '5',
      type: 'bid',
      title: 'Placed bid on Professional Headphones',
      amount: 320,
      timestamp: '3 days ago',
      status: 'active',
      auctionId: 'auction_4',
    },
    {
      id: '6',
      type: 'favorite',
      title: 'Added Vintage Guitar to favorites',
      timestamp: '4 days ago',
      status: 'completed',
      auctionId: 'auction_5',
    },
    {
      id: '7',
      type: 'view',
      title: 'Viewed Artisan Coffee Set',
      timestamp: '5 days ago',
      status: 'completed',
      auctionId: 'auction_6',
    },
    {
      id: '8',
      type: 'purchased',
      title: 'Purchased 500 Connects',
      amount: 500,
      timestamp: '1 week ago',
      status: 'completed',
    },
  ];

  const weeklyData = [
    { day: 'Mon', bids: 3, views: 12, connects: 45 },
    { day: 'Tue', bids: 7, views: 18, connects: 25 },
    { day: 'Wed', bids: 2, views: 8, connects: 60 },
    { day: 'Thu', bids: 5, views: 15, connects: 30 },
    { day: 'Fri', bids: 4, views: 22, connects: 40 },
    { day: 'Sat', bids: 8, views: 25, connects: 15 },
    { day: 'Sun', bids: 6, views: 20, connects: 35 },
  ];

  const categoryBreakdown = [
    { category: 'Electronics', percentage: 35, color: '#3b82f6' },
    { category: 'Fashion', percentage: 25, color: '#ef4444' },
    { category: 'Collectibles', percentage: 20, color: '#f59e0b' },
    { category: 'Lifestyle', percentage: 15, color: '#16a34a' },
    { category: 'Other', percentage: 5, color: '#6b7280' },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'bid': return Gavel;
      case 'won': return Trophy;
      case 'outbid': return TrendingDown;
      case 'earned': return Coins;
      case 'purchased': return DollarSign;
      case 'favorite': return Heart;
      case 'view': return Eye;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'bid': return '#1e40af';
      case 'won': return '#16a34a';
      case 'outbid': return '#ef4444';
      case 'earned': return '#f59e0b';
      case 'purchased': return '#7c3aed';
      case 'favorite': return '#ec4899';
      case 'view': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const formatAmount = (amount: number, type: string) => {
    if (type === 'earned' || type === 'purchased') {
      return `+${amount}`;
    } else if (type === 'bid' || type === 'won' || type === 'outbid') {
      return amount.toLocaleString();
    }
    return '';
  };

  const filteredActivity = activityFilter === 'all' 
    ? recentActivity 
    : recentActivity.filter(item => {
        switch (activityFilter) {
          case 'bids': return ['bid', 'won', 'outbid'].includes(item.type);
          case 'wins': return item.type === 'won';
          case 'connects': return ['earned', 'purchased'].includes(item.type);
          case 'views': return ['view', 'favorite'].includes(item.type);
          default: return true;
        }
      });

  return (
    <GradientBackground colors={['#f8fafc', '#e2e8f0']}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Activity & Stats</Text>
          <TouchableOpacity style={styles.exportButton}>
            <Download size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Time Range Selector */}
          <AnimatedCard delay={100} style={styles.timeRangeContainer}>
            <View style={styles.timeRangeSelector}>
              {timeRanges.map((range) => (
                <TouchableOpacity
                  key={range.value}
                  style={[
                    styles.timeRangeButton,
                    timeRange === range.value && styles.timeRangeButtonActive,
                  ]}
                  onPress={() => setTimeRange(range.value)}
                >
                  <Text
                    style={[
                      styles.timeRangeText,
                      timeRange === range.value && styles.timeRangeTextActive,
                    ]}
                  >
                    {range.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </AnimatedCard>

          {/* Overview Stats */}
          <AnimatedCard delay={200} style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <LinearGradient colors={['#1e40af', '#3b82f6']} style={styles.statIcon}>
                  <Gavel size={20} color="#ffffff" />
                </LinearGradient>
                <Text style={styles.statNumber}>{activityStats.totalBids}</Text>
                <Text style={styles.statLabel}>Total Bids</Text>
                <Text style={styles.statChange}>+12 this week</Text>
              </View>
              
              <View style={styles.statCard}>
                <LinearGradient colors={['#16a34a', '#22c55e']} style={styles.statIcon}>
                  <Trophy size={20} color="#ffffff" />
                </LinearGradient>
                <Text style={styles.statNumber}>{activityStats.successfulBids}</Text>
                <Text style={styles.statLabel}>Items Won</Text>
                <Text style={styles.statChange}>+3 this week</Text>
              </View>
              
              <View style={styles.statCard}>
                <LinearGradient colors={['#f59e0b', '#fbbf24']} style={styles.statIcon}>
                  <Coins size={20} color="#ffffff" />
                </LinearGradient>
                <Text style={styles.statNumber}>{activityStats.connectsEarned}</Text>
                <Text style={styles.statLabel}>Connects Earned</Text>
                <Text style={styles.statChange}>+125 this week</Text>
              </View>
              
              <View style={styles.statCard}>
                <LinearGradient colors={['#7c3aed', '#a855f7']} style={styles.statIcon}>
                  <Target size={20} color="#ffffff" />
                </LinearGradient>
                <Text style={styles.statNumber}>{activityStats.winRate}%</Text>
                <Text style={styles.statLabel}>Win Rate</Text>
                <Text style={styles.statChange}>+2.1% this week</Text>
              </View>
            </View>
          </AnimatedCard>

          {/* Weekly Activity Chart */}
          <AnimatedCard delay={300} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Weekly Activity</Text>
              <BarChart3 size={20} color="#6b7280" />
            </View>
            
            <View style={styles.chartContainer}>
              <View style={styles.chartLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#1e40af' }]} />
                  <Text style={styles.legendText}>Bids</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#f59e0b' }]} />
                  <Text style={styles.legendText}>Views</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#16a34a' }]} />
                  <Text style={styles.legendText}>Connects</Text>
                </View>
              </View>
              
              <View style={styles.chart}>
                {weeklyData.map((data, index) => {
                  const maxValue = Math.max(...weeklyData.map(d => Math.max(d.bids, d.views, d.connects)));
                  const bidHeight = (data.bids / maxValue) * 80;
                  const viewHeight = (data.views / maxValue) * 80;
                  const connectHeight = (data.connects / maxValue) * 80;
                  
                  return (
                    <View key={index} style={styles.chartDay}>
                      <View style={styles.chartBars}>
                        <View style={[styles.chartBar, { height: bidHeight, backgroundColor: '#1e40af' }]} />
                        <View style={[styles.chartBar, { height: viewHeight, backgroundColor: '#f59e0b' }]} />
                        <View style={[styles.chartBar, { height: connectHeight, backgroundColor: '#16a34a' }]} />
                      </View>
                      <Text style={styles.chartLabel}>{data.day}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </AnimatedCard>

          {/* Category Breakdown */}
          <AnimatedCard delay={400} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Category Interests</Text>
              <PieChart size={20} color="#6b7280" />
            </View>
            
            <View style={styles.categoryList}>
              {categoryBreakdown.map((category, index) => (
                <View key={index} style={styles.categoryItem}>
                  <View style={styles.categoryInfo}>
                    <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
                    <Text style={styles.categoryName}>{category.category}</Text>
                  </View>
                  <View style={styles.categoryProgress}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { 
                            width: `${category.percentage}%`, 
                            backgroundColor: category.color 
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.categoryPercentage}>{category.percentage}%</Text>
                  </View>
                </View>
              ))}
            </View>
          </AnimatedCard>

          {/* Activity Filter */}
          <AnimatedCard delay={500} style={styles.filterContainer}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Recent Activity</Text>
              <Filter size={16} color="#6b7280" />
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroll}
            >
              {activityFilters.map((filter) => (
                <TouchableOpacity
                  key={filter.value}
                  style={[
                    styles.filterButton,
                    activityFilter === filter.value && styles.filterButtonActive,
                  ]}
                  onPress={() => setActivityFilter(filter.value)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      activityFilter === filter.value && styles.filterButtonTextActive,
                    ]}
                  >
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </AnimatedCard>

          {/* Activity List */}
          <AnimatedCard delay={600} style={styles.section}>
            <View style={styles.activityList}>
              {filteredActivity.map((activity, index) => {
                const IconComponent = getActivityIcon(activity.type);
                const iconColor = getActivityColor(activity.type);
                const amount = formatAmount(activity.amount || 0, activity.type);
                
                return (
                  <View key={activity.id} style={styles.activityItem}>
                    <View style={[styles.activityIcon, { backgroundColor: `${iconColor}20` }]}>
                      <IconComponent size={16} color={iconColor} />
                    </View>
                    
                    <View style={styles.activityContent}>
                      <Text style={styles.activityTitle}>{activity.title}</Text>
                      <View style={styles.activityMeta}>
                        <Text style={styles.activityTime}>{activity.timestamp}</Text>
                        {activity.status && (
                          <>
                            <Text style={styles.activityDot}>•</Text>
                            <Text style={[
                              styles.activityStatus,
                              { color: activity.status === 'won' ? '#16a34a' : 
                                       activity.status === 'outbid' ? '#ef4444' : '#6b7280' }
                            ]}>
                              {activity.status}
                            </Text>
                          </>
                        )}
                      </View>
                    </View>
                    
                    {amount && (
                      <View style={styles.activityAmount}>
                        <Text style={[
                          styles.amountText,
                          { color: activity.type === 'earned' || activity.type === 'purchased' ? '#16a34a' : iconColor }
                        ]}>
                          {amount}
                        </Text>
                        {(activity.type === 'bid' || activity.type === 'won' || activity.type === 'outbid' || 
                          activity.type === 'earned' || activity.type === 'purchased') && (
                          <Text style={styles.amountLabel}>Connects</Text>
                        )}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </AnimatedCard>

          {/* Insights */}
          <AnimatedCard delay={700} style={styles.section}>
            <Text style={styles.sectionTitle}>Insights</Text>
            <View style={styles.insightsList}>
              <View style={styles.insightItem}>
                <Calendar size={16} color="#1e40af" />
                <Text style={styles.insightText}>
                  Your most active day is <Text style={styles.insightHighlight}>{activityStats.mostActiveDay}</Text>
                </Text>
              </View>
              
              <View style={styles.insightItem}>
                <Package size={16} color="#16a34a" />
                <Text style={styles.insightText}>
                  You prefer <Text style={styles.insightHighlight}>{activityStats.favoriteCategory}</Text> items
                </Text>
              </View>
              
              <View style={styles.insightItem}>
                <TrendingUp size={16} color="#f59e0b" />
                <Text style={styles.insightText}>
                  Your average bid is <Text style={styles.insightHighlight}>{activityStats.averageBid} Connects</Text>
                </Text>
              </View>
              
              <View style={styles.insightItem}>
                <Award size={16} color="#7c3aed" />
                <Text style={styles.insightText}>
                  You have a <Text style={styles.insightHighlight}>{activityStats.winRate}% win rate</Text>
                </Text>
              </View>
            </View>
          </AnimatedCard>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
  exportButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  timeRangeContainer: {
    marginTop: 20,
    marginBottom: 16,
  },
  timeRangeSelector: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 4,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  timeRangeButtonActive: {
    backgroundColor: '#1e40af',
  },
  timeRangeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  timeRangeTextActive: {
    color: '#ffffff',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginBottom: 4,
    textAlign: 'center',
  },
  statChange: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#16a34a',
  },
  chartContainer: {
    marginTop: 16,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
    paddingHorizontal: 8,
  },
  chartDay: {
    alignItems: 'center',
    flex: 1,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    marginBottom: 8,
  },
  chartBar: {
    width: 6,
    borderRadius: 3,
    minHeight: 4,
  },
  chartLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  categoryList: {
    gap: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  categoryProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    width: 80,
    height: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  categoryPercentage: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6b7280',
    minWidth: 30,
    textAlign: 'right',
  },
  filterContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#1e40af',
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginBottom: 4,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  activityDot: {
    fontSize: 12,
    color: '#d1d5db',
    marginHorizontal: 6,
  },
  activityStatus: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'capitalize',
  },
  activityAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  amountLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  insightsList: {
    gap: 16,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginLeft: 12,
    flex: 1,
  },
  insightHighlight: {
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
});