import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { globalStyles } from "../styles/global";
import { Auth } from "aws-amplify";

class Account extends Component {
  state = {
    user: Auth.user.username,
  };

  handleSignOutPress = () => {};

  render() {
    const { user } = this.state;
    let date = new Date();
    return (
      <View style={globalStyles.accountScreenContainer}>
        <Text style={globalStyles.secondaryText}>
          {date.getHours() < 12 && `Good morning, ${user}!`}
          {date.getHours() < 17 && `Good afternoon, ${user}!`}
          {date.getHours() >= 17 && `Good evening, ${user}!`}
        </Text>
        <View style={globalStyles.btnContainerSingle}>
          <TouchableOpacity style={globalStyles.btnSingle} onPress={this.handleSignOutPress}>
            <Text style={globalStyles.btnText}>Sign out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default Account;
