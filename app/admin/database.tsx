import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  Database, 
  HardDrive,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Archive,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  BarChart3,
  Activity,
  Zap,
  Shield
} from 'lucide-react-native';
import AnimatedCard from '@/components/AnimatedCard';
import GradientBackground from '@/components/GradientBackground';
import LoadingSpinner from '@/components/LoadingSpinner';

interface DatabaseMetric {
  name: string;
  value: string;
  status: 'good' | 'warning' | 'critical';
  description: string;
  icon: any;
}

interface BackupRecord {
  id: string;
  name: string;
  size: string;
  createdAt: string;
  type: 'automatic' | 'manual';
  status: 'completed' | 'in_progress' | 'failed';
}

export default function DatabaseScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DatabaseMetric[]>([]);
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [isBackingUp, setIsBackingUp] = useState(false);

  useEffect(() => {
    fetchDatabaseData();
  }, []);

  const fetchDatabaseData = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock database metrics
      const mockMetrics: DatabaseMetric[] = [
        {
          name: 'Database Size',
          value: '2.4 GB',
          status: 'good',
          description: 'Total database storage used',
          icon: HardDrive,
        },
        {
          name: 'Active Connections',
          value: '23/100',
          status: 'good',
          description: 'Current database connections',
          icon: Activity,
        },
        {
          name: 'Query Performance',
          value: '23ms',
          status: 'good',
          description: 'Average query response time',
          icon: Zap,
        },
        {
          name: 'Storage Usage',
          value: '67%',
          status: 'warning',
          description: 'Database storage utilization',
          icon: BarChart3,
        },
        {
          name: 'Backup Status',
          value: 'Healthy',
          status: 'good',
          description: 'Last backup completed successfully',
          icon: Shield,
        },
        {
          name: 'Replication Lag',
          value: '0.2s',
          status: 'good',
          description: 'Database replication delay',
          icon: RefreshCw,
        },
      ];

      // Mock backup records
      const mockBackups: BackupRecord[] = [
        {
          id: '1',
          name: 'volyx_backup_2024_01_20_03_00',
          size: '2.4 GB',
          createdAt: '2024-01-20T03:00:00Z',
          type: 'automatic',
          status: 'completed',
        },
        {
          id: '2',
          name: 'volyx_backup_2024_01_19_03_00',
          size: '2.3 GB',
          createdAt: '2024-01-19T03:00:00Z',
          type: 'automatic',
          status: 'completed',
        },
        {
          id: '3',
          name: 'volyx_manual_backup_2024_01_18',
          size: '2.3 GB',
          createdAt: '2024-01-18T15:30:00Z',
          type: 'manual',
          status: 'completed',
        },
        {
          id: '4',
          name: 'volyx_backup_2024_01_18_03_00',
          size: '2.2 GB',
          createdAt: '2024-01-18T03:00:00Z',
          type: 'automatic',
          status: 'completed',
        },
        {
          id: '5',
          name: 'volyx_backup_2024_01_17_03_00',
          size: '2.2 GB',
          createdAt: '2024-01-17T03:00:00Z',
          type: 'automatic',
          status: 'failed',
        },
      ];

      setMetrics(mockMetrics);
      setBackups(mockBackups);
    } catch (error) {
      console.error('Failed to fetch database data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
      case 'completed':
        return '#16a34a';
      case 'warning':
      case 'in_progress':
        return '#f59e0b';
      case 'critical':
      case 'failed':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
      case 'completed':
        return CheckCircle;
      case 'warning':
      case 'in_progress':
        return AlertTriangle;
      case 'critical':
      case 'failed':
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

  if (loading) {
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
          <TouchableOpacity style={styles.refreshButton} onPress={fetchDatabaseData}>
            <RefreshCw size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Database Metrics */}
          <AnimatedCard delay={100} style={styles.section}>
            <Text style={styles.sectionTitle}>Database Health</Text>
            <View style={styles.metricsGrid}>
              {metrics.map((metric, index) => {
                const IconComponent = metric.icon;
                const StatusIcon = getStatusIcon(metric.status);
                
                return (
                  <AnimatedCard key={metric.name} delay={200 + index * 50} style={styles.metricCard}>
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

          {/* Quick Actions */}
          <AnimatedCard delay={400} style={styles.section}>
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
  section: {
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
    fontSize: 20,
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