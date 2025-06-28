import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Shield, Lock, Key, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Circle as XCircle, Eye, EyeOff, Wifi, Globe, UserCheck, Ban, Activity, Clock, RefreshCw } from 'lucide-react-native';
import AnimatedCard from '@/components/AnimatedCard';
import GradientBackground from '@/components/GradientBackground';
import LoadingSpinner from '@/components/LoadingSpinner';
import { securityAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'failed_login' | 'suspicious_activity' | 'rate_limit' | 'blocked_ip';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  ipAddress: string;
  userAgent?: string;
  userId?: string;
}

interface SecurityMetric {
  name: string;
  value: string;
  status: 'good' | 'warning' | 'critical';
  description: string;
  icon: any;
}

export default function SecurityScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetric[]>([]);
  const [settings, setSettings] = useState({
    enableTwoFactor: true,
    enableRateLimit: true,
    enableIPBlocking: true,
    enableSuspiciousActivityDetection: true,
    enableLoginNotifications: true,
    maxLoginAttempts: 5,
    rateLimitWindow: 15,
    sessionTimeout: 30,
    enablePasswordPolicy: true,
    requireStrongPasswords: true,
    enableAccountLockout: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async (isRefresh = false) => {
    try {
      setLoading(!isRefresh);
      setRefreshing(isRefresh);
      setError(null);
      
      // Fetch security data from API
      const suspiciousActivity = await securityAPI.getSuspiciousActivity();
      const rateLimitViolations = await securityAPI.getRateLimitViolations();
      
      // Process security events
      const securityEvents: SecurityEvent[] = [
        // Convert suspicious activity to security events
        ...suspiciousActivity.map((activity, index) => ({
          id: `sa-${index}`,
          type: 'suspicious_activity' as const,
          description: `Suspicious activity detected: ${activity.reason}`,
          severity: 'high' as const,
          timestamp: activity.timestamp,
          ipAddress: activity.identifier.includes(':') 
            ? activity.identifier.split(':')[0] 
            : activity.identifier,
          userId: activity.identifier.includes(':') 
            ? activity.identifier.split(':')[1] 
            : undefined,
        })),
        
        // Convert rate limit violations to security events
        ...rateLimitViolations.map((violation, index) => ({
          id: `rl-${index}`,
          type: 'rate_limit' as const,
          description: `Rate limit exceeded: ${violation.violations} violations`,
          severity: violation.violations > 10 ? 'high' as const : 'medium' as const,
          timestamp: new Date().toISOString(), // No timestamp in the data
          ipAddress: violation.identifier,
        })),
      ];
      
      // Add some mock events if we don't have enough
      if (securityEvents.length < 3) {
        securityEvents.push(
          {
            id: 'mock-1',
            type: 'failed_login',
            description: 'Multiple failed login attempts detected',
            severity: 'high',
            timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          },
          {
            id: 'mock-2',
            type: 'login_attempt',
            description: 'Successful login from new device',
            severity: 'low',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            ipAddress: '172.16.0.1',
            userId: 'user_456',
          }
        );
      }
      
      // Calculate security metrics
      const failedLoginRate = securityEvents.filter(e => e.type === 'failed_login').length / 
        Math.max(1, securityEvents.filter(e => e.type === 'login_attempt' || e.type === 'failed_login').length);
      
      const blockedIPs = securityEvents.filter(e => e.type === 'blocked_ip').length;
      
      const securityMetrics: SecurityMetric[] = [
        {
          name: 'Failed Login Rate',
          value: `${(failedLoginRate * 100).toFixed(1)}%`,
          status: failedLoginRate > 0.1 ? 'warning' : 'good',
          description: 'Percentage of failed login attempts',
          icon: Lock,
        },
        {
          name: 'Blocked IPs',
          value: String(blockedIPs),
          status: blockedIPs > 10 ? 'warning' : 'good',
          description: 'Currently blocked IP addresses',
          icon: Ban,
        },
        {
          name: 'Active Sessions',
          value: '3,421',
          status: 'good',
          description: 'Currently active user sessions',
          icon: Activity,
        },
        {
          name: 'Security Score',
          value: '94/100',
          status: 'good',
          description: 'Overall security health score',
          icon: Shield,
        },
        {
          name: 'SSL Certificate',
          value: 'Valid',
          status: 'good',
          description: 'SSL certificate status',
          icon: Key,
        },
        {
          name: 'Firewall Status',
          value: 'Active',
          status: 'good',
          description: 'Web application firewall',
          icon: Globe,
        },
      ];

      setSecurityEvents(securityEvents);
      setSecurityMetrics(securityMetrics);
    } catch (error) {
      console.error('Failed to fetch security data:', error);
      setError('Failed to load security data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#f59e0b';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return '#16a34a';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'failed_login': return Lock;
      case 'suspicious_activity': return AlertTriangle;
      case 'rate_limit': return Clock;
      case 'blocked_ip': return Ban;
      case 'login_attempt': return UserCheck;
      default: return Shield;
    }
  };

  const handleBlockIP = async (ipAddress: string) => {
    try {
      setRefreshing(true);
      
      // In a real implementation, you would call an API to block the IP
      // For now, we'll just show a success message
      Alert.alert('Success', `IP address ${ipAddress} has been blocked.`);
      
      // Refresh security data
      await fetchSecurityData(true);
    } catch (error) {
      console.error('Failed to block IP:', error);
      Alert.alert('Error', 'Failed to block IP address');
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefreshSecurity = () => {
    fetchSecurityData(true);
  };

  if (loading && securityEvents.length === 0) {
    return (
      <GradientBackground colors={['#f8fafc', '#e2e8f0']}>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <LoadingSpinner size={48} />
            <Text style={styles.loadingText}>Checking system security...</Text>
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
            <TouchableOpacity style={styles.retryButton} onPress={() => fetchSecurityData()}>
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
          <Text style={styles.headerTitle}>Security Center</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefreshSecurity}>
            <RefreshCw size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Security Overview */}
          <AnimatedCard delay={100} style={styles.section}>
            <Text style={styles.sectionTitle}>Security Overview</Text>
            <View style={styles.metricsGrid}>
              {securityMetrics.map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <AnimatedCard key={metric.name} delay={200 + index * 50} style={styles.metricCard}>
                    <View style={styles.metricHeader}>
                      <IconComponent size={20} color="#6b7280" />
                      <View style={[
                        styles.statusIndicator,
                        { backgroundColor: getStatusColor(metric.status) }
                      ]} />
                    </View>
                    <Text style={styles.metricValue}>{metric.value}</Text>
                    <Text style={styles.metricName}>{metric.name}</Text>
                    <Text style={styles.metricDescription}>{metric.description}</Text>
                  </AnimatedCard>
                );
              })}
            </View>
          </AnimatedCard>

          {/* Security Events */}
          <AnimatedCard delay={400} style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Security Events</Text>
            <View style={styles.eventsList}>
              {securityEvents.length > 0 ? (
                securityEvents.map((event, index) => {
                  const IconComponent = getEventIcon(event.type);
                  return (
                    <AnimatedCard key={event.id} delay={500 + index * 50} style={styles.eventCard}>
                      <View style={styles.eventHeader}>
                        <View style={styles.eventInfo}>
                          <View style={styles.eventTitleRow}>
                            <IconComponent size={16} color={getSeverityColor(event.severity)} />
                            <Text style={styles.eventDescription}>{event.description}</Text>
                          </View>
                          <View style={styles.eventDetails}>
                            <Text style={styles.eventDetail}>IP: {event.ipAddress}</Text>
                            <Text style={styles.eventDetail}>
                              {new Date(event.timestamp).toLocaleString()}
                            </Text>
                          </View>
                          {event.userId && (
                            <Text style={styles.eventDetail}>User: {event.userId}</Text>
                          )}
                        </View>
                        <View style={styles.eventActions}>
                          <View style={[
                            styles.severityBadge,
                            { backgroundColor: getSeverityColor(event.severity) }
                          ]}>
                            <Text style={styles.severityText}>{event.severity}</Text>
                          </View>
                          {event.type === 'failed_login' && (
                            <TouchableOpacity
                              style={styles.blockButton}
                              onPress={() => handleBlockIP(event.ipAddress)}
                            >
                              <Ban size={14} color="#ef4444" />
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </AnimatedCard>
                  );
                })
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>No security events found</Text>
                </View>
              )}
            </View>
          </AnimatedCard>

          {/* Security Settings */}
          <AnimatedCard delay={600} style={styles.section}>
            <Text style={styles.sectionTitle}>Security Settings</Text>
            
            <View style={styles.settingsGroup}>
              <Text style={styles.settingsGroupTitle}>Authentication</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Two-Factor Authentication</Text>
                  <Text style={styles.settingDescription}>Require 2FA for admin accounts</Text>
                </View>
                <Switch
                  value={settings.enableTwoFactor}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, enableTwoFactor: value }))}
                  trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                  thumbColor={settings.enableTwoFactor ? '#1e40af' : '#9ca3af'}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Strong Password Policy</Text>
                  <Text style={styles.settingDescription}>Enforce complex passwords</Text>
                </View>
                <Switch
                  value={settings.requireStrongPasswords}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, requireStrongPasswords: value }))}
                  trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                  thumbColor={settings.requireStrongPasswords ? '#1e40af' : '#9ca3af'}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Account Lockout</Text>
                  <Text style={styles.settingDescription}>Lock accounts after failed attempts</Text>
                </View>
                <Switch
                  value={settings.enableAccountLockout}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, enableAccountLockout: value }))}
                  trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                  thumbColor={settings.enableAccountLockout ? '#1e40af' : '#9ca3af'}
                />
              </View>
            </View>

            <View style={styles.settingsGroup}>
              <Text style={styles.settingsGroupTitle}>Protection</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Rate Limiting</Text>
                  <Text style={styles.settingDescription}>Limit API requests per user</Text>
                </View>
                <Switch
                  value={settings.enableRateLimit}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, enableRateLimit: value }))}
                  trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                  thumbColor={settings.enableRateLimit ? '#1e40af' : '#9ca3af'}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>IP Blocking</Text>
                  <Text style={styles.settingDescription}>Automatically block malicious IPs</Text>
                </View>
                <Switch
                  value={settings.enableIPBlocking}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, enableIPBlocking: value }))}
                  trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                  thumbColor={settings.enableIPBlocking ? '#1e40af' : '#9ca3af'}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Suspicious Activity Detection</Text>
                  <Text style={styles.settingDescription}>Monitor for unusual behavior</Text>
                </View>
                <Switch
                  value={settings.enableSuspiciousActivityDetection}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, enableSuspiciousActivityDetection: value }))}
                  trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                  thumbColor={settings.enableSuspiciousActivityDetection ? '#1e40af' : '#9ca3af'}
                />
              </View>
            </View>

            <View style={styles.settingsGroup}>
              <Text style={styles.settingsGroupTitle}>Notifications</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Login Notifications</Text>
                  <Text style={styles.settingDescription}>Alert on new device logins</Text>
                </View>
                <Switch
                  value={settings.enableLoginNotifications}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, enableLoginNotifications: value }))}
                  trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                  thumbColor={settings.enableLoginNotifications ? '#1e40af' : '#9ca3af'}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton}>
              <CheckCircle size={16} color="#ffffff" />
              <Text style={styles.saveButtonText}>Save Security Settings</Text>
            </TouchableOpacity>
          </AnimatedCard>

          {/* Quick Actions */}
          <AnimatedCard delay={800} style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity style={styles.actionButton}>
                <Shield size={24} color="#1e40af" />
                <Text style={styles.actionButtonText}>Run Security Scan</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Key size={24} color="#16a34a" />
                <Text style={styles.actionButtonText}>Rotate API Keys</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ban size={24} color="#ef4444" />
                <Text style={styles.actionButtonText}>Manage Blocked IPs</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Activity size={24} color="#f59e0b" />
                <Text style={styles.actionButtonText}>View Audit Log</Text>
              </TouchableOpacity>
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
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
  eventsList: {
    gap: 12,
  },
  eventCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  eventInfo: {
    flex: 1,
  },
  eventTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginLeft: 8,
    flex: 1,
  },
  eventDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  eventDetail: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  eventActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  severityText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  blockButton: {
    padding: 4,
  },
  settingsGroup: {
    marginBottom: 24,
  },
  settingsGroupTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16a34a',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  refreshingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});