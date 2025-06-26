import React, { useState, useEffect } from 'react';
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
import { ChevronLeft, Server, Database, Wifi, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Circle as XCircle, Clock, Activity, HardDrive, Cpu, MemoryStick, Globe, Shield, Zap } from 'lucide-react-native';
import AnimatedCard from '@/components/AnimatedCard';
import GradientBackground from '@/components/GradientBackground';
import LoadingSpinner from '@/components/LoadingSpinner';

interface SystemMetric {
  name: string;
  value: string;
  status: 'healthy' | 'warning' | 'critical';
  icon: any;
  description: string;
  lastUpdated: string;
}

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  uptime: string;
  responseTime: number;
  lastCheck: string;
  endpoint?: string;
}

export default function SystemHealthScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [overallHealth, setOverallHealth] = useState<'healthy' | 'warning' | 'critical'>('healthy');

  useEffect(() => {
    fetchSystemHealth();
  }, []);

  const fetchSystemHealth = async (isRefresh = false) => {
    try {
      setLoading(!isRefresh);
      setRefreshing(isRefresh);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock system metrics
      const mockMetrics: SystemMetric[] = [
        {
          name: 'CPU Usage',
          value: '23%',
          status: 'healthy',
          icon: Cpu,
          description: 'Server CPU utilization',
          lastUpdated: new Date().toISOString(),
        },
        {
          name: 'Memory Usage',
          value: '67%',
          status: 'warning',
          icon: MemoryStick,
          description: 'RAM utilization',
          lastUpdated: new Date().toISOString(),
        },
        {
          name: 'Disk Space',
          value: '45%',
          status: 'healthy',
          icon: HardDrive,
          description: 'Storage utilization',
          lastUpdated: new Date().toISOString(),
        },
        {
          name: 'Network I/O',
          value: '1.2 GB/s',
          status: 'healthy',
          icon: Wifi,
          description: 'Network throughput',
          lastUpdated: new Date().toISOString(),
        },
        {
          name: 'Active Users',
          value: '3,421',
          status: 'healthy',
          icon: Activity,
          description: 'Currently active users',
          lastUpdated: new Date().toISOString(),
        },
        {
          name: 'Response Time',
          value: '145ms',
          status: 'healthy',
          icon: Zap,
          description: 'Average API response time',
          lastUpdated: new Date().toISOString(),
        },
      ];

      // Mock service statuses
      const mockServices: ServiceStatus[] = [
        {
          name: 'API Server',
          status: 'online',
          uptime: '99.9%',
          responseTime: 145,
          lastCheck: new Date().toISOString(),
          endpoint: '/api/health',
        },
        {
          name: 'Database',
          status: 'online',
          uptime: '99.8%',
          responseTime: 23,
          lastCheck: new Date().toISOString(),
        },
        {
          name: 'Redis Cache',
          status: 'online',
          uptime: '99.9%',
          responseTime: 5,
          lastCheck: new Date().toISOString(),
        },
        {
          name: 'Sanity CMS',
          status: 'online',
          uptime: '99.7%',
          responseTime: 89,
          lastCheck: new Date().toISOString(),
          endpoint: 'https://api.sanity.io',
        },
        {
          name: 'Push Notifications',
          status: 'degraded',
          uptime: '98.5%',
          responseTime: 234,
          lastCheck: new Date().toISOString(),
          endpoint: 'FCM Service',
        },
        {
          name: 'Payment Gateway',
          status: 'online',
          uptime: '99.9%',
          responseTime: 167,
          lastCheck: new Date().toISOString(),
          endpoint: 'Stripe API',
        },
        {
          name: 'Analytics',
          status: 'online',
          uptime: '99.6%',
          responseTime: 78,
          lastCheck: new Date().toISOString(),
          endpoint: 'Mixpanel/GA',
        },
        {
          name: 'Error Monitoring',
          status: 'online',
          uptime: '99.9%',
          responseTime: 45,
          lastCheck: new Date().toISOString(),
          endpoint: 'Sentry',
        },
      ];

      setSystemMetrics(mockMetrics);
      setServices(mockServices);

      // Calculate overall health
      const criticalCount = mockMetrics.filter(m => m.status === 'critical').length;
      const warningCount = mockMetrics.filter(m => m.status === 'warning').length;
      const offlineServices = mockServices.filter(s => s.status === 'offline').length;
      const degradedServices = mockServices.filter(s => s.status === 'degraded').length;

      if (criticalCount > 0 || offlineServices > 0) {
        setOverallHealth('critical');
      } else if (warningCount > 0 || degradedServices > 0) {
        setOverallHealth('warning');
      } else {
        setOverallHealth('healthy');
      }
    } catch (error) {
      console.error('Failed to fetch system health:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchSystemHealth(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return '#16a34a';
      case 'warning':
      case 'degraded':
        return '#f59e0b';
      case 'critical':
      case 'offline':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return CheckCircle;
      case 'warning':
      case 'degraded':
        return AlertTriangle;
      case 'critical':
      case 'offline':
        return XCircle;
      default:
        return Clock;
    }
  };

  if (loading) {
    return (
      <GradientBackground colors={['#f8fafc', '#e2e8f0']}>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <LoadingSpinner size={48} />
            <Text style={styles.loadingText}>Checking system health...</Text>
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
          <Text style={styles.headerTitle}>System Health</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <Activity size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {/* Overall Health Status */}
          <AnimatedCard delay={100} style={styles.overallHealthCard}>
            <View style={styles.overallHealthHeader}>
              <View style={[styles.healthIndicator, { backgroundColor: getStatusColor(overallHealth) }]}>
                {React.createElement(getStatusIcon(overallHealth), { size: 24, color: '#ffffff' })}
              </View>
              <View style={styles.overallHealthInfo}>
                <Text style={styles.overallHealthTitle}>System Status</Text>
                <Text style={[styles.overallHealthStatus, { color: getStatusColor(overallHealth) }]}>
                  {overallHealth.charAt(0).toUpperCase() + overallHealth.slice(1)}
                </Text>
              </View>
            </View>
            <Text style={styles.overallHealthDescription}>
              {overallHealth === 'healthy' 
                ? 'All systems are operating normally'
                : overallHealth === 'warning'
                ? 'Some systems require attention'
                : 'Critical issues detected - immediate action required'
              }
            </Text>
          </AnimatedCard>

          {/* System Metrics */}
          <AnimatedCard delay={200} style={styles.section}>
            <Text style={styles.sectionTitle}>System Metrics</Text>
            <View style={styles.metricsGrid}>
              {systemMetrics.map((metric, index) => {
                const IconComponent = metric.icon;
                const StatusIcon = getStatusIcon(metric.status);
                
                return (
                  <AnimatedCard key={metric.name} delay={300 + index * 50} style={styles.metricCard}>
                    <View style={styles.metricHeader}>
                      <IconComponent size={20} color="#6b7280" />
                      <StatusIcon size={16} color={getStatusColor(metric.status)} />
                    </View>
                    <Text style={styles.metricValue}>{metric.value}</Text>
                    <Text style={styles.metricName}>{metric.name}</Text>
                    <Text style={styles.metricDescription}>{metric.description}</Text>
                  </AnimatedCard>
                );
              })}
            </View>
          </AnimatedCard>

          {/* Service Status */}
          <AnimatedCard delay={400} style={styles.section}>
            <Text style={styles.sectionTitle}>Service Status</Text>
            <View style={styles.servicesList}>
              {services.map((service, index) => {
                const StatusIcon = getStatusIcon(service.status);
                
                return (
                  <AnimatedCard key={service.name} delay={500 + index * 50} style={styles.serviceCard}>
                    <View style={styles.serviceHeader}>
                      <View style={styles.serviceInfo}>
                        <Text style={styles.serviceName}>{service.name}</Text>
                        {service.endpoint && (
                          <Text style={styles.serviceEndpoint}>{service.endpoint}</Text>
                        )}
                      </View>
                      <View style={styles.serviceStatus}>
                        <StatusIcon size={16} color={getStatusColor(service.status)} />
                        <Text style={[styles.serviceStatusText, { color: getStatusColor(service.status) }]}>
                          {service.status}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.serviceMetrics}>
                      <View style={styles.serviceMetric}>
                        <Text style={styles.serviceMetricLabel}>Uptime</Text>
                        <Text style={styles.serviceMetricValue}>{service.uptime}</Text>
                      </View>
                      <View style={styles.serviceMetric}>
                        <Text style={styles.serviceMetricLabel}>Response</Text>
                        <Text style={styles.serviceMetricValue}>{service.responseTime}ms</Text>
                      </View>
                      <View style={styles.serviceMetric}>
                        <Text style={styles.serviceMetricLabel}>Last Check</Text>
                        <Text style={styles.serviceMetricValue}>
                          {new Date(service.lastCheck).toLocaleTimeString()}
                        </Text>
                      </View>
                    </View>
                  </AnimatedCard>
                );
              })}
            </View>
          </AnimatedCard>

          {/* Quick Actions */}
          <AnimatedCard delay={600} style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity style={styles.actionButton}>
                <Server size={24} color="#1e40af" />
                <Text style={styles.actionButtonText}>Restart Services</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Database size={24} color="#16a34a" />
                <Text style={styles.actionButtonText}>Database Backup</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Shield size={24} color="#f59e0b" />
                <Text style={styles.actionButtonText}>Security Scan</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Globe size={24} color="#7c3aed" />
                <Text style={styles.actionButtonText}>CDN Status</Text>
              </TouchableOpacity>
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
  refreshButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  overallHealthCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  overallHealthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  healthIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  overallHealthInfo: {
    flex: 1,
  },
  overallHealthTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  overallHealthStatus: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    textTransform: 'uppercase',
  },
  overallHealthDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    lineHeight: 20,
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
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  metricName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  metricDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  servicesList: {
    gap: 12,
  },
  serviceCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  serviceEndpoint: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  serviceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  serviceStatusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase',
  },
  serviceMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceMetric: {
    alignItems: 'center',
  },
  serviceMetricLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginBottom: 2,
  },
  serviceMetricValue: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
  },
});