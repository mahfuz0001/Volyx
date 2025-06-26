import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Package,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react-native';
import AnimatedCard from '@/components/AnimatedCard';
import GradientBackground from '@/components/GradientBackground';
import LoadingSpinner from '@/components/LoadingSpinner';

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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  const [data, setData] = useState<AnalyticsData | null>(null);

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

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock data - replace with real API call
      const mockData: AnalyticsData = {
        overview: {
          totalUsers: 12847,
          activeUsers: 3421,
          totalRevenue: 45678.90,
          totalAuctions: 234,
          totalBids: 8765,
          conversionRate: 12.5,
        },
        userMetrics: {
          newUsers: 456,
          returningUsers: 2965,
          averageSessionTime: 8.5,
          bounceRate: 23.4,
        },
        auctionMetrics: {
          averageBidsPerAuction: 37.4,
          averageWinningBid: 1250,
          completionRate: 89.2,
          hotAuctionPerformance: 156.7,
        },
        revenueMetrics: {
          connectsSold: 125000,
          averageOrderValue: 8.45,
          monthlyRecurringRevenue: 15678,
          lifetimeValue: 67.89,
        },
        topAuctions: [
          { id: '1', title: 'Vintage Camera Collection', bids: 89, revenue: 2340, views: 1567 },
          { id: '2', title: 'Limited Edition Sneakers', bids: 76, revenue: 1890, views: 1234 },
          { id: '3', title: 'Rare Comic Books', bids: 65, revenue: 1567, views: 987 },
          { id: '4', title: 'Artisan Coffee Set', bids: 54, revenue: 1234, views: 876 },
          { id: '5', title: 'Professional Headphones', bids: 43, revenue: 987, views: 654 },
        ],
        userEngagement: [
          { date: '2024-01-01', activeUsers: 1234, sessions: 2345, avgSessionTime: 8.5 },
          { date: '2024-01-02', activeUsers: 1456, sessions: 2567, avgSessionTime: 9.2 },
          { date: '2024-01-03', activeUsers: 1678, sessions: 2789, avgSessionTime: 7.8 },
          { date: '2024-01-04', activeUsers: 1890, sessions: 3012, avgSessionTime: 8.9 },
          { date: '2024-01-05', activeUsers: 2012, sessions: 3234, avgSessionTime: 9.5 },
        ],
      };

      setData(mockData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
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

  if (loading) {
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
                <Package size={24} color="#ef4444" />
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
                <Text style={styles.auctionMetricValue}>{data?.auctionMetrics.averageBidsPerAuction}</Text>
                <Text style={styles.auctionMetricLabel}>Avg Bids/Auction</Text>
              </View>
              <View style={styles.auctionMetricCard}>
                <TrendingUp size={20} color="#16a34a" />
                <Text style={styles.auctionMetricValue}>{data?.auctionMetrics.averageWinningBid}</Text>
                <Text style={styles.auctionMetricLabel}>Avg Winning Bid</Text>
              </View>
              <View style={styles.auctionMetricCard}>
                <PieChart size={20} color="#f59e0b" />
                <Text style={styles.auctionMetricValue}>{data?.auctionMetrics.completionRate}%</Text>
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
                <Text style={styles.revenueValue}>${data?.revenueMetrics.averageOrderValue}</Text>
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
});