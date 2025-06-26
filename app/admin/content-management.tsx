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
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Upload,
  Download,
  RefreshCw,
  Calendar,
  Tag,
  Star,
  TrendingUp,
  Package,
  Image as ImageIcon,
  FileText,
  Settings,
  Copy,
  ExternalLink
} from 'lucide-react-native';
import AnimatedCard from '@/components/AnimatedCard';
import GradientBackground from '@/components/GradientBackground';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: 'auction' | 'category' | 'banner' | 'page' | 'notification';
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  author: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  scheduledFor?: string;
  image?: string;
  tags: string[];
  views: number;
  isHot?: boolean;
  isFeatured?: boolean;
  category?: string;
  priority: 'low' | 'medium' | 'high';
}

interface ContentFilters {
  type: 'all' | 'auction' | 'category' | 'banner' | 'page' | 'notification';
  status: 'all' | 'draft' | 'published' | 'archived' | 'scheduled';
  author: 'all' | string;
  dateRange: 'all' | '7d' | '30d' | '90d';
}

export default function ContentManagementScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const [filters, setFilters] = useState<ContentFilters>({
    type: 'all',
    status: 'all',
    author: 'all',
    dateRange: 'all',
  });

  const [newContent, setNewContent] = useState({
    title: '',
    description: '',
    type: 'auction',
    status: 'draft',
    tags: '',
    priority: 'medium',
    scheduledFor: '',
  });

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    filterContent();
  }, [content, searchQuery, filters]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock content data
      const mockContent: ContentItem[] = [
        {
          id: '1',
          title: 'Vintage Camera Collection',
          description: 'Rare vintage cameras from the 1950s-1980s',
          type: 'auction',
          status: 'published',
          author: 'John Curator',
          createdAt: '2024-01-15',
          updatedAt: '2024-01-20',
          publishedAt: '2024-01-16',
          image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
          tags: ['vintage', 'cameras', 'collectibles'],
          views: 1247,
          isHot: true,
          isFeatured: true,
          category: 'Electronics',
          priority: 'high',
        },
        {
          id: '2',
          title: 'Limited Edition Sneakers',
          description: 'Exclusive sneaker collaboration with certificate of authenticity',
          type: 'auction',
          status: 'published',
          author: 'Jane Curator',
          createdAt: '2024-01-10',
          updatedAt: '2024-01-18',
          publishedAt: '2024-01-12',
          image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
          tags: ['sneakers', 'fashion', 'limited-edition'],
          views: 892,
          isHot: false,
          isFeatured: false,
          category: 'Fashion',
          priority: 'medium',
        },
        {
          id: '3',
          title: 'Electronics Category',
          description: 'Category page for electronic items and gadgets',
          type: 'category',
          status: 'published',
          author: 'Admin User',
          createdAt: '2024-01-05',
          updatedAt: '2024-01-15',
          publishedAt: '2024-01-06',
          tags: ['category', 'electronics'],
          views: 3421,
          priority: 'high',
        },
        {
          id: '4',
          title: 'Welcome Banner',
          description: 'Main homepage banner for new users',
          type: 'banner',
          status: 'published',
          author: 'Design Team',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-10',
          publishedAt: '2024-01-02',
          image: 'https://images.pexels.com/photos/1337247/pexels-photo-1337247.jpeg?auto=compress&cs=tinysrgb&w=800',
          tags: ['banner', 'homepage', 'welcome'],
          views: 5678,
          priority: 'high',
        },
        {
          id: '5',
          title: 'Spring Auction Event',
          description: 'Upcoming spring auction event announcement',
          type: 'notification',
          status: 'scheduled',
          author: 'Marketing Team',
          createdAt: '2024-01-18',
          updatedAt: '2024-01-19',
          scheduledFor: '2024-03-01',
          tags: ['event', 'spring', 'announcement'],
          views: 0,
          priority: 'medium',
        },
        {
          id: '6',
          title: 'About Us Page',
          description: 'Company information and mission statement',
          type: 'page',
          status: 'draft',
          author: 'Content Team',
          createdAt: '2024-01-20',
          updatedAt: '2024-01-20',
          tags: ['about', 'company', 'static'],
          views: 0,
          priority: 'low',
        },
      ];

      setContent(mockContent);
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterContent = () => {
    let filtered = content;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(item => item.type === filters.type);
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    // Author filter
    if (filters.author !== 'all') {
      filtered = filtered.filter(item => item.author === filters.author);
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const days = filters.dateRange === '7d' ? 7 : filters.dateRange === '30d' ? 30 : 90;
      const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(item => new Date(item.createdAt) >= cutoff);
    }

    setFilteredContent(filtered);
  };

  const handleContentAction = (action: string, item: ContentItem) => {
    setSelectedContent(item);
    
    switch (action) {
      case 'view':
        setShowContentModal(true);
        break;
      case 'edit':
        // Navigate to edit screen
        router.push(`/admin/edit-content?id=${item.id}`);
        break;
      case 'duplicate':
        duplicateContent(item);
        break;
      case 'publish':
        updateContentStatus(item.id, 'published');
        break;
      case 'unpublish':
        updateContentStatus(item.id, 'draft');
        break;
      case 'archive':
        updateContentStatus(item.id, 'archived');
        break;
      case 'delete':
        Alert.alert(
          'Delete Content',
          `Are you sure you want to delete "${item.title}"?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteContent(item.id) },
          ]
        );
        break;
    }
  };

  const updateContentStatus = (id: string, status: 'draft' | 'published' | 'archived') => {
    setContent(prev => prev.map(item => 
      item.id === id ? { 
        ...item, 
        status, 
        publishedAt: status === 'published' ? new Date().toISOString().split('T')[0] : item.publishedAt,
        updatedAt: new Date().toISOString().split('T')[0]
      } : item
    ));
  };

  const duplicateContent = (item: ContentItem) => {
    const duplicated: ContentItem = {
      ...item,
      id: Date.now().toString(),
      title: `${item.title} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      publishedAt: undefined,
      views: 0,
    };
    
    setContent(prev => [duplicated, ...prev]);
    Alert.alert('Success', 'Content duplicated successfully!');
  };

  const deleteContent = (id: string) => {
    setContent(prev => prev.filter(item => item.id !== id));
  };

  const handleCreateContent = async () => {
    if (!newContent.title || !newContent.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const content: ContentItem = {
        id: Date.now().toString(),
        title: newContent.title,
        description: newContent.description,
        type: newContent.type as any,
        status: newContent.status as any,
        author: 'Current User',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        scheduledFor: newContent.scheduledFor || undefined,
        tags: newContent.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        views: 0,
        priority: newContent.priority as any,
      };

      setContent(prev => [content, ...prev]);
      setShowCreateModal(false);
      setNewContent({
        title: '',
        description: '',
        type: 'auction',
        status: 'draft',
        tags: '',
        priority: 'medium',
        scheduledFor: '',
      });

      Alert.alert('Success', 'Content created successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create content');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return '#16a34a';
      case 'draft': return '#6b7280';
      case 'archived': return '#ef4444';
      case 'scheduled': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'auction': return Package;
      case 'category': return Tag;
      case 'banner': return ImageIcon;
      case 'page': return FileText;
      case 'notification': return Bell;
      default: return FileText;
    }
  };

  if (loading) {
    return (
      <GradientBackground colors={['#f8fafc', '#e2e8f0']}>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <LoadingSpinner size={48} />
            <Text style={styles.loadingText}>Loading content...</Text>
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
          <Text style={styles.headerTitle}>Content Management</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerAction} onPress={() => setShowCreateModal(true)}>
              <Plus size={20} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerAction} onPress={fetchContent}>
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
              placeholder="Search content..."
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
              <Text style={styles.filterLabel}>Type:</Text>
              <View style={styles.filterOptions}>
                {['all', 'auction', 'category', 'banner', 'page', 'notification'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterOption,
                      filters.type === type && styles.filterOptionActive,
                    ]}
                    onPress={() => setFilters(prev => ({ ...prev, type: type as any }))}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filters.type === type && styles.filterOptionTextActive,
                    ]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Status:</Text>
              <View style={styles.filterOptions}>
                {['all', 'draft', 'published', 'archived', 'scheduled'].map((status) => (
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
          </AnimatedCard>
        )}

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Content Stats */}
          <AnimatedCard delay={200} style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{content.filter(c => c.status === 'published').length}</Text>
              <Text style={styles.statLabel}>Published</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{content.filter(c => c.status === 'draft').length}</Text>
              <Text style={styles.statLabel}>Drafts</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{content.filter(c => c.status === 'scheduled').length}</Text>
              <Text style={styles.statLabel}>Scheduled</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{content.reduce((sum, c) => sum + c.views, 0).toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total Views</Text>
            </View>
          </AnimatedCard>

          {/* Content List */}
          <AnimatedCard delay={300} style={styles.section}>
            <Text style={styles.sectionTitle}>
              Content ({filteredContent.length})
            </Text>
            
            {filteredContent.map((item, index) => {
              const TypeIcon = getTypeIcon(item.type);
              
              return (
                <AnimatedCard key={item.id} delay={400 + index * 50} style={styles.contentCard}>
                  <View style={styles.contentHeader}>
                    <View style={styles.contentInfo}>
                      <View style={styles.contentTitleRow}>
                        <TypeIcon size={16} color="#6b7280" />
                        <Text style={styles.contentTitle}>{item.title}</Text>
                        {item.isHot && <TrendingUp size={14} color="#ef4444" />}
                        {item.isFeatured && <Star size={14} color="#f59e0b" />}
                      </View>
                      <Text style={styles.contentDescription} numberOfLines={2}>
                        {item.description}
                      </Text>
                      <View style={styles.contentMeta}>
                        <Text style={styles.contentMetaText}>By {item.author}</Text>
                        <Text style={styles.contentMetaText}>•</Text>
                        <Text style={styles.contentMetaText}>{item.updatedAt}</Text>
                        <Text style={styles.contentMetaText}>•</Text>
                        <Text style={styles.contentMetaText}>{item.views} views</Text>
                      </View>
                      <View style={styles.contentTags}>
                        {item.tags.slice(0, 3).map((tag, tagIndex) => (
                          <View key={tagIndex} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    
                    {item.image && (
                      <Image source={{ uri: item.image }} style={styles.contentImage} />
                    )}
                  </View>

                  <View style={styles.contentFooter}>
                    <View style={styles.contentBadges}>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                        <Text style={styles.statusBadgeText}>{item.status}</Text>
                      </View>
                      <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
                        <Text style={styles.priorityBadgeText}>{item.priority}</Text>
                      </View>
                      <View style={styles.typeBadge}>
                        <Text style={styles.typeBadgeText}>{item.type}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.contentActions}>
                      <TouchableOpacity
                        style={styles.contentActionButton}
                        onPress={() => handleContentAction('view', item)}
                      >
                        <Eye size={16} color="#6b7280" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.contentActionButton}
                        onPress={() => handleContentAction('edit', item)}
                      >
                        <Edit size={16} color="#6b7280" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.contentActionButton}
                        onPress={() => handleContentAction('duplicate', item)}
                      >
                        <Copy size={16} color="#6b7280" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.contentActionButton}
                        onPress={() => handleContentAction(item.status === 'published' ? 'unpublish' : 'publish', item)}
                      >
                        {item.status === 'published' ? (
                          <EyeOff size={16} color="#f59e0b" />
                        ) : (
                          <Eye size={16} color="#16a34a" />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </AnimatedCard>
              );
            })}
          </AnimatedCard>
        </ScrollView>

        {/* Content Detail Modal */}
        <Modal
          visible={showContentModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowContentModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Content Details</Text>
              
              {selectedContent && (
                <ScrollView style={styles.modalBody}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Title:</Text>
                    <Text style={styles.detailValue}>{selectedContent.title}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Type:</Text>
                    <Text style={styles.detailValue}>{selectedContent.type}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status:</Text>
                    <Text style={[styles.detailValue, { color: getStatusColor(selectedContent.status) }]}>
                      {selectedContent.status}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Author:</Text>
                    <Text style={styles.detailValue}>{selectedContent.author}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Created:</Text>
                    <Text style={styles.detailValue}>{selectedContent.createdAt}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Updated:</Text>
                    <Text style={styles.detailValue}>{selectedContent.updatedAt}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Views:</Text>
                    <Text style={styles.detailValue}>{selectedContent.views.toLocaleString()}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Priority:</Text>
                    <Text style={[styles.detailValue, { color: getPriorityColor(selectedContent.priority) }]}>
                      {selectedContent.priority}
                    </Text>
                  </View>
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Description:</Text>
                    <Text style={styles.detailDescription}>{selectedContent.description}</Text>
                  </View>
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Tags:</Text>
                    <View style={styles.detailTags}>
                      {selectedContent.tags.map((tag, index) => (
                        <View key={index} style={styles.detailTag}>
                          <Text style={styles.detailTagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </ScrollView>
              )}
              
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowContentModal(false)}
              >
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Create Content Modal */}
        <Modal
          visible={showCreateModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowCreateModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Create New Content</Text>
              
              <ScrollView style={styles.modalBody}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Title *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter content title"
                    value={newContent.title}
                    onChangeText={(text) => setNewContent(prev => ({ ...prev, title: text }))}
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Description *</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Enter content description"
                    value={newContent.description}
                    onChangeText={(text) => setNewContent(prev => ({ ...prev, description: text }))}
                    multiline
                    numberOfLines={4}
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Type</Text>
                  <View style={styles.typeOptions}>
                    {['auction', 'category', 'banner', 'page', 'notification'].map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.typeOption,
                          newContent.type === type && styles.typeOptionActive,
                        ]}
                        onPress={() => setNewContent(prev => ({ ...prev, type }))}
                      >
                        <Text style={[
                          styles.typeOptionText,
                          newContent.type === type && styles.typeOptionTextActive,
                        ]}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Status</Text>
                  <View style={styles.statusOptions}>
                    {['draft', 'published', 'scheduled'].map((status) => (
                      <TouchableOpacity
                        key={status}
                        style={[
                          styles.statusOption,
                          newContent.status === status && styles.statusOptionActive,
                        ]}
                        onPress={() => setNewContent(prev => ({ ...prev, status }))}
                      >
                        <Text style={[
                          styles.statusOptionText,
                          newContent.status === status && styles.statusOptionTextActive,
                        ]}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Tags</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter tags separated by commas"
                    value={newContent.tags}
                    onChangeText={(text) => setNewContent(prev => ({ ...prev, tags: text }))}
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Priority</Text>
                  <View style={styles.priorityOptions}>
                    {['low', 'medium', 'high'].map((priority) => (
                      <TouchableOpacity
                        key={priority}
                        style={[
                          styles.priorityOption,
                          newContent.priority === priority && styles.priorityOptionActive,
                        ]}
                        onPress={() => setNewContent(prev => ({ ...prev, priority }))}
                      >
                        <Text style={[
                          styles.priorityOptionText,
                          newContent.priority === priority && styles.priorityOptionTextActive,
                        ]}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {newContent.status === 'scheduled' && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Scheduled For</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="YYYY-MM-DD"
                      value={newContent.scheduledFor}
                      onChangeText={(text) => setNewContent(prev => ({ ...prev, scheduledFor: text }))}
                      placeholderTextColor="#9ca3af"
                    />
                  </View>
                )}
              </ScrollView>
              
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowCreateModal(false)}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.modalSaveButton}
                  onPress={handleCreateContent}
                >
                  <Text style={styles.modalSaveButtonText}>Create Content</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
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
  contentCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  contentHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  contentInfo: {
    flex: 1,
    marginRight: 12,
  },
  contentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  contentTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    flex: 1,
  },
  contentDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  contentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  contentMetaText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
  contentTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#1e40af',
  },
  contentImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  contentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentBadges: {
    flexDirection: 'row',
    gap: 6,
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
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  typeBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#6b7280',
  },
  contentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  contentActionButton: {
    padding: 6,
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
    paddingVertical: 6,
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
  detailSection: {
    marginTop: 16,
  },
  detailDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    marginTop: 8,
    lineHeight: 20,
  },
  detailTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  detailTag: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  detailTagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#1e40af',
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
  },
  typeOptionActive: {
    backgroundColor: '#1e40af',
    borderColor: '#1e40af',
  },
  typeOptionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  typeOptionTextActive: {
    color: '#ffffff',
  },
  statusOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  statusOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
  },
  statusOptionActive: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  statusOptionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  statusOptionTextActive: {
    color: '#ffffff',
  },
  priorityOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
  },
  priorityOptionActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  priorityOptionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  priorityOptionTextActive: {
    color: '#ffffff',
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