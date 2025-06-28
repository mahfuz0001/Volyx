import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, Mail, Lock, User, BadgeCheck } from 'lucide-react-native'; // Import Google icon
import { useAuth } from '@/hooks/useAuth';
import GradientBackground from '@/components/GradientBackground';
import AnimatedCard from '@/components/AnimatedCard';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = { name: '', email: '', password: '' };
    let isValid = true;

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (!isLogin && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        const success = await login(formData.email, formData.password);
        if (success) {
          if (formData.email === 'admin@example.com') {
            router.replace('/admin');
          } else {
            router.replace('/(tabs)');
          }
        } else {
          setErrors({ ...errors, email: 'Invalid credentials' });
        }
      } catch (error) {
        setErrors({ ...errors, email: 'Login failed' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({ name: '', email: '', password: '' });
  };

  return (
    <GradientBackground colors={['#f8fafc', '#e2e8f0', '#cbd5e1']}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <AnimatedCard delay={200} style={styles.header}>
              <Text style={styles.logo}>Volyx</Text>
              <Text style={styles.headerText}>
                {isLogin ? 'Welcome back!' : 'Create your account'}
              </Text>
              <Text style={styles.subHeaderText}>
                {isLogin
                  ? 'Sign in to continue bidding'
                  : 'Join the auction community'}
              </Text>
            </AnimatedCard>

            <AnimatedCard delay={400} style={styles.formContainer}>
              {!isLogin && (
                <View style={styles.inputContainer}>
                  <View
                    style={[
                      styles.inputWrapper,
                      errors.name ? styles.inputError : null,
                    ]}
                  >
                    <User size={20} color="#6b7280" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Full Name"
                      value={formData.name}
                      onChangeText={(text) =>
                        setFormData({ ...formData, name: text })
                      }
                      autoCapitalize="words"
                      placeholderTextColor="#9ca3af"
                    />
                  </View>
                  {errors.name ? (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  ) : null}
                </View>
              )}

              <View style={styles.inputContainer}>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.email ? styles.inputError : null,
                  ]}
                >
                  <Mail size={20} color="#6b7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email (try admin@example.com)"
                    value={formData.email}
                    onChangeText={(text) =>
                      setFormData({ ...formData, email: text })
                    }
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                {errors.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.password ? styles.inputError : null,
                  ]}
                >
                  <Lock size={20} color="#6b7280" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Password"
                    value={formData.password}
                    onChangeText={(text) =>
                      setFormData({ ...formData, password: text })
                    }
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#9ca3af"
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#6b7280" />
                    ) : (
                      <Eye size={20} color="#6b7280" />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.password ? (
                  <Text style={styles.errorText}>{errors.password}</Text>
                ) : null}
              </View>

              {isLogin && (
                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isLoading && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                <Text style={styles.submitButtonText}>
                  {isLoading
                    ? 'Please wait...'
                    : isLogin
                    ? 'Sign In'
                    : 'Create Account'}
                </Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Google Social Button with Icon and Color */}
              <TouchableOpacity style={styles.googleSocialButton}>
                <BadgeCheck
                  size={20}
                  color="#ffffff"
                  style={styles.socialIcon}
                />
                <Text style={styles.googleSocialButtonText}>
                  Continue with Google
                </Text>
              </TouchableOpacity>

              {/* Apple Social Button (if you want to re-enable it later) */}
              {/* <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialButtonText}>Continue with Apple</Text>
              </TouchableOpacity> */}
            </AnimatedCard>

            <AnimatedCard delay={600} style={styles.footer}>
              <Text style={styles.footerText}>
                {isLogin
                  ? "Don't have an account? "
                  : 'Already have an account? '}
              </Text>
              <TouchableOpacity onPress={toggleAuthMode}>
                <Text style={styles.footerLink}>
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </AnimatedCard>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 42,
    fontFamily: 'Inter-Bold',
    color: '#1e40af',
    marginBottom: 16,
    textShadowColor: 'rgba(30, 64, 175, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerText: {
    fontSize: 28,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  subHeaderText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingVertical: 10, // Adjusted padding for smaller height
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 10, // Adjusted padding for smaller height
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ef4444',
    marginTop: 8,
    marginLeft: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1e40af',
  },
  submitButton: {
    backgroundColor: '#1e40af',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#d1d5db',
  },
  dividerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginHorizontal: 16,
  },
  socialButton: {
    flexDirection: 'row', // Added for icon alignment
    justifyContent: 'center', // Added for icon alignment
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: '#f9fafb',
    shadowColor: '#000',
  },
  socialIcon: {
    marginRight: 10, // Space between icon and text
  },
  socialButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  googleSocialButton: {
    flexDirection: 'row', // Added for icon alignment
    justifyContent: 'center', // Added for icon alignment
    alignItems: 'center',
    backgroundColor: '#4285F4', // Google brand color
    borderColor: '#4285F4', // Match border to background
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#4285F4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  googleSocialButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff', // White text for contrast
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  footerLink: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1e40af',
  },
});
