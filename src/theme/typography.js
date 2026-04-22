import { Platform } from 'react-native';

const FONTS = {
  // Primary font family
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
  }),
  // Monospace for numbers/measurements
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
  }),
};

const TYPOGRAPHY = {
  // Headings
  h1: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.5,
    fontWeight: '700',
  },
  h2: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.3,
    fontWeight: '600',
  },
  h3: {
    fontFamily: FONTS.medium,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  },
  h4: {
    fontFamily: FONTS.medium,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
  },

  // Body
  bodyLarge: {
    fontFamily: FONTS.regular,
    fontSize: 17,
    lineHeight: 26,
    fontWeight: '400',
  },
  body: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  },
  bodySmall: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },

  // Labels & Captions
  label: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  labelSmall: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  caption: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },

  // Special
  button: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  buttonSmall: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
  },
  measurement: {
    fontFamily: FONTS.mono,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
  },
  amount: {
    fontFamily: FONTS.mono,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
  },
  tabLabel: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500',
  },
};

export { FONTS };
export default TYPOGRAPHY;
