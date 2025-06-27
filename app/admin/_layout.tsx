import { Stack } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function AdminLayout() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user?.isAdmin) {
      router.replace('/(tabs)');
    }
  }, [user]);

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="products" />
      <Stack.Screen name="users" />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}