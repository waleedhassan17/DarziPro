import React from 'react';
import { SafeAreaView, StatusBar, View, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

const AppContainer = ({
  children,
  backgroundColor = COLORS.background,
  statusBarStyle = 'dark-content',
  statusBarBg = COLORS.background,
  edges,
  style,
}) => {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }, style]}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={statusBarBg}
        translucent={false}
      />
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default AppContainer;
