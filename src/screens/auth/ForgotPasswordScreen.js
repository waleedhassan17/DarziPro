import React, { useState, useEffect, useRef } from 'react';
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
import {
  forgotPassword,
  clearError,
  resetForgotPassword,
  setForgotPasswordEmail,
} from './authSlice';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../theme';
import CustomButton from '../../Custom-Components/CustomButton';
import CustomInput from '../../Custom-Components/CustomInput';
import AppContainer from '../../components/AppContainer';
import { validateEmail } from '../../utils/helpers';

const ForgotPasswordScreen = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const {
    forgotPasswordLoading,
    forgotPasswordSuccess,
    forgotPasswordError,
  } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    return () => dispatch(resetForgotPassword());
  }, []);

  const validate = () => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    dispatch(setForgotPasswordEmail(email.trim()));
    dispatch(forgotPassword(email.trim()));
  };

  // Success state
  if (forgotPasswordSuccess) {
    return (
      <AppContainer backgroundColor={COLORS.background}>
        <View style={styles.successContainer}>
          <TouchableOpacity
            style={styles.backBtnAbs}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <View style={styles.successCard}>
            <View style={styles.successIcon}>
              <Text style={styles.successEmoji}>📬</Text>
            </View>
            <Text style={styles.successTitle}>Check Your Email</Text>
            <Text style={styles.successSubtitle}>
              We've sent password reset instructions to
            </Text>
            <Text style={styles.successEmail}>{email}</Text>

            <View style={styles.tipsCard}>
              <Text style={styles.tipsTitle}>Didn't receive the email?</Text>
              <Text style={styles.tipItem}>• Check your spam folder</Text>
              <Text style={styles.tipItem}>• Verify the email address</Text>
              <Text style={styles.tipItem}>• Wait up to 5 minutes</Text>
            </View>

            <CustomButton
              title="Resend Email"
              onPress={handleSubmit}
              variant="outline"
              loading={forgotPasswordLoading}
              style={styles.resendBtn}
            />

            <CustomButton
              title="Back to Sign In"
              onPress={() => navigation.goBack()}
              variant="primary"
              style={styles.backToLogin}
            />
          </View>
        </View>
      </AppContainer>
    );
  }

  return (
    <AppContainer backgroundColor={COLORS.background}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
          </View>

          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <View style={styles.formCard}>
              {/* Illustration */}
              <View style={styles.illustrationContainer}>
                <Text style={styles.illustration}>🔐</Text>
              </View>

              <Text style={styles.title}>Forgot Password?</Text>
              <Text style={styles.subtitle}>
                Enter the email address associated with your account and we'll
                send you instructions to reset your password.
              </Text>

              {forgotPasswordError && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorText}>{forgotPasswordError}</Text>
                </View>
              )}

              <CustomInput
                label="Email Address"
                placeholder="name@example.com"
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  setEmailError('');
                  dispatch(clearError());
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                error={emailError}
                required
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                leftIcon={<Text style={styles.inputIcon}>📧</Text>}
              />

              <CustomButton
                title="Send Reset Link"
                onPress={handleSubmit}
                loading={forgotPasswordLoading}
                style={styles.submitBtn}
              />
            </View>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.loginLinkText}>
                Remember your password?{' '}
                <Text style={styles.loginLinkBold}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.base,
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
  backBtnAbs: {
    position: 'absolute',
    top: SPACING.base,
    left: SPACING.xl,
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
    zIndex: 10,
  },
  backIcon: { fontSize: 20, color: COLORS.textPrimary },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING['2xl'],
    justifyContent: 'center',
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.lg,
  },
  illustrationContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: COLORS.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: SPACING.xl,
  },
  illustration: { fontSize: 36 },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  errorBanner: {
    backgroundColor: COLORS.errorLight,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    marginBottom: SPACING.base,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.error,
  },
  errorText: { ...TYPOGRAPHY.bodySmall, color: COLORS.error },
  inputIcon: { fontSize: 16 },
  submitBtn: { marginTop: SPACING.sm },
  loginLink: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING['2xl'],
  },
  loginLinkText: { ...TYPOGRAPHY.body, color: COLORS.textTertiary },
  loginLinkBold: { color: COLORS.primary, fontWeight: '700' },

  // ── Success State ──
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  successCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  successEmoji: { fontSize: 36 },
  successTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
  },
  successSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  successEmail: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: '700',
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  tipsCard: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.base,
    width: '100%',
    marginBottom: SPACING.xl,
  },
  tipsTitle: {
    ...TYPOGRAPHY.label,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  tipItem: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textTertiary,
    marginBottom: SPACING.xs,
  },
  resendBtn: { marginBottom: SPACING.md, width: '100%' },
  backToLogin: { width: '100%' },
});

export default ForgotPasswordScreen;
