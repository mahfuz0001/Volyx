import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Server, Database, Wifi, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Circle as XCircle, Clock, Activity, HardDrive, Cpu, MemoryStick, Globe, Shield, Zap } from 'lucide-react-native';
import AnimatedCard from '@/components/AnimatedCard';
import GradientBackground from '@/components/GradientBackground';
import LoadingSpinner from '@/components/LoadingSpinner';
import { db } from '@/lib/database';
import { useAuth } from '@/hooks/useAuth';

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

export default function DatabaseScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [overallHealth, setOverallHealth] = useState<'healthy' | 'warning' | 'critical'>('healthy');
  const [error, setError] = useState<string | null>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);

  useEffect(() => {
    fetchSystemHealth();
  }, []);

  const fetchSystemHealth = async (isRefresh = false) => {
    try {
      setLoading(!isRefresh);
      setRefreshing(isRefresh);
      setError(null);

      // In a real implementation, you would fetch this data from an API
      // For now, we'll use mock data
      
      // Check database connection
      try {
        // Simple query to check database connection
        await db.query.users.findMany({ limit: 1 });
        
        // If we get here, the database is connected
        const mockMetrics: SystemMetric[] = [
          {
            name: 'Database Size',
            value: '2.4 GB',
            status: 'healthy',
            icon: HardDrive,
            description: 'Total database storage used',
            lastUpdated: new Date().toISOString(),
          },
          {
            name: 'Active Connections',
            value: '23/100',
            status: 'healthy',
            icon: Activity,
            description: 'Current database connections',
            lastUpdated: new Date().toISOString(),
          },
          {
            name: 'Query Performance',
            value: '23ms',
            status: 'healthy',
            icon: Zap,
            description: 'Average query response time',
            lastUpdated: new Date().toISOString(),
          },
          {
            name: 'Storage Usage',
            value: '67%',
            status: 'warning',
            icon: BarChart3,
            description: 'Database storage utilization',
            lastUpdated: new Date().toISOString(),
          },
          {
            name: 'Backup Status',
            value: 'Healthy',
            status: 'healthy',
            icon: Shield,
            description: 'Last backup completed successfully',
            lastUpdated: new Date().toISOString(),
          },
          {
            name: 'Replication Lag',
            value: '0.2s',
            status: 'healthy',
            icon: RefreshCw,
            description: 'Database replication delay',
            lastUpdated: new Date().toISOString(),
          },
        ];

        // Mock service statuses
        const mockServices: ServiceStatus[] = [
          {
            name: 'Database',
            status: 'online',
            uptime: '99.9%',
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
            name: 'API Server',
            status: 'online',
            uptime: '99.8%',
            responseTime: 145,
            lastCheck: new Date().toISOString(),
            endpoint: '/api/health',
          },
          {
            name: 'Clerk Auth',
            status: 'online',
            uptime: '99.9%',
            responseTime: 89,
            lastCheck: new Date().toISOString(),
            endpoint: 'https://api.clerk.dev',
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
      } catch (dbError) {
        console.error('Database connection error:', dbError);
        
        // Set critical status for database
        const mockMetrics: SystemMetric[] = [
          {
            name: 'Database Connection',
            value: 'Offline',
            status: 'critical',
            icon: Database,
            description: 'Database connection status',
            lastUpdated: new Date().toISOString(),
          },
        ];
        
        const mockServices: ServiceStatus[] = [
          {
            name: 'Database',
            status: 'offline',
            uptime: '98.2%',
            responseTime: 0,
            lastCheck: new Date().toISOString(),
          },
        ];
        
        setSystemMetrics(mockMetrics);
        setServices(mockServices);
        setOverallHealth('critical');
      }
    } catch (error) {
      console.error('Failed to fetch system health:', error);
      setError('Failed to check system health. Please try again.');
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

  const handleCreateBackup = async () => {
    Alert.alert(
      'Create Manual Backup',
      'This will create a full database backup. This process may take several minutes.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Create Backup', 
          onPress: async () => {
            setIsBackingUp(true);
            
            // Simulate backup process
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            const newBackup: BackupRecord = {
              id: Date.now().toString(),
              name: `volyx_manual_backup_${new Date().toISOString().split('T')[0]}`,
              size: '2.4 GB',
              createdAt: new Date().toISOString(),
              type: 'manual',
              status: 'completed',
            };
            
            setBackups(prev => [newBackup, ...prev]);
            setIsBackingUp(false);
            
            Alert.alert('Success', 'Manual backup created successfully!');
          }
        },
      ]
    );
  };

  const handleRestoreBackup = (backup: BackupRecord) => {
    Alert.alert(
      'Restore Database',
      `Are you sure you want to restore from "${backup.name}"? This will overwrite all current data.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Restore', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Restore Initiated', 'Database restore has been started. This may take several minutes.');
          }
        },
      ]
    );
  };

  const handleDeleteBackup = (backupId: string) => {
    Alert.alert(
      'Delete Backup',
      'Are you sure you want to delete this backup? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setBackups(prev => prev.filter(b => b.id !== backupId));
            Alert.alert('Success', 'Backup deleted successfully.');
          }
        },
      ]
    );
  };

  const handleOptimizeDatabase = () => {
    Alert.alert(
      'Optimize Database',
      'This will optimize database performance by rebuilding indexes and cleaning up unused space. This may take several minutes.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Optimize', 
          onPress: () => {
            Alert.alert('Optimization Started', 'Database optimization has been initiated.');
          }
        },
      ]
    );
  };

  // Mock backup records
  interface BackupRecord {
    id: string;
    name: string;
    size: string;
    createdAt: string;
    type: 'automatic' | 'manual';
    status: 'completed' | 'in_progress' | 'failed';
  }

  const [backups, setBackups] = useState<BackupRecord[]>([
    {
      id: '1',
      name: 'volyx_backup_2024_01_20_03_00',
      size: '2.4 GB',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'automatic',
      status: 'completed',
    },
    {
      id: '2',
      name: 'volyx_backup_2024_01_19_03_00',
      size: '2.3 GB',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'automatic',
      status: 'completed',
    },
    {
      id: '3',
      name: 'volyx_manual_backup_2024_01_18',
      size: '2.3 GB',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'manual',
      status: 'completed',
    },
    {
      id: '4',
      name: 'volyx_backup_2024_01_18_03_00',
      size: '2.2 GB',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'automatic',
      status: 'completed',
    },
    {
      id: '5',
      name: 'volyx_backup_2024_01_17_03_00',
      size: '2.2 GB',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'automatic',
      status: 'failed',
    },
  ]);

  if (loading && systemMetrics.length === 0) {
    return (
      <GradientBackground colors={['#f8fafc', '#e2e8f0']}>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <LoadingSpinner size={48} />
            <Text style={styles.loadingText}>Loading database information...</Text>
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
            <AlertTriangle size={48} color="#ef4444" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => fetchSystemHealth()}>
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
          <Text style={styles.headerTitle}>Database Management</Text>
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
              <TouchableOpacity 
                style={[styles.actionButton, isBackingUp && styles.actionButtonDisabled]}
                onPress={handleCreateBackup}
                disabled={isBackingUp}
              >
                {isBackingUp ? (
                  <LoadingSpinner size={24} color="#1e40af" />
                ) : (
                  <Download size={24} color="#1e40af" />
                )}
                <Text style={styles.actionButtonText}>
                  {isBackingUp ? 'Creating...' : 'Create Backup'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton} onPress={handleOptimizeDatabase}>
                <Zap size={24} color="#16a34a" />
                <Text style={styles.actionButtonText}>Optimize DB</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <BarChart3 size={24} color="#f59e0b" />
                <Text style={styles.actionButtonText}>View Queries</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Activity size={24} color="#7c3aed" />
                <Text style={styles.actionButtonText}>Monitor</Text>
              </TouchableOpacity>
            </View>
          </AnimatedCard>

          {/* Backup Management */}
          <AnimatedCard delay={600} style={styles.section}>
            <Text style={styles.sectionTitle}>Backup Management</Text>
            <View style={styles.backupsList}>
              {backups.map((backup, index) => {
                const StatusIcon = getStatusIcon(backup.status);
                
                return (
                  <AnimatedCard key={backup.id} delay={700 + index * 50} style={styles.backupCard}>
                    <View style={styles.backupHeader}>
                      <View style={styles.backupInfo}>
                        <Text style={styles.backupName}>{backup.name}</Text>
                        <View style={styles.backupDetails}>
                          <Text style={styles.backupDetail}>{backup.size}</Text>
                          <Text style={styles.backupDetail}>•</Text>
                          <Text style={styles.backupDetail}>
                            {new Date(backup.createdAt).toLocaleDateString()}
                          </Text>
                          <Text style={styles.backupDetail}>•</Text>
                          <Text style={[
                            styles.backupType,
                            { color: backup.type === 'manual' ? '#1e40af' : '#6b7280' }
                          ]}>
                            {backup.type}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.backupActions}>
                        <View style={styles.backupStatus}>
                          <StatusIcon size={16} color={getStatusColor(backup.status)} />
                          <Text style={[
                            styles.backupStatusText,
                            { color: getStatusColor(backup.status) }
                          ]}>
                            {backup.status}
                          </Text>
                        </View>
                        
                        {backup.status === 'completed' && (
                          <View style={styles.backupActionButtons}>
                            <TouchableOpacity
                              style={styles.backupActionButton}
                              onPress={() => handleRestoreBackup(backup)}
                            >
                              <Upload size={14} color="#16a34a" />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.backupActionButton}
                              onPress={() => handleDeleteBackup(backup.id)}
                            >
                              <Trash2 size={14} color="#ef4444" />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>
                  </AnimatedCard>
                );
              })}
            </View>
          </AnimatedCard>

          {/* Database Configuration */}
          <AnimatedCard delay={800} style={styles.section}>
            <Text style={styles.sectionTitle}>Configuration</Text>
            <View style={styles.configList}>
              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Automatic Backups</Text>
                <Text style={styles.configValue}>Daily at 3:00 AM UTC</Text>
              </View>
              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Backup Retention</Text>
                <Text style={styles.configValue}>30 days</Text>
              </View>
              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Connection Pool Size</Text>
                <Text style={styles.configValue}>100 connections</Text>
              </View>
              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Query Timeout</Text>
                <Text style={styles.configValue}>30 seconds</Text>
              </View>
              <View style={styles.configItem}>
                <Text style={styles.configLabel}>SSL Mode</Text>
                <Text style={styles.configValue}>Required</Text>
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
    marginTop: 16,
    marginBottom: 24,
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
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
  },
  backupsList: {
    gap: 12,
  },
  backupCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
  },
  backupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  backupInfo: {
    flex: 1,
  },
  backupName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  backupDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backupDetail: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  backupType: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase',
  },
  backupActions: {
    alignItems: 'flex-end',
  },
  backupStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  backupStatusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase',
  },
  backupActionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  backupActionButton: {
    padding: 4,
  },
  configList: {
    gap: 12,
  },
  configItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  configLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  configValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
});