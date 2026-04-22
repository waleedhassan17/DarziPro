// 4px base unit spacing scale
const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
  '6xl': 80,
};

const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

const SHADOWS = {
  sm: {
    shadowColor: '#1A1A18',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#1A1A18',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#1A1A18',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  xl: {
    shadowColor: '#1A1A18',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 10,
  },
};

const SIZES = {
  // Component heights
  buttonHeight: 52,
  buttonHeightSmall: 40,
  inputHeight: 56,
  headerHeight: 56,
  tabBarHeight: 64,
  iconSize: 24,
  iconSizeSmall: 20,
  iconSizeLarge: 28,
  avatarSmall: 36,
  avatarMedium: 48,
  avatarLarge: 64,
};

export { RADIUS, SHADOWS, SIZES };
export default SPACING;
