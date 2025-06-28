import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="add-product" />
      <Stack.Screen name="user-management" />
      <Stack.Screen name="content-management" />
      <Stack.Screen name="financial-overview" />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="system-health" />
      <Stack.Screen name="security" />
      <Stack.Screen name="database" />
    </Stack>
  );
}