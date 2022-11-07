import React, { FC } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import 'expo-dev-client';

import { RootStackParamList } from "./Navigation";

import HomeScreen from "./HomeScreen";
import MapScreen from "./MapScreen";
import { SteerpathProvider } from "./useSteerpath";

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: FC = () => (
    <SteerpathProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Map" component={MapScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SteerpathProvider>
  );

export default App;
