import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Users, ChartBar as BarChart3, Settings, Package, TrendingUp, DollarSign, Eye, LogOut, Bell, Shield, Activity, Database, Zap, TriangleAlert as AlertTriangle, FileText, CreditCard, Target, Globe, Lock, Coins, ChartPie as PieChart, Calendar, MessageSquare, Headphones } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import AnimatedCard from '@/components/AnimatedCard';
import GradientBackground from '@/components/GradientBackground';

export default function AdminDashboard() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/auth');
  };

  const adminStats = [
    { title: 'Total Users', value: '12,847', icon: Users, color: '#3b82f6', change: '+12.5%' },
    { title: 'Active Auctions', value: '234', icon: Package, color: '#10b981', change: '+8.3%' },
    { title: 'Revenue Today', value: '$15,678', icon: DollarSign, color: '#f59e0b', change: '+23.1%' },
    { title: 'Total Bids', value: '8,765', icon: TrendingUp, color: '#ef4444', change: '+15.7%' },
  ];

  const adminActions = [
    {
      title: 'User Management',
      subtitle: 'Manage users, roles, and permissions',
      icon: Users,
      route: '/admin/user-management',
      color: '#059669',
    },
    {
      title: 'Content Management',
      subtitle: 'Manage auctions, categories, and content',
      icon: FileText,
      route: '/admin/content-management',
      color: '#7c3aed',
    },
    {
      title: 'Financial Overview',
      subtitle: 'Revenue, transactions, and financial reports',
      icon: CreditCard,
      route: '/admin/financial-overview',
      color: '#dc2626',
    },
    {
      title: 'Add New Product',
      subtitle: 'Create a new auction item',
      icon: Plus,
      route: '/admin/add-product',
      color: '#1e40af',
    },
    {
      title: 'Analytics Dashboard',
      subtitle: 'View detailed analytics and reports',
      icon: BarChart3,
      route: '/admin/analytics',
      color: '#ea580c',
    },
    {
      title: 'Notification Center',
      subtitle: 'Manage push notifications and campaigns',
      icon: Bell,
      route: '/admin/notifications',
      color: '#0891b2',
    },
    {
      title: 'System Health',
      subtitle: 'Monitor system performance and uptime',
      icon: Activity,
      route: '/admin/system-health',
      color: '#65a30d',
    },
    {
      title: 'Security Center',
      subtitle: 'Security settings and threat monitoring',
      icon: Shield,
      route: '/admin/security',
      color: '#be123c',
    },
    {
      title: 'Database Management',
      subtitle: 'Manage database, backups, and migrations',
      icon: Database,
      route: '/admin/database',
      color: '#4338ca',
    },
    {
      title: 'View App',
      subtitle: 'Switch to user view',
      icon: Eye,
      route: '/(tabs)',
      color: '#9333ea',
    },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'user_registered',
      message: 'New user registered: john@example.com',
      time: '2 minutes ago',
      icon: Users,
      color: '#3b82f6',
    },
    {
      id: '2',
      type: 'auction_ended',
      message: 'Auction ended: Vintage Camera Collection',
      time: '15 minutes ago',
      icon: Package,
      color: '#10b981',
    },
    {
      id: '3',
      type: 'high_bid',
      message: 'High bid placed: $1,250 on Comic Collection',
      time: '1 hour ago',
      icon: TrendingUp,
      color: '#f59e0b',
    },
    {
      id: '4',
      type: 'system_alert',
      message: 'Memory usage reached 85% - monitoring',
      time: '2 hours ago',
      icon: AlertTriangle,
      color: '#ef4444',
    },
    {
      id: '5',
      type: 'payment_processed',
      message: 'Payment processed: $49.99 Connects purchase',
      time: '3 hours ago',
      icon: DollarSign,
      color: '#16a34a',
    },
  ];

  const systemAlerts = [
    {
      id: '1',
      type: 'warning',
      title: 'High Memory Usage',
      message: 'Server memory usage is at 85%. Consider scaling up.',
      time: '2 hours ago',
    },
    {
      id: '2',
      type: 'info',
      title: 'Scheduled Maintenance',
      message: 'Database maintenance scheduled for tonight at 2 AM UTC.',
      time: '1 day ago',
    },
  ];

  const quickStats = [
    {
      title: 'Revenue This Month',
      value: '$127,456',
      change: '+18.2%',
      icon: DollarSign,
      color: '#16a34a',
    },
    {
      title: 'New Users Today',
      value: '156',
      change: '+24.1%',
      icon: Users,
      color: '#3b82f6',
    },
    {
      title: 'Active Auctions',
      value: '89',
      change: '+5.7%',
      icon: Package,
      color: '#f59e0b',
    },
    {
      title: 'System Uptime',
      value: '99.9%',
      change: '+0.1%',
      icon: Activity,
      color: '#10b981',
    },
  ];

  return (
    <GradientBackground colors={['#f8fafc', '#e2e8f0']}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Admin Dashboard</Text>
            <Text style={styles.headerSubtitle}>Manage your Volyx platform</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Quick Stats */}
          <View style={styles.quickStatsGrid}>
            {quickStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <AnimatedCard key={stat.title} delay={index * 100} style={styles.quickStatCard}>
                  <View style={[styles.quickStatIcon, { backgroundColor: stat.color }]}>
                    <IconComponent size={20} color="#ffffff" />
                  </View>
                  <Text style={styles.quickStatValue}>{stat.value}</Text>
                  <Text style={styles.quickStatTitle}>{stat.title}</Text>
                  <Text style={[styles.quickStatChange, { color: stat.color }]}>
                    {stat.change}
                  </Text>
                </AnimatedCard>
              );
            })}
          </View>

          {/* Main Stats Grid */}
          <View style={styles.statsGrid}>
            {adminStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <AnimatedCard key={stat.title} delay={400 + index * 100} style={styles.statCard}>
                  <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                    <IconComponent size={24} color="#ffffff" />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statTitle}>{stat.title}</Text>
                  <Text style={[styles.statChange, { color: stat.color }]}>
                    {stat.change}
                  </Text>
                </AnimatedCard>
              );
            })}
          </View>

          {/* System Alerts */}
          {systemAlerts.length > 0 && (
            <AnimatedCard delay={800} style={styles.section}>
              <Text style={styles.sectionTitle}>System Alerts</Text>
              <View style={styles.alertsList}>
                {systemAlerts.map((alert) => (
                  <View key={alert.id} style={styles.alertItem}>
                    <View style={[
                      styles.alertIndicator,
                      { backgroundColor: alert.type === 'warning' ? '#f59e0b' : '#3b82f6' }
                    ]} />
                    <View style={styles.alertContent}>
                      <Text style={styles.alertTitle}>{alert.title}</Text>
                      <Text style={styles.alertMessage}>{alert.message}</Text>
                      <Text style={styles.alertTime}>{alert.time}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </AnimatedCard>
          )}

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Management Tools</Text>
            <View style={styles.actionsGrid}>
              {adminActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <AnimatedCard key={action.title} delay={900 + index * 100}>
                    <TouchableOpacity
                      style={styles.actionCard}
                      onPress={() => router.push(action.route as any)}
                    >
                      <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                        <IconComponent size={28} color="#ffffff" />
                      </View>
                      <Text style={styles.actionTitle}>{action.title}</Text>
                      <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                    </TouchableOpacity>
                  </AnimatedCard>
                );
              })}
            </View>
          </View>

          {/* Recent Activity */}
          <AnimatedCard delay={1200} style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityList}>
              {recentActivity.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <View key={activity.id} style={styles.activityItem}>
                    <View style={[styles.activityIcon, { backgroundColor: activity.color }]}>
                      <IconComponent size={16} color="#ffffff" />
                    </View>
                    <View style={styles.activityContent}>
                      <Text style={styles.activityText}>{activity.message}</Text>
                      <Text style={styles.activityTime}>{activity.time}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </AnimatedCard>

          {/* Performance Overview */}
          <AnimatedCard delay={1300} style={styles.section}>
            <Text style={styles.sectionTitle}>Performance Overview</Text>
            <View style={styles.performanceGrid}>
              <View style={styles.performanceCard}>
                <Zap size={20} color="#f59e0b" />
                <Text style={styles.performanceValue}>145ms</Text>
                <Text style={styles.performanceLabel}>Avg Response Time</Text>
              </View>
              <View style={styles.performanceCard}>
                <Activity size={20} color="#16a34a" />
                <Text style={styles.performanceValue}>99.9%</Text>
                <Text style={styles.performanceLabel}>Uptime</Text>
              </View>
              <View style={styles.performanceCard}>
                <Database size={20} color="#3b82f6" />
                <Text style={styles.performanceValue}>23ms</Text>
                <Text style={styles.performanceLabel}>DB Response</Text>
              </View>
              <View style={styles.performanceCard}>
                <Shield size={20} color="#7c3aed" />
                <Text style={styles.performanceValue}>0</Text>
                <Text style={styles.performanceLabel}>Security Issues</Text>
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
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  quickStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 16,
  },
  quickStatCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickStatValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 2,
  },
  quickStatTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickStatChange: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  alertsList: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  alertIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  actionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  activityList: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
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
  activityText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  performanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  performanceCard: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  performanceValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  performanceLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    textAlign: 'center',
  },
});