import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ROUTES } from '../navigations-map/Routes';

import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator
    initialRouteName={ROUTES.SPLASH}
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: 'transparent' },
      animationEnabled: true,
    }}
  >
    <Stack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
    <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
    <Stack.Screen name={ROUTES.SIGN_UP} component={SignUpScreen} />
    <Stack.Screen
      name={ROUTES.FORGOT_PASSWORD}
      component={ForgotPasswordScreen}
    />
  </Stack.Navigator>
);

export default AuthNavigator;
