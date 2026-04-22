# DarziPro — GitHub Copilot Module Prompts

> Run each prompt below in GitHub Copilot to build the remaining modules.
> Each prompt follows the exact architecture: **Screen → Slice → Network → Model → Serializer → Screen**.
> Always create files inside the correct folders matching the existing project structure.

---

## MODULE 2: Customer Management

### Prompt 2.1 — Customer Model & Serializer

```
In the DarziPro React Native project, create the Customer module's model and serializer following the existing architecture pattern (see src/models/authModel.js and src/serializers/authSerializer.js as reference).

Create file: src/models/customerModel.js
- Define CustomerModel with fields: id, name, phone, email, address, city, notes, totalOrders, totalSpent, balanceDue, measurements (array), createdAt, updatedAt
- Create validateCustomer(data) function that maps raw data to clean model with defaults
- Handle key differences from backend (e.g., phone_number → phone, created_at → createdAt)

Create file: src/serializers/customerSerializer.js
- Import validateCustomer from customerModel
- Create customerListSerializer(rawResponse) — maps array of raw customers through validateCustomer
- Create customerDetailSerializer(rawResponse) — maps single customer
- Create customerCreateSerializer(rawResponse) — maps newly created customer response
- Handle nested data like measurements array
```

### Prompt 2.2 — Customer Network Layer

```
In the DarziPro React Native project, create the customer network layer following the existing pattern (see src/network/authNetwork.js as reference).

Create file: src/network/customerNetwork.js
- Import axios and API_BASE_URL from utils/constants
- Create authenticated API instance that accepts token in Authorization header
- Export these functions (all return response.data, NO data transformation):
  * getCustomersAPI(token, params) — GET /customers with optional search, page, limit query params
  * getCustomerByIdAPI(token, id) — GET /customers/:id
  * createCustomerAPI(token, customerData) — POST /customers
  * updateCustomerAPI(token, id, customerData) — PUT /customers/:id
  * deleteCustomerAPI(token, id) — DELETE /customers/:id
  * searchCustomersAPI(token, query) — GET /customers/search?q=query
```

### Prompt 2.3 — Customer Redux Slice

```
In the DarziPro React Native project, create the customer Redux slice following the exact pattern from src/screens/auth/authSlice.js.

Create file: src/screens/customers/customerSlice.js
- Import createSlice, createAsyncThunk from @reduxjs/toolkit
- Import all functions from network/customerNetwork.js
- Import serializers from serializers/customerSerializer.js

Create these async thunks (each follows the pattern: call network → serialize → return clean data):
- fetchCustomers: calls getCustomersAPI, serializes list, handles pagination
- fetchCustomerById: calls getCustomerByIdAPI, serializes single customer
- createCustomer: calls createCustomerAPI, serializes response
- updateCustomer: calls updateCustomerAPI, serializes response
- deleteCustomer: calls deleteCustomerAPI, returns id for removal from state
- searchCustomers: calls searchCustomersAPI, serializes list

Initial state:
- customers: [], selectedCustomer: null, loading: false, error: null
- searchResults: [], searchLoading: false
- createLoading: false, createSuccess: false
- pagination: { page: 1, totalPages: 1, total: 0 }

Reducers: clearError, clearSelectedCustomer, resetCreateSuccess
ExtraReducers: handle pending/fulfilled/rejected for all thunks

Then register this reducer in src/store/store.js under the key "customers".
```

### Prompt 2.4 — Customer List Screen

```
In the DarziPro React Native project, create the Customer List screen with professional UI matching the existing design system (see src/theme/ for colors, typography, spacing).

Create file: src/screens/customers/CustomerListScreen.js

Design requirements:
- Use AppContainer wrapper from src/components/AppContainer.js
- Header with title "Customers", search icon, and "Add" button
- Search bar (TextInput) with real-time filtering using searchCustomers thunk
- Customer count badge showing total
- FlatList of customer cards, each showing:
  * Avatar circle with initials (use getInitials from utils/helpers)
  * Name (bold), phone number below
  * Right side: total orders count, balance due in PKR (use formatCurrency)
  * Colored dot: green if balance=0, orange if partial, red if overdue
  * TouchableOpacity — navigates to CustomerDetail screen
- Empty state: illustration + "No customers yet" + "Add your first customer" button
- Pull-to-refresh functionality
- Loading skeleton/spinner
- FloatingActionButton bottom-right to add new customer
- Use useAppDispatch and useAppSelector hooks from src/hooks/useReduxHooks.js
- Dispatch fetchCustomers on mount using useEffect
- Follow the exact styling patterns from LoginScreen (card shadows, spacing, border radius)
- Colors: COLORS.primary for headers, COLORS.white for cards, COLORS.background for page bg
```

