import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Search, ListFilter as Filter, MoveVertical as MoreVertical, Ban, CircleCheck as CheckCircle, Circle as XCircle, LocationEdit as Edit, Trash2, Shield, Crown, Mail, Phone, Calendar, Coins, TrendingUp, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import AnimatedCard from '@/components/AnimatedCard';
import GradientBackground from '@/components/GradientBackground';
import LoadingSpinner from '@/components/LoadingSpinner';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  connectsBalance: number;
  totalSpent: number;
  totalBids: number;
  itemsWon: number;
  joinedDate: string;
  lastActive: string;
  status: 'active' | 'suspended' | 'banned';
  isAdmin: boolean;
  isCurator: boolean;
  trustScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  flags: string[];
}

export default function ManageUsersScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended' | 'banned'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, filterStatus]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          connectsBalance: 2750,
          totalSpent: 15680,
          totalBids: 47,
          itemsWon: 8,
          joinedDate: '2024-01-15',
          lastActive: '2024-01-20',
          status: 'active',
          isAdmin: false,
          isCurator: false,
          trustScore: 95,
          riskLevel: 'low',
          flags: [],
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          connectsBalance: 890,
          totalSpent: 5420,
          totalBids: 23,
          itemsWon: 3,
          joinedDate: '2024-01-10',
          lastActive: '2024-01-19',
          status: 'active',
          isAdmin: false,
          isCurator: true,
          trustScore: 88,
          riskLevel: 'low',
          flags: [],
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike.johnson@example.com',
          connectsBalance: 45,
          totalSpent: 890,
          totalBids: 156,
          itemsWon: 1,
          joinedDate: '2024-01-05',
          lastActive: '2024-01-18',
          status: 'suspended',
          isAdmin: false,
          isCurator: false,
          trustScore: 45,
          riskLevel: 'high',
          flags: ['Suspicious bidding pattern', 'Multiple failed payments'],
        },
        {
          id: '4',
          name: 'Sarah Wilson',
          email: 'sarah.wilson@example.com',
          connectsBalance: 12500,
          totalSpent: 45000,
          totalBids: 234,
          itemsWon: 45,
          joinedDate: '2023-12-01',
          lastActive: '2024-01-20',
          status: 'active',
          isAdmin: false,
          isCurator: false,
          trustScore: 98,
          riskLevel: 'low',
          flags: [],
        },
        {
          id: '5',
          name: 'Admin User',
          email: 'admin@volyx.com',
          connectsBalance: 100000,
          totalSpent: 0,
          totalBids: 0,
          itemsWon: 0,
          joinedDate: '2023-11-01',
          lastActive: '2024-01-20',
          status: 'active',
          isAdmin: true,
          isCurator: true,
          trustScore: 100,
          riskLevel: 'low',
          flags: [],
        },
      ];

      setUsers(mockUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => user.status === filterStatus);
    }

    setFilteredUsers(filtered);
  };

  const handleUserAction = (action: string, user: User) => {
    setSelectedUser(user);
    
    switch (action) {
      case 'view':
        setShowUserModal(true);
        break;
      case 'suspend':
        Alert.alert(
          'Suspend User',
          `Are you sure you want to suspend ${user.name}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Suspend', style: 'destructive', onPress: () => updateUserStatus(user.id, 'suspended') },
          ]
        );
        break;
      case 'ban':
        Alert.alert(
          'Ban User',
          `Are you sure you want to ban ${user.name}? This action cannot be undone.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Ban', style: 'destructive', onPress: () => updateUserStatus(user.id, 'banned') },
          ]
        );
        break;
      case 'activate':
        updateUserStatus(user.id, 'active');
        break;
      case 'make_curator':
        toggleUserRole(user.id, 'curator');
        break;
      case 'make_admin':
        toggleUserRole(user.id, 'admin');
        break;
    }
  };

  const updateUserStatus = (userId: string, status: 'active' | 'suspended' | 'banned') => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status } : user
    ));
  };

  const toggleUserRole = (userId: string, role: 'curator' | 'admin') => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        if (role === 'curator') {
          return { ...user, isCurator: !user.isCurator };
        } else {
          return { ...user, isAdmin: !user.isAdmin };
        }
      }
      return user;
    }));
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      default: return '#16a34a';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#16a34a';
      case 'suspended': return '#f59e0b';
      case 'banned': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <GradientBackground colors={['#f8fafc', '#e2e8f0']}>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <LoadingSpinner size={48} />
            <Text style={styles.loadingText}>Loading users...</Text>
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
          <Text style={styles.headerTitle}>Manage Users</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Search and Filters */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#6b7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search users..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9ca3af"
            />
          </View>
          
          <View style={styles.filterContainer}>
            {['all', 'active', 'suspended', 'banned'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterButton,
                  filterStatus === status && styles.filterButtonActive,
                ]}
                onPress={() => setFilterStatus(status as any)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filterStatus === status && styles.filterButtonTextActive,
                  ]}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Users List */}
          <AnimatedCard delay={200} style={styles.section}>
            <Text style={styles.sectionTitle}>
              Users ({filteredUsers.length})
            </Text>
            
            {filteredUsers.map((user, index) => (
              <AnimatedCard key={user.id} delay={300 + index * 50} style={styles.userCard}>
                <View style={styles.userHeader}>
                  <View style={styles.userInfo}>
                    <View style={styles.userNameRow}>
                      <Text style={styles.userName}>{user.name}</Text>
                      {user.isAdmin && <Crown size={16} color="#f59e0b" />}
                      {user.isCurator && <Shield size={16} color="#1e40af" />}
                    </View>
                    <Text style={styles.userEmail}>{user.email}</Text>
                    <View style={styles.userStats}>
                      <View style={styles.userStat}>
                        <Coins size={12} color="#f59e0b" />
                        <Text style={styles.userStatText}>{user.connectsBalance.toLocaleString()}</Text>
                      </View>
                      <View style={styles.userStat}>
                        <TrendingUp size={12} color="#16a34a" />
                        <Text style={styles.userStatText}>{user.totalBids} bids</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.userActions}>
                    <View style={styles.userBadges}>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(user.status) }]}>
                        <Text style={styles.statusBadgeText}>{user.status}</Text>
                      </View>
                      <View style={[styles.riskBadge, { backgroundColor: getRiskColor(user.riskLevel) }]}>
                        <Text style={styles.riskBadgeText}>{user.riskLevel}</Text>
                      </View>
                    </View>
                    
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        setSelectedUser(user);
                        setShowActionModal(true);
                      }}
                    >
                      <MoreVertical size={20} color="#6b7280" />
                    </TouchableOpacity>
                  </View>
                </View>

                {user.flags.length > 0 && (
                  <View style={styles.flagsContainer}>
                    <AlertTriangle size={14} color="#ef4444" />
                    <Text style={styles.flagsText}>
                      {user.flags.join(', ')}
                    </Text>
                  </View>
                )}

                <View style={styles.userMetrics}>
                  <View style={styles.metric}>
                    <Text style={styles.metricValue}>${user.totalSpent.toLocaleString()}</Text>
                    <Text style={styles.metricLabel}>Total Spent</Text>
                  </View>
                  <View style={styles.metric}>
                    <Text style={styles.metricValue}>{user.itemsWon}</Text>
                    <Text style={styles.metricLabel}>Items Won</Text>
                  </View>
                  <View style={styles.metric}>
                    <Text style={styles.metricValue}>{user.trustScore}</Text>
                    <Text style={styles.metricLabel}>Trust Score</Text>
                  </View>
                </View>
              </AnimatedCard>
            ))}
          </AnimatedCard>
        </ScrollView>

        {/* User Detail Modal */}
        <Modal
          visible={showUserModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowUserModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>User Details</Text>
              
              {selectedUser && (
                <ScrollView style={styles.modalBody}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Name:</Text>
                    <Text style={styles.detailValue}>{selectedUser.name}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Email:</Text>
                    <Text style={styles.detailValue}>{selectedUser.email}</Text>
                  </View>
                  {selectedUser.phone && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Phone:</Text>
                      <Text style={styles.detailValue}>{selectedUser.phone}</Text>
                    </View>
                  )}
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Joined:</Text>
                    <Text style={styles.detailValue}>{selectedUser.joinedDate}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Last Active:</Text>
                    <Text style={styles.detailValue}>{selectedUser.lastActive}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Connects Balance:</Text>
                    <Text style={styles.detailValue}>{selectedUser.connectsBalance.toLocaleString()}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Total Spent:</Text>
                    <Text style={styles.detailValue}>${selectedUser.totalSpent.toLocaleString()}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Trust Score:</Text>
                    <Text style={styles.detailValue}>{selectedUser.trustScore}/100</Text>
                  </View>
                </ScrollView>
              )}
              
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowUserModal(false)}
              >
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Action Modal */}
        <Modal
          visible={showActionModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowActionModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.actionModalContent}>
              <Text style={styles.actionModalTitle}>User Actions</Text>
              
              <TouchableOpacity
                style={styles.actionModalButton}
                onPress={() => {
                  setShowActionModal(false);
                  handleUserAction('view', selectedUser!);
                }}
              >
                <Edit size={20} color="#1e40af" />
                <Text style={styles.actionModalButtonText}>View Details</Text>
              </TouchableOpacity>

              {selectedUser?.status === 'active' && (
                <TouchableOpacity
                  style={styles.actionModalButton}
                  onPress={() => {
                    setShowActionModal(false);
                    handleUserAction('suspend', selectedUser!);
                  }}
                >
                  <Ban size={20} color="#f59e0b" />
                  <Text style={styles.actionModalButtonText}>Suspend User</Text>
                </TouchableOpacity>
              )}

              {selectedUser?.status === 'suspended' && (
                <TouchableOpacity
                  style={styles.actionModalButton}
                  onPress={() => {
                    setShowActionModal(false);
                    handleUserAction('activate', selectedUser!);
                  }}
                >
                  <CheckCircle size={20} color="#16a34a" />
                  <Text style={styles.actionModalButtonText}>Activate User</Text>
                </TouchableOpacity>
              )}

              {selectedUser?.status !== 'banned' && (
                <TouchableOpacity
                  style={styles.actionModalButton}
                  onPress={() => {
                    setShowActionModal(false);
                    handleUserAction('ban', selectedUser!);
                  }}
                >
                  <XCircle size={20} color="#ef4444" />
                  <Text style={styles.actionModalButtonText}>Ban User</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.actionModalButton}
                onPress={() => {
                  setShowActionModal(false);
                  handleUserAction('make_curator', selectedUser!);
                }}
              >
                <Shield size={20} color="#1e40af" />
                <Text style={styles.actionModalButtonText}>
                  {selectedUser?.isCurator ? 'Remove Curator' : 'Make Curator'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionModalCancelButton}
                onPress={() => setShowActionModal(false)}
              >
                <Text style={styles.actionModalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    marginLeft: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  filterButtonActive: {
    backgroundColor: '#1e40af',
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  filterButtonTextActive: {
    color: '#ffffff',
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
  userCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginBottom: 8,
  },
  userStats: {
    flexDirection: 'row',
    gap: 16,
  },
  userStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userStatText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  userActions: {
    alignItems: 'flex-end',
  },
  userBadges: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
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
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  riskBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  actionButton: {
    padding: 4,
  },
  flagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fef2f2',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  flagsText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#dc2626',
    flex: 1,
  },
  userMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
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
  modalBody: {
    maxHeight: 400,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  modalCloseButton: {
    backgroundColor: '#1e40af',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  actionModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    width: '80%',
  },
  actionModalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  actionModalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f9fafb',
  },
  actionModalButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginLeft: 12,
  },
  actionModalCancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  actionModalCancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
});