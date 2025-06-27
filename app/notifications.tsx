import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Bell,
  TrendingUp,
  Clock,
  Gift,
  Award,
  Heart,
  Zap,
  Settings,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  MessageSquare,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedCard from '@/components/AnimatedCard';

interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  outbidAlerts: boolean;
  endingSoonAlerts: boolean;
  newAuctionsAlerts: boolean;
  connectsAlerts: boolean;
  wonItemsAlerts: boolean;
  curatorPicksAlerts: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  quietHours: boolean;
  quietStart: string;
  quietEnd: string;
}

interface NotificationItem {
  id: string;
  type: 'outbid' | 'ending_soon' | 'won' | 'connects' | 'new_auction' | 'curator_pick';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionable: boolean;
}

const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'outbid',
    title: 'You\'ve been outbid!',
    message: 'Someone placed a higher bid on "Vintage Rolex Submariner"',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    actionable: true,
  },
  {
    id: '2',
    type: 'ending_soon',
    title: 'Auction ending soon!',
    message: '"Limited Edition Hermès Birkin" ends in 15 minutes',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    read: false,
    actionable: true,
  },
  {
    id: '3',
    type: 'connects',
    title: 'Connects earned!',
    message: 'You earned 25 Connects for watching a video',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: true,
    actionable: false,
  },
  {
    id: '4',
    type: 'won',
    title: 'Congratulations! You won!',
    message: 'You won "Vintage Gibson Les Paul" for 12,500 Connects',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: true,
    actionable: false,
  },
  {
    id: '5',
    type: 'new_auction',
    title: 'New curated auctions available!',
    message: '5 new premium items are now available for bidding',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: true,
    actionable: true,
  },
  {
    id: '6',
    type: 'curator_pick',
    title: 'Curator\'s Choice Alert!',
    message: 'A rare 1960s Omega Speedmaster has been featured',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    read: true,
    actionable: true,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'notifications' | 'settings'>('notifications');
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [settings, setSettings] = useState<NotificationSettings>({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    outbidAlerts: true,
    endingSoonAlerts: true,
    newAuctionsAlerts: false,
    connectsAlerts: true,
    wonItemsAlerts: true,
    curatorPicksAlerts: true,
    soundEnabled: true,
    vibrationEnabled: true,
    quietHours: false,
    quietStart: '22:00',
    quietEnd: '08:00',
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'outbid': return TrendingUp;
      case 'ending_soon': return Clock;
      case 'won': return Award;
      case 'connects': return Gift;
      case 'new_auction': return Bell;
      case 'curator_pick': return Heart;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'outbid': return '#EF4444';
      case 'ending_soon': return '#F59E0B';
      case 'won': return '#16A34A';
      case 'connects': return '#FF7F00';
      case 'new_auction': return '#2196F3';
      case 'curator_pick': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const NotificationCard = ({ notification }: { notification: NotificationItem }) => {
    const IconComponent = getNotificationIcon(notification.type);
    const iconColor = getNotificationColor(notification.type);

    return (
      <TouchableOpacity
        style={[
          styles.notificationCard,
          !notification.read && styles.unreadNotification
        ]}
        onPress={() => markAsRead(notification.id)}
        activeOpacity={0.7}
      >
        <View style={styles.notificationContent}>
          <View style={[styles.notificationIcon, { backgroundColor: `${iconColor}20` }]}>
            <IconComponent size={20} color={iconColor} />
          </View>
          <View style={styles.notificationText}>
            <Text style={[
              styles.notificationTitle,
              !notification.read && styles.unreadTitle
            ]}>
              {notification.title}
            </Text>
            <Text style={styles.notificationMessage}>
              {notification.message}
            </Text>
            <Text style={styles.notificationTime}>
              {formatTimestamp(notification.timestamp)}
            </Text>
          </View>
          {!notification.read && <View style={styles.unreadDot} />}
        </View>
      </TouchableOpacity>
    );
  };

  const SettingItem = ({ 
    icon: IconComponent, 
    title, 
    description, 
    value, 
    onToggle 
  }: {
    icon: any;
    title: string;
    description: string;
    value: boolean;
    onToggle: (value: boolean) => void;
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <IconComponent size={20} color="#6B7280" />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#E5E7EB', true: '#FF7F00' }}
        thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
      />
    </View>
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#1A2B42" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {activeTab === 'notifications' && unreadCount > 0 && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={markAllAsRead}
          >
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'notifications' && styles.activeTab
          ]}
          onPress={() => setActiveTab('notifications')}
        >
          <Bell size={16} color={activeTab === 'notifications' ? '#FFFFFF' : '#6B7280'} />
          <Text style={[
            styles.tabText,
            activeTab === 'notifications' && styles.activeTabText
          ]}>
            Notifications
          </Text>
          {unreadCount > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'settings' && styles.activeTab
          ]}
          onPress={() => setActiveTab('settings')}
        >
          <Settings size={16} color={activeTab === 'settings' ? '#FFFFFF' : '#6B7280'} />
          <Text style={[
            styles.tabText,
            activeTab === 'settings' && styles.activeTabText
          ]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'notifications' ? (
          <View style={styles.notificationsContainer}>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))
            ) : (
              <AnimatedCard style={styles.emptyState}>
                <Bell size={64} color="#D1D5DB" />
                <Text style={styles.emptyTitle}>No notifications yet</Text>
                <Text style={styles.emptySubtitle}>
                  You'll see notifications about your auctions and account activity here
                </Text>
              </AnimatedCard>
            )}
          </View>
        ) : (
          <View style={styles.settingsContainer}>
            {/* Delivery Methods */}
            <AnimatedCard delay={100} style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>Delivery Methods</Text>
              <SettingItem
                icon={Smartphone}
                title="Push Notifications"
                description="Receive notifications on your device"
                value={settings.pushNotifications}
                onToggle={(value) => updateSetting('pushNotifications', value)}
              />
              <SettingItem
                icon={Mail}
                title="Email Notifications"
                description="Receive notifications via email"
                value={settings.emailNotifications}
                onToggle={(value) => updateSetting('emailNotifications', value)}
              />
              <SettingItem
                icon={MessageSquare}
                title="SMS Notifications"
                description="Receive notifications via text message"
                value={settings.smsNotifications}
                onToggle={(value) => updateSetting('smsNotifications', value)}
              />
            </AnimatedCard>

            {/* Auction Alerts */}
            <AnimatedCard delay={200} style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>Auction Alerts</Text>
              <SettingItem
                icon={TrendingUp}
                title="Outbid Alerts"
                description="When someone outbids you"
                value={settings.outbidAlerts}
                onToggle={(value) => updateSetting('outbidAlerts', value)}
              />
              <SettingItem
                icon={Clock}
                title="Ending Soon Alerts"
                description="When auctions you're watching end soon"
                value={settings.endingSoonAlerts}
                onToggle={(value) => updateSetting('endingSoonAlerts', value)}
              />
              <SettingItem
                icon={Award}
                title="Won Items Alerts"
                description="When you win an auction"
                value={settings.wonItemsAlerts}
                onToggle={(value) => updateSetting('wonItemsAlerts', value)}
              />
              <SettingItem
                icon={Heart}
                title="Curator's Picks"
                description="When new featured items are added"
                value={settings.curatorPicksAlerts}
                onToggle={(value) => updateSetting('curatorPicksAlerts', value)}
              />
            </AnimatedCard>

            {/* General Alerts */}
            <AnimatedCard delay={300} style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>General Alerts</Text>
              <SettingItem
                icon={Bell}
                title="New Auctions"
                description="Daily digest of new auctions"
                value={settings.newAuctionsAlerts}
                onToggle={(value) => updateSetting('newAuctionsAlerts', value)}
              />
              <SettingItem
                icon={Gift}
                title="Connects Activity"
                description="When you earn or spend Connects"
                value={settings.connectsAlerts}
                onToggle={(value) => updateSetting('connectsAlerts', value)}
              />
            </AnimatedCard>

            {/* Sound & Vibration */}
            <AnimatedCard delay={400} style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>Sound & Vibration</Text>
              <SettingItem
                icon={settings.soundEnabled ? Volume2 : VolumeX}
                title="Sound"
                description="Play sound for notifications"
                value={settings.soundEnabled}
                onToggle={(value) => updateSetting('soundEnabled', value)}
              />
              <SettingItem
                icon={Zap}
                title="Vibration"
                description="Vibrate for notifications"
                value={settings.vibrationEnabled}
                onToggle={(value) => updateSetting('vibrationEnabled', value)}
              />
            </AnimatedCard>
          </View>
        )}
        
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1A2B42',
  },
  markAllButton: {
    padding: 8,
  },
  markAllText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FF7F00',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#FF7F00',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  tabBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  tabBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    marginTop: 16,
  },
  notificationsContainer: {
    paddingHorizontal: 20,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF7F00',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1A2B42',
    marginBottom: 4,
  },
  unreadTitle: {
    fontFamily: 'Inter-Bold',
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF7F00',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1A2B42',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  settingsContainer: {
    paddingHorizontal: 20,
  },
  settingsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1A2B42',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1A2B42',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  bottomPadding: {
    height: 100,
  },
});