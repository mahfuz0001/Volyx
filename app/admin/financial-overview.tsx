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
import { ChevronLeft, DollarSign, TrendingUp, TrendingDown, Coins, CreditCard, ChartPie as PieChart, ChartBar as BarChart3, Download, RefreshCw, Calendar, ListFilter as Filter, ArrowUpRight, ArrowDownRight, Users, Package, Eye, Target } from 'lucide-react-native';
import AnimatedCard from '@/components/AnimatedCard';
import GradientBackground from '@/components/GradientBackground';
import LoadingSpinner from '@/components/LoadingSpinner';

const { width } = Dimensions.get('window');

interface FinancialMetric {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: any;
  color: string;
}

interface RevenueData {
  period: string;
  revenue: number;
  connects: number;
  transactions: number;
}

interface TopProduct {
  id: string;
  name: string;
  revenue: number;
  bids: number;
  conversionRate: number;
}

export default function FinancialOverviewScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [metrics, setMetrics] = useState<FinancialMetric[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);

  const timeRanges = [
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: '90D', value: '90d' },
    { label: '1Y', value: '1y' },
  ];

  useEffect(() => {
    fetchFinancialData();
  }, [timeRange]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock financial metrics
      const mockMetrics: FinancialMetric[] = [
        {
          title: 'Total Revenue',
          value: '$45,678.90',
          change: '+12.5%',
          changeType: 'positive',
          icon: DollarSign,
          color: '#16a34a',
        },
        {
          title: 'Connects Sold',
          value: '125,000',
          change: '+8.3%',
          changeType: 'positive',
          icon: Coins,
          color: '#f59e0b',
        },
        {
          title: 'Avg Order Value',
          value: '$8.45',
          change: '+15.7%',
          changeType: 'positive',
          icon: CreditCard,
          color: '#3b82f6',
        },
        {
          title: 'Conversion Rate',
          value: '12.5%',
          change: '-2.1%',
          changeType: 'negative',
          icon: Target,
          color: '#ef4444',
        },
        {
          title: 'Active Bidders',
          value: '3,421',
          change: '+18.9%',
          changeType: 'positive',
          icon: Users,
          color: '#7c3aed',
        },
        {
          title: 'Auction Revenue',
          value: '$32,145',
          change: '+22.4%',
          changeType: 'positive',
          icon: Package,
          color: '#059669',
        },
      ];

      // Mock revenue data
      const mockRevenueData: RevenueData[] = [
        { period: 'Week 1', revenue: 8500, connects: 25000, transactions: 156 },
        { period: 'Week 2', revenue: 12300, connects: 32000, transactions: 203 },
        { period: 'Week 3', revenue: 9800, connects: 28000, transactions: 178 },
        { period: 'Week 4', revenue: 15100, connects: 40000, transactions: 245 },
      ];

      // Mock top products
      const mockTopProducts: TopProduct[] = [
        {
          id: '1',
          name: 'Vintage Camera Collection',
          revenue: 2340,
          bids: 89,
          conversionRate: 15.7,
        },
        {
          id: '2',
          name: 'Limited Edition Sneakers',
          revenue: 1890,
          bids: 76,
          conversionRate: 12.3,
        },
        {
          id: '3',
          name: 'Rare Comic Books',
          revenue: 1567,
          bids: 65,
          conversionRate: 18.9,
        },
        {
          id: '4',
          name: 'Artisan Coffee Set',
          revenue: 1234,
          bids: 54,
          conversionRate: 9.8,
        },
        {
          id: '5',
          name: 'Professional Headphones',
          revenue: 987,
          bids: 43,
          conversionRate: 14.2,
        },
      ];

      setMetrics(mockMetrics);
      setRevenueData(mockRevenueData);
      setTopProducts(mockTopProducts);
    } catch (error) {
      console.error('Failed to fetch financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    // Implement export functionality
    console.log('Exporting financial report...');
  };

  if (loading) {
    return (
      <GradientBackground colors={['#f8fafc', '#e2e8f0']}>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <LoadingSpinner size={48} />
            <Text style={styles.loadingText}>Loading financial data...</Text>
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
          <Text style={styles.headerTitle}>Financial Overview</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerAction} onPress={handleExportReport}>
              <Download size={20} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerAction} onPress={fetchFinancialData}>
              <RefreshCw size={20} color="#6b7280" />
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

          {/* Key Metrics */}
          <AnimatedCard delay={200} style={styles.section}>
            <Text style={styles.sectionTitle}>Key Financial Metrics</Text>
            <View style={styles.metricsGrid}>
              {metrics.map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <AnimatedCard key={metric.title} delay={300 + index * 50} style={styles.metricCard}>
                    <View style={styles.metricHeader}>
                      <View style={[styles.metricIcon, { backgroundColor: metric.color }]}>
                        <IconComponent size={20} color="#ffffff" />
                      </View>
                      <View style={styles.metricChange}>
                        {metric.changeType === 'positive' ? (
                          <ArrowUpRight size={16} color="#16a34a" />
                        ) : metric.changeType === 'negative' ? (
                          <ArrowDownRight size={16} color="#ef4444" />
                        ) : null}
                        <Text style={[
                          styles.metricChangeText,
                          { color: metric.changeType === 'positive' ? '#16a34a' : metric.changeType === 'negative' ? '#ef4444' : '#6b7280' }
                        ]}>
                          {metric.change}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.metricValue}>{metric.value}</Text>
                    <Text style={styles.metricTitle}>{metric.title}</Text>
                  </AnimatedCard>
                );
              })}
            </View>
          </AnimatedCard>

          {/* Revenue Chart */}
          <AnimatedCard delay={400} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Revenue Trends</Text>
              <TouchableOpacity style={styles.chartTypeButton}>
                <BarChart3 size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.chartContainer}>
              <View style={styles.chartLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#1e40af' }]} />
                  <Text style={styles.legendText}>Revenue</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#f59e0b' }]} />
                  <Text style={styles.legendText}>Connects</Text>
                </View>
              </View>
              
              <View style={styles.chart}>
                {revenueData.map((data, index) => {
                  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
                  const maxConnects = Math.max(...revenueData.map(d => d.connects));
                  const revenueHeight = (data.revenue / maxRevenue) * 120;
                  const connectsHeight = (data.connects / maxConnects) * 120;
                  
                  return (
                    <View key={index} style={styles.chartBar}>
                      <View style={styles.barContainer}>
                        <View style={[styles.bar, styles.revenueBar, { height: revenueHeight }]} />
                        <View style={[styles.bar, styles.connectsBar, { height: connectsHeight }]} />
                      </View>
                      <Text style={styles.chartLabel}>{data.period}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </AnimatedCard>

          {/* Revenue Breakdown */}
          <AnimatedCard delay={500} style={styles.section}>
            <Text style={styles.sectionTitle}>Revenue Breakdown</Text>
            <View style={styles.revenueBreakdown}>
              <View style={styles.breakdownItem}>
                <View style={styles.breakdownHeader}>
                  <View style={[styles.breakdownIcon, { backgroundColor: '#1e40af' }]}>
                    <Package size={16} color="#ffffff" />
                  </View>
                  <Text style={styles.breakdownTitle}>Auction Sales</Text>
                </View>
                <Text style={styles.breakdownValue}>$32,145</Text>
                <Text style={styles.breakdownPercentage}>70.3% of total</Text>
              </View>
              
              <View style={styles.breakdownItem}>
                <View style={styles.breakdownHeader}>
                  <View style={[styles.breakdownIcon, { backgroundColor: '#f59e0b' }]}>
                    <Coins size={16} color="#ffffff" />
                  </View>
                  <Text style={styles.breakdownTitle}>Connects Sales</Text>
                </View>
                <Text style={styles.breakdownValue}>$13,534</Text>
                <Text style={styles.breakdownPercentage}>29.7% of total</Text>
              </View>
            </View>
          </AnimatedCard>

          {/* Top Performing Products */}
          <AnimatedCard delay={600} style={styles.section}>
            <Text style={styles.sectionTitle}>Top Performing Auctions</Text>
            <View style={styles.topProductsList}>
              {topProducts.map((product, index) => (
                <AnimatedCard key={product.id} delay={700 + index * 50} style={styles.productCard}>
                  <View style={styles.productRank}>
                    <Text style={styles.productRankText}>{index + 1}</Text>
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <View style={styles.productStats}>
                      <Text style={styles.productStat}>${product.revenue}</Text>
                      <Text style={styles.productStat}>•</Text>
                      <Text style={styles.productStat}>{product.bids} bids</Text>
                      <Text style={styles.productStat}>•</Text>
                      <Text style={styles.productStat}>{product.conversionRate}% conv.</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.productViewButton}>
                    <Eye size={16} color="#6b7280" />
                  </TouchableOpacity>
                </AnimatedCard>
              ))}
            </View>
          </AnimatedCard>

          {/* Financial Summary */}
          <AnimatedCard delay={800} style={styles.section}>
            <Text style={styles.sectionTitle}>Financial Summary</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Gross Revenue</Text>
                <Text style={styles.summaryValue}>$45,678.90</Text>
                <Text style={styles.summarySubtext}>Before fees & taxes</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Net Revenue</Text>
                <Text style={styles.summaryValue}>$41,111.01</Text>
                <Text style={styles.summarySubtext}>After processing fees</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Processing Fees</Text>
                <Text style={styles.summaryValue}>$4,567.89</Text>
                <Text style={styles.summarySubtext}>Payment processing</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Projected Monthly</Text>
                <Text style={styles.summaryValue}>$137,037</Text>
                <Text style={styles.summarySubtext}>Based on current trend</Text>
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
  headerAction: {
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
  chartTypeButton: {
    padding: 8,
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
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  metricChangeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  metricValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
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
    gap: 8,
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
    height: 140,
    paddingHorizontal: 16,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    marginBottom: 8,
  },
  bar: {
    width: 12,
    borderRadius: 6,
  },
  revenueBar: {
    backgroundColor: '#1e40af',
  },
  connectsBar: {
    backgroundColor: '#f59e0b',
  },
  chartLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    textAlign: 'center',
  },
  revenueBreakdown: {
    gap: 16,
  },
  breakdownItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  breakdownTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  breakdownValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  breakdownPercentage: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  topProductsList: {
    gap: 12,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
  },
  productRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1e40af',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productRankText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  productStats: {
    flexDirection: 'row',
    gap: 8,
  },
  productStat: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  productViewButton: {
    padding: 8,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  summaryCard: {
    width: '48%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    textAlign: 'center',
  },
});