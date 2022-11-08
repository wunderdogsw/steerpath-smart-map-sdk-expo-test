import React, { FC } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// import 'expo-dev-client';

import HomeIcon from "../assets/home.svg";
import MapIcon from "../assets/map.svg";

import { RootStackParamList } from "./Navigation";

import HomeScreen from "./HomeScreen";
import MapScreen from "./MapScreen";
import { SteerpathProvider } from "./useSteerpath";

const Tab = createBottomTabNavigator<RootStackParamList>();

const App: FC = () => (
  <SteerpathProvider>
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home">
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color }) => <HomeIcon fill={color} />,
            tabBarStyle: {
              paddingTop: 10
            },
            header: () => null
          }}
        />
        <Tab.Screen
          name="Map"
          component={MapScreen}
          options={{
            tabBarLabel: "Map",
            tabBarIcon: ({ color }) => <MapIcon fill={color} />,
            tabBarStyle: {
              paddingTop: 10
            },
            header: () => null
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  </SteerpathProvider>
);

export default App;
