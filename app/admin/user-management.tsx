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
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  Search, 
  Filter, 
  MoreVertical, 
  Ban, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Trash2, 
  Shield, 
  Crown, 
  Mail, 
  Phone, 
  Calendar, 
  Coins, 
  TrendingUp, 
  AlertTriangle,
  Download,
  Upload,
  RefreshCw,
  UserPlus,
  Settings
} from 'lucide-react-native';
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
  status: 'active' | 'suspended' | 'banned' | 'pending';
  isAdmin: boolean;
  isCurator: boolean;
  isVerified: boolean;
  trustScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  flags: string[];
  ipAddress?: string;
  deviceInfo?: string;
  location?: string;
  referralCode?: string;
  referredBy?: string;
  totalReferrals: number;
}

interface UserFilters {
  status: 'all' | 'active' | 'suspended' | 'banned' | 'pending';
  role: 'all' | 'user' | 'curator' | 'admin';
  riskLevel: 'all' | 'low' | 'medium' | 'high';
  verified: 'all' | 'verified' | 'unverified';
  dateRange: 'all' | '7d' | '30d' | '90d';
}

export default function UserManagementScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreateUser, setShowCreateUser] = useState(false);
  
  const [filters, setFilters] = useState<UserFilters>({
    status: 'all',
    role: 'all',
    riskLevel: 'all',
    verified: 'all',
    dateRange: 'all',
  });

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    connectsBalance: 100,
    sendWelcomeEmail: true,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock comprehensive user data
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
          isVerified: true,
          trustScore: 95,
          riskLevel: 'low',
          flags: [],
          ipAddress: '192.168.1.100',
          deviceInfo: 'iPhone 15 Pro',
          location: 'New York, NY',
          referralCode: 'JOHN2024',
          totalReferrals: 3,
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
          isVerified: true,
          trustScore: 88,
          riskLevel: 'low',
          flags: [],
          ipAddress: '10.0.0.45',
          deviceInfo: 'Samsung Galaxy S24',
          location: 'Los Angeles, CA',
          referralCode: 'JANE2024',
          totalReferrals: 1,
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
          isVerified: false,
          trustScore: 45,
          riskLevel: 'high',
          flags: ['Suspicious bidding pattern', 'Multiple failed payments', 'Rapid account creation'],
          ipAddress: '203.0.113.42',
          deviceInfo: 'Unknown Device',
          location: 'Unknown',
          totalReferrals: 0,
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
          isVerified: true,
          trustScore: 98,
          riskLevel: 'low',
          flags: [],
          ipAddress: '172.16.0.1',
          deviceInfo: 'iPad Pro',
          location: 'Chicago, IL',
          referralCode: 'SARAH2024',
          totalReferrals: 12,
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
          isVerified: true,
          trustScore: 100,
          riskLevel: 'low',
          flags: [],
          ipAddress: '127.0.0.1',
          deviceInfo: 'MacBook Pro',
          location: 'San Francisco, CA',
          totalReferrals: 0,
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

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(user => user.status === filters.status);
    }

    // Role filter
    if (filters.role !== 'all') {
      if (filters.role === 'admin') {
        filtered = filtered.filter(user => user.isAdmin);
      } else if (filters.role === 'curator') {
        filtered = filtered.filter(user => user.isCurator && !user.isAdmin);
      } else {
        filtered = filtered.filter(user => !user.isAdmin && !user.isCurator);
      }
    }

    // Risk level filter
    if (filters.riskLevel !== 'all') {
      filtered = filtered.filter(user => user.riskLevel === filters.riskLevel);
    }

    // Verified filter
    if (filters.verified !== 'all') {
      filtered = filtered.filter(user => 
        filters.verified === 'verified' ? user.isVerified : !user.isVerified
      );
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const days = filters.dateRange === '7d' ? 7 : filters.dateRange === '30d' ? 30 : 90;
      const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(user => new Date(user.joinedDate) >= cutoff);
    }

    setFilteredUsers(filtered);
  };

  const handleUserAction = (action: string, user: User) => {
    setSelectedUser(user);
    
    switch (action) {
      case 'view':
        setShowUserModal(true);
        break;
      case 'edit':
        // Navigate to edit user screen
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
      case 'verify':
        toggleUserVerification(user.id);
        break;
      case 'make_curator':
        toggleUserRole(user.id, 'curator');
        break;
      case 'make_admin':
        toggleUserRole(user.id, 'admin');
        break;
      case 'delete':
        Alert.alert(
          'Delete User',
          `Are you sure you want to permanently delete ${user.name}? This action cannot be undone.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteUser(user.id) },
          ]
        );
        break;
    }
  };

  const updateUserStatus = (userId: string, status: 'active' | 'suspended' | 'banned') => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status } : user
    ));
  };

  const toggleUserVerification = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isVerified: !user.isVerified } : user
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

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) {
      Alert.alert('No Users Selected', 'Please select users to perform bulk actions.');
      return;
    }

    Alert.alert(
      'Bulk Action',
      `Are you sure you want to ${action} ${selectedUsers.length} user(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            // Implement bulk action logic
            setSelectedUsers([]);
            setShowBulkActions(false);
          }
        },
      ]
    );
  };

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user: User = {
        id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        connectsBalance: newUser.connectsBalance,
        totalSpent: 0,
        totalBids: 0,
        itemsWon: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString().split('T')[0],
        status: 'active',
        isAdmin: newUser.role === 'admin',
        isCurator: newUser.role === 'curator',
        isVerified: false,
        trustScore: 100,
        riskLevel: 'low',
        flags: [],
        totalReferrals: 0,
      };

      setUsers(prev => [user, ...prev]);
      setShowCreateUser(false);
      setNewUser({
        name: '',
        email: '',
        phone: '',
        role: 'user',
        connectsBalance: 100,
        sendWelcomeEmail: true,
      });

      Alert.alert('Success', 'User created successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create user');
    }
  };

  const exportUsers = () => {
    // Implement user export functionality
    Alert.alert('Export Started', 'User data export has been initiated. You will receive an email when ready.');
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
      case 'pending': return '#6b7280';
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
          <Text style={styles.headerTitle}>User Management</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerAction} onPress={exportUsers}>
              <Download size={20} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerAction} onPress={() => setShowCreateUser(true)}>
              <UserPlus size={20} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerAction} onPress={fetchUsers}>
              <RefreshCw size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
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
          
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Filter Panel */}
        {showFilters && (
          <AnimatedCard delay={100} style={styles.filtersPanel}>
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Status:</Text>
              <View style={styles.filterOptions}>
                {['all', 'active', 'suspended', 'banned', 'pending'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.filterOption,
                      filters.status === status && styles.filterOptionActive,
                    ]}
                    onPress={() => setFilters(prev => ({ ...prev, status: status as any }))}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filters.status === status && styles.filterOptionTextActive,
                    ]}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Role:</Text>
              <View style={styles.filterOptions}>
                {['all', 'user', 'curator', 'admin'].map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.filterOption,
                      filters.role === role && styles.filterOptionActive,
                    ]}
                    onPress={() => setFilters(prev => ({ ...prev, role: role as any }))}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filters.role === role && styles.filterOptionTextActive,
                    ]}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Risk:</Text>
              <View style={styles.filterOptions}>
                {['all', 'low', 'medium', 'high'].map((risk) => (
                  <TouchableOpacity
                    key={risk}
                    style={[
                      styles.filterOption,
                      filters.riskLevel === risk && styles.filterOptionActive,
                    ]}
                    onPress={() => setFilters(prev => ({ ...prev, riskLevel: risk as any }))}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filters.riskLevel === risk && styles.filterOptionTextActive,
                    ]}>
                      {risk.charAt(0).toUpperCase() + risk.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </AnimatedCard>
        )}

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <AnimatedCard delay={200} style={styles.bulkActionsContainer}>
            <Text style={styles.bulkActionsText}>
              {selectedUsers.length} user(s) selected
            </Text>
            <View style={styles.bulkActions}>
              <TouchableOpacity
                style={styles.bulkActionButton}
                onPress={() => handleBulkAction('suspend')}
              >
                <Ban size={16} color="#f59e0b" />
                <Text style={styles.bulkActionText}>Suspend</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bulkActionButton}
                onPress={() => handleBulkAction('activate')}
              >
                <CheckCircle size={16} color="#16a34a" />
                <Text style={styles.bulkActionText}>Activate</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bulkActionButton}
                onPress={() => handleBulkAction('export')}
              >
                <Download size={16} color="#1e40af" />
                <Text style={styles.bulkActionText}>Export</Text>
              </TouchableOpacity>
            </View>
          </AnimatedCard>
        )}

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Users List */}
          <AnimatedCard delay={300} style={styles.section}>
            <Text style={styles.sectionTitle}>
              Users ({filteredUsers.length})
            </Text>
            
            {filteredUsers.map((user, index) => (
              <AnimatedCard key={user.id} delay={400 + index * 50} style={styles.userCard}>
                <View style={styles.userHeader}>
                  <TouchableOpacity
                    style={styles.userCheckbox}
                    onPress={() => {
                      setSelectedUsers(prev => 
                        prev.includes(user.id) 
                          ? prev.filter(id => id !== user.id)
                          : [...prev, user.id]
                      );
                    }}
                  >
                    <View style={[
                      styles.checkbox,
                      selectedUsers.includes(user.id) && styles.checkboxSelected,
                    ]}>
                      {selectedUsers.includes(user.id) && (
                        <CheckCircle size={16} color="#ffffff" />
                      )}
                    </View>
                  </TouchableOpacity>

                  <View style={styles.userInfo}>
                    <View style={styles.userNameRow}>
                      <Text style={styles.userName}>{user.name}</Text>
                      {user.isAdmin && <Crown size={16} color="#f59e0b" />}
                      {user.isCurator && <Shield size={16} color="#1e40af" />}
                      {user.isVerified && <CheckCircle size={16} color="#16a34a" />}
                    </View>
                    <Text style={styles.userEmail}>{user.email}</Text>
                    {user.phone && (
                      <Text style={styles.userPhone}>{user.phone}</Text>
                    )}
                    <View style={styles.userStats}>
                      <View style={styles.userStat}>
                        <Coins size={12} color="#f59e0b" />
                        <Text style={styles.userStatText}>{user.connectsBalance.toLocaleString()}</Text>
                      </View>
                      <View style={styles.userStat}>
                        <TrendingUp size={12} color="#16a34a" />
                        <Text style={styles.userStatText}>{user.totalBids} bids</Text>
                      </View>
                      <View style={styles.userStat}>
                        <Calendar size={12} color="#6b7280" />
                        <Text style={styles.userStatText}>{user.joinedDate}</Text>
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
                      onPress={() => handleUserAction('view', user)}
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
                  <View style={styles.metric}>
                    <Text style={styles.metricValue}>{user.totalReferrals}</Text>
                    <Text style={styles.metricLabel}>Referrals</Text>
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
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Basic Information</Text>
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
                      <Text style={styles.detailLabel}>Status:</Text>
                      <Text style={[styles.detailValue, { color: getStatusColor(selectedUser.status) }]}>
                        {selectedUser.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Account Details</Text>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Joined:</Text>
                      <Text style={styles.detailValue}>{selectedUser.joinedDate}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Last Active:</Text>
                      <Text style={styles.detailValue}>{selectedUser.lastActive}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Verified:</Text>
                      <Text style={styles.detailValue}>{selectedUser.isVerified ? 'Yes' : 'No'}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Trust Score:</Text>
                      <Text style={styles.detailValue}>{selectedUser.trustScore}/100</Text>
                    </View>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Activity & Spending</Text>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Connects Balance:</Text>
                      <Text style={styles.detailValue}>{selectedUser.connectsBalance.toLocaleString()}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Total Spent:</Text>
                      <Text style={styles.detailValue}>${selectedUser.totalSpent.toLocaleString()}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Total Bids:</Text>
                      <Text style={styles.detailValue}>{selectedUser.totalBids}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Items Won:</Text>
                      <Text style={styles.detailValue}>{selectedUser.itemsWon}</Text>
                    </View>
                  </View>

                  {selectedUser.location && (
                    <View style={styles.detailSection}>
                      <Text style={styles.detailSectionTitle}>Technical Information</Text>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Location:</Text>
                        <Text style={styles.detailValue}>{selectedUser.location}</Text>
                      </View>
                      {selectedUser.ipAddress && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>IP Address:</Text>
                          <Text style={styles.detailValue}>{selectedUser.ipAddress}</Text>
                        </View>
                      )}
                      {selectedUser.deviceInfo && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Device:</Text>
                          <Text style={styles.detailValue}>{selectedUser.deviceInfo}</Text>
                        </View>
                      )}
                    </View>
                  )}

                  {selectedUser.flags.length > 0 && (
                    <View style={styles.detailSection}>
                      <Text style={styles.detailSectionTitle}>Flags & Warnings</Text>
                      {selectedUser.flags.map((flag, index) => (
                        <View key={index} style={styles.flagItem}>
                          <AlertTriangle size={16} color="#ef4444" />
                          <Text style={styles.flagText}>{flag}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </ScrollView>
              )}
              
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalActionButton}
                  onPress={() => {
                    setShowUserModal(false);
                    if (selectedUser) handleUserAction('edit', selectedUser);
                  }}
                >
                  <Edit size={16} color="#1e40af" />
                  <Text style={styles.modalActionText}>Edit</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowUserModal(false)}
                >
                  <Text style={styles.modalCloseButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Create User Modal */}
        <Modal
          visible={showCreateUser}
          transparent
          animationType="slide"
          onRequestClose={() => setShowCreateUser(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Create New User</Text>
              
              <ScrollView style={styles.modalBody}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Name *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter full name"
                    value={newUser.name}
                    onChangeText={(text) => setNewUser(prev => ({ ...prev, name: text }))}
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter email address"
                    value={newUser.email}
                    onChangeText={(text) => setNewUser(prev => ({ ...prev, email: text }))}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Phone</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter phone number"
                    value={newUser.phone}
                    onChangeText={(text) => setNewUser(prev => ({ ...prev, phone: text }))}
                    keyboardType="phone-pad"
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Role</Text>
                  <View style={styles.roleOptions}>
                    {['user', 'curator', 'admin'].map((role) => (
                      <TouchableOpacity
                        key={role}
                        style={[
                          styles.roleOption,
                          newUser.role === role && styles.roleOptionActive,
                        ]}
                        onPress={() => setNewUser(prev => ({ ...prev, role }))}
                      >
                        <Text style={[
                          styles.roleOptionText,
                          newUser.role === role && styles.roleOptionTextActive,
                        ]}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Starting Connects Balance</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="100"
                    value={newUser.connectsBalance.toString()}
                    onChangeText={(text) => setNewUser(prev => ({ ...prev, connectsBalance: parseInt(text) || 0 }))}
                    keyboardType="numeric"
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View style={styles.checkboxContainer}>
                  <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() => setNewUser(prev => ({ ...prev, sendWelcomeEmail: !prev.sendWelcomeEmail }))}
                  >
                    <View style={[
                      styles.checkbox,
                      newUser.sendWelcomeEmail && styles.checkboxSelected,
                    ]}>
                      {newUser.sendWelcomeEmail && (
                        <CheckCircle size={16} color="#ffffff" />
                      )}
                    </View>
                    <Text style={styles.checkboxLabel}>Send welcome email</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
              
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowCreateUser(false)}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.modalSaveButton}
                  onPress={handleCreateUser}
                >
                  <Text style={styles.modalSaveButtonText}>Create User</Text>
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerAction: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    marginLeft: 8,
  },
  filterButton: {
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
  },
  filtersPanel: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  filterRow: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterOptionActive: {
    backgroundColor: '#1e40af',
    borderColor: '#1e40af',
  },
  filterOptionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  filterOptionTextActive: {
    color: '#ffffff',
  },
  bulkActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  bulkActionsText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1e40af',
  },
  bulkActions: {
    flexDirection: 'row',
    gap: 12,
  },
  bulkActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    gap: 4,
  },
  bulkActionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userCheckbox: {
    marginRight: 12,
    marginTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#1e40af',
    borderColor: '#1e40af',
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
    marginBottom: 2,
  },
  userPhone: {
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
    fontSize: 14,
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
  detailSection: {
    marginBottom: 20,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
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
  flagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  flagText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#dc2626',
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  modalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    gap: 8,
  },
  modalActionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1e40af',
  },
  modalCloseButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
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
  roleOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  roleOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
  },
  roleOptionActive: {
    backgroundColor: '#1e40af',
    borderColor: '#1e40af',
  },
  roleOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  roleOptionTextActive: {
    color: '#ffffff',
  },
  checkboxContainer: {
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkboxLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
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