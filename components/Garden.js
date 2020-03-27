import React, { Component } from 'react';
import { View, Text } from "react-native";
import { globalStyles } from "../styles/global";


class Garden extends Component {
    render() {
        return (
            <View style={globalStyles.container}>
                <Text>This is your garden :O</Text>
            </View>
        );
    }
}

export default Garden;