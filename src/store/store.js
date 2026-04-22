import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../screens/auth/authSlice';
import customerReducer from '../screens/customers/customerSlice';

// Future slices will be added here as modules are built:
// import orderReducer from '../screens/orders/orderSlice';
// import paymentReducer from '../screens/payments/paymentSlice';
// import workerReducer from '../screens/workers/workerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customerReducer,
    // orders: orderReducer,
    // payments: paymentReducer,
    // workers: workerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
