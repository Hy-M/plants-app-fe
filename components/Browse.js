import React, { Component } from "react";
import { Image, View, Text, Button, Alert } from "react-native";
import { globalStyles } from "../styles/global";
import * as ImagePicker from "expo-image-picker";

class Browse extends Component {
  state = {
    image: null,
  };

  componentDidMount() {
    this.getCameraPermission();
  }

  getCameraPermission = () => {
    ImagePicker.requestCameraPermissionsAsync().then((permissionResponse) => {
      !permissionResponse.granted &&
        Alert.alert(
          "Permission required",
          "You need to allow access to your camera and camera roll in order to identify plants.",
          [{ text: "Okay" }]
        );
    });
  };

  launchCamera = () => {
    ImagePicker.launchCameraAsync().then((result) => {
      if (!result.cancelled) {
        this.setState({ image: result.uri });
      }
    });
  };

  launchLibary = () => {
    ImagePicker.launchImageLibraryAsync().then((result) => {
      if (!result.cancelled) {
        this.setState({ image: result.uri });
      }
    });
  };

  render() {
    let { image } = this.state;

    return (
      <View style={globalStyles.container}>
        <Text>Take a picture to find out about a plant here :O</Text>
        <Button title="Camera" onPress={this.launchCamera} />
        <Button title="Camera roll" onPress={this.launchLibary} />
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      </View>
    );
  }
}

export default Browse;
