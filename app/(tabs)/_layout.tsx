import { Tabs } from 'expo-router';
import { Home, Search, Heart, User, ShoppingBag } from 'lucide-react-native';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          height: 70,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={100}
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: 25,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.15,
              shadowRadius: 20,
              elevation: 10,
            }}
          />
        ),
        tabBarActiveTintColor: '#FF7F00',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'Inter-SemiBold',
          marginTop: 4,
          marginBottom: 8,
        },
        tabBarIconStyle: {
          marginTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ size, color }) => (
            <Search size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="auctions"
        options={{
          title: 'My Bids',
          tabBarIcon: ({ size, color }) => (
            <ShoppingBag size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ size, color }) => (
            <Heart size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
    </Tabs>
  );
}