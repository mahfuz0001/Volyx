import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  MessageSquare,
  Eye,
  EyeOff,
  Lock,
  Key,
  Trash2,
  Download,
  Upload,
  HelpCircle,
  FileText,
  Users,
  Star,
  LogOut,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedCard from '@/components/AnimatedCard';

interface SettingsState {
  // Notifications
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  
  // Privacy
  profileVisibility: 'public' | 'private' | 'friends';
  showBidHistory: boolean;
  showWonItems: boolean;
  allowDataCollection: boolean;
  
  // Appearance
  darkMode: boolean;
  language: string;
  currency: string;
  
  // Security
  twoFactorEnabled: boolean;
  biometricLogin: boolean;
  autoLogout: boolean;
}

export default function SettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<SettingsState>({
    // Notifications
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    soundEnabled: true,
    vibrationEnabled: true,
    
    // Privacy
    profileVisibility: 'public',
    showBidHistory: true,
    showWonItems: true,
    allowDataCollection: false,
    
    // Appearance
    darkMode: false,
    language: 'English',
    currency: 'USD',
    
    // Security
    twoFactorEnabled: false,
    biometricLogin: true,
    autoLogout: true,
  });

  const updateSetting = (key: keyof SettingsState, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and you will lose all your data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been deleted.');
            router.replace('/auth');
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => router.replace('/auth') },
      ]
    );
  };

  const SettingItem = ({ 
    icon: IconComponent, 
    title, 
    description, 
    value, 
    onToggle,
    type = 'switch',
    onPress,
    rightText,
    showChevron = false,
    danger = false,
  }: {
    icon: any;
    title: string;
    description?: string;
    value?: boolean;
    onToggle?: (value: boolean) => void;
    type?: 'switch' | 'button' | 'navigation';
    onPress?: () => void;
    rightText?: string;
    showChevron?: boolean;
    danger?: boolean;
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={type === 'switch'}
      activeOpacity={type === 'switch' ? 1 : 0.7}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, danger && styles.settingIconDanger]}>
          <IconComponent size={20} color={danger ? '#EF4444' : '#6B7280'} />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, danger && styles.settingTitleDanger]}>
            {title}
          </Text>
          {description && (
            <Text style={styles.settingDescription}>{description}</Text>
          )}
        </View>
      </View>
      
      <View style={styles.settingRight}>
        {type === 'switch' && onToggle && (
          <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: '#E5E7EB', true: '#FF7F00' }}
            thumbColor="#FFFFFF"
          />
        )}
        {type === 'navigation' && (
          <View style={styles.navigationRight}>
            {rightText && (
              <Text style={styles.rightText}>{rightText}</Text>
            )}
            {showChevron && (
              <ChevronRight size={16} color="#9CA3AF" />
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

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
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Notifications */}
        <AnimatedCard delay={100} style={styles.settingsSection}>
          <SectionHeader title="Notifications" />
          <SettingItem
            icon={Bell}
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
          <SettingItem
            icon={settings.soundEnabled ? Volume2 : VolumeX}
            title="Sound"
            description="Play sound for notifications"
            value={settings.soundEnabled}
            onToggle={(value) => updateSetting('soundEnabled', value)}
          />
          <SettingItem
            icon={Smartphone}
            title="Vibration"
            description="Vibrate for notifications"
            value={settings.vibrationEnabled}
            onToggle={(value) => updateSetting('vibrationEnabled', value)}
          />
        </AnimatedCard>

        {/* Privacy & Security */}
        <AnimatedCard delay={200} style={styles.settingsSection}>
          <SectionHeader title="Privacy & Security" />
          <SettingItem
            icon={settings.profileVisibility === 'private' ? EyeOff : Eye}
            title="Profile Visibility"
            description="Control who can see your profile"
            type="navigation"
            rightText={settings.profileVisibility}
            showChevron
            onPress={() => {
              // Handle profile visibility selection
            }}
          />
          <SettingItem
            icon={Shield}
            title="Show Bid History"
            description="Allow others to see your bidding activity"
            value={settings.showBidHistory}
            onToggle={(value) => updateSetting('showBidHistory', value)}
          />
          <SettingItem
            icon={Award}
            title="Show Won Items"
            description="Display items you've won on your profile"
            value={settings.showWonItems}
            onToggle={(value) => updateSetting('showWonItems', value)}
          />
          <SettingItem
            icon={Lock}
            title="Two-Factor Authentication"
            description="Add an extra layer of security"
            value={settings.twoFactorEnabled}
            onToggle={(value) => updateSetting('twoFactorEnabled', value)}
          />
          <SettingItem
            icon={Key}
            title="Biometric Login"
            description="Use fingerprint or face ID to login"
            value={settings.biometricLogin}
            onToggle={(value) => updateSetting('biometricLogin', value)}
          />
          <SettingItem
            icon={Lock}
            title="Auto Logout"
            description="Automatically logout after inactivity"
            value={settings.autoLogout}
            onToggle={(value) => updateSetting('autoLogout', value)}
          />
        </AnimatedCard>

        {/* Appearance */}
        <AnimatedCard delay={300} style={styles.settingsSection}>
          <SectionHeader title="Appearance" />
          <SettingItem
            icon={settings.darkMode ? Moon : Sun}
            title="Dark Mode"
            description="Use dark theme throughout the app"
            value={settings.darkMode}
            onToggle={(value) => updateSetting('darkMode', value)}
          />
          <SettingItem
            icon={Globe}
            title="Language"
            description="Choose your preferred language"
            type="navigation"
            rightText={settings.language}
            showChevron
            onPress={() => {
              // Handle language selection
            }}
          />
          <SettingItem
            icon={CreditCard}
            title="Currency"
            description="Display currency preference"
            type="navigation"
            rightText={settings.currency}
            showChevron
            onPress={() => {
              // Handle currency selection
            }}
          />
        </AnimatedCard>

        {/* Account Management */}
        <AnimatedCard delay={400} style={styles.settingsSection}>
          <SectionHeader title="Account Management" />
          <SettingItem
            icon={Download}
            title="Export Data"
            description="Download your account data"
            type="navigation"
            showChevron
            onPress={() => {
              Alert.alert('Export Data', 'Your data export will be emailed to you within 24 hours.');
            }}
          />
          <SettingItem
            icon={Upload}
            title="Import Data"
            description="Import data from another account"
            type="navigation"
            showChevron
            onPress={() => {
              // Handle data import
            }}
          />
          <SettingItem
            icon={Shield}
            title="Data Collection"
            description="Allow anonymous usage analytics"
            value={settings.allowDataCollection}
            onToggle={(value) => updateSetting('allowDataCollection', value)}
          />
        </AnimatedCard>

        {/* Support & Legal */}
        <AnimatedCard delay={500} style={styles.settingsSection}>
          <SectionHeader title="Support & Legal" />
          <SettingItem
            icon={HelpCircle}
            title="Help & Support"
            description="Get help with your account"
            type="navigation"
            showChevron
            onPress={() => {
              // Navigate to help
            }}
          />
          <SettingItem
            icon={FileText}
            title="Terms of Service"
            type="navigation"
            showChevron
            onPress={() => {
              // Navigate to terms
            }}
          />
          <SettingItem
            icon={Shield}
            title="Privacy Policy"
            type="navigation"
            showChevron
            onPress={() => {
              // Navigate to privacy policy
            }}
          />
          <SettingItem
            icon={Users}
            title="Community Guidelines"
            type="navigation"
            showChevron
            onPress={() => {
              // Navigate to community guidelines
            }}
          />
          <SettingItem
            icon={Star}
            title="Rate the App"
            description="Help us improve by rating the app"
            type="navigation"
            showChevron
            onPress={() => {
              Alert.alert('Thank you!', 'Redirecting to app store...');
            }}
          />
        </AnimatedCard>

        {/* Danger Zone */}
        <AnimatedCard delay={600} style={styles.settingsSection}>
          <SectionHeader title="Danger Zone" />
          <SettingItem
            icon={LogOut}
            title="Logout"
            description="Sign out of your account"
            type="navigation"
            danger
            onPress={handleLogout}
          />
          <SettingItem
            icon={Trash2}
            title="Delete Account"
            description="Permanently delete your account and all data"
            type="navigation"
            danger
            onPress={handleDeleteAccount}
          />
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1A2B42',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  settingsSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  sectionHeader: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1A2B42',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  settingIconDanger: {
    backgroundColor: '#FEF2F2',
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
  settingTitleDanger: {
    color: '#EF4444',
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 18,
  },
  settingRight: {
    alignItems: 'flex-end',
  },
  navigationRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginRight: 8,
  },
  bottomPadding: {
    height: 100,
  },
});