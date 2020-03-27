import React, { Component } from 'react';
import { View, Text } from "react-native";
import { globalStyles } from "../styles/global";


class Wishlist extends Component {
    render() {
        return (
            <View style={globalStyles.container}>
                <Text>This is your Wishlist :O</Text>
            </View>
        );
    }
}

export default Wishlist;