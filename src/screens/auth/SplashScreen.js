import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks';
import { restoreSession } from './authSlice';
import { ROUTES } from '../../navigations-map/Routes';
import { COLORS, TYPOGRAPHY, SPACING } from '../../theme';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, sessionRestored } = useAppSelector(
    (state) => state.auth
  );

  // Animations
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const nameOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered animation sequence
    Animated.sequence([
      // Logo fade in + scale
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      // App name
      Animated.timing(nameOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Tagline
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Progress bar
    Animated.timing(progressWidth, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    // Restore session
    dispatch(restoreSession());
  }, []);

  useEffect(() => {
    if (sessionRestored) {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          navigation.replace(ROUTES.MAIN_TABS);
        } else {
          navigation.replace(ROUTES.LOGIN);
        }
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [sessionRestored, isAuthenticated]);

  const progressInterpolation = progressWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

      {/* Background pattern - subtle textile weave */}
      <View style={styles.patternOverlay} />

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <View style={styles.logoMark}>
          <Text style={styles.logoText}>DP</Text>
          <View style={styles.logoAccent} />
        </View>
      </Animated.View>

      {/* App Name */}
      <Animated.View style={{ opacity: nameOpacity }}>
        <Text style={styles.appName}>
          Darzi<Text style={styles.appNameAccent}>Pro</Text>
        </Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.View style={{ opacity: taglineOpacity }}>
        <Text style={styles.tagline}>Smart Tailoring, Simplified</Text>
      </Animated.View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            { width: progressInterpolation },
          ]}
        />
      </View>

      {/* Version */}
      <Text style={styles.version}>v1.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patternOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.03,
    backgroundColor: 'transparent',
    // Subtle pattern effect via borders
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  logoContainer: {
    marginBottom: SPACING.lg,
  },
  logoMark: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  logoText: {
    fontSize: 38,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: -1,
  },
  logoAccent: {
    position: 'absolute',
    bottom: 16,
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.secondary,
  },
  appName: {
    fontSize: 40,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: -1,
    textAlign: 'center',
  },
  appNameAccent: {
    color: COLORS.secondary,
  },
  tagline: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255,255,255,0.6)',
    marginTop: SPACING.sm,
    letterSpacing: 1,
    textAlign: 'center',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 100,
    width: 180,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: COLORS.secondary,
  },
  version: {
    position: 'absolute',
    bottom: SPACING['3xl'],
    ...TYPOGRAPHY.caption,
    color: 'rgba(255,255,255,0.35)',
  },
});

export default SplashScreen;
