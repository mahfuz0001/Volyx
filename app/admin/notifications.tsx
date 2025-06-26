import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Modal,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Bell, Send, Users, Target, Calendar, Clock, Settings, Plus, Edit, Trash2, Eye, CheckCircle, AlertCircle } from 'lucide-react-native';
import AnimatedCard from '@/components/AnimatedCard';
import GradientBackground from '@/components/GradientBackground';
import LoadingSpinner from '@/components/LoadingSpinner';

interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  body: string;
  category: 'auction' | 'connects' | 'system' | 'marketing';
  isActive: boolean;
  lastUsed?: string;
  usageCount: number;
}

interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  targetAudience: 'all' | 'active' | 'inactive' | 'high_value' | 'custom';
  scheduledFor: string;
  status: 'pending' | 'sent' | 'failed';
  recipientCount: number;
  openRate?: number;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'send' | 'templates' | 'scheduled' | 'settings'>('send');
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [scheduledNotifications, setScheduledNotifications] = useState<ScheduledNotification[]>([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  
  // Send notification form
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationBody, setNotificationBody] = useState('');
  const [targetAudience, setTargetAudience] = useState<'all' | 'active' | 'inactive' | 'high_value'>('all');
  const [scheduleDate, setScheduleDate] = useState('');
  const [isImmediate, setIsImmediate] = useState(true);

  // Settings
  const [settings, setSettings] = useState({
    enablePushNotifications: true,
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    maxDailyNotifications: 3,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    enableAnalytics: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock templates
      const mockTemplates: NotificationTemplate[] = [
        {
          id: '1',
          name: 'Outbid Alert',
          title: 'You\'ve been outbid!',
          body: 'Someone placed a higher bid on "{auction_title}". Place a new bid to stay in the game!',
          category: 'auction',
          isActive: true,
          lastUsed: '2024-01-20',
          usageCount: 1247,
        },
        {
          id: '2',
          name: 'Auction Ending Soon',
          title: 'Auction ending in {time_left}!',
          body: '"{auction_title}" is ending soon. Don\'t miss your chance to win!',
          category: 'auction',
          isActive: true,
          lastUsed: '2024-01-19',
          usageCount: 892,
        },
        {
          id: '3',
          name: 'Connects Earned',
          title: 'Connects earned!',
          body: 'You earned {amount} Connects for watching a video. Keep collecting!',
          category: 'connects',
          isActive: true,
          lastUsed: '2024-01-20',
          usageCount: 3456,
        },
        {
          id: '4',
          name: 'New Auctions Available',
          title: 'New curated auctions are live!',
          body: '{count} new exclusive items are now available for bidding. Check them out!',
          category: 'marketing',
          isActive: true,
          lastUsed: '2024-01-18',
          usageCount: 234,
        },
      ];

      // Mock scheduled notifications
      const mockScheduled: ScheduledNotification[] = [
        {
          id: '1',
          title: 'Weekend Flash Sale',
          body: 'Special weekend auctions with exclusive items. Don\'t miss out!',
          targetAudience: 'active',
          scheduledFor: '2024-01-22T10:00:00Z',
          status: 'pending',
          recipientCount: 3421,
        },
        {
          id: '2',
          title: 'Welcome Back!',
          body: 'We miss you! Check out the latest auctions and earn free Connects.',
          targetAudience: 'inactive',
          scheduledFor: '2024-01-21T14:00:00Z',
          status: 'sent',
          recipientCount: 1567,
          openRate: 23.4,
        },
      ];

      setTemplates(mockTemplates);
      setScheduledNotifications(mockScheduled);
    } catch (error) {
      console.error('Failed to fetch notification data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async () => {
    if (!notificationTitle || !notificationBody) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      Alert.alert(
        'Success',
        isImmediate 
          ? 'Notification sent successfully!'
          : 'Notification scheduled successfully!',
        [{ text: 'OK' }]
      );

      // Reset form
      setNotificationTitle('');
      setNotificationBody('');
      setTargetAudience('all');
      setScheduleDate('');
      setIsImmediate(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification');
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    Alert.alert(
      'Delete Template',
      'Are you sure you want to delete this template?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setTemplates(prev => prev.filter(t => t.id !== templateId));
          }
        },
      ]
    );
  };

  const toggleTemplateStatus = (templateId: string) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? { ...template, isActive: !template.isActive }
        : template
    ));
  };

  const getAudienceCount = (audience: string) => {
    switch (audience) {
      case 'all': return 12847;
      case 'active': return 3421;
      case 'inactive': return 1567;
      case 'high_value': return 892;
      default: return 0;
    }
  };

  if (loading) {
    return (
      <GradientBackground colors={['#f8fafc', '#e2e8f0']}>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <LoadingSpinner size={48} />
            <Text style={styles.loadingText}>Loading notifications...</Text>
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
          <Text style={styles.headerTitle}>Notification Center</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {[
            { key: 'send', label: 'Send', icon: Send },
            { key: 'templates', label: 'Templates', icon: Bell },
            { key: 'scheduled', label: 'Scheduled', icon: Calendar },
            { key: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tabButton,
                  activeTab === tab.key && styles.tabButtonActive,
                ]}
                onPress={() => setActiveTab(tab.key as any)}
              >
                <IconComponent 
                  size={16} 
                  color={activeTab === tab.key ? '#1e40af' : '#6b7280'} 
                />
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === tab.key && styles.tabButtonTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Send Notification Tab */}
          {activeTab === 'send' && (
            <AnimatedCard delay={200} style={styles.section}>
              <Text style={styles.sectionTitle}>Send Notification</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Title *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Notification title"
                  value={notificationTitle}
                  onChangeText={setNotificationTitle}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Message *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Notification message"
                  value={notificationBody}
                  onChangeText={setNotificationBody}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Target Audience</Text>
                <View style={styles.audienceContainer}>
                  {[
                    { key: 'all', label: 'All Users' },
                    { key: 'active', label: 'Active Users' },
                    { key: 'inactive', label: 'Inactive Users' },
                    { key: 'high_value', label: 'High Value Users' },
                  ].map((audience) => (
                    <TouchableOpacity
                      key={audience.key}
                      style={[
                        styles.audienceButton,
                        targetAudience === audience.key && styles.audienceButtonActive,
                      ]}
                      onPress={() => setTargetAudience(audience.key as any)}
                    >
                      <Text
                        style={[
                          styles.audienceButtonText,
                          targetAudience === audience.key && styles.audienceButtonTextActive,
                        ]}
                      >
                        {audience.label}
                      </Text>
                      <Text style={styles.audienceCount}>
                        {getAudienceCount(audience.key).toLocaleString()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <View style={styles.scheduleToggle}>
                  <Text style={styles.label}>Send Immediately</Text>
                  <Switch
                    value={isImmediate}
                    onValueChange={setIsImmediate}
                    trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                    thumbColor={isImmediate ? '#1e40af' : '#9ca3af'}
                  />
                </View>
                
                {!isImmediate && (
                  <TextInput
                    style={styles.input}
                    placeholder="Schedule date (YYYY-MM-DD HH:MM)"
                    value={scheduleDate}
                    onChangeText={setScheduleDate}
                    placeholderTextColor="#9ca3af"
                  />
                )}
              </View>

              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendNotification}
              >
                <Send size={16} color="#ffffff" />
                <Text style={styles.sendButtonText}>
                  {isImmediate ? 'Send Now' : 'Schedule'}
                </Text>
              </TouchableOpacity>
            </AnimatedCard>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <AnimatedCard delay={200} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Notification Templates</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => {
                    setSelectedTemplate(null);
                    setShowTemplateModal(true);
                  }}
                >
                  <Plus size={16} color="#1e40af" />
                  <Text style={styles.addButtonText}>Add Template</Text>
                </TouchableOpacity>
              </View>

              {templates.map((template) => (
                <View key={template.id} style={styles.templateCard}>
                  <View style={styles.templateHeader}>
                    <View style={styles.templateInfo}>
                      <Text style={styles.templateName}>{template.name}</Text>
                      <Text style={styles.templateCategory}>{template.category}</Text>
                    </View>
                    <View style={styles.templateActions}>
                      <Switch
                        value={template.isActive}
                        onValueChange={() => toggleTemplateStatus(template.id)}
                        trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                        thumbColor={template.isActive ? '#1e40af' : '#9ca3af'}
                      />
                      <TouchableOpacity
                        style={styles.templateActionButton}
                        onPress={() => {
                          setSelectedTemplate(template);
                          setShowTemplateModal(true);
                        }}
                      >
                        <Edit size={16} color="#6b7280" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.templateActionButton}
                        onPress={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash2 size={16} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <Text style={styles.templateTitle}>{template.title}</Text>
                  <Text style={styles.templateBody}>{template.body}</Text>
                  
                  <View style={styles.templateStats}>
                    <Text style={styles.templateStat}>
                      Used {template.usageCount} times
                    </Text>
                    {template.lastUsed && (
                      <Text style={styles.templateStat}>
                        Last used: {template.lastUsed}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </AnimatedCard>
          )}

          {/* Scheduled Tab */}
          {activeTab === 'scheduled' && (
            <AnimatedCard delay={200} style={styles.section}>
              <Text style={styles.sectionTitle}>Scheduled Notifications</Text>
              
              {scheduledNotifications.map((notification) => (
                <View key={notification.id} style={styles.scheduledCard}>
                  <View style={styles.scheduledHeader}>
                    <Text style={styles.scheduledTitle}>{notification.title}</Text>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: 
                        notification.status === 'sent' ? '#16a34a' :
                        notification.status === 'failed' ? '#ef4444' : '#f59e0b'
                      }
                    ]}>
                      <Text style={styles.statusBadgeText}>{notification.status}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.scheduledBody}>{notification.body}</Text>
                  
                  <View style={styles.scheduledInfo}>
                    <View style={styles.scheduledInfoItem}>
                      <Users size={14} color="#6b7280" />
                      <Text style={styles.scheduledInfoText}>
                        {notification.recipientCount.toLocaleString()} recipients
                      </Text>
                    </View>
                    <View style={styles.scheduledInfoItem}>
                      <Clock size={14} color="#6b7280" />
                      <Text style={styles.scheduledInfoText}>
                        {new Date(notification.scheduledFor).toLocaleString()}
                      </Text>
                    </View>
                    {notification.openRate && (
                      <View style={styles.scheduledInfoItem}>
                        <Eye size={14} color="#6b7280" />
                        <Text style={styles.scheduledInfoText}>
                          {notification.openRate}% open rate
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </AnimatedCard>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <AnimatedCard delay={200} style={styles.section}>
              <Text style={styles.sectionTitle}>Notification Settings</Text>
              
              <View style={styles.settingsGroup}>
                <Text style={styles.settingsGroupTitle}>Channels</Text>
                
                <View style={styles.settingItem}>
                  <Text style={styles.settingLabel}>Push Notifications</Text>
                  <Switch
                    value={settings.enablePushNotifications}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, enablePushNotifications: value }))}
                    trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                    thumbColor={settings.enablePushNotifications ? '#1e40af' : '#9ca3af'}
                  />
                </View>

                <View style={styles.settingItem}>
                  <Text style={styles.settingLabel}>Email Notifications</Text>
                  <Switch
                    value={settings.enableEmailNotifications}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, enableEmailNotifications: value }))}
                    trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                    thumbColor={settings.enableEmailNotifications ? '#1e40af' : '#9ca3af'}
                  />
                </View>

                <View style={styles.settingItem}>
                  <Text style={styles.settingLabel}>SMS Notifications</Text>
                  <Switch
                    value={settings.enableSMSNotifications}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, enableSMSNotifications: value }))}
                    trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                    thumbColor={settings.enableSMSNotifications ? '#1e40af' : '#9ca3af'}
                  />
                </View>
              </View>

              <View style={styles.settingsGroup}>
                <Text style={styles.settingsGroupTitle}>Limits & Timing</Text>
                
                <View style={styles.settingItem}>
                  <Text style={styles.settingLabel}>Max Daily Notifications</Text>
                  <TextInput
                    style={styles.settingInput}
                    value={settings.maxDailyNotifications.toString()}
                    onChangeText={(text) => setSettings(prev => ({ ...prev, maxDailyNotifications: parseInt(text) || 0 }))}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.settingItem}>
                  <Text style={styles.settingLabel}>Quiet Hours Start</Text>
                  <TextInput
                    style={styles.settingInput}
                    value={settings.quietHoursStart}
                    onChangeText={(text) => setSettings(prev => ({ ...prev, quietHoursStart: text }))}
                    placeholder="HH:MM"
                  />
                </View>

                <View style={styles.settingItem}>
                  <Text style={styles.settingLabel}>Quiet Hours End</Text>
                  <TextInput
                    style={styles.settingInput}
                    value={settings.quietHoursEnd}
                    onChangeText={(text) => setSettings(prev => ({ ...prev, quietHoursEnd: text }))}
                    placeholder="HH:MM"
                  />
                </View>
              </View>

              <View style={styles.settingsGroup}>
                <Text style={styles.settingsGroupTitle}>Analytics</Text>
                
                <View style={styles.settingItem}>
                  <Text style={styles.settingLabel}>Enable Analytics Tracking</Text>
                  <Switch
                    value={settings.enableAnalytics}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, enableAnalytics: value }))}
                    trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                    thumbColor={settings.enableAnalytics ? '#1e40af' : '#9ca3af'}
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.saveButton}>
                <CheckCircle size={16} color="#ffffff" />
                <Text style={styles.saveButtonText}>Save Settings</Text>
              </TouchableOpacity>
            </AnimatedCard>
          )}
        </ScrollView>

        {/* Template Modal */}
        <Modal
          visible={showTemplateModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowTemplateModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {selectedTemplate ? 'Edit Template' : 'Create Template'}
              </Text>
              
              {/* Template form would go here */}
              
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowTemplateModal(false)}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalSaveButton}>
                  <Text style={styles.modalSaveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  headerSpacer: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 4,
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#1e40af',
  },
  tabButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  tabButtonTextActive: {
    color: '#1e40af',
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
    marginBottom: 20,
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1e40af',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    backgroundColor: '#f9fafb',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  audienceContainer: {
    gap: 8,
  },
  audienceButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    backgroundColor: '#f9fafb',
  },
  audienceButtonActive: {
    borderColor: '#1e40af',
    backgroundColor: '#eff6ff',
  },
  audienceButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  audienceButtonTextActive: {
    color: '#1e40af',
  },
  audienceCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  scheduleToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e40af',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  sendButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  templateCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  templateCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  templateActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  templateActionButton: {
    padding: 4,
  },
  templateTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  templateBody: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginBottom: 8,
  },
  templateStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  templateStat: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
  scheduledCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  scheduledHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduledTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  scheduledBody: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginBottom: 12,
  },
  scheduledInfo: {
    gap: 8,
  },
  scheduledInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scheduledInfoText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
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
  settingLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    flex: 1,
  },
  settingInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    backgroundColor: '#ffffff',
    minWidth: 80,
    textAlign: 'center',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: '#1e40af',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalSaveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});