### Prompt 2.5 — Add/Edit Customer Screen

```
In the DarziPro React Native project, create the Add/Edit Customer screen.

Create file: src/screens/customers/AddCustomerScreen.js

Design requirements:
- Receives optional "customer" param for edit mode (check route.params)
- CustomHeader with back arrow, title "Add Customer" or "Edit Customer"
- ScrollView with KeyboardAvoidingView
- Form card (white, rounded, shadow) containing:
  * CustomInput for: Name (required), Phone (required, keyboardType phone-pad, Pakistani format 03XX-XXXXXXX), Email (optional), Address (multiline), City (with common Pakistani cities as suggestions: Lahore, Karachi, Islamabad, Faisalabad, Rawalpindi, Multan, Peshawar), Notes (multiline, optional)
- Validation: name required, phone required + validatePhone from helpers
- Submit button dispatches createCustomer or updateCustomer thunk
- Loading state on button while submitting
- Success: show toast notification and navigate back
- Error: show error banner at top
- Use all Custom-Components (CustomButton, CustomInput) from existing codebase
```

### Prompt 2.6 — Customer Detail Screen

```
In the DarziPro React Native project, create the Customer Detail screen.

Create file: src/screens/customers/CustomerDetailScreen.js

Design requirements:
- Header with customer name, edit icon, and kebab menu (delete option)
- Profile section: large avatar with initials, name, phone (tap to call), email
- Stats row (3 cards): Total Orders, Total Spent (PKR), Balance Due
- Tab navigation: Orders | Measurements | Payments
  * Each tab shows relevant list (placeholder for now with "Coming soon" message)
- Quick action buttons row: "New Order", "Add Measurement", "Record Payment"
- Delete confirmation modal with warning text
- Fetch customer detail on mount using fetchCustomerById thunk
- Loading and error states
```

---

## MODULE 3: Measurement Management

### Prompt 3.1 — Measurement Model, Serializer & Network

```
In the DarziPro React Native project, create the Measurement module's data layer.

Create file: src/models/measurementModel.js
- MeasurementModel fields: id, customerId, customerName, garmentType (from GARMENT_TYPES in constants), measurements object (dynamic key-value pairs), notes, createdAt, updatedAt
- The measurements object should support Pakistani garment fields:
  * For Shalwar Kameez (Men): shoulder, chest, waist, hip, sleeveLength, armhole, kameezLength, collarSize, daaman, shalwarLength, shalwarWaist, shalwarBottom, pauncha
  * For Shalwar Kameez (Women): shoulder, bust, waist, hip, sleeveLength, armhole, shirtLength, daaman, shalwarLength, shalwarWaist, shalwarBottom, dupattaLength
  * For other garments: relevant fields
- Create validateMeasurement(data) function
- Create MEASUREMENT_FIELDS constant object mapping garmentType to array of field definitions {key, label, labelUrdu, unit}

Create file: src/serializers/measurementSerializer.js
- measurementListSerializer, measurementDetailSerializer, measurementCreateSerializer

Create file: src/network/measurementNetwork.js
- getMeasurementsAPI(token, customerId) — GET /customers/:customerId/measurements
- getMeasurementByIdAPI(token, id) — GET /measurements/:id
- createMeasurementAPI(token, data) — POST /measurements
- updateMeasurementAPI(token, id, data) — PUT /measurements/:id
- deleteMeasurementAPI(token, id) — DELETE /measurements/:id
```

### Prompt 3.2 — Measurement Slice

```
In the DarziPro React Native project, create the measurement Redux slice.

Create file: src/screens/measurements/measurementSlice.js
- Follow the exact same pattern as customerSlice.js
- Thunks: fetchMeasurements (by customerId), fetchMeasurementById, createMeasurement, updateMeasurement, deleteMeasurement
- State: measurements[], selectedMeasurement, loading, error, createLoading, createSuccess
- Register in store.js under key "measurements"
```

### Prompt 3.3 — Add Measurement Screen

