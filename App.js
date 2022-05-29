import React from 'react';
import type {Node} from 'react';
import {
  StyleSheet,
  useColorScheme,
  SafeAreaView,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import Home from './views/Home';
import Play from './views/Play';
import EGame from './views/EGame';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EPlay from './views/EPlay';
import CreateUser from './views/CreateUser';


const Stack = createNativeStackNavigator();

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };


  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Play" component={Play} />
        <Stack.Screen name="EPlay" component={EPlay} />
        <Stack.Screen name="EGame" component={EGame} />
        <Stack.Screen name="IPlay" component={Play} />
        <Stack.Screen name="CreateUser" component={CreateUser} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({

});

export default App;
