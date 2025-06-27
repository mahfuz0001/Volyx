import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import { User, Settings, Bell, CircleHelp as HelpCircle, LogOut, Trophy, Gavel, Coins, Calendar, ChevronRight } from 'lucide-react-native';
import {
  mockUserData,
  mockWonItems,
  mockConnectsTransactions,
} from '@/data/mockData';

export default function ProfileScreen() {
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

  const formatTransactionAmount = (amount: number, type: string) => {
    const sign = type === 'spent' ? '-' : '+';
    const color = type === 'spent' ? '#ef4444' : '#16a34a';
    return { text: `${sign}${Math.abs(amount).toLocaleString()}`, color };
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={32} color="#1e40af" />
            </View>
          </View>
          <Text style={styles.userName}>{mockUserData.name}</Text>
          <Text style={styles.userEmail}>{mockUserData.email}</Text>
          <Text style={styles.joinDate}>
            Member since {formatDate(mockUserData.joinedDate)}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
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
        </View>

        {/* Won Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Won Items</Text>
          {mockWonItems.length > 0 ? (
            <View style={styles.wonItemsList}>
              {mockWonItems.map((item) => (
                <View key={item.id} style={styles.wonItem}>
                  <Image source={{ uri: item.image }} style={styles.wonItemImage} />
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
                </View>
              ))}
              <TouchableOpacity style={styles.viewAllButton}>
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
        </View>

        {/* Connects History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connects History</Text>
          <View style={styles.transactionsList}>
            {mockConnectsTransactions.slice(0, 5).map((transaction) => {
              const amountData = formatTransactionAmount(
                transaction.amount,
                transaction.type
              );
              return (
                <View key={transaction.id} style={styles.transaction}>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionDescription}>
                      {transaction.description}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {formatDate(transaction.timestamp)}
                    </Text>
                  </View>
                  <Text style={[styles.transactionAmount, { color: amountData.color }]}>
                    {amountData.text}
                  </Text>
                </View>
              );
            })}
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All Transactions</Text>
              <ChevronRight size={16} color="#1e40af" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Settings</Text>
          <View style={styles.settingsContainer}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Outbid Notifications</Text>
                <Text style={styles.settingDescription}>
                  Get notified when you're outbid
                </Text>
              </View>
              <Switch
                value={notifications.outbid}
                onValueChange={(value) =>
                  setNotifications({ ...notifications, outbid: value })
                }
                trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                thumbColor={notifications.outbid ? '#1e40af' : '#9ca3af'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Auction Ending Soon</Text>
                <Text style={styles.settingDescription}>
                  Reminders for auctions ending soon
                </Text>
              </View>
              <Switch
                value={notifications.ending}
                onValueChange={(value) =>
                  setNotifications({ ...notifications, ending: value })
                }
                trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                thumbColor={notifications.ending ? '#1e40af' : '#9ca3af'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>New Daily Auctions</Text>
                <Text style={styles.settingDescription}>
                  Discover new auctions each day
                </Text>
              </View>
              <Switch
                value={notifications.newAuctions}
                onValueChange={(value) =>
                  setNotifications({ ...notifications, newAuctions: value })
                }
                trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                thumbColor={notifications.newAuctions ? '#1e40af' : '#9ca3af'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Connects Activity</Text>
                <Text style={styles.settingDescription}>
                  Notifications for Connects earned/spent
                </Text>
              </View>
              <Switch
                value={notifications.connects}
                onValueChange={(value) =>
                  setNotifications({ ...notifications, connects: value })
                }
                trackColor={{ false: '#f3f4f6', true: '#bfdbfe' }}
                thumbColor={notifications.connects ? '#1e40af' : '#9ca3af'}
              />
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem}>
            <HelpCircle size={20} color="#6b7280" />
            <Text style={styles.menuItemText}>Help & Support</Text>
            <ChevronRight size={16} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Settings size={20} color="#6b7280" />
            <Text style={styles.menuItemText}>App Settings</Text>
            <ChevronRight size={16} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.logoutItem]}>
            <LogOut size={20} color="#ef4444" />
            <Text style={[styles.menuItemText, styles.logoutText]}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  profileHeader: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginBottom: 8,
  },
  joinDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    marginVertical: 8,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  wonItemsList: {
    gap: 12,
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
  transactionsList: {
    gap: 12,
  },
  transaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  transactionAmount: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 16,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
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
  settingsContainer: {
    gap: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    flex: 1,
    marginLeft: 12,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#ef4444',
  },
});