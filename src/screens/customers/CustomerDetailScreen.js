import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Modal,
  Alert,
} from 'react-native';
import AppContainer from '../../components/AppContainer';
import CustomHeader from '../../Custom-Components/CustomHeader';
import CustomButton from '../../Custom-Components/CustomButton';
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks';
import {
  fetchCustomerById,
  deleteCustomer,
  clearSelectedCustomer,
  clearError,
} from './customerSlice';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, SIZES } from '../../theme';
import { getInitials, formatCurrency, formatPhone } from '../../utils/helpers';
import { ROUTES } from '../../navigations-map/Routes';

const TABS = ['Orders', 'Measurements', 'Payments'];

const CustomerDetailScreen = ({ navigation, route }) => {
  const { customerId } = route.params;
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { selectedCustomer, loading, error } = useAppSelector(
    (state) => state.customers
  );

  const [activeTab, setActiveTab] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const token = user?.token;

  useEffect(() => {
    if (token && customerId) {
      dispatch(fetchCustomerById({ token, id: customerId }));
    }
    return () => {
      dispatch(clearSelectedCustomer());
      dispatch(clearError());
    };
  }, [dispatch, token, customerId]);

  const handleCall = useCallback(() => {
    if (selectedCustomer?.phone) {
      Linking.openURL(`tel:${selectedCustomer.phone}`);
    }
  }, [selectedCustomer]);

  const handleEmail = useCallback(() => {
    if (selectedCustomer?.email) {
      Linking.openURL(`mailto:${selectedCustomer.email}`);
    }
  }, [selectedCustomer]);

  const handleEdit = useCallback(() => {
    setShowMenu(false);
    navigation.navigate(ROUTES.EDIT_CUSTOMER, {
      customer: selectedCustomer,
    });
  }, [navigation, selectedCustomer]);

  const handleDelete = useCallback(() => {
    setShowDeleteModal(false);
    if (token && customerId) {
      dispatch(deleteCustomer({ token, id: customerId })).then((action) => {
        if (!action.error) {
          navigation.goBack();
        }
      });
    }
  }, [dispatch, token, customerId, navigation]);

  // Loading state
  if (loading && !selectedCustomer) {
    return (
      <AppContainer>
        <CustomHeader title="Customer" onBackPress={() => navigation.goBack()} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading customer...</Text>
        </View>
      </AppContainer>
    );
  }

  // Error state
  if (error && !selectedCustomer) {
    return (
      <AppContainer>
        <CustomHeader title="Customer" onBackPress={() => navigation.goBack()} />
        <View style={styles.centered}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <CustomButton
            title="Try Again"
            onPress={() => dispatch(fetchCustomerById({ token, id: customerId }))}
            variant="outline"
            size="medium"
            fullWidth={false}
            style={{ marginTop: SPACING.base }}
          />
        </View>
      </AppContainer>
    );
  }

  if (!selectedCustomer) return null;

  const customer = selectedCustomer;

  return (
    <AppContainer>
      {/* Header */}
      <CustomHeader
        title={customer.name}
        onBackPress={() => navigation.goBack()}
        rightIcon={<Text style={styles.menuIcon}>⋮</Text>}
        onRightPress={() => setShowMenu(!showMenu)}
      />

      {/* Kebab menu dropdown */}
      {showMenu && (
        <View style={styles.menuDropdown}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleEdit}
          >
            <Text style={styles.menuItemText}>✏️  Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, styles.menuItemDanger]}
            onPress={() => {
              setShowMenu(false);
              setShowDeleteModal(true);
            }}
          >
            <Text style={styles.menuItemTextDanger}>🗑️  Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>
              {getInitials(customer.name)}
            </Text>
          </View>
          <Text style={styles.profileName}>{customer.name}</Text>

          <TouchableOpacity onPress={handleCall}>
            <Text style={styles.profilePhone}>
              📞 {formatPhone(customer.phone)}
            </Text>
          </TouchableOpacity>

          {customer.email ? (
            <TouchableOpacity onPress={handleEmail}>
              <Text style={styles.profileEmail}>
                ✉️ {customer.email}
              </Text>
            </TouchableOpacity>
          ) : null}

          {customer.city || customer.address ? (
            <Text style={styles.profileAddress}>
              📍 {[customer.address, customer.city].filter(Boolean).join(', ')}
            </Text>
          ) : null}
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{customer.totalOrders}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: COLORS.success }]}>
              {formatCurrency(customer.totalSpent)}
            </Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
          <View style={styles.statCard}>
            <Text
              style={[
                styles.statValue,
                { color: customer.balanceDue > 0 ? COLORS.error : COLORS.success },
              ]}
            >
              {formatCurrency(customer.balanceDue)}
            </Text>
            <Text style={styles.statLabel}>Balance Due</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={() =>
              navigation.navigate(ROUTES.ADD_ORDER, {
                customerId: customer.id,
                customerName: customer.name,
              })
            }
          >
            <Text style={styles.quickActionIcon}>🧵</Text>
            <Text style={styles.quickActionLabel}>New Order</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={() =>
              navigation.navigate(ROUTES.ADD_MEASUREMENT, {
                customerId: customer.id,
                customerName: customer.name,
              })
            }
          >
            <Text style={styles.quickActionIcon}>📐</Text>
            <Text style={styles.quickActionLabel}>Add Measurement</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={() =>
              navigation.navigate(ROUTES.ADD_PAYMENT, {
                customerId: customer.id,
                customerName: customer.name,
              })
            }
          >
            <Text style={styles.quickActionIcon}>💰</Text>
            <Text style={styles.quickActionLabel}>Record Payment</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabBar}>
          {TABS.map((tab, index) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === index && styles.tabActive]}
              onPress={() => setActiveTab(index)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === index && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderIcon}>
              {activeTab === 0 ? '🧵' : activeTab === 1 ? '📐' : '💳'}
            </Text>
            <Text style={styles.placeholderTitle}>
              {TABS[activeTab]} — Coming Soon
            </Text>
            <Text style={styles.placeholderSubtitle}>
              This section will show the customer's {TABS[activeTab].toLowerCase()}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalIcon}>⚠️</Text>
            <Text style={styles.modalTitle}>Delete Customer?</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete{' '}
              <Text style={{ fontWeight: '700' }}>{customer.name}</Text>? This
              action cannot be undone. All associated orders, measurements, and
              payment records will also be removed.
            </Text>
            <View style={styles.modalActions}>
              <CustomButton
                title="Cancel"
                variant="outline"
                size="medium"
                onPress={() => setShowDeleteModal(false)}
                style={styles.modalBtn}
              />
              <CustomButton
                title="Delete"
                variant="danger"
                size="medium"
                onPress={handleDelete}
                loading={loading}
                style={styles.modalBtn}
              />
            </View>
          </View>
        </View>
      </Modal>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  errorTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  errorMessage: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  // Menu
  menuIcon: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  menuDropdown: {
    position: 'absolute',
    top: SIZES.headerHeight - 4,
    right: SPACING.base,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sm,
    minWidth: 150,
    zIndex: 100,
    ...SHADOWS.lg,
  },
  menuItem: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  menuItemDanger: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  menuItemTextDanger: {
    ...TYPOGRAPHY.body,
    color: COLORS.error,
  },

  scrollContent: {
    paddingBottom: SPACING['3xl'],
  },

  // Profile
  profileSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  avatarLarge: {
    width: SIZES.avatarLarge + 16,
    height: SIZES.avatarLarge + 16,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  avatarLargeText: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
  },
  profileName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  profilePhone: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  profileEmail: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  profileAddress: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textTertiary,
    marginTop: SPACING.xs,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.base,
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  statValue: {
    ...TYPOGRAPHY.h4,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textTertiary,
    textAlign: 'center',
    fontSize: 12,
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.base,
    gap: SPACING.sm,
  },
  quickActionBtn: {
    flex: 1,
    backgroundColor: COLORS.primarySurface,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
  },
  quickActionIcon: {
    fontSize: 22,
    marginBottom: SPACING.xs,
  },
  quickActionLabel: {
    ...TYPOGRAPHY.label,
    color: COLORS.primary,
    fontSize: 11,
    textAlign: 'center',
  },

  // Tabs
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: SPACING.base,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    ...SHADOWS.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    ...TYPOGRAPHY.label,
    color: COLORS.textTertiary,
  },
  tabTextActive: {
    color: COLORS.primary,
  },

  // Tab Content
  tabContent: {
    marginHorizontal: SPACING.base,
    marginTop: SPACING.md,
  },
  placeholderContainer: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING['2xl'],
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  placeholderIcon: {
    fontSize: 40,
    marginBottom: SPACING.md,
  },
  placeholderTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  placeholderSubtitle: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textTertiary,
    textAlign: 'center',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    width: '100%',
    alignItems: 'center',
  },
  modalIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  modalTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  modalMessage: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
  },
});

export default CustomerDetailScreen;
