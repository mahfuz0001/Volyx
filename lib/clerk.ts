import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// SecureStore is not available on web, so we need to use localStorage instead
const tokenCache = {
  async getToken(key: string) {
    try {
      if (Platform.OS === 'web') {
        return window.localStorage.getItem(key);
      }
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      if (Platform.OS === 'web') {
        window.localStorage.setItem(key, value);
        return;
      }
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
  async clearToken(key: string) {
    try {
      if (Platform.OS === 'web') {
        window.localStorage.removeItem(key);
        return;
      }
      return SecureStore.deleteItemAsync(key);
    } catch (err) {
      return;
    }
  },
};

export { tokenCache };