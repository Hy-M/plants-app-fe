import React from "react";
import { createBottomTabNavigator, BottomTabView } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Browse from "./screens/Browse";
import Garden from "./screens/Garden";
import Wishlist from "./screens/Wishlist";
import Account from "./screens/Account";
import { decode, encode } from "base-64";
import Amplify from "aws-amplify";
import awsConfig from "./src/aws-exports";

Amplify.configure(awsConfig);

import { withAuthenticator } from "aws-amplify-react-native";
console.disableYellowBox = true;
if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Browse plants" initialRoute component={Browse} />
        <Tab.Screen name="Garden" component={Garden} />
        <Tab.Screen name="Wishlist" component={Wishlist} />
        <Tab.Screen name="Account" component={Account} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default withAuthenticator(App);
