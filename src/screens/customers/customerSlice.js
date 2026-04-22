// customerSlice.js — coordinates the entire customer API call flow
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getCustomersAPI,
  getCustomerByIdAPI,
  createCustomerAPI,
  updateCustomerAPI,
  deleteCustomerAPI,
  searchCustomersAPI,
} from '../../network/customerNetwork';
import {
  customerListSerializer,
  customerDetailSerializer,
  customerCreateSerializer,
} from '../../serializers/customerSerializer';

// ─── Async Thunks ───────────────────────────────────────

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async ({ token, params } = {}, { rejectWithValue }) => {
    try {
      const rawResponse = await getCustomersAPI(token, params);
      const cleanData = customerListSerializer(rawResponse);
      return cleanData;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch customers.';
      return rejectWithValue(message);
    }
  }
);

export const fetchCustomerById = createAsyncThunk(
  'customers/fetchCustomerById',
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const rawResponse = await getCustomerByIdAPI(token, id);
      const cleanData = customerDetailSerializer(rawResponse);
      return cleanData;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch customer details.';
      return rejectWithValue(message);
    }
  }
);

export const createCustomer = createAsyncThunk(
  'customers/createCustomer',
  async ({ token, customerData }, { rejectWithValue }) => {
    try {
      const rawResponse = await createCustomerAPI(token, customerData);
      const cleanData = customerCreateSerializer(rawResponse);
      return cleanData;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to create customer.';
      return rejectWithValue(message);
    }
  }
);

export const updateCustomer = createAsyncThunk(
  'customers/updateCustomer',
  async ({ token, id, customerData }, { rejectWithValue }) => {
    try {
      const rawResponse = await updateCustomerAPI(token, id, customerData);
      const cleanData = customerDetailSerializer(rawResponse);
      return cleanData;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to update customer.';
      return rejectWithValue(message);
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async ({ token, id }, { rejectWithValue }) => {
    try {
      await deleteCustomerAPI(token, id);
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to delete customer.';
      return rejectWithValue(message);
    }
  }
);

export const searchCustomers = createAsyncThunk(
  'customers/searchCustomers',
  async ({ token, query }, { rejectWithValue }) => {
    try {
      const rawResponse = await searchCustomersAPI(token, query);
      const cleanData = customerListSerializer(rawResponse);
      return cleanData;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Search failed. Please try again.';
      return rejectWithValue(message);
    }
  }
);

// ─── Slice ──────────────────────────────────────────────

const initialState = {
  customers: [],
  selectedCustomer: null,
  loading: false,
  error: null,

  searchResults: [],
  searchLoading: false,

  createLoading: false,
  createSuccess: false,

  pagination: { page: 1, totalPages: 1, total: 0 },
};

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
    },
    resetCreateSuccess: (state) => {
      state.createSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Fetch Customers ──
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.customers;
        state.pagination = {
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
        };
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Fetch Customer By Id ──
      .addCase(fetchCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCustomer = action.payload;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Create Customer ──
      .addCase(createCustomer.pending, (state) => {
        state.createLoading = true;
        state.createSuccess = false;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = true;
        state.customers.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.createLoading = false;
        state.createSuccess = false;
        state.error = action.payload;
      })

      // ── Update Customer ──
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCustomer = action.payload;
        const index = state.customers.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Delete Customer ──
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = state.customers.filter(
          (c) => c.id !== action.payload
        );
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        if (
          state.selectedCustomer &&
          state.selectedCustomer.id === action.payload
        ) {
          state.selectedCustomer = null;
        }
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Search Customers ──
      .addCase(searchCustomers.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchCustomers.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.customers;
      })
      .addCase(searchCustomers.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedCustomer, resetCreateSuccess } =
  customerSlice.actions;
export default customerSlice.reducer;
