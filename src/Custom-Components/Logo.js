import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../theme';

const Logo = ({ size = 'large', color = COLORS.primary, showTagline = true }) => {
  const isLarge = size === 'large';
  const isMedium = size === 'medium';

  return (
    <View style={styles.container}>
      {/* Logo Mark */}
      <View
        style={[
          styles.logoMark,
          {
            width: isLarge ? 64 : isMedium ? 48 : 36,
            height: isLarge ? 64 : isMedium ? 48 : 36,
            borderRadius: isLarge ? 16 : isMedium ? 12 : 10,
            backgroundColor: color,
          },
        ]}
      >
        <Text
          style={[
            styles.logoLetter,
            {
              fontSize: isLarge ? 28 : isMedium ? 22 : 16,
              color: COLORS.white,
            },
          ]}
        >
          DP
        </Text>
        {/* Needle accent line */}
        <View
          style={[
            styles.accentLine,
            {
              backgroundColor: COLORS.secondary,
              width: isLarge ? 28 : isMedium ? 20 : 16,
            },
          ]}
        />
      </View>

      {/* Brand Name */}
      <Text
        style={[
          styles.brandName,
          {
            fontSize: isLarge ? 32 : isMedium ? 24 : 18,
            color: color,
          },
        ]}
      >
        Darzi
        <Text style={{ color: COLORS.secondary }}>Pro</Text>
      </Text>

      {/* Tagline */}
      {showTagline && isLarge && (
        <Text style={[styles.tagline, { color: color === COLORS.white ? 'rgba(255,255,255,0.7)' : COLORS.textTertiary }]}>
          Smart Tailoring, Simplified
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logoMark: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  logoLetter: {
    fontWeight: '800',
    letterSpacing: -1,
  },
  accentLine: {
    position: 'absolute',
    bottom: 8,
    height: 3,
    borderRadius: 2,
  },
  brandName: {
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  tagline: {
    ...TYPOGRAPHY.bodySmall,
    marginTop: SPACING.xs,
    letterSpacing: 0.5,
  },
});

export default Logo;
