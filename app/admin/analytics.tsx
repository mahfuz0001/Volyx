import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, TrendingUp, Users, DollarSign, Package, Calendar, Download, ListFilter as Filter, RefreshCw, ChartBar as BarChart3, ChartPie as PieChart, Activity, Target, Award, Package as PackageIcon } from 'lucide-react-native';
import AnimatedCard from '@/components/AnimatedCard';
import GradientBackground from '@/components/GradientBackground';
import LoadingSpinner from '@/components/LoadingSpinner';
import { analyticsAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

const { width } = Dimensions.get('window');

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalRevenue: number;
    totalAuctions: number;
    totalBids: number;
    conversionRate: number;
  };
  userMetrics: {
    newUsers: number;
    returningUsers: number;
    averageSessionTime: number;
    bounceRate: number;
  };
  auctionMetrics: {
    averageBidsPerAuction: number;
    averageWinningBid: number;
    completionRate: number;
    hotAuctionPerformance: number;
  };
  revenueMetrics: {
    connectsSold: number;
    averageOrderValue: number;
    monthlyRecurringRevenue: number;
    lifetimeValue: number;
  };
  topAuctions: Array<{
    id: string;
    title: string;
    bids: number;
    revenue: number;
    views: number;
  }>;
  userEngagement: Array<{
    date: string;
    activeUsers: number;
    sessions: number;
    avgSessionTime: number;
  }>;
}

