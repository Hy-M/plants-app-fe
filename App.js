import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Browse from "./screens/Browse";
import Garden from "./screens/Garden";
import Wishlist from "./screens/Wishlist";
import { decode, encode } from "base-64";

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Browse plants" initialRoute component={Browse} />
        <Tab.Screen name="My garden" component={Garden} />
        <Tab.Screen name="Wishlist" component={Wishlist} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
