import React, { FC } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import 'expo-dev-client';

import HomeScreen from "./HomeScreen";
import MapScreen from "./MapScreen";
import { SteerpathProvider } from "./useSteerpath";


const Stack = createNativeStackNavigator();

const App: FC = () => {
  return (
    <SteerpathProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Map" component={MapScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SteerpathProvider>
  );
};

export default App;