import { useState, useEffect, createContext, useContext } from 'react';
import { db, users } from '@/lib/database';
import { eq } from 'drizzle-orm';
import { setUser as setSentryUser } from '@/lib/sentry';

interface User {
  id: string;
  email: string;
  name: string;
  connectsBalance: number;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    checkStoredSession();
  }, []);

  const checkStoredSession = async () => {
    try {
      // In a real app, you'd check AsyncStorage or secure storage
      // For demo purposes, we'll simulate this
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // For demo purposes, we'll simulate authentication
      // In production, you'd validate against your auth service
      
      let userData: User;
      
      if (email === 'admin@example.com') {
        userData = {
          id: 'admin-id',
          email: 'admin@example.com',
          name: 'Admin User',
          connectsBalance: 10000,
          isAdmin: true,
        };
      } else {
        userData = {
          id: 'user-id',
          email: email,
          name: 'John Doe',
          connectsBalance: 2750,
          isAdmin: false,
        };
      }

      setUser(userData);
      setSentryUser(userData);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setSentryUser({ id: '', email: '', name: '' });
  };

  return {
    user,
    login,
    logout,
    isLoading,
  };
};

export { AuthContext };