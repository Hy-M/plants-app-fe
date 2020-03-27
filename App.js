import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { globalStyles } from "./styles/global";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Browse from './components/Browse';
import Garden from './components/Garden';
import Wishlist from './components/Wishlist';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer >
      <Tab.Navigator>
        <Tab.Screen name="Browse plants" component={Browse} />
        <Tab.Screen name="My garden" component={Garden} />
        <Tab.Screen name="Wishlist" component={Wishlist} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
