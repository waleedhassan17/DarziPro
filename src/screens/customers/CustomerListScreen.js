import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import AppContainer from '../../components/AppContainer';
import CustomButton from '../../Custom-Components/CustomButton';
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks';
import { fetchCustomers, searchCustomers } from './customerSlice';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, SIZES } from '../../theme';
import { getInitials, formatCurrency, formatPhone } from '../../utils/helpers';
import { ROUTES } from '../../navigations-map/Routes';

const CustomerListScreen = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const {
    customers,
    loading,
    error,
    searchResults,
    searchLoading,
    pagination,
  } = useAppSelector((state) => state.customers);

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const token = user?.token;

  useEffect(() => {
    if (token) {
      dispatch(fetchCustomers({ token }));
    }
  }, [dispatch, token]);

  const handleRefresh = useCallback(() => {
    if (token) {
      dispatch(fetchCustomers({ token }));
    }
  }, [dispatch, token]);

  const handleSearch = useCallback(
    (text) => {
      setSearchQuery(text);
      if (text.trim().length > 0 && token) {
        dispatch(searchCustomers({ token, query: text.trim() }));
      }
    },
    [dispatch, token]
  );

  const displayData = searchQuery.trim().length > 0 ? searchResults : customers;

  const getBalanceDotColor = (balanceDue, totalSpent) => {
    if (balanceDue <= 0) return COLORS.success;
    if (totalSpent > 0) return COLORS.warning;
    return COLORS.error;
  };

  const renderCustomerCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate(ROUTES.CUSTOMER_DETAIL, { customerId: item.id })
      }
    >
      <View style={styles.cardContent}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
        </View>

        {/* Info */}
        <View style={styles.cardInfo}>
          <Text style={styles.customerName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.customerPhone}>{formatPhone(item.phone)}</Text>
        </View>

        {/* Right side */}
        <View style={styles.cardRight}>
          <Text style={styles.ordersCount}>
            {item.totalOrders} {item.totalOrders === 1 ? 'order' : 'orders'}
          </Text>
          <View style={styles.balanceRow}>
            <View
              style={[
                styles.balanceDot,
                {
                  backgroundColor: getBalanceDotColor(
                    item.balanceDue,
                    item.totalSpent
                  ),
                },
              ]}
            />
            <Text
              style={[
                styles.balanceText,
                item.balanceDue > 0 && { color: COLORS.error },
              ]}
            >
              {formatCurrency(item.balanceDue)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIcon}>
          <Text style={styles.emptyIconText}>👥</Text>
        </View>
        <Text style={styles.emptyTitle}>No customers yet</Text>
        <Text style={styles.emptySubtitle}>
          Add your first customer to get started
        </Text>
        <CustomButton
          title="Add Your First Customer"
          onPress={() => navigation.navigate(ROUTES.ADD_CUSTOMER)}
          variant="primary"
          size="medium"
          fullWidth={false}
          style={styles.emptyButton}
        />
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.countBadge}>
        {pagination.total} {pagination.total === 1 ? 'Customer' : 'Customers'}
      </Text>
    </View>
  );

  return (
    <AppContainer>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Customers</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => setShowSearch(!showSearch)}
          >
            <Text style={styles.headerIcon}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate(ROUTES.ADD_CUSTOMER)}
          >
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      {showSearch && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search customers..."
            placeholderTextColor={COLORS.textTertiary}
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
          {searchLoading && (
            <ActivityIndicator
              size="small"
              color={COLORS.primary}
              style={styles.searchSpinner}
            />
          )}
        </View>
      )}

      {/* Error Banner */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Loading */}
      {loading && customers.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading customers...</Text>
        </View>
      ) : (
        <FlatList
          data={displayData}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderCustomerCard}
          ListHeaderComponent={displayData.length > 0 ? renderHeader : null}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={
            displayData.length === 0
              ? styles.emptyListContent
              : styles.listContent
          }
          refreshControl={
            <RefreshControl
              refreshing={loading && customers.length > 0}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      {customers.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.8}
          onPress={() => navigation.navigate(ROUTES.ADD_CUSTOMER)}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 18,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  addButtonText: {
    ...TYPOGRAPHY.label,
    color: COLORS.white,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.base,
    marginTop: SPACING.sm,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    ...SHADOWS.sm,
  },
  searchInput: {
    flex: 1,
    height: SIZES.inputHeight,
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  searchSpinner: {
    marginLeft: SPACING.sm,
  },

  // Error
  errorBanner: {
    backgroundColor: COLORS.errorLight,
    marginHorizontal: SPACING.base,
    marginTop: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.error,
  },
  errorText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.error,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },

  // List
  listContent: {
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING['5xl'],
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.base,
  },
  listHeader: {
    paddingVertical: SPACING.md,
  },
  countBadge: {
    ...TYPOGRAPHY.label,
    color: COLORS.textSecondary,
  },

  // Customer Card
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    padding: SPACING.base,
    ...SHADOWS.md,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: SIZES.avatarMedium,
    height: SIZES.avatarMedium,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    ...TYPOGRAPHY.label,
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  cardInfo: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  customerName: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  customerPhone: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  ordersCount: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textTertiary,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  balanceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  balanceText: {
    ...TYPOGRAPHY.label,
    color: COLORS.textPrimary,
    fontSize: 13,
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  emptyIconText: {
    fontSize: 36,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  emptyButton: {
    paddingHorizontal: SPACING['2xl'],
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  fabText: {
    fontSize: 28,
    color: COLORS.white,
    lineHeight: 30,
    fontWeight: '300',
  },
});

export default CustomerListScreen;
