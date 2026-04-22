import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, SIZES } from '../theme';

const CustomHeader = ({
  title,
  subtitle,
  onBackPress,
  rightIcon,
  onRightPress,
  transparent = false,
  lightContent = false,
}) => {
  const textColor = lightContent ? COLORS.white : COLORS.textPrimary;

  return (
    <View
      style={[
        styles.container,
        transparent && styles.transparent,
      ]}
    >
      <View style={styles.leftSection}>
        {onBackPress && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.backIcon, { color: textColor }]}>←</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerSection}>
        <Text
          style={[styles.title, { color: textColor }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[
              styles.subtitle,
              { color: lightContent ? 'rgba(255,255,255,0.7)' : COLORS.textTertiary },
            ]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.rightSection}>
        {rightIcon && (
          <TouchableOpacity
            style={styles.rightButton}
            onPress={onRightPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: SIZES.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  transparent: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  leftSection: {
    width: 48,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    width: 48,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: SPACING.xs,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: '500',
  },
  title: {
    ...TYPOGRAPHY.h4,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    marginTop: 2,
  },
  rightButton: {
    padding: SPACING.xs,
  },
});

export default CustomHeader;
