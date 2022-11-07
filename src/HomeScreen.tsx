import React, { FC, useCallback } from "react";
import { Button, Text, View } from "react-native";

import { RootScreenProps } from "./Navigation";

const HomeScreen: FC<RootScreenProps<"Home">> = ({ navigation }) => {
  const handlePress = useCallback(() => {
    navigation.navigate("Map");
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <Text>Hello World</Text>
      <Button onPress={handlePress} title="Click me" />
    </View>
  );
};

export default HomeScreen;
