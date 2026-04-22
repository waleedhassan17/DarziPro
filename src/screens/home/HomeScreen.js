import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AppContainer from '../../components/AppContainer';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks';
import { logoutUser } from '../auth/authSlice';
import { getGreeting } from '../../utils/helpers';

const HomeScreen = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  return (
    <AppContainer>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting Header */}
        <View style={styles.greetingSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.[0]?.toUpperCase() || 'D'}
            </Text>
          </View>
          <View style={styles.greetingText}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{user?.name || 'Tailor'}</Text>
            {user?.shopName ? (
              <Text style={styles.shopName}>{user.shopName}</Text>
            ) : null}
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Orders', value: '0', icon: '📋', color: COLORS.primary },
            { label: 'Pending', value: '0', icon: '⏳', color: COLORS.warning },
            { label: 'Revenue', value: 'PKR 0', icon: '💰', color: COLORS.success },
          ].map((stat, idx) => (
            <View key={idx} style={styles.statCard}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={[styles.statValue, { color: stat.color }]}>
                {stat.value}
              </Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {[
            { title: 'Add Customer', icon: '👤', desc: 'New customer profile' },
            { title: 'New Order', icon: '✂️', desc: 'Create stitching order' },
            { title: 'Measurements', icon: '📏', desc: 'Record body measurements' },
            { title: 'Payments', icon: '💳', desc: 'Track payments' },
          ].map((action, idx) => (
            <TouchableOpacity key={idx} style={styles.actionCard} activeOpacity={0.7}>
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionDesc}>{action.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Placeholder notice */}
        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderIcon}>🚧</Text>
          <Text style={styles.placeholderTitle}>Module 1 Complete</Text>
          <Text style={styles.placeholderText}>
            Auth & core foundation is set up. Use the Copilot prompts file
            to build Customers, Orders, Payments, and more.
          </Text>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => dispatch(logoutUser())}
        >
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: SPACING.xl, paddingBottom: SPACING['5xl'] },
  greetingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.base,
  },
  avatarText: { fontSize: 22, fontWeight: '700', color: COLORS.white },
  greetingText: { flex: 1 },
  greeting: { ...TYPOGRAPHY.bodySmall, color: COLORS.textTertiary },
  userName: { ...TYPOGRAPHY.h3, color: COLORS.textPrimary },
  shopName: { ...TYPOGRAPHY.caption, color: COLORS.secondary, marginTop: 2 },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  statIcon: { fontSize: 24, marginBottom: SPACING.sm },
  statValue: { ...TYPOGRAPHY.h4, marginBottom: 2 },
  statLabel: { ...TYPOGRAPHY.caption, color: COLORS.textTertiary },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.textPrimary,
    marginBottom: SPACING.base,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  actionCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    ...SHADOWS.sm,
  },
  actionIcon: { fontSize: 28, marginBottom: SPACING.sm },
  actionTitle: { ...TYPOGRAPHY.label, color: COLORS.textPrimary, marginBottom: 2 },
  actionDesc: { ...TYPOGRAPHY.caption, color: COLORS.textTertiary },
  placeholderCard: {
    backgroundColor: COLORS.secondarySurface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderStyle: 'dashed',
  },
  placeholderIcon: { fontSize: 32, marginBottom: SPACING.md },
  placeholderTitle: { ...TYPOGRAPHY.h4, color: COLORS.secondaryDark, marginBottom: SPACING.sm },
  placeholderText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  logoutBtn: {
    alignSelf: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  logoutText: { ...TYPOGRAPHY.body, color: COLORS.error, fontWeight: '600' },
});

export default HomeScreen;