```
In the DarziPro React Native project, create the Add Measurement screen — this is the core feature of the app.

Create file: src/screens/measurements/AddMeasurementScreen.js

Design requirements:
- Step 1: Select garment type using attractive cards grid (2 columns)
  * Each card shows emoji icon + garment name (English + Urdu)
  * Cards for: Shalwar Kameez Men ♂️, Shalwar Kameez Women ♀️, Kurta, Waistcoat, Sherwani, Trouser, Shirt, Custom
  * Selected card gets primary border + checkmark
- Step 2: Enter measurements
  * Dynamically render input fields based on selected garment type using MEASUREMENT_FIELDS
  * Each field: label (English), label (Urdu) in smaller text, numeric input with unit (inches/cm)
  * Group fields logically: "Upper Body", "Lower Body", "Arms", "Other"
  * Each group in a collapsible section with section header
  * Unit toggle: Inches / CM (converts values when toggled)
  * Visual body diagram placeholder showing where each measurement is taken
- Step 3: Review & Save
  * Summary card showing all entered measurements in a clean table
  * Notes field (optional)
  * Save button dispatches createMeasurement thunk
- Progress indicator at top showing Step 1/2/3
- Customer name shown in header (received via route params)
- Professional UI: warm linen background, white cards, emerald accents, golden highlights
```

### Prompt 3.4 — Measurement Detail & List Screens

```
In the DarziPro React Native project, create measurement list and detail screens.

Create file: src/screens/measurements/MeasurementListScreen.js
- Shows all measurements for a specific customer (customerId from route params)
- Cards grouped by garment type
- Each card: garment type icon + name, date created, measurement count, edit/delete actions
- Empty state for no measurements
- FAB to add new measurement

Create file: src/screens/measurements/MeasurementDetailScreen.js
- Shows all measurement values in a clean tabular format
- Garment type header with icon
- Measurement fields grouped by body section
- Each row: field label, value with unit
- Edit button in header
- Share/Print button (generates text summary for WhatsApp sharing)
- Delete with confirmation
```

---

## MODULE 4: Order Management

### Prompt 4.1 — Order Data Layer

```
In the DarziPro React Native project, create the Order module's complete data layer.

Create file: src/models/orderModel.js
- OrderModel fields: id, customerId, customerName, customerPhone, garmentType, fabricDetails, measurementId, status (from ORDER_STATUS constants), totalAmount, paidAmount, balanceDue, deliveryDate, notes, specialInstructions, assignedWorker, workerId, createdAt, updatedAt
- validateOrder function with proper defaults
- ORDER_STATUS_LABELS mapping status to {label, color, icon} for UI

Create file: src/serializers/orderSerializer.js
- orderListSerializer, orderDetailSerializer, orderCreateSerializer, orderUpdateSerializer

Create file: src/network/orderNetwork.js
- getOrdersAPI(token, params) — GET /orders with filters (status, customerId, dateRange, page)
- getOrderByIdAPI(token, id)
- createOrderAPI(token, data)
- updateOrderAPI(token, id, data)
- updateOrderStatusAPI(token, id, status)
- deleteOrderAPI(token, id)
- getOrderStatsAPI(token) — GET /orders/stats (returns counts by status)

Create file: src/screens/orders/orderSlice.js
- Thunks for all CRUD operations + updateOrderStatus + fetchOrderStats
- State: orders[], selectedOrder, loading, error, stats {pending, cutting, stitching, finishing, ready, delivered}, createLoading, createSuccess, pagination
- Register in store.js
```

### Prompt 4.2 — Order List Screen

```
In the DarziPro React Native project, create the Order List screen.

Create file: src/screens/orders/OrderListScreen.js

Design requirements:
- Header: "Orders" with search icon and filter icon
- Status filter tabs (horizontal scroll): All, Pending, Cutting, Stitching, Finishing, Ready, Delivered
  * Each tab shows count badge
  * Active tab: primary color underline
- Order cards in FlatList:
  * Left: status color bar (vertical stripe matching status color)
  * Customer name (bold) + phone
  * Garment type icon + name
  * Delivery date with countdown: "Due in 3 days" (green) / "Due tomorrow" (orange) / "Overdue" (red)
  * Amount: total, paid (green), balance (red if pending)
  * Status badge pill
  * Assigned worker name if any
- Quick status update: swipe left reveals next-status button (e.g., swipe on "Pending" shows "Start Cutting")
- Sort options: By date, By status, By amount
- Empty state per filter tab
- FAB: "New Order" button
- Pull to refresh
```

### Prompt 4.3 — Create Order Screen

