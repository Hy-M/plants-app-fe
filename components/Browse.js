import React, { Component } from 'react';
import { View, Text } from "react-native";
import { globalStyles } from "../styles/global";

class Browse extends Component {
    render() {
        return (
            <View style={globalStyles.container}>
                <Text>Browse plants here :O</Text>
            </View >
        );
    }
}

export default Browse;