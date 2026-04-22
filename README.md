# DarziPro — Smart Tailoring, Simplified

A professional React Native mobile app for Pakistani tailors to manage customers, measurements, orders, payments, and automate communication.

## Architecture

This project follows a **scalable layered architecture** with strict separation of concerns:

```
Screen → Slice → Network → API Server → Network → Model + Serializer → Slice → Screen
```

Each layer has a single responsibility. See `React_Native_Architecture_Notes.docx` for full details.

## Project Structure

```
src/
├── store/              # Redux store configuration
├── screens/            # Feature-based screen folders
│   ├── auth/           # ✅ Module 1 (Complete)
│   │   ├── SplashScreen.js
│   │   ├── LoginScreen.js
│   │   ├── SignUpScreen.js
│   │   ├── ForgotPasswordScreen.js
│   │   └── authSlice.js
│   ├── home/           # ✅ Basic dashboard placeholder
│   ├── customers/      # 🔨 Module 2 (Use Copilot prompts)
│   ├── measurements/   # 🔨 Module 3
│   ├── orders/         # 🔨 Module 4
│   ├── payments/       # 🔨 Module 5
│   ├── workers/        # 🔨 Module 6
│   ├── reports/        # 🔨 Module 7
│   ├── notifications/  # 🔨 Module 8
│   └── settings/       # 🔨 Module 9
├── network/            # All API calls
├── models/             # Data shape blueprints
├── serializers/        # Raw → clean data transformers
├── navigators/         # Navigation setup
├── navigations-map/    # Route name constants
├── components/         # Global wrapper components
├── Custom-Components/  # Reusable styled UI blocks
├── hooks/              # Custom hooks
├── theme/              # Colors, typography, spacing
└── utils/              # Constants, helpers
```

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Install iOS pods (macOS only)
cd ios && pod install && cd ..

# 3. Run on Android
npx react-native run-android

# 4. Run on iOS
npx react-native run-ios
```

## Building Remaining Modules

Open `COPILOT_PROMPTS.md` and run each prompt in GitHub Copilot to build the remaining modules step by step.

## Design System

- **Primary**: Deep Emerald `#1B4D3E` — trust, heritage
- **Secondary**: Golden Thread `#C8963E` — craftsmanship
- **Accent**: Terracotta `#D4572A` — action, energy
- **Background**: Warm Linen `#F5F3EF`

## Tech Stack

- React Native 0.74
- Redux Toolkit (state management)
- React Navigation 6 (navigation)
- Axios (HTTP client)
- AsyncStorage (local persistence)
# DarziPro