```
In the DarziPro React Native project, create the New Order screen.

Create file: src/screens/orders/AddOrderScreen.js

Design requirements:
- Multi-step form with progress bar:
  
  Step 1 — Customer Selection:
  * Search existing customers (real-time search)
  * Customer card shows name, phone, last order
  * "Add New Customer" button if not found
  
  Step 2 — Garment & Measurements:
  * Select garment type (cards grid like measurement screen)
  * Select existing measurement for this customer/garment type (dropdown)
  * Or link to "Add New Measurement" screen
  * Fabric details: text input for fabric description
  
  Step 3 — Order Details:
  * Total amount: currency input (PKR) with large monospace font
  * Advance payment: currency input
  * Balance auto-calculated and displayed
  * Delivery date: date picker (default +7 days)
  * Special instructions: multiline text
  * Assign worker/karigar: dropdown of workers (optional)
  
  Step 4 — Review & Confirm:
  * Summary card with all details
  * Customer info, garment, measurements reference, amount breakdown
  * "Confirm Order" button

- Navigation: Back/Next buttons, step indicator
- Dispatch createOrder thunk on confirm
- Success animation + navigate to order detail
```

### Prompt 4.4 — Order Detail Screen

```
In the DarziPro React Native project, create the Order Detail screen.

Create file: src/screens/orders/OrderDetailScreen.js

Design requirements:
- Header with order number (#ORD-XXXX) and kebab menu (edit, delete)
- Status pipeline visualization: horizontal stepper showing all statuses
  * Completed steps: green with checkmark
  * Current step: primary color, pulsing/highlighted
  * Future steps: gray outline
  * Steps: Pending → Cutting → Stitching → Finishing → Ready → Delivered
- "Update Status" button: advances to next status with confirmation modal
- Customer card: name, phone (tap to call), address
- Garment details: type, fabric description
- Linked measurement: tap to view full measurements
- Financial section:
  * Total amount, paid amount, balance due
  * Payment history list
  * "Record Payment" button
- Delivery date with countdown
- Worker assigned (if any)
- Special instructions
- Action buttons: "Send WhatsApp Update", "Record Payment", "Print Receipt"
- Timeline/audit log showing all status changes with timestamps
```

---

## MODULE 5: Payment Management

### Prompt 5.1 — Payment Data Layer & Slice

```
In the DarziPro React Native project, create the complete Payment module data layer.

Create files:
1. src/models/paymentModel.js
   - PaymentModel: id, orderId, customerId, customerName, amount, paymentMethod (cash/bank/easypaisa/jazzcash), paymentDate, receiptNumber, notes, createdAt
   - validatePayment function

2. src/serializers/paymentSerializer.js
   - paymentListSerializer, paymentCreateSerializer

3. src/network/paymentNetwork.js
   - getPaymentsAPI(token, params) — with filters (customerId, orderId, dateRange, method)
   - createPaymentAPI(token, data)
   - getPaymentStatsAPI(token, dateRange) — returns totalReceived, totalPending, todayCollection

4. src/screens/payments/paymentSlice.js
   - Thunks: fetchPayments, createPayment, fetchPaymentStats
   - State: payments[], loading, error, stats, createLoading, createSuccess
   - Register in store.js
```

### Prompt 5.2 — Payment Screens

```
In the DarziPro React Native project, create the Payment screens.

Create file: src/screens/payments/PaymentListScreen.js
- Summary cards at top: Today's Collection, Total Pending, This Month Revenue
- Filter tabs: All, Today, This Week, This Month
- Payment list: customer name, amount (large green text), method icon, date, linked order #
- Each payment card: tap to see receipt details

Create file: src/screens/payments/AddPaymentScreen.js
- Select customer (search) or receive via route params from order detail
- Select order (dropdown of customer's unpaid orders, showing balance for each)
- Amount input: large currency input, shows "Balance: PKR X" below
- Full/Partial toggle: "Pay Full Balance" auto-fills amount
- Payment method selector: Cash (default), Bank Transfer, EasyPaisa, JazzCash
- Date picker (defaults to today)
- Notes field
- Receipt number (auto-generated or manual)
- "Record Payment" button
- Success: show receipt summary with option to "Send Receipt via WhatsApp"
```

---

## MODULE 6: Worker/Karigar Management

### Prompt 6.1 — Worker Module Complete

