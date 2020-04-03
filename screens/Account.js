import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { globalStyles } from "../styles/global";
import { Auth } from "aws-amplify";
import Emoji from "react-native-emoji";

class Account extends Component {
  state = {
    user: Auth.user.username,
    loggedIn: true,
  };

  handleSignOut = () => {
    Auth.signOut()
      .then(() => {
        this.setState({ loggedIn: false, user: "" });
      })
      .catch((err) => console.log(err, "< err in handleSignOut"));
  };

  render() {
    const { user } = this.state;
    let date = new Date();
    return (
      <View style={globalStyles.accountScreenContainer}>
        {date.getHours() < 12 && (
          <Text style={globalStyles.mainText}>
            Good morning, {user}
            <Emoji name="sun_with_face" style={{ fontSize: 25 }} />
          </Text>
        )}
        {date.getHours() < 17 && (
          <Text style={globalStyles.mainText}>
            Good afternoon, {user}
            <Emoji name="sun_with_face" style={{ fontSize: 25 }} />
          </Text>
        )}
        {date.getHours() >= 17 && (
          <Text style={globalStyles.mainText}>
            Good evening, {user}
            <Emoji name="first_quarter_moon_with_face" style={{ fontSize: 25 }} />
          </Text>
        )}

        <View style={globalStyles.btnContainerSingle}>
          <TouchableOpacity style={globalStyles.btnSingle} onPress={this.handleSignOut}>
            <Text style={globalStyles.btnText}>Sign out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default Account;
