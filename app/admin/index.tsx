import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Users,
  Package,
  TrendingUp,
  DollarSign,
  Eye,
  Settings,
  Plus,
  Activity,
  Award,
  Clock,
  AlertTriangle,
  ChevronRight,
  BarChart3,
  ShoppingBag,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/hooks/useAuth';
import AnimatedCard from '@/components/AnimatedCard';

const { width } = Dimensions.get('window');

interface DashboardStats {
  totalUsers: number;
  activeAuctions: number;
  totalBids: number;
  revenue: number;
  todayUsers: number;
  todayBids: number;
  todayRevenue: number;
  pendingApprovals: number;
}

interface RecentActivity {
  id: string;
  type: 'bid' | 'user_joined' | 'auction_ended' | 'purchase';
  description: string;
  timestamp: Date;
  amount?: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 1247,
    activeAuctions: 23,
    totalBids: 5689,
    revenue: 12450,
    todayUsers: 34,
    todayBids: 156,
    todayRevenue: 890,
    pendingApprovals: 7,
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'bid',
      description: 'High bid placed on Vintage Rolex Submariner',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      amount: 15750,
    },
    {
      id: '2',
      type: 'user_joined',
      description: 'New user registered: john.doe@example.com',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
    },
    {
      id: '3',
      type: 'auction_ended',
      description: 'Auction ended: Limited Edition Hermès Birkin',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      amount: 28900,
    },
    {
      id: '4',
      type: 'purchase',
      description: 'Connects purchased: Premium Pack',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      amount: 1999,
    },
  ]);

  if (!user?.isAdmin) {
    return null;
  }

  const StatCard = ({ title, value, change, icon: Icon, color, onPress }: any) => (
    <TouchableOpacity style={styles.statCard} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient colors={color} style={styles.statGradient}>
        <View style={styles.statHeader}>
          <Icon size={24} color="#FFFFFF" />
          <Text style={styles.statValue}>{value}</Text>
        </View>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statChange}>+{change} today</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const QuickActionCard = ({ title, description, icon: Icon, color, onPress }: any) => (
    <TouchableOpacity style={styles.actionCard} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.actionIcon, { backgroundColor: color }]}>
        <Icon size={20} color="#FFFFFF" />
      </View>
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionDescription}>{description}</Text>
      </View>
      <ChevronRight size={16} color="#9CA3AF" />
    </TouchableOpacity>
  );

  const ActivityItem = ({ item }: { item: RecentActivity }) => {
    const getActivityIcon = () => {
      switch (item.type) {
        case 'bid': return TrendingUp;
        case 'user_joined': return Users;
        case 'auction_ended': return Clock;
        case 'purchase': return DollarSign;
        default: return Activity;
      }
    };

    const getActivityColor = () => {
      switch (item.type) {
        case 'bid': return '#FF7F00';
        case 'user_joined': return '#16A34A';
        case 'auction_ended': return '#EF4444';
        case 'purchase': return '#0EA5E9';
        default: return '#6B7280';
      }
    };

    const Icon = getActivityIcon();
    const color = getActivityColor();

    return (
      <View style={styles.activityItem}>
        <View style={[styles.activityIcon, { backgroundColor: color }]}>
          <Icon size={14} color="#FFFFFF" />
        </View>
        <View style={styles.activityContent}>
          <Text style={styles.activityDescription}>{item.description}</Text>
          <Text style={styles.activityTime}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        {item.amount && (
          <Text style={styles.activityAmount}>
            {item.amount.toLocaleString()} {item.type === 'purchase' ? 'Connects' : 'Connects'}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>Welcome back, {user.name}</Text>
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push('/admin/settings')}
        >
          <Settings size={24} color="#1A2B42" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            change={stats.todayUsers}
            icon={Users}
            color={['#16A34A', '#15803D']}
            onPress={() => router.push('/admin/users')}
          />
          <StatCard
            title="Active Auctions"
            value={stats.activeAuctions}
            change="3"
            icon={Package}
            color={['#FF7F00', '#FF6B35']}
            onPress={() => router.push('/admin/products')}
          />
          <StatCard
            title="Total Bids"
            value={stats.totalBids.toLocaleString()}
            change={stats.todayBids}
            icon={TrendingUp}
            color={['#0EA5E9', '#0284C7']}
            onPress={() => router.push('/admin/analytics')}
          />
          <StatCard
            title="Revenue"
            value={`$${stats.revenue.toLocaleString()}`}
            change={`$${stats.todayRevenue}`}
            icon={DollarSign}
            color={['#8B5CF6', '#7C3AED']}
            onPress={() => router.push('/admin/analytics')}
          />
        </View>

        {/* Alerts */}
        {stats.pendingApprovals > 0 && (
          <AnimatedCard delay={200} style={styles.alertCard}>
            <View style={styles.alertContent}>
              <AlertTriangle size={20} color="#F59E0B" />
              <Text style={styles.alertText}>
                {stats.pendingApprovals} items pending approval
              </Text>
              <TouchableOpacity style={styles.alertButton}>
                <Text style={styles.alertButtonText}>Review</Text>
              </TouchableOpacity>
            </View>
          </AnimatedCard>
        )}

        {/* Quick Actions */}
        <AnimatedCard delay={300} style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <QuickActionCard
              title="Add Product"
              description="Create new auction item"
              icon={Plus}
              color="#16A34A"
              onPress={() => router.push('/admin/products?action=create')}
            />
            <QuickActionCard
              title="View Analytics"
              description="Platform performance"
              icon={BarChart3}
              color="#0EA5E9"
              onPress={() => router.push('/admin/analytics')}
            />
            <QuickActionCard
              title="Manage Users"
              description="User administration"
              icon={Users}
              color="#8B5CF6"
              onPress={() => router.push('/admin/users')}
            />
            <QuickActionCard
              title="Platform Settings"
              description="Configure platform"
              icon={Settings}
              color="#6B7280"
              onPress={() => router.push('/admin/settings')}
            />
          </View>
        </AnimatedCard>

        {/* Recent Activity */}
        <AnimatedCard delay={400} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activityList}>
            {recentActivity.map((item) => (
              <ActivityItem key={item.id} item={item} />
            ))}
          </View>
        </AnimatedCard>

        {/* Performance Overview */}
        <AnimatedCard delay={500} style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Overview</Text>
          <View style={styles.performanceGrid}>
            <View style={styles.performanceCard}>
              <Eye size={16} color="#6B7280" />
              <Text style={styles.performanceValue}>2.4k</Text>
              <Text style={styles.performanceLabel}>Page Views</Text>
            </View>
            <View style={styles.performanceCard}>
              <Activity size={16} color="#6B7280" />
              <Text style={styles.performanceValue}>89%</Text>
              <Text style={styles.performanceLabel}>Engagement</Text>
            </View>
            <View style={styles.performanceCard}>
              <Award size={16} color="#6B7280" />
              <Text style={styles.performanceValue}>94%</Text>
              <Text style={styles.performanceLabel}>Satisfaction</Text>
            </View>
            <View style={styles.performanceCard}>
              <ShoppingBag size={16} color="#6B7280" />
              <Text style={styles.performanceValue}>67%</Text>
              <Text style={styles.performanceLabel}>Conversion</Text>
            </View>
          </View>
        </AnimatedCard>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1A2B42',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  statCard: {
    width: (width - 52) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  statGradient: {
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  statTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  alertCard: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#92400E',
    marginLeft: 12,
  },
  alertButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  alertButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1A2B42',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FF7F00',
  },
  actionsGrid: {
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1A2B42',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activityIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1A2B42',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  activityAmount: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
  },
  performanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  performanceCard: {
    width: (width - 84) / 2,
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  performanceValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1A2B42',
    marginTop: 8,
    marginBottom: 4,
  },
  performanceLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  bottomPadding: {
    height: 20,
  },
});