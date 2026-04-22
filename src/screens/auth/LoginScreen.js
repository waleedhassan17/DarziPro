import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks';
import { loginUser, clearError } from './authSlice';
import { ROUTES } from '../../navigations-map/Routes';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, SIZES } from '../../theme';
import CustomButton from '../../Custom-Components/CustomButton';
import CustomInput from '../../Custom-Components/CustomInput';
import Logo from '../../Custom-Components/Logo';
import AppContainer from '../../components/AppContainer';
import { validateEmail } from '../../utils/helpers';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const passwordRef = useRef(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, []);

  const validate = () => {
    let valid = true;
    setEmailError('');
    setPasswordError('');

    if (!email.trim()) {
      setEmailError('Email or phone is required');
      valid = false;
    } else if (email.includes('@') && !validateEmail(email)) {
      setEmailError('Please enter a valid email');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    }

    return valid;
  };

  const handleLogin = () => {
    if (!validate()) return;
    dispatch(loginUser({ email: email.trim(), password }));
  };

  return (
    <AppContainer backgroundColor={COLORS.background}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section with Pattern */}
          <View style={styles.headerSection}>
            <View style={styles.decorativeBar} />
            <Logo size="large" />
          </View>

          {/* Form Section */}
          <Animated.View
            style={[
              styles.formSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.formCard}>
              <Text style={styles.welcomeTitle}>Welcome Back</Text>
              <Text style={styles.welcomeSubtitle}>
                Sign in to manage your tailoring business
              </Text>

              {/* Error Banner */}
              {error && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorBannerText}>{error}</Text>
                </View>
              )}

              {/* Email */}
              <CustomInput
                label="Email or Phone"
                placeholder="name@example.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError('');
                  dispatch(clearError());
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                error={emailError}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                leftIcon={<Text style={styles.inputIcon}>📧</Text>}
              />

              {/* Password */}
              <CustomInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError('');
                  dispatch(clearError());
                }}
                secureTextEntry
                error={passwordError}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
              />

              {/* Remember Me & Forgot Password */}
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={styles.rememberMe}
                  onPress={() => setRememberMe(!rememberMe)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkbox,
                      rememberMe && styles.checkboxChecked,
                    ]}
                  >
                    {rememberMe && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  <Text style={styles.rememberText}>Remember me</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate(ROUTES.FORGOT_PASSWORD)}
                >
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <CustomButton
                title="Sign In"
                onPress={handleLogin}
                loading={loading}
                style={styles.loginButton}
              />

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Sign Up Link */}
              <CustomButton
                title="Create New Account"
                onPress={() => navigation.navigate(ROUTES.SIGN_UP)}
                variant="outline"
                style={styles.signUpButton}
              />
            </View>

            {/* Footer */}
            <Text style={styles.footerText}>
              By signing in, you agree to our{' '}
              <Text style={styles.linkText}>Terms</Text> &{' '}
              <Text style={styles.linkText}>Privacy Policy</Text>
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
  },
  headerSection: {
    paddingTop: SPACING['4xl'],
    paddingBottom: SPACING['2xl'],
    alignItems: 'center',
  },
  decorativeBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.secondary,
    marginBottom: SPACING.xl,
  },
  formSection: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.lg,
  },
  welcomeTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  errorBanner: {
    backgroundColor: COLORS.errorLight,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    marginBottom: SPACING.base,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.error,
  },
  errorBannerText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.error,
  },
  inputIcon: {
    fontSize: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: -SPACING.sm,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: RADIUS.xs,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  rememberText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  forgotText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
    fontWeight: '600',
  },
  loginButton: {
    marginBottom: SPACING.base,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.base,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
    marginHorizontal: SPACING.base,
  },
  signUpButton: {
    marginBottom: SPACING.xs,
  },
  footerText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING['2xl'],
    paddingHorizontal: SPACING.base,
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: '500',
  },
});

export default LoginScreen;
