import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Flame,
} from 'lucide-react-native';
import ProductCard from '@/components/ProductCard';
import { mockAuctionItems, mockCategories } from '@/data/mockData';

const { width: screenWidth } = Dimensions.get('window');

const PRODUCT_CARD_WIDTH = screenWidth * 0.7;

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(
    null
  );
  const [selectedTimeRemaining, setSelectedTimeRemaining] = useState<
    string | null
  >(null);
  const [favoriteItems, setFavoriteItems] = useState<string[]>(['2', '4']);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  const mockPriceRanges = [
    { id: '1', name: 'Under $50', min: 0, max: 50 },
    { id: '2', name: '$50 - $200', min: 50, max: 200 },
    { id: '3', name: '$200 - $500', min: 200, max: 500 },
    { id: '4', name: 'Over $500', min: 500, max: Infinity },
  ];

  const mockTimeRemainingFilters = [
    { id: '1', name: 'Ending Soon (< 24h)', maxHours: 24 },
    { id: '2', name: 'Within 3 Days', maxHours: 72 },
    { id: '3', name: 'Within a Week', maxHours: 7 * 24 },
    { id: '4', name: 'Any Time', maxHours: Infinity },
  ];

  const filteredItems = mockAuctionItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || item.category === selectedCategory;

    const matchesPriceRange =
      !selectedPriceRange ||
      (() => {
        const range = mockPriceRanges.find(
          (r) => r.name === selectedPriceRange
        );
        if (!range) return true;
        return item.currentBid >= range.min && item.currentBid <= range.max;
      })();

    const matchesTimeRemaining =
      !selectedTimeRemaining ||
      (() => {
        const timeFilter = mockTimeRemainingFilters.find(
          (f) => f.name === selectedTimeRemaining
        );
        if (!timeFilter) return true;
        const now = new Date();
        const timeLeft =
          (new Date(item.endTime).getTime() - now.getTime()) / (1000 * 60 * 60);
        return timeLeft <= timeFilter.maxHours;
      })();

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPriceRange &&
      matchesTimeRemaining
    );
  });

  const hotDeals = mockAuctionItems.filter((item) => item.isHot);

  const toggleFavorite = (itemId: string) => {
    setFavoriteItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleProductPress = (itemId: string) => {
    console.log('Navigate to product:', itemId);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedPriceRange(null);
    setSelectedTimeRemaining(null);
    setIsFiltersExpanded(false);
  };

  const itemWidth = (screenWidth - 16 * 2 - 12) / 2; // (screenWidth - horizontalPadding*2 - columnGap) / numColumns

  const renderCategoryFilter = ({ item }: any) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        selectedCategory === item.name && styles.filterChipActive,
      ]}
      onPress={() =>
        setSelectedCategory(selectedCategory === item.name ? null : item.name)
      }
    >
      <Text style={styles.filterChipIcon}>{item.icon}</Text>
      <Text
        style={[
          styles.filterChipText,
          selectedCategory === item.name && styles.filterChipTextActive,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderPriceRangeFilter = ({ item }: any) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        selectedPriceRange === item.name && styles.filterChipActive,
      ]}
      onPress={() =>
        setSelectedPriceRange(
          selectedPriceRange === item.name ? null : item.name
        )
      }
    >
      <Text
        style={[
          styles.filterChipText,
          selectedPriceRange === item.name && styles.filterChipTextActive,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderTimeRemainingFilter = ({ item }: any) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        selectedTimeRemaining === item.name && styles.filterChipActive,
      ]}
      onPress={() =>
        setSelectedTimeRemaining(
          selectedTimeRemaining === item.name ? null : item.name
        )
      }
    >
      <Text
        style={[
          styles.filterChipText,
          selectedTimeRemaining === item.name && styles.filterChipTextActive,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const isAnyFilterActive =
    searchQuery.length > 0 ||
    selectedCategory ||
    selectedPriceRange ||
    selectedTimeRemaining;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search Auctions</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#6b7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for items..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9ca3af"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearSearchButton}
              >
                <X size={20} color="#6b7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.filtersToggleContainer}>
          <TouchableOpacity
            style={styles.filtersToggleButton}
            onPress={() => setIsFiltersExpanded(!isFiltersExpanded)}
          >
            <Filter size={18} color="#1e3a8a" />
            <Text style={styles.filtersToggleText}>
              {isFiltersExpanded ? 'Hide Filters' : 'Show Filters'}
            </Text>
            {isFiltersExpanded ? (
              <ChevronUp size={18} color="#1e3a8a" />
            ) : (
              <ChevronDown size={18} color="#1e3a8a" />
            )}
          </TouchableOpacity>
          {isAnyFilterActive && (
            <TouchableOpacity
              style={styles.clearAllFiltersButton}
              onPress={clearAllFilters}
            >
              <Text style={styles.clearAllFiltersText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {isFiltersExpanded && (
          <View style={styles.expandedFiltersSection}>
            <View style={styles.filterGroup}>
              <View style={styles.filterGroupHeader}>
                <Text style={styles.filterGroupTitle}>By Category</Text>
              </View>
              <FlatList
                data={mockCategories}
                renderItem={renderCategoryFilter}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterChipsContainer}
              />
            </View>

            <View style={styles.filterGroup}>
              <View style={styles.filterGroupHeader}>
                <Text style={styles.filterGroupTitle}>By Price</Text>
              </View>
              <FlatList
                data={mockPriceRanges}
                renderItem={renderPriceRangeFilter}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterChipsContainer}
              />
            </View>

            <View style={styles.filterGroup}>
              <View style={styles.filterGroupHeader}>
                <Text style={styles.filterGroupTitle}>By Time Remaining</Text>
              </View>
              <FlatList
                data={mockTimeRemainingFilters}
                renderItem={renderTimeRemainingFilter}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterChipsContainer}
              />
            </View>
          </View>
        )}

        {hotDeals.length > 0 && (
          <View style={styles.hotDealsSection}>
            <View style={styles.hotDealsHeader}>
              <Flame size={20} color="#ef4444" />
              <Text style={styles.hotDealsTitle}>Hot Deals!</Text>
              <TouchableOpacity
                onPress={() => console.log('View all hot deals')}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={hotDeals}
              renderItem={({ item }) => (
                <View style={{ width: PRODUCT_CARD_WIDTH }}>
                  <ProductCard
                    id={item.id}
                    title={item.title}
                    image={item.image}
                    currentBid={item.currentBid}
                    endTime={item.endTime}
                    isHot={item.isHot}
                    isFavorite={favoriteItems.includes(item.id)}
                    onPress={() => handleProductPress(item.id)}
                    onFavoritePress={() => toggleFavorite(item.id)}
                    compact={false}
                  />
                </View>
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hotDealsListContainer}
            />
          </View>
        )}

        <View style={styles.searchResultsSection}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}{' '}
              found
            </Text>
          </View>

          {filteredItems.length > 0 ? (
            <View style={styles.productsGrid}>
              {filteredItems.map((item) => (
                <View key={item.id} style={{ width: itemWidth }}>
                  <ProductCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    image={item.image}
                    currentBid={item.currentBid}
                    endTime={item.endTime}
                    isHot={item.isHot}
                    isFavorite={favoriteItems.includes(item.id)}
                    onPress={() => handleProductPress(item.id)}
                    onFavoritePress={() => toggleFavorite(item.id)}
                    compact
                  />
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Search size={64} color="#d1d5db" />
              <Text style={styles.emptyTitle}>No items found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search terms or filters
              </Text>
            </View>
          )}
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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  clearSearchButton: {
    paddingLeft: 8,
  },
  filtersToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filtersToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#cdd6f7',
  },
  filtersToggleText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1e3a8a',
    marginLeft: 8,
    marginRight: 8,
  },
  clearAllFiltersButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  clearAllFiltersText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1e40af',
  },
  expandedFiltersSection: {
    backgroundColor: '#ffffff',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterGroupHeader: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterGroupTitle: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  filterChipsContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterChipActive: {
    backgroundColor: '#1e3a8a',
  },
  filterChipIcon: {
    fontSize: 16,
    marginRight: 6,
    color: '#374151',
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },

  hotDealsSection: {
    marginTop: 8,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  hotDealsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  hotDealsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ef4444',
    marginLeft: 8,
    flex: 1,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1e40af',
  },
  hotDealsListContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },

  searchResultsSection: {
    flex: 1,
    paddingTop: 8,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsCount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 20,
    columnGap: 12,
    rowGap: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
  },
});
