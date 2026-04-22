import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AppContainer from '../../components/AppContainer';
import CustomHeader from '../../Custom-Components/CustomHeader';
import CustomInput from '../../Custom-Components/CustomInput';
import CustomButton from '../../Custom-Components/CustomButton';
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks';
import { createCustomer, updateCustomer, resetCreateSuccess, clearError } from './customerSlice';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../theme';
import { validatePhone } from '../../utils/helpers';

const PAKISTANI_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Faisalabad',
  'Rawalpindi',
  'Multan',
  'Peshawar',
];

const AddCustomerScreen = ({ navigation, route }) => {
  const existingCustomer = route.params?.customer;
  const isEditMode = !!existingCustomer;

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { createLoading, createSuccess, loading, error } = useAppSelector(
    (state) => state.customers
  );

  const [name, setName] = useState(existingCustomer?.name || '');
  const [phone, setPhone] = useState(existingCustomer?.phone || '');
  const [email, setEmail] = useState(existingCustomer?.email || '');
  const [address, setAddress] = useState(existingCustomer?.address || '');
  const [city, setCity] = useState(existingCustomer?.city || '');
  const [notes, setNotes] = useState(existingCustomer?.notes || '');
  const [showCities, setShowCities] = useState(false);

  const [errors, setErrors] = useState({});

  const token = user?.token;
  const isSubmitting = isEditMode ? loading : createLoading;

  useEffect(() => {
    if (createSuccess) {
      Alert.alert(
        'Success',
        isEditMode ? 'Customer updated successfully!' : 'Customer added successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      dispatch(resetCreateSuccess());
    }
  }, [createSuccess, dispatch, isEditMode, navigation]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validate = useCallback(() => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Enter a valid Pakistani phone number (03XX-XXXXXXX)';
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, phone, email]);

  const handleSubmit = useCallback(() => {
    if (!validate()) return;

    const customerData = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      city: city.trim(),
      notes: notes.trim(),
    };

    if (isEditMode) {
      dispatch(
        updateCustomer({
          token,
          id: existingCustomer.id,
          customerData,
        })
      );
    } else {
      dispatch(createCustomer({ token, customerData }));
    }
  }, [
    validate,
    name,
    phone,
    email,
    address,
    city,
    notes,
    isEditMode,
    dispatch,
    token,
    existingCustomer,
  ]);

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
    setShowCities(false);
  };

  const filteredCities = city.trim()
    ? PAKISTANI_CITIES.filter((c) =>
        c.toLowerCase().startsWith(city.toLowerCase())
      )
    : PAKISTANI_CITIES;

  return (
    <AppContainer>
      <CustomHeader
        title={isEditMode ? 'Edit Customer' : 'Add Customer'}
        onBackPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Error Banner */}
          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          )}

          {/* Form Card */}
          <View style={styles.formCard}>
            <CustomInput
              label="Name"
              placeholder="Customer name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors((e) => ({ ...e, name: '' }));
              }}
              required
              autoCapitalize="words"
              error={errors.name}
              returnKeyType="next"
            />

            <CustomInput
              label="Phone"
              placeholder="03XX-XXXXXXX"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (errors.phone) setErrors((e) => ({ ...e, phone: '' }));
              }}
              required
              keyboardType="phone-pad"
              error={errors.phone}
              helperText="Pakistani format: 03XX-XXXXXXX"
              containerStyle={styles.inputSpacing}
            />

            <CustomInput
              label="Email"
              placeholder="customer@email.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors((e) => ({ ...e, email: '' }));
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              containerStyle={styles.inputSpacing}
            />

            <CustomInput
              label="Address"
              placeholder="Street address"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
              autoCapitalize="sentences"
              containerStyle={styles.inputSpacing}
            />

            {/* City with suggestions */}
            <View style={styles.inputSpacing}>
              <CustomInput
                label="City"
                placeholder="Select or type city"
                value={city}
                onChangeText={(text) => {
                  setCity(text);
                  setShowCities(true);
                }}
                onFocus={() => setShowCities(true)}
                onBlur={() => {
                  // Small delay so tap on suggestion registers
                  setTimeout(() => setShowCities(false), 200);
                }}
                autoCapitalize="words"
              />
              {showCities && filteredCities.length > 0 && (
                <View style={styles.citySuggestions}>
                  {filteredCities.map((c) => (
                    <TouchableOpacity
                      key={c}
                      style={styles.citySuggestionItem}
                      onPress={() => handleCitySelect(c)}
                    >
                      <Text style={styles.citySuggestionText}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <CustomInput
              label="Notes"
              placeholder="Any additional notes..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              autoCapitalize="sentences"
              containerStyle={styles.inputSpacing}
            />
          </View>

          {/* Submit Button */}
          <CustomButton
            title={isEditMode ? 'Update Customer' : 'Add Customer'}
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.submitButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.base,
    paddingBottom: SPACING['3xl'],
  },
  errorBanner: {
    backgroundColor: COLORS.errorLight,
    padding: SPACING.md,
    borderRadius: RADIUS.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.error,
    marginBottom: SPACING.base,
  },
  errorBannerText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.error,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.base,
    ...SHADOWS.md,
  },
  inputSpacing: {
    marginTop: SPACING.base,
  },
  citySuggestions: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    marginTop: SPACING.xs,
    ...SHADOWS.sm,
  },
  citySuggestionItem: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  citySuggestionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  submitButton: {
    marginTop: SPACING.xl,
  },
});

export default AddCustomerScreen;
