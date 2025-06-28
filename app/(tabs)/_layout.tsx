import { Tabs } from 'expo-router';
import {
  Home as HomeIconLucide,
  Search,
  Heart,
  User,
  ShoppingBag,
} from 'lucide-react-native';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import AuthGuard from '@/components/AuthGuard';

export default function TabLayout() {
  return (
    <AuthGuard>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarLabel: () => null,
          tabBarStyle: {
            position: 'absolute',
            bottom: 40,
            left: 0,
            right: 0,
            height: 60,
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            paddingHorizontal: 20,
          },
          tabBarBackground: () => (
            <BlurView intensity={100} style={styles.floatingNavBarBackground} />
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
              <HomeIconLucide size={size} color={color} strokeWidth={2.5} />
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
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <View
                style={[
                  styles.centralButtonContainer,
                  { backgroundColor: focused ? '#FF7F00' : '#4a90e2' },
                ]}
              >
                <ShoppingBag size={28} color="#FFFFFF" strokeWidth={2.5} />
              </View>
            ),
            tabBarIconStyle: {
              marginTop: -30,
            },
            tabBarButton: (props) => (
              <TouchableOpacity
                {...(props as any)}
                style={styles.centralButtonWrapper}
              />
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
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  floatingNavBarBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 35,
    marginHorizontal: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  centralButtonWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centralButtonContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    // top: 15,
  },
});