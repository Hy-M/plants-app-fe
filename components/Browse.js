import React, { Component } from "react";
import { Image, View, Text, Button, Alert, StyleSheet, ScrollView } from "react-native";
import { globalStyles } from "../styles/global";
import * as ImagePicker from "expo-image-picker";
import { PLANT_ID_API_KEY } from "react-native-dotenv";
import * as api from "../api";

class Browse extends Component {
  state = {
    imageUri: null,
    imageBase64: null,
    identifyHasBeenClicked: false,
    plantIdentified: false,
    plantIdResponse: null,
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
    ImagePicker.launchCameraAsync({
      base64: true,
    }).then((result) => {
      if (!result.cancelled) {
        this.setState({ imageUri: result.uri, imageBase64: result.base64 });
      }
    });
  };

  launchLibary = () => {
    ImagePicker.launchImageLibraryAsync({
      base64: true,
    }).then((result) => {
      if (!result.cancelled) {
        this.setState({ imageUri: result.uri, imageBase64: result.base64 });
      }
    });
  };

  requestPlantIdentification = () => {
    this.setState({ identifyHasBeenClicked: true });
    let { imageBase64 } = this.state;
    api
      .getPlantIdentification(imageBase64, PLANT_ID_API_KEY)
      .then((plantIdResponse) => {
        this.setState({ plantIdentified: true, plantIdResponse, identifyHasBeenClicked: false });
      })
      .catch((err) => console.log(err, "error in browse.js"));
  };

  render() {
    let {
      imageUri,
      imageBase64,
      plantIdentified,
      plantIdResponse,
      identifyHasBeenClicked,
    } = this.state;

    return (
      <ScrollView>
        <View style={globalStyles.container}>
          <Text>Choose a picture to find out about a plant here :O</Text>
          <Button title="Camera" onPress={this.launchCamera} />
          <Button title="Camera roll" onPress={this.launchLibary} />
          {imageUri && imageBase64 && (
            <View>
              <Image source={{ uri: imageUri }} style={styles.imgPreview} />
              {!plantIdentified && (
                <Button
                  title={!identifyHasBeenClicked ? "Identify!" : "Loading..."}
                  onPress={this.requestPlantIdentification}
                />
              )}
            </View>
          )}
          {plantIdentified &&
            plantIdResponse.suggestions.map((suggestion) => {
              return (
                <View style={globalStyles.container}>
                  <Text>Suggestion: {suggestion.plant_name}</Text>
                  <Text>Probability: {suggestion.probability}</Text>
                </View>
              );
            })}
        </View>
      </ScrollView>
    );
  }
}

export default Browse;

const styles = StyleSheet.create({
  imgPreview: {
    width: 200,
    height: 200,
    borderRadius: 5,
  },
});
