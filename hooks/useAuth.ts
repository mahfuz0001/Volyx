import { useState, useEffect, createContext, useContext } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-expo';
import { createOrUpdateUser, getUserByClerkId, createAdminToken } from '@/lib/auth';
import { analytics } from '@/lib/analytics';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  email: string;
  name: string;
  connectsBalance: number;
  isAdmin: boolean;
  clerkId: string;
  imageUrl?: string;
  phone?: string;
  location?: string;
  bio?: string;
  trustScore: number;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (emailAddress: string, password: string) => Promise<boolean>;
  signUp: (emailAddress: string, password: string, name: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  resetPassword: (emailAddress: string) => Promise<boolean>;
  adminToken: string | null;
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
  const { isLoaded, signIn, signUp, signOut } = useClerkAuth();
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !isUserLoaded) {
        return;
      }

      setIsLoading(true);

      try {
        if (clerkUser) {
          const primaryEmail = clerkUser.primaryEmailAddress?.emailAddress;
          
          if (!primaryEmail) {
            console.error('User has no primary email address');
            setUser(null);
            return;
          }

          // Sync user with database
          const dbUser = await createOrUpdateUser({
            clerkId: clerkUser.id,
            email: primaryEmail,
            name: clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
            imageUrl: clerkUser.imageUrl,
          });

          setUser(dbUser as User);
          
          // Track user login in analytics
          analytics.trackEvent({
            name: 'user_login',
            properties: {
              user_id: dbUser?.id,
              email: primaryEmail,
              is_admin: dbUser?.isAdmin,
            },
          });
          
          // If user is admin, create admin token
          if (dbUser?.isAdmin) {
            const token = await createAdminToken(dbUser.id);
            setAdminToken(token);
            await SecureStore.setItemAsync('admin_token', token);
          }
        } else {
          setUser(null);
          setAdminToken(null);
          await SecureStore.deleteItemAsync('admin_token');
        }
      } catch (error) {
        console.error('Error syncing user:', error);
        setUser(null);
        setAdminToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    syncUser();
  }, [isLoaded, isUserLoaded, clerkUser]);

  // Load admin token from storage on startup
  useEffect(() => {
    const loadAdminToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('admin_token');
        if (token) {
          setAdminToken(token);
        }
      } catch (error) {
        console.error('Error loading admin token:', error);
      }
    };
    
    loadAdminToken();
  }, []);

  const handleSignIn = async (emailAddress: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === 'complete') {
        // User is signed in
        return true;
      } else {
        console.error('Sign in failed:', result);
        return false;
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (emailAddress: string, password: string, name: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const result = await signUp.create({
        emailAddress,
        password,
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' ') || '',
      });

      if (result.status === 'complete') {
        // User is signed up and signed in
        
        // Track user registration in analytics
        analytics.trackEvent({
          name: 'user_registered',
          properties: {
            email: emailAddress,
          },
        });
        
        return true;
      } else {
        console.error('Sign up failed:', result);
        return false;
      }
    } catch (error) {
      console.error('Sign up error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      
      // Track user logout in analytics
      if (user) {
        analytics.trackEvent({
          name: 'user_logout',
          properties: {
            user_id: user.id,
          },
        });
      }
      
      // Clear admin token
      if (adminToken) {
        await SecureStore.deleteItemAsync('admin_token');
        setAdminToken(null);
      }
      
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (emailAddress: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Send password reset email
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: emailAddress,
      });
      
      // Track password reset request in analytics
      analytics.trackEvent({
        name: 'password_reset_requested',
        properties: {
          email: emailAddress,
        },
      });
      
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading: isLoading || !isLoaded || !isUserLoaded,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    adminToken,
  };
};

export { AuthContext };