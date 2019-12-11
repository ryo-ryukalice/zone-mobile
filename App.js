import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Login from './src/screens/Login'
import Main from './src/screens/Main'

export default function App() {
  const MainNavigator = createAppContainer(
    createSwitchNavigator({
      login: { screen: Login },
      main: { screen: Main }
    })        
  )

  return (
    <View style={styles.container}>
      <MainNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