```
In the DarziPro React Native project, create the complete Worker/Karigar management module.

Create all data layer files following the established architecture:

1. src/models/workerModel.js
   - WorkerModel: id, name, phone, specialization (array: stitching, cutting, embroidery, finishing), dailyRate, perPieceRate, activeOrders, completedOrders, rating, status (active/inactive), joinDate
   
2. src/serializers/workerSerializer.js
3. src/network/workerNetwork.js
   - CRUD operations + getWorkerPerformanceAPI(token, workerId, dateRange)
   
4. src/screens/workers/workerSlice.js

Create screens:

5. src/screens/workers/WorkerListScreen.js
   - Worker cards: avatar + name, specialization tags, active orders count, rating stars
   - Status badge: Active/Inactive
   - Quick assign: tap worker → see available for assignment
   
6. src/screens/workers/AddWorkerScreen.js
   - Name, phone, specialization multi-select chips, rate inputs (daily + per piece)
   
7. src/screens/workers/WorkerDetailScreen.js
   - Profile, performance stats, assigned orders list, payment history, rating

Register reducer in store.js under key "workers".
```

---

## MODULE 7: Notifications & Automation

### Prompt 7.1 — Notification Service

```
In the DarziPro React Native project, create the notification/automation module for SMS and WhatsApp messaging.

Create file: src/utils/notificationService.js
- WhatsApp deep linking utility:
  * openWhatsApp(phone, message) — opens WhatsApp with pre-filled message using Linking.openURL
  * generateOrderConfirmationMessage(order, customer) — returns formatted Urdu+English message
  * generatePaymentReminderMessage(order, customer, balanceDue) — payment reminder template
  * generateOrderReadyMessage(order, customer) — "Your order is ready for pickup" template
  * generatePaymentReceiptMessage(payment, order, customer) — receipt confirmation
  * All messages should be bilingual (English + Urdu) and include shop name

Create file: src/network/notificationNetwork.js
- sendSMSAPI(token, { phone, message }) — POST /notifications/sms
- sendWhatsAppAPI(token, { phone, message, templateId }) — POST /notifications/whatsapp
- getNotificationHistoryAPI(token, params) — GET /notifications

Create file: src/screens/notifications/NotificationListScreen.js
- List of sent notifications with status (sent/delivered/failed)
- Filter by type: SMS, WhatsApp
- Each item: customer name, message preview, timestamp, status badge
- Quick resend option for failed notifications

Message templates should include:
- Order confirmation: "Assalam o Alaikum {name}, your order #{id} for {garment} has been received. Delivery date: {date}. Total: PKR {amount}. Thank you! — {shopName}"
- Payment reminder: "Dear {name}, a payment of PKR {balance} is pending for order #{id}. Kindly clear the balance at your earliest convenience. — {shopName}"
- Order ready: "Dear {name}, your {garment} (Order #{id}) is ready for pickup! Please visit our shop. — {shopName}"
```

---

## MODULE 8: Reports & Analytics Dashboard

### Prompt 8.1 — Reports Module

```
In the DarziPro React Native project, create the Reports & Analytics module.

Create file: src/network/reportsNetwork.js
- getDashboardStatsAPI(token) — returns totalCustomers, totalOrders, totalRevenue, pendingPayments, ordersThisMonth, revenueThisMonth
- getRevenueReportAPI(token, dateRange) — daily/weekly/monthly revenue data
- getOrderStatusReportAPI(token, dateRange) — orders grouped by status
- getTopCustomersAPI(token, limit) — top customers by revenue
- getGarmentPopularityAPI(token) — most ordered garment types

Create file: src/screens/reports/ReportsDashboardScreen.js
- Key metrics grid (2x2): Total Revenue, Total Orders, Pending Payments, Active Customers
  * Each card: icon, large number (monospace), trend indicator (up/down arrow + percentage)
- Revenue chart section: simple bar chart using react-native-chart-kit or custom View-based bars
  * Time period selector: This Week / This Month / 3 Months
- Order status donut/pie: visual breakdown by status with legend
- Top 5 customers list: name, total spent, order count
- Most popular garments: ranked list with count
- Quick actions: "Export Report", "Share Summary via WhatsApp"
- All data fetched on mount, loading skeleton while fetching
```

---

## MODULE 9: Settings & Profile

### Prompt 9.1 — Settings Module

