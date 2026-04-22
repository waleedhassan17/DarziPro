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
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks';
import { registerUser, clearError } from './authSlice';
import { ROUTES } from '../../navigations-map/Routes';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../theme';
import CustomButton from '../../Custom-Components/CustomButton';
import CustomInput from '../../Custom-Components/CustomInput';
import Logo from '../../Custom-Components/Logo';
import AppContainer from '../../components/AppContainer';
import { validateEmail, validatePhone, validatePassword } from '../../utils/helpers';

const SignUpScreen = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    shopName: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Refs for input focus chain
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const shopRef = useRef(null);
  const passRef = useRef(null);
  const confirmRef = useRef(null);

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
    return () => dispatch(clearError());
  }, []);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    dispatch(clearError());
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = 'Full name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(form.email)) {
      newErrors.email = 'Enter a valid email';
    }
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(form.phone)) {
      newErrors.phone = 'Enter a valid Pakistani number (03XX-XXXXXXX)';
    }
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(form.password)) {
      newErrors.password = 'Minimum 6 characters';
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the Terms & Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = () => {
    if (!validate()) return;
    dispatch(
      registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        shopName: form.shopName.trim(),
        password: form.password,
      })
    );
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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Logo size="small" showTagline={false} />
          </View>

          {/* Form */}
          <Animated.View
            style={[
              styles.formSection,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={styles.formCard}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Start managing your tailoring shop digitally
              </Text>

              {error && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorBannerText}>{error}</Text>
                </View>
              )}

              <CustomInput
                label="Full Name"
                placeholder="e.g. Muhammad Ali"
                value={form.name}
                onChangeText={(v) => updateField('name', v)}
                error={errors.name}
                required
                autoCapitalize="words"
                returnKeyType="next"
                leftIcon={<Text style={styles.icon}>👤</Text>}
              />

              <CustomInput
                label="Email Address"
                placeholder="name@example.com"
                value={form.email}
                onChangeText={(v) => updateField('email', v)}
                error={errors.email}
                required
                keyboardType="email-address"
                returnKeyType="next"
                leftIcon={<Text style={styles.icon}>📧</Text>}
              />

              <CustomInput
                label="Phone Number"
                placeholder="03XX-XXXXXXX"
                value={form.phone}
                onChangeText={(v) => updateField('phone', v)}
                error={errors.phone}
                required
                keyboardType="phone-pad"
                maxLength={12}
                returnKeyType="next"
                leftIcon={<Text style={styles.icon}>📱</Text>}
              />

              <CustomInput
                label="Shop / Business Name"
                placeholder="e.g. Ali Tailors"
                value={form.shopName}
                onChangeText={(v) => updateField('shopName', v)}
                helperText="Optional — you can add this later"
                autoCapitalize="words"
                returnKeyType="next"
                leftIcon={<Text style={styles.icon}>🏪</Text>}
              />

              <CustomInput
                label="Password"
                placeholder="Create a strong password"
                value={form.password}
                onChangeText={(v) => updateField('password', v)}
                secureTextEntry
                error={errors.password}
                required
                returnKeyType="next"
                leftIcon={<Text style={styles.icon}>🔒</Text>}
              />

              <CustomInput
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChangeText={(v) => updateField('confirmPassword', v)}
                secureTextEntry
                error={errors.confirmPassword}
                required
                returnKeyType="done"
                onSubmitEditing={handleSignUp}
                leftIcon={<Text style={styles.icon}>🔒</Text>}
              />

              {/* Terms Checkbox */}
              <TouchableOpacity
                style={styles.termsRow}
                onPress={() => setAgreedToTerms(!agreedToTerms)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    agreedToTerms && styles.checkboxChecked,
                  ]}
                >
                  {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.termsText}>
                  I agree to the{' '}
                  <Text style={styles.linkText}>Terms of Service</Text> and{' '}
                  <Text style={styles.linkText}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>
              {errors.terms && (
                <Text style={styles.termsError}>{errors.terms}</Text>
              )}

              {/* Sign Up Button */}
              <CustomButton
                title="Create Account"
                onPress={handleSignUp}
                loading={loading}
                variant="primary"
                style={styles.submitBtn}
              />
            </View>

            {/* Already have account */}
            <View style={styles.loginLinkRow}>
              <Text style={styles.loginLinkText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.loginLinkBold}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: SPACING['3xl'] },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.base,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  backIcon: { fontSize: 20, color: COLORS.textPrimary },
  formSection: { paddingHorizontal: SPACING.xl },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.lg,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
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
  icon: { fontSize: 16 },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.xl,
    marginTop: SPACING.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.xs,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: { color: COLORS.white, fontSize: 13, fontWeight: '700' },
  termsText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    flex: 1,
  },
  linkText: { color: COLORS.primary, fontWeight: '600' },
  termsError: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    marginTop: -SPACING.base,
    marginBottom: SPACING.md,
    marginLeft: SPACING['2xl'],
  },
  submitBtn: { marginTop: SPACING.xs },
  loginLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  loginLinkText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textTertiary,
  },
  loginLinkBold: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: '700',
  },
});

export default SignUpScreen;
