import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { AuthContext, useAuthProvider } from '@/hooks/useAuth';
import ErrorBoundary from '@/components/ErrorBoundary';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // Import SafeAreaProvider

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="splash" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="admin" />
      <Stack.Screen name="product-detail" />
      <Stack.Screen name="get-connects" />
    </Stack>
  );
}

export default function RootLayout() {
  useFrameworkReady();
  const authProvider = useAuthProvider();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ErrorBoundary>
      <AuthContext.Provider value={authProvider}>
        {/* Wrap your main content with SafeAreaProvider */}
        <SafeAreaProvider>
          <RootLayoutNav />
          <StatusBar style="dark" />
        </SafeAreaProvider>
      </AuthContext.Provider>
    </ErrorBoundary>
  );
}
