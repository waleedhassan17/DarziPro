import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ROUTES } from '../navigations-map/Routes';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../theme';

// Screens
import HomeScreen from '../screens/home/HomeScreen';

// Placeholder screens for future modules
const PlaceholderScreen = ({ route }) => (
  <View style={placeholderStyles.container}>
    <Text style={placeholderStyles.icon}>🔨</Text>
    <Text style={placeholderStyles.title}>{route.name}</Text>
    <Text style={placeholderStyles.subtitle}>
      Build this module using the Copilot prompts
    </Text>
  </View>
);

const placeholderStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  icon: { fontSize: 48, marginBottom: SPACING.base },
  title: { ...TYPOGRAPHY.h3, color: COLORS.textPrimary },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textTertiary,
    marginTop: SPACING.sm,
  },
});

const Tab = createBottomTabNavigator();

// Tab icon component
const TabIcon = ({ label, emoji, focused }) => (
  <View style={tabStyles.iconContainer}>
    {focused && <View style={tabStyles.activeDot} />}
    <Text style={[tabStyles.emoji, focused && tabStyles.emojiActive]}>
      {emoji}
    </Text>
    <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>
      {label}
    </Text>
  </View>
);

const tabStyles = StyleSheet.create({
  iconContainer: { alignItems: 'center', paddingTop: 6 },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    top: 0,
  },
  emoji: { fontSize: 22, marginBottom: 2, opacity: 0.5 },
  emojiActive: { opacity: 1 },
  label: {
    ...TYPOGRAPHY.tabLabel,
    color: COLORS.textTertiary,
  },
  labelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.borderLight,
        height: Platform.OS === 'ios' ? 88 : 64,
        paddingBottom: Platform.OS === 'ios' ? 24 : 8,
        paddingTop: 4,
        ...SHADOWS.md,
      },
      tabBarShowLabel: false,
    }}
  >
    <Tab.Screen
      name={ROUTES.HOME}
      component={HomeScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon label="Home" emoji="🏠" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name={ROUTES.CUSTOMERS}
      component={PlaceholderScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon label="Customers" emoji="👥" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name={ROUTES.ORDERS}
      component={PlaceholderScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon label="Orders" emoji="✂️" focused={focused} />
        ),
      }}
    />
    <Tab.Screen
      name={ROUTES.SETTINGS}
      component={PlaceholderScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <TabIcon label="Settings" emoji="⚙️" focused={focused} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default MainTabNavigator;
