// authSlice.js — coordinates the entire auth API call flow
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginAPI,
  registerAPI,
  forgotPasswordAPI,
  verifyOtpAPI,
  resetPasswordAPI,
  logoutAPI,
} from '../../network/authNetwork';
import {
  authLoginSerializer,
  authRegisterSerializer,
} from '../../serializers/authSerializer';
import { storeData, removeData } from '../../utils/helpers';
import { STORAGE_KEYS } from '../../utils/constants';

// ─── Async Thunks ───────────────────────────────────────

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const rawResponse = await loginAPI(credentials);
      const cleanData = authLoginSerializer(rawResponse);
      // Persist token
      await storeData(STORAGE_KEYS.AUTH_TOKEN, cleanData.token);
      await storeData(STORAGE_KEYS.USER_DATA, cleanData);
      return cleanData;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please try again.';
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const rawResponse = await registerAPI(userData);
      const cleanData = authRegisterSerializer(rawResponse);
      await storeData(STORAGE_KEYS.AUTH_TOKEN, cleanData.token);
      await storeData(STORAGE_KEYS.USER_DATA, cleanData);
      return cleanData;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Registration failed. Please try again.';
      return rejectWithValue(message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const rawResponse = await forgotPasswordAPI(email);
      return rawResponse;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Request failed. Please try again.';
      return rejectWithValue(message);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const rawResponse = await verifyOtpAPI({ email, otp });
      return rawResponse;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Invalid OTP. Please try again.';
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.user?.token;
      if (token) await logoutAPI(token);
      await removeData(STORAGE_KEYS.AUTH_TOKEN);
      await removeData(STORAGE_KEYS.USER_DATA);
      return null;
    } catch (error) {
      // Even if API fails, clear local data
      await removeData(STORAGE_KEYS.AUTH_TOKEN);
      await removeData(STORAGE_KEYS.USER_DATA);
      return null;
    }
  }
);

export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    try {
      const { getData } = require('../../utils/helpers');
      const userData = await getData(STORAGE_KEYS.USER_DATA);
      if (userData && userData.token) {
        return userData;
      }
      return rejectWithValue('No session found');
    } catch (error) {
      return rejectWithValue('Session restore failed');
    }
  }
);

// ─── Slice ──────────────────────────────────────────────

const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  sessionRestored: false,

  // Forgot password flow
  forgotPasswordLoading: false,
  forgotPasswordSuccess: false,
  forgotPasswordError: null,
  forgotPasswordEmail: '',

  // OTP
  otpLoading: false,
  otpVerified: false,
  otpError: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.forgotPasswordError = null;
      state.otpError = null;
    },
    resetForgotPassword: (state) => {
      state.forgotPasswordLoading = false;
      state.forgotPasswordSuccess = false;
      state.forgotPasswordError = null;
      state.forgotPasswordEmail = '';
      state.otpVerified = false;
      state.otpError = null;
    },
    setForgotPasswordEmail: (state, action) => {
      state.forgotPasswordEmail = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Login ──
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // ── Register ──
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Forgot Password ──
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPasswordLoading = true;
        state.forgotPasswordError = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.forgotPasswordLoading = false;
        state.forgotPasswordSuccess = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPasswordLoading = false;
        state.forgotPasswordError = action.payload;
      })

      // ── OTP ──
      .addCase(verifyOtp.pending, (state) => {
        state.otpLoading = true;
        state.otpError = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.otpLoading = false;
        state.otpVerified = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.otpLoading = false;
        state.otpError = action.payload;
      })

      // ── Logout ──
      .addCase(logoutUser.fulfilled, (state) => {
        Object.assign(state, initialState, { sessionRestored: true });
      })

      // ── Restore Session ──
      .addCase(restoreSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.sessionRestored = true;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.loading = false;
        state.sessionRestored = true;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, resetForgotPassword, setForgotPasswordEmail } =
  authSlice.actions;
export default authSlice.reducer;
