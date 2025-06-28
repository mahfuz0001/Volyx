import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  User,
  Settings,
  Bell,
  Circle as HelpCircle,
  LogOut,
  Trophy,
  Gavel,
  Coins,
  Calendar,
  ChevronRight,
  Eye,
  Heart,
  History,
  FileText,
  CircleUser as UserCircle,
  Shield,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedCard from '@/components/AnimatedCard';
import ConnectsBalance from '@/components/ConnectsBalance';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Import useSafeAreaInsets
import {
  mockUserData,
  mockWonItems,
  mockConnectsTransactions, // Retained for completeness, though not directly used in the current render
} from '@/data/mockData';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets(); // Get safe area insets

  const [notifications, setNotifications] = useState({
    outbid: true,
    ending: true,
    newAuctions: false,
    connects: true,
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Retained for completeness, not actively used in this UI version
  const formatTransactionAmount = (amount: number, type: string) => {
    const sign = type === 'spent' ? '-' : '+';
    const color = type === 'spent' ? '#ef4444' : '#16a34a';
    return { text: `${sign}${Math.abs(amount).toLocaleString()}`, color };
  };

  const handleLogout = () => {
    // In a real app, this would clear auth state (e.g., using context or storage)
    // and then navigate.
    // For now, it just navigates back to the auth screen.
    router.replace('/auth');
  };

  const MenuSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <AnimatedCard style={styles.section}>
      {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}
      {children}
    </AnimatedCard>
  );

  const MenuItem = ({
    icon: IconComponent,
    title,
    subtitle,
    onPress,
    showChevron = true,
    danger = false,
    hasSwitch = false,
    switchValue,
    onSwitchChange,
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress?: () => void; // Made optional for items with switch
    showChevron?: boolean;
    danger?: boolean;
    hasSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
  }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress || (() => {})} // Provide empty function if no onPress for switch items
      activeOpacity={hasSwitch ? 1 : 0.7} // Disable activeOpacity for switch items
      disabled={hasSwitch} // Disable touch feedback on the whole row if it has a switch
    >
      <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
        <IconComponent size={20} color={danger ? '#EF4444' : '#6B7280'} />
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuTitle, danger && styles.menuTitleDanger]}>
          {title}
        </Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      {hasSwitch ? (
        <Switch
          trackColor={{ false: '#E5E7EB', true: '#FF7F00' }}
          thumbColor={'#FFFFFF'}
          ios_backgroundColor="#E5E7EB"
          onValueChange={onSwitchChange}
          value={switchValue}
        />
      ) : (
        showChevron && <ChevronRight size={16} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Profile Header */}
        <AnimatedCard delay={100} style={styles.profileHeader}>
          <LinearGradient
            colors={['#FF7F00', '#FF6B35']}
            style={styles.profileGradient}
          >
            <View style={styles.profileInfo}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <User size={32} color="#FFFFFF" />
                </View>
                <View style={styles.verifiedBadge}>
                  <Shield size={12} color="#FFFFFF" fill="#16A34A" />
                </View>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{mockUserData.name}</Text>
                <Text style={styles.userEmail}>{mockUserData.email}</Text>
                <View style={styles.joinDate}>
                  <Calendar size={14} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.joinDateText}>
                    Member since {formatDate(mockUserData.joinedDate)}
                  </Text>
                </View>
              </View>
            </View>

            <ConnectsBalance
              balance={mockUserData.connectsBalance}
              onPress={() => router.push('/get-connects')}
              showAddButton={true}
            />
          </LinearGradient>
        </AnimatedCard>

        {/* Stats */}
        <AnimatedCard delay={200} style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Coins size={20} color="#f59e0b" />
            <Text style={styles.statNumber}>
              {mockUserData.connectsBalance.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Connects</Text>
          </View>
          <View style={styles.statCard}>
            <Gavel size={20} color="#1e40af" />
            <Text style={styles.statNumber}>{mockUserData.totalBids}</Text>
            <Text style={styles.statLabel}>Total Bids</Text>
          </View>
          <View style={styles.statCard}>
            <Trophy size={20} color="#16a34a" />
            <Text style={styles.statNumber}>{mockUserData.itemsWon}</Text>
            <Text style={styles.statLabel}>Items Won</Text>
          </View>
        </AnimatedCard>

        {/* Account Management */}
        <MenuSection title="Account">
          <MenuItem
            icon={UserCircle}
            title="Edit Profile"
            subtitle="Update your personal information"
            onPress={() => router.push('/user-profile')}
          />
          <MenuItem
            icon={Settings}
            title="App Settings"
            subtitle="Preferences and privacy"
            onPress={() => router.push('/settings')}
          />
        </MenuSection>

        {/* Notifications */}
        <MenuSection title="Notifications">
          <MenuItem
            icon={Bell}
            title="Outbid Alerts"
            subtitle="Receive a notification when you're outbid"
            hasSwitch={true}
            switchValue={notifications.outbid}
            onSwitchChange={(value) =>
              setNotifications((prev) => ({ ...prev, outbid: value }))
            }
            showChevron={false}
          />
          <MenuItem
            icon={Bell}
            title="Ending Soon Alerts"
            subtitle="Get reminded when auctions are about to end"
            hasSwitch={true}
            switchValue={notifications.ending}
            onSwitchChange={(value) =>
              setNotifications((prev) => ({ ...prev, ending: value }))
            }
            showChevron={false}
          />
          <MenuItem
            icon={Bell}
            title="New Auctions"
            subtitle="Stay updated on new listings in your interests"
            hasSwitch={true}
            switchValue={notifications.newAuctions}
            onSwitchChange={(value) =>
              setNotifications((prev) => ({ ...prev, newAuctions: value }))
            }
            showChevron={false}
          />
          <MenuItem
            icon={Coins} // Using Coins for Connects related notifications
            title="Connects Balance Alerts"
            subtitle="Receive alerts for Connects transactions"
            hasSwitch={true}
            switchValue={notifications.connects}
            onSwitchChange={(value) =>
              setNotifications((prev) => ({ ...prev, connects: value }))
            }
            showChevron={false}
          />
        </MenuSection>

        {/* My Activity */}
        <MenuSection title="My Activity">
          <MenuItem
            icon={History}
            title="Bid History"
            subtitle="View all your bidding activity"
            onPress={() => router.push('/bid-history')}
          />
          <MenuItem
            icon={Heart}
            title="Watchlist"
            subtitle="Items you're watching"
            onPress={() => router.push('/watchlist')}
          />
          <MenuItem
            icon={Eye}
            title="Recently Viewed"
            subtitle="Items you've looked at"
            onPress={() => {
              // Navigate to recently viewed items
              Alert.alert(
                'Coming Soon',
                'Recently Viewed feature is under development!'
              );
            }}
          />
        </MenuSection>

        {/* Won Items */}
        <MenuSection title="My Won Items">
          {mockWonItems.length > 0 ? (
            <View style={styles.wonItemsList}>
              {mockWonItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.wonItem}
                  onPress={() => router.push(`/product-detail?id=${item.id}`)} // Navigate to product detail
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.wonItemImage}
                  />
                  <View style={styles.wonItemInfo}>
                    <Text style={styles.wonItemTitle}>{item.title}</Text>
                    <Text style={styles.wonItemBid}>
                      Won for {item.winningBid.toLocaleString()} Connects
                    </Text>
                    <Text style={styles.wonItemDate}>
                      {formatDate(item.wonAt)}
                    </Text>
                  </View>
                  <ChevronRight size={16} color="#9ca3af" />
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => {
                  Alert.alert(
                    'Coming Soon',
                    'View All Won Items feature is under development!'
                  );
                }}
              >
                <Text style={styles.viewAllText}>View All Won Items</Text>
                <ChevronRight size={16} color="#1e40af" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptySection}>
              <Trophy size={32} color="#d1d5db" />
              <Text style={styles.emptyText}>No items won yet</Text>
            </View>
          )}
        </MenuSection>

        {/* Support & Legal */}
        <MenuSection title="Support & Legal">
          <MenuItem
            icon={HelpCircle}
            title="Help & Support"
            subtitle="Get help with your account"
            onPress={() => router.push('/help-support')}
          />
          <MenuItem
            icon={FileText}
            title="Terms & Privacy"
            subtitle="Legal documents and policies"
            onPress={() => router.push('/terms-privacy')}
          />
        </MenuSection>

        {/* Logout */}
        <MenuSection title="">
          <MenuItem
            icon={LogOut}
            title="Logout"
            subtitle="Sign out of your account"
            onPress={handleLogout}
            showChevron={false}
            danger
          />
        </MenuSection>

        {/* Bottom Padding for ScrollView */}
        <View style={{ height: insets.bottom + 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    // paddingTop handled by useSafeAreaInsets directly on the View
  },
  scrollViewContent: {
    paddingBottom: 100, // General padding at the bottom of the scroll view
  },
  profileHeader: {
    marginHorizontal: 16, // Adjusted margin
    marginTop: 20, // Added top margin for consistency
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileGradient: {
    padding: 24,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  verifiedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#16A34A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  joinDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinDateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16, // Adjusted margin
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000', // Added subtle shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10, // Adjusted padding
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16, // Adjusted margin
    marginBottom: 16,
    paddingTop: 20, // Adjusted padding
    paddingBottom: 8, // Adjusted padding for list items to have space
    paddingHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000', // Added subtle shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16, // Standardized margin
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14, // Adjusted padding for menu items
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  // Remove the last border for the last item in a section
  // This requires dynamic styling or a separate component for the last item
  // For simplicity, I'll just adjust the padding on the section itself.
  // The current `borderBottomWidth` will leave a line, which is often acceptable.

  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuIconDanger: {
    backgroundColor: '#fef2f2',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  menuTitleDanger: {
    color: '#EF4444',
  },
  menuSubtitle: {
    fontSize: 13, // Slightly smaller subtitle font
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  wonItemsList: {
    gap: 12, // Consistent gap for items within the list
    paddingBottom: 12, // Padding at the bottom of the list before 'View All'
  },
  wonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  wonItemImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    marginRight: 12,
  },
  wonItemInfo: {
    flex: 1,
  },
  wonItemTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  wonItemBid: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#16a34a',
    marginBottom: 2,
  },
  wonItemDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
    borderTopWidth: 1, // Add a subtle separator
    borderTopColor: '#f3f4f6',
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1e40af',
    marginRight: 4,
  },
  emptySection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginTop: 8,
  },
  // Removed bottomPadding as it's handled by scrollViewContent and insets.bottom
});
