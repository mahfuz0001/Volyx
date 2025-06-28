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
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, Mail, Lock, User, BadgeCheck, ArrowLeft } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import GradientBackground from '@/components/GradientBackground';
import AnimatedCard from '@/components/AnimatedCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import ErrorMessage from '@/components/ErrorMessage';

type AuthMode = 'login' | 'register' | 'forgotPassword' | 'resetSuccess';

export default function AuthScreen() {
  const router = useRouter();
  const { signIn, signUp, resetPassword, isLoading } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: '',
  });

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      general: '',
    };
    let isValid = true;

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    // Different validations based on auth mode
    if (authMode === 'login') {
      if (!formData.password) {
        newErrors.password = 'Password is required';
        isValid = false;
      }
    } else if (authMode === 'register') {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
        isValid = false;
      }

      if (!formData.password) {
        newErrors.password = 'Password is required';
        isValid = false;
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
        isValid = false;
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
    } else if (authMode === 'forgotPassword') {
      // Only email validation needed for forgot password
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (authMode === 'login') {
        const success = await signIn(formData.email, formData.password);
        if (success) {
          if (formData.email === 'admin@example.com') {
            router.replace('/admin');
          } else {
            router.replace('/(tabs)');
          }
        } else {
          setErrors({ ...errors, general: 'Invalid email or password' });
        }
      } else if (authMode === 'register') {
        const success = await signUp(formData.email, formData.password, formData.name);
        if (success) {
          router.replace('/(tabs)');
        } else {
          setErrors({ ...errors, general: 'Registration failed. Please try again.' });
        }
      } else if (authMode === 'forgotPassword') {
        const success = await resetPassword(formData.email);
        if (success) {
          setAuthMode('resetSuccess');
        } else {
          setErrors({ ...errors, general: 'Failed to send reset email. Please try again.' });
        }
      }
    } catch (error) {
      setErrors({ ...errors, general: 'An unexpected error occurred. Please try again.' });
    }
  };

  const toggleAuthMode = (mode: AuthMode) => {
    setAuthMode(mode);
    setErrors({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      general: '',
    });
  };

  const renderLoginForm = () => (
    <>
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
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) =>
              setFormData({ ...formData, email: text })
            }
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
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

      <TouchableOpacity 
        style={styles.forgotPassword}
        onPress={() => toggleAuthMode('forgotPassword')}
      >
        <Text style={styles.forgotPasswordText}>
          Forgot Password?
        </Text>
      </TouchableOpacity>
    </>
  );

  const renderRegisterForm = () => (
    <>
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
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) =>
              setFormData({ ...formData, email: text })
            }
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
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

      <View style={styles.inputContainer}>
        <View
          style={[
            styles.inputWrapper,
            errors.confirmPassword ? styles.inputError : null,
          ]}
        >
          <Lock size={20} color="#6b7280" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(text) =>
              setFormData({ ...formData, confirmPassword: text })
            }
            secureTextEntry={!showPassword}
            placeholderTextColor="#9ca3af"
          />
        </View>
        {errors.confirmPassword ? (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        ) : null}
      </View>
    </>
  );

  const renderForgotPasswordForm = () => (
    <>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => toggleAuthMode('login')}
      >
        <ArrowLeft size={20} color="#6b7280" />
        <Text style={styles.backButtonText}>Back to Login</Text>
      </TouchableOpacity>
      
      <Text style={styles.forgotPasswordInstructions}>
        Enter your email address and we'll send you a link to reset your password.
      </Text>
      
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
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) =>
              setFormData({ ...formData, email: text })
            }
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholderTextColor="#9ca3af"
          />
        </View>
        {errors.email ? (
          <Text style={styles.errorText}>{errors.email}</Text>
        ) : null}
      </View>
    </>
  );

  const renderResetSuccessMessage = () => (
    <View style={styles.resetSuccessContainer}>
      <Mail size={64} color="#16A34A" />
      <Text style={styles.resetSuccessTitle}>Check Your Email</Text>
      <Text style={styles.resetSuccessText}>
        We've sent a password reset link to {formData.email}. Please check your inbox and follow the instructions.
      </Text>
      <TouchableOpacity 
        style={styles.backToLoginButton}
        onPress={() => toggleAuthMode('login')}
      >
        <Text style={styles.backToLoginText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );

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
                {authMode === 'login' ? 'Welcome back!' : 
                 authMode === 'register' ? 'Create your account' :
                 authMode === 'forgotPassword' ? 'Reset Password' : 
                 'Password Reset'}
              </Text>
              <Text style={styles.subHeaderText}>
                {authMode === 'login' ? 'Sign in to continue bidding' : 
                 authMode === 'register' ? 'Join the auction community' : 
                 authMode === 'forgotPassword' ? 'Get back into your account' : 
                 'Check your email for instructions'}
              </Text>
            </AnimatedCard>

            <AnimatedCard delay={400} style={styles.formContainer}>
              {errors.general ? (
                <ErrorMessage 
                  message={errors.general} 
                  onDismiss={() => setErrors({...errors, general: ''})}
                />
              ) : null}

              {authMode === 'login' && renderLoginForm()}
              {authMode === 'register' && renderRegisterForm()}
              {authMode === 'forgotPassword' && renderForgotPasswordForm()}
              {authMode === 'resetSuccess' && renderResetSuccessMessage()}

              {authMode !== 'resetSuccess' && (
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    isLoading && styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.submitButtonText}>
                      {authMode === 'login'
                        ? 'Sign In'
                        : authMode === 'register'
                        ? 'Create Account'
                        : 'Reset Password'}
                    </Text>
                  )}
                </TouchableOpacity>
              )}

              {authMode !== 'resetSuccess' && authMode !== 'forgotPassword' && (
                <>
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
                </>
              )}
            </AnimatedCard>

            {authMode !== 'resetSuccess' && authMode !== 'forgotPassword' && (
              <AnimatedCard delay={600} style={styles.footer}>
                <Text style={styles.footerText}>
                  {authMode === 'login'
                    ? "Don't have an account? "
                    : 'Already have an account? '}
                </Text>
                <TouchableOpacity 
                  onPress={() => toggleAuthMode(authMode === 'login' ? 'register' : 'login')}
                >
                  <Text style={styles.footerLink}>
                    {authMode === 'login' ? 'Sign Up' : 'Sign In'}
                  </Text>
                </TouchableOpacity>
              </AnimatedCard>
            )}
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
    paddingVertical: 10,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
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
    flexDirection: 'row',
    justifyContent: 'center',
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
    marginRight: 10,
  },
  socialButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  googleSocialButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4285F4',
    borderColor: '#4285F4',
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
    color: '#ffffff',
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginLeft: 8,
  },
  forgotPasswordInstructions: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginBottom: 24,
    lineHeight: 20,
  },
  resetSuccessContainer: {
    alignItems: 'center',
    padding: 16,
  },
  resetSuccessTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 12,
  },
  resetSuccessText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  backToLoginButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
  },
  backToLoginText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1e40af',
  },
});