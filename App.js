import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { store } from './src/store/store';
import BaseNavigator from './src/navigators/BaseNavigator';
import { COLORS } from './src/theme';

const navigationTheme = {
  dark: false,
  colors: {
    primary: COLORS.primary,
    background: COLORS.background,
    card: COLORS.white,
    text: COLORS.textPrimary,
    border: COLORS.border,
    notification: COLORS.accent,
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <NavigationContainer theme={navigationTheme}>
          <BaseNavigator />
        </NavigationContainer>
        <Toast />
      </Provider>
    </GestureHandlerRootView>
  );
}
