import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  Bell, 
  Shield, 
  Eye, 
  EyeOff, 
  Smartphone, 
  Globe, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX,
  Lock,
  Key,
  CreditCard,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react-native';
import AnimatedCard from '@/components/AnimatedCard';
import GradientBackground from '@/components/GradientBackground';

export default function UserSettingsScreen() {
  const router = useRouter();
  
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
    outbid: true,
    endingSoon: true,
    newAuctions: false,
    connects: true,
    wonItems: true,
    marketing: false,
    weeklyDigest: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showBidHistory: false,
    showWonItems: true,
    allowMessages: true,
    showOnlineStatus: true,
    dataCollection: true,
    personalizedAds: false,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    biometric: true,
    sessionTimeout: '30',
    loginAlerts: true,
    deviceTracking: true,
  });

  const [app, setApp] = useState({
    darkMode: false,
    soundEffects: true,
    hapticFeedback: true,
    autoRefresh: true,
    dataUsage: 'wifi',
    language: 'en',
    currency: 'USD',
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    Alert.alert(
      'Password Changed',
      'Your password has been updated successfully',
      [{ text: 'OK', onPress: () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }}]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone and you will lose all your data, including won items and Connects balance.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Account', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Account Deleted',
              'Your account has been scheduled for deletion. You have 30 days to reactivate it by logging in.',
              [{ text: 'OK', onPress: () => router.replace('/auth') }]
            );
          }
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'We will prepare your data export and send it to your email address within 24 hours.',
      [{ text: 'OK' }]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data and may improve app performance.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear Cache', 
          onPress: () => {
            Alert.alert('Success', 'Cache cleared successfully');
          }
        },
      ]
    );
  };

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
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Notifications */}
          <AnimatedCard delay={100} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Bell size={20} color="#1e40af" />
              <Text style={styles.sectionTitle}>Notifications</Text>
            </View>
            
            <View style={styles.settingsGroup}>
              <Text style={styles.groupTitle}>Channels</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Push Notifications</Text>
                  <Text style={styles.settingDescription}>Receive notifications on your device</Text>
                </View>
                <Switch
                  value={notifications.push}
                  onValueChange={(value) => setNotifications(prev => ({ ...prev, push: value }))}
                  trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                  thumbColor={notifications.push ? '#1e40af' : '#9ca3af'}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Email Notifications</Text>
                  <Text style={styles.settingDescription}>Receive notifications via email</Text>
                </View>
                <Switch
                  value={notifications.email}
                  onValueChange={(value) => setNotifications(prev => ({ ...prev, email: value }))}
                  trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                  thumbColor={notifications.email ? '#1e40af' : '#9ca3af'}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>SMS Notifications</Text>
                  <Text style={styles.settingDescription}>Receive notifications via text message</Text>
                </View>
                <Switch
                  value={notifications.sms}
                  onValueChange={(value) => setNotifications(prev => ({ ...prev, sms: value }))}
                  trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                  thumbColor={notifications.sms ? '#1e40af' : '#9ca3af'}
                />
              </View>
            </View>

            <View style={styles.settingsGroup}>
              <Text style={styles.groupTitle}>Auction Alerts</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Outbid Notifications</Text>
                  <Text style={styles.settingDescription}>When someone outbids you</Text>
                </View>
                <Switch
                  value={notifications.outbid}
                  onValueChange={(value) => setNotifications(prev => ({ ...prev, outbid: value }))}
                  trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                  thumbColor={notifications.outbid ? '#1e40af' : '#9ca3af'}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Ending Soon</Text>
                  <Text style={styles.settingDescription}>Auctions ending in the next hour</Text>
                </View>
                <Switch
                  value={notifications.endingSoon}
                  onValueChange={(value) => setNotifications(prev => ({ ...prev, endingSoon: value }))}
                  trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                  thumbColor={notifications.endingSoon ? '#1e40af' : '#9ca3af'}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>New Auctions</Text>
                  <Text style={styles.settingDescription}>Daily new auction notifications</Text>
                </View>
                <Switch
                  value={notifications.newAuctions}
                  onValueChange={(value) => setNotifications(prev => ({ ...prev, newAuctions: value }))}
                  trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                  thumbColor={notifications.newAuctions ? '#1e40af' : '#9ca3af'}
                />
              </View>
            </View>
          </AnimatedCard>

          {/* Privacy & Security */}
          <AnimatedCard delay={200} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Shield size={20} color="#16a34a" />
              <Text style={styles.sectionTitle}>Privacy & Security</Text>
            </View>
            
            <View style={styles.settingsGroup}>
              <Text style={styles.groupTitle}>Profile Privacy</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Public Profile</Text>
                  <Text style={styles.settingDescription}>Allow others to view your profile</Text>
                </View>
                <Switch
                  value={privacy.profileVisible}
                  onValueChange={(value) => setPrivacy(prev => ({ ...prev, profileVisible: value }))}
                  trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                  thumbColor={privacy.profileVisible ? '#1e40af' : '#9ca3af'}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Show Bid History</Text>
                  <Text style={styles.settingDescription}>Display your bidding activity</Text>
                </View>
                <Switch
                  value={privacy.showBidHistory}
                  onValueChange={(value) => setPrivacy(prev => ({ ...prev, showBidHistory: value }))}
                  trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                  thumbColor={privacy.showBidHistory ? '#1e40af' : '#9ca3af'}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Show Won Items</Text>
                  <Text style={styles.settingDescription}>Display items you've won</Text>
                </View>
                <Switch
                  value={privacy.showWonItems}
                  onValueChange={(value) => setPrivacy(prev => ({ ...prev, showWonItems: value }))}
                  trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                  thumbColor={privacy.showWonItems ? '#1e40af' : '#9ca3af'}
                />
              </View>
            </View>

            <View style={styles.settingsGroup}>
              <Text style={styles.groupTitle}>Account Security</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Two-Factor Authentication</Text>
                  <Text style={styles.settingDescription}>Add extra security to your account</Text>
                </View>
                <Switch
                  value={security.twoFactor}
                  onValueChange={(value) => setSecurity(prev => ({ ...prev, twoFactor: value }))}
                  trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                  thumbColor={security.twoFactor ? '#1e40af' : '#9ca3af'}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Biometric Login</Text>
                  <Text style={styles.settingDescription}>Use fingerprint or face ID</Text>
                </View>
                <Switch
                  value={security.biometric}
                  onValueChange={(value) => setSecurity(prev => ({ ...prev, biometric: value }))}
                  trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                  thumbColor={security.biometric ? '#1e40af' : '#9ca3af'}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Login Alerts</Text>
                  <Text style={styles.settingDescription}>Get notified of new device logins</Text>
                </View>
                <Switch
                  value={security.loginAlerts}
                  onValueChange={(value) => setSecurity(prev => ({ ...prev, loginAlerts: value }))}
                  trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                  thumbColor={security.loginAlerts ? '#1e40af' : '#9ca3af'}
                />
              </View>
            </View>
          </AnimatedCard>

          {/* Change Password */}
          <AnimatedCard delay={300} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Key size={20} color="#f59e0b" />
              <Text style={styles.sectionTitle}>Change Password</Text>
            </View>
            
            <View style={styles.passwordForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Current Password</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Enter current password"
                    secureTextEntry={!showPasswords}
                    placeholderTextColor="#9ca3af"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPasswords(!showPasswords)}
                  >
                    {showPasswords ? (
                      <EyeOff size={20} color="#6b7280" />
                    ) : (
                      <Eye size={20} color="#6b7280" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>New Password</Text>
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  secureTextEntry={!showPasswords}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm New Password</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  secureTextEntry={!showPasswords}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <TouchableOpacity
                style={styles.changePasswordButton}
                onPress={handlePasswordChange}
              >
                <Lock size={16} color="#ffffff" />
                <Text style={styles.changePasswordButtonText}>Update Password</Text>
              </TouchableOpacity>
            </View>
          </AnimatedCard>

          {/* App Preferences */}
          <AnimatedCard delay={400} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Smartphone size={20} color="#7c3aed" />
              <Text style={styles.sectionTitle}>App Preferences</Text>
            </View>
            
            <View style={styles.settingsGroup}>
              <Text style={styles.groupTitle}>Appearance</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Dark Mode</Text>
                  <Text style={styles.settingDescription}>Use dark theme</Text>
                </View>
                <Switch
                  value={app.darkMode}
                  onValueChange={(value) => setApp(prev => ({ ...prev, darkMode: value }))}
                  trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                  thumbColor={app.darkMode ? '#1e40af' : '#9ca3af'}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Sound Effects</Text>
                  <Text style={styles.settingDescription}>Play sounds for interactions</Text>
                </View>
                <Switch
                  value={app.soundEffects}
                  onValueChange={(value) => setApp(prev => ({ ...prev, soundEffects: value }))}
                  trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                  thumbColor={app.soundEffects ? '#1e40af' : '#9ca3af'}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Haptic Feedback</Text>
                  <Text style={styles.settingDescription}>Vibrate for touch feedback</Text>
                </View>
                <Switch
                  value={app.hapticFeedback}
                  onValueChange={(value) => setApp(prev => ({ ...prev, hapticFeedback: value }))}
                  trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                  thumbColor={app.hapticFeedback ? '#1e40af' : '#9ca3af'}
                />
              </View>
            </View>

            <View style={styles.settingsGroup}>
              <Text style={styles.groupTitle}>Performance</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Auto Refresh</Text>
                  <Text style={styles.settingDescription}>Automatically refresh auction data</Text>
                </View>
                <Switch
                  value={app.autoRefresh}
                  onValueChange={(value) => setApp(prev => ({ ...prev, autoRefresh: value }))}
                  trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                  thumbColor={app.autoRefresh ? '#1e40af' : '#9ca3af'}
                />
              </View>

              <TouchableOpacity style={styles.actionButton} onPress={handleClearCache}>
                <RefreshCw size={16} color="#6b7280" />
                <Text style={styles.actionButtonText}>Clear Cache</Text>
              </TouchableOpacity>
            </View>
          </AnimatedCard>

          {/* Data & Privacy */}
          <AnimatedCard delay={500} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Globe size={20} color="#0ea5e9" />
              <Text style={styles.sectionTitle}>Data & Privacy</Text>
            </View>
            
            <View style={styles.actionsList}>
              <TouchableOpacity style={styles.actionButton} onPress={handleExportData}>
                <Download size={16} color="#6b7280" />
                <Text style={styles.actionButtonText}>Export My Data</Text>
                <Text style={styles.actionButtonDescription}>Download all your account data</Text>
              </TouchableOpacity>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Data Collection</Text>
                  <Text style={styles.settingDescription}>Allow analytics and usage data</Text>
                </View>
                <Switch
                  value={privacy.dataCollection}
                  onValueChange={(value) => setPrivacy(prev => ({ ...prev, dataCollection: value }))}
                  trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                  thumbColor={privacy.dataCollection ? '#1e40af' : '#9ca3af'}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Personalized Ads</Text>
                  <Text style={styles.settingDescription}>Show ads based on your interests</Text>
                </View>
                <Switch
                  value={privacy.personalizedAds}
                  onValueChange={(value) => setPrivacy(prev => ({ ...prev, personalizedAds: value }))}
                  trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                  thumbColor={privacy.personalizedAds ? '#1e40af' : '#9ca3af'}
                />
              </View>
            </View>
          </AnimatedCard>

          {/* Danger Zone */}
          <AnimatedCard delay={600} style={styles.dangerSection}>
            <View style={styles.sectionHeader}>
              <AlertTriangle size={20} color="#ef4444" />
              <Text style={[styles.sectionTitle, styles.dangerTitle]}>Danger Zone</Text>
            </View>
            
            <View style={styles.dangerActions}>
              <TouchableOpacity 
                style={styles.dangerButton}
                onPress={handleDeleteAccount}
              >
                <Trash2 size={16} color="#ef4444" />
                <View style={styles.dangerButtonContent}>
                  <Text style={styles.dangerButtonText}>Delete Account</Text>
                  <Text style={styles.dangerButtonDescription}>
                    Permanently delete your account and all data
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </AnimatedCard>

          {/* Info Section */}
          <AnimatedCard delay={700} style={styles.infoSection}>
            <View style={styles.infoContent}>
              <Info size={16} color="#6b7280" />
              <Text style={styles.infoText}>
                Changes to your settings are saved automatically. Some changes may require you to restart the app.
              </Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  dangerSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#fecaca',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  infoSection: {
    backgroundColor: '#f0f9ff',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginLeft: 8,
  },
  dangerTitle: {
    color: '#ef4444',
  },
  settingsGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6b7280',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  passwordForm: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
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
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    backgroundColor: '#f9fafb',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  eyeButton: {
    padding: 12,
  },
  changePasswordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e40af',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  changePasswordButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  actionsList: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginLeft: 12,
    flex: 1,
  },
  actionButtonDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginLeft: 12,
  },
  dangerActions: {
    gap: 12,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#fecaca',
  },
  dangerButtonContent: {
    flex: 1,
    marginLeft: 12,
  },
  dangerButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ef4444',
    marginBottom: 2,
  },
  dangerButtonDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#f87171',
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginLeft: 8,
    lineHeight: 20,
    flex: 1,
  },
});