export default function AnalyticsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const timeRanges = [
    { label: '24H', value: '1d' },
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: '90D', value: '90d' },
  ];

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async (isRefresh = false) => {
    try {
      setLoading(!isRefresh);
      setRefreshing(isRefresh);
      setError(null);

      // Fetch dashboard stats from API
      const dashboardStats = await analyticsAPI.getDashboardStats();
      const auctionPerformance = await analyticsAPI.getAuctionPerformance();
      const userStats = await analyticsAPI.getUserStats();
      const financialStats = await analyticsAPI.getFinancialStats();
      
      // Calculate derived metrics
      const totalAuctions = auctionPerformance.length;
      const totalBids = auctionPerformance.reduce((sum, auction) => sum + auction.bidCount, 0);
      const conversionRate = totalBids > 0 ? (userStats.topBidders.reduce((sum, user) => sum + user.wonCount, 0) / totalBids) * 100 : 0;
      
      // Calculate average bids per auction
      const averageBidsPerAuction = totalAuctions > 0 ? totalBids / totalAuctions : 0;
      
      // Calculate average winning bid
      const completedAuctions = auctionPerformance.filter(auction => new Date(auction.endTime) < new Date());
      const averageWinningBid = completedAuctions.length > 0 
        ? completedAuctions.reduce((sum, auction) => sum + auction.currentBid, 0) / completedAuctions.length 
        : 0;
      
      // Calculate completion rate
      const completionRate = totalAuctions > 0 ? (completedAuctions.length / totalAuctions) * 100 : 0;
      
      // Calculate hot auction performance
      const hotAuctions = auctionPerformance.filter(auction => auction.isHot);
      const hotAuctionPerformance = hotAuctions.length > 0 
        ? hotAuctions.reduce((sum, auction) => sum + auction.bidCount, 0) / hotAuctions.length 
        : 0;
      
      // Top auctions by bids
      const topAuctions = auctionPerformance
        .sort((a, b) => b.bidCount - a.bidCount)
        .slice(0, 5)
        .map(auction => ({
          id: auction.id,
          title: auction.title,
          bids: auction.bidCount,
          revenue: auction.currentBid,
          views: Math.floor(Math.random() * 1000) + 500, // Mock data for views
        }));
      
      // Mock user engagement data
      const userEngagement = Array.from({ length: 5 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return {
          date: date.toISOString().split('T')[0],
          activeUsers: Math.floor(Math.random() * 1000) + 1000,
          sessions: Math.floor(Math.random() * 2000) + 2000,
          avgSessionTime: Math.random() * 5 + 5,
        };
      }).reverse();

      // Construct analytics data
      const analyticsData: AnalyticsData = {
        overview: {
          totalUsers: dashboardStats.totalUsers,
          activeUsers: userStats.activeUsers,
          totalRevenue: dashboardStats.revenue,
          totalAuctions: dashboardStats.activeAuctions,
          totalBids: dashboardStats.totalBids,
          conversionRate,
        },
        userMetrics: {
          newUsers: userStats.newUsers,
          returningUsers: userStats.activeUsers - userStats.newUsers,
          averageSessionTime: 8.5, // Mock data
          bounceRate: 23.4, // Mock data
        },
        auctionMetrics: {
          averageBidsPerAuction,
          averageWinningBid,
          completionRate,
          hotAuctionPerformance,
        },
        revenueMetrics: {
          connectsSold: financialStats.connectsSold,
          averageOrderValue: financialStats.avgOrderValue,
          monthlyRecurringRevenue: financialStats.totalRevenue,
          lifetimeValue: 67.89, // Mock data
        },
        topAuctions,
        userEngagement,
      };

      setData(analyticsData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchAnalytics(true);
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting analytics data...');
  };

  if (loading && !data) {
    return (
      <GradientBackground colors={['#f8fafc', '#e2e8f0']}>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <LoadingSpinner size={48} />
            <Text style={styles.loadingText}>Loading analytics...</Text>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  if (error) {
    return (
      <GradientBackground colors={['#f8fafc', '#e2e8f0']}>
        <SafeAreaView style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => fetchAnalytics()}>
              <RefreshCw size={16} color="#ffffff" />
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

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
          <Text style={styles.headerTitle}>Analytics Dashboard</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleRefresh}>
              <RefreshCw size={20} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleExport}>
              <Download size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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

          {/* Overview Metrics */}
          <AnimatedCard delay={200} style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Users size={24} color="#3b82f6" />
                <Text style={styles.metricValue}>{data?.overview.totalUsers.toLocaleString()}</Text>
                <Text style={styles.metricLabel}>Total Users</Text>
                <Text style={styles.metricChange}>+12.5%</Text>
              </View>
              <View style={styles.metricCard}>
                <Activity size={24} color="#10b981" />
                <Text style={styles.metricValue}>{data?.overview.activeUsers.toLocaleString()}</Text>
                <Text style={styles.metricLabel}>Active Users</Text>
                <Text style={styles.metricChange}>+8.3%</Text>
              </View>
              <View style={styles.metricCard}>
                <DollarSign size={24} color="#f59e0b" />
                <Text style={styles.metricValue}>${data?.overview.totalRevenue.toLocaleString()}</Text>
                <Text style={styles.metricLabel}>Revenue</Text>
                <Text style={styles.metricChange}>+15.7%</Text>
              </View>
              <View style={styles.metricCard}>
                <PackageIcon size={24} color="#ef4444" />
                <Text style={styles.metricValue}>{data?.overview.totalAuctions}</Text>
                <Text style={styles.metricLabel}>Auctions</Text>
                <Text style={styles.metricChange}>+5.2%</Text>
              </View>
            </View>
          </AnimatedCard>

          {/* User Metrics */}
          <AnimatedCard delay={300} style={styles.section}>
            <Text style={styles.sectionTitle}>User Engagement</Text>
            <View style={styles.userMetricsContainer}>
              <View style={styles.userMetricRow}>
                <Text style={styles.userMetricLabel}>New Users</Text>
                <Text style={styles.userMetricValue}>{data?.userMetrics.newUsers}</Text>
              </View>
              <View style={styles.userMetricRow}>
                <Text style={styles.userMetricLabel}>Returning Users</Text>
                <Text style={styles.userMetricValue}>{data?.userMetrics.returningUsers.toLocaleString()}</Text>
              </View>
              <View style={styles.userMetricRow}>
                <Text style={styles.userMetricLabel}>Avg Session Time</Text>
                <Text style={styles.userMetricValue}>{data?.userMetrics.averageSessionTime}m</Text>
              </View>
              <View style={styles.userMetricRow}>
                <Text style={styles.userMetricLabel}>Bounce Rate</Text>
                <Text style={styles.userMetricValue}>{data?.userMetrics.bounceRate}%</Text>
              </View>
            </View>
          </AnimatedCard>

          {/* Auction Performance */}
          <AnimatedCard delay={400} style={styles.section}>
            <Text style={styles.sectionTitle}>Auction Performance</Text>
            <View style={styles.auctionMetricsContainer}>
              <View style={styles.auctionMetricCard}>
                <BarChart3 size={20} color="#1e40af" />
                <Text style={styles.auctionMetricValue}>{data?.auctionMetrics.averageBidsPerAuction.toFixed(1)}</Text>
                <Text style={styles.auctionMetricLabel}>Avg Bids/Auction</Text>
              </View>
              <View style={styles.auctionMetricCard}>
                <TrendingUp size={20} color="#16a34a" />
                <Text style={styles.auctionMetricValue}>{data?.auctionMetrics.averageWinningBid.toFixed(0)}</Text>
                <Text style={styles.auctionMetricLabel}>Avg Winning Bid</Text>
              </View>
              <View style={styles.auctionMetricCard}>
                <PieChart size={20} color="#f59e0b" />
                <Text style={styles.auctionMetricValue}>{data?.auctionMetrics.completionRate.toFixed(1)}%</Text>
                <Text style={styles.auctionMetricLabel}>Completion Rate</Text>
              </View>
            </View>
          </AnimatedCard>

          {/* Top Performing Auctions */}
          <AnimatedCard delay={500} style={styles.section}>
            <Text style={styles.sectionTitle}>Top Performing Auctions</Text>
            <View style={styles.topAuctionsList}>
              {data?.topAuctions.map((auction, index) => (
                <View key={auction.id} style={styles.topAuctionItem}>
                  <View style={styles.auctionRank}>
                    <Text style={styles.auctionRankText}>{index + 1}</Text>
                  </View>
                  <View style={styles.auctionInfo}>
                    <Text style={styles.auctionTitle}>{auction.title}</Text>
                    <View style={styles.auctionStats}>
                      <Text style={styles.auctionStat}>{auction.bids} bids</Text>
                      <Text style={styles.auctionStat}>•</Text>
                      <Text style={styles.auctionStat}>${auction.revenue}</Text>
                      <Text style={styles.auctionStat}>•</Text>
                      <Text style={styles.auctionStat}>{auction.views} views</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </AnimatedCard>

          {/* Revenue Breakdown */}
          <AnimatedCard delay={600} style={styles.section}>
            <Text style={styles.sectionTitle}>Revenue Metrics</Text>
            <View style={styles.revenueGrid}>
              <View style={styles.revenueCard}>
                <Text style={styles.revenueValue}>{data?.revenueMetrics.connectsSold.toLocaleString()}</Text>
                <Text style={styles.revenueLabel}>Connects Sold</Text>
              </View>
              <View style={styles.revenueCard}>
                <Text style={styles.revenueValue}>${data?.revenueMetrics.averageOrderValue.toFixed(2)}</Text>
                <Text style={styles.revenueLabel}>Avg Order Value</Text>
              </View>
              <View style={styles.revenueCard}>
                <Text style={styles.revenueValue}>${data?.revenueMetrics.monthlyRecurringRevenue.toLocaleString()}</Text>
                <Text style={styles.revenueLabel}>Monthly Revenue</Text>
              </View>
              <View style={styles.revenueCard}>
                <Text style={styles.revenueValue}>${data?.revenueMetrics.lifetimeValue}</Text>
                <Text style={styles.revenueLabel}>Customer LTV</Text>
              </View>
            </View>
          </AnimatedCard>
        </ScrollView>

        {refreshing && (
          <View style={styles.refreshingOverlay}>
            <ActivityIndicator size="large" color="#1e40af" />
          </View>
        )}
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ef4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e40af',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    marginLeft: 8,
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginBottom: 4,
  },
  metricChange: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#16a34a',
  },
  userMetricsContainer: {
    gap: 12,
  },
  userMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  userMetricLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  userMetricValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  auctionMetricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  auctionMetricCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  auctionMetricValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  auctionMetricLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    textAlign: 'center',
  },
  topAuctionsList: {
    gap: 12,
  },
  topAuctionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  auctionRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1e40af',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  auctionRankText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  auctionInfo: {
    flex: 1,
  },
  auctionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  auctionStats: {
    flexDirection: 'row',
    gap: 8,
  },
  auctionStat: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  revenueGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  revenueCard: {
    width: '48%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  revenueValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  revenueLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    textAlign: 'center',
  },
  refreshingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});