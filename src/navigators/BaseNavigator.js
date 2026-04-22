import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ROUTES } from '../navigations-map/Routes';
import { useAppSelector } from '../hooks/useReduxHooks';

import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';

const Stack = createStackNavigator();

const BaseNavigator = () => {
  const { isAuthenticated, sessionRestored } = useAppSelector(
    (state) => state.auth
  );

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!sessionRestored || !isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <Stack.Screen name={ROUTES.MAIN_TABS} component={MainTabNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default BaseNavigator;
