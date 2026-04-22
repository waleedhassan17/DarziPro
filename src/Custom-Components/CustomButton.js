import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, SIZES } from '../theme';

const CustomButton = ({
  title,
  onPress,
  variant = 'primary', // primary | secondary | outline | text | danger
  size = 'large',       // large | medium | small
  loading = false,
  disabled = false,
  icon = null,
  iconPosition = 'left',
  style,
  textStyle,
  fullWidth = true,
}) => {
  const isDisabled = disabled || loading;

  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    isDisabled && styles[`${variant}Disabled`],
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`size_${size}Text`],
    isDisabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? COLORS.white : COLORS.primary}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          <Text style={textStyles}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: SPACING.sm,
  },
  iconRight: {
    marginLeft: SPACING.sm,
  },

  // ── Variants ──
  primary: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.md,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
    ...SHADOWS.sm,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  text: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: COLORS.error,
    ...SHADOWS.sm,
  },

  // ── Sizes ──
  size_large: {
    height: SIZES.buttonHeight,
    paddingHorizontal: SPACING.xl,
  },
  size_medium: {
    height: SIZES.buttonHeightSmall,
    paddingHorizontal: SPACING.base,
  },
  size_small: {
    height: 34,
    paddingHorizontal: SPACING.md,
  },

  // ── Text Styles ──
  text: {
    ...TYPOGRAPHY.button,
  },
  primaryText: {
    color: COLORS.white,
  },
  secondaryText: {
    color: COLORS.white,
  },
  outlineText: {
    color: COLORS.primary,
  },
  textText: {
    color: COLORS.primary,
  },
  dangerText: {
    color: COLORS.white,
  },
  size_largeText: {
    ...TYPOGRAPHY.button,
  },
  size_mediumText: {
    ...TYPOGRAPHY.buttonSmall,
  },
  size_smallText: {
    ...TYPOGRAPHY.labelSmall,
  },

  // ── Disabled ──
  disabled: {
    opacity: 0.5,
  },
  primaryDisabled: {
    backgroundColor: COLORS.textDisabled,
  },
  disabledText: {
    color: COLORS.textTertiary,
  },
});

export default CustomButton;