```
In the DarziPro React Native project, create the Settings & Profile module.

Create file: src/screens/settings/SettingsScreen.js (this replaces the placeholder in MainTabNavigator)
- Profile card at top: avatar (initials), name, email, shop name, "Edit Profile" button
- Settings sections (grouped):

  BUSINESS:
  - Shop Name (editable)
  - Shop Address
  - Shop Phone
  - Business Logo (image picker placeholder)
  
  PREFERENCES:
  - Language: English / Urdu toggle (store in AsyncStorage)
  - Currency: PKR (default, read-only for now)
  - Default measurement unit: Inches / CM
  - Notifications: Push toggle, SMS toggle, WhatsApp toggle
  
  DATA:
  - Export All Data (generates JSON/CSV)
  - Backup to Cloud (placeholder)
  - Clear Local Cache
  
  ABOUT:
  - App Version: 1.0.0
  - Terms of Service (opens URL)
  - Privacy Policy (opens URL)
  - Rate App (opens store link)
  - Contact Support (opens email/WhatsApp)
  
  ACCOUNT:
  - Change Password (navigates to change password screen)
  - Sign Out (dispatches logoutUser, confirmation modal)
  - Delete Account (danger zone, red text, double confirmation)

Each setting row: icon + label + value/toggle on right + chevron for navigable items
Section headers with subtle dividers

Create file: src/screens/settings/EditProfileScreen.js
- Form with: name, email, phone, shop name, address
- Avatar picker (placeholder with camera icon)
- Save button dispatches profile update
```

---

## MODULE 10: Enhanced Home Dashboard

### Prompt 10.1 — Full Dashboard

```
In the DarziPro React Native project, replace the placeholder HomeScreen with a full dashboard.

Update file: src/screens/home/HomeScreen.js

Design requirements:
- Greeting section: "Good Morning, {name}" with avatar, shop name, current date
- Alert banner (if any): overdue orders count, low on thread, etc.
- Stats cards (horizontal scroll): Today's Orders, Pending Delivery, Today's Collection, Total Customers
- Quick Actions grid (2x2): Add Customer, New Order, Record Payment, Measurements
  * Each card: large emoji icon, title, brief description, tap navigates to respective screen
- Pending Orders section:
  * Horizontal list of order cards needing attention (overdue or due today)
  * Each: customer name, garment type, delivery date, status
  * "View All" link → navigates to Orders tab
- Recent Activity feed:
  * Timeline of last 5 actions: "New order from Ali", "Payment received PKR 2,500", etc.
  * Each item: icon, description, relative timestamp
- All data fetched from dashboard stats API on mount
- Pull to refresh
- Warm, professional design matching the DarziPro theme
```

---

## NAVIGATION INTEGRATION

### Prompt 11.1 — Wire Up All Navigators

```
In the DarziPro React Native project, update the navigation to include all new modules.

Update file: src/navigators/MainTabNavigator.js
- Replace PlaceholderScreen imports with actual screen components
- Customers tab → CustomerListScreen
- Orders tab → OrderListScreen  
- Settings tab → SettingsScreen

Create file: src/navigators/CustomerNavigator.js (stack navigator for customer flow)
- Screens: CustomerList, CustomerDetail, AddCustomer, EditCustomer, MeasurementList, AddMeasurement, MeasurementDetail

Create file: src/navigators/OrderNavigator.js
- Screens: OrderList, OrderDetail, AddOrder, EditOrder

Update file: src/navigators/BaseNavigator.js
- Keep auth flow as-is
- Main flow: tab navigator with nested stack navigators for each tab
- Ensure back navigation works correctly between nested stacks

Update file: src/navigations-map/Routes.js if any new route names are needed.
Update file: src/store/store.js to register all new slice reducers.
```

---

## NOTES FOR COPILOT

When generating code for each prompt:
1. **Always import from the existing theme**: `import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, SIZES } from '../../theme'`
2. **Always use existing custom components**: CustomButton, CustomInput, CustomHeader, Logo, AppContainer
3. **Always use Redux hooks**: `import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks'`
4. **Always use route constants**: `import { ROUTES } from '../../navigations-map/Routes'`
5. **Follow the data flow**: Screen dispatches → Slice thunk → Network API call → Serializer cleans data → Slice stores → Screen reads
6. **Pakistani context**: Use PKR currency, Pakistani phone formats (03XX-XXXXXXX), Pakistani garment types, Urdu labels where helpful
7. **Design consistency**: White cards on warm linen background, emerald primary, golden accents, 12px radius, medium shadows
8. **Error handling**: Every thunk uses try/catch with rejectWithValue, every screen shows error banners
9. **Loading states**: Every list has pull-to-refresh, every form button has loading spinner
